---
layout: post
published: true
title: MySQL und die Lizenzen
author-id: isotopp
date: 2004-03-14 08:43:19 UTC
tags:
- php
- lang_de
feature-img: assets/img/background/rijksmuseum.jpg
---
<a href='/uploads/20040314_dolphin.jpg'><img border='0' hspace='5' align='left' src='/uploads/20040314_dolphin.serendipityThumb.jpg' alt='' /></a> Früher war alles besser. Früher zum Beispiel konnte MySQL gar nix, und der Server stand unter der <a href="http://www.gnu.org/licenses/licenses.html#GPL">GPL</a>, während der MySQL Client unter der <a href="http://www.gnu.org/licenses/licenses.html#LGPL">LGPL</a> stand und alles war gut. So gut, daß zum Beispiel das PHP Projekt den MySQL Client den PHP-Sourcen beigelegt hatte und daß man deswegen Mühe hatte, ein PHP zu finden, das nicht mit einer MySQL-Datenbank reden konnte. Dieses Bundling ist es unter anderem gewesen, das den Siegeszug der <a href="http://www.onlamp.com/pub/a/onlamp/2001/01/25/lamp.html">LAMP</a> Plattform begründet hat.

Dann jedoch 

entschloß man sich bei MySQL einige Dinge zu tun: Erstens nahm man Venture Capital an, zweitens stellte man davon einen Haufen Leute ein und drittens schob man auf diese Weise die Weiterentwicklung von MySQL kräftig an. Die MySQL 4.x Serie entstand. 

Die Idee dahinter ist relativ offensichtlich: MySQL hat Datenbanken einen vollkommen neuen Markt eröffnet. Vor zehn Jahren war SQL-Wissen noch Spezialwissen und SQL-Datenbanken waren teure Dinge, die nur bei großen Projekten eingesetzt wurden. Es ist das Verdienst von MySQL, diese Situation von Grund auf verändert zu haben - heute hat jedes Script Kiddie SQL-Kenntnisse und verwendet lieber MySQL als Flatfiles, um selbst eine Highscore-Liste zu speichern. MySQL will nun mit Datenbanken das tun, was Linux mit Unix-Betriebssystemen gemacht hat.

<a href='/uploads/20040314_linux-penguin.jpg'><img border='0' hspace='5' align='left' src='/uploads/20040314_linux-penguin.serendipityThumb.jpg' alt='' /></a> MySQL befindet sich dabei in mehr oder weniger derselben Situation wie Linux 1994: Natürlich ist das Produkt (noch!) nicht so feature-complete wie die etablierten Spieler in diesem Markt, aber für den weitaus größten Teil der Anwender ist das auch überhaupt nicht notwendig. Für diese Anwender zählen nämlich nicht so sehr die fetten Enterprise-Featurelisten, als vielmehr gute Dokumentation und leichte Erlernbarkeit, die Verfügbarkeit von billigem Personal mit Kenntnissen im Produkt, Einsatz in Hostingumgebungen (Datenbank und Anwendung auf derselben Maschine, Trennung einer physikalischen in mehrere logische Datenbanken, Ressource-Quotas usw) und leichte Administrierbarkeit. 

MySQL hat seinen Kunden hier zugehört und unter der Häme und dem Spott der etablierten Datenbankhersteller etwas entwickelt, das in erster Linie Kundenwünsche erfüllt und erst jetzt, in den 4.x Versionen, anfängt Datenbankhersteller-Kriterien zu erfüllen. Unterwegs hat MySQL aber einen vollkommen neuen Markt geschaffen und definiert, und dem gesamten Datenbankmarkt ein vollkommen neues und von den Benutzerzahlen her gigantisches Low-End geschaffen. Von dort, und mit der dort erzeugten Userbase, will MySQL jetzt den Datenbankmarkt von unten her kannibalisieren und Datenbanken in ein Commodityprodukt umwandeln - die Lizenzpreise sprechen eine deutliche Sprache.

<h3>Ein Exkurs in Lizensismus</h3>
<a href='/uploads/20040314_gnu_head.jpg'><img border='0' hspace='5' align='right' src='/uploads/20040314_gnu_head.serendipityThumb.jpg' alt='' /></a> Der Markt hat jedoch anders reagiert, denn die Situation ist ein wenig komplizierter als in der verklärten "Früher war alles besser"-Darstellung von oben. Das Unheil begann damit, daß es im Grunde drei Klassen von Lizenzen gab oder jedenfalls seit der <a href="http://www.mozilla.org/MPL/">Mozilla Public License</a> gibt. Da ist zum einen die Edel-Lizenz GPL, die im Grunde nur mit sicher selber kompatibel ist (denn alles, was man mit der GPL zusammenbaut wird selber GPL). Dann sind da jede Menge freie Softwarelizenzen, die nicht GNU-Lizenzkompatibel sind. Freie Softwarelizenzen sind <a href="http://www.debian.org/social_contract.html#guidelines">DFSG-kompatible Lizenzen</a> außer der GPL selber, also so Dinge wie Apache, BSD, Mozilla-Derivate und so weiter sowie die LGPL. Und dann sind da kommerzielle Lizenzen und die seltsame Idee des Dual Licensing.

Dual Licensing ist, was Managerköpfe zum Platzen bringt: Da der Erzeuger eines urheberrechtlich geschützten Werkes dieses Werk selber nach belieben lizensieren kann, ist dieser Urheber nicht darauf beschränkt, das Werk nur unter einer einzigen Lizenz anzubieten. Man kann Software-Funktionsbibliotheken also unter der GPL anbieten, und für Leute, denen dies nicht gefällt, auch eine kommerzielle Lizenz zu verkaufen. 

"Ja, ist das nun frei oder nicht frei?"

Für die Anbieter von Software, die selber GPL ist und die die Bibliothek unter Dual Licensing einbinden wollen, ist alles klar. Die nehmen die Bibliothek unter der GPL und alles ist gut. Für Anbieter von Software, die kommerziell ist, ist auch alles klar. Die nehmen die Software entweder unter der kommerziellen Lizenz oder ein anderes, rein kommerzielles Produkt, weil ihnen das alles zu verwirrend ist.

Für die Anbieter von DFSG-Software ist alles unklar. Wenn ich eine Software-Funktionsbibliothek in mein Programm einbinde, und die Bibliothek selber ist GPL, dann muß mein Programm auch GPL sein. GPL, nicht "freie Software nach DFSG". Schlecht zum Beispiel für PHP, das inzwischen unter der <a href="http://www.php.net/license/">Apache-Lizenz</a> steht und Zend verwendet, das unter der <a href="http://www.trolltech.com/products/qt/freelicense.html">QPL</a> steht (die QPL wiederum ist eine modifizierte MPL, falls man mir noch folgen kann) und das Dutzende von anderen Projekten und Programmbibliotheken selber einbindet, die unter den unterschiedlichsten Lizenzen stehen.

<h3>Warum ist das für MySQL ein Problem?</h3>
<img border='0' hspace='5' align='right' src='/uploads/20040314_banker.serendipityThumb.gif' alt='' /> Mit MySQL 4.x hat MySQL, die Firma, das Tempo deutlich erhöht: Inzwischen sitzen jede Menge kommerzielle Entwickler für Geld daran, MySQL voranzubringen. Die Venture Capital Investoren wollen für ihr Geld innerhalb der nächsten drei bis fünf Jahre Return sehen.

MySQL muß also mehr kommerzielle MySQL-Lizenzen verkaufen. Das genau ist bei einem Produkt wie MySQL jedoch ein wenig schwierig: Der MySQL Server ist GPL. Man kann ihn also problemlos irgendwo hinstellen und in Betrieb nehmen, ohne daß man eine Lizenz kaufen müßte. Man kann, wenn man möchte, bei MySQL kommerziellen Support kaufen, guten Support sogar, für relativ kleines Geld. Dummerweise ist nur MySQL als Produkt viel zu gut, man kommt gut ohne Support hin. Dummerweise ist der MySQL-Server GPL, und liegt deswegen im Source vor. Wenn man also genug technisches Wissen im Haus hat, kann man sich auch leicht selber supporten.

Der MySQL Client war LGPL. LGPL ist eine GPL ohne Zähne: Man kann LGPL-Funktionsbibliotheken wie den MySQL CLient in sein Programm einbauen, ohne daß dieses Programm dann GPL oder LGPL sein müßte - es kann nahezu jede beliebige Lizenz haben.

<img border='0' hspace='5' align='right' src='/uploads/20040314_kunden.serendipityThumb.jpg' alt='' /> Hersteller von kommerzieller Software haben also Programme entwickelt, die die MySQL Clientbibliotheken enthalten haben, ohne eine Lizenz zwingend zu brauchen. Benutzer dieser Software haben sich also einen MySQL Server hinstellen können, ohne für diesen eine Lizenz zwingend zu brauchen und die haben die kommerzielle Software einsetzen können, ohne eine Lizenz zwingend zu brauchen.

Das hat funktioniert, solange MySQL, die Firma, ihr Wachstum aus den Supporteinnahmen und anderen Quellen selber finanziert haben. Aber mit VC in der Firma geht das nicht mehr.

Der MySQL 4.x Client ist also GPL. Genaugenommen ist er Dual Licensed. Wenn man also eine GPL-Anwendung schreibt, kann man den MySQL 4.x Client benutzen. Wenn man eine Nicht-GPL-Anwendung schreibt, und das schließt alle DFSG-freien, GPL-inkompatiblen Lizenzen mit ein, braucht man eine kommerzielle Lizenz.

<h3>Schmerzen</h3>
Soweit so unklar.

MySQL hat aber sich aus irgendeinem Grunde vorgenommen, an dieser Stelle einmal <b>nicht</b> auf ihre Kunden zu hören und die eigene Position mit den Kundenwünschen abzustimmen, sondern diese Änderung quasi im Alleingang durchzuziehen. 

MySQL hat dabei den mittleren Fall der DFSG-freien, GPL-inkompatiblen Anwendungen vollkommen übersehen. 

<img border='0' hspace='5' align='right' src='/uploads/20040314_sterling.jpg' alt='' /> MySQL hat sich außerdem entschlossen, die GPL auf eine sehr seltsame Weise zu interpretieren: <a href="http://edwardbear.org/serendipity/archives/1193_My_Beef_with_MySQLs_License.html">Sterling Hughes</a> geht hier ausführlich in englischer Sprache darauf ein. MySQL argumentiert, daß auch jede Reimplementation von deren Protokoll MySQLs geistiges Eigentum wäre, weil es sich um ein abgeleitetes Werk handelt. Also ganz genau <a href="http://blog.koehntopp.de/archives/164_Cooties.html">die SCO Argumentation</a>.

MySQL ist außerdem jetzt schon seit mehr als einem Jahr damit beschäftigt, dieses Problem zu lösen.

<h3>Auflösungserscheinungen</h3>
Konsequenzen:

Die MySQL Clientbibliotheken liegen PHP nicht mehr bei. Das wird inzwischen nicht nur lizenzrechtlich, sondern auch technisch verargumentiert und wird deswegen auch dann so bleiben, wenn (sobald) PHP und MySQL sich einigen.

PHP liegen stattdessen SQLLite Bibliotheken bei. SQLLite ist eine Art "Access ohne GUI", also ein serverloses embedded SQL und daher performancetechnisch mit MySQL nicht zu vergleichen. Die SQLLite-Entwickler haben in den letzten Wochen große Fortschritte gemacht, ihre SQL-Syntax kompatibel mit MySQL SQL-Erweiterungen zu machen. Dennoch: Eine richtige Alternative ist das nicht, eher ein Schritt zurück.

MySQL hat <a href="http://buddhajohntwofish.com/archives/000620.html">gerade gestern</a> mit einer speziellen <a href="http://zak.greant.com/archives/000618.html">Ausnahmeregelung</a> versucht, das Problem der GPL-inkompatiblen freien Softwarelizenzen zu regeln. Leider mit einer statischen Liste statt mit einer Regel wie "Besorgt Euch eine DFSG-Evaluation und dann ist alles gut".

Der meiner Meinung nach unhaltbare Standpunkt, daß unabhängige Reimplementierungen des Protokolls auch abgeleitete Werke sind, wird von MySQL weiter aufrecht erhalten. Das läßt darauf schließen, daß MySQL auch lizenzrechtliche Bedenken gegen Middlewares wie <a href="http://sqlrelay.sourceforge.net/">SQLRelay</a> hat. 

SQLRelay ist selber GPL. Als Middleware legt SQLRelay einen Connection Pool von z.B. MySQL Datenbankverbindungen an und spricht mit der MySQL-Datenbank. Das ist lizenztechnisch unproblematisch. Auf der anderen Seite exponiert SQLRelay eine eigene, von der MySQL-API verschiedene Programmierschnittstelle. Da SQLRelay nicht wie MySQL den Standpunkt vertritt, daß die GPL auch über TCP/IP "ansteckend" sei, kann also eine kommerzielle Anwendung ohne MySQL-Lizenz mit SQLRelay reden. Zak Greant von MySQL war gestern abend im Chat zu diesem Thema nur der MySQL-Standardsatz zu entlocken: "If you use us with closed source software, we recommend using our commercial license."

<img border='0' hspace='5' align='left' src='/uploads/20040314_postgres.serendipityThumb.gif' alt='' /> <a href="http://www.postgresql.org/">Posgresql</a> hat endlich (ich seh da jedes Jahr mal nach oder so) eine Website, die den Namen verdient, und da gibt es sogar so etwas ähnliches wie Dokumentation. Aktuelles Postgresql kann viele Dinge besser als MySQL 3.23 und 4.0, Replikation bleibt ein Problem. Postgresql ist unter der <a href="http://www.postgresql.org/licence.html">BSD Lizenz</a> verfügbar und vollkommen problemlos mit allem möglichen integrierbar.<br clear='left' />

<img border='0' hspace='5' align='left' src='/uploads/20040314_firebird.serendipityThumb.gif' alt='' /> <a href="http://firebird.sourceforge.net/">Firebird</a> soll ich mir auch dringend einmal ansehen, sagt man mir. Die <a href="http://firebird.sourceforge.net/index.php?op=doc&id=ipl">Lizenz</a> habe ich noch nicht gelesen.<br clear='left' />

<h3>Fazit</h3>

Für mich persönlich nehme ich mehrere Erfahrungen mit: MySQL bemüht sich immerhin mit sehr ernsthaft die Situation in Bewegung zu halten und schließlich irgendwie zu lösen. Nach dem ich gestern abend im deutschen Irc eine Diskussion über den originalen <a href="http://yro.slashdot.org/article.pl?sid=04/03/13/1414212">Artikel</a> auf Slashdot angezettelt habe, hatte ich binnen einer halben Stunde Zak Greant am Rohr und wir haben den ganzen Kram inklusive SQLRelay versucht einmal durchzudeklinieren. Auch wenn wir nicht in allen Punkten zu einem Abschluß gekommen sind, bleibt doch der Eindruck, daß MySQL sich bewegt.

Anderseits bewegt sich MySQL unglaublich langsam - das alles war ja schon Thema auf dem Linuxtag 2003, wo sich die PHP- und MySQL-Spitzenleute getroffen haben und man die im Slashdot-Artikel vorgestellte Lösung inoffiziell bereits mehr oder weniger im Kasten hatte. In manchen Punkten bewegt sich MySQL gar nicht: Der Punkt mit der seltsamen GPL-Interpretation ("Ansteckung über TCP/IP", "Reimplementierung des Protokolls") bleibt offen, und SQLRelay bleibt fragwürdig.

Die Hochzeit zwischen PHP und MySQL ist jedenfalls mit MySQL 4.x definitiv vorbei. MySQL braucht freundschaftlich, aber bestimmt Druck durch Alternativen und Postgresql und Firebird brauchen Propaganda. Wir wollen einmal sehen können, was wir da tun können.

Dual Licensing - ich bin mir noch nicht abschließend sicher, ob das Teil des Problemraums oder Teil des Lösungsraums ist. Bemerkenswerterweise (Beispiele sind MySQL und Qt) wird in solchen Fällen die GPL eher als Restriktion denn als Befreiung angesehen - unter anderem deswegen, weil alternative Projekte mit weniger restriktiven Lizenzen vorhanden sind. 

Die FSF und das GNU-Projekt sind seltsam still in dieser Sache: Während sie sonst immer schnell dabei sind, die Überlegenheit der GPL gegenüber der LGPL zu verargumentieren, wird die FSF allgemein eher dem Gnome (LGPL) denn dem KDE/Qt (GPL)-Lager zugerechnet. Seltsam auch, daß die Projekte mit kommerziellem Backing (KDE/Qt - Troll, MySQL Database - MySQL AB) genau die GPL verfechen, während die Projekte mit nichtkommerziellem Hintergrund (Gnome, Postgresql) weniger "pure" Lizenzmodelle (auf der RMS-Skala) vertreten. Der Standpunkt von RMS war ja sonst immer "Die LGPL ist nur ein Notbehelf und wird letztendlich verschwinden (müssen). Wir brauchen sie nur, bis GNU eine lauffähige eigene Betriebssystemplattform hat, damit wir uns mit existierenden kommerziellen Foundations integrieren können. Generell ist die GPL der LGPL jedoch dringend zu bevorzugen." So ganz wirklich vertreten die diesen Standpunkt dann doch nicht, wenn es drauf ankommt.
