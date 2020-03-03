---
layout: post
published: true
title: Ein paar Worte zu SSL
author-id: isotopp
date: 2009-02-11 19:19:44 UTC
tags:
- kryptographie
- security
- web
- lang_de
feature-img: assets/img/background/rijksmuseum.jpg
---
Slowtiger antwortet in einem Kommentar zu [Mein natives IP V6]({% link _posts/2009-02-10-mein-natives-ip-v6.md %}):

> Wenn ich Sätze wie "Ob ich überhaupt noch unverschlüsseltes http auf V6 anbieten werde weiß ich nicht - die politische Situation legt nahe, daß dies Unsinn ist." in einem Technikblog lese, dann gruselts mich wirklich.

Also, die ganze Erklärung ist wie immer in wenig länger.

### Rechenleistung ist kein Problem

Es ist schon seit mindestens 5 Jahren so, daß jeder zeitgemäße Rechner leicht die Rechenleistung hat, um seinen Netzwerkverkehr zu verschlüsseln. Dazu braucht man auch keinen Krypto-Coprozessor.

Um dem ganzen mal eine Relation zu geben: Das ganze alte web.de Rechenzentrum von 2003 hat so um die 2 Megawatt (ca. 2500 PS, zwei fette Schiffsdiesel) Leistungsbedarf. Die SSL-Verschüsselung allen web.de Traffics verbraucht in etwa 7 Kilowatt (etwa 10 PS, eine Ente) an Rechenleistung.

Warum bietet also nicht jeder seine Website grundsätzlich SSL-Verschlüsselt an?

### SSL comitted sich zu früh auf den Sitenamen

Das liegt einmal am Aufbau von SSL. Der Webserver lauscht auf einem Port auf eingehende Verbindungen - hier dem https-Port 443. Das erste, was nach dem TCP-Connect passiert ist der SSL-Handshake: Server und Browser einigen sich darin auf die Gültigkeit der Zertifikate und die zu verwendende Verschlüsselung. Im Zertifikat steht auch schon der Name des Webservers - etwa 'blog.koehntopp.de'.

Erst danach kommt der eigentliche HTTP GET-Request, der nun schon gesichert und verschlüsselt im SSL-Tunnel übermittelt wird. Dadurch ist eine SSL-Verbindung von Anfang an gesichert.

Dieser Request muß nun aber an die im Zertifikat genannte Site sein. Es ist nicht mehr möglich, in einem für blog.koehntopp.de aufgebauten SSL-Tunnel einen Request für z.B. hubbahubba.de zu senden, denn das Zertifikat ist ja schon ausgetauscht und der Server hat das Zertfikat für blog.koehntopp.de vorgezeigt, nicht für hubbahubba.de.

Daher braucht man in SSL für jede Site eine eigene IP-Nummer, während man unverschlüsselt mit 'name based virtual hosts' eine IP-Nummer für beliebig viele Sites teilen kann.

### TLS mit SNI kann das umgehen

Auf dem Port 443 kann man nun verschiedene Geschmacksrichtungen von Verschlüsselungsmanagement fahren (die Verschlüsselung ist immer dieselbe, aber die Art und Weise, wie man sich über Namen, Schlüssel und Verfahren einigt ist subtil anders): SSL 2.0 (veraltet und defekt), SSL 3.0 (soweit bekannt sicher) und TLS (soweit bekannt auch sicher). Für TLS gibt es eine Erweiterung SNI ([Server Name Indication](http://de.wikipedia.org/wiki/Server_Name_Indication)), die genau dieses geschilderte Problem umgehen soll.

### SNI ist nicht weit genug verbreitet

SNI wird nun von einigen Browsern sogar unterstützt und fehlerfrei genug implementiert, sodaß man sie nutzen könnte um mehr als einen <strike>SSL</strike>TLS-Host pro IP zu betreiben. Leider ist der Marktanteil der Broser, die SNI beherrschen nicht groß genug. So wird SNI im MSIE nur in Vista unterstützt, behauptet jedenfalls Wikipedia.

### IPV6 ändert die Regeln

Mit IP V6 bekommt man in der Regel keine einzelnen Adressen zugeteilt, sondern gleich ganze Blöcke von Nummern. Es gibt also keinen Grund mehr sparsam mit den Adressen zu sein, sondern man kann ganz entspannt jedem Host sowieso eine einzelne Adresse zuweisen anstatt mit Hacks wie Name Based Virtual Hosts und SNI rumzufuhrwerken. Das heißt auch, daß SSL und TLS sehr viel einfacher zu implementieren sind - im Browser wie auch im Server. Und daß so mehr Leute ihre Sites einfach so auch verschlüsselt anbieten

### Die Sache mit den Zertifikaten

Dem wiederum steht in erster Linie die Handhabung von Zertifikaten entgegen, die aktuelle Browser so drin haben. Das Modell für den Umgang mit Zertifikaten ist derzeit nämlich weniger auf die Generierung von tatsächlicher Sicherheit ausgerichtet, sondern mehr auf die Generierung von Umsatz für Certification Authorities.

Derzeit ist es so, daß der Browser gerne ein Zertifikat sehen möchte, wenn er auf https://blog.koehntopp.de zugreift. Der CN (common name, hier: der Sitename im Zertifikat) muß dann mit dem DNS-Namen übereinstimmen. Das heißt im Zertifikat und in der Browserleiste muß in beiden Fällen blog.koehntopp.de stehen. Im Zertifikat steht dann außerdem noch, das blog.koehntopp.de von Kristian Köhntopp betrieben wird und daß dem Aussteller des Zertifikate die ladungsfähige Anschrift von Kristian Köhntopp bekannt war, als er das Zertifikat signiert hat - das setzt voraus, daß die CA bei Ausstellung des Zertifikates so was auch überprüft. Das Zertifikat muß außerdem von einer Certificate Authority ausgestellt sein, die der Browser kennt - welche CAs der Browser kennt, ist in ihm eingebaut. Trifft ein Browser auf Zertifikate von einer CA, die er nicht kennt, mault er mehr oder weniger laut rum. Firefox 3 mault 3-4 Mausklicks lang rum, jedesmal wenn er auf ein neues solches Zertifikat trifft. Man kann die CA-Liste zwar zur Laufzeit anpassen, aber das tut niemand jemals.

Nun ist es aber so, daß eine CA zu betreiben quasi eine Lizenz zum Geld drucken ist. Wenn man so mit Geld drucken beschäftigt ist, dann hat man es mitunter echt schwer, das Geld von Leuten abzulehnen. Und [zertifiziert dann alles und jeden](http://blog.fefe.de/?ts=b7affdb9). Damit ist ein Server-Zertifikat von dieser CA gar nix mehr wert. Als Endanwender kann man sich jetzt also seine CA-Liste im Browser angucken und sich überlegen, welche CA dort wohl wertige und welche wertlose Zertifikate ausstellt - am Zertifikat kann man das jedenfalls nicht sehen. Daher Fefes Anmerkung 'Totalschaden für SSL'.

Besser wäre es, der Browser würde sich mit CAs gar nicht weiter abgeben, sondern sich an Sites erinnern und warnen, wenn sich das Zertifikat einer Site spontan ändert - etwa [so](http://blog.fefe.de/?ts=b7a3db16). Dann kann sich jeder ein Zertifikat bauen und es unterschreiben wie er lustig ist. Man würde bei allen wichtigen Sites aber dennoch merken, wenn einem jemand versucht etwas unterzuschieben, weil sich das bereits bekannte Zertifikat spontan ändert.

### Und warum der ganze Schmonz?

IPV6 und SSL mit selbstsignierten Zertifikaten und optional einem Firefox-Plugin das auf die von Fefe beschriebene Weise funktioniert erlauben es uns, große Teile des bisher unverschlüsselten Webs zu verschlüsseln und sogar so etwas wie lokale Sicherheit zu erzeugen. Das geht deswegen, weil zwei der drei Gründe weggefallen sind, die bisher dagegen sprachen: CPU ist nicht mehr knapp und IP-Adressen sind es auch nicht (und an den knappen Zertifikaten arbeiten wir mit dem o.a. Vorschlag).

Das erhöht den Anteil von verschlüsseltem Traffic im Netz und macht jede Form von Filterung, [Phorm](http://en.wikipedia.org/wiki/Phorm) und anderen Formen von Injection sowie sonstiger Schnüffelei ab Werk schwieriger. Das schützt nicht nur einen selbst, sondern auch alle anderen, deren verschlüsselter Traffic nun viel weniger auffällig ist.

Das will man, und mit V6 wird das echt einfach.