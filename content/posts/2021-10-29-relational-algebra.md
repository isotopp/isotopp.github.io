---
author: isotopp
date: "2021-10-29T14:06:51Z"
feature-img: assets/img/background/mysql.jpg
title: 'Relational, and an Algebra'
tags:
- lang_en
- mysql
- mysqldev
---

What is "relational" and "algebra" about "Relational Algebra" and SQL?

> **It is likely that you know all this.**
> 
> There is nothing new in this text, if you had Databases 101 in school or university, so you do not have to read any of this.
> In case you had not, or you forgot because it was a long time ago, here it is, again.

![](/uploads/vorsicht_mathe.png)

*This is the english version of a [much older german writeup]({{< relref "/2010-04-28-was-bedeutet-eigentlich-relationale-algebra.md" >}}).

# Algebra
An "Algebra" is a structure that is defined on base set A, with one or more operations on it.
That structure is an algebra, if the result of every operation leads to results that are again in that base set A.

So if you have a thing and math on it, the result is again in that thing, and *you can continue to math on it*.

# Natural numbers and Addition and all the pain that follows

The most well known of these structures is the set of natural numbers and addition {𝐍, +}:

If you take two natural, integer, positive numbers and add them, the result is again in that set, a natural, integer and positive number, so you can continue to add.

If you make it more complicated and take on another operation, subtraction, that is no longer true:
4-6 is -2, which is not in 𝐍, it is integer, but not positive.
We just left the set of natural numbers 𝐍, and now need whole numbers 𝐙 instead to make {𝐙, +, -} an algebra.

There is a whole branch of math, axiomatic number theory, that deals with the ever more complicated things we get in our desire to have an algebra for math with numbers:

You start with the empty set and the set that contains the empty set to get 𝐍 in the first place, define addition.
By having a desire for inverse operations, you invent subtraction and need 𝐙.

You invent a shorthand "multiplication" for repeated addition, and want the inverse, division, and suddenly you need 𝐐, the rational numbers.

Then you shorthand "powers" for repeated multiplication, take the inverse,  roots, and have irrational numbers, and finally 𝐑, the set of real numbers as the union of rational and irrational numbers.

All is good, the sun is shining, except one day you take the square root of -1, and end up with 𝐂, the complex numbers, and suddenly you lose total order.
As you descend into this more, you discover Quaternions (and lose commutativity) and other, more complicated structures and lose one nice property after the other.

**But this text is not that story,** we are doing computer science here, not math.

There is all kind of weirdness in computer math, too, with machine epsilon and the lack of commutativity, and the number size dependent precision, but again, that is not our story here.

**We do not even do numbers in our department,** but more on that later.

First we need to talk about

# Relations (and Functions)

In math, a function is a thing that maps one set onto another set – or the same set, if you have an algebra.

This is y=0.5x+2, a function that maps 𝐑 on 𝐑, producing a line.

The thing that makes it a function is that for any x, we get exactly one result, exactly one y. 
Draw a vertical line from any point on the x-axis, and it will only ever hit the line of the function in exactly one spot.

![](/uploads/2021/10/algebra-function.jpg)

There are of course also things that for one given x give you more than one y value.

An example would be y<0.5x+2, all y that are smaller than some value derived from x: That's a relation.

![](/uploads/2021/10/algebra-relation.jpg)

**That's enough math for one day.** We still want to do computer science.

So the first order of the day is to get rid of all these stupid infinities. 
Complex, real, rational, yes, even natural numbers - that's a lot of infinite, intangible brain farts from weird math geeks.

We want proper values that are touchable and that can be seen with a debugger in memory.

Computer science does discrete math, all finite, all represented in tangible bits.

That also allows us to define a function (or relation) as a lookup table instead of a formula. 
If it returns more than a single value (more than a single table row) it is not a function, as we have learned - it is a relation.

And thus we end up dealing with tables, and multiple result rows, and the ability to query the query results further - that is "relational" and "an algebra".

# Relational Algebra: Math with Tables

An Algebra is a base set, and a number of operations you can perform on the elements of that set, and we demand that the result of any operation again is an element of the base set so that we can math on.

Our base set is "tables". 
Tables have rows, and each row has the same number of cells.
Such a row is called "a tuple of n values" or "n-tuple", and is usually written with round parens: `(3, 4, 5)` for a 3-tuple with the integers 3, 4 and 5.

In computer science there are two big camps of people:
one wants data types attached to slots, static type persons.
The other wants data types attached to values, dynamic type persons.
Most SQL databases want static types, so you do not define a row as "3 columns", but you would say `(int, char(20), double)` as an example.
The only SQL product I know of that is different here is SQLite.

# Operations on tables that produce new tables

- Selection - cut out rows
- Projection -  cut out columns (or make new ones)
- Join (Cross Product) - combine tables
- Rename (tables, columns) - so that you can Join a table with itself
- Aggregation - make piles of things considered equal under a projection

## Selection, Projection

![](/uploads/2021/10/algebra-ops1.jpg)

*The Selection and Projection operations.*

The *SELECTION* operation selects a row from a table. In SQL, this is a `WHERE` clause:

```sql
SELECT a, b, c FROM t WHERE a = 1
```

The *PROJECTION* operation selects a column from a table.
In SQL, it is an expression in the `SELECT` clause.

```sql
SELECT b FROM t
```

We can also use projection and rename to make new columns:

```sql
SELECT a, b, c, concat(a, b) AS ab, 17 AS seventeen FROM t
```

This will make a copy of the original table, and add two more columns, one the concatenation of a and b, and the other a constant number.
We use `AS` to rename the columns from a machine selected name to a name of our choice.

## Join

![](/uploads/2021/10/algebra-ops2.jpg)

*The Join operation.*

The *JOIN* operation combines two tables so that each row from table `a` is matched with each row of table `b` once for all possible combinations, a cross product.

Originally, we wrote this as a comma, and added additional selection clauses to the `WHERE` condition to select only the rows we wanted:

```sql
SELECT a.aid, b.aid, b.bid FROM a,b WHERE a.aid = b.aid
```

For a number of reasons that is unwieldy:

- It makes it hard to see what is an actual selection, and what is part of the join condition.
- It creates scoping problems with names
- It has no syntax for other join types than a full cross join.
- So since 1992 we write the `JOIN … ON …` keyword, and can specify different join types by using different keywords (`JOIN`, `LEFT JOIN`, `RIGHT JOIN`, `OUTER JOIN`)

The *JOIN* above then becomes:

```sql
SELECT a.aid, b.aid, b.bid FROM a JOIN b ON a.aid = b.aid WHERE <actual constraints>
```

## Renaming tables for self-references

![](/uploads/2021/10/algebra-ops3.jpg)

*The Rename operation used in a self-join context.*

There is a group of problems, list-of-parts problems or self-referential structures, that can only be modeled with a table rename.
The rename operation and the `AS` keyword are very old, but SQL that can actually walk such structures is rather new - Recursive Common Table Expressions ([Recursive CTEs and the WITH keyword](https://dev.mysql.com/doc/refman/8.0/en/with.html)).

The basic self-join looks like this:

```sql
SELECT emp.empid AS employee, " has the boss ", boss.empid AS boss
  FROM emp AS boss JOIN emp ON emp.bossid = boss.empid
```

This expression uses the `emp` table twice, and in order to be able to decide which instance we are referring to, the `AS` keyword is needed to give each instance a unique name.

## Aggregates

The fifth and final operation is the aggregation, with the `GROUP BY` keyword.
To aggregate, you project a table virtually, and pile all rows that are identical under the projection onto the same heap, then measure heaps with aggregation functions.

If that sounds weird, look at the drawing:

![](/uploads/2021/10/algebra-ops4.jpg)

*The Aggregate operation.*

This is a

```sql
SELECT bossid, ... FROM emp GROUP BY bossid
```

We group `emp` by `bossid`, that is, we put all rows from `emp` that have the same value for `bossid` onto the same pile.
We can only reference columns that we mention in the `GROUP BY`, or measure the piles using aggregation functions such as `COUNT()`, `SUM()`, `AVG()` and others, e.g. `GROUP_CONCAT()`.

```sql
mysql> select
->    emp.bossid,
->    count(*),
->    group_concat(emp.empid) as empids
-> from
->    emp
-> group by
->    emp.bossid;
+--------+----------+-------------+
| bossid | count(*) | empids      |
+--------+----------+-------------+
|   NULL |        1 | 1           |
|      1 |        2 | 2,3         |
|      2 |        3 | 4,5,6       |
+--------+----------+-------------+
3 rows in set (0.00 sec)
```

# Subqueries: Mathing on with Tables

So we now have a base set, tables, and five table operators that make new tables.
This is supposedly an algebra, so we should be able to apply SQL to the tables made by SQL statements.

We have that - **Subqueries**.

## Scalar Subqueries, and new columns

We can [put SELECT expressions into any position of the SQL statement](https://jan.kneschke.de/projects/mysql/groupwise-max/) in place of constants, column names or expressions.
When we put a `SELECT` into a place of a scalar value, it must return a 1x1 table, of course, to be able to be cast to a scalar (of the appropriate type).

```sql
root@localhost [kris]> select sum(bid) from b;
+----------+
| sum(bid) |
+----------+
|        3 |
+----------+
1 row in set (0.00 sec)

root@localhost [kris]> select aid, (
->    select sum(bid) from b ) as bsum
-> from a;
+-----+------+
| aid | bsum |
+-----+------+
|   1 |    3 |
|   2 |    3 |
|   3 |    3 |
+-----+------+
3 rows in set (0.03 sec)
```

Can we make new columns from values that are the result of another select? Yes, we can!

## Joining against a Subquery

We can also join against tables that are the results of another select.

We start with a query that finds for each schema the number of rows that the largest table in that schema has:

```sql
mysql> select 
->    table_schema, 
->    max(table_rows)
-> from 
->    information_schema.tables 
-> group by 
->    table_schema;
+--------------------+-----------------+
| table_schema       | max(table_rows) |
+--------------------+-----------------+
| geodb              |          459015 |
| information_schema |            NULL |
| kris               |               6 |
| mysql              |             986 |
| test               |              12 |
| test_tablesizes    |              79 |
| test_world         |            4079 |
+--------------------+-----------------+
7 rows in set (3.92 sec)
```

But what is the name of this largest table?

```sql
mysql> use information_schema;
mysql> select 
->    m.table_schema, 
->    t.table_name, 
->    m.maxrows 
-> from 
->    tables as t join 
->    (select table_schema, max(table_rows) as maxrows 
->    from tables group by table_schema ) as m 
->        on t.table_rows = m.maxrows and t.table_schema = m.table_schema;
+-----------------+----------------+---------+
| table_schema    | table_name     | maxrows |
+-----------------+----------------+---------+
| geodb           | geodb_textdata |  466518 |
| kris            | emp            |       6 |
| mysql           | help_relation  |     986 |
| test            | h              |      12 |
| kris            | p              |       6 |
| test            | t              |      12 |
| test_tablesizes | sizes          |      79 |
| test_world      | City           |    4079 |
+-----------------+----------------+---------+
8 rows in set (0.00 sec)
```

We take the original query and put it into our `FROM` clause, naming the resulting table `m`.
We can now join our `information_schema.tables` table (which we name `t`) against that original query result `m`, on equal `maxrows` values and equal `table_schema values`.

We then ask `t` for the name of all the tables that have as many rows as `m.maxrows`.
More than one answer is possible.
For example, the `test` schema has two tables with 12 rows.

## Dependent Subqueries - the WHERE clause

We can solve the same problem also by putting the Subquery into a `WHERE` clause:

```sql
moysql> select 
->    t.table_schema, 
->    t.table_name, 
->    t.table_rows 
-> from 
->    tables as t 
-> where 
->    t.table_rows = ( 
->        select max(table_rows) as maxrows 
->        from tables as m 
->        where 
->            t.table_schema = m.table_schema
->    );
+-----------------+----------------+------------+
| table_schema    | table_name     | table_rows |
+-----------------+----------------+------------+
| geodb           | geodb_textdata |     466518 |
| kris            | emp            |          6 |
| mysql           | help_relation  |        986 |
| test            | h              |         12 |
| test            | t              |         12 |
| test_tablesizes | sizes          |         79 |
| test_world      | City           |       4079 |
+-----------------+----------------+------------+
7 rows in set (0.00 sec)
```
This is a dependent subquery:
It runs once for every row in `t` that we find and may or may not produce a value.
We select each row from `t` where the `table_schema` from `t` and `m` match and select those rows where the `table_rows` match the `maxrows` value we find in the subquery.

This does not sound efficient, and it is in fact the purpose of the program generator of the database to produce an execution plan that is not literally like this.

Traditionally, the query planner in MySQL was severely limited, and consequently dependent subquery execution times were very bad.
This is only now, with the 8.0 release, slowly changing.

## A Tuple is a type, too

Tables are sets of tuples, and a tuple that can be used in SQL:

Using this base table:

```sql
mysql> select * from t;
+------+-------+------+
| a    | b     | c    |
+------+-------+------+
| eins | one   | 1    |
| zwei | two   | 2    |
| drei | three | 3    |
| 1    | eins  | one  |
+------+-------+------+
4 rows in set (0.00 sec)
```

We can write this:

```sql
mysql> select a,b,c from t where a = 'eins' and b = 'one';
+------+------+------+
| a    | b    | c    |
+------+------+------+
| eins | one  | 1    |
+------+------+------+
1 row in set (0.00 sec)
```

We can do the same thing using a tuple comparison:

```sql
mysql> select a,b,c from t where (a,b) = ('eins','one');
+------+------+------+
| a    | b    | c    |
+------+------+------+
| eins | one  | 1    |
+------+------+------+
1 row in set (0.00 sec)
```

So this also works:

```sql
mysql> select * from t where (a,b) in (('eins','one'), ('zwei', 'two'));
+------+------+------+
| a    | b    | c    |
+------+------+------+
| eins | one  | 1    |
| zwei | two  | 2    |
+------+------+------+
2 rows in set (0.00 sec)
```

We can also do slightly weird things, but they are useful:

```sql
> select a,b,c from t where 'eins' in (a,b,c);
+------+------+------+
| a    | b    | c    |
+------+------+------+
| eins | one  | 1    |
| 1    | eins | one  |
+------+------+------+
2 rows in set (0.00 sec)
```

Or, if I needed to find all rows that have 'eins' and 'one' in neighboring columns:

```sql
mysql> > select a,b,c from t where ('eins','one') in ((a,b),(b,c));
+------+------+------+
| a    | b    | c    |
+------+------+------+
| eins | one  | 1    |
| 1    | eins | one  |
+------+------+------+
2 rows in set (0.00 sec)
```

# Not an Algebra: LDAP, XPath Results, and many others

There are many query languages that are not an algebra, so the results are not of a kind that can be used for further queries.

The most classical example is LDAP: 
LDAP defines operations on a tree, the LDAP tree.
The result of any LDAP query is not a subtree, but a node set.
LDAP queries do not work on node sets.

The result:
LDAP servers are very fast, and in some cases can handle hundreds of thousands of queries per second. 
But the things that SQL could do in a single query actually need hundreds of thousands of queries.

Another classical example is XPath. 
Again, we have a tree as a data type and operations on it.
The result again is a node set, and not a tree, so we cannot query the result using XPath.
This lack is so glaringly obvious that almost all XPath implementations provide extensions to work around that and allow you to somehow convert a node set into a queryable tree.
