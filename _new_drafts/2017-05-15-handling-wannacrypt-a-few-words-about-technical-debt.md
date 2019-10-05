---
layout: post
status: publish
published: true
title: Handling Wannacrypt - a few words about technical debt
author: isotopp
author_login: kris
author_email: kristian.koehntopp@gmail.com
wordpress_id: 1726
wordpress_url: http://blog.koehntopp.info/?p=1726
date: '2017-05-15 10:19:24 +0200'
date_gmt: '2017-05-15 09:19:24 +0200'
categories:
- Computer Science
- Politik
- Erklärbär
- Neuland
tags: []
---
<p>So Microsoft had a bug in their systems. Many of their sytems. For many years. That happens. People write code. These people write bugs Microsoft&nbsp;over the years has become decently good with&nbsp;fixing bugs and rolling out upgrades, quickly. That's apparently important, because we all are not good enough at not writing bugs. So if we cannot prevent them, we need to be able to fix them and then bring these fixes to the people. All of them. The NSA found a bug. They called it [ETERNALBLUE](https://en.wikipedia.org/wiki/EternalBlue)&nbsp;and they have been using it for many years to compromise systems. In order to be able to continue doing that they kept the bug secret. That did not work. The bug is now [MS17-010](https://technet.microsoft.com/en-us/library/security/ms17-010.aspx)&nbsp;or a [whole list](https://www.rapid7.com/db/modules/auxiliary/scanner/smb/smb_ms17_010) of CVE-entries. The NSA told MS about the bug when they learned that it had leaked, but not before. Microsoft patched the bug in March 2017, even for systems as old as Windows XP (which lost all support in 2014), but many people did not install the patch. The result is "the largest cyberattack in the world". <!--more--> Dave Lewis [tweeted](https://twitter.com/isotopp/status/863998739261923332):</p>
<p>> I get that some systems can't be patched for various reasons. What I can't fathom is why those same systems might be exposed to the Internet.</p>
<p>Well, here is the thing: It is 2017. Every system is somehow exposed to the Internet. Often that happens indirectly or unintentionally, but it always happens. There is no such thing as an isolated network any more, ever, anywhere.</p>
<p>Maybe you think there is, but that only means that you haven't found the connection, yet. But everything, even those embedded systems, especially these embedded systems, need to somehow report stuff, be monitored, or otherwise connect to other systems to be useful.</p>
<p>System integration has become so tight that you simply cannot afford to have an isolated system. If you had one, you would be losing business opportunities that are more valuable than the cost of managing network security.</p>
<p>That means you need to defend each and every endpoint, of course, which is only possible if you beef up these endpoints with enough CPU, power and cooling that they can actually spend the energy to defend, and then keep their software up to date.</p>
<p>That of course conflicts with the concept of validated, certified and unchangeable systems.&nbsp;And with the concept&nbsp;of sell once, and be rid of it for the coming 30 years. So both these things still exist in the minds of managers and product designers from the last millenium, but not really any more in the universe of 2017.</p>
<p>If you are one of these pre-millenial types, you haven't been paying attention. You have missed Tesla, which pretty spectacularly updates a whole fleet of embedded mobile devices in the field, after sale, and managed to turn this into an actual feature that customers love, creating a much tighter bond between maker and customer than would be possible without it. Tesla now even rolls out hardware in advance, without the software actually being able to make best use (or any use at all) of the hardware, and then later incrementally upgrades the software leveraging the spare hardware, compute and memory in the devices.</p>
<p>You also misses things such as Patch Tuesday, a thing that Microsoft came up with to turn system changes into a recurring operational event instead of a migration project.</p>
<p>This is a key concept. When there is a new version, that new version needs to actually get out into the field, to all systems, within a pre-determined time. You get to choose that time, within limits, but it needs to be counted in days. 20 work days (1 month) is a good target for a beginner.</p>
<p>As KPIs go, you probably need to _build process and infrastructure to get out any pre-determined version of anything to at least 95% of your complete fleet within 20 workdays as part of normal operations without a special migration project._</p>
<p>If do not have that, it means that old versions of things accumulate. That is a very real problem not only in the case of MS17-010, but also in many other ways.</p>
<p>Whenever things manifest as "We can't do that, because \<_something old gets in the way_\>", that is technical debt. It means that your technical infrastructure ossified and tactical and strategical decisions are being made on the ground of technical limitations instead of actual tactical and strategical needs. Constraints are being accumulated in your systems, until you can't move any more when you must, and the system breaks down.</p>
<p>You can put numbers to&nbsp;that, and counts of broken systems, broken processes, lost business opportunities and lost partners and customers because of a lack of trust into the security of your systems, because of a lack of trust into your ability to actually manage the problem or a lack of trust into your ability to maintain such a thing on a long term perspective.</p>
<p>The TODO list for management,&nbsp;one more time:</p>
<p>> Key ability: to be able to make changes to the entirety of the fleet of devices in the field, within a hard time limit, counted in days, as part of a normal operational procedure.<br />
><br />
> Key ability: to actually be able to get changes from the upstream vendors of all software components that are part of the build, for the planned lifetime of the product.</p>
<p>Now look around. These ticket vending machines and arrival displays in train stations, the ATMs next to it, the control software for the escalators and elevators, the control systems for the building electricity, traffic lights, and the cars engines, … And the smart phones in the pockets of all the people around you.</p>
<p>And not a few of these systems have planned lifetimes of decades.</p>
<p>The NSA policy of keeping this kind of bugs secret instead of working to the goal of making all computers more secure can also be translated into numbers. In this case numbers representing losses and &nbsp;gains. However, the losses accrued in this single incident are potentially already larger than the wins made by using ETERNALBLUE. But they are not the NSA's losses. Maybe the incentives here are not completely aligned and need checking.</p>
<p>(based on my Tweetstorm starting [here](https://twitter.com/gattaca/status/863959534854955008))</p>
