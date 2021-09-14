---
layout: post
title:  'MySQL: Encoding fields for great profit.'
author-id: isotopp
feature-img: assets/img/background/mysql.jpg
date: 2020-09-18 17:39:10 +0200
tags:
- lang_en
- mysql
- database
- innodb
- erklaerbaer
- mysqldev
---
Iterating schemas over time is not an uncommon thing. Often requirements emerge only after you have data, and then directed action is possible. Consequently, working on existing data, and structuring and cleaning it up is a common task.

In todays example we work with a log table that logged state transitions of things in freeform `VARCHAR` fields. After some time the log table grew quite sizeable, and the log strings are repeated rather often, contributing to the overall size of the table considerably.

We are starting with this table:

```sql
CREATE TABLE `log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `device_id` int NOT NULL,
  `change_time` datetime NOT NULL,
  `old_state` varchar(64) NOT NULL,
  `new_state` varchar(64) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB
```

That is, our log table has an `id` field to allow individual row addressing, and then logs the state change of a `device_id` at a certain `change_time` from an `old_state` into a `new_state`. The two state fields are `varchar(64)` and contain one of some 13 or so different strings.

Maybe they also contain typos, outdated state codes or other stuff that will later needs remapping and cleanup, but in today example we want to concentrate on the cleanup.

Some small manual sample data:

```sql
mysql> select * from log;
+----+-----------+---------------------+---------------+---------------+
| id | device_id | change_time         | old_state     | new_state     |
+----+-----------+---------------------+---------------+---------------+
|  1 |        17 | 2020-09-18 18:06:37 | racked        | burn-in       |
|  2 |        17 | 2020-09-18 18:14:18 | burn-in       | provisionable |
|  3 |        17 | 2020-09-18 18:14:34 | provisionable | setup         |
|  4 |        17 | 2020-09-18 18:14:48 | setup         | installed     |
|  5 |        17 | 2020-09-18 18:14:56 | installed     | live          |
+----+-----------+---------------------+---------------+---------------+
5 rows in set (0.00 sec)
```

Let's build a list of all possible states from both columns, `old_state` and `new_state`. This is easily done. Using `old_state`, and we prepend a `NULL` column because we want to `INSERT ... SELECT ...` this later into a `map` table which will map the string to an `id` value. We will then encode the strings using exactly this value.

```sql
mysql> select NULL as id, 
->            old_state 
->       from log 
->   group by old_state;
+------+---------------+
| id   | old_state     |
+------+---------------+
| NULL | racked        |
| NULL | burn-in       |
| NULL | provisionable |
| NULL | setup         |
| NULL | installed     |
+------+---------------+
5 rows in set (0.00 sec)
```

Now using a `UNION` we extend it to `new_state` as well.

```sql
mysql]> select NULL as id, 
->             old_state 
->        from log 
->    group by old_state
-> union
->      select NULL as id, 
->             new_state 
->        from log 
->    group by new_state;
+------------+---------------+
| id         | old_state     |
+------------+---------------+
| 0x         | racked        |
| 0x         | burn-in       |
| 0x         | provisionable |
| 0x         | setup         |
| 0x         | installed     |
| 0x         | live          |
+------------+---------------+
6 rows in set (0.00 sec)
```

The result strings look good, but something happened to our `NULL` values. In the original statement they were still good, but in the `UNION` they get mangled.

The data types of the result table are derived from the values and their types in the first result set of the `UNION`. And `NULL` is not a good value to guess anything from.

So let's be more explicit about the types:

```sql
mysql> select cast(NULL as signed) as id, 
->            old_state as state
->       from log 
->   group by state
-> union
->     select cast(NULL as signed) as id, 
->            new_state as state
->       from log
->   group by state;
+------+---------------+
| id   | state         |
+------+---------------+
| NULL | racked        |
| NULL | burn-in       |
| NULL | provisionable |
| NULL | setup         |
| NULL | installed     |
| NULL | live          |
+------+---------------+
6 rows in set (0.00 sec)
```

This now works, and we can feed it into an `INSERT ... SELECT ...`.

```sql
mysql> show create table map\G
       Table: map
Create Table: CREATE TABLE `map` (
  `id` int NOT NULL AUTO_INCREMENT,
  `state` varchar(64) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB 

mysql> insert into map 
-> select cast(NULL as signed) as id, old_state as state from log group by state
-> union
-> select cast(NULL as signed) as id, new_state as state from log group by state;
Query OK, 6 rows affected (0.02 sec)
Records: 6  Duplicates: 0  Warnings: 0

mysql> select * from map;
+----+---------------+
| id | state         |
+----+---------------+
|  1 | racked        |
|  2 | burn-in       |
|  3 | provisionable |
|  4 | setup         |
|  5 | installed     |
|  6 | live          |
+----+---------------+
6 rows in set (0.00 sec)
```

Yay. A nice and autonumbered list of all possible states from the existing data. We need this indexed, and we also need indices on the two source columns.

```sql
mysql> alter table map add index(state);
Query OK, 0 rows affected (0.08 sec)
Records: 0  Duplicates: 0  Warnings: 0

mysql> alter table log add index(old_state), add index(new_state);
Query OK, 0 rows affected (0.08 sec)
Records: 0  Duplicates: 0  Warnings: 0
```

If we want to encode these two columns with id-Values from map, we need to add columns for that.

```sql
mysql> alter table log add column old_state_id integer not null after old_state,
->                     add column new_state_id integer not null after new_state;
```

We can now encode by looking up each `log.old_state` value in `map.state` and returning the matching `map.id` value. With this we should be able to construct an `UPDATE` statement that fills in the `log.old_state_id` column.

```sql
mysql> select map.id as old_state_id 
->       from map join log 
->         on map.state = log.old_state;
+--------------+
| old_state_id |
+--------------+
|            2 |
|            5 |
|            3 |
|            1 |
|            4 |
+--------------+
5 rows in set (0.00 sec)
```

Let's try this out in an `UPDATE`:

```sql
mysql> update log 
->        set log.old_state_id = ( 
->          select id from map where log.old_state = map.state
->        );
Query OK, 5 rows affected (0.02 sec)
Rows matched: 5  Changed: 5  Warnings: 0

mysql> update log 
->        set log.new_state_id = ( 
->          select id from map where log.new_state = map.state
->        );
Query OK, 5 rows affected (0.01 sec)
Rows matched: 5  Changed: 5  Warnings: 0

mysql> select * from log;
+----+-----------+---------------------+---------------+--------------+---------------+--------------+
| id | device_id | change_time         | old_state     | old_state_id | new_state     | new_state_id |
+----+-----------+---------------------+---------------+--------------+---------------+--------------+
|  1 |        17 | 2020-09-18 10:06:37 | racked        |            1 | burn-in       |            2 |
|  2 |        17 | 2020-09-18 10:14:18 | burn-in       |            2 | provisionable |            3 |
|  3 |        17 | 2020-09-18 10:14:34 | provisionable |            3 | setup         |            4 |
|  4 |        17 | 2020-09-18 10:14:48 | setup         |            4 | installed     |            5 |
|  5 |        17 | 2020-09-18 10:14:56 | installed     |            5 | live          |            6 |
+----+-----------+---------------------+---------------+--------------+---------------+--------------+
5 rows in set (0.00 sec)
```

So we update `log`, specifically setting each current `log.old_state_id` value to whatever is returned as matching, for this row, from the subselect we wrote. We then do the same, again, for the `new_state` column. The result is as shown, it works.

We now have two redundant columns and the indexes that go with them, and can drop these. Let's also check the new table structure, and validate the output by joining the id values for resolution against the map.

```sql
mysql> alter table log drop column old_state, drop column new_state;
Query OK, 0 rows affected (0.24 sec)
Records: 0  Duplicates: 0  Warnings: 0

mysql> show create table log\G
       Table: log
Create Table: CREATE TABLE `log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `device_id` int NOT NULL,
  `change_time` datetime NOT NULL,
  `old_state_id` int NOT NULL,
  `new_state_id` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
1 row in set (0.01 sec)

mysql> select * from log;
+----+-----------+---------------------+--------------+--------------+
| id | device_id | change_time         | old_state_id | new_state_id |
+----+-----------+---------------------+--------------+--------------+
|  1 |        17 | 2020-09-18 10:06:37 |            1 |            2 |
|  2 |        17 | 2020-09-18 10:14:18 |            2 |            3 |
|  3 |        17 | 2020-09-18 10:14:34 |            3 |            4 |
|  4 |        17 | 2020-09-18 10:14:48 |            4 |            5 |
|  5 |        17 | 2020-09-18 10:14:56 |            5 |            6 |
+----+-----------+---------------------+--------------+--------------+
5 rows in set (0.00 sec)

mysql> select log.id, 
->            log.device_id, 
->            log.change_time, 
->            oldmap.state as old_state, 
->            newmap.state as new_state 
->       from log join map as oldmap 
->         on log.old_state_id = oldmap.id 
->       join map as newmap 
->         on log.new_state_id = newmap.id;
+----+-----------+---------------------+---------------+---------------+
| id | device_id | change_time         | old_state     | new_state     |
+----+-----------+---------------------+---------------+---------------+
|  1 |        17 | 2020-09-18 10:06:37 | racked        | burn-in       |
|  2 |        17 | 2020-09-18 10:14:18 | burn-in       | provisionable |
|  3 |        17 | 2020-09-18 10:14:34 | provisionable | setup         |
|  4 |        17 | 2020-09-18 10:14:48 | setup         | installed     |
|  5 |        17 | 2020-09-18 10:14:56 | installed     | live          |
+----+-----------+---------------------+---------------+---------------+
5 rows in set (0.00 sec)
```

Note that we have to join against the map twice, once for each source column, and that also means we have to rename the map table to get unique names for each usage.

Well, that's a toy example. Let's do that at scale, using a Python driver implementing exactly this procedure. [Code is on github.com](https://github.com/isotopp/mysql-dev-examples/blob/master/mysql-lookups/lookups.py).

We [set up our source tables](https://github.com/isotopp/mysql-dev-examples/blob/master/mysql-lookups/lookups.py#L95-L102) by going over the table creation statements in the [sql_setup list](https://github.com/isotopp/mysql-dev-examples/blob/master/mysql-lookups/lookups.py#L19-L23).

We are also defining a [list of possible states](https://github.com/isotopp/mysql-dev-examples/blob/master/mysql-lookups/lookups.py#L25-L39), and in a [data generation loop](https://github.com/isotopp/mysql-dev-examples/blob/master/mysql-lookups/lookups.py#L77-L93) fill the log table with many state transitions from random devices. Note that we do not really care much about matching source and target states, so the transitions are really random jumps. We commit once every `statecount` many rows (once for each device) to make it a bit faster.

In a [prepare_log_transformation](https://github.com/isotopp/mysql-dev-examples/blob/master/mysql-lookups/lookups.py#L48-L53) function we basically add the missing columns and indexes, then in perform_log_transformation, [populate the map](https://github.com/isotopp/mysql-dev-examples/blob/master/mysql-lookups/lookups.py#L57-L60) and [encode the log](https://github.com/isotopp/mysql-dev-examples/blob/master/mysql-lookups/lookups.py#L62-L68).

Finally, in [finish_log_transformation](https://github.com/isotopp/mysql-dev-examples/blob/master/mysql-lookups/lookups.py#L70-L75), we drop the unneeded columns and also implicitly any indices defined on them.

On my super slow test machine, filling the table with a million rows from a thousand devices yields a 64M data file after 2 minutes. I have some 59M of data, and a bit of empty space:

```console
$ time ./lookups.py create-log-data --devicecount 1000 --statecount 1000

real	2m9.729s
user	0m30.487s
sys	0m7.536s

$ ls -l /var/lib/mysql/kris/log.ibd
-rw-r----- 1 mysql mysql  64M Sep 18 12:27 log.ibd

mysql> select * from information_schema.tables where table_name = "log"\G
  TABLE_CATALOG: def
   TABLE_SCHEMA: kris
     TABLE_NAME: log
     TABLE_TYPE: BASE TABLE
         ENGINE: InnoDB
        VERSION: 10
     ROW_FORMAT: Dynamic
     TABLE_ROWS: 998347
 AVG_ROW_LENGTH: 59
    DATA_LENGTH: 59326464
MAX_DATA_LENGTH: 0
   INDEX_LENGTH: 0
      DATA_FREE: 4194304
 AUTO_INCREMENT: 1000001
    CREATE_TIME: 2020-09-18 12:24:50
    UPDATE_TIME: 2020-09-18 12:27:05
     CHECK_TIME: NULL
TABLE_COLLATION: utf8mb4_0900_ai_ci
       CHECKSUM: NULL
 CREATE_OPTIONS:
  TABLE_COMMENT:
1 row in set (0.00 sec)
```

The file size will go up to 132M in the transformation step, most of that is from the indexing we add.

```console
$ time ./lookups.py prepare-log-transformation
Adding id columns and indexes

real    0m24.395s
user    0m0.050s
sys     0m0.004s

$ time ./lookups.py perform-log-transformation
Populating map
Converting old_states
Converting new_states

real    0m39.729s
user    0m0.050s
sys     0m0.008s

$ ls -l /var/lib/mysql/kris/log.ibd
-rw-r----- 1 mysql mysql 132M Sep 18 12:31 log.ibd

mysql> select * from information_schema.tables where table_name = "log"\G
  TABLE_CATALOG: def
   TABLE_SCHEMA: kris
     TABLE_NAME: log
     TABLE_TYPE: BASE TABLE
         ENGINE: InnoDB
        VERSION: 10
     ROW_FORMAT: Dynamic
     TABLE_ROWS: 996152
 AVG_ROW_LENGTH: 78
    DATA_LENGTH: 78200832
MAX_DATA_LENGTH: 0
   INDEX_LENGTH: 50446336
      DATA_FREE: 5242880
 AUTO_INCREMENT: 1000001
    CREATE_TIME: 2020-09-18 12:28:04
    UPDATE_TIME: 2020-09-18 12:28:07
     CHECK_TIME: NULL
TABLE_COLLATION: utf8mb4_0900_ai_ci
       CHECKSUM: NULL
 CREATE_OPTIONS:
  TABLE_COMMENT:
1 row in set (0.00 sec)
```

Finishing up will drop the two `VARCHAR` columns and the indices defined on them, but leaves us with the encoded values.

```console
$ time ./lookups.py finish-log-transformation
Removing string columns

real    0m10.486s
user    0m0.045s
sys     0m0.008s

$ ls -l /var/lib/mysql/kris/log.ibd
-rw-r----- 1 mysql mysql  52M Sep 18 12:32 log.ibd

mysql> select * from information_schema.tables where table_name = "log"\G
  TABLE_CATALOG: def
   TABLE_SCHEMA: kris
     TABLE_NAME: log
     TABLE_TYPE: BASE TABLE
         ENGINE: InnoDB
        VERSION: 10
     ROW_FORMAT: Dynamic
     TABLE_ROWS: 997632
 AVG_ROW_LENGTH: 48
    DATA_LENGTH: 48824320
MAX_DATA_LENGTH: 0
   INDEX_LENGTH: 0
      DATA_FREE: 2097152
 AUTO_INCREMENT: 1000001
    CREATE_TIME: 2020-09-18 12:31:43
    UPDATE_TIME: NULL
     CHECK_TIME: NULL
TABLE_COLLATION: utf8mb4_0900_ai_ci
       CHECKSUM: NULL
 CREATE_OPTIONS:
  TABLE_COMMENT:
1 row in set (0.00 sec)
```

So data length went from 59326464 bytes to 48824320 bytes, a reduction to 82.3% of the original size. We could save even more by not using `integer` 4-byte values to encode, but for example `tinyint unsigned` 1-byte values. On the other hand, that may become a problem later on when we exceed the id-space of the map table as we add new states.

On top of that, the size of the target `log` table is now a function of the row number, as we have no variable length columns any more. The size of the source table is dependent on the variable length string values as well, so by encoding we also got a better plannable table size.

TL;DR:

- Using a map table, and update statements with a subselect, we can encode variable length repeated string values into integer values. 
- We also get better data quality, as now only legal values from the map table can be encoded.
- The transformation requires at least two `ALTER TABLE` statements (or matching online schema changes), and one full scan for each column to be encoded. A lot of intermediate disk space is required. This needs planning.
