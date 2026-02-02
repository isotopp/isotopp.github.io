---
author: isotopp
title: "MySQL: Ways to run mysqldump"
date: "2023-01-03T01:02:03Z"
feature-img: assets/img/background/mysql.jpg
tags:
  - lang_en
  - mysql
  - mysqldev
aliases:
  - /2023/01/03/mysql-ways-to-run-mysqldump.html
---

This text exists mainly so that I paste the URL into the `#mysql` channel in Libera IRC.

The `mysqldump` tools allows you to convert a MySQL database server or individual schemas back to SQL.
You are left with a script that is supposed to be loadable into a target server and gives you back the full database, including all objects in it.

You can read that SQL as a script into an empty server to create a new instance, or process it with different tools for different purposes.
So in general, a workflow can look like this:

```console
$ mysqldump --options --more-options and parameters > somescript.sql
$ scp somescript.sql somewhere@else.com:
$ ssh somewhere@else.com
...
$ mysql --show-warnings --whatever-options < somescript.sql
```

Instead of `mysql` with an input redirect, you may also use the command line client and the `source` command:

```console
$ mysql --show-warnings --whatever-options
mysql> source somescript.sql
```

# TL;DR

To get everything, run

```console
$ mysqldump ...  --single-transaction --source-data=2 \
>   --routines --triggers --events \
>   --all-databases |
> gzip -9 > mydump.sql.gz
```

To get one database, run

```console
$ mysqldump ...  --single-transaction --source-data=2 \
>   --routines --triggers --events \
>   --databases dbname |
> gzip -9 > mydump.sql.gz
```

To get only the schema, use `--no-data`.
For example:

```console
$ mysqldump ...  --single-transaction --source-data=2 \
>   --routines --triggers --events \
>   --no-data \
>   --databases dbname > mydump.sql
```

# How do we get there?

## Setting expectations

SQL scripts are not a compact data representation, and often the `mysqldump` of a server is larger than `$DATADIR` of that instance.
The script usually compresses very well.
So it is useful to run `gzip` or similar on it.

SQL scripts are a representation of the data in the instance in textual form without indexes.
Reading the script into a new server not only requires parsing the SQL into server internal data structures.
It also requires that indexes are being rebuilt, and that is a process that consumes a lot of CPU and memory.

Most people would suggest that you do not ship data larger than 10 GB in the form of a `mysqldump`, because loading it will take too long.
As a rule of thumb that holds well, but it really is a function of memory available for index building, and the size of the largest index in the dump.

`mysqldump` is single threaded. It profits from faster CPUs, but not from more cores.
Loading a dump is also single threaded.

The defaults of `mysqldump` are somewhat sane, if you only want to dump tables.
For code in the database, additional options are required that are not part of the standard configuration.

## Dumping everything, atomically

We are assuming here that all tables are InnoDB, without exception.
If in 2023 you still are using non-transactional tables, you are beyond help anyway.

Dumping all data in the database takes time.
While running the dump, the data you are trying to dump may change due to other processes making changes.

Specifically, with the default isolation level, each single table will maintain a consistent read view while being dumped.
It will therefore not change for the `mysqldump` while it is being dumped.
But between tables changes may happen.

The option `--single-transaction` can be used to run the entire `mysqldump` in a single transaction, providing you with a consistent dump of the database.

A consistent dump of a database is associated with exactly one binlog position.
In traditional replication, and for bookkeeping purposes, it is useful to take note of this binlog position.
So the option `--source-data=2` (previously `--master-data=2`) should also be used to record this binlog position in the dump.

This will result in a comment to be added at the top of the dump file looking like this:

```mysql
--
-- Position to start replication or point-in-time recovery from
--

-- CHANGE MASTER TO MASTER_LOG_FILE='binlog.000005', MASTER_LOG_POS=157;
```

So far, our `mysqldump` command to dump everything should look like this:

```console
$ mysqldump ... --single-transaction --source-data=2
```

## Dumping code in the database

By default, `mysqldump` will not dump all non-table objects in the database.
You need to pass `--routines`, `--triggers` and `--events` to get all the code from the database as well.

On newer versions of MySQL, `--triggers` is enabled by default, so they are dumped.
On older versions, you would have to manually mention it on the command line.

Even on the most recent versions of MySQL, stored functions, stored procedures and events are not dumped automatically.
You would have to mention `--routines` and `--events` for them to be dumped.

On older versions of MySQL that was not a problem, if the `mysql.*` schema was part of the dump.
Inside it were tables in there that contained functions, procedures and even definitions.

Starting with MySQL 8, these tables are no longer used, because the definitions are now stored in hidden data dictionary tables.  
Using these options is now mandatory, if you want this code to be part of the dump.

So in order to also dump code in the database, our command becomes now

```console
$ mysqldump ... --single-transaction --source-data=2 --triggers --routines --events
```

## `--opt` is a set of options enabled by default

The `mysqldump` runs with `--opt` enabled by default.
You could run with `--skip-opt` to prevent this, but this is not helpful.

`--opt` is a shorthand for the following collection of options:

`--add-drop-table` 
: Generate a `DROP TABLE` statement before each `CREATE TABLE` statement in the dump.

`--add-locks`
: Enclose the `INSERT` statements loading data into the table with `LOCK TABLES` and `UNLOCK TABLES` statements.
  This used to make data load faster for MyISAM tables, but should not be necessary for InnoDB tables.
  It is not harmful, especially not for initial data loads, so do not worry about it.

`--create-options`
: Preserve all MySQL specific create options for all tables.
  This is very much needed in almost all use-cases.
  It may be disabled for data transport from MySQL to other database systems.

`--disable-keys`
: For each table, enclose the `INSERT` statements in `DISABLE KEYS` and `ENABLE KEYS` statements.
  For MyISAM tables, this improves data load speed, and index quality.
  For InnoDB, it does nothing, but is also not harmful.

`--extended-insert`
: The `INSERT` statements generated will use extended insert syntax.
  This will generate very long lines in the dump (matching whatever is defined as `max-allowed-packet`).
  This will minimize round trips, and make the load faster.
  It will make grepping and editing the dump very hard.
  It may create problems loading the data, if the source server has a modified, large `max-allowed-packet`.
  Depending on what you want to do with the dump, it may be useful to `--skip-extended-insert` to turn this off.

`--lock-tables`
: This will lock the local tables before dumping them.
  This is important when using MyISAM tables, and is overridden, if tables are InnoDB, and `--single-transaction` is used.
  So we are okay with it.

`--quick`
: This dumps the tables using `mysql_use_result()`, so the result is streamed using very little memory in the client.
  If you run with `--skip-quick`, full tables will be downloaded into the client before then can be dumped.
  If these tables are many gigabytes in size, `mysqldump` will be using a lot of memory, and will be very unhappy.
  Do not disable `--quick`.

`--set-charset`
: Generate a `SET NAMES` statement as needed to preserve character encoding.
  This should be always on, in order to preserve character encoding correctly.

In general, you should be fine with `--opt` and there is no need to change anything.

In some cases, you want to run with `--skip-extended-insert`, in order to search and manually edit the data in the dump easier.
The dump will load somewhat slower, and will be somewhat larger in this case.

## Dumping only the schema

If you want to dump only the schema, and not the data, there is an option for that: `--no-data`.
You get an SQL file with no `INSERT`, only `CREATE TABLE` and friends.
You would still need `--routines`, `--triggers` and `--events` to get all the code.

We get

```console
$ mysqldump ... --single-transaction --source-data=2 \
>     --triggers --routines --events \
>     --no-data
```

## Dumping all databases, or just one database

### --all-databases

You need to tell `mysqldump` what to dump.

This can be `--all-databases`, which will do exactly that, including the `mysql` database with all the grants, the help, the timezone data and so on.

If `--all-databases` is being used, each database in the dump will be created with a `CREATE DATABASE` statement.
A matching `DROP DATABASE` statement is not being generated.
That is less of a problem than one might assume, because the generated `CREATE DATABASE` statement is protected by an `IF NOT EXISTS` clause.

Still, it may be useful to `DROP DATABASE IF EXISTS` before creating a new one, in order to get rid of tables that should not be there.  
To achieve this, you could add the option `--add-drop-database`.

But: If you do that together with `--all-databases`, then a `DROP DATABASE ...;` statement will put in front of each `CREATE DATABASE` statement, including the `mysql` system database:

```mysql
/*!40000 DROP DATABASE IF EXISTS `mysql`*/;

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `mysql` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `mysql`;
```

In MySQL 8, the `mysql` schema cannot be dropped anymore, so you need to edit that out manually to make the dump useful.

Why `mysqldump` does  not special case this schema nobody knows:
it is known broken, and documented as broken in the manual page.
But nobody cared enough to put this single `&& (!my_strcasecmp(charset_info, ..., "mysql"))` into 
[the codebase](https://github.com/mysql/mysql-server/blob/a246bad76b9271cb4333634e954040a970222e0a/client/mysqldump.cc#L4547).

We end up running

```console
$ mysqldump ...  --single-transaction --source-data=2 \
>   --routines --triggers --events \
>   --all-databases --add-drop-database > mydump.sql
```

### A single database

Instead of dumping all database, maybe we want just one database, or even a single table from a single database.

If you run `mysqldump databasename` to dump a single database like this:

```console
$ mysqldump ...  --single-transaction --source-data=2 \
>   --routines --triggers --events \
>   databasename > mydump.sql
```

no `CREATE DATABASE` statement is generated.
You will just get a sequence of `CREATE TABLE` statement.
This can easily be imported into a differently named database.

Also, adding `--add-drop-database` to this does nothing.

If you run `mysqldump --databases databasename` to dump a single database instead,

```console
$ mysqldump ...  --single-transaction --source-data=2 \
>   --routines --triggers --events \
>   --databases databasename > mydump.sql
```

this does generate a leading `CREATE DATABASE` statement.
That is, because the `--databases` option accepts a space separated list of databases to dump.

Here, using `--add-drop-database` will do what is expected from it.

To dump a single table, use

```console
$ mysqldump ...  --single-transaction --source-data=2 \
>   --routines --triggers --events \
>   --databases databasename --tables tablename > mydump.sql
```

Alternately mixing `--databases` and `--tables` will not work.
