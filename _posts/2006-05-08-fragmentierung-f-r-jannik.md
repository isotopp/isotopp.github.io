---
layout: post
published: true
title: Fragmentierung (für Jannik)
author-id: isotopp
date: 2006-05-08 20:45:51 UTC
tags:
- computer
- filesystems
- erklaerbaer
- lang_de
feature-img: assets/img/background/rijksmuseum.jpg
---
ircnet, #lug-kiel, am 7. und 8. Mai.

Jannik wundert sich über fsck's Meldung 
```console
/: 130834/6553600 Dateien (1.1% nicht zusammenhängend), 1007700/13107200 Blöcke
Ist das schlimm?
```

**Jannik:**
hmm.. /: 
```console
130834/6553600 Dateien (1.1% nicht zusammenhängend), 1007700/13107200 Blöcke
```

Sieht so aus als wäre mein Dateisystem fragmentiert gewesen o.O?
Ich dachte, so etwas kennt Linux nicht.

**tholle:**
Linux oder das Dateisystem? ;-)

**Isotopp:**
Seufz. "1.1% nicht zusammenhängend" Natürlich können Dateien in
nicht fortlaufenden Blocknummern gespeichert sein. Warum meinst
du, daß das ein Problem sei? Oder anders herum, warum glaubst
Du, daß es gut ist, wenn eine Datei in fortlaufenden
Blocknummern gespeichert ist?

**Jannik:**
???

**Isotopp:**
Erklär mal was Du denkst, was die Ausgabe bedeutet, die Du da
bekommen hast?

**Jannik:**
Isotopp: Öhm. Ei, jetzt kommt hier ne Lehrstunde :D
Ja, vielleicht daß die Daten nicht zusammenhängen (in Blöcken
"nebeneinander" liegen) Also eine Datei zum Beispiel.

**Isotopp:** 
Ja, genau. Eine Datei ist zusammenhängend, wenn sie in
fortlaufenden Blocknummern gespeichert ist. Wenn in den
Blocknummern einer Datei lücken sind, ist sie fragmentiert.

**Jannik:**
Ich dachte sowas nennt man dann fragmentiert sein, so wie man
das bei Windows kennt. Ach so, gut.
Also kann das Dateisystem defragmentiert werden irgendwie?

**Isotopp:**

Wenn das z.B. ein ext2 oder ext3 ist, dann besteht das
Dateisystem aus Blockgruppen, In BSD ufs nennt man das cylinder
groups, das ist im Kern dasselbe. In einer bg befinden sich eine
Superblockkopie, die Inode-Bitmaps, die Block-Bitmap, die Inodes
der bg und dann die Datenblöcke. Jede bg ist also ein kleines
Mini-Dateisystem für sich. 

In ext2/ext3 kann eine Bitmap nur einen Block groß sein.

Früher war ein Block 1 kb groß. das sind also 8192 Bit in einem
Block. Also konnte eine bg 8192 Blöcke groß sein.

Heute hat ext2/ext3 4 kb blöcke. also sind 32768 Bit in einem
Bitmap block, und 32768 Blöcke in einer bg.

Früher waren also 8192 1 kb blocks = 8 MB eine bg. Heute sind
32768 4 kb blocks = 128 MB eine bg.

Was passiert, wenn du eine Datei mit 200 MB speichern willst?

**Jannik:**
Isotopp: dann wird eine bg belegt und eine 2. nur zum Teil.

**Isotopp:**
Ja, genau. Ist die Datei dann fragmentiert?

**Jannik:**
Nicht wirklich.

**Isotopp:**
Naja, sind die Blocknummern der Datei zusammenhängend oder nicht?

**Jannik:**
Ähm…

**Isotopp:**
Sie können nicht, denn irgendwo fängt ja die neue bg an.

**Jannik:**
Genau.

**Isotopp:**
Also liegt irgendwo Mitten in der Datei der Superblock und die
Bitmaps und die Inodes der neuen bg. Die Datei ist also
fragmentiert. In ext2/ext3 ist es nicht möglich eine Datei zu
speichern ohne sie zu fragmentieren, wenn sie größer als eine bg
ist.

Wenn eine 200 MB Datei eine bg komplett voll macht, dann sind ja
nur die Datenblöcke voll, die Inodes in der bg sind noch leer.
(bis auf eine, die von der 200 MB Datei) Jetzt wird eine zweite
Inode in der bg belegt, in der die Datenblöcke voll sind. Wo
werden die Datenblöcke der Datei abgelegt?

**Jannik:**
Ähm, woanders?

**Isotopp:**
Ja, weit weg von der Inode. Das ist aber doof, denn um die Datei zu lesen,
muß man die Inode lesen und dann die Daten finden und lesen.
Das dauert.

Die 200 MB Datei ist doch aber sowieso fragmentiert. wenn wir sie
schneller (früher) fragmentiert hätten, dann wäre noch Platz
frei in der 1. bg frei und die 2. Datei könnte ihre Daten näher
an der Inode speichern. Aber wieso glauben wir, daß
Fragmentierung was schlechtes ist? Wieso denken wir, daß
zusammenhängende Blocknummern an einer Datei gut sind?

**Jannik:**
Das glaube ich mittlerweile gar nicht mal mehr.

**Isotopp:**
Jannik: Du hast eine Festplatte. Wie lange dauert es denn bei
Deiner Platte, den Kopf von einer Inode zu den Datenblöcken in
einer anderen bg zu bewegen? Ungefähr?

**Jannik:**
Kein Plan. Nicht lang. Vermutlich keine Millisekunde.

**Isotopp:**
Kennt jemand die Zeit von seiner Festplatte hier?

* Isotopp hat eine Platte mit einer Seek Time von 8ms in seinem Laptop.

**Isotopp:**
Jannik: Festplatten haben Seek times zwischen 5 und 10ms.
Das heißt, die können 100-200 Seeks pro Sekunde machen

Damit haben wir einen Grund, warum ein Interesse besteht, Daten
auf einer Platte möglichst dicht beeinander zu speichern (Seeks
sind teuer), aber wenn wir sie _zu_ dicht beieinander speichern, 
dann kommen neue und alte Daten einander in die Quere.
Daher wirst du auf jedem Dateisystem mit grossen Dateien immer
fragmentierte Dateien finden.

**Jannik:**
Isotopp: Gut. aber Dateien werden trotzdem wie bei Windows
fragmentiert? Sodaß man Defragmentieren muss? Wie ist das, wenn
der Datenträger voll ist? Dann ist das System vermutlich
gezwungen zu fragmentieren?

**Isotopp:**
Ja, natürlich. Wenn die Platte fast voll ist, muss das
Dateisystem nehmen was da ist. ufs sagt das an.

> "changing optimization from time to space"

oder so ähnlich steht dann im syslog.
In ext2/ext3 sieht man das nicht, aber kein Dateisystem sollte mehr als 80% gefuellt werden, sonst wird es mit der
Allokation schwierig.

**Jannik:**
Gut.

**Isotopp:**
Wir wissen nun: Dateien sollten dicht beeinander stehen, damit Seeks vermieden werden. aber wenn wir das tun, etwa eine bg voll machen,
dann bauen wir uns die bg fuer alle nachfolgenden Dateien zu, und bekommen die Seeks dann da.

ufs vermeidetet das etwa, indem es "long Seeks" erzwingt. Es fragmentiert Dateien _absichtlich_ etwa alle 1mb oder so, indem es in eine andere bg wechselt.

Wenn du also eine Datei in ufs speicherst, wird das erste MB Daten in dieselbe bg geschrieben, in der die Inode der Datei steht, und dann wird ein long Seek erzwungen und in einer anderen bg weiter geschrieben. Dadurch bleiben Datenblöcke in der bg frei, sodaß die nächste Datei, die angelegt wird
Datenblöcke frei vorfindet in derselben bg wie ihre Inode.

In diesem fall ist es messbar vorteilhaft, die Datei zu fragmentieren als die unfragmentiert zu lassen. Cool was?

**Jannik:**
Noch am lesen. Weiß nicht ob ich das genau verstanden habe. Nochmal lesen ;)

**Isotopp:**
Vielleicht so: eine bg ist ein kleines Dateisystemchen mit Inodes und Datenblöcken. Wir wollen gerne, dass die Datenblöcke einer Datei dicht an der Inode stehen, sonst Seek und Seek ist langsam bei Platten.

Wenn wir eine grosse Datei abspeichern, belegen wir eine Inode in einer bg und dann alle Datenblöcke in dieser bg, weil es ja eine grosse Datei ist.

Wenn wir eine zweite Datei in derselben bg speichern wollen, finden 
wir noch eine freie Inode (war ja erst eine belegt) und dann aber 
keine Datenblöcke mehr,  denn die lange erste Datei hat die ja alle belegt.

ßWir müssen also die Datenblöcke von Datei 2 weit entfernt von der Inode von Datei 2 abspeichern, 
da die Datenblöcke in der Datei wo die Inode steht belegt sind.
Das ist doof.

**Jannik:**
Klar das hab ich noch verstanden. _Müssen_ wir?

**Isotopp:**
Wenn du die Inodes in dieser Blockgroup nicht ganz aufgeben willst - ja.

**Jannik:**
Ach so, ja klar.

**Isotopp:**
Über die Regeln, wie man Inodes auswählt, reden wir noch.

Der Punkt ist, dass wir Inode 2 beschreiben wollen in derselben bg wie Inode 1, aber keine Datenblöcke in dieser bg mehr frei sind.
Also können wir nur die Inode nehmen, müssen die Datenblöcke fuer Inode 2 aber weit weg in einer anderen bg abspeichern.

ufs versucht das zu vermeiden, 
genauer versucht ufs zu vermeiden, dass eine einzige grosse Datei alle Datenblöcke in einer bg belegt.

ufs geht also so vor:
- Wenn Datei 1 geschrieben wird,
wird eine Inode in der bg belegt und die daten zu dieser Inode 1 erst mal in dieselbe bg wie die Inode geschrieben
- nach einem MB oder so (konfigurierbar) macht ufs dann aber einen long Seek, erzwingt einen Wechsel der bg.

Das erste MB der langen Datei steht also in der ersten bg, der Rest dann in einer anderen, nach einem weiteren MB dann in einer noch anderen und so weiter.
ufs verteilt die grosse Datei also über die Datenblöcke in allen Blockgroups, in 1 MB grossen fragmenten.

**Jannik:**
Dadurch wird sie fragmentiert, aber ist das nicht schlecht für sie? Wird das nicht langsamer?
Effektiver wäre es vielleicht, wenn man das über mehrere Festplatten machen würde, mit LVM und so vielleicht?

**Isotopp:**
Ein wenig. _Aber:_ 
in der ersten bg sind nun noch Datenblöcke frei, und das erste MB von Datei 2 kann nun ebenfalls dicht bei der Inode von Datei 2 stehen.
Und ja, Raid 0, Raid 10 oder andere Dinge können hier helfen. Mehr Spindeln = mehr Möglichkeiten pro Sekunde, einen Seek zu machen.
Aber wenn du die Anzahl der spindeln als konstant (1, oder meinetwegen 6) ansetzt,
brauchst du trotzdem eine Optimierungsstrategie.
Man kann ja nicht jedes Problem mit beliebig viel Geld bewerfen.
Aber Dein Denkansatz ist vollkommen korrekt - mehr spindeln = mehr Seeks = weniger probleme.
Der Punkt ist - mit long Seeks stehen die Dateianfänge aller Dateien dicht bei den Inodes dieser Dateien.
Stell dir etwa mal ein `file *` auf ein Verzeichnis vor.
Oder `konqueror file:/home/jannik` - da müssen ja Previews gerendert werden, Dateitypen bestimmt und so weiter.
Da ist es schon ausgesprochen nützlich, wenn man die Dateianfaenge (die ersten MB oder so) dicht an den Inodes hat.

**Jannik:**
Steht das Wichtigste über eine Datei nicht im Anfang? Dateityp, Berechtigungen etc.?

**Isotopp:**
Wenn ein Dateiformat schlau überlegt ist, dann steht es am Anfang.
Aber metadaten wie Berechtigungen, Zeitstempel und alles andere stehen in der Inode.
Schau mal in `/usr/src/linux/include/linux/ext2_fs.h`

**Jannik:**
Wenn man mehrere Festplatten hätte, dann wäre es doch ziemlich cool die Dateien darüber zu streuen…

**Isotopp:**
Und suche da nach `struct ext2_Inode`.
Das ist eine Inode auf der Platte und was da drin steht.
Der `struct ext2_Inode` ist 128 Byte gross, wenn man nachzählt.
In einen 1024 Byte Block passen also 8 davon.

**Jannik:**
Den Pfad gibts bei mir nicht.

**Isotopp:**
Dann hast du keine Kernelsources oder Kernelincludes installiert.
Guckst Du bei [lxr](http://lxr.linux.no/source/include/linux/ext2\_fs.h#L211)
Das ist ein struct, eine Datenstruktur in C.
Das ist eine ext2/ext3 Inode auf der Platte.
Die daten da drin kannst du auslesen. Hast du eine ext2 oder ext3 Partition irgendwo wo du root bist?

**Jannik:**
Ja. Ähm, lvm is ja egal oder?

**Isotopp:**
Es geht nur um das Dateisystem, nicht um die Art der Partition.

**Jannik:**
Gut. Ja, dann hab ich.

**Isotopp:**
Hast du ein `/boot`?

**Jannik:**
`/boot` ist ext2.

**Isotopp:**
Wie heisst die Partition bei Dir? Bei mir ist `/boot` auf `/dev/sda5`.

**Jannik:**
```console
# mount |grep boot
dev/hdb4 on /boot type ext2 (rw)
```

**Isotopp:**
```console
linux:~ # debugfs /dev/sda5
debugfs 1.38 (30-Jun-2005)
debugfs:  ls
   2  (12) .        2  (12) ..      11  (20) lost+found    40  (16) message
6025  (24) grub    29  (12) boot    31  (16) vmlinuz       13  (76) initrd
```

debugfs arbeitet ja auf Dateisystemen, deswegen siehst du nur Sachen in /dev/hdb4 und nicht Zeugs da drüber
Du kannst nun mal `stat` auf einen Kernel machen. 
In meinem Fall

```console
debugfs:  stat vmlinux-2.6.13-15-default.gz
Inode: 27   Type: regular    Mode:  0644   Flags: 0x0   Generation: 1675033442
User:     0   Group:     0   Size: 1838899
File ACL: 0    Directory ACL: 0
Links: 1   Blockcount: 3608
Fragment:  Address: 0    Number: 0    Size: 0
ctime: 0x43f86651 -- Sun Feb 19 13:36:33 2006
atime: 0x4419638b -- Thu Mar 16 14:09:31 2006
mtime: 0x4327102c -- Tue Sep 13 19:45:16 2005
BLOCKS:
0-11):9711-9722, (IND):9723, (12-267):9724-9979, (DIND):9980, (IND):9981, (268-
523):9982-10237, (IND):10238, (524-779):10239-10494, (IND):10495, (780-1035):104
96-10751, (IND):10752, (1036-1291):10753-11008, (IND):11009, (1292-1547):11010-1
1265, (IND):11266, (1548-1795):11267-11514
TOTAL: 1804
```

Vergleiche das mit [LXR](http://lxr.linux.no/source/include/linux/ext2\_fs.h#L211)
vmlinux-... ist Inodenummer 27, ein Regular File.

In der Inode stehen 
- der Mode (hier: 0644), 
- die Flags (keine), 
- die ACL Nummern (keine)
- der Owner (root, 0) und 
- die Group (0, root)
- die Datei hat einen Namen (Linkcount 1), und 
- 3608 blocks
- die hat eine ctime, atime, mtime
- und dann kommen die Blocknummern der Datenblöcke und der Datenblockzeiger (INDirect blocks)

Und im struct siehst du genau das: Platzhalter für den Mode (16 bit),
eine uid, die Größe der Datei in Byte, die atime, ctime, mtime und dtime (nur gesetzt, wenn die Datei deleted wird)
die Gruppennummer, der Linkcounter
die Anzahl der Blöcke
und das Flags Feld.
und das Wichtigste: `struct: __le32 i_block[EXT2_N_BLOCKS];`
die Blockadressen der Datenblöcke.

In der Inode steht also alles über die Datei - ihre Eigenschaften und die Zeiger auf die eigentlichen daten, nur eine Sache fehlt.

Weißt du, welche Sache das ist?

**Jannik:**
Die Daten.

**Isotopp:**
Richtig, die stehen in den Datenblöcken.
Ich meinte aber was anderes, eigentlich.

**Jannik:**
Oder _was_ es für eine Datei es ist.

**Isotopp:**
Das steht in den oberen 4 Bit von `i_mode`.
Der Filemode ist ja `sstrwxrwxrwx` - das sind nur 12 Bit.

**Jannik:**
Steht da ob mp3 oder .wav? Das meinte ich.

**Isotopp:**
Das ist ja eine Extension, also Teil des Dateinamens.
Aber jetzt bist du auf einer Spur. Wo steht der Dateiname?

**Jannik:**
In der Datei. Also in den Datenblöcken.

**Isotopp:**
Nein, da stehen nur die Daten.
Jannik, mach mal `cd $HOME; touch lall; ln lall laber`
und dann `ls -li lall laber`
und paste den output.

**Jannik:**
```console
# ls -li lall laber
870099 -rw-r--r-- 2 root root 0 2006-05-08 21:43 laber
870099 -rw-r--r-- 2 root root 0 2006-05-08 21:43 lall
```

**Isotopp:**
Wie lang ist die Datei?

**Jannik:**
Genau das hat uellue mir letztens erklärt
mit den Hardlinks.

**Isotopp:**
wie lang ist die Datei?

**Jannik:**
870099?

**Isotopp:**
Nein, das ist die Inodenummer.

**Jannik:**
Ah, so. Ähm…

**Isotopp:**
0

**Jannik:**
ja

**Isotopp:**
In der Datei steht der Name nicht,
denn die Datei ist ja 0 byte lang.
Sie _hat_ gar keine Datenblöcke.

**Jannik:**
Suchte grad nach ner Zahl *g* Ach so, ja genau, `touch` erstellt nur eine Inode?

**Isotopp:**
ja

**Jannik:**
Und jetzt hat man 2 Inodes.

**Isotopp:**
In der Inode kann der Name auch nicht stehen. Denn beide Dateien haben ja dieselbe Inodenummer, aber verschiedene Namen.

**Jannik:**
Die auf das Gleiche verweisen würden?

**Isotopp:**
So ist es. Hast du 2 Inodes? Nein. Die Zahlen sind gleich am Anfang.

Wir lernen: der Name einer Datei steht _nicht_ in den Daten (0 bytes, keine Datenblöcke), 
und auch nicht in der Inode (2 Namen, eine Inode, wie wir beweisen können).
Was bleibt?

Der Name einer Datei steht in einem Verzeichnis. Verzeichnisse sind auch Dateien und in denen speichert Linux paare von (Name, Inodenummer) ab.

[LXR](http://lxr.linux.no/source/include/linux/ext2\_fs.h#L501) zeigt wie.

Ein `ext2_dir_entry` ist eine Inodenummer (32 bit) und dann ein Record von `rec_len` Bytes Länge, in dem `name_len` viele Bytes verwendet werden.
und dann natürlich der name, `name_len` bytes lang in ASCII.
Mit `touch lall; ln lall laber`
machst du also einen eintrag (870099, lall) und einen Eintrag (870099, laber) in `.`
(dem aktuellen Verzeichnis)

**Jannik:**
Ja.

**Isotopp:**
Hey, welche Inode hat /boot? `ls -dlsi /boot` sagt es dir?

**Jannik:**
```console
# ls -dlsi /boot
2 2 drwxr-xr-x 4 root root 2048 2006-05-02 00:37 /boot
```

**Isotopp:**
Und welche Inode hat `/`?

**Jannik:**
```console
# ls -dlsi /
2 4 drwxr-xr-x 22 root root 4096 2006-04-26 23:31 /
```

**Isotopp:**
Die erste Zahl ist die Inodenummer, die 2. Zahl ist die Länge in Blöcken.
Beide Dateien `/` und `/boot` haben als die Inode 2. Wie kann das sein?

**Jannik:**
Ähm. Beide sind in `/` eingehängt?

**Isotopp:**
Naja, `/` ist nirgendwo eingehaengt, `/` ist `/`.

**Jannik:**
Ja, ok. Deshalb? Was hätte dann die erste Inode?

**Isotopp:**
Du bist auf der richtigen Spur. Die root-Inode in ext2 hat immer die Nummer 2.
Und da `/` und `/boot` jeweils verschiedene Dateisysteme sind,
haben beide root-Inodes,
also haben beide die Inode 2.

**Jannik:**
Ach ja

**Isotopp:**
Wie kann Linux die beiden auseinander halten?

**Jannik:**
Durch die Verzeichnisstruktur?

**Isotopp:**
Nun eines ist auf `/dev/hdb4`, das andere auf `/dev/hdbsonstwas`.
Und wenn du `ls -l /dev/hdb*` machst
siehst du, daß jedes Device da intern andere Gerätenummern hat.
Die Inodenummer in Unix ist also nicht eindeutig, aber auf jedem System ist die Kombination `(major number, minor number, Inode number)`
zu jedem Zeitpunkt eindeutig.
(maj, min) bezeichnen die Partition, und in einer Partition ist (ino) eindeutig
Schau mal hier -> [LXR](http://lxr.linux.no/source/include/linux/ext2\_fs.h#L56).
Das mit der Inode 2 denke ich mir ja nicht aus, 
das muss ja irgendwo im source stehen
und da steht es.

**Jannik:**
cool
```c
#define EXT2_BAD_INO             1      /* Bad blocks Inode */
```

Was soll das dann heißen?
Das wird einfach ausgelassen?

**Isotopp:**
Inode 1 ist eine Datei, die in der Regel keinen Namen hat und die nur aus kaputten Blöcken besteht. 

Wenn du eine alte Platte hast, noch ohne Bad Blocks Management,
dann kannst du ein Dateisystem mit `mke2fs -c /dev/...` anlegen.
Das dauert sehr lange,
denn dabei wird jeder Block gelesen.
Zwangsläufig sind auf jeder HDD immer einige Blöcke im Eimer, -c findet 
die und fügt sie dann in die Datei Inode 1 ein.
Dadurch sind sie belegt und können nicht Bestandteil einer anderen Datei werden.

Bei Disketten mit ext2 hat man das sehr, sehr oft gebraucht
(Ich nehme an, Du hast noch mit Disketten gearbeitet, irgendwann mal).

**Jannik:**
Mach ich immer noch , aber noch nicht mit Linux. Habe es noch nicht gebraucht.
Doch, ich habe mal meinen grub auf einer Diskette gehabt, in einem externen diskettenlaufwerk :D
mit usb, hat er geschluckt. Fand ich cool.

**Isotopp:**
Die erste Datei, die auf einem ext2 angelegt wird, noch beim Erstellen, ist `lost+found`.
Die hat dann immer Inode 11, denn `EXT2_GOOD_OLD_FIRST_INO` ist 11.
Wenn du also mal ein `ls -li / /boot` machst, wirst du sehen, dass
- lost+found 11 ist
- alle Inodenummern ausser `.` und `..` größer als 11 sind.
(vorausgesetzt, alle betrachteten Dateisysteme sind ext2/ext3, denn bei reiser ist alles anders.

**Jannik:**
```console
       2 drwxr-xr-x   4 root root  2048 2006-05-02 00:37 boot
```

Hat wieder kleinere Inode ;P

**Isotopp:**
Wieso ist das so?

**Jannik:**
Ja, weil das wieder ein eigenes Dateisystem ist ;)

**Isotopp:**
Genau!
Wir wissen nun:
- Verzeichnisse sind Dateien.
- Verzeichnisse sind Listen von Namen und Inodenummern
- die /-Inode jedes ext2-Dateisystems ist 2
- es kann mehr als eine Inode 2 pro system geben, und an der (maj, min) des Devices auf dem sie liegt können wir sie unterscheiden.
- in der Inode stehen alle Informationen über eine Datei, insbesondere der Mode, die Times, und die Datenblockzeiger
- in der Inode steht NICHT der name der Datei, der steht im Verzeichnis
- in den Datenblöcken stehen nur die Daten

**Jannik:**
Auch wenn ich da jetzt noch nicht sehe, wie er das unterscheidet von `/` ...
Wie kann ich "(maj, min) des Devices auf dem sie liegt" herrausfinden?

**Isotopp:**
jannik: mit `mount`
oder genauer, mit `cat /proc/mounts`, denn da holt `mount` das her, und diese Liste ordnet Devices und Namens-Stummel einander zu.
Linux weiß dann: wegen `/dev/sda5 /boot ext2 rw 0 0`
muß ich ab `/boot` neu zu zählen anfangen, und zwar

```console
linux:/proc # ls -l /dev/sda5
brw-r-----  1 root disk 8, 5 May  6 22:44 /dev/sda5
```

auf (8, 5) statt auf (8, 1), bzw in meinem Fall statt auf (8, 5) auf (253, 1)

```console
linux:/proc # ls -lL /dev/system/root
brw-r-----  1 root disk 253, 1 May  6 22:44 /dev/system/root
```

**Isotopp:**
Wir wollten über Dateisysteme und Layoutstrategien reden.

Wir wollten ja, dass die Platte möglichst wenig Seeken muss.
Und wir hatten gelernt: es ist gut, Fragmentierung zu vermeiden und "dicht" zu packen, aber nicht zu dicht, 
sonst nehmen wir Platz fuer die folgenden Dateien weg.

Daher machen wir nach _großen_ Fragmenten von ca. 1 MB oder so eine absichtliche Fragmentierung um Platz fuer neue Dateien zu lassen.
Platten können Seeks machen, ab und zu. Kleine fragmente sind es, die uns langsam machen.

**Jannik:**
Ja.

**Isotopp:**
Wenn ich nun ein Verzeichnis anlege in ext2, und darin Dateien anlege, dann wird ext2 die Dateien alle in dieselbe bg tun wie das Verzeichnis.
Ich kann das an den Inode-nummern sehen.
Die Inode-nummern aller Dateien (nicht-Verzeichnisse) in `/` sollten in etwa gleich groß sein.

**Jannik:**
Ja

**Isotopp:**
Aber wenn ext2 ein Verzeichnis anlegt, dann tut es das neue Verzeichnis in einer _andere_ bg als das Elternverzeichnis.
Die Inode-nummern aller Verzeichnisse in / sollten sich von der Inode-nummer von / sehr unterscheiden.

```console
linux:/boot # ls -li
     2 drwxr-xr-x   5 root root    2048 Mar 26 11:00 .
    28 -rw-r--r--   1 root root 1541719 Sep 13  2005 vmlinuz-2.6.13-15-default
    40 -rw-r--r--   1 root root  133120 Nov  2  2005 message

  6025 drwxr-xr-x   2 root root    1024 Feb 11 21:20 grub
 10041 drwxr-xr-x   2 root root    1024 Dec 13 09:48 mysql
```

und in grub dann:

```console
linux:/boot/grub # ls -li
total 285
 6025 drwxr-xr-x  2 root root   1024 Feb 11 21:20 .
 6040 -rw-r--r--  1 root root     10 May  2 14:01 default
 6039 -rw-------  1 root root     15 Nov  2  2005 Device.map
 6026 -rw-r--r--  1 root root   7540 Dec 17 06:52 e2fs_stage1_5
```

Da liegt dann alles beieinander, und in einer anderen bg als /.
ext2/ext3 sortiert also Dateien _in_ einem Verzeichnis _dicht_ beieinander,
und Verzeichnisse _weit_ auseinander.
Dadurch wird die ganze Platte gleichmäßig genutzt,
aber auch das ist eine Art absichtlicher Fragmentierung

**Jannik:**
Ja.

**Isotopp:**
Es werden künstlich kontrolliert Seeks eingefuegt,
um die Struktur des Systems zu erhalten
und unkontrolliert entstehende kleine Fragmente zu vermeiden.

**Jannik:**
Gut.

**Isotopp:**
Die abstrakte Logik: irgendwann müssen wir sowieso fragmentieren. 
Das ist auch nicht schlimm, solange die Stücke einigermassen groß sind. 
Also fragmentiert ext2/ext3 und auch BSD ufs absichtlich und macht
große Stücke, die nicht schaden.
Dadurch entsteht eine locker gepackte Struktur, die die ganze Platte ausnutzt,
statt sich auf einer Ecke der Platte zu ballen und sich selbst im Weg zu stehen.

**Jannik:**
Hmm... Ich lerne daraus, dass ich meine Platten nie überfülle (Dateisysteme).

**Isotopp:**
Genau.
Und jetzt: wir erinnern uns was schlimm ist - Seeks.
Nimm an, du hast ein gut organisiertes ext2 oder auch vfat system, frisch defragmentiert.
Du loggst dich da ein und lädst dein kde,
und uellue loggt sich ebenfalls da ein und startet sein gnome,
und ich logge mich da ein und starte mein mysql.
Alle gleichzeitig.
Was wird passieren?

**Jannik:**
Die Festplatte wird springen müssen (Der Kopf)
wenn sie alles gleichzeitig machen soll

**Isotopp:**
Was nutzt uns unsere Defragmentierung nun?

**Jannik:**
Nix. In dem Fall ändert das nix.

**Isotopp:**
Unfragmentierte Dateien sind Dateien, die auf der Platte mit
aufeinanderfolgenden Blocknummern stehen
aber das nutzt nix, wenn die Lesezugriffe nicht linear erfolgen.

Fragmentierung oder Defragmentierung beschäftigen sich mit einem
_statischen_ Layout von Daten auf einer Platte,
aber entscheidend in einem System ist die _dynamische_ Sequenz von 
Lesezugriffen über die Zeit.


In einem Singleuser/Singleprocess-System wie MS-DOS
gibt es nur einen user und nur ein programm zur zeit.

**Jannik:**
Willst du darauf hinaus, dass Defragmentierung auf ext2 z.b. nicht nötig ist?

**Isotopp:**
Das liest dann seine Daten durch,
wodurch die _dynamische_ Lesefolge immer der _statischen_ Anordnung 
von Daten auf der Platte entspricht,
da die Zugriffe niemals unterbrochen werden können.

In MS-DOS bringt es also was, zu defragmentieren.

MS-DOS hat auch keinen file-system cache, d.h. jeder `read()`
endet unweigerlich _immer_ auf der Platte.

In Linux ist die Situation weitaus komplizierter:
wir haben mehrere User, jeder hat mehrere Programme, die lesen können 
und wir haben einen haufen RAM, den wir als Cache verwenden,
sodaß viele Reads gar nicht mehr auf die Platte gehen.

Für Seeks (die sind ja das, was langsam ist) ist aber die _dynamische_ 
Folge von Seeks, die die Platte wirklich sieht, relevant.

Und die entspricht bei Linux nun genau nicht mehr dem statischen 
Bild auf der Platte.

Wenn die Daten auf der Platte defragmentiert sind, und wenn die 
Lesezugriffe eines Programmes nicht durch andere Reader unterbrochen 
werden und wenn der cache leer ist, _dann_ ist Defragmentierung relevant, auch bei Linux.

Also
- beim Booten
- beim Login nach dem Booten

Das kann sehr viel schneller sein auf einem ordentlich defraggten System, 
denn da ist der Cache leer und Programme greifen nacheinander zu.

Danach - naja, ich habe 
```console
linux:/boot/grub # free -m
              total       used       free     shared    buffers     cached
 Mem:          1011        909        101          0         82        280
 -/+ buffers/cache:        547        464
 Swap:         2055          3       2051
```

ein Gig RAM, und davon sind 547 MB durch Programme belegt und 82+280 MB in Filesystem Caches.
Die meisten meiner Reads gehen der Platte am Arsch vorbei, denn sie kommen aus dem Cache.

**Jannik:**
```console
# free -m
              total       used       free     shared    buffers     cached
 Mem:          1517       1484         33          0         40       1052
 -/+ buffers/cache:        391       1126
 Swap:         1011        313        698
```
LOL.

**Isotopp:**
Du hast 1.1 Gig im Cache. 

**Jannik:**
1 GB cached?? Wow.

**Isotopp:**
Wie auch immer: Fragmentierung von Linux-Dateisystemen spielt eine eher untergeordnete Rolle.
ext2 und ext3 fragmentieren _absichtlich_ und auf eine kontrollierte Weise, damit 
große, schlau angeordnete Fragmente entstehen, 
und auch ohne Fragmente können Seeks auf der Platte durch konkurrente Zugriffe entstehen.

Wichtiger als zu Defragmentieren ist es, einen grossen Filesystem Cache zu haben.
Soweit klar?


**Jannik:**
ja

**Isotopp:**
1.1% fragmentation bei einem fsck sind also eine gute Sache.

0.0% wären doof.
Das heisst ja, dass wir einen nicht aufgelockerten Klumpatsch von 
Dateien haben (oder nur sehr viele, sehr kleine Dateien).

20% fragmentierung sind auch doof.
Das kann zum beispiel passieren, wenn wir sehr viele, sehr kleine
Dateien haben und dauernd Dateien löschen und anlegen.
Etwa in einem Squid Cache oder in einem USENET News mit tradspool.

Entscheidend ist aber - und die information gibt uns fsck leider nicht - daß 
die stücke alle so mittelgross sind,
etwa 1/100 bis 1/10 einer Blockgroup gross.


Kleiner ist von Übel, weil kleine Stücke viele Seeks bedeuten,
und größer ist von Übel, weil große Stücke die bgs zustopfen.

**Jannik:**
Ich schätze, ich will heute nicht mehr wissen, was reiserfs so toll macht?

**Isotopp:**
Heute nacht nicht, das schaffen wir nicht in 20 Minuten.
Aber wenn du willst kannst du dir als Hausaufgabe mal
ein ext2 directory aufmalen,
mit `(Inode, nam_len, rec_len, Dateiname)`
und dann überlegen, wie du die Datei mit dem namen `toller name eigentlich`
in einem  Verzeichnis mit 1 Million Einträgen findest, löscht und
dann die Datei mit dem namen `blurb` da drin anlegst.
Und wieso das so lange dauert mit einer Million Einträgen.
Dann können wir bald mal über reiser reden und wieso das da nicht so lange dauert.

**Jannik:**
Ok. :D Erst mal die Hausaufgabe verstehen.

**Jannik:**
Isotopp: das dauert so lange weil man erst alles abklappern muss, bis man auf den Namen trifft.
Muss ja alles überprüfen, 
ist jede Menge Arbeit . Gute Nacht, Isotopp, und Danke :D

**Isotopp:**
jannik: genau. Das ist effek0tiv eine "lineare Liste".

Wir schreiben Montag, den 8. Mai 2006, sie hörten den "Dienstag" zum Thema "Dateisysteme und Fragmentierung"

**Isotopp:**
und so eine Liste skaliert sich halt mit der Anzahl der Einträge im Verzeichnis.

**Jannik:**
immerhin ist die nicht fragmentiert \*g\*

**Isotopp:**
oh, die kann fragmentieren.
Wenn ich `langer name eigentlich` lösche und dann `kurz` erzeuge, bleibt ein Stück frei.
Das ist entweder verloren oder muss gelegentlich wieder belegt werden.

**Jannik:**
Wer sorgt für die Ordnung dafür? Wie räumt man denn schön auf auf seinem Dateisystem?

**Isotopp:**
und das alles werden wir ein andermal besprechen.
