---
layout: post
title:  'MySQL Transactions - the logical side'
author-id: isotopp
feature-img: assets/img/background/mysql.jpg
date: 2020-07-29 20:40:09 +0200
tags:
- lang_en
- mysql
- database
- innodb
- mysqldev
---
After having a look [how MySQL handles transactions physically]({% link
_posts/2020-07-27-mysql-transactions.md %}), let's have a look at what is
going on from a logical point of view.

We are using a test table called demo with an id and a counter field, both
integer. In it we have 10 counters, all set to 0.

```sql
CREATE TABLE `demo` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `counter` int NOT NULL DEFAULT '0',
  UNIQUE KEY `id` (`id`)
)
INSERT INTO `demo` VALUES (1,0);
INSERT INTO `demo` VALUES (2,0);
...
INSERT INTO `demo` VALUES (10,0);
```

In one session, we start a transaction and modify a counter value. We do not
commit anything.

```sql
Session1> start transaction read write;
Session1> update demo set counter = 10 where id = 3;
```

## Isolation

In a second session, we check the data and notice a few things:

```sql
Session2> select * from demo;
+----+---------+
| id | counter |
+----+---------+
|  1 |       0 |
|  2 |       0 |
|  3 |       0 |
|  4 |       0 |
...
```

- We do not see the uncommitted changes to row `id=3` from Session1.
- We do not have to wait - the uncommitted change on the row `id=3` does not
  stall us in any way.

From the previous article we know that MySQL took the older version of the
row and moved it to the Undo Log. It has to do that in order to still have
the data around should we decide to `ROLLBACK`. The new version of the row
in the actual tablespace contains a pointer to the older version of the Row
in the Undo Log.

When looking at the row we see this older version, so something made the
database read the current values of the rows 1, 2, 4, and so on from the
tablespace, but for the row `id=3` sent us to the Undo Log.

This is also a good thing, because we do not have to wait.

### Transaction Isolation Level Read Uncommitted

This is what MVCC - [Multiversion Concurrency
Control](https://en.wikipedia.org/wiki/Multiversion_concurrency_control)
does: It uses the old versions of the row to present us a consistent view of
the data, depending on the `TRANSACTION ISOLATION LEVEL`. This is a thing we
can change:

```sql
Session2> set transaction isolation level read uncommitted;
Session2> select * from demo;
+----+---------+
| id | counter |
+----+---------+
|  1 |       0 |
|  2 |       0 |
|  3 |      10 |
|  4 |       0 |
```

So once we `SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED`, we get to see
the value 10 written by Session1, despite the fact that it never has been
committed.  In fact, if we would `ROLLBACK`, logically it would never have
been there - but still Session2 saw it.

> At `TRANSACTION ISOLATION LEVEL READ UNCOMMITTED` we are reading stuff
> directly from the tablespace file. This can contain data that is not yet
> committed, and due to `ROLLBACK` never will be - mere phantasies. The Undo
> Log is never consulted.

### Transaction Isolation Level Read Committed

If we `SET TRANSACTION ISOLATION LEVEL READ COMMITTED` with the transaction
hanging in Session1 as before , we get to see the counter at row `id=3` as
before, at 0.

```sql
Session2> set transaction isolation level read committed;
Session2> select * from demo;
+----+---------+
| id | counter |
+----+---------+
|  1 |       0 |
|  2 |       0 |
|  3 |       0 |
|  4 |       0 |
```

That is, at this isolation level we will only see data that has been
comitted.

> At `TRANSACTION ISOLATION LEVEL READ COMMITTED` we are reading stuff from
> the tablespace file, unless there is an ongoing transaction for a row. In
> that case, the reader will consult the Undo Log one level deep and show us
> the previous, committed version of the data. We never get to see ephemeral
> data that can be rolled back.

Now, let's commit that change, and check:

```sql
Session1> commit;
```

```sql
Session2> set transaction isolation level read committed;
Session2> select * from demo where id = 3;
+----+---------+
| id | counter |
+----+---------+
|  3 |      10 |
+----+---------+
```

In fact, if we incremented the counter in Session1, we also would see that
in Session2:

```sql
Session1> start transaction read write;
Session1> update demo set counter = counter + 1;
Session1> commit;
```

```sql
Session2> set transaction isolation level read committed;
Session2> select * from demo where id = 3;
+----+---------+
| id | counter |
+----+---------+
|  3 |      11 |
+----+---------+
```

> At `TRANSACTION ISOLATION LEVEL READ COMMITTED`, if we read the same row
> twice, we can see it changing.

### Transaction Isolation Level Repeatable Read

The default transaction isolation level in MySQL is `SET TRANSACTION
ISOLATION LEVEL REPEATABLE READ`. If you never change anything, this is what
you get.

If in Session1 we were to run, this time with autocommit and not inside an
explicit transaction:

```sql
Session1> UPDATE demo SET counter=counter+1;
Session1> UPDATE demo SET counter=counter+1;
Session1> UPDATE demo SET counter=counter+1;
Session1> UPDATE demo SET counter=counter+1;
```

and in Session2 checked repeatedly, we would see the counter increment, as
before:

```sql
Session2> select * from demo where id =3;
+----+---------+
| id | counter |
+----+---------+
|  3 |      12 |
+----+---------+

Session2> select * from demo where id =3;
+----+---------+
| id | counter |
+----+---------+
|  3 |      13 |
+----+---------+
```

But, and that is new, we now get to use read only transactions in Session2.
And that changes behavior:

```sql
Session2> start transaction read only;
Session2> select * from demo where id = 3;
+----+---------+
| id | counter |
+----+---------+
|  3 |      14 |
+----+---------+
Session2> select * from demo where id = 3;
+----+---------+
| id | counter |
+----+---------+
|  3 |      14 |
+----+---------+

Session2> commit;
Session2> select * from demo where id = 3;
+----+---------+
| id | counter |
+----+---------+
|  3 |      16 |
+----+---------+
```

As soon as we `START TRANSACTION READ ONLY`, in this isolation level, we get
a consistent read view. In practice that means that our session is frozen in
time and will no longer see changes to this or any other table that have
been made after we started the transaction.

> At `TRANSACTION ISOLATION LEVEL REPEATABLE READ` we are reading stuff from
> the tablespace, unless it has been changed after we started our
> transaction. In that case, the reader will consult the Undo Log multiple
> levels deep, in order to present us the newest version of the row that is
> older than our read-only transaction.

As soon as we drop our read-only transaction with commit (nothing changed,
so nothing is actually committed) our world jumps forward in time to the
present, skipping any intermediate steps.

### Repeatable Read and Long Running Transactions

Starting a transaction at the default isolation level will force the Undo
Log Purge Thread to stop at the position of our read view. Undo Log entries
will no longer be purged, filling up and growing the Undo Log. Reads and
Index Lookups become more complicated and slower, slowing down the overall
performance of the database.

It is a good idea to not have long running transactions.

Maintenance Operations such as running `mysqldump --single transaction
mydatabase` to make a logical backup achieve a consistent backup my
maintaining a consistent read view by starting a long running transaction. 
As the dump of a large database can take some time, it is a good idea to do
this at a point in time where the database is not so busy.  Specifically
where the write activity is low.  Otherwise the incoming writes will blow up
your Undo Log by the size of the data load, and make everything slow.

While in theory these two operations - a data load and a backup - can happen
concurrently and should not interfere, nothing is for free and the
implementation of consistent read views will function better if you do not
work against it.

The Undo Log will not shrink, but will be freed internally and re-used,
should that space ever be needed. But you will end up, depending on your
version of MySQL, with a very large ibdata1 file or very large Undo Log
segment files.

## Reading Data without Locks

It is also worthwhile to note that all the data reads we have seen so far
are free from locking: There are no stalls or lock-waits that can happen in
these scenarios.

The fact that we have to be able to roll back makes it necessary to make a
copy of a row before we modify it and keep it around.

The fact that most transactions successfully commit and not roll back
suggests that we would do well by putting the new version of the row into
place properly and move the old version to a temporary storage, the Undo
Log, before we throw it away by the way of the Purge Thread. Thay way we
keep the tablespace clean and free from outdated, stale versions of rows.

Looking at all active transactions in the system we can easily determine the
lowest, oldest transaction number in the system. By definition nothing else
can ever reference any row version even oler than that, so these versions
are fair game for the Purge Thread.

By linking old versions of a row, we get a thread from the current version
of the row into the (still visible) past of that row as a linked list.

By choosing a transaction isolation level at will, per connection, each
connection can at any point in time choose to read the current, the most
recently committed or the newest version of the row older than its own
(read-only) transaction.

By committing, a read-only transaction gives up its version of the past,
retiring an older transaction, allowing the Purge Thread to move on and free
Undo Log space.

> At no point in time a read operation is ever stalled by a writer and
> forced to wait. There are no write-locks ever stalling a reader. These two
> operations are completely independent.

For writers, this is quite different, and for good reason.
