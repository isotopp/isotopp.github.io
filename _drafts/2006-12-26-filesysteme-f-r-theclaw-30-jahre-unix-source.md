---
layout: post
published: true
title: Filesysteme für theclaw (30 Jahre Unix Source)
author-id: isotopp
date: 2006-12-26 19:09:59 UTC
tags:
- dateisysteme
- dienstag
- free software
- irc
- linux
- lang_de
feature-img: assets/img/background/rijksmuseum.jpg
---
--- Log opened Di Dez 26 15:52:09 2006
theclaw> Hey :] <a href="http://blog.koehntopp.de/archives/1265-Fragmentierung-fuer-Jannik.html">Spitze erklaerung zu ext2.</a>

Isotopp> Danke

theclaw> Bist du Kerneldeveloper?

Isotopp> Nein. <a href="http://kris.koehntopp.de/resume/">Mysql Consultant</a>.

theclaw> Hmm. Hab da was nicht verstanden bei der Erklärung. Und zwar: Was sind Datenblockzeiger?


Isotopp> Die Blockadressen von Datenbloecken einer Datei.

theclaw> Ich paste mal was

theclaw> (0-11):9711-9722, (IND):9723, (12-267):9724-9979, (DIND):9980, (IND):9981, (268-523):9982-10237, (IND):10238, (524-779):10239-10494, (IND):10495, (780-1035):10496-10751, (IND):10752, (1036-1291):10753-11008, (IND):11009, (1292-1547):11010-11265, (IND):11266, (1548-1795):11267-11514

Isotopp> Habs im <a href="http://blog.koehntopp.de/archives/1265-Fragmentierung-fuer-Jannik.html">Originalartikel</a>.

theclaw> __le32 i_block[EXT2_N_BLOCKS]; &lt; das ist das was unter BLOCKS bei debugfs steht?

Isotopp> <a href="http://lxr.linux.no/source/include/linux/ext2_fs.h#L211">http://lxr.linux.no/source/include/linux/ext2_fs.h#L211</a>: Das ist was auf der Platte steht.

theclaw> Okay mal durchdenken.

Isotopp> Die Definition steht in <a href="http://lxr.linux.no/source/include/linux/ext2_fs.h#L165">http://lxr.linux.no/source/include/linux/ext2_fs.h#L165</a>. Es kommen also EXT2_NDIR_BLOCKS direkt, also in der Inode selbst.  Das sind (0-11):9711-9722.  Dann kommt ein EXT2_IND_BLOCK, (IND):9723. Der steht auch in der Inode, aber der zeigt nicht auf Daten, sondern auf einen Indirect Block. der enthaelt die Blocknummern der Datenbloecke, (12-267):9724-9979. Dann kommt EXT2_DIND_BLOCK. der wiederum enthaelt keine Blocknummern von Datenbloecken, sondern die Blocknummern von Indirect Blocks, die wiederum Blocknummern von Datenbloecken enthalten. Daher <a href="http://kris.koehntopp.de/artikel/dateisysteme/filestructure.gif">http://kris.koehntopp.de/artikel/dateisysteme/filestructure.gif</a>.

theclaw> *anseh*

Isotopp> In der inode steht nur (DIND):9980. In DIND steht dann (IND):9981 und (IND):10238 und so weiter. Und in (IND):9981 stehen dann 9982-10237, in (IND):10238 dann 10239-10494.

theclaw> DIR steht fuer "direct"?

Isotopp> ja

theclaw> Muss das jetzt mal kurz mit debugfs ausprobieren.

Isotopp> Sieh mal <a href="http://lxr.linux.no/source/fs/ext2/inode.c#L665">http://lxr.linux.no/source/fs/ext2/inode.c#L665</a>. Das (ext2_bmap) geht ueber generic_block_bmap nach <a href="http://lxr.linux.no/source/fs/ext2/inode.c#L547">http://lxr.linux.no/source/fs/ext2/inode.c#L547</a>. Und das wiederum benutzt <a href="http://lxr.linux.no/source/fs/ext2/inode.c#L196">http://lxr.linux.no/source/fs/ext2/inode.c#L196</a>. Und da siehst du den lookup.

theclaw> okay langsam kommts

Isotopp> Wenn i_block &lt; 0 -> error. Wenn i_block &lt; direct_blocks, dann direkt. Sonst IND, sonst DIND, sonst TIND. Sonst bumm.

theclaw> Wart mal, nicht so schnell. Ich kann das nicht alles gleichzeitig aufnehmen. Also, die ersten zwoelf Bloecke sind -direkt- in der Inode?

Isotopp> Ja. Blocknummern. Nicht Bloecke.

theclaw> i_block ist schon ein element aus i_block[] oder? ;)

Isotopp> Wo bist du gerade? Also in welcher zeile?

theclaw> static int ext2_block_to_path. Bei der definition da.

Isotopp> Kannst du eine lxr url geben bitte? Sonst wird das schwer hier. Ah, hier : <a href="http://lxr.linux.no/source/fs/ext2/inode.c#L196">http://lxr.linux.no/source/fs/ext2/inode.c#L196</a>.

theclaw> ja

Isotopp> i_block ist der 2. parameter der funktion, der aufruf steht in <a href="http://lxr.linux.no/source/fs/ext2/inode.c#L547">http://lxr.linux.no/source/fs/ext2/inode.c#L547</a>. Da ist es iblock, das wird durchgereicht vom 2. parameter von ext2_get_block iblock. Das wiederum ist <a href="http://lxr.linux.no/source/fs/ext2/inode.c#L665">http://lxr.linux.no/source/fs/ext2/inode.c#L665</a>, der das ueber den umweg von <a href="http://lxr.linux.no/source/fs/buffer.c#L2759">http://lxr.linux.no/source/fs/buffer.c#L2759</a> aufruft.

theclaw> Nicht gerade trivial.

Isotopp> Fuer den kernel schon. Das geht da ueberall so, inzwischen. Man gewoehnt sich dran, das lesen zu koennen. Die alternative ist Code Duplication, und das nervt noch mehr. Anyway, sector_t ist ein unsigned 64 bit (long long, 8 byte) in i386. Eine Blocknummer.

Isotopp> In <a href="http://lxr.linux.no/source/fs/ext2/inode.c#L556">http://lxr.linux.no/source/fs/ext2/inode.c#L556</a>, das ist die wichtige Stelle, hast du die inode und den iblock. Die inode hat das 12-Elemente direct block array usw im Speicher und iblock ist der Offset. Die Frage, die in <a href="http://lxr.linux.no/source/fs/ext2/inode.c#L556">http://lxr.linux.no/source/fs/ext2/inode.c#L556</a> geklaert werden muss ist: wie tief muessen wir runter steigen - fuer die Bloecke 0-11 gar nicht, fuer die Bloecke 12- einen Level und so weiter. Das klaert ext2_block_to_path. Den Abstieg sehen wir dann in <a href="http://lxr.linux.no/source/fs/ext2/inode.c#L562">http://lxr.linux.no/source/fs/ext2/inode.c#L562</a>. Und der Abstieg klappt entweder, weil das File schon einen Block hat an der Stelle iblock (<a href="http://lxr.linux.no/source/fs/ext2/inode.c#L564">http://lxr.linux.no/source/fs/ext2/inode.c#L564</a>),  oder es klappt nicht und wir muessen Bloecke beschaffen (nach <a href="http://lxr.linux.no/source/fs/ext2/inode.c#L575">http://lxr.linux.no/source/fs/ext2/inode.c#L575</a>).

theclaw> Sekunde. Bin kein Kernelmensch ;)

Isotopp> Aber das ist doch nur gewoehnliches C.

theclaw> Naja, trotzdem komplex (fuer mich). Erstmal eine Frage. Man hat ein FS, e, und will die Inode nummer 23, wie wird die gefunden?

Isotopp> Ueber die Verzeichnisse. Wir wissen, / hat die inode 2. Das ist definiert in <a href="http://lxr.linux.no/source/include/linux/ext2_fs.h#L60">http://lxr.linux.no/source/include/linux/ext2_fs.h#L60</a>,  also lesen wir das file mit der inode 2 durch, und parsen es als <a href="http://lxr.linux.no/source/include/linux/ext2_fs.h#L510">http://lxr.linux.no/source/include/linux/ext2_fs.h#L510</a> Strukturen.

theclaw> Sind die indodes nicht nacheinander abgepeichert in den BGs? Also die erste BG enthaelt die ersten X indoes, die zweite BG die zweiten X usw...

Isotopp> Aeh, ah. Ich verstehe. Userland kann nichts mit Inodes machen, nur mit Filenamen. Es gibt kein openi(). Also muessen alle Funktionen im Userland immer Namen angeben, und du kommst dann vom Namen zur Inode ueber das kernel-interne namei().

theclaw> Ja, klar. Aber der Kernel will ja Inode X irgendwie kriegen koennen.

Isotopp> Ja, intern. Das weiss er, weil im Superblock ja steht wie viele Inodes pro bg vorhanden sind, und er dann aus der inode nummer / inodes_per_bg sofort die bg nummer ausrechnen kann, und dann sofort weiss, wo die inode stehen muss auf der platte. Eine Inode-Nummer ist also implizit auch die Blockadresse der inode auf der Platte. Hier ist der Superblock: <a href="http://lxr.linux.no/source/include/linux/ext2_fs.h#L341">http://lxr.linux.no/source/include/linux/ext2_fs.h#L341</a>. <a href="http://lxr.linux.no/source/include/linux/ext2_fs.h#L352">http://lxr.linux.no/source/include/linux/ext2_fs.h#L352</a> ist die s_inodes_per_group. Und die inode wird dann <a href="http://lxr.linux.no/source/fs/ext2/inode.c#L998">http://lxr.linux.no/source/fs/ext2/inode.c#L998</a> gelesen. Meine Rechnung von eben ist hier <a href="http://lxr.linux.no/source/fs/ext2/inode.c#L1012">http://lxr.linux.no/source/fs/ext2/inode.c#L1012</a>.  (ino - 1) / EXT2_INODES_PER_GROUP(sb); und ((ino - 1) % EXT2_INODES_PER_GROUP(sb)) \* EXT2_INODE_SIZE(sb);

theclaw> Nix fuer ungut aber fuer mich ist der Code grad ned so hilfreich.

Isotopp> Was ist das Problem?

theclaw> Bin grad bisschen ueberfordert.

Isotopp> Du hast eine Inode Nr 23. Du weisst, pro bg hast Du sagen wir 8192 Inodes. Und (23-1) / ext2_indes_per_group(sb) = 0.
Isotopp> Also ist inode 23 in bg 0.

theclaw> *wartmal* 8192?!

Isotopp> 8192 bei 1 kb blockgroesse, 32768 bei 4kb

theclaw> wie gross ist eine Inode nochmal?

Isotopp> 128 bytes.
Isotopp> kris@linux:~> cat probe.c
Isotopp> #include &lt;linux/ext2_fs.h>
Isotopp> #include &lt;stdio.h>
Isotopp> main() {
Isotopp>   struct ext2_inode s;
Isotopp>   printf("%d\n", sizeof(s));
Isotopp> }
Isotopp> kris@linux:~> make probe
Isotopp> make: "probe" ist bereits aktualisiert.
Isotopp> kris@linux:~> ./probe
Isotopp> 128

theclaw> Also pro BG ist allein 1MB bzw 4MB an Inodes reserviert?

Isotopp> Ja. Eine bg ist 8 MB oder 128 MB gross.  Schau, hast du ein ext2 da?

theclaw> ja

Isotopp> Dann mach mal ein "debugfs /dev/..." da drauf. Ist read only, macht also nix kaputt. Dann mach mal show_super_stats.
Isotopp> Inodes per group:         2008
Isotopp> Inode count:              26104
Isotopp> fuer ein /dev/sda5     ext2     99M  6.7M   87M   8% /boot
Isotopp> 26104\*128/1024 = 3263
Isotopp> also 3263 KB oder 3.2M fuer alle Inodes.

theclaw> Aber meine frage ist eine Andere.
theclaw> 21:40 Isotopp> und das wichtigste in struct: __le32 i_block[EXT2_N_BLOCKS];
theclaw> i_block[12] ist ein indirekter block? *aaargh* Die adresse eines indirekten Blockes?

Isotopp> Ja. <a href="http://lxr.linux.no/source/include/linux/ext2_fs.h#L165">http://lxr.linux.no/source/include/linux/ext2_fs.h#L165</a>. Dort ist 
Isotopp> #define EXT2_IND_BLOCK                  EXT2_NDIR_BLOCKS
Isotopp> und #define EXT2_NDIR_BLOCKS                12

theclaw> Also 15 EXT2_N_BLOCKS.

Isotopp> Also ist i_block[0] bis i_block[11] direct,
Isotopp> i_block[12] indirect, und i_block[13] DIND und i_block[14] TIND. Alles in allem also 15.

theclaw> Sind das die Faktoren die die max. Dateigroesse in ext2 bestimmen?

Isotopp> Das sind die Faktoren, die die maximale Blocknummer bestimmen. Dateigroesse ist Blockgroesse mal maximale Blocknummer. 

theclaw> also ja ;) Indirekt halt.

theclaw> 9711-9722: Sind das die "Adressen"?

Isotopp> Blocknummern, ja, Adressen auf der Platte. In <a href="http://lxr.linux.no/source/include/linux/ext2_fs.h#L234">http://lxr.linux.no/source/include/linux/ext2_fs.h#L234</a> siehst du als typ uebrigens __le32. Das ist definiert in <a href="http://lxr.linux.no/source/include/linux/types.h#L172">http://lxr.linux.no/source/include/linux/types.h#L172</a> und endet als __u32, also unsigned 32 bit. Mithin also 2^32 Bloecke. Bei 4 KB Bloecken sind das 17592186044416 Bytes, oder 16 TB, bei 1 KB Bloecken nur 4 TB.

theclaw> Diese Bloecke haben aber nix mit den Bloecken bei ext2 zu tun? Oder doch?

Isotopp> "show_super_stats"
Isotopp> Block size:               1024
Isotopp> In meinem Fall also auch maximale Dateigroesse 4 TB. 4 Gigablocks.

theclaw> Okay, dann noch eine Frage:
theclaw> TOTAL: 1804 und Blockcount: 3608, huh? Warum \*2?

Isotopp> Hmm, da rechnet jemand mit 512 Byte Hardwaresektoren, warum auch immer.

Isotopp> linux:~ # ls -lsi /boot/vmlinuz-2.6.13-15-default
Isotopp> 28 1513 -rw-r--r--  1 root root 1541719 Sep 13  2005 /boot/vmlinuz-2.6.13-15-default

Isotopp> Inode 28, 1513 Bloecke auf der Platte, Dateilaenge 15411719 Bytes. Rechnerisch ist  1541719/1024 = 1505.5849. 7 bloecke Verwaltungsoverhead. Und zwar

Isotopp> (0-11):11515-11526, (IND):11527, (12-267):11528-11783, (DIND):11784, (IND):11785, (268-523):11786-12041, (IND):12042, (524-779):12043-12298, (IND):12299, (780-1035):12300-12555, (IND):12556, (1036-1291):12557-12812, (IND):12813, (1292-1505):12814-13027
Isotopp> TOTAL: 1513
Isotopp> (IND):11527, (DIND):11784, (IND):11785, (IND):12299, (IND):12556, (IND):12813 &lt;- das sind 6.
Isotopp> 1541719/1024 = 1505.5849 sind 1506. Plus 6 sind 1512.
Isotopp> er meint total sei 1513. Wieso?

theclaw> Ich versteh das sowieso nicht, warum da 1513 angezeigt wird. 1292-1505 ist das letzte und dann total 1513. Evtl noch die Metainfos dazu?

Isotopp> Nein, aber die DIND und IND Blocks. Fuer die bloecke 12-267 wird ja ein IND gebraucht, fuer die bloecke 268-1505 wird ein DIND und vier IND gebraucht. 6 blocks Extra. Siehe noch einmal <a href="http://kris.koehntopp.de/artikel/dateisysteme/filestructure.gif">http://kris.koehntopp.de/artikel/dateisysteme/filestructure.gif</a>.  Das rechts sind die Daten. In der Inode stehen die ersten paar Datenblocknummern direkt, in der zeichnung 10, in ext2 sind es 12.  Dann steht in der Inode die nummer vom IND, und im IND die Blocknummern der Datenbloecke, hier 12-267. Das ist also 1 block overhead wenn das file mehr als 12 blocks lang wird. Dann ein DIND, wenn der 268'te block gebraucht wird und fuer jeweils 256 Blocks ein IND dazu.

theclaw> Du erklaerst so schnell.

Isotopp> linux:/boot # dd if=/dev/zero of=kris bs=1k count=<b>12</b>
Isotopp> linux:/boot # ls -ls kris
Isotopp> <b>12</b> -rw-r--r--  1 root root <b>12288</b> Dec 26 16:58 kris
Isotopp> linux:/boot # dd if=/dev/zero of=kris bs=1k count=<b>13</b>
Isotopp> linux:/boot # ls -ls kris
Isotopp> <b>14</b> -rw-r--r--  1 root root <b>13312</b> Dec 26 16:58 kris
Isotopp> Ein 1k laenger, 14 Blocks statt 12.

theclaw> Wie findet man die Groessen der BGs eines dateisystems heraus?

Isotopp> Lies "show_super_stats" von "debugfs".
Isotopp> linux:/boot # export DEBUGFS_PAGER=cat
Isotopp> linux:/boot # debugfs /dev/sda5
Isotopp> debugfs 1.38 (30-Jun-2005)
Isotopp> debugfs:  show_super_stats
Isotopp> Inode count:              26104
Isotopp> Block count:              104388
Isotopp> Block size:               1024
Isotopp> Blocks per group:         8192
Isotopp> Inodes per group:         2008
Isotopp> Inode blocks per group:   251

Isotopp> Wird einiges klarer?

theclaw> Ein bisschen. Also wenn ich z.B. block nummer X habe, dann ist (nummer X)/(blocks per group) die BG nummer gell?

Isotopp> Ja, aber das interessiert nicht. Du redest ja von Bloecken.

Isotopp> Der n-te Block der datei x kann irgendwo liegen. Wo, das sagt dir die Inode.  Normal hast du ja ein File, und eine Position in einem File.

theclaw> Ich kann doch einfach von der Adresse auf der Platte X \* bytes_per_block lesen?

Isotopp> Naja, als root schon. Sonst nicht. debugfs macht das ja, die disk als raw device auf und dann direkt auf die Bloecke klettern. Niemand sonst tut so etwas ausser  debugfs und fsck. Alle anderen machen FILES auf und lesen dann am OFFSET in dem File. Punkt ist, dass du normal mit Files arbeitest und nicht mit Bloecken. Der kernel arbeitet mit Bloecken. Und er muss irgendwie vom File + Offset auf den Block kommen.

theclaw> Ja Klar

Isotopp> Unser ext2 hier hat 1 kb Blocksize. Wir lesen das File /boot/vmlinuz-2.6.13-15-default (inode 36). Und zwar am Offset 1000000 (1 mio). Der wievielte Block im File ist das?

theclaw> *denk*. Erstmal hat man ja nur den Dateinamen.

Isotopp> Ja, das kuemmert uns gerade noch nicht. Offset 1 mio -- welcher block? 1000000/1024 = 976.5625. Also Bytes 0-1023 sind Block 0, Bytes 1024-2047 sind Block 1 und so weiter.  In unserem fall also block 976. 976\*1024=999424, 1000000-999424=576. Byte 1 000 000 steht also in Block 976, an Position 576 in diesem Block.

theclaw> Okay. Stop mal. Hab da gleich ne Frage dazu:
theclaw> 21:40 Isotopp> und das wichtigste in struct: __le32 i_block[EXT2_N_BLOCKS];
theclaw> dieser kontext: i_block[976] brauchen wir da also. Ack? Und dazu noch das offset dazu?

Isotopp> Ja, aber den kriegen wir nicht so. <a href="http://kris.koehntopp.de/artikel/dateisysteme/filestructure.gif">http://kris.koehntopp.de/artikel/dateisysteme/filestructure.gif</a>.

theclaw> Ja, das wollte ich grad sagen :P Blocks 0-11 kriegen wir so. Muss man sich halt den Weg durchhangeln.

Isotopp> blocks 12-267 kriegen wir ueber den IND (single indirect block). Und blocks 268- kriegen wir ueber den DIND und den passenden IND.

Isotopp> 976-12=964, 964-256=708. 708/256=2.7656. Also muessen wir ueber den 2. IND des DIND gehen.

theclaw> Ich weiss nicht ganz was du da rechnest.

Isotopp> Naja, 1 KB blockgroesse, 4 byte pro blocknummer, also 256 blockadressen pro Block. 976ter Block ist gefragt. 

theclaw> ay

Isotopp> 12 direct blocks, also 964 blocks dahinter. 

theclaw> Also mit einem "indirekten block" kann man 256 andere bloecke adressieren, wie pointer in C

theclaw> Ich hab noch ganz grundlegende Fragen. Was wird wirklich wollen ist doch das mapping logische Ext2block-Adresse der Datei -> physische Blockadresse. Richtig?

Isotopp> In diesem speziellen fall: ja. Die allgemeine Formulierung lautet so: Wir haben ein Quadrupel (major number, minor number, inode number, offset in bytes), das ist ein Device, eine Partition (maj, min),  und in dem Device ein File (inode), und in dem File eine Byteposition. Und wir wollen ein Tripel (maj, min, blockno), also in der partition (maj, min) den zu dieser Datei gehoerenden physikalischen Block.

theclaw> jo

Isotopp> Weil (maj, min) bei dieser Abbildung konstant sind (wir arbeiten immer innerhalb derselben partition), vergessen wir maj und min und reden von einer Funktion die (ino, offset) auf (phy block) abbildet. Das nennt man ein Mapping. Und zwar ein Mapping fuer datenbloecke. Daher heisst die funktion bmap. Jedes dateisystem hat so eine Funktion, daher reden wir hier ueber die bmap funktion von ext2,  die heisst also sinnigerweise ext2_bmap.

theclaw> Schonmal sauhilfreich. ext2_bmap: Jetzt kann ich mir was darunter vorstellen. Danke. *codesuch*

Isotopp> Es ist eine diskrete funktion. y = mx+k. Das sind kontinuierliche Funktionen von R->R. Wir arbeiten hier mit diskreten, endlichen Funktionen. Die werden in der Regel als Lookuptable realisiert. Es gibt also eine Wertetabelle, die jedem (ino, offset) ein (phy block) zuordnet. Die wertetabelle IST die Inode. Eine inode ist also ein Array von Blocknummern. Wenn es ein naives Array waere, dann waere die Inode variabel gross und fuer grosse Dateien sehr, sehr gross. Das ist wenig effizient. Daher hat man die inode komprimiert, fuer kleine dateien (bis 12 blocks) speichert man die Wertetabelle tatsaechlich IN der inode (i_blocks[0-11]), aber stell Dir dieses Verfahren mal fuer 1000 Blocks vor. Das waere doof. Also speichert man die Wertetabelle fuer die bloecke 12-267 nicht in der Inode, sondern in einem fuer diesen zweck bestellten block, indem indirect block und in der inode nur den einen Eintrag fuer diesen Block.

theclaw> Ich habs soweit gecheckt.

Isotopp> Das kann man beweisen.
Isotopp> linux:/boot # dd if=/dev/zero of=kris bs=1k count=<b>12</b>
Isotopp> 12 blocks a 1 KB
Isotopp> (ich hab ja ein ext2 mit 1 KB blocks)
Isotopp> linux:/boot # ls -ls kris
Isotopp> <b>12</b> -rw-r--r--  1 root root <b>12288</b> Dec 26 17:30 kris
Isotopp> 12288 bytes lang 12 blocks belegt
Isotopp> nun mal 13 KB
Isotopp> linux:/boot # dd if=/dev/zero of=kris bs=1k count=<b>13</b>
Isotopp> linux:/boot # ls -ls kris
Isotopp> <b>14</b> -rw-r--r--  1 root root <b>13312</b> Dec 26 17:30 kris
Isotopp> 13312 bytes, aber 14 blocks! Da ist er, der IND.

theclaw> *selbstausprobier* Ist das die Anzahl der Bloecke fuer das Inode inklusive den Daten?

Isotopp> Das ist die Anzahl der Bloecke OHNE die inode selber (Die belegt 128 byte in der Inodetable), also Daten + IND + DIND + TIND. Kann man auch beweisen.
Isotopp> linux:/boot # dd if=/dev/zero of=kris bs=1k count=<b>0</b>
Isotopp> linux:/boot # ls -ls kris
Isotopp> <b>0</b> -rw-r--r--  1 root root </b>0</b> Dec 26 17:33 kris
Isotopp> File mit 0 Byte belegt 0 Blocks, Inode wird also nicht gezaehlt.

theclaw> okay. Das war hilfreich die Erklaerung, danke.

Isotopp> Also wir haben in der Inode das Lookup array fuer eine diskrete Funktion, eine Wertetabelle, und die Speicherung des array ist ulkig. Und wir haben deswegen overhead, weil wir die mit 1, 2 und 3 markierten Bloecke in <a href="http://kris.koehntopp.de/artikel/dateisysteme/filestructure.gif">http://kris.koehntopp.de/artikel/dateisysteme/filestructure.gif</a> irgendwann belegen muessen. Und deswegen siehst du die Spruenge - kein File hat jemals 13 Blocks.

theclaw> Moment, aber das ist ja sau umstaendlich eine ganze Datei zu lesen dann? :)

Isotopp> ah! Jetzt daemmert es langsam. Ist ja nicht so, dass ext2 GUT waere.

Isotopp> So, jetzt gehen wir noch mal in den Code
Isotopp> Das ist <a href="http://lxr.linux.no/source/fs/ext2/inode.c#L665">ext2_bmap</a>, sehr kurz. Du erinnerst dich: JEDES Dateisystem hat ein bmap. Darum ist ext2_bmap sehr kurz, es ruft generic_block_bmap auf. Das wiederum ruft dann allerdings ext2_get_block auf, das die Arbeit fuer generic_block_bmap macht. generic_block_bmap kriegt also einen Callback nach ext2_get_block mitgegeben. Wir landen also in <a href="http://lxr.linux.no/source/fs/ext2/inode.c#L547">ext2_get_block</a>. So weit so klar?

theclaw> Ja warte. Ich schau mir den Code gerade an.

Isotopp> Tut nicht not. Noch nicht. Erst mal ist nur wichtig, wie wir zu ext2_get_block kommen und wieso da ein Umweg ueber das generic_block_bmap gemacht wird.

theclaw> Nicht klar. Warte. Wo bei ext2_get_block() ist das Offset?

Isotopp> in iblock (2. parameter), ist schon umgerechnet in eine blocknummer.

theclaw> Ah klar, der n. block eines inodes.

Isotopp> Wir sind also in <a href="http://lxr.linux.no/source/fs/ext2/inode.c#L547">http://lxr.linux.no/source/fs/ext2/inode.c#L547</a> und sollen iblock aus inode (1. parameter) fischen. Also block 976 aus file 36. Wir muessen ja nun je nach Blockoffset unterschiedlich kompliziert die Lookuptable runterklettern. Bei blocks 0-11 waere alles ganz einfach, bei 12-267 kommt der IND dazu und bei den folgenden Bloecken der DIND. Soweit das verfahren grundsaetzlich klar?

theclaw> Ich schau mir das .gif nochmal an.

Isotopp> Es wird leichter, wenn du <a href="http://lxr.linux.no/source/fs/ext2/inode.c#L196">http://lxr.linux.no/source/fs/ext2/inode.c#L196</a> liest. i_block ist also 976. Dann schau mal in die Zeile 196. Zeile 201: direct_blocks ist 12. indirect_blocks ist ptrs, also 256.

theclaw> ext2_block_to_path. Das "path" hat nix mit dem Dateisystempfad zu tun, sondern mit dem Pfad, wie man zum Block kommt. Ahh.

Isotopp> Es geht um den Path in <a href="http://kris.koehntopp.de/artikel/dateisysteme/filestructure.gif">http://kris.koehntopp.de/artikel/dateisysteme/filestructure.gif</a>, ja.

theclaw> Warte, ich hab eine Frage zu dem GIF. Da z.b. "1", also der erste indirekte Block. Der koennte auf 256 weitere zeigen?

Isotopp> Ja. In unserem Beispiel ist das so, 4 byte pro blocknummer und 1 kb pro block. Bei anderen groessen (8 byte pro blocknr, und 4 kb pro block) ist das anders. 4096/8 = 512 pro IND z.B.

theclaw> hm. Sorry, ich dachte ne Blocknummer ist 32bit?

Isotopp> Ja, in unserem Beispiel ist das so. Aber es waere ja moeglich, das alles mit anderen Sizes zu compilen. Und dann soll es auch noch funktionieren. Also coden wir das alles nicht hart rein, sondern speichern die Rahmendaten im Superblock des Filesystems und schreiben den Code ordentlich. Soweit so klar?

theclaw> jo

Isotopp> Drum auch der Code in <a href="http://lxr.linux.no/source/fs/ext2/inode.c#L196">http://lxr.linux.no/source/fs/ext2/inode.c#L196</a>, Zeilen 199 bis 203.

theclaw> Den ich mir grad anschaue. ;)

Isotopp> Der fragt den Superblock sb nach den Anzahl der adressen pro Block, und bestimmt dann die direct_blocks, die Anzahl der Blockadressen pro indirect Block in indirect_block und die Anzahl der Blockadressen pro Double Indirect Block. Der macht das ein wenig komisch. Erst mal direct_blocks. Das ist leicht, da nimmt er nur den #define. indirect_blocks ist auch leicht, das ist ptrs, also EXT2_ADDR_PER_BLOCK(...sb), also mal im Superblock nachschlagen. <a href="http://lxr.linux.no/source/include/linux/ext2_fs.h#L100">#define EXT2_ADDR_PER_BLOCK(s)          (EXT2_BLOCK_SIZE(s) / sizeof (__u32))</a>. Block size bei uns 1024. und sizeof __u32 ist immer 4. Also ist mein beispiel mit 8 derzeit hypothetisch.

theclaw> ;)

Isotopp> Ein double block kann ebenfalls ptrs viele Blockadressen enthalten, also 256 Stueck. Jede von denen ist ein indirect block, der 256 Datenbloecke enthaelt.

theclaw> also 256^2 und ein TIND fuer 256^3.

Isotopp> Nun will er das aus irgendeinem Grund nicht so rechnen, sondern mit bit shifts, also macht er 1 &lt;&lt; (ptrs_bits \* 2).

theclaw> Also warte, kann man 256+256^2+256^3 Bloecke adressieren, d.h. kann ne datei so gross sein?

Isotopp> Ja, das ist auch noch ein Limit. Aber da wir nur 2^32 viele Blocknummern haben, ist bei 4 Gigablocks Schluss, also bei 4 TB (1 kb Bloecke) oder 16 TB (4 kb Bloecke).

theclaw> okay, irgendwie so ;)

Isotopp> Du muesstest schon die Blocknummern laenger machen als ein __u32, damit mehr geht, dann passen aber weniger direct_blocks in eine inode, oder die inode wird groesser.

Isotopp> Aber wir wollen mal weiter im code. Schau in zeile 207. Was machen die da?
Isotopp>  if (i_block &lt; 0) {
Isotopp> geht das ueberhaupt?

theclaw> Warte

theclaw> Nah, nur durch nen Programmierfehler evtl.

Isotopp> Welchen typ hat i_block?

theclaw> unsigned? :) Ja, okay. Das geht ueberhaupt nicht.

Isotopp> Steht oben in der Funktion - da ist es ein LONG!

theclaw> ah, doch ein signed :)

Isotopp> Aber eine Blocknummer, das haben wir vorher gesehen, ist ein __u32!

theclaw> Macht das sinn?

Isotopp> Nein, das ist FAHALSCH!

theclaw> sag das doch!

Isotopp> Du hast gerade deinen ersten Kernelfehler gefunden.

theclaw> geil! ;)

Isotopp> Der fehler sieht Blocknummern als signed, daher ist also nun schon bei 2 Gigablocks zu, also 2 TB und 8 TB Filesize (fuer 1 und 4 kb Blocksize). Aber weiter im Text, Zeile 209.

Isotopp> weiter zu 212. ((i_block -= direct_blocks) &lt; indirect_blocks) ist dir auch klar? Wir zermatschen i_blocks hier als Seiteneffekt.

theclaw> ja bin ein C-ler. Daran scheitert die Erklaerung nicht ;)

Isotopp> Also sind wir in 216. Nun ist i_block also 964 und wir ziehen 256 (indirect_blocks) ab. Das sind 708. Und double_blocks ist 256^2. Also true. Also speichern wir in 217: lese EXT2_DIND_BLOCK, dann in 218: lese i_block/256 (i_block >> ptrs_bits), und in 219: lese i_block % 256 (i_block & ( ptrs - 1)). Dann sind wir fertig.

Isotopp> Wir sind wieder in http://lxr.linux.no/source/fs/ext2/inode.c#L547, line 557 nun, soweit klar?

theclaw> Kleinen Moment, das Bitshifting finde ich verwirrend.

Isotopp> ja

theclaw> ich weiss jetzt, was ext2_block_to_path macht.

theclaw> Also warte mal. Lass mich mal zusammenfassen.
theclaw> Naja, nicht mal so einfach zu beschreiben.

Isotopp> Doch schon. Dir fehlen nur die Worte.

theclaw> :] jo

Isotopp> Wir haben nun offset[0], offset[1] und offset[2]. In offset[0] steht welches Feld aus der Inode wir nehmen (das DIND feld),  Wir haben dann einen Block mit 256 Feldern, und nehmen das Feld offset[1] da draus, lesen den Block und nehmen das Feld offset[2] da draus.

theclaw> Naja, das sind ja Details. Mich interessiert aber eher das Design als die Implementation ;), Das geht mir schon zu sehr in die Tiefe ehrlich gesagt.

Isotopp> Allgemeiner: wir haben ein Array, das nicht linear ist, sondern quadratisch steigend durch Indirektion komprimiert wird, und bei unseren Randparametern ist die schrittweite 8 bit (256 entries) pro Block, also 256, 256^2, 256^3, ... und das ist genau die Zeichnung <a href="http://kris.koehntopp.de/artikel/dateisysteme/filestructure.gif">http://kris.koehntopp.de/artikel/dateisysteme/filestructure.gif</a>.

theclaw> okay. Jetzt sind meine fragen geklaert oder? Dieses ganze Detailwissen erschlaegt mich ;)

Isotopp> Der Rest sind tatsaechlich Kerneldetails. Das hier war die logik. Der punkt ist, dass du in block_to_path durch die Faltlogik geklettert bist. Also die, die das mit DIR, IND, DIND und TIND analysiert und entscheidet.

theclaw> Naja, Faltlogik?

Isotopp> Ja, erst 12 direkt, dann 256 einmal gefaltet, dann 256\*256 zweimal gefaltet, dann 256\*256\*256 dreimal gefaltet statt eines einzigen linearen Arrays das zum groessten Teil leer waere.

theclaw> Hm, ich versteh zwar das System aber nicht was das mit Falten zu tun hat ;)

Isotopp> Naja, statt eines Array mit 2 Gigaentries (Kernelbug!) hast du ein Array mit 15 Eintraegen, bei dem die ersten 12 Eintraege fuer sich selber stehen der Eintrag 13 fuer 256 Eintraege, der Eintrag 14 fuer 256 Eintraege, die fuer 256 Eintraege stehen, steht, und der Eintrag 15 fuer 256 Eintraege die fuer 256 Eintraege, die fuer 256 Eintraege stehen steht. Also einmal falten, zweimal falten, dreimal falten.

theclaw> Aber "falten"? 
{% highlight console %}
Isotopp> &nbsp;&nbsp;&nbsp;\_\_\_
Isotopp> \_\_\_\ /\_\_\_
Isotopp> so in etwa

{% endhighlight %}
 theclaw> Was stellt das dar?

Isotopp> Ein Eintrag, der fuer viele steht. Ein Blatt Papier mit zwei Knicks, ein Eintrag (der zwischen \ /) steht fuer Drei (\_\_\_)

Isotopp> Und zum Schluß <a href="http://www.tamacom.com/tour.html">http://www.tamacom.com/tour.html</a>, <a href="http://www.tamacom.com/tour/kernel/unix/">http://www.tamacom.com/tour/kernel/unix/</a>, <a href="http://www.tamacom.com/tour/kernel/unix/S/97.html#L18">http://www.tamacom.com/tour/kernel/unix/S/97.html#L18</a>. Das, mein freund, ist der urvater aller bmaps, bmap in V7 Unix Rein gehen eine struct inode, die inode,  eine daddr_t bn, eine blocknummer und ein rwflag, das ist aber Wurst. Raus geht eine daddr_t blocknummer. Also (ino, block_in_file) -> (phys blocknr). NADDR ist die Anzahl der Eintraege in der Inode. Also sind 0-> NADDR-4 die direct blocks, NADDR-3 der IND,  NADDR-2 der DIND  und NADDR-1 der TIND.

theclaw> Aber den Code will ich mir jetzt nicht genauer ansehen, sorry ;)

Isotopp> Das ist derselbe Code, nur noch verquaster. Der ist ja auch 30 Jahre alt. 

theclaw> den Link bookmarke ich mal, das koennte noch interessant werden.

Isotopp> Und weil es so schoen ist, sind da auch die FreeBSD, NetBSD, OpenBSD und Hurd Versionen von demselben Zeug. Und da kannst du dann sehen wie fundamental das ist, was Du da gerade anfasst. Und wie sich C-Style im Kernel in den letzten 30 Jahren so entwickelt hat. Weil das V7 Zeugs da sind etwa 30 Jahre von hier, das 4.3BSD sind ca. 20 Jahre von hier und das Linux-Zeugs ist von jetzt.

theclaw> Wenn ich das so seh faellt mir grad auf wie sinnvoll man seine zeit nuetzen koennte ;)

theclaw> In welchen Chans bist du so?

Isotopp> Wenn du mich suchst, findest du mich in freenode:#mysql.

theclaw> Okay, also machs gut. Und nochmal thx. :)
