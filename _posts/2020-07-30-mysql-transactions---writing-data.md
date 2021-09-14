---
layout: post
title:  'MySQL Transactions - writing data'
author-id: isotopp
feature-img: assets/img/background/mysql.jpg
date: 2020-07-30 08:37:32 +0200
tags:
- lang_en
- database
- mysql
- innodb
- erklaerbaer
- mysqldev
---
Using the framework for testing we created in earlier articles, let's try to
modify some data. We are writing a small program that increments a counter.
Our table looks like this, and contains 10 counters:

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

We are using some very simple programming to increment a counter:

```python
@sql.command()
@click.option("--name", default="demo", help="Table name to count in")
@click.option("--id", default=0, help="Counter to use")
@click.option("--count", default=1000, help="Number of increments")
def count(name, id, count):
    """ Increment counter --id by --count many steps in table --name """
    for i in range(0, count):
        cmd = f"update {name} set counter=counter+1 where id = {id}"

        c = db.cursor()
        c.execute(cmd)
        db.commit()
```

## Incrementing a single counter, 1000 times

In this code, we run the SQL `update demo set counter=counter+1 where id=3`
or similar in order to increment a counter, and commit immediately. The loop
will run 1000 iterations, and we can time it. The speed of the loop is
completely dependent on how fast our hardware can commit data to disk.

```console
$ ./counter.py truncate
Table demo truncated.
$ ./counter.py setup --size 10
$ time ./counter.py count --id 3

real    0m14.457s
user    0m0.146s
sys     0m0.037s
```

14.4 seconds for 1000 commits are 14ms per commit, to an old SATA SSD - not
very fast at all, but this is 10 years old hardware. This is slow, because
the `db.commit()` issues a single fsync to the Redo Log, waiting for it to
return - we have shown this [in an earlier article]({% link
_posts/2020-07-27-mysql-transactions.md %}).

We can globally reconfigure MySQL to write to disk unsafely:

```console
$ mysql -uroot -p -e 'set global innodb_flush_log_at_trx_commit=2'
Enter password:
$ ./counter.py truncate
Table demo truncated.
$ ./counter.py setup --size 10
$ time ./counter.py count --id 3

real    0m6.240s
user    0m0.126s
sys     0m0.032s 
```

In this configuration, MySQL will on commit still write the data into the
file system buffer cache, but will no longer force the buffer cache to disk,
foregoing the disk write and the wait for its completion. The server will
flush data to disk in the background in 1s intervals.

Should the database server process crash, but the server hardware does not,
nothing is lost: The file system buffer cache will eventually be written out
do disk.

Should the server hardware crash, up to one second of data is being lost,
but the database will still be consistent - just not at the transaction
everybody expects.

Relaxing the disk write constraints speeds up writing considerably, because
we no longer have to wait for the slow disk to acknowledge the writes.

Further relaxing the disk write constraints does not make things faster,
just more dangerous:

```console
(venv) kris@server:~/Python/mysql$ mysql -uroot -p -e 'set global innodb_flush_log_at_trx_commit=0'
Enter password:
(venv) kris@server:~/Python/mysql$ ./counter.py truncate
Table demo truncated.
(venv) kris@server:~/Python/mysql$ ./counter.py setup --size 10
(venv) kris@server:~/Python/mysql$ time ./counter.py count --id 3

real    0m6.101s
user    0m0.118s
sys     0m0.032s  
```  

In this mode, the database server will not even push data into the file
system buffer cache on commit, but only once per second initiate a batch
write and fsync.  On any crash, up to one second of data will be lost, but
at least it will be at a transaction boundary.

To make things more interesting, we will now run multiple copies of this
programs in various ways.

### Incrementing two counters concurrently, 1000 times each

```console 
$ ./counter.py truncate
Table demo truncated.
$ ./counter.py setup --size 10
$ time ./counter.py count --id 3 &  time ./counter.py count --id 9 &
[1] 728954
[2] 728955
$

real    0m20.450s
user    0m0.164s
sys     0m0.019s

real    0m20.454s
user    0m0.131s
sys     0m0.056s

[1]-  Done                    time ./counter.py count --id 3
[2]+  Done                    time ./counter.py count --id 9
$ mysql -u kris -pgeheim -e 'select * from demo where id in (3, 9)' kris
+----+---------+
| id | counter |
+----+---------+
|  3 |    1000 |
|  9 |    1000 |
+----+---------+
```

We can see the program counted correctly, both counters have the expected
target value. We can also see how the program took a lot longer to execute:
While we have multiple cores, and are running two copies of Python and two
thread in the database concurrently, there is still interference between the
two threads, and things are slower (20.4 seconds instead of 14.4 seconds).

### Incrementing the same counter with two processes, 1000 times each

```console
$ ./counter.py truncate
Table demo truncated.
$ ./counter.py setup --size 10
$ time ./counter.py count --id 3 &  time ./counter.py count --id 3 &
[1] 730874
[2] 730875
$
real    0m25.306s
user    0m0.159s
sys     0m0.038s

real    0m25.311s
user    0m0.162s
sys     0m0.033s
$ mysql -u kris -pgeheim -e 'select * from demo where id = 3' kris
+----+---------+
| id | counter |
+----+---------+
|  3 |    2000 |
+----+---------+ 
```

What happens here is that we are running two instances of the script
concurrently, each of which is incrementing the same row `id=3`. As updating
a row will also exclusively lock it, the second writer has to wait a bit
until the first one commits (which will also drop the lock). Then the second
writer can get access, and do its thing while the first writer has to wait.

Execution time goes up further, from 20.4s to 25.3s.

### Read-Modify-Write, gone wrong

We can query the database differently, in a two stage process, allowing for
more complex updates. Here we read a value from the database into the
application (read phase), change it applicationn side (modify phase) and
then write the changed value back.

Doing this is called a read-modify-write cycle.

```python
@sql.command()
@click.option("--name", default="demo", help="Table name to count in")
@click.option("--id", default=0, help="Counter to use")
@click.option("--count", default=1000, help="Number of increments")
def rmw_false(name, id, count):
    """ Increment counter --id by --count many steps in table --name """
    for i in range(0, count):

        # read
        cmd = f"select counter from {name} where id = {id}"
        c = db.cursor()
        c.execute(cmd)
        row = c.fetchone()

        # modify
        counter = row["counter"] +1

        # write
        cmd = f"update {name} set counter = {counter} where id = {id}"
        c.execute(cmd)
        db.commit() 
```

In this piece of code we again count to 1000, but we are doing it in a three
step process, called a read-modify-write cycle. We also implemented it
wrongly for demonstration purposes:

- The read phase is done with a `SELECT` statement that retrieves the
  current counter value from the database.

- The modify phase increments the counter, application side, in memory. This
  can in real applications be an arbitrarily complicated process that takes
  a non-trivial amount of time and maybe even connects to different backend
  systems and services.

- The write phase then uses `UPDATE` to write back the previously read value
  to the database.

There is no error handling, and - for the purposes of demonstration - no
locking.

We are running this, standalone, and then in multiple copies:

```console
$ ./counter.py truncate
Table demo truncated.
$ ./counter.py setup --size 10
$ time ./counter.py rmw-false --id 3

real    0m13.331s
user    0m0.207s
sys     0m0.106s
```

This is not slower than the single update statement, despite the fact that
we have to talk to the database in two round trips instead of one.

But, when we are running this twice, we can see that due to the missing
locking the results are wrong:

```console
$ ./counter.py truncate
Table demo truncated.
$ ./counter.py setup --size 10
$ time ./counter.py rmw-false --id 3 & time ./counter.py rmw-false --id 3 &
[1] 1521914
[2] 1521915
$ 
real    0m13.361s
user    0m0.235s
sys     0m0.069s

real    0m13.362s
user    0m0.240s
sys     0m0.069s

[1]-  Done                    time ./counter.py rmw-false --id 3
[2]+  Done                    time ./counter.py rmw-false --id 3
$ mysql -u kris -pgeheim -e 'select * from demo where id = 3' kris
+----+---------+
| id | counter |
+----+---------+
|  3 |    1000 |
+----+---------+ 
```

The way we write this code, we extract the value from the database into the
application, getting a value - say 10, and increment that.

Meanwhile the other instance also reads the database, and gets the same
value, also 10.

We increment, and write back the new value, 11. Then the other instance does
the same, and also writes back 11. Two increment events in two processes
have been executed, but the counter has been incremented effectively only
one step, because the rmw-cycles overlapped.

We need to lock the row `id=3` when we *take out* the value from the
database into the application like we would take out a book from the
library. We can give up the lock when we write back and commit. The second
process, attempting to take out the same value we just took out, would stall
and hang, waiting for the (new) value to become available, and only then can
proceed.

### Read-Modify-Write, done right

We modify the program to use `SELECT ... FOR UPDATE` instead of a simple
`SELECT` when taking out the value during the read phase of the rmw
operation.

> `SELECT ... FOR UPDATE` is a read statement, but locks the rows it fetches
> as if it were a write statement. In doing that, it anticipates the
> `UPDATE` operation that is to follow.

What happens is that the `SELECT ... FOR UPDATE` creates X-locks on *at
least* the rows it returns. An X-lock or exclusive lock is a lock that
guarantees that only one thread (us) can access the row while the lock is
being held. All other attempts to read that row are stalled and have to wait
until the lock is released, at `COMMIT`.

Our program now counts correctly. Locks mean waiting, so of course it is
slower.

```console
$ ./counter.py truncate
Table demo truncated.
$ ./counter.py setup --size 10
$ time ./counter.py rmw-correct --id 3 & time ./counter.py rmw-correct --id 3 &
[1] 1523980
[2] 1523981
$
real    0m26.284s
user    0m0.293s
sys     0m0.097s

real    0m26.293s
user    0m0.292s
sys     0m0.099s

[1]-  Done                    time ./counter.py rmw-correct --id 3
[2]+  Done                    time ./counter.py rmw-correct --id 3
$ mysql -u kris -pgeheim -e 'select * from demo where id = 3' kris
+----+---------+
| id | counter |
+----+---------+
|  3 |    2000 |
+----+---------+
```

And this is what the code looks like:

```python
@sql.command()
@click.option("--name", default="demo", help="Table name to count in")
@click.option("--id", default=0, help="Counter to use")
@click.option("--count", default=1000, help="Number of increments")
def rmw_correct(name, id, count):
    """ Increment counter using rmw logic """
    for i in range(0, count):

        # I would rather have a START TRANSACTION READ WRITE
        # but MySQLdb does not offer this natively.
        db.begin()

        # read, with FOR UPDATE
        cmd = f"select counter from {name} where id = {id} for update"
        c = db.cursor()
        c.execute(cmd)
        row = c.fetchone()

        # modify
        counter = row["counter"] + 1

        # write
        cmd = f"update {name} set counter = {counter} where id = {id}"
        c.execute(cmd)
        db.commit()
```

