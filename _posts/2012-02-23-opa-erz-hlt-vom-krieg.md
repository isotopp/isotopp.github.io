---
layout: post
published: true
title: Opa erzählt vom Krieg
author-id: isotopp
date: 2012-02-23 14:47:09 UTC
tags:
- damals
- internet
- mail
- usenet
- lang_de
feature-img: assets/img/background/rijksmuseum.jpg
---
Damals, vor dem Internet und dem DSL, so um 1989 rum, da hatten wir Modems. 
Mail wurde mit UUCP (Unix-to-Unix CoPy) übertragen.  Das heißt, man schrieb
eine Mail, und diese wanderte als Kopierauftrag in das UUCP Spooldirectory
des Systems.  Dort wartete sie, bis der Rechner eine Modem-Wählverbindung
aufgebaut hat (passierte so 1-3 mal am Tag) und wurde dann zum nächsten
System entlang der Kette kopiert.  Dort lag sie dann weiter, wartete auf die
nächste Wählverbindung und so weiter, bis sie irgendwann auf dem Zielrechner
angekommen war und dort lokal zugestellt wurde.

Das war sehr schnell: Oft war Mail schon am Absendetag auf dem Zielsystem
und wurde gelesen.

## Bangaddressen

Mailadressen sahen so aus: `kriski!tpki!mcshh!thw (Thomas Wieske)`.  Das ist
ein sogenannter Bangpath, wegen der ganzen Ausrufezeichen (Bang Sign).  Der
Bangpath gab die Schritte zum Zielsystem an, die mußte man wissen, und die
Adresse verkürzte sich mit jedem Schritt von links her.  O.a.  Adresse
bezeichnet also eine Zustellung an den Rechner `kriski`, der die Mail dann
(minus den kriski-Part) an `tpki` weiter kopierte, der sie an `mcshh` weiter
kopiert hat, wo es einen lokalen User `thw` gab.

Man kann auch im Kreis routen: `kriski!tpki!mcshh!unido!tpki!kriski!kris` -
eine Mail an mich selber mit Umweg über `mcshh` in Hamburg und `unido` in
Dortmund.  Weil so was sinnlos ist und Geld kostet wurde so etwas nicht
gerne gesehen.  Außerdem nervt es natürlich, wenn man jeden Hopser der Mail
selber in die Adresse rein froggern muß.

Also braucht man eine Notation für einen Verbindungsgraphen im Netz - "maps"
und ein Programm, daß aus diesem Graphen einen minimalen Spannbaum
berechnet, bei dem die Wurzel der eigene Systemknoten ist - "pathalias".

Holger Koepke fand nun einen Mapschnipsel des Systems tpki von 1990, mit
einer Liste der Modems dran.  In einem Mapschnipsel stehen auch die Links,
also die Verbindungen zu den Nachbarknoten, mit Gewichten dran.  Hier ein
[Mapschnipsel](http://groups.google.com/group/sub.config/browse_thread/thread/33abbbe7714b4b3b/9c31c38086d5c0c1)
von 1991: 

```console
tpki    unido(DAILY+HIGH), smurf(DAILY+HIGH), abqhh(DAILY+HIGH),
        <ipkima>(DAILY+HIGH)
```

Das Schreiben von Mapschnipseln ist eine Wissenschaft, die verloren
gegangen ist: Je nachdem, welche Gewichte man seinen Links zugewiesen hat,
hat man den Traffic von Dritten auf sich gezogen, die Mail Transit durch die
eigene Kiste machen.

Setzte ich zum Beispiel hier das Gewicht von `unido` und `smurf` auf
`DEMAND` (Verbindung ist instantan, nach Bedarf), würden viele andere Leute
ihre Mail mit der Sequenz `...!unido!tpki!smurf!...`  durch mich hindurch
routen, weil das quasi ein Nullzeit-Transit ist, auch wenn es 3 Hops sind. 
Das kostet aber leider Geld, und daher will man das meist nicht.  `ipkima` zum
Beispiel hat sich dort oben mit den spitzen Klammern als Blatt ausgewiesen
und Transit abgelehnt.

Manchen Leuten war das mit den Gewichten und den Konsequenzen nicht ganz
klar - wenn jemand also seine frisch gebackene, arschteure X.25 Datex-P
Verbindung hatte, und dann in der Map seinen Schnipsel stolz auf `DEMAND`
gesetzt hat, hat er also erst mal allen Mailtransit in Deutschland und dann
noch ein bischen auf sich gezogen.  Das konnten gigantische Trafficmengen -
einige hundert KB pro Tag!  - sein und einen in kürzester Zeit ruinieren.

## Trailblazer

Das Modem da in dem von Holger angesprochenen  Artikel ("Der hatte ein
Traiblazer, das hatte PEP!") war ein ganz besonderes Teil, denn die Telebit
Trailblazer waren eine Gruppe von Modems mit einer ganz wunderbaren
Betriebsart.

"Reguläre" Modems erzeugen ein Signal, indem sie Phase und Frequenz eines
Signals ändern und so einen von 2, 4, 16 oder noch mehr Punkten in einem
Phasen-Frequenzdiagramm ansteuern.  Nach einer Weile wechselt das Signal und
die nächste Bitkombination wird übertrag.

Bei 2400 Signalwechseln pro Sekunde (Baud) und 16 Punkten = 4 Bit pro Signal
kann man 9600 Bit/s übertragen.  Das ist V.32 zum Beispiel.

Ist die Leitung gestört, sieht das visuell so aus, als seien diese Punkte,
die durch das Signal beschrieben werden, unscharf.  Werden sie so unscharf,
daß sie ineinanderlaufen, ist das Signal nicht mehr erkennbar und die
Übertragung gestört.  Das Modem muß dann auf eine langsamere Geschwindigkeit
runterschalten ("Renegotiation").

Das bedeutet, daß das Modem einen Datenträgerton ("Carrier") hat, der ein
relativ breites Frequenzband (ideal den gesamten zur Verfügung stehenden
Bereich) belegt.  Gibt es in diesem Bereich Dämpfungen oder - schlimmer noch - 
eine Bandsperre oder Störung, etwa durch eine Schwebung, dann bricht die
Verbindung ab.  Auch dann, wenn eigentlich eine ganze Menge Restspektrum zur
Verfügung stünde.

Die Trailblazer, in Deutschland mit Telebimm-Zulassung als MDG-19k2
verkauft, waren nun Modems, die statt eines einzelnen schnellen und
superbreiten Carriers sehr viele (512) Carrier gesendet haben, von denen
jeder 0, 2, 4 oder 6 Bit überträgt und die sehr langsam wechseln (6 mal pro
Sekunde).

6 Baud sind so langsam, daß man sie hören kann - ein Telebit-Modem erzeugt
ein sehr characteristisches Carrierwummern ("Wop Wop Wop Wop Wop Wop").  Und
da die einzelnen Carrier sehr schmalbandig sind, kann man sie einzeln runter
regeln oder abschalten, wenn es Probleme gibt.

Schwebungen oder andere Bandsperren machen einem Telebit also nix aus: Man
kann ohne Probleme mit einem Telebit einen gcc Source von Kiel nach Berlin
Ost (Node "pericont") und anders herum schaufeln, auf einer Leitung, auf der
Schwebungen durch schlechte Richtfunkstrecken selbst Sprache schwer
verständlich machen.

Bestes Modem der Welt - voll geländegängig und schnell sogar auf
Datenfeldwegen!  **vermiss**
