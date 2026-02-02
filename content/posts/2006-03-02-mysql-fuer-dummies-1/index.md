---
author: isotopp
date: "2006-03-02T17:00:00Z"
feature-img: assets/img/background/rijksmuseum.jpg
tags:
  - mysql
  - lang_de
title: MySQL für Dummies (1)
aliases:
  - /2006/03/02/mysql-fuer-dummies-1.html
---

Ein MySQL Datenbankserver hat ein `datadir`. Das Kommando

```console
root@localhost [(none)]> show variables like "datadir";
+---------------+-----------------+
| Variable_name | Value           |
+---------------+-----------------+
| datadir       | /var/lib/mysql/ |
+---------------+-----------------+
1 row in set (0.00 sec)
```

sagt uns, wo das liegt.
In `datadir` wird für jede mit `CREATE DATABASE` angelegte Datenbank ein Verzeichnis angelegt, und für jede mit `CREATE TABLE` in dieser Datenbank vorhandene Tabelle eine `*.frm`-Datei. 
Dies gilt für alle Tabellentypen, die MySQL verwendet, sogar für MEMORY-Tables. 
Die `*.frm`-Datei beschreibt die Definition der Tabelle, also welche Spalten und Indices vorhanden sein sollen.

```console
root@localhost [(none)]> create database rootforum;
Query OK, 1 row affected (0.00 sec)

root@localhost [(none)]> use rootforum
Database changed
root@localhost [rootforum]> create table t ( id serial ) engine=memory;
Query OK, 0 rows affected (0.03 sec)

root@localhost [rootforum]>
[1]+  Stopped                 mysql -u root -p
h743107:/var/lib/mysql # l rootforum/
insgesamt 24
drwx------  2 mysql mysql 4096 2006-02-11 11:27 ./
drwxr-xr-x  5 mysql mysql 4096 2006-02-11 11:26 ../
-rw-rw----  1 mysql mysql   65 2006-02-11 11:26 db.opt
-rw-rw----  1 mysql mysql 8556 2006-02-11 11:27 t.frm
```

Die `db.opt` sind übrigens die beim Anlegen der Datenbank verwendeten Datenbankoptionen, also der `DEFAULT CHARACTER SET` und die `DEFAULT COLLATION`.

Für eine MyISAM-Tabelle werden neben der `frm`-Datei auch noch eine `MYD`- und eine `MYI`-Datei angelegt.
Die `MYD`-Datei enthält die Daten, die `MYI`-Datei die Indices.
Mithilfe der `frm`-Datei und den Daten aus der `MYD`-Datei kann die `MYI`-Datei jederzeit rekonstruiert werden, aber dies kann bei vielen Daten sehr lange dauern.
Mithilfe der Tabellendefinition aus `mysqldump --no-data` kann die frm-Datei jederzeit rekonstruiert werden, aber das kann umständlich werden. 
Wenn die `MYD`-Datei beschädigt ist, gehen Daten verloren.

```console
h743107:/var/lib/mysql # fg
mysql -u root -p

root@localhost [rootforum]> alter table t engine=myisam;
Query OK, 0 rows affected (0.03 sec)
Records: 0  Duplicates: 0  Warnings: 0

root@localhost [rootforum]>
[1]+  Stopped                 mysql -u root -p
h743107:/var/lib/mysql # l rootforum/
insgesamt 28
drwx------  2 mysql mysql 4096 2006-02-11 11:28 ./
drwxr-xr-x  5 mysql mysql 4096 2006-02-11 11:26 ../
-rw-rw----  1 mysql mysql   65 2006-02-11 11:26 db.opt
-rw-rw----  1 mysql mysql 8556 2006-02-11 11:28 t.frm
-rw-rw----  1 mysql mysql    0 2006-02-11 11:28 t.MYD
-rw-rw----  1 mysql mysql 1024 2006-02-11 11:28 t.MYI
```

Eine `MYD`-Datei besteht aus Records - je nach Definition der Tabelle haben sie eine feste Länge oder eine variable Länge:
Solange `VARCHAR`, `TEXT` und `BLOB` nicht in einer Tabellendefinition vorkommen, haben die Records feste Längen, ansonsten eine variable Länge.
Mit `SHOW TABLE STATUS LIKE "name"` kann man das prüfen:

```console
oot@localhost [rootforum]> show table status like "t"\G
           Name: t
         Engine: MyISAM
        Version: 9
     Row_format: Fixed
           Rows: 0
 Avg_row_length: 0
    Data_length: 0
Max_data_length: 38654705663
   Index_length: 1024
      Data_free: 0
 Auto_increment: 1
    Create_time: 2006-02-11 11:28:56
    Update_time: 2006-02-11 11:28:56
     Check_time: NULL
      Collation: latin1_swedish_ci
       Checksum: NULL
 Create_options:
        Comment:
1 row in set (0.00 sec)
```

(Indem man ein Kommando im MySQL-Kommandozeilenclient nicht mit `;` oder `\g`, sondern mit `\G` abschließt, bekommt man eine vertikale Ausgabe der Daten und dies ist in manchen Fällen übersichtlicher)

Wir sehen hier, daß das Row_Format der Tabelle `t` fixed ist.
Das bedeutet, daß die Datensätze in der MYD-Datei eine feste Länge haben.
MySQL kann auf die Datensätze hier mit Datensatznummern zugreifen, statt mit Byte-Offsets zu arbeiten. 
Eine Datensatznummer oder ein Byte-Offset können bis zu 32 Bit unsigned groß sein - daraus ergibt sich eine Max_data_length von 4 GB für Row_Format:
dynamic und von 4 GB \* Datensatzgröße bei `Row_format: Fixed`.
Ist das nicht ausreichend, muss man durch Angabe der Tabellenoptionen `avg_row_length` und `max_rows` dafür sorgen, daß MySQL z.B. intern 8 Byte Zahlen zur Adressierung verwendet - dies ist aber nur empfohlen, wenn notwendig, weil es den Server generell ein wenig langsamer macht.

An den Datenbankdateien von MySQL sollte man generell nicht zu Fuß herumfummeln, solange der Datenbankserver läuft (Manche Leute trauen sich das nach einem `FLUSH TABLES WITH READ LOCK` zu, aber generell ist es besser, ein `/etc/init.d/mysql stop` zu machen, bevor man was in `datadir` anfasst).

Für eine Datensicherung ist es bei einer Default-Konfiguration ausreichend, `datadir` und die `my.cnf` zu sichern.

(geschrieben für 
[Rootforum](http://www.rootforum.de/forum/viewforum.php?f=23) 
und hier herüber geschafft zur Archivierung)
