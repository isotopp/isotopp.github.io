---
layout: post
status: publish
published: true
title: Netflix vs. IP v6
author: isotopp
author_login: kris
author_email: kristian.koehntopp@gmail.com
wordpress_id: 545
wordpress_url: http://blog.koehntopp.info/?p=545
date: '2017-02-07 21:36:10 +0100'
date_gmt: '2017-02-07 20:36:10 +0100'
categories:
- Going Digital and the Copyright
- Networking
tags: []
---
<p>[caption id="attachment\_546" align="alignleft" width="300"][![](http://blog.koehntopp.info/wp-content/uploads/2017/02/netflix-tunnel-300x158.png)](https://blog.jmwhite.co.uk/2016/06/12/netflix-starts-blocking-ipv6-tunnels/) Netflix detects a tunnel[/caption] So in order to view Netflix, your network connection must be direct and not via a proxy or VPN tunnel. Netflix, being somewhat modern, also advertises IP v6 services and AAAA DNS records so that your computer can find them. On the other hand, many providers do not offer IP v6 natively, and hence require that customers who want non-legacy internet get it via - right - a network tunnel. Which triggers the Netflix error message shown above. Netflix knows that, but offers little support besides "Don't use a tunnel, then". Haha. So [this article](https://blog.jmwhite.co.uk/2016/06/12/netflix-starts-blocking-ipv6-tunnels/) explains how to unfuck Networking for a local Linux or a Chromecast to make Netflix work again. Even if that just means to force it to fall back to l;egacy Internet instead.</p>
