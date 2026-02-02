---
author: isotopp
date: "2025-04-03T03:04:05Z"
feature-img: assets/img/background/rijksmuseum.jpg
title: "Panasonic Comfort Cloud"
toc: true
tags:
  - lang_en
  - netherlands
  - energy
  - climate
aliases:
  - /2025/04/03/panasonic-comfort-cloud.html
---

As discussed [previously]({{< relref "2025-03-10-going-fully-electric.md" >}}),
we have replaced our home heating with Air-Air-Heatpumps,
that is, air-conditioning units that have a reverse-mode.

In our case, the indoor units are Panasonic Etherea Z (CS-Z25ZKEW and CS-Z20ZKEW), 
which are connected to a multi-split outdoor unit,
a 3x on the north side, and a 5x (one blind) on the south side, for a total of seven units.

# Adding CS-ZxxZKEW units to Panasonic Comfort Cloud

These units have integrated Wifi, and can be connected to the Panasonic comfort cloud.
This was problematic, because the manual and the labeling was unclear, and led into the wrong direction.

For each indoor unit there is a remote that came with a sticker.
The sticker has a QR-code, which leads to an install link for the Panasonic Comfort Cloud application.

![](2025/04/comfort-01.jpg)

*QR-code for the Panasonic Comfort Cloud installation.*

You need to make an account,
and then end up in a very empty screen with a single "+" sign that allows you to start the "add device" workflow. 

![](2025/04/comfort-02.jpg)

*Comfort Cloud start screen after making an account.*

The next steps seem are straight forward: Add an air-conditioner:

![](2025/04/comfort-03.jpg)

Select the kind with a wireless remote controller:

![](2025/04/comfort-04.jpg)

And then, choose what kind of device you have:

![](2025/04/comfort-06.jpg)

Look at the device and decide what kind of device this is:

![](2025/04/comfort-05.jpg)

Now, if you think you have a device with **ONE** front panel sticker, you'd be wrong, and things will not work.

If you choose that, the device will instruct you to turn on the WiFi on the wall unit (that is correct):

![](2025/04/comfort-07.jpg)

The cellphone will then try to join the WiFi `Panasonic-CS-wirelessAP`:

![](2025/04/comfort-08.jpg)

and that will not work, because the wall unit starts up the WiFi `Panasonic-CS-V2-eM00`. 
Wall unit and telephone are using different WiFi ESSIDs, and will not see each other, configuration will fail.

> This is a unit without a front panel sticker!

So the following flow works:

1. Start the App.
2. Inside the App, lie to the app and say "No QR Code"
3. The App then says "Open the flap", and you can say "Right, there is a QR code inside, thanks."
4. The App (not iOS) then wants to scan the very same QR Code.
5. This then takes ages, but adds the unit using a secret config Bluetooth.
6. This is not the workflow described in the manual delivered with the unit.
7. But it works.

![](2025/04/comfort-10.jpg)

Add the units one after the other.

# Home Assistant Integration with Panasonic Comfort Cloud

1. Install HACS.
2. Install Panasonic Comfort Cloud from HACS. ![](2025/04/comfort-12.jpg)
3. Settings -> Devices and Services -> Add Integration -> Panasonic Comfort Cloud ![](2025/04/comfort-13.jpg)
4. Configure Panasonic Comfort Cloud Integration, device discovery runs
5. For each device,
   we get 13 valid entities and several others
   that are implemented but not valid for our device type. ![](2025/04/comfort-14.jpg)
6. The entity `climate.<device name>` yields a useful control panel. ![](2025/04/comfort-15.jpg)
7. Dashboard the shit out of everything for profit.

I can now turn the air conditioners on and off using HASS.
I will be able to create air conditioner automations that keep the house in a sane temperature range automatically.
