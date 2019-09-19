---
layout: post
published: true
title: Wie viel Strom verbraucht ein Stromzähler?
author-id: isotopp
date: 2009-06-05 08:48:58 UTC
tags:
- computer
- energie
- strom
- lang_de
feature-img: assets/img/background/rijksmuseum.jpg
---
Ab 2010 soll ja die Umrüstung von Stromzählern auf sogenannte Smart Meter
verpflichtend werden. Das sind kleine embedded Computer, die den
Stromverbrauch eines Haushaltes laufend an den Stromanbieter zurück melden.
Der "Vorteil" für den Verbraucher ist ein tageszeit-abhängiger Strompreis.
Von den Sicherheits- und Datenschutzaspekten mal abgesehen - was sind
eigentlich die Konsequenzen für den Stromverbrauch durch die Zähler selbst?

In Deutschland gibt es laut 
[Destatis](http://www.destatis.de/jetspeed/portal/cms/Sites/destatis/Internet/DE/Navigation/Statistiken/Bevoelkerung/Haushalte/Haushalte.psml)
39.7 Millionen Haushalte. Das kann man also mal als Mindestanzahl der
Stromzähler in Deutschland ansetzen, anderswo sind 44 Millionen Zähler
in Deutschland gemeldet.

Die Frage war nun: Wenn man also 44 Mio embedded Computer in Deutschland
installiert, wie viel Strom verbrauchen die? Die Antwort ist überraschend.

Ein Gerät wie das 
[EM-1021](http://www.echelon.com/metering/datasheets/EM-1021-Single-German.pdf)
(PDF, via Quelle 7 aus
[Intelligenter Zähler](http://de.wikipedia.org/wiki/Intelligenter_Z%C3%A4hler) von Echelon
verbraucht angeblich zwischen 2 und 5 Watt. Das ist überraschend wenig, und
kann nur dann stimmen, wenn man entweder nur Werte für den Wandler und nicht
für den Rechner angibt, oder wenn man einen sehr langsamen und
leistungsschwachen Rechner da eingebaut hat.

Tatsächlich behauptet 
[Smartmetering als neue Effizienzquelle](http://www.wupperinst.org/de/publikationen/entwd/uploads/tx_wibeitrag/bild-des-monats_06-07.pdf)
(PDF) sogar, daß ein solches Smart Meter substantiell weniger
Eigenstromverbrauch hat als ein alter
[Ferraris-Zähler](http://de.wikipedia.org/wiki/Ferraris-Z%C3%A4hler), dessen
Eigenverbrauch im Jahr mit 30 kWh/a angegeben wird (das sind dann etwa 3.5
Watt Aufnahme, wenn ich nicht zu naiv gerechnet habe). Das Papier gibt ein
Einsparpotential von 900 bis 2500 Gwh/a an.

Das glaube ich so erst mal nicht, aber wenn wir da plus/minus 0 rauskommen
wäre es ja zumindest hier mal kein Verlust.

Warum glaube ich das so erst mal nicht?

Einmal träumen die Stromversorger von Zusatzanwendungen, zum Beispiel Geräte
im Haushalt ferngesteuert ein- und ausschalten zu können. Wenn diese Dinge
vom Zähler aus implementiert werden sollen, kann man nicht unbedingt von
einer leistungsschwachen CPU am Zähler ausgehen.

Andererseits ist es so, daß der Zähler eine gewisse Mindestleistung auf der
CPU haben muß, wenn er denn die Sicherung der ganzen Kommunikation und
Steuerung durch passende Krypto implementieren können soll. Man hat also die
Wahl, Strom zu sparen und das System leicht hackbar zu machen oder halt
ordentlich kryptographisch abzusichern und dafür mehr Watts zu lutschen.

Und schließlich müssen diese Zähler, wenn sie denn tun sollen, was man sich
von ihnen verspricht, auch noch irgendwie ans Internet angeschlossen werden.
Dazu soll Powerline-Technologie verwendet werden, da die meisten Leute an
den Orten, an denen die Zähler hängen, keine DSL-Router stehen haben. Man
muß zum Verbrauch also noch das
[Powerline-Ethernet-Gegenstück](http://digitalewelt.freenet.de/computerzubehoer/wlannetzwerk/powerlineadapter-dlink-dhp302-im-test_513732_275464.html)
neben seinem eigenen DSL-Router dazu rechnen, wenn der Zähler seine Daten
Richtung heimischer DSL-Router ausleitet. Oder der Zähler leitet seine Daten
Richtung Stromnetz aus, wo man in den Umspannstationen und höher Empfänger,
Router und anderes Strom verbrauchendes Equipment haben muß, das auch zu
bilanzieren wäre.

Der Punkt ist der Folgende: Setzt man für das ganze Spielzeug mal 15 Watt
Mehrverbrauch an, kommt man knapp auf eine Vervierfachung des Verbrauches
gegenüber einem Ferraris-Zähler, also etwa 120kWh/a.

Nachtrag: Die Sache mit Powerline hat auch noch andere aufregende
Nebenwirkungen. Powerline strahlt nämlich wie Sau EM-Störungen von nicht
abgeschirmten Stromleitungen in die Nachbarschaft. Das ist nicht nur ein
Sicherheitsproblem, sondern auch ein echtes Problem mit der Verdreckung des
EM-Spektrums. Man will keine 44 Millionen Störsender in Deutschland
ausrollen.

Je mehr ich mich mit dem ganzen Smart Meter Unsinn befasse, desto mehr kommt
mir das vor wie Gesundheitskarte 2.0.
