---
layout: post
title:  'Waffle House Index of Tooling'
author-id: isotopp
feature-img: assets/img/background/rijksmuseum.jpg
date: 2020-06-08 11:46:42 +0200
tags:
- lang_en
- devops
- performance
---
Charity Majors was [on fire and on target, again](https://twitter.com/mipsytipsy/status/1268418428542443520):

[![](/uploads/2020/06/waffle-house-index.png)](https://twitter.com/mipsytipsy/status/1268418428542443520)

What is a [Waffle House Index](https://en.wikipedia.org/wiki/Waffle_House_Index#Levels)?
> The Waffle House Index is an informal metric named after the Waffle House restaurant chain and is used by the Federal Emergency Management Agency (FEMA) to determine the effect of a storm and the **likely scale of assistance required for disaster recovery**.

A "Waffle House Index for Tooling" would be an indicator how bad the situation on the ground in an IT department is. Charity Majors suggest "CPU load alerts" as a tooling emergency indicator.

Why? CPU load or %CPU used is a useful metric, because it tells you how "full" the compute part of a thing is.

### "Rightsizing capacity" is not easy

Alerting on it is a very weird idea, though, and still I find people doing this all of the time. Usually these people are in dire need of a better education, though.

If you right size your infrastructure, your goal is to have as little overhead as possible in provisioned resources: Only provision as little as needed, just as much as necessary to deliver.

But if you did that, a CPU alert would be going off all of the time, because ideally you want your boxes loaded to the limit, right?

### Alerting or provisioning?

Or you can't, because this is complicated: there are a lot of preconditions that go into even being able to load boxes to this limit. If you can't, then a CPU load alert would also be useless, because it would either never fire, or if it did, it would be too late.

Web workloads, specifically, are usually spiky. Your workload may be within the provisioned capacity most of the time, but there will be very sudden, very short spikes that are not. These spikes are usually way shorter than the time it takes to grow your capacity. The way to handle that is to provision not for a median needed capacity, or even low 90ies percentile of required capacity, but to provision for max or 99.9 in order to be able to ride the waves.

If you alert on CPU load in such an environment, by the time the alert goes off, it will be too late already. Also, if you could alert, you could also size.

### Experimentation has effects on capacity

Or you may be in an environment where the code is unpredictable, because you change it a lot with experiments going in and out of the codebase, or from 1%-on to full-on.

When experimenting, it is important to expose code to users really quickly. That code being efficient is not a priority, because most of it will be scrapped as having a net-negative outcome anyway. It is not worth it putting engineering into code before you have the business side of things right.

Being able to run experiments means you need to overprovision capacity. 

### Detailed, many-dimensional, highly tagged metrics

But that of course means you need to alert on change in variants, and compare code path variants not only with respect to business metrics, but also on technical metrics in order to offset business wins. With proper experimentation, you cannot only say "This code is making us x Euro/h richer than the base variant." You also need to be able to say "To run this we will have to pay y Euro/h more" and "Refactoring this for efficiency will cost z Euro in Engineering Time over a potential lifecycle of n hours, so y Euro/h more".

This not only enables quantified reasoning over the change the experiment introduces, but also about how to proceed with the codebase when it goes full-on: Do we leave it as is and just buy more machinery, or do we put engineers on it to make it nice?

### Production load testing numbers for capacity

But in order to allow developers to experiment safely, you need to have accurate capacity metrics, which CPU load is not. Testing in production, safely, specifically automated load tests with actual production users and separate monitoring of experiment codepathes (and consumption attribution at the request level to experiment variants) will provide these numbers.

And that is the way to go: From reactive scaling ("CPU Load too high, raise capacity") to predictive scaling ("Our capacity is x req/m per box, and we have n. Evening peak will be m, so we need y boxen more by 16:00."). Which brings us back to the spiky loads where we started.

## TL;DR

- If CPU load alerting worked, reactive autoscaling would work, too.
- In a web workload environment, it usually doesn't.
- If you experiment, you need to attribute cost and benefit to experiment variants.
  - That means load tests with production users.
  - That means detailed, many-dimensional metrics with many tags, and a lot of ad-hoc metrics exploration.
- Once you have that, you are also ready for predictive autoscaling, which actually works.

and

- If your shop uses CPU load alerting, chances are that their tooling and education is in need of emergency updating.