---
layout: post
status: publish
published: true
title: How do people develop for MacOS at scale?
author: isotopp
author_login: kris
author_email: kristian.koehntopp@gmail.com
wordpress_id: 2591
wordpress_url: http://blog.koehntopp.info/?p=2591
date: '2017-09-14 09:39:55 +0200'
date_gmt: '2017-09-14 07:39:55 +0200'
categories:
- Apple
tags: []
---
<p>So, how do people develop people for MacOS at scale? Normal people throw compile jobs at their Kubernetes cluster, and fan out a compile across some two racks full of 50 core machines, giving you some 4000 cores to play with for distributed compiles. Is there a MacOS LLVM docker image that runs the Xcode compiler in Linux containers and that can be plugged into this? Or are people piling Mac mini and Mac pro or other unrackable bullshit with insufficient remote management into racks, creating a nightmare farm of snowflakes? How does Apple itself do this? Like animals, on the Desktop? And how do you integrate such a remote compile farm into Xcode?</p>
