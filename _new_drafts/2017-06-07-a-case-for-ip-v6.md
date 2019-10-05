---
layout: post
status: publish
published: true
title: A case for IP v6
author: isotopp
author_login: kris
author_email: kristian.koehntopp@gmail.com
wordpress_id: 1865
wordpress_url: http://blog.koehntopp.info/?p=1865
date: '2017-06-07 09:09:11 +0200'
date_gmt: '2017-06-07 08:09:11 +0200'
categories:
- Work
- Containers and Kubernetes
tags: []
---
<p>So when companies talk about IP V6, it is very often at the scope of "terminating V6 at the border firewall/load balancer and then lead it as V4 into the internal network. Problems that arise there are most often tracking problems (»Our internal statistics can't handle V6 addresses in Via: headers from the proxy«). But when you do containers, the need for V6 is much more urgent and internal. Turns out that Docker Port Twiddling is exactly the nuisance that it looks like and networkers strongly urge you to surgically remove all traces of native Docker networking bullshit and go all in on IP-per-Container. Mostly, because that's what IPs are for: Routing packets, determining their destination and stuff. Networkers have ASICs and protocols that are purpose-built for this stuff. Now, let us assume you have a modern 40- or 56-core machine that you are running stuff on in your Kubernetes cluster. It means that you will easily at least 30 and up to 100 pods per machine. In a moderately sized cluster with some 100 nodes you get to use 100x100, 10.000 IPs to handle that. And because IP space is not handed out in sets of one, but in the form of subnets per node, you will have need for more than 10k addresses. Expect to consume a /17 or /16 to handle this. Even if you are digging into 10/8 for internal addressing here, this is going to be a problem - it's unlikely that you will be able to use all of 10/8, because non-cluster things exist, too, in your environment, and you will likely have more than one cluster. With V6, things are becoming a complete non-issue, with the minor issue of getting V6 running on the inside of your organisation.</p>
