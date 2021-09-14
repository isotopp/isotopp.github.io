---
layout: post
published: true
title: Wieviel Speicher brauchst Du denn?
author-id: isotopp
date: 2009-10-09 17:05:00 UTC
tags:
- computer
- kernel
- linux
- lang_de
feature-img: assets/img/background/rijksmuseum.jpg
---
![](/uploads/mappedprocess3.png)

*Linux mapped die Speicherseiten zweiter Prozesse. Dabei wird speicher geteilt, oder Seiten sind noch ungeladen. Manche Seiten werden beim ersten Schreibzugriff kopiert (Copy-on-Write).*

Manchmal muß man viel erklären, um eine einfache Frage beantworten zu können: Wieviel Speicher belegt ein Programm in Linux? Diese Frage war bisher überraschend schwer zu beantworten. Da ist einmal die Ausgabe von `ps axuwww` oder `top`:

```console
[root@mc01bpmdb-02 ~]# ps axu | egrep '(mysql[d]|USER)'
USER       PID %CPU %MEM   VSZ  RSS TTY      STAT START   TIME COMMAND
...
mysql    24861 71.2 77.3 26284608 25444724 ? Sl    2008 385405:36 /usr/sbin/mysqld
...
```

Hier bekommt man zwei Größenangaben in den Spalten VSZ und RSS, beide sind in Kilobytes.

Die Angabe VSZ wird als die gesamte Virtuelle Prozeßgröße des Progresses bezeichnet. Die Manpage zu `ps` listet dies als "vm_lib + vm_exe + vm_data + vm_stack", also als Summe der Mappings für das Executeable, die reservierten Datenbereiche, alle Bibliotheken und den Stack, und ich bin sicher, daß das nicht ganz korrekt ist, weil es mit `mmap(2)` gemappte Speicherbereiche nicht mit aufzählt, aber diese auch angezeigt werden.

Die Angabe RSS steht für Resident Set Size, die Menge des nicht rausgepagten physikalischen Speicher die dieser Prozeß hält.

Man kann die VSZ also als die 'gemappte' Größe des Prozesses bezeichnen und die RSS als die 'belegte' Größe des Prozesses.

Wenn man ein MySQL neu startet sieht man, daß die VSZ schon fast die endgültige Größe des Prozesses erreicht hat (MySQL hat schon einmal alle großen Puffer beim Betriebssystem bestellt und treibt so die Prozeßgröße nach oben). Die RSS ist jedoch noch sehr klein, weil diese bestellten Puffer noch nicht beschrieben wurden und das Betriebssystem daher die entsprechenden Speicherseiten auch noch nicht physikalisch realisiert hat - die Puffer der Datenbank sind noch kalt und die Daten werden nach Bedarf bei den ersten Zugriffen erst einmal von Disk geladen.

Über die Zeit wird die VSZ ein wenig steigen (Verbindungen werden aufgebaut und MySQL bestellt noch ein wenig zusätzlichen Speicher) und die RSS nähert sich der VSZ immer mehr an. Die Datenbank im Beispiel da oben hat eine VSZ von etwas über 25G und eine RSS von immerhin 24.2G. Sie läuft schon sehr lange.

Auch von einem `top` bekommt man diese Zahlen, sogar gleich in hübsch:

```console
PID USER      PR  NI %CPU    TIME+  %MEM  VIRT  RES  SHR S COMMAND            
24861 mysql     16   0  222 385424:47 77.4 25.1g  24g 5804 S mysqld
```

Aber für Prozesse, die viel fork()'en bekommt man so keine sehr aussagekräftigen Zahlen. Von einem Apache-Webserver würde man ja sehr gerne wissen, wie viele parallele Server-Instanzen man so ausführen kann, wenn man ihn startet.

Hier ist mein Apache, in einem Moment geringer Last: 

```console
h743107:~ # ps auxwww | grep http
root     18345  0.0  0.9 124880 10100 ?        Ss   Oct08   0:00 /usr/sbin/httpd2 
wwwrun   28179  2.3  3.1 127172 32324 ?        S    17:28   0:09 /usr/sbin/httpd2 
wwwrun   28591  1.8  2.8 127796 29192 ?        S    17:33   0:02 /usr/sbin/httpd2 
wwwrun   28677  1.7  2.2 127480 23808 ?        S    17:34   0:00 /usr/sbin/httpd2 
wwwrun   28678  1.2  2.6 127448 27408 ?        S    17:34   0:00 /usr/sbin/httpd2
wwwrun   28779  1.9  2.3 127116 24780 ?        S    17:35   0:00 /usr/sbin/httpd2
```

Wir erkennen zwei Sorten Apache-Prozesse: PID 18345 läuft unter der UID root - es ist der Apache Master, der auf eingehende Verbindungen lauscht und Aufträge dann an Worker-Prozesse weiter gibt, die die eigentliche Seite erzeugen. Der Master steuert auch die Größe des Worker-Pools über die Zeit je nach Bedarf. Dazu hat er eine Reihe von Parametern, von denen einer den Namen MaxClients hat. Dieser Parameter legt fest, wie viele Worker Apache maximal startet und man sollte diesen Wert so hoch wie möglich ansetzen ohne daß der Server in den Swap gerät.

Wie man sieht hat ein Apache Master bei mir eine Größe von etwas über 120M, aber eine RSS von etwas unter 10M. Die Worker haben ebenfalls eine VSZ von mehr als 120M, aber ihre RSS ist mit um die 24-32M etwas größer.

Der tatsächliche Speicherverbrauch ist jedoch weitaus geringer. Wir können ihn uns im Detail in der Datei /proc/_PID_/maps ansehen: 

```console
h743107:~ # cd /proc/18345/
h743107:/proc/18345 # wc -l maps
264 maps
h743107:/proc/18345 # head -6 maps
80000000-8004f000 r-xp 00000000 08:03 9732852    /usr/sbin/httpd2-prefork
8004f000-80052000 rw-p 0004f000 08:03 9732852    /usr/sbin/httpd2-prefork
80052000-80349000 rw-p 80052000 00:00 0          [heap]
b090f000-b490f000 rw-s 00000000 00:08 17650846   /dev/zero (deleted)
b490f000-b690f000 rw-s 00000000 00:08 688128     /SYSV00000000 (deleted)
b690f000-b695d000 r-xp 00000000 08:03 9701605    /usr/lib/libgcrypt.so.11.2.2
h743107:/proc/18345 # tail -6 maps
b7f9d000-b7f9e000 rw-p b7f9d000 00:00 0 
b7f9e000-b7f9f000 r-xp b7f9e000 00:00 0          [vdso]
b7f9f000-b7fba000 r-xp 00000000 08:03 6160422    /lib/ld-2.5.so
b7fba000-b7fbc000 rw-p 0001a000 08:03 6160422    /lib/ld-2.5.so
bf866000-bf87a000 rwxp bf866000 00:00 0          [stack]
bf87a000-bf87b000 rw-p bf87a000 00:00 0
```

Die Angaben in /proc/.../maps lassen sich [wie folgt](http://linuxwiki.de/proc/pid#A.2BAC8-proc.2BAC8.3CPID.3E.2BAC8-maps) lesen: 

- Die erste Angabe ist ein Bereich von Speicheradressen, der im Adreßraum des Prozesses belegt wird. Da der Speicher in einer Intel-CPU in Speicherseiten von 12 Bit = 4K verwaltet wird, sind die Angaben immer vielfache von 4K (0x1000), d.h. die letzten 3 Stellen sind immer 0.
- Die Flags geben dann an, welche Operationen auf diesem Speicherbereich möglich sind: rwx für read, write und execute. p ist ein Private Mapping, s ist ein Shared Mapping.
- Viele Mappings sind Abbildungen von Dateien in den Adreßraum eines Prozesses. In Unix wird eine Datei aber durch ihre Gerätenummer (maj, min) und ihre Inode-Nummer auf dem Gerät bezeichnet, etwa 08:03 9732852.
- In der Map wird auch noch der Pfadname dieser Datei angezeigt, soweit bekannt (/usr/sbin/httpd2-prefork).
- Nun kann es sein, daß verschiedene Abschnitte dieser Datei mit unterschiedlichen Rechten eingeblendet werden sollen: So soll /usr/sbin/httpd2-prefork ab Offset 00000000 mit den Rechten r-x an der Adresse 80000000 eingeblendet werden, der Abschnitt derselben Datei ab 0004f000 jedoch mit rw- ab Speicheradresse 8004f000.

Das wird klarer, wenn man sich die Datei einmal anschaut:

```console
h743107:/proc/18345 # size -x /usr/sbin/httpd2-prefork
   text    data     bss     dec     hex filename
0x4ebe3  0x2378  0x2e10  343403   53d6b /usr/sbin/httpd2-prefork
```

Die Datei besteht also aus Code (Text) in der Länge von 0x4ebe3 Byte, das entspricht aufgerundet 0x4f000 Bytes oder 0x4f Seiten zu 4K. Danach kommen 0x2378 Byte (0x3000 Byte aufgerundet zur Seitengrenze) ab Offset 0x4f000 an Daten.

Das heißt, die erste Zeile der maps-Datei zeigt uns wie der Code des Webservers ab Offset 0 der Datei in Adresse 0x80000000 in den Speicher eingeblendet wird. Die Einblendung ist schreibegeschützt. Danach kommt ab 0x8004f000 im Speicher (und ab 0x4f000 in der Datei) der Datenteil, der wiederum beschreibbar ist.

Die Summe aller dieser Einblendungen ist die VSZ des Prozesses, also der Anteil seines 64-Bit oder 32-Bit Adreßraumes, auf den der Prozeß zugreifen kann ohne daß ihm das Betriebssystem an die Ohren haut.

![](/uploads/unmappedprocess.png)

*Bei einem Programmstart existieren zwar Mappings für die virtuellen Speicherseiten eines Prozesses (hier mit 1-7 bezeichnet), aber ihnen sind keine physikalischen Speicherseiten zugeordnet. Jeder Zugriff auf eine dieser Seiten wird vom Betriebssystem erkannt und abgefangen.*

Aber die Tatsache, daß ein Mapping für eine virtuelle Adresse existiert heißt noch lange nicht, daß das Betriebssystem auch physikalischen Speicher dafür belegt hat. Genau genommen ist am Anfang gar keine Speicherseite belegt - das Betriebssystem mapped das Programm in den Speicher, aber das Programm ist noch nicht geladen. Dann beginnt das Programm seine Ausführung und greift auf eine Speicheradresse zu, die nicht existiert.

Das erste was also passiert ist eine Speicherschutzverletzung - aber eine legale. Das Betriebssystem wird aus seinem Pool leerer Speicherseiten eine auswählen, dort den auf Grund der Mappinginformationen benötigten Inhalt reinladen und die abgebrochene Instruktion nun neu starten.

Im Beispiel wird beim Start des Programmes also auf Seite 1 zugegriffen, die jedoch nicht gemapped war. Das Betriebssystem unterbricht die Ausführung des Programmes, lädt die betreffende Seite von Disk in eine physikalische Speicherseite, hier B, stellt das Mapping her und restartet die Instruktion. Wird die Ausführung fortgesetzt entstehen weitere Seitenfehler (page faults) und das Programm wird sukzessive so weit in den Speicher geladen wie notwendig - aber es wird nie mehr Speicher verbraucht als unbedingt notwendig.

![](/uploads/mappedprocess1.png)

*Beim Zugriff auf Seite 1 kommt es zu einem (legalen) Seitenfehler. Das Betriebssystem unterbricht die Anweisung, die den Fehler ausgelöst hat, lädt die fehlende Speicherseite von der Platte in das physikalische RAM (hier: Seite B) und stellt ein Mapping der virtuellen Seite 2 auf die physikalische Seite B her. Danach wird die unterbrochene Anweisung neu gestartet - das ausgeführte Programm merkt nichts vom Getrickse des Betriebssystems.*

Die Optimierungen sind offensichtlich: Wenn beim Herstellen des Programms durch den Compiler und Linker oder durch Profiling von vorhergehenden Programmausführungen ermittelt werden kann, welche Teile des Programmes auf jeden Fall benötigt werden, dann kann man den Hagel der Seitenfehler beim Programmstart antizipieren und die gebrauchten Seiten gleich und linear in den Speicher laden. Das ist schneller und effektiver - moderne Betriebssysteme machen das auch so.

In jedem Fall entsteht durch die Programmausführung ein Mapping von Seiten - dabei muß es keine lineare Entsprechung von virtuellen (Prozeß-) Adressen und physikalischen Speicheradressen geben.

![](/uploads/mappedprocess2.png)

*Nach einiger Zeit sind alle benutzten Seiten des Programmes irgendwie auf physikalischen Speicher abgebildet, das Programm und seine Daten befinden sich im RAM.*

In Linux wird die Situation nun durch mehrere Dinge noch komplizierter: Zum einen existieren Shared Libraries. Das ist Code, der von allen oder vielen Programmen gebraucht wird und der deswegen in einer Extradatei abgelegt ist - zum Beispiel libc.so.6, die Laufzeitbibliothek der Sprache C: 

```console
h743107:/lib # ls -lL libc.so.6
-rwxr-xr-x 1 root root 1491141 Oct 19  2008 libc.so.6
h743107:/lib # size -x libc.so.6
   text    data     bss     dec     hex filename
0x1273dd         0x2758  0x2c58 1230733  12c78d libc.so.6
```

Wie man sieht ist die libc recht fett: 0x128000 Bytes, also 0x128 Speicherseiten an Code plus Daten. Jedes noch so kleine Hello-World-Programm das `printf()` aufruft verwendet die ganze libc.

Aber: Der Code für die libc wird nur einmal geladen und belegt nur einen Satz physikalische Speicherseiten. Er wird jedoch in jeden laufenden Prozeß im System eingeblendet: 

```console
h743107:/proc # ls -ld [0-9]* | wc -l 
198
h743107:/proc # grep libc-2.5 [0-9]*/maps | grep r-xp| wc -l 
175
```

Okay, fast jeden. Etwas anderes fällt dabei auch noch auf: 

```console
h743107:/proc # grep libc-2.5 [0-9]*/maps | grep r-xp| head -10
1031/maps:b7c1f000-b7d47000 r-xp 00000000 08:03 6160449    /lib/libc-2.5.so
1131/maps:b7c1f000-b7d47000 r-xp 00000000 08:03 6160449    /lib/libc-2.5.so
1154/maps:b7b24000-b7c4c000 r-xp 00000000 08:03 6160449    /lib/libc-2.5.so
1155/maps:b7b24000-b7c4c000 r-xp 00000000 08:03 6160449    /lib/libc-2.5.so
1247/maps:b7c1f000-b7d47000 r-xp 00000000 08:03 6160449    /lib/libc-2.5.so
12512/maps:b7e4a000-b7f72000 r-xp 00000000 08:03 6160449    /lib/libc-2.5.so
1278/maps:b7c1f000-b7d47000 r-xp 00000000 08:03 6160449    /lib/libc-2.5.so
12906/maps:b7dae000-b7ed6000 r-xp 00000000 08:03 6160449    /lib/libc-2.5.so
13103/maps:b7cee000-b7e16000 r-xp 00000000 08:03 6160449    /lib/libc-2.5.so
1342/maps:b7b30000-b7c58000 r-xp 00000000 08:03 6160449    /lib/libc-2.5.so
```


Der Code einer shared library ist verschieblich (PIC, position independent code) und kann so in verschiedenen Programmen an verschiedenen Stellen eingeblendet werden. Das kann wegen PIC geschehen, ohne daß die Inhalte der Speicherseiten angepaßt werden müssen: Sprünge im Code werden relativ (300 Bytes vor) statt absolut (springe nach b7c1fe34) angegeben. Die libc ist also einmal geladen, belegt 0x128 Speicherseiten, wird aber in unserem System in 175 von 198 Programmen eingeblendet.

Das heißt, wir verbrauchen schon mal sehr viel weniger Speicher als gedacht. Gut.

Nun hat zwar jedes Programm mit libc ein `printf()` und ein `ctime()`, aber in jedem Programm steht in dem statischen internen Puffer der Funktion ctime() eine andere Zeit - jedes Programm hat für seine libc also eigene private Daten. Die Datenseiten der verschiedenen libc können also nicht zwischen den Prozessen geshared werden. Darum haben sie auch eigene Mappings mit eigenen Zugriffsrechten: 

```console
h743107:/proc # grep libc /proc/self/maps
b7dbd000-b7ee5000 r-xp 00000000 08:03 6160449    /lib/libc-2.5.so
b7ee5000-b7ee6000 r--p 00128000 08:03 6160449    /lib/libc-2.5.so
b7ee6000-b7ee8000 rw-p 00129000 08:03 6160449    /lib/libc-2.5.so
```

Dasselbe passiert auch mit Programmen, die sich per `fork()` vervielfältigen oder mehrfach geladen werden: Wenn zwei Benutzer vi verwenden, dann steht der Code für vi selbst nur einmal im Speicher - aber jeder vi-Prozeß hat eigene Datenseiten, die eigenen Text speichern und eine eigene Cursorposition und einen eigenen Cut und Paste-Buffer haben. Das ist ja recht wichtig, wenn man nicht gerade Google Docs ist und Documente haben möchte, die von mehreren Personen zur Zeit bearbeitet werden können sollen.

Hier greift noch eine weitere Optimierung: Copy on Write (COW). Wenn im Beispiel also Prozeß 2 durch fork() aus Prozeß 1 erzeugt wird, wie es der Apache Webserver zum Beispiel laufend tut, dann sind zunächt _alle_ Speicherseiten zwischen beiden Prozessen geshared - auch die, die beschrieben werden können.

![](/uploads/mappedprocess3.png)

*PID 2 versucht Seite 3 zu beschreiben, die auf die Seite F gemapped war. Da auch PID 1 diese Seite sehen kann, würde dieser Schreibzugriff von PID 2 Daten verändern, die PID 1 sieht - das geht nicht! Das Betriebssystem fängt den Zugriff ab, kopiert die Seite F nach G und mapped Seite 3 für PID 2 nach G. Jetzt haben PID 1 und PID 2 jeder eine private Kopie der veränderten Daten - der Rest wird aber noch geshared.*

Schreibt nun etwa Prozeß 2 in seine Speicherseite 3, dann löst dies wiederum eine Zugriffsverletzung aus, weil die Seite zwar prinzipiell beschreibbar ist, aber vom Betriebssystem heimlich als schreibgeschützt markiert worden ist. Das Betriebssystem kopiert nun die physikalische Speicherseite F nach G, ändert das Mapping von 3 für den Prozeß 2 so, daß die Seite 3 nun auf G statt F zeigt und restarted die unterbrochene Instruktion. Beide Prozesse haben nun ihre private Kopie von Seite 3 (PID 1 hat F, PID 2 hat G) und können bis auf weiteres unbehelligt schreiben.

Da das Kopieren von Seiten nur nach Bedarf - bei Schreibzugriffen - geschieht, wird von einer fork()-Kopie also nur so viel Speicher benötigt, wie unbedingt notwendig (zu Speicherseiten aufgerundet, natürlich). Es mag also sein, daß ich einen httpd2 mit 128M VSZ habe, der 20 Kopien von sich startet. Aber das erzeugt weder einen Speichermehrverbrauch von 20 \* 128M, noch einen Speicherverbrauch von 20\*24M (die RSS), sondern ist je nach Benutzung des Speichers sehr viel weniger.

Leider kann man nicht leicht sagen, wie viel genau.

An dieser Stelle kommen nun lustige Kernel-Erweiterungen und Werkzeuge ins Spiel und die sind der Grund, warum ich diesen Artikel überhaupt angefangen habe:

Auf der [Perl5 Porters Mailingliste](http://www.xray.mpe.mpg.de/mailing-lists/perl5-porters/2009-10/msg00329.html) stellt Joshua ben Jore das Werkzeug [Exmap](http://www.berthels.co.uk/exmap/) vor, zu dem es [auch noch Patches](http://github.com/cxreg/exmap/blob/00c3ad6fe135feb695dff7babcc02c408675ce15/README) gibt. Auch [smem](http://www.selenic.com/smem/) kann die Speichernutzung von Prozessen detaillierter analysieren und so genauer ermitteln wie hoch der Speicherverbrauch eines Prozesses denn nun wirklich ist.

Und das wiederum erlaubt dann genauere Planungen der MaxClients in einem Apache.