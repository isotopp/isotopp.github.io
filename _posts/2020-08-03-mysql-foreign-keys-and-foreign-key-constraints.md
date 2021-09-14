---
layout: post
title:  'MySQL Foreign Keys and Foreign Key Constraints'
author-id: isotopp
feature-img: assets/img/background/mysql.jpg
date: 2020-08-03 07:29:49 +0200
tags:
- lang_en
- database
- mysql
- innodb
- mysqldev
- erklaerbaer
---
Foreign Keys are what links tables together and turns a set of tables into a model. Foreign Key Constraints are conditions that must be true for the content of the tables to be an internally consistent model. Foreign Key Constraints can be defined and enforced in InnoDB, but this comes at a considerable price, and for some it may hurt more than it is worth.

![](/uploads/2020/08/fk.png)

*A very simple shop as a ER-model. `order_id` is the primary key of the Orders table.  `customer_id` in the Orders table is a foreign key: The primary key of another ("foreign") table in this table. Foreign keys can model relationships between tables ("entities") in an entity-relationship diagram.*

## Entities and their relationships

In Entity-Relationship modelling we are using tables in a database to model entities in the real world. Each entry in such a table is meant to represent a "thing" in the real world. For example, in our very simple shop model above, we have Articles, and Customers as real world "things" in our model. We also have Orders, and Orders can have multiple lines, Orderlines. Each Orderline connects an Order with an Article.

In order to be able to distinguish real world things in our tables, we require each entry to have a unique identifier, the Id. These will then show up in the real world as customer numbers, order numbers or article numbers. The uniqueness of these numbers in their respective tables makes them a Key.

## Keys and Indexes

Technically a Key does not have to have a corresponding Index in the table: Keys and Indexes are separate things.

One - the Key - is a property of the model: "There exists a bijective function between the `customer_id` and the real world customers", meaning "Each customer has a `customer_id`", and "Any two different customers have different `customer_id`s". This is what allows us to use `customer_id`s as stand-ins for all the other values in the Customers table, and for the real world customers themselves, for the purpose of modelling them in the database.

The other - the Index - is a data structure that allows us to look up the other values of a Customer fast, given any `customer_id` value.

There is no need for a Key to have an Index, but we need to ensure that a new `customer_id` is unique. We are also given `customer_id`s all of the time, and then need to fetch the other data we have on this customer from the table. That means we need to look up `customer_id`s in the Customers table all of the time, and without the index we can only resort to a full table scan for this. This is going to be so slow that the table will be without any real-world value for us.

Practically, a Key and an Index go so much hand-in-hand that database people are using both terms interchangeably when they are clearly different things: An average database person will say Key, when they mean Index or the other way around, because in their minds having a Key without an Index is Not A Thing at all.

There may be multiple things - or combinations of things - that uniquely identify real world things in a given table of our model of the world. We call these Key Candidates. We then elect one to be the actual Key (or make one up, a Synthetic Key such as a `customer_id`), and call that the Primary Key or just the Key.

In the mind of a database person, the Primary Key is the row, and the row is the Primary Key. That is what bijective functions are for.

Technically, a table doesn't need to not have a Primary Key. Practically, this creates so many kinds of problems that many databases have options to prevent this: They will reject table definitions without a primary key definition for good, and responsible database administrators enable these restrictions.

## Foreign Keys

A column in table `B` that contains primary key values from a table `A` is called a *foreign key*. It defines a relationship. Just the presence of that key column is enough, there need not be any declaration or enforcement for it to be a foreign key.

```sql
create table a (
  a_id integer not null primary key auto_increment,
  a_other_data varchar(200)
);

create table b (
  b_id integer not null primary key auto_increment,
  a_id integer not null,
  b_other_data varchar(200),
  index a_id (a_id)
)
```

In this example the table `a` has a primary key `a.a_id`. Table `b` contains a reference to `a` in the form of the column `b.a_id`. This column is a foreign key. Technically, "foreign key" is a meaningless term, so actually "`b.a_id` is a foreign key of `a` in `b`" to be precise. When talking about tables, this is often implicitly clear, so many people omit this and just say "foreign key" and assume you understand what is means.

As can be seen, table `b` is also defined with an `index a_id (a_id)` - what we model here ia a 1:n relationshop between `a` and `b` (an "a" can have many "b"), and we expect to look up all the `b`'s for a given `a` a lot, so having that index is a no-brainer.

```sql
select *
  from a join b
    on a.id = b.a_id
 where somecondition_on_a
 ```

 This query will list all the `b`'s that belong to the `a`'s selected by the given condition, and it will only be fast with an index on `b.a_id`.

## Foreign Key Constraints

Now, when we put a `b.a_id` into `b`, we would normally want the matching `a.a_id` to exist. That is, when we put in an `orders.customer_id` value, there better be a `customers.customer_id` for this, or there will be problems.

Foreign Key Constrains are conditions that can be put into table definitions to enforce that. Actually doing this may or may not be a good idea, we will be looking at that in some more detail in a separate article.

Let's define a useless base table with a primary key:

```sql
create table a (
  a_id integer not null primary key auto_increment 
);
Query OK, 0 rows affected (0.05 sec)
```

For this we want a table b that references the base table, and has a constraint for this.

```sql
create table b (
  b_id integer not null primary key auto_increment, 
  a_id integer not null, 
  index a_id (a_id), 
  constraint a_id_exists 
    foreign key (a_id) references a(a_id)
      on delete restrict 
      on update restrict );
Query OK, 0 rows affected (0.13 sec)
```

There are many things to this, and all of them are required to make this work.

- We need a base table `a` with a primary key defined.
- We need a secondary table `b` with a column that we want to use to reference `a.a_id`. We can name it anything we want, but we usually use the name of the foreign tables primary key. If that is not unique (simply `id`), we usually prefix it with the table name and an underscore. We are using `a_id` here, because that works.
- We have to define an index in the foreign key column in `b`. When we don't, MySQL does this automatically and uses the constraint name for this. Leave off `index a_id (a_id)` from our `CREATE TABLE b` statement, and see what you get.
- The constraint we define can get a name, or MySQL chooses one when we leave of the `constraint a_id_exists` part of the statement.
- We then describe which of "our" columns points to what column in the other table: `foreign key (a_id) references a(a_id)`.
- Finally we get to say what shall happen when there are update or delete statements that would invalidate the relationship. This part is also optional.

Thus, the shortest possible definition of `b` would be

```sql
create table b ( 
  b_id integer not null primary key auto_increment,
  a_id integer not null, 
  foreign key (a_id) references a(a_id) 
);
```

and yields

```sql
mysql> show create table b\G
*************************** 1. row ***************************
       Table: b
Create Table: CREATE TABLE `b` (
  `b_id` int NOT NULL AUTO_INCREMENT,
  `a_id` int NOT NULL,
  PRIMARY KEY (`b_id`),
  KEY `a_id` (`a_id`),
  CONSTRAINT `b_ibfk_1` FOREIGN KEY (`a_id`) REFERENCES `a` (`a_id`)
) ENGINE=InnoDB
```

[The Manual](https://dev.mysql.com/doc/refman/8.0/en/create-table-foreign-keys.html) describes the other terms and conditions that apply, and also explains which types of referential actions are valid for the `ON DELETE` and `ON UPDATE` clauses.

## Playing with foreign key constraints

Using the definitions of `a` and `b` from above, we are now playing with foreign key constraints a bit:

```sql
mysql> insert into a values (10), (20), (30), (40);
Query OK, 4 rows affected (0.02 sec)
Records: 4  Duplicates: 0  Warnings: 0
```

The values 10, 20, 30 and 40 are now valid primary keys in `a`, and hence valid values for `a_id`in `b`.

```sql
mysql> start transaction read write;
Query OK, 0 rows affected (0.00 sec)

mysql> insert into b values (10, 10);
Query OK, 1 row affected (0.00 sec)

mysql> insert into b (20, 20), (50,50), (30,30);
ERROR 1452 (23000): Cannot add or update a child row: a foreign key constraint fails (`kris`.`b`, CONSTRAINT `a_id_exists` FOREIGN KEY (`a_id`) REFERENCES `a` (`a_id`) ON DELETE RESTRICT ON UPDATE RESTRICT)
mysql> insert into b values (40, 40);
Query OK, 1 row affected (0.00 sec)

mysql> commit;
Query OK, 0 rows affected (0.01 sec)

mysql> select * from b;
+------+------+
| b_id | a_id |
+------+------+
|   10 |   10 |
|   40 |   40 |
+------+------+
2 rows in set (0.00 sec)
```

The tuple (50, 50) caused a foreign key validation error on an extended insert statement, the second statement in our transaction. The entire statement was rejected. The first and third statement in our transaction were valid and accepted. The entire transaction was not rejected and committed.

This is potentially dangerous.

```sql
mysql> update b set a_id = 20 where b_id = 10;
Query OK, 1 row affected (0.00 sec)
Rows matched: 1  Changed: 1  Warnings: 0

mysql> update b set a_id = 15 where b_id = 10;
ERROR 1452 (23000): Cannot add or update a child row: a foreign key constraint fails (`kris`.`b`, CONSTRAINT `b_ibfk_1` FOREIGN KEY (`a_id`) REFERENCES `a` (`a_id`))
```

We can change the `b.aid` to values present in the `a.a_id` table. Changing them to invalid values is being rejected.

Likewise we are prevented from deleting a row from `a` if there are still values in `b.a_id` referencing this row, and summary deletion, truncation or dropping of table `a` are also prevented as long as any reference from `b` to `a` exists.

```sql
mysql> delete from a where a_id = 20;
ERROR 1451 (23000): Cannot delete or update a parent row: a foreign key constraint fails (`kris`.`b`, CONSTRAINT `b_ibfk_1` FOREIGN KEY (`a_id`) REFERENCES `a` (`a_id`))

mysql> delete from a where a_id = 10;
Query OK, 1 row affected (0.00 sec)

mysql> delete from a;
ERROR 1451 (23000): Cannot delete or update a parent row: a foreign key constraint fails (`kris`.`b`, CONSTRAINT `b_ibfk_1` FOREIGN KEY (`a_id`) REFERENCES `a` (`a_id`))

mysql> truncate table a;
ERROR 1701 (42000): Cannot truncate a table referenced in a foreign key constraint (`kris`.`b`, CONSTRAINT `b_ibfk_1`)

mysql> drop table a;
ERROR 3730 (HY000): Cannot drop table 'a' referenced by a foreign key constraint 'b_ibfk_1' on table 'b'.
```

## A self-referential structure

We can define tables that describe hierarchies by using recursive foreign key relationships, but we have to take care to allow termination of the recursion.

```sql
create table d (
  id serial,
  parent bigint unsigned not null, 
  foreign key (parent) references d (id) );
```

This is a valid definition that is accepted by MySQL. In order for an insert to succeed, we would have to provide a valid value for `d.parent`, but the table is empty and we did not allow `NULL`.

The only valid thing we could insert is the value we are inserting right now, and that value is then undeletable.

```sql
mysql> insert into d values ( 0, NULL );
ERROR 1048 (23000): Column 'parent' cannot be null

mysql> insert into d values ( 1, 1);
Query OK, 1 row affected (0.00 sec)

mysql> delete from d where id = 1;
ERROR 1451 (23000): Cannot delete or update a parent row: a foreign key constraint fails (`kris`.`d`, CONSTRAINT `d_ibfk_1` FOREIGN KEY (`parent`) REFERENCES `d` (`id`))
```

Allowing `NULL` may be making a structure that is a tiny bit easier to maintain. We can now define a tree structure, but we have to do it from the top down.

```sql
mysql> create table c ( id serial, parent bigint unsigned null, foreign key (parent) references c (id) );
Query OK, 0 rows affected (0.06 sec)

mysql> insert into c values (4, 2), (5, 2), (6,3), (7,3), (8,3), (2,1), (3,1), (1, NULL);
ERROR 1452 (23000): Cannot add or update a child row: a foreign key constraint fails (`kris`.`c`, CONSTRAINT `c_ibfk_1` FOREIGN KEY (`parent`) REFERENCES `c` (`id`))

mysql> insert into c values (1, NULL), (2,1), (3,1), (4,2), (5, 2), (6, 3), (7,3), (8,3);
Query OK, 8 rows affected (0.01 sec)
Records: 8  Duplicates: 0  Warnings: 0
```

Both statements define the same tree structure, but one does it from the bottom up, the other from the top down. We can see that even inside a single statement referential integrity is enforced at a per-row level and the first statement is impossible to load. Order suddenly matters.

The same would be true if we used multiple insert statements inside the same transaction: Even if the entire set of rows is only committed at the end of the transaction, statements inside the transaction suddenly have to have an order, and all referential integrity constraints have to be valid at all times ("for each row").

For individual tables or simple 1:1 relationships this matters little, but referential integrity is transitive and it is very easy to build completely validated structures that become uninsertable, unupdateable or undeletable, or to build referential integrity puzzles.

The SQL Standard definies behavior for this - checking referential integrity only at the end of a transaction - but InnoDB does not implement this. This makes working with foreign key constraints very hard and limits their usefulness.

## Walking our tree

But at least we can walk our tree, and be sure it is well defined:

```sql
with recursive tree as (
  select c.id, c.parent, 0 as level, convert("1", char(255)) as path
    from c 
   where parent is null
  union all
  select x.id, x.parent, tree.level + 1 as level, concat(tree.path, ",", x.id) as path
    from c as x 
    join tree 
      on tree.id = x.parent
)
select * from tree;
+------+--------+-------+-------+
| id   | parent | level | path  |
+------+--------+-------+-------+
|    1 |   NULL |     0 | 1     |
|    2 |      1 |     1 | 1,2   |
|    3 |      1 |     1 | 1,3   |
|    4 |      2 |     2 | 1,2,4 |
|    5 |      2 |     2 | 1,2,5 |
|    6 |      3 |     2 | 1,3,6 |
|    7 |      3 |     2 | 1,3,7 |
|    8 |      3 |     2 | 1,3,8 |
+------+--------+-------+-------+
```

## What we found so far.

- Foreign Keys are everywhere.
- Foreign Key Constraints look attractive at first, in order to ensure our Foreign Keys are valid.
- But they are being enforced at the row level.
  - That enforces an order to operations within a transaction.
  - It is easy to build structures that are hard to update, delete from, truncate or even drop.
  - It is easy to create structures with undeletable records.
- The SQL Standard has options to make this less painful, but MySQL does not implement these.

