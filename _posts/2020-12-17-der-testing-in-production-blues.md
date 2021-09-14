---
layout: post
title:  'Der Testing-in-Production-Blues'
author-id: isotopp
feature-img: assets/img/background/rijksmuseum.jpg
date: 2020-12-17 21:45:51 +0100
tags:
- lang_de
- bildung
- politik 
---

Kalenderwoche 51/2020: Lockdown mit Schulschließungen. Nachdem es im März schon einmal Schulschließungen wegen Corona gab, und dort die Defizite technischer und organisatorischer Natur offenbar wurden, hat man in Deutschland die Zeit genutzt und sich auf die vorhergesagte 2. Welle vorbereitet, die jetzt genau eingetroffen ist. Deutschland ist schließlich nicht nur das Land der Dichter und Denker, sondern auch ein Land der Ingenieure und Tüftler, und bekannt für seine funktionierende und effiziente Bürokratie.

Oder?

- [Die bayrische Plattform mebis bricht unter dem Ansturm zusammen](https://twitter.com/Preiselbauer/status/1239522055315435527). Angeblich ist es DDoS, wahrscheinlicher sind es einfach User.
- [Auch LernSax in Sachsen leidet unter bösen Hackern](https://twitter.com/Bildung_Sachsen/status/1338416073155153921). Vermutlich sind es auch hier User.
- [Unterdessen bricht auch in MVP die itslearning-Instanz zusammen](https://twitter.com/Nordkurier/status/1339218679498747905)
- [In NRW hat man ebenfalls Probleme und begrenzt die Teilnehmerzahl auf 80 pro Schule](https://twitter.com/chgeuer/status/1338774727805050882)

(zusammengetragen von [@union_watch](https://twitter.com/watch_union/status/1239522932797444096))

Dazu ein paar Anmerkungen:

## Zwei IP-Adressen, beliebig viele Server

Es ist mehr als [ein Paar Frontend-Server](https://twitter.com/watch_union/status/1339231931578322962). Die angegebenen IPv4-Adressen 104.16.101.21 und 104.16.102.21 gehören zu Cloudflare:

```console 
$ whois 104.16.101.21
...
NetRange:       104.16.0.0 - 104.31.255.255
CIDR:           104.16.0.0/12
NetName:        CLOUDFLARENET
NetHandle:      NET-104-16-0-0-1
Parent:         NET104 (NET-104-0-0-0-0)
NetType:        Direct Assignment
OriginAS:       AS13335
Organization:   Cloudflare, Inc. (CLOUD14)
RegDate:        2014-03-28
Updated:        2017-02-17
Comment:        All Cloudflare abuse reporting can be done via https://www.cloudflare.com/abuse
Ref:            https://rdap.arin.net/registry/ip/104.16.0.0
...
```

Cloudflare ist ein Betreiber eines CDN (Content Delivery Networks), das Frontend-Dienste mit DDoS-Schutz für alles und jeden anbietet. Cloudflare arbeitet mit [DNS basierendem Global Loadbalancing](https://www.cloudflare.com/de-de/learning/cdn/glossary/global-server-load-balancing-gslb/) oder mit [TCP Anycast](https://www.cloudflare.com/de-de/learning/cdn/glossary/anycast-network/). Auf diese Weise kann entweder derselbe DNS-Name oder gar dieselbe IPv4-Adresse zu dem Server aufgelöst werden, der dem Verbindung Suchenden am nächsten liegt. Das Maß "am Nächsten" ist dabei meist auf der Netzwerk-Topologie definiert, also "mit den wenigsten Hops" oder "mit der geringsten Zugriffsverzögerung (Latenz)", und das muß nicht unbedingt der geographisch am nächsten liegende Server sein.

Hinter dem Loadbalancer liegen also nicht nur mehr als zwei Server, sondern möglicherweise sogar mehr als ein Standort. Es ist die Dienstleistung und das Geschäft von Cloudflare, schlechte (DDoS) von guten Verbindungen zu trennen, und für die guten Verbindungen den netztopologisch am günstigsten gelegenen Server zu verbinden.

Die Nutzung von Cloudflare macht natürlich auch die Erklärung "es ist ein DDoS" oder "es sind Hacker" weniger glaubwürdig. Cloudflares Geschäft ist es, so etwas auszusortieren. Ein paar Schüler, die keinen Bock auf Fernunterricht haben und die deswegen rum kaspern holen Cloudflare im Mittel eher nicht runter.

## Serverzahlen und Größen

- [Mebis hatte mal ganze sechs, mittlerweile 28 Server, um 1.7 Millionen Schüler:innen multimediale Lerninhalte zu übermitteln](https://twitter.com/watch_union/status/1339320827381239808)

Das muß nichts schlimmes heißen. Insbesondere dann nicht, wenn man ein CDN wie Cloudflare davor schaltet.

Disclaimer: Ich kenne das Design von mebis nicht. Ich kenne aber Anwendungen von Cloudflare in anderen Kontexten.

Die Server selbst führen die Anwendung aus. Die Anwendung generiert in der Regel das HTML der Basisseite, und dort drin sind dann die Seiten-Elemente enthalten - also Grafiken, Filme, Zeichensätze, CSS und was sonst noch so von einer Webseite nachgeladen wird, damit sie bunt ist. Dieses HTML ist oft nicht statisch, sondern wird dynamisch unterschiedlich für jeden User generiert.

Ein CDN wie Cloudflare cached in der Regel die statischen Seitenelemente, und verbreitet sie aktiv im Content Delivery Network zu den Edges. Also zu den Servern, die möglichst dicht am User stehen und die dann zum Enduser ausliefern. Medieninhalte wie Filme, Bilder und andere große statische Dinge sind also idealerweise gar nicht auf den Servern von Mebis enthalten, oder werden jedenfalls nicht von Mebis direkt an den Enduser ausgeliefert, sondern werden vom CDN abgefangen und dort abgehandelt - darum will man so etwas ja genau haben.

Die eigenen Server generieren dann nur das dynamische HTML, benutzerspezifisch, das dann die ganzen großen, statischen Elemente referenziert, die von Cloudflare geliefert werden. Auf diese Weise braucht man am eigenen Server sehr viel weniger Bandbreite und Leistung.

### Sind 28 Server viel oder wenig?

1.7 Millionen Schüler auf 28 Servern sind etwa 60k User pro Server. Ich kenne den Footprint von Mebis oder itslearning nicht, aber das ist für eine moderne Maschine möglicherweise nicht zu viel. Ein moderner Server kann alles von einer 3000-Euro-Blade mit zwei [Xeon 4110](https://ark.intel.com/content/www/us/en/ark/products/123547/intel-xeon-silver-4110-processor-11m-cache-2-10-ghz.html), 128 GB RAM und einem 10 GBit/s Netzwerkinterface sein, bis hin zu einer [Dual EPYC 7502](https://en.wikichip.org/wiki/amd/epyc/7502) mit 4TB RAM und mehreren 100 GBit/s Netzwerkkarten.

Zum Vergleich: Eine Freemail-Datenbank von web.de im Jahre 2004 (eine HP DL380 G3 oder vergleichbar, mit zwei [frühen Xeon CPUs](https://ark.intel.com/content/www/us/en/ark/products/28016/64-bit-intel-xeon-processor-3-20-ghz-1m-cache-800-mhz-fsb.html)) hat die Daten von circa einer Million Freemail-Kunden erfolgreich verwaltet. Jede von denen wurde mit einer Hand voll Frontend-Servern zusammen zu einem Cluster verpaart und hat dann fröhlich eine Million User verarbeitet (bei 25m Usern insgesamt und 8-9m unique Logins am Tag, damals). Nun ist Webmail unter Umständen eine kleinere Hausnummer als ein multimediales Lernsystem, aber wir haben seit 2004 auch ein paar Fortschritte bei der Systemleistung gemacht, wie oben dargestellt.

28 Server ist also nicht vollkommen unrealistisch, je nachdem was die Anforderungen sind und was genau man dahinter stellt.

Es erscheint wenig, wenn man auf AWS VM-Serverhäppchen groß geworden ist und nie einen richten Baremetal-Server ganz für sich allein gehabt hat. Aber man sollte dabei auch bedenken, daß wir den ganzen Quatsch mit Virtualisierung oder Kubernetes ja genau deswegen machen, weil die meisten Anwendungen nicht in der Lage sind, selbst eine kleine Maschine wie die o.a. 3000-Euro-Blade voll zu machen.

Und selbst wenn, wollte man das eventuell nicht, sondern die Anwendung stattdessen in drei oder mehr Instanzen aufteilen, die auf drei bis fünf Drittelservern laufen, der Ausfallsicherheit wegen.

### Ist das alles teuer?

Hardware ist übrigens unglaublich billig. Eine 3000 Euro-Blade braucht im Laufe ihres fünfjährigen Serverlebens (bei drei Jahren Abschreibungszeitraum) Strom, Klima und Rechenzentrumskosten für noch einmal ca. 3000 Euro, und ein wenig Kosten für Netz. Man landet bei 60 Monaten bei Serverkosten von bummelig 120-150 Euro pro Monat.

Zum Vergleich: Die o.a. Blade ist in etwa eine AWS EC2 m5.5xlarge, wenn es sie gäbe. Eine m5.4xlarge entspricht etwa einer halben solchen Blade und die kostet in Frankfurt on-demand ohne Rabatte (30 x 24 x 0.92 USD) = 662.40 USD ohne weitere Nebenkosten (Netz, EBS oder was man sonst noch braucht), also 1324.80 USD like-for-like.

Niemand macht Cloud weil es billiger ist, im Gegenteil - man kann mit Mehrkosten von ca. 10x unrabattiert gegenüber einem effizient organisierten eigenen Rechenzentrum rechnen - falls man die Leute hat, und falls man die notwendige Größe hat, um sich so etwas leisten zu wollen. Unter 10k Servern (ca. 2+ Megawatt Stromverbrauch) würde ich aber eventuell gar nicht mal darüber nachdenken wollen.

## Wieso fallen die Plattformen dann alle um?

Das Bundesland Berlin hat [nach dem Statistikserver des Landes](https://www.statistik-berlin-brandenburg.de/BasisZeitreiheGrafik/Bas-Schulen.asp?Ptyp=300&Sageb=21001&creg=BBB&anzwer=5) circa 365k Schüler und noch einmal 87k Berufsschüler.

Das braucht nicht nur eine gewisse Menge an Bandbreite, Speicher und Datenbank, um so viele Kunden abzufackeln, sondern auch ein getestetes und eingespieltes Systemdesign, das auf die Größe zugeschnitten sein muß.

Dazu machen es sich Schulen notlos schwer, falls sie weiter Frontalunterricht im Internet simulieren und insbesondere Unterrichtsbeginn und Login landesweit minutengenau synchronisieren. Das wäre, wenn man es so machte, ein selbst organisierter und durch ein Ministerium verordneter Eigen-DDoS. Mit dem Gong drücken alle Return und die Server fallen um.

### Wie sich web.de mal selbst mit Userlogins ge-DoS-t hat

Auch hier wieder eine 15 Jahre alte Geschichte von web.de:

Die oben erwähnten Freemail-Datenbanken (25 davon in 25 Clustern) haben ein zentrales Gegenstück, die User-Datenbank. Dort sind alle 25 Millionen Freemail-User (und die zahlenden web.de Club User) verzeichnet. Der Stammdatensatz ist bummelig 1 KB groß und enthielt einen Haufen Felder, die sich nur sehr selten ändern.

Und er enthielt auch drei Lastlogin-Daten (web, IMAP und POP). Jedes dieser Felder ist ca. 4 Byte lang und sie stehen also an derselben Stelle in jedem User-Record, also etwa 1 KB weit auseinander. Die Datenbank hat Seiten von 8 KB Größe (es war damals ein rotes Oracle), es stehen also 6-8 User-Records in einer Datenbank-Seite.

Wenn sich jetzt also ein User anmeldet, dann wird dessen Record aktualisiert und eine Datenbankseite in der Datenbank ist "dirty" und muß irgendwann einmal zurück geschrieben werden. Falls sich in der Zeit bis zum Zurückschreiben noch ein User anmeldet, dann ist das gut, weil wir so zwei Updates zum Preis eines Writes bekommen. 

Bei 8-9m Unique Logins pro Tag und einer Gleichverteilung der aktiven User über die Records kann man aber annehmen, daß alle Pages der Userdatenbank mindestens einmal am Tag zurück geschrieben werden müssen. Das war anstrengend für die Userdatenbank, hat aber unter normaler Last einigermaßen okay funktioniert.

Wenn es nun bei web.de zu irgendeiner Störung kam, dann kommt es dabei meist auch zu einem Verlust der Session-Caches mit den Login-Tokens und die User werden alle ausgeloggt. 

Was machen ausgeloggte User? Sie melden sich neu an.

Dabei werden die Lastlogind-Daten aller derzeit aktiven User aktualisiert und wir haben einige Millionen Logins in wenigen Minuten - und die User Datenbank macht dicke Backen und fällt um, weil sie es nicht schafft, so viele dirty pages in so kurzer Zeit zurück zu schreiben.

Jede beliebige Störung hatte also einen Ausfall der User Datenbank als Folgestörung, zwangsläufig.

Das klingt so erzählt unmittelbar einleuchtend und ist auch leicht zu beheben, wenn man die Ursache identifiziert hat. Aber damals waren es mehrere Teams und einige Monate Arbeit, überhaupt zu verstehen, daß es sich um zwei Störungen handelt (die ursächliche Störung und den Folgefehler "UserDB überlastet"), und daß die 2. Störung immer dieselbe ist, egal was die ursächliche Störung war.

Die Lösung ist übrigens recht einfach:

Man zieht die volatilen Felder (die drei Lastlogin-Daten) aus den statischen Stammdaten raus und tut sie in eine einzelne Tabelle, die nur die User-ID und die drei Zeitstempel enthält. Das sind dann 25 Millionen Records von 16 Bytes plus Overhead, also eine Tabelle von 400-800 MB Größe statt vorher 25 Millionen Kilobyte, also 25 GB. 

Man hat also die Schreiblast für die Updates von 1024 Byte auf 16-32 Byte verkleinert, also um den Faktor 32-64 gesenkt. Das konnte die UserDB leicht abhandeln und das Problem trat nie wieder auf.

Was hat das mit mebis und itslearning zu tun? Direkt nichts, aber es zeigt, daß die Skalierung von Anwendungen in der Regel nicht einfach mit "mehr Server" zu machen ist.

### Skalierung geht nicht allein am Reißbrett

Eine Anwendung um den Faktor 10 zu skalieren heißt in der Regel, dieselben Deliverables mit einer komplett neu gemachten Architektur zu generieren. Ich habe in meinem Leben zwischen 1990 und 2005 viel Mail gemacht, für mich und meine Freundin (2), für einen kleinen Verein (20), für toppoint.de (200), für eine kleine Firma (2k), für Mobilcom.de (20k), ein Design für eine Ausschreibung bei hamburg.de (2m) und einige Jahre web.de (20m). 

Die Deliverables sind immer dieselben: SMTP, Antispam, Antivirus, Mailstore, IMAP, POP, Web, SMTP Auth+Submit. Die Architekturen und die Orgstrukturen unterscheiden sich in jeder dieser Ausbaustufen grundlegend, und das jeweils größere System wäre für den kleineren Fall heillos überdesigned, und das kleinere Design würde unter der Last des nächstgrößeren Anwendungsfalls zusammenbrechen oder zumindest sehr bedenklich knirschen und wackeln.

Was genau die Knackpunkte sein werden sieht man aber vorher in der Regel nicht, sondern man muß es unter Last testen.

Schlaue Leute gehen also nicht von Woche 50 mit 0 Usern auf Woche 51 mit 350k Usern. Das wird nirgendwo bei niemandem so reibungslos funktionieren.

Schlaue Leute onboarden erst mal eine Gruppe freundliche Testkunden, bügeln die schlimmsten Probleme mit denen aus, dann ein mehrfaches dieser Gruppe in einem nächsten Schritt und so weiter. Dabei mit immer größeren Schritten und - wichtig - mit der Option innezuhalten und Dinge zu ändern, sobald sich Probleme und Engpässe manifestieren.

Das geht natürlich nicht in einem Umfeld, das politisch Präsenzunterricht favorisiert und bei dem man die Technik nicht dauerhaft als lebenden Bestandteil in den normalen Unterricht integriert.

### Sobald die Technik funktioniert beginnt die eigentliche Arbeit

Zum Vergleich: Wo ich wohne ist die Schule meines Kindes (10) Bestandteil des Netzwerkes [Jong Leren](https://jl.nu/). Man verwendet Chromebooks mit Google Edu, und dazu kommen eine Reihe von externen Anwendungen, die sich gegen Edu authentisieren, aber unabhängig realisiert werden. [Gynzy](https://www.gynzykids.com/#/nl-nl/leerling/index/oefenen/) wird zum Beispiel verwendet, um Drillaufgaben zu automatisieren, also Rechnen, Kopfrechnen, Rechtschreibung und andere Dinge einzuüben, die auf Wiederholung basieren.

Im März und auch jetzt wieder gab es deswegen keine großen Technikprobleme, sondern "nur" einen Haufen organisatorische Arbeit. Wir haben Glasfaser daheim (500 Mbit/500 MBit, feste IP, 63 Euro/mo) und die Schule hat natürlich auch eine angemessene Anbindung und managed Wifi, damit die Chromebooks und elektronischen Wandtafeln stabil funktionieren.

Die Server stehen natürlich nicht in der Schule, wo sie kaum stabil zu betreiben wären, sondern in einer Reihe von Clouds (Google und wo immer Gynzi und die anderen Anwendungen gehostet werden).

Entsprechend beschränkte sich der technische Teil der Umstellung darauf, daß die Schule fragt, welche Schüler daheim keine angemessene Ausstattung haben und ob sie eventuell ein Chromebook nach Daheim mitnehmen müssen - wir nicht, das Kind hat sich auf seinem Notebook in Chrome vor langer Zeit schon eine Schul-Persona gemacht und wechselt zwischen seinen privaten Google-Accounts und seinem gemanagten Schulaccount frei hin und her.

Organisatorisch gab es eine Menge zu regeln und das war schwer genug - und Fernunterricht ist deutlich anders als Präsenzunterricht. In dieser 2. Runde haben sich die Jufen und Meester jetzt andere Dinge überlegt und es wird Arbeitsaufgaben zum Selbstabholen im Drive geben, zwei feste Walk-in Videosprechstunden für die Kinder und wahrscheinlich dann Termine nach Vereinbarung bei Fragen.

Wie neuer Stoff präsentiert werden wird weiß ich noch nicht, aber ich hoffe, daß man sich da an den einschlägigen Youtubern ([Lehrer Schmidt](https://www.youtube.com/channel/UCy0FxMgGUlRnkxCoNZUNRQQ), [Max macht Musik](https://www.youtube.com/channel/UCEmOTjOuZU_RkDJfRdn8y1A) und ähnliche) orientieren wird. Die Kinder werden also sehr viel freier und selbstständiger Stoff erarbeiten müssen, und bekommen dann hoffentlich gezielt und eher einzeln genau die Hilfe, die sie brauchen um weiter zu kommen. Es wird sich zeigen, wie sich das entwickelt und wie man von dort weiter iterieren wird.

Wie gesagt, die Umstellung bei uns ist kein technisches Problem, weil man die Technik sowieso schon seit Jahren jeden Tag verwendet. Das Problem ist eines einer komplett anderen Organisation und Unterrichtsmethodik (die sich bei jüngeren Kindern eventuell auch so nicht anwenden lässt), und die muß gefunden werden. Das ist auch ohne Technikprobleme nicht einfach.

## Hätte man das nicht alles vermeiden können?

Ja. Nein. Nein, eigentlich nicht.

Ja, klar, das ist alles nicht neu und nicht unerwartet. Andere Leute hatten diese Probleme schon und haben darüber geschrieben, viel und oft und mit hohem Detailgrad.

Nein, denn das sagt nichts, weil es nichts bedeutet. Ich habe [anderswo]({% link _posts/2020-08-31-on-touching-candles.md %}) einmal aufgeschrieben, wie mein Sohn das Wort "heiß" gelernt hat. Es war vor sieben Jahren, um die Weihnachtszeit, und sein drittes Wort. Er hat es gehört und nachgesprochen, aber es hat für ihn nichts bedeutet. Bis er in eine Kerze gefasst hat.

Im [Google SRE Buch](https://sre.google/sre-book/table-of-contents/) ist ausführlich in mehr als einem Kapitel beschrieben, wie man Cubby/Zookeeper aufsetzt und nicht aufsetzt und warum man keinen globalen, firmenweiten Zookeeper haben kann oder will. 

Wo ich arbeite haben wir gemeinsam und jeder für sich dieses Buch gelesen und verstanden (*berührt die Stirn*) und sind dann aus $GRÜNDEN trotzdem in so eine Situation geraten, mit den vorhersagbaren Resultaten. Wir wissen jetzt aus persönlicher Erfahrung (*berührt Herz*) wieso das keine Gute Idee war und warum man es anders haben will, und wir haben das verinnerlicht und machen das in Zukunft instinktiv (*berührt Bauch*) richtig.

Nein, eigentlich ließ sich das nicht vermeiden, denn Organisationen lernen so. Solche Fehlschläge sind auch wichtig, weil man jetzt gemeinsam geteilte Erfahrungen hat und auch aus der Krise weiß, welche Kollegen wie reagieren oder welche Kollegen schon vorher Ratschläge hatten, auf die man hätte hören sollen. Organisationen springen nicht, sie bewegen sich immer linear vorwärts, und das Beste was man erreichen kann ist ihr Gleiten umzulenken oder zu beschleunigen. "Sprunginnovationen" sind nie das Werk von größeren strukturierten Gruppen und Verwaltungen.

Jedenfalls glaube ich, daß jetzt in diversen Bundesländern auch Leute mit einem nassen Lappen neben anderen Leuten sitzen, die brennende Server haben löschen müssen. "Heiß!" sagen sie und deuten auf den Server. "Heiß!" sagen die Admins mit den verbrannten Fingern und nicken wissend.

Oder, wie Terry Pratchett sagt "Pan Narrans", the story telling ape, instead of "Homo sapiens", thinking man.

## Testing in Production

Die beste Simulation von Schülerhordern auf einem Medienserver sind... Schülerhorden auf einem Medienserver.

Daher sollte man nicht nur graduell onboarden, sondern auch die Schülerhorden dann jeden Tag auf dem Server haben, und nicht nur wenn gerade Pandemie ist. Nur so kann man jeden Tag und nach jedem Upgrade und jedem Change wissen, daß man ein System hat, das funktioniert. Nur so kann man realistisch Kapazität messen. Und nur so kann man ein Team von Admins haben, das mit kleinen Störungen jeden Tag Erfahrungen gesammelt hat, daß große Störungen keine unerwartete Herausforderung mehr sind.

Testing in Production und Testing with Production sorgt dafür, daß man Methoden und Architekturen entwickelt, die *Survivability* eingebaut haben, bei denen also die Struktur des Systems dafür sorgt, daß Fehler und Mißgeschicke sich auf eine Weise manifestieren, von der man sich erholen kann.

Ich bin nur froh, daß ich nicht die Person bin, die einer Öffentlichen Verwaltung beibringen muß so zu arbeiten, auch wenn ich glaube, daß es die einzige Arbeitsweise ist, die für so eine Problemstellung Erfolg haben kann...
