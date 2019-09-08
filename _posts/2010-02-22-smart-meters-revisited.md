---
layout: post
published: true
title: Smart Meters revisited
author-id: isotopp
date: 2010-02-22 19:00:00 UTC
tags:
- computer
- energie
- security
- strom
- lang_de
feature-img: assets/img/background/baellebad.jpg
---

Im Juni letzten Jahres fragte ich "Wieviel Strom verbraucht ein
Stromzähler?", und dort haben wir auch am Rande Sicherheitsaspekte und
Probleme mit solcher Technologie gestreift.

![Smartmeter](/uploads/smartmeter_overview.jpg)

Andere Leute haben sich in der Zwischenzeit intensiver mit diesen Dingen
beschäftigt.  Die Ergebnisse sind nicht gut.  In 
[Reverse Engineering a Smart Meter](http://rdist.root.org/2010/02/15/reverse-engineering-a-smart-meter/)
baut Nate Lawson mal seinen Stromzähler auseinander: "But how vulnerable was
I actually?".  Das Öffnen des Gehäuses war recht einfach, die vorgefundene
Security minimal, und das Lock-Bit auf dem Controller war nicht gesetzt. 
Ein Firmware-Auslesen ist bereits erfolgt und das ROM harrt nun seiner
Interpretation...

Schon im Juli letzten Jahres fand CNN heraus:
[Smart Grid may be vulnerable to hackers](http://edition.cnn.com/2009/TECH/03/20/smartgrid.vulnerability/)
(Artikel nur mit JS lesbar und wahrscheinlich DRM verseucht):

> IOActive, a professional security services firm, determined that an
> attacker with $500 of equipment and materials and a background in
> electronics and software engineering could "take command and control of
> the [advanced meter infrastructure] allowing for the en masse manipulation
> of service to homes and businesses."

Der 
[Artikel von IOActive](http://www.ioactive.com/news-events/DavisSmartGridBlackHatPR.html)
hat dann mehr Detail: 

> Davis' research revealed that common attack techniques including buffer
> overflows, persistent, and non-persistent root kits could be assembled
> into self-propagating malicious software used to attack smart meters. 
> These vulnerabilities could result in attacks against the Smart Grid,
> causing utilities to briefly lose system control of their AMI meters and
> expose them to fraud, extortion attempts, or widespread system
> interruption.

Nur daß wir hier nicht von ein paar hunderttausend unkritischen PCs reden,
sondern von den Geräten, die die Stromzufuhr unserer Haushalte
kontrollieren.

Dazu dann vom Januar diesen Jahres mehr wieder bei Nate Lawson: 
[Smart meter crypto flaw worse than thought](http://rdist.root.org/2010/01/11/smart-meter-crypto-flaw-worse-than-thought/).

Die können zum Beispiel keine Krypto, denn:

> Travis Goodspeed has continued finding flaws in TI microcontrollers,
> branching out from the MSP430  to ZigBee  radio chipsets.  A few days ago,
> he posted a flaw in the random number generator.  Why is this important? 
> Because the MSP430 and ZigBee are found in many wireless sensor systems,
> including most Smart Meters.

Der Zufallszahlengenerator, aus dem das Schlüsselmaterial für die Krypto
gemacht werden soll, auf denen die Rechnungserstellung basiert, hat nicht
nur einen 16 Bit kleinen Entropiepool, sondern außerdem mit nicht zufälligen
Startwerten versehen und daher noch leichter vorhersagbar.  Dazu ist der
Algorithmus, mit dem dann "Zufallszahlen" generiert werden, nicht
kryptographisch sicher, also auch prinzipiell vorhersagbar.

Das Gerät - eine Serie von TI-Mikrocontrollern die in vielen Embedded
Geräten verwendet werden - ist so wie ausgeliefert nicht rettbar.
