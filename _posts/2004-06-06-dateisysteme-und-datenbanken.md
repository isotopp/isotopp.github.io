---
layout: post
title: "Dateisysteme und Datenbanken"
author-id: isotopp
feature-img: assets/img/background/rijksmuseum.jpg
date: 2004-06-06 14:06:40 UTC
tags:
- filesystems
- datenbanken
- "lang_de"
---
Der Artikel [Filesysteme sind Datenbanken](http://matthias.leisi.net/archives/45_Filesysteme_sind_Datenbanken.html) von Matthias Leisi regt mich an, hier mal ein paar Sachen aufzuschreiben, die ich schon länger vor mir her kullere.

Die meisten Unix-Dateisysteme trennen eine "Gruppiere Blocks in Dateien"-Ebene (Blockverwaltung) und die "Gruppiere Dateien in Hierarchien"-Ebene (Namensraumverwaltung) voneinander. Die Blockverwaltung ist relativ gut verstanden und der I/O-Layer von Datenbanken überlegen. Die durch WinFS ausgelöste Diskussion findet stattdessen im Bereich Namensraumverwaltung statt.

## Blockverwaltung und die Überlegenheit der Filesystem API

Die Ebene der Blockverwaltung bei Dateisystemen ist sehr hoch optimiert und muß akzeptable Performance unter extrem variablen Benutzungspatterns abliefern können. Ein einzelnes Dateisystem kann im selben Moment sehr viele kleine Dateien enthalten, wie sie zum Beispiel in einem Cyrus-Mailspool oder einem INN tradspool vorkommen, und einige wenige sehr große Dateien, wie sie zum Beispiel von einer Datenbank angelegt werden. Es muß damit zurecht kommen, daß eine Anwendung sehr viele sehr kleine Dateien in Folge öffnen will - der IMAP-Server, der durch den Mailspool tobt, und daß zeitgleich sehr viele andere Anwendungen auf einer großen Datei hin- und her seeken und zeitgleich Stücke der dieser großen Datei beschreiben und lesen wollen - die Threads der Datenbank, die auf das Datenbankfile zeitgleich einschlagen. 

Die API, mit der dies abgewickelt wird, ist extrem simpel - das open/read/write/seek/close/lock-Interface ist steinalt und sehr gut getestet. Es ist - inklusive von neueren Optimierungen wie readv/writev und mmap - auch sehr effizient und erlaubt es Anwendungen, Daten von der Platte zu lesen oder auf die Platte zu schreiben, ohne daß das Betriebssystem dafür Bytes umkopieren müßte. Es ist sogar so effizient, daß einige Datenbanken die Option bieten, auf BLOB-Daten mit Hilfe dieser API zuzugreifen, indem die Datenbank die Tabelle, bzw. die Objekte in der Tabelle als NFS-Dateibaum exportiert.

Auf dieser Ebene des Dateisystems geht es also nicht darum, irgendwelche Queries zu beantworten oder Daten wiederzufinden, sondern nur darum, Daten mit sehr heterogener Granularität und sehr variablen Anforderungen an den Zugriff möglichst effizient in den Speicher zu schaffen bzw. auf die Platte zu befördern.

Dateisysteme machen - zumindest in Unix - keine Annahmen über die Struktur von Daten. Dateien als solche sind strukturlose Blobs, und den Anwendungen steht es dann frei, eine Struktur in die Daten hinein zu interpretieren. Das System aber hält seine Finger da heraus, und manipuliert Dateien entweder als Klotz, oder Stücke davon als Byteranges. 

Das ist eine bewußte Entscheidung der Entwickler von Unix gewesen, nachdem sie Erfahrungen mit anderen Systemen hatten und wußten, wieviel mehr Komplexität auf Systemebene notwendig ist, damit Dateien mit Satzstrukturen behandelt werden können. Andere Systeme zu dieser Zeit haben Dateien mit Satzstrukturen implementiert (ISAM-Files und ähnliches), und sind damit eher weniger gut gefahren: Datenbanken als Userland-Anwendungen sind leichter zu implementieren und zu optimieren als Datenbanken als Teil des Kernels, und Datenbanken als Teil des Kernels bieten keine Performance-Vorteile.

Wir nehmen die Folgende Liste der Vorteile auf der Ebene der Blockverwaltung mit:

- Keine Annahmen über die Struktur erlaubt Freiheit in der Definition der Datenstrukturen und Freiheit in der Strukturierung der Zugriffe.
- Zero Copy I/O

## Namensraumverwaltung

Man kann sich die Blockverwaltungsschicht wie ein einziges großes Verzeichnis ohne Unterverzeichnisse vorstellen, in dem alle Dateien eines Dateisystems enthalten sind, und zwar mit ihrer Inode-Nummer als Name. Die Aufgabe der Namensraumverwaltung ist nun, die Pfadnamen, die im Userland gebräuchlich sind, in Inodenummern zu übersetzen. Auf der Ebene der Blockverwaltung arbeitet Unix dann immer nur mit den Inodenummern und den daran hängenden Verwaltungsstrukturen, den Inodes. Es gibt keine Funktion openi() ("Open File by Inode number") in der Kernel-API.

Über dieser Schicht liegt die Namensraumverwaltung. Die ist in unixoiden Systemen traditionell hierarchisch strukturiert und der Zugriff auf Daten erfolgt immer über Pfadnamen relativ zum aktuellen Verzeichnis eines Prozesses oder zur aktuellen Wurzel des Dateisystems eines Prozesses. Dies ist ein sehr simpler Mechanismus der Strukturbildung auf dem flachen See der Inodenummern, der viele Jahre ausgereicht hat, um Dateien zu sortieren und wiederzufinden.

Zur Zeit geschieht dies immer intern im Kernel. Die Funktion, die dies macht, bekommt entweder das aktuelle Wurzelverzeichnis des aufrufenden Prozesses (wenn der Dateiname mit / anfängt) oder das aktuelle Arbeitsverzeichnis (in allen anderen Fällen) als Startwert und übersetzt den Pfadnamen dann Schritt für Schritt rekursiv in eine Folge-Inodenummer und einen Pfadrest. 

Wir nehmen an Gedanken aus dieser Sektion mit: Die Ansteuerung von Dateien erfolgt in Unix traditionell über den Pfad und nicht über eine ID wie die Inode-Nummer. Das Auflösen des Pfadnamens in eine Inode-Nummer erfordert weitere, über die Rechte an der Datei hinausgehende Zugriffsrechte, die vom verwendeten Pfadnamen abhängen. Für ein modernes Rechtesystem ist das weder notwendig noch wünschenswert, und es sollte möglich sein, Dateien über eine ID - die Inode-Nummer oder eine Datei-UUID anzusprechen. Windows- und Apple-Dateisysteme erlauben dies sogar schon zum Teil.

## Andere Strukturbildner

Einige Artikel diskutieren nun andere Strukturbildner für ein Dateisystem. El Reg hat zum Beispiel ein [Interview](http://www.theregister.co.uk/2002/03/29/windows_on_a_database_sliced/) mit den Entwicklern von BeOS über die Probleme, die sie bei der Entwicklung der BeOS "Dateisystem"-Datenbank gehabt haben. Dem Interview kann man entnehmen, daß eine Datenbank im Userland zwar keine Performance-Vorteile hat, aber die Synchronisation zwischen Datenbank und Dateisystem leichter zu realisieren ist, wenn entsprechende Synchronisationsprimitive existieren und das Interface zu diesen Funktionen ist leicher zu realisieren, wenn die Datenbank Teil des Kernels ist.

Die Beispiele, die für BeOS gegeben werden, gehen von einer traditionellen Datenbank mit Feldern und Werten aus. Der Artikel mit dem langatmigen Titel [Namespaces As Tools for Integration the Operating System Rather As Ends in Themselves](http://www.namesys.com/whitepaper.html) schildert die Sicht von Hans Reiser auf dieses Problem. In dem Artikel versucht Hans Reiser zu erläutern, warum er eine feste Tabellenstruktur oder RDF-Syntax für eine Abfragesprache in Dateisystemen eher für sinnlos halt. Seine Beweisführung streift schon fast das Argument "Google für Dateisysteme". Wenn er dann jedoch beginnt, eine Abfragesprache mit einer "dateinamenähnlichen" Syntax herzuleiten, erkennt man wieder Strukturen mit einer "Name=Wert"-Syntax.

Reiser geht davon aus, daß es Dateisystem-Plugins gibt, die er Klassifikatoren nennt. Diese Plugins generieren Schlüsselwerte, unter denen die Datei zu finden ist. In einem traditionellen Unix-Dateisystem stellt der Benutzer die Schlüssel bereit, indem er eine Datei unter einem Namen in einem Verzeichnis ablegt (und durch Links kann eine Datei unter mehr als einem Schlüssel abgelegt sein). In Reisers Modell werden weitere Schlüssel automatisch generiert - abhängig vom Typ der Datei. Das kann etwa ein Volltextindex sein - eine Datei ist dann unter allen in der Datei vorkommenden Worten zu finden, oder es können Schlüssel-Schlüsselwert Paare sein wie "mime-type: audio/mp3", "subject: strike" oder "from: santa".

In seiner Syntax ist "/etc/passwd" die Datei passwd in der "etc"-Gruppierung, während "[dragon gandalf bilbo]" die Datei ist, die den drei genannten Schlüsselwerten zugleich genügt. Später verallgemeinert er dann den "/"-Operator zu einer "Syntax Barrier" und kommt so zu Queries mit "Funktionen" wie "case-insensitve/[computer privacy laws]", zu Security Barriers wie "[my secrets]/[love letter susan]" und zu einer Attributsyntax wie "[subject/[illegal strike] to/elves from/santa document-type/RFC822 ultimatum]". Er weist darauf hin, daß man zu einer quasi-relationalen Query gelangt, wenn man das vorhergehende Beispiel zu "[subject/strike to/elves from/santa document-type/RFC822]" vereinfacht.

## Objektklassen und Attributsyntax

Und an dieser Stelle landet man dann bei weiterem Nachdenken bei LDAP. Während LDAP eine stark denormalisierte Datenbankstruktur ist (LDAP ist nicht einmal in erster Normalform), besteht der Wert von LDAP paradoxerweise darin, ein sehr rigides Datenmodell zu haben. LDAP definiert einige Datentypen und die für diese Datentypen zugelassenen Attribute sowie ein Vererbungssystem für Typen. Alle LDAP-Anwendungen verwenden diese Datentypen oder erben von ihnen, sodaß unterschiedliche LDAP-Storages untereinander kompatibel sind. 

Der Wert von LDAP besteht also nicht im Storage oder der Abfragesprache (beide sind kaputt bzw. unvollständig), sondern im Schema und im Wire-Protokoll, die beide extrem interoperabel sind und die interoperabel erweiterbar sind. Der Wert von LDAP liegt also in der Normierung.

Diese Überlegung ist auch auf eine Dateisystem-Abfragesprache anwendbar: Betrachtet man die Beispiele von Reiser genauer, findet man im Grunde zwei Szenarien, die Reiser unterscheidet.

Das eine Szenario sind Anfragen nach Daten einer bestimmten Objektklasse ("mime-type: audio/mp3", "mime-type: message/rfc822"), bei denen der Fragesteller dann Annahmen über das Vorhandensein bestimmter Attribute machen kann und bei denen die weitere Anfrage dann das Vorhandensein und die Bedeutung bestimmter Attributnamen voraussetzen kann. Das Characteristische an der Anfrage "[subject/[illegal strike] to/elves from/santa document-type/RFC822 ultimatum]" ist ja die Typabsicherung "document-type/...". Nur deswegen kann sich der Fragesteller sicher sein, daß Attribute wie "subject", "from" und "to" existieren und daß ihre Werte die gesuchten Bedeutungen haben.

Die zweite Sorte Frage ist die Googlesuche nach dem Vorkommen von bestimmten Schlüsselworten _irgendwo_ in der Datei, ohne Rücksicht auf die Strukturen, in die sich die Datei einpassen läßt. Das ist quasi die klassische Volltextsuche, mit einem Klassifikator-Plugin, daß für alle möglichen (auch multimedialen) Datentypen so viele sinnvolle Worte wie möglich extrahiert.

Man beachte, daß der erste Fall nicht wirklich ein hierarchisches, denormalisiertes Datenbankschema benötigt wie etwa LDAP es bereitstellt. Es ist dagegen vollkommen ausreichend, ein objektrelationales System zu haben, in dem eine Entity von einer anderen Entity erben kann und für dieses System ein Schema bereitzustellen, das Attribute für alle gängigen und interessanten Mime-Types bereitstellt.

Neben der Arbeit der Implementierung eines solches Dateisystems ist also weitere Arbeit notwendig, nämlich die Normierung von Datenstrukturen, also die Erarbeitung einer Taxonomie von Attributen und Objektklassen für die in einem modernen System vorkommenden Mime-Typen. 

Auch an der Abfragesprache ist noch Arbeit zu leisten - die von Reiser vorgeschlagene Syntax ist einfach, aber unvollständig und definiert keine vollständige Navigation. Die Abfragesprache von LDAP ist ebenfalls unvollständig und hat eine ganze Reihe von Einschränkungen, nicht nur vom relationalen Standpunkt aus, sondern schon auf einer sehr viel niedrigeren Ebene - hier möchte man sich eher bei den Gedankenmodellen von XPath und XQuery bedienen, die eine reichere Syntax und mehr Möglichkeiten liefern. Auf diese Weise wäre auch die Adressierung von Elementen _in_ Dateien möglich.

## Fazit

Wir nehmen abschließend mit: 

Ein Dateisystem ist keine Datenbank im herkömmlichen Sinne, sondern ein Speicher, der auch mit unstrukturierten oder partiell strukturierten Daten klarkommen muß. Ein wenig mehr Struktur und ein wenig bessere Rechnerchemöglichkeiten täten heutigen Dateisystemen jedoch sehr gut. Dabei ist jedoch der Strukturlosigkeit Rechnung zu tragen und es sind neben strukturierten Anfragen im SQL-Stil auch strukturlose Anfragen im Stile einer Volltextsuche über alle Attribute zu ermöglichen.

Diese Anfragen dienen weiterhin nur zur Bestimmung der Inodenummer/ID/UUID einer Datei, also zur Lokalisierung der Datei. Der weitere Zugriff kann dann ganz normal über die Blockverwaltung erfolgen, und muß nicht langsamer als heutzutage sein.

Der Wert einer solchen Datenbank als Dateisystem ergibt sich wie bei LDAP aus der Normierung der Schemata. Es sind also rechtzeitig sinnvolle Schemata für gängige Systemdatentypen bereitzustellen und es ist ein offener, herstellerunabhängiger Prozeß für die Normierung und Entwicklung einer Hierarchie von Objektklassen und Attributtypen bereitzustellen.