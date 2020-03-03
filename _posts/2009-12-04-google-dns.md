---
layout: post
published: true
title: Google DNS
author-id: isotopp
date: 2009-12-04 09:21:15 UTC
tags:
- lang_de
- internet
- google
feature-img: assets/img/background/rijksmuseum.jpg
---
Google teilt mit, daß sie nun 
[eigene öffentliche DNS-Server](http://code.google.com/intl/de/speed/public-dns/docs/using.html) betreiben, und erklärt dabei für Laien, wie man DNS-Server des Providers ausnullt und durch den DNS-Server von Google ersetzt.

Das ist sicher nur vorübergehend, ich bin sicher, daß die nächsten Versionen von Google Toolbar und Chrome dem Benutzer auch anbieten werden, die Änderung an seiner Stelle zu machen und zu kontrollieren, daß diese Einstellungen so bleiben. Ich bin mir auch sicher, daß Google Wege finden wird, die Kommunikation zwischen dem Rechner des Anwenders und Google so abzusichern, daß es nicht mehr möglich sein wird, DNS-Queries zwischen dem Client Rechner und Google durch einen transparenten DNS-Proxy abzufangen und auf die providereigenen DNS-Server zu fälschen - ich rechne da mit einer stufenweisen Eskalation zwischen lokalen Providern und Google, die am Ende auf einen weiteren Aspekt der Netzneutralitätsdebatte hinausläuft.

Mit dem Google DNS tut Google einen weiteren wichtigen Schritt, um sich von [anderer Leute Infrastruktur unabhängig zu machen]({% link _posts/2009-11-07-das-google-mi-verst-ndnis.md %}), und er ist damit voll konsistent mit der beobachteten Google-Strategie.

Die Aufgabe des Google DNS-Dienstes ist nach Aussage von Google ein Experiment in Performance-Verbesserung. Google will mit ihrem DNS-Server Muster in DNS-Anfragen erkennen und durch geeignetes Clustering und Prefetchen die Antwortzeiten verbessern. Dadurch soll der Aufbau von Webseiten schneller werden.

Spezifisch sagt Google in der [Intro](http://code.google.com/intl/de/speed/public-dns/docs/intro.html) zu dem Dienst, daß Google DNS für keine Domain authoritative ist, daß Google keine eigenen Rootzonen in die Antworten mischt und daß Google auch DynDNS oder andere DNS-Provider nicht ersetzen will.

[Viele Provider in Deutschland manipulieren ihr eigenes DNS](http://www.heise.de/newsticker/meldung/Telekom-leitet-DNS-Fehlermeldungen-um-213726.html) jedoch so, daß Anfragen nach nicht existierenden Hostnamen keinen Fehler erzeugen, sondern die IP-Nummer eines Provider-eigenen Webservers zurückliefern, auf dem sie dann einen Suchdienst laufen lassen und dabei dort auch Werbung einblenden. Der Google DNS tut das nicht, und so macht Google auf diese Weise auch [das DNS wieder heil](http://queue.acm.org/detail.cfm?id=1647302), denn derzeit ist es so, daß der Google DNS sauberer ist als die meisten ISP-DNS Server.

Jedoch: Das ist auch eine Art Angriff. Wenn Kunden statt des Provider-DNS den DNS-Dienst von Google verwenden, dann berauben sie ihren ISP dieser Einkommensquelle und so kommt es, daß selbst diese Form des DNS-Dienstes für viele Provider eine (wenn auch kleine) Bedrohung ist, da Google auch hier eine Einkommensquelle abzieht, selbst wenn Google den Traffic nicht nutzt um selbst Einkünfte zu generieren. 

Außerdem steht natürlich strategisch die Drohung im Raum, daß Google sich mit seinem Teil der Userbase irgendwann 'selbstständig' macht. Wenn die Anzahl der Benuzter, die 8.8.8.8 und 8.8.4.4 als DNS Verwenden erst einmal groß genug ist, dann ist es möglich, diesen DNS unter der Kontrolle von Google zu einem Misch-DNS umzuarbeiten, der ähnlich den ISP-DNS Suchseiten mit generiert, der neben den offiziellen Antworten auch eine .google Toplevel-Domain erzeugt oder der gar gänzlich vom normalen DNS abgelöst ein Googleversum erzeugt. Google wäre für diese Benutzer der Gatekeeper, der entscheidet, ob und welche Domains überhaupt erreichbar sind - jedenfalls so lange wie diese Benutzer sich entscheiden, diese IPs weiter als ihre DNS-Server zu verwenden.

Das alles tut Google derzeit wohlgemerkt nicht, und weist in ihrer Dokumentation auch spezifisch darauf hin, daß sie das nicht tun. Das muß Google auch nicht tun - es reicht die Vorstellung, daß das möglich wäre, hätten sie erst einmal genug User. Für Google ist all dies in der laufenden Debatte um Netzneutralität ein sehr wichtiges, aber sehr leises Argument. Von daher ist dieser Schritt seitens Google von einiger strategischer Brillianz.

[Fefe hat auch so seine Gedanken zum Thema.](http://blog.fefe.de/?ts=b5e7d15b)