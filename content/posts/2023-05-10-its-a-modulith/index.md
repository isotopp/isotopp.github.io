---
author: isotopp
title: "It's a Modulith"
date: "2023-05-10T01:02:03Z"
feature-img: assets/img/background/rijksmuseum.jpg
tags:
  - lang_en
  - architektur
  - computer
  - software
aliases:
  - /2023/05/10/its-a-modulith.html
---

"Computers are simple" is what I am telling people I train.
"There are only Zeroes and Ones, and it is not getting much more complicated."

"But computers are hard", they respond.

"That is correct.
In computer systems, complexity is almost never in the individual layers, but it comes from the width and breadth of the stack.
It's in the interactions of the components that we are putting together."

When you start with how a CPU is being built, and then put the layers of the stack on top of each other until you end up with a classical single-process application, in some object-oriented language, with a GUI – that's around two to three dozen layers of abstractions piled on top of each other. 
Things that one could learn the internals of, and how they interact.
But that's only local, without network stacks, communication protocols, proxies, and without the peculiarities of distributed systems, which open up the same exercise, again, only across, not down.

There is a lot to be said about computer science as a science, because anything that complicated is working at all. 
All the interfaces, encapsulations, and abstractions are obviously good for *something* – as long as they don't leak.
When they do leak, things get weird, fast:
One is making a small change somewhere in the stack, an epsilon,
and somewhere else something acts up, non-linearly, and does a giant delta, and everybody is having a very sad day.

So if developers prefer to sit in enclosed offices, without a phone, and with soundproof headphones, 
that is because work on such systems is mostly to unfold the stack in your mind,
and to anticipate what will happen on all the other layers when you write a line of code.

# The Amazon Prime Video team publishes a paper

With this as a background, one can now read "[Scaling up the Prime Video audio/video monitoring service and reducing costs by 90%](https://www.primevideotech.com/video-streaming/scaling-up-the-prime-video-audio-video-monitoring-service-and-reducing-costs-by-90)",
a writeup published by the Amazon Prime Video Streaming Team.
They have implemented a functionality which probes frames from the video stream sent to customers, applies tests and recognizes certain artefacts that impair quality,
so that they can be corrected.

Amazon being Amazon, they have implemented that as a pile of microservices that interact in an event-driven architecture with lambdas and step functions,
in order to shovel data from one S3 bucket into another, running the required analytics on the way.
Notification about things found are being put on SNS.

That works as expected: The project was done exploratory, as a proof-of-concept, and they were able to show that it does what was requested.

Scaling up, they then found that the distribution of components was suboptimal:
Lambdas and step functions are not good elements for batch processing video frames with ML detectors, because they have never been designed for this.
They are good components for web applications.

Also, it turns out that S3 is not a good storage and communication mechanism for fast and very temporary IPC,
because a web storage with low cost is optimized for low transaction rates, and it targets consumers that can tolerate high latency.

The article then presents a solution, which was to put all these things into a single container that are tightly coupled,
and put them into ECS.
Because the components are now within a single container, and hence on the same box, sharing the same memory, 
they now can exchange video frames via shared memory instead of pushing them through http and TLS over the network.
Similarly, the lambdas and step function somewhere out on the network are now local procedure calls, or at least local RPC.

Obviously, that eliminates a lot of communication latencies because the high-rpm part of the distributed system is now a single local application.

# What was learned

The surprising part, according to the team, was that this was a mostly painless process that required only minor code changes.

> Conceptually, the high-level architecture remained the same.
> We still have exactly the same components as we had in the initial design (media conversion, detectors, or orchestration).
> This allowed us to reuse a lot of code and quickly migrate to a new architecture.

they summarize.

And that is maybe the takeaway from this article:
In a cleanly architected and properly encapsulated system, the components can be redistributed and rearranged with only minor code changes.
We can change the layout of the system without having to start over.
The architecture was not really changed, but mostly the components' deployment was rearranged.

# Modulith

![2023/05/modulith-microservices.jpg](modulith-microservices.jpg)
*A modulithic deployment of co-located microservices allows for easy scaling and rearrangement.*

Unfortunately, the subtitle of the article is
"The move from a distributed microservices architecture to a monolith application helped achieve higher scale, resilience, and reduce costs".
This sets wrong expectations and makes it harder to pick up the actual learning.

What the AWS Prime Video team arrived at is most closely described as a
[Modulith](https://www.informatik-aktuell.de/entwicklung/methoden/modulith-first-der-angemessene-weg-zu-microservices.html),
only that they arrived at it the other way around.
Fowler suggests you start
[Monolith first](https://martinfowler.com/bliki/MonolithFirst.html)
and then chisel off the components you identify as standalone subservices.
They instead used pre-made AWS infrastructure components to build a highly modular prototype,
and then identified tightly coupled components and merged their deployment without giving up the modular structure.
Fowler himself points to 
[an article by Sam Newman](https://samnewman.io/blog/2015/04/07/microservices-for-greenfield/)
and the book that came from it as a way of doing this.

The result is not really a single-instance monolith, anyway.
Components are merged into a single ECS container, but of course ECS will deploy it with the required degree of parallelism,
and it is still part of a larger system that communicates in an event-driven architecture using lambdas and messages.

So if this article is anything, it is an example of the benefits good observability has,
and how a good architecture allows you to rearrange the layout of well-isolated and structured components with clean interfaces at will.
The application can be made to run on different substrates, in order to react to different demands of scale or changing business requirements.

Or in other words, people who understand how their stuff works have few problems to adjust their application to changing requirements.
