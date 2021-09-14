---
layout: post
published: true
title: Zeichensatzärger
author-id: isotopp
date: 2006-08-06 19:22:14 UTC
tags:
- mysql
- lang_de
feature-img: assets/img/background/mysql.jpg
---
![](/uploads/font.jpg)

Choose any font you like

Seit MySQL 4.1 existiert in MySQL Support für Zeichensätze und
Sortierreihenfolgen. Das bedeutet im Wesentlichen, daß an jedem CHAR,
VARCHAR und TEXT in der Datenbank und an jeder Stringkonstante dranklebt, in
welcher Codierung der String vorliegt und mit welcher Sortierreihenfolge der
String beim Sortieren und Vergleichen zu behandeln ist.

### Vokabeln

Aber zuerst einmal ein bischen Vokabular:

Ein **Zeichensatz** ist eine Sammlung von Symbolen, die verwendet werden
dürfen. Zeichen in einem Zeichensatz haben Namen wie "Copyright Symbol" oder
"Lowercase O-Umlaut".

Eine **Codierung** ist eine Definition, in welcher Bytefolge ein Symbol zu
codieren ist. In Latin1-Codierung zum Beispiel ist ein Lowercase O-Umlaut
Symbol als 0xF6 codiert, während es in UTF8 als 0xC3B6 codiert wird. In
MySQL wird eine Codierung fälschlicherweise als Charset bezeichnet.

Ein **Font** ist eine Definition, wie ein bestimmtes Symbol auszusehen hat.
Ein Lowercase O-Umlaut kann zum Beispiel als <span style="font-family:
helvetica">ö</span> oder als <span style="font-family: times new
roman">ö</span> dargestellt werden.

Eine **Collation** definiert eine Vergleichsfunktion für einen Zeichensatz.
Eine binäre Collation definiert die Vergleichsfunktion für zwei Zeichen über
die Binärwerte ihrer Codierung, sortiert die Umlaute und andere
Sonderzeichen also ziemlich durcheinander und recht willkürlich weit
oberhalb der normalen Zeichen. Die Default-Collations für alle Zeichensätze
in MySQL sind "CI" (case-insensitive) - das ist ungewöhnlich für SQL und
unterscheidet MySQL von fast allen anderen SQL-Produkten. Zum Glück ist das
nur ein Default und kann leicht geändert werden.

### Zeichensätze, Collations und Bytelängen

Um einen Überblick zu bekommen, welche Zeichensätze und Codierungen vom
Server unterstützt werden, kann man das Kommando SHOW CHARSET verwenden. Es
listet für jeden Zeichensatz den Namen, eine kurze Beschreibung, die mit dem
Zeichensatz assoziierte Standard-Collation und die Bytelänge des
Zeichensatzes auf.

Die Bytelänge des Zeichensatzes kommt zum Tragen, wenn man eine Spalte vom
Typ CHAR definiert: Der tatsächliche Speicherplatz eines CHAR(20) ist also
20 mal die Bytelänge des Zeichensatzes: Ein Latin1-CHAR(20) belegt also 20
Byte, ein UTF8-CHAR(20) belegt 60 Byte.

Die Bytelänge des Zeichensatzes kommt auch zum Tragen bei Indices: Während
ein UTF8-VARCHAR(20) also zwischen 2 und 61 Byte belegen kann (ein
Längenbyte plus die tatsächliche Länge des Strings) und normale
ASCII-Zeichen in UTF8 nur ein Byte belegen, werden in Index-Records auf
UTF8-Spalten Bytes wie in CHAR-Spalten belegt. Ein Index auf eine
UTF88-VARCHAR(20) Spalte belegt also 60 Byte plus Row Pointer (6 Byte in
MyISAM per Default) pro Zeile in der Tabelle.

Zeichensätze und Collations werden per Spalte festgelegt - man kann auf
Serverebene, auf Schema (Datenbank) -Ebene und auf Tabellenebene Defaults
festlegen, die nach unten weitervererbt werden, aber zum Tragen kommen die
Definitionen nur an tatsächlichen Spalten. Es ist also nützlich, den Server,
Datenbanken und Tabellen immer mit Latin1 oder einem anderen
Einbyte-Zeichensatz zu definieren und nur für die Spalten, die tatsächlich
UTF8 benötigen die platzfressende UTF8-Codierung zu verlangen.

Collations (Sortierreihenfolgen) sind an einen Zeichensatz gebunden. Es ist
also nicht möglich, eine Collation latin1_german1_ci im Zusammenhang mit
einem UTF8-Zeichensatz zu verwenden. Das Kommando SHOW COLLATION listet die
verfügbaren Collations auf. Da das sehr viele Collations sind, verwendet man
sinnvollerweise den Zeichensatz als Einschränkung: SHOW COLLATION LIKE
"latin1%" listet also die mit der Codierung latin1 kompatiblen Collations
auf.

Eine Collation hat eine Sortlen. Collations mit einer Sortlen von 0 sind
nicht im Server compiliert, sondern mit einer externen Lookup-Table
definiert. Sie können geändert oder sogar neu definiert werden ohne daß man
den Server neu compilieren muß. Ich habe
[an anderer Stelle](http://mysqldump.azundris.com/archives/50-latin1_german1_cs.html)
ein Beispiel dafür gegeben.

### Zeichensatz der Connection

Wenn man mit dem Server redet, gibt es eine Reihe von Variablen, die
festlegen, in welchem Zeichensatz (und mit welcher Collation) der Server
arbeitet, wenn man mit ihm redet. Das Kommando SHOW VARIABLES LIKE
"character\_set\_%" listet diese Variablen und ihre Werte auf.

Wenn man den MySQL-Kommandozeilenclient verwendet, um ein Statement zu
erstellen, dann kann man dort Umlaute als Teil des Statements eingeben -
möglicherweise sind sie auch Bestandteil eines SQL-Scriptes, das in den
Client eingelesen werden soll. Es ist erst einmal wichtig herauszufinden,
welche Codierung der Client denn überhaupt verwendet.

Dazu kann man ein Statement wie

```console
linux:~ # od -t x1a
ö
0000000 c3 b6 0a
          C   6  nl
linux:~ # mysql
...
root@localhost [(none)]> select hex("ö");
+-----------+
| hex("ö") |
+-----------+
| C3B6      |
+-----------+
1 row in set (0.00 sec)
```

verwenden. Dieser Client verwendet offensichtlich einen Mehrbyte-Zeichensatz -
hier UTF8 - um Umlaute zu codieren. In meinem Fall - ich verwende KDE
konsole - kann ich das leicht ändern: Indem ich in Settings -> Encoding auf
latin1 umstelle, bekomme ich

```sql
linux:~ # od -t x1a
ö
0000000 f6 0a
          v  nl
linux:~ # mysql-3340
...
root@localhost [(none)]> select hex("ö");
+----------+
| hex("ö") |
+----------+
| F6       |
+----------+
1 row in set (0.00 sec)
```

Ich muß dem Server jetzt mitteilen, in welchem Zeichensatz meine Statements
sein werden: Die Variable character_set_client legt dies fest. Der Server
muß außerdem wissen, in welchem Zeichensatz meine Stringkonstanten sind:
Dies legt character_set_connection fest - wenn dies nicht ausdrücklich an
einer Konstante dran steht, indem sie etwa als _latin1 "ö" geschrieben
wird..

Die Query wird dann ausgeführt, und das Ergebnis in character_set_results
umgewandelt, bevor es an den Client zurück gesendet wird.

Man kann diese Variablen einzeln setzen, aber es ist bequemer, sie alle drei
auf einmal zu setzen. Dies geschieht mit SET NAMES utf8 oder SET NAMES
latin1.

Um einen bestimmten Zeichensatz zum Default zu machen, setzt man sich in die
[client]-Sektion seiner my.cnf eine Definition für den
default-character-set:

```sql
[client]
default-character-set=latin1
default-collation=latin1_german1_ci
```


### Zeichensatz an Datenbank, Tabelle und Spalte

Server, Datenbanken und Tabellen haben Default-Zeichensätze und Collations.
Die Default-Einstellungen bewirken nichts, außer das sie festlegen, welche
Zeichensätze und Collations CHAR, VARCHAR und TEXT Spalten haben werden, für
die nicht ausrücklich etwas festgelegt wird. Wer vernünftig ist, setzt als
Default-Wert immer einen Einbyte-Zeichensatz und verwendet
Mehrbyte-Zeichensätze so sparsam wie irgend möglich.

Einer Datenbank kann beim Anlegen mit "CREATE DATABASE" ein Zeichensatz und
eine Collation mitgegeben werden.

```sql
root@localhost [(none)]> create database demo charset latin1 collate latin1_german1_ci;
Query OK, 1 row affected (0.37 sec)
```

MySQL hinterlegt diese Informationen in der db.opt-Datei im Verzeichnis der Datenbank.

```console
linux:~ # cat /export/data/rootforum/data/demo/db.opt
default-character-set=latin1
default-collation=latin1_german1_ci
```

Die Daten können mit dem passenden ALTER DATABASE Kommando geändert werden.

Auch für Tabellen können so Default festgelegt werden, die vom Default der
Datenbank abweichen:

```sql
root@localhost [demo]> create table t ( id integer not null, d varchar(20) charset latin1 not null, e varchar(20) charset utf8 not null ) charset cp1250;
Query OK, 0 rows affected (0.33 sec)

root@localhost [demo]> show create table t\G
       Table: t
Create Table: CREATE TABLE `t` (
  `id` int(11) NOT NULL,
  `d` varchar(20) character set latin1 NOT NULL,
  `e` varchar(20) character set utf8 NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=cp1250
1 row in set (0.00 sec)
```


Dieses Beispiel definiert in unserer latin1-Datenbank demo eine Tabelle mit
einer cp1250 Codierung und in dieser eine latin1 und eine utf8-Spalte.

Mit unserer utf8-Konsole können wir dort jetzt Umlaute einfüllen, und sie
zum Test auch wieder auslesen.

```sql
root@localhost [demo]> select hex("ö"); -- utf8 wird verwendet
+-----------+
| hex("ö") |
+-----------+
| C3B6      |
+-----------+
1 row in set (0.01 sec)
root@localhost [demo]> set names utf8;
Query OK, 0 rows affected (0.00 sec)
root@localhost [demo]> insert into t ( id, d, e ) values ( 1, "ö", "ö" );
Query OK, 1 row affected (0.00 sec)
root@localhost [demo]> select d, hex(d), e, hex(e) from t;
+----+--------+----+--------+
| d  | hex(d) | e  | hex(e) |
+----+--------+----+--------+
| ö  | F6     | ö  | C3B6   |
+----+--------+----+--------+
1 row in set (0.00 sec)
```

Man kann hier sehr schön sehen, daß der utf8-Umlaut in latin1 gewandelt
worden ist, bevor er in d eingefügt worden ist, während er in e ohne
Konvertierung gespeichert werden konnte. Die Verbindung ist auf utf8
gestellt, aber dennoch werden d und e im select korrekt angezeigt, weil der
Inhalt von d bei der Ausgabe wieder von latin1 in utf8 gewandelt wird.

### Datenimport

Beim Import von Daten in ein MySQL in Form eines Dumpfiles ist es also
wichtig, erst einmal den Zeichensatz des Dumpfiles korrekt festzustellen.
"od -t x1a" auf ein paar Umlaute im Dumpfile hilft dabei sehr. Der Dump muß
dann mit einem SET NAMES-Statement beginnen, das zu diesem Zeichensatz paßt.

Die Tabellendefinitionen im Zielsystem können vom Zeichensatz her so
aufgesetzt sein, wie sie wollen, solange die Zeichen aus dem Dump im
Zeichensatz der Zielspalten darstellbar ist. MySQL wird die Zeichen dann
beim Import so hin- und her konvertieren wie es notwendig ist.

Anders herum hilft es auch genau gar nicht, die Zeichensatzdefinitionen von
Spalten im Dump zu verändern, um vermeintliche Fehler zu korrigieren. Es ist
lediglich ausschlaggebend, daß der Zeichensatz im Dump und das SET NAMES
korrekt übereinstimmen.

