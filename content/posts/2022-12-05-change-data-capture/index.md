---
author: isotopp
title: "Change Data Capture"
date: "2022-12-05T06:07:08Z"
feature-img: assets/img/background/mysql.jpg
tags:
  - lang_en
  - mysql
  - mysqldev
  - data warehouse
aliases:
  - /2022/12/05/change-data-capture.html
---

Change Data Capture is a way to capture, well, events from a system that describe how the data in the system changed.
For a system that does business transactions that may be at the lowest level Create, Update, or Delete of entities or relationships.
Systems that emit this kind of events are called Entity Services and are kind of the lowest level of events that you can have in such a system.

In our sample reservation system from earlier in this blog, we get this schema:

![](2022/11/snowflake-01.png)

*In an OLTP database, a reservation is a `(resid, userid, thingid, date)`. It references the `user` data by `userid`, and the `thing` data by `thingid`.*

and therefore the events are

```console
CreateUserEvent(user)
UpdateUserEvent(user)
DeletUserEvents(user)

CreateThingEvent(thing)
UpdateThingEvent(thing)
DeleteThingEvent(thing)

CreateReservationEvent(user, thing, date)
UpdateReservationEvent(user, thing, date)
DeleteReservationEvent(user, thing, date)
```

or maybe a slightly more refined version of that, in which you create actual Getters and Setters for the properties of the entities modified.

But in an actual Event Sourcing system, you would write down and name the individual business transactions, and describe their behaviors.

In our reservation system, we have users that subscribe or unsubscribe to our reservation service, or update their data.
This should be reflected in the names of the methods.
We also have operations by users on things, such as a `Reservation()`, `Cancellation()`, a `Takeout()` or a `Return()` with the appropriate parameters.
These events are behavioral, and the behaviors are the business transactions which describe what the business does.

But when we are retrofitting CDC onto an existing system, getting behavioral events is often a major refactoring or re-architecting task.
So for this article, let's focus on grabbing Entity Events.
And because this is the third in a series of articles on data warehouses, on flattening, that is, replacement of identifiers by the values we want exported.

# How to get Events?

In a system designed to generate behavioral business events from the start, you would emit these events directly from the application, and would add the business event identifier also to the transactions in your OLTP system.
This way you can make sure each record in the database has a matching business event and vice versa, enabling you to audit the database and the event stream for consistency.

In our retrofitted system, this is not possible, because we have neither behavioral business events nor identifiers for these.
We still want data, but we grab it from the database.

In MySQL, we get row level change data from the Binlog in a moderately well documented and stable format.
Binlog is what powers MySQL replication. 
It is guaranteed to have an upgrade path, but it is not necessarily stable.
So if the binlog format changes, and you have critical applications consuming the binlog that are not MySQL replicas, you need to be prepared to make changes to the binlog processors, quickly, in order to be able to upgrade MySQL.
This is not a hypothetical scenario: When MySQL introduced Global Transaction IDs and later Binlog compression, a lot of third party binlog consumers broke.

Packages that consume binlog are for example
[python-mysql-replication](https://github.com/julien-duponchelle/python-mysql-replication)
, or 
[Debezium](https://github.com/debezium/debezium).

Using python-mysql-replication, and creating tables for our simple reservation system above, we can run the `examples/dump_events.py` to see what goes on:

```console
(venv) $ python examples/dump_events.py
...
=== QueryEvent ===
Date: 2022-12-05T16:14:16
Log position: 3282
Event size: 181
Read bytes: 181
Schema: b'kris'
Execution time: 0
Query: create table thing (thingid integer not null primary key, name varchar(80), color varchar(20), weight decimal(12,4))

=== QueryEvent ===
Date: 2022-12-05T16:14:32
Log position: 3751
Event size: 161
Read bytes: 161
Schema: b'kris'
Execution time: 0
Query: create table user ( userid integer primary key not null, name varchar(80), address varchar(200))

=== QueryEvent ===
Date: 2022-12-05T16:15:15
Log position: 4052
Event size: 199
Read bytes: 199
Schema: b'kris'
Execution time: 0
Query: create table reservation(resid integer not null primary key, userid integer not null, thingid integer not null, resdate date not null)
```

For each DDL statement, we get a `QueryEvent` with some identifiers, the schema name, and the actual Query statement.
The Query statement is not normalized, so if we wanted to do more with it than simply passing it on, we would also need a MySQL SQL syntax parser.

Later on, when loading data, we get `RowsEvent` instances, and need to modify the script a bit to see the actual row changes.
We send SQL:
```sql
mysql> insert into user values (1, "Kris", "At home");
mysql> insert into thing values (1, "A Fish", "Colorful", 10.0);
mysql> insert into reservation (1, 1, 1, date(now())); 
```
And we get Row Change Events. They might look like this:

```console
{'action': 'insert',
 'address': 'At Home',
 'name': 'Kris',
 'schema': 'kris',
 'table': 'user',
 'userid': 1}
{'action': 'insert',
 'color': 'Colorful',
 'name': 'A Fish',
 'schema': 'kris',
 'table': 'thing',
 'thingid': 1,
 'weight': Decimal('10.0000')}
{'action': 'insert',
 'resdate': datetime.date(2022, 12, 5),
 'resid': 1,
 'schema': 'kris',
 'table': 'reservation',
 'thingid': 1,
 'userid': 1}
```

We also would get additional events, but we ignored them -- they would contain the transaction ID, table maps and so on.

The problem with this kind of data is obvious:
We know that for a proper ETL process we need the attribute values of the things referenced, not the ids pointing to the attributes.

So when we receive a row change event on the `reservation` table, 
we only have the option of running a back-query to the database to resolve the ids for data.
That is, for the `userid: 1` from the `reservation` row change we would have to `select * from user where userid = 1` to resolve the username and address.

But even that has the potential for a race condition, if a table changes faster than we can back-query.
Worse, it also makes your extraction process very fragile, because the moment we change the `reservation` table in an incompatible way our back-queries would break.

# The Outbox

If we want to decouple this, we need to have the CDC process ignore all the OLTP tables.
That is, changes to `user`, `thing` and `reservation` must be ignored.

Instead, we need to create a table `cdc_outbox`.
We would then modify the application to make changes to the OLTP tables and a flattened, DWH-like write to `cdc_outbox` in a single transaction.
So instead of

```sql
mysql> insert into user values ( ...);
```

we would get

```sql
mysql> start transaction read write;
mysql> insert into user values (...);
mysql> insert into cdc_outbox values ( ... );
mysql> commit; 
```

Doing this inside a single transaction guarantees that we only see outbox writes when there is also a CDC change.
The data in the `cdc_outbox` would already be flattened, and maybe already in some kind of type-agnostic, easily parseable format like JSON.

We can then pick up these changes, and only the changes to `cdc_outbox` and process these.
The transactional team can go and make changes to their transactional tables without talking to the analytics team, as long as they make sure to generate correct change records.
And we get rid of the back-queries and the potential breakage and race conditions they bring.
