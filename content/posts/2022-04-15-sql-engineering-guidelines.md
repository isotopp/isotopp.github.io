---
author: isotopp
date: "2022-04-15T08:42:00Z"
feature-img: assets/img/background/mysql.jpg
title: "SQL Engineering Guidelines"
toc: true
published: true
tags:
- database
- mysql
- mysqldev
- lang_en
---

Where I work, the native database is MySQL.
This is what the database team fully supports.

Other databases, notably Postgres, are in use mostly because external products we run require them.
Internal projects should use MySQL.
An external company provides limited support for running Postgres.

The recommended version of MySQL to be used is currently the latest 8.0.
It has a large number of improvements over the previous version 5.7 in terms of the SQL subset supported, handling of sorts, critical character set support and join strategies.
Versions of MySQL older than 5.7 are completely unsupported and contain unfixed critical CVEs.
They must never be used.

Note that 'fully supports' does also include operational aspects of the database:
Automated handling of grants, automated fail-over, replication tree management, capacity planning, restore testing of automated backups, and integration with compliance tickets.
Using other SQL products is likely to leave a team with a lot of toil that is taken away by automation had you been choosing MySQL.

## Overview

We are using a 'safe subset' of MySQL ("Blue MySQL") and not all features of the product.
That said, we are an enterprise with several hundred use-cases.
For each of these rules a counterexample project likely exists.

The 'safe subset' of MySQL mostly means: We do not store code in the database.

- We do not use views.
- We do not use stored procedures or stored functions.
- We do not use triggers.
- We do not use UDFs ("user defined functions", `.so` files that are loaded into the server proper and can be called as SQL-functions)

We do not run code in the database, because it makes applications very hard to update atomically in a rollout.
It also makes it hard to see all code that is part of the application in a developers' editor, because some of it is in git, and other code is part of the schema.
Finally, code in the database creates some kind of spooky action at a distance that creates lots of debugging problems.

Specifically for MySQL, the MySQL stored procedure language is as beautiful as COBOL, as efficient as PHP 3, and as debuggable as embedded Lua.
Do not use it.

## General

SQL systems are stateful systems, so your application can be stateless.
That means there is state in a lot of unexpected places in SQL, and you have to be aware of it.

- [Connection Scoped State]({{< relref "2020-07-28-mysql-connection-scoped-state.md" >}})
- COMMIT can fail, and you must be able to retry

Databases store data for a long time.
Often longer than the code that created the data lives.
For example, there are databases in production that have an uninterrupted change history of more than 20 years.
The data started out in Postgres, was converted and migrated to MySQL 4.0 and then lived through a change of versions up to MySQL 8.0.

Database administrators operate with this in mind, and use a lot of defensive operational procedures.
Get their input and their help when planning changes.

All data has a full data lifecycle: It is being created, ingested, stored, changed and updated and ultimately exported to different systems and/or deleted.
Plan the full data lifecycle, and pay special attention to tables that have time as a component of the primary key or the table name, or otherwise exhibit log nature.
Every transactional database has a data warehouse inside, and it struggles to get out. Given the same number of customers, articles and transactions each day, will your database grow without bounds and which structures cause that?

Database administrators will help you to complete the data lifecycle.

## Absolute Limits

**MySQL has a number of limits that are part of the codebase.**
Specifically, [InnoDB limits](https://dev.mysql.com/doc/refman/8.0/en/innodb-limits.html) are documented in the manual.
It is useful to be familiar with at least the information on indexing.

On top of that there are other limits that will affect you, based on physics, operations and available hardware.

### Size

Are you running out of disk space? Know what to monitor, and how to handle the situation and [absolute size limits]({{< relref "2022-02-16-databases-how-large-is-too-large.md" >}}).

**Deleting data costs disk space.**
MySQL is running in a replication hierarchy, and in order to replicate MySQL stores a pre- and post-change image of each changed row in the binlog.
This is kept for up to seven days to allow lagging replicas to catch up.
For deletion, the pre-deletion image of the row is sent to the binlog, in order to allow the replica to find the row to delete it. This consumes disk space, which will be reclaimed only after seven days.

A DBA can help you here to reclaim space early.

**Size is Time, and Time is Size.**
Assuming 400 MB/s copy speed, copying one terabyte of data takes around 45 minutes.
Adding 15 minutes of replication catchup, you can expect around 1 hour of creation time per terabyte of database size.

Databases of around 200-250 GB size have a creation time of around 10-15 minutes per instance.
That is sufficient even for databases in Kubernetes.

**The DBA Standard SLO supports databases are <2 TB in size**, and fit onto a 1.92 TB sized standard NVME drive, including binlog and overhead.
They take around 2h to create from a donor instance.

Databases larger than that require special storage (external persistent volumes), which will have worse latency and cost more.
It will not be available immediately, and moving existing databases (which are already large) to different storage will take time in accordance with their size. Plan ahead, and plan with a DBA to make this a smooth transition.

**The instance size limit is approximately 10 TB.** Instances larger than 10 TB will have a creation time so large that operations will have at most one attempt per day to do anything with the instances.
This produces unsustainable toil for DBA, and drag on your project.

That is, some time **before hitting the 10 TB barrier your project will have to have an exit plan in place** to avoid hitting this limit.

The plan can be
- use Cassandra or another sharded NoSQL storage.
- use shards in MySQL, doing application level sharding.
- consider a supported distributed database.

It will involve in all cases moving to a distributed setup that more or less transparently shards.
It will also involve moving to a setup where `JOIN` will be much more costly because of the distributed nature of the database.

We do currently have larger databases than 10 TB.
Contact their owners to understand the nature of their toil problems and why your setup wants to avoid this.

### Latency

**Write your SQL and your applications SQL execution model with milliseconds of query execution time in mind, even for reads.**

Currently, we have on-prem databases with a memory saturated setup, and they expose query latencies for single primary key lookups in memory of 0.15ms.
This will not hold in the cloud, in virtual environments, and also not in setups that put ProxySQL in-between.

**Count the number of queries run to render a page using the available Event Instrumentation.**
Will the page render properly with 1-4 milliseconds of query execution time for each query?

**Keep read-replicas of your data close to the application.** Crossing the boundaries between AZs will add another 4-10ms, or more, to each query. If your application is running on-premises, but your database is in the cloud, this is likely much slower than setting up local replicas and extending the replication hierarchy into the local AZ.

Using certain database ORMs, it can be easy to accidentally create SQL being executed in a loop.
For each object accessed in a loop, the ORM secretly fires a single primary key lookup in the background to fleshen the object lazily when it is accessed for the first time.
This is called machine-gunning.

**Avoid machine-gunning**, primary key lookups in a loop. Consider using a `SELECT ... FROM table WHERE id IN ( ... around 1000 constants ... )` clause.
If this is driven by another select, consider using a `JOIN`.

### Statement size

Objects and statements are limited to `max_allowed_packet`, currently 16 MB in size.
Additionally, certain `WHERE id IN (...)` clauses begin to show degraded performance and excessive memory use for a large number of ids in MySQL 8.

- **Aim for around 1000 values in such clauses.**
- **Stay below 16 MB statement size.**
- **For bulk writes, keep the transaction size to a reasonable 1000 to 10000 rows per commit.**
  Group replication will be unhappy if you don't.

### Many-tables `JOIN`

**Avoid `JOIN`-ing more than 10 tables at once.**

If the optimizer were to brute-force all possible `JOIN` combinations on an `n`-way table `JOIN`, the number of combinations would be `n!` ([factorial](https://en.wikipedia.org/wiki/Factorial) of n).
This becomes an unwieldy number at a value of `n=10`.

The optimizer will have to apply heuristics around a join-plan depth of 10, and do weird things, including sometimes missing obvious optimizations.

This is usually not a problem, but if you are using an ORM and have deep class hierarchies, you may be hitting this limit inadvertently.
Be aware of your class-subclass relationships and how they are modelled, and what SQL is being generated.

### Bulk updates (large deletes, inserts, updates)

Very large atomic transactions are being executed on the primary, and on commit, enter the binlog. They then go downstream and execute on the replicas of that level, and so on.

As each replica has the same data as the primary, they will all approximately complete the statement at the same time. Your busy query will hog all replicas at the same tier at approximately the same time. You will likely lose capacity at each tier of the replication tree at once when executing such a large transaction.   

A query such as `DELETE FROM sales WHERE article_id < 1000000` has the potential to make changes to very many rows. The update can take noticeable time, or depending on the data, even run for minutes or hours. The change can stall replicas, induce replication delay or otherwise impact production.

In all our supported languages packages, we have replication aware bulk update functions to handle this:
They will break up such large changes into manageable chunks, and execute them while monitoring replication lag.
Be sure to make good use of them, they exist for a reason.

## Data types and column definitions

MySQL supports a wide range of data types.
They are documented [in the manual](https://dev.mysql.com/doc/refman/8.0/en/data-types.html).
Each data type comes with a range and a storage size.
It is useful to know properties of the most common types.

When choosing data types, think big ("assume 10x growth").
Data types can be changed ex-post, but require an `ALTER TABLE` command or an online schema change to be run.
This usually involves a background copy of all data of that table, and can take a lot of time for large tables.

Additional information about commonly needed data types can be found in your projects coding guidelines.

The following rules have been proven to be useful guidance in the past:

### Names

- **Names are snake_case.**
    - Do not use uppercase table names or column names.
      We have done that in the past, and there are tables with upper case characters in names.
      Don't.
    - Depending on the version of MySQL and the filesystem in use, table names are case-sensitive or not, because they end up being file names on a case-sensitive file system or not.
      Specifically, in production, on Linux, for older versions of MySQL table names are case-sensitive, so `Sales` and `sales` are different tables.
      On Mac and Windows, with case-insensitive filesystems, they will be the same table.
- **Be consistent with column names.**
- **Do not use MySQL keywords or reserved words as column names.**
    - [MySQL 8 list of reserved words](https://dev.mysql.com/doc/refman/8.0/en/keywords.html) lists keywords, reserved words, new keywords and reserved words - none of them should be used, even if some of them technically can be used.
    - If you must, quoting table and column names (`` `table_name` ``.`` `column_name` ``) avoids reserved word problems completely.
    - Theoretically, using backticks it is possible to have column names and table names that contain spaces, or even emoji.
      Don't even think about that, much less try it.

### Normalization

- **Understand database normal forms and aim for a relaxed third normal form.**
  Try to [normalize]({{< relref "2005-09-11-nermalisation.md" >}}) properly until you run into weirdness.
  Only denormalize when you actually experience performance problems.

### Keys

- **Every table must have a primary key.**
  - In MySQL the primary key also defines the physical order of the data on disk:
    Rows with similar primary key values will usually be stored physically closer together than rows with more dissimilar primary key values.
    MySQL contains a large number of optimizations to exploit this and make this fast.
  - Not having a primary key breaks group replication and row based replication.
    We are using these features, so primary keys are mandatory.

- **Primary keys are short:** `integer` (4 byte), `bigint` (8 byte), `VARBINARY(16)` (the output of `UUID_TO_BIN()`, 16 byte).
    - MySQL uses primary keys as row addresses in all secondary keys. The longer the primary key, the more expensive the secondary key.
    - That means `INDEX(a)` will actually store `INDEX(a,id)` (with `id` being the primary key) as a secondary index, and the optimizer knows that, and can use this.

- **Primary keys determine physical data ordering.**
  Using the default InnoDB storage engine, the data itself is organized in a B+-tree in the primary key.
  That is, the primary key holds the actual data rows in the leaf-nodes of the primary key.
  That implies the data is physically arranged in primary key order.
    - This is why mutating a primary key is so expensive.
    - This can be exploited to keep hot rows close together and reduce the working set size of the database.
      InnoDB prefers hot rows to be close together, and has special-case code to make this work.
    - This resonates nicely with `auto_increment`: Using this, more recently inserted rows will be more on the "right-hand side" of the table, and older rows will be more on the "left-hand" side. Often data hotness coincides with row age, so using `auto_increment` the database will automatically exploit this for smaller memory footprint.

- **Primary keys are immutable.**
  Changing a primary key physically moves the record around in the data tree that makes up a table.
  This is an extremely expensive operation.
  Never change a primary key value.

- **Primary key values are not re-usable.**
  When deleting a record, the primary key that once identified that record can never be re-used.
  It may be still referenced by things outside the database, such as URLs with the `id` as a parameter.
  Re-using the primary would potentially link an external thing to a completely unrelated `id` value.

- **To use a UUID as a primary key, define the column as `VARBINARY(16)` and use the `UUID_TO_BIN()` function with swap flag set to true.**
    - [UUID_TO_BIN(string_uuid, 1)](https://dev.mysql.com/doc/refman/8.0/en/miscellaneous-functions.html#function_uuid-to-bin): "If swap_flag is 1, the format of the return value differs: The time-low and time-high parts (the first and third groups of hexadecimal digits, respectively) are swapped. This moves the more rapidly varying part to the right and can improve indexing efficiency if the result is stored in an indexed column."
    - From MySQL's point of view, `AUTO_INCREMENT` integer primary keys work better than UUID, but a lot of software prefers UUID.
        - UUIDs can have advantages for high insert rates, because they can be created independently in different clients in parallel.
        - MySQL stores data physically in primary key order, but the way UUIDs order is not advantageous to that.
          MySQL provides the `UUID_TO_BIN(string_uuid, 1)` function to fix this.
          Consider using it, it unlocks many performance advantages. [UUID discussion]({{< relref "2021-04-06-mysql-and-uuids.md" >}}), [Another UUID discussion]({{< relref "2020-09-22-alter-table-for-uuid.md" >}}).
        - The datatype produced by `UUID_TO_BIN()` is a `VARBINARY(16)`.
- **When using `integer` or `bigint` primary keys, consider making it `unsigned`.**
    - It will double the key range.
    - If your primary programming language cannot handle `unsigned` values, it is okay to use `signed`.
    - Remember that Javascript has a 53-bit problem.

- **In your table definition, keep the primary key to the left.**
    - This is purely cosmetic, but it will make the life easier for reviewers of your code.

### NULL values and nullable columns

- **Define columns as `NOT NULL`.**
    - If a column is nullable, the NULL value must have exactly one meaning, and it must be documented (e.g. in a COMMENT clause in the CREATE TABLE statement).
      More on [NULL values]({{< relref "2020-08-25-null-is-null.md" >}}).
    - If you are using `LEFT JOIN` or access columns that can be nullable, consider the SQL functions [`COALESCE()`](https://dev.mysql.com/doc/refman/8.0/en/comparison-operators.html#function_coalesce), `IFNULL()` and the comparison operator `IS NULL`.
      NULL values do not compare normally, so wrap nullables into one of these functions.

### Default values

- **avoid `DEFAULT` values**, except for natural "zero" values appropriate for the type.
- for `DEFAULT` date and time values, **see the section on date and time values**.

### Boolean

- **Use `TINYINT` to store booleans.**
    - MySQL [does not have a native boolean type](https://dev.mysql.com/doc/refman/8.0/en/other-vendor-data-types.html), so we use `TINYINT`.
      It uses one byte.
    - Clever hacks exist to exploit nullability (`CHAR(0) NULL` columns) or bitfields to store data more densely.
      These usually backfire later in the software development lifecycle.
      Avoid them.

### Integers

- **Always use `integer` and `bigint`.**
    - MySQL offers several integer data types smaller than the 4-byte `integer` and the 8-byte `bigint`.
      They have been used in the past, and usually later created an upgrade problem when the data range was exhausted in company growth.
- **Do not use display widths with integers.** Use `int`, not `int(11)`.

### Fractional numbers and monetary values

- **Always choose `double`. Never use `float`.**
    - `FLOAT` is a 32 bit floating point number, and the range and precision is usually too small to be useful.

- In the past some projects have stored pricing information as `double`.
  This comes with its own set of problems.
  Consider using an appropriately sized `DECIMAL(16,4)` variant, but be aware what the systems you depend on and the systems depending on you use.
  Compatibility may be better than correctness.
- For euro-values, use a column name suffix "_eur".

### CHAR, VARCHAR and the various TEXT types

- **Avoid `CHAR`, prefer `VARCHAR`.**
    - In very old versions of MySQL the `CHAR` type had certain speed advantages.
      None of these are true any more for modern MySQL using InnoDB.
      Do not use fixed width character types anymore.

- **Consider row width, and slightly prefer `VARCHAR` over `TEXT` types.**
    - `VARCHAR` are stored inline and contribute to row width, `TEXT` types are stored like BLOBs and are stored in a complicated way that can have a lot of overhead.
    - Use `VARCHAR` for string-like texts.
    - Use `TEXT` where you actually store small 'files' in the database.
      If you do that, see below the notes on `BLOB` data.
      They also apply here.

- **Use the default `utf8mb4` charset, it is the utf-8 you want.**
    - `VARCHAR` and the various `TEXT` fields have a character set associated to them.
      Always use `utf8mb4` as the character set (it should be the default, but check).
      Read up on [Why utf8mb4?]({{< relref "2022-01-12-utf8mb4.md" >}})

- **Avoid `ENUM`, use lookup tables.**
    - MySQL offers an `ENUM` data type, and we have used this a lot in the past.
      We found that removing values from an `ENUM` is a very costly table change.
      We recommend you use a lookup table.
    - [Encoding columns for great profit]({{< relref "2020-09-18-mysql-encoding-fields-for-great-profit.md" >}}) explains how converting string columns with low cardinality can pay off in shrinking the data size.

### BLOBs and files in the database

- **Databases are not good file systems.**
    - When reading values from disk, they pass on through the file system, the database server, are being converted into the column field data type the server uses internally, pushed again into the kernel into the network layer and then finally sent.
      This involves making around three copies of the data, whereas using `sendfile()` or `splice()` to send a static file from the filesystem is zero copy.
      Consider not using the database to store files.

- **max_allowed_packet is an absolute limit.**
    - All data MySQL handles must be smaller than the config value `max_allowed_packet`, even if the field size allows for more.
      In our systems that limit is 16 MB.
    - There are ways around that, using string manipulation of very large strings.
      This eats an insane amount of memory.
      If you find yourself going down that route, stop and reconsider your design or life choices.

- **In MySQL 8, handling `TEXT` and `BLOB` is less costly, but still worthwhile checking.**
    - In the past, any result set that contained `TEXT` or `BLOB` types, no matter how small, forced sort operations to spill to disk, making them slow.
      This is no longer the case for the most recent versions of MySQL 8, but it is still useful in many cases to consider a two-step approach:
        - Step 1: Run a query to select the primary key values you need in the order you need them.
        - Step 2: Run a second query of the form `SELECT id, blobcolumn FROM table WHERE id IN (...)`, with the `...` containing a list of up to 1000 literal id values as constants to fetch the blob data.

- **Using `BLOB` and `TEXT` fields larger than 1 MB can saturate the network using replication and uses a lot of disk space.**
    - MySQL is using row-based replication, and for each row changed will store a pre-image and post-image of the row on disk, for replication.
      This is kept for up to seven days, to enable lagging replicas to catch up.
    - Each replica is then downloading this information, so for each changed 1MB field, 2 MB are copied to each instance.

### DATE and TIME values

- **Be aware of MySQLs awful date and time history.**
    - The date and time types in MySQL have an awful history because of a number of very bad design decisions in the past.
      Most of that is cleaned up by now, but we still see legacy problems in some places because of old data or old code.
      What are the reasons for the bad things:
        - MySQL allowed partial dates, '2022-01-00' for "I do not know the day", or '2022-00-00' for "I have no idea about month and day".
          They are no longer allowed (`NO_ZERO_IN_DATE`).
        - MySQL allowed zero dates ('0000-00-00'), and conflated them with the `NULL` value.
          This is no longer allowed (`NO_ZERO_DATES`).
        - MySQL had a magic type `TIMESTAMP` that in a magic position behaved magically.
          Specifically, the leftmost `TIMESTAMP` column was automatically set to `NOW()` when it was not explicitly set to a value, but other columns of a row were changed.
          This was used to implement `changed_at` columns.
          Today, you can apply this to any `DATETIME` or `TIMESTAMP` in any position, using an explicit `ON UPDATE CURRENT_TIMESTAMP` clause.
          There are lots of special rules and exceptions that document past behavior and an attempt at compatibility and migration. [The manual on the state of things](https://dev.mysql.com/doc/refman/8.0/en/timestamp-initialization.html).
- **MySQL `DATE`, `TIME` and `DATETIME` types do not deal with timezones.`TIMESTAMP` does.**
    - But only if the timezone tables in the mysql.* schema are initialized.
    - The current timezone you are in is defined as a default for the server, and can be overridden as a connection property.
      It is likely not a good idea to do that.
    - You can shoot yourself in the foot with timezones, DST boundaries and interval arithmetic. [How that happens]({{< relref "2021-04-02-making-an-unexpected-leap-with-interval-syntax.md" >}}).
- **Prefer `DATETIME`, not `TIMESTAMP`, unless it's `changed_at`.**
    - The range of `TIMESTAMP` is limited and has a year 2038 problem.
- **DATETIME, TIME and TIMESTAMP can have microsecond resolution if desired.** In MySQL, `DATETIME`, `TIME`, `TIMESTAMP` can have fractional resolutions up to microsecond resolution. To get that, specify a precision such as `DATETIME(6)`, `TIME(6)` or `TIMESTAMP(6)`.
- **Use minimum and maximum values as boundaries in time ranges.** If you define time ranges, use field names such as `valid_from` and `valid_until`. If you are using `DATETIME` types for that, use `1000-01-01 00:00:00` for "minus infinity" and `9999-12-31 23:59:59` for "plus infinity", as these are the minimum and maximum values for this type. Do not use `NULL` values, as they will not compare.
- Be aware that the SQL `BETWEEN` operator is a closed interval (`WHERE id BETWEEN 4 and 7` will return 4, 5, 6 and 7), and you often want half-open interval (`WHERE now() >= valid_from AND now() < valid_until`). **Avoid using BETWEEN to avoid ambiguity of the nature of the interval and assumptions on the code readers side.**

### JSON data type

- MySQL 8 provides JSON functions.
  They are a bit clunky, but work very well.
  When using JSON functions, also learn about generated columns and virtual indexes.
  This is new functionality in MySQL 8, and that means it is less tested than other code.
  [JSON basics]({{< relref "2020-09-04-mysql-json-data-type.md" >}}), [Generated columns and virtual indexes]({{< relref "2020-09-07-mysql-generated-columns-and-virtual-indexes.md" >}}).
- `JSON` in MySQL always uses the `utf8` character set.
  This is a bug, it should be using `utf8mb4`, but currently not fixed.
  The effect is that Emoji and other letters with 4-byte UTF-8 encodings cannot be used there.

### Common column types that applications use

- **email** varchar(255) character set utf8mb4
- **phone** bigint unsigned (E.164 format)
- **ip_address**  varbinary(16), because IPv6 is a thing. Check out `INET6_ATON()` and virtual indexes on generated columns as a convenience. `SELECT ... FROM t WHERE request_ip = INET6_ATON("141.255.161.178")`
- **base64**, blob, mediumblob, for **JSON** there is a special new JSON type.
- **language** char(2) for [ISO-639-1](https://www.iso.org/iso-639-language-codes.html) codes, named `lang`, `language_code`.
- **country** char(2) for [ISO-3166](https://www.iso.org/iso-3166-country-codes.html) alpha-2 country codes.
- **IBAN** varchar(34)

## Foreign Key Constraints

- **Avoid foreign key constraints, unless you are in a department that specifically requires you use them.**
  MySQL allows you to define foreign key constraints.
  They come at a price:
    - Foreign key constraints can only refer to columns in the same database instance, but our schemas have more data than fits into a single schema, and often requires you work across database instances using multiple handles.
    - Foreign key constraints are always immediate.
      That means they are checked at the end of each statement, not at the end of a transaction ("deferred"), forcing an order to your SQL statements inside a transaction.
      This is often inconvenient.
    - Foreign key constraints with cascades (ON DELETE CASCADE, ON DELETE SET NULL and similar) are writes generated at the InnoDB engine level, not at the MySQL binlog level. 
      They are not visible in the binlog.
      If you are using Change Data Capture or Online Schema Changes that based on the binlog (`gh-ost`), they break in the face of such FK constraints.    
    - Foreign key constraints require additional lookups and additional locks.
      This can lead to lock escalation and a higher deadlock rate, impacting throughput.
    - With foreign key constraints it is possible to create undeletable and unupdatable rows.
    - Foreign Key Constraints with `ON UPDATE` and `ON DELETE` clauses can cause spooky action at a distance, and can also cause large bulk deletes and updates that will break replication.
    - Foreign Key Constraints break all tooling we have for Online Schema Change and for automated database splits. 
      Table changes become extremely toil for everyone involved.
    - Foreign Key Constraints break Group Replication, which we depend on.
    - Because of that we recommend you do not use foreign key constraints.
      They usually provide a lot of toil and little benefit.
    - Exceptions exist. Check your departments engineering guides.

- [What are Foreign Keys, and Foreign Key Constraints]({{< relref "2020-08-03-mysql-foreign-keys-and-foreign-key-constraints.md" >}}), [Foreign Key Constraints and Locking]({{< relref "2020-08-03-mysql-foreign-keys-and-foreign-key-constraints.md" >}}).

## Transactions

- **Keep transaction runtime short.** Long-running transactions will build a large Undo log and slow down the database for everyone.
  A transaction taking fractions of a second is fast, a transaction being kept open for minutes or even hours is not. [The effect of long-running transactions on performance]({{< relref "2019-11-18-a-blast-from-the-past.md" >}}).
- **Keep transaction size in the range of 1000 to 10000 rows for batch loading.**
  Larger transactions are incompatible with group replication, and also will not provide speedup.
  Smaller transactions cause excessive sync to disk, and are not fast. [Commit size and write speed]({{< relref "2020-07-27-mysql-commit-size-and-speed.md" >}}).
- **Use the default transaction isolation level REPEATABLE READ.**
  There were use-cases for READ COMMITTED in the past, but with [`SELECT ... SKIP LOCKED`](https://dev.mysql.com/blog-archive/mysql-8-0-1-using-skip-locked-and-nowait-to-handle-hot-rows/) in MySQL 8 and row based replication, most of these are gone. [What are isolation levels?]({{< relref "2020-07-29-mysql-transactions-the-logical-view.md" >}}),  [Proper counters with locking]({{< relref "2020-07-30-mysql-transactions---writing-data.md" >}}).
- To start a transaction, MySQL offers several semi-equivalent syntax variants: `BEGIN`, `BEGIN WORK` and `START TRANSACTION READ WRITE`. Check what your ORM is using.
    - **Only `START TRANSACTION READ WRITE` should be used.** It is the only syntax that signals write-intent or read-intent (`START TRANSACTION READ ONLY`) in the opening statement, and hence the only statement that load balances properly in ProxySQL.

    - ProxySQL will have to assume write-intent in all cases if `BEGIN` or `BEGIN WORK` are being used. This will run even read-only transactions on the primary, and scale badly, unless two application database handles are being used.

### Idempotent Queries

Databases have transactions. 
It is not strictly necessary to formulate queries as replayable (idempotent).
Things that are being wrapped in a transaction will all either execute together or not at all, and once the commit returns successfully the data is guaranteed to be persisted.

That said, **it is useful to use replayable forms of write-queries because they are more resilient** and make certain recovery operations easier.

### Read-Modify-Write, Counters and `SELECT ... FOR UPDATE`

A common scenario in transactional databases is making a change to an existing record, for example updating a description, incrementing a counter or changing the state of a work item in a state machine.

You can think of that as "taking a value temporarily out of the table" (like lending a book from a library) by locking it, making the change in the application, and then putting it back by running the actual update.

The correct way to do this is to

- start a transaction using `START TRANSACTION READ WRITE`
- read the value to be modified by using `SELECT ... FOR UPDATE`, in order to not only select the row in question, but also pre-lock it the way a later write would. `SELECT ... FOR UPDATE` is a read statement, but applies X-locks like an `UPDATE`. This is "taking the value temporarily out of the table".
- You can now make changes to the record in application memory.
- Then run `UPDATE ... SET ...` to write the change back.
- On `COMMIT` the change will be persisted and the lock will be dropped.

This is called a read-modify-write (RMW) transaction, and is the correct way to achieve such multi-statement changes atomically. 
You need to find out how your ORM creates RMW transactions.

Some notes:

- This is discussed at length in [MySQL Transactions (Read-Modify-Write)]({{< relref "2020-07-30-mysql-transactions---writing-data.md" >}}).
- Make sure `START TRANSACTION` syntax is being used, not `BEGIN` syntax.
- `COMMIT` can fail, you must check success and be prepared to re-run the entire transaction.
- A transaction must not extend across a user interaction. You must not `SELECT ... FOR UPDATE` and then wait for user input. A transaction must be finished in fractions of a second.

### Optimistic locking

**To ensure record identity across user interaction, optimistic locking is commonly used.** The problem to solve is: We load a record into the application memory and then let the user perform changes. We need to write the changes back, but the record may have been simultaneously changed by a second connection.

We cannot take an X-lock on the record and keep record ownership for a long time across a user interaction, because that will destroy performance in many ways (Imagine a user opening the edit screen and then going on vacation or even just a lunch break).

There are two common ways to solve this, which are collectively called "optimistic locking":

- You write back the change in an update where you guard the `UPDATE` with the full set of old column values in the update: `UPDATE t SET col1=new_value1, col2=new_value2, ... WHERE col1=old_value1, col2=old_value2, ...`. The update will fail and not change any row, if any old value has changed since we loaded the original row into the editor presented to the user. It is then possible to present the change to the user and let them resolve the conflict.
- Similarly, we can have version numbers in each row, and guard the update with the version number. `UPDATE t SET col1=changed_value, version=old_version+1 WHERE id=pk_value AND version=old_version`. The update can happen on the combination of `id` and `version`, and will fail if the version changed while we were waiting for user input.
    - It is important for the version number to be **not** part of the primary key, because otherwise we get versioned entries in our data table. This is usually not a desirable trait in transactional systems (see *Tombstones* elsewhere).

### Job Queues (and SKIP LOCKED)

MySQL is not actually a queueing system. **Talk to Kafka about queues and do not use MySQL as one.** Using MySQL as a queue will deliver "exactly once delivery" of jobs, at the cost of at least one disk write per enqueue and dequeue, which translates into fantastic monetary values in a cloud environment by the way of very high IOPS values.

MySQL has been used as a queue [in some scenarios on bare metal]({{< relref "2021-01-28-database-as-a-queue.md" >}}), because it is so obvious and convenient. Looking at the cloud, avoid that and use a proper queue service for your problem.

If you must use MySQL as a queue, at least [do it right]({{< relref "2021-07-13-mysql-a-job-queue-in-python.md" >}}), and lock properly using `SKIP LOCKED`.

For writing to MySQL and Kafka, consider the Outbox pattern ([Outbox pattern](https://developers.redhat.com/articles/2021/09/01/outbox-pattern-apache-kafka-and-debezium)) and talk to the Kafka team.

## Sorting

Database servers are often more expensive and centralized machines compared to their clients, and harder to scale. We have found that is it useful to **sort in the client where it makes sense** instead of using `ORDER BY`.

## Subqueries

- **Prefer `JOIN` over subqueries.** MySQL 8 is better at optimizing subqueries than older versions of MySQL, but it is usually still safer to write a `JOIN` than to use the equivalent subquery syntax. If you come from Red Oracle, you have learned things to be the other way around and need to adjust.
- This is especially true for subqueries with negations (`WHERE NOT EXIST`) to find missing values. Use a `LEFT JOIN` with `IS NULL` on a right-hand side value to achieve the same result much faster.

## Tombstones (`is_deleted` flags)

- **Avoid Tombstones.** Tombstones are a per-row flag that marks a row as deleted. All queries to the table need their `WHERE`-clause to be amended by a `AND is_deleted = 0` term or similar to find only non-deleted rows. Tombstones are usually not a good idea.
    - The old data will increase the size of the active transactional table. This will increase the working set of the database, and require a larger instance.
    - The tombstone flag needs to be indexed, or even become part of the primary key, in order to eliminate dead rows quickly.
    - The MTTR of the system after failure is higher because the database is larger, being bloated with dead data.
    - Actually physically deleting the tombstone data is a cumbersome process when done in large batches.
- **It is usually preferable to build transactional systems that are small and contain only life data in transactional tables.** Log data with temporary structure should at least go to other tables with log nature, or even to different machines that are handling the archival log and are not part of the critical, transactional production scope.
    - You can write records to the transactional table. When they retire, instead of deleting, move them to a log table.
    - You can double write records on creation to the transactional table and the log table, then mirror the entire lifecycle on both tables.
- **Typical scenarios where Tombstones are deadly:** A queue-like structure in a table ("Picklists", "Producer/Consumer Scenarios", "State machines in a table")
    - It is sometimes okay to keep old inventory records around in a lookup table if there is a chance that items elsewhere still refer to the deactivated inventory.
    - In general, it is often useful in transactional systems to keep the working set aggressively small, and then keep non-critical data in other tables in the same system, or even in dedicated non-transactional systems. How little data do I need in order to be able to take their money successfully?

## Partitions

Partitions are a way to split a large table internally into a number of small tables, while still presenting the interface of a single table to the user.
**They may be useful for tables > 30 GB in size, a quarter of an instance's memory size.**

Partitioning always works on the primary key, or the prefix of a compound (multi-column) primary key.
Internally, MySQL uses (a part of) the primary key to decide into which internal table (partition) to put the row.
The optimizer may use this to reduce the number of partitions to search when running queries.

Also, instead of deleting many rows individually, it may be possible to speed up some deletions by running an `ALTER TABLE ... DROP PARTITION ...` to quickly remove data.
On the other hand, running DDL queries in the normal application workflow likely is going to need a compliance exception.

Partitions can work on a `RANGE` or `LIST` of column values, or on a hash function (`KEY` uses a system-supplied hash, `HASH` uses a user-supplied function).
`RANGE` and `LIST` can speed up queries by enabling the optimizer to eliminate partitions before access. `HASH` and `KEY` "spray" data across many partitions, and can make insertion faster and more even.

Talk to a DBA about planning proper partitioning, taking your workload and access pattern into account.

## Using MySQL in a replication environment

- Our MySQL is always [in a treelike replication structure]({{< relref "2021-03-24-a-lot-of-mysql.md" >}}) to place read copies of the data close to the application. This provides low latency data access.
- **Writes always go to the root of the replication tree, the current primary.**
- Your application has access to segregated read and write handles for database access.
  **Make sure you are using the proper handle.**
- **Replication speed is mostly a function of workload.** DBAs can keep replication running, but they cannot really make a server replicate faster.
- **Use replication-aware bulk functions.** Your database access library has functions to prevent overloading a replication hierarchy. Use them, and when they don't work - "**don’t get creative, get help**."
    - DBAs can indeed speed up replication by changing the server configuration to a mode where disk writes are not properly persisted. By writing to disk less the server can replicate faster, at the cost of losing data should there be a fail-over situation while this configuration is active. This is known as "YOLO"-Mode.
- Our MySQL topology is managed by a program called [Orchestrator](https://www.percona.com/blog/2016/03/08/orchestrator-mysql-replication-topology-manager/).
  Orchestrator takes care of Primaries and Intermediate Servers failing, rearranging the surviving members into a valid replication tree.
  It also informs our server discovery mechanisms of the change.
  This means:
    - Your application cannot rely on write- and read-handles pointing to static machines, when DNS is used.
      **You must re-resolve hostnames immediately before reconnecting.**
      You must make sure that your code does not internally cache DNS query results (Java!).

# Debugging performance problems

## High CPU?

MySQL typically does not use much CPU.
Servers with high CPU usage are having one of three problems:

- Queries not using indexes, scanning a table completely, in memory.
    - Identify the query not using indexes and fix the schema or the query (see below).
- Excessive sorting in the server.
    - If possible, access the data in index order, or do the sorting in the client where it scales better.
- Code in the database is being run (i.e. somebody has been using stored procedures, stored functions or similar)
    - Destroy the codebase and start over from scratch.

## Finding problematic queries using Vividcortex

On many replication hierarchies we have probes running that log query data into "Solarwinds DPM" (previously known as VividCortex).
If you do not have access or your replication hierarchy has no probes, contact DBA.

## Finding problematic queries using `sys.*`

All database servers by default have installed a series of views in `sys.*`.
These read data from `performance_schema.*` (P_S for short), which is partially enabled on all machines.

P_S is documented in [https://dev.mysql.com/doc/refman/8.0/en/performance-schema.html](https://dev.mysql.com/doc/refman/8.0/en/performance-schema.html).
It is optimized for logging performance data without impacting performance much.
It is not optimized for access by humans.

The `sys.*` (sys for short) is fixing that, presenting a number of useful views on P_S, for human consumption and reporting.
sys is documented in [https://dev.mysql.com/doc/refman/8.0/en/sys-schema.html](https://dev.mysql.com/doc/refman/8.0/en/sys-schema.html).

All views in sys exist in two variants: the regular variant for humans (`sys.host_summary_by_file_io`) and the `x$` variant presenting unabridged data at full resolution for reporting (`sys.x$host_summary_by_file_io`).
Numbers in the regular variant are shortened and suffixed with units ("15m", "100k") or transformed into human time scales (runtime `01:02:03`). Numbers in `x$` views are presented raw.
It is useful to work interactively with the regular variants and the run the final report on the `x$` variant for full data.

Note that meaningful performance data can be gathered only on production instances, but you can craft performance insight queries on test instances easily.
You will then need to run these on production instances to actually get production performance data.

## Missing indexes

The most common cause for slow query execution is "missing indexes".
Once you have identified queries with slow execution time using Solarwinds DPM or sys, run the `explain` command on them to see their execution plan.
Refer to [Explaining EXPLAIN: Queries and what happens when you execute them](https://www.slideshare.net/isotopp/explaining-explain) ([version without presenter nodes](https://www.slideshare.net/isotopp/explain-explain-no-presenter-notes)) to better understand what goes on.

Most commonly, one of these things needs fixing:

- add missing indexes
- formulate a query with dependent subqueries to use some kind of join
- formulate a query with multiple range clauses in a way that resolves in multiple steps

DBA can help you with this problem.

## Mismatching types

A longstanding problem in MySQL was a type mismatch in a join.
If you have a query with a `a JOIN b ON a.col1 = b.col1`, and the instances of `col1` in the two tables have incompatible (different, and not coercible) types, an index cannot be used to resolve the query, even if it exists.
That is, if `col1` is a `varchar` in `a`, but an `int` in `b`, the join will be slow.

The problem can also often be provoked in a `WHERE` clause such as `WHERE a.col1 = "value"`, with `a.col1`
being integer, and `"value"` written as a string literal due to the quotes.
Again, an index, even if it exists, won't be used.

## Bad Paging

(based on an idea from Yves Orton)

The query `SELECT id FROM Whatever LIMIT 10360000,10000` is an example of paging, where a user or a script want to read a large, full result set in chunks of 10k.

This is not an efficient practice, as the database has to execute the same query over and over.
It may be able to apply some mild optimizations for low limit values (at the start of the paging), but eventually it will have to reproduce large parts of the full table, handing out fragments of 10k rows.
On top of that, MySQL represents result sets internally in a linked list, so `LIMIT` clauses with large offset values are very inefficient.

We could instead fetch one row more, while reading in table native order.
This will get of the offset part in the `LIMIT` clause.
It will not have to physically sort, as the table is read in native primary key order.
And it will only access actual 10k fragments of the table.

```sql
select id from Whatever order by id limit 10001 
```

We output 10k values, and take the final value as a new starting point `lastid`:

```sql
select id from Whatever where id >= :lastid order by id limit 10001
```

and so on.

# Specific Host languages

## Python

- As a developer using Python, I want to be able to hand a `list` to SQL with a `WHERE id IN (…)` clause, and it should do the right thing.
  This can be done by using a prepared statement like ``SELECT .... WHERE `foo` IN %s ...`` and passing in a `list` or a `tuple`
  for the placeholder variable.
  - Full discussion in [Python: WHERE ... IN (...)]({{< relref "2021-10-28-python-where-in.md" >}})
- Important caveats:
    - There are no `()` in the prepared statement after the `IN`
    - Only `list` and `tuple` will work, no other iterables

- As a developer using Python, I want to be able to trace the SQL.
  - Full discussion in [Python: Debug SQL]({{< relref "2022-03-24-debugging-sql-in-python.md" >}})

# Support

## Host, Version, User

The DBA will have a much easier time in helping you, if you have the output of the following query ready when you ask them about your SQL performance problem.

```sql
SELECT @@hostname, @@version, user();
```

This will tell them the actual instance hostname, the precise version string of the database and the username (and by inference, the permissions) you are using to connect.
