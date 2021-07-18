---
layout: post
title:  'MySQL: A job queue in Python'
author-id: isotopp
feature-img: assets/img/background/mysql.jpg
date: 2021-07-13 19:51:59 +0200
tags:
- lang_en
- mysql
- mysqldev
---

Somebody needed a job queue in Python:
Multiple writers insert into it in random order, and the jobs are written into the MySQL table `jobs`.
From the `jobs` table, multiple consumers claim jobs in batches of `n` or smaller (n=100), and process them.
After processing, the consumers delete the jobs. We need concurrent job generation and consumption, with proper and efficient locking.

The full source for this example can be seen in [mysql-dev-examples](https://github.com/isotopp/mysql-dev-examples) in [mysql-claim-jobs.py](https://github.com/isotopp/mysql-dev-examples/blob/master/mysql-claim-jobs/mysql-claim-jobs.py).

## Base Program

Using our usual includes and setup,

```python
from time import sleep
from random import randint
from sys import exit
from multiprocessing import Process

import click
import MySQLdb
import MySQLdb.cursors


db_config = dict(
    host="127.0.0.1",
    user="kris",
    passwd="geheim",
    db="kris",
    cursorclass=MySQLdb.cursors.DictCursor,
)
```

## Table `jobs` and setup

we create a MySQL table `jobs`:

```python
@click.group(help="Generate and consume jobs concurrently")
def sql():
    pass


@sql.command(help="Recreate jobs table")
def setup_tables():
sql_setup = [
    "drop table if exists jobs",
    """create table jobs (
        id integer not null primary key auto_increment,
        d varchar(64) not null,
        e varchar(64) not null,
        status enum("unclaimed", "claimed", "done") not null,
        owner_id integer null,
        owner_date datetime null,
        index(d),
        index(status)
        )""",
        "commit",
    ]

    db = MySQLdb.connect(**db_config)

    for cmd in sql_setup:
        try:
            c = db.cursor()
            c.execute(cmd)
        except MySQLdb.OperationalError as e:
            click.echo(f"setup_tables: failed {e} with {cmd}.")


sql()
```

In our table, the fields `d` and `e` represent the job payload.
We will later select jobs for processing based on the contents of the `d` field, so we create an index on that.

Each job has a `status` (`unclaimed` or `claimed`, and for debugging `done` instead of being deleted), an owner and an access date which we update when we change the claim status of the job. 
As we access jobs by status, we also index on `status`.

## Multiprocessing

We generate a set of two generators that concurrently insert jobs into the `jobs` table, and a set of ten consumers that take jobs out of the `jobs` table.

```python
@sql.command(help="Run job creation and consumer jobs")
def start_processing():
    proc_generator = []
    for i in range(1, 3):
        g = Process(target=generator, args=(i,))
        proc_generator.append(g)
        g.start()

    proc_consumer = []
    for i in range(1, 11):
        c = Process(target=consumer, args=(i,))
        proc_consumer.append(c)
        c.start()
```

From `multiprocessing`, we are using `Process` to handle this.
Each of these processes is getting an identification number as a parameter using the `args=` named parameter to the constructor.
We will later use this in the `consumer()` to track the owner of a claimed job. 

## The Generators

Our generator takes the `generator_id` as a parameter, but makes no use of it.

We generate random `d` and `e` fields, and use autoincremented numbers to identify the individual jobs.
The new job has the status of `unclaimed` and the `owner_id` and `owner_date` are `NULL`.
For speed, we commit to the jobs table only every tenth job.

```python
def generator(generator_id):
counter = 0
step = 10

    cmd = "insert into jobs (id,d,e,status,owner_id,owner_date) values (NULL,%(d)s,%(e)s,'unclaimed',NULL,NULL)"

    db = MySQLdb.connect(**db_config)
    c = db.cursor()

    while True:
        data = {
            "d": "".join([chr(randint(97, 97 + 25)) for _ in range(64)]),
            "e": "".join([chr(randint(97, 97 + 25)) for _ in range(64)]),
        }
        c.execute(cmd, data)
        counter += 1
        if counter % step == 0:
            sleep(0.1)
            db.commit()
```

## The Consumers

Our consumers need to claim unclaimed jobs that fulfill a condition from the `jobs` table.
For simplicity, we claim rows that start with a random character, for example 'a%'.

### Naive approach using `UPDATE`

In SQL, this could be

```sql
UPDATE jobs SET
  status = 'claimed',
  owner_id = ?,
  owner_date = now()
WHERE
  status = 'unclaimed' AND
  d LIKE 'a%'
```

But if we did it like this, we would run into two problems:

- We do not get the claimed records for processing. 
  We would need to select them after claiming them (`SELECT id, d, e FROM jobs WHERE status = 'claimed' AND owner_id = ?`).
- The `UPDATE` statement produces X-locks, and these persist until we commit.
  Other processes trying to claim jobs run the risk of running into our X-locks while scanning the table.
  These processes would hang.

We need another approch to handle this to make it efficent.

### Smart approach using `SELECT ... FOR UPDATE SKIP LOCKED`

Starting with MySQL 8, we get the option `SKIP LOCKED` when running select.
This is documented in [the manual](https://dev.mysql.com/doc/refman/8.0/en/innodb-locking-reads.html) as follows:

>  A locking read that uses SKIP LOCKED never waits to acquire a row lock.
> The query executes immediately, removing locked rows from the result set.

Using `FOR UPDATE` we could read the rows we want and mark them for a later `UPDATE` with X-locks.
At the same time we ignore the records already marked for later updates by other processes without stopping.

This is precisely what we need.
In order to mark only the rows we are intending to claim as locked, we need to access the rows in our `SELECT .. .FOR UPDATE SKIP LOCKED` statement by primary key.
That is, our statement needs to have the form `SELECT ... FROM jobs WHERE id IN ( 1, 2, 3 ) FOR UPDATE SKIP LOCKED`.
We need another `SELECT` statement before the locking `SELECT` in order to translate our condition into a set of primary keys.

So this is the plan:

1. Run a query to find a set of candidate primary keys (100 or fewer).
   This query can run outside of our transaction and could use a replica to find a set of candidate primary keys.
2. Start a transaction.
   This happens all the time and automatically in Python. 
    - In our transaction, run the `SELECT ... FROM josb WHERE id IN (...) FOR UPDATE SKIP LOCKED` as discussed.
    - Using the result of the previous `SELECT` statement, run the `UPDATE` to claim the jobs.
    - Run `COMMIT` to drop the X-locks, and make the change visible to other processes.

Note that the set of candidate primary keys can be up to 100 ids in size, but can also be empty:
We are searching for unclaimed jobs that start with a randomly selected letter, and it may be there are none.

Note that the set of claimed primary keys can be identical to the candidate primary key set, or smaller.
It may be empty, even if the candidate set was not:
In this case all candidates have been snatched up by other consumers before we could.
We may want to count and log that, in order to detect if our concurrency in consumers is too high.

#### Finding candidates

In code:

```python
def find_candidates(cursor, wanted):
    candidate_cmd = f"select id from jobs where d like %(search_string)s and status = %(wanted)s limit 100"
    search_string = chr(randint(97, 97 + 25)) + '%'
    try:
        cursor.execute(candidate_cmd, {"search_string": search_string, "wanted": wanted})
    except MySQLdb.OperationalError as e:
        click.echo(f"find_candidates: {e}")
        exit(1)

    candidate_ids = cursor.fetchall()

    return [c["id"] for c in candidate_ids]
```

We are using some arbitrary SQL condition to find records.
In our example, we are using `WHERE d LIKE 'a%' AND status = 'unclaimed'`, for variable intitial letters and for variable status values.
We are only interested into the primary keys, so we return only these, in a `list`.

#### Consuming jobs

The actual `consumer()` then looks like this:

```python
def consumer(consumer_id):
    db = MySQLdb.connect(**db_config)
    c = db.cursor()

    while True:
        # find potential records to process with the status 'unclaimed'
        candidates = find_candidates(c, "unclaimed")

        # we did not find any
        if len(candidates) == 0:
            # this is important, it will drop the persistent read view.
            # not doing this means we will never see newly inserted records from the generator
            db.commit()
            continue

        # with the list of candidate ids, we select them for update, skipping locked records
        lock_cmd = f"select id, d, e from jobs where status = 'unclaimed' and id in %(candidates)s for update skip locked"
        c.execute(lock_cmd, {"candidates": candidates})
        claimed_records = c.fetchall()  # these are the records we want to claim for processing

        # make us a list of ids of the claimed records
        claimed_ids = [ r["id"] for r in claimed_records]
        claimed_ids_count = len(claimed_ids)

        if len(claimed_ids) == 0:
            continue

        # we claim the records, updating their status and owner
        claim_cmd = """update jobs 
           set status = 'claimed', 
           owner_date = now(), 
           owner_id = %(consumer_id)s
        where id in %(claimed_ids)s"""
        c.execute(claim_cmd, {"claimed_ids": claimed_ids, "consumer_id": consumer_id})
        db.commit()

        # doit(claimed_records) -- process the records, that takes some time
        print(f"consumer {consumer_id: } #records = {claimed_ids_count} - {claimed_ids}")
        sleep(0.1)

        # after processing we delete them
        done_cmd = "delete from jobs where id in %(claimed_ids)s"
        c.execute(done_cmd, {"claimed_ids": claimed_ids})
        db.commit()
```

That is, we call `find_candidates()` to generate a list of candidate ids.
If we did not find any, we run a `db.commit()` before we `continue`.
This is rather important: We are in a transaction here, and in `REPEATABLE READ` isolation that means we get a consistent read view.
If we simply tried again, using only `continue`, we would stay in the same transaction and would never see the `jobs` table update.

Using the set of candidate ids, we then run the locking `SELECT` as discussed above.
This does two things:

- it returns the data, which we pick up using `claimed_records = c.fetchall()`
- it also X-locks the rows for claiming them permanently

We generate a list of `claimed_ids` from the `claimed_records`, and check that this list is non-empty.
If it was empty, we did have a list of candidate ids, but none of these came through.
That means another concurrent process snatched the candidates from us - all of them.
We should be recording this, but are not in this example program.

We then run the actual `UPDATE` that marks the jobs as claimed, and updates the owner and the datetime of taking possession.
We need to `db.commit()` here to write this status change to disk.
This will now also be visible to other processes.

We can now proceed to actually process these records at our leisure.
This may take time, which we simulate with a tiny wait.

After processing has finished, we delete the jobs from the `jobs` table, and commit again to make the deletion visible.

## Run log

Here is a short test run protocol:

```console
(venv) mysql-dev-examples/mysql-claim-jobs$ ./mysql-claim-jobs.py --help
Usage: mysql-claim-jobs.py [OPTIONS] COMMAND [ARGS]...

Generate and consume jobs concurrently

Options:
--help  Show this message and exit.

Commands:
setup-tables      Recreate jobs table
start-processing  Run job creation and consumer jobs
(venv) mysql-dev-examples/mysql-claim-jobs$ ./mysql-claim-jobs.py setup-tables
(venv) mysql-dev-examples/mysql-claim-jobs$ ./mysql-claim-jobs.py start-processing
consumer  4 #records = 1 - [1]
consumer  3 #records = 1 - [5]
consumer  8 #records = 1 - [17]
consumer  6 #records = 1 - [13]
consumer  7 #records = 1 - [15]
consumer  10 #records = 1 - [11]
consumer  2 #records = 1 - [12]
consumer  1 #records = 1 - [9]
consumer  9 #records = 1 - [3]
consumer  5 #records = 1 - [7]
consumer  7 #records = 4 - [36, 59, 62, 109]
consumer  9 #records = 5 - [44, 85, 113, 119, 127]
consumer  8 #records = 3 - [72, 79, 126]
consumer  5 #records = 5 - [45, 63, 80, 94, 95]
consumer  10 #records = 1 - [51]
consumer  3 #records = 7 - [2, 14, 22, 53, 68, 120, 140]
consumer  1 #records = 4 - [23, 97, 115, 122]
consumer  2 #records = 6 - [4, 47, 65, 99, 103, 105]
consumer  6 #records = 6 - [26, 32, 43, 77, 83, 86]
consumer  4 #records = 3 - [48, 84, 130]
...
consumer  9 #records = 1 - [12413]
consumer  3 #records = 2 - [12407, 12445]
consumer  7 #records = 2 - [12450, 12459]
consumer  5 #records = 2 - [12446, 12470]
consumer  1 #records = 3 - [12397, 12426, 12441]
consumer  8 #records = 1 - [12458]
consumer  2 #records = 15 - [12282, 12313, 12327, 12350, 12365, 12369, 12385, 12399, 12401,\
  12425, 12435, 12443, 12452, 12453, 12462]
consumer  4 #records = 3 - [12421, 12440, 12466]
^S
consumer  1 #records = 1 - [12515]
counter = 6000                                                                                      
counter = 6000                                                                                      
consumer  5 #records = 30 - [12525, 12532, 12575, 12592, 12673, 12676, 12680, 12714, 12719, 
  12732, 12771, 12804, 12882, 12961, 12977, 13010, 13024, 13060, 13068, 13156, 13204, 13214, 
  13249, 13279, 13280, 13284, 13299, 13307, 13358, 13396]
consumer  10 #records = 31 - [12516, 12531, 12537, 12541, 12623, 12630, 12638, 12742, 12777,
  12791, 12792, 12800, 12810, 12819, 12821, 12981, 12990, 13117, 13119, 13131, 13138, 13161, 
  13180, 13192, 13202, 13259, 13283, 13352, 13367, 13383, 13414]          
```

We can see how each consumer grabs a variable number of jobs for processing, sometimes single jobs, sometimes many more.
If we let the thing run for some time, we see that the ids increment.
When we stop the output with Ctrl-S, we also block the consumers.
On resume, very many jobs are lingering in the queue, and initially the consumers claim a large list of ids on each grab.
This quickly goes back to normal levels after the number of jobs in the queue goes down to normal levels, too.

We can check queue length and status in the database:

```sql
kris@localhost [kris]> select status, count(status) from jobs group by status;
+-----------+---------------+
| status    | count(status) |
+-----------+---------------+
| unclaimed |            47 |
| claimed   |            23 |
+-----------+---------------+
2 rows in set (0.00 sec)
```

## Summary

We created a job queue in the database, using a concurrent Python program.
To select jobs efficiently, we reduce an arbitrary query to a set of candidate primary keys.
We then use a `SELECT ... FROM jobs WHERE id IN ( ... ) FOR UPDATE SKIP LOCKED` to create a set of X-locks on the candidate records using `FOR UPDATE`.
At the same time, we avoid waiting on other threads' X-locks using the `SKIP LOCKED` functionality new in MySQL 8.
We then use the data fetched by the `SELECT FOR UPDATE` to commit permanent ownership for these records, and also use this data for processing.
After processing we clean up by deleting the jobs from the table.

The approach can be scaled further by partitioning the `jobs` table, if needed.
