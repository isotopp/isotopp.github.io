---
layout: post
status: publish
published: true
title: Using a blade center chassis to make Döner Kebap
author: isotopp
author_login: kris
author_email: kristian.koehntopp@gmail.com
wordpress_id: 673
wordpress_url: http://blog.koehntopp.info/?p=673
date: '2017-02-09 15:04:33 +0100'
date_gmt: '2017-02-09 14:04:33 +0100'
categories:
- Data Centers
tags: []
---
<p>I had the opportunity to play with a Blade Center Chassis with 16 Blades, each of them a [Dual-E5 2690v4](http://ark.intel.com/products/91770/Intel-Xeon-Processor-E5-2690-v4-35M-Cache-2_60-GHz), so 56 threads (28 cores) times 16.</p>
<p>    $ mkdir mprime; \ ] cd mprime; \ ] wget http://www.mersenne.org/ftp\_root/gimps/p95v2810.linux64.tar.gz; \ ] tar xvzf p95v2810.linux64.tar.gz; \ ] ./mprime -m {% endhighlight %} running with "stress test only", "mode 1 - small FFT" and 56 cores gets me quite a bit of power consumption. Idle Blades is being reported as 140W, busy blades are 400W. Images below the fold. <!--more--> [caption id="attachment\_674" align="aligncenter" width="390"] ![](http://blog.koehntopp.info/wp-content/uploads/2017/02/chassis-load-test2.png) Blade 16 is idle, the rest is running mprime[/caption] [caption id="attachment\_675" align="aligncenter" width="1086"] ![](http://blog.koehntopp.info/wp-content/uploads/2017/02/chassis-load-test.png) One of two PDU, powering the Chassis, a Solidfire Unit (~320W) and a ToR Switch.[/caption] 6400W reported by the blades, 6820W reported by the chassis, 2x 3.75kW reported by the PDU (plus a Solidfire Unit and a ToR-Switch). 7000W are 9.4HP, so a [1949 2CV Type A](https://en.wikipedia.org/wiki/Citro%C3%ABn_2CV). &nbsp; [caption id="attachment\_680" align="aligncenter" width="300"][![](http://blog.koehntopp.info/wp-content/uploads/2017/02/Citroen2cvtff-300x203.jpg)](https://en.wikipedia.org/wiki/Citro%C3%ABn_2CV#/media/File:Citroen2cvtff.jpg) 1949 2CV Type A, Foto by [Jamieli](https://en.wikipedia.org/wiki/Citro%C3%ABn_2CV#/media/File:Citroen2cvtff.jpg)[/caption]</p>
