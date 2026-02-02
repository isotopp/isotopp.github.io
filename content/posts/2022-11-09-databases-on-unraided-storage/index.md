---
author: isotopp
title: "Databases on un-RAID-ed storage?"
date: "2022-11-09T06:07:08Z"
feature-img: assets/img/background/mysql.jpg
tags:
- lang_en
- mysql
- mysqldev
aliases:
  - /2022/11/09/databases-on-unraided-storage.md.html
---

Where I work, we run bare-metal databases on non-redundant local storage.
That is, a database is a very cheap frontend blade server.
It has 2 CPUs, with 8 cores/16 threads each.
It contains 128 GB of memory, 2 or 4 TB of local NVME and it has a 10 GBit/s network interface.
It costs around 120 to 150 Euro per month to run for 5 years, including purchase price and all datacenter costs.

It AWS terms, it is comparable to a EC2 m5.8xl, or better an i3.4xl, but with more CPU.

Data is stored on a local disk, preferably NVME, sometimes SSD, because we still have old hardware.

The local disk provides unmatched low latency, at incredibly low overhead (1 TB of data uses 1 TB of physical disk space) and at unmatched power consumption (a NVME drives adds about 10W to an already existing machine).

The [purchase cost of a NVME drive](https://blocksandfiles.com/2020/08/24/10x-enterprise-ssd-price-premium-over-nearline-disk-drives/) can be as low as 150-200 Euro/TB for Enterprise grade hardware.

# Is it not risky to run on non-redundant storage?

At work, we need to run our databases in replication hierarchies, to provide the required read capacity and to provide read capacity close (in the same AZ) to the clients.

![](2022/11/unraided-01.jpg)

*Our database replication happens in trees, which extend across multiple AZs and backing-technologies. (bare-metal, Openstack, ...).
They are marked in different colors.
Writes go to the root of the tree on the left.
They then replicate within fractions of a second down to the leaves at the right.
Each replica provides a full copy of the data in a shared-nothing architecture, for read-scaleout.
Applications find read-copies of the data close by, in the AZ they run in, and at the required capacity.*

The image is a screenshot from Orchestrator, a tool that manages MySQL replication hierarchies.
This is showing one particular hierarchy, but they all have this shape.

We are using MySQL replication for read-scaleout (and for a few other things, such as backups, as clone sources to make more replicas, for data import to Hadoop, and so on).
Using "Global Transaction ID based replication" (GTID) and Orchestrator, we are leveraging the redundancy required for read-scaleout also to provide high-availability.

# So how do we survive?

If a Primary dies, we detect that.
We then automatically promote any Intermediate Replica to a new Primary, rearranging the replication hierarchy as we go.
In the end, all Replicas now ultimately dangle from the newly promoted Primary.

The GTID-based way of using read-scaleout capacity for high-availability has many advantages.
Not only do we get to use local storage, we can also use throwaway frontend blades instead of much more expensive special database hardware as we did in the olden times.

We also get intermediate replicas promoted to primaries, which means that these machines have already warmed up caches and are useful immediately after promotion, at normal speed.

Compare that to the situation of old (many years ago):

- **Now cheaper:** We needed to have special database machines with special hardware. So we needed to provision machines from a much smaller hardware pool, instead of living inside the big frontend hardware pond.
- **Now more redunancy:** We failed over between a single active-passive database pair, instead of being able to promote any replica that has a binlog to a new primary as we do now.
- **Now faster:** Also, the previously passive database had an ice-cold cache. Warming up to minimum speed took around 5 minutes, warming up to normal performance took around 20 minutes. That meant, during a switchover database performance was severely impeded for at minimum 5 minutes, and somewhat impeded for 20 minutes.
- **More flexible every day:** We were unable to fail between arbitrary machines, and unable to rearrange the replication tree freely, because without GTID-based replication such a thing is doable only manually, and a high risk operation.

That last thing is important: ability to freely rearrange the replication tree  allows us to speed up many daily operations that otherwise would be subject to many more constraints.
Among them are fast version upgrades, moving capacity between pools and many other daily operations that allow us to provide "just one more replica than you need" in time and without much toil.

# Distributed Storage

Local Disk has limits.
Mostly, size limits: Our servers come with 2 TB or 4 TB of space.
Larger hardware exists, but in limited numbers and it is spoken for by other teams.

A larger database is often stored on distributed storage.
That is, it resides on a Filer, and is attached usually with iSCSI ("SCSI protocol over TCP/IP over an Ethernet wire"), or sometimes NVME-over-Fabric/TCP (that is, the NVME PCI bus protocol over TCP/IP over an Ethernet wire).

Because volumes of distributed storage are made by a Filer by combining large disks to even larger volumes, they can be of almost arbitrary size.
So if you need more than can be provided by a Blade with local storage, you need to move to iSCSI storage.

This is much like going from an i3 instance with local storage to a m5 instance with EBS, in flexibility, but also in cost: You now need to pay for the Blade and for the storage, in the same way you pay for the instance and the EBS.

## Different Latency

You are likely also taking a latency hit: While you can hit a local storage at 1/20,000 s access time, with distributed storage there is one or more network hops involved, and worse, a lot of software and storage redundancy overhead at the destination.

You can expect more of 1/2,000 s access time than 1/20,000 s, so you are roughly one order of magnitude slower.
How much exactly depends a lot on the Filer implementation you are on.

## More Variance

You may also take a jitter hit: The latency of distributed storage is often not only higher, but also more variable.
If you are not pushing the limits of what is possible, that is often not an issue, but for some latency-sensitive applications it may well be.

## Filer Storage Overhead

Distributed storage also comes with some overhead in the sense that there is storage duplication at the filer end: 1 TB of database will never be 1 TB of disk space, but always more.

How much exactly very much depends on the Filer implementation, and on how much additional latency from software trickery you can tolerate.
For example, most filers will store data in some kind of RAID, so there will be an overhead of 3x (everything is stored three times in HDFS and Ceph by default), of 2x (a simple RAID-1) or of 1.something (a RAID-5/6/x or Hadoop Erasure Coding).

Some Filers will, at the cost of additional latency, also offer data compression, or data deduplication.

Filers are, in essence, just computers with very many hard disks and very good Ethernet interfaces. 

So you need to add the run-cost of these computers to the run-cost of the drives, amortized over the number of drives per Filer-computer: A Filer with 24 drives per computer has less overhead than a Filer with only 4 drives per computer.

## Volume Lifetime, Volume Mobility, Snapshots

A Filer on the other hand offers a number of advantages over Local Storage that are mostly interesting if the amount of data is so large that it takes very long to copy:

- A volume on a Filer is mobile.
  It can be detached from an instance and attached to another instance.
  This allows for upgrades of a compute unit (larger, new OS, software upgrade) without having a need to copy around the data.
  At sizes over 10 TB such a copy operation can take hours or days, but with volume detach/attach no copy is necessary.
- A volume on a Filer has a lifetime independent of the instance/the compute.
  This allows not only for the above mentioned upgrades, but also for filer-side operations, such as making a snapshot or a copy of the volume at the filer-side.
  This is usually much faster than loading the data off the volume, over the network, and pushing it over the network again to another machine.
- Filer-side operations include snapshotting and cloning, which can be combined in interesting ways to make data available for backups and new instances with a lot less wait than a full copy would take (or allows to make a full copy in the background while the snapshot is already being used).

# Summary

We run our databases on local storage, because it is faster, has more consistent performance, uses less power, is cheaper, and is generally leveraging the flexibility of the large, cheap frontend pool to our advantage.

This is safe, because together with Oracle MySQL we developed GTID-based replication, which together with Orchestrator gives us complete flexibility and control over the replication topology, enabling warm and fast switchovers.
This is around 20x faster than active/passive replication pairs we used before, and reduced a lot of daily operational toil for the DBA team.

We recommend the use of distributed storage for large database sizes, but latency considerations apply.
