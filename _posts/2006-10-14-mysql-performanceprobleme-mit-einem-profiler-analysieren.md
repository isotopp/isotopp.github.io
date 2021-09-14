---
layout: post
published: true
title: MySQL Performanceprobleme mit einem Profiler analysieren
author-id: isotopp
date: 2006-10-14 18:26:37 UTC
tags:
- mysql
- performance
- lang_de
feature-img: assets/img/background/mysql.jpg
---
[Oprofile](http://oprofile.sourceforge.net) ist ein Profiler. Und zwar einer, der die Performance Measurement Instrumentation verwendet, die in moderne CPUs eingebaut ist, wenn diese vorhanden ist. Der Profiler braucht also keine speziell für Profiling compilierten Binaries, sondern zieht sich statische Samples des Programmzählers aus dem laufenden System und analysiert diese: Es findet heraus, welcher Prozeß gerade aktiv ist, welche Bibliothek in diesem Prozeß gerade verwendet wird und wenn Symboltabellen vorhanden sind (Kein "strip" auf die Bibliothek oder das Programm angewendet), dann weiß Oprofile sogar, welche Funktion oder Methode gerade aktiv ist.

Das kann man auch auf ein laufendes MySQL anwenden. Dies hier zum Beispiel ist ein mysqld, der mit einem Haufen MyISAM Tabellen arbeitet und nicht zu busy ist. Man kann sehen, daß aus irgendeinem Grund sehr viel Zeit in memcpy verbracht wird:

```console
CPU: CPU with timer interrupt, speed 0 MHz (estimated)
Profiling through timer interrupt
samples  %        image name               symbol name
197404   22.4460  libc-2.3.4.so            memcpy
165764   18.8484  no-vmlinux               (no symbols)
76051     8.6475  mysqld.debug             _mi_rec_unpack
30059     3.4179  mysqld.debug             Query_cache::insert_into_free_memory_sorted_list(Query_cache_block*, Query_cache_block**)
17468     1.9862  mysqld.debug             get_hash_link
16767     1.9065  mysqld.debug             ha_key_cmp
14106     1.6039  mysqld.debug             MYSQLparse(void*)
```

Ein anderes Anwendungsbeispiel verwendet InnoDB mit Transaktionen und einer sehr hohen Load. Hier kann man das Problem sofort erkennen:

```console
CPU: AMD64 processors, speed 2396.91 MHz (estimated)
Counted CPU_CLK_UNHALTED events (Cycles outside of halt state) 
with a unit mask of 0x00 (No unit mask) count 100000
samples  %        image name               symbol name
1955062  34.3586  /usr/sbin/mysqld         Query_cache::insert_into_free_memory_sorted_list(Query_cache_block*, Query_cache_block**)
192481    3.3827  /usr/sbin/mysqld         my_strnncoll_binary
155920    2.7402  /usr/sbin/mysqld         MYSQLparse(void*)
125545    2.2063  /usr/sbin/mysqld         my_hash_sort_bin
95069     1.6708  /lib64/tls/libc.so.6     memcpy
79791     1.4023  /lib64/tls/libc.so.6     memset
```

Offensichtlich ist der Query Cache hier nicht sehr nützlich und tatsächlich: Kaum schaltet man ihn aus, wird der Benchmark 50% schneller.

Hier eine schnelle Kommandoübersicht:

- `yum install oprofile` (oder was immer das aktuelle System gerade als Paketmanager verwendet)
- `opcontrol --init` Kernel Modul wird geladen
- `opcontrol --setup --separate=lib,kernel,thread --no-vmlinux` 
Wir teilen dem System mit, wie es Daten sammeln soll. Das CentOS her hat kein vmlinux Kernel Image. Wenn jemand weiß wie man ein vmlinuz in ein vmlinux umwandelt, würde ich das gerne wissen.
- `opcontrol --start-daemon` Dann laden wir den Daemon vor, der die Performancedaten sammelt, damit es später die Meßdaten nicht verfälscht...
- `ps axuwww| grep opro` Schnell prüfen, ob der Daemon läuft...
- `opcontrol --start` Datensammlung starten
- `opcontrol --dump` Daten auf die Platte zwingen (sie werden sowieso in regelmäßigen Intervallen gedumpt)
- `opreport --demangle=smart --symbols --long-filenames --merge tgid $(which mysqld) | less` Und nun einen Report wie die beiden da oben erzeugen.
- `opcontrol --stop` Profiling anhalten
- `opcontrol --deinit` Daemon stoppen
- `opcontrol --reset` Gesammelte Daten löschen und den Plattenplatz wieder freigeben.