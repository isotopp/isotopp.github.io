---
author: isotopp
date: "2005-03-19T20:08:30Z"
feature-img: assets/img/background/rijksmuseum.jpg
tags:
- computer
- usenet
- lang_de
title: "Der eigene USENET Server"
toc: true
---

Der Wegfall von "news.individual.net" als kostenloser Server für USENET News mag den einen oder anderen Benutzer des Servers motiviert haben,
sich selber mit News zu versorgen.
Dieser Text soll dabei helfen, 
etwa auf einem der üblichen Dedicated Server bei einem Hoster oder an einer anderen geeigneten Stelle im Netz einen eigenen INN als News-Server aufzusetzen,
und so zu konfigurieren, dass er ein nützlicher Teil der USENET-Infrastruktur in Deutschland ist,
und dass einige Benutzer dort News lesen können.

# Ressourcenplanung

## Traffic

Die Gruppen im deutschsprachigen Teil des USENET haben das Prefix `de.*`.
Lediglich im Teil `de.alt.dateien.*` dürfen Bild- und Programmdateien veröffentlicht werden,
und so kommt es, dass sich das Verkehrsaufkommen im Restteil `de.*,!de.alt.dateien.*` in recht engen Grenzen hält:
Pro Tag sind etwa 20 MB Traffic einzuplanen.
Internationale Gruppen können ein Verkehrsaufkommen zwischen 150 und 200 MB am Tag erzeugen.

Die Maschine, auf der inn-Server laufen soll, sollte eine feste IP-Nummer haben, die unterbrechungsfrei verfügbar ist.
Es sind Setups denkbar, in denen einer der beiden am Austausch beteiligten Partner eine wechselnde oder nur mit Unterbrechungen verfügbare Adresse hat,
aber diese sind nicht Gegenstand dieser Dokumentation.

## RAM- und Festplattenbedarf

Ein laufender `innd` auf einem Intel-basierenden Suse-Linux-System verbraucht 12 MB RAM für den `innd`, den eigentlichen Newsserver.
Außerdem werden noch ein `innfeed`-Prozess (2 MB RAM) zur Artikelweitergabe und einige Hilfsprozesse für statistische Zwecke
und zur Ausführung von Wartungsarbeiten gestartet.
Alles in allem werden 25-30 MB RAM verbraucht.

Die Speicherung der Artikel erfolgt am günstigsten in sogenannten "CNFS Cyclebuffs".
Dabei handelt es sich um Ringpuffer-Dateien fester Größe, sodass der Speicherbedarf für Artikel auf der Festplatte konstant ist.
Die Installation des Autors hat jeweils ein halbes Gigabyte für `de.*,!de.alt.dateien.*` und für regionale deutschsprachige Hierarchien reserviert.
Drei Gigabyte sind für internationale Artikel aus den Big8-Hierarchien bereitgestellt.

INN muss für lesenden Zugriff auf die Artikel eine Overview-Datenbank pflegen.
Diese belegt etwa 10% des Speichers zusätzlich, der für Artikel belegt wird.

## Weitere Anforderungen

Der CPU-Aufwand und die IO-Last auf dem Server des Autors sind vernachlässigbar.
Dazu trägt die Verwendung von CNFS ganz erheblich bei.

NNTP und NNRP, die Protokolle zum Übertragen von News und zum Lesen von News, verwenden standardmäßig den Port 119/TCP.

Der Autor verwendet Suse Linux 9.1 als Grundlage für diese Installation.
Sie ist jedoch auf allen Linux-Distributionen grundsätzlich ähnlich.

# Installation

Suse Linux 9.1 liefert im Paket `inn` einen INN in der Version 2.4.1.
Dies ist relativ aktuell.
Nach der Installation befinden sich die Konfigurationsdateien in `/etc/news`,
die öffentlichen Programme in `/usr/bin`, 
die nicht öffentlichen Programme in `/usr/lib/news/bin`, 
einige wichtige Arbeitsdateien in `/var/lib/news` 
und der Artikelspeicher wird in `/var/spool/news` angelegt.
INN wird nach `/var/log/news` loggen.

Andere Distributionen verwenden möglicherweise leicht unterschiedliche Speicherorte, die Anleitung ist dann passend abzuwandeln.

Alle Konfiguration am INN ist immer als User `news` durchzuführen und niemals als User `root`,
außer dies wird ausdrücklich gesagt.
Sobald durch Änderungen als `root` Konfigurations-, Log- oder andere Dateien einem anderen Benutzer als `news` gehören,
wird INN möglicherweise nicht mehr sauber funktionieren.
```console
news@h3118:-/bin> cat /etc/SusE-release
SusE Linux 9.1 (1586)
VERSION = 9.1
news@h3118:~/bin> rpm -q inn
inn-2.4.1-33
```
Man muss also als `root` das Kommando `su – news` eingeben,
um auf den Useraccount von `news` zu wechseln und auch das Environment des `news`-Users zu bekommen.
Man befindet sich dann auch gleich im Home-Verzeichnis des News-Users.
In SuSE Linux ist das `/etc/news`, wo sich auch die im Folgenden beschriebenen Konfigurationsdateien befinden.

# Inbetriebnahme

## Artikelspeicher bereit stellen

In unserer Beispielinstallation soll der INN mit einem Artikelspeicher in CNFS ("Cyclic News File System") betrieben werden,
weil dies die ressourcensparendste und wartungsärmste Art der Artikelspeicherung ist.
Die CNFS-Puffer müssen konfiguriert und angelegt werden.

Versäumt man das, verwendet INN den in der Default-Konfiguration definierten Traditional Spool.
Dieser erzeugt jedoch mehr I/O-Last auf dem System und ist in der Größe variabel.
Dafür steht sein Inhalt Scripten leichter zu Verfügung:
Artikel werden als Dateien unterhalb von `/var/spool/news/articles/` in Verzeichnissen abgelegt, 
die aus dem Namen der Newsgroup abgeleitet sind und müssen durch einen Aufräumjob (`expire`) von dort gelöscht werden.
Die Verwendung von Traditional Spool ist nicht empfohlen, insbesondere nicht für INN Neueinsteiger.

Die Puffer werden in der Datei `cycbuff.conf` definiert. 
Eine Pufferdefinition besteht aus einer oder mehr Zeilen, von denen jede einen `cycbuff` definiert.
Diese Puffer müssen dann zu einem `metacycbuff` zusammengeklebt werden, damit sie durch den INN benutzbar werden.
```console
news@h3118:-/peerdata> cat ~/cycbuff.conf
# 512MB Puffer fuer de.*
cycbuff: DE1: /var/spool/news/cycbuffs/file_de.1:524288

# Sechs 512 MB Puffer fuer den Rest
cycbuff: INTL1:/var/spool/news/cycbuffs/file_intl.1:524288
cycbuff: INTL2:/var/spool/news/cycbuffs/file_intl.2:524288
cycbuff: INTL3:/var/spool/news/cycbuffs/file_intl.3:524288 
cycbuff: INTL4:/var/spool/news/cycbuffs/file_intl.4:524288
cycbuff: INTL5:/var/spool/news/cycbuffs/file_intl.5:524288
cycbuff: INTL6:/var/spool/news/cycbuffs/file_intl.6:524288

# Puffer zusammenkleben zu Metapuffern
metacycbuff: DE: DE1
metacycbuff: INTL: INTL1, INTL2, INTL3, INTL4, INTL5, INTL6
```
Leider ist INN bei der Benennung der "cycbuff" und "metacycbuff" sehr eingeschränkt: 
Namen müssen kurz sein und dürfen nur aus Zahlen und Buchstaben bestehen.

Im Beispiel wird ein "cycbuff" mit dem Namen "DE1" definiert, der 524288 KB (512 MB) groß sein soll.
Die Location im Dateisystem für diesen Puffer ist `/var/spool/news/cycbuffs/file_de.1`.
Dort muss diese Datei auch angelegt werden.
Dies erfolgt mit dem Kommando `dd`.
```console
$ dd if=/dev/zero of=/var/spool/news/cycbuffs/file_de.1 bs=1024k count=512
```
INN selber arbeitet immer nur mit "metacycbuffs".
Ein "metacycbuff" faßt dabei einen oder mehrere einzelne "cycbuff" zu einer für den INN benutzbaren Einheit zusammen.
Der "metacycbuff" DE besteht dabei ausschließlich aus dem einzelnen cycbuff "DE1".

Das Beispiel definiert außerdem noch sechs jeweils 512 MB umfassende cycbuffs INTL1 bis INTL6.
Auch diese müssen mit entsprechenden `dd`-Kommandos angelegt werden 
und können dann alle zusammen zu einem "metacycbuff" INTL mit 3 GB Gesamtgröße zusammengefasst werden.

Damit INN weiß, welche Artikel in welchem Puffer abgelegt werden sollen,
müssen in der `storage.conf` entsprechende Einträge gemacht werden.

Die Zeile `newsgroups` legt dabei fest, welche Gruppen in welchem Puffer abgelegt werden.
Die Zeile `class` ist eine eindeutige Nummer für jeden Eintrag, damit man an anderer Stelle auf den Eintrag Bezug nehmen kann.

Die Zeile `options` legt für CNFS-Einträge fest, welcher `metacycbuff` Speicher für den entsprechenden Eintrag bereitstellen soll.
```console
news@h3118:-/peerdata> cat ~/storage.conf
method cnfs {
    newsgroups: de.*
    class: 3
    options: DE
}
method cnfs {
    newsgroups: *
    class: 2
    options: INTL
}

# Traditional Spool Klappert leer und wird dann gelöscht...
method tradspool {
    newsgroups: *
    class: 1
}
```
Im Beispiel wandern Artikel für die Newsgroups `de.*` immer in den CNFS-Speicher `DE` mit der eindeutigen Nummer 3.
Alle anderen Artikel wandern in den CNFS-Speicher `INTL` mit der Nummer 2.

Der Eintrag 1 definiert einen Speicher im Format `tradspool`.
Er wird niemals verwendet, weil der Eintrag 2 vorher alle Artikel abfängt.
Der Eintrag 1 ist der (nicht empfohlene, aber rückwärts kompatible) Default-Eintrag in der `storage.conf` von INN.

Sobald INN erst einmal gestartet ist (siehe unten), werden die Puffer initialisiert.
Zu einem späteren Zeitpunkt kann man dann mit dem Kommando `cnfsstat -a` ansehen, wie ausgelastet die Puffer sind.

## Grundkonfiguration inn

Vor dem ersten Start des Servers ist die `/etc/news/inn.conf` anzupassen.
Zu ändern sind:
```console
-organization: "A pooly-installed InterNetNews site"
+organization: "Deine Organisations-Zeile
```
Definiert den Inhalt der Zeile `Organization`, die Bestandteil eines jeden Artikels ist.
```console
-#pathhost: localhost
+pathhost: news.example.com
```
Definiert, was Deine Site in den Path-Header einträgt.
Dies ist ein sehr wichtiges Datum für das Peering mit anderen Sites.
Es sollte Dein Domainname sein, oder ein vom Domainnamen abgeleiteter Name wie `news.koehntopp.de` für `koehntopp.de`.

Mit Hilfe des `pathhost` erkennt ein entfernter Server,
ob ein bestimmter Artikel schon einmal Dein System passiert hat.
Wenn ja, wird Dir der Artikel kein zweites Mal angeboten.
Dies kann sehr viel Traffic einsparen, wenn man mehrere Feeds für eine Hierarchie hat.
```console
+complaints: abuse@example.com
+fromhost: example.com
```
Definiert den Inhalt der Headerzeile `X-Complaints-To` und die Domain, 
mit deren Hilfe Usernamen zu Mailadressen komplettiert werden, wenn dies notwendig ist.
```console
-docnfsstat: false
+docnfsstat: true
```
Dieser Eintrag ist optional.
Wenn man jedoch später statistische Auswertungen auf dem System für den Betrieb plant,
sollten laufende Meßdaten für die Auslastung der CNFS-Puffer vorliegen.
Dazu muss dieser Eintrag aktiv geschaltet sein.

## Crontab aufsetzen

INN muss in regelmäßigen Abständen einige Wartungsaufgaben erledigen.
Daher sollte für den User `news` eine Crontab wie die folgende definiert sein:
```console
news@h3118:~> cat crontab.current
# to expire old news-articles
15 4 * * * /usr/lib/news/bin/news.daily expireover delayrm lowmark

# dump path databases
#0 0 * * * /usr/lib/news/bin/ctlinnd flush 'inpaths! > /dev/null 2>&1
# 5 0 1,15 * * /us/lib/news/bin/sendinaths

# inews stores news-articles in /var/spool/news/in.coming, if INN ist
# not running. the next "rnews -U" will feed those news-articles into
# inn.
10 * * * * /usr/bin/rnews-U
#33 * * * * /usr/lib/news/bin/scanlogs norotate 2>/dev/null >/dev/null
news@h3118:~> crontab crontab.current 
news@h3113:~>
```
Die Crontab enthält nur die für den Betrieb unmittelbar notwendigen Einträge in aktivierter Form. 
Die auskommentierten Einträge sind für spätere Erweiterungen notwendig oder nützlich.

Der Eintrag `news.daily` führt die zum Betrieb von INN notwendigen Wartungsaufgaben durch. 
Er muss einmal pro Tag ausgeführt werden.

Der Eintrag `rnews- U` kann einmal pro Stunde ausgeführt werden.
Er dient dazu, während Betriebspausen aufgelaufene Artikel nachträglich ins System einzuspeisen.

Die beiden Einträge "inpaths!" und "sendinpaths" sind nur notwendig, 
wenn das System Statistikdaten in die "Top 1000 der Newsserver" einspielen will.
Damit das funktioniert sind jedoch noch weitere Konfigurationen notwendig (siehe unten).

Der Eintrag `scanlogs norotate` dient dazu, 
stündlich den Statistikreport für das laufende System zu aktualisieren.
Damit das funktioniert sind jedoch noch weitere Konfigurationen notwendig (siehe unten).

## Server hochfahren

Mit der angegebenen Konfiguration sollte der INN durch den Systemadministrator startbar sein.

Das Kommando `chkconfig inn on` sorgt dafür, dass beim Systemstart automatisch auch der INN mit hochgefahren wird.
```console
Als User root:
# chkconfig inn on
# rcinn start
```
Das Kommando `rcinn start` fährt den Server manuell hoch.
Der Server sollte Startmeldungen in `/var/log/news/news.notice` hinterlassen 
und in der Prozessliste sollte ein Prozess `innd` erkennbar sein, 
der mit den Rechten des Users `news` ausgeführt wird.
Mit `lsof -i -n -P` sollte dieser Prozess auf Port 119 lauschen.
Von localhost aus kann man jetzt einen Testconnect gegen den NNTP-Port machen.
```console
news@h3118:~> telnet localhost 119
Trying 127.0.0.1...
Connected to localhost.
Escape character is '^]'.
200 koehntopp.de InterNetNews server INN 2.4.1 ready
 mode reader
200 koehntopp.de InterNetNews NNRP server INN 2.4.1 ready (posting ok).
list
215
control 0000000000 0000000001 n 
control.cancel 0000000000 0000000001 n
contrel.checkgroups 0000000000 0000000001 n
contrel.newgroup 0000000000 0000000001 n 
control.rmgroup 0000000000 0000000001 n
junk 0000000000 0000000001 n
quit
205
Connection closed by foreign host.
```
Wenn das funktioniert, ist der Server erfolgreich grundkonfiguriert und hochgefahren.

# Gruppen anlegen

## Testgruppe einrichten

Der Server läuft nun und hat einige Standard-Newsgroups, die für die interne Verwaltung des Servers notwendig sind.
Um die weitere Funktion des Servers zu testen, ist es notwendig, mindestens eine lokale Testgruppe anzulegen.
```console
$ ctlinnd newgroup local.test y news@localhost
```
## Andere Gruppen einrichten

Die anderen benötigten Gruppen kann man leicht anlegen, 
indem man sich eine Liste der Gruppen beim zukünftigen Upstream-Server abholt und sie in Kommandos zur Gruppeneinrichtung umwandelt.

Das Kommando `getlist` holt die Liste der aktiven Gruppen vom Server `news.koehntopp.de` ab
und legt sie in der Datei `active.news.koehntopp.de` ab.
Durch das `grep`-Kommando werden aus dieser Datei alle Gruppen der Hierarchie `de.*` extrahiert. 
Für die Einrichtung der Gruppen sind nur das erste und vierte Feld einer jeden Zeile notwendig.
Mit dem `awk`-Kommando ziehen wir also diese Felder aus der Datei heraus und wandeln sie in `ctlinnd`-Kommandos um.

```console
$ getlist -h news.koehntopp.de > active.news.koehntopp.de
$ grep "^de\." active.news.koehntopp.de > de-groups
$ awk '{ printf "ctlinnd newgroup %s %s news@localhost\n", $1, $4 }' de-groups > einrichten.sh 
$ ctlinnd throttle now
$ sh einrichten.sh
$ ctlinnd go now
```
Die Datei `einrichten.sh` enthält nun die benötigten Kommandos zur Gruppeneinrichtung. 
Die Ausführung der Datei ist sehr viel schneller, 
wenn man den Server vor der Ausführung der Kommandos in einen Standby-Modus schaltet und danach wieder in Produktivmodus versetzt.

# Zugangskontrolle konfigurieren

Mit den Default-Einstellungen kann man jetzt schon lokal (von localhost aus) gegen den Server connecten.
Um Connects von außen zu erlauben, ist es notwendig, einen Anmeldemechanismus und eine Passwortquelle zu konfigurieren.
```console
auth all {
    auth: "chkpasswd -f /etc/news/passwd.nnrp"
    default-domain: example.com
}

access full {
    users: *
    newsgroups: *
    access: RPA
}
```
INN verwendet intern ein Programm namens `ckpasswd` für die Zugangskontrolle. 
Dieses Programm kann entweder auf eine lokale Passwortdatei zugreifen, 
in der INN-spezifische Passwörter konfiguriert werden, 
oder man kann es mit Priviliegien austatten, 
die ihm erlauben, auf die Systempasswortdatei zuzugreifen.
Letzteres ist nicht empfohlen, da NNTP ohne weitere Maßnahmen Passwörter im Klartext überträgt.

Welche Authentisierungsmechanismen in welcher Reihenfolge von INN verwendet werden,
wird in der readers.conf festgelegt.
Die folgenden Einträge legen fest, dass INN die Datei `/etc/news/passwd.nnrp` verwenden soll, 
um Logins zu gestatten. 
Die Datei hat dasselbe Format wie eine htpasswd-Datei von Apache und kann mit dem Apache-Programm htpasswd angelegt und verwaltet werden.

Der Abschnitt `auth` legt fest, mit welchem Kommando die Anmeldeinformationen geprüft werden sollen,
der Abschnitt access legt dann fest, welche Zugriffsrechte diese Benutzer erhalten sollen.

Wenn alles funktioniert, ist nun eine Anmeldung mit Benutzername und Passwort von entfernten Systemen möglich.

# Verbindungen (Feeds) konfigurieren

Ein Feed ist eine Verbindung zwischen zwei Newsservern,
über die gegenseitig Artikel in bestimmten Newsgroups austauschen.
Der Feed besteht aus einer eingehenden Verbindung, die in der `incoming.conf` konfiguriert wird 
und einer ausgehenden Verbindung, die in der `innfeed.conf` definiert wird, 
und für die in der `newsfeeds` festgelegt wird, welche Dateien gesendet werden sollen.

In der `incoming.conf` wird festgelegt, welche entfernten Server dem eigenen Server Daten senden dürfen 
und welche Gruppen diese Server beschicken dürfen:
```console
peer koehntopp.de {
    hostname: "news.koehntopp.de"
    patterns: "de.*,!de.alt.dateien.*"
    max-connections: 5
}
```
Ein solcher Eintrag gestattet dem entfernten Rechner `koehntopp.de` bis zu 5 parallele Verbindungen 
zu dem eigenen Server aufzubauen, über die er Artikel ausschließlich in die genannten Gruppen einliefern darf.

Ausgehende Verbindungen werden in die `innfeed.conf` eingetragen.
Analog zur `incoming.conf` muss dort ein Link für eine ausgehende Verbindung konfiguriert werden.
```console
peer koehntopp-all {
    ip-name: news.koehntopp.de
    max-connections: 5
}
```
Schließlich wird in der Datei `newsfeeds` festgelegt, welche Daten über die ausgehende Verbindung gesendet werden sollen.
```conole
# koehntopp.de Kristian Koehntopp <kris@koehntopp.de>
koehntopp-all/koehntopp.de\
    :!*,@*,de.*,!de.alt.dateien.*/!local\
    :Ap,Tm:innfeed!
```
Die Bestellung für den Channel `koehntopp-all` aus dem Beispiel liest sich 
"keine Artikel, die `koehntopp.de` im Path haben (`/koehntopp.de`).

Das Pattern legt fest, welche Newsgruppen über den Kanal gesendet werden sollen. 
Es liest sich `!*` ("nix, gar nix"), `@*` (auch keine Crossposts, das ist doppelt gemoppelt), 
`de.*,!de.alt.dateien.*` (alle de-Gruppen außer de.alt.dateien.*), jedoch keine Artikel mit der Distribution: `local`.

Die Flags und der Kanalname legen fest, dass die Daten über den Kanal `innfeed!` herausgesendet werden sollen.

Deswegen muss der vordefinierte `innfeed!`-Kanal in der Datei `newsfeeds` aktiviert werden.
```console
innfeed!\
    :!*\
    :Tc,Wnm*:/usr/lib/news/bin/startinnfeed
```
Außerdem muss das System Steuernachrichten zur Einrichtung neuer Gruppen, 
zum Löschen von Artikeln usw. verarbeiten können. 
Dazu ist die Aktivierung des Controlchan notwendig.

Um die Änderungen wirksam werden zu lassen, muss dem INN-Server ein  "reload"-Kommando gesendet werden.
```console
news@h3118:~> lsof -i -n -P | grep koehntopp
innd  28144 news   57u  IPv4 9342609
      TCP example.com:199->koehntopp.de:2418 (ESTABLISHED)
innd  32740 news   25u  IPv4 9342489
      TCP example.com:42275->koehntopp.de:119 (ESTABLISHED)
```
Wenn alles funktioniert hat, 
ist das Link jetzt sichtbar und kann mit `lsof`
oder `tail -f /var/log/news/news /var/log/news/news.notice` gesehen werden.
