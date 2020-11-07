---
layout: post
title:  'Rechenzentren und ihren Stromverbrauch regulieren'
author-id: isotopp
feature-img: assets/img/background/rijksmuseum.jpg
date: 2020-11-01 13:04:46 +0100
tags:
- lang_de
- computer
- data center
- energy
- cloud
- climate
---
Es gibt ein Interview mit Stefan Ramesohl vom Umweltministerium (des Bundes) in Netzpolitik.org: "[Warum niemand weiß, wie viele Rechenzentren es in Europa gibt](https://netzpolitik.org/2020/interview-zur-umweltpolitischen-digitalagenda-warum-niemand-weiss-wie-viele-rechenzentren-es-in-europa-gibt/)". Im Wesentlichen hat das Umweltministerium angesagt, daß es auf europäischer Ebene Rechenzentren erfassen und katalogisieren will, um in einem zweiten Schritt den Energieverbrauch von Rechenzentren zu regulieren.

Das ist sehr spannend, denn derzeit gibt es keine Übersicht über Rechenzentren in Europa, und tatsächlich sind einige Rechenzentrumsbetreiber sehr paranoid, was den genauen Standort ihrer Hardware angeht und wieviel und welche Hardware darin ist oder was diese tut. Das ist zwar lächerlich - es ist sehr schwierig eine Energiesenke wie ein Rechenzentrum und ihre Abwärme zu verstecken - aber auch ein sehr sensitives Thema.

## Eine Leseliste

In dem Interview gibt es ein paar Dinge, die Anmerkungen verdienen, aber bevor es los geht noch die anderen Artikel in diesem Blog als Links:

- [Threads vs. Watts]({% link _posts/2017-07-19-threads-vs-watts.md %}): Ich habe einen Dell R630 mit zwei Xeon 6132 CPUs getestet, und deren Energieverbrauch unter Last gemessen. Die Resultate sind repräsentativ für die ganze Klasse von Rechnern, die eine Art Arbeitspferd im modernen Rechenzentrum sind. Der Hauptpunkt: 50% der maximalen Energieaufnahme werden bereits bei 20% Auslastung aufgenommen.
- [A Journey to Open Compute]({% link _posts/2018-02-21-a-journey-to-open-compute.md %}): Mit Open Compute hat Facebook die Energieaufnahme eines Rechners in Idle auf 50% eines herkömmlichen Rechners senken können, und unter Volllast auf 80%. Das wird ermöglicht, indem man Rechner, Rack und Raum nach einer gemeinsamen Spezifikation baut und optimiert. Der Open Compute Standard ist jetzt eine offene Spezifikation, aber wegen der Abhängigkeiten zwischen Raum, Rack und Rechner lohnt sich das alles nur, wenn man ein [GAFAM](https://en.wikipedia.org/wiki/Big_Tech#GAFAM_or_FAAMG)-type Hyperscaler ist.
- [Power budgets for computing resources - portable and stationary]({% link _posts/2017-11-07-power-budgets-for-computing-resources-portable-and-stationary.md %}) listet generell die Zusammenhänge zwischen Rechnen, Batterieverbrauch und Abwärme auf.
- [Data Centers and Energy]({% link _posts/2019-10-05-data-centers-and-energy.md %}): Wenn man Netflix schaut, wird Energie verbraucht. Wo und wieviel? Wir reden über Endgeräte (die nur wenige Watt brauchen), über Open Compute in Rechenzentren und über Energieverbrauch im Netzwerk, speziell auf der letzten Meile. Letzterer variiert enorm: 5G braucht sehr viel Energie, (V)DSL ist ebenfalls sehr aufwendig, und Glasfaser nicht - sie ist leicht eine Zehnerpotenz günstiger.
- [Streaming and Energy]({% link _posts/2019-12-28-streaming-and-energy.md %}) und [Netflix does not bring down the Internet]({% link _posts/2020-03-19-netflix-does-not-bring-down-the-internet.md %}): Speziell Videostreaming funktioniert schon sehr optimiert: Videos werden in Edge Data Centers gespeichert und nicht neu codiert, sie werden in der niedrigsten sinnvollen Auflösung geliefert und die Decodierung erfolgt mit spezieller Hardware, damit die Batterie im Endgerät länger hält. All das braucht weniger Energie als angenommen.
- [Cloud and Energy]({% link _posts/2020-06-08-cloud-and-energy.md %}): Das Uptime Institut sagt: "Data center energy efficiency gains have flattened out" (und sieht einen durchschnittlichen PUE von 1.58). Uptime sagt im selben Text aber auch, daß neuere und größere Facilities mit Open Compute *signifikant* bessere PUE haben. Der einfachste Weg zur Verbesserung von PUE für die meisten Firmen ist, ihre Workloads in die Cloud zu verlagern (und dynamisch zu skalieren). Das hat bei korrekter Durchführung neben Energieffizienz auch noch jede Menge andere Vorteile, die sich aus einem gelungenen Outsourcing ergeben.

## Hyperscaler-Rechenzentren sind viel energieeffizienter

Auf Twitter ging ich auf [das Interview ein](https://twitter.com/isotopp/status/1322857383929012224):

> *Netzpolitik.org:* Diese großen Player können ja kein Interesse an staatlicher Regulierung haben, sondern werden versuchen, eine branchenweite Selbstverpflichtung herbeizuführen.

Eher nicht. Als [GAFAM](https://en.wikipedia.org/wiki/Big_Tech#GAFAM_or_FAAMG) wäre man sinnvollerweise für mehr Regulierung, denn das käme effektiv einem Cloud-Zwang gleich.

Wie oben bereits dargestellt, hat GAFAM bereits Rechenzentren, die sehr viel effizienter mit der Energie umgehen als normale Rechenzentren es tun. Das ist so, weil diese Rechenzentren Raum, Rack und Rechner als ein System designed haben und weil die Betreiber als Hyperscaler es sich leisten können, solche Rechenzentren nach Maß zu designen, bauen zu lassen und zu optimieren.

Während also ein traditionelles Rechenzentrum Rechner für eine Million Watt betreibt und dafür um die 600.000W an Kühlung und anderer Sekundärenergie aufbringen muß (Power Utilization Efficiency, PUE 1.6), können die am Besten optimierten Google-Rechenzentren eine Million Watt an Rechnern mit 60.000W Sekundärenergie betreiben (PUE 1.06).

Ein effektiver PUE von <1.2 ist par für die Hyperscaler-Cloud.

Ein kleinerer Rechenzentrums-Nutzer füllt nicht ein ganzes RZ mit Rechnern, läßt also nicht nach Maß bauen, sondern mietet existierenden RZ-Space, der prinzipbedingt nicht gut geeignet ist für Open Compute (OCP). Existierende RZ-Space ist generisch, er muß jede Art von IT-Equiment aufnehmen können und ist daher oft Überkühlt, der Airflow ist nicht optimiert und hat auf diese Weise mindestens dreimal mehr Overhead als RZ-Space, den Hyperscaler nach Maß bauen (PUE <1.2 vs. PUE ~ 1.6). Noch kleinere Benutzer füllen nur einzelne Räume oder haben Raumabschnitte ("Cages"), teilen also die Kühlung mit anderen Nutzern.

Hyperscaler bauen nicht nur ein RZ, sondern tun das in Serie, und iterieren dabei das Design. Sie lassen auch Rechner und Rechnerkonzepte wie OCP entwickeln, und stimmen dabei das Design des RZ auf das Design von Rack und Rechner ab - daher kommt die energetische Überlegenheit von OCP.

Dazu kommt, wie oben auch dargestellt, daß ein ausgelasteter Rechner energieeffizienter ist als einer, der teilweise vor sich hin idled. Ein Dell R630 verbraucht bereits 50% seiner maximalen Energie bei 20% Auslastung.

Maschinen auszulasten und Workloads dynamisch zu skalieren ist etwas, für das "die Cloud", also die API-gesteuerten Rechenzentren der Hyperscaler, gebaut worden sind. Hyperscale Clouds haben "sellable cores per provisioned cores" als eine zentrale Optimierungsmetrik, sie wollen ausgelastete Rechner, weil das die Einnahmen definiert.

![](/uploads/2017/07/watt-thread.jpg)

*Watts per Thread (Dell R630, Dual Xeon 6132)*

Wie dem auch sei: Aus energetischer Sicht ist Auslastung wichtig, weil die Watts zur Aktivierung des n-ten Rechenkerns asymptotisch günstiger sind. Das ist so, weil die Idle-Energieaufnahme der Maschine und des ganzen Rechenzentrums drumherum sich so amortisiert.

Außerdem: Wenn man es sich leisten kann, Hyperthreading zu aktivieren (Wegen der diversen Intel-Caching-Bugs der letzten Jahre ist das oft ein Sicherheitsrisiko), dann sind die Hyperthreads energetisch betrachtet nahezu kostenfrei. Integer- und Stringprocessing-Workloads können Hypterthreads als nahezu vollwertige zweite CPU betrachten, Fließkomma-intensive Workloads nicht.

Webshops sind, wenn sie richtig gebaut worden sind, String- und Integer-Anwendungen und sehr wenig Fließkomma-intensiv, könnten also von Hyperthreading voll profitieren. Die Anzahl der nutzbaren Cores verdoppelt sich rechnerisch und ist bei Webshop fast vollständig realisierbar - ein Webshop mit einer fast reinen Integer/String Workload kann von den 56 rechnerischen Kernen einer Dual-6132 eine Load von deutlich über 40 stabil verarbeiten.

## Kosten und Energie

Über eine Nutzungsdauer von fünf Jahren gerechnet machen Energiekosten in etwa die Hälfte der Gesamtkosten eines Rechners aus - für einen Hyperscaler ist das ein so intensiver Kostenfaktor, daß sie aus wirtschaftlichen Gründen seit mehr als 15 Jahren intensiv die Energieaufnahme ihrer Rechenzentren in allen Punkten optimieren.

Das ist der primäre Grund für das Open Compute Projekt (OCP) und die Bauweise der Hyperscaler-Rechenzentren. Für Hyperscaler lohnt dies, weil das der Kernbereich ihres wirtschaftlichen Handelns ist.

Dazu kommt, wie in der Leseliste dargestellt, daß alle Hyperscaler (bis auf Amazon) bereits 100% graugrün sind, also zu großen Teilen bereits auf tatsächlich regenerativer Energie laufen und den Rest mit Zertifikaten kompensieren, und obendrein sehr nah in der Zukunft liegende Ziele haben, was komplett grünen Betrieb *und* Überkompensation angeht. Speziell Google ist ein sehr großer Investor in Wind- und Solarkraftanlagen, Netflix überkompensiert bereits jetzt, ist also Carbon-Negative.

Für ein Firma, für die der Betrieb und die Skalierung von Rechenzentren und ihrer Hardware nicht der Kern ihres wirtschaftlichen Handelns ist, ist es ausgeschlossen hier mitzuhalten.

Oder wie Ramesohl es formuliert: 

> Es ist einfach so, dass eine gewisse Skalierung zu großen Vorteilen führt, die dann wiederum über eine Wettbewerbsfähigkeit im Markt die Marktposition stärkt und damit den Marktanteil erhöht. Das ist ein selbstverstärkender Effekt. Hinzu kommt, dass diese Akteure in der Lage waren, zu investieren und sich damit ein technologisches Know-how aufzubauen, was wiederum im Umkehrschluss ihre Marktposition stärkt.
>
> Das ist richtig, dass gerade bei den großen Playern entsprechende selbstdefinierte Nachhaltigkeitsziele vorliegen. Das sind teilweise sehr ambitionierte Pläne, die versuchen, die Emissionen, die im Laufe der Unternehmensgeschichte bisher aufgelaufen sind, rückwirkend zu kompensieren. 

## Bandbreite und Energie

Ramesohl sagt auch:

> Da geht es um die Frage, ob jede Internetwerbung eine Autoplay-Funktion braucht, also abspielt, wenn ich nur über die Seite scrolle. Das erzeugt nämlich ein enormes Datenvolumen. Oder die Frage, ob alles standardmäßig in höchster Auflösung gestreamt werden muss, wenn es auf einem kleinen Bildschirm angeschaut wird.

Dahinter steht die Fehlmeinung, daß eine Netzwerkinfrastruktur mehr Energie benötigt, wenn Daten übertragen werden. Das ist nicht der Fall.

So wie eine Festplatte oder RAM nicht schwerer werden oder mehr Energie verbrauchen, wenn Daten darin gespeichert werden, so braucht ein kabelgebundenener Netzwerklink nicht (wesentlich) mehr Energie, wenn Daten übertragen werden.

RAM und Festplatten brauchen (mehr) Energie, wenn Daten *geändert* werden, also Bits gekippt werden.

Und kabelgebundenene Netzwerkinfrastruktur überträgt immer Daten (Trägersignale), auf die die Nutzlast dann aufmoduliert wird. Das wiederum braucht im Vergleich zur Grundlast des Netzes (das Senden des Trägers) kaum Energie. Anders sieht es bei Funkverbindungen, also Datenübertragung via Mobilfunknetz aus, dort wird der Sender komplett abgeschaltet, wenn er nicht gebraucht wird, um das Spektrum frei zu halten.

Speziell bei Glasfaser ist es so, daß man die Bandbreite zudem mit nur wenig mehr Energieaufwand um Größenordnungen hochdrehen kann, wenn man will - durch den Austausch der Laser kann dasselbe Medium in der Kapazität verzehnfacht oder verhundertfacht werden ohne signifikat mehr Energie zu verbrauchen.

## Was tun wir mit all dem Compute

Am Ende ist es eventuell eine gute Idee, nicht nur genauer hin zu schauen, wo Rechenzentren stehen und wie sie designed sind, sondern was mit den Megawatts gemacht wird, die dort verwendet werden. Auf diese Weise bekommen wir eventuell Bitcoin weg gebombt. Das wäre schon einmal sehr wichtig, denn hier wird Energie in der Größenordnung ganzer Staaten in sinnlosen Berechnungen ("Proof of Work") verheizt. Und nein, das kann man nicht ändern, PoW kann nicht sinnvolles berechnen.
