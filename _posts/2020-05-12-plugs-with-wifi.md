---
layout: post
title:  'Plugs with Wifi'
author-id: isotopp
feature-img: assets/img/background/rijksmuseum.jpg
date: 2020-05-12 20:20:46 +0200
tags:
- lang_en
- iot
- home automation
---
So we are baking bread, and for that we have a Wiesheu minimat oven that comes in at a full 16A - supposedly it is using 3kW or more peak plus the condenser hood that comes in at another 500W top power draw. On the other hand, when running the thing is hardly lukewarm, it is running much cooler than the Neff household oven/microwave combo we have.

![](/uploads/2020/05/wiesheu.jpg)

*Wiesheu minimat with condenser hood. Convection oven with 3 trays (for buns) or a single layer of stone plate for bread. Can do 3x12 buns (20 min) or 2-3 loaves of bread (1h). Power draw 3kW + 0.5kW for the hood. Intended use is a show oven in the sales room of a bakery, or as PoS oven in a gas station or supermarket.*

So Sammy wanted to know what is cheaper to use: The Wiesheu or the Neff. And for that I needed a way to measure and report power dram of a wall plug. I [asked Twitter](https://twitter.com/isotopp/status/1258765170219892736) for solutions that can do

- 16A (some solutions do only 10A)
- no cloud account or cloud reporting

I was imagining something that pushes power consumption to syslog every minute or can log to a graphite. I don't actually need on/off relais, but that would be okay to have. I have Wifi on 2.4 GHz and 5 GHz everywhere. I do not actually have use for a cellphone app or control from outside the Wifi.

There was lifely discussion, and I have been pointed to

- [Tasmota](https://tasmota.github.io), an alternative firmware for devices based on the ESP8266 chip, and
  - specifically the [Gosund](https://www.amazon.de/gp/product/B085Q5ZR33) plugs, at 24 Euro for a pair they are dirt cheap. The plugs are to be controlled with a cellphone app that requires cloud usage, but you are not supposed to use this, but reflash them with Tasmota and then use a local MQTT bridge to run them.
- The [TP-Link Kasa HS110](https://www.amazon.de/gp/product/B017X72IES). The device can be configured with a local cellphone app, not requiring a cloud account, and speaks a simple propietary protocol that has been [reverse engineered](https://www.softscheck.com/en/reverse-engineering-tp-link-hs110/) and [implemented in Python](https://github.com/softScheck/tplink-smartplug). The switch has a number of known security problems, and can be controlled and bricked by anyone having access to your local network. The Kasa plug comes in at 23 Euro/piece.
- The [Shelly Plug](https://shop.shelly.cloud/shelly-plug-wifi-smart-home-automation#71) (16A device), also available as Plug S (10A device). While the devices come with an app and cloud, they have a [documented API](https://shelly-api-docs.shelly.cloud). It comes in at 32.40 Euro when ordered from the manufacurer.

The TP-Link Kasa arrived yesterday and was immediately usable: Plug in, install app, skip cloud registration, put plug into Wifi, and start using it. I was only interested into their energy reporting feature and I now know:

- The oven will consume up to 3200W when heating up.
- It will consume around 170W while running normally, maintaining level temperature.
- It consumes around 54W when on and running idle.
- It consumes 3.5W when switched off in standby.

![](/uploads/2020/05/wiesheu-power.png)

Yesterday the Gosund plugs have been arriving, too. They need a bit of treatment, though. Instructions said to not connect them so that they do not update themselves - it can only make the reflashing harder if the original firmware is current.

I also seem to need a RS232-adapter and/or a Raspi with Wifi in order to flash them over Wifi, so I bought a bit of toys to do that:

- A Raspi 4B
- Case for the Raspi
- Power supply for the Raspi
- SD-card for the Raspi
- [CH340G](https://www.amazon.de/gp/product/B01N7KA3OO) Adapter for local flashing

There seem to be two procedures for reflashing, one [wired](https://www.malachisoord.com/2019/11/24/flashing-custom-firmware-on-a-gosund-sp111/), and one [over the air using tuya-convert](https://github.com/ct-Open-Source/tuya-convert). Having a modern Raspi is not wrong, so we will see where that goes, but the wired procedure looks more stable to me.

Next week I will know more.
