---
layout: post
title:  'Netflix does not bring down the Internet'
author-id: isotopp
feature-img: assets/img/background/rijksmuseum.jpg
date: 2020-03-19 10:35:39 +0100
tags:
- lang_en
- media
- internet
---
It's Coronavirus Crisis and Netflix is killing us all, again. This time it's not their [excessive energy use]({% link _posts/2019-12-28-streaming-and-energy.md %}), but their dreaded HD videos that are overloading the Internet. Or is it?

## It's only Swisscom

Supposedly [Switzerland is considering Netflix shutdown](https://www.web24.news/u/2020/03/corona-crisis-switzerland-is-considering-netflix-shutdown.html) to prevent Home Office workers from being disconnected.

> According to its own statements, on the first day of the quasi curfew in our neighboring country, Swisscom recorded an enormous increase in the load on the infrastructure. There were three times more calls via the mobile network than on normal days. The volume in the fixed network has also increased massively

None of the other swiss providers reported any problems. Swisscom, on the other hand, already had Netflix problems as early as 2015 ([Article in German](https://community.swisscom.ch/t5/Archiv-Internet/Netflix-Probleme-Swisscom-Backbone-%C3%BCberlastet/m-p/413725)), way before the Coronavirus Crisis.

## There should and could be caches

Videostreaming and Content Delivery usually does not happen from outside a providers network. Netflix, Youtube, even Steam, will gladly provide a cache server with plenty of disk space at not cost for any provider to install inside their network. These things dramatically decrease the amount of traffic leaving the provider network, keeping it as local as possible. 

Also, typically providers peer with other providers to built an Inter-Network-Connect - that's why it is being called "The Internet" in the first place.

Some providers, mostly Ex-State Telecoms, are not happy with the cooperative structure of the Internet and hold their users hostage. They want to double dip, charging both sides for traffic: They want to take money from their customers for content-access and money from content-providers for customer-access. Consequently, they provide only minimum peering bandwidth unless being paid, and want money for the content provider to install a cache server inside their network. The default service is only just good enough to prevent too many customers from leaving for other providers.

I checked. My computer in Haarlemmermeer is loading Netflix from

> 14:35:21.369768 IP kk2.home.koehntopp.de.54972 > ipv4_1.lagg0.c125.ams001.ix.nflxvideo.net.https: Flags [.], ack 109080, win 818, options [nop,nop,TS val 288410514 ecr 2882083883], length 0

which indicates a content cache located in or close to Amsterdam, and the ping delay is <3.5ms. Traceroute confirms the locality of the server.

So I am getting my content from content cache in Amsterdam that is extremely close by in terms of network topology. Youtube, Twitch and Steam expose similar behavior.

## Videostreaming already is dynamic bandwidth

In [Data Centers and Energy]({% link _posts/2019-12-28-streaming-and-energy.md %}) I already explained that video streaming is dynamic bandwidth and dynamic resolution, pointing to [Chunking](https://www.netmanias.com/en/post/blog/5923/google-http-adaptive-streaming-iptv-video-streaming-youtube/youtube-changing-the-way-of-delivering-videos-chunking-and-adaptive-streaming-are-in-progressive-download-is-out). All video streamers sense the bandwidth of the relevant part of the delivery pipeline and automatically and gracefully degrade the experience as necessary if bandwidth is becoming tight.

Doing this manually is not going to improve anybodies experience.

## There is no crisis except the one Swisscom manufactured for itself

There is no crisis except the one that has been manufactured by Swisscom themselves. We don't have a network capacity crisis because of Home Office and we do not need to throttle Netflix. Some providers just painted themselves into a corner and now have trouble adjusting to shifting demand patterns. It's easily fixed by stopping being an asshole.

*EDIT:* Swiss provider Init7 [explains the same thing](https://www.luzernerzeitung.ch/wirtschaft/swisscom-fuehrt-uns-in-die-irre-it-unternehmer-zweifelt-an-erklaerungen-fuer-pannen-ld.1204874) and comes to the same conclusions.

This blog article originally was a [Twitter Thread](https://twitter.com/isotopp/status/1240264656947683333).

## Update: Akamai throttles, too

In a number of news, sucessively most streaming providers have been decided to throttle their stuff, following Netflix initial decision. The final giveaway was [Akamai](https://blogs.akamai.com/2020/03/working-together-to-manage-global-internet-traffic-increases.html):

> Akamai's intelligent edge network architecture is inherently designed to mitigate and minimize network congestion, and because we have deployed our infrastructure deep into carrier networks, we can help those networks avoid overload by diverting traffic away from areas experiencing high levels of congestion. 

Akamai is a CDN operator. They have edge caches all over the world, in each and every providers network directly. That is, it is impossible for Akamai to overload peering exchanges or the actual internetworking fabric of the Internet. The whole point of their business operation is to be local, in every locality.

> In regions where demand is creating bottlenecks for customers, we will be reducing gaming software downloads at peak times, completing the downloads at the normal fast speeds late at night.

So it is not the Internet or the Exchanges here. It is individual local providers who have overcomitted their own internal backbones or their last miles, and sold more access than they can provide. That's of course a self-made problem for that these providers deserve to suffer, but of course that's a problem when literally everybody is coughing their soul out. But we must make sure that we do not forget about this when it is time.
