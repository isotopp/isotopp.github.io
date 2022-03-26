---
title: "kauth Handlers in MacOS"
author: isotopp
date: "2018-12-18T09:06:19Z"
feature-img: assets/img/background/rijksmuseum.jpg
published: true
tags:
- pluspora_import
- lang_de
- security
- macos
- apple
---

[kauth handlers in MacOS](https://flylib.com/books/en/3.126.1.140/1/
), from a somewhat outdated MacOS X Internals book.
But a lot of the content is still relevant.
This section is about kauth handlers.
Kauth is a system in MacOS to hook file open and file exec operations.
It is what is being used by all the Corporate Security Malware that the Compliance Guys like to install on your work Mac, and it is one of the most common reasons for MacOS performance problems at work.

That is, because most Corpsec Malware does install a Kauth handler and then evaluates file open permission synchronously in that handler.
TrendMicro, Cylance, FireEye (xagt) and Websense DLP do this.
File `open()` operations are delayed by a factor of 6x to 10x usually:
Unpacking an electron app with 27.000 files on my home Mac takes 3 seconds, and took 27 seconds on my work Mac.

Usually, these things are also written badly:
Trendmicro for example runs their evaluations in a privileged userland process with ASLR off, so if you craft the right kind of GIF and drop it into `$HOME`, it will pop a shell on any Mac running Trendmicro just fine.
That is,  because the offsets are always right -- thanks to ASLR off.

And Websense DLP did rely on their Kauth handler so much that all files in the installations were world writeable:
"protected" only by the Kauth handler.
Which made exceptions for Binaries with the right name (among them "installd", "installer", or "shove"), so if you rename your cp program to "installer" you could happily overwrite any of the files -- reboot the box, get your own code executed as root and be done.

One of the nicest things on the Mac is [HopperApp](https://www.hopperapp.com/).
This is a very cheap, very well done clone of the basic functionality in IDA Pro, and allows you to have a quick look at the code of these Corpsec kernel extensions and see how they are breaking things, then act on that.
Depending on your alignment you write a report and get a cookie, or you use this for your own purposes.

In general, a Macbook with Corporate Security Malware is much more easily owned than a stock Apple device.
