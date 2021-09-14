---
layout: post
published: true
title: Hardware für ein MySQL
author-id: isotopp
date: 2007-07-28 18:38:38 UTC
tags:
- hardware
- mysql
- work
- lang_de
feature-img: assets/img/background/mysql.jpg
---
"Ich muß Hardware für einen Rechner kaufen, auf dem dediziert nur ein MySQL laufen soll. Was soll ich beschaffen?" ist eine Frage, die ich recht oft höre. Hier ist die lange Antwort.

Bevor man sich mit dem freundlichen Hardwarehöker des geringsten Mißtrauens in Verbindung setzen kann, muß man sich erst einmal ein paar Dinge überlegen.

## Datenbank-Zielgröße bestimmen

Die allererste Überlegung ist die erwartete Zielgröße der Datenbank: Werden wir einen Bestand von 1G, 10G, 100G oder 1000G haben? Daraus und aus dem allgemeinen Gesundheitszustand des Geldbeutels ergibt sich schon die erste wichtige Erkenntnis. Nämlich: Werden wir es schaffen, eine speichergesättigte Datenbank zu bauen, oder bekommen wir eine Datenbank, die für Lesezugriffe auf die Platte zugreift?


### Folgerung 1: Speichergesättigte Datenbanken sind ein bevorzugtes Designziel

Mechanische Festplatten sind unerträglich langsam. 

Speicher-Zugriffszeiten werden in Nanosekunden angegeben. Milli (10E-3), Mikro (10E-6), Nano (10E-9), Pico (10E-12), Femto (10E-15), Atto (10E-18) - Speicher hat also Zugriffszeiten in der Größenordnung von einer Millardstelsekunde pro Byte. Platten-Zugriffszeiten liegen dagegen im Bereich von Millisekunden, wenn Seeks involviert sind. Von einer durchschnittlichen Serverplatte kann man nicht mehr als 200 Seeks pro Sekunde (5ms pro Zugriff) erwarten, die 7200rpm Hitachi HTS72108 in meinem Laptop schafft nach iozone und iostat ziemlich genau 125 Seeks pro Sekunde (8ms pro Zugriff).

In diese Zeit geht die Average Seek Time für die horizontale Positionierung des Kopfes und die Rotational Delay mit ein - also die Zeit, die wir warten müssen, bis die richtigen Daten unter dem fertig positionierten Kopf auch mal durchrutschen. Die Datentransferzeit zur tatsächlichen Übertragung der Daten ist im Vergleich dazu eher zu vernachlässigen.

Andererseits hat eine Platte im Vergleich zum RAM eine größere Zugriffsgranularität - während wir beim RAM für jedes Byte eine Access Time abrechnen, tun wir das bei einer Platte für einen Block (512 Byte, aber wir können hier gerne mit 1000 Byte rechnen, es spielt nicht wirklich eine Rolle). Im Endeffekt ist der Geschwindigkeitsunterschied zwischen RAM und Random-I/O einer Festplatte jedenfalls nicht 1E6 (eine Million), sondern nur etwa 1E4 (Zehntausend) bis 1E5 (Hundertausend), abhängig davon wie breit unsere Rows im Schnitt sind.

Wird eine Platte nicht mit Random-I/O betrieben, sondern mit linearer Ein-/Ausgabe, dann können wir so um die 50 MB/sec von einer Platte bekommen. Je nach Rowsize sind das zwischen Hundertausend und einer Million Rows pro Sekunde. Das ist immer noch langsamer als RAM, aber viel schneller als die im pessimalen Fall 200 Rows/sec vom Random-I/O (Hmm, auch da kommen wir noch drunter, wenn wir auch den Index nicht cachen können).

Wenn es einem also gelingt, speichergesättigte Datenbanken zu bauen, dann sind Reads für viele Anwendungsfälle schon kein Problem mehr und teilweise fällt sogar schlechtes SQL nicht mal mehr auf, weil die entsprechenden Operationen zwar ineffizient sein mögen, aber dank schnellem RAM-Zugriff dennoch schnell genug sind.

### Folgerung 2: 64 Bit sind Mandat

MySQL hat eine Ein-Prozeß-Architektur. Ein einzelner Datenbankserver enthält eine Reihe von datenbankinternen Service-Threads und einen Handlerthread pro Connection, die sich alle den gemeinsamen Speicher des Prozesses teilen.

Wir brauchen also nicht nur jede Menge RAM, sondern wir brauchen das RAM auch in einer Form, die es uns erlaubt, innerhalb eines einzelnen Prozesses darauf zugreifen zu können. Das bedeutet in 2007: Eine 64 Bit CPU, ein 64 Bit Betriebssystem und eine 64 Bit Version von MySQL, falls wir Speicher von mehr als 3G (in Windows: 2G) im Server haben.

32 Bit-Code kann in Linux nur etwas unter 3G in einem Prozeß adressieren, und in Windows sind es sogar nur etwas unter 2G. Es ist also vollkommen sinnlos, einen Rechner mit 8G RAM hinzustellen und dann nur ein 32 Bit-Betriebssystem und ein 32 Bit-MySQL drauf zu installieren. Das gibt zwar einen schönen File System Buffer Cache und das ist besser als nix, aber es wäre sehr viel interessanter, den Speicher direkt in MySQL zur Verfügung zu haben. Ein Datenbankserver wird also immer fett RAM bekommen und das zieht dann relativ schnell die 64 Bit nach sich.

Es gibt zwar so was wie 
[PAE](http://en.wikipedia.org/wiki/Physical_Address_Extension)/
[AWE](http://en.wikipedia.org/wiki/Address_Windowing_Extensions), aber reden wir da nicht drüber - wir haben 2007, und es gibt keinen Grund, mit gefesselten Beinen über die Ziellinie zu hüpfen, wenn man stattdessen richtig rennen kann. Es gibt zwar PAE-Code in MySQL, aber der ist per Default nicht enabled, in den MySQL-eigenen Binaries nicht vorhanden und schlecht getestet. Selbst wenn das alles anders wäre, würde man PAE nicht wollen, sondern gleich richtig 64 Bit machen wollen - PAE ist langsam und hat haarige Tatzen.

### Schreibleistung vs. Leseleistung

Eine andere Sache, die man sich frühzeitig bewußt machen muß ist die Überlegung, daß Leseleistung sehr viel leichter zu optimieren ist als Schreibleistung.

Datenbanken, die überwiegend Reads sehen und wenig Schreiboperationen haben sind sehr leicht zu skalieren: Wir ersticken das Problem nach Möglichkeit erst einmal mit Speicher und wenn das nicht mehr reicht, setzen wir eine ausreichende Anzahl von Replication-Slaves auf. Die Reads verteilen wir dann gleichmäßig über die Slaves. Das können wir je nach Problemgröße leicht bis auf 1000 Slaves pro Master ausdehnen, wenn wir wollen.

Writes dagegen sind sehr viel unhandlicher. Wir können Schreibzugriffe zwar Delayen, Batchen und Sortieren, aber am Ende muß der Write auf irgendein persistentes Medium. Wenn wir mehr Schreibzugriffe haben als eine Platte wegstecken kann, dann müssen wir ein Array hinstellen. Wenn wir mehr Schreibzugriffe haben als man sinnvoll über ein Array verteilen kann, dann müssen wir die Datenbank partitionieren mit all den unangenehmen Designentscheidungen, die mit solchen 
[verteilten, lose gekoppelten Systemen]({% link _posts/2006-07-30-leben-mit-fehlern-der-schl-ssel-zum-scaleout.md %}) einher gehen.

### Folgerung 3: Locality erzeugen um Schreibzugriffe zu minimieren

Datenbanken speichern Daten in Speicherseiten ab. In InnoDB zum Beispiel ist eine solche Speicherseite mit 16K relativ groß. In einer solchen Seite liegen in der Regel mehrere Rows, und InnoDB liest und schreibt immer ganze Seiten.

Wenn wir unsere Datenbank gut designed haben, dann haben wir Locality Of Reference erzeugt. Das bedeutet, daß wir ziemlich oft den Fall haben, daß die Rows, die wir zur gleichen Zeit bearbeiten auch räumlich dicht gepackt sind, also in derselben Speicherseite stehen. Das bedeutet, daß wir mit dem ersten Zugriff auf eine neue Seite schon die Rows, auf die wir gleich zugreifen werden mit in den Speicher bringen und daß wir beim Schreiben wahrscheinlich eine Seite nicht nur einmal verändern, sondern mehrere Rows in der Seite verändern werden.

Wir wissen, daß InnoDB Daten im Primary Key in B+-Bäumen abspeichert, d.h. in den Blättern des Primary Key stehen die Daten selbst, nicht Zeiger auf die Daten. Daten sind also physikalisch in Primary Key-Reihenfolge angeordnet und Daten mit einem ähnlichen Primary Key stehen wahrscheinlich physikalisch dicht zusammen auf der Platte. Sekundärschlüssel enthalten eine Kopie des Primary Key als Row Pointer. Ein "INDEX(a)" wird von InnoDB also intern als "INDEX(a, id)" interpretiert und realisiert. InnoDB und der Optimizer wissen das auch, und ein "SELECT id FROM t WHERE a = ..." wird entsprechend aus dem Sekundärschlüssel ohne Primärdatenzugriff abgearbeitet.

Mit diesem Wissen können wir jetzt über die Wahl des Primärschlüssels einer InnoDB-Tabelle die physikalische Anordnung von Daten in einer InnoDB-Tabelle beeinflussen und die Locality verbessern.

- Oft erzeugen hierarchische Primärschlüssel ausgezeichnete Locality. In einer Tabelle, die Mails für einen Maildienst verwaltet wäre (userid, folderid, messagenummer) zum Beispiel ein sehr guter Primärschlüssel für die Mailtabelle, weil Informationen über neue Mails im aktuellen Folder des aktuellen Users dicht beieinander gespeichert werden.
- Ein _INTEGER UNSIGNED NOT NULL PRIMARY KEY auto_increment_ erzeugt eine zeitliche Reihung von Daten nach dem Erzeugungsdatum und das ist für viele Daten, die neu heiß sind und dann mit der Zeit abkühlen genau der richtige Schlüssel.
- Ein Zufallswert, ein MD5 oder SHA1-Hash oder eine UUID ist ein furchtbarer Primärschlüssel, weil Daten im Endeffekt zufällig gestreut werden und keine Locality erzeugt werden kann.

Locality ist nicht nur für Schreibleistung wichtig, sondern auch wenn wir eine Datenbank haben, die nicht speichergesättigt sein kann und wir Lesezugriffe zur Disk senden müssen. Mit einer guten Locality können wir unter Umständen viele Lesezugriffe im RAM cachen auch wenn die Gesamtdatenbank sehr viel größer als der Verfügbare Hauptspeicher ist.

### Folgerung 4: Beschriebene Rows schmal halten um Schreibzugriffe zu minimieren

Schreibzugriffe ändern Seiten. Wenn wir eine gute Locality haben und wir außerdem Schreibzugriffe von beschriebenen Seiten zur Disk verzögern können, dann werden wir viele Rows in einem Block ändern können, bevor wir diesen Block zur Disk senden. Indem wir die Rows von Tabellen schmal halten, die beschrieben werden, bekommen wir mehr Rows in einen Block und haben so weniger Schreibzugriffe.

Wenn wir zum Beispiel eine Benutzertabelle haben, dann enthält diese überwiegend statische Daten wie zum Beispiel den Benutzernamen, das Paßwort, die Benutzeranschrift und andere Stammdaten. Sie enthält aber vielleicht auch sehr dynamische Daten wie zum Beispiel das Datum des letzten Logins. Datenbanktheoretisch gehört diese Information auch in die User-Tabelle, aber wegen der physikalischen Implementierung wird es sehr sinnvoll sein, eine künstliche 1:1 Relation einzuführen und das Paar (userid, lastlogin) in eine Extratabelle abzuspalten. 

Hier haben wir nun 8 Byte breite Rows in 16K großen Records, also bis zu 2048 Records pro Speicherseite (in Wirklichkeit wird die Seite nicht vollständig genutzt sein) oder ca. 500-700 stark veränderliche Speicherseiten (8M-12M) für die Lastlogindaten von einer Million Usern. Wenn man einen Usereintrag von um die 300 Byte inklusive Stammdaten annimmt, dann würden eine Million User ohne diese Aufspaltung stattdessen um die 18000-25000 (280M-400M) veränderliche Seiten erzeugen, d.h. wir hätten etwa 36 mal mehr veränderte Speicherseiten zu schreiben, nur weil die veränderlichen Daten weniger dicht gepackt sind.

Dazu kommt, daß jeder Schreibzugriff auch alle Resultsets im MySQL Query Cache löscht, die von der beschriebenen Tabelle abstammen. Indem man häufig beschriebene Daten in Extratabellen isoliert bekommt man unter Umständen eine bessere Query Cache Hit Ratio und so bessere Performance.

Aus dem gleichen Grund und noch einigen anderen Gründen will man auch unbedingt alle Spalten abtrennen, in denen Typen verwendet werden, die "TEXT" oder "BLOB" im Namen haben. Zu den "anderen Gründen" gehört hier in MySQL auch die Handhabung von "temp tables" in Queryplänen, bei denen "using temporary" bei _EXPLAIN_ gelistet wird.

### Folgerung 5: Writes delayen, batchen und sortieren

Bei einem COMMIT schreibt InnoDB die geänderte 16K Seite nun nicht sofort zurück in den Tablespace, sondern notiert die Änderung erst einmal im Redo-Log und markiert die InnoDB-Seite als Dirty. Später wird die Dirty Page zur Disk gesendet und der entsprechende Redo-Log Pointer kann vorwärts bewegt werden um den Platz im Redo-Log wieder frei zu geben.

Dadurch, daß alle Änderungen so erst einmal im Redo-Log landen, werden Schreibzugriffe, die eigentlich Random-Writes wären vorübergehend erst einmal als Lineare Writes abgehandelt: Wir hatten weiter oben ja schon etabliert, daß lineare Writes schneller sind. Außerdem spekuliert diese Aktion natürlich darauf, daß eine eben veränderte InnoDB Seite wegen Locality gleich noch einmal geändert wird und wir so Random I/O-Schreibzugriffe einsparen können.

Wir können Locality abschätzen, indem wir die Größe des Redo-Logs mit der Menge der Pages vergleichen, die dirty sind. In _SHOW ENGINE INNODB STATUS\G_ finden wir: 

```console
---
LOG
---
Log sequence number 0 1994670731
Log flushed up to   0 1994670268
Last checkpoint at  0 1993477319
...
----------------------
BUFFER POOL AND MEMORY
----------------------
...
Modified db pages  278
```

Unser Redo-Log hat also bisher Null (0) Umdrehungen gemacht, und der Schreibzeiger steht bei Offset 1994670731, während der hintere Lesezeiger bei Offset 1993477319 steht. Es sind also 1994670731-1993477319 = 1193412 (ca. 1.1M) Redo Log belegt. Dem stehen 278 16K große Seiten (ca. 4.4M) gegenüber, die als Dirty markiert sind. Wenn es uns gelingt, durch Umstrukturierung dieses Verhältnis zu verbessern, also die Anzahl der Seiten, die als Dirty markiert werden zu verkleinern, dann bekommen wir weniger Random-I/O und eine bessere Schreibleistung.

MySQL wird die "modified db pages" dann verzögert und im Batch auf die Platte schreiben, wenn 

- das Redo-Log droht, vollzulaufen
- _innodb_max_dirty_pages_pct_ Prozent aller Pages im Buffer Pool als Dirty markiert sind
- oder InnoDB eine Pause zum Atemholen bekommt und einen Checkpoint fährt.

Das Schreiben der Dirty Pages erfolgt derzeit [leider noch nicht sortiert](http://www.mysqlperformanceblog.com/2007/07/18/how-innodb-flushes-data-to-the-disk/), obwohl das echt nützlich wäre.

Wir können uns, wenn uns unsere Daten nicht so wichtig sind, sogar noch die Writes ins Redo-Log delayen. Indem wir innodb_flush_log_at_trx_commit auf den Wert 2 oder gar 0 setzen, erlauben wir es der Datenbank auch Einträge ins Redo-Log zu verzögern und zu batchen und können so die Schreibleistung noch weiter erhöhen.

### Folgerung 6: Mehr Spindeln

Wir können so mit verschiedenen Tricks bei der Gestaltung des Datenbankschemas die Anzahl der notwendigen Schreibzugriffe unter Umständen drastisch verringern und wir können uns mit Hilfe des Redo-Log unter Umständen einige Random-I/Os sparen, indem wir stattdessen vorübergehend lineare Schreibzugriffe machen. Am Ende aber müssen die Blöcke auf die Platte.

Eine einzelne Platte, so haben wir gelernt, gibt uns nicht mehr als 200 Seeks pro Sekunde. Auch ein RAID-1 Paar bekommt nicht mehr Daten auf die Platte, da ja jede Hälfte des Spiegelpaares dieselben Operationen durchführen muß. Von 14 Platten in einem RAID-10 (einem Stripe aus Mirrors) würden wir also ca. 7 mal 200 Seeks/sec = 1400 Seeks/sec erwarten.

In einem RAID-5 ist es weitaus schlechter. Da Datenbanken ausschließlich RAID-5 "Short Writes" machen, wird jede einzelne logische Schreiboperation zu vier physikalischen Schreiboperationen: Zwei Reads und zwei Writes. Mit einem großen Cache kann man die beiden Reads weg cachen, aber die beiden Writes bleiben. Hat der RAID-5 Controller außerdem einen großen batteriegepufferten Cache, kann es sein, daß auch die Schreibzugriffe in akzeptabler Zeit abgewickelt werden, aber die sichere Empfehlung für eine Datenbank ist in der Regel "RAID-5 ist böse, man will RAID-10".

Für eine Datenbank wollen wir also ein Plattenarray kaufen, daß aus möglichst vielen kleinen Disks zusammen gesetzt ist - uns interessiert ausschließlich die Anzahl der Seeks pro Sekunde, die wir von dem Array bekommen können. MB/sec sind von untergeordneter Bedeutung.

Die Sun Performance Blueprint [Wide Thin Disk Striping](http://www.sun.com/blueprints/1000/layout.pdf) erklärt wie man mit Partitionen auf Arrays umgehen sollte: Sie sollten sich immer über alle vorhandenen Platten des Array erstrecken und es sollten _keine_ dedizierten Disks für Logs, Indices oder einzelne Tabellen verwendet werden. Ab 6 Platten wird diese Strategie sinnvoll, ab 10 Platten ist sie dedizierten Disks auf jeden Fall überlegen. 

In großen Arrays will man sich nicht mehr mit Disks abgeben, sondern "Storage managen" - Partitionen sollten daher immer über alle Disks gehen und das Array gleichmäßig aufheizen, sodaß man keine Hotspots mehr bekommt. Wenn das Array überlastet wird, kauft man dann eben einfach mehr Platten und reorganisiert. _sar -d_, _iostat -x_ oder _dstat_ sind des Storage- und des Datenbankadmins treue Freunde. Man sollte eine gewisse Nähe zu ihnen aufbauen.

### Folgerung 7: Software-Raid ist nix schlimmes

Wenn wir ein RAID-10 bauen, dann ist die Realisierung des RAID sehr wenig aufwendig: Ein Write-Request wird einfach zu zwei verschiedenen Platten gesendet und endet erst dann, wenn beide Platten ihn bestätigt haben. Das ist sehr leicht in Software realisieren. Ein Hardware-RAID bringt hier nur wenig Gewinn.

Bei RAID-5, wenn man durch äußere Umstände dazu gezwungen wird, sieht da schon anders aus: Die meisten Software-RAID-5 Implementierungen sind ziemlich schäbig und RAID-5 profitiert ganz enorm von einem batteriegepufferten RAM als Cache. Hier ist ein (guter, teurer) RAID-Controller mit einem fetten batteriegepufferten Cache wahrscheinlich von Vorteil.

Ein Software-RAID hat gegenüber einem Hardware-RAID dann verschiedene Vorteile: Zum Beispiel braucht man sich nicht mit einem proprietären Treiber zu prügeln, kann das RAID zuverlässig über /proc/mdstat in Linux oder das entsprechende Windows-Äquivalent monitoren und kann zumindest in Linux auf die einzelnen Platte auch nach dem Splitten des Mirrors einzeln ohne RAID zugreifen, da Linuxraid die Metadaten hinten auf die Platten malt - eine RAID-Hälfte ohne RAID sieht dann zumindest read-only für einen Nicht-RAID-Zugriff ganz normal aus.

Sogar [multipathen](http://michael.fuckner.net/me/blog/index.php?/archives/367-SAS-Raid-mit-multipathing-unter-Linux.html) kann man das.

### CPU Leistung verblaßt neben Plattenleistung

Die oben angestellten Betrachtungen haben an keiner Stelle die Leistung der Prozessoren des Systems gewürdigt. Das ist deswegen so, weil Datenbanken in der Regel kaum CPU-Probleme haben. Eine CPU mit 3 GHz Takt arbeitet pro Sekunde und Core 3 Milliarden Prozessorzylen ab, und moderne CPUs sollten eigentlich größenordnungsmäßig bei jedem Zyklus auch einen Befehl fertigstellen. Wenn man also von Disk Seeks von einer 200stel Sekunde ausgeht, dann werden in der Wartezeit auf die Platte um die 15 Millionen Wartezyklen pro Core in der CPU freigesetzt.

Oder anders gesagt: Eine Datenbank kann nur in zwei Fällen wirklich CPU-Probleme bekommen: 

- >Wir haben etwas ganz wildes mit Stored Procedures oder anderem Code in der Datenbank gemacht. Das hätten wir besser gelassen.
- Die Datenbank ist speichergesättigt und fräst nun wie wild mit der CPU durch ihre Speicherbänke, weil sie niemals auf die Platte warten muß. Klagen über "CPU ausgelastet" sind in diesem Fall wahrscheinlich Beschwerden auf sehr hohem Niveau.

In MySQL ist es außerdem so, daß wir in der Regel eine Query in einem Thread abarbeiten und wir eine bestimmte Menge an Concurrency benötigen, um ausreichend viele CPUs sättigen zu können.

Insbesondere Replikation ist derzeit strikt seriell und kann nicht nennenswert mehr als einen Thread belegen.

### Folgerung 8: Ein reiner Backup-Slave braucht nur einen, maximal 2 Cores

Da Replikation strikt seriell ist, kann ein Slave der nur repliziert und nicht auch noch Read-Queries abarbeitet oder Reports generiert niemals nennenswert mehr als einen Core busy halten. Es lohnt überhaupt nicht, hier viel Geld in Cores zu investieren. RAM oder Platten sind bessere Investitionsziele.

### Folgerung 9: Concurrency schätzen, und begrenzen

MySQL ist eine Datenbank die klar auf Commodity Hardware hin entwickelt worden ist und die durch die überall verfügbare und leicht zu konfigurierende Replikation bevorzugt horizontal zu skalieren ist. Es ist in vielen Fällen eher lohnend, einen zweiten Server aufzusetzen statt den einzigen Server weiter zu vergrößern.

MySQL funktioniert derzeit recht gut mit 4 oder 8 Cores, aber 16 Cores wären schon grenzwertig und es wäre zu beweisen, daß eine 16 Core-Maschine mit MySQL tatsächlich besser funktioniert als zwei 8 Core-Maschinen. Speichergrößen von 32G und 64G können gut gehandhabt werden, aber für wesentlich größere Pools müßte nachgewiesen werden, daß keine Lockingprobleme existieren. Mit MySQL 5.0.30 und MySQL 5.0.37 wurden verschiedene Lockingprobleme für sehr große InnoDB Buffer Pools behoben, sodaß es unbedingt lohnend ist ein Upgrade durchzuführen wenn man sehr große Speichermengen hat und noch kleinere Versionen einsetzt. Aber selbst dann kann [intensives Monitoring](http://www.mysqlperformanceblog.com/2007/07/27/more-gotchas-with-mysql-50/) noch Locking triggern. Dieses Problem wird derzeit bearbeitet.

### Recovery gleich mit planen

Im Falle einer Katastrophe oder eines Administrationsfehlers wird der eigene Chef rüberkommen und die üblichen drei Fragen haben: 

- Werden wir wieder online gehen können?
- Haben wir Daten verloren?
- Wie lange wird das alles dauern?

Der vorausschauende Admin hat für alle drei Fragen schon Antworten parat. Das kann er nur, wenn er die Recovery seiner Datenbank geplant, geübt und gebenchmarkt hat.

### Folgerung 10: Platz um sich zu bewegen

Ein Backup-Slave, so vorhanden, sollte genug Platz und Power haben, um eine Recovery in endlicher Zeit durchführen zu können. In den meisten Fällen plant man 3 bis 5 mal mehr Plattenplatz ein als die Datenbankzielgröße ist. Teile dieses Platzes können langsamer sein (weniger Spindeln haben, also aus größeren Platten zusammengesetzt sein) als die eigentliche aktive Datenbank.

Ein Test- oder Scratchrechner, etwa der Backup-Slave oder eine dritte Kiste, können sehr handlich sein, um Dinge zu testen, Datenextraktionen oder Loads vorzubereiten oder andere administrative Dinge zu stagen.

## Der Einkaufszettel

Schätzhilfen: 

- Die Zielgröße der Datenbank.
- Die erwartete Schreiblast.

Prüfung: Lohnt es eine speichergesättigte Datenbank zu bauen?

**Ja:** Dies ist der Fall, wenn wir die benötigten Daten komplett ins RAM bekommen und die Schreibrate angemessen niedrig ist.

In diesem Fall stecken wir alles Geld ins RAM und bauen Platten an die Datenbank, um die Schreibrate zu bewältigen und um unseren RAM-Cache beim Hochfahren voll zu saugen. Wir brauchen aber unter Umständen keine dicken Arrays mit vielen Spindeln.

**Nein:** Wenn wir eine hohe Schreibrate haben oder unser Datenbestand so dick ist, daß wir mit den üblichen RAM-Größen keine Chance haben das alles weg zu cachen, nehmen wir das RAM eine Größe kleiner und stecken das frei werdende Geld in ein dickes Array mit vielen Spindeln. Das Array setzen wir als RAID-10 auf.

Je nach zu erwartendem Grad von Concurrency bauen wir uns ein 2, 4 oder 8-Core-System. Richtig spannend wird die CPU-Nutzung aber aller Voraussicht nur bei speichergesättigten Datenbanken oder in spezialgelagerten Sonderfällen.

Weil wir erwarten mehr als 2-4G Speicher zu verwenden, achten wir darauf, daß die CPU, das Betriebssystem und die Datenbank in 64 Bit-Versionen installiert werden.

Konfigurationen, die ich beim Kunden gesehen habe waren etwa Dell 1950 mit einem MD1000 oder MD3000 hinten dran, HP DL 385 und DL 585 mit einem oder zwei MSA 30 hinten dran oder ähnliche Kisten von anderen Herstellern. Davor liegende Webserver waren oft Blades, zum Teil ohne Platten, mit 2G RAM und 32 Bit Betriebssystemen - für Webserver ist dies idR ausreichend und hier ist ein breites Array von Servernodes wichtiger als leistungsstarke einzelne Knoten, sobald die Latenz bei der Abarbeitung der Requests niedrig genug ist.