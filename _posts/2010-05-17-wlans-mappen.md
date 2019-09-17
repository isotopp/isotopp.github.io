---
layout: post
published: true
title: WLANs mappen
author-id: isotopp
date: 2010-05-17 11:21:00 UTC
tags:
- internet
- privacy
- security
- wlan
- lang_de
feature-img: assets/img/background/rijksmuseum.jpg
---
Als Nachtrag zu 
[Wie man aus Versehen WLAN Daten mitschneidet]({% link _posts/2010-05-16-wie-man-aus-versehen-wlan-daten-mitschneidet.md %})
hier die Erklärung zu "*Weswegen fahren Leute eigentlich systematisch durch
die Straßen der Großstädte der Welt und zeichnen die Kennungen von WLAN
Access Points und vermutlich auch GSM Basisstationen auf?*"

Nun, jedesmal, wenn Ihr ein Handy online nehmt um dort eine Kartenanwendung
Eurer Wahl zu aktivieren, muß das Handy seine Position bestimmen. Das kann
vollkommen freihändig passieren, also nur mit dem GPS-Chip im Handy, wie es
die originale Nokia Map-Anwendung in meinem E90 getan hat. Das Handy braucht
dann freie Sicht zum Himmel und circa 80 Sekunden lang eine relativ stabile
Position, damit es funktioniert.

Für die mobile Anwendung ist das nicht wirklich akzeptabel, wie ich selbst
ausprobieren konnte, als ich auf der Suche nach dem Kunden mitten in London
stand und jeweils 2 bis 3 Minuten lang zur Salzsäule wurde, bevor ich wußte,
wo ich lang mußte.

Dazu kommt, daß GPS Hardware eine ganze Menge Strom zieht und den Akku des
Mobiltelefons binnen einer oder zweier Stunden auch bei guter Kondition und
voller Ladung leicht leer lutschen kann. Auch das mit dem E90 getestet,
indem ich auf der Suche nach besagtem Kunden vergessen habe die
Kartenanwendung nach Gebrauch zu beenden - ein Handy mit Multitasking kann
auch Nachteile haben, liebe geplagte iPhone-Anwender.

Moderne GPS-Anwendungen machen daher etwas anderes: Sie verwenden 
[EGPS](http://en.wikipedia.org/wiki/Enhanced_GPS), 
[AGPS](http://en.wikipedia.org/wiki/Assisted_GPS) oder gar 
[GPS-freie Lokalisierungen](http://en.wikipedia.org/wiki/Wi-Fi_Positioning_System) (
[Skyhook](http://www.skyhookwireless.com/)).

EGPS verwendet eine Grobpeilung auf der Basis von Kennungen der
Basisstationen um die Position des Telefons grob (auf Genauigkeit von
Mobilfunkzellen) zu schätzen. Zellengrößen im Mobilfunk sind sehr
unterschiedlich, sie können mehrere Kilometer groß sein, im
Innenstadtbereich als Mikrozellen aber auch einzelne Plätze oder Teile von
Plätzen abdecken.

Technisch ist es auch denkbar, daß das Mobiltelefon das Mobilfunknetz nach einer 
[Triangulation des Telefons](http://blogperso.univ-rennes1.fr/mohamed.laaraiedh/index.php/post/2008/10/09/FP7-WHERE-Project)
fragt - das Netz 'sieht' ein Telefon ja oft mit mehr als einer Basisstation
gleichzeitig, mit unterschiedlichen Signalstärken, und die Basisstation hat
oft mehrere Antennen, die jeweils Richtcharacteristik haben. Dadurch kann
das Mobilfunknetz die Position eines Telefons genauer bestimmen als das
Telefon das alleine kann und dem Telefon diese Informationen bereitstellen
(lieber noch würde man dem Teilnehmer einen Dienst auf der Basis dieser
Daten verkaufen, also location based services).

AGPS ist eine weitergehende Unterstützung der Positionsbestimmung des
Telefons, in der das Telefon nur die Signale der GPS Satelliten mißt, sie
aber nicht selber auswertet, sondern an einen Server im Netz weiter gibt.
Der Server hat eine genauere Uhr als das Mobiltelefon, was für GPS
Genauigkeit von entscheidener Bedeutung ist. Er hat weiterhin mehr Speicher
und CPU, sodaß er die für die Berechnung der Position notwendigen
Nachschlagetabellen im Speicher halten kann statt sie erst herunter laden zu
müssen (letzteres ist der Grund für 40 Sekunden der 80 Sekunden GPS
Startzeit).

![](/uploads/wifi.png)

GPS-lose Lokalisierungsdienste wie Skyhook oder eben Google haben außerdem
eine recht gute Karte von Sendern aller Art in der Stadt - Basisstationen
für GSM wie für WLAN. Ein Telefon, das seine Position bestimmen möchte, kann
nun messen, welche Sender und Senderkennungen es sehen kann und diese
Informationen an den Lokalisierungsdienst hochladen. Der
Lokalisierungsdienst gibt nun eine Position und eine Genauigkeit als
Ergebnis zurück. Telefone ohne GPS Hardware verwenden ausschließlich solche
Positionierungsdienste zur Positionsbestimmung.

Wenn man gar kein WLAN sehen kann, sich also in der Pampa befindet, dann
können nur GSM Basisstationen verwendet werden. Man hat dann natürlich ein
ziemliches Schätzeisen, das zur Navigation nur eingeschränkt verwendbar ist.
In der Stadt dagegen ist ein solcher Dienst für Straßen und Hausnummern in
der Regel genau genug und viel, viel schneller als irgendeine GPS-Variante.

Damit man einen solchen Dienst anbieten kann braucht man eine Verknüpfung
von GPS-Positionen mit den Sendern, die an dieser Position sichtbar sind.
Und dafür wiederum braucht man etwas, mit dem man Sender wiedererkennen
kann. Skyhook und Google verwenden dafür die MAC-Adresse der Basisstation,
also die in der Netzwerkkarte eingebrannte Hardware Adresse (6 Bytes, wie
bei allen neueren IEEE Protokollen) und die ESSID, den WLAN Netzwerknamen
(32 frei wählbare Bytes, oft vom Netzbetreiber gewählter Klartext der das
Netz beschreibt).

Die MAC Adresse steht im Absenderfeld jedes Paketes, das der Access Point
selbst generiert, und die ESSID steht (zusammen mit der MAC Adresse) auch in
den Beacon Paketen, die der Access Point alle paar Millisekunden abstrahlt,
um das Netz für Empfänger in der Gegend anzupreisen.

Wenn man den Access Point nicht versteckt (in privat betriebenen Netzen
nicht üblich), dann strahlt der AP die Beacon laufend und im Klartext aus,
auch wenn die Payload im Netz mit WEP oder einer WPA-Geschmacksrichtung
verschlüsselt ist. Das muß er, damit ein Client (etwa ein Laptop) das Netz
'sehen' und dem Benutzer zur Auswahl anbieten kann. Der Benutzer verbindet
den Laptop dann mit der ESSID des Netzes, indem er den Schlüssel für dieses
Netz eingibt, und das wiederum erlaubt dann auch die Entschlüsselung von
Payload Paketen.

![](/uploads/wardriving-map.jpg)

[Wardriving](http://www.sarumans-turm.de/blog/?page_id=111), Sarumans Turm

Damit Firmen wie Skyhook oder Google einen solchen Positionierungsdienst
anbieten können brauchen sie laufend aktuelle Karten, die sichtbare ESSIDs
und MAC-Adressen auf GPS-Koordinaten abbilden. Dazu genügt es im Grunde, die
Beacon-Pakete der Netze aufzufangen, die man bei der Durchfahrt sieht. Das
ist auch das, was Google intendiert hatte. Man kann das zum Beispiel daran
sehen, daß Google nach eigener Auskunft alle 200ms (fünf mal pro Sekunde)
den Kanal wechselt, um so regelmäßig alle WLAN-Frequenzen durchzuprobieren,
die in Deutschland zugelassen sind. Der Scanner im Street View- oder
Skyhook-Wagen verhält sich dabei genau wie ein Laptop, der noch nicht mit
einer ESSID assoziiert ist und der für die Erstellung der Liste der WLANs in
der Umgebung alle vorhandenen Frequenzen abtastet.

In der Vergangenheit hat Google diese Daten von Skyhook lizensiert, aber
wenn man sowieso Street View Cars durch die Straßen schicken muß, um
Turn-Based Navigation realisieren zu können, dann kann man diese Daten
natürlich auch selbst erfassen, statt Skyhook zu finanzieren - darum ein
Stück
[Stumbler](http://freshmeat.net/search/?q=stumbler&section=projects)-Software
und eine WLAN-Antenne in den Street View Cars.

Der Fehler, den Google dabei gemacht hat, ist alle empfangenen Pakete und
Paketfragmente aufzuzeichnen, anstatt schon bei der Aufzeichnung nur die
Beacons aufzuzeichnen. Empfangen muß Google genau wie Skyhook oder jeder
Client-Laptop auch erst einmal alle Pakete, weil erst dann durch das
Typ/Subtyp-Feld im WLAN-Frame erkennbar wird, was ein Payload-Paket ist und
was ein Management-Paket (Beacons sind nur ein Typ von Management Paketen,
es gibt noch viele mehr). Mit den aufgefangenen Payload-Paketen kann niemand
etwas anfangen (\*1) falls das Netzwerk mit einem WEP- oder WPA-Key
geschützt ist, da sie dann verschlüsselt sind. Nur wenn das Netz
unverschlüsselt ist liegen die Daten der Payload offen vor (\*2).

(\*1) Angriffe auf WEP gibt es zu Hauf, aber sie brauchen in der Regel mehr
Daten als man in 200ms auffangen kann.

(\*2) Falls nicht noch eine weitere Sicherung wie ssh, SSL oder ein VPN
verwendet worden ist, was jeder vernünftig denkende Mensch in einem offenen
WLAN hoffentlich grundsätzlich macht.
