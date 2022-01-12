---
author: isotopp
date: "2017-02-07T14:43:21Z"
feature-img: assets/img/background/rijksmuseum.jpg
published: true
status: publish
tags:
- container
- erklaerbaer
- lang_en
title: 'FOSDEM Talk: cgroups-v2'
---
![](/uploads/2017/02/cgroups-v2.png)


[The talk](https://fosdem.org/2017/schedule/event/cgroupv2/)

The cgroups-v2 API is incompatible with cgroups-v1. This is a good thing,
because the initial use cases for cgroups have not been fleshed out
properly, and the API is kind of overly complicated from the POV of the
consumers. v2 is being built with use cases and experience in mind, and is
much easier to use. Control groups allow Linux users to limit the kind and
amount of resources being used, which is employed by systemd, container
drivers and many other things.
