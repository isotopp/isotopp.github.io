---
author: isotopp
title: "MySQL: Local and distributed storage"
date: 2022-09-27T12:13:14Z
feature-img: assets/img/background/mysql.jpg
tags:
- lang_en
- mysql
---

Where I work, we are using MySQL in a scale-out configuration to handle our database needs.

That means, you write to a primary server, but reads generally go to a replica database further down in a replication tree. 

A number of additional requirements that should not concern you as a developer make it a little bit more elaborate than a simple "primary and a number of replicas" configuration.
But the gist of all that is:

- there is always a read-copy of the database very close to your application, latency wise
- there are always sufficient copies of the data around so that we can afford to run our databases on unraided local storage.

The nature of our databases is such, that we drown all data reads with sufficient memory, where ever that is possible.
Our databases are Memory Engines, when it comes to reads.

I joke about that:

> You, too, can be a successful database performance consultant: 
> Say “Buy more memory!” and “There is an index missing” as needed.
> Add “That’s going to be expensive”, if you work for SAP or Oracle.

But it is true: Reads are really bad for databases. 
Here is what a database workload looks like when the database does not fit into memory:

![](/uploads/2022/09/local-storage-01.jpg)

*Graph based on data recorded with `blktrace`, analyzed by [Workload Intelligence](https://www.oakgatetech.com/applications/analytics) from Oakgate.*

The workload shown here is too large to have its working set inside the InnoDB Buffer Pool provided.
We do see a constant stream of reads over time, to the tune of several MB/s and up to ~1000 IO Operations per Second (IOPS).

Had this database more memory, the reads would instead hit cached blocks in memory and would eventually be served from RAM. 
We would see read requests at the database layer, but they would be satisfied from the database's Buffer Pool and not hit the disk. 
Only the write load remains.

# But aren't writes worse, then?

That is an interesting question.

We can drown reads with cache, but we can't drown writes much. 

They eventually have to go to the disk, and in order to be ACID compliant, we need to delay the COMMIT until the write has hit a persistent storage layer.

Depending on our persistence requirements, we demand that the write 

- hits a machine-local persistent storage (a disk, a NVME or a battery backed cache unit (BBU)),
- hits at least a second machine or 
- hits a second machine in another availability zone.

Increasing the requirements introduces more latency, and brings down our maximum write rate due to increased wait time.

But uncached reads are worse.

![](/uploads/2022/09/local-storage-02.jpg)

*Writes can build deep queues, but for reads that is hardly happening. This is a key observation.*

When we send writes to storage, we can do that asynchronously: 
We fire off the write, and while we delay the commit and wait for the write to complete, we can do other things. 
That is possible, because these other writes are – to a large extent – independent of the outcome of previous writes, as long as ordering guarantees are being held up. 
Writes are a stream that continuously flows and that can be queued.

Reads are not, at multiple levels.

Databases read data from indexes, and indexes are mostly data structures such as balanced trees, with a large fan-out. 
If you have more data than fits into memory and sensible indexes, the index is approximately four layers deep. 
You will need around four media accesses to get from the root to the desired data, assuming no caching.

> **Why approximately four layers?**
>
> In a tree, the depth of the tree is the logarithm of the number of records to the base of the fan-out.
>
> For a billion records and a fan-out of 200 at each level, you get a tree depth of 3.91.
>
> Fewer records will make it a bit more shallow: Depth 2.60 for a million records at a width of 200.
>
> A smaller fan-out will make it a bit deeper: 
> a million records with a fan-out of 20 instead of 200 will give you a depth of 4.61 
> (Remember, we are working with pages of 16 KB size, so a fan-out of only 20 is incredibly small).
> 
> In practice, all balanced trees in our databases will be approximately 4 layers deep, because log(n)/log(fan-out) is practically a constant valued around 4.

Most of the time, even for large data we can completely cache the inner tree, so this comes down to 4 disk read requests and one actual disk read. 
But: In such a lookup, each disk read is completely dependent on the outcome of the previous disk read. 
The reads are all serialized by disk accesses.

That, again, underlines the importance of memory in database operation. 
"Buy more memory, then invest into more memory" is an extremely sensible piece of advice.

Now, we actually do not just read data from a single table. 
Often we join two tables. 
In a loop join, we join two tables with SQL of the form 

```sql
SELECT a.somecolumn, b.someothercolumn
  FROM a JOIN b
    ON a.aid = b.aid
 WHERE <some conditions>
```

This will grab rows from `a`, hopefully using an index (see above for index reads), and then take the rows from `a` as they are generated. It will use the `a.aid` values emitted and apply them to look up `b.aid` rows in table `b`.

Again, we can't know which rows in `b` we are interested in before we haven't completed the reads on `a`.
Read accesses on `b` are dependent on the outcome and hence completion of our (indexed) reads on `a`.

That is not a good way to build deep queues: 
Work stalls until the previous reads are done – unless we provide sufficient memory for the reads to not happen in the first place.

# What do reads and writes look like in reality?

Meet our availability databases. 
They are holding hotel room availability information. 
This database is running on bare metal, 16C/32T, 128 GB memory and two SSD on a controller with a battery backed cache unit (BBU).

![](/uploads/2022/09/local-storage-03.jpg)

*The box is serving mostly reads, 4746 in the last second, and as a replica sees writes only from upstream.*

The box is currently holding a few TB of data, serving around between 6000 and 12000 queries per second.

The statement mix looks like Java: around 50% of the statements are `SELECT`, the large percentage of `SET` statements is indicative of the JDBC driver and the rest is DML and transaction management.

![](/uploads/2022/09/local-storage-04.jpg)

The box is currently running at a load of 9, but it is early morning, and we have a load peak in the evening. At a load of 12, it has sufficient capacity to carry on, if we lose an AZ and have to fold the failing data centers load into the surviving machines.

This kind of hardware with this kind of workload will become uncomfortably jittery at a load of 24.

![](/uploads/2022/09/local-storage-05.jpg)

We also observe variable read load of around 1000-ish IOPS, spiking into the 4000's.

This works well. How well?

![](/uploads/2022/09/local-storage-06.jpg)

We observe read and write latencies on a µs scale, that is 10^-6, millionth seconds.i
2000 µs are 2ms.

 Read latencies are layered curtains with peaks at 0.2 ms, 0.26 ms, 0.33 ms, 0.45 ms and 0.58 ms.
We could draw a large gauss curve over the entire thing, peaking at 0.33 ms.

Write latencies are... nonexistent?

When we zoom in, we can see that disk writes seem to happen at a latency of 40 µs, 0.04 ms. 
That's to the tune of a PCIe bus transfer – a 256 Byte bus transfer takes around 100 ns, 40 µs are good for about 12-ish KB worth of bus time, and for comparison, 16 KB is the size of a MySQL data page written out. 
The numbers check out.

This is the time it takes to transfer 16 KB of data from a MySQL Buffer Pool in RAM to the 4 GB worth BBU cache on the HP SmartArray controller card, which counts as locally persistent. 
The ARM CPU on the controller will then take all these writes, sort them, batch them and write them out to the SSD in the background.

All together that works very well: 
This blade costs around 150 Euro per month, per machine, over a reservation interval of 5 years. 
It stores 1 TB of logical data in 1 TB of physical disk space. 
And it performs at amazingly low and stable latency numbers.

It is not redundant at the machine level – we are using other, database level technologies to achieve that. 
Using replication, we make copies of the data on this machine on other machines and in other data centers. 
This allows us to utilize redundancy for capacity, but also for availability.

It does so at a cost that also allows us to completely eliminate additional cache layers such as memcached – also eliminating the entire class of cache incoherency bugs that came with memcached usage, until 2012, where removed memcached.

# Changing the Equation

Introducing distributed storage into the equation changes the properties of the underlying storage fundamentally.

Your storage is no longer machine local, and for reasons that are transcending the scope of this post, it is also always replicated – usually with a replication factory of n=3. 
That is, 1 TB of data in the database becomes 3 TB of data on disk, 1 TB on each of three different machines.

Traversing the datacenter in our on-premises data center takes around 60 µs, plus the time to write data to locally persistent storage makes it 100 µs, 0.1ms, for each hop. 
Multiple copies and coordination add up, and the end result is a write time distribution with a maximum of 0.9 ms for the storage tested here.

Read latencies have the same shape, but are somewhat lower – we need one copy of the data to read it, not all of them, so we come out at around 0.6ms.

![](/uploads/2022/09/local-storage-07.jpg)

*Latency diagrams for read and write latencies of our Ceph storage are r=0.6 ms, w=0.9 ms. This is amazingly low for Ceph – a Ceph cluster in 2015 would have been around 5.0 ms.*

Running a database with a comparable profile on top of this storage changes database behavior a lot:

![](/uploads/2022/09/local-storage-08.jpg)

*Read latencies compared: Above, the graph from the local machine, below a comparable workload on Ceph volumes.*

We have reads, and read latencies are approximately twice as high as on a local SSD. 
We have discussed how reads don't queue well, as the results of later reads are often dependent on the results of previous reads.

That means we have lowered the read capacity of an instance by 2, for the same number of connections.

We could, in increasing order of engineering and monetary cost

- add memory to quench the reads in an increased buffer pool
- add boxes to the pool, at the cost of additional instances
- add connections and query the database with multiple parallel tasks, trying to engineer our workload to be more parallel shaped

For this hierarchy under test, the second thing happened: 
we scaled up the number of instances in order to deal with the query load under worsened read latency.
And we should try the first thing: 
use instances with more memory to make the disk accesses go away.

For the writes, the picture changed completely:

![](/uploads/2022/09/local-storage-09.jpg)

*Write latencies compared: Above, the graph from the local storage machine, below a comparable workload on Ceph volumes.*

Writes now take 0.9 ms instead of 0.04 ms.

Also, while the write latency histogram is nicely Gauss-shaped, it does have a considerable base width: 
The 0.9 ms is actually the base of a curve that goes from 0.6 ms to 1.6 ms on the other side.

Writes queue nicely, and the storage here is performing extremely well under parallel load in benchmarks. 
So many parallel writes should work well: 
Each write takes 0.9-ish ms, but you can do many of them in flight at the same time.

Unfortunately, transactional workloads do not have that shape. 
[Parallel replication]({{< ref "/content/posts/2021-11-08-mysql-parallel-replication.md" >}}) is subject to a number of constraints regarding reordering, and also subject to limitations that result from implementation details.

![](/uploads/2022/09/local-storage-10.jpg)

*Replication delay over time: Despite parallel replication being active, the instance cannot keep up with the write load. Only careful write modulation keeps the replica from delaying even more.*

And that is not even a high write load: The statement mix shown here did not even touch the 1000 inserts/s barrier.

![](/uploads/2022/09/local-storage-11.jpg)

Yet the storage statistics are absolutely devastating:

![](/uploads/2022/09/local-storage-12.jpg)

We see somewhat over 1000 reads and 1000 writes per second on the volume, which are good considering the latencies we see above, but devoid of parallism. 
The I/O we see is good for an aggregate I/O of 22 MB/s, and results in complete saturation of the Disk I/O.

There is no easy way around this, except deep changes to the application to make it write differently. 
But we do not really want to spend application business unit developer time on "code around the intricacies of the storage solution we chose" instead of "solve business problems".

The recommendation to use local storage in the virtualized environment still stands, as it performs better and does not provide storage-level redundancy for which we have no use, given that replication provides capacity *and* redundancy at the database level.
