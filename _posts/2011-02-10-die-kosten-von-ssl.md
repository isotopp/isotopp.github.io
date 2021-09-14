---
layout: post
published: true
title: Die Kosten von SSL
author-id: isotopp
date: 2011-02-10 19:08:54 UTC
tags:
- kryptographie
- security
- web
- lang_de
feature-img: assets/img/background/rijksmuseum.jpg
---
Bei web.de waren schon 2003 mehr als 80% des Datenverkehrs
SSL-verschlüsselt, da dort die Policy herrschte "Paßworte werden nur
verschlüsselt übertragen" und "Wenn ein Login stattgefunden hat, findet der
Rest der Session bis zum Logout verschlüsselt statt". Ich habe in
[einem Artikel]({% link _posts/2009-02-11-ein-paar-worte-zu-ssl.md %})
schon einmal dargelegt, daß das rechenleistungsmäßig keine große Belastung
ist - der ganze SSL-Aufwand macht etwa 1/250stel der Gesamtleistung des
Systems aus.

Kosten entstehen bei SSL bei der laufenden (symmetrischen) Verschlüsselung
nicht in nenneswerter Höhe, sondern nur bei der Herstellung der Verbindung,
wenn asymmetrische Kryptographie verwendet wird. Dort treten sie nicht nur
in Form von CPU-Verbrauch auf, sondern auch in Form von Datenmengen und
Roundtrips, also Übertragungslatenzen. Aber das ist nicht nur überschaubar,
sondern man kann es durch geeignetes Protokolldesign auch stark optimieren
(Verbindungen halten statt neu aufbauen, Parameter cachen und so weiter),
und außerdem
[schrauben Leute am Protokoll selbst](http://www.imperialviolet.org/2010/06/25/overclocking-ssl.html).

Nun stellte 
[Facebook gerade auf SSL um](http://www.heise.de/security/meldung/Facebook-jetzt-durchgehend-mit-SSL-Verschluesselung-1177890.html), 
und schon letztes Jahr begann 
[Google so langsam das Licht zu sehen](http://www.heise.de/newsticker/meldung/Google-verschluesselt-Suchanfragen-1005840.html). 
[Firesheep](http://codebutler.com/firesheep) macht Druck, und 
[HTTPS Everywhere](http://www.eff.org/https-everywhere) hilft sehr.

Firmen wie F5 finden das blöd, denn natürlich geht das mit einem relativ
kleinen Stapel gewöhnlicher Rechner genau wie mit einer teuren SSL
Appliance, auch wenn
[F5 das nicht wahr haben will](http://devcentral.f5.com/weblogs/macvittie/archive/2011/01/31/dispelling-the-new-ssl-myth.aspx). 
Und so macht man sich bei 
[Y-Combinators Hacker News](http://news.ycombinator.com/item?id=2184927) darüber lustig. 
Jedenfalls ist das Problem bei SSL 
[nicht die CPU Power](http://www.imperialviolet.org/2011/02/06/stillinexpensive.html).
