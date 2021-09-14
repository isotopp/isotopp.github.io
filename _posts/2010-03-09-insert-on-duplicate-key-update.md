---
layout: post
published: true
title: INSERT  ON DUPLICATE KEY UPDATE
author-id: isotopp
date: 2010-03-09 17:51:00 UTC
tags:
- mysql
- lang_de
feature-img: assets/img/background/mysql.jpg
---
Auf Yourhelpcenter.de gibt es einen Artikel mit dem irreführenden Titel
[Update if exists else insert record](http://www.yourhelpcenter.de/2010/03/mysql-update-if-exists-else-insert-record-sql-statement/),
der sich mit INSERT ON DUPLICATE KEY UPDATE beschäftigt.

Dieses Kommando macht genau nicht das, was der Titel des Artikels suggeriert
und wünschenswert wäre, sondern er macht genau das, was der SQL-Text des
Kommandos sagt und leider nervt. Es wäre schön, wenn der Artikel auf
Yourhelpcenter auch auf diese Probleme eingegangen wäre - da er es nicht tut
hole ich es hier gerade mal nach.

Gegeben sei 

```sql
root@localhost [kris]> show create table a\G
       Table: a
Create Table: CREATE TABLE `a` (
  `id` tinyint(3) unsigned NOT NULL,
  `d` tinyint(3) unsigned NOT NULL,
  `e` tinyint(3) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `d` (`d`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1
1 row in set (0.02 sec)
root@localhost [kris]> insert into a values ( 1, 2, 3), (4, 5, 6);
Query OK, 2 rows affected (0.00 sec)
Records: 2  Duplicates: 0  Warnings: 0
```

Das Kommando INSERT ON DUPLICATE KEY UPDATE ist erst einmal ein INSERT-Statement.

Es fügt Werte in eine Tabelle ein: 

```sql
root@localhost [kris]> insert into a ( id, d, e) values ( 7, 8, 9) on duplicate key update e = 100;
Query OK, 1 row affected (0.00 sec)

root@localhost [kris]> select * from a;
+----+---+---+
| id | d | e |
+----+---+---+
|  1 | 2 | 3 |
|  4 | 5 | 6 |
|  7 | 8 | 9 |
+----+---+---+
3 rows in set (0.00 sec)
```

Man kann sehen, daß der INSERT-Zweig genommen wurde - unter anderem daran,
daß dort nach dem Statement '1 row affected' angezeigt wird.

Wenn beim INSERT ein Duplicate Key Error auftritt, dann schaltet das
Statement auf die UPDATE-Clause um und führt die Anweisungen dort aus. Dabei
ist es unwesentlich, ob der Duplicate Key Error auf dem Primärschlüssel oder
einem anderen Unique Key stattfindet.

Hier ist das Beispiel: 

```sql
root@localhost [kris]> insert into a (id, d, e) values (7,11,12) on duplicate key update e = 100;
Query OK, 2 rows affected (0.00 sec)

root@localhost [kris]> insert into a (id, d, e) values (10, 5, 12) on duplicate key update e = 200;
Query OK, 2 rows affected (0.02 sec)

root@localhost [kris]> select * from a;
+----+---+-----+
| id | d | e   |
+----+---+-----+
|  1 | 2 |   3 |
|  4 | 5 | 200 |
|  7 | 8 | 100 |
+----+---+-----+
3 rows in set (0.00 sec)
```

Wie man sieht, hat das erste INSERT einen Duplicate Key Error auf dem
Primärschlüssel für die Row 7 erzeugt und daher ein Update durchgeführt, das
e auf den Wert 100 setzt. Das zweite INSERT hat ebenfalls einen Duplicate
Key Error erzeugt, aber auf dem Unique Key (a) und dem Wert 5, dadurch ist e
auf dem Wert 200 gesetzt worden.

Wie man auch sehen kann, wird beim aktivieren des UPDATE-Zweiges '2 rows
affected' ausgegeben. Das ist ein wenig unsinnig, solange man nicht sieht,
was intern passiert - mehr dazu weiter unten.

Haben wir eine solche Kombination von zwei Unique Key Constraints (ein
Primärschlüssel hat ja auch UNIQUE-Eigenschaft), oder haben wir ein
Statement, das in der UPDATE-Clause auch am Primärschlüssel rumschreibt,
können wir trotzdem einen Duplicate Key Error bekommen:

```sql
root@localhost [kris]> insert into a (id,d,e) values (7,11,12) on duplicate key update d=5, e=199;
ERROR 1062 (23000): Duplicate entry '5' for key 'd'
root@localhost [kris]> insert into a (id,d,e) values (7,11,12) on duplicate key update id=4,d=5,e=198;
ERROR 1062 (23000): Duplicate entry '4' for key 'PRIMARY'
root@localhost [kris]> select * from a;
+----+---+-----+
| id | d | e   |
+----+---+-----+
|  1 | 2 |   3 |
|  4 | 5 | 200 |
|  7 | 8 | 100 |
+----+---+-----+
3 rows in set (0.01 sec)
```

Ein INSERT ON DUPLICATE KEY UPDATE verhindert also Duplicate Key Errors
nicht automatisch.

Es wird immer zunächst das INSERT-Statement versucht, und nur dann, wenn das
INSERT-Statement mit genau einem Duplicate Key Error scheitert wird das
UPDATE-Statement ausgeführt. Die Reihenfolge der internen Tests von MySQL
spielt dabei eine Rolle.

Setzen wir zum Beispiel den SQL_MODE auf TRADITIONAL, dann haben wir unter
andren auch STRICT_ALL_TABLES und STRICT_TRANS_TABLES. Dadurch haben wir
keine stillschweigende Wertanpassung mehr.

Hier die Demo: 

```sql
root@localhost [kris]> set SQL_MODE=TRADITIONAL;
Query OK, 0 rows affected (0.00 sec)
root@localhost [kris]> select @@sql_mode\G
@@sql_mode: STRICT_TRANS_TABLES,STRICT_ALL_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,TRADITIONAL,NO_AUTO_CREATE_USER
1 row in set (0.00 sec)
root@localhost [kris]> update a set e = 300 where id = 7;
ERROR 1264 (22003): Out of range value for column 'e' at row 1
```


Soweit so gut. Was ist nun, wenn wir einen Duplicate Key Error provoziere,
sodaß INSERT ON DUPLICATE KEY das Update ausführen sollte, zugleich in der
INSERT-Phase aber auch einen Out Of Range-Error haben?

```sql
root@localhost [kris]> insert into a (id,d,e) values (7,10,300) ON DUPLICATE KEY UPDATE e = 197;
ERROR 1264 (22003): Out of range value for column 'e' at row 1

root@localhost [kris]> select * from a;
+----+---+-----+
| id | d | e   |
+----+---+-----+
|  1 | 2 |   3 |
|  4 | 5 | 200 |
|  7 | 8 | 100 |
+----+---+-----+
3 rows in set (0.00 sec)
```

Eigentlich hätte unser Statement funktionieren können: Wenn MySQL erst die
Duplicate Key-Violation prüfen würde, um dann zu entscheiden, daß es in den
UPDATE-Fall des Statements gehen müßte, dann wäre unser Statement
durchgekommen und id=7 hätte nun e=197. Das e=300 im INSERT-Zweig hätten wir
nie gesehen - kein Fehler.

Aber MySQL versucht tatsächlich das INSERT durchzuführen, scheitert auf
halben Weg, aber eben NICHT mit einem Duplicate Key Error, sondern einem Out
Of Range Error, und bricht daher das Insert ab, statt in den Update-Zweig
überzugehen. Es werden also _nur_ Duplicate Key Error im Insert-Fall
gefangen, nichts sonst, und es werden alle Prüfungen für das INSERT
durchgeführt und das INSERT tatsächlich ausgeführt, solange bis es scheitert -
und zwar mit dem richtigen Fehler.

Daher auch '2 rows affected' - wir machen das INSERT, das schlägt fehl, dann
machen wir das UPDATE auf derselben Row noch mal.

Und schließlich ist INSERT ON DUPLICATE KEY auch noch eine bombige
Gelegenheit, sich mit naiven Triggern in die Nesseln zu setzen. Bauen wir
uns einmal eine Demo mit einer Logtabelle und allen 6 Triggern für das
Debugging:

```sql
root@localhost [kris]> delimiter //
root@localhost [kris]> create table log ( id serial, t text ) engine = innodb;//
root@localhost [kris]> create trigger bi_a before insert on a for each row insert into log values (NULL, 'before insert');//
Query OK, 0 rows affected (0.35 sec)

root@localhost [kris]> create trigger ai_a after insert on a for each row insert into log values (NULL, 'after insert');//
Query OK, 0 rows affected (0.30 sec)

root@localhost [kris]> create trigger bu_a before update on a for each row insert into log values (NULL, 'before update');//
Query OK, 0 rows affected (0.20 sec)

root@localhost [kris]> create trigger au_a after update on a for each row insert into log values (NULL, 'after update');//
Query OK, 0 rows affected (0.18 sec)

root@localhost [kris]> create trigger bd_a before delete on a for each row insert into log values (NULL, 'before delete');//
Query OK, 0 rows affected (0.11 sec)

root@localhost [kris]> create trigger ad_a after delete on a for each row insert into log values (NULL, 'after delete');//
Query OK, 0 rows affected (0.22 sec)
root@localhost [kris]> delimiter ;
root@localhost [kris]> select * from a;
+----+---+-----+
| id | d | e   |
+----+---+-----+
|  1 | 2 |   3 |
|  4 | 5 | 200 |
|  7 | 8 | 100 |
+----+---+-----+
3 rows in set (0.00 sec)
```

Das kann man nun sehr elegant explodieren lassen, indem man einmal den
UPDATE-Zweig eines INSERT ON DUPLICATE KEY-Update ausführen läßt. Man
bekommt dies:

```sql
root@localhost [kris]> insert into a (id,d,e) values (7,12,13) on duplicate key update e = 190;
Query OK, 2 rows affected (0.39 sec)

root@localhost [kris]> select * from a;
+----+---+-----+
| id | d | e   |
+----+---+-----+
|  1 | 2 |   3 |
|  4 | 5 | 200 |
|  7 | 8 | 190 |
+----+---+-----+
3 rows in set (0.00 sec)

root@localhost [kris]> select * from log;
+----+---------------+
| id | t             |
+----+---------------+
|  1 | before insert |
|  2 | before update |
|  3 | after update  |
+----+---------------+
3 rows in set (0.00 sec)
```

Wie man erkennen kann, ist der 'before insert'-Trigger einmal ausgeführt
worden, dann sind wir in den Update-Fall eingetreten und dort sind der
'before update' und der 'after update'-Trigger gelaufen. Der 'after
insert'-Trigger ist nie gelaufen.

Wir haben also eine ungerade, asymmetrische Trigger-Aktivierung und wir
haben zwei verschiedene Before-Trigger aktiviert.

Hat man Code mit relativen Updates, etwa der Form 'update konto set geld =
geld - old.betrag' in einem 'before insert' und einem 'before
update'-Trigger, dann hat man also zweimal abgebucht, aber nur einmal
aufgebucht. Die Zähler geraten durcheinander. Man muß bei der Konstruktion
von Triggern also besondere Vorsicht walten lassen und diesen Fall
berücksichtigen.

Das gilt im übrigen auch für das Partnerstatement von INSERT ON DUPLICATE
KEY UPDATE, also für INSERT IGNORE:

```sql
root@localhost [kris]> delete from log;
Query OK, 3 rows affected (0.33 sec)

root@localhost [kris]> insert ignore into a (id,d,e) values (7,10,11);
Query OK, 0 rows affected (0.00 sec)

root@localhost [kris]> select * from log;
+----+---------------+
| id | t             |
+----+---------------+
|  6 | before insert |
+----+---------------+
1 row in set (0.00 sec)
```

Auch hier sehen wir eine ungerade Anzahl von Triggern, ein 'before insert'
ohne 'after insert'.
