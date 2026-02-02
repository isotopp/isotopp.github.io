---
author: isotopp
title: "MySQL: Parallel Replication"
date: 2021-11-08T13:28:27+01:00
feature-img: assets/img/background/mysql.jpg
tags:
- lang_en
- mysql
- replication
aliases:
  - /2021/11/08/mysql-parallel-replication.html
---

At work, [replication]({{< relref "2020-11-27-backups-and-replication.md" >}}) is a central feature in our MySQL Standard Architecture.

But until MySQL 5.6, replication was strictly sequential:
Even if transactions happened in parallel on a primary, they would be downloaded to the replica by the IO_THREAD into the relay log.
From there, a single SQL_THREAD would apply them, one after the other in strict binlog order.
That can lead to Replication Delay.

We had a monitor for that, [courtesy of Dennis Kaarsemaker]({{< relref "2012-09-28-mysql-replication-load-monitor.md" >}}).
That code looked at the time consumption in the SQL_THREAD, and counted the percentage of idle time over time, visualizing it in Graphite or Grafana. 

This was the amount of runway we had.
If the write-load to a specific replication hierarchy threatened to overwhelm a hierarchy, it was a candidate for a schema split.

# Execution Model

About a decade ago, MySQL as a company started to work on that problem.
The execution part of that is easy, and roughly looks like this:

![](2021/11/parallel-replication.jpg)

As before, the IO_THREAD logs into the primary and downloads the binlog, then saves it to the local disk of the replica. 
This is called the relay log.

Unlike before, the single SQL_THREAD is replaced with a coordinator thread which picks up the relay log for consumption.
It then schedules work to a number of worker threads. 
These apply the binlog to local tables in parallel.

The complicated part is to find what can be executed in parallel.
This happens in the Primary, which will mark up the binlog for parallel execution on the replicas.

# Splitting the work by schema

The low-hanging fruit is splitting work by schema.
We assume there are different schemata `a`, `b`, `c`, `d` on the Primary, and they are isolated from each other by permissions, in such way that write transactions are guaranteed to modify data only in exactly one schema.

It would allow two different write operations to different schemas on the primary to be applied in parallel, independent worker threads on the replica.

This was [`replica-parallel-type=DATABASE`](https://dev.mysql.com/doc/refman/8.0/en/replication-options-replica.html#sysvar_replica_parallel_type), and while it is enormously useful with webhosters, the use-case did not fit our environment.

Newer versions of MySQL got replica-parallel-type=LOGICAL_CLOCK, which can handle parallel execution of compatible statements within a single schema.

# Splitting the work with LOGICAL_CLOCKS

Originally, MySQL would assign each transaction in the binlog a number, starting with 1 for each binlog, the `sequence_number`. 

All transactions that were executed concurrently obviously were legal to execute in parallel, because they just did on the primary.
MySQL would choose a sequence number from that group and assign it to all of these concurrently executed transactions, the commit group number.

On the replica, transactions with the same commit group number could be executed in parallel, because they did successfully do that on the primary.

While simple and fast, this method has a number of drawbacks:

- The degree of parallelism is variable, and workload dependent.
 On a mostly idle primary, few transactions would be marked up as "able to run in parallel", because they would not run in parallel on an idle machine.
 While that would not be a disadvantage per se (low load on the primary also means low load on the replicas), it makes it really hard to calculate the runway that you still have on your replication hierarchy.
- On an intermediate primary in a multilevel replication hierarchy, the degree of parallelism cannot go up, but can go down when things that happened concurrently in the primary did not in the intermediate.
 Execution times and parallelism in the leaf replicas would degrade.

Crude hacks were invented to improve the situation with regard to the first problem: 
We could artificially delay commit on the primary using a config variable, and hope for other transactions to accumulate in the time window.
From their locking interaction we would see if they were good to be executed in parallel, and hopefully get larger parallel execution batches. 

Thus, we would slow down the primary in order to speed up the replicas.

# Logical Clocks with Dependency Trees

More modern logical clocks still number transactions in the binlog with a consecutive `sequence_number` or `sn`.
They will also assign a second number, the sequence number of an earlier transaction, `last_committed` or `lc`,  which is the most recent earlier transaction in this binary log that might be conflicting (at least that is what the server that generated the binary log assumed).

So given a binary log that looks like this:

```console
T1: sn=5 lc=4
T2: sn=6 lc=5
T3: sn=7 lc=5
T4: sn=8 lc=6
T5: sn=9 lc=4
```
we have:

- `T2` (`sn=6`) depending on `T1` (`T1` has `sn=5`, and `T2`'s `lc` is 5), 
- `T3` also depending on `T1`, 
- and `T4` depending on `T2`.
- `T6` is much later in the log, but is dependent `lc=4`, just like `T1`.

The scheduler can schedule `T1`, then must wait for `T1` to commit.
After that, it schedules `T2` and `T3` in parallel, because they do not conflict.
`T4` must wait for `T2` to complete before it can run.

The transaction `T5` can in theory be scheduled in parallel already with `T1`, but due to a limitation of the scheduler can't: The scheduler does not look ahead - any dependency boundary will act as a block. Thus, `T2` and `T4` are barriers that require everything before them to commit before the scheduler can proceed.

## Splitting the work with COMMIT_ORDER

To generate such a dependency tree, for each transaction we look at the end of the transaction, the time interval after the last statement and before the commit.
At this point in time all locks the transaction can have taken actually are taken, and they are being released at the end of the commit. 

Two transactions are non-conflicting (can be run in parallel), when their time windows with all locks being taken do actually overlap - if they had overlapping, conflicting locks, that would not be possible.

These transactions are assigned the same `lc` number.

Again, this is a short time window and the degree of parallelism is suboptimal, but at least it always works.

## Splitting the work with WRITESET

The introduction of Group Replication required the definition of Write Sets, the sets of primary keys that make up a transaction.
They can also be used to improve parallel replication markup of the binlog:

> "Two transactions with non-overlapping primary key sets can be executed in parallel."

Wait, what?
That is actually wrong, in more than one way, but it is a useful simplification for many cases. 

Two transactions are actually capable of running in parallel if their **lock sets** are compatible and non-overlapping.

In a transaction, each primary key of any row that we write to gets an X-lock, and thus these two things (primary key set and lock set) are almost, but not quite the same.

When are they not the same?

1. We may theoretically have tables without a primary key. 
 That's bad, and basically while we can lock rows, we can still have two identical rows, one locked and not. 
 We cannot handle WRITESET things for tables without primary keys (but any sensible DBA will require your tables to always have a primary key defined anyway, so that should never be an issue).
2. We may have tables with foreign key constraints, and the foreign key constraints may generate S-locks on REFERENCED rows.
 These locks in other tables may prevent other writes from proceeding.
 We cannot handle WRITESET things in the presence of foreign key constraint definitions.

So:

- with Write Sets, we can create maximally parallel dependency trees for a large number of cases, and
- with COMMIT_ORDER, we have a fallback plan when we can't.

# How parallel is our workload?

Let's write a bit of code to find that out.
You can follow along [here](https://github.com/isotopp/mysql-dev-examples/blob/master/mysql-binlog-parallel/mysql-binlog-parallel.py).

Using the `mysqlbinlog` program, we can read a MySQL binlog and extract the `lc`/`sn` pairs.
The following `mysqlbinlog | grep` will produce lines that look like this:

```console
$ mysqlbinlog -vvv binlog.654321 | grep "last_committed=" | head -3
 
#211102  8:44:24 server id 210015197  end_log_pos 475 CRC32 0x61436ace 	
    GTID	last_committed=0	sequence_number=1	rbr_only=yes
 	original_committed_timestamp=1635839064507445
 	immediate_commit_timestamp=1635839064507445	transaction_length=501
 
#211102  8:44:24 server id 210015197  end_log_pos 976 CRC32 0xb28c4330 	
    GTID	last_committed=1	sequence_number=2	rbr_only=yes
    original_committed_timestamp=1635839064507452	
    immediate_commit_timestamp=1635839064507452	transaction_length=501
 
#211102  8:44:24 server id 210015197  end_log_pos 1477 CRC32 0xca77099e
    GTID	last_committed=2	sequence_number=3	rbr_only=yes
    original_committed_timestamp=1635839064507455
    immediate_commit_timestamp=1635839064507455	transaction_length=505
```

Our code will need to grab the `lc`/`sn` pairs and store them into value objects of the Transaction type we create.
We then add the transactions to the commit scheduler:

```python
while line := sys.stdin.readline():
    m = re.search(pattern, line)
    lc = int(m.group(1))
    sn = int(m.group(2))

    t = Transaction(lc, sn)
    sched.add(t)
```

Adding a transaction with `sched.add(t)` checks if the transaction is blocked by a still open conflicting transaction. 
If that is the case, it first forces the open transactions to be committed, before it adds the new transaction to the (now empty) list of open transactions.

```python
def add(self, t: Transaction):
    wait_for = t.lc

    if self.open.get(wait_for, None) is not None:
        blocker = self.open[lc]
        if debug:
            print(f"{t=} is blocked by {blocker=}")
        self.commit()

    if debug:
        print(f"adding {t=}")
    self.open[t.sn] = t
```

"Committing" is simple: We just clear the list. 
Before we do that, we collect a number of statistics.

```python
def commit(self):
    self.sum += len(self.open)
    self.count += 1
    self.hist[len(self.open)] += 1
    if debug or incremental:
        print(f"Commit: {len(self.open)} {self.sum=} {self.count=} Avg={self.avg()}")
    self.open = dict()
```
Doing that, each time there is a conflict we collect the length of the list of parallel transactions, for a global average and also in a histogram.
If incremental is on, we emit a running update with the current degree of parallelism.

## Actual data

We have some very low traffic hierarchies such as data archives, that have an extremely low degree of parallelism - mostly because they are idle most of the time.

```console
# mysqlbinlog -vvv binlog.000058 | grep "last_committed=" | ./binlog.py
1: 631546
2: 481
3: 552
4: 300
5: 222
6: 423
7: 381
8: 184
9: 31
10: 13
11: 18
12: 9
13: 4
14: 1
15: 3
16: 3
Avg = 1.0155383957954558
Max = 16
```
The output is a histogram, so for this binlog, we had 3 instances where the open queue was 16 deep, and so on.
On the average, degree of parallelism was 1.02, and the maximum was 16.

Others, showing a more normal workload, look a bit better:

```console
# mysqlbinlog -vvv binlog.000165 | grep "last_committed=" | ./binlog.py
1: 78255
2: 69955
3: 46694
4: 30747
5: 21162
6: 15942
7: 12431
8: 9465
9: 7580
10: 6059
11: 4984
12: 4155
13: 3583
14: 3018
15: 2565
16: 2218
17: 1960
18: 1635
19: 1406
20: 1196
...
62: 1
Avg = 4.569389646418146
Max = 62
```

Here we end up with an average degree of parallelism of 4.6, and a maximum of 62.

For an internal control plane state storage, we get ~2.

And for our legacy central database, we get a whopping 18. 
That makes a lot of sense if you think about it - this is a shared database with a number of independent sets of tables that will never block each other.
That's why we are able to split it into individual smaller databases in the first place, which is what currently happens.

# TL;DR

MySQL has made great progress in being able to run parallel replication, and the work on Write Sets for Group Replication has helped tremendously with that.

Still, the degree of exploitable parallelism is workload dependent and varies a lot (20x!), depending on replication chain and also, unfortunately, time of day and month.

There are legit use-cases that have very extremely low degrees of exploitable parallelism, and any SLO on replication performance always must be made with the assumption of a "degree of parallelism=1". 

If, and how much parallelism there is, is entirely dependent on the database owner and the workload they have.
It cannot be controlled by the database operators.
