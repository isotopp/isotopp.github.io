---
layout: post
published: true
title: 'Gruppenweises TOP N in MySQL: Der Tabellengrößenreport'
author-id: isotopp
date: 2010-03-09 15:47:19 UTC
tags:
- hack
- mysql
- sql
- lang_de
feature-img: assets/img/background/mysql.jpg
---

Jeder Datenbankserver bei uns hat ein Script laufen, daß den Inhalt von
information_schema.tables jede Nacht einmal in eine Systemdatenbank in das
DBA Schema kopiert. Dort haben wir dba.table_sizes:

```sql
root@sysmdb [dba]> show create table table_sizes\G
       Table: table_sizes
Create Table: CREATE TABLE `table_sizes` (
  `hostname` varchar(64) NOT NULL,
  `datadir` varchar(64) CHARACTER SET latin1 COLLATE latin1_bin NOT NULL,
  `report_date` date NOT NULL,
  `table_schema` varchar(64) CHARACTER SET latin1 COLLATE latin1_bin NOT NULL,
  `table_name` varchar(64) CHARACTER SET latin1 COLLATE latin1_bin NOT NULL,
  `engine` varchar(64) NOT NULL,
  `data_length` bigint(20) NOT NULL,
  `index_length` bigint(20) NOT NULL,
  `table_rows` bigint(20) NOT NULL,
  UNIQUE KEY `hostname` (`hostname`,`datadir`,`report_date`,`table_schema`,`table_name`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1
1 row in set (0.00 sec)
```

Gesucht war nun eine Query, die für jeden Sonntag eine Liste der 10 größten
Tabellen eines bestimmten Servers 'master' für 2010 produziert.

Die Lösung ist fragil insofern, als daß sie eine undokumentierte Eigenschaft
des Servers ausnutzt. Aber sie ist auch schnell.

```sql
set @old := "", @count := 0; 
select \* from (
  select 
    @count := if(@old <=> report_date, @count+1, 0) as c, 
    @old   := report_date as report_date,
    hostname, 
    table_name, 
    (data_length+index_length)/1024/1024/1024 as gb 
  from 
    table_sizes 
  where
    date_format(report_date, '%W') = 'Sunday' and 
    report_date > '2010-01-01' and
    hostname = 'master' and 
    datadir = '/mysql/bp/data/' and
    table_schema = 'bp' 
  order by 
    report_date, gb desc 
  ) as t 
where 
  t.c < 10
;
```

Wir definieren einen Zustandsspeicher @old, der das report_date der
folgenden Zeile speichert und einen Zähler @count. Sessionvariablen (die
@-Variablen da) haben einen impliziten Typ, und @old verhält sich anders
(falsch), wenn es mit 0 initalisiert wird.

Im inneren SELECT zählen wir @count um eins hoch, wenn report_date sich
nicht ändert, oder setzen es auf 0, wenn report_date sich geändert hat. Der
<=>-Operator ist dabei failsafe gegenüber NULL-Werten. Danach, und das ist
wichtig, aktualisieren wir @old mit dem aktuellen report_date, und danach
geben wir die Werte aus, an denen wir interessiert sind. Die WHERE-Clause
der inneren Query wählt dabei die Daten aus, an denen wir interessiert sind:
Sonntage aus 2010, Daten vom Master, von der Instanz mit dem passenden
datadir, und dort aus dem passenden Schema. Das sortieren wir dann.

Die Ausgabe hat nun eine laufende Nummer c, die aus dem Hochzählen von
@count resultiert. Dieser Zähler wird an report_date-Wechseln zurückgesetzt.
Mit der äußeren Query schneiden wir nun alle Werte ab, bei denen der Zähler
zu hoch ist.

Die Query ist fragil, und ein übler Hack, da sie auf der internen
Ausführungsreihenfolge des SQL-Statements basiert. Sie kann bei jedem
Upgrade des Servers plötzlich fehlschlagen, weil sich Serverinterna ändern.
