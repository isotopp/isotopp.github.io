---
layout: post
title:  'MySQL: Basic usage of the JSON data type'
author-id: isotopp
feature-img: assets/img/background/mysql.jpg
date: 2020-09-03 22:57:10 +0200
tags:
- lang_en
- mysql
- mysqldev
- database
- erklaerbaer
---
MySQL 8 provides solid support for the JSON data type. The manual has [an overview of the data type](https://dev.mysql.com/doc/refman/8.0/en/json.html), a [JSON function reference](https://dev.mysql.com/doc/refman/8.0/en/json-functions.html), an [an overview on generated column indexes](https://dev.mysql.com/doc/refman/8.0/en/create-table-secondary-indexes.html#json-column-indirect-index), and [explains multi-values indexes](https://dev.mysql.com/doc/refman/8.0/en/create-index.html#create-index-multi-valued).


## Creating JSON columns

Creating JSON columns is easy: Make the column of the JSON data type, fill in valid JSON data.

```sql
mysql> create table t ( id integer not null primary key auto_increment, j json);
Query OK, 0 rows affected (0.11 sec)

mysql> insert into t (j) values 
-> ('null'),
-> ('true'),
-> ('false'),
-> ('1'),
-> ('"keks"'),
-> ('["eins", "zwei"]'),
-> ('{"eins": "one", "zwei": "two"}');
Query OK, 5 rows affected (0.02 sec)

mysql> select json_type(j) as type, json_valid(j) as valid, isnull(j) as sqlnull, j, id from t;
+---------+-------+---------+--------------------------------+----+
| type    | valid | sqlnull | j                              | id |
+---------+-------+---------+--------------------------------+----+
| NULL    |  NULL |       1 | NULL                           |  1 |
| NULL    |     1 |       0 | null                           |  2 |
| BOOLEAN |     1 |       0 | true                           |  3 |
| BOOLEAN |     1 |       0 | false                          |  4 |
| INTEGER |     1 |       0 | 1                              |  5 |
| STRING  |     1 |       0 | "keks"                         |  6 |
| ARRAY   |     1 |       0 | ["eins", "zwei"]               |  7 |
| OBJECT  |     1 |       0 | {"eins": "one", "zwei": "two"} |  8 |
+---------+-------+---------+--------------------------------+----+
8 rows in set (0.00 sec)

mysql> insert into t (j) values ('["incomplete", "array", "closing bracket"');
ERROR 3140 (22032): Invalid JSON text: "Missing a comma or ']' after an array element." at position 41 in value for column 't.j'.
```

We learn several things from this experiment:

- Literal JSON values are always simple strings.
  - The character set in JSON objects is `utf8mb4`, the collation is `utf8mb4_bin`.
  - Because the collation is a `_bin` collation, comparison is case sensitive. Charset and collation are fixed and cannot be changed without casting to a non-JSON type.
  - We enclose them in single quotes, leveraging the fact that MySQL allows both single and double quotes as string terminators. This saves us a lot of quoting.
  - JSON null is written as the string `'null'`.
  - JSON true is written as the string `'true'`.
  - JSON false is written as the string `'false'`.
- We allowed NULL values in our JSON column definition by not providing a `NOT NULL` clause. SQL `NULL` is different from JSON `'null'`, but is cast to this.
- We can use the `JSON_TYPE()` function to check the JSON type inside the JSON column.
- The JSON is parsed, and checked for validity. The `JSON_VALID()` function does the checking. 
  - It also exposes the difference between SQL `NULL` and JSON `'null'`. So does the SQL `ISNULL()` function (or the `IS NULL` comparison operator).

## Creating JSON values

We can see JSON literal notation already from the previous example. There are also two utility functions to construct JSON array and object structures from SQL scalars. They are `JSON_ARRAY()` and `JSON_OBJECT()`. Note the handling of SQL `NULL` values.

```sql
mysql> select json_array(1, NULL, 2) as ary, json_object("eins", "one", "null",
NULL, "zwei", "two") as obj;
+--------------+----------------------------------------------+
| ary          | obj                                          |
+--------------+----------------------------------------------+
| [1, null, 2] | {"eins": "one", "null": null, "zwei": "two"} |
+--------------+----------------------------------------------+
1 row in set (0.01 sec)
```

We can use `JSON_MERGE_PRESERVE()` and `JSON_MERGE_PATCH()` to incrementally build complicated structures. `JSON_MERGE_PRESERVE()` replaces `JSON_MERGE()`, which is deprecated and should no longer be used.

```sql
mysql> select json_merge_preserve('[3, 4, 5]', '[1, 2, 3]') as preserve, json_merge_patch('[1, 2, 3]', '[3, 4, 5]') as patch\G
preserve: [3, 4, 5, 1, 2, 3]
   patch: [3, 4, 5]
1 row in set (0.00 sec)

mysql> select json_merge_preserve('{"eins": "one", "zwei": "two"}', '{"zwei": "two", "drei": "three"}') as preserve, json_merge_patch('{"eins": "one", "zwei": "two"}', '{"zwei": "two", "drei": "three"}') as patch\G
preserve: {"drei": "three", "eins": "one", "zwei": ["two", "two"]}
   patch: {"drei": "three", "eins": "one", "zwei": "two"}
1 row in set (0.00 sec)
```

Quotes and quoting can be a bit painful, and even confusing. Let's put the string `A so-called "string".` into a JSON string, inside an SQL statement. To turn this text into a JSON string we need to put double quotes around it, quoting our internal double quotes with backslashes. To produce a backslash literal, we need to write a double backslash.

The result:

```sql
mysql> insert into t (j) values ('"A so-called \\"string\\"."');
Query OK, 1 row affected (0.02 sec)

mysql> select last_insert_id() as id\G
id: 9
1 row in set (0.00 sec)
```

We can get this back as `j`, or use JSON extractors (`JSON_EXTRACT()`, or `->`). The current document is `$`, so:

```sql
mysql> select j, j->'$' as jj, j->>'$' as jj_unquoted from t where id = 9\G
          j: "A so-called \"string\"."
         jj: "A so-called \"string\"."
jj_unquoted: A so-called "string".
1 row in set (0.00 sec)
```

This brings us to component access:

## JSON component access

Using the `JSON_EXTRACT()` function and JSON path syntax, we can access fields in the JSON and select for them, as foreshadowed above.

We get the following selectors:

- `$`, the current JSON document.
- `.key`, select the `key` from the current object. Use `."key with space"` when necessary.
- `[N]` selects the element `N` from a JSON array, starting to count at 0.
  - `."equipment-ids"[1]` is interesting, because we need to quote `"equipment-ids"` due to the dash in the key name. We must not put the array index into the quotes, though, or it won't work.
  - For an array slice, the syntax is `[M to N]` for the slice from `N` to `M` inclusive.
  - For arrays, the keyword `last` is the rightmost element in the array.
- There are wildcards:
  - `.*` are all values of a JSON object, as an array.
  - `[*]` are all the values of a JSON array, as an array.
  - `**` are all paths that lead to a suffix.

So, put into practice:

```sql
mysql> insert into t (id, j) values (10, '{"id": 10, "login": "kris", "fullname": "Kristian \\"Isotopp\\" Köhntopp", "equipment-ids": [10, 11, 12], "borrowed":{ "equipment-ids": [1,2,3]}}');
Query OK, 1 row affected (0.01 sec)

mysql> select json_extract(j, '$.fullname') as f1, json_value(j, '$.fullname') as f2 from t where id =10\G
f1: "Kristian \"Isotopp\" Köhntopp"
f2: Kristian "Isotopp" Köhntopp
1 row in set (0.00 sec)

mysql> select json_extract(j, '$."equipment-ids"[1]') as jj from t where id = 10\G
jj: 11
1 row in set (0.00 sec)

mysql> select json_extract(j, '$."equipment-ids"[1 to 2]') as jj from t where id
 = 10\G
jj: [11, 12]
1 row in set (0.00 sec)

mysql> select json_extract(j, '$.*') as jj from t where id = 10\G
jj: [10, "kris", {"equipment-ids": [1, 2, 3]}, "Kristian \"Isotopp\" Köhntopp", [10, 11, 12]]
1 row in set (0.00 sec)

mysql> select json_extract(j, '$."equipment-ids"[*]') as jj from t where id = 10
\G
jj: [10, 11, 12]
1 row in set (0.00 sec)

mysql> select json_extract(j, '$**."equipment-ids"') as jj from t where id =10\G
jj: [[10, 11, 12], [1, 2, 3]]
1 row in set (0.00 sec)
```

This is cumbersome to write, so we also get `colname->selector` as a shorthand for the `JSON_EXTRACT(colname, selector)` function:

```sql
mysql> select j->'$."equipment-ids"[*]' as jj from t where id = 10\G
jj: [10, 11, 12]
1 row in set (0.00 sec)
```

## From JSON values to SQL values

With our table from above, we are setting us up like this:

```sql
mysql> truncate table t;
Query OK, 0 rows affected (0.06 sec)

mysql> insert into t (j) values ('{"user": "kris", "paid": true, "home": "/home/kris"}');
Query OK, 1 row affected (0.02 sec)

mysql> insert into t (j) values ('{"user": "sven", "paid": false, "home": "/home/sven"}');
Query OK, 1 row affected (0.03 sec)
```

We can ask for the payment status of all our users already, using the syntax from above:

```sql
mysql> select j->"$.user" as user, j->"$.paid" as paid from t;
+--------+-------+
| user   | paid  |
+--------+-------+
| "kris" | true  |
| "sven" | false |
+--------+-------+
2 rows in set (0.00 sec)
```

We cannot SQL `SELECT` all users that have paid, yet:

```sql
mysql> select j->"$.paid" as paid from t where j->"$.paid";
+-------+
| paid  |
+-------+
| true  |
| false |
+-------+
2 rows in set, 1 warning (0.00 sec)

Warning (Code 3986): Evaluating a JSON value in SQL boolean context does an implicit comparison against JSON integer 0; if this is not what you want, consider converting JSON to a SQL numeric type with JSON_VALUE RETURNING

mysql> select j->"$.user" as user, j->"$.paid" as paid from t where json_value(j, '$.paid' returning signed);
+--------+------+
| user   | paid |
+--------+------+
| "kris" | true |
+--------+------+
1 row in set (0.00 sec)
```

The function [`JSON_VALUE()`](https://dev.mysql.com/doc/refman/8.0/en/json-search-functions.html#function_json-value) provides a type cast from JSON to SQL, making extracted JSON values available to SQL comparisons and conditions. Follow the link and look it up. There is no `INTEGER`, you have to be more specific, `SIGNED` or `UNSIGNED`, the types match the ones used in `CAST()`. There are also `ON EMPTY` and `ON ERROR` clauses.

Using `JSON_VALUE()` we can do the work of `JSON_EXTRACT()`, `JSON_UNQUOTE()` and `CAST()` in one go, and have control about handling of non-existent paths (`ON EMPTY`) and conversion errors (`ON ERROR`).

We could have used cast as well:

```sql
mysql> select j->"$.user" as user,
->   j->"$.paid" as paid, 
->   cast(j->"$.paid" as signed) as casted, 
->   json_value(j, "$.paid" returning signed) as valued 
-> from t;
+--------+-------+--------+--------+
| user   | paid  | casted | valued |
+--------+-------+--------+--------+
| "kris" | true  |      1 |      1 |
| "sven" | false |      0 |      0 |
+--------+-------+--------+--------+
2 rows in set (0.00 sec)

mysql> select j->"$.user" as user,
->   j->"$.paid" as paid 
-> from t
-> where cast(j->"$.paid" as signed);
+--------+------+
| user   | paid |
+--------+------+
| "kris" | true |
+--------+------+
1 row in set (0.00 sec)


mysql> select j->"$.user" as user, 
-> j->"$.paid" as paid 
-> from t 
-> where json_value(j, "$.paid" returning signed);
+--------+------+
| user   | paid |
+--------+------+
| "kris" | true |
+--------+------+
1 row in set (0.00 sec)
```

Note that I left out the `JSON_UNQUOTE()` in the `CAST()` example, because I converted JSON `BOOLEAN` types to SQL `SIGNED` types, so no quoted strings needed handling. `JSON_VALUE(col, selector RETURNING type)` is actually `CAST(JSON_UNQUOTE(JSON_EXTRACT(col, selector)) AS type)`.

## Updating JSON values

Reusing the example above, we can try to update the payment status of a user using the [`JSON_SET()`](https://dev.mysql.com/doc/refman/8.0/en/json-modification-functions.html#function_json-set) function. Doing this, we need to be careful.

First, let's check if we can isolate the row we want to see elegantly:

```sql
mysql> select j->"$.user" as user, 
-> j->"$.paid" as paid,  
-> json_type(j->"$.paid") as paid from t;
+--------+-------+---------+
| user   | paid  | paid    |
+--------+-------+---------+
| "kris" | true  | BOOLEAN |
| "sven" | false | BOOLEAN |
+--------+-------+---------+
2 rows in set (0.00 sec)

mysql> select j->"$.user" as user, 
-> j->"$.paid" as paid 
-> from t 
-> where j->"$.user" = "kris";
+--------+------+
| user   | paid |
+--------+------+
| "kris" | true |
+--------+------+
1 row in set (0.00 sec)

mysql> select j->"$.user" as user, 
-> j->"$.paid" as paid 
-> from t 
-> where j->"$.user" = "KRIS";
Empty set (0.00 sec)
```

We notice: while this works, it is working with JSON character sets, so it is `utf8mb4` with a collation of `utf8mb4_bin`, hence case sensitive comparison.

Using `JSON_SET()` we update the `$.paid` field of that user to `false`, and run into the next problem:

```sql
mysql> update t 
-> set j=json_set(j, "$.paid", "false" ) 
-> where j->"$.user" = "kris";
Query OK, 1 row affected (0.01 sec)
Rows matched: 1  Changed: 1  Warnings: 0

mysql> select * from t;
+----+---------------------------------------------------------+
| id | j                                                       |
+----+---------------------------------------------------------+
|  1 | {"home": "/home/kris", "paid": "false", "user": "kris"} |
|  2 | {"home": "/home/sven", "paid": false, "user": "sven"}   |
+----+---------------------------------------------------------+
2 rows in set (0.00 sec)

mysql> select j->"$.user" as user, 
-> j->"$.paid" as paid, 
-> json_type(j->"$.paid") as paid 
-> from t;
+--------+---------+---------+
| user   | paid    | paid    |
+--------+---------+---------+
| "kris" | "false" | STRING  |
| "sven" | false   | BOOLEAN |
+--------+---------+---------+
2 rows in set (0.00 sec)
```

That is not what we want. But did we not insert values `"false"` and `"true"` into JSON fields earlier and got booleans?

```sql
mysql> insert into t (id, j) values (3, "false");
Query OK, 1 row affected (0.00 sec)

mysql> select id, j, json_type(j) as type from t where id = 3;
+----+-------+---------+
| id | j     | type    |
+----+-------+---------+
|  3 | false | BOOLEAN |
+----+-------+---------+
1 row in set (0.00 sec)
```

Well, yes, but…

Functions in MySQL expect types, and convert to these types. `JSON_SET()` expects JSON, so we do it like this:

```sql
mysql> update t 
-> set j=json_set(j, "$.paid", false ) 
-> where j->"$.user" = "kris";
Query OK, 1 row affected (0.01 sec)
Rows matched: 1  Changed: 1  Warnings: 0

mysql> select id, j, json_type(j) as type from t where id = 1;
+----+-------+---------+
| id | j     | type    |
+----+-------+---------+
|  1 | false | BOOLEAN |
+----+-------+---------+
1 row in set (0.00 sec)
```

There is [`JSON_REMOVE()`](https://dev.mysql.com/doc/refman/8.0/en/json-modification-functions.html#function_json-remove), "Removes data from a JSON document". There are also [`JSON_SET()`](https://dev.mysql.com/doc/refman/8.0/en/json-modification-functions.html#function_json-set), and friends:

- [`JSON_SET()`](https://dev.mysql.com/doc/refman/8.0/en/json-modification-functions.html#function_json-set) replaces existing values and adds nonexisting values.
- [`JSON_INSERT()`](https://dev.mysql.com/doc/refman/8.0/en/json-modification-functions.html#function_json-insert) inserts values without replacing existing values.
- [`JSON_REPLACE()`](https://dev.mysql.com/doc/refman/8.0/en/json-modification-functions.html#function_json-replace) replaces only existing values.

These are the basic tools we need to get JSON into and out of tables. We now just need to make it fast - the stuff for another article.

