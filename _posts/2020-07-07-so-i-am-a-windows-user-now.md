---
layout: post
title:  'So I am a Windows User now'
author-id: isotopp
feature-img: assets/img/background/rijksmuseum.jpg
date: 2020-07-07 11:15:58 +0200
tags:
- lang_en
- windows
- macos
- apple
---
So I am a Windows User now. I have an old MacBook pro, Late-2013 13" Retina, i7, 16 GB, 1 TB SSD, and the battery is done now, after 7 years. Also, the hardware is aging, and I want it refurbished and upgrade the son's equipment (which is the previous 2010 MBP I had at that time).

Modern Apple is not my thing. I have a company MBP, 2018 Retina 13" Four-Port, i7, 16 GB, and everything about this device is wrong. I cannot for the life of me type on this keyboard, I accidentally hit functions on the touchbar, and the trackpad is so large that I put my hands on it when I don't want to. Also, I had to disable the force-touch functionality because otherwise I would open files instead of selecting them. I have to charge it from the right hand side USB-C connector, because otherwise it would get hot and throttle.

With this in mind, and the announcement from Apple to move to ARM CPUs plus nailing the device cryptographically shut so that you can't boot other operating systems any more, it was time to move away from MacOS.

I knew I wanted a device with Touchscreen, a 2-in-1 or detachable, and I have been looking at a number of devices. The Surface Book 3 was my favorite, because you can detach the screen and use it as a tablet, plus it is available with a discrete NVidia graphics card in the keyboard base if you buy the right model. The various Lenovo Yoga variants looked well made and pretty, too.

![](/uploads/2020/07/yoga1.jpg)

*What is in the box? Machine, USB-C Dongle (HDMI, VGA, USB-A 3.0), Power Supply*

In the end, I chose a Lenovo Yoga C940, i7, 16GB, 1 TB with a NVidia 1650. This came in around 1000 Euro cheaper than the Surface Book 3, which I fully intend to spend on a monitor/docking station. The machine has a 4K touchscreen display (3840 × 2160), a keyboard I can handle, an okay sized touchpad und an awesome (and way too powerful) sound system. The screen is technically glossy, but I seem to be able to work with it just fine.

The machine came with an older version of Windows 10, which patched and upgraded itself to Build 2004 after an initial configuration. I then went on to upgrade WSL to WSL 2, and started using the Ubuntu 20.04 environment provided by the Microsoft Store.

This version of WSL 2 does not yet support graphical applications, so I proceeded with installation of VMware workstation  as well. I tried VirtualBox, but all installation attempts of an Ubuntu 20.04 image crashed during installation. VMware Workstation went through at the first attempt and with way less hassle - not unexpected. I have been using VMware Fusion at all times of my Mac carrer in the last 15 years, and it's primary hallmark was "It just works, and actually performs quite well", and VMware workstation just did the same.

I am now in the process of moving all basic applications to Windows, which after 15 years of Mac is quite an adjustment. But at least the communication side of things is somewhat covered: Signal, WhatsApp, Skype (Yes, for Oma), Slack, Discord and Twitter Apps are no problem at all. For email, I had to look around a bit, but I found eM Client to be quite good.

As a replacement for ReadKit, I need something that can handle around 500 RSS feeds efficiently and ideally synchronizes with a service like Newsblur (or The Old Reader or Feedly), because I also read my RSS on the Cellphone and GrazeTen for Android can sync with these 3 services. What I found to be tolerable seems to be QuiteRSS, but that does not seem to be able to sync at all.

Since I am over 50, I decided to be less of a speaker and instead encourage others to speak more, hence my need for Office programs can actually be completely covered by Google Office just fine, and LibreOffice seems to work tolerably well, too. Converting all my Keynote Files into Powerpoint/PDF/Slideshare is unfinished, though.

I am using Gimp and OmniGraffle on the Mac. Gimp is not hard to get, but outside of Visio an OmniGraffle-Replacement seems to be absent.

In general, the Windows Store seems to be a total loss. It is a source of updates for some onboard applications, so cannot be gotten rid of, but the so called "modern Windows" applications provided there are usually unmaintained, badly formatted and somewhat broken. In general, it seems that the market share of Windows in terms of licenses sold does in no way reflect the market share of Windows in terms of Developer mindshare, at least judging by the state of the Windows Store.

On the other hand, working with this piece of hardware and with Windows 10 when it is able to forget it's legacy is a breeze. It's when the varnish wears off and the old XP rears it's head that things get nasty, touch-unfriendly or generally needlessly complicated.

Python, git and other things are available natively and in WSL just fine, I have PyCharm, Sublime and VScode, and they just work. I got Hugo and Jekyll running in WSL, too. So that part of the system is covered just fine.

![](/uploads/2020/07/yoga2.jpg)

*5 seconds to the logo, 15 seconds until ready, from a complete cold start*


And it's fast. I am not speaking just about 12 threads on a NVME disk, I am also speaking about a system that cold-boots faster than a Mac wakes up from deep sleep, and about a graphic subsystem that can handle "Assassins Creed: Origins" in HD at "High" with absolutely playable framerates, and that actually manages to drive a Rift S in Elite: Dangerous pretty ok.

We will see how long it will take me to really convert all the ways I work...