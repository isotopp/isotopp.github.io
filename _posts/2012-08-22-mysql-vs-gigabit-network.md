---
layout: post
published: true
title: MySQL vs. Gigabit Network
author-id: isotopp
date: 2012-08-22 10:01:00 UTC
tags:
- debug
- mysql
- networking
- performance
- lang_de
feature-img: assets/img/background/mysql.jpg
---
Wir generieren eine neue Art von 
[Materialized View]({% link _posts/2012-08-15-materialized-view.md %})
mit dem bekannten Generator-Setup:

![Materialized View Generator](/uploads/queue.png)

Das neue Setup unterscheidet sich in der Logik von denen, die wir bisher
verwendet haben, und so kommt es beim Testlauf zu einem ungewöhnlichen und
unerwarteten Ereignis:

![Network: Bytes/second](/uploads/replication5-network.png)

Um 14:30: Ein Gigabit-Netzwerk mit 125 MB/sec ausgelastet.

Bei einem Probelauf gehen die Alarme los, weil der Gigabit-Netzwerkstrang
zur Datenbank mit 125 MB/sec (Ein Gigabit/sec) vollständig ausgelastet ist. 
Wie man sehen kann, ist die Datenbank zu diesem Zeitpunkt nicht besonders
beschäftigt:

![MySQL: Queries/s](/uploads/replication4-statement.png)

Um 14:30: Keine auffällig hohe Anzahl von Queries/s.

Auch auf dem Binlog ist nichts besonderes zu sehen:

![Binlog: Bytes/s](/uploads/replication3-binlog.png)

Keinerlei Ausschläge bei der Binlog-Größe - Replikation ist ja sonst immer
wieder gerne genommen, um ein Netzwerksegment vollständig zu füllen.

Und auch der lokale Change auf der Datenbank hält sich in extrem
überschaubaren Grenzen:

![MySQL: InnoDB Checkpoint Age](/uploads/replication2-checkpoint.png)

Maximal 400 MB aktives Redo-Log auf einer Maschine mit 50GB oder 100GB
Buffer Pool sind verschwindend gering.

Wie man sehen kann, ist das Redo-Log der Datenbank zum Zeitpunkt des
Vorfalls weit unter 400 MB groß.  Auf einer Datenbank mit einem Buffer Pool
von 50-100 GB bedeutet das einen verschwindend geringen Anteil von noch
nicht zurückgeschriebenen Änderungen.

Auch die CPU der Maschine ist unauffällig - ein Multicore-Server mit einer
Auslastung um die 100% (ein Core Busy) ist extrem entspannt.

![System: CPU Usage](/uploads/replication1-cpu.png)

Multicore-Server mit einer CPU-Auslastung in der Gegend von einem Core.

Was zum Teufel geht hier vor?

Das wird schnell deutlich, denn man ein paar Dinge prüft, die mit dem Test
zu tun haben.  Die relevante Tabelle sieht so aus:

```sql
mysql> show table status like '...'\G
           Name: ...
         Engine: InnoDB
...
 Avg_row_length: 77539
...
1 row in set (0.00 sec)
mysql> show create table ...\G
       Table: ...
Create Table: CREATE TABLE `...` (
  `id` mediumint(8) unsigned NOT NULL,
  `body` mediumblob NOT NULL,
  `digest` binary(20) NOT NULL,
  `last_change` int(10) unsigned NOT NULL,
  `last_check` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `last_check` (`last_check`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1
1 row in set (0.00 sec)
```


Wir haben hier also ein System, bei dem Daten materialisiert und als Blob
mit dem Namen 'body' in der Tabelle gespeichert werden.  Ist der Blob schon
vorhanden und auf Stand, muß der Blob selber nicht geändert werden, aber es
wird das Feld 'last_check' aktualisiert.

Außerdem ist Row Based Replication konfiguriert: 

```sql
mysql> show global variables like 'binlog_format'\G
Variable_name: binlog_format
        Value: ROW
1 row in set (0.00 sec)
```


Nun verhält es sich aber mit 
[RBR folgemdermaßen](http://dev.mysql.com/doc/refman/5.6/en/replication-options-binary-log.html#sysvar_binlog_row_image):

>In MySQL row-based replication, each row change event contains two images,
> a “before” image whose columns are matched against when searching for the
> row to be updated, and an “after” image containing the changes.  Normally,
> MySQL logs full rows (that is, all columns) for both the before and after
> images.

Wir haben also eine Average Row Length von 77539 Bytes, und wir loggen für
jede Änderung die komplette Row zweimal: einmal in der alten und einmal in
der neuen Version.  Wir schreiben also im Schnitt 140 KB, wenn ein
last_changed Feld von 4 Bytes geändert wird.

Außerdem ist: 

```sql
mysql> select count(command) as c from processlist where command = 'binlog dump';
+----------+
| c            |
+----------+
|       45 |
+----------+
1 row in set (0.00 sec)
```

Wir drücken diese 140 KB pro Change also an 45 unabhängige Slaves raus (das
ist hier hauptsächlich der Tatsache geschuldet, daß das Zielsystem
eigentlich eine leicht andere Aufgabe hat und für diese Tests, die
eigentlich keinen meßbaren Impact hätten haben sollen, zweckentfremdet
wurde).

Das Problem ist in MySQL 5.6 gelöst, wo man mit der neu eingeführten
Variable 
[binlog-row-image](http://dev.mysql.com/doc/refman/5.6/en/replication-options-binary-log.html#sysvar_binlog_row_image)
und den Modi 'noblob' und 'minimal' auf die Übertragung der ungeänderten
Blobs verzichten kann.

In MySQL 5.5 löst man das Problem mit einer künstlichen 1:1- oder
1:0-Relation, die die Blobs in einer gesonderten Tabelle speichert und so
isoliert.

In normalen Umständen, also ohne Blob oder Text-Typen, sind RBR-Logfiles
zwischen 50% und 66% kleiner als SBR (Statement Based Replication)-Logfiles. 
Nur bei extrem breiten Rows explodiert dies.

Man beachte, daß der Master diese Last auf der linken Backe absitzt.  Er
zeigt tatsächlich auch nicht mal meßbar Disk-I/O, weil er seine Slaves aus
dem File System Buffer Cache bedient.
