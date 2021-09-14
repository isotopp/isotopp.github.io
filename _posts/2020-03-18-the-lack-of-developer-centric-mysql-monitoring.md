---
layout: post
title:  'The lack of developer centric MySQL monitoring - a rant'
author-id: isotopp
feature-img: assets/img/background/mysql.jpg
date: 2020-03-18 11:24:09 +0100
tags:
- lang_en
- mysql
- monitoring
---
So where I work we have a large number of MySQL instances. They are organized in a slightly smaller number of replication hierarchies, which tend to cross region boundaries.

## Structure of a large database setup

![](/uploads/2020/03/mysql-replication-pools.png)

*A rough sketch of the setup we have. Variants of this exist in various sizes - from 6 replicas in 3 regions to hundreds of replicas per region, with Group Replication at the top and per Region Intermedia Master.*

Unfortunately, a number of these hierarchies are still shared databases. That means  multiple application users share access to data in different tables or even the same table concurrently - it's not proper services all the way, yet. We try to isolate workloads by putting replicas into pools by application, but of course all writes go to the top of the replication tree, the master, where they will happily interfere with each other.

The per-region application cluster instances then connects to their pool instance per region for reads, and direct all writes to the global chain master, from where they trickle down by the means and wonder of replication.

None of this is static: All databases in a rolling reinstall with a two month period to keep them patched, and [MySQL Orchestrator](https://github.com/openark/orchestrator) is being used to keep the replication hierarchy alive and connected in the face of master switchovers and failovers.

Pool membership is kept in Zookeeper, and MySQL client libraries have been wrapped and modified to pick a random local pool member for reads, and to find the master using this mechanism or anycast DNS.

For the application developer this means they do not care much about database server names, or individual database servers. Database servers are being maintained by the DBA team and their automation, so general health is good and for an application developer most server settings are not interesting and also not actionable.

They are interested into general server metrics that indicate overall workload health, and they are interested into aggregate query performance - the aggregate being over a region pool or the global aggregate of all their pools.

## Monitoring a large database setup

We collect metrics on all servers, and push them into a thing that is [no longer graphite](https://archive.fosdem.org/2017/schedule/event/graphite_at_scale/). It is still using the Graphite APIs, but all components have been replaced with things written in C or Go. There is no Python code left.

The data we collect is circa any conceivable server metric, and using our version of Not-Actually-Graphite this means we can aggregate per region-pool, or per global pool. We see per-user query latency of a pool, individually per server, or aggregated per pool, the Median (P50) or the P99 or anything else interesting. We also, from the application clusters, collect some aggregate metrics like queries-per-route or query latency for a server as seen by the cluster.

This is sufficient to give us a general impression of query health: If we actually had bad queries, we would see the latencies suffer - first the P99, then the lower P's.

![](/uploads/2020/03/mysql-replication-bimodal.png)

*An example bimodal distribition as per [Wikipedia: Multimodal Distribution](https://en.wikipedia.org/wiki/Multimodal_distribution#Mixture_of_two_normal_distributions). A bimodal distribution of query latencies can happen if you have fast queries with a normal distribution of execution times at the lower end, and a smaller hump of slow queries with higher execution times added to this. Not looking at the full histogram, the slow queries will first affect the P99, and then successively the lower P's until they affect the Median (P50).*

Our usual failure mode is not often actual bad queries, although it happens and it is useful to have tooling to gain insight. The much more common failure mode is [ORM](https://en.wikipedia.org/wiki/Object-relational_mapping) breakdown and the resulting machine gunning.

In our specific case, the ORM has for each object a list of essential columns and a list of all columns. Code is being written to load objects from the database into the application in single, rather efficient queries. Something like 

```perl
@products = $bp->search(some query from a condition builder)->fetch();
foreach $product (@products) {
  do_a_thing($product);
}
```

This will fire a single query for products and then build an array of products in which all the essential columns are loaded as attributes. If you happen to access a non-essential attribute, the `id` of the object is used to lazy-load the missing attributes at once and completely fleshen the object.

This is a painful feature and leads to a series of individual object retrievals for non-essential data, and because of the way access to non-essential attributes is wrapped and hidden, it usually happens in a way that is transparent (read: magical) to the developer. Or in other words, the developer is not even aware of the fact that they are machine-gunning the server with many trivial, small SQL statements.

Similar things happen in other environments with `has_a` and `has_many` relationship of linked object hierarchies, where traversal of a link can trigger similar machine gun cascades transparently and without awareness for the developer.

Another common problem that we see quite often is write-spikes and locating their origin. We have self-cooked solutions that either parse the output of the `mysqlbinlog` command, or [login as a fake MySQL replica](https://github.com/mysql-time-machine/replicator) and read and analyze the binlog.

But while they can do things with data that is present in the binlog, a lot of information is not present there - among them user and actual source of the commands. It would need an audit plugin in the server to collect and emit such data and correctly attribute it.

## Database Monitoring Solutions and their shortcomings

Looking at a number of database monitoring solutions, I see a lot of good stuff - metric collection, query collection per server, query analysis and insight, and alerting.

Scaling is usually a problem, at least for the target size I need to build for, but that is to be expected. There is not much of a market at the size I need, and any sane product management would target the much larger set of installations that are 100x smaller than the one I care about. So I do not expect these products to work for my needs, but I expect a scaling story ("You can split our all-in-one container into individual metrics gathering, persistance and analysis components and you can shard the metrics gathering and persistence components, and run a cluster of analyzers to scale and here is how to unpack our stuff.").

Cloud-only is often a problem, because my data and my queries are in the majority in SOX, PCI, and PII/GDPR regulated scopes, which means that any test that works with non-synthetic data has is legally as complicated as actual production. That would even be true if my own databases weren't on-prem, but in a cloud. "On-premises" solutions (solutions that I install within my own administrative domain, even if that domain resides in a public cloud) are much easier to test.

Developer-centrism and proper workload aggregation is a large deficit. None of the solutions I looked at understands a large scale setup as layed out above. All focus on a single server, and mix operational and developer aspects of conditions on that single server.

That means, while there may be ways to translate regions and pools into tags by the way of an API, and there may be ways to inform the monitor of fluctuating topologies by the means of the same API or auto-discovery, the actual analysis is usually done per-server and not per-taggroup.

As a developer, I am never intested into server properties that are not actionable for me because they require a DBA. Disk space alerts, presumably wrongly set server parameters and similar conditions are not my primary interest.

As a developer, I am never intested into a single server. I am interested into the performance of all queries that go through my rw-handle to the master, and into the aggregated performance of all queries that go through my ro-handle to any of the replicas in my current replica set.

The pool I may be using for my ro-handles may also be used by other applications, so as a developer the tooling should be able to handle multi-tenancy and only show my queries that have been issued using my application login and hide all query data that has been issued under other accounts. This is not just a usability issue, other peoples queries may contain information that I am not allowed to see under PII, PCI or SOX rules.

Current MySQL query analyzers and monitoring tools are - understandably - focusing on the SMB market with no or low DBA support and certainly no DB-SRE support. They focus on individual servers, and do not aggregate workloads along user logins or handle-pool distributions. They mix up alerts for operational DBAs and problems that interest developers, and consequently a lot of information presented is not actually actionable for developers. Nothing I have seen supports multi-tenancy and isolates query-data from different application logins from each other in shared pools.

Nobody has an audit plugin or does binlog analysis for write statistics properly ("show me busy tables and write spikes, and the sources of these in terms of application host name:application port that sent these writes, or user login that executed these writes"). A lot of tools still read and analyse the slow log and their examples in demos focus on this as if it is still 2014, instead of eating, parsing and working with P_S.

All in all I get the impression that the developer support tooling around MySQL is 2-4 years behind my expectations.

Read spikes and machine gunning are very hard to detect on the server side, and we probably should consider instrumenting the ORM to record the number of lazy-loading events and warn on excessive lazy loading.