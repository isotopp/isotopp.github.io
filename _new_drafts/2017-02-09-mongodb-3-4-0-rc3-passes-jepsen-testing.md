---
layout: post
status: publish
published: true
title: MongoDB 3.4.0-rc3 passes Jepsen testing
author: isotopp
author_login: kris
author_email: kristian.koehntopp@gmail.com
wordpress_id: 665
wordpress_url: http://blog.koehntopp.info/?p=665
date: '2017-02-09 09:12:16 +0100'
date_gmt: '2017-02-09 08:12:16 +0100'
categories:
- Computer Science
tags: []
---
<p>MongoDB 3.4.0-rc3 with v1 replication protocol and majority write concern manages to pass Jepsen testing, says [jepsen.io](https://jepsen.io/analyses/mongodb-3-4-0-rc3). That is quite an achievement. [Jepsen](https://github.com/jepsen-io/jepsen) is a&nbsp;framework for distributed systems verification, with fault injection. It allows reliable diagnosis of Heisenbugs in distributed systems, with a clear analysis of the conditions that lead to the fault. By this, Jepsen testing allowed for the first time systematic testing and debugging of distributed systems and the real-world implementations of the consistency protocols in them. It's built largely on the work of [Kyle Kingsbury](https://aphyr.com/about).</p>
