---
layout: post
published: true
title: Firma mit Blogs
author-id: isotopp
date: 2004-12-08 16:03:47 UTC
tags:
- blog
- lang_de
feature-img: assets/img/background/rijksmuseum.jpg
---
Bei meinem Arbeitgeber ist es verpflichtend, ein Daily zu schreiben.

Im Daily schreibt man auf, was man an diesem Tag an persönlichen Zielen erreicht hat, und notiert weitere Dinge, von denen man glaubt, daß sie interessant sein können. 

> - Kalibrierung der Warpspulen abgeschlossen.
> - Deflektorkapazität wird bei weiterem Hochgeschwindigkeitsflug nicht mehr ausreichen. Upgradeoptionen evaluiert.
> - Energieverluste der lateralen Dämpfungsfelder untersucht. Ursache weiterhin unklar. Ich muß wohl einen der Waffenspezialisten hinzuziehen.

Das Daily sendet man an seine Peers (als Teamleiter also an alle Teamleiter unter demselben Abteilungsleiter), upstream (also an den Abteilungsleiter) und an alle Leute, die man im Daily erwähnt hat (also an alle Leute, mit denen man an diesem Tag zu tun hatte). Außerdem kann jeder das Daily von jedem Kollegen anfordern, wenn er möchte.

Da im Daily nicht nur die Sachen stehen, die einen angehen, sondern auch die Sachen, die der andere an diesem Tag sonst noch so gemacht hat, bekommt man einen recht schnellen und überraschend effektiven Informationsfluß hin. Es handelt sich quasi um ein institutionalisiertes <strike>Flur</strike>Turbolift-Gespräch.

Dailies wurden in der Firma bisher per Mail getauscht. Das war okay, erzeugt aber keinen nachlesbaren Trail, auf dem man später noch einmal suchen kann.

Einige Kollegen haben das it-wiki (ein MoinMoin) ein wenig aufgehackt und eine Seite mit SendDaily-Funktion entwickelt. Dort kann man sein Daily ins Wiki legen und am Ende des Tages dann SendDaily anklicken. SendDaily leert die Daily-Seite, sendet die Seite an die in der Seite angegebenen Empfänger, generiert aus einem Template eine neue leere Daily-Seite und hängt das Daily an das Daily-Archiv vorne an.

Schon fast ein Blog. Aber man muß halt `KristianKöhntopp/Daily`, `KristianKöhntopp/DailyVorgabe` und `KristianKöhntopp/Archiv2004` warten und insbesondere in `/Archiv2004` lassen sich Sachen nur sehr schwer wiederfinden.

Außerdem haben nicht alle Kollegen das Wiki verwendet, weil sie es nicht mögen. Wer ein MoinMoin mal gesehen hat, weiß was ich meine.

Wir haben seit Anfang Dezember dank [Jochen](http://www.jochen-lillich.de/) ein S9Y als itblog laufen. Bisher sind ein gutes Dutzend Kollegen darauf eingestiegen und bloggen ihre Dailies lustig in eine gemeinsame S9Y-Instanz. Das hat eine Reihe von Vorteilen (M. Roell, liest Du noch mit?): 

- Jede Zeile im alten Daily ist ein Eintrag im itblog. Auf diese Weise bekommt man unterschiedbare URLs für jeden Punkt
- Die Dinger sind kommentierbar.
- Jeder Ergebnisbereich bekommt eine Kategorie. Auf diese Weise lassen sich Sparten gezielt selektieren und ausfiltern.
- Wir lehren die Kollegen, Entry und Extended Entry zu unterscheiden. So sind auch längere Texte möglich, wenn man es wünscht.
- S9Y hat eine wirklich gute Volltextsuche.
- Hierarchische Kategorien bilden Delegationen direkt ab. Mehrfache Kategorien pro Eintrag erlauben gemeinsame Einträge.
- RSS läßt den Lesern freie Wahl bei der Weiterverarbeitung.
- Mehr Zusammenschau - man sieht mehr Dailies, und bekommt so mehr Streuinformation.

Aber es entstehen auch einige Sicherheitsprobleme: So müssen externe Trackbacks und Pings unbedingt deaktiviert werden, oder es gibt eine Katastrophe. 

Und: S9Y skaliert sich mit 20-40 Usern überraschend gut. Es fehlen einige Details, etwa eine Sicht nach User genau wie eine Sicht nach Kategorie, und einige Querstreifen zwecks besserer Lesbarkeit im User-Editor. Außerdem wäre es schön, wenn S9Y seine Anmeldeinformationen aus einem LDAP zöge.

Schließlich noch die Beobachtung am Rande:

Die Auswahl des Tools hat beeindruckende Rückwirkungen auf die Qualität des geschriebenen Textes. Während im Wiki häufig Einzeiler entstanden sind,

> ame, kris und kabl diskutieren die Auswirkungen des Upgrades der Warpfeldgeneratoren

finden sich jetzt eher brauchbare Texte.

> ame, kris und kabl stimmen das Upgrade der Warpfeldgeneratoren ab. Die neuen Spulen werden gute 60% mehr Leistung brauchen. ame diskutiert derzeit mit Anbietern von Dilithiumkristallen. kris fragt, ob die Kapazität der EPS-Kupplungen diesen Belastungen standhalten kann oder ob wir das Energienetz upgraden müssen. kabl merkt an, daß wir in diesem Fall den Onlinetermin für Warp 8 nicht halten können.

Mal sehen, ob das Werkzeug abteilungsweit angenommen wird. Eigentlich aber ein leichter Fall: Das Bloggen ist bei uns sowieso schon seit Jahren Bestandteil der Firmenkultur, und jetzt wird nur ein besseres Werkzeug dafür installiert.
