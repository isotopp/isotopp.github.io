---
layout: post
title:  'Gosund and Tasmota'
author-id: isotopp
feature-img: assets/img/background/rijksmuseum.jpg
date: 2020-05-20 09:52:49 +0200
tags:
- lang_en
- iot
- home automation
---
(continued from [Plugs with Wifi]({% link _posts/2020-05-12-plugs-with-wifi.md %})) So the Gosund plugs came, as did the Raspi 4. I did cancel the Shelly plug and decomissioned the TP-Link Kaka, because Tasmota on Gosund is awesome and the Gosund hardware is dirt cheap.

![](/uploads/2020/05/tasmota-grafana.jpg)

*Power consumption of the local data grave, with too old a mainboard and CPU and way too much storage*

But lets start at the beginning:

[4 Pack of Gosund SP111 V1.1](https://www.amazon.de/dp/B082XR5C6J), so they come in at around 10 Euro/pc. They come with a chinese cloud application that is utterly useless, and I never even tried to get them running with it. This is recommended, because running that app might update the native firmware of these things and potentially lock it.

There is [tuya-convert](https://github.com/ct-Open-Source/tuya-convert) for solder-free flashing. The software needs to run on a machine with a controllable Wifi chip, in my case a Raspi 4. It fakes a trustworthy firmware update hotspot and then flashes an alternate firmware onto the plug. For me, this was an entirely pain-free process.

*Clarification:* tuya-convert is a solder-free conversion process that exploits a firmware update vulnerability in the original firmware. For some plugs or ESP devices in general it can work, and if it does, it is a breeze.

Some Tuya devices are locked. In this case it is always possible to convert them by connecting a serial port to the GPIO pins of the ESP chip. This can be done with a [Raspi 4](https://www.amazon.de/gp/product/B07TC2BK1X) ([Case](https://www.amazon.de/gp/product/B085795KPX), [Power](https://www.amazon.de/gp/product/B07ZCK2B8J), [SD Card](https://www.amazon.de/gp/product/B073JYVKNX)), a [RS232 adapter](https://www.amazon.de/gp/product/B01N7KA3OO), and some headers and breadboard wires. Sometimes the connection can be made without soldering using the breadboard wires, and always with a quick solder drop to make the connection more reliable. In my case all of that was not necessary for the Gosund plugs, tuya-convert worked.

In my home, the new firmware is [Tasmota](https://github.com/arendst/Tasmota) - there is also esphome. Tasmota does http, mqtt (both with TLS, if you wish) and syslog.

![](/uploads/2020/05/tasmota-ui.jpg)

*Tasmota UI in Admin mode. When configured, it can be locked to only show the data and the ON/OFF toggle. Control is then only possible via MQTT. It can also be basic-auth protected.*

After conversion, the plug is a hotspot. You join with a cellphone and enter the "login to hotspot" screen. You see a config for Wifi credentials. The plug joins your local Wifi, and config continues via normal Wifi, using http or mqtt.

Apart from the obvious config through http, you want

```console
{"NAME":"SP111 v1.1","GPIO":[56,0,158,0,132,134,0,0,131,17,0,21,0],"FLAG":0,"BASE":45}
```

as the template of choice for the v1.1 plug. Tasmota Templates select the binary function module that controls the plug, here 45 - Blitzwolf SHP6 - and then assigns functions to the GPIO pins.

Apart from setting up syslog, MQTT and Wifi, you also want to run some Console commands:

```console
VoltageSet 235
SetOption21 1
```

The former sets the base voltage the plug sees, calibrating things, and the latter makes the plug report voltage even when the relais is off.

Some people also recommend to shorten the power consumption reporting interval. The minimum is 10s. This can be done in the web interface, or with a console command:

```console
TelePeriod 10
```

Additionally, the number of digits after the comma can be dialled up. If you trust the equipment to actually deliver this precision, do configure like this, and also set a NTP server.

```console
Backlog AmpRes 3; EnergyRes 5; FreqRes 3; VoltRes 3; WattRes 3
NtpServer http://ptbtime1.ptb.de
```


[MQTT to Influx and Grafana](http://nilhcem.com/iot/home-monitoring-with-mqtt-influxdb-grafana) contains instructions for dockering Influx and Grafana and a small piece of Python that can be trivially adjusted to grab the power reports from the plug and load them into the Influx.

I added a total of 10 plugs to the household and may have need for another 10. I am also looking at a potential IPv4 shortage at home and may need to expand beyond a single /24.