---
author: isotopp
date: "2022-04-04T08:42:00Z"
feature-img: assets/img/background/mysql.jpg
title: "Change Data Capture and the Binlog"
tags:
- database
- mysql
- lang_en
---

MySQL uses replication to do an ongoing life restore of a primary server to any number of replicas.
How replication came to be I have discussed previously [in another article]({{< relref "2020-11-27-backups-and-replication.md" >}}).

Modern replication uses row based replication, with a minimal row image and compression. What is that?

# Decoding the Binlog

When using Row Based Replication, the Row Change event is represented using the `BINLOG` statement in the output of the `mysqlbinlog` command.
It has a single string parameter, the base64 encoded pre- and post-change row images.

Adding the `-v` option multiple times will decode that:  `mysqlbinlog -vvv`.
It shows a pseudo SQL statement affecting a single row.

```console
# at 1140
#220404 16:34:41 server id 187076016  end_log_pos 1140 CRC32 0x0112f9b6 
         Table_map: `kris`.`testtable` mapped to number 92
# at 1140
#220404 16:34:41 server id 187076016  end_log_pos 1140 CRC32 0xe3714794
         Delete_rows: table id 92 flags: STMT_END_F

BINLOG '
AQJLYhOwjSYLWwAAAAAAAAAAAFwAAAAAAAEAEHBheW1lbnRjb21wb25lbnQAFHBheW1lbnRfc2Vz
c2lvbl9kYXRhAAUI9Q8P9QYEFgCHAAQeAQEAAgEItvkSAQ==
AQJLYiCwjSYLLAAAAAAAAAAAAFwAAAAAAAEAAgAFAQDcTtUTAAAAAJRHceM=
'/*!*/;
### DELETE FROM `kris`.`testtable`
### WHERE
###   @1=332746460 /* LONGINT meta=0 nullable=0 is_null=0 */
```

This example from an RBR binlog shows the replication context.
Note the table map, which translates a table name into an internal table_id, followed by the binlog checksum and log positions.
Below that, the actual row change is decoded into a `BINLOG` statement, and the pseudo SQL it translates to.

The MySQL primary and its replicas have identical metadata.
While some metadata is part of replication, such as column numbers and data types, other metadata is not part of replication, for example, the column names.

Note that even with `binlog_format=row` configured, some statements are still being replicated as statements -- notably, all statements that do not change rows are replicated as statements.
That is for example all DDL: you will see `CREATE`, `DROP` and `ALTER` statements.

# How much row is in an RBR binlog?

Originally, the rows in an RBR binlog were full images of the row, once before the change and once after the change. 
This can be a lot of data in a table that has `TEXT`, `BLOB` or `JSON` columns.

The pathological case is a table with a primary key, a counter and a large `TEXT` column, incrementing the counter.
In this case, the `TEXT` is replicated twice per changed row, unchanged, for an increment of a 4 byte counter.

This was relatively quickly fixed by introducing the `NOBLOB` and `MINIMAL` row image formats.
`NOBLOB` contains all columns before and after the change, except for `BLOB` and `TEXT` columns, unless they changed.
`MINIMAL` logs only the primary key in the pre-image and contains only changed columns in the post-image.

This saves a lot of disk space, while still maintaining all information necessary to safely update a replica.

Surprisingly, this is already quite efficient: For our workloads at work, RBR already creates smaller binlogs than SBR, even with `FULL` format (around 1/2 to 1/3 the size of SBR binlogs).
`MINIMAL` can bring these numbers down even further.

# If RBR is so efficient, why compression?

Yet, for a large number of replication hierarchies, binlog storage is expensive and often a limiting factor given the fixed size of the disks we use.

We want to store several days of binlog, in order to be able to roll forward from restored backups.
But because some replication hierarchies see a lot of churn, we get many row changes due to all these write operations.
We should expect that: Online Transaction Processing has a singular purpose in life -- to transact.

Using compression, we use less disk space to store transaction, so we can store more of them in the same amount of disk space.
MySQL compressed binlog events using zstd compression.
Compressed binlog events encapsulate a regular binlog event each, so compression is per-event.

Per-event compression is slightly less efficient than per-file, but has the advantage of easy implementation:
After applying decompression to a compressed binlog event, a normal binlog event emerges, as before the change.

That makes it easy for all binlog consumers to update to the new format with minimal changes:
Basically you need to add zstd as a dependency, and if you see a compressed event, decompress it and handle it as before.

# CDC versus replication

The binlog is a MySQL internal data structure.
It exists to facilitate replication between instances of MySQL.
It is useful for other things, but as the binlog evolves, these other things have to track the changes.

For example, a lot of work is currently being done on CDC with various tools.
The objective is mainly 
"Use replication as a channel to extract database changes in a defined format, and put them on a Kafka bus.
These change events will then be used to re-create a database image in other formats, for example in Hadoop or elsewhere."

So, to formulate it somewhat pointedly, at the purely operational level we are busy reinventing replication in JSON or Avro on Kafka.
To save face: At the data modelling level things are a bit more involved.

Unfortunately, this poses several challenges on the source databases:

- Initial data load does not consume a backup in one of our backup formats, but requires a life database instance, as the data load happens by queries instead of parsing data files.
  - As the data load needs to be consistent, mapping to exactly one binlog position, it holds a consistent read view for a long time.
  Holding a consistent read view for a long time slows down MySQL a lot, so this instance becomes unusable for everybody but the data loader.
  Some data loads use multiple instances for speed.
- The CDC log parsers ask for full binlogs for simpler parsing.
  - MySQLs own replication demonstrates that a minimal binlog is sufficient for replication, so it must be sufficient for CDC as well -- but that requires access to the full previous image of the row to fill in the missing data. 
  As CDC does not have access to the full previous row image, it requests full format. 
  Fixing that is considerable scope creep:
  instead of reinventing replication you are now reinventing the database.
- The CDC log parsers ask for uncompressed binlogs.
  - That's fixable relatively easily by learning to parse and use zstd, and doable.

## Foreign Key Constraints and CDC

In MySQL, foreign key constraints are not implemented at the MySQL level, they are implemented at the engine level, for example in InnoDB.
Sometimes, FK constraints generate writes, for example when `ON DELETE CASCADE` or `ON DELETE SET NULL` clauses are being used.
Because these writes are not coming from the MySQL level, they will never show up in the binlog.

MySQL's foreign key constraints are fundamentally incompatible with CDC, and must never be used in hierarchies that use CDC.

# Transactionality and CDC

MySQL writes a binlog record only on commit.
As long as the transaction does not commit successfully, nothing is visible to replicas, and neither to CDC.

The data written to the binlog are all the row changes affected by a set of statements in a transaction. 
It is not geared to business level events of the kind we want to see on our Kafka, but logs table level changes to the SQL schema.

## Outboxes - why and how?

The data written to the binlog will reflect changes to the table structure, as the schema evolves based on the needs of the team owning that schema. 
Since the CDC stream sees the same changes, the data format in there will also change, and break downstream consumers.

One might entertain the idea of not reading data from MySQL binlogs, but implementing CDC at the application level. 
This has a few advantages:

- MySQL binlog format may evolve and change, as MySQL evolves and changes. 
  For example, a hierarchy may convert to group replication (many do), compression is being introduced, compliance may require encryption or other changes. 
  We may not want this tight coupling, but be able to upgrade and change individual instances at will.
- The schema may evolve depending on the needs of the schema owner, which affects the format of events in the binlog, breaking downstream CDC consumers.
  We may not want this tight coupling, but be able to evolve applications and their schema at will.

But emitting CDC events at the application level introduces great complexity:
We must make sure that only events that are actually committed are visible on the bus, and that conversely no events are lost.

The default workaround at this point in time is the outbox:
Applications perform their changes to the data as they wish, and in the same transaction also write to a table in a fixed format, the outbox.

CDC reads the complete binlog, discards all writes except writes to the outbox, and uses the outbox changes to create a message on the bus.

This guarantees a fixed data format, as the format of the outbox table is fixed, while allowing the data owner to change all other tables at will.

It guarantees transactionality as well: as the writes to the private tables and to the outbox happen in a single transaction, they will always succeed or fail together.

And it is relatively simple to implement.

## Not using Outboxes and not using binlog

But Outboxes are still dependent on reading the MySQL binlog format.
Every time that changes, CDC breaks.
Or if it needs to change, the change needs to be coordinated between the data owners of a schema and all their consumers and dependencies.

The alternative, emitting a CDC event and performing a change to the database, can only work with some kind of commit tracking in the database.

This exists, but is a relatively new and untested feature in MySQL:
[Server Tracking of Client Session State](https://dev.mysql.com/doc/refman/8.0/en/session-state-tracking.html).
Not all client libraries have full support for session state tracking, yet.

Session State Tracking allows a client to MySQL to know what the server is currently doing:
for each piece of 
[Connection Scoped State](2020-07-28-mysql-connection-scoped-state.md)
a tracker exists, so the client has access to the session state on a controlled way, and is notified if any state on the server changes.

For the purposes of CDC, the GTID tracker informs the client if a commit to the server succeeded and a global transaction id was assigned.
The client gets a chance to correlate bus events with database transactions, and make sure both match.

While being a much more complicated approach, it has the chance of breaking the dependency of being able to read MySQL binlogs.
It is still a work in progress, though.
