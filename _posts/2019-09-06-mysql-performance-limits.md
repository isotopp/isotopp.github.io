---
layout: post
title:  "MySQL Performance Limits"
author-id: isotopp
feature-img: assets/img/background/mysql.jpg
date:   2019-09-06 15:30:14 +0200
tags:
- mysql
- performance
- mysql8
- "lang_en"
---
The last time I saw a MySQL server operating at a performance limit
was in 2012. Back them we had a production master on (then) current
hardware, running stable at about 21000 QPS. At 24000 QPS it tended
to become unstable and fall over, dying in global locks on the
InnoDB Adaptive Hash Index or other global locks.

I need to better understand how MySQL works today, and what the limits
are on a box that is considered large in 2019.

# What do I expect?

Well, boxen are a lot larger than they have been in 2012, and
we invented NVME and Flash Storage since then.

I expect MySQL to be able to eat the full box I am throwing at
it and not die in locks. I also expect the performance levels
I can reach to be scaling with the query execution times I observe
in production times number of cores.

I do observe appro. 1/3 ms query execution time on the queries
I simulate here, in production. So I would like to see about
3000 QPS per core. With a 64 core box, that would be around 200k QPS,
easily 10x-ish more than in 2012.

# What did I get?

This is all read testing of a memory resident data set. Other testing
to follow.

After some woes described below, I got 200k QPS or better in all
cases, for simple PK lookups in fact almost 2x as much.

SK lookups are about 1/2 as fast as PK lookups or faster, allowing
for "one level of indirection".

MySQL 8 scales well enough to eat all of a 64 core box with 1/2 TB
of RAM without choking or locking up or being otherwise jittery. It
is adequate for any hardware that in 2019 we can reasonably throw at
it. From a 2012 PoV this is an awesome achievement.

# The box

So my current test box is an single socket AMD 7702 (64C, HT off)
with 512G of memory and

```bash
# nvme list
Node             SN                   Model                                    Namespace Usage                      Format           FW Rev
---------------- -------------------- ---------------------------------------- --------- -------------------------- ---------------- --------
/dev/nvme0n1     39X0A05ZTZZF         KCM51VUG800G                             1          27.79  GB / 800.17  GB    512   B +  0 B   3006T21F
/dev/nvme1n1     29X0A00CTZZF         KCM51VUG800G                             1          27.79  GB / 800.17  GB    512   B +  0 B   3006T21F
/dev/nvme2n1     2950A00FTZZF         KCM51VUG800G                             1          27.79  GB / 800.17  GB    512   B +  0 B   3006T21F
/dev/nvme3n1     39X0A067TZZF         KCM51VUG800G                             1          27.79  GB / 800.17  GB    512   B +  0 B   3006T21F
/dev/nvme4n1     39X0A060TZZF         KCM51VUG800G                             1          27.79  GB / 800.17  GB    512   B +  0 B   3006T21F
/dev/nvme5n1     39X0A069TZZF         KCM51VUG800G                             1          27.79  GB / 800.17  GB    512   B +  0 B   3006T21F
/dev/nvme6n1     39X0A06ETZZF         KCM51VUG800G                             1          27.79  GB / 800.17  GB    512   B +  0 B   3006T21F
/dev/nvme7n1     39X0A05LTZZF         KCM51VUG800G                             1          27.79  GB / 800.17  GB    512   B +  0 B   3006T21F

# vgcreate kristest /dev/nvme{0..7}n1
# lvcreate -n mysql -L4T -i8 kristest
# mkfs -t xfs /dev/kristest/mysql
```

I then run the performance-datagen.sql script to create a test table
kristest.t, and then run performance-querygen.py to create a file
with test queries, file.sql.

mysqlslap then does

```bash
mysqlslap --user=kristest --password='<secret>' --host=localhost --concurrency=64 --iterations=20000 --create-schema=kristest --verbose --query=./file.sql
```

and I observe the running test with `innotop -d1 -mQ` and `innotop -d1 -mC`.


# Findings

## MySQL 8.0.16, Binlog, ROW, MINIMAL, Buffer Pool 384G

For all tests:

```bash
$ du -sh /mysql/kristest/data
87G
```

```mysql
root@localhost [kristest]> select count(*) from t;
+-----------+
| count(*)  |
+-----------+
| 134217728 |
+-----------+
1 row in set (6.13 sec)
```

### Testmodes 1

```
testmodes = [ 1 ]

VSZ 421G
RES 32.8G
load average: 63.52, 61.70, 59.23
QPS 384k
```

### Testmodes 1, 2

```
testmodes = [ 1, 2 ]

VSZ 421G
RES 34.3G
load average: 63.82, 64.89, 61.63
QPS 270k-320k
```

### Testmodes 1, 2, 3

```
testmodes = [ 1, 2, 3 ]

VSZ 421G
RES 88.4G
load average: 64.10, 57.94, 56.72
QPS 5.5k-6.2k
```

There is a distinct warmup phase during which the box is not
saturated and Read I/O can be observed. When the RES approaches
disk size, this disk traffic ceases and final load and final
QPS ratings are achieved.

### Testmodes 1, 2, 3, 4

```
testmodes = [ 1, 2, 3, 4 ]

VSZ 421G
RES 94.6G
load average: 65.91, 63.10, 59.75
QPS 407-1002 (yup, no "k", this is as low as 407 QPS)
```

```mysql
root@localhost [kristest]> explain select * from t where i1 in ( 64419,37384,17490,7919,42137,70137,56196,54754,70263 );
+----+-------------+-------+------------+-------+---------------+------+---------+------+-------+----------+-----------------------+
| id | select_type | table | partitions | type  | possible_keys | key  | key_len | ref  | rows  | filtered | Extra                 |
+----+-------------+-------+------------+-------+---------------+------+---------+------+-------+----------+-----------------------+
|  1 | SIMPLE      | t     | NULL       | range | i1            | i1   | 4       | NULL | 12674 |   100.00 | Using index condition |
+----+-------------+-------+------------+-------+---------------+------+---------+------+-------+----------+-----------------------+
1 row in set, 1 warning (0.00 sec)

root@localhost [kristest]> select * from t where i1 in ( 64419,37384,17490,7919,42137,70137,56196,54754,70263 );
...
| 134777240 | 95ab0836-c97e-11e9-b92c-98039bbd64c8 | 95ab0838-c97e-11e9-b92c-98039bbd64c8 | 95ab0839-c97e-11e9-b92c-98039bbd64c8 | 95ab083b-c97e-11e9-b92c-98039bbd64c8 | 95ab083c-c97e-11e9-b92c-98039bbd64c8 | 95ab083e-c97e-11e9-b92c-98039bbd64c8 | 95ab083f-c97e-11e9-b92c-98039bbd64c8 | 95ab0841-c97e-11e9-b92c-98039bbd64c8 | 95ab0842-c97e-11e9-b92c-98039bbd64c8 | 95ab0844-c97e-11e9-b92c-98039bbd64c8 | 70263 | 27807 | 28246 | 57810 |  4313 | 48136 | 27740 | 94290 | 88230 | 58281 |
...
12674 rows in set (0.38 sec)
```

# Increase selectivity

In our testing above, we see that the cardinality of i1 is 100k, and
the table size is 128m. That's 1280 result rows on the average for
a random value of i1.

We also observe that testmode 4 results ask for 2-11 values of i1 or i2,
where testmode 3 results ask for a single value of i1 or i2. The average
number of testmode 4 values we ask for is 6, and testmode 4 happens
to be 6x slower.

So it might be that the number of result set rows is determining the
query speed.

We can test: We increase the cardinality of i1 to match id, 128. And
for i2 we are going up to 256m cardinality.

## The slow way

Modify the dataset:

```mysql
root@localhost [kristest]> update t set i1 = rand() * 134937574, i2 = rand() * 134937574 * 2;
Query OK, 134217728 rows affected (1 hour 53 min 17.46 sec)
Rows matched: 134217728  Changed: 134217728  Warnings: 0
```

During the execution of that update statement, we see an aggregate write
load of 320 MB/s (~40 MB/s per NVME). This is not very high. It needs to
be tested with more write benchmarks, later.

Also, there are four INDEX() definitions active on t, i1, i2, c1 
and c2, two of which are being updated.

This is not fast, either, and this is the n00b way of doing things. We
redo this again, differently:

## A faster way

```mysql
root@localhost [kristest]> alter table t drop index i1, drop index i2;
Query OK, 0 rows affected (1 min 46.85 sec)
Records: 0  Duplicates: 0  Warnings: 0
root@localhost [kristest]> update t set i1 = rand() * 134937574, i2 = rand() * 134937574 * 2;
Query OK, 134217728 rows affected (26 min 5.07 sec)
Rows matched: 134217728  Changed: 134217728  Warnings: 0
root@localhost [kristest]> alter table t add index (i1), add index (i2);
Query OK, 0 rows affected (6 min 23.04 sec)
Records: 0  Duplicates: 0  Warnings: 0
```

TBH, I'd expect MySQL by now to do bulk index updates in mass ALTER tables
quicker than 'the slow way' in 2019. OTOH, that is probably stuff that
you get when you pay for Red Oracle instead of Blue.

## Testing with selective i1, i2

Now i1 and i2 are much more selective, and instead of 12k result rows,
a search on i1 should on the average return 1 row, on i2 even 0.5 rows. 
Let's see how that affects runtimes up SK lookup queries (testmode 3, 4).

Let's rerun everything, starting with a cold mysqld again, so that I
do get proper memory sizes as well.

```bash
# du -sh /mysql/kristest/data
94G     /mysql/kristest/data
```

### Testmodes 1

```
testmodes = [ 1 ]

VSZ 421G
RES 32.8G
load average: 64.14, 43.67, 20.08
QPS 360k-420k
```

### Testmodes 1, 2

```
testmodes = [ 1, 2 ]

VSZ 421G
RES 33.8G
load average: 60.36, 56.82, 39.73
QPS 280k-330k
```

### Testmodes 1, 2, 3

```
testmodes = [ 1, 2, 3 ]

VSZ 421G
RES 34.6G
load average: 58.61, 58.29, 55.80
QPS 200k-320k (very jittery)
```

Did not reach load 60+, even after long warmup and with 0 I/O.
Some i2 queries can return 0 rows, might be the cause?

### Testmodes 1, 2, 3, 4

```
testmodes = [ 1, 2, 3, 4 ]

VSZ 421G
RES 35.6G
load average: 67.68, 63.57, 58.80
QPS 210k-260k
```

After an even longer wait, performance jitters way less and stabilizes
around 248k with a jitter of <10k in both directions. Warmup times
for this size of hardware and this amount of memory are insane.

And with our changes:

```mysql
root@localhost [kristest]> explain select * from t where i1 in ( 64419,37384,17490,7919,42137,70137,56196,54754,70263 );
+----+-------------+-------+------------+-------+---------------+------+---------+------+------+----------+-----------------------+
| id | select_type | table | partitions | type  | possible_keys | key  | key_len | ref  | rows | filtered | Extra                 |
+----+-------------+-------+------------+-------+---------------+------+---------+------+------+----------+-----------------------+
|  1 | SIMPLE      | t     | NULL       | range | i1            | i1   | 4       | NULL |   22 |   100.00 | Using index condition |
+----+-------------+-------+------------+-------+---------------+------+---------+------+------+----------+-----------------------+
1 row in set, 1 warning (0.00 sec)
root@localhost [kristest]> select * from t where i1 in ( 64419,37384,17490,7919,42137,70137,56196,54754,70263 );
...
| 116937151 | 68da9462-c97e-11e9-b92c-98039bbd64c8 | 68da9464-c97e-11e9-b92c-98039bbd64c8 | 68da9466-c97e-11e9-b92c-98039bbd64c8 | 68da9467-c97e-11e9-b92c-98039bbd64c8 | 68da9469-c97e-11e9-b92c-98039bbd64c8 | 68da946a-c97e-11e9-b92c-98039bbd64c8 | 68da946c-c97e-11e9-b92c-98039bbd64c8 | 68da946d-c97e-11e9-b92c-98039bbd64c8 | 68da946f-c97e-11e9-b92c-98039bbd64c8 | 68da9470-c97e-11e9-b92c-98039bbd64c8 | 56196 |  74380528 | 81571 | 57401 | 42293 | 39260 | 69425 | 29342 | 38434 |  4147 |
...
15 rows in set (0.00 sec)
```

Yes, optimizer estimates can be a bit off. Still, the point is being
made: Cardinality is up, result set size is down, performance returns.

We have been looking at a result set size/selectivity problem, not at
sucky handling of SK in InnoDB.
