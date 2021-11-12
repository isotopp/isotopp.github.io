---
author-id: isotopp
date: "2007-10-31T18:30:45Z"
feature-img: assets/img/background/mysql.jpg
tags:
- database
- mysql
- lang_de
title: "Bug #31876: MySQL Commit in Windows"
---

 
[Bug #31876](http://bugs.mysql.com/bug.php?id=31876):
Neulich war ich bei einem Kunden, der ein kleines Testscript hatte, das im wesentlichen 500 Mal hintereinander eine Row in eine InnoDB-Tabelle eingefügt hat, und dann ein Commit gesendet hat.
Das Script war unter Linux unmöglich schnell, und unter Windows unmöglich langsam - insbesondere war es unter Windows viermal langsamer als dasselbe Script unter DB/2 und MS SQL Server. 
Das ist natürlich verdächtig und nicht akzeptabel.

Was macht man, wenn man ein Performance-Problem hat?
Richtig, man misst nach.
Hier wollten wir erst einmal sehen, was MySQL denn so mit dem Betriebssystem macht, wenn es committed.
Dazu brauchen wir so etwas wie einen Systemcall-Monitor für Windows.
Das gibt es zum Glück, und zwar bei der von Microsoft aufgekauften Firma 
[Sysinternals](https://docs.microsoft.com/en-us/sysinternals/downloads/) von Mark Russinovich.
Wir messen also mit FileMon und ProcMon, was genau MySQL da tut.

Mit `innodb_flush_log_on_trx_commit = 1` sehen wir dann im FileMon die folgende Ausgabe:

```console
94      14:43:22        mysqld-nt.exe:2736      WRITE   C:\Programme\MySQL\MySQL Server 5.0\data\ib_logfile0    SUCCESS Offset: 2258432 Length: 1024
95      14:43:22        mysqld-nt.exe:2736      FLUSH   C:\Programme\MySQL\MySQL Server 5.0\data\ib_logfile0    SUCCESS
96      14:43:22        mysqld-nt.exe:2736      WRITE   C:\Programme\MySQL\MySQL Server 5.0\data\ib_logfile0    SUCCESS Offset: 2258944 Length: 512
97      14:43:22        mysqld-nt.exe:2736      FLUSH   C:\Programme\MySQL\MySQL Server 5.0\data\ib_logfile0    SUCCESS
```

Mit anderen Worten: Für jede Transaktion ruft MySQL einmal `WriteFile()` und einmal `FlushFileBuffers()` auf.

Konfiguriert man auf `innodb_flush_log_on_trx_commit = 2` um, bekommt man

```console
101     14:35:55        mysqld-nt.exe:548       WRITE   C:\Programme\MySQL\MySQL Server 5.0\data\ib_logfile0    SUCCESS Offset: 1638912 Length: 1024
102     14:35:55        mysqld-nt.exe:548       WRITE   C:\Programme\MySQL\MySQL Server 5.0\data\ib_logfile0    SUCCESS Offset: 1639424 Length: 512
```

Das heißt, die `WriteFile()`-Aufrufe finden weiter statt, die `FlushFileBuffer()`-Aufrufe entfallen aber.

In InnoDB ist das nicht ACID, weil die `WriteFile()`-Aufrufe die Daten nur vom MySQL-Prozess in den Windows Filesystem Buffer Cache kopieren, aber nicht von dort auf die Platte, und das kann man am Blinken der HDD-LED auch sehen.

Spielt man dasselbe Spiel mit einem DB/2 auf Windows, sieht man

```
408     15:05:10        db2syscs.exe:2020       WRITE   D:\Daten\Filis\DB2log\S0007531.LOG     SUCCESS Offset: 970752 Length: 4096
409     15:05:10        db2syscs.exe:2020       WRITE   D:\Daten\Filis\DB2log\S0007531.LOG     SUCCESS Offset: 970752 Length: 4096
```

DB/2 macht also auch nur `WriteFile()`-Aufrufe, und behauptet, das sei ACID! 
Mehr noch, am Blinken der Platten-LED kann man sehen, daß das auch wahrscheinlich der Fall ist.

Was ist also anders?
Sieht man sich die Sache mit ProcMon an, kann man sehen wie die Dateien in Windows mit dem Aufruf 
[CreateFile](http://msdn2.microsoft.com/en-us/library/aa363858.aspx)
und `dwCreateDisposition = OPEN_EXISTING` geöffnet werden.
Dabei gibt man dem Aufruf außerdem noch einen Haufen `dwFlagsAndAttributes` mit.
Uns sollen hier in erster Linie die Flags interessieren.

Normalerweise öffnet MySQL seine InnoDB-Daten- und Logfiles so: 

```
Sequence:       12795
Date & Time:    25.10.2007 11:01:33
Event Class:    File System
Operation:      CreateFile
Result: NAME COLLISION
Path:   C:\Programme\MySQL\MySQL Server 5.0\data\ib_logfile0
TID:    2688
Duration:       0.0000131
Desired Access: Generic Read/Write
Disposition:    Create
Options:        No Buffering, Synchronous IO Non-Alert, Non-Directory File
Attributes:     n/a
ShareMode:      Read
AllocationSize: 0
```

Das heißt, wie man in der Zeile `Options` sehen kann, `FILE_FLAG_NO_BUFFERING` ist angegeben.
Das ist schon mal gut, aber wie man sehen kann, sind immer noch `FlushFileBuffer()`-Aufrufe notwendig.
DB/2 und MS SQL Server dagegen machen das so, daß außerdem noch `FILE_FLAG_WRITE_THROUGH` angegeben wird (und ggf. auch noch `FILE_FLAG_RANDOM_ACCESS`), berichtet uns ProcMon hier.

Das bedeutet:
Brächte man InnoDB dazu seine Daten- und Logfiles mit diesen Flags zu öffnen, wären die `FushFileBuffers()`-Aufrufe nicht mehr notwendig (und mit `innodb_flush_log_on_trx_commit = 2` wären sie auch weg). 
Also patched man

```diff
===== innobase/os/os0file.c 1.121 vs edited =====
--- 1.121/innobase/os/os0file.c 2007-08-15 18:54:19 -04:00
+++ edited/innobase/os/os0file.c        2007-10-25 17:34:01 -04:00
@@ -1218,9 +1218,13 @@ try_again:
                        /* Do not use unbuffered i/o to log files because
                        value 2 denotes that we do not flush the log at every
                        commit, but only once per second */
+                       attributes |= (FILE_FLAG_WRITE_THROUGH
+                              | FILE_FLAG_RANDOM_ACCESS);
                } else if (srv_win_file_flush_method ==  SRV_WIN_IO_UNBUFFERED) {
-                       attributes = attributes | FILE_FLAG_NO_BUFFERING;
+                       attributes |= (FILE_FLAG_NO_BUFFERING
+                              | FILE_FLAG_WRITE_THROUGH
+                              | FILE_FLAG_RANDOM_ACCESS);
                }
 #endif
        } else if (purpose == OS_FILE_NORMAL) {
@@ -1232,7 +1236,9 @@ try_again:
                        commit, but only once per second */
                } else if (srv_win_file_flush_method == SRV_WIN_IO_UNBUFFERED) {
-                       attributes = attributes | FILE_FLAG_NO_BUFFERING;
+                       attributes |= (FILE_FLAG_NO_BUFFERING
+                              | FILE_FLAG_WRITE_THROUGH
+                              | FILE_FLAG_RANDOM_ACCESS);
                }
 #endif
        } else {

```

Wenn ich mich nicht sehr täusche ist `innodb_flush_log_on_trx_commit = 2` jetzt ACID und sehr viel schneller als die Write/Flush-Sequenz - sechs bis siebenmal schneller.
Das Blinken meiner Platten-LED sieht auch plausibel aus.

Dasselbe Verhalten beobachten wir nun auch mit dem Binlog:
`log-bin= ...` sorgt für `WriteFile()`-Aufrufe ins Binlog, und mit `sync_binlog = 1` kriegen wir nach jedem Write ein langsames Flush.
Besser wäre es, das `CreateFile()` für das Binlog zu finden und dort ebenfalls `FILE_FLAG_WRITE_THROUGH` zu machen. Damit wäre schon ein normales Binlog-Schreiben "sync" und schneller als die Write/Flush-Paare von `sync_binlog = 1`.

Versucht man denselben Benchmark mit Linux, kriege ich auf meinen Testsystemen übrigens vollkommene Unsinns-Zeiten raus.
Das liegt daran, weil

```
linux:~ # hdparm -I /dev/sda
...
        Enabled Supported:
           *    SMART feature set
                Security Mode feature set
           *    Power Management feature set
           *    Write cache
           *    Look-ahead
...
```

Der Write-Cache ist also bei dieser Platte enabled.
Für so einen ACID-Commit ist das eher nicht so gut. 

Mit 

```
linux:~ # hdparm -W0 /dev/sda

/dev/sda:
 setting drive write-caching to 0 (off)
```

ist Linux dann nicht nur genau so ACID wie Windows, sondern auch vergleichbar langsam. 
Und man bekommt auch bei einem `innodb_flush_method = fdatasync / O_DIRECT` plötzlich plausible Benchmark-Ergebnisse zurück.
Das nur mal an die Adresse derjenigen, die glauben, daß `O_DIRECT` nichts bringt (bis letzte Woche auch ich).
