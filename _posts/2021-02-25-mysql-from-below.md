---
layout: post
title:  'MySQL from Below'
author-id: isotopp
feature-img: assets/img/background/mysql.jpg
date: 2021-02-25 22:02:20
tags:
- lang_en
- mysql
- database
---

When you insert data into a database and run COMMIT you expect things to be there: [Atomically, Consistent, Isolated and Durable](https://en.wikipedia.org/wiki/ACID), like Codd commanded us 40 years ago, but also quickly. There is a surprising amount of sophistication being poured into this, but since I do not want to shame MongoDB and Redis developers in this post, I am not going to talk about that much in this place.

We are instead trying to understand what our databases are doing all day, from the point of view of the storage stack.

![](/uploads/2021/02/linux_observability_tools.png)

*That Brendan Gregg Graphics*

Here is your performance tooling (sans EBPF) as shown by Brendan Gregg in various iterations. We are interested into the various blues in this graphic, VFS and downwards. The most detailed information of what goes on in the blue stack is given by blktrace. It’s an I/O request recorder.

Unfortunately, blktrace tooling sucks big time. You have the choice between blkparse, iowatcher and seekwatcher, and they either give you unappealing and hard to read ASCII dumps, or are hard to use and abandoned to boot. A colleague threw [Workload Analytics](https://www.oakgatetech.com/applications/analytics) around. And with that you can actually see what goes on.

So, let’s have a look.

# Workload Classes

When you go to our Grafana, and ask nicely, you can basically divide our databases into three load classes: “200 commit/s”, “2000 commit/s”, and “20.000 commit/s”, so “low write load”, “busy write load” and “should be thinking about what they are doing really soon” write load.

I am using representatives from every workload class to point out a few things.

## But what about Reads?

Amazingly, at work we do not really care much about disk reads from databases.

We build our databases, especially customer facing databases, in a way that we try to hold the working set of the database in memory.

The “working set” of anything is the set of things that you will be needing in the near future. Unfortunately, predicting the future is hard, so what we define as the working set instead is “the set of things that we have most recently used and are therefore hoping to use in the near future again”, which works reasonably well until there is a change in workload pattern.

In our databases, the “anything” that matters is a 16 KB database page as it resides in the InnoDB Buffer Pool. So what we do is simple: We spend money on memory, warm up the InnoDB Buffer Pool and then serve data from memory.
We can prove that works: InnoDB can do point reads from memory at memcache speeds, which is why we don’t use much of memcache and Redis in the first place – they don’t help.

We can also capacity test our databases, and we will find that as we increase the load the number of disk reads does not go up. Data is served from memory, and not from disk.

So what we care about is disk writes. They are the same on every instance of a replication chain, because of the shared nothing architecture of replication: Each chain member must apply the same set of changes from the primary down to all leaf replicas.

## The Write Model

On Commit, we write out 1 KB (or more) of Redo Log. The write happens with `O_DIRECT` to XFS, and there is a lot of thought that goes into these few words.

Because it is `O_DIRECT`, the write already writes to disk. There is no need to `fsync()` or `fdatasync()` or anything else.

`O_DIRECT` writes also bypass the file system buffer cache, which is good, because then there is less memory pressure and less risk of paging out the database server. Usually when that happens (memory pressure forces paging on mysqld), you die a horrible and hard to debug death in latency problems and SLO violations.

We use XFS. XFS on the average takes twice as long as ext4 to write data to disk, but XFS always takes the same amount of time to write data – it has been specifically designed in a way that there is very low jitter. ext4, on the other hand, is known to have downspikes and large commit wait times every few seconds, and that is really, really bad when you run at 10.000 queries/s.

XFS also is capable of having multiple concurrent writers on a file when the file is open with O_DIRECT. Unlike all other Linux File Systems, [it does not lock the file’s in-memory inode globally]({% link _posts/2018-11-29-but-is-it-atomic.md %}) to guarantee atomic writes in this case. Such a feature is very dear to database people.

The Commit is what users have to wait for. When it is done, the database can do the real data write later, often much later, and in the background. So what we really care for is the actual commit latency.

The real write happens later, in the Checkpoint. [What happens is complicated enough to justify a writeup of its own]({% link _posts/2020-07-27-mysql-transactions.md %}). But, to make it short, we write data to the Doublewrite Buffer in a few very large linear writes as protection against torn pages, and then we writev() a scatter I/O of 16K pages to update in place.

This is different from Postgres, and enables us to avoid costly vacuum runs. We make an assumption here, and that is: Rollbacks are rare (and expensive in MySQL).

## The Test Write Model

All that complexity is basically nonsense for benchmarking.

If you want to know if a thing can run MySQL, and how well, you simply randwrite 16KB pages in `O_DIRECT` and see what happens. That’s a gross simplification compared to above, but holds up surprisingly well as a model for predicting MySQL speed and capacity.

# The 200 Commit/s Class

In order to see what real databases do to their disks, I went to the chosen representative for the 200-class and `blktrace`’ed it.

It turns out that you can’t `blktrace` a single disk database machine, because the disk writes from the `blktrace` will mess up the metrics from the database. It also turns out that `systemd` mounts a 12GB ramdisk as `/run/user/<uid>` that can hold a 10 minute `blktrace` with no problems.

When we feed that trace to Workload Intelligence, we get this:

![](/uploads/2021/02/class-200-iops.png)

*The low red line is the 200 IOPS baseline load. Turns out, there are spikes, up and past 2000 IOPS.*

The first thing we learn: Kris is right. There are no reads.

The second thing we learn: 200 IO Operations per Second it may be, but there are spikes, up to and past 2000 IOPS even. They are not long, but they happen often enough.

So how long does it take to write to disk? Well, there is no disk. There is Flash Storage, and it does not even have a disk interface any more – it sits directly on the PCI bus. A Flash drive that is directly on the PCI bus is called NVME instead of SSD (it is otherwise the same drive).

![](/uploads/2021/02/class-200-latency.png)

*Most of the time there is very little wait.*

Flash is not fast, but NVME is: The drive not only has flash, it also has (large capacitor buffered) non-volatile memory it uses to buffer write and rearrange things in the background. It also has its own ARM processor with its own operating system.

Sometimes we have to wait a bit, but most of the time it’s really, really fast. How fast? We need to go deeper:

![](/uploads/2021/02/class-200-latency-detail.png)

*30µs or 0.03ms is the time it takes to write to memory over the PCI bus.*

When we talk to the remote NVRAM on the other side of the PCI bus, it takes 30µs, or 0.03ms. As long as we do not overwhelm the NVRAM buffers of the drive, we have a 30µs commit latency on local memory.

Another number, which will come in handy later, is the time to cross our entire network stack within the same data center: That’s around 6 switches and routers, and it will add another 60µs to any round trip across the network in the best of all cases. So a remote flash drive never can be faster than around 100µs or 0.1ms.

Where do the writes go? We can plot the Linear Block Addresses and see:

![](/uploads/2021/02/class-200-lba.png)

*LBA over time. See the position of the log files, and the checkpoints.*

When you plot “addresses written to over time”, you will see that there is a bunch of blocks that get written to again and again. These are the various logs and write buffers the database uses.

The drive internally has a flash translation layer (FTL), which makes sure that these block rewrites are actually distributed across all the positions in the flash you have. This kind of Wear Leveling makes sure the drive actually can live 7-10 years before the flash wears out.

The SD card or USB memory stick you are using in your local Raspi does not have that, and neither has the on board flash in the entertainment module of your Tesla. That is why they fail rapidly as actual fixed blocks of flash are being rewritten a few thousand times. Use a proper drive with a proper FTL and that does not happen.

In the graphics above you can also see the checkpoints scatter writes happen, and you can see how they are spaced apart widely, many tens of thousands of transactions. Checkpointing allows the database to aggregate changes in in-memory pages (and the log, for persistence). All that complexity is actually saving you disk writes!

Flash does not have a single write head as disk drives do. They are not forced to do things sequentially, but in fact all the various chips in your drive can do things concurrently. Deep disk write queues are necessary to keep all these channels fed for NVME, while they are poison of SSD and HDD.

![](/uploads/2021/02/class-200-qdepth.png)

*Queue Depth over time*

A low concurrency hierarchy such as this one is not even touching the true write potential of a single NVME: A single drive can do 20.000 disk writes per second, sequentially in a single thread, if you are pushing really hard, but it can do 800.000 disk writes per second if you are feeding it with sufficient concurrency.

These are two other important numbers to keep in mind. They are the reason why “IOPS Quotas” should be a thing of the past – it is impossible for any reasonable workload to actually exhaust a single NVME drive, and distributed storages usually have hundreds of them.

Let’s have a look at the latency diagram from above, again, and check the distribution of completion times in a Latency Histogram. It tells us how prevalent slow writes are over the observation window:

![](/uploads/2021/02/class-200-latency-histo.png)

*It's called Flash for a reason.*

So even with these curtains in the latency over time diagram, we can see that 90% of all writes happen in the 30µs window, and there are noteworthy amounts of writes in the >100µs class (they do exist, but they are so rare, they do not show up in the histogram).

Write sizes over time:

![](/uploads/2021/02/class-200-iosize.png)

*Write sizes: Loads of small writes*

We can see that the grossly simplified 16 KB Randwrite model is actually not wrong, even if it is an oversimplification. Modelling more precisely does not significantly impact predictive performance, though, and this way it’s only a few lines of fio to get data.

So that’s our tour of the 200-class from the underside – this is how your storage sees your commits.

# 2000 Commit/s Class

I chose this particular database as a member of the 2000 Commit/s Class, also because it is the oldest and wildest of the database replication hierarchies that we have. At a time it was our performance bottleneck and was running over 20.000 queries/s with spikes into the 32.000, and with the hardware of that time that was not stable at all.

We are much better now. I am not missing the old times at all.

![](/uploads/2021/02/class-2000-iops.png)

*IOPS over time, 2000 with Spikes to 5000.*

»Yes, Kris, we know about your “Look, Mom, no reads” already!«

True, but see, even a big and old monster such as this one can live with the working set in memory, completely. You, too, can be a successful database performance consultant: Say “Buy more memory!” and “There is an index missing” as needed (add “That’s going to be expensive”, if you work for SAP or Oracle).

![](/uploads/2021/02/class-2000-qdepth.png)

*Our Write Queues are more busy.*

A quick look at the Write Queue Depth over Time: NVME loves this.

Write Latencies from the helicopter looks a bit worrysome:

![](/uploads/2021/02/class-2000-latency.png)

*These 5ms Curtains, how dense are they compared to the baseline?*

We can zoom in: They are not bad.

![](/uploads/2021/02/class-2000-latency-detail.png)

*We can see horizontal latency bands at fixed latencies. They expose internal structure of the Flash storage that I have not enough knowledge of. Grumble!*

We do see dark green, fixed bands of latency layers at 30µs, 120µs and 220µs. The higher layers show a repeating pattern over time. These are shenanigans of the FTL that are visible as delays to external users, but they are way below any critical level. I do not know enough about flash internals to explain these things, and that bothers me. A lot.

They are also visible in the latency histogram:

![](/uploads/2021/02/class-2000-latency-histo.png)

*Our 30µs, 120µs and 220µs bands as bumps in the histogram. Anything below 500µs is probably immaterial in terms of worry.*

# 20.000 commit/s class

The chosen example is a [database as a queue]({% link _posts/2021-01-28-database-as-a-queue.md %}), that logs changes from one data set for processing and creation of a materialized view in another data set. It is an example of [CQRS](https://martinfowler.com/bliki/CQRS.html) in Fowlerspeak.

It is also very busy.

![](/uploads/2021/02/class-20000-iops.png)

*During the sampling, 2500 baseline, with spikes up to 7500.*

During the sampling, they ran at 2500 commit/s, with spikes up to 7500. The hardware will do up to 20.000 with them, and at times the queue will do as well.

So what can NVME do for us?

![](/uploads/2021/02/class-20000-qdepth.png)

*Queues in our Queues!*

Turns out, writes to a Queue Databases keep the Queues to the NVME busy to their fullest potential.

Is that bad for latency?

![](/uploads/2021/02/class-20000-latency.png)

*Latency Curtains for Writes*

Well, if you kept up to this point you are probably not surprised to see write latency curtains, and you will probably also be seeing that they mirror the queue depth changes without me pointing that out specifically.

Let’s zoom in a bit:

![](/uploads/2021/02/class-20000-latency-detail.png)

*We do see the curtains under the microscope, true, but look at this dark green band of fast writes below all of this.*

As you can see in the dark green band of fast writes below all of the curtains, the FTL of this particular drive is kept well busy. It is also worth it’s money - no gross delays due to internal reorg is what you get when you pay for enterprise flash instead of home equipment.

As a histogram:

![](/uploads/2021/02/class-20000-latency-histo.png)

*By far the most writes are still to NVRAM drive-side. Above 0.25ms we are basically clean.*

Smooth customer experience, even with an abusive customer such as this queue-database – bring it on, we can take your writes.

Histograms are fun, by the way. We can for example count disk writes per block address:

![](/uploads/2021/02/class-20000-lba-histo.png)

*We basically always change the same few pages.*

In a database as a queue, if all works well, the tables change a lot, but never grow. There are very few actual data pages that make up the small queue table, but very many inserts and deletes. We have to persist them to disk to be ACID, in the log. But there is hardly any need to checkpoint, and even then it’s very few full pages to write out.

Here you can see how much log writes dominate checkpoints in this extreme scenario.

If you made it this far, welcome and get your storage nerd badge at the counter.

