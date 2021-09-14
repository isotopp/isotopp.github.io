---
layout: post
published: true
title: IP-Nummern und elektronische Personalausweise
author-id: isotopp
date: 2008-11-08 08:16:27 UTC
tags:
- authentication
- identity
- politik
- security
- lang_de
feature-img: assets/img/background/rijksmuseum.jpg
---
![](/uploads/zorro.jpg)

Ich hatte es ja schon mal angesprochen:

[IP-Nummern sind wichtig]({% link _posts/2005-05-23-identifizierung-durch-ip.md %})
für Ermittler. Dabei galten in der Anfangszeit zwei Annahmen: 

1. Eine Internet-Adresse kann einem Benutzer zugeordnet werden, jedenfalls
   wenn es sich um einen DSL-Hausanschluß handelt und 
2. die ermittelte oder angezeigte Adresse hat etwas zu bedeuten.

Die erste Annahme ist im Kern schon aufgeweicht. Nicht nur die NAT-Adressen
von Ausgangsroutern von Firmen und Universitäten können mehr als einen
Benutzer repräsentieren, sondern hinter den IP-Nummern von DSL-Anschlüssen
können sich mehrere Rechner eines Haushaltes verbergen, oder gar via offene
oder geknackte WLANs eine unbekannte Anzahl unbekannter Benutzer.

Auch die zweite Annahme fällt mehr und mehr: Selbst wenn ein Rechner als
Tatausgangsrechner ermittelt wird, kann es sein, daß der Betreiber dieses
Rechners diese Tat nicht veranlaßt hat, etwa wenn der Rechner infiziert
wurde und als Bestanteil eines Botnetzes fremdgesteuert wird.

Inzwischen ist die Situation wohl noch komplizierter. Die 
[BBC](http://news.bbc.co.uk/2/hi/technology/7697898.stm) berichtet von einem
älteren schottischen Ehepaar, das angeblich ein Spiel der Firma Atari im
Filesharing angeboten hat - nur daß die Beklagten nichts von Filesharing,
P2P oder Computerspielen wußten.

Das ist wohl zunehmend der Fall:

> According to Michael Coyle, an intellectual property solicitor with law
> firm Lawdit, more and more people are being wrongly identified as
> file-sharers.He is pursuing 70 cases of people who claim to be wrongly
> accused of piracy and has spoken to "hundreds" of others, he told the BBC.
> "Some of them are senior citizens who don't know what a game is, let alone
> the software that allows them to be shared," he said.

Wie kommt es dazu und zu der zunehmenden Anzahl von Fällen? 

> "The IP address alone doesn't tell you anything. Piracy is only
> established beyond doubt if the hard-drive is examined," said Mr
> Coyle. Firms that facilitate file sharing, such as Pirate Bay, have been
> undermining efforts by anti-piracy investigators to track down file
> sharers. Pirate Bay makes no secret of the fact that it inserts the random
> IP addresses of users, some of who may not even know what file sharing is,
> to the list of people downloading files, leading investigators up a
> virtual garden path.

Dieses Szenario ist der Albtraum der privaten und öffentlichen Ermittler,
weil es die Zuordnung von Aktivitäten im Netz zu Personen schwierig bis
unmöglich macht.

Im Grobkonzept 2.0 zum elektronischen Personausweis heißt es dann auch ganz
klar:

> künftiges Szenario: Die Identität des Inhabers eines Benutzerkontos wird
> bei der Einrichtung und bei jeder Anmeldung gegenüber dem Internetservice
> sicher nachgewiesen. Internetservices, die nur eine sichere Wiedererkennung
> des Nutzers fordern, nutzen den pseudonymen Nachweis der Identität ohne
> Personendaten. Durch die Vergabe von Berechtigungszertifikaten erfolgt der
> Zugriff auf ePA-Daten zweckbezogen und datensparsam. Zusätzlich kann der
> Ausweisinhaber das Auslesen erfragter Personendaten verweigern. Der
> Personalausweis mit PIN eröffnet die Möglichkeit, ein sicheres
> „Single-Sign-On“ für Internetservices einzusetzen. Auf Basis lokaler
> Identitätsverwaltungsprogramme oder durch eID-Provider kann der Zugang zu
> Internetservices oder Netzwerkressourcen automatisiert werden. Der Daten-
> und Verbraucherschutz und die Sicherheit im Internet werden nachhaltig
> unterstützt.

und in einem anderen Beispiel

> künftiges Szenario: Mit dem ePA wird die Identität von Händlern bzw.
> privaten Käufern oder Verkäufern über das Internet nachgewiesen. Das
> Berechtigungszertifikat des Händlers bzw. der elektronischen
> Personalausweise privater Verkäufer und Käufer begründen ein größeres
> Vertrauensverhältnis zum Zeitpunkt der Online-Bestellung oder
> Gebotsabgabe. Der Verbraucherschutz im Online-Handel ist gestärkt. Der
> Identitätsbetrug bei Auktionen und Bestellungen wird erheblich erschwert.
> Bei Auktionen sind Bietermaschinen oder Angebote der Verkäufer
> ausgeschlossen.

Dies sind natürlich nur Einzelbeispiele - idealerweise im Sinne der
Ermittler meldet sich jeder Benutzer mit seinem Personalausweis "am
Internet" an. Das ordnet seine Aktivitäten im
Vorratsdatenspeicherungs-Logbuch zweifelsfrei seiner Identität zu, sodaß
auch im Nachhinein für jede Aktivität eine Person als Verantwortlicher
ermittelt werden kann. Außerdem aktiviert es den für den Anschlußinhaber
passenden Zugriffsfilter - dadurch sind allen Deutschen nach deutschem Recht
illegale Inhalte nicht mehr zugänglich und für Kinder und Jugendliche wird
zusätzlich der für die Altersstufe passende Filter dazugeschaltet. Dadurch
ist dann endlich auch der Jugendschutz sichergestellt und unsere Kinder sind
vor allem Bösen auf der Welt geschützt.

Juhu!
