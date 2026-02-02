---
author: isotopp
date: "2000-05-01T09:00:00Z"
feature-img: assets/img/background/rijksmuseum.jpg
tags:
- lang_de
- publication
- talk
- internet
title: "Webserver Security"
aliases:
  - /2000/05/01/webserver-security.html
---

**aus: iX 5/2000.**

# Webserver Security

In den vergangenen Monaten haben Zeitschriften des Heise-Verlages immer wieder über Sicherheitslöcher in Installationen bekannter Serverbetreiber oder Webhoster berichtet.
Offensichtlich existieren tausende von Webanwendungen, die mit heißer Nadel gestrickt und online gebracht worden sind und die - wenn überhaupt - nur unzulänglich getestet worden sind.
Was ist die Ursache der beobachteten Probleme und wie kann man sie für seinen eigenen Server vermeiden?
Kann man als Verbraucher und Benutzer erkennen, ob der Server eines Anbieters elementaren Qualitätsanforderungen an die Sicherheit im Web genügt?

Eine Analyse der gemeldeten Fehler zeigt, daß sich die weitaus meisten Probleme in nur drei Fehlerklassen einteilen lassen:

- Der Server bietet zu viele Dienste an.
- Der Server lagert vertrauliche Daten in zugänglichen Verzeichnissen.
- Der Server vertraut Eingabeparametern aus Webformularen ohne Grund.

## Ein Server bietet zu viele Dienste an

Häufig hat sich ein Betreiber einer Maschine seinen Server noch niemals mit einem der gängigen Portscanner von außen angesehen und läßt auf seinem Server Dienste laufen, die für die Benutzung der Anwendung nicht benötigt werden oder nicht von allen IP-Adressen aus zugänglich sein müssen.
Ein prominentes Beispiel der vergangenen Wochen, über das wir berichteten war ein Server, der vollständig ohne Firewall betrieben wurde und nach außen komplette Dateisysteme mit dem Sun Network Filesystem exportierte und dessen Oracle Server von jedermann kontaktiert werden konnte.
Praktischerweise fanden sich die für Oracle benötigten Paßworte auf den exportierten Netzwerklaufwerken.

Oft wird dieser Fehler mit der Verwendung unsicherer und abhörbarer Übertragungsprotokolle für Wartungszugänge kombiniert:
So findet man oft auf Webserver auch POP3-Zugänge zum Abruf von Bestellmails, FTP-Zugänge zum Upload von neuen Webseiten oder gar Datenbankzugänge zum Upload neuer Bestandsdaten.
Diese Protokolle bieten vielfach nur unzulängliche Verschlüsselung von Benutzernamen und Paßworten an, von einer Verschlüsselung der eigentlichen Nutzdaten ganz zu schweigen - der msql-Datenbankserver zum Beispiel bietet nur rudimentäre bis gar keine Sicherung des Zugangs an, FTP und POP3 übertragen Paßworte oft unverschlüsselt.

Ein Webmaster ist gut beraten, sich einen Zugang außerhalb seines eigentlichen Providers und Webmasters zu besorgen und sich seinen eigenen Server einmal mit den Augen und Tools eines Angreifers anzusehen.
Oft ist es so, daß Dienste in der Default-Konfiguration der Servermaschine ab Werk enthalten sind, die vom Serverbetreiber nicht erkannt und nicht abgeschaltet worden sind.
Beliebte Fehlerquellen sind zum Beispiel Webserver auf Nichtstandardports, die die Handbücher des Systems anbieten.
Diese Server enthalten sehr oft fehlerhafte CGI-Scripte oder können auf andere Weise zum Sicherheitsrisiko werden.
Eine andere beliebte Fehlerquelle ist der SNMP-Dienst (Simple Network Management Protocol), der einem potenziellen Angreifer viele Informationen über das Zielsystem liefert.
Auch Dienste, die nur zur Erstinstallation benötigt wurden, werden oft vergessen und für den Wirkbetrieb nicht abgeschaltet.

Natürlich muß nicht nur der Webserver geschützt werden: Auch alle anderen Maschinen, die außerhalb der Firewall im Produktions-LAN stehen, müssen denselben Sicherheitslevel erfüllen.

## nmap-Scan (http://www.insecure.org/nmap/)

```console
# nmap -sS -T Agressive -p 1-10000 www.beispiel1.de| grep open
Port    State       Protocol  Service
21      open        tcp       ftp
22      open        tcp       ssh
25      open        tcp       smtp
80      open        tcp       http
111     open        tcp       sunrpc
119     open        tcp       nntp
3306    open        tcp       mysql
4333    open        tcp       msql
```

*`beispiel1.de`, eigentlich ein Web- und FTP-Server, bietet außerdem die Dienste ftp, ssh, smtp, sunrpc, nntp, mysql und msql an. Davon ist ssh, ein mit starker Kryptographie verschlüsselndes und authentisierendes Protokoll, unbedenklich. Die Protokolle httpd, ftp, smtp und nntp sind die eigentlichen Dienste des Servers und müssen angeboten werden. Solange ftp nur als FTP-Server für Anon-FTP eingesetzt wird, werden keine abhörbaren Paßworte übertragen. Die sunrpc, mysql und msql-Ports von außen zugänglich zu machen ist nicht nötig. Die Ports gehören in einer Firewall oder mit einen Paketfilter gesperrt.*

*Bei den Diensten, die man nach außen anbietet sollte man unbedingt auf aktuelle Versionen der Server achten: Buffer-Overflows und andere Probleme sind von ssh, von vielen FTP-Servern und auch von alten sendmail- und INN-Versionen bekannt.*

Manchmal findet man einen offenen Port, kann aber nicht sagen, welches Programm diesen Port benutzt. 
Hier ist ein Tool wie `lsof` sehr nützlich.
Alle lokal offenen Ports und die dazugehörigen Programme kann man mit dem Kommando `lsof -P -n -i` auflisten.

```console
# lsof -P -n -i
COMMAND    PID USER   FD   TYPE DEVICE SIZE NODE NAME
xfstt       46 root    4u  IPv4     30       TCP *:7100 (LISTEN)
httpd      199 root   19u  IPv4     99       TCP 193.102.57.12:80 (LISTEN)
...
smbd     11741 root    5u  IPv4  28694       UDP 127.0.0.1:1180
smbd     11741 root    6u  IPv4  28689       TCP 193.102.57.3:139->193.102.57.2:1044 (ESTABLISHED)
```

Durch die Angabe von Suchoptionen kann man gezielt nach Protokoll und Port suchen:

```console
# lsof -P -n -i tcp:139
COMMAND   PID USER   FD   TYPE DEVICE SIZE NODE NAME
smbd      276 root    5u  IPv4    175       TCP *:139 (LISTEN)
smbd    11741 root    6u  IPv4  28689       TCP 193.102.57.3:139->193.102.57.2:1044 (ESTABLISHED)
```

## Dump einer Zone mit nslookup

Um festzustellen, welche Rechner in einer Domain stehen, kann man mit einem Tool wie nmap das ganze Teilnetz durchprüfen, in dem ein Server steht.
Alternativ kann man sich auch die Daten im DNS ansehen, die ein Serverbetreiber über seine Domain veröffentlicht.

Am Beispiel der Domain `beispiel1.de`:

```console
# nslookup

> set type=ns
> www.beispiel1.de.
Server:  nuki.netuse.de
Address:  193.98.110.1

beispiel1.de
        origin = ns.beispiel1.de
        mail addr = postmaster.ns.beispiel1.de
        serial = 2000032201
        refresh = 10800 (3H)
        retry   = 3600 (1H)
        expire  = 604800 (1W)
        minimum ttl = 86400 (1D)
> server ns.beispiel1.de
Default Server:  ns.beispiel1.de
Address:  192.168.254.37

> ls beispiel1.de.
[ns.beispiel1.de]
$ORIGIN beispiel1.de.
@                       1D IN A         192.168.253.131
wwwtest                 1D IN A         192.168.253.135
news                    1D IN A         192.168.253.136
localhost               1D IN A         127.0.0.1
listserv                1D IN A         192.168.253.136
...
igate                   1D IN A         192.168.254.34
daiquiri                1D IN A         192.168.254.61
```

Durch `set type=ns` (Nameserver) sagen wir `nslookup`, daß wir ausschließlich Informationen über Nameserver einer Domain haben möchten.
Wir fragen dann mit `www.beispiel1.de.` nach den Nameservern der Domain `beispiel1.de`.
Dies ist nur ein einzelner Server, nämlich `ns.beispiel1.de`.

Wir sagen nun mit Hilfe des Kommandos `server ns.beispiel1.de`, daß `nslookup` alle weiteren Fragen an diesen Server richten soll. 
Mit Hilfe des Kommandos `ls beispiel1.de` fordern wir ein Listing der gesamten Zone `beispiel1.de` an. 
Wir erhalten eine Liste aller Hostnamen und IP-Nummern, die der Betreiber der Domain `beispiel1.de` veröffentlicht.

Besser konfigurierte Nameserver erlauben ab BIND8, Zonetransfers auf die Secondary-Server einer Domain einzuschränken.
`ls`-Kommandos von anderen Hosts schlagen dann fehl.
Hat eine Domain mehrere Nameserver, ist es unter Umständen lohnend, diese nacheinander durchzuprobieren:
Vielfach ist der Primary Nameserver restriktiv konfiguriert, aber die Secondaries geben einem dennoch ein Listing der Zone.

Sicherheitsbewußte Netzbetreiber setzen Nameserver für das Internet und ihr Intranet getrennt auf.
Schließlich braucht es niemanden zu interessieren, welche Rechner in den Büros einer Firma laufen und wie diese heißen.
Stattdessen ist vollkommen ausreichend, die Namen und Nummern der Rechner zu publizieren, die Dienste für die Öffentlichkeit bringen, also etwa der Web-, der Name- und der Mailserver einer Domain.

## Netzwerk-Kartierung mit Cheops

![](2000/05/net.jpg)

*Mit Hilfe des Gnome-Programmes Cheops bekommt man schnell einen graphischen Netzplan mit Rechnertypen und Verbindungen. 
Das Programm kann auch eingesetzt werden, um Portscans von Rechnern durchzuführen, ist hier aber nicht so vielseitig wie nmap.*

## Unverschlüsselte Verbindung in Ethereal

![](2000/05/ethereal.gif)

*Mit Hilfe des Netzwerkmonitors Ethereal ist die Analyse von Netzwerkpaketen möglich. Mit Hilfe der Stromverfolgung können dabei die Klartextpaßworte in Protokollen wie TELNET, FTP, POP3 und anderen sehr gut sichtbar gemacht werden.*

## rpcinfo-Anfrage an www.beispiel1.de</h3></a>

Mit Hilfe der Tools `rpcinfo` und `showmount` (Linux: auch `kshowmount`) kann man abfragen, welche Dienste der `sunrpc`-Dienst  erbringt.
Falls das SUN Network Filesystem (NFS) zu diesen Diensten gehört, kann man weiterfragen, welche Dateisysteme und für wen exportiert werden.

```console
# rpcinfo -p www.beispiel1.de
   program vers proto   port
    100000    4   tcp    111  portmapper
    100000    3   tcp    111  portmapper
    100000    2   tcp    111  portmapper
    100000    4   udp    111  portmapper
    100000    3   udp    111  portmapper
    100000    2   udp    111  portmapper
```

Wie man sieht, redet der `sunrpc`-Dienst von `www.beispiel1.de` mit externen Rechnern.
Das ist nicht notwendig und der Dienst kann blockiert werden, etwa durch eine Firewall oder durch Konfiguration entsprechender Filtermechanismen.

Eine sehr häufige Fehlkonfiguration besteht darin, Verzeichnisse mit NFS weltweit les- und schreibbar freizugeben. 
Beispielhaft unsicher die Server von `beispiel2.de`:

```console
# /usr/sbin/kshowmount -e rzserv2.beispiel2.de
Export list for rzserv2.beispiel2.de:
/usr/lib/cobol       (everyone)
/usr/sys/inst.images (everyone)
/stadtinf            (everyone)
/var/spool/mail      (everyone)
/usr/lpp/info        (everyone)
/usr/local           (everyone)
/pd-software         (everyone)
/u1                  (everyone)
/user                (everyone)
/fix                 (everyone)
/u                   (everyone)
/ora                 rzws01
/install             (everyone)
/ora-client          192.168.252.20
```

Die mit `everyone` gelisteten Verzeichnisse, darunter die Mail und die Homeverzeichnisse der Benutzer, sind weltweit les- und schreibbar.
Durch Zugriffe auf die `/usr/local` und `/usr/lib/cobol`-Verzeichnisse lassen sich Systembibiotheken und Systemprogramme austauschen, sodaß das ganze System ohne nennenswerten Widerstand sofort einnehmbar ist.
Tauscht man Daten im `/install`-Verzeichnis aus, sind auch alle Clients subvertiert, die von dieser Maschine installiert werden. 
Das System ist durch seine fahrlässig offene Konfiguration also die ideale Ausgangsbasis für weitere Angriffe gegen andere Netzwerke.

## SNMP-Abfragen an ein entferntes System

SNMP gehört zu den Diensten, die einem Angreifer ein Höchstmaß an Information liefern können und die in Standardinstallationen oft nicht abgeschaltet und unzureichend gesichert werden.
Zudem läuft der Dienst über UDP, das von vielen Portscannern nicht per Default gescannt wird.
Daher taucht der Dienst auf dem Radar vieler Systemadministratoren nicht auf.

Wieder dienen die Server von `beispiel2.de` als abschreckendes Beispiel:

```console
# snmpwalk rzserv2.beispiel2.de public
system.sysDescr.0 = OCTET STRING: "Fore Systems ATM Host (AIX 1 000005016600)"
system.sysObjectID.0 = OBJECT IDENTIFIER: enterprises.326.2.1
system.sysUpTime.0 = Timeticks: (0) 0:00:00
system.sysContact.0 = OCTET STRING: ""
system.sysName.0 = OCTET STRING: "rzserv2."
system.sysLocation.0 = OCTET STRING: ""
system.sysServices.0 = INTEGER: 72
interfaces.ifNumber.0 = INTEGER: 7
interfaces.ifTable.ifEntry.ifIndex.1 = INTEGER: 1
interfaces.ifTable.ifEntry.ifIndex.2 = INTEGER: 2
interfaces.ifTable.ifEntry.ifIndex.3 = INTEGER: 3
interfaces.ifTable.ifEntry.ifIndex.4 = INTEGER: 4
interfaces.ifTable.ifEntry.ifIndex.5 = INTEGER: 5
...
```

Wir erfahren hier nicht nur den Typ und Patchlevel des Systems, sondern (nicht gezeigt) auch eine Liste der Interfaces und Routingkonfiguration des Systems - wir bekommen also detaillierte Information über die Topologie des Zielnetzes.
Zusammen mit Daten aus dem DNS gibt uns das einen genauen Netzplan des potentiellen Opfers.
Wenn weitere Management Module installiert sind, bekommen Zugriff auf weitere Subsysteme, etwa Oracle, SAP oder andere fernzuüberwachende Einheiten. 
SNMP wird auch in vielen Routern und in RMON Netzwerkprobes eingesetzt - ein Eindringling kann so sogar Verkehrsdaten aus dem Netz erfahren, wenn diese nicht gesichert worden sind.

## Ein Server lagert vertrauliche Daten in zugänglichen Verzeichnissen

Eine weitere beliebte Fehlerklasse besteht in vertraulichen Daten, die in durch den Webserver zugänglichen Verzeichnissen gelagert werden.
Häufig bieten Webspace-Provider virtuelle Webserver an, bei denen die Wurzel des durch den Anwender beschreibbaren Bereiches (etwa: `/home/www/servers/www.kunde.de/`, für den Kunden sichtbar als `/`) auch die Wurzel des virtuellen Servers ist (etwa: `http://www.kunde.de/`).
Legt der Kunde jetzt Daten unterhalb seines Wurzelverzeichnisses ab (etwa eine Datei `/passwd`) dann ist diese Datei auch durch den Webserver abrufbar, denn sie liegt ja unterhalb der Document Root und hat eine URL (etwa: `http://www.kunde.de/passwd`).

Viele Webshops schreiben Bestellungen in ein oder mehrere Logverzeichnisse oder haben Konfigurationsdateien mit Paßworten und Artikeldaten.
Liegen diese Daten unterhalb der Document Root, dann haben sie URLs und sind zunächst einmal prinzipiell über das Web abrufbar, sofern es einem Angreifer gelingt den Namen zu raten.
Kennt man den Namen und die Version der verwendeten Websoftware, ist dies meist sehr einfach zu machen.

Prinzipielle Abhilfe schaffen hier nur Hostingumgebungen, bei denen die Document Root des Webservers tiefer als die Wurzel des Kundenverzeichnisses liegt (etwa ab `/home/www/servers/www.kunde.de/pages`). 
Nun kann der Kunde weitere Verzeichnisse oberhalb der Document Root anlegen (etwa: `/home/www/servers/www.kunde.de/shop`) und seine vertraulichen Daten dort speichern.
Da diese Verzeichnisse über das Wartungs-FTP, nicht aber mit HTTP zugänglich sind, können sie nicht so einfach abgerufen werden.

Alternativ legt man Verzeichnisse unterhalb der Document Root an und verbietet den Zugriff per HTTP auf das Verzeichnis durch Anlegen einer `.htaccess`-Datei (Apache-Webserver).
Die Datei sollte den Zugriff von überall verbieten:

```console
$ cat /shop/.htaccess
order deny, allow
deny from all
```

Daten können dann nur noch über FTP abgerufen werden. Für FTP gelten `.htaccess`-Dateien nicht.

## Ein Server vertraut Eingabeparametern aus Webformularen ohne Grund

Die dritte häufige Fehlerklasse besteht darin, in CGI-Programmen Parameter aus dem Web zu übernehmen und ohne Prüfung zu verwenden.

Eine Webanwendung besteht aus Komponenten die innerhalb der Firewall liegen und als vertrauenswürdig gelten können, weil sie durch den lokalen Administrator kontrolliert werden. 
Dazu gehören etwa die lokalen Scripte, die Datenbank, der Webserver und lokale Datendateien.
Dazu kommen dann weitere Komponenten, die außerhalb der Firewall liegen und die grundsätzlich als nicht vertrauenswürdig gelten können. 
Das ist hauptsächlich der Browser des Anwenders, wenn er denn einen benutzt und seinen Webrequest zwecks Hackangriff nicht direkt in ein Telnet tippt.
Die Firewall markiert eine Vertrauensgrenze, eine Trust Boundary.

Daten von jenseits der Vertrauensgrenze kann eine Webanwendung nicht ohne Prüfung vertrauen.
Dazu gehören alle Parameter, die dem CGI-Script übergeben werden, also alle GET-, POST- oder COOKIE-Parameter, der HTTP_REFERER, der HTTP_USER_AGENT und alle weiteren Werte von außen.
Alle diese Werte müssen vor der Verwendung durch ein CGI-Script durch eine Gültigkeitsprüfung, in der sichergestellt wird, daß die Daten auch das erwartete Format haben und gültige Werte besitzen.

Zum Beispiel ist es gängige Praxis, daß bestimmte Scripte Werte nur dann akzeptieren, wenn bei der Übergabe der HTTP_REFERER des Aufrufes korrekt ist.
Auf diese Weise versucht sich das Script gegen gefälschte Aufrufe zu schützen.
Natürlich ist es für einen potentiellen Angreifer überhaupt gar kein Problem außer den Scriptparametern auch noch jeden gewünschten HTTP_REFERER mit zu übergeben - der Schutz ist also wirkungslos.
Korrekt wäre, wenn das Script jeden übergebenen Parametern einzeln prüft.

Eine andere häufig verwendete Technik besteht darin, Parameter von einer Seite zur nächsten als `<INPUT TYPE="HIDDEN">` mitzuschleifen.
Dabei wird interner Zustand der Anwendung im Browser des Anwenders gehalten, also jenseits der Trust Boundary.
Für den Anwender ist es ein leichtes, den Zustand einer solchen Anwendung zu manipulieren und jeden gewünschten Effekt zu bewirken. 
Korrekt wäre, eine Plattform zu verwenden, die Sessionvariablen bietet und den Zustand der Anwendung auf dem Webserver halten kann (etwa: Microsoft ASP mit dem Session-Objekt, PHP3 mit PHPLIB, PHP4 mit den
`session_*()`-Funktionen oder einen richtigen Application-Server).

## Fazit

Webmaster sind gut beraten, alle ihre Installationen auf diese drei Fehlerklassen abzuprüfen und ihre Anwendungen gegebenenfalls anzupassen.
Gestohlene Kreditkartendaten oder gar geknackte Server, die als Ausgangspunkt für weitere Angriffe dienen, sind nicht nur peinlich:
Derartige Installationen sind fahrlässig unsicher und dem betroffenen Betreiber stehen mit großer Wahrscheinlichkeit Klagen auf Schadenersatz oder Beihilfe zum Computereinbruch ins Haus.

Für den Laien ist dies keine Alternative:
Die Sicherheit eines Servers zu verifizieren setzt nicht nur umfassende technische Kenntnisse, sondern auch Zugang zum Server voraus.
Letztendlich kann nur ein technisches Gütesiegel, das auf Grundlage einer technischen Überprüfung der Server und aller darauf laufenden Anwendungen erteilt wird dem Verbraucher mitteilen, daß er es mit einer seriösen Installation zu tun hat.

# Referenzen:

[http://www.koehntopp.de/kris/artikel/webtune/](http://www.koehntopp.de/kris/artikel/webtune/):
: "Webserver verstehen und tunen"

[http://www.koehntopp.de/php/](http://www.koehntopp.de/php/):
: "de.comp.lang.php - Häufig gestellte Fragen"

[http://www.insecure.org/nmap/](http://www.insecure.org/nmap/):
: "NMAP Port Scanner"

[http://ethereal.zing.org/](http://ethereal.zing.org/):
: "Ethereal Network Monitor"

[http://www.marko.net/cheops](http://www.marko.net/cheops/):
: "Ceops Network Mapper"

[http://freshmeat.net/appindex/1998/04/06/891857252.html](http://freshmeat.net/appindex/1998/04/06/891857252.html):
: "lsof - list open files"

"TCP/IP Illustrated, Volume 1: The Protocols":
: W. Richard Stevens, Addison-Wesley

"Hacking Exposed - Network Security Secrets & Solutions":
: McClure, Scambray and Kurtz, Osborne

"Maximum Linux Security": 
: Anonymous, Sams
