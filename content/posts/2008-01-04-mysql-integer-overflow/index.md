---
author: isotopp
date: "2008-01-04T08:14:43Z"
feature-img: assets/img/background/mysql.jpg
tags:
  - database
  - mysql
  - lang_de
title: 'MySQL: Integer Overflow'
aliases:
  - /2008/01/04/mysql-integer-overflow.html
---

Der Fotodienst 
[Flickr](http://de.wikipedia.org/wiki/Flickr#Geschichte)
wurde vor 5 Jahren in Betrieb genommen. 
Am 29. Dezember wurde 
[das Foto 2147483647](http://www.flickr.com/photo_exif.gne?id=2147483647) 
auf Flickr hochgeladen. 
Diese Zahl ist 2 hoch 31 minus 1, also `MAXINT` für einen 32 Bit Signed Integer.
Dies hat zu einem 
[Integer Overflow in einer Bibliothek](http://blog.driftr.com/post/20) 
geführt, die Signed Integer als ID für Flickr-Bilder verwendet hat.

Hier sind ein paar simple Abfragen von `INFORMATION_SCHEMA`, mit denen man offensichtliche Designdummheiten bei Datenbankschemata finden kann: 

```console
mysql> select table_schema, table_name, column_name, column_type 
from information_schema.columns 
where table_schema not in ("information_schema", "mysql") 
and column_name like "%id%"
-- and column_type not like "%unsigned%";
+--------------+------------+-------------+---------------------+
| table_schema | table_name | column_name | column_type         |
+--------------+------------+-------------+---------------------+
| rootforum    | counter    | id          | bigint(20) unsigned |
| rootforum    | s          | id          | bigint(20) unsigned |
| rootforum    | t          | id          | bigint(20) unsigned |
| rootforum    | telefon    | id          | bigint(20) unsigned |
+--------------+------------+-------------+---------------------+
4 rows in set (0.01 sec)
```

Diese Query durchsucht `INFORMATION_SCHEMA.COLUMNS` nach allen Spalten, die ein `id` im Namen haben, aber, wenn man den auskommentierten Teil aktiviert, nicht als `UNSIGNED` definiert sind.
Das ist schon mal ein recht offensichtlicher Fehler, den man sich von vorneherein schenken kann. 
Für die meisten Menschen - im Grunde jeder außer Flickr - sollte ein `INTEGER UNSIGNED` als `PRIMARY KEY` ausreichen.
Ein `BIGINT UNSIGNED` ist doppelt so groß, und speichert 2^32 mal mehr Daten.
Kann man benutzen, muss man aber nicht dringend tun und hat so ein wenig was von Größenwahn.

Dieselbe Regel kann man auch auf Spalten anwenden, die etwa ein `price` oder `%age%` im Namen haben (oder die mit `INET_ATON()` in `INTEGER UNSIGNED` umgewandelte IP V4 Nummern abspeichern sollen).

Wenig bekannt: Auch eine `SERVER_ID` ist in MySQL ein `INTEGER UNSIGNED`. Sollte man bedenken, wenn man Werkzeuge zur Administration von MySQL-Servern entwickelt.
