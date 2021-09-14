---
layout: post
status: publish
published: true
title: On cache problems, and what they mean for the future
author-id: isotopp
feature-img: assets/img/background/rijksmuseum.jpg
date: '2017-06-23 14:12:04 +0200'
tags:
- performance
- hadoop
- database
- lang_en
---
![](/uploads/2017/06/ssd-problem.jpg)

This is a disk utilization graph on a heavily loaded Graphite box. In this
case, a Dell with a MegaRAID, but that actually does not matter too much.

Go-carbon was lagging and buffering on the box, because the SSD was running
at its IOPS limit. At 18:10, the write-back cache and the "intelligent
read-ahead" are being disabled, that is, the MegaRAID is being force-dumbed
down to a regular non-smart controller. The effect is stunning. 

```console
/opt/MegaRAID/MegaCli/MegaCli64 -LDSetProp NORA -l0 -aALL
/opt/MegaRAID/MegaCli/MegaCli64 -LDSetProp WT -l0 -aALL 
```

and also, on top of that, 
```console 
#Direct IO instead of cached 
/opt/MegaRAID/MegaCli/MegaCli64 -LDSetProp DIRECT -l0 -aALL 

#Force SSD disk write cache (our SSD has super-capacitors, so it safe to enable)
/opt/MegaRAID/MegaCli/MegaCli64 -LDSetProp -EnDskCache -l0 -aALL 
``` 

What we observe here is part of an ongoing pattern, and we
will see more of it, and at more layers of the persistence-stack in our
systems. 

## IOPS are a solved problem

At the lowest layers, IOPS are now a solved problem, and will become even
more so. SSD are limited mostly now because of their interfaces, and so we
go from IDE-interfaces to NVME to get rid of that overhead.

That makes disk-seek operations very cheap - going from 200 IOPS on rotating
rust past 20k IOPS was only the first step, single drives now are offering
200k IOPS and more.

Bandwidth can also be provided at bus speeds through aggregation, so this is
mostly a package engineering problem.

Latency is still a problem. Even more than ever, actually, because now the
time to send a packet from a core through the network to a SSD at the other
end of the data center is comparable to or even dominating the time spent
reading or writing that remote media.

SSD still are disk-like devices. We are reading sectors at a time instead of
individual bytes, and especially in writes we are re-flashing large blocks,
64 KB in size or larger, depending on the hardware. Smart internal
controllers in SSDs are trying to take care of these things in the
background.

With Optane, this block structure of disks can and will go away. The proper
abstraction for Optane is not a file, but is memory - persistent, byte
addressable memory within an order of magnitude of RAM speed.

On top of the actual drive sits a large stack of caches and transformation
layers. In this case, one layer, the disk controller and the logic in it,
became a bottleneck: A CPU considerably smaller than the actual system
processor, and with limited memory, was reading ahead file contents that do
not benefit from reading ahead. It was also buffering writes, in order
reorder and merge them, trying to exploit properties of a spinning medium
that was no longer present. The write-pressure from the systems processor
and the data volume became so large that either the CPU on the controller or
the size of the controller-cache became a bottleneck.

A disk behind the controller would have been even slower than the
controller, but a SSD can actually cope and be faster than the controller
sitting between it and the system CPU. Taking the controller out of the path
speeds things up. 

The commands above take out one layer in the deep and rich storage stack,
but there are many more. Each of them now has the potential to become the
next bottleneck. Or as one of my database colleagues has been known to say
in one form or the other more than once:

> "Forget caches, just make everything fast all the time." -- Nicolai Plum

## Hadoop in the face of many IOPS

We will see more of this, and at more levels of the system. Take Hadoop for
example. The two core premises on which Hadoop is built are

1. Seeks are expensive. We scan data front to back, and build data
processing on linear I/O (of compressed CSV or JSON files, even!).Even if we
are reading much more data than we need, even if we have to costly
uncompress and parse the data, this method of processing is way faster than
any database could ever be, and we can easily leverage the power of
parallelism.
2. Code is smaller than our data. So we create small Java classes with our
code and ship it to the systems where the data we need is stored locally in
order to process it.This is a convoluted way to express our wants within the
rigid framework of Map/Reduce, but it's the only way to code, because
reading all that data and shipping it across the net to where the code lives
is literally impossible.

Premise #2 is no longer valid since 
[Jupiter Rising](https://conferences.sigcomm.org/sigcomm/2015/pdf/papers/p183.pdf).
We can disaggregate processing and storage again, because we can build data
center networks that are as fast and wide as system buses, so that any core
in the data center can talk to any disk in the same data center. 
[This talk](https://www.youtube.com/watch?v=NfxvjWSgplU) demonstrates this by
creating ephemeral Hadoop processing clusters at the press of a button for
the processing of single queries, by kubernetizing the Hadoop Mappers and
Reducers. In this case, the relationship between the Mapper and the data
this Mapper processes is simply not local at all - the Mapper may in fact
run anywhere in the data center and is no longer tied to where the data is
stored at all. Or, as one of the networking colleagues of mine puts it:

> "Any sufficiently funded technology is indistinguishable from Magic."
> (Brian Sayler on the networking underneath a containerized Hadoop and
> Compute/Storage disaggregation)

Premise #1 is going out of the window as well. Next year, latest the year
after that, we likely will stop buying rotating rust even for the Hadoop
servers. But that means we could seek again, which means that we could be
using index data structures efficiently to work with data larger than main
memory again. Which means that all these de-normalized, scannable,
inefficiently nested and hard to parse JSON structures will be becoming more
and more of a problem: As I/O takes a smaller percentage of the time spent
on handling the data, we need to optimize the actual data decompression,
parsing and handling more. _Hadoop in the current form is a dead man
walking._ There is no alternative piece of software visible at the horizon
at this moment, so these will be interesting times. And there will be more
changes: File I/O is, even at much smaller levels, a lot about reformatting
data from in-memory representations of things to on-disk representations.
In-memory structures are pointered and traversable, aligned to n-byte
boundaries, often lockable structures, because at memory speed these
optimization matter. For persistence, we serialize them in complicated ways:

- Databases like MySQL have all kinds of densely packable data types (1- and
  3-byte integers, for example),
- references are IDs, which require lookup, instead of being traversable
  pointers
- the process of serialization often requires traversing nested,
  multidimensional data structures of ADTs and creating a linear, frozen
  representation of them.

Shallow and deep copies need to be considered, depending on the problem.

It's a fully fledged phase transition where the data is going from a
gaseous, loosely packed form to a densely packed frozen, solid form for
storage. The things beyond SSD, Optane/3D-Xpoint and similar storage, are
more like memory than they are like disks, and hence they likely to some
extent are able to handle 'gaseous' unserialized data and make that
persistent at the same time. 

In the end, the death of the file handle, and hence the death of Unix

That challenges the fundamental abstraction of Unix, though, because in Unix
everything is a file, which is a linear array of bytes, and is being
accessed through a file handle. Now, with Optane persistent data may be no
longer behind a file handle, but a special kind of memory, and data does not
have to be crystallized into serialized structures before persistence. In
fact, the memory may be so fast that we might not have time to do that. We
require a different compute abstraction instead. 

Which means, when we have it, the result will finally, after five decades,
not really Unix any more.
