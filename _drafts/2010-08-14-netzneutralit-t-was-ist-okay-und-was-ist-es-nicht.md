---
layout: post
published: true
title: Netzneutralität - was ist okay und was ist es nicht?
author-id: isotopp
date: 2010-08-14 11:37:00 UTC
tags:
- internet
- netzneutralität
- politik
- lang_de
feature-img: assets/img/background/rijksmuseum.jpg
---
(Teil 3, siehe auch <a href='http://blog.koehntopp.de/archives/2917-Vokabeln-fuer-Netzneutralitaet.html'>Teil1</a> und <a href='http://blog.koehntopp.de/archives/2919-Netzwerk-UEberlast-vs.-Netzwerkneutralitaet.html'>Teil 2</a>, <a href='http://blog.koehntopp.de/archives/2931-Netzneutralitaet-ist-der-Schluessel-zur-Wahrung-des-freien-Internets!.html'>Petition hier</a>)

Mein DSL hat 16 MBit im Downstream. Das heißt, ich bekomme 16 000 000 Bit/s geliefert, also etwas unter 2 Megabyte pro Sekunde. Ein Tag hat 86400 Sekunden und würde ich meinen Download rund um die Uhr am Anschlag laufen lassen, wären das etwa 160 GB am Tag. Mit 30 Tagen im Monat also etwa 4.5 Terabyte im Monat als theoretisches Trafficmaximum.

Würde ich das tatsächlich machen, würde mein Provider wahrscheinlich ein ernstes Gespräch mit mir führen, Flatrate oder nicht.

Meistens stehen ausdrückliche Verkehrslimits in den Verträgen im Kleingedruckten ("nicht mehr als 1 TB pro Monat") - insbesondere bei Handy-"Flatrates" - oder sie werden als weiche Klauseln formuliert ("behält sich vor, den Vertrag zu kündigen, wenn mißbräuchliche Verkehrsmengen erzeugt werden"). Erstere Formulierung ist aus Kundensicht weitaus besser als zweitere, denn Verträge macht man ja nicht für die Zeit, wenn man sich lieb hat, sondern für den Fall, daß man einmal Streit hat.

Wenn Provider Verträge untereinander machen, dann stehen da in der Regel untereinander nicht Volumina in den Verträgen ("5 TB pro Monat"), sondern durchschnittliche und Spitzenbandbreiten ("nicht mehr als durchschnittlich 16 MBit/s im Monatsmittel und nicht mehr als 100 MBit/s Spitzenlast"). Diese Werte kann man dann mehr oder weniger direkt in einen Trafficshaper fallen lassen und die Limits umsetzen. Meist steht in so einem Vertrag - wenn die Techniker ihre Anwälte korrekt eingenordet haben - im Rahmen eines Service Level Agreements auch was zu anderen Parametern der Leitung - Verfügbarkeit, Paketverlustraten und Latenzen (Pingzeiten) zum Beispiel.

Der Punkt dabei ist, daß man im Rahmen einer solchen Spezifikation Trafficmanagement betreiben kann.
<br />


Das heißt, der Bandbreite liefernde Provider - der Anbieter - kann die vertraglich zugesicherten Eigenschaften durch Trafficshaping erzwingen. Und der die Bandbreite nutzende Provider - der Kunde - kann die ihm bereitgestellte Bandbreite durch eigene Maßnahmen aufteilen und regeln. Das ist das, was man erwartet und rechtlich wie netz-ideologisch vollkommen legitim.

Es wäre absurd, würde der die Bandbreite stellende Provider diese Regelung vornehmen ('Zu IP-Nummern im Netz von Google nicht mehr als 1 MBit/s im Monatsmittel und nicht mehr als 1 MBit/s Spitzenlast'). Es kommt also darauf an, bei wem die <em>Kontrolle</em> über die Bildung von Verkehrsklassen liegt, über die in dieser Diskussion andernorts immer wieder geredet wird. Es kommt nicht darauf an, welcher Provider dabei <em>mitwirkt</em>, solange die <em>Kontrolle</em> an der richtigen Stelle - beim Kunden - liegt.

<b>Das ist Netzneutralität erster Ordnung - direkte Netzneutralität.</b>

Wenn der Kunde diese Kontrolle nicht hat oder aus technischen Gründen nicht haben kann (mir fällt grad kein Szenario ein, bei dem das zwingend so wäre), dann kann man Traffic nach fixen Prioritäten mit variablen Grenzen priorisieren. Der Kunde stellt sich eine Hierarchie von Traffic auf: Bei den meisten Kunden ist die recht ähnlich und sieht wahrscheinlich wie unten gezeigt aus (Vielleicht Position 1 und 2 getauscht). <ul><li>Latenz-sensitive Anwendungen: Spiele und interaktive Unterhaltung</li><li>Interaktives Streaming: Telefonie und Videofonie</li><li>Unidirektionale Streams: Webradio, Videostreams</li><li>interaktive Anwendungen ohne kritische Latenz: Chat, Webtraffic</li><li>Unidirektionaler Verkehr ohne Latenz: Downloads</li><li>Bidirektionaler Bulk-Traffic: P2P, Swarm Load</li></ul> Wichtig ist, daß den einzelnen Klassen keine festen Bandbreiten zugeordnet werden, sondern daß der Kunde seine gesamte gekaufte Bandbreite voll nutzen kann, wobei Verkehr aus einer höheren Klasse Verkehr aus einer niederen Klasse verdrängt (oder bis auf eine garantierte Minimum-Bandbreite zusammendrückt). Würde man feste Grenzen zuordnen, sind Szenarien denkbar, bei denen der Kunde seine gekaufte Bandbreite nicht voll nutzen kann, weil er nicht den Traffic von der richtigen Art hat ("Ja, sie haben noch 15 MBit/s frei, aber die sind nur für Telefonie und nicht für P2P nutzbar").

Wichtig ist aus wettbewerbsgründen auch, daß nach Diensten unterschieden wird (durch QoS-Merkmale an den Paketen, aber dann kontrolliert es ja wieder der Kunde, oder Port-Nummern), aber nicht nach Dienstanbietern (nach IP-Nummern oder den AS-Nummern, die den IPs zugeordnet werden können), sodaß die Klasseneinteilung Anbieter-agnostisch ist.

<b>Das ist Netzwerkneutralität zweiter Ordnung, indirekte Netzwerkneutralität.</b>

Keine Netzwerkneutralität liegt vor, wenn der Anbieter beim Kunden dafür kassiert, daß bestimmte Dienste von Dritten besser (oder überhaupt) funktionieren, der Anbieter also den Dritten als Geisel nimmt, um gegenüber dem Kunden die Dienstleistung von Dritten zu monetarisieren. Das ist ein klarer Verstoß gegen Netzwerkneutralität - und wahrscheinlich auch ein Verstoß gegen EU-Wettbewerbsrichtlinien.

Das bringt uns dann zu den Scheinheiligkeiten in dieser Diskussion.

"Die Verkehrsmenge steigt und wir müssen sie managen" ist ein technisches Argument und kann Anbieter- und Kunden-agnostisch gelöst werden - Netzwerkneutralität zweiter oder erster Ordnung können problemlos gewährleistet werden. Ein erster Schritt dazu wäre es, das unsinnige Wort "Flatrate" auszumerzen und den Kunden (Endkunden!) die Begriffe Volumen, Bandbreite und Latenz beizubringen und sie zu lehren, was für Anforderungen sie denn so im Rahmen dieser Begriffe im Schnitt an ihren Netzwerkanschluß haben.

Die meisten Kunden wissen es nicht und es ist die Unsicherheit, die aus dieser Unwissenheit folgt, die sie eine "Flatrate" kaufen läßt (die gar keine ist). Kunden, die wissen, was sie brauchen, können mit ihrem Diensteanbieter dan auch sinnvoll argumentieren und vor allen Dingen echte Angebote mit echten technischen Daten vergleichen. Das ist genau die Situation, die die Diensteanbieter vermeiden wollen.

"Die Verkehrsmenge steigt und wir müssen sie managen" ist genau nicht das, was die Anbieter wollen, die gerade die Diskussion um die Aufhebung des Status Quo vom Zaun brechen. Was sie eigentlich wollen ist "Wir wollen nicht länger inhaltsagnostisch Pakete als Schüttgut durch die Gegend schippern, weil da die Margen doof sind. Sondern wir wollen den subjektiven Wert eines jeden Datenpaketes für Absender und Empfänger ermitteln und differenziert monetarisieren."

Oder, in klareren Worten: "Deine Skype-Pakete sind Dir mehr wert als Deine P2P-Pakete. Wäre doch schade, wenn denen was passiert, oder?".

Das kann Telekom-Verizon-Telefonica-Vodafone-wasauchimmer natürlich nicht so formulieren, darum das Getue um Bandbreiten-Engpässe und die allgemeine Angstrethorik (cf. <a href='http://carta.info/32218/google-verizon-und-das-netz-der-zukunft/'>Matthias Schwenk bei Carta.Info</a> und die eigenartige Reaktion <a href='http://petertauber.wordpress.com/2010/08/11/netzneutralitat-ja-aber-differenziert/'>bei der Enquete</a>).

Netzneutralität erster und zweiter Ordnung dient dazu, egal wie man sie formuliert, diese Erpressungsversuche der Provider (bei der Enqueue verwendet man stattdessen das Wort Differenzierung) im Kern zu verhindern. Das ist ordnungspolitisch notwendig, weil man sonst Providern jede Motivation nimmt, Bandbreite auszubauen - im Gegenteil, die Geschäftsgrundlage für das Erpressungsgeschäft bricht zusammen, sobald das Netz ausreichend Kapazität hat.

Und es ist systematisch notwendig, weil man sich sonst auch wettbewerbsrechtlich ins Bein schießt.

Und eigentlich sollten sich auch die Provider überlegen, was genau sie da tun und wollen. Denn wenn sie "Traffic managen", indem sie in die Pakete hineinsehen - mit <a href='http://de.wikipedia.org/wiki/Deep_Packet_Inspection'>Deep Packet Inspection</a> - dann können sie sich nicht mehr auf ihren "Ich transportiere die Ware nur, ich weiß nicht was drin ist"-Status zurückziehen und müssen sich sehr bald Forderungen stellen, die für AlQuadiaTerroristenRaubkopierKinderschänderDatenPakete  eine gemanagete Bandbreite von 0 fordert - da tut sich dann sehr bald für Providers wie auch für Kundens eine ganze Menge Spaß auf.

Weitere lesenswerte Artikel zum Thema: <ul><li><a href='http://yuccatree.de/2010/08/google-jetzt-offiziell-evil-initiative-pro-netzneutralitat-gegrundet/'>Enno Park:</a> Google jetzt offiziell “evil” – Initiative “Pro Netzneutralität” gegründet. Enno hat einige interessante Vergleiche da drin.</li><li><a href='http://techliberation.com/2010/08/10/deconstructing-the-google-verizon-framework/'>Technology Liberation Front:</a> Deconstructing the Google-Verizon Framework. Die Dekonstruktion besteht in einem Vergleich des Google/Verizon-Vorschlags mit dem aktuellen Stand einer möglichen FCC-Regulierung. Die Unterschiede sind weitaus kleiner als vermutet, aber interessant.</li><li><a href='http://www.wired.com/epicenter/2010/08/why-google-became-a-carrier-humping-net-neutrality-surrender-monkey/all/1'>Wired.com:</a> Why Google Became A Carrier-Humping, Net Neutrality Surrender Monkey. TL;DR ist im wesentlichen: Googles Geschäft muß sich diversifizieren, und Android und Youtube sind Ecksteine in diesem Plan. Google braucht die Carrier als Verbündete, damit dieser Plan aufgeht.</li><li><a href='http://www.heise.de/ct/artikel/Nie-mehr-ohne-888264.html'>c't (Heise):</a> Umfrage zu Schmalbandanschlüssen (Teil von <a href='http://www.heise.de/ct/artikel/Internet-der-Zukunft-981219.html'>Internet der Zukunft</a>. "Einige Ergebnisse [der Umfrage] entsprachen den Erwartungen, andere hingegen boten Überraschungen. Etwa dass fast neunzig Prozent der Teilnehmer eher aufs Fernsehen verzichten würden als auf einen Breitbandanschluss. "</li></ul>
