---
layout: post
status: publish
published: true
title: You keep using that word…
author: isotopp
author_login: kris
author_email: kristian.koehntopp@gmail.com
wordpress_id: 1501
wordpress_url: http://blog.koehntopp.info/?p=1501
date: '2017-04-19 09:38:52 +0200'
date_gmt: '2017-04-19 08:38:52 +0200'
categories:
- Computer Science
- Fluffy Fluff
tags: []
---
<p>[![](http://blog.koehntopp.info/wp-content/uploads/2017/04/Screen-Shot-2017-04-19-at-10.31.50.png)](https://twitter.com/HPE_UKI/status/806151230762418176)[![](http://blog.koehntopp.info/wp-content/uploads/2017/04/you-keep-using-that-word.jpg)](https://en.wikipedia.org/wiki/The_Princess_Bride_(film))<!--more--> Traditionally, networked storage is using their own storage network with their own storage networking technology. You have two completely different networks, the production IP network for Internet access, and the storage network, for example FC/AL, using different cables, switches, network cards and maintaining two different topologies. Convergence using technologies such as iSCSI means that storage and production IP network both run on the same technology, using the same switches, cards and protocols. Both networks may still be separated to some degree, because data is kept on filers, and filers have some replication&nbsp;traffic for redundancy, which may be kept off the production IP network. Hyperconvergent systems use the disks in your servers to construct distributed storage using things such as GlusterFS, Ceph, HDFS, Quobyte or other services. In this case, your production IP network is carrying also a lot of replication traffic, and unlike with traditional IP networks the predominant traffic pattern is not from the server to teh Interwebz (North-South), but from a server to disks in other servers, crossing top of rack switches (East-West). It requires a different kind of data center fabric. Nothing of this is in any way special to healthcare, nor revolutionary.</p>
