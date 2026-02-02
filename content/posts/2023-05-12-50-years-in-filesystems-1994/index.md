---
author: isotopp
title: "50 years in filesystems: 1994"
date: "2023-05-12T12:13:14Z"
feature-img: assets/img/background/rijksmuseum.jpg
toc: true
tags:
  - lang_en
  - unix
  - filesystems
aliases:
  - /2023/05/12/50-years-in-filesystems-1994.html
---

This is part 3 of a series.
The first part is "[1974]({{< relref "2023-05-05-50-years-in-filesystems-1974.md" >}})".
The second part is "[1984]({{< relref "2023-05-06-50-years-in-filesystems-1984.md" >}})".

Progress is sometimes hard to see, especially when you have been part of it or otherwise lived through it.
Often, it is easier to see if you compare modern educational material, and the problems discussed with older material.
And then look for the research papers and sources that fueled the change.

In Linux (and Unix in general), this is easy.

# 1994 — The SGI XFS Filesystem

In 1994, the paper [Scalability in the XFS File System](http://www.scs.stanford.edu/nyu/02fa/sched/xfs.pdf) saw publication.
Computers got faster since 1984, and so did storage.
Notably, we are now seeing boxes with multiple CPUs, and with storage reaching into the Terabytes.
The improvements to the 4.3BSD fast filing system (or the modified version in SGI IRIX called EFS) were no longer sufficient.

SGIs benchmarks cite machines that had large backplanes with many controllers (one benchmark cites a box with 20 SCSI controllers),
many disks (three-digit-numbers of hard drives), 
and many CPUs (the benchmarks quote 12 socket machines) with a lot of memory (up to one gigabyte quoted in the benchmarks).

Filesystems became larger than FFS could handle,
files became larger than FFS could handle,
the number of files per directory led to large lookup times,
central data structures such as allocation bitmaps did no longer scale,
and global locks made concurrent access to the file system with many CPUs inefficient.
SGI set out to design a fundamentally different filesystem.

Also, the Unix community as a whole was challenged by Cutler and Custer,
who showed with NTFS for Windows NT 4.0 what was possible if you redesign from scratch.

# Requirements

The XFS filesystem was a firework of new ideas, and a large deviation from traditional Unix filesystem design.
The list of new things is long:

- Facilitate concurrency with
  - allocation zones
  - inode lock splitting
  - facilities for large, parallel I/O requests, DMA and Zero-Copy I/O
- Scalability of access by building the filesystem around the concepts of
  - B+-Trees
  - Extents: pairs of (start, length) descriptors
  - decoupling "file write" and "file layout" on disk to allow for contiguous files by using delayed allocation and preallocation.
- Introduce a write-ahead log to journal metadata changes
  - log asynchronously to allow for write coalescence
  - leveraging the log for recovery, so that recovery time is proportional to the amount of data in flight, not the size of the filesystem

XFS was written with these requirements, 
and primarily in order to provide a filesystem that could leverage all the performance of large SGI boxes for video editing, video serving and scientific computing.

## A logging filesystem, but not a log structured filesystem

This is also happening at about the same time as John K. Ousterhout asking 
"[Why Aren’t Operating Systems Getting Faster As Fast as Hardware?](https://web.stanford.edu/~ouster/cgi-bin/papers/osfaster.pdf)".
Ousterhout started to explore the ideas of a log-based filesystem with the experimental Sprite operating system.

Log-based filesystems are an extremely radical idea that we need to discuss later, even if they originally predate XFS by a bit.
But they weren't very usable originally, because they need different hardware which can offer a lot more disk seeks.
Log structured file system ideas had to become a lot more refined to actually have an impact,
so we are going to discuss them later in the series.

## What IRIX had before

IRIX as coming already with EFS, the specially sauced-up version of BSD FFS that used extents.
It suffered from an 8 GB filesystem size limit, a 2 GB filesize limit, and it could not utilize the full hardware I/O bandwidth,
which made many customers of these fantastically expensive machines somewhat sad.

Demands for video playback and from the database community led to requirements 
that stated the new filesystem needed to support hundreds of TB of disk space,
hundreds of MB/s of I/O bandwidth and many parallel I/O requests in order to be able to saturate the hardware provided,
and all this without running out of CPU.

The title of the paper is "Scalability in the XFS File System" and not "Implementation of …", 
so it is more a show of the features provided and a superficial discussion of the implementation and the design decisions around it.
It is not an in-depth discussion of the implementation,
nor are extensive benchmarks provided.

# Features

## Large filesystems

XFS supports large filesystems.
Previous filesystems use 32-bit pointers to blocks.
At 8 KB block size, with 32-bit block pointers, the limit is 32 TB.

Moving to 64-bit block pointers would make many data structures multiple of 8 bytes in size, which seemed like a waste.

For concurrency (see below), XFS introduces the concept of **allocation groups** (AGs), which are always smaller than 4 GB.
Allocation groups have local instances of the filesystem data structures, for example, inode maps or free block tracking.
These are independently locked and so allow for concurrent operations in different allocation groups.

Allocation groups also help to save on pointer sizes:
Where possible, AG-relative block numbers are being used, and these always fit into 32-bit pointers.
In fact, a 4G allocation group can have only 1M blocks or fewer blocks (at 4K minimum blocksize),
so a single maximum sized extent within a single AG can be packed into 40 bits (5 bytes).

The maximum file size and filesystem size is 8 EB (2^63-1).

## Bandwidth and Concurrency

Concurrent operations are a design goal for XFS.
1994 is the age of 20 MB/s SCSI controllers, but SGI built machines with large chassis that could house many controllers and many drives.
Benchmarks quote machines with an aggregate bandwidth of 480 MB/s delivering file I/O performance of over 370 MB/s with no tuning, including all overheads.
This is quite an impressive result for everyday usage in 1994.

XFS achieves this using large blocks (4 KB or 8 KB block size), and the concept of extents.

### Extents and B-Trees.

**Extents** are a core concept in XFS.
They are tuples, most of the time pairs of `(startblock, length)`.
For mapping file blocks to disk blocks ("bmap"), they are triples `(offset, length, startblock)`.
Using truncated values, because of the size limits imposed by the maximum AG size, 
they can describe a contiguous sequence of blocks up to 2M blocks in size in 4 bytes,
which is a lot more efficient than what BSD FFS did before.

Extents also allow XFS to do large I/O requests because they describe sections of contiguous blocks, 
making it easy to create read or write requests for several blocks apiece.
It does I/O by default with 64 KB memory buffers, unless special provisions are being made to make them even larger.

The filesystem assumes an underlying disk structure with striping, and provides a number of 2 or 3 outstanding I/O requests to allow for concurrent I/O.
It checks for backpressure, that is, it checks that the application is actually reading data.
If it does, it issues additional read requests to keep the number of requests in flight at 3 by default, 
good for 192 KB in flight at once.

Groups of Extents can be collected in linear lists, but that will lead to scaling problems.
So XFS uses **B+-Trees**, which degrade to linear lists if there is only one single index block.

Usually tuples are indexed on their first value, but for some structures such as free lists, multiple indexes are kept:
It is useful to index free space by `startblock` for closeness, but also by `length` to fit free spaces in the right size.

### Breaking the single-writer inode lock 

![](2023/05/overlapping-write.png)
*Posix locks the in-memory inode to guarantee [atomic writes]({{< relref "2018-11-29-but-is-it-atomic.md" >}}).
This makes sure any two large multiple-block writes always happen one-before-the-other.*

XFS also breaks the in-memory inode locks:
Posix demands that large, overlapping, multiple block writes are totally ordered.
When they overlap, it must not happen that there is a block soup of alternating blocks from write A and write B.

The default implementation in most kernels is simply a file-global lock placed at the in-memory inode, making sure there can be only one writer per inode.
Implementers of databases hate that because it limits the write concurrency on any single file to One.
This is, for example, why Oracle recommends that you make tablespaces from multiple files, each no larger than one GB.

XFS, in `O_DIRECT` mode, removes this lock and allows atomic, concurrent writes, making database people very happy.

## Dynamic Inodes and improved Free Space Tracking

With large filesystems, you can never know: 
The applications may need a large number of inodes for many small files, or a small number of large files.
Also, what is a good distance between the inode and the data blocks that belong to the file?

There is no good answer to the first question, and "as close as possible" is the answer to the second question.
So XFS creates Inodes dynamically, as needed, in chunks of 64 inodes.

The relatively large inode size of 256 bytes (compared to 128 in BSD FFS and 64 in traditional Unix) 
is being compensated by the fact that XFS creates Inodes only as needed, and places them relatively closely to the file start.
This frees up a substantial amount of disk space –
in Unix filesystems with fixed inode counts as much as 3-4% of the disk space can be locked up in pre-allocated inodes.
And even with cylinder groups, there will be considerable distance between an inode and the first data block.

Because inodes can reside anywhere on the disk and not just behind the superblock, they need to be tracked.
XFS does with one B+-tree per allocation group.
The tree is indexed by the start block, and records for each inode in the chunk if it is available or in-use.
The inodes themselves are not kept in the tree, but in the actual chunks which are close to the file data.

Similarly, free space is tracked in chunks, and kept in per-AG trees, indexed twice: by start block and by length.

## Write-Ahead Log

Recovering a large filesystem after a crash can be slow.
The recovery time is proportional to the size of the filesystem, and the number of files in it,
because the system basically has to scan the entire filesystem and rebuild the directory tree in order to ensure things are consistent.
With XFS, the filesystem also is a lot more fragile, as it provides a variable number of inodes, spread out non-contiguously over the disk.
Recovering them would be extra expensive.

Using write-ahead logging for metadata, this can be avoided most of the time.
Recovery time is proportional to the size of the log, that is, the amount of data in flight at the time of the crash.

The log contains log entries containing a descriptor header and a full image of all changed metadata structures:
inodes, directory blocks, free extent tree blocks, inode allocation tree blocks, allocation group blocks, and the superblock.
Because full images are stored in the block, recovery is simple: the recovery process simply copies these new, changes images into the place where they are supposed to be, without needing to understand what kind of structure it changes.

The trust of the authors into the log was huge:
Initially XFS had no `fsck` program.
This turned out to be overly optimistic, and so now `xfs_repair` exists.

### Metadata update performance

XFS is logging metadata updates, which means they need to be written to the filesystem log.
By default, this log is placed inline, in the filesystem.
But it is also possible to take it out, and put onto other media, for example, flash storage or battery-backed memory.

Writes to the log are asynchronous, if possible, but with partitions serving NFS they cannot be.
Asynchronous writes allow for write batching, with speeds things up.
But NFS servers profit a lot from accelerated log storage.

Because all metadata updates need to be logged, it can happen that intense metadata operations flood the log.
A `rm -rf /usr/src/linux` for example is not an operation where XFS is particularly fast, because the metadata update stream will eventually overflow the log.
And because everything else in XFS is parallel by AG, the log is usually the only source of contention.

## Large files and sparse files

In FFS, files are mapped by the classical dynamic array, with direct blocks and up to three levels of indirect blocks.
With 64-bit filesize, this becomes unwieldy: there will be more than three levels of indirect blocks required,
and a substantial number of blocks would be required what essentially becomes a list of incrementing numbers.
FFS (and EFS) are also forced to layout blocks the moment each block is allocated in the filesystem buffer pool.
So effectively, no attempt to contiguously layout files on disk is being made. 
Instead, blocks are placed individually.

XFS replaces this dynamic array with extents.

In file placement maps, these mapping extents are triples `(blockoffset, length, disk block)`.
These extents are stored in the inode itself until this overflows.
Then XFS starts to root a B+-tree of the mapping extents in the inode, indexed by logical block number for fast seeks.

This data structure allows compressing a substantial number of blocks (up to 2M blocks) in a single descriptor,
assuming contiguous allocation is possible.
So even large files could be stored in very few extents, in the optimal case one extent per AG.

### Delayed allocation and Preallocation for contiguous layout

XFS also provides a new concept, delayed allocation, in which virtual extents can be allocated in the file system buffer pool.
These are blocks full of yet unwritten data that have not been layouted, and hence lack a physical position.
Only on flush these blocks are layouted, contiguously, and then written out linearly in large writes, to speed things up.

This is a fundamental change to how the filesystem buffer cache works – 
previously it was possible to use `(device, physical block number)` to identify buffer cache blocks and prevent duplicate buffer allocation.
When porting XFS to Linux, the Linux kernel initially could not accommodate strategies that do not use such identification in the normal buffer cache, so at first XFS required a separate buffer cache.
This got fixed later, as the porting progressed.

To ensure that files can be layouted without fragmentation, in a single extent, XFS aggressively preallocates storage for open files.
The default amount of disk space preallocated is dependent on the amount of free space in the filesystem, and can be substantial.

The internet is littered with questions by XFS users asking where their disk space is, and the answer is always "in the open file handles of `/var/log`. Also, check the [manpage](https://man7.org/linux/man-pages/man5/xfs.5.html) for `allocsize=` and also check [`/proc/sys/fs/xfs/speculative_prealloc_lifetime`](https://linux-xfs.oss.sgi.narkive.com/jjjfnyI1/faq-xfs-speculative-preallocation)."

### Locality

XFS does not use allocation groups for locality much.
They exist mostly for concurrency.
Instead, file placement is mostly around directories and existing blocks of the current file.
The only exception is "new directories", which are placed "away" from their parent directory by putting them into a different AG.

In large files, if new extents need to be placed, they go "initially near the inode, then near the existing block in the file which is closest to the offset in the file for which we are allocating space", as the paper specifies.
This places the inode close to the start of the file, and blocks added later to whatever is already present.

## Large directories

In the traditional Unix filesystem and in BSD FFS, directory name lookups are linear operations.
Large directories slow this down a lot, for any kind of pathname to inode translation.

XFS chose the ubiquitous B+-Tree as a structure for directories, too, but with a quirk:
Since the keys are supposed to be filenames, a variable length structure, they would be completely different from all the other tree implementations in the filesystem.
The XFS authors did not like this idea, so they are hashing the filename into a fixed 4-byte name hash, and then store one or more directory entries as `(name, inode)` pairs in the value.

There was some tradeoff discussion involved in this, but the authors found that short keys allow storing many entries per block,
leading to wide trees, and thus faster lookups.
They boast "We can have directories with millions of entries", something that was previously unthinkable in Unix filesystems.

# A lot of code

![](2023/05/xfs-scaling.png)
*XFS Benchmarks in 1994 show nice and welcome linear scaling behavior that utilizes the hardware offered well.
It handles well on large boxes with (for 1994) high core-counts.*

XFS is a large filesystem.
Linux ext2 is only 5000 lines of kernel code (and about 10x this in user-land).
XFS is 50.000 lines of kernel code, and that is without the IRIX volume manager XLV (in Linux, the XFS port uses LVM2 instead).

XFS was released under the GNU GPL in May 1999, and was ported into the Linux kernel starting in 2001.
As of 2014, it was supported in most Linux distributions and RHEL used it as the default filesystem.
And even in 2024 it is still holding up reasonably well, on HDD and on flash.

It still is the filesystem with the best scaling behavior, the best concurrency behavior, and the most consistent commit times,
which makes it the preferred filesystem for any kind of database usage.
This is due to the elimination of several global locks that impair concurrent usage and performance in large filesystems,
and due to the consistent use of B+-Tree structures with `O(log(n))` scaling behavior where before algorithms with worse scaling behavior have been used.
The use of extents also allows dynamically growing I/O sizes, benefiting throughput, 
and together with the novel idea of delayed allocation encourage contiguous file placement.
