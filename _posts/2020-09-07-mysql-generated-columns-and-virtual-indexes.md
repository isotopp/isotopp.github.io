---
layout: post
title:  'MySQL: Generated Columns and virtual indexes'
author-id: isotopp
feature-img: assets/img/background/mysql.jpg
date: 2020-09-07 18:52:18 +0200
tags:
- lang_en
- mysql
- mysqldev
- database
- erklaerbaer
---
We have had a look at [how MySQL 8 handles JSON]({% link _posts/2020-09-04-mysql-json-data-type.md %}) recently, but with all those JSON functions and expressions it is clear that many JSON accesses cannot be fast. To grab data from a JSON column, you will use a lot of `$->>field` expressions and similar, and without indexes nothing of this will be fast.

JSON cannot be indexed.

But MySQL 8 offers another feature that comes in handy: Generated columns and indexes on those. Let's look at the parts, step by step, and how to make them work, because they are useful even outside of the context of JSON.

## An example table

For the following example we are going to define a table `t1` with an integer id and two integer data fields, `a` and `b`. We will be filling it with random integers up to 999 for the data values:

```sql
mysql]> create table t1 (
->   id integer not null primary key auto_increment,
->    a integer,
->    b integer
-> );
Query OK, 0 rows affected (0.07 sec)

mysql> insert into t1 ( id, a, b) values (NULL, ceil(rand()*1000), ceil(rand()*1000));
Query OK, 1 row affected (0.01 sec)

mysql> insert into t1 (id, a, b) select NULL,  ceil(rand()*1000), ceil(rand()*1000) from t1;
Query OK, 1 row affected (0.01 sec)
Records: 1  Duplicates: 0  Warnings: 0
...
mysql> insert into t1 (id, a, b) select NULL,  ceil(rand()*1000), ceil(rand()*1000) from t1;
Query OK, 524288 rows affected (6.83 sec)
Records: 524288  Duplicates: 0  Warnings: 0

mysql> select count(*) from t1;
+----------+
| count(*) |
+----------+
|  1048576 |
+----------+
1 row in set (0.04 sec)
```

## Generated columns

A generated column is a column with values that are calculated from a deterministic expression provided in the column definition. It has the usual name and type, and then a `GENERATED ALWAYS AS ()` term. The parentheses are part of the syntax and cannot be left off. The `GENERATED ALWAYS` is optional, and we are going to leave it off, because we are lazy.

The column can be `VIRTUAL`, in which case the expression is evaluated when reading every time a value is needed, or `STORED`, in which case the value is materialized and stored on write.

In may also contain inline index definition and a column comment.

### VIRTUAL generated columns

So we get our trivial example:

```sql
mysql> alter table t1 add column c integer as ( a+b ) virtual;
Query OK, 0 rows affected (0.11 sec)
Records: 0  Duplicates: 0  Warnings: 0

mysql> select * from t1 limit 3;
+----+------+------+------+
| id | a    | b    | c    |
+----+------+------+------+
|  1 |  997 |  808 | 1805 |
|  2 |   51 |  831 |  882 |
|  3 |  998 |  499 | 1497 |
+----+------+------+------+
3 rows in set (0.00 sec)
```

That was fast - the table definition is changed, but because the column is `VIRTUAL`, no data values need to be changed. Instead, the data is calculated on read access. We could have written our sample read as `SELECT id, a, b, a+b AS c FROM t1 LIMIT 3` for the same effect, because that is what happened.

We may even store that statement in a view and then call it, and that's effectively the same:

```sql
mysql> create view v1 as select id, a, b, a+b as c from t1;
Query OK, 0 rows affected (0.03 sec)

mysql> select * from v1 limit 3;
+----+------+------+------+
| id | a    | b    | c    |
+----+------+------+------+
|  1 |  997 |  808 | 1805 |
|  2 |   51 |  831 |  882 |
|  3 |  998 |  499 | 1497 |
+----+------+------+------+
3 rows in set (0.00 sec)
```

Well, not quite. Let's explain the same query on `t1` and `v1` and see what the optimizer has to say:

```sql
mysql> explain select * from t1 where c<50\G
           id: 1
  select_type: SIMPLE
        table: t1
   partitions: NULL
         type: ALL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: 1046904
     filtered: 33.33
        Extra: Using where
1 row in set, 1 warning (0.00 sec)

Note (Code 1003): /* select#1 */ select `kris`.`t1`.`id` AS `id`,`kris`.`t1`.`a` AS `a`,`kris`.`t1`.`b` AS `b`,`kris`.`t1`.`c` AS `c` from `kris`.`t1` where (`kris`.`t1`.`c` < 50)

mysql> explain select * from v1 where c<50\G
           id: 1
  select_type: SIMPLE
        table: t1
   partitions: NULL
         type: ALL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: 1046904
     filtered: 100.00
        Extra: Using where
1 row in set, 1 warning (0.00 sec)

Note (Code 1003): /* select#1 */ select `kris`.`t1`.`id` AS `id`,`kris`.`t1`.`a` AS `a`,`kris`.`t1`.`b` AS `b`,(`kris`.`t1`.`a` + `kris`.`t1`.`b`) AS `c` from `kris`.`t1` where ((`kris`.`t1`.`a` + `kris`.`t1`.`b`) < 50)
```

The output differs slightly in two places: the estimate given for filtered is different, and the view "sees" and exposes the definition for `c` as `a+b` in the reparsed statement in the "Note" section.

Further down we will also see how the generated column can be indexed, while the statement expression can not - and that in the end what makes the key difference in performance.

### STORED generated columns

Let's flip from `VIRTUAL` to `STORED` and see what happens. We drop the old definition of `c`, and re-add the same one, but with a `STORED` attribute.

```sql
mysql> alter table t1 drop column c, add column c integer as (a+b) stored;
Query OK, 1048576 rows affected (6.27 sec)
Records: 1048576  Duplicates: 0  Warnings: 0
```

If we looked at the average row length in `INFORMATION_SCHEMA.TABLES`, we would see it as a bit longer (but as is usual with I_S.TABLES output for small and narrow tables, the values are a bit off).

We also see the `ALTER TABLE` now takes actual time, proportional to the table size. What happened is that the values for `c` now get materialized on write, as if we defined a `BEFORE INSERT` trigger maintaining the values in `c`.

### Trying to write to a generated column fails (except when it doesn't)

`VIRTUAL`and `STORED` don't matter: you can't write to generated columns:

```sql
mysql> update t1 set c = 17 where id = 3;
ERROR 3105 (HY000): The value specified for generated column 'c' in table 't1' is not allowed.

mysql> replace into t1 set id=3, c=17;
ERROR 3105 (HY000): The value specified for generated column 'c' in table 't1' is not allowed.
```

With one exception:

```sql
mysql> update t1 set c=default where id = 3;
Query OK, 0 rows affected (0.00 sec)
Rows matched: 1  Changed: 0  Warnings: 0
```

So if you aren't actually writing to `c`, you are allowed to write to `c`. That sounds stupid until you define a view on `t1` that includes `c` and is considered updatable - by allowing this construct, it stays updatable, even if it includes `c`.

Filling in the correct value is not the same as `default` and does not work:

```sql
mysql> select * from t1 limit 1;
+----+------+------+------+
| id | a    | b    | c    |
+----+------+------+------+
|  1 |  997 |  808 | 1805 |
+----+------+------+------+
1 row in set (0.00 sec)

mysql> update t1 set c=1805 where id=1;
ERROR 3105 (HY000): The value specified for generated column 'c' in table 't1' is not allowed.
```

### Caution: CREATE TABLE ... AS SELECT vs. generated columns

We already know (I hope) that `CREATE TABLE ... AS SELECT` is of the devil and should not be used to copy table definitions: It creates a table from the result set of the select statement, which is most definitively not the definition of the original table.

We have seen this fail already with indexes and foreign key definitions, and in case you didn't, here is what I mean:

```sql
mysql> create table sane ( id integer not null primary key auto_increment, t1id integer, foreign key (t1id) references t1(i
d) );
Query OK, 0 rows affected (0.06 sec)

mysql> show create table sane\G
       Table: sane
Create Table: CREATE TABLE `sane` (
  `id` int NOT NULL AUTO_INCREMENT,
  `t1id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `t1id` (`t1id`),
  CONSTRAINT `sane_ibfk_1` FOREIGN KEY (`t1id`) REFERENCES `t1` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
1 row in set (0.00 sec)

mysql> insert into sane values (1, 1), (2, 2), (3, 3), (4, 4);
Query OK, 4 rows affected (0.01 sec)
Records: 4  Duplicates: 0  Warnings: 0

mysql> create table broken as select * from sane;
Query OK, 4 rows affected (0.07 sec)
Records: 4  Duplicates: 0  Warnings: 0

mysql> show create table broken\G
       Table: broken
Create Table: CREATE TABLE `broken` (
  `id` int NOT NULL DEFAULT '0',
  `t1id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
1 row in set (0.01 sec)
```

`broken` is most decidedly not the same table as `sane`. The definition of `broken` has been inferred from the format of the result set, which may or may not have the same types as the base table(s). It also has no indexes and no constraints.

The correct way to copy a table definition is `CREATE TABLE ... LIKE ...` and then move the data with `INSERT ... SELECT ...`. You still have to move the foreign key constraints manually, though:

```sql
mysql> create table unbroken like sane;
Query OK, 0 rows affected (0.10 sec)

mysql> insert into unbroken select * from sane;
Query OK, 4 rows affected (0.01 sec)
Records: 4  Duplicates: 0  Warnings: 0

mysql> show create table unbroken\G
       Table: unbroken
Create Table: CREATE TABLE `unbroken` (
  `id` int NOT NULL AUTO_INCREMENT,
  `t1id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `t1id` (`t1id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
1 row in set (0.00 sec)
```

And here is how it works with generated columns:

```sql
mysql> create table t2 as select * from t1;
Query OK, 1048576 rows affected (14.89 sec)
Records: 1048576  Duplicates: 0  Warnings: 0

mysql> show create table t2\G
       Table: t2
Create Table: CREATE TABLE `t2` (
  `id` int NOT NULL DEFAULT '0',
  `a` int DEFAULT NULL,
  `b` int DEFAULT NULL,
  `c` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
1 row in set (0.00 sec)
```

`CREATE TABLE ... AS SELECT ...` defined a table from the result set of the select clause, and the fact that `c` is generated is completely lost. So we now have a normal 4-column table.

So, how about `CREATE TABLE ... LIKE ...`?

```sql
mysql> drop table t2;
Query OK, 0 rows affected (0.08 sec)

mysql> create table t2 like t1;
Query OK, 0 rows affected (0.10 sec)

mysql> show create table t2\G
       Table: t2
Create Table: CREATE TABLE `t2` (
  `id` int NOT NULL AUTO_INCREMENT,
  `a` int DEFAULT NULL,
  `b` int DEFAULT NULL,
  `c` int GENERATED ALWAYS AS ((`a` + `b`)) STORED,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
1 row in set (0.00 sec)
```

Yes! Success! Ok, now the data:


```sql
mysql> insert into t2 select * from t1;
ERROR 3105 (HY000): The value specified for generated column 'c' in table 't2' is not allowed.
```

Oh, right.

```sql
mysql> insert into t2 select id, a, b from t1;
ERROR 1136 (21S01): Column count doesn't match value count at row 1
```

Awww, yes. Okay, the full monty:

```sql
mysql> insert into t2 (id, a, b) select id, a, b from t1;
```

Finally.

Ok, copying data between tables with generated columns requires a bit more engineering than a mindless `INSERT ... SELECT *`. The rules are not unexpected, we have explored them right above, still...

### The wrong data type

Ok, let's get a bit mean. What happens when we define `c tinyint as (a+b) virtual` so that the values exceed the range possible in a signed single bit value?

```sql
mysql> select * from t1 limit 3;
+----+------+------+------+
| id | a    | b    | c    |
+----+------+------+------+
|  1 |  997 |  808 | 1805 |
|  2 |   51 |  831 |  882 |
|  3 |  998 |  499 | 1497 |
+----+------+------+------+
3 rows in set (0.00 sec)

mysql> alter table t1 drop column c, add column c tinyint as (a+b) virtual;
ERROR 1264 (22003): Out of range value for column 'c' at row 1
```

Oh, they are on to us!?!? Are they?

They are not when we do it in two steps:

```sql
mysql> alter table t1 drop column c;
Query OK, 0 rows affected (9.24 sec)
Records: 0  Duplicates: 0  Warnings: 0

mysql> alter table t1 add column c tinyint as (a+b) virtual;
Query OK, 0 rows affected (0.08 sec)
Records: 0  Duplicates: 0  Warnings: 0

mysql> select * from t1 limit 3;
+----+------+------+------+
| id | a    | b    | c    |
+----+------+------+------+
|  1 |  997 |  808 |  127 |
|  2 |   51 |  831 |  127 |
|  3 |  998 |  499 |  127 |
+----+------+------+------+
3 rows in set (0.00 sec)
```

It clips the values according to the rules that MySQL always had, and that ate so much data.

Now, let's `CREATE TABLE ... AS SELECT` again:

```sql
mysql> drop table broken;
Query OK, 0 rows affected (0.07 sec)

mysql> create table broken as select * from t1;
ERROR 1264 (22003): Out of range value for column 'c' at row 2
Error (Code 1264): Out of range value for column 'c' at row 2
Error (Code 1030): Got error 1 - 'Operation not permitted' from storage engine
```

Wow. No less than three error messages. At least they mention the column `c` and the word "range", so we kind of can have an idea what goes on. Still, this is only medium helpful and initially confusing.

What happens, and why?

```sql
mysql> select @@sql_mode;
+--------------------------------------------+
| @@sql_mode                                 |
+--------------------------------------------+
| STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION |
+--------------------------------------------+
1 row in set (0.00 sec)

mysql> set sql_mode = "";
Query OK, 0 rows affected (0.00 sec)

mysql> create table broken as select * from t1;
...
Warning (Code 1264): Out of range value for column 'c' at row 1028
Warning (Code 1264): Out of range value for column 'c' at row 1029
Warning (Code 1264): Out of range value for column 'c' at row 1030
```

`SQL_MODE` helpfully detected the problem and prevented data loss. As usual, `SQL_MODE` was as useless as it was helpful - while it prevented data loss, it did not directly point us into the right direction with its error messages.

By turning off `SQL_MODE` we get the clipped values copied and a bunch of warnings that everybody ignores all of the time, anyway, so I guess it's an improvement.

### Allowed and disallowed functions

For generated columns to work it is a requirement that the functions are deterministic, idempotent and side-effect free. All user defined functions and stored functions are disallowed, and the usual suspects from the set of builtins are also out:

```sql
mysql> create table testme (id integer not null primary key auto_increment, a integer, b integer, c integer as (sleep(2)));
ERROR 3763 (HY000): Expression of generated column 'c' contains a disallowed function: sleep.
mysql> create table testme (id integer not null primary key auto_increment, a integer, b integer, c integer as (uuid()));
ERROR 3763 (HY000): Expression of generated column 'c' contains a disallowed function: uuid.
mysql> create table testme (id integer not null primary key auto_increment, a integer, b integer, c integer as (rand()));
ERROR 3763 (HY000): Expression of generated column 'c' contains a disallowed function: rand.
mysql> create table testme (id integer not null primary key auto_increment, a integer, b integer, c integer as (now()));
ERROR 3763 (HY000): Expression of generated column 'c' contains a disallowed function: now.
mysql> create table testme (id integer not null primary key auto_increment, a integer, b integer, c integer as (connection_id()));
ERROR 3763 (HY000): Expression of generated column 'c' contains a disallowed function: connection_id.
mysql> create table testme (id integer not null primary key auto_increment, a integer, b integer, c integer as (last_insert_id()));
ERROR 3763 (HY000): Expression of generated column 'c' contains a disallowed function: last_insert_id.


mysql> set @c := 1;
Query OK, 0 rows affected (0.00 sec)
mysql> create table testme (id integer not null primary key auto_increment, a integer, b integer, c integer as (@c));
ERROR 3772 (HY000): Default value expression of column 'c' cannot refer user or system variables.

mysql> create table testme (id integer not null primary key auto_increment, a integer, b integer, c integer as (id));
ERROR 3109 (HY000): Generated column 'c' cannot refer to auto-increment column.

mysql> create table testme (id integer not null primary key auto_increment, a integer, b integer, c integer as (a));
Query OK, 0 rows affected (0.09 sec)
mysql> alter table testme change column a x integer;
ERROR 3108 (HY000): Column 'a' has a generated column dependency.
mysql> alter table testme drop column c, change column a x integer, add column c integer as (x);
Query OK, 0 rows affected (0.21 sec)
Records: 0  Duplicates: 0  Warnings: 0
```

From the final example above we learn that it is also impossible to change the existing definition of any column that is used by a generated column definition. We need to drop the generated column, change the definition of the base columns and then recreate the generated column.

For `VIRTUAL` columns that is cheap, for `STORED` - less so.

## Secondary indexes and generated columns

So far, so nice. Now let's cash in on this: Indexes, we have them. At least secondary indexes:

```sql
mysql> create table wtf ( b integer not null,  id integer as (b) not null primary key);
ERROR 3106 (HY000): 'Defining a virtual generated column as primary key' is not supported for generated columns.

mysql> show create table t1\G
       Table: t1
Create Table: CREATE TABLE `t1` (
  `id` int NOT NULL AUTO_INCREMENT,
  `a` int DEFAULT NULL,
  `b` int DEFAULT NULL,
  `c` int GENERATED ALWAYS AS ((`a` + `b`)) VIRTUAL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1376221 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
1 row in set (0.00 sec)

mysql> alter table t1 add index(c);
Query OK, 0 rows affected (5.62 sec)
Records: 0  Duplicates: 0  Warnings: 0
```

As expected, adding the index takes time, even if the column `c` is `VIRTUAL`: For an index we extract the indexed values from the table, sort them and store them together with pointers to the base row in the (secondary) index tree. In InnoDB, the pointer to the base row always is the primary key, so what we get in the index is actually pairs of `(c, id)`.

We can prove that: 

1. Queries for `c` can be answered from the index. The index is called *covering*, it saves us chasing the row pointer and an access to the actual row. In an `EXPLAIN` we see this being indicated with `using index`.
2. Queries for `c` and `id` should also be *covering*: the queried values are all present in the index so that going to the base row is unnecessary.
3. Querying for `c` and `a` is not covering, so the `using index` should be gone.

And indeed:

```sql
mysql> explain select c from t1 where c < 50\G
...
possible_keys: c
          key: c
...
         rows: 1257
        Extra: Using where; Using index
1 row in set, 1 warning (0.00 sec)

Note (Code 1003): /* select#1 */ select `kris`.`t1`.`c` AS `c` from `kris`.`t1` where (`kris`.`t1`.`c` < 50)

mysql> explain select c, id from t1 where c < 50\G
          key: c
...
        Extra: Using where; Using index
1 row in set, 1 warning (0.00 sec)

Note (Code 1003): /* select#1 */ select `kris`.`t1`.`c` AS `c`,`kris`.`t1`.`id` AS `id` from `kris`.`t1` where (`kris`.`t1`.`c` < 50)
mysql> explain select c, a from t1 where c < 50\G
...
possible_keys: c
          key: c
...
        Extra: Using where
1 row in set, 1 warning (0.00 sec)

Note (Code 1003): /* select#1 */ select `kris`.`t1`.`id` AS `id`,`kris`.`t1`.`a` AS `a`,`kris`.`t1`.`b` AS `b`,`kris`.`t1`.`c` AS `c` from `kris`.`t1` where (`kris`.`t1`.`c` < 50)
```

As predicted, the final query for `c`, `a` cannot be covering and is missing the `using index` notice in the Extra column. This is still a good query: it is considering and using the index on `c` - the index alone is just not sufficient to resolve the query.

This should give us an idea about how to design:

In almost all cases `STORED` columns will not be paying off. They use disk space, and still need to evaluate the expression at least once for storage. If indexed, they will use disk space in the index a second time - the column is actually materialized twice, in the table in primary key order and the index in index order.

`STORED` generated columns make sense only if the expression is complicated and slow to calculate. But with the set of functions available to us that is hardly going to be the case, ever. So unless the expression is being evaluated really often the cost for the storage is not ever amortized.

Even then, for generated columns `STORED` and `VIRTUAL`, many queries can probably be answered leveraging an index on the generated column so that we might try to get away with `VIRTUAL` columns all of the time.

### Generated columns and the Optimizer

The optimizer is aware of the generated column definitions, and can leverage them, as long as they match:

```sql
mysql> show create table t1\G
       Table: t1
Create Table: CREATE TABLE `t1` (
  `id` int NOT NULL AUTO_INCREMENT,
  `a` int DEFAULT NULL,
  `b` int DEFAULT NULL,
  `c` int GENERATED ALWAYS AS ((`a` + `b`)) VIRTUAL,
  PRIMARY KEY (`id`),
  KEY `c` (`c`)
) ENGINE=InnoDB AUTO_INCREMENT=1376221 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
1 row in set (0.00 sec)

mysql> explain select a+b from t1 where a+b<50\G
*************************** 1. row ***************************
           id: 1
  select_type: SIMPLE
        table: t1
   partitions: NULL
         type: range
possible_keys: c
          key: c
      key_len: 5
          ref: NULL
         rows: 1257
     filtered: 100.00
        Extra: Using where
1 row in set, 1 warning (0.00 sec)

Note (Code 1003): /* select#1 */ select (`kris`.`t1`.`a` + `kris`.`t1`.`b`) AS `a+b` from `kris`.`t1` where (`kris`.`t1`.`c` < 50)
```

The optimizer is still the MySQL optimizer we all love to hate, so you have to be pretty literal for the match:

```sql
mysql> explain select b+a from t1 where b+a<50\G
*************************** 1. row ***************************
           id: 1
  select_type: SIMPLE
        table: t1
   partitions: NULL
         type: ALL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: 1046422
     filtered: 100.00
        Extra: Using where
1 row in set, 1 warning (0.00 sec)

Note (Code 1003): /* select#1 */ select (`kris`.`t1`.`b` + `kris`.`t1`.`a`) AS `b+a` from `kris`.`t1` where ((`kris`.`t1`.`b` + `kris`.`t1`.`a`) < 50)
```

Yup, no canonicalization, for reasons.

## Making it work with JSON

That's a long article. Do you still remember how we started?

> JSON cannot be indexed.

Well, now it can and you know how.

```sql
mysql> show create table t\G
       Table: t
Create Table: CREATE TABLE `t` (
  `id` int NOT NULL AUTO_INCREMENT,
  `j` json DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
1 row in set (0.00 sec)

mysql> select * from t;
+----+-------------------------------------------------------+
| id | j                                                     |
+----+-------------------------------------------------------+
|  1 | {"home": "/home/kris", "paid": false, "user": "kris"} |
|  2 | {"home": "/home/sven", "paid": false, "user": "sven"} |
|  3 | false                                                 |
+----+-------------------------------------------------------+
3 rows in set (0.00 sec)

mysql> alter table t add column user varchar(80) as (j->'$.user') virtual, add index (user);
Query OK, 0 rows affected (0.10 sec)
Records: 0  Duplicates: 0  Warnings: 0

mysql> select user, id from t;
+--------+----+
| user   | id |
+--------+----+
| NULL   |  3 |
| "kris" |  1 |
| "sven" |  2 |
+--------+----+
3 rows in set (0.00 sec)

mysql> explain select id, j from t where id = 1\G
*************************** 1. row ***************************
           id: 1
  select_type: SIMPLE
        table: t
   partitions: NULL
         type: const
possible_keys: PRIMARY
          key: PRIMARY
      key_len: 4
          ref: const
         rows: 1
     filtered: 100.00
        Extra: NULL
1 row in set, 1 warning (0.00 sec)

Note (Code 1003): /* select#1 */ select '1' AS `id`,'{"home": "/home/kris", "paid": false, "user": "kris"}' AS `j` from `kris`.`t` where true
```

Yay, `ref: const`, primary key lookup in the optimizer and we did not even have a query to run.

## Summary

We have been looking at the two flavors of generated columns, and how they can make our life easier in many ways. We have been looking at various pitfalls with respect to copying data and table definitions around. We have been learning about indexing generated columns, and how the optimizer can leverage indexes even against the expressions defined in generated columns.

Finally we put the parts together and made JSON data lookups fast.

This should give us a number of ideas in terms of sensible table design around JSON. Often we use JSON for variable-ish data while we explore a data model. Then a JSON schema solidifies, and we can leverage values we require and rely on by putting them into generated columns and index these, then use these for search and access. 

Eventually we may extract the columns from the variable JSON part of the schema completely and turn them into actually statically typed columns of the SQL schema, because we require them all of the time.

This opens up a pathway to incremental schema design while at the same time being flexible enough to have bag style soft and denormalized data types where we need them.

## The Fine Manual

There is a lot more to all of this than I can show here. This means you have homework. Read the following manual pages:


- [CREATE TABLE and Generated Columns](https://dev.mysql.com/doc/refman/8.0/en/create-table-generated-columns.html)
  The basics in a single page.

- [Secondary Indexes and Generated Columns](https://dev.mysql.com/doc/refman/8.0/en/create-table-secondary-indexes.html)
  Indexing generated columns, with special considerations on indexing JSON

- [Optimizer Use of Generated Column Indexes](https://dev.mysql.com/doc/refman/8.0/en/generated-column-index-optimizations.html)
  We all love to hate the optimizer, but it has learned a lot of new tricks. Here's what it does understand.

- The CREATE INDEX statement and [multi valued indexes](https://dev.mysql.com/doc/refman/8.0/en/create-index.html#create-index-multi-valued)
  The entire page is useful, because it speaks about functional indexes and how they are implemented as hidden virtual columns and indexes on these (which has implications). But within the discussion of JSON, the interesting part are Multi-Valued Indexes, which are indexes on non-scalar values such as JSON arrays, and how they are being used to speed up certain JSON functions that deal with array membership and overlaps.

