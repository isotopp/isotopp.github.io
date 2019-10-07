---
layout: post
status: publish
published: true
title: Monitoring - the data you have and the data you want
author-id: isotopp
feature-img: assets/img/background/rijksmuseum.jpg
date: '2017-08-09 19:35:44 +0200'
tags:
- erklaerbaer
- monitoring
- data center
- lang_en
---
So you are running systems in production and you want to collect data from
your systems. You need to build a monitoring system. That won't work and it
won't scale. So please stop for a moment, and think. What kind of monitoring
do you want do build? I know at least three different types of monitoring
system, and they have very different objectives, and consequently designs.

## Three types of Monitoring Systems

The first and most important system you want to have is checking for
incidents. This **Type 1** monitoring is basically a **transactional
monitoring system**:

You want to monitor a production system and you need to know if things are
okay-ish. If not you want to get a notification about that. The notification
should be actionable, be acted on, acknowledged and then you are done. It
can be deleted, and it is important that it is deleted from _this_ system.

- You want this system to be highly available. Highly available systems are
  a lot easier to build if they are small, don't have many requirements and
  don't come with scaling overhead.Ideally, this thing is so small and
  self-contained that it can fit on a USB stick. In an incident, you can
  plug it into any machine and turn that into a monitoring host, gaining the
  necessary visibility that enables you to rebuild the entire data center
  from a complete outage.
- You want this system to be fast, the monitoring data to be fresh. Since
  this is the system that informs you that you are on fire right now, the
  time span between a thing actually happening and the point in time you
  know about this thing happening by the way of the monitoring system must
  be as small as possible.That is, you want the monitoring lag to be small,
  and to be visible so that people are aware of the fact that the view into
  a past state of the system.
- You want the system size to be stable. That is, for a fixed size of
  installations and a fixed set of metrics, as time goes by, the system size
  on disk or in memory should not grow out of bounds.Systems that grow over
  time without an upper limit have a data collection and retention inside.
  They are Type 1 systems with a Type 2 system on the inside. If you just
  wait, they will die from bloat.

 In database terms, you can think of the Type 1 monitoring as an OLTP or
transactional system: As an incident is detected, an alert is created, a
human is acting on the alert and eventually closing it, removing the cause.
As the alert is over, the transaction is done and can be purged from this
system. 

Because it's purged, the system size is finite and it does not grow out of
bounds due to log-keeping. There may be an ETL process that extracts
finished alerts, transforms them into another representation and loads them
into another system for record-keeping. Examples for Type 1 monitoring
systems are Nagios and other host checkers, most of which are broken from a
modern point of view, and [Prometheus](https://prometheus.io/) as a much
more modern and less broken implementation. 

A **Type 2** system is one that keeps records for a long time, it's 
**data warehousey**. These systems are not actually alerting, they are used to be
able to validate service level objectives ("Have we kept the promises we
made"), to identify recurring problems ("What's the most common kind of
problem we encounter across the entire fleet?"), and to do capacity planning
("Given past growth, when will we be running out of steam? What's the amount
of runway we have left?"). 

A data warehousey system can typically be down for two or three days.
Somebody will grumble, but a loss of availability is usually not immediately
catastrophic. Also, these systems can become tremendously large, and are
usually distributed. Examples of such systems are large long term storage
Graphite or Influx storages, [Druid.io](http://druid.io/) and other massive
TSDB storages. 

And finally, the **Type 3** is the thing that you actually use to understand
what is on fire in which way precisely when you get an alert from a Type 1
system. It's a **debug system** , not a time series collector in the first
place. Often it's not a system at all, but your ass in an ssh over there
running strace, but
[sysdig]({% link _posts/2017-04-20-understanding-sysdig.md %}) is
a much more sophisticated way of doing that in a modern environment. It is
important to understand the differences between the alerting OLTP system,
the trend collecting data warehouse system and the debug system:

- The first two systems have incompatible, antagonistic requirements. What
  you build can be either small, highly available, stable in size, and cheap
  to setup - or it can be scaleable, humongous but then it's likely not
  cheap to setup and certainly not small.
- The first two systems should be collecting time stamped series of
  numerical metrics, and we still need to talk about these, while the third
  system, the debug system collects structured data that is not necessarily
  numerical.

That means your organisation and you will for sure have more than one
monitoring system. Ideally, in a modern and containerised environment, you
will have Prometheus for Type 1 monitoring. In fact, each team will have
their own Prometheus for their own services, and you will have 
[Prometheus Federation](https://prometheus.io/docs/operating/federation/) to build a
data flow that collects data from individual per-team sub-monitors to a
centralised alerting dashboard. You will need a different system for long
term data storage, it's something else as a Type 2 system. You may want to
pump data from the Type 1 to the Type 2 system for all things that you want
to keep long term records of. But you need to be as comfortable with any of
the Type 1 systems losing historical data at any time as you need to be
comfortable with the Type 2 system to be offline for some amount of time.

## Data, Intervals and Percentiles

It is important to understand what's a good metric to collect. A good metric
describes something actionable that says something about the system under
monitoring. If you think that through, what you want to monitor is the user
experience, so in the end what you will be collecting is in many cases a
latency, the time it takes for a system to respond, or a capacity ('does
have enough compute/storage to serve').

Because a system that is too slow to respond may technically not be offline,
but it is as useless as a system that is offline, or worse. So what you
define is usually a list of maximum response times to certain queries and
percentages of times in a certain period in which these limits have to be
met. And a list of capacity limits that the system must meet. 

In both cases what you get as a metric is a series of time stamped numeric
measurements. And since you want to check 'How many measurements in a time
bucket have been meeting my limits?' ('How many requests in relation to the
total number of requests in the last minute have taken longer than 250ms to
process?') you need to deal with percentiles. 

[Yeah, like this](https://www.youtube.com/watch?v=lJ8ydIuPFeU). 

So, Spikes. How loaded is your network? Well, every network link at any
single point in time is either completely busy (because a bit is being
transmitted) or completely idle (because no transmission happens). It's
digital, there is no 43% busy link, ever, in any place on this planet.

That's useless.

So over the last second, how many bit-slots have been idle and how many
bit-slots have been busy? Well, it's a 10 Gbit/s link, and we have been
sending one and a quarter Megabyte in the last second, so that was one
Gigabit. That link was 10% busy in the last second. It was also 1% busy in
the last ten seconds, because it has been idle the 9 seconds before the last
one, and it was 100% busy in the last tenth of a second and idle in the nine
Tenths of a second before that.

That was a Spike.

If we were collecting samples, or network interface byte counters, every
second, we would see a 10% busy link. If we were collecting our counters
only once per 10 seconds it would be 1% busy.

If we plotted that, the two situations would be looking like two completely
different scenarios - one would be a clearly visible spike, the other would
be an invisible bump. So bucket sizes and percentiles matter, quite a bit.

Unfortunately, most data sources don't provide us with that. Imagine a
router from which you want to collect link utilisation statistics by the way
of reading network counters, and turning them into bytes/s readings. 

Things like Graphite have 
[a function for that](http://graphite.readthedocs.io/en/latest/functions.html#graphite.render.functions.nonNegativeDerivative),
and there are rules on 
[how to use that function correctly](http://www.jilles.net/perma/2013/08/22/how-to-do-graphite-derivatives-correctly/).
Other things, like Diamond, 
[fuck your data up](https://github.com/python-diamond/Diamond/issues/663). 

Collect counters, turn them into rates when you need them. Then, how often
are you going to read your counters? If you do it too rarely, you get widely
spaced metrics and you won't be able to see spikes as spikes. They get
spread out across the sampling interval, and consequently are flattened.
If you do it too often, you spam the network and the device, ultimately with
the metric collection becoming a measurable load in itself. 

Well, a device could provide readings in a batch. So instead of reading a
byte/s counter once a second, you could get the measurements for the last 60
one-second intervals every minute - the preferable solution. Or the device
could pre-aggregate (and that would be rates, not counters) - it could tell
you how many of the one-second buckets of the last minute were in the 0-50%
busy bucket, the 50-90% bucket, the 90-99% bucket, the 99-99.9% bucket and
so on (complicated, and also not as good as getting counters in a batch). 

So far I know of no devices that actually are capable of doing this
properly, so many people turn up the sampling rate to insane when they are
hunting spikes. Not a good situation.
