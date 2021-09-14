---
layout: post
published: true
title: 'MySQL: Zeichensatz-Grundlagen'
author-id: isotopp
date: 2006-10-01 14:28:00 UTC
tags:
- mysql
- lang_de
feature-img: assets/img/background/mysql.jpg
---
Markus fragt:

> Durch  ... wechseln wir gerade unseren Root-Server. Dort habe ich bereits
> das Gentoo-Basissystem am fluppen. Bei der Umstellung möchte ich gleich
> von MySQL 4 auf 5 wechseln.Dabei stellt sich die Frage, ob ich das System
> nicht gleich von latin1 auf utf-8 umstellen soll. Sollte ich lieber bei
> latin1 bleiben und alles so migrieren oder doch den großen Wurf zu utf-8
> wagen?

Die Frage habe ich ihm schon beantwortet, aber versprochen, das Thema noch
einmal im Blog "in groß" durchzudeklinieren. Hier also der
[Zeichensatz-Artikel]({% link _posts/2006-08-06-zeichensatz-rger.md %})
redone.



### Zeichensatztheorie


![](/uploads/charset.png)

Zusammenhänge zwischen den Begriffen.

Ein Zeichensatz ("CHARACTER SET") ist eigentlich ein Symbolvorrat, also eine
Liste von Symbolen, die in einer bestimmten Sammlung enthalten sind. Ein
Zeichensatz ist damit ein ganz und gar abstraktes und nahezu nutzloses Ding.
Das einzige, was man mit einem Zeichensatz alleine tun kann, ist zu
entscheiden, ob ein bestimmtes Symbol in einem bestimmten Kontext erlaubt
ist oder nicht.

Damit die Symbole druckbar werden, benötigt man einen Font. So ist zum
Beispiel dies hier "<span style="font-family : Arial; font-size : 24px;
font-weight : normal;">ö</span>" ein LOWER CASE O-UMLAUT in Arial und "<span
style="font-family : 'Times New Roman'; font-size : 24px; font-style :
normal;">ö</span>" dasselbe Symbol in einem anderen Font, Times New Roman.

Damit Symbole von Computern verarbeitbar werden, benötigen sie eine binäre
Repräsentation, ein Encoding. In meinem Terminal, konsole, wird
standardmäßig das utf8-Encoding verwendet. Der Text "Köhntopp" wird dabei
durch die Hex-Folge "4b c3 b6 68 6e 74 6f 70 70" repräsentiert, das LOWER
CASE o-UMLAUT wird als C3 B6 codiert.


```console
kris@linux:~> od -t x1a
Köhntopp
0000000 4b c3 b6 68 6e 74 6f 70 70 0a
          K   C   6   h   n   t   o   p   p  nl
0000012
```


Nach dem Aufruf von Settings->Encoding->Iso-8859-1 hat sich das Encoding
geändert und derselbe Text wird jetzt durch die Bytes "4b f6 68 6e 74 6f 70
70 0a" repräsentiert. Der LOWER CASE o-UMLAUTE ist nun also ein F6-Byte.

```console
kris@linux:~> od -t x1a
Köhntopp
0000000 4b f6 68 6e 74 6f 70 70 0a
          K   v   h   n   t   o   p   p  nl
0000011
```


Wenn man zwei Zeichenfolgen vergleichen oder ordnen (sortieren) will, dann
braucht man eine zu dem Encoding passende Collation. Eine Collation kann man
sich als eine normierte Codierung eines Encodings vorstellen, das für
Vergleichs- und Sortierzwecke verwendet wird.

Die MySQL-Collation latin1_german1_ci erzeugt aus "Köhntopp" zum Beispiel
"kohntopp" und verwendet diesen String dann, um ihn mit anderen Strings zu
vergleichen und zu sortieren. Abgespeichert wird allerdings immer der
Originalwert, also "Köhntopp". Eine andere Collation, latin1_german2_ci,
würde den Text "Köhntopp" stattdessen intern in "koehntopp" umwandeln, bevor
verglichen und sortiert wird (aber ebenso "Köhntopp" abspeichern).

### Zeichensätze im Server

Aus irgendeinem Grund nennt MySQL ein Encoding einen CHARACTER SET oder
CHARSET. Die im Server verfügbaren Encodings können mit SHOW CHARSET
aufgelistet werden. Sie sind auch in INFORMATION_SCHEMA.CHARACTER_SETS
verfügbar. In beiden Fällen gibt die Spalte "Maxlen" an, wieviele Bytes ein
Zeichen in diesem Zeichensatz maximal verbrauchen kann.

Die Liste der vom Server unterstützten Collations kann man mit SHOW
COLLATION anzeigen. Sie ist auch als INFORMATION_SCHEMA.COLLATIONS abrufbar.
Eine Collation ist nur im Zusammenhang mit einem Encoding sinnvoll, daher
muß diese Tabelle mit der INFORMATION_SCHEMA.CHARACTER_SETS über die n:m
Beziehung INFORMATION_SCHEMA. COLLATION_CHARACTER_SET_APPLICABILITY
verknüpft werden (oder man verwendet SHOW COLLATION LIKE '...%').

### Encoding und Collation festlegen

Jeder String in MySQL ist mit einem Encoding und einer Collation markiert.
Für Datenbankobjekte geschieht dies auf der Spaltenebene: Eine Spalte mit
CHAR, VARCHAR oder einem TEXT-Typ ist immer auch mit einem CHARSET und einer
COLLATION versehen.

Gibt man diese nicht ausdrücklich an, so wird der CHARSET und die COLLATION
der Tabelle, in der diese Spalte enthalten ist, nach unten vererbt. Und
natürlich erbt die Tabelle CHARSET und COLLATION von der DATABASE, die diese
wiederum von den Server Defaults vererbt.

Man kann also in der my.cnf festlegen:

```console
[mysqld]
default-character-set=latin1
default-collation=latin1_german1_ci
```

Man kann auch beim Anlegen eines Schemas (einer logischen Datenbank)
festlegen:

```sql
root@localhost [(none)]> create database kris charset latin1 collate latin1_german1_ci;
Query OK, 1 row affected (0.00 sec)

root@localhost [(none)]> show create database kris\G
       Database: kris
Create Database: CREATE DATABASE `kris`
   /*!40100 DEFAULT CHARACTER SET latin1 
    COLLATE latin1_german1_ci */
1 row in set (0.00 sec)
```


Für eine Tabelle und deren Spalten kann man bestimmen:

```sql
root@localhost [kris]> create table t (
  id integer unsigned not null auto_increment primary key, 
  c char(20) charset utf8 collate utf8_general_ci, 
  d varchar(20) charset cp850 collate cp850_general_ci, 
  t text charset latin1 collate latin1_german1_ci 
) charset latin1 collate latin1_general_ci;
Query OK, 0 rows affected (0.01 sec)

root@localhost [kris]> show create table t\G
       Table: t
Create Table: CREATE TABLE `t` (
  `id` int(10) unsigned NOT NULL auto_increment,
  `c` char(20) character set utf8 default NULL,
  `d` varchar(20) character set cp850 default NULL,
  `t` text character set latin1 collate latin1_german1_ci,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM 
DEFAULT CHARSET=latin1 
COLLATE=latin1_general_ci
1 row in set (0.00 sec)
```


Die Verbindung, die der Client zur Datenbank aufbaut, muß ebenfalls mit
einem Encoding und einer Collation getagged sein, denn wenn man
beispielsweise ein LOWER CASE o-UMLAUT von einem utf8-Terminal in kirs.t.t
einfügen will, dann muß dieses Symbol ja von utf8 (C3B6) nach latin1 (F6)
gewandelt werden.

Man kann default-character-set und default-encoding in der [mysql]-Sektion
seiner my.cnf festlegen, oder sie mit SET NAMES später umstellen.

Indem ich in konsole Settings->Encoding->utf8 einstelle und dann SET NAMES
utf8 im Kommandozeilenclient von MySQL mache, sende ich nicht nur utf8,
sondern habe den Client auch über diese Tatsache informiert.

```sql
root@localhost [kris]> set names utf8;
Query OK, 0 rows affected (0.00 sec)

root@localhost [kris]> select hex("ö");
+-----------+
| hex("ö") |
+-----------+
| C3B6      |
+-----------+
1 row in set (0.00 sec)
```


Stelle ich in konsole Settings->Encoding->latin1 ein und sende SET NAMES
latin1, dann bekomme ich:

```sql
root@localhost [kris]> set names latin1;
Query OK, 0 rows affected (0.00 sec)

root@localhost [kris]> select hex("ö");
+----------+
| hex("ö") |
+----------+
| F6       |
+----------+
1 row in set (0.00 sec)
```


Warum ist das wichtig und nützlich? Nun, wenn ich mit meinem utf8-Client an
die Datenbank gehe und Daten nach kris.t.t speichere, was wird dann
geschehen?


```sql
root@localhost [kris]> set names utf8;
Query OK, 0 rows affected (0.00 sec)

root@localhost [kris]> select hex("ö");
+-----------+
| hex("ö") |
+-----------+
| C3B6      |
+-----------+
1 row in set (0.00 sec)

root@localhost [kris]> insert into kris.t (t) values ("ö");
Query OK, 1 row affected (0.00 sec)

root@localhost [kris]> select hex(t), t from kris.t;
+--------+------+
| hex(t) | t    |
+--------+------+
| F6     | ö    |
+--------+------+
1 row in set (0.00 sec)
```

Ich habe also einen Client, der utf8 spricht und sendet. Das kann ich
kontrollieren ("set names utf8") und beweisen (Ich bekomme ein C3B6).
Speichere ich dieses utf8-codierte Symbol in eine Spalte, die als
latin1-codiert markiert ist, wird MySQL das Encoding des Symbols anpassen
und den richtigen Code (F6) speichern. Ich kann das beweisen, indem ich
hex(spaltenname) und spaltenname aus der Tabelle selektiere: Es wurde
tatsächlich ein LOWER CASE o-UMLAUT in latin1 encoding gespeichert, und
obwohl das so gespeichert wurde, wird mir ein ö in meinem utf8-Terminal
angezeigt - der Wert wurde also für meine Verbindung auch wieder zurück
gewandelt!

### Einen Dump laden

Wenn man einen alten MySQL 4.0 mysqldump hat, dann sind in diesem Datenbank-
und Tabellendefinitionen ohne Zeichensatzangaben enthalten. Man muß in
diesem Fall vor dem Import in einen neueren Server die Defaults korrekt
setzen. Korrekt bedeutet hier: So, daß die Datenbanken und Tabellen mit den
Character Sets und Collations anlegegt werden, die man haben will. Am
einfachsten erreicht man das, indem man das CREATE DATABASE-Statement im
Dump sucht und passend editiert. Diese Defaults werden dann ja auf alle
anderen Objekte herunter vererbt.

Die Connection, mit der der Dump eingelesen wird, muß außerdem mit der
passenden Character Set-Information versehen werden. Dazu bestimmt man den
Character Set im Dumpfile, indem man dieses durch "od -t x1a" filtert und
mal nach einigen Umlauten sucht. Welcher Zeichensatz wird im Dumpfile
verwendet?

Dieser Zeichensatz muß dann für das Einlesen des Dumps verwendet werden. Am
einfachsten fügt man ein passendes SET NAMES-Statement in das Dumpfile ein.

```sql
--
-- Table structure for table `t`
--

DROP TABLE IF EXISTS `t`;
CREATE TABLE `t` (
  `id` int(10) unsigned NOT NULL,
  `c` char(20) default NULL,
  `d` varchar(20) default NULL,
  `t` text,
  PRIMARY KEY  (`id`)
) TYPE=MyISAM;

--
-- Dumping data for table `t`
--


/*!40000 ALTER TABLE `t` DISABLE KEYS */;
LOCK TABLES `t` WRITE;
INSERT INTO `t` VALUES (1,NULL,NULL,'ö');
UNLOCK TABLES;
/*!40000 ALTER TABLE `t` ENABLE KEYS */;
...
linux:/export/data/charset # od -t x1a kris.sql
...
0001560 53 20 28 31 2c 4e 55 4c 4c 2c 4e 55 4c 4c 2c 27
          S  sp   (   1   ,   N   U   L   L   ,   N   U   L   L   ,   '
0001600 f6 27 29 3b 0a 55 4e 4c 4f 43 4b 20 54 41 42 4c
          v   '   )   ;  nl   U   N   L   O   C   K  sp   T   A   B   L
...

```


Wir können nun leicht dieses Dumpfile um ein "CREATE DATABASE kris CHARSET
utf8 COLLATE utf8_general_ci" ergänzen und ein "SET NAMES latin1" zufügen.
Dadurch bekommen wir eine Datenbank kris, die Zeichen in utf8 speichert. Da
die Verbindung auf latin1 gesetzt wird, wird beim Einlesen der korrekte
Zeichensatz für den Dump verwendet und alle Daten werden beim Lesen und
Speichern von latin1 nach utf8 gewandelt. Für die Clients, die die Daten
später verwenden, ist dies irrelevant: Sie legen mit SET NAMES fest, in
welchem Zeichensatz sie die Ergebnisse bekommen wollen und MySQL wird die
Zeichen bei der Ausgabe entsprechend den Wünschen der Clients umwandeln.

### Selber wandeln

Eine Stringkonstante kann in MySQL mit einem Encoding prefixed werden.

```sql
root@localhost [kris]> select _utf8'Köhntopp';
+-----------+
| Köhntopp |
+-----------+
| Köhntopp  |
+-----------+
1 row in set (0.00 sec)
```

Dies ist dasselbe wie "SELECT 'Köhntopp'", nur daß der Zeichensatz
ausdrücklich an den Ausdruck geklebt wird und nun vom SET NAMES verschieden
sein kann.

Wir können auch Daten in andere Zeichensätze umwandeln:

```sql
root@localhost [kris]> select hex(convert('Köhntopp' using latin1)) as Beispiel;
+------------------+
| Beispiel         |
+------------------+
| 4BF6686E746F7070 |
+------------------+
1 row in set (0.03 sec)
```

Hier ist mein utf8-Köhntopp aus der Connection in ein latin1-Köhntopp mit
F6-Umlaut umgewandelt worden.

### Die Kosten von utf8

Unicode ist ein Zeichensatz mit mehr als 256 Zeichen und utf8 ist ein
Multibyte-Encoding für diesen Zeichensatz, in dem Zeichen eine variable
Länge haben können. Einige Symbole ("a", "Z") werden als einzelne Bytes
codiert, andere ("ö") als Folgen von Bytes. Der Subset von Unicode, der von
MySQL unterstützt wird, kann bis zu 3 Byte für ein Zeichen verbrauchen.
Daher wird der Zeichensatz mit einer Maxlen von 3 in "SHOW CHARSET"
markiert.

Ein anderes Encoding von Unicode ist ucs2: Während utf8 von Unix und Java
verwendet wird, wird ucs2 von Windows-Systemen bevorzugt. ucs2 codiert alle
Unicode-Zeichen gleich lang, und verwendet für den Subset von Unicode, der
hier unterstützt wird, immer 2 Bytes. Die angezeigte Maxlen ist also 2.

Hier alle drei Encodings im Vergleich:

```sql
root@localhost [kris]> select hex(convert("Köhntopp" using ucs2)) as x;
+--------------------------------------+
| x |
+--------------------------------------+
| 004B00F60068006E0074006F00700070     |
+--------------------------------------+
1 row in set (0.00 sec)

root@localhost [kris]> select hex(convert("Köhntopp" using latin1)) as x;
+----------------------------------------+
| x |
+----------------------------------------+
| 4BF6686E746F7070                       |
+----------------------------------------+
1 row in set (0.00 sec)

root@localhost [kris]> select hex("Köhntopp") as x;
+--------------------+
| x  |
+--------------------+
| 4BC3B6686E746F7070 |
+--------------------+
1 row in set (0.00 sec)
```


In MySQL wird ein CHAR(20) definiert als ein String von Zeichen Zeichen. Ein
Zeichen kann mehr als ein Byte haben, also werden maxlen * Stringlänge Bytes
Platz verbraucht. Ein utf8-CHAR(20) braucht also 60 Byte.

Ein VARCHAR(20) ist ein String mit einer Längenkennung und dann so vielen
Bytes Speicher, wie der String tatsächlich lang ist. Ein utf8-VARCHAR(20)
kann also zwischen 1 und 60 Byte Speicher plus die Längenkennung (1 Byte,
ggf. 2 Bytes) verbrauchen.

Indexrecords in MyISAM haben jedoch eine feste Länge. Ein Index auch ein
utf8-VARCHAR(20) belegt also immer 60 Byte plus die Länge für den Row
Pointer (per Default 6 Byte pro zu bezeigendem Record).

Außerdem ist die Anzahl der Bytes, nicht Zeichen in einem Index limitiert:
Generell kann ein Index bis zu 1024 Bytes, in InnoDB sogar nur 767 Bytes
enthalten. In utf8 wird dies also zu 343 bzw. zu 255 Zeichen.

Die Empfehlung lautet also: 

- Definiere den Server, das Schema und
  jede Tabelle immer mit einem passenden Einbyte-Zeichensatz, z.B. latin1.
- Definiere dann die Connection mit welchem Zeichensatz auch immer. Das kann
  auch utf8 sein, obwohl das Schema latin1 verwendet.
- Definiere alle Spalten, die einen anderen als den latin1-Zeichensatz
  benötigen, wenn möglich mit dem passenden Einbyte-Zeichensatz der Sprache - 
  türkische Spalten also als latin5 und russische Spalten als latin2.
- Definiere Spalten, die wirklich mehrsprachig sind, und nur diese, als
  utf8. Beachte den Mehrverbrauch an Speicher für Indices und CHAR.
