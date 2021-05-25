---
layout: post
title:  'NVME is not a hard disk'
author-id: isotopp
feature-img: assets/img/background/rijksmuseum.jpg
date: 2021-05-25 14:41:50 +0200
tags:
- lang_en
- storage
- networking
- data center
---

So [somebody tweeted](https://twitter.com/leclercfl/status/1396909628949155845) about the [Seagate Mach.2](https://techxplore.com/news/2021-05-seagate-mach2-fastest-hard.html), a harddisk with two independent heads "combs", and I [commented in german](https://twitter.com/isotopp/status/1397077206111821824): "It's two drives in one chassis, even shown as two drives. And it still is rotating rust, so slow with seeks. Linear IO will be fine."

That quickly devolved in a discussion of [RAID-0 on a single disk drive](https://twitter.com/Earlchaos/status/1397116366113673219): "RAID-0 on a single physical drive. Yeah, you can do that if you do not need your data."

And that is true, [I replied](https://twitter.com/isotopp/status/1397124815660765184): "Most people need their data a lot less than they think they do."

Let's unroll that thread and the various followups in english for this blog.

# n=3  or n=1

So, most people actually need their data a lot less than they think they do. That is, because most database-like applications do their redundancy themselves, at the application level, so that RAID or storage replication in distributed storage (the "n-factor", for the number of replicas that distributed stores for each block) is not only useless, but actively undesirable.

Where I work, there is the data track, and there are customers of the data track.

## Non-Databases are stateless

Customers of the data track have stateless applications, because they have outsourced all their state management to the various products and services of the data track. They are deploying their applications, and they largely do not care about the content of hard disks, or even entire machines. Usually their instances are nuked on rollout, or after 30 days, whichever comes first, and replaced with fresh instances.

Customers of the data track care about placement:

> Place my instances as distributed as possible, no two instances on the same host, if possible, not in the same rack or even the same stack

(A stack is a network unit of 32-48 racks) This property is called "anti-affinity", the spread-out placement of instances.

## Database-like systems

The data track has things such as Kafka, Elastic, Cassandra or MySQL, and a few snowflakes.

All of these services are doing their own redundancy: individual drives, or even instances, are not a thing they care a lot about. Loss of hosts or racks is factored in.

> They care a lot about anti-affine placement, because they care a lot about fault isolation through "not sharing common infrastructure" between instances. 

Often these services do create instances for read capacity, and getting fault tolerance by having the instances not sharing infrastructure is a welcome secondary effect.

## Adding distributed storage forces n=3

Now, if you switch from local storage to distributed storage, you very often get redundant storage. For transactional workloads this is often a RAID-1 with three copies (`n=3`). Most customers of them don't actually need that: Because they create capacity for read scaleout, they only care about independence of failures, not avoiding them. So again, what they want is anti-affine placement, for example by propagating tags down the stack. 

So imagine [a lot of MySQL databases]({% link _posts/2021-03-24-a-lot-of-mysql.md  %}), for example on Openstack. The volumes of each replication chain are tagged with the replication chain name, like `chain=<x>`. If we could tell the storage to place all volumes with identical `chain` tag values on different physical drives, ideally on different storage nodes in different racks, storing data with `n=1` would be just fine.

Cassandra, Elastic and Kafka could work with the same mechanism, because they, too, have native solutions to provide redunancy on JBODs at the application level.

But this kind of distributed storage does not exist, and that leads to triplicate storage when it is not needed.

# How about local storage?

"But, Kris! Local Storage!"

Yes, local storage would be a solution. I know that, because when running on autoprovisioned bare metal, it does work, and we currently have that.

But most Openstack operators do want live migration, so even ephemeral storage is often ceph'ed. That's a... complication I could do without.

In an earlier life Quobyte did work fine for volumes and ephemeral storage, except that with guests that contained large memcached's or MySQL live migrations still failed often.

That's not because of Quobyte, but because of memory churn: The memory of the VM in busy instances changed faster than the live migration could move it to the target host. We then had to throttle the instances, breaking all SLA's.

In my current life, I can tolerate instance loss anyway, especially if it is controlled and announced. So I do not really have to migrate instances, I can ask nicely for them to be shot in the head. With pre-announcement ("I need your host, dear Instance, please die."), and the application provisions a new instance elsewhere and then removes the one in question. Or with control ("Don't force-kill instances if the population is too thin.").

Either case is likely to be faster than a live migration. It is faster for sure, if the data volume is on distributed storage so that I only have to provision the new instance and then simply can reconnect the data volume.

# NVME over fabric over TCP

Local storage has a smaller write latency than distributed storage, but NVME over fabric ("NVMEoF") is quite impressive. And since CentOS 8.2, NVMEoF over TCP is part of the default kernel. That means you do have the NVMEoF TCP initiator simply available, without any custom install.

NVMEoF over TCP has a marginally worse latency than RoCE 2 ("NVMEoF over UDP"), but it does work with any network card - no more "always buy Mellanox" requirement.

It does allow you to make storage available even if it is in the wrong box. And distributed storage may be complicated, but it has a number of very attractive use-cases.

- volume centric workflows: "make me a new VM, but keep the volume". Provisioning one Terabyte of data at 400 MB/s takes 45 minutes of copy time for a total MySQL provisioning time of around 60 min. Keeping the volume, changing the VM (new image, different size) makes this a matter of minutes.
- With NVME namespaces or similar mechanisms one can cut a large flash drive into bite sized chunks, so providing storage and consuming it can be decoupled nicely.
- Lifetime of storage and lifetime of compute are not identical. By moving the storage out into remote storage nodes their lifecycles are indeed separate, offering a number of nice financial advantages.

All of that at the price of the complexity of distributed storage.

# NVME "servers"

This [raised the question](https://twitter.com/eckes/status/1397134662896701443) of what the "NVME server" looks like. "Is the respective NVME server an image file, or does it map 1:1 to a NVME hardware device?"

NVME over Fabric (over UDP or over TCP) is a network protocol specification and implementation. It uses iSCSI terms, so the client is the "initiator", and the server is the "target".

How backing storage is implemented in a NVME target is of course the target's choice. It could be a file, but the standard maps nicely on a thing called "[NVME namespaces](https://nvmexpress.org/resources/nvm-express-technology-features/nvme-namespaces/)".

So flash storage does not overwrite data, ever. Instead it has internally a thing called flash translation layer (FTL), which is somewhat similar to a log structured file system or a database LSM.

Unlike a file system, it does translate linear block addresses (LBAs) into physical locations on the flash drive, so there are no directories and (initially also) no filenames.

There is of course a reclaim and compaction thread in the background, just like the compaction in log structured filesystems or databases. So you could think of the LSM as a filesystem with a single file.

Now, add NVME namespaces - they introduce "filenames". The file names are numbers, the name space IDs (NSIDs). They produce a thing that looks like partitions, but unlike partitions they do not have to be fixed in size, and they do not have to be contiguous. Instead, like files, namespaces can be made up by any blocks anywhere on the storage, and they can grow. That works because with flash seeks are basically free - the rules of rotating rust no longer constrain us.

# nvme command line

Linux has the command line program "[nvme](https://manpages.ubuntu.com/manpages/xenial/man1/nvme.1.html)" to deal with nvme flash drives. Drives appear named `/dev/nvmeXnY`, where `X` is the drive number and `Y` is the namespace id (NSID), starting at 1. So far, you probably always have seen the number 1 here.

Start with `nvme list` to see the devices you have. You can also ask for the features the drive has, `nvme id-ctrl /dev/nvme0n1 -H` will tell you what it can do in a human-readable (`-H`) way. Not all flash drives support namespaces, but enterprise models and newer models should.

Using `nvme format` you can reformat the device (losing all data on it), and also specify the block size. `nvme list` will also show you this block size. You do want 4KB blocks, not 512 byte blocks: It's 2021 and the world is not a PDP-11 any more, so `nvme format /dev/nvme0n1 -b 4096`, please. Some older drives now require a reset to be able to continue, `nvme reset /dev/nvme0`.

Namespaces can be detached, deleted, created and attached: `nvme detach-ns /dev/nvme0 -namespace-id=Y -controllers=0`, then `nvme delete-ns /dev/nvme0 -namespace-id=1`. When creating a namespace, `nvme create-ns /dev/nvme0 -nsze ... -ncap ... -flbas 0 -dps 0 -nmic 0` or whatever options are desired, then `nvme attach-ns /dev/nvme0 -namespace-id=1 -controllers=0`. Again, `nvme reset /dev/nvme0`.

In theory, NVME drives and NVME controllers are separate entities, and there is the concept of shared namespaces that span drives and controllers.

In reality, this does not work, because NVME devices are usually sold as an entity of controller and storage, so some of the more interesting applications the standard defines do not work on the typical devices you can buy.

# Erasing

Because flash does not overwrite anything, ever, you can't erase and sanitize the device the way you have done this in the past with hard drives. Instead there is drive encryption ("OPAL"), or the `nvme sanitize /dev/nvme0n1` command

Or you shred the device, just make the shreds smaller than with hard disks: With hard disks, it is theoretically sufficient to break the drive, break the platters and make scratces. Drive shredders produce relatively large chunks of metal and glass, and are compliance.

Flash shredders exist, too, but in order to be compliant the actual chips in their cases need to be broken. So what they produce is usually much finer grained, a "sand" of plastics and silicon.

# Network

You need a proper network, [Maik added](https://twitter.com/isotopp/status/1397143957860143105):

Distributed storage is storage at the other kind of the network cable. Every disk read and every disk write become a network access. So you do need a fairly recent network architecture, from 2010 or later: A leaf-and-spine architecture that is optionally oversubscription free so that the network will never break and never be the bottleneck.

## Leaf-and-spine

Brad Hedlund wrote about [leaf-and-spine](https://bradhedlund.com/2012/01/25/construct-a-leaf-spine-design-with-40g-or-10g-an-observation-in-scaling-the-fabric/) in the context of Hadoop in 2012, but the first builds happened earlier, at Google, using specialized hardware. These days, it can be done with standard off the shelf hardware, from Arista or Juniper, for example.

[![](/uploads/2021/05/clos-40G.png)](https://bradhedlund.com/2012/01/25/construct-a-leaf-spine-design-with-40g-or-10g-an-observation-in-scaling-the-fabric/)

*Leaf-and-spine as shown by [Brad Hedlund](https://bradhedlund.com/2012/01/25/construct-a-leaf-spine-design-with-40g-or-10g-an-observation-in-scaling-the-fabric/). Today you'd use different hardware, but the design principle is still the same.*

Here, the leaves are "Top of Rack" switches that are connected to computers, so we see 40x 10 GBit/s coming up to the red boxes labelled "Leaf". We also provide green switches labelled "Spine", and connect to them with up to 10x 40G for a complete oversubscription free network.

Using BGP, we can automatically build the routing tables, and we will have many routes going from one leaf switch to any other leaf switch - one for each spine switch in the image. Using Equal Cost Multipath (ECMP), we spread our traffic evenly across all the links. Any single connection will be limited to whatever the lowest bandwidth in the path is, but the aggregated bandwidth is actually never limited: we can always provide sufficient bandwidth for the aggregate capacity of all machines.

Of course, most people do not actually need that much network, so you do not start with a full build. Initially only provide a subset of that (three to four uplinks) and reserve switch ports and cable pathways for the missing links. Once you see the need you add them, for example when bandwidth utilization in the two digit percentages or you see Tail Drops/[RED](https://en.wikipedia.org/wiki/Random_early_detection).

## Racks and Stacks

One level of leaf-and-spine can build a number of racks that are bound together without oversubscription. We call this a stack, and depending on the switch hardware and the number of ports it provides, it's 32-48 racks or so.

We can of course put another layer of leaf-and-spine on top to bundle stacks together, and we get a network layer that is never a bottleneck and that never disconnects, across an entire data center location.

"Never disconnects?" Well, assuming three uplinks, and with a stack layer on top of the first leaf-and-spine layer, we get four hops from start to destination, and that 3^4 possible redundant pathes to every destination ToR via ECMP.

Chances are that you need to build a specialized monitoring to even notice a lost link. You can only have outages at the ToR.

With such a network a dedicated storage network is redundant (as in no longer needed), because frontend traffic and storage traffic can coexist on the same fabric.

A common test or demonstration is the Hadoop Terasort benchmark: Generate a terabyte or ten of random data, and sort it. That's a no-op map phase that also does not reduce the amount of data, then sorting the data in the shuffle phase and then feeding the data (sorting does not make it smaller) across the network to the reducers.

Because the data is randomly generated, it will take about equal time to sort each Hadoop 128MB-"block". All of them will be ready at approximately the same time, lift off and try to cross the network from their mapper node to the reducer node. If you network survives this, all is good - nothing can trouble it any more.
