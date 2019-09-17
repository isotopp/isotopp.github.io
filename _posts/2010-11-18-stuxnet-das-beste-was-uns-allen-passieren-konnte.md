---
layout: post
published: true
title: Stuxnet - das Beste, was uns allen passieren konnte
author-id: isotopp
date: 2010-11-18 21:24:16 UTC
tags:
- internet
- security
- lang_de
feature-img: assets/img/background/rijksmuseum.jpg
---
[Stuxnet](http://de.wikipedia.org/wiki/Stuxnet) ist ein maßgeschneiderter
Computervirus, der zwei bislang unbekannte Windows-Sicherheitslücken
ausnutzt, um bestimmte Windows-Versionen zu infizieren. Das ist deswegen
spannend, weil Windows-Sicherheitslücken dieser Art in letzter Zeit nicht
mehr so leicht zu finden sind - sie werden inzwischen gehandelt und
ernsthaft für viel Geld verkauft. Jemand hat gleich zwei dieser Lücken
verbrannt, um diesem Virus das Eindringen in bestimmte Systeme zu
ermöglichen. Jemand hat außerdem zwei taiwanischen Treiberfirmen ihre
Zertifikate geklaut, um signierten Gerätetreiber-Code in diese Rechner
einschmuggeln zu können, ohne daß dabei die Sicherheitswarnleuchten angehen.

Stuxnet macht nicht viel, solange er nicht auf einer bestimmten Sorte
Rechner ist, nämlich einem Rechner, an dem eine bestimmte Art von Siemens
Prozeßrechner mit einer bestimmten Konfiguration von Spezialhardware
angeschlossen ist, die mit bestimmten Parametern betrieben wird. Die
bekannten Daten passen recht genau auf eine Anlage, wie sie im Iran zur
Anreicherung von spaltbarem Material für Atombomben gebraucht wird.

Das ganze Profil deutet auf eine Entwicklung hin, die mit großer Sorgfalt,
Sachkenntnis und viel Zeit und Budget und einem spezifischen Testumfeld
gemacht worden ist, damit sie im genau definierten Ziel eine schwer
aufzuspürende, aber nachhaltige Schadwirkung entfaltet. Kurz: Es ist das
Werk einer Regierung, und angesichts des Zieles ist der Kreis der
Auftraggeber überschaubar.

[Anderswo](http://news.yahoo.com/s/ap/20101117/ap_on_hi_te/us_cyber_threats)
sinniert man nun über die Auswirkungen, die Variationen dieses Codes haben
könnten, wenn sie aus den Händen von Regierungen in die Hände von
Nichtregierungen gelangen. Äh, ja.

Das wird mit Sicherheit passieren. Aber genau genommen ist das gar nicht
notwendig. In ganz vielen Fällen ist ausreichend, daß die Machbarkeit einer
Sache bewiesen wird und das Konzept grob beschrieben wird, um viele Stellen
zu ermutigen, auf diesem Gebiet eigene Forschungen und Entwicklungen zu
betreiben. Wir können davon ausgehen, daß die organisierte Kriminalität in
Regierungs- und Nichtregierungsorganistionen in diesem Moment große
Forschungsbudgets in diese Richtungen mobilisiert - ein digitales Wettrüsten
hat begonnen.

Im Fadenkreuz stehen die vergessenen Rechner - in Milliarden von Geräten
stecken Komponenten, die nicht unter dem Gesichtspunkt aktiver Angriffe
entwickelt und installiert worden sind. Einige von ihnen sind vernetzt.
Keines von diesen Geräten hat in den letzten 10 Jahren signifikate
Sicherheitsupdates erhalten und für viele Geräte gibt es nicht mal mehr
welche, oder hat es nie welche gegeben.

Ich weiß zum Beispiel von Zugangskontrollsystemen, die 
[immer noch von Maschinen mit Windows NT 4](http://www.autec-gmbh.de/vesta_ze.html) 
gesteuert werden, und von Banken, in denen das fast das gesamte Netz eine
einzige Layer 2 Broadcastdomain ist. Wieder anderswo schiebt man
sicherheitsrelevante Kontroll- und Steuerinformationen mit FTP oder gar FTAM
unverschlüsselt durch die Gegend. Letzteres könnte man getrost als Security
By Obscurity definieren, wenn denn die interessanten Daten nicht mit einem
"strings" auf ein paar Capture-Dateien lesbar wären. Wieder andere Leute
definieren Protokolle für P2P Verkehrsleitsysteme mit Ad-Hoc Netzen zwischen
fahrenden Automobilen, die Abstands- und Geschwindigkeitsinformationen
austauschen, die das Fahrverhalten des Fahrzeuges beeinflussen sollen und
die nur unzureichend authentisiert und gegen Manipulation gesichert werden.

[Anderswo](http://www.telegraph.co.uk/news/worldnews/1575293/Schoolboy-hacks-into-citys-tram-system.html)
hat man das Steuersystem für die Weichen einer Straßenbahn komplett
ungesichert über Infrarot exponiert.

Bisher hat man Security in diesen Bereichen eher als Nebensache behandelt
und Bedrohungen als etwas hypothetisches eingestuft.

Diese Zeiten sind vorbei.

Mit ein wenig Glück sehen wir dank Stuxnet jetzt in diesem Bereich endlich
ein wenig mehr Engagement im Bereich Security, das vielleicht auch über
bessere
[Türschlüssel](http://www.heise.de/newsticker/meldung/Geldautomaten-schlecht-gesichert-1047452.html)
hinausgeht. Aber bis sinnvoll definierte und kryptographisch gesicherte
Protokolle in diesen Bereichen flächendeckend etabliert sind wird
[noch viel Zeit vergehen](http://laforge.gnumonks.org/weblog/2010/11/12/#20101112-history_of_a52_withdrawal).
Und man wird
[vorhandene ungesicherte Protokolle als Träger verwenden](http://laforge.gnumonks.org/weblog/2010/11/07/#20101107-all_your_baseband_are_belong_to_us),
oder Security optional machen - das hat alles noch massenhaft Potential für
Fail.

[Viel Spaß](http://www.amazon.de/Daemon-Die-Welt-ist-Spiel/dp/3499252457)
(auch beim Lesen).
