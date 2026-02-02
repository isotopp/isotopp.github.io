---
author: isotopp
title: "MySQL: Moving Average"
date: 2021-11-24T22:28:27+01:00
feature-img: assets/img/background/mysql.jpg
tags:
  - lang_en
  - mysql
  - mysqldev
aliases:
  - /2021/11/24/mysql-moving-average.html
---

MySQL window functions can be used to calculate daily averages or moving averages for a 24h time window relatively easily.
In an [earlier article]({{< relref "2020-06-21-mysql-window-functions.md" >}}) basic window functions were already discussed.
In this article, we want to see how we can get daily buckets and moving averages.

A sample program is available, as usual, [on GitHub](https://github.com/isotopp/mysql-dev-examples/blob/master/mysql-rolling-window/rolling-window.py).

# Getting sample data

We will be working with a data table named `data`, with three columns: a sensor `id`, a measurement datetime `d` and a metric value `m` that was sampled at that time.
The table definition looks like this:

```python
@sql.command(help="Create a data table")
def setup_tables():
    sql_setup = [
        "drop table if exists data",
        """ create table data (
                id integer not null,
                d datetime not null,
                m integer not null,
                primary key (id, d)
        )""",
    ]

    for cmd in sql_setup:
        try:
            c = db.cursor()
            c.execute(cmd)
        except MySQLdb.OperationalError as e:
            click.echo(f"setup_tables: failed {e} with {cmd}.")
```

For one year, each day and for each of our 11 (0-10) sensors, 1001 values will be collected.
We insert a random time within the day, and a random measured value, an integer between 0 and 1000.

```python
@sql.command(help="Fill data table with test data")
@click.option("--start", default="2020-01-01 00:00:00", help="Start date and time yyyy-mm-dd hh:mm:ss")
@click.option("--end", default="2020-12-31 23:59:59", help="End date and time yyyy-mm-dd hh:mm:ss")
@click.option("--count", default=1000, help="Number of values per day")
def fill_table(start="2020-01-01 00:00:00", end="2020-12-31 23:59:59", count=1000):
    # Get rid of the old data
    cursor = db.cursor()
    cursor.execute("truncate table data")
    db.commit()

    today = datetime.datetime.fromisoformat(start)
    end = datetime.datetime.fromisoformat(end)
    one_day = datetime.timedelta(days=1)
    # For one year, for each day:
    while today < end:
        print(f"Date = {today}")
        # For each measurement time:
        for i in range(0, count):
            # a random sensor id, a random second in the day, and a random metric
            id = randint(0, 10)
            d = today + datetime.timedelta(seconds=randint(0, 86399))
            m = randint(0, 10000)
            # are written to the database.
            sql = "insert into data (id, d, m) values (%(id)s, %(d)s, %(m)s)"
            # If the (id, time) combination is not unique, we get an error that we pass
            try:
                cursor.execute(sql, {"id": id, "d": d, "m": m})
            except MySQLdb._exceptions.IntegrityError as e:
                # The Birthday Paradox in Action
                # print(e)
                pass
        db.commit()
        # next day.
        today += one_day
```

# Daily Buckets with GROUP BY

Window Queries are somewhat related to aggregations with GROUP BY:
With GROUP BY we make look at each row under the lens of the GROUP BY statement.
All rows that have equal values as listed in the GROUP BY clause land on the same pile.
We can then apply aggregation functions to measure the pile.

In our example, we could use `GROUP BY date(d)`.
That is, our `datetime` is turned into a `date`, the time component is cut off.
Two values with the same date, but different times, are considered identical and would land on the same pile.
Different `id` values or different metric values `m` are also not used to select different piles.

What we do is `GROUP BY id, date(d)`:

```python
@sql.command(help="Group by day")
def daily_groups():
    sql = """
    select id
         , date(d) as d
         , count(m) as cnt
         , sum(m) as total
         , sum(m)/count(m) as av 
      from data 
    group by id, date(d)
    order by id, d
    """
    cursor = db.cursor()
    cursor.execute(sql)
    result = cursor.fetchall()
    for row in result:
        print(f'id: {row["id"]:2d} date: {row["d"]}  -  cnt: {row["cnt"]:6d} sum: {row["total"]} average: {row["av"]}')
```

So two measurements from the same sensor-id and taken on the same date are put onto the same pile.

MySQL offers us a number of functions to measure the pile: [Aggregate Functions](https://dev.mysql.com/doc/refman/8.0/en/aggregate-functions.html).
We can `COUNT()` the number of rows, we can `SUM()` them up, we can ask for their `AVG()`, `MIN()` or `MAX()`.
But we can also ask for the values themselves as a comma separated list, using `GROUP_CONCAT()`.
We can also ask for the values to be turned into JSON using `JSON_ARRAYAGG()` or `JSON_OBJECTAGG()`.

In our example above, we ask for the sum and the count and calculate the average ourselves.
The output looks like this:

```console
$ ./rolling-window.py daily-groups | head -5
id:  0 date: 2020-01-01  -  cnt:     80 sum: 418888 average: 5236.1000
id:  0 date: 2020-01-02  -  cnt:     92 sum: 419129 average: 4555.7500
id:  0 date: 2020-01-03  -  cnt:     94 sum: 417583 average: 4442.3723
id:  0 date: 2020-01-04  -  cnt:     94 sum: 422754 average: 4497.3830
id:  0 date: 2020-01-05  -  cnt:    101 sum: 515639 average: 5105.3366

$ ./rolling-window.py daily-groups | head -369 | tail -5
id:  0 date: 2020-12-30  -  cnt:     95 sum: 513361 average: 5403.8000
id:  0 date: 2020-12-31  -  cnt:     94 sum: 480321 average: 5109.7979
id:  1 date: 2020-01-01  -  cnt:     86 sum: 415058 average: 4826.2558
id:  1 date: 2020-01-02  -  cnt:     93 sum: 443509 average: 4768.9140
id:  1 date: 2020-01-03  -  cnt:     84 sum: 453897 average: 5403.5357
```

Since we aggregate and order by id first, we get all values from sensor 0 first, for an entire year.
Then the values for sensor id 1 follow, starting again at the beginning of the year.
Each row of output has values for one day, because we aggregated that way.

We can see how for each of the 10 sensors, approximately 90 values per day exist, but the actual value varies.
We can also see that the average is around 5000, but again, it varies each day.

# Daily Partitions

Window functions work just like aggregates, if we ask for that with a PARTITION BY clause.
But they will return all rows instead of making piles.
So when we define `WINDOW w AS ( partition by id, date(d) order by id, d)`, we will get our sensors by sensor and by date.
Each new sensor id, and each new date will restart "data collection", that is, our sums or counts will be reset.

Our code:

```python
@sql.command(help="Partition by day")
def daily_partitions():
    sql = """
    select id
         , d
         , count(m) over w as cnt
         , sum(m) over w as total
         , sum(m) over w/count(m) over w as av 
      from data
  window w as (
    partition by id, date(d)
    order by id, d)
    """
    cursor = db.cursor()
    cursor.execute(sql)
    result = cursor.fetchall()
    for row in result:
        print(f'id: {row["id"]:2d} date: {row["d"]}  -  cnt: {row["cnt"]:6d} sum: {row["total"]} average: {row["av"]}')
```

We can check the sums and counts, and see them be restarted:

```console
$ ./rolling-window.py daily-partitions | less
id:  0 date: 2020-01-01 00:13:43  -  cnt:      1 sum: 6401 average: 6401.0000
id:  0 date: 2020-01-01 00:14:25  -  cnt:      2 sum: 15746 average: 7873.0000
id:  0 date: 2020-01-01 00:15:33  -  cnt:      3 sum: 19656 average: 6552.0000
...
id:  0 date: 2020-01-01 23:09:13  -  cnt:     79 sum: 411728 average: 5211.7468
id:  0 date: 2020-01-01 23:27:16  -  cnt:     80 sum: 418888 average: 5236.1000
id:  0 date: 2020-01-02 00:14:48  -  cnt:      1 sum: 5834 average: 5834.0000
id:  0 date: 2020-01-02 00:15:21  -  cnt:      2 sum: 10970 average: 5485.0000
...
id:  0 date: 2020-12-31 23:01:21  -  cnt:     92 sum: 475441 average: 5167.8370
id:  0 date: 2020-12-31 23:14:32  -  cnt:     93 sum: 475494 average: 5112.8387
id:  0 date: 2020-12-31 23:25:47  -  cnt:     94 sum: 480321 average: 5109.7979
id:  1 date: 2020-01-01 00:24:46  -  cnt:      1 sum: 7079 average: 7079.0000
id:  1 date: 2020-01-01 00:32:22  -  cnt:      2 sum: 7989 average: 3994.5000
id:  1 date: 2020-01-01 01:01:40  -  cnt:      3 sum: 14551 average: 4850.3333
```

We can see how each time the day changes or the id changes the sum and count values start over.
Initially our count is 1, the sum is 6401 and the average is larger than 5000.
As we proceed through the day, we can see how the average converges against that expected value.

After `2020-01-01 23:27:16` at a count of `80` the new day starts and the counters reset.

The same happens at the end of the year, at `2020-01-01 23:27:16` when we start over at the first of January, but with id=1.

# Moving average

Instead of partitioning the data set by date boundaries we can also define a moving window instead.
This window is based on either values, or on date values.
In our case, we want the latter: for each metric date `d`, we want to do our math on the preceding 24 hours.

In code:

```python
@sql.command(help="Sliding window query - 24h")
def daily_window():
    sql = """
    select id
         , d
         , count(m) over w as cnt
         , sum(m) over w as total
         , sum(m) over w/count(m) over w as av 
      from data
  window w as (order by d range between interval 1 day preceding and current row)
  """
    cursor = db.cursor()
    cursor.execute(sql)
    result = cursor.fetchall()
    for row in result:
        print(f'id: {row["id"]:2d} date: {row["d"]}  -  cnt: {row["cnt"]:6d} sum: {row["total"]} average: {row["av"]}')
```

The Window clause is `WINDOW w AS (order by d range between interval 1 day preceding and current row)`.
As we can see, the `id` is out of the picture here:
We cannot nest window definitions, and that means in this example we count and sum over the previous 24h of **all** sensors, not sensors with the same id as ours.

```console
id:  6 date: 2020-01-01 00:03:44  -  cnt:      1 sum: 3420 average: 3420.0000
id: 10 date: 2020-01-01 00:07:50  -  cnt:      2 sum: 5359 average: 2679.5000
id:  5 date: 2020-01-01 00:08:35  -  cnt:      3 sum: 12441 average: 4147.0000
...
id:  0 date: 2020-01-04 20:40:46  -  cnt:    998 sum: 4842406 average: 4852.1102
id:  7 date: 2020-01-04 20:41:49  -  cnt:    998 sum: 4842673 average: 4852.3778
id:  8 date: 2020-01-04 20:43:00  -  cnt:    997 sum: 4833426 average: 4847.9699
id:  1 date: 2020-01-04 20:43:05  -  cnt:    998 sum: 4837433 average: 4847.1273
...
id:  7 date: 2020-12-31 23:54:52  -  cnt:   1003 sum: 5089623 average: 5074.3998
id:  8 date: 2020-12-31 23:56:02  -  cnt:   1004 sum: 5092441 average: 5072.1524
id:  8 date: 2020-12-31 23:59:56  -  cnt:   1000 sum: 5059683 average: 5059.6830````
```

From the changing `id` values we can see that all sensors are considered.
The count also shows that in the middle of the field around 1000 values are considered - the amount of values in one 24h range.

An expression such as `order by id, d range between interval 1 day preceding and current row` is not valid: we get  

```console
MySQLdb._exceptions.OperationalError: (3587, "Window 'w' with RANGE N PRECEDING/FOLLOWING frame requires exactly one ORDER BY expression, of numeric or temporal type")
```

We would have to ask for values from one sensor, specifically:

```sql
    select id
         , d
         , count(m) over w as cnt
         , sum(m) over w as total
         , sum(m) over w/count(m) over w as av 
      from data
      where id = 0
  window w as (order by d range between interval 1 day preceding and current row)
```

and do that for each successive constant `id` value. 
That is not fast nor elegant.

```console
id:  0 date: 2020-01-01 00:13:43  -  cnt:      1 sum: 6401 average: 6401.0000
id:  0 date: 2020-01-01 00:14:25  -  cnt:      2 sum: 15746 average: 7873.0000
id:  0 date: 2020-01-01 00:15:33  -  cnt:      3 sum: 19656 average: 6552.0000
...
id:  0 date: 2020-04-01 02:48:29  -  cnt:     99 sum: 463956 average: 4686.4242
id:  0 date: 2020-04-01 03:07:43  -  cnt:    100 sum: 472922 average: 4729.2200
id:  0 date: 2020-04-01 03:15:23  -  cnt:    101 sum: 478127 average: 4733.9307
...
id:  0 date: 2020-12-31 23:01:21  -  cnt:     97 sum: 500889 average: 5163.8041
id:  0 date: 2020-12-31 23:14:32  -  cnt:     96 sum: 487287 average: 5075.9063
id:  0 date: 2020-12-31 23:25:47  -  cnt:     97 sum: 492114 average: 5073.3402
```

We would have to wrap all that into a dependent subquery to loop.
