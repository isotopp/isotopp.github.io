---
author: isotopp
title: "MySQL: Boiling JFrogs"
date: 2022-08-25T11:13:00Z
feature-img: assets/img/background/mysql.jpg
tags:
- lang_en
- mysql
- mysqldev
---

A work problem:
A commercial application, Artifactory, where we do not control the source or the schema has performance problems involving a certain long running query. 

The data size and row counts are not outrageous, and the query itself and the schema are not broken.
But the data is very skewed and for certain values the query is very slow, as almost the entire table is selected.

We introduce an experimental covering index, and show a 16x improvement, going from 143s to 9s execution time.
We advise the customer to ask for this covering index to be added officially using the normal way through MySQL portal.

# Here we go

A call to DBA:
> We've been investigating performance issues on the Artifactory side and found that our current MySQL primary is sitting at 80-90% I/O utilization. 
> Our next steps would be to see if there is any slow queries without indices or anything else unusual going on from the 3rd party application that we could potentially fix.
>
> How would I get the required access to have a look or is there already data collection in regards to this?

We are running SolarWinds DPM nee Vividcortex, so the easy way out is to point the customer at the SolarWinds access form and wish them luck.

Instead we go and have a look.

# The situation on the ground

Artifactory is a product by a company called JFrogs. 
It stores the output of CI pipelines and serves images for all kinds of backends. 
For us, mostly Docker.

The replication hierarchy is present in two AZs, and is comprised of standard bare metal blades.
That translates into 16C/32T, 128 GB RAM and 2 TB of local disk.
A quick hop onto the box shows a load of 22+, which is very high.
We see around 10k-15k SELECT/s, which is unusual for a primary in our database landscape.

The data directory has a total size of some 400 GB, and the Resident Set Size of the `mysqld` is aroudn 100 GB, fully grown.
That is pretty large for such a small database.

We see a low read load, so the Working Set Size (WSS) still fits into the InnoDB Buffer Pool.
The write load is rather high (hundreds of writes per second, spiking into several thousands), which is very weird for a thing that is supposed to be a metadata store for images.

The replica pool is completely idle:
We see the write load being replicated, but there are no client connections outside the monitoring.
Artifactory is an external product and it knows nothing about replication. 
It does not split read and write handles, and so all of its traffic hits the primary and only the primary. 
It does not scale.

In the past, we also had tables without primary keys in their schema, which is a big issue for scalability for other reasons.
Generally the product claims to be database product agnostic, which among DBA folk is a sure signal for badly optimized schemas and worse scalability.
Being a "database agnostic" Java application, I expect UUIDv4 primary keys, bad Hibernate generated queries and toil from a tangle of foreign key constraints.

# What's visible

There is a bunch of tooling running in our environment that can give you an idea what the box is doing, and what is observed to be slow.
Most of that has a latency, and a history, but I want to see what is happening now, and I want to see it in full fidelity, without aggregations.

So I hop on the box and

```sql
mysql> select time, info from information_schema.processlist where command = "query" and time > 10\G
*************************** 1. row ***************************
time: 58
info: SELECT SUM(bin_length) FROM nodes WHERE node_type=1 and repo = 'docker'
*************************** 2. row ***************************
time: 19
info: SELECT SUM(bin_length) FROM nodes WHERE node_type=1 and repo = 'maven-booking-snapshots'
*************************** 3. row ***************************
time: 147
info: SELECT repo, SUM(CASE WHEN node_type = 0 THEN 1 ELSE 0 END) as folders, SUM(CASE WHEN node_type = 1 THEN 1 ELSE 0 END) as files, SUM(bin_length) FROM nodes GROUP BY repo
*************************** 4. row ***************************
time: 96
info: SELECT SUM(bin_length) FROM nodes WHERE node_type=1 and repo = 'docker'
*************************** 5. row ***************************
time: 97
info: SELECT SUM(bin_length) FROM nodes WHERE node_type=1 and repo = 'docker'
*************************** 6. row ***************************
time: 109
info: SELECT SUM(bin_length) FROM nodes WHERE node_type=1 and repo = 'docker'
6 rows in set (0.00 sec)
```

Here I am asking `I_S.PROCESSLIST` what is currently running and takes longer than 10 seconds.
I find six instances of a query, five of them a reporting query on the total size of what later turns out to be a folder ("sum query") and one of it a reporting query over a set of files and folders ("folder query").
Both are running on the same table, `nodes`.

So let's have a look at the ground truth some more.

# Tables and Sizes

Before we are going to dive into the single repeated slow query seen above, we want to know more about the database size and statistics.

```sql
mysql> select table_name, data_length, index_length from information_schema.tables order by data_length+index_length desc limit 10;
+--------------------------+--------------+--------------+
| TABLE_NAME               | DATA_LENGTH  | INDEX_LENGTH |
+--------------------------+--------------+--------------+
| indexed_archives_entries | 119276568576 | 141969801216 |
| nodes                    |  17985060864 |  26106396672 |
| node_props               |   6278447104 |  10418765824 |
| md_files                 |   4574937088 |   9278537728 |
| binaries                 |   4375724032 |   5129666560 |
| md_ver_user_properties   |   2065678336 |   1154039808 |
| md_files_versions        |   1363902464 |   1270267904 |
| md_ver_repos             |    766492672 |   1069252608 |
| node_meta_infos          |   1807663104 |            0 |
| md_versions              |    557842432 |    969637888 |
+--------------------------+--------------+--------------+
10 rows in set (0.15 sec)
```

and that's a total of 243 GB for the largest table, and some 41 GB for our friend, the `nodes` table, the second largest table in our database.

## Tables of Log-nature

The largest table, `indexed_archives_entries`, is not our problem today.
But the size and the name suggest a thing that happens so often that it is worthwhile mentioning anyway:

Almost all transactional applications have tables that are log-natured.
Their primary key has a time or counter component, or they are partitioned on time.
With all load factors of the system staying the same, just by waiting, these tables will grow without bounds, because they are logs.
If you do not complete the data lifecycle for these structures, they will eventually eat the box.

That is, such tables need to be pruned.
They are a data warehouse inside your transactional system that struggles to get out.
So you either ETL these records into a data warehouse in a regular export.
Or you forego this entirely, put a change even onto a Kafka bus or a syslog, and let another component that is not serving user facing transactional traffic pick it up and aggregate it.

Again, everybody has these tables, and everybody eventually needs to come clean about them, or die from bloat.

# The nodes table

The `nodes` table looks like this:

```sql
show create table nodes\G
*************************** 1. row ***************************
       Table: nodes
Create Table: CREATE TABLE `nodes` (
  `node_id` bigint NOT NULL,
  `node_type` tinyint NOT NULL,
  `repo` varchar(64) COLLATE utf8mb3_bin NOT NULL,
  `node_path` varchar(1024) COLLATE utf8mb3_bin NOT NULL,
  `node_name` varchar(255) COLLATE utf8mb3_bin NOT NULL,
  `depth` tinyint NOT NULL,
  `created` bigint NOT NULL,
  `created_by` varchar(64) COLLATE utf8mb3_bin DEFAULT NULL,
  `modified` bigint NOT NULL,
  `modified_by` varchar(64) COLLATE utf8mb3_bin DEFAULT NULL,
  `updated` bigint DEFAULT NULL,
  `bin_length` bigint DEFAULT NULL,
  `sha1_actual` char(40) COLLATE utf8mb3_bin DEFAULT NULL,
  `sha1_original` varchar(1024) COLLATE utf8mb3_bin DEFAULT NULL,
  `md5_actual` char(32) COLLATE utf8mb3_bin DEFAULT NULL,
  `md5_original` varchar(1024) COLLATE utf8mb3_bin DEFAULT NULL,
  `sha256` char(64) COLLATE utf8mb3_bin DEFAULT NULL,
  `repo_path_checksum` char(40) COLLATE utf8mb3_bin DEFAULT NULL,
  PRIMARY KEY (`node_id`),
  KEY `nodes_repo_path_name_idx` (`repo`,`node_path`(255),`node_name`),
  KEY `nodes_node_path_idx` (`node_path`(255)),
  KEY `nodes_node_name_idx` (`node_name`),
  KEY `nodes_sha1_actual_idx` (`sha1_actual`),
  KEY `nodes_md5_actual_idx` (`md5_actual`),
  KEY `nodes_sha256_idx` (`sha256`),
  KEY `nodes_repo_path_checksum` (`repo_path_checksum`),
  KEY `node_type__repo` (`node_type`,`repo`),
  CONSTRAINT `nodes_binaries_fk` FOREIGN KEY (`sha1_actual`) REFERENCES `binaries` (`sha1`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin
1 row in set (0.00 sec)
```

The table is using a `bigint` primary key, which is a positive surprise for me, expecting a Java UUIDv4.

The index used from the plan below is `nodes_repo_path_name_idx`, which has a prefix of `repo` being used.
`repo` is a `varchar(64) charset utf8mb3` worth up to 194 bytes including length counter overhead.

The plan:

```sql
mysql> explain SELECT SUM(bin_length) FROM nodes WHERE node_type=1 and repo = 'docker'\G
*************************** 1. row ***************************
           id: 1
  select_type: SIMPLE
        table: nodes
   partitions: NULL
         type: ref
possible_keys: nodes_repo_path_name_idx,node_type__repo
          key: nodes_repo_path_name_idx
      key_len: 194
          ref: const
         rows: 13064296
     filtered: 0.29
        Extra: Using where
1 row in set, 1 warning (0.00 sec)
```

Now, I know nothing about Artifactory at all, but this reads to me like a non-critical query for the baseline functionality of Artifactory.
It also looks like something that can and should be cached somewhat.

It is unclear to me and the customer if that query is coming from actual Artifactory or some external monitoring added to it, but it is rather obvious that a rather large part of the load we see is coming from it.

For good measure, here are the table stats:

```sql
mysql> select * from information_schema.tables where table_name = "nodes"\G
*************************** 1. row ***************************
  TABLE_CATALOG: def
   TABLE_SCHEMA: artdb
     TABLE_NAME: nodes
     TABLE_TYPE: BASE TABLE
         ENGINE: InnoDB
        VERSION: 10
     ROW_FORMAT: Dynamic
     TABLE_ROWS: 26008347
 AVG_ROW_LENGTH: 691
    DATA_LENGTH: 17985060864
MAX_DATA_LENGTH: 0
   INDEX_LENGTH: 26106396672
      DATA_FREE: 7340032
 AUTO_INCREMENT: NULL
    CREATE_TIME: 2021-09-15 00:24:08
    UPDATE_TIME: 2022-08-24 10:39:40
     CHECK_TIME: NULL
TABLE_COLLATION: utf8mb3_bin
       CHECKSUM: NULL
 CREATE_OPTIONS:
  TABLE_COMMENT:
1 row in set (0.00 sec)
```

Neither the table definition nor the plan are broken per se,
and the table size is not outrageous.
But we see around 26 MRows in total, and from the plan 13 MRows being considered.

So this looks like a data problem, not a problem with the SQL or the plan.
We have bad selectivity.

# Selectivity matters (This is a data bug)

Running one of the slow queries takes two minutes and a bit, 135 seconds.

```sql
mysql> select sum(bin_length) from nodes where node_type=1 and repo='docker';
+-----------------+
| sum(bin_length) |
+-----------------+
| 330189712981975 |
+-----------------+
1 row in set (2 min 15.02 sec)
```

Let's histogram and check the prevalence of `"docker"` values in this table.

```sql
mysql> select node_type, repo, count(*) as cnt from nodes group by node_type, repo  order by cnt;
...
<two hundred something rows of output cut>
|         0 | auto-trashcan                      |  1487255 |
|         1 | android-snapshots                  |  1698574 |
|         1 | maven-booking-snapshots            |  4910184 |
|         1 | docker                             | 12155158 |
+-----------+------------------------------------+----------+
261 rows in set (17.22 sec)
```

So the column `repo` has 261 different values for 26 MRows.
But the distribution of values is very uneven.
240 values or so have each fewer than 100 KRows (many have fewer than 100) and the value `"docker"` is seen 12M times.

Data is stored in pages of 16 KB, and we get to see an average row length of slightly under 1K in the output further above. 
That means we see 16 or more rows per block. 
But 1/2 of all rows are values `"docker"`, so when we ask questions related to `"repo='docker'"`, we select 50% all rows.

Assuming equidistribution and no clustering that means we are loading all pages of this table and have to go through them. 
For this value of `repo` the index is useless.

"You query is fine, but your data is bad, mate." is something nobody wants to hear.
But selectivity matters:

```sql
mysql> select sum(bin_length) from nodes where node_type=1 and repo='nuget';
+-----------------+
| sum(bin_length) |
+-----------------+
|       270744844 |
+-----------------+
1 row in set (0.11 sec)
```

versus

```sql
mysql> select sum(bin_length) from nodes where node_type=1 and repo='docker';
+-----------------+
| sum(bin_length) |
+-----------------+
| 330108119380433 |
+-----------------+
1 row in set (2 min 23.98 sec)
```

Asking for `repo='nuget'` is solved in 0.11s, but asking for `repo='docker'` is taking 144 seconds.

# A better index for bad data

To resolve the query

```sql
select sum(bin_length) from nodes where node_type=1 and repo='docker';
```

using an index on repo, the database will go into the secondary index and select all rows with `repo="docker"`. 
It needs to narrow this list down to values that are also have `node_type=1`, manually, because the index chosen as per `EXPLAIN` does not have this information.

It will find the primary key of each row in the index, and then go to the primary key. 
Here it will select all rows found, to get the value for `bin_length`.

It will then sum up these numbers to come up with the result.

That's a bunch on index reads on the secondary index, and then using the cleaned up of primary key values from the index to fetch the actual data. 
On rotating disk, it would also involve around 13M disk seeks (at 5ms, so 200 seeks/second), so the query would run for ages (or things are cached very well in memory).

But we can do better, even in a bad situation such as this.

We could either

```sql
ALTER TABLE nodes ADD INDEX (node_type, repo, bin_length)
```

or the equivalent

```sql
ALTER TABLE nodes ADD INDEX (repo, node_type, bin_length)
```

Either will satisfy the (commutative) `AND` condition from our sum query. But we also have the folder query to consider, which is also slow:

```sql
SELECT repo
     , SUM(CASE WHEN node_type = 0 THEN 1 ELSE 0 END) as folders
     , SUM(CASE WHEN node_type = 1 THEN 1 ELSE 0 END) as files
     , SUM(bin_length) 
FROM nodes 
GROUP BY repo
```

This groups by `repo` and otherwise uses the same columns.
As it groups by `repo` it can only profit from an index that has `repo` as the prefix.

We choose

```sql
ALTER TABLE nodes ADD INDEX (repo, node_type, bin_length)
```

as an index that can serve both.

## Covering indexes (or why this is fast)

Running the sum query against this index will dive into the secondary index.

Using the index, we select all rows matching `repo` and `node_type`.
We also forced `bin_length` into this index, but it is not used in selection.

But it's there, as well as the invisible pointer to the full row (the primary key, `id`).
The optimizer knows that, and can use it: It uses the `bin_length` from the index, no need to go to the full row.

Effectively we select a subtree from the index, incidentally also find the data we need to sum up, and serve that back. 
We can do this without having to go back to the primary key, critically saving abunch of seek operations (on rotating disk) and data page access (everywhere).

This speeds up query execution from 140-ish seconds to 4s-9s.

Since we have a bunch of replicas for resilience, even if Artifactory cannot use them, I might as well use them for experimentation.
Running the docker query on the cold (on the replica) cache takes 6m10s.
After cache warmup, it takes 2m15.
After the index juggling (which takes 3m6s) the query resolves in 9s.

That's a 16x speedup.


```sql
# cold box
mysql> select sum(bin_length) from nodes where node_type=1 and repo='docker';
+-----------------+
| sum(bin_length) |
+-----------------+
| 330182660184225 |
+-----------------+
1 row in set (6 min 9.81 sec)

# same query, cache now warm
mysql> select sum(bin_length) from nodes where node_type=1 and repo='docker';
+-----------------+
| sum(bin_length) |
+-----------------+
| 330189712981975 |
+-----------------+
1 row in set (2 min 15.02 sec)

# make me an index
mysql> alter table nodes add index ( node_type, repo, bin_length);
Query OK, 0 rows affected (3 min 6.64 sec)
Records: 0  Duplicates: 0  Warnings: 0

# now running with covering index
mysql> select sum(bin_length) from nodes where node_type=1 and repo='docker';
+-----------------+
| sum(bin_length) |
+-----------------+
| 330202302319881 |
+-----------------+
1 row in set (9.03 sec)
```

This technique of using covering indexes I have learned from an Ex-MySQL colleagie, [Domas Mituzas](https://twitter.com/mituzas), who used it excessively to make Wikipedia fast while working as a Wikimedia DBA.
Thanks, Domas.

# Other observations

## Ohai, MDL!

During our experimentation we found that an additional index can speed some critical queries.
Adding the index on a production replica worked, taking 3 minutes and yielded a speedup of 16x.

Trying to put this index into production failed:
Plenty of slow sum queries pile up with "waiting on metadata lock".
Checking on the `ALTER`, we find it is also waiting on the metadata lock.

I have not checked the source, but I am assuming the MDL protects the table definition.
A running query takes a share lock (S-Lock) on the MDL to make sure the table does not change shape while the query is running.
An `ALTER` takes out an exclusive lock (X-Lock) on the MDL to make sure it is alone while the shape of the table changes.

In MySQL, X-Locks usually have precedence over S-Locks, so asking for an X-Lock will stall all requests for S-Lock.
That means starting the `ALTER` was responsible for all the stalled queries on `nodes` in "waiting for metadata lock" state.

But why was the `ALTER` itself stalled?
While X-Locks have precedence over S-Locks, breaking locks that have already been granted is Not A Thing.
So the `ALTER` has to wait for all the existing S-Locks being held on `nodes` to go away before it can start.
The queries running are slow queries, though, running for around 2 minutes.

So we "just" have to wait two minutes for the `ALTER` to start and then another three minutes for it to complete, I presume.
Unfortunately, a 5m to 7m wait piles up so many queries that we would run out of connection, and also our developers using Artifactory would hate on us.

So I have to terminate the `ALTER` and we choose another approach: 
Change all replicas, fail the application to a replica that is being promoted to primary, and then fix the ex-primary left behind (or simply let the automation reclone it).

## Latency matters

We do this, and we find that Artifactory shows a very much changed behavior:
Write levels are around 10x lower, and disk I/O "util%" drops dramatically, but also the load balancer metrics look a lot more precarious.

We learn that for the application team a switchover means a switchover of the database.
The Artifactory application remains running in the Netherlands, but the database it talks to is now 10ms away in England.
Obviously, this kind of communication latency affects application performance.

After making changes, we fail back.
Both Artifactory and its database are now in the Netherlands, and we get a 10x higher write rate, stable load balancer latencies and again a critically high disk saturation.

## Disk Writes, why?

Well, not critically high.
It turns out that "util%" is not a good metric at all, and also that `dm-7` or other device mapper metrics are often fishy.
Looking at completion latency statistics from `sda` shows we move up around 10% with plenty of headroom, so we are actually fine.

The question remains:
Why does an application serving docker image metadata write to disk so much?

Well, it's writes and we archive them in binlog.
So, let's ghetto some table write stats from a row based replication binlog.

```sql
# cd /mysql/*/logs
# mysqlbinlog -vvv binlog.... | awk '/^### UPDATE/ { print $3 }' | sort | uniq -c | sort -n
...
 112615 `artdb`.`nodes`
 610088 `artdb`.`md_pkg_stats`
 610088 `artdb`.`md_ver_stats`
2901027 `artdb`.`stats`
```

Uh, yes.

If you are turning every image read into a stats write, you have a lot of writes and you don't scale.

Maybe don't log to the production database monolith, but Kafka or syslog stats out, and collect them elsewhere?
It's 2022, after all

## One more slow query

The team finds one more slow query that is breaching our ad-hoc 10s barrier:

```sql
 mysql> SELECT nodes.node_id
      , nodes.node_type
      , nodes.repo
      , nodes.node_path
      , nodes.node_name 
 FROM nodes 
WHERE nodes.node_type=1 
  AND nodes.repo != 'auto-trashcan' 
  AND nodes.repo != 'jfrog-support-bundle' 
  AND lower(nodes.node_name) LIKE 'tax%' LIMIT 1000
```

We already know from other research that `node_type=1` is not very selective.
It indicates directories (0) and files (1).
The negations are also not good at increasing selectivity and indexing on negations is... fraught with problems.
That leaves us with `nodes.node_name`.

Which is wrapped into a function, `lower()`.
This function turns the values in the column into lower case for comparison with a string constant with a wildcard in a like (essentially almost a `BETWEEN 'tax' AND 'tay'`, except that `BETWEEN` is inclusive and `%` is not).

Now in database gnostic SQL one would drop the `lower()` since your default collation is `_ci` (case insensitive) and `_ai` (accent insensitive) anyway.
It serves no function in MySQL.

In all other databases, you'd `lower()` in Java and write normalized data into the database.

But it matters not, we have functional indexes, so instead of indexing `nodes.node_name` we just index `lower(nodes.node_name)` instead.
That changes nothing for MySQL at all, but the optimizer requires this data duplication in order to see the possibility.

Percona discusses [MySQL 8 Functional Indexes](https://www.percona.com/blog/mysql-8-0-functional-indexes/) in their blog, and the [manual](https://dev.mysql.com/doc/refman/8.0/en/create-index.html#create-index-functional-key-parts) has them as well, of course.

# Summary

We run into a database load problem that turns out not to be a size-related or query-related problem at all, but a good case for covering indexes.
Covering indexes are a powerful tool to speed up certain kind of reporting queries that otherwise accumulate a lot of run time.

We also get a glimpse at the data structures in Artifactory, which look a lot better than most DBAs would expect from previous encounters with Hibernate using Java products.

Still the product can benefit a lot from a very modest investment in access modernization (split read and write handles) and segregation of transactional and reporting/log-natured data (cut out log writes, cut out log tables and complete the data lifecycle), which would help it scale to survive in a large Enterprise environment.
Do not weigh down your transactional database with evergrowing log writes, and also do not turn every customer read into a write into your transactional database monolith.
