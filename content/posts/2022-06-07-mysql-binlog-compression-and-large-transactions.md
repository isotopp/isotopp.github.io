---
author: isotopp
date: "2022-06-07T09:42Z"
feature-img: assets/img/background/mysql.jpg
title: "Binlog Compression and Large Transactions"
published: true
tags:
- database
- mysql
- lang_en
---

([Twitter thread](https://twitter.com/isotopp/status/1532752730229559300), reproduction in english, and update)

On Friday, 2022-06-03, 14:42, we lost a replication hierarchy, on the primary, all replicas down.
At 16:30 the escalation hits my desk, because this one is special.

# Replication stops, and wants more `max_allowed_packet`

There is a sequence of binlogs, each 1 GB in size, as configured, except for the broken one, which is 3 GB.
Replication stops with
```console
Got fatal error 1236 from master when reading data from binary log: 'log event entry exceeded max_allowed_packet; Increase max_allowed_packet on master; the first event '' at 4, the last event read from '../log/binlog.002558' at 19959785, the last byte read from '../log/binlog.002558' at 19959804
```
Trying to run `mysqldump -vvv ...` on the broken binlog fails and produces no output useful for diagnostics.

# Using the flight recorder

We do know the statement failed at 14:42 and we run a copy of [MySQL Flight Recorder]({{< ref "/content/posts/2021-04-22-a-mysql-flight-recorder.md" >}}) on every box, even this one.

Among the many things the flight recorder records is the processlist and also the output of `SHOW ENGINE INNODB STATUS`.
Indeed we find a long running transaction.
At 14:41, we see `Compressing transaction changes`. 

```console
---TRANSACTION 6702541326, ACTIVE (PREPARED) 7419 sec
mysql tables in use 2, locked 2
2185611 lock struct(s), heap size 232317048, 73307452 row lock(s), undo log entries 70077831
MySQL thread id 1532688506, OS thread handle 139765193623296, query id 22431944402 SOME_SERVERNAME 10.10.10.10 SOE_USERNAME Compressing transaction changes.
INSERT IGNORE INTO target_table  SELECT * FROM source_table
```

And at 14:42 the same thing is visible with `waiting for handler commit`.
Then replication died.

# What happened

So this machine is running with compressed binlogs enabled.
It was processing a large `INSERT INTO t SELECT * FROM s` statement to copy rows.
We see `70 077 831` (70M) Undo Log entries.
The transaction compressed data, then commits, then the server dies.
The binlog file is 2GB larger than it should be.

The immediate theory:
Somebody wrote a small statement that produces a very large transaction.
Binlog compression works with compression on a per-event basis, and we do get a very large row change event.
But the zstd compression in MySQL cannot handle events this large.
The size of the binlog suggests a signed 4 byte integer overflow.

Being unable to see the binlog, and getting some garbage error message make this very hard to debug.
Our solution is to reclone the entire hierarchy (which is nasty, because it is a set of machines >10TB each).

Later investigation confirms that there is a binlog compression transaction size limit, but it is apparently even 1 GB, not 2 GB.
This is not too bad a restriction. You probably do not want transactions that large anyway:
They would break group replication, they would take ages to roll back, and they would create a lot of other problems as well.

# Problems and Solutions

So we learn:

- Avoid large transactions. [1000 to 10.000 rows]({{< ref "/content/posts/2020-07-27-mysql-commit-size-and-speed.md" >}}) are probably something you should aim for.
- Configure [max_binlog_cache_size](https://dev.mysql.com/doc/refman/8.0/en/replication-options-binary-log.html#sysvar_max_binlog_cache_size) to under 1 GB. The server will then reject the large transaction instead of committing it to the binlog. This will prevent breaking the replication heirarchy.
  - Maybe similar or a small multiple of `max_allowed_packet`?
  - The default is wrong: `18446744073709547520`, and the manual itself recommends 4 GB, but the product does not set the default to this.
    Given that binlog compression can't do more than 1 GB, that should probably the default.
    MySQL should come with sensible defaults.
- `mysqlbinlog -vvv ...` is not helpful, as it cannot parse this binlog, and the error message given is useless.
  The program should give a proper diagnostic message.
- The server cannot handle this, and the error message shown above about `max_allowed_packet` is misdirecting.
  The server should give proper diagnostic messages.

Once you experience this error, it is rather hard to fix: 
Recloning does it, but that takes long.
Setting the `max_binlog_cache_size` prevents the situation.
