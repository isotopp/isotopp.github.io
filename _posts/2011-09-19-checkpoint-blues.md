---
layout: post
published: true
title: Checkpoint Blues
author-id: isotopp
date: 2011-09-19 20:00:00 UTC
tags:
- datenbanken
- innodb
- mysql
- postgres
- lang_de
feature-img: assets/img/background/mysql.jpg
---
Wer 
[dies]({% link _posts/2008-01-30-die-innodb-storage-engine.md %}) und
[dies]({% link _posts/2008-02-03-die-innodb-storage-engine-konfiguration.md %}) gelesen hat, versteht mehr.

InnoDB ist eine Storage Engine, die mit Hilfe von
[MVCC](http://en.wikipedia.org/wiki/Multiversion_concurrency_control)
Transaktionen implementiert. Transaktionen zu implementieren
bedeutet, daß man in der Lage ist, mehrere Änderungen
zusammenzufassen und als eine Einheit als gültig zu markieren
oder zurück zu nehmen. Damit das Ganze trotzdem schnell ist, muß
man ein wenig herumtricksen.

Angenommen, wir wollen eine Spalte in einer Zeile in der Tabelle t ändern: 

```sql
UPDATE t SET x=17 WHERE id=3
```

Dann muß InnoDB das zunächst einmal in eine Zeilennummer in
einer Speicherseite übersetzen: InnoDB speichert Daten in Seiten
von 16 KB (Defaultgröße) ab, und macht allen I/O in Richtung
Tablespace immer nur in ganzen Seiten. In unserem Beispiel
bedeutet das also, daß wir die Seite p lokalisieren müssen, in
der die ID=3 der Tabelle t gespeichert ist, und diese ganze
Seite in den Speicher laden.

![](/uploads/checkpoint1.png)

Laden der benötigen Seite in den Speicher. Aufbau der
Transaktion im Log Buffer und Ändern der Seite im
Speicher.

InnoDB lädt die Seite also aus dem Tablespace-File in den InnoDB
Buffer Pool, und baut im Speicher die Transaktion auf. Dazu wird
im Log Buffer die Transaktion gebastelt und parallel dazu die
Speicherseite im InnoDB Buffer Pool angepaßt. Die alte Version
der betroffenen Zeile wird außerdem in das Undo Log verschoben
(dies ist nicht mit eingezeichnet, weil es in diesem Text nicht
darum gehen soll). Die geänderte Speicherseite im RAM wird nicht
zurück geschrieben - der Inhalt der Seite im RAM und auf der
Platte divergieren, die Seite ist DIRTY (hier: rot markiert).

![](/uploads/checkpoint2.png)

Beim COMMIT wird der Log Buffer in das Redo-Log geschrieben. Es
besteht eine Verknüpfung zwischen der geänderten Speicherseite
und der Transaktion im Redo-Log.

Beim COMMIT wird der Log Buffer ins Redo Log geschrieben. Die
geänderte Speicherseite (rot: DIRTY) wird immer noch nicht
zurück geschrieben.

Hätten wir stattdessen ein ROLLBACK durchgeführt, hätte InnoDB
die alte Version der Zeile aus dem Undo-Log geprökelt und die
Änderung zurück genommen - es wäre niemals zu einem
Schreibzugriff im Redo-Log gekommen, und die DIRTY Page im
Speicher wäre wieder CLEAN.

Zwischen dem Eintrag im Redo-Log und der als DIRTY markierten
Speicherseite besteht eine Verbindung, denn irgendwann einmal
muß die Seite ja doch geschrieben werden. InnoDB versucht das
aber so gut es geht zu verzögern: Schreiben in das Redo-Log ist
viel schneller als Schreiben in den Tablespace.

Zum einen werden im Redo-Log nur die Änderungen notiert, nicht
ganze Speicherseiten. Daher ist das Volumen der Daten im
Redo-Log pro Transaktion meistens kleiner als das Volumen der
als DIRTY markierten Pages.

Und anderen ist es so, daß das Redo-Log ungefähr das Erste ist,
was eine neue MySQL-Instanz bei der Inbetriebnahme als Dateien
anlegt. Die Dateien sind also, wenn man alles richtig gemacht
hat, in einem leeren oder fast leeren Dateisystem angelegt
worden und nur sehr wenig fragmentiert. Da sie als Ringpuffer
benutzt werden und niemals neu angelegt werden, bleibt diese
Eigenschaft stabil über die Lebensdauer der Datenbank erhalten.

Schließlich ist es so, daß die Daten in InnoDB ja in der
Reihenfolge der Primärschlüsselwerte abgespeichert werden. Wählt
man diesen geschickt, dann ist es so, daß häufig zusammen
angesprochene Daten auch physikalisch zusammen auf derselben
InnoDB Speicherseite stehen. In diesem Fall ist es
wahrscheinlich, daß eine bereits als DIRTY markierte Page noch
ein weiteres Mal in naher Zukunft geändert wird. Hätte man die
Änderung bereits zurück geschrieben, wäre die Seite wieder CLEAN
und würde gleich wieder als DIRTY markiert werden, um dann
wiederum neu geschrieben werden zu müssen.

Das Schreiben ins Redo-Log sichert also die Minimalmenge an
Daten in einer Datei, die für lineares Schreiben optimiert ist,
und verkleinert die zu schreibende Datenmenge, indem uns
ermöglicht wird, das Zurückschreiben von ganzen Speicherseiten
zu verzögern  und Änderungen zu aggregieren, ohne die
D-Eigenschaft (Durability) von ACID zu verlieren.

![](/uploads/checkpoint3.png)

Beim Checkpoint werden aus den ältesten Redo-Log einträgen
Speicherseiten bestimmt, die zurück geschrieben
werden.

Irgendwann einmal müssen wir aber auch Speicherseiten zurück
schreiben. InnoDB guckt sich dabei die ältesten Einträge im
Redo-Log an und sucht die von diesen Einträgen referenzierten
Speicherseiten. Sobald eine gewisse Menge (1MB, 64 Seiten) an
Seiten gefunden ist, werden diese in den Tablespace zurück
geschrieben. Dies bezeichnet man als Checkpoint.

Der Checkpoint setzt also DIRTY Pages auf CLEAN und gibt
zugleich wieder Speicher im Redo-Log der Datenbank frei.

Dabei schreibt InnoDB Speicherseiten in zwei Schritten zurück:
Eine einzelne Seite (16 KB) ist größer als ein Plattenblock.
Wenn also das System mitten beim Schreiben einer Seite stehen
bleibt, könnte es vorkommen, daß eine Seite zur Hälfte auf dem
neuen und zur Hälfte auf dem alten Stand ist. InnoDB verhindert
das, indem ein Satz von 64 Speicherseiten zunächt einmal in den
Doublewrite-Buffer (nicht eingezeichnet) geschrieben wird, das
Redo-Log als frei markiert wird und dann dieselben Seiten erst
an Ort und Stelle geschrieben werden.

Bei einem Crash mitten im Schreiben in den Doublewrite-Buffer
ist nichts verloren: Das System kann die ungeänderten Seiten aus
dem Tablespace angeln, das Redo-Log anwenden, um diese im
Speicher auf den neuen Stand zu patchen und dann ganz normal
checkpointen.

Bei einem Crash mittem im Schreiben in den Tablespace ist
ebenfalls nichts verloren: Das System fischt die neuen Versionen
der Pages aus dem Doublewrite-Buffer und kopiert diese an die
richtigen Stellen im Tablespace um.

## Drucksituationen

Die Datenbank führt normalerweise einen Checkpoint aus, wenn sie
sich langweilt: Ist InnoDB einige Zeit idle, wird irgendein
Thread im System sich des Redo-Logs annehmen und die DIRTY Pages
der Reihe nach lustig weg-checkpointen. Nach einer gewissen Zeit
hat man 0 Redo-Log und 0 DIRTY Pages.

![](/uploads/checkpoint4.png)

Anteil des genutzten Redo-Log in einem MySQL 5.1 mit
InnoDB-Plugin.

Wenn das fragliche System jedoch sehr beschäftigt ist und über
eine längere Zeit eine kontinuierliche Schreiblast sieht, dann
kann es passieren, daß gar nicht genug Idle-Zeiten vorhanden
sind, um über diesen Prozeß Daten weg zu checkpointen. Im Bild
oben sieht man eine InnoDB-Instanz mit Schreiblast und einem
viel zu kleinen ib_logfile{0,1} von nur 2 x 128 MB. Nach einer
Nachtpause wird das System wieder aktiv und bekommt genug
Schreiblast, um im Redo-Log eine Art Backlog aufzubauen. Ab kurz
nach 8 Uhr morgens ist die Last so groß, daß das genutzte
Redo-Log fest auf ca. 50% Nutzung steht und das System
kontinuierlich gezwungen ist, Daten nach hinten raus zu
checkpointen.

![](/uploads/checkpoint5.png)

Menge der DIRTY-Pages derselben Maschine.

In einem anderen Graphen sieht man die Menge der DIRTY-Pages
derselben Maschine - die Gesamtgröße des innodb_buffer_pool
dieser Box ist 40 GB, der Anteil der Dirty-Pages ist also auch
zu Spitzenzeiten kaum höher als 5%. Da das Redo-Log jedoch
vergleichsweise klein ist, geht von dort ausreichend
Schreibdruck aus, um Checkpoints zu erzwingen.

Es ist auch erkennbar, daß die Größen von Redo-Log und
DIRTY-Pages nicht eng gekoppelt miteinander korrellieren: Zählt
man in einer Schleife immer wieder denselben Zähler hoch
("UPDATE x SET z=z+1 WHERE id=1"), dann erzeugt man jede Menge
Redo-Log, aber arbeitet immer auf derselben einen DIRTY Page
rum. Andererseits kann man eine ID zufällig auswählen und dann
nur ein einziges Bit in dieser Zeile ändern - dies würde eine
zufällige, ganze 16 KB Page als DIRTY markieren, aber kaum
Redo-Log erzeugen.

## Checkpoint Blues

Checkpointing bei InnoDB korrekt hin zu bekommen ist
frustrierend schwierig: Die Größe des Logfiles ist bei InnoDB
[mehr oder weniger unveränderlich](http://dev.mysql.com/doc/refman/5.5/en/innodb-data-log-reconfiguration.html)
über die Lebensdauer der Installation. Andererseits möchte man
das Checkpointen so lange als möglich herauszögern, damit man
keine unnötige Schreiblast erzeugt (gerade geschriebene Pages
werden durch weitere Änderungen wieder als DIRTY markiert).

Der Checkpointing-Algorithmus von InnoDB spielt also 17+4:
Zögert er zu lange, läuft das Redo-Log voll, oder es sind keine
Seiten im Buffer Pool mehr vorhanden, die nicht als DIRTY
markiert sind. Dann muß das System einen Checkpoint erzwingen
und hält alle Schreibzugriffe notgedrungen an, bis wieder Platz
vorhanden ist. Das will man um jeden Preis vermeiden.
Checkpointed der Algorithmus aber zu aggressiv, kommt es zu
einer erhöhten Schreiblast im Plattensubsystem und die Datenbank
kann nicht mit maximaler Performance schreiben.

Der perfekte Algorithmus müßte in die Zukunft schauen können: Er
könnte anhand des noch vorhandenen Platzes, der Schreibkapazität
der Spindeln und der kommenden Schreiblast maximal spät mit dem
Schreiben anfangen.

Das ist offensichtlich unmöglich, und nicht perfekte Algorithmen
verhalten sich im Benchmark etwa wie
[dieses MySQL 5.5](http://www.mysqlperformanceblog.com/2011/09/18/disaster-mysql-5-5-flushing/):

In einer Maschine mit einem großen Buffer Pool (72G) und einem
großen Logfile (3.8G) kommt es immer wieder zu Schreibstürmen,
während derer die Datenbank mit dem Checkpointen so beschäftigt
ist, daß sie keine oder kaum noch Kommandos ausführt - im
Beispiel schafft es der Tester, die Datenbank wiederholt für
Perioden von 4 Minuten lahm zu legen.

## Zum Vergleich: Postgres

Postgres hat dasselbe Problem zu lösen: Auch hier haben wir eine
Datenbank mit MVCC, die Transaktionen loggt und als DIRTY
markierte Pages im Speicher zu halten versucht. Drei Dinge sind
grundsätzlich anders:

Zum Ersten hat Postgres kein Undo-Log: Alte und neue Versionen
einer Zeile stehen in der Tabelle selbst. Diese "versandet" im
Laufe der Zeit immer mehr, d.h. alte Versionen einer bestimmten
Zeile blähen die Tabelle auf ein mehrfaches der minimal
notwendigen Größe auf, im Index und in den Daten. Postgres
kompaktiert Tabellen durch einen im Hintergrund laufenden Prozeß
namen Vacuum, der alle Tabellen reihum durchgeht und veraltete
Daten löscht.

Zum Zweiten hat Postgres keinen ausdrücklichen
Doublewrite-Buffer. Stattdessen wird im Redo-Log (Postgres nennt
es WAL: Write-Ahead-Log) eine Mixtur von ganzen Seiten und
geänderten Zeilen abgelegt. Wenn eine Page vom Zustand CLEAN in
den Zustand DIRTY wechselt, dann schreibt Postgres die ganze,
bei Postgres nur 8 KB große Seite ins WAL. Wenn eine DIRTY Page
weiter geändert wird, dann wird, wie bei InnoDB auch, nur die
Änderungsinformation für die Zeile ins WAL geschrieben.

Stirbt Postgres im Checkpoint beim Schreiben eines Blocks im
Tablespace, dann kann die alte Version des Blocks aus dem WAL
gepult werden und mit den weiteren, ebenfalls dort geloggten
Änderungen auf Stand gebracht werden.

Und zum Dritten ist das WAL bei Postgres nicht in seiner Größe
begrenzt, sondern wird als fortlaufende Folge von numerierten
WAL-Files analog zum MySQL-Binlog geschrieben. Unter Druck kann
es wie bei InnoDB vorkommen, daß die Datenbank mit dem
Checkpointen von DIRTY-Pages nicht hinterher kommt - der Anteil
an WAL-Files, der in einer Recovery nach eine Crash benötigt
werden würde, wächst so immer weiter über alle Grenzen hinaus.

Aber dafür kann es nicht vorkommen, daß die Datenbank die
Ausführung von Kommandos verzögern muß, um Platz in ihren Logs
zu schaffen - im Falle eines Crashes gibt es jedoch keine obere
Grenze für die Recovery-Zeit, und für die WAL-Dateien gibt es
keine Fragmentierungs-Garantien (das läßt sich durch das Führen
der WAL-Dateien in einem separaten Dateisystem aber unter
Kontrolle bringen).

Die Checkpointing-Strategien von Postgres und InnoDB arbeiten
also unter grundsätzlich anderen Vorraussetzungen und sind nicht
leicht vergleichbar.
