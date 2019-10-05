---
layout: post
status: publish
published: true
title: Hacking "Smart" TVs via DVB-T
author: isotopp
author_login: kris
author_email: kristian.koehntopp@gmail.com
wordpress_id: 1374
wordpress_url: http://blog.koehntopp.info/?p=1374
date: '2017-04-03 11:49:57 +0200'
date_gmt: '2017-04-03 10:49:57 +0200'
categories:
- Hackerterrorcybercyber
- Media
tags: []
---
<p>[Ars Technica reports](https://arstechnica.com/security/2017/03/smart-tv-hack-embeds-attack-code-into-broadcast-signal-no-access-required/) about a possible mass-hack of Smart TVs using the DVB-T signal: </p>
<p>> The proof-of-concept exploit uses a low-cost transmitter to embed malicious commands into a rogue TV signal. That signal is then broadcast to nearby devices. It worked against two fully updated TV models made by Samsung. By exploiting two known security flaws in the Web browsers running in the background, the attack was able to gain highly privileged root access to the TVs. By revising the attack to target similar browser bugs found in other sets, the technique would likely work on a much wider range of TVs.</p>
<p> Multimedia Stream decoding is notoriously complicated, and prone to bugs, as Google demonstrated with a whole suite of problems in the Android Stream decoders. There is no reason to assume that it's easier anywhere else. The TV sets are being fed the signal with a low-power mobile transmitter, a small fake TV station, and the attack is on the web browser that is running permanently in the background. <!--more--> https://www.youtube.com/watch?v=bOJ\_8QHX6OA</p>
