---
layout: post
status: publish
published: true
title: A Journey to Open Compute
feature-img: assets/img/background/rijksmuseum.jpg
author-id: isotopp
date: '2018-02-21 09:55:07 +0100'
tags:
- data center
- energy
- erklaerbaer
- talk
- open compute
- lang_en
---
Yesterday, Booking.com hosted the Open Compute Meetup in
Amsterdam. My talk is on Slideshare and a recording is on
Youtube.

![](/uploads/2018/02/Screen-Shot-2018-02-21-at-09.54.18.png)

- [Slideshare: A journey to OCP](https://www.slideshare.net/isotopp/a-journey-to-ocp)
- [Youtube: A journey to OCP](https://www.youtube.com/watch?v=c0Z32UsB5g0)

A cleaned up and more coherent transcript of the talk is here:
![](/uploads/2018/02/ocp.003.jpeg)

Booking.com started out as a small online travel agency in
Amsterdam, but is now financially about 15% of Google. We have
about 200 offices in 70 countries, support 46 languages and
reach about any touristically interesting spot on this planet.

We started out selling rooms on a comission basis, but since the
Priceline Group of companies also includes Priceline for
flights, Rentalcars for, well rental cars, and Open Table for
restaurants, it makes sense to integrate that more and graduate
from a Hotel Room marketplace to something more complete, a full
trip or complete experience marketplace.

![](/uploads/2018/02/ocp.004.jpeg)

At this point we have about 30k machines in 3 locations. 

That's commodity colo space, built to Uptime Institute Tier-3
standards.

In that are mostly two-socket E5-type machines, and it's at the
two extreme ends of the spectrum, E5-2620's and E5-2690's. We
would like to be able to run on the 2620 stuff completely, of
course, but some parts of our application require the clock and
the Oomph of the large CPUs. We are working on that.

![](/uploads/2018/02/ocp.005-1.jpeg)

The part of the workload that actually earns us money is mostly
replacing strings taken from a database in HTML templates, we
are a REP MOVSB company. That's boring work, and that is good.

We try to keep stuff in memory where possible, especially where
customer facing machines are affected. No disk reads, and no
rotating storage in customer facing work.

There is more complicated stuff in the background. We are
running the usual big data stuff with added deep learning on
top, in image processing, fraud detection and in experimental
user interfaces. We host a large scale data movement
infrastructure with MySQL, Elasticsearch, Cassandra and Hadoop
being involved.

We are trying very hard to be customer centric. Technology is
seen as a necessity, but it's forced upon us by scale. We'd
rather focus on the hotel thing. :-)

A lot of stuff is recent, due to growth - Moore's law also
applies backwards. Speaking about growth:

![](/uploads/2018/02/ocp.006.jpeg)

There are a few old numbers taken from quarterly public company
performance reports, roomnights and hotels. But it could be
about any metric at Booking, servers, requests, people working
there, meals served in the canteen or sum of database requests -
you would see the same curve.

On a log-Y scale it's even nicer:

![](/uploads/2018/02/ocp.007.jpeg)

Some nice straight lines.If I were to draw the yearly increase
in compute power as given by Moores law into this graph, you
would see that this is also a mostly flat line, unfortunately
one that is raising far slower that the other lines here. 

For a scalability person like me it means a tough life.

![](/uploads/2018/02/ocp.008.jpeg)

Drawing the lines out naively sees us covering the earth in data
centers by 2040 or so. That's a problem, because where are we
going to put the hotels? 

Of course that's not going to happen, but it underlines that we
need to change our ways of handling stuff.

![](/uploads/2018/02/ocp.009.jpeg)

Currently, we are handling the hardware part "enterprise'y". So
we get space, build out the room, add racks, switches and
chassis and then put hardware in.

That happens in waves, with different latency and mutual
dependencies, and that can go wrong in many ways. On the other
hand, it delays decisions and spending as long as possible. To
us, being a very Dutch company with a very high volatility due
to the growth, delaying such Capex as long as possible is
attractive.

Once the Hardware is down, we are on top of things - we have a
system of software components called ServerDB which basically
enables full hardware lifecycle management, interfacing at the
front with the Purchase Orders database, doing everything a user
could want to do to a machine with API and Web Interfaces, and
finalizing machine lifetime many times later with a
decommissioning workflow. 

ServerDB not only manages the hardware, it also has complete
overview about all other assets, does the config management for
switches, storage, collects power data and temperature
information and links into monitoring, load balancer
configuration and to puppet.

![](/uploads/2018/02/ocp.010.jpeg)

Using commercial colo space means many constraints. We are in
small rooms, multiple 0.5MW sizes, and that creates a number of
placement constraints and unwanted cabling requirements. 

The power and cooling framework we have to live in is about
7kW/rack, which is about half of what we want. Look at the
image, that's a blade center that has the potential to create
6.4kW of power draw under full load, so you are looking at
non-oversubscribed racks that are 10/40U full. That's about knee
high.

![](/uploads/2018/02/ocp.011.jpeg)

Here is a test run of a single blade from that bladecenter,
where I am exercising all the cores as hard as possible,
recording the power draw. We reach 50% power draw at 6/56 cores
busy, and using the maximum power draw, times 16 blades, gives
me a total load of 6.4kW from the whole enclosure.

![](/uploads/2018/02/ocp.012.jpeg)

Similarly, here is a rack of 32 machines (actually 40, but I got
only 32 due to BMC instabilities), exercising at full power.
These are hadoop units, and I can get them to consume 15kW in a
7kW environment, hotspotting and oversubscribing hard. 

Some constraints border on the ridiculous, but when we are
receiving a monthly delivery in individual parts, we spam the
unloading and docking areas of the data center with unpacking
trash, making the other tenants quite angry. Also, the build
times are getting unwieldy. 

Finally, the BMC, which is our gateway into the machinery for
ServerDB and it's assorted tools, is a big problem.

![](/uploads/2018/02/ocp.013.jpeg)

ServerDB contains an abstraction layer that tries to hide the
various differences in functionality and API between the various
kinds of machinery we have. We could do without that just fine,
and Redfish is actually a partial fix to that. 

Despite the fact that we do not use many features, still
ServerDB utilizes Redfish, native vendor specific LOM
functionality and ssh to get what it needs - Power control,
Reset, and setting boot preferences, optionally firmware update
and optionally partitioning and controller setup.

We collect metrics: power, temperature, cooling and faults, but
that is purely read-only. Auditability is becoming more relevant
- making config changes without a visible interruption of
production is actually arguably a disadvantage, and all the
recents security problems all the way down the stack are
worrying us: BMC, ME and Microcode issues now.

Much of that is underdocumented, and there are way to many way
too convenient ways to access this, from dedicated interfaces to
shared interfaces to local gateways when you physically on the
machine and have access to i2c buses or similar. The defaults
are often insecure, the crypto is often outdated, and the client
requirements are often insecure as well ("Install a Java version
your security department will hate you for having on your
machine.").

So where do we got from here? What is required to graduate from
this?

![](/uploads/2018/02/ocp.014.jpeg)

Three issues need adressing: Going Rack Scale, Bringing volume
up and Getting Rooms to match. Let's look at each of these in
turn.

![](/uploads/2018/02/ocp.016.jpeg)

We started ordering hardware by the blade center chassis. That
did good: It solves many of the trash issues, it streamlines the
late provisioning phase where we are putting actual hardware
into the rack. It's limited by what can go into a chassis, and
the chassis we are using are going to be discontinued.

We understand why that is necessary, but the direction that is
going to is not what we want. We could do this more, and start
to order by the rack. That has a few requirements that I will be
adressing later, but if you are planning this, the choice is
basically between Intel Rack Scale Design derivatives or Open
Compute.

It gives you more design flexibility, and it may or may not
retain the savings in power and cooling from shared
power/cooling setup depending on what you do.

![](/uploads/2018/02/ocp.017.jpeg)

The Intel RSD solution is available in many vendor flavors, HP,
Dell and Supermicro all have them. It gives you a Pod and a Rack
controller not unlike a bladecenter chassis controller. On top
of the functionality that ServerDB already offers, you get a
chassis or rack-wide PCI bus, and composable hardware, where you
can build physical machine configurations from CPU and storage
modules in the rack.

Some companies like Dell even offer casings around the
machinery, in the form of semi-transportable data centers.
Unfortunately most of these solutions try to minimise space and
maximise density, so they come with other constraints and design
decisions that we are reluctant to take on - basically you have
to live in units of 8x8x40 ft shipping containers, and that's
rather limiting.

It's all nifty engineering, but all very vendor specific and
bespoke, when we are really looking for bulk hardware, all as
alike as possible, and with fewer features, not more. Having
_no_ _differentiator_ is actually a feature we are looking for.
Value add subtracts from the value from the value the machinery
has for us. The actual value add happens higher up the stack, in
software - in management for us that's ServerDB and in
production for us that is more or less Kubernetes or something
that does what K8s does, but differently.

![](/uploads/2018/02/ocp.018.jpeg)

And that's exactly the sales promise from Open Compute. Clean,
bare server designs without value add. Documented interfaces
with source code available to read up on the details, so we can
integrate our stuff without problems. Delivery by the rack, and
on top of that, potential operational and capital savings, if
you treat room and rack as a system.

![](/uploads/2018/02/ocp.019.jpeg)

Getting the volume up is the next important consideration, and
if we are looking at our machine park, that's going to be a
problem.

![](/uploads/2018/02/ocp.020.jpeg)

If you go into ServerDB and count machine profiles, it goes up
to 11: blade 9 and two additional blade2 variants. Actually
digging into this yields basically 'large and small' CPU configs
and memory configs, but lots of different local storage options.

![](/uploads/2018/02/ocp.021.jpeg)

The answer is, to quote Jello Biafra, obvious: Ban Everything!
In our case, local storage. So we disaggregate:

![](/uploads/2018/02/ocp.022.jpeg)

In a rack design where we give a 2 OU, 500 W, 100 GBit slot to
the storage people and provide un-RAID-ed 2 TB local SSD as the
only storage option, we have to build a network to match this.
We are anticipating more east-west traffic from storage
replication and east-west traffic from storage acess. All of
that is happening front-side, production, on regular TCP/IP.

But that means I have only one network topology to scale and
maintain, and I have no longer placement constraints for
workloads: I can build uniform compute, and demand "no local
persistence". If you wan to keep your MySQL datadir, put it on
iSCSI, RoCE or NVME via TCP and be done with it. It will be the
size and have the properties you require, it will be at least on
par with local SSD and it will still be there when your machine
dies and you are rescheduling to another spare machine elsewhere
in another rack.

With Kubernetes on top, you get application mobility,
resiliency, and capacity size adjustment, which is fine, because
even the smallest Silver 4110 is going to be too large for most
units of deployment (in Java, consider 8 cores, 16 GB of RAM to
be a limit, for example).

![](/uploads/2018/02/ocp.023.jpeg)

Being able to pull that off will give us 4 profiles or fewer,
disk made to measure as requested, location independence for
applications, and the ability to upgrade hardware without
interfering with the workload. I can evacuate a rack, do my
thing and put it back into service. Also, I can interchange the
components of my machinery independently: storage, memory,
compute and the networking parts are separate and can be on
different renewal cycles. All of that bound together by on
single TCP/IP network, not some bespoke PCI or FC/AL stuff.

![](/uploads/2018/02/ocp.024.jpeg)

Assuming I all have that, I will need rooms to match the rack in
order to fully leverage the advantages of Open Compute.

![](/uploads/2018/02/ocp.025.jpeg)

Open Compute hardware is built to be able to run in a barn:
concrete floor, air-in of up to 35 or 40 deg Centigrade,
hot-aisle containment, all service from the front because data
center operations engineers cannot survive in the hot aisle, and
we can do away with most of the equipment that is part of a
Tier-3 spec.

It is being said that 1 MW of Tier-3 spec costs about 10 million
for the empty building shell, and that we can get OCP space
built for 2.5 Million/MW according to Facebook. I will be happy
if I can get space for half of the Tier-3 cost or less.

Non of these savings will materialize if you put OCP into a
traditional Tier-3 building - the power path is not simplified,
the air-in is overcooled and the airco is overdesigned in order
to achive the overcooling which we do no longer require, so the
actual PUE is actually way worse than what we could have from an
OCP compliant data center.

![](/uploads/2018/02/ocp.026.jpeg)

We do get Tier-3 space easily, though. That is because it is
being built without a buyers name on the constract. Buyers and
sellers meet later, and that is possible over the Tier-3 spec
from Uptime.

The result is a two sided market, where demand and supply are
anonymous, unknown at the time the supply is being built.

That is not possible at the moment with Open Compute, because
the spec is lacking, not well known to builders and the demand
is not worth building for it. If you need or want OCP compliant
space, that's a larger commitment, because the space is being
built for you, and you will need to keep it for the building
lifetime.

![](/uploads/2018/02/ocp.027.jpeg)

So having an OCP compliant data center build spec for OCP
hardware is important to make OCP attractive to smaller
deployments. They do need the quick availability and higher
flexibility of prebuilt space, because that's lowering the
height of the commitment and provides fewer operative
distractions. There is risk for the space provider, so it's
certainly higher cost than a data center build to spec for one
named entity, but that's probably worth it. For a deployment our
size, there is still the problem of many 0.5MW rooms or similar,
capacity fragmentation, but for a more normal sized company
that's actually a non-issue. They can be happy in these spaces.

![](/uploads/2018/02/ocp.028.jpeg)

So to sum it up again: How can OCP work on non-hyperscaler
scales? Provide a two sided market for DC space over a shared
spec, then put hardware in there that matches what the room
provides. This creates operational and capital savings from
leveraging the room and the rack as a system that is mutually
dependent and built for each other.

Then, once you have stuff in there, have an ecosystem that uses
the documented machine interfaces, all of them interchangeable
and interoperable. Have an ecosystem of open source management
modules like ServerDB for management and Kubernetes for
production, built on top of that, in order to bring utilisation
up and management cost down.
