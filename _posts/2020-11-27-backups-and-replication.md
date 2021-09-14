---
layout: post
title:  'Backups and Replication'
author-id: isotopp
feature-img: assets/img/background/mysql.jpg
date: 2020-11-27 12:40:33 +0100
tags:
- lang_en
- mysql
- mysqldev
---
There was a question at work about MySQL backups and restore. I needed to explain more.

We use databases to make state persistent. That is: As a developer you can think of your database as a single giant, structured global variable with a weird access method, and to make things worse, concurrent access.

> A database is just a global variable to your code

We can log statements that change the state of our database in a log. In MySQL, we call this *The Binlog*.

![](/uploads/2020/11/replication-01.png)

*Making a change to the database, and logging the data changing statement to the binlog.*

When we make a full backup of the database, we just copy away all tables in the data directory while the database does not change. This can be achieved by simply taking the server offline during the copy, or using more elegant methods that do not interrupt production, yet still look the same when done.

If the database does not change while we make the backup, the backup is internally referentially consistent, and it is associated with exactly one binlog position. And to keep things simple, the binlog position is  just the pair `(newest binlog filename, file length)`. So a binlog position looks like `(binlog.000004, 7625)` or similar.

The server will periodically start new binlogs: When it becomes too large, when the server restarts, or when we ask it to do so using a `FLUSH BINARY LOGS` command.

Each data changing transaction is being assigned a unique binlog position, and this way we also get a total order of all transactions (and that is becoming a problem later in the game).

![](/uploads/2020/11/replication-02.png)

*We can see the binlog position as the internal clock of the database: Whenever something changes in the database, it is written to the binlog. Each transaction is assigned a unique binlog position, and thus, transactions also have a total order.*

When we restore from a backup, we are at the backups binlog position of the past, and can then replay statements – beginning with the backups position – to roll forward, until we are at the desired position.

> We can use the binlog to replay history

What the desired position exactly *is* depends a bit on the problem: If we issued a command we wish we had not, the desired position is, of course, exactly before this statement. We then skip the undesirable statement.

How we continue after that statement depends on what that statement was. But if we are lucky we can simply continue to replay statements unchanged.

In complicated cases (We might have changed a table definition wrongly) we might need to replace the content of the binlog with alternate, edited statements. In any case we create a new, different and edited timeline that does not contain the mistake we made.

# Replication is an ongoing live Restore

As early as MySQL 3.23.15 from May 2000, we have replication:

- We restore our original servers data directory to a new machine, effectively cloning it.
- We tell our clone the binlog position of the parent server it was created from.
- We tell this new machine where the parent server is, and give it login credentials.
- The cloned server will then login to the parent, download the binlog as it is written, and apply it.

This is exactly the same process as with a restore and then applying the binlog that has been created since the backup was made. But with replication, it is live and ongoing as new binlog is being created. As a result, we get a cloned server that executes the same statements as its upstream parent, keeping its internal state a mirror copy of the parent.

We called the parent server a *master* back then, and a *primary* or *source server* these days. The cloned server was a *slave* back then and is now a *replica*.

Of course this simplistic approach has all kinds of problems, which then got corrected over time, making replication better, but also more complicated. 

# Splitting Threads

Early replication had a single thread downloading statements, and then applying them. Of course, some statements take longer than others to execute: a large `ALTER TABLE` can take hours to run, depending on the size of the table being altered. During that time replication stops and the binlog does not even leave the source server. This is a bit unfortunate should the source fail during that time.

So the very first thing that got changed is splitting the replication thread in two: The `IO_THREAD` downloads data from the source as quickly as possible, and writes it to the replica as the relay log. Even when the source goes down we still have our local copy.

The `SQL_THREAD` then reads the relay log and executes it in sequence, strictly maintaining transaction order. Whenever it finishes a relay log, it can delete that file and turn to the next one.

This logic, at the core, is unchanged even today:

![](/uploads/2020/11/replication-03.png)

*Simple, asynchronous replication as seen even today.*

# Asynchronous and Semi-Synchronous Replication

We call this kind of replication asynchronous: There is no feedback channel from the replica to the source, and consequently no way for the source to delay the commit and have the application wait until the data has left the machine.

Asynchronous replication scales well, even across long distance links: Applications write to the primary, and don’t wait. The replicas log into the source, download the binlogs and will eventually execute it locally on the replica. Applications reading from the replicas will read outdated state until the replica comes around and catches up.

The main risk is the source going down due to a fault before the binlog has been copied  off. So one innovation is to make the source delay the commit until at least one copy exists on a replica.

For that we need add a communication mechanism to the replica, in which it can signal that is has read a transaction from the binary log, and committed it to the local relay log. Only when the transaction is persisted to disk on the replica, in the relay log, we signal the source, which then lets the transaction commit finish so that the application can continue.

> Semi-Synchronous Replication is Asynchronous Replication with added delays on the commit.

This is *Semi-Synchronous Replication*, *SSR*, in MySQL, and it comes with a number of caveats:

- SSR has a timeout. If a transaction is not acknowledged in time, a message is error logged and the server reverts to regular asynchronous replication. It will flip back to SSR once a replica responds within the timeout window.
- If a source has zero replicas and a really high timeout, it never receives an acknowledgement, and will essentially block all applications. If your requirement is “transactions must be persisted on more than a single machine to be valid”, this is the desired behaviour. If your requirement is “It is more important to persist things at all than to ever hang the business”, then ASR is better than SSR for your use case. Nonetheless we have plenty of outages because of this: primary servers ending up with zero replicas due to bugs or circumstances.
- SSR guarantees that at least one more copy of the transaction exists, but it does not say where. To build a resilient system, you need orchestration to find out where, and make sure you fail to that machine in order to be able to continue. We are using a special program for this kind of orchestration, and it is being ingeniously called [MySQL Orchestrator](https://github.com/openark/orchestrator).
- Depending on where your replicas reside, the most advanced replica server may be in the same data center or AZ as the source. In a scenario where the entire AZ fails this does not help you at all.

# Statement and Row Based Replication

MySQL replication logs statements in the binlog. Unfortunately, not all statements are actually replay-able, because they may not be deterministic.

MySQL knows this, and for the obvious cases logs additional code that makes them deterministic.

```sql
kris@localhost [kris]> flush binary logs;
Query OK, 0 rows affected (0.02 sec)

kris@localhost [kris]> create table t ( d double ); insert into t values (rand()); select d from t;
Query OK, 0 rows affected (0.11 sec)

Query OK, 1 row affected, 1 warning (0.03 sec)

Note (Code 1592): Unsafe statement written to the binary log using statement format since BINLOG_FORMAT = STATEMENT. Statement is unsafe because it uses a system function that may return a different value on the slave.
+--------------------+
| d                  |
+--------------------+
| 0.8351237492962962 |
+--------------------+
1 row in set (0.00 sec)
```

In the binlog, we find (editing out the cruft):

```sql
$ mysqlbinlog binlog.000043
...
#201127 10:45:02 server id 1  end_log_pos 548 CRC32 0x1b4b14a9  Rand
SET @@RAND_SEED1=850981370, @@RAND_SEED2=491246833/*!*/;
#201127 10:45:02 server id 1  end_log_pos 654 CRC32 0xa57c1606  Query   thread_id=229860     exec_time=0     error_code=0
SET TIMESTAMP=1606470302/*!*/;
insert into t values (rand());
...
```

What is being logged is
1. The RAND_SEED values to make the statement deterministic.
2. The timestamp of the server when executing the statement (this will also make the NOW() function deterministic.
3. The actual statement.

Despite the warning, this replicates well, and has done so for the last 20 years. What does not replicate well at all, ever, is stuff like `UPDATE t SET x = x+1 LIMIT 10`. As this lacks an `ORDER BY` clause, the server is free to order the row updates as it wishes, and can (and in NDB cluster actually will!) update 10 random rows, different ones on each instance of replication. It is the `LIMIT` clause that makes this non-deterministic.

Now that limitations of this approach are clear, we can see: We would be better off with logging the rows changed, instead of logging the statements that change them. 

Counterintuitively, for the workloads we have at work, this is also 50% to 66% smaller than the statement itself, even before optimisation and compression.

# Using Row Based Replication

Let’s do this:

```sql
kris@localhost [kris]> set binlog_format = row;
Query OK, 0 rows affected (0.00 sec)

kris@localhost [kris]> drop table t;
Query OK, 0 rows affected (0.03 sec)

kris@localhost [kris]> flush binary logs;
Query OK, 0 rows affected (0.03 sec)

kris@localhost [kris]> create table t ( d double ); insert into t values (rand()); select d from t;
Query OK, 0 rows affected (0.05 sec)

Query OK, 1 row affected (0.01 sec)

+--------------------+
| d                  |
+--------------------+
| 0.7980042936261783 |
+--------------------+
1 row in set (0.00 sec)
```

We find:

```sql
$ mysqlbinlog binlog.000043
...
#201127 10:53:43 server id 1  end_log_pos 598 CRC32 0xdae6423f  Write_rows: table id 233 flags: STMT_END_F

BINLOG '
p8zAXxMBAAAAMAAAAAAAAAAAAOkAAAAAAAEABGtyaXMAAXQAAQUBCAEBAQCZVfvm
p8zAXx4BAAAALAAAAAAAAAAAAOkAAAAAAAEAAgAB/wABJeZMQInpPz9C5to=
'/*!*/;
# at 598
...
```

(You would need to run `mysqlbinlog -vvv` to have the mysqlbinlog command decode the BASE64 for you).

> Row Based Replication wraps the logged row in a special BINLOG statement, because the binlog can hold only statements.

This is interesting, because it tells us: There is no such thing as a Row Based Binary Log at all, the binlog can hold only statements. MySQL worked around this by implementing a BINLOG statement, which takes a single parameter. The parameter is a BASE64 encoded pre- and post-image of the row, a kind of binary patch to the data in the table.

Seeing this, I should be able to take this `BINLOG` statement and run it on the command line of my client:

```sql
kris@localhost [kris]>   BINLOG '
    '> p8zAXxMBAAAAMAAAAAAAAAAAAOkAAAAAAAEABGtyaXMAAXQAAQUBCAEBAQCZVfvm
    '> p8zAXx4BAAAALAAAAAAAAAAAAOkAAAAAAAEAAgAB/wABJeZMQInpPz9C5to=
    '> '/*!*/;
ERROR 1609 (HY000): The BINLOG statement of type `Table_map` was not preceded by a format description BINLOG statement.
```

To make a long story short: If you go back and pick up the preceding `BINLOG` command earlier in the binlog, and then this one, it actually works.

Also interesting: In the earliest versions of MySQL with Row Based logs, the `BINLOG` command lacked all access controls, so by handcrafting the appropriate patches, anybody could change all data anywhere with any permissions - MySQL did not anticipate that somebody would take replication-only special commands and run them on a regular command line. This bug is now a long time fixed.

## Row Based Replication and Filters

Since the earliest days of replication, we could filter the binlog on the primary (using `binlog-do-*` config directives) and the relay log on the replica (using `replicate-do-*` config directives).

Filtering the binlog is never a good idea: It will break your ability to perform point-in-time restores. Filtering the relay log can be done, but most of the config directives that do this are broken:

- `replicate-do-db` and `replicate-ignore-db` are matching the current database in statement based replication, and the actual statements database in row based replication. The statement `use a; insert into b.t values (...);` will be filtered differently in SBR than in RBR under a `replicate-do-db=a` rule. With the default setting of `row-format=MIXED`, the behavior is random, depending on the row format chosen by mysql.
- `replicate-do/ignore-table` are tedious, they require you to state each table explicitly, and nobody really wants to use them/
- `replicate-wild-do/ignore-table` work in SBR and RBR, but [precedence](https://dev.mysql.com/doc/refman/8.0/en/replication-rules-table-options.html) is complicated, and it is adviseable to use either only positive or only negative logic.

With group replication, which we do not discuss here, any filtering will break consistency in the group, so any filters are forbidden.

The summary of all that is basically: Don't use binlog or replication filters, but if you have to, it's best to stick to either `replicate-wild-do-table` or `replicate-wild-ignore-table`.

## Row Based Replication and BLOB columns

Row Based Replication also fails in other interesting ways: Consider a table with a BLOB and a counter.

```sql
kris@localhost [kris]> create table t ( id integer, cnt integer, b blob );
Query OK, 0 rows affected (0.05 sec)
```

When you increment the counter, the entire row is logged, twice: Once as a pre-image, and once again as a post-image. You end up with 4 bytes integer changing, but two full copies of the `BLOB`, which can be very large.

This is how we got the setting `binlog-row-image`, which can be `FULL` (the default), `NOBLOB` or `MINIMAL`. In `NOBLOB` mode, blobs and text fields are not logged unless they change. In `MINIMAL` mode, the pre-image contains only the primary key, and the post-image contains only the changed fields new values.

We can use RBR in `FULL` mode, not only for replication, but also for Change Data Capture, to feed Hadoop and Kafka with it. On the other hand, with  replication chains that are blobbyrequire `NOBLOB` or `MINIMAL` mode to not die on us.

## Row Based Replication and Primary Keys

On the replica, the RBR image needs to be applied. For this, the replica needs to find the row. It uses the pre-image to do this, and when the table has no primary key defined, this can be slow - it ends up being a full table scan.

This is another fun cause of replication delay: Having a table of even moderate size without a primary key in a replication chain that uses RBR will delay the replica, and it will look very busy. The replica will eat a lot of CPU doing in-memory scans to find rows to change, in the most inefficient way possible.

# More complications…

Arriving at this stage took MySQL around 10 years:

- We can now reliably replicate, and build simple replication trees that are one level deep.
- Because of the relay log, binlog positions for the same statement vary between servers - transactions are locally renumbered.
- We can replicate, but the `SQL_THREAD` is a bottleneck: Replication is single-threaded.
- We still don’t have distributed transactions, or a way to handle writes to different primary servers.

It has taken MySQL another 10 years of changes to improve on this, with Global Transaction IDs, Parallel Replication and Group Replication, but that is for another article.
