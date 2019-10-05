---
layout: post
status: publish
published: true
title: Kissing "sex enum('m', 'f') not null" goodbye.
author: isotopp
author_login: kris
author_email: kristian.koehntopp@gmail.com
wordpress_id: 2839
wordpress_url: http://blog.koehntopp.info/?p=2839
date: '2017-11-08 11:13:33 +0100'
date_gmt: '2017-11-08 10:13:33 +0100'
categories:
- MySQL
- Deutschland
tags: []
---
<p>The german constitutional court just created a major database upgrade problem, for good: [They mandated a positively stated third gender](http://www.spiegel.de/panorama/justiz/verfassungsgericht-fordert-anerkennung-dritten-geschlechts-eintrag-in-geburtenregister-a-1176974.html). That basically makes this code illegal:</p>
<p>     CREATE TABLE t ( ... sex enum('m', 'f') not null, ... ); {% endhighlight %} as this would force a decision between the only alternatives male and female. Also, code like <!--more--></p>
<p>         CREATE TABLE t ( ... sex enum('m', 'f') null, ... ); {% endhighlight %} is now illegal, because leaving it empty is also not an option according to the ruling. There must be a third option. For many systems the easy way out might be "Do we even need to know", deleting the existing gender information and stop collecting. For many others it might be "This is not about Gender, but about your desired mode of address". That leads back to a necessary language and grammar update for German, as the language does have three grammatical genders (male, female, neutrum), but it lacking a truly gender neutral mode of address. German "Es" ("it") is understood to be derogatory or offensive by many, because it conveys a meaning of thing, it objectifies.</p>
