---
author: isotopp
title: "MySQL: information_schema.tables performance regression"
date: "2024-10-28T05:06:07Z"
feature-img: assets/img/background/mysql.jpg
toc: true
tags:
- lang_en
- database
- mysql
- mysqldev
---

In IRC `libera:#mysql` somebody asked about the performance of 
`SHOW TABLES LIKE 'name'`
in MySQL 8.0, which was slow for them, but fast in 5.7.
They pointed to
[a forum article from 2022](https://forums.mysql.com/read.php?24,706979,706979)
that had a similar problem with a `select`-statement on `I_S.TABLES`.

Both cases had in common a large number of tables in a single schema.
The person in IRC had around 40k tables, 
the person in the forum article 500k tables.

I wrote about
[the Million Challenge]({{< relref "2021-09-10-mysql-million-challenge.md" >}})
in 2021, but was unable to follow through for personal reasons.
This question prompted me to pick this up.

# Making a million tables

Code to make a million tables in a schema is cheap.

```mysql
mysql> create database million;
...
mysql> grant all on million.* to kris@localhost;
...
mysql> grant all on million.* to kris@"192.168.1.0/24";
```

and

```python
#! /usr/bin/env python

import sys

import MySQLdb
import MySQLdb.cursors
import click

db_config = dict(
    host="127.0.0.1",
    user="kris",
    passwd="...",
    db="million",
    cursorclass=MySQLdb.cursors.DictCursor,
)

db = MySQLdb.connect(**db_config)

@click.group(help="Create a million tables")
def sql():
    pass

def run_template(template: str, basename: str, count: int) -> None:
    for i in range(count):
        cmd = template.format(basename=basename, count=i)
        if i % 100 == 0:
            print(f"{cmd}", end="\r")

        try:
            c = db.cursor()
            c.execute(cmd)
        except MySQLdb.Error as e:
            click.echo(f"MySQL Error: {e}")
            sys.exit()
    print()


@sql.command()
@click.option("--count", default=1000000, help="number of tables to drop.")
@click.option("--basename", default="testtable", help="base name of tables.")
def drop(count: int, basename: str) -> None:
    template = "drop table if exists {basename}_{count:06d}"
    run_template(template=template, basename=basename, count=count)


@sql.command()
@click.option("--count", default=1000000, help="number of tables to drop.")
@click.option("--basename", default="testtable", help="base name of tables.")
def create(count: int, basename: str) -> None:
    template = "create table if not exists {basename}_{count:06d} (id serial, d varchar(200), e varchar(200), f varchar(200), i integer, j integer)"
    run_template(template=template, basename=basename, count=count)

sql()
```

# It's slow

When running this in `create` mode with defaults,
it creates around 900 tables per minute.

This is on an AMD Ryzen 7 5700G, 128 GB RAM, 64 GB buffer pool,
XFS on a 100G partition on a Crucial NVME (CT4000P3PSSD8).
`iostat` shows close to 100% utilization, at 16 MB/s disk writes and around 1000 w/s.

I am not impressed with the creation rate.

The `.ibd` files created are empty and take 114688 Bytes (7 pages) on disk, each.
A million of these `.ibd` files will take slightly over 100 GB of disk space.

I didn't make this calculation in advance, and my disk filled up overnight with 313k tables.
Running `ls` in `/var/lib/mysql/million` takes 1.781s realtime (with 1s system time).
Running `ls -l` takes 3.156s realtime (with 2.177s system time).

# It's even slower in the database

Asking for a table in the `million` schema is slow.
It is not a buffer pool caching problem, it is slow immediately after, asking for the same table: 

```mysql
mysql> select table_name as name from information_schema.tables where table_name like "testtable_033478";
+------------------+
| name             |
+------------------+
| testtable_033478 |
+------------------+
1 row in set (0.22 sec)

mysql> select table_name as name from information_schema.tables where table_name like "testtable_033478";
+------------------+
| name             |
+------------------+
| testtable_033478 |
+------------------+
1 row in set (0.22 sec)
```

Even asking for tables from another schema with only 6 tables is slow:

```mysql
mysql> select table_name as name from information_schema.tables where table_name like "ek_dict";
+---------+
| name    |
+---------+
| ek_dict |
+---------+
1 row in set (0.22 sec)
```

Adding `table_schema` helps in that case:

```mysql
mysql> select table_name as name from information_schema.tables where table_name like "ek_dict" and table_schema = "kris";
+---------+
| name    |
+---------+
| ek_dict |
+---------+
1 row in set (0.00 sec)

mysql> select table_name as name from information_schema.tables where table_name like "ek_dict";
+---------+
| name    |
+---------+
| ek_dict |
+---------+
1 row in set (0.21 sec)
```

# The hidden tables of data dictionary

Looking at the plan, we see that `I_S.TABLES` is really a view that queries hidden tables in `mysql.*`.
These hidden tables are the data dictionary:

```mysql
mysql> explain select table_name as name from information_schema.tables where table_name like "ek_dict" and table_schema = "kris";
+----+-------------+-------+------------+--------+--------------------+------------+---------+-------------------------+-------+----------+-------------+
| id | select_type | table | partitions | type   | possible_keys      | key        | key_len | ref                     | rows  | filtered | Extra       |
+----+-------------+-------+------------+--------+--------------------+------------+---------+-------------------------+-------+----------+-------------+
|  1 | SIMPLE      | cat   | NULL       | index  | PRIMARY            | name       | 194     | NULL                    |     1 |   100.00 | Using index |
|  1 | SIMPLE      | sch   | NULL       | eq_ref | PRIMARY,catalog_id | catalog_id | 202     | mysql.cat.id,const      |     1 |   100.00 | Using index |
|  1 | SIMPLE      | tbl   | NULL       | ref    | schema_id          | schema_id  | 8       | mysql.sch.id            | 34844 |    11.11 | Using where |
|  1 | SIMPLE      | col   | NULL       | eq_ref | PRIMARY            | PRIMARY    | 8       | mysql.tbl.collation_id  |     1 |   100.00 | Using index |
|  1 | SIMPLE      | ts    | NULL       | eq_ref | PRIMARY            | PRIMARY    | 8       | mysql.tbl.tablespace_id |     1 |   100.00 | Using index |
|  1 | SIMPLE      | stat  | NULL       | eq_ref | PRIMARY            | PRIMARY    | 388     | const,mysql.tbl.name    |     1 |   100.00 | Using index |
+----+-------------+-------+------------+--------+--------------------+------------+---------+-------------------------+-------+----------+-------------+
```

In this case, we have an initial `index` lookup on the `name` index in the invisible `cat` table.
Then a bunch of `eq_ref` primary key relations,
and one lookup that stands out, a `type=ref` in `tbl` using the `schema_id` index against `mysql.sch.id`.

This yields a badness of 34844 (11% of 313k). 
This is an optimizer mis-guess, because our schemas are heavily imbalanced: 
`kris` is much better and has only 6 tables.
The query is much faster than estimated, thanks to the imbalance.

Leaving off the `table_schema = "kris"` clause gives us a worse plan:

```mysql
mysql> explain select table_name as name from information_schema.tables where table_name like "ek_dict";
+----+-------------+-------+------------+--------+--------------------+------------+---------+-------------------------------+-------+----------+-------------+
| id | select_type | table | partitions | type   | possible_keys      | key        | key_len | ref                           | rows  | filtered | Extra       |
+----+-------------+-------+------------+--------+--------------------+------------+---------+-------------------------------+-------+----------+-------------+
|  1 | SIMPLE      | cat   | NULL       | index  | PRIMARY            | name       | 194     | NULL                          |     1 |   100.00 | Using index |
|  1 | SIMPLE      | sch   | NULL       | ref    | PRIMARY,catalog_id | catalog_id | 8       | mysql.cat.id                  |     6 |   100.00 | Using index |
|  1 | SIMPLE      | tbl   | NULL       | ref    | schema_id          | schema_id  | 8       | mysql.sch.id                  | 34844 |    11.11 | Using where |
|  1 | SIMPLE      | col   | NULL       | eq_ref | PRIMARY            | PRIMARY    | 8       | mysql.tbl.collation_id        |     1 |   100.00 | Using index |
|  1 | SIMPLE      | ts    | NULL       | eq_ref | PRIMARY            | PRIMARY    | 8       | mysql.tbl.tablespace_id       |     1 |   100.00 | Using index |
|  1 | SIMPLE      | stat  | NULL       | eq_ref | PRIMARY            | PRIMARY    | 388     | mysql.sch.name,mysql.tbl.name |     1 |   100.00 | Using index |
+----+-------------+-------+------------+--------+--------------------+------------+---------+-------------------------------+-------+----------+-------------+
```

Here we now have two `ref` with a badness of 6 and 34844 against `mysql.cat.id` and `mysql.sch.id` respectively.

The actual runtime is identical to asking for a table from the `million` schema:

```mysql
mysql> select table_name as name from information_schema.tables where table_name like "ek_dict";
+---------+
| name    |
+---------+
| ek_dict |
+---------+
1 row in set (0.23 sec)
```

The command `show tables like` is also affected by the slowdown:

```mysql
mysql> show tables like "testtable_033478";
+--------------------------------------+
| Tables_in_million (testtable_033478) |
+--------------------------------------+
| testtable_033478                     |
+--------------------------------------+
1 row in set (0.23 sec)
```

# Is that bad?

Yes.

Queries against `i_s.tables` should be fast and scale to a million tables.
They are running often, and not just when sending them explicitly to the server,
but they are also used internally and implicitly when doing other things.

Here is what happens when I `drop database million` with 313k tables in it:

```mysql
mysql> drop database million;
<freeze>
```

and

```mysql
mysql> show processlist;
+-----+-----------------+-----------+---------+---------+------+------------------------+-----------------------+
| Id  | User            | Host      | db      | Command | Time | State                  | Info                  |
+-----+-----------------+-----------+---------+---------+------+------------------------+-----------------------+
|   5 | event_scheduler | localhost | NULL    | Daemon  | 6678 | Waiting on empty queue | NULL                  |
|  28 | root            | localhost | mysql   | Query   |    0 | init                   | show processlist      |
| 597 | root            | localhost | million | Query   |   18 | checking permissions   | drop database million |
+-----+-----------------+-----------+---------+---------+------+------------------------+-----------------------+
```

The database freezes on a MDL, with `checking permission`, individually, 
slowly, at a rate of 4 per second (0.23s query runtime),
before it can begin to process the `drop database` command.

Please don't.

# TL;DR

MySQL 8.x uses hidden InnoDB tables in `mysql.*` to store a data dictionary (DD).

Some queries against the DD do not scale well, in my case against 313k tables in a single database.

Queries are being run against DD very often and often implicitly.
Not only are explicit queries against `I_S.TABLES` and `SHOW TABLES LIKE` statements slow,
a `drop database` on a schema with 313k tables will never terminate.
