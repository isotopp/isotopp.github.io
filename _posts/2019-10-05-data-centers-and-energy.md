---
layout: post
title:  'Data Centers and Energy'
author-id: isotopp
feature-img: assets/img/background/rijksmuseum.jpg
date: 2019-10-05 11:44:55 +0200
category: erklaerbaer
tags:
- climate
- data center
- energy
- 'lang_en'
---
Deutsche Welle is shocked: 
[Generation Greta is watching
Netflix](https://www.dw.com/de/co2-aussto%C3%9F-von-online-video-streaming-als-klima-killer/a-49469109?maca=de-Twitter-sharing)
(Article in German Language), Netflix runs on computers, and apparently
computers are using power.

Let's have a look.

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
  relatively low power (10W total?).
- The smartphone can indeed show Full HD, because modern smartphone
  screens are in fact 1920x1280 or larger in resolution, 
- but you won't be able to notice that, because the pixels at 450dpi or
  higher are too small for human eyes.
- And this is all so obvious that Netflix all knows this and
  won't actually give you full HD for a smartphone endpoint.
  Unless of course you are streaming from the smartphone to
  a TV, in which case it does. You can see all this when
  downloading and a full episode of an 1h show comes down to
  <250MB of total storage.

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
With this, we are 30% over industry average."

Amazons energy page is [AWS &
Sustainability](https://aws.amazon.com/about-aws/sustainability/)
and they claim more than 50% power from renewables, and commit
ot a 100% renewable goal for their global infrastructure. As all
the other cloud providers, they also highlight the way lower PUE
and much higher utilitzation of their servers compared to
on-premises IT (65% vs. 15% average utilization, and 29% better
power effectiveness, adding up to a 84% better overall power
bilancing in their math).

They also list their ongoing solar and wind farm builds. For the
amount of power usage they can't yet cover from direct renewable
sources, the page states 'AWS purchases and retires
environmental attributes, like Renewable Energy Credits and
Guarantees of Origin, to cover the non-renewable energy we use
in these regions', making them overall CO2 neutral.

## Networking

The article from Deutsche Welle states correctly that the Last
Mile is what counts. That is, because everything before the Last
Mile is already fiber, and fiber lines allow extremely fast
networking at relatively low energy. Germany, specifically, is
wasting a lot of energy on the last mile, because in order to
make Germanys aging copper infrastructure capable of handling
modern data rates, a stunning amount of signal processing is
required.

[Nokia](https://www.nokia.com/blog/vdsl2-and-gpon-study-finds-sweet-spots/)
lists Fiber as 45% more efficient than VDSL2:
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

Moving this to fiber will dramatically save energy here, and
in fact, everywhere in the world outside of Germany this is
happening right now.

Mobile data networks are indeed 
[great power sinks](https://www.lightreading.com/mobile/5g/power-consumption-5g-basestations-are-hungry-hungry-hippos/d/d-id/749979).
If you can use cabled networking, do so.

## Modern Data Centers and Power

