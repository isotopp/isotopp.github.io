---
layout: post
published: true
title: MySQL und die Lizenzen
author-id: isotopp
date: 2004-03-14 08:43:19 UTC
tags:
- php
- mysql
- lang_de
feature-img: assets/img/background/mysql.jpg
---

![](/uploads/20040314_dolphin.jpg) 

Früher war alles besser. Früher zum Beispiel konnte MySQL gar nichts, und der
Server stand unter der
[GPL](http://www.gnu.org/licenses/licenses.html#GPL), während der MySQL
Client unter der
[LGPL](http://www.gnu.org/licenses/licenses.html#LGPL) stand und alles war
gut. So gut, daß zum Beispiel das PHP Projekt den MySQL Client den
PHP-Sourcen beigelegt hatte und daß man deswegen Mühe hatte, ein PHP zu
finden, das nicht mit einer MySQL-Datenbank reden konnte. Dieses Bundling
ist es unter anderem gewesen, das den Siegeszug der
[LAMP](http://www.onlamp.com/pub/a/onlamp/2001/01/25/lamp.html) Plattform
begründet hat.

Dann jedoch entschloss man sich bei MySQL einige Dinge zu tun: Erstens nahm
man Venture-Capital an, zweitens stellte man davon einen Haufen Leute ein
und drittens schob man auf diese Weise die Weiterentwicklung von MySQL
kräftig an. Die MySQL 4.x Serie entstand.

Die Idee dahinter ist relativ offensichtlich: MySQL hat Datenbanken einen
vollkommen neuen Markt eröffnet. Vor zehn Jahren war SQL-Wissen noch
Spezialwissen und SQL-Datenbanken waren teure Dinge, die nur bei großen
Projekten eingesetzt wurden. Es ist das Verdienst von MySQL, diese Situation
von Grund auf verändert zu haben - heute hat jedes Script Kiddie
SQL-Kenntnisse und verwendet lieber MySQL als Flatfiles, um selbst eine
Highscore-Liste zu speichern. MySQL will nun mit Datenbanken das tun, was
Linux mit Unix-Betriebssystemen gemacht hat.


![](/uploads/20040314_linux-penguin.jpg)

MySQL befindet sich dabei in mehr oder weniger derselben Situation wie Linux
1994: Natürlich ist das Produkt (noch!) nicht so feature-complete wie die
etablierten Spieler in diesem Markt, aber für den weitaus größten Teil der
Anwender ist das auch überhaupt nicht notwendig. Für diese Anwender zählen
nämlich nicht so sehr die fetten Enterprise-Feature-Listen, als vielmehr gute
Dokumentation und leichte Erlernbarkeit, die Verfügbarkeit von billigem
Personal mit Kenntnissen im Produkt, Einsatz in Hosting-Umgebungen (Datenbank
und Anwendung auf derselben Maschine, Trennung einer physikalischen in
mehrere logische Datenbanken, Ressource-Quotas usw) und leichte
Administrierbarkeit.

MySQL hat seinen Kunden hier zugehört und unter der Häme und dem Spott der
etablierten Datenbankhersteller etwas entwickelt, das in erster Linie
Kundenwünsche erfüllt und erst jetzt, in den 4.x Versionen, anfängt
Datenbankhersteller-Kriterien zu erfüllen. Unterwegs hat MySQL aber einen
vollkommen neuen Markt geschaffen und definiert, und dem gesamten
Datenbankmarkt ein vollkommen neues und von den Benutzerzahlen her
gigantisches Low-End geschaffen. Von dort, und mit der dort erzeugten
Benutzerbasis, will MySQL jetzt den Datenbankmarkt von unten her kannibalisieren
und Datenbanken in ein Commodity-Produkt umwandeln - die Lizenzpreise
sprechen eine deutliche Sprache.

### Ein Exkurs in Lizensismus

Der Markt hat jedoch anders reagiert, denn die Situation ist ein wenig
komplizierter als in der verklärten "Früher war alles besser"-Darstellung
von oben. Das Unheil begann damit, daß es im Grunde drei Klassen von
Lizenzen gab oder jedenfalls seit der

[Mozilla Public License](http://www.mozilla.org/MPL/) gibt. Da ist zum einen
die Edel-Lizenz GPL, die im Grunde nur mit sicher selber kompatibel ist
(denn alles, was man mit der GPL zusammenbaut wird selber GPL). Dann sind da
jede Menge freie Softwarelizenzen, die nicht mit der GPL kompatibel sind.
Freie Softwarelizenzen sind
[DFSG-kompatible Lizenzen](http://www.debian.org/social_contract.html#guidelines) außer der
GPL selber, also so Dinge wie Apache, BSD, Mozilla-Derivate und so weiter
sowie die LGPL. Und dann sind da kommerzielle Lizenzen und die seltsame Idee
des Dual Licensing.

Dual Licensing ist, was Managerköpfe zum Platzen bringt: Da der Erzeuger
eines urheberrechtlich geschützten Werkes dieses Werk selber nach Belieben
lizenzieren kann, ist dieser Urheber nicht darauf beschränkt, das Werk nur
unter einer einzigen Lizenz anzubieten. Man kann
Software-Funktionsbibliotheken also unter der GPL anbieten, und für Leute,
denen dies nicht gefällt, auch eine kommerzielle Lizenz zu verkaufen.

"Ja, ist das nun frei oder nicht frei?"

Für die Anbieter von Software, die selber GPL ist und welche die Bibliothek
unter Dual Licensing einbinden wollen, ist alles klar. Die nehmen die
Bibliothek unter der GPL und alles ist gut. Für Anbieter von Software, die
kommerziell ist, ist auch alles klar. Die nehmen die Software entweder unter
der kommerziellen Lizenz oder ein anderes, rein kommerzielles Produkt, weil
ihnen das alles zu verwirrend ist.

Für die Anbieter von DFSG-Software ist alles unklar. Wenn ich eine
Software-Funktionsbibliothek in mein Programm einbinde, und die Bibliothek
selber ist GPL, dann muss mein Programm auch GPL sein. GPL, nicht "freie
Software nach DFSG". Schlecht zum Beispiel für PHP, das inzwischen unter der
[Apache-Lizenz](http://www.php.net/license/) steht.

Intern verwendet PHP die Zend-Engine, die unter der
[QPL](http://www.trolltech.com/products/qt/freelicense.html) lizenziert wird.
Die QPL wiederum ist eine modifizierte MPL, falls man mir noch folgen kann.
PHP bindet außerdem Dutzende von anderen Projekten und Programmbibliotheken 
selber ein, die unter den unterschiedlichsten Lizenzen stehen.

### Warum ist das für MySQL ein Problem?

![](/uploads/20040314_banker.gif)

Mit MySQL 4.x hat MySQL, die Firma, das Tempo deutlich erhöht: Inzwischen
sitzen jede Menge kommerzielle Entwickler für Geld daran, MySQL
voranzubringen. Die Venture-Capital Investoren wollen für ihr Geld innerhalb
der nächsten drei bis fünf Jahre Return sehen.

MySQL muss also mehr kommerzielle MySQL-Lizenzen verkaufen. Das genau ist bei
einem Produkt wie MySQL jedoch ein wenig schwierig: Der MySQL Server ist
GPL. Man kann ihn also problemlos irgendwo hinstellen und in Betrieb nehmen,
ohne daß man eine Lizenz kaufen müsste. Man kann, wenn man möchte, bei MySQL
kommerziellen Support kaufen, guten Support sogar, für relativ kleines Geld.
Dummerweise ist nur MySQL als Produkt viel zu gut, man kommt gut ohne
Support hin. Dummerweise ist der MySQL-Server GPL, und liegt deswegen im
Source vor. Falls man also genug technisches Wissen im Haus hat, kann man
sich auch leicht selber supporten.

Der MySQL Client war LGPL. LGPL ist eine GPL ohne Zähne: Man kann
LGPL-Funktionsbibliotheken wie den MySQL Client in sein Programm einbauen,
ohne daß dieses Programm dann GPL oder LGPL sein müsste - es kann nahezu jede
beliebige Lizenz haben.

![](/uploads/20040314_kunden.jpg)

Hersteller von kommerzieller Software haben also Programme entwickelt, die
die MySQL Client-Bibliotheken enthalten haben, ohne eine Lizenz zwingend zu
brauchen. Benutzer dieser Software haben sich also einen MySQL Server
hinstellen können, ohne für diesen eine Lizenz zwingend zu brauchen und die
haben die kommerzielle Software einsetzen können, ohne eine Lizenz zwingend
zu brauchen.

Das hat funktioniert, solange MySQL, die Firma, ihr Wachstum aus den
Support-Einnahmen und anderen Quellen selber finanziert haben. Aber mit VC in
der Firma geht das nicht mehr.

Der MySQL 4.x Client ist also GPL. Genaugenommen ist er Dual Licensed. Wenn
man also eine GPL-Anwendung schreibt, kann man den MySQL 4.x Client
benutzen. Wenn man eine Nicht-GPL-Anwendung schreibt, und das schließt alle
DFSG-freien, GPL-inkompatiblen Lizenzen mit ein, braucht man eine
kommerzielle Lizenz.

### Schmerzen

Soweit so unklar.

MySQL hat aber sich aus irgendeinem Grunde vorgenommen, an dieser Stelle
einmal **nicht** auf ihre Kunden zu hören und die eigene Position mit den
Kundenwünschen abzustimmen, sondern diese Änderung quasi im Alleingang
durchzuziehen.

MySQL hat dabei den mittleren Fall der DFSG-freien, GPL-inkompatiblen
Anwendungen vollkommen übersehen.

![](/uploads/20040314_sterling.jpg)

MySQL hat sich außerdem entschlossen, die GPL auf eine sehr seltsame Weise
zu interpretieren:

[Sterling Hughes](http://edwardbear.org/serendipity/archives/1193_My_Beef_with_MySQLs_License.html)
geht hier ausführlich in englischer Sprache darauf ein. MySQL argumentiert,
daß auch jede Reimplementation von deren Protokoll MySQLs geistiges Eigentum
wäre, weil es sich um ein abgeleitetes Werk handelt. Also ganz genau
[die SCO Argumentation]({% link _posts/2004-02-08-cooties.md %}).

MySQL ist außerdem jetzt schon seit mehr als einem Jahr damit beschäftigt,
dieses Problem zu lösen.

### Auflösungserscheinungen

Konsequenzen:

Die MySQL Client-Bibliotheken liegen PHP nicht mehr bei. Das wird inzwischen
nicht nur lizenzrechtlich, sondern auch technisch verargumentiert und wird
deswegen auch dann so bleiben, wenn (sobald) PHP und MySQL sich einigen.

PHP liegen stattdessen SQLite Bibliotheken bei. SQLite ist eine Art
"Access ohne GUI", also ein serverloses embedded SQL und daher
performancetechnisch mit MySQL nicht zu vergleichen. Die SQLite-Entwickler
haben in den letzten Wochen große Fortschritte gemacht, ihre SQL-Syntax
kompatibel mit MySQL SQL-Erweiterungen zu machen. Dennoch: Eine richtige
Alternative ist das nicht, eher ein Schritt zurück.

MySQL hat 
[gerade gestern](http://buddhajohntwofish.com/archives/000620.html) mit
einer speziellen
[Ausnahmeregelung](http://zak.greant.com/archives/000618.html) versucht, das
Problem der GPL-inkompatiblen freien Softwarelizenzen zu regeln. Leider mit
einer statischen Liste statt mit einer Regel wie "Besorgt Euch eine
DFSG-Evaluation und dann ist alles gut".

Der meiner Meinung nach unhaltbare Standpunkt, daß unabhängige
Reimplementierungen des Protokolls auch abgeleitete Werke sind, wird von
MySQL weiter aufrecht erhalten. Das lässt darauf schließen, daß MySQL auch
lizenzrechtliche Bedenken gegen Middlewares wie
[SQLRelay](http://sqlrelay.sourceforge.net/) hat.

SQLRelay ist selber GPL. Als Middleware legt SQLRelay einen Connection Pool
von z.B. MySQL Datenbankverbindungen an und spricht mit der MySQL-Datenbank.
Das ist lizenztechnisch unproblematisch. Auf der anderen Seite exponiert
SQLRelay eine eigene, von der MySQL-API verschiedene
Programmierschnittstelle. Da SQLRelay nicht wie MySQL den Standpunkt
vertritt, daß die GPL auch über TCP/IP "ansteckend" sei, kann also eine
kommerzielle Anwendung ohne MySQL-Lizenz mit SQLRelay reden. Zak Greant von
MySQL war gestern Abend im Chat zu diesem Thema nur der MySQL-Standardsatz
zu entlocken: "If you use us with closed source software, we recommend using
our commercial license."

![](/uploads/20040314_postgres.gif)

[Postgresql](http://www.postgresql.org/) hat endlich (ich seh da jedes Jahr
mal nach oder so) eine Website, die den Namen verdient, und da gibt es sogar
so etwas ähnliches wie Dokumentation. Aktuelles Postgresql kann viele Dinge
besser als MySQL 3.23 und 4.0, Replikation bleibt ein Problem. Postgresql
ist unter der
[BSD Lizenz](http://www.postgresql.org/licence.html) verfügbar und
vollkommen problemlos mit allem möglichen integrierbar.

![](/uploads/20040314_firebird.gif)

[Firebird](http://firebird.sourceforge.net/) soll ich mir auch dringend
einmal ansehen, sagt man mir. Die
[Lizenz](http://firebird.sourceforge.net/index.php?op=doc&id=ipl) habe ich
noch nicht gelesen.

### Fazit

Für mich persönlich nehme ich mehrere Erfahrungen mit: 

MySQL bemüht sich
immerhin mit sehr ernsthaft die Situation in Bewegung zu halten und
schließlich irgendwie zu lösen. Nach dem ich gestern abend im deutschen Irc
eine Diskussion über den originalen
[Artikel](http://yro.slashdot.org/article.pl?sid=04/03/13/1414212) auf
Slashdot angezettelt habe, hatte ich binnen einer halben Stunde Zak Greant
am Rohr und wir haben den ganzen Kram inklusive SQLRelay versucht einmal
durchzudeklinieren. Auch wenn wir nicht in allen Punkten zu einem Abschluss
gekommen sind, bleibt doch der Eindruck, daß MySQL sich bewegt.

Anderseits bewegt sich MySQL unglaublich langsam - das alles war ja schon
Thema auf dem Linuxtag 2003, wo sich die PHP- und MySQL-Spitzenleute
getroffen haben und man die im Slashdot-Artikel vorgestellte Lösung
inoffiziell bereits mehr oder weniger im Kasten hatte. In manchen Punkten
bewegt sich MySQL gar nicht: Der Punkt mit der seltsamen GPL-Interpretation
("Ansteckung über TCP/IP", "Reimplementierung des Protokolls") bleibt offen,
und SQLRelay bleibt fragwürdig.

Die Hochzeit zwischen PHP und MySQL ist jedenfalls mit MySQL 4.x definitiv
vorbei. MySQL braucht freundschaftlich, aber bestimmt Druck durch
Alternativen und Postgresql und Firebird brauchen Propaganda. Wir wollen
einmal sehen können, was wir da tun können.

Dual Licensing - ich bin mir noch nicht abschließend sicher, ob das Teil des
Problemraums oder Teil des Lösungsraums ist. Bemerkenswerterweise (Beispiele
sind MySQL und Qt) wird in solchen Fällen die GPL eher als Restriktion denn
als Befreiung angesehen - unter anderem deswegen, weil alternative Projekte
mit weniger restriktiven Lizenzen vorhanden sind.

Die FSF und das GNU-Projekt sind seltsam still in dieser Sache: Während sie
sonst immer schnell dabei sind, die Überlegenheit der GPL gegenüber der LGPL
zu verargumentieren, wird die FSF allgemein eher dem Gnome (LGPL) denn dem
KDE/Qt (GPL)-Lager zugerechnet. Seltsam auch, daß die Projekte mit
kommerziellem Backing (KDE/Qt - Troll, MySQL Database - MySQL AB) genau die
GPL verfechen, während die Projekte mit nicht kommerziellem Hintergrund
(Gnome, Postgresql) weniger "pure" Lizenzmodelle (auf der RMS-Skala)
vertreten.

Der Standpunkt von RMS war ja sonst immer "Die LGPL ist nur ein Notbehelf
und wird letztendlich verschwinden (müssen). Wir brauchen sie nur, bis GNU
eine lauffähige eigene Betriebssystemplattform hat, damit wir uns mit
existierenden kommerziellen Foundations integrieren können. Generell ist die
GPL der LGPL jedoch dringend zu bevorzugen." So ganz wirklich vertreten die
diesen Standpunkt dann doch nicht, wenn es darauf ankommt.
