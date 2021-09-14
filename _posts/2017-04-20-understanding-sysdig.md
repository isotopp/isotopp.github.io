---
layout: post
status: publish
published: true
title: Understanding sysdig
author-id: isotopp
feature-img: assets/img/background/rijksmuseum.jpg
date: '2017-04-20 15:32:24 +0200'
tags:
- container
- monitoring
- lang_en
---
The [open source](https://github.com/draios/sysdig)
[sysdig](http://www.sysdig.org/) is a piece of software that does not quite,
but almost, what strace or oprofile do: It instrument the kernel, and traces
system calls as well as a few other kernel activities.

[Youtube: Sysdig Open Source - Getting Started With Csysdig](https://www.youtube.com/watch?v=UJ4wVrbP-Q8)

It does not utilize the ptrace(2) kernel facility, though, but its own
interface. This interface picks up data in the kernel and writes it into a
ring buffer. A userspace component extracts this data, interprets, filters
and formats it, and 
[then shows it](https://github.com/draios/sysdig/wiki/Sysdig-Examples).

If the data source outpaces the userspace, the ring buffer overflows and
events are lost, but the actual production workload is never slowed down.

So
sysdig requires that you add the sysdig-probe.ko to your kernel. This is a
component available in source, and can be built for your kernel just fine.
On the other hand, sysdig just collects data in kernel, it does not process
the data in that place - instead it moves most of the processing to
userland. This is unlike dtrace, which requires an in-kernel special purpose
language to do stuff, and requires a special coding style in order to
prevent waits of the production workload. In sysdig, this processing happens
off the production path, in userland, and hence is less time-critical. 

A long discussion of the design decisions can be seen in a 
[sysdig blog article](https://sysdig.com/blog/sysdig-vs-dtrace-vs-strace-a-technical-discussion/).

The open source version of sysdig is a single host thing - data is collected
on one host and processed there, but it is already container aware. The
really interesting product is the 
[commercial variant of sysdig](https://sysdig.com/), though. Here, all your container hosts are
being instrumented and data is collected (with application of filters, of
course) on all hosts, centrally collected and stored, and then can be
processed and drilled down 
[using a web interface or a command line utility](https://www.youtube.com/watch?v=kK6clPVC53w). 
The data store parts are 
[standard persistence components](https://support.sysdig.com/hc/en-us/articles/206519903-On-Premises-Installation-Guide)
that are known to scale nicely - cassandra, elastic search, and MySQL,
connected together by Redis queues. You can run all this in your data center
with their on-premises solution, or push to the sysdig run monitoring cloud
solution (not really an option for most European customers, though, and also
not for anybody wanting to stay PCI compliant). 

The commercial solution not only is a kind of distributed strace, but like
the single host product is container and orchestrator aware. So you can ask
it for all disk writes to all log directories in all MySQL instances related
to the wordpress deployment in Kubernetes, and it will find the relevant
instances and their data for you and pick these events, no matter where
Kubernetes has been scheduling these instances. 

In fact, the product also knows about LDAP authentication and
Openshift/Kubernetes RBAC authorization, so that developers can view the
trace data from their groups deployments, but not from others. The
commercial solution also transcends system call instrumentation and in fact
understands internal event data from other, higher level products. When you
are stracing or oprofiling a JVM or a perl instance, the only data you get
is a lot of memcpy(), which is not really useful for debugging. You need
execution engine instrumentation to understand what the language is doing,
what symbols, objects and function call frame are on the stack and how
memory is being used. 

[Integrations for many things](https://sysdig.com/product/integrations/)
exist and are being loaded on demand. So the web GUI allows you to review
the topology of a Kubernetes project deployment, how it is being mapped to
hosts, zoom in into instances of containers, and then dig into the actual
pieces of software running in these containers, and finally dive into
individual network packets or calls these things have been making. It's
pretty awesome, and it takes the grind of finding instances, setting up
monitoring, collecting and interpreting data completely away from the
developer.

They simply have seamless and effort-free visibility to all their things,
and only their things. Sysdig (even the open source variant) also brings a
number of nice and innovative concepts to the table. Spans for example are a
[hierarchical set of start/stop markers](https://github.com/draios/sysdig/wiki/Tracers), 
which can be easily added to own code by simply writing structured data to
/dev/null - that's a cheap and universally available operation, which
nonetheless is clearly visible to sysdigs instrumentation.

Sysdig understands spans, and can correlate them with themselves (they are
hierarchical), with system objects (Spans can have IDs and tags) and with
other events (spans are called spans, because they mark a span of time and
space and they contain other system events). 

![](/uploads/2017/04/tracers_spectro.png)

A spectrogram plots logarithmically bucketized spans (or calls) every 2
seconds. Slow calls to the right, fast to the left. You can mark an area
with the cursor and see the actual calls in the Drilldown.

Drill down is then possible within a span to see what happened inside. So
you can span a transaction, request or another event, watch for bad things
happening and then after the fact go and dive into the event logs and call
stacks of things, watching the stack catch fire and burn down event by
event. Treating event streams as a time series is - within limits - also
possible. Lua scripts called 
[chisels](https://github.com/draios/sysdig/wiki/Chisels-User-Guide) 
can be used to trigger on events in the event stream, and maintain
aggregates or format interesting events. Because this happens outside of the
kernel and also outside of the production control flow, this is not
performance critical for production, and because it is using Lua it is very
flexible and easily extensible.

The commercial sysdig product collects and stores data in a cassandra
instance. The web GUI then to some extent treats that data as a kind of
primitive time series database. 

This is also where the limits of the current product lie: Their
understanding of the statistics and math of time series data is limited.

- There are no expressions, only single data-source values. 

- You cannot calculate derived values (MySQL disk reads/disk read requests to get a cache
  ratio for example) on retrieval, but like with Zabbix you have to do this on
  collection. 
- Also, Time Series Math as it exists with the Graphite/Grafana
  languages is not possible in sysdig, so it is impossible to plot correct
  read ratio vs. last weeks read ratio scaled to todays load in the same graph
  for comparison.
- Aggregations are always single functions, to raw data
  generating a mean (50th percentile), a 99th, 99.9th and 100th (max)
  percentile time series at once is not an operation that can be expressed.
- Averages are used when means would be more appropriate, and averages of
  averages are being built without conideration to math and meaning at all.

Alerting is hampered by the lack of time series math. 

What would be necessary would be proper time series math for model building
("This is the expected, modelled system behavior") and the acceptable
deviation corridors around the predicted system behavior should be defined.
Alerts should fire when the actual observed behavior deviates from the
predicted system behavior - but the lack of math makes the modelling
impossible and so the Alerting is primitive and must lead to many false
positives. 

So if you see monitoring as a tripartite thing (\*1), Debugging,
Transactional Monitoring and Data Warehousey Monitoring, sysdig is awesomely
advanced in the debugging discipline, and kind of meh'ish okay in the
transactional thing. It fails the data warehousey stuff completely due to a
lack of functionality on that side.

The company is addressing these limitations in coming releases.

That said, within these limitations, **sysdig is awesome**. It makes the
debugging part of container deployments a breeze, and adds completely new
possibilities and an incredible amount of visibility to working in
Kubernetes.

The centralized logging and data storage makes a distributed,
container-aware strace/oprofile available to developers, and integrates
nicely with the access control methods available in the system. 

**Well worth the invest in added productivity** , even if it is not (can't
be) the end-all of monitoring for everyone and all use-cases (but they are
working on it).


(\*1) Debugging means you interactively define filters, drilldown and views
on the system to observe application behavior. You may be able to define
triggers that recognize events where you want to start more capture, collect
data in depth and then reconstruct buggy behavior with very in depth, non
necessarily purely numerical data collected. 

Sysdig is the benchmark system for debugging here. Transactional monitoring
is where you define Alert conditions, generate alert events to get a human
to handle the incident, have the human handle the incident and close it.
Once that has happened, the transaction is done, and the data about the
incident can be forgotten. Prometheus is the benchmark transactional
monitoring system.

Datawarehousey monitoring builds long term views of system utilization and
behavior and tries to model system behavior. It is used for capacity
planning, trend analysis, and sometimes delivers baselines for transactional
anomaly detection. Many TSDB systems, stuff like Druid, and - outside of
containers - Graphite do this kind of stuff.

This article has been written after getting the product demoed, and playing
with it in our environment with some test licenses. Not sponsored by sysdig
or anybody else.
