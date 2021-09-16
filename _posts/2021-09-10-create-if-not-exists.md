---
layout: post
title:  "MySQL: CREATE IF NOT EXISTS TABLE, but CREATE OR REPLACE VIEW"
author-id: isotopp
feature-img: assets/img/background/mysql.jpg
date: 2021-09-10 20:01:06 +0200
tags:
- lang_en
- mysql
- mysqldev
---
For the MySQL Million Challenge, I was going through the server syntax in order to understand what things can be created in the server.
And now my OCD triggered.
DDL is a mess.

# Creation

> As a database developer, I want to be able to create server objects using the `CREATE thing` syntax.

The server gives you that for the following things:

- DATABASE
- EVENT
- FUNCTION (and FUNCTION SONAME)
- INDEX
- LOGFILE GROUP (NDB only, not going to look at this)
- PROCEDURE
- RESOURCE GROUP
- ROLE
- SERVER
- SPATIAL REFERENCE SYSTEM
- TABLE
- TABLESPACE
- TRIGGER
- USER
- VIEW

# Safe creation

> As a database developer I want to be able to script things safely, so I need `IF NOT EXISTS` clauses in my `CREATE` syntax.

Statements that create things often allow you to specify `IF NOT EXISTS` for conditional creation of the thing:
Creation of the thing will fail if it already exists.
Using the `IF NOT EXISTS` clause the creation is conditional, so if the thing already exists this is not an error.

This is important for scripting: If the thing already exists, the script will throw an error and depending on settings will stop.
It is even more important in replication, because if you replicate the creation statement to a replica, the replication will stop with an error unless it is conditional.

Some `CREATE` statements replicate, but do not offer conditional syntax.
They cannot be used safely in replication, and they are cumbersome in scripting.

Two `CREATE` statements offer deviant safe creation: Instead of `CREATE ... IF NOT EXISTS` they offer `CREATE OR REPLACE ...`.

# Multiple object syntax

> As a database developer I want to be able to chain multiple `CREATE` or `DROP` actions together in a single statement, so that the things are created (or dropped) together, atomically.

Alternatively, DDL could be made transactional.
This makes sense even if a rollback is not possible, if they are being executed in a kind of DDL transaction under a lock, so that they appear to happen atomically.

Multiple `CREATE` syntax does not exist.
For few objects, a multiple drop syntax does exist, but support is thin.

# Safe DROP

> As a database developer, I want to be able to `DROP` the things that I created.

Obviously.

> As a database developer, I want to be able to make the `DROP` conditional using an `IF EXISTS` clause, to be able to script and replicate this operation safely.

Obviously.

The support for this is better than for creation, for some reason, and there is no deviant syntax.
Still, some things cannot be dropped safely.

# Enumeration and Definition display

> As a developer, I want to be able to enumerate all the things of a category.

Logically, an API is incomplete without enumeration.
I need to be able to see what exists.

In MySQL, a lot of things can be listed with `SHOW` commands, and all things can be listed by looking into the appropriate system tables.

Apparently, a lot of things can not be listed using the `SHOW plural` syntax (`SHOW TABLES`, `SHOW DATABASES`).
For a few things, a deviant syntax is supported (`SHOW PROCEDURE STATUS`) that also shows the definition of the thing.

For other things you have to acces system tables.
These system tables seem to be spread around, some are in I_S (Tablespace), others in mysql.* (servers).

Generally, MySQL seems to favor the syntax `SHOW CREATE thing` to show an SQL statement that would recreate the thing if I dropped it.
But for some things, this is not implemented, despite the fact that the information for this is available in various system tables.

# Altering and renaming things

> As a database developer, I want to be able to change the definition of a thing after creation.

Most things can be altered after creation.
For some things, some attributes cannot be altered even if an `ALTER` statement exists. Notably, it is impossible to rename a database.

Only two things can be renamed, tables and users.
For other things, renaming is possible using `ALTER TABLE RENAME` syntax, but a pure `RENAME` does not exist despite the fact that renaming is supported.

For roles and users, `ALTER thing IF EXISTS` conditional syntax is supported, but for all other things it is not.

# Replication

All thing creations are replicated, except resource groups and servers.
That even makes sense, which is unusual, given all the other illogical anomalies.

# A table, because this is about databases

| Command | replicates | enumerate SHOW| CREATE | IF   T EXISTS| OR REPLACE | DROP | IF EXISTS | MULTI | SHOW CREATE | ALTER | IF EXISTS | RENAME |
|---------|------------|---------------|--------|--------------|------------|------|-----------|-------|-------------|-------|-----------|--------|
| DATABASE|  YES       | YES           |  YES   | YES          |            | YES  | YES       |       | YES         | YES   |           |        |
| EVENT   |  YES       | YES           |  YES   | YES          |            | YES  | YES       |       | YES         | YES   |           | *4     |
| FUNCTION|  YES       | *1            |  YES   | YES          |            | YES  | YES       |       | YES         | YES   |           |        |
| INDEX   |  YES       | *2            |  YES   |              |            | YES  |           |       | *2          |       |           | *4     |
|PROCEDURE|  YES       | *3            |  YES   | YES          |            | YES  | YES       |       | YES         | YES   |           | *4     |
|RES GROUP|  *  *      |               |  YES   |              |            | YES  |           |       |             |       |           |        |
| ROLE    |  YES       |               |  YES   | YES          |            | YES  | YES       | YES   |             |       | YES       | YES    |
| SERVER  |  *  *      |               |  YES   |              |            | YES  | YES       |       |             | YES   |           |        |
| SRS     |  YES       |               |  YES   | YES          | YES        | YES  | YES       |       |             |       |           |        |
| TABLE   |  YES       | YES           |  YES   | YES          |            | YES  | YES       | YES   | YES         | YES   |           | YES    |
|TABLESPACE| YES       |               |  YES   |              |            | YES  |           |       |             | YES   |           | *4     |
| TRIGGER |  YES       | YES           |  YES   |              |            | YES  | YES       |       | YES         |       |           |        |
| USER    |  YES       |               |  YES   | YES          |            | YES  | YES       | YES   |             | YES   | YES       | YES    |
| VIEW    |  YES       | YES           |  YES   |              | YES        | YES  | YES       | YES   | YES         | YES   |           | YES    |

- *1: `SHOW FUNCTION STATUS` deviant syntax enumerates the function names and definitions.
- *2: Indexes are not first class citizens, they are part of table definitions.
- *3: `SHOW PROCEDURE STATUS` deviant syntax enumerates the procedure names and definitions.
- *4: `ALTER thing RENAME` syntax exists, but no `RENAME` command.

