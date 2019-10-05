---
layout: post
status: publish
published: true
title: How large can MySQL be in production?
author: isotopp
author_login: kris
author_email: kristian.koehntopp@gmail.com
wordpress_id: 2219
wordpress_url: http://blog.koehntopp.info/?p=2219
date: '2017-07-26 09:19:45 +0200'
date_gmt: '2017-07-26 08:19:45 +0200'
categories:
- MySQL
tags: []
---
<p>[JF has been going through a number of production systems](http://jfg-mysql.blogspot.nl/2017/07/how-far-with-mysql-mariadb.html) in his zoo and collected a few specimen that are outstanding in one way or the other. He has systems in production with 8.2T in a single table, 37T of data, and with 336.000 tables. Many of them are replicated, some are not (but use other methods for redundancy).</p>
