---
author: isotopp
title: "Support as a public performance"
date: "2024-04-17T05:06:07Z"
feature-img: assets/img/background/rijksmuseum.jpg
toc: true
tags:
- lang_en
- erklaerbaer
- work
aliases:
  - /2024/04/17/support-as-a-public-performance.html
---

Support has been working in Slack for years.

There's a `#java` channel where people can join and ask, a `#dba` channel and a `#k8s` channel, and there is of course `#live`.
Each has a small four digit number of people attending, with `#live` not quite reaching five digits.

Some pretty old and clueful people sit in these channels.
Often they just watch the questions scroll by.
But sometimes one of the Great Old Ones stirs in their slumber and raises to the surface,
stretching tentacles and grabbing a question or a support case that looks interesting or weird.

The Great Old Ones love their shinies.

Management is annoyed by this arrangement.
They love their Jira, because Jira actually quantifies support, you know.
It makes tracking KPIs so much easier,
and then we can see if we managed to fulfill our critical TTR OKR for Q423 or not, instantly.

Unfortunately, the company does not earn money with bringing down the TTR OKR for support in any quarter at all.

Moving the support from Slack to Jira 
has turned a public interactive performance and discussion of operations and operational problems 
into a set of highly permissioned 1:1 interactions and carefully tracked escalations.
They have carefully assigned priorities and have tracked resolution times.

The Great Old Ones are blindsided now, because no one,
not even they with their unnatural ancient power beyond what is allowed for mere mortals,
can read Jira horizontally across all tickets.
And if they did, and rose and grabbed a ticket, maybe that ticket is resolved.
But all the others would not have seen this spectacle of noneuclidic debugging 
and knowledge about systems from before the dawn of time,
nor would they have been able to learn from this.

Probably for good,
because people have been known to go insane from just reading the deploy scripts that drive these systems.
And let's not even speak about the abominations that these C++ JNI methods actually hold.
As a mere Java coder you will never know,
and you should be thankful for that and every second of your life that you do not know about this.

Anyway.

In Slack questions often triggered +1's. Somebody asks about a problem,
and others would chime in "That was me!", "I am having the same problem,
it's company wide" or "We know this, and for us this workaround is helpful".

Moving support from Slack to Jira cut that off.

[![](2024/04/support-01.png)](https://en.wikipedia.org/wiki/Capability_Maturity_Model_Integration)

*Is that bad?
No, this was not a mature process, it was individual heroics, a 0 or 1 on the
[process maturity scale](https://en.wikipedia.org/wiki/Capability_Maturity_Model_Integration).*

These days, the ticket correlation process corp set up would find the same correlations,
reliably and with a maturity of 5
(quantifiably tracked and continuously improved).
Often, it takes only 4-8 weeks to get the same information as before with the immature process.
And on top,
it is now orderly documented and traceable as a KPI instead of happening coincidentally when the problem was current.

Also, the company now has architecture review boards,
and a tech radar that manages these kinds of things pretty successfully.

A bunch of MBAs has been promoted on this.

This is how process and civilization work.
