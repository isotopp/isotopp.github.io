---
author: isotopp
title: What has Kubernetes ever done for us?
date: "2019-04-25T13:28:48Z"
feature-img: assets/img/background/rijksmuseum.jpg
tags:
- pluspora_import
- lang_en
- cloud
aliases:
  - /2019/04/25/what-has-kubernetes-ever-done-for-us.html
---

# Kubernetes and Complexity

On Twitter, [Sandeep](https://twitter.com/crcsmnky/status/1120189000474681347) remarked:
> The complexity and amount of code involved is staggering.
> I'm not sure how we can possibly justify the Kubernetes, Istio, Docker, Envoy, Prometheus, Grafana, Jaeger, Kiali, Helm stack.
>
> What problem are we solving that were not solving 15 years ago, again?
> How much time and effort are being saved (by organisations smaller than Google)?

One reply was:
> "The amount of code is staggering.
> I'm not sure how we can justify the Linux, dpkg, HAProxy, Nagios, Check_MK, puppet, supervisor, apt stack."

Unlike other systems that try to solve similar problems, Kubernetes - at least in the past - has been driven by users that had a problem to solve, and not by gaggle of 400 vendors which think that it improves the flavour when they are pissing into a repo.
Unlike these other systems, Kubernetes actually works and scales, with no added or proprietary components, if you take the public repo, build and deploy it.
So that is still a lot of complexity, but at least it accomplishes something.

# What problem are we solving that we were not solving 2004?

In 2004, we were running bare metal with maybe puppet, but more likely cfengine or even manual ssh execution running shell scripts out of a NFS file-share.
And were monitoring with Nagios.

The progress is obvious, but let us list it:

Today we are living in an age of abundance in the data center.
In our data centers we have machines with at least 32 threads per machine, many have much higher number.
Three digit GB of memory are standard.
IOPS are not a problem with SSD.
And multi-tiered leaf-and-spine L3 networks create fabrics that can connect any CPU in any machine to any disk in any other machine in the same data center, at nominal media speed and with minuscule latency added from the mesh, as long as we can do cut-through switching.

That is, if we planned our data center right, we are having [The Data Center as a Computer](https://ai.google/research/pubs/pub41606).
A uniform collection of threads with memory, a network as a connecting mesh and sufficient storage in capacity and IOPS somewhere within the same mesh.

From this hardware substrate we can build clusters of Kubernetes, K8s.
The K8s is basically "init for a network of machines", a system that accepts declarative instructions of how to mesh a set of images of software into a network and a service.
It then schedules resources from our substrate, and pushes the images onto that.

Because the images are self-contained and immutable, once they complete running, we can remove them from their respective machines and receive the original hosts back in original state.
Because the images are self-contained and immutable, they can be scheduled on any node that has sufficient free capacity, specifics no longer matter.
State is isolated and specially managed, K8s provides concepts for that, stateful sets and operators.

This allows hardware operators to provide capacity without caring much about the users, the devs and their apps running on the clusters.
Conversely, it allows devs and apps to work with hardware using an API instead of people and tickets.
Hardware and Data Center operations become a completely autonomous commodity.

Which we call "The Cloud".

For devs and their apps, Istio and Envoy provide an interface to interconnect images to allow them to communicate.
These systems also provide routing, balancing, authentication, enforce TLS, provide backoff and fault tolerance and collect metrics in a standardised way.
And in a way that is invisible and inescapable to the people that write the application.

All these properties of the communication become an [Aspect](https://en.wikipedia.org/wiki/Aspect_(computer_programming)), taken out of the codebase, and the scope of the application programmer.
They just are, whether the developer cares or knows about these things or not.

Similarly, Prometheus and the surrounding ideology have a story about what to collect (ie [USE and RED](https://www.vividcortex.com/blog/monitoring-and-observability-with-use-and-red), and follow @mipsytipsy on Twitter for a lot of insight). 
We are getting best practice around this, and it is being wrapped into an Aspect again.

Look back 15 years - systems like Nagios and Graphite are extremely host centric.
This does no longer work in the new operational model.
We do no longer care about hosts at all, we care about capacity (let's have more than we strictly need), and about churn (we have capacity, but there is a high death-and-reprovisioning rate and that is suspect, so we alert).
Nagios-era systems are not equipped to deal with environments like this at all.

Tracing and Debugging are evolving and adapting in a similar way.
Jaeger, sysdig and similar systems help you to debug problems in collections of microservices that are running in multiple instances across an arbitrary number of hosts somewhere in a much larger cluster of machines.
They give you capability to follow requests up and down the stack where components are not bound to specific hosts.
And they give you capability to view the flow of a request through services from a logical point of view without actually accessing individual physical hosts (or caring about these hosts at all.

There is any number of benefits from this change, this decoupling of deployments from specific instances of compute:

- Immutability makes it possible to reason about production and production state.
- Workloads can migrate (actually respawn) within a cluster as the need and the load changes.
- Deployments become a swift automated operational procedure.
- Interfaces to standard Aspects of operations (deployment, upgrade, monitoring, interconnection, cluster membership, shared state management) become standardised and become interchangeable.

We get codified (literally, as code) best practice.

So what problem are we solving that we were not solving 15 years ago?
Well, feel free to place my rant as a soundtrack on top of [Monty Python](https://www.youtube.com/watch?v=uvPbj9NX0zc).

Yes, there is complexity. 
You need to learn Go, JS and Python as a solid foundation to be able to play.
You need to understand the distributed computing and security basics necessary in order to play in this arena.
And that is quite a large piece.
On the other hand, "The amount of code is staggering.
I'm not sure how we can justify the Linux, dpkg, HAProxy, Nagios, Check_MK, puppet, supervisor, apt stack."« as written elsewhere in this thread.

From the K8s setup, you get a much higher average architectural quality by comparison.
That is in no small part because of the way K8s is opinionated about how to handle and deliver things.
It is also in the delivery, in the way of Aspects, wrappers around your stuff that provide functionality for operations, in a way that you do not even see when coding your stuff.
You are getting sane defaults in a way that is mostly agnostic to what you care about.

This is an important decoupling in multiple dimensions, making everybody's job easier and enabling them to deliver more and better quality with less work.

Yes, this is relatively new, but you can see how good and well-thought-out it is.
There is a reason the K8s ecosystem owned everybody else in less than 3 years time, and this is why.
