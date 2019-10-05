---
layout: post
status: publish
published: true
title: The attack of the killer microseconds
author: isotopp
author_login: kris
author_email: kristian.koehntopp@gmail.com
wordpress_id: 1669
wordpress_url: http://blog.koehntopp.info/?p=1669
date: '2017-05-01 21:14:11 +0200'
date_gmt: '2017-05-01 20:14:11 +0200'
categories:
- Computer Science
- Data Centers
- Networking
- Performance
tags: []
---
<p>In the [Optane article](http://blog.koehntopp.info/index.php/1632-optanexpoint-and-paradigm-shift/) I have been writing about how persistent bit-addressable memory will be changing things, and how network latencies may becoming a problem. The ACM article [Attack of the Killer Microseconds](https://cacm.acm.org/magazines/2017/4/215032-attack-of-the-killer-microseconds/fulltext) has another, more general take on the problem. It highlights how we are prepared in our machines to deal with very short&nbsp;delays such as nanoseconds, and how we are also prepared to deal with very long delays such as milliseconds. It's the waits inbetween, the network latencies, sleep state wakeups and SSD access waits, that are too short to do something else and too long to busy wait in a Spinlock. <!--more--> They write</p>
<p>> Recent trends point to a new breed of low-latency I/O devices that will work in neither the millisecond nor the nanosecond time scales. Consider datacenter networking. The transmission time for a full-size packet at 40Gbps is less than one microsecond (300ns). At the speed of light, the time to traverse the length of a typical data-center (say, 200 meters to 300 meters) is approximately one microsecond. Fast datacenter networks are thus likely to have latencies of the order of microseconds. Likewise, raw flash device latency is on the order of tens of microseconds. The latencies of emerging new non-volatile memory technologies (such as the Intel-Micron Xpoint 3D memory and Moneta) are expected to be at the lower end of the microsecond regime as well. In-memory systems (such as the Stanford RAMCloud project) have also estimated latencies on the order of microseconds. Fine-grain GPU offloads (and other accelerators) have similar microsecond-scale latencies. Not only are microsecond-scale hardware devices becoming available, we also see a growing need to exploit lower latency storage and communication. One key reason is the demise of Dennard scaling and the slowing of Moore's Law in 2003 that ended the rapid improvement in microprocessor performance; today's processors are approximately 20 times slower than if they had continued to double in performance every 18 months. In response, to enhance online services, cloud companies have increased the number of computers they use in a customer query. For instance, single-user search query already turns into thousands of remote procedure calls (RPCs), a number that will increase in the future. Techniques optimized for nanosecond or millisecond time scales do not scale well for this microsecond regime. Superscalar out-of-order execution, branch prediction, prefetching, simultaneous multithreading, and other techniques for nanosecond time scales do not scale well to the microsecond regime; system designers do not have enough instruction-level parallelism or hardware-managed thread contexts to hide the longer latencies. Likewise, software techniques to tolerate millisecond-scale latencies (such as software-directed context switching) scale poorly down to microseconds; the overheads in these techniques often equal or exceed the latency of the I/O device itself. As we will see, it is quite easy to take fast hardware and throw away its performance with software designed for millisecond-scale devices.</p>
<p> Some people point to High Performance Computing, which should have been developing technologies that can fix that. There is, however, a difference between large scale datacenters and HPC. [![](http://blog.koehntopp.info/wp-content/uploads/2017/05/t3.jpg)](https://cacm.acm.org/magazines/2017/4/215032-attack-of-the-killer-microseconds/fulltext#T3) Generally speaking, HPC is to a much larger degree about performance, as in BANG!, while warehouse computing is about performance per money spent, bang&nbsp;per buck. The purpose of the article is mostly to legitimize this as an urgent area of current research, it does not really offer solution strategies.</p>
