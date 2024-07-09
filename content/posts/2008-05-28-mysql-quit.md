---
author: isotopp
date: "2008-05-28T13:59:26Z"
feature-img: assets/img/background/mysql.jpg
published: true
tags:
- mysql
- lang_de
title: mysql> quit;
---

Mit dem Ende dieser Woche [endet nicht nur die MySQL Deutschland GmbH]({{< relref "2008-01-16-sunw-aeh-java.md" >}})</a>, sondern auch meine Tätigkeit bei MySQL. 
Den neuen Vertrag bei Sun habe ich, anders als zunächst geplant, nicht unterschrieben - mir ist relativ schnell klar geworden, daß ich mich in einer Firma dieser Größe nicht wohlfühlen werde.

Für MySQL bin ich seit Ende des Jahres 2005 unterwegs gewesen - bis zu 180 Tage im Jahr.
Neben einigen größeren Projekten habe ich sehr viel kleineres Consulting gemacht - "Pivot-Consulting", bei dem es nicht darum geht ein Projekt umzusetzen, sondern den Kunden dazu zu befähigen, das Projekt selber zu schaukeln.
Dabei habe ich alle Bereiche um MySQL herum abgedeckt mit Ausnahme von MySQL Cluster. 
Ich habe außerdem durchschnittlich 60 Arbeitsstunden pro Woche inklusive Reisezeit weggehauen und bin teilweise über Monate nur am Wochenende daheim gewesen.

Spannend war's und einigermaßen einträglich auch.
Aber der Verkauf an Sun und der Betriebsübergang machen es notwendig, dass ich mich frage, wovon ich da Teil werde und ob ich das will.
Und daß ich mich frage, was ich die nächsten Jahre tun möchte - ob ich noch immer so viel Reisen möchte oder ob ich mal wieder eine Phase mit mehr Stabilität brauche. 
Mein Körper hat mir in den vergangenen Monaten recht deutlich gemacht, wo seine Präferenzen liegen. 
Das dazu.

Die Arbeit bei MySQL ist noch immer nicht nur der anstrengendste, sondern auch der spannendste Job, den ich je hatte.
MySQL hat mit seinem Produkt einen komplett neuen Markt unter dem existierenden Datenbankmarkt etabliert und begleitet seine Kunden nun seit mehr als einer Dekade auf dem Weg.
Produkt und Anwender lernen dabei nicht nur voneinander, sondern entwickeln auch 
[neue Paradigmen](http://highscalability.com/)
für eine Umgebung in der traditionelle Datenbanktechniken nicht mehr greifen. 

Für meine Kunden bin ich dabei oft nicht nur der Consultant gewesen, der die fertige Lösung aus der Tasche zieht.
Sondern mein Job war auch der eines Gesellen auf Wanderschaft, der andere Installationen und Herangehensweisen gesehen hat.
So konnte ich das lokale Projekt mit anderen Ansätzen anderswo in Beziehung setzen und dem Kunden so die notwendige Sicherheit und das notwendige Vokabular vermitteln, und auf Grundlage dieser Erfahrungen auf die Ecken und Kanten hinweisen, die auf dem Weg zum Projektende wahrscheinlich noch lauern würden.

Vokabeln und Erfahrungsberichte sind tatsächlich sehr wichtig - bei vielen, was wir machen 
[verstoßen wir gegen die Regeln]({{< relref "2006-07-30-leben-mit-fehlern-der-schluessel-zum-scaleout.md" >}})
traditionellen Datenbankdesigns und tun gegebenenfalls das Gegenteil davon. 
Eine Liste wie die
[eBay Best Practices](http://www.infoq.com/articles/ebay-scalability-best-practices)
ist jedenfalls ziemlich genau eine Liste von "Dinge, die mein Datenbankprofessor gehasst hätte". 

Wenn man so etwas macht und gegen etablierte Techniken und Methoden direkt verstößt, dann will man Sicherheit haben - "das hat schon einmal irgendwo geklappt" - und Worte für das, was man da tut - "für unsere Architektur gibt es Worte, es sind nur nicht die Worte, die ein traditioneller Datenbanker verwenden würde, weil es keine traditionelle Architektur ist".
Meine Aufgabe war mehr als einmal, diese Referenzen und diese Zusicherungen zu geben und das Projekt dann mehr oder weniger einfach den ursprünglichen Weg gehen zu lassen. 
Gerne auch das, wenn es denn hilft, die Sache zu einem Erfolg zu machen...

MySQL und Postgres sind nun "dasselbe" - Josh Berkus, Monty Widenius und Jim Starkey arbeiten alle für Sun.
Aber sie sind auch die beiden Extrempunkte eines Kontinuums. 
Postgres ist eine gute Plattform, um eine traditionelle Datenbank-Architektur von einer Closed Source Plattform in eine Open Source-Umgebung zu befördern.
Es enthält (und bewirbt) einen Haufen traditioneller Mechanismen, die eine relativ direkte, kostengünstige und risikoarme Migration auf diesem Pfad ermöglichen.

MySQL und MySQL Consultants sind oft ein wenig anders - sie denken eher in massiv in die Breite skalierten, verteilten, asynchronen Web-Architekturen, die Anwendungen als verteilte Systeme betrachten.
In solchen Systemen werden die Anwendung, die Middleware, die Bibliotheken und die Datenbanken zusammen als "die Anwendung" angesehen und als System betrachtet, in denen man alle Komponenten kontrolliert und adaptiert.
Weil der ganze Stack kontrolliert und als integrales System betrachtet wird, wird Funktionalität oft in die leichter und billiger zu skalierenden Außenbereiche gedrückt, anstatt sie monolithisch-synchron im Datenbank-Kern abzuhandeln. 
Dies ist in vielen Fällen aufwendiger und schwerer zu kontrollieren als ein traditionelles System, erlaubt es aber zu wachsen, 
[indem man einfach mehr Boxen hin stellt](http://www.allthingsdistributed.com/2006/03/a_word_on_scalability.html).

Im Job führt das oft zu Konflikten, wenn man auf einen traditionellen DBA oder Architekten trifft. 
Dann ist es die Aufgabe des Consultants klarzumachen, daß dies eine valide Architektur ist, die sich oft bewiesen hat, ja daß es sogar die einzige Architektur ist, die sich auf globaler Skala unter allen wirklich großen Systemen durchgesetzt hat.
Das, was traditionelle Architekturen tun ist gut und richtig - wenn man Time To Market minimieren möchte und ein möglichst simpel erstellbares und debugbares System haben möchte.
Wenn man aber die Größenordnung verlässt, in der man dieses Problem auf einer einzelnen Maschine abhandeln kann, dann setzen [physikalische Effekte ein]({{< relref "2007-08-11-zehn-zentimeter.md" >}}), die es zwingend machen, diese einfache und leicht zu kontrollierbare Welt zu verlassen.

Diesen Übergang zu lehren und Kunden durch diesen Übergang zu begleiten ohne daß die Kundensysteme dabei offline gehen mussten war oft genug meine Aufgabe und die meiner Kollegen.

Auch Sun hat diese Lehre gut verinnerlicht - um 2001 herum war ich bei einem Sun Kunden tätig, der nicht weniger als zwölf Enterprise 10000 Maschinen in seinen Rechenzentren im Einsatz hatte.
Diese Maschinen sind das Denkmal traditioneller synchroner Architekturen, 64 Prozessoren (72 bei den Nachfolgern) und 64 GB RAM (bis zu 576 GB RAM bei den Nachfolgemodellen), 24 Ebenen Multilayer auf der Backplane, Switches statt Busse zur Rechner-internen Kommunikation zwischen Karten und CPUs. 
Wunderwerke der Ingenieurskunst, spannende Spielzeuge für jeden Sysadmin und außerdem Lösungen auf der Suche nach einem Problem.

Besagter Kunde hat heute keine einzige Maschine dieser Leistungsklasse mehr. 
Stattdessen setzt man auf eine große Anzahl von kleineren Systemen, 4- und 8-Core-Maschinen, die rackweise verbaut werden und auf denen man das Problem partitioniert und verteilt.
Das erlaubt es nicht nur weniger Euro pro MIPS zu bezahlen, sondern auch Gesamtsysteme zu bauen, die nicht durch die größe verfügbare Maschinengröße beschränkt sind.

Auch Sun hat das gelernt - Maschinen wie die 5240 sind quasi das Gegenteil einer E10k und mit einem Rack voll dieser Geräte erreicht man bei passend angepasster Software viel mehr als mit einer traditionellen monolithischen Architektur.
Der Knackpunkt ist [passend angepasste Software](http://www.scribd.com/doc/2575733/The-future-of-MySQL-The-Project) (Seite 9).
Sich auf solche Maschinen und in solchen Umgebungen besser zu integrieren ist derzeit die wichtigste Priorität bei MySQL - und die der meisten MySQL Kunden.
Sun weiß das, und man arbeitet daran.
Wir leben in spannenden Zeiten!

Auch ich werde in spannenden Zeiten leben, denn meine Aufgabe bei meinem neuen Arbeitgeber wird genau ein solcher Übergang sein.
Diesmal aber nicht als Pivot-Projekt, sondern mitten drin! 
Ich freue mich schon!
