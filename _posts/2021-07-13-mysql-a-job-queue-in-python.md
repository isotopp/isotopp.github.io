---
layout: post
title:  'MySQL: A job queue in Python'
author-id: isotopp
feature-img: assets/img/background/mysql.jpg
date: 2021-07-13 19:51:59 +0200
tags:
- lang_en
- mysql
---

Somebody needed a job queue in Python: Jobs are being generated in random order, and are written to a MySQL table `jobs`. Jobs matching a condition are selected from the queue in batches of `n` (n=100), and are being claimed, then processed. After processing, they are deleted. Job generation and consumption are concurrent, and proper and efficient locking is needed.

Using our usual includes and setup,

```python
from time import sleep
from random import randint
from sys import exit
from multiprocessing import Process

import click
import MySQLdb
import MySQLdb.cursors


db_config = dict(
    host="127.0.0.1",
    user="kris",
    passwd="geheim",
    db="kris",
    cursorclass=MySQLdb.cursors.DictCursor,
)
```
we create a MySQL table `jobs`:

```python
@sql.command(help="Recreate jobs table")
def setup_tables():
sql_setup = [
    "drop table if exists jobs",
    """create table jobs (
        id integer not null primary key auto_increment,
        d varchar(64) not null,
        e varchar(64) not null,
        status enum("unclaimed", "claimed", "done") not null,
        owner_id integer null,
        owner_date datetime null,
        index(d),
        index(status)
        )""",
        "commit",
    ]

    db = MySQLdb.connect(**db_config)

    for cmd in sql_setup:
        try:
            c = db.cursor()
            c.execute(cmd)
        except MySQLdb.OperationalError as e:
            click.echo(f"setup_tables: failed {e} with {cmd}.")


@click.group(help="Load and delete data using partitions")
def sql():
pass


sql()
```