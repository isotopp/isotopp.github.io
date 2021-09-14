---
layout: post
published: true
title: Zusammenfassung 'Schemaless'
author-id: isotopp
date: 2011-04-20 15:01:54 UTC
tags:
- lang_de
- datenbanken
- mysql
- nosql
feature-img: assets/img/background/mysql.jpg
---
## Die Antwort: ALTER TABLE vs. Schemaless

ALTER TABLE in MySQL nervt. Das tut es in erster Linie, weil es die
Tabellen, die es verändert, mit einem exklusiven Lock (Write Lock) belegt,
während es die Änderung durchführt, und weil es die Änderung durch
Umkopieren der Daten und Indices durchführt, was bei einer großen
bestehenden Datenmenge doch recht lange dauern kann.

Es gibt inzwischen eine 
[Reihe von Verbesserungen](http://dev.mysql.com/doc/innodb/1.1/en/innodb-create-index.html) 
in MySQL 5.5, wenn InnoDB (inzwischen die Default Storage Engine) verwendet
wird. Diese Verbesserungen beziehen sich zum größten Teil auf das Erzeugen
und Löschen von Indices im Hintergrund, also ohne Lock und ohne den Betrieb
aufzuhalten.

Auch für das Erzeugen und Löschen von Spalten oder das Ändern von Defaults
gibt es Lösungen, die in InnoDB jedoch noch nicht umgesetzt sind. Die
meisten dieser Lösungen basieren auf versionierten Tabellendefinitionen und
einem verzögerten Update der Zeilen der Tabelle.

Das könnte so gehen: Jede Tabelle hat eine versteckte Spalte 'version', in
der die Schemaversion für diese Zeile gespeichert ist. Ein ALTER TABLE auf
eine Tabelle verändert an der Tabelle selbst erst einmal gar nichts, sondern
hinterlegt nur eine zusätzliche Version des Schemas in der .frm-Datei.

Wird eine Zeile bearbeitet, wird das Schema für diese Zeile beim Lesen
aktualisiert und die Zeile dann später zurück geschrieben.

![](/uploads/lazy_schema_change.png)

Verzögerte Migration einer Tabelle von Schemaversion 1 auf Schemaversion 2.

Im Beispiel wird das ursprüngliche 
```sql
CREATE TABLE t ( 
  id INTEGER UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT, 
  german VARCHAR(20) NOT NULL DEFAULT ''
) ENGINE = INNODB
```

um ein späteres 

```sql
ALTER TABLE t ADD COLUMN english VARCHAR(20) NOT NULL DEFAULT ''
```

ergänzt.

Die ursprüngliche Tabellendefinition ist Version 1. Das ALTER TABLE, das die
Spalte <tt>english</tt> zufügt ist Version 2. Das ALTER TABLE selbst macht
gar nichts, aber man kann erkennen, daß die Zeile mit der ID 2 schon
aktualisiert worden ist.

In einer realen Implementierung ist diese Zeile eher repräsentativ für eine
ganze Speicherseite, also in InnoDB für alle Zeilen, die in derselben 16KB
Seite gespeichert werden. InnoDB macht allen I/O immer seitenweise und es
wäre nicht sehr ökonomisch, nur einzelne Zeilen zu ändern, wenn man gleich
eine ganze Seite  davon im Speicher hat. Außerdem könnte man auf diese Weise
die Schemaversion   per Seite statt per Row speichern, was noch einmal
Speicher spart. Es ist mir noch nicht ganz klar, ob man eine Seite unbedingt
immer beim in-den-Speicher-bringen aktualisieren will (aggressiver
Algorithmus), oder nur dann, wenn eine Seite sowieso auf Grund einer anderen
Operation modifiziert wird (zurückhaltender Algorithmus, der die
Aktualisierung nur dann durchführt, wenn die Seite auf Grund anderer
Operationen als dirty markiert wird).

Auf diese Weise wird jedenfalls das ALTER TABLE ADD COLUMN und DROP COLUMN
sowie das MODIFY COLUMN selbst sehr schnell. Die eigentlichen Kosten fallen
dann im Hintergrund an, und zwar dann, wenn die Seite sowieso geändert wird
(zurückhaltener Algorithmus).

Meine Anfrage in 
[dem ersten Artikel]({% link _posts/2011-04-19-schemaless.md %})
zum Thema brachte das Ergebnis, daß bei schemalosen Datenbanken die Optionen
ähnlich sind: 

1. Man ignoriert das Problem.
2. Man schreibt eine ALTER TABLE Prozedur.
3. Man schreibt eine Migrationsprozedur, die dem lazy ALTER TABLE von oben entspricht.
4. Man schreibt eine Migrationsprozedur, die dem lazy ALTER TABLE von oben entspricht, 
   verteilt den Code aber durch einen Haufen Stellen in der Anwendung.

Zu Option 1 erhielt ich dieses Anwendungsbeipiel: 
> Ich hatte es erst letztens mit einer NoSQL-Datenbank, dass der Kunde noch
> gerne ein Feld mehr wollte (Sortierung) und das Statement natürlich die
> Sortierung benutzt hat. Eigentlich ganz schön, dass das so einfach ist.
> Nun fand die DB aber plötzlich keine Datensätze mehr, die das Feld noch
> nicht besaßen.Auf der einen Seite richtig, auf der anderen kommt da gerne
> auch eine Migration auf einen zu, für einen einzigen neues Key. Aber damit
> kann man leben und man fällt wahrscheinlich nur einmal drauf rein und
> beachtet dies in der Entwicklung.

Leider erhielt ich auf meine Nachfrage, mit welcher technischen oder
organisatorischen Maßnahme das für die Zukunft geklärt wurde ('beachtet dies
in der Entwicklung') keine Antwort.

Zu Option 2 erhielt ich den folgenden Kommentar: 
> Ich kann hier nur für Documentstore DBs sprechen. Fügten wir in der Form
> ein weiteres Feld hinzu, musste ein Updateprogramm geschrieben werden,
> dass die bereits vorhandenen Dokumente um dieses Feld erweiterte [...],
> sonst flog einem das ganze in Views um die Ohren oder die Dokumente
> tauchten in den Views gar nicht erst auf, da das neue Feld als
> Selektionskriterium verwendet wurde.

Dies entspricht weitgehend einem prozedural auscodierten ALTER TABLE.

Zu Option 3 erhielt ich dieses Anwendungsbeispiel: 
> Umgesetzt habe ich das bisher, wie man es bei großen SQL-Datenbanken
> letztendlich auch tun würde (wenn man die Tabelle nicht locken will):
> 1. Datensatz laden
> 2. Gucken in welcher Version der Datensatz ist (bzw. ob Daten migriert werden müssen)
> 3. Datensatz gegf. aktualisieren
> 4. Datensatz speichern (oder warten bis der Datensatz eh gespeichert wird)

Ein weiterer Beitrag: 
> Als Anwendungsentwickler muss ich mich auf einmal in meinem Data
> Abstraction Layer (DAL) um das Handling von Datensatz-bezogenen Versionen
> kümmern und dort im Laufe der Zeit immer mehr Code implementieren, nur um
> aus den aus dem Storage geladenen Daten sinnvolle Objekte zu erzeugen.

Option 4 wurde dort ebenfalls andiskutiert, aber verworfen: 
> Schiebt man das Problem noch weiter "den Stack hoch", etwa weil man auch
> im Domain Model nicht mit klaren Objekt-Definitionen, sondern vielleicht
> mit Hashtables, JSON-Datenformaten oder sonst was rumhantiert, so
> erschwert dies meiner Meinung nach nicht nur die Übersicht im Code,
> sondern auch die weitere Verarbeitung in Controllern, Services und Views.


## Modellierung von Spezialisierungen

An anderer Stelle kam es zu einer Diskussion um erweiterbare Strukturen und Spezialisierungen, also Superclass-Subclass-Beziehungen. In der SQL-Welt implementiert man diese oft mit 1:0-Strukturen (also 1:1-Beziehungen, bei denen der rechte Part optional ist, und der linke Part eine Art von Klassenidentifikation enthält).

![](/uploads/kundendb.png)

KundenDB eines mir bekannten Providers

Ein mir recht gut bekanntes Anwendungsbeispiel ist eine technische
Kundendatenbank bei einem Provider. Dort speichert man Kunden und Produkte
ab (ein Kunde kann eine Reihe von Produkten gekauft haben). Alle Produkte
haben gemeinsame Eigenschaften, etwa ein Freischalt- und ein Endedatum,
Preise, Rabatte und so weiter. Alle Produkte haben außerdem einen Typ, etwa
DSL, weitere IP-Adresse, Webserver, Dedicated Server und so weiter. Für
jeden Typ gibt es jetzt eine weitere Tabelle, in der Attribute gespeichert
werden, die für die Unterklasse spezifisch sind (also DSL-spezifisch,
Webserver-spezifisch und so weiter).

Anwendungen arbeiten nun entweder mit der Oberklasse, etwa weil sie
abrechnen. Oder sie arbeiten mit einem JOIN zwischen Produkt und einer
spezifischen Unterklasse 
(`Produkt p JOIN dsl d ON p.product_id = d.product_id AND p.type = 'dsl'`), 
etwa weil sie Konfiguration generieren. Die einzige Komponente, die mit
allen Unterklassen als Unterklassen arbeiten muß, ist der Editor. Der
wiederum ist jedoch so allgemein gehalten, daß er im Grunde mit jeder Art
von Tabelle arbeiten kann - er verwendet weitere Tabellen mit Meta-Hints zum
Layout der Edit-Seiten.

In schemalosen NoSQL-Datenbanken modelliert man dies oft recht frei, auf
eine von mehreren Weisen:

Der unformalste Ansatz fügt einfach Attribute zu Elementen dazu. Es gibt
dabei keine Kontrolle, ob die vorhandenen Attribute komplett sind, sondern
Attribute werden einfach einzeln zugefügt wie sie gebraucht werden. Das kann
zu allerhand Überraschungen zur Laufzeit führen.

In einem etwas formaleren Ansatz hat man ein Attribut, das in etwa einem
'objectClass'-Attribut von
[LDAP Schema](http://www.openldap.org/doc/admin22/schema.html)
entspricht und die Klassen listet, denen das Objekt folgt, und das somit die
'MUST' und 'MAY'-Attribute festlegt. Diese sind womöglich sogar typisiert.
Validierung dieser Regeln erfolgt typischerweise jedoch nicht in der
Datenbank, sondern im Getter/Setter.

## Datenmodellierung

Bei der Modellierung hat man dann wieder OOP-typisch die Wahl zwischen Einbettung und Verweisen
([MongoDB](http://www.mongodb.org/display/DOCS/Schema+Design#SchemaDesign-Embedvs.Reference)), 
während SQL praktisch immer mit Verweisen arbeitet. 

Obendrein kommen dazu noch gelegentlich technische Fragen wie Subdokument
vs. eigenes externes Dokument, die in einigen dieser Systeme elementar
unterschiedlich behandelt werden: typischerweise hat ein Dokument einen
eigenständigen Primärschlüssel, ist also addressierbar, während ein
Subdokument keinen eigenen Primärschlüssel hat, und daher nicht direkt
addressierbar ist: Eine OID des Parents plus Suchausdruck ist kein
invarianter und stabiler Name.

SQL arbeitet praktisch immer mit Verweisen und nennt diese Fremdschlüssel,
ist aber in der Lage, diese Verweise optional innerhalb einer Query
aufzulösen (das ist genau das, was ein JOIN tut), sodaß man durch die
Formulierung der Query in der Abfrage die Wahl zwischen Einbettung und
Verweis hat - nicht jedoch bei der Speicherung, die in der Regel mit
Verweisen erfolgt.

Viele NoSQL-Datenbanken erlauben einem immerhin die Wahl zwischen Einbettung
und Verweisen, etwa indem sie einen Datentyp OID bereitstellen. Vielfach
fehlt aber die Option des 'deep read', also des Auflösens von OID in
Unterobjekte mit einer einzigen Query ('fetchObject: OID deepReadLevel: 3'),
sodaß man sich beim Auflösen der Referenzen zusätzliche Netzwerklatenzen
einhandelt.

Ein Diskussionsbeitrag stellt genau dies dar, zieht dies aber argumentativ
anders herum auf:

> Der Zeitpunkt, zu dem Daten normalisiert werden, ist unterschiedlich. Bei
> einer SQL-Datenbank müssen die Daten beim INSERT dem Schema entsprechen,
> d.h. ich muß sie gleich normalisiert, wenn ich sie entgegennehme. Bei
> einem schemalosen Store kann ich die Daten auch erst ganz spät
> normalisieren, möglicherweise erst wenn ich sie ausgelesen habe und nun
> darstellen will.

und meint dann: 

> Wenn ich Daten normalisiere, bevor ich sie in einen schemalosen Store
> schreibe, dann sehe ich auch keinen wirklichen Vorteil gegenüber einer
> SQL-Datenbank (modulo der von Dir erwähnten table locking
> Implementationsdetails einiger spezieller Implementationen). Das
> Haupt-Feature ist also IMHO genau die Möglichkeit, erst ganz spät zu
> normalisieren, und dann hat man möglicherweise viel mehr Kontext, was man
> mit den Daten überhaupt anfangen will.

Ich arbeite möglicherweise zu lange mit SQL, denn ich habe Schwierigkeiten
mir vorzustellen, wieso das ein Vorteil ist. Also, genauer: Ich kenne
Anwendungsfälle, wo mich die interne Struktur der Daten nicht tangiert und
ich sie in SQL nicht ausmodellieren will - einfachstes Beispiel ist eine
Session-Tabelle, die im Grunde nur Tripel (sessionid, sessiondata, changed)
enthält, und bei der ich nie in die sessiondata hinein sehen will. In diesem
Fall ist es vollkommen in Ordnung, sessiondata als BLOB oder TEXT zu
modellieren und da ein serialize($_SESSION) abzuspeichern.

Wenn ich aber strukturierte Sessions will, weil ich etwa Statistiken über
Artikel in aktiven Warenkörben erstellen möchte, dann ende ich
wahrscheinlich mit einer zweistufigen Hierarchie und Key-Value Tabellen oder
weiter ausstrukturieren Sessiontabellen. Allerdings sehe ich solche
Anwendungsfälle vielleicht eher in einem Bestell-Log als in einer
Session-Tabelle.

## Zusammenfassung

Offenbar lag ich mit meinem Gefühl gar nicht so falsch: Das im Betrieb oft
unerträglich langsame ALTER TABLE von MySQL ist in der Tat ein stark
empfundenes Problem und motiviert Anwender stattdessen auf 'schemalose'
Datenbanken zu setzen.

Anwender von 'schemalosen' Datenbanken haben ihr Schema stattdessen als Teil
von Bibliotheken in der Anwendung implementiert. Dabei variiert die
Codequalität recht stark, da keine 'best practice' als Einbaufunktion von
der Datenbank bereitgestellt wird und auch keine
Standard-Bibliotheksfunktionen für diese Aufgabe von der Zugriffsbibliothek
für die entsprechende NoSQL-Datenbank bereitgestellt wird.

Aus der Sicht des NoSQL-Produktes wird die Funktionalität also nicht vom
Server in den Client verlagert, sondern das Problem ignoriert und dem
Anwender zur Selbstimplementierung überlassen. Die Anwender durchdenken das
Problem dabei unterschiedlich stark und implementieren eine Lösung in der
Regel nur so weit als sie empirisch das Problem als dringlich zu empfinden
gelernt haben.

Schemaprüfungen und formale Migrationen von einer früheren Version des
Schemas auf die aktuelle Version des Schemas sind dabei eher die Ausnahme.

Viele NoSQL-Produkte, die über simple KV-Stores hinaus gehen, implementieren
hierarchische Datenstrukturen, die sich an dem relationalen Vorläufer IBM
IMS, an XML oder an LDAP orientieren. Dies ist dem Fehlen von
ausdrucksstarken Möglichkeiten mit Hierarchien und Bäumen in MySQL umzugehen
geschuldet.

Andererseits fehlt in diesen NoSQL-Produkten in der Regel die Option,
Verweise aufzulösen ohne weitere Netzwerklatenzen zu generieren (Fehlen von
JOIN oder 'deep reads'), sodaß man oft mit eingebetteten Dokumenten und
nicht-skalaren Daten arbeitet.

Ich war verwirrt, weil einerseits NoSQL irgendwie der aktuelle Hype ist, ich
andererseits aber auf Konferenzen wie MongoBerlin letztes Jahr ein komisches
DejaVu hatte: Das Publikum dort fühlt sich an wie eine MySQL-Community von
2005.

So weit korrekt, oder fehlt was?
