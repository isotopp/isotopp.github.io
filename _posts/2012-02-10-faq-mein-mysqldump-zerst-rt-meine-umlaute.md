---
layout: post
published: true
title: 'FAQ: Mein mysqldump zerstört meine Umlaute'
author-id: isotopp
date: 2012-02-10 11:50:22 UTC
tags:
- character set
- mysql
- umlaut
- lang_de
feature-img: assets/img/background/mysql.jpg
---
In den letzten Tagen habe ich das mehrmals erklären müssen, daher jetzt
einmal im Blog, damit ich das verlinken kann.  Dieser Artikel ist, anders
als der Rest des Blogs, 
[CC-BY-SA](http://creativecommons.org/licenses/by-sa/3.0/us/).

Der Fragesteller: 

> Ich habe Daten in meiner Datenbank, die ich erfolgreich mit meiner
> Anwendung einlesen und wieder auslesen kann.  Wenn ich jedoch einen
> `mysqldump` mache, um die Daten auf ein neues System zu portieren, bekomme
> ich zerstörte Umlaute.

Das Problem tritt auf, wenn man Daten in der Datenbank mit dem falschen
Zeichensatz-Label speichert.

In MySQL klebt an jedem String ein Label, der den Zeichensatz angibt, in dem
der String geschrieben worden ist.  Der String _latin1"Köhntopp" ist also
hoffentlich die Zeichenfolge "K-0xF6-hntopp", und der String _utf8"Köhntopp"
entsprechend die Zeichenfolge "K-0xC3 0xB6-hntopp".  Probleme treten auf,
wenn das Label ("_latin1" oder "_utf8") und die Datencodierung von Umlauten
(0xF6 vs.  0xC3 0xB6) nicht übereinstimmen.

Zum besseren Verständnis gibt es die Artikel 
[Zeichensatzärger]({% link _posts/2006-08-06-zeichensatz-rger.md %})
und 
[MySQL Zeichensatz Grundlagen]({% link _posts/2006-10-01-mysql-zeichensatz-grundlagen.md %})
hier im Blog.

## Wie man den Fehler erzeugt

Wir definieren eine Tabelle mit einer VARCHAR-Spalte, an der ein
Zeichensatz-Label 'latin1' klebt.

```sql
mysql> create table t ( 
-> id integer unsigned not null primary key, 
-> f varchar(20) charset latin1 
-> ) engine = innodb;
Query OK, 0 rows affected (0.25 sec)
```


Wir definieren die Verbindung zur Datenbank auch als latin1.  Der
Zeichensatz der Spalte t.f und das Zeichensatzlabel der Connection stimmen
also überein.

```sql
mysql> set names latin1;
Query OK, 0 rows affected (0.00 sec)
```


Wir senden nun Daten mit UTF8-codierung über eine Connection, die das Label
latin1 trägt.  Wir lügen die Datenbank also an:

```sql
mysql> select hex('Köhntopp') as umlaut;
+--------------------+
| umlaut             |
+--------------------+
| 4BC3B6686E746F7070 |
+--------------------+
1 row in set (0.00 sec)

mysql> insert into t values ( 1, 'Köhntopp');
Query OK, 1 row affected (0.00 sec)
```

Die Daten sind also real in utf8 codiert, werden aber über eine Verbindung
übertragen, die das Label latin1 hat.  Die Spalte t.f hat ebenfalls die
Codierung latin1.  Es ist also keine Konvertierung notwendig und MySQL nimmt
auch keine vor.  Die Daten werden 1:1 so gespeichert, wie wir sie senden.

Lesen wir die Daten aus, gelingt das auch: Die Daten der Spalte t.f werden
gelesen.  Sie liegen in latin1 vor.  Die Verbindung, über die wir die Daten
lesen, ist ebenfalls latin1.  Die Daten werden also 1:1 ausgelesen und in
unserem utf8-Terminal korrekt angezeigt:

```sql
mysql> select f, hex(f) from t where id =1;
+-----------+--------------------+
| f         | hex(f)             |
+-----------+--------------------+
| Köhntopp | 4BC3B6686E746F7070 |
+-----------+--------------------+
1 row in set (0.00 sec)
```

Man sieht in der Ausgabe links einen korrekten Umlaut - das Terminal des Mac
steht aber auf utf8.  Man sieht rechts die Bytes vor jeder
Ausgabekonvertierung auf der Platte - 0xc3 0xb6 sind ein utf8 o-Umlaut.

Und jetzt der Dump:

```sql
...
/*!40101 SET NAMES utf8 */;
...

DROP TABLE IF EXISTS `t`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t` (
  `id` int(10) unsigned NOT NULL,
  `f` varchar(20) CHARACTER SET latin1 DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t`
--

LOCK TABLES `t` WRITE;
/*!40000 ALTER TABLE `t` DISABLE KEYS */;
INSERT INTO `t` VALUES (1,'KÃ¶hntopp');
/*!40000 ALTER TABLE `t` ENABLE KEYS */;
UNLOCK TABLES;
```


Wir sehen, daß mysqldump die Verbindung auf utf8 setzt.  Das tut es immer,
egal in welchem Format die Daten auf der Platte vorliegen.  Das ist auch
kein Problem: Der im Dump verwendete Zeichensatz ist ein Superset aller
anderen verfügbaren Zeichensätze und kann alle Stringdaten in der Datenbank
darstellen, egal in welchem Format sie auf der Platte vorliegen.

Die mit latin1 belabelten Daten aus t.f werden nun also bei der Ausgabe von
latin1 nach utf8 gewandelt.  Sie sind aber real schon utf8, d.h.  wir
wandeln real utf8-Daten noch einmal nach utf8.  Das Resultat kann man im
Dump sehen: 'KÃ¶hntopp' - doppelt codiertes utf8.

Es ist zu beachten: MySQL macht hier alles richtig.  Das Problem ist, daß in
einer latin1-Spalte als utf8 codierte Daten abgespeichert worden sind, weil
in einer mit "SET NAMES latin1" konfigurierten Verbindung utf8-Daten
gesendet wurden.  Wir haben den Server angelogen und bekommen unsere
gerechte Strafe.

Das Problem ist auf zwei Arten lösbar:

## Lösung im Dump

Die haarsträubende Kommandozeile 

```sql
server:~ # mysqldump --default-character-set latin1 kris t | sed -e 's/SET NAMES latin1/SET NAMES utf8/'
```

erzeugt einen Dump, bei dem die Verbindung auf 'SET NAMES latin1'
eingestellt wird - die Daten werden also genau wie in der Anwendung ohne
jede Konvertierung ausgelesen.

Allerdings steht im Dump dann immer noch, daß sie in latin1 codiert wären. 
Das ist immer noch falsch - die Daten sind korrekt in utf8 gespeichert.  Die
sed-Anweisung korrigiert das, indem sie alle Vorkommen von latin1 in utf8
ändert - Label und Inhalt stimmen nun überein.

In der neuen Datenbank werden die Daten jetzt also korrekt eingelesen.  In
der neuen Datenbank muß man nun noch dafür sorgen, daß die Anwendung dort
korrekt 'SET NAMES utf8' setzt, wenn sie denn utf8 verwendet.

## Lösung in der Quelldatenbank

Wie im 
[Handbuch](http://dev.mysql.com/doc/refman/5.5/en/alter-table.html)
beschrieben, kann man: 

> **Warning**
>
> The CONVERT TO operation converts column values between the character
> sets.  This is not what you want if you have a column in one character set
> (like latin1) but the stored values actually use some other, incompatible
> character set (like utf8).  In this case, you have to do the following for
> each such column:
> 
> `ALTER TABLE t1 CHANGE c1 c1 BLOB;`
> 
> `ALTER TABLE t1 CHANGE c1 c1 TEXT CHARACTER SET utf8;`
>
> The reason this works is that there is no conversion when you convert to or from BLOB
> columns.

Wir machen das also:

```sql
mysql> show create table t\G
       Table: t
Create Table: CREATE TABLE `t` (
  `id` int(10) unsigned NOT NULL,
  `f` varchar(20) CHARACTER SET latin1 DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci
1 row in set (0.00 sec)
```

In der alten Tabelle ist die Spalte f als latin1 definiert, enthält aber
utf8-Daten.

```sql
mysql> alter table t modify column f varbinary(20);
Query OK, 1 row affected (0.63 sec)
Records: 1  Duplicates: 0  Warnings: 0

mysql> alter table t modify column f varchar(20) charset utf8;
Query OK, 1 row affected (0.62 sec)
Records: 1  Duplicates: 0  Warnings: 0
```

Wir wandeln f in ein VARBINARY um - das ist ein VARCHAR ohne
Zeichensatzlabel, also ein Binärklumpen.  Die Daten in f bleiben erhalten,
sind nun aber kein String mehr, sondern eine bedeutungslose Bitfolge, die
keinem Zeichensatz angehört.

Wir wandeln f dann wieder in einen Zeichensatz um, in diesem Fall
VARCHAR(20) CHARSET utf8, also der korrekte Zeichensatz.

Wir machen das in zwei Schritten, damit die Datenbank die Assoziation
zwischen unseren Bits und Zeichensätzen vergißt.  Würden wir direkt von
VARCHAR(20) CHARSET latin1 nach VARCHAR(20) CHARSET utf8 umwandeln, würde
die Datenbank uns hilfreicherweise auch die Daten konvertierten.  Das ist im
Normalfall das, was man will, denn die Datenbank sorgt so dafür, daß heile
Daten auch heil bleiben.

In unserem Fall ist es genau nicht das, was wir wollen, denn wir haben ja
kaputte Daten, die wir heil machen wollen.

Das Resultat: 

```sql
mysql> show create table t\G
       Table: t
Create Table: CREATE TABLE `t` (
  `id` int(10) unsigned NOT NULL,
  `f` varchar(20) CHARACTER SET utf8 DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci
1 row in set (0.00 sec)

mysql> select f, hex(f) from t;
+-----------+--------------------+
| f         | hex(f)             |
+-----------+--------------------+
| Köhntopp | 4BC3B6686E746F7070 |
+-----------+--------------------+
1 row in set (0.00 sec)
```

Wir speichern nun utf8 Daten in einer utf8-Spalte.  Damit stimmen
Spalten-Label und Spalten-Daten überein und die Mechanismen der Datenbank
arbeiten für uns, nicht gegen uns.

## Wie man den Fehler in Zukunft vermeidet

Lüge die Datenbank nicht an.  Wenn Du SET NAMES latin1 eingestellt hast,
sende latin1.  Wenn Du SET NAMES utf8 eingestellt hast, sende utf8.  Die
Datenbank konvertiert Dir Deine Daten dann immer korrekt, egal welche
Zeichensätze Deine Spalten haben oder ob Du latin1 und utf8-Anwendungen
mischt.
