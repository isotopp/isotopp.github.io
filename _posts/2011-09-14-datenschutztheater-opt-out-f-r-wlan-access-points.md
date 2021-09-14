---
layout: post
published: true
title: 'Datenschutztheater: Opt-Out für WLAN Access Points'
author-id: isotopp
date: 2011-09-14 17:59:34 UTC
tags:
- datenschutz
- politik
- privacy
- spackeria
- lang_de
feature-img: assets/img/background/rijksmuseum.jpg
---
Jürgen Geuter erklärt bei der Spackeria den Begriff
[Datenschutztheater](http://blog.spackeria.org/2011/09/12/datenschutztheater/),
der nach dem 
[Security Theater](https://secure.wikimedia.org/wikipedia/en/wiki/Security_theater)
von Schneier modelliert ist: 

> Datenschutztheater bezeichnet eine Massnahme oder eine Sammlung von
> Massnahmen, die den gefühlten Schutz von Daten verbessern ohne dabei die
> Daten funktional vor Ge- oder Missbrauch zu schützen.

Schauen wir uns das Stück einmal an

[Golem](http://www.golem.de/1109/86451.html) schreibt: 
> Google schafft für Besitzer von WLAN-Access-Points weltweit die
> Möglichkeit, einer Nutzung der WLAN-Daten ihres Geräts im Rahmen von
> Googles ortsbezogenen Diensten zu widersprechen. Das Unternehmen folgt
> damit den Forderungen europäischer Datenschützer.

Was ist passiert? Das habe ich in einem 
[älteren Artikel]({% link _posts/2010-05-17-wlans-mappen.md %}) 
bereits einmal in lang erklärt, auch 
[wie es dazu kommen konnte]({% link _posts/2010-05-16-wie-man-aus-versehen-wlan-daten-mitschneidet.md %}).

Die Zusammenfassung des Sachverhaltes ist:

Google hat mit den Streetview-Autos nicht nur Fotos der Straßen und
Hausfassaden aufgenommen (so wie das Microsoft derzeit für Bing Streetside
ebenfalls macht), sondern auch die Position der Wagen mit den an dieser
Position sichtbaren WLAN-Kennungen verknüpft.

Dasselbe passiert auch laufend bei jeder Verwendung eines Android-, iPhone-
oder Windows7-Telefons: 

1. Das Telefon schaut, ob es genaue Positionsdaten über GPS bekommen kann.
   Das kann es, wenn GPS eingeschaltet ist.
1. In diesem Fall - und nur in diesem Fall - macht es Sinn, auch
   auf das Wifi zu gucken, wenn man das kann, und die Feldstärken,
   MAC-Adressen und ESSID-Kennungen der sichtbaren WLAN-Stationen
   aufzuzeichnen. Das funktioniert, wenn Wifi angeschaltet ist, und es
   funktioniert bei verschlüsselten und unverschlüsselten WLANs, da die
   Beacon-Pakete immer unverschlüsselt gesendet werden. 
1. Wenn Schritt 1 und Schritt 2 erfolgreich sind, dann lädt das Telefon
   irgendwann einmal ein Datenpaket mit der Verknüpfung GPS-Position zu
   sichtbaren WLAN-Netzen zum Telefon-Hersteller hoch, also je nach Telefon zu
   Google, Apple oder Microsoft.

Der Vorgang ist bei allen diesen Smartphone-Herstellern genau identisch.
Jeder dieser Anbieter verwendet diese Daten, um Positionskarten zu erzeugen,
in denen berechnet wird, welche WLAN-Netze von welcher Position aus sichtbar
sind. Genau genommen wird die umgedrehte Funktionalität gebraucht: Aus der
Information, welche WLANs sichtbar sind, kann man die Position des Telefons
bestimmen. Dies ist schneller als GPS zu verwenden, das eine Startzeit von
80 Sekunden (reines GPS) oder gut 10 Sekunden (Assisted GPS) hat.

Google verwendet die WLANs also nicht, um darüber Daten zu übertragen - das
geht auch nicht, wenn das WLAN verschlüsselt ist. Google verbreitet auch
nicht die WLAN oder die Position des WLANs an Dritte. Es benutzt lediglich
die Tatsache, daß jemand ein bestimmtes WLAN mit seinem Telefon sehen kann,
um dieser Person zu sagen, wo sie sich vermutlich befindet.

### Datenschutztheater?

> Google schafft für Besitzer von WLAN-Access-Points weltweit die
> Möglichkeit, einer Nutzung der WLAN-Daten ihres Geräts im Rahmen von
> Googles ortsbezogenen Diensten zu widersprechen. Das Unternehmen folgt
> damit den Forderungen europäischer Datenschützer.

Verschiedene europäische Datenschützer haben nun gefordert, daß für die
Betreiber eines WLAN die Möglichkeit eines Opt-Out besteht.

Äh. Ja.

Was soll das genau bedeuten?

Es kann *nicht* bedeuten, daß der Benutzer eines Telefons das WLAN nicht
mehr sieht - der Betreiber des WLAN betreibt einen Sender, und dieser Sender
verbreitet alle paar Millisekunden die Kennung des WLANs sowie die
Hardware-Adresse des Access Points unverschlüsselt so weit die Leistung
dieses Senders reicht. Das muß der Sender tun, damit man auf seinem Laptop
oder Handy das Netzwerk sieht, und man es anklicken kann, um sich mit ihm zu
verbinden.

Wenn man nicht möchte, daß ein WLAN für Dritte sichtbar ist, kann man das
Netz auf 'verborgen' (hidden ESSID) konfigurieren. in diesem Fall werden
immer noch Beacon-Frames gesendet (das muß so), aber in diesen ist der
Netzwerkname (die ESSID) nicht mehr enthalten. Man verliert so jedoch die
Fähigkeit, sich durch Anklicken seinem eigenen Netz zu verbinden und muß die
Verbindung zum Netz auf jedem Rechner manuell einrichten.

Was soll das also stattdessen genau bedeuten?

Es kann *nicht* bedeuten, daß ein Android-, Apple- oder Windos7-Telefon die
ESSID im Zusammenhang mit einer Position nicht mehr erfaßt und zu Google,
Apple oder Microsoft überträgt. Das Telefon kann nicht eine Liste mit allen
relevanten Opt-Outs speichern und diese Erfassung und Übertragung
unterdrücken. Die Daten werden also in jedem Fall zum Anbieter hochgeladen
und dann dort entsprechend der Opt-Out Einstellung weiter verarbeitet.

Was soll das also stattdessen genau bedeuten?

Es kann *nicht* bedeuten, daß ein Android-, Apple- oder
Windows7-Telefon die Verarbeitungsschritte 1-3 oben nicht mehr durchführt.
Dafür existiert auf allen diesen Telefon bereits ein Knopf, und der befindet
sich direkt unter der Kontrolle des Telefon-Besitzers, nicht unter der
Kontrolle des WLAN-Betreibers.

Was soll das also stattdessen genau bedeuten?

Wir haben also die folgende Situation: Jemand betreibt ein WLAN. Dieses WLAN
brüllt alle paar Millisekunden den Namen des WLAN im Klartext in die
Landschaft (außer, man schaltet das ab, und nimmt den damit verbundenen
Komfortverlust in Kauf).

Jemand anders geht da mit einem WLAN-Empfänger (dem Smartphone) vorbei, der
auch GPS-Daten erfaßt. Diese zweite Person verknüpft Position mit sichtbaren
ESSIDs und lädt diese zum Hersteller des Telefons rauf (es sei denn, diese
Person hat den Upload abgeschaltet).

Die Daten landen jetzt beim Hersteller des Smartphones und gemäß Opt-Out
schmeißt er einige dieser (ESSID, Position)-Paare weg, und andere tut er in
seine Datenbank. 

_Das ist die Funktion des Opt-Out, und es ist seine einzige Funktion._

Eine dritte Person wandert zu einem späteren Zeitpunkt da lang. Das
Smartphone dieser Person erfaßt alle sichtbaren ESSIDs (auch die mit
Opt-Out) und lädt diese Liste zum Hersteller des Smartphones hoch. Der
Hersteller des Smartphones findet die ESSIDs ohne Opt-Out in seiner
Datenbank und liest die GPS-Positionen dieser WLANs ab. Die ESSIDs mit
Opt-Out findet er natürlich nicht. Der Telefonhersteller rät auf der
Grundlage dieser Daten eine Position für das Telefon (mit
Genauigkeitsradius) und schickt zur anfragenden Person runter.

Was soll das also stattdessen genau bedeuten?

Die Privatsphäre einer Person war zu keiner Zeit bedroht, auch ohne Opt-Out
nicht:

Einige Leute haben Sender am Laufen, die den Namen des Senders über alle
Grundstücksgrenzen in die Pampa brüllen. Andere Leute haben die Positionen
dieser Sender erfaßt so gut es geht. Noch wieder andere Leute haben sich
verlaufen und bekommen auf der Grundlage dieser Daten schneller gesagt wo
sie sind, als wenn sie GPS verwenden (ohne weiteres Einhelfen hat GPS eine
Startzeit von 80 Sekunden).

Mit Opt-Out fehlen Daten, die Genauigkeitskreise bei der Positionsbestimmung
werden ein wenig größer. Geholfen hat sich mit dem Opt-Out niemand.

Wieso fordern Datenschützer also diese Opt-Out Möglichkeit?

> [Datenschutztheater](http://blog.spackeria.org/2011/09/12/datenschutztheater/)
> bezeichnet eine Massnahme oder eine Sammlung von Massnahmen, die den
> gefühlten Schutz von Daten verbessern ohne dabei die Daten funktional vor
> Ge- oder Missbrauch zu schützen.

Diese Definition haben wir hier exemplarisch einmal erfüllt gesehen.
