---
layout: post
published: true
title: Red vs Blue at Oracle, und ein paar Gedanken zu Postgres
author-id: isotopp
date: 2010-11-04 18:00:57 UTC
tags:
- mysql
- postgres
- lang_de
feature-img: assets/img/background/mysql.jpg
---
[Ich schrieb](http://www.heise.de/ix/news/foren/S-Re-Kann-MySQL-eigentlich-irgendetwas/forum-188566/msg-19386125/read/): 
> heretic666 schrieb am 4. November 2010 12:11
>
> ...das man nicht auch wahlweise mit PostgreSQL oder MS SQL erschlagen
> kann?
> 
> Mir fällt da im Moment kein Punkt ein...

Postgres ist ein Repräsentant der klassischen Datenbanken und fällt in
dieselbe Kategorie wie Oracle, MS SQL oder DB/2.  MySQL ist eine Datenbank,
die sich in vielen Punkten an den Erfordernissen des Webs orientiert und
ganz andere Schwerpunkte als Postgres oder Oracle setzt.  Das ist auch eine
der Erfahrungen, die der rote Sales (Oracle Sales) gerade mit blauen Kunden
(MySQL Kunden) macht: Die meisten lassen sich nicht einfach auf rot
konvertieren, weil das rote Produkt schlicht nicht die Leistungen bietet,
die blauen Kunden wichtig sind.

Um Deine Frage konkreter zu beantworten:

MySQL ist eine Einprozeß-Architektur mit mehreren Threads und einem
Threadpool.  Ein Connect an die Datenbank ist vergleichbar teuer einem
Connect an einen OpenLDAP-Server und MySQL kommt so gut mit transienten
Verbindungen etwa eines mod_perl oder mod_php zurecht, daß man in MySQL in
der Regel nicht mit Connection Pools arbeitet und 2-Tier Architekturen
(Apache mit mod_irgendwas an MySQL) gut funktionieren.

Datenbanken, die on-connect einen Handlerprozeß forken haben sehr viel
höhere Kosten in Speicher (MySQL 200 KB pro Connect vs.  zum Beispiel 5 MB
für Oracle) und Zeit.  Mit solchen Datenbanken redet man in der Regel über
einen Application-Server der persistente Verbindungen aus einem Connection
Pool managed, und auf der anderen Seite von einem Webserver angestupst wird
(3-Tier).

MySQL-Anwender skalieren Read-Leistung in der Regel horizontal.  Das heißt,
sie kaufen keine größeren Server, sondern mehr Server, um zu wachsen.  In
unserem Fall haben wir in einer Produktionshierarchie zum Beispiel 87 MySQL
Slave-Server an einem Master hängen.  MySQL Replikation ist per Default
asynchron und muß in der Anwendung durch ein passendes master_pos_wait()
synchronisiert werden - jedes asynchrone System kann durch Einfügen von
Waits synchron gemacht werden.

Das heißt, daß die Anwendung die Wahl hat, ob sie fortfahren oder warten
will - und die meisten Leute wollen in der Anwendung lieber annähernd
richtige Daten sofort liefern (und dann ggf später per AJAX aktualisieren)
als auf absolut korrekte Daten zu warten, solange etwa im Web gebrowsed
wird.  Wenn es zum Schwur - also zum Kauf - kommt, dann will man warten, und
dann nimmt man Waypoints in Kauf - vorher aber nicht.

Postgres zum Beispiel hat erst jetzt mit 9.0 eine Replikation und diese ist
auch nicht asynchron.  Das heißt, wenn man eine Anwendung hatte, die größer
war als eine einzelne Kiste leisten konnte, dann mußte man an irgendeinem
Punkt zu MySQL greifen - mein derzeitiger Arbeitgeber ist so vor etwa 10
Jahren aus genau diesem Grunde von Postgres zu MySQL migriert.  Das war sehr
mühsam und teuer, aber damals ein zwingender Grund (und ist es heute trotz
9.0 wahrscheinlich auch noch).

MySQL, speziell InnoDB, ist eine ausgezeichnete Engine mit MVCC (also
lockless reads) und mit sehr sinnvollen Strategien beim Layout von Daten auf
der Platte (Clustering der Daten nach Primary Key + auto_increment = instant
win für alle Leute mit normalen Zugriffspatterns).  Dadurch, daß MySQL
außerdem Covering Indexes kann (Postgres auch in 9.0 leider noch nicht) sind
bestimmte Optimierungen sehr leicht möglich und sehr effizient.  Domas
(früher MySQL, jetzt Facebook, außerdem Wikipedia-DBA) beschreibt dies in 
[einem Artikel](http://mituzas.lt/2007/01/26/mysql-covering-index-performance/)
recht ausführlich.

Ein anderes Feature, das bei der Skalierung von großen Datenbanken (größer
als der Hauptspeicher) sehr extrem rockt sind PARTITION BY clauses in
Tabellendefinitionen.  Man kann sich in Postgres vergleichbares manuell
zusammentriggern (wie man sich auch Replikation zusammentriggern kann, wenn
man keine Schmerzen spürt), aber nativ ist das Feature plötzlich auch für
den normalbegabten DBA und vor allen Dingen auch für einen Entwickler
zugänglich - und es ist sehr schnell.  Wir migrieren gerade eine unserer
letzten MyISAM-Datenbanken von Merge-Tables auf InnoDB Plugin + Compressed
Tables + Partititions und die Effekte sind sehr erstaunlich.

Ein weiteres Feature, bei dem ich nicht beurteilen kann, wie gut oder
schlecht Postgres da steht, sind die Connectors in MySQL.

Connector/ODBC von MySQL ist - sagt man mir - sehr gut, ich habe in meiner
beruflichen Praxis damit eine Reihe von Migrationen von Access- und MS
SQL-Datenbanken auf ein MySQL Backend durchgeführt, und das war weitgehend
problemlos (ODBC hat ein paar Konzepte, bei denen man wissen muß, wie sie
auf MySQL abgebildet werden - wenn man das weiß, geht die ganze Umstellung
vollkommen schmerzfrei).

Connector/J ist angeblich auch sehr gut - ich versuche Java zu vermeiden und
habe daher nicht viel unmittelbare Erfahrung, kann aber sagen, daß man
zumindest vielen Schmerz der Java-Leute durch Konfiguration obskurer
JDBC-Parameter wegheilen kann ohne daß man ins Java rein muß.  :-)

Für PHP gibt es eine unabhängige Implementierung des Protokolls als mysqlnd. 
Das ist einmal lizenztechnisch interessant (PHP License statt GPL) und
einmal speichertechnisch spannend.  Connector/C alias libmysqlclient.so lädt
ja Ergebnisse aus dem Server in libmysqlclient.so runter und stellt sie als
MySQL-interne Datentypen dar.  Diese werden dann durch mysql_fetch_assoc()
und Freunde in PHP Zeile für Zeile in PHP ZVAL umgewandelt - am Ende hat man
die Daten also zweimal: Einmal als PHP Hash in ZVAL-Format und einmal als
MySQL-interne Typen in der Bibliothek - bis dann endlich mysql_free_result()
gemacht wird, und die interne Kopie gelöscht wird.

mysqlnd verwendet jetzt gleich intern in der MySQL-Bibliothek PHP-interne
ZVAL-Strukturen für die Ergebnisse, sodaß keine Daten mehr aus
libmysqlclient.so in PHP umkopiert werden müssen, sondern die Daten quasi
gleich als PHP-Hash in den Client runter geladen werden.

Ah, und schließlich sind die Zeichensatz-Fähigkeiten von MySQL recht
bemerkenswert.  MySQL kann Zeichensätze und  Sortierungen per Spalte
getrennt festlegen und wandelt dann zwischen Serverzeichensatz und
Clientzeichensatz um.  Das tut es sehr schnell, so schnell, daß es bei uns
in einigen Anwendungen schneller ist, die Zeichensatzumwandlungen durch den
Server machen zu lassen, als lokal im Client mit Perl (Nein, wir machen das
nicht, es ist nur so, daß unsere Benchmarks meinten, das sei schneller :-)
).

MySQL ist auch extrem flexibel: Mit einem ALTER TABLE kann man Spalten
bequem von einer Darstellung in eine andere umwandeln,  wenn sich die
Anforderungen ändern, sodaß man sich dort nicht früh auf irgendwas festlegen
muß.

Soweit ich weiß ist das sehr viel flexibler als die Mechanismen, die
Postgres hier bietet.

In MySQL nutzt man oft eine Reihe von Dingen nicht, die man von einem
klassischen Datenbankprodukt erwarten würde, wie es etwa an der Uni
unterrichtet wird.  Das ist in dem Umfeld von MySQL weitgehend okay - wir
zum Beispiel setzen MySQL auf eine Weise ein, bei der wir alle Zugriffe auf
die Datenbank kontrollieren und bei der wir den Code zu allen Anwendungen
haben und ändern können, die auf die Datenbank zugreifen.  Das macht gewisse
Dinge auf der Clientseite möglich, die man anderswo im Server abhandeln muß.

Foreign Key Constraints zum Beispiel realisieren wir im Client in
Bibliotheken.  Wir werden auch in der Regel keinen Code in der Datenbank
einsetzen - also weder Views, noch Procedures noch Triggers, sondern machen
alle diese Sachen im Client.  Wir sind aber ein privilegiertes Umfeld, weil
wir in der Produktion durchgehend einen OSS Stack einsetzen und so den
Quelltext zu allem vollkommen kontrollieren.  Wir sind außerdem größer als
eine einzelne Maschine leisten kann, müssen also sowieso horizontal
Skalieren, und es ist nun einmal günstiger, Client-CPUs zu kaufen als
Datenbankserver-CPUs, also ist es für uns ökonomisch nicht sinnvoll, Code in
der Datenbank laufen zu lassen (von den Managementerfordernissen, die Code
in der Datenbank mit sich bringt mal ganz abgesehen).

Schließlich: MySQL hat eine Reihe von Eigenheiten, Einschränkungen und
Fehlern.  Das ist okay, denn die meisten dieser Sachen sind bekannt und man
kann mit ein wenig Erfahrung da leicht drum herum arbeiten.

MySQL hat jedoch auch eine riesengroße Community von Leuten mit zum Teil
bemerkenswertem Niveau, sodaß man an die notwendigen Informationen
herankommt - in seiner Landessprache, wahlweise für Geld oder gute Worte und
auch auf Zeit.

MySQL hat auch erwiesenermaßen große Installationen, das heißt die
versprochene Skalierbarkeit ist nicht hypothetisch, sondern die Konzepte
sind bewiesen und verdienen bei anderen Leuten nachweisbar Millionen - pro
Tag.

MySQL ist nicht schön.  Das muß es nicht, es soll nur den Job erledigen und
die Kasse voll machen.  Und das tut es, zuverlässig, wiederholbar und vor
allen Dingen auf eine Weise, die man normalbegabten Entwicklern in Kursen
vermitteln kann.  Alles ist allem ist das in etwa das, was man von einem
solchen Produkt erwarten würde.

Die Zusammenfassung dieses recht langen Textes ist in etwa:

Die reale Welt ist nicht die Uni, und die Erfordernisse der realen Welt
werden für eine populäre Klasse von Anwendungen und Anforderungen von MySQL
besser abgebildet als von jeder anderen Datenbank.  Das MySQL dabei gegen
bestimmte traditionelle Lehren verstößt sorgt in gewissen Kreisen für
schlechte Presse, aber das ist den Leuten, die das machen egal, solange die
von ihnen erstellten Rechnungen korrekt genug sind um akzeptiert zu werden
und den Kühlschrank voll machen.
