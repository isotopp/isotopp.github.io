---
layout: post
title:  'Memory saturated MySQL'
author-id: isotopp
feature-img: assets/img/background/mysql.jpg
date: 2021-03-12 12:40:33 +0100
tags:
- lang_en
- mysql
---
»If at all possible, we build databases so that the working set of the database fits into memory.« What does that even mean?

## Working Set

In computer science, the “Working Set” of a program is the set of things it will be accessing in the near future. Because computer science has not yet solved looking into the future, we are looking at the set of things we accessed most recently and hope for The Best™.

The Best™ here being that our future access pattern is very similar to our most recent past access pattern.

## Why Memory Matters

In MySQL, the “things we access” in the Working Set definition is RAM, Memory.

We do care, because memory is fast. How fast is fast?

Images from [Some Latency Numbers Illustrated]({% link _posts/2020-02-28-some-latency-numbers-illustrated.md %})

![](/uploads/2020/02/latency-top.gif)

*One Pixel is One Nanosecond*

In the above graphics, each pixel is a nanosecond, a billionth of a second. That’s the amount of time you have for each clock cycle at a clock of 1GHz. Our computers are running at a clock speed of around 3 GHz these days, 1/3 of a nanosecond per cycle.

One nanosecond is around 30 cm at light speed, 1/3 nanosecond is around 10 cm at light speed. 2 round trip times is what we need to need – in the best case – to assure consistency in a system. So at 3 GHz clock, 2 RTT yields a circle of 2.5 cm, around the size of a die or socket in our current computers. It is almost as if ye cannae change the laws of physics, Capt’n.

Now, in the above graphics we visualize a L1 cache access, a L2 cache access, and a memory access. We also show a hard disk seek from the times of rotating rust. Well, we have to zoom out a bit.

This is a single disk seek:

![](/uploads/2020/02/latency.gif)

*Right click, and "Open Image in New Tab", then click again to zoom in. The memory access and cache accesses are at the top left.*

We do not want disk accesses to rotating rust, and much less we want actual head movements. When we have to do that, users are unhappy.

SSD is up to 100x better: we get up to 20.000 disk accesses per second (we get 5ms seek time, around 200 disk accesses per second from each piece of data center grade rust), but it is still slow.

[Adventures in Storageland]({% link _posts/2019-06-13-adventures-in-storageland.md %}) explores that in some more depth. In [Not Quite Storage Any More]({% link _posts/2019-06-14-not-quite-storage-any-more.md %}) I get to play with Optane, and now, that is a different thing entirely.

## Memory means Buffer Pool

The memory we care for is “16 KB data pages” that are kept in a memory structure called the “InnoDB Buffer Pool”. It’s the thing that makes MySQL processes large in memory. MySQL does not use the File System Buffer Cache much (Postgres does), but does things a lot more efficiently and with application level knowledge in userland, in the Buffer Pool.

![](/uploads/2021/03/memory-saturated-01.png)

*The largest process in this instance is mysqld. The VIRT size is 84.8G, the RES size is 73.7G.*

Looking at one specific instance, we can see the machine has a main memory size of 128 GB. Userland gets to see 125 GB, the kernel needs the rest internally.

The MySQL process has a VIRT of 84.8 GB, that is, it has asked the operating system for memory allocations of a cumulative size of 84.8 GB.

Out of this, the RES says it is at 73.7 GB. The resident set size (RES in htop or RSS in ps) is the cumulative amount of memory pages the process has actually accessed, so we actually took the promises the operating system made in VIRT and did something with it.

When starting a fresh mysqld, you will see that the VIRT is already almost at the final size level and the RES is tiny. As the mysqld warms itself up, RES approaches VIRT.

## Warming up

In the bad old times, we had to do that manually by executing a number of SELECT queries after startup to force data into the buffer pool before we enabled new boxen in the load balancer. Not doing that has very bad consequences: Instances would not serve queries in time, and slow instances would get ejected by the load balancers. 

About 9 years ago, I saw an incident that involved a restart of all the memcaches we had back then, and also restart all databases, due to a very bad rollout involving problems with cache invalidation. When everything was ice cold after that restart, all attempts at restarting failed due to the load balancer ejecting the databases with “not ready in time” errors.

We fixed that by quickly implementing an experiment that disabled the 
"buy" button, and put it full on. We then very gradually released the number of users in that experiment to zero over the following 20 minutes, and used this to carefully regulate the load on the memcaches and databases.

Only then we could turn that “experiment” off, and were back in business.

## Warming up efficiently

These days, mysqld saves the page numbers of the data pages in the buffer pool in LRU order into an ASCII file when you nudge it, and on shutdown. When starting, it loads a percentage of that set of pages, the most recently accessed pages first. It’s one of the many improvements to MySQL that Oracle implemented because we asked them to.

Loading a multi-gigabyte buffer pool from disk takes time, even with SSD, and we want to find a compromise between cache warmup and startup times. That’s why not all of the buffer pool is reloaded. The config variable innodb_buffer_pool_dump_pct controls the percentage of the LRU that we are interested in, and is usually a value around 25.

## How much memory is in the pool?

So how much of that 128 GB is being used as the buffer pool? Well, obviously VIRT is smaller than that – other things on the box are also using memory and we do not want to be OOM killed or pages out.

It is obvious why we would not want to be OOM killed, but why do we not want to be paged out? Memory access patterns are not efficient disk access patterns, so MySQL gets very slow when it is paged out.

Memory data representation is also not efficient disk data representation, by the way, and that is why no database ever uses mmap() much, except MongoDB (but that is, some would argue, not a database).

Now, RES is smaller than VIRT, so we are using even less of the 128 GB we have. Why is that?

```console
[root@prod-replica mysql]# du -sh .
684G    .
```

We do have enough data, so it is not that we would not like to keep more data in memory.

But, the InnoDB Buffer pool size is actually even lower than this.

From the /etc/my.cnf of the instance above:

```console
innodb_buffer_pool_size = 64G
# innodb_buffer_pool_size defined from memorysize = 125 GB as 107 GB
# innodb_buffer_pool_size_adjustment of -15 GB 
# connection memory = 29 GB for max_connections = 30000
innodb_buffer_pool_instances = 16
```

As you can see, we *would* like to see a Buffer Pool of 107 GB for a memory size of 125 GB (what userland sees after the kernel got its share).

But we are configured with a `max_connections` value of 30000, and each potential connection will eat memory. We need to leave room for that, and this leaves us with 16 Buffer Pool instances of 4 GB, for a total of 64 GB – only half of the total box, and 43 GB less than we would like to use.

## 30000 Connections? Isn’t that a bit much?

It is.

Each web server connecting to the database is creating workers running Perl. Each of these workers will at some point open a connection to the instance (and keep it open). The maximum number of workers times the number of machines running this is the maximum amount of connections we need to be prepared for.

Can’t we optimize this?

We can, and most of the time it will work. This box for example, right now, has only around 100 connections open. Others have at this point a few thousand.

Sometimes, though, the assumptions the optimization makes are invalid. Then we run out of connections. Then the site is down.

So we don’t, and pay with memory overhead for this.

Java handles things differently due to a different deployment model, and also has better control over the number of connections that are being opened. We can still see many connections from Java, but that is more a decision than a fact forced on us.

We could put a proxy in between the Perl and the MySQL. This has other effects, and is not necessarily effective, or even a good idea. It is also not ready for production any time soon, so we will be paying in memory efficiency until this is done.

## So what do I get?

What do I get from all this memory?

We see “point queries” being served at an average speed of 336µs, that’s 336 millionths of a second or 0.336 ms. That’s memcached speed.

A “point query” is a query that contains a single value lookup by primary key, something like `SELECT a,b,c FROM t WHERE id = ?` or similar.

The next level up from that would be a batch key access (“BKA”), such as `SELECT a, b, c FROM t WHERE id in (?, ?, ?, …)` or similar. When the data is cached in the Buffer Pool, we get answers in the sub-ms range times the number of rows asked. This is very much alike to a memcached `GetMulti()`.

The next level up from that would be an indirect point or batch key access, such as `SELECT a, b, c FROM t WHERE d = ?` (or `WHERE d IN (?, ?, ?, …)`). These take usually two times the time the primary key lookup would take, but these are already things that cannot be done with memcached easily.

But, unlike memcached, a database can write these things to disk, persistently, atomically and efficiently. And you move seamlessly from in-memory queries to data read from disk, and you move seamlessly from point queries through BKA to JOINs and more complex constructs, until you reach [Turing Completeness](https://www.percona.com/blog/2017/11/22/sudoku-recursive-common-table-expression-solver/) with [Recursive Common Table Expressions](https://dev.mysql.com/doc/refman/8.0/en/with.html) in MySQL 8.

Long story short:

At work, we hardly use memcached. We use mysqld instead, and we save ourselves from a lot of cache invalidation pain that way.

It was not always like this, and we changed that once we understood that
1. the database is fast enough and
2. developers can’t name things, invalidate caches and declare dependencies reliably or consistently.

## Surely, in the cloud things will be different?

Current tuning advice for MyQL, anywhere, looks like [this Percona](https://www.percona.com/blog/2020/06/30/mysql-101-parameters-to-tune-for-mysql-performance/) article. To save you the read: The first item on the list is to play blackjack with the Buffer Pool – as large as can be, but never so large that we page or swap. All other advice concerns efficient writes, not reads.

And Aurora? Check out [Migrating to Aurora: Easy except the bill](https://gridium.com/migrating-to-aurora-easy-except-the-bill/). Aurora is not exactly a LSM like RocksDB, but sufficiently close. Like RocksDB and all other LSMs, it is even more dependent on memory for the L0-equivalent they have, and for compaction.

In the article, they solved their performance and cost problems (Aurora bills by disk accesses, even reads) by giving it 4x more memory than the conventional RDS instance they had.

In [MySQL from Below]({% link _posts/2021-02-25-mysql-from-below.md %}) I wrote:

> You, too, can be a successful database performance consultant:
>
> Say “Buy more memory!” and “There is an index missing” as needed.
> 
> Add “That’s going to be expensive”, if you work for SAP or Oracle.

Haha, only serious.

## What instance size should I choose?

That’s actually a research question.

When I was in university, the best way to find the Working Set of a machine was to boot it with a mem=<less> parameter and see what happens. Considering this involves a reboot and a warmup, this is quite intrusive and slow. Nobody ever did that.

Brendan Gregg came up with "Time Bounded Memory Access Counting" in his [Working Set Size](http://www.brendangregg.com/wss.html) pages. His code is buggy and does not run the way it should on modern Linuxes. It also reports numbers that I consider fishy in my tests, and I do not trust what he does sufficiently to run it on a production database for long enough to get proper numbers.

We know that you do not need more memory than the sum of your `data_length` and `index_length`, so `SELECT sum(data_length+index_length)/1024/1024 AS total_mb FROM information_schema.tables WHERE table_type = “base table” AND table_schema IN (<list of schema names>)` is very generous upper boundary. It is guaranteed useless to have more buffer pool than this.

It is clear that virtual machines do give us more flexibility to balance cores and memory better, at a terrible cost when it comes to writing to disk, though (at least in the current deployments).

## And CPU or Network?

The last time I saw a database being network bound was a Replication Primary on a 1 Gbit/s network interface with 200 Replicas. Each write was copied downstream 200-fold, so when you change a large BLOB, the network stalls due to the amplification.

In general, MySQL is utterly incapable of saturating the network, especially todays instances with 10 GBit/s or more on their network interfaces.

MySQL can saturate a CPU when you hold it wrongly. 

There are three reasons for CPU problems in databases that are common:

1. You happen to have a table in memory that is missing an index, so you are doing full scans in memory. Don’t do that. Add the index, and the load goes down.
2. You happen to have a table that’s being sorted due to GROUP BY or ORDER BY, and the sort is small enough to happen without spillover to disk. Try to avoid the sort, for example by performing it in the client, if possible, or by leveraging a more covering index that presents data in the desired order, avoiding the sort.
3. You have used code in the database: Stored procedures, stored functions or excessive stacked views. Don’t do that. Take off, nuke the site from orbit and start over on another planet.

# So?

> If at all possible, we build databases so that the working set of the database fits into memory.

- Optimize your database deployment on memory usage.
- Base your efficiency KPIs on that.
- Watch out for the `disk reads requested/actual disk reads` ratios and similar cache efficiency ratings in your database.
- Make sure the absolute number of actual disk reads is large independent of load on the database (when you increase load, the number of disk reads does not go up)
- Size your instances around memory.

Forget about CPU or Network. If you have to care about these things, somebody is holding the database very wrongly. They need to be found, and be advised to commit a fix.
