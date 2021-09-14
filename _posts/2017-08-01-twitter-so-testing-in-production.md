---
layout: post
status: publish
published: true
title: 'Twitter so: Testing in Production'
author-id: isotopp
feature-img: assets/img/background/rijksmuseum.jpg
date: '2017-08-01 09:25:02 +0200'
tags:
- computer
- work
- lang_en
---
[Matthew Dutton:](https://twitter.com/matthewrdutton/status/892007581639737344)
»@mipsytipsy I thought "You have to test in production" was a bold statement
and would love to hear more of your thoughts on the
topic.«

[Charity Majors:](https://twitter.com/mipsytipsy/status/892048269651484672)
»Hmmm, you're not the only one to call this out. I'll add it to my list of
"articles to write someday" ? but here's the gist: We have always tested in
production, just not well. And obviously, I'm not advising anyone to do
_less_ of the usual pre-production testing methods, but at some point, esp
with distributed systems, you just can't usefully mimic the qualities of
size and chaos that tease out the long thin tail of bugs. Imagine trying to
spin up a staging copy of Facebook, or the national electrical grid! You
can't, and have sharply diminished returns. If you can catch 80-90% of the
bugs with 10-20% the effort (and you can), the rest is more usefully poured
into making production resilient. 

[How do you do testing in production?] Canarying; automated canarying and
promotion in stages; empowering your developers to explore live production
systems with e.g. @honeycombio (hi), making rollbacks wicked fast and
reliable; instrumentation; education and training, feature flags a la
@launchdarkly. all great use of time. Basically what I'm trying to say is,
embrace failure. Get used to the inevitability and lean into it, _iff_ you
have a system like this. If you've got a rails app and five engineers then
ignore everything I'm saying until the moment is right :) 

[Devdas Bhagat:](https://twitter.com/f3ew/status/892277138329612289) »Just
tagging potental speakers who know a bit about that topic.« 

[Kristian Köhntopp:](https://twitter.com/isotopp/status/892281239109083136)
- Decouple rollout and activation (feature flags, experiment framework) 
- Low latency monitoring 
- Monitor the shit out of everything 
- Implement schema changes with old and new version being live simultaneously 
- For each change, know your providers, know your consumers Strategy: Make testing in
production as safe as you can possibly make it.

That has manifold returns: It makes developers production aware; builds
knowledge in handling real catastrophes in regular operational situations;
builds confidence and competence; you get actual measurements, which is good
calibration. In general, you build antifragility.

Testing in Production also allows testing of features for commercial
viability fast, before you invest lots of development resources to build
them out. So it enables you to throw away 95% of the code before it is
written. That's actually the most valuable part of it.

Content slightly edited to make it easier to read.
