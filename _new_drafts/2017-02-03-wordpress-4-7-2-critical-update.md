---
layout: post
status: publish
published: true
title: Wordpress 4.7.2 - critical update
author: isotopp
author_login: kris
author_email: kristian.koehntopp@gmail.com
wordpress_id: 365
wordpress_url: http://blog.koehntopp.info/?p=365
date: '2017-02-03 07:12:38 +0100'
date_gmt: '2017-02-03 06:12:38 +0100'
categories:
- Hackerterrorcybercyber
- Blog
tags: []
---
<p> ![](http://blog.koehntopp.info/wp-content/uploads/2017/02/Screen-Shot-2017-02-03-at-06.54.49.png) If you are running wordpress, and you are not completely stupid, you have automatic updates enabled. In this case, your wordpress just updated itself to 4.7.2, because of a critical bug in the WordPress REST API. The [release information](https://wordpress.org/news/2017/01/wordpress-4-7-2-security-release/) explains the security content of the 4.7.2&nbsp; update and why [one fix was explained only after the fact](https://make.wordpress.org/core/2017/02/01/disclosure-of-additional-security-fix-in-wordpress-4-7-2/).<!--more--> Hanno Böck has [an opinion piece over at golem.de](http://www.golem.de/news/content-management-systeme-wordpress-ist-sicherer-als-die-konkurrenz-1702-125967.html)&nbsp;(german language) about why Wordpress is still the most secure CMS. He explains how Wordpress structurally separates local site modifications from the core, and how this enables them to provide an automatic update procedure - which you should enable. Joomla, Typo3 and Drupal should change and copy that invention. If you are running Wordpress, you would also like to install the plugins such as&nbsp;[WordFence](https://wordpress.org/plugins/wordfence/), [Google Authenticator](https://wordpress.org/plugins/google-authenticator/)&nbsp;(for 2FA), [Security Ninja](https://wordpress.org/plugins/security-ninja/)&nbsp;(for a quick security audit) or similar. A general overview of hardening a Wordpress installation can be found in the [Codex](https://codex.wordpress.org/Hardening_WordPress). **EDIT:&nbsp;** Over at Wordfence, they have [an article](https://www.wordfence.com/blog/2017/01/xmlrpc-wp-login-brute-force/) about login vs. XMLRPC attacks on Wordpress installations, with some statistics.</p>
