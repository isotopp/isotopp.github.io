---
layout: post
published: true
title: MySQL Undo Log
author-id: isotopp
date: 2011-04-28 12:40:01 UTC
tags:
- datenbanken
- innodb
- mysql
- lang_de
feature-img: assets/img/background/mysql.jpg
---
![](/uploads/undo_log_stats.png)

"Kris, kannst Du bitte mal gucken?"

Seit heute morgen, 10:00 Uhr, wächst das Undo Log immer weiter an.

Immer wenn InnoDB Daten schreibt wird die alte Version einer Zeile aus der
Tabelle in das Undo-Log verschoben, also physikalisch von der ibd-Datei der
Tabelle in die ibdata1 im Datadir von MySQL. In der Tabelle wird in der
veränderten Zeile ein Zeiger von der neuen Version auf die alte Version der
Zeile im Undo-Log installiert, der Roll(back)-Pointer. Die alte Version im
Undo-Log zeigt mit ihrem eigenen Roll-Pointer auf eine noch ältere Version
derselben Zeile und so weiter - es entsteht für jede Zeile in der Datenbank
eine lineare Liste von Versionen in die Vergangenheit einer Row.

Der InnoDB Purge Thread hat die Aufgabe, das Undo Log zu verkürzen. Wenn er
das nicht tut, dann sieht das so aus wie oben im Graphen gezeigt. Dafür kann
es zwei Gründe geben: Purge Lag - also mehr Writes als der Purge Thread
wegschaffen kann. Oder lang laufende Transaktionen. Denn der Purge Thread
kann nur dann eine Zeile aus dem Undo Log streichen, wenn es keine aktive
Transaktion mehr im ganzen System gibt, die älter ist als die zu streichende
Zeile.

Das ist die weitaus wahrscheinlichere Fehlerquelle. Wie also finden wir den
Schuldigen?


```sql
mysql> pager grep ACTIVE
mysql> show engine innodb status\G
...
---TRANSACTION A90E003AB, ACTIVE 16830 sec, process no 12098, OS thread id 1749563712
...
mysql> pager
mysql> show engine innodb status\G
...
---TRANSACTION A90E003AB, ACTIVE 16830 sec, process no 12098, OS thread id 1749563712
3 lock struct(s), heap size 1248, 2 row lock(s), undo log entries 1
MySQL thread id 146473882, query id 4156570244 mc02cronapp-01 192.168.1.10 cron_bp
Trx read view will not see trx with id >= A90E14DE8, sees < A90E14DE8
...
```

Ein Cronjob hängt also in einer offenen Transaktion seit geraumer Zeit fest?
Mehr Informationen bekommen wir aus der Prozeßliste:

```console
mysql> pager grep cron
mysql> show processlist;
...
| 146473882 | cron_bp       | mc02cronapp-01:50154 | bp   | Sleep       |   16434 |
...
```

Ein Login auf der mc02cronapp-01 und ein "lsof -i -n -P | grep 50154" zeigt
schnell: Mitnichten ein Cronjob. Ein User hat einen MySQL
Kommandozeilenclient gestartet und eine manuelle Verbindung und Transaktion
offen gelassen. Ein "KILL 146473882" auf den Thread in MySQL trennt die
Verbindung und der Purge Thread kann seine Arbeit fortsetzen, ein Sysadmin
mit einem Cluebat kann zu dem User dispatched werden.

Das Undo-Log ist Teil der ibdata1-Datei. Diese startet mit einer Größe von
10M und wächst per Default in Schritten von 8M im autoextend-Modus. Lang
laufende Transaktionen, die den Purge Thread anhalten, führen zu einem
Wachstum der ibdata1. InnoDB schrumpft Dateien niemals, und es gibt auch
keine Methode, das zu tun - zwar wird der Platz _in_ der Datei
freigegeben und später wieder genutzt, aber für das Betriebssystem ist der
Platz verloren.

```console
[root@mc01bpmdb-01 ~]# cd /mysql/bp/data
[root@mc01bpmdb-01 data]# ls -lh ibdata*
-rw-rw---- 1 mysql mysql 1.3G Apr 28 14:50 ibdata1
```

