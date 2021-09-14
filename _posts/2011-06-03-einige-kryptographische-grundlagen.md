---
layout: post
published: true
title: Einige kryptographische Grundlagen
author-id: isotopp
date: 2011-06-03 14:54:32 UTC
tags:
- kryptographie
- security
- lang_de
feature-img: assets/img/background/rijksmuseum.jpg
---
Heute gibt es hier alten Scheiß: Vor vielen Jahren, in einem anderen Leben,
habe ich im Rahmen der Ausbildung von Auszubildenden und Neuanstellungen
eine Reihe von Slides produziert, die einige Grundlagen der Kryptographie
erläutern, ohne daß das Ganze übermäßig mathematisch werden würde. Den Text
zu diesem Vortrag habe ich nie veröffentlicht, das hole ich hier einmal
nach.

Ziel des Textes war es einmal, den Leuten bestimmte kryptographische
Primitive und ihre Anwendung deutlich zu machen sowie die Rechtslage mit der
Technik zu verknüpfen.

Weil ich uns allen die Mathematik erspart habe, muß man einige Annahmen
glauben, anstatt sich durch die entsprechenden mathematischen Beweise zu
kämpfen. Und zwar muß man glauben, daß es Algorithmen gibt, die in einer
Richtung leicht und mit wenig Aufwand durchzuführen sind (etwa die
Multiplikation einiger Zahlen), aber in der umgekehrten Richtung sehr
aufwendig sind, weil keine Abkürzung existiert (etwa die Umkehrung einer
Multiplikation: die Bestimmung der unbekannten Faktoren, die ein bestimmtes
bekanntes Multiplikationsergebnis ergeben).

Mit Hilfe solcher Algorithmen kann man dann Verschlüsselungssysteme bauen.

Die Mathematik, die dem zugrunde liegt, ist von den Mathematikern auch sehr
gut verstanden und allgemein bekannt und untersucht. In der Regel ist es
auch nicht die Mathematik, die defekt ist, wenn ein Kryptosystem gehackt
wird, sondern es ist die umgebende Infrastruktur, die kaputt geht:
Zufallszahlengeneratoren, die keine zufälligen Zahlen produzieren oder
Verwaltungssysteme für geheime Schlüssel, die geheimzuhaltende Daten
herausgeben. Oder halt der Fehler, sich selbst einen
Verschlüsselungsalgorithmus auszudenken ohne die entsprechende Mathematik zu
beherrschen.


![](/uploads/kryptogrundlagen/img0.png)

Aber von vorne:

Eine der Grundaufgaben in der Kryptographie ist ein Sender, Andreas, der
einer Empfängerin, Birgit, eine Nachricht senden möchte, ohne daß Dritte
mithören können. Die Nachricht wird als Message (M) bezeichnet.
Verschlüsselt wird sie mit einer Verschlüsselungsfunktion, die allgemein
bekannt und gut untersucht ist, und diese Funktion braucht einen geheimen
Schlüssel, den Key (K).

Mathematiker sind faule Säue, sie können sich nicht einmal aufraffen,
Multiplikationspunkte zu schreiben (und schreiben also A*B einfach als AB).
Entsprechend sollten sie die Formel C = f(K, M) (der verschlüsselte
Ciphertext C ergibt sich aus der Anwendung der Verschlüsselungsfunktion f,
die die Nachricht M und den Schlüssel K als Parameter hat) schreiben.
Stattdessen notieren sie oft falsch C = K(M), als ob K eine Funktion und
nicht der Schlüssel wäre.


![](/uploads/kryptogrundlagen/img1.png)

Andreas verschlüsselt seine Nachricht an Birgit, weil er sich bedroht fühlt. 

Wenn man sich mit Sicherheitsdingen beschäftigt, ist es wichtig, diese
Bedrohung auszuformulieren und die Ziele und Fähigkeiten des Angreifers zu
benennen. Nur aus diesen Listen kann man die Gefahren ableiten und dann
sagen, ob bestimmte vorgeschlagene Maßnahmen eine sinnvolle Abwehr gegen
die Bedrohung darstellen oder nicht.

Man kann diesen Effekt gar nicht genug betonen: Wenn man sich mit Laien
(oder in der Politik) über Bedrohungen unterhält, dann diskutieren diese
Sicherheit oftmals in den Begriffen von Maßnahmen, anstatt über Angreifer,
Bedrohungen, Eintrittswahrscheinlichkeiten und Schadenshöhen zu reden und
die Maßnahmen anhang dieser Dinge auszuwählen oder zu bewerten. Das erzeugt
dann jede Menge operative Hektik, verbessert die Sicherheit aber in der
Regel kein Stück.

Das Schutzziel eines Kryptosystems ist gewissermaßen das Gegenteil eines
Angriffes:

Ein Kryptosystem kann das Ziel haben, den Inhalt einer Nachricht geheim zu
halten, d.h. nur der Absender und der Empfänger einer Nachricht können ihren
Inhalt kennen, Dritte nicht. Eine schwächere Forderung wäre, eine Nachricht
integer zu halten, also Veränderungen der Nachricht durch Dritte erkennbar
zu machen. Eine stärkere Forderung wäre, nicht nur den Inhalt einer
Nachricht vertraulich zu halten, sondern die Tatsache, daß zwei bestimmte
Personen überhaupt miteinander kommuniziert haben zu verbergen -
Unbeobachtbarkeit.

Man kann fordern, die Identitäten des Senders und des Empfängers voreinander
zu verbergen - dann hat man Anonymität. Oder man kann fordern, daß die
Identitäten des Senders und des Empfängers beweisbar bekannt und unfälschbar
sind, dann bekommt man Authentizität.

Man kann fordern, daß ein System durch gefälschte oder defekte Nachrichten
nicht offline gezwungen werden kann, daß es also verfügbar bleibt.

Angreifer können versuchen, diese Schutzziele zu vereiteln, etwa indem man
ihnen die Fähigkeit zugesteht, die Kommunikation mitzuhören, mitgehörte
Nachrichten wiederholt abzusenden, Nachrichten zu verändern, sich in die
Kommunikationskette zwischen Sender und Empfänger einzuschleichen und sich
für die jeweilige Gegenstelle auszugeben, oder indem sie versuchen, die
Kommunikation zwischen den beiden Parteien zu unterbrechen.

Man kann sehr starke Angreifer konstruieren, indem man ihnen die Fähigkeit
zugesteht, die Hardware oder Systemsoftware des Senders oder des Empfängers
von diesem unbemerkt zu verändern.

Und man muß Einsatzzwecke von Kryptographie unterscheiden: Es besteht ein
grundlegender Unterschied in den Anforderungen zwischen
Transportverschlüsselung (etwa das Abrufen von Webseiten über SSL) und
Speicherverschlüsselung (etwa dem Ablegen von Dateien auf einer
verschlüsselten Festplatte).

Bei Transportverschlüsselung hat man in der Regel die Anforderung, daß es
keine 'Key Recovery' geben darf - nur der Sender und der Empfänger sollen
den vereinbarten Schlüssel K kennen.

Bei Speicherverschlüsselung dagegen hat man vielfach weitergehende
Anforderungen. Ein Arbeitgeber zum Beispiel wird auf den Laptops seiner
Mitarbeiter nicht Festplattenverschlüsselung ausrollen können, wenn er nicht
die Möglichkeit hat, auch ohne Kooperation des Mitarbeiters auf dessen
dienstliche Daten zugreifen zu können. Ohne diese Möglichkeit besteht sonst
die Gefahr, daß betriebskritische Daten für die Firma nicht mehr im Zugriff
sind, wenn der Mitarbeiter erkrankt oder sonstwie nicht mehr verfügbar ist.
Diese Situation ist für eine Firma klar nicht akzeptabel, daher müssen
solche Systeme immer "Key Recovery" erlauben, also eine "Hintertür" haben,
die - und das ist der entscheidende Punkt - unter der Kontrolle der Firma
steht.

Speicherverschlüsselung ohne Key Recovery ist wertlos, und das entscheidende
Merkmal bei der Diskussion über Key Recovery ist nicht, daß sie existiert,
sondern wer die Kontrolle über die Recovery Keys hat.


![](/uploads/kryptogrundlagen/img2.png)

Auguste Kerckhoffs hat 1883 das 
[Kerckhoffsche Prinzip](http://de.wikipedia.org/wiki/Kerckhoffs%E2%80%99_Prinzip)
formuliert. Kerckhoffs war ein früher Kryptograph, und hat kryptographische
Verfahren untersucht und eine Reihe von Anforderungen an Kryptosysteme
formuliert.

In einer modernen Formulierung besagt das Kerckhoffsche Prinzip, daß die
Sicherheit eines Kryptosystems nicht von der Geheimhaltung des verwendeten
Algorithmus abhängen darf, sondern nur von der Geheimhaltung der verwendeten
Schlüssel abhängen darf.

In einer schärferen Formulierung kann man sogar sagen, daß ein Kryptosystem,
dessen Algorithmen nicht allgemein bekannt und durch viele anerkannte
Kryptographen untersucht und bestätigt worden sind wahrscheinlich unsicher
ist und nicht verwendet werden sollte.

Wir können nach dem heutigen Stand der Mathematik nicht beweisen, daß ein
Algorithmus unangreifbar ist. Wir können lediglich unsere hellsten Köpfe auf
einen Algorithmus loslassen. Wenn die dann alle scheitern (und was das
bedeutet klären wir gleich), dann ist der Algorithmus wahrscheinlich zur
Zeit sicher.

Es gibt in der Geschichte der Kryptographie eine ganze Menge Beispiele für
recht prominent selbstgekochte Kryptosysteme, bei denen die Algorithmen
nicht ausreichend untersucht worden sind und die sich dann im Nachhinein
nicht als sicher erwiesen haben.

Das 
[CSS](http://en.wikipedia.org/wiki/Content_Scramble_System#Cryptanalysis)-System
zur Verschlüsselung von DVD-Inhalten ist zum Beispiel ein solches System:
Nicht nur ist seine Schlüssellänge mit 40 Bit sowieso zu kurz, sondern durch
eine Analyse des Algorithmus, die bei der Erschaffung von CSS nicht
ausreichend durchgeführt worden ist, ist es gelungen, die effektive
Schlüssellänge dieser 40 Bit auf 16 Bit zu reduzieren. Damit ist aber ein
Angriff auf CSS mit trivialer Rechenleistung möglich und CSS ist in etwa
genau so sicher wie Klartext.

Ein anderes Beispiel ist der vom GSM-Konsortium selbstgekochte 
[A5](http://en.wikipedia.org/wiki/A5/1#Security) Algorithmus, mit dem einige
Mobilfunkbetreiber GSM-Kommunikation verschlüsselt haben, statt einen
anerkannten Algorithmus zu nehmen. Auch die verschiedenen Varianten von A5
sind gebrochen worden und mit diesen (inzwischen nicht mehr verwendeten)
Algorithmen verschlüsselte Kommunikation ist abhörbar geworden.

Jedes Verschlüsselungsverfahren läßt sich brechen, indem man einfach alle
möglichen Schlüssel durchprobiert. Diesen Angriff nennt man einen 'brute
force'-Angriff. Damit er gelingen kann, müssen zwei Dinge gelten:

Einmal muß man überhaupt mitbekommen, daß man fertig ist.

Bei einem Brute Force-Angriff entschlüsselt man eine verschlüsselte
Nachricht (also unlesbaren Bitsalat) mit dem falschen Schlüssel (bekommt
also anderen unlesbaren Bitsalat). Erwischt man zufällig den korrekten
Schlüssel, bekommt man lesbaren Text - und muß diese Situation erkennen. Das
heißt, es hilft, wenn man ein wenig über den Klartext weiß ('es handet sich
um englischen Text', 'am Ende des Textes ist eine CRC32 Prüfsumme über alle
vorhergehenden Bytes und wenn die Prüfsumme aufgeht, ist die Nachricht
korrekt').

Hat man solches Wissen nicht, muß man raten - etwa wenn die Nachricht nur
gültige Zeichen in dem und dem Zeichensatz enthält und die relativen
Häufigkeiten der Buchstaben in etwa dem Muster englischer Sprache
entsprechen, dann ist die Nachricht möglicherweise korrekt entschlüsselt
worden und man legt sie einem Operator zur Kontrolle vor.

Im zweiten Weltkrieg zum Beispiel haben die Engländer die mit der Engima
verschlüsselten Nachrichten deutscher U-Boote abgefangen. Diese U-Boote
haben wichtige Nachrichten mit dem Flottenkommando ausgetauscht, aber auch
Wetternachrichten an das Kommando zurück gesendet. Diese Wetternachrichten
waren jedoch mit demselben Schlüssel verschlüsselt, der auch für andere
wichtige Nachrichten verwendet worden ist.

Wenn man nun also das Wetter an der Position des U-Bootes kennt und weiß,
wie ein militärischer Wetterbericht abgefaßt wird, dann kann man den Klartext
der Wettermeldung des U-Bootes recht gut vorhersagen und hat eine gute
Stop-Bedingung für einen Brute Force-Angriff.

Zum anderen muß man fertig werden können. Das heißt, der Schlüsselraum (alle
möglichen K) muß klein genug sein, daß man im Verhältnis zur
Arbeitsgeschwindigkeit seiner Entschlüsselungsmaschine die Möglichkeit hat,
alle Schlüssel in einem gegebenen Zeitrahmen durchzuprobieren.

Wenn man weiß, daß die Nachricht etwa das Datum des Angriffes eines Gegners
enthält ('Angriff im Morgengrauen!'), dann ist die Nachricht wertlos,
nachdem der Angriff des Gegners erfolgt ist. Ist der Schlüsselraum so groß,
daß es unmöglich ist, die verschlüsselte abgefangene Nachricht vor dem
Morgengrauen zu entschlüsseln, indem man alle möglichen Schlüssel
durchprobiert, dann ist das Verfahren _sicher_.

Man muß also die Schlüssellänge so wählen, daß sie der benötigten
Schutzfrist gegen einen Brute Force-Angriff genügt. Angenommen, man hätte
[1933](http://de.wikipedia.org/wiki/Reichstagswahl_1933) elektronisch wählen
können und jemand hätte die Wahlnachrichten mit Absenderkennungen damals
aufzeichnen, aber nicht entschlüsseln können - wie lange muß ein solches
System die Nachrichten dann also gegen Brute Force schützen können
(technologischen Fortschritt eingerechnet)? Muß ein militärisches System für
taktische Kommunikation ('Angriff im Morgengrauen') oder ein elektronisches
Wahlsystem sicherer sein? Wieviel sicherer?

Genau.

Darum haben wir keine Wahlcomputer und keine elektronischen Wahlen über
Netzwerk.

Wenn es neben dem Brute Force-Angriff noch andere Methoden gibt, mit denen
man den Schlüssel K ermitteln kann und diese anderen Methoden effizienter
sind als Brute Force, dann gilt das System als _gebrochen_.

Man beachte, daß das etwas anderes ist als _unsicher_. Es gibt unsichere
Systeme, die nicht gebrochen sind - DES ist so etwas zum Beispiel. DES ist
ein Verfahren mit einer Schlüssellänge von nur 56 Bit, und die
[EFF](http://www.eff.org) hat 1998 den Spezialrechner 
[Deep Crack](http://en.wikipedia.org/wiki/EFF_DES_cracker) gebaut, um DES in
wenigen Stunden zu brute forcen. DES ist aber nicht gebrochen - es ist kein
Verfahren bekannt, mit dem es möglich wäre, die 2^56 Schlüssel abzukürzen.
Daher kann man unsichere DES noch verwenden, um das
[sichere](http://en.wikipedia.org/wiki/Triple_DES#Security) und ungebrochene 
[Triple DES](http://en.wikipedia.org/wiki/EFF_DES_cracker) zu konstruieren.

Andererseits existiert der DES-Nachfolger 
[AES](http://en.wikipedia.org/wiki/Advanced_Encryption_Standard). AES 256
hat einen K-Raum mit 2^256 Einträgen, aber AES ist
[gebrochen](http://en.wikipedia.org/wiki/Advanced_Encryption_Standard#Known_attacks) -
der K-Raum ist auf 2^200 Einträge reduziert, also kleiner als Brute Force.
Allerdings ist diese Zahl immer noch zu groß, daß der Algorithmus als sicher
gilt.


![](/uploads/kryptogrundlagen/img3.png)

DES und AES sind beides symmetrische Verfahren. Das sind Verfahren, bei
denen man eine Nachricht mit demselben Schlüssel entschlüsseln kann, den man
zur Verschlüsselung verwendet. Man bekommt also den Ciphertext C = K(M), und
indem man K noch einmal anwendet, bekommt man die Nachricht zurück: M =
K(C), d.h. M = K(K(M)).

Symmetrische Verfahren haben vergleichsweise kurze Schlüssel: das unsichere
DES hat nur 56 Bit, das sichere 3DES hat 112 Bit und AES sollte man mit 256
Bit betreiben, damit es sicher ist. Da die Laufzeit eines
Verschlüsselungsalgorithmus in vielen Fällen proportional zur Länge der
Schlüssel ist, sind die meisten symmetrischen Verfahren relativ schnell -
speziell AES ist außerdem auch so entwickelt worden, daß es sich auf heute
üblichen Prozessoren leicht implementieren läßt und ist daher sehr gut
geeignet, wenn es auf Geschwindigkeit ankommt.

Das Hauptproblem von symmetrischen Verfahren ist, daß sich der Sender und
der Empfänger auf einen Schlüssel einigen müssen. Wie kommt der Schlüssel K,
mit dem Andreas seine Nachrichten an Birgit verschlüsselt, zu Birgit, wenn
Andreas doch der Strecke zwischen Andreas und Birgit nicht trauen kann?

Manchmal kann man das Problem dadurch lösen, daß der Schlüssel so angenehm
kurz ist: Nehmen wir an, daß Andreas seiner Internet-Verbindung zu Birgit
nicht traut, aber seiner Telefonverbindung - dies nennen wir einen sicheren
Kanal.

Eine Eigenschaft von sicheren Kanälen ist, daß ihre Kapaziät oft begrenzt
ist - entweder in der Menge oder in der Zeit, zu der sie verfügbar sind.

Zum Beispiel ist es für Andreas nicht möglich, Birgit sein neustes, viele
hundert Kilobyte großes Paper am Telefon zu diktieren. Er kann aber durchaus
die Hex-Repräsentation des von ihm gewählten Schlüssels K diktieren und ihr
dann die mit K verschlüsselte Nachricht senden, die das Paper enthält. Das
ist ein Beispiel für einen in der Kapazität beschränkten sicheren Kanal.

Oder Andreas hat Birgit im Januar auf einer Konferenz getroffen und mit ihr
ein gemeinsames K ausgemacht. Jetzt, im Juni, will er ihr sein Paper senden.
Das geht, da die beiden ja einen gemeinsamen Schlüssel K haben. Dies ist ein
Beispiel für einen temporal beschränkten sicheren Kanal - damals hatten sie
sichere Kommunikation, jetzt nicht.

Ein extremes Beispiel für so etwas hat man, wenn der Schlüssel so lang ist
wie die Nachricht selber. In diesem Fall kann man tatsächlich absolut
sichere Kommunikation konstruieren: Man nehme einen physikalischen
Zufallszahlengenerator, etwa den Zerfall einer radioaktiven Probe, und
zeichne die Zahlen auf, 700 MB davon auf einer CD. Dann mache man eine Kopie
davon und sende diese mit einem Kurier zum Empfänger oder übergebe diese dem
Empfänger, wenn man ihn trifft.

Später, wenn man Bedarf an sicherer Kommunikation hat, sendet man dem
Empfänger die Nachricht XOR-codiert mit diesen Zufallszahlen, und streiche
diese Zahlen sodaß sie niemals wieder verwendet werden können.

Dieses Verfahren nennt sich 
[One-Time Pad](http://en.wikipedia.org/wiki/One-time_pad) und ist das
einzige bekannte Verfahren, das absolut und beweisbar sicher ist.
Bedingungen: Der Schlüssel wird niemals wiederverwendet (daher die
Notwendigkeit des Abstreichens) und der Schlüssel ist echt zufällig (und
nicht von einer Pseudo-Zufallszahlenfunktion berechnet). Leider gibt es sehr
viele Anbieter von Verfahren, die sich One-Time Pad nennen, aber entweder
den Schlüssel wiederverwenden oder nicht wirklich zufällig bestimmen - diese
Verfahren sind leider sehr, sehr leicht brechbar.

Symmetrische Verfahren haben noch ein anderes Problem, wenn es um
Gruppenkommunikation geht: Für jede Kombination von Sender und Empfänger muß
man einen anderen Schlüssel vereinbaren, wenn dieses Paar privat und
unabhängig von den anderen Paarungen miteinander kommunizieren können soll.
Daher hat man bei n Teilnehmern (n*(n-1))/2 mögliche K zu verwalten, bei 100
Teilnehmern also 4950 verschiedene Schlüssel.


![](/uploads/kryptogrundlagen/img4.png)

Um dieses Problem besser beherrschen zu können hat man in den 1970er Jahren
asymmetrische Verfahren entwickelt. Ein asymmetrisches Verfahren ist eines,
bei dem man einen Verschlüssel P und einen Entschlüssel Q hat. Wenn man also
den Ciphertext C = P(M) produziert, dann braucht man den anderen Schlüssel Q
um wieder an den Klartext zu kommen: M = Q(C), d.h. M = Q(P(M)). Wendet man
stattdessen P ein zweites Mal an, bekommt man kein sinnvolles Ergebnis.

Tatsächlich funktioniert die Paarung auch anders herum: Ich kann auch mit Q
verschlüsseln und dieses Resultat dann mit P entschlüsseln, d.h. es gilt
auch M = P(Q(M)).

Die Unterscheidung zwischen P und Q ist also nicht technisch-funktional: Ich
kann jeweils mit dem einen Schlüssel entschlüsseln, was mit dem anderen
verschlüsselt worden ist. Sie ist stattdessen organisatorisch: Den einen
Schlüssel, P, mache ich publik. Den anderen, Q, halte ich streng geheim.

Der Empfänger einer Nachricht kann nun also seinen öffentlichen Schlüssel P
publizieren: Birgit macht ihr P allgemein bekannt.

Ein Sender kann sich nun diesen öffentlichen Schlüssel P von Birgit greifen
und eine Nachricht an sie verschlüsseln: C = P(M). Es ist nicht möglich,
diese Nachricht mit P wieder zu entschlüsseln. Nur Birgit (oder jede andere
Person, die aus welchen Gründen auch immer ihr Q kennt) kann die Nachricht
wieder in Klartext verwandeln: M = Q(C) = Q(P(M)).

Die Anzahl der zu verwaltenden Schlüssel ist in so einem Setup deutlich
kleiner: Statt 4950 Schlüsseln für 100 Teilnehmer sind nur 100 PQ-Paare zu
verwalten, genauer: Es muß ein Verzeichnis von 100 öffentlichen Schlüsseln P
der Empfänger bekannt gemacht werden, und die 100 geheimen Schlüssel müssen
von den Empfängern auch geheim gehalten werden.

Ein Nachteil: Asymmetrische Verfahren haben deutlich längere Schlüssel als
symmetrische Verfahren. Schlüssel sind bis zu 4096 Bit lang. Daher ist auch
ihre Verarbeitung sehr viel langsamer, im Schnitt 10-20 mal langsamer als
bei den bekannten symmetrischen Verfahren.


![](/uploads/kryptogrundlagen/img5.png)

In der Praxis verwendet man daher meist hybride Verfahren. Bei einem
hybriden Verfahren wird symmetrische Verschlüsselung angewendet, um die
Nachricht zu verschlüsseln. Der Schlüssel K, mit dem das getan wird, wird
dabei zufällig ausgewürfelt und nur ein einziges Mal (oder bei einer
stehenden Verbindung nur für kurze Zeit) verwendet.

Der Empfänger muß K gesagt bekommen - dafür verwenden wir das asymmetrische
Verfahren, und das ist schnell, weil die Nachricht selber (es steht nur K
drin) recht kurz ist.

Andreas würfelt sich also einen Key K aus, den "Session-Key". Dann greift er
sich den öffentlichen Schlüssel P von Birgit und verschlüsselt K damit:
P(K). Die eigentliche Nachricht M verschlüsselt er dann mit K, weil's
schneller ist: K(M).

Birgit bekommt die Nachricht "P(K) K(M)". Mit ihrem geheimen Schlüssel Q
kann sie K = Q(P(K)) ermitteln. Dadurch kennt sie K und kann nun M = K(K(M))
berechnen, und hat nun die Nachricht im Klartext.


![](/uploads/kryptogrundlagen/img6.png)

Wir können den Session-Key der Nachricht sogar mehrfach voranstellen:
P<sub>birgit</sub>(K) P<sub>marit</sub>(K) und so weiter. Alle diese
Empfänger können nun ihre Kopie des Session-Key entschlüsseln und die
Nachricht decodieren. Dabei muß man sich erinnern, daß K(M) recht lang sein
kann, die ganze Nachricht halt. Die einzelnen Kopien des Session-Keys sind
jedoch recht kurz.

Dies ist auch die Idee verschiedener DRM-Systeme, um etwa den Inhalt von
DVDs zu schützen: Auf der DVD befindet sich der Video-Content mit dem
Session-Key der DVD geschützt, viele GB lang. Im Startbereich der DVD ist
der Session-Key mit dem geheimen Schlüssel des jeweiligen
Player-Lizenznehmers geschützt abgelegt. Der Hersteller mit der
Herstellernummer 48 guckt also im 48. Slot vorne auf der DVD nach,
entschlüsselt den Session-Key der DVD von dort und kann so die DVD
abspielen.

Das wäre angreifbar in dem Sinne, daß dazu ja der geheime Schlüssel jedes
Lizenznehmers in jedem seiner Produke - den Playern - enthalten sein müßte,
und tatsächlich hat man diese Schlüssel auch für kurze Zeit aus
Software-DVD-Spielern extrahiert, bis man gemerkt hatte, daß das
symmetrische Verschlüsselungsverfahren, CSS, auf einer DVD sowieso Schrott
ist und man sich das Lesen der Keys aus dem Index vorne auch sparen kann...

Es verbleiben zwei zu lösende Probleme:

Erstens: Wir müssen irgendwie sicherstellen, daß der Schlüssel, der uns als
der Schlüssel von Birgit im Verzeichnis verkauft wird auch wirklich der
Schlüssel ist, der zu Birgits Q paßt.

Zweitens: Bei einigen Nachrichten sollte man sicherstellen, daß nicht
irgendjemand auf dem Weg C = K(M) abfängt und ein zweites Mal abspielt.

Wenn Andreas etwa eine Nachricht an Birgit sendet "Bitte zahle Kris 100 EUR
aus." und Kris fängt diese Nachricht ab, dann kann er Birgit eventuell dazu
bringen, ihm jedesmal 100 EUR auszuzahlen, wenn er diese verschlüsselte
Nachricht noch einmal sendet.

Dieses zweite Problem läßt sich lösen, indem man der Nachricht eine
Folgenummer oder eine Zufallszahl verpaßt, die mit codiert wird - am besten
beides. Nachrichten gleichen Inhaltes werden dadurch unterscheidbar und
Duplikate können erkannt werden. Es ist natürlich wichtig, daß diese Zahlen
mit verschlüsselt werden, damit sie nicht leicht zu ändern sind.


![](/uploads/kryptogrundlagen/img7.png)

Verschlüsselungsverfahren arbeiten in Blöcken von x Bits. Nachrichten sind
jedoch nicht immer genau Vielfache dieser Blöcke lang. Daher muß man sie
durch Füllbytes am Ende zu einem solchen Blockvielfachen auffüllen - das
nennt man Padding. Man bekommt eine Nachricht M, die in Wirklichkeit aus
Teilnachrichten besteht. Jede Teilnachricht ist einen solchen Block lang:
M<sub>1</sub> M<sub>2</sub> M<sub>3</sub>... M<sub>i</sub> ... und so
weiter.

Danach wird das Verschlüsselungsverfahren angewendet, und zwar auf jeden
Block. Dabei kann jeder Block mit demselben Schlüssel K verschlüsselt
werden, oder mit einem Schlüssel, der irgendwie aus dem Startschlüssel K,
dem Blockindex i, vorhergehenden Blöcken von Klartext oder Ciphertext oder
einem weiteren Startwert (dem Initialisierungsvektor IV, eine weitere
Zufallszahl) abgeleitet wird. Je nachdem, wie man sich diese Dinge
zusammenbastelt, handelt man sich bestimmte Vor- und Nachteile ein.

Verfahren, bei denen die Verschlüsselung von M<sub>i</sub> nicht von
vorhergehendem Klartext oder Ciphertext abhängig sind, sind gut
parallelisierbar und sind auch unempfindlich gegen Leitungsstörungen oder
Plattenlesefehler, bei denen eventuell einmal ein Block zwischendrin
verloren geht.


![](/uploads/kryptogrundlagen/img8.png)


![](/uploads/kryptogrundlagen/img9.png)


![](/uploads/kryptogrundlagen/img10.png)

Verschüsselt man mit einem festen Schlüssel K ('Electronic Codebook', ECB),
dann werden zwei Blöcke M<sub>1</sub> und M<sub>2</sub>, die denselben
Inhalt haben, auch gleich verschlüsselt - der Klartext der Nachricht scheint
im Ciphertext durch.

```console
KK:~ kris$ dd if=/dev/zero bs=1k count=1 of=x
1+0 records in
1+0 records out
1024 bytes transferred in 0.000088 secs (11639478 bytes/sec)

KK:~ kris$ openssl enc -des-ecb -k keks -iv 0 -e -in x -out y
KK:~ kris$ ls -l x y
-rw-r--r-- 1 kris staff 1024 3 Jun 15:56 x
-rw-r--r-- 1 kris staff 1048 3 Jun 15:56 y

KK:~ kris$ od -t x1 y
0000000 53 61 6c 74 65 64 5f 5f b2 3f fa fb 98 86 03 ca
0000020 fe ab 3b 74 5b 90 76 74 fe ab 3b 74 5b 90 76 74
...
0002020 72 d6 ba 5e 91 0a 9e 90
0002030
```

Erzeugt man also ein Kilobyte Nullbytes und verschlüsselt diese mit einem
ECB-Verfahren (jeden Block also mit demselben Schlüssel 'keks'), dann
bekommt man zwar Bytesalat, aber Bytesalat mit einem sich wiederholenden
Muster: Alle 32 Bytes kommt dieselbe Bytefolge vor - _od_ erkennt das und
kürzt ab.

Durch verschiedene Verfahren versucht man dies zu verhindern, indem man
einen Block mit seinem vorhergehenden Klartext oder Ciphertext mischt.
Dennoch ist es sinnvoll, Klartext vor der Verschlüsselung zu komprimieren:
Kompression beseitigt Redundanzen im Klartext. Sich wiederholende Muster
werden ausgenutzt, um die Nachrichtenlänge zu verkleinern und es entsteht
eine Klartextnachricht, die keine Muster mehr enthält.


![](/uploads/kryptogrundlagen/img11.png)

Neben Verschlüsselungsalgorithmen gibt es ein zweites wichtiges
Grundkonstrukt in der Kryptographie, den Hash. Ein Hash ist eine
Prüfsummenfunktion, also etwas, in das man eine beliebig lange Nachricht
vorne reinfüttern darf, und bei der dann am Ende eine Zahl h mit einer
festen Anzahl von Bits herauskommt: h = Hash(M).

Allen Prüfsummen ist gemeinsam, daß man aus einer gegebenen Prüfsumme die
Originalnachricht nicht eindeutig rekonstruieren kann, da es mehr als eine
Nachricht gibt, die diese Prüfsumme hat. Das gilt selbst für eine
[ISBN](http://en.wikipedia.org/wiki/International_Standard_Book_Number#ISBN-10):
Die ISBN 0-306-40615 hat die Prüfzummer 2, aber es gibt noch weitere ISBNs,
die diese Prüfziffer haben.

Bei einer ISBN ist es jedoch relativ leicht, eine ISBN zu konstruieren, die
eine bestimmte vorgegebene Prüfziffer (hier: 2) hat.

Bei einer kryptographischen Prüfsumme, einem Hash, möchte man nun als
zusätzliche Eigenschaft, daß es nicht möglich sein soll, eine Nachricht M zu
konstruieren, die eine bestimmte Prüfsumme h ergibt. Um so eine Nachricht zu
finden, müßte man idealerweise den ganzen M-Raum durchsuchen (also einen
Brute Force-Angriff starten).

In der Praxis gibt es einige populäre Funktionen, von denen wir geglaubt
haben, daß sie diese Eigenschaft hätten und das ist auch eine Weile gut
gegangen. Derzeit sieht es aber eher schlecht aus.


![](/uploads/kryptogrundlagen/img12.png)

Wir können Hashes verwenden, um Daten digital zu unterschreiben. Nehmen wir
an, Andreas will Birgit eine Nachricht M senden und er will sicherstellen,
daß Birgit erkennen kann, daß es sich um eine unveränderte Nachricht handelt
und daß sie von Andreas ist.

Dazu nehmen wir einen Klartext M und berechnen die Prüfsumme Hash(M).
Andreas verschlüsselt nun die Prüfsumme mit seinem _geheimen_ Schlüssel
Q<sub>Andreas</sub>. Etwas, das mit Q verschlüsselt worden ist, kann mit dem
dazu gehörenden P entschlüsselt werden und umgekehrt. Die Prüfsumme kann
also mit dem Public Key von Andreas entschlüsselt werden - und der ist
jedermann bekannt.

Wenn wir also die Nachricht M nehmen und selber die Prüfsumme h = Hash(M)
berechnen, dann können wir dieses Ergebnis mit der Prüfsumme vergleichen,
die Andreas mit seinem private Key verschlüsselt hat und die jeder
entschlüsseln kann, der den public Key von Andreas kennt. Stimmen beide
überein, wissen wir, daß die Nachricht unverändert ist.

"Unverändert" (oder authentisch) bedeutet hier, daß der Inhalt der
Nachricht, den wir sehen, identisch ist mit dem Inhalt der Nachricht, die
jemand abgesendet hat, der den private Key von Andreas gekannt hat. Wenn
Andreas also seine Schlüsselverwaltung im Griff hat, dann ist das nur
Andreas.

Andreas sendet "M Q<sub>Andreas</sub>(Hash(M))" und nicht
"Q<sub>Andreas</sub>(M)". Beweistechnisch macht das keinen Unterschied: In
beiden Fällen muß der Absender der Nachricht den geheimen Schlüssel von
Andreas gekannt haben. Im ersten Fall ist die Nachricht jedoch auch dann
noch lesbar, wenn der Empfänger der Nachricht keinen Zugriff auf den
öffentlichen Schlüssel von Andreas hat (dann ist jedoch die Authentizität
nicht beweisbar).

Die Prüfsumme Q<sub>Andreas</sub>(Hash(M)) hinter der Nachricht M nennt man
auch eine digitale Unterschrift (Signatur) der Nachricht.


![](/uploads/kryptogrundlagen/img13.png)

Dieses Verfahren kann man jetzt mit der hybriden Verschlüsselung
zusammensetzen. Man bekommt ein Verfahren, bei dem man eine Nachricht
erzeugt, die aus der Nachricht M und ihrer Signatur
Q<sub>Andreas</sub>(Hash(M)) zusammengesetzt ist. Nachricht und Signatur
werden jetzt mit einem Session-Key K verschlüsselt: "K(M
Q<sub>Andreas</sub>(Hash(M)))" und der Session-Key K wird mit dem
öffentliche Schlüssel des Empfängers verschlüsselt vorangestellt.

Das Gesamtprodukt: "P<sub>Birgit</sub>(K) K(M
Q<sub>Andreas</sub>(Hash(M)))". Nur Birgit kann nun den Session-Key K
ermitteln, und mit dessen Hilfe Nachricht und Signatur aus der Nachricht
extrahieren. Sie kann dann die Prüfsumme über die Nachricht selbst berechnen
und mit dem öffentlichen Schlüssel von Andreas gegen die Prüfsumme in der
Nachricht vergleichen.


![](/uploads/kryptogrundlagen/img14.png)

Was jetzt noch fehlt ist ein Weg, mit dem Andreas und Birgit und jeder sonst
an die öffentlichen Schlüssel aller anderen kommt, ohne daß irgendein
Angreifer etwa Andreas den Schlüssel eines Angreifers im Namen von Birgit
unterschrieben kann und Birgit den Schlüssel des Angreifers im Namen von
Andreas.

Damit man das kann, muß man die Identität von Personen an Schlüssel binden.
Das macht man mit einem Zertifikat.

Ein Zertifikat ist eine Datenstruktur, die einen öffentlichen Schlüssel
enthält, den Namen oder andere Identifikationsdaten des Inhabers, einen
Verwendungszweck für den Schlüssel (Garantien, die der Inhaber für Daten
abgibt, die mit diesem Schlüssel signiert sind) und eine Laufzeit als
Intervall von-bis.

Jede dieser Informationen hat eine spezifische Aufgabe in unserem System.

Der öffentlichen Schlüssel P erlaubt das Entschlüsseln von Prüfsummen, also
das Prüfen von Signaturen. Er erlaubt auch das Verschlüsseln von Nachrichten
an einen Empfänger.

Die Inhaberdaten definieren, was für ein Empfänger ist. Der Empfänger ist
immer eine natürliche Person, denn zu einem öffentlichen Schlüssel gehört
immer auch ein geheimer Schlüssel, und es ist unmöglich, den geheimen
Schlüssel geheim zu halten, wenn er nicht an eine natürliche Person gebunden
ist.

Empfänger, die juristische Personen sind, muß man über Personengruppen oder
über Verwendungszwecke/Rollen simulieren.

Die Laufzeit schließlich ist nützlich, weil sie einige häßliche
Skalierungsprobleme in unserem System begrenzen hilft. Dazu später mehr.

Hinten an diesem Zertifikat steht dann ein weiteres Datenpaket - die
Signatur einer CA, einer Certification Authority. Sie "beglaubigt" diese
Daten.


![](/uploads/kryptogrundlagen/img15.png)

Das Problem, das wir lösen wollen: Wir kann Andreas sicher sein, daß
P<sub>Birgit</sub> wirklich von Birgit stammt?

Der Ansatz mit einer CA definiert <strike>einen Single Point of
Failure</strike> eine Zertifikations-Station, die einen Schlüssel
P<sub>CA</sub> veröffentlicht, etwa dadurch, daß dieser in einem Browser
eingebaut ist.

Birgit publiziert nun nicht P<sub>Birgit</sub>, sondern
Q<sub>CA</sub>(Hash(P<sub>Birgit</sub>)) P<sub>Birgit</sub>. Die CA
verschlüsselt also die Prüfsumme über den Schlüssel von Birgit und Birgit
fügt diese Prüfsumme an ihren Schlüssel an.

Die Augabe der CA ist es nun, nur das P<sub>Birgit</sub> zu unterschreiben,
das wirklich zu Birgit gehört. In der Praxis funktionieren unterschiedliche
CAs sehr unterschiedlich gut. Dabei ist das System schon im wirtschaftlichen
Kern kaputt: Da die CA Geld von Birgit bekommt (und nicht von allen außer
Birgit), um P<sub>Birgit</sub> zu unterschreiben, ist die Motivation der CA
hoch, Birgit _irgendetwas_ zu unterschreiben, damit sie das Geld von Birgit
bekommt.

Ohne genaue Kenntnis des Prozesses, der durchlaufen werden muß, um
P<sub>Birgit</sub> zu unterschreiben, ist das Zertifikat also wertlos.

Und: Man beachte, daß die CA zum Unterschreiben von P<sub>Birgit</sub> keine
Kenntnis von Q<sub>Birgit</sub> haben muß, d.h. den geheimen Schlüssel von
Birgit muß die CA weder erzeugen noch muß Birgit ihn der CA aushändigen.

Und: Eine CA ist ein großes und spannendes Ziel für einen Angreifer. Der
Q<sub>CA</sub> muß wirklich gut bewacht werden.

![](/uploads/kryptogrundlagen/img16.png)

Und noch ein paar weitere Beobachtungen: Birgit kann sich ihren Key mehrfach
von unterschiedlichen CAs zertifizieren lassen.

Und Andreas braucht den Key der CA von Birgit nicht zu kennen. Er kann den
Key einer anderen CA kennen, die den Public Key der CA von Birgit kennt,
unter Umständen über x Schritte.

Beispiele für beides findet man jedoch eher in PGP als in X.509.

![](/uploads/kryptogrundlagen/img17.png)

Und schließlich noch das Implosionsproblem: Was passiert, wenn Andreas
seinen privaten Schlüssel verbummelt?

Wenn der Schlüssel eine Laufzeit hat, löst sich dieses Problem mit dem
Auflauf der Laufzeit des Schlüssels von selber. Gilt Andreas' Schlüssel etwa
noch ein Jahr, genügt es, das Problem ein Jahr lang zu ignorieren und dann
ist es weg.

Will man es nicht ignorieren, dann braucht man eine Rückziehliste der
'irrtümlich unterschriebenen oder jetzt auf Wunsch des Inhabers
zurückgezogenen Unterschriften'. Das ist eine Certificate Revokation List,
CRL.

Die URL der CRL einer CA sollte in jedem Zertifikat enthalten sein, und es
sollte theoretisch ein Protokoll (eine API) geben, mit der man das Prädikat
'gültig?' für ein gegebenes Zertifikat effizient prüfen kann, und mit der
man die gesamte CRL einer CA komplett für den Offline-Gebrauch runterladen
kann. In der Praxis funktioniert beides nicht sehr gut...

![](/uploads/kryptogrundlagen/img18.png)

Ebenfalls nicht sehr gut funktioniert das Lesen und Schreiben von Standards,
besonders wenn es sich um ITU/CCITT-Normen handelt: Diese sind zu optional
oder zu vage für eine Implementierung oder einfach falsch definiert. Daher
gibt es eine Reihe von Dokumenten, die PKCS, die quasi Richtigstellungen und
Präzisierungen zu diesem Komplex unterhalten. Ohne sie ist der Standard
nicht umsetzbar.
![](/uploads/kryptogrundlagen/img19.png)

Soweit die Technik.

Jetzt will man das Ganze noch in eine Form gießen, die in Deutschland auch
juristisch anwendbar ist. Dazu muß man quasi das Gesetz mit der Technik
verkabeln. Diese Aufgabe haben die EU Signaturrichtlinie, das deutsche
Signaturgesetz und die Durchführungsverordnung dazu, sowie eine Reihe von
Gesetzen, die bestehende Gesetze so ändern, daß die alte Vokabel
"Unterschrift" zu einem Hook wird, der wahlweise eine traditionelle
Unterschrift oder eine digitale Signatur aufrufen kann.

![](/uploads/kryptogrundlagen/img20.png)

Dazu definiert das Signaturgesetz drei Dinge: Die "Einfache elektronische
Signatur", die vollkommen nutzlos ist, die "fortgeschrittene elektronische
Signatur", die man etwa mit PGP oder einer OpenSSL-CA selber generieren
kann, und die "Qualifizierte elektronische Signatur", die eine solche CA
nach bestimmten technischen und organisatorischen Richtlinien betrieben und
zertifiziert verlangt.
