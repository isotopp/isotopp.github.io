---
layout: post
status: publish
published: true
title: So when is Pre-Increment not $v += 1?
author: isotopp
author_login: kris
author_email: kristian.koehntopp@gmail.com
wordpress_id: 945
wordpress_url: http://blog.koehntopp.info/?p=945
date: '2017-03-03 10:31:03 +0100'
date_gmt: '2017-03-03 09:31:03 +0100'
categories:
- Computer Science
tags: []
---
<p>This is some really old stuff, but unlike most of the weirdness of old PHP, it's still there even in PHP 7. You probably should never use "++" and "--" operators in PHP.</p>
<p>     $ php -v PHP 7.0.15-0ubuntu0.16.04.4 (cli) ( NTS ) Copyright (c) 1997-2017 The PHP Group Zend Engine v3.0.0, Copyright (c) 1998-2017 Zend Technologies with Zend OPcache v7.0.15-0ubuntu0.16.04.4, Copyright (c) 1999-2017, by Zend Technologies $ php -r '$a = "1z"; $a += 1; echo $a, "\n";' 2 $ php -r '$a = "1z"; echo ++$a, "\n";' 2a $ php -r '$a = "aa"; echo ++$a, "\n";' ab {% endhighlight %} I wonder which old shit prevented the PHP Core Team from fixing this.</p>
