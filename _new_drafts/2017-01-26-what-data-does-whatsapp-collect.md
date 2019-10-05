---
layout: post
status: publish
published: true
title: What data does WhatsApp collect
author: isotopp
author_login: kris
author_email: kristian.koehntopp@gmail.com
wordpress_id: 124
wordpress_url: http://blog.koehntopp.info/?p=124
date: '2017-01-26 10:52:40 +0100'
date_gmt: '2017-01-26 09:52:40 +0100'
categories:
- Computer Science
- Hackerterrorcybercyber
tags: []
---
<p> ![](http://blog.koehntopp.info/wp-content/uploads/2017/01/WhatsApp_Logo_1-150x150.png) Hangout opens. S: Good morning, Kris, please excuse &nbsp;me. You are using WhatsApp, I presume. If so, how are you dealing with the problem of WhatsApp uploading the address book? Ignore it? Change config? Edit address book contacts? Why I am asking: by&nbsp;not using WhatsApp, I am more and more out of the loop (school, parents, sport clubs, etc). At the moment I am trying to resist, proably being the last person on Planet Earth doing that. Kris: Just use it. 'Complete upload of the address book' is untrue, and uninformed bullshit, btw. WhatsApp hashes stuff, and uploads the hashes. Hashes equal -\> match."<br />
Kris: "[What does WhatsApp collect](http://parryaftab.blogspot.de/2014/03/what-does-whatsapp-collect-that.html)&nbsp;(Findings under the Personal Information Protection and Electronic Documents Act (PIPEDA) dating from 2013)</p>
<p>> Out-of-network numbers are stored as one-way, irreversibly hashed values. WhatsApp uses a multi-step treatment of the numbers, with the key step being an “MD5” hash function. The phone number and a fixed salt value serve as input to the hash function, and the output is truncated to 53 bits and combined with the country code for the number. The result is a 64-bit value which is stored in data tables on WhatsApp's servers.</p>
<p> The findings complain about that, because it is not perfect, but I personally believe that to be a pretty good compromise, making you discoverable without pasting the actual numbers all over the place. S: Thanks, didn't know that. Problem solved.</p>
