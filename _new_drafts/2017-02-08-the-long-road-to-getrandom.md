---
layout: post
status: publish
published: true
title: The long road to getrandom()
author: isotopp
author_login: kris
author_email: kristian.koehntopp@gmail.com
wordpress_id: 582
wordpress_url: http://blog.koehntopp.info/?p=582
date: '2017-02-08 07:19:17 +0100'
date_gmt: '2017-02-08 06:19:17 +0100'
categories:
- Computer Science
tags: []
---
<p>glibc 2.25 is now out. One of the new things in this release are the getrandom() and getentropy() calls, which finally are making Linux kernel features available at the library level. [LWN explains why it took so long](https://lwn.net/Articles/711013/), and it is an interesting read. The [feature request](https://sourceware.org/bugzilla/show_bug.cgi?id=17252) dates back from three years ago, and kernel 3.17.</p>
