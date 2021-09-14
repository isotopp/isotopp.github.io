---
layout: post
published: true
title: Das Google-Mißverständnis
author-id: isotopp
date: 2009-11-07 16:30:16 UTC
tags:
- google
- internet
- technik
- lang_de
feature-img: assets/img/background/rijksmuseum.jpg
---
Ich glaube ja, daß Google eine der am meisten mißverstandenen Firmen auf
diesem Planeten ist. Die meisten Leute halten Google für eine globale
Suchmaschine. Das ist wohl richtig, aber es greift viel zu kurz, wenn man
sich die Konsequenzen nicht klar macht.

Google selber formuliert die eigene Mission eher als den Versuch, alles
Wissen der Welt zu erfassen, zu ordnen und gezielt zugreifbar zu machen. Das
ist besser, aber die meisten Leute lesen das nicht oder denken nicht darüber
nach, was das bedeutet.

Google betreibt zum Beispiel Rechenzentren in aller Welt. Rechenzentren sind
Kisten, in die man Rechner reinstellt, und in die man dann Strom, Kühlung
und Netz einfüllt und Netz rausholt. Hauptkostenfaktor bei Rechenzentren ist
Strom - also baut Google
[Rechenzentren die weniger Strom verbrauchen](http://www.datacenterknowledge.com/archives/2009/07/15/googles-chiller-less-data-center/).
Wenn man genug Rechner reinstellt und lange genug wartet, dann bekommt man
Statistiken über die Zuverlässigkeit von
[Harddisks](http://labs.google.com/papers/disk_failures.pdf) (PDF) und 
[RAM Speicher](http://www.cs.toronto.edu/~bianca/papers/sigmetrics09.pdf)
(PDF). Sicher gibt es auch andere Leute, die große Mengen von Rechnern
betreiben, aber diese Leute veröffentlichen anders als Google keine
wissenschaftlichen Papers darüber. Vielleicht reden sie nicht wie Google
darüber, wahrscheinlicher ist aber, daß sie nicht auf dieselbe Weise wie
Google über ihr Handeln reflektieren.

Google reflektiert das eigene Handeln sehr intensiv - und zieht die
Konsequenzen daraus. Wer zum Beispiel
[so viele Rechenzentren wie Google hat](http://royal.pingdom.com/2008/04/11/map-of-all-google-data-center-locations/),
der braucht natürlich auch Mechanismen, um Daten zwischen diesen Data
Centers zu transferieren. Das ist nicht etwas, das man bezahlen möchte. Also
muß man sich eine günstige Methode überlegen, um Daten zwischen diesen
Rechenzentren zu transferieren -
[gesagt, getan](http://www.voip-news.com/feature/google-dark-fiber-050707/).
Die Konsequenzen sind durchschlagend -
[Youtube](http://blogs.broughturner.com/communications/2006/11/how_little_yout.html)
hat einen signifikanten Anteil am gesamten Webtraffic der Welt, aber Google
hat keine Traffickosten damit.

In der Konsequenz bedeutet das auch, daß Google am Ende die Diskussion über
Netzneutralität nur teilweise interessiert. Google belastet die Netze von
anderen ISPs jedenfalls nicht, weil Google sein eigener ISP ist und den
erzeugten Traffic bevorzugt durch eigene Netze leitet und nur für die
'letzte Meile' durch das Netz des ISP des Endkunden leitet. Das Argument,
daß Google einem ISP Kosten erzeugt ist jedenfalls haltlos, und wird nur als
Hebel gebraucht, um an die Einnahmen von Google zu kommen oder Google zu
Zugeständnissen zu zwingen.

Google ist also auch 
[eine Art CDN](http://www.datacenterknowledge.com/archives/2008/12/15/the-google-cdn/),
wenn man das so sehen will - die Rechenzentren sind jedenfalls über die
ganze Welt verteilt und können in den meisten Fällen sehr nahe am Endkunden
sein. Damit das so sein kann braucht man jedoch neben Bandbreite auch noch
[ein Dateisystem](http://labs.google.com/papers/gfs.html) und in Kombination damit 
[eine Art HSM](http://features.techworld.com/storage/3184/googles-storage-infrastructure--part-2/),
das nicht nur Replikation der Daten regelt, sondern die Daten auch
netzwerktopologisch nahe an den Verbrauchern einlagert.

Google hat das und minimiert so auch den Verkehr im eigenen Netz.

Die Daten werden dann in Berechnungen benötigt, und die Berechnungen sollen
angesichts der Massen von verfügbaren Rechnern parallelisiert werden. Dazu
hat man einen Mechanismus entwickelt, der
[Map Reduce](http://labs.google.com/papers/mapreduce.html) heißt und der es
erlaubt, eine Berechnung auf eine große Menge von Rechnern zu verteilen,
parallel auszuführen und die Ergebnisse einzusammeln. Das MapReduce
Framework kümmert sich dabei um das Management der Berechnungsinfrastruktur,
für den Entwickler bleibt also "nur" die Arbeit, die Berechnung in einer
MapReduce-geeigneten Weise zu zerteilen und aufzuschreiben. Das ist die
Grundlage, auf derer Google-Entwickler Anwendungen schreiben können und die
ihnen erlaubt, diese Anwendungen auf 10\^9 User hoch zu skalieren, ohne den
Code übermäßig anpassen zu müssen.

Aber das ist Infrastruktur. Auf einer höheren Ebene passieren ebenfalls
spannende Dinge:

Eine der Grundideen, die sich strategisch durch alle diese Aktivitäten von
Google ziehen, ist die Unabhängigkeit von anderen Firmen. Ein schönes
Beispiel dafür ist nicht nur die oben verlinkte Dark Fiber-Aktion, sondern
auch die Entwicklung von
[Googe Maps mit Turn-based Navigation](http://www.iphone-scoop.com/2009/10/turn-by-turn-based-navigation-apps-by-google/).
Seit Anfang 2005 veröffentlicht Google in Google Maps auch Fotografien
entlang der Strecke, die durch spezielle Kamerawagen erfaßt worden sind.
Diese Erfassung muß also schon früher begonnen haben, die Konstruktion der
Spezialfahrzeuge noch früher (der IPO von Google war jedoch im August 2004 -
das zum Thema langfristige Planung).

Dieser Datenfundus ist inzwischen groß genug, um mit diesen Daten auch 'turn
based navigation' anbieten zu können und dabei weder von Teleatlas noch
NavTeq als Datenquelle abhängig zu sein. Das war
[schon vor 3 Jahren vermutet worden](http://battellemedia.com/archives/002306.php), aber auch 
[aktuelle Analysen greifen noch zu kurz](http://www.finanzen.net/nachricht/aktien/Google-greift-mit-neuer-Handy-Software-Navi-Hersteller-an-692403).

Denn mit Geodaten und Positionsinformationen aus Latitude lassen sich noch
viele andere Dinge machen: Google füttert seine Kartendaten mit den
Kennungen von Mobilfunknetzen aus Google Maps auf Mobiltelefonen und benutzt
diese Information wiederum um ihr AGPS schneller zu machen. Mit den Daten
aus Latitude lassen sich wiederum - eine ausreichende Nutzerdichte
vorausgesetzt - Verkehrsströme erfassen, mappen und später vorhersagen. Wenn
Maps dabei auf Mobiltelefonen läuft und die Telefone 'in-car mode'
signalisieren, dann kann man sogar Fußgänger und Autofahrer sicher
voneinander unterscheiden, und mit den verwendeten Navigationszielen auch
Vorhersagen für etwa Busnetzbetreiber machen, die diese Daten zur
Angebotsoptimierung verwenden könnten.

Google macht aber nicht nur Geoinformation, sondern spielt auch auf anderen
Märkten. Dabei ist Google so modern und flexibel, daß die jeweils
etablierten Player auf diesen Märkten als 'wehrlos' gelten müssen. Googles
Buchdigitalisierungsprojekt zum Beispiel ist so groß und umfassend, daß sich
die Print-Industrie Existenzängsten ausgesetzt sieht und nach Regulierung
schreit, anstatt mit Google über neue Geschäftsmodelle zu verhandeln. Aber
statt Dinge wie Markterweiterung, Paradigmenwechsel und so zu thematisieren
bekommt man Statements von Ledereinbandsfetischisten und Liebhabern des
haptischen Bucherlebnisses die circa kurz nach Gutenberg stehen geblieben
sind.

Die verwandte Zunft der Nachrichtenagenturen fordert gar ein 
[Leistungsschutzrecht](http://carta.info/16569/koalition-plant-leistungsschutzrecht-fuer-verlage/)
für Nachrichten. Das ist eine Idee, die ich mit großem Amusement verfolge,
denn unsere Regierung will dieses Recht auf Betreiben der Agenturen
schaffen - und so werden wir beobachten können, wie genau dieses Recht am Ende die
Agenturen umbringen wird. Denn es werden am Ende Nachrichten von Googles
Agentur sein, die durch dieses Recht geschützt werden, und so werden die
überlebenden traditionellen Verbraucher von Nachrichten am Ende von dort
lizensieren müssen. Oder glaubt jemand nach der Google
Maps/Streetview-Aktion, daß Google sich in _dieser_ Sache von externen
Firmen abhängig machen lassen wird, wenn sie es schon bei Kartendaten nicht
zugelassen haben?

Es gibt noch etwas anderes, das mich sehr fasziniert, und das ist die
geringe Zahl von beobachtbaren Fuck-Ups bei Google. Ich vermute, daß man bei
Google nicht viel anders arbeitet als etwa bei uns, d.h. daß man als
web-basierendes Unternehmen so agil ist, wie es die eigene Größe irgend
erlaubt. Bei solchen Rollouts kann es
[zu Ausfällen kommen](http://www.zdnet.de/news/wirtschaft_telekommunikation_google_bestaetigt_ausfall_von_google_mail_story-39001023-39189745-1.htm),
aber tatsächlich sind diese sehr sehr selten im Verhältnis zu der Anzahl der
Rollouts, die stattgefunden haben müssen. Viele Pannen, die Google
unterstellt werden, sind dabei noch nicht einmal welche: Die
[Google Voice](http://www.boygeniusreport.com/2009/10/19/random-users-google-voice-mail-is-searchable-by-anyone/)
Sache ist ein klassischer PEBKAC, und auch die
[Google Docs](http://www.techcrunch.com/2009/03/07/huge-google-privacy-blunder-shares-your-docs-without-permission/)
Sache ist mindestens partiell ein PEBKAC. Alles in allem habe ich angesichts
der Größe der Operation, der Anzahl der Mitarbeiter und der Frequenz der
Codechanges einen Heidenrespekt vor der Qualität, die Google da produziert.

Es ist klar, daß es Mechanismen und eine Kultur geben muß, die das erzeugt
und die solche Fuck-Ups erkennt und im Ansatz verhindert. Es gibt Theorien,
die sich mit der
[20% Time](http://www.scottberkun.com/blog/2008/thoughts-on-googles-20-time/) von
Google beschäftigen. Es sieht wohl so aus, daß die meisten Googler diese
Zeit verwenden, um intern Code Changes von Kollegen zu sichten und zu
prüfen. Bei
[Cringely](http://www.cringely.com/2009/09/the-peoples-republic-of-google/)
wird das näher beschrieben.

Dazu kommt noch, daß man Sachen, die sich messen lassen, auch mißt und sich
nicht mit Meinungen aufhält, wenn man harte Daten haben kann -
[Marissa Mayer](http://www.guardian.co.uk/technology/2009/jul/08/google-search-marissa-mayer)
zum Beispiel ist bekannt dafür, daß sie einmal die
[Klickraten von 40 verschiedenen Blautönen](http://gigaom.com/2009/07/09/when-it-comes-to-links-color-matters/)
hat Messen lassen.

Wenn man nun einmal ein paar Schritte zurücktritt und das Gesamtbild auf
sich wirken läßt, dann erkennt man Muster:

Alles in allem wirkt der Ansatz von Google auf mich wie eine Firma von
Physikern oder anderen Experimental-Forschern mit akademischem Background,
die beschlossen haben, einmal 'so richtig' in die Wirtschaft zu gehen und
ihre Methoden dort hin zu portieren. Man baut Modelle, identifiziert
Abhängigkeiten und eliminiert sie konsequent und man hat keine Angst, dabei
auch richtig groß zu denken und Neuland zu betreten.

Auf eine Weise betreibt man Grundlagenforschung, aber nicht in der
Abgeschiedenheit von Menlo Park oder einem anderen Elfenbeinturm, sondern
gleich in der Produktion.
