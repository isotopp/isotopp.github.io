---
layout: post
status: publish
published: true
title: '"Usage Patterns and the Economics of the Public Cloud"'
author-id: isotopp
feature-img: assets/img/background/rijksmuseum.jpg
date: '2017-06-12 16:00:10 +0200'
tags:
- computer
- performance
- container
---
The paper ([PDF](http://vita.mcafee.cc/PDF/EconPublicCloud.pdf))
is, to say it in the words of Sascha Konietzko, [eine
ausgesprochene Verbindung von Schlau und
Dumm](https://www.youtube.com/watch?v=hVgBp5Yu7_w,) ("a very
special combination of smart and stupid").

The site mcafee.cc is not related to the corporation of the same
name, but the site of one of the authors, R. Preston McAfee. 

The paper looks at the utilization data from a number of public
clouds, and tries to apply some dynamic price finding logic to
it. The authors are surprised by the level of stability in the
cloud purchase and actual usage, and try to hypothesize why is
is the case. They claim that a more dynamic price finding model
might help to improve yield and utilization at the same time
(but in the conclusion discover why in reality that has not
happened).

Being AI people with not much Ops experience, they make a number
of weird assumptions. For example, they are looking at CPU usage
data in 5 min aggregation buckets and do math against 100% CPU
utilization. Even if you assume at all or most workloads are
actually CPU bound, 5 minute buckets of CPU usage are way to
coarse to use for 100% as a utilization target. That is, because
all the actual spikes are shorter and invisible. (Workloads are
rarely CPU bound, and especially not in the cloud, which is most
often network bound.) (They do look at 5 min bucket maxima =
100th percentiles in some cases. But even that does not tell you
for how long in a 5 min bucket you hit the roof. But hitting the
roof even for a short time creates latency outliers, which in an
actual cloud native microservice framework propagate and
multiply, turning most of the requests into SLO violations.
Jitter kills).

They are also for the most part ignore the cost of the cognitive
load of dynamic pricing, or the cost of coding for variable
deployment sizes in traditional workloads.

Finally, they are looking at a VM based IaaS deployment. VM
based deployments are likely to see traditional bare metal
workloads being forklifted into the cloud. Such deployments do
not scale, because they weren't built for dynamic scaling.
Cloud Native stuff is more likely to be found in environments
such as Amazon Lambda and Athena. This is a lot like looking at
the childrens pool only and coming to the conclusion that most
people can't swim, i.e. there may be selection bias.

There are useful thoughts in the paper, too. For example, they
find that they can model and predict many workloads and use this
for scaling in advance. In fact, typical reactive autoscalers do
not work properly, because by the time they trigger a scaling
action, demand is already there and latencies lag in violation
of the SLO. The systems created as a reaction to a reactive
autoscaler triggering are slow, because caches are cold, and
will have trouble keeping up, right in the middle of a spike
action.

Predictive scalers work better and may be safer. Here you
establish an absolute size limit (which usually exists due to
architectural constraints and locks on shared state), and size
down from it to meet predicted demand with a comfortable margin
of error. Then you scale up and down following predicted demand,
correcting the model in time to keep the margin. This should
create capacity in advance, and give it time to warm up.

Also, reading the paper you could come to the conclusion that
the market is stable and static, because it is stable and
static: Because nobody rocks the demand pressure up and down,
the prices are stable and nobody has a reason to implement
savings by changing the size of the deployment needlessly.

Of course, once a sufficient number of people start doing this,
demand pressure will vary sufficiently to affect short term
pricing, so that everybody eventually needs to react to the
changed environmental conditions. Noise breeding complexity,
breeding even more noise and complexity, until everything drowns
in chaos and the system needs downtime to clean the noise from
the system.

TL;DR: Bunch of objectivist hipsters with belief in market
forces and no Ops experience discover in the final paragraphs of
their paper that stability and simplicity are tangible,
priceable assets in themselves and maybe all the dynamic market
shit is not really helpful in all cases, because stability
savings outweigh wins from leveraging dynamic market forces.
