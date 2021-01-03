---
layout: post
title:  'Rolling back a rollout'
author-id: isotopp
feature-img: assets/img/background/rijksmuseum.jpg
date: 2020-01-17 19:53:49 +0100
tags:
- lang_en
- devops
- work
- testing
---
Florian Haas [asks on Twitter](https://twitter.com/xahteiwi/status/1217903825824120834):

![](/uploads/2020/01/rolling-back.png)

"How do you solve reliable rollback. The definition of a reliable rollback being: 'get reset --hard <ref>', 'git push -f' and then magic happening that returns your infra to the exact state it was at <ref>."

The problem is relatively easy to solve with modern infrastructure-as-code for anything that is stateless. It becomes a bit more involved when you are dealing with things with state, such as database instances or Zookeepers or similar things.

My reply on Twitter begins [here](https://twitter.com/isotopp/status/1218162310956638209). I am basing my writeup on that reply.


## "Devops", what does that even mean?

In 2015, I gave a talk titled "[Go away, or I will replace you with a little shell script]({% link _posts/2015-03-27-go-away-or-i-will-replace-you.md %})" as a keynote for the GUUG FFG 2015 in Stuttgart. The german language slides are [here](https://www.slideshare.net/isotopp/go-away-or-i-will-replace-you-with-a-little-shell-script), the english slides are [here](https://www.slideshare.net/isotopp/go-away-of-i-will-replace-you-with-a-little-shell-script-english) and a Youtube video of the Froscon version of the talk is [here](https://www.youtube.com/watch?v=e0CCv7pSK4s). Unfortunately, the video is the german language version of that talk.

The talk focuses on how the sysadmin profession started to die out somewhere around 2001, when we invented horizontal scaleout and [Tom Limoncelli](https://twitter.com/yesthattom) published the first edition of "[The Practice of System Administration](https://the-sysadmin-book.com)". That book explained in one chapter the role of the sysadmin in the greater corporate organisation and how to cooperate with, not fight against users. The term and the practice of Devops evolved in this decade, until in 2008 [Patrick Debois](https://twitter.com/patrickdebois) coined the actual term "Devops", which we use today.

The term has been abused a lot, but what does it actually mean? In one slide I show this:

[![Go away or I will replace you with a little Shell Script (english) - Slide 19](/uploads/2020/01/rolling-away.jpg)](https://www.slideshare.net/isotopp/go-away-of-i-will-replace-you-with-a-little-shell-script-english#19)

The modern development environment according to Devops, and the technical meaning of the term.

In todays language, I would phrase these items as follows:

- Infrastructure as code
- Version Control
- CI/CD
- Separation of Rollout and Activation
- Proper Observability with centralized, structured logs
- Good instant communication

*Infrastructure As Code* describes a way of declaring the execution environment for your code, in code. Code that can be checked in and versioned like the application code itself. Openstack Heat Scripts, AWS Cloud Formation, Kubernetes Deployment Specifications or your Terraform all qualify as this.

With this, you can recreate and redeploy your execution environment together with your application, as part of the build and deployment automation. It also means that you get rid of the endlessly fragile state manipulation engines that are Puppet, Ansible, Chef, Salt and CFEngine. You create, build and deploy images and you run immutable infrastructure.

Because all of that code and infrastructure declaration are files, you want *Version Control*, which in 2020 means, you want all of this in git. This is so normal by now that anything that is not git-able is considered broken and weird.

What you check in, you want to be processed automatically. So you push it through a *CI/CD pipeline*, which pushes things through whatever pre-production environments you have (many have Dev, Staging and Prod). This, in 2020, probably includes formatting to coding standards, linting, sonarcubing, and whatever tests you wrote.

Eventually, your code is rolled out. And a key invention - one that is not yet done by enough people - is *separation of Rollout and Activation* by the means of an experiment framework. More on that below.

When application code runs, it is appending messages, measurements and context to a hash of hashes. This collection will be pushed into an event processor at the end of a request. Ours is called "Booking Events". If you happen to work elsewhere, an Observabilty tool such as [Honeycomb.io](https://honeycomb.io) is the closest to Booking Events I have been able to find outside of Booking.

Using this, you alert and push alerts out through a multitude of channels, including Pagerduty, and whatever you use instead of Slack. Humans are being alerted to a situation, and can act on it.

## Separation of Rollout and Activation, and Dual Use Experimentation

As I mentioned above, the separation of rollout and activation is a key invention that makes rollouts possible. It also makes testing in production safe.

In the first iteration, an experiment framework allows you to push code into production that never runs. You can then, through feature flags, activate your code for yourself, or a chosen subset of customers based on whatever selectors your frame work offers. I often quote "5% of the population of guest country .jp with a user-agent string that suggests MacOS" as an example, but it is really a function of the experiment framework you build.

See a very old talk from 2012 of mine: "[8 rollouts a day](https://www.slideshare.net/isotopp/8-rollouts-a-day)" ([video](https://www.youtube.com/watch?v=6qFNwNEeG1w)) for an ancient take on all of this. This is not new technology, we have been doing this for ages, and just iterated on this.

Having an experiment framework means that the scaffolding for activation in code is formalized and tested, so errors in gating entry to new code are unlikely to happen.

It also means that a control framework exists where you can see experiments that are active, who is exposed to them, and that participation in an experiment is recorded in a user click history. You probably want to record experiment config changes in your monitoring wallgraphs so that a change in observed behavior is linked to possible causes for that in an obvious and in-your-face way.

This is also important for customer support: A CS agent needs to be able to see what the customers sees or has seen, if an experiment is a UI/UX experiment. UI/UX variants should be available to CS agents at will, so that they are able to match and retrace customer experience.

Having experimentation available obviously means that variant code is in execution concurrently. Or in terms of rollouts: Old and new code run at the same time.

For state management, it means that schema changes or similar data adjustments need to be done in advance. They also need to be done in a way that is compatible with the old and the new code. That is not hard to do, and can be done in a robust testable way. You want to package it, and run a bunch of checks on schema changes automatically, so you can detect best practice violation and prevent these from being checked into staging and prod.

And yes, you need that table change framework anyway, because SOX will eventually want that from you. You probably will end up with a web frontend and API for [pt-online-schema-change](https://www.percona.com/doc/percona-toolkit/LATEST/pt-online-schema-change.html) accessible to end users in a way that also advises them automatically on best practice. This also scales better than your DBAs checking manually for the presence of a PK, NULLable columns, columns that are DOUBLE but suggest monetary values in their names, and similar things.

Ok, at this point you can push code into staging and prod in a way that the old and new variants of the code can coexist on whatever schema you have and can run concurrently, depending on what variant of which experiment the user is in. You can finally *activate* code for a few users, and see what happens.

Your second iteration of the experiment framework will therefore measure the *impact* of the experiment, and by that I do not only mean the business impact, but also the technical impact.

Business impact measurements would answer questions such as "What influence has Experiment 17 on conversion?" or "Does variant B of experiment 17 not only improve conversion, but also customer support call rate, and if so, it is still a positive experiment in the monetary sense"?

But as a gate to the entry of code pathes, the experiment framework can also encapsulate Probes that collect metrics over a Span, delivering technical measurements about the performance cost of an experiment. I can ask questions such as "Show me all messages in variant B of rollout 64fd32f that never appear when running variant A", or "What messages appear since rollout 64fd32f that did not appear before".

I can also carry metrics and classify them by experiment related selectors. "Show me SQL time spent in variant B compared to variant A of rollout 64fd32f in all sections guarded by experiment 13, normalized by number of executions". In other words, what exactly is the latency contribution of experiment 13b, since 64fd32f?

And because I have access to the unshortened, unaggregated raw event data persisted elsewhere, at any point in time I can ask the framework to actually show me the SQL, once I have a selector that finds me the delta I was looking for, and highlight the things that are only present here and not elsewhere.

That is the Dual Use value of an experiment framework: You get the business value out of that, testing hypothesis on draft code in production before you spend engineering hours on things that aren't going to make you richer. That is, in terms of bug stages, finding bugs in requirements.

![](/uploads/2020/01/rolling-relative-bugfix-cost.png)

*From [8 rollouts a day (2012), Slide 19](https://www.slideshare.net/isotopp/8-rollouts-a-day): Relative cost of a bugfix in various stages of the code lifecycle. Fixing broken requirements is the cheapest.*

But you also get the technical cost of that, in terms of running the prototype code. That enables you to assess the added execution cost vs. the estimated engineering effort to speed it up. In other words, your engineers only ever work on code that is proven to make you richer, *and* you also know how much running it will cost you in AWS units or engineering hours and you can prioritise things properly.

And finally, since A and B variants coexist, if B is known to be bad, you not only can roll that back, you don't even have to. Simply turning off activation of B gives you instant silence in production - the known bad variant is still present, but never run for anybody. You can then triage and come up with a resolution of the situation on your own terms. Either you eliminate the B variant and roll back, or you fix B and roll forward. Either way, this is done completely out of the execution path and also without any time pressure constraints on the decision making.

## The Sum of All These Parts

The sum of these parts is much more than each individual capability gives you. Together they give you an environment that allows you to roll back and forward, at will. And you will be doing this in an informed way. You can reason about code in production, and act on the outcome of that discussion. And you are doing this outside of crisis mode and any time constraints.

Separation of Rollout and Activation is a Key Invention here. Put this into an Experimentation Framework, and create a dashboard/control/overview board around this that gives information about running and disabled experiments, experiment outcomes in terms of business and technical data, and that links to raw events and metrics generated from the raw events directly.

Marrying an experiment framework + dashboard with a Honeycomb-like observability system, and with pointers to tags, releases and rollouts in your code base allows naviagation between all of these things in an integrated way. It enables product and tech people alike in a unique way to reason about code, what that code does to the business, UX, income, and also resource consumption.

It can direct business decisions, because it allows safe rapid development and deployment of draft business expierments.

It can direct engineering decisions, because it tells you what is safe, and what isn't, what is good enough and what isn't.

It informs product management and backlog decisions, because it links technical cost, potential business income and resource usage cost so that business and tech reason about code at eye level - one single source of truth, and one single set of metrics spanning the lowest levels of tech to business metrics like conversion, cuca call rates, cancellations and other things.

After doing that a while, your code will be littered with Experiment Gateways that either protect and measure code that is full-on or perma-off. All of that code is technical debt and needs to be evaluated, and cleaned up. In this way, the experiment framework, even in the final stage of its usefulness acts as visual markup for technical debt assessment and as a guide for garbage code collection.

## Reliable Rollbacks and Testing In Production

You can even use this data to build predictors for expected business behavior, and alert on deviations. "According to observed growth and data from last year, last month and last week, we would expect x bookings per minute, but see m fewer, so something is likely wrong. That started 10 minutes ago at the yellow activation line of experiment 13" is a thing where I live, and turning off 13 before even looking for possible root causes is a complete no-brainer. In 95% of the cases or more it actually fixes the incident for now, so that any followup is done again outside of panic mode.

![](/uploads/2020/01/rolling-production.jpg)

That is: Testing In Production Is A Safe Thing To Do - if you build an environment that makes it survivable. The key ingredients are

- Education
- Awareness
- Empowerment

I reference that in both talks I linked above: Education means you not only need your general craft, the IT you learned at school, in university or in previous jobs. You also need to learn the local knowledge. We encapsulate that in the two questions

- If you break it, will you even notice?
- If you break it, can you fix it?

The first question asks if you do know you dependencies and dependents for any subsystem that you change. If you don't that's okay, we will teach you. That's why we are here.

But if you write a patch, gate it in an experiment and then ask "Is this good? Can I roll that out?", you are asking the wrong person. There is one expert on the whole planet for that change you just wrote, and that is you. You need to be able to answer the question "If you break it, will you even notice" with a confident yes in order to be admitted to production. Nobody but you will know the proper answer to that question, ever. We can only help you to find the "Yes" by teaching you.

This is also a question of attitude, and it has to be coming from the top. Back in the day when [Kees](https://twitter.com/keeskoolen) was CEO, he usually ate with everybody else in the canteen.

A typical conversation that happened similarly more than once is Kees asking somebody: "I haven't seen you before. Are you new?" "Yes, of course. I started 3 weeks ago." "And", Kees would ask, in one way or the other, "did you break production already?" The newbie would of course answer "No, of course not!" and get the usual response "So what am I paying you for?".

The moral in this is that errors and downtimes are a part of doing business. Of course we would like to have infrastructure where these things do not happen, or minimise impact, but velocity and risk taking are a thing of value to a fast company. By having an error budget (the integral between the predicted income and the actual income) and checking that things are within the error budget, management has a control that allows them to check on the state of the engineering culture. If we are over the error budget, we probably need to look at our ways, and the state of our education and practice. If we are under error budget a lot, we are probably not moving fast enough and are too risk averse.

All the instrumentation around this - CI/CD, dev and staging, experiment framework and observability framework - exist to make better use of the error budget and get most out of our invest into corporate improvement and organisational learning.

The second question asks if you know how to fix the things that your change may break. It is not only a question about scope, but also a question about your network. That is, because in any reasonably large system you won't be able to put it together alone. 

You should expect to need help.

It's people that help, not positions.

So you should not answer "I will need a DBA around just in case", but you should know if Debs, Greg or Simon would be better to have around in your case.

With your education covered, and especially the necessary local knowledge amending your general education, you'd then have to be aware of your environment. That ties back to the upper part of this writeup. With probes and annotions from Spans covering Experiment gateways, you will have to access the data collected in your event logging system, your observability pipeline to understand the state and health of your system.

And it is that exact state, and the detailed data that will tell you the story.

Aggregations are important, they point you into a general direction. But it is the raw data that contains the evidence you need. It is the ability to slice and dice the raw data along arbitrary dimensions at will that will allow you to make the precise cut which isolates the buggy cases from the non-buggy behavior. It will allow you to look at the precise delta in exposed state of your distributed system of dependencies that causes the abnormal behavior.

Logs and metrics are good, essential for checks and alerts, to handle known cases and navigate known waters safely. Events, and the ability to search, sort, aggregate and correlate on events at will, are what enable you to see and debug a distributed and developing production system. Experiments, separation of rollout and activation, with integrated Probes in Spans, allow you to collect this data, and to act, by disabling code that introduces undesireable behavior.

The rollout is likely to be safe, because any new code you roll out is never executed in production. Unless you activate it. In the end you will find that it is not the rollout sparklines in your graphs that matter, it's the config change sparklines that need watching. You can turn on things for yourself, for a subset of the population, or, if you have gradually built confidence, full on.

Full on (or full off and writing the change off as worthless, in 19 of 20 cases) is a precondition then for cleaning up: Removing either the Experiment tooling around one new codepath, removing the old codepath completely, or the other way around.

Leaving experimentation instrumentation in the code, but having things full on (or off) is a very easy and visible way to assess technical debt. So even after the experiment has come to a conclusion one way or the other, the experiment framework is useful as a way to demarcate in some way or the other technical debt in source files.

And finally, empowerment. Empowerment is giving developers the power to make decisions, and at the same time demanding from them that they make them. You can do that only in a safe environment, and in a blame-free culture where this comes from the top. Hence the importance of Kees eating in the Canteen and asking the questions as told above. Hence, too, the importance of the error budget, and exposing it to all people that roll out.
