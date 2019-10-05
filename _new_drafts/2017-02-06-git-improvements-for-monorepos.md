---
layout: post
status: publish
published: true
title: git Improvements for Monorepos
author: isotopp
author_login: kris
author_email: kristian.koehntopp@gmail.com
wordpress_id: 418
wordpress_url: http://blog.koehntopp.info/?p=418
date: '2017-02-06 09:44:00 +0100'
date_gmt: '2017-02-06 08:44:00 +0100'
categories:
- Computer Science
- Erklärbär
tags: []
---
<p>Microsoft has been doing things to git, [they report](https://blogs.msdn.microsoft.com/visualstudioalm/2017/02/03/announcing-gvfs-git-virtual-file-system/).</p>
<p>> [W]e […]&nbsp;have a handful of teams with repos of unusual size! For example, the Windows codebase has over 3.5 million files and is over 270 GB in size. The Git client was never designed to work with repos with that many files or that much content. You can see that in action when you run “git checkout” and it takes up to 3 hours, or even a simple “git status” takes almost 10 minutes to run. That’s assuming you can get past the “git clone”, which takes 12+ hours.</p>
<p> What Microsoft is doing here is called a Monorepo approach. It not insane, has many advantages and is being discussed at length at [Dan Luu](http://danluu.com/monorepo/), and is also in use with [Facebook](https://code.facebook.com/posts/218678814984400/scaling-mercurial-at-facebook/)&nbsp;and [Google](http://cacm.acm.org/magazines/2016/7/204032-why-google-stores-billions-of-lines-of-code-in-a-single-repository/fulltext)&nbsp;and [in many](https://syslog.ravelin.com/multi-to-mono-repository-c81d004df3ce#.sjy8e9wtm)&nbsp;[other places](http://blog.shippable.com/our-journey-to-microservices-and-a-mono-repository). But git is running into problems handling very large Monoreports, as discussed in [an article at Atlassian](https://developer.atlassian.com/blog/2015/10/monorepos-in-git/). What Microsoft GVFS does, according to their paper, is addressing the issues git has instead of working around them. And that is an awesome thing.</p>
