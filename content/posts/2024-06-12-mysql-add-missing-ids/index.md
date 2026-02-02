---
author: isotopp
title: "MySQL: Add missing IDs"
date: "2024-04-21T05:06:07Z"
feature-img: assets/img/background/mysql.jpg
toc: true
tags:
- lang_en
- database
- mysql
- mysqldev
aliases:
  - /2024/06/12/mysql-add-missing-ids.md.html
---

A support question:
Somebody had a WordPress installation, in which a table had entries with an `id` column
that contained multiple entries with `0`.
The table was supposed to undergo a schema change where `id` becomes an actual primary key,
and `auto_increment`.
They needed to find all rows `WHERE id=0` and assign them unique `id` values.

Here is a test table:

```mysql
mysql> create table b ( id integer not null, d varchar(255));
Query OK, 0 rows affected (0.25 sec)

kris> insert into b values (0, "1"), (0, "2"), (3, "3");
Query OK, 3 rows affected (0.06 sec)
Records: 3  Duplicates: 0  Warnings: 0

kris> select * from b;
+----+------+
| id | d    |
+----+------+
|  0 | 1    |
|  0 | 2    |
|  3 | 3    |
+----+------+
3 rows in set (0.00 sec)
```

# The old, procedural fix

Define a variable `@x` and select the max value into it.

```mysql
mysql> select max(id) into @x from b;
Query OK, 1 row affected (0.00 sec)

mysql> select @x;
+------+
| @x   |
+------+
|    3 |
+------+
1 row in set (0.00 sec)
```

Now assign values to all `id` columns that are zero:

```mysql
mysql> update b set id = (@x := @x + 1) where id = 0;
Query OK, 2 rows affected, 1 warning (0.04 sec)
Rows matched: 2  Changed: 2  Warnings: 1

Warning (Code 1287): Setting user variables within expressions is deprecated 
and will be removed in a future release.
Consider alternatives: 
 'SET variable=expression, ...',  or 
 'SELECT expression(s) INTO variables(s)'.

mysql> select * from b;
+----+------+
| id | d    |
+----+------+
|  4 | 1    |
|  5 | 2    |
|  3 | 3    |
+----+------+
3 rows in set (0.01 sec)
```

While this still worked, not only is it butt ugly, it is also deprecated and will stop to work in the future.
But it is fast, and with an index on `id` can profit from that for a speedup.

# Using Window Functions

We will be defining a Common Table Expression that defines the currently maximum `id` value,
and that assigns row numbers to all rows with `id=0`.

A query that finds the maximum id:

```mysql
mysql> select max(id) as max_id from b;
+--------+
| max_id |
+--------+
|      3 |
+--------+
1 row in set (0.00 sec)
```

A query that assigns rows numbers using window functions:
```mysql
mysql> select id, d, row_number() over (order by id) as rn from b where id = 0;
+----+------+----+
| id | d    | rn |
+----+------+----+
|  0 | 1    |  1 |
|  0 | 2    |  2 |
+----+------+----+
2 rows in set (0.00 sec)
```

A CTE that combines all this with an update statement:

```mysql
WITH max_id_cte AS (
    SELECT MAX(id) AS max_id FROM b
),
rows_with_id_zero AS (
    SELECT
        id,
        d,
        ROW_NUMBER() OVER (ORDER BY id) AS rn
    FROM b
    WHERE id = 0
)
UPDATE b
JOIN (
    SELECT
        id,
        d,
        (rn + max_id) AS new_id
    FROM rows_with_id_zero, max_id_cte
) AS subquery
ON b.id = subquery.id AND b.d = subquery.d
SET b.id = subquery.new_id;
```

This defines a `WITH` statement (a common table expression) defining a single row,
single column query that holds the maximum id value `max_id_cte.max_id`,
and a second column that holds all rows with `id=0` with a row number `rows_with_id_zero.rn` using window functions.

These values are used in a `UPDATE` statement, with a join against a subquery containing `rows_with_id_zero`.
This has to do a full row comparison for the join (`ON b.col = subquery.col` for all columns),
because the table has no primary key, so value comparison is the only option.

It then assigns the row number calculated based on `max_id + rn` to `b.id`.

The plan for that is straight out of hell, though.
The procedural method is much better.

```mysql
mysql> explain WITH ...;
+----+-------------+------------+------------+--------+---------------+------+---------+------+------+----------+-----------------------------+
| id | select_type | table      | partitions | type   | possible_keys | key  | key_len | ref  | rows | filtered | Extra                       |
+----+-------------+------------+------------+--------+---------------+------+---------+------+------+----------+-----------------------------+
|  1 | PRIMARY     | <derived4> | NULL       | system | NULL          | NULL | NULL    | NULL |    1 |   100.00 | NULL                        |
|  1 | PRIMARY     | <derived3> | NULL       | ALL    | NULL          | NULL | NULL    | NULL |    2 |   100.00 | NULL                        |
|  1 | UPDATE      | b          | NULL       | ALL    | NULL          | NULL | NULL    | NULL |    3 |    33.33 | Using where                 |
|  4 | DERIVED     | b          | NULL       | ALL    | NULL          | NULL | NULL    | NULL |    3 |   100.00 | NULL                        |
|  3 | DERIVED     | b          | NULL       | ALL    | NULL          | NULL | NULL    | NULL |    3 |    33.33 | Using where; Using filesort |
+----+-------------+------------+------------+--------+---------------+------+---------+------+------+----------+-----------------------------+
5 rows in set, 2 warnings (0.04 sec)

```

There must be a way to get a plan that is linear,
as the job can be done linearly – we have shown that with the `set` method above.

We define an index on all non-`id` columns (here: `d`), with `id` as the implicit suffix, because InnoDB:

```mysql
mysql> alter table b add index (d); -- add index(d, id)
Query OK, 0 rows affected (0.23 sec)
Records: 0  Duplicates: 0  Warnings: 0

mysql> explain with ...
+----+-------------+------------+------------+--------+---------------+------+---------+---------------------+------+----------+-----------------------------+
| id | select_type | table      | partitions | type   | possible_keys | key  | key_len | ref                 | rows | filtered | Extra                       |
+----+-------------+------------+------------+--------+---------------+------+---------+---------------------+------+----------+-----------------------------+
|  1 | PRIMARY     | <derived4> | NULL       | system | NULL          | NULL | NULL    | NULL                |    1 |   100.00 | NULL                        |
|  1 | PRIMARY     | <derived3> | NULL       | ALL    | NULL          | NULL | NULL    | NULL                |    2 |   100.00 | Using where                 |
|  1 | UPDATE      | b          | NULL       | ref    | d             | d    | 1023    | rows_with_id_zero.d |    1 |    33.33 | Using where                 |
|  4 | DERIVED     | b          | NULL       | ALL    | NULL          | NULL | NULL    | NULL                |    3 |   100.00 | NULL                        |
|  3 | DERIVED     | b          | NULL       | ALL    | NULL          | NULL | NULL    | NULL                |    3 |    33.33 | Using where; Using filesort |
+----+-------------+------------+------------+--------+---------------+------+---------+---------------------+------+----------+-----------------------------+
5 rows in set, 2 warnings (0.03 sec)
```

Better, but not good enough.
We define an index on the entire table, duplicating it in the index in sorted order:

```mysql
mysql> alter table b drop index d, add index (id, d);
Query OK, 0 rows affected (0.23 sec)
Records: 0  Duplicates: 0  Warnings: 0

mysql> explain WITH ...
+----+-------------+------------+------------+--------+---------------+------+---------+------------------------------------------+------+----------+------------------------------+
| id | select_type | table      | partitions | type   | possible_keys | key  | key_len | ref                                      | rows | filtered | Extra                        |
+----+-------------+------------+------------+--------+---------------+------+---------+------------------------------------------+------+----------+------------------------------+
|  1 | PRIMARY     | <derived4> | NULL       | system | NULL          | NULL | NULL    | NULL                                     |    1 |   100.00 | NULL                         |
|  1 | PRIMARY     | <derived3> | NULL       | ALL    | NULL          | NULL | NULL    | NULL                                     |    2 |   100.00 | Using where                  |
|  1 | UPDATE      | b          | NULL       | ref    | id            | id   | 1027    | rows_with_id_zero.id,rows_with_id_zero.d |    1 |   100.00 | NULL                         |
|  4 | DERIVED     | NULL       | NULL       | NULL   | NULL          | NULL | NULL    | NULL                                     | NULL |     NULL | Select tables optimized away |
|  3 | DERIVED     | b          | NULL       | ref    | id            | id   | 4       | const                                    |    2 |   100.00 | Using index; Using filesort  |
+----+-------------+------------+------------+--------+---------------+------+---------+------------------------------------------+------+----------+------------------------------+
5 rows in set, 2 warnings (0.01 sec)
```

That's decent, but creating that index is hellishly expensive compared to a simple counter and a single full table scan.
