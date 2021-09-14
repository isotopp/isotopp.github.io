---
layout: post
published: true
title: Neue Releases im Datenbankland
author-id: isotopp
date: 2011-09-13 17:40:00 UTC
tags:
- datenbanken
- mongodb
- mysql
- postgres
- lang_de
feature-img: assets/img/background/mysql.jpg
---
[MongoDB 2.0](http://www.mongodb.org/display/DOCS/2.0%2BRelease%2BNotes) 
ist draußen, und implementiert eine Reihe interessanter neuer Dinge, die ich
anderswo gerne hätte, insbesondere im Bereich 
[Replica Sets](http://www.mongodb.org/display/DOCS/2.0%2BRelease%2BNotes#2.0ReleaseNotes-ReplicaSets).

Postgres hat das 
[Release 9.1](http://www.postgresql.org/docs/9.1/static/release-9-1.html) 
draußen. Die versprochene 
[synchrone Replikation](http://www.postgresql.org/docs/9.1/static/warm-standby.html#SYNCHRONOUS-REPLICATION) 
ist jetzt verfügbar, sie ist grob vergleichbar mit der 
[Semisynchronen Replikation](http://dev.mysql.com/doc/refman/5.5/en/replication-semisync.html) 
in MySQL 5.5. Ein wesentlicher Unterschied ist, daß man bei Postgres
einzelne, bestimmte Server als synchrone Slaves benennen kann, während MySQL
nur garantiert, daß es mindestens einen (wechselnden) Slave gibt, der
synchron repliziert hat. Die Postgres-Lösung ist einfacher als Teil eines
Failover-Systems zu scripten, die MySQL-Lösung ist im Betrieb flexibler und
potentiell schneller.

Postgres 9.1 implementiert 
[Create Server](http://www.postgresql.org/docs/9.1/static/sql-createserver.html) 
und 
[Create Foreign Table](http://www.postgresql.org/docs/9.1/static/sql-createforeigntable.html), 
das ist so eine Art 
[Gegenstück zu FEDERATED](http://dev.mysql.com/doc/refman/5.5/en/federated-storage-engine.html)
in 'nicht kaputt'.

Mit 
[per-column collation support](http://www.postgresql.org/docs/9.1/static/collation.html) 
wird Postgres jetzt endlich ein wenig flexibler als in vorherigen Versionen,
in denen man Zeichensatz und Collation bei der Erstellung einer
Datenbank-Instanz global festlegen mußte. Noch immer ist man bei der Wahl
des Zeichensatzes eingeschränkt: Bei der Erstellung der Instanz wird ein
Systemzeichensatz festgelegt, der dann pro Datenbank überschrieben (und
später nicht mehr leicht geändert) werden kann. Da Postgres hinsichtlich der
Verwendung von UTF8 weniger Einschränkungen unterliegt als MySQL
(Indexlänge, hirntot implementierte MEMORY Tables) ist das weniger ein
Problem als man vermuten mag: Man verwende einfach immer utf8 und wähle die
Collation nun endlich nach Bedarf per Column.

Postgres 9.1 definiert nun ebenfalls einen 
[Transaction Isolation Level Serializable](http://www.postgresql.org/docs/9.1/static/transaction-iso.html#XACT-SERIALIZABLE), 
aber die genauen Definitionen von Transaction Isolation Levels variieren
sowieso von Implementation zu Implementation ein wenig, sodaß diese nicht
wirklich zwischen z.B. MySQL und Postgres vergleichbar sind (Dazu kommt, daß
man vermutlich etwas falsch macht, wenn man in MySQL SERIALIZABLE
tatsächlich benötigt.

Version 9.1 unterstützt nun 
[die Option UNLOGGED](http://www.postgresql.org/docs/9.1/static/sql-createtable.html) 
bei CREATE TABLE. Dies bewirkt, daß Änderungen an einer Tabelle nicht in das
Postgres WA-Log geschrieben werden. Die genauen Auswirkungen sind aus der
Sicht eines MySQL-Entwicklers schwer zu beschreiben, da sich die Datenbanken
hier zu sehr unterscheiden, als daß die Terminologie sinnvoll transferierbar
wären: Eine UNLOGGED Table kann immer noch ein Rollback durchführen, da
Postgres alte Versionen einer Row nicht in einem Undo-Log vorhält, sondern
als Bestandteil der Tabelle speichert. Es ist also nicht so, daß eine solche
Tabelle mit einer MyISAM-Tabelle vergleichbar wäre.

Eine UNLOGGED Table wird jedoch automatisch geleert, wenn die Datenbank
abstürzt oder hart angehalten wird - das ist notwendig, da das WAL bei
Postgres auch Funktionen wahrnimmt, die in MySQL etwa der Doublewrite-Buffer
übernimmt und so nicht garantiert werden kann, in welchem Zustand die Daten
sind, wenn die Datenbank beim Checkpointen einer Page in einer unlogged
Table stehen bleibt.

Da kein WAL geschrieben wird, werden UNLOGGED Tables auch nicht repliziert.
Es ist also ein wenig so wie eine Tabelle, für die SQL_LOG_BIN = 0 definiert
ist, und für die kein Redo/Undo-Log geschrieben wird, und die sich bei
Crashes verhält wie eine Memory-Tabelle, aber andererseits lockt die Tabelle
immer noch vergleichbar InnoDB, und kann auch noch ein Rollback ausführen.

Eine besonders schöne Sache in 9.1 sind 
[Common Table Expressions in DML](http://www.postgresql.org/docs/9.1/static/queries-with.html). 
Eine Common Table Expression (CTE, 'WITH') kann man sich wie eine temporäre
Tabelle vorstellen, die Daten zwischen mehreren Statements sharen kann, mit
RECURSIVE bekommt man damit auch Zeigerbäume in SQL sauber implementiert.
Seit 9.1 kann man eine CTE auch als Datenverschiebe-Statement verwenden:

```sql
WITH transferme AS (
  DELETE FROM active 
  WHERE "date"< 2011-09-01
  RETURNING *
) 
INSERT INTO inactive SELECT * FROM transferme
```

Dies definiert eine temporäre Tabelle transferme als die Daten, die von dem
Delete-Statement aus active gelöscht werden. Diese werden dann in die
Tabelle inactive eingefügt.

Außerdem gibt es mehr SELinux-Support und Python als Stored Procedure Language.
