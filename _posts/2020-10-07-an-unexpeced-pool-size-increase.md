---
layout: post
title:  'An unexpected pool size increase'
author-id: isotopp
feature-img: assets/img/background/mysql.jpg
date: 2020-10-07 14:52:04 +0200
tags:
- lang_en
- mysql
- database
- erklaerbaer
- mysqldev
---
At work, replication chains have a single primary database node, to which you write, and then multiple replicas, in multiple AZs.

Here is what the one sample chain looks like in Orchestrator:

![](/uploads/2020/10/mysql-orchestrator.png)

*instance-918d is the current primary, in the blue AZ. Replicas in orange and green are in other AZs. Blue badges indicate multiple replicas, eg (38) means 38 machines.*

When you talk to a database, you get two database handles:

- A write handle which always points at the primary, here instance-918d currently, and 
- a read handle.

The read handle should be in the same AZ as your client application, and should be selected randomly from the available replicas for reading.

We also have other replicas, for cloning, to make more replicas, and for example time delayed replicas to correct accidental data deletions and other Oopses quickly.

Machines that are available for reading are organised in “Pools” per AZ. Many replication chains have only one Pool, “\<name>-misc”, but some replication chains also have additional pools for workload isolation. For example, some chains have “\<name>-slow” pools, and you get a third handle, to which you are supposed to send slow queries that cannot be optimised.

Other chains are shared between different applications, and in order to prevent crosstalk we have different pools, so that your "application-xml” queries do not mess with the regular “application-misc” queries. You are still using a “application-ro” handle, but it is non-overlapping between XML and normal application clients.

In any case, we run automated capacity tests on each pool, and then adjust pool sizes as needed. We also report to ourselves on that. Sometimes that report is interesting:

![](/uploads/2020/10/mysql-pool-size-change.png)

*The example-misc pool changed target size from 3 to 16 in the night of 05-Oct, which is a 433% increase.*

The minimum pool size is three, for redundancy reasons. The example chain is not busy, ever, and the pool size should *never* exceed three.

DBA Operations talk to the customer: “I am reaching out to you because you are currently designated as owners of one or more of the database schemata in the example database chain. The schemata in question are \<list>.

Starting yesterday, the example chain (and, especifically, its example-misc pool) has seen a significant increase in load, mostly in the blue AZ, as shown here:”

![](/uploads/2020/10/mysql-threads.png)

*MySQL "Threads Running" going through the roof, load testing reports diminished capacity and we ready more instances. The world is safe again! Or, is it?*

So we detected an increased number of threads running, and that led to a general reduction in the capacity, and that requires *MOAR MACHINES!* Yay! So our bots threw more machinery to ride the load wave and that kept us afloat for the moment.

Is that the story? It is not.

## A mysterious mystery

Humans descend on the problem and look. What are the machines in the pool, currently? Well, if have the privileges, you can check with our roster tool:

```console
$ sudo roster-tool list /persistent/pools/example-misc/az-west1-a
0be2b240a6964a338f0a65f22a2bb09d-example-2016.dc1.prod.example.com
421e3f5c81914082b26f93cd096c4d25-example-8050.dc2.prod.example.com
95624c835c454bbb8ad10a2eb728f66a-example-8051.dc2.prod.example.com
afc7bd521a5c404582645d89598269d3-example-2015.dc1.prod.example.com
e5724da64f134c34810f48211f5b777c-example-2014.dc1.prod.example.com
```

So let’s have a look at example-8051:

![](/uploads/2020/10/mysql-load.png)

*This box is terribly idle. For 18 hours, it was slightly less idle.*

This box is terribly idle. It has 16 cores, 32 threads, it can do 32 things concurrently on a good day. Running MySQL, it usually becomes flaky at a *1m load average* of 24, because we have web loads that are having very many short term variations, so “1m average of 24” really means “anything between 12 and 40”, if you look at things in 0.1s intervals.

With a target load of 24, and headroom for failover, the limit is 12 - but it will be flaky in degraded state then. We usually aim for a load of 8-10 on our boxes. For this database pool, we could do with one box instead of three in normal times, but three is the administrative lower limit for redundancy and resilience.

## Nothing is busy, but we don’t have capacity

During the incident it was higher, but not much. Yet, the capacity test returned a much diminished capacity and grew the chain by a factor of more than 4. Clearly, this is not load, but something else.

Let’s look at a few metrics for the time between 04-Oct, noon and 05-Oct, 6am. We want to know if we can see more action than the CPU thing. Let’s check the network:

![](/uploads/2020/10/mysql-network.png)

*Nope. No action on the network.*

And the disk:

![](/uploads/2020/10/mysql-disk.png)

*We see few writes, and almost no reads. This is a memory-saturated database.*

We see very few disk writes (a few hundred writes per minute), and almost no disk reads. This is a database with the working set residing in memory, and queries are resolved without disk reads.

This makes a very low query latency, and also means that the database can really only bottleneck on Networking or CPU. Now, a MySQL is very hard to bottleneck on Networking - I have only ever seen this happen twice.

So whatever is happening and limiting us is a kind of CPU problem. Likely not a CPU saturation problem: We would see load > 20 for this, and we are very far from that. That means it is likely to be a per-thread CPU problem.

## What could cause CPU saturation?

CPU saturation on a database can in my experience have very few and easily detectable causes:

- A frequent query running from memory with no index: full table scans from a memory resident table. No disk I/O, loads of memory reads. This is a badly designed table with a missing index, masked by good memory performance until the CPU is completely eaten up and the box goes down. Add the missing index to fix.
- A frequent query doing a lot of sorting in memory. Data is not requested in index order, so it needs to be re-sorted before given to the client in order to satisfy an `ORDER BY` clause. Can also be caused infrequently by weird `GROUP BY` clauses. Fixed by sorting in the client, if possible, or by finding a better index so that data is returned in index order, which is designed to match the sort order.
- A system is offloading computation into the database using stored procedures. This is the worst possible design, and easily fixed by nuking the entire site from orbit, starting over from scratch at a new site.

All of these cases would create a lot more load than we see, so it is none of that.

## Query workload?

What else stands out?

![](/uploads/2020/10/mysql-query-workload.png)

*Queries/s stable, Select/s looking normal. A slow query "spike" of very few slow queries.*

The query load did not change, the capacity did. This is getting more mysterious by the second, but I think I know the smell. See that slow query “non-spike”? We have had slow queries, but it could not have been many.

## What we know by now
So

- some, very few, slow queries, queries, 
- an unsaturated database, not bottlenecking globally on any base resource
- a machine load going up by 2 from 1 to 3 (per thread problem, two queries?)
- long running

We have [seen this before]({% link _posts/2019-11-18-a-blast-from-the-past.md %}), and we have seen it [a long time before that]({% link _posts/2011-04-28-mysql-undo-log.md %}) as well. Let’s check the undo log size:

![](/uploads/2020/10/mysql-undo-log.png)

*Undo Log shark fin perfectly co-inciding with the incident.*

We observe a shark fin in the Undo Log size that perfectly matches the time span of the incident and the increased CPU time.

## We knew this is bad

We know from [MySQL Transactions - the physical side]({% link _posts/2020-07-27-mysql-transactions.md %}) what the Undo Log is and what it is being used for: It’s keeping old versions of a row so that a transaction can have a stable read view preventing phantom reads.

We learned in [MySQL Transactions - the logical side]({% link _posts/2020-07-29-mysql-transactions-the-logical-view.md %}) how the Undo Log is consulted, depending on the transaction isolation level setting of the reading connection. Go to that article now, and read the section on “Repeatable Read and Long Running Transactions”, now.

The part where it says:

> Starting a transaction at the default isolation level will force the Undo Log Purge Thread to stop at the position of our read view. Undo Log entries will no longer be purged, filling up and growing the Undo Log. Reads and Index Lookups become more complicated and slower, slowing down the overall performance of the database.

So it may be long running transactions.

## Proof

How can we prove that?

And this is where metrics end, and observability starts. We would need a flight recorder that takes a snapshot of the database activities in regular intervals and keeps the data for some time so that we can look at non-numeric, non-aggregated detailed system stats from the past.

This is such an obvious pressing need that [Simon Mudd wrote a script](http://blog.wl0.org/2011/02/log_processlist-sh-script-for-monitoring-mysql-instances/) to do that in the deep, dark past long before the term “observability” even existed.

It runs every minute, and collects system hardware stats, MySQL processlist and other data, and stashes them compressed in a ring buffer in /var/log/mysql_pl/\<weekday name>. In an age of baremetal machines and all devs having production access you log into a database, cd into that directory and grab a random snapshot from the incident interval:

```console
/var/log/mysql_pl/Sun $ xzcat 23_48.innodb.xz > /tmp/kris
/var/log/mysql_pl/Sun $ vim /tmp/kris
/var/log/mysql_pl/Sun $ awk -F'\t' '($5 != "Sleep") && !match($7, /Waiting for/)' /tmp/kris | less
```

With a text editor we isolate the processlist recording from 23:48 on 04-Oct. We then use Unix Tooling to look at all non-sleeping connections that are also not idle replication connections.

This yields indeed two interesting queries: Both show a `cronjob=reserve_projectname_upsert_transaction_ids` running on `cronapp-39.dc2.prod.example.com` and on `cronapp-02.dc2.prod.example.com`, with runtimes of 16220 and 22170 seconds.

There are indeed two long running queries, coinciding perfectly with a load increase of 2, and they are easily identifyable cron queries. They run from two different hosts, with the same cron banner.

I have no idea what that job does, but we are looking at a `SELECT` statement in `REPEATABLE READ` isolation that has a run time of multiple hours, and unsurprisingly an Undo Log escalation. That leads to slow query performance and reduced capacity for all things, including the capacity test, and a changed target size for the pool.

## What we can learn from this

Besides the obvious, that is, fixing that cron?

Well, there is a moment in time in incident analysis where you need to pivot from identifying timeframes in which the incident happened and machines that are affected to actual instances of the incident in question.

This is also where you move from numeric aggregates in a dashboard to textual, structured logging information that actually has to be recorded before.

This is what observability is about: The ability to do this pivot easily, within one system, without special privileges, with proper tooling, in distributed systems, at will, without access to the actual box.

We don’t have observability. We need to get better at this. Go, follow [Charity Majors on Twitter](https://twitter.com/mipsytipsy).

With such tooling, we need to connect what we teach with actual incidents that show how the teachings connect to real world cases.

Which is why I am typing up this thing, right now and link to the actual writeups that enabled me to show you this. Go, read these things again, please, in the light of this particular episode.

You know in your head what "Undo Log" means. Here you can understand what "Undo Log" feels like. Go, [touch the candle](https://blog.koehntopp.info/2020/08/31/on-touching-candles.html).

We have all the tooling, but it is from a different age. An age where people either routinely had access to production or sat next to a DBA in an office and could easily get at all the metrics. Observability by shell script on a root shell is a thing we have in abundance, because that was enough in that time and age.

We do no longer have access to root shells in production, and in the age of anything as a service not even to shells.

Observability as taught by Charity Majors is your trusted `printf(“Checkpoint: I am here.\n”);` or your [Fred Fish Dbug Macros](https://sourceforge.net/projects/dbug/files/dbug/) brought into the 21st century [age of distributed services](https://docs.honeycomb.io/getting-data-in/python/beeline/#using-a-decorator), and the tooling to create metrics from events, and [then slice and dice that in any dimension](https://docs.honeycomb.io/getting-data-in/python/beeline/#queries-to-try) without having a privileged shell on the broken system.

So yeah, let’s upgrade.
