---
layout: post
published: true
title: Die InnoDB Storage Engine
author-id: isotopp
date: 2008-01-30 10:17:03 UTC
tags:
- mysql
- lang_de
feature-img: assets/img/background/mysql.jpg
---
Die Storage Engine InnoDB ist eine Storage Engine, die ACID-konform
betrieben werden kann, Transaktionen beherrscht und Foreign Key Constraints
prüfen kann. Sie ist geeignet für alle Anwendungen, die Online Transaction
Processing machen oder aus anderen Gründen eine hohe Rate von paralellen
Schreibzugriffen haben.

### Hat mein MySQL InnoDB Support und ist dieser betriebsbereit?

Mit dem Kommano `SHOW ENGINES` kann man sich die von einer Instanz
unterstützten Engines anzeigen lassen. Wenn InnoDB enthalten und
betriebsbereit ist, wird die Engine mit `YES` angezeigt. Wenn sie enthalten
und nicht betriebsbereit ist, wird `DISABLED` gezeigt. Wenn sie nicht einmal
im Code des Servers enthalten ist, wird `NO` gezeigt.

```sql
root on mysql.sock [(none)]> show engines;
+------------+---------+----------------------------------------------------------------+
| Engine     | Support | Comment                                                        |
+------------+---------+----------------------------------------------------------------+
| MyISAM     | DEFAULT | Default engine as of MySQL 3.23 with great performance         |
| MEMORY     | YES     | Hash based, stored in memory, useful for temporary tables      |
| InnoDB     | YES     | Supports transactions, row-level locking, and foreign keys     |
| BerkeleyDB | NO      | Supports transactions and page-level locking                   |
| BLACKHOLE  | YES     | /dev/null storage engine (anything you write to it disappears) |
| EXAMPLE    | YES     | Example storage engine                                         |
| ARCHIVE    | YES     | Archive storage engine                                         |
| CSV        | YES     | CSV storage engine                                             |
| ndbcluster | NO      | Clustered, fault-tolerant, memory-based tables                 |
| FEDERATED  | YES     | Federated MySQL storage engine                                 |
| MRG_MYISAM | YES     | Collection of identical MyISAM tables                          |
| ISAM       | NO      | Obsolete storage engine                                        |
+------------+---------+----------------------------------------------------------------+
12 rows in set (0.00 sec)
```

### Eine minimale Konfiguration für InnoDB

Für die folgenden Beispiele ist es notwendig, daß der MySQL-Server mit einem
funktionierenden InnoDB ausgestattet ist. Die folgende Minimal-Konfiguration
ist nicht für die Produktion geeignet, sollte aber ausreichen um von
`DISABLED` auf `YES` zu kommen. 

- Mit `SHOW GLOBAL VARIABLES LIKE 'datadir'` ist das Datenverzeichnis für diese
  Instanz von MySQL zu lokalisieren. In diesem Verzeichnis befinden sich
  unter Umständen ein Datenfile `ibdata1` und zwei Logfiles, `ib_logfile0` und
  `ib_logfile1.`

```console
root on mysql.sock [(none)]> show global variables like 'datadir';
+---------------+------------------------------+
| Variable_name | Value                        |
+---------------+------------------------------+
| datadir       | /export/data/rootforum/data/ |
+---------------+------------------------------+
1 row in set (0.00 sec)
root on mysql.sock [(none)]> quit
Bye
linux:/export/data/rootforum # ls -lh /export/data/rootforum/data/ib\*
-rw-rw---- 1 mysql mysql   5M Jan  9 17:51 /export/data/rootforum/data/ib_logfile0
-rw-rw---- 1 mysql mysql   5M Jan  9 17:51 /export/data/rootforum/data/ib_logfile1
-rw-rw---- 1 mysql mysql  10M Dec 13 14:34 /export/data/rootforum/data/ibdata1
```

- Der Datenbankserver ist zu stoppen. - Die o.a. drei Files sind, wenn
  vorhanden, zu löschen. **WARNUNG!** Dies löscht alle evtl. bereits
  vorhandenen Daten in InnoDB. Diesen Schritt nur dann durchführen, wenn die
  Engine vorher DISABLED war.

- In der Sektion [mysqld] der my.cnf ist die Anweisung skip-innodb zu
  finden, wenn vorhanden, und zu entfernen.

- Die folgenden Konfigurationsanweisungen sind stattdessen einzufügen. Ihre
  Bedeutung wird weiter unten erläutert.

```console
innodb
innodb_file_per_table = 1
innodb_flush_log_at_trx_commit = 2
```

- Dies ist ein minimales Setup, das zum Testen geeignet ist, aber keine
  Performance bringen wird. Später gehen wir auch auf InnoDB Performance
  Tuning ein.

- Der Server ist zu starten. Er legt die o.a. drei Files
  neu an, und hinterläßt entsprechende Nachrichten im Log. Die Engine InnoDB
  wird in `SHOW ENGINES` jetzt mit `YES` angezeigt.

### InnoDB Tabellen anlegen

Beim Anlegen einer Tabellenspezifikation kann durch das Nachstellen einer
ENGINE-Klausel festgelegt werden, mit welcher Storage Engine die Tabelle
erzeugt wird. Dies kann innerhalb eines Schemas für jede Tabelle getrennt
festgelegt werden, und mit Hilfe von `ALTER TABLE` auch nachträglich ohne
Datenverlust geändert werden.

```console
root on mysql.sock [(none)]> create database innodemo;
Query OK, 1 row affected (0.32 sec)

root on mysql.sock [(none)]> use innodemo;
Database changed
root on mysql.sock [innodemo]> create table kris ( 
  id integer unsigned not null primary key auto_increment, 
  d varchar(20) not null 
) engine = innodb;
Query OK, 0 rows affected (0.36 sec)

root on mysql.sock [innodemo]> insert into kris ( d ) values ( "eins"), ("zwei"), ("drei");
Query OK, 3 rows affected (0.00 sec)
Records: 3  Duplicates: 0  Warnings: 0

root on mysql.sock [innodemo]> select * from kris;
+----+------+
| id | d    |
+----+------+
|  1 | eins |
|  2 | zwei |
|  3 | drei |
+----+------+
3 rows in set (0.01 sec)
```

Mit Hilfe des Kommando `SHOW CREATE TABLE` oder mit `SHOW TABLE STATUS` können
wir sehen, welche Storage Engine eine Tabelle verwendet.

```console
root on mysql.sock [innodemo]> show create table kris\G
*************************** 1. row ***************************
       Table: kris
Create Table: CREATE TABLE `kris` (
  `id` int(10) unsigned NOT NULL auto_increment,
  `d` varchar(20) NOT NULL,
  PRIMARY KEY  (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8
1 row in set (0.00 sec)

root on mysql.sock [innodemo]> show table status like "kris"\G
*************************** 1. row ***************************
           Name: kris
         Engine: InnoDB
        Version: 10
     Row_format: Compact
           Rows: 3
 Avg_row_length: 5461
    Data_length: 16384
Max_data_length: 0
   Index_length: 0
      Data_free: 0
 Auto_increment: 4
    Create_time: 2008-01-09 18:04:00
    Update_time: NULL
     Check_time: NULL
      Collation: utf8_general_ci
       Checksum: NULL
 Create_options:
        Comment: InnoDB free: 148480 kB
1 row in set (0.00 sec)
```

In der Ausgabe von `SHOW TABLE STATUS` sehen wir einige Besonderheiten: Erst
einmal ist die angezeigte Average Row Length von InnoDB-Tabellen mit sehr
wenigen Datensätzen ungültig. Die Average Row Length unserer Tabelle ist,
das wissen wir, ungefähr 4 (integer) + 5 (1 Längenbyte und vier
Zeichenbytes) plus ein wenig Verwaltungsoverhead (ca. 10-12 Byte pro Row).

InnoDB vergibt Speicherplatz jedoch in Seiten zu 16KB, und daher ist die
Data_length = 16384 Bytes. Die Average Row Length wird von InnoDB als
Statistik nicht gepflegt und an MySQL exportiert und wird daher als
Data_length/Rows geschätzt. Für kleine Anzahlen von Zeilen ist dieser Wert
falsch.

Außerdem können wir sehen, daß die Index_length für diese Tabelle 0 ist,
obwohl ein Primary Key definiert ist. Das wird uns später noch im Detail
beschäftigen. Für das erste genügt es zu wissen, das der Primary Key in
InnoDB zu den Daten gerechnet wird und auch sonst magisch ist. Data_free
ist, anders als in MyISAM, immer 0.

### Existierende Tabellen im Typ ändern

Mit den Kommando `ALTER TABLE` können wir eine existierende Tabelle von InnoDB
nach MyISAM umwandeln oder zurück. Daten gehen dabei nicht verloren. Zum
Vergleich hier einmal die Ausgabe von `SHOW TABLE STATUS` für dieselbe
Tabelle, wenn sie als MyISAM-Tabelle existiert. Man kann sehen, daß MyISAM
den Primary Key NICHT zu den Daten rechnet und daß MyISAM im Index ebenfalls
seitenbasiert arbeitet, nur sind die Seiten viel kleiner: Sie sind nur 1KB
groß.

```console
root on mysql.sock [innodemo]> alter table kris engine=myisam;
Query OK, 3 rows affected (0.00 sec)
Records: 3  Duplicates: 0  Warnings: 0

root on mysql.sock [innodemo]> select * from kris;
+----+------+
| id | d    |
+----+------+
|  1 | eins |
|  2 | zwei |
|  3 | drei |
+----+------+
3 rows in set (0.00 sec)

root on mysql.sock [innodemo]> show table status like "kris"\G
*************************** 1. row ***************************
           Name: kris
         Engine: MyISAM
        Version: 10
     Row_format: Dynamic
           Rows: 3
 Avg_row_length: 20
    Data_length: 60
Max_data_length: 281474976710655
   Index_length: 2048
      Data_free: 0
 Auto_increment: 4
    Create_time: 2008-01-09 18:11:57
    Update_time: 2008-01-09 18:11:57
     Check_time: NULL
      Collation: utf8_general_ci
       Checksum: NULL
 Create_options:
        Comment:
1 row in set (0.00 sec)
```

Wir können unsere Tabelle auch wieder zurück nach InnoDB wandeln. Wir können
sogar eine existierende InnoDB-Tabelle nach InnoDB wandeln. Das macht sogar
Sinn - es ist genau das, was OPTIMIZE TABLE in InnoDB macht.

```console
root on mysql.sock [innodemo]> alter table kris engine=innodb;
Query OK, 3 rows affected (0.01 sec)
Records: 3  Duplicates: 0  Warnings: 0

root on mysql.sock [innodemo]> alter table kris engine=innodb;
Query OK, 3 rows affected (0.02 sec)
Records: 3  Duplicates: 0  Warnings: 0

root on mysql.sock [innodemo]> select * from kris;
+----+------+
| id | d    |
+----+------+
|  1 | eins |
|  2 | zwei |
|  3 | drei |
+----+------+
3 rows in set (0.00 sec)
```

Ein `ALTER TABLE t ENGINE=...` erzeugt eine Kopie der Tabelle mit der neuen
Engine als temporäre Tabelle. Danach wird die Originaltabelle gelöscht und
die temporäre Tabelle als permanente Tabelle installiert. Das hat eine Reihe
von Konsequenzen: 

- Die Operation kann keine Daten verlieren. Wenn die Operation scheitert
  oder durch Benutzer abgebrochen wird, wird die temporäre Tabelle gelöscht
  und die Originaltabelle bleibt unverändert stehen. 
- Vorübergehend wird sehr viel mehr Speicher gebraucht, denn es müssen ja
  beide Tabellen parallel existieren. Dabei ist zu beachten, daß InnoDB die
  Daten weniger dicht packt als MyISAM. Eine InnoDB-Tabelle braucht etwa 1.6
  bis 2.2 mal so viel Platz wie eine MyISAM-Tabelle.
- Während des ALTER TABLE sind beide Tabellen gelockt. Wenn das stört, kann
  man sich mit der Sequenz
  - `CREATE TABLE b LIKE a;`
  - `ALTER TABLE b ENGINE=InnoDB`
  - `INSERT INTO b SELECT * FROM a;`
behelfen. Hier ist a dann während des Kopiervorganges nur mit einem Read
  Lock gesperrt. Außerdem kann man mit einer LIMIT-Clause am Select die
  Datenmenge begrenzen, etwa um zu experimentieren.

### Transaktionen

InnoDB beherrscht Transaktionen. Das bedeutet, das Anweisungen an
InnoDB-Tabellen gesammelt werden und erst durch ein `COMMIT` gesammelt auf
alle Tabellen angewendet werden. Entweder gelingen alle Anweisungen, oder
keine von den Anweisungen wird ausgeführt.

Per Default befindet sich die Datenbank im AUTOCOMMIT Modus. Das bedeutet,
nach jeder Anweisung "denkt" sich der Server automatisch ein `COMMIT` dazu.
Man kann entweder Autocommit abschalten, oder mit der Anweisung `BEGIN` auch
im Autocommit eine längere Transaktion beginnen.

```console
root on mysql.sock [innodemo]> begin;
Query OK, 0 rows affected (0.00 sec)

root on mysql.sock [innodemo]> insert into kris ( d ) values ( "vier" );
Query OK, 1 row affected (0.00 sec)

root on mysql.sock [innodemo]> select * from kris;
+----+------+
| id | d    |
+----+------+
|  1 | eins |
|  2 | zwei |
|  3 | drei |
|  4 | vier |
+----+------+
4 rows in set (0.00 sec)

root on mysql.sock [innodemo]> rollback;
Query OK, 0 rows affected (0.00 sec)

root on mysql.sock [innodemo]> select * from kris;
+----+------+
| id | d    |
+----+------+
|  1 | eins |
|  2 | zwei |
|  3 | drei |
+----+------+
3 rows in set (0.00 sec)
```

Hier wird mit `BEGIN` eine Transaktion bei aktiviertem Autocommit begonnen,
das Autocommit also vorübergehend unterbrochen. Dies ist die empfohlene
Vorgehensweise. Eine Zeile wird in die Tabelle eingefügt. Für uns selber ist
diese Zeile auch erst einmal sichtbar. Die Transaktion wird jedoch nicht mit
`COMMIT` beendet, sondern mit `ROLLBACK` rückgängig gemacht. Dadurch ist nach
dem Ende der Transaktion die Zeile wieder weg.

### Wie InnoDB auf der Platte aussieht


```console
linux:/export/data/rootforum/data # ls -lh ib* innodemo
-rw-rw---- 1 mysql mysql   5M Jan  9 18:27 ib_logfile0
-rw-rw---- 1 mysql mysql   5M Jan  9 18:28 ib_logfile1
-rw-rw---- 1 mysql mysql  10M Jan  9 18:27 ibdata1

innodemo:
total 112K
-rw-rw---- 1 mysql mysql   61 Jan  9 18:03 db.opt
-rw-rw---- 1 mysql mysql 8.4K Jan  9 18:28 kris.frm
-rw-rw---- 1 mysql mysql  96K Jan  9 18:28 kris.ibd
```

Jede InnoDB-Installation hat mindestens ein Datenfile `ibdata1` und mindestens
zwei Redo-Logiles `ib_logfile0` und `ib_logfile1`. Position, Größe, Anzahl und
Namen dieser Dateien können jedoch relativ frei bestimmt werden.

Unser InnoDB arbeitet mit `innodb_file_per_table = 1`. Das bedeutet, unsere
Daten liegen in einer .ibd-Datei neben der .frm-Datei im Schema-Directory,
hier also in $datadir/innodemo/kris.ibd. Die Endung IBD steht Datei für
InnoBase-Data. Obwohl die eigentlichen Daten in dieser Datei liegen, braucht
InnoDB zwingend ein ibdata-File und mindestens zwei Redo-Logs. Im
ibdata-File legt Innobase das Data Dictionary ab, also eine Schattenkopie
der Tabellendefinitionen aus dem .frm-Dateien in einer Innobase-internen
Codierung und das Undo-Log. Im Redo-Log loggt InnoDb alle datenverändernden
Operationen.

Anders als bei MyISAM ist es NICHT möglich, .ibd-Dateien auf
Dateisystemebene zu kopieren, verschieben, umzubenennen oder einer anderen
Instanz von MySQL einfach so unterzuschieben. Jede dieser Operationen wird
im günstigsten Fall von InnoDB erkannt und zurückgewiesen und zerstört im
schlimmsten Fall die Instanz.

Wenn wir unser InnoDB mit `innodb_file_per_table = 0` betreiben, liegen auch
alle Tabellen in der zentralen ibdata-Datei, und es existieren im
Schema-Directory nur .frm-Dateien.

ibdata-Dateien können intern nicht genutzten Platz frei geben und wieder
verwenden, aber sie schrumpfen niemals. Wenn man eine Instanz nachträglich
von `innodb_file_per_table = 0` auf `1` umstellt, werden existierende
InnoDB-Tabellen durch ein `ALTER TABLE t ENGINE=InnoDB` in einem externe
.ibd-Datei umkopiert und der Platz in der ibdata-Datei freigegeben, aber die
Datei wird niemals schrumpfen. Die einzige Methode, von der alten großen
ibdata-Datei weg zu kommen ist ein Dump der Datenbank und ein Neuladen der
Daten in eine andere Instanz.

Wieviel Platz in einer ibdata- oder .ibd-Datei frei ist wird im Comment-Feld
der Ausgabe von SHOW TABLE STATUS für jede Tabelle angezeigt. Die Angaben
sind natürlich immer Vielfache von 16K, der InnoDB Seitengröße.

Es ist möglich, mehr als eine ibdata-Datei zu haben, aber es ist vollkommen
unmöglich zu kontrollieren, welche Tabelle oder welcher Teil einer Tabelle
in welcher ibdata-Datei liegt. Bei `innodb_file_per_table` liegt jede Tabelle
immer vollständig in ihrer eigenen .ibd-Datei.

### Das Undo-Log

Jede Tabelle hat in InnoDB zwei versteckte Spalten, eine Transaktionsnummer
und einen Zeiger auf die vorhergehende Version der Zeile im Undo-Log, den
Rollback-Pointer.

Wenn wir eine Zeile in einer InnoDB-Tabelle verändern, wird die alte Version
der Zeile mit der alten Transaktionsnummer aus der Originaltabelle ins
Undo-Log kopiert und die neue Version mit einer neuen Transaktionsnummer in
die .IBD-Datei kopiert. Der Rollback-Pointer der neuen Version der Zeile
zeigt dabei auf die alte Version der Zeile im Undo-Log.


```console
root on mysql.sock [innodemo]> begin;
Query OK, 0 rows affected (0.00 sec)

root on mysql.sock [innodemo]> update kris set d = "one" where id = 1;
Query OK, 1 row affected (0.01 sec)
Rows matched: 1  Changed: 1  Warnings: 0

root on mysql.sock [innodemo]> select * from kris;
+----+------+------+          +----+------+------+
| id | d    | txn# |          | id | d    | txn# |
+----+------+------+          +----+------+------+
|  1 | one  |   2  | ------>  |  1 | eins |   1  |
|  2 | zwei |   1  |          +----+------+------+
|  3 | drei |   1  |
+----+------+------+
3 rows in set (0.00 sec)
```

In dem Beispiel oben habe ich diese verborgenen Zeilen und den Undo-Log
Eintrag zur Verdeutlichung manuell von Hand hereingefälscht.

Diese Verzeigerung von Zeilenversionen kann auch über mehr als eine Version
gehen, d.h. ein Eintrag im Undo-Log kann auf eine noch ältere Version einer
Zeile zeigen und so weiter. Löscht man das Undo-Log nie, bekommt man für
jede Zeile jeder Tabelle eine lineare Liste, die die vollständige Abfolge
aller Versionen dieser Zeile darstellt. Irgendwann einmal jedoch wird der
Undo-Eintrag, der jetzt ja nicht mehr gebraucht wird, von einer
InnoDB-Aufräumkomponente, dem Purge-Thread, gelöscht und der Eintrag im
Undo-Log gelöscht, sodaß das Undo-Log in der Realität nicht ins Unendliche
wächst.

Das Kopieren von Versionen von Zeilen aus der Tabelle ins Undo-Log und die
Verzeigerung von Zeilenversionen untereinander nennt man MVCC, Multiversion
Concurrency Control.

MVCC ist, so wie InnoDB es implementiert, für das COMMIT optimiert. Wenn man
als Anwender ein COMMIT ausführt, ist nichts zu tun: Die Transaktion wird
als comitted markiert, die Verzeigerung der Einträge bleibt bestehen und
alles ist gut.


```console
root on mysql.sock [innodemo]> rollback;
Query OK, 0 rows affected (0.01 sec)

+----+------+------+          +----+------+------+
| id | d    | txn# |          | id | d    | txn# |
+----+------+------+ ROLLBACK +----+------+------+
|  1 | eins |   1  | <------- |    |      |      |
|  2 | zwei |   1  |          +----+------+------+
|  3 | drei |   1  |
+----+------+------+
3 rows in set (0.00 sec)
```

Wenn man als Anwender ein ROLLBACK ausführt, fällt dagegen Arbeit an: Die
Daten aus dem Undo-Log müssen rausgefischt und die Änderung in der
Originaltabelle rückgängig gemacht werden.

Das kann bei vielen Zeilen auch mal länger dauern, da das Undo-Log
zeilenweise und nicht seitenweise organisiert ist. Es ist günstig, seine
Transaktionen nicht zu groß zu machen: In den meisten Fällen wird eine
Transaktionsgröße von 1.000 bis 10.000 Zeilen für das Massenladen von Daten
ein guter Kompromiß sein (Zu klein ist auch doof, wie wir noch sehen
werden).

### Transaction Isolation Level Read Uncomitted

Wenn wir die Transaktion von oben einmal von außen betrachten, also von
einer zweiten Verbindung aus, dann kann es sein, daß wir sie beobachten
können oder auch nicht. Auf der ersten Verbindung machen wir:

```console
root on mysql.sock [innodemo]> begin;
Query OK, 0 rows affected (0.00 sec)

root on mysql.sock [innodemo]> update kris set d = "one" where id = 1;
Query OK, 1 row affected (0.00 sec)
Rows matched: 1  Changed: 1  Warnings: 0
```

und lassen dies nun hängen, ohne die Transaktion mit COMMIT oder ROLLBACK zu
beenden. In einem zweiten Fenster öffnen wir eine zweite Verbindung zur
Datenbank und schauen einmal, was wir sehen:

```console
root on mysql.sock [(none)]> use innodemo;
Database changed
root on mysql.sock [innodemo]> select * from kris;
+----+------+
| id | d    |
+----+------+
|  1 | eins |
|  2 | zwei |
|  3 | drei |
+----+------+
3 rows in set (0.00 sec)
```

Wir sehen erst einmal, daß unser Lesezugriff nicht hängt oder wartet, obwohl
gerade eine Transaktion im Gange ist. In MVCC können lesende und schreibende
Operationen einander niemals blockieren - das ist ein großer Unterschied zu
MyISAM und einer der Gründe warum InnoDB bei Szenarien mit hoher
Parallelität schneller ist als MyISAM, obwohl es ständig Kopien von den
Daten machen muß.

Wir sehen hier den alten Wert der Zeile mit der id = 1. Wir wissen von
weiter oben, das in der ibd-Datei schon die neue Version steht. Also muß die
Datenbank hier für die Zeile id = 1 für unsere Verbindung dem
Rollback-Pointer gefolgt sein und für uns die alte Version der Zeile
gefischt haben. Die erste Verbindung dagegen sieht, wie noch weiter oben
schon demonstriert, ihre eigenen Änderungen sofort, auch ohne COMMIT.

Wir können auch unsere externe, zweite Verbindung diese uncomitteten Daten
sehen lassen. Das geht, indem wir den `TRANSACTION ISOLATION LEVEL` dieser
Verbindung auf `READ UNCOMITTED` stellen.

```console
root on mysql.sock [innodemo]> set transaction isolation level read uncommitted;
Query OK, 0 rows affected (0.00 sec)

root on mysql.sock [innodemo]> select * from kris;
+----+------+
| id | d    |
+----+------+
|  1 | one  |
|  2 | zwei |
|  3 | drei |
+----+------+
3 rows in set (0.00 sec)
```

Wir merken uns: Eine schreibende Verbindung macht immer dasselbe: Sie
kopiert die zu verändernden Daten vor der Änderung ins Undo-Log und
verzeigert sie korrekt. Das muß sie tun, damit sie ein Rollback machen kann.

Eine lesende Verbindung kann sich nun aussuchen, welche Version der Daten
sie sehen will. Jede einzelne lesende Verbindung kann das unabhängig von
allen anderen Verbindungen tun und sich auch umentscheiden, denn es sind ja
in jedem Fall alle Versionen der Daten immer da.

In `READ UNCOMITTED` sehen wir immer die Daten aus dem ibd-File und folgen dem
Rollback-Pointer nie. Dadurch sehen wir Daten, die noch nicht comitted sind
und es auch vielleicht nie sein werden. Wir sehen eine Version der Realität,
die noch nicht existiert und es vielleicht nie tun wird. Für eine Anwendung
ist das in den meisten Fällen nicht das gewünschte Verhalten.

### Transaction Level Read Comitted

Setzen wir dagegen den `TRANSACTION ISOLATION LEVEL` auf `READ COMITTED`, dann
bekommen wir für alle Zeilen, die nicht von einer Transaktion in Bearbeitung
sind, die Daten aus dem .ibd-File und für alle Zeilen, in denen noch nicht
comittete Daten stehen folgt die Datenbank dem Rollback-Pointer genau eine
Ebene in das Undo-Log und liefert uns die Daten von dort. Dadurch bekommen
wir immer Daten zu sehen, die "wirklich da sind" und sie hypothetischen
Versionen der Wirklichkeit von `READ UNCOMITTED` werden für uns ausgefiltert.

Jedoch besteht immer noch die Möglichkeit, daß wir sehen wir sich Daten
verändern, wenn wir sie zweimal lesen. 

Gegeben sei etwa eine Anwendung, die mit der Anweisungssequenz `begin;
update kris set d = d + 1 where id = 2; commit;` einen Zähler für die Zeile
id = 2 hochzählt. Wenn wir in einer zweiten Verbindung wiederholt die
Tabelle mit `READ COMMITTED` betrachten, bekommen wir veränderliche Werte
von `kris.d` für `kris.id = 2` zurück. Das ist auch dann der Fall, wenn unsere
zweite Verbindung selbst eine Transaktion durchführt - die Sequenz
`BEGIN-SELECT-SELECT-COMMIT`, eine Read-Only-Transaktion, hat in `READ
COMMITTED` keine besondere Bedeutung.

```console
root on mysql.sock [innodemo]> set transaction isolation level read committed;
Query OK, 0 rows affected (0.00 sec)

root on mysql.sock [innodemo]> begin;
Query OK, 0 rows affected (0.00 sec)

root on mysql.sock [innodemo]> select * from kris;
+----+------+
| id | d    |
+----+------+
|  1 | eins |
|  2 | zwei |
|  3 | drei |
+----+------+
3 rows in set (0.01 sec)

root on mysql.sock [innodemo]> select * from kris;
+----+------+
| id | d    |
+----+------+
|  1 | eins |
|  2 | 1    |
|  3 | drei |
+----+------+
3 rows in set (0.00 sec)

root on mysql.sock [innodemo]> select * from kris;
+----+------+
| id | d    |
+----+------+
|  1 | eins |
|  2 | 2    |
|  3 | drei |
+----+------+
3 rows in set (0.00 sec)

root on mysql.sock [innodemo]> commit;
Query OK, 0 rows affected (0.00 sec)

```
 
### Transaction Isolation Level Repeatable-Read

Genau dies ändert sich, wenn wir im Transaction Isolation Level `REPEATABLE
READ` arbeiten: In dem Moment, in dem wir mit `BEGIN` eine Transaktion starten,
sieht diese Verbindung einen Snapshot der Datenbank, der sich nicht mehr
verändert, bis die Transaktion beendet wird. In `REPEATABLE READ` hat also
auch eine Read-Only-Transaktion eine Bedeutung.

Intern wird dies so realisiert, daß beim Lesen einer Zeile nicht nur einen
Schritt in die Vergangenheit der Zeile im Undo-Log gegangen wird, sondern
den untereinander verbundenen Zeigern im Undo-Log so lange gefolgt wird bis
die neuste Zeile gefunden wird, die für diesen Leser noch sichtbar ist.
Während also die schreibenden Verbindungen die Daten in der Tabelle immer
weiter und weiter ändern, wandern mehr und mehr alte Versionen dieser Zeile
ins Undo-Log, wo sie bis auf weiteres archiviert werden.

Während bei `READ COMITTED` also immer nur ein Schritt von der Tabelle ins
Undo-Log gemacht wird, kann es bei `REPEATABLE READ` vorkommen, daß für einen
bestimmten Leser viele Schritte im Undo-Log in die Vergangenheit der Zeile
gemacht werden müssen. Dadurch ist die Lebensdauer einzelner Einträge im
Undo-Log aber nicht mehr einheitlich, sondern es kann sein, daß einmal mehr
oder weniger Einträge im Undo-Log aufbewahrt werden müssen. InnoDB hat einen
globalen (für `SHOW PROCESSLIST` nicht sichtbaren) Purge-Thread, der schaut,
was die älteste Transaktion im System für eine Transaktionsnummer noch
brauchen würde. Der Purge-Thread löscht dann alle Einträge im Undo-Log, die
noch älter sind als diese Transaktion.

Das bedeutet aber anders herum auch, daß eine lange laufende Transaktion den
Purge-Thread effektiv still legt. Wenn zum Beispiel ein `mysqldump
--single-transaction` eine große Datenbank exportiert, dann kann es sein,
daß diese "single transaction" viele Minuten oder je nach Datenmenge gar
stundenlang stehen bleibt und damit auch der Purge Thread nichts löschen
kann. 

Finden in dieser Zeit viele Schreibzugriffe statt, wird das Undo-Log
unter Umständen beträchtlich anwachsen. Wie weiter oben erklärt, liegt das
Undo-Log _immer_ im ibdata-File, auch dann, wenn `innodb_file_per_table`
aktiviert ist. Das bedeutet, daß das ibdata-File auch bei einem Server, der
`innodb_file_per_table` aktiviert hat, größer werden kann - 256M bis 1G sind
unter Umständen vollkommen normal.

Wenn ein ibdata-File zu klein ist und nicht wachsen kann, weil in der
`innodb_data_file_path` ohne `autoextend` definiert ist oder die Platte voll
ist, kann dies unter Umständen zu schwer verständlichen Fehlermeldungen
("Table full", obwohl noch mächtig Platz da ist) oder Transaktionsabbrüchen
führen.

### Transaction Isolation Level SERIALIZABLE und SELECT ... FOR UPDATE

Während `REPEATABLE READ` also alle unsere Leseprobleme löst, fehlt uns jetzt
noch ein Mechanismus, mit dem wir `READ-MODIFY-WRITE` Zyklen korrekt handhaben
können. Ein Read-Modify-Write-Zyklus ist ein Zugriff, bei dem eine Anwendung
Daten liest, in der Anwendung verarbeitet und dann die geänderten Daten
zurück schreibt.

Damit dies konsistent geschehen kann, muß sichergestellt sein, daß die Daten
im Datenbanksystem nicht mehr geändert werden nachdem die Anwendung sie
gelesen hat, ansonsten bekommen wir eine Race-Condition, weil zwei
Verbindungen zeitgleich dieselben Daten lesen und sich gegenseitig die
Änderungen überschreiben.

Wir erreichen dies durch eine Transaktion, in der die Daten mit einem `SELECT
... FOR UPDATE`-Statement gelesen werden. Dies ist eine Select-Anweisung, die
normal lesend zugreift, aber dabei Locks erzeugt wie ein Update-Statement.
In unserem Fall bedeutet dies, daß exclusive Locks auf allen Zeilen erzeugt
werden, die vom Select-Statement über den Index zugegriffen wird. Die Locks
bleiben bis zum Ende der Transaktion stehen. Das `FOR UPDATE` bewirkt also
durch die Locks, daß zwei Änderungen an denselben Zeilen nacheinander, also
serialisiert, erfolgen.

Dabei gilt es ein paar trickreiche Dinge zu beachten: 

Zunächst einmal werden die Locks über den Index erzeugt. Wenn wir also einen
`EXPLAIN`-Plan sehen, indem ein "using where" steht, dann heißt das in der
Regel, daß mehr Zeilen über den Index selektiert werden als nachher im
Result Set zu sehen sind - es gibt weitere einschränkende Bedingungen, die
den über den Index generierten Result Set weiter verkleinern. Für die Locks
bedeutet es aber, daß unter Umständen mehr Zeilen gelockt werden als wir
möchten oder im Result Set sehen können.

Wir können das demonstrieren, indem wir eine Tabelle mit zwei Spalten a und
b erzeugen. 

a sei Primary Key und b sei nicht indiziert. Wenn wir jetzt ein `SELECT ...
FOR UPDATE` ausführen, das `WHERE a = ... AND b = ...` enthält, werden alle in
der a-Bedingung gefundenen Zeilen gelockt, auch jene, bei denen die
b-Bedingung nicht zutrifft.

```console
-- 
-- Tabelle anlegen
-- 
root on mysql.sock [kris]> create table t ( 
  a integer not null, 
  b integer not null 
) engine = innodb;
Query OK, 0 rows affected (0.16 sec)

--
-- Daten generieren
--
root on mysql.sock [kris]> insert into t values ( rand() * 100000, rand() * 10);
Query OK, 1 row affected (0.01 sec)
root on mysql.sock [kris]>  insert into t select rand() * 100000, rand() * 10 from t;
Query OK, 1 row affected (0.01 sec)
Records: 1  Duplicates: 0  Warnings: 0
...
root on mysql.sock [kris]>  insert into t select rand() * 100000, rand() * 10 from t;
Query OK, 4096 rows affected (0.26 sec)
Records: 4096  Duplicates: 0  Warnings: 0

-- Da sind noch Duplikate drin, die das 
-- Anlegen eines Primary Key verhindern
root on mysql.sock [kris]> create table dup as select a from t group by a having count(a) > 1 ;
Query OK, 300 rows affected (0.08 sec)
Records: 300  Duplicates: 0  Warnings: 0
root on mysql.sock [kris]> delete from t where a in ( select a from dup );
Query OK, 608 rows affected (5.65 sec)
root on mysql.sock [kris]> alter table t add primary key (a);
Query OK, 7584 rows affected (0.40 sec)
Records: 7584  Duplicates: 0  Warnings: 0
root on mysql.sock [kris]> drop table dup;
Query OK, 0 rows affected (0.00 sec)

--
-- 68 Zeilen über a selektiert
--
root on mysql.sock [kris]>  select a, b from t where a > 99000;
...
| 99490 |  8 |
...
62 rows in set (0.00 sec)

--
-- Jetzt die Demo: In einer Transaktion
-- ein SELECT ... FOR UPDATE fahren
--
root on mysql.sock [kris]> begin;
Query OK, 0 rows affected (0.00 sec)

root on mysql.sock [kris]>  select a, b from t where a > 99000 and b = 10;
+-------+----+
| a     | b  |
+-------+----+
| 99839 | 10 |
| 99970 | 10 |
+-------+----+
2 rows in set (0.00 sec)
```

In einer anderen Verbindung können wir nun versuchen, etwa das Paar ( 99490,
8 ) zu ändern. Wir sehen: Das Statement hängt wegen eines X-Locks auf der
Zeile.

```console
root on mysql.sock [kris]> update t set b = 502 where a = 99490;
... hang ...
```

Wenn wir jedoch einen weiteren INDEX (a,b) definieren und seine Benutzung
erzwingen, werden nur die beiden Records (99839, 10) und (99970, 10) gelockt
und unser paralleles Update auf (99490) geht ohne Warten durch:

```console
root on mysql.sock [kris]> begin;
Query OK, 0 rows affected (0.00 sec)

root on mysql.sock [kris]>  select * from t force index (a) where a > 99000 and b = 10;
+-------+----+
| a     | b  |
+-------+----+
| 99839 | 10 |
| 99970 | 10 |
+-------+----+
2 rows in set (0.00 sec)
root on mysql.sock [kris]> explain select * from t force index (a) where a > 99000 and b = 10\G
*************************** 1. row ***************************
           id: 1
  select_type: SIMPLE
        table: t
         type: range
possible_keys: a
          key: a
      key_len: 4
          ref: NULL
         rows: 63
        Extra: Using where; Using index
1 row in set (0.00 sec)
```

In der anderen Verbindung:

```console
root on mysql.sock [kris]> update t set b = 503 where a = 99490;
Query OK, 1 row affected (0.09 sec)
Rows matched: 1  Changed: 1  Warnings: 0
```

Dieses Lockingverhalten hat also weitreichende Auswirkungen: Wir müssen beim
Schreiben von SQL unbedingt darauf achten, daß die Querypläne von `SELECT ...
FOR UPDATE`-Statements die korrekten Indizes benutzen. Ein ALL oder INDEX in
der Type-Spalte des EXPLAIN würde hier zum Beispiel einen Index-Scan
andeuten - da der ganze Index überstrichen wird, bekommen wir so effektiv
ein sehr teures, aus Zeilenlocks zusammengesetztes Table-Lock.

Das andere trickreiche und unerwartete Verhalten ist, daß InnoDB nicht nur
Zeilen lockt, sondern auch die Lücke hinter den Zeilen. Dieses Next-Key
Locking vereinfacht die Implementierung von REPEATABLE-READ. Dieses
Verhalten ist abschaltbar, der Schalter hat den unerwarteten Namen
`innodb_locks_unsafe_for_binlog` - stellt man ihn auf `ON`, werden von
InnoDB einfach Zeilenlocks erzeugt ohne die Lücke hinter der Zeile auch zu
sperren.

Auf dem Transaction Isolation Level `SERIALIZABLE` verhält sich das System
genau wie auf dem Level `REPEATABLE-READ`, führt aber jedes einzelne
`SELECT` so aus, als sei es als `SELECT ... FOR UPDATE` geschrieben worden.
Das führt dazu, daß jedes SELECT Locks erzeugt als wäre es in
UPDATE-Statement, jeder Lesezugriff lockt also wie ein Schreibzugriff. Dies
führt effektiv dazu, daß sich selbst Lesezugriffe (die ja Schreiblocks
erzeugen) gegenseitig in die Quere kommen, wenn sie zugleich dieselben Daten
lesen wollen. Dies ist noch schlechteres Verhalten als in MyISAM!

Der Transaction Isolation Level `SERIALIZABLE` ist unnötig: Er wird nie
gebraucht, wenn der SQL-Code in der Anwendung korrekt mit `... FOR UPDATE`
lockt. Nur Anwendungen, die dies nicht korrekt tun **und** bei denen
außerdem das SQL nicht korrigierbar ist, brauchen den Isolation Level
`SERIALIZABLE`.
