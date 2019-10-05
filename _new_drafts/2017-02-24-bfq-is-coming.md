---
layout: post
status: publish
published: true
title: BFQ is coming…
author: isotopp
author_login: kris
author_email: kristian.koehntopp@gmail.com
wordpress_id: 852
wordpress_url: http://blog.koehntopp.info/?p=852
date: '2017-02-24 13:06:36 +0100'
date_gmt: '2017-02-24 12:06:36 +0100'
categories:
- Data Centers
- Performance
- Containers and Kubernetes
tags: []
---
<p>[LWN reports](https://lwn.net/SubscriberLink/715161/7c1e073fabf2bc6e/) that the 4.11 merge window opens. Among other things, [Maik Zumstrull reminds us](https://plus.google.com/+MaikZumstrull/posts/3Y9qwACRpvA),&nbsp;we get </p>
<p>> The multiqueue block layer finally has [support for I/O scheduling](https://lwn.net/Articles/709202/). That is useful in its own right, but the real news is that it enables the merging of the long-awaited [BFQ I/O scheduler](https://lwn.net/Articles/674308/). That, [says block maintainer Jens Axboe](https://git.kernel.org/cgit/linux/kernel/git/torvalds/linux.git/commit/?id=772c8f6f3bbd3ceb94a89373473083e3e1113554), "should be ready for 4.12".</p>
<p> Of course, if you are on a LTS release of a Linux kernel, it's unlikely that you will profit from this any time soon.</p>
