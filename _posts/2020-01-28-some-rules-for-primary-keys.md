---
layout: post
title:  'Some rules for primary keys'
author-id: isotopp
feature-img: assets/img/background/mysql.jpg
date: 2020-01-28 19:26:35 +0100
tags:
- lang_en
- mysql
- schemas
- primary key
- data lifecycle management
---
On Twitter, [@CaptainEyesight](https://twitter.com/CaptainEyesight/status/1221889419654787073) asked a question:

[![](/uploads/2020/01/pk-question.png)](https://twitter.com/CaptainEyesight/status/1221889419654787073)

»Database architecture question: For deleting records, instead of a DELETE, UPDATE the id to the negative (i.e. 1 becomes -1) and then add `AND id > 0` to every query. Great idea? or Greatest idea?«

I was honestly a bit confused, because this idea is so weird that I took this question for a joke. But then I decided that this is a case for [XKCD 1053](https://xkcd.com/1053/): »You are one of today's lucky 10.000.« So let's do this properly.

## Physical InnoDB data structure

In InnoDB, data is stored as a B+-Tree indexed by the primary key. A B+-Tree is a B-Tree in which the leaf pages contain the actual data records. That means that data is (within limits) stored physically, on disk, in primary key order. A record with a lower primary key value will be "further left" in the B+-Tree than a record with a higher primary key value, and within limits will also be on a disk block with a lower or equal number than blocks with higher primary key values.

![](/uploads/2020/01/pk-innodb-order.png)

InnoDB structure as a tree index blocks pointing to other index blocks, and the leaf nodes containing the actual data.

The limitation is here that InnoDB allocates data in chunks (of 64 pages of 16 KB by default, for segments of 1 MB), and filesystems of course do not really guarantee "low to high disk space allocation". Another, weaker and slightly better way to describe the physical ordering would be that two primary key values with a small value difference are more likely to be phsically closer on the storage medium, but it is still a kind of best effort estimate.

In any case in InnoDB, the physical record position is a function of the primary key. Changing a PK the way described will physically move the record from "right" in the B+ tree to the left, inducing a lot of rebalancing operations, page splits and merges. Ultimately actually deleting always from the left and appending always on the right is producing the worst physical page structure InnoDB could have: Permanent page merges on the left, permanent page splits at the right and a permanent maximal rebalancing of the entire tree.

This is an abysmally slow data structure. I wrote about it in german language in [Ein paar Gedanken zu Zeitreihendaten](http://blog.koehntopp.info/2009/10/28/ein-paar-gedanken-zu-zeitreihendaten.html) in 2009, where I have been discussing the way Nagios NDO Schema abuses the database on the Open Source Monitoring Conference in Nürnberg.

## Foreign Key complications

There is another problem layered on top of the physical data structure problem, and that is that primary keys of one table `t` may be used in other tables `r` and `s` as pointers to records in `t`. Such usage is called a foreign key. If you change primary keys, all foreign keys will become invalid and will point at the wrong or non-existent recoords. 

There is a way around that, manually or automatically change the foreign keys. 

If you want the change to happen automatically, you can do that with foreign key contstraints, and `ON UPDATE CASCADE` and `ON DELETE CASCADE` clauses. The problem that people will run into in practice is that such clauses make it very hard to estimate the performance of a statement by just looking at the SQL. Chaning a primary key value will cause an update of all dependent foreign key rows, and the actual number of these rows is unknown, may be variable and that makes the runtime of the statement data-dependent and completely unpredictable.

Consider a table of hotels with a hotel_id as a primary key. Consider a second table of hotel_reviews, with a review_id as a primary key, and a foreign key hotel_id pointing back at the hotel being reviewed. Now assume a hotel closes and we renumber it from 4711 to -4711. We will have to change all reviews of that hotel in the hotel_review table, so any number of reviews will have their hotel_id changed from 4711 to -4711, too. That can be none, or few, if the hotel was not very popular, or it can be literally 10.000s of records. It will create problems in production. I know that because I was around when exactly this happened.

## Some Axioms about Primary Keys

As a general rule, the following things are in my experience good rules:

- **Never change a primary key value.** Primary key values should be considered immutable.
- **Never reuse a primary key value.** Primary key values used in foreign keys tend to stick around, even outside of the database, in bookmarks, notes, file dumps and other data sources that you do not track, control or index. If you re-use a primary key value, these URLs, notes, or other pointers will now point to different, entirely random data instead of producing a lookup error. Don't do that to yourself.
- **Never encode additional information in a primary key value.** Primary key values encode the identity of a row. Nothing else. Flags such as `is_deleted`, `is_made_to_order` or other special things are not ranges, signs or other special properies of the actual primary key. They should be extra columns, made explicit, documented, and be indexable on their own. Everything else is broken.

I once had to work with a database that contained orderable part numbers for camper trailers, and if the part number started with an '8' or an 'e', that part was made to measure and not generally available in stock - things like window blinds or seat cushions. That's extremely broken, and there should have been a `made_to_measure` flag and another `in_stock` flag.

## Poisoning transactional data with crud

In Openstack in 2015, about any of the Keystone, Neutron, Nova and other databases did not delete things, but each row had an `is_deleted` flag. Every query is the actual query plus an `AND is_deleted = 0`. This makes queries more complicated, confuses the optimizer and every developer and, even worse, requires an expiration cron job, which by default was not delivered, much less installed.

`is_deleted` flags are usually not very selective. In the beginning, there will be very few deleted records, and over time they will dominate the data, so that most records will actually be deleted. Most optimizers have problems handling biased key distributions properly, and indexes on low cardinality columns are another problem entirely.

In any case, there will likely be dead records on each page loaded into memory, poisoning your expensive caches with dead data. This is not a good use of your money or hardware budget. The recommendation is to keep only live data in transactional tables. Actually delete completed transactions from your transactional tables. Keep your transactional system small. A transactional system ideally never reads data, because it can keep the pages of the working set of your current transactions in memory. Only writes happen, to persist the actual transactions.

You will need a log of changes, for compliance reasons, for business intelligence (BI) reasons and for reporting as well as many other use cases. You can implement an Extract-Transform-Load (ETL) process into a data warehouse, with the usual DW transaction from online transaction processing normalized schemas into data warehousey star and snowflake schemas. That is, in the DW you will not store ids, but actual data values, because you are not interested where customer_id 17 lives now in 2020, but that the item "USB Memory Stick 128 GB" was actually priced "24.99 EUR" when you delivered it to a customer in 24110, Germany in August 2013. So part of the ETL process is to join all the things, keep the values you want to archive and then archive them into a giant fact table (and maybe recompressing the values back to DW ids in sideways lookup tables for space reasons). Then you create daily aggregate along the dimensions of reporting, creating a star or snowflake from the fact table timeline.

![](/uploads/2020/01/pk-innodb-order-2.png)

Deleting from a monster fact table where primary keys corrospond to temporal data is just as bad. Use partitions instead, and drop expired days.

Ideally, the fact table is partitioned, so that you to not shuffle through the B+-Tree again for deletion. Instead, you `ALTER TABLE ... DROP PARTITION` instead, which is much, much, much faster.

Another way to get changed recorded is instead Change Data Capture (CDC), which you configure a server as a database master writing full row based replication binlog, in which each DML statement will log the full before- and after-image of each changed row. A binlog eater processes this data to produce an ongoing live update of the DW. You will still have to take each logged row, extract the IDs and join them to get the data values of all the other tables you need to log for the ETL process. That can create race conditions, so you may instead opt for changing the application, which would then write twice, once into your OLTP system and once into the DW in denormalized star form.

## Coexistence is impossible

Transactional and reporting queries do not coexist nicely on the same hardware at scale. It is useful to keep transaction processing systems and reporting/BI systems physically separated.

An OLTP system is ideally memory saturated - the working set fits into memory, if you can make that happen. Transactions are short lived, query latency matters. The system is write-heavy by definition - it's sole purpose in life is to record state changes on disk in order to model real-world state changes such as orders, order fullfillment and billing. The schema is likely normalized and close to 3rd normal form in order to make update volume manageable. Uptime matters, so having a small data set size will help meeting availability requirements: One that business is interested in is a short MTTR, and MTTR is often a function of data set size.

Data Warehouse and BI systems are unlikely to be memory saturated. It is their nature that they grow without bounds unless you actually complete the data lifecycle management by actually dropping data. Transactions are read-mostly, deletes are rare (and implemented as partition drops) and writes are ideally append-only. Queries are long-lived, full table scans, indexes may be of limited use. Hash joins may be more useful than loop joins. The schema is likely 'normalized', but the DW normal form is a loglike fact table and star or snowflake structures around it. Uptime may matter, but the requirements are often much more relaxed compared to what is requested from the OLTP side of the business. That is good, because DW data set size can be something else.

## Every OLTP system contains a data warehouse that struggles to get out

It is perfectly normal (and okay for some time) for a new OLTP system to contain a DW on the inside that eventually needs to be extracted and put onto its own machinery. When you create a new OLTP system, you objective is to get it up and running. You need to earn money after all.

Still, there will be tables in your system that contain a data in the table name, the partition clause or the primary key. These are tables that grow without bounds given an otherwise constant and unchanging transactional volume. Eventually you will need to come around and complete the data lifecycle management process that you skimped on in order to get things running.

That is, you will need to define what kind of attributes you want to extract for reporting in your ETL or CDC process, define such a ETL or CDC process, define a DW/BI structure and the reports and ad-hoc query opportunities you want to support.

This will sustain you for a long time, but eventually even the DW/BI you have will outgrow your means and you need to close the loop completely in order to cap growth. Also, compliance rules will force you to actually delete data after some time.

TL;DR: You think about changing primary keys when you should think about data lifecycle management. That is not a good business or data modelling strategy.