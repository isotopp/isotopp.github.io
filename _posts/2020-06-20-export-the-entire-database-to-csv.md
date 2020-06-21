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

{% highlight python %}
#! /usr/bin/env python
# -*- coding: utf-8 -*-

# pip install mysqlclient (https://pypi.org/project/mysqlclient/)
import MySQLdb as mdb
import csv

# connect to database, set mysql_use_results mode for streaming
db =  mdb.connect(host='localhost', user='root', db='kris')
db.use_result()

# Get a list of all tables in database
tables = db.cursor()
tables.execute("show tables")

# for each table, dump it to csv file
for t in tables:
  table = t[0]
  print(f"{table}")

  query = f"select * from %s"
  data = db.cursor()
  data.execute(query, table)

  with open(f"{table}.csv", "w") as csvfile:
    w = csv.writer(csvfile)
    w.writerows(data)
{% endhighlight %}

Then customize as needed.
