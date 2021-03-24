---
layout: post
title:  "That's a lot of databases"
author-id: isotopp
feature-img: assets/img/background/mysql.jpg
date: 2021-03-24 12:22:33 +0100
tags:
- lang_en
- mysql
---

Where I work, we are using MySQL a lot. The databases are being organized in replication hierarchies, and each hierarchy is a tree topology with a single primary and a number of intermediate replicas.

## Replication is a tree managed by Orchestrator

We are using MySQL orchestrator to manage the replication topology.

![](/uploads/2021/03/mysql-many-01.jpg)

*MySQL Orchestrator shows a typical replication hierarchy. Each color indicates a different data center/availability zone. Replication is a tree, from the primary to per-AZ intermediate replicas for fan-out to leaf replicas. Clients connect to the primary for writing, and to the leaf replicas for reading. Special instances exist as clone sources and backup instances.*

The diagram above is the view presented by [MySQL Orchestrator](https://github.com/openark/orchestrator) of a single replication hierarchy. Servers are arranged in a tree-shaped hierarchy. All writes go to the Primary at the tree root, which then replicates to intermediary replicas. These fan out to leaf replicas. Clients write to the Primary, and read from the leaf replicas.

Special instances exist that are being used as clone sources for new replicas, to make backups and for other internal purposes (such as replication catchup benchmarks, for example).

Different colors indicate different data centers or availability zones.

## Clients find servers in Zookeeper

Leaf replicas (and the Primary) register themselves with a Zookeeper when they are ready to serve traffic. The Zookeeper organizes replicas in the same availability zone in a pool, and offers that pool to clients.

Clients subscribe to pool changes in the Zookeeper. On change, they get notified and [atomically]({% link _posts/2018-11-29-but-is-it-atomic.md %}) dump the pool to a file on disk. That way, when Zookeeper is unavailable due to Zk internal voting or realignment, the clients still have a roster of endpoints to choose from. Also, they do not have to ask the Zk on each connect, only on each change.

Some replication hierarchies see use from multiple applications: They are not single tenant, but multiple applications from different teams use the database as a shared data source, and as a way to communicate. That is, because historically there was only a single application, and a single schema, and then we grew and split things off.

In order to separate possibly interfering workloads from each other, such hierarchies have multiple pools for leaf replicas - one for each application. So there may be an 'xml-misc' hierarchy (which would be the default pool), but also an 'xml-mobile', or an 'xml-slow'. The latter would contain a number of sacrificial hosts to run queries on that cannot be optimized - that way they would interfere with each other, but not with the rest of the workload.

In any case, each leaf replica is always a member of at most one of these pools (it may not be in any pool, if it is a special purpose replica).

Pool name and AZ translate into a Zk path, and into a roster file on disk. Clients request a database handle by pool name, and end up with a connection to a random endpoint in the pool. Connections are direct, so in the MySQL processlist we can see the client host name and port as well as the application user name, which makes a lot of operational things much simpler.

Zk can also be used to find Primaries, and applications that are Zk aware benefit from that, because Zk updates are close to instantaneous. We also need to provide Primary hostnames via DNS, because there is always the odd shell script or non-Zk aware script in a snowflake language that does not understand pools. At least we do not have to manually split writes and reads from a single database handle, as if it's 2001.

## Dynamic database architecture

Some replication hierarchies can get pretty large.

![](/uploads/2021/03/mysql-many-02.jpg)

*The oldest and largest replication hierarchy as seen in Orchestrator. It is more than 20 years old, and started as a schema on Postgres. But because Postgres could not replicate at all back then the company migrated to MySQL and grew on MySQL replication.*

Originally, the company ran on Postgres, over 20 years ago. Back then Postgres could not reliably scale anyway, so the company migrated their stuff to MySQL and grew on MySQL replication. As you can see from the colors, this particular hierarchy spans three AZ. The blue bubbles in the leaf nodes indicate number of leaf replicas in the (compressed) tree view.

The segmentation of this particular replication hierarchy into pools is not visible within Orchestrator, only by dumping Zk.

We use MySQL in a [memory saturated]({% link _posts/2021-03-12-memory-saturated-mysql.md %}) setup where possible. As a result there is no additional caching layer between the database and the application – MySQL can use memory and serve results just as fast as Memcache, when you ask it Memcache complexity questions. The boundary between Memcache level queries and true SQL is pretty fluid that way, and you do not have to deal with cache invalidation, cache representation issues and many other things that get in the way. Also, unlike a traditional caching layer, MySQL has a restart and warmup concept, so this operational aspect is also taken care of.

Instances currently have a livetime of at most 60 days, and we are targeting a recycle time of less than 30 days. Also, the actual number of instances varies depending on the outcome of automated load tests in production and the traffic prediction. That leads to a pretty dynamic environment, but that is easily taken care of by the Zk based discovery, the replication tree management done with Orchestrator and the automated provisioning.

## From auto-provisioned Bare Metal…

All of that is extremely old fashioned bare metal stuff. Currently databases run on HP or Dell blades, the smallest pieces of hardware one can reasonably buy: Dual-Silver 4110 machines (16 C/32 HT) with 96 or 128 GB of memory and one or two NVME SSD with 1.92 TB of storage each. We do not use RAID, we have replicas for redundancy.

In terms of RDS instances, these would map to db.m5.5xl, if these existed, I believe. Look up the list price of a db.m5.4xl, and compare. I believe we are at around 1/20th the cost of a hypothetical db.m5.5xl, and that is with pretty inefficient baremetal.

Bare metal with local storage is, if autoprovisioned, a wonderful thing – there is perfect workload isolation and no crosstalk, no jitter. Performance is extremely predictable, and the only adversary you are ever going to meet when debugging performance problems is yourself.

Having autoprovisoned bare metal is a large hurdle, though. There are two teams that have over time provided a bunch of software called ServerDB with many subcomponents related to talking to [BMCs](https://github.com/bmc-toolbox/bmcbutler), [enumerating machine components](https://github.com/bmc-toolbox/dora) and [managing firmware](https://github.com/bmc-toolbox/bmcfwupd). There is another team writing a thing called Nemo, which does the same for network equipment. There is the PowerDNS API, and there is a whole collection of storage APIs to talk to, in order to provision local or remote storage.

The end result is a command line tool that makes you new databases, one individual copy, or two hundred instances, it almost does not matter.

## … to something else.

Unfortunately this does no longer scale. New machinery is so powerful that even the tiniest pieces of hardware are too large for our medium sized databases.

There are outliers: I have seen instances that run on [actual storage servers](https://www.slideshare.net/Storage-Forum/operation-unthinkable-software-defined-storage-bookingcom-peter-buschman#14), but admittedly this particular team is holding it wrong and should rethink the way they are using databases, because an instance with 120 TB local NVME and a single 35 TB table is not a thing that helps with automation at all.

Normal customers would benefit from running databases in virtual machines that are slices of much larger servers, and that are no larger than, say, 1/4 of the actual hardware, in order to be not overly hard on the packing algorithms of the scheduler.

But even when running on virtual hardware, predictive autoscaling and long lived instances are a must. Data size matters, and so do optimizations, because lugging around Terabyte sized blocks of data is still carrying a certain operational weight, even in 2021.

The worst case example would be the very large hierarchy shown above. It has a data directory of 850 GB, plus binlog files, so around one Terabyte of clone work to get up and running. At 400 MB/s instantiation speed, making one instance of these takes not under 45 minutes, and more likely around one hour.

Assume that you lose one data center branch worth of these (say, the green section in the image above), you would have to reclone that. You would be looking at 100-200 clone operations. Concurrently at 400 MB/s, that's 100 concurrent clones at 400 MB/s, or 40 GB/s. That translates into 400 GBit/s aggregate bandwidth, and that's not happening with a single clone source, and not happening at all unless your network [is built for this](https://www.packetflow.co.uk/the-history-of-spine-and-leaf-architectures/).

So you are looking at a staged rollout with work queues and some orchestration. Plan a multiple day setup time for a thing of that size. And when finished, it starts catching up with replication before it can be useful in production.

## What I have, and what I am looking for

At this point in time there is a single Python command `dba` with subcommands, which talks to all the backend APIs to handle things. It grew out of a collection of shell scripts that did things to a single machine to make DBA life easier, and it still is mostly a local command line application (headless Django). It also is not exposing an API, and cannot be used by other people than DBAs.

Of course, the number of replication hierarchies does not shrink.

![](/uploads/2021/03/mysql-many-03.jpg)

*MySQL Orchestrator Replication Overview screen. Each card is a replication hierarchy with a number of instances organized in one of the trees shown above.*

So imagine a thing not unlike a K8s controller, exposing an API, storing a desired state for the entire system of hierarchies and instances, and running a reconciliation loop. But it is not talking to a single K8s cluster, but to a number of backend APis, which may be bare metal hardware, Openstack, EC2, RDS, or K8s.

It understands MySQL and knows things about the application, like a K8s operator. So it knows *This is MySQL* and *This is how we run MySQL around here.* It would understand things like Ownership and Tenancy ("This team can make API calls affecting these chains.") and it would not only understand operational things ("Make an instance.", "Make a datadir", "Connect Replication."), but also things like Grant Management, Backup and Restore Testing, Production Capacity Testing, Replication Catchup Speed testing and Monitoring, Query Workload subsampling and Alerting.

I would need to be able to describe a "replication chain" made from "instances" in various "backend services". Each backend service would need a "bootstrap procedure" to establish initial presence, and from there clone out instances. Instances then would need to integrate into the chain, catch up, warm caches, register in Zk, and become operational.

Capacity testing and a predictive scale goal would define the number of instances per backend, so that we are ready for the coming days load, with some margin for failure and Murphy. Backups probably can be made per chain, and not per backend, assuming the bootstrapping works and is tested.

I would need probably the provisioning/deployment/upgrade and cycling as a procedure per backend, and they likely can be one: MySQL identity is defined by its datadir, and as long as I can keep volumes of datadirs alive independently of the actual database base instance, I should be able to pre-provision fresh instances, detach the volume from an old instance and reattach it to the new instance within a very short time.

That would allow me to meet a 30d instance age limit easily. I would also be able to move to newer versions of MySQL at will, and even downgrade within datadir binary compatibility limits. Upgrade orchestration is a thing: One has to put newer versions at the leaf nodes, and the gradually move upwards in the replication tree.

## "as a Service"

Understanding a product is not a thing you can do as the developer and vendor of a product. You can only do it as a products user, because only then you understand the needs.

A good vendor is running the product itself – that is the one thing that makes me very excited about Oracle MySQL running MySQL in their own cloud. Finally they are running their own product in a production environment and maybe realize all the fiddly things, wrong defaults, useless tuning knobs and operational complications, and all the places where the product is simply missing code. Things like the [`CLONE` command](https://dev.mysql.com/doc/refman/8.0/en/clone-plugin-remote.html) should (and could!) have happened a decade ago.

Running a product as a user makes you understand the needs… of your organisation. There may be others. A good vendor collects these views, and merges them with their own experience, and then writes The Book™ on the product.

The Book™ on MySQL currently is a number of half-assed "MySQL as a service" implementations.

There is Amazon RDS, which is doing things like it's 2010 – active/passive primary switchover with DRBD, and asynchronous replication for scaleout, limited to a very small number of managed instances, and a rather static hierarchy, without a clear discovery concept. It does interesting things with Grants, Defaults, and a number of other things, and is arguably the most complete service.

There is a bunch of K8s operators for MySQL, but I consider most of them toys for a multitude of reasons. A K8s operator is a pod that is running a binary that controlls deployments of (persistent) services in K8s, managing instances, data directories (persistent volumes), but all within a single K8s cluster. Of course, that's not resilient and it's also not how you set up MySQL for production – spanning cluster and AZ boundaries is a must.

Each operator also implements one specific way of running MySQL ("Group Replication!", "No, traditioanl asynch replication!") and so on, with very little in the way of policy tuning knobs. So when you look at K8s operators, you are really looking at source code templates to fork and implement your own from that. Not helpful.

What is missing? Endpoint Discovery, Grant Management and a number of other things are also a must, with K8s even more so than with AWS, because it's more dynamic.

On top of that, there is all the work that needs to be done for Predictive Scaling, Replication Speed monitoring, Query Monitoring and so on. A lot of that is not well thought out at all, and needs not just engineering, but in part even research.

## Tracing integration

For example, Oracle MySQL provides splendid instrumentation for performance monitoring, but getting this stuff out of MySQL is ten to twelve queries (all of which will affect monitoring, too).

Tracing Microservices is currently converging on a model where you provide a set of three IDs (root id, parent id and request id) and a subsampling mechanism. When a request is born, it is assigned a root id at the load balancer, and as it is propagated on it carries forward the root id, and the id of the immediate parent in the call tree between services, assigning itself its own unique ID.

Not all requests are being traced, because that would be unwieldy. Instead a certain percentage subset is assigned to tracing. If this would be random, we would get a large number of requests that are sampled only in one subsystem, but not in another, leading to very few requests that are being traced front to back, so you would also need a way to forward the tracing attribute through the hierarchy. That way you get a subset (say, 1%) of all requests that are being traced everywhere.

Using the root id, you can very quickly select all requests related to one workload, and using the parent id - request id relationship you can arrange them into a call tree.

It would be really useful for MySQL to have a mechanism that triggers query execution tracing. When a query execution is traced, the assigned ids are carried forward, and at the end of the request the ids, the actual execution plan and all the data accumulated for performance schema associated with this query execution is being dumped into a single, configureable structure. This data cen then be handled in a plugin, which then can do with the data whatever is needful.

In my case, most likely offload it to a coprocess running on the same host, using UDP. The coprocess would then push this into Honeycomb or another tracing service. That would allow me to see a request, the services that the request touched and all the SQL execution associated with it in a single view. I would be able to see the service that generated the SQL, the generated SQL and its execution trace right here next to each other in the same view, instead of using Grafana, Kibana, gitlab and Vividcortex and trying to align the spike here with the log there and the source over there.

## Instance sizing

In clouds, private and public, cost is suddenly an issue. The cost of RDS instances is, compared the to current bare metal, ridiculously high, and moving stuff into a cloud environment will cramp our style considerably for cost reasons. 

Right sizing instances is a need that everybody should have, but for some reason for example working set sizes are not being discussed a lot. What Brendan Gregg did in general [WSS](http://www.brendangregg.com/wss.html) work is from six years ago and pretty orphaned. It needs a lot of work to be runnable on modern kernels and safely in production in an automated way.

MySQL itself, with all the performance schema instrumentation, provides no easy way to count the number of buffer pool pages touched in the large *x* seconds, or rather a buffer pool access trail analogous to blktace, so that could could bucketize that analogous to the [LBA access histograms]({% link _posts/2021-02-25-mysql-from-below.md %}).

I don't know why that is, but with all the cost pressure I'd have expected more prior art on this.

## Yelling at the cloud

![](/uploads/2021/03/mysql-many-04.png)

So, yes. The age of bare metal is coming to an end, even where I work. It has served us well for more than two decades. It did, because we have automation for these things – we started that when we had around 100 MySQL instances or so, and we were for a very short time running almost 100 times more than that before we started cleaning up to get cost under control.

Looking at what is available in "cloud" environments, I am still disappointed. The grunt work of provisioning is so much easier: One API to rule them all, instead of talking to see many different backends, many of then fidgety and unreliable. 

Still, there is little that looks like it actually has seen production at scale, and there are entire research subjects such as tracing integration and WSS estimation that are largely untouched. Dealing with replication at the level of a single cluster or backend also looks like a non-starter for actual production.

Then there is the entire topic of CD, Continous Deployment, and "gitops", which from where I sit looks like a good idea and also a ridiculously naive simplification at the same time.

I mean, Continous Integration and testing – sure. Gitlab pipelines, also yes. Deploying "stateless" code into production automatically for head? Sure, once you trust these pipelines.

But actual Ops?

So, yeah, you can terraform instances. That's just 2014's Openstack HEAT with more backends. But try to terraform a thing with state and you will quickly realize how that is complicated. 

It requires a state donor (a MySQL clone source, a backup of the old minecraft server you want to re-instantiate), probably coordination between the outside of the new instance (talking to the EC2 or Openstack) and the inside of several instances (the donor instance and the new instance, for example), coordinated catchup and warmup, and also a working endpoint discovery system. 

And if you do that at scale, `instances = 200` in terraform, may require some thought in how you provision, with queueing, concurrency limits and stuff, and you did not code that at all when you automated your stuff.

And that's not even Ops. That's Day 1 stuff.

Everyday life MySQL land is: Replication is delayed because somebody ran a sequence of `DELETE FROM t WHERE 1=1` at the primary and they are now filtering downstream to all the replicas, replication delay is 5h and rising before they complained to DBA.

The fix is "replication surgery": Stop the replica and restart with replication disabled, emulate the deletion with truncate or an empty table creation, create an empty transaction for the skipped `DELETE` with the skipped GTID, and reinstate normal replication.

Gitops that?

Everyday life in MySQL land is: Somebody oops'ed a table drop. Stop replication, locate a time delayed replica, fast forward it to before the oops'ed statement, stop it there, clone from this a new primary and a set of replicas, force feed it a modified replication stream for all the stuff that came after the oops'ed statement, and push this alternate history into production as a replacement for the oops'ed wreck.

Everyday life in MySQL land is: A group of replicas died after having a bit of replication delay. Investigation finds a long running query maintaining a read view (sic!), leading to undo log growth, which inexplicably slows down everything on these instances. The fix is to connect to the affected instances and manually `KILL` the threads that hold the long running read views. Not a thing to be done with a git commit.

So, yes, "continuous deployment" is a good idea, and I would like to see more of it. But before we are going to have *that* with stateful services, a number of hard problems need better solutions.

And "gitops" ain't gonna happen soon. We are going to see AIP operations ("ass-in-produxction") for quite some time, I am afraid.

And that is why I wear black and yell at the cloud.

(based on [a bit of Twitter](https://twitter.com/isotopp/status/1371866917472985095))
