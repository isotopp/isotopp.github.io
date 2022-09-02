---
author: isotopp
title: "MySQL: YOLO mode"
date: 2022-09-02T12:13:00Z
feature-img: assets/img/background/mysql.jpg
tags:
- lang_en
- mysql
- mysqldev
---

OH:
> "And now let's quickly push 2 billion rows into this database VM."

That is best done in YOLO mode.
This is a mode of operation for a database that minimizes disk writes in favor of batched bulk writes.

It is not ACID, so if anything goes wrong during the load, the instance is lost.
That is why it is called YOLO mode.

You are supposed to do this on a spare replica and not the production primary.
If you are not having at least one more replica than needed in your MySQL deployment, I consider your setup defective.

# Disable flush on Commit

> set global innodb_flush_log_at_trx_commit = 2;

[This config variable](https://dev.mysql.com/doc/refman/8.0/en/innodb-parameters.html#sysvar_innodb_flush_log_at_trx_commit) gives up ACID commits:
On COMMIT, data is written to the file system buffer cache, but an *fdatasync(2)* is not enforced.
Instead, data is synced once per second.

# Disable the Doublewrite Buffer

> set global innodb_doublewrite = OFF;

[This config variable](https://dev.mysql.com/doc/refman/8.0/en/innodb-parameters.html#sysvar_innodb_doublewrite) disables the InnoDB DoubleWrite Buffer.
This buffer stores a temporary copy of the full page, which consists of multiple disk blocks.

It can be permanently turned off on file systems that never overwrite data and do not do in-plance updates (btrfs, ZFS), but not on traditional filesystems (XFS, ext4).
It can be permanently turned off on systems where the page size is equal to the guaranteed atomic write block size of the hardware (ie 4 KB page size and Enterprise drives that guarantee atomic block writes of 4 KB blocks, even on power loss).
That is, normal setups need this enabled all of the time, or risk torn pages (partially new and partially old pages) on power loss during page write.

# Unlogged instance

Users of Oracle MYSQL 8.0.21 or newer can have "redo log turned off" and "doublewrite buffer turned off" with a [single command](https://dev.mysql.com/doc/refman/8.0/en/innodb-redo-log.html#innodb-disable-redo-logging):

> alter instance disable innodb redo_log;

This replaces the preceding two config changes:
1. The redo log will never be written in the first place, so the flush log setting is pointless.
2. The doublewrite buffer is not written.

# Turn off the Binlog

MySQL will still write a binlog.
Especially, MySQL 8 always has the binlog on by default.
You may want to turn it off per session:

> set sql_log_bin = off;

This will kill another source of disk writes and potential disk syncs during the load.

# "Delay secondary index generation"

`mysqldump` will still generate a statement that tries to disable secondary index generation:

> alter table t disable keys;

This command is accepted, but it only works in MyISAM, which nobody should use any more in 2022.
You can

> set autocommit = 0;
> set unique_checks = 0;
> set foreign_key_checks = 0;

to YOLO the loading of InnoDB tables, but very large transactions can have their own challenges in MySQL.
So best you commit every 1.000 to 10.000 rows loaded.
Make sure no transaction is ever larger than 1 GB, it will break compressed binlogs, if enabled.
When using group replication, transaction sizes need to be controlled even tighter.

# The meaning of YOLO

This is called YOLO mode for a reason.
Undo all these things after the load completes.
Then check that they are undone.

Only do this on scratch instances, which you can afford to lose.

That means, this should be a replica that you disconnect for a data load, and that on success you can use as a source for [CLONE](https://dev.mysql.com/doc/refman/8.0/en/clone-plugin.html).
On failure, you must be able to afford scrapping it.

If you are running MySQL and are ever short on replicas you are holding it wrong.
Don't complain to me, fix your process.
