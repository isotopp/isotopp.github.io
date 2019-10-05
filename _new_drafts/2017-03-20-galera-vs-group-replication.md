---
layout: post
status: publish
published: true
title: Galera vs. Group Replication
author: isotopp
author_login: kris
author_email: kristian.koehntopp@gmail.com
wordpress_id: 1221
wordpress_url: http://blog.koehntopp.info/?p=1221
date: '2017-03-20 21:44:33 +0100'
date_gmt: '2017-03-20 20:44:33 +0100'
categories:
- MySQL
tags: []
---
<p>[caption id="attachment\_1222" align="alignleft" width="150"][![](http://blog.koehntopp.info/wp-content/uploads/2017/03/MySQL-High-Availability-Solutions-6-e1487968755582-150x150.png)](https://www.percona.com/blog/2017/02/24/battle-for-synchronous-replication-in-mysql-galera-vs-group-replication/) [Percona: Galera ./. Group Replication](https://www.percona.com/blog/2017/02/24/battle-for-synchronous-replication-in-mysql-galera-vs-group-replication/)[/caption] A [blog post over at Percona](https://www.percona.com/blog/2017/02/24/battle-for-synchronous-replication-in-mysql-galera-vs-group-replication/) discusses better replication for MySQL and compares Galera and MySQL Group Replication. Galera builds their own initial state transfer&nbsp;mechanism and their own transaction distribution mechanism, independently of MySQL replication (write set replication wsrep). wsrep is synchronous - on commit, the write set is shipped, applied and acknowledged (or not). MySQL Group Replication strives to achive the same thing, but uses their own, "MySQL native" set of technologies to do this.<!--more--> The Galera cluster accepts writes to multiple cluster nodes concurrently, and will apply them successfully as long as the primary keys in the write sets (transactions) concurrently being applied within the cluster do not overlap. If there are collisions, they will make one of the colliding write sets fail, and cause a rollback of the transaction. Galera does not propagate locks, though, only writes. Which means that it [can not isolate properly](https://aphyr.com/posts/327-call-me-maybe-mariadb-galera-cluster), by construction, and that transactions of the form</p>
<p>    BEGIN SELECT id FROM t WHERE id = ? FOR UPDATE UPDATE t SET d = ? where id = ? COMMIT {% endhighlight %} can't work, because the X-Lock set by the SELECT FOR UPDATE statement goes nowhere in the cluster. Most users of Galera do not, by default, write to multiple nodes, but a single cluster node. There may be concurrent updates during a failover situation. This use of Galera avoids many of the problems with missing lock propagation, and the concurrency issues that could come from frequently overlapping write sets on multiple masters. MySQL Group Replication is constructed quite similarly, and has similar deployment properties, even if the implementation is independent and different. If you are using either Galera or MySQL Group Replication as a mechanism to migrate from a single Master as a SPOF to a more resilient setup, this may work, but has it's own issues during failover, and in normal operation, too. Especially if there are transactions with a more complicated lock structure and concurrent distributed writes involved - both products will fail reliably in such a scenario, so you need to validate the workload to be matching the capabilties of the cluster chosen.</p>
