---
layout: post
status: publish
published: true
title: On Sandboxing, and Linux distro differences
author: isotopp
author_login: kris
author_email: kristian.koehntopp@gmail.com
wordpress_id: 555
wordpress_url: http://blog.koehntopp.info/?p=555
date: '2017-02-07 22:02:41 +0100'
date_gmt: '2017-02-07 21:02:41 +0100'
categories:
- Computer Science
- Hackerterrorcybercyber
tags: []
---
<p>[caption id="attachment\_556" align="alignleft" width="150"][![](http://blog.koehntopp.info/wp-content/uploads/2017/02/DanWalsh-150x150.jpg)](https://people.redhat.com/dwalsh/) Dan Walsh, Redhat, SELinux Developer, [weeps when you disable SELinux](https://stopdisablingselinux.com/)[/caption] On one end of the spectrum, LearntEmail points to [Stop Disabling SELinux](https://stopdisablingselinux.com/) and asks us to instead set up proper sandboxes to contain software: [SELinux - A Real-World Guide](https://learntemail.sam.today/blog/stop-disabling-selinux:-a-real-world-guide/). On the other hand,&nbsp;Kristaps Dz explains how differences in Linux Distros, Libraries and other environmental factors [make it very hard to define sandboxes in a portable way](https://github.com/kristapsdz/acme-client-portable/blob/master/Linux-seccomp.md) (seccomp, in this case), so that they can be shipped with an application, such as the Let's Encrypt ACME client he develops. The [LWN Article](https://lwn.net/Articles/713464/#Comments) pointing to this has interesting discussion. There is a lot to be learnt between these two extremes, for example why we can't have nice things.</p>
