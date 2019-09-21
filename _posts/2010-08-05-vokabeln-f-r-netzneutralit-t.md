---
layout: post
published: true
title: Vokabeln für Netzneutralität
author-id: isotopp
date: 2010-08-05 15:14:00 UTC
tags:
- google
- internet
- mobiltelefon
- netzneutralität
- lang_de
feature-img: assets/img/background/rijksmuseum.jpg
---
Dies ist Teil 1, 
[Teil 2]({% link _posts/2010-08-06-netzwerk-berlast-vs-netzwerkneutralit-t.md %})
gibt es auch noch.

Die Diskussion über Netzneutralität erreicht nun endlich auch Deutschland,
auch wenn
[Deutschland als Internetstandort](http://www.neunetz.com/2010/08/04/der-schwache-internet-standort-deutschland/)
für ein Industrieland bemerkenswert schwach bewertet wird. Auslöser sind
dabei nicht die
Bemerkungen der Telekom zum Thema, sondern
[die Arbeiten von Google und dem Provider Verizon](http://gigaom.com/2010/08/04/did-net-neutrality-just-get-knifed-in-the-back/)
an etwas, das einmal Netzwerkneutralität definieren soll (aber in den ersten
Berichten dazu für einen Deal zwischen Verizon und Google gehalten worden
ist, der Google gegenüber anderen Anbietern bevorzugt hätte).

Geeinigt hat man sich dabei darauf, für das Festnetz Netzwerkneutralität zu
garantieren ("Google and Verizon’s agreement would prevent Verizon from
offering paid prioritization to the biggest bidders of capacity on its DSL
and fiber networks"), aber auf dem Mobilfunknetzwerk werde man eingreifen
("But any promises over open-Internet access wouldn’t apply to mobile
phones"). Eingriffe sollen dabei nicht auf Benutzerbasis, sondern auf der
Basis von Traffic-Klassen geschehen, was immer das in diesem Fall im Detail
bedeutet.

Es ist auf jeden Fall ein schwerer Rückschlag für Netzneutralität, da der
Ansatz die Regulierung von Knappheit gegenüber der Schaffung von Überfluß
bevorzugt.

### Worum geht es?

Netwerkneutralität im Allgemeinen dreht sich um das zentrale
Konstruktionsprinzip des Internet, daß Netzwerk selbst 'dumm' zu halten und
die 'Intelligenz' in den Endpunkten des Netzes zu installieren. 

Genauer gesagt: Das Netz selbst soll nur eine Sache machen, und die dafür
richtig - nämlich Datenpakete von A nach B routen. Daten sind Schüttgut und
das Netz analysiert die Daten nicht, um sie zu unterscheiden und dann
unterschiedlich zu behandeln. Das Netz bringt auch keine Dienste außer der
Beförderungsdienstleistung für die Daten, sondern Dienste sind in Endknoten
installiert.

Das ist eine Informatiker-Idee und die Antithese zum 
[Intelligenten Netz](http://de.wikipedia.org/wiki/Intelligentes_Netz)-Ansatz der
Fernmeldetechniker-Denkschule, bei der das Netz Dienste und Güteklassen
implementiert.

Betriebswirtschaftler mögen die Idee des dummen Netzes nicht so, denn sie
erlaubt es ihnen nicht, 
'[Dienste differenziert zu bepreisen](http://www.heise.de/newsticker/meldung/SMS-Kosten-sind-astronomisch-207127.html)'
(Und [das ist eine Goldgrube](http://gthing.net/the-true-price-of-sms-messages)).
Damit einher geht meist der Wunsch, kostengünstigere Alternativen
[zu blockieren](http://apcmag.com/mobile-carriers-seek-to-block-skype-on-iphone-blackberry.htm).

Ein Argument gegen Netzwerkneutralität, das von Mobilnetzbetreibern oft
gebracht wird, ist das **Datenvolumen**.

### Volumen: 5GB sind 5GB, egal was man rein tut

Das ist die absolute Menge an Daten, die in einem Abrechnungszeitraum (pro
Monat, pro Tag) transferiert wird. Heutige mobile Datenverträge heißen zwar
oft "Flatrate", sind aber keine, sondern sind tatsächlich Volumenpakete, da
sie genau dieses Volumen begrenzen (200 MB, 1GB oder 5GB pro Monat sind
häufige Stückelungen). Da Verbraucher jedoch ihren tatsächlichen Verbrauch
pro Monat nicht kennen und nicht beurteilen können, verkauft man ihnen "Flat
S, M, L und XL". Wären es wirklich Flatrates, also all-you-can-eat Angebote,
wäre eine S/M/L/XL-Differenzierung sinnlos.

"Flat" sind diese Verträge bestenfalls in dem Sinne, daß viele von ihnen bei
Erreichen des Volumenlimits nicht ganz abriegeln, sondern noch einen
Tröpfelbetrieb mit sehr stark limitierter Bandbreite erlauben. Das reicht
meist immerhin noch für Chat.

Weitere Einschränkungen von Flatrates ergeben sich meist in der Art, daß 
[Diensteinschränkungen](http://apcmag.com/mobile-carriers-seek-to-block-skype-on-iphone-blackberry.htm)
existieren, und zwar wird besonders gerne der Betrieb von VoIP-Anwendungen
und insbesondere Skype verboten.

Als Begründung wird dabei oft die Datenmenge vorgeschoben, aber das ist
natürlich zweifach Unsinn:

Solange ich mich in dem mit dem Vertrag gekauften Datenvolumen bewege dürfte
es in einem dummen Netz den Netzbetreiber nicht interessieren, welcher Art
die Daten sind, die das Volumen machen. Und zweitens überträgt Skype
Voice-Daten, genau wie ein Mobilfunknetz, und insbesondere Skype für
Mobiltelefone verwendet dabei einen Codec, der den Codecs von
GSM-Mobilfunknetzen ebenbürtig oder besser ist. Skype macht also eher
weniger Verkehr im Netz als ein normales Telefongespräch gleicher Länge.

### Tethering: 5 GB sind 5 GB, egal wer den Traffic macht

Die andere Beschränkung bei Volumenverträgen bezieht sich auf das Endgerät,
das vorgeschrieben werden soll: So darf eine Flat-Volumentarif oft mit einem
Mobiltelefon verwendet werden, mit einem hinter dem Mobiltelefon
angeschlossenen Computer ("Tethering", "Anketten" eines Computers an das
Telefon) aber nicht, als ob 5 GB von einem Laptop mehr Last erzeugen würden
als 5 GB von einem Mobiltelefon.

Die Annahme ist eine andere: 

Der Netzbetreiber spekuliert, daß ein Anwender mit einem Mobiltelefon sein
Kontingent eher nicht ausschöpft, während das bei einem Benutzer an einem
Laptop wahrscheinlicher ist, da das Mobiltelefon langsamer ist, einen
kleineren Bildschirm und eine schlechtere Eingabemöglichkeit hat. Spätestens
seit Arm A4 1GHz Prozessoren und iPads mit 64GB Speicher, Bluetooth Tastatur
und 1024x768 ist diese Annahme aber hinfällig - die meisten Netbooks und
viele ältere Laptops sind schlechter ausgestattet.

### Bandbreite und Volumen

Die zweite Vokabel, um die es geht, ist **Datenübertragungsrate** in Bit pro
Sekunde (umgangssprachlich **Bandbreite**). Das Volumen, das man mit einer
Flat erworben hat, wird ja nicht über den Abrechnungszeitraum gleichmäßig
abgerufen, sondern die durch den Teilnehmer generierte Auslastung variiert
mit seiner Netznutzung (dem Bandbreiten-Bedarf) und dem Netzausbau an seinem
Standort (der Bandbreiten-Verfügbarkeit) und den Anforderungen anderer
Netzteilnehmer in seinem Netzabschnitt (der Konkurrenz um die Bandbreite).

Um ein Gefühl für Bandbreiten zu bekommen:

Verfügbarkeit: Ein GSM-Channel stellt dabei eine Bandbreite von ca. 14
kBit/s zur Verfügung, von denen bei Datenverkehr etwa 9.6 kBit/s verwendet
werden können, EDGE dann zwischen 56 kBit/s und 220 kBit/s. 3G (UMTS) ist
liefert bis zu 384 kBits im Download, als HSDPA dann bis zu 14400 kBit/s
(viele Telefone erlauben nur bis zu 7200 kBit/s). ISDN erzeugt 64 kBit/s,
DSL dann zwischen 1000 und 16000 kBit/s.

Verbrauch: Ein VoIP- oder Skype-Telefonat mit einem Mobilfunk-Codec
verbraucht zwischen 6 und 40 kBit/s. Ein MP3 abzuspielen verbraucht zwischen
128 und 256 kBit/s. Ein Skype-Videotelefonat verbraucht zwischen 240 und 400
kBit/s.

Nicht zeitkritische Dienste können ihre Nutzung nach belieben verteilen: Ein
Download wird langsamer oder schneller, je nachdem, welche Bandbreite im
Netz verfügbar ist, aber ihm ist es im wesentlichen egal, ob es mal
langsamer wird, da ein Download nicht zerbröselt wie ein Video- oder
Audiocall.

### Asynchron, Synchron, Isochron und warum das alles?

Das bringt uns zu den nächsten Begriffen, nämlich **Asynchronizität** (oder
**Hintergrundtransfer**) und **Synchronizität** bzw. **Isochronizität**
(oder **interaktiver Nutzung**) und **QoS** (**Quality Of Service**). Einem
asynchronen Netznutzer ist es im Wesentlichen egal, welche Bandbreite ihm
zur Verfügung steht, solange er nur sein Volumen irgendwie durch bekommt.

Einem synchronen Netznutzer ist das nicht egal - er möchte gerne eine
gewisse Bandbreiten-Zusicherung haben, also eine Mindest-Datenrate in kBit/s -
eine Video- oder Audio-Anwendung zum Beispiel würde sonst lästig stocken
und hakeln.

Wenn er außerdem ein billiges Endgerät ohne Puffer ist oder sehr interaktiv
operiert (also etwa eine interaktive Spielanwendung ist), dann will er
wahrscheinlich Isochronizität, also eine garantierte Mindest-Datenrate und
außerdem einen gleichmäßigen Abstand zwischen den eintreffenden Datenpaketen -
also keinen Jitter. Und bei den Spielern auch sehr gerne eine definierte,
minimale Laufzeit der Pakete von A nach B und zurück, einen 'guten Ping',
denn es bringt ja nix, wenn man an seinem Rechner den Abzug an einem
virtuellen Gewehr drückt und es dann auf dem Server erst Stunden später
knallt.

### QoS und Deep Packet Inspection

TCP/IP kennt für diesen Zweck tatsächlich eine Dienstedifferenzierung in den
Paketen des IP-Headers, die Quality Of Service Bits, und viele Router werten
diese heutzutage tatsächlich aus. Darum geht es den Netzbetreibern aber eher
nicht, denn das wäre ja eine QoS, die durch den Anwender kontrollierbar
wäre. Die Netzbetreiber wollen stattdessen in die Pakete in Echtzeit
hineingucken, den Inhalt und verwendeten Dienst analysieren und dann ohne
Einwirkung oder Kontrolle des Nutzers klassifizieren, wie sie es für richtig
halten.

Wenn man so etwas macht, also in die Paketdaten selbst hineinsieht und den
Datenstrom analysiert, dann macht man **Deep Packet Inspection** (DPI). Das
ist eigentlich eine Technik aus dem Firewall-Bereich, die dann später auch
für QoS-Anwendungen abgewandelt worden ist. Noch einen Schritt weiter geht
[Phorm](http://en.wikipedia.org/wiki/Phorm), ursprünglich ein Firmenname,
der aber inzwischen mit dem Produkt synonym geworden ist. Dabei verwendet
man DPI, um die Inhalte des Datenverkehrs zu analysieren, Werbebanner zu
selektieren und dann manipuliert man die von einem Server heruntergeladenen
Daten so, daß man seine Werbebanner dort in den Datenstrom hinein fälscht (
[Phorm Schaubild](http://en.wikipedia.org/wiki/File:Phorm_diagram.svg)
(SVG)). Überraschenderweise ist das in vielen Ländern so nicht legal.

Netzneutralität kann durch QoS **horizontal** (quer zu allen Benutzern)
aufgebrochen werden. Verlangt man die Authentisierung von Benutzern (durch
Login, durch den elektronischen Personalausweis oder mit anderen Mitteln)
und bindet man außerdem die Benutzeridentität an die Pakete, dann kann man
Dienste außerdem **vertikal** (entlang Benutzeridentitäten) aufbrechen. Etwa
kann man Jugendschutz implementieren, indem man in jedem Datenpaket
(fälschungssicher) das Altersmerkmal des Benutzers mit transportiert. Oder
man baut dort die völkerrechtliche und gegenwärtige Jurisdiktion ('Der
Benutzer ist ein Deutscher in Dubai') ein, und beschränkt so die
Verfügbarkeit von Video- und Audiomaterial analog zu Regioncodes. Oder man
generiert gleich ein pseudonymes, verkettbares Benutzermerkmal ('Benutzer
fe3d-ccdd-3321-37fe, zum 412. Mal hier') und sammelt die anderen
Informationen dann entlang des Weges ein ('Vermutlich männlich, Umsatz
bisher, an Glücksspielen interessiert, besonders Poker, Anzeigen mit
Fetischeinschlag haben eine 1.4 mal bessere Conversion als solche mit
normalen Frauen, ...').

Der Punkt ist, daß insbesondere vertikale, personenbezogene Aspekte der
Netzneutralität auch Fragen des Jugendschutzes, des Urheber- und
Lizenzrechtes und des Werbegeschäftes berühren, sowie viele andere
Privacy-Probleme nach sich ziehen.

Technisch ist es so, daß Informatiker QoS als ein Problem sehen, daß man nur
hat, wenn man nicht genug Bandbreite bereitstellt - QoS greift nur, wenn es
zu momentanen oder dauerhaften Netzwerkengpässen kommt und man dann bei den
Opfern Triage machen muß.

### Kapazität im Netz, und die letzte Meile

Das sollte, so die Informatiker, nicht auftreten - insbesondere im Festnetz
nicht: Wenn man eine Dark Fiber, eine Glasfaser hat, dann kann man da einen
Laser dran stecken und die Faser ausleuchten. Das erzeugt dann 10 GBit/s (10
000 Mbit/s, 10 000 000 kBit/s), die man da auf Anhieb durchblasen kann. Wenn
das nicht reicht, stellt man einen weiteren Laser mit einer anderen Farbe
daneben und verdoppelt die Bandbreite und so weiter - das kann man relativ
oft machen, je nach Faser und Leitungslänge. Kosten entstehen dabei kaum -
ein solcher Laser ist zwar absolut gesehen teuer, aber im Vergleich zu den
Verlegekosten für das Kabel gratis, und daher ist die Aufrüstung der Leitung
bei Auslastung auch extrem kostengünstig.

Wenn sich also die Informatiker von Google mit den Nachrichtentechnikern von
Verizon unterhalten, dann ist beiden Seiten klar, daß die
Betriebswirtschaftler von Verizon zwar gerne Dienste differenzieren möchten,
es aber im Festnetz auch bei großer Anstrengung keinen denkbaren Grund dafür
geben kann. Darum sichert also Verizon im Festnetz unbedingte
Netzwerkneutralität zu.

### Mobilnetze als Hebel gegen die Netzneutralität

In mobilen Netzen ist es sehr schwer Vorhersagen zu machen, weil die
Bedingungen sehr unterschiedlich sind. Sie hängen nicht nur von der Position
der Leute und der Basisstationen ab, sondern auch davon, wie viele Leute pro
Zelle was machen wollen. Daher kann es - egal wie sehr man die Kapazitäten
ausbaut - bei Zusammenballungen von Leuten immer zu Bandbreitenknappheit
kommen. Zum Beispiel bricht unweigerlich auf jedem Chaos Communication
Congress wie auf den meisten anderen großen Konferenzen das WLAN zusammen -
das liegt nicht daran, daß die Leute vom Chaos weniger Ahnung von Netzwerken
haben als Ihr mit Eurem WLAN daheim, oder daß die vielen bösen Hacker das
Netz immer crashen lassen.

Sondern es liegt einfach daran, daß WLAN bei mehr als x Personen pro Zelle
schlicht nicht mehr geht und man sich dann dringend ankabeln will. Oder, als
Netzbetreiber, die Zellen kleiner machen und mehr Channels bereitstellen,
also mehr APs mit weniger Leistung aufstellen und so die Anzahl der Personen
pro AP reduzieren. Aber auch das geht nur bis zu einem gewissen Punkt,
danach ist einfach Ende. Auch bei Mobilfunknetzen ist es so, und es ist
tatsächlich so, daß etwa die Telekom an der Kieler Spiellinie zur Kieler
Woche zusätzliche Container aufstellt, in denen
[GSM Mikrozellen](http://www.senderlisteffm.de/bilder03.html) gefahren
werden, um mit der Handies tragenden Besuchermenge am Wasser fertig zu
werden - bei x Kilometern mit ca. 3-4 Personen pro Quadratmetern ist das
eine gute Idee, schon um Notruf-Fähigkeit für das Netz zu erhalten.

Weil bei mobilen Netzen immer mal Triage notwendig sein kann, haben die
Google-Technikern den Verizon-Technikern hier weniger entgegen zu setzen,
und so kommt es, daß sich Verizon in dem Vertrag zwischen den beiden Firmen
für mobile Netze diese Hintertür schon aus technischen Gründen offen halten
müssen. Jetzt kommt es darauf an, sicherzustellen, daß die
Betriebswirtschaftler da nicht noch andere Dinge mit durch diese Lücke
schmuggeln, also anfangen Dienste mit DPI horizontal oder vertikal zu
differenzieren.

### Artikel zum Thema Verizon/Google:

- [Bloomberg](http://www.bloomberg.com/news/2010-08-04/google-verizon-are-said-to-have-reached-deal-on-how-to-handle-web-traffic.html): Google, Verizon Said to Strike Deal on Web Traffic Rules
- [Heise Newsticker](http://www.heise.de/newsticker/meldung/Netzneutralitaet-Vorfahrt-fuer-Google-Dienste-gegen-Bezahlung-1051319.html): Netzneutralität: Vorfahrt für Google-Dienste gegen Bezahlung?
- [Cnet News](http://news.cnet.com/8301-13860_3-20012723-56.html?tag=mncol;txt): Google's Schmidt on Verizon and Net neutrality

- [Google stellt klar](http://faz-community.faz.net/blogs/netzkonom/archive/2010/08/05/google-statement-zur-nyt-und-netzneutralitaet-the-new-york-times-is-quite-simply-wrong.aspx): 1. Wir bezahlen nichts für eine Vereinbarung mit Verizon. 2. Wir stehen weiter zu unseren Aussagen zu einem offenen Internet.
- [Originaldementi](http://twitter.com/googlepubpolicy/statuses/20393606477) auf Twitter.

Die letzten beiden Artikel stellen noch einmal ausdrücklich klar, daß
Verizon gegenüber Google für das Verizon Nicht-Mobilnetz noch einmal
ausdrücklich die Netzwerkneutralität bestätigt - Google zahlt also nichts,
und Verizon verpflichtet sich ausdrücklich, niemanden, auch nicht Google, in
ihrem Netz zu bevorzugen oder zu behindern. Das ganze soll ein allgemeines
Policy-Framework sein, zu dessen Einhaltung sich Netzbetreiber und
Dienstanbieter verpflichten sollen:

>  Verizon has also moved to dismiss the story. A company statement reads:
> "The NYT article regarding conversations between Google and Verizon is
> mistaken. It fundamentally misunderstands our purpose. As we said in our
> earlier FCC filing, our goal is an internet policy framework that ensures
> openness and accountability, and incorporates specific FCC authority,
> while maintaining investment and innovation. To suggest this is a business
> arrangement between our companies is entirely incorrect."  -- [The
> Guardian
> Artikel](http://www.guardian.co.uk/technology/2010/aug/05/gogle-denies-verizon-deal-net-neutrality)


Weiter in  [Teil 2]({% link _posts/2010-08-06-netzwerk-berlast-vs-netzwerkneutralit-t.md %}).
