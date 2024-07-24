---
author: isotopp
title: "MySQL: Upgrading old MySQL instances"
description: |
  Converting a large database to a newer version of MySQL can be done in place,
  using binary database files.
  Or it can be done by dumping the database and loading the dump into a newer version.
  What are the considerations?
date: "2024-07-23T05:06:07Z"
feature-img: assets/img/background/mysql.jpg
toc: true
tags:
- lang_en
- database
- mysql
---

> Dear Kris,
> 
> We have a number of old MySQL instances, version 5.5 and 5.6.
> We want to upgrade them to a current version of MySQL.
> The databases are between 0.5 TB to 8 TB in size.
>
> Unfortunately, using rsync on a stopped MySQL instance is not an option because the versions are too different,
> and the new version seems unable to read the binary data.
> I could use a dump (multi-threaded), but importing a single file with mysql takes forever
> (it would need to be single-threaded).
> 
> Would you simply create a dump per table and then import them in parallel?
> Or has MySQL improved, allowing for better import methods now?

That is a lot to unpack.

# A consistent backup and a binlog position

First off, a backup needs to be consistent.
You cannot make a backup of individual tables, one after the other, and expect the target database to be consistent.
A backup is a backup of all tables referencing each other, at a known binlog position.
Only then a clean cut-over can be done.

We are discussing the why and how in 
[Backups and Replication]({{< relref "2020-11-27-backups-and-replication.md" >}}).

We are discussing the proper `mysqldump` options in
[Ways to run mysqldump]({{< relref "2023-01-03-mysql-ways-to-run-mysqldump.md" >}}).

There are now other, better ways to dump the database, using `mysqlsh`.
This also provides facilities for parallel import.
See 
[Parallel Table Import Utility](https://dev.mysql.com/doc/mysql-shell/8.4/en/mysql-shell-utilities-parallel-table.html).
I have never tested that at scale.
According to the documentation, you need to be at MySQL 5.7 or later for the data source for this to work:
[Schema Dump Utility: Requirements and Restrictions](https://dev.mysql.com/doc/mysql-shell/8.4/en/mysql-shell-utilities-dump-instance-schema.html#mysql-shell-utilities-dump-opt-requirements).

That makes it a non-option for the original ask, and we are limited to traditional options for the task.

# Upgrading in place

MySQL's data files have a defined format that is independent of the various operating system facilities,
and from the way the hardware represents certain data types.
It will not change inside one stable major version (except MySQL 8.0,
and that turned out a major source of downtime and problems for a deployment I was in charge of).

An upgrade of libc that changes collations will not affect MySQL indexes,
because MySQL does not use operating system collations.
It defines its own – they are faster, stable across OS vendors, libc upgrades and other changes, and they are immutable.
A collation, even if faulty, will never change.
To fix bugs, a new collation with a new name will be created.
This has not always been the case, and that is a long and sad story.
Read about it in
[UTF8MB4]({{< relref "2022-01-12-utf8mb4.md" >}}).

MySQL does support upgrading binary data files,
but does so only one version step at a time from one major stable version to the next.

That is, you can safely go from
- 5.5 to 5.6
- 5.6 to 5.7
- 5.7 to 8.0
- 8.0 to 8.4

and specifically from the latest version of the OLD major version to the latest version of the new major version.
To go from 5.5 to 8.4, first upgrade to the latest 5.5 build.
Then go to 5.6, 5.7, 8.0 and 8.4 using the respective latest versions of each.
Use the version-specific upgrade process as documented in the manual,
and test each upgrade before proceeding to the next.

MySQL 8.1, 8.2 and 8.3 have been innovation releases and are not "major stable versions".
Don't use them in production.
Also, while MySQL 9.0 may one time be a long term support release of MySQL once a General Availbility Version is out,
the current version is **not** GA and should not be used in production.

> **Note on Non-GA Versions of MySQL:**
> It is useful to run new versions of MySQL and innovation releases as replicas in production.
> Doing this helps you to stay on top of current developments and get familiar with new features and quirks early.
> An idle replica will check your write-transactions (using SBR) or keep up with the replication stream (using RBR).
> If you feel adventurous, divert a minimal amount of read-transactions to it from the database load balancer to
> check how reads perform.
> 
> Do not use 8.1, 8.2, 8.3 or pre-GA in a productive context or for a primary. 
> They are called "Innovation Releases" for a reason.
> 
> Do use them to experiment and innovate, in a safe way.
> That is what replication is for, and why we still have SBR.

Upgrading in place changes the on-disk format of the database,
the valid syntax of some queries you may use, and the behavior of some data types.
It is a tricky thing and usually requires more than one attempt to get right.

Thus, it is very much recommended you create a new instance from a valid backup,
and make this instance a replica of the primary, old server.

You then stop the replica, perform the upgrade as outlined in the relevant manual
(and the procedure's details change from version to version,
because each major version does have other special concerns),
and then try to restart the replica.

If that works, divert a bit of read-load to the replica to see if your queries are still valid SQL under the new version.
If you are confident everything works, you can point the writes from the primary to the replica and be done with it.

Continue with the next version until done.
This sounds tedious, and it is.
Especially if you have put off upgrading.
Don't do that, upgrade early (at least one replica), and it will hurt a lot less.

# Reading a dump

On disk, a database is a collection of files that represent the actual data in the database,
plus additional structures for quick access, the indexes.
A dump will create a representation of the data in the database in SQL syntax.
The index definitions are also generated, but the actual indexes are not part of the dump.

On reading the dump, the new database instance has to read and parse the SQL.
While this is not as fast as loading binary data, it is usually not a bottleneck.
The MySQL SQL parser is quite fast.

What takes time is the recreation of the indexes after reading a table.
To do that, the database will have to extract the indexed columns from the table by reading through the table,
and sort them.
It will then write out the index as tuples
that contain the indexed columns and a copy of the primary key as a pointer to the full row,
in sorted order.

Sorting the data in index order is what takes time and potentially a lot of memory.
If you do not have enough memory, sorting is done in "runs", with intermediate results on disk,
and a merge sort to build the final version of the index.
The full process is documented in
[Sorted Index Builds](https://dev.mysql.com/doc/refman/8.4/en/sorted-index-builds.html).

Run size is controlled by the variable
[innodb_sort_buffer_size](https://dev.mysql.com/doc/refman/8.4/en/innodb-parameters.html#sysvar_innodb_sort_buffer_size).
Note that this is different from
[sort_buffer_size](https://dev.mysql.com/doc/refman/8.4/en/server-system-variables.html#sysvar_sort_buffer_size)
(a variable used in ORDER BY optimization, but not in InnoDB bulk index builds).

# Beheading

No matter what you do, you can upgrade the database using replicas with minimal operations impact and downtime.

![](/uploads/2024/07/upgrade-01.png)

*A database client writes to a MySQL 5.5 primary, and reads from a MySQL 5.5.
replica.
An additional replica for upgrades has been created from a backup. It is also MySQL 5.5.*

![](/uploads/2024/07/upgrade-02.png)

*The additional replica has been upgraded to MYSQL 5.6,
following the upgrade procedure for this specific version in the manual.
If the replication keeps up, it means the SQL you write is probably good (using SBR).
RBR will simply work.*

![](/uploads/2024/07/upgrade-03.png)

*The replication hierarchy has been extended to one additional replica of MySQL 5.6.
We also have moved the reads from MySQL 5.5 to MySQL 5.6.
At this point in time we can test our reading SQL with the new version, and if that fails, cut back to the old version.
After fixing the problem we try again.*

![](/uploads/2024/07/upgrade-04.png)

*Once we are confident the reads work, we can try the same with the write traffic.
This is the point of no return: The old primary is now idle, and is missing writes.
We can only fail forward, that is, fix the problematic write SQL, as we are committed to the new version.*

![](/uploads/2024/07/upgrade-05.png)

*We can now delete all old version instances, that is, we behead the replication tree.
We can then start over and move to the next version in our upgrade sequence.*


# TL;DR

- If your MySQL instance does not have at least one replica more than you are going to need, you are holding it wrong.
- Upgrade MySQL from one major version to the next one, using in-place upgrades – on a replica.
  - When done, behead the replication tree. That is, point the writes from the old version primary to the new database,
    promoting the replica to the new primary.
  - Make sure to build new replicas using the new version as needed, in time.
- If you must upgrade using a dump, plan this.
  - Dumps are slow because they rebuild indexes.
  - Try this out and time it, optimize it by playing with `innodb_sort_buffer_size`.
