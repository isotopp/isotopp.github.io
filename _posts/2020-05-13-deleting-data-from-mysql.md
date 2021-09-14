---
layout: post
title:  'Deleting data from MySQL'
author-id: isotopp
feature-img: assets/img/background/mysql.jpg
date: 2020-05-13 11:24:35 +0200
tags:
- lang_en
- database
- mysql
---
I have been pointed at the following question: »Has anyone ever used mySQL events to auto-delete rows from a table after set period? Wondering your experience of doing this.«

[![](/uploads/2020/05/mysql-delete.png)](https://twitter.com/wsakaren/status/1260434965810085889)

There are two ends to this question:

- expiring data from a MySQL table
- doing this with the event scheduler

## Mass-deleting data from InnoDB

You can of course delete data from a table using the SQL `DELETE` statement with an arbitrary `WHERE`-clause at any time:

```sql
DELETE FROM t WHERE report_date < now() - INTERVAL 7 DAY
```

*Delete data from table t that has a report_date more than 7 days in the past. Since the interval expression on the right hand side evaluates to a constant and the left hand side is a bare column name, the planner can leverage an index on the column report_date to find the rows to delete quickly.*

The downside of a query like this is that you do not know how many rows you will be deleting, and (especially if there is not an index on `report_date`) the query may also generate a whole lot of locks. These locks may be getting in the way of other operations on this table.

In the SQL style guide we use at work, we recommend that developers run a `SELECT` statement instead. They would be retrieving the ID values of the rows they want to delete and then delete them with `WHERE id IN ( <list of constants> )` using a reasonable batch size and replication delay monitoring where applicable.

So something like:

```python
    batch_size = 1000
    delete_stmt = "DELETE FROM t WHERE id IN ( %s )"

    cursor.execute("SELECT id FROM t WHERE report_date < now() - INTERVAL 7 DAY")
    full_set = [ id[0] for id in cursor.fetchall() ]

    for n in range(0, len(full_set), batch_size):
        current_set = ', '.join(full_set[n:n+batch_size])
        cursor.execute(delete_stmt % current_set)
        cursor.commit()
```

The ORM we use (a local custom thing) actually provides functionality that automates this, and also checks replication delay on the replicas. It will delay the loop execution if necessary in order to keep the lag on the replicas within the service level.

## Why this is expensive

This is not the best way to get rid of data on a schedule, though. MySQL InnoDB stores data in primary key order, and an auto_increment primary key is like a dynamically increasing time stamp. It will organize your table so that more recent data is on the right hand side of the table and older data is on the left hand side. Adds always happen at the very right hand side, and deletes happen always at the very left hand side.

Now, data in InnoDB primary keys is structured as a B+-Tree. That is a B-Tree where the leaves are the actual data pages (and that is where the order comes from). B-Trees are balanced: The longest path from the root to any leaf page is at maximum one step longer than the shortest path. Rebalancing operations have to happen to maintain this, and in a structure where we append at the right and delete from the left, a maximum number of rebalancing operations have to happen to maintain the ring buffer. InnoDB performs comparatively badly at this.

## Partitions instead

The recommended way to do this is to use [MySQL partitions](https://dev.mysql.com/doc/refman/5.7/en/alter-table-partition-operations.html) and [partition by ID ranges](https://dev.mysql.com/doc/refman/5.7/en/partitioning-management-range-list.html)in a sensible way. Then use `ALTER TABLE t DROP PARTIION` instead of `DELETE` statements to get rid of data.

This will hurt way less than deleting data, and also not mess with the structure of the B+-Tree.

```sql
CREATE TABLE t (
  id INTEGER NOT NULL PRIMARY KEY auto_increment,
  ...
) PARTITION BY RANGE (id) ()
    PARTITION p0 VALUES LESS THAN (1000000),
    PARTITION p1 VALUES LESS THAN (2000000)
);

ALTER TABLE t ADD PARTITION ( PARTITION p2 VALUES LESS THAN (3000000)),
             DROP PARTITION p0;
```

Because each partition is internally a table of its own, each partition will have their own much tinyier tree, and the actual drop operation is a file system delete instead of a tree rebalancing operation.

## Other systems

The problem statement sounds a bit like somebody is trying to build a time series database, but there are valid relation system use-cases that sound similar and are not actually a TSDB use case.

In case of this being a TSDB use-case, there is cassandra as a NoSQL data store with automatic data expiration, as shown [in the manual](https://docs.datastax.com/en/cql-oss/3.3/cql/cql_using/useExpireExample.html).

Prometheus, Influx and Graphite are popular TSDB data stores that work with structures that expire data more efficiently than rebalancing a B+-Tree.

## Events (and code in the database)

In our at-work styleguide we discourage the use of code in the database as a general rule. That means you are not supposed to use events, triggers, stored functions or stored procedures or even foreign key constraints.

They are hard to version and make migrations and upgrades very painful. They also create magical action at a distance, and they make it close to impossible to judge the cost of a statement by looking at the code. In fact, they often are invisible to developers looking at at checkout of the codebase.

Code in the database is usually not visible when you look at a piece of code that makes calls to an ORM. When you make changes to that code, or the table definition, in a distributed setup the rollout is often staggered and the old and new version of a thing have to co-exist and maintain compatibility with the changed and unchanged versions of a schema. With code in the database, a lot of complexity and fragility is added, so avoid this.

With foreign key constraints, it is even worse for a developer, because the cost of a statement is very hard to judge. A simple `DELETE FROM hotels WHERE id = 10` with an `ON DELETE CASCADE` can be fast, if there are few reservations dangling off this particular id, or it can literally take hours. Because this is part of the schema, and may be transitive an arbitrary number of relations deep, it is near impossible for developers to judge if this is acceptable. We prefer to code this in the host language instead.

Similarly, events are invisible and happen magically or don't. They tend to be forgotten and die with the box they are defined on, or are not upgraded properly with the schema they act on.

We have a distributed cron scheduler that is resilient, and schedule jobs on this, using code written in the host language instead of native SQL. This is visible to developers, and maintained with the rest of the application.

We ask developers to not use events.

On the other hand, we are an enterprise and large enough to have counter examples for every rule, usually well considered. But the rule still stands and makes sense.

So we *do* use events to create heartbeats in a heartbeat table: The replication master pushes the current timestamp into the heartbeat table and expires heartbeats after a time. Replicas and client applications can check the heartbeat visible on the replica itself and see actual lag.

This tends to fail when there is a master switchover or failover (it's SPoFfy and discouraged for a reason). Hence we also push the master hostname together with the timestamp, so that at the replica we can see which master pushed the heartbeat, and suddenly a simple idea becomes complex. This system is about to be replaced with an external heartbeat source RSN™.
