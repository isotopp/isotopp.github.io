---
layout: post
status: publish
published: true
title: RTT-based vs. drop based congestion management
author-id: isotopp
feature-img: assets/img/background/rijksmuseum.jpg
date: '2017-05-09 15:52:02 +0200'
tags:
- internet
- networking
- lang_en
---
[APNIC discusses different TCP congestion control algorithms](https://blog.apnic.net/2017/05/09/bbr-new-kid-tcp-block/),
coming from Reno, going through CUBIC and Vegas, then introducing BBR (seems
to be a variation on CoDel) and what they observed when running BBR in a
network with other implementations.

TCP congestion control algorithms try to estimate the bandwidth limit of a
multi-segment network path, where a stream crosses many routers. Each
segment may have a different available capacity. Overloading the total path
(that is, the thinnest subsegment of the path) will force packet drops by
overloading the buffers of the router just in front of that thin segment.
That in turn requires retransmits, which is inefficient and has nasty
delays.

To make matters more complicated, the Internet is a dynamic environment and
conditions can change during the lifetime of a connection. The first half up
to "Sharing" is nothing new if you followed the works of Dave Taht or later
works of Van Jacobson. 

BBR seems to work like [CoDel](https://en.wikipedia.org/wiki/CoDel): It
measures the RTT, the time delay the sender sees between sending a piece of
data over the TCP link and seeing the acknowledgement return. And like
CoDel, BBR seems to try to keep buffers along the line just barely filled
(that is, whenever a router finishes sending a thing, the next thing should
be just ready to send in the buffer, but no more). 

This again is not a new insight, it's 
[Theory of Constraints](https://en.wikipedia.org/wiki/Theory_of_constraints#Operations)
and especially
[DBR](http://www.lean-manufacturing-japan.com/scm-terminology/dbr-drum-buffer-rope-theory.html)
applied to networking. 

The new insight in the paper is that RTT-based queue capacity management can
in some circumstances starve drop-based algorithms. The authors show an
example where BBR starves out a CUBIC connection on the same link. The
section on "Congestion Control and Active Network Profiling" is then
somewhat politcal. BBR has been deployed by Youtube, and it not only
relieved buffer-management between Youtube and the Youtube client, it also
suddenly makes shapers on the way very visible.

Youtube is quoted with

> “Token-bucket policers. BBR’s initial YouTube deployment revealed that
> most of the world’s ISPs mangle traffic with token-bucket policers. The
> bucket is typically full at connection startup so BBR learns the
> underlying network’s BtlBw [bottleneck bandwidth], but once the bucket
> empties, all packets sent faster than the (much lower than BtlBw) bucket
> fill rate are dropped. BBR eventually learns this new delivery rate, but
> the ProbeBW gain cycle results in continuous moderate losses. To minimize
> the upstream bandwidth waste and application latency increase from these
> losses, we added policer detection and an explicit policer model to BBR.
> We are also actively researching better ways to mitigate the policer
> damage.”

This is a very nice way to say "We are seeing your shitty traffic shapers
and are working around them."
