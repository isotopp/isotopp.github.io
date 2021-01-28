---
layout: post
title:  'Database as a Queue'
author-id: isotopp
feature-img: assets/img/background/mysql.jpg
date: 2021-01-20 08:02:20
tags:
- lang_en
- mysql
- mysqldev
---

The DBA experience at work suggests that every single schema at some point in its lifecycle holds a queue table. These are tables in which some processes (the “producers”) put rows, which a swarm of other processes (the “consumers”) lock and consume.

A variation on that theme is the state machine, in which jobs are placed by producers. Consumers do not immediately delete them, but update them a few times to indicate processing progress, before the rows are ultimately being deleted.

Another variation is using the search and sort capabilities of the database to fetch jobs from the queue out of order (“queue with lookahead and selective dequeueing”), while still maintaining the exactly-once semantics.

## Using a database as a queue can be ok-ish

Using a database as a queue is not wrong, up to a point:

- You get ACID semantics. That means your updates are atomic and isolated, transactional, and they are durable, persisted to disk. This makes it possible to build queues with “exactly once” execution semantics, which is a thing developers like a lot.
- You already have a database handle, and you already understand your ORM, so you do not have to pile on more dependencies and you do not need to learn additional technologies.

Now, once you pass “the point” in that “up to a point” phrase, things get nasty:

“Exactly once”  semantics are really expensive to implement: They require that each insert, delete or update is associated with a transaction, which in turn is associated with a disk write. 

You get to enqueue, dequeue and state change your things exactly as quickly as a single server can flash its disk lights, and in the next step, as quickly as your replication hierarchy can pass on things downstream.

On baremetal, that costs you a bit, but because baremetal gives you awesome amounts of capacity with very little jitter for very reasonable amounts of money, we can bear quite a bit of this work.

In the cloud, using a database-as-a-queue is approximately equivalent to pouring petrol on money and throwing a match. It is the wrong technology for that kind of workload in that environment from the get-go.

## Not using databases as queues

### Replayability

One specific property of the above setup that is expensive, and hard to reproduce outside of a transactional database is the exactly-once thing. “At most once (maybe never)” or “at least once (maybe multiple times)” are alternative queue semantics that are much cheaper to implement, because they allow you to get rid of disk writes, and also of many disk seeks.

Kafka for example gives you “at least once”: You get to consume a stream, and you can jump backwards and re-consume what you already saw, in order, no searching. The jump backwards is possible for a small time window of a few hours or a day, or whatever other deal you can make with the Kafka team.

Reading the same item multiple times is not a problem if the jobs in the queue are idempotent, that is, replayable.

Not replayable are relative updates: “set x = x + 1”, “add order to table, give me the ordernumber”.

Replayable are absolute updates: “set x = 7” (you read 6, did the math and enqueued 7), “add order 17372 to order table” (you made an order number beforehand and push the order into the queue with an already fixed identity).

Basically, to make things idempotent, you need to give them either fixed identities so that you can remember if you saw things before, or you need to make the writes absolute instead of incremental, or both.

So if you find a way to group your jobs into transactions, and make all individual operations in your transaction replayable, you could push the entire stream through Kafka and it would be cheaper. Much cheaper, in fact, in a cloud environment.

### Re-queuing and sorting

If you use a queue table with selecting and sorting (“queue with lookahead and selective dequeueing” from above), you can look into consuming a block of things from your input queue and splitting them into multiple streams or different topics, or maybe sort them and re-queue them.

So basically, instead of pushing things into a single queue and then grabbing items out of order, you can consume the input in blocks, perform your intermediate selection and sorting process and them push to multiple outputs.

Again, the result can ride on Kafka instead of MySQL and would be more cloud-compatible.

### Re-queuing updates

For the state machine use-case you would have to solve writing updates to a base record, before it is finally consumed in total.
Your state machine would be eating one item from the input, perform the associated action, and then push the updated record back into the same, or a different queue.

## What if I don’t?

### Undo Log woes

In [A Blast From The Past]({% link _posts/2019-11-18-a-blast-from-the-past.md %}) we see what happens to MySQL with long running transactions, and in [MySQL Transactions]({% link _posts/2020-07-27-mysql-transactions.md %}) we discuss what goes on internally in the database when we do transactions, and especially how that can be painful if these transactions are long running.

Note that any database will at some point in time have long running transactions, even if your code does not. Database maintenance operations such as cloning replicas or making backups can do that without interruption only by maintaining a read view, which leads to Undo Log explosion.

So queue-as-a-database will eventually explosively grow the undo log, or individual tables, and disk space from these structures is hard to reclaim by the operating system. You will run at some point in time into disk space problems from churn, even if the absolute amount of data is small.
Binlog woes and Replication Delay

In a replicated MySQL changes to any table (also queue tables) are written to the binlog, which is being kept for a few days for point in time recovery and for replication. This uses disk space.

Note that any write is binlogged, even deletes. So when you delete data, you have less disk space (because deletes are binlogged), until after a few days the binlog is purged.

The binlog is being consumed by replicas as close to realtime as possible. But if you write too much, again, it is possible to overwhelm the replicas, and you will experience replication delay.

If your producers write to the replication primary, but your consumers read from the replicas, replication delay will add additional latency. You will be unhappy (and see Kafka, above).

## This is per-instance

It is also important to remember that this is per-instance, not per-table, and also not per-schema. The purge thread looks at transactions, not at schemas or tables. In a transaction, a number of changes to the instance can happen, atomically.

So imagine a shared mysqld process that has 1000 customers with different schemas, all of them unrelated, and one of them opens a transaction and keep it open for four hours. The purge thread will stop for all of the customers, because in theory it is possible to have a single transaction that spans all 1000 customer’s schemas.

The undo log will grow out of bounds, and all 1000 customers will experience slow queries. 

This is how you denial-of-service a shared MySQL with no effort or expense at all.

## What should I do? And what is the limit?

As a developer, you want to write an application and get it going without piling on a lot of dependencies or learning too many technologies, or dealing with limitations such as unreliable or repeated queue deliveries.

MySQL can deliver such things, up to a point.

That is okay for a prototype. If you implement queues, state-machines or other rapidly writing structures in a MySQL, you should monitor transaction volume and prepare an escape strategy early, and implement that in time. Tech debt is okay, if it is managed properly.

- As a benchmark, and for comparison: At this point in time, one specific application at work processes around 7-10 million auto-increment values per replication hierarchy per hour, with several updates per row. That is where we run into operational toil due to pushing the envelope.
  - That is around 3.000 new rows per second, and a multiple of that with updates. 
- An unconstrained baremetal SSD can do around 20.000 commits per second in hardware.
  - That is why we run into operational toil with 3.000 new rows (with multiple updates per rows) per second with said application.
- Our replication assumes around 2.000 transactions/s as minimum capability.
  - We can batch up some things and apply them in parallel, if the transaction structure allows that. That is why replication does not lag, even if the primary does more than 2.000 txn/s. How much parallel replication can help here is completely dependent on the ordering constraints imposed by the transactions themselves.

In the cloud, the limits are likely to be much lower, depending on instance and volume sizes chosen, and going there is a solid cost item. 

You will need to look at things with a much sharper lens.
