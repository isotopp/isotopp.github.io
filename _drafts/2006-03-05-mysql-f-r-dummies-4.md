---
layout: post
published: true
title: MySQL für Dummies (4)
author-id: isotopp
date: 2006-03-05 17:00:00 UTC
tags:
- mysql
- lang_de
feature-img: assets/img/background/rijksmuseum.jpg
---
Wie wir in den vorangegangenen Beispielen gesehen haben, reicht es nicht aus, einer Datenbank zu sagen, welche Daten sie zu suchen hat. Wir müssen ihr auch noch Hilfen geben, mit denen sie in der Lage ist, diese Aufgabe schnell zu erfüllen. Eine sehr wichtige solche Hilfe ist ein Index.

Eine MYD-Datei wird, wenn sie keine Lücken hat, durch Anfügen von neuen Datensätzen verlängert. Die natürliche Reihenfolge der Datensätze in einer MYD-Datei ohne Löschen ist also chronologisch. Wenn in der MYD-Datei auch gelöscht wird, werden die Dinge komplizierter, denn MySQL wird versuchen, die Lücken aufzufüllen. Die Reihenfolge der Datensätze ist dann zufällig.

Das gleicht einer Bücherei, bei der neu gekaufte Bücher einfach hinten in die freien Regale gestellt werden, und wenn Lücken vorhanden sind, diese aufgefüllt werden.

Ein Index ist eine Struktur, die uns erlaubt, bestimmte Suchen schneller durchzuführen. Büchereien haben zum Beispiel oft einen Titelkatalog oder einen Autorenkatalog. Ein Autorenkatalog entsteht, indem wir die Autoren aller Bücher in der Bücherei zusammen mit dem Regalstandort des Buches auf Notizkarten aufschreiben und diese Karten dann alphabetisch nach Autoren sortieren.

In einem sortierten Datenbestand kann man nämlich sehr schnell suchen. Wenn auf den Autorenkarten keine Reiter "a", "b", "c", ... vorhanden sind, kann man "Suchen durch Halbieren": Ein Buch von "Jeremy Zawodny" findet man, indem man den die Autorenliste halbiert und dann prüft, ob der Autor in der ersten oder zweiten Hälfte der Bücher zu finden ist. Diese Hälfte halbiert man dann wieder, und so weiter und so weiter.


Für zwei Bücher kann man so mit einer Operation entscheiden, welches von beiden Büchern das gesuchte ist. Für vier Bücher braucht man eine Operation, um dies auf den Fall mit zwei Büchern zurück zu führen, also zwei Operationen insgesamt. Für acht Bücher kann man dies mit einer Operation auf den Fall mit vier Büchern reduzieren.

Allgemein braucht man für n Bücher dann also log(2,n) Operationen, um ein Buch eines bestimmten Autors zu finden.


{% highlight console %}

Bücher   Suchoperationen
     2   1 (2^[b]1[/b] = 2)
     4   2 (2^[b]2[/b] = 4)
     8   3 (2^[b]3[/b] = 8)

     n   e = log(2, n) (2^e = n)

{% endhighlight %}


Aus einer Bibliothek mit 20 Millionen Büchern kann man also mit weniger als 24-25 Operationen die Bücher von Jeremey Zawodny finden, wenn man einen nach Autorennamen sortierten Katalog zur Verfügung hat (Man bekommt so eine Liste der Standorte, und muß dann zu den auf den Karten notierten Standorten laufen, um die Bücher tatsächlich abzuholen).


{% highlight console %}
root@localhost [(none)]> select log(20000000)/log(2) as ops;
+-----------------+
| ops             |
+-----------------+
| 24.253496664212 |
+-----------------+
1 row in set (0.00 sec)

{% endhighlight %}


Das Beispiel macht Gebrauch von der Beobachtung, daß man mit einer beliebigen Logarithmusfunktion jede andere Logarithmusfunktion berechnen kann, indem man einfach log(b, n) in log(n)/log(b) umformt. MySQL stellt mit den Funktionen exp() und log() die Exponentialfunktionen und Logarithmusfunktionen zur Basis e = 2.718281828459 zur Verfügung, sodaß log(20000000)/log(2) hier den log(2, 20000000) bestimmt.

Tatsächlich befinden sich auf den Karten in einer Bibliothek aber Reiter, sodaß man gleich unter "Z" nachschauen kann, also bei gleichverteilten Autorennamen schon mit dem ersten Schritt nur noch ein Sechsundzwanzigstel aller Bücher durchsuchen muß statt die Hälfte. Wäre nun auf allen Z-Karten "Za", "Zb", und so weiter notiert, würde auch der zweite Schritt nur sechsundzwanzigsteln, und so weiter. Man bräuchte dann bei 20 Millionen Büchern nur noch 5-6 Schritte, um alle Bücher von Jeremy Zawodny zu finden.


{% highlight console %}
root@localhost [(none)]> select log(20000000)/log(26);
+-----------------------+
| log(20000000)/log(26) |
+-----------------------+
|       5.1598357001807 |
+-----------------------+
1 row in set (0.00 sec)
{% endhighlight %}



Nun sind die Namen von Buchautoren aber nicht gleichverteilt. Stattdessen könnte man aber auch wie bei einem  Lexikon vorgehen und in regelmäßigen Abständen, etwa für jeweils eine Million Autoren, Proben nehmen: Band 1 von A-E, Band 2 von F-L und so weiter. Innerhalb der Million würde man dann für jeweils einen 100.000er Block vermerken A-Be, Bf-Ca, und so weiter, und auf den weiteren Ebenen genauso. Dann hätte man gleich große Blöcke, und wüßte für jeden Block, welche Buchstabenintervalle darin enthalten sind.

Beim Einfügen von Werten muß man jedoch unter Umständen Werte aus dem 1. 100.000er-Block in den zweiten Verschieben und so weiter: Kommt Arnold dazu, muß Bertram unter Umständen in den 2. Block und die Blockgrenzen sind nun A-Bd, Be-Ca.

So einen Index bezeichnet man als balancierten Baum (Btree), und das ist genau das, was MySQL verwendet. Die Schiebeoperationen nennt man Rebalancing des Baumes, und die will man gerne vermeiden.

Eine MYI-Datei besteht also aus Blöcken von key_cache_block_size (normal 1024) Byte Größe. Ein Key Cache Block enthält was immer wir indizieren wollen und Zeiger in die MYD-Datei. Das sind entweder Byte-Offsets (Row_format: dynamic) oder Datensatznummern (Row_format: fixed). Wenn wir also eine INTEGER-Spalte indizieren, braucht jeder Eintrag im Index 4 Byte für die zu indizierende Spalte plus 4 Byte Zeiger in die Daten. In einen 1024-Block passen so also 1024/8 = 2^10/2^3 = 2^(10-3) = 2^7 = 128 Einträge.

Durch Laden dieses Blocks können wir also die Suche im Index nicht "durch Halbieren" oder "durch sechsundzwanzigsteln" durchführen, sondern wir reduzieren die zu durchsuchende Datenmenge in jedem Schritt auf ein Hundertachtundzwanzigstel. Oder würden dies tun, wenn wir die Indexblöcke alle immer ganz voll machen würden.

Das tun wir aber nicht, weil wir dann bei jedem Einfügen von Daten rebalancieren müßten. Stattdessen machen wir die Blöcke nur zu 2/3 voll. Dadurch 128teln wir nicht, sondern 84teln nur, aber das macht fast nichts aus. 20 Millionen Datensätze durchsuchen wir so mit maximal 4 Operationen.


{% highlight console %}
root@localhost [(none)]> select 128\*0.66;
+----------+
| 128\*0.66 |
+----------+
|    84.48 |
+----------+
1 row in set (0.00 sec)

root@localhost [(none)]> select log(20000000)/log(84.48);
+--------------------------+
| log(20000000)/log(84.48) |
+--------------------------+
|          3.7892903582541 |
+--------------------------+
1 row in set (0.00 sec)

{% endhighlight %}


Einen "sortierten Autorenkatalog" nennt man in einer Datenbank einen "Index auf eine Spalte". In unserer Beispieltabelle haben wir die Spalten id, d, e und i. Wir wollen einen Index auf die Spalte i (INTEGER, 4 Byte) legen, also braucht ein Indexeintrag 8 Byte (4 Byte für das Integer und 4 Byte für den Datenzeiger). Für 20 Millionen Einträge rechnen wir also mit einer ca. 230 MB großen MYI-Datei.

Die Rechnung geht so: 20 Mio Einträge zu 8 Byte sind 152 MB, aber wir machen die Blöcke nur zu ca. 2/3 voll, also müssen wir das ganze durch 2/3 teilen:


{% highlight console %}
root@localhost [rootforum]> select 20000000\*8/1024/1024/(2/3)\G
\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\* 1. row \*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*
20000000\*8/1024/1024/(2/3): 228.881836166382
1 row in set (0.00 sec)
{% endhighlight %}


Den Index erzeugen wir mit dem Kommando CREATE INDEX. Das Kommando geht dann die Spalte i durch, notiert die Werte und für jeden Wert die Datensatznummer, in der der Wert zu finden ist. Die Werte müssen sortiert werden, und dazu braucht MySQL Platz. Der Puffer für diesen Platz kann online definiert werden, und sollte sehr groß gewählt werden (bei uns: Mindestens 230 MB groß, wie wir eben vorgerechnet haben). Der Name des Puffers ist myisam_sort_buffer_size.

Im folgenden Beispiel verwenden wir Sessionvariablen, hier die Variable @old_buffer, um den alten Wert für myisam_sort_buffer_size zu speichern. Wir definieren dann für unsere Verbindung zur Datenbank und nur für diese einen größeren Wert für myisam_sort_buffer_size, und erzeugen den Index mit CREATE INDEX. Danach setzen wir myisam_sort_buffer_size wieder auf den alten Wert zurück.

Wir verändern nicht @@global.myisam_sort_buffer_size, weil das ein großes Risiko wäre: Jedes CREATE INDEX, ALTER TABLE ... ADD INDEX oder REPAIR TABLE würde dann den großen Puffer verwenden und bis zu 300 MB Speicher verlangen.


{% highlight console %}
root@localhost [rootforum]> select @@session.myisam_sort_buffer_size;
+-----------------------------------+
| @@session.myisam_sort_buffer_size |
+-----------------------------------+
|                          31457280 |
+-----------------------------------+
1 row in set (0.04 sec)

root@localhost [rootforum]> set @old_buffer=@@session.myisam_sort_buffer_size;
Query OK, 0 rows affected (0.00 sec)

root@localhost [rootforum]> set @@session.myisam_sort_buffer_size = 300\*1024\*1024;
Query OK, 0 rows affected (0.02 sec)

root@localhost [rootforum]> create index i on t(i);
Query OK, 20000000 rows affected (4 min 33.35 sec)
Records: 20000000  Duplicates: 0  Warnings: 0

root@localhost [rootforum]> set @@session.myisam_sort_buffer_size = @old_buffer;
Query OK, 0 rows affected (0.00 sec)

{% endhighlight %}


Da diese Aktion auf meinem Rechner über 4 Minuten dauert, kann ich MySQL beim Erzeugen des Index zusehen:


{% highlight console %}

root@localhost [(none)]> show processlist\G
\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\* 1. row \*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*
     Id: 5
   User: root
   Host: localhost
     db: rootforum
Command: Query
   Time: 48
  State: copy to tmp table
   Info: create index i on t(i)
...

{% endhighlight %}


Das will ich genauer beobachten:


{% highlight console %}
root@linux:/var/lib/mysql/data/rootforum # ls -l
total 1493641
-rw-rw----  1 mysql mysql  527958016 Feb 12 17:15 #sql-26a5_5.MYD
-rw-rw----  1 mysql mysql       1024 Feb 12 17:14 #sql-26a5_5.MYI
-rw-rw----  1 mysql mysql       8628 Feb 12 17:14 #sql-26a5_5.frm
drwx------  2 mysql mysql        240 Feb 12 17:14 ./
drwxr-xr-x  6 mysql mysql        440 Feb 12 17:06 ../
-rw-rw----  1 mysql mysql         61 Feb 12 17:01 db.opt
-rw-rw----  1 mysql mysql 1000000000 Feb 12 17:07 t.MYD
-rw-rw----  1 mysql mysql       1024 Feb 12 17:07 t.MYI
-rw-rw----  1 mysql mysql       8628 Feb 12 17:02 t.frm
{% endhighlight %}


Die Prozeßgröße ist dabei eher klein:


{% highlight console %}
root@linux:/var/lib/mysql/data/rootforum # ps axuwww| grep mysql[d]
mysql     9893  2.2  1.2 351420 13152 pts/1    Sl   15:13   2:41 /usr/local/mysql-max-5.0.18-linux-i686-glibc23/bin/mysqld ...
{% endhighlight %}


Der mysqld hat hier also das Potential, bis zu 351420 KB zu belegen, da er aber für diese Übung frisch gestartet wurde, belegt er tatsächlich nur 13152 KB Speicher.

Nach dem Abschluß der Kopieroperation ist die #sql-26a5_5.MYD genau so groß wie die t.MYD, und die eigentliche Sortieroperation kann beginnen. Der mysqld wächst um die vereinbarte Puffergröße (genauer: nur um die benötigte Größe und das nur schrittweise).


{% highlight console %}
root@localhost [(none)]> show processlist\G
\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\* 1. row \*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*
     Id: 5
   User: root
   Host: localhost
     db: rootforum
Command: Query
   Time: 124
  State: Repair by sorting
   Info: create index i on t(i)
{% endhighlight %}


Dies ist die Anzeige von SHOW PROCESSLIST, während sortiert wird und der myisam_sort_buffer_size tatsächlich benutzt wird. Sieht man sich den Prozeß in der Unix-Prozeßliste an, kann man sehen, daß auch Speicher belegt wird:


{% highlight console %}
root@linux:/var/lib/mysql/data/rootforum # !ps
ps axuwww| grep mysql[d]
mysql     9893  3.5 27.6 624744 286388 pts/1   Sl   15:13   4:24 /usr/local/mysql-max-5.0.18-linux-i686-glibc23/bin/mysqld ... 
{% endhighlight %}


Und der Gewinn? Operationen wie "select \* from t where i = 193306751" sind jetzt sehr schnell durchzuführen, und zwar unabhängig davon, ob der Wert am Anfang oder am Ende der Tabelle gefunden wird.


{% highlight console %}
root@localhost [rootforum]> flush query cache;
Query OK, 0 rows affected (0.03 sec)

root@localhost [rootforum]> select \* from t where i = 193306751;
+----+--------------+---------------------------+-----------+
| id | d            | e                         | i         |
+----+--------------+---------------------------+-----------+
|  9 | jilrmbmbujaw | vegmospiyoenpnovopofogiof | 193306751 |
+----+--------------+---------------------------+-----------+
1 row in set (0.00 sec)

root@localhost [rootforum]> select \* from t where i = 1830603510;
+----------+--------------+---------------------------+------------+
| id       | d            | e                         | i          |
+----------+--------------+---------------------------+------------+
| 19999990 | hctjfsosiobb | zyxhrbyvbtsrnpwjijtgqrfcb | 1830603510 |
+----------+--------------+---------------------------+------------+
1 row in set (0.03 sec)
{% endhighlight %}

