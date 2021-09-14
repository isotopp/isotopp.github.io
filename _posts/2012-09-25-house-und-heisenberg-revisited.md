---
layout: post
published: true
title: House und Heisenberg revisited
author-id: isotopp
date: 2012-09-25 11:11:06 UTC
tags:
- datenbanken
- debug
- monitoring
- mysql
- performance
- lang_de
feature-img: assets/img/background/mysql.jpg
---
Ich habe heute an dem Problem weiter geforscht und wir haben etabliert, dass
die Ursache nicht der Quelltext des betreffenden Diamond-Collectors sein
kann.

Auf allen betroffenen Kisten habe ich dann gesehen, daß die entsprechenden
Queries gegen Performance-Schema ein

```sql
mysql> select \* from performance_schema.threads;
Empty set (0.01 sec)
```

zurück liefern. 

Weitere Untersuchung stellt heraus: P_S ist aber an. Jedoch:

```sql
mysql> select \* from performance_schema.setup_instruments;
Empty set (0.03 sec)
 
mysql> select \* from performance_schema.setup_timers;
Empty set (0.01 sec)
 
mysql> select \* from performance_schema.setup_consumers;
Empty set (0.02 sec)
```

und das bleibt auch so, sogar über Server-Restarts hinweg.  Warum ist das
so?

```console
# cd /mysql/\*/data/performance_schema/
# ls -l
total 1840
-rw-rw---- 1 mysql mysql  8624 Oct  6  2011 cond_instances.frm
-rw-rw---- 1 mysql mysql 98304 Oct  6  2011 cond_instances.ibd
-rw-rw---- 1 mysql mysql    61 Oct  6  2011 db.opt
-rw-rw---- 1 mysql mysql  9220 Oct  6  2011 events_waits_current.frm
-rw-rw---- 1 mysql mysql 98304 Oct  6  2011 events_waits_current.ibd
...
```

und ein SHOW CREATE TABLE bestätigt das. 

Damit ist klar, wieso es überhaupt zu Transaktionen kommen kann:

Der Code im Diamond-Collector setzt nur Queries gegen performance_schema ab. 
Da dort normal keine Tabellen vorhanden sind, die Transaktionen
unterstützen, kann es auch nie zu Transaktionen kommen.  In den defekten
Kisten wurden die Tabellen in performance_schema fälschlicherweise als
InnoDB erzeugt.  Das alleine hätte kein Problem erzeugt, weil jedes Kommando
in MySQL eine Transaktion in sich selbst ist - AUTOCOMMIT = 1.

Aber:

> Starting with 1.2.0, MySQLdb disables autocommit by default, as required
> by the DB-API standard (PEP-249)".

In diesem Fall generiert das Lesen von InnoDB-Tabellen den Start einer r/o
Transaktion und erzeugt einen Stable View auf alle InnoDB Tabellen.  Dieser
wird gehalten bis zum Ende der Transaktion, das niemals kommt, außer der
Collector disconnected.

Die immer weiter wachsende Größe des Undo-Logs verlangsamt den Server bis
zum Stillstand.  Ein KILL auf die Verbindung bringt nur vorübergehende
Linderung.

Der Fix ist in der Tat

```sql
# mysql -BNe "select 
  concat('drop table ', table_name, ';') 
from 
  information_schema.tables 
where 
  table_schema = 'performance_schema'" | 
mysql performance_schema
# mysql_upgrade
...
```

und alles wird gut - sogar ohne Neustart.

Die Ursache für das Seltsame Verhalten™ der betroffenen Büchsen bei einer
automatisierten Installation verbleibt weiter unklar.  Der betreffende
Collector läuft jetzt jedoch auch auf diesen Maschinen und liefert Daten.

Wie viele MySQLer bin ich der Auffassung, dass AUTOCOMMIT = 0 oder SELECT
...  FOR UPDATE eher schädlich sind.  Dies hier wird ein weiteres
ausgezeichnetes Beispiel in meinem argumentativen Arsenal sein.
