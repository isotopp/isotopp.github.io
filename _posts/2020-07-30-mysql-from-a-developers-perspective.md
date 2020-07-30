---
layout: post
title:  'MySQL from a Developers Perspective'
author-id: isotopp
feature-img: assets/img/background/rijksmuseum.jpg
date: 2020-07-30 09:18:16 +0200
tags:
- lang_en
- mysql
- database
- innodb
- erklaerbaer
- mysqldev
---
So this has turned into a small series, explaining how to work with MYSQL
from a developers perspective. This post is intended as a directory for the
individual articles. It will be amended and re-dated as necessary.

The code for the series is also available in
[isotopp/mysql-dev-examples](https://github.com/isotopp/mysql-dev-examples.git)
on GitHub.

The Tag [#mysqldev](https://blog.koehntopp/info/tags/#mysqldev) will
reference all articles from this series.

- [MySQL Transactions - the physical side](https://blog.koehntopp.info/2020/07/27/mysql-transactions.html).
  Looking at how MySQL InnoDB handles transactions on the physical media, enabling rollback and commit.
  Introduces a number of important concepts: The Undo Log, the Redo Log, the Doublewrite Buffer, and
  the corrosponding in memory structures, the Log Buffer and the InnoDB Buffer Pool, as well as the
  concept of a page.

- [MySQL Commit Size and Speed](https://blog.koehntopp.info/2020/07/27/mysql-commit-size-and-speed.html).
  This article has code in Github, in mysql-commit-size/. We benchmark MySQL write speed as a function
  of number of rows written per commit.

- [MySQL Connection Scoped State](https://blog.koehntopp.info/2020/07/28/mysql-connection-scoped-state.html).
  Looking at things that are stateful and attached to a MySQL connection, and are lost on disconnect.

- [MySQL Transactions - the logical view](https://blog.koehntopp.info/2020/07/29/mysql-transactions-the-logical-view.html).
  This article introduces the concept of `TRANSACTION ISOLATION LEVEL` and how pushing things into the
  Undo Log, while a necessity to implement `ROLLBACK` for a Writer, enables features for a Reader.

- [MySQL Transactions - writing data](https://blog.koehntopp.info/2020/07/30/mysql-transactions-writing-data.html).
  This article has code in Github, in mysql-transactions-counter. We increment a counter in the database,
  with multiple concurrent writers, and see what happens.
