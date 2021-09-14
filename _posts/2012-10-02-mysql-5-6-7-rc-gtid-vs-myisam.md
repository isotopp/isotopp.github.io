---
layout: post
published: true
title: 'MySQL 5.6.7-RC: GTID vs. MyISAM'
author-id: isotopp
date: 2012-10-02 15:51:03 UTC
tags:
- innodb
- mysql
- replication
- gtid
- lang_en
feature-img: assets/img/background/mysql.jpg
---
So we tested the 5.6.7-RC. And ran into a strange problem:

Because of a test, a preexisting configuration with GTID enabled existed,
and suddenly we did not have properly initialized grants in mysql.\* created
for a new installation.  Turns out: GTID and non-transactional tables are no
friends, and that is even
[documented](http://dev.mysql.com/doc/refman/5.6/en/replication-gtids-restrictions.html).

> When using GTIDs, updates to tables using nontransactional storage engines
> such as MyISAM are not supported.  This is because updates to such tables
> mixed with updates to tables that use a transactional storage engine such
> as InnoDB can result in multiple GTIDs being assigned to the same
> transaction.

Also, this is supposed to work with GRANT and REVOKE, but not with INSERT
and DELETE.  Now guess what mysql-install-db and friends are using?

```sql
server:~ # less /usr/share/mysql/mysql_system_tables_data.sql
...
INSERT INTO tmp_user VALUES ('localhost','root','',...);
```

This is a larger problem: We are supposed to use GRANT and REVOKE, but many
people are using INSERT and DELETE in mysql.\* all of the time, and so do
many applications.  And the mysql.\* tables are MyISAM, and always have been
(except that nowadays there is a wild mix of CSV and InnoDB tables in there
as well).

MySQL cannot really ship GTID as a feature with MyISAM-tables in mysql.\*
and expect that to work anywhere.  This is all very extremely broken and
needs urgent fixing.

This is now support-case SR 3-6270525721: "MySQL 5.6.7-rc1, grants,
replication and GTID cause problems" and will also soon have a bug number. 
And, no, fixing the mysql_system_tables_data.sql is not really removing the
problem here.
