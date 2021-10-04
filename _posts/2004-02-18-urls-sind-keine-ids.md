---
layout: post
published: true
title: URLs sind keine IDs
author-id: isotopp
date: 2004-02-18 20:45:55 UTC
tags:
- blog
- lang_de
feature-img: assets/img/background/rijksmuseum.jpg
---
Ich habe mich
an [anderer Stelle](http://blog.koehntopp.de/archives/167_Wir_sind_so_geil_.html)
bereits über Blogs und ihre Technik aufgeregt. Hier eine etwas
besser geordnete Präsentation meiner Gedanken zu diesem Thema:

Die Grundidee, die hinter Blogs steckt, ist ja, ein
Diskurs-System im Web zu haben. Durch die Einrichtung eines Blogs
kann sich ein Autor ein Forum verschaffen, in dem er Texte von
sich veröffentlicht. Diese Texte sind auf jeden Fall
chronologisch sortiert und außerdem optional durch ein
Kategoriensystem und durch eine Volltextsuche erschlossen.

Zu einem Diskurs-System wird das ganze dadurch, daß man
einerseits Kommentare zu den Texten zulässt, andererseits die
Bezugnahme auf die Texte ermöglicht. Bezugnahme erfolgt
traditionell durch einen Trackback-Link auf einen Artikel:
Jemand, der zu einem Artikel eine Gegenrede veröffentlicht,
verlinkt den Originalartikel per Trackback-Ping und der
Originalartikel bekommt so automatisch einen Link (mit Preview)
auf die Gegenrede.

Soweit die eigentlich hervorragende Idee. Leider ist die
Implementierung mehr als bescheiden.

Das Problem entsteht schon bei der Bezugnahme auf Artikel. Blogs
verwenden für diese Bezugnahme in der Regel URLs, aber dieser
Ansatz hat aus einer ganzen Reihe von Gründen Probleme. Ich muss
ein wenig ausholen, um diesen Gedanken zu erläutern.

## Objekte und ihre Namen

Etwas, auf das wir Bezug nehmen, nennen wir ein Objekt. Wir
könnten auch Dingsda sagen, aber Objekt klingt cooler. Um auf
ein Objekt Bezug nehmen zu können, müssen wir es benennen oder
identifizieren können. Wir geben dem Objekt also eine
Bezeichnung und verwenden die Bezeichnung als Stellvertreter für
das Objekt.

Im mathematischen Sinne haben wir eine Menge von Objekten und
eine zweite Menge von Namen (IDs) und wir haben eine Bijektion
zwischen den beiden Mengen - wir ordnen also jedem Objekt
_genau einen_ Namen zu. Wenn wir jetzt entscheiden wollen,
ob zwei Objekte gleich ist, genügt es, die IDs der Objekte zu
vergleichen.

Okay, klingt uncool. Wo ist der Trick? 

Man stelle sich die Menge der Objekte als einen Newsspool von
Artikeln auf einem News-Server vor - friedolin hat davon einige
Terabyte. Wenn wir einen neuen Artikel bekommen, müßten wir
feststellen, ob wir diesen Artikel schon haben, bevor wir ihn
einsortieren, denn sonst haben wir Duplikate. Ohne IDs können
wir diese Feststellung nur treffen, indem wir den Artikel gegen
jeden Artikel vergleichen, den wir schon haben. Wir müßten also
für jeden neuen Artikel einige Terabyte Newsspool durchsuchen
und können den Artikel akzeptieren, wenn man Ende der Suche ein
negatives Ergebnis kommt.

Stattdessen unterhalten wir eine Liste der IDs der Artikel - die
History. Wenn wir einen neuen Artikel bekommen, nehmen wir die
ID des Artikels und schlagen diese ID in der History nach. Nur
wenn die ID noch nicht in der History ist, akzeptieren wir den
Artikel. Die History ist wesentlich kleiner als der Newsspool
selber, und daher schneller zu durchsuchen. Wenn wir die History
als Hash organisieren, können wir sie außerdem mit konstantem
Aufwand durchsuchen - der Lookup ist also immer gleich schnell,
egal wie viele Terabyte Spool wir haben. Wir können auch sehr
schnell den Speicherort eines Artikels bestimmen, wenn wir die
ID des Artikels kennen.

IDs erlauben uns generell, Entscheidungen zu treffen, ob ein
Objekt bereits vorhanden ist oder nicht. Wir können auf diese
Weise zwei Objektpools synchronisieren, ohne mehr Daten
übertragen zu müssen als notwendig. Sind unsere Objekte zum
Beispiel die Datenbankeinträge eines Palm Pilot, dann kann auf
der Grundlage der IDs festgestellt werden, welche Objekte auf
dem jeweils anderen Ende der Synchronisation neu oder geändert
sind und der Inhalt des Palm Pilot kann mit dem Inhalt des PCs
abgeglichen werden.

## Eigenschaften von Namen

Wenn man sich IDs für Objekte überlegt, dann muss man sich über
einige Dinge Gedanken machen. IDs haben einen Scope, also eine
Grundmenge oder Welt, innerhalb derer sie gelten und Objekte
eindeutig bezeichnen.

Die Verkleinerung eines Scopes ist in der Regel kein Problem:
Wenn "kris" ein eindeutiger Username innerhalb einer Firma ist,
dann ist "kris" auch innerhalb einer Abteilung dieser Firma noch
eindeutig.

Die Vergrößerung eines Scopes ist ein Problem, denn es kann
andere Benutzer in anderen Firmen geben, die auch den Usernamen
"kris" haben, aber nicht mit diesem "kris" identisch sind.

Eine übliche Methode, dieses Problem zu lösen besteht darin, dem
Scope selber einen Namen zu geben und ihn an die ID mit
anzuhängen. Wir reden also nicht mehr von "kris", sondern hängen
den Namen der Firma mit an. Macht man das mehrfach, bekommt man
einen Rattenschwanz an immer größer werdenden Scope-IDs, einen
Pfad. "kris" in "Durlach", "Bawü", "Deutschland", "Europa",
"Erde", "Orion Spiralarm", "Milchstraße", "lokaler Cluster"
bläst einen kleinen Scope immer weiter auf und erzeugt rückwärts
einen Suchpfad, der den Speicherort von "kris" angibt.

Das ist auch das Prinzip, auf dem zum Beispiel LDAP aufbaut.
Objekte in LDAP werden identifiziert durch ihren DN
(distinguished name) und der DN ist der Pfad durch den
LDAP-Baum, der zu diesem Objekt führt - "c=de, o=firma, ou=IT,
cn=Kristian Köhntopp".

Und hier sieht man gleich zweimal, warum solche IDs
problematisch sind - sie sind gescoped, enthalten also
Lokalisierungsinformation, und sie sind nicht opak, enthalten
also Objektinformation. Der Teil des DN "c=de, o=firma, ou=IT"
ist eine Pfadkomponente, also Scope. Wechselt der Benutzer die
Abteilung, ändert sich eine Pfadkomponente (hier: ou) und damit
ändert sich der DN. Alle Stellen, an denen der DN verwendet
wird, um das Objekt zu bezeichnen, müssen mit geändert werden.
Das ist ein gängiges Problem in LDAP, und viele meiner
ehemaligen Kollegen haben es verfluchen gelernt. Ich habe diesem
und verwandten Schwierigkeiten einen eigenen
[Vortrag](http://koehntopp.de/kris/artikel/dir-vs-rel/) auf der
NetUSE Hausmesse 2002 gewidmet.

Genauer: Im Datenbanksinn ändern wir einen Primary Key und
müssen alle Foreign Keys die diesen PK bezeigen mit updaten.
"Saublöde Idee" ist das, was ein Datenbanker dazu sagen würde.
Wir können Kristian auch heiraten lassen, so daß sich sein Name,
also der cn ändert. Da Objektinformation Bestandteil des DN ist,
ändert sich der DN, wenn sich das Objekt verändert - und wieder
verbasteln wir einen PK. Auch das ist ein typisches LDAP-Problem
mit seinen nicht-opaken IDs.

Eine ID sollte also möglichst opak sein, und sie sollte
möglichst so beschaffen sein, daß Objekte während ihrer
Lebensdauer niemals ihren Scope wechseln.

Weitere Beispiel für solche Nicht-IDs sind
Xlink/Xpointer/Xpath-Ausdrücke, also alles, was die Form hat wie
"der dritte DIV nach dem zweiten H2 in dem Dokument mit der URL
....". Man kann sich leicht überlegen, daß solche Bezeichner
abhängig sind vom Layout eines Dokumentes, von der Sortierung
der Items auf der Seite und von vielerlei anderen Unwägbarkeiten
und daher sehr instabil sind. Systeme, die auf solchen IDs
aufbauen, um Daten wiederzufinden oder zu vergleichen, sind im
Kern kaputt.

In XML kann man, so man seine DTD richtig herum zusammensetzt,
jedes Element mit einem ID-wertigen Attribut mit dem Namen "id="
ausstatten und so jedem Element einen eindeutigen Bezeichner
mitgeben. Solche IDs haben Document Scope, müssen also
zusätzlich mit der URL des Dokumentes gescoped werden, damit sie
weltweit (Na ja, DNS-weit, das ist etwas anderes) eindeutig
werden.

URLs selber bezeichnen aber Speicherorte, enthalten also mit dem
Servernamen und dem Pfadnamen in der URL wiederum eine lange
Folge von Scope-IDs. Will man das vermeiden, braucht man
Lookup-Services, sie stabile Identifier in Speicherorte
umwandelt -
[http://purl.org](http://purl.org), 
[http://home.pages.de](http://home.pages.de), 
[http://makeashorterlink.com](http://makeashorterlink.com), 
[http://tinyurl.com ](http://tinyurl.com) sind nur ein paar
Dienste, die solche Lookups mit unterschiedlichen Zielsetzungen
und Lebensdauern durchführen.

Das ist zugleich eine weitere wichtige Eigenschaft von IDs: Ihre
Lebensdauer. Wie lange besteht die ID eines Objektes fort? Damit
sie als ID funktionieren kann, muss sie mindestens die
Lebensdauer des Objektes selber haben, so viel ist schon mal
klar.

Ist es sinnvoll, daß die ID eines Objektes länger besteht als
das Objekt selber? Ja, das kann sinnvoll sein. News-Server zum
Beispiel heben die IDs von Nachrichten noch auf, nachdem sie die
Nachricht bereits weggeworfen haben. Auf diese Weise können sie
Artikelschleifen immer noch verhindern, auch wenn der
eigentliche Artikel bereits gelöscht worden ist.

Langlebige IDs erlauben es auch, Objekte zu versionieren. Dazu
kann ich entweder die ID eines Objektes als Scope nehmen und die
Versionsnummer als ID in diesem Scope auffassen
("kernel-2.4-3.rpm, kernel-2.4-4.rpm", die IDs sind hier 3 und
4, und der Scope ist "kernel-2.4") oder ich kann für jede
Version eines Objektes eine neue ID vergeben und die
Versionshistorie an jeder neuen Version abspeichern ("RFC 2822,
obsoletes: RFC 822", hier werden neue RFC-Nummern für jede
Überarbeitung eines RFC-Objektes vergeben und es wird
aufgezählt, welches RFC-Objekt durch den neuen RFC ersetzt
wird).

##### URLs sind keine IDs

Wenn man jetzt ein Diskurs-System entwickeln möchte, dann muss man
sich unbedingt darüber klar sein, was die Objekte sind, mit
denen man arbeitet und welche Namen man für diese Objekte wählt.

Der erste Schritt ist, daß man sich klar darüber wird, was die
Objekte sind, mit denen man hier zu tun hat. Diese Objekte sind
*nicht* Webseiten, auch wenn viele Blogger dies vielleicht
glauben mögen. Die Objekte, um die es geht, sind Beiträge.
Beiträge können Artikel sein, die ich geschrieben habe, oder
Kommentare zu solchen Artikeln oder Kommentare zu Kommentaren.
Beiträge können auch Artikel oder Kommentare auf anderen Sites
sein.

Haarspalterei? Nein.

Blogs bezeichnen derzeit Artikel mit URLs. Aber eine URL wie 
[http://blog.koehntopp.de/archives/167_Wir_sind_so_geil_.html](http://blog.koehntopp.de/archives/167_Wir_sind_so_geil_.html)
bezeichnet genau *nicht* meinen Artikel "Wir sind so geil, wir
können XML", sondern eine Webseite, auf der sich neben meinem
Artikel auch mehr als ein Dutzend weitere Beiträge befinden, auf
der ein Haufen Navigation herumfliegt, die mit dem Artikel
nichts zu tun hat und auf der sich wechselnder Content befindet,
der mit dem Artikel absolut gar nichts zu tun hat - ein Buchtipp,
eine Werbung für T-Shirts, Kommentare zu anderen Artikeln und so
weiter.

Auch an andere Stelle begegnen wir diesem Missverständnis: 
[http://www.debian.org](http://www.debian.org) bezeichnet zum
Beispiel die Startseite des Debian-Projekts. Nur - je nachdem,
welche Sprachpräferenz man in seinem Browser konfiguriert hat,
erscheint unter dieser URL komplett anderer Text. Die URL ist
gleich, aber je nach Content-Negotiation kommen vollkommen
verschiedene Inhalte mit vollkommen verschiedenen
MD5-Prüfsummen. Nicht die URL bezeichnet die Seite, sondern erst
die Kombination von URL und Sprachpräferenz tut dies.

Genauso: 
[http://www.heise.de/newsticker](http://www.heise.de/newsticker)
bezeichnet die Newsticker-Seite von Heise. Nur - je nachdem,
wann man diese Seite abruft, erscheinen unter dieser URL
vollkommen andere Inhalte. Erst die Kombination von URL und
Zeitangabe liefert eine bestimmte Seite. Zugleich: Auf dieser
Seite befindet sich nicht ein Artikel-Objekt, sondern die Seite
enthält eine lange Sequenz von Artikel-Objekten. Mit diesem
Problem haben zum Beispiel Ratingsysteme zu kämpfen - welches
Rating hat zum Beispiel
[http://www.cnn.com](http://www.cnn.com)? Und ist das davon
abhängig, ob einer der dort angezeigten Artikel die nackte Brust
von Janet Jackson zeigt? Mein Artikel
[http://koehntopp.de/kris/artikel/rating_does_not_work/](http://koehntopp.de/kris/artikel/rating_does_not_work/)
von 1999 dekliniert diesen Gedanken durch.

Man muss sich also klar darüber werden, daß man bei Blogs
eigentlich mit Beiträgen - also Artikeln und Kommentaren -
hantiert, und daß RSS-Feeds und Webseiten mit Blogs nur die
*Repräsentation* von Beiträgen sind. Eigentlich will man aber
beim Datentausch über Beiträge reden, und nicht über ihre
Repräsentation.

Weil Blogs das in der Regel nicht tun, sind zum Beispiel
Kommentare Objekte zweiter Klasse. Sie sind oft nicht
referenzierbar und stehen oft nicht im RSS Feed des Blogs zur
Verfügung. Wenn doch, dann auf jeden Fall in einem anderen Feed.
Blogs tracken in der Regel auch nicht die Versionen von
Beiträgen - wenn Artikel oder Kommentare überarbeitet werden,
ändert sich die URL nicht und es ist unklar, ob das Trackback
sich auf den aktuellen Artikel bezieht oder eine frühere Version
davon.

Vergleiche dies mit NNTP: NNTP kennt keine Unterscheidung von
Beiträgen in Artikel und Kommentare. NNTP vergibt
ortsunabhängige IDs so gut dies möglich ist - Message-IDs sind
mit dem Hostnamen des sendenden Rechners gescoped, aber die
Message-ID eines Artikels ist kein Storage-Pfad. Stattdessen
bietet der Dienst News intern einen Lookup-Dienst an, der eine
Message-ID in einen Storage-Pfad umwandelt. Jeder News-Server
hat einen solchen Lookup-Dienst und jeder News-Server liefert für
dieselbe ID unterschiedliche Pfade (nämlich für seine Kopie des
Artikels auf seiner Platte). NNTP kann also damit leben, daß es
mehr als eine Instanz eines Objektes gibt, das macht NNTP sicher
gegen Ausfälle und skaliert NNTP bis in planetenumspannende
Dimensionen - NNTP kann nicht geslashdotted werden.

Versionierungen werden von NNTP korrekt getracked: Wird ein
Artikel überarbeitet, wird eine neue ID vergeben und die
ersetzte alte ID in einer Headerzeile "Supersedes" korrekt
referenziert. Der neue Artikel kann an Stelle des alten Artikels
einsortiert werden, aber zugleich ist klar erkennbar, daß die
Kommentare sich auf die alte Version des Artikels beziehen und
nicht auf die neue, überarbeitete Version.

Das System der Blogs ist verglichen damit fundamental verquast:
Es ist nicht klar, auf was sich eine URL-ID bezieht.
Insbesondere sind Kommentare Beiträge zweiter Klasse, da sie so
gut wie gar nicht referenzierbar sind. Die URL-ID eines Beitrags
enthält Ortsinformation - verlegt man das Blog, brechen die
Verweise zusammen. Blogs können nicht skalieren, denn da die
URL-ID eines Beitrags Ortsinformation enthält, kommen Blogs
nicht damit zurecht, wenn mehr als eine Instanz eines Beitrages
existiert. Ein Verteilsystem für Inhalte ist nur schwer
realisierbar, da Teile der zu verteilenden Inhalte keine Namen
haben und da nicht klar ist, auf welche Inhalte sich ein Name
nun genau bezieht - sind Kommentare mitgemeint? Auf Webseiten
ja, aber in RSS nein. Da die IDs in Blogs nicht versioniert
sind, ist auch der Diskurs unklar: Auf welche Version eines
Beitrages bezieht sich ein Autor, der mich backlinked.

Eines jedoch ist klar: Damit Blogs als Diskurs-System
funktionieren, ist noch jede Menge Arbeit notwendig. Derzeit
sind elementare Voraussetzungen für den Einsatz von erprobten
technischen Lösungen noch nicht einsetzbar, weil wir die Dinge,
mit denen wir arbeiten, noch nicht einmal benennen können.

Blogs müssen als erster Verbesserungsschritt Content-Layer und
Presentation-Layer voneinander trennen - Beiträge selber und die
Darstellung von Beiträgen als HTML oder als RSS müssen
konzeptuell voneinander getrennt werden und Bezeichner müssen
sich auf Objekte der Content-Layer, nicht der Presentation
beziehen.

Außerdem müssen Blogs sich für Content-Objekte IDs zulegen, die
diesen Namen auch verdienen. Also Bezeichner, die opak sind und
keine Ortsinformation enthalten, damit sie nur verwendet werden,
die Identität eines Artikels zu bestimmen, aber nicht, um den
Artikel aufzufinden.

Dann erst kann man sich über Syndication, Push oder Pull und
dergleichen mehr Gedanken machen. Dann erst kann man sich
überlegen, ob und wie sich das alles skaliert. Dann erst kann
man sich überlegen, wie man das alles mit Readern automatisiert.
Und dann erst kann man sich überlegen, wie weit man Diskurs
formalisieren möchte.
