---
layout: post
title:  'MySQL: ALTER TABLE for UUID'
author-id: isotopp
feature-img: assets/img/background/mysql.jpg
date: 2020-09-22 16:29:52:18 +0200
tags:
- lang_en
- mysql
- mysqldev
- database
- erklaerbaer
---
A question to the internal `#DBA` channel at work: »Is it possible to change a column type from `BIGINT` to `VARCHAR `? Will the numbers be converted into a string version of the number or will be it a byte-wise transition that will screw the values?«

Further asking yielded more information: »The use-case is to have strings, to have UUIDs.«

So we have two questions to answer:

- Is `ALTER TABLE t CHANGE COLUMN c` lossy?
- `INTEGER AUTO_INCREMENT` vs. `UUID`

## Is ALTER TABLE t CHANGE COLUMN c lossy?

`ALTER TABLE` is not lossy. We can test.

```sql
mysql> create table kris ( id integer not null primary key auto_increment);
Query OK, 0 rows affected (0.16 sec)

mysql> insert into kris values (NULL);
Query OK, 1 row affected (0.01 sec)

mysql> insert into kris select NULL from kris;
Query OK, 1 row affected (0.01 sec)
Records: 1  Duplicates: 0  Warnings: 0

...

mysql> select count(*) from kris;
+----------+
| count(*) |
+----------+
|     1024 |
+----------+
1 row in set (0.00 sec)

mysql> select id from kris limit 3;
+----+
| id |
+----+
|  1 |
|  2 |
|  3 |
+----+
3 rows in set (0.00 sec)
```

Having a test table, we can play.

I am running an `ALTER TABLE kris CHANGE COLUMN` command. This requires that I specifiy the old name of the column, and then the full new column specifier including the new name, the new type and all details. Hence the “`id id ...`”

```sql
mysql> alter table kris change column id id varchar(200) charset latin1 not null;
Query OK, 1024 rows affected (0.22 sec)
Records: 1024  Duplicates: 0  Warnings: 0

mysql> select count(*) from kris;
+----------+
| count(*) |
+----------+
|     1024 |
+----------+
1 row in set (0.00 sec)

mysql> select id from kris limit 3;
+------+
| id   |
+------+
| 1    |
| 1015 |
| 1016 |
+------+
3 rows in set (0.00 sec)

mysql> show create table kris\G
       Table: kris
Create Table: CREATE TABLE `kris` (
  `id` varchar(200) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
1 row in set (0.00 sec)
```

We can see a number of things here:

- The conversion is not lossy: We have the same number of records, and the records are still sequences of decimal digits.
- The order of the output is somehow different. The records which previous showed up in ascending integer order are now showing up in ascending alphabetical order. Given that they are now strings, this is partially logical (if there is an order, it should be alphabetical for strings), and partly mysterious (why is there an order and what happened?).

Let’s go through that step by step.

## Expensive ALTER TABLE

ALTER TABLE tries to do changes to the table in place, without rewriting the entire table, if possible.

In some cases this is not possible, and then it tries to do it in the background. 

In some cases not even that is possible, and then the table is locked, rewritten in full, and unlocked.

Our table change was of the third, most expensive kind.

- An ENUM change that extends the ENUM at the end is the least expensive possible change. We just add a new value at the end of the list of possible values for the ENUM. This is a change to the data dictionary, not even touching the table.

  - An ENUM change in the middle of the list requires recoding the table. Turning an `ENUM(“one”, “three”)` into an `ENUM(“one”, “two”, “three”)` is expensive. Turning `ENUM(“one”, “three”)` into `ENUM(“one”, “three”, “two”)` is cheap. MySQL stores ENUMs internally as integer, so the expensive change re-encodes all old “three” values from 2 to 3. The cheap change stores “three” as 2, and adds 3 as an encoding for “two” in the data dictionary.

- Some `ALTER TABLE t ADD index` variants are examples for things happening in the background. They still cost time, but won’t lock. The index will become available only after its creation has finished. There cannot be multiple background operations ongoing.

In our case, we internally and invisibly

- Lock the original table.
- Create a temp table in the new format.
- Read all data from the original table, write it into the new table as an `INSERT INTO temptable SELECT ... FROM oldtable` would do.
- `RENAME TABLE oldtable TO temptable2, temptable TO oldtable; DROP TABLE temptable2;`
- Unlock everything and are open for business again.

This process is safe against data loss: If at any point in time this fails, we drop the temptable and still have the original table, unchanged.

This processes temporarily doubles disk usage: For some time, the table to be converted will exist in both variants. It requires an appropriate amount of disk space for the duration of the conversion.

This process can be emulated. Locking a production table for conversion for an extended amount of time is not an option. Online Schema Change (OSC) does the same thing, in code, while allowing access to the table. Data changes are captured in the background and mirrored to both versions. Multiple competing implementations of this exist, and we have institutionalized and automated this in the DBA portal at work.

This process does the `INSERT ... SELECT ...` thing internally (and so does OSC). That is why the conversion works, and how the conversion works. The rules are the MySQL data type conversion rules, as documented in the manual.

## There is an order, and it changed

When looking at the test-`SELECT` we see there seems to be an order, and it changed.

There is an order, because the column I changed was the `PRIMARY KEY`. The MySQL InnoDB storage engine stores data in a B+-Tree.

A B-Tree is a balanced tree. That is a tree in which the path length of the longest path from the root of the tree to any leaf is at most one step longer than the shortest path.

So assuming a database with a page size of 16384 bytes (16KB), as MySQL uses, and assuming index records of 10 bytes (4 byte integer plus some overhead), we can cram over 1500 index records into a single page. Assuming index records of 64 bytes - quite large - we still fit 256 records into one page.

We get an index tree with a fan-out per level of 100 or more (in our example: 256 to over 1500).

For a tree of depth 4, this is good for 100^4 = 100 million records, or in other words, with 4 index accesses we can point-access any record in a table of 100 million rows. Or, in other words, for any realistic table design, an index access finds you a record with at most 4 disk accesses.

> 4 (or less):
> The number of disk accesses to get any record in any table via an index.

In the InnoDB storage engine, the PRIMARY KEY is a B+-Tree. That is a B-Tree in which the leaves contain the actual data. Since a tree is an ordered data structure, the actual data is stored in primary key order on disk.

- Data with adjacent primary key values is likely stored in the same physical page.
- Data with small differences in primary key values is likely stored closer together than data with large differences in primary key values.
- Changing a primary key value changes the physical position of a record. Never change a primary key value (Never `UPDATE t SET id = ...`).
- For an AUTO_INCREMENT key, new data is inserted at the end of the table, old data is closer to the beginning of the table.
  - MySQL has special code to handle this efficiently.
  - Deleting old data is not handled very efficiently. Look into [Partitions](https://dev.mysql.com/doc/refman/8.0/en/partitioning.html) and think about `ALTER TABLE t DROP PARTITION ...` for buffer like structures that need to scale. Also think about proper time series databases, if applicable, or about using Cassandra (they have TTL).


We remember:

> In InnoDB the primary key value governs the physical layout of the table.

Assuming that new data is accessed often and old data is accessed less often, using primary keys with an AUTO_INCREMENT value collects all new, hot records in a minimum number of data pages at the end of the table/the right hand side of the tree. The set of pages the database is accessing a lot is minimal, and most easily cached in memory.

This design minimizes the amount of memory cache, and maximizes database speed automatically for many common access patterns and workloads.

That is why it was chosen and optimized for.

## Random, Hash or UUID primary key

Consider table designs that assign a primary key in a random way. This would be for any design that uses a primary key that is an actual random number, the output of a cryptographic hash function such as SHA256(), or many UUID generators.

Using an `integer auto_increment primary key`, we are likely to get hot data at the right hand side, cold data at the left hand side of the tree. We load hot pages, minimising the cache footprint:

![](/uploads/2020/09/pk-order.png)

*AUTO_INCREMENT integer primary key controlling data order. Hot data in few pages to the "right" side of the tree, minimal cache footprint*

But with a random distribution of primary keys over the keyspace, there is no set of pages that is relatively cold. As soon as we hit a key on a page (and for hot keys, we hit them often), we have to load the entire page into memory and keep it there (because there is a hot key in it, and we are likely to hit it again, soon):

![](/uploads/2020/09/random-order.png)

*Primary Key values are randomly chosen: Any page contains a primary key that is hot. As soon as it is being accessed, the entire 16KB page is loaded.*

So we need a comparatively larger (often: much larger) amount of memory to have a useful cache for this table.

> In MySQL, numeric integer primary key auto_increment optimizes memory footprint for many workloads.

## MySQL provides a way out: UUID_TO_BIN(data, 1)

Unfortunately, MySQL itself produces UUID() values with the UUID function that sort very badly:

```sql
mysql> select uuid();
+--------------------------------------+
| uuid()                               |
+--------------------------------------+
| 553d5726-eeaa-11ea-b643-08606ee5ff82 |
+--------------------------------------+
1 row in set (0.00 sec)

mysql> select uuid();
+--------------------------------------+
| uuid()                               |
+--------------------------------------+
| 560b9cc4-eeaa-11ea-b643-08606ee5ff82 |
+--------------------------------------+
1 row in set (0.00 sec)

mysql> select uuid();
+--------------------------------------+
| uuid()                               |
+--------------------------------------+
| 568e4edd-eeaa-11ea-b643-08606ee5ff82 |
+--------------------------------------+
1 row in set (0.00 sec)
```

MySQL provides the `UUID()` function as an implementation of [RFC 4122 Version 1 UUIDs](https://www.ietf.org/rfc/rfc4122.txt).

The manual says:

- The first three numbers are generated from the low, middle, and high parts of a timestamp. The high part also includes the UUID version number.
- The fourth number preserves temporal uniqueness in case the timestamp value loses monotonicity (for example, due to daylight saving time).
- The fifth number is an IEEE 802 node number that provides spatial uniqueness. A random number is substituted if the latter is not available (for example, because the host device has no Ethernet card, or it is unknown how to find the hardware address of an interface on the host operating system). In this case, spatial uniqueness cannot be guaranteed. Nevertheless, a collision should have *very* low probability.

Having the timestamp in front for printing is a requirement of the standard. But we need not store it that way:

MySQL 8 provides a [UUID_TO_BIN()](https://dev.mysql.com/doc/refman/8.0/en/miscellaneous-functions.html#function_uuid-to-bin) function, and this function has an optional second argument, swap_flag.

»If `swap_flag` is 1, the format of the return value differs: The time-low and time-high parts (the first and third groups of hexadecimal digits, respectively) are swapped. This moves the more rapidly varying part to the right and can improve indexing efficiency if the result is stored in an indexed column.«

# TL;DR

So if you must use an UUID in a primary key

- Choose MySQL 8.
- Make it VARBINARY(16).
- Store it with UUID_TO_BIN(UUID(), 1).
- Access it with BIN_TO_UUID(col, 1).

See also:

- MySQL Server Team Blog on [UUID support for MySQL 8](https://mysqlserverteam.com/mysql-8-0-uuid-support/).
- MySQL Server Team on [the pain of pre-MySQL 8 UUID](https://mysqlserverteam.com/storing-uuid-values-in-mysql-tables/) (Article from 2015).
