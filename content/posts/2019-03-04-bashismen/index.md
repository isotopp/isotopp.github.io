---
author: isotopp
title: Bashismen
date: "2019-03-04T11:36:29Z"
feature-img: assets/img/background/rijksmuseum.jpg
tags:
  - pluspora_import
  - lang_de
  - computer
  - linux
  - unix
aliases:
  - /2019/03/04/bashismen.html
---

I [trolled Twitter](https://twitter.com/isotopp/status/1102527703033491456
) with some Ha-Ha-Only-Serious.

Every now and then someone complains on Twitter about the use of Bashisms in Shellscripts or legacy systems that are not completely Linux-compatible.
I usually troll back with the claim that anything that is not Linux is broken, and that anything that is not Bash is broken.

That is of course a troll, and I am of course at the same time totally serious.

Yes, MacOS exists and does not have a Linux userland, and that is a problem (just try to use Docker, you get a VM that runs Linux that then starts Containers).
Yes, Debian ships systems with ash, and your Openwrt runs Busybox, and in both cases that is the first thing everybody changes.
At least if they are going to use these systems for real, and for good reasons, too.

The thing is, time did not stop. 
It's 2019, and the by far dominant majority of all systems run Linux, bash and a few other things. 
It is perfectly okay to demand that these things are present, because the world has moved on and is way beyond kernel, operating systems and shell questions.
In fact, the need to be able to run Docker images at scale is so huge that even Microsoft implemented a Linux kernel API on their operating system, which underneath is anything but close to what Linux requires.

The other thing is, of course, if portability matters, you do not run Bash or any other kind of Shell.
Or if security matters.
Or extensibility. 
Or anything at all.
Use Python.
Or, PHP or even Perl, if you are like from the last millennium.

But never write Shell Scripts.
Ever.
Or if you do, do not expect them to run anywhere but on your box.
This in the history of mankind has never worked.

So, get yourself a real computer.
And use a proper programming language.
Thank you.
