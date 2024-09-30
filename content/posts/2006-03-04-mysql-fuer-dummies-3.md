---
author: isotopp
date: "2006-03-04T17:00:00Z"
feature-img: assets/img/background/rijksmuseum.jpg
tags:
- mysql
- lang_de
title: MySQL für Dummies (3)
---

Suchen dauern auf unserer Tabelle sehr lange.

```console
root@localhost [rootforum]> select * from t where i = 1163012190;
+----------+--------------+---------------------------+------------+
| id       | d            | e                         | i          |
+----------+--------------+---------------------------+------------+
| 19999993 | vrciabekkgcb | ykdewonxucqpwtdvzgnschyaw | 1163012190 |
+----------+--------------+---------------------------+------------+
1 row in set (21.81 sec)

root@localhost [rootforum]> select * from t where i = 944905110;
+----+--------------+---------------------------+-----------+
| id | d            | e                         | i         |
+----+--------------+---------------------------+-----------+
|  5 | kgiyuxheibsa | bipgdpnvetowphowepuerediy | 944905110 |
+----+--------------+---------------------------+-----------+
1 row in set (19.94 sec)

root@localhost [rootforum]>
[1]+  Stopped                 mysql -u root -p
h743107:~ # free -m
             total       used       free     shared    buffers     cached
Mem:          1010        996         13          0          7        781
-/+ buffers/cache:        208        802
Swap:         3074          3       3071
h743107:~ # fg
mysql -u root -p
```

An diesem Beispiel können wir sehen, daß eine Suche auf unseren Daten immer so um die 20 Sekunden lang dauert.
Dabei spielt es keine Rolle, ob die zu suchenden Daten am Anfang oder am Ende der Tabelle stehen, weil wir ja mit dem SELECT-Kommando nach allen Vorkommen des gesuchten Wertes graben müssen - MySQL muss also durch die ganze Tabelle laufen und alle 20 Millionen Werte abprüfen.

Die zweite Query ist auch nicht viel schneller als die erste Query, weil die zu durchsuchenden Daten größer sind, als der dem System zur Verfügung stehende Buffer Cache (Spalte `cached` bei `free -m`).

Wenn wir an diese Query ein `LIMIT 1` anfügen, bekommen wir ein variables Zeitverhalten: 
Werte am Anfang der Tabelle werden schnell gefunden, während eine Suche nach Werten am Ende der Tabelle sehr lange dauert:

```console
root@localhost [rootforum]> SELECT * from t where i = 944905110 limit 1;
+----+--------------+---------------------------+-----------+
| id | d            | e                         | i         |
+----+--------------+---------------------------+-----------+
|  5 | kgiyuxheibsa | bipgdpnvetowphowepuerediy | 944905110 |
+----+--------------+---------------------------+-----------+
1 row in set (0.00 sec)

root@localhost [rootforum]> SELECT * from t where i = 1163012190 limit 1;
+----------+--------------+---------------------------+------------+
| id       | d            | e                         | i          |
+----------+--------------+---------------------------+------------+
| 19999993 | vrciabekkgcb | ykdewonxucqpwtdvzgnschyaw | 1163012190 |
+----------+--------------+---------------------------+------------+
1 row in set (20.97 sec)
```

Führt man eine bereits einmal durchgeführte Query noch einmal aus, bekommt man die Antwort sehr, sehr schnell, denn MySQL hat einen Query Cache, der einmal gestellte Queries wiedererkennen kann und dann einfach noch einmal das alte Result-Set abspielt, statt die Query tatsächlich noch einmal auszuführen.
Dabei kommt es auf die Schreibweise an.
Schon das unterschiedliche "S" bei den folgenden beiden Queries sorgt dafür, daß MySQL die Query nicht mehr als "alt" erkennt, sondern neu ausführen muss.

```console
root@localhost [rootforum]> select * from t where i = 1163012190;
+----------+--------------+---------------------------+------------+
| id       | d            | e                         | i          |
+----------+--------------+---------------------------+------------+
| 19999993 | vrciabekkgcb | ykdewonxucqpwtdvzgnschyaw | 1163012190 |
+----------+--------------+---------------------------+------------+
1 row in set (0.00 sec)

root@localhost [rootforum]> Select * from t where i = 1163012190;
+----------+--------------+---------------------------+------------+
| id       | d            | e                         | i          |
+----------+--------------+---------------------------+------------+
| 19999993 | vrciabekkgcb | ykdewonxucqpwtdvzgnschyaw | 1163012190 |
+----------+--------------+---------------------------+------------+
1 row in set (20.64 sec)
```

Auch ein INSERT in eine Tabelle kann natürlich das Result-Set einer Query verändern. 
Daher muss eine Query aus dem Query Cache gelöscht werden, wenn ihre Base Table verändert wird. 
Der Query Cache kann auch mit dem Kommando `FLUSH QUERY CACHE` absichtlich gelöscht werden.

```console
root@localhost [rootforum]> insert into t values ( 20000001, "keks", "keks", 3);
Query OK, 1 row affected (0.06 sec)

root@localhost [rootforum]> select * from t where i = 1163012190;
+----------+--------------+---------------------------+------------+
| id       | d            | e                         | i          |
+----------+--------------+---------------------------+------------+
| 19999993 | vrciabekkgcb | ykdewonxucqpwtdvzgnschyaw | 1163012190 |
+----------+--------------+---------------------------+------------+
1 row in set (19.77 sec)
```

Diese Query geht nicht in den Query Cache:

```console
root@localhost [rootforum]> flush query cache;
Query OK, 0 rows affected (0.00 sec)

root@localhost [rootforum]> select sql_no_cache * from t where id = 1000;
+------+--------------+---------------------------+-----------+
| id   | d            | e                         | i         |
+------+--------------+---------------------------+-----------+
| 1000 | tgnqufoiygkr | knkosawojeknkcmsodwdnorkd | 295436531 |
+------+--------------+---------------------------+-----------+
1 row in set (20.12 sec)

root@localhost [rootforum]> select sql_no_cache * from t where id = 1000;
+------+--------------+---------------------------+-----------+
| id   | d            | e                         | i         |
+------+--------------+---------------------------+-----------+
| 1000 | tgnqufoiygkr | knkosawojeknkcmsodwdnorkd | 295436531 |
+------+--------------+---------------------------+-----------+
1 row in set (20.28 sec)
```

Die Konfiguration des Query Cache erfolgt über Variables in der `[mysqld]`-Sektion der `/etc/my.cnf` und kann wie folgt ausgegeben werden:

```console
root@localhost [rootforum]> show variables like "query_cache%";
+------------------------------+----------+
| Variable_name                | Value    |
+------------------------------+----------+
| query_cache_limit            | 1048576  |
| query_cache_min_res_unit     | 4096     |
| query_cache_size             | 33554432 |
| query_cache_type             | ON       |
| query_cache_wlock_invalidate | OFF      |
+------------------------------+----------+
5 rows in set (0.00 sec)
```

Das `query_cache_limit` bestimmt, wie groß der Result Set einer Query maximal sein kann, damit er in den Query Cache Eingang findet.
Das Cachen von sehr großen Result Sets würden den Query Cache fluten und andere, wichtigere Queries aus dem Cache drängen.
Speicher wird dabei in Blöcken von `query_cache_min_res_unit` Bytes verbraucht - auch eine einzeilige Query verbraucht also 4 KB im Cache, wenn man dies nicht verkleinert.
Das ist vor allen Dingen dann lohnend, wenn sehr viele kleine Result Sets zu verwalten sind.

Die `Query_Cache_Size` legt fest, wie viel RAM wir für den Query Cache reservieren wollen. 
Die Größe des Query Cache muss man ein wenig variieren, und dabei die Ergebnisse mit `SHOW STATUS` kontrollieren.

Der Query_Cache_Type kann `0` (OFF), `1` (ON) oder `2` (ON DEMAND) sein.
Ist er auf `0`, werden alle anderen Parameter ignoriert und der Cache ist aus. 
Ist er auf `1`, werden alle Queries, für die dies möglich ist, in den Cache gelegt - Queries mit `PREPARE` statt `SELECT`, Queries, die Funktionsaufrufe enthalten, die `NOT DETERMINISTIC` sind (`rand()`, `now()` und so weiter), und Queries, die mit `SQL_NO_CACHE` markiert sind, können nicht in den Cache. 
Ist er auf `2`, werden Queries nicht in den Cache gelegt, außer sie sind ausdrücklich mit `SQL_CACHE` markiert.

Wenn auf einer Tabelle durch eine schreibende Operation ein Write Lock gelegt wird, können Queries aus dem Query Cache dennoch beantwortet werden.
Will man dies nicht, will man also durch ein passendes `LOCK TABLES` sicher alle Reader anhalten, dann muss man `query_cache_wlock_invalidate` auf `1` (ON) stellen.

```console
root@localhost [rootforum]> show status like "qc%";
+-------------------------+----------+
| Variable_name           | Value    |
+-------------------------+----------+
| Qcache_free_blocks      | 1        |
| Qcache_free_memory      | 33538984 |
| Qcache_hits             | 6        |
| Qcache_inserts          | 11       |
| Qcache_lowmem_prunes    | 0        |
| Qcache_not_cached       | 9        |
| Qcache_queries_in_cache | 6        |
| Qcache_total_blocks     | 14       |
+-------------------------+----------+
8 rows in set (0.00 sec)

root@localhost [rootforum]> show status like "com_select";
+---------------+-------+
| Variable_name | Value |
+---------------+-------+
| Com_select    | 21    |
+---------------+-------+
1 row in set (0.00 sec)
```

Der Status des Query Cache kann mit `SHOW STATUS LIKE 'qc%'` abgefragt werden.
Der Query Cache hier ist noch fast ganz frei:
In den `SHOW VARIABLES` waren 33554432 Byte konfiguriert und hier sind noch 33538984 Byte frei.
Der freie Speicher ist nicht fragmentiert, sondern liegt an einem Stück vor.
Der Cache hat dabei `6` Qcache_hits gehabt, dem stehen `21` Select-Kommandos entgegen, die nicht gecacht worden sind (ein Select zählt ENTWEDER `qcache_hits` ODER `com_cache` hoch).

Die Resultate von `11` Queries sind im Qcache abgelegt worden, und der Cache ist bisher noch niemals wegen Überlauf gepruned (also teilweise gelöscht worden).
`9` Queries konnten nicht gecacht werden, aus welchen Gründen auch immer, `6` Queries liegen derzeit im Cache.

Wenn man wissen will, ob der eigene Query Cache groß genug ist, sollte man im Abstand von einigen Stunden einmal die `Qcache_lowmem_prunes` ansehen, und überprüfen, ob hochzählen. 
Wenn dies passiert, ist der Query Cache übergelaufen.
`Qcache_free_memory` und `Qcache_free_blocks` sollte man ebenfalls im Auge behalten: 
Wenn der `Qcache_free_blocks` Counter groß wird, ist der Query Cache fragmentiert und man muss unter Umständen mit einer kleineren Blockgröße (`query_cache_min_res_unit`) experimentieren.
Es kann sinnvoll sein, die `com_select`, `qcache_hits`, `qcache_inserts`, `qcache_lowmem_prunes` und `qcache_free_memory` sowie `qcache_free_blocks` minütlich auszulesen und in ein RRD zu plotten.

(geschrieben für
[Rootforum](http://www.rootforum.de/forum/viewforum.php?f=23)
und hier herüber geschafft zur Archivierung)
