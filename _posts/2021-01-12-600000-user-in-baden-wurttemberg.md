---
layout: post
title:  '940.000 User in Baden-Württemberg'
author-id: isotopp
feature-img: assets/img/background/rijksmuseum.jpg
date: 2021-01-12 17:07:50 +0100
tags:
- lang_de
- data center
- bildung
---

Deutschland ist im Lockdown, die Schulen sind endlich geschlossen und es wird remote unterrichtet. Weil es Deutschland ist, passiert das in jedem Bundesland anders und uneinheitlich. In Baden-Württemberg verwendet man [Moodle](https://moodle.org/). Wer sich da drunter nichts vorstellen kann, kann es sich [hier](https://school.moodledemo.net/mod/page/view.php?id=44) ansehen.

In Bawü wird eine getrennte Moodle-Instanz pro Schule installiert, aber halt viele Instanzen pro Server, weil Server recht groß sind. In Summe muß man bummelig [940.000 Schüler](http://www.statistik.baden-wuerttemberg.de/Service/Veroeff/Statistik_AKTUELL/803420002.pdf) abfrühstücken. Die Strukturen in Moodle sind kleinräumig (Klassen, Jahrgänge, Schulen) und nicht stark quer verbunden, sodaß sich das im Grunde relativ leicht skalieren lassen sollte. Dennoch kam es im Frühjahr zum Engpässen, weil das Moodle-Projekt auf andere Projektziele und -größen geplant war ("Pilotschulen") als es gebraucht wurde ("Lockdown").

[![](/uploads/2021/01/moodle-1.jpg)](https://twitter.com/neunerseb/status/1242093498859388928)

*"Samstags Nachts um 1: Moodle Server Einbau Selfie!" -- [Sebastian Neuner](https://twitter.com/neunerseb/status/1242093498859388928), 23-Mar-2020*

Das Selfie oben zeigt Sebastian Neuner beim Aufrüsten der Hardware im Rechenzentrum. Er [berichtet](https://twitter.com/neunerseb/status/1242100350762409985) von Maschinen mit 72-96 Cores, 512-1024GB RAM, und 10 GBit/s Uplinks (sowie 20 Gbit/s SAN-Links zum Storage). CPUs sind [AMD 7451](https://www.amd.com/en/products/cpu/amd-epyc-7451) und [Intel Gold-6150](https://ark.intel.com/content/www/us/en/ark/products/120490/intel-xeon-gold-6150-processor-24-75m-cache-2-70-ghz.html). Davon sind dann jeweils zwei in einer Maschine, und dadurch ergeben sich dann die 72 bzw 96 Cores.

Im Sommer hat man dann noch einmal nachgerüstet und am 7-Jan-2021 kam dann die [letzte Nachlieferung](https://twitter.com/belwue/status/1347255528783814661):

[![](/uploads/2021/01/moodle-2.jpg)](https://twitter.com/neunerseb/status/1242093498859388928)

*"Heute morgen wurden 2 Paletten mit 7 weiteren Servern für Moodle geliefert." -- [BelWü](https://twitter.com/neunerseb/status/1242093498859388928), 07-Jan-2021*

Dennis Urban merkt an: "In den sieben Maschinen sind AMD EPYC 7h12 CPUs drin. [Langsam wird der Monitor zu klein](https://twitter.com/dpunkturban/status/1348382147564941313)."

In den Kommentaren dann ein Haufen Bemerkungen und Fragen:

- Wieso sind das Dells und keine von Thomas Krenn?
- Wieso physikalische Server und das nicht in einer Cloud klicken?
- Wieso stehen die nicht an der Schule, sondern in irgendeinem Rechenzentrum?

Nun habe ich mit dem BelWü und Moodle nichts am Hut, aber zu diesen Dingen kann ich aus anderen Gründen sinnvoll etwas beisteuern, also habe ich die Fragen einmal beantwortet (Twittertypisch [mitten in den Thread gelinkt](https://twitter.com/isotopp/status/1348610831366414339), weil es anders nicht sinnvoll funktioniert).

## Wieso sind das Dells?

Wer viele Server hat, der will die automatisch installieren. Das ist viel einfacher, wenn man einen einigermaßen einheitlichen Serverpark hat.

Server haben einen Baseboard Management Controller (BMC). Das ist ein kleiner Rechner, der immer angeschaltet ist und der den großen Rechner inventarisieren, konfigurieren und ein- und ausschalten kann.

Theoretisch sind die BMCs inzwischen einigermaßen standardisiert: Die Desktop Management Task Force DMTF hat dafür den Standard [Redfish](https://www.dmtf.org/standards/redfish) definiert. In der Praxis sind die verschiedenen BMCs alle unterschiedlich defekt und man muß wissen, welchen Hersteller in welcher Version man am Rohr hat, damit man um dessen Bugs gezielt drum herum arbeiten kann. Mein Arbeitgeber hat dazu [BMC Butler](https://github.com/bmc-toolbox/bmcbutler) entwickelt und auf Github öffentlich gemacht, ebenso das Inventarisierungstool [Dora](https://github.com/bmc-toolbox/dora) und eine Reihe von weiteren Tools.

Kauft man sich jetzt Rechner von einem weiteren Hersteller dazu, dann muß man die eigene Automatisierung erst einmal validieren und anpassen. Das ist schnell mal ein halbes Jahr Arbeit.

Das ist auch okay, denn größere Aktionen in einem Rechenzentrum haben ebenfalls schnell mal ein halbes Jahr Vorlauf. Wie dem auch sei: 7 Rechner bekommt man eventuell relativ schnell, aber einen ganzen Raum in einem Rechenzentrum voll zu laden war eine Aktion mit Schiffscontainern aus Taiwan.

Meist hat man Rahmenverträge mit Händlern ("OEMs", Original Equipment Manufacturer, zum Beispiel Dell oder HP) oder - bei größeren Mengen - Herstellern ("ODMs", Original Device Manufacturer, zum Beispiel QCT oder Wywinn), und meistens genau zwei: Man will halt mehr als einen und so wenige wie möglich, weil alles kompliziert ist.

## Wieso nicht in der Cloud?

Weil Cloud unglaublich teuer ist. In meinen Kostenrechnungen liegen die Kosten für Cloud-Deployments pro Monat in etwa gleichauf mit (oder höher als!) Kostenrechnungen für Bare Metal in eigenen Rechenzentren pro Jahr (Strom, Netz, anteilige Netzwerk-Hardware, Rechenzentrumsplatz und alles andere inbegriffen).

Das kann man alles noch optimieren, aber auf beiden Seiten der Gleichung und am Ende kommt in etwa dasselbe heraus: Cloud ist in etwa eine Größenordnung teurer als das alles selbst zu machen.

Anders herum bedeutet das, daß man das eigene Bare Metal hemmungslos überdimensionieren kann und immer noch unter AWS-Preisen herauskommt. Ist ja auch logisch: Wenn man einem Milliardär seine Weltraumfirma nicht mit finanzieren muß, ...

Was man dabei nicht mit rechnet: Die höhere Latenz (s.o: 6 Monate Vorlauf - man muß überdimensionieren) und die Personalkosten für die eigene Entwicklung (Servermanagement, API für Provisionierung und so weiter).

Das lohnt sich erst ab einer gewissen Mindestgröße. Für kleine Läden lohnt sich die Cloud trotz der hohen Instanzkosten, weil die Software schon fertig entwickelt ist. Kleine Läden haben auch keine Kapazitätsprobleme beim Provisionieren in der Cloud.

Wenn man natürlich wegen eines RZ-Ausfalls "ein Megawatt Kapazität" mal eben in der Cloud klicken will, dann geht das nicht "wegen Quota". Die Quota gibt es nicht nur, um teure Fehler zu vermeiden, sondern weil auch "die Cloud" nicht "mal eben ein MW Kapazität" zur Hand hat, sondern Rechenzentrumsplatz bauen, Rechner kaufen und installieren muß im RZ der Wahl, damit das geht.

Dabei unterscheiden sich Clouds deutlich: Azure setzt auf Kapazität "vor Ort": man hat also sehr, sehr viele Standorte und die sind dann mitunter sehr klein. Da mal eben 10.000 "Amazon m5.4xl" zu holen (etwa 1 MW) geht dann halt nicht und schon gar nicht in einer AZ. Amazon und Google sind anders strukturiert, und wenn man Glück hat kriegt man 10k Instanzen dieser Größe, aber sicher nicht auf Zuruf und in der AZ der Wahl ("Wir haben Eure 150 PB Hadoop jetzt in Finnland, aber das Processing für die 2500 Nodes muß nach London" "Und wer zahlt dann den Traffic?").

Und halt nicht für sinnvolles Geld.

## Wieso nicht in der Cloud?

Cloud macht total Sinn für einmalige Tasks. Die Bild-Assets von 1.2 Millionen Hotels in drei neuen Größen für einen neuen Mobildienst bereit zu stellen und dafür einen Bildskalierer durch Parallelisierung um einige Monate zu beschleunigen ist eine ideale Cloudanwendung: dynamisch Wegwerfkapazität kaufen ("Spot Instances"), den Task durchlaufen lassen und dann die Instanzen aufgeben.

Cloud macht total Sinn für experimentelle Tasks. Machine Learning auf GPU oder Google Tensor Processors auszuprobieren ist sehr viel sinnvoller, als experimentelle Hardware mit 36 Monaten Abschreibung zu kaufen, die dann alle 6-9 Monate (inzwischen: 18 Monate) ersetzt werden muß, weil sich das Thema weiter entwickelt hat und die Hardware veraltet ist (und dann festzustellen, daß man eh nur 7kW pro Rack kann, aber ein dicker Klotz mit GPUs drin schon mal gerne 14 oder 21kW pro Rack an Abwärme da läßt).

Cloud lohnt nicht, wenn man 600.000 Schüler für 10 Jahre an 220 Tagen im Jahr mit einer IT Infrastruktur versorgen muß. Das ist quasi das Anti-Cloud Szenario: Garantierte Basislast für Dekaden in vorhersehbarer Menge, bewährte konventionelle Technik und relativ stabiles Anwendungsumfeld. Selbst wenn man die Maschinen in 3 Jahren abschriebe kann man leicht 5 Jahre Betrieb aus den Dingern bekommen, bevor man sie ersetzt.

Ersetzen wird man sie, denn nach 5 Jahren wird der Betrieb vermutlich unrentabel. Neue Hardware wäre so viel leistungsfähiger, daß man dieselbe Leistung mit weniger Hardware, weniger Strom und weniger RZ-Platz erbringt und so viel Geld spart. Eine Maschine verbraucht in 5 Jahren circa ihren Anschaffungspreis in Strom.

Was auch teuer ist in einer Cloud-Anwendung ist Netzwerk, und dort speziell ausgehender Verkehr. AWS ist berühmt dafür, eingehenden und ausgehenden Datenverkehr sehr unterschiedlich zu bepreisen, und in den Medien findet man viele Berichte in der Art [NASA to launch 247 petabytes of data into AWS – but forgot about eye-watering cloudy egress costs before lift-off](https://www.theregister.com/2020/03/19/nasa_cloud_data_migration_mess/).

Videochat Anwendungen wie Zoom sind in AWS nicht ökonomisch zu betreiben. Corey Quinn [berichtet von Zoom](https://www.lastweekinaws.com/blog/why-zoom-chose-oracle-cloud-over-aws-and-maybe-you-should-too/), und wieso man dort statt AWS die Oracle-Cloud gewählt hat. Oracle als Firma ist spät in das ganze Cloud-Geschäft eingestiegen und muß sich um Kunden bemühen, daher zielt man bewußt auf Kunden mit viel ausgehenden Verkehr und macht die Preise dort anders. 

## Wieso stehen die nicht an der Schule, sondern im RZ?

Eine Schule ist der denkbar schlechteste Ort, um Rechner zu betreiben. Fünf dicke Maschinen für eine Schule mit 1000 Schülern brauchen ein Rack, Strom und Netz und produzieren Abwärme, die vermutlich aktiv weg gekühlt werden muß. Kein Ort an einer 
Schule ist dafür geeignet, das zu betreiben. Kleine Strom- und Kühlsysteme sind ineffizient.

Obendrein: so teure Hardware mit personenbezogenen Daten auf den Speichern an einer Schule zu lagern ist auch rein von der physischen Sicherheit nicht machbar. In meiner Schulzeit, es ist schon einige Dekaden her, hat man den Medienraum der Schule, an der ich war, mehr als einmal leer gemacht. Das waren keine besonders begabten Leute, sondern Junkies auf der Suche nach Wertgegenständen zum schnellen Verticken.

In einem Rechenzentrum hat man nicht nur eine für Rechner geeignete Umgebung mit Strom, Netz und Kühlung, sondern kann auch Personal auslasten, das sich mit Dingen wirklich auskennt und mehr kann als Dinge ein- und auszuschalten. Netz ist genug da: im Rechenzentrum sowieso und die Kapazität einer einzelnen Glasfaser (normal legt man Bündel) ist für den interessierten Laien im Grunde unbegrenzt.

Wen es interessiert: [OptiX OSN 6800](https://www.alibaba.com/product-detail/Huawei-dwdm-equipment-OSN-6800_60174956247.html), ein Stück Huawei DWDM Hardware zum Ausleuchten einer Langstrecken-Glasfaser mit bis zu 80 Kanälen (40 Frequenzen x 2 Polarisierungen) und 100 GBit/s pro Kanal - 8 TBit, pro Faser. Es ist eine Frage von Bedarf und Geld, aber nicht wirklich ein technisches Problem. Innerhalb des Rechenzentrums nimmt man billigeres Glas, billigere Laser mit niedrigerer Leistung und hat dafür wesentlich mehr Fasern. Glas liegt durchgehend, mindestens bis zur "DSL Anschlußbox" auf dem Gehsteig, und ab da ist in Deutschland dann alles schwierig.

![](/uploads/2021/01/speedtest.png)

*Mein Jitsi ruckelt nicht, Tweak.nl sei Dank!*

Jedenfalls ist es, Cloud oder nicht, [sinnvoller Netz in die Schule zu legen]({% link _posts/2020-06-23-schulen-digitalisieren.md %}) und für Strom und Netz in allen Klassenräumen zu sorgen (das muß man in jedem Fall tun!), als Server in die Schule zu stellen. Eine Schule ist ungefähr der dümmste mögliche Platz für Server, die Raspi 4s mit den Minecraft-Servern des Informatik-Kurses ausgenommen.

## Wie sieht so etwas aus?

Nun habe ich mit dem Netz und dem Moodle in Bawü nichts zu tun, aber ich habe in meiner Arbeit gelegentlich mit Computern oder Rechenzentrums-Ausstattungen zu tun, und dabei auch einige Fotos machen können.

![](/uploads/2021/01/delivery-1Q19-1.jpg)

*2. Januar 2019: Anlieferung neuer Hardware für einen neuen Rechenzentrumsraum, ein LKW alle 2 Stunden.*

![](/uploads/2021/01/delivery-1Q19-2.jpg)

*Wir haben ein Staging Area zum Auspacken und Organisieren der Hardware. Noch ist es leer.*

![](/uploads/2021/01/delivery-1Q19-3.jpg)

*Dann: Auspacken, Verpackungsmaterial shreddern, und die Geräte in den eigentlichen Rechnerraum fahren, wo sie geracked werden.*

![](/uploads/2021/01/delivery-1Q19-4.jpg)

*Jedes Gerät kommt mit Verpackung, Palette, Handbüchern und Stromkabeln für unterschiedliche Nationen. So viel Holz in der IT!*

![](/uploads/2021/01/delivery-1Q19-5.jpg)

*Vorne die Hardware, hinten der Müll.*

![](/uploads/2021/01/delivery-1Q19-6.jpg)

*Rackrückseite. bis zu 16 Blades pro Chassis, 4 Chasis pro Rack. Bitte beim Verkabeln keine Fehler machen!*

![](/uploads/2021/01/delivery-1Q19-7.jpg)

*Leere Racks im eigentlichen RZ-Raum, warten auf die Hardware.*

![](/uploads/2021/01/delivery-1Q19-8.jpg)

*"Laser" (SPF-Module), für das Netzwerk.*

![](/uploads/2021/01/delivery-1Q19-9.jpg)

*Es ist noch viel zu tun.*

![](/uploads/2021/01/delivery-1Q19-10.jpg)

*Gerätefront nach Einbau: Ein Dell Bladecenter Chasis mit 14/16 Blades bestückt. Jede Blade hat 2 CPUs, einige hundert GB Speicher, 2 SSDs und 10 GBit/s Netzwerk.*

![](/uploads/2021/01/delivery-1Q19-11.png)

*Nach 3 Tagen sind die ersten Geräte grün (Provisionierbar - nach Burn In, Firmware Update und Base OS Install). Es wird noch 2 weitere Tage dauern, bis der Rest nachkommt.*

All dies ist in erster Linie eine Logistik-Aufgabe: Man muß den kommenden Bedarf abschätzen, planen und dabei auch das Upgrade veralteter Hardware mit Planen, dann Rechenzentrumsplatz und Strom bereitstellen, und unterdessen Modelle wählen, verhandeln, bestellen und dann parallel die Site vorbereiten. Wenn die Lieferung kommt, ist auspacken, validieren und racken angesagt. Alles in allen muß man 12 Monate oder mehr in die Zukunft sehen.

(Ich habe von 2016 bis Mitte 2019 RZ-Kapazität geplant. Die Bilder sind vom Januar 2019).

## Cloud hätte auch nicht geholfen

*Update:* [Belwue Trouble Ticket](https://www.belwue.de/trouble-tickets/ticket/208_2021-01-11_09-01-48.xml)

> Nach verschiedenen Optimierungen am Montag bestehen keine nennenswerten Probleme mehr.
> Die Spitzenlast um 8 Uhr konnte so am Dienstag gut abgefangen werden.

Nach dem, was mir berichtet wurde, ist ein guter Datenbank-Admin wohl mehr wert als Cloud und Bare Metal Rechenzentrum zusammen. Durch eine gemeinsame Anstrengung wurden einige Moodle-Queries an die Datenbank entscheidend verbessert und Indices nachgerüstet. Außerdem wurde das Schreibverhalten der Datenbank auf SSD entscheidend besser konfiguriert, sodaß es durch die großen Mengen Speicher nicht mehr zu Schreibstürmen kommt.

Der Effekt ist an der Heatmap zu sehen:

![](/uploads/2021/01/moodle-response.png)

*Response Time Heatmap vom Bawü Moodle für den 12. Januar 2021. Die X-Achse zeigt die Uhrzeit. Die Y-Ache zeigt logarithmisch die Antwortzeit. Die meisten Antworten kommen in weniger als einer Zehntelsekunde, jetzt wo die Datenbank optimiert ist. (via [Dennnis Urban](https://twitter.com/dpunkturban)*

Besonders viel Ärger hat wohl eine bestimmte Kalender-Query gemacht. Da Moodle Open Source Software ist, kann man [das Ticket sehen](https://tracker.moodle.org/browse/MDL-66253).

"Jetzt sind 3300 Cores in der Plattform und eine Summen-Load von unter 1000, heute. Gestern noch um die 3000." sagte man mir. Ein System mit 3000 Cores ist mit einer Load von 3000 genau am Anschlag (Runnable Threads == vorhandene Cores). Eine Load von 1000 auf 3000 Cores ist angenehm und sollte stabil durchhalten.

Mit mehr Leistung - in Cloud oder auf Bare Metal - hätte das System nur schneller und teurer gewartet. Der Fehler war nur unter Last zu finden und durch Datenbanktuning zu beheben, nicht durch mehr Spielzeug.

Und weil Leute gefragt hatten: Moodle läuft mit 300 Usern pro Core recht rund, und bekommt wohl in diesem Szenario ab dem 2.5-fachen davon Probleme.

## Edit: Userzahlen

[Dennis Urban](https://twitter.com/dpunkturban) korrigiert in einer DM:

> Eine Frage bzw. Anmerkung: in Bawü gibts derzeit 1,4 Mio SchülerInnen und so 140k LehrerInnen: Wir haben so 940k registrierte Benutzer.

Aus irgendwelchen Gründen listet der ursprünglich verlinkte Statista-Artikel die Berufsschüler nicht auf. [Statistik Bawü](http://www.statistik.baden-wuerttemberg.de/Service/Veroeff/Statistik_AKTUELL/803420002.pdf) hat die ganzen Zahlen.

## Edit: Merkwürdigkeiten

Im Nachgang zu diesem Artikel kam es zu diversen Diskussionen auf Twitter. Ein Haufen Leute hat sich beim Moodle-Team von BaWü über die Performance von BBB beschwert. Dieser Dienst wird zwar in Moodle integriert, ist aber von einem anderen Team an einer anderen Institution in einer anderen Stadt betrieben.

Eventuell ist es sinnvoll, die IT-Organisation an Schulen nicht auf Kreis- oder Landesebene zu zerfasern, sondern Aufwände zu bündeln. Das macht den Betrieb nicht nur zuverlässiger, sondern auch billiger.

Doch es ist noch "komplizierter":

Ein Benutzer hat sich über die Performance von BBB beschwert und zeigte einen Screenshot.

![](/uploads/2021/01/moodle-nope-bbb.jpg)

*Screenshot mit nicht funktionierendem BBB: Auf demo2.bigbluebutton.org allerdings.*

> Der nächste Versuch der Klassen-VC scheitert - nach der Anmeldemaske passiert bei BBB nichts mehr. Viel Kinder-Enttäuschung, dass das versprochene "Arbeiten wie die Großen" nie klappt. Stattdessen jetzt: Arbeitsblatt bearbeiten. Vorhandene Motivation: -1000

demo2.bigbluebutton.org ist ein Testserver vom BBB Projekt, der in Kanada steht und als Demo-Objekt betrieben wird. Er ist nicht für den Produktiveinsatz gedacht, nicht von GDPR-Richtlinien abgedeckt und selbst wenn er funktionierte wäre er für eine angenehme Videokonferenz zu weit weg.

Moodle und Big Blue Button sind Softwarepakete, die sich Organisationen wie die Schulorganisation eines Landes selbst installieren können. Als Lehrerin oder Lehrer ist man gut damit beraten auch die korrekte URL zum Verbinden zu nehmen, statt sich im Internet irgendeine Instanz zu suchen.
