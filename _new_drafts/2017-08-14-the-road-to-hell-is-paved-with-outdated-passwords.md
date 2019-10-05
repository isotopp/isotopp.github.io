---
layout: post
status: publish
published: true
title: The road to hell is paved with outdated passwords…
author: isotopp
author_login: kris
author_email: kristian.koehntopp@gmail.com
wordpress_id: 2435
wordpress_url: http://blog.koehntopp.info/?p=2435
date: '2017-08-14 10:49:11 +0200'
date_gmt: '2017-08-14 08:49:11 +0200'
categories:
- Computer Science
- Hackerterrorcybercyber
tags: []
---
<p>So I am using Chrome in a corporate context. Outdated password regulations force me to increment my password every three months. The reason for that is well understood (PCI compliance), but can't be changed from inside the corporation. Previously, Chrome stored my passwords in the Apple Keychain. So I could script this, using /usr/bin/security and push my password change into all saved passwords, or, alternatively, bulk delete all those old passwords. Recent Chrome does not do that any more.<!--more--> Instead the Apple Keychain contains a master password and the Chrome store is implemented internally. It has no scripting interface, so you have to use the UI. [caption id="attachment\_2436" align="aligncenter" width="203"] ![](http://blog.koehntopp.info/wp-content/uploads/2017/08/chrome-passwd1.jpg) Click three dots, navigate to Remove, select item, repeat.[/caption] The UI does not have a bulk search and delete interface. Instead, you have to go through all 300 individual \*.companyname.com items, and individually select the three dots menu, navigate to Remove and select Remove. Thankfully, no confirmation requester. You could select Details, but that's that: No way to edit for you. [caption id="attachment\_2437" align="aligncenter" width="509"] ![](http://blog.koehntopp.info/wp-content/uploads/2017/08/chrome-passwd2.jpg) No edit for you, come back one year.[/caption] So here is what happens: I now have 300 autosaved outdated passwords in my Chrome password store. Each time I am going to a company website matching \*.companyname.com, it will autocomplete wrongly. After 3 attempts, I will lock myself out. I might remember that, and at some point in time many of those will be updated. Some sites which I am not using as often will still have the password of old. And there is no way to see. Yay. Not.</p>
