---
layout: post
status: publish
published: true
title: Google Next 2017, Amsterdam Edition
author: isotopp
author_login: kris
author_email: kristian.koehntopp@gmail.com
wordpress_id: 1965
wordpress_url: http://blog.koehntopp.info/?p=1965
date: '2017-06-23 14:31:30 +0200'
date_gmt: '2017-06-23 13:31:30 +0200'
categories:
- Conferences and Events
- Containers and Kubernetes
tags: []
---
<p>On June, 21 there was the ["Google NEXT" conference, 2017 edition](https://cloudplatformonline.com/Next-Amsterdam-2017-Schedule.html), in the Kromhouthal in Amsterdam. Google had a dedicated ferry running to ship people over to the IJ north side, delivering directly at the Kromhouthal.</p>
<p>&nbsp;</p>
<p>The event was well booked, about 1400 people showing up (3500 invites sent). That is somewhat over the capacity of Kromhouthal, actually, and it showed in the execution in several places (Toilet, Catering, and room capacity during keynotes).</p>
<p>&nbsp;</p>
<p>The keynotes were the expected self-celebration, but if you substract that, they were mostly useful content about the future of K8s, about Googles Big Data offerings and about ML applications and how they work together with Big Data.</p>
<p>&nbsp;</p>
<p>For the two talk slots before the lunch, I attended K8s talks. After lunch, I switched to the Big Data track. I did not attend any ML stuff, and I missed the last talk about Spanner because I got sucked into a longer private conversation.</p>
<p><!--more--></p>
<p>The first talk was »Resilient Microservices with Containers, Kubernetes and Google Cloud« with Matt Feigal. A video of a differerent edition of that talk is [available](https://www.youtube.com/watch?v=eV1M6-x4pl4). It's a pretty basic Kubernetes introduction, and it shows that what Google are running is not that different at all from a regular K8s install.</p>
<p>&nbsp;</p>
<p>The second talk was about K8s and new features, and contains a good overview about future direction in K8s. Most of that was already known from Kubecon in Berlin, or even was available earlier as part of Openshift Origin. Much of the new features that are entering mainstream K8s - RBAC, Persistent Volume Claims and stuff are already reality for Origin users.</p>
<p>&nbsp;</p>
<p>The main new thing that Google was promoting was [Istio](https://github.com/istio/istio), the outcome of their cooperation with IBM and Lyft on Envoy. &nbsp;Linkerd and Istio seem to share a common purpose and have a very large but not complete feature overlap.</p>
<p>&nbsp;</p>
<p>I find this a bit confusing, because Linkerd is an official CNCF thing, Istio is promoted big time by Google, and Google is close to CNCF. CNCF is supposed to be opinionated, and avoiding a new "Openstack Big Tent" is part of their unstated mission profile. </p>
<p>It is pretty clear that Istio will dominate with Google and IBM behind it, and the Linkerd people seem to think the same, as they are preparing to integrate and cooperate.</p>
<p>&nbsp;</p>
<p>After Lunch, Big Data:</p>
<p>&nbsp;</p>
<p>»Introduction to big data: tools that deliver deep insights« That was a shallow and introductory talk.</p>
<p>&nbsp;</p>
<p>»Moving your Spark and Hadoop workloads to Google Cloud Platform« was much more interesting, because it explained how one customer was getting rid of their internal Hadoop and moved all their Big Data into the Google Cloud. Another version of that talk can be seen [here](https://www.youtube.com/watch?v=NfxvjWSgplU).</p>
<p>&nbsp;</p>
<p>It outlined how data synchronisation and feeding a remote Hadoop might work. I also shows how Google actually deploys Hadoop and why this works (and with proper networking, anybody could do the same on-prem, actually): </p>
<p>&nbsp;</p>
<p>They _do_ have a location independent data center since 2012, so any core in a data center can talk to any disk in any other machine in the same data center at a speed that saturates that core, at about 1 GBit/s per core or thread. That is not a thing that is impossible build for anyone in 2017, should they want to. Any beefy leaf-and-spine network can grow to match this.</p>
<p>&nbsp;</p>
<p>Having that ability, they containerized their Hadoop and they spawn Hadoop processing clusters as needed inside their container ecosystem, letting the Hadoop containers access data on their HDFS or HDFS-equivalent (not that Hadoop cares much) anywhere in the DC.</p>
<p>&nbsp;</p>
<p>This invalidates one original Hadoop assumption "code is smaller than the data, so bring the code to the data instead of the traditional other way around". It can do that, because networks have grown, and network capacities inside the data center can now be provided technically and economically at in-computer bus speeds (modulo latencies, but Hadoop is never about latencies). This insight turns the traditional Hadoop design ideas upside down, and gives you ephemeral clusters.</p>
<p>&nbsp;</p>
<p>All the problems with Hadoop, Upgrades, User separation and the lack thereof, long term stability of it ("parts fall off under load, like with Lego models") and the likes, go away because entire clusters go away after use. It's always new and fresh, and current, and you are always alone on it.</p>
<p>And anyone with a beefy datacenter network could do the same.</p>
<p>&nbsp;</p>
<p>Next talk was »Processing data at scale with Google Cloud Bigtable, Dataflow, and Dataproc«, deepening the explanation of their clusters, and showing a cluster processing stuff growing from 5 nodes to 50 while the query was running. That was a pretty awesome demo, as was running a query searching through 1 PB of data with 3000 nodes (at approximately one aggregated CPU day, for 10 EUR for processing the single query).</p>
<p>&nbsp;</p>
<p>I did not attend »Cloud Spanner 101: Google's mission-critical relational database« as planned. A recoding of a different instance of this talk is available [here](https://www.youtube.com/watch?v=cOANqaMnkNE), though.</p>
