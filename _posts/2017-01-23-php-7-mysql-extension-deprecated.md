---
layout: post
status: publish
published: true
title: 'PHP 7: mysql extension deprecated'
author-id: isotopp
date: '2017-01-23 15:13:12 +0100'
feature-img: assets/img/background/mysql.jpg
tags:
- mysql
- php
---
In [mysql() nach PHP 7
retten](http://kuehnast.com/s9y/archives/650-mysql-nach-PHP-7-retten.html),
Charly Kühnast explains how you can get the deprecated and
disabled mysql extension back in PHP 7. You shouldn't. There are
many reasons for this.

One of them being that none of the newer features in MySQL can
be used with the old mysql extensions. There is an
[overview](http://php.net/manual/en/mysqlinfo.api.choosing.php)
in the PHP documentation that explains exactly what you are
missing.

One of the things that you are missing is support for prepared
statements. Prepared statements are a mechanism in which you
write SQL statements with placeholders for variables, and then
later bind values to the placeholders using a "bind" call or as
part of the "execute" call which is actually running the
statement.

In any case, the variables are being escaped properly
automatically, making SQL injection a lot harder. This is not
just a problem limited to PHP - a search for bind and execute
other sources can be very instructive. For example, the sources
of Opennebula or in older versions of Owncloud (up to and
including version 7) are rich treasure troves of potential
exploits.

So currently the situation is as follows:

![](/uploads/2017/01/mysql_protokolle-1.png)

There are three extensions at the PHP level, one of which is deprecated and
disabled in PHP 7:

- The old mysql extension is no longer available by default, and
  for good reasons. Do not use it, do not attempt to use code
  that uses it.
- The mysqli extension has been around for very many years, and
  offers a procedural and an object oriented interface, and
  makes "newer" MySQL features available, including prepared
  statements.
- The PDO\_mysql extension has been around for many years, too,
  and offers an object oriented, and portable across databases
  interface. It also allows access to all "newer" MySQL
  features.

The wire protocol of all of these extensions is implemented by a
C-level library, against which the extension can be linked. A
[manual page](http://php.net/manual/en/mysqlinfo.library.choosing.php)
explains the choices.

- Traditionally that has been the Oracle/MySQL C-API
  ("libmysqlclient", "Connector/C"), which comes with the
  database server. It is available on the GPL, which is a
  license different from the PHP license of the rest of the PHP
  proper, and it has it's own memory management, which is
  different from the PHP native memory management.
- Since PHP 5.3, there is mysqlnd (the "native driver", ND). It
  re-implements the MySQL wire protocol, and is available under
  the same license as PHP itself. It also uses the same memory
  management that PHP uses, which makes it faster (no copying)
  and more efficient (no duplication of values). It is the
  default on a normal PHP build these days.

## What you should be using:

These days, your code should not be using the mysql extension.
So you will be using mysqli or PDO\_mysql, depending on your
needs, with the underlying implementation of the native driver
doing the heavy lifting.

Do not attempt to port mysql-Extension based code to PHP 7
without refactoring it for prepared statements, please.
