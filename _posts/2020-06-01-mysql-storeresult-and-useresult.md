---
layout: post
title:  'MySQL store_result and use_result'
author-id: isotopp
feature-img: assets/img/background/mysql.jpg
date: 2020-06-01 17:47:36 +0200
tags:
- lang_en
- mysql faq
- mysql
- erklaerbaer
- reddit
---
A [question](https://www.reddit.com/r/mysql/comments/gun836/are_cursors_always_slow/) from Reddit’s /r/mysql led to a longer discussion of cursors and how they are implemented in MySQL, and what the advantages and drawbacks are.

The OP probably had a slow query, but was misphrasing the question:
>I am having performance problems where my cursor is taking 6-8 seconds to go through a hundred rows. I think this is because I am also using while loops to loop through JSON objects to pull information. I am wondering if cursors are usually this slow or if I have set it up poorly.

This turned into a longer exchange about the MySQL C API and the other APIs - some of them have been created by wrapping the C-API, others reimplemented the protocol from scratch.

When the server executes a query, the result is shipped to the client as a result set, which we can imagine as a table made up from rows made up from columns. The server tries to resolve the query in a streaming fashion, because that allows it to ship each row as it is being produced, saving memory in the server. The default Join Algorithm MySQL uses, [Nested Loop Join](https://en.wikipedia.org/wiki/Nested_loop_join), is well suited for this. 

So unless the result set needs to be captured for further treatment in the server (indicated by "using temporary" or "using filesort" in the EXPLAIN), it is being shipped to the client as it is being produced.

The client by default downloads the whole result set into memory, and keeps it there until it is no longer needed (until mysql_free_result() is being called in the C API). This can use a lot of memory, but it allows the client to jump around in the result set randomly. The host language can request this mode (it is the default) with the function [mysql_store_result()](https://dev.mysql.com/doc/refman/8.0/en/mysql-store-result.html).

If you expect very large result sets you can save a lot of memory, at the cost of losing the capability of random access to the result set, by requesting a streaming mode with [mysql_use_result](https://dev.mysql.com/doc/refman/8.0/en/mysql-use-result.html).

In this mode, each result set row is being downloaded as it is needed - until then it is being queued in the server. In fact, streaming query execution in the server is stalled. Only as the client requests another row the server begins to produce this row, synchronizing query execution in the server and the client. This used to be a Bad Thing™ because with MyISAM queries a table lock was held by an executing query, and if the client stalls query execution in mysql_use_result() mode locks on the server will be held longer and memory resources will be held longer, straining scarce server resources.

With InnoDB, things became better - locking is different, and with [MVCC](https://en.wikipedia.org/wiki/Multiversion_concurrency_control) readers are never stalled by writers (or other readers). Still, mysql_store_result() is the default, and this is mostly a good thing.

Only for programs such as `mysqldump` the streaming mode is the default. mysqldump calls it the `--quick-mode` and it is on by default. Otherwise mysqldump would try to download the entire database into client memory, and that is usually a very bad idea. You could run `mysqldump --skip-quick-mode` and watch the mysqldump binary bloat until you get a visit from the OOM killer.

So how is this done in different language APIs?

### Perl

[https://metacpan.org/pod/DBD::mysql#DATABASE-HANDLES](https://metacpan.org/pod/DBD::mysql#DATABASE-HANDLES), scroll down to mysql_store_result

```perl
$dbh = DBI->connect("DBI:mysql:test;mysql_use_result=1", "root", "");
```

### PHP

[https://www.php.net/manual/en/mysqli.use-result.php](https://www.php.net/manual/en/mysqli.use-result.php), see examples there. PHP contains an independent implementation of the MySQL protocol with a different memory management that leverages Zend Values (ZVALs) in order to prevent data duplication, the situation is a bit more complicated and a lot more efficient here.

### Java

[https://dev.mysql.com/doc/connector-j/8.0/en/connector-j-reference-implementation-notes.html](https://dev.mysql.com/doc/connector-j/8.0/en/connector-j-reference-implementation-notes.html), scroll down to ResultSet, look up fetchSize().

JDBC is a protocol implementation in native Java and is not based on Connector/C alias libmysqlclient.a. Things could be different here, within limits (the protocol is still the same), but mostly aren't.

### ODBC

[https://dev.mysql.com/doc/connector-odbc/en/connector-odbc-configuration-connection-parameters.html](https://dev.mysql.com/doc/connector-odbc/en/connector-odbc-configuration-connection-parameters.html), scroll down to the prefetch parameter.

ODBC is a protocol implementation that is not based on Connector/C alias libmysqlclient.a. Things are different here, mostly because ODBC is a very rigid specification and a lot of things cannot be easily mapped from ODBC-think into MySQL-realities. There are a lot of parameters and magical values. Tread with care.

