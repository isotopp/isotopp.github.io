---
layout: post
title:  'MySQL: Locks and Deadlocks'
author-id: isotopp
feature-img: assets/img/background/mysql.jpg
date: 2020-08-01 14:11:37 +0200
tags:
- lang_en
- database
- mysql
- innodb
- mysqldev
- erklaerbaer
---
In a [previous article]({% link _posts/2020-07-30-mysql-transactions---writing-data.md %}) we wrote data to the database using atomic update statements, and then using transactions with `SELECT ... FOR UPDATE`. In this article we will look at what happens when we continue doing this, in a more complicated way. Source code for this article is also [available on github.com](https://github.com/isotopp/mysql-dev-examples/blob/master/mysql-deadlock/deadlock.py).

## A simple row lock

But first let's do things manually: We create a table `kris` with an integer primary key column and a secondary unindexed data column. We are filling it with some records with gaps between the primary keys.

We then `START TRANSACTION READ WRITE` and `SELECT ... FOR UPDATE` a record:

```sql
Session1> create table kris ( id serial, value integer );
Session1> insert into kris values (10, 10), (20, 20), (30, 30),(40, 40);

Session1> start transaction read write;
Session1> select * from kris where id = 10 for update;
+----+-------+
| id | value |
+----+-------+
| 10 |    10 |
+----+-------+
```

[The table `PERFORMANCE_SCHEMA.DATA_LOCKS`](https://dev.mysql.com/doc/refman/8.0/en/performance-schema-data-locks-table.html) will show us what happened, and [the manual section on locking](https://dev.mysql.com/doc/refman/8.0/en/innodb-locking.html) explains what we are looking at and what we can expect.

```sql
Session1> select * from performance_schema.data_locks\G
...
            LOCK_TYPE: TABLE
            LOCK_MODE: IX
          LOCK_STATUS: GRANTED
            LOCK_DATA: NULL
...
            LOCK_TYPE: RECORD
            LOCK_MODE: X,REC_NOT_GAP
          LOCK_STATUS: GRANTED
            LOCK_DATA: 10
```

The `SELECT ... FOR UPDATE` created a `LOCK_TYPE: TABLE` table-level lock with `LOCK_MODE: IX`. This is an intention-lock set by `FOR UPDATE` which indicates the desire to set X-locks (exclusive-locks, write-locks) on rows.

The statement then proceeded to actually create a row-lock, at the record level: We see `LOCK_TYPE: RECORD` with `LOCK_DATA: 10`, so the record `id=10` has been locked. The `LOCK_MODE: X, REC_NOT_GAP` indicates a lock on the record only, not on the gap before the record.

## A lock on a nonexistent row

Adding to the preceding transaction, we now also search for a non-existent row, using `FOR UPDATE` to signal our intent to later create this row. Since the row does not exist, the result set is empty:

```sql
Session1> select * from kris where id = 35 for update;
Empty set (0.00 sec)
```

Reusing the table-level IX lock from before, we now see a third entry in `PERFORMANCE_SCHEMA.DATA_LOCKS`:

```sql
Session1> select * from performance_schema.data_locks;
...
            LOCK_TYPE: RECORD
            LOCK_MODE: X,GAP
          LOCK_STATUS: GRANTED
            LOCK_DATA: 40
...
```

This, too, is a record-level lock, but this time it is `LOCK_MODE: X,GAP` and `LOCK_DATA: 40`. What we get here is a lock on the space between the rows `id=30` (excluding) and `id=40` (including), preventing other threads from inserting a row `id=35`.

## Inserting into a locked gap, with timeouts.

We can try do demonstrate that with a second session:

```sql
Session2> start transaction read write;
Session2> insert into kris values (33, 33);
... hangs ...
^C^C -- query aborted
ERROR 1317 (70100): Query execution was interrupted
```

While the `SELECT ... FOR UPDATE` had a where clause of `WHERE id=35`, the lock covers the entire interval (30, 40], and our attempt to insert a record with `id=33` hangs and has to wait until either the locking transaction is committed or our attempt times out. This can be a long wait: by default, `innodb_lock_wait_timeout` is set to 50 seconds.

We can change that:

```sql
Session2> set session innodb_lock_wait_timeout = 3;
Session2> start transaction read write;
Session2> select time(now()); insert into kris values (33, 33); select time(now());
+-------------+
| time(now()) |
+-------------+
| 17:52:28    |
+-------------+
ERROR 1205 (HY000): Lock wait timeout exceeded; try restarting transaction
+-------------+
| time(now()) |
+-------------+
| 17:52:32    |
+-------------+
```

We are rolling back all our transactions, and reset the table `kris` to the initial 4 tuples ((10,10), (20,20), (30,30), (40,40)).

## InnoDB handles Deadlocks

Whenever we collect locks in a non-atomic fashion there is a risk of deadlocking.

A deadlock is any situation where a thread `A` holds a resource `1` and wants to lock a resource `2`, where at the same time a thread `B` holds the lock on `2` and wants a lock on `1`.

`A` holds lock `1` and needs a lock on `2` to complete and release both locks, while `B` holds the lock on `2` and needs the lock on `1` to complete and release both locks. There is no way to resolve this situation except with intervention from the outside, forcing one transaction to roll back (and hopefully retry). There is no problem for either A or B to complete the operation, but not while both are trying to finish concurrently.

The deadlock scenario is only possible because `A` and `B` do not aquire locks in a canoncial order: Had `B` also aquired the locks in numerically ascending order (`1`, `2`), the transactions would have had serialized themselves successfully, and no forced conflict resolution would have been necessary. You can think of the rollback with a later retry as a clumsy, forced serialisation of events instead.

More complicated scenarios with 3 or more threads and larger circular dependencies are possible.

So, let's excercise a deadlock with two sessions:

```sql
Session1> start transaction read write;
Session1> select * from kris where id = 30 for update;
+----+-------+
| id | value |
+----+-------+
| 30 |    30 |
+----+-------+
```

and in the other session:

```sql
Session2> start transaction read write;
Session2> select * from kris where id = 10 for update;
+----+-------+
| id | value |
+----+-------+
| 10 |    10 |                                          
+----+-------+
```

Now that both threads hold their first resource, let's get their respective opposite to complete the deadlock. Session1 hangs, because it waits for Session2 to release the lock on `id=10`.

```sql
Session1> select * from kris where id = 10 for update;
... hangs ...
```

And Session2, trying to lock `id=30`, which is held by Session1, then is being detected and rolled back forcibly:

```sql
Session2> select * from kris where id = 30 for update;
ERROR 1213 (40001): Deadlock found when trying to get lock; try restarting transaction     
```

At the same time Session1 can complete the statement:

```sql
Session1> select * from kris where id = 10 for update;
+----+-------+
| id | value |
+----+-------+
| 10 |    10 |
+----+-------+
1 row in set (8.74 sec)
```

The time reported is the time this session hung waiting for the lock to be granted.

After the rollback `PERFORMANCE_SCHEMA.DATA_LOCKS` looks like this:

```sql
Session2> select lock_type, lock_mode, lock_data, lock_status from performance_schema.data_locks;
+-----------+---------------+-----------+-------------+
| lock_type | lock_mode     | lock_data | lock_status |
+-----------+---------------+-----------+-------------+
| TABLE     | IX            | NULL      | GRANTED     |
| RECORD    | X,REC_NOT_GAP | 30        | GRANTED     |
| RECORD    | X,REC_NOT_GAP | 10        | GRANTED     |
+-----------+---------------+-----------+-------------+
```

These locks are owned by Session1, and after executing `ROLLBACK` or `COMMIT` in Session1 they are released and the select-statement on performance_schema comes back empty.

## Retrying transactions

We can try to formalize what we learned in code: A table `demo` with 10 counters numbered from 1 to 10 is being set up, the counters are starting at 0. 

We are running two programs concurrently: One program is counting up the counters i and i+1, and the other program is counting up the counters i and i-1. Whenever the two programs generate overlapping transactions, a deadlock situation should arise.

We want to be able to detect this, and restart the transactions. A quick and dirty attempt at this: A function to lock a record by id.

```python
def select_update(name, id):
    cmd = f"select counter from {name} where id = {id} for update"
    c = db.cursor()
    try:
        c.execute(cmd)
    except MySQLdb.OperationalError as e:
        click.echo(f"MySQL Error: {e}")
        return None

    row = c.fetchone()
    return row["counter"]
```

A function to increment a counter in a record we locked this way:

```python
def update(name, id, counter):
    cmd = f"update {name} set counter = {counter} where id = {id}"
    c = db.cursor()
    try:
        c.execute(cmd)
    except MySQLdb.Error as e:
        click.echo(f"MySQL Error: {e}")
        sys.exit(0)
```

And a really dirty function with way too many parameters to exercise these two functions for pairs of records:

```python
def count_with_locking(name, tag, position1, position2, verbose=False):
        # I would rather have a START TRANSACTION READ WRITE
        # but MySQLdb does not offer this natively.
        db.begin()

        # read, with FOR UPDATE
        done = False
        while not done:
            counter1 = select_update(name, position1)
            sleep(1)
            counter2 = select_update(name, position2)
            # if either counter is None, we had a deadlock and
            # need to retry. Otherwise we are done.
            if counter1 is not None and counter2 is not None:
                done = True
            else:
                if verbose:
                    print(f"{tag} *** Retry *** {position1}, {position2} = {counter1}, {counter2}")

        # Once we make it here we are done.
        if verbose:
            print(f"{tag} {position1}, {position2} = {counter1}, {counter2}")

        # modify
        counter1 += 1
        counter2 += 1

        # write (and since we have the locks, this will work)
        update(name, position1, counter1)
        update(name, position2, counter2)

        # and release the locks, too
        db.commit()
```

And two driver functions, one that goes up and another that goes down, wrapped with `click` so that they can be accessed via the command line:

```python
@sql.command()
@click.option("--name", default="demo", help="Table name to count in")
@click.option("--size", default=1000, help="Number rows in counter table")
@click.option("--iterations", default=10000, help="Number of increments")
@click.option("--verbose/--no-verbose", default=False, help="Log each commit?")
def count_up(name, size, iterations, verbose):
    """  Increment counters i and i+1, across an array, counting i upwards """
    for i in range(0, iterations):

        # We will count up position1 and position2
        position1 = (i % size) + 1
        position2 = ((i + 1) % size) + 1

        count_with_locking(name, "up  ", position1, position2, verbose)


@sql.command()
@click.option("--name", default="demo", help="Table name to count in")
@click.option("--size", default=1000, help="Number rows in counter table")
@click.option("--iterations", default=10000, help="Number of increments")
@click.option("--verbose/--no-verbose", default=False, help="Log each commit?")
def count_down(name, size, iterations, verbose):
    """  Increment counters i and i+1, across an array, counting i upwards """
    for i in range(iterations, 0, -1):

        # We will count down position1 and position2
        position1 = (i % size) + 1
        position2 = ((i - 1) % size) + 1

        count_with_locking(name, "down", position1, position2, verbose)
```

When running this, we get deadlocks because we built it this way:

```console
$ ./deadlock.py truncate
Table demo truncated.
$ ./deadlock.py setup --size 10
Counters 1 to 10 set to 0.
$ ./deadlock.py count-up --size 10 --iterations 100 --verbose & ./deadlock.py count-down --size 10 --iterations 100 --verbose &
[1] 3706851
[2] 3706852
$ down 1, 10 = 0, 0
down 10, 9 = 1, 0
up   1, 2 = 1, 0
down 9, 8 = 1, 0
up   2, 3 = 1, 0
down 8, 7 = 1, 0
up   3, 4 = 1, 0
down 7, 6 = 1, 0
up   4, 5 = 1, 0
MySQL Error: (1213, 'Deadlock found when trying to get lock; try restarting transaction')
down 6, 5 = 1, 1
up   *** Retry *** 5, 6 = 1, None
up   5, 6 = 2, 2
up   6, 7 = 3, 2
down 5, 4 = 3, 2
up   7, 8 = 3, 2
...
```

As soon as the count-down (6,5) and the count-up (5,6) cross their streams a deadlock happens. The count-up (5,6) is rolled back and needs to retry. After retry the counter values are correctly incremented.

We managed to detect the deadlocks, retry the transactions and set things right. Once more the world is safe.
