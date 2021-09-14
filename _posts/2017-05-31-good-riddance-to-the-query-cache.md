---
layout: post
status: publish
published: true
title: Good Riddance to the Query Cache
author-id: isotopp
feature-img: assets/img/background/mysql.jpg
date: '2017-05-31 15:36:31 +0200'
tags:
- mysql
- lang_en
---	
[MySQL 8.0 will be retiring support for the Query Cache](http://mysqlserverteam.com/mysql-8-0-retiring-support-for-the-query-cache/).
The MySQL Query cache is a result cache: The MySQL server will
record all result sets that are small enough to keep in the
cache, and a hash of the query that produced it.

If a query meets certain requirements, and the hash of the same
query string is ever seen again, the query will not be actually
parsed and executed, but the same result set will be replayed.
There are mechanisms in place that prevent uncacheable queries
from being cached in the first place, and that prune outdated
data from the query cache.

The query cache exists in the first place, because it was easier
to create than to teach every PHP CMS developer in the world
about sessions. So instead of retrieving the current background
color of the current theme over and over from the database, the
query cache recognizes the current theme color query again and
just replays "green" over and over. But that was
then.

The Query Cache was a hash, with a global lock. Whenever a write
happens to a table, all cached results related to this table
need to be pruned from the cache. For that, a global lock is
taken out and all queries are being halted for the duration of
the prune.

On a busy server, and with a large query cache, the locking time
can be long enough to matter. Typically, one would run `innotop
-m Q -d 0.1` or similar, and suppress the display of idle queries.
Typically a number of busy queries similar to the current load
on the machine would be shown, so on a server with a load of 12
one would see 10-14 busy running queries.

Whenever there is a cache lock taken out and a prune going on,
the queries would all be halted and pile up for a very short
time. So on a server going at a brisk 4000-6000 queries per
second, a few hundred would pile up for a very short time -
innotop would show 10,12,10,14,532,10,9,11 queries and so on.
This is called a flash pileup or flash pile.

As the load grows, write rate increases or the query cache is
sized up, the flash pile frequency goes up, and eventually you
get ghost "max connections" messages in the server log. The
solution is counterintuitive - increasing max connections won't
help, increasing the query cache size would make it worse.
Disabling the query cache will improve the situation by removing
the cause for the lock and the lock itself.

A similar thing happens on the upside of 11k QPS with the innodb
Adaptive Hash index (AHI) for similar reasons on older versions
of MySQL. Disabling the AHI (or upgrading to a non-broken
version of MySQL) would help here.
