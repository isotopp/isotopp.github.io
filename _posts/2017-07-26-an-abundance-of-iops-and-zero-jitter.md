---
layout: post
status: publish
published: true
title: An abundance of IOPS and Zero Jitter
author-id: isotopp
feature-img: assets/img/background/rijksmuseum.jpg
date: '2017-07-26 14:51:55 +0200'
tags:
- filesystems
- data center
- container
- performance
- lang_en
---
Two weeks ago, I wrote about 
[The Data Center in the Age of Abundance]({% link _posts/2017-07-07-the-data-center-in-the-age-of-abundance.md %})
and claimed that IOPS are - among other things - a solved problem. 

What does a solved problem look like?

Here is a benchmark running 100k random writes of 4K per second, with zero
Jitter, at 350µs end-to-end write latency across six switches. Databases
really like reliably timed writes like these. Maximum queue depth would be
48, the system is not touching
that.

![](/uploads/2017/07/pure-storage1.jpg)

and here is iostat on the iSCSI client running the test

![](/uploads/2017/07/pure-storage2-1024x238.jpg)

100k random writes, 4k write size, inside a 2 TB linux file of random data,
on a 15 TB filesystem with XFS, on an LVM2 volume provided by iSCSI over a
single 10 GBit/s interface, with six switch hops between the linux client
and the array.

The array claims 150µs latency, on the linux we measure around 350µs. Out of
that, there are less than 50µs from the switches and 150µs or more from the
Linux storage stack (and that is increasingly becoming an issue).

Tested product was a [Purestore Flasharray-X](https://www.purestorage.com/products/flasharray-x.html),
client was Dell PowerEdge R630, 2x E5-2620v4, 128G, 10GBit/s networking.

Thanks, Peter Buschman!
