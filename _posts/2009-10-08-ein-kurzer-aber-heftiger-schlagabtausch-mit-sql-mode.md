---
layout: post
published: true
title: "Ein kurzer, aber heftiger Schlagabtausch mit SQL_MODE"
author-id: isotopp
date: 2009-10-08 18:28:00 UTC
tags:
- mysql
- lang_de
feature-img: assets/img/background/mysql.jpg
---
Letzte Woche Montag haben wir beschlossen, den [SQL_MODE](http://dev.mysql.com/doc/refman/5.0/en/server-sql-mode.html) in unseren Entwicklungsservern auf einen strengeren Wert als "" (den Default) zu setzen. Das war ein Fehlschlag und wir haben den Change diese Woche zurück gerollt. Aber von vorne.

## Welchen SQL_MODE will man denn?

Als Ziel-Einstellung haben wir eine Kombination von 

```console
TRADITIONAL,
NO_ENGINE_SUBSTITUTION,
ONLY_FULL_GROUP_BY,
NO_AUTO_VALUE_ON_ZERO
```

ins Auge gefaßt.

`SQL_MODE` ist eine Einstellung in MySQL, mit der das Verhalten des Servers beeinflußt werden kann. Die Variable ist eine Bitmaske von benannten Bits - jedes Bit hat eine im Handbuch definierte Bedeutung. Außerdem haben bestimmte Kombinationen von Bits einen Sammelnamen.

So steht der Name `TRADITIONAL` in Wirklichkeit für die Kombination der Bits

```console
STRICT_TRANS_TABLES,
STRICT_ALL_TABLES,
NO_ZERO_IN_DATE,
NO_ZERO_DATE,
ERROR_FOR_DIVISION_BY_ZERO,
NO_AUTO_CREATE_USER
```

zu der wir dann weiter verschärfend noch

```console
NO_ENGINE_SUBSTITUTION,
ONLY_FULL_GROUP_BY
NO_AUTO_VALUE_ON_ZERO
```

dazu genommen haben.

### Strict Mode

Die Kombination `STRICT_ALL_TABLES,STRICT_TRANS_TABLES` schaltet dabei den strict mode ein. Ohne diese Einstellung akzeptiert und rundet MySQL eine Reihe von Werten, die in den Zielspalten gar nicht darstellbar sind.

Am leichtesten läßt sich das mit ein wenig Code demonstrieren: 


```sql
root@localhost > create table t ( id tinyint unsigned not null );
Query OK, 0 rows affected (0.11 sec)

root@localhost > insert into t values ( 256 ), ( -1 );
Query OK, 2 rows affected, 2 warnings (0.00 sec)
Records: 2  Duplicates: 0  Warnings: 2

root@localhost > show warnings;
+---------+------+------------------------------------------------------+
| Level   | Code | Message                                              |
+---------+------+------------------------------------------------------+
| Warning | 1264 | Out of range value adjusted for column 'id' at row 1 | 
| Warning | 1264 | Out of range value adjusted for column 'id' at row 2 | 
+---------+------+------------------------------------------------------+
2 rows in set (0.00 sec)

root@localhost > select * from t;
+-----+
| id  |
+-----+
| 255 | 
|   0 | 
+-----+
2 rows in set (0.00 sec)
```

Da niemals jemand in seinem Code die Warnungen abfragt werden die eingefügten Werte also stillschweigend gerundet. Ähnliche Dinge können bei illegalen UTF8-Zeichen in latin1-Spalten, bei zu langen Strings oder anderen Typen passieren.

Mit strict mode kann man so etwas verhindern:

```sql
root@localhost > delete from t;
Query OK, 2 rows affected (0.00 sec)

root@localhost > set sql_mode = strict_all_tables;
Query OK, 0 rows affected (0.01 sec)

root@localhost > insert into t values ( 256 ), ( -1 );
ERROR 1264 (22003): Out of range value adjusted for column 'id' at row 1
root@localhost > select * from t;
Empty set (0.00 sec)
```

Und genau das wollten wir haben, insbesondere auch für Enum-Werte:

```sql
root@localhost > drop table t;
Query OK, 0 rows affected (0.01 sec)

root@localhost > create table t ( i enum ('eins', 'zwei') not null ); 
Query OK, 0 rows affected (0.12 sec)

root@localhost > insert into t values ('');
ERROR 1265 (01000): Data truncated for column 'i' at row 1

root@localhost > insert into t values ('drei');
ERROR 1265 (01000): Data truncated for column 'i' at row 1root@localhost > select * from t;
Empty set (0.00 sec)
```


Denn ohne strict mode akzeptiert und vermatscht MySQL diese Daten gnadenlos:

```sql
root@localhost > set sql_mode = '';
Query OK, 0 rows affected (0.00 sec)

root@localhost > insert into t values ('');
Query OK, 1 row affected, 1 warning (0.01 sec)

root@localhost > show warnings;
+---------+------+----------------------------------------+
| Level   | Code | Message                                |
+---------+------+----------------------------------------+
| Warning | 1265 | Data truncated for column 'i' at row 1 |
+---------+------+----------------------------------------+
1 row in set (0.00 sec)     

root@localhost > insert into t values ('drei');
Query OK, 1 row affected, 1 warning (0.00 sec)
root@localhost > show warnings;
+---------+------+----------------------------------------+
| Level   | Code | Message                                |
+---------+------+----------------------------------------+
| Warning | 1265 | Data truncated for column 'i' at row 1 |
+---------+------+----------------------------------------+
1 row in set (0.00 sec)     

root@localhost > select * from t;
+---+
| i |
+---+
|   |
|   |
+---+
2 rows in set (0.00 sec)
```


Man beachte hier `''` in der Tabelle - wo der `ENUM` doch als `ENUM('eins','zwei')` definiert ist!

### NO_ZERO_DATE und NO_ZERO_IN_DATE

Auch für Datumsangaben wollen wir das haben, und dazu haben wir `NO_ZERO_DATE` und `NO_ZERO_IN_DATE` gesetzt. Ohne `SQL_MODE`: 


```sql
root@localhost > drop table t;
Query OK, 0 rows affected (0.00 sec)

root@localhost > create table t ( d date not null );
Query OK, 0 rows affected (0.11 sec)

root@localhost > insert into t values ( '0000-00-00'), ('2009-10-00');
Query OK, 2 rows affected (0.01 sec)
Records: 2  Duplicates: 0  Warnings: 0

root@localhost > show warnings;
Empty set (0.00 sec)

root@localhost > select * from t;
+------------+
| d          |
+------------+
| 0000-00-00 | 
| 2009-10-00 | 
+------------+
2 rows in set (0.00 sec)
```

Und mit: 

```sql
root@localhost > set sql_mode = 'NO_ZERO_DATE,NO_ZERO_IN_DATE,STRICT_ALL_TABLES';
Query OK, 0 rows affected (0.00 sec)

root@localhost > delete from t;
Query OK, 3 rows affected (0.00 sec)

root@localhost > insert into t values ('0000-00-00');
ERROR 1292 (22007): Incorrect date value: '0000-00-00' for column 'd' at row 1
root@localhost > insert into t values ('2009-10-00');
ERROR 1292 (22007): Incorrect date value: '2009-10-00' for column 'd' at row 1
```

Man beachte, daß es die Kombination von `STRICT_ALL_TABLES` und den `NO_ZERO*DATE` Modi braucht, um hier einen Fehler zu erzeugen. Ohne den strict mode bekommt man nur eine Warnung.

### ERROR_FOR_DIVISION_BY_ZERO - schön wärs

Die Einstellung `ERROR_FOR_DIVISION_BY_ZERO` tut nicht ganz das, was wir eigentlich wollen - eine gut und weithin sichtbare Explosion bei einer Division durch 0 - aber ist immerhin besser als nichts: 


```sql
root@localhost > create table t ( i integer null );
Query OK, 0 rows affected (0.07 sec)

root@localhost > insert into t values ( 1/0 );
Query OK, 1 row affected (0.00 sec)

root@localhost > set sql_mode = 'STRICT_ALL_TABLES,ERROR_FOR_DIVISION_BY_ZERO';
Query OK, 0 rows affected (0.00 sec)

root@localhost > insert into t values ( 1/0 );
ERROR 1365 (22012): Division by 0
root@localhost > select 1/0;
+------+
| 1/0  |
+------+
| NULL | 
+------+
1 row in set, 1 warning (0.00 sec)

root@localhost > show warnings;
+-------+------+---------------+
| Level | Code | Message       |
+-------+------+---------------+
| Error | 1365 | Division by 0 | 
+-------+------+---------------+
1 row in set (0.00 sec)
```

Wie man sieht, wird nur beim INSERT (oder UPDATE) in eine Tabelle ein Fehler statt einer NULL produziert. Bei einem normalen Ausdruck bekommt man weiterhin NULL und eine Warning. Folgefalsch also auch hier: 

```sql
root@localhost > create table t ( a integer, b integer );
Query OK, 0 rows affected (0.05 sec)

root@localhost > insert into t values (1 , 0);
Query OK, 1 row affected (0.00 sec)

root@localhost > set sql_mode = 'TRADITIONAL';  
Query OK, 0 rows affected (0.01 sec)

root@localhost > select a/b from t;
+------+
| a/b  |
+------+
| NULL | 
+------+
1 row in set, 1 warning (0.00 sec)

root@localhost > show warnings;
+-------+------+---------------+
| Level | Code | Message       |
+-------+------+---------------+
| Error | 1365 | Division by 0 | 
+-------+------+---------------+
1 row in set (0.00 sec)
```


### NO_AUTO_CREATE_USER - auch zu schön um wahr zu sein

Ebenfalls nicht das, was man will tut `NO_AUTO_CREATE_USER`: Es verhindert das versehentliche Anlegen eines Users ohne Paßwort durch ein `GRANT`-Statement ohne `IDENTIFIED BY`-Clause, aber es erzwingt nicht das Verwenden von `CREATE USER` zum Anlegen von Usern: Ein `GRANT`-Statement mit `IDENTIFIED BY` kann noch immer nebenbei einen User anlegen.

### ONLY_FULL_GROUP_BY

Wir haben außerdem `ONLY_FULL_GROUP_BY` gesetzt. Normalerweise erlaubt MySQL die Anwahl von nicht aggregierten Spalten in `SELECT`-Statements mit `GROUP BY`-Ausdrücken:


```sql
root@localhost > drop table t;
Query OK, 0 rows affected (0.00 sec)

root@localhost > create table t ( i integer, j integer );
Query OK, 0 rows affected (0.09 sec)

root@localhost > insert into t values (1,1), (1,2), (2,3), (2,4), (3,5);
Query OK, 5 rows affected (0.00 sec)
Records: 5  Duplicates: 0  Warnings: 0

root@localhost > select i,j,group_concat(j) from t group by i;
+------+------+-----------------+
| i    | j    | group_concat(j) |
+------+------+-----------------+
|    1 |    1 | 1,2             | 
|    2 |    3 | 3,4             | 
|    3 |    5 | 5               | 
+------+------+-----------------+
3 rows in set (0.00 sec)
```


MySQL verhält sich hier so, als stünde das `j` in einem Funktionaufruf einer hypothetischen Aggregatfunktion `ANY(j)`. Es wählt also ein beliebiges j aus der Gruppe der j aus, die der Zeile zugeordnet sind und zeigt es als Repräsentant der Äquivalenzklasse an. MySQL hat auch eine ganz reale Funktion `ALL()`, die die gesamte Äquivalenzklasse anzeigt - sie heißt `GROUP_CONCAT()`.

Das Verhalten von MySQL ist hier strikt konform mit dem SQL-Standard und der Mathematik dahinter, aber diese Auslegung des Standards ist einzigartig - alle anderen SQL-Produkte machen es anders. Mit `ONLY_FULL_GROUP_BY` soll man MySQL in einem Modus schalten, in dem es der verbreiteten Auslegung folgt: 

```sql
root@localhost > set sql_mode = 'TRADITIONAL,ONLY_FULL_GROUP_BY';
Query OK, 0 rows affected (0.00 sec)

root@localhost > select i,j,group_concat(j) from t group by i;
ERROR 1055 (42000): 'koehntopp.t.j' isn't in GROUP BY
```

Leider gibt es kein `ANY()` in MySQL, sodaß man sich mit `MIN()` oder `MAX()` behelfen muß, um deterministisch ein Element der Äquivalenzklasse zu bestimmen.

Um Entwicklern zu helfen beim Anlegen von Tabellen Fehler mit der Storage Engine zu machen, haben wir `NO_ENGINE_SUBSTITUTION` eingeschaltet - MySQL ersetzt dann beim Fehlen einer Engine diese nicht stillschweigend durch MyISAM (oder default_storage_engine), sondern mault sichtbar mit einem Fehler.

### NO_AUTO_VALUE_ON_ZERO - knapp daneben, aber auch vorbei

Schließlich wollten wir noch `NO_AUTO_VALUE_ON_ZERO`, um einen lange bestehenden Fehler in MySQL zu korrigieren:

```sql
root@localhost > set sql_mode = '';
Query OK, 0 rows affected (0.00 sec)

root@localhost > drop table t;
Query OK, 0 rows affected (0.00 sec)

root@localhost > create table t ( id integer unsigned not null primary key auto_increment );
Query OK, 0 rows affected (0.16 sec)

root@localhost > insert into t values ( NULL );
Query OK, 1 row affected (0.00 sec)

root@localhost > insert into t values ( 0 );
Query OK, 1 row affected (0.32 sec)

root@localhost > select * from t;
+----+
| id |
+----+
|  1 | 
|  2 | 
+----+
2 rows in set (0.00 sec)
```

MySQL weist also neue auto_increment-Werte nicht nur bei NULL zu, sondern auch bei 0. Das ist sehr störend, denn es verhindert, daß bestimmte Fehler gefunden werden.

Was `NO_AUTO_VALUE_ON_ZERO` macht ist jedoch auch erst beim 2. Versuch hilfreich: 

```sql
root@localhost > set sql_mode = 'TRADITIONAL,NO_AUTO_VALUE_ON_ZERO';
Query OK, 0 rows affected (0.00 sec)

root@localhost > insert into t values ( NULL );
Query OK, 1 row affected (0.00 sec)

root@localhost > insert into t values ( 0 );
Query OK, 1 row affected (0.00 sec)

root@localhost > select * from t;
+----+
| id |
+----+
|  0 | 
|  1 | 
|  2 | 
|  3 | 
+----+
4 rows in set (0.00 sec)

root@localhost > insert into t values ( 0 );
ERROR 1062 (23000): Duplicate entry '0' for key 1
root@localhost > select * from t;
+----+
| id |
+----+
|  0 | 
|  1 | 
|  2 | 
|  3 | 
+----+
4 rows in set (0.00 sec)
```

Wie man sieht erzeugt die erste Zuweisung keinen auto_increment-Wert, sondern den Primärschlüssel 0, was man in den meisten Fällen auch nicht will. Immerhin explodiert dann die 2. Zuweisung mit einem Duplicate Key Error, sodaß man den fehlerhaften SQL-Code dann zu sehen bekommt.

So weit die Theorie.

### Selbst gemachte Probleme

Und jetzt wie es explodiert.

Aufgrund einer Migration von einer älteren Version von MySQL haben wir haufenweise Definition von Tabellen mit Code wie diesem:

```sql
root@localhost > set sql_mode = 'TRADITIONAL';
Query OK, 0 rows affected (0.00 sec)

root@localhost > create table t ( d date not null default '0000-00-00' );
ERROR 1067 (42000): Invalid default value for 'd'
```

Das Setzen von `NO_ZERO_DATE` zerbricht also diese Tabellen und damit auch alle Tests (da kommt das nämlich in so gut wie jeder Tabelle vor). Das ist kein Fehler von MySQL, sondern ein Problem bei uns, macht aber erst einmal `NO_ZERO_DATE` für uns unmöglich.

### ONLY_FULL_GROUP_BY-Bug (behoben in 5.1)

Dann explodiert `ONLY_FULL_GROUP_BY` in unserem (zu alten) MySQL 5.0 - in unserem (viel neueren) 5.1 ist der Fehler behoben:


```sql

mysql> SELECT
	MIN(latitude), MAX(latitude), MIN(longitude), MAX(longitude)
FROM Objects
WHERE id IN (99910, 98561, 10200)
    AND latitude  IS NOT NULL
    AND longitude IS NOT NULL;
ERROR 1140 (42000): Mixing of GROUP columns 
(MIN(),MAX(),COUNT(),...) with no GROUP columns 
is illegal if there is no GROUP BY clause
```

Das ist Unsinn - id wird nicht angezeigt und alle angezeigten Spalten sind in Aggregatfunktionen. Die WHERE-Clause verwirrt MySQL.

Man kann die Query umschreiben, um den Fehler zu umgehen (aber das ist nicht Sinn der Sache): 

```sql
SELECT
  MIN(latitude), MAX(latitude), 
  MIN(longitude), MAX(longitude)
FROM Objects
  WHERE id IN (99910, 98561, 10200)
  AND latitude  IS NOT NULL
  AND longitude IS NOT NULL group by 1=1;
```

Beachte, daß man `GROUP BY 1=1` schreiben muß und nicht einfach `GROUP BY 1` machen kann. Letzteres ist eine (obsolete und nicht empfohlene) Schreibweise um nach Spalte 1 zu gruppieren (oder, mit `ORDER BY`, zu sortieren).

```sql

SELECT
  MIN(latitude), MAX(latitude),
  MIN(longitude), MAX(longitude)
FROM Objects
  WHERE id IN (99910, 98561, 10200)
  AND latitude  IS NOT NULL
  AND longitude IS NOT NULL group by 1;
ERROR 1056 (42000): Can't group on 'MIN(latitude)'
```


### INSERT ON DUPLICATE KEY UPDATE Breakage I

Eine weitere Explosion bekommt man mit `INSERT ON DUPLICATE KEY UPDATE` hin. Gegeben sei

```sql

root@localhost > create table t (
  id integer unsigned not null primary key auto_increment,
  d integer not null,
  e integer not null,
  f integer not null,
  unique ( d, e ));
Query OK, 0 rows affected (0.06 sec)

root@localhost > insert into t values ( 1, 1, 2, 0);
Query OK, 1 row affected (0.00 sec)

root@localhost > select * from t;
+----+---+---+---+
| id | d | e | f |
+----+---+---+---+
|  1 | 1 | 2 | 0 | 
+----+---+---+---+
1 row in set (0.00 sec)
```

Ohne SQL-Mode bekommt man Warnungen, wenn man das folgende versucht:

```sql
root@localhost > insert into t (id, f) values (1,4) on duplicate key update f = f+values(f);
Query OK, 2 rows affected, 2 warnings (0.01 sec)

root@localhost > show warnings;
+---------+------+----------------------------------------+
| Level   | Code | Message                                |
+---------+------+----------------------------------------+
| Warning | 1364 | Field 'd' doesn't have a default value | 
| Warning | 1364 | Field 'e' doesn't have a default value | 
+---------+------+----------------------------------------+
2 rows in set (0.00 sec)

root@localhost > select * from t;
+----+---+---+---+
| id | d | e | f |
+----+---+---+---+
|  1 | 1 | 2 | 4 | 
+----+---+---+---+
1 row in set (0.00 sec)
```

Ungeachtet der Warnungen tut der Code aber genau das, was er soll. Durch den Strict Mode werden solche Warnungen aber zu Fehlern: 

```sql
root@localhost > set sql_mode ='TRADITIONAL';
Query OK, 0 rows affected (0.00 sec)

root@localhost > insert into t (id, f) values (1,4) on duplicate key update f = f+values(f);
ERROR 1364 (HY000): Field 'd' doesn't have a default value
```

Und damit Breakage in der Anwendung.

Der Fehler bzw. die Warnungen sollten eigentlich gar nicht auftreten - sie müssen auftreten, wenn ein reines `INSERT` verwendet wird, mit dem `INSERT ON DUPLICATE KEY UPDATE` Code teilt. Aber sie dürfen eben nicht im `INSERT ON DUPLICATE KEY UPDATE` auftreten, sondern müssen dort das Weiterreichen an die `UPDATE`-Clause triggern.

Oder man sieht von so komplexen Statements wie `INSERT ON DUPLICATE KEY UPDATE` ab, weil die Fehlerbehandlung in ihnen zu kompliziert wird...

### Extended INSERT und ON DUPLICATE KEY Breakage II

Dann muß man jedoch auch auf Extended `INSERT`-Syntax verzichten. Denn: 

```sql
root@localhost > set sql_mode = 'TRADITIONAL';
Query OK, 0 rows affected (0.00 sec)

root@localhost > > CREATE TABLE t (
  id TINYINT UNSIGNED NOT NULL, 
  value TINYINT UNSIGNED NOT NULL, 
  PRIMARY KEY (id)
);
Query OK, 0 rows affected (0.00 sec)

root@localhost > INSERT INTO t VALUES (1,1);
Query OK, 1 row affected (0.00 sec)

root@localhost > INSERT INTO t VALUES (1,256) ON DUPLICATE KEY UPDATE value=VALUES(value);
ERROR 1264 (22003): Out of range value for column 'value' at row 1
// does *not* break replication

root@localhost > INSERT INTO wop VALUES (1,1),(1,256) ON DUPLICATE KEY UPDATE value=VALUES(value);
ERROR 1264 (22003): Out of range value for column 'value' at row 2
// *BREAKS REPLICATION*
```

Das ist das Resultat auf dem Master: Ein halb ausgeführtes Statement. Das Statement hat im letzten Fall jedoch Daten modifiziert und gelangt so in das Binlog zum Slave, jedoch mit der Information, daß es auf dem Master auf halber Strecke abgebrochen wurde. Also bleibt die Replikation zum Slave nun stehen, um Inkonsistenzen zu vermeiden.

Das wiederum - ein Stehenbleiben der Replikation - können wir uns unter gar keinen Umständen erlauben. Während wir vorher also gemosert und unseren Code gefixt haben, haben wir nun diesen Change komplett zurück gerollt und schauen einmal, wie wir das später ausgerollt bekommen.

## Zusammenfassung

Es ist  recht offensichtlich, daß nicht viele Leute MySQL mit `SQL_MODE` fahren und daß eine ganze Menge Fehler oder Ungereimtheiten in `SQL_MODE` stecken. Das ist sehr schade, denn es ist so leider nicht möglich, MySQL auf eine Weise zu betreiben, mit der man illegale Daten beim Einfügen in die Datenbank in allen Fällen erkennen und verhindern kann.

Was ist auf der guten Seite geblieben?

Wir haben einige long standing bugs bei uns gefunden und gefixt - an einigen Stellen haben Entwickler defekte (falsch geschriebene) Werte in ENUMs verwendet und so '' erzeugt. An anderen Stellen sind falsche oder inkomplette Datumsangaben mit auf 00 gesetzten Tagen oder Monaten verwendet worden (man lese die Manpage zu mktime(3), tm_mon vs. tm_mday!).

Auch so etwas wird durch `TRADITIONAL` haufenweise gefunden: 

```sql

root@localhost > create table t ( i integer not null, s varchar(32) not null );
Query OK, 0 rows affected (0.06 sec)

root@localhost > insert into t (i) values ( 1 );
Query OK, 1 row affected, 1 warning (0.66 sec)

root@localhost > show warnings;
+---------+------+----------------------------------------+
| Level   | Code | Message                                |
+---------+------+----------------------------------------+
| Warning | 1364 | Field 's' doesn't have a default value | 
+---------+------+----------------------------------------+
1 row in set (0.00 sec)

root@localhost > select * from t;
+---+---+
| i | s |
+---+---+
| 1 |   | 
+---+---+
1 row in set (0.00 sec)

root@localhost > set sql_mode = 'TRADITIONAL';
Query OK, 0 rows affected (0.00 sec)

root@localhost > insert into t (i) values ( 2 );
ERROR 1364 (HY000): Field 's' doesn't have a default value
root@localhost > select * from t;
+---+---+
| i | s |
+---+---+
| 1 |   | 
+---+---+
1 row in set (0.00 sec)

```


Durch das `NO_ZERO_DATE` haben wir die exzessive Verwendung von `DATE NOT NULL DEFAULT '0000-00-00'` als Überrest einer Migration von einer älteren Version von MySQL zur Disposition gestellt. Viele Entwickler fragen sich nun, was `SELECT * FROM t WHERE somedate = "0000-00-00"` wohl für eine Bedeutung haben mag, also was die dort gezeigten Zeilen wohl bedeuten mögen und gehen sorgfältiger mit Default-Werten um. Das hat ebenfalls eine Reihe von Bugs gekillt.

Alles in allem wär es schön, wenn `SQL_MODE` von MySQL selbst mehr promoted würde oder gar in neueren Versionen von MySQL ein Default-`SQL_MODE` wie der oben vorgestellte voreingestellt wäre. Andererseits ist absehbar, daß in der MySQL-Welt dann genau gar kein existierendes SQL mehr laufen würde.

Und so wird es wohl bei dem Wunsch bleiben.