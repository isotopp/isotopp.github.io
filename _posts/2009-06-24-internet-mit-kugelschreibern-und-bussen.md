---
layout: post
published: true
title: Internet mit Kugelschreibern (und Bussen)
author-id: isotopp
date: 2009-06-24 07:21:35 UTC
tags:
- identity
- internet
- routing
- zensur
- lang_de
feature-img: assets/img/background/rijksmuseum.jpg
---
![](/uploads/kris-symbol.png)

Das da ist Kris.

Mein Rechner hat keine Internet-Karte. Er hat Ethernet, Wifi, Bluetooth, und
wenn er ein wenig älter wär hätte er auch noch ISDN oder einen
Modem-Anschluß. Aber eine Internet-Karte steckt da nicht drin.

Wieso eigentlich nicht?

Holen wir einmal ein wenig aus, und bauen wir ein Beispiel aus der realen
Welt.

![](/uploads/kris-symbol-mit-zieladresse.png)

Kris muß nach Norwalk, CT. Das ist in Connecticut, USA, Nordamerikanischer
Kontinent, gleich neben New York.

Kris wohnt neben einer U-Bahn Station, der U6. Das hilft ihm aber nur
mittelbar, denn leider hat Norwalk, CT keine U6-Adresse. Wir können Kris
also nicht in die U6 setzen, ihm ein 456 Zonen-Ticket kaufen und dann 1217
Stationen später aussteigen. Obwohl ich den
[Grenander-Bahnhof](http://de.wikipedia.org/wiki/Alfred_Grenander) Atlantis
schon gerne gesehen hätte.

![](/uploads/kris-route.png)

![](/uploads/ubahn-mit-zieladresse.png)

Nehmen wir also Kris und setzen ihn in die U6.

Kris hat weiter eine genaue Vorstellung von seiner Zieladresse. Aber in der
U6 muß er erst mal mit U6-Adressen arbeiten. Nächster Halt also
Kurt-Schumacher-Platz. Dort wird Kris aus der U6 ausgepackt und in einen Bus
verladen.

![](/uploads/bus-mit-zieladresse.png)

Der Bus versteht eine Busadresse - Flughafen Tegel.

Wie die Haltestelle Kurt-Schumacher-Platz ist auch Tegel ein Router. Ein
Router hat mehr als eine Adresse. Der Flughafen zum Beispiel hat die
Busadresse 'Flughafen Tegel' und die Flugzeugadresse TXL. Er hat auch
Taxiadressen ('Halteplatz vor Gate 8') und Autoadressen ('P2 am Flughafen
Tegel'). Auf einem Router wie Tegel werden massenhaft Reisende aus einem
Verkehrsnetz ausgepackt und in ein anderes Verkehrsnetz eingepackt und dann
weiter versendet.

Das jeweilige Verkehrsmittel kapselt dabei die Reisenden. Die Verkehrsmittel
verwenden jeweils spezifische Adressen, die nur innerhalb ihres
Verkehrsmittels eine Bedeutung haben. Aber die im Verkehrsmittel reisenden
Personen wissen natürlich die ganze Zeit, wo sie wirklich hin wollen und
arbeiten mit anderen, global gültigen Adressen.

Dieses Konzept der Kapselung ist sehr einfach. Es ist aber auch sehr mächtig - 
es ist ein wesentliches Konstruktionsprinzip des Internets.

Ein Router ist wie ein Flughafen etwas, das verschiedene Adressen in
verschiedenen Netzen hat. Das Internet-Protokoll ist ein Protokoll um Netze,
nicht Rechner, miteinander zu verbinden. Mein Rechner sendet also
Ethernet-Pakete zum Router, in denen Internet-Pakete enthalten sind. In den
Ethernet-Paketen stehen Ethernet-Adressen, in diesem Fall die
Ethernet-Adresse meines Routers.

Innerhalb der Ethernet-Pakete sind jedoch IP-Pakete enthalten, die die
eigentliche Ziel enthalten, so wie die U-Bahn Reisende enthält. In den
Ethernet-Paketen stehen lokale Ethernet-Adressen so wie auf den Tickets
lokale U-Bahn-Adressen stehen. Aber in den Köpfen der Leute stehen
Fernziele, so wie in den Köpfen von IP-Paketen global gültige Zieladressen
stehen.

Mein Router entnimmt die IP-Pakete den Ethernet-Paketen und packt sie
stattdessen in PPP-, ATM- oder ISDN-Pakete ein und sendet sie anderswo hin,
genau so wie auf einem Flughafen Leute umsteigen: Auskapseln, mit Hilfe des
Fernzieles das passende Gate bestimmen und dann wieder einkapseln - diesmal
in einen anderen Transport: Außen in der Verpackung steht immer die Adresse
des nächsten Routers auf dem Weg, aber das IP-Paket selbst mit seiner global
gültigen IP-Nummer enthält immer eine unveränderte Adresse. Auch an der
nächsten Station wird das IP-Paket ausgepackt und wieder eingepackt und dann
weiter geschickt - bis es irgendwann einmal das Ziel erreicht.

Das sieht dann so aus: 

```console
KK:~ kris$ traceroute priceline.com
traceroute to priceline.com (64.6.17.5), 64 hops max, 40 byte packets
 1  my.koehntopp.de (192.168.1.1)  1.733 ms  1.241 ms  0.910 ms
 2  lo1.br05.ber.de.hansenet.net (213.191.89.5)  24.046 ms  23.392 ms  23.268 ms
 3  ae0-103.crju01.ber.de.hansenet.net (62.109.111.29)  22.326 ms  22.114 ms  22.618 ms
 4  so-1-0-0-0.cr01.fra.de.hansenet.net (213.191.66.21)  41.671 ms  41.877 ms  40.842 ms
 5  ae0-101.pr01.fra.de.hansenet.net (62.109.109.176)  41.044 ms ae1-102.pr01.fra.de.hansenet.net (62.109.109.240)  41.077 ms  41.367 ms
 6  fra32-hansenet-1.fra.seabone.net (195.22.211.113)  41.447 ms  40.945 ms  41.524 ms
 7  new3-new50-racc1.new.seabone.net (195.22.216.237)  121.744 ms  121.256 ms  121.993 ms
 8  att-1-us-new4.new.seabone.net (195.22.216.22)  122.883 ms  123.582 ms  122.182 ms
 9  cr2.n54ny.ip.att.net (12.122.130.22)  127.547 ms  127.379 ms  127.761 ms
10  gar5.n54ny.ip.att.net (12.122.130.113)  126.692 ms  126.964 ms  126.307 ms
11  mdf16-gsr12-1-pos-6-0.nyc2.attens.com (12.122.255.114)  123.526 ms  123.479 ms  122.330 ms
12  mdf19-bi8k-1-eth-1-2.nyc2.attens.net (63.240.0.106)  122.865 ms  122.209 ms  122.017 ms
13  * * *
```

Das Programm traceroute verfolgt die Reise eines IP-Paketes von mir daheim
bis nach Norwalk, CT, oder jedenfalls bis New York. Für jede Station wird
der Name und die IP-Nummer des Routers ausgegeben und es werden drei
Beispielreisezeiten gemessen.

Wie man sieht, reist das Paket ein wenig komplizierter als ich - es muß
mindestens 13 Mal umsteigen - und es reist über Frankfurt wo ich über
Amsterdam nach New York gereist bin. Dennoch ist es unwesentlich schneller
am Ziel als ich. Und vermutlich nicht gejetlagged. :)

Mein Rechner hat also keine Internet-Karte. Aber er kann jede seiner
Netzwerkschnittstellen als Internet-Transport verwenden. Das eigentliche
'Internet' in meinem Rechner ist dann ein Stück Software, das neben einigen
anderen Dingen Pakete einkapselt und auskapselt.

Das Prinzip der Kapselung ist aber nicht auf das Internet beschränkt. Es
kann im Grunde genommen mit jedem Transport verwendet werden, um über diesem
Transport ein Metanetz zu bauen, daß die Knoten dieses Transports enthält.

[Skype](http://en.wikipedia.org/wiki/Skype) macht das - es baut ein 
[Peer-to-Peer](http://en.wikipedia.org/wiki/Peer-to-peer)-Netz aus Rechnern
auf, die schon im Internet sind. Man nennt solche Netze Overlay-Netzwerke,
weil sie ein eigenes Netz auf dem Internet aufbauen. Die meisten Leute
kennen Skype als Telefonie- oder Chatanwendung, aber mit der
[Skype API](https://developer.skype.com/Docs/ApiDoc/src#Overview) hat man
tatsächlich eine Schnittstelle, mit der man beliebige Datenströme durch das
Skype-Netzwerk routen kann wie man sonst Datenströme durch das Internet
routen würde.

Auch das ist nur ein Beispiel - auch andere Systeme bauen so ihre Overlays. 
[Tor](http://en.wikipedia.org/wiki/Tor_(anonymity_network)) zum Beispiel ist
ein Overlay über dem Internet, das versucht Kommunikation durch
Verschlüsselung und Onion-Routing unsichtbar und anonym zu machen.

Aber um so ein Overlay zu bauen ist gar nicht viel notwendig. Tatsächlich
würde es ausreichen, einen Browser mit einer modernen, schnellen
Javascript-Engine zu haben. Dort könnte man dann so etwas wie Tor und
[Transmission](http://en.wikipedia.org/wiki/Transmission_(BitTorrent_client))
als Javascript-Anwendungen ohne Installation durch Besuch einer Website
direkt im Browser laufen lassen.

Das Resultat wäre ein Overlay-Netzwerk, in dem anonym und verschlüsselt
Knoten miteinander Dateien als Schwarm miteinander austauschen. Das man
dadurch installiert und skaliert, indem man eine Webseite besucht auf der
das Javascript enthalten ist.

Ok. Nur so eine Idee. Wer braucht so was schon.
