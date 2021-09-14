---
layout: post
title:  'MySQL Foreign Key Constraints and Locking'
author-id: isotopp
feature-img: assets/img/background/mysql.jpg
date: 2020-08-04 17:05:14 +0200
tags:
- lang_en
- database
- mysql
- innodb
- mysqldev
- erklaerbaer
---
Since we now know how to look at the state of locking in a live database, let's look at what happens when we run a normal insert or update and an insert or update with foreign key relationships defined, and compare.

We will be using the tables and structures from our previous examples, a simple 1:n relationship between `a` and `b`:

```sql
CREATE TABLE a (
  a_id int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (a_id)
);

INSERT INTO a VALUES (10), (20), (30), (40);

CREATE TABLE b (
  b_id int NOT NULL AUTO_INCREMENT,
  a_id int NOT NULL,
  PRIMARY KEY (b_id),
  KEY `a_id` (a_id),
  CONSTRAINT a_id_exists FOREIGN KEY (a_id) REFERENCES a (a_id) ON DELETE RESTRICT ON UPDATE RESTRICT
);

INSERT INTO b VALUES (10,10), (40,40);
```

or the same definition for `b` without the constraint.

## A normal INSERT and UPDATE

First, let's look at an insert and update into `b` without any defined constraints:

```sql
mysql> start transaction read write;
mysql> insert into b values (30,30);

mysql> select * from performance_schema.data_locks\G
...
            LOCK_TYPE: TABLE                              
            LOCK_MODE: IX
          LOCK_STATUS: GRANTED
            LOCK_DATA: NULL
...

mysql> update b set a_id=20 where b_id = 10;

mysql> select * from performance_schema.data_locks\G
...
       OBJECT_SCHEMA: kris
          OBJECT_NAME: b
           INDEX_NAME: PRIMARY
            LOCK_TYPE: RECORD
            LOCK_MODE: X,REC_NOT_GAP
          LOCK_STATUS: GRANTED
            LOCK_DATA: 10
...
```

We can see that the `INSERT` did just create an intention-lock on the table, but did not actually have to create any row locks. The update had to change an existing table row `b.b_id=10`, and hence needed to X-lock the row 10.

## INSERT and UPDATE with a foreign key constraint

Redefining the `b` table as above, with a foreign key constraint defined, produces a much richer set of locks:

```sql
mysql> start transaction read write;
mysql> insert into b values (30,30);

mysql> select * from performance_schema.data_locks\G
select object_schema, object_name, index_name, lock_mode, lock_data, lock_type from performance_schema.data_locks;
+---------------+-------------+------------+---------------+-----------+-----------+
| object_schema | object_name | index_name | lock_mode     | lock_data | lock_type |
+---------------+-------------+------------+---------------+-----------+-----------+
| kris          | b           | NULL       | IX            | NULL      | TABLE     |
| kris          | a           | NULL       | IS            | NULL      | TABLE     |
| kris          | a           | PRIMARY    | S,REC_NOT_GAP | 30        | RECORD    |
+---------------+-------------+------------+---------------+-----------+-----------+
```

In order for the `INSERT` to be valid, we need to check if the `a_id` inserted into table `b` exists in `a` - that is a lookup operation.

We also need to ensure that the value we checked for stays there and is not modified until we finish the transaction. So we do get an additional intention-lock on `a`, and then an actual S-lock on `a.a_id=30`. The intention-lock on `b` is as before.

Continuing our exploration, we can now try to change a row:

```sql
mysql> update b set a_id=20 where b_id=10;

mysql> select object_schema, object_name, index_name, lock_mode, lock_data, lock_type from performance_schema.data_locks;
+---------------+-------------+------------+---------------+-----------+-----------+
| object_schema | object_name | index_name | lock_mode     | lock_data | lock_type |
+---------------+-------------+------------+---------------+-----------+-----------+
| kris          | b           | NULL       | IX            | NULL      | TABLE     |
| kris          | a           | NULL       | IS            | NULL      | TABLE     |
| kris          | a           | PRIMARY    | S,REC_NOT_GAP | 20        | RECORD    |
| kris          | a           | PRIMARY    | S,REC_NOT_GAP | 30        | RECORD    |
| kris          | b           | PRIMARY    | X,REC_NOT_GAP | 10        | RECORD    |
+---------------+-------------+------------+---------------+-----------+-----------+
5 rows in set (0.00 sec)
```

We get another S-lock on `a.a_id=20` to ensure that our parent record stays unchanged until completion, and as we modify `b.b_id=10`, this is X-locked as in the normal case.

We observe:
- Defining foreign key constraints produces more S-locks.
- Given a 1:n relationship between `a` and `b`, making changes to `a_id` fields of records in `b` will S-lock the records in `a` that the changed rows in `b.a_id` are pointing to.
- We did not see this, but there was also a lookup in `a` to ensure that the `b.a_id` actually exists in `a`.

Experiment yourself:
- Add a column `data integer not null` to b.
- Make changes to `b.a_id` for one row, and to `b.data` for another row. How does the locking change?

You will find:
- Making changes to `b.data` neither affects the relationship between the tables, nor creates S-locks in `a`.

## Given the observed behavior, is our RMW still correct?

After looking at the locking behavior of these statements, and what we previously learned about locking: How would we `INSERT` and `UPDATE` the dependent records (`b` records) in our 1:n relationship correctly?

We can still manipulate all fields as before that are not foreign keys:

```sql
drop table b;
create table b (
  b_id int not null auto_increment,
  a_id int not null,
  data int not null,
  primary key (b_id)
  index (a_id).
  constraint a_id_exists foreign key (a_id) references a (a_id)
);
insert into b values (10,10, 10), (40,40,40);
```

And the RMW for writes to `data` is as before:

```sql
start transaction read write;
select b_id, data from b where b_id = 10 for update;
...
update b set data = ? where b_id = 10';
commit;
```

When we make changes to the linking between `b` and `a`, we must put a share lock on the new `a.a_id` we intend to link to, to ensure it is present and does not change or vanish until completion.

```sql
start transaction read write;
select a_id from a where a_id = 20 for share;
select b_id, a_id, data from b where b_id = 10 for update;
...
update b set a_id = 20 where b_id = 10';
commit;
```

As this is a linking to be created, we have to use two distinct select statements for this, and the locks need to be in place before we make the change.

## Self-referential structures and locks

Let's create a tree `c` where we have records distinguished by `c.id`, and with `c.parent` pointing to the parent `c.id`. We then put in a few records, multiple levels deep:

```sql
create table c (
  id integer not null primary key,
  parent integer null,
  index(parent),
  constraint up foreign key (parent) references c (id)
);

insert into c values (1, NULL), (2, 1), (3, 1), (4, 2), (5, 2), (6, 3), (7, 3), (8, 3), (9, 8), (10, 8);
```

Again, we insert a new record:

```sql
mysql> start transaction read write;
mysql> insert into c values (11, 2);

mysql> select object_schema, object_name, index_name, lock_mode, lock_data, lock_type from performance_schema.data_locks;
+---------------+-------------+------------+---------------+-----------+-----------+
| object_schema | object_name | index_name | lock_mode     | lock_data | lock_type |
+---------------+-------------+------------+---------------+-----------+-----------+
| kris          | c           | NULL       | IX            | NULL      | TABLE     |
| kris          | c           | PRIMARY    | S,REC_NOT_GAP | 2         | RECORD    |
+---------------+-------------+------------+---------------+-----------+-----------+
mysql> rollback;
```

This looks exactly as we would expect from the previous case.

Then we modify an existing record, again, without surprises:

```sql
mysql> start transaction read write;
mysql> update c set parent=2 where id=10;

mysql> select object_schema, object_name, index_name, lock_mode, lock_data, lock_type from performance_schema.data_locks;
+---------------+-------------+------------+---------------+-----------+-----------+
| object_schema | object_name | index_name | lock_mode     | lock_data | lock_type |
+---------------+-------------+------------+---------------+-----------+-----------+
| kris          | c           | NULL       | IX            | NULL      | TABLE     |
| kris          | c           | PRIMARY    | X,REC_NOT_GAP | 10        | RECORD    |
| kris          | c           | PRIMARY    | S,REC_NOT_GAP | 2         | RECORD    |
+---------------+-------------+------------+---------------+-----------+-----------+
3 rows in set (0.00 sec)

mysql> rollback;
```

## "UPSERT"

The term "UPSERT" is database-speak for "create a record, or if it exists, update it". The word is a portmanteau from Insert and Update. It can have three different resolutions for conflicts, and MySQL has three different special commands for this:

- *Older Record wins:* When a new record is to be inserted, but an older record with this primary key already exists, the old record should stay unmodified. MySQL has the command `INSERT IGNORE` for this.

- *Newer Record wins:* When a new record is to be inserted, but an older record with this primary key already exists, the old record is to be deleted, then the new record is to be inserted. MySQL has the command `REPLACE INTO` for this.

- *Merge old and new:* When a new record is to be inserted, but an older record with this primary key already exists, the old and new records have to be merged somehow. MySQL has `INSERT ON DUPLICATE KEY UPDATE` and the `VALUES()` function for this.

The generic way for this, without special commands, is again a RMW.

```sql
start transaction read write;
select * from t where id = ? for update;
... if necessary, select referenced records in other tables "for share"
... depending on the result, decide if insert or update
insert into t (id, ...) values (?, ...)
OR
update t set ... where id = ?
commit;
```

This is also what we would expect any ORM to generate, if it has not implemented special support for the MySQL dialect.
