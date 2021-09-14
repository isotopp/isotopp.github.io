---
layout: post
published: true
title: Der Bundestrojaner durchdekliniert
author-id: isotopp
date: 2007-02-26 19:40:17 UTC
tags:
- security
- überwachung
- lang_de
feature-img: assets/img/background/rijksmuseum.jpg
---
![](/uploads/bundestrojaner.jpg)

Ich wollte nix dazu schreiben, weil ich mich dann wieder so aufrege. Aber es
geht einfach nicht. Also zwischen Tür und Angel wegen
[Frattini](http://www.heise.de/newsticker/meldung/85895) und 
[Beckstein](http://blog.fefe.de/?ts=bb29d3b8) jetzt doch der isotoppische
Endartikel zum Bundestrojaner.

### Der Sachverhalt

[Meine Regierung](http://www.heise.de/newsticker/meldung/85895) erklärt mir
und jedem anderen Bürger also das Mißtrauen. Der Rattenschwanz von Artikeln
am Ende der Meldung zeigt das sehr deutlich.

Wenn ich über das Thema nachdenke, wird auch sehr deutlich, daß ich meiner
Regierung das Mißtrauen aussprechen muß.

Aber gehen wir das Thema doch mal systematisch an: Der Bundestrojaner ist
ein hypothetisches Stück Software, das ohne mein Wissen durch den Staat auf
meinem Rechner installiert werden soll, wenn der Staat der Meinung ist, daß
das aus welchem Grund auch immer gerechtfertigt ist. Der Staat will so
Beweise sammeln, mit denen er dann später nicht nur eine gerichtsfeste
Rechtfertigung seines Eindringens in meine persönliche Sphäre basteln will,
sondern auch einen Fall gegen mich bauen will.

### Ja geht das denn so?

Lesen wir also einmal nach über 
[Richtlinien zur erfolgreichen Sicherung von EDV-Beweismitteln](http://www.edv-beweismittelsicherung.de/edv/richtlinien-zur-erfolgreichen-sicherung-von-edv-beweismitteln.php):

> Im Zentrum des Prozesses, der zur Vorlage von gerichtstauglichen
> EDV-Beweismitteln führt, steht die Erfüllung der Bedingung, dass die Daten
> vor Ort korrekt sichergestellt wurden. Ist diese erste Voraussetzung nicht
> gegeben, so wird jede Information, die aus diesen Daten gewonnen wird,
> später sehr wahrscheinlich wertlos sein, da sie nicht als gerichtstauglich
> angesehen werden kann. Wo auch immer EDV-Beweismaterial gesichert und
> ausgewertet wird, ist es zum unverzichtbaren Grundsatz geworden, eine
> Kopie des kompletten Zielsystems zu machen. Eine Teilkopie oder die Kopie
> ausgewählter Daten ist hierzu keine gültige Alternative.

Nicht nur das, sondern weiter: 

> Darüber hinaus gibt es mehrere gültige Richtlinien für den Umgang mit
> Computermedien in beweismitteltechnisch korrekter Form. Zwei der
> wichtigsten lauten:
>
> -Keine Handlung seitens der Polizei oder handlungsbefugter Personen darf
> Daten verändern, die sich auf einem Computer oder einem anderen
> Speichermedium befinden, das zu einem späteren Zeitpunkt Gegenstand von
> gerichtlichen Untersuchungen werden kann.
> - Alle Vorgänge, die an dem EDV-Beweismaterial durchgeführt werden, müssen
> in einem Protokoll festgehalten werden. Dieses Protokoll ist
> aufzubewahren. Ein unabhängiger Dritter muss in der Lage sein, diese
> Vorgänge zu wiederholen und zu denselben Aussagen zu kommen.

Und jetzt kommt der Bundestrojaner. Man kann schon im Ansatz erkennen, daß
das so nicht funktionieren kann: Die Installation des Bundestrojaners
komprimittiert den zu untersuchenden Rechner in einer Weise, daß dieser
zwangsläufig als Beweismaterial unbrauchbar wird.

Nicht nur das: Es ist für niemanden erkennbar (oder sicherstellbar), ob die
auf meinem Rechner gefundenen Dokumente von mir stammen oder ob sie nicht
durch den Bundestrojaner dort plaziert worden sind. Mal angenommen, meine
Regierung ist vertrauenswürdig und würde nicht lügen und intrigieren 
([Glaubwürdige Annahme?](http://de.wikipedia.org/wiki/Kurnaz)).

### Konsequenz aus dieser Bedarfsanalyse

Dann muß sie natürlich, um Zugriff auf meinen Rechner zu haben, den
Bundestrojaner bei mir installieren. Das kann sie entweder unter Zeitdruck
bei den Leuten tun, auf deren Rechner sie Zugriff haben möchte oder vorab
kontrolliert bei allen Leuten und dann den Trojaner nur aktivieren bei
denen, bei denen sie den Zugriff für gerechtfertigt hält. 

Das wird sie natürlich nur in [wenigen, streng begründeten
Ausnahmefällen](http://www.heise.de/tp/r4/artikel/24/24664/1.html) tun. Die
kontrollierte Installation würde als Hintertür in irgendeinem [wichtigen
Programm](http://de.wikipedia.org/wiki/ELSTER) erfolgen, das sowieso jeder
verwendet und das regelmäßig legitim Kontakt zu irgendwelchen staatlichen
Servern aufnehmen muß. Auf diese Weise ist schon alles vorbereitet, wenn
Bedarf besteht und die Umstände der Installation sind nicht nur
unverdächtig, sondern auch besser beherrschbar. Und die Nutzlast, die da
installiert werden kann, darf größer sein, weil das in dem größeren Klumpen
legitimer Software sowieso nicht auffällt.

### Wie der Bundestrojaner vorgehen muß

Würde sich der Bundestrojaner auch nur entfernt an die oben genannten
"Richtlinien zur erfolgreichen Sicherung von EDV-Beweismitteln" halten, dann
hat er ein Problem. Nämlich das Problem, zwischen 80 und 800 Gigabyte Daten
von der Zielfestplatte zu den Bedarfsträgern zu schaffen ohne daß dies
auffällt, denn "Eine Teilkopie oder die Kopie ausgewählter Daten ist hierzu
keine gültige Alternative." heißt es in den o.a. Grundsätzen. Mit dem
Upstream einer DSL-Leitung ist das in sinnvoller Zeit schlicht nicht
möglich.

Es ist also doppelt nicht möglich, die "Richtlinien zur erfolgreichen
Sicherung von EDV-Beweismitteln" einzuhalten. Nicht nur das: Da der
Bundestrojaner sich auf eine selektive Sicherung beschränken muß, muß er
Dateien durchsuchen, analysieren, und dann muß mehr oder weniger interaktiv
eine Auswahl getroffen werden.

### Konsequenz aus der Interaktivität

![](/uploads/ethereal-vulnerabilities.png)

Endstand: Ethereal vs. die Welt

Das Programm
[Wireshark](http://freshmeat.net/projects/wireshark/) hat eine ganz ähnliche
Aufgabe wie der Bundestrojaner: Es dient dazu, Netzwerkverkehr
mitzuschneiden und unbekannte oder defekte Daten zu analysieren und nach
nützlichen Informationen zu durchsuchen. Es ist ein wertvolles
Netzwerkanalysetool. Wireshark hieß früher Ethereal, und unter diesem Namen
finden wie es auch in der
[National Vulnerability Database](http://nvd.nist.gov/statistics.cfm?product_command=Ethereal) der
US Behörde NIST. 

Unbekannte und defekte Daten zu analysieren ist eine schwierige Aufgabe -
Ethereal-Wireshark muß im Grunde genommen Bitmüll interpretieren ohne zu
wissen, was es ist, und dann in sinnvolle Informationsblöcke zerlegen. Es
muß dies insbesondere auch mit falsch beschriftetem oder verstrahlten
Bitmüll tun. 

In Konsequenz ist Wireshark-Ethereal der einsame Anführer der National
Vulnerability Statistic in den letzten 3 Jahren: Es ist das Programm mit den
meisten remote ausnutzbaren Fehlern überhaupt: fast 50 in 2005 (2006 ist es
dann umbenannt worden, sodaß noch 12 weitere Vulnerabilities dazu kommen,
2007 werden es etwa 30 sicherheitskritische Fehler sein, die in Wireshark
gefunden werden).

Warum ist das wichtig? Der Bundestrojaner wird, das haben wir eben klar
gemacht, interaktiv auf Kommandos von draußen hören müssen und er wird
falsch beschrifteten und verstrahlten Bitmüll auf lokalen Festplatten
analysieren und zerlegen müssen, damit er ihn nach verdächtigen Daten
durchsuchen kann. Der Bundestrojaner wird zwangsläufig eine ebenso große
Fehlerquelle sein wie Wireshark, weil er dasselbe Problem zu lösen hat. Ein
sehr schwieriges Problem! Und im Gegensatz zu Wireshark wird der
Bundestrojaner nicht von einer große Menge Open Source Programmierern ohne
Druck einer Deadline entwickelt, sondern von einer Privatfirma im
Staatsauftrag unter Zeitdruck aus Halbfertigkomponenten zusammengeschwartet,
die für einen ursprünglich ganz anderen Zweck entwickelt worden sind.

### Konsequenz aus der Verwundbarkeit

Bleibt der Bundestrojaner unentdeckt? Nein! Davon müssen wir zwangsläufig
ausgehen. Entweder wird er unter halsbrecherischen Umständen nach Bedarf
installiert und so dem ersten Systemadministrator auffallen, der ein wenig
mehr als die übliche Paranoia auf seinen Systemen walten läßt, oder er wird
auf so vielen Systemen "auf Vorrat" installiert sein, daß jeder ihn irgendwo
auf seiner Kiste hat. Der Bundestrojaner wird, wenn er erst einmal entdeckt
worden ist, das bestuntersuchte Programm sein, daß deutsche Hacker jemals in
die Finger bekommen haben.

Wenn er dann wirklich auf Vorrat installiert worden ist und entfernt
ausnutzbare Schwächen hat (die er wegen seiner Natur zwangsläufig haben
muß), dann hat unser Staat auf Computern von Millionen seiner Bürger eine
Backdoor installiert, die nun von jedem Spammer und Botnet-Betreiber
weltweit sofort und ohne große Probleme ausnutzbar ist. Ich rechne fest mit
einer Schadensersatzklage, die unsere Republik bis in die Grundfesten
erschüttern wird und mit einem nationalen Sicherheitsnotstand. Deutsche
Telekom wird das nationale DSL Notabschalten müssen, um Schlimmeres zu
verhindern. Nein, ich sehe das nicht als "ob", sondern nur als "wann"-Frage.

### Wäre der Bundestrojaner wirksam?

Mal angenommen, unsere Regierung wäre nicht nur vertrauenswürdig, sondern
die Entwickler des Bundestrojaners wären auch unerwartet fähig, sodaß es
nicht zu dieser Situation kommt. Der Bundestrojaner befindet sich also auf
einem durchschnittlichen Straftätersystem, etwa 5 Jahre von hier ab in der
Zukunft und will Dinge scannen und dann zum Staatsanwalt uppen. Dank
[VDSL](http://de.wikipedia.org/wiki/VDSL2) sei das gar kein Problem.

Was sind aktuelle Themen in der Computertechnik, die dem Bundestrojaner in
die Quere kommen können?

Der Bundestrojaner muß das System, auf dem er läuft verändern und, damit er
effektiv ist, auf alle Dateien im System zugreifen können. Auch auf
geschützte Dateien. Damit kollidiert er zwangsläufig mit
[DRM](http://de.wikipedia.org/wiki/Digitale_Rechteverwaltung#Zugangssteuerung)-Mechanismen,
die das genau verhindern wollen und sollen. Es kann sogar sein, daß der
Bundestrojaner sich so verrät, oder daß dem Eigentümer des Systems durch den
Zugriff des Bundestrojaners Kosten entstehen. Der Sinn von
[Trusted Computing](http://de.wikipedia.org/wiki/Trusted_Computing)
Umgebungen ist es genau, eine verifizierte Systeminstallation zu haben, in
der sich Software nicht verstecken kann und nicht an den
Zugriffskontrollmechanismen des Betriebssystems vorbei auf Daten zugreifen
kann.

Der Bundestrojaner läuft unter Umständen gar nicht auf einem realen System
und sieht unter Umständen gar keine realen Dateien. Immer mehr Benutzer -
auch Heimanwender - gehen dazu über, statt eines Rechners durch
[Virtualisierung](http://de.wikipedia.org/wiki/Virtualisierung_(Informatik))
eine Reihe von simulierten virtuellen Rechnern laufen zu lassen, die jeweils
mit beschränkten Datenmengen oder beschränkten Rechten ausgestattet sind. Es
ist also für den Bediener eines Bundestrojaners gar nicht einfach möglich,
festzustellen, auf welcher System- oder Rechteebene er sich befindet und ob
die Daten, die er da zu sehen bekommt, real oder vollständig sind. Je nach
verwendeter Virtualisierungsschicht bekommt er offensichtlich simulierte
Hardware zu sehen oder die Identifikationen der real verwendeten Hardware
werden durchgereicht, aber der Zugriff auf die Hardware erfolgt nicht real,
sondern durch die Virtualisierungsschicht gefiltert.

### Das hier ist also der Deal

Der Deal ist also wie folgt: Weil einige Staatsorgane den heimlichen Zugriff
auf meine Hardware fordern, will der Staat das möglicherweise noch
vorhandene Restvertrauen zwischen ihm und mir komplett ruinieren. Ich muß in
Zukunft also davon ausgehen, daß jede staatlich bereitgestellte Software
nicht nur die angepriesenen Funktionen hat, sondern auch noch die staatliche
Hintertür auf Vorrat mitbringt.

Im Austausch bekommt der Staat einen Mechanismus, der für den angepriesenen
Zweck vorab erkennbar ungeeignet ist, weil er die notwendigen Richtlinien
zur gerichtsfesten Beweiserbringung nach Definition nicht erfüllen kann. Der
Staat riskiert außerdem die Sicherheit seiner gesamten DV-Infrastruktur,
bundesweit, seine eigenen Systeme eingeschlossen.

Und das ist die Sachlage noch vor jedem politischen Argument dafür oder
dagegen.
