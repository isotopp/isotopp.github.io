---
layout: post
published: true
title: Zählen von Aktionen
author-id: isotopp
date: 2010-04-21 12:49:00 UTC
tags:
- mysql
- lang_de
feature-img: assets/img/background/mysql.jpg
---
Hier ist noch ein dreckiges kleines MySQL-Problem. Matthias Fiedler fragt: 

> Ich möchte in einer Tabelle bestimmte Werte bzw. Datensätze ändern. Das
> läuft in einer Schleife und ich möchte mitzählen, wie viele Datensätze
> wirklich geändert wurden….
>
> Wenn ich nur Update benutze und der Datensatz in der Tabelle ist identisch
> mit dem neuen, dann wird kein Update ausgeführt. Somit kann ich hier mit
> mysql_affected_rows() die Menge zählen. Das hat aber einen Nachteil:
> Manche Datensätze sind ja noch gar nicht in der Tabelle. Da geht ja dann
> auch kein Update.
>
> Also müsste ich erst mal per Select prüfen, ob ein Datensatz da ist und
> dann entscheiden, ob ich den per Update ersetze oder per Insert neu
> einstelle oder gar nichts mache. Dann ist zwar das zählen wieder simpel,
> weil man gar keine sql Funktion dazu mehr braucht. Aber ich muß immer erst
> ein Select ausführen.
>
> Ein Replace oder ein ON DUPLICATE KEY UPDATE machen das halt in einem. Wie
> kann ich nun alle 3 Varianten (also Update, Insert, oder nichts) mit einem
> mysql Befehl abarbeiten und auch noch mitzählen?

Das geht so:

Lege eine Beispieltabelle an und fülle sie mit Beispielwerten:

```sql
root@localhost [kris]> create table t ( 
  id integer unsigned not null primary key, 
  d integer unsigned not null 
) engine = innodb;
Query OK, 0 rows affected (0.16 sec)

root@localhost [kris]> insert into t values ( 1, 1), (2,2), (3,3);
Query OK, 3 rows affected (0.00 sec)
Records: 3  Duplicates: 0  Warnings: 0
```

Jetzt initialisiere einen Zähle als Connection-Variable:

```sql
root@localhost [kris]> set @x = 0;
Query OK, 0 rows affected (0.00 sec)
```

Hier kommt dann die Magie: Wir zählen den Zähler in einer Update-Clause
eines INSERT ON DUPLICATE KEY UPDATE mit hoch. Da wir den eigentlichen
Zählerwert im Statement selber nicht brauchen, multiplizieren wir ihn mit 0
und addieren ihn dann irgendwo zu (irgendwas plus 0 ist halt irgendwas -
neutrales Element der Addition).

```sql
root@localhost [kris]> insert into t values (4,4), (2,1), (3, 1) 
-> on duplicate key update 
-> d= values (d) + 0* ( @x := @x +1 );

Query OK, 5 rows affected (0.00 sec)
Records: 3  Duplicates: 2  Warnings: 0
```

Kleine Gegenkontrolle: Wie viele UPDATE-Zweige haben wir betreten?

```sql
root@localhost [kris]> select @x;
+------+
| @x   |
+------+
|    2 |
+------+
1 row in set (0.00 sec)

root@localhost [kris]> select * from t;
+----+---+
| id | d |
+----+---+
|  1 | 1 |
|  2 | 1 |
|  3 | 1 |
|  4 | 4 |
+----+---+
4 rows in set (0.00 sec)
```

Wir sollten mit values(id) und einem concat() sogar eine Liste der
Primärschlüssel bekommen können, die wir angefaßt haben.

```sql
root@localhost [kris]> set @id = "";
Query OK, 0 rows affected (0.00 sec)

root@localhost [kris]> set @x = 0;
Query OK, 0 rows affected (0.00 sec)

root@localhost [kris]> insert into t 
-> values (4,4), (2,1), (3, 1)
-> on duplicate key update 
-> d= values (d) + 0 * ( @x := @x +1 ), 
-> id = concat(values(id), 
->   substring(@id := concat(@id, ",", values(id)) , 1, 0));
Query OK, 5 rows affected (0.00 sec)
Records: 3  Duplicates: 2  Warnings: 0
```

Und wirklich: 

```sql
root@localhost [kris]> select @x, @id;
+------+------+
| @x   | @id  |
+------+------+
|    2 | ,2,3 |
+------+------+
1 row in set (0.00 sec)
```


Und falls einer von Euch jetzt einwirft "Ich wußte nicht, daß man das machen
kann": Ich auch nicht. Und machen SOLLTE man das wahrscheinlich auch nicht.

**Nachtrag:** Ich habe diesen Aufschrieb dann mal an eine Kollegin
gesendet. Liz meinte dazu:

> Indeed, intriguing…. Now for you at home:  what where the values previous
> to the update, associated with the PK's updated? If we can reliably solve
> that, then we could actually get rid of a lot of selects on the master
> database.

Für ausreichend kleine Werte von Reliable kann man mit einer noch
dreckigeren Lösung nachsetzen:

```sql
set @counter = 0;
set @_id = "";
set @_d = "";
delete from t;
insert into t values (1,10), (2,20), (3,30);
insert into t 
values (4,4), (2,1), (3, 1)
 on duplicate key update 
 d= values (d) + 
    0* ( @counter := @counter +1 ) + 
    0* ( @_d := concat(@_d, ",", coalesce(d, ""))), 
 id = concat(values(id), 
   substring(@_id := concat(@_id, ",", values(id)) , 1, 0));
select @counter, @_id, @_d;
```

Und das druckt: 

```sql
root@localhost [kris]> select @counter, @_id, @_d;
+----------+------+--------+
| @counter | @_id | @_d    |
+----------+------+--------+
|        2 | ,2,3 | ,20,30 |
+----------+------+--------+
1 row in set (0.00 sec)
```
