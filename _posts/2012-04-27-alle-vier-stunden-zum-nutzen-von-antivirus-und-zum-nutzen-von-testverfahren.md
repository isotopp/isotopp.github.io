---
layout: post
published: true
title: Alle vier Stunden - zum Nutzen von Antivirus und zum Nutzen von Testverfahren
author-id: isotopp
date: 2012-04-27 21:24:02 UTC
tags:
- security
- spam
- virus
- lang_de
feature-img: assets/img/background/rijksmuseum.jpg
---
In 
[Nur bedingt abwehrbereit](http://www.faz.net/aktuell/technik-motor/computer-internet/virenschutzprogramme-nur-bedingt-abwehrbereit-11727592.html)
schreibt Peter Welchering über die Wirksamkeit oder Unwirksamkeit von
Antivirenprogrammen.  Dabei geht es auch um den "Schutzlevel" von
Antivirenprogrammen, wie immer der genau definiert ist.  Ich lese unter
Schmerzen: 

> Einen 99-prozentigen Schutz verspricht Marco Preuß vom Antivirenhersteller
> Kaspersky.  Auf 35 bis 96 Prozent taxieren die Softwaretester der
> „Stiftung Warentest“ das Schutzniveau von Antivirenprogrammen.

In einem früheren Leben vor vielen Jahren war ich einmal Securityfuzzi in
einem größeren Internetladen, und hatte in dieser Eigenschaft gelegentlich
mit Viren und ihrer Verbreitung zu tun, etwa die 
[SOBIG](http://en.wikipedia.org/wiki/Sobig) -Welle und einige andere,
vergleichbare Teile.

Viele moderne Viren nutzen keine Sicherheitslücke im Rechnersystem aus um
eine Maschine zu infizieren, sondern eine andere, viel größere und
schwieriger zu sichernde Lücke: [Die Person vor dem Rechner](http://en.wiktionary.org/wiki/PEBCAK).
Der Virus verbreitet sich in Mails mit provozierendem oder verängstigendem
Inhalt und enthält Anhänge, die sich als Dokumente ausgeben, aber Programme
sind.  Der Anwender soll beim Lesen der Mail dazu gebracht werden, den
Anhang zu öffnen und so die dort enthaltenen Programme auszuführen.  Auf
diese Weise installiert sich ein Grundprogramm, das dann anfängt, weitere
Programmbestandteile aus dem Netz nachzuladen.

Dabei muß der Virus-Autor mehrere Probleme lösen.

Eines ist die Delivery, also das Ausliefern der Mail mit dem Virus an
möglichst viele Leute.  Zu diesem Zweck verwendet der Autor bereits durch
den Virus infizierte Rechner, die dann weitere Rechner infizieren sollen. 
Diese bereits infizierten Rechner sind jedoch meistens an heimischen
DSL-Anschlüssen installiert, und ist ein Nachteil: Netze, in denen
Heim-DSL-Anschlüsse enthalten sind, sind bei vielen Mailern geblockt und
Mail von dort wird von vorneherein als Spam verdächtigt und nicht
angenommen.

![How Spam Works](/uploads/how-spam-works.png)

## Wie sich der Virus selbst versendet, ohne in DSL IP-Blocks zu laufen.

Im Falle von SOBIG und vielen anderen Viren geht man daher über einen sehr
leistungsfähigen Mittelsmann vor: Der Virus verbindet sich mit dem Mailer
eines großen Mailproviders - web.de, 1und1, Telekom und andere sind beliebte
Ziele.  Im Virus selber sind Adreßdatenbanken mit den Loginnamen und
Paßworten von geklauten Accounts enthalten, typischerweise einige Hundert
pro Mailprovider.  Der Virus greift sich nun die Adreßlisten des befallenen
Rechners, loggt sich beim Provider ein und versendet sich an Leute auf der
Adreßliste.

Natürlich gehen die Virenautoren davon aus, daß die Provider geklauten
Logindaten sperren werden.  Daher ist der Inhalt des Virus selbst
verschlüsselt, damit man die Logindaten nicht so leicht finden kann, und die
verwendeten Logindaten wechseln in schnellen Intervallen (alle 30 Minuten
oder so) auf neue, unverbrauchte Logins.

Die Virenautoren gehen auch davon aus, daß die Hersteller von
Antivirensoftware ihre Suchmuster und Erkennungssysteme aktualisieren. 
Daher stellen sie alle 4 Stunden eine neue Variante des Virus bereit, die
inhaltlich gleich ist, aber bei der die Programmelemente intern anders
angeordnet sind und die natürlich neue geklaute Logindaten enthält. 
Obendrein wird eine neue Welle in der Regel dann gestartet, wenn es in der
zu infizierenden Zielregion Nacht ist und die Operating Center der Provider
minimal besetzt sind.  Eine Startzeit zwischen 2 und 4 Uhr nachts ist
normal, sodaß bei Dienstantritt in der Regel schon die 2.  oder 3.  Welle
aktiv ist.

Auf diese Weise ist der Virus den Abwehrspielern in den Antivirenfirmen und
bei den Mailprovidern immer ein wenig voraus und nur sehr aufwendig
dauerhaft zu blockieren.

## Was bedeutet das für Virenscanner und andere Schutzprogramme? Welche Bedeutung hat eine Erkennungsrate in so einem System?

Es ist klar, daß die Erkennungsrate für neue, aktive Bedrohungen in so einer
Umgebung nahe Null ist: Die gerade jetzt aktiv im Spam versendeten Viren
sind den Scannern naturgemäß vollkommen unbekannt.  Die Autoren der
Virensoftware haben selber Testsysteme, auf denen sie sher gut aktualisierte
Virenscanner aller wichtigen Hersteller installiert haben und natürlich
stellen sie sicher, daß ihr Virus von keinem der gängigen Produkte bereits
vorab erkannt werden kann.  Damit das so bleibt, variieren sie ihren Angriff
alle paar Stunden, um schneller als der Update-Zyklus dieser Programme zu
sein.

Die Erkennungsrate für gerade aktive Bedrohungen ist bei allen diesen
Programmen also Null.  Und die Angreifer prüfen das, damit das auch so
bleibt.  Der Scanner nutzt also nur etwas gegen veraltete (also Viren, die
älter als 4-24 Stunden sind) Versionen der Bedrohung, und diese versenden
sich in der Regel nicht mehr aktiv.

## Was bedeutet das für das Testverfahren der Stiftung Warentest?

Da sich das Aussehen der Viren (ihre "Signatur") im Stundentakt ändern kann,
taugen signaturbasierende Erkennungen in der Regel nur zur Erkennung von
veralteten Bedrohungen.  Die geraden aktiven Bedrohungen könnte man nur
durch Verhaltensanalyse erkennen - hier aber werden die Virenautoren ihre
Angriff zuvor recht gut auf die Schutzmaßnahmen der verschiedenen
Antivirenprogramme abgestimmt haben und diese zu umgehen versuchen, um das
System unerkannt zu kompromittieren.  Anders als Signaturdatenbanken ist die
Verhaltensanalyse jedoch auch sehr viel aufwendiger zu warten und auf einen
Angriff anzupassen, da hier nun Code statt Daten geändert werden müssen. 
Wenn man also erst einmal einen Weg an einem Virenscanner 'vorbei' gefunden
hat, wird dieser auch weitaus länger offen bleiben.

Die Stiftung Warentest hat ihre Testmethode nicht offengelegt - wenn jedoch
gegen Rechner mit Altbedrohungen getestet worden ist und der Test
vornehmlich oder ausschließlich auf der Basis einer Signaturdatei erfolgt
ist, dann hat er genau keine Aussagekraft.

Ein triviales und leider immer wieder genommenes Testverfahren besteht
darin, eine Platte mit so vielen Viren als möglich gleichzeitig zu
verseuchen, und eine Kopie von dieser Platte an den Testrechner
anzuschließen.  Diese Platte wird dann gescannt.  Weil Rechner und
Virenplatte leicht voneinander zu trennen sind, kann man den Testrechner
schnell nacheinander mit einem Virenscanner nach dem anderen austatten und
weiter testen, ggf mit einer jeweils frischen Kopie der verseuchten Platte.

Das ist auf viele verschiedene Weisen nicht aussagekräftig:

Erst einmal ist es nicht das Szenario, gegen das ein Anwender im
Angriffsfall vermutlich verteidigen muß - siehe oben.  Statt gegen
unbekannte frische Programme zu testen, testet man gegen einen Zoo von nicht
mehr verwendeter Altware.

Dann ist es so, daß der Testrechner nicht wirklich infiziert worden ist -
die Viren liegen inaktiv auf der verseuchten Platte, statt aktiv das
Systemverhalten des Testsystems zu beeinflussen.  Das ist auch gut so, weil
so viele verschiedene Virenprogramme, wenn sie alle zugleich aktiv wären,
vermutlich das Verhalten des Testsystems und sich gegenseitig beeinflussen
würden.  Bis hin zu dem Punkt wo die Testkiste so instabil wird, daß ein
sinnvoller Test gar nicht mehr möglich ist.

Weil die Viren aber nicht installiert und aktiv sind, sondern nur als
passive Programme auf der Platte rumgammeln, können die Scanner nur mit
ihren Signaturdateien operieren.  Die Verhaltensanalyse findet nix, da das
Verhalten der zu testenden Kiste wie intendiert nicht beeinflußt wird, um
den Test selbst nicht unmöglich zu machen.

Und schließlich ist es so, daß die meisten Virenscanner einen Benchmarkmodus
haben: Wenn sie auf einem System in einem Testlauf mehr als n Viren finden
und eventuell eine von diesen Dateien sogar <a
href='http://en.wikipedia.org/wiki/EICAR_test_file'>EICAR</a> ist, dann
schalten sie in einen speziellen Benchmark-Modus, der mit dem normalen
operativen Betrieb nichts zu tun hat und der speziell dafür designed ist,
das Programm in einem Vergleichstest gut aussehen zu lassen.

Auf diese Weise kommt man zu Ergebnissen, die mit dem realen Schutzwert des
Programmes genau gar nichts zu tun haben.  Und dieser bemißt sich in der
realen Welt gegen eine echte Bedrohung vermutlich nicht nach der getesteten,
aber in der wirklichen Welt eher nutzlosen Signaturdatei, sondern nach der
Qualität der Verhaltensanalyse von Programmen.

## _Nachtrag:_ Wie sind die Angreifer an Loginnamen und Mailadressen von Mailaccounts gekommen?

Phishing von eBay-Accounts ("Für die eBay-Disputresolution gehen sie bitte
auf die folgende wilde Webseite und geben sie unmotiviert ihren eBay-Namen
und ihr Kennwort ein, oder wir sperren ihren Account!11!!eins!Elf") liefert
den Angreifern eBay-Namen und Paßworte.  Loggt man sich nun mit diesen Daten
automatisiert bei eBay ein, kann man dort eine Reihe von spannenden Daten
absaugen, darunter auch die Mailadresse, an die eBay Benachrichtigungen
senden soll.

Mit dieser Adresse und dem eBay-Paßwort kann man nun versuchen sich
automatisiert bei dem Provider einzuloggen.  Hat der Benutzer bei allen
seinen Accounts dasselbe Paßwort verwendet, gelingt das und man ist
zusätzlich zu seinem eBay-Account auch noch sein web.de/GMX/T-Online los.

## _Nachtrag:_ Wieso machen die das?

Wenn ein Rechner erst einmal befallen ist, kann man mit ihm alles machen:
Man kann seine lokale Festplatte durchsuchen und die Bankdaten für
Onlinebanking aus der Bankingsoftware oder dem Browsercache auslesen.  Man
kann seine Mailkontakte abernten und sie verwenden, um den Freunden dieser
Person realistischere Spam-Mails zu senden.  Man kann weitere Software aus
dem Internet nachladen und den Rechner und seine Internet Anbindung
verwenden, um mehr Spam zu versenden, DDoS-Angriffe auf andere zu fahren und
mit dieser Drohung Schutzgeld zu erpressen und man kann viele weitere
unschöne Dinge damit tun.
