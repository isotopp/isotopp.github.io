---
layout: post
status: publish
published: true
title: How to Debug "My Mac won't go to sleep"
author: isotopp
author_login: kris
author_email: kristian.koehntopp@gmail.com
wordpress_id: 2739
wordpress_url: http://blog.koehntopp.info/?p=2739
date: '2017-11-03 10:27:22 +0100'
date_gmt: '2017-11-03 09:27:22 +0100'
categories:
- Apple
tags: []
---
<p>In Terminal,</p>
<p>    pmset -g assertions {% endhighlight %} The pmset program debugs power management. Assertions describe the system state as perceived by power management and if and when the system can go to sleep. Example output: </p>
<p>         $ pmset -g assertions 2017-11-02 16:31:14 +0100 Assertion status system-wide: BackgroundTask 0 ApplePushServiceTask 0 UserIsActive 1 PreventUserIdleDisplaySleep 1 PreventSystemSleep 0 ExternalMedia 0 PreventUserIdleSystemSleep 1 NetworkClientActive 0 Listed by owning process: pid 1310(Google Chrome): [0x00012f7c00018f49] 00:00:40 NoIdleSleepAssertion named: "Playing audio" pid 1310(Google Chrome): [0x00012f7c00058f48] 00:00:40 NoDisplaySleepAssertion named: "Playing video" pid 241(coreaudiod): [0x00012f7c0001810f] 00:00:40 PreventUserIdleSystemSleep named: "com.apple.audio.AppleHDAEngineOutput:1B,0,1,1:0.context.preventuseridlesleep" Created for PID: 1310. pid 113(hidd): [0x0000957f0009876f] 49:51:56 UserIsActive named: "com.apple.iohideventsystem.queue.tickle.4294975161.3" Timeout will fire in 10796 secs Action=TimeoutActionRelease Kernel Assertions: 0x10c=USB,BT-HID,MAGICWAKE [...] {% endhighlight %} UserIsActive, because I type right now. PreventUserIdleDisplaySleep because coreaudiod (pid 241) has been asked by Chrome (pid 1310) to do this. So the screen won't blank because Chrome is doing a video playback. PreventSystemSleep is 0, so the system will sleep when I close the lid. If you have for example Internet Sharing or Screen Sharing enabled, you can see PreventSystemSleep here: </p>
<p>             pid 77674(screensharingd): [0x000155590007906d] 06:30:03 PreventSystemSleep named: "Remote user is connected" {% endhighlight %} This will also set PreventSystemSleep to 1 in the overview list "Assertion status system-wide".</p>
