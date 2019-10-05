---
layout: post
status: publish
published: true
title: Cloud Costs
author: isotopp
author_login: kris
author_email: kristian.koehntopp@gmail.com
wordpress_id: 1774
wordpress_url: http://blog.koehntopp.info/?p=1774
date: '2017-05-18 09:20:16 +0200'
date_gmt: '2017-05-18 08:20:16 +0200'
categories:
- Containers and Kubernetes
tags: []
---
<p>Cloud cost models are sometimes weird, and billing sometimes is not quite transparent. The cost model can also change at will. The [Medium story reported by Home Automation](https://medium.com/@contact_16315/firebase-costs-increased-by-7-000-81dc0a27271d) is an extreme example, and contains a non-trivial amount of naiveté on their side, but underlines the importance of being spread through more than one cloud provider and having an exit strategy. Which is kind of a dud, if you are using more than simple IaaS - if you tie yourself to a database-as-a-service offer, you can't really have an exit strategy at all. &nbsp; TL;DR: Firebase accidentally wasn't billing some traffic, and fixed that (the billing). They did not communicate the change, they did not update their status panels to report the increased traffic, and they did not measure the billing impact of their change to find extreme cases before the change and contact them. The customer, Home Automation, has close to zero clue to using TLS correctly, was using connection inefficiently and kind of maximised overhead, ran into the worst case scenario for the change, got fucked. They would want out, but also had zero strategy for that, because DBaaS fuckup. In the cloud you don't need operations. Until you do.</p>
