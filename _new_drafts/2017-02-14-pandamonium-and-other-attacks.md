---
layout: post
status: publish
published: true
title: Pandamonium and other attacks
author: isotopp
author_login: kris
author_email: kristian.koehntopp@gmail.com
wordpress_id: 722
wordpress_url: http://blog.koehntopp.info/?p=722
date: '2017-02-14 09:14:08 +0100'
date_gmt: '2017-02-14 08:14:08 +0100'
categories:
- Hackerterrorcybercyber
tags: []
---
<p> ![](http://blog.koehntopp.info/wp-content/uploads/2017/02/pandamonium-150x150.png) From the HHOS-Dept: The Verizon Data Breach Digest is a thing that exists. [This issue](http://www.verizonenterprise.com/resources/reports/rp_data-breach-digest-2017-sneak-peek_xg_en.pdf) (PDF) reports a Botnet built from drink dispensers and other Internet of Trash things at a University that have been badly protected, but were indispensable enough that they could not be simply disconnected and wiped. Apparently the embedded trash united to run a DNS DDoS attack against some domains, but the Botnet was luckily written so badly that it could be taken over and disabled, regaining some semblance of control over the devices - mostly because the Botnets C&C did not use SSL and also did not encrypt passwords. So that was salvageable mostly due to incompetence on the side of the botnet operators.<!--more--> The advice given in the mitigation section is half-useful: It suggests putting the IoT-devices into a separate "zone" (network segment or VLAN), firewall them off the public internet and change default credentials. While that is generally good advice, it is often impossible to follow. For example, in your home network you might have Internet of Trash devices such as Wifi-enabled lightbulbs or networked speaker devices. Walling them off the Internet is impossible, because you need to stream music from services such as GPM or Spotify, and walling them off your actual home network is impossible because you want to control these devices from Cellphones and Laptops, while your Chromecasts happily whistle ultrasound to communicate and pair with your cellphone. And finally, separating these devices from the Internet will make them un-updateable, which is worse than everything else. </p>
<p>**In 2017 "network isolation" is a non-concept - there is no such thing as an air-gap or isolated network any more.**</p>
<p> Also, while changing default credentials is a very good idea, that is usually not working - so far most of them had a default-passworded vendor backdoor to enable "service" and "device recovery" or because of laziness. In most cases, the backdoor is secret and the password unchangeable, because it's part of the firmware. Until this kind of practice becomes illegal and is fined heavily, it won't stop. Here is what would help:<br />
- Minimum vendor update support for a pre-defined device lifetime for every single device. That lifetime most be shown prominently as an expiration date on the packaging. Security fixes must be provided by the vendor within a [Responsible Disclosure](https://en.wikipedia.org/wiki/Responsible_disclosure) timeline, and be enforced with a fine.<br />
- Vendor backdoors are outlawed and fined. Devices with backdoors are to be recalled and destroyed at the expense of the maker, if they are discovered after a sale.<br />
- Each device must come with a standardized predefined machine-readable communication profile from which firewall rules can be generated automatically. Home firewalls could read these descriptions and add them to a static, reviewable and non-UPnP policy store.<br />
 Until that happens, see the PDF.</p>
