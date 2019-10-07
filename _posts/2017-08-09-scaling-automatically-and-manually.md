---
layout: post
status: publish
published: true
title: Scaling, automatically and manually
author-id: isotopp
feature-img: assets/img/background/rijksmuseum.jpg
date: '2017-08-09 10:19:30 +0200'
tags:
- erklaerbaer
- performance
- container
---
There is an interesting article by Brendan Gregg out there, about 
[the actual data that goes into the Load Average](http://www.brendangregg.com/blog/2017-08-08/linux-load-averages.html)
metrics of Linux. The article has a few funnily contrasting lines. Brendan
Gregg states

> Load averages are an industry-critical metric – my company spends
> millions auto-scaling cloud instances based on them and other metrics
> […]

but in the article we find Matthias Urlichs saying

> The point of "load average" is to arrive at a number relating how busy the
> system is from a human point of view.

and the article closes with Gregg quoting a comment by Peter Zijlstra in the
kernel source:

> This file contains the magic bits required to compute the global loadavg
> figure. **Its a silly number but people think its important.** We go
> through great pains to make it work on big machines and tickless kernels.

Let's go back to the start. What's the problem to solve here?

Brendan Gregg wants his company to scale his virtual machines to demand,
because they are paying per use and so they have an incentive to use enough
capacity to hold the service level objectives, but not more.

The default mechanism to achieve this is a reactive _autoscaler_ using
_loadav_ from inside virtual machines as a _scale signal_.

We need to unpack that. So there is a mechanism that will scale his
deployment by launching more instances of a thing if a condition is true. By
default, the condition is loadav, but Gregg suggests other, less broken
metrics in his article: Different CPU and Scheduler metrics, disk metrics,
or other system metrics.

In a conversation with Tobias Klausmann, he suggested application level
latencies as a signal. I agree in that these are the best indicator to
signal the existence of a problem. In [Load, Load Testing and
Benchmarking]({% link _posts/2017-02-16-load-load-testing-and-benchmarking.md %}), 
there is the hockey stick: 

![](/uploads/2017/02/benchmark2.png) 

Requests/s vs. Response/s (Capacity) and Requests/s vs. Response time
(Latency). As we raise offered load, the system approaches the 100% line
(the vertical saturation line), and a backlog builds.

The lower graph shows a system under increasing load. Response times will be
almost level while the system is not saturated. If the system reaches
saturation, it is about to receive more requests than it can handle, and
wait time adds to the think time, so response times go up. Sharply.

Unfortunately, this is a good indicator which is always late. Latency based
autoscaling will react to a system that is saturated when it is saturated,
never before. For a system 10% before saturation and a system 5% before
saturation, the latencies will be almost the same, so that among the jitter
and noise there will be no useful signal to initiate scale-up. Only when we
have saturation the latencies go up to trigger a proper signal, but at that
point the user experience is already going down the drain. And that is kind
of the real problem here.

The default mechanism to achieve this is a _reactive_ autoscaler using
loadav from inside virtual machines as a scale signal.

The scaling mechanism is reactive. It has to be, because any predictive
autoscaling is not generic. It can't be built into the platform. A
predictive autoscaler knows something about the application, or maybe even
the business. For example, you might know from benchmarking that your
application requires an instance of the type _Z_ for every _m_ requests/s
going into the system. So you could monitor the request rate and just before
you reach that limit you are ordering the next instance. 

![](/uploads/2017/08/Screen-Shot-2017-08-09-at-10.10.06-640x204.png)

Image from [The virtues of boring technology]('https://www.slideshare.net/isotopp/boring-dot-com-the-virtues-of-boring-technology),
Slide #12

Or you already know the pattern of your business over a year and over a day
and actually will know what the request rate is likely going to be tomorrow
at 9am on August 9, 2017. In that case you can schedule the appropriate
amount of instances in time before the load hits your systems and still have
time to warm up all caches.

In some environments, supply management is kind of critical: For example,
when you sell hotel rooms, you need to know which trade shows are having
what kind of impact on the availability of beds around the event site and
make sure that you have sufficient supply before the demand materialises.
It's a thing you have to do anyway, for the business.

But if you are already building demand models for business reasons, you can
also use this data to build demand models for hardware utilisation and use
it to move from reactive autoscaling to predictive autoscaling.

So here are some alternatives to autoscaling with loadav:

- Build predictive models using business data. It will make the business and
  your management of it better, and it will make life easier in the machine
  room, so it pays for itself over and over.
- Use benchmarking in production to get an idea of the shape of the hockey
  stick in your environment. Latencies \>\> every other metric, Real world
  metrics \>\> any guess you can have.
  - Latency goes up when a thing is saturated. That's the thing your
    performance is bound by. You can't survive anything ever, unless you
    know precisely what that things is and until it is being monitored
    properly.
- Get a clue about the request pipeline and identify (latency) metrics that
  are early warning indicators, if you have any. Then use them for reactive
  autoscaling. Also, fix your predictive model if you ever scale reactively.

TL;DR: Reactive autoscaling sucks. Get out of it. Model your shit.
