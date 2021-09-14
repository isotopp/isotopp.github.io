---
layout: post
published: true
title: Historische Kernelsourcen
author-id: isotopp
date: 2008-05-27 08:08:46 UTC
tags:
- computer
- free software
- linux
- unix
- lang_de
feature-img: assets/img/background/rijksmuseum.jpg
---
In anderen Artikeln habe ich ja schon an Hand von [http://lxr.linux.no/](http://lxr.linux.no/) Strukturen im Linux-Kernel referenziert und in Erklärungen verwendet.

Auf [Tamacom](http://www.tamacom.com/tour.html) gibt es zum Vergleich die Quellen von Linux 2.6, FreeBSD 7, NetBSD 4.x, OpenBSD 4.x, GNU Hurd 0.3 und OpenSolaris zum verlinken. Auch liegen dort ein UNIX V7 Kernel und ein 4.3BSD rum.

[Minnie](http://minnie.tuhs.org/UnixTree/) hat eine schöne Sequenz wirklich alter Unix-Trees, der die Entwicklung der 70er Jahre und einige BSD-Trees miteinander vergleicht. Das älteste nützliche Zeugs von dort ist [von 1973](http://minnie.tuhs.org/UnixTree/Nsys/). 

> The nsys files are timestamped August 31, 1973. This is consistent with other known dates. The files use structs, but in December 1972 the C compiler didn't support structs. In September 1973, the C version of the kernel finally supplanted the assembly version, and the kernel here certainly works fine.

Mit anderen Worten, wir schauen hier der gleichzeitigen Entstehung der Sprache C und des Unix-Kernels zu. So kennt der V3 Kernel [noch keine GID](http://minnie.tuhs.org/UnixTree/V3/usr/man/man2/stat.2.html) im stat(2) Systemaufruf, und der Compiler kann noch keine "struct" - im nsys-Kernel 6 Monate später existieren beide - und andere wichtige Erfindungen werden gemacht.

[Goldenes Zitat](http://minnie.tuhs.org/UnixTree/Nsys/): 
> The number of UNIX installations is now above 20...