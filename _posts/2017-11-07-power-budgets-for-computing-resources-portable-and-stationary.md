---
layout: post
status: publish
published: true
title: Power budgets for computing resources - portable and stationary
author-id: isotopp
feature-img: assets/img/background/rijksmuseum.jpg
date: '2017-11-07 12:48:04 +0100'
tags:
- data center
- computer
- lang_en
---

### Fanless devices

A cellphone or tablet is a fanless device. So is the 12"
Macbook. That means you can do whatever is possible at any point
in time within a
[TDP](https://en.wikipedia.org/wiki/Thermal_design_power) of
approximately 5W.

Here is the power consumption of my cellphone over a 12h period.
The scale on the left is mW, down is discharge, up is recharge
(plugged in). It's basically limited to 5W, and that only for
short periods of time.

![](/uploads/2017/11/power-budget.jpg)]

*Cellphone power over time. Green bar = plugged in. Yellow bar =
Screen on.*

These devices also have batteries, and when they are running on
batteries, they need to be sleeping most of the time and have
their display off. Whenever they are not dark and/or sleeping,
they drain the battery, fast.

These two facts are the reason why most people playing Ingress
have done so in Fall and Winter, and why they all have cabled up
enormous power banks to their equipment. That's also why your
cellphone used for navigation will reboot after an hour or two
of driving, unless you remove the protective bumper and put the
holder into the airflow of the dash vent. Also, white devices
are better than dark devices on sunny days on the Autobahn.

### Laptops with active ventilation

Your laptop probably has a fan. Mine does. It is still mostly
idle, but it is easily out of the TDP for fanless devices.

![](/uploads/2017/11/Screen-Shot-2017-11-07-at-12.34.50.png) 

*This machine is currently drawing 12.1W. The fans are hardly
moving.*

If I want to test what this machine could use, I could start a
game. Most games are busy waiting event loops, that is, they
keep the machine as busy as possible, and they are also
exercising all the 3D circuitry in the box quite well. My laptop
will never exceed 40W or so, doing this. 


### Gaming machines

The gaming box underneath the desk is another matter. The
graphics card is supposed to eat 
[about 75W under load](http://www.tomshardware.com/reviews/nvidia-geforce-gtx-1070-8gb-pascal-performance,4585-7.html),
the rest of the box probably as much. Thankfully, it has large
10cm fans that turn slowly, so it's not as noisy.

### Data center servers

Large servers in a data center usually have one or two Xeon type
CPUs, and depending on the kind of servers, some also have a
small two digit number of harddisks. 

![](/uploads/2017/11/hadoop.jpg)

A rack full of Hadoop servers

These machines clock in at between 200-350W per server, and the
power consumption is very 
[much dependent on what the machine is doing]({% link _posts/2017-07-19-threads-vs-watts.md %}).
I can make these devices use up to 400W using
[mprime95](https://www.mersenne.org/download/) in torture test
mode.

You can build mining rigs for Bitcoin, or rigs for machine
learning. These things can become incredible hotspots, because
each graphics card you add will contribute a three digit number
of watts to your build. Interesting and extreme setups with up
to 40.000 Watt per rack exist. They are very rare, and since you
need to feed them a lot of power, also expensive to keep
running.

A rack with more than some 12kW to 14kW active in it will need
water cooling. That complicates things, because you probably
want the lowest disk in that rack to be higher than the highest
drop of water, so placement constraints complicate the design.

**TL;DR:** You process bytes. Things heat up. Depending on where
you are, things will heat up so much that it is actually
limiting what you can do. As technology improves, you can
probably do more things with less heat, but it will still
register.
