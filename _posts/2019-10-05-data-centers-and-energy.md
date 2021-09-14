---
layout: post
title:  'Data Centers and Energy'
author-id: isotopp
feature-img: assets/img/background/rijksmuseum.jpg
date: 2019-10-05 11:44:55 +0200
tags:
- climate
- data center
- energy
- erklaerbaer
- 'lang_en'
---
Deutsche Welle is shocked: 
[Generation Greta is watching Netflix](https://www.dw.com/de/co2-aussto%C3%9F-von-online-video-streaming-als-klima-killer/a-49469109?maca=de-Twitter-sharing)
(Article in German Language), Netflix runs on computers, and apparently
computers are using power.

Let's have a look.

**EDIT:** Second part [Streaming and Energy]({% link
_posts/2019-12-28-streaming-and-energy.md %}) now available.

## End-User Device.

It's 2019. End user devices are using Wifi, and are running on
Batteries. They are Cellphones, Tablets or Laptops.

Devices that are not connected to grid are more usable if they
are trying to save energy, and so all modern devices are full of
special purpose hardware that allows them to fulfill their main
functions more energy efficient. In particular for the use-case
of watching video modern hardware, even cellphones, have special
[ASICs](https://en.wikipedia.org/wiki/Application-specific_integrated_circuit)
that can do video and audio decompression and compression on the
fly faster and with much less energy usage than a CPU could do.

Also, devices without a fan are limited to a sustained power
usage of 5W or less, because that is typically the heat that a
device can dissipate without a fan and without looking strange.

All of this is an enormous improvement: An old-style desktop
computer has a TDP (Thermal Design Power) of 150W and actually
uses a large two digit number of Watts to run, and an old-school
17" monitor instead of a modern LCD uses as much energy. A
modern tablet or cellphone does both, loading an email and
displaying it, within a power budget of 1.5W to 5.0W, so easily
20-40x more energy efficient.

The article mentions

> "Eine geringere Video-Auflösung spart immer Daten und damit
> Strom. Ein Smartphone etwa kann eine HD-Auflösung gar nicht
> darstellen." Außerdem gelte: je größer der Bildschirm, etwa
> bei einem Smart-TV im Wohnzimmer, desto höher der
> Stromverbrauch. Fazit: HD-Filme auf dem Smartphone über das
> mobile Netz zu schauen, ist am stromintensivsten und damit am
> klimaschädlichsten.

»"A smaller resolution saves data and power. A smartphone for
example cannot show HD resolution". Also, the larger the screen,
the more power use. In total: Watching HD movies on a smartphone
is the most energy intense and most climate endangering use.«

That's an amazing mix of truth and nonsense:

- The smartphone will still use less than 5W, because it can't
  fry itself. 
- And doing this at home via Wifi will not use mobile
  infrastructure but whatever access point is in the house, so
  relatively low power (10W total for AP and phone?).
- The smartphone can indeed show Full HD, because modern smartphone
  screens are in fact 1920x1280 or larger in resolution, 
- but you won't be able to notice that, because the pixels at 450dpi or
  higher are too small for human eyes.
- And all this is so obvious that Netflix knows this and won't
  actually give you full HD for a smartphone endpoint. Unless of
  course you are streaming from the smartphone to a TV, in which
  case it does. You can prove this by downloading, and observing
  that a full episode of an 1h show comes down to <250 MB of
  total storage.

## Data Center

Modern Cloud Data Centers are containing Megawatts and Megawatts
of compute capacity
(What's a [Megawatt?](https://www.google.com/search?q=1000000+Watt+in+Horse+Power)),
with a single facility now touching the
[100 MW barrier](https://lifelinedatacenters.com/data-center/gigamom-the-era-of-the-100-mw-data-center/).

Google specifically is using 100% renewable energy for their
data centers,
[since 2017](https://sustainability.google/projects/announcement-100/),
for a total of 2600 Megawatt. They are doing this by financing
solar and wind facilities directly, and not through greenwashing
certificates ([PDF](https://storage.googleapis.com/gweb-environment.appspot.com/pdf/renewable-energy.pdf)).

Azure claims to have reached CO2 neutrality in 2014, and also
talks about Power Usage Effectiveness (We'll be touching that
subject in more depth below). In their 
[Dutch page](https://azure.microsoft.com/nl-nl/global-infrastructure/) 
they claim

> We hebben in 2014 CO2-neutraliteit bereikt en voldoen aan onze
> doelstelling om een gemiddelde PUE (Power Usage Effectiveness)
> van 1,125 voor elk nieuw datacenter te realiseren. Hiermee
> zitten we 30 procent boven het industriegemiddelde.

"We have reached CO2 neutrality in 2014 and reached our targets
for power usage effectiveness of 1.125 for all new data centers.
With this, we are 30% better than industry average."

Amazons energy page is [AWS &
Sustainability](https://aws.amazon.com/about-aws/sustainability/)
and they claim more than 50% power from renewables, and commit
to a 100% renewable goal for their global infrastructure. 

Like all the other cloud providers, they also highlight the way
lower PUE and much higher utilitzation of their servers compared
to on-premises IT (65% vs. 15% average utilization, and 29%
better power effectiveness, adding up to a 84% better overall
power bilancing in their math).

They also list their ongoing solar and wind farm builds. For the
amount of power usage they can't yet cover from direct renewable
sources, the page states 'AWS purchases and retires
environmental attributes, like Renewable Energy Credits and
Guarantees of Origin, to cover the non-renewable energy we use
in these regions', making them overall CO2 neutral.

Finally, computer power usage is not linear: Power management on
a data center CPU turns cores on and off as needed, and thus, a
CPU uses already circa 50% power at 10% utilisation. From a cost
and from an environmental perspective it is best to utilise any
CPU to the fullest. Some older [measurements of mine]({% link
_posts/2017-07-19-threads-vs-watts.md %}) on this.

## Networking

The article from Deutsche Welle states correctly that the Last
Mile is what counts. That is, because everything before the Last
Mile is already fiber, and fiber lines allow extremely fast
networking at relatively low energy.

Germany, specifically, is wasting a lot of energy on the last
mile, because in order to make Germanys aging copper
infrastructure capable of handling modern data rates, a stunning
amount of signal processing is required.

![](/uploads/data-centers-and-energy/outdoor_dslam.jpg)

Siemens DSL DSLAM (not VDSL) as can be found in typical outdoor
cabinets all over the city. VDSL requires even more compute to
send Megabits/s over what is hardly better than a wet cow wire
(Image via
[Wikipedia](https://en.wikipedia.org/wiki/Digital_subscriber_line_access_multiplexer))

[Nokia](https://www.nokia.com/blog/vdsl2-and-gpon-study-finds-sweet-spots/)
lists Fiber as 45% more cost efficient and way more energy
efficient than VDSL2:
> Copper infrastructure maintenance is typically the most costly
> of all network types. By comparison, GPON is significantly
> cheaper — upwards of 45% less to operate than VDSL2.
>
> That’s why replacing aging copper plant with fiber has
> significant operational benefits. New fiber is more reliable
> than old copper while, at the same time, consumes much less
> energy. Also, with GPON operational costs are further reduced
> with the elimination of the digital subscriber line access
> multiplexer (DSLAM) from the access architecture.

[Clearfield](https://www.seeclearfield.com/assets/documents/data-sheets/clfd-odc-100-outdoor-cabinet.pdf)
specifices the total installable power in their typical grey
'outdoor VDSL cabinets' as up to 3000W, but most cabinets will
not be fully powered to the max. German Telekom 
[DSLAMs](https://en.wikipedia.org/wiki/File:Outdoor_DSLAM.JPG)
are being fed 48V/25A, around 1000W for the street level devices
with four cards.

Moving this to fiber will dramatically save energy, and in fact,
everywhere in the world outside of Germany this is happening
right now.

Mobile data networks are indeed 
[great power sinks](https://www.lightreading.com/mobile/5g/power-consumption-5g-basestations-are-hungry-hungry-hippos/d/d-id/749979).
If you can use cabled networking, do so.

## Modern Data Centers and Power

[John Laban](https://twitter.com/rumperedis) is an ambassador
for the [Open Compute Project](https://www.opencompute.org/).
Funded originally by Facebook, OCP is a project that tries to
build more power efficient cloud data centers. In his
[presentations](https://www.slideshare.net/JohnLaban/ocp-copenhagen-presentation-sept-2017),
John explains how OCP achieves this by getting rid of old
technology in the data center and making the room and the rack a
system:

![](/uploads/data-centers-and-energy/traditional-data-center.png)

Traditional Data Centers: Dark Green - Payload. Everything else - Payload Support.

![](/uploads/data-centers-and-energy/ocp-data-center.png)

OCP Data Centers: Dark Green - Payload. Still around: Generator, Airco is now adiabatic instead of CRAC. Everything else: gone.

OCP data centers redesign the air flow in the data center.

Traditionally data centers have a raised floor, which transports
cold air to the racks, goes through the racks and is then cooled
again. Air-in temperatures are often as low as 17-25C, and
humidity is tightly controlled. OCP data centers allow
non-condensing air of up to 35-45C to go into the servers, which
does basically away with heat pumps and air condition and allows
ambient temperature air to go into the DC.

Traditional servers have often a relatively low height ("1U",
one rack unit), which forces the designers to use relatively
small fans, small heat sinks (== higher air flow speed necessary
for cooling) and produces a lot of friction for the air in the
devices. In a 350W server, the worst case I have personally
observed is 50W for air movement.

OCP uses higher rack units ("OU", Open Compute Units) and
usually makes devices no flatter than 2 OU. Instead, horizontal
partitions are used (3 devices in 2 OU) for a more square device
front, minimising friction and allowing larger heat sinks. It
also allows larger fans, with in turn allows moving the same
volume of air with less RPM and a lot less power. Best cases I
have personally observed were as low as 5-10W for a 350W server.

![](/uploads/data-centers-and-energy/ocp-server.png)

OCP Server: 2 OU high, 1/3 Rack wide, less friction, larger
coolers, no panels impeding airflow, larger fans = slower RPM =
less energy for air movement. Can take up to 45C air-in
('ambient air intake', no heat pump required for cooling).

OCP also improves power consumption by centralising power
supplies in a rack (larger power supplies are usually more
efficient), reducing the number of power conversions in the
total power flow, and making uninterruptible power supplies more
efficient.

Total OCP power savings vary by use-case and climate zone, but
are usually 20-50%. South Korean Telekom tested OCP servers in a
climate chamber with various settings
([Testbed](https://www.youtube.com/watch?v=BBcFXAXXqRE#t=11m33s),
[Findings](https://www.youtube.com/watch?v=BBcFXAXXqRE#t=14m30s))
and what really shows is how the OCP power consumption stays the
same at all possible air-in temperatures while legacy equipment
consumes a lot more power because it has to turn up the fans.

## PUE, Power Usage Efficiency

The Power Usage Efficiency, PUE, is the ratio of total power
consumption of a data center compared to power intake of the
compute equipment. The overhead typically contains cooling, air
movement, and power transformation losses.

The data center built by web.de in Amalienbadstraße, Durlach
(Karlsruhe), had a PUE of 2.0 - for each Megawatt used for
compute, another Megawatt was required for cooling and air
movement. The reasons for that are manifold: The building
itself, an old factory building built by Pfaff, had low ceilings
forcing warm air back into the machines and forcing bad
airflows. The hardware used had a lot of loss due to badly
designed airflows. And the location of the data center, down in
the valley of the river rhine instead of high up in the Black
Forest, combined high ambient air temperatures with high air
humidity, making evaporative or adiabatic cooling an
inefficient option - compressive cooling with heat pumps
was necessary.

More modern data traditional centers can achieve a design PUE as
low as 1.2 and an effective operational PUE of 1.6. Rigidly
optimized OCP data centers can go below 1.1 effective PUE (sic!)
in good conditions. Google published their numbers in their 
[PUE dashboard](https://www.google.com/about/datacenters/efficiency/).

All current cloud vendors deploy OCP equipment or (in the case
of Microsoft) self-developed equipment that is
comparable in efficiency. They also add additional special
purpose hardware to their cloud offerings that allows offloading
of common functionality from the sellable cores of their
machines, in order to maximise sellable inventory, save power
and, of course, increase utilisation.

All aspects of improved efficiency and utilisation included,
cloud hardware often is 3x (or more) efficient than a traditional data center.

**EDIT:** A longer article by [Jessie Frazelle](https://twitter.com/jessfraz/status/1232847716964716544) on Data Center Energy use: [Power to the People](https://blog.jessfraz.com/post/power-to-the-people/).

**EDIT:** A study by Masanet, Koomey et al, [Recalibrating global data center energy-use estimates](https://science.sciencemag.org/content/367/6481/984). The [TL;DR is](https://twitter.com/jgkoomey/status/1233113568934907904): »We find that computing output from data centers went up six fold from 2010 to 2018 but electricity use only went up 6%.« Masanet, Koomey et al have a second article, [Characteristics of low-carbon data centres](https://www.nature.com/articles/nclimate1786)[.](https://sci-hub.se/https://www.nature.com/articles/nclimate1786)

**EDIT:** I have been sent a [link to a writeup on data center planning considerations](https://www.se.com/ww/en/work/campaign/data-center-design-overview/). While this was part of a SEO effort, the source (Schneider Electric) is competent - Scheider specializes in Data Center Design and Planning and Energy Systems - and the writeup is actually useful. The text gives a bit of insight into the process and the factors that go into site planning and choices. A lot depends on intended purpose, local climate, available space and power and ultimately also site size and building increments.

## Summary

Compared to technology from 10 years ago, in the data center we
are now using a lot less energy and with cloud technology also
have dramatically improved utilisation (ie use less hardware to
achieve the same outcome). Also,
all of this is green energy, mostly from actual green production
and not grey-green with certificates. Cloud operators are some
of the largest investors in Wind and Solar all over the world.

At home, savings are even larger, because we went from Desktop
machines with abysmal power profiles to modern low power
hardware which uses single digit wattages to produce results.

Networking, especially the last mile, especially mobile
networking, especially 5G, is a power hog. The amount of signal
processing that goes into 5G and VDSL is amazing. If you want
low power networking, use fiber, maybe bridge the last 5 meters
with Wifi.
