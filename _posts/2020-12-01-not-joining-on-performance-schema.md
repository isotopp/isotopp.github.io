---
layout: post
title:  'Not JOINing on PERFORMANCE_SCHEMA'
author-id: isotopp
feature-img: assets/img/background/mysql.jpg
date: 2020-12-01 09:33:10 +0100
tags:
- lang_en
- mysql
---

The tables in `PERFORMANCE_SCHEMA` (`P_S`) are not actually tables. You should not think of them as tables, even if your SQL works on them. You should not JOIN them, and you should not GROUP or ORDER BY them.

## Unlocked memory buffers without indexes

The stuff in `P_S` has been created with "keep the impact on production small" in mind. That is, from a users point of view, you can think of them as unlocked memory buffers - the values in there change as you look at them, and there are precisely zero stability guarantees.

There are also no indexes (*EDIT:* There actually are secondary indexes on `P_S` tables in MySQL 8, see below).

### Unstable comparisons

When sorting a table for a GROUP BY or ORDER BY, it may be necessary to compare the value of one row to other rows multiple times in order to determine where the row goes. The value compared to other rows can change while this happens, and will change more often the more load the server has. The end result is unstable. Also, as the table you sort may be larger on a server under load, the row may need more comparisons, making this even more likely to happen.

The table you look at may produce correct results on your stable, underutilized test systems, but the monitoring you base on this will fail on a loaded test system.

Do not use GROUP BY or ORDER BY on `P_S` tables.

### No indexes, meaning slow joins on loaded systems

When JOINing a `P_S` table against other tables, the join is done without indexes (in MySQL up to and including 5.7). There are no indexes defined in `P_S` before MySQL 8.

In practice that means your join against the processlist or session variables tables in `P_S` do little harm in test, but will fail in production environments with many connections. You will be losing monitoring the moment you need it most - under load, in critital situations.

Do not JOIN `P_S` tables to anything.

## How to monitor

About the only type of query you can reliably run on `P_S` is a single table `SELECT * FROM P_S.table`, maybe with a simple `WHERE` clause. That is, you can download and materialize data from a single `P_S` table at a time, unsorted, unaggregated.

Connection to other tables, aggregation and sorting should be done on tables that are not `P_S` tables.

There are multiple ways to do this.

### Subqueries, without optimization

It used to be that the MySQL optimizer did not resolve simple subqueries properly. So

```sql
mysql> select <complicated stuff> from
    ->   ( select * from performance_schema.sometable ) as t
    -> order by <something>
```

used to work. The subquery `t` would materialize the `P_S` table as whatever your version of MYSQL used for implicit temporary tables, and the rest of the query resolution would happen on the materialized temptable. This is a snapshot, and would be stable.

And it still would not add up to 100%, of course. That is, queries like Dennis Kaarsemakers "How loaded is the SQL_THREAD" Replication Load analysis never came out at 100%, because the various values changed while the temporary table would be materialized, so you do not get a consistent snapshot (and by construction, this kind of consistency is impossible in `P_S`).

Anyway, with older versions of MySQL, this results in the query plan we want. Starting with MySQL 5.7, this does no longer work, because the optimizer became too smart. :-)

```sql
mysql> select version();
+-----------+
| version() |
+-----------+
| 8.0.22    |
+-----------+
1 row in set (0.00 sec)

mysql> explain select * from ( select * from processlist ) as t;
+----+-------------+-------------+------------+------+---------------+------+---------+------+------+----------+-------+
| id | select_type | table       | partitions | type | possible_keys | key  | key_len | ref  | rows | filtered | Extra |
+----+-------------+-------------+------------+------+---------------+------+---------+------+------+----------+-------+
|  1 | SIMPLE      | processlist | NULL       | ALL  | NULL          | NULL | NULL    | NULL |  256 |   100.00 | NULL  |
+----+-------------+-------------+------------+------+---------------+------+---------+------+------+----------+-------+
1 row in set, 1 warning (0.00 sec)
```

Newer MySQL (5.7 and above) will apply the `derived_merge` optimization and fold the subquery into the outer query, resulting in a rewritten single query that again is executed on `P_S` directly. This is extremely useful, but in this one particular case precisely not what we want.

You either need to `SET SESSION optimizer_switch = "derived_merge=off";` or provide an advanced [MySQL 8 optimizer hint](https://dev.mysql.com/doc/refman/8.0/en/optimizer-hints.html#optimizer-hints-table-level) to prevent the optimizer from ruining your cunning plan:

```sql
mysql> explain select /*+ NO_MERGE(t) */ * from ( select * from processlist ) as t;
+----+-------------+-------------+------------+------+---------------+------+---------+------+------+----------+-------+
| id | select_type | table       | partitions | type | possible_keys | key  | key_len | ref  | rows | filtered | Extra |
+----+-------------+-------------+------------+------+---------------+------+---------+------+------+----------+-------+
|  1 | PRIMARY     | <derived2>  | NULL       | ALL  | NULL          | NULL | NULL    | NULL |  256 |   100.00 | NULL  |
|  2 | DERIVED     | processlist | NULL       | ALL  | NULL          | NULL | NULL    | NULL |  256 |   100.00 | NULL  |
+----+-------------+-------------+------------+------+---------------+------+---------+------+------+----------+-------+
```

Here we get the `DERIVED` table as a non-`P_S` temptable, and then run our "advanced" SQL on that as `PRIMARY` on it.

### In the client

The alternative is, of course, to completely download the tables in question into client side hashes, and then perform the required operations on them on the client side, in memory. The important thing here is to limit the amount of memory spent - do not download unconstrained result sets into your client monitoring program.

Then use a linearly scaling join method to construct the connections between the tables. Effectively, load data into hashes, and then program a client side hash join. This is additive (n + m) instead of quadratic (n * m), so you can survive this.

This is the recommended method.

## Who is doing it wrong?

Getting monitoring queries that use `P_S` wrongly is common - it understands SQL, it handles `SHOW CREATE TABLE`, so it is treated as a table and exposed to full SQL all the time. And on idle test boxen, it even looks like it works. 

At work, see this in our own code (still using a deprecated Diamond collector) and in SolarWinds nee Vividcortex.

SolarWinds kindly highlights itself:

```sql
-- Most time consuming query - Coming from solar winds monitoring itself ¯\_(ツ)_/¯
select `ifnull` (`s`.`sql_text` , ?) , `ifnull` (`t`.`processlist_user` , ?) , `ifnull` (`t`.`processlist_host` , ?) 
  from `performance_schema`.`events_statements_history` `s` 
  left join `performance_schema`.`threads` `t` 
    using (`thread_id`) 
  where `s`.`thread_id`=? and `s`.`event_id`=?
 
-- Coming from the "table ownership write identifier".
select count (*) as `cnt` , `digest_text` , `current_schema` , `processlist_user` as system_user 
  from `performance_schema`.`events_statements_history` `esh` 
  inner join `performance_schema`.`threads` `t` 
    on `t`.`thread_id`=`esh`.`thread_id` 
  where `event_name` in (...) 
    and `current_schema` in (...) 
  group by `digest_text` , `current_schema` , `processlist_user`
 
-- Coming from diamond collector
select `t`.`processlist_user` , `sbt`.`variable_value` , count (*)
  from `performance_schema`.`status_by_thread` `sbt` 
  join `performance_schema`.`threads` `t`
    using (`thread_id`) 
  where `sbt`.`variable_name`=? 
    and `t`.`processlist_user` is not null
group by `t`.`processlist_user` , `variable_value`
```


Many of the above examples fail in multiple ways: Using JOIN for bad scalability (this is how we spotted them), at least before MySQL 8 (and you probably want your monitoring to work anywhere). Some are also using unstable sorting.

We also see ORDER BY statements in the [Telegraf MySQL plugin](https://github.com/influxdata/telegraf/blob/master/plugins/inputs/mysql/mysql.go#L376) in one place. It uses LIMIT, but if the ORDER BY does not work (ie does not actually sort), you cut off randomly.

## Is PERFORMANCE_SCHEMA broken?

Clearly, it is not. Just badly misunderstood.

The alternative is `INFORMATION_SCHEMA`, which often locks, and that can be actually deadly: 

Just `select * from INFORMATION_SCHEMA.INNODB_BUFFER_PAGE` on a server with a few hundreds of GB of buffer pool, humming at 10k QPS. The query will freeze the server completely for the runtime of the query – which with a large buffer pool size can be substantial.

I'd rather have this in `P_S` and then deal with the vagaries of the data changing while I read it than lose an important production server. So `P_S` is much better than `I_S`, provided that you ask it in the right way.

## Addendum

Both [Øystein Grøvlen](https://twitter.com/ogrovlen/status/1334047725298585600) and [Mark Leith](https://twitter.com/MarkLeith/status/1334075136450945024) remind me that in MySQL 8 [we geht secondary indexes on `P_S`](https://dev.mysql.com/doc/refman/8.0/en/performance-schema-optimization.html) - this will address some of the problematic queries above and will need some research on my side.

The sorting is still complicated. [Øystein writes](https://twitter.com/ogrovlen/status/1334056375123632129):

> It depends on the sort algorithm used by MySQL.  Many sorts will add all requested columns to the sort buffer, and will not need to fetch anything from the tables after sorting, but it depends on the size of the sort buffer and how much data needs to be fetched.

So there are some sorts that are stable, and some sorts that will always be unstable (those that work with bloblike columns such as `SQL_TEXT` or `DIGEST_TEXT` likely), but it is really hard to see this when looking at the query.

I still maintain my advice of forcing stable copies with subselects and `NO_MERGE()` hints - this is much easier to teach and guaranteed to be stable.

## Another addendum

In [a tweet](https://twitter.com/justin_swanhart/status/1334544467987197953) Justin Swanhart pointed me at [PS_HISTORY](https://github.com/greenlion/PS_HISTORY), which makes snapshots of `P_S` that try to be as consistent as possible.

It will allow you to replay and review old `P_S` states and query them, and it will - if you configure it - also automatically expire the old recordings. It may be useful as a kind of flight recorder to debug performance problems that cannot otherwise reproduced.
