---
layout: post
title:  'MySQL Commit Size and Speed'
author-id: isotopp
feature-img: assets/img/background/mysql.jpg
date: 2020-07-27 21:03:09 +0200
tags:
- lang_en
- database
- mysql
- innodb
- erklaerbaer
- mysqldev
---
When writing data to disk, for small transactions the cost of writing the
commit out do disk dominates the execution time of the script. In order to
show that, I wrote a little bit of Python.

The script creates a test table in a database and writes 10.000 rows of test
data into it, in commit sizes of 1, 2, 4, ..., 1024 rows.

```console
$ ./mysql.py --help
Usage: mysql.py [OPTIONS] COMMAND [ARGS]...

  Test commit sizes.

Options:
  --help  Show this message and exit.

Commands:
  create    Create the demo table empty.
  drop      Drop the demo table
  fill      Write test records into the demo table.
  truncate  Truncate the demo table.
```

There is a small driver script to run the test. The driver creates the
table, truncates it and will then run the fill command of the script over
and over again, with growing commit-sizes. All powers of 2 from 0 to 10 are
being tried with 10.000 rows of test data.

The test system has a very old SSD (Crucial M4-CT512M4SSD2) as a data
directory.

```bash
$ cat driver.sh
#! /bin/bash --

./mysql.py drop
./mysql.py create
for i in {0..10}
do
        csize=$((2 ** $i))
        ./mysql.py truncate
        echo "./mysql.py fill --size=10000 --commit-size=$csize"
        time ./mysql.py fill --size=10000 --commit-size=$csize
done
```

The result of the test run is as follows shown, and since at point 10.000
rows were not enough, I later added a second test run with 100.000 rows and
step sizes of 5..14 (32 rows to 16384 rows).

![](/uploads/2020/07/transactions-benchmark.jpg)

| Txn Sz | Runtime | Rows/s | Runtime | Rows/s  |
| -----: | ------: | -----: | ------: | ------: |
|      0 | 127     | 78     |         |         |
|      1 | 68.7    | 145    |         |         |
|      2 | 38.4    | 260    |         |         |
|      3 | 20.93   | 477    |         |         |
|      4 | 12.03   | 831    |         |         |
|      5 |  7.04   | 1420   |   71.01 | 1409    |
|      6 |  4.38   | 2283   |   46.40 | 2156    |
|      7 |  2.92   | 3412   |   30.13 | 3319    |
|      8 |  2.24   | 4464   |   20.94 | 4776    |
|      9 |  1.77   | 5649   |   17.51 | 5712    |
|     10 |  1.58   | 6329   |   15.35 | 6515    |
|     11 |         |        |   14.16 | 7063    |
|     12 |         |        |   13.63 | 7337    |
|     13 |         |        |   13.59 | 7359    |
|     14 |         |        |   13.26 | 7542    |

We observe: Going from single row commits to 16 row commits, we get a
10-fold speed increase, and going to 1024 row commits, we are seeing another
factor of 10. After that, there is hardly any improvement for our chosen
record size and hardware.

## TL;DR

A transaction size of 1000 rows or larger does not seem to improve write
speed (ie in a data load).

From 1 row/commit to 16 rows/commit, we see an increate of an order of
magnitude, and another order of magnitude can be had by going from 16
rows/commit to 1024 rows/commit.


## The script

```console
$ cat requirements.txt
click
mysqlclient
$ python3 -mvenv venv
$ source venv/bin/activate
(venv) $ pip install --upgrade pip
...
(venv) $ pip install wheel
...
(venv) $ pip install -r requirements.txt
...
(venv) $ pip freeze -r requirements.txt > requirements-frozen.txt
```

and

```python
#! /usr/bin/env python3

import sys
import random
import string

import click
import MySQLdb
import MySQLdb.cursors

from pprint import pprint

db_config = dict(
    host="localhost",
    user="kris",
    passwd="geheim",
    db="kris",
    cursorclass=MySQLdb.cursors.DictCursor,
)

sql_drop_table = "drop table %s"

sql_create_table = """create table %s (
    id serial,
    data varbinary(255) not null
)"""

sql_truncate_table = "truncate table %s"

sql_insert_into = 'insert into %s ( id, data) values ( %d, "%s" )'


db = MySQLdb.connect(**db_config)


@click.group(help="Test commit sizes.")
def sql():
    pass


@sql.command()
@click.option("--name", default="demo", help="Table name to drop")
def drop(name):
    """ Drop the demo table """
    cmd = sql_drop_table % name

    try:
        c = db.cursor()
        c.execute(cmd)
        click.echo(f'Table "{name}" dropped.')
    except MySQLdb.OperationalError as e:
        click.echo(f'Table "{name}" did not exist.')


@sql.command()
@click.option("--name", default="demo", help="Table name to create")
def create(name):
    """ Create the demo table empty. """
    cmd = sql_create_table % name

    try:
        c = db.cursor()
        c.execute(cmd)
        click.echo(f'Table "{name}" created.')
    except MySQLdb.OperationalError as e:
        click.echo(f'Table "{name}" did already exist')


@sql.command()
@click.option("--name", default="demo", help="Table name to insert into")
@click.option("--size", default=1000000, help="Number of rows to create in total")
@click.option("--commit-size", default=1000, help="Commit batch size")
@click.option("--verbose/--no-verbose", default=False, help="Log each commit?")
def fill(name, size, commit_size, verbose):
    """ Write test records into the demo table. """
    for i in range(0, size):
        str = "".join(
            random.choice(string.ascii_uppercase + string.digits) for _ in range(20)
        )
        cmd = sql_insert_into % (name, i + 1, str)

        c = db.cursor()
        try:
            c.execute(cmd)
        except MySQLdb.Error as e:
            click.echo(f"MySQL Error: {e}")
            sys.exit()

        if i % commit_size == 0:
            if verbose:
                print(f"Commit at {i}...")
            db.commit()

    db.commit()


@sql.command()
@click.option("--name", default="demo", help="Table name to truncate here")
def truncate(name):
    """ Truncate the demo table. """
    cmd = sql_truncate_table % name

    try:
        c = db.cursor()
        c.execute(cmd)
        click.echo(f'Table "{name}" truncated.')
    except MySQL.OperationalError as e:
        click.echo(f'Table "{name}" does not exist.')


sql()
```
