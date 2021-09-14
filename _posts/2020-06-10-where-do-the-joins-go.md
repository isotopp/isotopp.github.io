---
layout: post
title:  'Where do the JOINs go?'
author-id: isotopp
feature-img: assets/img/background/rijksmuseum.jpg
date: 2020-06-10 21:38:32 +0200
tags:
- lang_en
- database
- development
---
I was asking on Twitter:

[![](/uploads/2020/06/joins.png)](https://twitter.com/isotopp/status/1270746627339358208)

*Are you a Developer and understand (Micro-) Services? I am a database person and a bit simple, and I have a genuine Question:*

*When moving to a services architecture, where do the JOINs go?*

I gave the following context:

****
![](/uploads/2020/06/shop-schema.png)

*A simple shop*

So you sell stuff, that is, you have an `orders` table `o` with an `oid`, which stores a customer id `cid` from a `customers` `c` table, and an article id `aid`, from an articles table `a` and a count `cnt`.

```sql
-- customer 17 ordered 3 45's
? SELECT o.cnt, a.aid
>   FROM o JOIN c ON o.cid = o.cid
>          JOIN a ON o.aid = a.aid
>  WHERE c.cid = 17

= 3 45
```

When moving to services because you are a multibillion dollar enterprise, your customers, orders and articles can no longer fit into a single database, and there are other reasons to have an OrderService, CustomerService and ArticleService. You still want to ask something (OrderService?) about the number of 45's that 17 ordered.

Who do you ask? What does this do to connect the dots? How do you do reporting ("Show me all top 10 articles by country, zipcode digit 1 by week over the last 52 weeks")?

So you reimplement join algorithms by hand in application code? Are there supporting tools? Do you reimplement data warehousing aggregations, too? If so, what tooling for reporting does exist, and how does that compare to eg existing tooling for data warehousing?

****

I got… lots of answers, but now have even more questions.

I was pointed to read up on "[Self Contained Systems](http://scs-architecture.org/)" and on "[Designing Data-Intensive Applications](https://dataintensive.net/)". I was pointed at [Presto](https://twitter.com/AdinChelloveck/status/1270747363133526019) and that is awesome and completely insane at the same time.

A 10.000 meter summary was given by [Moritz Lenz](https://twitter.com/nogoodnickleft/status/1270789660437098496):

> Usually they go into application code. You have to design the services to minimize the joins. Also, microservices often keep read-only copies of other data to minimize joins.
>
> For reporting, you could have a big analytics DB that does the joins.
>
> In your example, the order service might copy some details from the product service to know what's shipped, and the customer name + address. These copies are read-only, and stay with the order even if the shipping addresses changes in the main customer service.

This is actually what a proper order application in a traditional database would do as well:

The `order` table most likely would be an `orderlog` table, and we would record not only the aid (keep the link to the source article) and cid, but would make copies of the price at the time of sale, the time of sale timestamp, and the address at the time of sale or the actual shipping address. Entries in the orderlog would stay there until fulfillment and maybe payment, and then can go from the OLTP system. We would also immediately emit a copy of the data that goes to our data warehouse as part of some kind of ETL setup.

There are multiple good things about this, which is why we are doing it like this in relational systems as well:

- The OrderService can handle the order from all the data in the one single order event, because it contains all the relevant information for the most common purpose, fulfillment.
- This is most likely also all the information that we would put into the Event that feeds the data warehouse.

Doing things this way keeps the size of our OLTP system bounded (for the same number of customers, articles and active orders, over an infinite amount of time, the system does not grow). The data lifecycle in the OLTP system is complete and we do not accrete an infinite amount of data - Data Warehouses do grow infinitely unless you drop after x years, OLTP system must not grow infinitely and if they do, they do contain a small DWH that struggles to get out.

Anyway:

To map this onto a services design, we do ask the CustomerService and the ArticleService at the time of sale for the data necessary to make an order, and this is done by OrderService. These are two point lookups, and that is probably an okay thing to do manually at the application level. We also emit a pre-joined hierarchical structure equivalent to the orderlog entry (maybe some JSON?) onto an event bus ([maybe a Kafka?](https://twitter.com/rk3rn3r/status/1270813207922384896)) where it is consumed by other services.

These event stream consumers work as materialization engines: They do have state, and modify it whenever they consume a relevant event. For example, we could have a continous query running in some engine that builds the aggregation I asked about from a stream:

> Show me all top 10 articles by country, zipcode digit 1 by week over the last 52 weeks

This reads almost directly like an Influx query. So this is a thing that you can answer from a stream.

If you have questions that arise at a later point in time, things become complicated without an image, though, because you are missing the start value. So the only option would be to start back in time at the big bang, and replay the event log for that new query, or to cut off at some other point in time and not have older data where possible.

For aggregations over intervals like in the example query above that is entirely possible: We work over individual weeks, going back a year and we either have data for older weeks or not. If not, we can still accurately determine weekly aggregates for newer weeks, because they are independent of each other.

For absolutes, totals and other sequentially dependent values you need some kind of calibration, if you can't go back to the big bang - "how many 45's did we ever sell" or "how much did 17 ever buy" can only be answered accurately if you have all the logs and the time to replay them from scratch. This quickly [gets out of hand](https://twitter.com/AdinChelloveck/status/1270768529080496128).

And [there](https://twitter.com/isotopp/status/1270765952116891648) is the problem that I still see (or not quite understand wrt to CQRS):

> So if a service does not reign over a set of data, but it's supposedly the authoritative data source for a thing where multiple copies can exist - how do you validate?
>
> The authoritative source of the data is the event stream.

I will have to check out the linked talk. I think I get hung up because this is what databases do:

A database is a giant global persistent variable with a network interface. Datadir is full of schemas is full of tables is full of rows has multiple fields. We can stop all traffic to the database and make an image. That's a backup.

We make changes to the database using grouped data modification language: transactions. Transactions are recorded in the binlog. We record and keep the binlog, and also the backups (and the binlog position we took the backups at).

We can roll back to an earlier image, and then replay the binlog to move forward again in time at will, but this is bounded in time (and disk space) by the amount of binlog we keep. So if we store backups and binlogs for 7 days, we can go back 7 days and roll forward again.

In a MySQL database with row based replication, the actual row events are even idempotent. We record "set x = 10", not "x = x + 1". We still can't replay old binlogs over a newer image without constraints (this is a different discussion), but it does make things a lot more robust.

In fact, with RBR the actual row events with full row images are even reversible: we do not only get "set x = 10", we do get "set x from 9 to 10", and if the log were pure we could play it backwards and walk back in time step by step (this fails in reality in the general case, but again this is a different discussion).

So if you think of the database as a giant global variable that is modified in transactions, and as the binlog as a recording of these transactions in ideally reversible notation, then we can think of a services system as "that binlog on an event bus", and as each of these services as a thing that builds materialized views (projections) of fragments of the total database and the total globalized state is gone, because it has become too big to maintain (We will see about that in a second).

But: You cannot realistically keep the log an indefinite amount of time. And even if you did, you cannot replay it from the Big Bang, because your recovery time would be unbounded. So there must be backups (images) associated with positions in the event stream, that allow individual services to reset and replay themselves. Or you demand that all questions are always sequentially independent and over fixed time windows so they can be starting up in the middle of an ongoing stream. Maybe that is even a reasonable restriction, it is in any case a useful classification for types of queries on a stream.

But there is also the problem of complicance/correctness/synchronisation: How do you show that for every event in your orderlog there is also an entry in the payment service that matches the order? Probably with some event reader that consumes both types of events, orders and payments. It would have to match one up with the other or alert if some order is being maintained as active for too long without finding a matching payment.

At some point in the evening I got into a chat with a colleague:

> L> You asked:
> [Where do the Joins go?](https://twitter.com/isotopp/status/1270746627339358208?s=21)
> To the JoinDataService, obviously. 
> Aka "Data Lake".
> aka The Data Monolith that secretly underpins all the service shit.

He's not wrong. The Hadoop in the end is the global state where all the events get joined together again and it produces a giant global image of the current and all past states. That is why the big data is big (and you can go back to the big bang, it just eats Megawatthours to do so.)

At some point I was like:

> K> I get the feeling that the answer is "we are looking at each event in a self-contained fashion. One event is one Transaction."
> So an order event is self-contained and does not need to refer to other orders or other facts.
> It contains all data necessary to fulfull the order. It also means "Fuck you, reporting."
> And that is where your data lake comes in.
>
> L> I wasn’t kidding.
>
> K> "Why is it called data lake?" "Because this is where we drown our problems in hardware and petabytes"
> Unfortunately, book keeping is stateful and cannot look at individual orders, it is all about aggregation.
> I also get the feeling that is where the blockchain bros come in.
> "by turning your event stream into a sequence of chained and signed blocks you get guarantees of losslessness"
>
> L> Blockchain == storage.
>
> K> Ok, that's a Merkle tree then, it needs a wasteful PoW to become a real blockchain. And we have plenty of successful Merkle Trees, git, zfs and so on, just zero successful Blockchains, so it is useful to make this distinction.
>…
> 
> L> There will always be two things: state and changes to state.
> Unless every change contains the entire previous state, or changes are distributed guaranteed, there is risk of diversion.
> 
> K> So this is also a question I have about Blockch... Merkle trees. You can spot holes. How do you heal them?
>
> L> Perhaps every change could contain hash of previous state, but that only helps detect diversion, not solve it.
>
> K> Yes, that is the merkle tree thing. Well, it is tree-dimensional and time-dimensional. you have the data structure itself, checksummed, and you have the stream of changes, also checksummed.
>
> L> Now. The obvious solution is detect then replay. But this poses two new problems. 1) what state do we trust enough to start from. 2) where do we replay changes from.
>
> K> In blockchains this is a voting problem. In git and the Linux kernel, this is literally Linus day job.
>…
> L> Right. Snapshot and replay from there. Like I said.
>
> K> Yes. I do believe it does not get more complicated than mysql binlogs and binlog positions, but with JSON as a REST service.
