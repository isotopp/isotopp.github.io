---
author: isotopp
title: "From Hadoop to HTAP?"
date: "2022-12-23T06:07:08Z"
feature-img: assets/img/background/mysql.jpg
tags:
- lang_en
- mysql
- mysqldev
- data warehouse
aliases:
  - /2022/12/23/from-hadoop-to-htap.md.html
---

For the last 15 years, one popular way to persist large amounts of data has been Hadoop, if you needed them persisted in such a way that you can still process them.

Of course, from a database point of view, brute forcing a result by scanning compressed CSV files in parallel, and then building giant distributed Hash Joins is not very elegant.
But two facts were true in 2006 influenced Hadoop's design, and which allowed it to process data at all at a scale where all other things failed:

1. Disk Seeks are expensive, so we cannot have indexes.
2. Network capacity is limited, so we cannot move the data to the code.

Using these two basic assumptions, Hadoop's core inventions were pioneered by Google, and then reproduced as Open Source by Yahoo!

Google published the [GFS Paper](https://research.google/pubs/pub51/) and the [Map Reduce Paper](https://research.google/pubs/pub62/) pretty much 20 years ago.

Doug Cutting started building the initial version of Hadoop in 2006, and it is basically like this:

> "Store data in optionally compressed CSV files in 128 MB strips on a bunch of JBOD disks, replicating all data 3 times.
> Then download small Java classes to the data store instead of moving the data to the processing nodes,
> and run the Map-Reduce Algorithm on these file fragments, merge sorting the result into an aggregate during the reduce phase."

This was slow:
Even a simple rowcount-Query would have at least a minute or two runtime, because of the setup times inherent to this solution.
Hadoop needed to distribute a jar with Java Classes, fire of a JVM on the datanodes, warm up the JVM for the JIT to get up to speed,
and then push the parts of the data present on the local node through this.
Eventually, the completed result set needed to be sorted, and then shipped over the network to the reducers, 
which would then merge-aggregate the data into a partitioned result set.

It was also hard to maintain and upgrade, because you had one large shared cluster with many stakeholders being dependent on it running and behaving in a certain way.

A lot of gradual improvements happened over the last 15 years, so today's Hadoop stores data in a more efficient way, has lower setup times, and can be managed better.
It still is a rather primitive brute-force processing system, and ripe for disruption.

And that is happening right now.

# Technology improved, challenging Hadoop's base assumptions  

That is, basically, because the initial assumptions on which it was built are no longer true.

## Network Capacity is not the bottleneck

Assumption 2, Network Capacity is limited, has not been true for at least 10 years.

Google had been playing with CLOS network architectures for a long time, and in [Jupiter Rising](https://research.google/pubs/pub43837/) described their bespoke switch architecture that allowed them to build data centers where the network by construction is never the bottleneck.

Specifically in the Hadoop world that is not exactly news:
Tail-drops from network congestion during the Shuffle-Phase between Hadoop's Map and Reduce were a common problem.

Terasort, a benchmark that sorts one Terabyte of generated data, was a popular way to test the network component of a Hadoop deployment:

- During the Map-phase all workers would sort their data, and because it was randomly generated, finish at approximately the same time.
- Because sorting does not aggregate data, the data blocks would then all lift off, at their full size, and transfer over the network to the Reducer nodes.
- If the network was oversubscribed or badly built, this would overwhelm the switches, exhaust buffers, 
engage [RED](https://en.wikipedia.org/wiki/Random_early_detection) and lead to packet loss.

![](2022/12/hadoop-01.png)

*"Profiling the network performance of data transfers in Hadoop Jobs", [Biligiri, Ali (2014)](https://www.slideshare.net/pramodbiligiri/shuffle-phase-as-the-bottleneck-in-hadoop-terasort), Network transfer rates over the lifetime of a terasort job.
The Shuffle phase reaches 700 MBit/s, which was the peak transfer rate measured during testing.*

AWS, which did not yet have Leaf-and-Spine in 2014, and which provisioned 1 GBit/s links between nodes at that time,
showed behavior as depicted above, when hosting a test cluster running Terasort.

Of course, CLOS-networks, specifically Leaf-and-Spine architectures, do not require bespoke custom hardware as Google deployed.
Brad Hedlund, then working for Dell,
[described Leaf-and-Spine architectures](https://bradhedlund.com/2012/01/25/construct-a-leaf-spine-design-with-40g-or-10g-an-observation-in-scaling-the-fabric/) 
built from Off-the-shelf Hardware for Hadoop already in 2012, and described that in a series of articles.

![](2022/12/hadoop-02.png)

*"Construct a Leaf Spine design with 40G or 10G? An observation in scaling the fabric", [Brad Hedlund (2012)](https://bradhedlund.com/2012/01/25/construct-a-leaf-spine-design-with-40g-or-10g-an-observation-in-scaling-the-fabric/).
On today's hardware this is of course done with different hardware and at higher speeds, for example some Juniper EX-hardware with 25G downlinks and 100G uplinks,
or even with 100/400 if needed (most people don't have that need).*

Network structures like this are oversubscription-free, when built properly.
They are useful out of Hadoop contexts as well.
For example, when running a private cloud with distributed storage, every disk access is potentially a network read or write,
and again a structure where any CPU in any machine can talk to any disk in any other machine without network congestion is useful.

![](2022/12/hadoop-03.png)

*[Warum eigentlich Cloud (2015, german language, 5. Open Source Workshop of German Rail, Frankfurt)](https://www.slideshare.net/isotopp/warum-eigentlich-cloud), Kristian Köhntopp.
The slide shows traffic inside an Openstack cluster with distributed storage.
East-West-Traffic between racks dominates, and the aggregated upstream bandwidth from the computes to the Top-of-Rack 
switches must be matched by adequate spine network bandwidth.* 

**In Summary:**
People who needed the network to never be the bottleneck could have built networks that delivered this for the last 10 years. 
And most did, even using off-the-shelf parts.
It is possible, and even economical, to build a network where any CPU in any machine can talk to any disk in any other machine within the same data center.

Google themselves basically demonstrated this when starting around 2014 or so they offered virtualized, flexible Hadoop as a service.
While that was a welcome simplification, nobody stopped and asked how they were doing this:
Supposedly the network is the bottleneck, so the virtual machine would be subject to hard placement constraints, because it needed to be created wherever the data is.
For a service that would be a harsh constraint, affecting service quality, yet the service ran just fine.

So how were they pulling it off?
CLOS networking, of course, as documented in the whitepapers they published, but that meant that one of the two Hadoop/Map-Reduce funding assumptions was no longer valid.

## Seeks are not the bottleneck

Another thing that started to change around 2012 was the rise of flash storage in computers.
Initially, these things were small, so we would see them in write-heavy database servers first:
These machines already were expensive, and at the core of the data center, so cost was less of an issue.

Over time, flash prices dropped, and drives became larger.

Also, SATA interface were becoming a bottleneck.
They were replaced by a system that put flash directly on the PCIe bus of the machine.
This interface, called [NVME](https://en.wikipedia.org/wiki/NVMe) became popular and available in standard data center machines around 5 years ago, in 2017.

And since 2020 we have NVME over Fabric using TCP as part of the default Linux kernel, so remotely attached NVME (with and without RDMA) is a thing and useful.
Check out [lightbits](https://www.lightbitslabs.com/), they have awesome products when it comes to low-latency remote storage.

Because it no longer forces serialization of requests, but basically allows parallel access to all the flash chips of the drive, it allows to build systems with massively parallel access.
A single access still has a latency of around 1/20,000s, but a typical single drive is capable of delivering 800k to 1M IO operations per second,
if the application(s) can manage to talk to the drive 50-way parallel at all times.
And why stop at one drive, when you can have over a dozen per machine, if you have the PCI bandwidth for that?

In practice that means that seeks are now basically free, and data access structures and file-systems that allow massively parallel access have a huge advantage.

![](2022/12/hadoop-04.png)

*"[Operation Unthinkable - Software Defined Storage @ Booking.com](https://www.slideshare.net/Storage-Forum/operation-unthinkable-software-defined-storage-bookingcom-peter-buschman)", Peter Buschman (2019). An AMD EPYC based single-socket machine with plenty of RAM and NVMRAM, 100 GBit/s NIC and up to 24 U.2 NVME drives from different, independently sourced vendors, using less than 500W, in 2U, running one out of 10 different storage server products optimized and certified for this platform. "There is one in every other rack!" -- Peter Buschman revolutionized storage at Booking.com with this design.*

# Now what?

Since the base assumptions that made Hadoop successful are now invalid, and have been for the last 5 years, we should see Hadoop being replaced.

And we do:
Hadoop is no longer a thing for investors, and companies offering Hadoop are either merging or going down.

## HTAP rises

Other offers are on the rise, under the collective label of [HTAP](https://en.wikipedia.org/wiki/Hybrid_transactional/analytical_processing), 
Hybrid transactional/analytical processing.
The promise is to have one single distributed database system not unlike [Spanner](https://en.wikipedia.org/wiki/Spanner_(database))
that is capable of utilizing the capacity of many systems in one single database/schema for OLTP,
and that is also capable of running analytical/BI queries in the same system (or even using the same tables).

Promising representatives of HTAP databases are

- [TiDB from Pingcap](https://www.vldb.org/pvldb/vol13/p3072-huang.pdf)
- [CockroachDB](https://www.infoq.com/news/2014/08/CockroachDB/)
- and -- with limitations - [Heatwave](https://www.oracle.com/mysql/heatwave/).

(Unlike TiDB and CockroachDB, Heatwave is not a true distributed database, but a distributed in-memory accelerator to a single-node MySQL OLTP frontend machine that transparently offloads analytics queries)

## No cool-aid for me?

In general, these systems are welcome, useful and innovative, because they allow database schemas to grow and spread to a cluster of machines, even for OLTP queries.
Personally, I remain sceptical with regards to the integrated, copy-less processing of analytics queries.

In our DWH/BI-Series in this blog (and especially in 
[Tying the BI pipeline together]({{< relref "2022-12-22-tying-the-bi-pipeline-together.md" >}})) 
I have tried to explain why I believe the *Transformation* in ETL is a fundamental step that transforms from OLTP "normal form" (mostly 3NF) to BI "normal form" (the star and snowflake forms).

Nobody likes 3NF -- it complicates many things that should be simple, but we must use it in OLTP because data is being modified by transactions.
Without it, we suffer from all kinds of anomalies, and [normalization]({{< relref "2005-09-11-nermalisation.md" >}}) prevents these.

DWH tables are different, because they are records of the past:
They do not change (after all stragglers have been loaded), and because they are immutable, they cannot have anomalies.
On the other hand, we want multiple copies of the same fact at different dates (maybe compressed with lookup tables or other compression methods), so that we can follow the changes of attribute values over time easily.

Running OLTP-like joins over 3NF data with history is a nuisance.
It is not only painfully complicated to write, but also hard to optimize.
But if the data is immutable anyway, we can bring it into a form optimized for the kind of temporal reporting query we want to run on it, and not care about anomalies.

## Size and Conway's Law

Also, keeping OLTP systems as small as possible has a lot of value in its own:
- We can make casual changes to a 200 GB sized database.
- A data size of 2 TB has hours of change/setup time.
- A data size of 20 TB has one attempt in a workday.
- And a system with 120 TB of data is "one attempt per week" in terms of change.

This is not entirely true for distributed systems, where parallel access can speed things up, but generally smaller and less complex systems are also easier and faster to operate.

We do know that a CDC-pipeline or applications set up to generate business level events can provide BI-pipelines at a near-live speed,
with less than 15s processing time end-to-end.
This is close enough to "live", which is the promise of HTAP.

Building systems around such pipelines segregates OLTP from BI, physically and putting them into different administrative domains, yet they still can provide near-live updates.
While it may look more complex at first, it may map a lot better onto the realities of Conway's Law, and yield smaller, more flexible, and less tightly coupled components.

On the other hand, I do like the technology in TiDB and CockroachDB, but that is mostly because the environment I work in suffers from transactional systems and schemas that happen to be larger than a single machine.

I fully expect these systems to still have need to the 3NF-to-Snowflake transformation that is a characteristic of ETL, and I am not yet ready to buy into the Gartner HTAP hype,
unless somebody can show me how this is better handled inside Cockroach or TiDB.
