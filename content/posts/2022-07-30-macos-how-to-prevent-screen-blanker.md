---
author: isotopp
date: "2022-07-30T05:06:07Z"

feature-img: assets/img/background/rijksmuseum.jpg
title: "MacOS: How to prevent screen blanker"
published: true
tags:
- lang_en
- apple
- macos
- python
---

When running Keynote, MacOS prevents the screen blanker from kicking in.
I needed a similar thing in one of my Python applications, so I needed to find out how it does that.

It turns out, there is an API for that: 
[`beginActivity:withOptions:`](https://developer.apple.com/documentation/foundation/nsprocessinfo/1415995-beginactivitywithoptions),
which returns an Object token `activity`.
Calling [`endActivity`](https://developer.apple.com/documentation/foundation/nsprocessinfo/1411321-endactivity) 
with that Token ends the activity, and resumes the screen blanker countdown.

There is a list of activity options,
[`NSActivityOptions`](https://developer.apple.com/documentation/foundation/nsactivityoptions).
We are interested into `NSActivityIdleDisplaySleepDisabled` and `NSActivityUserInteractive`, mostly.

Interfacing with Objective-C in Python is possible through `ctypes`, but that is work.
Work, it turns out, that has already been done in 
[`appnope`](https://github.com/minrk/appnope), 
specifically in [`_nope.py`](https://github.com/minrk/appnope/blob/c97905ae5d2f5f2ce2fb65ce127a0e5c19ee2c50/appnope/_nope.py#L52-L73).

Integrating that into my PyQt application is trivial.
