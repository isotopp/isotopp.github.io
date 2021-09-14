---
layout: post
title:  'MySQL Deadlocks with INSERT'
author-id: isotopp
feature-img: assets/img/background/mysql.jpg
date: 2020-08-02 02:25:21 +0200
tags:
- lang_en
- database
- mysql
- innodb
- mysqldev
- erklaerbaer
---
Support Channel. "Hi, I am getting deadlocks in the database and they occur when I have to rollback the transactions but if we don't have to roll back all transactions get executed." Wait, what? After some back and forth it becomes clear that the Dev experiences deadlocks and has data:

```sql
mysql> pager less
mysql> show engine innodb status\G
...
MySQL thread id 142531, OS thread handle 139990258222848, query id 4799571
somehost.somedomain someuser update
INSERT into sometable (identifier_id, currency, balance ) VALUES ('d4e84cb1-4d56-4d67-9d16-1d548fd26b55', 'EUR', '0')
*** (2) HOLDS THE LOCK(S):
RECORD LOCKS space id 3523 page no 1106463 n bits 224 index PRIMARY of table `somedb`.`sometable` trx id 9843342279 lock mode S locks gap before rec
```

and that is weird because of the `lock mode S locks gap` in the last line. We get the exact same statement with the exact same value on the second thread, but with `lock mode X locks gap`.

Both transactions have an undo log entry of the length 1 - one row, single insert and the insert has an S-lock.

## A mystery INSERT and opaque code

Many questions arise:
- how can an `INSERT` have an S-lock?
- how can a single `INSERT` transaction deadlock?
- what does the originating code look like?

The last question can be actually answered by the developer, but because they are using Java, in true Java fashion it is almost - but not quite - useless to a database person.

```java
@Transactional(propagation = Propagation.REQUIRES_NEW, 
  timeout = MYSQL_TRANSACTION_TIMEOUT,
  rollbackFor = { 
    BucketNotFoundException.class,
    DuplicateTransactionException.class,
    BucketBalanceUpdateException.class
  }, 
  isolation = Isolation.SERIALIZABLE
)
public void initiateBucketBalanceUpdate(Transaction transaction)
  throws BucketBalanceUpdateException,
         DuplicateTransactionException {
  this.validateAndInsertIdempotencyKey(transaction);
  this.executeBucketBalanceUpdateFlow(transaction);
  this.saveTransactionEntries(transaction);
}
```

So, where is the SQL?

This is often a problem - Object Relational Mappers encapsulate the things that go on in the database so much that it is really hard for anybody - Developers, DBAs and everybody else - to understand what actually happens and make debugging quite painful.

Or, if they understand what goes on with the database, to map this to the code.

## TRANSACTION ISOLATION LEVEL SERIALIZABLE

In this case it is solvable, though. The `isolation = Isolation.SERIALIZABLE` is the culprit here.

So when we spoke about [transactions and isolation levels]({% link _posts/2020-07-29-mysql-transactions-the-logical-view.md %}) previously, I made the decision to leave the fourth and most useless isolation level out of the picture: `SET TRANSACTION ISOLATION LEVEL SERIALIZABLE`. [The manual says](https://dev.mysql.com/doc/refman/8.0/en/innodb-transaction-isolation-levels.html#isolevel_serializable):

>  `SERIALIZABLE`
> 
> This level is like `REPEATABLE READ`, but InnoDB implicitly converts all plain `SELECT`  statements to `SELECT ... FOR SHARE` if autocommit is disabled.

It then goes on to explain how `SERIALIZABLE` does nothing when there is no explicit transaction going on. It does not explain what it is good for (mostly: shooting yourself into the foot) and when you should use it (mostly: don't).

It does answer the question of "Where to the S-Locks come from?", though.

The `SERIALIZABLE` isolation mode turns a normal `SELECT` statement into a Medusa's freeze ray that shoots S-Locks all over the tables onto everything it looks at, preventing other threads from changing these things until we end our transaction and drop our locks (And that is why you should not use it, and why I personally believe that your code is broken if it needs it).

## A broken RMW and lock escalation

So instead of a regular Read-Modify-Write

```sql
Session1> START TRANSACTION READ WRITE;
Session1> SELECT * FROM sometable WHERE id=10 FOR UPDATE; -- X-lock granted on rec or gap
-- ... Application decides INSERT or UPDATE
Session1> INSERT INTO sometable (id, ...) VALUES ( 10, ... );
Session1> COMMIT;
```

we get the following broken Read-Modify-Write, minimum:

```sql
Session1> START TRANSACTION READ WRITE;
Session1> SELECT * FROM sometable WHERE id=10 FOR SHARE; -- S-lock granted on rec or gap
-- ... Application decides INSERT or UPDATE
Session1> INSERT INTO sometable (id, ...) VALUES ( 10, ... ); -- lock escalation to X
Session1> COMMIT;
```

The `LOCK IN SHARE MODE` or equivalent `FOR SHARE` is not in the code, it is added implicitly by the isolation level `SERIALIZABLE`.

We get an S-Lock, which is not good for writing. Our transaction now did not get the required locks necessary for reading at the start of the transaction, because the later `INSERT` requires an X-lock, like any write statement would. The database needs to aquire the X-lock, that is, it needs to upgrade the S-lock to an X-lock.

If at that point in time another threads tries to run the exact same statement, which is what happens here, they already hold a second S-lock, preventing the first thread from completing their transaction (it is waiting until the second threads drops the S-lock or it times out).

And then that second thread also tries to upgrade their S-lock into an X-lock, which it can't do, because that first thread is trying to do the same thing, and we have the deadlock and a rollback.

## Reproduction of the problem

We can easily reproduce this.

```sql
Session1> set transaction isolation level serializable;
Session1> start transaction read write;
Query OK, 0 rows affected (0.00 sec)

Session1> select * from kris where id = 10;
+----+-------+
| id | value |
+----+-------+
| 10 |    10 |
+----+-------+

Session1> select * from performance_schema.data_locks\G
...
            LOCK_TYPE: TABLE
            LOCK_MODE: IS
          LOCK_STATUS: GRANTED
            LOCK_DATA: NULL
...
            LOCK_TYPE: RECORD
            LOCK_MODE: S,REC_NOT_GAP
          LOCK_STATUS: GRANTED
            LOCK_DATA: 10
...

Session1> update kris set value=11 where id =10;
```

We change the isolation level to `SERIALIZABLE` and start a transaction (because, as stated in the manual, autocommit does nothing). We then simply look at a single row, and check `PERFORMANCE_SCHEMA.DATA_LOCKS` afterwards. Lo and behold, S-Locks as promised by the manual.

Now, the setup for the deadlock with a second session, by doing the same thing:

```sql
Session2> set transaction isolation level serializable;
Session2> start transaction read write;
Query OK, 0 rows affected (0.00 sec)

Session2> select * from kris where id = 10;
+----+-------+
| id | value |
+----+-------+
| 10 |    10 |
+----+-------+
```

Checking the data_locks table we now see two sets of IS- and S-Locks belonging to two different threads. We go for an `UPDATE` here, because we chose existing rows and row locks, instead of non-existing rows and gap locks:

```sql
Session1> update kris set value=11 where id =10;
... hangs ...
```

and in the other connection:

```sql
Session2> update kris set value=13 where id =10;
ERROR 1213 (40001): Deadlock found when trying to get lock; try restarting transaction
```

Coming back to the first session, this now reads 

```sql
Session1> update kris set value=11 where id =10;
... hangs ...
Query OK, 1 row affected (2.43 sec)
Rows matched: 1  Changed: 1  Warnings: 0
```

The timing given is the time I took to switch between terminals and to type the commands.

## Resolution

Coming back to the support case, the Dev analyzed their code and found out that what they are emitting is actually the sequence

```sql
Session1> SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
Session1> START TRANSACTION READ WRITE;
Session1> SELECT * FROM sometable WHERE id=10; -- implied S-lock granted on rec or gap
-- ... Application decides INSERT or UPDATE

Session1> SELECT * FROM sometable WHERE id=10 FOR UPDATEl -- lock escalation to X
Session1> INSERT INTO sometable (id, ...) VALUES ( 10, ... );
Session1> COMMIT;
```

so their code is already *almost* correct.

They do not need the double read and also not the isolation level `SERIALIZABLE`. This is an easy fix for them and the deadlocks are gone, the world is safe again.

So many things to learn from this:
- You won't need `SERIALIZABLE` unless your code is broken. Trying to use it is a warning sign.
- A deadlock with an S-lock escalation means you need to check the isolation level.
  - In `SERIALIZABLE` it is totally possible to deadlock yourself with a simple invisible `SELECT` and a lone `INSERT` or `UPDATE`.
- The ORM will remove you quite a lot from the emitted SQL. Do you know how to trace your ORM and to get the actual SQL generated? If not, go and find out.
  - A server side trace will not save you - the server is a busy beast.
  - It also cannot see your stackframes, so it can't link your SQL to the line in your code that called the ORM. Yes, in the client side SQL trace, ideally you also want the tracer to bubble up the stack and give you the first line outside of the ORM to identify what is causing the SQL to be emitted and where in the code that happens.
- The deadlock information in `SHOW ENGINE INNODB STATUS` is painfully opaque, but learning to read it is worthwhile.
  - In reproduction, using performance schema is much easier and makes the sequence of events much easier to understand.
  - The server is not very good at explaining the root cause of deadlocks to a developer in the error messages and warnings generated.
