---
layout: post
published: true
title: 'NoSQL and No Security '
author-id: isotopp
date: 2011-08-10 19:30:40 UTC
tags:
- datenbanken
- security
- lang_de
feature-img: assets/img/background/rijksmuseum.jpg
---
Drüben bei Securosis arbeitet man die Black Hat 2011 unter dem Titel 
[NoSQL and No Security](http://www.securosis.com/blog/nosql-and-no-security) auf.
Es geht um die Beobachtung, daß die meisten NoSQL-Datenbanken nicht nur
keinerlei Authentication haben (hat jemand so verstrahltes Zeugs schon mal
in einer PCI Zone deployed?), sondern außerdem viele von ihnen auch anfällig
für Server-Side JavaScript Injection (SSJI) sind.

Das soll heißen, daß die Abfragesprache der Wahl bei vielen dieser Dinge
Javascript ist, daß im Datenbankserver interpretiert wird. Gelingt es im
Rahmen einer Query Javascript in die Datenbank-Abfrage zu injezieren, kann
man auf der Datenbank frei Code ausführen. Das ist die Fortsetzung von XSS
(Injektion von Javascript in den Browser/Client) mit anderen Mitteln
(Injektion von Code in den Datenbankserver - SSIJ) und in
[Node.js](http://nodejs.org/).

Der Tod dieser Geschichten ist meistens Serialisierung von Datenstrukturen
als ausführbarer Javascript-Code (JSON) und dann die tatsächliche Ausführung
von solchem Code ohne ausreichende Sicherheitsprüfung - also ganz klassisch
eine Art eval(), der remote Killswitch jeder Interpretersprache (Ich kenne
mich damit aus, ich bin 
[eben dieses Vergehens schuldig](http://phplib.sourceforge.net/index.php3)).

Die Frage ist: Wieso bauen Leute solche Systeme in 2011? Die Sorte Fehler
riecht doch eher nach 1998!
