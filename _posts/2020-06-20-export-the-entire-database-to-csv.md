---
layout: post
title:  'Export the entire database to CSV'
author-id: isotopp
feature-img: assets/img/background/mysql.jpg
date: 2020-06-20 16:16:38 +0200
tags:
- lang_en
- mysql faq
- mysql
- erklaerbaer
- reddit
---
A [question](https://www.reddit.com/r/mysql/comments/hbg712/export_entire_database_to_csv/) from Reddit's /r/mysql:
> Really new to MySQL and had a request to export an entire database to csv for review. I can manually export each table using workbench but there are 10+ tables and 10+ databases so I was looking to export the entire database to csv.

It is likely that you have additional requirements on top of this, so it would be best to script this in a way that would allow for customization.

Try this piece of Python 3.7 (or better) as a starting point. It requires `mysqlclient` to be installed with pip (preferrably in a venv).

```python
#! /usr/bin/env python
# -*- coding: utf-8 -*-

# pip install mysqlclient (https://pypi.org/project/mysqlclient/)
import MySQLdb
import csv

# connect to database, set mysql_use_results mode for streaming
db_config = dict(
    host="localhost",
    user="kris",
    passwd="geheim",
    db="kris",
)

db = MySQLdb.connect(**db_config)

# Default is db.store_result(), which would buffer the
# result set in memory in the client. This won't work
# for a full table download, so we switch to streaming
# mode aka db.use_result(). That way we keep at most
# one result row in memory at any point in time.
db.use_result()

# Get a list of all tables in database
tables = db.cursor()
tables.execute("show tables")

# for each table, dump it to csv file
for t in tables:
  table = t[0]
  print(f"table = {table}")

  data = db.cursor()
  data.execute(f"select * from `{table}`")

  with open(f"{table}.csv", "w") as csvfile:
    w = csv.writer(csvfile)
    w.writerows(data)
```

Then customize as needed.

*Note:* Using `db.use_result()` normally is not recommended, because it puts additional burden on the database when handling your result set, and because you cannot jump back and forth in the result set in the client.

For a `mysqldump`-like usage as here, the default `db.store_result()` won't work, though, because it downloads the result set (here: entire tables) into client memory, one at a time, and that won't work. So in this particular case, `db.use_result()` is mandatory.

In `mysqldump`, the option `--quick` switches to streaming mode, and it is part of the `--opt` set of recommended options, and they are enabled by default. When using `mysqldump --skip-quick`, buffered mode is used (and your mysqldump will explode due to memory buffering requirements).
