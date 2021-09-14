---
layout: post
published: true
title: Der Herr House und der Herr Heisenberg haben Replication Delay
author-id: isotopp
date: 2012-09-24 19:24:19 UTC
tags:
- datenbanken
- debug
- monitoring
- mysql
- performance
- lang_de
feature-img: assets/img/background/mysql.jpg
---
Heute erreicht mich eine Mail, in der ein DBA sich über steigende
Replication Delay in einer bestimmten Replikationshierarchie beschwert.

Das ist schlecht, denn die betreffende Hierarchie ist wichtig. Also die
'Wenn die nicht geht schlafen Leute unter Brücken'-Art von wichtig.

Die Theorie war, daß die Änderungsrate in dieser Hierarchie so hoch ist, daß
die Schreiblast von MySQL Replikation, die ja Single Threaded ist, nicht
mehr bewältigt werden kann.  Für diese Theorie sprach nach dem ersten
Augenschein, daß alle betroffenen Kisten keine lokalen Platten hatten,
sondern auf einem Filer lagen, und Filer sterben wegen der hohen
Kommunikationslatenz im SAN bei uns in der Regel weit vor lokalen Platten,
wenn es um Replikation geht: Filer sind mehr so beim parallelen Schreiben
mit mehreren Threads gut.

Wenn dem so wäre, wäre das schon einen Seufzer wert, denn die betreffende
Replikationshierarchie war gerade beim Reengineering auf dem OP und sollte
eigentlich derzeit kaum ausbeutbare Technical Debt haben.  Wenn die trotzdem
Replication Delay akkumuliert, dann haben wir ein ernstes Problem.

Nun bin ich jemand, der Lügen gewohnt ist.  Leute lügen.  Und Maschinen
lügen auch.  Aber schauen wir erst mal ins
[Monitoring](http://graphite.wikidot.com/) und schauen wie schlimm es ist. 
Ich greife mir einen Host aus der angeblich kränkelnden Hierarchie:

![Graph: Replication Delay Monitor]({{ site.baseurl }}/uploads/replication-delay1.png)

Der brandneue Replication Load Monitor ist ein tolles Spielzeug.

Wir sehen eine Weiterentwicklung einer [Idee](http://www.markleith.co.uk/2012/07/24/a-mysql-replication-load-average-with-performance-schema/)
von Mark Leith: Mit Hilfe des Performance Schema überwachen wir,
womit der SQL Thread der MySQL Replikation denn so seine Zeit verbringt und
wieviel Prozent einer jeden Zeitscheibe er idle ist.

Mein SQL Thread auf der von mir zufällig herausgesuchten Maschine bringt
etwa 20% seiner Zeit mit InnoDB Log IO zu und weitere 10-20% mit InnoDB Data
IO.  60% sind Idle.  Montag irgendwann nach 13 Uhr hat jemand dann in Panik
'innodb_flush_log_at_trx_commit = 2' gesetzt und damit fällt die InnoDB Log
IO-Wartezeit komplett weg (Data IO natürlich nicht).

Wie dem auch sei, _so_ sieht der Graph einer überlasteten Hierarchie
nicht aus.  Wir haben möglicherweise ein Problem auf einigen Servern der
Hierarchie, aber definitiv nicht auf diesem.  Damit ist aber auch klar, daß
das Problem nicht vom Master her kommen kann.  Gute Nachrichten!

Weiteres Nachbohren ergibt eine Liste von betroffenen Servern.  Zwei von
denen sind Qualitätssicherungssysteme, die haben keinen Speicher und
interessieren mich nicht.  Eines ist eine potentielle Produktionskiste, die
derzeit aber vor sich hin idled.  Die hat Speicher, und ist trotzdem
langsam.

Seit wann?  Ich schnappe mir den Replication Delay Graph und zoome einmal
raus.  Das Problem besteht seit dem 20-Sep nachmittags, sagt der Graph.

Also zoome ich mich durch alle Graphen dieser Kiste für den 20-Sep und
schaue einmal was mir da noch entgegen kommt.

![Graph: Betroffener Rechner]({{ site.base_url }}/uploads/replication-delay2.png)

Krankheitsbild: Akute und lebensbedrohliche DML-Schwäche seit Mitte des
20-Sep.

Es ist offensichtlich, daß der Eimer ein Problem hat: Irgendwann am 20-Sep
Nachmittags ist der von  150/250/50 I/U/D auf infinitesimal kleine Werte
runter, und zwar nicht ruckartig wie bei einer Konfigurationsänderung,
sondern in einer Entladungskurve, als ob sich irgendetwas zu zieht. 
Irgendwann am 21-Sep ist es der kranken Box dann noch mal ruckartig besser
gegangen und wieder zieht sie sich dann bis zum Stillstand zu.

Das ist doch schon mal ein guter Hinweis: Erstens suchen wir fast sicher
nicht nach einem direkten Config Change und zweitens sehen wir an dem Spike
dahinter, daß Recovery möglich ist.

Wir suchen nicht nach einem direkten Config Change, und das ist gut so, denn
es hat in letzter Zeit auch keine solchen gegeben:

```sql
root@dba-master-01 [dba]> select 
  new.report_date, 
  new.config_variable, 
  old.config_value, 
  new.config_value 
from 
  v_global_variables as old join v_global_variables as new on 
    old.hostname = new.hostname and 
    old.config_variable = new.config_variable and 
    old.report_date + interval 1 day = new.report_date
where 
  old.hostname like @host and 
  new.hostname like @host and 
  old.config_value != new.config_value and 
  old.report_date > now() - interval 6 month;
+-------------+----------------------------+--------------+--------------+
| report_date | config_variable            | config_value | config_value |
+-------------+----------------------------+--------------+--------------+
| 2012-04-20  | thread_cache_size          | 100          | 500          |
| 2012-05-12  | innodb_max_dirty_pages_pct | 20           | 75           |
+-------------+----------------------------+--------------+--------------+
2 rows in set (0.82 sec)
```

Weiteres Wühlen im Graphite bringt Erleuchtung, denn wir finden das Inverse
des Activity Patterns hier:

![Graph: InnoDB Undo Log Length](/uploads/replication-delay3.png)

Die Causa: Der InnoDB Purge Thread hat seine Arbeit Mitte des 20-Sep
eingestellt, zuckt noch einmal kurz und idled dann lustig weiter.  Sollte
[Captain Undo Log]({% link _posts/2011-04-28-mysql-undo-log.md %})
wieder unterwegs sein und mit dem Baseballschläger ausgeloggt
werden wollen?

Eine kurze Inspektion der Prozeßliste zeigt nur zwei andere
Kandidatenprozesse, einer ist ein root-User und einer ist ein cacti-Login. 
Mein Geld wette ich auf den root-user, ein kurzes Rumfragen auf dem Jabber
und danach ein KILL auf die Connection-ID von dem Gesellen wird mir zeigen,
ob ich Recht habe oder nicht: Wer nicht im Live-Channel auf dem Jabber ist
wird sich schon melden, wenn ihm die Verbindungen wegfliegen.

Der Effekt ist...  Null.

Also gut.  Dann kriegt halt der Cacti auf's Maul, weil ich grad schlechte
Laune habe.

![Graph: QPS & Undo Log Size](/uploads/replication-delay4.png)

Nach Zufuhr einer passenden Dosis Laxativ (DBA KILL forte N) spontane
Erholung, aber nach kurzer Linderung ein Wiedereinsetzen der Symptomatik.

Herzallerliebst.  Wir haben das Gegenteil eines Stehaufmännchens - ein
Fallumchen.  Immer wenn der Cacti User eine Kelle kriegt, fällt das Undo Log
wunschgemäß in sich zusammen und die Performance geht rauf.  Danach zieht es
sich in kürzester Zeit wieder zu und wir fallen auf das alte Niveau runter.

Der alte Trick mit der Processlist klappt auch hier wieder: Das Login kommt
von

```console | 6694419 | cacti | <hostname>:44467 |
performance_schema | ```

Moment.  performance_schema?  Cacti?

Nein.  Das ist nicht cacti.

```console lsof -i -n -P | grep 44467 mysqld 17242 mysql 178u
# IPv6 3599986352 TCP
...:3306->...:44467 (ESTABLISHED) diamond 18596 root 1u IPv4 3599986351 TCP
...:44467->10.147.206.122:3306 (ESTABLISHED) ```

Ja.  Das ist diamond, der Datenkollektor für Graphite.

Und welches Modul von Diamond/Graphite ist am 20-Sep nachmittags global
ausgerollt worden?

```console cd /etc/graphite/collectors ls -l MySQL*conf
...
-r-------- 1 root root 471 Sep 20 14:19 MySQLPerfCollector.conf 
```

Der Replication Load Monitor.  Ja, der da ganz oben im ersten Bild.

Der liest zwar nur, aber aus irgendeinem Grund macht er das auf einigen
Promille aller Boxen, und nur in dieser Replikationshierarchie!, in einer
REPEATABLE READ read-only Transaction.  Und die macht Diamond beim Login
einmal auf und hält sie dann für immer und ewig, es sei denn, die
Diamond-MySQL-Verbindung kippt, aus welchen Gründen auch immer, um.  Und da
die Verbindung auch nie Idle ist, timed sie auch nie aus.

Kurze Zeit nachdem Puppet dem Diamond die `MySQLPerfCollector.conf` auf
`enabled = false` gesetzt hat haben wir eine dauerhafte Recovery:

![Graph: Replication Delay](/uploads/replication-delay5.png)

Natürliche Recovery nach Beseitigung der Ursache, ganz ohne KILL.

Wir lernen:

- Monitoring kann Performance-Effekte haben.  Okay, 
  [keine neue Erkenntnis](http://blog.wl0.org/2012/09/checking-procnuma_maps-can-be-dangerous-for-mysql-client-connections/)
- So ein Undo-Log und langlaufende Transaktionen können einen ganz schön runter ziehen.  Okay, 
  auch keine neue Erkenntnis.
- Es lag nicht an der Replikationslast, und auch nicht am Filer, auch wenn das gerade Mode ist, 
  in diese Richtung zu blamen.
- Und Graphite ist meine Hündin.

![House: Everybody lies](/uploads/replication-delay6.jpg)

Was House sagt.

Morgen schauen wir dem `MySQLPerfCollector.py` mal tiefer in die Eingeweide.
