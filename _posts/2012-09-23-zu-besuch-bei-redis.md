---
layout: post
published: true
title: 'Zu Besuch bei Redis'
author-id: isotopp
date: 2012-09-23 19:06:45 UTC
tags:
- datenbanken
- innodb
- mysql
- nosql
- redis
- sql
- lang_de
feature-img: assets/img/background/mysql.jpg
---
Hier ist eine wichtige Zahl: Ein Coredump von einem MySQL auf einer Maschine
mit knapp unter 200G Speicher dauert 15 Minuten.  Auf SSD.  Auf eine
Festplatte dauert der gleiche Coredump dann knapp über 30 Minuten.

Warum ist das eine wichtige Zahl?
<!-- more -->

SSD sind schnell.  Linear schreiben sie mehr als 200 MB pro Sekunde weg -
ein ziemlich beeindruckendes Tempo, und noch dazu in einer Disziplin, wo sie
nicht einmal optimal nutzbar sind.  Auch moderne Serverfestplatten sind
schnell - beim linearen Schreiben immerhin knapp halb so schnell wie eine
SSD, oder 100 MB pro Spindel linear.

Aber moderne Maschinen haben halt auch eine sehr große Menge Speicher.  Und
200 GB bei 200MB pro Sekunde sind halt dann eine Viertelstunde pro Full Dump
oder Full Scan.

In 
[Eine reiche NoSQL-Anfragesprache](http://blog.ulf-wendel.de/2012/eine-reiche-nosql-anfragesprache/)
macht Ulf Wendel sich Gedanken über die Leistungsfähigkeit von
Abfragesprachen für NoSQL-Datenbanken, und ob es darstellbare
Gemeinsamkeiten gibt.

Das ist eine gute Überlegung, aber meiner Meinung nach setzt es schon
mindestens einen Schritt zu spät auf.  Zunächst will man sich Überlegen, ob
man "seiner" NoSQL-Datenbank überhaupt Daten anvertrauen will.  Die meisten
SQL-Datenbanken sind nämlich außergewöhnlich schlechte lokale Speicher.  Und
das ist eine schlechte Ausgangsposition, denn alles, was mit horizontalem
Scaleout und verteilten Datenbanken zu tun hat, setzt eine Schicht höher
auf, und ist schlicht nicht gut tragfähig, wenn das Fundament schlecht ist.

Hier ist [Redis](http://redis.io/). Redis ist ein Key-Value
Store mit ein paar Extras, denn neben einem großen Hash mit
Netzwerkinterface versteht es auch Strings, Listen (oder Stacks), Mengen und
geordnete Mengen.  Redis realisiert Persistenz auf genau dieselbe Weise wie
MySQL Cluster:

- Wann immer man möchte, erzeugt Redis einen 
  [point-in-time snapshot](http://redis.io/commands/bgsave).
  Darunter verstehen die Redis-Entwickler einen fork() des Servers, und dann
  im Kindprozeß ein Abspeichern des gesamten Datenbereiches auf Platte -
  also das Äquivalent eines Coredumps.  Wichtig dabei auch: Overcommit auf
  OS-Level erlauben, sonst darf man nur sein halbes RAM für Daten nutzen!

  Wir wissen nun schon, daß dieser Schreibprozeß auf einer zeitgemäßen
  Maschine etwa 15 oder 30 Minuten dauern wird und dabei alle Diskbandbreite
  belegen wird, die verfügbar ist.  Im Falle eines Crashes hat man damit bei
  Recovery einen Stand, der bis zu 30 Minuten in der Vergangenheit liegt.

- Redis unterhält außerdem ein Append Only File (AOF), oder,
  wie man in Datenbanktermen sagen würde, ein Redo-Log.  Es schreibt alle
  Änderungen an Daten in zeitlicher Reihenfolge mit.

Ohne Kompaktierung würde eine Recovery unendlich lange dauern, da alle
Veränderungen an den Daten durch ein Abspielen des AOF der Reihe nach
nachvollzogen werden.

Mit Kompaktierung - dem AOF Rewrite wie Redis dies nennt - werden doppelte
Updates desselben Datensatzes zusammengefügt, sodaß nur der letzte
Schreibzugriff pro Datensatz gespeichert wird.

AOF Rewrite skaliert sich auch nicht - jeder Postgres oder CouchDB DBA, der
schon mal mit einem Postgres 
[VACUUM FULL](http://wiki.postgresql.org/wiki/VACUUM_FULL)
oder eine
[CouchDB Compaction](http://wiki.apache.org/couchdb/Compaction)
laufen hatte, kennt genau die Auswirkungen, die ein AOF
Rewrite hat.

Wie lösen traditionalle Datenbanken wie InnoDB das Problem?  Mit einem 
[Checkpoint]({% link _posts/2011-09-19-checkpoint-blues.md %}).   
MySQL unterhält wie Redis ein Bild der aktuellen Daten auf der Platte -
Redis in Form des point-in-time snapshot, MySQL in Form von InnoDB
\*.ibd-Files.

Anders als Redis schreibt MySQL aber bei einem Checkpoint nicht die ganze
Tabelle neu.  Stattdessen sind ibd-Dateien (und der Speicher) in Seiten von
16 KB unterteilt.

Und statt eines AOF-Rewrite, bei dem das ganze Redo Log neu geschrieben
wird, schreibt MySQL für jeden Eintrag im Redo-Log die zugehörende
Speicherseite auf die Platte - aber eben nur diese, und nicht die ganze
Tabelle.  MySQL macht dies außerdem auf eine Weise, bei der Daten nicht
verloren gehen können, selbst dann, wenn die Datenbank mitten im Schreiben
einer 16 KB-Seite den Strom abgeschaltet bekommt: Die Daten landen einmal im
Doublewrite-Buffer, dann wird das Redo Log aktualisiert und dann werden die
Daten im \*.ibd-File aktualisiert.  Auf diese Weise, und mit den Prüfsummen
in jeder Seite, kann MySQL sogar von halb geschriebenen Seiten sauber
recovern.

MySQL skaliert: Von einer Datenbank mit MySQL 5.6.6 und mit 192 GB RAM und
200 Connections, die wie wild schreiben, bekommen wir eine Schreibrate von
etwa 150 MB/sec netto auf zwei SSD.  Bedenkt man den Overhead mit dem
Doublewrite-Buffer und dem Redo-Log ist das immens beeindruckend.

Das bringt uns zum 2.  Thema: Concurrency.  MySQL InnoDB skaliert, in MySQL
5.6 skaliert es sogar ziemlich unglaublich: Ein Cluster mit 96 Cores, der
192 Verbindungen in die Datenbank unterhält, deren einzige Aufgabe es ist,
[Daten zu berechnen und zu schreiben]({% link _posts/2012-08-15-materialized-view.md %}), 
kommt mit der o.a.  Konfiguration auf die genannten 150 MB/sec, und nutzt 
dabei - Threading sei Dank - die CPU-Kapazität der 12 physikalischen
Cores (24 virtuellen Hyperthreading-Cores) der Datenbank gut aus.

Ein [Single Threading Design](http://www.enjoythearchitecture.com/redis-architecture)
erscheint mir in 2012 relativ hirntot, denn damit handelt man sich jede Menge 
[Latenzprobleme](http://redis.io/topics/latency) ein - und in 2012
ist es nun einmal unmöglich, Hardware mit nur einem Kern zu kaufen.  Selbst
Mobiltelefone sind inzwischen Quadcores.

Abhilfe wäre eine Aufteilung des Servers, indem man ihn mit cgroups oder
anderen Hilfsmitteln in z.B.  von einem 12-Core mit 192 GB in 12 Singlecores
mit je 16 GB Speicher unterteilt.  Jetzt bekommt man aber ein Problem mit
der Adressierung - welche Daten bringe ich wo unter, und wie frage ich 12
Serverinstanzen parallel ab (oder ich frage 12 mal hintereinander nach
meinen Daten, türme dann aber 12 Latenzen aufeinander).

Und man bekommt ein Problem mit der Orchestrierung, denn jetzt habe ich 12
Instanzen auf derselben Hardware, die parallel point-in-time snapshots oder
AOF schreiben müssen, und dabei um die vorhandene Disk Bandbreite
konkurrieren.  Wenn sie jedoch jemals tun, werden unsere linearen Writes zu
Seeks, und plötzlich wird unsere ehemals ach so schnelle Disk wirklich,
wirklich langsam und unsere Latenzen explodieren wirklich.

Als Anwendungsentwickler fragt man sich natürlich auch: Was soll die
Scheiße?  Also, warum soll ich mich als Anwendungsentwickler um so etwas
kümmern?  Wieso ist der Server nicht in der Lage, sich um solche Details
selber zu kümmern?  Und wieso ist dieses Problem der Orchestrierung nicht
sowieso schon gelöst?

Die Antwort auf die letzte Frage wird klar, wenn man sich die in 
[der Latency-Seite](http://redis.io/topics/latency) die im Abschnitt
"Fork time in different systems" genannten Systemgrößen einmal anschaut: 360
MB bis 7 GB.  Zum Vergleich: Das kleinste erhältliche Mobiltelefon kommt in
2012 mit 8 GB Speicher.

[Der Gray](http://www.amazon.com/Transaction-Processing-Techniques-Management-ebook/dp/B007TM5KKM)
ist teuer, Elsevier halt, aber nicht _so_ teuer.  Und man
bekommt 40 Jahre Erfahrungen mit Persistenz done right (and scaleable) für
sein Geld.  InnoDB ist ziemlich genau eine Lehrbuchimplementierung des Gray.

InnoDB hat Probleme, aber es hat sie an Stellen, an denen Redis noch nicht
mal Code hat.
