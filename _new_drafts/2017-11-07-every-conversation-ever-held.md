---
layout: post
status: publish
published: true
title: Every Conversation ever held
author: isotopp
author_login: kris
author_email: kristian.koehntopp@gmail.com
wordpress_id: 2807
wordpress_url: http://blog.koehntopp.info/?p=2807
date: '2017-11-07 11:40:43 +0100'
date_gmt: '2017-11-07 10:40:43 +0100'
categories:
- Computer Science
- Data Centers
tags: []
---
<p>So, let's do this again, but this time cleanly. In a [Facebook Post](https://www.facebook.com/mspr0/posts/10155846531028255), Michael Seemann has been explaining why the Facebook App does not listen to every word you ever say, all of the time. He is right. A telephone is a device with limited power supply, limited cooling and limited, metered connectivity. It has an operating system that monitors and manages these critical resources, hard. You can't listen to things all of the time and expect not to be noticed. Like, "the battery is empty and my LTE budget is gone" noticed. Other devices, an Alexa, a Sonos One or a Google Home, are on cabled power and unmetered Wifi. The could theoretically get away with listening all of the time. So how much data is that? Let's do the math. <!--more--> Let's assume one human talks, on the average, one hour each day. We are not recording environmental noise or gaps in speech. Just all the words. Let's also assume there are at most 20.000 talking days (55 years) in a human life on the average. Let's assume a really good Codec, like&nbsp;G.723.1 with 750 Byte/s. One hour of talking is 750 Byte \* 3600s =&nbsp;2700000 Byte per Hour, or 2.6 MB per hour. A less frugal codec would consume about 10x this. **A lifetime of speech in a human is around 50 GB of recording, then.** There are currently 7.5 billion (10E9) humans alive. Let's assume there have been 5 times as many humans alive ever, with 20.000 hours/50 GB of space requirements for each. So&nbsp;37 500 000 000 humans consume 50 GB each, that's&nbsp;1 875 000 000 000 GB,&nbsp;1 875 000 000 TB, 1 875 000 PB,&nbsp;1 875 EB &nbsp;of storage. I am simplifying by rounding up to 2000 EB, or 200 Million 10 TB drives of data. We can have 12 of these in a 1U server, so&nbsp;16 666 666 servers. Google or Facebook each have around 3 Million servers. So, no, not possible by a factor of not quite 10. On the other hand, if we made no error with the assumptions, barely possible for all living humans. Quite possible for some hundred millions of people.</p>
