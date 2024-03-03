---
author: isotopp
title: "50 years in filesystems: 1974"
date: "2023-05-05T12:13:14Z"
feature-img: assets/img/background/rijksmuseum.jpg
toc: true
tags:
- lang_en
- unix
- filesystems
---

Progress is sometimes hard to see, especially when you have been part of it or otherwise lived through it.
Often, it is easier to see if you compare modern educational material, and the problems discussed with older material.
And then look for the research papers and sources that fueled the change.

In Linux (and Unix in general), this is easy.

# 1974 - Unix V7 File System

We find the Unix Version 7 Research Release in Diomidis Spinellis [`unix-history-repo`](https://github.com/dspinellis/unix-history-repo/).
If we are reading
[The Design of the Unix Operating System](https://www.amazon.de/Design-UNIX-Operating-System-Prentice/dp/0132017997) 
by Maurice J. Bach
[,](https://www.pdfdrive.com/the-design-of-the-unix-operating-system-maurice-bach-e25830714.html) 
we would want to look at the
[Research V7 Snapshot](https://github.com/dspinellis/unix-history-repo/tree/Research-V7-Snapshot-Development)
branch of that Repository.

## Machines

It is 1974.
Computers have a single "core", the central processing unit.
In some computers, this is no longer a device with parts, such as boards for the arithmetic logic unit, registers, sequencers and microcode memory, but a single integrated chip.
The new devices are called microcomputers, as opposed to the older generation of minicomputers.
These new CPUs sometimes have thousands of transistors on a single chip.

## Kernels

In Unix, we are dealing with system resources as configured in a header file.
[Default values](https://github.com/dspinellis/unix-history-repo/blob/Research-V7-Snapshot-Development/usr/sys/h/param.h) 
are shown here, and the data structures are arrays, with the values shown being the respective array sizes.
To change them, you edit the file, recompile and relink the kernel, and then reboot.

We have a file system buffer cache using `NBUF` (29) disk blocks of 512 bytes.
We have an inode array of `NINODE` (200) entries, and we can mount up to `NMOUNT` (8) filesystems concurrently.
A user can have `MAXUPRC` (25) processes running, for a total of `NPROC` (150) system processes.
Each process can have up to `NOFILE` (20) files open.

Reading Bach and the original V7 sources is interesting, despite the fact that things are completely outdated, because a lot of core concepts are much clearer,
and a lot of structures are a lot simpler.
Sometimes even archaic.
But this is what defines the behavior of Unix File Systems, to this day, because the accidental behavior of V7 Unix became immortalized in the POSIX standard,
and every file system after had to conform to it.
Check [But Is It Atomic?]({{< relref "/2018-11-29-but-is-it-atomic.md" >}}#source-dive-why-are-writes-atomic) for an example.

# Core Concepts

The basic concepts and structures of Unix Filesystems are from this time, and from this system.
Some of them exist even in modern systems.

The disk is an array of blocks. It begins at block 0, and stretches to block n.
At the beginning of the filesystem we find the [superblock](https://github.com/dspinellis/unix-history-repo/blob/Research-V7-Snapshot-Development/usr/sys/h/filsys.h).
It is located [at block number 1](https://github.com/dspinellis/unix-history-repo/blob/Research-V7-Snapshot-Development/usr/sys/h/param.h#L89) of the filesystem.
The [mount system call](https://github.com/dspinellis/unix-history-repo/blob/Research-V7-Snapshot-Development/usr/sys/sys/sys3.c#L128-L192) finds an empty [mount](https://github.com/dspinellis/unix-history-repo/blob/Research-V7-Snapshot-Development/usr/sys/h/mount.h#L6-L11) structure, reads the superblock off disk and keeps it as part of the mount structure.

## Inode

The in-memory superblock has fields for an array of inodes (a `short`) on disk.
An [inode](https://github.com/dspinellis/unix-history-repo/blob/Research-V7-Snapshot-Development/usr/sys/h/ino.h) is a structure that describes a file as a variable length array of blocks, and some metadata.

```C
struct dinode
{
  unsigned short	di_mode;  /* mode and type of file */
  short	di_nlink;    	      /* number of links to file */
  short	di_uid;      	      /* owner's user id */
  short	di_gid;      	      /* owner's group id */
  off_t	di_size;     	      /* number of bytes in file */
  char  	di_addr[40];	  /* disk block addresses */
  time_t	di_atime;   	  /* time last accessed */
  time_t	di_mtime;   	  /* time last modified */
  time_t	di_ctime;   	  /* time created */
};
#define	INOPB	8	/* 8 inodes per block */
/*
 * the 40 address bytes:
 *	39 used; 13 addresses
 *	of 3 bytes each.
 */
```
*The inode as it appears on disk. 8 inodes fit into a 512-byte disk block, so they are aligned at 64 byte boundaries.*

The inode array on the filesystem has a `short` count, so there can be up to 65535 inodes in a filesystem.
As each file requires an inode, there can only be that many files per filesystem.

Each file has some fixed properties:

- (2 bytes) a `mode` (the file type and access permissions combined).
- (2 bytes) a link count (`nlink`), the number of names this file has.
- (2 bytes) a `uid`, the owner.
- (2 bytes) a `gid`, the owner's group id.
- (4 bytes) a `size`, the length of the file in bytes (defined as an `off_t`, a `long`)
- (40 bytes) an `addr` array of disk block addresses
- (3x 4 bytes) three times, an `atime` (access time), `mtime` (modification time) and `ctime` (supposedly create time, but really the time of the last inode change).

for a total size of 64 bytes.

## bmap()

The `addr` array contains 40 bytes, but it stores 13 disk block addresses, each using 3 bytes.
This is good for 24 bits, or 16 megablocks of 512 bytes, each, for a total filesystem size of 8M kilobytes, or 8 GB.

![](/uploads/2023/05/rl02-front.jpg)
*Front panel of a PDP-11 RL02 disk drive, from [pdp-11.nl](https://www.pdp-11.nl/peripherals/disk/rl-info.html)*.

For comparison, a [PDP-11 RL02K disk cartridge](https://www.pdp-11.nl/peripherals/disk/rl-info.html) held 10.4 MB,
but the newer [RA92](https://lastin.dti.supsi.ch/VET/disks/RA92/EK-ORA90-UG.pdf) could store 1.5 GB.

The `addr` array is being used in the [bmap() function](https://github.com/dspinellis/unix-history-repo/blob/Research-V7-Snapshot-Development/usr/sys/sys/subr.c#L9-L120).
The function consumes an inode (`ip`) and a logical block number `bn` and returns a physical block number.
That is, it maps a block in a file to a block on a disk, hence the name.

The first 10-block pointers are stored directly in the inode.
That is, to access for example block 0, `bmap()` [will look up](https://github.com/dspinellis/unix-history-repo/blob/Research-V7-Snapshot-Development/usr/sys/sys/subr.c#L40) `di_addr[0]` in the inode and return this block number.

Additional blocks are stored in an indirect block, and the indirect block is stored in the inode.
For even larger files, a double indirect block is allocated, and points to more indirect blocks, and finally very large files need even triple indirect blocks.

The code [first determines the number of indirections](https://github.com/dspinellis/unix-history-repo/blob/Research-V7-Snapshot-Development/usr/sys/sys/subr.c#L60-L73),
grab the [appropriate indirect block](https://github.com/dspinellis/unix-history-repo/blob/Research-V7-Snapshot-Development/usr/sys/sys/subr.c#L78),
and then [resolve the indirection](https://github.com/dspinellis/unix-history-repo/blob/Research-V7-Snapshot-Development/usr/sys/sys/subr.c#L91-L112) the appropriate number of times.

This results in the following famous picture:

![](/uploads/1994/02/filestructure.gif)

*Original Unix file structure with increasing numbers of indirect accesses for increasingly larger files.
This forms a compressed array, where short files can be accessed directly with data from the inode, whereas larger files are using increasingly indirect access.
For performance, it is crucial to keep indirect blocks in the file system buffer cache.*

How this scales is dependent on the block size (512 bytes back then, 4096 bytes these days), and the size of a block number in bytes (originally 3 bytes, later 4 or even 8 bytes).

## Atomic writes

Writes to files happen under a lock, so they are always atomic.
This is true even for long writes, which span multiple block boundaries, and is discussed at length in
[But Is It Atomic?]({{< relref "/2018-11-29-but-is-it-atomic.md" >}}#source-dive-why-are-writes-atomic).

This also means that even with multiple writer processes, on a single file there can be only ever one disk write active at any point in time.
This is very inconvenient for authors of database systems.

## Naming files

A directory is a file with a special type (directory), and a [fixed record structure](https://github.com/dspinellis/unix-history-repo/blob/Research-V7-Snapshot-Development/usr/sys/h/dir.h).

```C
#ifndef	DIRSIZ
#define	DIRSIZ	14
#endif
struct	direct
{
	ino_t	d_ino;
	char	d_name[DIRSIZ];
};
```
*A directory entry contains an inode number (an `unsigned int`), and a filename which can be up to 14 bytes long. This fits 32 directory entries into a disk block, and 320 directory entries into the 10 disks blocks that can being referenced by the direct blocks of a directory file.*

The lower filesystem is a sea of files.
Files have no names, only numbers.

The upper filesystem uses a special type of file, with a simple 16-byte record structure,
to assign a name of up to 14 characters to a file.
A special function, `namei()`
[converts a filename into an inode number](https://github.com/dspinellis/unix-history-repo/blob/Research-V7-Snapshot-Development/usr/sys/sys/nami.c#L9-L200).

Pathnames passed to `namei()` are hierarchical:
they can contain `/` as a path separator, and they are being terminated by `\0 (nul)`.
[Pathnames](https://github.com/dspinellis/unix-history-repo/blob/Research-V7-Snapshot-Development/usr/sys/sys/nami.c#L37-L41) either start with `/`,
in which case the traversal begins at the filesystem root, making the filename absolute.
Or they do not, in which case traversal starts at `u.u_cdir`, the current directory.

The function then consumes pathname component after component,
using the currently active directory and searching linearly for the name of the current component in that directory.
It ends when the last pathname component is found, or if at any stage a component is not found.
It also ends,
if at any point in time, for any directory in the path,
[we have no x-permission](https://github.com/dspinellis/unix-history-repo/blob/Research-V7-Snapshot-Development/usr/sys/sys/nami.c#L91).

[Some entries are magical](https://github.com/dspinellis/unix-history-repo/blob/Research-V7-Snapshot-Development/usr/sys/sys/nami.c#L179):
They are mountpoints.
When we encounter them, we change from the directory entry of the current node and filesystem to the root inode of the mounted filesystem.
This makes all filesystems in Unix appear as a single tree, and "drives are changed" by simply going to a different directory.

The function ultimately returns a pointer to the inode for the given pathname, creating (or deleting) the inode (and directory entry) if necessary and desired.
It is a centralized point for directory traversal and access permission checks.

# Novel ideas and Limits

This very early Unix filesystem has a number of very nice properties:

- It presents multiple filesystems as one single unified tree.
- Files are structureless arrays of bytes.
- These arrays are stored internally in a variable depth dynamic array, using a system of increasingly deeply nested indirect blocks. 
  This allows O(1) disk seeks.

- Lower filesystem (creating files) and upper filesystem (structuring files into a tree) are clearly separated.
- Pathname traversal is the only way to get an inode, and along the way permissions are always checked.
- There are very few characters in filenames that are special, `/` and `\0 (nul)`.

We also have clear limitations:

- Files can only have 16M blocks.
- Filesystems can only have 65535 inodes, which is very limited.

And there are a number of annoying limitations:

- There can be only one writer active per file, which kills concurrency.
- Directory lookups are linear scans, so they become very slow for large directories (more than 320 entries).

- There is no system for mandatory file locking.
  There are several systems for advisory file locking.

And a few quirks:

- There is no `delete()` system call.
  We have `unlink()`, which removes a file name,
  and files that have zero names and zero open file handles are being automatically collected.
  This has a few unusual consequences,
  for example, disk space is only freed if a completely unlinked file is also completely closed.
  Generations of Unix sysadmins have asked where their disk space is,
  when a deleted log file in `/var/log` was still kept open by some forgotten process.
- Initially there is no `mkdir()` and `rmdir()` system call, which leads to exploitable race conditions.
  This is fixed in later versions of Unix.

- There are a few operations that are accidentally atomic (like the write(2) system call), or have been made atomic after they have been exploited (`mknod(2)` and `mkdir(2)`). 

Structurally, it is annoying that the inode table and free maps for blocks and inodes are at the beginning of the filesystem, and disk space is allocated linearly from the front of the disk, too.
This leads to a seek intense structure, and enables filesystem fragmentation (in which files are being stored in non-adjacent blocks).

Traversing a directory structure means reading a directories inode at the beginning of the disk,
going to the data blocks further back,
then reading the next inode of the next pathname component from the beginning of the disk,
and going back the data blocks in the back.
This goes back and forth, once for each pathname component, and is not necessarily fast.

## Today, and Improvements

The PDP-11 V7 Unix filesystem got a faithful reimplementation as the  `minix` filesystem, with all its limitations.
In modern Linux, it has been removed from the kernel source tree because it is no longer useful.

We will see in a later article about the BSD fast filesystem, how the data can be better layouted on disk,
how we can implement longer filenames, more inodes, and how we can speed things up a bit by taking physical properties of the disk into account.

Only even newer filesystems will be dealing with linear directory lookup times, single writers or limited file metadata.
