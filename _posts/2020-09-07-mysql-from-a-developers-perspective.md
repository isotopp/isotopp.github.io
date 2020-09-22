---
layout: post
title:  'MySQL from a Developers Perspective'
author-id: isotopp
feature-img: assets/img/background/mysql.jpg
date: 2020-09-07 09:18:16 +0200
tags:
- lang_en
- mysql
- database
- innodb
- erklaerbaer
- mysqldev
---
So this has turned into a small series, explaining how to work with MYSQL from a developers perspective. This post is intended as a directory for the individual articles. It will be amended and re-dated as necessary.

The code for the series is also available in [isotopp/mysql-dev-examples](https://github.com/isotopp/mysql-dev-examples.git) on GitHub.

The Tag [#mysqldev](https://blog.koehntopp.info/tags/#mysqldev) will reference all articles from this series.

- [MySQL Transactions - the physical side]({% link _posts/2020-07-27-mysql-transactions.md %}).
  Looking at how MySQL InnoDB handles transactions on the physical media, enabling rollback and commit. Introduces a number of important concepts: The Undo Log, the Redo Log, the Doublewrite Buffer, and the corrosponding in memory structures, the Log Buffer and the InnoDB Buffer Pool, as well as the concept of a page.

- [MySQL Commit Size and Speed]({% link _posts/2020-07-27-mysql-commit-size-and-speed.md %}).
  This article has code in Github, in mysql-commit-size/. We benchmark MySQL write speed as a function of number of rows written per commit.

- [MySQL Connection Scoped State]({% link _posts/2020-07-28-mysql-connection-scoped-state.md %}).
  Looking at things that are stateful and attached to a MySQL connection, and are lost on disconnect.

- [MySQL Transactions - the logical view]({% link _posts/2020-07-29-mysql-transactions-the-logical-view.md %}).
  This article introduces the concept of `TRANSACTION ISOLATION LEVEL` and how pushing things into the Undo Log, while a necessity to implement `ROLLBACK` for a Writer, enables features for a Reader.

- [MySQL Transactions - writing data]({% link _posts/2020-07-30-mysql-transactions---writing-data.md %}).
  This article has code in Github, in mysql-transactions-counter. We increment a counter in the database, with multiple concurrent writers, and see what happens.

- [MySQL: Locks and Deadlocks]({% link _posts/2020-08-01-mysql-locks-and-deadlocks.md %}).
  When changing multiple rows, it is possible to take out locks in transactions one by one. Depending on how that is done, it may come to deadlocks, and server-initiated rollbacks. When that happens, the transaction must be retried.

- [MySQL Deadlocks with INSERT]({% link _posts/2020-08-02-mysql-deadlocks-with-insert.md %})
  When using the obscure transaction isolation level `SERIALIZABLE`, it may happen that a single `INSERT` can deadlock. Here is how, and why.

- [MySQL Foreign Keys and Foreign Key Constraints]({% link _posts/2020-08-03-mysql-foreign-keys-and-foreign-key-constraints.md %})
  When establishing relationships between tables, you are doing this by putting one tables primary keys into another tables columns. Enforcing valid pointers between tables seems like a sexy idea, but is painful, and maybe hurts more than it helps.

- [MySQL Foreign Key Constraints and Locking]({% link _posts/2020-08-04-mysql-foreign-key-constraints-and-locking.md %})
  Looking at tables with foreign key constraints, we check what happens to table and row locks, and how this is different from before.

- [MySQL: Some Character Set Basics]({% link _posts/2020-08-18-mysql-character-sets.md %})
  A collection and re-evaluation of things I wrote about MySQL character sets in the past, updated to match MySQL 8.

- [MySQL: NULL is NULL]({% link _posts/2020-08-25-null-is-null.md %})
  Understanding the handling of NULL values in SQL. NULL is not false, nor None/nil/undef, but is a thing specific to SQL.

- [MySQL: Basic usage of the JSON data type]({% link _posts/2020-09-04-mysql-json-data-type.md %})
  MySQL 8 gains support of a JSON data type. How to get data in and out of JSON fields.
