---
author: isotopp
title: "What to do with self-driving car data?"
date: "2023-06-12T01:02:03Z"
feature-img: assets/img/background/rijksmuseum.jpg
toc: false
tags:
- lang_en
- bike
- überwachung
aliases:
  - /2023/06/12/what-to-do-with-self-driving-car-data.html
---

This is what a self-driving car sees, or constructs from the sensor data it uses:

![](2023/06/self-driving-01.jpg)

*Screenshot from [How is LiDAR remote sensing used for Autonomous vehicles?](https://youtu.be/JC94Y063x58?t=38)*

Specifically, LIDAR data is supposed to be extremely accurate and fast, 
[Lidar Data Accuracy](https://www.asprs.org/a/publications/proceedings/fall2006/0009.pdf)
claims 2-3cm resolution and many scans per second for aircraft LIDAR, and 
[Assessing Vehicle Profiling Accuracy of Handheld LiDAR](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8659977/)
claims similar resolution for casual LIDARing crash scenes with Apple handheld hardware.

Autonomous vehicles are using this data to detect other traffic, vehicles and persons, to classify them, 
and to model their behavior.
For this, they are building a model of the world around them,
in which the position and the speed vector of anything detected is very well known and tracked. 
It stands to reason that this is a very well-calibrated system, because if it were not,
the car would build the world-model wrongly and hit other people or things.

# Questions for self-driving car builders

## Detecting speeding while driving

![](2023/06/self-driving-02.jpg)

*Albrechtstraße, driving towards Wenckebachstraße, in Berlin. To the right a playground. This road is a "30 zone".*

Consider this car driving in a 30 zone in Berlin towards the main road. It is being passed on the left by another car,
driving

1. 35 km/h 
2. 50 km/h 
3. 70 km/h

In this situation, should the self-driving car send a report to the police for a traffic-violation (speeding) automatically?
If yes, why at this threshold and not any other? If no, why should the car ignore this?

## Detecting speeding while parking

Consider the same situation, but the car is parked in a GDPR-compliant "Sentry Mode".
That is, the car does not record any data from the public space, unless it has reason to (for example, because it is being burglared).
But of course its sensors do not stop at a road boundary, and it still somehow notices the speeding happening.

Should it report the traffic violation, or let it go?
If it should let it go despite having a recording, why? If the threshold is different from driving, why?

## The offending car could have been on auto, but it was not

Consider the offending, speeding car to be a model at least as capable as the model doing the recording.
It could drive autonomously, and if it were, it would have been following the posted speed limit of 30 km/h.
But the driver disabled the autonomous mode and manually and willfully speeded.

Should the driver be fined normally or get a different fine? Why?

Should that car have reported itself and its driver? Why or why not?

## The recording car is parked illegally

The driver of the recording car tries to park illegally:

![](2023/06/self-driving-03.jpg)

*Wenckebachstrasse 1, Berlin. The driver tries to park to the right of the Seat and the red-white boundary.*

The car has a map of legal parking spaces in the area available, and can position itself within 3 cm accuracy.
The driver tries to park it to the right of the Seat and the red-white boundary.
The car warns the driver, and is overridden.
Behind the driver on the other side of the road is a playground.
The building in front of the driver is the Wenckebach Hospital.

Should the car self-report the parking violation? Should this include data about the driver?
Should another car spotting this report the parking violation?
Or should only a [Scanauto](https://algoritmeregister.amsterdam.nl/en/automated-parking-control/) report this once it spots it on its tour?
Why or why not?
