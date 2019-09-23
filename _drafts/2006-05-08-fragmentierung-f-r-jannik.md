---
layout: post
published: true
title: Fragmentierung (für Jannik)
author-id: isotopp
date: 2006-05-08 20:45:51 UTC
tags:
- computer
- dateisysteme
- dienstag
- irc
- linux
- lang_de
feature-img: assets/img/background/rijksmuseum.jpg
---
ircnet, #lug-kiel, am 7. und 8. Mai.

Jannik wundert sich über fsck's Meldung <blockquote>/: 130834/6553600 Dateien (1.1% nicht zusammenhängend), 1007700/13107200 Blöcke</blockquite> Ist das schlimm?


--- Log opened So Mai 07 08:29:35 2006
13:30 <b>jannik</b>>  hmm.. /: 130834/6553600 Dateien (1.1% nicht zusammenhängend), 1007700/13107200 Blöcke
13:30 <b>jannik</b>>  sieht so aus als wäre mein dateisystem defragmentiert gewesen o.O?
13:30 <b>jannik</b>>  dachte sowas kennt linux nich..
13:31 <b>tholle</b>>  linux oder das dateisystem? ;-)
13:32 <b>jannik</b>>  ähm... beides
13:32 \* tholle muss nun mal wieder nen schlag reinhaun
13:32 <b>jannik</b>>  hehe
14:18 <b>Isotopp</b>>  seufz
14:19 <b>Isotopp</b>>  seufz
14:19 <b>Isotopp</b>>  "1.1% nicht zusammenhängend" 
14:19 <b>Isotopp</b>>  natürlich können dateien in nicht fortlaufenden blocknummern gespeichert sein
14:19 <b>Isotopp</b>>  warum meinst du, daß das ein problem sei?
14:19 <b>Isotopp</b>>  oder anders herum, warum glaubst du, daß es gut ist, wenn eine datei in fortlaufenden blocknummern gespeichert ist?
14:20 <b>Isotopp</b>>  jannik: ?
14:21 <b>jannik</b>>  hmm?
14:21 <b>Isotopp</b>>  erkär mal was du denkst, was die ausgabe bedeutet, die du da bekommen hast?
14:21 <b>jannik</b>>  Isotopp: öhm..
14:22 <b>jannik</b>>  ei, jetzt kommt hier ne lehrstunde :D
14:22 <b>jannik</b>>  ja vll das die daten nich zusammenhängen (in blöcken "nebeneinander" liegen)
14:22 <b>jannik</b>>  also eine datei z.b.
14:22 <b>Isotopp</b>>  ja, genau. eine datei ist zusammenhängend, wenn sie in fortlaufenden blocknummern gespeichert ist.
14:22 <b>jannik</b>>  gut.
14:23 <b>Isotopp</b>>  wenn in den blocknummern einer datei lücken sind, ist sie fragmentiert.
14:23 <b>jannik</b>>  ich dachte sowas nennt man dann fragmentiert sein, so wie man das bei windows kennt
14:23 <b>jannik</b>>  aso
14:24 <b>jannik</b>>  gut
14:24 <b>jannik</b>>  also kann das dateisystem defragmentiert werden irgendwie?
14:24 <b>Isotopp</b>>  wenn das z.B. ein ext2 oder ext3 ist, dann besteht das dateisystem aus blockgruppen,
14:24 <b>Isotopp</b>>  in bsd ufs nennt man das cylinder groups, das ist im kern dasselbe.
14:25 <b>Isotopp</b>>  in einer bg befinden sich eine superblock kopie, die inode-bitmaps, die block bitmap, die inodes der bg und dann die datenblöcke
14:25 <b>Isotopp</b>>  jede bg ist also ein kleines mini-dateisystem für sich
14:25 <b>Isotopp</b>>  in ext2/ext3 kann eine bitmap nur einen block groß sein.
14:26 <b>Isotopp</b>>  früher war ein block 1 kb groß. das sind also 8192 bit in einem block.
14:26 <b>Isotopp</b>>  also konnte eine bg 8192 blöcke groß sein.
14:26 <b>Isotopp</b>>  heute hat ext2/ext3 4 kb blöcke. also sind 32768 bit in einem bitmap block, und 32768 blöcke in einer bg.
14:26 <b>Isotopp</b>>  früher waren also 8192 1 kb blocks = 8 mb eine bg.
14:26 <b>Isotopp</b>>  heute sind 32768 4 kb blocks = 128 mb eine bg
14:27 <b>Isotopp</b>>  was passiert, wenn du eine datei mit 200 mb speichern willst?
14:28 <b>Isotopp</b>>  jannik: ?
14:29 <b>jannik</b>>  ja sry
14:29 <b>jannik</b>>  hab grad stress mit der planung einer rpg-session
14:29 <b>jannik</b>>  und jetzt les ich mir deinen text aufmerksam durch ;9
14:32 <b>jannik</b>>  Isotopp: dann wird eine bg belegt und eine 2. nur bruchteils
14:33 <b>Isotopp</b>>  ja, genau
14:33 <b>Isotopp</b>>  ist die datei dann fragmentiert?
14:33 <b>jannik</b>>  nicht wirklich
14:33 <b>Isotopp</b>>  naja, sind die blocknummern der datei zusammenhängend oder nicht?
14:34 <b>jannik</b>>  ähm...
14:34 <b>Isotopp</b>>  sie können nicht, denn irgendwo fängt ja die neue bg an.
14:35 <b>jannik</b>>  genau
14:35 <b>Isotopp</b>>  also liegt irgendwo mitten in der datei der superblock und die bitmaps und die inodes der neuen bg
14:35 <b>Isotopp</b>>  die datei ist also fragmentiert.
14:35 <b>Isotopp</b>>  in ext2/ext3 ist es nicht möglich eine datei zu speichern ohne sie zu fragmentieren, wenn sie größer als eine bg ist
14:35 <b>Isotopp</b>>  wenn eine 200 mb datei eine bg komplett voll macht,
14:35 <b>Isotopp</b>>  dann sind ja nur die datenblöcke voll,
14:36 <b>Isotopp</b>>  die inodes in der bg sind noch leer.
14:36 <b>Isotopp</b>>  (bis auf eine, die von der 200mb datei)
14:36 <b>Isotopp</b>>  jetzt wird eine zweite inode in der bg belegt, in der die datenblöcke voll sind.
14:36 <b>Isotopp</b>>  wo werden die datenblöcke der datei abgelegt?
14:39 <b>jannik</b>>  ähm
14:39 <b>jannik</b>>  woanders
14:39 <b>Isotopp</b>>  ja, weit weg von der inode.
14:39 <b>jannik</b>>  nicht in der bg
14:39 <b>Isotopp</b>>  das ist aber doof, denn um die datei zu lesen,
14:39 <b>Isotopp</b>>  muß man die inode lesen und dann die daten finden und lesen.
14:39 <b>Isotopp</b>>  das dauert.
14:40 <b>Isotopp</b>>  die 200mb datei ist doch aber sowieso fragmentiert. wenn wir sie schneller (früher) fragmentiert hätten,
14:40 <b>Isotopp</b>>  dann wäre noch platz frei in der 1. bg frei und die 2. datei könnte ihre daten näher an der inode speichern.
14:41 <b>Isotopp</b>>  aber wieso glauben wir, daß fragmentierung was schlechtes ist? wieso denken wir, daß zusammenhängende blocknummern an einer datei gut sind?
14:41 <b>jannik</b>>  das glaube ich mittlerweile gar nicht mal mehr
14:42 <b>Isotopp</b>>  jannik: du hast eine festplatte. wie lange dauert es denn bei deiner platte, den kopf von einer inode zu den datenblöcken in einer anderen bg zu bewegen?
14:42 <b>Isotopp</b>>  ungefähr?
14:42 <b>jannik</b>>  kp nich lang
14:42 <b>jannik</b>>  vermutlich keine milli sekunde
14:42 <b>Isotopp</b>>  kennt jemand die zeit von seiner festplatte hier?
14:43 \* Isotopp hat eine Platte mit einer Seek Time von 8ms in seinem Laptop.
14:43 <b>Isotopp</b>>  jannik: festplatten haben seek times zwischen 5 und 10ms.
14:43 <b>jannik</b>>  sry, ich muss leider off gehen
14:44 <b>Isotopp</b>>  das heißt, die können 100-200 seeks pro sekunde machen

--- Log opened Mo Mai 08 00:00:34 2006
20:57 <b>jannik</b>>  Isotopp: danke für den lehrgang übrigens ;) konnte mich gar nich bedanken :D
20:57 <b>Isotopp</b>>  jannik: der ist noch nicht zu ende, eigentlich
20:58 <b>Isotopp</b>>  jannik: wir hatten geklaert, dass ein ext2, ext3 oder ufs keine dateien speichern kann, die groesser als eine blockgroup sind
20:58 <b>Isotopp</b>>  jannik: ohne sie zu fragmentieren
20:59 <b>Isotopp</b>>  jannik: und wir hatten festgestellt, dass eine sehr lange datei eine blockgroup so ihrer datenbloecke berauben kann, dass alle folgenden dateien in dieser blockgroup ihre datenbloecke fern der inode in einer anderen bg speichern muessen
20:59 <b>Isotopp</b>>  jannik: wir hatten auch festgestellt, dass eine platte so ca 100-200 seeks pro sekunde machen kann, nicht mehr
20:59 <b>dfi</b>>  wie gro&#65533;ist denn eine blockgroup?
21:00 <b>Isotopp</b>>  jannik: damit haben wir einen grund, warum ein interesse besteht, daten auf einer platte moeglichst dicht beeinander zu speichern (seeks sind teuer),
21:00 <b>jannik</b>>  200 irgenwas mb oder 108?
21:00 <b>jannik</b>>  Isotopp: ja
21:00 <b>Isotopp</b>>  jannik: aber wenn wir sie ZU dicht beieinander speichern, dann kommen neue und alte daten einander in die quere.
21:00 <b>dfi</b>>  das geht ja
21:00 <b>Isotopp</b>>  dfi, eine blockgroup in ext2/ext3 kann so viele bloecke haben wie bits in einen block passen.
21:01 <b>Isotopp</b>>  dfi, bei 1024 byte blocks haben wir also 8192 blocks pro bg, das sind 8 mb.
21:01 <b>jannik</b>>  Isotopp: meintest du nicht heute wäre das mehrß
21:01 <b>Isotopp</b>>  dfi bei 4096 byte blocks haben wir 32768 blocks in einer bg also 128 mb
21:01 <b>jannik</b>>  aso
21:01 <b>Isotopp</b>>  jannik: nein, wir hoerten auf mit der frage, was wohl passiert wenn man eine 200 mb datei in ein ext3 mit 128 mb bgs speichert.
21:01 <b>jannik</b>>  Isotopp: ok glaub soweit hab ich verstanden
21:02 <b>jannik</b>>  ja
21:02 <b>Isotopp</b>>  jannik: die antwort war: die datenbloecke der bg werden aufgefuellt und dann wird eine andere bg gesucht, die freie bloecke hat.
21:02 <b>Isotopp</b>>  jannik: das geht nicht ohne seek ab, die datei muss also fragmentiert werden.
21:02 <b>jannik</b>>  ok
21:02 <b>Isotopp</b>>  jannik: ergo ist es nicht moeglich eine datei mit mehr als ca. 128 mb in ext3 mit 4kb blockgroesse zu speicher ohne sie zu fraggen
21:02 <b>Isotopp</b>>  jannik: oder mehr als 8mb bei 1kb blockgroesse
21:03 <b>jannik</b>>  ach so :D
21:03 <b>Isotopp</b>>  jannik: daher wirst du auf jedem dateisystem mit grossen dateien immer fragmentierte dateien finden.
21:04 <b>jannik</b>>  Isotopp: gut. aber dateien werden trotzdem wie bei windows fragmentiert? das man defragmentieren muss? wie ist das, wenn der datenträger voll ist? dann ist das system vermutlich gezwungen zu fragmentieren?
21:05 <b>Isotopp</b>>  ja, natuerlich. wenn die platte fast voll ist, muss das dateisystem nehmen was da ist. ufs sagt das an.
21:05 <b>Isotopp</b>>  "changing optimization from time to space"
21:05 <b>Isotopp</b>>  oder so aehnlich
21:05 <b>Isotopp</b>>  steht dann im syslog
21:06 <b>Isotopp</b>>  in ext2/ext3 sieht man das nicht, aber kein dateisystem sollte mehr als 80% gefuellt werden, sonst wird es mit der allokation schwierig
21:06 <b>jannik</b>>  gut
21:06 <b>Isotopp</b>>  jannik: wir wissen nun: dateien sollten dicht beeinander stehen, damit seeks vermieden werden. aber wenn wir das tun, etwa eine bg voll machen,
21:06 <b>Isotopp</b>>  jannik: dann bauen wir uns die bg fuer alle nachfolgenden dateien zu, und bekommen die seeks dann da.
21:07 <b>Isotopp</b>>  jannik: ufs vermeidetet das etwa, indem es "long seeks" erzwingt. es fragmentiert dateien ABSICHTLICH etwa alle 1mb oder so, indem es in eine andere bg wechselt.
21:07 <b>Isotopp</b>>  jannik: wenn du also eine datei in ufs speicherst, wird das erste mnb daten in dieselbe bg geschrieben, in der die inode der datei steht, udn dann wird ein long seek erzwungen und in einer anderen bg weiter geschrieben. dadurch bleiben datenbloecke in der bg frei, sodass die naechste datei, die angelegt wird
21:08 <b>Isotopp</b>>  jannik: noch datenbloecke frei vorfindet in derselben bg wie ihre inode.
21:08 <b>Isotopp</b>>  jannik: in diesem fall ist es messbar vorteilhaft, die datei zu fragmentieren als die unfragmentiert zu lassen
21:09 <b>Isotopp</b>>  cool was?
21:09 <b>jannik</b>>  noch am lesen
21:10 <b>jannik</b>>  weiß nicht ob ich das genau verstanden habe
21:10 <b>jannik</b>>  nochmal lesen ;)
21:10 <b>Isotopp</b>>  vielleicht so: eine bg ist ein kleines dateisystemchen mit inodes und datenbloecken.
21:11 <b>Isotopp</b>>  wir wollen gerne, dass die datenbloecke einer datei dicht an der inode stehen, sonst seek und seek ist langsam bei platten
21:11 <b>Isotopp</b>>  wenn wir eine grosse datei abspeichern, belegen wir eine inode in einer bg und dann alle datenbloecke in dieser bg, weil es ja eine grosse datei ist
21:11 <b>Isotopp</b>>  wenn wir eine zweite datei in derselben bg speichern wollen, finden wir noch eine freie inode (war ja erst eine belegt)
21:12 <b>Isotopp</b>>  und dann aber keine datenbleocke mehr, 
21:12 <b>Isotopp</b>>  denn die lange erste datei hat die ja alle belegt.
21:12 <b>Isotopp</b>>  wir muessen also die datenbleocke von datei 2 weit entfernt von der inode von datei 2 abspeichern, 
21:12 <b>jannik</b>>  klar das hab ich noch verstanden
21:12 <b>Isotopp</b>>  da die datenbloecke in der datei wo die inode steht belegt sind.
21:12 <b>Isotopp</b>>  das ist doof.
21:12 <b>jannik</b>>  MÜSSEN wir?
21:13 <b>Isotopp</b>>  wenn du die inodes in dieser blockgroup nicht ganz aufgeben willst - ja
21:13 <b>jannik</b>>  ach so ja klar
21:13 <b>Isotopp</b>>  ueber die regeln wie man inodes auswaehlt reden wir noch
21:13 <b>Isotopp</b>>  der punkt ist, dass wir inode 2 beschreiben wollen in derselben bg wie inode 1, aber keine datenbloecke in dieser bg mehr frei sind.
21:13 \* jannik sieht sich einem gewaltigen strom der macht von Isotopp ausgehend ausgesetzt ;)
21:14 <b>Isotopp</b>>  also koennen wir nur die inode nehmen, muessen die datenbloecke fuer inode 2 aber weit weg in einer anderen bg abspeichern
21:14 <b>Isotopp</b>>  ufs versucht das zu vermeiden, 
21:14 <b>Isotopp</b>>  genauer versucht ufs zu vermeiden, dass eine einzige grosse datei alle datenbloecke in einer bg belegt
21:14 <b>Isotopp</b>>  ufs geht also so vor:
21:14 <b>Isotopp</b>>  wenn datei 1 geschrieben wird,
21:14 <b>jannik</b>>  dadruch wird sie fragmentiert, aber ist das nicht schlecht für sie?
21:15 <b>Isotopp</b>>  wird eine inode in der bg belegt und die daten zu dieser inode 1 erst mal in dieselbe bg wie die inode geschrieben
21:15 <b>Isotopp</b>>  nach einem mb oder so (konfigurierbar) macht ufs dann aber einen long seek, erzwingt einen wechsel der bg.
21:15 <b>Isotopp</b>>  das erste mb der langen datei steht also in der ersten bg, der rest dann in einer anderen, nach einem weiteren mb dann in einer noch anderen und so weiter
21:16 <b>Isotopp</b>>  ufs verteilt die grosse datei also ueber die datenbloecke in allen blockgroups, in 1 mb grossen fragmenten.
21:16 <b>jannik</b>>  wird das nicht langsamer?
21:16 <b>Isotopp</b>>  ein wenig.
21:16 <b>Isotopp</b>>  ABER:
21:16 <b>jannik</b>>  effektiver wäre es vll, wenn man das über mehrere festplatten machen würde \*denk\* mit lvm und so vll?
21:16 <b>Isotopp</b>>  in der ersten bg sind nun noch datenbloecke frei, und das erste mb von datei 2 kann nun ebenfalls dicht bei der inode von datei 2 stehen.
21:17 <b>Isotopp</b>>  jannik: ja, raid 0, raid 10 oder andere dinge koennen hier helfen. mehr spindeln = mehr moeglichkeiten pro sekunde, einen seek zu machen.
21:17 <b>Isotopp</b>>  jannik: aber wenn du die anzahl der spindeln als konstant (1, oder meinetwegen 6) ansetzt,
21:17 <b>Isotopp</b>>  brauchst du trotzdem eine optimierungsstrategie.
21:17 <b>Isotopp</b>>  man kann ja nicht jedes problem mit beliebig viel geld bewerfen.
21:18 <b>Isotopp</b>>  aber dein denkansatz ist vollkommen korrekt - mehr spindeln = mehr seeks = weniger probleme
21:18 <b>Isotopp</b>>  der punkt ist - mit long seeks stehen die dateianfaenge aller dateien dicht bei den inodes dieser dateien.
21:18 <b>Isotopp</b>>  jannik: stell dir etwa mal ein "file \*" auf ein verzeichnis vor.
21:19 <b>Isotopp</b>>  jannik: oder "konqueror file:/home/jannik" - da muessen ja previews gerendert werden, dateitypen bestimmt und so weiter
21:19 <b>Isotopp</b>>  jannik: da ist es schon ausgesprochen neutzlich, wenn man die dateianfaenge (die ersten mb oder so) dicht an den inodes hat
21:19 <b>jannik</b>>  steht das wichtigste über eine datei nicht im anfang?
21:19 <b>jannik</b>>  dateityp berechtigungen etc
21:19 <b>Isotopp</b>>  jannik: wenn datei dateiformat schlau ueberlegt ist, dann steht es am anfang.
21:20 <b>Isotopp</b>>  aber metadaten wie berechtigungen, zeitstempel und alles andere stehen in der inode
21:20 <b>jannik</b>>  achso
21:20 <b>Isotopp</b>>  schau mal in /usr/src/linux/include/linux/ext2\_fs.h
21:21 <b>jannik</b>>  wenn man mehrere festplatten hätte, dann wäre es doch ziemlich cool die dateien darüber zu streuen...
21:21 <b>Isotopp</b>>  und suche da nach "struct ext2\_inode"
21:21 <b>Isotopp</b>>  das ist eine inode auf der platte und was da drin steht
21:21 <b>Isotopp</b>>  jannik: korrekt.
21:21 <b>Isotopp</b>>  der "struct ext2\_inode" ist 128 byte gross, wenn man nachzaehlt.
21:21 <b>jannik</b>>  hmm..
21:21 <b>Isotopp</b>>  in einen 1024 byte block passen also 8 davon
21:21 <b>jannik</b>>  den pfad gibts bei mir nicht
21:22 <b>Isotopp</b>>  dann hast du keine kernel sources oder kernel includes installiert
21:22 <b>Isotopp</b>>  2.6er kernel
21:24 <b>jannik</b>>  ich finde nur kernel images keine sourcen?
21:24 <b>Isotopp</b>>  was fuer eine distri?
21:24 <b>Isotopp</b>>  kernel sources gehen in der regel in ein etxrapaket
21:24  jule\_> jannik: ich nehme an du hast den kernel auch nicht selber gebacken
21:24 <b>jannik</b>>  hab ich nicht
21:24 <b>jannik</b>>  ubuntu
21:25 <b>Isotopp</b>>  jannik: apt-cache search kernel-source ?
21:25 <b>jannik</b>>  ~ 21:25 # apt-cache search kernel-source | grep 2.6
21:25 <b>jannik</b>>  ~ 21:25 #
21:26 <b>Isotopp</b>>  naja macht nix,
21:26 <b>Isotopp</b>>  gibt ja lxr.linux.no
21:27 <b>jannik</b>>  ähm.. wo finde ich das da?
21:28 <b>Isotopp</b>>  http://lxr.linux.no/source/include/linux/ext2\_fs.h#L211
21:28 <b>jannik</b>>  thx
21:29 <b>Isotopp</b>>  siehst du das?
21:29 <b>jannik</b>>  jepp
21:29 <b>jannik</b>>  cool..
21:29 <b>Isotopp</b>>  das ist ein struct, eine datenstruktur in c.
21:29 <b>Isotopp</b>>  das ist eine ext2/ext3 inode auf der platte
21:30 <b>Isotopp</b>>  die daten da drin kannst du auslesen. hast du eine ext2 oder ext3 partition irgendwo wo du root bist?
21:30 <b>jannik</b>>  ja
21:30 <b>jannik</b>>  ähm lvm is ja egal oder?
21:31 <b>Isotopp</b>>  es geht nur um das dateisystem
21:31 <b>Isotopp</b>>  nicht um die art der partition
21:31 <b>jannik</b>>  gut
21:31 <b>jannik</b>>  ja dann hab ich
21:31 \* jannik lebt atm nur auf ext2/3 dateisystemen
21:31 <b>Isotopp</b>>  hast du ein /boot?
21:31 <b>jannik</b>>  boot is ext2^^
21:31 <b>Isotopp</b>>  gut
21:32 <b>Isotopp</b>>  wie heisst die partition bei dir? bei mir ist /boot /dev/sda5
21:32 <b>jannik</b>>  boot is ext2^^
21:32 <b>jannik</b>>  ~ 21:32 # mount |grep boot
21:32 <b>jannik</b>>  /dev/hdb4 on /boot type ext2 (rw)
21:32 <b>jannik</b>>  ~ 21:32 #
21:32 <b>Isotopp</b>>  ah
21:32 <b>Isotopp</b>>  unset PAGER
21:32 <b>Isotopp</b>>  debugfs /dev/hdb4
21:32 <b>Isotopp</b>>  ls
21:33 <b>Isotopp</b>>  linux:~ # debugfs /dev/sda5
21:33 <b>Isotopp</b>>  debugfs 1.38 (30-Jun-2005)
21:33 <b>Isotopp</b>>  debugfs:  ls
21:33 <b>Isotopp</b>>   2  (12) .    2  (12) ..    11  (20) lost+found    40  (16) message
21:33 <b>Isotopp</b>>   6025  (24) grub    29  (12) boot    31  (16) vmlinuz    13  (76) initrd
21:33 <b>Isotopp</b>>  so in etwa sollte das auch bei dir aussehen
21:33 <b>jannik</b>>  was bringt unset PAGER
21:34 <b>Isotopp</b>>  da pfuscht dir das less nicht mehr drin rum in der ausgabe
21:34 <b>Isotopp</b>>  bei mir hat das sonst genervt
21:34 <b>jannik</b>>  aso
21:34 <b>jannik</b>>  less hat bei mir nie rumgepfuscht?
21:34 <b>Isotopp</b>>  mein less hat einen eigenen ausgabepuffer, nach dem q ist die less-ausgabe weg und der debugfs prompt wieder da.
21:35 <b>jannik</b>>  ähm
21:35 <b>Isotopp</b>>  das nervt, ich will dass das auf dem schirm bleibt
21:35 <b>jannik</b>>  aso
21:36 <b>Isotopp</b>>  debugfs arbeitet ja auf dateisystemen, deswegen siehst du nur sachen in /dev/hdb4 und nicht zeugs da drueber
21:36 <b>jannik</b>>  gut
21:36 <b>Isotopp</b>>  du kannst nun mal "stat" auf einen kernel machen. 
21:36 <b>Isotopp</b>>  in meinem fall
21:36 <b>Isotopp</b>>  debugfs:  stat vmlinux-2.6.13-15-default.gz
21:36 <b>Isotopp</b>>  Inode: 27   Type: regular    Mode:  0644   Flags: 0x0   Generation: 1675033442
21:36 <b>Isotopp</b>>  User:     0   Group:     0   Size: 1838899
21:36 <b>Isotopp</b>>  File ACL: 0    Directory ACL: 0
21:36 <b>Isotopp</b>>  Links: 1   Blockcount: 3608
21:36 <b>Isotopp</b>>  Fragment:  Address: 0    Number: 0    Size: 0
21:36 <b>Isotopp</b>>  ctime: 0x43f86651 -- Sun Feb 19 13:36:33 2006
21:36 <b>Isotopp</b>>  atime: 0x4419638b -- Thu Mar 16 14:09:31 2006
21:36 <b>Isotopp</b>>  mtime: 0x4327102c -- Tue Sep 13 19:45:16 2005
21:36 <b>Isotopp</b>>  BLOCKS:
21:36 <b>Isotopp</b>>  (0-11):9711-9722, (IND):9723, (12-267):9724-9979, (DIND):9980, (IND):9981, (268-
21:36 <b>Isotopp</b>>  523):9982-10237, (IND):10238, (524-779):10239-10494, (IND):10495, (780-1035):104
21:36 <b>Isotopp</b>>  96-10751, (IND):10752, (1036-1291):10753-11008, (IND):11009, (1292-1547):11010-1
21:36 <b>Isotopp</b>>  1265, (IND):11266, (1548-1795):11267-11514
21:36 <b>Isotopp</b>>  TOTAL: 1804
21:37 <b>Isotopp</b>>  vergleiche das mit http://lxr.linux.no/source/include/linux/ext2\_fs.h#L211
21:37 <b>Isotopp</b>>  vmlinux-... ist inode nummer 27, ein regular files.
21:37 <b>Isotopp</b>>  file
21:37 <b>Isotopp</b>>  in der inode stehen der mode (hier: 0644), die flags (keine), die acl nummern (keine)
21:37 <b>Isotopp</b>>  der owner (root, 0) und die group (0, root)
21:38 <b>Isotopp</b>>  die datei hat einen namen (linkcount 1), und 3608 blocks
21:38 <b>Isotopp</b>>  die hat eine ctime, atime, mtime
21:38 <b>Isotopp</b>>  und dann kommen die blocknummern der datenbloecke und der datenblockzeiger (INDirect blocks)
21:38 <b>Isotopp</b>>  und im struct siehst du genau das: Platzhalter fuier den mode (16 but)
21:39 <b>Isotopp</b>>  eine uid, die groesse der datei in byte, die atime, ctime, mtime und dtime (nur gesetzt, wenn die datei deleted wird)
21:39 <b>Isotopp</b>>  die gruppennummer, der linkcounter
21:39 <b>Isotopp</b>>  die anzahl der bloecke
21:39 <b>Isotopp</b>>  und das flags feld.
21:40 <b>Isotopp</b>>  und das wichtigste in struct: \_\_le32 i\_block[EXT2\_N\_BLOCKS];
21:40 <b>Isotopp</b>>  die blockadressen der datenbloecke.
21:40 <b>Isotopp</b>>  in der inode steht also alles ueber die datei - ihre eigenschaften und die zeiger auf die eigentlichen daten, nur eine sache fehlt.
21:40 <b>Isotopp</b>>  weisst du, welche sache das ist?
21:41 <b>jannik</b>>  die daten^^
21:41 <b>Isotopp</b>>  richtig, die stehen in den datenbloecken.
21:41 <b>Isotopp</b>>  ich meinte aber was anderes, eigentlich.
21:41 <b>jannik</b>>  oder WAS es für eine datei es ist
21:41 <b>Isotopp</b>>  das steht in den oberen 4 bit von i\_mode.
21:41 <b>Isotopp</b>>  der filemode ist ja sstrwxrwxrwx - das sind nur 12 bit.
21:41 <b>jannik</b>>  steht da ob mp3 oder .wav?
21:41 <b>jannik</b>>  das meinte ich
21:41 <b>Isotopp</b>>  das ist ja eine extension, also teil des dateinamens.
21:42 <b>Isotopp</b>>  aber jetzt bist du auf einer spur.
21:42 <b>Isotopp</b>>  wo steht der dateiname?
21:42 <b>jannik</b>>  in der datei
21:42 <b>jannik</b>>  also in den datenblöcken
21:42 <b>Isotopp</b>>  nein, da stehen nur die daten.
21:42 <b>Isotopp</b>>  jannik, mach mal "cd $HOME; touch lall; ln lall laber"
21:42 <b>Isotopp</b>>  jannik: und dann "ls -li lall laber"
21:42 <b>Isotopp</b>>  jannik: und paste den output.
21:43 <b>jannik</b>>  ~ 21:43 # ls -li lall laber
21:43 <b>jannik</b>>  870099 -rw-r--r-- 2 root root 0 2006-05-08 21:43 laber
21:43 <b>jannik</b>>  870099 -rw-r--r-- 2 root root 0 2006-05-08 21:43 lall
21:43 <b>Isotopp</b>>  wie lang ist die datei?
21:43 <b>jannik</b>>  genau das hat uellue mir letztens erklärt
21:43 <b>jannik</b>>  mit den hardlinks
21:43 <b>Isotopp</b>>  wie lang ist die datei?
21:43 <b>jannik</b>>  870099<?
21:44 <b>Isotopp</b>>  nein, das ist die inode nummer.
21:44 <b>jannik</b>>  aso
21:44 <b>jannik</b>>  ähm...
21:44 <b>Isotopp</b>>  0
21:44 <b>jannik</b>>  ja
21:44 <b>Isotopp</b>>  in der datei steht der name nicht.
21:44 <b>Isotopp</b>>  denn die datei ist ja 0 byte lang.
21:44 <b>Isotopp</b>>  sie HAT gar keine datenbloecke.
21:44 <b>jannik</b>>  suchte grad nach ner zahl \*g\* ach so ja genau touch erstellt nur ne inode?
21:44 <b>Isotopp</b>>  ja
21:44 <b>jannik</b>>  und jetzt hat man 2 inodes
21:44 <b>Isotopp</b>>  in der inode kann der name auch nicht stehen. denn beide dateien haben ja dieselbe inode nummer, aber verschiedene namen
21:44 <b>jannik</b>>  die auf das gleiche verweisen würden?
21:45 <b>Isotopp</b>>  hast du 2 inodes? nein. die zahlen sind gleich am anfang
21:45 <b>jannik</b>>  ach ja
21:45 <b>Isotopp</b>>  wir lernen: der name einer datei steht NICHT in den daten (0 bytes, keine datenbloecke)
21:45 <b>Isotopp</b>>  und auch nicht in der inode (2 namen, eine inode, wie wir beweisen koennen)
21:45 <b>Isotopp</b>>  was bleibt?
21:45 <b>schickard</b>>  ree
21:46 <b>Isotopp</b>>  jannik: der name einer datei steht in einem verzeichnis.
21:46 <b>Isotopp</b>>  jannik: verzeichnisse sind auch dateien und in denen speichert linux paare von (name, inodenummer) ab.
21:47 <b>jannik</b>>  ja :D
21:47 <b>Isotopp</b>>  jannik: http://lxr.linux.no/source/include/linux/ext2\_fs.h#L501
21:47 <b>Isotopp</b>>  ja
21:47 <b>Isotopp</b>>  da
21:48 <b>Isotopp</b>>  ein ext2\_dir\_entry ist eine inode nummer (32 bit) und dann ein record von rec\_len bytes laenge, in dem name\_len viele bytes verwendet werden.
21:49 <b>Isotopp</b>>  und dann natuerlich der name, name\_len bytes lang in ASCII
21:49 <b>Isotopp</b>>  mit touch lall; ln lall laber
21:49 <b>Isotopp</b>>  machst du also einen eintrag (870099, lall) und einen eintrag (870099, laber) in "."
21:49 <b>Isotopp</b>>  (dem aktuellen verzeichnis)
21:49 <b>jannik</b>>  ja
21:50 <b>Isotopp</b>>  hey, welche inode hat /boot? "ls -dlsi /boot" sagt es dir?
21:51 <b>jannik</b>>  ~ 21:43 # ls -dlsi /boot
21:51 <b>jannik</b>>  2 2 drwxr-xr-x 4 root root 2048 2006-05-02 00:37 /boot
21:51 <b>jannik</b>>  ~ 21:51 #
21:51 <b>Isotopp</b>>  und welche inode hat "/"?
21:51 <b>jannik</b>>  ~ 21:51 # ls -dlsi /
21:51 <b>jannik</b>>  2 4 drwxr-xr-x 22 root root 4096 2006-04-26 23:31 /
21:51 <b>Isotopp</b>>  die erste zahl ist die inode nummer, die 2. zahl ist die laenge in bloecken
21:52 <b>jannik</b>>  ah
21:52 <b>Isotopp</b>>  beide dateien / und /boot haben als die inode 2.
21:52 <b>Isotopp</b>>  wie kann das sein?
21:52 <b>jannik</b>>  ähm..
21:52 <b>jannik</b>>  beide sind in / eingehängt?
21:52 <b>Isotopp</b>>  naja, / ist nirgendwo eingehaengt, / ist /.
21:52 <b>jannik</b>>  ja ok
21:52 <b>jannik</b>>  deshalb?
21:53 <b>jannik</b>>  was hätte dann die erste inode?
21:53 <b>Isotopp</b>>  du bist auf der richtigen spur.
21:53 <b>Isotopp</b>>  die root-inode in ext2 hat immer die nummer 2.
21:53 <b>Isotopp</b>>  und da / und /boot jeweils verschiedene dateisysteme sind,
21:53 <b>Isotopp</b>>  haben beide root-inodes,
21:53 <b>jannik</b>>  ach ja
21:53 <b>Isotopp</b>>  also haben beide die inode 2.
21:54 <b>Isotopp</b>>  wie kann linux die beiden auseinander halten?
21:54 <b>Isotopp</b>>  nun eines ist auf /dev/hdb4, das andere auf /dev/hdbsonstwas.
21:54 <b>jannik</b>>  durch die verzeichnisstruktur?
21:54 <b>Isotopp</b>>  und wenn du "ls -l /dev/hdb\*" machst
21:54 <b>Isotopp</b>>  siehst du, dass jedes device da intern andere geraetenummern hat
21:54 <b>Isotopp</b>>  die inode-nummer in unix ist also nicht eindeutig, aber auf jedem system ist die kombination (major number, minor number, inode number) zu jedem zeitpunkt eindeutig.
21:55 <b>Isotopp</b>>  (maj, min) bezeichnen die partition, und in einer partition ist (ino) eindeutig
21:56 <b>Isotopp</b>>  jannik: schau mal hier -> http://lxr.linux.no/source/include/linux/ext2\_fs.h#L56
21:56 <b>Isotopp</b>>  das mit der inode 2 denke ich mir ja nicht aus, 
21:56 <b>Isotopp</b>>  das muss ja irgendwo im source stehen
21:56 <b>Isotopp</b>>  und da steht es.
21:56 <b>jannik</b>>  cool
21:56 <b>jannik</b>>  59 #define EXT2\_BAD\_INO             1      /\* Bad blocks inode \*/
21:57 <b>jannik</b>>  was soll das dann heißen?
21:57 <b>jannik</b>>  das wird einfach ausgelassen?
21:57 <b>Isotopp</b>>  inode 1 ist eine datei, die in der regel keinen namen hat und die nur aus kaputten bloecken besteht
21:57 <b>Isotopp</b>>  wenn du eine alte platte hast noch ohne bad blocks management,
21:57 <b>Isotopp</b>>  dann kannst du ein dateisystem mit "mke2fs -c /dev/..." anlegen
21:57 <b>Isotopp</b>>  das dauert sehr lange,
21:57 <b>Isotopp</b>>  denn dabei wird jeder block gelesen.
21:58 <b>Isotopp</b>>  zwangslaeufig sind auf jeder hdd immer einige bloecke im eimer,
21:58 <b>Isotopp</b>>  und -c findet die.
21:58 <b>Isotopp</b>>  und fuegt sie dann in die datei inode 1 ein.
21:58 <b>Isotopp</b>>  dadurch sind sie belegt und koennen nicht bestandteil einer anderen datei werden.
21:58 <b>jannik</b>>  aso
21:58 <b>Isotopp</b>>  bei disketten mit ext2 hat man das sehr, sehr oft gebraucht
21:58 <b>jannik</b>>  ähm
21:58 <b>Isotopp</b>>  (ich nehme an, du hast noch mit disketten gearbeitet, irgendwann mal)
21:59 <b>jannik</b>>  mach ich immer noch
21:59 <b>Isotopp</b>>  ah
21:59 <b>jannik</b>>  aber noch nich mit linux
21:59 <b>jannik</b>>  habs noch nicht gebraucht
21:59 <b>jannik</b>>  doch hab mal meinen grub auf einer diskette gehabt
21:59 <b>jannik</b>>  in einem externen diskettenlaufwerk :D
21:59 <b>jannik</b>>  mit usb
21:59 <b>jannik</b>>  hat er geschluckt
21:59 <b>jannik</b>>  fand ich cool
21:59 <b>Isotopp</b>>  die erste datei, die auf einem ext2 angelegt wird, noch beim erstellen, ist lost+found
22:00 <b>Isotopp</b>>  die hat dann immer inode 11, denn EXT2\_GOOD\_OLD\_FIRST\_INO ist 11.
22:00 <b>Isotopp</b>>  wenn du alos mal ein "ls -li / /boot" machst, wirst du sehen, dass
22:00 <b>Isotopp</b>>  a) lost+found 11 ist
22:00 <b>Isotopp</b>>  b) alle inode nummern ausser "." und ".." groesser als 11 sind
22:01 <b>Isotopp</b>>  (vorausgesetzt, alle betrachteten dateisysteme sind ext2/ext3)
22:01 <b>Isotopp</b>>  (bei reiser ist alles anders)
22:02 <b>jannik</b>>        2 drwxr-xr-x   4 root root  2048 2006-05-02 00:37 boot
22:02 <b>jannik</b>>  hehe
22:02 <b>jannik</b>>  hat wieder kleinere inode ;P
22:02 <b>jannik</b>>  in /
22:02 <b>Isotopp</b>>  wie meinen?
22:03 <b>jannik</b>>  als 11
22:03 <b>Isotopp</b>>  df -Th / -- was fuer ein dateisystemtyp?
22:03 <b>Isotopp</b>>  achso!
22:03 <b>Isotopp</b>>  22:03 =jannik>       2 drwxr-xr-x   4 root root  2048 2006-05-02 00:37 boot
22:03 <b>Isotopp</b>>  wieso?
22:03 <b>jannik</b>>  ~ 22:01 # df -Th /
22:03 <b>jannik</b>>  Dateisystem   Typ    Größe Benut  Verf Ben% Eingehängt auf
22:03 <b>jannik</b>>  /dev/mapper/system-system
22:03 <b>jannik</b>>                ext3     30G   18G   11G  64% /
22:03 <b>jannik</b>>  is mir nur wieder aufgefallne
22:03 <b>Isotopp</b>>  wieso ist das so?
22:03 <b>Isotopp</b>>  22:03 =jannik>       2 drwxr-xr-x   4 root root  2048 2006-05-02 00:37 boot
22:04 <b>jannik</b>>  ja weil das wieder ein eigenes dateisystem ist ;)
22:04 <b>Isotopp</b>>  genau!
22:04 <b>Isotopp</b>>  wir wissen nun:
22:04 <b>Isotopp</b>>  a) verzeichnisse sind dateien.
22:04 <b>jannik</b>>  auch wenn ich da jetzt noch nicht sehe, wie er das unterscheidet von / ...
22:04 <b>Isotopp</b>>  b) verzeichnisse sind listen von namen und inode nummern
22:04 <b>Isotopp</b>>  c) die /-inode jedes ext2-dateisystems ist 2
22:05 <b>jannik</b>>  du krempelst grad mein weltbild um ;)
22:05 <b>Isotopp</b>>  d) es kann mehr als eine inode 2 pro system geben, und an der (maj, min) des devices auf dem sie liegt koennen wir sie unterscheiden
22:05 <b>Isotopp</b>>  e) in der inode stehen alle informationen ueber eine datei, insbesondere der mode, die times, und die datenblockzeiger
22:05 <b>jannik</b>>  (maj, min) des devices auf dem sie liegt koennen wir sie unterscheiden<<wie kann ich das rausfinden?
22:05 <b>Isotopp</b>>  f) in der inode steht NICHT der name der datei, der steht im verzeichnis
22:05 <b>Isotopp</b>>  g) in den datenbloecken stehen nur die daten
22:05 <b>Isotopp</b>>  jannik: mit "mount"
22:06 <b>jannik</b>>  ach ja klar
22:06 <b>Isotopp</b>>  oder genauer, mit "cat /proc/mounts", denn da holt "mount" das her
22:06 <b>Isotopp</b>>  und diese liste ordnet devices und namens-stummel einander zu
22:06 <b>Isotopp</b>>  linux weiss dann: wegen
22:06 <b>Isotopp</b>>   /dev/sda5 /boot ext2 rw 0 0
22:07 + possum\_ [xerxes@cl-1629.ham-01.de.sixxs.net] joined #lug-kiel
22:07 <b>Isotopp</b>>  muss ich ab "/boot" neu zu zaehlen anfangen und zwar
22:07 <b>Isotopp</b>>  linux:/proc # ls -l /dev/sda5
22:07 <b>Isotopp</b>>  brw-r-----  1 root disk 8, 5 May  6 22:44 /dev/sda5
22:07 <b>Isotopp</b>>  auf (8, 5) statt auf (8, 1)
22:07 <b>Isotopp</b>>  bzw in meinem fall statt auf (8, 5) auf
22:07 <b>Isotopp</b>>  linux:/proc # ls -lL /dev/system/root
22:07 <b>Isotopp</b>>  brw-r-----  1 root disk 253, 1 May  6 22:44 /dev/system/root
22:07 <b>Isotopp</b>>  (253, 1)
22:07 <b>jannik</b>>  ~ 22:06 # aso
22:07 <b>jannik</b>>  bash: aso: command not found
22:07 <b>jannik</b>>  ~ 22:07 #
22:07 <b>jannik</b>>  \*g\*
22:07 <b>jannik</b>>  aso
22:08 \* tholle sagt n8
22:08 <b>Isotopp</b>>  wir wollten ueber dateisysteme und layoutstrategien reden.
22:08 <b>schickard</b>>  tholle: alles gute fuer morgen!!!!
22:08 <b>Isotopp</b>>  wir wollten ja, dass die platte moeglichst wenig seeken muss.
22:08 <b>jannik</b>>  ja
22:08 <b>Isotopp</b>>  und wir hatten gelernt: es ist gut, fragmentierung zu vermeiden und "dicht" zu packen, aber nicht zu dicht, 
22:08 <b>@tholle</b>>  schickard: vielen dank! wird schon schief gehen.. evtl. kommt voip dran..
22:08 <b>Isotopp</b>>  sonst nehmen wir platz fuer die folgenden dateien weg
22:09 <b>jannik</b>>  ja
22:09 <b>Isotopp</b>>  daher machen wir nach GROSSEN fragmenten von ca. 1 mb oder so eine absichtliche fragmentierung um platz fuer neue dateien zu lassen
22:09 <b>Isotopp</b>>  platten koennen seeks machen, ab und zu. kleine fragmente sind es, die uns langsam machen.
22:09 <b>jannik</b>>  ja
22:10 <b>Isotopp</b>>  wenn ich nun ein verzeichnis anlege in ext2, und darin dateien anlege, dann wird ext2 die dateien alle in dieselbe bg tun wie das verzeichnis.
22:10 <b>Isotopp</b>>  ich kann das an den inode-nummern sehen.
22:10 <b>Isotopp</b>>  die inode-nummern aller dateien (nicht-verzeichnisse) in / sollten in etwa gleich gross sein.
22:10 <b>jannik</b>>  ja
22:10 <b>Isotopp</b>>  aber wenn ext2 ein verzeichnis anlegt, dann tut es das neue verzeichnis in einer ANDERE bg als das elternverzeichnis.
22:11 <b>Isotopp</b>>  die inode-nummern aller verzeichnisse in / sollten sich von der inode-nummer von / sehr unterscheiden.
22:11 <b>Isotopp</b>>  linux:/boot # ls -li
22:11 <b>Isotopp</b>>      2 drwxr-xr-x   5 root root    2048 Mar 26 11:00 .
22:11 <b>Isotopp</b>>     28 -rw-r--r--   1 root root 1541719 Sep 13  2005 vmlinuz-2.6.13-15-default
22:11 <b>Isotopp</b>>     40 -rw-r--r--   1 root root  133120 Nov  2  2005 message
22:11 <b>Isotopp</b>>  aber
22:11 <b>Isotopp</b>>   6025 drwxr-xr-x   2 root root    1024 Feb 11 21:20 grub
22:11 <b>Isotopp</b>>  10041 drwxr-xr-x   2 root root    1024 Dec 13 09:48 mysql
22:12 <b>Isotopp</b>>  udn in grub dann:
22:12 <b>Isotopp</b>>  linux:/boot/grub # ls -li
22:12 <b>Isotopp</b>>  total 285
22:12 <b>Isotopp</b>>  6025 drwxr-xr-x  2 root root   1024 Feb 11 21:20 .
22:12 <b>Isotopp</b>>  6040 -rw-r--r--  1 root root     10 May  2 14:01 default
22:12 <b>Isotopp</b>>  6039 -rw-------  1 root root     15 Nov  2  2005 device.map
22:12 <b>Isotopp</b>>  6026 -rw-r--r--  1 root root   7540 Dec 17 06:52 e2fs\_stage1\_5
22:12 <b>Isotopp</b>>  da liegt dann alles beieinander, ander in einer anderen bg als /
22:13 <b>Isotopp</b>>  ext2/ext3 sortiert also dateien IN einem verzeichnis DICHT beieinander,
22:13 <b>Isotopp</b>>  und verzeichnisse WEIT auseinander.
22:13 <b>Isotopp</b>>  dadurch wird die ganze platte gleichmaessig genutzt,
22:13 <b>Isotopp</b>>  aber auch das ist eine art absichtlicher fragmentierung
22:13 <b>jannik</b>>  ja
22:13 <b>Isotopp</b>>  es werden kuenstlich kontrolliert seeks eingefuegt
22:13 <b>Isotopp</b>>  um die struktur des systems zu erhalten
22:14 <b>Isotopp</b>>  und unkontrolliert entstehende kleine fragmente zu vermeiden
22:14 <b>jannik</b>>  gut
22:14 <b>Isotopp</b>>  die abstrakte logik: irgendwann muessen wir sowieso fragmentieren. das ist auch nicht schlimm, solange die stuecke einigermassen gross sind. also fragmentiert ext2/ext3 und auch bsd ufs absichtlich und macht grosse stuecke, die nicht schaden.
22:15 <b>jannik</b>>  hmm... ich lerne daraus, dass ich meine platten nie überfülle (dateisysteme)
22:15 <b>Isotopp</b>>  dadurch entsteht eine locker gepackte struktur, die die ganze platte ausnutzt, statt sich auf einer ecke der platte zu ballen und sich selbst im weg zu stehen
22:15 <b>Isotopp</b>>  genau
22:15 <b>Isotopp</b>>  und jetzt: wir erinnern uns was schlimm ist - seeks.
22:15 <b>Isotopp</b>>  nimm an, du hast ein gut organisiertes ext2 oder auch vfat system, frisch defragmentiert
22:16 <b>Isotopp</b>>  du loggst dich da ein und laedst dein kde,
22:16 <b>Isotopp</b>>  und uellue loggt sich ebenfalls da ein und startet sein gnome,
22:16 <b>Isotopp</b>>  und ich logge mich da ein und starte mein mysql.
22:16 <b>Isotopp</b>>  gleichzeitig.
22:16 <b>Isotopp</b>>  was wird passieren?
22:16 <b>jannik</b>>  die festplatte wird springen müssen (Der Kopf)
22:16 <b>Isotopp</b>>  erklaere.
22:17 <b>jannik</b>>  wenn sie alles gleichzeitig machen soll
22:17 <b>Isotopp</b>>  exakt.
22:17 <b>Isotopp</b>>  was nutzt uns unsere defragmentierung nun?
22:17 <b>jannik</b>>  nix
22:17 <b>jannik</b>>  in dem fall
22:17 <b>jannik</b>>  ändert das nix
22:17 <b>Isotopp</b>>  unfragmentierte dateien sind dateien, die auf der platte mit aufeinanderfolgenden blocknummern stehen
22:18 <b>Isotopp</b>>  aber das nutzt nix, wenn die lesezugriffe nicht linear erfolgen
22:18 <b>Isotopp</b>>  fragmentierung oder defragmentierung beschaeftigen sich mit einem STATISCHEN layout von daten auf einer platte
22:18 <b>Isotopp</b>>  aber entscheidend in einem system ist die DYNAMISCHE sequenz von lesezugriffen ueber die zeit
22:18 <b>Isotopp</b>>  in einem single-user-single-process-system wie ms-dos 
22:19 <b>Isotopp</b>>  gibt es nur einen user und nur ein programm zur zeit.
22:19 <b>jannik</b>>  willst du darauf hinaus, dass defragmentierung auf ext2 z.b. nich nötig is?
22:19 <b>Isotopp</b>>  das liest dann seine daten durch,
22:19 <b>Isotopp</b>>  daher die DYNAMISCHE lesefolge entspricht immer der STATISCHEN anordnung von daten auf der platte,
22:19 <b>Isotopp</b>>  da die zugriffe niemals unterbrochen werden koennen.
22:19 <b>Isotopp</b>>  in ms-dos bringt es also was, zu defragmentieren.
22:19 <b>Isotopp</b>>  ms-dos hat auch keinen file-system cache, d.h. jeder read() endet unweigerlich IMMER auf der platte
22:20 <b>Isotopp</b>>  in linux ist die situation weitaus komplizierter:
22:20 <b>Isotopp</b>>  wir haben mehrere user, jeder hat mehrere programme, die lesen koennen und wir haben einen haufen ram, den wir als cache verwenden,
22:20 <b>jannik</b>>  (um 10 vor 11 wird meine inet connection gekappt)
22:20 <b>Isotopp</b>>  sodass viele reads gar nicht mehr auf die platte gehen.
22:21 <b>Isotopp</b>>  fuer seeks, die sind ja das, was langsam ist, ist aber die DYNAMISCHE folge von seeks, die die platte wirklich sieht, relevant.
22:21 <b>Isotopp</b>>  und die entspricht bei linux nun genau nicht mehr dem statischen bild auf der platte.
22:21 + bani\_ [-bani@pD9E9F48C.dip.t-dialin.net] joined #lug-kiel
22:21 <b>Isotopp</b>>  wenn die daten auf der platte defragmentiert sind, und wenn die lesezugriffe eines programmes nicht durch andere reader unterbrochen werden und wenn der cache leer ist, DANN ist defragmentierung relevant, auch bei linux.
22:21 <b>Isotopp</b>>  also
22:21 <b>Isotopp</b>>  a) beim booten
22:22 <b>Isotopp</b>>  b) beim login nach dem booten
22:22 <b>Isotopp</b>>  das kann sehr viel schneller sein auf einem ordentlich defraggten system, denn da ist der cache leer und programme greifen nacheinander zu
22:22 <b>Isotopp</b>>  danach - naja, ich habe 
22:22 <b>Isotopp</b>>  linux:/boot/grub # free -m
22:22 <b>Isotopp</b>>               total       used       free     shared    buffers     cached
22:22 <b>Isotopp</b>>  Mem:          1011        909        101          0         82        280
22:22 <b>Isotopp</b>>  -/+ buffers/cache:        547        464
22:22 <b>Isotopp</b>>  Swap:         2055          3       2051
22:22 <b>Isotopp</b>>  ein gig ram, und davon sind 547 MB durch programme belegt und 82+280 MB in filesystem caches 
22:23 <b>Isotopp</b>>  die meisten meiner reads gehen der platte am arsch vorbei, denn sie kommen aus dem cache
22:23 <b>jannik</b>>  ~ 22:07 # free -m
22:23 <b>jannik</b>>               total       used       free     shared    buffers     cached
22:23 <b>jannik</b>>  Mem:          1517       1484         33          0         40       1052
22:23 <b>jannik</b>>  -/+ buffers/cache:        391       1126
22:23 <b>jannik</b>>  Swap:         1011        313        698
22:23 <b>jannik</b>>  ~ 22:23 #
22:23 <b>jannik</b>>  lol
22:23 <b>Isotopp</b>>  du hast 1.1 gig im cache
22:23 <b>jannik</b>>  1gbite cached?? wow
22:24 <b>Isotopp</b>>  das ist solid.
22:24 <b>Isotopp</b>>  wie auch immer: fragmentierung von linux-dateisystemen spielt eine eher untergeordnete rolle.
22:24 <b>Isotopp</b>>  ext2 und ext3 fragmentieren ABSICHTLICH und auf eine kontrollierte weise, damit grosse, schlau angeordnete fragmente entstehen
22:24 <b>Isotopp</b>>  und auch ohne fragmente koennen seeks auf der platte durch konkurrente zugriffe entstehen.
22:25 <b>Isotopp</b>>  wichtiger als zu defragmentieren ist es, einen grossen filesystem cache zu haben
22:25 <b>Isotopp</b>>  soweit klar?
22:25 <b>jannik</b>>  ja
22:26 <b>Isotopp</b>>  1.1% fragmentation bei einem fsck sind also eine gute sache
22:26 <b>Isotopp</b>>  0.0% waeren doof.
22:26 <b>jannik</b>>  ok
22:26 <b>Isotopp</b>>  das heisst ja, dass wir einen nicht aufgelockerten klumpatsch von dateien haben (oder nur sehr viele, sehr kleine dateien)
22:26 <b>Isotopp</b>>  20% fragmentierung sind auch doof.
22:27 <b>Isotopp</b>>  das kann zum beispiel passieren, wenn wir sehr viele, sehr kleine dateien haben und dauernd dateien loeschen und anlegen.
22:27 <b>Isotopp</b>>  etwa in einem squid cache oder in einem news tradspool
22:27 <b>Isotopp</b>>  entscheidend ist aber - und die information gibt uns fsck leider nicht - dass die stuecke alle so mittel gross sind,
22:27 <b>Isotopp</b>>  etwa 1/100 bis 1/10 einer blockgroup gross.
22:28 <b>Isotopp</b>>  kleiner ist von uebel, weil kleine stuecke viele seeks bedeuten,
22:28 <b>Isotopp</b>>  und groesser ist von uebel, weil grosse stuecke die bgs zustopfen
22:28 <b>jannik</b>>  ja
22:29 <b>Isotopp</b>>  klasse. wenn du also demnaechst nach einer informatik hausarbeit gefragt wirst, hast du schon ein thema.
22:29 <b>jannik</b>>  hehe gut :D
22:29 <b>jannik</b>>  thx
22:29 <b>Isotopp</b>>  hier -> http://kris.koehntopp.de/artikel/diplom/
22:29 <b>jannik</b>>  "das wars"?
22:30 <b>Isotopp</b>>  da kannst du nun das postscript runterladen und selber weiter lesen
22:30 <b>jannik</b>>  hehe
22:30 <b>jannik</b>>  ja
22:30 <b>Isotopp</b>>  (http://kris.koehntopp.de/artikel/diplom/diplom.ps.gz)
22:30 <b>jannik</b>>  :)
22:31 <b>Isotopp</b>>  und jetzt hast du auch alles handwerkszeug um das zu verstehen
22:31 <b>jannik</b>>  ich schätze ich will heute nicht mehr wissen, was reiser fs so toll macht?
22:31 <b>Isotopp</b>>  heute nacht nicht, das schaffen wir nicht in 20 minuten
22:31 <b>Isotopp</b>>  aber wenn du willst kannst du dir als hausaufgabe mal
22:31 <b>Isotopp</b>>  ein ext2 directory aufmalen,
22:31 <b>Isotopp</b>>  mit (inode, nam\_len, rec\_len, dateiname)
22:31 <b>Isotopp</b>>  und dann ueberlegen, wie du die datei mit dem namen "toller name eigentlich" in einem  verzeichnis mit 1 mio eintraegen findest, loescht und
22:32 <b>Isotopp</b>>  dann die datei mit dem namen "blurb" da drin anlegst
22:32 <b>Isotopp</b>>  und wieso das so lange dauert mit 1 mio eintraegen.
22:32 <b>Isotopp</b>>  dann koennen wir bald mal ueber reiser reden und wieso das da nicht so lange dauert
22:32 <b>jannik</b>>  ok
22:32 <b>jannik</b>>  :D
22:32 <b>jannik</b>>  erstmal die HA verstehen \*g\*
22:33 <b>Isotopp</b>>  die ist nicht schwer. in der diplomarbeit sind in der postscript-version bilder dazu drin
22:33 <b>jannik</b>>  ok
22:34 <b>Isotopp</b>>  gute nacht allerseits
22:34 <b>jannik</b>>  Isotopp: das dauert so lange weil man erst alles abklappern muss, bis man auf den namen trifft
22:34 <b>jannik</b>>  muss ja alles überprüfen
22:34 <b>jannik</b>>  is jede menge arbeit 
22:34 <b>jannik</b>>  gut nacht Isotopp, und danke :D
22:34 <b>Isotopp</b>>  wir schreiben montag, den 8. mai 2006, sie hoerten den "dienstag" zum thema "dateisysteme und fragmentierung"
22:34 <b>Isotopp</b>>  jannik: genau
22:34 <b>jannik</b>>  hehe
22:35 <b>Isotopp</b>>  jannik: das ist effektiv eine "lineare liste"
22:35 <b>jannik</b>>  ja
22:35 <b>Isotopp</b>>  jannik: und skaliert sich halt mit der anzahl der eintraege im verzeichnis.
22:35 <b>jannik</b>>  immerhin ist die nicht defragmentiert \*g\*
22:35 <b>Isotopp</b>>  oh, die kann fragmentieren.
22:35 <b>jannik</b>>  dann is aber böse...?
22:35 <b>Isotopp</b>>  jannik: wenn ich "langer name eigentlich" loesche
22:35 <b>Isotopp</b>>  und dann "kurz" erzeuge, bleibt ein stueck frei
22:35 <b>jannik</b>>  hmm...
22:35 <b>Isotopp</b>>  das ist entweder verloren oder muss gelegentlich wieder belegt werden.
22:36 <b>jannik</b>>  wer sorgt für die ordnung dafür? wie räumt man denn schön auf auf seinem dateisystem?
22:36 <b>Isotopp</b>>  :)
22:36 <b>Isotopp</b>>  und das alles werden wir ein andermal besprechen. oder du liest einfach in dem postscript
22:36 <b>jannik</b>>  ok :D
22:36 <b>jannik</b>>  dann gut nacht
22:36 <b>Isotopp</b>>  n8
