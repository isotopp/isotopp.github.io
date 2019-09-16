---
layout: post
published: true
title: Schemaless?
author-id: isotopp
date: 2011-04-19 11:49:31 UTC
tags:
- datenbanken
- mysql
- nosql
- lang_de
feature-img: assets/img/background/mysql.jpg
---
## Die Frage:

Ich brauche einmal Hilfe. Von Euch. Ich verstehe nämlich ein Konzept nicht.
Es geht um den Begriff "Schemaless", der im Zusammenhang mit einigen
NoSQL-Datenbanken verwendet wird.

Ich kann verstehen, daß für einige Leute ein ALTER TABLE wie in MySQL ein
Problem ist, weil es Tabellen während der Schemaänderung lockt. Da ALTER
TABLE in vielen Fällen die Daten zur Durchführung der Änderung umkopieren
muß, kann dieses Lock entsprechend lange bestehen bleiben, wenn die Daten
nur hinreichend groß sind.

Ich kann nicht verstehen, wieso Leute glauben, daß "Schemaless" da eine
Hilfe wäre oder wieso Leute glauben, daß es so etwas wie "Schemaless"
überhaupt gibt.

Daten in Datenbanken existieren ja in der Regel nicht im luftleeren Raum,
sondern sie werden von Code genutzt. Dieser Code macht Annahmen über die
Attribute, die in einer Tabelle (oder was immer Euer NoSQL als
Tabellenäquivalent verwendet) existieren dürfen oder müssen.

Wie geht ihr damit um, wenn ihr "schemaless" arbeitet?

Haben Eure Tabellen ein verpflichtendes Attribut "version", und Euer Code
dann einen Getter/Setter, der die Version einer Row prüft und gegebenenfalls
überflüssige Attribute entfernt, fehlende Attribute mit Defaults ergänzt und
dann im Setter die Version auf den aktuellen Stand anpaßt? Wenn ja, wie ist
das "schemaless"? Ihr enforced ja ein Schema, und implementiert das ALTER
TABLE lazy, wie es in einigen Datenbanken gemacht wird, die nicht MySQL
sind.

Wenn nein: Wie geht Euer Code stattdessen mit der Situation 'fehlendes
Attribut' bzw. 'nicht mehr gebrauchtes Attribut' um?

Generell: Wie prüft Ihr Range und Validität von Daten in so einer Datenbank?

Wäre es nicht sinnvoller, ALTER TABLE so anzupassen, daß es a) Indices im
Hintergrund erzeugt und b) Zufügen, Entfernen und Ändern von Spaltentypen
lazy implementiert wie oben geschildert?

Bitte helft mir und diskutiert in den Kommentaren.

[Die Antwort]({% link _posts/2011-04-20-zusammenfassung-schemaless.md %}) in einem späteren Artikel.