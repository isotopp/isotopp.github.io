---
layout: post
title:  'Streaming and Energy'
author-id: isotopp
feature-img: assets/img/background/rijksmuseum.jpg
date: 2019-12-28 19:42:16 +0100
tags:
- climate
- data center
- energy
- erklaerbaer
- 'lang_en'
---
A bunch of boomers in Germany is running a distraction campaign on the energy use of data centers and streaming. Example articles in german language can be found in
[Zeit](https://www.zeit.de/2020/01/digitalpolitik-digitalisierung-klimaschutz-co2-stromverbrauch)
and
[Bento](https://www.bento.de/politik/klickscham-wie-viel-co2-streaming-und-googlen-verursacht-und-welche-loesungen-es-gibt-a-c6e5ff54-71e9-46da-80cf-6ee1547d8b3a),
but there is a larger series of articles acrooss multiple newspapers.

A better structured reasoning can be found in [SRF](https://www.srf.ch/news/panorama/energieverbrauch-im-internet-warum-streaming-viel-strom-braucht) (German), and it highlights how arbitrary and wrong the energy numbers in the former articles are. But even this article ignores the facts that the energy consumption in a typical cloud data center is most likely carbon neutral, because the power used is likely to be completely green. How green exactly is depending on the cloud operator and the location of the data center - I have written a [much more detailed overview]({% link _posts/2019-10-05-data-centers-and-energy.md %}) elsewhere in this blog.

For some reason, the majority of these articles focus on video streaming, ignoring outright waste of energy at a much larger scale, for example blockchain use. Furthermore, most of the calculations on the energy use of specifically video streaming are making flawed assumptions. They are designed to create vastly oversized energy footprints, and even more oversized carbon footprints.

Some things to remember:

**A video is not being encoded for every view.** A raw video is encoded or transcoded once for each target format, of which there is a small integer number. So 4K raw source material is being transcoded into 1080p, 720p, 480p and maybe a few even smaller formats. Some streamers support specific classes of end user devices with a limited, non-extensible set of legacy codecs, such as gaming consoles or similar. They typically add one or two more formats to the set, but in the end the storage cost (and energy) dominates the transcoding cost.

The encoded file is stored and played on demand for each viewer. In effect this turns watching a video on a streaming service basically into a normal file download with a "fancy" download protocol.

![](/uploads/2019/12/google-chunked.png)

via [Netmanias: Youtube Chunking, 2013](https://www.netmanias.com/en/post/blog/5923/google-http-adaptive-streaming-iptv-video-streaming-youtube/youtube-changing-the-way-of-delivering-videos-chunking-and-adaptive-streaming-are-in-progressive-download-is-out)

Define "fancy": The file is being chopped into chunks of around a few seconds playback time, and a number of chunks ahead of the current playback position is being downloaded in advance and buffered on the end user device. How many of these chunks are preloaded depends on a lot of parameters, such as device type, internet connection speed and user behavior ("are they jumping around a lot?"). Using chunked downloads allows for switching video resolution depending on changes in line speed or display window size, and for jumping around in the video without downloading unnecessary parts of the video.

**A video is not shipped across the Atlantic Ocean for each viewer.** Most likely (and especially for popular videos), an edge cache is holding a copy of the file locally and serving it to the customer. Google documents this in [their peering and caching documentation](https://peering.google.com/#/infrastructure).

![](/uploads/2019/12/google-edge.png)

Google provides a map of their Google Global Cache nodes. There is at least one in every metropolitan area. These nodes also cache popular Youtube videos. The cache is quite effective, an older 2012 paper ([PDF](https://www.net.in.tum.de/fileadmin/bibtex/publications/papers/braun_noms2012_youtube_caching.pdf)) discusses that.

Netflix does similar things with their own infrastructure.

This turns watching a video on a streaming service into downloading a file with a fancy download protocol from a pretty local server, with local being defined as "very close to your location in terms of network, not physical topology". Where network topology matches physical topology, this may be "in your city", in any case it is the minimum number of network hops, the copy "closest to you" that is being served.

**A video is not being decoded in software on a regular CPU** The effect of a software vs. hardware video encoder is being shown in [this 2014 Youtube Video](https://www.youtube.com/watch?v=2YpOZV8elqA), in which a Samsung S4 cellphone is being used to encode a live video stream from a specific brand of surveillance camera. Software encoding produces 8 fps, hardware encoding with the special hardware in the cellphone produces line rate at 25 fps. 

Unfortunately we do not get to see the changed energy profile, but purpose built video encoding and decoding hardware as is present on any average graphics hardware in 2019, down to the cellphone level, does things not only faster, but also with a fraction of the energy need. Such hardware is used for streaming video encoding in data centers, and for playback on end user devices.

This is especially important on battery powered devices, where less energy usage translates into longer device runtime directly.

For encoding, the approaches differ. Netflix is running on AWS, and used to use [software encoding on regular EC2 instances](https://medium.com/netflix-techblog/high-quality-video-encoding-at-scale-d159db052746). A relatively recent Netflix talk about their [encoding pipeline](https://www.youtube.com/watch?v=JouA10QJiNc) has all the details.

Google offers their own dedicated [video encoding cloud service](https://cloud.google.com/solutions/media-entertainment/use-cases/video-encoding-transcoding/), but does not document what they are using. It is likely that a hybrid of software and hardware encoding is being used: Google is known to have [fuzzed ffmpeg](https://www.quora.com/What-does-YouTube-use-for-encoding-video/answer/Ciro-Santilli) a lot and to use it extensively. Also, ffmpeg can [make use of GPU hardware for encoding](https://www.tal.org/tutorials/ffmpeg_nvidia_encode), when such hardware is available, and GCP has such hardware.


**Running a cloud service uses energy, but it is way less energy than anybody else would use for the same job. Also, if you choose your cloud provider wisely, you may use energy, but won't produce CO2** I have explained that in [much more detail]({% link _posts/2019-10-05-data-centers-and-energy.md %}) elsewhere.

The TL;DR is: Cloud providers run data centers on renewable energy, Google is one of the worlds largest investors into solar and wind farms. So even if energy is being used, no CO2 is being produced to run the data center.

Cloud providers use purpose built data centers that match their purpose built computers, "Open Compute Technology". These machines use less than half the power of normal servers when idle, and around 33% less energy when fully loaded. They also run in data centers that do not require compression cooling, but can consume ambient air temperatures, greatly reducing the cooling energy spent.

Cloud technology can size applications on demand, allowing way better utilisation of servers. While a typical enterprise data center has around 5%-10% utilisation, cloud data centers are 3x to 7x better utilised.

**EDIT:** Netflix specifically is overcompensating. In
[A renewable energy update from us](https://media.netflix.com/en/company-blog/a-renewable-energy-update-from-us)
they explain how much energy they use, primary and secondary, and how they
compensate for this. This is assuming that their cloud provider, Amazon, was
running on 100% coal, which they aren't, and that means they are actually
carbon negative.

**EDIT:** The BBC has an [article](https://www.bbc.co.uk/sounds/play/p0819sc4) on this, and they come to the same conclusions (via [Twitter](https://twitter.com/elizab0t/status/1223570360555188224)).
