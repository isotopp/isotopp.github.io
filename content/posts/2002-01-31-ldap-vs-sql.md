---
author: isotopp
date: "2002-01-31T09:00:00Z"
feature-img: assets/img/background/rijksmuseum.jpg
published: true
title: "LDAP vs. SQL"
tags:
- lang_de
- talk
- publication
- internet
---

# Directory Services vs. Relationale Datenbanken

![](/uploads/2002/01/dir_vs_rel.001.jpg)

Überblick:
- Eigenschaften von LDAP
- Eigenschaften von SQL
- Anwendungsbereiche von LDAP
- Anwendungsbereiche von SQL
- Strukturelle Probleme beim Einsatz von LDAP
- Warum wird LDAP dennoch verwendet?
- Gibt es weniger problematische Alternativen?

# LDAP im Schnelldurchlauf

![](/uploads/2002/01/dir_vs_rel.002.jpg)

- Wald von Bäumen aus Knoten
- Jeder Knoten hat mindestens die Attribute `dn`, `objectClass`
- Attribute sind ein- oder mehrwertig, haben Syntax (Typ)
- Besonderes mehrwertiges Attribut `objectClass` bestimmt, welche Attribute vorhanden sind MÜSSEN und DÜRFEN
- Einwertiges Attribut `dn` enthält den Pfad durch den Baum und ist Schlüssel (PK)

Novell Directory Services, Active Directory und LDAP basieren auf den Ideen von X.500.

Das Verzeichnis ist ein Wald von Wald von Knoten, Knoten haben Attribute, mindestens `dn` und `objectClass`.

Die Vereinigungsmenge von `objectClasses` definiert, welche Attribute der Knoten haben MUSS und KANN. Dies entspricht NULL/NOT NULL in SQL.

Attribute haben eine Syntax (einen Typ). Attribute können einwertig (etwa: `dn`) oder mehrwertig (etwa: `objectClass`) sein.
Mehrwertige Attribute sind ein Verstoß gegen die 1NF in SQL und müssen in SQL in externe Tabellen ausgelagert werden.
Denormalisierungen ziehen idR Anomalien bei INSERT/UPDATE/DELETE nach sich.

Der `dn` beschreibt den Pfad durch den Baum und ist PK. PKs sollen strukturlos und invariant sein. Daß der `dn` nicht strukturlos ist, wird sich als bitteres Problem herausstellen. Daß der `dn` Positionsinformation enthält wird ihn nahezu unbrauchbar als PK machen (aber LDAP offeriert keine Alternative).

# SQL im Schnelldurchlauf

![](/uploads/2002/01/dir_vs_rel.003.jpg)

- Datenbank als Kollektion von Tabellen, Tabellen als Kollektion von Spalten, Spalten haben Typen
- Spalten sind NULL, NOT NULL. Spalten sind einwertig.
- Eine Spalte oder Gruppe von Spalten ist der PK.

Spaltendefinitionen mit Typen definieren ein rigides Typschema, das nur durch Nullwerte geringfügig aufgelockert wird.
Dennoch flexible Struktur, da über Beziehungen zwischen Tabellen variable Verbindungen aufgezogen werden können.
Schlüssel und Integritätsbedingungen sind frei definierbar und frei wählbar.

Umfangreiches Handwerkszeug zur Definition von Datenstrukturen und deren Pflege vorhanden.

# SQL Operationen

![](/uploads/2002/01/dir_vs_rel.004.jpg)

SQL erlaubt komplexe Operationen auf Tabellen:
- Selektion (WHERE-Clause) wählt Zeilen
- Projektion (Spaltenliste) wählt Spalten
- Aggregation (GROUP BY-Clause) erlaubt Zählungen
- Join erlaubt Tabellenverknüpfungen
- Rename erlaubt Self-Joins und damit rekursive Strukturen (Bäume etc)

Das Ergebnis jeder Operation ist wieder eine Tabelle. Mit Subqueries kann die generierte Tabelle weiter verarbeitet werden (Relationen "Algebra").  

Diese fünf Operationen erlauben es, den auf viele Tabellen verstreuten (normalisierten) Bestand dynamisch zu rekombinieren. Dabei sind auch Rekombinationen möglich, die ursprünglich nicht antizipiert wurden (Ad-Hoc Queries).
Ad-Hoc Queries sind ein typisches Phänomen bei der Recherche und der Reportgenerierung.

SQL ist mächtig genug, um selbstreferentielle Strukturen definieren zu können.

Eine Reihe von Einbaufunktionen entlastet den Client noch weiter und erlaubt es, beträchtliche Teile der Logik im Server ablaufen zu lassen.

Minimierung des Netzverkehrs und sinnvolle Aufteilung der Anwendung zwischen Server und Client.

#  LDAP Anwendungen 

![](/uploads/2002/01/dir_vs_rel.005.jpg)

Authentisierung
- am OS (PAM)
- an der Anwendung (mod_auth_ldap etc.)

Konfigurationsdaten
- Netscape Roaming
- sendmail Aliases etc.

Verzeichnis (Recherche)
- Adreßverzeichnisse

Characteristika:
- kurze Verbindungen
  - connect, query, disconnect
  - connect, disconnect (authentication only)
- triviale Queries
  - Existenzanfragen
  - Attributanfragen (dn, attribut) -> (werte)
  - Objektauslesung (dn) -> (attribute, werte)

Sinnvolle Anwendungen von LDAP:
- Hit and Run-Anwendungen:
  - Anmeldung am OS, am Webserver, am IMAP/POP-Server.
  - Laden von Konfigurationsobjekten aus dem LDAP-Server.
- LDAP ist für Lesen optimiert.
- LDAP ist für viele Zugriffe pro Sekunde optimiert.

# SQL Anwendungen

![](/uploads/2002/01/dir_vs_rel.006.jpg)

Datenspeicher für Anwendungsdaten
- Persistente Daten
- Normalisierte Daten

Business Rules
- Integritätsbedingungen
- Accessfunktionen

Lockingmechanismen
- Zugriff durch mehrere Instanzen derselben Anwendung
- Zugriff durch verschiedene Anwendungen

Characteristika:
- lange Connects mit vielen Queries
- langlaufende Queries
  - Joins
  - Sortierungen
  - berechnete Werte
- viele Schreiboperationen
  - konkurrente Schreiboperationen -> Locking
  - zusammengesetzte Schreiboperationen -> Transaktionen

Sinnvolle Anwendungen von SQL: Stay and Run-Anwendungen; eine Verbindung, viele Queries. Möglichst viele Daten auf dem Server verwerfen, nur die notwendigen Daten übertragen.

Komplexe und konkurrente Updates; Locks; Transaktionen.

Business Logic an den persistenten Objekten der Anwendung speichern, Daten werden zwischen verschiedenen Anwendungen shareable.

Die Integritäts- und Update-Logik für diese Daten klebt an den Daten, nicht in den verschiedenen Anwendungen.

Kein Zugriff, insbesondere kein schreibender Zugriff an dieser Logik vorbei möglich.

# Relationenmodell in Verzeichnisdiensten

![](/uploads/2002/01/dir_vs_rel.007.jpg)

- Woher kommen die Daten im Verzeichnis?
  - Welches ist das führende System?
- Wie strukturiere ich den Verzeichnisbaum?
  - Nebenbedingungen:
    - Replikation
    - Naming Attributes
- Wie strukturiere ich meine objectClasses?
  - Welche Art von Anfragen wird erwartet?

- Sollte ich nicht doch lieber ein RDBMs nehmen?

Das Hauptproblem besteht oft darin, daß versucht wird, LDAP für mehr als simple Logins einzusetzen.
Selektion und Projektion sind vorhanden; Aggregation, Join und Rename nicht.
LDAP-Struktur muss die auftretenden Anfragen antizipieren.

PKs sind instabil.
Nebenbedingungen der Replikation machen stabile PKs oft unmöglich.
Diese Faktoren bestimmen das Design von LDAP.

Lachhafte technische Basis erzeugt eigenartige technische Anforderungen.
LDAP-Server halten den Datenbestand effektiv im RAM.
Der Datenbestand kann daher eine vorbestimmte Größe kaum überschreiten.

LDAP-Server geben nur partiell relevante technische Daten an: Queries/sec nicht mit SQL vergleichbar.
Wo ein LDAP 40.000 Queries braucht, kommt SQL mit einem Join hin.

# Häufige Designprobleme in LDAP

![](/uploads/2002/01/dir_vs_rel.008.jpg)

- LDAP wird als führende Datenbank eingesetzt
- LDAP wird stark beschrieben
- LDAP wird konkurrent beschrieben
- LDAP dynamisch beschrieben
- Es bestehen abzufragende Beziehungen zwischen LDAP-Objekten
- LDAP wird zur Reportgenerierung verwendet

- Der LDAP-Bestand wird hierarchisch strukturiert
- Der LDAP-Bestand muss hierarchisch strukturiert werden

Setzt man LDAP als Verzeichnisdienst (also als Logindatenbank) ein, kann es funktionieren.
Jeder andere Ansatz wird sehr, sehr weh tun.

# LDAP wird als führende Datenbank eingesetzt 

![](/uploads/2002/01/dir_vs_rel.009.jpg)

LDAP-Attribute haben eine Syntax (einen Typ)
- Typen sind zahlreich und im Standard vordefiniert
- Typen sind schwer erweiterbar
- Integritätsbedingungen können nicht definiert werden.
- iPlanet erlaubt Plugins, die Integrität checken können.

Beziehungen zwischen Objekten sind in LDAP nur schwer darstellbar und instabil.
- PK ist immer der `dn`
- `dn`s sind jedoch unter Umständen instabil

Aliases sind ein optionales Feature von LDAP
- Nur Blattknoten können Aliases sein.

LDAP bietet nicht die adäquaten Mechanismen, um als führende Datenbank eingesetzt werden zu können:
Intra-Objekt-Integrität nur durch Typen (Syntaxen) gewährleistet, keine Trigger, keine Foreign Keys.
Inter-Objekt-Integrität nur durch propietäre Plugins (Compilate) gewährleistet, keine Stored Procedures, Trigger, Rules.
Typensystem nicht durch Definitionen oder Einschränkungen erweiterbar.

Keine Joins, Renames, und damit keine Relationen.
Nachbildung von Joins durch Prejoins (Struktur oder Aliases) oder durch iterative Queries.
Iterative Queries erzeugen wahnwitzigen Traffic im Netz und auf dem Server.
Beispiel: Liste von Usern nach Standorten

# LDAP wird stark beschrieben

![](/uploads/2002/01/dir_vs_rel.010.jpg)

- LDAP ist als Protokoll für Leseoperationen optimiert.
- Es existiert noch kein standardisiertes Bulk-Update Protokoll.
  - In OpenLDAP und iPlanet ist der LDAP-Datenspeicher ein Sleepycat DB/3.
  - In einigen LDAP-Servern sind Schreiboperationen ungeschickt implementiert: Flush nach jedem Write.

- Replikation zwischen Servern skaliert sich nicht gut bei starken Schreiboperationen.
  - Nicht standarisiert.
  - Oft als reguläre Schreiboperation eines privilegierten Benutzers implementiert ("triviale Implementierung")
  - iPlanet kann immerhin out-of-sync Replica automatisch neu aufbauen.

In älteren LDAP-Servern flog nach heftigen Updates die Replica weg:
Jedes Write auf den Server gab ein Write auf der Replication.
Jedes Write gab ein Flush auf die Platte.

LDAP ist zwar standardisiert, aber heterogene Replikation ist dennoch noch immer eine schwarze Kunst.

Wenn Replikation über reguläre Writes mit einem speziellen User realisiert ist, skaliert sie sich nicht gut.
Proprietäre Bulk-Updates skalieren sich gut, erzwingen aber homogene Serverinstallationen.

# LDAP wird konkurrent beschrieben

![](/uploads/2002/01/dir_vs_rel.011.jpg)

- LDAP definiert einzelne add oder modify-Operationen als atomar.
- LDAP kennt keine Locks und keine Transaktionen
- Synchronisation und Konsistenz sind damit Sache der Anwendung.

Hierzu ist wenig zu sagen:
- Ohne Transaktionen kein Undo von mehrteiligen Updates, keine Read-Konsistenz.
- Ohne Locks ist so etwas auch kaum nachbildbar.

Beispiele:
- Vergabe von uids beim Usereintrag durch klassischen read-modify-write-Zyklus:
- Bestimme höchste belegte UID.
- Ermittele nächsthöhere UID.
- Belege diese UID im LDAP.

Da keine Locks vorhanden sind, ist rmw nicht implementierbar (aber UID kann als Attribut UNIQUE gesetzt werden).
- Damit schlägt ein doppelter ADD fehl -> retry (Potential für Livelock)

# LDAP wird dynamisch beschreiben

![](/uploads/2002/01/dir_vs_rel.012.jpg)

- Viele LDAP-Server speichern die Schema-Definition out-of-band
  - Externe Dateien, die per include in die Serverkonfiguration mit eingebunden werden.
- Damit ist eine Änderung des Schemas im Betrieb und durch LDAP unmöglich.
  - Dies fördert sehr entspannte objectClass-Definitionen (`MAY`-Inflation)

- Out-of-band Schemadefinition macht Introspektion schwierig
  - Welche `objectClasses` kennt der Server? Welche Attribute erlauben und definieren sie?

Dynamische Schemadefinition ist nur in esoterischen Anwendungen von Bedeutung.
- Entwicklungssysteme
- Generische Infrasturkturanwendungen

Ähnliche Argumentationen gelten für Introspektion.

# Beziehungen zwischen LDAP-Objekten

![](/uploads/2002/01/dir_vs_rel.013.jpg)

Der PK in LDAP ist immer der `dn`.
- Der `dn` ist nicht opaque, sondern hat Struktur: Pfadinformation.
- Konsequenz: `dn`s sind instabil.
  Verschiebt man ein Objekt im Baum, ändert sich der `dn`.
  Damit sind alle Referenzen auf das Objekt ungültig.
- iPlanet `dn` Plugin; cascading Updates

LDAP kennt keine JOIN-Operation
- Prejoined Structures über Aliases oder andere Referenzen
- keine dynamisch zusammengesetzten Strukturen.
- Aliases sind nicht generisch (Leaf-Nodes only).

LDAP kennt kein Join (und kein Rename): Art der antizipierten Anfragen bestimmt die Struktur des Schema.
Ad-Hoc Anfragen sind prinzipiell nicht oder nur mit gewaltigem Overhead realisierbar.

Bei Kenntnis der Struktur ist die Konstruktion einer pathologischen Anfrage eine Fingerübung für den geübten Designer:
Invertiere die Struktur und konstruiere eine sinnvolle Anfrage auf der invertierten Struktur.

Da der `dn` nicht opak ist, sind keine stabilen Referenzen implementierbar.
`dn`-Rename Plugin von iPlanet generiert entsprechend gewaltige Serverlast.


# LDAP wird zur Reportgenerierung verwendet

![](/uploads/2002/01/dir_vs_rel.014.jpg)

LDAP kennt keine Aggregation
- Reports können nur durch Durchlesen des Bestandes erstellt werden. 

LDAP kennt keine serverseitigen Funktionen
- Funktionswerte können nur durch Durchlesen des Bestandes erstellt werden.

LDAP kennt keinen JOIN
- Reports machen oft Gebrauch von ad-hoc Beziehungen zwischen Teilmengen, aber ohne Join können diese nicht effizient generiert werden.

Beispiele:
- Welche Mitarbeiter haben mehr als einen PC?
- Welche PC werden von mehr als einem Mitarbeiter verwendet?

Beachte die Invertierung.

LDAP hat keine Einbaufunktionen.
Statistiken scheiden ganz aus.

# Hierarchische Struktur im LDAP I

![](/uploads/2002/01/dir_vs_rel.015.jpg)

- Der PK in LDAP ist immer der `dn`.
- Der `dn` enthält Strukturinformation.

- Ändert sich die Position eines Objektes in der Struktur, ändert sich der PK dieses Objektes

- Klassischer Fall von nicht normalisierter Struktur: Daten und Struktur nicht getrennt

- Ein Objekt ist oft Mitglied in verschiedenen Hierarchien
  - Mitarbeiter ist einsortiert
    - organisatorisch ("Abteilung 1.3.2")
    - räumlich ("Deutschland, SH, Kiel, Hauptstelle")
    - projektbezogen ("IT Infrastruktur, Netzwerke, UMTS-Pilot")
  - Redundante Datenhaltung durch nicht normalisiertes Datenmodell

Veränderliche PKs, Datenbankdesigners Alptraum: nicht normalisiert.
- Baumstruktur enthält die Daten selbst, keine Referenzen auf die Daten
- nur ein Baum, nicht mehrere, möglich

Besser:
- unstrukturierte Menge von Objekten
- Baumstruktur mit Zeigern in diese Objekte.

# Hierarchische Struktur im LDAP II

![](/uploads/2002/01/dir_vs_rel.016.jpg)

LDAP erlaubt die Partitionierung des Bestandes nur nach Teilbäumen
- Erzwingt die Bildung von Hierarchien im Bestand
- Erzwingt damit instabile `dn`s

- Partition: Vollständige Überdeckung durch disjunkte Teilmengen. Definiert Äquivalenzklassen (etwa: gerade, ungerade).
- Partition: Wird für Replikation gebraucht
  - Triviale Partition: Identität.
- LDAP partitioniert nur nach Naming Attributes
- Oracle partitioniert nach beliebigen Prädikaten zur Äquivalenzklassenbildung.

- Replikation erzwingt hierarchische Struktur, die Eingang in den `dn` findet.
- Migriert ein Objekt von einer Partition in eine andere ("Standortwechsel"), ändert sich zwingend der `dn` und damit werden alle Referenzen ungültig.

- Großes Dilemma!

- Wir designen: 3-Level-LDAP, wann immer möglich (`ou=tablename, o=company, c=de`)

# Fazit I

![](/uploads/2002/01/dir_vs_rel.017.jpg)

- LDAP ist der Teil von X.500, der "brauchbar" war.
- LDAP verwirft elementare Erkenntnisse des relationalen Datenmodells.
- Damit ist auch der brauchbare Teil von LDAP aus der Sicht des Datenbankdesigners unbrauchbar und gefährlich.
- Der Einsatz von LDAP als führende Datenbank ist zu vermeiden.
- LDAP-Bestände sind möglichst als flache Tabellen zu strukturieren.
- Nichttriviale Dinge sind mit LDAP nicht zu realisieren.
- Triviale Dinge sind mit LDAP schwierig oder gefährlich.

LDAP verstößt so ziemlich gegen jeden Grundsatz des relationalen Modells:
Nicht 3., nicht 2., ja nicht einmal 1. NF
Daten aus dem LDAP sind damit kaum weiterzuverarbeiten

LDAP ist gefährlich, wenn LDAP führendes oder feedendes System ist.
LDAP ist eine Datensackgasse.

Wie kann es sein? Haben die alle in Datenbanken 101 gepennt?

#  Warum dann keine relationalen Systeme?

![](/uploads/2002/01/dir_vs_rel.018.jpg)

Deutschland, 9.00 Uhr:
- 150.000 MA loggen sich ein.
- Jedes Login ist ein Connect, gefolgt von einem Disconnect.
- Jeder Connect erzeugt in Oracle einen fork, einen exec und einen 5 MB schweren Subprozeß, der dann sofort weggeworfen wird.

- LDAP als wire-protocol ist genormt.
- LDAP als query-language ist unbrauchbar, aber sehr rigide genormt.
- LDAP ist auf connect/disconnect optimiert.

- Traditionelle RDBMs sind zu heavyweight.
- Industriefehlschlag: Kein ausreichend genormtes wire protocol
  - ODBC: too little, too late
- Industriefehlschlag: Keine ausreichend leichtwiegigen SQL-Datenbankprodukte.
  - Aber: MySQL.

# Warum dann kein MYSQL?

![](/uploads/2002/01/dir_vs_rel.019.jpg)

MySQL?
- Connect/disconnect problemlos
- read-mostly
- Replikation
- Hat volle SQL-Syntax
  - Selektion, Projektion, Aggregation, Join, Rename
- Speichereffizienter als iPlanet oder OpenLDAP

- Als wire protocol nicht genormt
  - aber: Source liegt offen, GPL bzw. LGPL
- In kommerziellen Clients nicht unterstützt.
  - aber mod_auth_mysql, PAM usw
- Trivial zu implementieren.
- Kein IETF-Prozeß.

MySQL ist in vielen Fällen gegenüber LDAP eine echte Alternative:
bessere Performance und Skalierbarkeit.

- Leichter in SQL-Feeder integrierbar wegen kongruenter Datenstrukturen.
- Open Source.
- Weniger lächerlicher Ressourcenverbrauch.

# Und XML?

![](/uploads/2002/01/dir_vs_rel.020.jpg)

LDAP und XML haben strukturell viel gemeinsam
- Rückkehr zu hierarchischen (Datenbank-) Systemen.
- Liste der Nachteile dieser Systeme in Datenbanken 101 nachlesbar.

Keine führende Datenhaltung in hierarchischen Systemen! Wir haben in den Betrieben für viel Geld diesen Unsinn gerade ausgerottet und nun kommt er mit wieder. Mit Macht!


Genau wie LDAP implementiert auch XML ein schwach getyptes hierarchisches Modell zur Datenspeicherung und eine relational unvollständige Abfragesprache (Xpath, Xquery).

XML-Speicher müssen genau untersucht werden:
- Transportspeicher sind okay (SOAP, WDDX etc)
- Lagerspeicher sind gefährlich und müssen relational normalisiert werden.

XML generiert als Bonus gewaltige Speicher- und Parser-Overheads.
- Kann ein Binärprotokoll verwendet werden?

XML und Java gehen gut zusammen:
- groß, teuer, hip, technisch partiell irrsinnig
