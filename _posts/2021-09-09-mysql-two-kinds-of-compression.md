---
layout: post
title:  'MySQL: Two kinds of compression'
author-id: isotopp
feature-img: assets/img/background/mysql.jpg
date: 2021-09-09 20:16:47 +0200
tags:
- lang_en
- mysql
- mysqldev
---
I never had much reason to use table compression, so I largely ignored the topic in MySQL. 
I knew that MySQL had table compression since 5.1, but I also knew the implementation was horribly complicated and double stored all data.
There is also page compression, a feature introduced with 5.7, which replaces table compression and works much better.

# Table Compression

[Table Compression](https://dev.mysql.com/doc/refman/8.0/en/innodb-table-compression.html) is available in MySQL 5.1 and newer.
It is used by setting an InnoDB table up with `ROW_FORMAT=COMPRESSED KEY_BLOCK_SIZE=8` or similar, for even smaller key block sizes.
A lot of status tables in `INFORMATION_SCHEMA.%CMP%` are available to monitor it.

Table compression creates smaller pages (in the size you specify with `KEY_BLOCK_SIZE`), and loads and stores compressed pages of this smaller size from and to the buffer pool.
On load, a second uncompressed page in the buffer pool is allocated, and the data is uncompressed and put into this secondary page to work with.

On write, the modified uncompressed page is recompressed and put back into the compressed buffer pool page.
As this happens on write and not on checkpoint, this is not ideal for tables that are written to a lot.
Compression and uncompression happen in the Query thread, that is, the thread of your connection, and therefore single-threaded.

If buffer pool space it tight, uncompressed pages can be evicted, and recreated as needed by decompressing them again.

In order to be able to crash recover MySQL all possible shutdown scenarios, compressed pages are also written to the redo log on checkpointing.
This also leads to larger redo logs, which may need to be upsized to allow for the additional traffic.

# Page Compression

Page compresison was added to MySQL already in version 5.7.
It is a different way of handling compression of data in MySQL:
A transformer stage is inserted into the IO handlers of MySQL, which on flush compressed a page as it is written out, and on read decompressed the data into the buffer pool page.
This is much simpler approach that also interacts with a lot fewer parts of the server.

But since pages still are 16 KB on disk as they are in memory, an additional file system feature is required for this to actually save space:
Hole punching support in the file system.
The compressed page will be shorter than 16 KB, so all file system blocks that are unused at the end of the 16 KB will be marked as "unused" to the operating system.
This works well with all modern Linux kernels, and the ext4 and xfs file systems (and presumably a lot of others as well).
It does not play well with standard NTFS file systems due to the way NTFS handles things internally.

Because page compression is so simple, it is also very simple to configure:
To enable a table for page compression, set the InnoDB table up with `COMPRESSION="zlib"`.
All newly written pages to this table will be compressed.
Old data stays uncompressed.

In order to compress all pages in a table that has just been switched to page compression, run `OPTIMIZE TABLE` on it.
This will recreate the table, using the new options.

The write path for page level compression inserts itself into the [InnoDB page cleaners](https://dev.mysql.com/doc/refman/8.0/en/innodb-parameters.html#sysvar_innodb_page_cleaners).
By default the number is 4, and there can be up to 64.
If your database writes a lot to compressed tables, it may be useful to increase this number.
Since compression uses CPU, it is not useful to set the number larger than the number of available cores.

Reads are done by query threads, except when they are not (They aren't when there is read-ahead happening, in which case it is done by the [background IO threads](https://dev.mysql.com/doc/refman/8.0/en/innodb-parameters.html#sysvar_innodb_read_io_threads)).

There is not much monitoring in place, and it is hardly needed, because page compression is so much simpler.

## Checking compression

To check the degree of compression, look at the files at the file system level:

```console
kris@server:~/sandboxes/msb_8_0_25/data/kris$ ls -lsih keks*
222085022  72M -rw-r----- 1 kris kris 252M Sep  9 15:17 keks2.ibd
222085011 253M -rw-r----- 1 kris kris 252M Sep  9 15:16 keks.ibd
```

We see the apparent file size is the same for the uncompressed and compressed file.
The number of allocated blocks (second column) varies a lot, though.

The original table `keks` has been created as

```sql
mysql [localhost:8025] {msandbox} (kris) > show create table keks\G
       Table: keks
Create Table: CREATE TABLE `keks` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `t` text,
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=458731 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
1 row in set (0.00 sec)
```

A quarter million JSON records have been inserted. The compressed table `keks2` has then been made as

```sql
mysql [localhost:8025] {msandbox} (kris) > create table keks2 like keks;
Query OK, 0 rows affected (0.08 sec)

mysql [localhost:8025] {msandbox} (kris) > alter table keks2 compression="zlib";
Query OK, 0 rows affected (0.03 sec)
Records: 0  Duplicates: 0  Warnings: 0

mysql [localhost:8025] {msandbox} (kris) > insert into keks2 select * from keks;
Query OK, 262144 rows affected (27.53 sec)
Records: 262144  Duplicates: 0  Warnings: 0
```

We can also check `INFORMATION_SCHEMA.INNODB_TABLESPACES` for the compression.

```console
mysql [localhost:8025] {msandbox} (kris) > select name, fs_block_size, 
-> file_size, allocated_size, 
-> allocated_size/file_size* 100 as percent 
-> from information_schema.innodb_tablespaces 
-> where name like "kris/keks%";
+------------+---------------+-----------+----------------+----------+
| name       | fs_block_size | file_size | allocated_size | percent  |
+------------+---------------+-----------+----------------+----------+
| kris/keks  |          4096 | 264241152 |      264245248 | 100.0016 |
| kris/keks2 |          4096 | 264241152 |       74809344 |  28.3110 |
+------------+---------------+-----------+----------------+----------+
2 rows in set (0.00 sec)
```

## Being careful with file copies

The granularity of the file system block size is 4 KB in our file system.
The hole punching works at the block level, so we can free 12 KB, 8 KB or 4 KB of a 16 KB page.
Even if the data in the page compressed to, say, 9 KB, it will still use 3 file system blocks of 4 KB out of the group of 4 that make up the file system storage for a page.
So MySQL will only be able to give back 4 KB of space to the operating system.

Holes in files can fill when you copy the file naively:
Copying `keks2.ibd` around without a hole-aware tool will fill the holes.
That means: the copy of the 72 MB source file will be a 252 MB destination file.
A secure way to copy the file would be  rsync with the appropriate options.

Holes in files are also causing disk seeks.
This is not an issue for any SSD or NVME flash, but can hurt performance on hard disks.
On the other hand, this is 2021, and whoever is still running a database on HDD probably deserves no better.

# TL;DR

Given all of the above, for my usage scenarios there is probably no use for table compression anywhere for any reason.
I should be using page compression everywhere where I need it.
