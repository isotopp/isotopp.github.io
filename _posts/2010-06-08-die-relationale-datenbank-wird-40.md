---
layout: post
published: true
title: Die relationale Datenbank wird 40.
author-id: isotopp
date: 2010-06-08 06:15:00 UTC
tags:
- datenbanken
- mysql
- nosql
- sql
- lang_de
feature-img: assets/img/background/mysql.jpg
---
Nicht nur wird PHP im Juni 15 Jahre alt, sondern ein anderer, älterer
Begleiter von PHP feiert ebenfalls ein Jubiläum:

[Im Juni 1970](http://www.seas.upenn.edu/~zives/03f/cis550/codd.pdf)
erschien in den Communications of the ACM der Artikel 
"[A Relational Model of Data for Large Shared Data Banks](http://www.google.de/search?q=a+relational+model+for+large+shared+data+banks)"
von E.F.Codd. Dieser Artikel ist die theoretische Grundlage für das, was
später SQL und relationale Datenbanken werden sollte.

Seitdem MySQL und PHP vor 15 Jahren ausgezogen sind, das Web zu
revolutionieren, ist SQL eine Haushaltssprache geworden - es ist inzwischen
echt schwierig, Webspace zu kaufen, bei dem man nicht auch Zugriff auf eine
MySQL-Datenbank hat, und entsprechend gehen HTML-, PHP- und SQL-Kenntnisse
inzwischen einher.

Andererseits gibt es Dinge, bei denen SQL an seine Grenzen stößt. Seit
einigen Jahren gibt es unter dem Begriff
[NoSQL](http://www.pythian.com/news/9387/liveblogging-at-confoo-blending-nosql-and-sql/)
eine Sammlung von Werkzeugen, die mit persistentem Storage anders umgehen
als Codd sich das gedacht hat. Dabei geht es im Kern um Systeme, die
BASE statt ACID im Sinne von Codd sind, aber viele Entwickler sind gerade dabei,
Systeme zu bauen, die auch die guten Errungenschaften von SQL mit über Bord
werfen.

Ohne eine besseren theoretischen Unterbau wird NoSQL kaum zu standardisieren
und weiter zu entwickeln sein.

Eines der ältesten strukturellen Probleme von SQL und relationaler Algebra
ist die Schwierigkeit mit hierarchischen bzw. selftreferentiellen Daten
umzugehen. Neben Zeiger- und Pfadbäumen gibt es noch
[das Nested Set](http://kris.koehntopp.de/artikel/sql-self-references/)-Modell, aber
alle drei Ansätze sind recht unhandlich und wenig elegant in der Nutzung.

Verwandt damit ist das Problem, objektorientierte Vererbungsstrukturen auf
SQL-Speicher abzubilden. Ein - im übrigen brillianter und dringend
lesenswerter - Artikel beschriebt Objekt-Relationales Mapping (ORM) als
[das Vietnam der Informatik](http://blogs.tedneward.com/2006/06/26/The+Vietnam+Of+Computer+Science.aspx).
Das trifft den Sachverhalt recht gut. Die Antwort von NoSQL auf dieses
Problem sind schema-freie Datenbanken, aber das ist ungefähr zu gleichen
Teilen Lösung wie Problem und sicherlich nicht unbedingt ein Fortschritt.

Webanwendungen haben außerdem ungewöhnliche Anforderungen an Datenbanken und
andere Systeme: Die sind sehr read-heavy und dabei ist die absolute Anzahl
der Lesezugriffe bei populären Webanwendungen in der Regel so groß, daß es
keine einzelne Maschine gibt -
[geben kann!]({% link _posts/2007-08-11-zehn-zentimeter.md %}) -
die in der Lage ist, die Last zu stemmen. Man braucht mehr als eine Kiste,
unter Umständen gar tausende von Maschinen. Daher blickt man zwangsläufig
auf verteilte, asynchrone Systeme und damit das oben erwähnte BASE, und man
braucht um seine Algorithmen verteilen zu können, eine Form von
[Map-Reduce](http://en.wikipedia.org/wiki/MapReduce).

In Webanwendungen ist es außerdem wegen des starken Übergewichtes von
Lesezugriffen sinnvoll, seine Daten um diese Lesezugriffe herum zu
strukturieren und sie nicht auf die für Schreibzugriffe optimierte
[3NF](http://en.wikipedia.org/wiki/3NF) zu bringen. Datenspeicher von
Webanwendungen sind also in der Regel schwer denormalisiert.

Aus diesen Anforderungen rührt also die Grundsätze von NoSQL:
- Denormalization
- Verteilte Systeme mit Eventual Consistency (BASE)
- Schema-Freiheit
- Horizontale Skalierbarkeit mit Map-Reduce

Die meisten NoSQL-Systeme versuchen, diese Grundsätze technisch umzusetzen,
vergessen dabei aber die Grundsätze von Codd - und bauen so Systeme, die auf
eine andere Weise nicht weniger schlecht sind als SQL-Datenbanken.

SQL leistet nämlich dank der Arbeit von Codd eine ganze Reihe von wertvollen
Diensten, die jedoch von NoSQL-Systemen nicht oder nur unzureichend
umgesetzt werden.

![](/uploads/mapreduce.png)

NoSQL-Systeme sind nicht deklarativ.

Einmal kapselt SQL als deklarative Sprache den Datenzugriff vom prozeduralen
Code ab: In SQL sagt man nicht, wie die Daten geholt werden sollen, sondern
welche Daten man haben möchte. Es ist die Aufgabe der Datenbank, einen Plan
zu erarbeiten, mit dessen Hilfe der Datenzugriff effizient erfolgt. Der
SQL-Programmierer sagt also nicht: Öffne diesen Index, suche den Record x,
und dann steppe von dort aus durch den Index - für jeden gefundenen Record
mache damit einen Lookup in y und verbinde die beiden Strukturen, dann
filtere mit der Bedingung b. Sondern ein SQL-Programmierer sagt: Ich möchte
Daten, die die folgenden Bedingungen erfüllen, sieh zu wie Du sie bekommst.
Dadurch wird das Programm, in das der SQL-Code eingebettet wird, in großem
Maß von dem Datenspeicher unabhängig und es wird sehr leicht, Datenspeicher
und Programm teilweise voneinander unabhängig zu entwickeln und den
Datenspeicher mit verschiedenen Programmen gemeinsam zu nutzen.

SQL ist dabei eine recht reiche Sprache: Da SQL eine Algebra auf diskreten
Relationen (= Tabellen) ist, operieren alle SQL-Befehle auf Tabellen und
haben wieder Tabellen als Ergebnis. Durch die verschiedenen Arten von
Subqueries kann man damit SQL-Befehle miteinander verketten und so mit den
Ergebnissen von SQL-Befehlen weiter rechnen. Die meisten anderen
Abfragesprachen (LDAP, XPath, und viele NoSQL-Abfrage"sprachen") sind keine
Algebren und erlauben keine derartige Verknüpfung von Abfragen. Das zwingt
den Entwickler, Anfragen in Schleifen in Code zu gießen und dann entweder im
Client auszuführen (hohe Latenz) oder generierten Code an die Datenbank zur
Ausführung zu senden. Dadurch findet man nun wieder eine sehr viel engere
Kopplung von Code und Datenspeicher - ändern sich Zugriffschemata,
Tabellendefinitionen oder andere Dinge, muß Code angepaßt und die Anwendung
neu übersetzt werden, Queries werden als Code mit Schleifen und
Filterbedingungen geschrieben. Die Form des Codes ist dabei abhängig davon,
welche Zugriffshilfen in Form von Indices im Datenspeicher existieren - eine
SQL-Query ist in der Form (nicht jedoch in der Performance) unabhängig von
den existierenden möglichen Zugriffspfaden.

Zum Teil geht das so weit, daß man zu den Fehlern und Problemen
hierarchischer Datenspeicher zurückfällt: Sind Daten als Graph oder Baum
gespeichert, dann definieren die Kanten im Graphen die festen möglichen
Zugriffspfade und Abfragen. Speichert man etwa in einer Personaldatenbank
Personen und das ihnen zugeordnete Inventar, dann kann man Inventar pro
Person leicht finden, aber es ist sehr viel teurer, alle Personen zu finden,
die eine bestimmte Sorte Werkzeug/Inventar verwenden.

Wenn mehrere Anwendungen einen Datenspeicher gemeinsam nutzen entsteht das
Problem, daß man Datenintegrität und Zugriffsregeln aus der konkreten
Anwendung in eine von allen Anwendungen gemeinsam genutzte Filterschicht
abstrahieren möchte. In tradionellem SQL sind das Datentypen, Views,
Integrity-Constraints, Rules und Trigger, die Integritätsbedingungen werden
also Teil des Datenmodells. Im Ansatz meines Arbeitgebers existiert eine
Bibliotheksschicht, die Datenbankzugriffe abfängt und filtert - die
Integritätsbedingungen sind also Teil der Systembibliotheken. In den meisten
NoSQL-Systemen befaßt man sich mit dem Problem nicht und überläßt es dem
Anwender, damit klar zu kommen.

Gesucht ist ein 'NoSQL'-System (also eines, das die o.a. genannten vier
Eigenschaften hat), das die Vorteile von SQL nicht aufgibt.
