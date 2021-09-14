---
layout: post
title:  'Data Access Programs and Pre-SQL systems'
author-id: isotopp
feature-img: assets/img/background/rijksmuseum.jpg
date: 2020-05-01 20:12:40 +0200
tags:
- lang_en
- database
---
Let's have a look at very old database systems. Things like dBase or compatible systems ("xBases") allowed to manipulate record based files (with indexes) in a procedural way. What does that mean?

## xBase

The system allows developers to create files that contain a well defined (fixed size) record structure, basically an array of `struct` on disk, often together with the definition of on-screen masks designed to show a single record and a (searchable) list of records. Data would be entered in masks and stored automatically on disk in records in the file. Writes would modify records in place, during the write (and the edit of the data in a mask) the record would be locked.

With an index command, the system would extract the specificed data field from all records and build an index: another array of the form `(field, recno)`, where `field` is the name of the field that is to be indexed and `recno` is the record number from the original data file. Data in the index would be stored sorted in `field` order, allowing fast lookup through Btree lookups.

Access to records would be by record number, through a full table scan on an arbitrary column or by leveraging an index - the latter would be manual through code written by a developer. That is, a developer would open the index, perform an index access to fetch the records required and then further whittle down the list by applying additional conditions.

The developer would have to write a piece of code to open the indexes of interest, position a cursor in there and then manually select the record numbers of the records of interest, then read those records and output the resulting list. This is a data access program.

## Procedural Data Access in MySQL

We can do the same thing in MySQL.

```sql
mysql> create table emp ( empno integer not null, name varchar(40), salary integer not null, primary key (empno) );
mysql> insert into emp values (1, 'Lucky Eddie', 100);
mysql> insert into emp values (2, 'Hagar Horrible', 200);
mysql> insert into emp values (3, 'Honi Horrible', 300);
mysql> insert into emp values (4, 'Kwack', 400);
mysql> create index salary on emp (salary);
```

We create an employee table `emp` and fill it with some data. We create an additional index on the salary column.

Using the low level `HANDLER` command we can perform a procedural data lookup:

```sql
mysql> handler emp open as e;
mysql> handler e read salary <= (200) limit 10;
+-------+----------------+--------+
| empno | name           | salary |
+-------+----------------+--------+
|     2 | Hagar Horrible |    200 |
|     1 | Lucky Eddie    |    100 |
+-------+----------------+--------+
2 rows in set (0.00 sec)
mysql> handler e close;
Query OK, 0 rows affected (0.00 sec)
```

In this example we are opening the table `emp` using the alias `e`. We then read the table in index order, using the `salary` index, and fetch up to 10 records that satisfy the condition 'index value <= 200'. The two matching records are listed.

We could have given the command as `handler e read salary <= (200)` without the limit clause. This would have returned only one matching record, and positioned the cursor in the index. With `handler e read next` we would then be able to iterate through the index, reading the records one by one.

In this case the index returns only data that is of interest to us.

Suppose we want all employees that have a salary <= 200 and that are members of the Horrible family.

How would we go about this? There is no index that we can use that will return only valid records fulfilling both conditions, the one on salary as well as the one on name.

Instead we open the index as before, read the records, but also manually filter out all unwanted records (we want only records `WHERE name LIKE '%Horrible'`).

## SQL

SQL is a declarative language: We specify *what* we want, and not *how* the database is supposed to fetch it. The database planner and optimizer then creates a data access program for us behind the scenes - what it looks like exactly is very much dependent on the database version, and what support structures for data access exist (that is, which indexes are defined).

But: For any given QL (Query Language) statement, the result set on the same data will always be the same, no matter which version of the database and which indexes exist, or how the data access program can be optimized using these indexes.

Using the table above, we say what we want: Records with salary <= 200 and names ending in the "Horrible" family name.

```sql
mysql> select * from emp where salary <= 200 and name like '%Horrible';
+-------+----------------+--------+
| empno | name           | salary |
+-------+----------------+--------+
|     2 | Hagar Horrible |    200 |
+-------+----------------+--------+
1 row in set (0.01 sec)
```

We then drop the index and re-run the same statement:

```sql
mysql> alter table emp drop index salary;
Query OK, 0 rows affected (0.03 sec)
Records: 0  Duplicates: 0  Warnings: 0

mysql> select * from emp where salary <= 200 and name like '%Horrible';
+-------+----------------+--------+
| empno | name           | salary |
+-------+----------------+--------+
|     2 | Hagar Horrible |    200 |
+-------+----------------+--------+
1 row in set (0.00 sec)
```

The result is the same. The data access program may or may not have changed - we could check with `EXPLAIN`, but unless it is slow or otherwise weird we do not actually care.

## So what?

Some ten years ago we had an explosion of NoSQL products, many of which were either Key-Value stores (a data structure even simpler than the dBase ISAM-structures shown above), or provided procedural access to data leveraging indexes.

Cassandra for example is a product that provides the latter type of structure (and so does DynamoDB). When I recently dissed a colleague for promoting a distributed dBase III, that is what I meant. I guess that also dates me.

The point being that data access programs are boring code
- that nobody wants to write, 
- that is [full of arbitrary restrictions](https://stackoverflow.com/a/19140553), 
- that is hard to change when the query conditions change and 
- that often is also not quite correct.

When we observe code generators mounted on top of NoSQL products that [eat SQL and output DAPs](https://www.datastax.com/blog/2015/03/how-do-joins-apache-cassandratm-and-datastax-enterprise) for the NoSQL product underneath, this is why. This is code that is better written on the fly at runtime, by machines, and run largely without human supervision.

This is what a query planner and executor does for you in relational database products.