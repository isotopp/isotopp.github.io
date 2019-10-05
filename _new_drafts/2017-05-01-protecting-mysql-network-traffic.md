---
layout: post
status: publish
published: true
title: Protecting MySQL Network Traffic
author: isotopp
author_login: kris
author_email: kristian.koehntopp@gmail.com
wordpress_id: 1648
wordpress_url: http://blog.koehntopp.info/?p=1648
date: '2017-05-01 10:05:00 +0200'
date_gmt: '2017-05-01 09:05:00 +0200'
categories:
- MySQL
- Hackerterrorcybercyber
tags: []
---
<p>Percona Live Talk by Daniël van Eeden: Protecting MySQL Network Traffic. **Warning:** It is somewhat more complicated than this: [caption id="attachment\_1649" align="aligncenter" width="458"][![](http://blog.koehntopp.info/wp-content/uploads/2017/05/protecting-mysql-network-traffic.jpg)](https://www.slideshare.net/dveeden/protecting-my-sql-network-traffic) [Slideshare](https://www.slideshare.net/dveeden/protecting-my-sql-network-traffic)[/caption] Check out the performance slide (#22), too. **Tl;Dr:** You want a MySQL compiled against OpenSSL, because SSL Tickets and AES-NI support. YaSSL sucks, hard. With Tickets and hardware symmetric encryption, TLS support in MySQL is actually no longer slow. **Tl;DR 2:** MariaDB is actually pretty well positioned here.</p>
