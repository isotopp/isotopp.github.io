---
layout: post
title:  'MySQL Transactions - the physical side'
author-id: isotopp
feature-img: assets/img/background/mysql.jpg
date: 2020-07-27 11:15:58 +0200
tags:
- lang_en
- mysqldev
- mysql
- database
- innodb
- erklaerbaer
---
So you talk to a database, doing transactions. What happens actually, behind the scenes? Let’s have a look.

There is a test table and we write data into it inside a transaction:

```sql
CREATE TABLE t (
  id serial,
  data varbinary(255)
)

START TRANSACTION READ WRITE
INSERT INTO t ( id, data ) VALUES (NULL, RANDOM_BYTES(255))
COMMIT
```

The MySQL test instance we are talking to is running on a Linux machine, and otherwise idle to make observation easier. Also, we configured it with `innodb_use_native_aio = false` because observing actual physical asynchronous I/O and attributing it to the statement that caused it is really hard.

Setting things up this way, we can use lsof and strace to see things. But before we do this, let’s set some expectations and establish some background knowledge.

## The Log/Data Memory/Storage quadrants

![](/uploads/2020/07/transactions-quadrants.png)

*Upper half: Log structures, Lower half: Data structures. Left half: Memory, Right Half: On Disk.*

The diagram above is older than time itself, but it still is structurally true. It shows the data structures involved in writing data to disk when talking about the InnoDB storage engine that we use in MySQL almost exclusively.

InnoDB is a MVCC engine, that is, it uses Multi Value Concurrency Control. What that means exactly is a topic for another article, but in this case it means that for each record multiple versions can exist, and different threads and connections can see different versions of the data in a controlled fashion.

The diagram has four quadrants: 

- The upper half talks about log structures, the lower half about data structures.
    - Things on the upper half are in some Log: The Redo Log, the Undo Log or the Double Write Buffer.
    - Things on the lower half are in some tablespace file, so some .ibd file on disk.
- The left half is about things in memory, not persisted. The right half is about things on disk, stored persistently. 
    - If you kill a machine by pulling a plug, things on the right half survive, and things on the left half are lost.

There is also the binlog, which is used in replication and restore, but it is not in this picture.

## Starting a transaction

When you `START TRANSACTION READ WRITE`, the database takes note of the current transaction number. It does not do much else until you actually write things.

There are other ways to start a transaction: `BEGIN`, `BEGIN WORK`, `SET autocommit` are some ways to do it, but they are not recommended. That is, because they do not carry an explicit write concern and that creates all kind of problems with a MySQL proxy in the chain.

A proxy needs to route an incoming connection to a target database host when the transaction starts. But if that is a read-only transaction that can be satisfied by a replica, or a read-write transaction that can only be satisfied by a primary, is unclear until the first write statement appears. This statement appears maybe even some statements deep inside a transaction, but in any case after the start - and then it is too late to change things.

MySQL proxies therefore route transaction starts preemptively to a primary, unless the read-only intent is made clear in the statement that starts the transaction explicitly.

Only `START TRANSACTION` can do this.

## Using Data Modification Language

The next statement then can write data to the database:

```sql
INSERT INTO t ( id, data) VALUES ( NULL, RANDOM_BYTES(255))
```

is such a statement. It writes a `NULL` to an `auto_increment` field to get a new counter value, and then generates 255 random bytes of data to be written.

The transaction is being built up in memory, in the top left quadrant: A log buffer is being allocated and filled with data, step by step, until the log buffer overflows or the transaction commits.

A second thing happens simultaneously: The data being “overwritten” needs to be saved in order to have it around for rollback - this is more true of an `UPDATE` or `DELETE` than an `INSERT` statement, though.

So the data page where this record is located is loaded from a data file (lower right quadrant) into memory (lower left quadrant), into the InnoDB Buffer Pool. That is a userspace data cache owned by the database process. It is the primary reason for the database process using a lot of memory.

The row being “overwritten” is then being moved out of the table, and moved into the Undo Log. This is purely an in-memory operation, copying data from one page to another. A linked list is being built from the new, current version of the row to this older previous version of the row. This linked list can be long, pointing from the current version of the row to ever older version of that row in the Undo log. Following the list you get to see the past versions of this row, one by one.

If we were to `ROLLBACK` the transaction now, MySQL would move the data back from the Undo Log page into the Tablespace page. This is a comparatively slow operation - MySQL is set up and optimized for transactions being COMMIT’ed instead of rolled back most of the time.

## Comitting

Finally we finish the transaction and tell the database this using

```sql
COMMIT
```

On commit, the log buffer is being written to disk, as a kind of binary diff to the original unchanged data base from the table space. The Undo Log space could be freed at this point, from the point of view of this transaction, because once committed, it can no longer be changed except by a second transaction.

There are other connections, and other transactions in the system that could still make use of this data, and they can prevent the Undo Log entry from being purged. More about that another time, when we look at transactions from a logical point of view and talk about isolation levels.

When we write the Log Buffer out, we write it to the Redo Log. The Redo Log is an on-disk structure, usually taking the form of two files. They are the very first thing a MySQL install creates, so if you install MySQL with the data directory being a new and empty disk, the first two files being created are the two ib\_logfile\* structures. This ensures they are fixed size, immovable ring buffers that are physically not fragmented. They are linear blocks on disk. Writes to the Redo Log are fast, sequential writes, even on rotating hard disks.

After that, we are done - the transaction is committed to stable storage and can no longer be lost. The application can move on.

## After committing: Checkpointing

But wait! Isn’t the `.ibd` tablespace file changed? What about purging the Redo Log? How long can this go on?

We are constantly creating InnoDB Buffer Pool pages that are different from their original image on disk in the tablespace files. These pages are called dirty, and eventually they need to be written back.

We are also constantly filling the Redo Log files, but they are a ring structure with a finite amount of space, and we need to eventually purge the Redo Log and free up space there.

And there may be lulls in the application activity that allow the database to do stuff when it feels idle.

That are three good reasons to actually write dirty InnoDB Buffer Pool pages back to the tablespaces. This is called checkpointing, and it will eventually happen, but hopefully much later than the actual commit.

In checkpointing, we select the oldest entries from the Redo Log, determine which pages in the Buffer Pool they relate to, and then choose these pages for write-back. When this is complete, the on-disk image and the in-memory image are equal, the pages are clean and the Redo Log entries are no longer needed and can be overwritten.

Pages are larger than disk blocks: They are usually 16 KB in size, and disk blocks are traditionally 512 Byte large, and these days  4 KB in size. Enterprise media (HDD, SSD and so on) usually guarantee atomic writes to a block, even in the face of power failure - so there won’t ever be half-written 512 Byte blocks or 4K pages.

But that is not good enough for us. If the power was to fail in the write-back of a page, we would get back a half-written page, and we would not even know where the cutoff is. This is called a torn page scenario and in order to prevent it, we write the set of pages out as a large block to a staging area called the Double Write Buffer first. So there will be a large 1MB write to the DWB first, and then a set of 16K writes to the actual tablespace locations.

After writing out the set of dirty pages, we can mark the Redo Log space as free again and also mark the pages in memory as clean.

## Recovery

If we fail the database before committing, that’s ok. The application has not issued a commit statement, we did not acknowledge the commit, so no contract, and it is totally the obligation of the application to handle this situation.

If we fail the database after committing, the data is in the Redo Log. On Recovery, we load the unaltered image of the page from the tablespace, load the binary diff from the Redo Log and have recreated the dirty page in memory. Eventually, it will be checkpointed.

If we fail the database during checkpointing in the write to the Double Write Buffer, we still have the unaltered image of the page in the table space, and the Redo Log entry, so it is as before.

If we fail the database during checkpointing in the write to the tablespace, creating torn pages, in recovery we can read the pages from the DWB and move them into place, then move on.

There is never any data loss – unless there is a loss of the media the data was on, and it is the job of MySQL replication or of a simple RAID to protect us from that.

## Proof and Observation

Let’s have a quiet instance of a local MySQL with AIO off, as described above, and check the filehandles for a later strace:

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

We are using a database `kris` with a test table `t`. The file handles that are relevant for observation are 4 for the ibd file, 3 and 9 for the logfiles and 10 for the ibdata1, which would also be the location of the Double Write Buffer.

We can see the command coming in:

```console
[pid 29441] recvfrom(39, "\3insert into t values(NULL, rand"..., 46, MSG_DONTWAIT, NULL, NULL) = 46
```

The database now requires some randomness:

```console
[pid 29441] openat(AT_FDCWD, "/dev/urandom", O_RDONLY) = 42
[pid 29441] read(42, "\207H\241\254O\317\10\fk\3447\201\277\267\223,Oi\202\272\222\16(\210\333\300'&\302g!&", 32) = 32
[pid 29441] close(42)                   = 0
```

We observe some action on the table metadata and then the log write from the commit:

```console
[pid 29441] pread64(10, "H\252\364\35\0\0\1\255\0\0\0\0\0\0\0\0\0\0\0\0\0,\346\365\0\2\0\0\0\0\0\0"..., 16384, 7028736) = 16384
[pid 29441] pwrite64(3, "\200\201\23D\2\0\0\30\0\0\38bd\08\0\0\0\1\0!\257\23\267>\0\0\r./k"..., 1024, 34426368) = 1024
[pid 29441] fsync(3)                    = 0
```

This is the only `fsync` that contributed to commit-Latency. The write is now persisted to disk, and can be reconstructed using the unmodified page from the tablespace and the change information from the redo log during recovery.

The modified page is still in memory, though, and in order to reclaim redo log space, needs to be eventually checkpointed.

This happens later, and with many more `fsync` operations. It does happen in batch, for many commits and multiple pages, normally, but in our easily traceable test setup, it’s looking like a lot of overhead.

During normal operations, a page often is modified in multiple commits over a short amount of time. Each of these commits is a separate redo log `fsync` (it's not, there are some ways to cheat a bit). But in the Buffer Pool, on the file side of things, all these changes are being accumulated on the dirty in-memory page, and get persisted into the tablespace in a single checkpoint write. In fact, while there could be thousands of changes to in-memory pages per second, given a liberal amount of memory checkpoints can be spaced minutes apart.

Also, during checkpointing, one Double Write Buffer worth of pages gets written out in a single sync operation, so we do see a far better page/sync and MB/sync ratio than in this test setup.

Anyway, this is what checkpointing to the the Double Write Buffer, at offset 1M in the ibdata looks like:

```console
[pid 29181] pwrite64(10, "\234\v\217Y\0\0\1\255\0\0\0\0\0\0\0\0\0\0\0\1\2&\211\225\0\2\0\0\0\0\0\0"..., 32768, 1048576) = 32768
[pid 29181] fsync(10)                   = 0
```

And there follows again an update of the metadata and a write to the actual tablespace:

```console
[pid 29179] pwrite64(10, "\234\v\217Y\0\0\1\255\0\0\0\0\0\0\0\0\0\0\0\1\2&\211\225\0\2\0\0\0\0\0\0"..., 16384, 7028736) = 16384
[pid 29179] pwrite64(4, ".KT\0\0\0d\225\0\0d\224\377\377\377\377\0\0\0\1\2&\211\216E\277\0\0\0\0\0\0"..., 16384, 421871616) = 16384
[pid 29179] fsync(4)                    = 0
[pid 29179] fsync(10)                   = 0
```

After this, the Redo Log is no longer needed and we can take note of this:

```console
[pid 29187] pwrite64(3, "\200\201\23E\1\271\0&\0\0\39\22\2\0\201\255\0(\201\20\2\0\201\255\0\*\201\20\2\0\201"..., 512, 34426880) = 512
[pid 29187] fsync(3)                    = 0
```

## Writing really a lot of data

When you write (or delete) a lot of data, things are getting a bit complicated. Also, when you have really long running transactions, things can get complicated. Let’s go through a few scenarios:

### Data Loading

An application is performing an initial data load, and reading the equivalent of 100 GB of data one-table-at-a-time in a single commit.

Transactions are large here, larger than a log buffer in memory can hold. In this case, we write out log buffers prematurely to the Redo Log, but without a commit flag at the end. If this crashed before the final commit, we would recover all of this from the Redo Log, then encounter the end of the log without a commit and enter a monstrous Rollback. In the past that was hideously slow, these days it is just slow.

Moral: Really large transactions are less than ideal, but this is rare. Still once upon a time, I have been paid, as a MySQL consultant, to watch a 2h Rollback/Undo Log recovery.

Loading a lot of data will fill up the Redo Log quickly, or it will dirty a large number of pages. Eventually the system will run out of either clean page or Redo Log space, and will feel what we call Checkpointing Pressure. If the Checkpointing Pressure becomes too large, it may even stall, not reacting to user commands for some time.

A system that is consistently seeing a lot of writes can profit from a large Redo Log, and that is a thing that can be configured.

### Data Deletion

Deletion of data is also a write and copy operation: It could be rolled back until it is committed, so on delete data is actually pushed to the Undo Log. Depending on how things are organized, it can also trigger a lot of reorganisation of the Index Trees and other operations.

If you want to delete all data, `TRUNCATE` is better than `DELETE`, because it does not cause these things.

If you want to structure data with regular expirations, have a look at table partitioning and use dynamic DDL to create and drop partitions on a schedule instead of deleting data. This implies a temporal arrangement of the data, so a date or time is becoming part of the primary key.

### Long running transactions

Until you commit, you could roll back. That means the previous version of the row is being held in the Undo Log. In fact, Undo Log purge is a simplistic single threaded thing, so what happens in reality is that the system looks at all active transactions in the system and determines the oldest transaction number in the system that is still active.

It then deletes all Undo Log even older than this, but no more.

So if you

```sql
START TRANSACTION READ WRITE

INSERT INTO t (id, data) VALUES (NULL, RANDOM_BYTES(255))
```

and then go to lunch, purging of the Undo Log stops until this transaction vanishes by ROLLBACK (or disconnect or timeout) or COMMIT. The database will slow down a lot until it becomes barely usable.

![](/uploads/2020/07/transactions-undo-log.png)

*As we build Undo Log, the database slows down. A lot. We kill the connection, the offender returns, and things slow down again, until the root cause is removed.*

I am mentioning this specifically as being problematic, because it happened. With somebody going to lunch after using a Cron Box for interactive data poking, and again in a similar way with Hadoop Data Loaders taking a long, long time to Hadoop Data Load.

Don’t do this. Don’t do this on a box that is seeing any kind of shared usage, especially.

## TL;DR

MySQL takes great care when writing data to disk: As long as the physical media is undamaged, it will not lose data. You can pull the power cable, switch off the server, kill -9 the mysqld process, it matters not: When we return from a COMMIT, we have a valid copy of the data or we have a bug.

The cost for a COMMIT is a single fsync. You decide how many rows go into that single fsync, and we recommend you be somewhat economical (1k-10k rows are ideal from a performance PoV).

Writing the actual data out to disk later in the checkpoint is many more operations and fsync, but you will not notice that in your application unless you really write a lot of data, fast. In this case, some tuning is required.
