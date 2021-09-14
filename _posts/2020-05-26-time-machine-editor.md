---
layout: post
title:  'Time Machine Editor'
author-id: isotopp
feature-img: assets/img/background/rijksmuseum.jpg
date: 2020-05-26 15:45:15 +0200
tags:
- lang_en
- apple
- macos
- backup
---
I have an embedded Mac mini, it drives the local TV screen by doing OpenVPN to Germany, Netflix, Amazon and the local [Subsonic](https://subsonic.org). It does not really do much with the local disk, and it does not need to wake up every hour to make a Time Machine backup over the network.

To change the backup interval, install [Time Machine Editor](https://tclementdev.com/timemachineeditor/).

[![](/uploads/2020/05/tme.png)](https://tclementdev.com/timemachineeditor/)

*Time Machine Editor can change the Time Machine Backup interval. It has a background daemon that triggers the backups, a GUI application and a command line utility.*

Time Machine Editor works with automatic Time Machine backups disabled, which will turn off the local scheduler. It instead installs its own scheduler as a background process, which will then kick off the regular Time Machine backup process, but on the schedule you want. It can control all aspects of Time Machine: remote backups to an external disk as well as local snapshots. It understands applications that prevent display and machine sleep, exclusion times for the night and custom schedules. A command line application, tmectl, allows control of all aspects programmatically as well.

Because of the way the application is built, it does not require special privileges, and is also not running into System Integrity Protection problems with Catalina.

The pre-Catalina

```console
$ sudo defaults write /System/Library/LaunchDaemons/com.apple.backupd-auto StartInterval -int 14400
```

does no longer work: It tries to change a `plist` in `/System` and fails. The approach chosen by Time Machine Editor is cleaner and not subject to these new Apple limitations.

![](/uploads/2020/05/tme-before-after.png)

*Energy consumption of the Mac mini before and after installation of Time Machine Editor. I am running a backup every 6h, and that is just fine with this machine and how it is being used.*