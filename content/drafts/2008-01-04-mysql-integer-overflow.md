---
author-id: isotopp
date: "2008-01-04T08:14:43Z"
draft: true
feature-img: assets/img/background/rijksmuseum.jpg
tags:
- datenbanken
- mysql
- sql
- lang_de
title: 'MySQL: Integer Overflow'
---
<!-- s9ymdb:3519 --><img width="110" height="57" style="float: right; border: 0px; padding-left: 5px; padding-right: 5px;" src="/uploads/mysql_logo.serendipityThumb.gif" alt="" /> Der Fotodienst <a href="http://de.wikipedia.org/wiki/Flickr#Geschichte">Flickr</a> wurde vor 5 Jahren in Betrieb genommen. Am 29. Dezember wurde <a href="http://www.flickr.com/photo_exif.gne?id=2147483647">das Foto 2147483647</a> auf Flickr hochgeladen. Diese Zahl ist 2 hoch 31 minus 1, also MAXINT für einen 32 Bit Signed Integer. Dies hat zu einem <a href="http://blog.driftr.com/post/20">Integer Overflow in einer Bibliothek</a> geführt, die Signed Integer als ID für Flickr-Bilder verwendet hat.

Hier sind ein paar simple Abfragen von INFORMATION\_SCHEMA, mit denen man offensichtliche Designdummheiten bei Datenbankschemata finden kann: 
{{< highlight console >}}
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
{{< / highlight >}}


Diese Query durchsucht INFORMATION\_SCHEMA.COLUMNS nach allen Spalten, die ein "id" im Namen haben, aber, wenn man den auskommentierten Teil aktiviert, nicht als UNSIGNED definiert sind. Das ist schon mal ein recht offensichtlicher Fehler, den man sich von vorne herein schenken kann. Für die meisten Menschen - im Grunde jeder außer Flickr - sollte ein INTEGER UNSIGNED als PRIMARY KEY ausreichen. Ein BIGINT UNSIGNED ist doppelt so groß, und speichert 2\^32 mal mehr Daten. Kann man benutzen, muß man aber nicht dringend tun und hat so ein wenig was von Größenwahn.

Dieselbe Regel kann man auch auf Spalten anwenden, die etwa ein "price" oder "%age%" im Namen haben (oder die mit INET\_ATON() in INTEGER UNSIGNED umgewandelte IP V4 Nummern abspeichern sollen).

Wenig bekannt: Auch eine SERVER\_ID ist in MySQL ein INTEGER UNSIGNED. Sollte man bedenken, wenn man Werkzeuge zur Administration von MySQL-Servern entwickelt.
