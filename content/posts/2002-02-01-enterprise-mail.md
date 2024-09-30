---
author: isotopp
date: "2002-02-01T09:00:00Z"
feature-img: assets/img/background/rijksmuseum.jpg
title: "Enterprise Mail: große Mailsysteme, kleine Schmerzen"
tags:
- lang_de
- talk
- publication
- internet
---

# Enterprise Mail

![](/uploads/2002/02/enterprise-mail.001.jpg)

Folien für eine interne Mitarbeiterschulung: Umzug und Erweiterung des Mailsystems bei mobilcom.de; für die evangelische Landeskirche Schleswig-Holstein; für Ver.di.

# Was ist Enterprise Level?

![](/uploads/2002/02/enterprise-mail.002.jpg)

Ausfallsicher
- bei Hardwareschaden
- bei Mailwellen

Skalierbar
- über alle User
- pro User
  - Mails pro Ordner
  - Order pro User
- pro Standort
- pro Domain

Integrierbar
- keine Firma ab einer bestimmten Größe hat ein homogenes Mailsystem
- unterschiedliche Zugänge
  - für Anwender: POP3/IMAP4, mit SSL?, über Web?
  - Für Anwendungen: Virus-Scanner? Mailinglisten? Pflegeinterfaces?

Mail ist missionskritisch, inhomogen, Lock-In unbedingt vermeiden.
Offene Software, offene Protokolle -> freie Wahl der Clients, freie Wahl der Serverkomponenten (Soft- und Hardware)

bessere Skalierbarkeit, bessere Erweiterbarkeit, bessere Integrierbarkeit ins Backend

# Hardwarekonzept

![](/uploads/2002/02/enterprise-mail.003.jpg)

Mailserver doppelt
- Jede Maschine kann für beide übernehmen

Storage doppelt
- jedes Array hat alle Daten
Multipathing
- Mehrere NICs
- Mehrere Kabelwege

Sehr zufrieden mit dem Hardware-Range von Sun:
Hardware für jede Größe von der kleinen X1 bis zur E15K, Software ist portabel über den gesamten Range. 

Großer Schwerpunkt auf ausfallsichere Hardware:
- Monitoring
- Multipathing
- Hot Plug

Ausfallszenarien:
- Kiste fällt aus
  - Migration der IP
  - Migration der Platten
- Platte fällt aus
  - RAID 1 (Veritas)

# Softwarekonzept

![](/uploads/2002/02/enterprise-mail.004.jpg)

Einsatz von Standardprotokollen
- POP3, IMAP4, LMTP, SMTP, LDAP

Einsatz von Standardsoftware
- sendmail 8.12.1, Cyrus IMAP, perdition Proxy, Veritas (VM, FS, CS), iPlanet Directory 4.x, Interscan Viruswall

iPlanet war vorgegeben, da das führende LDAP iPlanet war.

Veritas war vorgegeben, hat sich als sehr gute Wahl herausgestellt: Entwicklung von failover-Scripten harmlos.

Viruscheck vorgegeben: InterScan im Einsatz bei NetUSE, Kunden arbeiten auch mit Amavis und NAI oder anderen Systemen.

eigentliche Arbeitstiere sind freie Software:
- sendmail 8.12.1 hat bessere LDAP-Integration
  - sendmail ist eigentlich ein MTA-SDK :-)
- perdition ist ein sehr leistungsfähiger Proxy
  - Plugin-Architektur
  - extrem gutmütig im Deployment
  - übersichtlicher Code
- cyrus ist ein sehr skalierbarer POP/IMAP-Server
  - schlecht dokumentiert
  - eigenwillige Authentisierungsbibliothek SASL (Exkurs)
  - ordentliche Architektur

# Skalierbarkeit

![](/uploads/2002/02/enterprise-mail.005.jpg)

Sizing
- per User: 1 MB RAM, 2 MB Swap, 1 MHz
- IMAP braucht mehr
- SSL braucht mehr!
- angemessen Plattenplatz

Wieviel Plattenplatz ist angemessen?
- 3 Kategorien
  - 2 MB, 20 MB, 200 MB
- Jede Kategorie ist
  - (großes Modell) 5 mal seltener als die vorhergehende
  - (kleines Modell) 10 mal seltener als die vorhergehende

# Skalierbarkeit II

![](/uploads/2002/02/enterprise-mail.006.jpg)

Anwendungsbeispiel: ~5000 User
- 700 zugleich verbunden, 100 davon mit IMAP
ergeben:
- 1400 MB RAM, 3800 MB Swap, 700+ MHz

27 oder 63 GB Mailstore
- kleines Modell (27 GB)
  - 4500*2 MB + 450*20 MB + 45*200 MB
- großes Modell (63 GB)
- 4500*2 MB + 900*20 MB + 180*200 MB

Zahlen wurden auf Linux/Intel ermittelt, und an eigener Cyrus-Installation validiert. Zahlen an der Ist-Installation des Kunden validiert. Skalierbarkeit weitgehend linear. Problem ist partitionierbar.

# Migration

![](/uploads/2002/02/enterprise-mail.007.jpg)

Konvertierung
- des vorhandenen Mailstore, der vorhandenen Aliases, der vorhandenen Listeninfrastruktur, der vorhandenen Routingstruktur

Nahtlose Migration durch "Rückzug":
- "Wechsel von Kopfsteinpflaster auf Autobahn während der Hauptreisezeit"
- Vorbereitung der Konvertierung
- Umstellung auf das neue System
- Durchrouten auf das alte System
- Während der Konvertierung "Rückzug" auf das neue System

Konvertierung des Ist-Bestandes ist aufwendiger, fehleranfälliger als geplant.

System ist grundsätzlich funktionsfähig; Umstellung ist wesentlich holperiger gewesen als intendiert; Umstellungsaufwand auch bei den Anwendern

# Migration II

![](/uploads/2002/02/enterprise-mail.008.jpg)

Typische Probleme:
- lustige Ordernamen (IMAP)
- defekte Aliasdaten
- Datenbestand nicht komplett
- wechselndes Mailrouting
  - Hosts liefern mit unerwarteten Namen ein
  - LDAP-Routing verhält sich anders als statisches Routing

Umstellung für IMAP-Clients nicht transparent
- CAPABILITY
- IMAP Subscriptions
- Ordnernamen
- Lage des Sent-Folders

Umstellung für POP3-Clients weitgehend transparent
- triviales Protokoll
- nicht erweiterbar
- finaler Mailstore auf dem Client

IMAP ist ein modulares Protokoll: Extensions sind nicht kompatibel, Normung ist nicht rigide genug.
Propietäre Erweiterungen machen den Wechsel schwer
Unterschätze niemals den Einfallsreichtum von Anwendern bei der Vergabe von Ordnernamen.
Unterschätze niemals die tägliche Zielverschiebung durch das Tagesgeschäft.

# Weitere Szenarien

![](/uploads/2002/02/enterprise-mail.009.jpg)

Verteiltes Setup: 50+ Standorte, Workgroup-Size pro Standort, zentrale Administration, Begrenzte Hardwarekapazität

Großes Setup
- 70 000+ Anwender
  - Mailstore im TB-Bereich
- Virenscan
  - muß skalierbar sein
- Quota
- Webmail Zugang
  - muß skalierbar sein
- zentrale Bulk-Administration
  - Integration in existierende Stammdatenverwaltung

# Weitere Szenarien II

![](/uploads/2002/02/enterprise-mail.010.jpg)

Zu erwartende Ausbaumöglichkeiten:
- Calendaring
  - lokaler Client
  - Web Access
- mehr Verschlüsselung
  - Key Management
- Storage Management
  - Migration alter Mail in Hintergrundspeicher
  - Retrieval alter Mail
  - Sichere Löschung alter Mail
  - Mailtracking
