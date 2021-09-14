---
layout: post
published: true
title: Wie man einen Graph plottet
author-id: isotopp
date: 2012-03-12 19:44:10 UTC
tags:
- computer
- graph
- monitoring
- mysql
- lang_de
feature-img: assets/img/background/mysql.jpg
---
![Graph: Schlechtes Beispiel](/uploads/graph-schlecht.png)

Ein total kaputtes Stück Graph.

Das da ist das, was ich bekomme, wenn ich mir eine Woche Daten in dem
Datenbank-Monitoringprodukt meiner Wahl anschaue.  Aber das spielt keine
Rolle.  Ich kann mir so ziemlich jeden Zeitreihengraphen anschauen, aus so
ungefähr jedem Stück Software, das mir zur Installation zur Verfügung steht,
und falls es nicht rrdtools ist, ist es genau so kaputt.

Das ist bemerkenswert, weil der Plot wahrscheinlich von einem Rudel Diplom-
oder Master-Abgänger gebaut worden ist.  Man sollte annehmen, daß jetzt, wo
ein Studium Geld kostet, diese Personen vielleicht auch zuhören, wenn ihnen
elementare Dinge erklärt werden.

## Was ist genau kaputt?

Man versuche einmal, die Werte zwischen dem 6.  und dem 7.  März abzulesen. 
Wie man sieht, haben wir dort keine Linie, sondern einen fetten gelben
Zitteredding, der die Pixel auf dem "Graphen" zuquastet.

Der "Graph" ist hier 640 x 300 Pixel groß, weil ich das so eingestellt habe,
damit ich mehrere Browserfenster zum Vergleichen nebeneinander legen kann. 
Die Software nimmt einen Meßwert pro Minute auf, also 1440 Messungen pro
Tag.  Es sind also hier 10080 Meßwerte in Betracht zu ziehen, um die
gewünschte Darstellung von einer Woche zu zeichnen, also nicht ganz 16
Meßwerte pro x-Pixel.  Unser "Graph" zeichnet nun für jeden x-Wert alle 16
Meßwerte ein.

Irgendein Spezialexperte hat jetzt die Meßpunkte außerdem noch miteinander
verbunden, damit man bei Diskontinutäten keine Löcher im Graph hat.  So hat
man noch mehr als 16 geplottete Pixel pro x-Pixel, und stellt so sicher, daß
in einem Spike der gesamte Graph vollkommen nutzlos ist.  Weil Spikes nun
gerade die interessanten Stellen wären. **meinjanur**

Das Resultat ist vollkommen nutzlose Pixelmarmelade: Wie ist die Verteilung
dieser 16 Werte zu jedem Zeitpunkt?  Wie sind Mittelwert, Median, Maximum,
Minimum in dieser Pixelwolke gelegen?  Welche dieser Pixel sind Meßwerte und
welche informationslose Verbindungslinien?

_Hier ein Tip:_ Man kann das noch pessimieren, indem man da irgendeinen
Spline durch legt, damit es noch Überschwinger gibt.  Dann kann man dem Ding
überhaupt keine Informationen mehr entnehmen.

![Eine bessere Darstellung](/uploads/graph-gut.png)

Ein Graph, mit dem man etwas anfangen kann.

Dies ist ein anderer Graph - diesmal einer, der den Namen auch verdient. 
Wie man sehen kann, wird wieder ein Zeitraum von einer Woche gemalt, sodaß
pro x-Wert nicht ganz 16 Meßwerte zu berücksichtigen sind.  Hier - es
handelt sich um rrdtool - hat jemand mitgedacht, und so sehen wir in Blau
den Mittelwert der 16 Werte und in Rot das Maximum dieser Werte
eingezeichnet.

Es ist klar erkennbar, daß der Mittelwert relativ stabil ist (bis er am Ende
abfällt), und wie hoch die Spikes sind, die von diesem Mittelwert ausgehen. 
Auf dieser Grundlage kann man verläßliche Aussagen über das Lastverhalten
der Kiste machen.

Damit ist bewiesen, daß Tobias Oetiker in seinen Mathevorlesungen zugehört
hat, anstatt sich in den Nächten vorher das Hirn weg zu saufen.  Wenigstens
einer!

![Eine innovative Histogramm-Darstellung](/uploads/graph-noch-besser.png)

Dichte-Diagramm und Qualitätsrating im Mittelwert.

Dies ist ein Graph, wie er von Smokeping gemalt wird.  Hier werden sogar 15
Tage betrachtet.  Für jedes Pixel stehen also circa 30 Meßwerte bereit, wenn
man einmal pro Minute mißt - bei einer Messung alle 5 Minuten immerhin noch
6 Meßwerte (mal 20, weil Smokeping in einer Messung je nach Konfiguration
mehrere Werte erfaßt - hier 20).

Im Graph erkennen wir genau den farblich hervorgehobenen Median (Es wird ein
Median statt eines geometrischen Mittels eingezeichnet, weil das stabiler
gegen Outlier ist).  Der Farbcode für den Median gibt zugleich eine
Verlustrate an.  Kommt es überhaupt zu Verlusten, liegt also eine Störung
vor, ist der entsprechende Bereich des Graphen farblich markiert und die
Farbe des Median gibt die Verlustrate (hier: 10/20, Lila) an.

Über und unter dem Median ist durch entsprechende Grauwerte eine
Dichteverteilung der gemessenen Werte eingezeichnet.  Wir können also nicht
nur erkennen, wie weit die Maxima und Minima vom Median abweichen, sondern
durch die Schattierung erkennen wir das kumulative Histogramm der Meßwerte,
bekommen also einen Dichtegraphen und können so sehen, wie anormal so ein
Outlier/Maximum denn nun wirklich ist.

Das ist zwar _auch wieder_ ein breiter Quast wie im ersten Graphen. 
Anders als im ersten Graphen ist er jedoch intern strukturiert und enthält
eine große Menge an zusätzlichen Informationen in derselben Menge Pixel - es
handelt sich um ein Histogramm, mit der die Dichteverteilung der Werte
visualisiert wird.

So macht man es richtig.

Und jetzt schaut Euch Eure Graphen an, schämt Euch, schmeißt Euren Code weg
und macht es richtig.  Damit ich mich nicht mehr aufregen muß.

Danke sehr.

_Nachtrag:_ rrdtool schützt nicht vor Dummheit.  Also, es versucht sein
Bestes, aber wenn das Problem vor der Tastatur darauf besteht, kommt
trotzdem Rotz raus.

Best of Munin:

![Uptime als Graph](/uploads/graph-uptime.png)

Uptime steigt um einen Tag (ein y-Pixel) pro 24 Stunden.  Das ist schon als
Linie kaum zu sehen - als Bargraph aber komplett im Eimer.

![rrdtool Mißbrauch](/uploads/graph-rrdtool-kaputt.png)

Wir nehmen einen dicken Edding und Daten mit Spikes.  Und lassen jede Form
von Median/Maximum/Minimum-Plot beiseite, denn sonst wäre das Ergebnis
womöglich sinnvoll.
