---
layout: post
title:  "Things you didn't know about MySQL and Date and Time and DST"
author-id: isotopp
feature-img: assets/img/background/mysql.jpg
date: 2021-03-29 12:22:33 +0100
tags:
- lang_en
- mysql
---

(based on a conversation with a colleague, and [a bit of Twitter](https://twitter.com/isotopp/status/1376436003129462784))

## A Conundrum

A developer colleague paged me with this:

```sql
mysql> select
UNIX_TIMESTAMP("2021-03-26 03:07:00" + INTERVAL 2 YEAR) -
UNIX_TIMESTAMP("2021-03-26 02:07:00" + INTERVAL 2 YEAR) as delta\G
delta: 420
```

It is obviously wrong, and weirdly so. It only works for "2 year", not with other values:

```sql
mysql> select
UNIX_TIMESTAMP("2021-03-26 03:07:00" + INTERVAL 1-11 year_month) -
UNIX_TIMESTAMP("2021-03-26 02:07:00" + INTERVAL 1-11 year_month) as delta\G
delta: 3600

mysql> select
UNIX_TIMESTAMP("2021-03-26 03:07:00" + INTERVAL 1-12 year_month) -
UNIX_TIMESTAMP("2021-03-26 02:07:00" + INTERVAL 1-12 year_month) as delta\G
delta: 3600

mysql> select
UNIX_TIMESTAMP("2021-03-26 03:07:00" + INTERVAL 1-13 year_month) -
UNIX_TIMESTAMP("2021-03-26 02:07:00" + INTERVAL 1-13 year_month) as delta\G
delta: 3600
```

It has to be exactly 730 days (2 * 365 days, 2 years):

```sql
mysql> select
UNIX_TIMESTAMP("2021-03-26 03:07:00" + INTERVAL 729 day) -
UNIX_TIMESTAMP("2021-03-26 02:07:00" + interval 729 day) as delta\G
delta: 3600

mysql> select
UNIX_TIMESTAMP("2021-03-26 03:07:00" + INTERVAL 730 day) -
UNIX_TIMESTAMP("2021-03-26 02:07:00" + interval 730 day) as delta\G
delta: 420

mysql> select
UNIX_TIMESTAMP("2021-03-26 03:07:00" + INTERVAL 731 day) -
UNIX_TIMESTAMP("2021-03-26 02:07:00" + interval 731 day) as delta\G
delta: 3600
```

## The Reason

In our math, we have two expressions mixing MySQL Timestamp data types with UNIX Timestamp Integers.

So in the expression `UNIX_TIMESTAMP("2021-03-26 03:07:00" + INTERVAL 2 year) ` the part `"2021-03-26 03:07:00"` is a string, which is converted to a MySQL Timestamp type.

This MySQL Timestamp type is then used in an interval arithmethic expression to yield another MySQL Timestamp type.

This resulting MySQL Timestamp type is then fed into the UNIX_TIMESTAMP function, and produces an integer.

The same happens with `UNIX_TIMESTAMP("2021-03-26 02:07:00" + interval 2 year)`, producing another integer.

This is not the integer we are looking for:

```sql
mysql> select from_unixtime(UNIX_TIMESTAMP("2021-03-26 02:07:00" + interval 730 day)) as t\G
t: 2023-03-26 03:00:00

mysql> show global variables like "%time_zone%";
+------------------+--------+
| Variable_name    | Value  |
+------------------+--------+
| system_time_zone | CEST   |
| time_zone        | SYSTEM |
+------------------+--------+
```

### The First Level of Wrongness

The `2023-03-26` is the day of the proposed time zone switch for 2023.

On this date, in the CET/CEST time zone, `02:07:00` is an invalid timestamp. MySQL silently, without error or warning, rounds this up to the next valid timestamp, `03:00:00`.

This also happened yesterday:

```sql
$ mysql --show-warnings
mysql> select from_unixtime(unix_timestamp("2021-03-28 02:07:00")) as t\G
t: 2021-03-28 03:00:00
```

This should error, and must at least warn. It does neither.

### The Second Level of Wrongness

For

```sql
mysql> select from_unixtime(UNIX_TIMESTAMP("2021-03-26 02:07:00" + interval 730 day)) as t\G
t: 2023-03-26 03:00:00
```

there is the choice of producing the correct timestamp or producing an error. Silently fast forwarding to the next valid timestamp is incorrect in all cases.

## Setting UTC

The database is running with the `time_zone set` to `SYSTEM`, and the system is running with the `system_time_zone` (a read-only variable) set to `CEST` (was: `CET`), which was picked up after the server start (on my laptop, in this case).

```sql
mysql> show global variables like "%time_zone%";
+------------------+--------+
| Variable_name    | Value  |
+------------------+--------+
| system_time_zone | CEST   |
| time_zone        | SYSTEM |
+------------------+--------+
2 rows in set (0.01 sec)
t: 2023-03-26 03:00:00
```

Trying to set the `time_zone` to UTC fails. This is because the time_zone tables have not been loaded.

```sql
$ mysql_tzinfo_to_sql /usr/share/zoneinfo | mysql -u root -p'' mysql
...
```

With that, I can

```sql
$ mysql -u root -p
mysql> set global time_zone="UTC";
Query OK, 0 rows affected (0.00 sec)

mysql> set session time_zone="UTC";
Query OK, 0 rows affected (0.00 sec)
```

And with that, I can avoid the conversion:

```sql
mysql> select from_unixtime(unix_timestamp("2021-03-28 00:07:00")) as t;
+---------------------+
| t                   |
+---------------------+
| 2021-03-28 00:07:00 |
+---------------------+
1 row in set (0.00 sec)mysql> select from_unixtime(unix_timestamp("2021-03-28 01:07:00")) as t;
+---------------------+
| t                   |
+---------------------+
| 2021-03-28 01:07:00 |
+---------------------+
1 row in set (0.00 sec)mysql> select from_unixtime(unix_timestamp("2021-03-28 02:07:00")) as t;
+---------------------+
| t                   |
+---------------------+
| 2021-03-28 02:07:00 |
+---------------------+
1 row in set (0.00 sec)mysql> select from_unixtime(unix_timestamp("2021-03-28 03:07:00")) as t;
+---------------------+
| t                   |
+---------------------+
| 2021-03-28 03:07:00 |
+---------------------+
1 row in set (0.00 sec)
```

Thsi will also yield the correct result for the type-mixed difference I showed above:

```sql
mysql> select
UNIX_TIMESTAMP("2021-03-26 03:07:00" + INTERVAL 2 YEAR) -
UNIX_TIMESTAMP("2021-03-26 02:07:00" + INTERVAL 2 YEAR) as delta\G
delta: 3600
```

## Not mixing MySQL Date Types and UNIX Timestamps

The original math fails, because it mixes UNIX Timestamps and Date Interval Arithmethics.

We can handle this all the way in MySQL, using the extremely weird [`timestampdiff()`](https://dev.mysql.com/doc/refman/8.0/en/date-and-time-functions.html#function_timestampdiff) function (more on that below):

```sql
mysql> select 
  timestampdiff(
    second,
    date_add("2021-03-26 02:07:00", INTERVAL 2 YEAR), 
    date_add("2021-03-26 03:07:00", INTERVAL 2 YEAR)
  ) as t\G
t: 3600
```

We can handle this all the way in Integers with Unix Timestamps:

```sql
mysql> select 86400 * 365 as t \G
t: 31536000

mysql> select 
  (unix_timestamp("2021-03-26 03:07:00") + 2*31536000) - 
  (unix_timestamp("2021-03-26 02:07:00") + 2* 31536000) as t \G
t: 3600
```

Both give us correct results.

## Date and Time Syntax

MySQL provides you `INTERVAL` syntax with operators:

```sql
mysql> select "2021-03-29 10:02:03" + interval 1 hour as t\G
t: 2021-03-29 11:02:03
```

and with functions:

```sql
mysql> select date_add("2021-03-29 10:02:03", interval 1 hour) as t\G
t: 2021-03-29 11:02:03
```

Interval Syntax is weird. You can't

```sql
mysql> select "2021-03-29 10:02:03" + interval 1 month 1 hour as t\G
ERROR 1064 (42000): You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near '1 hour as t' at line 1
```

You can only

```sql
mysql> select "2021-03-29 10:02:03" + interval 1 month + interval 1 hour as t\G
t: 2021-04-29 11:02:03
```

With date_add() it is worse, because you have to nest:

```sql
mysql> select date_add("2021-03-29 10:02:03", interval 1 month + interval 1 hour) as t\G
ERROR 1064 (42000): You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near '1 hour) as t' at line 1
```

That would be then

```sql
mysql> select date_add(date_add("2021-03-29 10:02:03", interval 1 month), interval 1 hour) as t\G
t: 2021-04-29 11:02:03
```

So `date_add()` and `date_sub()` both take a timestamp and an interval, and can be written as `+` and `-`, avoiding the nesting.

## A Word of Warning on DIFF functions

There are two functions with underscores in the name, DATE_ADD() and DATE_SUB(), which take a timestamp and an interval. They produce a new timestamp.

There are three functions without underscores in the name DATEDIFF(), TIMEDIFF() and TIMESTAMPDIFF(), which take two timestamps and produce the difference. 

They are all subtly different, and the parameter order for TIMESTAMPDIFF() is the other way around.

Read carefully:

[`datediff(a, b)`](https://dev.mysql.com/doc/refman/8.0/en/date-and-time-functions.html#function_datediff) calculates the DATE difference as `a-b`. The time part of the timestamps is ignored.

```sql
mysql> select datediff(now() + interval 1 month, now()) as t\G
t: 31

mysql> select datediff(now() + interval 2 month, now() + interval 1 month) as t\G
t: 30
```

[`timediff(a, b)`](https://dev.mysql.com/doc/refman/8.0/en/date-and-time-functions.html#function_timediff) calculates the TIME difference as `a-b`. The DATE and TIME parts are being used. The range is limited to the range of the TIME type, which is from '-838:59:59' to '838:59:59'.

That is 5 weeks, less 1 hour and 1 second (5 weeks are 840 hours, `5 * 7 * 24`).

[`timestampdiff(unit, a, b)`](https://dev.mysql.com/doc/refman/8.0/en/date-and-time-functions.html#function_timestampdiff) can do "proper" difference between `b` and `a`. The result is reported in the unit specified. 

The order of the parameters is inexplicably reversed: We calculate `b-a`.

```sql
mysql> select timestampdiff(hour, "2021-03-29 10:02:03", "2021-03-29 10:02:03" + interval 1 month + interval 1 hour) as t\G
t: 745
```

# TL;DR

- The lack of warning and error is now a MySQL Service Request.
- The original problem comes up because of the mixing of Unix Timestamp Arithmethic and MySQL Interval Arithmethic.
- There are ways to do it pure play either way, and they both result in the right result.
- There is `DATEDIFF()`, `TIMEDIFF()`, and `TIMESTAMPDIFF()`, and they are weird, and inconsistent and you really, really want to read the [Date and Time Functions](https://dev.mysql.com/doc/refman/8.0/en/date-and-time-functions.html) page, very carefully.
