---
layout: post
title:  'Disable Saitek X.52 pro Clutch Mode'
author-id: isotopp
feature-img: assets/img/background/rijksmuseum.jpg
date: 2020-01-15 18:21:19 +0100
tags:
- lang_en
- gaming
- 'elite dangerous'
- 'x.52 hotas'
---
This post is a memo to self, and describes how to disable the
X.52 clutch mode. I am flying with a Saitek/Logitech X.52 pro
[HOTAS](https://en.wikipedia.org/wiki/HOTAS), and this stick has
a 'clutch button' (labelled "i") in the thumb position of the
throttle (image: clutch highlighed in red)

![](/uploads/2020/01/x.52-clutch-0.png)

"Clutch mode" for this button means that it is usable as a
modfier for the other buttons, when pressed together with a
second button. Alone, it does nothing. For me, that is useless.

In order to disable function, go into Windows Settings, click
Devices, and search for "Set up USB Game Controllers".

![](/uploads/2020/01/x.52-clutch-1.png)

As always, useful things in Windows can only be accessed via
search and not via menu.

![](/uploads/2020/01/x.52-clutch-2.png)

Select the device, and then hit the device properties.

![](/uploads/2020/01/x.52-clutch-3.png)

In the MFD (Multi Function Display) of all places you can also
disable the clutch function (which, of course, has nothing to do
with the MFD at all).

Because Windows is stupid and saves this configuration per
USB-port, you will have to redo it every time you plug the stick
into a different USB port.
