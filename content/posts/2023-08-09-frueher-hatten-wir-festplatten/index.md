---
author: isotopp
title: "Früher hatten wir Festplatten..."
date: "2023-08-09T01:02:03Z"
feature-img: assets/img/background/rijksmuseum.jpg
toc: false
tags:
  - lang_de
  - filesystems
  - computer
aliases:
  - /2023/08/09/frueher-hatten-wir-festplatten.html
---

Früher hatten wir Festplatten. 
Das ist ein Stapel Glasplatten, die mit Eisenoxid beschichtet sind, gleichmäßig schnell rotieren 
und auf dem wir mit einem Kamm voller Schreib-Lese-Köpfe Teile magnetisieren oder die Magnetspuren auslesen.
Platten hatten CHS-Adressen für Sektoren, also Cylinder (drinnen, weiter draußen), Head (Scheibe) und Sektor (also welches Stück Scheibe).
Diese CHS-Adressen waren für das Betriebssystem sichtbar und das hat damit optimiert.

![](2023/08/disk.jpg)

Platten wurden dann schnell kompliziert.
Der Radius einer Spur auf einer drehenden Platte wächst, wenn man die Köpfe nach draußen schiebt. 
Also passen draußen mehr Sektoren darauf.

Das bedeutet aber, daß das ganze CHS-System so nicht mehr funktioniert, 
außer das OS kennt die spezielle und variable Geometrie der Platte.
Stattdessen hat die Platte einen eigenen Computer, den Controller, die Elektronik an der Unterseite der Platte.
Der kennt die Geometrie. 
Das OS nicht.

![](2023/08/disk-02.jpg)

Für das OS ist die Platte nun sehr viel einfacher: ein Array aus Sektoren.
Diese auf die wie auch immer geartete Plattengeometrie abzubilden ist Sache des Controllers, 
der physisch mit der Platte verbunden ist.

Wir bekommen "Lineare Block Addressen", LBA.
Viele OS kannten am Anfang gar keine LBA.
Daher geben Platten eine Fake-Geometrie raus, 
die aufgeht und darstellbar ist -- und unsinnig ist.
255 Cylinders, 63 sectors/track –– von einer SSD.

```console
root@server:/run/user/1000# fdisk -l -u=cylinders /dev/sde
Disk /dev/sde: 3.64 TiB, 4000787030016 bytes, 7814037168 sectors
Disk model: Samsung SSD 860
Geometry: 255 heads, 63 sectors/track, 486401 cylinders
Units: cylinders of 16065 * 512 = 8225280 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disklabel type: gpt
Disk identifier: A5C7EF27-A7B1-4E84-AFC8-24FC1DB1C7FB

Device     Start    End  Size Type
/dev/sde1      1 486402  3.6T Linux LVM
```

Viele Leute hätten gerne, aus was für Gründen auch immer, mehr als eine Festplatte - auch wenn sie nur eine haben.
Zum Beispiel um mehr als ein Betriebssystem zu installieren oder um sonst wie Dinge aufzuteilen.
Die Lösung war die "Partition".
Das ist eine Gruppe zusammenhängender Cylinder, die vom System als "eine logische Festplatte" angesehen werden.
Man schließt also sda an, und sieht bis zu 4 Geräte: sda1, sda2, sda3 und sda4.

Aus Gründen, die mit Microsoft und MS-DOS zu tun haben, gingen nur 4 Partitionen – 
die Partitionstabelle am Anfang der Platte war ein festes Array mit genau 4 Einträgen.
Es sind auch immer 4, nur manche sind als unbenutzt markiert und werden dann stillschweigend ignoriert.

Wenn man nun mehr als 4 haben will?
Sehr einfach:
macht man sich eine "Erweiterte Partition", die den ganzen Rest der Platte abdeckt und kann darin dann weitere Partitionen einrichten.

![](2023/08/disk-03.jpg)

Das ist dann eine lineare Liste.
Die Nummern der logischen Partitionen in der erweiterten Partition fangen immer bei 5 an.
Man kann also eine Bootpartition sda1 haben und eine erweiterte Partition sda2, die dann sda5, sda6 und sda7 enthält.
Kein normal denkender Mensch will das so, weil das auch nervt:
Partitionen müssen ja zusammenhängend sein und auf eine Platte passen.
Man kann sie also nur dann erweitern, wenn hinter ihnen freier Platz ist.

Ist da keiner, muss man den ganzen Rest der Platte "weiter nach hinten" kopieren und dann die Partition der Wahl erweitern.
Das kann sehr, sehr weh tun.
Was man stattdessen macht:

Man tut alle seine Platten in einen Sack. 
Diesen Sack nennen wir Volume Group, VG.
Die einzelnen Platten, die Physical Volumes, PVs, schneiden wir in gleich große Scheiben, die Physical Extents, PEs.
Die VG ist also ein Sack voll PEs, alle gleich groß, die auf unterschiedlichen Platten liegen.

Man will so um die 1000 bis 10.000 PEs in seiner VG haben.
Dann hantiert man mit Platz in Units von 1 Promille bis 0.1 Promille -- das ist genau genug.

![](2023/08/disk-04.jpg)

Wir können uns so Logical Volumes, also Laufwerke, zusammenbauen, die ein ganzes Vielfaches eines Extents groß sind und die aus LEs bestehen, Logical Extents.
Jedem LE wird mindestens ein PE als Backing Storage zugewiesen, aber da dies über eine Lookup-Tabelle passiert, können die PEs von irgendwoher kommen.

![](2023/08/disk-05.jpg)

Das Subsystem in Linux, das das macht, heißt LVM2, der Logical Volume Manager.
Er kann noch mehr:

- Es ist möglich, einem LE mehr als ein PE zuzuweisen. Dann hat man ein RAID 1.
- Es ist möglich, die Blöcke aus zwei PE auf unterschiedlichen PVs zu nehmen und blockweise abwechselnd zu benutzen. Dann hat man ein RAID 0.
- Mithilfe der Device Mapper Layer, die unterhalb von LVM Dienst tut, kann man so jede Menge absurde Storage Artistik abziehen.

Für uns ist wichtig zu verstehen, daß Partitionen in LVM – wegen LVM! – nicht mehr zusammenhängend sein müssen.

Es ist 2023.
Die Leute benutzen noch Devices, Partitionen und LVM, aber niemand benutzt noch Festplatten.
Alles ist SSD, eventuell sogar ohne beknacktes SATA-Interface, sondern mit dem Flash direkt auf dem PCIe-Bus.
Das ist dann NVME.

Das ist super, weil das S in SATA für Seriell steht, also auch Zugriffe auf das Gerät serialisiert.
Das Gerät hat aber einen Haufen Chips, die man alle parallel anblasen könnte,
wenn das SSSSSSSATA nicht Zugriffe sssssserialsierte.
Also weg damit!

![](2023/08/disk-06.jpg)

Flash Storage hat nun noch ein anderes Problem.
Flash beschreibt "gelöschte" Blöcke in Sektoren von 512 Byte oder – neuerdings - 4096 Bytes.

Flash kann solche Sektoren aber nicht löschen, nur als "gelöscht" markieren.
Die eigentliche Löschung dauert recht lange und passiert in recht großen Erase Segmenten, die viele Sektoren enthalten.

Daher gibt es einen Hintergrundprozeß, der auf dem Controller läuft und guckt, ob valide Daten umsortiert werden können, sodaß ganze Erase Segmente frei werden.

![](2023/08/disk-07.png)

Dieser Hintergrundprozeß ist die Flash Translation Layer (FTL).

Sie hat eine große Zuordnungstabelle, die die eingehende LBA vom Computer auf eine physikalische Blockadresse im Flash mapped. 
Und die FTL kann im Hintergrund Blöcke verschieben, umsortieren oder reorganisieren, ohne daß das vorne an der LBA sichtbar wäre.
Das hat eine Reihe von Konsequenzen. 
Eine ist, daß man eine SSD nicht zum Löschen überschreiben kann – 
die FTL sortiert hinten lustig Kram hin und her und es ist nicht gesagt, 
dass ein Durchschreiben von LBA 0 nach LBA n alle Daten auf der SSD überschreibt, oder daß Allgemein nichts Lesbares mehr auf der SSD steht.

Daher gibt es bei vielen SSD eine Hardware Drive Encryption, 
und zum Löschen des Laufwerkes geben wir der Disk einfach das Kommando, den Key zu vergessen.
Damit ist die faktisch gelöscht.

Oder wäre es, [könnte man der Implementierung der Hardware Drive Encryption vertrauen](https://www.bleepingcomputer.com/news/security/flaws-in-popular-ssd-drives-bypass-hardware-disk-encryption/).
Eventuell ist man mit so was wie LUKS und dem Wegwerfen der LUKS-Schlüssel besser dran als mit der Hardware Verschlüsselung von Drive-Controllern aus Chinesium.
Aber in jedem Fall ist man mit einem verschlüsselten Flash Drive besser dran als mit "Überschreiben".
Oder man etabliert einen Prozess, 
bei dem jeder Storage in einem Server in unseren RZ dies nur noch durch einen Shredder verlassen kann.
Falls man seinen Leuten vertraut, dass sie nicht doch mal ein Drive aus der Schrottkiste mitnehmen.

Eine bemerkenswerte Eigenschaft von Flash sind "Seeks", also Datentransfers zwischen nicht physisch aufeinander folgenden Blöcken.
Disks schaffen so um die 200 Disk Seeks pro Sekunde, und die tatsächlichen Zeiten variieren auch stark – je Seek, desto Wait.
Bei SATA/SAS SSD haben wir circa 20.000 Seeks pro Sekunde und bei NVME bis zu 800.000 davon (weniger, je mehr Bits pro Flash-Zelle).

Wenn Ihr bei der FTL aufgepasst habt, 
dann wißt ihr, dass aufeinanderfolgende LBA eventuell gar keine aufeinanderfolgenden PBA sind,
also im Flash nicht nebeneinander liegen müssen.
Das merkt niemand, weil die Seek Zeiten bei Flash uniform sind.
Aber Moment mal ...

Wir haben uniforme Seekzeiten und wir haben in der FTL eine Lookup-Tabelle die verdammt ähnlich aussieht wie die Lookup-Tabelle in LVM.
Können wir dann nicht auch Nichtzusammenhängende Partitionen in Hardware bekommen?
Können wir. Jedenfalls ein paar.
Das sind NVME Namespaces, also die "nX" an Euren /dev/nvme1n1-Devices.

Die kann man mit dem "nvme" Kommando einrichten und abreißen und ihnen auch Platz zuweisen.
Der liegt dann irgendwo und die FTL weiß, wo genau.
Aber zusammenhängend ist das nicht, auch wenn Ihr das nie sehen werdet.
NVME Namespaces sind also so eine Art Hardware LVM mit einer limitierten Anzahl Plätzen.

Wie Hardware ist mein Hardware LVM denn?
Nun. 
Mit SR-IOV bekommt jede einer Hardware-Nichtpartitionen auch ein Haufen Fake-PCI-Register,
die ich in den Adressraum etwa einer VM mappen könnte, sodaß effektiv jede VM eine "Partition" meiner NVME als fast echtes PCIe Busdevice sehen kann.

Leider gerät an dieser Stelle die Implementierung ins Zielfeld,
und teilt uns mit, daß das zwar schnell ist, aber leider nicht dicht,
und man darauf also nicht unbedingt vertrauen sollte.
Aber schön wäre es gewesen!

Wie dem auch sei:
Jetzt haben wir dieselbe Idee also

- einmal in einem ARM-Rechner, der am Flash jenseites des PCIe Busses klebt – dem Flash Controller mit der FTL, als NVME Namespaces.
- Und dann noch einmal eine Ebene höher, diesseits des PCIe, als LVM2 unter dem Filesystem.
- Und dann noch einmal eine Ebene höher, im Dateisystem, jedenfalls wenn es APFS oder ZFS ist, auf Dateisystem und Datei-Ebene.

Dreimal dieselbe Idee, mit einer Lookup-Tabelle, Namespaces und dem Zusammenkleben von Blocks.
Außer, wenn man Apple ist.
Dann baut man seine Hardware selbst, realisiert den Flashcontroller in denselben Die wie die CPU oder lässt ihn gleich als Teil der CPU laufen,
schließlich ist es sowieso ein System-on-a-Chip.
Und redet dann mit den Flash-Chips neben der CPU.
Die sind eh nur neben dem Die mit der CPU, weil sie dort noch nicht hineinpassen.

Und dann kann man diese Ebenen zumindest teilweise integrieren, einige Indirektionen sparen und generell schneller sein.
Das setzt aber natürlich voraus, daß man seine Hardware komplett kontrolliert, sodaß die Komponenten aufeinander abgestimmt werden können.

Außer Apple können das nur zwei Hände voll andere Firmen auf diesem Planeten, 
und die anderen sind alle Cloudbetreiber, die ihre Hardware oder gar – wie Amazon-Annapurna-ARM – ihre CPUs selbst fertigen können.
Dann gehen auf einmal ein Haufen Abkürzungen und man kann so Sachen wie kaputte Hypervisoren und SR-IOV direkt selbst fixen.
Und das ist, warum Amazon schöne Dinge haben kann, aber ein "Private Cloud" Openstack nicht.

![](2023/08/disk-08.png)

*Jan schreibt: "Was Betriebssysteme noch nicht verstanden haben, ist das es nur noch Memory gibt.
In unterschiedlichen Geschwindigkeitsklassen.
Und Anbindungen.
Lokal, Netzwerk.
Das ist der einzige Unterschied. 
Es gibt nur noch wenige Fälle.
Memory ist da oder nicht.
Latenz ist close to zero oder nicht deterministisch. 
Deal with it."*

In Unix ist ja alles entweder ein File, also persistent, und via open/read/write/seek/tell/close zu bearbeiten. 
Oder ephemeral, und via malloc zu bekommen.

Speicher, so wie ihn Unix kennt, hat keine Eigenschaften (ephemeral, persistent), Granularität (byte, page welcher Größe auch immer),
und auch keine Eigner und Zugriffsrechte, sowie keine Verzeichnisdienste.
Die Infrastruktur, die ein Dateisystem bereitstellt, ist ja weit mehr als nur die open/read/write/close API.

Es ist auch der Verzeichnisbaum und die an den Dateien klebenden Zugriffsrechte, Flags, xattr und was es sonst noch so gibt, und eine bestimmte Locking-API.
Speicher hat zwar auch Locks, aber andere, und kennt die Konzepte Eigner, hierarchischer Namespace und was da sonst noch so existiert nicht.
Sun hat mal eine Zeit lang mit [wilden Dingen](https://en.wikipedia.org/wiki/Transactional_memory) herumgespielt, die Teile dieses Problemraumes adressiert haben.
HP auch, mit [einem anderen Teilaspekt](https://www.nextplatform.com/2019/09/09/inside-hpes-gen-z-switch-fabric/) dieser Sache.
In beiden Fällen geht es um einen Haufen CPUs, die gemeinsam auf einem Speicher herumdengeln, der vielleicht oder vielleicht auch nicht lokal ist.
Das löst aber jeweils nur einen Teilaspekt des Problems.
Und es gibt keinerlei Software, die damit um könnte.

In Unix.
Anderswo gibt es schon seit den späten 80er Jahren Rechner mit einer Art "hardware unabhängigem Bytecode", 
64 Bit Uniform Address Space und einer Art speicherbasierten, transaktionsorientierten Datenbank, Namespaces und Zugriffsrechten.
Das ist dann aber kein Unix, sondern etwas anderes, bizarres, außerirdisches, das keiner von Euch je gesehen hat.

[Alien Systems/400](https://en.wikipedia.org/wiki/IBM_AS/400)

Das ist das, was man bekommt, wenn man eine JVM erfindet, 
bevor es Java gibt und wenn man persistenten Speicher mit RAM und "mmap() aber in richtig" und wie eine Datenbank riechend erfindet.
AS/400 ist irgendeine CPU – das wurde in der Zwischenzeit auch mehrfach geändert und keiner hat es gemerkt – und
irgendwelcher Speicher (viel weniger als 64 Bit, aber das hat auch keiner gemerkt, das RAM ist ja nur Cache).
Statt "everything is a file" "everything is an object".

In der Zwischenzeit hat Intel Optane wieder eingestellt.
Das Pricing war falsch, aber vor allen Dingen hat keiner das richtig nutzen können.
Zu RAM für ein Filesystem, und zu persistent für RAM – meh, was soll ich damit?
Wenn alles entweder ephemeral oder ein File ist, dann ist "persistent, und so schnell wie RAM" irgendwie nicht zu gebrauchen.
