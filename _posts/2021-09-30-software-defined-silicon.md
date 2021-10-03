---
layout: post
title:  'Software Defined Silicon'
author-id: isotopp
feature-img: assets/img/background/rijksmuseum.jpg
date: 2021-09-30 20:01:06 +0200
tags:
- lang_de
- computer
---

Golem titelt [Intel will Xeon-Funktionen als Lizenz-Update verkaufen](https://www.golem.de/news/software-defined-silicon-intel-will-xeon-funktionen-als-lizenz-update-verkaufen-2109-159912.html):

> Intel will Xeon-Funktionen als Lizenz-Update verkaufen.
> 
> Mit dem Software Defined Silicon will Intel in Xeon-Hardware zunächst abgeschaltete Funktionen künftig als Lizenz-Upgrade bereitstellen. 

[Manuel Atug ranted](https://twitter.com/HonkHase/status/1442760700112343044) darüber auf Twitter:

![](/uploads/2021/09/intel-software-silicon.jpg)

*Wenn dir die eigene Hardware nicht mehr gehört...
Intel will Xeon-Funktionen als Lizenz-Update verkaufen
"Mit dem Software Defined Silicon will Intel in Xeon-Hardware zunächst abgeschaltete Funktionen künftig als Lizenz-Upgrade bereitstellen."*

Ich [antwortete](https://twitter.com/isotopp/status/1442896442926895104):

Das braucht wesentlich mehr Kontext.

# Xeons sind selten und haben nicht viele Kunden

Intel stellt zurzeit eine sehr kleine einstellige Anzahl Millionen Xeon CPUs her.
Davon gehen 85 % an weniger als 10 Kunden - Hyperscaler in den USA und China.
12 % oder so gehen an ca. 150 Kunden, die messbare Stückzahlen der Produktion aufkaufen.
Der Rest sind Kleinkunden.

Das ist eine sehr ungesunde Marktstruktur, und Intel weiß um die Probleme, die das mit sich bringt.
Dies ist keine neue Situation, sondern war schon ein Problem, bevor Apple mit ARM losgelegt hat und AMD mit dem EPYC auf den Markt kam.
Diese beiden Ereignisse haben die Situation aber noch verkompliziert.

Dazu kommt noch, dass die obigen Prozentangaben nach Stückzahlen sind, nicht nach Core-Count.
Denn ansonsten sähe die Situation noch extremer aus:
Hyperscaler haben Interesse an immer größeren CPUs mit immer mehr Kernen, und immer höherer Dichte in ihren Rechenzentren.
Hyperscaler haben CPU Utilization und Return-per-Core als KPI und wollen Custom Silicon zum Auslagern der Virtualisierung, für das Netz, oder spezielle Tensorflow CPUs.

Normale Kunden sehen das nicht so:
man kann in einer 64C/128T-Core-Single-Socket-Konfiguration mit 2-4 TB RAM unter Umständen den gesamten Serverbedarf einer kleineren Firma in einer einzelnen physikalischen Maschine in VMs unterbringen.
Das Problem dabei: Explosionsradius, wenn mal etwas ausfällt.

# Cloud und On-Premise driften auseinander

Effektiv bewirkt dies, dass die Bauweise der Rechner, die in der Public Cloud Dienst tun, und die Bauweise der Rechner in den Rechenzentren normaler Leute stehen auseinander driften.
Das fängt heute an, aber der Bruch wird sich in den kommenden 5-10 Jahren noch vertiefen.

Ein Xeon-Markt für Hyperscaler ist groß, aber der Xeon-Markt "Server CPU für Cloud-Feinde" wird eher klein sein und schrumpfen.
Und wird sich dann irgendwann nicht mehr lohnen.

Davon mal abgesehen wird durch die laufend verbesserte Integration Chipfläche frei, und Intel muss sehen, was damit anzufangen ist, wenn es nicht "immer mehr Cores" sein können.
Software Defined Silicon ist ein Testballon, mit dem man das herausfinden kann.
Für die Firma wäre es schon wichtig, das herauszufinden:
von oben drücken die Hyperscaler mit ihren Forderungen nach Mengenrabatten, von der Seite drängt AMD mit ihrer derzeit überlegenen EPYC-Architektur in den Markt und von unten drückt ARM.

Vielen Kunden können diese Pay-to-Play Features egal sein:
Eine Webshop-Workload sieht in einem Intel vTune aus wie ein REP MOVSB Benchmark, memcpy() at scale, Variablen werden in HTML Templates eingesetzt.

Sogar die FPU und die ganzen AVX-Instruktionen - das ist alles Verschwendung von Chipfläche für die meisten Kunden.
Nur wenige Anwendungen brauchen und nutzen diese Funktionalität in der CPU wirklich.

Man stelle sich vor, man muss zum Beispiel für einen Inference Offloader ("bestehende Machine Learning Netze ausführen, nicht lernen") bezahlen, und dann wird der auf den meisten Maschinen nie angewendet.
Aber eine Serie CPUs herstellen, die diesen Inference Offloader hat, ihnen eine eigene Seriennummer zu geben und sie einzeln zu verkaufen will auch keiner.
Die Stückzahlen und die Preise geben das nicht her.

# Der Marktdruck zeigt zur Cloud

Wenn aber absehbar ist, dass in 5-10 Jahren die Trennung von Cloud-Hardware und On-Premise Hardware vollzogen sein wird, dann ist es auch klar, dass es nach Ablauf dieser Zeit nicht mehr möglich sein wird, ein Rechenzentrum mit Private Cloud kompetitiv zu betreiben.
Das wird so kommen, weil die Cloud-Technik schlicht proprietär und für normalsterbliche Kunden nicht zu haben sein wird.

Bei der Technik und der Wirtschaftlichkeit zeigen alle Push- und Pull-Faktoren derzeit massiv in Richtung Cloud.
Wer sein Unternehmen und seine IT darin nicht mit Gewalt und jetzt in die Public Cloud bringt, der wird nach dem Vollzug dieser Trennung in die Röhre schauen.

Eigene Server vor Ort sind - bei vorhersagbarem Bedarf - auf viele Weisen billiger als in der Cloud zu mieten. 
Aber man muss dann auch die eigenen Operations professionalisieren und man muss sich überlegen, wo in 5-10 Jahren die Technik herkommen soll.

Und wenn wir uns noch einmal die eingangs diskutierte Kundenstruktur von Intel ansehen, dann gibt es weniger als 200 Unternehmen weltweit, die dazu die erforderliche Masse haben.
Das ist sehr frustrierend.
