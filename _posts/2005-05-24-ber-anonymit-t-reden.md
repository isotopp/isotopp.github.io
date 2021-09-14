---
layout: post
published: true
title: Über Anonymität reden
author-id: isotopp
date: 2005-05-24 02:15:00 UTC
tags:
- authentication
- identity
- security
- lang_de
feature-img: assets/img/background/rijksmuseum.jpg
---
[Anonymity, Unobservability, Pseudonymity and Identity Management - A Proposal for Terminology](http://www.freehaven.net/anonbib/cache/terminology.pdf) pflegt
Marit Hansen mit Andreas Pfitzmann und anderen eine Liste von Begriffen,
Definitionen und Konzepten, die mit dem Komplex "Anonyme Kommunikation" zu
tun haben. Das Papier soll Terminologie in diesem Bereich vereinheitlichen
und so die Diskussion vereinfachen.

Das Papier definiert "Anonymität" als "Ununterscheidbar in einer Grundmenge
von Akteuren oder Adressaten einer Nachricht". Dadurch wird Anonymität
meßbar, indem man den Verdünnungsfaktor, also die Größe dieser Grundmenge
angibt.

![](/uploads/jap_screen.jpg)

Ein anderer, von Anonymität zunächst einmal verschiedener Begriff ist der
Begriff der "Verkettbarkeit": Für zwei Objekte in einem System (etwa: eine
Nachricht und ein Absender) soll das System nicht mehr Information über die
Beziehung der Objekte liefern als ohne das System verfügbar wäre. Anonymität
kann dann über Nichtverkettbarkeit formuliert werden, nämlich als
Nichtverkettbarkeit von einer Absenderidentität mit einer Nachricht
("Absenderanonymität"), einer Empfängeridentität mit einer Nachricht
("Empfängeranonymität") oder eines Absenders mit einem Empfänger
("Beziehungsanonymität").

Eine stärkere Eigenschaft ist "Unbeobachtbarkeit", bei der etwa die
Nachrichten in einem Kommunikationssystem von Rauschen ununterscheidbar
sind, also nicht einmal die Existenz von Nachrichten bewiesen oder widerlegt
werden kann.

"Pseudonymität" liegt vor, wenn Absender und Empfänger Pseudonyme als
Identitäten verwenden, also ihre Nachrichten mit dem Pseudonym kennzeichnen.
Pseudonymität deckt also das ganze Feld zwischen Anonymität auf der einen
Seite und totaler Zurechenbarkeit auf der anderen Seite ab.

So kann ein Absender zum Beispiel 

[wiederholt Nachrichten unter demselben Pseudonym absenden](http://groups-beta.google.com/groups?q=author:huerbine&scoring=d)
und sich so eine Reputation erarbeiten, mehrere Nachrichten werden also über
dasselbe Absenderpseudonym verkettbar.

Die Verkettung zwischen dem Pseudonym und der Inhaberperson kann öffentlich
sein ("Telefonnummern als Pseudonyme für Anschlußinhaber"),
nichtöffentlich-aufdeckbar sein ("Maskenball") und
nichtaufdeckbar-verkettbar ("DNS-Probe, die noch nicht in einer Datenbank
erfaßt ist").

Pseudonyme können transferierbar sein ("Account in einem Onlinespiel"), oder
nichttransferierbar ("Fingerabdruck"). Durch Transfer kann ein aufdeckbares
Pseudonym unaufdeckbar werden.

Im Hinblick darauf, wann Kommunikationspartner ihre Namen wechseln, wie die
Lebensdauer des Namens ist, und ob das Pseudonym Aspekte einer Person, eine
Person oder Gruppen von Personen bezeichnet, kann Pseudonymität noch weiter
aufgegliedert werden.

Ein Aspekt, den das Papier nicht diskutiert, ist die Qualität von
Pseudonymen innerhalb desselben Namensraumes: Eine
[IP-Nummer ist zum Beispiel ein Pseudonym]({% link _posts/2005-05-23-identifizierung-durch-ip.md %})
unter dem ein Benutzer im Internet agiert. Aus der IP-Nummer selber können
aber zunächst keine Eigenschaften des Pseudonyms abgeleitet werden: Es ist
nicht bekannt, ob die IP-Nummer eine Person oder eine Gruppe von Personen
bezeichnet und es ist auch nicht bekannt, ob und wie lange die IP-Nummer mit
einem bestimmten Inhaber verkettbar ist. Ebenso können keine Aussagen
darüber gemacht werden, ob Zugriffe von zwei verschiedenen IP-Nummern
demselben Benutzer zugerechnet werden können.

Solche Aussagen über zugesicherte Eigenschaften wären aber wichtig, wenn man
einer IP-Nummer im juristischen Kontext identifizierende Eigenschaften
zuordnen will und wenn man Verantwortung für Taten im Internet über
IP-Nummern mit Tätern verknüpfen möchte.

So treibt unsere Rechtssprechung recht seltsame Blüten: Das Recht verlangt
auf der einen Seite Chipkartenleser mit Tastatur und Display, damit
zurechenbare digitale Unterschriften unter elektronische Rechnungen gesetzt
werden können, um diese in den Augen eines Finanzamt gültig werden zu
lassen. Anderseits werden aber Personen auf der Grundlage irgendwelcher Logs
mit irgendwelchen Zeit/DSL-Login/IP-Zuordnungen darin für angebliche
Hackangriffe im Internet zur Rechenschaft gezogen. Ein bischen inkonsequent
ist das schon.
