---
layout: post
published: true
title: Covering indexes und MVCC
author-id: isotopp
date: 2010-09-09 09:36:00 UTC
tags:
- innodb
- mysql
- postgres
- sql
- lang_de
feature-img: assets/img/background/mysql.jpg
---
Für viele MySQL-Anwendungen sind 
[Covering Indexes](https://en.wikipedia.org/wiki/Database_index#Covering_index) eine
wichtige Sache. Domas hat einen Artikel darüber
[Wie Wikipedia von Covering Indexes profitiert](http://mituzas.lt/2007/01/26/mysql-covering-index-performance/),
und auch sonst sind solche Indices für viele MySQLer ein täglicher
Bestandteil der Optimierungsarbeit.

Nun las ich neulich in einem Artikel eine Seitenbemerkung, daß Postgres
keine Covering Indices unterstützt und das scheint
[tatsächlich der Fall zu sein](http://www.wikivs.com/wiki/MySQL_vs_PostgreSQL#Advanced_Indexing),
auch wenn ich in der Doku selber keine Hinweise darauf gefunden habe.

Warum Postgres das nicht kann ist zunächst einmal klar: MVCC macht das sehr
schwierig. In meinem Vortrag zur InnoDB Storage Engine 
([Teil 1]({% link _posts/2008-01-30-die-innodb-storage-engine.md %}),
[Teil 2]({% link _posts/2008-02-03-die-innodb-storage-engine-konfiguration.md %}))
habe ich schon einmal beschrieben, was passiert, wenn eine Zeile in InnoDB
geschrieben wird.

![](/uploads/innodb-mvcc.png)

MVCC, nach Art von InnoDB. Der Pfeil deutet ein Rollback an.

Die überschriebene Zeile wird aus der Tabelle in das Undo Log verschoben und
mit der neuen Version der Zeile verkettet. Wird die Zeile ein weiteres Mal
geändert, wird die überschriebene Version ebenfalls aus der Tabelle ins Undo
Log verschoben und mit der aktuellsten Version verkettet. Auf diese Weise
führt aus der Tabelle-Log ein Zeiger ins Undo-Log und von dort innerhalb des
Undo-Logs eine lineare Liste zu vorhergehenden Versionen einer
Tabellenversion. Man hat also eine verkettete Liste der Historie einer
Zeile.

Ein separater Thread in InnoDB, der Purge Thread, bestimmt die älteste
Transaktion, die im System noch aktiv ist, und welche Transaktionsnummer
diese Transaktion noch sehen kann. Alle Daten aus dem Undo-Log, die noch
älter sind, können gefahrlos gelöscht werden, da sie für keine Transaktion
noch sichtbar sein können.

Postgres arbeitet ähnlich, aber nicht gleich: In Postgres verbleiben alte
Versionen einer Zeile in der Tabelle (Postgres macht keine In-Place Updates
wie InnoDB, sondern schreibt neue Versionen der Zeile an eine andere Stelle
der Tabelle), sodaß die lineare Liste von Vorgängerversionen einer Zeile
nicht im Undo-Log, sondern in der Tabelle aufgebaut wird. Dadurch wächst die
Tabelle im Laufe der Zeit durch Schreibzugriffe über alle Grenzen und alte
Versionen der Daten vergiften langsam die Datenhaltung und auch die
Index-Effizienz.

Postgres wirkt dem entgegen, indem es einen Prozeß, der dem Purge Thread von
InnoDB vergleichbar ist, ablaufen läßt: Vacuum geht zyklisch durch alle
Tabellen und entfernt Datensätze, die so alt sind, daß sie von keiner
Transaktion mehr benötigt werden. Anders als bei MySQL ist dabei jedoch mehr
Arbeit notwendig, da Platz in der Tabelle freigegeben werden muß (InnoDB
macht eine vergleichbare Mehrarbeit beim Checkpointing: Damit In-Place
Updates sicher sind, muß es einen Doublewrite Buffer verwenden und Daten
zwei Mal schreiben. Aber das ist Thema für einen anderen Artikel).

Alle diese Betrachtungen beziehen sich jedoch auf die Daten. Indices
enthalten Extrakte aus den Daten, die in Indexreihenfolge angeordnet sind,
und dann einen Zeiger auf die verbleibenden Daten, die nicht im Index
enthalten sind. Wenn man jedoch mehr als eine Version eines Datensatzes hat,
wie in MVCC, welche Version des Datensatzes indiziert man dann und wie
stellt man sicher, daß Transaktionen, die alte Sichten auf die Daten haben,
den Index dennoch zuverlässig verwenden können?

Nun haben wir in der Firma MySQL Support gekauft, und zwar von der Art, der
auch 'Consultative Support' enthält. Also schickte ich eine Supportanfrage
los, denn diese Frage ist mit Sicherheit auch für den Support selbst
interessant:

> I understand  [how InnoDB works and what MVCC is](http://mysqldump.azundris.com/categories/32-InnoDB). 
> 
> What I do not know is how Indexes in InnoDB deal with this. That is, given
> a table such as
> ```console
> CREATE TABLE T (
>   id integer not null primary key,
>   d varchar(80) charset latin1 not null,
>   index(d)
> ) engine = innodb;
> ```
> 
> and transactions that change `d` values in `t`, `id` values in `t`, delete
> `d` values in `t` or delete rows in `t`, how does InnoDB treat the index
> `d` and the index `PRIMARY` in order to 
> - make the index `d` still covering in `SELECT d from t where d =
>   'cookie'`
> - make sure that old and new values are found in queries such as
>   `SELECT id from t where d = 'cookie'`, when `d` has been changed from
>   `keks` to `cookie` in a transaction that has been comitted, but other
>   connections still have an old consistent read view on the previous state
>   of things.
> 
> I understand that Postgres does not have covering indexes because of such
> index problems wrt to transactions. How does InnoDB work around this?

Axel Schwenke von MySQL Support hat diese Frage beantwortet, und dabei Hilfe
von Marko Mäkelä vom InnoDB Team bekommen:

> A secondary index contains the newest version of a row, if a row update
> included the key then the old index record will be delete-marked (and
> removed later by the purge thread) and a new index record will point to
> the new version of the row.
> 
> Secondary index entries are not versioned, but each index leaf page
> carries a PAGE_MAX_TRX_ID denoting the last transaction that modified the
> page. If this is newer than the required read snapshot, then InnoDB dives
> to the clustered index for each hit from that index page to check the row
> version and will also follow to UNDO if required.
> 
> That means covering index reads might degrade to full row reads on InnoDB,
> depending on write activity and isolation level.

In Deutsch: Ein Index, der nicht der Primärschlüssel ist (und das ist bei
InnoDB und Covering Indexes immer der Fall) hat Einträge für die neuste
Version einer Zeile. Falls sich Felder einer Zeile verändern, die
Bestandteil des Index sind, dann auch für die ältere Version. Der alte
Eintrag wird zum Löschen markiert und zu einem passenden Zeitpunkt vom Purge
Thread abgeräumt.

Indexeinträge in sekundären Indices haben keine Transaktionsnummern an den
Einträgen selbst, sondern es gibt nur Einträge an den Blatt-Pages des Index,
die die Transaktionsnummer der letzten Änderung der Index-Seite enthalten.
Wenn die Seite zu neu ist, dann muß InnoDB tatsächlich den Primärschlüssel
für jede Zeile lesen, die in der Seite enthalten ist (nicht nur für die
geänderte Zeile, sondern auch für jede Zeile, die zufällig auf derselben
Index-Blattseite gespeichert ist) und für die Zeilen, die durch den
Schreibzugriff tatsächlich verändert worden sind, in das Undo-Log gehen, um
alte Versionen der Daten zu finden. Das impliziert auch, daß ein Covering
Index für diese Situation zu einem normalen Zeilen-Read führen kann (den man
ja gerade vermeiden will) und dann für die tatsächlich geänderten Zeilen
sogar noch einen Abstieg in das Undo-Log nach sich zieht, je nach
Schreiblast und Isolation Level, der für den Reader eingestellt ist.

Mal sehen, ob ich das noch mal irgendwann in eine coole Zeichnung gießen
kann, um zu verdeutlichen, was da genau vor sich geht. Auf jeden Fall:
Danke, MySQL Support - das ist genau der Grund, warum wir bei Euch
einkaufen!
