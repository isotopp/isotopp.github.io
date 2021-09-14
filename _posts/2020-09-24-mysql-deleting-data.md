---
layout: post
title:  'MySQL: Deleting data'
author-id: isotopp
feature-img: assets/img/background/mysql.jpg
date: 2020-09-24 21:39:24 +0200
tags:
- lang_en
- mysql
- database
- innodb
- erklaerbaer
- mysqldev
---
Completing the data lifecycle is often harder than originally expected: Deleting data can cost sometimes way more than inserting it in the first place. MySQL Partitions can offer a way out. We have an [earlier post]({% link _posts/2020-05-13-deleting-data-from-mysql.md %}) on the subject.

## A sample table, and a problem statement

Let's define a kind of log table, to which data is added with an `auto_increment` id value and some data.

```python
#! /usr/bin/env python3

from time import sleep
from random import randint
from multiprocessing import Process

import click
import MySQLdb
import MySQLdb.cursors


db_config = dict(
    host="localhost",
    user="kris",
    passwd="geheim",
    db="kris",
    cursorclass=MySQLdb.cursors.DictCursor,
)

@click.group(help="Load and delete data using partitions")
def sql():
    pass

@sql.command()
def setup_tables():
    sql_setup = [
        "drop table if exists data",
        """ create table data (
                id integer not null primary key auto_increment,
                d varchar(64) not null,
                e varchar(64) not null
        )""",
        "alter table data partition by range (id) ( partition p1 values less than (10000))",
        "insert into data (id, d, e) values ( 1, 'keks', 'keks' )",
        "commit",
    ]

    db = MySQLdb.connect(**db_config)

    for cmd in sql_setup:
        try:
            c = db.cursor()
            c.execute(cmd)
        except MySQLdb.OperationalError as e:
            click.echo(f"setup_tables: failed {e} with {cmd}.")


sql()
```

This is our basic Python framework for experimentation, using the `click` framework, and a command `setup-tables`. This command will run a number of SQL statements to initialize our log table named `data`.

The log table has three columns: `id`, an auto_increment counter, and two columns `d` and `e`, each containing 64 characters of data. To get things started, we add an initial partition, containing all id-values below 10.000 and an initial row.

If we were to add data to this table in a loop, we would increment our id-counter, and with InnoDB being what it is, all new rows will be added at the end of the table: We remember from [ALTER TABLE for UUID]({% link _posts/2020-09-22-alter-table-for-uuid.md %}) that the physical order of any InnoDB table is by primary key - our id-counter.

Now, if we were to expire old data, we would start to delete rows with the lowest id-values, so we would delete rows from the beginning of the table, or the left hand side of the B+-Tree. To keep the tree balanced, MySQL would have to execute balancing operations, which will be expensive, because rows are being shuffeled around in the tree.

![](/uploads/loeschen_einfuegen.png)

*New data is added to the right hand side of the B+-Tree, while old data is being deleted at the left hand side. To keep the tree balanced, data is reshuffled, which is an expensive operation.*

Instead, we are defining partitions. In our case, we are using the simplest definition possible: A `PARTITION BY RANGE` on the primary key column. We are making bins of 10.000 rows each, because that is convenient for our demonstration here.

## Three processes

We will be using the Python multiprocessing module to have three processes, an `inserter()`, a `partitioner()` and a `dropper()`. All of them are endless loops.

- The inserter will insert random new data rows into the table as fast as possible.
- The partitioner will make sure that we always have a sufficient number of empty new partitions for the inserter to continue.
- The dropper will limit the number of partitions with data by throwing the oldest partition away.

We will have small piece of code that starts our processes:

```python
@sql.command()
def start_processing():
    proc_partition = Process(target=partitioner)
    proc_partition.start()
    proc_drop = Process(target=dropper)
    proc_drop.start()
    proc_insert = Process(target=inserter)
    proc_insert.start()
```

## The Inserter

The Inserter is an endless loop that generates two random 64 character strings and inserts a new row into the database. Every 10 rows, we commit, every 1000 rows we print a message.

```python
def inserter():
    counter = 0
    step = 10

    cmd = "insert into data (id, d, e) values( NULL, %(d)s, %(e)s )"

    db = MySQLdb.connect(**db_config)
    c = db.cursor()

    while True:
        data = {
            "d": "".join([chr(randint(97, 97 + 26)) for x in range(64)]),
            "e": "".join([chr(randint(97, 97 + 26)) for x in range(64)]),
        }
        c.execute(cmd, data)
        counter += 1
        if counter % step == 0:
            db.commit()

        if counter % 1000 == 0:
            print(f"counter = {counter}")
```

Without the other two threads, the inserter will generate 10.000 rows and then stop, because there is no `MAXVALUE` clause.

## The Partitioner

The Partitioner is an endless loop that runs an `ANALYZE TABLE data` command to refresh the statistics, and then queries `INFORMATION_SCHEMA.PARTITIONS` for the five partitions with the highest `PARTITION_ORDINAL_POSITION`.

If there are fewer than 5 partitions in total, we generate new partitions no matter what.

If there are not at least 5 partitions with no rows int them, we create new partitions.

If we did nothing, we wait for 1/10th of a second and then check again.

The new partition gets a range expression with a limit 10.000 values higher than the highest one found, and the partition name is derived from the limit by dividing by 10.000.

In code:

```python
def create_partition(db, next_name, next_limit):
    cmd = f"alter table data add partition ( partition {next_name} values less than ( {next_limit}))"
    print(f"cmd = {cmd}")
    c = db.cursor()
    c.execute(cmd)
```

This will simply format and run an `ALTER TABLE` statement to add a new partition to the existing table.

And the checking loop:

```python
def partitioner():
    db = MySQLdb.connect(**db_config)
    c = db.cursor()

    while True:
        # force stats refresh
        c.execute("analyze table kris.data")

        # find the five highest partitions
        cmd = """select
          partition_name,
          partition_ordinal_position,
          partition_description,
          table_rows
        from
          information_schema.partitions
        where
          table_schema = "kris" and
          table_name = "data"
        order by
          partition_ordinal_position desc
        limit 5
        """
        c.execute(cmd)
        rows = c.fetchall()
        next_limit = int(rows[0]["PARTITION_DESCRIPTION"]) + 10000
        next_name = "p" + str(int(next_limit / 10000))

        if len(rows) < 5:
            print(f"create {next_name} reason: not enough partitions")
            create_partition(db, next_name, next_limit)
            continue

        sum = 0
        for row in rows:
            sum += int(row["TABLE_ROWS"])
        if sum > 0:
            print(f"create {next_name} reason: not enough empty partitions")
            create_partition(db, next_name, next_limit)
            continue

        sleep(0.1)
```

This code is mostly a long `SELECT` on the `INFORMATION_SCHEMA.PARTITIONS` table, and then two quick checks to see if we need to make more partitions.

## The Dropper

The Dropper structurally mirrors the Partitioner: We have a tiny function to create the actual `ALTER TABLE data DROP PARTITION` statement:

```python
def drop_partition(db, partition_name):
    cmd = f"alter table data drop partition {partition_name}"
    c = db.cursor()
    print(f"cmd = {cmd}")
    c.execute(cmd)
```

And we have an endless loop that basically runs a `SELECT` on `INFORMATION_SCHEMA.PARTITIONS` and checks the number of partitions that have a non-zero number of `TABLE_ROWS`. If it is too many, we drop the one with the lowest number ("the first one found", using an appropriate sort order in our SQL).

```python
def dropper():
    db = MySQLdb.connect(**db_config)
    c = db.cursor()

    while True:
        # force stats refresh
        c.execute("analyze table kris.data")

        #
        cmd = """ select
          partition_name,
          partition_ordinal_position,
          partition_description,
          table_rows
        from
          information_schema.partitions
        where
          table_schema = "kris" and
          table_name = "data" and
          table_rows > 0
        order by
          partition_ordinal_position asc
        """
        c.execute(cmd)
        rows = c.fetchall()
        if len(rows) >= 10:
            partition_name = rows[0]["PARTITION_NAME"]
            print(f"drop {partition_name} reason: too many partitions with data")
            drop_partition(db, partition_name)
            continue

        sleep(0.1)
```

## A test run

In our test run, we see immediately after startup how the five spare partitions are being created.

```console
$ ./partitions.py  setup-tables
$ ./partitions.py  start-processing
create p2 reason: not enough partitions
cmd = alter table data add partition ( partition p2 values less than ( 20000))
create p3 reason: not enough partitions
cmd = alter table data add partition ( partition p3 values less than ( 30000))
create p4 reason: not enough partitions
cmd = alter table data add partition ( partition p4 values less than ( 40000))
create p5 reason: not enough partitions
cmd = alter table data add partition ( partition p5 values less than ( 50000))
create p6 reason: not enough empty partitions
cmd = alter table data add partition ( partition p6 values less than ( 60000))
counter = 1000
counter = 2000
counter = 3000
...
```

Once we cross the threshold of p1, the number of empty partitions is no longer low enough and another one is being created:

```console
...
counter = 9000
counter = 10000
create p7 reason: not enough empty partitions
cmd = alter table data add partition ( partition p7 values less than ( 70000))
counter = 11000
...
```

This continues for a while, until we have a sufficient number of data partitions so that we begin dropping, too:

```console
...
counter = 90000
create p15 reason: not enough empty partitions
cmd = alter table data add partition ( partition p15 values less than ( 150000))
drop p1 reason: too many partitions with data
cmd = alter table data drop partition p1
counter = 91000
counter = 92000
...
```

Now the system reaches a stable state and will add and drop partitions in sync with the Inserter.

From inside SQL we can see the number of rows in the table rise, and then suddenly drop by 10.000 as we drop a partition.

```sqlkris@localhost [kris]> select count(*) from data;
+----------+
| count(*) |
+----------+
|    89872 |
+----------+
1 row in set (0.00 sec)

kris@localhost [kris]> select count(*) from data;
+----------+
| count(*) |
+----------+
|    90122 |
+----------+
1 row in set (0.02 sec)

kris@localhost [kris]> select count(*) from data;
+----------+
| count(*) |
+----------+
|    80362 |
+----------+
1 row in set (0.01 sec)
```

The complete example is available [on github.com](https://github.com/isotopp/mysql-dev-examples/tree/master/mysql-partitions).
