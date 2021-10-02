---
layout: post
title:  'MySQL: Our MySQL in 2010, a hiring interview question'
author-id: isotopp
feature-img: assets/img/background/rijksmuseum.jpg
date: 2021-09-27 18:52:55 +0200
tags:
- lang_en
- mysql
- mysqldev
---

I ranted about hiring interviews, and the canned questions that people have to answer.
One of the interviews we do is a systems design interview, where we want to see how (senior) people use components and patterns to design a system for reliability and scaleout.

A sample question (based on [a Twitter thread](https://twitter.com/isotopp/status/1442443978985586691) in German):

> It is 2010, and the company has a database structure where a fixed number front end machines form a cell.
> Reads and writes are already split:
> Writes go to the primary of a replication tree, and are being replicated to the read instance of the database in each cell.
> Reads go to the database instance that is a fixed part of the cell.

![](/uploads/2021/09/mysql-2010-1.jpg)

*Read and write handles are split in the application. Clients write to a primary MySQL database, which then replicates to a database instance that is fixed part of a cell. Clients from a cell read from this fixed replica.*

Unfortunately, this is not very effective:
The data center has 10 cells, but when a cell overloads its database, spare capacity from other cells cannot be utilized.
Also, the data center is not redundant.

We want to:

1. Load balance database queries.
2. Extend the architecture to more than a single data center (or AZ).
3. Optionally be resilient against the loss of individual databases or a full AZ.

Possible topics or annotations from a candidate:

- What kind of strategies are available for load balancing database connections?
  - DNS, Anycast or L2 techniques
  - Proxy (but not a web proxy)
  - Zookeeper or another consensus system with modified clients
- What are the advantages or disadvantages of this?
  - L2. Huh. Don't do that.
  - DNS updates are slow and complicated. It can be made to work, but you will always have very little control over what is balanced why and how. DNS is better used for a global load balancing of http requests, and not as a database load balancer.
  - Zookeeper could be used to do this with modified clients, but we would have to discuss how exactly that works. That's an interesting subquestion of its own.
  - MySQL Router or ProxySQL are made for that, but have a lot of interesting subquestions of their own. See below.
- What else may be different when load balancing database connections instead of http? 
    - Webproxies are not good database proxies. The database protocol is not http, and it is a [stateful protocol]({% link _posts/2020-07-28-mysql-connection-scoped-state.md %}). This requires extra care when load balancing.
  - Database connections can be long lived. A load balancing action to a different client only ever happens on connect. If you disconnect and reconnect only every 100 web actions or so, it is possible for the system to rebalance slowly. On the other hand, if you are using TLS'ed connections, connection setup cost can be high, so longer lived connections amortize better.
  - Database connections have a highly variable result set size. A single select may return a single value of a single row, or an entire 35 TB table. If the proxy tries to be too intelligent and does things with the result as it passes through, it can die from out of memory.
  - Proxies can become bottlenecks. Imagine 50 frontends talking to 10 databases via a single proxy on a typical 2010-box with a single (or two) 1 GBit/s network interface, and results contain BLOBs.
- What else there is to know?
  - Replication scales only reads. As this is a shared nothing architecture, each instance eventually sees all writes. To scale writes, we have to split or shard the database. That is out of scope for this question.
  - In our specific scenario, the number of writes is not actually a problem. We can assume a few hundred writes per second.
- Can we extend that to more than one AZ?
  - Yes, we can create an intermediate primary in each AZ, which takes the writes from the origin AZ into each sub-AZ. It then fans out to the local replicas. This saves on long distance data transfer. It also creates mildly interesting problems for measuring replication delay. 
  - Because the replication tree is deeper, writes take longer to reach the leaves. Most applications should be able to accomodate that.
  - The alternative would be something with full Two-Phase-Commit, but that would be even slower, and would have scaling limits in the number of systems that participate in the 2PC.

This is usually how far we get in a single interview session, and only with touching only on some of these points.
To find all is completely unrealistic, even for experienced people.
We would now reach a point where we discuss failure scenarios.

But it would be highly unusual to get this far, and that is not actually the goal in an interview.
I do in fact hardly care about the solution we end up with.
My goal is to have a useful discussion about databases, scaleout and resiliency, and about stateful systems and their limits.
When there are remarks such as "Our environment is smaller, but for us ... works" or "We tried this: ... but observed that often ..." that's actual gold in an interview.

Even things such as "In HTTP one would do ... but I can imagine that with stateful systems that does not work because ..." is already gold, because it shows a level of reflection and insight that is rare.

The objective is not to reinvent our 2021 setup. The objective is to use this clearly limited setup as a base for a common conversation about database probems.

"Database Reliability Engineer" is the hardest position to hire for in my environment, because it is an [H-shaped qualification](https://clausraasted.medium.com/t-shaped-consultants-are-great-but-heres-why-you-should-consider-being-h-shaped-instead-72fadf097da9)

> The concept of H-shaped people is a metaphor used in job recruitment to describe the abilities of individuals in (or outside) the workforce. The vertical bars on the letter H represent the depth of related skills and expertise in a single field or discipline, whereas the horizontal bar is the ability to combine those two disciplines to create value in a way that was hitherto unknown.

The objective is to find a person that "Understands MySQL" and "Understands Python or Go" ("Understands any database" and "Understands a useful programming language"), so that I can throw them at our existing codebase and have them useful within 3-6 months - ugh.

If I can find one person per year, I am very lucky.
