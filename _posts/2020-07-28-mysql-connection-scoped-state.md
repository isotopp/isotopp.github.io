---
layout: post
title:  'MySQL Connection Scoped State'
author-id: isotopp
feature-img: assets/img/background/mysql.jpg
date: 2020-07-28 15:40:00 +0200
tags:
- lang_en
- database
- mysql
- mysqldev
---
MySQL speaks its own proprietary protocol.  It cannot be routed
by a HTTP proxy, and a MySQL connection is entire unlike a HTTP
connection.  Specifically, a lot of state and configuration is
tied to a MySQL connection, and it cannot be recovered on
disconnect.

## What state is tied to a connection?

### Transactions

A disconnect implies a `ROLLBACK`.  So if you are in a
transaction, all changes to the database that you attempted are
lost, rolled back, as if they never happened.  It is not enough
to retry the last statement, you need to jump back to the begin
of the transaction.

This is not unexpected.  All transactions can fail, in the
middle of a transaction or even on `COMMIT` (you attempt to
`COMMIT`, but get a `ROLLBACK` due to a deadlock or a failed
transaction certification in Group Replication).

Applications need to be able to detect that and handle that at
any point in time, by retrying the transaction.

### Locks

When you disconnect from the database for any reasons, all lock
you held at that point in time are being released.  This
includes all X- and S-Locks in InnoDB, all MyISAM table locks,
all ongoing metadata locks and of course also all object-less
locks aquired with `GET_LOCK()`.

This makes a lot of sense and is a requirement - on disconnect,
locks need to be released.  Otherwise you would be constantly
cleaning up locks left around after the process died, as if they
were Apache Shared Memory Segments and stuff.

### LAST_INSERT_ID

In MySQL, we generate sequences implicitly: You write a `NULL` or
`0` to a field which has the auto_increment attribute and get
assigned a number.  Now you need to know that number, so in a
followup statement you are referencing this as the
`LAST_INSERT_ID()`.

This ID is being cached in your connection, which is lost when you
disconnect.

Using last_insert_id() looks like this:

```sql
mysql> CREATE TABLE `demo` (
`id` bigint unsigned NOT NULL AUTO_INCREMENT,
`data` varbinary(255) NOT NULL,
UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB;

mysql> insert into demo values (0, "Keks");
mysql> insert into demo values (NULL, "Cookie");
mysql> select id from demo;
+----+
| id |
+----+
|  1 |
|  2 |
+----+
mysql> select last_insert_id() as lastid;
+--------+
| lastid |
+--------+
|      2 |
+--------+
```

After a `KILL` on the connection, this happens:

```sql
(Admin Connection)
mysql> kill 350542;

(Client Connection)
mysql> select last_insert_id() as lastid;
ERROR 2006 (HY000): MySQL server has gone away
No connection. Trying to reconnect...
Connection id:    350571
Current database: kris
+--------+
| lastid |
+--------+
|      0 |
+--------+
```

### Temporary Tables

MySQL has the incredibly broken feature of `CREATE TEMPORARY
TABLE`.  These are tables that can shadow tables in the global
namespace, have different permissions, and disappear on
disconnect.  They are also prone to breaking certain modes of
replication if there ever is a disconnect in the replication
connection while any of these tables is active.  And they break
snapshots and backup recovery of the database server, for the
same reason.

In general, the recommendatoon is to not use the `CREATE
TEMPORARY TABLE` feature at all because of these drawbacks. 
Create regular tables in a temp schema instead and scope table
names with a `CONNECTION_ID()` instead.

For the purposes of this discussion, temporary tables are
connection scoped state, and if we used them, we would also lose
them on disconnect.

### Prepared statements (and parsed bytecode)

In MySQL, it is possible to store code in the database, using
stored procedures, stored functions, and other constructs.  The
language for this is abysmally ugly, and the execution engine is
on-par with PHP 3 from 1998, in terms of structure and
performance.  Parsed stuff is cached per-connection, which makes
no sense at all.  Also, in general, you do not want to run code
on expensive and crowded database CPUs when you can have plenty
of cheap and easy to scale CPUs in application nodes.

In general, the recommendatoon is to not use code in the
database, if at all possible.  For the purposes of this
discussion, stored code caches are per-session and are lost on
disconnect, but automatically recovered on reconnect (at a
performance penalty).

In MySQL, many client side Connectors use the SQL Statement
`PREPARE` or a similar API mechanism to prepare a statement for
repeated execution.  Later, a matching `EXECUTE` in a loop will
bind it to variables and run the SQL.  This is usually done more
or less transparently by the Protocol Connector your host
language uses underneath the database abstraction and ORM
interfaces you are using to talk to the database.

For the purposes of this discussion it is interesting to know
that these prepared statements are part of the connection scoped
state and will be lost on disconnect.  Depending on how your
connector implements this, recovery may be automatically, but
usually isn’t in all cases.

### Variables

Connections can be associated with variables.  Some of these
variables are under user control (@-Variables).  This is
dangerous, deprecated and can break certain modes of
replication, but has been done in the past to make TopK queries
efficient – use Window Functions from MySQL 8 instead.

```sql
mysql> select id from demo;
+----+
| id |
+----+
|  1 |
|  2 |
+----+

mysql> set @count := 100;
Query OK, 0 rows affected (0.00 sec)

mysql> select @count := @count + 1 as v, id from demo;
+------+----+
| v    | id |
+------+----+
|  101 |  1 |
|  102 |  2 |
+------+----+
2 rows in set, 1 warning (0.00 sec)

mysql> show warnings;
Warning | 1287 | Setting user variables within expressions is deprecated 
and will be removed in a future release. Consider alternatives: 
'SET variable=expression, ...', or 'SELECT expression(s) INTO variables(s)'.
```

For the purposes of this discussion, @-Variables are part of
connection scoped state and are lost on disconnect.

Session Variables are configuration that controls the execution
of queries.  They are sometimes necessary to speed things up, to
handle character sets properly, or to nudge the query optimizer
into the right direction.

```sql
mysql> SET NAMES utf8mb4;
…
mysql> SET SESSION optimizer_prune_level = 0;
…
```

For this purposes of this discussion, these settings are part of
the connection scoped state and are lost on disconnect.  On
reconnect, you must re-set the connection session level
parameters to the desired state.  Without this, the session
state is identical to the global setup inherited on connect.

### Magic SET commands

Old statement based replication had the problem of having to
replicate stateful commands such as NOW(), RANDOM(), USER() and
similar.  When executing a command on the replica, the time
would be different, the result of a call to RANDOM() would have
a different seed state, and the current user would be the
replication user and not the user who issues the original
statement.

MySQL solved that by having a number of Magic SET commands, so that the
statement

```sql
SELECT NOW() as now;
```

was being replicated as

```sql
SET TIMESTAMP=...
SELECT NOW() as now;
```

and in this setup the `NOW()` function would not return the
current time, but the time previously set with the Magic SET. 
This is a connection scoped flag, and it is lost on disconnect. 
If you use Magic SET commands, they are lost and need to be
re-set on reconnect.

## TL;DR

- MySQL connections carry a lot of state, all of which is lost on disconnect.
- It is therefore completely impossible to transparently reconnect  to a MySQL server in the Protocol Connector, a Proxy or other lower layers in the stack.
- The application needs to take notice and handle the reconnect properly, recreating the required state for the application to function.
  - It then needs to restart the transaction, not the last statement.
- The database server you reconnect to may be different from the one you were connected to before, even if it has the same name – the DNS may have changed due to a failover being the reason for a disconnect.
  - You need to re-resolve the hostname and be prepared to get a different IP number.
- Transactions can fail. Commits can fail. Deadlocks and Group Replication verification can cause this.
  - You must not rely on SQL statements being successful, including the COMMIT statement, and you need to be able to detect such failures and restart transactions. This is possible even without a disconnect.
