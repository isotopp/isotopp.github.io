---
author: isotopp
title: "50 years in filesystems: 1984"
date: 2023-05-06T12:13:14Z
feature-img: assets/img/background/rijksmuseum.jpg
toc: true
tags:
- lang_en
- unix
- filesystems
---

This is part 2 of a series. The first part is "[1974]({{< ref "/content/posts/2023-05-05-50-years-in-filesystems-1974.md" >}})".

Progress is sometimes hard to see, especially when you have been part of it or otherwise lived through it.
Often, it is easier to see if you compare modern educational material, and the problems discussed with older material.
And then look for the research papers and sources that fueled the change.

In Linux (and Unix in general), this is easy.

# 1984 — The BSD Fast Filing System

The original Unix filesystem was doing well, but also had a large number of obvious problems.
BSD Unix undertook an effort to fix them, and this is documented in the book
"[The Design and Implementation of the 4.3BSD UNIX Operating System](https://www.amazon.de/Design-Implementation-4-3Bsd-Operating-System/dp/0201061961)"
by Leffler, McKusick et. al[.](http://libgen.rs/book/index.php?md5=61457A629D5DE3B8966141A9D51FE89B)

A more concise, but also more academic discussion can be found in the classic 1984 paper [A Fast File System for UNIX](https://dsf.berkeley.edu/cs262/FFS.pdf), 
which lists Marshall McKusick, Bill Joy (then at Sun), Samuel Leffler (then at LucasFilm) and Robert Fabry as authors.
The paper promises a reimplementation of the Unix filesystem for higher throughput, better allocation and better locality of reference.

## The hardware

It is 1984.
The computers targeted by 4.3BSD are desktop and cabinet workstations.
These are machines with 32-bit data registers and 32-bit address registers.

External data and address bus sizes vary: 
Earlier 68k CPUs had smaller sized buses, but in 1984 the Motorola 68020 debuted.
It was the first 68k to offer buses with the full width of 32 bits, at a budget of ca. 200k transistors on the die.
Later the 68030 integrated the MMU, previously a separate chip,
and the 68040 also integrated the FPU, again previously a separate chip.

Early Sun workstations, the Sun-3 series, feature these CPUs.
But Sun took the designs from the experimental Berkeley RISC systems and released the Sun-4 series in 1986 with SPARC architecture RISC chips.
SPARC architecture is not without compromises, but was very viable and saw continuous development until after the purchase of Sun by Oracle, which then killed both the SPARC, and later also the Itanium CPU architecture.

Curt Schimmel discusses the tradeoffs made by SPARC in the MMU, register and memory access design, and why they made sense. See [UNIX Systems for Modern Architectures](https://www.amazon.de/UNIX-Systems-Modern-Architectures-Multiprocessing/dp/0201633388)[.](http://libgen.rs/book/index.php?md5=0E4A02E80A6250838CB1D3C3A1405CAD) 

In between, in 1985, the MIPS architecture debuted, which is another series of RISC CPU architectures. It also starts out as a fully 32-bit type of system, and found use in SGI workstations. 

HP had another RISC-type of CPU, the PA-RISC, an outgrowth of their "Spectrum" research programme, coming to market in 1986 (and later replaced by Intel's failed Itanium).

Systems pioneer DEC themselves had the VAX, a 32-bit cabinet computer with a CISC CPU, and that since 1977 already.
They would not go RISC until 1992, but then fully 64-bit with the Alpha AXP ("DEC Alpha") architecture.
While interesting, this did not last long: with the sale to Compaq in 1998, the CPU was discontinued, and the IP was sold to Intel in 2001.

In general, workstation type systems in 1984 had main memory in the low two-digit MB range, and ran at clock speeds of two-digit MHz system clocks.

# 4.3BSD's Fast Filing System

## The traditional filesystems shortcomings

The 32-bit VAX systems were being used for typical 1980's workstation work, which include things such as image processing or VLSI chip design.
On these systems, the original Unix filesystem showed structural problems in keeping up with file size, I/O speed, and simple number of files.
Also, the tiny 512-byte I/O size slowed disk subsystem performance considerably.

The paper mentions the strict segregation of filesystem metadata at the front of the file system from the actual data in the back part of the filesystem.

> A 150 MB traditional UNIX file system consists of 4 megabytes of inodes followed by 146
megabytes of data.
> This organization segregates the inode information from the data; thus accessing a file
normally incurs a long seek from the file’s inode to its data.
> Files in a single directory are not typically
allocated consecutive slots in the 4 megabytes of inodes, causing many non-consecutive blocks of inodes to
be accessed when executing operations on the inodes of several files in a directory.

This defines one major goal for BSD FFS: Better filesystem layout, bringing metadata and data closer together,
storing files in a single directory closer together,
and preventing fragmentation of a file into small fragments that can be loaded only inefficiently.

![](/uploads/2023/05/filesystem-fragmentierung.png)
*Fragmentation: Initially, four files are being created, each using 2 blocks.
Then the files B and D are being deleted.
The free space is then being reclaimed by the three-block-sized file E, which is stored in non-adjacent blocks.
This causes small disk seeks, and slow I/O.*

Another goal stated is to increase disk block size.
Larger disk blocks benefit throughput in two ways:
- Larger disk blocks provide larger units of I/O, so more data is transferred in a single I/O operation.
- Larger disk blocks also allow the filesystem to store more file pointers in an indirect block, greatly reducing the number of indirect block accesses.
  This is primarily a problem if indirect blocks are not cached in a file system buffer cache.

The paper quotes the throughput of an already marginally optimized, traditional Unix filesystem at around 4% of the theoretical maximum,
which is abysmally bad.
This is mainly attributed to fragmentation, non-contiguous storage of adjacent blocks in a file.
Defragmentation, already suggested in 1976, was discarded as a non-viable idea.
The authors instead aim for a solution that places files sensibly in the first place.

## BSD FFS innovations

### Cylinder Groups and understanding CHS

The BSD FFS understands the physical layout of a harddisk, with [cylinders, heads and sectors](https://en.wikipedia.org/wiki/Cylinder-head-sector) (CHS).
It divides the disk into cylinder groups, adjacent tracks of all disk heads.

![](/uploads/2023/05/cylinder-groups.png)
*As the disk rotates, various disk heads reach inside the platter stack like a comb. 
Each head marks a track on the disk, which is subdivided into physical disk blocks by the controller hardware.
Together, all tracks marked by all heads form a cylinder.
A cylinder group is a set of consecutive cylinders. (Image: [OSTEP](https://pages.cs.wisc.edu/~remzi/OSTEP/file-ffs.pdf), page 3)*

Each cylinder group becomes a mini-version of a traditional Unix filesystem, with a copy of the superblock, its own local inode area, and local inode and block usage bitmaps.
The usage of bitmaps is also novel, as they replace the free lists used in the traditional filesystem.
As the filesystem has information about the CHS layout, it also makes sure that the superblock is not always placed on the same platter for each copy,
trying to make the filesystem better redundant against harddisk failure.

> # Excursion: Raid and other Efforts at Berkeley
>
> The [RAID paper](https://www2.eecs.berkeley.edu/Pubs/TechRpts/1987/CSD-87-391.pdf) was published only several years later, 
> but [according to Katz](http://web.eecs.umich.edu/~michjc/eecs584/Papers/katz-2010.pdf) was developed also in Berkeley, during the same time frame, 1983/1984.
>
> Katz also mentions that during that time Stonebraker was around, working on Ingres (a Postgres predecessor),
> and refers to his demands for low-commit latency as driving the attempts on improving disk bandwidth with FFS and, later,  RAID.
> Serious work on the RAID taxonomy we know today did not begin before 1987, though.
> 
> The RAID paper was used by many startups and storage companies as the foundation of their development, 
> among them NetApp, and EMC (via Data General's Clariion Disk Array)

BSD FFS not only understood CHS geometry of disks, but also processor speed and disk rotational speed.
This allowed it to configure and record in the superblock an [interleave factor](https://en.wikipedia.org/wiki/Interleaving_(disk_storage)) to optimize disk I/O throughput.

![](/uploads/2023/05/interleave.jpg)
*The harddisk rotates continuously, but the CPU needs time to set up the next transfer.
During this time the head may have moved already past the next block start boundary, and now the system would need to wait one full rotation to be able to write.
Using an appropriate interleave factor, blocks of adjacent numbers are not stored adjacently on disk, but instead other blocks are interleaved in-between.
This gives the CPU enough time to think and set up the next block transfer.*

*The faster the CPU, the lower the interleave factor required.*

All of these optimizations became irrelevant relatively quickly the moment harddrives were sold with integrated controllers,
started to lie about their CHS geometry and ultimately as linear block addresses (LBA) took over.
But for ten to 15 years, this provided a nice performance advantage.

### Large blocks, smaller fragments, and tail packing

Internally, FFS uses logical blocks of at least 4 KB size.
Anything with at least 4 KB block size can create files of 4 GB size with at most two levels of indirection.

Large blocks make for faster I/O, but they also come with storage overhead, as files grow in sizes of blocks.
Since logical blocks in FFS are made up from multiple physical blocks, FFS introduces the concept of fragments to expose the smaller internal physical blocks.
Through tail packing, the ends of multiple files can be stored together in the same logical block, using only as many physical blocks as necessary.

Additional logic was necessary to prevent a slowly growing file from going through phases of fragment-by-fragment growth and constant re-layouting.
To overcome this, space is being pre-allocated to full logical blocks, and tail packing only happens on file close when the preallocation is canceled.

### Long Seek Layout Policy

BSD FFS introduces a number of layout policies that control the placement of new directories, new files and the handling of large files.
Global policies are mostly concerned with choosing a well-suited cylinder group to place data in,
while local policies then handle the placement inside a cylinder group.

The new filesystem layout has cylinder groups. Each has their own inode table, and free space bitmaps for inodes and blocks.
The filesystem aims to prevent fragmentation.

This is of course impossible in certain circumstances:
If, for example, a cylinder group is 512 MB in size, and a file larger than 512 MB is to be written, it will use up one inode in that cylinder group, but all available free blocks are gone.
If a second file is to be placed into this cylinder group, the inode can be used, but the data blocks for that file need to be placed somewhere else – which is undesirable.

It would be better to force a long seek, a switch from one cylinder group to the next, for large files.
The filesystem would profit from forcing such a long seek every megabyte of filesize or so.
This would use up free blocks from one cylinder group to the next, evenly, while at the same time leaving some number of free blocks for other files in each cylinder group.

This would, of course, fragment a file, on purpose, but also make sure the fragments are sufficiently large to allow large file I/O.
Fragmentation (non-adjacent placement of blocks in a file) is only really a performance problem if the fragments are too small to be read efficiently.

### Directory Layout Policy

Files in the same directory are often used together.
It is useful to place all files in the same directory together in the same cylinder group.

Of course, when this is done, it is also necessary to put different directories into different cylinder groups, to ensure even use of the filesystem space available.
That means a shell script such as

```bash
#! /usr/bin/bash

for i in $(seq -w 1 10)
do
  touch file$i
  mkdir dir$i
done
```

will create ten files named `fileXX`, which will all be placed in the same cylinder group as the current directory.

It will also create ten subdirectories of the current directory named `dirXX`.
Each of them will be placed in a different cylinder group, if possible.
FFS will choose the cylinder group that has a greater than average number of free inodes, and the smallest number of directories already in it.

The actual choice of the inode in a cylinder group is "next available", so pretty simple.
But that is not a problem, because the whole cylinder group inode table fits into 8-16 blocks.

For placement of data blocks, a lot of effort is invested into finding rotationally optimal block, given the needed interleave factor for this machine.

BSD FFS requires some free space to be available in the filesystem at all times.
Many of its algorithms degenerate to the performance of the traditional file system if the filesystem fills up more than 90%.

## Other changes and improvements

BSD FFS also removes several limits that came with the traditional filesystem.

### Long Inode Numbers and Block Addresses

For example, [Inode numbers are now 32-bit numbers](https://github.com/dspinellis/unix-history-repo/blob/BSD-4_3_Tahoe-Snapshot-Development/.ref-BSD-4_3/usr/src/sys/h/dir.h#L42).
This increases the number of files possible per filesystem from 64 K to 4 G.

The size of an [inode](https://github.com/dspinellis/unix-history-repo/blob/BSD-4_3_Tahoe-Snapshot-Development/.ref-BSD-4_3/usr/src/sys/h/inode.h#L40-L59) has doubled:
It is now [forced to be 128 bytes](https://github.com/dspinellis/unix-history-repo/blob/BSD-4_3_Tahoe-Snapshot-Development/.ref-BSD-4_3/usr/src/sys/h/inode.h#L61-L65) in size (with 20 unused bytes)
Also, disk block addresses are now 4 bytes.
At 4 KB block size, this is sufficient to account for 4 G blocks, or a maximum of 16 TB filesystem size.  
File length is recorded in a `quad`, allowing for more than 4 G individual filesize.

Inodes now contain 12 direct blocks, and three types of indirect blocks.
At 4 KB block size, this is good for 1024 block addresses per indirect block, resulting in
`12 + 1024 + 1024^2 + 1024^3 = 1074791436` blocks per file, or a maximum filesize just north of 4 TB.

Unix User-ID and Group-ID are still limited to a short, limiting the number of users and groups per system to 64 K.

Space has been preallocated for 8-byte timestamps, even if the time types in the inode are still limited to 4 bytes.

### Long filenames

The traditional filesystem has directory slots of a fixed 16-byte length,
with 2 bytes for the inode number and 14 bytes for the filename.

BSD FFS defined a [more complex directory entry structure](https://github.com/dspinellis/unix-history-repo/blob/BSD-4_3_Tahoe-Snapshot-Development/.ref-BSD-4_3/usr/src/sys/h/inode.h#L61-L65).
A single entry contains a 4-byte inode number, a 2-byte record length and a 2-byte name length, and then the actual filename.
Filenames are limited to 255 bytes for each pathname component,
and directory entries are rounded up in length to the next 4-byte boundary.

Directories are still essentially a linked list, and searching for names in large directories is slow.

Searching for free space in directories is now more complicated:
To create a new directory entry, we now need to search through the directory from the start, trying to find a gap in the current structure that is large enough for the name we are being asked to create.
If none is found, the new name is appended at the end, growing the directory in size.

Free space in directories is never reclaimed through compaction, only eventually re-used if a new name happens to fit. 

### Symlinks

The traditional filesystem allowed a file to have multiple names, using the `link()` system call and the hardlink mechanism.
Hardlinks are limited in number (a `short`, so 64 K names).

They can be lost accidentally, for example, by saving a hardlinked file with certain editors.
If the editor does write a file as `filename.new`, then unlinks the old `filename` and moves the new file into place, the hardlinked nature of the file will be modified.

Hardlinks also reference the original inode of the file multiple times, so they cannot span filesystem boundaries.

BSD introduces a new filetype (`l`, symlink), and places a "replacement filename" in the linked file, which determines the link target location.
It can be an absolute or relative name (relative to the location of the symlink file).

This creates a "soft" or "symbolic link.
Trying to access a symlink will kick off a reinterpretation of the filename in `namei()` using the replacement filename,
resulting in the attempted `open()` system call being deflected to the link target location. 

Since the deflection happens in `namei()`, which can traverse filesystem boundaries, the new link type is not subject to the single filesystem limitation.
It is also not counting towards any link count limits.

### Rename System Call

BSD introduces the `rename()` system call, which previously needed to be implemented as a library function using calls to `unlink()` and `link()`.
Since this uses more than one system call, the operation is not atomic:
It is subject to partial execution, and it is subject to malicious interferences, because it is a multistep process.

### Quotas

BSD also introduces the idea of filesystem usage quotas:
These are soft and hard limits on the number of files and the amount of disk space that a user or a group can use.

In order to implement them in a useful way, the behavior of the filesystem had to be modified:

- It is now a privileged operation to change the owner of a file away from oneself.
  Without that, it is possible to create a directory that is only accessible for oneself, and then gift all files in it to another user.
  The files would then count against that user's quota.
- Similarly, it is now no longer possible to change the group membership of files to just any group.
  Instead, only groups from the user's group set can be used.
- And finally, new directories and files inherit their group from their parent directory, not from a users primary group.
  That way, project directories would contain files counting against a project's quota, not a user's primary group quota.

### Advisory Locking

Advisory file locking is already introduced in 4.2BSD.
For this, the new `flock()` syscall has been implemented.

- Locks can be shared (read locks) or exclusive (write locks).
- They always apply to the entire file, and not to byte ranges.
- No deadlock detection is attempted.
- They are tied to a file descriptor.
  So when a process dies, its file-handles are automatically closed, which also automatically releases all locks held.
  This is very robust, until `dup()` and `fork()` are coming into play. 

Posix later tried to improve on this, introducing a second, completely different system of locks, using `fcntl()`.
This is flawed in different ways, but can do byte-ranges, and it implements some rudimentary deadlock detection.

Kernels that implement both systems such as Linux now have two different,
incompatible file locking implementations that do not know of each other. 

[This article](https://loonytek.com/2015/01/15/advisory-file-locking-differences-between-posix-and-bsd-locks/) discusses all of this some more,
and has example programs.

## Performance

The authors note the following advantages in their paper:

- `ls` and `ls -l` are fast, because the inodes of the files in a single directory are within the same cylinder group.
  Hence, reading and listing a directory is very low on seeks, and on seek distance (except for subdirectories, which are guaranteed to be far away).
  They measure a 8x speedup for directories without subdirectories.
- Utilization of the theoretical maximal bandwidth increased from 3% in the traditional filesystem to 22% or even 47%, depending on the controller hardware used.
  The authors are very proud of the results because they have been achieved on an actual production system with real user production data being layouted,
  and not on a synthetic benchmark layout. Throughput is stable over the lifetime of the filesystem, as its file population changes.

This solves the main drivers for the improvements: Better throughput and a stable layout that does not degrade performance over time.

Additionally, a number of quality-of-life enhancements have been made, enabling more comfortable working in groups, and unlocking new functionality.

While Linux contains no BSD code, the ext2 filesystem is pretty much an implementation-blind rewrite of the BSD FFS for Linux,
recreating the features as described in the literature without using any BSD code.

Both BSD FFS and Linux ext2 are still non-logging filesystems that require a filesystem check after a crash.
They also cannot deal well with directories with many entries, and deal only slightly better with deep directory hierarchies.
Additional changes are required to enable truly large filesystems in order to keep up with increasing storage sizes.

Also, other limitations of more hidden nature still apply:
Several places in the filesystem code are guarded by locks that make scaling certain operations hard on systems with high concurrency.

It would take another ten years, until 1994, for SGI's XFS to tackle these things.
