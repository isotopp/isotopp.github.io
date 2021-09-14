---
layout: post
published: true
title: 'Verteilte Datenbanken: Der Sonderfall Filialsysteme'
author-id: isotopp
date: 2010-08-18 13:04:00 UTC
tags:
- mysql
- datenbanken
- lang_de
feature-img: assets/img/background/mysql.jpg
---
In einem Kommentar zu [Master-Master]({% link _posts/2010-08-16-master-master-und-distributed-transactions.md %}) schrieb
ich:

> Für den von Dir genannten Sonderfall der Filialsysteme habe ich noch einen
> deutschen Artikel in der Warteschlange, ich muß nur Zeit finden ihn zu
> schreiben.

Normalerweise sieht MySQL Replikation so aus: 

![](/uploads/replication.png)

MySQL Replikation - Architekturübersicht

### Master Binlog

Auf dem Master ist mit der Konfigurationsanweisung `log_bin` das Binlog
aktiviert.

Das Binlog loggt bei Statement Based Replication (SBR) alle Anweisungen, die
Daten verändern (also quasi alles außer `SELECT`). Binlog-Dateien haben
dasselbe Namensprefix und werden dann durchnumeriert. Die Datenbank beginnt
ein neues Binlog, wenn die laufende Binlog-Datei größer als
`max_binlog_size` (Default 1G) wird, wenn das Kommando `FLUSH LOGS`
ausgeführt wird oder wenn der Server neu gestartet wird.

In der Binlog-Indexdatei findet man eine Liste aller existierenden Binlogs,
man kann sie mit dem Kommando `SHOW MASTER LOGS` anzeigen lassen. Durch das
Kommando `PURGE MASTER LOGS` kann man alte Binlogs löschen - meistens macht
man so etwas wie `PURGE MASTER LOGS BEFORE NOW() - INTERVAL 3 DAY` statt ein
konstantes Datum oder einen festen Dateinamen anzugeben. Man kann die
Löschung auch automatisieren, indem man `expire_logs_days` auf einen Wert
setzt. Dann werden beim Anlegen eines neuen Binlogs alle Dateien gelöscht,
die älter als `expire_logs_days` Tage sind.

Mit dem Kommando `mysqlbinlog` kann man das Binlog lesen und in ein SQL-Script
umwandeln lassen. Dieses könnte man (ab einer gewünschten Position) einlesen
lassen, indem man im Kommandozeilenclient das Kommando `source …`' eingibt.
Auf diese Weise kann man eine Datenbank von einer bekannten Binlog-Position
manuell zu einer anderen Position vorwärts rollen lassen.

Diese Prozedur ist bei einer Recovery notwendig: Man spielt ein Full Backup
ein, das hoffentlich mit einer bekannten Binlog-Position assoziiert ist.
Dann verwendet man das Binlog, um von dieser Position zu einer gewünschten
Position (unmittelbar vor dem fatalen `DROP DATABASE` wichtig) vorwärts zu
rollen.

### Server ID

Jeder Server in einem MySQL-Replikationssystem hat eine eindeutige
Server-ID. Das ist ein 32 Bit Wert ohne Vorzeichen, der den Server eindeutig
identifiziert. Das Binlog markiert jeden Eintrag mit dieser Server-ID.
Dadurch ist es möglich, in Replikationsringen endlos kreisende Statements zu
erkennen und zu eliminieren: Ein Server wird keine Anwendungen per
Replikation ausführen, die seine eigene Server-ID enthalten.

### REPLICATION SLAVE Privilege

Replikation besteht für den Master darin, daß sich ein Slave auf dem Master
einloggt und das Kommando SHOW MASTER LOGS sowie das binäre Äquivalent von
SHOW BINLOG EVENTS ausführt. Damit er das kann, muß der Slave einen Account
auf dem Master haben, der das Privileg REPLICATION SLAVE hat.

### Slave Side

Auf dem Slave besteht Replikation aus zwei Teilen: Der `IO_THREAD` nimmt die
vier Login-Informationen (Host, Port, User und Paßwort) aus dem `CHANGE
MASTER` Statement und loggt sich auf dem Master ein. Er nimmt dann die zwei
Binlog-Positionsdaten (Binlog Name und Binlog Position), und lädt das Binlog
ab dieser Position beginnend so schnell als möglich runter. Er schreibt
diese Daten auf dem Slave in das Relay Log File. Der `SQL_THREAD` liest die
Daten aus dem Relay Log File und führt sie aus. Wenn er damit fertig ist,
löscht er das Relay Log File und wendet sich dem nächsten File aus dem Relay
Log Index zu.

## Filialsysteme

Ein Filialsystem besteht aus vielen kleinen autonomen Datenbanken in den
Filialen eines Händlers. Die Struktur der Datenbank in jeder Filiale ist
immer gleich, aber jede Filiale hat dieses Schema unter einem eigenen Namen
und mit den Daten dieser Filiale.

Das Problem besteht jetzt darin, die Daten aus den Filialen in der Zentrale
zusammen zu führen und dort dann zu aggregieren. Aus technischen Gründen ist
es nicht möglich, die gesamte Datenbank in die Zentrale zu übertragen.
Stattdessen will man täglich einmal das Delta transportieren.

Der Ansatz dazu ist ein einfacher Sharding Ansatz, bei dem wir den
Vorderteil der Replikation mißbrauchen - also den Teil auf dem Master, der
das Binlog schreibt. Das Hinterteil in der Zentrale bauen wir selber, mit
mysqlbinlog und ein paar Scripten.

Der Ansatz sieht so aus:

![](/uploads/filialen.png)

Filialsystem (mit Binlog-Transport)

Die Vorbedingungen sind: 

- Die Datenbestände der zweier beliebiger Filialen m und n sind
überlappungsfrei (sonst ist es kein Sharding).
- Schreibzugriffe in die Filialdatenbank db_n erfolgen nur in der Filiale
n.
- Die Daten in der Zentrale können hinter den Daten in der Filiale hinterher
hinken. Der Abstand ist durch die Häufigkeit des Transportes der Binlogs
wählbar.
- In den Filialen sind alle Queries mit unqualifizierten Namen geschrieben:
Man schreibt also immer INSERT INTO t
..., nie INSERT INTO db.t ….
- In der Zentrale existiert eine Schemakopie der Filiale, auf die das Delta
angewendet werden kann.

Das Verfahren ist wie folgt: In den Filialen laufen autonome Datenbankserver
mit aktiviertem Binlog. Vor einem Transport in die Zentrale wird ein `FLUSH
LOGS` gemacht. Dadurch wird ein neues Binlog begonnen und man hat einen
sauberen Cutoff-Punkt. Die Binlogs vor dem Cutoff werden archiviert und dem
Transport übergeben. Danach werden sie mit `PURGE MASTER LOGS` in der
Datenbank gelöscht (können aber im Archiv als Kopie auch in der Filiale
verbleiben).

In der Zentrale wird jedes Binlog-Set einer Filiale in ein SQL-Sourcefile
umgewandelt, durch Anwendung des Kommandos `mysqlbinlog`. Dieses File wird
dann in die Schemakopie der Filiale eingelesen und bringt diese auf Stand.

Danach kann durch Starten der Aggregationsprozesse die Datenbank der
Zentrale `db_agg` aktualisiert werden und die Daten aus allen Filialen
integrieren.

Ein Sharding (Shard = Splitter) ist ein Sonderfall einer Partition. Eine
Partition ist eine Aufteilung einer Menge derart, daß die Teile die
Gesamtmenge komplett überdecken und sich zwei Teilmengen nicht überdecken.
Bildlich kann man sich das Zerschneiden einer Torte in Stücke nicht
notwendig gleicher Größe vorstellen. Bei einer Partition liegen die
Teilstücke in der Regel auf einer Maschine, beim Sharding dürfen die
Teilstücke verteilt liegen, es kann also jeder Shard auf einer anderen,
räumlich getrennten Maschine liegen.

In unserem Beispiel stellen wir einen Shard in jede Filiale und lassen ihn
dort lokal und ohne Kenntnis der anderen Shards arbeiten. Wir zeichnen die
Änderungen im Binlog auf und spielen alle Änderungen aller Filialen in der
Zentrale ein. Das funktioniert nur deshalb, weil alle Änderungen sich immer
nur auf das Schema der Filiale beziehen.

In einem großen Zentralschema erzeugen wir durch horizontale
Aggregationsqueries quer über alle Filialschemata eine integrierte
Gesamtansicht.
