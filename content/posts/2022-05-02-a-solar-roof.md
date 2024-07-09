---
author: isotopp
date: "2022-05-02T08:42:10Z"
feature-img: assets/img/background/rijksmuseum.jpg
title: "A solar roof"
published: true
tags:
- lang_en
- netherlands
- energy
- climate
---

I live in a house in a rural village somewhere in [Randstad](https://en.wikipedia.org/wiki/Randstad).
We are paying around 70 Euro per month in electricity, and up to 380 Euro per month in gas.
We are using the latter for heating and warm water, but we are already cooking with electricity.

The house has a decent energy rating and a heat exchanger in the forced ventilation system.
That is to keep the warmth in when getting fresh air in.

![](/uploads/2022/05/solar-01.jpg)

*Energy cost of 2021. Electricity remains largely unchanged in 2022, but gas cost rose a lot.*

We are using a lot of electricity for a 3-person household -- 5500 kWh, a lot of which can be attributed to "always on" electronics at home.
In particular, one file server consumes around 100W, which accumulates to not quite 1 MWh per year.
Outsourcing that to a cloud service would be too slow, and a lot more expensive, though.

# The situation and the configuration

The house has a rather steep roof.
One solar installation service, recommended to us via a colleague, declined to make an offer for installation because they were not equipped to handle the roof steepness.
In the end, we went with Zonneplan, who did not have any objections to the general situation at all, and were able to handle it.

![](/uploads/2022/05/solar-03.png)

*Roof steepness, as seen from the south.*

The roof itself is oriented at 155 deg, pointing the roof ridge line to south/southeast.
The west side is getting better light, but the first half of the day lights up the eastern roof as well.
According to [basic astronomy tooling](https://apps.apple.com/us/app/ephemeris-moon-and-sun-seeker/id1488277219), the sun crosses the houses ridge line at 11:45 CEST, and solar noon (sun at 180 deg) is at 13:45.

![](/uploads/2022/05/solar-04.png)

*Ridge line of the house, and the solar panel configuration.*

We opted for a solution that places 9 panels on the eastern roof, and 16 on the western side.
The east side of the house got a 3x3 configuration, the west side a 4x4.
The lower two rows on the western side can get shadow from the neighbor and from the house wings (see the shadow on the image above), so they need "optimizers" to handle shade.
This is what it looks like on the west side:

![](/uploads/2022/05/solar-05.jpg)

*Panels on the west side of the roof.*

The installed panel type has a size of 1.75m x 1.03m, and a Wp rating of 370W, so we get 200W/qm as expected from current tech.
This is good for 3330Wp on the eastern side and 5920Wp on the western side, for a theoretical total of 9250Wp.
In practice the configuration will never reach that level of output, because both sides of the roof cannot receive direct lighting at the same time.

![](/uploads/2022/05/solar-06.jpg)

*The type sticker of one of the panels.*

The inverter is a three-phase Huawei SUN2000-10KTL.
It weighs 16kg and measures 52.5cm x 47.0cm x 16.6 cm, is rated IP65 and could in theory work from -25 to +60 degC.
It still likes to sit inside, dry and warm.

![](/uploads/2022/05/solar-07.jpg)

*Huawei SUN 2000 inverter.*

The device makes no perceptible sound, even under load.
When producing 4500 Watt, it gets a bit warm, but not so much that it will feel painful to the touch.

![](/uploads/2022/05/solar-08.jpg)

*FLIR image of the inverter while transforming 4500W from the roof.*

Installing the solar panels on the roof catches energy that otherwise has been hitting the roof and reaching the rooms inside.
The rooms directly under the roof are now about 1.5C cooler, a great improvement.

The panels themselves, even when in full sunlight, do not get particularly warm.

![](/uploads/2022/05/solar-09.jpg)

*FLIR images of the solar panels while in full sunlight.*

# Production and consumption

Here is a spotless day in April, still on MET, and hardly any clouds.
We have sunrise at 6:40, around 7:00 we see a sharp rise of energy produced on the eastern panels.
This peaks around 9:00 at ~2300W, then falls off a bit until around 11:30 the western panels start to kick in.
From here on the production switches over from eastside to westside, for a peak of 5300W around 16:00.
Sunset is at 20:40, and indeed we get at least a bit of energy almost to the end, though the decline is rather steep starting at 19:40 or so.

Total production is 44.5 kWh over the day.
Around 10 kWh can be attributed to the modules on the eastern side, and their power comes in early when we need it for breakfast.
They help a great deal to even out production over the day.

![](/uploads/2022/05/solar-10.jpg)

The inverter has a GSM module and feeds into the systems of Zonneplan.
That also means I get no direct access to the Modbus in the Inverter without interfering with their warranty.

I can access the electricity counter of our house, though, through the Dutch P1 interface.
This is done, for example, with a [P1 reader ethernet](https://www.zuidwijk.com/product/p1-reader-ethernet/) by Marcel Zuidwijk, connecting the P1 interface from the counter to a free power on the DSL modem.
The data is put onto the [house MQTT bus]({{< relref "2020-11-15-my-home-sensor-network.md" >}}), using [software](https://github.com/Lalufu/p1-mqtt) written by a friend and colleague.

Reading the counters, I get a good overview of what happens during the day:

![](/uploads/2022/05/solar-11.png)

*Red line: Power drawn from the grid. Green line: Power sent into the grid. You can see how between 6:00 and 20:00 we are sending power to the grid at almost all times. The "Range" data shows we have drawn 6.25 kWh from the grid over the day, and sent around 30.1 kWh into the grid over the day.*

In the image above, we can see that we sent 30.1 kWh into the grid yesterday.
The Zonneplan app gives me a total production of 39.42 kWh for that day.
We also took 6.25 kWh from the grid on top of that.

That gives us a usage of (6.25 kWh + 39.42 kWh - 30.1 kWh =) 15.57 kWh for the day.
Out of this, we covered (39.42 kWh - 30.1 kWh =) 9.32 kWh internally.
We pushed a net surplus of (30.1 kWh - 6.25kWh = ) 23.85 kWh into the grid.

Using the current counters, I can get a more detailed graph over the day.
You can see a base load in the house of around 300W -- around 100W can be attributed to one server, the rest is various other electronics that is always on.
Great spikes show household appliances doing things: Dishwasher, washing machine, espresso maker, microwave, cooking plates and ovens all draw around 2kW to 3kW, mostly to heat up water.

![](/uploads/2022/05/solar-12.png)

*Up: drawing power from grid. Down: Sending power into the grid. You can see how clouds and internal consumption take their bites of the "perfect" production curve.*

Looking at the day-curve this way you can see that we would profit from a household battery.
On this day in April, we could maybe do with a battery of 5kWh or less, but in darker times a larger battery would be more effective.
We could achieve complete autonomy from Equinox to Equinox, and charge the missing energy from the grid during cheap times in the darker half of the year.

The matching piece of equipment would be a Huawei LUNA2000-15-S0 battery pack.
It is a 15 kWh piece of equipment that is 137cm high, 67cm wide and 14cm deep, coming in at 164kg and around 7200 Euro plus shipping.
The pack is based on LFP technology, not on Li-Ion.

# Legal and financials

We purchased the entire solution through Zonneplan at 10162 Euro, so around 1100 Euro per 1 kWp.
This could be a noticeably less, if we did not have shade on the west side -- these optimizers are expensive.

Zonneplan not only installed the whole thing, which took less than a day, but also took care of all the planning, and all the paperwork.
That was very comfortable, and they handled all the things professionally and competently.

In April, we produced 871.1 kWh, and sent 718 kWh into the grid.

In the Netherlands, power sent into the grid "turns the counter backwards".
That is, you can treat the network like a battery, 1 kWh sent in is 1 kWh you can get back later for free.
This is called "[Salderingsregeling voor huishoudens en MKB](https://www.rijksoverheid.nl/onderwerpen/duurzame-energie/zonne-energie)":

> "Households and small businesses are allowed to feed self-generated electricity back into the grid until January 1, 2023. And offset it against their consumption at another time. This is called offsetting."

This rule was supposed to end at 1. January 2023, but will be prolonged at least one year more, says [Solar Mag](https://solarmagazine.nl/nieuws-zonne-energie/i26235/startdatum-afbouw-salderingsregeling-zonnepanelen-niet-haalbaar-ambtenaren-adviseren-1-jaar-uitstel):
> Startdatum afbouw salderingsregeling zonnepanelen niet haalbaar, ambtenaren adviseren 1 jaar uitstel
>
> Start date for phasing out solar panel feed-in scheme not feasible, officials advise 1 year postponement

Phasing out the salderingsregeling to Zero is supposed to be done in 9% steps, not all at once. 
So in the first year, 91% of the power would be part of the salderingsregeling, the rest the electricity provider would pay for, and so on.

The law says that the provider must pay "redelijke vergoeding" (a reasonable compensation).
At this point, a compensation of 80% of what you pay for electricity to them is considered reasonable by the lawmaker.

That would mean, I get paid at least 18.0 ct/kWh when I am paying them 22.5 ct/kWh.
That's workable.

# Outlook

Right now we have solved our  electricity problem, and manage to have solid overproduction (at least in the brighter part of the year).
We are also getting a tiny electric car this year, which will eat into our budget.
That also means we are not getting a Huawei battery this year.

We will have to eventually change the house heating from a central gas burner to a different system, likely air conditioners/heat exchangers that use electricity to warm up and cool air directly.
They work as heat pumps, and produce between 3 kWh and 5 kWh heat for each 1 kWh they consume.
This will considerably increase our consumption.

Warming up 1l of water by 1C takes around 1.16 Wh, and the cooking gas we use provides around 10 to 12 kWh per cubic metre (1000l).
So a shower that uses 240l (0.24 cubic metres) of gas consumes around 2.4kWh.
Similar math can be applied to dishwashers and washing machines ("uses 0.885kWh to heat up 15l of water by 50C"), and to cooking plates.

We will be using a *lot* more electricity if we are going to eliminate cooking gas completely in this household.
