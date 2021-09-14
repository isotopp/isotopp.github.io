---
layout: post
published: true
title: Über ENUM (und Fast Alter Table)
author-id: isotopp
date: 2010-04-09 12:57:01 UTC
tags:
- mysql
- lang_de
feature-img: assets/img/background/mysql.jpg
---
On 2010-04-08 13:40:57 +0200, 

[Karsten Wutzke said](http://groups.google.de/group/de.comp.datenbanken.mysql/msg/e58da1119a2bd53c?dmode=source&output=gplain):

> gibt es ein sinnvolles Maximum für die Anzahl von Elementen in einem ENUM?

ENUM hat in MySQL 5.1 einige Eigenschaften, die überraschend sind. Zum
Beispiel

```sql
root@localhost [kris]> create table t (id integer unsigned not null primary key, e enum('a', 'b', 'c') not null ) engine = innodb;
Query OK, 0 rows affected (0.21 sec)

root@localhost [kris]> insert into t values (1, '');
Query OK, 1 row affected, 1 warning (0.00 sec)

Warning (Code 1265): Data truncated for column 'e' at row 1

root@localhost [kris]> insert into t values (2, 'c');
Query OK, 1 row affected (0.00 sec)

root@localhost [kris]> select id, e, hex(e), e+0 from t;
+----+---+--------+-----+
| id | e | hex(e) | e+0 |
+----+---+--------+-----+
|  1 |   |        |   0 |
|  2 | c | 63     |   3 |
+----+---+--------+-----+
2 rows in set (0.00 sec)
```
 
Obwohl t.e ein ENUM ist, das per Definition keinen Wert '' zuläßt, hat MySQL
den Wert '' abspeichern können, wenn auch mit einer Warnung.

Bei der Kontrollausgabe sieht man bei der Konvertierung nach INTEGER, daß
ein ENUM intern Zahl gespeichert wird, wobei dem ersten Wert die Zahl 1, dem
nächsten die Zahl 2 und so weiter zugeordnet wird. Der Wert '', intern als 0
repräsentiert (und von NULL verschieden) wird immer zugelassen und
verwendet, um ungültige Werte (Werte, die nicht in der ENUM-Wertliste
enthalten sind) abzubilden. '' ist nicht in der Wertliste enthalten und wird
(wie jeder andere ungültige Wert auch) mit einer data truncation warning auf
'' abgebildet.

Abhilfe schaffte hier 
[strict mode](http://dev.mysql.com/doc/refman/5.1/en/server-sql-mode.html), etwa 

```sql
root@localhost [kris]> set sql_mode = STRICT_ALL_TABLES;
Query OK, 0 rows affected (0.00 sec)
root@localhost [kris]> insert into t values (3, '');
ERROR 1265 (01000): Data truncated for column 'e' at row 1
```

Die 'data truncation warning' wird dann zum Error und läßt den INSERT
scheitern. Das bringt andere Probleme mit sich, aber das ist eine andere
Geschichte, die ein anderes Mal erzählt werden soll.

Das ENUM wird intern als TINYINT oder SHORTINT repräsentiert, belegt also
entweder einen oder zwei Bytes pro Wert und kann entsprechend maximal 64k
Werte annehmen.

> Ich meine mich daran zu erinnern, dass irgendjemand mal gesagt hat, dass
> ENUMs nur für eine eher geringe Anzahl von Elementen Sinn macht.

Das Problem lag in der Vergangenheit eher bei der Kombination von
Tabellengröße und Änderungshäufigkeit der Definition.

Eine Änderung der Wertemenge ist halt ein DDL-Statement, also ein ALTER
TABLE und MySQL mußte bisher für das Ändern der ENUM-Definition die Tabelle
umkopieren. Wird die Tabelle größer, kann das unangenehm lange dauern, da
die Tabelle während des Umkopieren ein Lock hat, also nicht geschrieben
werden kann.

In MySQL 5.1 und höher gilt jedoch 

> In most cases, ALTER TABLE works by making a temporary copy of the
> original table. The alteration is performed on the copy, and then the
> original table is deleted and the new one is renamed. [...]In some cases,
> no temporary table is necessary:Alterations that modify only table
> metadata and not table data can be made immediately by altering the
> table's .frm file and not touching table contents. The following changes
> are fast alterations that can be made this way: <ul><li>Renaming a column
> or index. </li><li>Changing the default value of a column.
> </li><li>Changing the definition of an ENUM or SET column by adding new
> enumeration or set members to the end of the list of valid member
> values.</li></ul>

Die alten Bedenken gegen die Erweiterung eines ENUM- oder SET-Typen wegen
lange dauernder ALTER TABLE-Statements gelten also NICHT mehr, vorausgesetzt
es ist akzeptabel, daß neue Werte für den ENUM am Ende der ENUM-Liste
angehängt werden können, also keine interne Umnummerierung notwendig ist.
