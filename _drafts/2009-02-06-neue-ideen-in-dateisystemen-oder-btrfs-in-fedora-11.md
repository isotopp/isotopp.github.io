---
layout: post
published: true
title: 'Neue Ideen in Dateisystemen (oder: BTRFS in Fedora 11)'
author-id: isotopp
date: 2009-02-06 16:34:20 UTC
tags:
- dateisysteme
- free software
- linux
- lang_de
feature-img: assets/img/background/rijksmuseum.jpg
---
<blockquote>There are two kinds of fool. One says, “This is old, and therefore good..” And one says “This is new, and therefore better..”
	—John Brunner, in The Shockwave Rider</blockquote>

Neue Ideen in Dateisystemen sind so eine Sache. Es handelt sich bei einem Dateisystem ja um Infrastrukturcode par excellence, und so reden die meisten Leute gerne von ihrem letzten Datenverlust, wenn man sie nach Dateisystemen befragt. Das ist nicht neu, ich habe in <a href='http://blog.koehntopp.de/archives/2127-The-Importance-Of-FAIL.html'>The Importance Of FAIL</a> das Thema ja schon mal angeschnitten.

Neue Ideen in Dateisystemen sind auch langsam. 1984 bis 1992 gab es das <a href='http://en.wikipedia.org/wiki/Sprite_operating_system'>Sprite Projekt</a> in Berkeley, bei dem es um die Entwicklung eines rechnerübergreifenden Betriebssystems ging. Teil von Sprite war auch etwas, das sich <a href='http://en.wikipedia.org/wiki/Log-structured_file_system'>LFS (Log Structured Filesystem)</a> nannte.


LFS basiert auf der Idee, daß nur noch Writes auf eine Platte übrig bleiben, wenn man nur genug RAM zum Cachen aller Reads hat. Also quasi die Situation, in der Google jetzt grad ist. Wenn das aber so ist, so geht die Überlegung weiter, dann muß man Daten auf der Platte nicht zum Lesen optimiert ablegen, sondern das Schreiben optimieren.

<b>Ein Exkurs in Fragmentierung</b>

Gegeben sei MS-DOS, also ein System mit nur einem Thread, der Read-Requests generieren kann und quasi ohne Read-Cache, der solche Reads wegoptimieren kann. Dann ist das Dateisystem dann für viele Anwendungen zum Lesen optimiert, wenn alle Dateien defragmentiert abspeichert sind, d.h die Blocknummern der physikalischen Blöcke jeder Datei unmittelbar aufeinanderfolgend sind.

Gegeben sei ein System mit unendlich viel Speicher, das schon unendlich lange läuft. Dann wiederum sind alle Daten im RAM gecached, und die physikalische Anordnung der Daten auf der Platte ist aus der Sicht der Lesezugriffe total schnurz.

Die meisten realen Systeme liegen irgendwo dazwischen - je mehr RAM und je besser die Caches vorgeglüht, desto mehr ist es egal, wie die Daten auf der Platte angeordnet sind.

Die meisten realen Systeme haben heutzutage auch mehr als einen Thread, der Requests erzeugen kann und schon von daher ist das statisch lineare Layout von Dateien auf der Platte nicht mehr unmittelbar ein Garant für dynamisch lineare Lesezugriffe.

<b>LFS dreht den Spieß um</b>

LFS nimmt nun ein solches System mit unendlich viel Speicher und unendlich langer Laufzeit an, d.h, kümmert sich nicht um die Linearisierung von Reads, sondern lediglich noch um die Linearisierung von Writes: Das Dateisystem <em>hat</em> kein Log, es <em>ist</em> ein Log - ein großer Ringpuffer von Daten, bei dem die Platte von vorne nach hinten beschrieben wird und wenn man am Ende der Platte angekommen ist, fängt man von vorne an.

Snapshots bekommt man bei einem solchen System gratis (Aber <a href='http://en.wikipedia.org/wiki/Log-structured_File_System_(BSD)'>BSD hat es nicht implementiert</a>): Am Anfang der Platte hat man keinen Superblock, sondern einen Zeiger auf die letzten paar Superblöcke, die geschrieben wurden. Jede Operation kann als Transaktion geschrieben werden: Blöcke werden dabei nicht überschrieben, sondern geänderte Versionen des neuen Blockes werden linear rausgeschrieben.

Beispiel: Eine Datei besteht aus einem Verzeichniseintrag, einer Inode und in der Inode aus Zeigern auf Datenblöcke. Überschreibt man nun das letzte KB der Datei und verlängert sie nun auch noch um ein KB, dann werden zunächst der "überschriebene" Datenblock und der neue Datenblock am Ende des Schreibpuffers neu geschrieben, dann wird die geänderte Inode der Datei dahinter neu geschrieben und dann der Block, der auf die aktuelle Version dieser Inode zeigt neu geschrieben und am Ende ein neuer Superblock.

Beim Lesen folgt man dem neusten Superblock, findet man die neuste Version der Inode, und damit die geänderte und verlängerte Datei. Folgt man der älteren Kopie des Superblocks, findet man eine ältere Version der Inode derselben Datei und die dazu gehörenden älteren Versionen der Datenblöcke, also eine alte Version derselben Datei. Alle Blöcke, die zwischen beiden Versionen der Datei unverändert bleiben, sind beiden Versionen gemeinsam und nur einmal auf der Platte vorhanden.


<b>LFS Performance stinkt</b>

Nun ist es so, daß außerhalb des Googleplex RAM endlich und die Laufzeiten von Computern begrenzt sind. Daher ist es auch so, daß es zu Situationen kommen kann, in denen der File System Buffer Cache das aus Lesesicht absolut pessimale Layout von LFS nicht abschirmen kann. In solchen Fällen - die besonders von Datenbanken gerne provoziert werden - ist die Performance von LFS nur mit geologischen Fachbegriffen zu erfassen.

Schon LFS auf Sprite, und sein späterer Port auf BSD Unix haben daher einen Repacker gehabt. Das ist ein Prozeß der Idlezeiten der Platte nutzt und die Daten auf dem Medium ein wenig read-freundlicher anordnet. Man kann sich das wie eine dauernd laufende Defragmentierung im Hintergrund vorstellen. Auch ReiserFS 4, das auf ähnlichen Ideen basiert hat einen solchen Repacker.


<b>In with the out, old with the new</b>

Die Idee, Daten niemals zu überschreiben ist sicherlich gut. Sie läßt sich jedoch auch mit Dateisystemen implementieren, die Daten gleich beim ersten Schreiben sinnvoll auf der Platte layouten ohne dabei eine Ringpuffer-Struktur zu erzeugen.

Dateisysteme wie <a href='http://en.wikipedia.org/wiki/Write_Anywhere_File_Layout'>WAFL</a> auf einer NetAPP sind ein erster Schritt in diese Richtung, Suns <a href='http://en.wikipedia.org/wiki/ZFS'>ZFS</a> geht ihn noch konsequenter. Beide Dateisysteme stammen aus Projekten, in denen Leute arbeiten, die vorher mit verschiedenen Versionen von LFS gearbeitet haben. Insofern ist es auch nicht weiter verwunderlich, daß solche Ideen in diesen Dateisystemen auftauchen - <a href='http://www.sun.com/lawsuit/zfs/'>außer man ist Patentanwalt</a> und wundert sich aus beruflichen Gründen.

Solche Dateisysteme, die nie überschreiben (und daher laufend snapshotten), aber die Platte nicht als Ringpuffer betrachten sondern schon noch layouten, nennt man Copy-On-Write Dateisysteme (COW-FS).

<b>Weitere gute Ideen importieren</b>

ZFS ist in diesem Zusammenhang besonders interessant, weil es noch weitere gute Ideen von anderswo importiert. <a href='http://en.wikipedia.org/wiki/Episode_filesystem'>Episode</a> zum Beispiel ist das Dateisystem der halb vergessenen DCE-Initiative, und vielen Leuten in der Geschmacksrichtung <a href='http://en.wikipedia.org/wiki/AdvFS'>AdvFS</a> von DEC bekannt.

AdvFS integriert das Storagemangement, das sonst von einem Logical Volume Manager erledigt wird und das Platzmanagement des Dateisystems ineinander. Eine File Domain kann man sich dabei wie eine Volume Group vorstellen - eine Art Kiste, in der die Blöcke enthalten sind, die beschrieben werden können.

In der File Domain sind File Sets vorhanden, Dinge, die man anderswo Dateisysteme nennt. File Sets ist dabei nicht zwingend eine feste Größe zugewiesen - man kann sie sich wie Luftballons vorstellen, die in der Kiste sind und die nach bedarf aufgeblasen und verkleinert werden können. Mit einem Quota-System kann man einem File Set einen Mindestplatzbedarf und einen Maximalbedarf zuordnen und so den Platz in der File Domain verwalten. Der <a href='http://advfs.sf.net/'>AdvFS-Source</a> ist seit 2008 GPLed, aber er interessiert kaum noch jemanden.

ZFS hat wie AdvFS diese Integration von Volume Management in das Dateisystem übernommen - etwas, das auf den Linux-Kernel-Mailinglisten von einigen Personen als <a href='http://www.google.de/search?q=blatant+layering+violation&ie=utf-8&oe=utf-8&aq=t&rls=org.mozilla:en-US:official&client=firefox-a'>blatant layering violation</a> angesehen wurde - die Redewendung hat es zu einigem Google-Karma gebracht. Tatsächlich handelt es sich um eine andere Sicht auf den Stack, aber eine, die durchaus von anderen geteilt wird, die wie man an AdvFS sehen kann und die durchaus interne Struktur hat.

Eine andere gute Idee, die ZFS aus der Datenbankwelt übernommen hat, sind Prüfsummen überall. Auf diese Weise - und nur auf diese Weise - ist es möglich, die Integrität des Dateisystems Ende-zu-Ende sicherzustellen und vor allen Dingen auch integre Teile des Systems zur Verfügung zu stellen, während man beschädigte Teile isoliert und abtrennt. Der ZFS-Code kann es nicht, aber grundsätzlich ist es möglich aus jedem defekten ZFS ein integres Sub-ZFS raus zu extrahieren und zu publizieren, während der Rest anderweitig recovered wird - die Datenstrukturen geben das her.

<b>Open Source Management</b>

Nun hat Sun ein sehr sauberes und durchaus <a href='http://en.wikipedia.org/wiki/CDDL'>politisches-strategisches Intellectual Property Management</a>. Das bewirkt, daß der Source von ZFS unter der <a href='http://en.wikipedia.org/wiki/CDDL'>CDDL</a> ("cuddle", eine modifizierte MPL 1.1) verfügbar ist - er ist Teil von Opensolaris, FreeBSD, MacOS X und einigen anderen Systemen. Die CDDL verletzt aber die additional restrictions clause der GPL und ist mit der GPL nicht kompatibel - es wäre zwar technisch möglich einen Linux-Kernel zu bauen, der ZFS enthielte, aber es ist keinem Distributionshersteller juristisch möglich so etwas zu verteilen. ZFS läuft daher unter Linux nur als Userland-Prozeß als Teil von <a href='http://en.wikipedia.org/wiki/Filesystem_in_Userspace'>FUSE</a>.

<b>COW-FS in Linux - BTRFS</b>

Die Linux-Crowd ficht das nicht an. Im Linux-Kernelspace entwickelt man seit einiger Zeit an einem Nachfolger für die extX-Reihe von Dateisystemen, und einer der Kandidaten für eine solche Nachfolge ist <a href='http://btrfs.wiki.kernel.org/index.php/Main_Page'>BTRFS</a> ('ButterFS', nicht etwa 'BetterFS'). Die Featureliste von BTRFS liest sich wie eine Shoppingliste in den Stammbäumen der oben genannten Ahnherrschaften: Extent-Based wie ext4 und XFS statt Bitmaps wie ext3 und ZFS, Tail-Packing wie bei Reiser3 und Reiser4, Verzeichnisse als Bäume wie inzwischen allgemein üblich, dynamisch erzeugte Inodes, wie sich fast zwingend aus COW-FS-Erfordernissen ergibt, writeable-snapshots, subvolumes (File Sets aus AdvFS), Object Level Mirroring und Striping, Checksums on Everything, Compression (und sicher auch Encryption), Integrated Multiple Device Support (besagte blatant layering violation), Online Filesystem Check (o.a. Teilvalidierung) und Online System Defragmentation (ein Repacker und die Möglichkeit des Online Filesystem Checks machen das leicht).

Die BTRFS-Leute ziehen dabei ein paar echt eklige, aber vollkommen legale Stunts ab. In <a href='http://btrfs.wiki.kernel.org/index.php/Conversion_from_Ext3'>Conversion from ext3</a> wird gezeigt, wie die Metadatenstrukturen von BTRFS in ein existierendes ext3 reingemalt werden können ohne das ext3 zu beschädigen und wie kurzzeitig beide Systeme parallel existieren und die Datenblöcke teilen können. Das erlaubt eine Konvertierung von extX-Dateisystemen in BTRFS ohne Neuformatierung - ein echtes Killerfeature für Leute mit einem Arsch voll Linux-Daten.

Einen schönen Überblick über die BTRFS-Strukturen findet man im <a href='http://btrfs.wiki.kernel.org/index.php/Btrfs_design'>Design Dokument</a>. Zum Thema <a href='http://btrfs.wiki.kernel.org/index.php/Multiple_Device_Support'>Multiple Device Support</a> gibt es ebenfalls Seiten. Und eine Einführung in den Code gibt es auch - <a href='http://btrfs.wiki.kernel.org/index.php/Code_documentation'>hier</a>.

BTRFS ist unter der GPL lizensiert, kompatibel mit dem Linux-Kernel und Bestandteil aktueller Standardkernel. Die gestern freigegebene <a href='http://btrfs.wiki.kernel.org/index.php/Code_documentation#Sample_Item_Insertion'>Fedora 11 Alpha</a> enthält BTRFS als experimentelles Dateisystem - gut genug zum Spielen und Testen, aber noch nicht gut genug für Wirkdaten.

