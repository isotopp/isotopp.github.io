---
layout: post
status: publish
published: true
title: Secure defaults kind of matter…
author: isotopp
author_login: kris
author_email: kristian.koehntopp@gmail.com
wordpress_id: 116
wordpress_url: http://blog.koehntopp.info/?p=116
date: '2017-01-26 07:12:49 +0100'
date_gmt: '2017-01-26 06:12:49 +0100'
categories:
- Hackerterrorcybercyber
tags: []
---
<p>snyk writes on [secure defaults](https://snyk.io/blog/mongodb-hack-and-secure-defaults/): Before version 2.6.0 hipster data "store" MongoDB did not by default require authentication (wait, what?) and also did bind to \* instead of 127.0.0.1. As a result, by default, each MongoDB data "store" has been accessible from the entire internet. Scanners such as [Shodan](https://www.shodan.io/) provide an index to all such MongoDB installations on the entire Internet. Enterprising anonymous "hackers" have monetized this opportunity by accessing these installations over the Internet, encrypting the data and then accepting Bitcoin for the decryption password - or scamming the installations owner, assuming that people who put production data on internet-wide installations with unauthenticated access deserve to be conned and then conned over again. Other hipster data stores, including Elastic Search, CouchDB and Redis, are known to have similar access properties. NoSQL might actually mean "NoSequrity".</p>
