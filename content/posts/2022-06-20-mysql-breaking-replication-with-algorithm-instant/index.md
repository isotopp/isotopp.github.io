---
author: isotopp
date: "2022-06-20T15:20:00Z"
feature-img: assets/img/background/mysql.jpg
title: "Breaking replication with ALGORITHM = INSTANT"
tags:
- database
- mysql
- lang_en
aliases:
  - /2022/06/20/mysql-breaking-replication-with-algorithm-instant.html
---

MySQL 8.0.29 adds `ALGORITHM=INSTANT` as a way to run `ALTER TABLE` commands with less wait.
The documentation can be found in [Online DDL Operators](https://dev.mysql.com/doc/refman/8.0/en/innodb-online-ddl-operations.html) and instant column operations can be found [here](https://dev.mysql.com/doc/refman/8.0/en/innodb-online-ddl-operations.html#online-ddl-column-operations).

Example Syntax looks like this:

```mysql
mysql> use kris;
mysql> create table t (id serial, d varchar(20));
Query OK, 0 rows affected (0.12 sec)

mysql> alter table t add column i integer not null, algorithm=instant;
Query OK, 0 rows affected (0.07 sec)
Records: 0  Duplicates: 0  Warnings: 0
```

# Limited TOTAL_ROW_VERSIONS

[The manual](https://dev.mysql.com/doc/refman/8.0/en/innodb-online-ddl-operations.html) explains a new concept: 

> A new row version is created after each `ALTER TABLE ... ALGORITHM=INSTANT` operation that adds one or more columns, drops one or more columns, or adds and drops one or more columns in the same operation.
> The `INFORMATION_SCHEMA.INNODB_TABLES.TOTAL_ROW_VERSIONS` column tracks the number of row versions for a table.
> The value is incremented each time a column is instantly added or dropped. 
> The initial value is 0.

```mysql
mysql> select name, total_row_versions
    ->   from information_schema.innodb_tables 
    ->   where name like "kris/%";
 --------+--------------------+
| NAME   | TOTAL_ROW_VERSIONS |
+--------+--------------------+
| kris/t |                  0 |
+--------+--------------------+
```

So there is a concept called `TOTAL_ROW_VERSIONS`.
This is a version counter for instant alter table, and it is incremented each time a change to a table's schema is being made.

The manual continues with a warning:
The TRV counter has a limit of 64.
Commands are rejected when the counter is reaching the limit.

> When a table with instantly added or dropped columns is rebuilt by table-rebuilding `ALTER TABLE` or `OPTIMIZE TABLE` operation, the `TOTAL_ROW_VERSIONS` value is reset to 0.
> The maximum number of row versions permitted is 64, as each row version requires additional space for table metadata.
> When the row version limit is reached, `ADD COLUMN` and `DROP COLUMN` operations using `ALGORITHM=INSTANT` are rejected with an error message that recommends rebuilding the table using the `COPY` or `INPLACE` algorithm.
>
> `ERROR 4080 (HY000): Maximum row versions reached for table test/t1. No more columns can be added or dropped instantly. Please use COPY/INPLACE.`

# The obvious breakage

So a command is rejected, when TRV reaches 64.
Also, MySQL uses replication a lot.
In fact, I am of the persuasion that any MySQL installation that does not have at least one replica is broken.

So can we use this to break replication?

The manual suggests that `OPTIMIZE TABLE` can be used to reset the counter.
The manual knows the following things about [OPTIMIZE](https://dev.mysql.com/doc/refman/8.0/en/optimize-table.html):

1. There is a syntax `OPTIMIZE LOCAL TABLE`.
   »By default, the server writes `OPTIMIZE TABLE` statements to the binary log so that they replicate to replicas.
   To suppress logging, specify the optional `NO_WRITE_TO_BINLOG` keyword or its alias `LOCAL`.«
2. This is not privileged: »This statement requires `SELECT` and `INSERT` privileges for the table.«

We now do this: With `dbdeployer` we `dbdeployer deploy replication 8.0.29`.

On the primary: `./m -u root`

```mysql
create user kris@"%" identified by "secret";
grant all on kris.* to kris@"%";
create database kris;
create table kris.t (id serial, d varchar(20));
```

Continue as `kris` on the primary: `./m -u kris -psecret kris`

```mysql
alter table t add column i integer, algorithm=instant;
select name, total_row_versions from information_schema.innodb_tables where name like "kris/%";

alter table t drop column i, algorithm=instant;
select name, total_row_versions from information_schema.innodb_tables where name like "kris/%";
```

Now inject the `OPTIMIZE LOCAL TABLE` command to plant the bomb.
This can be done by the `kris` user, or any other user having `INSERT` and `SELECT` privilege.
It is not necessary to have `ALTER` privilege, as long as you know that somebody else is doing instant alter table commands on the table.

```mysql
optimize local table t;
```

Finally, continue to add and drop the column `t.i` as before. 
Check the TRV value on the primary and a replica.
Note how the TRV value on the primary is lower than on the replica.

When the TRV value reaches 64 on the replica, replication will stop with error 4080.
The replica is unable to execute the alter table command, while the primary was able to run it.
