---
layout: post
published: true
title: "MySQL: NULL is NULL"
author-id: isotopp
date: 2020-08-25 17:10:00 UTC
tags:
- datenbanken
- mysql
- mysqldev
- sql
- lang_en
feature-img: assets/img/background/mysql.jpg
---
*Question:* Hey, I got a UNIQUE INDEX, but I can store multiple rows with the same value, NULL. That is surprising. Is that a bug?

> This is a rewrite of [the same in German from 9 years ago]({% link _posts/2011-11-04-null-is-null.md %}).

```sql
root@localhost [kris]> create table t ( a integer, b integer, unique (a,b));
Query OK, 0 rows affected (0.09 sec)

root@localhost [kris]> insert into t values (1, 2);
Query OK, 1 row affected (0.01 sec)

root@localhost [kris]> insert into t values (1, 2);
ERROR 1062 (23000): Duplicate entry '1-2' for key 't.a'
```

This does not work, as expected. But this does:

```sql
root@localhost [kris]> truncate table t;
Query OK, 0 rows affected (0.16 sec)

root@localhost [kris]> insert into t values ( 1, NULL);
Query OK, 1 row affected (0.02 sec)

root@localhost [kris]> insert into t values ( 1, NULL);
Query OK, 1 row affected (0.03 sec)

root@localhost [kris]> select * from t;
+------+------+
| a    | b    |
+------+------+
|    1 | NULL |
|    1 | NULL |
+------+------+
2 rows in set (0.00 sec)
```

Why is that?

This is usually where I point people at [SQL for Smarties: Advanced SQL Programming](https://www.amazon.de/gp/product/B00R17NZZC). The title is partially a lie, this book is starting without assuming anything, but it goes a long, long way into SQL. [Joe Celko](https://en.wikipedia.org/wiki/Joe_Celko) has been serving on the SQL standards committee for a long time, and also happens to be a very good teacher and writer.

Buy all his books, but if you are going to buy only one, choose this one.

## Handling NULL properly

NULL values do not behave like `False`, and not like `True`. They also do not behave like `undef`, `nil` or `None` in the programming language of your choice.

They also do not behave completely consistently. You need to learn the cases and actively look out for them. I am sorry, but SQL is 40+ years old, and sometime it shows.

Because of all this, we discourage NULL in schema definitions. When you want NULL values (or get them without wanting them, for example in a LEFT JOIN), you need to be able to tell their story. That is, you are expected to explain what they mean, and if that is not exactly one thing, you are looking at a problem. You are also expected to handle them.

Let’s have a look.

### Counting NULL

In `count()`, a NULL value does not count. Except when it does. The one case where it does is the `count(*)`, which is different from a `count(colname)`.

```sql
root@localhost [kris]> select * from t;
+------+------+
| a    | b    |
+------+------+
|    1 | NULL |
|    2 |    2 |
|    3 |    3 |
|    4 | NULL |
+------+------+
4 rows in set (0.00 sec)

root@localhost [kris]> select count(*) as count_star, count(b) as count_b, count(coalesce(b, 0)) as coalesced from t;
+------------+---------+-----------+
| count_star | count_b | coalesced |
+------------+---------+-----------+
|          4 |       2 |         4 |
+------------+---------+-----------+
1 row in set (0.00 sec)
```

We have a table with four rows. We can `count(*)`, and the result is 4. We can also `count(a)`, and that is still 4. When we `count(b)`, that’s 2.

There is a handy little variadic function called `coalesce()`. It is variadic, which means it takes one or more parameters. It returns the leftmost parameter that is not NULL. So you can `coalesce(delivery_address, billing_address, “Address unknown”)` and that works.

That’s a lot easier to read than a set of nested `IFNULL()`. You almost never need `IFNULL()`, you want `COALESCE()`.

### The Math of NULL

In comparisons, NULL behaves like this:

```sql
root@localhost [kris]> select 0=0, 1=1, 0=1, NULL=0, NULL=1, NULL=NULL;
+-----+-----+-----+--------+--------+-----------+
| 0=0 | 1=1 | 0=1 | NULL=0 | NULL=1 | NULL=NULL |
+-----+-----+-----+--------+--------+-----------+
|   1 |   1 |   0 |   NULL |   NULL |      NULL |
+-----+-----+-----+--------+--------+-----------+
1 row in set (0.00 sec)
```

“But I know that!” Yes, but are you aware of the consequences?

There are three outcomes of a comparison involving NULL values. Not two.

Watch this:

```sql
root@localhost [kris]> select * from t;
+------+------+
| a    | b    |
+------+------+
|    1 | NULL |
|    2 |    2 |
|    3 |    3 |
|    4 | NULL |
+------+------+
4 rows in set (0.00 sec)

root@localhost [kris]> select * from t where b=2 
  -> UNION ALL 
  -> select * from t where b <> 2;
+------+------+
| a    | b    |
+------+------+
|    2 |    2 |
|    3 |    3 |
+------+------+
2 rows in set (0.00 sec)

root@localhost [kris]> select * from t where b=2
  -> UNION ALL 
  -> select * from t where b <> 2
  -> UNION ALL
  -> select * from t where b IS NULL;
+------+------+
| a    | b    |
+------+------+
|    2 |    2 |
|    3 |    3 |
|    1 | NULL |
|    4 | NULL |
+------+------+
4 rows in set (0.00 sec)
```

The UNION ALL of a predicate and the negated predicate does not yield the full table in the presence of NULL values.

“Hey, `IS NULL`?” Yes, see the logic table above. Anything equals NULL is always NULL, which is not true. So we need a special comparison operator, `IS NULL` (and `IS NOT NULL`).

```sql
root@localhost [kris]> select * from t where b = NULL;
Empty set (0.00 sec)

root@localhost [kris]> select * from t where b IS NULL;
+------+------+
| a    | b    |
+------+------+
|    1 | NULL |
|    4 | NULL |
+------+------+
2 rows in set (0.00 sec)
```

You can now pause this article and grep your SQL for “= NULL”. I will wait for you to return.

This particular case is also why the UNIQUE INDEX from above can have multiple NULL rows: The database checks with equality (`=`) for the presence of the row, and if not True, it will admit the row. `(1, NULL) = (1, NULL)` will return NULL, which is not True, so the row is admitted a second time.

That NULL outcome is not limited to equality. Any comparison of anything to NULL is NULL, which is a third value that is not True nor False.

```sql
root@localhost [kris]> select NULL=NULL, NULL<>NULL, 1=NULL, 1<>NULL, 0=NULL, 0<>NULL;
+-----------+------------+--------+---------+--------+---------+
| NULL=NULL | NULL<>NULL | 1=NULL | 1<>NULL | 0=NULL | 0<>NULL |
+-----------+------------+--------+---------+--------+---------+
|      NULL |       NULL |   NULL |    NULL |   NULL |    NULL |
+-----------+------------+--------+---------+--------+---------+
1 row in set (0.00 sec)
```

### NULL and Functions

Perl people know `undef` and see

```perl
KK:~ kris$ perl -e '$a = undef; print "keks${a}keks\n";'
kekskeks
```

To them, SQL says "no cookie":

```sql
root@localhost [kris]> select concat('keks', 'keks') as double_cookie, concat('keks',NULL,'keks') as no_cookie;
+---------------+-----------+
| double_cookie | no_cookie |
+---------------+-----------+
| kekskeks      | NULL      |
+---------------+-----------+
1 row in set (0.00 sec)
```

And the same is true in math:

```perl
KK:~ kris$ perl -e '$a = undef; print 10+$a,"\n";'
10
```

but SQL does

```sql
root@localhost [kris]> select 10+0, 10+NULL;
+------+---------+
| 10+0 | 10+NULL |
+------+---------+
|   10 |    NULL |
+------+---------+
1 row in set (0.00 sec)
```

### NULL in aggregates

“So NULL is Antimatter that destroys anything it comes into contact with?” Not exactly. We already know that in `count(colname)` it is skipped. That is also true in other aggregates (with the special case of `count(*)`).

```sql
root@localhost [kris]> select count(b), sum(b), min(b), max(b), group_concat(b) from t;
+----------+--------+--------+--------+-----------------+
| count(b) | sum(b) | min(b) | max(b) | group_concat(b) |
+----------+--------+--------+--------+-----------------+
|        2 |      5 |      2 |      3 | 2,3             |
+----------+--------+--------+--------+-----------------+
1 row in set (0.00 sec)
```

That is a good thing, because `AVG(b)` is defined as `SUM(b)/COUNT(b)`, `5/2 = 2.5`. Go check it yourself.

And be careful what you count and why:

```sql
root@localhost [kris]> select b, count(b), count(*) from t group by b;
+------+----------+----------+
| b    | count(b) | count(*) |
+------+----------+----------+
| NULL |        0 |        2 |
|    2 |        1 |        1 |
|    3 |        1 |        1 |
+------+----------+----------+
3 rows in set (0.00 sec)
```

“But did you not say NULL values compare differently from each other? Why is there only one NULL pile in this GROUP BY?” I did not say that. I did say that NULL compares to anything as NULL, and it depends on what you do with this third result.

Turns out, GROUP BY does this.


### Handling NULL

So you now know that you cannot use normal predicates (=, >=, <=, <>) with NULL. We have specific NULL predicates and functions: `ISNULL()` as a predicate (true for NULL), `IS NULL` as an operator, and the `IFNULL()` conditional, and `COALESCE()` function I already pointed out above.

There is also the MySQL specific spaceship operator `<=>`, which normalizes NULL. It’s not standard SQL, be considerate in using it.

```sql
root@localhost [kris]> select NULL<=>NULL, NULL<=>0, NULL<=>1, 0<=>0, 1<=>1, 0<=>1;
+-------------+----------+----------+-------+-------+-------+
| NULL<=>NULL | NULL<=>0 | NULL<=>1 | 0<=>0 | 1<=>1 | 0<=>1 |
+-------------+----------+----------+-------+-------+-------+
|           1 |        0 |        0 |     1 |     1 |     0 |
+-------------+----------+----------+-------+-------+-------+
1 row in set (0.00 sec)
```

and

```sql
root@localhost [kris]> select * from t;
+------+------+
| a    | b    |
+------+------+
|    1 | NULL |
|    2 |    2 |
|    3 |    3 |
|    4 | NULL |
+------+------+
4 rows in set (0.00 sec)

root@localhost [kris]> select * from t as a join t as b on a.b = b.b;
+------+------+------+------+
| a    | b    | a    | b    |
+------+------+------+------+
|    2 |    2 |    2 |    2 |
|    3 |    3 |    3 |    3 |
+------+------+------+------+
2 rows in set (0.00 sec)

root@localhost [kris]> select * from t as a join t as b on a.b <=> b.b;
+------+------+------+------+
| a    | b    | a    | b    |
+------+------+------+------+
|    4 | NULL |    1 | NULL |
|    1 | NULL |    1 | NULL |
|    2 |    2 |    2 |    2 |
|    3 |    3 |    3 |    3 |
|    4 | NULL |    4 | NULL |
|    1 | NULL |    4 | NULL |
+------+------+------+------+
6 rows in set (0.00 sec)
```

## TL;DR

- Do not define tables with nullable columns. You are not prepared to handle them.
  - UNIQUE indexes on nullable columns aren’t.
- When having nullable columns, or producing nullable columns in the right hand side of a LEFT JOIN, wrap the results in a COALESCE().
- Know your NULL math, operators and functions.

And most importantly:

- NULL is NULL, it is not false, true, undef, nil or None.
