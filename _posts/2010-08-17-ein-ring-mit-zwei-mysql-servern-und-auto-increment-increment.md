---
layout: post
published: true
title: Ein Ring mit zwei MySQL-Servern und auto_increment_increment
author-id: isotopp
date: 2010-08-17 19:50:00 UTC
tags:
- mysql
- replication
- lang_de
feature-img: assets/img/background/mysql.jpg
---
Lalufu fragte in den Kommentaren von
[Master-Master]({% link _posts/2010-08-16-master-master-und-distributed-transactions.md %}):

> Ich habe eine MM-Replikation mit zwei Servern.
>
> Beide haben auto_increment_increment=10,
>
> Server A hat auto_increment_offset=0 und Server B hat
> auto_increment_offset=1.
>
> Ich lege mir eine Tabelle mit einem auto_increment-Feld (id) an und mache
> auf Server A einen INSERT, dann kriegt die row id=0, und wird auf B
> repliziert, richtig? 
> 
> Dann noch einen INSERT auf A, die row kriegt id=10, und wird auf B
> repliziert.Wenn ich jetzt auf B einen INSERT mache, welchen Wert kriegt
> das id in der row?

Statt einer Antwort hier die Methode zum selber rausfinden.

Wir installieren zwei MySQL-Instanzen zum Testen (Mac OS X mit Macports).
Das ist recht einfach, denn dazu muß man nur zwei Datenverzeichnisse mit
mysql_install_db initialisieren und passende minimale Konfigurationen
erzeugen.

```console
KK:~ kris$ cd /tmp
KK:tmp kris$ mkdir eins zwei
KK:tmp kris$ mysql_install_db5 --datadir=/tmp/eins --user=kris
Installing MySQL system tables...
...

KK:tmp kris$ mysql_install_db5 --datadir=/tmp/zwei --user=kris
Installing MySQL system tables...
...

KK:tmp kris$ cd eins
KK:eins kris$ cat > my.cnf
[mysqld]
datadir=/tmp/eins
socket=/tmp/eins/mysql.sock
port=3307
log_bin
server_id = 1
auto_increment_increment = 10
auto_increment_offset = 1
innodb


KK:eins kris$ cd ../zwei
KK:zwei kris$ cat my.cnf
[mysqld]datadir=/tmp/zwei
socket=/tmp/zwei/mysql.sock
port=3308
log_bin
server_id = 2
auto_increment_increment = 10
auto_increment_offset = 2
innodb
```

Die Server können nun gestartet werden. Wir geben jedem Server einen Zeiger
auf seine Konfiguration mit.

```console
KK:zwei kris$ cd ../eins
KK:eins kris$ mysqld_safe5 --defaults-file=/tmp/eins/my.cnf &
100817 13:05:02 mysqld_safe Logging to '/tmp/eins/KK.local.err'.
100817 13:05:02 mysqld_safe Starting mysqld daemon with databases from /tmp/eins

KK:eins kris$ cd ../zwei
KK:zwei kris$ mysqld_safe5 --defaults-file=/tmp/zwei/my.cnf &
100817 13:05:40 mysqld_safe Logging to '/tmp/zwei/KK.local.err'.
100817 13:05:40 mysqld_safe Starting mysqld daemon with databases from /tmp/zwei

KK:zwei kris$ lsof -i -n -P | grep my
mysqld    1042 kris   10u  IPv4 0x05691740      0t0  TCP \*:3307 (LISTEN)
mysqld    1112 kris   10u  IPv4 0x0ba7eec8      0t0  TCP \*:3308 (LISTEN)
```

Nachdem wir die zwei Server laufen haben und beide leer sind, können wir
eine Datenbank aufsetzen und die Replikation konfigurieren. Wir nutzen hier
den Spezialfall, daß beide Server dieselben Daten haben, weil sie leer sind,
können uns also eine Menge Arbeit sparen.

Ich habe die Angewohnheit, bei multiplen Instanzen auf einer Hardware
@@hostname und @@datadir abzufragen, da die Kombination beider Werte eine
Instanz eindeutig identifiziert. So kann ich sicher sein, mit dem richtigen
Server zu sprechen.

```console
KK:zwei kris$ mysql5 --host=127.0.0.1 --port=3307
...

root@localhost [(none)]> select @@hostname, @@datadir;
+------------+------------+
| @@hostname | @@datadir  |
+------------+------------+
| KK.local   | /tmp/eins/ |
+------------+------------+
1 row in set (0.00 sec)

root@localhost [(none)]> create database kris;
Query OK, 1 row affected (0.00 sec)

root@localhost [(none)]> create table kris.t ( id integer not null primary key auto_increment, d varchar(20) charset latin1 ) engine = innodb;
Query OK, 0 rows affected (0.10 sec)

root@localhost [(none)]> quit
Bye
```

Und dasselbe drüben auch noch mal. 

```console
KK:zwei kris$ mysql5 --host=127.0.0.1 --port=3308
root@localhost [(none)]> select @@hostname, @@datadir;
+------------+------------+
| @@hostname | @@datadir  |
+------------+------------+
| KK.local   | /tmp/zwei/ |
+------------+------------+
1 row in set (0.00 sec)

root@localhost [(none)]> create database kris;
Query OK, 1 row affected (0.00 sec)

root@localhost [(none)]> create table kris.t ( id integer not null primary key auto_increment, d varchar(20) charset latin1 ) engine = innodb;
Query OK, 0 rows affected (0.06 sec)

root@localhost [(none)]> quit
Bye
```


Nachdem wir jetzt eine Testdatenbank mit einer leeren Testtabelle haben,
können wir replizieren. Wir setzen zunächst einmal den Server 3307 (eins)
auf. Dazu definieren wir einen Account für zwei mit dem Privileg `replication
slave` und notieren die Binlog-Position von eins:

```console
KK:zwei kris$ mysql5 --host=127.0.0.1 --port=3307
...

root@localhost [(none)]> grant replication slave on \*.\* to 'zwei'@'127.0.0.1' identified by 's3cr3t!';
Query OK, 0 rows affected (0.05 sec)

root@localhost [(none)]> show master status;
+---------------+----------+--------------+------------------+
| File          | Position | Binlog_Do_DB | Binlog_Ignore_DB |
+---------------+----------+--------------+------------------+
| KK-bin.000003 |      106 |              |                  |
+---------------+----------+--------------+------------------+
1 row in set (0.00 sec)

root@localhost [(none)]> quit
Bye
```

Mit diesen Daten können wir nun zwei einrichten. Auch dort muß ein Account
mit `replication slave` eingerichtet werden. Wir lassen außerdem einmal ein
`CHANGE MASTER` Statement los, und starten den Slave auf zwei, sodaß er von
eins repliziert. Am Ende notieren wir uns das Binlog von zwei, um auch auf
eins ein `CHANGE MASTER` machen zu können.

```console
KK:zwei kris$ mysql5 --host=127.0.0.1 --port=3308
...

root@localhost [(none)]> grant replication slave on \*.\* to 'eins'@'127.0.0.1' identified by 's3cr3t!';
Query OK, 0 rows affected (0.00 sec)

root@localhost [(none)]> change master to master_host = '127.0.0.1', master_port = 3307, master_user = 'zwei', master_password = 's3cr3t!', master_log_file = 'KK-bin.000003', master_log_pos = 106;
Query OK, 0 rows affected (0.80 sec)

root@localhost [(none)]> start slave;
Query OK, 0 rows affected (0.02 sec)

root@localhost [(none)]> show slave status\G
...
Slave_IO_Running: Yes
Slave_SQL_Running: Yes
...

root@localhost [(none)]> show master status;
+---------------+----------+--------------+------------------+
| File          | Position | Binlog_Do_DB | Binlog_Ignore_DB |
+---------------+----------+--------------+------------------+
| KK-bin.000003 |      246 |              |                  |
+---------------+----------+--------------+------------------+
1 row in set (0.00 sec)
root@localhost [(none)]> quit
Bye
```

Jetzt muß nur noch auf dem Server eins das `CHANGE MASTER` mit diesen Daten
laufen.

```console
KK:zwei kris$ mysql5 --host=127.0.0.1 --port=3307
...
root@localhost [(none)]> change master to master_host = '127.0.0.1', master_port = 3308, master_user = 'eins', master_password = 's3cr3t!', master_log_file = 'KK-bin.000003', master_log_pos = 246;
Query OK, 0 rows affected (0.77 sec)

root@localhost [(none)]> start slave;
Query OK, 0 rows affected (0.00 sec)

root@localhost [(none)]> show slave status\G
...
Slave_IO_Running: Yes
Slave_SQL_Running: Yes
...
```

Wir haben nun einen Ring, der zwischen zwei Instanzen auf Port 3307 und Port
3308 repliziert. Das kann man auch sehen:

```sql
KK:zwei kris$ lsof -i -n -P | grep my
mysqld    1210 kris   11u  IPv4 0x06091e98      0t0  TCP \*:3307 (LISTEN)
mysqld    1210 kris   31u  IPv4 0x0ba6def8      0t0  TCP 127.0.0.1:3307->127.0.0.1:50981 (ESTABLISHED)
mysqld    1210 kris   37u  IPv4 0x098bab4c      0t0  TCP 127.0.0.1:50989->127.0.0.1:3308 (ESTABLISHED)
mysqld    1282 kris   11u  IPv4 0x0ba7eec8      0t0  TCP \*:3308 (LISTEN)
mysqld    1282 kris   31u  IPv4 0x0ba7faec      0t0  TCP 127.0.0.1:3308->127.0.0.1:50989 (ESTABLISHED)
mysqld    1282 kris   35u  IPv4 0x098b9b1c      0t0  TCP 127.0.0.1:50981->127.0.0.1:3307 (ESTABLISHED)
```

Jetzt können wir testen: 

```sql
KK:zwei kris$ mysql5 --host=127.0.0.1 --port=3307 -e 'insert into kris.t values (NULL, "auf eins");'
KK:zwei kris$ mysql5 --host=127.0.0.1 --port=3308 -e 'insert into kris.t values (NULL, "auf zwei");'
KK:zwei kris$ mysql5 --host=127.0.0.1 --port=3308 -e 'select \* from kris.t;'
+----+----------+
| id | d        |
+----+----------+
|  1 | auf eins |
|  2 | auf zwei |
+----+----------+

KK:zwei kris$ mysql5 --host=127.0.0.1 --port=3307 -e 'insert into kris.t values (NULL, "nochmal eins");'
KK:zwei kris$ mysql5 --host=127.0.0.1 --port=3307 -e 'select \* from kris.t;'
+----+--------------+
| id | d            |
+----+--------------+
|  1 | auf eins     |
|  2 | auf zwei     |
| 11 | nochmal eins |
+----+--------------+
```

Die Antwort lautet also: 

Jeder Server hat seinen eigenen AUTO_INCREMENT-Zähler an der Tabelle, der
mit dem `auto_increment_offset` initialisiert wird und der in Schritten von
`auto_increment_increment` hochgezählt wird. Das geschieht jedoch nur, wenn
ein Nullwert in die Tabelle eingetragen wird, also nur bei lokalen
INSERT-Statements. Statements, die durch Replikation übermittelt werden,
bringen einen Wert vom Master mit und zählen nichts hoch.
