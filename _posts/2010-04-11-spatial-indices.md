---
layout: post
published: true
title: Spatial Indices
author-id: isotopp
date: 2010-04-11 10:34:00 UTC
tags:
- mysql
- lang_de
feature-img: assets/img/background/mysql.jpg
---
On 2010-04-06 12:26:49 +0200, 
[Egon Schmid](http://groups.google.com/group/de.comp.datenbanken.mysql/msg/a7f1b9043c202ef1?hl=de&dmode=source&output=gplain) said: 

> Ich hab eine 60 MB grosse SQL-Datei von der OpenGeoDB
> (->http://fa-technik.adfc.de/code/opengeodb/) runtergeladen, wo sämtliche
> Informationen der Deutschlandkarte vorhanden sind, und werde es damit mal
> testen.Das Ausführen der INSERTs dauert allerdings einige Stunden :) Es
> läuft derzeit immer noch...

InnoDB, AUTOCOMMIT = 1. Vor dem source von DE.sql ein BEGIN WORK machen, danach
ein COMMIT. Dann geht es sehr viel schneller.

Mit diesen Daten und einem Beispielort kann man experimentieren. 

```sql
root@localhost [geodb]> select 
    td.loc_id, td.text_val, tn.name 
from 
   geodb_textdata as td join 
   geodb_type_names as tn on 
       td.text_type = tn.type_id 
where
   td.text_val = 'Kiel' and 
   tn.name = 'Name';
+--------+----------+------+
| loc_id | text_val | name |
+--------+----------+------+
|    469 | Kiel     | Name |
|  19236 | Kiel     | Name |
+--------+----------+------+
2 rows in set (0.00 sec)
```

Zum Beispiel finden wir mal alles, was um den Beispielort herum liegt:

```sql
root@localhost [geodb]> explain select 
    co.loc_id, td.text_val 
from 
    geodb_coordinates as co join 
    geodb_textdata as td on 
        co.loc_id = td.loc_id join 
    geodb_type_names as tn on 
        td.text_type = tn.type_id 
where 
    lat = 54.3333 and 
    lon = 10.1333 and 
    tn.name = 'Name'\G
=== 1. row ===
           id: 1
  select_type: SIMPLE
        table: co
         type: index_merge
possible_keys: coord_loc_id_idx,coord_lon_idx,coord_lat_idx
          key: coord_lat_idx,coord_lon_idx
      key_len: 9,9
          ref: NULL
         rows: 1
        Extra: Using intersect(coord_lat_idx,coord_lon_idx); Using where
=== 2. row ===
           id: 1
  select_type: SIMPLE
        table: tn
         type: ref
possible_keys: type_id,tid_tnames_idx,name_tnames_idx
          key: name_tnames_idx
      key_len: 767
          ref: const
         rows: 1
        Extra: Using where; Using index
=== 3. row ===
           id: 1
  select_type: SIMPLE
        table: td
         type: ref
possible_keys: text_lid_idx,text_type_idx
          key: text_lid_idx
      key_len: 4
          ref: geodb.co.loc_id
         rows: 2344
        Extra: Using where
3 rows in set (0.00 sec)
```

Wie man sieht wird ein index_merge (intersect) verwendet, wenn man mit
festen Koordinaten arbeitet. Hier das Ergebnis:

```sql
root@localhost [geodb]> select
    co.loc_id, td.text_val 
from 
    geodb_coordinates as co join 
    geodb_textdata as td on 
        co.loc_id = td.loc_id join
    geodb_type_names as tn 
        on td.text_type = tn.type_id 
where
    lat = 54.3333 and 
    lon = 10.1333 and 
    tn.name = 'Name'\G
=== 1. row ===
  loc_id: 469
text_val: Kiel
=== 2. row ===
  loc_id: 19236
text_val: Kiel
....
=== 13. row ===
  loc_id: 106031
text_val: Wik
13 rows in set (0.01 sec)
```

Eine Umkreissuche (BETWEEN) sieht wesentlich schlechter aus - Axel Schwenke
hat das ja bereits erläutert - der Index-Merge funktioniert derzeit nur bei
Konstanten:

```sql
root@localhost [geodb]> explain select 
    co.loc_id, td.text_val 
from 
    geodb_coordinates as co join 
    geodb_textdata as td on 
        co.loc_id = td.loc_id join 
    geodb_type_names as tn on 
        td.text_type = tn.type_id 
where 
    lat between 54.3 and 54.4 and 
    lon between 10.1 and 10.2 and 
    tn.name = 'Name'\G
=== 1. row ===
           id: 1
  select_type: SIMPLE
        table: tn
         type: ref
possible_keys: type_id,tid_tnames_idx,name_tnames_idx
          key: name_tnames_idx
      key_len: 767
          ref: const
         rows: 1
        Extra: Using where; Using index
=== 2. row ===
           id: 1
  select_type: SIMPLE
        table: td
         type: ref
possible_keys: text_lid_idx,text_type_idx
          key: text_type_idx
      key_len: 4
          ref: geodb.tn.type_id
         rows: 2344
        Extra: 
=== 3. row ===
           id: 1
  select_type: SIMPLE
        table: co
         type: ref
possible_keys: coord_loc_id_idx,coord_lon_idx,coord_lat_idx
          key: coord_loc_id_idx
      key_len: 4
          ref: geodb.td.loc_id
         rows: 303
        Extra: Using where
3 rows in set (0.00 sec)
```

Hier die Laufzeit: 

```sql
root@localhost [geodb]> select 
    co.loc_id, td.text_val
from 
    geodb_coordinates as co join 
    geodb_textdata as td on 
        co.loc_id = td.loc_id join 
    geodb_type_names as tn on 
        td.text_type = tn.type_id 
where
    lat between 54.3 and 54.4 and 
    lon between 10.1 and 10.2 and 
    tn.name = 'Name'\G
=== 1. row ===
  loc_id: 469
text_val: Kiel
=== 2. row ===
  loc_id: 19236
text_val: Kiel
....
=== 30. row ===
  loc_id: 106953
text_val: Rammsee
30 rows in set (0.50 sec)
```

Wir können versuchen, mit einem RTREE dabei zu gehen. Dazu brauchen wir die
Daten in MyISAM:

```sql
root@localhost [geodb]> create table co 
    like geodb_coordinates;
Query OK, 0 rows affected (0.18 sec)

root@localhost [geodb]> alter table co engine = myisam;
Query OK, 0 rows affected (0.18 sec)
Records: 0  Duplicates: 0  Warnings: 0

root@localhost [geodb]> insert into co select * from geodb_coordinates;
Query OK, 60645 rows affected (0.50 sec)
Records: 60645  Duplicates: 0  Warnings: 0
```

Wir müssen außerdem eine Spalte latlon als POINT anlegen und einen SPATIAL index auf diesen Point setzen: 

```sql
root@localhost [geodb]> alter table co 
     add column latlon point not null, 
     add spatial index (latlon);
Query OK, 60645 rows affected (0.83 sec)
Records: 60645  Duplicates: 0  Warnings: 0
```

Die lat und lon Daten müssen nach latlon konvertiert werden: 

```sql
-- 5.1.35 or later
root@localhost [geodb]> update co 
    set latlon = point(lat, lon);
Query OK, 60645 rows affected (1.45 sec)
Rows matched: 60645  Changed: 60645  Warnings: 0
-- older MySQL: update co 
--     set latlon = GeomFromText(concat('Point(', lat,',',lon)));
```

Ein kleiner Test: 

```sql
root@localhost [geodb]> select 
    astext(latlon)
from 
    co 
limit 10;
+------------------------------------------+
| astext(latlon)                           |
+------------------------------------------+
| POINT(54.7833 9.43333)                   |
| POINT(54.7833 9.43333)                   |
| POINT(54.3333 10.1333)                   |
| POINT(54.3333 10.1333)                   |
| POINT(53.8667 10.7)                      |
| POINT(53.8667 10.7)                      |
| POINT(54.0667 9.98333)                   |
| POINT(54.0667 9.98333)                   |
| POINT(54.1474367521367 9.11139581196581) |
| POINT(54.15 9.28333)                     |
+------------------------------------------+
10 rows in set (0.02 sec)
```

Die Tabelle sieht jetzt so aus: 

```sql
root@localhost [geodb]> show create table co\G
=== 1. row ===
       Table: co
Create Table: CREATE TABLE `co` (
  `loc_id` int(11) NOT NULL,
  `coord_type` int(11) NOT NULL,
  `lat` double DEFAULT NULL,
  `lon` double DEFAULT NULL,
  `coord_subtype` int(11) DEFAULT NULL,
  `valid_since` date DEFAULT NULL,
  `date_type_since` int(11) DEFAULT NULL,
  `valid_until` date NOT NULL,
  `date_type_until` int(11) NOT NULL,
  `latlon` point NOT NULL,
  KEY `coord_loc_id_idx` (`loc_id`),
  KEY `coord_lon_idx` (`lon`),
  KEY `coord_lat_idx` (`lat`),
  KEY `coord_type_idx` (`coord_type`),
  KEY `coord_stype_idx` (`coord_subtype`),
  KEY `coord_since_idx` (`valid_since`),
  KEY `coord_until_idx` (`valid_until`),
  SPATIAL KEY `latlon` (`latlon`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8
1 row in set (0.00 sec)
```

Wir definieren unseren Suchumkreis einmal als @poly Variable. Danach wird
einiges einfacher:

```sql
root@localhost [geodb]> set @poly = 'Polygon((54.3 10.1, 54.4 10.1, 54.4 10.2,54.3 10.2, 54.3 10.1 ))';
Query OK, 0 rows affected (0.00 sec)
```

Wird unser SPATIAL Index denn auch verwendet? Wir testen:

```sql
root@localhost [geodb]> explain select 
    co.loc_id 
from 
    co
where
    mbrcontains(geomfromtext(@poly), co.latlon)\G
=== 1. row ===
           id: 1
  select_type: SIMPLE
        table: co
         type: range
possible_keys: latlon
          key: latlon
      key_len: 34
          ref: NULL
         rows: 11
        Extra: Using where
1 row in set (0.00 sec)
```

In der richtigen Suche müssen wir einen STRAIGHT_JOIN forcen, weil sonst die
Join-Order und die Indexverwendung nicht stimmt:

```sql
root@localhost [geodb]> explain select straight_join 
    co.loc_id, td.text_val 
from 
    co as co join 
    geodb_textdata as td 
        on co.loc_id = td.loc_id join 
    geodb_type_names as tn on 
        td.text_type = tn.type_id
where 
    tn.name = 'Name' and 
    mbrcontains(geomfromtext(@poly), co.latlon)\G
=== 1. row ===
           id: 1
  select_type: SIMPLE
        table: co
         type: range
possible_keys: coord_loc_id_idx,latlon
          key: latlon
      key_len: 34
          ref: NULL
         rows: 11
        Extra: Using where
=== 2. row ===
           id: 1
  select_type: SIMPLE
        table: td
         type: ref
possible_keys: text_lid_idx,text_type_idx
          key: text_lid_idx
      key_len: 4
          ref: geodb.co.loc_id
         rows: 2344
        Extra: 
=== 3. row ===
           id: 1
  select_type: SIMPLE
        table: tn
         type: ref
possible_keys: type_id,tid_tnames_idx,name_tnames_idx
          key: type_id
      key_len: 4
          ref: geodb.td.text_type
         rows: 1
        Extra: Using where
3 rows in set (0.00 sec)
```

Und hier die Ausgabe: 

```sql
root@localhost [geodb]> select straight_join 
    co.loc_id, td.text_val
from 
    co as co join
    geodb_textdata as td on
        co.loc_id = td.loc_id join 
    geodb_type_names as tn on 
        td.text_type = tn.type_id 
where 
    tn.name = 'Name' and 
    mbrcontains(geomfromtext(@poly), co.latlon)\G
=== 1. row ===
  loc_id: 18070
text_val: Heikendorf
=== 2. row ===
  loc_id: 21024
text_val: Mönkeberg
...
=== 30. row ===
  loc_id: 19236
text_val: Kiel
30 rows in set (0.00 sec)
```
