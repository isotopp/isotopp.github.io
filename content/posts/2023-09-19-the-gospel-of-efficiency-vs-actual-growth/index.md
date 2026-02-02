---
author: isotopp
title: "The Gospel of Efficiency vs. Actual Growth"
date: "2023-09-19T01:02:03Z"
feature-img: assets/img/background/rijksmuseum.jpg
toc: false
tags:
- lang_en
- work
aliases:
  - /2023/09/19/the-gospel-of-efficiency-vs-actual-growth.html
---

A decade ago, I came as a performance specialist into a rapidly growing environment.
With rapid growth, I mean anything that is larger than what Moore's Law once delivered.
Moore's law comes out at upwards of 45% Year-on-Year (YoY).
In my case, we experienced 80% YoY worldwide with 220% YoY in certain regions of the world for many years.
Even in 2008, when the economy stagnated, we still made 45% or more.

Onboarding people into such an environment is weird.
They all have been programmed by their university education and their previous work experience to build things that last,
to consider things carefully and to be efficient, and save money at all cost.

That is not how anything works in a high-growth environment, at all.
Rapid growth kills. 
The tech we build, we build it for a certain expected target size.
Good tech can sustain a 10x growth (or shrinkage), but usually not much more.
At a larger change, things tend to fall apart.

```console
$ bc -l
>>> scale=3
>>> l(10)/l(2)
3.321
>>> l(10)/l(1.45)
6.204
```

- When you double each year, 10x is 3.3 years, approximately.
- When you grow at Moore's Law rate, 10x is 6.2 years, approx.

In a high-growth an environment, when you write software,
you can expect it to last around 4 years or so until it needs to be re-architected in order to continue to produce the same deliverables as before.
You do not know how it will fail much in advance, nor do you know how the business environment will change much in advance:
As you grow, bottlenecks will show up in unexpected places.

If you grow faster than Moore's law, buying larger computers will not help you.
You need to buy more computers, and change your code to run in a distributed environment.
That changes performance fundamentally, and code needs to be changed in order to deal with the properties of distributed environments.
Running distributed systems will add complexity that you really do not want in order to maintain growth,
because it makes change harder and slower, which you really can't use, if you grow fast.

Finally, on top of the change in technology, you also need to deal with change in organiation,
and to integrate a lot of new people which you need in order to deal with added complexity.

That means, several unusual things are important, others that people have been trained to take as important are not.

For example, in such an environment, all software is ephemeral.
In four years time it will be largely useless.
You do not know how things will fail unless you are close to failure.
You have vision for about 12 months ahead, at most.

You will need to start to change your failing software by making architectural changes. 
You do not know if they will succeed in time.
Do not follow one plan, follow all plans and hope that at least one succeeds in time.

Cost is relevant only in the sense that you must not pay for current expenses with future growth.
You must be cash flow positive at all times,
but actual earnings are largely irrelevant until growth flattens out below 45%.
Never paying for current expense with future growth (not even for a short time) is very important, 
because you do not know if that future growth will materialize.
If you ever run into a money vaccuum, you die very suddenly.

Actual earnings are much less important. 
Not dying from growth is already hard enough,
the objective is to have new solutions in place *in time*,
and speed matters more than cost.

This is a rare environment and people are generally not trained for it. 
It goes in fact against most of what they have been trained for.
Getting that out of people's minds in order to prepare them for success in such an environment is hard,
much harder than what one would initially think,
because you have to break down decades of education they had.
You need to have then accept a reality that is very different from what they have learned.
