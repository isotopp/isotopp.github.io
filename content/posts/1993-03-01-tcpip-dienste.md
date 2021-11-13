---
author-id: isotopp
date: "1993-03-01T09:00:00Z"
feature-img: assets/img/background/rijksmuseum.jpg
published: true
tags:
- lang_de
- publication
- internet
title: "TCP/IP Dienste"
---

**für c't - Magazin für Computertechnik, Ausgabe 3/93**

# TCP/IP Dienste

#### Das größte Problem bei einem Artikel über das Internet ist es, zu definieren, was das Internet überhaupt ist. Eigentlich existiert so etwas wie "das Internet" nämlich überhaupt nicht. Das ändert natürlich nichts an der Tatsache, daß Millionen Menschen es jeden Tag benutzen. Wie erklärt sich ein solcher Widerspruch?

Am Besten, man beginnt am Anfang:
Ende der Siebziger Jahre hatte das amerikanische Verteidigungsminsterium Bedarf an einer Technologie, die unterschiedlichsten Computersysteme an verschiedenen Orten miteinander zu vernetzen.
Um die Möglichkeiten einer solchen Vernetzung auszuloten und die dazu notwendigen Technologien zu entwickeln und zu erproben, wurde im Jahre 1969 im Rahmen eines Forschungsprojektes ein experimentelles Computernetz ins Leben gerufen.
Schon bald zeigte sich, daß nicht nur das Verteidigungsminsterium einen Bedarf an derartiger Technik hatte. 
Das ARPANET war viel erfolgreicher als ursprünglich geplant: 
Nach kurzer Zeit schon begannen viele Organisationen das Netz nicht nur für experimentelle Zwecke zu nutzen, sondern verwendeten es auch für ihre tägliche Arbeit.
Auch Institutionen und Firmen, die nicht direkt an der Entwicklung von Netzwerktechnologien beteiligt waren, sondern diese einfach nur benutzen wollten, zeigten Interesse an der Vernetzung.
Daher zog man 1975 die Konsequenz und änderte den Status von ARPANET in den eines Produktionsnetzwerks, das von der Defense Communications Agency (heute die Defense Information Systems Agency) verwaltet wurde.

Doch die Entwicklung des Netzes blieb damit nicht stehen. 
Die heute verwendeten [Netzwerkprotokolle](#rfc), TCP und IP, stammen im Prinzip aus den frühen achtziger Jahren. 
Weil das ARPANET immer stärker wuchs und zum Teil nicht zu experimenteller Arbeit, sondern immer mehr auch zu Produktionszwecken genutzt wurde, teile man es in einen Forschungsteil (ARPANET) und das MILNET auf. 
Zugleich stellte man das Protokoll zwischen den zentralen Netzwerkknoten auf TCP/IP um. 
Um den Umstieg zu erleichtern und auch Universitäten für die verwendete Technik zu interessieren, wurde eine frei verfügbare Implementation von TCP/IP für BSD UNIX in Auftrag gegeben und damit der Grundstein zu dem gelegt, was heute als "open systems" in aller Munde ist. 
Die Rechnung ging auf: Schon mitte der achtziger Jahre begann die National Science Foundation in den Vereinigten Staaten mit dem Aufbau des NSFNET, einem Netz mit Verbindung zum ARPANET, aber auch zu regionalen Netzwerken auf gleicher Technologiebasis.

Heute bezeichnet man mit dem Namen "internetwork" Netzwerk aus Teilnetzwerken der verschiedensten Technologien, die durch das darüberliegende TCP/IP zusammengebunden werden. 
Die weltweite Verbindung von TCP/IP-Netzwerken, die aus dem ARPANET entstanden ist, trägt jedoch den Namen "das Internet" (mit betontem "das" und großem "I").
Alle wichtigen staatlichen und wirtschaftlichen Institutionen in den USA sind mittlerweile auf die eine oder andere Weise mit dem Internet verbunden.
Auch in Deutschland findet, wenn auch mit mehreren Jahren Verzögerung, eine ähnliche Entwicklung statt.
So etwas wie eine einheitliche Verwaltung gibt es jedoch nicht.
Das Internet Activities Board definiert das Internet selbst dann in einem seiner Informationenpapiere auch als einen "lockeren, internationalen Zusammenschluß miteinander verbundener Netzwerke, das direkten Kontakt von Rechner zu Rechner durch freiwilliges befolgen offener Protokollstandards und -prozeduren ermöglicht."
Diese Definition ist in der Tat schwammig genug, um einem Gebilde wie dem Internet gerecht zu werden.

Ein anderer Pluspunkt von TCP/IP ist eher für den Programmierer interessant:
Die totale Unabhängigkeit der Applikation von der darunterliegenden Netzwerkebene.
Ein Programm, das in einer Internet-Umgebung läuft, muß sich nicht darum kümmern, wie es seine Datenpakete aus dem lokalen Ethernet über das Datex-P-Gateway nach Übersee und dort in das lokale Token-Ring-Netzwerk schicken muss. 
Das Internet-Protokoll kümmert sich darum, die Details der verschiedenen unterliegenden Netzwerke und Transportmechanismen zu verbergen. 
Es kümmert sich auch darum, die schnellste oder am wenigsten ausgelastete Route durch das Netz zu suchen.

Diese Transparenz wird vom Protokoll auch an die darüberliegenden Anwendungen und letztendlich an den Benutzer weitergegeben. 
Für einen Benutzer einer Anwendung im Internet ist es vom Aufwand her kein Unterschied, ob er seine Daten von einer lokalen Platte, aus dem inhouse-Netzwerk, von einem Server irgendwo in Deutschland oder gar in Taiwan oder den USA bekommt.
Allein an der Übertragungsgeschwindigkeit könnte man einen Unterschied  feststellen.
Leider birgt diese Transparenz gelegentlich Probleme in sich: 
Für den Benutzer ist es gleich schwierig, einen Dienst über Transatlantik-Leitungen zu benutzen wie einen Dienst im lokalen Ethernet.
Es könnte sogar sein, daß sich ein guter Teil der Netzwerk-Benutzer gar nicht darum kümmert, woher genau die Daten jetzt kommen und wieviel Technik dafür in Bewegung gesetzt werden muß.
In Folge kommt es zu den Stoßzeiten auf überregionalen Leitungen mehr oder weniger stark zu Kapazitätsproblemen.

## Reichhaltiges Angebot

Das Internet stellt seinen Benutzern auf der Basis von TCP/IP als Transportprotokoll eine Vielzahl von Dienstleistungen zur Verfügung. 
Diese Dienste sind normalerweise auf der Basis eines weiteren Protokolles realisiert, das wiederum auf TCP/IP aufsetzt 
(vgl. [Internet Technik Artikel]({{< ref "/content/posts/1993-04-01-tcpip-technik.md" >}})).

Der erste Dienst, den man als Benutzer im Internet kennenlernt, ist wahrscheinlich electronic mail.
Mail erlaubt es, Textnachrichten und neuerdings auch multimediale Dokumente an andere Benutzer im Netz zu verschicken.
Die Zustellung der Mail erfolgt, in dem der eigene Rechner nach dem Abschicken der Mail eine Verbindung zum Zielrechner aufbaut und die Mail dort online und direkt einliefert.
Bei einer schnellen Netzverbindung ist die Mail praktisch Sekunden nach dem Drücken der Returntaste beim Empfänger.

Viele bekannte Firmen sind im Netz durch Mitarbeiter oder sogar mit einer Supportadresse vertreten.
Darunter sind so illustre Namen wie Motorola, Intel, AT&T, Microsoft, Borland, Seagate, Prime, NeXT, SUN, DEC, IBM, HP, Commodore, Atari und viele andere mehr, darunter auch zahllose kleinere Firmen. 
Auch sind fast alle Universitäten in den meisten Ländern direkt zu erreichen.
Wer Freunde oder Bekannte hat, die als Austauschstudent an einer ausländischen Universität sind, der wird electronic mail als schnelles und billiges Briefmedium schätzen lernen. 
Für den Studenten taugt Mail auch, um sich mit den Autoren von Seminarpapieren kurzzuschließen und zusätzliches Material für den Vortrag zu bekommen oder um Fragen zu stellen.

Wer die Mailgrößen und die Zustellgeschwindigkeiten von Mailboxnetzen gewohnt ist, wird im Internet allerdings umdenken müssen. 
Internet ist in der Lage, in kurzer Zeit große Datenmengen zu bewegen und dementsprechend wird dieser Dienst auch genutzt. 
Es kann einem leicht passieren, daß man auf eine Anfrage, ob diese oder jene Datei vorhanden sei, kein "Ja", sondern kurzerhand die Quelle zugestellt bekommt.

Mit Mail ist es möglich, private Nachrichten an Personen zu verschicken. 
Auf dem Internet gibt es einen anderen Dienst, News, der es erlaubt öffentliche Nachrichten an Sachgruppen, sogenannte Newsgroups, zu adressieren.
Eine Newsgroup ist gewissermaßen ein öffentliches Diskussionsforum, das einem bestimmten Thema gewidmet ist.
Insgesamt gibt es weit über 2500 verschiedene Newsgroups mit einem Themenspektrum, das von Computerthemen über Wissenschaft, Hobby, politischer Diskussion bis hin zu bloßem Jux reicht.
Typische Laufzeiten von Nachrichten in einer Newsgroup liegen dabei in der Gegend von 6-10 Stunden.
In dieser Zeit ist der eigene Text einmal rund um die Erde verteilt worden und viele tausend Mal kopiert worden.

Mit einer Nachricht in einer Newsgroup erreicht man schnell ein großes Publikum.
Selbst bei exotischen Problemen oder Fragestellungen ist es wahrscheinlich, innerhalb eines Tages Personen zu finden, die ein ähnliches Problem auch schon einmal gehabt haben und einem möglicherweise weiter helfen können.
Gerade für jemanden, der sich mit Softwareentwicklung befaßt, sind die News eine wichtige Quelle für Informationen, praktische Erfahrungsberichte und Support, die beim Hersteller oft nur schwer zu bekommen sind.

Viele nützliche PD-Programme konnten nur deswegen entstehen, weil Programmierer in den entferntesten Gegenden der Erde per News und Mail Quellen und Fehlerreports austauschen können und so trotz der großen Entfernungen eng zusammenarbeiten können.
Die public domain UNIX-Versionen Linux und 386BSD sind nach Megbytes gemessen die größten Produkte einer solchen Zusammenarbeit, aber auch viele andere Werkzeuge für den täglichen Einsatz sind auf diese Weise entstanden. 
Allen voran stehen die Programme, die man zur effizienten Nutzung von News und Mail benötigt:
Programmpakete zum Lesen, Schreiben, Verschicken und Archivieren von News und Mail.

Die neuesten Versionen dieser Programmpakete finden sich in Archiven, die per anonymous FTP zugänglich sind.
FTP steht für "File Transfer Protocol" und ist zugleich der Name eines Übertragungsprotokolls als auch der Name der Anwendung, die dieses Protokoll benutzt, um per Internet Dateien zu übertragen. 
Viele Institutionen, die einen schnellen Internet-Anschluß haben und ein wenig Plattenplatz erübrigen können, richten Bereiche ein, in denen man auch ohne Paßwort per FTP Programme ablegen oder abholen kann.
Teilweise sind diese Rechner so konfiguriert, daß sie ihre Datenbestände untereinander automatisch abgleichen, ihre Platten also gegenseitig spiegeln.
Auf diese Weise erübrigt sich für den Benutzer das Horten von Quelltexten auf der eigenen Platte:
Wenn man ein Programmpaket benötigt, um es zu installieren oder mit den Quellen zu arbeiten, wird man sowieso nicht das private Archiv mit der veralteten Version aufsuchen, sondern sich per FTP eine aktuelle Version desselben Paketes holen.

Das Hauptproblem dabei ist es lediglich, einen Server zu lokalisieren, der die gewünschten Daten auch anbietet.
Dafür gibt es im Netz öffentlich zugängliche Datenbanken, die einen Index über dreistellige Gigabytemengen auf Software enthalten, die Archies.
Ein Archie ist eine Datenbank, die typischerweise im Tages- oder Wochenrhytmus die kompletten Inhaltsverzeichnisse einiger hundert FTP-Server abfragt und zu einem Gesamtindex verarbeitet.
Man kann den Archie nach Namen oder Beschreibungen von Programmpaketen suchen lassen und erhält eine Liste aller Quellen für das gesuchte Programmpaket, die dem Archie bekannt sind.
Dazu kann man sich direkt auf dem Archie einloggen und einer simplen Abfragesprache bedienen.
Richtig bequem wird so eine Abfrage aber erst mit einem Abfrageprogramm wie xarchie (für XWindows), das man mit der Maus bedienen kann.
Die Beschaffung eines bestimmten Programmpaketes beschränkt sich dann auf die Eingabe des Paketnamens und das Anklicken der Knöpfe "Query" und (nach Auswahl des gewünschten Servers) "FTP".

Es gibt im Internet noch weitere frei zugängliche Datenbanken. 
Da es jedoch keine zentrale Administration des Netzwerks gibt, ist es hier etwas schwierig einen Überblick zu bekommen.
Es ist zum Beispiel bekannt, daß sehr viele Bibliotheken in den USA einen Zugang ins Internet haben und ihre Kataloge als Datenbank öffentlich zugänglich machen.
Aber auch andere Institutionen bieten Datenbanken zur freien Abfrage an. 
Man erreicht diese Datenbanken per TELNET, einem TCP/IP-Dienst, der es einem erlaubt, sich auf einem entfernten Rechner einzuloggen.
Per FTP sind Texte erhältlich, die den Versuch einer Katalogisierung solcher Dienste darstellen und die Netzadressen, Logins und Passwörter enthalten, die man benötigt, um arbeiten zu können.
Der nächste logische Schritt sind Datenbankabfrageprogramme, die eine Anfrage nehmen und sie allen Datenbanken stellen, die ihnen bekannt sind.
Solche Dienste sind WAIS (Wide Area information Service) und gopher.

## Wie man sich anschließt

Man kann auf zwei Wegen an einen Internet-Zugang kommen.
Die eine Methode ist es, sich einen Systembetreiber zu suchen, dessen Rechner am Internet angeschlossen ist und der einem die Benutzung seines Rechners erlaubt.
Man kann sich dann auf diesem Rechner einloggen und die Internet-Dienste dieses Rechner online nutzen.
Die andere Methode wäre, auf dem eigenen Rechner zu arbeiten und nur die eigenen IP-Pakete an einen Internet-Rechner weiter zu routen, etwa über ein Modem und SL/IP (Serial Line Internet Protocol).
Die meisten Internet-Anbieter lassen einem die Auswahl zwischen beiden Methoden des Anschlusses.

Ein Anschluß ans Internet ist derzeit jedoch eine teure Sache, falls man nicht gerade Student an einer Universität mit freiem Zugang zum Internet ist.
Wer immer Internet anbietet, der muß eine Standleitung oder etwas mit ähnlicher Charateristik unterhalten.
Dabei kann es sich um eine Datex-P, ISDN- oder Modemstrecke handeln.
Der Betreiber dieser Strecke wird natürlich versuchen, seine Kosten auf die Nutzer umzulegen.
Im Endeffekt liegen die Kosten für vernünftig nutzbaren Internet-Anschluß derzeit bei etwa 50 DM/Monat mit starken geographischen Abweichungen.

In Deutschland gibt es drei verschiedene Anbieter, die Internet-Dienste verkaufen können.
Diese sogenannten Provider sind jedoch nur für kommerzielle Kunden und Institutionen interessant.
Es handelt sich um EuNet Germany GmbH in Dortmund, XLINK in Karlsruhe und den DFN Verein.
Für Privatpersonen ist eher der Individual Network e.V. ("das IN") interessant.
Dieser Verein hat bei zweien dieser drei Anbieter das Recht gekauft, deren Internet-Leitungen zu benutzen und dieses Recht an seine Mitglieder weiterzugeben.
Auf diese Weise kann das IN seinen Mitgliedern einen günstigen Zugang ins Internet verschaffen, wenn diese die dazu notwendig Infrastruktur vor Ort organisieren können.

Wenn man sich in der Nähe eines solchen Zugangspunktes wohnt, also etwa in Kiel, Hamburg, Berlin, Oldenburg, im Ruhrgebiet, in Frankfurt oder
in München, dann genügt es, sich an den entsprechenden Anbieter zu wenden (siehe Kasten"Adressen").
Ansonsten wird man sich überlegen müssen, ob man einen Anschlußpunkt in der Nähe finden kann oder wie man die Entfernung zum nächsten Anschlußpunkt überbrücken kann.

## Informationsquellen

Um Neueinsteigern ins Internet bei der Orientierung zu helfen und einen Überblick über die verfügbaren Informationen und Dienste zu geben, hat man eine Reihe von RFCs mit Einsteierinformationen zusammengestellt.
Diese RFCs sind in einer gesonderten Reihe als "For your information" oder kurz FYI-Texte zusammengefaßt worden.
Von besonderem Interesse sind FYI 4, der sich mit häufig gestellten Fragen von Internet-Neulingen beschäftigt, FYI 8, der sich mit der Sicherheit einer Internet-Installation befaßt und FYI 10, der einen Überblick über im Internet verfügbare Dienste gibt.

## Literatur

- "Internetworking with TCP/IP; Principles, Protocols, and Architecture",  by Douglas Comer, Prentice Hall, ISBN 0-13-470154-2.
- "The Matrix; Computer Networks and Conferencing Systems Worldwide", by John S. Quarterman, Digital Press, ISBN 0-13-565607-9.</LI>
- "!%@:: A Directory of Electronic Mail Addressing and Networks", by Donnalyn Frey and Rick Adams, O'Reilly & Associates, Inc., ISBN 0-937175-39-0.
- "The User's Directory of Computer Networks",  Edited by Tracy L. LaQuey, Digital Press, ISBN 0-13-950262-9.
- "Where to Start - A Bibliography of General Internetworking Information", by Bowers, K., T. LaQuey, J. Reynolds, K. Roubicek, M. Stahl, and A. Yuan, RFC 1175, FYI 3, CNRI, U Texas, ISI, BBN, SRI, Mitre, August 1990.
- "The Hitchhikers Guide to the Internet", by Krol, E., RFC 1118, University of Illinois Urbana, September 1989.
- "IAB Official Protocol Standards"</I>, (currently, RFC 1280).

# RFC

Ein "Request for Comments", kurz RFC,  ist ein Papier, das sich in irgendeiner Form mit im Internet verwendeten Verfahren beschäftigt.
Es kann sich dabei um eine Anmerkung zu bestehenden Verfahren, einen Verbesserungsvorschlag oder den Vorschlag zu einem neuen Verfahren handeln.
Jeder, der am Internet interessiert ist, kann einen solchen RFC beim RFC Editor einreichen.
Derzeit ist der RFC Editor Jon Postel, der unter der Internet-Adresse RFC-EDITOR@ISI.EDU zu erreichen ist.
Wie eine Einsendung an den RFC-Editor auszusehen hat, um ihm die Arbeit zu vereinfachen ist auch in einem RFC ([RFC 1111](http://src.doc.ic.ac.uk/public/rfc/rfc1111.txt.gz) beschrieben.

Ein solches Papier kann den Status "zur Information" erhalten, wenn es sich nur um eine Anmerkung handelt.
Enthält der RFC eine Spezifikation, die einmal ein Standard werden soll, so kann das Internet Activities Board (IAB) das Papier prüfen und zum "proposed standard" erklären.
So eine Spezifikation soll dann die Grundlage für zu entwickelnde Programmpakete sein, d.h. es braucht noch keine funktionierende Implementation des Standards zu geben.

Sobald es Erfahrungen mit dem neuen Vorschlag gibt, frühestens aber nach einem halben Jahr, kann die Spezifikation zum "draft standard" werden.
Dazu muß es mindestens zwei Implementationen geben, die unabhängig voneinander aus der Spezifikation entwickelt worden sind und die trotzdem zusammenarbeiten können.
An einem "draft standard" wird nichts wesentliches mehr geändert; Modifikationen dienen nur noch der Ausbesserung von Fehlern und Ungenauigkeiten.

Schließlich wird die Spezifikation nach angemessener Zeit zum "standard" befördert und ist damit ein fester Teil der Internet-Spezifikationen.
[RFC  1280](http://src.doc.ic.ac.uk/public/rfc/rfc1280.txt.gz) gibt eine Übersicht über den Standardisierungsprozeß und nennt den Status der verschiedenen Dokumente.

Nicht alle Standards im Internet müssen von allen Programmpaketen unterstützt werden.
Die RFCs unterscheiden zwischen Fähigkeiten, die alle beteiligten Programme unterstützen müssen (required), zwischen Optionen, die alle unterstützen sollten (recommended) und zusätzlichen Features, die wirklich optional sind (elective).

Um in der Entwicklung der Standards im Internet auf dem Laufenden zu bleiben, kann man die neu erscheinenden RFCs abonnieren.
Dazu sendet man eine E-Mail an RFC-REQUEST@NIC.DDN.MIL, die die eigene Netzadresse enthält.
Diese Adresse wird dann in einen Verteiler übernommen und fortan bekommt man alle neuen RFCs per E-Mail zugestellt.
Vorausgegangene RFCs sind in verschiedenen Archiven zu bekommen.
Eine Liste dieser Archive und eine Anleitung, wie man die betreffenden Dokumente bekommen kann, kann per FTP als isi.edu:/in-notes/rfc-retrieval.txt bezogen werden.
Alternativ kann man auch eine E-Mail an rfc-info@isi.edu senden, die als Nachrichtentext nur die eine Zeile "help: ways_to_get_rfcs" (ohne die Anführungszeichen) enthält.
Die RFCs bis Nummer 1357 sind außerdem auf der Desktop Library CD von Walnut Creek enthalten.
