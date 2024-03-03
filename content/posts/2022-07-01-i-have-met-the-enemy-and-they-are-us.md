---
author: isotopp
date: "2022-07-01T14:30:00Z"
feature-img: assets/img/background/mysql.jpg
title: "I have met the enemy, and they are us"
published: true
tags:
- database
- mysql
- lang_en
---

Another Friday, another replication hierarchy lost.

# The error from June, July edition?

The errors reported look awfully familiar: Binlog position is supposedly 4, and the error message has text about "max_allowed_packet".
Could it be another instance of [this bug]({{< relref "/2022-06-07-mysql-binlog-compression-and-large-transactions.md" >}}) from early last month?

Indeed, one symptom was "a large binlog, larger than max_binlog_size".
We check.

```console
-rw-r----- 1 mysql mysql 1073794077 Jul  1 06:39 binlog.000914
-rw-r----- 1 mysql mysql 1073869075 Jul  1 07:09 binlog.000915
-rw-r----- 1 mysql mysql 1073741881 Jul  1 09:28 binlog.000916
-rw-r----- 1 mysql mysql 2038358667 Jul  1 11:21 binlog.000917
```

Log ends at 11:21, at twice the expected size.
Meh.

# To the flight recorder

Let's check the [flight recorder]({{< relref "/2021-04-22-a-mysql-flight-recorder.md" >}}), again:

```console
# cd /var/log/mysql_pl/Fri
# for i in 1[012]_??.innodb.xz; do 
>   echo $i;  
>   xz -dc $i | 
>     perl -ne '/(undo log entries) ([0-9]+)/ && $2 > 1000 && print "$2\n";' ;
> done|
> less
...
11_20.innodb.xz
2895
11_21.innodb.xz
2895
11_22.innodb.xz
11_23.innodb.xz
```

# DBA, meet DBA

So what is it this time?

```console
# xz -dc 11_21.innodb.xz| less
623 lock struct(s), heap size 73848, 3548 row lock(s), undo log entries 2895
MySQL thread id 186615979, OS thread handle 140545428498176, query id 2978139105 localhost root Waiting for semi-sync ACK
INSERT LOW_PRIORITY IGNORE INTO `schema`.`_table_new` (`id`, ...`) 
  SELECT `id`, ... FROM `schema`.`table` LOCK IN SHARE MODE /*pt-online-schema-change 63828 copy table*/

```

This is an `INSERT ... SELECT ...`, generated from Percona Online Schema Change.
The transaction has some 2895 rows open, so in order for this to be a problem the average row length must be very large.

Let's check:

```console
root@instance-1009 [schema]> show table status like 'table'\G
*************************** 1. row ***************************
           Name: table
         Engine: InnoDB
        Version: 10
     Row_format: Dynamic
           Rows: 2437
 Avg_row_length: 3350975    <-- average!
    Data_length: 8166326272 <-- 8-ish GB used
Max_data_length: 0
   Index_length: 3194880    <-- almost no secondary index
      Data_free: 57958989824 <- also spiky usage, 53 GB free space
 Auto_increment: 546211
    Create_time: 2020-12-08 02:25:41
    Update_time: 2022-07-01 10:11:12
     Check_time: NULL
      Collation: latin1_swedish_ci
       Checksum: NULL
 Create_options: row_format=DYNAMIC
        Comment:
1 row in set (0.00 sec)
```

Ok, so we have 3.3 MB row size, on the average (peak blob size is 6.7 MB or so).
Checking the schema shows us two `MEDIUMTEXT` columns.

# Analysis

The mitigation from [last month]({{< relref "/2022-06-07-mysql-binlog-compression-and-large-transactions.md" >}}) had not been implemented, yet.
It has now been escalated.

The event triggering the outage was a transaction larger than 1 GB, as before, in the face of binlog compression.
The program triggering the large transaction was a DBA maintenance job running Percona Online Schema Change.

Percona Online Schema Change has no logic to prevent large transactions from occuring.
It should maybe check average row size, or check largest row size in the table, and cut smaller pieces so that the `INSERT ... SELECT` it generates always stays below 1G.

Or it should accept that the `INSERT ... SELECT` may fail, if `max_binlog_cache_size` has been set, and retry with smaller steps then.
The second idea would be better, I believe.

Again, the flight recorder has been invaluable in nailing down the root cause.
