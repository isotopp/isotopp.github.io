---
layout: post
published: true
title: Ein paar Gedanken zu Zeitreihendaten
author-id: isotopp
date: 2009-10-28 16:48:29 UTC
tags:
- datenbanken
- development
- mysql
- sql
- lang_de
feature-img: assets/img/background/mysql.jpg
---
Ich sitze hier auf der 
[Open Source Monitoring Conference](http://www.netways.de/osmc/y2009/programm/) 
und unterhalte mich mit ein paar Nagios bzw. Icinga Entwicklern. Dabei hörte
ich einen Haufen Flüche über NDO - Nagios Data Out. Ich schaue mir gerade
die Dokumentation zum
[NDO Schema](http://nagios.git.sourceforge.net/git/gitweb.cgi?p=nagios/ndoutils;a=blob;f=docs/NDOUtils%20Documentation.pdf;h=90c19c160e486d18b57b8fa3b085ff51731c5bbb;hb=HEAD)
an und stelle fest, daß die Ideen hier auf eine Weise viele Fehler teilen,
die auch dem MySQL Enterprise Manager Schema zugrunde liegen (Noch, das
MEM-Team bastelt das grad um).

## Ein naives Zeitreihenmodell

Beiden ist gemein, daß man Zeitreihendaten von mehreren Meßwerten sammeln
möchte. Der naive Ansatz ist die Definition einer Tabelle mit einem
Timestamp und dem Key als Primärschlüssel, etwa

```sql
CREATE TABLE messwerte (
  ts datetime not null,
  key varchar(40) charset latin1 not null,
  value integer,
  primary key (ts, key)
);
```
 

## Schlüsselkompression

Dabei wird es natürlich zu einer vielfachen Wiederholung der Werte von key
kommen - speichert man etwa die Ausgabe von SHOW GLOBAL STATUS im
Minutenabstand, dann hat man wieder und wieder die langen Namen von MySQL
Statusvariablen in der Tabelle gespeichert. Das kann man wegnormalisieren,
indem man definiert

```sql
CREATE TABLE keys (
  key_id smallint unsigned not null,
  key_name varchar(40) charset latin1 not null,
  primary key (key_id)
);

CREATE TABLE messwerte (
  ts datetime not null,
  key_id smallint unsigned not null,
  value integer,
  primary key (ts, key_id)
);
```

Auf diese Weise speichert man nicht wieder und wieder dieselben Strings in
der Tabelle ab, sondern hat die relativ langen Strings auf die 2 Byte eines
SMALLINT ohne Vorzeichen reduziert.

![](/uploads/key_compression.png)

ER-Diagramm mit Key-Compression durch eine Lookup-Tabelle.

## Data Lifecycle Management - DROP statt DELETE

In so einer Meßwertetabelle wird man ja laufend Meßwerte einfügen - und zwar
von vielen Meßstellen gleichzeitig. Zugleich sollen auch Meßwerte
ausgewertet werden. Damit sich die konkurrenten Schreibzugriffe nicht ins
Gehege kommen und damit parallel dazu auch ungestört gelesen werden kann,
muß diese Tabelle unbedingt eine InnoDB Tabelle sein - mit MyISAM zieht man
sich sonst binnen kürzester Zeit die Table Locks zu.

InnoDB speichert die Daten in einem B+-Baum ab: Ein balancierter Baum, bei
dem die Blätter des Primärschlüssels die eigentlichen Daten sind. Die Daten
werden also gemäß unserer Definition in der Reihenfolge (ts, key_id)
gespeichert: Neue Daten werden immer an rechten Rand der Tabelle eingefügt,
alte Daten stehen weiter links.

![](/uploads/loeschen_einfuegen.png)

Daten werden links gelöscht und rechts im Baum eingefügt. Dadurch muß der
B-Baum ständig neu balanciert werden, damit er nicht zu einer linearen Liste
degeneriert. Das ist eine sehr langsame Operation.

Dabei tritt ein Problem auf: Da neue Daten immer rechts angefügt werden und
alte Daten immer links gelöscht werden, bekommen wir einen Baum, der maximal
stark unbalanciert wird. Damit der B-Baum immer schön balanciert bleibt,
müssen beim Löschen der Daten also massenhaft Rebalancing-Operationen
durchgeführt werden - das involviert aber eine ganze Menge von Updates im
oberen Teil des Baumes bis hin zur Wurzel, und wühlt damit also eine große
Menge von Daten auf - noch dazu mit Random-I/O, also mit vielen Seeks.

Wenn man wie ich eine MySQL Enterprise Manager Instalallation hat, die pro
Tag 7 GB neue Daten bekommt, dann muß man auch 7 GB Daten am Tag löschen,
damit die Platten nicht überlaufen.

Die generische Lösung ist hier, entweder MySQL 5.1 Partitionen zu verwenden,
oder dasselbe manuell zu simulieren. Dazu baut man sich eine
Template-Tabelle, die man dann in bestimmten Intervallen cloned: Pro Stunde,
Tag, Woche oder Monat wird eine neue Tabelle angefangen.

```sql
CREATE TABLE messwerte_template (
  ts datetime not null,
  key_id smallint unsigned not null,
  value integer,
  primary key (ts, key_id)
);

CREATE TABLE messwerte_20091028 LIKE messwerte_template; -- usw.
```

Das hat den Vorteil, daß man alte Werte nun nicht mit einem "DELETE FROM
messwerte WHERE ts < '20090928 00:00:00'" loswerden muß, sondern elegant
"DROP TABLE messwerte_20090928" sagen darf. Dafür muß man - so man nicht
Partitionen verwendet - bei den Queries ein wenig mehr arbeiten, weil man
sich die Gesamtergebnisse aus den Tages-Tabellen zusammenstückeln muß, und
dabei tunlichst nicht UNION verwenden darf, damit es schnell ist (UNION ALL
wäre okay, wäre es nicht 
[in MySQL kaputt](http://bugs.mysql.com/bug.php?id=50674)).

![](/uploads/zeitreihe_partitioniert.png)

Schema mit Key-Kompression und Tagestabellen. Löschung von Daten kann pro
Tag durch ein DROP TABLE erfolgen.

UNION ist deswegen nicht so toll, weil dies nach Definition Duplikate
eliminieren muß, und dazu fügt MySQL intern die einzelnen Teiltabellen zu
einer temporären Tabelle zusammen, sortiert diese, killt die Doubletten und
schmeißt die temporäre Tabelle weg, nachdem es uns das Resultat gesendet
hat. Leider ist die nächste Anfrage danach gleich wieder mit UNION, und der
Zirkus geht von vorne los. UNION ALL hätte dieses Problem nicht 
([jedoch](http://bugs.mysql.com/bug.php?id=50674)) - es darf uns nach
Definition fröhlich Duplikate senden und braucht daher diesen
Verarbeitungsschritt nicht.

## Locality Of Reference

Das nächste Problem ergibt sich nun aus der Tatsache, daß alle Meßwerte aus
einer Messung in derselben Tabelle gespeichert werden. Eine Tabelle besteht
in InnoDB ja aus Blöcken von 16KB, die jeweils am Stück geladen und
gespeichert werden. In unserer Tabelle stehen nun Tripel (ts, key_id,
value), wobei so knapp an die 300 verschiedene key_id und value pro ts
gespeichert werden, wenn wir z.B. einmal pro Minute den Output von SHOW
GLOBAL STATUS aufzeichnen. Eine Zeile (datetime, smallint, integer) ist
8+2+4 = 14 Byte plus Overhead (6+8 = 14) breit, d.h. wir bekommen etwa zwei
Messungen in einen 16KB Block hinein.

Wenn wir nun aus diesen Meßwerten einen Graph zeichnen wollen, dann brauchen
wir z.B. für einen InnoDB-Graph ca. 4 Meßwerte pro Messung. Wir laden also
16 KB, nutzen 8*4 = 32 Byte davon, schmeißen den Rest weg, laden die
nächsten 16 KB und so weiter. Es wird klar, daß wir die Daten zwar in großen
breiten Zeilen erfassen, diese aber in der Regel nicht so brauchen.

Es ist also lohnend, sich Gedanken über die Bedeutung der Meßwerte zu machen
und sie in etwa so zu gruppieren, daß wenigstens alle com-Counter in einer
Tabelle, alle InnoDB-Meßwerte in einer anderen Tabelle stehen und so weiter.
Dadurch würde beim Zeichnen des InnoDB-Graphen nicht auf eine Tabelle mit
8KB langen Rows zugegriffen werden, sondern vielleicht auf eine Tabelle mit
200 Byte langen Rows, und wir würden immerhin 32 Byte von 200 Byte nutzen,
oder pro Block nicht zwei, sondern ca. 80 Meßwerte auf einen Schlag laden.
Für einen 640 Pixel breiten Graphen würden wir also nicht mehr 320 16KB
Blöcke laden müssen, sondern nur noch 8.

Wenn man begriffen hat, daß Locality of Reference und komplettes Data
Lifecycle Management wesentlich sind, wenn man von Zeitreihen sinnvolle
Performance will, und sein Datenmodell danach baut, dann kann man langsam
einmal anfangen, sich über weitergehende Dinge Gedanken zu machen (etwa:
Aggregation - wie viele Meßwerte brauche ich denn, um Pixel sinnvoll zu
schwärzen). Aber das ist eine Diskussion für ein anderes Mal.
