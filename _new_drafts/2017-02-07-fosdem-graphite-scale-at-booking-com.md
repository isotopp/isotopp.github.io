---
layout: post
status: publish
published: true
title: 'FOSDEM: Graphite @ Scale at Booking.com'
author: isotopp
author_login: kris
author_email: kristian.koehntopp@gmail.com
wordpress_id: 568
wordpress_url: http://blog.koehntopp.info/?p=568
date: '2017-02-07 22:23:09 +0100'
date_gmt: '2017-02-07 21:23:09 +0100'
categories:
- Work
- Performance
tags: []
---
<p>Validimir Smirnov gave his talk [Graphite @ Scale](https://fosdem.org/2017/schedule/event/graphite_at_scale/) at FOSDEM. The [slides](https://fosdem.org/2017/schedule/event/graphite_at_scale/attachments/slides/1721/export/events/attachments/graphite_at_scale/slides/1721/slides_graphite_at_scale.pdf)&nbsp;(PDF) are available for download, and the talk can be [downloaded](http://video.fosdem.org/2017/UB2.252A/graphite_at_scale.vp8.webm)&nbsp;(webm) as well. Booking stores about 130&nbsp;TB of data in Graphite, using 32 frontend and 200 SSD storage servers to collect 2.5M unique metric per second, &nbsp;worth 11 Gbps of traffic in the graphite backend. This is achieves mostly be replacing all parts of Graphite with API-compatible rewrites in Go and C, all of which are open source.<!--more--></p>
<p>- carbonzipper — github.com/dgryski/carbonzipper<br />
- go-carbon — github.com/lomik/go-carbon<br />
- carbonsearch — github.com/kanatohodets/carbonsearch<br />
- carbonapi — github.com/dgryski/carbonapi<br />
- carbon-c-relay — github.com/grobian/carbon-c-relay<br />
- carbonmem — github.com/dgryski/carbonmem<br />
- replication factor test — github.com/Civil/graphite-rf-test</p>
