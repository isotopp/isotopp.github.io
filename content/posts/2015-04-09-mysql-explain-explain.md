---
author: isotopp
title: "MySQL: Explain EXPLAIN"
date: "2024-04-21T05:06:07Z"
feature-img: assets/img/background/mysql.jpg
toc: true
tags:
- lang_en
- database
- mysql
- mysqldev
---

![](/uploads/2015/04/explain-001.jpg)

MySQL Optimization, slides and talk given for the Kaunas PHP UG in April 2015.

# On indexes

![](/uploads/2015/04/explain-002.jpg)

Query execution speed hinges on the presence and use of an index.
So lets have a look to better understand what an index is, and why it speeds things up when searching.

![](/uploads/2015/04/explain-003.jpg)

The canonical example for an index is a literal index,
as they were being used in libraries before the invention of a computer.
Imagine an old library, with many shelves full of books.
You visit the library and you want a specific book.
But in this pre-computer Harry Potter world, you can't type a query into a terminal.
How do you find a book?

![](/uploads/2015/04/explain-004.jpg)

Let's imagine a library of one million books, in no particular order.
You task:
Find all books written by the author named “Larry Wall”.
How many books do you need to touch to find them?

The answer is:
Without an index,
all of them.

![](/uploads/2015/04/explain-005.jpg)

Back when I was little, libraries had this: catalogs.
An author catalog is a copy of each author's name written on a card, with a note where to find the actual book.
The cards are kept sorted, and that’s the important fact here.

If there were no other markings,
we could find the author fast
by dividing the author catalog in two equal halves.
Looking that middle card, we could tell if the card we found was before or after Larry Wall in sort order,
determine in which half Larry Wall's books would be,
and divide the remainder again.
For this smaller subset, we could repeat that step,
until we find Larry’s card.

![](/uploads/2015/04/explain-006.jpg)

Because the author catalog is kept sorted, we can find things in it with logarithmic complexity.
Instead of one million comparisons to find all books by Larry Wall,
we would only need `log2(1 000 000) ~= 20` comparisons.

For each factor of 1000, we would need around 10 comparisons more.

![](/uploads/2015/04/explain-007.jpg)

In MyISAM, each index is kept in a `.MYI` file.
We can have multiple indexes, one on `author`, one on `title` and so on.
Each index would contain records.
The records are a copy of the data we find in the column we index, 
and the databasse will automatically keep that copy updated and sorted.
So whenever we change data in the `.MYD` file, the `.MYI` copies of that data (all of them) will also need updating,
to reflect the changed value and its position in the index, which is kept sorted.

The index record will also keep one or more pointers to the full row,
so each `.MYI` record has at least one pointer into the `.MYD` file.

Indexes are structures that are organized in pages.
Each page will contain multiple index records.
How many is dependent on how large a page is and how large an index record is.
But effectively, we do not have a binary tree as in our example above, but a tree with a much higher fan out.

That means with each comparison, we do not divide the subtree in two, but in however many records fit.

![](/uploads/2015/04/explain-008.jpg)

In InnoDB instead of MyISAM, we have 16 KB pages.
With a hypothetical 32 byte index record, we would fit 512 index records into an index page.

Often we see fanouts of 50 to 500,
and that means we find any record in an index in about 4 comparisons (instead of one million).

![](/uploads/2015/04/explain-010.jpg)


In a bad case, we need to find one record in one billion, and have a fanout of only 50.
This gives us `x = ln(1 000 000 000)/ln(50) = 5.2` comparisons.

In a good case, we need to find one record in a million, and have a fanout of 500.
This gives us `x = ln(1 000 000)/ln(500) = 2.2` comparisons.

![](/uploads/2015/04/explain-011.jpg)

And that means,
if anyone ever asks you how many comparison operations a database has to make in order to find a single record,
you now always now the answer.

It is "circa 4", minus whatever we find in the cache.

# Going to the disk

![](/uploads/2015/04/explain-012.jpg)

Indexes matter, because each index lookup is, if it is not caches, a disk access.
And rotating disks are slow.
We should avoid disk accesses in order to be fast.

Let's have a look at the details.

![](/uploads/2015/04/explain-013.jpg)

Your computer is running at a clock speed in the Ghz range.
That means, the cycle time for the CPU and L1 cache is likely measured in ns (nanoseconds, 1/ 10^9 s).
In our graphics here, 1 ns is 1 pixel.

A L2 cache acess is 5 ns.

A memory (RAM) access is 80 ns.

![](/uploads/2015/04/explain-015.jpg)

A disk seek is 5 to 13 ms = 5 000 000 to 13 000 000 ns.

![](/uploads/2015/04/explain-016.jpg)
![](/uploads/2015/04/explain-017.jpg)

A hard disk gives you a linear access speed of 100-200 MB/s, and a disk seek time to read a random record of 5-10 ms.
With a linear read, we scan about 200000 to 400000 records per second, at 500 bytes/record.

Using random access, it is good for around 100-200 disk seeks per second.
With a record per page, that's 100-200 records/sec worst case.

SSD gives you a linear access speed of 200-400 MB/s, so you scan 400000 to 800000 records fo 500 bytes per second,
and with disk seeks, you get 10000 to 20000 records/sec worst case.

![](/uploads/2015/04/explain-018.jpg)

A query is fast, if it does not have to go to the disk.

For hardware and brute force, that means: Have plenty of memory to cache.
For access, that means: make sure the query uses indexes.

# Missing indexes

![](/uploads/2015/04/explain-019.jpg)

So a lot of database optimization is actually about checking index use, and providing indexes.

![](/uploads/2015/04/explain-021.jpg)

Are you using enough indexes?
A simple way to check is the checking certain database performance counters.
There is one that counts records read using an index, and another that counts records read using a scan (without index).
The ratio between these two should be as high as possible:
Records should be read using indexes, and not using scans.

![](/uploads/2015/04/explain-023.jpg)

So using the command `show global status like "handler_%"`, we look at these global counters
(or their delta between two measurements).

The first five counters count accesses using indexes: 
- `Handler_read_first`
- `Handler_read_key`
- `Handler_read_last`
- `Handler_read_next`
- `Handler_read_prev`

And the counters for scans are:
- `Handler_read_rnd`
- `Handler_read_rnd_next`

![](/uploads/2015/04/explain-025.jpg)

What do we see, when a database does not have an index it needs,
when it is scanning a lot?

- If the machine does not have enough memory to keep all data in memory, it will read the data from disk.
  We see a lot of linear disk access, the disk is very busy, and the queries will be slow.

- If the data can be kept in memory, the same scan will not happen on disk, but in memory.
  We will not see disk accesses, but the machine will still be very busy, and it will use an exceptional amount of CPU.

> When a database machine uses a lot of CPU, one of three things happens:
> 
> - It is missing an index and scans in memory.
> - It has to sort a lot of data.
> - The application has been written as stored procedures, and the code is running in the database.

# The `sys` Schema

![](/uploads/2015/04/explain-026.jpg)

![](/uploads/2015/04/explain-027.jpg)

`performance_schema` (`p_s`) is a raw interface, optimized for minimal overhead, 
because the database has to update it for every query.
It can and should be kept ‘on’ as much as possible,
because it makes diagnostics much easier.
It is much more accurate and up to date than the slow query log.

Because of that design requirement of minimal overhead, P_S can be hard to use for day-to-day DBA work.
In fact, it is not even hard to use, but also hard to pronounce and type, so everybody just calls it p_s.

![](/uploads/2015/04/explain-028.jpg)

Mark Leith of Oracle (Ex-MySQL AB)
wrote a collection of views and stored routines originally called `ps_helper` to make p_s easier to work with.
Later it got renamed to `sys`, and since 5.7.7 is part of a standard server installation.
The source can be found on GitHub.

![](/uploads/2015/04/explain-029.jpg)

`sys` mostly provides views into p_s.
The views with `x$` names are provided for reading through programs.
The provide unabbreviated data and unscaled measurements.

Output in the view with the same name sans `x$` provides shorted information and scales measurements with units,
targeting human consumption.
Most of the time, you will use the `x$` views for metrics collection,
after having decided what you want to see using the normal views in ad-hoc queries.

![](/uploads/2015/04/explain-030.jpg)

With `sys`, our query "Am I using enough indexes?" gets much more useful and directed answers.
The two views `sys.schema_tables_with_full_table_scans` and `sys.statements_with_full_table_scans` give
you direct pointers to the tables and queries that are problematic.

# Running Queries

![](/uploads/2015/04/explain-031.jpg)

So now that we have established that our server has bad indexing and which queries are causing it,
let’s have a look at what we can learn about them.

The server is running queries, and sends the results back to the client.

It tries to create the result set in a streaming fashion.
That means, it tries not to materialize the full result set table in the server before it sends them out,
but ideally it can send each row by row as seen as it has been generated.

This has many advantages:
- The first row arrives faster.
- Almost no memory is being used in the server.

But it can't be done at all times:
`ORDER BY`,
`GROUP BY`, `SQL_BIG_RESULT`,
and other conditions require result set materialization in something called an implicit temporary table in the server.

The full result set is sent to the client, where it is stored (by default) in memory.
In the C-client `libmysqlclient.so` and all langiages using the C-client, this is what happens by default:
Data is allocated and owned by the C-language library and made available to the host language row by row.
You can seek in the result set, but it uses large amounts of memory in the client.
That memory is resulted with `mysql_free_result()`.

Optionally, you can use `mysql_use_result()` instead.
This will download the data from the server to the client row by row.
You can't seek in the data, only process it linearly, but it uses a lot less memory in the client.

`mysqldump` by default uses this (with the `—quick` option, which is on by default).
Do you know why?

![](/uploads/2015/04/explain-032.jpg)

A sample query:

```mysql
SELECT * 
  FROM a JOIN b 
    ON a.aid = b.aid 
 WHERE <acond> AND <bcond>
```

MySQL always uses a “nested loop join”:

```console
for each row in a matching <acond>
    look up aid in b, using b.aid index,
        filter more, using <bcond>, …
```

If you can use indices, this is handles fast and memory efficient, and is streamable.
In all other cases, it resolves into something horrible.
That makes MySQL a really bad database for data warehouse problems.

![](/uploads/2015/04/explain-033.jpg)

Because the plan is fixed, a "nested loop join",
the only thing the optimizer can vary are the table order, and the lookup methods.

And for "web shop" or other transactional things that is usually okay.

That is what `EXPLAIN` shows.

![](/uploads/2015/04/explain-034.jpg)

Some real world example:

```mysql
EXPLAIN SELECT …
          FROM B_Rate_Room_Directory brrd
          
          JOIN B_CP_PolicyGroupType pgt  
            ON (pg.pg_type_id = pgt.pg_type_id )
          JOIN B_CP_PolicyGroup pg  
            ON ( pg.object_id = brrd.default_policy_group_id and pg.eff_status='C' )
          JOIN Translation t 
            ON (t.item_id =  pg.pg_type_id and t.language = 'en' and t.groupname='policy_group_name' )
            
         WHERE brrd.active <> 0
           and brrd.room_id = '25725602'
           and brrd.default_policy_group_id IS NOT NULL
           and brrd.default_policy_group_id <> 0
```

![](/uploads/2015/04/explain-036.jpg)

Here is what `EXPLAIN` says: 
These are all `SIMPLE` joins, there are no subqueries, no unions.

That means that the numbers in the `rows` column are the lookups the database has to do,
times the number of previous lookups.
The **badness** of a query is the product of all the numbers in `rows`.

Optimization is bringing a badness of a query down.

![](/uploads/2015/04/explain-037.jpg)

The tables (or their aliases) ar shown in join order.
In the nested loop join, the first table is in the outermost loop, and the last table is in the innermost loop.

The order of tables in the join may be different from the order of tables in the query we have written.
That works of course only for commutative operations (`JOIN`) and not for directional operations (`LEFT JOIN`).

The operator `STRAIGHT_JOIN` does the same thing as `JOIN`, but is defined as not commutative.
You can use it to prevent the optimizer from messing with the join order.
It will be executed in the order written.

![](/uploads/2015/04/explain-038.jpg)

The join type is indicated in the `type` column, and tells you which table from the `table` column is connected
to what table in the `ref` column.

![](/uploads/2015/04/explain-039.jpg)

To resolve the join as indicated, there may be zero or more keys.
They are all listed in the `possible_keys` columns.

![](/uploads/2015/04/explain-040.jpg)

The key actually used is shown in the `key` column.
Not all keys are used fully, some keys are only used as prefixes.
How many bytes of the key are being used is shown in the `key_len` column.

For example, if the index `a_b_index` is defined over two integer columns `a` and `b`, each integer will use 4 bytes.
If the `key_len` for `a_b_index` is shown as 8, both `a` and `b` will be used, in this order, as a compound index.
If instead the `key_len` is shown as `4`, only the `a` prefix of `INDEX(a.b)` is being used.

![](/uploads/2015/04/explain-041.jpg)

Here, again, our **badness* calculation.
The number of comparisons to resolve **this** query.

Badness is comparable only for queries that produce the same result set. Lower is better.

What is the minimal badness for a query?
Obiously, for a result set with 5 rows, at least 5 lookups are necessary,
so a badness of 5 or more is needed to produce the result.

For a query that uses `GROUP BY` or `LIMIT`, the actual result set is larger and then folded or truncated.
The database may use optimizations here for shortcuts,
but we have keep in mind that it has to produce the "unfolded" result set before aggregation or limit truncation
in order to resolve the query.
That means the minimum badness for queries that use `GROUP BY` or `LIMIT` may be larger than the result set we see.

![](/uploads/2015/04/explain-042.jpg)

The final column, `extras` contains extra annotations from the optimizer, good and bad.

![](/uploads/2015/04/explain-044.jpg)

So let's see:
The `type` column can have join types.
Sorted from good to worse, the following are "good-ish" news:

system, const
: table has at most one matching row. The optimizer replaces the table with the value.
  The table is removed from the query and is evaluated at the planning stage.

eq_ref
: a comparison using '=' operator, using a 1:1 relationship.
  This is using a `PRIMARY KEY` relationship, or a `UNIQUE` index.

ref, ref_or_null
: a comparison using an index, but not on a 1:1 basis.

fulltext
: using a MyISAM FULLTEXT index.

index_merge
: using two (or more) indexes, intersecting the two partial results.

![](/uploads/2015/04/explain-045.jpg)

The `type` can also by, from worse to really bad:

range
: using a part of the index to select values.
  This happens in `SELECT … FROM t WHERE a < …` and 
  `SELECT … FROM t WHERE v BETWEEN … AND …` (both are inequality queries)
  and with `SELECT … FROM t WHERE id IN (…, …, …)` ("WHERE IN" query)

index
: A full scan on an index instead of the full table.
  This is sometimes faster than a full scan, because the index may be smaller than the full table.
  It looks funny in `explain`, because `possible_keys` is NULL, but `keys` is not.

ALL
: A full table scan. Nothing usefuil can be done, let's brute force it.


**NOTE:** A `SELECT … FROM t WHERE str LIKE "bla%"` can be written as a `BETWEEN` query and is a **range**.

![](/uploads/2015/04/explain-046.jpg)

A real life, unusual example:

```mysql
select translation_id,
       translation,
       status
  from B_CP_Translation
 where language_code = 'fr' 
   and project_id = '0'
```

Indexes exist for `language_code` and for `project_id`, but not for the combination.

![](/uploads/2015/04/explain-047.jpg)

The `EXPLAIN` says:

```console
Explain Result:
           id: 1
  select_type: SIMPLE
        table: B_CP_Translation
         type: index_merge
possible_keys: language_code,project_id
          key: language_code,project_id
      key_len: 6,4
          ref: NULL
         rows: 734
        Extra: Using intersect(language_code,project_id); Using where
```

This is one of the rare cases where MySQL uses more than one index in an **index_merge** optimization,
and therefore the output is really weird.

![](/uploads/2015/04/explain-048.jpg)

In the `extras` column there can be a number of additional notes from the optimizer.
Some are good, some are bad.

Things that are not so good:

using filesort
: extra sorting is necessary, because the rows are not retrieved in the requested order. 
  This can force an extra lookup, or a table materialization (in that case, `using temporary` is also shown).

using temporary
: the result is pushed into a temp table at some point, and then processed further.
  The temp table can be in memory or go to disk.

![](/uploads/2015/04/explain-049.jpg)

Check how many of your temporary tables actually go to disk.
This can impact performance a lot.

```mysql
mysql> show global status like "created_tmp%tables";
...
```

The ratio of `Created_tmp_disk_tables` to `Created_tmp_tables` should be 1:10 or better. 

![](/uploads/2015/04/explain-050.jpg)

Find queries with temporary tables, and check them out, using `sys`:

```mysql
select * 
  from sys.statements_with_temp_tables
 where db not in ('sys', 'mysql', 'information_schema', 'performance_schema');
```

![](/uploads/2015/04/explain-051.jpg)

Other `extra` notices that are not so bad news:

Impossible WHERE noticed after reading const tables
: there is no work left to do.

Select tables optimzied away
: the query contained aggregates that could be resolved at the optimizer stage already.
  There is no work left to do.

Using index
: Covering index. All data we need to produce in the select can be read from the index,
  we do not need to seek into the actual table.
  That's faster.

Distinct
: implementing 'distinct' operator using a lose index scan.
  This means we skip over the index in large hops instead of scanning data.

Using where
: A where clause is being used to filter down a result from an index even more.
  That means, an index produces too much data, which we then filter down in a limited scan
  and the following tables in the join see fewer rows than estimated.

# When and How to Index?

![](/uploads/2015/04/explain-052.jpg)

Ok, so indexes are the key to performance.
When should indexes be used, and how can they help?

![](/uploads/2015/04/explain-053.jpg)

The point of an index is fewer disk operations.
Rows are on disk in pages, and data is always read in pages.
If we need a single row in a page, all of the page is being read, and then kept in memory.

![](/uploads/2015/04/explain-054.jpg)

The term **Selectivity** describes the percentage of rows selected by a condition.

```mysql
SELECT id, name
  FROM person
 WHERE sex = 'f'
```

This row has a cardinality of 2 (or 3, when nullable).
The assumption is equidistribution (as many f as m).
Is that valid for our data set?

If yes, selectivity is a function of cardinality:
- n rows
- selectivity = (n/cardinality)*100

![](/uploads/2015/04/explain-055.jpg)

As an example, let's consider defining an `INDEX(a,b,c)` on three columns.

The index is used left to right: `a`, and within the same `a`, sorted by `b`, and so on.
It can be used for a conjunction (AND) of equalities, and one trailing relation/range.

Effectively, we are selecting a subtree in the index b-tree.

![](/uploads/2015/04/explain-056.jpg)

Examples:

`WHERE a = 10 AND b = 20 AND c = 30`
: This uses uses (a,b,c).
  It is a conjunction of equalities.
  It does not matter how it is written, the `AND` terms are commutative.

`WHERE a = 10 AND b = 20 ORDER BY c`
: This uses (a,b,c).
  This is a conjunction of equalities (a, b), and the data is read in `c` order,
  saving us a sort.

`WHERE a = 10 AND b < 20 ORDER BY c`
: uses (a,b). This uses the equality in `a`, and the range in `b`.
  It cannot leverage the index on `¬, c` for sorting, though, and we will have to manually sort.

![](/uploads/2015/04/explain-057.jpg)
More Examples:

`WHERE a<10 AND b = 10`
: uses (a). This can only use the `a` prefix of `INDEX(a,b,c), because this is a range query.
  The `b=10` part is being resolved `using where`.

`WHERE a<10 AND b<10`
: uses (a). This can only use the `a` prefix of `INDEX(a,b,c)`. 
  Unfortunately this is a common case, for example for bounding boxes.
  Geometry types and `RTREE` indexes can help, but are painful to use.

`WHERE (a-10)<0`
: no index used. Rephrase the query so that `a` is used freestanding: `WHERE a<10`.
  Now an index on `a` can be used.

# Are we done, yet?

![](/uploads/2015/04/explain-058.jpg)

When optimizing, this is a process.
When do we stop?

![](/uploads/2015/04/explain-059.jpg)

Revisiting the badness calculation.

![](/uploads/2015/04/explain-060.jpg)

The badness is ~2600.
2600 comparisons for 2600 result set rows are ok. 
2600 lookups for 26 result rows probably can be improved upon.
