---
author-id: isotopp
date: "2007-08-25T20:08:45Z"
draft: true
feature-img: assets/img/background/rijksmuseum.jpg
published: true
tags:
- datenbanken
- mysql
- work
- lang_de
title: Eine MySQL Installation planen
---
<!-- s9ymdb:3519 --><img width="110" height="57" style="float: right; border: 0px; padding-left: 5px; padding-right: 5px;" src="/uploads/mysql_logo.serendipityThumb.gif" alt="" /> Für einen <a href="http://blog.koehntopp.de/archives/1775-Hardware-fuer-ein-MySQL.html">neuen MySQL-Server</a> muß nun die Installation geplant und durchgeführt werden und dann eine Konfiguration geschrieben werden.

[b]Welche Version?[/b]

Seit MySQL 5.0.30 existieren zwei Entwicklungslinien für den Datenbankserver: Die ungeraden Nummern (31, 33, ...) stehen für die MySQL Community Edition, die geraden Nummern (30, 32, ...) für die Enterprise-Version des Servers. Die Enterprise-Edition erhält nur Bugfixes, aber keine neuen Features, die Community-Edition dagegen soll auch experimentelle neue Features einbeziehen. Bis MySQL 5.0.36 enthalten beide Versionen dieselbe Codebasis, in 5.0.37 ist im Community-Zweig dann der SHOW PROFILE-Patch dazu gekommen.

Die Enterprise-Version steht <a href="http://mysql.com/enterprise">Enterprise-Kunden</a> zur Verfügung, die Community-Version ist frei runterladbar. Beide sind GPL-lizensiert, sodaß man sich den Enterprise-Source auch so herunterladen und selber compilieren kann (aber Enterprise ist halt mehr - Support und Merlin kommen auch noch dazu).


[b]RAID aufsetzen[/b]

Wie im <a href="http://blog.koehntopp.de/archives/1775-Hardware-fuer-ein-MySQL.html">Vorgänger-Artikel</a> gezeigt, wird man einen Datenbankserver in der Regel mit <a href="http://blog.koehntopp.de/archives/1711-RAID-5.html">RAID-10</a> und Thin Wide Striping installieren wollen. Im einfachsten Fall sehen wir also alle unsere Platten als ein JBOD und stopfen sie mit Linuxraid in eine Reihe von RAID-1 Paaren, die wir dann zu einem RAID-0-Streifen zusammenschieben. Alle Platten erscheinen dann als ein /dev/md0 oder ähnlich.

Alternativ lassen wir das einen RAID-Controller in Hardware tun, aber Linuxraid hat ein paar Vorteile. So ist es zum Beispiel mit den meisten RAID-Controllern nicht möglich, RAID-1 Paare Controller-übergreifend zu definieren (Platte 0 eines Mirrorpaares an dem einen Controller, Platte 1 an dem anderen Controller), außerdem ist Linuxraid in den meisten Szenarien schneller als ein Hardware-RAID - insbesondere weil bei einem RAID-10 auch keine XOR-Rechnerei oder anderes anfallen, sondern nur simpler I/O.

Dadurch, daß wir allen Platten in ein einziges Device stopfen ist später sichergestellt, daß alle möglichen Partitionen sich immer quer über alle vorhandenen Platten erstrecken, getreu dem bereits erwähnten <a href="http://www.sun.com/blueprints/1000/layout.pdf" -->Wide Thin Striping-Ansatz</a>.

Die Chunk-Size unseres RAID sollte dabei nicht zu klein sein, und ein Vielfaches der Blockgröße sein, die unsere Datenbank verwenden wird (in InnoDB sind dies Blöcke von 16K). Chunks von 64K, 128K oder 256K erscheinen als plausible Größen.

[b]Partitionieren[/b]

Aus unserem Plattenplatz müssen wir nun die notwendigen Partitionen schneiden - jedes Linux-System benötigt ein Rootfilesystem ("/"), Swap und eine Home-Partition ("/home"). Für einen Datenbankserver kommen noch eine Datenpartition ("/mysql/data") und eine Partition für das Binlog dazu ("/mysql/log"). Damit wir in der Partitionierung flexibel sind und die Möglichkeit für Snapshots haben, legen wir unser RAID-Device nun in die Hände des Linux Volume Manager (LVM2).

LVM verwaltet Plattenplatz in Stücken, die Extents genannt werden. Die Default-Größe von Extents ist 4M und für unsere Zwecke viel zu klein - unsere Platten sind ja wahrscheinlich etwas größer und mit 4M Extents erhalten wir dann unter Umständen mehrere 10.000 Extents. Das ist eine Granularität, die unsere Bedürfnisse weit übersteigt. 

Wir wollen eine Extent-Size wählen, die es uns erlaubt, den Plattenplatz mit einer Granularität von etwa einem Promille zu verwalten, also mit um die 1000 Extents in unserer Volume Group arbeiten. Als Nebenbedingung gilt, daß die Extents eine Zweierpotenz in Megabytes groß sein müssen. Für ein Array von 400G Größe wollen wir also theoretisch 400M Extents haben, um auf 1000 Stücke zu kommen. Eine Extent-Größe von 256M oder 512M ist also sehr viel sinnvoller als der Default von 4M, und so bekommen wir dann zwischen 1600 und 800 Extents, die wir auf unsere Partitionen verteilen können.

Normalerweise wird man nicht allen Plattenplatz im LVM sofort weg partitionieren, sondern nur so viel, wie erwartungsgemäß in naher Zukunft notwendig sein wird. Die überzähligen Extents läßt man als Maneuvriermasse frei in der Volume Group und erweitert die Partitionen später nach Bedarf.

Wegen verschiedenen Integrationsproblemen setzt LVM2 den Readahead-Wert der für eine Volume Group definiert ist nicht korrekt und reicht ihn auch nicht an die unterliegenden Treiber weiter. Es kann sich also lohnen, mit passenden "blockdev --setra ..."-Anweisungen für das /dev/md* und die Blockdevices des LVM herumzuerperimentieren und die Resultate für Random-I/O von 32K Blockgröße (!) zu benchmarken.

Am Ende wird man also so um die 10G an die Rootpartition zuweisen, so viel Swap definieren wie man RAM hat und mit so um die 10G Home anfangen. Die Größe der Datenpartition ergibt sich aus den Anforderungen für die Datengröße - wir erinnern uns, daß wir etwa 3-5 mal so viel Plattenplatz haben wie wir annehmen daß die Daten groß werden - und die Größe der Logpartition aus der erwarteten Changerate (Schreibrate) für unsere Anwendung. Bei beiden Größen sollte man nicht von der initialen Größe ausgehen, sondern ein wenig in die Zukunft schauen, damit man die Partitionen nicht zu oft und in zu kleinen Schritten vergrößern muß. Durch Verwendung von sinnvoll großen Schritten bekommen man weniger fragmentierte, besser linear verteilte Plattenplatz-Ausnutzung.

[b]Dateisystem auswählen[/b]

Alle Partitionen in einem Linux-Rechner ausgenommen eine eventuell vorhandene /boot-Partition wird man mit einem loggenden Dateisystem ausstatten wollen - /boot ist in der Regel zu klein dafür und wird sowieso nicht beschreiben, sodaß dies sinnlos wäre. In Linux kommen dafür zur Zeit entweder XFS oder ext3 in Frage - die Zukunft von Reiserfs ist ungewiß und jfs zu zu wenig getestet, weil es zu spät in den Kernel gekommen ist und niemals sonderlich populär war.

ext3 hat sehr viel weniger Code als XFS. Wenn man annimmt, daß die Rate von Fehlern zu Lines Of Code konstant ist, dann hat ext3 also sehr viel weniger Fehler als XFS, aber die Fehler von XFS sind an Stellen, an denen ext3 noch nicht einmal Features hat. Je nach persönlicher Präferenz wird man also eine oder andere Variante wählen - XFS das wesentlich bessere Verhalten bei vielen konkurrenten Zugriffen, verhält sich betreffend Fragmentierung sehr viel besser als ext3 und kommt besser mit sehr großen Partitionen und sehr vielen Dateien pro Verzeichnis zurecht. Meine Präferenz ist ganz klar XFS.

Wenn man sich für ext3 entscheidet sollte man das Dateisystem unbedingt mit der Option dir_index anlegen, damit das Dateisystem bei großen Verzeichnissen wenigstens näherungsweise sinnvoll skaliert. sparse_super als ext3-Option ist inzwischen Standard und bei den von uns verwendeten Plattengrößen auch dringend notwendig.

Wenn das Datei eine "noatime" Mountoption anbietet, dann kann es unter Umständen lohnend sein, diese auch zu verwenden. Bei einem reiserfs habe ich bei einem <a href="http://mysqldump.azundris.com/archives/37-Serving-Images-from-a-File-System.html">Random-I/O</a> Fileaccess-Benchmark etwa 150 KB/sec Logwrites gemessen, obwohl der Benchmark sonst read-only gewesen wäre.

[b]Datenbank installieren[/b]

MySQL kann aus RPM/DEB-Paketen oder aus einem .tar.gz installiert werden. Das .tar.gz wird nach /usr/local ausgepackt und dann /usr/local/mysql-<em>versionsnummer</em>/ von /usr/local/mysql aus verlinkt. So kann man <a href="http://mysqldump.azundris.com/archives/30-Instances.html">mehr als eine Version von MySQL</a> auf der Maschine parallel liegen haben, und dies macht Up- und Downgrades einfacher. Andererseits kann es vorteilhaft sein, aus RPM-Paketen zu installieren und sich des Installations- und Upgrademechanismus der Distribution zu bedienen, insbesondere um das Aufsetzen einer Maschine komplett zu automatisieren.

In jedem Fall muß der Datenbankserver nun konfiguriert werden. Für die Datensicherung und für High Availability-Szenarien hat es sich als vorteilhaft erwiesen die my.cnf, die vom Server verwendet wird, im Datadir des Servers abzulegen. Dadurch wird sie automatisch Bestandteil einer Vollsicherung des Servers bzw. ist im Fall eines Failovers automatisch zwischen beiden Maschinen geshared.

Man erreicht dies, indem man dafür sorgt, daß der Server mit der Option "--defaults-file=..." gestartet wird. Als Parameter ist der volle Pfadname der zu verwendenden Konfiguration anzugeben. Zusätzlich kann man ein Symlink von /etc/my.cnf (Debian, Ubuntu: /etc/mysql/my.cnf) zu dieser Datei legen, damit auch alle Kommandozeilen-Utilities dieselbe Konfiguration verwenden. 

Auf <a href="http://mysqldump.azundris.com/archives/56-A-quick-tour-of-DRBD.html">High-Availability Setups</a> macht dies jedoch Probleme, weil Clientprogramme dann auf dem Rechner keine Konfigurationsdatei vorfindet, der die Serverplatten gerade nicht sieht. Hier ist es besser, Serverkonfigurationen in einer my.cnf in Datadir abzulegen, Clientkonfigurationen jedoch in /etc/my.cnf (Debian, Ubuntu: /etc/mysql/my.cnf).
