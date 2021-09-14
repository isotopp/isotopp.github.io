---
layout: post
published: true
title: Was bedeutet eigentlich 'Relationale Algebra'?
author-id: isotopp
date: 2010-04-28 05:18:00 UTC
tags:
- mysql
- sql
- sqlite
- lang_de
feature-img: assets/img/background/mysql.jpg
---
![](/uploads/vorsicht_mathe.png)

SQL ist eine Abfragesprache, die als mathematischen Unterbau die
Relationenalgebra hat. Was genau ist das?

Da ist einmal der Begriff der "Algebra". In der Wikipedia findet man 
[die mathematische Definition](http://de.wikipedia.org/wiki/Algebraische_Struktur#Variante_1)
der algebraischen Struktur, und sie ist, weil sie mathematischen Formalismen
genügen muß, für den ungeübten ein wenig unhandlich zu lesen.

Dort steht aber nix anderes als 'Wir haben eine Grundmenge A und einen
definierten Satz von erlaubten Operationen auf A, und wir garantieren, das
das Ergebnis jeder Operation wieder in A liegt.' Mehr nicht. Eine Algebra
ist also eine Struktur, die Elemente enthält, mit denen man rechnen kann
(etwa die natürlichen Zahlen), und Operationen, die definieren, was erlaubte
Rechenoperationen sind (etwa die Addition). Wenn etwas eine Algebra ist,
dann heißt das, daß man mit dem Ergebnis der Operation wieder in A landet,
also mit dem Ergebnis weiter rechnen kann.

Die natürlichen Zahlen und die Addition sind eine Algebra.

Die natürlichen Zahlen und die Operationen Addition und Subtraktion sind
keine Algebra, da 4 minus 6 (4 und 6 sind natürliche Zahlen) den Wert -2
ergibt und -2 ist keine natürliche Zahl - wir haben die Grundmenge
verlassen.

In dem Wunsch, mit immer mehr mathematischen Operationen (Addition,
Subtraktion, Multiplikation, Division, Potenzen, Wurzeln, ...) eine Algebra
zu bekommen, hat die Mathematik sich von den natürlichen über die ganzen,
die rationalen und schließlich die reellen Zahlen bis zu den komplexen
Zahlen vorgearbeitet.

Dann ist da dieses andere Wort: Was genau ist eine Relation?

Wir kennen den mathematischen Begriff der Funktion. 

Eine Funktion bildet eine oder mehrere Mengen zur Gänze oder zum Teil auf
eine Ergebnismenge ab. Die Funktionsvorschrift sagt, wie das geht. Die
Ergebnisse kann man aufmalen, und dann bekommt man den Graphen der Funktion.
Und um uns zu verwirren, verwenden die Mathefuzzis Funktion,
Funktionsvorschrift und den Graphen der Funktion umgangssprachlich gerne mal
synonym.

Die Mathematiker zum Beispiel malen Geraden als Funktion von den reellen
Zahlen in die reellen Zahlen, verwenden die allgemeine Funktionsvorschrift
"y = mx + n" (die
[Geradengleichung](http://de.wikipedia.org/wiki/Geradengleichung#Lineare_Funktionen))
um die Gerade zu definieren und der Graph der Funktion sieht dann so aus:

![](/uploads/funktion.png)

Graph der Funktion y=0.5x+2. Jedem x-Wert ist genau ein y-Wert
zugeordnet.

Eine Funktion liefert für einen Eingangswert genau ein Ergebnis. Für den
Wert x=0 bekommen wir aus der oben aufgezeichneten Beispielfunktion den
einen Wert y=2 heraus und so weiter.

Eine Relation liefert statt einzelner Werte Teilmengen der Ergebnismenge.
Zeichnete man statt der Funktion y = 0.5*x + 2 die Relation y > 0.5*x + 2,
dann würde man statt einer Geraden wie oben im Beispiel die Fläche über der
Geraden bekommen: Die Relation 'größer als' liefert uns in diesem
Zusammenhang nicht einen einzelnen Wert, sondern alle Werte, die für den
gegebenen x-Wert größer als 0.5*x + 2 sind.

![](/uploads/relation.png)

Graph der Relation y>0.5x+2. Einem x-Wert ist eine Menge von y-Werten
zugeordnet. Diese Menge von y-Werten ist eine Teilmenge der
Grundmenge.

Das ist genug Mathematik. Wir wollen Informatik machen.

Das bedeutet als erstes einmal: Weg mit den doofen Unendlichkeiten.
Komplexe, reelle, rationale, ja sogar natürliche Zahlen - das ist alles
unendliches, nicht anfaßbares Gekasper von irgendwelchen Mathespinnern. Wir
wollen Werte, die man anfassen und mit dem Debugger im Speicher sehen kann.
Informatik macht 
[Diskrete Mathematik](http://de.wikipedia.org/wiki/Diskrete_Mathematik),
alles schön endlich. Da kann man eine Funktion dann auch schon mal als
Wertetabelle statt als Rechenvorschrift definieren.

Und so landen wir bei den Tabellen.

## Grundmenge der Relationenalgebra: Tabellen

Tabellen bestehen aus Zeilen. Eine Zeile kann eine bestimmte Menge von
Werten enthalten, aber bei einer Tabelle enthält jede Zeile gleich viele
Werte. In der Mathematik nennt man ein Konstrukt mit n Werten ein "n-Tupel"
und schreibt es mit runden Klammern, also (3, 4, 5) für das 3-Tupel mit den
Werten 3, 4 und 5.

In der Informatik gibt es zwei Lager von Leuten. Die einen wollen die
Grundmengen von Dingen immer überall vorher festgelegt haben, also statische
Typen. Die anderen wollen an jedem Wert dranstehen haben, aus welcher
Grundmenge er stammt, also dynamische Typen. Die meisten SQL-Datenbanken
wollen statische Typen, verlangen also nicht nur, daß eine Tabelle als "Hat
3 Spalten" definiert wird, sondern daß für jede Spalte auch ein Typ festlegt
wird: (int, char(20), double) wäre eine solche Festlegung. Von allen
SQL-Datenbanken, die ich kenne, ist nur
[Sqlite](http://de.wikipedia.org/wiki/Sqlite) dynamisch getypt.

Eine Algebra, wir erinnern uns, ist eine Grundmenge und ein Haufen
Operationen, und mit den Ergebnissen der Operationen wollen wir weiter
rechnen können - sie müssen also wieder in der Grundmenge liegen.

## 5 Operationen der Relationenalgebra: Selektion, Projektion, Kreuzprodukt, Umbenennung und Aggregation

Die Elemente unserer Algebra sollen Tabellen sein, also Mengen von Tupeln: {
(1, 2, 3), (3, 4, 5), ("keks", "cookie", "kex")} zum Beispiel. Auf dieser
Menge definieren wir nun einen Haufen Operationen. Fünf, um genau zu sein.

```sql
root@localhost [kris]> create table a ( 
->  aid integer unsigned not null
->) engine = innodb;
Query OK, 0 rows affected (0.16 sec)

root@localhost [kris]> insert into a (aid) values (1), (2), (3);
Query OK, 3 rows affected (0.01 sec)
Records: 3  Duplicates: 0  Warnings: 0

root@localhost [kris]> create table b (
->   bid integer unsigned not null
-> ) engine = innodb;
Query OK, 0 rows affected (0.05 sec)

root@localhost [kris]> insert into b (bid) values (1), (2);
Query OK, 2 rows affected (0.00 sec)
Records: 2  Duplicates: 0  Warnings: 0
```


![](/uploads/selektion_projektion.png)

Operation 1: Selektion, Operation 2: Projektion. Auswahl von Zeilen und
Spalten.

Die erste Operation ist die **Selektion**. Aus allen Zeilen einer Tabelle
wählt die Selektion genau die Tupel aus, für die die angegebene Bedingung,
das angegebene Prädikat, wahr ist.

```sql
root@localhost [kris]> select aid from a where aid >= 2;
+-----+
| aid |
+-----+
|   2 |
|   3 |
+-----+
2 rows in set (0.00 sec)
```


Wir haben eine Relation: Die Ergebnismenge ist eine Teilmenge der
Ausgangsmenge und kann aus mehr als einem Tupel bestehen. Wir haben auch
eine Algebra, jedenfalls hinsichtlich der Selektion: Es wird eine Tabelle
zurück geliefert.

Die zweite Operation ist die **Projektion**. Aus allen Tupeln der Tabelle
werden neue Tupel berechnet. Die Abbildung kann die Identität sein ("select
spaltenname ...") oder das Ergebnis einer komplizierteren Funktion sein, die
ein oder mehr Stellen aus dem alten Tupel als Eingabeparameter nimmt
("select a+b ...").

```sql
root@localhost [kris]> select aid, aid*1.19  from a;
+-----+----------+
| aid | aid*1.19 |
+-----+----------+
|   1 |     1.19 |
|   2 |     2.38 |
|   3 |     3.57 |
+-----+----------+
3 rows in set (0.00 sec)
```

![](/uploads/a_join_b.png)

Operation 3: Der Join (Das Kreuzprodukt).

Die dritte Operation ist der **Join** oder das **Kreuzprodukt**. Es
verknüpft zwei Tabellen so, daß jede Zeile aus der ersten Tabelle mit jeder
Zeile aus der zweiten Tabelle kombiniert wird.

```sql
root@localhost [kris]> select aid, bid from a, b;
+-----+-----+
| aid | bid |
+-----+-----+
|   1 |   1 |
|   1 |   2 |
|   2 |   1 |
|   2 |   2 |
|   3 |   1 |
|   3 |   2 |
+-----+-----+
6 rows in set (0.00 sec)
```

Zusammen mit der Selektion kann man so Tabellen sinnvoll miteinander
verknüpfen (`select * from c, d where c.cid = d.cid`), und mit ein wenig
Evolution landet man dann bei der Schlüsselwort-Schreibweise von Joins (seit
1992 üblich): `select * from c join d on c.cid = d.cid`. Diese Schreibweise
macht Join-Bedingungen (ON-Clause) von einschränkenden Prädikaten
(WHERE-Clause) unterscheidbar und ist die empfohlene Schreibweise für Joins.

![](/uploads/rename.png)

Operation 4: Rename. Nützlich vor allen Dingen mit Self-Joins in Bäumen und
Hierarchien.

Die vierte Operation ist der **Rename** mit dem Schlüsselwort AS. Man kann
Tabellen und Spalten umbenennen. Die Rename-Operation erscheint sinnlos, ist
aber zwingend notwendig, damit man selbstreferentielle Strukturen wie Bäume
und Hierarchien abbilden kann.

```sql
root@localhost [kris]> create table emp (
->   empid integer unsigned not null, 
->   bossid integer unsigned null
-> ) engine = innodb;
Query OK, 0 rows affected (0.06 sec)

root@localhost [kris]> insert into emp 
-> values 
-> ( 1, NULL), 
-> (2, 1), (3,1), 
-> (4, 2), (5, 2), (6, 2);
Query OK, 6 rows affected (0.00 sec)
Records: 6  Duplicates: 0  Warnings: 0

root@localhost [kris]> select * from emp join emp on emp.bossid = emp.empid;
ERROR 1066 (42000): Not unique table/alias: 'emp'

root@localhost [kris]> select 
->    emp.empid as mitarbeiter,
->    " hat den Boss ", 
->    boss.empid as boss 
-> from 
->     emp as boss join emp on emp.bossid = boss.empid;
+-------------+----------------+------+
| mitarbeiter | hat den Boss   | boss |
+-------------+----------------+------+
|           2 |  hat den Boss  |    1 |
|           3 |  hat den Boss  |    1 |
|           4 |  hat den Boss  |    2 |
|           5 |  hat den Boss  |    2 |
|           6 |  hat den Boss  |    2 |
+-------------+----------------+------+
5 rows in set (0.34 sec)
```

![](/uploads/group_by.png)

Operation 5: Aggregation.

Und schließlich gibt es noch die **Aggregation**. Bei einem Aggregat hat man
ein Tupel mit n Stellen, zum Beispiel 2 Stellen und vertrachtet bei
Vergleichen nur eine Stelle, etwa die erste, um das Ergebnis in Gruppen
einzuteilen. Nehmen wir zum Beispiel noch einmal unsere Mitarbeiterliste mit
Bossen und Mitarbeitern:

```sql
root@localhost [kris]> select bossid, empid from emp;
+--------+-------+
| bossid | empid |
+--------+-------+
|   NULL |     1 |
|      1 |     2 |
|      1 |     3 |
|      2 |     4 |
|      2 |     5 |
|      2 |     6 |
+--------+-------+
6 rows in set (0.00 sec)
```

Hier haben wir einen Haufen 2-Tupel. Betrachten wir nur die erste Spalte,
dann haben wir eine Gruppe von Mitarbeitern, die dem Boss 1 unterstellt
sind, und eine Gruppe von Mitarbeitern, die dem Boss 2 unterstellt sind. In
SQL:

```sql
root@localhost [kris]> select 
->    emp.bossid,
->    count(*), 
->    group_concat(emp.empid) as mitarbeiter 
-> from 
->    emp 
-> group by 
->    emp.bossid;
+--------+----------+-------------+
| bossid | count(*) | mitarbeiter |
+--------+----------+-------------+
|   NULL |        1 | 1           |
|      1 |        2 | 2,3         |
|      2 |        3 | 4,5,6       |
+--------+----------+-------------+
3 rows in set (0.00 sec)
```


GROUP BY macht genau diese Aggregation - das Einteilen in Gruppen. In einer
Query mit GROUP BY dürfen wir vorne im SELECT-Teil nur Spalten erwähnen, die
auch im GROUP BY-Teil genannt sind, und Aggregatfunktionen. COUNT ist so
eine Aggregatfunktion - sie sagt uns, wie viele Elemente denn in der Gruppe
(1, \*) sind und wie viele in der Gruppe (2, \*). GROUP_CONCAT ist eine
weitere Funktion. Sie nimmt die Elemente der Gruppe und macht eine
Komma-Liste daraus.

Damit haben wir eine Algebra mit einer Grundmenge (Tupelmengen, also
Tabellen) und fünf einfachen Operationen, die Tabellen in andere Tabellen
umwandeln.

## Algebra bedeutet: weiterrechnen zu können

Da das ganze eine Algebra ist, heißt das: Wir können mit den Ergebnissen
einer Operation weiter Rechnen, also errechnete Tabellen in SQL-Statements
einsetzen. Dieser Mechanismus heißt in SQL **Subquery**: Wir können an jeder
Stelle eines SELECT-Statements an der Stelle von Werten oder Tabellen eine
weitere SELECT-Query einsetzen. Wenn ein einzelner Wert verlangt wird, muß
das eingesetzte SELECT ein skalares SELECT sein, also eine 1x1-Tabelle
zurück liefern.

Ein einfaches Beispiel: 

```sql
root@localhost [kris]> select sum(bid) from b;
+----------+
| sum(bid) |
+----------+
|        3 |
+----------+
1 row in set (0.00 sec)

root@localhost [kris]> select aid, ( 
->    select sum(bid) from b ) as bsum 
-> from a;
+-----+------+
| aid | bsum |
+-----+------+
|   1 |    3 |
|   2 |    3 |
|   3 |    3 |
+-----+------+
3 rows in set (0.03 sec)
```

Hier ist als Teil der SELECT-Clause statt einer Konstanten oder eines
Spaltennamen ein skalares SELECT eingesetzt worden. Die Spalte bsum ist das
Ergebnis der Abfrage "select sum(bid) from b" und wird dort eingesetzt.

Auch in der FROM-Clause eines SELECT kann man SELECT-Statements einsetzen.
Diese Query zum Beispiel listet zu jedem Schema auf, wie viele Zeilen die
größte Tabelle in diesem Schema hat:


```sql
root@localhost [test_world]> select 
->    table_schema, 
->    max(table_rows)
-> from 
->    information_schema.tables 
-> group by 
->    table_schema;
+--------------------+-----------------+
| table_schema       | max(table_rows) |
+--------------------+-----------------+
| geodb              |          459015 |
| information_schema |            NULL |
| kris               |               6 |
| mysql              |             986 |
| test               |              12 |
| test_tablesizes    |              79 |
| test_world         |            4079 |
+--------------------+-----------------+
7 rows in set (3.92 sec)
```


Wenn wir nun den Namen der Tabelle ermitteln wollen, die in diesem Schema
die meisten Zeilen hat, dann geht das unter anderem so:

```sql
root@localhost [test_world]> create table tables as 
-> select * from information_schema.tables;
Query OK, 93 rows affected (1.12 sec)
Records: 93  Duplicates: 0  Warnings: 0

root@localhost [test_world]> select 
->    m.table_schema, 
->    t.table_name, 
->    m.maxrows 
-> from 
->    tables as t join 
->    (select table_schema, max(table_rows) as maxrows 
->    from tables group by table_schema ) as m 
->        on t.table_rows = m.maxrows;
+-----------------+----------------+---------+
| table_schema    | table_name     | maxrows |
+-----------------+----------------+---------+
| geodb           | geodb_textdata |  466518 |
| kris            | emp            |       6 |
| mysql           | help_relation  |     986 |
| test            | h              |      12 |
| kris            | p              |       6 |
| test            | t              |      12 |
| test_tablesizes | sizes          |      79 |
| test_world      | City           |    4079 |
+-----------------+----------------+---------+
8 rows in set (0.00 sec)
```

In einem ersten Schritt machen wir hier einen Snapshot von
information_schema.tables. Das ist nicht nur schneller, sondern es bewirkt
auch, daß wir statische Daten bekommen. Dadurch haben zwei aufeinander
folgende Anfragen an die Tabelle auch identische Werte - das ist bei
information_schema sonst nicht zwingend gegeben.

Die zweite Query setzt die Tabelle aus dem ersten Beispiel in der
FROM-Clause ein und joined sie gegen unseren information_schema Snapshot.
Wir fragen nun nach dem Schema und dem Namen der Tabelle, die dieselbe Größe
hat, wie das in der Subquery ermittelte Maximum. Es gibt viele Wege, um
dieses Problem 'Finde das gruppenweise Maximum' zu lösen - 
[Jan Kneschke](http://jan.kneschke.de/projects/mysql/groupwise-max/) hat eine
Übersicht.

Auch in einer WHERE-Clause können wir eine Subquery einbauen. Gemäß dem
Beispiel von Jan:

```sql
root@localhost [test_world]> select 
->    t.table_schema, 
->    t.table_name, 
->    t.table_rows 
-> from 
->    tables as t 
-> where 
->    t.table_rows = ( 
->        select max(table_rows) as maxrows 
->        from tables as m 
->        where 
->            t.table_schema = m.table_schema 
->    );
+-----------------+----------------+------------+
| table_schema    | table_name     | table_rows |
+-----------------+----------------+------------+
| geodb           | geodb_textdata |     466518 |
| kris            | emp            |          6 |
| mysql           | help_relation  |        986 |
| test            | h              |         12 |
| test            | t              |         12 |
| test_tablesizes | sizes          |         79 |
| test_world      | City           |       4079 |
+-----------------+----------------+------------+
7 rows in set (0.00 sec)
```


Das liest sich als: Liste mir alle Tabellen mit ihrer Größe, bei denen die
Größe der maximalen Größe der Tabelle entspricht, die im selben Schema ist
wie die aktuelle Tabelle.

Weitere Anwendungsfälle von Subqueries finden sich im Beispiel von Jan und
[im Handbuch](http://dev.mysql.com/doc/refman/5.1/en/subqueries.html) - mir
geht es hier in erster Linie darum zu zeigen, wie die Algebra-Eigenschaft
von SQL das Weiterrechnen mit den Ergebnissen erlaubt.

## Tupel als Datentyp

Tabellen sind Mengen von Tupeln, und Tupel sind ein Datentyp in SQL, mit dem
man arbeiten kann. Mit der Tabelle

```sql
root@localhost [kris]> select * from t;
+------+-------+------+
| a    | b     | c    |
+------+-------+------+
| eins | one   | 1    |
| zwei | two   | 2    |
| drei | three | 3    |
| 1    | eins  | one  |
+------+-------+------+
4 rows in set (0.00 sec)
```

läßt sich die einfache Anfrage 

```sql
root@localhost [kris]> select a,b,c from t where a = 'eins' and b = 'one';
+------+------+------+
| a    | b    | c    |
+------+------+------+
| eins | one  | 1    |
+------+------+------+
1 row in set (0.00 sec)
```

auch so schreiben: 

```sql
root@localhost [kris]> select a,b,c from t where (a,b) = ('eins','one');
+------+------+------+
| a    | b    | c    |
+------+------+------+
| eins | one  | 1    |
+------+------+------+
1 row in set (0.00 sec)
```

Erweitert kann man auch nach mehr als einem Wert fragen: 

```sql
root@localhost [kris]> select * from t where (a,b) in (('eins','one'), ('zwei', 'two'));
+------+------+------+
| a    | b    | c    |
+------+------+------+
| eins | one  | 1    |
| zwei | two  | 2    |
+------+------+------+
2 rows in set (0.00 sec)
```

Manchmal will man nach einem Wert in irgendeiner Spalte suchen: 
```sql
root@localhost [kris]> select a,b,c from t 
-> where 'eins' in (a,b,c);
+------+------+------+
| a    | b    | c    |
+------+------+------+
| eins | one  | 1    |
| 1    | eins | one  |
+------+------+------+
2 rows in set (0.00 sec)
```

ist "Finde mir alle Zeilen, in denen in einer Spalte der Wert 'eins'
vorkommt.". Auch das geht mit Tupeln. In diesem Fall will ich, daß 'eins'
und 'one' in benachbarten Spalten vorkommen:

```sql
root@localhost [kris]> select a,b,c from t 
-> where ('eins','one') in ((a,b),(b,c));
+------+------+------+
| a    | b    | c    |
+------+------+------+
| eins | one  | 1    |
| 1    | eins | one  |
+------+------+------+
2 rows in set (0.00 sec)
```

Leider ist MySQL nicht ganz konsequent mit der Umsetzung von Tupeln als
Datentyp: Man kann den Aufruf einer Stored Procedure ('CALL blah()') nicht
in einer Subquery verwenden.

## Abfragesprachen, die keine Algebra sind

Viele Abfragesprachen existieren, die keine Algebra sind, bei denen also die
Ergebnisse nicht von der Art sind, daß man mit ihnen weiter rechnen könnte.

Ein klassisches Beispiel ist LDAP: LDAP definiert Operationen auf einem
Baum, dem LDAP-Baum. Das Ergebnis einer LDAP-Query ist jedoch kein Teilbaum,
sondern eine Knotenmenge. Diese kann mit LDAP-Operationen nicht weiter
verfeinert oder verarbeitet werden. Das Ergebnis: LDAP-Server sind zwar sehr
schnell und können zum Teil hunderttausende von Anfragen pro Sekunde
verarbeiten. Aber Dinge, die man in SQL mit einer Query erledigen könnte
brauchen in LDAP dann auch hunderttausende von Anfragen.

Ein weiteres klassisches Beispiel: XPath. XPath definiert ebenfalls einen
Baum als Datentyp und Operationen darauf. Das Ergebnis einer XPath-Query ist
jedoch ein Nodeset, kein Baum, kann also mit XPath auch nicht weiter
verarbeitet werden (aber XSLT ist sowieso so angelegt, daß der Zugriff auf
Ergebnisse zur Weiterverarbeitung mindestens stark erschwert wird, wenn
nicht sogar unmöglich gemacht wird).

In beiden Fällen schränkt sich die Abfragesprache in ihren Möglichkeiten
stark ein und erfordert dann mehr Code (und mehr Kommunikation, und damit
mehr Latenz) in der Hostsprache, in der sie eingebettet ist.
