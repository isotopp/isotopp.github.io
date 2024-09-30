---
author: isotopp
date: "2022-02-16T14:35:00Z"
feature-img: assets/img/background/mysql.jpg 
tags:
- mysql
- mysqldev
- lang_en
title: "Databases: How large is too large?"
---

A database is a special kind of structured, persistent, global variable with concurrent access over the network.

You write data to a cell of a row of a table in a schema in the server, and it is being kept around for you, with a lifetime longer than the runtime of your program.
The database takes care of making sure of ordering access to that data, so there is a clearly defined series of changes to the data – locking, transactions, isolation are things that make databases popular.

And so one gets to have a lot of database schemas in server instances, and they grow.
Sometimes that becomes a problem.

# Databases don't scale, even when they scale

These days, the MySQL server can easily utilize the resources even of very large servers.
At work, we have taken instances easily up to 400.000 queries per second on AMD EPYC servers with 64 cores and one terabyte of memory, without special tuning.
With careful tuning, more than a million QPS is achievable.
MySQL scales extremely well these days.

For a long time, MySQL also has been a very low latency/high connection database:
since it uses a multithreading approach with a pre-generated thread pool, it can handle up to around 10k connections comfortably, and three times more at cost.
It can handle disconnect and reconnect situations in a way that is more reminiscent of an LDAP server than a database.

And it can answer single point primary key lookups from memory – the workload a `memcached` handles – at `memcached` speeds:
We see query resolution times including SQL parsing that are as low as 0.12ms (120µs).

# What doesn't scale: _server creation time_

MySQL replication hierarchies are designed as shared-nothing architectures.
Creating a new server means you have to copy the data for the server into place, and then let replication catch up.

There are storage trickeries that can be played, but they have long term consequences that need mitigation.
They also tie their user to very costly and very specific storage architectures and that is not a thing anybody can afford to have as a technical debt item on their sheet.

# A Relativity Theory of databases: For data, space is time.

When we create new databases, we copy the data over.
In the end, the network is very fast: 
At 10  Gbit/s, we are looking at a stream of 1.25 GB/s coming in that we need to be able to persist at the receiving end, and that we need to provide at the sending end.

Looking at storage, we can see that in all but one situation, the bottleneck is not the network:

- A conventional HDD with rotating rust can serve reliably around 200 MB/s in a linear read or write ([Toshiba HDD specs](https://toshiba.semicon-storage.com/ap-en/storage/product/data-center-enterprise/cloud-scale-capacity/articles/mg07acaxxx.html) provide some reference).
- A SSD usually gives us twice this, so we see streams of around 400-500 MB/s ([Micron SSD specs](https://www.micron.com/-/media/client/global/documents/products/product-flyer/5300_product_brief.pdf?la=en) provide some reference).
- Openstack instances are quota'ed, and often get something like 400 MB/s quota again, which nicely matches expectations of SSD users.
- A NVME flash device can provide on the upside of 3000 MB/s (3 GB/s) sustained data rate when enterprise grade hardware is purchased ([Micron NVME specs](http://brochure.stebis.nl/Micron9300.pdf) provide some reference).
  This is the one single case where a 10 GBit/s network interface actually is becoming a bottleneck, but of course more network is available if you have the coin.

How long does it take to copy one Terabyte of data, assuming linear streaming access?

- At 200 MB/s, we get 12000 MB/min = ~12 GB/min, or around 85.3 minutes for 1024 GB.
- At 400 MB/s, that is twice the speed or half the time, 42.6 minutes.

Add time for replication to catch up, and round up to a nice round number for rule of thumb estimates:

> At 400 MB/s, copying one Terabyte of data takes 45 minutes to copy and 15 minutes for replication catchup, for a total of **one hour per Terabyte of data size**.

# Size constraints for databases

In database land, we copy databases all the time:

- To make backups.
- To make more replicas in order to scale a pool up.
- To replace replicas that have left the pool to go into maintenance.
- To create special purpose replicas that may or may not be useful after having served their special purpose.

Each replica we make needs a donor instance, and often a donor instance can donate only to one receiver at a single point in time.

All taken together means that asking for more replicas is not instantaneous.
You will have to wait one hour per TB of data size, and longer if there is need to clone up some donors to be able to parallelize cloning.

Here are some good numbers:

- Typical HPE or Dell blades at work have a single or two internal drives of 1.92 TB ("two TB") each.
  If the instances make full use of them, preparing a blade takes slightly under 2h or 4h.
- In a single workday of 8h, you can probably expect one attempt per day to do "a thing"  to a database of ~10 TB size.

From this we get a few very strong recommendations:

- **200-250 GB** databases can be replicated in intervals that fit into K8s readiness probes.
  That is why Vitess and also many Postgres based clustering products recommend small instance sizes of 250 GB or less.
- **2-4 TB** data size give you "several attempts at maintenance per day", and also fit standard blade on premises or i3.2xl and i3.4xl instances in EC2.
  They are probably the upper end of supportable database size in terms of wait times due to data copies.
- **10 TB** data size is where toil explodes, because they are in the "a single attempt per day" class. 
  If you have databases that are larger than this, you need to have a long and hard look at your life and architecture choices, and the implications of them.

# Reactive autoscaling is not a thing

It also means that reactive autoscaling of database instances does not work at all:
By the time you have scaled up, the demand is already handled by existing capacity or you have died.

You will need ongoing capacity testing and predictive autoscaling that gives you some headroom  for the unexpected.

Using spot instances is also very likely to make you very unhappy or very offline or both.

# TL;DR

There is a soft 2 TB boundary and a hard 10 TB boundary.
They are defined by physics, so they are not negotiable and cannot be removed by throwing money at it.

When you reach these sizes, talk to your DBA about alternatives.
Treat the 2TB boundary as a complexity inflection point, and use the remaining time as runway to branch out into alternative solutions.
