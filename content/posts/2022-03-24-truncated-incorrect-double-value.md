---
author: isotopp
date: "2022-03-24T08:40:00Z"
feature-img: assets/img/background/mysql.jpg
title: "Truncated incorrect DOUBLE value"
tags:
- mysql
- mysqldev
- lang_en
---

I record this for posteriority without much comment.

The error message "Truncated incorrect DOUBLE value" when issued by MySQL can be a confused parser, and masks unintended barely legal syntax:

```sql
kris@localhost [kris]> select * from testtable;
+----+------+
| id | d    |
+----+------+
|  1 | eins |
|  2 | zwei |
|  3 | drei |
+----+------+
3 rows in set (0.00 sec)
 
kris@localhost [kris]> update testtable set d="vier" and id = 4 where id = 3;
ERROR 1292 (22007): Truncated incorrect DOUBLE value: 'vier'
```

The actual problem here is the incorrect use of `and` in the `set`-clause of the `update` statement when a comma was intended.

```sql
kris@localhost [kris]> update testtable set d="vier", id = 4 where id = 3;
Query OK, 1 row affected (0.02 sec)
Rows matched: 1  Changed: 1  Warnings: 0
```

Technically, an `and` is possible and legal, if you wanted to produce a `boolean`.
Most people do not want this at this point in the statement, though.
The error message is particularly unhelpful if you have no access to the literal raw SQL string for whatever reason.
