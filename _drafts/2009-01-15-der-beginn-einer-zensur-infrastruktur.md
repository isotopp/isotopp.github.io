---
layout: post
published: true
title: Der Beginn einer Zensur-Infrastruktur
author-id: isotopp
date: 2009-01-15 09:25:00 UTC
tags:
- internet
- jugendschutz
- media
- politik
- security
- lang_de
feature-img: assets/img/background/rijksmuseum.jpg
---
Jetzt wird mal so richtig durchreguliert, daß es nur so kracht! Aktueller Vorwand ist mal wieder der <a href="http://www.spiegel.de/netzwelt/web/0,1518,601179,00.html">Jugendschutz</a> und speziell die böse Kinderpornografie. Mehr Regulation und mehr Technik ist dringend notwendig, auch wenn <a href="http://www.spiegel.de/netzwelt/web/0,1518,601256,00.html">eine Studie der Harvard University</a> gerade rausgefunden hat, daß das Internet gar nicht so schlimm ist: <blockquote>Das Internet soll ein für Kinder gefährlicher Sündenpfuhl sein: An allen virtuellen Ecken lauern angeblich die Verführer. Ein Problem, sagt nun eine hochkarätige US-Studie zum Thema, sei das zwar durchaus - aber nur ein relativ kleines. Schlimm sei dagegen, was die Kids sich gegenseitig antun.</blockquote> Nicht wirklich <a href="http://blog.koehntopp.de/archives/772-Kinder,-Identitaetsmanagement,-Jugendschutz-und-das-Internet.html">eine neue Erkenntnis</a>.

Das ficht aber Frau von der Leyen nicht an, denn sie muß sich ja auch mal profilieren. Sie will, daß <a href="http://www.spiegel.de/netzwelt/web/0,1518,601440,00.html">Deutsche Serviceprovider […]  "noch in dieser Legislaturperiode" damit beginnen, Internet-Adressen mit kinderpornografischen Inhalten zu blockieren</a>. 



Das mit "noch in dieser Legislaturperiode" ist ihr wichtig, und <a href="http://www.heise.de/newsticker/Familienministerin-Provider-machen-mit-beim-Sperren-von-Kinderporno--/meldung/121769">die Norweger machen das schließlich auch!</a> Wir können uns so also schon bald auf eine gesperrte <a href="http://www.heise.de/newsticker/Nach-Wikipedia-Sperre-Kritik-an-der-britischen-Internet-Watch-Foundation--/meldung/120398">Wikipedia</a> und auch ein gesperrtes <a href="http://www.heise.de/newsticker/Britische-Jugendschuetzer-lassen-Internet-Archiv-blockieren--/meldung/121754">Archive.org</a> freuen, und natürlich sind ausländische Webproxies und Tor fiese Umgehungswerkzeuge, die verboten werden müssen!

Die Provider sehen das etwas anders: Sie fordern <a href="http://www.heise.de/newsticker/Internetprovider-fordern-klare-gesetzliche-Regelung-fuer-Access-Blocking--/meldung/121799">eine klare gesetzliche Regelung</a>, denn immerhin haben sie Verträge mit Kunden, und wenn sie jetzt plötzlich ins IP rein fassen ist es ihr Arsch, der da nackig im Wind hängt. Mit einer gesetzlichen Regelung hingegen wäre es die Regierung, die dann vom Verfassungsgericht zwei Jahre später eine Ohrfeige bekommt.

Schäuble wurmt das alles: Wäre er doch nur auf die Idee gekommen! So versucht er noch nachträglich zu scoren, indem er die ganze Sache nun <a href="http://www.heise.de/newsticker/Schaeuble-will-Kampf-gegen-Kinderpornografie-internationalisieren--/meldung/121809">auf EU-Ebene aufhängt</a>.

Alles in allem haben wir bald so eine Filter-Infrastruktur, die "Inhalte blockieren kann". Frau von der Leyen will dazu derzeit das DNS manipulieren - eine sehr umstrittene Technik, denn sie ist nicht nur leicht zu umgehen, sondern stört für die Leute, bei denen sie angewendet wird, neben Webzugriffen auch andere Dienste und kann Mail umleiten (ein G10 Eingriff!). Andere Leute fordern sperren auf IP-Ebene, doch damit wäre der Kollateralschaden - virtual Hosts sei Dank - noch größer. Wer sich an die "<a href="http://de.wikipedia.org/wiki/Radikal_(Zeitschrift)">Radikal-Geschichte</a>" und den <a href="http://en.wikipedia.org/wiki/Xs4all#Radikal_Magazine">Block von xs4all.nl</a> erinnert weiß das.

Für die Zukunft erwarte ich mehrere Trends:

Zum einen wird sich der Gebrauch einer Zensur-Infrastruktur, wenn sie erst einmal vorhanden ist, stark ausweiten. Schon jetzt - die ganze Sache ist noch nicht einmal beschlossen - gibt es Stimmen, die zum  Beispiel so auch den Zugriff auf "Glücksspielseiten" unterdrücken wollen. Ich nehme mal an, daß da in Zukunft dann auch noch weitere Interessengruppen Ansprüche anmelden wollen. Am Ende dieser Entwicklung werden wir dann sogar zivilrechtliche Ansprüche auf diese Weise befriedigen: "x macht im Ausland Äußerungen über mich, die nach deutschem Recht rechtswidrig sind und daher beantrage ich die Sperrung des Zugriffs auf diese Seiten von Deutschland aus".

Zum zweiten ist das Ganze nur sinnvoll, wenn man ähnlich wie bei Kopierschützen und bei Grauimporten und Grenzbeschlagnahme die Umgehung unter Strafe stellt. Dieser Teil der Gesetzgebung fehlt noch, wird aber sicher bald nachgezogen, sobald die ersten Artikel in den einschlägigen Windowsbuntblättern erscheinen. Ich sehe die Titelblätter mit "50 Wege wie sie die Internet-Zensur austricksen!" schon vor mir. Das ist also nur eine Zeitfrage.

Zum Dritten ist die Filterung von IPs und die Manipulation von DNS-Einträgen beides nicht geeignet, den gewünschten Effekt zu erzielen. Man wird sich also binnen zwei Jahren darauf kommen, daß man <a href="http://en.wikipedia.org/wiki/BGP">BGP-Spielereien</a> mit <a href="http://en.wikipedia.org/wiki/Phorm">Phorm</a>-Methoden kombiniert. Das bedeutet, man wird für bestimmte IP-Adressen über BGP das Routing so manipulieren, daß die entsprechenden Pakete nicht an den Zielserver zugestellt werden, sondern über einen Filterknoten etwa direkt beim BKA laufen. Dort wird man mit <a href="http://en.wikipedia.org/wiki/Deep_packet_inspection">Deep Packet Inspection</a> für diese IP-Adressen und nur diese den Inhalt der Pakete analysieren und ggf. einzelne Dienste bis auf URL-Ebene blockieren. Durch geeignete gefälschte Zertifikate kann man das dann sogar mit SSL-Verbindungen erreichen.

Zum Vierten muß sich das alles langfristig vom BKA weg zu den Providern bewegen. Diese werden zum Login einen elektronischen Personalausweis verlangen und schalten dann für jeden Benutzer individuell auf Präferenzen und Alternsnachweis unterschiedliche Sperrlisten. Zugleich werden diese Zugriffe mitgeloggt, um den Anforderungen der <a href="http://de.wikipedia.org/wiki/Vorratsdatenspeicherung">Vorratsdatenspeicherung</a> genüge zu tun. Eine feine Datensammlung entsteht, die bestimmt <a href="http://www.theregister.co.uk/2009/01/14/ny_cop_gilty_plea/">nie mißbraucht</a> werden wird.

Seiteneffekt ist dabei auch eine <a href="http://www.spiegel.de/netzwelt/web/0,1518,601399,00.html">Kriminalisierung</a> mehr oder weniger normalen Über-die-Stränge-Schlagens von Heranwachsenden.
