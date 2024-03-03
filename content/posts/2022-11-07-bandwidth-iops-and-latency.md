---
author: isotopp
title: "Bandwidth, IOPS and Latency"
date: 2022-11-07T06:07:08Z
feature-img: assets/img/background/mysql.jpg
tags:
- lang_en
- mysql
- mysqldev
---

![](/uploads/2022/11/db-metrics-01.jpg)

*[A harddisk](https://en.wikipedia.org/wiki/Hard_disk_drive#/media/File:Seagate_ST33232A_hard_disk_inner_view.jpg) from 1998.*

The opening image for this post shows the stock photo of a hard disk platter.
You can see a movable arm that can ride in and out of a stack of rotating platters coated with some kind of metal oxide.
We sometimes call this kind of storage condescendingly "rotating rust", when in reality it is a triumph of material science.

Moving an arm costs time, and bringing that arm into the right position and then waiting until the right segment of disk rotates underneath it so that we can write things to disk takes time.
A lot of time -- around 5 ms or so on a modern disk, 4x longer on the old thing in the image.

> **How much time is "5 ms"?**
>
> A modern CPU at 3 GHz is running 3 clock cycles per nanosecond, 1/1,000,000,000 (10^-9).
> "5 ms" are therefore 15,000,000 clock cycles (15 million clock cycles).
>
> Since x86_64 is a CISC architecture, getting a fixed "clockticks per instructions retired" (CPI) value is hard.
> [Documentation](https://www.intel.com/content/www/us/en/develop/documentation/vtune-help/top/reference/cpu-metrics-reference.html#cpu-metrics-reference_CLOCKTICKS-PER-INSTRUCTIONS-RETIRED-CPI) and benchmarking with vTune shows variable CPI values between 1 and 2 for some interesting and common use-cases in our environment.
>
> Because a single core waiting for a hard disk seek already can block around 10 million executed instructions, "not reading data from disk, and if we have to, make it fast" was always key to our database design.

# Latency 

That means, writing to a rotating disk takes around 1/200 of a second, or we can write around 200 random blocks on such a disk.
This is called **Write Latency**. 

There is also **Read Latency**, which works the same way, but the other way around.
It is often possible to avoid read latency by providing more memory, but when it happens it is worse – writes can often be queued and executed in the background with some compromise on persistence guarantees, but reads often depend on the outcome of previous reads.
And that means we have to wait for the first read to complete before we know what to read next.

Together, when we just talk about the time it takes from issuing a disk request to its completion, we call both timings **Completion Latency**, or clat.

Benchmarking tools will give you a completion time histogram (or clat histo) for a drive, and it looks like this:

```console
     clat percentiles (usec):
     |  1.00th=[   53],  5.00th=[   53], 10.00th=[   53], 20.00th=[   53],
     | 30.00th=[   53], 40.00th=[   54], 50.00th=[   55], 60.00th=[   55],
     | 70.00th=[   59], 80.00th=[   60], 90.00th=[   73], 95.00th=[   75],
     | 99.00th=[   91], 99.50th=[   99], 99.90th=[  235], 99.95th=[  433],
     | 99.99th=[ 2343]
```

*fio Benchmark clat histogram from [Adventures in Storageland]({{< relref "/2019-06-13-adventures-in-storageland.md" >}}).*

Here we see a Benchmark result from a typical database blade in use at work, a Dell M630 with a PERC controller and a 1.92TB SSD.

You can see that the units here are µs, Microseconds (1/1,000,000, a millionth of a second).
The 99.5th percentile of all clats is 99µs (100µs are 0.1ms).
For the 99.9th percentile, the clat jumps to more than twice that, 0.235ms, and for the 99.95th it's again the double of that, 0.433ms.
After than, we get the really bad outliers.

That is, we have a storage that performs quite well across the spectrum from 0.05ms to 0.10ms for 99.5% of all requests -- they are actually written to battery buffered (BBU) persistent memory, and then streamed out to the storage medium, which happens to be a SSD.

The BBU is what makes this fast, even with HDD, and if the battery ever fails you get a lot worse performance.
We monitor these batteries very closely for that reason.

This is the performance we get from bare metal, for around 100 Euro/TB and 9W-25W per drive unit.

![](/uploads/2022/09/local-storage-09.jpg)

*Write Completion Latency comparison between Local Storage (above) and Ceph (below) from [Database Workload and Storage]({{< relref "/2022-09-27-mysql-local-and-distributed-storage.md" >}}).*

The graph above compares two kinds of storages.
We are looking at how long it takes to wait for a write to the medium, and draw a histogram of write times.
The X-axis shows write time in µs, the Y-Axis the number of requests with that time.
The comparison is between a bare-metal storage with a local disk behind a SmartArray or PERC controller on the top, and Ceph below.

We can see that writes to the local storage are quick (0.1ms or less), and that they are also not spread out:
The write time is extremely reliable.

The Ceph Storage has a median completion time (P50) of 0.9 ms, and a P99 somewhere up slightly under 2 ms.
The spectrum of write times is extremely wide, the completion time varies a lot.
This makes any guarantees on performance very hard.

At the P99 scale Ceph is 20x slower, but on top of that the variance makes it really hard to deliver consistent performance.

# IOPS

The word IOPS expands to "**I**/O **O**perations **P**er **S**econd".
It is not the inverse of Latency.
This is discussed at length in [Adventures in Storageland]({{< relref "/2019-06-13-adventures-in-storageland.md" >}}).
The distinction is extremely important for Flash Storage with NVME interfaces.

![](/uploads/2022/11/db-metrics-02.png)

*Storage in SSD and NVME drives is made from a lot of storage chips. Writing to each takes a fixed amount of time, but there are many, and they can be used concurrently.*

Writing to a flash chip takes a fixed amount of time, about 1/20,000s to 1/30,000s.
That is, each single flash chip in a flash drive can perform 20,000 to 30,000 writes per second.
But with the right interface, each of the chips on the drive can do that in parallel to the other chips.
So with proper driver soft- and hardware you get a performance that is much higher than 20,000 operations per second.

"SSD" puts a SATA interface on the PCI bus, and talks to a flash storage like it did to a hard disk.
The protocol serializes requests, so you get 20,000/s, even if the hardware behind the SATA interface could do more.
A lot more.

"NVME" drops the SATA interface and puts the flash storage directly onto the PCI bus.
The protocol now can have many requests in flight concurrently, very many.
A single enterprise grade NVME hard drive delivers 800,000 IO operations per second, or 800k IOPS.

Each single operation will still take 1/20,000s, though.

That is, in order to get 800,000 IOPS, you will need to talk in 40 independent streams in parallel to the drive.

> **IOPS and Latency are not the same thing.**
>
> Latency measures how long one single operation takes.
> Single Threaded, that is the number of operations you get, so IOPS and 1/Latency are identical in the single threaded case only.
>
> The IOPS metric in the drive catalog is not that number.
> It is the aggregated parallel number of requests the drive can serve.
> If you divide IOPS and 1/Latency, you get the degree of parallelism you need to serve in order to actually get all the IOPS the hardware advertises.

Some workloads do have a high or even unlimited degree of parallelism.

![](/uploads/2022/11/db-metrics-03.jpg)

*The CERN Atlas detector, a measurement device that delivers 10,000s of independent, concurrent metrics streams to a storage. (Image: [Cern](https://atlas.cern/Discover/Detector)).*

Imagine you are CERN, and have an array of detectors streaming data from your Synchrotron to some metrics storage.
Each metrics flow is linear, and independent of what any other sensor writes.
This is an ideal case for a "high latency, high IOPS, streaming metrics storage" kind of storage.
Ceph was developed for this.

Other workloads are not like this.
Online Transaction Processing Databases (OLTP databases) of the kind we run write a stream of transactions.
Transactions are independent when they have non-overlapping sets of primary key (write sets, wsets), but if their wsets are overlapping, they have a dependency and order between themselves.

The average run length of non-overlapping wsets we call the "width of the binlog of that database at that point in time".
It is the number of parallel writes inherent to the workload of this database at that point in time.

We have measured it, and I have documented that in [Parallel Replication]({{< relref "/2021-11-08-mysql-parallel-replication.md" >}}).

It is important to remember:

- This is workload dependent, that is, controlled by the application, and not the database.
- This is extremely highly variable over time.
- This is a small number, usually not exceeding 3-5 on the average.

Because this is not controlled by the database, we cannot make any SLO on it – SLOs can be made by a team only on things the team can influence.
Because it is highly variable, and workload dependent, not even an application team can rely on a minimum width.

And because it is usually a small number, Latency of a storage is way more important for any OLTP database than any other performance metric.

# Bandwidth

Writes to disk have a size.
Bandwidth is measured in MB/s, and is calculated as "number of writes times the size of the writes" or "sum of the write sizes per second".

In MySQL, a commit is a multiple of 512 bytes, and a checkpoint write is a multiple of the 16 KB page write.

At 2500 writes per second (0.4ms write latency) we get 40 MB/s at 16 KB page write size (and hardly more than 1 MB/s for 512 byte commit writes). 

At 25000 writes per second (0.04ms write latency) we get 400 MB/s at 16 KB page write size, and hardly more than 10 MB/s for 512 byte commit writes. 

The point of checkpointing is to coalesce updates to the same page, so it is usually a lot less checkpoint writes than commit writes: several updates to different rows on the same page are checkpointed together at a later time, saving write bandwidth.

Our OLTP databases usually write "dozens of MB per second" under very high load, and a lot less under normal pressure.
Bandwidth is normally not a metric we are much interested in, because about any storage that can deliver a latency we like automatically tends to have the bandwidth we require.

# A very simple benchmark

All of this leads to a very simple benchmark.
When we want to understand how a storage behaves with MySQL, we run a "16 KB random-write, synchronous writes benchmark at a queue depth of 1 with a single thread" and look at the clat histogram.
We then seek the inflection point, at which percentile does the clat suddenly increase a lot.

We can see the "normal clat", and with the inverse get the minimum guaranteed transactional rate, "commit/s".
And we see if there is a sharp inflection point (the Dell Perc clat histogram above), that is, we see if we can expect consistent write performance or variable write performance.

Ideally, we get a minimal clat that is highly stable until we reach saturation.

We can repeat the same with a random-read benchmark, no caching, in order to understand the performance of databases with a working set size larger than available memory.

Actual MySQL performance will be largely described by the results of this benchmark, even if the reality is slightly more nuanced.

![](/uploads/2021/02/class-200-lba.png)

*Oakgate Workload Analytics shows what a database does with the disk when it is writing (Image from [MySQL from Below]({{< relref "/2021-02-25-mysql-from-below.md" >}})).*

The above graph is the result of a blktrace command recording real world disk write activity to a ramdisk, and then plotting it.
The diagram plots block number (LBA, linear block address) over time, that is, we see where on the disk we are writing.

We can see the small writes to the database log files every time a commit is made.
This is a synchronous write, a multiple of 512 bytes, and the client hangs and waits until this write is finished.
Application performance is completely dependent on these writes being fast.

Every now and then the database cleans up the log by actually writing data pages back to disk, aggregating many changes that before have been recorded only in log writes.
This is called a checkpoint.
We can see that a checkpoint consists of a large number of writes to actual data files with addresses all over the disk.
These are multiples of 16 KB in size, and they happen asynchronously in the background.

The simplified random-write benchmarks takes both requirements, and tests completion latency and minimum bandwidth requirements together.
Anything that passes the simplified random-write benchmark automatically performs as well, or better with real world workloads.

# Summary

Storage performance is described by three parameters:

- Latency, how long it takes to read or write a thing.
- IOPS, the aggregated number of reads or writes a storage can do.
  Exploiting all IOPS often requires a considerable degree of parallelism in many modern storages.
- Bandwidth, the MB/s that the storage can take or deliver.

Online transactional databases sit between the storage and the application.
Their job is described by Codd, [Gray](https://en.wikipedia.org/wiki/Jim_Gray_(computer_scientist)) et all as the [ACID principle (1983)](https://en.wikipedia.org/wiki/ACID).
That is, they provide transactional write behavior (atomicity), correctness of data (consistency), transactional read behavior (isolation) and finally correct write behavior (durability).

The amount of exploitable parallelism is limited by these rules, the application workload, and storage properties.
For optimal performance, they require the lowest latency they can get, a reasonable IOPS budget, and a moderate bandwidth budget.
In general, any storage that provides good latency automatically provides sufficient IOPS and Bandwidth.

**Latency is the controlling property of storage for OLTP databases.**

## What Latency can I expect from various storages?

Here are various storages that have successfully run OLTP databases in the past, and now:

- A local HDD without a BBU can be expected to perform in 1/200s or worse.
  That is why controllers with a BBU have been invented, and that is also why storages made from HDDs of the past are often arrays of very many, very small disks, even if larger disks would have been available.
  The larger number of spindles allows you to exploit parallelism, the BBU allows the client to move on a lot quicker than 5 ms.
- Local Storage (SSD, NVME) can be expected to perform in 1/10,000s or better.
  Some performa a lot better, 1/20,000s to 1/30,000s.
  The difference between Flash presented as SSD and NVME is mainly in the degree of exploitable parallelism.
- Distributed storage can be expected to perform in 1/2000s or better.
  - That is, a NetApp filer from 2012 (FC/AL, BBU, many rotating hard disks) usually did take 1/2000s for a write, over the network. 
  - Amazon gp2 type EBS is advertised with 1/3000s, with quotas keeping you down (excepting bursts) if your volume is smaller than 5 TB.
    You want to get out of quota, you buy more space, even if you do not need the space – you need the performance that comes with larger volumes.
  - Amazon io1 type EBS is advertised with 1/10000s or better.
    This is "distributed storage with local cache trickery", a hybrid storage.
    It is not possible to get this kind of performance from a distributed storage without some local caching.
    Because local caching trickery with special hardware is required, this is very expensive.
