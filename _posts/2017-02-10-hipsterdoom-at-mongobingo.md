---
layout: post
status: publish
published: true
title: Hipsterdoom with Mongobingo
author-id: isotopp
feature-img: assets/img/background/rijksmuseum.jpg
date: '2017-02-10 04:07:54 +0100'
tags:
- performance
- mongodb
- lang_en
---
Felix Gessert does a postmortem of the failed Parse startup and product:
"[The AWS and MongoDB Infrastructure of Parse: Lessons Learned](https://medium.baqend.com/parse-is-gone-a-few-secrets-about-their-infrastructure-91b3ab2fcf71#.ve5hi5lcd)".

> Technical problem II: the real problem and bottleneck was not the API
> servers but almost always the shared MongoDB database cluster.

And that was with MongoRocks (Mongo on RocksDB) and replacing the initial
app in Ruby with a Go implementation of said thing, with WriteConcern = 1,
and other horrible presets. All in all, this is like the perfect nightmare
of startup architecture decisions. Felix closes pointing at his current
project:

> If this idea sounds interesting to you, have a look at Baqend. It is a
> high-performance BaaS that focuses on web performance through transparent
> caching and scalability through auto-sharding and polyglot persistence.

Bingo. Also, found the Hipster.
