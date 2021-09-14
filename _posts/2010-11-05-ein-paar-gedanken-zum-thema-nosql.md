---
layout: post
published: true
title: Ein paar Gedanken zum Thema NoSQL
author-id: isotopp
date: 2010-11-05 06:41:00 UTC
tags:
- mysql
- nosql
- lang_de
feature-img: assets/img/background/mysql.jpg
---
Beim Durchstöbern der verschiedenen NoSQL-Datenspeicher stellt sich mir die
Frage, wieso man das alles überhaupt will. Genauer: Was genau ist das
Problem, das man mit NoSQL lösen möchte?

Diejenigen Leute, die NoSQL-Lösungen einsetzen, haben in der Regel die
Schwierigkeit, daß ihre Datenmenge größer wird, als man auf einer einzelnen
Maschine mit der geforderten Servicequalität handhaben kann.

Im Webbereich sind die Anforderungen für interaktives Browsen oft so, daß
man die gewünschten Antwortzeiten nur dann erreichen kann, wenn die dabei
verwendeten Datenbanken ihre Daten und Indices zum allergrößten Teil im RAM
halten können. Verfügbarkeit und Preis von Speicher sind aber Grenzen
gesetzt - mit aktuellen Nehalem-Kisten zum Beispiel liegt der Sweet-Spot
irgendwo bei 48G oder 96G Hauptspeicher, die Datenbankgröße für solche
zeitkritischen Systeme also nach meinen Erfahrungen zwischen 100G und 200G.

Erst wenn Benutzer nicht mehr interaktiv browsend mit der Anwendung
interagieren kann man sich längere Antwortzeiten erlauben. Wird ein Schritt
zum Beispiel als "Buchung" angesehen, ist der Benutzer bereit, bis zu 10x
längere Reaktionszeiten hinzunehmen (2 Sekunden statt 0.2 Sekunden, ohne
Fortschrittsbalken, und bis zu 20 Sekunden mit einem Fortschrittsbalken).

![](/uploads/partition.png)

Partition visualisiert

Gesucht ist also Technologie, die es mir erlaubt, ein Datenbankschema über
mehr als eine Maschine zu verteilen. Je weniger ich dabei in meiner
Anwendung davon sehe oder merke, um so schöner.

Um ein großes Schema zu verteilen muß ich meine Daten partitionieren. Das
heißt, ich muß eine Menge (an Daten) in Teilmengen zerlegen, sodaß die
Teilmengen sich nicht überlappen und ihre Vereinigung wieder die Gesamtmenge
ergibt. Liegen die Teilmengen alle zusammen auf einer Maschine reden wir in
der Regel von einer Partition. Liegen sie auf verschiedenen Maschinen reden
wir in der Regel von Sharding (von Shard, Splitter).

Die manuelle Vorgehensweise zum Sharding ist, ein Schema funktional zu
zerteilen. Dabei wird man alle Tabellen, die mit Funktionalität a zu tun
haben auf einen Server verlegem und alle Tabellen, die mit Funktionalität b
befaßt sind auf einen anderen Server. Das geht aber immer noch davon aus,
daß eine Tabelle zur Gänze auf einer einzelnen Maschine gehalten werden kann
und es setzt auch voraus, daß man sich Gedanken darüber macht, was man wie
warum wo hin schiebt. Der manuelle Ansatz hat den Vorteil, daß man mit
konventionellem Denken noch weiter kommt und auch konventionelle Abfragen
innerhalb einer Maschine noch wie erwartet funktionieren.

![](/uploads/sharding.png)

Automatisches Sharding

Ansätze zum automatischen Sharding nehmen auf solche Dinge weniger
Rücksicht: Ich kann für jede Zeile jeder Tabelle auf irgendeine Weise eine
Maschinenadresse berechnen und den entsprechenden Datensatz dann auf diese
Maschine verschieben. Der automatische Ansatz hat den Vorteil, daß es keine
absoluten Skalierungslimits mehr gibt, sondern daß man die Datenmenge und
die Systemleistung "einfach" dadurch skalieren kann, daß man mehr Maschinen
zum Cluster hinzu fügt.

Der automatische Ansatz hat auch einen Preis:

Von den anderswo erklärten 
[Operationen der  Relationenalgebra]({% link _posts/2010-04-28-was-bedeutet-eigentlich-relationale-algebra.md %})
sind einige nun recht teuer geworden - der SQL-Join und die SQL-Aggregation.

Für den Join stellt sich das Problem, daß man zwischen Tabellen eine
Verknüpfung erzeugen will, die zur Gänze oder in Teilen auf
unterschiedlichen Maschinen in einem Cluster liegen können. Je nachdem
welcher
[Join-Algorithmus](http://en.wikipedia.org/wiki/Category:Join_algorithms)
verwendet wird, kann dabei sehr viel Netzwerk-Kommunikation notwendig
werden.

Das gilt um so mehr, wenn wir uns in Erinnerung rufen, daß wir dieses ganze
Sharding-Geschäft angefangen haben damit wir alle Daten im Speicher halten
können - Netzwerk-Latenzen werden also leicht die dominierenden Kosten bei
der Berechnung eines Joins 
([typisches Beispiel](http://www.fromdual.ch/wie-der-mysql-optimizer-schummelt) für die
Probleme bei einem Join über das Netz in MySQL Cluster).

![](/uploads/condition_pushdown.png)

Condition Pushdown

MySQL Cluster und VoltDB sind beides Produkte, die immerhin versuchen,
einen Join über das Netz durchzuführen, und der Ansatz ist vergleichbar:
Anstatt die Daten zu dem Knoten zu transferieren, der den Join ausführt,
werden Teile der Query extrahiert und zu den Daten transportiert. MySQL
Cluster versucht das dynamisch und automatisch zu machen und nennt das
Condition Pushdown
([Webinar zu MySQL Cluster Condition Pushdown](http://johanandersson.blogspot.com/2010/10/pushed-down-joins-webinar.html), 
[In Pursuit Of The Holy Grail](http://blogs.oracle.com/mysql/2010/10/in_pursuit_of_the_holy_grail_-_mysql_cluster_and_push_down_joins.html),
über Condition Pushdown in Cluster). VoltDB verlangt stattdessen, daß das
statisch und vorab gemacht wird: Die Entwickler müssen alle Abfragen als
Stored Procedures in Java schreiben und zur Laufzeit werden dann nur noch
Stored Procedures abgerufen.

Im recht uneinheitlichen Bereich der NoSQL-Nondatenbanken hat man im
wesentlichen zwei Ansätze um mit dem Problem umzugehen. Für die untere
Schicht der NoSQL-Datenbanken ("Key Value Stores") besteht die Lösung
schlicht darin, das Problem zu ignorieren, äh, dem Anwendungsprogrammierer
zur freien Modellierung zu überlassen. In der Praxis kommen dann zwei
Ansätze vor, die der Anwendungsprogrammierer verwendet um eine Lösung zu
modellieren.

Der eine Ansatz programmiert das Äquivalent eines Full Table Scans in der
Anwendung nach, d.h. um die gesuchten Daten zu finden wird die gesamte
Datenbank in die Anwendung runtergeladen und der nicht gewünschte Teil der
Daten verworfen. Diese Lösung wird vor allen Dingen von den Anbietern von
Netzwerkequipment favorisiert.

Der andere Ansatz nimmt den Join vorweg, d.h. er speichert als Teil des
Value jedes Key-Value Paares ein Array von Zeigern auf die verknüpften
Knoten. Lädt man den Ausgangsknoten runter, bekommt man mit dem Zeigerarray
auch eine Liste von Referenzen, denen man folgen kann, um die verknüpften
Daten zu finden.

![](/uploads/Network_Model.jpg)

Network Model ([Quelle](http://en.wikipedia.org/wiki/File:Network_Model.jpg))

Automatisiert man das und das Handhaben der Backreferences, hat man eine
Zeitreise in das Jahr 1969 durchgeführt und
[IMS](http://en.wikipedia.org/wiki/Network_database) neu erfunden
(ersatzweise auch eine XML-Datenbank oder LDAP erfunden). Immerhin ist es
jetzt verteilt.

In den NoSQL-Datenbanken, die ein wenig mehr Struktur in den Daten
unterbringen findet man nun entweder solche Mechanismen, die Referenzen auf
Daten und ihre Backreferences automatisieren, d.h die sogenannten
Dokumentendatenbanken sind in Wahrheit Netzwerkdatenbanken.

Oder man arbeitet mit Dokumenten und Subdokumenten, speichert also statt
Zeigern auf Objekte erster Ordnung (Dokumente) jetzt einfach die Objekte
selbst literal in den ihnen übergeordneten Objekten (man speichert
Subdokumente in Dokumenten). Das ist noch schlechter, weil man damit
zugleich hybride, nicht-opake und nicht stabile Identifier bekommt, wenn man
mit Subdokumenten arbeitet: Statt das Dokument 17 (Subdokument von 3) direkt
über seine ID referenzieren zu können (egal wie es in 3 verschachtelt ist
oder ob es in 3 und in 5 gleichermaßen referenziert wird), redet man jetzt
von 3.owner.name[2], also dem zweiten Element des Arrays Name unterhalb des
Slots owner des Dokumentes 3.

Das ist eine Pfadabgabe (etwa eine XPath-Expression) relativ zur Wurzel des
Dokumentes mit der ID 3, und nicht stabil: Werden Elemente vorne in das
Array name eingefügt, oder wird der Typ des Slot owner verändert (der Skalar
owner wird zu einem Array owner[], sodaß es jetzt 3.owner[1].name[2] heißen
muß) oder der Nestinglevel von owner geändert, ist die Referenz ungültig.
Und das Subdokument kann nicht von zwei Dokumenten 3 und 5 zugleich
referenziert werden, da es literal Bestandteil von entweder 3 oder 5 ist.

Kurzum: Man kann nicht sinnvoll normalisieren, weil man nicht sinnvoll
addressieren kann.

Das ist Teil eines größeren Problems: 
[NoSQL Took Away The Relational Model And Gave Nothing Back](http://highscalability.com/blog/2010/10/28/nosql-took-away-the-relational-model-and-gave-nothing-back.html):

> The meaning of the statement was that NoSQL systems (really the various
> map-reduce systems) are lacking a standard model for describing and
> querying and that developing one should be a high priority task for them.


Unterdessen (nein: deswegen!) nähern sich SQL- und NoSQL auf eine Weise auch
wieder einander an. Weil SQL eine sinnvolle Sache ist, gibt es
[Redisql](http://jaksprats.wordpress.com/2010/09/28/introducing-redisql-the-lightning-fast-polyglot/),
einen SQL-Interpreter, der quasi den KV-Store Redis als Storage Engine
verwendet.

Und es gibt 
[HandlerSocket](http://yoshinorimatsunobu.blogspot.com/2010/10/using-mysql-as-nosql-story-for.html),
ein Plugin für MySQL, das das MySQL Sonderkommando
[HANDLER](http://dev.mysql.com/doc/refman/5.1/en/handler.html) mit einem
binären Netzwerkinterface ohne Authentisierung ausstattet und so Key-Value
Zugriffe und Index-Traversal sehr effizient verfügbar macht, solange die
Daten im RAM liegen (oder
[auf einer SSD](http://www.mysqlperformanceblog.com/2010/11/02/handlersocket-on-ssd/)).

Neben diesem echten harten Problem von JOIN und GROUP BY über das Netz gibt
es eine Reihe von weiteren Schwächen in MySQL und einigen anderen
SQL-Implementierungen, die von einigen NoSQL-Implementierungen angesprochen
werden und die meiner Meinung zu falschen oder gefährlichen Ansätzen führen.

Das bekannteste Beispiel ist das 
[ALTER TABLE](http://dev.mysql.com/doc/refman/5.1/en/alter-table.html)
Statement in MySQL, das auch in MySQL 5.1 in vielen Fällen noch sehr lange
dauert und alle Operationen auf der Tabelle blockiert, während es abläuft.
Das Thema ist drängend und die Komplexität der Workarounds
[grenzt an das Lächerliche](http://www.facebook.com/note.php?note_id=430801045932&comments).

ALTER TABLE wird entweder verwendet, um die Indices einer Tabelle zu
verändern oder um die Struktur einer Tabelle zu verändern. Die korrekte
Lösung des Problems ist einerseits
[Background Index Creation](http://dev.mysql.com/doc/innodb-plugin/1.0/en/innodb-create-index-overview.html)
(aber [es gibt viele Einschränkungen](http://dev.mysql.com/doc/innodb-plugin/1.0/en/innodb-create-index-limitations.html)),
wenn es um Indices geht.

Oder es ist eine versionierte Tabellendefinition, wenn es um die
Tabellenstruktur geht - statt das ALTER TABLE auszuführen, wird eine neue
Version der Tabellendefinition angelegt. An jeder Row wird die
Versionsnummer der Tabellendefinition gespeichert, der die Row entspricht.
Beim Zugriff auf die Row werden die Daten gelesen und entsprechend der ALTER
TABLE-Anweisungen, die fehlen, auf den neusten Stand gebracht (ebenso alle
anderen Rows in derselben Page). Die Speicherseite ist nun 'dirty' und wird
mit dem nächsten Checkpoint auf der Platte aktualisiert. Das ermöglicht
zugleich
[Transactional DDL](http://wiki.postgresql.org/wiki/Transactional_DDL_in_PostgreSQL:_A_Competitive_Analysis).

Was die meisten NoSQL-Nondatenbanken stattdessen machen ist schemalessness
zu propagieren. Dabei werden oftmals
[eigenartige Schlußfolgerungen](http://nosql.mypopescu.com/post/949327075/why-your-startup-should-use-a-schema-less-database)
gezogen:
> Avoiding schema changes and data migration are good reasons.

Die Folgerung "Aus Schemalessness folgt, daß man Schema Changes und
Datenmigration vermeiden kann" ist offensichtlicher Unsinn, wie jeder
erkennen kann, der einmal reale Anwendungen entwickelt hat - die Migration
wird nun jedoch wieder einmal dem Anwendungsprogrammierer zur Modellierung
in der Anwendung überlassen.

Das heißt, man implementiert nun das 'Transactional DDL'-Modell von oben in
der Anwendung nach: Jeder Datensatz bekommt eine Versionsnummer und der ORM
prüft beim Lesen jedes Satzes, ob die Versionsnummer auf Stand ist, und wenn
nicht, wendet er die notwendigen Transformationen auf das gelesene Objekt
an. Beim Zurückschreiben der Daten wird das aktuelle Datenmodell mit der
höchsten Versionsnummer geschrieben.

Oder man tut das nicht, und verläßt sich auf obskure Defaults der verwendeten Plattform
([MongoDB Blog Beispiel](http://blog.mongodb.org/post/119945109/why-schemaless) und die
Diskussion unten dran kommt zu demselben Schluß wie ich hier).

Was also sucht man, wenn man sich mit NoSQL beschäftigt?

- Workarounds für existierende Limits in der Implementierung von MySQL - das
  führt in der Regel zu wenig sinnvollen Ergebnissen.
- Techniken, mit denen man Wachstum über die Grenzen einer einzelnen
  Maschine hinaus besser in den Griff bekommen kann:
  - Sharding und Replikation weiter denken.
  - Das Problem des Joins und der Aggregation in diesen Szenarien angehen.
  - Lösungen dafür existieren, ob man sie nun Condition Pushdown oder
    Map-Reduce nennt - beides ist sehr ähnlich.
  - Ich erwarte, daß Autosharding und verteilte Ausführung von SQL, hinter
    den Kulissen mit Map-Reduce/Condition Pushdown, in absehbarer Zeit
    Bestandteil von Open Source SQL-Produkten werden.
  - Ich erwarte, daß auch damit die Effekte, die sich aus der Verteilung des
    Systems ergeben nicht vollständig in allen Fällen vor dem Endanwender
    verborgen werden können.
