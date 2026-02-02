---
author: isotopp
date: "2006-03-03T17:00:00Z"
feature-img: assets/img/background/rijksmuseum.jpg
tags:
  - mysql
  - lang_de
title: MySQL für Dummies (2)
aliases:
  - /2006/03/03/mysql-fuer-dummies-2.html
---

Für die folgenden Beispiele wird eine breitere Tabelle gebraucht, und es müssen auch einige Testdaten vorhanden sein.
Daher hier einmal eine Tabellendefinition und ein Generatorscript für Testdaten:

```console
root@localhost [rootforum]> drop table t;
Query OK, 0 rows affected (0.00 sec)

root@localhost [rootforum]> create table t ( id bigint unsigned not null, d char(12) not null, e char(25) not null, i integer unsigned not null );
Query OK, 0 rows affected (0.22 sec)
root@localhost [rootforum]>
[1]+  Stopped                 mysql -u root -p
```

und

```console
h743107:~ # cat gendata.pl
#! /usr/bin/perl -w

my $limit = 20000000; # 20 Mio

for (my $i=0; $i&lt;$limit; $i++) {
  $str1 = "";
  for (my $j=0; $j&lt;12; $j++) {
    $str1 .= chr(97+26\*rand());
  }

  $str2 = "";
  for (my $j=0; $j&lt;25; $j++) {
    $str2 .= chr(97+26\*rand());
  }
  $x = int(rand()\*2\*\*31);
  printf qq("$i","$str1","$str2","$x"\n);
}
h743107:~ # ./gendata.pl > /tmp/data.csv
h743107:~ # head -10 /tmp/data.csv
"0","uvhgnbjklavf","fnwnwuwphwjcnuufzzbdjswpt","466412497"
"1","sfnyjtjcljyr","puccvmiqgujqetgkwmwzdjefs","940962493"
"2","fbdjnejvhkar","wwpfrdpasbztljviehzojgwyf","1417468689"
"3","lqwgrvcmygqz","aazxhpetwqlkdwuaxwvhmhtsl","1393448064"
"4","tvfucewatbhp","zayvtprykglnynesavekdnpwr","1565437858"
"5","kgiyuxheibsa","bipgdpnvetowphowepuerediy","944905110"
"6","qpgyhtohyfut","uxajpmyegbgaoexdyxnfsetpg","323176798"
"7","fdpzsnkfvird","mpkqpcfgelhtxnszqremviuzk","1486742441"
"8","awvwzzthakbe","slgfbakiuoggaulehscqxvoct","143366617"
"9","drqdiqggqfos","hoigxngyrgwebyavcgugiixnm","1264096349"
h743107:~ # wc -l /tmp/data.csv
20000000 /tmp/data.csv
h743107:~ # ls -lh /tmp/data.csv
-rw-r--r--  1 root root 1,3G 2006-02-11 12:00 /tmp/data.csv
h743107:~ # fg
mysql -u root -p        (wd: /var/lib/mysql)
root@localhost [rootforum]> load data infile "/tmp/data.csv" into table t fields terminated by "," enclosed by '"';
Query OK, 20000000 rows affected (1 min 45.35 sec)
Records: 20000000  Deleted: 0  Skipped: 0  Warnings: 0
root@localhost [rootforum]>
[1]+  Stopped                 mysql -u root -p
h743107:~ # ll /var/lib/mysql/rootforum/
insgesamt 977552
drwx------  2 mysql mysql       4096 2006-02-11 11:48 .
drwxr-xr-x  5 mysql mysql       4096 2006-02-11 11:52 ..
-rw-rw----  1 mysql mysql         65 2006-02-11 11:26 db.opt
-rw-rw----  1 mysql mysql       8628 2006-02-11 11:48 t.frm
-rw-rw----  1 mysql mysql 1000000000 2006-02-11 12:04 t.MYD
-rw-rw----  1 mysql mysql       1024 2006-02-11 12:04 t.MYI
```

Wir erzeugen hier eine Tabelle mit einem `UNSIGNED BIGINT "id"` (8 Byte), zwei `CHAR` Spalten `d` und `e` von 12 und 25 Zeichen Breite und einer Spalte `i INTEGER UNSIGNED`.
Alle Werte sind, wie sich das gehört, NOT NULL.

Das Generatorscript füllt diese Spalten mit aufsteigenden Werten für `id`, zufälligen Texten für `d` und `e` und mit Zufallszahlen für `i`.
Es braucht auf meinem MR2 gut 20 Minuten, um eine 1.3 GB große Loader-Datei mit 20 Mio Datensätzen zu erzeugen.
Der Load erfolgt dann mit dem relativ schnellen LOAD DATA INFILE Kommando.
Da keine Indices mitzuführen sind, geht der Load mit 105 Sekunden (190000 Rows/sec, 12380 KB/sec) über die Bühne.
Das ist etwa 1/3 der Bruttogeschwindigkeit der Platte, und daher relativ akzeptabel.

Die resultierende MYD-Datei verbraucht 50 Byte/Record und ist `Fixed`, sodass 100 Mio Bytes (954 MB) für Datenfile verwendet werden. 
Ein Index wird nicht erzeugt, weil keiner definiert ist, daher ist die MYI-Datei minimal groß.

Die Daten sind drin:

```console
h743107:~ # fg
mysql -u root -p

root@localhost [rootforum]> show warnings;
Empty set (0.00 sec)

root@localhost [rootforum]> select count(*) from t;
+----------+
| count(*) |
+----------+
| 20000000 |
+----------+
1 row in set (0.01 sec)

root@localhost [rootforum]> show table status like "t"\G
           Name: t
         Engine: MyISAM
        Version: 9
     Row_format: Fixed
           Rows: 20000000
 Avg_row_length: 50
    Data_length: 1000000000
Max_data_length: 214748364799
   Index_length: 1024
      Data_free: 0
 Auto_increment: NULL
    Create_time: 2006-02-11 11:48:23
    Update_time: 2006-02-11 12:04:41
     Check_time: NULL
      Collation: latin1_swedish_ci
       Checksum: NULL
 Create_options:
        Comment:
1 row in set (0.00 sec)
```

Die `Data_length` bei `SHOW TABLE STATUS` gibt also die Größe der MYD-Datei an, die `Index_length` ist die Größe der MYI-Datei.
`Data_free` sagt, daß in der MYD-Datei keine Lücken existieren.

Das ist sehr wichtig, wenn in eine MyISAM-Tabelle mit `INSERT` Daten eingefügt werden: 
Neue Werte werden nun *am Ende* der MYD-Datei angefügt, und zwar ohne Locking - `SELECT` können also auf diese Tabelle ausgeführt werden, ohne sich mit den `INSERT` um den Zugriff zu prügeln - aber das funktioniert nur, solange `Data_free: 0` ist.

In Fixed-Tabellen ist es recht leicht, Data_free auf 0 zu bekommen - da alle Records gleich groß sind, wird das irgendwann einmal sicher der Fall sein, wenn Daten eingefügt werden und man kann mit der `Avg_row_length` und dem Wert aus `Data_free` leicht ausrechnen, wann das der Fall sein wird. 
`OPTIMIZE TABLE` schließt die Lücken auch, kann aber sehr lange dauern, und sobald das erste Mal aus der Tabellen mitten rausgelöscht wird, ist das gute OPTIMIZE wieder beim Teufel.

Mit MyISAM MERGE-Tables oder mit MySQL 5.1 DATA PARTITIONS kann man Tabellen bauen, aus denen sich Daten löschen lassen, ohne Lücken aufzureißen.
`Data_free` bleibt dann immer schon 0 und `Concurrent_insert` kann durchgeführt werden.

```console
root@localhost [rootforum]> show variables like "concurrent%";
+-------------------+-------+
| Variable_name     | Value |
+-------------------+-------+
| concurrent_insert | ON    |
+-------------------+-------+
1 row in set (0.00 sec)
```

Man kann sich dies in der `[mysqld]`-Sektion seiner `/etc/my.cnf` leicht konfigurieren (`concurrent_insert = 1`).

(geschrieben für
[Rootforum](http://www.rootforum.de/forum/viewforum.php?f=23)
und hier herüber geschafft zur Archivierung)
