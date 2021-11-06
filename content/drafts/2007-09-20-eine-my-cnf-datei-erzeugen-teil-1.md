---
author-id: isotopp
date: "2007-09-20T21:56:32Z"
draft: true
feature-img: assets/img/background/rijksmuseum.jpg
tags:
- MySQL
- lang_de
title: Eine my.cnf Datei erzeugen (Teil 1)
---
<!-- s9ymdb:3519 --><img width="110" height="57" style="float: right; border: 0px; padding-left: 5px; padding-right: 5px;" src="/uploads/mysql_logo.serendipityThumb.gif" alt="" /> Was bisher geschah:
Wir hatten einen <a href="http://blog.koehntopp.de/archives/1775-Hardware-fuer-ein-MySQL.html">coolen neuen Server</a> für MySQL gekauft und <a href="http://blog.koehntopp.de/archives/1804-Eine-MySQL-Installation-planen.html">MySQL drauf installiert</a>.

Jetzt wollen wir das mal ein wenig durch konfigurieren: Was gehört alles in eine Serverkonfiguration?



[b]Basisdaten für den Server[/b]

Weil wird unseren Server mit einigen Verzeichnissen und Files in Pfaden betreiben, die nicht den eincompilierten Erwartungen des Servers entsprechen ist es lohnend, in der my.cnf als erstes einmal ein paar Pfadnamen festzunageln.

"basedir" ist dabei das Verzeichnis, in dem der Server sein "/bin/mysqld" erwartet, also etwa "/usr/local/mysql-enterprise-gpl-5.0.46-linux-i686-glibc23", wenn unser mysqld in "/usr/local/mysql-enterprise-gpl-5.0.46-linux-i686-glibc23/bin/mysqld" liegt.

"datadir" ist das Verzeichnis, unterhalb dessen wir die Datenbankdateien anlegen wollen. Falls wir oben wie vorgeschlagen "/mysql/data" angelegt haben, sollten wir nun "mkdir /mysql/data/produktion" erzeugen und das "chown -R mysql:mysql /mysql/data/produktion" nicht vergessen. Dieses Verzeichnis wird nun als "datadir" in die Konfiguration eingetragen.

Jeder Server braucht eine eindeutige Server-ID, damit es später bei Einsatz von Replikation nicht zu Problemen kommt. Die Server-ID ist eine frei wählbare 32-Bit-Zahl ohne Vorzeichen (aber einige fehlerhafte Tools haben Probleme mit Server-IDs größer als 2^31-1, sodaß es sinnvoll sein kann, solche Zahlen zu vermeiden. Noch besser wäre es aber, das entsprechende Tool reparieren zu lassen).

Außerdem sollten "port" und "socket"-Statements vorhanden sein, die die Portnummer und die Socketadresse festlegen, auf denen der Server lauscht. Wenn man den Server nicht von außen ansprechen können soll, weil etwa der Webserver auf derselben Maschine wie der Datenbankserver läuft, dann kann man auch bind-address = 127.0.0.1 festlegen. Für einen Cluster wird man stattdessen ein bind_address an die Virtual IP des geclusterten MySQL-Dienstes setzen wollen. Die Konfigurationsanweisung skip-networking ist überholt und wird durch bind-address = 127.0.0.1 ersetzt.


{{< highlight console >}}
basedir = /usr/local/mysql-enterprise-gpl-5.0.46-linux-i686-glibc23
datadir = /mysql/data/produktion
server_id = 3340
port= 3340
socket= /mysql/data/produktion/mysql.sock
bind-address = cluster1.intern.koehntopp.de
{{< / highlight >}}


[b]Optionen, die das Serververhalten ändern[/b]

Einige Optionen verändern das Verhalten des Servers grundsätzlich und können bei bestehenden Installationen nur nach Tests eingeführt werden. Bei einer Neuinstallation sind sie aber grundsätzlich empfehlenswert. Die Option "lower_case_table_names" erzwingt das Anlegen von Tabellen immer in Kleinbuchstaben. Dadurch verhält sich MySQL auf Unix mit case-sensitiven Dateisystemen kompatibel zu MySQL auf Windows und Mac mit case-insensitiven Dateisystemen. Für Entwickler, die auf ihrem Windows-Desktop entwickeln wird es so einfacher, ihren Code in eine Unix-Produktion zu exportieren.

Die Option "<a href="http://dev.mysql.com/doc/refman/5.0/en/server-sql-mode.html">sql_mode</a>" erlaubt es, den MySQL-Server mit strikterer Prüfung für Daten oder Syntax zu betreiben, die zu anderen Produkten anderer Hersteller etwas kompatibler ist. Die Variable erlaubt das Setzen einer Reihe von durch Komma getrennten Flags. Zudem steht eine Reihe vordefinierter Flag-Kombinationen zur Verfügung, die nach den Produkten benannt sind, zu denen sie Kompatibilität schaffen sollen. Wenn man es sich erlauben kann, sollte der Server mit den Optionen STRICT_ALL_TABLES, NO_AUTO_CREATE_USER, NO_AUTO_VALUE_ON_ZERO, NO_ENGINE_SUBSTITUTION, NO_ZERO_DATE, NO_ZERO_IN_DATE, ONLY_FULL_GROUP_BY betrieben werden. Der meiste Code da draußen funktioniert mit so strikten Optionen aber nicht, sodaß man unter Umständen Abstriche machen muß.

Die Option "default_storage_engine" legt fest, mit welcher Storage-Engine Tabellen erzeugt werden, bei denen am Ende keine ENGINE=-Clause angegeben ist.

[b]Zeichensätze[/b]


{{< highlight console >}}
lower_case_table_names = 1
sql_mode = STRICT_ALL_TABLES,NO_AUTO_CREATE_USER,\
     NO_AUTO_VALUE_ON_ZERO,NO_ENGINE_SUBSTITUTION,\
     NO_ZERO_DATE,NO_ZERO_IN_DATE,ONLY_FULL_GROUP_BY
default-storage-engine=MyISAM
{{< / highlight >}}


Seit Version 4.1 hat MySQL flexible Zeichensatzunterstützung. Die Details sind in den Artikeln <a href="http://blog.koehntopp.de/archives/1360-Zeichensatzaerger.html">Zeichensatzärger</a> und <a href="http://blog.koehntopp.de/archives/1424-MySQL-Zeichensatz-Grundlagen.html">MySQL Zeichensatz-Grundlagen</a> genauer erklärt. Mit der Option "character_set_server" wird der Default-Zeichensatz des Servers festgelegt - dieser Zeichensatz wird an CREATE DATABASE-Statements vererbt, bei denen der Zeichensatz nicht explizit angegeben wird. Entsprechend legt "collation_server" die Default-Collation fest, die an solche CREATE DATABASE-Statements vererbt wird.

In keinem Fall sollte ein Multibyte-Zeichensatz als Default für den Server oder irgendeine Datenbank eingestellt werden, denn dies würde bei temporären Tabellen zu sehr viel Speicherverbrauch führen: Temporäre Tabellen versucht der Server als MEMORY-Tabellen zu realisieren, wenn möglich. Da MEMORY aber keine VARCHAR kennt, werden alle VARCHAR der temporären Tabelle zu CHAR. Ein "VARCHAR(255) CHARSET utf8" in einer temporären Tabelle belegt also 765 Byte pro Row. Aus demselben Grund ist es übrigens sinnvoll, VARCHAR(255) zu vermeiden und alle VARCHAR immer nur so lang wie unbedingt notwendig zu definieren - die temporären Tabellen werden so sehr viel kleiner.

Da MySQL Zeichensätze individuell für jedes Column-Objekt festlegen kann und Columns außerdem nachträglich von einem Zeichensatz ohne Datenverlust in einen anderen konvertieren kann, ist ein solcher Singlebyte-Zeichensatz kein Problem. Spalten, die Benutzereingaben aufnehmen sollen, die Zeichen enthalten können, die sich nur in utf8 darstellen lassen, können einzeln explizit als utf8 deklariert werden oder nachträglich in solche umgewandelt werden. Der Singlebyte-Zeichensatz als Default sorgt aber für sichere und sparsame Defaults.


{{< highlight console >}}
character_set_server = latin1
collation_server = latin1_german1_ci
{{< / highlight >}}


[b]Filehandles und Table Cache[/b]
MySQL legt Daten in Dateien ab. Je nach gewählter Konfiguration und Schemadefinition werden dabei zum Teil sehr viele Files angelegt und geöffnet. Das Limit des Betriebssystems liegt bei Linux bei 1024 gleichzeitig offenen Files - dies ist für viele Anwendungen zu wenig. Mit der Konfigurationsvariablen "open_files_limit" wird dieses Limit beim Serverstart hochgesetzt. Ein gnadenloses "open_files_limit = 32768" ist zumindest bei Linux kein Problem und empfehlenswert.

Beim Öffnen einer Tabelle liest MySQL die Format-Datei der Tabelle (".frm"-Datei) ein, parsed sie und cached diese Definition. Außerdem wird das Filehandle zu der geöffneten Tabelle ebenfalls gecached. In MySQL bis Version 5.0 sind beide Caches noch gekoppelt und über die Variable "table_cache" kontrollierbar. Der Table Cache ist dabei in der Größe durch das open_files_limit beschränkt. Wenn man kann, sollte man den table_cache so groß machen, daß er größer als die Anzahl der aktiv verwendeten Tabellen im System ist.


{{< highlight console >}}
open_files_limit = 32768
table_cache = 2048
{{< / highlight >}}


[b]Threads und Thread Cache[/b]

Immer wenn eine Verbindung zu MySQL aufgebaut wird, erzeugt MySQL einen Connection Handler Thread, der anfangs etwa 200K Speicher verbraucht (network_buffer (16K) + thread_stack (192K)). Der Thread arbeitet die Anfragen des Clients ab, und wird beendet wenn der Client sich abmeldet. Während MySQL mit schnellen und häufigen Connects und Disconnections auch ohne Optimierungen recht gut zurecht kommt, kann man das Verhalten des Servers noch verbessern indem man einen Thread Cache einrichtet. Dies ist ein Pool von bestehenden Threads ohne aktiven Client, die einem neuen Client sehr schnell zugewiesen können. Auf diese Weise wird ein MySQL Server in etwa so schnell wie ein LDAP-Server, was den Umgang mit transienten Verbindungen angeht.

In einer JDBC-Verbindung oder einem anderen Umfeld mit Connection Pools ist der Thread Cache nutzlos und eine (zugegeben kleiner) Verschwendung von Ressourcen. In einem Umfeld, das nicht poolt und ständig Verbindungen auf- und abbaut, etwa eine typische PHP-Umgebung, ist er sinnvoll dimensioniert recht nützlich.


{{< highlight console >}}
 # JDBC
thread_cache_size = 8
# PHP (für PHP gerne auch mehr)
# thread_cache_size = 80
{{< / highlight >}}


[b]Logs[/b]

Unser Server soll alle Statements, die Daten verändern, in einer gesonderten Partition loggen - wir benötigen dies für Point-in-Time Recovery und daher sollen die Datenpartition und die Logpartition unabhängig voneinander kaputt gehen. Wir definieren also mit "log_bin" den Pfad zur Binlog-Partition. MySQL verwendet per Default den aktuellen Hostnamen als Namensbestandteil in allen Logfiles. Dies kann bei Umbenennungen des Servers oder in High-Availability-Konfigurationen zu sehr nervigen Problemen führen. Daher ist es dringend anzuraten in allen Logfiles einen fixen Dateinamen vorzugeben, der vom aktuellen Hostnamen unabhängig ist.

Der Binlog-Cache ist ein Stück Speicher, in dem wir Transaktionen im Speicher zusammenbauen bevor sie am Stück auf die Platte ins Binlog geflushed werden. Er sollte so groß sein, wie die SQL-Strings unserer Transaktionen zusammengenommen so sind. Der Default von 32K ist für die meisten Umfelder ganz okay.

Ein Binlog wird als Datei immer größer, bis es max_binlog_size überschreitet. Dann wird ein neues Binlog begonnen. Ein neues Binlog wird auch begonnen, wenn der Server ein FLUSH LOGS-Kommando ausführt oder wenn der Server neu gestartet wird. Immer dann prüft er auch, ob Binlog-Files existieren, die älter als "expire_binlogs_days" Tage alt sind und löscht diese. "sync_binlog" verlangt, daß wir das Binlog transaktionssicher schreiben - wenn wir das auf 1 setzen, wird der Server aber sehr, sehr langsam.


{{< highlight console >}}
log_bin=/mysql/log/produktion/mysql-bin
binlog_cache_size = 32K
expire_logs_days = 7
max_binlog_size = 100M
sync_binlog = 0
{{< / highlight >}}


Das globale Statement-Log wird mit "log" aktiviert und benannt. Da es alle Queries mitloggt, wird es sehr schnell sehr groß und kann durch das heftige Logschreiben auch den Server ausbremsen. Es sollte nicht aktiviert werden. Wer Queries mitloggen will, sollte sich stattdessen mit dem MySQL Proxy befassen.

Das Error-Log wird mit "log_error" aktiviert und benannt. Mit "log_warnings = 2" wird festgelegt, daß dort auch Warnungen mitgeschrieben werden.

Das Slow-Query-Log loggt alle Statements mit, deren Ausführung länger als "long_query_time" Sekunden dauert. Die Zusatzoption log_queries_not_using_indexes loggt genau dies, ebenfalls im Slow-Query-Log. Dies ist jedoch auf Produktionsservern nicht sinnvoll, auf einem Entwicklerserver dagegen oft hilfreich.

Schließlich bestimmen "tmpdir" und "slave_load_tmpdir" wo im Dateisystem der Server temporäre Tabellen und zu ladende Tempfiles ablegt. Es ist natürlich sinnvoll, solche Verzeichnisse auf das schnelle Array zu legen.


{{< highlight console >}}
#log=/mysql/log/produktion/full-query.log # do not use
log_error=/mysql/log/produktion/mysql.err
log_warnings=2

log_slow_queries=/mysql/log/produktion/mysql-slow.log
long_query_time=2
# log_queries_not_using_indexes =1 # not for production

tmpdir=/mysql/log/tmp
slave_load_tmpdir=/mysql/log/tmp
{{< / highlight >}}


(Im Teil 2: Threads + per Thread Limits)
