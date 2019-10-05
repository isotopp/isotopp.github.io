---
layout: post
status: publish
published: true
title: Perceptual Ad Highlighter
author: isotopp
author_login: kris
author_email: kristian.koehntopp@gmail.com
wordpress_id: 1515
wordpress_url: http://blog.koehntopp.info/?p=1515
date: '2017-04-20 05:58:39 +0200'
date_gmt: '2017-04-20 04:58:39 +0200'
categories:
- Going Digital and the Copyright
tags: []
---
<p>[Perceptual Ad Highlighter](https://chrome.google.com/webstore/detail/perceptual-ad-highlighter/mahgiflleahghaapkboihnbhdplhnchp?hl=en) is a Chrome Plugin that detects and highlights ads using image/layout recognition on a rendered page/DOM tree. As law required that ad-content is marked and visually identifyable as promoted content, the plugin renders the page and then visually analyzes the page layout to detect and mark ads. The source is [available on Github](https://github.com/citp/ad-blocking/), and a paper describes the technology ([PDF](http://randomwalker.info/publications/ad-blocking-framework-techniques.pdf)). To turn this into a proper ad-blocker, a dual buffering approach would be necessary, in which the full page is rendered into a hidden buffer, including all ads. The perceptual adblocker would then identify the parts of the page that are content and copy them over into a secondary page that is shown to the user sans advertising. The extension could also simulate user interaction with the hidden page to fool robot detection Javascript.</p>
