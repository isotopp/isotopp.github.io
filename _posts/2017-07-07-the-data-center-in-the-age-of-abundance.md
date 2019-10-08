---
layout: post
status: publish
published: true
title: The Data Center in the Age of Abundance
author-id: isotopp
feature-img: assets/img/background/rijksmuseum.jpg
date: '2017-07-07 09:26:02 +0200'
tags:
- container
---
We are currently experiencing a fundamental transition in the
data center. In recent discussions, it occured to me how little
this is understood by people in the upper layers of the stack,
and how the implications are not clear to them.

In the past, three fundamentally scarce resources limited the
size of the systems we could build:

- IOPS, 
- bandwidth and 
- latency.

All three of them are gone to a large extent, and the systems we
are discussing now are fundamentally different from what we had
in "The Past™", with "The Past" being a thing five to ten years
ago.

In The Past we had disk.

A disk of rotating rust is a data store than can, at best,
perform 200 disk seeks (ssI/O Operations per second, IOPS), so
databases tended to be special computers with very many small
disks, data spread out across as many spindles as possible. The
entire system was fake-accelerated with caches, with accepted
writes into battery buffered memory of limited size, and woe if
the working set of your data ever exceeded the cache size.

Five years ago we converted all customer facing databases to
systems on SSD with about 20.000 to 50.000 IOPS, and with
current NVME based storage we are about to see millions of IOPS.
Fundamentally, IOPS are not a limited resource any more: With
the techniques we learned from the rotating rust age, we can
build machinery with an arbitrary amount of random write
capability.

In the past, databases and frontends have been connected to the
world using network adapters with a Gigabit per second
capability. About five years ago, we converted the first systems
to 10 GBit/s at scale, and today we routinely build systems with
about 400 MBit/s to 1 GBit/s per Thread (so a 50 core system
gets a dual-25 GBit/s network card).

Companies like Mellanox have switches with a large two digit
number of 100 GBit/s Interfaces. We have leaf-and-spine
architectures available that allow us to build data pathes
between tens of thousands of computers inside a single data
center with no chokepoints - we are actually getting the 1
GBit/s per thread on the entire path between _any_ thread and
_any_ disk in our data center, concurrently.

In the past, commit latency to a disk along these pathes used to
be on the upside of 500 µs (1/2000 of a second) and more likely
in the low milliseconds. But with current cards, offloading and
other trickery we can get at or below 200 µs. Add scary stuff
such as RDMA/RoCE to the mix, and we may be able to routinely
crack the 100 µs barrier.

That makes writes to the data center sized fabric as fast or
faster than writes to a slow local SSD.

Today we are at an inflection point, because what we have today
is true abundance: Each of the three limiters, IOPS, bandwidth
and latency, have been throughly vanquished. We can now build a
system where the data center sized fabric at scale provides
bandwidth and latency comparable to a system bus of a slow home
computer (and is consecutively faster the smaller the domain
gets).

We can build machines the size of a data center, up and past one
million cores, that provide essentially enough coupling to be
able to act as a single machine. The building blocks are Open
Compute Racks at 12 kW a piece. The operating system of the
machine is Kubernetes. The units of work are container images.
The local API is the Linux Kernel API.

