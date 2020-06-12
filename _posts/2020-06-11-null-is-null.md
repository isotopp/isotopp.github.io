---
layout: post
published: true
title: NULL is NULL
author-id: isotopp
date: 2020-06-11 13:31:00 UTC
tags:
- datenbanken
- mysql
- sql
- lang_en
feature-img: assets/img/background/mysql.jpg
---
A rewrite of [the same in German from 9 years ago]({% link _posts/2011-11-04-null-is-null.md %}).

Q> Hey, I got a UNIQUE INDEX, but I can store multiple rows with the same value, NULL. Is that correct?

{% highlight sql %}
a  b
1  2
1  2
{% endhighlight %}

This does not work, duplicate key. But

{% highlight sql %}
a  b
1  NULL
1  NULL
{% endhighlight %}

is allowed.

Kris> Please buy  [SQL für Smarties: Advanced SQL Programming](http://www.amazon.de/Joe-Celkos-SQL-Smarties-Programming/dp/0123820227) and eat it.

{% highlight sql %}
mysql> select * from t;
+----+------+
| id | d    |
+----+------+
|  1 | NULL |
|  2 |    2 |
|  3 |    3 |
|  4 | NULL |
+----+------+
4 rows in set (0.00 sec)

mysql> select count(*) as a, count(d) as b, count(coalesce(d, 0)) as c from t;
+---+---+---+
| a | b | c |
+---+---+---+
| 4 | 2 | 4 |
+---+---+---+
1 row in set (0.00 sec)

mysql> select d, coalesce(d, 0) as dc from t;
+------+------+
| d    | dc   |
+------+------+
| NULL |    0 |
|    2 |    2 |
|    3 |    3 |
| NULL |    0 |
+------+------+
4 rows in set (0.00 sec)
{% endhighlight %}

Kris> Also,

{% highlight sql %}
mysql> select 0=0, 1=1, 0=1, NULL=0, NULL=1, NULL=NULL;
+-----+-----+-----+--------+--------+-----------+
| 0=0 | 1=1 | 0=1 | NULL=0 | NULL=1 | NULL=NULL |
+-----+-----+-----+--------+--------+-----------+
|   1 |   1 |   0 |   NULL |   NULL |      NULL |
+-----+-----+-----+--------+--------+-----------+
1 row in set (0.00 sec)
{% endhighlight %}

Q> Ah, so it's because NULL is not a value, but nothing?

Kris> Nothing is not the right term. It's NULL. That has many meanings in SQL, it is not even consistent. It is also not None, null, nil, or undef in your host language. It is NULL. And what happens in detail you have to know.

{% highlight sql %}
mysql> create table tt ( t int null, unique (t));
Query OK, 0 rows affected (0.37 sec)

mysql> insert into tt values (1), (2), (2);
ERROR 1062 (23000): Duplicate entry '2' for key 't'
{% endhighlight %}

but

{% highlight sql %}
mysql> insert into tt values (1), (2), (NULL);
Query OK, 3 rows affected (0.00 sec)
Records: 3  Duplicates: 0  Warnings: 0

mysql> insert into tt values (NULL);
Query OK, 1 row affected (0.00 sec)

mysql> select * from tt;
+------+
| t    |
+------+
| NULL |
| NULL |
|    1 |
|    2 |
+------+
4 rows in set (0.00 sec)
{% endhighlight %}

Kris> This happens, because the UNIQUE INDEX checks if a currently existing value = the new value for this column. If true, the value is rejected. But comparing NULL to NULL is NULL for any operation. It's neither TRUE nor FALSE, it's NULL. Comparing any other value to NULL is also NULL, for any comparison operator.

{% highlight sql %}
mysql> select NULL = NULL, NULL <> NULL;
+-------------+--------------+
| NULL = NULL | NULL <> NULL |
+-------------+--------------+
|        NULL |         NULL |
+-------------+--------------+
1 row in set (0.00 sec)

mysql> select 1 = NULL, 1 <> NULL;
+----------+-----------+
| 1 = NULL | 1 <> NULL |
+----------+-----------+
|     NULL |      NULL |
+----------+-----------+
1 row in set (0.00 sec)

mysql> select 0 = NULL, 0 <> NULL;
+----------+-----------+
| 0 = NULL | 0 <> NULL |
+----------+-----------+
|     NULL |      NULL |
+----------+-----------+
1 row in set (0.00 sec)
{% endhighlight %}

Kris> Perl developers know undef and see

{% highlight perl %}

KK:~ kris$ perl -e '$a = undef; print "keks${a}keks\n";'
kekskeks
{% endhighlight %}

Kris> But SQL does

{% highlight sql %}
mysql> select concat('keks', 'keks') as keks, concat('keks',NULL,'keks') as nix;
+----------+------+
| keks     | nix  |
+----------+------+
| kekskeks | NULL |
+----------+------+
1 row in set (0.00 sec)
{% endhighlight %}

Kris> NULL is NULL, it is not Nothing or undef. It is not 0, and not "".

Kris> Perl developers again:

{% highlight perl %}
KK:~ kris$ perl -e '$a = undef; print 10+$a,"\n";'
10
{% endhighlight %}

Kris> Check SQL:

{% highlight sql %}
mysql> select 10 + NULL;
+-----------+
| 10 + NULL |
+-----------+
|      NULL |
+-----------+
1 row in set (0.00 sec)
{% endhighlight %}

Kris> So does NULL destroy everything it comes into contac with? Nope, it's not systematically correct. In aggregates, it is skipped.

{% highlight sql %}

mysql> select * from tt;
+------+
| t    |
+------+
| NULL |
| NULL |
|    1 |
|    2 |
+------+
4 rows in set (0.00 sec)

mysql> select count(t), sum(t) from tt;
+----------+--------+
| count(t) | sum(t) |
+----------+--------+
|        2 |      3 |
+----------+--------+
1 row in set (0.00 sec)
{% endhighlight %}

Kris> So avg(t) is defined as sum(t)/count(t) = 3/2 = 1.5

{% highlight sql %}

mysql> select count(t), sum(t), avg(t) from tt;
+----------+--------+--------+
| count(t) | sum(t) | avg(t) |
+----------+--------+--------+
|        2 |      3 | 1.5000 |
+----------+--------+--------+
1 row in set (0.00 sec)
{% endhighlight %}

Kris> To have a predicate function you can test with, you get ISNULL(). And an Operator, IS NULL.

{% highlight sql %}
mysql> select * from tt where t IS NULL;
+------+
| t    |
+------+
| NULL |
| NULL |
+------+
2 rows in set (0.00 sec)

mysql> select * from tt where isnull(t);
+------+
| t    |
+------+
| NULL |
| NULL |
+------+
2 rows in set (0.00 sec)
{% endhighlight %}

Kris> Then there is a nonstandard MySQL comparator, the spaceship, which normalizes NULL:

{% highlight sql %}
mysql> select * from tt as a join tt as b on a.t <=> b.t;
+------+------+
| t    | t    |
+------+------+
| NULL | NULL |
| NULL | NULL |
| NULL | NULL |
| NULL | NULL |
|    1 |    1 |
|    2 |    2 |
+------+------+
6 rows in set (0.00 sec)

mysql> select NULL <=> NULL, NULL <=> 0, NULL <=> 1;
+---------------+------------+------------+
| NULL <=> NULL | NULL <=> 0 | NULL <=> 1 |
+---------------+------------+------------+
|             1 |          0 |          0 |
+---------------+------------+------------+
1 row in set (0.00 sec)
{% endhighlight %}

Kris> Compare to a regular equality:

{% highlight sql %}
mysql> select * from tt as a join tt as b on a.t = b.t;
+------+------+
| t    | t    |
+------+------+
|    1 |    1 |
|    2 |    2 |
+------+------+
2 rows in set (0.00 sec)
{% endhighlight %}

Kris> And there is a variadic function which returns the leftmost non-NULL value, for providing defaults. 

{% highlight sql %}
mysql> select coalesce(t, 17) from tt;
+-----------------+
| coalesce(t, 17) |
+-----------------+
|              17 |
|              17 |
|               1 |
|               2 |
+-----------------+
4 rows in set (0.00 sec)
{% endhighlight %}

Kris> So we ask our developers to not use NULL values, or provide an explaination in business logic terms what exactly a NULL in a column means. If a query can yield NULL values, there must be a COALESCE().

Kris> Developers fail at NULL. If for tt, we ask for

{% highlight sql %}
mysql> select * from tt where t =1;
+------+
| t    |
+------+
|    1 |
+------+
1 row in set (0.00 sec)
{% endhighlight %}

what is the rest of the table? Which SQL-Statement would show be the other half of the universe?

{% highlight sql %}
mysql> select * from tt where t <> 1;
+------+
| t    |
+------+
|    2 |
+------+
1 row in set (0.00 sec)
{% endhighlight %}

Kris> But stuff is missing!

{% highlight sql %}
mysql> select * from tt where t IS NULL;
+------+
| t    |
+------+
| NULL |
| NULL |
+------+
2 rows in set (0.00 sec)
{% endhighlight %}

The opposite of `SELECT * from tt where t = 1` is precisely not  `select *
from tt where t <> 1`. It is `SELECT * from tt where t <> 1 OR t IS NULL`,
since `tt.t` is nullable. And because developers never get this right we try to discourage them from using these.