---
layout: post
status: publish
published: true
title: 'Google: "Federated learning", Apple: "Differential privacy"'
author: isotopp
author_login: kris
author_email: kristian.koehntopp@gmail.com
wordpress_id: 1897
wordpress_url: http://blog.koehntopp.info/?p=1897
date: '2017-06-12 13:00:18 +0200'
date_gmt: '2017-06-12 12:00:18 +0200'
categories:
- Computer Science
- Deutschland
- Neuland
tags: []
---
<p>Google is using a strategy called "[Federated Learning](https://www.engadget.com/2017/04/07/gboard-studies-your-behavior-without-sending-details-to-google/)" to keep privacy sensitive data being used for AI purposes private. They basically download a preliminary model to the phone, modify the data with the observed behavior on the phone and upload the diffs back to Google Cloud, where they merge it to the existing data. Apple uses "[Differential Privacy](https://blog.cryptographyengineering.com/2016/06/15/what-is-differential-privacy/)", where they add noise to the data so that observed privacy sensitive data observed in the cloud for one user may or may not be actually true, but individual noise contributions even out statistically over the whole data set. Meanwhile, #neuland talks about Datenkraken and does… nothing?</p>
