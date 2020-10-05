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
- databases
- mysql
---
Every once in a while there is the IT news article that kind of triggers me. This time it was [Object-Storage-Protokoll könnte Posix ablösen](https://www.golem.de/news/object-storage-object-storage-protokoll-koennte-posix-abloesen-2010-151294.html) in german computer news site [Golem](https://golem.de). The article speaks about mmap(), NVOEoF and object storage and how it could revolutionize or complete object storages, but does not link to an original article, names no persons and no paper. Also, what do these things - mmap, NVMEoF, object storage and Posix, even have in common?

In another article [But is it atomic?]({% link _posts/2018-11-29-but-is-it-atomic.md %}) we dive into the internals of the old UNIX V7 kernel, and how design decisions and technical realities from the late 1970ies became immortialized as technical requirements for filesystems in the Posix standard.

So Unix is historically grown, and a lot of things have changed since that time. The original file system (for Linux users: "mkfs -t minix" is the closest thing to that which you might have) is not even used any more anywhere in a modern system. But it is basically what Posix talks about when we speak about "Posix File System Semantics".

The basic design is good - I mean, it has held up almost 50 years by now, and that means something. It even has value in modern systems. But it has been designed for local systems, and it is not scaleable to distributed systems very well. So everybody is cheating, or slow. There is [GFS](https://en.wikipedia.org/wiki/GFS2) as an example for slow. There is NFS as an example for hidden cheating (I am looking at you, `actimeo`, and at you, `lockd`). And there is "Object Storage", whatever that specifically means, as an example for doing things completely differently.

## Mutability as The Root of All Evil

The biggest problem Posix has in terms of distributed systems is mutable files. You can open a file, fseek() to an offset of 1MB and overwrite a 3MB segment in a 10MB file. I am choosing these sizes and offsets to make it abundantly clear that writes can be large, larger than a network packet, a disk block or other allocation units, and that they can take measureable, non-zero time.

### One writer per Inode, per time

Posix demands that writes are atomic (see link above), and it implemented that originally by locking the (only copy) of the file with a central lock at the in-memory inode of the file. This has multiple effects:

- There can be only one write active at a time for a file.
  - This already is a problem for local filesystems, when you have a database that wants to write out many concurrent changes to different non-overlapping records in a database file. Databases work around the problem either by defining tablespaces from many small (1GB to 4 GB) sized ".DBF" files (Oracle) or by foregoing the use of filesystems entirely (using raw disks, at a terrible toil cost for sysadmins and DBAs). Only XFS in O_DIRECT mode will handle this better, by not blocking concurrent  writes as long as they are non-overlapping.
  - Reads never happen concurrently with writes, but either completely before or after the write. After the write they will never return stale data, but always the most recently written fresh data.

If this happens in a distributed system, this is terrible. Imagine a storage cluster with dozens or hundreds of storage nodes and hundreds or thousands of clients. Parts of the file we are about to write to may have been cached anywhere in any cluster node or client to avoid excessive network transfers. These cached copies are now all invalid, because they contain data that has been overwritten with potentially different values.

Because reads must not return stale data under Posix, we need to invalidate all of these copies, and - worse - we need to this under a lock to ensure atomicity and fresh reads. So each write (not commit/fsync) has to inform all data nodes and all caches that have the data that there is a write for some extent (offset, length) incoming, wait for the acknowledgement, then let the write proceed, and they collect the complete acknowledgement of all data nodes that they have the data, and all caches that the have destroyed or updated their cached copy.

This is unimaginably slow, and even worse when during this operation a cluster topology change happens (a node taking part in our operation leaves the cluster or similar).

If you happen to have two concurrent overlapping writes (write A to node 1 at offset 0, length 3MB, and write B to node 12 at offset 1MB, length 3MB), Posix also demands ordering between these writes - A either happens in total before or after B. You will never end up with an ABABABAB block pattern in the overlap, and again, this can only be guaranteed by locking.

Nothing "made" Posix specify this, this is just the natural behavior in a single core 1970ies computer when you lock interrupts (`spl()`) or `plock()` on an in-memory inode, which then was later officially documented and bless into a standard when the Posix specificationw as written.

In any case: The combination of Mutability and Strong Read Consistency/Atomic Write Behavior creates a clusterwide lock problem.

### Fixed metadata, and synchronous metadata updates

Things get even worse when we look at metadata. The set of metadata in a Unix Inode is fixed and defined, and documented in Posix, too. We have the typical Unix access rights (ugo times rwx) and the three second-resolution times (a/m/ctime), and a file length - that is basically it.

There is an attempt to extend this, using Posix File ACLs (ACL) and Posix Extended Attributes (xattr), but for example mapping NTFS access permissions to Posix ACLs is complicated - just look at what Samba has to do to get this approximately right. The fact that the Unix notion of a user identity is scoped by a local machine does not help at all - your userid 0 is different from my user id 0 in meaning, and if I am UID 0 on my box I probably should not be UID 0 on yours.

Posix demands synchronus updates to metadata updates. When you extend a file, this should be visible immediately in the file length, and when you access a file, the atime should update, too. Even on local filesystems this is no longer doable - everybody mounts their Linux disks with a variant of `noatime` or the other.

But while data writes distribute themselves across the cluster, metadata updates to not. They all have to hit the relatively small number of metadata nodes, and often crush them.

### The key idea: Immutability

Note that all the things we spoke about are lower file system problems - they happen at the level of individual files already, not even going into upper file system, directory hierarchies and path names. That's not even necessary, because as long as the lower FS is not in shape looking up is kind of pointless.

Object Stores have one single core idea: Files are immutable, maybe appendable (S3 is not, Google GFS and Hadoop HDFS are). The payoff is that we can cache this stuff, because the cache never becomes invalid. Maybe the end of the file is not up to date, but it will be eventually consistent.

The file has a KV store with metadata, which can even grow to considerable size, and which is also eventually consistent. The upper file system we do away with: The entire namespace is one KV store, in which the key is a binary string that cosplays a path name, and the value is the actual file data (and metadata).

This has far reaching consequences: We can talk about Log Structured Merge Trees and why they because popular in database lang and how that plays nicely with Object Storages. Or we can talk about how Event Sourcing favors append only data structrues and how that plays nicely with Object Storages.

## There is a timeline, and there is progress

The basic Unix File System is, for the sake of illustration, basically the state of the art as seen in 1974.

There are a lot of elementary improvements to this initial idea that we find reflected in BSD FFS, from 1984.

The culmination point of these ideas, and structures, can be found in Silicon Graphics XFS, from 1994.

A completely different way of thinking can be found in [Log Structured File Systems](https://en.wikipedia.org/wiki/Log-structured_file_system), in the early 1990, but performance wise that was a failure. The commercially successful and performant implementation can be found  - made by Oursterhouts students - Solaris ZFS, in NetApps WAFL, and in Btrfs. That would put us roughly into 2004, in terms of commercial availability.

Now, widespread adoption of Object Storages in persistence products with Log Structured Merge (LSM) Trees everywhere is a thing in Elastic Search, in Cassandra, in RocksDB and its many applications and in a lot of other products, and we can see it clearly being popular in 2014. LFS-like non-overwriting structures are also at the foundation of all of our storage, deep down in the block-simulation layer of flash storage devices.

## Other developments

Flash Storage originally appeared as a simulated hard disk, SSD. So we have a PCI bus, on which there is a SATA controller, which connects to the simulated hard disks flash controller, which talks to the flash.

### SSD, NVME, RoCE, and NVMEoF

NVME is what we get when we ask the question "What purpose does the SATA controller have in this setup, anyway?" I means, except slowing everything down, forcing us to use antiquated SCSI commands and serializing access. NVME therefor is a PCI bus, which talks to flash controllers, which talk to the flash, and a command set for this. The great innovation is to do away with the single disk queue and allow many of these, which allows us to utilize around 800k IOPS per device even if a single operation can take as long as 1/20.000th of a second - just go 40-way wide, if you can.

Now, what if we had a way to speak to a NVME device on a different computers PCI bus as if it were local? That's what remote DMA (RDMA) would enable us to do.  RoCE ("rocky", RDMA over Converged Ethernet) initially was painful - RoCE V1 was unrouteable raw Ethernet with its own Ethertype. RoCE V2 fixed that, and put the entire stuff into UDP instead, so it was routeable, at least within a single data center.

Turns out, the value is more in the Remote than in the DMA, so when RoCE became "NVME over Fabric over TCP" (NVMEoF/TCP), it was valueable and useful to have, even if you had an ultracheap Broadcom that did not properly DMA the way RoCE needs it. The resulting access to a remote NVME still was as fast as to a local SSD, or even faster.

### mmap()

And finally, `mmap()` is a Unix system call that allows you to map a file into the address space of a process, so that when you access a memory page, this memory page is appropriately filled with the content of this file. Think "swap from any file into memory, not just from a swap file".

For mutable files, and the kings of mutability, relational databases, mmap() is of little use and many complexities - extending files, controlled write-out to persistent storage, not overwriting data because MVCC, and different data format and data position on disk and in memory are actually important for people who transact, and hence mmap() does help very little for most databases. We can talk about Optane, PMEM, and transactional memory, but that's a different lecture for another day.

But making an immutable file available read-only in memory is actually very useful and efficient, and that is what mmap() is really, really good at - you get clean, discardable memory pages, no file extension problems, and no "which pages are written to disk at what point in time" sychronisation problems.

The idea is so good that Bryan Cantrill actually had it first, and foreshadowed "serverless" in [Manta](https://github.com/joyent/manta). Basically, Joyent starts a "Container" (a BSD "jail" or Solaris "zone"), maps a kind of not-quite-S3 object into it and your code can then access this, and emit output results into a new object in the same or a different bucket.

The mmap() in this is a nice sugar on top of it, as it makes reads automatic and en-passant and makes I/O minimal. The important fact is that Input and Output are distinguished and the input file is still immutable. Because it is, the munmap() is unimportant - exit() is also a munmap() and since the object is immutable it is unimportant if it stays mapped.

## Putting it all together

So you have a page fault and have to get a page from local storage. So why not from Ethernet, via RDMA, remotely, from any disk anywhere in your data center? Can we have this as a kernel extension and - more important - standardized in the NVME spec?

Ah, now we're talking. "We have standardized remote page fault readfs over NVMEoF".

That's the article - at least, that is what I think it is, because it does not say so, and it references nothing.

But even so, it needs 50 years of Unix as a context to be understandable.

I still don't know what the original article was, but there is stuff such as [FileMR: Rethinking RDMA Networking for Scalable Persistent Memory](https://www.usenix.org/conference/nsdi20/presentation/yang) that is being worked on.

Based on [a twitter tread](https://twitter.com/isotopp/status/1313084116569645057).