---
layout: post
status: publish
published: true
title: The Great DOM Fuzz-off of 2017
author: isotopp
author_login: kris
author_email: kristian.koehntopp@gmail.com
wordpress_id: 2632
wordpress_url: http://blog.koehntopp.info/?p=2632
date: '2017-09-27 16:28:07 +0200'
date_gmt: '2017-09-27 14:28:07 +0200'
categories:
- Hackerterrorcybercyber
- Apple
tags: []
---
<p>I generally recommend people use a current stable Chrome. It's the most secure browser. Please also [install uBO](https://chrome.google.com/webstore/detail/ublock-origin/cjpalhdlnbpafiamejdnhcphjbkeiagm?hl=de) and use 1Password. Turns out, that recommendation can also be [backed up by data](https://googleprojectzero.blogspot.nl/2017/09/the-great-dom-fuzz-off-of-2017.html). Check the "Results" headline. Note also how they did not test Safari on Apple, because that hurts too much:</p>
<p>> Instead of fuzzing Safari directly, which would require Apple hardware, we instead used WebKitGTK+ which we could run on internal (Linux-based) infrastructure. We created an ASAN build of the release version of WebKitGTK+. Additionally, each crash was verified against a nightly ASAN WebKit build running on a Mac.</p>
<p> Yup, Apple development and testing happening on Linux.</p>
