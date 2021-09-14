---
layout: post
title:  'But is it atomic?'
author-id: isotopp
feature-img: assets/img/background/rijksmuseum.jpg
date: 2018-11-29 15:38:05 +0100
tags:
- lang_en
- erklaerbaer
- unix
- linux
- kernel
---
From [Pluspora](https://pluspora.com/posts/310948)

## But is it atomic?

So a few days ago, a colleague asked “Why do we love files on disk?” and in the course of that discussion, I made a comment that, among other things, used the assumption that somebody is updating some file on some Linux system atomically. I wrote:

Let's assume we are using local files, and we do so in a managed, sane way: 

- All these state files are always JSON, 
- there is a JSON schema, so 
  - it is clear which attributes can be there,
  - must be there, and
  - what they mean and
  - what changes to data mean as well.
- **Files are updated atomically**

And immediately the question came up: “I either misunderstand you or I have a gap in the knowledge. When writes to a file became atomic? They are not in general case.”

There is [a Dilbert for that](https://dilbert.com/strip/1995-06-24).

So let’s go back in time, it’s [Greybeards time](http://silvertonconsulting.com/gbos2/)! We’re going to find out where the things you are working with are actually coming from. With sources and references.

## The write(2) system call

A write(2) system call is atomic. The size or amount of data written does not matter. How come?

The system call will, before trying to write data to disk, lock the in-memory inode. That is, it will effectively lock the entire file. It then performs the file changes, and only then unlocks. That can take a long, long, long time, depending on the amount of data and the media the file is being stored on.

It means that on a single physical file in Unix there can be only one write(2) or read(2) system call active at any point in time.

One exception to this is XFS, but only when a file is opened with O_DIRECT. In this special case, XFS instead locks the byte range in a structure attached to the inode, performs the write and then unlocks. So, in XFS with O_DIRECT, any number of concurrent, non-overlapping write(2) system calls can be active.

The Posix specification requires that write(2) is atomic, it does not require that only one write per file can happen.

## That is a horrible thing!

The locking behavior of write(2) (and read(2)) is a problem for databases that require many concurrent writes to happen.

Ingres and some other early SQL databases used to solve that problem by avoiding filesystem entirely, they recommended that tablespaces use raw disks. No filesystem, no files, no locks.

Oracle solved the problem by introducing the concept of tablespaces, which are data storage spaces made up by a fleet of files, e.g. one file for each GB of data storage. Tables are assigned tablespaces, not data files directly. Since there is one write lock per inode, concurrent writes to different files in the same tablespace can happen.

Only in 1994, when SGI published XFS, the actual problem was tackled by splitting the lock at the kernel level for buffer cache less writes. XFS also contained many other improvements over the 1984 BSD Fast Filing System that made it superior for concurrent I/O, streaming I/O, very large file systems, and many other modern use-cases. BSD FFS was in turn an improvement over 1974’s original Unix Filesystem.

In Linux terms, the 1974 Unix Filesystem is mirrored by the Minix File system, the 1984 BSD FFS is roughly equivalent to ext2, and XFS was donated and ported to Linux by SGI, bringing that up into the tech level of 1994.

Sun ZFS and Linux Btrfs are from 2004, and are a complete deviation from earlier Unix ideas. They are a different, much longer writeup, which will actually end with the git and the Blockchain.

## Source Dive: Why are writes atomic?

“Posix requiring a file write to be atomic” comes from the behavior of the original Version 7 Unix and later systems. In there, we find the [write(2)](https://github.com/dspinellis/unix-history-repo/blob/Research-V7-Snapshot-Development/usr/sys/sys/sys2.c#L20) system call, which just calls the [`rdwr()`](https://github.com/dspinellis/unix-history-repo/blob/Research-V7-Snapshot-Development/usr/sys/sys/sys2.c#L30) function.

```c
/*
 * write system call 
 */
write()
{ 
  rdwr(FWRITE);
}
```

You are looking very old K&R style C code here, which predates even ANSI-C and function prototypes, by the way.

So `rdwr()` a few lines down the function calls `plock()`, for as long as we are not dealing with a device special file (Here is where the Ingres “use raw devices” idea comes into play), then does the I/O and finally calls prele().

```c
		if((ip->i_mode&(IFCHR&IFBLK)) == 0)
			plock(ip);
		if(mode == FREAD)
			readi(ip);
		else
			writei(ip);
		if((ip->i_mode&(IFCHR&IFBLK)) == 0)
			prele(ip);
```

`plock()` is what locks the actual inode and the origin of the observed behavior. It is is a misnomer, it’s not a pipe lock, it’s an inode lock.

```c
/*
 * Lock a pipe.
 * If its already locked,
 * set the WANT bit and sleep.
 */
plock(ip)
register struct inode *ip;
{
	while(ip->i_flag&ILOCK) {
		ip->i_flag |= IWANT;
		sleep((caddr_t)ip, PINOD);
	}
	ip->i_flag |= ILOCK;
}
```

See the locking loop here: As as we do not have the lock, indicate desire to get the lock, then sleep on a lock release. When we exit the loop (because the inode is unlocked), lock the inode.

These are simple C Code lines, not special magic macros that translate into special magic TAS machine instructions. That is because the code here is so old that it comes from a world where we have single-die, single-core, single-thread CPUs. If your code is actually running (and this is kernel code!), then you are alone in the entire system. There is nobody else touching these variables as long as you have the CPU.

Under the lock, `rdwr()` above calls `writei()`. And `writei()` has a do loop which uses variables from the u-Area.

```c
	do {
		bn = u.u_offset >> BSHIFT;
		on = u.u_offset & BMASK;
		n = min((unsigned)(BSIZE-on), u.u_count);
		if (type!=IFBLK && type!=IFMPB) {
			bn = bmap(ip, bn, B_WRITE);
			if((long)bn<0)
				return;
			dev = ip->i_dev;
		}
		if(n == BSIZE) 
			bp = getblk(dev, bn);
		else
			bp = bread(dev, bn);
		iomove(bp->b_un.b_addr+on, n, B_WRITE);
		if(u.u_error != 0)
			brelse(bp);
		else
			bdwrite(bp);
		if(u.u_offset > ip->i_size &&
		   (type==IFDIR || type==IFREG))
			ip->i_size = u.u_offset;
		ip->i_flag |= IUPD|ICHG;
	} while(u.u_error==0 && u.u_count!=0);
```

The u-Area of a process at that time was a common data structure that the userland and the kernel used to communicate. Here it is being used to shift syscall parameters into the kernel. The write writes the data at `u.u_base` in userland into the current inode, at `u.u_offset` bytes in the file. There are `u.u_count` many bytes to write.

We convert the `u.u_offset` into a logical block number (the n-th block of a file), and an offset `on` within the block. We need to call `bmap()`. This function turns an inode number and block number within the file into a physical block number on a device.

We can then bring the relevant physical block into the buffer cache, using `bread()`, and then use `iomove()` to modify and dirty the block. As we `brelse()` it, it will eventually be written back to disk later.

There is an optimization here:

When the write is a full block, we do not read the block from disk. We just allocate a buffer using `getblk()`, and fill it. It will overwrite the data on disk completely, there is no old and new data to merge. Disk accesses are slow, in the 1970ies even more so than today, so not reading data that you are going to obliterate completely pays off substantially.

The loop continues as long as there are no errors and still blocks to write.

As we return from `writei()`, `rdrw()` resumes and will eventually `prele()` the inode lock.

## How old is this stuff?

This is of course extremely old code, original V7 unix, almost as old as me: git blames places its age at 41 years. I was in the third class of a German basic school when this was written.

I chose this implementation, because it is very simple, and because it is also what became immortalised in the performance destroying standard which we got to know as Posix File System Semantics.

## Homework

You can have fun to find the matching functionality in a [modern Linux kernel](https://github.com/torvalds/linux), threads, multicore, capabilities, namespaces, cgroups and dynamic data structures and all.

Compare code readability and complexity. Discuss. Is this progress? Why do you think so?

You can try to get a [copy](http://160592857366.free.fr/joe/ebooks/ShareData/Design%20of%20the%20Unix%20Operating%20System%20By%20Maurice%20Bach.pdf) of “[The Design of the Unix Operating System](https://www.amazon.de/Design-UNIX-Operating-System-Prentice/dp/0132017997)” by Maurice J. Bach. It will take you on a guided tour through the origins of our craft and the legacy we build on. The topics discussed in this note can be found on the pages 101ff, “WRITE” and “FILE AND RECORD LOCKING”.

If you are into operating systems, continue reading after Bach: “[The Design and Implementation of the 4.3 BSD Operating System](https://www.amazon.de/Design-Implementation-4-3Bsd-Operating-System/dp/0201061961)” builds on Bach’s work and showcases the progress and inventions that Kirk McKusick, Sam Leffler et al made after that.

If you are into comparative operating system design, read “[Inside Windows NT](https://www.amazon.com/Inside-Windows-NT-Helen-Custer/dp/155615481X)” by Helen Custer after Bach and Leffler/McKusick, and try to understand the different ideas and world view behind that.

## But we don’t use write(2) for atomic file updates!

Well, some of us do, but I agree that it is hard to get right: write(2) and writev(2) are very hard to handle properly in applications, as you need to write everything in a single call.

Most programs use another atomic operation in Unix, the rename(2) system call. You write file.new at your leisure, printf(), chunked writes() and all. When completed, rename file.new to file. This automatically unlinks the old version of file as well.

This is also the recommended approach to atomicity, because unlike write(2) it is stable in the face of the dreaded nightmare file system.

rename(2) was introduced really early in BSD Unix because of specific race problems in the V7 Unix early BSD patched and improved.

Before BSD, we only had link(2) and unlink(2). You can use a combination of these syscalls to implement a rename-like operation, but you need more than one syscall to do that.

In Unix, at the end of a syscall, before return to userland, the scheduler runs (Bach, Chapter 8). That is, at the end of each syscall, a process can be forced to yield the CPU. This is the cause for potential race conditions when not having a rename(2) as a single syscall, and that is why BSD came up with a single syscall for renaming files in the first place.

Renaming files for atomic updates can be taken to an art form: try looking into the Maildir/ implementations as invented by qmail, and implemented in Dovecot and Cyrus

- [Maildir Man Page](http://www.qmail.org/man/man5/maildir.html)
- [On Maildir at DJBs site](https://cr.yp.to/proto/maildir.html)
- [Dan Luu on File Consistency](https://danluu.com/file-consistency/)

And that concludes this issue of Our Systems Legacy.