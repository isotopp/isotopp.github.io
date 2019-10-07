---
layout: post
status: publish
published: true
title: Rolling out patches and changes, often and fast
author-id: isotopp
feature-img: assets/img/background/rijksmuseum.jpg
date: '2017-05-18 10:44:13 +0200'
tags:
- computer
- work
- erklaerbaer
---

Fefe had a [short pointer](https://blog.fefe.de/?ts=a7e82d0e) to an article
[Patching is Hard](https://www.cs.columbia.edu/~smb/blog/2017-05/2017-05-12.html). 
It is, but you can make it a lot easier by doing a few things right. I did s small
writeup ([in German](https://blog.fefe.de/?ts=a7e262f4)) to explain this,
which Fefe posted. 

I do have an older talk on this, titled "8 rollouts a day" (more like
30 these days). There are
[slides](https://www.slideshare.net/isotopp/8-rollouts-a-day) and a
[recording](https://www.youtube.com/watch?v=rzU1UtUpyTI). The Devops talk
"Go away or I will replace you with a little shell script" addresses it,
too, but from a different angle
([slides](https://www.slideshare.net/isotopp/go-away-of-i-will-replace-you-with-a-little-shell-script-english),
[recording](https://www.youtube.com/watch?v=e0CCv7pSK4s)). 

Here is the english version of my writeup.

The [Patching is Hard](https://www.cs.columbia.edu/~smb/blog/2017-05/2017-05-12.html) article
says:
> Patching is hard? Yes—and every major tech player, no matter
> how sophisticated they are, has had catastrophic failures when
> they tried to change something. Google once bricked
> Chromebooks with an update. A Facebook configuration change
> took the site offline for 2.5 hours. Microsoft ruined network
> configuration and partially bricked some computers; even their
> newest patch isn't trouble-free. An iOS update from Apple
> bricked some iPad Pros. Even Amazon knocked AWS off the air.

Where I am working we made the same observation. 100% uptime is
impossible, but management needs metrics and controls to
understand if we are still on the right track. We do have an
outage budget. That means we are measuring the actual current
business and compare with the predicted business. If a failed
rollout creates a loss of (potential) income, we can tell how
much that is and deduct that from the outage budget. We are
trying to make the budget as precisely as possible. That does
not mean we are trying to create outages on purpose, but having
fewer outages than the budget allows may mean that we are not
moving fast enough and have become complacent in what we are
doing.

Rolling out often is useful, because then change sets are small
and easy to check, much easier than large and hard to understand
changes. So we do need to roll out often in order to maintain
speed. Rollout problems tend to manifest in subsystems where we
do not roll out often enough. Usually secondary changes, changes
in dependencies and libraries, accumulate and then the rollout
fails. The solution is to roll out even if the code did not
change (that is, we roll out for the sake of keeping
dependencies current).

This is a very tangible form of representing technical debt: 

- the larger the diff between production and trunk is, the more
  likely moving trunk to production is going to result in a
  failure.
- To make patching safe you have to do it often.
- To be able to patch often, you need to make patching and
  rolling out an operative process and not an upgrade/migration
  project.
- To make rollouts and operative thing it is useful to
  make testing in production safe and survivable. 
- To be able to test in production, the following things are
  useful:
  - have at most two versions of a change to a certain system.
    Do not do three phase or multiphase rollouts. Finish one
    change before you do the next one.
  - have overcapacity. A change might make it necessary to
    provide more machinery or more computer power or more memory
    for a short time. You need to have that or be able to
    provision this on short notice. Being efficient means having
    no reserves, no elasticity.
  - separation of code distribution and code activation. That means feature
    flags and experiments in your code. The same rollout must be
    able to switch at runtime between old and new behavior.
  - changes to persistent data structures require that you update both
    versions of the structure concurrently in order for old and
    new code to be able to co-exist.
  - you need to know what is going on. Have a good monitoring, central log
    collection, good search on all of that. There is a thing
    called monitoring lag, the distance in time between a thing
    happening and the time you will see this in your monitoring.
    Measure that lag and have it shown on each screen. Alert on
    monitoring lag.
  - have a culture of failure that focuses on improvement and
    learnings. Check out the search term "blameless postmortem"
    and read up on this.

It's not actually rocket science, but it will make things a lot better
around you.

> Stört euch bitte nicht an dem Denglisch, das ist in der Ops-Abteilung von
> internationalen Firmen durchaus normal :-)

Indeed. The office is in Amsterdam, and the language at work is English.
When I am thinking about work, I am doing it in English. Writing about work
in German means that I will use a lot of english terms for the things I am
trying to describe, because I'd have to search for appropriate German terms
and concepts first and that would interrupt the flow. Sorry about that.
