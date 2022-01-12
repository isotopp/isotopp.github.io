---
author: isotopp
date: "2006-03-06T17:00:00Z"
feature-img: assets/img/background/rijksmuseum.jpg
published: true
tags:
- mysql
- lang_de
title: MySQL für Dummies (5)
---

# Key Buffer

In dem letzten Artikel dieser Serie haben wir gesehen, wie MySQL einen Index anlegt und was dies bedeutet.
MySQL at einen Puffer, mit dem ein Index ganz oder teilweise im RAM gehalten werden kann. 
Dies ist der Key Buffer, und er ist eine sehr zentrale Konfigurationsvariable, die in der `[mysqld]`-Sektion der `my.cnf` gesetzt wird.

```console
[mysqld]
key_buffer = 100M
```

Dies stellt einen Key Buffer von bis zu 100 MB für den mysqld zur Verfügung. 
Mit den STATUS-Variablen `key_read_requests` und `key_reads` kann man dann leicht feststellen, ob dieser Puffer groß genug ist:
`key_read_requests` sollte sehr viel größer als `key_reads` sein, und zwar zwischen 100- und 1000-mal so groß.
MySQL hält dann den MyISAM-Index im RAM, und kann so Daten auf der Platte sehr schnell finden. 

Man kann bis zu 20 % des Hauptspeichers, den man MySQL zur Verfügung stellen will, in den Key Buffer investieren (auf einer 1 GB Maschine, bei der man 500 MB für MySQL und 500 MB für Apache aufwenden will, kann man den Key Buffer also 100 MB groß machen).
Der Key Buffer sollte so groß sein, wie die Summe aller verwendeten Indices ist (und wir haben ja schon gesehen, wie man die berechnen oder nachsehen kann). 
Je nach Hauptspeicher und Indexgröße ist das Dilemma nun da, und man muss auf der einen oder anderen Seite Abstriche machen. 

Das nennt der Sysadmin dann "Optimierungsaufgabe" und der Betriebswirtschaftler hat auch ein Wort dafür: "Investitionsbedarf".
Man sieht deutlich die verschiedenen Herangehensweisen der beiden Disziplinen an Probleme.

# Locks und Locking

Wie wir in den vergangenen Ausgaben dieser Serie auch gesehen haben, kann es Datenbankoperationen geben, die vergleichsweise lange dauern.
Es kann sein, daß eine solche Operation während dieser Zeit ein `LOCK` auf einer Tabelle erzeugt. 
MyISAM kennt zwei Arten von Locks und sie gelten immer für die gesamte Tabelle - MyISAM kann nicht Bereiche einer Tabelle oder gar einzelne Zeilen locken.

Ein `SHARED LOCK` oder `READ LOCK` erlaubt dem Lockinhaber den Lesezugriff auf eine Tabelle, und erlaubt gleichzeitig weitere Lesezugriffe durch andere Threads.
Schreibende Threads werden jedoch ausgesperrt und müssen warten.
Ein `EXCLUSIVE LOCK` oder `WRITE LOCK` erlaubt dem Lockinhaber und nur diesem den Schreibzugriff auf die Tabelle.
Alle anderen Threads, egal ob sie lesen oder schreiben wollen, müssen warten.

Ein Thread, der wartet, sieht so aus:

```console
root@localhost [rootforum]> show processlist\G
     Id: 7
   User: root
   Host: localhost
     db: rootforum
Command: Query
   Time: 0
  State: NULL
   Info: show processlist

     Id: 8
   User: root
   Host: localhost
     db: rootforum
Command: Query
   Time: 422
  State: copy to tmp table
   Info: alter table t add index (i)

     Id: 9
   User: root
   Host: localhost
     db: rootforum
Command: Query
   Time: 205
  State: Locked
   Info: insert into t values (20000001+1, "keks", "keks", 17)
3 rows in set (0.00 sec)
```

Hier ist der Thread mit der ID 9 im State: `Locked`, denn er versucht auf die Tabelle `t` zu schreiben.
`t` wird jedoch gerade vom Thread 8 bearbeitet, der die Tabelle dazu mit einem Lock belegt hat. 
Das INSERT-Kommando hängt nun an seinem Prompt und kommt nicht zurück. 
Erst nachdem das `ALTER TABLE` durchgelaufen ist, kann das INSERT-Kommando ausgeführt werden. 
Wenn man so eine Ausgabe ("Locked") in seinem eigenen `SHOW PROCESSLIST` sieht, womöglich für mehr als ein Kommando in Folge, dann ist es quasi schon zu spät - der MySQL-Server braucht dringend eine tunende Hand.

Hier noch einmal die Ausführungszeit:

```console
root@localhost [rootforum]> insert into t values (20000001+1, "keks", "keks", 17);
Query OK, 1 row affected (8 min 9.49 sec)
```

Ein Blick ins Slow-Query-Log bringt dann noch mehr Information. 
Dort wird für jede lange dauernde Query nämlich neben der absoluten Query_time auch noch die `Lock_time` mit aufgeführt.
Ist diese nicht 0, weiß man, daß der Server ein Problem mit seinen Locks hat.

Das ist eine sehr unangenehme Situation, die man unbedingt vermeiden möchte. 
Denn wenn man sich mit der Performance von Servern auseinandersetzt, dann gibt es im Wesentlichen zwei Ziele, auf die man einen Server optimieren kann.
Eines dieser Ziele ist Durchsatz, also die Anzahl der Anfragen pro Sekunde, die ein Server zu Ende bringt, und das andere ist Latenz, also die Dauer, die eine einzelne Query dauern darf.
Beides sind sehr unterschiedliche Ziele, und man muss beim Performancetuning seine Segel sehr sorgfältig setzen, je nachdem, welches Optimierungsziel vorne steht.

# Warteschlangen, Telefonzellen und Hockeyschläger

Bei Optimierung auf Antwortzeit, Latenz, begegnet einem dabei in der Regel die "Hockey Stick Curve" aus der Warteschlangentheorie. Sie sieht in etwa so aus:

```console
latency
^
|               |
|               |
|               |
|              |
|            _|
|         __-
|____-----
+-----------X-------> load
```

Warum diese Kurve so aussieht, wie sie aussieht, kann man leicht mit einem kleinen PHP-Script testen. 
Das gezeigte PHP-Script simuliert eine Telefonzelle, an der mit 20 %-iger Wahrscheinlichkeit pro Minute Leute auftauchen, die Gespräche führen wollen, die zwischen einer und fünf Minuten lang sind.
Lässt man das Script mehrfach mit einem CLI-PHP laufen, und dreht dabei $prob langsam von 20 % auf 22 %, 25 % und dann 30 % hoch, sieht man sehr schön, wie sich die Warteschlangen im System immer weiter aufbauen.

Warum ist das so? Telefonzellen (und auch Datenbanken) können nicht vorarbeiten.
Idlezeit verstreicht ungenutzt - nur Zeit, in der die Warteschlange nicht leer ist, ist sinnvoll genutzte Zeit.

```php
#! /usr/bin/php5 -q
<?php
  $prob   = 20; ## Wahrscheinlichkeit für neuen Kunden in Prozent
  $maxlen = 5;  ## Gesprächsdauer in Minuten (1-$maxlen)

  $link = 0;

  function connect() {
    global $link;

    $link = mysql_connect("localhost", "root", "1wjsnh");
    if ($link === false)
      die("Argh");

    mysql_select_db("rootforum") or die("cannot select db");
    doquery("DROP TABLE IF EXISTS telefon");
    doquery("CREATE TABLE telefon ( id serial, dauer int )");
  }

  function doquery($cmd) {
    mysql_query($cmd) or die("cannot do query $cmd");
  }

  function getvalues($cmd) {
    $res = mysql_query($cmd);
    if ($res === false)
      die("Cannot query $cmd");

    $r = mysql_fetch_assoc($res);
    return $r;
  }

  function getvalue($cmd, $name) {
    $r = getvalues($cmd);
    return $r[$name];
  }

  connect();
  $minute = 0;
  $call_remaining = 0;
  $id = 0;

  while ($minute < 1000) {
    $minute += 1;
    echo "Processing minute $minute: ";

    # Wie lang ist die Schlange?
    $r = getvalues("select count(dauer) as len, sum(dauer) as wait from telefon", "len");
    $len = $r['len'];
    $wait = $r['wait'];
    echo "(Schlange $len, Wait $wait) ";

    # Neuer Kunde stellt sich an
    if (rand(1,100) < $prob) {
      $call_len = rand(1,$maxlen);
      echo "(New customer $call_len min.) ";

      doquery("insert into telefon ( dauer ) values ( $call_len )");
    }

    # Zelle leer:
    if ($call_remaining == 0) {
      # Wartet ein Kunde?
      $r = getvalues("select id, dauer from telefon order by id limit 1");
      if ($r === false) {
        # Kein Kunde da.
        echo "(queue empty) ";
      } else {
        # Kunde da, abholen und processing
        $call_remaining = $r['dauer'];
        $id = $r['id'];
        echo "(customer $id: $call_remaining) ";

        # Kunde aus der Schlange nehmen
        doquery("delete from telefon where id = $id");
      }
    } else {
      # Telefonieren...
      $call_remaining -= 1;
      echo "(customer $id: $call_remaining) ";
    }
    echo "\n";
  }
?>
```

# Tabellen, Locks und Deadlocks

In MyISAM braucht man Tabellen in der Regel nicht selber zu locken:
Jedes Kommando ist logisch atomar.
Es lockt die benötigten Tabellen mit dem passenden Lock, führt seine Operation durch und unlockt die Tabellen am Ende des Kommandos wieder.

Manchmal will man aber mehr als ein Kommando auf einer Tabelle durchführen und will dabei sicherstellen, daß sich der Inhalt der Tabelle nicht verändert, während man die Operation durchführt.
Der häufigste Fall ist das Auslesen und Verändern eines Zählers. 
Um einen Zähler einfach nur hochzuzählen kann man ja einfach

```console
update counter set val = val + 1 where id = <wert>
```

verwenden. Aber will man den Zähler auch auslesen, dann braucht man so etwas wie

```console
LOCK TABLES counter WRITE
SELECT val into @v from counter where id = <wert>
UPDATE counter SET val = @v+1 WHERE id = <wert>
UNLOCK TABLES
SELECT @v
```

Nur so ist sichergestellt, daß das Hochzählen auch atomar und ohne Unterbrechung durch andere Zähloperationen erfolgt.

Wann immer man mehrere Tabellen mit einem Lock belegt, können Deadlocks entstehen. 
Man stelle sich vor, zwei Threads würden gleichzeitig die Statements `LOCK TABLES a, b WRITE` und `LOCK TABLES b, a WRITE` ausführen. 
Thread 1 würde die Tabelle `a` locken, während Thread 2 jetzt die Tabelle `b` lockt.
1 will nun `b` locken, aber das geht nicht, weil 2 dieses Lock schon hält.
Zugleich will 2 jetzt `a` locken, aber das geht auch nicht - beide Threads würden ewig darauf warten, daß der jeweils andere die Locks aufgibt.

Ein gängiger Weg zur Vermeidung von Deadlocks ist, Ressourcen grundsätzlich nur einmal und nur atomar zu vergeben - MySQL hat mit LOCK TABLES diesen Weg gewählt.
Ein Thread kann also nur `LOCK TABLES a,b WRITE` ausführen, nicht etwa `LOCK TABLES a WRITE` und später `LOCK TABLES b WRITE` dazunehmen, um zusätzlich zu `a` noch `b` dazuzunehmen. 
Außerdem kann `LOCK TABLES` nicht unterbrochen werden - `LOCK TABLES a,b WRITE` sammelt also alle Locks für `a` und `b` gleichzeitig ein.

Eine andere Methode Deadlocks zu vermeiden besteht darin, die Ressourcen, die zu vergeben sind, anzuordnen und alle Threads zu zwingen, Ressourcen in Reihenfolge zu bestellen. 
`LOCK TABLES a, b WRITE` und `LOCK TABLES b, a WRITE` würden so intern beide zu demselben Kommando `LOCK TABLES a,b WRITE` werden, und dann kann es schon gar nicht mehr zum Deadlock kommen (denn der zweite Thread würde a gelockt vorfinden, bevor er überhaupt seine Finger auf b legen kann).
So hat MySQL die oben dargestellte Atomizität intern implementiert.

Ein LOCK auf Tabellen kann mit `UNLOCK TABLES` aufgehoben werden.

Ein LOCK auf Tabellen sollte immer nur so kurz wie irgend möglich gehalten werden. 
Wer mit den Werten für die Telefonatsdauer und die Neukundenwahrscheinlichkeit im Telefonzellensimulations-PHP ein wenig gespielt hat, der hat möglicherweise jetzt eine Vorstellung davon, warum das so ist.

# Locks haben Prioritäten

In MySQL hat ein WRITE-Lock eine höhere Priorität als ein READ-Lock und entsprechend ein INSERT/UPDATE/DELETE eine höhere Priorität als ein SELECT.
Wenn also auf eine Tabelle viele schreibende Statements durchgeführt werden, dann werden die SELECT-Statements entsprechend zurückgedrängt.
Daher ist es sehr wichtig, daß schreibende Statements schnell durchgeführt werden, damit sie ihre Locks nur für möglichst kurze Zeit halten.
Ein schreibendes Statement kann dann schnell durchgeführt werden, wenn es eine möglichst einfache WHERE-Clause hat, die einen Index verwenden kann (z.B. ein UPDATE gegen eine Zeile, die über ihren PRIMARY KEY bestimmt wird).

Oft kann es sinnvoll sein, schreibende Statements zu batchen. 
Dazu kann man zum Beispiel die extended INSERT-Syntax verwenden (`insert into <name> ( col1, col2, ...) values (val1, val2, ...), (val1, val2, ...)`), mit der man mehr als eine Zeile auf einmal in die Datenbank einfügen kann.
Diese Syntax steht für UPDATE nicht zur Verfügung, kann aber zum Beispiel mit "REPLACE INTO" verwendet werden.
Ein einzelnes Statement kann `max_allowed_packet` Bytes lang sein, und wenn extended INSERT-Syntax verwendet wird, verwendet MySQL intern einen Puffer von `bulk_insert_buffer_size`, um diese Operation zu beschleunigen.
Dieser Puffer sollte zur Insert-Größe passend gewählt werden. 

Bei extended INSERT-Syntax werden Updates der Indices einer Tabelle gepuffert und der Baum nicht nach jedem Insert rebalanciert, sondern nur einmal am Ende aller Inserts dieses Blocks.
Hat man mehr als ein solches INSERT-Statement, kann man diese außerdem noch in ein `LOCK TABLES` wickeln, damit es noch schneller geht:


```console
LOCK TABLES t WRITE;
INSERT INTO t (a,b) VALUES (1, 2), (3, 4);
INSERT INTO t (a,b) VALUES (5,6);
UNLOCK TABLES;
```

Hier wird der Key Buffer nur einmal, beim `UNLOCK TABLES`, aktualisiert und auf die Platte geschrieben.

Wer sehr mutig ist, und ein MySQL 5.x hat, startet seinen MySQL-Server mit der Konfigurationsvariable `delayed_key_writes = ON` oder gar `delayed_key_writes = ALL` in der `[mysqld]`-Sektion der `my.cnf`.
Steht diese Variable auf 1, kann man eine Tabelle beim `CREATE TABLE` mit der Option `DELAYED_KEY_WRITE` spezifizieren. 
Der Key-Buffer für solche Tabellen wird dann nicht mehr so oft auf die Platte geschrieben (bei `delayed_key_writes = 2` wird dies für alle Tabellen unabhängig von den CREATE-Optionen gemacht). 
Dies kann dazu führen, daß bei einem Servercrash die Indices (aber nicht die Daten) beschädigt sind und neu erzeugt werden müssen - das macht hässlich lange Recovery-Zeiten.
Dafür werden Index-Updates immer so schnell ausgeführt, als wären sie gebatched und in `LOCK TABLES` eingewickelt.

Manchmal will man ein einzelnes `SELECT` haben, das nicht von `INSERT`-Statements verdrängt werden kann.
Das kann man mit `SELECT HIGH_PRIORITY ...` erreichen:
Es macht das Select nicht schneller, sorgt aber dafür, daß es nicht von immer wieder eintreffenden `INSERT`-Statements nach hinten gedrückt werden kann.

Anders herum hat man manchmal ein `INSERT`, das keine `SELECT`-Statements zur Seite drücken soll. Das kann man mit `INSERT LOW_PRIORITY` erreichen:
Es macht das Insert nicht langsamer, sorgt aber dafür, daß das `INSERT` keine `SELECT`-Statements zur Seite drückt.

# INSERT DELAYED

Etwas ganz anderes ist `INSERT DELAYED`: `INSERT DELAYED` kommt in jedem Fall sofort zurück. 
Die Daten, die dem Insert übergeben werden, sind dabei noch lange nicht geschrieben und tatsächlich kann es sein, daß sie niemals geschrieben werden, denn MySQL schiebt die Daten nur in einen internen Puffer, der irgendwann einmal abgearbeitet wird und in die Tabelle geschoben wird.

Dabei gelten eine ganze Reihe von Einschränkungen, die in [http://dev.mysql.com/doc/refman/5.0/en/insert-delayed.html](http://dev.mysql.com/doc/refman/5.0/en/insert-delayed.html) im Detail beschrieben sind.
Wie auch immer: `INSERT DELAYED` drückt Daten in einen Insert-Puffer und kommt dann immer sofort mit Erfolg zurück, während der Puffer irgendwann mal von einem Delayed-Insert-Thread gelesen wird und von diesem mit niederer Priorität in die Tabellen geschoben wird.
Genau genommen kann `SHOW STATUS` einem zeigen, daß es `delayed_insert_threads` viele solcher Threads gibt, die derzeit `not_flushed_delayed_rows` an Datenzeilen ausstehen haben (von insgesamt `delayed_writes` vielen Zeilen, die bisher geschrieben worden sind).

In den Konfigurationsvariablen lässt sich einstellen, wie `INSERT DELAYED` arbeitet:
Alle `delayed_insert_limit` Zeilen lässt ein Delay-Insert-Thread eventuell anstehenden Select-Statements den Vortritt.
Ebenso gibt ein solcher Thread sein Lock auf, wenn sein Puffer leer ist und beendet sich `delayed_insert_timeout` Sekunden später, wenn er keine neue Arbeit bekommt.
Kommen andererseits sehr viele `INSERT DELAYED`-Zeilen in die Warteschlange, so setzt `delayed_queue_size` der Anzahl der Zeilen im Puffer eine obere Grenze, damit der Speicher nicht überläuft.

# Reminder: Data_free = 0 und Concurrent_inserts

Wir erinnern uns an die Diskussion von `SHOW TABLE STATUS` und das Feld `Data_free` dort.
Wenn `Data_free = 0` ist, und für den Server `Concurrent_inserts` eingeschaltet sind, dann können auf der Tabelle Inserts und Selects gleichzeitig durchgeführt werden.
Insert-Locks können dann nicht entstehen und so können auch keine Selects an die Wand gedrückt werden.

MERGE-Tables oder MySQL 5.1 Partitions können sehr, sehr hilfreich sein, wenn man Tabellen so gestalten will, daß Data_free immer 0 ist und man sich `OPTIMIZE TABLE` nicht leisten kann.

# Wie steht es mit meinem Locking?

Mithilfe von `SHOW STATUS` sieht man seine `Table_locks_immediate` und `Table_locks_waiting`.
Wenn mehr als 1 % (manche Leute sagen 3 %) der Table Locks waiting sind, dann hat der Server ein definitives Locking-Problem.
Wie ernst das ist, kann man besser beurteilen, wenn man Questions/Uptime (Queries pro Sekunde, qps) berechnet und wenn man `(qcache_hits+com_select)/(com_delete+com_insert+com_replace+com_update)` (QL/DML-Ratio, "update-heavyness") des Servers kennt.

Wenn mehr als eine Query pro Sekunde wartend ist (1 % Table_locks_waiting bei 100 qps oder mehr), dann lohnt es sich, sich mit locklösenden Maßnahmen zu befassen. Locklösende Maßnahmen sind:

- DML schneller machen
- weniger DML pro Sekunde erzeugen
- keine Table Locks mehr verwenden → InnoDB einsetzen

(geschrieben für
[Rootforum](http://www.rootforum.de/forum/viewforum.php?f=23)
und hier herüber geschafft zur Archivierung)
