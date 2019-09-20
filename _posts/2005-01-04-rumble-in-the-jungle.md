---
layout: post
published: true
title: Rumble in the Jungle
author-id: isotopp
date: 2005-01-04 11:22:09 UTC
tags:
- blog
- free software
- lizenz
- lang_de
feature-img: assets/img/background/rijksmuseum.jpg
---
Eine RSS-Plattform, izynews.de, repliziert RSS-Feeds nach IMAP. Das ist neu, und für viele Leute sicherlich praktisch. izynews.de macht das jedoch für Geld, und ohne Lizenzen für die Feeds zu kaufen oder die Lizenzen auf den Feeds zu beachten. Das ist schlecht, und verärgert den <a href="http://blog.schockwellenreiter.de/7558">Schockwellenreiter</a>, <a href="http://www.industrial-technology-and-witchcraft.de/index.php/ITW/13214">IT&W</a> und <a href="http://www.lawblog.de/index.php/archives/2005/01/04/content-klau/">Herrn Vetter vom Lawblog</a>.

Neu ist es nicht - Slashdot versuchte zum Beispiel einst, Artikel der Benutzer als Buch zu verkaufen, und hatte einen Copyright-Vermerk, der die Artikel der Benutzer quasi in Besitz nahm. Seitdem habe ich einen Copyright-Vermerk als Signature auf Slashdot, und verweise dort auf <a href="http://kris.koehntopp.de/copyright.txt">eine Erklärung</a>, warum ich das so halte.

Wie auch immer, ein Blick ins Apache access.log zeigt uns, wie IzyNews auf den Feed zugreift:


<tt>62.75.174.182 - - [04/Jan/2005:11:38:51 +0100] 
  "GET /rss.php?version=2.0 HTTP/1.0" 200 29744 
  "-" 
  "IzyNews/1.0 (http://izynews.com, multiple subscribers)"</tt>

Von der IP 62.75.174.182 wurde also um die geigte Uhrzeit auf den RSS 2.0 Feed zugegriffen, dessen URL dort im Log zu sehen ist. Der Zugriff war OK (Status 200), und es wurden 29744 Bytes transferiert. Der Zugriff erfolgte direkt ("-"), und nicht über einen Verweis einer anderen Seite auf diese URL - der Referer war also leer. Der zugreifende Agent identifiziert sich als "IzyNews/1.0".

Das kann man plump über die IP sperren, oder aber über den User-Agent. Die Sperrung über die IP ist einfach. Man erzeugt eine .htaccess-Datei in der Wurzel seines Weblogs und schreibt dort

<tt>
order allow,deny
deny from 62.75.174.182
allow from all</tt>

Das ist jedoch plump und unflexibel. Ändert IzyNews die IP, oder kommen bei IzyNews wegen Reichtum mehrere Rechner hinzu, greift die Regeln nicht mehr. Zielsicherer ist eine Sperrung über den User-Agent.

Wir löschen die alte .htaccess also wieder und schreiben stattdessen in eine neue .htaccess-Datei den Absatz

<tt>SetEnvIfNoCase User-Agent "IzyNews/1.0" leecher=yes
order deny,allow
deny from env=leecher</tt>

Dies setzt die Umgebungsvariable "leecher", wenn der Agent von IzyNews zugreift (er kann an dem String "IzyNews/1.0" sauber identifiziert werden). Die deny-Regel verbietet dann (Error 403) den Zugriff für alle Requests, bei denen die Variable leecher gesetzt ist.

Außerdem sind da noch Leute, die Artikel über das IzyNews Webinterface lesen. Deren Requests sehen so aus:

<tt>217.246.46.112 - - [04/Jan/2005:12:19:58 +0100] 
  "GET /webcam/kris.png HTTP/1.1" 200 30008
  "http://aktuelles.izynews.de/de/dir/Weblogs%20%28Auswahl%29.htm?f=t"
  "Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.7.5) Gecko/20041109 Firefox/1.0"</tt>

Diese Requests sind also nur am Referer sauber zu identifizieren, denn der User-Agent ist der Name des Browsers, mit dem der IzyNews-Kunde die Site von IzyNews liest, und die IP ist die des Kunden, nicht die von IzyNews. 

Man sieht bei weiterem Lesen des Logs, daß das HTML selber niemals requested wird, denn das hat IzyNews ja per RSS abgezogen und hosted es auf "aktuelles.izynews.de". Die Bilder dagegen werden aber vom Originalserver referenziert. Dieselben Schutzmaßnahmen wie gegen Bilderklau helfen hier also auch. 

In der .htaccess zu den Zeilen oben hinzufügen:

<tt>SetEnvIfNoCase Referer izynews.de leecher=yes</tt>

Jetzt werden auch alle Zugriffe geblockt, bei denen der Referer auf izynews.de paßt. Damit erledigt sich auch das.

Juristische Gegenmaßnahmen bleiben von solchen Technikspielereien natürlich unberührt und können unabhängig eingeleitet werden.
