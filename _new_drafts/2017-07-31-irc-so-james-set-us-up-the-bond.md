---
layout: post
status: publish
published: true
title: 'IRC so: James set us up the bond'
author: isotopp
author_login: kris
author_email: kristian.koehntopp@gmail.com
wordpress_id: 2316
wordpress_url: http://blog.koehntopp.info/?p=2316
date: '2017-07-31 15:35:15 +0200'
date_gmt: '2017-07-31 13:35:15 +0200'
categories:
- Fluffy Fluff
- Networking
tags: []
---
<p>     modprobe bonding echo '+james' \> /sys/class/net/bonding\_masters echo '-bond0' \> /sys/class/net/bonding\_masters echo -n 100 \> /sys/class/net/james/bonding/miimon echo balance-alb \> /sys/class/net/james/bonding/mode ip addr add 91.215.157.196/28 dev james ip link set james up ip link set eno1 master james ip link set eno2 master james #Bond: james bond #or "james set us up the bond" {% endhighlight %} via Eric Herman</p>
