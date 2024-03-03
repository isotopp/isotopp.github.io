---
author: isotopp
title: "Of Stars and Snowflakes"
date: "2022-11-16T06:07:08Z"
feature-img: assets/img/background/mysql.jpg
tags:
- lang_en
- mysql
- mysqldev
- data warehouse
---

# A sample system

When you have an Online Transactional Database, you have to record transactions at some point in time.
That means you get a table with time dimension in your OLTP system.
Consider for example a system that records Reservations.
Users exist and can reserve Things to use, for a day.

You probably get a structure such as this:

![](/uploads/2022/11/snowflake-01.png)

*In an OLTP database, a reservation is a `(resid, userid, thingid, date)`. It references the `user` data by `userid`, and the `thing` data by `thingid`.*

This assumes we have unique complete representations of a `user` and a `thing`, and we always want to reference the most current version of each of them.
It also assumes that the `reservation` is transient. Maybe we add additional fields, or pointers to other tables to track state changes:
A user can show up and get their thing, then work with it.
When they give it back, we record the fact, and make sure the thing is checked to be okay after use.

## Fixed sized OLTP systems

Finally, the transaction is closed, and in an OLTP system we are then well advised to forget about it.
To model that, we should add for example a state field that tracks this, and maybe fields to link to complaints or damages, if applicable.

That is, we want the OLTP system to be largely fixed in size, given unchanging outside parameters.
Or in other words, for the same number of things and users, we want the size of the OLTP system to be largely constant over time.

If we did not forget about Reservations after their completion, we would have a table with a time dimension, but with an incomplete data lifecycle management.
The `reservation` table would grow over time, without an upper bound, eventually becoming the largest object in our system.
Most of the transactions recorded would be in the past, done and dead.

This will make our customer facing system large, slow, hard to back up and hard to change.
Most people do not want that, but they also want records of transactions past.
So instead of deleting old `reservation` entries, they **Extract** them, and push them elsewhere.

This keeps the customer facing system nice and clean, and pushes data to another system, with different performance and availability requirements, and different data structures.

## Changing values

Most OLTP systems that make sales are well advised to keep current values of the data, if at all possible.
It is cheap and easy to ask for the price of a product in a table with exactly one entry per product, the current price:

```sql
-- CREATE TABLE product (
--   product_id SERIAL,
--   name VARCHAR(255),
--   price DECIMAL(12,4)
-- )
> SELECT price FROM product WHERE product_id = 17
```

If we recorded the price of a product together with a validity interval instead, then all queries become complicated to write,
and expensive to execute:

```sql
-- CREATE TABLE product (
--   product_id SERIAL,
--   name VARCHAR(255),
--   price DECIMAL(12,4),
--   valid_from DATE NULL,
--   valid_until DATE NULL,
--   INDEX (product_id, valid_until)
)
> SELECT price FROM product WHERE product_id = 17 AND valid_until IS NULL
```

So if that kind of design can be avoided for the business transactional part of the system, we should not model it.

That kind of query is almost always needed for the backend, analytical part of the system, but that is another place, and it should not part of the OLTP system.

## Separate systems

In an OLTP system, we have data in 3NF or something close to it.
We have a large number of queries, short running transactions and a lot of data changes.
We have a large number of concurrent users, making these changes.
We want to design the system so that the working set of it fits into memory
If we manage to do that, we do see almost no disk reads, and the number of disk reads is independent of the number of users, or the load of the systems.
We cannot avoid the writes, because that's what transactions are.

We design the system so that it contains only current data.
The size of the system is stable over time. 
There are no tables that grow over time, without an upper bound.
Instead, the system size is a function of the number of entities modelled in each of its entity-representation tables, and by the number of in-flight business transactions.

In an analytics systems, we have data in "fact" tables.
These are tables that have "time" as a component of the primary key, or are even partitioned by time.

We have few, long-running queries, that are often scans.
They aggregate over a fact table or parts of it.
We do not have many data changes.
The data changes we see are often imports, which append data to the fact tables.

# ETL - Extract, Transform, Load

Sometimes data imports are multistage, because the imported data is not in its final form and needs to be cleaned up.

Data gets from the OLTP system to the analytics system, undergoing a distinct three phased process.
The process is named after the phased, "ETL" -- extract, transform, load:

- The data is extracted from the OLTP system. It is in 3NF, and contains many id's representing functionally dependent values in their respective tables.
- The data is transformed, resolving the IDs into the functionally dependent value literals.
- The data is loaded into the analytics system. 
  Often this involves cleanup steps, bringing the data into the form it needs be for the analytics system.

## An ETL example

In [My Private Data Warehouse]({{< relref "/2020-09-26-my-private-data-warehouse.md" >}}) we have an example of such a process, using my bank account statements from a German Sparkasse.

Data arrives from a Sparkasse system in CSV format.
In a first step we load the data into a loader table, `transactions` table.
Data is then copied from the loader table into a cleanup table, `b`, and undergoes a number of changes as part of the cleanup process.
Afterwards it could be copied over into a fact table, extending an existing, ever-growing collection of account transactions.

This example is also showing data crossing administrative domain boundaries:
The Sparkasse is running my account, and it does so in whatever form they want or need.
They export data in a documented format, our software contract, but it is not the format I need.

The Extract process is downloading that data from the Sparkasse and shipping it to my system.

The Transform process has, in part already happened -- there are no IDs for me to resolve.

The Load is multistage, I load the data basically as text, and then apply a number of cleanup transformations to it.

## The Star and the Snowflake

In order to do actual analytics with it, I need to turn this into collectible, aggregate-able dimensions.
That is, I define categories such as `moneysinks` and map each remote account name to a category -- basically bins for the aggregation.
I am assigning each transaction to such a category, and then aggregate daily, weekly or monthly spend per category -- this is a report.

While the normal form of an OLTP database is the 3NF or something close to it, analytics databases are made up from fact tables.
Facts have a date as part of the primary key or are even partitioned by date.
For each `(id, date)` pair we record certain attribute values, and store them literally and denormalized.

"Around" each fact table we often have stored, pre-aggregated values, for example "daily spend by category", "daily spend by spender" and so on.
Each of these aggregations is called a dimension, and because they group themselves around the fact of which they are aggregates, we call this a Star.

The Star Schema is the simple normal form for analytics databases.
They are not in 3NF, because 3NF stores the *current* value of an attribute of an entity, and we reference the only copy of that by id.
Instead, we store the literal value of an attribute for a given date as a fact about the thing we are recording, so that we can observe how that value changes over time.

Sometimes, the literal values are rather long strings, and they are repeating quite often.
We then, as part of the data load, also perform a string compression with a lookup table.
In [Encoding fields for great profit]({{< relref "/2020-09-18-mysql-encoding-fields-for-great-profit.md" >}}) I am giving an example of how that works.

Sometimes we aggregate along more than one dimension.
If, for example, in our reservations fact table we would record the country of origin for each user, and the color of each thing, we could aggregate "daily reservations per country and color" to identify conceivable national color preferences.
Two-dimensional aggregates can be thought of as specializations of single dimensions, and the resulting pattern looks like a Snowflake, the other, slightly more complicated normal form for analytics databases.

# Summary

We try to keep our OLTP systems in 3NF.
We also try to keep only current data in them, and we expire business transactions that are no longer active from them.
This keeps them small and fast, allowing us to run from memory.

If we want to record a transactional history, we do that elsewhere, in an analytics system.
Data in analytics system is collected in tables with a time dimension in the primary key, the fact tables, and groups of aggregates around them, forming a Star or Snowflake.

Data flows from the OLTP system to the Analytics system in an ETL workflow.
This workflow collects data from the OLTP system (extract), resolves the IDs into the functionally dependent values, and retains the literal values of interest (transform).
That data is then loaded into the analytics system, cleaned up, categorized and pre-aggregated (load).
Old, retired transactions can then be removed from the OLTP system, keeping it lean and mean.

ETL processes can be batched, once per day, hour or even minute.
This is classic offline analytics with data warehouses.

Or they can be realtime, where a reader tails the log of the database and puts the data onto an event bus such as Kafka or SNS.
On the consuming side the data is still being processed, either classically, or with realtime aggregator that executes sliding window queries.
