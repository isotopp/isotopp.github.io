---
author: isotopp
date: "2006-03-08T17:00:00Z"
feature-img: assets/img/background/rijksmuseum.jpg
published: true
tags:
- mysql
- lang_de
title: MySQL für Dummies (7)
---

Mein Freund Heinz ist Vertriebler, und manchmal sagen Vertriebler überraschend schlaue Dinge.
Heinz zum Beispiel sagt sehr gerne "Niemand will Backup. Alle wollen Restore!" 
Er meint damit, daß ein Backup nicht nur ein lästiges Costcenter in der IT ist, sondern daß es außerdem keinen Mehrwert "an sich" darstellt.
Der Mehrwert liegt nicht in der Datensicherung, sondern in der Wiederherstellung der Daten.

Es ist sehr wichtig, dies im Kopf zu behalten, wenn man sein Backup plant: 
Es geht nicht wirklich um Datensicherung, sondern es geht um einen Plan für die Recovery von verlorenen Daten.
Das beinhaltet nicht nur Überlegungen wie man welche Daten wiederherstellt, sondern auch, wie lange die Betriebsunterbrechung denn wohl dauern wird und ob das akzeptabel ist.
Überlegungen zum Restore enden nämlich (im Gegensatz zu Überlegungen zum Backup) oft auch in HA-Konzepten oder organisatorischen und personellen Problemstellungen.

# Ein guter Plan

Zwei Überlegungen gehen jeder Backup -- Entschuldigung! -- Recoveryplanung voran. 
Der erste Gedanke ist:
Was brauche ich wirklich um für den Kunden "operational" auszusehen?
Wir bezeichnen diese Daten und die Systeme, die sie halten, als "P-Daten" und "P-Systeme" ("P" steht für "Production").
Diese Daten müssen organisatorisch und technisch eine Einheit sein in der Form, daß sie möglichst schnell wieder verfügbar sind.
Es handelt sich dabei meistens um OLTP-Daten (Online Transaction Processing) aktueller Natur.

In einem Webshop sind diese Daten zum Beispiel der Katalog und Bestand, die notwendig sind, damit der Kunde auswählen kann, und die noch nicht bearbeiteten Orders und unbezahlte Rechnungen, die für den Versand und das Inkasso notwendig sind.

In einem Monitoring-System sind dies die aktuellen Zustände aller Systeme, und die offenen Tickets und Probleme.

Historische Daten, die nicht für die Produktion notwendig sind, sondern lediglich produktionsunterstützend verwendet werden, brauchen nicht so schnell wieder online zu sein. 
Meist handelt es sich um historische Daten, aus denen Statistiken für den Vertrieb, den Endkunden oder andere Nutzer generiert werden.
Dies sind "PS-Daten" und "PS-Systeme" (Production Support).

In einem Webshop sind dies die Orderlogs mit erfüllten Ordern und alten Rechnungen, und die daraus generierten (und regenerierbaren) Statistikdaten.

In einem Monitoring-System wären dies die historischen Daten über Systemzustände und Performance.

Diese Daten sind wichtig, aber nicht essenziell für das Funktionieren des Kerngeschäftes.

Indem man diese Daten sinnvoll trennt, kann man Prozeduren entwickeln, die es einem erlauben, die Kerndaten von den "Nice to have"-Daten zu trennen und so bei großen Datenbeständen relativ schnell wieder zu recovern.

# Konfiguration mitsichern

MySQL speichert seine Daten alle im Datadir.
Legt man dort (oder eine Ebene höher) auch seine Konfiguration ab, kann man durch ein Sichern von Datadir (bzw. der Ebene höher) einen Komplettabzug aller seiner logischen Datenbankschemata bekommen. 

Damit meine Datenbank auch mit der `my.cnf` in meinem Datadir startet und NUR mit dieser Konfiguration läuft, verwende ich ein Startscript wie dieses hier:

```console
linux:/export/data/rootforum # cat start
#! /bin/bash --

MYSQL_CMD_DIR=/usr/local/mysql-max-5.0.18-linux-i686-glibc23
MYSQL_DIR=/export/data/rootforum
MYSQL_UNIX_PORT=$MYSQL_DIR/mysql.sock
MYSQL_TCP_PORT=3340
export MYSQL_UNIX_PORT MYSQL_TCP_PORT MYSQL_DIR

cd $MYSQL_CMD_DIR
$MYSQL_CMD_DIR/bin/mysqld_safe --defaults-file=$MYSQL_DIR/my.cnf --datadir=$MYSQL_DIR/data &
```

Dieses Script startet den mysql_safe mit dem gegebenen Datadir und erzwingt dabei die Benutzung des korrekten Konfigurationsfiles. 
Es erzwingt auch die Verwendung eines alternativen Ports und Unix Domain Sockets, da ich auf meinem System eine ganze Reihe von MySQL-Instanzen laufen habe.

Das Stopscript dazu findet einfach das PID-File in $MYSQL_DIR/data/\*pid, und sendet ein "kill -TERM" an diesen Prozess.
MySQL schreibt dann seine Puffer geordnet auf Disk und beendet sich. 
Man kann verifizieren, ob MySQL sich beendet hat, indem man wartet bis das PID-File verschwunden ist.

```console
#! /bin/bash --

MYSQL_DIR=/export/data/rootforum
MYSQL_PID=$MYSQL_DIR/data/\*pid

# No Pid, no process - we are done
[ ! -f $MYSQL_PID ] && exit 0

# No Pid in file, no process, we are done
pid=$(cat $MYSQL_DIR/data/\*pid)
if [ -z "$pid" ]
then
  rm $MYSQL_PID
  exit 0
fi

# Stop server
kill -TERM $pid

# Wait for server stop
while [ -f $MYSQL_PID ]
do
  sleep 1
done
```

# Das Binlog

In Datadir befinden sich normalerweise die Unterverzeichnisse, die die logischen Datenbanken enthalten, die eigentlichen Daten, die von den einzelnen Storage-Engines in Dateien abgelegt werden, die Engine-spezifisch sind und die verschiedenen Logfiles. 
Für eine Datensicherung ist es vor allen Dingen wichtig, daß das Binlog angeschaltet ist. 
Das ist am einfachsten zu erreichen, indem man in seiner `my.cnf`-Datei einen Eintrag für das Binlog macht.
Trägt man nur einen Schalter `log-bin` ein, wird das Binlog mit `<hostname>-bin.xxxxxx` erzeugt, wobei `xxxxxx` eine laufende Nummer ist.
Es ist besser, dem Binlog gleich einen festen Namen zu geben, der sich nicht ändert, wenn sich der Hostname der Maschine ändert.

Außerdem kann man die Option `sync_binlog=1` setzen, die bewirkt, daß das Binlog nach jedem Kommando bzw. jeder Transaktion auch auf Disk geschrieben wird.
Das erzeugt ein wenig mehr Disk-Aktivität beim Schreiben des Binlog, stellt aber sicher, daß keine Kommandos am Ende des Binlogs fehlen, wenn man einen Crash erlebt.


```console
[mysqld]
log-bin=linux-bin
sync_binlog=1
```

Nachdem man dies konfiguriert und den Server einmal angehalten und neu gestartet hat, um die Konfiguration zu aktivieren, bekommt man eine Reihe von Binlog-Dateien und eine Indexdatei, die ein Verzeichnis dieser Dateien ist.

```console
linux:/export/data/rootforum/data # ls -l linux-bin*
-rw-rw----  1 mysql mysql 1034 Feb 13 23:07 linux-bin.000001
-rw-rw----  1 mysql mysql  421 Feb 14 09:06 linux-bin.000002
-rw-rw----  1 mysql mysql 1940 Feb 14 12:28 linux-bin.000003
-rw-rw----  1 mysql mysql  117 Feb 14 14:13 linux-bin.000004
-rw-rw----  1 mysql mysql 9666 Feb 20 13:40 linux-bin.000005
-rw-rw----  1 mysql mysql  650 Feb 20 15:29 linux-bin.000006
-rw-rw----  1 mysql mysql   98 Mar  1 10:33 linux-bin.000007
-rw-rw----  1 mysql mysql  133 Mar  1 10:33 linux-bin.index
linux:/export/data/rootforum/data # cat linux-bin.index
./linux-bin.000001
./linux-bin.000002
./linux-bin.000003
./linux-bin.000004
./linux-bin.000005
./linux-bin.000006
./linux-bin.000007
```

Die Binlog-Dateien enthalten alle Anweisungen, die Daten in Datadir verändern können in der richtigen Reihenfolge.
Mit dem Programm `mysqlbinlog` kann man sie sich ansehen. 
Neben den eigentlichen Queries findet man dann auch noch weitere Anweisungen, die das Umfeld für diese Queries vorbereiten und einige Kommentare, die es einem erlauben, Queries desselben Threads zu identifizieren und zu isolieren.
Außerdem finden sich im Binlog die Resultcodes und Ausführungszeiten für diese Statements als Kommentar.

Ein Beispiel:

```console
linux:/export/data/rootforum # cat mysqlbinlog-3340
#! /bin/bash --

MYSQL_CMD_DIR=/usr/local/mysql-max-5.0.18-linux-i686-glibc23
MYSQL_DIR=/export/data/rootforum

$MYSQL_CMD_DIR/bin/mysqlbinlog --defaults-file=$MYSQL_DIR/my.cnf $@
linux:/export/data/rootforum # ./mysqlbinlog-3340 data/linux-bin.000006
/\*!40019 SET @@session.max_insert_delayed_threads=0\*/;
/\*!50003 SET @OLD_COMPLETION_TYPE=@@COMPLETION_TYPE,COMPLETION_TYPE=0\*/;
# at 4
#060220 15:10:37 server id 3340  end_log_pos 98         Start: binlog v 4, server v 5.0.18-max-log created 060220 15:10:37 at startup
ROLLBACK;
# at 98
#060220 15:11:43 server id 3340  end_log_pos 179        Query   thread_id=2    exec_time=0      error_code=0
SET TIMESTAMP=1140444703;
SET @@session.foreign_key_checks=1, @@session.sql_auto_is_null=1, @@session.unique_checks=1;
SET @@session.sql_mode=0;
SET @@session.character_set_client=33,@@session.collation_connection=33,@@session.collation_server=33;
drop database boom;
```

Das Script `mysqlbinlog-3340` ist mein Wrapper für mysqlbinlog, das einen Zeiger auf die passende Konfigurationsdatei und das zu verwendende Binary enthält.
Auf diese Weise spare ich etwas Tipparbeit.

Der Aufruf `mysqlbinlog <name der Binlogdatei>` gibt dann den Inhalt dieser Datei als SQL-Source aus. 
Man kann diese Ausgabe in ein `mysql -u root -p` umleiten und so die Anweisungen erneut ausführen lassen.

Das eigentliche SQL sieht ein wenig komisch aus, ist aber gültig.
Kommentare der Form `/*! */` schließen dabei Statements ein, die nur ab einer bestimmten Version von MySQL verstanden werden sollen. 
Die Versionsnummer wird dabei als `xyyzz` gegeben, etwa mit `x=4`, `yy=00` und `zz=19`.
Das erste Kommando wird also nur dann gelesen, wenn der Dump von einem MySQL 4.0.19 oder neuer verarbeitet wird.

Eine Operation wird immer von einem Kommentar eingeleitet, der die Binlog-Position ("at 98") des Eintrags nennt, und besteht aus einer Reihe von vorbereitenden Kommandos und dann dem eigentlichen Kommando. 
Die vorbereitenden Kommandos sind immer `use <datenbankname>`, wenn notwendig und eine Reihe von `SET`-Statements, darunter auch `SET TIMESTAMP`, der die Ausführungszeit des Kommandos als Unix-Timestamp enthält.
`SET TIMESTAMP` bewirkt, daß Funktionen wie `NOW()` bei der Ausführung aus dem Binlog nicht mehr die aktuelle Zeit zurückliefern, sondern die mit `SET TIMESTAMP` gesetzte Zeit.
Dabei besteht zurzeit ein wesentliches Problem mit MySQL 5.0 und der Funktion SYSDATE() - man sollte sich in MySQL 5.0 besser auf NOW() verlassen.

```console
root@localhost [(none)]> SET TIMESTAMP=1;
Query OK, 0 rows affected (0.00 sec)

root@localhost [(none)]> SELECT NOW(), SYSDATE();
+---------------------+---------------------+
| NOW()               | SYSDATE()           |
+---------------------+---------------------+
| 1970-01-01 01:00:01 | 2006-03-01 10:55:44 |
+---------------------+---------------------+
1 row in set (0.33 sec)
```

# Point in Time Recovery mit dem Binlog

Man kann das Binlog nutzen, um nach einem Crash eine Point-in-Time Recovery zu fahren. 
Zu diesem Zweck benötigt man ein Vollbackup, und alle Binlogs, die seit diesem Zeitpunkt angefallen sind.
Damit die Binlogs eine bessere Überlebenschance haben, wenn das System hard crashen sollte, legt man sie meistens auf einem anderen Dateisystem ab als das eigentliche Datadir. 
Angenommen, man installiert seine Datenbanken alle nach `/export`, dann würde man seine Partitionierung so haben wollen:

```console
linux:/export/data/rootforum # df -Th
Filesystem    Type    Size  Used Avail Use% Mounted on
/dev/mapper/system-root
          reiserfs    8.0G  6.2G  1.9G  77% /
tmpfs        tmpfs    506M     0  506M   0% /dev/shm
/dev/sda5     ext2     99M  8.9M   85M  10% /boot
/dev/mapper/system-home
          reiserfs    8.1G  6.6G  1.6G  81% /home
/dev/mapper/system-data
          reiserfs    600G  520G   83G  87% /export/data
/dev/mapper/system-log
          reiserfs    600G  5.2G  594G  99% /export/log
linux:/export/data/rootforum # grep log-bin my.cnf
log-bin=/export/log/rootforum/linux-bin
```

Angenommen man macht eine Vollsicherung von `/export/data/rootforum` am Montag, und sichert dann jeden Tag die Inhalte von `/export/log/rootforum` als inkrementelles Backup weg, dann kann man die Datenbank wie folgt rekonstruieren:

Falls nur `/export/data` verloren ist, rekonstruiert man `/export/data` vom Montag aus der Vollsicherung und spielt dann die Binlogs von Montag bis Freitag mit `mysqlbinlog` wieder ab, indem man sie in einen `mysql`-Commandline-Client reinpiped.
Da das Binlog kontinuierlich aufgezeichnet wird, kann man so bis zum Zeitpunkt des Crashes voran rollen.

Natürlich muss man das Binlog genau ab dem Zeitpunkt abspielen, an dem das Vollbackup endet.
Daher ist es wichtig, daß das Vollbackup als Snapshot erzeugt wird, also genau einen Point in der Zeit des Datenbankservers darstellt.
Man muss außerdem wissen, welchen Namen dieser Punkt als Binlog-Position ausgedrückt hat.
Es gibt verschiedene Möglichkeiten, dies zu erreichen, die weiter unten im Einzelnen diskutiert werden.

Falls `/export/data` und `/export/log` verloren sind, muss man beide Verzeichnisse wieder herstellen und kann nur bis zum Zeitpunkt des letzten inkrementellen Backups wieder voran rollen. 
Daher wäre es schön, wenn man das Binlog nicht nur auf einer lokalen Platte sichern könnte, sondern auch noch einen Mechanismus hätte, der das Binlog "live" absaugt und woanders abspeichert.

Dieser Mechanismus ist genau ein Replication Slave.
Einen Slave setzt man auf, indem man ein Vollbackup des Masters auf einem anderen Rechner einspielt, und als Datenbankserver startet.
Auf dem Master erlaubt man dem Slave jetzt das Login mit dem Recht das Binlog abzusaugen:

```console
root@master [rootforum]> CREATE USER "slave" IDENTIFIED BY "pukcab";

root@master [rootforum]> GRANT REPLICATION SLAVE ON \*.\* TO "slave";
```

Dem Slave teilt man mit, wo sich der Master befindet und wie man sich dort einloggen kann. Außerdem muss der Slave natürlich wissen, auf welchem Stand er gerade ist.

```console
root@slave [rootforum]> CHANGE MASTER TO MASTER_HOST="master", 
    -> MASTER_PORT=3306,
    -> MASTER_USER="slave",
    -> MASTER_PASSWORD="pukcab";
root@slave [rootforum]> CHANGE MASTER TO MASTER_LOG="linux-bin.000001",
    -> MASTER_POS=98;
```

Die Binlogs ab File 1, Position 98 müssen auf dem Master nun noch bereitstehen. 
Der Slave wird sich nach einem `START SLAVE IO_THREAD` auf dem Master einloggen und damit beginnen, diese Files zu sich runterzuladen und sie im Slave abzuspeichern.
Nach einem `START SLAVE SQL_THREAD` wird er außerdem damit beginnen, sie auszuführen. 
Mit `SHOW SLAVE STATUS\G` kann man den Slave dabei beobachten, wie er die Binlogs vom Master absaugt und lokal abspielt.

Mit dem Slave hat man also nicht nur einen Binlog-Sauger gebaut, sondern der Slave spielt die Binlogs auch gleich ab, sodass man zur Recovery einfach nur das Datadir vom Slave nehmen und auf den Master transportieren muss.
Das ist die schnellste und bequemste Methode der Recovery.

# Physikalisches Vollbackup erstellen

Ein binäres Vollbackup ist einfach ein Abzug von Datadir, in unserem Beispiel also `/export/data/rootforum`.
Dabei muss lediglich sichergestellt sein, daß die Datenbank ihre Finger aus dem Datadir fernhält während das Backup läuft.
Am einfachsten kann man das erreichen, indem man die Datenbank vor dem Backup runterfährt und nach dem Backup wieder startet.
Nur so kann man sicher erreichen, daß auch alle Daten auf der Platte und konsistent sind, während das Backup gemacht wird.

Wird lediglich MyISAM verwendet und kommt InnoDB nicht zum Einsatz, kann man statt des Runterfahrens auch `FLUSH TABLES WITH READ LOCK` machen - die Verbindung mit diesem Kommando muss aber während des ganzen Backup stehen bleiben, denn das "UNLOCK TABLES" wird automatisch durchgeführt, wenn die Verbindung des `FLUSH TABLES WITH READ LOCK`-Prozesses beendet wird.
"FLUSH TABLES" wirkt aber nicht auf InnoDB, sodass man bei Verwendung von InnoDB sowieso die Datenbank runterfahren muss.

Damit die Downtime der Datenbank möglichst klein ist, verwendet man am besten einen Volume Manager mit Snapshots.
Das Backup kann dann so ausgeführt werden:

```console
! /bin/sh --

SNAPSIZE=4G
pass=geheim

cd /export/data/rootforum

# Optional: Neues Binlog anfangen
./mysql-3340 -u root -p$pass 'flush logs'

# Snap database
./stop
name=$(tail -1 /export/log/rootforum/linux-bin.index)
size=$(stat -c '%s' $name)
echo "binlog position $name $size" > /export/data/rootforum/data/restore.info
lvcreate -s -L $SNAPSIZE -n snap /dev/system/data
./start

# Backup snapshot

mount /dev/system/snap /export/snap
dobackup /export/snap/rootforum
umount /export/snap
lvchange -a n /dev/system/snap
lvremove /dev/system/snap

# Optional: Binlog kürzen
./mysql-3340 -u root -p$pass -e "purge master logs to '$name'"
```


Das Script hält erzeugt erst einmal ein neues Binlog, indem es ein "FLUSH LOGS"-Kommando absetzt. 

Danach hält es die Datenbank mit dem Stopscript kurz an.
Sobald das der Fall ist, kann die zum Backup gehörende Binlog-Position bestimmt werden und im Backup abgespeichert werden.
Die zum Backup passende Binlog-Position bestimmt man dabei am einfachsten, indem man den Namen und die Größe der letzten im Index stehenden Binlog-Datei aufzeichnet. 
Das Binlog ist gerade neu erzeugt worden, wird also relativ klein sein.

Mithilfe von Linux LVM wird nun ein Snapshot des Dateisystems erzeugt. 
Das geht sehr schnell, und braucht fast keine Zeit.
Die Datenbank kann dann neu gestartet werden und ist weiter operabel.

Das eigentliche Backup wird dann erzeugt, indem der Snapshot gemountet wird, und das eigentliche Backupscript dobackup aufgerufen wird, um das Backup auf Band zu schreiben.
Danach wird der Snapshot abgemeldet und zerstört. 

Sobald dies alles durch ist, ist sichergestellt, daß wir ein neues Vollbackup haben und alle Binlogs, die älter sind als das Backup können mit einem `PURGE MASTER LOGS`-Kommando weggeworfen werden.

# Logisches Vollbackup erstellen

Manche Leute bevorzugen statt eines physikalischen Vollbackups der Datenbankdateien ein logisches Backup, also das Backup von SQL-Statements, die den Inhalt der Datenbank neu erzeugen können. 
Auch das ist mit MySQL möglich, und zwar, indem man `mysqldump` verwendet.

Mit der Option `--master-data` wird dabei ein `CHANGE MASTER` Statement erzeugt, das die Binlog-Position aufzeichnet, die zum Backup passt.
Setzt man `--master-data=2` wird dasselbe Statement auch generiert, aber als Kommentar.

```console
linux:/export/data/rootforum # ./mysqldump-3340 --master-data rootforum | head -24
-- MySQL dump 10.10
--
-- Host: localhost    Database: rootforum
-- ------------------------------------------------------
-- Server version       5.0.18-max-log

/\*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT \*/;
/\*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS \*/;
/\*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION \*/;
/\*!40101 SET NAMES utf8 \*/;
/\*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE \*/;
/\*!40103 SET TIME_ZONE='+00:00' \*/;
/\*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 \*/;
/\*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 \*/;
/\*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' \*/;
/\*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 \*/;

--
-- Position to start replication or point-in-time recovery from
--

CHANGE MASTER TO MASTER_LOG_FILE='linux-bin.000007', MASTER_LOG_POS=879;
...
```

Damit das Backup konsistent ist, müssen außerdem die Optionen `--single-transaction` (wenn ausschließlich InnoDB verwendet wird) oder `--lock-all-tables` (geht für alle Tabellentypen, blockiert aber die Datenbank für die Dauer des Dumps) verwendet werden.
Die beiden Optionen schließen sich gegenseitig aus.
Die Option `--all-databases` sichert dann alle Datenbanken.
Damit Trigger und Stored Functions/Stored Procedures auch mit gesichert werden, müssen außerdem die Optionen `--triggers` und `--routines` mit angegeben werden.

Verwendet man `--lock-all-tables`, kann man außerdem zusätzlich noch `--flush-logs` und `--delete-master-logs` mitgeben, um vor dem Backup ein `FLUSH LOGS`-Kommando laufen zu lassen und nach dem Backup die Binlogs, die älter als das Backup sind, zu löschen.

Das komplette Kommando kann also so aussehen:

```console
linux:/export/data/rootforum # cat ./mysqldump-3340
#! /bin/bash --

MYSQL_CMD_DIR=/usr/local/mysql-max-5.0.18-linux-i686-glibc23
MYSQL_DIR=/export/data/rootforum

$MYSQL_CMD_DIR/bin/mysqldump --defaults-file=$MYSQL_DIR/my.cnf "$@"
linux:/export/data/rootforum # ./mysqldump-3340 -u root --master-data --lock-all-tables --triggers --routines --all-databases --flush-logs --delete-master-logs | gzip -9 > /export/backups/backup.sql.gz
```


# Inkrementelle Backups erstellen

Eine inkrementelle Sicherung besteht dann lediglich in einer Sicherung der Binlogs im Logdir.
Insbesondere wenn `sync_binlogs` eingeschaltet sind, ist es also ausreichend, einfach `/export/logs/rootforum` auf Tape zu ziehen - auch bei laufender Datenbank.

Man muss sich überlegen, wie oft man Vollbackups ziehen will.
Vollbackups mit dieser Methode blockieren die Datenbank oder erfordern ein kurzes Herunterfahren des Datenbankservers. 
Inkrementelle Backups können bei laufendem Server gezogen werden.
Mit einem Vollbackup kann man jedoch schnell recovern, sind außerdem noch Binlogs abzuspielen, kann die Recovery je nach Menge der Binlogs länger dauern.
Je nach Änderungsrate kann es also notwendig werden, öfter Vollbackups zu ziehen.

# Backup und Replikation

Eine andere Möglichkeit besteht darin, wie oben angesprochen einen Replication Slave aufzusetzen und die Sicherung des Master-Servers gar nicht mehr durchzuführen.
Das Backup auf Tape erfolgt dann durch Runterfahren des Slave, und gemütlicher Sicherung des Slave auf Band.
Startet man den Slave neu, zieht er sich die Binlogs vom Master, die während der Downtime angefallen sind, nachträglich runter und fängt an, diese abzuarbeiten. 
Der Master wird von dieser Aktion niemals in seiner Arbeit unterbrochen oder seiner Leistung beeinträchtigt.

Recovery besteht darin, den Slave runterzufahren und das Datadir des Slave auf den Master zu schieben.
Dort muss man dann noch die `master.info`-Datei des Slave löschen und man hat einen neuen Master.

Die Pflege des Masters besteht darin, per Cron alle Binlogs zu löschen, die so alt sind, daß der Slave sie garantiert nicht mehr braucht.
Man kann im Cron also ein `PURGE MASTER LOGS BEFORE NOW() - INTERVAL 7 DAY` oder so per Script einmal pro Tag abfahren.

Backup mit Replikation ist also bequemer, unterbrechungsfrei und die Recovery ist schneller.
