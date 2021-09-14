---
layout: post
published: true
title: Die Welt ist meine... Zwiebel?
author-id: isotopp
date: 2005-06-02 08:26:10 UTC
tags:
- authentication
- identity
- security
- lang_de
feature-img: assets/img/background/rijksmuseum.jpg
---
![](/uploads/tor.jpg)

IP-Nummern werden
[überbewertet]({% link _posts/2005-05-23-identifizierung-durch-ip.md %})
das wußten wir schon. Nach einigen
[theoretischen Anmerkungen zum Thema Anonymität]({% link _posts/2005-05-24-ber-anonymit-t-reden.md %})
geht es jetzt in die Praxis, denn Anonymität kann man auch selber
herstellen. Die Grundlage dafür ist
[Onion Routing](http://en.wikipedia.org/wiki/Onion_routing): Netzknoten
bauen untereinander Verbindungen auf und senden einander immer gleich große,
verschlüsselte Pakete zu. Dadurch entsteht eine Wolke von Rechnern, die
untereinander ununterscheidbare Pakete zufällig austauschen.

Nutzer bauen Verbindungen zu einem Netzknoten auf und senden so Daten in die
Wolke. Die Pakete laufen zufällig durch einige dieser Netzknoten und treten
jetzt irgendwo an einem Knoten aus, um zu ihrem eigentlichen Empfänger zu
gelangen. Da die Pakete in der Wolke ununterscheidbar sind, ist es nicht
möglich, eintretende und ausgehende Verbindungen einander zuzuordnen. Da
jeder Netzknoten aufgrund der Verschlüsselung der Pakete nur den
unmittelbaren Vorgänger und den unmittelbaren Nachfolger kennen kann, aber
nicht die wahre Quelle und das wahre Ziel des Paketes, kann auch ein
einzelner kompromittierter Netzknoten die Kommunikation im Netz nicht
verkettbar machen (Die Wirklichkeit ist ein
[wenig](http://tor.eff.org/cvs/tor/doc/design-paper/tor-design.pdf) 
[komplizierter](http://freehaven.net/~arma/21c3-slides.pdf) (PDF)).

Onion Routing der ersten Generation basierte auf asymmetrischer
Kryptographie, und war aus verschiedenen Gründen relativ langsam.

[Tor](http://tor.eff.org/) ist das 
[Folgeprojekt](http://en.wikipedia.org/wiki/Tor_(Anonymous_network)) von den
[Erfindern](http://tor.eff.org/people.html) des Onion Routings und legt
besonderen Wert auf geringe Latenzen und Benutzerbarkeit in der realen Welt.

Für den Benutzer präsentiert sich Tor als SOCKS4a Proxy, der mit einem
SOCKS-sprechenden HTTP/HTTPS-Proxy wie
[Privoxy](http://www.privoxy.org/) ansprechen läßt. Das hat außerdem noch
den Vorteil, daß die Anonymität der Kommunikation durch präpariertes
Javascript oder HTML nicht mehr so leicht zu durchbrechen ist. Andere
TCP-basierende Protokolle wie ssh oder irc lassen sich mit Hilfe von
[TSOCKS](http://tsocks.sourceforge.net/) ohne Eingriff in die Anwendung
anonymisieren.

Alle anonymisierenden Dienste haben das Problem, daß sie 
[Abuse-Handling](http://tor.eff.org/eff/tor-legal-faq.html) definieren
müssen. Tor geht dieses Problem an, indem sie dem Betreiber einer Tor-Node
erlauben, die Rolle der eigenen Node in einer Verbindung zu definieren. Per
Default ist eine Node nur Mittelteil einer Verbindung und niemals Entry-
oder Exit-Node. Erst indem der Betreiber eines Knotens den SOCKS-Proxy von
tor konfiguriert, gibt er seinen Knoten als Entry-Node frei. Dabei kann er
festlegen, von wo die Nutzung seines Knotens als Entry-Node möglich ist.

Außerdem kann jeder Betreiber einer Node eines Exit-Policy definieren, die
festlegt, welche Verbindungen die tor-Node aus der Wolke heraus nach draußen
aufbaut: Ohne eine solche Exit-Policy ist eine tor-Node niemals Exit-Node.
Dadurch ist es Personen mit viel Bandbreite, aber eingeschränkten
Möglichkeiten zum Abuse-Handling (etwa Firmen) möglich, eine Node zu
betreiben und so zum Funktionieren des tor-Netzes beizutragen, ohne die
eigenen organisatorischen und personellen Strukturen zu belasten.

Viele Betreiber potentieller Knoten haben beschränkte Bandbreiten und
tägliche oder monatliche Trafficlimits. tor implementiert daher einen Token
Bucket Traffic Shaper, für den man eine durchschnittliche und eine
Burst-Bandbreite definieren kann. Die tor-Node wird dann niemals mehr
Traffic erzeugen, als diese Limits angeben. Mit Hibernation ist es außerdem
möglich, ein absolutes Trafficlimit für einen Zeitraum festzulegen und so
die Überschreitung von Trafficgrenzen etwa auf Dedicated Servers von
Hostinganbietern zu vermeiden.

Schließlich kann tor außerdem noch Hidden Services anbieten: Dies sind
Dienste wie das Hidden Wiki, deren reale Location und deren Betreiber im
Netz nicht bekannt ist - tor schützt also nicht nur die Anonymität von
Nutzern, sondern auch die Anonymität von Anbietern.
