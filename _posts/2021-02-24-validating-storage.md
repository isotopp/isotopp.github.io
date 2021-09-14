---
layout: post
title:  'Validating storage'
author-id: isotopp
feature-img: assets/img/background/mysql.jpg
date: 2021-02-24 08:02:20
tags:
- lang_en
- mysql
- database
---

Where I work, we try to run databases in a memory saturated way. That is, we try to provide so much memory that the working set of the database is memory resident, or in other words, the number of disk reads after an initial warmup is no longer dependent on the database load.

![](/uploads/2021/02/workload-intelligence.png)

*Workload Intelligence Analytics showing "IOPS over time" for a mixed read/write benchmark on Datera iSCSI.*

We can validate and prove that with automated load testing: For each replication chain we single out a production host, and increase the hosts weight in the load balancer until the system load1 becomes critical. Observing the system behavior in the load test, we see the select rate load go up, but the disk reads stay largely unchanged.

We usually terminate an automated load test when around 3/4 the number of cores in the system are busy, or when the relevant accounts query latency goes out of bounds. We record the system performance at bailout, and with appropriate margins use this as a scale factor for predictive autoscaling.

We have found reactive autoscaling to be unsuitable for databases, but that is another story.

All of this is on completely autoprovisioned baremetal blades. Baremetal provides extremely little jitter in performance: There is no crosstalk from storage that is local, and there is no crosstalk from memory or CPU, because you are fundamentally alone on the box.

In a virtualized environment this changes. You gain the ability to buy and run much fatter machines, and to provide smaller database instances for services, but you need to run with distributed storage and have to live with potential crosstalk from shared infrastructure. 

So I am at the moment validating various storage systems for MySQL needs.

## Workload characteristics as fio config

I can classify my database production chains basically by write load: Read load is usually not relevant - it is drowned by local buffer pool, or by the distributed storage systems cache mechanisms.

When it is not, it is what it is, because it is too large for anything.

So my benchmark is the classical MySQL "16 KB random write is an excellent predictor for your machineries performance" benchmark. I can divide my customers into "200 commit/s", "2000 commit/s" and "whatever the machinery can provide" classes, and this results in a small `fio` configuration. 

Each section is run individually, sequentially:

```console
[global]
 size=800g
 filename=fio.0
 directory=/a/fio
 fadvise_hint=0
 blocksize=16k
 direct=1
 runtime=600
 ioengine=libaio
 time_based

[w1q1-200]
  rw=randwrite
  numjobs=1
  iodepth=1
  rate_iops=200
  rate_process=poisson

[w1q1-2000]
  rw=randwrite
  numjobs=1
  iodepth=1
  rate_iops=2000
  rate_process=poisson

[w1q1-unlimited]
  rw=randwrite
  numjobs=1
  iodepth=1

[w1q2-200]
  rw=randwrite
  numjobs=1
  iodepth=2
  rate_iops=200
  rate_process=poisson

[w1q2-2000]
  rw=randwrite
  numjobs=1
  iodepth=2
  rate_iops=2000
  rate_process=poisson

[w1q2-unlimited]
  rw=randwrite
  numjobs=1
  iodepth=2

[w8q1-200]
  rw=randwrite
  numjobs=8
  iodepth=1
  rate_iops=200
  rate_process=poisson

[w8q1-2000]
  rw=randwrite
  numjobs=8
  iodepth=1
  rate_iops=2000
  rate_process=poisson

[w8q1-unlimited]
  rw=randwrite
  numjobs=8
  iodepth=1

[w8q2-200]
  rw=randwrite
  numjobs=8
  iodepth=2
  rate_iops=200
  rate_process=poisson

[w8q2-2000]
  rw=randwrite
  numjobs=8
  iodepth=2
  rate_iops=2000
  rate_process=poisson

[w8q2-unlimited]
  rw=randwrite
  numjobs=8
  iodepth=2
```

In the `[general]` section I provide the parameters common to all benchmarks: I mount my storage into `/a` and create `/a/fio` as a test directory.

We are using the XFS file system, because we have found the commit performance in `ext4` to be highly jittery: While the best case commit in `ext4` is almost twice as good as in `XFS`, there are inexplicable sync pauses every now and then that lead to three digit ms downspikes in performance, and they ruin the MySQL experience. With XFS we get one single, fixed commit rate with almost no jitter: Stable plannable performance >> good peak performance!

In this example I am running relatively short 600s test runs, which is not suitable for a validation - they need to run an hour or longer, each, because some storage systems show phase changes after long run times. They are suitable for quick testing to zoom in into interesting scenarios, though.

I am working with direct io (`direct=1`) and the MySQL 16 KB blocksize on an 800 GB test file, using the `libaio` engine, which mirrors the MySQL use of the system pretty well.

All my test scenarios are using the same schema: `randwrite` of said 16 KB blocks, in either a single thread or with 8 threads. I am setting a queue depth of 1 or 2, to get worst case and best case performance estimates. For the rated tests, I am setting an `rate_iops` of 200 or 2000 and observe the latency behavior, and there is always also an unlimited test to establish saturated behavior. Basically, I want to estimate runway length for abuse cases.

## Collecting test data

I am running all of that with an ugly ad-hoc driver script that runs each test case recording the fio output, the iostat output during the run and running the test unter a `blktrace -d /dev/$device -D . -a issue -a complete`.

The blktrace can later be fed to [Oakgate Workload Intelligence](https://www.oakgatetech.com/applications/analytics). This is an analyzer that feeds on blktrace and other input and plots device behavior over time, generates histograms and generally gives insight into storage behavior. The system can also use recorded workloads from real world applications and replay them for synthetic benchmarks to be run on new storage systems.

The ugly little bash driver, which will soon be a proper piece of Python:

```bash
#! /bin/bash

# drive under test
drive=sdb
fio=$HOME/fio.cfg

# yes, ugly
pause=3

jobs=$(awk '/\[/ && ! /\[global\]/ { print substr($0, 2, length($0)-2); }' $fio )

mkdir $drive
cp fio.cfg doit $drive

for i in $jobs
do
    echo "Running Job $i $(date)"

    # make a working dir, and run blktrace and iostat in it
    [ -d $drive/$i ] && rm -rf $drive/$i
    mkdir $drive/$i
    until [ -n "$blktrace_pid" ] && sudo kill -0 "$blktrace_pid"
    do
        ( cd $drive/$i; sudo blktrace -w 700 -d /dev/$drive -D . -a issue -a complete ) &
        blktrace_pid=$!
        sleep $pause
    done

    ( cd $drive/$i; iostat -x -k 10 > iostat.log ) &
    iostat_pid=$!

    echo "Blktrace: ${blktrace_pid} Iostat: ${iostat_pid}"
    sleep $pause
    fio --section=$i $fio | tee $drive/$drive-$i.run
    sleep $pause

    kill ${iostat_pid}
    sleep $pause
    pkill iostat

    while sudo kill -0 $blktrace_pid
    do
      echo "Blktrace $blktrace_pid still running."
      sleep 1
    done
    sleep $pause
    ( cd $drive; tar cvzf $i.tgz $i )
    rm -rf $drive/$i
done
```

I end up with a directory named after the drive under test, containing the entire description of the test environment, plus subdirectories for each scenario, containing all recorded data. I can tar that up and carry it home for analytics.

## Example graphs

I am mostly interested into the behavior of the system along "IOPS over time", "Latency over time" and "Latency histogram".

Looking at the unconstrained, single threaded, queue depth=2 cases I get a relatively representative quick overview over the result:

![](/uploads/2021/02/all-results.png)

*Ceph has a commit latency of around 1.1ms, which at a queue depth of 2 results in around 1800 IOPS. Datera has a commit latency of around 0.17ms, which results in around 9000 IOPS, but with nasty downspikes to some 6500ish IOPS.*

The benchmark is a bit unfair, because we compare an extremely large and extensively optimized Ceph production cluster against a 3-node minimal out-of-the-box Datera. The Datera produces a number of nasty downspikes, which would not happen in a tuned and larger production cluster. It can already be seen that the Datera has an almost, but not quite, 10x advantage in commit latency.

It can also be somewhat seen the Ceph driver can leverage multiple queues (and that is confirmed in other benchmarks): It should produce around 900 IOPS at 1.1ms commit latency, but at a queue depth of 2 it produces 2x that.

iSCSI cannot do that out of the box: We need to install [blk-mq](https://www.kernel.org/doc/html/latest/block/blk-mq.html) and see what that does, or use something that does NVME over Fabric over TCP instead. Both these things have multiple queues, and would also be able to take advantage of deeper queues to NVME backends.

More work would have to go into building out the Datera cluster, and configuring it properly to properly show its real strength, but already it wipes the floor with the Ceph with respect to commit latency.

It also shows that the Ceph can carry the "200 commit/s" workload class without problems. One will have to make compromise with runway length ("Time for warning and migration when workload grows") and with replication delay and catchup SLOs - customers will either have to accept more delay and longer catchup times, or accept that the cluster will run in YOLO mode in catchup (`innodb_flush_log_at_trx_commit=2` until replication has caught up).

There is probably little chance to run the "2000 commit/s" workload class in a stable way on Ceph, until one can make guarantees about queue depths and parallel writes.

Both systems max out at around 20000 commit/s when run in their respective "ideal" mode, which happens to be the commit latency to a single flash drive.

Interestingly, [NVME does not matter much here]({% link _posts/2019-06-13-adventures-in-storageland.md %}): NVME can offer 40x more IOPS than SATA SSD, but individual commits will still be at about the same speed as with SATA. You need 40x parallel access to eat all the buffet on offer.

To drive Ceph to 20.000 IOPS, you will have to run 16 threads at a queue depth of 2 (or 32 threads at queue depth 1) consistently, feeding all the driver queues in parallel. This is not a kind of workload a transactional system can easily produce.

To drive Datera to 20.000 IOPS, two or three threads running unlimited will suffice. This is still hard on a transactional system, but a doable challenge.

While the recommendation is clear ("Use Datera over Ceph for transactional distributed storage"), it is interesting to see how Ceph has matured and does no longer completely suck at doing small transactional workloads.
