---
author: isotopp
title: "MySQL: Straight lines"
date: 2022-09-08T12:13:00Z
feature-img: assets/img/background/mysql.jpg
tags:
- lang_en
- mysql
---

A database is showing replication delay, and so are all the other instances of the same replication hierarchy, all of which reside in Openstack.

![](/uploads/2022/09/straight-01.png)

*Shortly before 21:30 the database begins to lag, until around 23:45, when it starts to catch up, slowly. After 00:30, we gain delay again, plateau and then around 01:45, we catch up.*

The database is moving deep into replication delay sometimes.
It does not do that on bare metal.

# Ground Truth

The VM is a nice hardware blade simulation, 16C/32T, 128 GB of memory.

The data is on persistent volume backed by Ceph.

```console
# df -Th /mysql/<hierarchyname>/
Filesystem                Type  Size  Used Avail Use% Mounted on
/dev/mapper/vg00-mysqlVol xfs   1.8T  1.1T  766G  58% /mysql/<hierarchyname>
# vgs
  VG    #PV #LV #SN Attr   VSize VFree
  sysvm   1   8   0 wz--n- 1.75t 121.27g
# du -sh /mysql/<hierarchyname>/*
0       /mysql/<hierarchyname>/coredumps
1017G   /mysql/<hierarchyname>/data
24G     /mysql/<hierarchyname>/log
0       /mysql/<hierarchyname>/tmp
```

This database does not fit into the buffer pools:
The working set is too large.
We see read traffic in a warmed up database, at a rate of several dozen MB/s.

Checking in on `information_schema.tables`, the two largest tables of this database are around 200 GB in size, each.
They seem to be accessed in full, there is little or no exploitable locality of reference.
So in order to quench these reads, we would need to supply three times the memory, 384 GB.
Since we can't, we need to handle the I/O instead.

Let's have a look at the I/O:
When you run iostat, use `iostat -x -k 10`, and discard the first output.
It contains the data collected since system boot, a very large average interval.
We want a clean 10s sample instead.

The paste:

```console
Device            r/s     w/s     rMB/s     wMB/s   rrqm/s   wrqm/s  %rrqm  %wrqm r_await w_await aqu-sz rareq-sz wareq-sz  svctm  %util
sdc           4302.00  348.00     67.22      1.22     0.00     0.00   0.00   0.00    1.24    1.91   6.00    16.00     3.58   0.21  99.70
sdb              0.00    0.00      0.00      0.00     0.00     0.00   0.00   0.00    0.00    0.00   0.00     0.00     0.00   0.00   0.00
sda              0.00    4.00      0.00      0.02     0.00     0.00   0.00   0.00    0.00    2.50   0.01     0.00     4.00   2.75   1.10
loop0            0.00    0.00      0.00      0.00     0.00     0.00   0.00   0.00    0.00    0.00   0.00     0.00     0.00   0.00   0.00
dm-0          4304.00  347.00     67.25      1.21     0.00     0.00   0.00   0.00    1.24    1.93   6.02    16.00     3.58   0.21  99.70
```

We see the busy drive being sdc, the persistent volume.
We see increased service times (`r_await`, unit ms), and queues (`aqu-sz`, unit is "average number of requests in  queue, during the observation interval", which is 10s). 

We also see around 4300 read requests/s and 67 MB/s read traffic.

# I know that smell

Some previous experience in other projects suggests that a crucial piece of information may be missing.
This replication chain is no longer on bare metal, but is running on Openstack.
All traffic to disk in Openstack is quota-ed.

Any I/O problem on Openstack is undebuggable, unless you know the Quota affecting you.
Indeed:

```console
# openstack volume qos show <uuid>
+--------------+----------------------------------------------------+
| Field        | Value                                              |
+--------------+----------------------------------------------------+
| associations | standard-iops                                      |
| consumer     | front-end                                          |
| id           | <uuid>                                             |
| name         | 200MB/s-3000iops                                   |
| properties   | total_bytes_sec='209715200', total_iops_sec='3000' |
+--------------+----------------------------------------------------+
```

We have an allowance for a maximum of 200 MB/s and a maximum of 3000 IOPS.
Measured in the system we see an ok bandwidth of 67 MB/s, but the IOPS hit the roof.

When we zoom in on a phase of replication delay in the Single Instance Info Panelof our grafana, we get to the bottom of that straight away.

Replication delay interval:

![](/uploads/2022/09/straight-01.png)

At the same time:

![](/uploads/2022/09/straight-02.png)

When we have replication delay, we see a straight line in the sum of dm-reads for 70-ish MB/s.
This is well below quota.

Looking at the IOPS:

![](/uploads/2022/09/straight-03.png)

This is the sum of all dm-Reads, and we only are interested in the reads for our device.
But we do see a straight line, and taht suggests some kind of limit or resource exhaustion.
Also, the line is at around 4000 read/s vs. a Quota of 3000 IOPS.
Together that suggest we run into resource depletion in the IOPS dept here.

Is that bad?

![](/uploads/2022/09/straight-04.png)

The observed statement latency for the production user goes up from a minimum 348 ms to a max of 37100 ms (37.1s).
That is approximately 100x worse than normal.

The observed statement latency is also jumping rapidly up and down.
System performance is not only bad, but also wildly unpredictable, with high frequency swings across a wide corridor.

This is often indicative of a token bucket quota mechanism getting into resonance with the evaluation cycle of the token bucket itself:

Load is running away and then then Quota eval check cycle comes and bites down hard on the system over quota, essentially halting it.
The system stops, because a database without I/O is doing nothing.
It then accumulates new performance tokens in the token bucket, and in the next cycle executes, immediately draining the token pool and running over Quota.
Then the the cycle repeats.

Maybe it is less noisy if the quota is applied with `consumer=backend`.

All expectations the user may have on performance are broken and the system may as well be offline.
Also, the variance in performance may create input signal spikes dependent systems, affecting their performance if there is resonance.

Without being aware of Quota limits and checking for them this is nearly undebuggable, and sometimes you may be looking at secondary effects downstream from the affected system.
With proper metrics and knowledge of the Quota it is plain obvious.

# Be wary of straight lines in performance graphs

> Load is spiky, straight lines do not exist
>
> This is a general truth for our systems: 
> In general our load is spiky. 
> It has peaks and valleys, and there are no plateaus or straight lines (outside of Kafka and other Queues and the systems fed by them).
>
> That is, if you see a straight line, I see a resource being exhausted and limiting system performance.

In this case, the exhausted resource is IOPS quota.

In other cases in the past, a straight line in dirty buffer pool pages graph was signaling exhaustion of the redo log space, or similar performance choke points.

