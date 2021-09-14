---
layout: post
status: publish
published: true
title: Load, Load Testing and Benchmarking
author-id: isotopp
feature-img: assets/img/background/mysql.jpg
date: '2017-02-16 21:13:28 +0100'
tags:
- erklaerbaer
- datenbanken
- performance
- testing
- lang_en
---
(This article also available in [german language]({% link _posts/2012-08-28-load-load-testing-und-benchmarks.md %}).)

So you have a new system and want to know what the load limits are. For that
you want to run a benchmark.

## Basic Benchmarking

The main plan looks like this:

![](/uploads/2017/02/benchmark_plana.png)

The basic idea: Find a box, offer load, see what happens, learn.

You grab a box and find a method to generate load. Eventually the box will
be fully loaded and you will notice this somehow.

The first mistake: running the load generator and the system to test on the
same box. That won't work. 

It's our goal to bring the box to its limits. Actually, we want to push it
past that in order to see what it is that is limiting it. That will happen
only when we are able to generate more load than the target system can
actually process. If the load generator and the target system are sharing
any resources that will never happen: The starved resource, for example CPU,
will be slowing down not only the target application but also the load
generator until we are reaching equilibrium at an unknown point below the
actual limit.

That way we will never see what color the smoke is when the box catches
fire, that is, what the actual system behaviour under overload is. So we
need to separate the load generator and the target system.

The second mistake: The target system or the load generated are not close
enough to production. In database land, typical mistakes are

- The tested system has less memory or a different disk subsystem than production.
- The test data set is smaller than production.
- The test query set or the test data set is biased relative to production.

In all of these cases we will be learning something, but it will not easily
port to production. For example, in 2005 the german computer magazine c't
had a test media shop selling CD and DVD media, and was using this to
benchmark implementations of the system with different databases. 
The actual benchmark was an equidistribution of queries, so there have been
no best sellers and no long tail. 

To win the benchmark it was mandatory to disable all caches, because there
was no set of popular media which would have been gaining from caching. That
outcome is the opposite of what is necessary in a real world scenario, where
there is a clear long tail distribution of queries.

The closer you can bring the test load, the tested system and the test data
to production the besser the results. Which is why at work we are trying
very hard to make testing in production safe, and then we test whatever is
possible in production.

## Saturation

When you offer load to a system, the average load on the system will rise.
But load usually is not constant, but will vary, depending on what users are
doing and how expensive the individual requests are: Not all operations are
equally expensive.

![](/uploads/2017/02/benchmark1.png) 

A system close to saturation: Average load is slightly below the maximum, but
individual peaks spike above the saturation line.

Consequently we are not pushing the system to a limit, but we are raising a
rolling average in which the actual load is constantly fluctuating and
oscillating around this average until the peaks exceed the point of
saturation. 

![](/uploads/2017/02/benchmark3.png)

The average offered load is below the 100% saturation line, but the peaks
are already exceeding the limit.

That is of course nonsense. The saturation limit is a hard limit, the system
can't produce more than that, because a necessary resource is exhausted and
the system is constrained by that resource. So what actually happens is that
the system will be building a backlog whenever the offered load goes above
the 100% line. Requests will pile up in some queue and will only be
processed when the load goes below that limit.

As we push the system harder, it will exceed the saturation point more and
more and phases where it can gain on the building backlog will become rarer.
But since the costs for an individual request vary, it is hard to overload
the system in a controlled way - harder the higher that variance is.

That is one of many reasons why we focus on outliers and worst cases first
when we care about optimization: In order to be able to meet any kind of
service level objective we need to handle these extremely bad cases first
and narrow the band of possible response times, even if that does not move
the mean much. Only then we can try to improve the mean response time of the
system.

## Wait time and the hockey stick

What actually happens at saturation becomes clearer as we transform the
above graph and take it out of the time domain. We will be graphing offered
load (requests/s) vs. throughput (responses/s) and offered load (requests/s)
vs. response time (latency). 

![](/uploads/2017/02/benchmark2.png)

Requests/s vs. Response/s (Capacity) and Requests/s vs. Response time
(Latency). As we raise offered load, the system approaches the 100% line
(the vertical saturation line), and a backlog builds.

As we increase load, each request will generate a response: the curve in the
capacity graph goes up at a 45deg angle. Even as the load rises, requests
will take approximately the same time to process - we are calling this time
the think time.

Once we approach saturation, a resource in our system will be starved and
constrain capacity. Even if we are offering more load, this will not
generate more responses. The capacity graph flattens out. Since more
requests are coming in than we have capacity for, these excess requests will
be queued. Wait time is being added on top of the think time. 

And since we are continuing to add more requests than we can handle, the
queue and the wait time will rise rapidly and without bounds. The latency
curve has the shape of a hockey stick.

## Testing in production

That is not a theory, but can be shown in real production systems. 

![](/uploads/2017/02/benchmark5.png) 

A typical production setup. User requests are entering the system from the
internet at the top, hitting a load balancer. The request are routed to a
set of web servers behind the load balancer.

Assuming that you have a minimum size for load testing with production load:
You need to have a sufficient number of users, large enough so that
individual users do not contribute in a meaningful way. You will need a
frontend load balancer in front of a number of webservers, and you need to
be able to modify load distribution weights live in this setup. 

The load tests starts with running an Apache Siege load generator at a very
low setting from the outside against the setup - actually, the Siege is not
running against the load balancer, but against one individual web server
which is the one which we will be trying to overload. This is not done to
generate load, but to measure latency: In normal configuration our system
will not be overloaded, so the baseline latency we are seeing is think time.

During the benchmark we are playing with weights in the load balancer in
order to direct more load to individual web servers. The load balancing
weight of the web server getting the Siege requests is now being increased
so that it will need to handle more actual user requests than the other
servers. Eventually either timeouts will be showing up in the error log, or
the request latency shown by Siege will be going up dramatically. 

Either signal indicates saturation, and we need to stabilize offered load at
or very slightly below this point in order to find the saturation point.

Here is a time domain plot of such an event:

![](/uploads/2017/02/load-test-time.png)

A request graph of a MySQL database slave being load tested. Writes are
coming in via replication, and are not subject to load testing, hence
stable. Selects are being load tested and increase at the tests
commence.

In the test graph above we are looking at query counters of a MySQL database
slave during three load test events. Write queries (insert, update, delete)
are coming in through replication from the upstream master and are not
affected by the load test. Selects are being increased by load balancer
manipulation. 

During the third test there is a spike of update statements
due to a cron script running and affecting the test, invalidating the
results of that run.

Taking the results from the above run and plotting them in a latency graph
results in the following graph. The hockey stick is clearly visible:

![](/uploads/2017/02/load-test-comparison.png)

Latency graph: test1 is shown in blue, test2 in orange.

The graph shows offered load vs. latency of the configurations test1 and
test2 from the run above. Configuration test2 is clearly superior. A variant
of this graph uses larger symbols as the error rate of that measurement
increases to add another dimension. That way the stability of the system
under test in overload is being visualized as well.
