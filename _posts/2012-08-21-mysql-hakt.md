---
layout: post
published: true
title: MySQL hakt...
author-id: isotopp
date: 2012-08-21 14:24:29 UTC
tags:
- debug
- mysql
- performance
- lang_de
feature-img: assets/img/background/mysql.jpg
---
"Hey, Kris!  Wir haben zwischen 16:20 und 17:20 CEST einen Lasttest
durchgeführt und kurz vor 17:00 Uhr einen unerklärlichen Spike und einen
Leistungsabfall festgestellt.  Kannst Du mal gucken?"

Klar kann ich.  Wo ich arbeite machen wir etwas, das wir
[Testing in Production]({% link _posts/2011-12-02-testing-in-production.md %})
nennen.

Für Lasttests bedeutet das, daß wir einzelne Systeme im Loadbalancer so
lange relativ höher gewichten bis sie Probleme bekommen und umfallen.  Zur
Kontrolle legen wir mit Apache Siege eine Reihe von Sensor-Requests in das
zu testende System, nicht zur Lastgenerierung, sondern um zu sehen, wann die
Latenz nach oben geht, also um Sättigung des zu testenden Systems zu
bemerken bevor es Fehler zu generieren beginnt.

Wenn wir nahe an den Sättigungspunkt gelangen, erhöhen wir die Last in sehr
winzigen Schritten, bis wir tatsächlich Systemversagen zu beobachten
beginnen und können so nicht nur die Lastgrenze, sondern auch die Symptome
beim Systemversterben genau und unter realistischen Bedingungen ermitteln. 
Das macht die Arbeit im Operations Team sehr viel einfacher.

Wenn ein System aber Probleme hat und dann bei statischer Load zurück kommt,
liegt eine andere Situation vor.  Es ist wichtig herauszufinden, was genau
hier passiert.

Hier die Metriken:

![MySQL: Replication Delay](/uploads/mysql-problem1-replication-delay.png)

Replication Delay legt das Krisenfenster in die Zeit zwischen 16:53 (Delay
Spike) und 17:00 (Recovery).

Zur selben Zeit auch ein Disk Read Spike.  Read Spikes sind ungewöhnlich,
weil das betreffende System so dimensioniert ist, daß es seinen Working Set
praktisch vollständig im Hauptspeicher halten kann:

![System: Disk I/O Operations](/uploads/mysql-problem2-disk-read-spike.png)

Das fragliche System soll operativ für alle praktischen Zwecke gar nicht von
der Platte lesen.

Wir können nun nach weiteren Quellen für ungewöhnliches Verhalten suchen:
CPU und Connections gehen von 16:52 bis 17:00 hoch, aber es gibt keine Row
Acces Spikes, keine Spikes bei Tmp-Tables-to-disk und auch keine Spikes bei
Sortiervorgängen, insbesondere Merge Sorts.

Der InnoDB Buffer Pool Graph hat am Ende den entscheidenden Hinweis:

![MySQL: InnoDB Buffer Pool Usage](/uploads/mysql-problem3-buffer-pool-drop.png)

16:52 - InnoDB Buffer Pool _verkleinert_ sich.

Um 16:52 verkleinert sich der InnoDB Buffer Pool.  Das tritt im Normalfall
nur dann auf, wenn Speicherseiten im Pool freigegeben werden, und das
wiederum kann nur dann geschehen, wenn eine Tabelle mit TRUNCATE TABLE
zurückgesetzt oder mit DROP TABLE gelöscht wird.

Wir müssen also schauen, ob es in der Zeit von 16:50 bis 16:53
DDL-Statements gegeben haben, die Tabellen kürzen oder löschen.  Auf allen
unseren Systemen läuft zu diesem Zweck
[log_processlist](http://blog.wl0.org/2011/02/log_processlist-sh-script-for-monitoring-mysql-instances/)
das eine Reihe interessanter Dinge aus der Datenbank für post-mortem
Analysen lokal aufzeichnet und für bis zu eine Woche vorhält.

Tatsächlich findet sich: 

```console
# less 16_52.innodb.gz
...
SQL: SELECT * FROM INFORMATION_SCHEMA.INNODB_TRX
910556099       RUNNING 2012-08-08 16:51:59     
  NULL    NULL    0       2       
  TRUNCATE TABLE tmp_gethoteldescriptiontranslations
  truncating table        1       1       0       376
  0       0       0       
  REPEATABLE READ 1       1       
  NULL    0       10000
...
```

Der Pileup entsteht durch eine Folge von DDL-Locks, die durch ein
Wartungsscript erzeugt werden.  Das Script lädt eine neue Tabelle in die
Datenbank, tauscht die aktive Tabelle mit der neuen Tabelle aus und setzt
die alte Tabelle dann zurück bevor es sie löscht.

[Background Table Drop](http://www.mysqlperformanceblog.com/2012/06/22/drop-table-and-stalls-lazy-drop-table-in-percona-server-and-the-new-fixes-in-mysql/)
würde hier helfen, aber die fragliche Kiste ist wie ihre Geschwister noch
5.5.16 und nicht 5.5.23.
