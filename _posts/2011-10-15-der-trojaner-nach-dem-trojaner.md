---
layout: post
published: true
title: Der Trojaner nach dem Trojaner
author-id: isotopp
date: 2011-10-15 10:56:58 UTC
tags:
- computer
- politik
- security
- lang_de
feature-img: assets/img/background/rijksmuseum.jpg
---
Ich bin Informatiker, kein Jurist. Die Juristen und Verwaltungsmenschen, die
ich kenne, haben mich jedoch gelehrt, daß Menschen in Deutschland
Handlungsfreiheit haben - sie können tun, was immer sie wollen, solange dem
nicht ein Verbot durch ein Gesetz entgegensteht. Dem Staate jedoch, so
erklärten sie mir, ist diese Freiheit nicht gegeben: Grundlage allen
staatlichen Handelns muß ein Gesetz sein.

![](/uploads/rechtsfreier_raum.png)

Darum ist der von der Firma Digitask im Auftrag der bayrischen
Staatsregierung entwickelte und 
[nahezu bundesweit eingesetzte](http://0zapftis.info/) 
Staatstrojaner so ein Problem: Die rechtliche Grundlage für seinen Einsatz
ist nämlich mindestens strittig, wenn nicht sogar offensichtlich nicht
gegeben.

Das Urteil des Bundesverfassungsgerichtes vom 
[27. Februar 2008](http://www.bverfg.de/entscheidungen/rs20080227_1bvr037007.html) 
setzt dem Ganzen recht enge Grenzen. Es definiert ein neues "Grundrecht auf
Gewährleistung der Vertraulichkeit und Integrität informationstechnischer
Systeme" als mittelbares Grundrecht, das seine Grundlage aus dem allgemeinen
Persönlichkeitsrecht zieht, und schränkt die Anwendung einer
"Online-Durchsuchung" (eigentlich: verdeckter Einbruch und heimliche
Ausforschung - eine
[Durchsuchung](http://de.wikipedia.org/wiki/Durchsuchung_(Recht)#Hausdurchsuchung)
erfolgt unter Zeugen und mit Wissen des Durchsuchten!) stark ein.

Zugleich öffnet das Urteil in Leitsatz 4 die Tür zur Möglichkeit der 
[Quellen-Telekommunikationsüberwachung](http://de.wikipedia.org/wiki/Telekommunikations%C3%BCberwachung#Quellen-Telekommunikations.C3.BCberwachung), 
wobei die Frage ist, ob es so etwas überhaupt geben kann: 

> 4. Soweit eine Ermächtigung sich auf eine staatliche Maßnahme beschränkt,
> durch welche die Inhalte und Umstände der laufenden Telekommunikation im
> Rechnernetz erhoben oder darauf bezogene Daten ausgewertet werden, ist der
> Eingriff an [Art. 10 Abs. 1 GG](http://dejure.org/gesetze/GG/10.html) zu
> messen. [...]

(Artikel 10 GG definiert das Fernmeldegeheimnis und seine Grenzen).

Der vom Chaos Computer Club 
[analysierte und aufgedeckte Staatstrojaner](http://ccc.de/de/updates/2011/staatstrojaner) 
geht in seinen Möglichkeiten weit über eine Telekommunikationsüberwachung
hinaus: Er bietet Möglichkeiten, beliebige Dateien vom Zielrechner herunter
oder dort hin hoch zu laden und starten, er kann Bildschirmfotos machen oder
Mikrofon und Kamera des Rechners zur Raumüberwachung nutzen.

Der CCC zieht das Fazit: 

> Die von den Behörden so gern suggerierte strikte Trennung von genehmigt
> abhörbarer Telekommunikation und der zu schützenden digitalen Intimsphäre
> existiert in der Praxis nicht. Der Richtervorbehalt kann schon insofern
> nicht vor einem Eingriff in den privaten Kernbereich schützen, als die
> Daten unmittelbar aus diesem Bereich der digitalen Intimsphäre erhoben
> werden.

Das heißt, daß dieses Programm mehr tun kann, als im Rahmen einer
fragwürdigen Quellen-Telekommunikationsüberwachung erlaubt ist - und daß die
Behörden diese weitergehenden Funktionen auch benutzt haben.

Das Landgericht Landshut hat am 
[25. Januar 2011](http://ijure.org/wp/wp-content/uploads/2011/01/LG_Landshut_4_Qs_346-101.pdf) (PDF) 
klargestellt, daß dies rechtswidrig ist. Dennoch hat das Land Bayern im
vollen Wissen dieser Rechtswidrigkeit im Jahr 2011 genau diese Software 
[in 12 weiteren Fällen eingesetzt](http://www.internet-law.de/2011/10/bayerntrojaner-behorden-setzen-sich-gezielt-uber-das-recht-hinweg.html).

![](/uploads/ext2-enc1-A.bmp_.jpg)

Eine Bitmap mit Zeichen, nach AES-ECB Verschlüsselung 
(Was siehst Du hier? [Erläuterungen](http://opensource.dyc.edu/random-vs-encrypted))

Die Untersuchung des CCC zeigt auch, daß die eingesetzte Software nicht nur
rechtlich mangelhaft aufgestellt ist, sondern auch nach den Kriterien der
Informatik schwere handwerkliche Mängel aufweist: 

- Der Kommandokanal, mit dem Steuerbefehle an die Software gesendet werden
  kann, ist weder verschlüsselt noch authentisiert (Ja, es gibt nicht mal
  ein Klartext-Login - jedes Kommando, das irgendwer an diese Software
  sendet kann, wird ungeprüft ausgeführt).
- Der Rückkanal mit den ausgelesenen Daten ist mangelhaft
  verschlüsselt - es wird AES (ein im Grunde guter Algorithmus) im
  [ECB-Modus](http://blog.koehntopp.de/archives/3081-Einige-kryptographische-Grundlagen.html)
  (eine hirntote Betriebsart diese Verfahrens) verwendet. Warum das eine
  schlechte Idee ist, erläutert 
  [dieser Artikel über dmcrypt](http://opensource.dyc.edu/random-vs-encrypted) 
  sehr elegant und anschaulich, indem Bitmaps mit Buchstaben verschlüsselt werden - dadurch
  wird auch in der verschlüsselten Datei noch enthaltene Restinformation gut
  sichtbar gemacht.
- Noch dazu wird jeder von dem Spionageprozeß
  befallene Prozeß mit Privilegien ausgestattet, sodaß das ohne Paßwort
  gesicherte Abhör-Einfallstor zu einer echten Gefahr für die Systemsicherheit
  wird.

Wie kann es zu so einem Fiasko kommen? Und dann noch ausgerechnet ausgehend
in Bayern - das bayrische LKA ist doch angeblich so umfassend IT-kompetent
und technisch in Deutschland im Bereich Internet-Ermittlungen führend!

Die Antwort gibt die 
[Regierungspressekonferenz vom 12. Oktober](http://www.bundesregierung.de/nn_774/Content/DE/Mitschrift/Pressekonferenzen/2011/10/2011-10-12-regpk.html): 
Das bayrische LKA ist führend in dem Sinne, daß unter den Blinden der Einäugige König ist.

> Die Sprecher des Finanzministeriums und des Innenministeriums mussten in
> der Bundespressekonferenz Rede und Antwort zum Skandal um den
> Staatstrojaner stehen. [...]
> 
> Frage: [...] Existiert in den Bundesbehörden eigentlich die Expertise,
> solche Software selber herzustellen oder, wenn sie in Auftrag gegeben und
> eingekauft wurde, dann auch zu kontrollieren und zu wissen, was diese
> Software kann oder nicht kann?
> 
> Teschke: Ich kann zu dem einen Teil Ihrer Frage, nämlich zum Test, etwas
> sagen: Diese Software wird jeweils für die Maßnahme speziell konfiguriert
> und wird dann getestet, ob sie nur das kann, was vorgesehen ist. Das kann
> ich dazu sagen. Sie wird eingekauft. Es besteht also zunächst einmal im
> Haus selber kein Know-how.
> 
> [...]
> 
> Frage: Wenn Sie hausintern in der Lage sind, aus den vorhandenen
> Softwareblöcken etwas zu machen, was "tailor-made" genau nur für diesen
> Fall passt, und wenn Sie auch in der Lage sind, zu überprüfen, dass alles
> andere nicht geht, dann müssen Sie doch das Fachwissen für diese Trojaner
> im Haus haben. Die Darstellung widerspricht sich meiner Meinung nach. Sie
> haben gerade gesagt, die Expertise für solche Trojaner sei im Haus nicht
> vorhanden.
> 
> Teschke: Die Expertise, ein gesamtes Programm zu programmieren, ist nicht
> vorhanden. Deswegen kaufen wir sie ein. Deswegen haben wir ein Basispaket,
> wo wir sagen: Du musst das können, und du musst das können. Das wird
> getestet. Das wird im Beisein der jeweiligen Behörden getestet. Man fragt:
> Kann das Programm das, was wir erwarten? Dann macht es das. Dieser Test
> wird uns vorgelegt. Dann gehen wir davon aus, dass die Software das kann.
> Das ist die eine Sicherheitsmaßnahme.
> 
> [...]
> 
> Zusatzfrage: Das heißt, dass Sie, was die Möglichkeiten eines Trojaners
> oder eines Programms angeht ? Sie sagen: Das wird uns dann gezeigt ?, auf
> das Expertenwissen der Macher angewiesen sind und dass Sie zweitens nicht
> das Programm in Gänze verstehen, sondern nur die Konfektionierung und
> Ihnen die anwendbaren Teile so gezeigt werden, dass es geht.
> 
> Teschke: Ja.

Mit anderen Worten: Bayern kauft da Sachen von einer Privatfirma ein, guckt
sich das dann von außen an, und glaubt, daß diese Software, die in die
absolute Intimsphäre eines Bürgers eindringen kann, genau das und nur das
tut, was die Herstellerfirma behauptet, ohne im mindesten zu verstehen, was
diese Software tut, wie sie das tut, und welche Nebenwirkungen sie hat.

Genau genommen hat man 
[noch nicht einmal genug Fachwissen](http://de.wikipedia.org/wiki/Dunning-Kruger-Effekt), 
um sich vorstellen zu können, welche Nebenwirkungen und Komplikationen es
geben könnte oder warum das ein Problem ist.

Nun ist Gottvertrauen ja eine sehr bayrische Sache, aber in dieser
Angelegenheit nachweislich weder opportun noch ausreichend.

Der "Bundestrojaner" und die "Quellen-Telekommunikationsüberwachung" sind
nun trotz dieses systemweiten Versagens von Politik und Technik noch immer
nicht am Ende. Wer 
[die Phönix-Runde](http://www.youtube.com/watch?v=j6xuRfdzVG0) 
zum Thema gesehen hat, der versteht, daß die einschlägig bekannten
innenpolitischen Scharfmacher dies eher als Signal zum Aufbruch sehen und
diesmal rechtliche Nägel mit Köpfen machen wollen, und wenn sie dazu die
Verfassung niederreißen müssen (Nichtpiratischer Lichtblick: 
[Peter Altmaier](http://www.faz.net/aktuell/feuilleton/debatten/digitales-denken/politik-und-internet-mein-neues-leben-unter-piraten-11493287.html),
der schon 
[bei Anne Will](http://www.youtube.com/watch?v=toxXrqS6-DQ)
unerwartet positiv auffiel).

Halten wir also einmal inne, und überlegen uns, wie ein Bundestrojaner 2011
denn wohl aussehen könnte, wenn man ihn 'richtig' machen wollte. Wie sind
die Ausgangsbedingungen?

In 2011 hat ein Ziel-Subjekt wahrscheinlich einen Rechner mit einer 64-Bit
Variante von Windows, bald sogar ein 64 Bit-Windows 
[mit UEFI](http://www.heise.de/ct/hotline/FAQ-Unified-Extensible-Firmware-Interface-1082020.html).
Ein solcher Rechner startet 
[im Secure Boot](http://www.heise.de/ct/meldung/Windows-8-Secure-Boot-mit-UEFI-2-3-1-1334957.html)
und führt danach auf Systemebene nur signierte Betriebssystem-Komponenten
aus. Seine Platte ist verschlüsselt. Um in ein solches System einzudringen
braucht man entweder eine ganze Menge technisches Knowhow, das das
Wissenslevel der Behörden offensichtlich übersteigt (siehe oben), oder man
braucht die Kooperation des Systemherstellers.

Andere Bedarfsträger sind 
[diesen Weg schon vor langer Zeit gegangen](http://en.wikipedia.org/wiki/NSAKEY)
(inklusive Dementi!). Es wird jedoch bei einigem Nachdenken relativ schnell
klar, daß dieses Verfahren auf verschiedene Weise nicht skaliert:

- Der Hersteller hat ein Interesse daran, daß die Verfahren zur
  Herstellung von Systemsicherheit in seinem Betriebssystem funktionsfähig
  und leistungsfähig sind. Wären sie es nicht, könnte sein System nicht in
  sicherheitskritischen Umgebungen eingesetzt werden.
- Wenn man die Systemsicherheit eines so geschützten Systems also
  kompromittieren will, dann wird man das aller Wahrscheinlichkeit nach
  nicht ad-hoc tun können (denn das wäre eine ausnutzbare Schwäche), sondern
  über eine ab Werk eingebaute Hintertür tun müssen. Dann handelt es sich
  nicht um eine beliebig ausnutzbare Schwäche, sondern um einen
  kontrollierten, geheimen Systemzugang, eine Hintertür eben.
- _Eine_ Hintertür ist aber bei weitem nicht genug, denn es wollen eine
  Menge Bedarfsträger auf das System, und sie wollen auf das System, ohne
  daß der Hersteller oder andere Bedarfsträger im Einzelfall wissen, bei wem
  sie wann aus welchen Gründen auf das System wollen. Die Hintertür kann
  also nicht durch den Hersteller im Einzelfall verwaltet werden.
- Es ist auch nicht kontrollierbar, welche Zivilperson welche nationale oder
  regionale Version eines Systems einsetzt, daher müßten alle Hintertüren in
  allen Versionen des Systems immer vorhanden sein. Fat Chance, haha.
- Im Endeffekt bekäme man also etwas, das in der Sicherheit und Organisation 
  dem SSL-Signatursystem sehr vergleichbar wäre, und dessen Sicherheit für 
  keinen der Bedarfsträger akzeptabel ist.

Damit sind wir dann wieder bei Null, beziehungsweise
[landen](http://www.fitug.de/debate/0305/msg00270.html) dann
[hier](http://www.mail-archive.com/cryptography@wasabisystems.com/msg02526.html).

Oder wir nehmen eine Umgebung an, die weiterhin so leicht kompromittierbar
ist wie existierende Systeme, und auf denen sich neben der Software
irgendwelcher Bedarfsträger auch weiterhin Spyware, Keylogger und andere
Zusatzprogramme der organisierten Kriminalität tummeln. Der Unterschied
zwischen denen und der Software meiner Regierung ist ja offensichtlich nur
die Zieladresse, an der die Daten abgeliefert werden und die Qualität der
Implementierung - jedem Spyware-Schreiber wäre das Digitask-Ding mehr als
peinlich.

Wie dem auch sei: Nachdem sich unsere Bundes- und Landeskriminalämter, Zoll,
BND und Politik jetzt erst einmal global blamiert haben, fängt der
interessante Teil der Entwicklung gerade erst an. Denn auf der einen Seite
wollen wir, daß 'die Guten' sichere und unkompromittierbare Systeme haben.
Auf der anderen Seite wollen ein Haufen Bedarfsträger die Systeme von 'den
Bösen' zuverlässig und ohne viel Aufwand und Aufsehen kompromittieren
können. Und leider sind die Definitionen von Gut und Böse je nach Standpunkt
und Aufgabe austauschbar und Rollen überlappen sich.

[Party Time, Excellent!!!](http://www.youtube.com/watch?v=g-CFIO-fCt8) 

Inhaber von Popcornaktien können jedenfalls gestärkt in die Zukunft blicken.
