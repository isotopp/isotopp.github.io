---
layout: post
title:  'A blast from the past'
author-id: isotopp
feature-img: assets/img/background/mysql.jpg
date: 2019-11-18 14:53:14 +0100
tags:
- mysql
- innodb
- lang_en
---
**TL:DR:** If you have long running transactions, MySQL does not
deal well with this, and it will slow down the box. That's
okay as long as you are basically alone on your box, but if you
aren't, the others will hate you.

The database machine 'somehierarchy-02' in a general purpose
load balancer pool for somehierarchy had replication delay.

It's a MySQL replica and is receiving the same write workload
than all the other boxen in that pool. Yet, somehierarchy-03 is
fine, while somehierarchy-02 is not. Both machines have
comparable hardware: -02 and -03 are both Dell M630 with 128 GB
of memory and two SSD. They should behave identically, yet one
runs from memory, but the other is reading 40 MB/s from disk.

![](/uploads/2019/11/symptom-metrics.png)

Machine somehierarchy-02 reading up to 40 MB/s from disk. The
sister box runs from memory.

The objective was to find the root cause for this, as it was
causing replication delay and generally making people unhappy.

Together with a colleague we established that both boxes
replicate from the same master and that they receive identical
binlogs. We did find indeed the same set of GTIDs, a similar
amount of binlog files, and a bit of Ghetto statistics
(`mysqlbinlog -v binlog... | egrep -i '(insert|update|delete)' |
awk ... | sort | uniq -c`) on the active tables per time also
found nothing unusual.

We then did a `mysqldump --no-data schemaname` to validate
that the schemas are identical. They indeed were, same tables,
same table structures, same indexes.

## It's reads, coming from a client

We can therefore rule out anything related to replication or
disk writes. The difference must be in the reads, that is, the
two boxes receive vastly different workload from clients.

Comparing the active `PROCESSLIST` between the two boxes did not
yield results, though. Checking back we found that the problem
had been going away while we were looking. So whatever we were
looking for would not be in processlists, only in logs.

So, do we have logs?

## log_processlist is still a thing

Turns out: we do. The tool
[log_processlist](http://blog.wl0.org/2011/02/log_processlist-sh-script-for-monitoring-mysql-instances/)
is older than time itself, it goes back to before 2007. Simon
Mudd and I wrote that once, to have a flight recorder for
crashed machines.

Basically it dumps data from the operating system and the
various MySQL tables into the directory `/var/log/mysql_pl`, where
we have a weekly ring-buffer like directory structure:

```console
[somehierarchy-02 /var/log/mysql_pl]$ ls -F
Fri/  Mon/  README  Sat/  Sun/  Thu/  Tue/  Wed/
```

When a box crashes or misbehaves, as long as you have access to
this subtree, you can go there and inspect the files to see what
the box did just before it crashed. So we go into `Mon`
subdirectory for Monday, and look into some files, for example
the 10:20 recordings:

```console
[somehierarchy-02 ~]# cd /var/log/mysql_pl/Mon
[somehierzrchy-02 Mon]# ls -l 10_20*
-rw-r--r-- 1 root root 19144 Nov 18 10:20 10_20.innodb.xz
-rw-r--r-- 1 root root  5836 Nov 18 10:20 10_20.unix.xz
-rw-r--r-- 1 root root 18368 Nov 18 10:20 10_20.xz
[somehierarchy-02 Mon]# ls -l 10_21.sys*
-rw-r--r-- 1 root root 14590 Nov 18 10:21 10_21.sys.gz
```

In the 10_20.xz we find the MySQL processlist and a few other
things, in the 10_20.unix file.xz we find the UNIX processlist,
system memory and other system stuff, and in the 10_20.innodb
file there are various InnoDB related table dumps from this
point in time. There is also a dump of the entire sys set of
views every 15 minutes, so 10_21.sys.gz has that.

```console
[somehierarchy-02 /var/log/mysql_pl]# head -3 /tmp/x
Id	User	Host	db	Command	Time	State	Info
33	system user		NULL	Connect	1	Waiting for dependent transaction to commit	NULL
34	system user		NULL	Connect	1	System lock	INSERT INTO ...
```

Checking the processlist shows many sleeping connections. We
filter these and immediately hit paydirt:

```console
[somehierarchy-02 tmp]# awk -F"\t" '$5 != "Sleep" { print $5, $6 }' x | wc -l
27
[somehierarchy-02 tmp]# awk -F"\t" '$5 != "Sleep" { print $5, $6 }' x
Command Time
Connect 1
Connect 1
Connect 1
Connect 1
Connect 1
Connect 1
Connect 2
Connect 2
Connect 2
Connect 2
Connect 2
Connect 39412
Query 33242
Query 33242
Query 33241
Query 24514
Query 20613
Query 14924
Query 6827
Query 3219
Query 1
Query 1
Query 0
Query 0
Query 0
Query 0
```

The "Connect" only means that these are replication threads.
Running Queries have "Query" and here the number is the seconds
of runtime for this query. There are apparently a number of
queries with a large runtime: 33242 seconds are 9.25 hours -
they are running since 1 am.

```console
[somehierarchy-02 tmp]# awk -F"\t" '($5 == "Query" ) && ($6 > 10000) { printf "%s %s %s %s\n", $2, $3, $6, $7 }' x
hadoopuser hadoop-07:62112 33242 Sending data
hadoopuser hadoop-07:62126 33242 Sending data
hadoopuser hadoop-07:62128 33241 Sending data
cronuser cronbox-14:34017 24514 Creating sort index
cronuser cronbox-06:45661 20613 Creating sort index
cronuser cronbox-14:55920 14924 Creating sort index
```

At around 1:00am the `hadoopuser` connected from hadoop-07 to
somehierarchy-02 and started a number of queries:

```console
SELECT ...
FROM MessageLog
WHERE ( `hotelnumber` >= 986116 ) AND ( `hotelnumber` < 1181338 )
```

and similar. They read around 70M rows from MessageLog
each, a table that itself has 540M rows. That takes time.

During that time the "select" statements maintains a read-only
transaction to create a stable view of the table it is reading.
That means that as we change rows in MessageLog the old versions
of the row are being shifted to the Undo log, and while other
transactions read the new version of the row from the
tablespace, these transactions read old versions of the row from
the Undo log.

Or they try. They hit the tablespace first, see a new version of
the row, are being sent one version into the past, find that
this is still too recent, go one step deeper into the past and
so on. We are essentially traversing a linked list on disk,
without caching. MySQL is not really meant to deal well with 9h
old transactions.

We can monitor this:

![](/uploads/2019/11/undo-log.png)

and we will. Not necessarily a thing to alert on at night, but
certainly a thing to check up on early on in debugging.

Certainly a blast from the past: Not just from the past of the
row in a
[MVCC](https://en.wikipedia.org/wiki/Multiversion_concurrency_control)
system, but also a thing [we have seen
before](http://mysqldump.azundris.com/archives/101-House-and-Heisenberg-having-Replication-Delay.html),
and that was 2012. Certainly a blast from the past. 