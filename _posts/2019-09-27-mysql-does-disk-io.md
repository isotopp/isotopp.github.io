---
layout: post
title:  'MySQL Does Disk I/O'
author-id: isotopp
feature-img: assets/img/background/mysql.jpg
date: 2019-09-27 09:49:03 +0200
tags:
- mysql
- database
- lang_en
---
We had a discussion at work about MySQL doing Disk I/O to a NVME
disk, and if it is valid to turn off the doublewrite buffer when
using XFS.

**TL;DR:** It's not, you can turn off the doublewrite buffer
only on filesystems that never do in-place updates (ZFS, btrfs),
or that have their own doublewrite buffer (ext4 with
`journal=data`). A flash layer underneath the actual filesystem
is likely not going to help you without additional measures.

### Tracing Disk I/O

In order to better show what is going on, I ran an idle instance
with `innodb_use_native_aio = false` for easier tracing, and
here is is the trace:

```console
# lsof -p 29169
…
mysqld  29169 mysql    3uW  REG              253,0 536870912  68238213 /var/lib/mysql/ib_logfile0
mysqld  29169 mysql    4uW  REG              253,0 864026624    178570 /var/lib/mysql/kris/t.ibd
…
mysqld  29169 mysql    9uW  REG              253,0 536870912  68238220 /var/lib/mysql/ib_logfile1
mysqld  29169 mysql   10uW  REG              253,0 415236096  68239130 /var/lib/mysql/ibdata1
mysqld  29169 mysql   11uW  REG              253,0  12582912  68238214 /var/lib/mysql/ibtmp1
…
```

We are using a database `kris` with a test table `t`. The file
handles that are relevant for observation are 4 for the ibd
file, 3 and 9 for the logfiles and 10 for the ibdata1, which
would also be the location of the doublewrite buffer.

I am running an `insert into t values (NULL, RANDOM_BYTES(255))`
into my test table (which has an `id serial` and a `d
varchar(255)`).

```console
[pid 29441] recvfrom(39, "\3insert into t values(NULL, rand"..., 46, MSG_DONTWAIT, NULL, NULL) = 46
```

This is the SQL command coming in over the socket. And we fetch some
randomness:

```console
[pid 29441] openat(AT_FDCWD, "/dev/urandom", O_RDONLY) = 42
[pid 29441] read(42, "\207H\241\254O\317\10\fk\3447\201\277\267\223,Oi\202\272\222\16(\210\333\300'&\302g!&", 32) = 32
[pid 29441] close(42)                   = 0
```

Some action on the metadata, then a log write from the implied
commit:

```console
[pid 29441] pread64(10, "H\252\364\35\0\0\1\255\0\0\0\0\0\0\0\0\0\0\0\0\0,\346\365\0\2\0\0\0\0\0\0"..., 16384, 7028736) = 16384
[pid 29441] pwrite64(3, "\200\201\23D\2\0\0\30\0\0\38bd\08\0\0\0\1\0!\257\23\267>\0\0\r./k"..., 1024, 34426368) = 1024
[pid 29441] fsync(3)                    = 0
```

This is the only `fsync` that contributed to commit-Latency. The write is
now persisted to disk, and can be reconstructed using the unmodified page
from the tablespace and the change information from the redo log during
recovery. 

The modified page is still in memory, though, and in order to reclaim redo
log space, needs to be eventually checkpointed.

This happens later, and with many more `fsync` operations. It does happen in
batch, for many commits and multiple pages, normally, but in our easily
traceable test setup, it's looking like a lot of overhead.

During normal operations, a page often is modified in multiple commits over
a short amount of time. Each of these commits is a separate redo log sync,
but all these changes are being accumulated on the dirty in-memory page, and
get persisted into the tablespace in a single checkpoint write. Also, during
checkpointing one doublewrite buffer worth of pages gets written out in a
single sync operation, so we do see a far better page/sync and MB/sync ratio
then in this test setup.

Anyway, this is what checkpointing to the the doublewrite buffer, at offset
1M in the ibdata looks like:

```console
[pid 29181] pwrite64(10, "\234\v\217Y\0\0\1\255\0\0\0\0\0\0\0\0\0\0\0\1\2&\211\225\0\2\0\0\0\0\0\0"..., 32768, 1048576) = 32768
[pid 29181] fsync(10)                   = 0
```

Metadata update and write to table:

```console
[pid 29179] pwrite64(10, "\234\v\217Y\0\0\1\255\0\0\0\0\0\0\0\0\0\0\0\1\2&\211\225\0\2\0\0\0\0\0\0"..., 16384, 7028736) = 16384
[pid 29179] pwrite64(4, ".KT\0\0\0d\225\0\0d\224\377\377\377\377\0\0\0\1\2&\211\216E\277\0\0\0\0\0\0"..., 16384, 421871616) = 16384
[pid 29179] fsync(4)                    = 0
[pid 29179] fsync(10)                   = 0
```

And the log entry is done:

```console
[pid 29187] pwrite64(3, "\200\201\23E\1\271\0&\0\0\39\22\2\0\201\255\0(\201\20\2\0\201\255\0*\201\20\2\0\201"..., 512, 34426880) = 512
[pid 29187] fsync(3)                    = 0
```

### Why does MySQL do this?

Enterprise Grade hardeware usually guarantees atomic block
writes, even during catastrophic events. Blocks are, depending
on the media, 512 bytes or 4096 bytes in size.

InnoDB, on the other hand, uses 16 KB blocks. So when writing
data back to a table, it is entirely possible for the page write
to be interrupted in the middle, resulting in a page that is
half old and half new. This is often called a *torn page*.

Note that this is for checkpointing only.

When you insert and commit a thing, it is being written to one
`ib_logfile`, and the change is also added to the in-memory
image of the InnoDB page. So on disk, after commit you have an
pre-change image of the page and an image of the change in the
logfile, and in memory you have the changed page - such
in-memory pages that differ from their on-disk counterpart are
called dirty.

The checkpointing is about writing back the dirty page to the
tablefile and getting rid of the log entry. This is being done
for whole InnoDB pages, and with most filesystems it is an
in-place update. So it can result in torn pages, if the write
fails in the middle of a page.

With the doublewrite buffer enabled, the write goes to the
ibdata file first, as we can see in the trace - the write to the
position at 1M offset in the file. Then the same writes are
being spread out to the individual pages in their respective
tablefiles.

This ensures that there is always a whole old page and a log
entry with intructions to patch the old image ("Redo Log
Recovery") or a whole image of the new page on disk inside the
doublewrite buffer, for recovery of torn pages.

### Performance Implications

Having a single doublewrite buffer can in extreme cases make the
doublewrite buffer a point of contention. Percona have shown
that 
[a long time ago](https://www.percona.com/blog/2016/05/09/percona-server-5-7-parallel-doublewrite/)
and also fixed this by having multiple doublewrite buffers.

Note that in  most Unix filesystems, writes to a single file are
serialized on a global lock on the in-memory inode of the file.

So if the doublewrite buffer is part of the ibdata file all
writes to that buffer compete with all other write operations on
that file. And even if you had multiple doublewrite buffers at
different offsets in the same ibdata file, it would not improve
things at all, because of that lock. The best solution would
put each doublewrite buffer into a separate file on its own.

The only filesystem in Linux that does not do this in-memory
inode locking is XFS, and only when the file is being opened in
O_DIRECT mode.

### How are other systems doing it?

Postgres writes a WAL, which is very similar to the redo log
that MySQL writes. The main difference is that they write out a
full page whenever a page transitions from clean to dirty, and
then similar to MySQL write out incremental changes for
additional changes to a page already dirty. Using the WAL, you
can pick up the full page and all additional incremental changes
by simply going through the WAL front to back, and recreate the
page that should have been written. MySQL could do the same and
get rid of the doublewrite buffer writes, but it does not play
well with the concept of the MySQL Redo Log being a ring buffer.

MyRocks, and all other variants of
[LSM](https://en.wikipedia.org/wiki/Log-structured_merge-tree), 
do never overwrite data. They always append to the latest
logfile, and then have a process not entirely unlike the Java
multi-generational garbage collection to compact multiple
logfiles, throwing away deleted data and writing things back in
a more sorted manner. As this rewrites data instead of
overwriting data, not only is this safe in the case of
unexpected shutdowns, it is also very easy to backup and it is,
at least in theory, suitable for object storages as a backing
store for the data.
