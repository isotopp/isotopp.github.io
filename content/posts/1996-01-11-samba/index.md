---
author: isotopp
date: "1996-01-11T09:00:00Z"
feature-img: assets/img/background/rijksmuseum.jpg
tags:
- lang_de
- publication
- unix
title: "Samba"
aliases:
  - /1996/01/11/samba.html
---

**erschienen in der iX 1/96**

- [Text des Artikels](#samba-19)
- [Samba im Internet](#samba-im-internet)
- [Eine Standardkonfiguration](#eine-standardkonfiguration)

# Samba 1.9

#### Samba ist ein Softwarepaket für Unix, das Microsoft Lan Manager Server-Funktionen erbringt. Ursprünglich von Andrew Tridgell, einem Studenten an der Australian National University, Canberra erstellt, ist es inzwischen unter der GNU General Public License verfügbar.

Andrew Tridgell, ein Student an der Australian National University Canberra, stand Ende 1991 vor dem Problem, einen Fileserver für SUN Workstations haben zu müssen, der zu DEC Pathworks für kompatibel ist. 
Ohne Informationen über die Art des verwendeten Protokolls zu haben, gelang es ihm schon nach wenigen Tagen, das verwendete Protokoll in Teilen zu reverse engineeren.
Erst nachdem eine allererste Version seines Servers schon fertiggestellt war, wies man ihn auf das in RFC 1001 und 1002 definierte "NetBIOS on a TCP/UDP transport" Protokoll hin.
Im Januar wurde die erste Version seines "Server 0.1" Paketes auf dem Netz veröffentlicht. 
Es sollte jedoch noch bis Ende 1993 dauern, bis Tridgell durch den Einsatz von Linux und die Notwendigkeit, mit PCs unter DOS, Windows und OS/2 zu kommunizieren, die Weiterentwicklung von Samba wieder aufnahm. 

Heute ist Samba ein relativ ausgereiftes, standardkonformes und vor allen Dingen hochportables Softwarepaket, das auf den meisten UNIX-Versionen problemlos installierbar ist und die Möglichkeit bietet, Verzeichnisse und Drucker an PC-Betriebssysteme zu exportieren.
Samba konkurriert hier mit dem von SUN definierten Network File System (NFS).

Für den Systemadministrator in einem heterogenen Netzwerk von UNIX-Servern und Client-PCs ist Samba dabei wahrscheinlich attraktiver als NFS, denn in den meisten Fällen stehen wenigen UNIX-Servern viele Client-PCs gegenüber. 
Beim Einsatz von NFS könnte zwar das mit den meisten UNIX-Versionen mitgelieferte Serverpaket verwendet werden, aber für die Clients müßten nicht nur viele Client-Lizenzen von PC-NFS oder etwas vergleichbarem angeschafft werden, sondern diese Software müßte auch netzwerkweit installiert und gewartet werden. 
Windows für Workgroups, Windows 95, Windows NT und OS/2 sprechen aber schon von Haus aus das Lan Manager Protokoll und so ist es effizienter, den wenigen Servern dieses Protokoll beizubringen und auf den Clients mitgelieferte Software zu verwenden. 
Diesen Weg geht Samba.

Da der Samba-Server ein reiner Usermode-Server ist, also ein ganz normales Anwendungsprogramm, ist es möglich, auch Verzeichnisse per Samba zu reexportieren, die der Server per NFS gemountet hat.
Auf diese Weise entsteht eine Protokollbrücke von NFS nach SMB. 
Dabei ist natürlich der Performanceverlust durch doppelten Netzzugriff in Kauf zu nehmen.
Auf der anderen Seite ist Samba unter der GNU GPL frei zur Verfügung stehende Software und so steht der Installation des Samba-Servers auf allen Servermaschinen nichts im Weg.

Es soll jedoch nicht verschwiegen werden, daß Samba aus der Sicht eines UNIX-Systemverwalters schwerwiegende Nachteile hat.
Als Protokoll, das in der PC-Welt entstanden ist, kennt Samba kein Konzept eines Dateieigentümers. 
Die Zugriffe auf Ressourcen erfolgen oft mit unklaren Userrechten oder scheinbar willkürlich gewählten Paßworten.
Betriebssysteme wie Windows für Workgroups und Windows'95, die dem Benutzer zwar einen Namen geben, dann aber Netzwerkzugriffe ohne oder unter anderen Namen erzeugen, machen die Sache nicht leichter.
Dazu kommt, daß die Familie der Windows-Betriebssysteme die Groß-/Kleinschreibung von Paßworten in einigen Kombinationen von Betriebssystem/Paßwort verändern.
Samba hat eine ganze Reihe Mechanismen, um diesem Problem abzuhelfen, aber der Verwaltungsaufwand ist anfangs trotzdem höher als bei einer typischen NFS-Installation.<p>

![](1996/01/SuperNOS.gif)

*Novell hat versucht, das Super Network Operating System durch Verschmelzung der zugekauften UNIX-Quellen mit ihrem eigenen Serverbetriebssystem zu bauen und ist gescheitert. Klammheimlich hat das frei verfügbare Linux gelernt, die meisten Netzwerkprotokolle zu sprechen und ist auf dem besten Wege, eben dieses SuperNOS zu werden.*

## Installation

Die Installation gestaltet sich relativ einfach.
Nach dem Auspacken ist das Makefile im `source/`-Verzeichnis nach den eigenen Wünschen anzupassen. 
Dabei ist es hilfreich, nicht nur die gewünschten Pfadnamen einzutragen, sondern auch schon den Namen der gewünschten Arbeitsgruppe in der Variablen `WORKGROUP` einzutragen und einen speziellen  Gastaccount, der nur für SMB genutzt wird, in `GUESTACCOUNT` einzucompilieren.
Diese Defaults sind zwar auch zur Laufzeit änderbar, aber anpassen im Quelltext erspart das Schreiben von Konfigurationsdateien.
Weiterhin sind noch die gewünschten `make`-Optionen für den verwendeten Betriebssystemtyp zu aktivieren. 
Danach steht einem `make` nichts mehr im Wege.

Erzeugt werden die Programme

nmbd:
: NetBios Name Server. Der Name Server ist in der Lage, Hostnamen auf IP-Nummern abzubilden. Gleichzeitig steuert das Programm aber auch das Browsing, d.h. die Anzeige von exportierten Diensten und übernimmt damit Aufgaben, die bei NFS der `mountd` wahrnehmen würde.

nmblookup:
: NetBios Name Lookup. Das Programm nimmt in etwa dieselbe Funktion wahr wie `nslookup` für das DNS, fragt jedoch einen `nmbd` ab.

smbclient:
: Samba Client. Dient dazu, auf Linux-Seite einen SMB Server zu connecten und Dateien zu übertragen. Die Steuerung erfolgt ähnlich wie bei FTP. Linux bietet auch ein echtes, kernelbasiertes `smbfs` an, mit dem man einen Server richtig mounten kann. Andere Betriebssysteme sind auf den `smbclient` angewiesen.

smbd:
: Der eigentliche Fileserver.

smbpasswd:
: Ein Hilfsprogramm des `smbd`, mit dem Benutzer vom Client aus ihr Paßwort ändern können sollen. Es hat nur dann Funktion, wenn Samba mit der `libdes` und verschlüsselten Paßworten (siehe **Samba im Internet**) übersetzt wurde.

smbrun:
: Ein Hilfsprogramm des `smbd`, mit dem Samba zu Beginn und Ende einer Serverconnection Logbucheinträge erzeugt.

smbstatus:
: Ein sehr einfaches Programm zur Anzeige des Status aller zum Server bestehenden Verbindungen.

smbtar:
: Ein Shellscript, das `smbclient` verwendet und das ein von einem PC exportiertes Verzeichnis mit `tar` auf dem Bandlaufwerk des UNIX-Servers sichert.

testparm:
: Syntaxchecker für die Konfigurationsdatei.

testprns:
: Syntaxchecker für die Druckerkonfiguration.

![](1996/01/programme.gif)

*Samba besteht aus einer Reihe von Programmen, die zum Betrieb des Servers (Server-Tools) oder zu seinem Test (Client-Tools) dienen.*

Ein `make install` installiert diese Programme und die Manualpages dann im gewünschten Verzeichnis. 
Damit der Server in Betrieb genommen werden kann, müssen `nmbd` und `smbd` entweder als permanent laufende Dämonen gestartet werden oder über passende Einträge in der `/etc/inetd.conf` bei Bedarf hochgezogen werden.

Für letzteres sind die Einträge

```console
netbios-ns      137/tcp                         # NETBIOS Name Service
netbios-ns      137/udp
netbios-dgm     138/tcp                         # NETBIOS Datagram Service
netbios-dgm     138/udp
netbios-ssn     139/tcp                         # NETBIOS session service
netbios-ssn     139/udp
```

in der Datei `/etc/services` notwendig. Dazu passen dann die Zeilen

```console
#
# SMB Samba File Server
#
netbios-ssn stream tcp  nowait  root    /usr/local/samba/bin/smbd smbd 
netbios-ns  dgram  udp  wait    root    /usr/local/samba/bin/nmbd nmbd -H /usr/local/samba/lib/lmhosts
```
in der `/etc/inetd.conf`. 
Der `inetd` muß nach einer Änderung in seiner Konfigurationsdatei durch ein `SIGHUP` geweckt werden, damit er die Datei neu einliest.

## Tests mit einer einfachen Konfiguration

Durch die Verwendung einer `lmhosts`-Datei kann der Samba-Server als Nameserver für ein Lan Manager Netzwerk dienen. 
Die `lmhosts`-Datei entspricht dabei in ihren ersten beiden Spalten einer normalen Hosts-Datei: 
In der ersten Spalte wird eine IP-Nummer genannt, der in der zweiten Spalte ein Name zugeordnet wird.
Mit einer optionalen, dritten Spalte können für einzelne Namen bestimmte Flags gesetzt werden:
Der Buchstabe `G` kennzeichnet einen Namen als den Namen der eigenen Arbeitsgruppe.
Die zugehörige Adresse ist die Broadcast-Adresse der betreffenden Arbeitsgruppe.
Das Flag `S` kennzeichnet die Namen und Broadcastadressen weiterer Arbeitsgruppen, in denen die Dienste unseres Servers ebenfalls angepriesen (registriert) werden sollen.
Und das Flag `M` schließlich kennzeichnet diesen Eintrag als den defaultmäßigen Netbios-Namen dieser Maschine.

Der nächste Schritt ist die Erzeugung der zentralen Konfigurationsdatei.
Wenn Samba im Defaultverzeichnis `/usr/local/samba` installiert worden ist, muß diese Datei in `/usr/local/samba/lib/smb.conf` angelegt werden.
Ihr Aufbau gleicht syntaktisch dem einer WIN.INI-Datei von MS-Windows:
Sie besteht aus Abschnitten, die jeweils durch einen Namen in eckigen Klammern eingeleitet wird. 
Jeder Abschnitt enthält dann eine Reihe von Zuweisungen der Form `Parameter = Wert`.
Parameter dürfen genau wie Abschnittnamen Leerzeichen enthalten, die Samba ignoriert.
Ebenso spielt Gross- und Kleinschreibung keine Rolle.

Jeder Abschnitt der `smb.conf` definiert einen Service, der von Samba exportiert wird.
Ein Service kann dabei ein Drucker oder - häufiger - ein Verzeichnis sein.
Samba kennt drei Abschnitte, die besondere Bedeutung haben:

[global]:
: In diesem Abschnitt werden besondere, globale Einstellungen für den Server getroffen.

[printers]:
: In diesem Abschnitt kann man alle Drucker der `/etc/printcap` exportieren.

[homes]:
: In diesem Abschnitt kann man alle Homeverzeichnisse des Servers exportieren.

Samba bietet nun buchstäblich Dutzende von Parametern, mit denen man den Server seinen Bedürfnissen anpassen kann.
Zum Glück sind die Defaults jedoch so eingestellt, daß man nur wenige dieser Parameter wirklich anpassen muß.

Zum Testen sollte man eine minimale `smb.conf anlegen.`Sie könnte zum Beispiel so aussehen:

```console
[global]
        guest account = smbguest

[tmp]
        comment = temporary files 
        path = /tmp
        read only = yes
```

Der Account `smbguest` ist dabei ein User mit minimalen Rechten. 
Der Abschnitt `[tmp]` exportiert das lokale `/tmp`-Verzeichnis read-only an die Welt.

Die Korrektheit dieser Konfigurationsdatei kann mit dem Kommando

```console
$ SAM=/usr/local/samba
$ $SAM/bin/testparm $SAM/lib/smb.conf | more
```

schnell überprüft werden.
`testparm` liest die Datei ein und zeigt an, ob die Datei syntaktisch korrekt ist. 
Danach werden die Werte aller internen Konfigurationsvariablen ausgegeben.
Auf diese Weise kann man schnell sehen, mit welchen internen Parameterwerten Samba wirklich operiert.

Mit dem `smbclient` kann man nun ausprobieren, ob das gewünschte Verzeichnis wirklich exportiert wird:

```console
$SAM/bin/smbclient -L localhost -U%
Server time is Thu Nov 23 11:17:01 1995
Timezone is UTC+1.0
Domain=[DAHEIM] OS=[Unix] Server=[Samba 1.9.15p3]

Server=[localhost] User=[smbguest] Workgroup=[DAHEIM] Domain=[DAHEIM]

        Sharename      Type      Comment
        ---------      ----      -------
        tmp            Disk      temporary files
        IPC$           IPC       IPC Service (Samba 1.9.15p3)


This machine has a browse list:

        Server               Comment
        ---------            -------
        WHITE                Samba 1.9.15p3
        MAHAKI               
```

Die Meldung "bad password" an dieser Stelle würde anzeigen, daß der Gastaccount von Samba nicht richtig gesetzt ist oder nicht verwendet werden kann.
Auch "hosts allow" und "hosts deny"-Einträge, die unseren eigenen Rechner ausschließen, oder "valid users" und "invalid users", die zu strikt gesetzt sind, können zu der Fehlermeldung führen.

Die Meldung "connection refused" deutet dagegen darauf hin, daß auf den Samba-Sockets kein Dämon zuhört.
Ein häufiger Fehler ist es, den inetd nach Änderungen an der Konfigurationsdatei nicht mit `SIGHUP` zu wecken.
`netstat -a` zeigt an, ob jemand auf dem Port `netbios-ssn` zuhört.

Ähnlich kann man die Funktionsfähigkeit des `nmbd` überprüfen:
Das Kommando

```console
$ $SAM/bin/nmblookup -B localhost __SAMBA__
Sending queries to 127.0.0.1
193.102.57.4 __SAMBA__
```

sollte die IP-Adresse des eigenen Servers zurückliefern. Ebenso sollte ein

``` 
$ $SAM/bin/nmblookup -B mahaki '*'
Sending queries to 193.102.57.2
193.102.57.2 *
```

die Adresse des Clients zurückliefern. 
Und schließlich sollten sich bei einem

```console
$ $SAM/bin/nmblookup -d 2 '*'
Netmask for eth0 = 255.255.255.0
Derived broadcast address 193.102.57.255
Using broadcast 193.102.57.255
Sending queries to 193.102.57.255
Got a positive name query response from 193.102.57.2 (193.102.57.2)
Got a positive name query response from 193.102.57.4 (193.102.57.4)
193.102.57.4 *
```

alle Teilnehmer des lokalen Netzes melden, falls sie schnell genug sind.
Falls Server und Client nicht auf demselben Subnetz sind, ist es notwendig, die korrekte Broadcast-Adresse des entfernten Subnetzes mit der Option -B anzugeben.

Wenn man so sichergestellt hat, daß sich alle Rechner untereinander kennen und einander erreichen können, kann man versuchen, erst einmal lokal auf die exportierten Ressourcen
zuzugreifen:

```console
$ $SAM/bin/smbclient "\\\\localhost\\tmp"
Server time is Thu Nov 23 11:28:06 1995
Timezone is UTC+1.0
Password: 
Domain=[DAHEIM] OS=[Unix] Server=[Samba 1.9.15p3]
smb: \> dir
  isdnctrl0                                226942  Thu Nov 23 10:14:14 1995
  crond_running                                 0  Thu Nov 23 11:28:01 1995
```

Der Name der verwendeten Ressource wird DOS-Konform mit `\\rechner\ressource` bezeichnet.
Die verwendete Shell macht es jedoch notwendig, Backslashes als `\\` zu escapen.
Die Schreibweise des Kommandos erscheint so etwas merkwürdig.
Samba versucht sich unter dem normalen Usernamen anzumelden. 
Das verlangte Paßwort ist also das normale Paßwort des Accounts. 
Möchte man unter einem anderen Benutzernamen testen, ist die Option `-U username` hinter dem Namen der Ressource anzugeben.

`smbclient` arbeitet ähnlich wie `ftp` und versteht Kommandos wie "help", "get", "put" und "quit".
Wegen der Option `read only = yes` in der `smb.conf` schlägt ein "put" wie erwartet fehl:

```console
smb: \> put username.map
ERRDOS - ERRnoaccess (Access denied.) opening remote file \username.map
```

Wenn dies alles funktioniert, kann man versuchen, vom PC aus auf das Verzeichnis zuzugreifen.
Aus einem DOS-Fenster sollte man die exportierten Ressourcen mit

```console
E:\users\default>net view "\\white"
Freigegebene Ressourcen auf \\white

Samba 1.9.15p3

Name         Typ          Lokal    Beschreibung

-------------------------------------------------------------------------------
tmp          Platte                temporary files
Der Befehl wurde erfolgreich ausgeführt.
```

ansehen. Mit 

```console
E:\users\default>net use "\\white\tmp" /user:kris
Das Kennwort für \\white\tmp ist ungültig.

Geben Sie das Kennwort für \\white\tmp ein:
Der Befehl wurde erfolgreich ausgeführt.
```

kann man sich dann beim Server anmelden.
Programme, die erweiterte Pfadnamen mit `\\rechnername` verstehen, können jetzt schon auf das Laufwerk zugreifen. 
Der Samba-Server sollte nun auch im Dateimanager unter "Datenträger", "Netzwerklaufwerk verbinden" sichtbar sein.

Die Bemerkung "Das Kennwort für ... ist ungültig" des Windows NT-Servers aus dem Beispiel tritt übrigens auf, weil der Samba Server ohne verschlüsselte Paßworte  übersetzt wurde.
Wir der Server mit der `libdes` und der Option `encrypted passswords = yes` in der `smb.conf` installiert, erfolgt das Login ohne Rückfrage.

## Geschwindigkeit

Samba verwendet ein verbindungsorientiertes und asynchrones Protokoll und unterliegt so nicht den Einschränkungen, die die Geschwindigkeit von NFS begrenzen.
Auf der anderen Seite ist der Samba-Server so natürlich nicht so datensicher wie ein NFS-Server.
In der Praxis sollte das wenig ausmachen, da die Clients PCs sind und so vermutlich häufiger abstürzen...

Geschwindigkeitsprobleme kann es beim Einloggen geben, wenn der Client ein Windows für Workgroups ist und Samba das Loginpaßwort raten muß (siehe Kasten "Eine Standardkonfiguration").
Falls das richtige Paßwort mehrere Großbuchstaben enthält und die `crypt()`-Routine des Servers hinreichend langsam ist, können so einige Sekunden vergehen.

Der Text `SPEED.txt` aus der Samba-Dokumentation enthält außerdem einige weitere Tips, mit der man die Geschwindigkeit des Servers unter Umständen weiter verbessern kann:
Niedrige Debug-Level, große Puffer und überlappende Zugriffe auf Platte und Netzwerk können die Serverperformance weiter steigern.

Alles in allem erreicht Samba so eine Performance, die einem Windows NT Server oder einem Pathworks Server vergleichbar ist.

<hr>

# Samba im Internet

Die zur Zeit der Entstehung dieses Artikels aktuelle Version von
Samba ist 1.9.15, Patch 3.

Das Homeverzeichnis von Samba ist [ftp://nimbus.anu.edu.au/pub/tridge/samba](ftp://nimbus.anu.edu.au/pub/tridge/samba).
Da jedoch die Internet-Anbindung von Australien aus der Sicht von Deutschland nicht überragend ist, ist es vorteilhaft, sich Samba von einem der offiziellen Mirrors zu kopieren. 
Die Dokumentation nennt dazu unter anderem
[ftp://sunsite.unc.edu/pub/Linux/system/Network/Samba](ftp://sunsite.unc.edu/pub/Linux/system/Network/Samba)
und
[ftp://ftp.uni-trier.de/pub/unix/network/samba](ftp://ftp.uni-trier.de/pub/unix/network/samba).

Das Paket liegt außerdem auf vielen deutschen Sunsite-Mirrors und ist praktisch auf jeder besseren Linux CD-ROM auch im Quelltext archviert.
Diese Versionen hinken jedoch, wie üblich, um einige Minor-Releases hinterher.

Nicht alle Mirrors archivieren 
[ftp://nimbus.anu.edu.au/pub/tridge/libdes/libdes.tar.92-10-13.gz](ftp://nimbus.anu.edu.au/pub/tridge/libdes/libdes.tar.92-10-13.gz),
weil dies administrative Probleme beim FTP-Verkehr von und nach USA machen würde.
Diese Bibliothek ist notwendig, wenn man mit verschlüsselten Paßworten auf dem Netz arbeiten möchte.
Clients und Server unter Windows NT verhalten sich ohne verschlüsselte Paßworte jedoch eigenartig.

Samba hat eine eigene Newsgroup im USENET, `comp.protocols.smb`,
die glücklicherweise nicht sehr überlaufen ist. 
Außerdem findet man in den einschlägigen Linux-Newsgroups ebenfalls massenweise Fragen und Antworten rund um Samba.

Wer an aktuellen Informationen über Samba interessiert ist, kann sich auf der Mailingliste `samba-announce` eintragen lassen.
Dazu ist es notwendig, eine Mail an `listproc@listproc.anu.edu.au` zu senden, die im Text (nicht im Subject!) das Kommando `subscribe samba-announce Vorname Nachname` enthält.

Es existiert eine weitere Mailingliste, `samba`, die der Weiterentwicklung von Samba dient. 
Um sich dort einzuschreiben, ist `subscribe samba Vorname Nachname` an die oben angegebene Adresse zu senden.

Die Samba Home-Page ist [http://lake.canberra.edu.au/pub/samba/](http://lake.canberra.edu.au/pub/samba/)

<hr>

# Eine Standardkonfiguration

Die folgende Konfigurationsdatei dürfte die meisten
einfachen Anwendungsfälle abdecken:

```console
[global]
  ; Gastaccount zuweisen
  guest account = smbguest
  ; Nicht alle User auf dem UNIX-Rechner heißen auf dem Windows NT gleich
  ; Format:
  ; unixuser = dosalias dosalias2 dosalias3...
  ; root = administrator admin
  username map = /usr/local/samba/lib/username.map
  ; Windows NT erfordert libdes und encrypted passwords, siehe Dokumentation
  encrypt passwords = yes
  ; Samba soll Domain Master und Browse Master sein.
   os level = 33
   domain master = yes
  ; nur Verbindungen von vertrauenswürdigen Hosts zulassen
  allow hosts = black, white, mahaki
  ; DOS "share" locking simulieren
  locking = yes
  share modes = yes
  ; Windows NT Protokoll verwenden
  ; Optionen sind CORE, COREPLUS, LANMAN1, LANMAN2 und NT1
  protocol = NT1
  
  ; Dies ist die Workgroup, der wir angehören
  workgroup = DAHEIM
  
[tmp]
  comment = Zwischenablage
  path = /tmp
  read only = no

[faq]
  comment = Haeufig gestellte Fragen (aus USENET)
  path = /scratch/faq
  read only = yes

[homes]
  comment = Homeverzeichnisse
  browseable = no
  read only = no
  create mode = 0750

[printers]
  comment = Alle Drucker aus /etc/printcap
  printing = bsd
  browseable = no
  load printers = yes
  read only = yes
  printable = yes
  path = /tmp
  public = yes
  create mode = 0700
```

Diese `smb.conf``  versucht einen minimalen Sicherheitslevel herzustellen, indem nur Verbindungen von Hosts von vertrauenswürdigen zugelassen werden.
Sie exportiert zwei gewöhnliche Verzeichnisse: `/tmp` read-write und `/scratch/faq` read-only.

Außerdem werden die Drucker der `/etc/printcap` durch den besonderen Abschnitt `[printers]` und die Home-Verzeichnisse aller Benutzer durch `[homes]` exportiert.
Beide Abschnitte sind nicht als Browseable gekennzeichnet.
Dadurch erscheint nur das Home-Verzeichnis des auf dem Windows-Rechner angemeldeten Benutzers in der Browse-List des Dateimanagers.
Ebenso wird nicht `[printers]` selbst im Druckmanager angezeigt, sondern die Drucker der `/etc/printcap` werden durch das `load printers` einzeln angezeigt.

Dadurch, daß das NT1-Protkoll verwendet wird, ist es möglich, auch lange Dateinamen mit Groß-/Kleinschreibung zu verwenden.
Auch das LANMAN2-Protokoll kann dies.
Windows für Workgroups wandelt alle Paßworte in reine Großschrift um, wenn ein höheres Protokoll als COREPLUS verwendet wird.
In diesem Fall versucht Samba, das Paßwort zu raten, indem das übermittelte Paßwort in Groß- und Kleinschrift ausprobiert wird.
Mit der Option `password level = zahl` kann man Samba dazu bewegen, auch Kombinationen von Groß- und Kleinbuchstaben zu testen.
Die Zahl bestimmt dabei die maximale Anzahl von Großbuchstaben im Paßwort.
