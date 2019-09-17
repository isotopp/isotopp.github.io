---
layout: post
published: true
title: Wie man aus Versehen WLAN-Daten mitschneidet
author-id: isotopp
date: 2010-05-16 15:16:00 UTC
tags:
- google
- privacy
- security
- wlan
- lang_de
feature-img: assets/img/background/rijksmuseum.jpg
---
### Spiegel Online Service:

- Technische Erklärung dessen, was passiert ist: Dieser Artikel.
- Wozu macht Google das eigentlich? 
  [WLANs mappen]({% link _posts/2010-05-17-wlans-mappen.md %})-Artikel.
- Wer ist dieser Kristian Köhntopp eigentlich? 
  [XING-Profil](https://www.xing.com/profile/Kristian_Koehntopp)
- [TL;DR](http://en.wiktionary.org/wiki/tl;dr): 
  - Google sammelt wie Skyhook und andere Unternehmen die Hardware-Adressen
    und Netzwerknamen von WLANs, weil diese in dicht besiedelten Gebieten
    eine sehr schnelle und recht gute Näherung für eine Positionsbestimmung
    sind (GPS: 80 Sekunden, WLAN-Fingerprint der Position: <2 Sekunden,
    Details im Artikel [WLANs mappen]({% link
    _posts/2010-05-17-wlans-mappen.md %})).
  - Dazu hat Google alle unverschlüsselten Pakete aufgezeichnet, die deren
    WLAN-Antenne gesehen hat: 32 Kanäle, je Kanal 1/5 Sekunde, immer im
    Kreis, genau wie jeder Laptop, der ein passendes WLAN sucht. Normal sind
    nur Beacon-Signale ("Ich bin das WLAN mit dem Namen ...")
    unverschlüsselt, und das sind auch die Daten, für die sich Google
    interessiert.
  - Aber es gibt auch in 2010 noch Leute, die Klartext-Daten über
    unverschlüsselte WLAN-Verbindungen rausblasen. Das ist sehr leichtsinnig
    und komplett unsicher. Google hat durch einen Programmierfehler
    unzusammenhängende 1/5 Sekunden-Fragmente von solchen ungeschützter
    Kommunikation aus diesen Netzen aufgefangen als das Auto vorbeigefahren
    ist. Das ist kein gezielter Lauschangriff, sondern eine Panne. 
  - Es ist Google hoch anzurechnen, daß sie den Fall ehrlicherweise
    öffentlich gemacht haben, anstatt unter den Teppich zu kehren, wie es
    sonst [allgemein üblich]({% link
    _posts/2010-05-18-incident-management-und-transparenz.md %}) ist.

### Originalartikel

Vor zwei Tagen schreibt Google im Firmenblog: 
[WiFi data collection: An update](http://googleblog.blogspot.com/2010/05/wifi-data-collection-update.html): 
> In that blog post, and in a technical note sent to data protection
> authorities the same day, we said that while Google did collect publicly
> broadcast SSID information (the WiFi network name) and MAC addresses (the
> unique number given to a device like a WiFi router) using Street View
> cars, we did not collect payload data (information sent over the network).
> But it’s now clear that we have been mistakenly collecting samples of
> payload data from open (i.e. non-password-protected) WiFi networks, even
> though we never used that data in any Google products.

und weiter 

> So how did this happen? Quite simply, it was a mistake. In 2006 an
> engineer working on an experimental WiFi project wrote a piece of code
> that sampled all categories of publicly broadcast WiFi data. A year later,
> when our mobile team started a project to collect basic WiFi network data
> like SSID information and MAC addresses using Google’s Street View cars,
> they included that code in their software—although the project leaders did
> not want, and had no intention of using, payload data.

Politik und Datenschützer sind in Aufregung: 

- Spiegel:  [Googles Datenpanne: Fehler im perfekten System](http://www.spiegel.de/netzwelt/netzpolitik/0,1518,694958,00.html)
- Heise:  [Politik fordert von Google Aufklärung über WLAN-Datensammlung](http://www.heise.de/newsticker/meldung/Politik-fordert-von-Google-Aufklaerung-ueber-WLAN-Datensammlung-Update-1000800.html)
- Süddeutsche:  [Google: Datenpanne bei Street View: ''Unabsichtlich'' ausgespäht](http://www.sueddeutsche.de/computer/83/511193/text/)
- FAZ:  [Googles Street View Datenpanne: Schlamperei oder Vorsatz?](http://www.faz.net/s/Rub7FC5BF30C45B402F96E964EF8CE790E1/Doc~E357C4E3B946C426E927F02C8925B7750~ATpl~Ecommon~Scontent.html)
- Blogoscoped:  [Google Say They Were Collecting More Wifi Data Than They Meant To](http://blogoscoped.com/archive/2010-05-15-n73.html)
- BBC: [Google admits wi-fi data collection blunder](http://news.bbc.co.uk/2/hi/technology/8684110.stm)
- The Register: [Google Street View snooped WiFi for personal data: Network payloads collected 'by mistake'](http://www.theregister.co.uk/2010/05/14/google_street_view_cars_were_collecting_payload_data_from_wifi_networks/)
- Slashdot: [Google Says It Mistakenly Collected Wi-Fi Data While Mapping](http://yro.slashdot.org/story/10/05/14/2259204/Google-Says-It-Mistakenly-Collected-Wi-Fi-Data-While-Mapping)

Schauen wir also mal in die Technik und versuchen wir die Fragen, die sich
aus dieser Aktion ergeben zu beantworten.

Der Standard zum Thema WLAN stammt von der IEEE und ist erstaunlicherweise
frei runterladbar. Er befindet sich
[hier](http://standards.ieee.org/getieee802/download/802.11-2007.pdf) (PDF),
wo man einen PDF Download des Dokumentes bekommen kann. Der Standard ist
lang und wem das zu lang ist, der findet
[in der Wikipedia](http://en.wikipedia.org/wiki/802.11#Frames) und bei 
[bei Wifi-Planet](http://www.wi-fiplanet.com/tutorials/article.php/1447501) eine Übersicht.

Ich schrieb in 
[Internet mit Kugelschreibern (und Bussen)]({% link _posts/2009-06-24-internet-mit-kugelschreibern-und-bussen.md %})
ja schon einmal:

> Mein Rechner hat also keine Internet-Karte. Aber er kann jede seiner
> Netzwerkschnittstellen als Internet-Transport verwenden. Das eigentliche
> 'Internet' in meinem Rechner ist dann ein Stück Software, das neben
> einigen anderen Dingen Pakete einkapselt und auskapselt.

Internet-Pakete werden im Netz also nirgendwo direkt verschickt, sondern je
nach Medium in anderen, für das Medium spezifischen Frames eingekapselt. Auf
einem Ethernet sind es Ethernet-Frames, auf einem WLAN-Netz sind es die IEEE
802.11 Payload Frames.

Nun ist ein WLAN besonders, es unterscheidet sich von einem Kabelnetzwerk in
dem Sinne, daß viele der Annahmen nicht gelten, die man in Kabelnetzen
machen darf. Im Standard selbst findet man:

> The PHYs used in IEEE Std 802.11 are fundamentally different from wired
> media. Thus IEEE 802.11 PHYs
>
> 1. Use a medium that has neither absolute
> nor readily observable boundaries outside of which STAs with conformant
> PHY transceivers are known to be unable to receive network
> frames
> 2. Are unprotected from other signals that may be sharing the
> medium
> 3. Communicate over a medium significantly less reliable than
> wired PHYs
> 4. Have dynamic topologies
> 5. Lack full connectivity, and therefore the assumption normally
>  made that every STA can hear every other STA is invalid 
> (i.e., STAs may be “hidden” from each other)
> 6. Have time-varying and asymmetric propagation properties
> 7. May experience interference from logically disjoint
> IEEE 802.11 networks operating in overlapping areas

Was der Standard uns damit sagen will:

Die Teilnehmer (Physical Layer Interfaces, PHYs) in einem WLAN arbeiten in
einem Medium, das nicht wie ein Kabel absolut oder erkennbar begrenzt ist,
sodaß entscheidbar wäre ob eine Station mit dem Medium verbunden ist oder
nicht.

Ebenso kann das Medium durch andere Dinge, die nichts mit Netzteilnehmern zu
tun haben, gestört werden oder es kann sich mit anderen Netzen nach
demselben Standard überlappen, und ist daher schon konstruktionsbedingt
weniger zuverlässig als ein kabelgebundenes Netz ist. Die Netzwerktopologie
ist dynamisch in dem Sinne, daß der Standard explizit transportable
(abgeschaltet bewegte) und mobile (angeschaltet bewegte) Stationen
unterstützen muß und daß Netzteilnehmer nach Belieben im
Sichtbarkeitsbereich einer Antenne erscheinen und verschwinden können -
durch Bewegung, Störungen, Änderung der Ausbreitungsbedingungen oder durch
An- und Abschalten.

Daher gibt es in einem WLAN neben den Payload Frames, die die Nutzdaten der
User enthalten noch eine ganze Menge weiterer Frametypen, die mit der
Netzwerk-Administration im weitesten Sinne zu tun haben. Der Artikel bei
[Wifi Planet](http://www.wi-fiplanet.com/tutorials/article.php/1447501)
gliedert sie schön auf in Frames, die mit der Netzwerkverwaltung zu tun
haben - Anmelden, Abmelden, Bekanntmachen (Beacons) und Eigenschaften
abfragen (Probes), Datenflußkontrolle (ganz klassisch: RTS, CTS und ACK) und
die Payload selbst halt.

Wenn man eine Softwarekomponente schreiben will, die dem Erfassen und
Decodieren von WLAN-Daten im Allgemeinen gelten soll, dann wird man also
erst einmal alle Datenpakete von der Antenne ab mitschneiden und sie
hinterher sortieren in die Pakete, die einen interessieren und die, die
nicht weiter spannend sind. Das ist das, was diese Bibliothek macht, die
oben in dem Google-Statement erwähnt wird: Sie schaltet eine Wifi-Antenne
und -Karte in den Monitor-Modus und schreibt einfach alle Pakete mit, die
sie zu sehen bekommt.

Mit diesen Daten kann man eine ganze Reihe nutzbringender Dinge tun - neben
der Kartierung von Funknetzwerken auf der Basis von MAC-Adressen und
Beacon-Paketen halt auch Netzwerke debuggen, das Verhalten von Clients und
Basisstationen im Netz beobachten oder amoklaufende Clients identifizieren -
was man halt tut, wenn man im Netz
[unterhalb der Ebenen 3 und 4](http://de.wikipedia.org/wiki/OSI-Modell#Die_sieben_Schichten)
(Netzwerkschicht/IP und Transportschicht/TCP) im Gerätetreiber-Keller
rumkriechen muß.

Das ist auch das, was ein Haufen anderer Pakete tun. Auf meinem Rechner
finde ich beim Durchblättern von Macports
[Wireshark](http://freshmeat.net/projects/wireshark) (Ethereal), 
[Aircrack](http://freshmeat.net/projects/aircrack-ng), 
[Kismet](http://freshmeat.net/projects/kismet) und diverse andere Stumbler, 
die alle genau das tun, was auch diese Google Bibliothek tut - plus
zusätzlich Funktionalität zum Angreifen und Knacken dieser Netzwerke (etwa
bei Aircrack), die die Google Bibliothek genau nicht hat.

Wenn man dann denkt wie ein Haufen Physiker... 

> Wenn man nun einmal ein paar Schritte zurücktritt und das Gesamtbild auf
> sich wirken läßt, dann erkennt man Muster: Alles in allem wirkt der Ansatz
> von Google auf mich wie eine Firma von Physikern oder anderen
> Experimental-Forschern mit akademischem Background, die beschlossen haben,
> einmal 'so richtig' in die Wirtschaft zu gehen und ihre Methoden dort hin
> zu portieren.

schrieb ich in 
[Das Google-Mißverständnis]({% link _posts/2009-11-07-das-google-mi-verst-ndnis.md %}).

Zu dem Ansatz, den typische Physiker (stellvertretend für alle
Naturwissenschaftler) typischerweise wählen gehört auch das Aufbewahren von
Meßdaten in Rohform - hier also der betreffenden aufgefangenen Wifi-Pakete.
Das braucht man, um frühere Ergebnisse nachvollziehen zu können oder
fehlerhafte Berechnungen neu ablaufen zu lassen, aber auch, um historische
Daten mit neueren Daten zu vergleichen und so ggf. Schlüsse über die
Zeitachse ziehen zu können.

Genau genommen muß das sogar technisch zwangsläufig so sein, denn ein Google
Streetview Car ist, wenn man darüber nachdenkt, ein rollender Haufen
Festplatten mit einem Satz Kameras, einem sehr guten GPS und eben einem
Stapel von Wifi und wahrscheinlich auch GSM-Antennen. Denn neben
Wifi-Kennungen zur Triangulation würde ich, wenn ich so etwas baute, auch
die Kennungen von GSM-Basisstationen loggen wollen. Das Streetview-Car dockt
dann irgendwann ans Google-Mutterschiff an und injeziert seine
Datenerfassungen ins Firmen-Netzwerk, wo dann mit der Auswertung begonnen
wird.

Insofern ist die Erklärung für den Ablauf der Dinge, die Google uns gibt,
schlüssig und plausibel.

Gehen wir doch mal in den 
[Spiegel-Artikel](http://www.spiegel.de/netzwelt/netzpolitik/0,1518,694958,00.html) und 
schauen uns die dort gestellten Fragen an. Was können wir beantworten?

### Warum entwickeln Google-Programmierer Schnüffel-Software?

Weil Google WLANs auf einer Karte verzeichnen will 
([Wozu ist das gut?]({% link _posts/2010-05-17-wlans-mappen.md %}))

Entwickelt worden ist eine Bibliothek zum Erfassung von 802.11 Frames. Erst
nachdem man einen Frame erfaßt hat, kann man auf die Felder Frame-Type und
Frame-Subtype schauen und entscheiden, ob es etwa ein Beacon-Frame ist, in
dem die ESSID eines Netzwerkes angekündigt wird, oder ein Payload-Frame.
Bibliotheken, die WLAN-Interfaces in den Monitor-Modus schalten und dann
alle Frametypen mitschneiden sind nicht selten - sie sind die Grundlage
jedes Netzwerkmanagementsystems und in mannigfacher Zahl und Mißgestalt Teil
jeder Macports- oder Linux-Distribution.

### Wie kommt Schnüffelcode in das umstrittene Street-View-Projekt?

Wenn man ESSIDs kartieren möchte, dann muß man genau das tun: Eine Karte in
den Monitor-Modus schalten und aufgefangene Beacon-Frames und MAC-Adressen
von Karten zusammen GPS-Koordinaten und Zeitstempeln loggen. Streetview-Cars
sind rollende Datenerfassungsmaschinen, die werten nicht aus, sondern
schneiden nur mit. Das Sortieren hätte später beim Upload ins Google
Corporate Netzwerk passieren müssen oder - besser -  man hätte den
Streetview-Maschinen von Anfang an diese minimale Sortierfunktionalität
(Payload Frames nicht aufzeichnen) mitgeben müssen.

### Wurde die Software nicht getestet?

Normal geht Google sogar noch weiter - einerseits wird Software getestet,
andererseits wird eine ganze Menge Zeit darauf verwendet, Code von Kollegen
durchzusehen und zu reviewen. Insbesondere bei sicherheitskritischen
Codestücken wird dies standardmäßig getan. Das ist aber code-zentriertes
Arbeiten - datenzentriert scheinen solche Mechanismen nicht zu existieren.

### Warum merkt Google drei Jahre lang nicht, was da passiert?

Weil der Prozeß weitgehend automatisiert ist und niemand die Rohdaten
angesehen hat, sondern alle Menschen mit den Daten beschäftigt waren, die
aus der Verarbeitungs-Pipeline herausfallen, nachdem die Daten aus den
Streetview-Cards aufbereitet worden sind. Erst die Nachfrage des Hamburger
Datenschutzbeauftragten hat bewirkt, daß sich jemand einmal die gesamte
Pipeline von vorne bis hinten angesehen hat und katalogisiert hat, was für
Daten da eigentlich anfallen.

## Das Fazit:

Die Software, die da zur Erfassung der WLAN-Daten geschrieben und betrieben
worden ist folgt der Struktur, die die Technik und der WLAN-Standard der
IEEE vorgeben. Das Vorgehen, das Google bei der Erfassung der Daten zeigt,
ist logisch, vernünftig und in Deutschland illegal 
([§89 TKG](http://dejure.org/gesetze/TKG/89.html) und 
[§202b StGB](http://dejure.org/gesetze/StGB/202b.html), wahrscheinlich).

Die Erklärungen, die Google für das Entstehen des Fehlers gegeben hat, sind
in im Kontext der Standards und im Vergleich mit anderer Software, die
ähnliches leistet, konsistent und schlüssig. Der Fehler, der zu dem Problem
geführt hat, ist naheliegend.

Zudem hat Google das Problem umgehend zugegeben und öffentlich gemacht
nachdem es entdeckt worden ist und geeignete Maßnahmen zur Eindämmung des
Problems getroffen: Die Daten wurden im Corporate Network zusammengezogen,
physisch isoliert und weitere Datenerfassung eingestellt. In Rücksprache mit
den Behörden wird nun entschieden, ob die Daten gesäubert werden dürfen oder
als Beweismaterial zurückbehalten werden müssen.

Die Sicherungsmechanismen, die Google für die Qualitätskontrolle und für die
rechtliche Zulässigkeit der Datenerfassung einsetzt, sind unzureichend und
der bestehende Reviewprozeß muß auf diesem Gebiet verbessert werden.

Alles in allem finde ich das recht gut nachvollziehbar und geradezu
vorbildlich gehandhabt, und verstehe die Hysterie und das Fingerzeigen in
der Berichterstattung nicht.

Oh, und falls einer von Euch noch ein ungesichertes WLAN am Laufen hat ohne
AP-Betreiber zu sein - oder über ein beliebiges öffentliches Netz noch
unverschlüsselt kommuniziert: Bitte ändert das. Wir haben 2010 und nach dem
BGH-Urteil ist das sowieso... leichtsinnig.
