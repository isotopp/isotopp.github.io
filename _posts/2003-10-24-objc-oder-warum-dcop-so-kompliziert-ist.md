---
layout: post
published: true
title: "ObjC - oder warum DCOP so kompliziert ist"
author-id: isotopp
date: 2003-10-24 06:33:19 UTC
tags:
- computer
- lang_de
feature-img: assets/img/background/rijksmuseum.jpg
---
## Methoden mit Klasse

Am Wochenende hatte ich mit Till eine recht coole Unterhaltung über die Innereien von Qt. Qt hat den Signal-Slot-Mechanismus, mit dem es Methoden von Objekten aufruft.

Dazu werden einige Methoden eines Objektes in eine spezielle Runtime-Tabelle der Klasse eingetragen, mit Namen. Das sind Slots.

Signale sind Platzhalter für Funktionsnamen, die in eine andere Tabelle eingetragen werden können. Mit connect() macht man so einen Eintrag: Man kopiert den Namen einer Funktion (genauer: eines Slots) in den Signalplatzhalter.

Warum ist das Cool? Weil es Sachen zur Laufzeit macht, die C++ sonst nur zur Compilezeit kann. Damit gewinn man Flexibilität und kann Komponenten zur Laufzeit zusammenstecken, ohne daß man Gigabytes an Stuff neu compilieren muß.

Es ist außerdem alt.

In Objective-C hatten wir genau das schon 1994 oder so. Besser sogar noch: In Objective-C sind alle Methoden automatisch immer Slots. Signale hat Objective-C als target (Zeiger auf ein Objekt) und action (Name einer Methode) definiert. Und in Objective-C sind alle Instanzvariablen das, was in Qt die Properties eines Objektes sind.

Zum Nachlesen: [Artikel von 1997](http://www.koehntopp.de/kris/inkomploehntopp/2495.html) und [Objective-C Handbuch](http://vvv.koehntopp.de/flame/c_c++/ObjC.pdf). Im übrigen ist bei Linux auch eine Objective-C Version des gcc dabei.

## DCOP

Was hat das mit DCOP zu tun? DCOP ruft remote Methoden auf demselben Rechner auf. Das heißt, irgendein KPart bietet Zeugs an wie "Lade Text in Editor-Part" oder "Save den Mist ab" und irgendeine Shell (etwa KDevelop) callt das KPart. Manuell, mit einem essentiell funktionalen Interface.

In Objective-C hatten wir das genialer gelöst: Hier kann man ein generisches Proxy-Objekt erzeugen. Generisch heißt, daß es nicht Proxy für ein bestimmtes Objekt ist, sondern daß man dem Proxy zur Laufzeit sagt, für was es Proxy ist.

Das Proxy-Objekt fragt dann seinen Klienten, was es für ein Objekt ist, welche Methoden der Klient hat und welche Instanzvariablen der Klient hat und wird selber zu einem Stand-In für den Client. Nun kann man den Proxy so verwenden wie man den Klienten verwenden würde, wenn er lokal ist.

Und der Proxy tütet die Callparameter ein, shipped sie per RPC zum Klienten, der rechnet rum, sendet ein Resultat zurück und der Proxy gibt das Resultat zurück. Resultat: RPC mehr oder weniger komplett verborgen, Proxy benutzbar als wär man selber da.

## Guide zum PDF

Der eine interessante Teil ist ab Seite 55, wo die Syntax vorgestellt wird. Das kann man überfliegen, denn es ist Zuckerguß, aber wichtig, um die Beispiele lesen zu können.

Auf Seite 87 stellen sie das Messaging vor. Das ist wichtig, und man kann es direkt auf Qt abbilden. Man lese auch Seite 90, Selectors. Das ist interessant, weil Qt es nicht kann. Auf Seite 92 erklären Sie target-action, was eine Art typenloses SIGNAL für Arme ist. Weil es typenlos ist, braucht man Code wie auf Seite 94.

Seite 101 ist gruselig, und hat kein Äquivalent in Qt - Categories sind Erweiterungen bestehender Klassen (ich kann also nachträglich die Image-Klasse selbst erweitern, und der Code wird von allen bestehenden Unterklassen von Image erweitert).

Seite 104 definiert Protocols, die von den meisten Leuten in anderen Sprachen als Interfaces bezeichnet werden. Die entscheidende Syntax ist auf Seite 112ff.

Einige Speedup-Tricks mit dem Runtime findet man auf Seite 120, mit dem methodForSelector.


Die Coolness beginnt auf Seite 145-151, Forwarding. Mit dem Dynamic Loading auf Seite 151 zusammen hat man dann ein sehr mächtiges Werkzeug in Form der NSBundle-Klasse, die das verpackt und OO-mäßig typsicher macht. Seite 152 geht dann gleich auf Remote Messaging by Proxy, worüber wir geredet haben.

Offenbar hat Objective-C aber inzwischen noch ein paar Erweiterungen in der Sprache selber, die die weitere Spezifikation von Parametern erlaubt ("bycopy/byref", "in/out/inout" und "oneway"). Das war vor sechs Jahren noch nicht so, da hat man sich mit anderen Konstrukten behelfen müssen. :-)

Ab Seite 163 geht es dann an die Interna, ich halte das für unsere Diskussion nicht mehr so interessant.

Die Grammatik der Sprache ist auf Seite 211ff dargestellt.
