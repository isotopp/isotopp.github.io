---
layout: post
title:  "MySQL: CREATE IF NOT EXISTS TABLE, but CREATE OR REPLACE VIEW'
author-id: isotopp
feature-img: assets/img/background/mysql.jpg
date: 2021-09-10 16:01:06 +0200
tags:
- lang_en
- mysql
- mysqldev
---
The OCD is strong in this one.
If you go through the syntax to create and drop things in MySQL, you will find that various ways exist to do that.
`CREATE` often has a clause `IF NOT EXISTS` to make things replication safe.
Conversely, `DROP` can be amended if `IF EXISTS` for the same reason.

Then, if you look closely, you can `DROP TABLE` multiple tables at once, atomically, but you can create only one table at a time.

Let's go through this systematically, and see what works and what does not.

# Things you can create and drop

`CREATE` can do:

- `CREATE DATABASE` creates a new schema. In fact, `CREATE SCHEMA` is an allowable alias for `CREATE DATABASE`.
  - It is replication safe with `CREATE DATABASE IF NOT EXISTS`.
  - It has no multiple syntax, you cannot create more than one database per statement.
  - The inverse is `DROP DATABASE IF EXISTS`, and it is replication safe.
  - It has no multiple syntax, you cannot drop more than one database per statement.
  - You can `SHOW CREATE DATABASE` to get the definition of a database.
- `CREATE EVENT` creates a new event for the event scheduler.
  - It is replication safe with `CREATE EVENT IF NOT EXISTS`.
  - It has no multiple syntax, you cannot create more than one event per statement.
  - The inverse is `DROP EVENT if EXISTS`, and it is replication safe.
  - It has no multiple syntax, you cannot drop more than one event per statement.
- `CREATE FUNCTION` creates a new stored function, or installs a loadable function implemented as a shared library.
  - The stored function variant does not have an `IF NOT EXISTS` clause. Neither does the `SONAME` variant. *This is not replication safe, and also unexpectedly breaking the pattern.*
  - There is no multiple syntax, you cannot create more than one function per statement.
  - The inverse is `DROP FUNCTION IF EXISTS`, and unlike the create it is replication safe. *This breaks symmetry.*
  - It has no multiple syntax, you can only drop one function per statement.
- `CREATE INDEX` creates an index as part of a table. Indices differ from the rest of the objects here, as they are not first class citizens: They are parts of tables and cannot exist without a table. This makes certain operations on partitions subject to restrictions.
  - `CREATE INDEX` does not have an `IF NOT EXISTS` clause. *This is not replication safe.*
  - There is no multiple syntax. You can create on one index per statement.
  - The inverse is `DROP INDEX`, and it also has no `IF EXISTS` clause. *There is no way to do index maintenance in a replication safe way.*
  - There is no multiple syntax. You can only drop one index per statement.
- `CREATE PROCEDURE` creates a stored procedure, and behaves like `CREATE FUNCTION`
- `CREATE SERVER` creates a server entry for the foreign data wrapper of the `FEDERATED` storage engine.
  - It has no `IF NOT EXISTS` entry, and no multiple syntax.
  - The inverse is `DROP SERVER`, and it has no `IF NOT EXISTS` and also no multiple syntax. *There is no way to do federated engine maintenance in a replication safe way.* I wonder if there is a person in the world that cares about this, though.
- `CREATE SPATIAL REFERENCE SYSTEM` creates, well, a spatial reference system for the use in GIS applications.
  - It has `CREATE SPATIAL REFERENCE SYSTEM IF NOT EXISTS`, and it also offers `CREATE OR REPLACE SPATIAL REFERENCE SYSTEM`.
  - The inverse is `DROP SAPTIAL REFERENCE SYSTEM IF EXISTS`.
  - Neither create or drop offer multiple syntax.
- `CREATE TABLE` creates a table.
  - It understand `CREATE TABLE IF NOT EXISTS` to make it replication safe.
  - The inverse is `DROP TABLE IF EXISTS`, *and it allows multiple table syntax*, so you can atomically `DROP TABLE IF EXISTS a, b, c`.
- `CREATE TABLESPACE` creates a new tablespace.
  - There is no `IF NOT EXISTS` syntax.
  - The inverse is `DROP TABLESPACE` and there is no `IF NOT EXISTS` syntax.
  - There is no multiple syntax.
- `CREATE TIRGGER` creates a trigger on a table. Like indexes, triggers are no first class citizens, they need a table to exist.
  - There is no `IF NOT EXISTS` syntax.
  - The inverse is `DROP TRIGGER IF EXISTS`, *this breaks symmetry*.
  - There is no multiple syntax for either creation or dropping.
- `CREATE VIEW` creates a view.
  - We have `CREATE OR REPLACE` view, but no `CREATE VIEW IF NOT EXISTS`, with *breaks symmetry*.
  - We have `DROP VIEW IF EXISTS`, and there is multi syntax for drop view, so you can `DROP VIEW a, b, b` atomically.

# Views

Views are technically tables, but 
