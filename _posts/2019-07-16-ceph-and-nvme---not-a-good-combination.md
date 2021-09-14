---
layout: post
title:  'Ceph and NVME - not a good combination?'
author-id: isotopp
feature-img: assets/img/background/mysql.jpg
date: 2019-07-16 08:21:25 +0100
tags:
- lang_en
- computer
- ceph
- storage
---
Saving an [older twitter thread on Ceph](https://twitter.com/isotopp/status/1151013922528534528).

[![](/uploads/ceph-blog.jpg)](https://ceph.com/community/part-4-rhcs-3-2-bluestore-advanced-performance-investigation/)

I just have finished reading 
[Part 4: RHCS 3.2 Bluestore Advanced Performance Investigation](https://ceph.com/community/part-4-rhcs-3-2-bluestore-advanced-performance-investigation/)
and now I do not know what to say.

Ceph set out with the idea to make storage a commodity by using
regular PCs + a lot of local hard disks + software to make
inexpensive storage. For that, you ran a number of control
processes and an OSD process per disk ("object storage demon").

Some people were very enthusiastic, envisioning OSD processes
becoming an integrated part of any storage device as part of
computational storage, even.

Something else happened: NVME. NVME is flash memory on a PCIe
bus, giving you a very large number of IOPS with mediocre
latency. You get around 1 million IO operations per second, but
a read takes ~100 microseconds, and an unbuffered write takes
about 420 micros. That means, you need to run 100s of parallel
things.

Ceph is full of logs. Logs kill parallelism by design, or at
least severely limit it. Also, Ceph is full of computational
complexity. And that is ok, when a disk seek takes 5ms on a 3GHz
CPU, and you got 15 million clock cycles think time per disk
seek. Less so, when you need to keep 100s of ops in flight.
Suddenly, the budget shrinks by /1000, and your serializing
architecture gets in the way of things.

Now read this report. We are talking about NVME devices, 11T,
maybe 16T per device, 4 PCIe lanes. These people are talking
about 4 OSD processes (down to 2, and they consider this an
improvement) per device. And they eat six (sic!) cores per NVME
device. Apart from this never making it to computational storage
for thermal reasons, this is an insane cost.

In modern storage, bandwidth is usually limited by the network,
not the local devices: You can RAID your storage bandwidth until
you saturated the 100 GBit/s network, and then you are done.

IOPS are unlimited in the same way: You get not quite 1 million
IOPS per device, so if that is not sufficient, spread across
many.

The only remaining challenge in this 
[age of abundance in the data center]({% link _posts/2017-07-07-the-data-center-in-the-age-of-abundance.md %}) 
is commit (fsync) latency: how long to push things to a
persistent storage. Even that comes down a lot, with optane or
NVRAM in the client or as early as possible in the server.

Relatively low powered all-flash iSCSI appliances do routinely
250 micros commit latency, and things involving NVMEoF and RDMA
can come down to under 100 micros reliably, if you have the
coin. Want faster? Put Optane or NVRAM into each client.

And it is telling that the paper here talks about latency
improvements only in relative numbers ("30% less"), but never
actually speaks about absolute timings.

Maybe it is time to stop and think, and re-evaluate if this Ceph
thing is the smart thing to do with storage in the face of NVME,
Optane and NVRAM. Because the numbers look all wrong to me. Even
the units look wrong, actually.

[Conversations deeper in the Thread](https://twitter.com/antondollmaier/status/1151022173982724097):

There was were questions on what to use for low-latency
disaggregated storage and if one needed redundancy at all.

Examples of low-latency storage are software solutions from
[Lightbitslabs](http://lightbitslabs.com), from
[Datera](http://datera.com), and from
[Quobyte](http://quobyte.com). There are many more.

And funnily enough, if you talk to your inhouse customers, most
actually don't want any of this, because they talk to a database
(MySQL, Cassandra, Elastic, ...) and not to "storage" directly.

Then you speak to the MySQL people and they say "We have
replication and
[Orchestrator](https://github.com/github/orchestrator), even
masters are throwaway". You talk to the Cassandra team and they
laugh in Paxos. And so on. So most of these teams actually
prefer "RDMA to a NVME namespace" over storage software with
redundancy, and do resiliency higher up on the stack, in
application context.

As a storage team, you have to have some kind of low-latency
non-replicated solution first, because that's what is actually
the primary demand. You also need a lowish-latency, OLTP-capable
redundant solution (<500 microseconds is fine), but there is
only unscaled, low level demand.

And then there is huge demand for volume at any latency,
append-only preferred over rewriteable for many reasons. So S3
with heavy tiering. Ceph is actually pretty good at that, but
that is likely not NVME, but many large disk drives.
