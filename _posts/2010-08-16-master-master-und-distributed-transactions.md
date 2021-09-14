---
layout: post
published: true
title: Master-Master und Distributed Transactions
author-id: isotopp
date: 2010-08-16 14:59:00 UTC
tags:
- mysql
- replication
- lang_de
feature-img: assets/img/background/mysql.jpg
---
Immer mal wieder kommt jemand im Internet auf die Idee, wie man
Master-Master und verteilte Transaktionen ganz einfach realisieren kann.
[MySQL verteilte Daten](http://www.okami.de/2010/08/01/mysql-verteilte-daten/) von Okami ist
ein gutes Beispiel für diese Idee:

> Wir nutzen dabei aus, dass MySQL bei zusammengesetzten Indizes einen
> AUTO_INCREMENT-Wert pro distinktem Schlüsselpräfix zählt. Das heißt ganz
> konkret: Wir legen einen Primär-Schlüssel aus zwei Spalten zusammen. In
> der ersten Spalte verwenden wir einen sehr kleinen Wert, der die Quelle
> der Daten kennzeichnet: Source tinyint unsigned NOT NULL; Den zweiten Teil
> legen wir als einfache ID int unsigned NOT NULL AUTO_INCREMENT an. Und ein
> Timestamp-Wert bietet sich für das Triggern der Updates an.

Diese Lösung ist exemplarisch schön, weil sie beide Fehlannahmen enthält,
die man bei der direkten Lösung des Problems machen kann. 

1. Erstens setzt sie voraus, daß zusammengesetzte Primärschlüssel mit AUTO_INCREMENT
   portabel sind.
2. Zweites setzt sie voraus, daß man mit Timestamps Änderungen replizieren
   kann.

### Zusammengesetzte Primärschlüssel

Zunächst einmal ist es so, daß in InnoDB ein zusammengesetzter Primärschlüssel mit AUTO_INCREMENT nicht funktioniert. 

```sql
root@localhost [kris]> create table t (
-> source tinyint unsigned not null,
-> id int unsigned not null auto_increment,
-> ts timestamp,
-> primary key (source, id)
-> ) engine = innodb;
ERROR 1075 (42000): Incorrect table definition; there can be only one auto column and it must be defined as a key
```

Dieses Feature existiert nur für MyISAM: 

```sql
root@localhost [kris]> create table t (
-> source tinyint unsigned not null,
-> id int unsigned not null auto_increment,
-> ts timestamp,
-> primary key (source, id)
-> ) engine = myisam;
Query OK, 0 rows affected (0.23 sec)
```

Es ist eines der Standard-Migrationshindernisse von MyISAM nach InnoDB.

Das "macht" nichts, da MySQL einen anderen Mechanismus zur Verfügung stellt,
der mit einem einfachen AUTO_INCREMENT auskommt und dieselbe Logik
nachbildet: Die Variablen auto_increment_increment und auto_increment_offset
erlauben es, einen AUTO_INCREMENT Zähler in Sprüngen hochzuzählen und jedem
Server einen anderen Modulo-Wert zuzuteilen. Man setzt dazu
auto_increment_increment auf allen Servern auf die Anzahl der Server (oder
besser, die maximale Anzahl der Server, die man jemals haben will) und
auto_increment_offset auf den Wert, den man sonst in source eingespeichert
hätte. Man teilt also jedem Server einen anderen Startwert zu, und setzt
eine ausreichend große Schrittweite, sodaß man auch später noch Server
einfügen kann.

### Multi-Master für mehr als INSERT: 2PC

Damit löst man jedoch nur das Problem der INSERT-Statements, nicht das
Problem von UPDATE- und DELETE-Statements. Zum Beispiel ist es so, daß man
ein Paar von Servern mit `auto_increment_increment = 2` betreiben kann und ein
Server ungerade und der andere gerade IDs erzeugt. Der ungerade Server
bekommt die geraden IDs per Replikation und umgekehrt.

Natürlich kann man nun auf dem ungeraden Server und dem geraden Server
zeitgleich den Datensatz mit der `ID = 17` ändern, und zwar uneinheitlich,
d.h. auf einem Server setzt man `preis = 2` und auf dem anderen zeitgleich
`preis = 3`. Es ist nun zufällig, welcher Preis sich systemweit durchsetzt
und ob das System überhaupt auf einen einheitlichen Preis konvergiert, denn
es gibt keinen Systemweiten Mechanismus, der das kontrollieren und steuern
würde.

MySQL Cluster hat einen solchen Mechanismus, 
[2PC](http://en.wikipedia.org/wiki/Two-phase_commit_protocol), und er hat
einen hohen Preis (Latenz). Ohne einen solchen Mechanismus gibt es jedoch
keinen Multi-Master, sondern nur lose gekoppelte Server in einem Ring.

Der Ring jedoch kann ohne ein Protokoll für verteilte Transaktionen
jederzeit auseinander fallen, wenn man nicht zusätzliche Bedingungen
aufstellt, wer wann wo schreiben darf. Der Extremfall sind Mogelpackungen
wie
[MMM](http://code.google.com/p/mysql-master-master/), die sich zwar
Master-Master nennen, Schreibzugriffe zu jedem gegebenen Zeitpunkt aber nur
an einer Stelle zulassen.

### Timestamps reichen nicht aus für eine Replikations-Simulation

Der zweite häufig gemachte Fehler ist die Annahme, daß Timestamp-Werte
ausreichend sind für eine Replikations-Simulation (also um Änderungen zu
tracken). Das fällt zweimal auf die Nase: Timestamps sind extern getaktet,
so werden also so schnell hochgezählt wie die Auflösung des Timers definiert
ist. In MySQL also wird maximal eine Änderung pro Sekunde pro Row erfaßt.
Treten Änderungen schneller als das auf, ist es möglich, daß sich der Wert
eines Records ändert, aber der Timestamp nicht.

Die Abhilfe sind Versionszähler, die durch die Änderung selbst getaktet
werden. Da die Änderung auch den Versionszähler verändert, ist sie auf jeden
Fall erkennbar, egal wie schnell sie hintereinander auf derselben Row
erfolgt. Die Grenze ist hier das zum Zählen notwendige Locking, das der
Zählfrequenz eine obere Grenze setzt.

Beide Verfahren scheitern jedoch an Löschungen, da ein DELETE die Row
entfernt und damit auch der Zähler fehlt - man bekommt bei gelöschten Rows
also gar nicht mit, daß etwas zu machen ist.

Üblicherweise behilft man sich mit Scheinlöschungen, die ein deleted-Flag in
der Zeile setzen, die als gelöscht gelten soll. Das wiederum macht alle
Abfragen komplizierter, da jeder Bedingung ein WHERE deleted = 0 AND ...
zugefügt werden muß.
