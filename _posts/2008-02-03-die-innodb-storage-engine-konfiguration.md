---
layout: post
published: true
title: 'Die InnoDB Storage Engine: Konfiguration'
author-id: isotopp
date: 2008-02-03 11:50:57 UTC
tags:
- mysql
- lang_de
feature-img: assets/img/background/mysql.jpg
---
![](/uploads/innodb-transactions.png)

Links: Strukturen im Speicher, Rechts: Strukturen auf Disk. Oben:
Log-Strukturen, Unten: Tablespace-Strukturen.


### Wie eine Transaktion physikalisch organisiert wird

Wenn in InnoDB eine neue Transaktion begonnen und erzeugt wird, ist sie ja
noch nicht comitted und damit hat die Datenbank gegenüber der Anwendung noch
kein Versprechen gemacht. Entsprechend brauchen die Daten aus einer solchen
Transaktion auch noch nicht persistent gemacht zu werden.

InnoDB versucht, eine Transaktion im Speicher zusammen zu bauen. Dies ist
der `innodb_log_buffer`. Er sollte ausreichend groß gewählt werden, daß eine
solche Transaktion in den meisten Fällen im Speicher gehalten werden kann
und nicht partiell in ein Redo Log geschrieben werden muß. Eine Größe von 1
MB bis 8 MB ist normal.

Wenn die Transaktion comitted wird, muß InnoDB die Speicherseite von der
Platte laden, in der der zu ändernde Record enthalten ist und die Änderung
im Speicher durchführen - die Seite wird im InnoDB Bufferpool gespeichert.
Seiten auf der Platte und im InnoDB Bufferpool sind jeweils 16 KB groß, und
die `innodb_buffer_pool_size` legt fest, wieviel RAM als Cache für solche
Seiten zur Verfügung steht. Die modifizierte Speicherseite wird aber noch
nicht zurück geschrieben. Stattdessen wird die Transaktion an Ende des
aktuellen Redo-Log auf Platte geloggt und die Seite im Bufferpool im
Speicher als Dirty (= noch zu schreiben) markiert.

Als Dirty markierte Seiten werden in den Tablespace hinaus geschrieben, wenn
einer von drei Fällen eintritt: 

1. Das Redo-Log, das als Ring Puffer organisiert ist, ist voll. Um
   zusätzlichen Platz zu gewinnen müssen als Dirty markierte Seiten in
   Redo-Log Reihenfolge herausgeschrieben werden, sodaß der hintere Zeiger
   des Redo-Log Ringpuffers nach vorne verschoben werden kann und so
   ausreichend Platz im Redo-Log geschaffen wird. Diese Situation nennt man
   einen `Innodb_log_wait` und sie wird im gleichnamigen Statuscounter
   registriert.
2. InnoDB benötigt für irgendwelche Aufgaben im Bufferpool eine
   Speicherseite, aber findet keine, die frei ist. Normalerweise kann eine
   solche Seite frei gemacht werden, indem man irgendeine Seite aussucht,
   die nicht Dirty ist und sie freigibt: Wenn eine Seite nicht dirty ist,
   bedeutet daß, daß ihr Inhalt irgendwo auf der Platte zum Neu laden
   rumsteht. Wenn aber ausschließlich als Dirty markierte Seiten im
   Bufferpool stehen, geht das nicht und es müssen erst einmal Seiten auf
   Platte geschrieben werden, damit Platz im Bufferpool geschaffen werden
   kann.

   Diese Situation nennt man einen `Innodb_buffer_pool_wait_free` und sie wird im
   gleichnamigen Statuscounter registriert. InnoDB versucht diese Situation zu
   vermeiden: Wenn mehr als `innodb_max_dirty_pages_pct` Prozent viele Seiten als
   Dirty markiert sind, wird ein Checkpoint erzwungen und die als Dirty
   markierten Seiten werden herausgeschrieben.
3. InnoDB fühlt sich unterbeschäftigt und beginnt im Sekundentakt damit,
   Batches von jeweils 64 als Dirty markierten Seiten auf die Platte zu
   schubsen. Diese Situation ist normal und wird nicht besonders registriert
   (dreht aber wie alle diese Schreibzugriffe natürlich
   `Innodb_pages_written` hoch).

Relevante Konfigurationseinträge in der my.cnf:

```sql
# Globaler Puffer zum Zusammenbau 
# von Transaktionen vor dem Commit
innodb_log_buffer_size = 8M

# Größe des InnoDB Buffer Pools
#   etwa 70-80% des Hauptspeichers,
#   auf einer Maschine mit 4G RAM
#   also etwa 3G
#
# (/etc/sysctl.conf: vm.swappiness = 0!)
innodb_buffer_pool_size = 3072M

# Anzahl der InnoDB Bufferpool Seiten
# die Drity sein dürfen bevor ein
# Checkpoint erzwungen wird
#
# Default = 90, ok
innodb_max_dirty_pages_pct = 90
```

Relevante Zähler in `SHOW GLOBAL STATUS`:

```sql
# Statuszähler für das Event "Redo Log voll"
Innodb_log_waits 

# Statuszähler für das Event "Keine Seite
# im Bufferpool frei"
Innodb_buffer_pool_wait_free
```


### Eine sinnvolle Größe für das Redo-Log wählen

![](/uploads/innodb_writes_to_log.png)

Ein Write-Burst kann durch das Redo-Log "in der Zeit gestreckt" und so
abgeflacht werden. Die zu leistende Arbeit - die Fläche unter der Kurve -
ist jedoch (nahezu) gleich.

Das Redo-Log loggt Transaktionen und die Einträge im Log sind proportional
zur Größe der Transaktion, denn es werden Rows geloggt, keine Pages. Der
Sinn des Logs ist es, das Zurückschreiben der 16KB großen Seiten in den
Tablespace verzögern zu können: Vielfach ist es so, daß in einer
Speicherseite mehr als eine Row abgelegt wird und daß mehrere zeitlich eng
beeinander liegende Transaktionen Daten in Rows ändern, die in derselben
Page liegen, oder daß eine Row wieder und wieder überschrieben wird. Durch
das Schreiben ins Redo-Log werden diese Änderungen alle persistent gemacht,
aber die Schreibzugriffe können als lineare Writes ohne Seeks recht schnell
abgewickelt werden. Die Seeks, die beim Schreiben in den Tablespace
unvermeidlich auftreten würden, können so verzögert und minimiert werden.

Normalerweise sollte das Redo-Log immer groß genug sein und niemals voll
laufen. Entsprechend sollte Innodb_log_waits immer 0 sein oder zumindest
sich nicht bewegen, wenn man zwei Mal in Folge den Wert des Statuscounters
abruft. Hat man regelmäßig Innodb_log_wait-Events, kann eine von zwei
Situationen vorliegen: Der Server hat Write-Bursts, die größer sind als das
aktuelle Redo-Log - das Redo-Log ist zu klein und muß vergrößert werden.
Oder der Server hat dauerhaft eine sehr große Schreiblast und das Redo-Log
würde überlaufen, egal wie groß es ist. Dann braucht der Server mehr
Spindeln, um schneller schreiben zu können oder die Daten müssen
partitioniert und auf mehrere Server verteilt werden.

Das Redo-Log besteht per Default aus zwei Dateien
(`innodb_log_files_in_group`), die jeweils 5 MB groß sind
(`innodb_log_file_size`), ist also 10 MB groß. Dies ist zu klein. Idealerweise
sollte es aus zwei Dateien bestehen, die jeweils zwischen 64 und 256 MB groß
sind, also 128 MB bis 512 MB groß sein. Es kann nicht größer sein als 4096
MB = 4 GB, auch nicht auf einer Maschine mit 64 Bit Architektur.

Früher (vor MySQL 5.0) war es einmal wesentlich, das Redo-Log nicht zu groß
zu machen: Wenn der Server crashte, ging InnoDB in die Log Recovery Phase
und mußte diese erst abarbeiten bevor der Server wieder Verbindungen annahm.
Seit MySQL 5.0 ist das nicht mehr so: Die Log Recovery Phase kann vom Server
im Hintergrund abgearbeitet werden, sodaß die Größe des Redo-Logs nicht mehr
bestimmend für die Dauer der Server-Recovery ist.

Ändert man diese Variable wenn ib_logfile0 und ib_logfile1 schon existieren,
wird InnoDB sich weigern zu starten und im Error-Log des Servers eine
Meldung hinterlassen, die im wesentlichen sagt, daß die Größe von
vorgefundenen Logfiles nicht mit der Größe der konfigurierten Logfiles
übereinstimmt.
 
Um die Größe des Redo-Logs zu ändern muß der Server runtergefahren werden,
danach kontrolliert werden, daß der Shutdown sauber war und daß kein
Serverprozeß mehr läuft. Dann kann man die existierenden ib_logfile?-Dateien
zur Seite moven und den Wert der Konfigurationsvariablen ändern, um
schließlich den Server zu starten. InnoDB wird nun Meldungen über neu
angelegte Logfiles in das Error-Log schreiben und die Files generieren. Ist
der Server wieder online und betriebsbereit, kann man die alten
ib_logfile?-Dateien löschen.

Relevante Konfigurationseinträge in der my.cnf:

```sql
# Anzahl der ib_logfile?
innodb_log_files_in_group = 2

# Größe eines ib_logfile?
innodb_log_file_size = 256M
```

### Wie InnoDB die Datendateien ablegt

Wie bereits in 
[dem ersten Artikel]({% link _posts/2008-01-30-die-innodb-storage-engine.md %}) 
dieser Reihe angedeutet hat InnoDB zwei verschiedene Betriebsarten, in denen
es seine Daten unterschiedlich organisiert: Wenn die Konfigurationsvariable
`innodb_file_per_table = 0` gesetzt ist, werden die Daten in einem oder
mehreren ibdata-Tablespacefiles abgelegt. Wenn die `innodb_file_per_table = 1`
gesetzt ist, wird stattdessen für jede Tabelle neben der .frm-Datei für die
Tabelle ein .ibd-File angelegt, das die Daten enthält.

Die Tablespace-Files werden, wenn ihre Namen nicht als absolute Pfadnamen
angegeben werden, in `innodb_data_home_dir` angelegt. Ist auch diese Variable
leer, wird als Default `datadir` angenommen. Der Default-String für
`innodb_data_file_path` ist `ibdata1:10M:autoextend`.

In den meisten Default-Installationen bedindet sich also eine Datei ibdata1
in /var/lib/mysql. Diese Datei ist zunächst 10M groß und wächst dann in
Schritten von 8MB (weil innodb_autoextend_increment = 8 per Default auf 8
steht).

Diese Defaults sind für den effizienten Betrieb jedoch nicht sehr gut
gewählt. Zunächst einmal sollte man `innodb_file_per_table = 1` setzen. Auf
diese Weise bekommt man pro Tabelle ein .ibd-File. Dadurch hat man die
Möglichkeit, den Platzverbrauch in der Datenbank Tabellenweise auch von
außen zu messen und man gewinnt die Möglichkeit, durch ein `ALTER TABLE t
ENGINE=innodb` bzw. ein `OPTIMIZE TABLE t` den leeren Platz in solchen
Dateien dem Betriebssystem wieder zur Disposition zur Stellen.

Wählt man `innodb_file_per_table = 1`, dann sind die Defaults für
`innodb_data_file_path` und `innodb_autoextend_increment` ausreichend, denn im
ibdata1-File wird lediglich das InnoDB-interne Shadow-Datadictionary und das
Undo-Log abgelegt. Auf solchen Installationen erhält man am Ende meist ein
ibdata1 in der Größe von 256M bis 1024M, je nach Maximalbelastung des
Undo-Logs.

Muß oder will man InnoDB mit `innodb_file_per_table = 0` betreiben, dann
werden die Daten ebenfalls im ibdata1-File abgelegt. Man sollte vorher
sicherstellen, daß das Betriebssystem und auch alle Utilities zur
Datensicherung mit sehr großen Dateien korrekt umgehen können. Ist das nicht
der Fall, wird man ein sehr kompliziertes innodb_data_file_path-Statement
benötigen, das ausreichend viele ibdata-Files definiert - jedes von ihnen
wahrscheinlich so um die 2G groß, oder was immer das Limit hier ist.

Angenommen der Support im Betriebssystem für sehr große einzelne Files ist
ausreichend, dann wird man mit Sicherheit die Schrittweite vergrößern
wollen, in der die ibdata-Datei vergrößert wird -
`inoodb_autoextend_increment = 8` sind als Schrittweite sicher zu klein.
Stattdessen ist es empfehlenswert, sich das Dateisystem anzusehen, auf dem
die Datei angelegt wird, und als Schrittweite etwa 1% bis 5% der gesamten
Dateisystemgröße zu wählen. Auf diese Weise wird das Dateisystem nach Bedarf
in 20 bis 100 Schritten aufgefüllt. Das ist hinreichend klein granular,um
flexibel zu sein, aber das Betriebssystem hat dennoch ausreichend wenige
Allocation Requests um die Datei weitgehend unfragmentiert zu erzeugen. Auf
einem Dateisystem mit 200G Platz wird man also eine Schrittweite von 2048
(2048M = 1% von 200G) oder gar 10240 (10G = 10240M = 5% von 200G) wählen.

In jedem Fall sollte ein Tablespace-File so definiert sein, daß es auf
"autoextend" konfiguriert ist, insbesondere auch bei `innodb_file_per_table =
1`. Wenn nämlich durch viele Schreibzugriffe während einer lang andauernden
Transaktion das Undo Log vorübergehend anschwillt und dabei nicht genug
Platz im ibdata-File ist, kommt es zu sehr seltsamen und schwer zu
diagnostizierbaren Fehlermeldungen, obwohl auf Dateisystemebene noch genug
Platz vorhanden ist.

Außerdem ist zu bedenken, daß InnoDB mehr Filehandles verbraucht, wenn
`innodb_file_per_table = 1` gesetzt ist - entsprechend sollte man
`innodb_open_files` größer wählen, zum Beispiel ein Filehandle pro Tabelle.
Das zieht unter Umständen auch eine Anpassung von `open_files_limit` nach sich - 
hier müssen aber noch Filehandles für .frm-Dateien und für MyISAM-Tabellen
mit dazu gerechnet werden.

Relevante Konfigurationseinträge in der my.cnf (File per Table):

```sql
# Soll InnoDB mit einer ibd-Datei pro Tabelle betrieben werden
innodb_file_per_table = 1

# Wo soll die ibdata-Datei abgelegt werden (Default: $datadir)
# innodb_data_home_dir

# Wie soll die Datei angelegt werden?
innodb_data_file_path = "ibdata1:10M:autoextend"

# In was für Schritten (MB) soll die Datei wachsen?
innodb_autoextend_increment = 8

# Filehandles hoch drehen
#  Ein Filehandle pro InnoDB Tabelle
innodb_open_files = 2048

# Das hier kann man in Linux auch 
# getrost richtig hoch drehen
open_files_limit  = 32768
```

Relevante Konfigurationseinträge in der my.cnf (Single-Tablespace):

```sql
# Soll InnoDB mit einer ibd-Datei pro Tabelle betrieben werden
innodb_file_per_table = 0

# Wo soll die ibdata-Datei abgelegt werden (Default: $datadir)
# innodb_data_home_dir

# Wie soll die Datei angelegt werden?
#   Tablespace wird hier als 2G große Datei angelegt.
innodb_data_file_path = "ibdata1:2048M:autoextend"

# In was für Schritten (MB) soll die Datei wachsen?
#   Tablespace wächst hier in 2G Schritten 
#   (1% einer 200G-Platte)
innodb_autoextend_increment = 2048
```

### Wie InnoDB seine Daten auf die Platte malt

Wie wir oben gesehen haben, werden Daten bei der Ausführung von schreibenden
Kommandos in InnoDB nur gelesen - ein INSERT oder UPDATE-Statement erzeugt
einen Logbuffer und als Dirty markierte Pages im InnoDB Bufferpool für die
Daten und das Undo-Log. Bei einem Commit wird der Logbuffer ins Redo-Log
geschrieben - jedenfalls wenn `innodb_flush_log_at_trx_commit = 1` gesetzt
ist. MySQL führt den Commit dann als einen Write ins Redo-Log und eine
Flush-Operation durch. Letztere leert dann die Betriebssystem-Puffer in die
Platten-Puffer und die Platten-Puffer auf die Platte.

Selbst dies ist jedoch eine relativ langsame Operation, bei der Wartezeiten
von einigen Millisekunden auf eine langsame mechanische Platte auftreten -
jedenfalls wenn man nicht eine spezielle Platte für das Redo-Log hat, die
aus batteriegepuffertem RAM besteht. Daher besteht die Möglichkeit, InnoDB
auf eine Weise zu betreiben, bei das Warten auf die Platte vom Commit mehr
oder weniger stark entkoppelt wird.

Bei `innodb_flush_log_at_trx_commit = 2` ist es so, daß ein Commit die Daten
aus dem MySQL in die Betriebssystem-Puffer überträgt ("WRITE"), aber ein
Schreiben der Betriebssystem-Puffer auf die Platte ("FLUSH") nur einmal pro
Sekunde erzwingt. Dies bewirkt, daß bei einem Absturz des MySQL
Serverprozesses keine Daten verloren gehen können, bei einem Absturz der
Server-Hardware jedoch bis zu einer Sekunde Redo-Log fehlen kann. Es
existieren also möglicherweise Daten, für die der Anwendung signalisiert
wurde, daß sie geschrieben wurden, die aber nicht geschrieben worden sind.
Dafür ist diese Betriebsart durch die Wegfallenden Wartezeiten auf die
langsamen Festplatten sehr viel schneller.

Je nach Geschäftsprozeß, der hier implementiert wird, kann es sein, daß
dieser Fehler relevant ist oder nicht - aus der Sicht der Informatik ist
`innodb_flush_log_at_trx_commit = 2` eine Verletzung des
[ACID](http://en.wikipedia.org/wiki/ACID)-Prinzips nach Codd und daher
falsch. Aus der Sicht der Betriebswirtschaft kann das Verhalten dennoch
korrekt sein. Das wäre zum Beispiel dann der Fall, wenn die verlorenen Daten
reproduzierbar wären, oder wenn die Korrektur der falschen Daten durch
Kundenservice kostengünstiger wäre als die Hardware, die notwendig wäre, um
die benötigte Performance bei `innodb_flush_log_at_trx_commit = 1` zu liefern.

Bei `innodb_flush_log_at_trx_commit = 0` wird das Schreibverhalten von InnoDB
noch weiter gelockert - "Commit" ist nun eine rein logische Operation, die
keine Writes und keine Flushes per initiiert. Stattdessen wird das Redo-Log
einmal pro Sekunde durch "WRITE" an das Betriebssystem übertragen und danach
durch "FLUSH" ein Schreiben der Betriebssystem-Puffer auf die Platte
erzwungen. Dies ist jedoch nicht wesentlich schneller als die Einstellung
"2".

In jedem Fall wird die Datenbank nach einem Crash des MySQL-Serverprozesses
oder der Hardware beim Wiederanlauf recovern müssen. In jedem Fall wird die
Datenbank wieder in einen konsistenten transaktionalen Zustand recovern,
unabhängig von den Einstellungen für `innodb_flush_log_at_trx_commit`.
Unterschiedlich wird lediglich der Punkt in der Zeit sein (die letzte
gesehene Transaktionsnummer, zu der hin recovert wird), den die Datenbank
nach dem Wiederanlauf und der Recovery erreicht.

Das Verhalten von InnoDB läßt sich außerdem noch mit Hilfe der
`innodb_flush_method` beeinflussen. In Unix sind die zugelassenen Werte für
diese Variable `fdatasync` (der Default), `O_DSYNC`, `O_DIRECT`,
`littlesync`, `nosync`, in Windows werden `normal` und `unbuffered` (der
Default) sowie `async_unbuffered` (der Default in Windows XP und Windows
2000) erkannt.

Die Idee bei `O_DSYNC` und `O_DIRECT` ist, die Dateien des Redo-Log auf eine
Weise zu öffnen, die den Puffermechanismus des Betriebssystems komplett
ausschaltet - die Datenbank puffert Daten im innodb_buffer_pool und im
Redo-Log selbst und es besteht gar keine Notwendigkeit für den File System
Buffer Cache des Betriebssystems. Setzt man `innodb_flush_method` zum Beispiel
auf `O_DIRECT` in Linux, wird InnoDB nur noch WRITE-Aufrufe durchführen, aber
die Daten nicht mehr mit FLUSH auf die Platte zwingen. Dies ist auch nicht
mehr notwendig, da ja jeder WRITE bei `O_DIRECT` ungepuffert direkt auf die
Platte geht.

Relevante Konfigurationseinträge in der my.cnf (für Linux):

```sql
# Gewünschtes Schreibverhalten für viele Anwendungen
innodb_flush_log_at_trx_commit = 2
innodb_flush_method = O_DIRECT

# Alternativ für ACID-Compliance:
innodb_flush_log_at_trx_commit = 1
innodb_flush_method = O_DIRECT
```

### Concurrency Tickets

InnoDB funktioniert besser, wenn die Anzahl der Threads begrenzt ist, die
gerade Operationen innerhalb der Storage Engine ausführen. Es können sich
gleichzeitig `innodb_thread_concurrency` viele Threads in InnoDB aufhalten. Es
existieren verschiedene Formeln, mit denen man auf sinnvolle Werte für diese
Variable kommen kann ("Anzahl der Cores mal zwei", "Summe aus Cores und
Platten = Anzahl der Dinge, die wir in Bewegung halten wollen"), aber es ist
klar, daß aktuelle Versionen von InnoDB schlechtere Performance zeigen, wenn
der Wert zu hoch wird - derzeit scheint das Limit je nach Load 16 oder 32 zu
sein.

Hat man mehr gleichzeitige Transaktionen als `innodb_thread_concurrency`
zuläßt, müssen überzählige Threads warten. Oft ist es jedoch so, daß ein
Thread über das Handler Interface in die Storage Engine hineingeht, dort
eine Operation wie Key Lookup durchführt, um dann in die MySQL SQL-Schicht
zurück zu kehren. Um eine einzelne Query zu beantworten sind unter Umständen
sehr viele solche Übergänge notwendig.

Damit ein Thread nun nicht jedesmal warten muß, wenn er in die InnoDB
Storage Engine will, bekommt er `innodb_concurrency_tickets` viele "Tickets",
wenn ihm Zugang zur Engine gewährt wird. Er kann also entsprechend viele
Wechsel zwischen SQL-Schicht und Storage Engine machen, ohen daß er erneut
warten muß. Man kann hier mit verschiedenen Werten experimentieren, wenn man
eine Maschine mit sehr vielen CPUs und Festplatten hat und eine sehr hohe
Thread Concurrency für InnoDB hat. Sinnvolle Werte sind "Anzahl der Records
in einem Block", "... in einem Segment" oder "Anzahl der Records, die in
dieser Query gelesen werden".

Eine weitere Variable ist die `innodb_commit_concurrency`, die die Anzahl der
Threads limitiert, die gleichzeitig comitten können. Sie begrenzt den
Speicherverbrauch im Logbuffer und reguliert Contention auf dem Redo-Log.

Aus historischen Gründen existiert noch eine Variable `thread_concurrency`.
Der Wert, der hier übergeben wird, endet im Code direkt in einem Aufruf von
`pthread_setconcurrency()`, wird aber sonst nicht weiter verwendet. Diese
Funktion bewirkt in den aktuellen Implementierungen von pthreads in Linux
und Solaris gar nichts, in Versionen von pthreads bis einschließlich Solaris
8 hat sie sich intern auf das Mapping von Threads zu Kernelthreads
ausgewirkt. Für aktuelle Versionen von Betriebssystemen und MySQL ist die
Variable und der dort eingestellte Werte nicht mehr relevant.

Relevante Konfigurationseinträge in der my.cnf:

```sql
innodb_commit_concurrency = 0
innodb_thread_concurrency = 16
innodb_concurrency_tickets = 500
```


### Metadatenstrukturen

Wenn ich nach dem gehe, was ich bei Kunden vorfinde, dann ist
`innodb_additional_mem_pool_size` eine Variable, die sehr häufig auf seltsame
Werte gesetzt wird. Die Variable bestimmt die Größe eines Puffers für
Metadatenstrukturen, ist also ein Cache für das interne InnoDB Data
Dictionary. Der Default-Wert ist 1 MB und im normalen Betrieb braucht dieser
Puffer niemals größer als 8 MB gesetzt zu werden. Ein Kunde, der Tests mit
40.000 InnoDB-Tabellen vorgenommen hat, hat hier tatsächlich einmal einen
Wert von 20 MB benötigt.

Relevante Konfigurationseinträge in der my.cnf:

```sql
innodb_additional_mem_pool_size = 4M
```


### Gesamtübersicht

Eine Gesamtübersicht über alle InnoDB-Statusvariablen und
Konfigurationsparameter findet man auf
[12.2.4. InnoDB Startup Options and System Variables](http://dev.mysql.com/doc/refman/5.0/en/innodb-parameters.html) 
im Handbuch.
