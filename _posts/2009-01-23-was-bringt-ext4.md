---
layout: post
title: "Was bringt ext4?"
author-id: isotopp
date: 2009-01-23 19:14:35 UTC
feature-img: assets/img/background/rijksmuseum.jpg
tags:
- filesystems
- free software
- linux
- lang_de
---
Der Linux-Kernel 2.6.28 enthält das ext4-Dateisystem standardmäßig und sowohl Fedora als auch Ubuntu werden es unterstützen. Was bringt ext4 an Änderungen?

Ein Dateisystem ist für die meisten Benutzer eine quasi unsichtbare Sache. Es sind halt Dateien da und wenn man auf diese zugreift hat man halt Daten. So sind Dateisystem-Features für die meisten Leute also eine sehr unspektakuläre Sache. Die folgende Übersicht ist also etwas geekzentrisch.

## Extents

ext2 und ext3 sind sehr traditionelle Dateisysteme, die intern im Grunde auf Technik von 1984 basieren. ext2 ist eine minimal verbessere Nachprogrammierung des BSD ffs (bei Sun und MacOS X: ufs), ext3 fügt dem lediglich das Journal zur schnelleren Wiederherstellung nach Systemcrashes zu. Beide Dateisysteme speichern die Metadaten von Dateien in einer Inode ab und merken sich die Lage der Datenblöcke in einer Datei in einem (in sogenannten Indirect-Blocks gefalteten) Array von Blocknummern. In einem Artikel von 1994 habe ich das mal [länger ausgeführt](http://kris.koehntopp.de/artikel/dateisysteme/).

Da mit einigem Glück die meisten Dateien nicht fragmentiert gespeichert sind, besteht dieses Array also bei vielen Dateien aus einer langen Folge von unmittelbar aufeinander folgenden Blocknummern. Das ist unglaublich ineffizient.

XFS, also Technik von 1994, ist eines der ersten Dateisysteme gewesen, das stattdessen mit Extents arbeitet, also Blockfolgen durch Run Length Encoding komprimiert: Statt einer Folge von Blocknummern wird die Startnummer der Folge und ihre Länge als ein Paar gespeichert. 15 Jahre später führt man dieses Detail auch in ext4 endlich ein.

## Große Dateisysteme

Eine andere Technik von XFS kopiert man dabei nicht: Kompression von Blocknummern. ext4 unterstützt große Dateisysteme durch den Einsatz von 64 Bit großen Blocknummern. Da die Kernel-Infrastruktur noch nicht entsprechend mitgewachsen ist, sind derzeit 48 Bit große Blocknummern nutzbar, was für immerhin schon Exabyte-große Dateisysteme ausreicht. Anders als XFS, das ebenfalls ein 64 Bit-Dateisystem ist, speichert ext4 jedoch immer ganze 8 Byte große Blocknummern, während XFS auch relative Blockadressen zum Beginn jeweils einer Zone verwenden kann und so an vielen Stellen mit 4 Byte langen Zahlen auskommt, auch wenn es 64 Bit adressieren kann.

Weil ext2 und ext3 im Grunde saubere Rewrites von FFS waren, haben sie auch die 16 Bit große Linkcount-Zahl von diesem geerbt und konnten so bis zu 32767 Links pro Datei verwalten. Da Unterverzeichnisse durch den ".."-Eintrag den Linkcount des Elternverzeichnisses erhöhen, war man so auf 32765 Unterverzeichnisse pro Directory beschränkt. ext4 geht hier anders vor und das Limit existiert nicht mehr.

## Neues Blockbelegungsschema

Jedes Dateisystem hat Funktionen mit denen es entscheidet auf welchen physischen Blöcken der Platte eine Datei zu liegen kommt. Ziel diese Allokators ist es dabei, die Fragmentierung von Dateien zu verhindern und die Dateien so anzuordnen, daß schnell lesen darauf zugegriffen werden kann.

Der Allkokator von ext2 und ext3 ist dabei notorisch schlecht. Zum einen beherrschen diese Dateisyteme keine verzögerte Blockzuweisung: Jeder Block einer Datei muß physikalisch angeordnet werden sobald der Kernel Platz für den Block im File System Buffer Cache belegt. Wenn also eine große Datei linear geschrieben wird bedeutet das, daß das Dateisystem schon versucht den ersten Block der Datei zu positionieren ohne abzuwarten ob und wie viele weitere Blöcke noch folgen werden.

XFS hatte schon 1994 eine bessere Strategie: Blöcke werden im File System Buffer Cache auch ohne physikalische Positionsinformation gecached. Dadurch kann etwa ein linearer Write einer ganzen Datei erst einmal im Cache abgelegt werden und erst am Ende, wenn die Datei geschlossen und geflushed wird, muß eine Layoutentscheidung getroffen werden. Diese kennt dann aber schon die Gesamtgröße der Datei und das Dateisystem kann versuchen die Datei am Stück zu schreiben. ext4 kann nun endlich auch solche delayed allocation und reiht sich so neben XFS, ZFS, btrfs und Reiser4 ein.

ext2 und ext3 belegten dabei den Platz auf der Platte einzelblockweise (in 4KB großen Blöcken) und haben dabei maximal 8 Blocks in Folge im Voraus belegt. Wenn man also ein Verzeichnis hat, in dem zwei Dateien gleichzeitig offen sind und verlängert werden (etwa: /var/log), dann entstehen so Zonen von jeweils 32 KB großen Dateistummeln, die sich gegenseitig im Weg stehen. Die Dateien sind maximal fragmentiert. ext4 fixt das dann auch in der ext?-Serie von Dateisystemen endlich.

ext4 bekommt außerdem ein Feature, das sich "persistent preallocation" nennt und das es Anwendungen erlaubt, dem Dateisystem schon vorab Hinweise darauf zu geben wie groß Dateien am Ende sein werden wenn die Anwendung mit ihnen fertig sein wird. Die Anwendungen dafür sind vielfältig: Mit ein wenig Management ließe sich so zum Beispiel das Guaranteed Rate I/O von XFS nachprogrammieren und ext4 kennt mit diesem Feature und ein wenig weiterer Magie auch Online-Defragmentierung.

## Schnelleres fsck und Prüfsummen

So wie ZFS und InnoDB es vorgemacht haben führt auch ext4 nun endlich Prüfsummen ein: Das Journal und Teile der Inode-Infrastruktur bekommen nun Prüfsummen, mit denen die Integrität der Daten nach einem Crash schneller gecheckt werden kann, sodaß der fsck optimiert werden kann und schneller abläuft wenn er dennoch einmal notwendig werden sollte. Dadurch kann auch der Journal-Commit selbst optimiert werden.

Von einer durchgehenden Prüfsummen-Infrastruktur wie in ZFS und einer Online-Prüfung von Checksummen ist man in ext4 jedoch noch weit entfernt.

## Inode-Basteleien

Die Größe einer Inode ist in ext4 gewachsen: 256 Byte Minimumgröße statt bisher 128 Bytes. ext4 macht mit dem zusätzlichen Platz sinnvolle Sachen: Dateien bekommen Timestamps, die in Nanosekunden statt wie bisher in Sekunden rechnen, time_t stirbt und der verbleibende Platz kann verwendet werden um Extentlisten oder erweiterte Dateiattribute inline zu speichern.

Außerdem kann ext4 Inodes reservieren und dynamisch verwalten. Dadurch werden auch Metadata-Operationen sehr viel schneller und layouten sich besser physikalisch auf der Platte.

## Barrier Writes

Schließlich erzeugt auch ext4 nun ohne Journal=Data immer konsistente Datenstrukturen auf der Platte, indem Barrier Writes verwendet werden.

## Live Upgrade

ext4 kann ext3-Dateisysteme lesen. Es ist also möglich, ein ext3-Dateisystem als ext4 zu mounten. Die meisten Features, die ein ext4 einem ext3 voraus hat, sind dabei jedoch nicht nutzbar. Auch ein 

```console
tune2fs -O extents,uninit_bg,dir_index /dev/DEV
fsck -pf /dev/DEV
```

 schaltet diese Features nur für neue Dateien um, baut aber die vorhandenen Dateien und Verzeichnisse nicht auf das neue Format um. Die volle Effizienzsteigerung erlangt man also nur durch ein Umkopieren der Daten auf ein neue angelegtes, leeres ext4-Dateisystem.
 
## Was fehlt noch?

Grub unterstützt ext4 bisher noch nicht (d.h. die Grubs, die das können, haben es noch in keine Distro geschafft).

(siehe auch: 
[Kernelnewbies: ext4](http://kernelnewbies.org/Ext4))
