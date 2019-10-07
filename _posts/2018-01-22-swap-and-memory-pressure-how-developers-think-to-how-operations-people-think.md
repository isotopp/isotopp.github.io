---
layout: post
status: publish
published: true
title: 'Swap and Memory Pressure: How Developers think to how Operations people think'
author-id: isotopp
feature-img: assets/img/background/rijksmuseum.jpg
date: '2018-01-22 10:41:59 +0100'
tags:
- data center
- container
- lang_en
---
There is a very useful and interesting article by Chris Down: 
"[In defence of swap: common misconceptions](https://chrisdown.name/2018/01/02/in-defence-of-swap.html)".

Chris explains what Swap is, and how it provides a backing store of
anonymous pages as opposed to the actual code files, which provide backing
store for file based pages. I have no problem with the information and
background knowledge he provides. This is correct and useful stuff, and I
even learned a thing about what cgroups can do for me.

I do have a problem with some attitudes here. They are coming from a
developers or desktop perspective, and they are not useful in a data center.
At least not in mine. :-) 

Chris writes:

> Swap is primarily a mechanism for equality of reclamation, not for
> emergency “extra memory”. Swap is not what makes your application slow –
> entering overall memory contention is what makes your application slow.

And that is correct.

The conclusions are wrong, though. In a data center production environment
that does not suck, I do not want to be in this situation. 

I see it this way:
> If I am ever getting into this situation, I want a failure, I want it fast
> and I want it to be noticeable, so that I can act on it and change the
> situation so that it never occurs again.

That is, I do not want to survive. I want this box to explode, others to
take over and fix the root cause. So the entire section »Under temporary
spikes in memory usage« is a DO NOT WANT scenario.

Chris also assumes a few weird things, from a production POV: He already
states that 
> If you have a bunch of disk space and a recent (4.0+) kernel, more swap is
> almost always better than less. In older kernels kswapd, one of the kernel
> processes responsible for managing swap, was historically very overeager
> to swap out memory aggressively the more swap you had.
and production sadly is in many places still on pre-4.0 kernels, so don't
have large swap.

He also mentions 
> As such, if you have the space, having a swap size of a few GB keeps your
> options open on modern kernels. […] What I’d recommend is setting up a few
> testing systems with 2-3GB of swap or more, and monitoring what happens
> over the course of a week or so under varying (memory) load conditions.

Well, I have production boxes with 48 GB, 96 GB or even 192GB of memory. "A
few GB of swap" aren't going to cut this. These are not desktops or laptops.
Dumping or loading, or swapping 200GB of core take approximately 15 minutes
on a local SSD, and twice that time on a rotating disk, though, so I am not
going to work with very large swaps, because they can only be slower than
this. I simply cannot afford critical memory pressure spikes on such a box,
and as an Ops person, I configure my machines to not have them, and if they
happen, to blow up as fast as possible.

What I also would want is better metrics for memory pressure, or just the
amount of anon pages in the system. 

> Determination of memory pressure is somewhat difficult using traditional
> Linux memory counters, though. We have some things which seem somewhat
> related, but are merely tangential – memory usage, page scans, etc – and
> from these metrics alone it’s very hard to tell an efficient memory
> configuration from one that’s trending towards memory contention.

I agree on this. I wonder if there is a fast and lock free metric that I can
read that tells me the amount of unbacked, anon pages per process and for
the whole system? One that I can sample in rapid succession without locking
up or freezing a system that has 200GB of memory in 4 KB pages (the metric
can be approximate, but reading it must not lock up the box).

I think the main difference Chris and I seem to have on fault handling - I'd
rather have this box die fast and with a clear reason than for it trying to
eventually pull through and mess with my overall performance while it tries
to do that.
