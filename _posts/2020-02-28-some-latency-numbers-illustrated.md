---
layout: post
title:  'Some latency numbers illustrated'
author-id: isotopp
feature-img: assets/img/background/rijksmuseum.jpg
date: 2020-02-28 10:45:23 +0100
tags:
- lang_en
- database
- performance
---
These images are older than time itself. I picked them up while working as a consultant for MySQL AB, but I do not know the source.

Here are some important latency numbers. A pixel is a nanosecond (nano = 10^-9, a billionth of a second, 1 billion events/s = 1 GHz):

![](/uploads/2020/02/latency-top.gif)

And below is the HDD disk seek latency in full at the same scale. An uncached index access can result in up to 5 disk seeks, worst case.

Each waiting core in a 3 GHz computer cannot execute 3 million clock cycles per millisecond wait, so 13.7ms disk seek 41.1 million clock cycles wait time per stalled core.

That is why we give so much memory to index and data memory caches in databases. This is why InnoDB page compression exists.

This is also why SSD and NVME flash are so important to database people.

This is also why it is important that your queries use indexes, and why you should batch queries. That is, "select a, b c from t where id in (...)" instead of a query per id-value in a loop.

Not graphed: Talking to a service in another data center, for example talking to a web service in the cloud from on-premises, or talking to a service in one cloud from another cloud. Assume 10ms, or approximately one HDD disk seek for this.

If that service does not have an API that allows batching and/or asynchronous operation, they are maybe not entirely appropriately aware of performance issues.

Please zoom in for details:

![](/uploads/2020/02/latency.gif)