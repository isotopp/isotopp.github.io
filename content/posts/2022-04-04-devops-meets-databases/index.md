---
author: isotopp
date: "2022-04-04T08:42:00Z"
feature-img: assets/img/background/mysql.jpg
title: "DevOps meets Databases"
tags:
- database
- mysql
- lang_en
aliases:
  - /2022/04/04/devops-meets-databases.html
---

On Twitter, [Samuel Nitsche](https://twitter.com/Der_Pesse/status/1510386289924837383) asked:

> Are there "IT history nerds" on this app? Like people who have the skills/knowledge to tell how some trends/evolutions in IT appeared? I'd love to connect!

Asking about what he wanted to know specifically he said, he's interested in the reasons why DevOps and Agile take up in DBA circles is so slow and low.
That forced me to brain dump stuff that has been active in the back of my mind for quite some time now, but which I never collected properly.

This is not yet a proper talk, but some kind of collection of material I wrote and some connecting thoughts.

# What is "DevOps"?

I had a talk on the German UNIX Users Group Spring Talks titled "Go Away, or I Will Replace You With a Very Little Shell Script" ("There is no such thing as a DevOps Team").
The slides are on [Slideshare](https://www.slideshare.net/isotopp/go-away-of-i-will-replace-you-with-a-little-shell-script-english), and I also have a [Blog article]({{< relref "2015-03-27-go-away-or-i-will-replace-you.md" >}}). 
The talk basically explains what happened in the 10 years after the Dotcom Boom, and how the adoption of "scale-out" instead of "scale-up" created the need for Sysadmins to pick up Developer tooling and some developer methods in order to deal with machinery in numbers. 

While the tooling largely aligned, the outlook on life did not -- developers are looking at new features, basically new best cases.
But operations people still are judged by resiliency, and how they are handling failures, so by new worst cases.
The gap in mindset between Developers and Operations is hard to bridge, but it can be done with a little trickery.
In any case, the traditional Sysadmin job died out.

Some people ask about the distinction between "DevOps vs. SRE", and there is very little.
To some, "SRE" is the Google employer branding for the "DevOps" profile.
Others make a vague distinction which riffs on the fact that "SRE" are people that care about worst cases, resiliency and fighting operational toil, and which also care about observability.
In my experience that is too subtle a distinction to hold up in a hiring interview, much less in day to day operations.

# DevOps and Databases

In regard to databases, this development did not happen at the same speed.
There is a number of reasons for it:

- There are usually very few databases compared to frontends, so the need to automate databases is much less pressing for most companies, with very few exceptions (Booking.com, Facebook and a few others).
Only when you have thousands of databases, or when you limit database instance lifetime for whatever reasons you need to properly automate databases.
- Databases are very stateful systems. 
In fact, dealing with state, with transactions and with persistence is their only purpose in life.
These things make proper database automation hard, and make most existing DevOps tooling unsuitable for the task.
So you'd have to be very specific about tool choice, or invent tooling from scratch. 
Also, existing DBaaS developments are outdated and way behind the time (AWS RDS, I am looking at you!).

## State everywhere

The most obvious exposure to state that developers have when dealing with databases is when seeing and handling database connections.
These are not https/TLS connections, and cannot be sent through regular https proxies such as Envoy.
Why is that?

Databases have a lot of [connection scoped state]({{< relref "2020-07-28-mysql-connection-scoped-state.md" >}}).
The most glaring example of state in a database connection is the transaction:
If you are in the middle of a transaction and lose the connection to the database, the open transaction is being rolled back.

Developers need to catch this problem, and go back to the beginning of the transaction, restarting it from the beginning.
So reconnecting to the database transparently and hiding the disconnect/reconnnect from the application is almost impossible.
Developers are hating the database for this, or ignore the problem, producing incorrect code.

Developers want a pony, and failing that, at least [a queue with exactly-once semantics]({{< relref "2021-01-28-database-as-a-queue.md" >}}).

They can have that, up to a point, but at a terrible cost of one transaction per state change.
It is a legal wish to have, if you can afford the cost, because it makes development easier and a lot more boring. 
But you need to track this as an absolute scaling limit, and be prepared to handle this as a tech debt item later on, in time.

You can, as a company, get away with "[boring technology](https://www.slideshare.net/isotopp/boring-dot-com-the-virtues-of-boring-technology)" for a very long time. 
That is good, because it simplifies developer life and allows them to move forward without much technical complexity to take into account.
Eventually you run out of runway, though, and need to take this on. 
That's usually a painful breakpoint in the company's growth journey. 
It also makes it very hard [to find database SRE people]({{< relref "2021-09-27-mysql-booking-2010-a-hiring-interview-question.md" >}}).

## Automating databases is hard, because of internode dependencies

Scaling out databases and automating their operation is a hard task. 

Not only are connections stateful, 
but things like SQL databases, consensus systems (such as Zk, etcd, Consul), and things that have consensus systems inside, are clusters. 
They cannot be handled by tooling that thinks of a deployment as a set of independent boxes without constraints between them.

So when you look at puppet, chef, terraform, "harness.io" or other things, they have no concept of a cluster, of a quorum, or of a replication hierarchy.
The point being: making changes to such a cluster creates an order to the updates, as they are applied.
Also, checkpoints are needed for the change to proceed, to make sure quorum is kept at all times.

For example, in a replication tree, updates need to be made to the leaf nodes, then their parents and so on, to make sure that a replica is always newer than its primary.

And updates to clusters with quorums can only be made while maintaining quorum.
So after each application of a change to a cluster node, the update orchestrator needs to check if the node it just worked on came back properly.
Only then it may proceed with the next node.
None of the tools mentioned above have any concept of such constraints, they are simply unfit to deal with databases that are not a SPOF.

Ansible can dig itself out of that hole by the sequential and slow nature of its processing and delegation, but is still unaware of the actual topology of constraints.
Only salt and k8s have concepts that can handle clusters or where you can implement what k8s calls an Operator.

## Automating database is slow, because data has weight

Working with databases is always slow, [because data has weight]({{< relref "2022-02-16-databases-how-large-is-too-large.md" >}}). At 400 MB/s, copying 1 TB takes 45 minutes, and replication catchup and cache warmup take another 15 minutes, so we can calculate and communicate "1 hour per 1 TB of data size".
Of course "reactive autoscaling" is never a thing for persistence systems.
All changes always need to be planned, and then take time.

## Automating databases is possible, but usually not done

[When you have automated databases]({{< relref "2021-03-24-a-lot-of-mysql.md" >}}) to a point where

- instances are made automatically,
- instances enter their replication hierarchies automatically,
- replication capacity and catchup speed is monitored and sized automatically,
- schema changes are handled automatically using Online Schema Change tooling,
- backups with restore tests are done automatically,
- primary key exhaustion is monitored,
- all instances are being remade cyclically within 60 days,
- instance discovery by applications is handled properly,
- secret managent including account and password rotation is automated

so that you can upgrade database versions automatically within 60 days or less across a fleet of thousands of database instances, then you are finished.

But that requires a unique approach to automation that is not available widely, even in 2022.
It is certainly not available in AWS RDS, which thinks about singular instances at the level of "create an instance and apply a configuration", with basic passive replication management tacked on as an afterthought (and expensive resiliency with DRBD).
It is ten years old technology, and that shows.

## Observability is lacking

Also, Devops usually requires good observability:
Stack upwards, in the general direction of the developer, and stack downwards, into the general direction of the hardware.
MySQL for example, has pretty good aggregate monitoring -- the Telegraf MySQL collector is splendid and rather complete for a general MySQL collector.

But the data collection for a singular query is underdeveloped, and gathering the data is slow and painful.
If you try to collect data about a single SQL query that just ran, [it takes 10-12 followup queries to P_S]({{< relref "2021-09-15-mysql-tracing-a-single-query-with-performanceschema.md" >}}) to extract data about what this particular query did.
And you still did not have the execution plan, or the number of actual pages read for this single query.

Conversely, while `blktrace` collects all kinds of data about the I/O a system sees, the open source tools to visualize this are underdeveloped.
It took a commercial company and a commercial tool ([Oakgate Workload Intelligence Analytics]({{< relref "2021-02-24-validating-storage.md" >}})) to provide tools to parse `blktrace` and paint useful images from it.

# Stateful is different, and the gap is far from closing

Of course, the YOLO stateless lets-quickly-make-another-instance mindset of DevOps cannot survive in Database Land.
Nobody in the DevOps crowd understands these things, and that in stateful systems errors and mistakes are not reversible. 
Mistakes are persistent: data that is gone, is gone forever.
And new instances take an hour per TB.

Nothing in the current DevOps propaganda takes any of this into account, hence Samuel's observation is correct.

On  the other side, there is little movement in DBA land. 
There is a very complacent DBA crowd, and there are extremely complacent companies.
Oracle for example never ran their own products at scale, at least MySQL as a company, and later as a division in Oracle, never did it at scale until recently.

So MySQL always had a bunch of wrong defaults, broken upgrade paths, insecure workflows and so on -- until Oracle Cloud was a thing.
Suddenly Oracle, at least Blue Oracle, had to actually run operations for their own stuff.
And that was good: the last 2 years have done more for MySQL Operational Simplicity than all the 20 years before.

On the DBA side: most DBA departments positioned themselves as "guardians of the data" and as choke points, like old sysadmins did before DevOps.
They also did not automate database operations properly ("as a service").
So there are few mature operational concepts for databases in the field, and even fewer codebases implementing them.
Mostly, I believe because there was never sufficient pressure.

There is also not a lot of tooling for developers.
If you look at MySQL blogs, for example the collection at [Planet MySQL](https://planet.mysql.com/), you will find that they often write about the database from an operational point of view ("How to configure mysql", "How to make a backup").

Only rarely, they write from a developer point of view ("How can I see my query performance through the ORM", "What is the right way to notice a rollback, and restart a transaction in my host language", "What is an efficient way to handle RMW-cycles in my host language").

There is a big divide between Developers as users of a database, DBAs, and vendors/bloggers/community advocates.
With this being the case, and not being acknowledged, there is little chance for development.
Pickup of new strategies, discussion about gaps in tooling and social innovation is slow in such an environment.
