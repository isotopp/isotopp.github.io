---
layout: post
status: publish
published: true
title: TR069 meets Brickerbot and friends
author: isotopp
author_login: kris
author_email: kristian.koehntopp@gmail.com
wordpress_id: 1584
wordpress_url: http://blog.koehntopp.info/?p=1584
date: '2017-04-26 20:23:08 +0200'
date_gmt: '2017-04-26 19:23:08 +0200'
categories:
- Hackerterrorcybercyber
tags: []
---
<p>[Bleepingcomputer has a report](https://www.bleepingcomputer.com/news/security/us-isp-goes-down-as-two-malware-families-go-to-war-over-its-modems/) on the californian ISP Sierra Tel, who apparently has visitors ([JPG of letter](https://www.bleepstatic.com/images/news/u/986406/Malware/IoT/SierraTel.jpg)) over at their customers TR069 interfaces. [TR069](https://en.wikipedia.org/wiki/TR-069) is the config interface of home DSL equipment, and if it is insufficiently secured, can be used to own each and every home DSL router of an ISP. Which happened to Sierra, twice, simultaneously. Which did not improve the results at all. </p>
<p>> "BrickerBot was active on the Sierra Tel network at the time their customers reported issues," Janit0r told Bleeping Computer in an email, "but their modems had also just been mass-infected with malware, so it's possible some of the network problems were caused by this concomitant activity." Janit0r suggested the other culprit was Mirai, a malware also known to cause similar issues.</p>
<p> Mirai is also the malware that disabled a bunch of German and British Telekom modems earlier this year. &nbsp;</p>
