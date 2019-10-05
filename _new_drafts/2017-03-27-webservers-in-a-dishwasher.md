---
layout: post
status: publish
published: true
title: Webservers in a Dishwasher
author: isotopp
author_login: kris
author_email: kristian.koehntopp@gmail.com
wordpress_id: 1312
wordpress_url: http://blog.koehntopp.info/?p=1312
date: '2017-03-27 13:52:24 +0200'
date_gmt: '2017-03-27 12:52:24 +0200'
categories:
- Hackerterrorcybercyber
tags: []
---
<p>The Register reports on&nbsp;CVE-2017-7240, Web Server Directory Traversal in the&nbsp;Miele Professional PG 8528 Dishwasher (which is used in medical establishments to clean and properly disinfect laboratory and surgical instruments). Yes, Dishwashers (and many microwaves and ovens) now come with touch screens, and network ports. Of course, as El Reg puts it</p>
<p>> Appliance makers: stop trying to connect to the Internet, you're no good at it. ®</p>
<p> but in this case the webserver even makes sense. The [PG 8528](https://www.miele.nl/professional/grote-reinigings-en-desinfectieautomaten-560.htm?mat=10339600&name=PG_8528) is a commercial washer and desinfector for hospitals and probably comes with remote service and diagnostics. That makes it even worse that Miele has no security process for these devices at all: </p>
<p>> And because Miele is an appliance company and not a pure-play IT company, it doesn't have a process for reporting or fixing bugs.</p>
<p> Miele did not respond to the bug report they received in November 2016, ever.</p>
