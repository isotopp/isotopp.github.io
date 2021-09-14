---
layout: post
title:  'MySQL Window Functions'
author-id: isotopp
feature-img: assets/img/background/mysql.jpg
date: 2020-06-21 14:21:28 +0200
tags:
- lang_en
- mysql faq
- mysql
- erklaerbaer
- reddit
---
Two questions from Reddit's /r/mysql related to Window Functions: [How do I make row.numbers happen](https://www.reddit.com/r/mysql/comments/gue9ct/how_do_i_make_rownumbers_happen/) and [Get the difference between two values in different recordings](https://www.reddit.com/r/mysql/comments/hbx5kk/get_the_difference_between_two_values_in/).

One of the new things in MySQL is the implementation of Window Functions. They are related to aggregates, but do not actually lump values together.

To better understand what goes on, let's create some fake data to work with:

```python
#! /usr/bin/env python3
# -*- coding: utf-8 -*-

import MySQLdb as mdb
import MySQLdb.cursors as cursors
from datetime import datetime, timedelta
from random import randint, random

# We have {sensors} sensors, each producing {values} values 
# between {minvalue} and {maxvalue}, at a random time after {starttime} plus {delta}
sensors = 3
values = 10
minvalue = 0
maxvalue = 10
starttime = datetime.fromisoformat("2020-01-01 00:00:00")
delta = timedelta(days=31)

script = [
    "drop table if exists series",
    "create table if not exists series ( id serial, sensor integer not null, checktime timestamp not null, value float )",
]

con = mdb.connect(
    host="localhost", user="root", db="kris", cursorclass=cursors.DictCursor
)
cur = con.cursor()

# Create a table
for stmt in script:
    cur.execute(stmt)
    print(f"{cur._last_executed}")
con.commit()

# insert values
insert_stmt = "insert into series values ( %s, %s, %s, %s)"
for s in range(0, sensors):
    print(
        f"Sensor {s}: {values} measurements ({minvalue}, {maxvalue}), ({starttime}, {starttime+delta})."
    )
    for i in range(0, values):
        value = random() * maxvalue + minvalue
        t = starttime + timedelta(days=randint(0, delta.days))
        data = (None, s, t, value)
        cur.execute(insert_stmt, data)
    con.commit()
```

This will create test data for a number of fictional sensors `sensors`. For each sensor, there will be `values` many readings with a random float value between `minvalue` and `maxvalue`. The sensor readings will be taken at a random point in time between `starttime` and `delta` days later. In our sample config, that is 3 sensors with 10 readings each, values between 0 and 10, at some random point in time in January 2020.

We get data similar to this:

```sql
root@localhost [kris]> select * from series;
+----+--------+---------------------+----------+
| id | sensor | checktime           | value    |
+----+--------+---------------------+----------+
|  1 |      0 | 2020-01-12 00:00:00 |  9.72828 |
|  2 |      0 | 2020-01-09 00:00:00 |  3.59015 |
|  3 |      0 | 2020-01-24 00:00:00 | 0.701136 |
…
| 11 |      1 | 2020-01-27 00:00:00 |  9.64586 |
| 12 |      1 | 2020-01-25 00:00:00 |  6.19484 |
| 13 |      1 | 2020-01-15 00:00:00 |  2.18511 |
…
| 28 |      2 | 2020-01-02 00:00:00 |  1.36718 |
| 29 |      2 | 2020-01-03 00:00:00 |  2.71718 |
| 30 |      2 | 2020-01-20 00:00:00 |  5.86109 |
+----+--------+---------------------+----------+
30 rows in set (0.00 sec)
```

We could group this data, for example by sensor. The database would then make piles for each sensor value, and we could apply aggregate functions to each pile:

```sql
root@localhost [kris]> select sensor, 
   -> count(value) as count,
   -> min(value) as min, 
   -> max(value) as max, 
   -> avg(value) as avg 
   -> from series 
   -> group by sensor;
+--------+-------+----------+---------+-------------------+
| sensor | count | min      | max     | avg               |
+--------+-------+----------+---------+-------------------+
|      0 |    10 | 0.065623 | 9.72828 | 4.031341724842787 |
|      1 |    10 |  1.16093 | 9.64586 |  5.11824003458023 |
|      2 |    10 |  1.36718 | 9.90121 | 5.031034636497497 |
+--------+-------+----------+---------+-------------------+
3 rows in set (0.00 sec)
```

Window Functions work similarly, but they do not make piles. They work by defining partitions over the data, and then walking through each partition, resetting the window functions applied at each partition boundary.

As with `GROUP BY`, when leaving out a partitioning the entire table is taken as one:

```sql
root@localhost [kris]> select id, sensor, row_number() over () from series;
+----+--------+----------------------+
| id | sensor | row_number() over () |
+----+--------+----------------------+
|  1 |      0 |                    1 |
|  2 |      0 |                    2 |
|  3 |      0 |                    3 |
…
| 28 |      2 |                   28 |
| 29 |      2 |                   29 |
| 30 |      2 |                   30 |
+----+--------+----------------------+
30 rows in set (0.00 sec)
```

The `id` is stored, the `row_number()` is generated. Let's add a partitioning by sensor number and re-run the command:

```sql
root@localhost [kris]> select id, sensor, 
  -> row_number() over (partition by sensor) as r
  -> from series;
+----+--------+----+
| id | sensor |  r |
+----+--------+----+
|  1 |      0 |  1 |
|  2 |      0 |  2 |
|  3 |      0 |  3 |
…
| 10 |      0 | 10 |
| 11 |      1 |  1 |
| 12 |      1 |  2 |
| 13 |      1 |  3 |
…
| 20 |      1 | 10 |
| 21 |      2 |  1 |
| 22 |      2 |  2 |
| 23 |      2 |  3 |
…
| 30 |      2 | 10 |
+----+--------+----+
30 rows in set (0.00 sec)
```

By defining partition boundaries at `sensor` value changes with `PARTITION BY sensor`, the `row_number()` counter is reset each time the `sensor` value changes. Within each partition, we can order the values as we wish. Using the same statement as before, but ordering the values by `id` in reverse, we get

```sql
root@localhost [kris]> select id, sensor, 
  -> row_number() over (partition by sensor order by id desc) as r 
  -> from series;
+----+--------+----+
| id | sensor | r  |
+----+--------+----+
| 10 |      0 |  1 |
|  9 |      0 |  2 |
|  8 |      0 |  3 |
…
|  1 |      0 | 10 |
| 20 |      1 |  1 |
| 19 |      1 |  2 |
| 18 |      1 |  3 |
…
| 11 |      1 | 10 |
| 30 |      2 |  1 |
| 29 |      2 |  2 |
| 28 |      2 |  3 |
…
| 21 |      2 | 10 |
+----+--------+----+
30 rows in set (0.01 sec)
```

Note that the `OVER ()` clause is written as a field. Different windows and hence different partitions and orderings can be defined concurrently.

```sql
root@localhost [kris]> select id, sensor, row_number() over (partition by sensor order by id desc) as r, row_number() over (order by id desc ) as rr  from series order by id;
+----+--------+----+----+
| id | sensor | r  | rr |
+----+--------+----+----+
|  1 |      0 | 10 | 30 |
|  2 |      0 |  9 | 29 |
|  3 |      0 |  8 | 28 |
…
| 10 |      0 |  1 | 21 |
| 11 |      1 | 10 | 20 |
| 12 |      1 |  9 | 19 |
…
| 29 |      2 |  2 |  2 |
| 30 |      2 |  1 |  1 |
+----+--------+----+----+
30 rows in set (0.00 sec)
```

Most aggregate functions can be used with `OVER()` clauses, among them not only `AVG()` and the other statistics functions, but also `JSON_ARRAYAGG()` and `JSON_OBJECTAGG()`. On top of that a number of window-specific functions have been defined, as listed in [Window Function Descriptions](https://dev.mysql.com/doc/refman/8.0/en/window-function-descriptions.html) in the manual. Among these are `RANK()` and `DENSE_RANK()` , as well as `LAG()` and `LEAD()`, which refer to the value next or preceding the current row.

We can already answer [the question about row numbers](https://www.reddit.com/r/mysql/comments/gue9ct/how_do_i_make_rownumbers_happen/) now, and better than [before MySQL 8](http://mysqldump.azundris.com/archives/32-The-Quota-Query-and-Running-Sums-by-Jan-and-Kai.html) (differently [here](https://stackoverflow.com/questions/5436263/ranking-with-millions-of-entries/5491052#5491052)). These methods are outdated and should no longer be used.

We have shown above already how to produce global row numbers and row numbers per sensor. We can also quite easily run a topK query, for example "show me the three smallest values per sensor":

```sql
root@localhost [kris]> select * from (
  -> select sensor, 
  ->        value, 
  ->        rank() over (partition by sensor order by value) as svrank 
  ->   from series
  -> ) as t 
  -> where svrank < 4;
+--------+----------+--------+
| sensor | value    | svrank |
+--------+----------+--------+
|      0 | 0.065623 |      1 |
|      0 | 0.701136 |      2 |
|      0 |  1.87906 |      3 |
|      1 |  1.16093 |      1 |
|      1 |  2.18511 |      2 |
|      1 |  3.83464 |      3 |
|      2 |  1.36718 |      1 |
|      2 |   1.8867 |      2 |
|      2 |  2.71718 |      3 |
+--------+----------+--------+
9 rows in set (0.01 sec)
```

We need a subquery here, because according to [the manual]():
> Query result rows are determined from the FROM clause, after WHERE, GROUP BY, and HAVING processing, and windowing execution occurs before ORDER BY, LIMIT, and SELECT DISTINCT. 

So if we want to filter on the result of a window function like rank, we need to take our result from an inner query and then apply the filter in an outer query.

To answer the [second Reddit question](https://www.reddit.com/r/mysql/comments/hbx5kk/get_the_difference_between_two_values_in), we need to use `LAG()` and `LEAD()`. With them we can also process differences between two adjacent rows in the same partition:

```sql
root@localhost [kris]> select id, 
  -> sensor, 
  -> checktime, 
  -> value, 
  -> lag(value) over (partition by sensor order by checktime) - value as delta 
  -> from series 
  -> order by sensor, checktime;
+----+--------+---------------------+----------+----------------------+
| id | sensor | checktime           | value    | delta                |
+----+--------+---------------------+----------+----------------------+
|  9 |      0 | 2020-01-04 00:00:00 |  9.20321 |                 NULL |
|  5 |      0 | 2020-01-06 00:00:00 |  4.63966 |     4.56355619430542 |
…
|  3 |      0 | 2020-01-24 00:00:00 | 0.701136 |   1.7513115406036377 |
| 20 |      1 | 2020-01-03 00:00:00 |   5.3703 |                 NULL |
| 17 |      1 | 2020-01-07 00:00:00 |  6.00236 |  -0.6320672035217285 |
…
| 14 |      1 | 2020-01-31 00:00:00 |  3.83464 |  0.11126899719238281 |
| 28 |      2 | 2020-01-02 00:00:00 |  1.36718 |                 NULL |
| 25 |      2 | 2020-01-03 00:00:00 |  4.10965 |   -2.742463231086731 |
…
| 22 |      2 | 2020-01-30 00:00:00 |   1.8867 |    8.014503359794617 |
+----+--------+---------------------+----------+----------------------+
30 rows in set (0.00 sec)
```

We define a partition by sensor, and process values in each partition in temporal order (we generated our fake sensor data in random temporal order within a time window). We calculate the difference between the current value and the lagging (following) value as `delta`.

The way we have written the delta calculation highlights a pecularity of the syntax: The expression for the preceding value is not `LAG(value)`, it is `lag(value) over (partition by sensor order by checktime)`. We have to put the different `- value` behind the full window expression, not into the middle of it: `lag(value)-value over (partition by sensor order by checktime) as delta` yields a syntax error.

```sql
root@localhost [kris]> select id, sensor, checktime, value, lag(value)-value over (partition by sensor order by checktime) as delta from series order by sensor, checktime;
ERROR 1064 (42000): You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near '-value over (partition by sensor order by checktime) as delta from series order ' at line 1
```

Because `OVER()` expressions can become quite unwieldy (especially if you also define frames - not explained here - in them), they can be named and put into the select-statement at a place behind the `FROM` clause.

This gives us

```sql
root@localhost [kris]> select id, 
  -> sensor, 
  -> checktime, 
  -> value, 
  -> lag(value) over w - value as delta 
  -> from series 
  -> window w as (partition by sensor order by checktime);
+----+--------+---------------------+----------+----------------------+
| id | sensor | checktime           | value    | delta                |
+----+--------+---------------------+----------+----------------------+
|  9 |      0 | 2020-01-04 00:00:00 |  9.20321 |                 NULL |
|  5 |      0 | 2020-01-06 00:00:00 |  4.63966 |     4.56355619430542 |
…
```

as a different syntax with the same result. It is possible to define more than window, as long as they have different window names, and it is possible for a window to be referred to zero or more times.

The Manual on [Windows Functions](https://dev.mysql.com/doc/refman/8.0/en/window-functions.html).