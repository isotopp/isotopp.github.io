---
author: isotopp
title: "MySQL: Row Literals"
date: "2022-08-22T08:39:21Z"
feature-img: assets/img/background/mysql.jpg
tags:
- lang_en
- mysql
- mysqldev
---

Question on the Libera/#mysql IRC channel:

> Is there a way to split a simple select into multiple returned rows?
> For example, `select 1, 2, 3` to be returned as rows?

This is actually asking for a table literal notation.
I know of four ways to construct a table literal in MySQL:

# UNION ALL

The oldest way to construct a table literal in any SQL that supports `UNION` is the `UNION ALL` construct.
Write `SELECT` statements to return literal rows, and add them together to a table using `UNION ALL`:

```mysql
mysql> select i from (
    ->   select 1 as i union all
    ->   select 2 as i union all
    ->   select 3 as i
    -> ) as t;
+---+
| i |
+---+
| 1 |
| 2 |
| 3 |
+---+
3 rows in set (0.00 sec)
```

This has always worked, even on the oldest versions of MySQL.

# JSON_TABLE()

There is actually a function to turn a JSON expression into a result table, `JSON_TABLE()`.
It is documented [here](https://dev.mysql.com/doc/refman/8.0/en/json-table-functions.html).
The function exprects a JSON expression (or simply a literal JSON array in our case), and a JSON path expression with instructions on how to type and name the extracted values.

```mysql
mysql> select * from json_table( '[{"i": 1}, {"i":2}, {"i": 3} ]', 
    ->   "$[*]" columns(i int path "$.i")
    -> ) as t;
+------+
| i    |
+------+
|    1 |
|    2 |
|    3 |
+------+
3 rows in set (0.00 sec)
```

# `VALUES` statement and `ROW()` function

MySQL introduces the [`VALUES`](https://dev.mysql.com/doc/refman/8.0/en/values.html) statement and the `ROW()` function.
`VALUES` is a statement that returns a table constructed from literal values described with `ROW()` functions.
So in order to get the table for further processing, we need a subselect.

```mysql
mysql> select * from (
    ->   values row(1), row(2), row(3)
    -> ) as t;
+----------+
| column_0 |
+----------+
|        1 |
|        2 |
|        3 |
+----------+
3 rows in set (0.00 sec)
```

# `WITH` and `VALUES`

We can do the same, but use a Common Table Expression instead of a subselect:

```mysql
mysql> with t (i) as ( values row(1), row(2), row(3) ) 
    ->   select * from t;
+---+
| i |
+---+
| 1 |
| 2 |
| 3 |
+---+
3 rows in set (0.00 sec)
```
