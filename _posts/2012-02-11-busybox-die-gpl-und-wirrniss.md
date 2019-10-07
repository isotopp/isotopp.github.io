---
layout: post
published: true
title: Busybox, die GPL und Wirrniss
author-id: isotopp
date: 2012-02-11 13:40:47 UTC
tags:
- free software
- lang_de
feature-img: assets/img/background/rijksmuseum.jpg
---
Was bisher geschah: Jemand bei Sony schreibt 
[einen Aufruf](http://www.elinux.org/Busybox_replacement_project),
einen Ersatz für Busybox zu schreiben, der nicht unter der GPL steht. 

>Busybox is a widely used program which implements several Linux command
> line utilities in a single, multi-tool binary.  It is provided under the
> GPL license.  Due to its utility and ubiquity, it has been used in a very
> large number of embedded devices.  This includes use by companies who are
> not as diligent about their GPL commitments as they should be.

Will sagen: Busybox ist ein Programm, das die Basisfunktionen vieler
Linux-Kommandozeilenwerkzeuge in einem Binary zusammenfaßt und sehr wenig
Platz verbraucht.  Wegen dieser Eigenschaften wird es gerne in Embedded
Systemen eingesetzt.

Da Busybox unter der 
[GPL]({% link _posts/2005-02-07-von-der-gpl.md %})
steht, viele Firmen sich aber einen Dreck um Copyright scheren, wenn es sie
selber statt ihre Endkunden betrifft, wird es gerne in Router und andere
Geräte eingebaut und ist dann Gegenstand einer 
[Lizenzklage]({% link _posts/2006-09-22-urteilsbegr-ndung-zu-gpl-in-deutschland-vor-gericht-durchgesetzt.md %}).
Eine Klage, die am Ende dazu führt, daß die Firmen ihre Firmware offenlegen müssen, weil
sie zu faul sind, selber zu programmieren und zu blöd, sich genau das
Urheberrecht zu halten, für dessen Verschärfung sie Unsummen an die diversen
[Lobbyfeen]({% link _posts/2011-11-24-von-einem-absturz-tutus-und-einem-neuen-urheberrecht.md %})
bezahlt haben (wir reden hier unter anderem von 
[Sony]({% link _posts/2011-04-27-wenn-man-sony-ist-hat-man-es-nicht-leicht.md %})).

Es gibt eine Reihe von Gruppen im Open Source Umfeld, die sich der
Durchsetzung von Offenen Lizenzen verschrieben haben.  Da ist einmal das von
Harald Welte initiierte 
[GPL Violations](http://gpl-violations.org/), ein weiterer Kandidat ist die 
[SFC](http://sfconservancy.org/members/current/)
(Software Freedom Conservancy).  Letztere vertritt auch die Interessen der
Busybox-Autoren und ist daher die Veranstaltung, gegen die das Busybox
Replacement Projekt primär zielt.

Die Reaktionen auf das Busybox Replacement Projekt waren sehr
unterschiedlich: Einerseits steht es natürlich jedermann frei, selbst und
eigenständig welche Software auch immer zu entwickeln.  Andererseits geht es
hier darum, Software zu schreiben, mit der man etwas illegales (nämlich das
lizenzwidrige Verwenden von Open Source in Closed Source Projekten)
einfacher machen möchte.  Das Problem ist nämlich, daß typischerweise in
solchen Projekten nicht nur Busybox illegal verwendet wird, sondern meist
auch viele andere Teilprojekte geplündet werden.

Es reicht aber nicht, 
[diese illegale Nutzung zu identifizieren](http://mjg59.dreamwidth.org/10437.html), 
sondern man muß auch klageberechtigt sein.  Busybox war und ist für die SFC
hier ein bequemer Hebel, da die SFC die Rechte des Urhebers in diesem Fall
wahrnehmen darf.  Das Sony-Projekt dient nun in erster Linie nicht dem
Fortschritt, sondern dazu, der SFC diesen Hebel aus der Hand zu nehmen -
rechtlich stellen sich die betreffenden Firmen jedoch kein bischen auf
legaleren Grund.

Andererseits gibt es auch abweichende Meinungen, [etwa diese](https://lwn.net/Articles/478361/):

>As the ex-maintainer of busybox who STARTED those lawsuits in the first
> place and now HUGELY REGRETS ever having done so, I think I'm entitled to
> stop the lawsuits in whatever way I see fit.
> 
> They never resulted in a single line of code added to the busybox
> repository.  They HAVE resulted in more than one company exiting Linux
> development entirely and switching to non-Linux operating systems for
> their embedded products, and they're a big part of the reason behind
> Android's "No GPL in userspace" policy.  (Which is Google, not Sony.)
> 
> Toybox is my project.  I've been doing it since 2006 because I believe I
> can write a better project than busybox from an engineering perspective. 
> I mothballed it because BusyBox had a 10 year headstart so I didn't think
> it mattered how much BETTER it was, nobody would use it.  Tim pointed out
> I was wrong about that, I _agreed_ with him once I thought about it, so
> I've started it up again.

Die Stellungnahm von Harald Welte befindet sich 
[in seinem Blog](http://laforge.gnumonks.org/weblog/2012/02/09/#20120209-linux_gpl_enforcement_conservancy_busybox)
Er schreibt unter anderem:

> People who claim that GPL enforcement is scaring away companies from using
> Linux and/or other Free Software also have to be careful in what they say. 
> If a commercial entity enters a new market (let's say Android Tablets),
> then there is a certain due diligence required before entering that
> market.  So if you don't understand Free Software and particularly GPL
> licensing, then you shouldn't place a Linux-based device on the market.
>
> ...
>
> But come on, dealing with embedded devices in 2012 and still getting
> compliance outright wrong really means that there has not been the least
> bit of attention on this subject.  And without enforcement, it is never
> going to change.  People who want no enforcement should simply use
> MIT-style licenses.
>
> ...
>
> Let me conclude with a clear statement to anyone who thinks that by
> replacing Busybox with a non-GPL licensed project they can evade GPL
> enforcement: It will not work.  There are others out there enforcing the
> GPL.  Last but not least gpl-violations.org.
