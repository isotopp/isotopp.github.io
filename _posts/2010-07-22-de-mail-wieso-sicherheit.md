---
layout: post
published: true
title: DE-Mail - Wieso Sicherheit?
author-id: isotopp
date: 2010-07-22 09:54:00 UTC
tags:
- demail
- internet
- politik
- security
- lang_de
feature-img: assets/img/background/rijksmuseum.jpg
---
[Netzpolitik](http://www.netzpolitik.org/2010/de-mail-freund-liest-mit/) verweist auf 
[Golem](http://www.golem.de/1007/76609.html) verweist auf 
[die Frankfurter Rundschau](http://www.fr-online.de/in_und_ausland/wirtschaft/aktuell/2868446_De-Mail-Elektronischer-Kuvertwechsel.html).  
Die deckt auf: DE-Mail ist nicht sicher, weil es nicht durchgehend
verschlüsselt, sondern "Auf den Servern jedoch werden die Mails aus
technischen Gründen kurz entschlüsselt und sofort wieder verschlüsselt".

Das muß wohl auch so sein, jedenfalls wenn man Antivirus und Antispam
implementieren will, insofern scheint die Lösung erst mal grob legitim zu
sein, auch wenns komisch klingt.

Komisch klingen tut es aber noch aus einem anderen Grund: 

Die Vertraulichkeit ist im Kontext DE-Mail nicht primär relevant, denn
DE-Mail war nie designed um _sicher_ im Sinne von _vertraulich_ zu sein. Es
geht stattdessen um die Schaffung von _Rechtssicherheit_ und das ist im
wesentlichen keine technische, sondern eine juristische Konstruktion, bei
der die technischen Maßnahmen nur qualifizierende Begleiterscheinungen sind,
die die juristische Fiktion von DE-Mail stützen sollen. Daher laufen
Verweise auf PGP und ähnliches auch am Thema vorbei.

Das entscheidende Merkmal ist nicht die technische Konstruktion von DE-Mail, sondern das 
[DE-Mail Gesetz](http://www.netzpolitik.org/wp-upload/100702_De-Mail-Gesetz_Referentenentwurf.pdf)
(PDF, Entwurf), das festlegt, daß auf Grund der besonderen technischen
Konstruktion von DE-Mail besondere juristische Regeln wirksam werden. Diese
stellen eine DE-Mail dann je nach Versandart einem Brief oder einem
eingeschriebenen Brief oder einem eingeschriebenen Brief mit
Empfängeridentifikation und Rückschein gleich. 

Das passiert aber nicht wegen der tollen Technik, sondern auf der
rechtlichen Grundlage des noch zu schreibenden DE-Mail Gesetzes - für einen
Techniker ist das juristischer Schamanismus, weil die technischen Garantien
des Verfahrens aus der technischen Sicht eben genau das nicht leisten, was
das Gesetz dann anordnet.

Für den Kunden/Endnutzer sind auch andere, juristische und nur am Rande
technische Überlegungen wichtig, aus denen man DE-Mail wahrscheinlich eher
nicht nutzen will.

_Beweislastumkehr:_ Das DE-Mail Gesetz baut sich einen Anscheinsbeweis ein,
d.h. der Richter muß bis zum Beweis des Gegenteiles per Gesetz annehmen, daß
DE-Mail sicher ist und zuverlässig zustellt. Es obliegt dem Kläger, Fehler
in DE-Mail nachzuweisen, die Vertraulichkeit oder Zuverlässigkeit des
Systems betreffen, wenn er Recht bekommen will.

_Timeout:_ Es obliegt dem Inhaber eines DE-Mail Postfaches, dieses auch
regelmäßig zu leeren. Eine Sendung an ein Postfach gilt auch bei
Nichtabholung nach 3 Tagen als zugestellt. 
([Golem](http://www.golem.de/1007/76387.html): "Loggt sich ein Nutzer nicht
ein, soll ein Schreiben dennoch am dritten Tag nach der Absendung als
zugestellt gelten, ähnlich wie bei der Zustellung per Briefpost.")

_Bedarfsträger:_ Alle DE-Mail Implementierungen sind Webmailer. Die Mail
liegt physikalisch außerhalb des Herrschaftsbereiches des Postfachinhabers.
Jeder Bedarfsträger und sein Hund können Zugriff auf das angeblich ach so
sicher verschlüssselte Postfach bekommen, zum Teil auch ohne
Richtervorbehalt.

Es gibt sicher noch mehr gute Gründe gegen DE-Mail, aber mir persönlich
reichen schon diese 3.
