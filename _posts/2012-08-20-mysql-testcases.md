---
layout: post
published: true
title: MySQL Testcases
author-id: isotopp
date: 2012-08-20 13:41:55 UTC
tags:
- free software
- mysql
- lang_de
feature-img: assets/img/background/mysql.jpg
---
In 
[Entwickler kritisieren Oracles Umgang mit MySQL](http://www.heise.de/ix/meldung/Entwickler-kritisieren-Oracles-Umgang-mit-MySQL-1670240.html)
berichtet Heise über die Entdeckung von Sergei, daß Oracle zu einigen Bugs
[keine Tests mehr](http://blog.mariadb.org/disappearing-test-cases/)
ins Open Source Repository von MySQL stellt.

Damit man die Vorgänge ein bischen besser versteht, muß man den Hintergrund
ein wenig erläutern: Die meiste Open Source Software, die Datenbanken
benutzt, verwendet MySQL als primäre Datenbanken.  Der Support für Varianten
von MySQL, PostgreSQL oder gar kommerzielle Datenbanken ist in der Regel
schlecht bis nicht vorhanden.  Das ist ein extrem starker Effekt: Das 
[Drizzle](http://www.drizzle.org/)-Projekt zum Beispiel hat die
MySQL-Quellen radikal aufgeräumt und so eine sauberere und leichter weiter
entwickelbare Version einer Datenbank produziert, die jedoch zu dem
'Original' inkompatibel geworden ist.  Drizzle wird von nahezu keinem
Projekt sinnvoll unterstützt, und existierende MySQL-Software läuft nicht
mehr gegen einen Drizzle-Server.

Die anderen bestehenden Forks, 
[Percona](http://www.percona.com/software/percona-server/downloads/)
und 
[MariaDB](http://mariadb.org/)
sind also peinlich genau darauf bedacht, die Kompatibilität zu bestehendem
und sich weiter entwickelndem MySQL nicht auf eine Weise zu verändern, die
die Ausführbarkeit von Anwendung in irgendeiner Weise gefährdet.

Percona ist eine Firma, die Support- und Consultingdienstleistungen zu MySQL
anbietet und eben auch den InnoDB-Teil von MySQL zu XtraDB forked, Monty
Program AB und SkySQL sind Firmen, die den MariaDB Fork von MySQL entwickeln
und mit Dienstleistungen versorgen.  Aus der Sicht von Oracle sind dies
kommerzielle Konkurrenten.

Oracle bekämpft diese aus ihrer Sicht kommerzielle Konkurrenz auf zwei
Weisen:

Zum Einen durch die o.a.  Schließung von Testfällen und einzelnen Bug
Reports (auch das Handbuch von MySQL ist nicht von der GPL abgedeckt, unter
der der Server Sourcecode selber veröffentlicht wird).  Dadurch wird Percona
und MariaDB das Gleichziehen mit und die Kompatibilität zu MySQL erschwert.

Zum anderen durch das extrem hohe Entwicklungstempo in Bezug auf MySQL:
MySQL 5.5 war ein ausgezeichnetes und extrem stabiles Release, das in der
Versionsgeschichte von MySQL Maßstäbe hinsichtlich Performance und
Fehlerfreiheit gesetzt hat.  MySQL 5.6 wird dies - das ist jetzt schon
absehbar - weit übertreffen.

Spekulationen, Oracle wolle MySQL aussterben oder aushungern kann man also
getrost verwerfen: Das ist genau nicht das, was mit MySQL gerade passiert. 
Stattdessen ist MySQL seit Oracle schneller, besser und stabiler geworden
und die Entwicklung des Hauptzweiges von MySQL ist auf eine Weise
vorangekommen die vorher undenkbar gewesen wäre.

Oracle geht aber gerade sehr gezielt gegen aus ihrer Sicht kommerzielle
Konkurrenten und Trittbrettfahrer vor und versucht _diese_ auszuhungern. 
Mittel- und langfristig wird dies zu einer Spaltung von "Open Source MySQL"
(MariaDB, Percona und Drizzle) und kommerziellem MySQL führen.

Open Source MySQL ist dafür in einer denkbar schlechten Position, da noch
eine ganze Reihe von Abhängigkeiten zwischen Open Source MySQL und Oracle
bestehen: Zum einen hat Open Source MySQL keine freie Dokumentation und
keine freien Ausbildungsmaterialien - die Dokumentation zu MySQL steht im
Gegensatz zum Quelltext nicht unter der GPL und gehört daher mit allen
Rechten Oracle.  Ebenso fehlt es an freien Ausbildungsmaterialien und
Beispielen für korrekte "Anwendung" von MySQL in häufigen Problemstellungen,
mit denen Entwickler und Administratoren an MySQL herangeführt werden
können.

Zum anderen gibt es keine gemeinsame Roadmap von den Entwicklern der
MySQL-Forks und von Nutzern von MySQL.  Niemand weiß in Open Source MySQL,
wo Anwender von MySQL  Probleme sehen und Weiterentwicklung wünschen und
niemand weiß, welche Richtung für die Weiterentwicklung die jeweiligen Forks
für sich so vorsehen.

Solange sich die Open Source MySQLer - und Open Source MySQL Anwender!  -
nicht zusammentun, und gemeinsam Marken, Standards und Dokumentation für
"Open Source MySQL" entwickeln, wird Oracles Spaltungstrategie aufgehen. 
Abhilfe kann hier nur eine Fokussierung von Entwicklungsaufwänden und eine
gemeinsame Behebung von Defiziten bringen - das Produkt und das Projekt sind
inzwischen zu groß geworden um in mehreren weittstreitenden Projekten und
unter dem Druck von Oracle mitzuhalten.

Die Tatsache, daß weite Teile der MySQL-Anwendergemeinschaft noch immer
einer MyISAM-Denkweise und dem Ausbildungsstand von 2005 verhaftet sind,
hilft dabei kein Stück.  Anleitungen und Tutorials zu MySQL erklären
Transaktionen, korrekten Umgang mit Grenzfällen, InnoDB Performancetuning,
Debugging von Performanceproblemen, die aus der Umstellung von MyISAM nach
InnoDB entstehen und ähnliche Dinge so gut wie gar nicht, und in der Regel
schon gar nicht korrekt.  Der Abstand zwischen der MySQL-Entwicklung (in
allen Geschmacksrichtungen) und dem Ausbildungsstand der Community gemessen
an den Tutorials und typisch publiziertem Code ist größer den je.  Es wird
Zeit, den nächsten Schritt zu tun!  Dazu fehlt es jedoch an Material.

**TL;DR:** Die MySQL-Community ist selbst schuld und muß sich besser
organisieren, Aufwände zusammenfassen und Defizite wie das fehlende freie
Manual beheben.  Der generelle Ausbildungsstand unter MySQL-Anwendern ist im
Mittel und im Median katastrophal.

**Postscriptum:** In den einschlägigen Diskussionen bei Heise, auf
Slashdot und anderswo wird gerne auf Postgres und allen Ernstes auf SQLite
als Alternative verwiesen.  Dazu kann man folgendes sagen:

Wer Sqlite vorschlägt hat noch nicht einmal das Problem verstanden.

Postgres ist in aktuellen Versionen wahrscheinlich in der Lage, von der
Performance her mit MySQL mitzuhalten.  Die Postgres-Community ist jedoch
von der Denkweise und vom Entwicklungsansatz her nicht wirklich mit dem
MySQL-Weltbild kompatibel:

Postgres-Modellierer sehen die Datenbank in den meisten Fällen als
Monolithen, der die Herrschaft über die Daten und ihre Integrität hat und
die Regel für den Zugriff auf diese Daten auch in einer defekten oder
feindlichen Umgebung garantiert.  MySQL-Modellierer sehen die Datenbank und
ihre Nutzer als System, das kooperativ den Umgang mit den Daten reguliert. 
Nach dem
[Yegge-Modell](https://plus.google.com/110981030061712822816/posts/KaSKeg4vQtz)
ist Postgres also Software-Konservativ, MySQL Software-Liberal.

Die MySQL-Gemeinschaft entwickelt Eigenschaften der Datenbank in der Regel
iterativ: "Wir wissen, daß das kaputt ist, releasen das Feature aber schon
mal, damit ihr damit Erfahrungen sammeln könnt und uns dann Hinweise darauf
geben könnt, was wirklich wichtig ist".  Das ist der Bazaar-Ansatz für
Architektur und funktioniert nach Maßgabe von MySQLern sehr gut. 
Statement-Based Asynchronous Replication in MySQL zum Beispiel ist
fundamental limitiert und am Ende für eine bestimmte Fehlerklasse nicht
reparierbar, leistet aber in vielen Deployments erfahrungsgemäß und
inzwischen über mehr als eine Dekade ausgezeichnete Dienste.  Inzwischen
gibt es Alternativen und Weiterentwicklungen (RBR, Semisynchronous
Replication, GTID), aber in der Zwischenzeit haben alle schon einmal prüfen
können, was die Vorteile und Nachteile der existierenden Implementation sind
und was wirklich Reibungspunkte sind, die einer Verbesserung bedürfen.

Der Kathedralenansatz von Postgres hat dazu geführt, daß Postgres sehr lange
keine sinnvolle Replikation zur Verfügung hatte und bestimmte Ideen in
Postgres vollkommen überkomplex reguliert sind.  Mein Arbeitgeber zum
Beispiel hat sein System ursprünglich auf Postgres aufgebaut und dies dann
im laufenden Betrieb auf eine MySQL-Architektur migrieren müssen, damit das
System über einen monolithischen Server hinaus skalierbar wurde.  Das war
vor mehr als 10 Jahren, und Postgres hat dann effektiv letztes Jahr erstmals
einen Ansatz gehabt, mit dem man das System mit Postgres auf sinnvoll hätte
skalieren können.  Aus dieser Sicht kann man also getrost sagen, daß "MySQL
an Stellen Fehler hat, an denen Postgres nicht mal Code hatte".

Siehe auch
[einen älteren Artikel]({% link _posts/2010-11-04-red-vs-blue-at-oracle-und-ein-paar-gedanken-zu-postgres.md %})
zum Thema (der Artikel bezieht Performancegewinne von MySQL 5.5 und 5.6 noch
nicht ein).
