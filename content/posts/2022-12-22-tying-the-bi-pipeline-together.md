---
author: isotopp
title: "Tying the BI pipeline together"
date: 2022-12-22T06:07:08Z
feature-img: assets/img/background/mysql.jpg
tags:
- lang_en
- mysql
- mysqldev
- data warehouse
---

In
[Of Stars and Snowflakes]({{< relref "/2022-11-16-of-stars-and-snowflakes.md" >}})
we have been looking at the "normal Form" for Data Warehouses/BI structures, and how it differs from normal forms used in transactional systems.
In
[ETL from a Django Model]({{< relref "/2022-11-20-etl-from-a-django-model.md" >}})
we looked at one implementation of a classical offline DWH with a daily load.

The normal BI structure is a fact table, in which an object identifier (the one we collect facts about) is paired with a point in time to report facts about the object at a certain point in time.
That is, we have a table with a compound primary key, in which a component (usually the latter) has a time dimension.
Fact tables are also often very wide, since we collect any number of facts about the object we report on for each point in time.

For certain types of data, it is useful to compress the data using lookup tables.
That is, instead of reporting a certain value over and over again ("Intel Silver 4110" each time we report on a certain machine), we replace the string with an integer of appropriate size and resolve that with a lookup table on the side.

This can happen with one central string replacement table (`lookup_strings`), or structured per type (`cpu_types`, `vendors`, `model_names`).
Both approaches have certain advantages and disadvantages, and sometimes you find both in the same system.

# Why and how?

In the transactional system, our objective is to complete the data lifecycle.
That is, basically, we want to be able to delete data in order to get rid of finished transactions and their data at some point in time in order to keep the size of the OLTP system small, nice and stable. 
Other parts of the business still need the history record, and they need it *as a history record*.
That is, they are not interested into the current data ("Where does the customer live now?", "What does the article cost now?"), but into the values that were valid when the transaction happened ("Where did we deliver to?", "How much did we bill?").

The **Extraction** pulls data out of the realm of the OLTP system.
And after it is extracted it can be deleted from the OLTP system, freeing space and keeping the size stable.

With the Extraction, we also have the **Transformation** in which the OLTP references to other normalized tables are resolved into literal attribute values which are the things we want to preserve at the value they had back then.
The Transformation transitions the data from the OLTP classical database normal form into the form needed for a fact table, the data warehouse normal form.

In the **Load** phase, the data is loaded into the DWH/BI systems fact table.
This is not just a data ingestion, but often also a validation and cleanup phase. 
And if the data is recompressed by replacing literal values with an integer ID into a lookup table, this usually also happens during load.

The fact that IDs in the DWH bear no relationship to IDs in the OLTP system is important and good:
We are transferring data across an administrative boundary, from one system to another, and having a naming dependency across such a boundary is usually a recipe for desaster.

## Extraction

Extraction can happen in nightly runs, by making a snapshot of the state of the OLTP system.
This is what happens every night in
[ETL from a Django Model]({{< relref "/2022-11-20-etl-from-a-django-model.md" >}}),
and also in
[My private data warehouse]({{< relref "/2020-09-26-my-private-data-warehouse.md" >}}).

Extraction can also happen when writing transactions to a log table, often called `sale`, `booking`, `reservation` or similar.
When the transaction is logged in a normalized way, it looks like the `reservation` table in the example in
[Change Data Capture]({{< relref "/2022-12-05-change-data-capture.md" >}}).

Some systems already copy the data over into such a `reservation` table literally, especially when it comes to delivery and billing addresses and prices.
That is necessary, even from the point of view of the transactional system, because we must record the actual price and delivery address at the point in time when the sale happened.
Later changes should not affect transactions that are in the middle of fulfillment.

For the purpose of the DWH system, this simplifies extraction and transformation, because the `reservation` table then already is more of less literally the data we want.
We just need to grab it and preserve it.

When the DWH wants 'live' updates, this can happen by tailing the database log as a replication client, collecting the information of interest, converting it into target format and pushing it elsewhere.
These days, most often that ends up being a JSON or Avro message on a Kafka Event bus, or similar, in a defined, versioned and documented format that is ideally independent of changes to the source OLTP systems structure.

## Transformation

But getting from normalized 3NF OLTP format into resolved DWH literal value attributes is not always for free.

The nicest way of getting there is to have the source system prepare its private, internal transaction, and also prepare a transformed record in DWH form.
Both are committed together in the same transaction, to the internal tables of the OLTP system, and an Outbox.
The Outbox is under a contract between the producing OLTP and the consuming BI systems, and will not change unannounced.

In this case, the BI process can simply tail the binlog, grab only row change events on the Outbox tables, and process and export these.
Internal table changes will also end up in the binlog, but the CDC extractor ignores these.

If that is not possible, we get random normalized change events from the OLTP systems internal tables.
This is bad, because it is very hard to get a contract and a promise of announced change for them, and because here the data is not in BI form.
So we get a bunch of 3NF "id" values and need to run queries backwards into the OLTP system to resolve them into literal values to perform the transformation.
This is annoying, adds query load and also have the potential to grab "invalid" data, because there is a race condition and the referenced data may have changed between the commit of the record we caught, and the time we resolve the ID values.

## Load

Pushing CDC data "live" to a message bus is simple, and allows us to have multiple consumers for this.
One standard consumer would simply take the event messages and persist them into tables in a really large analytics store such as Hadoop, Snowflake or similar.
Other standard consumers in the environment I work in are aggregators that take events and aggregate them into time buckets.
That is, values from events are counted ("This error occurred `n` times in the last minute"), summed up or otherwise classified, and the results are then forwarded as metrics into a time series store.
Alerts can be generated from thresholds of metrics, or from presence of certain events in the stream.

The data load into the persistent store would also update default aggregations as you would expect from the star or snowflake around a fact table.
Such aggregations would be "sales per region per day", or "bookings per region per category per day".

Specifically the aggregations to the metrics store are time critical, as they may be tied to alerts.
We generally aim for a freshness (processing time for the entire pipeline) of less than 15s.
Freshness itself is also a quality metric for the pipeline itself.

# Mapping Fowler to Database terms

The [Fowler Wiki](https://martinfowler.com/bliki/) is now in many pages older than 10 years.
Large parts of it are still hard to read if you are coming from a database background instead of application developer background.
That is in part, because Fowler reinvents concepts and terms from a developer perspective that already exist in the database world, under different names.

The first time I hit that was when reading up on the cryptically named [CQRS](https://martinfowler.com/bliki/CQRS.html), 
which is just the concept the various ways of getting Materialized Views by another name.

We find this again with the concept of [Event Sourcing](https://martinfowler.com/eaaDev/EventSourcing.html),
which for low quality low level events matches directly on CDC and Binlog capture.
In order to provide better value, you would have to perform the T of ETL on the events, preferably as early as possible in the pipeline,
that is, transform from 3NF to BI form either using the Outbox pattern or by instrumenting the application itself.

Fowler is never discussing checkpointing, an essential concept necessary to prevent unbounded startup times and unbounded event storage sizes from occurring.

Checkpointing and cleanup exist in the database world the concepts of "Full Backups" associated with Log Positions, 
and then Logs starting from the checkpoint for a Point in Time Recovery.

Checkpointing and Log compression also exist in the database world in the tiered log compactions we find in LSMs such as RocksDB:
The database is writing an endless stream of idempotent row change events, and a compaction process reads the logs in the background,
providing only still valid and recent row versions, and physically arranging the records in an advantageous way.

Events work reasonably well when you look vertically at a single transaction:
The event propagates through your system of services, kicking off followup events that contain the original data and additional information accrued at this processing stage.
They also work reasonably well for aggregations in time-bounded buckets or otherwise constrained contexts.

They work less well when the application has to implement choices, i.e. when you need to select one user account out of the storage of all users in the system,
or when you need to allow a user to search the storage of all articles on offer and then allow them select one to buy.
Here, traditional full materialization is necessary, and global state is manipulated.

In the end, looking at the table rows as the materialization and at the log as the stream of idempotent changes to the materialization over time it is clear to the database person that both things are the same.
Looking at the various ways of implementing database systems, you will even find one posing as the other as needed, depending on the database product you look at (i.e. the LSM is a log, posing as a table, and other systems use tables to store logs).
