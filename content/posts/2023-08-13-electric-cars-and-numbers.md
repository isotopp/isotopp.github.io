---
author: isotopp
title: "Electric Cars and Numbers"
date: "2023-08-13T01:02:03Z"
feature-img: assets/img/background/rijksmuseum.jpg
toc: false
tags:
- lang_en
- energy
---

(based on a series of posts on Mastodon)

# I got an electric car

I made the driving license late in life, in 1998 at the age of 30.
My first car was a BMW 316i Coupe, used, 9000 Euro.
I drove this until 2007.
When I moved to Berlin, I found driving in the city inconvenient, and consequently used public transport.
Eventually the battery of the car died from standing around, and I sold it.

In 2010, I became a father, and we bought a new car, a Renault Scénic Grande 7-seater.
This is a car made from cupholders and small compartments, and it served its function of
"Moving the family around, including Grandma" quite well.
Nothing Renault makes lasts longer than 15 years, though, and so the thing was showing signs of age.

Also, 
[the City of Amsterdam changes the rules]({{< relref "/2023-05-11-city-of-amsterdam-and-combustion-engines.md" >}})
of how to get into the city, and the old Scenic soon would be unable to get into the city.
So, an electric car was needed.

I tried to like the BYD Dolphin, but that car comes only with seats where the headrest is fixed and cannot be adjusted.
At my size, that means the headrest sits somewhere at my lower shoulder blades.
I asked for advice, and the BYD salesperson just pointed at the BYD Tank, a monstrous SUV.
That had adjustable headrests for sure, but you wouldn't want to drive such a thing inside Amsterdam's city limits.

So Renault again, this time a Megane e-tech, with a 60 kWh battery, and some 16 kWh/100 km energy use.
Also, apparently some 160 kW engine (peak power), which really is a 55 kW engine (sustained power).

These are weird units for energy and power for most people.

What do they even mean and how can we imagine them?

# Everything in kWh
 
Back in the day, we had incandescent light bulbs, and the standard thing everybody my age can imagine is the 100 W bulb.
It was as bright as a modern 14W LED light today.
Running the 100 W lamp for one hour uses 100 Wh of energy, running it for 10 hours is 1000 Wh, or 1 kWh.

![](/uploads/2023/08/100W.jpg)

*A 100 W incandescent bulk, [as shown in Wikipedia](https://en.wikipedia.org/wiki/File:Gluehlampe_01_KMJ.png).*

Watts are power ("Leistung" in German), and Watt-Hours are energy 
("Energie," "Arbeit" in German. 
"Leistung ist Arbeit pro Zeit" as my math teacher used to say to people who did not complete their test in time).

## Solar Energy

The sun shining on Germany on a bright day delivers 1 kW per m^2, so 1 h of sunshine is an irradiation of 1 kWh/qm.
Solar cells currently have an efficiency of 20%, so 1000 W of irradiation become 200 W of electricity,
the other 800 W become heat or are reflected.

Such a 1 m^2 solar array would have an installed peak capacity of 200 Wp ("Watt peak," or "Nennleistung" in German).
Five of those would deliver 1 kWp, and produce around 950 kWh of energy per year, under optimal conditions.

In fact, 46 m^2 of my roof are covered in solar panels. 
[That's 9250 Wp]({{< relref "/2022-05-02-a-solar-roof.md" >}}),
which under this formula should produce up to 8780 kWh/year.

They did, in fact, deliver 8000-ish kWh/year, from June 2022 to June 2023.
To compare, we used 5500 kWh of electricity in the year before we got the Solar panels.

## Fuels and Energy

When I was little, a car's power was given in HP (Horsepower).
Today we use kW, but many people will still list HP in parentheses for old people's convenience.

1000 W are ~1 ⅓ HP, or 1 HP are ~750 W.
Drive that for one hour, and you have used 1 kWh.

Conveniently, the energy content of many fuels is almost decimal.

| Fuel | kWh                |
|------|--------------------|
| 1l Diesel | 9.7 kWh, ~10 kWh   |
| 1l Benzine | 8.5 kWh            |
| 1 m^3 Natural Gas | 10-12 kWh, ~10 kWh |

*Almost metric: 1 m^3 of Gas or 1 l of Diesel each has an energy content of 10 kWh.*

So if your old Scenic Diesel uses 6.7l Diesel on 100 km, it has used around 66 kWh of energy.
A combustion engine car is around 33% efficient.

So of these 66 kWh, around 22 kWh have been used to drive the distance.
The rest is waste heat.

The new Megane uses 16 kWh for 100 km, so that is the energetic equivalent of 1.8l Benzine or 1.6l Diesel.
Times three, to account for combustion engine losses.

## Other energy units

Calories (actually kilocalories, kcal) are known to many people as units for energy content of food.
A kilo of body fat is 7700 kcal, and that's 8.9 kWh.
So 11.2 kilos of dad bod are 100 kWh.
Take that, Tesla.

This is not theoretical energy at all, as 
[S4E8 Mythbusters: Salami Rocket](https://www.youtube.com/watch?v=Vps_8dnnU_M&t=474s)
has demonstrated.

A bar of Milka chocolate has around 0.6 kWh.
So charging a 60 kWh car battery is around 100 Milka bars of energy content.

If you are driving a Diesel at 6l/100 km, you burn 60 kWh of energy content, or around one bar of Milka per Kilometer.
Things become very conveniently convertible if everything is kW and kWh.

[Bergfreunde](https://www.bergfreunde.de/kalorienverbrauch-sport-rechner/) has a human activity energy calculator,
which covers anything from Walking to Sex.
8h of walking for a fat old man will burn 3350 kcal, or 3.9 kWh.
Assuming 6 km/h, we will burn 8.1 kWh/100 km.
That is less than the Megane, but more than the Carver.
And a lot more than biking.

 ## Long Distance driving and charging

If you run your electric vehicle for long distances, you will observe that the last 20% of charge, 
from 80% to 100%, take longer than the rest.
That is because batteries take energy quickly as long as they are empty, and the final 20% charge particularly slowly.

Most people do not wait for a full charge, but charge to 80%-ish and then continue to drive.
They also won't drive the car down to 0%.

So at an energy use of 16-20 kWh/100 km at a speed of 100 km/h, you will be driving for about 2-2.5 hours until the battery runs empty.
Then the car will need to charge, and because you are on the Autoahn, you'll be using a fast charger.
That will bring the car to 80% in around 30 minutes, sufficient to pee and get a coffee.

This is the rhythm of the electric long distance drive:

| Start SoC | End SoC | Time | Energy Stored |
|-----------|---|----|--------------|
| 29 % | 80% | 32 min       | 30.20 kWh |
| 9% | 80% | 37 min | 42.15 kWh    |

*Carging at a DC fast charger on the Autobahn.*

## At home, and charging

![](/uploads/2023/08/ladepunkt.jpg)

*11 KW charge point as it is installed in public spaces all over the country in the Netherlands 
([Wikipedia](https://nl.wikipedia.org/wiki/Oplaadpunt#/media/Bestand:Oplaadpaal_Utrecht.jpg)).*

At home, you won't be using a DC fast charger, but will be using an AC 11 kW charger.
On this, the car goes from 31% to 80% in 3h:10m.
A 22 kW charger would be twice as fast, but likely pointless.

An 11 kW charger is always sufficiently fast to charge up completely in reasonable time.
And if not, sufficient to get to a SoC where you can drive to the Autobahn safely,
and then use a DC fast charger to charge up really fast.

## Driving, Accelerating and Braking

When you are driving a constant speed on a flat surface,
you are using the exact amount of energy needed to counteract wind resistance.
So if your car's display reads "16 kW current energy use", you are using 16 kW/21 HP to keep the current speed.
That is about as much as the engine power of an old 1978 Renault 4 (or a Citroen 2CV).

The Megane has a more powerful engine, but only to accelerate nicely, 
and then it will even reach the catalog power of "160 kW" -- for a short time.

Well, the Megane also has a more powerful engine for better recuperation,
using the engine to convert kinetic energy back to electricity, and storing it back into the battery.
The limit for that is 60 kW, "accidentally" close to the sustained power of the engine.

This is also a good case for a speed limit in the only country in Europa that has none:
In the Netherlands there is a 100 km/h speed limit (at night sometimes 120 km/h),
and that leads to extremely equalized car speeds on the Autobahn.

You basically turn on cruise control, set it to 100 and are done with it.

In Germany, you might set the Megane to 120 km/h, turn on as many assistance systems as possible
and switch mentally into Fuck-You mode, but you will still have to accelerate and decelerate more,
because speeds on the German Autobahn vary a lot.

Not only does this make driving dangerous,
it also eats into your range without providing better average speeds.

## Sustained and Peak Power

The Megane is sold with a peak power of 160 kW, but the motor has a sustained power of only 55 kW.
You run it at even less, 16 kW, unless you accelerate.

Air resistance is growing with larger speed, and the sustained power of the motor
basically defines the cars top speed.
But of course, this will also draw from the battery accordingly,
so you will run out of energy faster, and need to charge earlier.

At 160 km/h, you will draw 55 kW, and will run out of power after 1 h.

It is typical for electric motors to overdrive them.
For example, an electric locomotive rated at 4000 kW is routinely driven at 6000 kW
on initial acceleration, until it hits the thermal limit, I have been told.

Also, the energy use of trains is incredibly low. 
A [Stadler Flirt](https://de.wikipedia.org/wiki/Stadler_Flirt) uses around 330 kWh/100 km.
That's the energy content of 30l Diesel, for a train of 60m length and 180 seats (around 300-350 people in commuter mode).
Or in other words, 5 times the energy use of a Diesel car, 
so if 6 seats are occupied, it breaks even with a car (at an average occupancy of 1.2 people/car).

![](/uploads/2023/08/flirt-energy-use.jpg)

*A Flirt has drawn 1408 kWh from the overhead line, and recuperated 748 kWh, for a net energy use of 660 kWh. 
At the Konstanz-Stuttgart Line (200 km), this equals 330 kWh/100 km, or around 39l of Benzine (or 34l of Diesel) in energy content.* 

# TL;DR

We can convert all kinds of energy into kWh, and use this to compare energy production and consumption.
This is convenient, because typical fuels happen to align somewhat with the metric system:
1 l of Diesel or 1 m^3 of Natural Gas both have each 10 kWh of energy content.
For fun, we can also do this with Milka Chocolate bars (0.6 kWh stored energy content)
or with Pizza (around 1 kWh per Europizza).

We can do the same thing with power, and kW, and since power times time is energy, 
we can also easily convert energy draw over time into battery depletion, and plan trips.

Getting fluent with units and conversions helps us to develop a feel for range, speed, energy and cost.
