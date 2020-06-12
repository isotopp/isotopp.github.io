---
layout: post
published: true
title: NULL is NULL
author-id: isotopp
date: 2011-11-04 13:31:00 UTC
tags:
- datenbanken
- mysql
- sql
- lang_de
feature-img: assets/img/background/mysql.jpg
---
Q> Sag mal, NULL zählt nicht bei einem UNIQUE INDEX? Zum Beispiel ein UNIQUE INDEX auf (a,b) und dann

{% highlight sql %}
a  b
1  2
1  2
{% endhighlight %}

Das geht nicht, da Duplikate Key. Aber

{% highlight sql %}
a  b
1  NULL
1  NULL
{% endhighlight %}

wird zugelassen.

Kris> Du kaufst bitte mal 
[SQL für Smarties: Advanced SQL Programming](http://www.amazon.de/Joe-Celkos-SQL-Smarties-Programming/dp/0123820227)
und ißt das dann auf.

{% highlight sql %}
mysql> select * from t;
+----+------+
| id | d    |
+----+------+
|  1 | NULL |
|  2 |    2 |
|  3 |    3 |
|  4 | NULL |
+----+------+
4 rows in set (0.00 sec)

mysql> select count(*) as a, count(d) as b, count(coalesce(d, 0)) as c from t;
+---+---+---+
| a | b | c |
+---+---+---+
| 4 | 2 | 4 |
+---+---+---+
1 row in set (0.00 sec)

mysql> select d, coalesce(d, 0) as dc from t;
+------+------+
| d    | dc   |
+------+------+
| NULL |    0 |
|    2 |    2 |
|    3 |    3 |
| NULL |    0 |
+------+------+
4 rows in set (0.00 sec)
{% endhighlight %}

Kris> Und außerdem

{% highlight sql %}
mysql> select 0=0, 1=1, 0=1, NULL=0, NULL=1, NULL=NULL;
+-----+-----+-----+--------+--------+-----------+
| 0=0 | 1=1 | 0=1 | NULL=0 | NULL=1 | NULL=NULL |
+-----+-----+-----+--------+--------+-----------+
|   1 |   1 |   0 |   NULL |   NULL |      NULL |
+-----+-----+-----+--------+--------+-----------+
1 row in set (0.00 sec)
{% endhighlight %}

Q> Ah, es liegt also daran, daß NULL kein Wert ist, sondern einfach NICHTS.

Kris> NICHTS ist das falsche Wort. Es ist NULL. Das hat viele verschiedene
Bedeutungen in SQL, es ist nicht mal konsistent. Es ist auch nicht undef,
wie in Perl. Es ist NULL. Und was dann passiert, das muß man wissen.

{% highlight sql %}
mysql> create table tt ( t int null, unique (t));
Query OK, 0 rows affected (0.37 sec)

mysql> insert into tt values (1), (2), (2);
ERROR 1062 (23000): Duplicate entry '2' for key 't'
{% endhighlight %}


aber

{% highlight sql %}
mysql> insert into tt values (1), (2), (NULL);
Query OK, 3 rows affected (0.00 sec)
Records: 3  Duplicates: 0  Warnings: 0

mysql> insert into tt values (NULL);
Query OK, 1 row affected (0.00 sec)

mysql> select * from tt;
+------+
| t    |
+------+
| NULL |
| NULL |
|    1 |
|    2 |
+------+
4 rows in set (0.00 sec)
{% endhighlight %}

Kris> Das liegt daran, daß der UNQIUE INDEX schaut, ob für irgendeinen
vorhandenen wert = der neue wert wahr ist. Wenn ja, wird der Wert abgelehnt.
Wenn du aber ein vorhandenes NULL mit dem neuen NULL vergleichst, dann ist
das nie wahr, und auch nie falsch, sondern immer NULL.

{% highlight sql %}
mysql> select NULL = NULL, NULL <> NULL;
+-------------+--------------+
| NULL = NULL | NULL <> NULL |
+-------------+--------------+
|        NULL |         NULL |
+-------------+--------------+
1 row in set (0.00 sec)
{% endhighlight %}

Kris> NULL ist also nicht gleich NULL, NULL ist jedoch auch nicht ungleich
NULL. NULL ist auch nicht ungleich wahr, und es ist auch nicht gleich wahr.

{% highlight sql %}
mysql> select 1 = NULL, 1 <> NULL;
+----------+-----------+
| 1 = NULL | 1 <> NULL |
+----------+-----------+
|     NULL |      NULL |
+----------+-----------+
1 row in set (0.00 sec)
{% endhighlight %}

Kris> NULL ist auch nicht ungleich falsch und auch nicht gleich falsch.

{% highlight sql %}

mysql> select 0 = NULL, 0 <> NULL;
+----------+-----------+
| 0 = NULL | 0 <> NULL |
+----------+-----------+
|     NULL |      NULL |
+----------+-----------+
1 row in set (0.00 sec)
{% endhighlight %}

Kris> NULL ist NULL.

Q> LOL. Kris, Du bist ein.. ich weiß es nicht. Irgendwas verrücktes.

Kris> Perl Programmierer kennen nun undef, und sehen

{% highlight perl %}

KK:~ kris$ perl -e '$a = undef; print "keks${a}keks\n";'
kekskeks
{% endhighlight %}

Kris> SQL dagegen

{% highlight sql %}
mysql> select concat('keks', 'keks') as keks, concat('keks',NULL,'keks') as nix;
+----------+------+
| keks     | nix  |
+----------+------+
| kekskeks | NULL |
+----------+------+
1 row in set (0.00 sec)
{% endhighlight %}

Kris> NULL ist NULL. Es ist nicht Nix. Also es ist nicht "". Es ist NULL.
Perl programmierer wieder so

{% highlight perl %}
KK:~ kris$ perl -e '$a = undef; print 10+$a,"\n";'
10
{% endhighlight %}

Kris> Rate was SQL macht?

{% highlight sql %}
mysql> select 10 + NULL;
+-----------+
| 10 + NULL |
+-----------+
|      NULL |
+-----------+
1 row in set (0.00 sec)
{% endhighlight %}

Kris> Vernichtet NULL also alles, womit es in Kontakt kommt? Nein, es ist
nicht systematisch. In Aggregaten wird es übersprungen.

{% highlight sql %}

mysql> select * from tt;
+------+
| t    |
+------+
| NULL |
| NULL |
|    1 |
|    2 |
+------+
4 rows in set (0.00 sec)

mysql> select count(t), sum(t) from tt;
+----------+--------+
| count(t) | sum(t) |
+----------+--------+
|        2 |      3 |
+----------+--------+
1 row in set (0.00 sec)
{% endhighlight %}


Kris> Konsequenterweise ist also avg(t) auch sum(t)/count(t) = 3/2 = 1.5

{% highlight sql %}

mysql> select count(t), sum(t), avg(t) from tt;
+----------+--------+--------+
| count(t) | sum(t) | avg(t) |
+----------+--------+--------+
|        2 |      3 | 1.5000 |
+----------+--------+--------+
1 row in set (0.00 sec)
{% endhighlight %}

Kris> Es gibt ein Prädikat, das NULL testbar macht - ISNULL(). Es gibt einen
Operator, der NULL testbar macht: IS NULL

{% highlight sql %}
mysql> select * from tt where t IS NULL;
+------+
| t    |
+------+
| NULL |
| NULL |
+------+
2 rows in set (0.00 sec)

mysql> select * from tt where isnull(t);
+------+
| t    |
+------+
| NULL |
| NULL |
+------+
2 rows in set (0.00 sec)
{% endhighlight %}

Kris> Es gibt in MySQL einen nonstandard Komparator, der NULL normalisiert.

{% highlight sql %}
mysql> select * from tt as a join tt as b on a.t <=> b.t;
+------+------+
| t    | t    |
+------+------+
| NULL | NULL |
| NULL | NULL |
| NULL | NULL |
| NULL | NULL |
|    1 |    1 |
|    2 |    2 |
+------+------+
6 rows in set (0.00 sec)

mysql> select NULL <=> NULL, NULL <=> 0, NULL <=> 1;
+---------------+------------+------------+
| NULL <=> NULL | NULL <=> 0 | NULL <=> 1 |
+---------------+------------+------------+
|             1 |          0 |          0 |
+---------------+------------+------------+
1 row in set (0.00 sec)
{% endhighlight %}

Kris> Vergleiche den normalen =-Operator.

{% highlight sql %}
mysql> select * from tt as a join tt as b on a.t = b.t;
+------+------+
| t    | t    |
+------+------+
|    1 |    1 |
|    2 |    2 |
+------+------+
2 rows in set (0.00 sec)
{% endhighlight %}

Kris> Und es gibt eine Funktion, die, wenn sie einen NULL vorfindet, einen
Default einsetzt. Genau genommen nimmt COALESCE() eine Liste von Werten und
gibt den ersten Wert aus, der nicht NULL ist.

{% highlight sql %}
mysql> select coalesce(t, 17) from tt;
+-----------------+
| coalesce(t, 17) |
+-----------------+
|              17 |
|              17 |
|               1 |
|               2 |
+-----------------+
4 rows in set (0.00 sec)
{% endhighlight %}


Kris> Und ich lehre unsere Entwickler, im Zweifel jeden NULLbaren wert in
COALESCE() zu wickeln, weil sie die Logik von SQL im Hinblick auf NULL
sowieso nicht korrekt hinkriegen. Also, im Hinblick auf die o.a. Tabelle tt:

Kris> Wenn

{% highlight sql %}
mysql> select * from tt where t =1;
+------+
| t    |
+------+
|    1 |
+------+
1 row in set (0.00 sec)
{% endhighlight %}

ist, was ist dann der REST der Tabelle, also welches SQL-Statement lädt mir
die andere Hälfte des Universums?


{% highlight sql %}
mysql> select * from tt where t <> 1;
+------+
| t    |
+------+
|    2 |
+------+
1 row in set (0.00 sec)
{% endhighlight %}

Kris> Moment! Da fehlt doch was!

{% highlight sql %}
mysql> select * from tt where t IS NULL;
+------+
| t    |
+------+
| NULL |
| NULL |
+------+
2 rows in set (0.00 sec)
{% endhighlight %}

Das Gegenteil von `SELECT * from tt where t = 1` ist eben NICHT `select *
from tt where t <> 1`. Es ist `SELECT * from tt where t <> 1 OR t IS NULL`,
weil `tt.t` nullbar ist. Und weil das Programmierer nie im Leben hinkriegen,
verbieten wir denen NULL Werte weitestgehend.
