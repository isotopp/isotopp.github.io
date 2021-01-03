---
layout: post
title:  'Go away, or I will replace you with a very small shell script'
author-id: isotopp
feature-img: assets/img/background/rijksmuseum.jpg
date: 2015-03-27 09:12:22 +0100
tags:
- lang_en
- devops
- talk
---

This is the writeup for the english variant of the talk "Go away or I will replace you with a very small Shell script". The original version of the talk was given in German at [GUUG FFG 2015](https://guug.de/veranstaltungen/ffg2015/abstracts.html#3_1_1) in Stuttgart. [A recorded version in german language](https://www.youtube.com/watch?v=e0CCv7pSK4s) has been made at Froscon in August 2015.

![](/uploads/2015/03/devops-en.001.jpg)

*Go Away Or I Will Replace You With A Very Small Shell Script or There Is No Such Thing As A Devops Team*

I came up with this talk, because I was invited to the GUUG FFG with the ask "to give some thoughts about Devops". I ended up with something that in some way is a reflection about what changed in how we do computers, between approximately the years 2000 and 2010.


![](/uploads/2015/03/devops-en.005.jpg)

At Devops.com, Rajat Bhargava tries to explain in [DevOps and Enterprises: It's a culture thing](https://devops.com/devops_and-enterprises/) that

> DevOps is about increasing company performance through better IT execution. The hypothesis is that by more closely aligning what cus with what gets built in a more timely fashion, organizations will sell more products and services. That’s not a small company or SMB issue, that’s an every company issue.

In general, change in companies does not happen by itself - companies by construction try to repeatedly execute the same thing with the same results over and over. Change only happens because of outside pressures. So if companies change the way they do IT to "increase company performance through better IT execution", there are outside influences at work that exert pressure on the processes, forcing change.

Let's look at these outside influences.

## Maturity of Market and Process, and Growth matters

![](/uploads/2015/03/devops-en.012.jpg)

*A maturing environment (left hand side) allowed the development and establishment of quantitatively governed processes. After reaching a certain process maturity level (right hand side), outsourcing of processes in full or in part becomes possible, enabling a make-or-buy decision at the management level.*

The Cynefin model is a soft thing, a model or frame of mind that is used by people to have words and categories to express what tools and project structures make sense in a given context: It can be used to classify "decision making contexts". A decision making context is for example a market in which a company is going to act, and then it would become a way to express "market maturity".

If you apply it to "the development of the early Internet" or "the Dotcom bubble before 2000", then you see the very early Dotcom bubble as "Nobody has a clue how to even make money on the Internet, much less how to structure a company around this idea". This is the Chaotic domain, subject of the "Research" model, in which you try out things, and see what sticks. You do not know the rules at all, not even if they are static or changing. You need to get any structure at all. The work model is "Act" - try a thing, "Sense" - see what happens and "Respond" - discard the attempt or if it works, try to modify it and see what changes. With "Novel" practice you work with very small teams of highly qualified people - a research team - and try to establish and formulate some ground rules. You expect to lose money and to throw away many experiments, quickly.

Once you have found a working business model, and successfully extract any money at all, you can switch to the "Complex" domain and build on your emergent practice. You secure the position you have found and try out small things, instead of wild guesses all over the place. Again, you try to register what that does to your business and improve (instead of trying something else entirely). Basically you have the business model and now try to build practice at all. You try to move things from Research to Engineering. This also changes team structure - you would work with your Researchers moving to Lead positions with a bunch of applied sciences or engineering grade people working for them. This is now multiple small teams at work, on different aspects of incremental improvement. You focus on iteration, small improvements and may experiment with some basic automation. In the Complex you know there are rules, but they may be not easily discoverable, and they may be changing and stateful.

As the market and the business matures, it may move to the "Complicated" domain, in which a Business Model and Basic Practice exists and you now try to find dimensions along which to judge these practices ("What are the metrics?") and then try to establish measuring processes for this. Using the metrics you can sense, and exert control by analyzing the metrics and how they change. This is no longer research at all, but engineering at the verge of pure business excecution, preparing for scaleout. You remove the researchers, and add engineering bureaucrats that establish the framework for quantification. In the Complicated market rules exist, and are discoverable, and usually are static or the rules by which they change are also known.

In the Complex and especially in the Complicated, companies are growing in a growing market, and focus is not so much on efficiency as on land grab. Management says things like "Do not spend more than we earn at any time, but first and foremost, do not stall growth."

Finally things move into "Simple" or "Obvious" domain, which has well established procedural handbooks, metrics and can draw on past iterations that are similar to the current. So you measure, sense, then look up the proper response and execute it. Best Practice and quantified metrics exist, and you can scale out the process by hiring and training moderately trained people working from the book you prepared in the previous step. This is a mature and stable market, with obvious and discoverable rules and playbooks for all situations. In a mature market, growth is usually only possible at the cost of others, as the market itself is not growing and there is no unclaimed or untapped market share. Instead, growth often is created by efficieny improvements. This is the domain of bureaucrats and beancounters.

At the right hand side, we have a process maturity model - here it is [CMMI](https://en.wikipedia.org/wiki/Capability_Maturity_Model_Integration), but any will do, really. The point being that process maturity follows market maturity: Establishing mature, quantified processes means that you need to be able to iterate, and iterations need to be comparable. So this is basically impossible in the Chaotic and Complex, and also not in the parts of the Complicated where the company is still growing rapidly. If you experiment internally, or if you grow by 10x every other year, your processes will change, even if the deliverables stay the same. That also means that establishing comparable metrics on process execution is impossible.

For outsourcing decisions that means they are impossible. In order to have agreement on what is being bought and what has been delivered, it is necessary to have metrics (and before that, a taxonomy). Only then it is possible for both parties to agree what the product is and if it has been delivered as agreed. That also means that Pre-Obvious or Fast-Growing companies will bias towards insourcing, whereas companies where efficiency matters can make the Make-or-Buy decision and decide to outsource.

## Scale-Up vs. Scale-Out

![](/uploads/2015/03/devops-en.013.jpg)

At the beginning of the Dotcom bubble, running IT mostly meant Enterprise IT. Some somebody somewhere had a data center, and in the data center was a large computer called server. Somebody else now connected the data center network to the Internet. After figuring out a few basic concepts such as Firewalls, DMZ and basic network security, people started about thinking connecting the internal IT to the Internet. At that time the Web came around.

As the Web grew, more people used it, and the load on the existing large computers grew. What to do?

Obviously: buy a larger, faster and newer computer. [Moore's Law](https://en.wikipedia.org/wiki/Moore%27s_law) gives you an annual growth of around 45% year on year, and that should be right, shouldn't it?

![](/uploads/2015/03/devops-en.014.jpg)

*One of twelve Enterprise 10000 "Starfire" at mobilcom, Germany, around 2002.*

We see some seriously large machines at around that time - there were twelve 64 CPU Enterprise 10000 "Starfire" machines present at the mobilcom Data Center in Germany in the early 2000's, for example, and many more were deployed in other places just in the area I worked in.

![](/uploads/2015/03/devops-en.015.jpg)

Yet it became obvious rather quickly that this was not an approach that worked, and even if it worked, it often was prohibitively complex, expensive and slow. Once that became clear, people started to automate basic tasks, learned to mange large fleets of moderately sized machines and then tried a different approach - "scale out" instead of "scale up". Use more computers instead of larger computers.

This triggered a lot of learnings at all levels of the profession - network, data center structure and operations practice needed revision. This talk will focus on the latter, but the other topics are also of interest.

## Operations change in response to scale-out

![](/uploads/2015/03/devops-en.016.jpg)

I have been known to annoy people with saying that "Whenever you are using ssh, you might as well open a ticket."

If you need to login to a box manually to look something up, you are looking at a monitoring defect - make a ticket for that. If you need to login to a box manually to change something, you are looking at an automation defect - make a ticket for that. I have literally been beaten for saying that.

We get cfengine 3 (2004), and later Puppet (2005), Salt (2011) and Ansible (2012). Also, somewhere at the end of the observed time frame virtualisation becomes viable, and with that we get automated provisioning of hardware and "Infrastructure in Code".

![](/uploads/2015/03/devops-en.017.jpg)

The thinking that permeates software development can now be applied to hardware and infrastructure resources: If there is a problem with a setup, recreate that setup, and the problem in a branch. Then modify the branch to see if that fixes the problem. When it does, merge the branch, and redeploy automatically.

We get alignment of tooling in operations with tooling in development. This, and "zero manual interactions" grade of automation have a great impact:

![](/uploads/2015/03/devops-en.018.jpg)

Automating things makes them reproducible: The same change applied to many instances always produces the same outcome. 

If that actually works, and has zero manual interactions, we can apply the change to the entire fleet in parallel, instead of filtering it through a single person and serializing it that way.

Once you can do things fully automated and in parallel, it does no longer matter so much if a single thing fails - you do not care about individual instances any more. Instead you care more about always having sufficient capacity in general, and how to orchestrate all your instances so that this condition is never ever violated.

It is this stage where we see people moving from "highly available setups" using Pacemaker and Active/Passive pairs to loadbalancers with *n* workers, all of them active at a sufficiently low utilization factor to buffer away a loss of *m* units of capacity. All computing becomes distributed computing at some point - more about that in another talk.

## This requires a different mindset, and different qualifications

![](/uploads/2015/03/devops-en.019.jpg)

When we change the tooling and the methods to be more closely aligned with Developers, culture also has to change.

![](/uploads/2015/03/devops-en.020.jpg)

A figure of the pre-2000 USENET sysadmin culture has been the BOFH - the [Bastard Operator From Hell](http://bofh.bjash.com/). These are the stories about an outright hostile systems operator, written by Simon Traviaglia and posted to USENET. Parts of that have been sold to magazines and printed later on.

A lot of people picked up on the concept, and the USENET groups alt.sysadmin.recovery and de.alt.sysadmin.recovery were born. People met, for example in German at the series of Cannossa parties.

![](/uploads/2015/03/devops-en.021.jpg)

This is not a good mindset or culture. It not only rejects development, and change per se, it is also toxic and hostile, even to the people who actually pay the bill. Never a good idea.

Of course it is a joke, or satire, but unfortunately, stories influcence minds, even when they are meant to be funny or satire.

Around the same time, Thomas A. Limoncelli wrote the proto-devops book "The practice of System Administration", which interestingly contained a chapter on how not be to a BOFH - it asked the system administrator to reflect on the structure and processes of the larger company and their place in them. Limoncelli then goes on about how to build useful supporting and reporting structures to function successfully in that structure. He closes with advice on how to respond to unexpected demands without too much toil and effort. It foreshadows a lot of development that caught on later under the label devops.

![](/uploads/2015/03/devops-en.022.jpg)

*The current, updated edition of that book is titled "The Practice of Systems and network Administration".*

The term "Devops" meanwhile, was coined by [Patric Debois](https://twitter.com/patrickdebois) in 2008 in Belgium, and pretty much assembled and then taught the same ideas as the Limoncelli book, at a larger scale and using even clearer structure.

![](/uploads/2015/03/devops-en.023.jpg)

*BOFH practice applied in the 2008 Booking.com office (re-enactment).*

## So how do Dev and Ops differ?

Well, even at 2008 we already have processes for IT organisations. Large, scaled up and unwieldy processes that have been established top down, though: During the Dotcom boom, the structure of IT support and operations processes had been formulated as well in [ITIL](https://en.wikipedia.org/wiki/ITIL), and then often badly implemented in the wild.

![](/uploads/2015/03/devops-en.024.jpg)

It is entirely valid and sometimes helpful to think of Devops as a reaction to bad ITIL deployments: 

![](/uploads/2015/03/devops-en.025.jpg)

Bottom up, "apply development methods and thinking to IT operations, while staying small and agile and iterating quickly, and also focusing on automation, metrics capture and data driven improvement".

Tear down the wall between software development and operations. Teach operators coding and coding thinking, and teach developers to care about operations and how operations matter, how scale matters.

![](/uploads/2015/03/devops-en.026.jpg)

Jez Humble describes this tweet as a reaction:

> In a fit of rage caused by reading yet another email in which one of our customers proposed creating a "devops team" so as to "implement" devops, I tweeted that "THERE IS NO SUCH THING AS A DEVOPS TEAM."

and later wrote [a longer blog post](https://continuousdelivery.com/2012/10/theres-no-such-thing-as-a-devops-team/) about this, the core of the argument being

> The Devops movement addresses the dysfunction that results from organizations composed of functional silos. Thus, creating another functional silo that sits between dev and ops is clearly a poor (and ironic) way to try and solve these problems.

Applying developer methods to operations problems changes the environment and tooling. The modern stack looks like this:

![](/uploads/2015/03/devops-en.033.jpg)

- Systems are provisioned with "Infrastructure as Code", automatically and on demand, via an API with no humans involved.
- The code for the application and the infrastructure itself resides in a shared version control system, where it can also be subject to automation.
- There is a one step build and deploy automation that produces deliverables. These are then automatically deployed into production with zero humans involved, if so desired.
- The deployment and the activation of code pathes is separated, using feature flags and instrumentation to compare performance aspects of these code pathes. Separation of deployment and activation is key to safe and fast rollouts, gradual activation and [one-click rollbacks]({% link _posts/2020-01-17-rolling-back-a-rollout.md %}).
- Monitoring and freshness indicator on monitoring metrics are key to proper failure detection.
- Instant and shared communication is key to decisive join action in failure situations.

There are two fundamental innovations in here that deserve a special highlight from a "ten years later" perspective:

### Separation of rollout and activation

When writing new code, it is useful to wrap the new code and the old code being replaced by the new code into two branches of a feature flag. This is because in a large enough deployment you cannot migrate to the new code in a single atomic transaction anyway: old and new are going to inevitably co-exist for some time.

But if that is the case, you might as well make the most of it: Separating rollout and activation allows you to roll out code into production without running it at all, and without running it for all users. Instead you can choose who gets exposed to the new variant in a very controlled way: You can run it for one user, for 1% of the user base, for Mac users only or for users coming from IP addresses identifing as Japanese in origin, or any combination of such criteria.

You can also instrument that code, and then compare how it behaves - in conversion of sales, in cost of execution, in execution speed and along many dimensions more.

Separation of rollout and activation, and proper instrumentation of the wrapped code allow you to experiment with variants in production.

### Observability through Metrics from Events

Another thing that has proven to be useful is to build a monitoring system on top of an event system. Instead of collecting numeric metrics on machines and pre-aggregating them, logging structured data (JSON or similar) and collecting them centrally has advantages: The numeric metrics can be extracted from the events and pre-aggregated for common and known things to report on, but since the actual events constituting the metrics are persisted, other important things become possible:

1. Metrics can tie back to the actual events that make up the numbers. So when you have identified an anomaly in space (the machines involved) and time, you can look at the actual events that make up the numbers you looked at, and try to identify a root cause.
2. Since the actual raw events are available after the fact, it is possible to correlate things over time: "When we changed the upper sales funnel this way, immediate conversion increased, but effectively we lost money, because of increased return rates and customer support cost in a three week window after each sale, for *x* percent of the customers of the B-variant of the experiment". These are findings that are impossible to prove without access to raw event data.
3. Since the actual raw events are available, it is possible to query the raw event data in other, previously unknown dimensions, searching for additional patters - it is possible to debug using event data instead of going each box "in person" (with ssh) and observing things on the ground.


## A clash of cultures

![](/uploads/2015/03/devops-en.039.jpg)

In any case: We get convergence in tooling between Dev and Ops.

Operational people learn to code, and use this to automate operations, centralize and standardize the monitoring, and developers learn to care about operational aspects, building operations support directly into software.

Eventually, developers and admins are using the same set of tools. So, let's converge the teams. That's Devops.

## It's not that simple and doesn't work?


![](/uploads/2015/03/devops-en.040.jpg)

Inevitably, cultures clash.

Despite the same projects and identical tooling, there are critical differences.

But they seem to be harder to spot.

What are they about?

![](/uploads/2015/03/devops-en.041.jpg)

Feature-Developers ("Developers") and Infrastructure-Developers (former "Operations" people) seem to have utterly different metrics for success.

![](/uploads/2015/03/devops-en.042.jpg)

Infrastructure developers see feature developers as people who focus on new best cases: There is a plan, there is sprint. New features - new best cases - are developed, and what is deemed finished is being released in a big showy party. Everybody is colorful, happy and rolling across the lawn. What isn't finished goes back onto the backlog, and that is that.

![](/uploads/2015/03/devops-en.043.jpg)

Infrastructure developer know that is not true for themselves. They look at themselves like in this picture, complete with helmet webcams.

"Nobody has ever flipped a light switch and exclaimed 'Awesome. The light actually turned on!' when it worked. But flip the switch only once, and it does not turn on: people will complain and remember that for a long time."

Because of that, infrastructure developers judge change by looking at how worst cases behave and how worst case behavior changes with changed code. Only then they will look at other improvements.

![](/uploads/2015/03/devops-en.046.jpg)

There are two famous Booking rules for rollouts, from the early days:

- #1 If you break it, will you even notice?
- #2 If you break it, can you fix it?

The answer to #1 should be "Yes!", of course. But that means you need to know your dependencies and dependents, your place in the larger scope of things. If also means you need to know what people your change will affect, and how to find them and to synchronize with them. If you do not know these things, you do not know how your change will affect these people, and that means you cannot safely roll out.

That's okay, we have training for that, and we can help you with that.

The answer to #2 should be "Yes!", again, or if cannot be that, it should be "but I know who can, and I made sure they are aware of my change and available for help".

So both of these rules are dealing with failure - anticipating and handling it properly. It's infrastructure developer thinking, but we give these rules to feature developers. That's a mind hack.

![](/uploads/2015/03/devops-en.048.jpg)

Infrastructure thinking is really hard to explain to outsiders.

![](/uploads/2015/03/devops-en.049.jpg)

For example, in this document, the Linux "Code of Conflict", what is being tried is to explain this - "There are people who will read your code, and they will evaluate it on how it fails, and how it changes failure before they even look at what it improves, because that is how Infrastructure works. Criticizing your code is not criticizing you, listen and learn."

It also explains: "Criticizing you instead of your code is not okay, so if that happens, call out for help, please." It uses many words for that, because somehow most non-infrastructure people are not used to this.

![](/uploads/2015/03/devops-en.051.jpg)

There is a certain type of experience associated with this kind of mindset. "Who here remembers this one?" When I asked the original audience of the talk about this incident, about 2/3 of the audience raised their hands. "I was there!" was being shouted by a few people.

That was at that point in time 14 years ago.

![](/uploads/2015/03/devops-en.052.jpg)

Ten years earlier, at Friday, the 13. May of 2005, I had to shut down 2MW of compute at the web.de data center, turning off the email for 25 million customers, because of a complete loss of cooling in the Data Center. We handled the incident, turned off the entire data center in less than 20 minutes in a chaotic rumble, and then back on to basic functionality with another two hours of work. Fully redundant and properly configured setup was reached again on Saturday, the 14th, around noon.

People in the audience also remembered that one.

![](/uploads/2015/03/devops-en.053.jpg)

Of course, Infrastructure developers are averse to change. Change introduces unknown behavior, and unknown operating conditions.

Of course, if you are always ever judged by your failures, you focus on failure cases and how they are handled.

![](/uploads/2015/03/devops-en.054.jpg)

This does not have to be a contradiction, though. A sequence of rapid small changes acutally makes deployment risk smaller, and allows you to fail safely in many cases - in all cases, even, with a bit of engineering and good practice - see above, the discussion about events, monitoring and separation of rollout and activation.

![](/uploads/2015/03/devops-en.056.jpg)

Planning for change and budgeting downtime can help a lot, even. Internally, we teach this as shown in the slides below: We have a failure budget, in lost potential income, and we expect to make use of it, even.

![](/uploads/2015/03/devops-en.057.jpg)

We look at what happened in a blameless postmortem process, and then write down what the takeaways from the outage are - how do we need to change processes, how to we need to improve monitoring and training, how do we need to fix code in order for that failure and that class of failure to go away?

![](/uploads/2015/03/devops-en.058.jpg)

We talk about the concept of "Careful Carelessness", which is what allows you to jump out of a plane several thousand meters up in the air, more than once.

![](/uploads/2015/03/devops-en.060.jpg)

The "Careful" part of skydiving is important. You need training, you need to know and trust your buddies, you need a plan for safe landing, and you need alternative plans, tested and ready, and reviewed by others. You need to review their plans.

![](/uploads/2015/03/devops-en.064.jpg)

The core concept is to make changes "survivable", and then be able to execute the entire process in a way that it can be done often, without hurting. What is a project elsewhere, a one-off thing with additional staffing and a deadline, is a process for us, routinely, repeatedly done as part of normal operations, all of the time.

This is what Devops is about: Making change a routine process of everyday operations.

![](/uploads/2015/03/devops-en.069.jpg)

"Survivability" means to fail, or almost fail, but live to walk away and tell the tale. Because that is how we learn: When we succeed, we only confirm what we already know. When we fail, or almost fail, we learn a new thing, and we can share that experience with our peers.

Not only do we learn from failure, we also share common history and experience, and that builds better communication, validates judgement, and builds trust. This is how you forge a team.

![](/uploads/2015/03/devops-en.071.jpg)

Testing in production is okay, if you engineer for it, and make it survivable. Even outside of rollouts, you can increase resilience by introducing chaos and variabilty in procedures - don't shut down systems cleanly, always jank them out of production, or even install the chaos monkey. Always test in production, and find ways to do this safely. Also, this will help you find dependencies and metrics that matter.

![](/uploads/2015/03/devops-en.076.jpg)

Martin Seeger of NetUSE is famous for popularizing the proverb "Nobody wants Backup. Everybody needs Restore." He wants to highlight the fact that Backups are just a cost center, and do not produce anything of value. The value - which needs to be proven - is in the successful Restore, and that is also what needs to be tested, constantly.

Of course, if you automate, you do not need backups for anything besides the (clearly defined and isolated) state. You can rebuild your systems at will, in regular intervals, or for testing purposes, and then inject the actually unique state into them.

## And yet, they are still fighting

![](/uploads/2015/03/devops-en.077.jpg)

And yet, Dev and Ops are still fighting.

Why is that?

![](/uploads/2015/03/devops-en.078.jpg)

Developers tend to ignore operational complexity and toil, and often build from building blocks that look like rectangles on an architecture diagram, but are actually complex systems in themselves.

This is Openstack Monasca, Monitoring as a Service: 

"Monasca is an open-source multi-tenant, highly scalable, performant, fault-tolerant monitoring-as-a-service solution that integrates with OpenStack. It uses a REST API for high-speed metrics processing and querying, and has a streaming alarm engine and a notification engine."

"It uses a number of underlying technologies; Apache Kafka, Apache Storm, Zookeeper, MySQL, Vagrant, Dropwizard, InfluxDB and Vertica."

At which point somebody in the audience usually shouts "Bingo!". There are a number of questions here - for example, "How do you hire for this?".

![](/uploads/2015/03/devops-en.083.jpg)

Or, looking at this Openstack Infrastructure Diagram (simplified): How do you operate this under "system behavior in failure state" as a success metric - which is how Infrastructure people think.

![](/uploads/2015/03/devops-en.087.jpg)

Infrastructure people see code like this coming in, and see people who package things they have not understood, taking on dependencies they do not know, and using practices that look like automated, repeatable procedures, but aren't.

The first line installs Homebrew - "Download an unreviewed script from Github and feed it to a shell, executing random foreign commands on your system".

The second example shows a Dockerfile executing, but what looks like a build procedure is really just downloading binaries in tar files from elsewhere, unpacking and piling them on top of each other in a badly specified binary patch procedure, without caring much what is in these packages and how it is being made.

The last example is part of an Openstack Puppet install, and downloads an actual operating system package, then NOT installing it, but unpacking it and copying individual unregistered files into a production system image.

![](/uploads/2015/03/devops-en.089.jpg)

Or implementations of upgrade procedures with three nested loops (O(n^3) complexity), that work for l,m and n = 1 on a test laptop, but cannot possibly succeed in any production environment with significant values of l,m or n - clearly this has never seen an actual production environment.

![](/uploads/2015/03/devops-en.090.jpg)

This captures the essence of this mindset, cargo culting, containerism. Abstractions packed away deep in a fragile stack, and then in production suddenly breaking, taking down the entire technology Jenga tower.

![](/uploads/2015/03/devops-en.091.jpg)

Computer science is weird - it is hard, despite the fact that it is the science of zeroes and ones. Nothing individually in computer science is ever hard. It literally is as simple as Jenga or Tetris, and like these, the complexity comes from the layers.

I have an exercise where I let people list the dependencies for their application going down from the business level all the way down to the silicon, and then we count layers stacked on top of each other. We usually can identify about three dozen levels of abstractions being piled on top of each other, all of them trivial or almost trivial. And that is on an isolated system, keeping the vagaries of distributed systems out of the picture.

So when we think about complexity in computer science, we speak about epsilon-delta in non-linear systems with cascading dependencies: A tiny change here has catastrophic outcomes elsewhere, 20 layers up or down the stack. You add a line of code, the working set of your application no longer fits into the CPU cache of low end CPU models, and suddenly the performance difference between the same code running on a Silver or Gold Xeon model is factor 20 and nobody even knows why.

![](/uploads/2015/03/devops-en.096.jpg)

This is not a new complaint. Alan Perlis famously quipped this about LISP programmers in 1982: The level of abstraction in LISP in 1982 was so high that native LISP programmers with no insight into the implementation created similar situations to the previous cache scenario, regularly.

![](/uploads/2015/03/devops-en.099.jpg)

In closing: What changes?

Devops means that Operations people become Infrastructure Developers. They are using the same tools that Feature Developers are using, but for a different purpose: For creating, scaling, maintaining and debugging the production environment of a project. For dealing with all the real world, failure related use-cases of a project.

Devops means that the System Administrator as a job description goes away: There are only Infrastructure Developers now, or Operators - but these are people that follow instructions and will be ultimately replaced by machines soon.

Devops means that as a System Administrator you have to learn the tools of a Developer, learn to automate, learn to talk to APIs, and learn how to apply Infrastructure thinking to other peoples codebases.

As a Devops Engineer, or Infrastructure Developer, it is your task to keep the entire stack in mind. Applying Infrastructure thinking to this means you know how that change 20 levels down in the stack affects production on a grander scale - because somebody has to know the details and understand all the dependencies.

As a Devops Engineer you also need to teach enthusiastic young people with a feature developer mindset how to [touch candles]({% link _posts/2020-08-31-on-touching-candles.md %}), how to fail safely, in order to make them actually experience a problem class, instead of just abstractly knowing about it somewhere in the back of their mind.

If you do not do that, if you cannot do that, you will soon be replaced by a tiny shell script.
