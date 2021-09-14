---
layout: post
published: true
title: Load, Load Testing und Benchmarks
author-id: isotopp
date: 2012-08-28 10:01:00 UTC
tags:
- datenbanken
- mysql
- performance
- testing
- lang_de
feature-img: assets/img/background/mysql.jpg
---
(Diesen Artikel gibt es auch in [englischer Sprache]({% link _posts/2017-02-16-load-load-testing-and-benchmarking.md %}).)

So. Du willst also wissen, was genau die Leistungsgrenzen Deines Systems
sind.  Und dazu möchtest Du einen Lasttest fahren, um Ergebnisse zu
ermitteln.

Die Grundidee Deines Plans sieht so aus:

![](/uploads/benchmark_plana.png)

Du nimmt Deine Kiste und findest eine Methode, um Last zu generieren.  Dann
wirst Du schon merken, wie weit das geht und wann die Kiste ausgelastet ist.

Der erste Fehler: Den Lastgenerator auf der zu testenden Kiste laufen
lassen.  Das geht nicht.  Unser Ziel ist es ja, die Kiste bis an ihre
Lastgrenze zu bringen.  Genau genommen wollen wir sie sogar darüber hinaus
drücken, und das geht nur genau dann, wenn wir mehr Last erzeugen können,
als die zu testende Kiste abarbeiten kann.

Teilen sich der Lastgenerator und die zu testende Anwendung irgendwelche
kritischen Ressourcen, gelingt das nicht: Die Ressource, etwa CPU, wird
knapp und verlangsamt nicht nur die zu testende Anwendung, sondern auch den
Lastgenerator, bis sich das System an einem unbekannten Punkt unterhalb der
Überlast einschwingt.  Auf diese Weise werden wir niemals lernen, welche
Farbe der Rauch hat, wenn es zu Explosion kommt, d.h.  wie genau das
Systemverhalten an der Lastgrenze aussieht.

Wir trennen also die Lastquelle und das zu testende System.

Der zweite Fehler: Das getestete System oder die Last sind nicht nahe genug
an der realen Last.  Typische Fehler sind: Eine zu testende Datenbank hat
weniger RAM als das Produktivsystem, es wird mit einem kleineren
Datenbestand getestet als das Produktivsystem hat, oder die Formulierung der
Queries oder die relative Verteilung der Anfragen auf den Daten ist nicht
identisch mit den Verhältnissen im Produktivsystem.

In allen diesen Fällen wird man von einem Lasttest etwas lernen, aber es
wird nicht unbedingt sinnvoll auf das Produktivsystem übertragbar sein.

Ein klassisches Beispiel ist etwa der 
![Datenbank-Contest](http://www.heise.de/ct/artikel/Gute-Nachbarschaft-290110.html)
der c't von Mitte/Ende 2005 gewesen (Die Auflösung ist 
[leider kostenpflichtig](//www.heise.de/artikel-archiv/ct/2006/13/190).
In diesem Benchmark wird die Datenbankstruktur eines CD-Verleih/Verkaufs
simuliert, jedoch werden in der Lastgenerierung des Benchmarks alle Titel
gleichverteilt nachgefragt.  Es gibt also keine Bestseller und keine
Lastkurve mit der Form eines 'long tail', wie sie in einem echten
Ladengeschäft aufträte.  Daher ist es für den Gewinn des Benchmarks wichtig,
alle Caches zu deaktivieren, während das Vorhandensein dieser Caches für den
Betrieb mit echter Last essentiell gewesen wäre.

Je näher man mit seiner Lastgenerierung, dem Testsystem und dem Testbestand
an das Echtsystem herankommt, um so besser ist sichergestellt, daß man
Ergebnisse erzielt, die in der realen Welt auch Bestand haben.

Am Besten wäre also, man testete auf dem Produktivsystem und mit echten
Usern.  Damit man das aber sicher tun kann, muß man erst einmal wissen, was
genau man hier tut.

![Load over Time](/uploads/benchmark1.png)

Wenn wir in ein System Last einwerfen, dann geht die Last im Mittel nach
oben, aber sie ist nicht konstant, sondern schwankt je nachdem, welche
Aktivitäten im System wir gerade aufrufen oder wie der Mix an gerade im
System beantworteten Anfragen biased ist: Nicht alle Operationen in unserem
System sind gleich teuer.

Wir fahren das System also nicht _an_ die Lastgrenze, sondern wir schieben
eine fluktuiierende und oszillierende Systemlast immer weiter nach oben, bis
ihre Spitzen weiter und weiter über die '100%'-Marke hinausreichen.  Das
sieht so aus:

![Load and Overload](/uploads/benchmark3.png)

Wann immer das System über die 100%-Marke gepusht wird, baut es ein Backlog
auf: Es bekommt mehr Last hereingedrückt als es abarbeiten kann und Anfragen
beginnen, sich auf der Eingangsseite zu stapeln.  Indem wir eine variable
Load immer weiter erhöhen, befindet sich das System in immer längeren Phasen
des Backlog-Aufbaus und in immer kürzeren Phasen, in denen es Backlog
abarbeiten kann.  Da die Last aber je nach Art der Generierung zufällig
schwankt, ist es sehr schwierig, die Überlastung des Systems kontrolliert
durchzuführen, wenn die Kosten für einen einzelnen Request sehr variabel
sind.

Das ist einer der Gründe, warum man sich bei der Optimierung von Systemen
nicht so sehr um die Verbesserung der guten oder auch nur der
durchschnittlichen Fälle kümmert.  Stattdessen wird man sich zunächst einmal
um die Outlier und schlimmsten Fällen kümmern müssen.  Das ist auch, warum
gute Systemarchitekten sich im Grunde nur für die Worst-Case-Performance
eines Systems oder eines Changes interessieren (siehe 
[The Importance of FAIL]({% link _posts/2008-05-30-the-importance-of-fail.md %}), 
oder jede 2.  Diskussion auf der Linux Kernel Mailingliste).

Es geht zunächst einmal also darum, die Variabilität in der Antwort des
Systems zu verkleinern, bevor man daran gehen kann, sein Verhalten als
Ganzes zu verbessern.

Was genau geschieht wird noch besser deutlich, wenn wir die Graphen von dort
oben nicht als Last-über-Zeit zeichnen, sondern einmal als 'Last, die wir
ins System drücken' (offered load) gegen 'Durchsatz' (reponses), und
zugleich auch als 'Last, die wir ins System drücken' (offered load) gegen
'Antwortzeit' (latency).

![](/uploads/benchmark2.png)

Wenn wir ein System unter Last hoch fahren, dann wird für jeden Request, den
wir in das System schicken, eine Antwort generiert.  Die Kurve zwischen
offered load und response geht also als 45-Grad Gerade nach oben, bis wir
den Sättigungspunkt erreichen.  Dort wird sie dann bei einem ideal
konfigurierten System als horizontale Gerade weiter laufen: Wir drücken zwar
mehr Load in das System hinein, bekommen aber nicht mehr Antworten heraus,
weil das System nicht schneller kann.

Die Frage ist: Was passiert mit diesen zusätzlichen Anfragen.  Die Antwort
gibt der zweite Graph.  Wir drücken Anfragen in das System hinein, und diese
haben eine bestimmte Basis-Bearbeitungszeit - die think time.  Die think
time geht unter Last nicht viel nach oben, wenn unser System gut konstruiert
ist.  Sobald wir jedoch den Sättigungspunkt erreichen, stapeln sich die
Anfragen in der Eingangswarteschlange unseres Systems, da das System nicht
ausreichend Kapazität bereitstellen kann, um die Masse der Requests zu
beantworten.  Auf die think time müssen wir noch Wartezeit - wait time -
oben drauf rechnen.  Und da wir laufend und dauerhaft mehr Last in das
System schicken als es abarbeiten kann, explodiert diese Warteschlange und
damit auch die Menge an wait time, die ein Request auf sich nehmen muß.

Das ist keine Theorie, sondern real einsetzbar: Man kann kontrolliert
realistische Lasttests an Produktivsystemen durchführen, wenn einige
Voraussetzungen gegeben sind.

![](/uploads/benchmark5.png)

Vorraussetzung ist eine Mindestgröße des zu testenden Systems, sodaß eine
stabile externe Last anliegt.  Will sagen, man muß zunächst einmal
ausreichend User haben, damit man das System überhaupt unter Last setzen
kann und bei denen die durch einen einzigen User generierte Last nicht
nennenswert ins Gewicht fällt.  In solchen Fällen hat man dann auch ein
Frontend mit mehr als einem Webserver und einem Load Balancer vorne dran.

Der Lasttest muß zu einer Zeit mittlerer Last stattfinden: In der ruhigsten
Phase des Tages ist die verfügbare Gesamtlast oft nicht ausreichend, um
Überlast zu erzeugen und in der heißesten Phase des Tages will man
wahrscheinlich nicht testen.  Wo ich arbeite ist die Lastkurve so, daß
vormittags eine gute Zeit zum Testen ist.  Außerhalb der Haupt- und
Nebensaison ist es so, daß wir unter Umständen Kapazität ganz abschalten
müssen, um ausreichend Gesamtlast zu haben, die wir konzentrieren können, um
Überlast zu haben.

Der Lasttest beginnt nun damit, daß wir die Base Load der zu testenden
Systeme aufnehmen und daß wir einen Apache Siege in das System legen, um
Base Latency zu messen: Dies ist die think time eines nicht überlasteten
Systems.

Jetzt kann man am Load Balancer spielen und die Gewichte des zu testenden
Systems (eine einzelne Frontend-Maschine oder eine Clusterzelle) langsam
hochdrehen, um mehr Last zu erzeugen.  Sobald entweder Fehler im Error Log
auftauchen oder die Latenz des Siege steil nach oben geht, hat man Sättigung
erreicht.  Jetzt muß man die Last leicht unter dem Sättigungspunkt
stabilisieren und halten (wir drehen das Gewicht am LB gerade so weit
runter, daß auch die Spitzen unserer Last aus dem Überlastbereich heraus
gehalten werden) und kann dann in sehr, sehr kleinen Schritten das System
gezielt überlasten.

Auf dem getesteten System kann das dann so aussehen:

![](/uploads/benchmark-load-test-time.png)

Man erkennt deutlich drei Testdurchläufe mit unterschiedlichen
Konfigurationen, und eine fiese Lastspitze eines Cronscriptes, die da im 3. 
Lasttest plötzlich reinspiked und auf den Monitoren der Überwacher die
Alarme kurz aufblitzen läßt - ein typischer Outlier, der
behandlungsbedürftig ist.

Man sieht auch, daß der 2.  Lasttest längere Zeit sehr vorsichtig gefahren
ist, jedenfalls aus der Sicht der Datenbank.  Das Ergebnis war am Ende, daß
die Limitierung dieses Mal nicht in der Datenbank, sondern in der CPU der
Frontend-Systeme liegt.

Die Messungen der Last kann man dann noch als offered-load vs.  latency
aufzeichnen, und bekommt dann Graphen, die so aussehen können:

![](/uploads/benchmark-load-test-comparison.png)

Der Graph zeigt den Vergleich zweier unterschiedlicher Konfigurationen und
man erkennt, daß die Ergebnisse in der realen Welt ziemlich genau so
aussehen wie oben in der Theorie diskutiert.  Eine Variante dieses Graphen
macht die einzelnen Symbole um so größer, je mehr Fehler an diesem Meßpunkt
aufgetreten sind.  Auf diese Weise ist dann auch die Art und Weise des
Systemversagens und der Punkt der letzten Stabilität gut erkennbar.


**Nachtrag:** Alexander Aulbach fragte in der Diskussion zum Artikel oben:

> Es wäre mal interessant zu schauen, welchem physikalischen Modell das am
> ehesten gehorcht.

Guckst Du hier:

- Raj Jain, [The Art of Computer Systems Performance Analysis: Techniques for Experimental Design, Measurement, Simulation, and   Modeling](http://www.amazon.de/The-Computer-Systems-Performance-Analysis/dp/0471503363), Wiley and Sons, 1992
- Neil J Gunter, [Analyzing Computer System Performance with Perl::PDQ](http://www.amazon.de/Analyzing-Computer-System-Performance-ebook/dp/B001FB6DP4), (Springer, Kindle Edition)
- Neil J Gunter, [Capacity Planning: A Tactical Approach to Planning for Highly Scalable Applications and Services](https://www.amazon.de/Guerrilla-Capacity-Planning-Tactical-Applications/dp/3540261389) (Springer, 2006)

Viele der Modellierungsansätze werden aber durch Testing in Production und
das beschriebene Lasttestverfahren obsolet.  Die Modellierung kann dennoch
sinnvoll sein, um obskure Bottlenecks oder absolute Kapazitätsgrenzen besser
sichtbar zu machen.  In meiner Praxis habe ich sie bisher jedoch nie
gebraucht, außer um Offensichtliches aus der Messung im Modell zu
bestätigen.
