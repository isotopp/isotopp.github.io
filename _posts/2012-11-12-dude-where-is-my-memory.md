---
layout: post
title: "Dude, where is my memory?"
author-id: isotopp
feature-img: assets/img/background/mysql.jpg
date: 2012-11-12 14:06:40 UTC
tags:
- mysql
- performance
- "lang_de"
---
"Kris, bitte schau Dir mal unsere Datenbank an.  Wir haben hier einen
Generator für unsere Materialized Views, und auf einer Datenbank von 6 GB
Größe werden 40 GB Speicher gefüllt und wir kommen sogar ins Swappen."

Na, das ist mal interessant.  The fragliche Kiste hat 48 GB RAM, und in der
Tat kaum 6 GB Daten.

```sql
mysql> select 
 -> sum(data_length+index_length)/1024/1024/1024 as gb 
 -> from tables 
 -> where table_schema not in ('information_schema', 'performance_schema', 'mysql');
+----------------+
| gb             |
+----------------+
| 5.832778930664 |
+----------------+
1 row in set (0.00 sec)
```

Aber in "top" sieht das so aus, und wächst:

```console
 7552 mysql     15   0 55.1g  43g 6888 S  0.7 91.7 499:13.56 mysqld 
```

Das wird sicher interessant.

Der Zwilling dieser Maschine zeigt ähnliches Verhalten, aber auf einem niedrigeren Level. 

Wenn es um Speicherprobleme und Swap geht, dann schaue ich routinemäßig erst
mal die <a
href='http://blog.jcole.us/2010/09/28/mysql-swap-insanity-and-the-numa-architecture/'>numa_maps</a>
der Maschine an.  Aber sie und ihr Zwilling sind gut ausbalanciert.

Der Zwilling:

```console
# /usr/local/booking-mysql/numa-maps-summary.pl < /proc/25996/numa_maps 
N0        :      1777572 (  6.78 GB)
N1        :      1777759 (  6.78 GB)
active    :           37 (  0.00 GB)
anon      :      3553604 ( 13.56 GB)
dirty     :      3553605 ( 13.56 GB)
mapmax    :          237 (  0.00 GB)
mapped    :         1783 (  0.01 GB)
```

Wir starten den Server mal neu, um zu sehen, ob das Problem reproduzierbar
ist.  Ich zwinge den InnoDB Buffer Pool auch mal 10 GB kleiner, nur um
sicherzugehen, daß wir da nichts falsch zu groß eingestellt haben.


![Speichersituation](/uploads/memory-problem.png)
Die alte Speichersituation, und nach einem Neustart eine um 10 GB
verkleinerter `innodb_buffer_pool_size`.

Das scheint in der Tat das Problem zu beheben, aber wir haben immer noch
eine InnoDB Buffer Pool Nutzung, die um den Faktor 3-4 oberhalb der
Datengröße liegt, und das ist kaum zu erklären.  Auch die Resident Set Size
(RES) in top ist immer noch viel größer als die Datengröße.

Was passiert hier wirklich?  Wenn ich doch nur in den Buffer Pool
hineinschauen könnte.

Moment mal. Ich kann:

```sql
mysql> select version();
+--------------+
| version()    |
+--------------+
| 5.6.6-m9-log |
+--------------+
1 row in set (0.00 sec)
mysql> select table_name 
-> from tables 
-> where table_name like 'innodb_buffer%';
+--------------------------+
| table_name               |
+--------------------------+
| INNODB_BUFFER_PAGE_LRU   |
| INNODB_BUFFER_PAGE       |
| INNODB_BUFFER_POOL_STATS |
+--------------------------+
3 rows in set (0.00 sec)
```

Nach dem Nachlesen von <a
href='http://dev.mysql.com/doc/refman/5.6/en/innodb-buffer-page-table.html'>INFORMATION_SCHEMA.INNODB_BUFFER_PAGE</a>
bekomme ich

```sql
mysql> select page_type, 
-> count(*) * 16384/1024/1024 as mb  
-> from INNODB_BUFFER_PAGE 
-> group by page_type order by mb;
+-------------------+----------------+
| page_type         | mb             |
+-------------------+----------------+
| TRX_SYSTEM        |     0.01562500 |
| IBUF_FREE_LIST    |     0.12500000 |
| INODE             |     0.15625000 |
| FILE_SPACE_HEADER |     0.23437500 |
| EXTENT_DESCRIPTOR |     0.32812500 |
| IBUF_BITMAP       |     0.45312500 |
| SYSTEM            |     2.03125000 |
| ALLOCATED         |    24.50000000 |
| UNDO_LOG          |    27.75000000 |
| INDEX             |   585.70312500 |
| BLOB              |  5073.81250000 |
| UNKNOWN           | 21932.60937500 |
+-------------------+----------------+
12 rows in set (4.48 sec)
```

und vermutlich ein monumentales globales 5-Sekunden-Lock auf dem Buffer
Pool, um dieses Ergebnis zu erzeugen.  UNKNOWN ist in Wahrheit freier
Speicher im Buffer Pool der soeben neu gestarteten Box.  5 GB sind in BLOBs,
und das scheint der Kern unseres Problems zu sein.  INDEX sind die Daten in
den Tabellen ('PRIMARY') und die sekundären Indices.  Und der Rest ist
Systemspeicher und sieht nicht krank aus.

Die Frage ist also: Was ist mit dem ganzen BLOB-Speicher da?  Wo kommt der
her?  Leider nutzen uns table_name und index_name hier gar nix, wenn der
page_type BLOB ist:

```sql
mysql> select page_type,
-> table_name, 
-> index_name, 
-> count(*) * 16384 /1024/1024 as mb 
-> from INNODB_BUFFER_PAGE 
-> group by page_type, table_name, index_name 
-> order by mb;
+-------------------+-----------------------------+-----------------------+----------------+
| page_type         | table_name                  | index_name            | mb             |
+-------------------+-----------------------------+-----------------------+----------------+
...
| UNDO_LOG          | NULL                        | NULL                  |    27.75000000 |
| INDEX             | md2/kb_...                  | PRIMARY               |   141.48437500 |
| INDEX             | md2/kb_...                  | PRIMARY               |   430.87500000 |
| BLOB              | NULL                        | NULL                  |  5073.81250000 |
```


Aber es gibt eine SPACE id, und die kann über INNODB_SYS_TABLESPACES
aufgelöst werden.  Schauen wir mal:

```sql
select page_type, 
-> table_name, 
-> index_name, 
-> sp.name, 
-> count(*) * 16384 /1024/1024 as mb 
-> from INNODB_BUFFER_PAGE as bp 
-> left join innodb_sys_tablespaces as sp 
-> on bp.space = sp.space  
-> group by page_type, table_name, index_name, bp.space 
-> order by mb;
...
| INDEX             | ...| md2/kb_...............      |   141.48437500 |
| INDEX             | ...| md2/kb_.................... |   430.87500000 |
| BLOB              | ...| md2/kb_.................... |  5073.68750000 |
...
```

Also haben wir hier eine bestimmte Tabelle, die den ganzen BLOB-Speicher
aufbraucht.  Die Definition legt das nahe:

```sql
show create table md2.kb_...\G
       Table: kb_hotel_hotelpage
Create Table: CREATE TABLE `kb_...` (
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

Diese tabelle enthält mehr oder weniger alle Template-Variablen für eine
id/action-Kombination in serialisierter Form, um die Anzahl von Queries pro
Seite zu reduzieren.  Eine normalisierte, live generierte Form der Seite
braucht eine dreistellige Anzahl von Queries, ein Zugriff auf die
vorgerechneten Daten generiert dieselbe Seite mit weniger als 7 Queries.

Wir schließen unser Debugging ab:

> Kristian> Diese Blobs, werden die oft neu berechnet?

> SimonB> Im Moment ja, weil ich sie immer aktualisiere.  Normalerweise
> würde ich das nur tun, wenn sich der Digest ändert.

> Kristian> Resident Set Size ist jetzt bei 15 GB und stabil.  Das heißt,
> wenn ich den Buffer Pool klein genug halte wird die Maschine nicht
> swappen.  Wir verbrauchen eine Menge Network Buffer zusätzlich, wegen der
> ganzen Blobs, und das ist weswegen wir so einen großen Speicher-Overhead
> pro Connection haben...  Jedenfalls ist das grad meine operative Theorie. 
> MySQL & BLOBs = ganz übler Mist.

```sql
mysql> select min(length(body)), 
-> max(length(body)), 
-> avg(length(body)) 
-> from md2.kb_...;
+-------------------+-------------------+-------------------+
| min(length(body)) | max(length(body)) | avg(length(body)) |
+-------------------+-------------------+-------------------+
|              3002 |            478883 |        24968.2430 |
+-------------------+-------------------+-------------------+
```


Das heißt, ich vermute, daß das ständige neu Schreiben der BLOBs in InnoDB
die Storage Engine dazu bringt, vorübergehend eine große Menge BLOB-Speicher
(neben dem eigentlichen Row-Speicher) zu allozieren.  Und der Per-Connection
Overhead ist größer, weil InnoDB BLOBs in den SQL-Teil von MySQL dupliziert
werden, um dann über die Network Buffer zum Client gesendet zu werden. 
Böser Overhead.

MySQL ist nicht sehr gut drain mit großen BLOBs umzugehen.  Vielleicht
sollten wir die SQL-Schicht mit HandlerSocket oder etwas anderem umgehen.
