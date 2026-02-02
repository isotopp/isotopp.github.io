---
author: isotopp
title: "MySQL: Data for Testing"
date: "2022-09-26T12:13:14Z"
feature-img: assets/img/background/mysql.jpg
tags:
  - lang_en
  - mysql
  - mysqldev
aliases:
  - /2022/09/26/mysql-data-for-testing.html
---

Where I work, there is an ongoing discussion about test data generation.
At the moment we do not replace or change any production data for use in the test environments, and we don't generate test data.

That is safe and legal, because production data is tokenized.
That is, PII and PCI data is being replaced by placeholder tokens which can be used by applications to access the actual protected data through specially protected access services.
Only a very limited circle of people is dealing with data in behind the protected services.

Using production data in test databases is also fast, because we copy data in parallel, at line speed, or we make redirect-on-write ("copy-on-write" in the age of SSD) writeable snapshots available.

Assume for a moment we want to change that and

- mask data from production when we copy it to test databases
- reduce the amount of data used in test databases, while maintaining referential integrity
- generate test data sets of any size instead of using production data, keeping referential integrity and also some baseline statistical properties

# Masking Data

Assume we make a copy of a production database into a test setup.
We then prepare that copy by changing every data item we want to mask, for example by replacing it with `sha("secret" + original value)`, or some other replacement token.

```sql
kris@localhost [kris]> select sha(concat("secret", "Kristian Köhntopp"));
+---------------------------------------------+
| sha(concat("secret", "Kristian Köhntopp"))  |
+---------------------------------------------+
| 9697c8770a3def7475069f3be8b6f2a8e4c7ebf4    |
+---------------------------------------------+
1 row in set (0.00 sec)
```

Why are we using a hash function or some moral equivalent for this? 
We want to keep referential integrity, of course. 
So each occurence of `Kristian Köhntopp` will be replaced by `9697c8770a3def7475069f3be8b6f2a8e4c7ebf4`, a predictable and stable value, instead of a random number `17` on the first occurence, and another random number, `25342`, on the next.

In terms of database work, it means that after copying the data, we are running an `update` on every row, creating a binlog entry for each change.
If the column we change is indexed, the indexes that contain the column need to be updated.
If the column we change is a primary key, the physical location of the record in the table also changes, because InnoDB clusters data on primary key.

In short, while copying data is fast, masking data has a much, much higher cost and can nowhere run at line speed, on any hardware.

# Reducing the amount of data

Early in the company history, around 15 years ago, a colleague worked on creating smaller test databases by selecting a subset of production data, while keeping referential integrity intact.
He failed.

Many others tried later, we have had projects trying this around every 3 to 5 years. 
They also failed.

Each attempt always selects either an empty database or all of the data from production.

Why is that?

Let's try a simple model: 
We have users, we have hotels, and they are in a n:m relationship, the stay.

![](2022/09/test-data-01.jpg)

"Kris" stays in a Hotel, the "Casa".
We select Kris into the test data set from production, and also the "Casa".
Other people stayed at the Casa, so they also are imported into the test set, but they also stayed at other hotels, so these hotels are also imported, and so forth, back between two tables.
After 3 reflections, 6 transitions, we have selected the entire production database into the test set.

Our production data is interconnected, and retaining referential integrity of the production data will mean that selecting one will ultimately select all.

Limiting the timeframe can help:
we select only data from the past week or something.
But that has other implications, for example on the data distribution. 
Also, our production data is heavily skewed in time when it comes to operations on availability – a lot of bookings happen in the last week.

# Generating test data

Generating garbage data is fast, but still slower than making a copy.
That is because copying data from a production machine can copy binary files with prebuilt existing indexes, whereas generating garbage data is equivalent to importing a `mysqldump`.
The data needs to be parsed, and worse, all indexes need to be built.

While we can copy data at hundreds of MB per second, up into the GB/s range, importing data happens at single digit MB/s up to low tens of MB/s.
A lot depends on the availability of RAM, and on the speed of the disk, also on the number of indexes and if the input data is sorted by primary key.

Generating non-garbage data is also hard, and slow.

You need to have the list of referential integrity constraints either defined or inferred from a schema.
At work, our schema is large, much larger than a single database or service – users in the user service (test user service, with test user data) need to be referenced in the reservations service (test reservations service with test bookings), referring to hotels in the test availability and test hotel store.

That means either creating and maintaining a consistent second universe, or creating this, across services, from scratch, for each test.
One is a drag on productivity (maintaining consistent universes is a lot of work), the other is slow.

Consistency is not the only requirement, though.
Consistency is fine if you want to test validation code (but my test names are not utf8, they are from the hex digit subset of ASCII!).

But if you want to talk performance, additional requirements appear:

- **Data size**.

  If your production data is 2 TB in size, but your test set is 200 GB, it is not linearly 10x faster. 
  The relationship is non-linear: On a given piece of hardware, production data may be IO-limited because the working set does not fit into memory, whereas the test data can fit WSS into memory. 
  Production data will produce disk reads proportionally to the load, test data will run from memory and after warmup has no read I/O – a completely different performance model applies. 
  Performance tests on the test data have zero predictive value for production performance.
- **Data Distribution.**

  Production data and production data access is subject to data access patterns that are largely unknown and undocumented, and are also changing. 
  Some users are whales that travel 100x more than norms. 
  Other users are frequent travellers, and travel 10x more than norms. 
  Some amount of users are one-offs and appear only once in the data set. 
  What is the relation between these sets, and what is the effect they have on data access? 

For example:

## A database benchmark I lost

The german computer magazine c't in 2006 had an application benchmark described in web request accesses to a DVD rental store. 
The contestants were supposed to write a DVD rental store using any technology they wished, defined in the required output and the URL request they would be exposed to in testing. 
MySQL, for which I worked as a consultant, wanted to participate, and for that I put the templates provided into a web shop using MySQL, and tuned shop and database accordingly.

I got nowhere the top 10.

That is because I used a real web shop with real assumptions about user behavior, including caches and stuff.

The test data used was generated, and the requests were equally distributed: 
Each DVD in the simulated DVD store was equally likely to be rented and each user rented the same amount of DVDs. 
Any cache you put into the store would overflow, and go into threshing, or would have to have sufficient memory to keep the entire store in cache.

Real DVD rental stores have a top 100 of popular titles, and a long tail. Caching helps. 
In the test, caching destroyed performance.

## Another database benchmark I lost

Another german computer magazine had another database benchmark, which basically hammered the system under test with a very high load. 
Unfortunately, here the load was not evenly distributed, but a few keys were being exercised very often, whereas a lot of keys were never requested. 
Effectively the load generator has a large number of threads, and each thread was exercising "their" key in the database -- thread 1 to id 1 in the table, and so on.

This exercised a certain number of hot keys, and waited very fast on a few locks, but did not actually simulate accurately any throughput limits. 
If you exercised the system with more production-like load, it would have had around 100x more total throughput.

# TL;DR

Producing masked or simulated data for testing is around 100x more expensive computationally than copying production data. 
If production data is already tokenized, the win is also questionable, compared to the effort spent.

Producing valid test data is computationally expensive, especially in a microservices architecture in which referential integrity is to be maintained across service boundaries.

Valid test data is not necessarily useful in testing, especially when it comes to performance testing.
Performance testing is specifically also dependent on data access patterns, working set sizes and arrival rate distributions that affect locking times.

In the end, the actual test environment is always production, and in my personal professional experience there is a lot more value in making testing in production safe than in producing accurate testing environments.
