---
layout: post
status: publish
published: true
title: The cost of winning…
author-id: isotopp
feature-img: assets/img/background/rijksmuseum.jpg
date: '2017-03-10 18:50:38 +0100'
tags:
- security
- performance
- lang_en
---
Tech.co has an article titled 
[Artificial Intelligence Startups Are Winning the Cybersecurity Race](http://tech.co/ai-startups-winning-cybersecurity-race-2017-03). The
claim is basically first that old, pattern and signature based malware
recognition is useless, and second, that new, behavior based malware
recognition employing mystery AI technologies fixes things. The article
closes with

> In the near future, we predict that AI will be able to effectively fight
> against hackers by easily detecting repacked viruses. It’s just a matter
> of time. That’s why, more than resources or experience, companies who
> actively apply AI, especially cybersecurity companies, will ultimately be
> successful.

That will be interesting to see. Here is a data point:

- On a computer without any protection installed, unpacking a node.js based
  hipster chat application zip into 7500 files inside an application folder
  takes 3.5 seconds.

So why is this other device from the same maker close to unusable and has
close to zero battery life? Let's see: It has been gifted with the full
package of corporate enterprise security: Junos Pulse Endpoint Security,
FireEye endpoint security and TrendMicro Enterprise protection.

- With everything on, it takes 27 seconds (instead of 3 seconds) to unpack
  the same archive.
- Getting root and uninstalling FireEye reduces the unpack time to 18
  seconds.
- Reading the TrendMicro config file and doing the Unpacking inside a
  specific git directory, which is exempt from TrendMicro scanning takes 11
  seconds.
- Uninstalling Junos Pulse, and doing it in the exempt git directory takes 8
  seconds.

The uninstallation or going into exempt directories was based on observing a
system monitor and finding out which processes consume abnormal amounts of
CPU during the operation. In fact, the git directory is exempt because it
can contain on the upside of half a million files and having TrendMicro
active inside that directory simply shuts down the machine, because battery
empty.

I guess the point I am trying to make here is that "more protection" is
going to mean "more mAh and Watts spent on stuff not related to the primary
purpose of the machine". And we are in an age where consumer devices are
increasingly run on battery, and have thermal budgets limited to 5W and less
because they have no fan.

So I am going to predict that in the near future we will see a growing
conflict between "protection" software uselessly wasting performance and
battery and users, who actually want to use their stuff and need to be
vigiliant for things that eat battery capacity and heat the CPU needlessly.
Your phone, your fanless tablet, your 12" Macbook and your tablet-computer
hybrid won't be running much security software because it's mobile, running
on battery and has to live with 5W or less.
