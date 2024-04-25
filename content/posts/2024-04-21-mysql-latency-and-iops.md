---
author: isotopp
title: "MySQL: Latency and IOPS"
date: "2024-04-21T05:06:07Z"
feature-img: assets/img/background/mysql.jpg
toc: true
tags:
- lang_en
- database
- mysql
- mysqldev
---

When talking about storage performance, we often her three terms that are important in describing storage performance.
They are

- bandwidth
- latency
- I/O operations per second (IOPS)

When you talk to storage vendors and cloud providers, 
they will gladly provide you with numbers on bandwidth and IOPS,
but latency numbers will be hard to come by.
To evaluate storage, especially for MySQL, you need just one number, 
and that is the 99.5 percentile commit latency for a random 16 KB disk write.
But let's start at the beginning.

# Bandwidth

The bandwidth of an IO subsystem is the amount of data it can read or write per second.
For good benchmarking numbers, this is usually measured while doing large sequential writes.
A benchmark would, for example, write and read megabyte sized blocks sequentially to a benchmark files,
and then later read them back.

Many disk subsystems have caches, and caches have capacities.
The benchmark will exercise the cache and measure cache speed, 
unless you manage to disable the caches.
Or deplete them, by creating a system workload large enough to exceed the cache limit.
For example, on a server with 128 GB of memory, 
your benchmark will either have to disable these caches,
or benchmark with a file of 384 GB or larger to actually measure storage system performance.

Writes can be forced to disk, at the filesystem level, by using the means of `fdatasync()`, `O_DIRECT` or `O_SYNC`,
depending on what you want to measure and what your operating system and drivers provide.
But if the storage itself provides caches, it may be that these are persistent (such as battery backed memory),
and while that counts as persistent, it may not be the storage performance we want to measure.
It could be that this is what we get until the cache is full,
and then we get different numbers from the next tier of storage.
Depending on what we need for our evaluation,
we might need to deplete or disable this cache layer to get numbers from the tier we care about.

Strangely, read benchmarking is harder – we often can easily bypass writes caches by asking for write-though behavior.
But if data is in memory, our read request will never reach the actual storage under test. 
Instead it will be served by some higher, faster tier of the storage subsystem.
That's good in normal operations, but bad if we want to find out worst-case performance guarantees.

From an uncached enterprise harddisk you would expect on the upside of 200 MB/sec streaming write bandwidth,
from an uncached enterprise flash twice that, around 400 MB/sec written.
For short time or from specialized storage you can get up to 10x that, but sustained it is often disappointingly low.

By bundling storage in a striped RAID-0 variant, you can get a lot more.
By providing an abundance of battery-backed memory,
you can get speeds that saturate your local bus speed or whatever network is in the path.

# Latency

Write and read latency is the amount of time it takes to write a piece of data.
For a database application developer, 
write latency usually amounts to "how long to I have to wait for a reasonably sized COMMIT to return".

To better understand database write latency, we need to understand database writes.
The long version of that is in explained in
[MySQL Transactions - the physical side]({{< relref "/2020-07-27-mysql-transactions.md" >}}).

The short version is that MySQL prepares a transaction in memory in the log buffer,
and on commit writes the log buffer to the redo log.
This is a sequentially structured, on-disk ring buffer that accepts the write.
A commit will return once data is in there (plus replication shenanigans, if applicable).
For a fast database, it is mandatory for the redo log to be on fast, persistent storage.
Writes to the database happen in relatively tiny blocks, much smaller than actual database pages.

Later, out of the critical path, the database writes out the actual modified data pages as 16 KB random writes.
This is important,
but it happens a long time after the commit in a batched fashion, often minutes after the actual commit.

Still, a filesystem benchmark that uses randomly written 16 KB pages
usually characterizes the behavior of a storage subsystem in a way
that good predictions of its real world performance can be made.
So run a `fio` benchmark that writes single-threadedly to a very large test file,
doing random-writes with a 16 KB block size, 
and look for the `clat` numbers and the latency histogram in the benchmark.

It might look like this:

```console
...
  write: IOPS=2454, BW=38.4MiB/s (40.2MB/s)(11.2GiB/300001msec)
...
    clat percentiles (usec):
     |  1.00th=[  202],  5.00th=[  237], 10.00th=[  249], 20.00th=[  269],
     | 30.00th=[  285], 40.00th=[  302], 50.00th=[  314], 60.00th=[  330],
     | 70.00th=[  347], 80.00th=[  396], 90.00th=[  482], 95.00th=[  570],
     | 99.00th=[ 2212], 99.50th=[ 2966], 99.90th=[ 6915], 99.95th=[ 7832],
     | 99.99th=[ 9503]
...
```

Be sure to check the units, here `usec` (µs, microseconds, 1E-06 sec).
`fio` changes them around as needed.
Then look at the numbers in the clat histogram.

You will see relatively linear numbers, here up to the 95th percentile,
and then a sudden and steep increase.
Most storages are bimodal, and you will see "good" behavior and numbers in the low percentiles,
and then numbers from the "bad" writes above.
It is important to treat both numbers as differently and remember the cutoff percentile as well.
This storage has a clat of about 0.57 ms, until the 95th percentile, 
and then 2.0 ms or more for about 5% of all writes.
That's not good, but these numbers are from a specific multithreaded test, not single-threaded writing,
and I just included them to show what they would look like.

For reference, a local NVME disk should give you <100 µs for the good writes,  
and present a cutoff at the 99.90th percentile
([data from 2019]({{< relref "/2019-06-13-adventures-in-storageland.md#some-nvme" >}})).

A good disk-based NetApp filer connected with FC/AL, as sold in 2012,
would present itself at ~500 µs write latency,
and with a very high cutoff at the 99.5th or 99.9th percentile
You would be mostly talking to the battery backed storage in that unit,
so even with hard disks in it, it would be decent enough to run a busy database on it.
If your storage is worse, latency-wise, than this 12-year-old piece of hardware,
you will probably not be happy with it under load for database workloads.

# IOPS

"I/O Operations Per Second" sounds a lot like latency, but is not.
It is the total I/O budget of your storage.
For old enterprise harddisks with a 5 ms seek time, you get around 200 IOPS from a single hard-disk.
With a disk array, a multiple of that – more if you have more spindles.
That is why in the old times before flash, 
DBAs strongly preferred arrays from many tiny disks over arrays from few large disks. 
That is also why disk-based database write-performance is completely dependent on the presence of battery backed storage.

With modern flash and NVME, paths to the actual storage in the flash chips are parallel.
This is one of the big advantages of NVME over SSD or SATA, in fact.
A single enterprise NVME flash drive can provide you with up to 800.000 IOPS.

But that is not a latency number.
A single commit will still take around 1/20.000 sec, around 50µs.
So if you execute single row insert/commit pairs in a loop, you will not see more than 20.000 commit/s, 
even if the single NVME drive can do 40x that.
To leverage the full potential of the drive, you will need to access it 40-way parallel.
Most databases cannot do that.

That is, because the workload itself that a database executes is inherently dependent on the order of commits.

Each transaction creates a number of locks that are necessary for the transaction to be executed correctly.
Rows that are being written to are exclusively locked (X-locked),
rows that are being referenced by foreign key constraints can be share-locked (S-locked),
and additional locks may be taken out explicitly.
Most people are running MySQL in a simplified model (for example using group replication) where only X-locks matter,
and the set of primary keys that are written to (and hence get X-locked) is the write-set.

Two transactions are potentially parallel-executable when the intersection of their write-set is empty,
that is, when they write to row sets that are non-overlapping.
Most execution models for MySQL (expecially regarding 
[parallel replication]({{< relref "/2021-11-08-mysql-parallel-replication.md" >}})) 
will try to execute transactions in parallel until they find an overlap.
Then they will block until all transactions are done, and start the next batch of parallel transactions.
This is not optimal, but simple, and prevents re-ordering of transactions in a way that is easy for developers to understand.
It will also not break heartbeat writes that are often used to check for replication delay.

In reality, 
the execution-width of such a transaction stream varies wildly and is completely subject to what the applications do.
For execution guarantees and service-level objectives,
when using MySQL,
the IOPS budget of the storage is immaterial.
We can only make guarantees for the database based on storage latency.
That is not a number you will find in the AWS catalog.
So go, measure.

In the workloads I have seen, over a longer stretch of time I have often seen a degree of parallel execution hovering around 3-5.
So your 2012 Netapp filer with 500 µs commit latency will, if the IOPS budget is big enough,
execute around 2000 sequential commits/s, and will perform with around 6000-10.000 IOPS.
You can guarantee only 2000 commit/s, because that is worst case performance,
and as a DBA you do not control application workload.

# Jitter

Jitter is the amount of variance you get in latency. 
Most of the time, we care a lot about jitter, especially with transactional workloads.

Jitter matters, because if we hum along with 10.000 write-commit/s, and we get a hiccup of 1/10 s (100ms),
we are likely looking at 1000 stalled processes in `SHOW PROCESSLIST`.
That is, if our `max_connections` is too low, we die.
Also, even if we don't die, the applications people will hate us.

You can see the effect of jitter or lock pileups, for example by running `innotop -m Q -d 0.1` for a minute.
If things are fine, the number of shown active, non-idle connections will be relatively constant
and smaller than the number of CPU threads available to your machine.

# TL;DR

- Bandwidth is the MB/s you get from your storage.
  - Work with 200 MB/s for disk, 400 MB/s for bulk flash, and celebrate burst speeds of 4 GB/s for a short time.
- Latency, for MySQL, is how long you wait for a 16 KB random-write to happen in fio.
  - 2012's NetApp gives you 500 µs, 0.5 ms. Today's NVME gives you 100 µs, 0.1 ms.
  - The cloud with very remote storage often gives you 1-2 ms.
  - commit-rate = 1/latency is the number of turns per second you get from a for-loop running "insert-commit".
- IOPS is the total, parallel IO budget for your database. 
  - IOPS/commit-rate is the required degree of parallelism needed to eat the whole buffet, that is, use up all IOPS.
  - Transaction parallelism in MySQL is application-dependent, 
    and is usually defined by how long a run of intersection-free write-sets you can find.
  - For the cases and workloads I have seen (webshops), it varies wildly over time, and is often 4-ish.
  - A single MySQL instance will usually not be able 
    to consume all IOPS offered by even a single enterprise NVME drive (800k IOPS).
    This would require a 40-wide parallel path, 10x more than what workloads typically can offer.
- Jitter matters.
  - That is why we look at 99th percentile and higher for completion latency (clat) in fio.
- Cloud storage often sucks.
  - 1 ms or even 3 ms clat give you 300-1000 commit/s, in a loop.
    Often that is borderline insufficient.
    You can weaken persistence guarantees (`innodb_flush_log_at_trx_commit`), 
    complicate your model by introducing other technologies (that are faster, because they have weaker persistence guarantees),
    or run MySQL yourself on i3 instances with local storage (but that is not why you chose the cloud).
- Guarantees can be made only on things you control, and that may be bandwidth and latency, but never parallelism.
  - Parallelism is controlled by the application, not by the DBA.
