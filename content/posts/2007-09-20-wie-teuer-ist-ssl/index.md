---
author: isotopp
date: "2007-09-20T22:38:33Z"
feature-img: assets/img/background/schloss.jpg
tags:
- security
- lang_de
title: Wie teuer ist SSL?
aliases:
  - /2007/09/20/wie-teuer-ist-ssl.md.html
---

Ich hatte als amtierender Securityfuzzi einmal die Aufgabe, die benötigte Verschlüsselungskapazität eines großen Webdienstleisters für eine Konsolidierungsmaßnahme auszurechnen.

Das gesamte Rechenzentrum dieses Ladens hatte damals eine Leistungsaufnahme von ca. 2 Megawatt (2 Millionen Watt), das sind etwa 2500 PS (zwei dicke Schiffsdiesel als Notstromaggregate) und hatte damals knapp 100 Megabyte pro Sekunde an Traffic raus gepustet.
Davon waren etwa 80 % verschlüsselt, denn dort hat man Verschlüsselung eingeschaltet, wenn immer ein Passwort oder andere benutzerspezifische Daten übertragen werden und bleibt dann im SSL-Modus, um die Session zu schützen.

Durch Messungen und Tests sowie ein wenig äußerst konservative Berechnungsmagie sind wir damals bei einer Kapazität von etwa 20 IBM Bladecenter-Blades (jede damals mit 2 Cores @ 3Ghz) angekommen.
Rundet man dies auf, landet man bei 28 Blades, oder genau 2 Enclosures mit je 14 Blades mit je 2 Cores mit je 3 GHz, oder 168 Intel-Ghz Gesamtkapazität.

[![](2cv.jpg)](https://flickr.com/photos/jmanners/220977724)

*Ein Enclosure hat eine Leistungsaufnahme von 3.5 kW (3500 Watt) maximal, sodass man etwa 7 kW oder 10 PS veranschlagen kann. 
Das ist ein kleines Motorrad oder ein [Original-2CV](http://de.wikipedia.org/wiki/2CV).*

Unsere Messungen haben gezeigt, daß der größte Teil der Rechenpower im SSL Key Exchange und der asymmetrischen Verschlüsselung versenkt wird. 
Sobald das SSL erst einmal im symmetrischen Stream ist, sinkt der CPU-Verbrauch dramatisch.
Oder anders gesagt:
Wenn man eine IVW-Box ist, die praktisch nur SSL Key Exchange macht, weil die Payload nur 41 Byte große transparente Pixel sind, die dann aber per SSL rausmüssen, wenn man also eine solche IVW-Box ist, dann ist das wesentlich härteres Brot. 
Ein SSL Key Exchange sind übrigens so um die 2.5 KB. 

Kostenmäßig ist für uns damals eine SSL-Implementierung in Software mit normalen Standard-CPUs am günstigsten gewesen, selbst unter Berücksichtigung von Rackspace und Strom.
SSL erscheint teuer, wenn man es in Relation zu Rechenpower und Leistung von Routern rechnet.
Bezieht man das Backend mit in den Vergleich ein (was leichter fällt, wenn man das SSL nicht in Cisco-Switchblades oder Radwares implementieren will), dann relativiert sich der angebliche Overhead sehr schnell.

(Inspiriert durch das Lesen von 
[Jörgs Artikel](http://www.c0t0d0s0.org/archives/3497-The-need-for-cryptography-everywhere.html))
