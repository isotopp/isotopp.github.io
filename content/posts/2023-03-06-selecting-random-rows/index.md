---
author: isotopp
title: "MySQL: Selecting random rows"
date: "2023-02-20T12:13:14Z"
feature-img: assets/img/background/mysql.jpg
tags:
- lang_en
- mysql
- mysqldev
aliases:
  - /2023/03/06/selecting-random-rows.html
---

Given a table named `tbl` with one million entries, we want to select a random row from this table, fast.
Our table definition looks like this:

```mysql
create table tbl (
    id INTEGER NOT NULL,
    d VARCHAR(200) NOT NULL,
    INDEX(id)
);
```

# Dense `id` space

We can generate some test data using a recursive CTE:

```mysql
mysql> set cte_max_recursion_depth = 100000;
mysql> insert into tbl 
    -> with recursive c(n, u) as (
    ->   select 1, uuid() 
    -> union all
    ->   select n+1, uuid() from c where n < 100000
    -> ) select * from c ;
```

The Recursive CTE will generate 100k pairs of (number, uuid()).
The initial row is defined in the upper row of the `UNION`, each subsequent row builds recursively on top of that, by simply counting up.

Since we generate all the values in one transaction, the `uuid()` is actually static. 
That is, because inside a transaction time stops, and the uuid is internally time-based.

Since the `id`-space is free of gaps, we have `rng` many numbers between `min(id) as min` and `max(id) as max`. 
Using the index on `id`, we can simply generate a random number between these boundaries and select the row.

```mysql
mysql> select min(id), max(id) into @min, @max from tbl;
mysql> select @max-@min+1 into @rng;

mysql> select * from tbl where id = floor(rand() * @rng) + @min;
+-------+--------------------------------------+
| id    | d                                    |
+-------+--------------------------------------+
| 79720 | 13b94bdf-bc1c-11ed-9c65-08606ee5ff82 |
+-------+--------------------------------------+
1 row in set (0.06 sec)

mysql> select * from tbl where id = floor(rand() * @rng) + @min;
+-------+--------------------------------------+
| id    | d                                    |
+-------+--------------------------------------+
| 28379 | 13b64d6a-bc1c-11ed-9c65-08606ee5ff82 |
+-------+--------------------------------------+
1 row in set (0.06 sec)
```

# Gaps, and we don't care

If our table has gaps, and we do not care, we can simply move to an inequality and work with that:

```mysql
mysql> select floor(rand() * @rng) + @min into @val;

mysql> > select @val, tbl.* from tbl where id >= @val limit 1;
+-------+-------+--------------------------------------+
| @val  | id    | d                                    |
+-------+-------+--------------------------------------+
| 46346 | 46346 | 13b74a19-bc1c-11ed-9c65-08606ee5ff82 |
+-------+-------+--------------------------------------+
1 row in set (0.00 sec)

mysql> delete from tbl where id % 2 = 0;
Query OK, 50000 rows affected (0.71 sec)

mysql> select @val, tbl.* from tbl where id
>= @val limit 1;
+-------+-------+--------------------------------------+
| @val  | id    | d                                    |
+-------+-------+--------------------------------------+
| 46346 | 46347 | 13b74a1c-bc1c-11ed-9c65-08606ee5ff82 |
+-------+-------+--------------------------------------+
1 row in set (0.00 sec)
```

# Generating truly random rows

Using Python, we can generate truly random rows.

```python
def generate(count = 1000000):
    """ Generate some test data """
    sqlcmd = "insert into tbl (id, d) values ( %(id)s, %(d)s )"

    # ID values with a step of 100, in random order
    
     # this ues a lot of memory to materialize the list
    id_list = [ i for i in range(0, count * 100, 100 )]
    # but if we want to shuffle, we have hardly any other option 
    random.shuffle(id_list)

    counter = 0
    data = []

    # Write them out, in batches of 1000.
    for i in id_list:
        item = {"id": i, "d": uuid.uuid4()}
        data.append(item)
        counter += 1

        if (counter % 1000) == 0:
            try:
                c = db.cursor()
                c.executemany(sqlcmd, data)
            except MySQLdb.Error as e:
                print(f"MySQL Error: {e}", file=sys.stderr)
                sys.exit()

            data = []
            db.commit()

    db.commit()
```

and that yields

```mysql
mysql> select * from tbl limit 10;
+----------+--------------------------------------+
| id       | d                                    |
+----------+--------------------------------------+
|   720800 | d6aba075-d30c-4159-a3f9-67e23ac5674e |
|  2548500 | 18fccfa2-4fc6-4642-861b-4c98314cd6f1 |
| 86144900 | e5a58428-c5e1-4a32-a009-88b5877348bf |
| 88949600 | fabbce25-221e-41d3-97e4-8cfa6bdc4816 |
| 18642300 | 6df95b85-0d49-487c-98b0-548980479e16 |
| 59352400 | 4dfa8a3c-95e7-41b6-83f4-1f1c9f647ecd |
| 11149400 | 60d19e1f-1bca-41d2-93a6-1f9af585bbd4 |
| 37822800 | eebeafd8-b08a-483d-88a5-f779de5d6888 |
| 88126400 | 04c4d0ed-ba7c-456f-ac8c-a72448f38621 |
| 65363500 | 876794c9-b3b5-4cda-9acd-dacb4f5a9419 |
+----------+--------------------------------------+
10 rows in set (0.00 sec)
```

If we had defined the table with a primary key, InnoDB would have kept the data in primary key order -- sorted by id.
Since we did not, the output is kept in generative order.

# Window functions do not help us here

We can generate row numbers, using window functions:

```mysql
mysql> select tbl.*, row_number() over () as r from tbl limit 10;
+----------+--------------------------------------+----+
| id       | d                                    | r  |
+----------+--------------------------------------+----+
|   720800 | d6aba075-d30c-4159-a3f9-67e23ac5674e |  1 |
|  2548500 | 18fccfa2-4fc6-4642-861b-4c98314cd6f1 |  2 |
| 86144900 | e5a58428-c5e1-4a32-a009-88b5877348bf |  3 |
| 88949600 | fabbce25-221e-41d3-97e4-8cfa6bdc4816 |  4 |
| 18642300 | 6df95b85-0d49-487c-98b0-548980479e16 |  5 |
| 59352400 | 4dfa8a3c-95e7-41b6-83f4-1f1c9f647ecd |  6 |
| 11149400 | 60d19e1f-1bca-41d2-93a6-1f9af585bbd4 |  7 |
| 37822800 | eebeafd8-b08a-483d-88a5-f779de5d6888 |  8 |
| 88126400 | 04c4d0ed-ba7c-456f-ac8c-a72448f38621 |  9 |
| 65363500 | 876794c9-b3b5-4cda-9acd-dacb4f5a9419 | 10 |
+----------+--------------------------------------+----+
10 rows in set (0.00 sec)
```

But since they are generated on the fly, they are not an efficient way to select a random row:
We cannot use Window functions in any interesting context, and using them in a subquery basically forces the database to materialize all the rows before the one we are interested in.
So this is slow:

```mysql
mysql> select tbl.*, row_number() over () as r from tbl where r = 192383;
ERROR 1054 (42S22): Unknown column 'r' in 'where clause'

mysql> select tbl.*, row_number() over () as r from tbl where row_number() over () = 192383;
ERROR 3593 (HY000): You cannot use the window function 'row_number' in this context.

mysql> select tbl.*, row_number() over () as r from tbl  having r = 192383;
ERROR 3594 (HY000): You cannot use the alias 'r' of an expression containing a window function in this context.

mysql> select * from ( select tbl.*, row_number() over () as r from tbl ) as t where r = 192383;
+----------+--------------------------------------+--------+
| id       | d                                    | r      |
+----------+--------------------------------------+--------+
| 85856500 | 17e04a8a-95e5-4f5f-8aa2-597c2d37dd43 | 192383 |
+----------+--------------------------------------+--------+
1 row in set (4.58 sec)
```

# Selecting randomly from tables with gaps  

Without continuous ids, and without a row count we cannot easily select the "n-th record" from a table.
So the best we can do is to select all `id`-values, and shuffle them, then choose the first row from the shuffle:

```mysql
mysql> select id from tbl order by rand() limit 1;
+----------+
| id       |
+----------+
| 64527400 |
+----------+
1 row in set (0.86 sec)
```

We can turn this into a full row with a join with almost no cost:

```mysql
mysql> select * from tbl as t1 
    -> join (
    ->   select id from tbl order by rand() limit 1
    -> ) as t2 on t1.id = t2.id;
+----------+--------------------------------------+----------+
| id       | d                                    | id       |
+----------+--------------------------------------+----------+
| 24765800 | dcabd753-a357-4f38-a255-e81b0675654f | 24765800 |
+----------+--------------------------------------+----------+
1 row in set (0.82 sec)
```

# Consuming rows

In the previous examples, we have been re-ordering the table randomly for each access (or group of accesses).
The shuffle has not been made persistent.

Often, the problem is not to select a random row, but to consume rows in random order.
We can store a random number with each row, and then use this as an (indexed) ordering key.
Using the knowledge from 
[the queueing article]({{< relref "2021-07-13-mysql-a-job-queue-in-python.md" >}}),
we can select the item with the highest ordering value, lock it for consumption, retrieve it and delete it.

The idea is to add a column `ordering` to our table, indexed for fast access.
The `ordering` value is assigned randomly.
Here, we are creating the values after the fact in batch for one million entries, but in a system you would probably do that for each item as you write the item.

```mysql
mysql> alter table tbl add column ordering double, add index(ordering);
Query OK, 0 rows affected (20.18 sec)
Records: 0  Duplicates: 0  Warnings: 0

mysql> update tbl set ordering = rand();
Query OK, 1000000 rows affected (1 min 8.27 sec)
Rows matched: 1000000  Changed: 1000000  Warnings: 0
```

To consume a random row, we start a transaction, select the row we want, using `FOR UPDATE` and `SKIP LOCKED`, and then delete it.

```mysql
mysql> START TRANSACTION;

-- Two rows with the same ordering value may exist.
-- We can distinguish them by id, and can process one or both of them.
--
-- If another process has a lock on the topmost row, we will get zero results
-- due to the use of SKIP LOCKED.
mysql> select * from tbl where ordering = (select max(ordering) from tbl) for update skip locked;
+----------+--------------------------------------+--------------------+
| id       | d                                    | ordering           |
+----------+--------------------------------------+--------------------+
| 31106100 | dc12e901-64a0-45a1-8f2e-dee93e3c8ab9 | 0.9999995017424221 |
+----------+--------------------------------------+--------------------+
1 row in set (0.00 sec)

mysql> delete from tbl where id = 31106100;
Query OK, 1 row affected (0.00 sec)

mysql> commit;
<actual processing outside of the transaction>
```

Here, the inner query determines the maximum "ordering" value, which is fast due to the index.
We make use of that value to fetch "a row".
Nothing prevents multiple rows from matching, so we may get one or more rows.
We take the first (or all values), process it, and delete the processed rows, then commit.

Because we use `FOR UPDATE`, each row we select will also be exclusively locked, so other consumers cannot touch them.
Because of the `SKIP LOCKED`, other consumers will not be hanging on locked rows.
Instead, they will simply not see locked rows, so our query may actually even return zero rows in a concurrent context.

Alternatively, you do not strictly process items in order, and want to process them "roughly" in order, but be able to leverage multiple consumers.
A query such as the one below selects one or more items to process (locking them), so that they can be picked up for processing and deleted.

```mysql
mysql> start transaction read write;

-- This is the first UNLOCKED row available for processing.
--
-- Another process may have a lock on another row with an even larger ordering value,
-- but thanks to SKIP LOCKED, we will not see that. 
mysql> select * from tbl order by ordering desc limit 1 for update skip locked;
+----------+--------------------------------------+--------------------+
| id       | d                                    | ordering           |
+----------+--------------------------------------+--------------------+
| 68998800 | bcf7cca2-076d-444b-922b-ae064a1c49a8 | 0.9999983534216865 |
+----------+--------------------------------------+--------------------+
1 row in set (0.00 sec)

mysql> delete from tbl where id = 68998800;
Query OK, 1 row affected (0.00 sec)

mysql> commit;

<actual processing outside of the transaction>
```

For scalability, it is important to keep the interval between `START TRANSACTION` and `COMMIT` as short as possible.
Therefore, it is advisable to keep the actual item processing outside the transaction.

Because we do not need to shuffle things each time when we access things, this is actually much faster than "selecting a random row".
