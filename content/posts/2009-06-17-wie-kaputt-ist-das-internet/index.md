---
author: isotopp
date: "2009-06-17T08:35:07Z"
feature-img: assets/img/background/rijksmuseum.jpg
tags:
  - internet
  - lang_de
title: Wie 'kaputt' ist das Internet?
aliases:
  - /2009/06/17/wie-kaputt-ist-das-internet.html
---
Jemand fragt mich per Mail: 

> Was ich wissen möchte: Wie viel Geräte "im Internet", also bei Providern (nicht bei einem speziellen, sondern bei allen) und im Backbone, sind typischerweise zu einem Zeitpunkt "kaputt" (falsch konfiguriert, abgeraucht, in Wartung, nicht verfügbar)?
> 
> Die Frage kam neulich auf, als wir über IP fachsimpelten (Ja, fast Stammtischniveau), und uns fragten, wie nötig die lokale Wegfindung ist, die IP macht, und wie viel Arbeit sich TCP auf der Empfängerseite mit der Sortierung der Pakete machen muss.
>
> Es ist klar, daß es da keine harten Zahlen gibt. 
> Aber Deine Schätzung ist besser als meine, soviel wissen wir schon.
> Deshalb die freundliche Bitte: "Her damit!" :)

Das ist auf vielen Ebenen eine interessante und komplizierte Frage. Man kann sie nicht mit einer einfachen Prozentzahl beantworten und erwarten, daß man sinnvolle Ergebnisse bekommt.

**Update:** 
[Trackback vom 27.06](http://trackback.fritz.de/podpress_trac/web/1074/0/trb_090627.mp3), 
[der Ausschnitt betreffend diesen Eintrag](isofritz.ogg).

Einmal geht es um Geräteausfall - aber Geräte fallen nicht einzeln aus, insbesondere Router nicht.
Denn hinter Routern hängen andere Geräte und ein Ausfall eines Routers bedingt auch den Ausfall aller Komponenten 'hinter' dem Router, falls kein redundanter Pfad besteht. 
Auch stehen Router nicht alleine auf weiter Flur, sondern in Rechenzentren in Racks, abhängig von Klimaanlagen, Stromzuleitungen und anderen Komponenten.
Viele dieser Komponenten sind redundant, aber abhängig vom Fehlerszenario kann diese Redundanz unter Umständen nicht wirksam werden - es sind schon ganze Rechenzentren mit redundanter Klimatisierung abgeschaltet worden, weil die (notwendig nicht redundante) Steuerung der Klimaanlage fehlerhaft programmiert war.

Wenn man also Ausfallwahrscheinlichkeiten und ihre Auswirkungen hier diskutieren will, dann landet man sehr schnell bei Ausfallbäumen und recht komplizierten mathematischen Modellen mit bedingten Wahrscheinlichkeiten. 
Unter der Annahme, daß man die Eingangswahrscheinlichkeiten in dem Modell hinreichend genau zur Verfügung hat und daß diese eine signifikante Rolle spielen - so habe ich in einem Oberseminar zum Thema HA während des Studiums mal ein Paper von Sequent gesehen, bei dem Ausfallursachen tatsächlicher Ausfälle von hochverfügbaren Systemen ausgewertet wurden und die dominierende Ursache war 'menschliches Versagen und Fehlbedienung des Clusters' (auf dem zweiten Platz war 'Totalverlust des Rechenzentrums').

Der andere Teil der Frage zielt auf den Mechanismus der lokalen Wegfindung bei TCP/IP.
Dabei geht es darum, daß jeder Router im Internet ein IP-Paket nicht komplett bis zum Empfänger routet, sondern für jedes Paket neu den nächsten Hop bestimmt und das Paket dort hin routet. 
Der nächste Router trifft seine Entscheidung dann unabhängig von dem vorhergehenden Router und jeder Router trifft seine Entscheidung für jedes Paket neu ohne Berücksichtigung vorhergehender Entscheidungen für Pakete mit derselben oder ähnlicher Zieladresse.

You wish.

Das theoretische Modell von TCP/IP ist so, aber moderne Router und Switches arbeiten nicht so, das wär ein wenig zu aufwendig.
Zwar arbeitet jeder Router für sich alleine, aber Routingprotokolle sorgen dafür, daß Routingtabellen mehrerer Router bei stabiler Netzwerksituation im Mittel auch zum Ziel führen.
Die Routingtabellen für einen Router im Internet 
[wachsen](http://bgp.potaroo.net/) 
dabei mit der zunehmenden Größe des Netzes und der zunehmenden Fragmentierung des IP V4 Adressraumes an, und ja, das ist ein Problem.

Man kann, wenn man sich die 
[Instability Reports](http://bgpupdates.potaroo.net/instability/bgpupd.html) 
ansieht auch feststellen, daß Fehler oder Routenänderungen im Netz nicht zufällig und gleich verteilt sind - statistische Modelle, die solche Ausfallwahrscheinlichkeiten annehmen sind fehlerhaft.
Evolutionäre Modelle, in denen Phasen langer Stabilität in großen Gebieten und Phasen hektischer Änderungen in kleinen Zonen angenommen werden 
([Punctuated equilibrium](http://en.wikipedia.org/wiki/Punctuated_equilibrium)) 
erzeugen wahrscheinlich bessere Mathematik auf diesem Gebiet.

Aber Router arbeiten nicht nur über Routingprotokolle synchronisiert geografisch abgestimmt zusammen, sondern Router haben auch Tricks, mit denen sie die Tatsache auszunutzen versuchen, daß über dem verbindungslosen IP in vielen Fällen ein verbindungsorientiertes Protokoll in den Schichten 4 oder 5 und höher liegt.

Im einfachsten Fall und ohne Kooperation untereinander sortiert man Routen aktiver Netze einfach in der Routingtabelle nach vorne oder lädt sie in einen speziellen Routing-Cache, wenn man außerdem Kooperation von Routern untereinander annehmen darf, werden Pakete sogar gekapselt oder getaggt und so zu einer Verbindung gehörende Pakete erkennbar und identisch geroutet - im Extremfall wird für so eine getaggte Verbindung eine Route durch mehrere Router etabliert und nur für die Erstentscheidung CPU im Router verbraucht. Folgepakete mit demselben Tag werden dann von spezieller Hardware in der Netzkarte des Routers abgehandelt, also quasi mit dem Stammhirn geroutet.

Die Art und Weise, wie im Internet Routen gefunden werden, garantiert auch nicht, daß die Routen symmetrisch sind.
Tatsächlich sind 
[asymmetrische Routen](http://www.cs.ucr.edu/~krish/yhe_gcom05.pdf)
(PDF) häufig, und die Umstände, unter denen sie zustande kommen sind interessant und Papers wert. 
[Messungen zu diesem Thema](http://www.caida.org/research/traffic-analysis/asymmetry/) 
gibt es auch 
([Caida](http://www.caida.org) 
hat, wie der Name sagt, sowieso jede Menge statistische Daten über das Internet).

Und schließlich die Frage, welche Auswirkungen so etwas auf TCP hat.
In klassischem TCP ist es ja so, daß TCP-Pakete, die out-of-order ankommen, als Netzwerküberlastung (Congestion) interpretiert werden und das TCP darauf hin das Transfer Window verkleinert. 
Dem liegt die Annahme zugrunde, daß Störungen im Netz selten genug sind, sodass Paketverluste in den meisten Fällen auf einzelne überlastete Verbindungen zurückzuführen sind.
Diese Annahme erlaubt dem Empfänger außerdem, einzelne "im Voraus" empfangene Pakete zu verwerfen - täte der Empfänger das nicht, könnte man sonst eine sehr einfache Denial Of Service Attacke gegen einen Empfänger konstruieren, bei dem man ihm auf einer Vielzahl von Verbindungen TCP-Daten mit Lücken sendete, bis der Kernel allen verfügbaren Speicher für gepufferte partielle Verbindungen verbraucht hat.

In manchen Umgebungen ist diese vereinfachende Annahme jedoch nicht wahr.
In mobilen Netzen zum Beispiel kann es durch die hohe Error-Rate der Links zu nennenswerten Paketverlusten kommen und hier kann es sinnvoll sein, im Voraus empfangene Pakete zu puffern, um die Anzahl von Retransmits zu senken 
([PDF](http://www.iks.inf.ethz.ch/education/ss04/seminar/52.pdf) dazu) - 
aber im solchen Netzwerken gibt es noch eine ganze Reihe von weiteren Tricks, die helfen können die Performance zu verbessern und dann wird es richtig kompliziert.
