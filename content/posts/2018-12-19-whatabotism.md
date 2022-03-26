♣---
author: isotopp
date: "2018-12-19T17:06:42Z"
feature-img: assets/img/background/rijksmuseum.jpg
published: true
title: Whatabotism
tags:
- lang_de
- computer
- security
- hack
---

Basierend auf einem [Thread in Twitter](https://twitter.com/isotopp/status/1075020503079886848) und [noch einem Thread](https://twitter.com/isotopp/status/1075394005502976001).

Im November 2012 kam Ingress von Niantic heraus.
Das ist ein server-basierendes Augmented Reality Game mit GPS-Koordinaten, bei dem man bestimmte Orte aufsuchen muss, um dort Dinge auf dem Mobiltelefon zu tun.
Im Februar 2013 hatte ich es durchgespielt und begann das Spiel zu automatisieren.
Ich schrieb Bots.

Das taten viele, denn das Spiel wurde von Niantic mehr oder weniger an die gesamte Android Developer Community geseeded.
Niantic hat dann versucht, Bots zu erkennen und Sicherheitsmaßnahmen in das Spiel einzubauen, die Botting schwieriger machen sollten.
Ich habe später eine Reihe von Artikel auf Google+ zu diesem Thema geschrieben.

![](/uploads/2018/12/whatabotism.png)

Aber Bots zu erkennen und dann zu bannen ist schwierig.
Viel schwieriger als gedacht.
Von meinen 1000 Bot-Instanzen wurden am Ende keine gebannt, aber große Teile der Berliner Ingress Community und der Ingress Community in anderen deutschen Städten wurden als false positives erkannt.

# Menschen simulieren

Wie macht man schwer zu erkennende Bots?

In Ingress soll man -- ohne Cheaten -- in der realen Welt herumlaufen und in der Nähe von bestimmten Markierungspunkten Aktionen ausführen.
Meist, um effektiv zu sein, als Gruppe.

Also hatten meine Bots ein soziales Netz, mit anderen Bots, die bevorzugt (aber nicht immer) zusammen gespielt haben.

Sie hatten keine festen, wiedererkennbaren Routen, sondern Urges:
Rufe die Google Wetter API auf.
Schlechtes Wetter?
Füge eine Starbucks-Pause in die Route ein.

Habe Schlafenszeiten, Arbeitszeiten, wähle Spielzeiten entsprechend.
Plane Routen zwischen Ingress Portalen mit der Google Maps API und Fahrrad als Verkehrsmittel, warte die angegebenen Reisezeiten zwischen Aktionen an unterschiiedlichen Zielkoordinaten.

Mache niemals etwas mit maschineller Präzision.
Jittere Zeiten, Koordinatenangaben, Reaktionszeiten und auch sonst alles.

Und dann steuere auf dieser simulierten realweltlichen Person das Spielverhalten, wieder mit Urges, die auf dem In-Game Inventory und Spielstrategien baiseren.
"Verabrede" Dich mit anderen Bots und agiere gemeinsam (oder auch nicht).

Und wenn reale Spieler irgendwo aktiv sind, dann verlagere die Aktivitäten woanders hin.

Das alles erzeugt ein Verhalten, das so normal ist, daß echte Personen öfter gebannt werden als diese Bots.

Niantic war für eine gewisse Zeit lang stark interessiert, Bots zu erschweren oder unmöglich zu machen.
Ein verhaltensbasierter Ansatz hat aber nirgendwohin geführt:
Die Variation in menschlichem Verhalten ist so groß, daß man mit einer recht simplen Simulation wie oben beschrieben ein Botverhalten hin bekommt, das nicht signifikant aus der Masse der menschlichen Benutzer heraus sticht.

Am Ende war es langweilig:
Das Ziel für mich war Node.js und Javascript zu lernen.
Dieses Missionsziel wurde erreicht.
Zugleich hat sich die API des Spiels und das Spiel selbst so oft geändert, daß ich es hätte professionalisieren müssen, um mitzuhalten.
Daran bestand aber nie Interesse, also habe ich es aufgegeben -- zweimal durchgespielt (einmal in echt und einmal automatisiert) war genug.

Also habe ich die [Erkenntnisse in einem Google Dokument](https://docs.google.com/document/d/1A252cvmjl86n9uZ0tyi2X4ZabxLE4ribJIEBbC8FifQ/edit) aufgeschrieben und publiziert und danach andere Dinge getan.

# Bot oder Mensch?

Da ist eine Lehre drin für Leute, die Twitter-Bots oder andere Social Bots erkennen wollen.

Twitter ist nicht Ingress, und Diskussionen sind komplizierter als Burster zu werfen.

Aber "Markierungspflicht" oder "statistische Bot-Erkennung" sind beides Blödsinn, auf mehr als eine Weise.

Du kannst eine privilegierte API haben, die von der offziellen Twitter App genutzt wird,
und eine zweite API für maschinelle Interaktion auf Twitter.
Aber natürlich hindert das niemanden daran, die Menschen-API aus dem offiziellen Twitter Binary zu reversen und dann automaitissert zu vverwenden.
Oder den offiziellen Client zu scripten.

Und natürlich ist es am Ende egal, was den Effekt auf soziale Interaktion angeht, ob ein Troll ein Bot oder ein schlecht bezahlter Mindestlöhner in einem Schwellenland ist.

# Automat, Bot und Trollarmee

Man kann das dennoch für die vereinfachte Diskussion differenzieren: 

- ein automatisierter Account ist ein Account, der von einer Maschine mit Inhalten befüttert wird.
  Das kann so etwas simples wie ein Retweetbot sein, oder ein Bot, der die aktuelle Uhrzeit twittert,
  oder halt mein Friendsplus.me-Account, der mein Google+ nach Twitter geschoben hat.

  Ein automatisierter Account hat aber keine algorithmische Reaktionslogik in irgendeiner Form.
  Er generiert oder sucht Content und pushed den dann. Ein Feed.

  Nichts hält einen Accountbesitzer davon ab, den Feedbetrieb des automatischen Accounts mit manuellen Tweets zu mischen. 
  Viele Promis mit gemanagten Twitter-Accounts tun das.  
- Ein Bot ist ein automatisierter Account, der reaktiv Tweets sucht oder liest, und dann algorithmisch eine Reaktion generiert.
  Oft (aber nicht zwingend) mit dem Ziel als reale Person gesehen zu werden.

- Trolle sind genau keine automatisierten Accounts, sondern manuelle Benutzer, die roboterhaft auf Reize aus Twitter oder anderen sozialen Medien reagieren.
  Sie werden oft wie Bots geführt. Die ganze Sendung [Neo Magazin Royale: Hass im Internet](https://www.youtube.com/watch?v=fAYjSLtz6wQ) beschäftigt sich damit.

Und das ist genau der Punkt.
Die politische Diskussion beschäftigt sich mit den äußeren Merkmalen ("Syntax"), aber eigentlich geht es darum, was passiert:
organisierte und verdeckte Beeinflussung eines öffentlichen Diskurses - "Semantik".
Die Mittel sind im Grunde Wurst.

Nun muß die organisierte Beeinflussung eines öffentlichen Diskurses nicht falsch sein.
Ich habe das in der Vergangenheit oft getan.
Um 2000 habe ich de.comp.lang.php manipuliert, 2003 habe ich Heise Foren manipuliert, wann immer web.de erwäht wurde,
und zusammen mit Freunden haben wir die USENET-Gruppen de.talk.bizarre und de.soc.rollenspiele.misc mit unterschiedlichen Absichten offen oder verdeckt geführt.

Der Talk [Flames im Internet (CCCS 2007, Froscon 2014)](https://www.slideshare.net/isotopp/flames-kommunikationszusammenbrche-im-netz)
([Video](https://www.youtube.com/watch?v=FXD3vk9M7SQ)) dokumentiert das.

Der Punkt ist mehr, daß verdeckte Beeinflussung des politischen Diskurses ein Problem ist. 
Aber das kann man in Deutschland im politischen Diskurs so nicht sagen.
Denn dann hat Deutschland mehr als ein Problem.
Also nicht nur Russen-Nichtbots und die Reconquita Germanica, sondern auch falsche oder fehlende Gesetze zur Regulierung der Bestechlichkeit von Abgeordneten oder Lobbyismuskontrolle.

Und das kann ja nun wirklich keiner wollen.
Es kommt also in Wahrheit darauf an, daß die richtigen Interessengruppen den politischen Diskurs verdeckt beeinflussen können.
Nur so kommen wir weiter!
