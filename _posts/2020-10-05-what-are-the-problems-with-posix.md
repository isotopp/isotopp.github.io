---
layout: post
title:  'What are the problems with POSIX?'
author-id: isotopp
feature-img: assets/img/background/rijksmuseum.jpg
date: 2020-10-05 17:13:30 +0200
tags:
- lang_en
- erklaerbaer
- filesystems
- database
- mysql
---
Every once in a while there is the IT news article that kind of triggers me. This time it was ["Object-Storage-Protokoll könnte Posix ablösen"](https://www.golem.de/news/object-storage-object-storage-protokoll-koennte-posix-abloesen-2010-151294.html) in german computer news site [Golem](https://golem.de). The article speaks about mmap(), NVMEoF and object storage and how it could revolutionize or complete object storages, but does not link to an original article, names no persons and no paper. Also, what do these things - mmap, NVMEoF, object storage and Posix, even have in common? It is not explained anywhere in the article.

In another article [But is it atomic?]({% link _posts/2018-11-29-but-is-it-atomic.md %}) we dive into the internals of the old UNIX V7 kernel, and how design decisions and technical realities from the late 1970ies became immortialized as technical requirements for filesystems in the Posix standard.

So Unix is historically grown, and a lot of things have changed since that time. The original file system (for Linux users: "mkfs -t minix" is the closest thing to that which you might have) is not even used any more anywhere in a modern system. But it is basically what Posix means when we speak about "Posix File System Semantics".

The basic design is good - I mean, it has held up almost 50 years by now, and that is a fantastic achievement. It even has value in modern systems. But it has been designed for local systems, and it is not scalable to distributed systems very well.

So everybody is either cheating or slow. There is [GFS2](https://en.wikipedia.org/wiki/GFS2) as an example for slow. There is NFS as an example for hidden cheating (I am looking at you, `actimeo`, and at you, `lockd`). And there is "Object Storage", whatever that specifically means, as an example for doing things completely differently.

## Mutability as The Root of All Evil

The biggest baggage Posix has, in terms of distributed systems, is mutable files. You can open a file, fseek() to an offset of 1MB and overwrite a 3MB segment in a 10MB file. I am choosing these sizes and offsets to make it abundantly clear that writes can be large, larger than a network packet, a disk block or other allocation units, and that they can take measureable, non-zero time.

### One writer per Inode, per time

Posix demands that writes are atomic (see link above), and it implemented that originally by locking the (only copy) of the file with a central lock at the in-memory inode of the file. This has multiple effects:

There can be only one write active at a time for a file.

This already is a problem for local filesystems, when you have a database that wants to write out many concurrent changes to different non-overlapping records in a database file.

Databases work around the problem either by defining tablespaces from many small sized ".DBF" files (Oracle) - 1GB to 4 GB seem to be popular. Or they work around it by  foregoing the use of filesystems entirely - using raw disks, at a terrible toil cost for sysadmins and DBAs. Only XFS in O_DIRECT mode will handle this better, by not blocking concurrent writes as long as they are non-overlapping.

Reads never happen concurrently with writes, too. They are either completely before or after the write instead. If they happen after the write, they will never return stale data, but always the most recently written fresh data.

In distributed systems, this is very expensive: Imagine a storage cluster with dozens or hundreds of storage nodes and hundreds or thousands of clients. Parts of the file we are about to write to may have been cached anywhere in any cluster node or client to avoid excessive network transfers. These cached copies are now all invalid, because they contain data that has been overwritten with potentially different values.

Because reads must not return stale data under Posix, we need to invalidate all of these copies, and - worse - we need to this under a lock to ensure atomicity and fresh reads. So each write (write, not commit/fsync, which can happen much less often) has to inform all relevant nodes with a copy of the data that there is a new write for an extent (offset, length) incoming and wait for the acknowledgement. And then let the write proceed, to wait again to collect the complete acknowledgement of all data nodes that they have the data, and all caches that the have destroyed or updated their cached copy. That's a lot of waiting.

This is unimaginably slow, and even worse, should the cluster topology change during  any operation - a node taking part in our operation leaving the cluster or similar.

If you happen to have two concurrent overlapping writes (write A to node 1 at offset 0, length 3MB, and write B to node 12 at offset 1MB, length 3MB), Posix also demands ordering between these writes - A either happens in total before or after B. You will never end up with an ABABABAB block pattern in the overlap, and again, this can only be guaranteed by locking.

Nothing "made" Posix specify this, this is just the natural behavior in a single core 1970ies computer when you lock interrupts (`spl()`) or `plock()` on an in-memory inode, which then was later officially documented and bless into a standard when the Posix specificationw as written. Our modern computers do not have these properties any more, so we need to make them wait to simulate this.

In any case: The combination of Mutability and Strong Read Consistency/Atomic Write Behavior creates a cluster wide locking problem.

### Fixed metadata, and synchronous metadata updates

Things get even worse when we look at metadata. The set of metadata in a Unix Inode is fixed, and documented in Posix, too. We have the typical Unix access rights (ugo times rwx) and the three second-resolution times (a/m/ctime), and a file length - that is basically it.

There is an attempt to extend this, using Posix File ACLs (ACL) and Posix Extended Attributes (xattr), but for example mapping NTFS access permissions to Posix ACLs is complicated - just look at what Samba has to do to get this approximately right. The fact that the Unix notion of a user identity is scoped to a local machine does not help at all - your userid 0 is different from my user id 0 in meaning, and if I am UID 0 on my box I probably should not be UID 0 on yours.

Posix demands synchronus updates to metadata updates. When you extend a file, this should be visible immediately in the file length, and when you access a file, the atime should update, too. Even on local filesystems this is no longer doable - everybody mounts their Linux disks with a variant of `noatime` or the other.

But while data writes distribute themselves across the cluster, metadata updates do not. They all have to hit the relatively small number of metadata nodes, and this load often crushed metadata servers.

### The key idea: Immutability

Note that all the things we spoke about are lower file system problems - they happen at the level of individual files already, not even going into upper file system, directory hierarchies and path names. That's not even necessary, because as long as the lower file system is not in shape looking up is kind of pointless.

Object Stores have one single core idea: Files are immutable, maybe appendable (S3 is not, Google GFS and Hadoop HDFS are). The payoff is that we can cache this stuff, because the cache never becomes invalid. Maybe the end of the file is not up to date, but it will be eventually consistent.

The file has a Key-Value store with metadata, which can even grow to considerable size, and which is also eventually consistent. With the upper file system we do the same: The entire namespace is one single KV store, in which the key is a binary string that cosplays a path name, and the value is the actual file data (and metadata).

This has far reaching consequences: We can talk about "Log Structured Merge Trees", why they became popular in database land, and how that plays nicely with Object Storages. Or we can talk about how "Event Sourcing" favors "append only data structures", and how that plays nicely with Object Storages.

## There is a timeline, and there is progress

The original Unix File System is, for the sake of illustration, basically the state of the art as seen in 1974.

There are a lot of elementary improvements to this initial idea that we find reflected in BSD FFS, from 1984.

The culmination point of these ideas, and structures, can be found in Silicon Graphics XFS, from 1994.

A completely different way of thinking can be found in [Log Structured File Systems](https://en.wikipedia.org/wiki/Log-structured_file_system), first seen in Ousterhout's  Sprite, in the early 1990. But performancewise the original implementation that was a failure: the first successful and performant implementation can be found  - made by Oursterhout's students - in Solaris ZFS, and at the same time in NetApps WAFL, which promptly engaged in a legal battle over patents. In parallel, many ZFS ideas are being reimplemented about half a decade later in Btrfs. All of that would put us roughly into 2004, in terms of commercial availability.

Now, widespread adoption of Object Storages in persistence products, using Log Structured Merge (LSM) Trees, has taken place. We find them in Elastic Search, in Cassandra, in RocksDB and its many applications, and many more. In a timeline, this would put us into 2014-land.

LFS-like non-overwriting structures are also at the foundation of all of our storage, deep down in the block-simulation layer of flash storage devices, again around 2014.

## Other developments

Flash Storage originally appeared as a simulated hard disk, SSD. So we have a PCI bus, on which there is a SATA controller, which connects to the simulated hard disks' flash controller, which talks to the flash.

### SSD, NVME, RoCE, and NVMEoF

NVME is what we get when we ask the question "What purpose does the SATA controller have in this setup, anyway?" - except slowing everything down, forcing us to use antiquated SCSI commands and serializing access to the highly parallel flash.

NVME therefore is a PCI bus, which talks to flash controllers, which talk to the flash, and a revised command set for this. The great innovation is to put away the single disk queue and allow many of these. Which allows us to utilize around 800k IOPS per device, even if a single operation can take as long as 1/20.000th of a second - just go 40-way wide, if you can.

Now, what if we had a way to speak to a NVME device on a different computers PCI bus as if it were local? That's what remote DMA (RDMA) would enable us to do. RoCE ("rocky", "RDMA over Converged Ethernet") initially was painful - RoCE V1 was unrouteable raw Ethernet with its own Ethertype. RoCE V2 fixed that, and put the entire stuff into UDP instead, so it was routeable, at least within a single data center.

Turns out, the value in RDMA is more in the Remote than in the DMA, so when RoCE became "NVME over Fabric over TCP" (NVMEoF/TCP), it was valuable and useful to have, even if you had an ultracheap Broadcom that did not properly DMA the way RoCE needs it. The resulting access to a remote NVME still was as fast as to a local SSD, or even faster.

### mmap()

And finally, `mmap()` is a Unix system call that allows you to map a file into the address space of a process: when you access a memory page, this memory page is appropriately filled with the content of the file, automatically. Think "swap from any file into memory, not just from a swap file".

For mutable files, and the kings of mutability, relational databases, mmap() is of little use and has many complexities. Databases need extending files, controlled write-out to persistent storage, not overwriting data because MVCC. Also, different data formats on disk and in memory are actually important to people who transact, and hence mmap() does help very little for most databases. We can talk about "Optane", "PMEM", and "transactional memory", but that's a different lecture for another day.

Making an *immutable* file available *read-only* in memory has none of these complexities, and is actually very useful and efficient. This is what mmap() is really, really good at - you get clean, discardable memory pages, none of the file extension problems, none of the "which pages are written to disk at what point in time" sychronisation problems.

The idea is so good that Bryan Cantrill actually had it first, and foreshadowed "Serverless" in [Manta](https://github.com/joyent/manta). Basically, Joyent starts a "Container", actually a BSD "jail" or Solaris "zone", because containers weren't fully invented, yet. It then maps a kind of not-quite-S3 object into it and your code can  access this, and emit output results into a new object in the same or a different bucket.

The mmap() in this is a nice sugar on top of it, as it makes reads automatic,  en-passant and makes I/O minimal. The important fact is that Input and Output are distinguished and the input file is still immutable. Because it is, the munmap() is unimportant - exit() is also a munmap() and since the object is immutable it is unimportant if it stays mapped.

## Putting it all together

So you have a page fault and have to get a page from local storage.

So why not get it from Ethernet, via RDMA, remotely, from any disk anywhere in your data center? Can we have this as a kernel extension and - more important - standardized in the NVME spec?

Ah, now we're talking. "We have standardized remote page fault reads over NVMEoF".

That's the article - at least, that is what I think it is, because it does not say so, and it references nothing.

But even so, it needs 50 years of Unix as a context to be understandable.

I still don't know what the original article was, but there is stuff such as [FileMR: Rethinking RDMA Networking for Scalable Persistent Memory](https://www.usenix.org/conference/nsdi20/presentation/yang) that is being worked on.

Based on [a twitter tread](https://twitter.com/isotopp/status/1313084116569645057).
