---
layout: post
title:  "Making an unexpected leap with interval syntax"
author-id: isotopp
feature-img: assets/img/background/mysql.jpg
date: 2021-04-02 12:34:56 +0100
tags:
- lang_en
- mysql
---

(based on a find by Ruud van Tol, and several Twitter contributions)

Ruud commented on [our DST discussion]({% link _posts/2021-03-29-mysql-date-time-dst.md %}) with

```sql
mysql> SELECT 
'2019-02-28 12:34:56'+ INTERVAL 1 YEAR + INTERVAL 1 DAY as a, 
'2019-02-28 12:34:56'+ INTERVAL 1 DAY + INTERVAL 1 YEAR  as b\G
a: 2020-02-29 12:34:56
b: 2020-03-01 12:34:56
```

2019 is a year before a leap year. Adding (left to right) a year brings us to `2020-02-28`, and then adding a day makes this `2020-02-29`, because it's a leap year.

On the other hand, adding a day first makes it `2019-03-01`, and then adding a year makes it `2020-03-01`, a different result.

Clearly, addition is not commutative on dates, and having a two step interval addition is breaking expectations here.

## Compound Interval Notation

MySQL is offering a bit of syntax for compound intervals. You can look it up in the [manual](https://dev.mysql.com/doc/refman/8.0/en/expressions.html#temporal-intervals).

To write up compound intervals, there is a select number of unit names that are actually allowed, and a special expression syntax for each one.

For example, you can `+ interval 12:23:56.789 hour_microsecond`, or `+ interval 01-01 year_month`. You can't jump a year and a day, because there is no unit for that. Instead you have to write this down in MySQL in a two step interval addition and suddenly order matters.

If you think that this is a cumbersome solution and a cumbersome syntax, you will see me nodding in agreement.

## Other databases

### SQLite

[Mohammed S. Al Sahaf](https://twitter.com/MohammedSahaf/status/1377771663350173705) contributes this syntax for [SQLite](https://sqlite.org/lang_datefunc.html):

```sql
sqlite> select
  date('2019-02-28', '+1 year', '+1 day') as a,
  date('2019-02-28', '+1 day', '+1 year') as b;
a           b
----------  ----------
2020-02-29  2020-03-01
```

confirming that this is not a problem specific to MySQL.

### Postgres

[Andreas Scherbaum](https://twitter.com/ascherbaum/status/1377617850509180932) demonstrates the more generic Postgres Syntax:

```sql
pgsql> SELECT 
'2019-02-28 12:34:56'::TIMESTAMP + INTERVAL '1 year 1 day' as a,
'2019-02-28 12:34:56'::TIMESTAMP + INTERVAL '1 day 1 year' as b;

a: 2020-02-29T12:34:56Z	
b: 2020-02-29T12:34:56Z	
```

This works, because Postgres offers a syntax for a single interval that can combine arbitrary units. So internally both times it's the same order of operations (a span of a year and a day) in a single interval.

The [two-step operation](http://sqlfiddle.com/#!17/76411/3/0) gives the same result as MYSQL.

```sql
pgsql> SELECT 
'2019-02-28 12:34:56'::TIMESTAMP + INTERVAL '1 year' + INTERVAL '1 day' as a,
'2019-02-28 12:34:56'::TIMESTAMP + INTERVAL '1 day' + INTERVAL '1 year' as b;

a: 2020-02-29T12:34:56Z	
b: 2020-03-01T12:34:56Z
```

### Cockroach

[Mohammed](https://twitter.com/MohammedSahaf/status/1377772984585367553) also demonstrates that Cockroach has the same syntax that allows Postgres to make the calculation in a single step:

```sql
Cockroach> select
'2019-02-28 12:34:56'::TIMESTAMP + INTERVAL '1 year 1 day' as a,
'2019-02-28 12:34:56'::TIMESTAMP + INTERVAL '1 day 1 year' as b;
              a             |             b
----------------------------+----------------------------
  2020-02-29 12:34:56+00.00 | 2020-02-29 12:34:56+00.00
```

## What to do about it?

I do not think that the different results for "a day and a year" and "a year and a day" for leap years in current MySQL are a bug, but they are certainly unexpected.

I do think the current syntax for compound intervals that MySQL has is cumbersome and limited. It is also different from Postgres and Cockroach.

Picking up Postgres/Cockroach interval notation would allow MySQL to get rid of "day_microsecond" and all the special expression syntaxes. It would also allow it to write arbitrary intervals with a much simpler notation.

So, MySQL, please consider

```sql
mysql> select '2019-02-29 12:34:56' + interval '1 day 1 year' as a;

a: 2020-02-29 12:34:56
```

sort it internally into a canonical expression and make it possible to jump to '2020-02-29 12:34:56' in a single interval jump.

Until then, make sure that you manually order your chained intervals into the proper sequence of steps. And if it is not from large to small, prepare to be surprised.
