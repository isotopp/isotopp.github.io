---
author: isotopp
date: "1999-10-15T09:00:00Z"
feature-img: assets/img/background/schloss.jpg
published: true
title: "Webserver verstehen und tunen"
tags:
- lang_de
- php
- web 
---

*Diesen Artikel habe ich als Schulungsunterlage für
eine PHP-Fortgeschrittenenschulung bei
Netcologne geschrieben*

PHP-Programme laufen auf dem Webserver. Sie können - angestoßen
durch einen externen Benutzer mit einem Browser - Dateien auf
dem Server lesen, schreiben oder löschen. Für einen
PHP-Programmierer ist es wichtig zu wissen, mit welchen Rechten
seine Programme ausgeführt werden und welche Einflüsse die
Ausführung seines Programms bestimmen. Nur so ist es ihm
möglich, sein System gegen böswillige Manipulation
abzusichern und seine Leistung zu optimieren.

## Der Aufbau des Apache-Webservers

Der Apache-Webserver ist auf eine Weise konstruiert, die
es leicht macht, den Serverprozeß zu erweitern, und die ihn
besonders wenig anfällig gegen Betriebsstörungen gleich welcher
Art macht.

Der Server besteht aus einem Managerprozeß, der eine Reihe von
Bearbeiterprozessen startet. Diese Prozesse führen die eigentliche
Request-Abarbeitung durch. Eingehende Requests werden vom
Manager registriert und an einen freien Bearbeiter
weitergereicht. Wenn der Bearbeiter mit der Ausführung des
Requests fertig ist, beendet er sich nicht, sondern meldet
sich beim Manager zurück, und dieser teilt dem Bearbeiter den
nächsten Request zu.

Ein Bearbeitungsprozeß ist oftmals nicht in der Lage, einen
Prozessor voll auszulasten: Er muss auf das Eintreffen von Daten
von der Festplatte warten, oder er muss auf den Client auf der
anderen Seite des Netzes warten und sich mit der Abarbeitung des
Requests nach der Übertragungsgeschwindigkeit des Netzes
richten. Damit während dieser Zeit andere Requests bearbeitet
werden können, ist es sinnvoll, mehrere Bearbeiterprozesse zu
haben.

Wie viele Bearbeiterprozesse sinnvoll sind, hängt von einer
ganzen Reihe von Parametern ab. Zunächst einmal wäre es
sicherlich schön, wenn immer genau so viele Bearbeiter vorhanden
sind, wie gleichzeitige Requests bei der Maschine ankommen. Nun
kann ein Rechner aber nicht beliebig viele Prozesse starten, und
speziell im Fall von Apache ist es so, daß der Webserver in
genau dem Moment sehr viel langsamer wird, in dem die Maschine
anfangen muss, Webserverprozesse mangels RAM in den Swapbereich
auszulagern. Das ist ein sehr unangenehmer Moment, denn bei
gleichbleibender Anzahl von Requests pro Sekunde ("Last bleibt
gleich") dauert die Abarbeitung eines einzelnen Requests nun
viel länger ("Durchsatz sinkt"), und damit steigt die Anzahl der
ausstehenden Requests ("Ressourcenverbrauch steigt"). Das
Gesamtsystem versucht darauf mit einer weiteren Erhöhung der
Serverprozeßzahl zu antworten und treibt die Maschine nur noch
weiter in den Swap - die Requests werden noch langsamer
bearbeitet und als Antwort werden nur um so mehr
Serverprozesse erzeugt.

In dieser Situation bricht die Systemleistung zusammen, oder das
System kommt im Extremfall vollständig zum Halt. Mithilfe des
Parameters "MaxClients" kann man in der `httpd.conf` die Anzahl
der Serverprozesse nach oben begrenzen und so verhindern, daß
die Maschine in diesen fatalen Zustand gerät - die Zahl muss so
gewählt werden, daß die Maschine sicher nicht ins Swappen gerät.
Als hilfreich hat sich hier die Analyse der Zahlen in
`/proc/<pid>/statm` erwiesen, wobei als <pid>> die Prozeßnummern
der httpd-Prozesse einzusetzen sind:
```bash
$ server=`grep -l httpd /proc/*/cmdline`
$ for i in $server; do cat `dirname $i`/statm; done
1331 674 654 119 0 555 306
96 96 80 5 0 91 16
1247 401 369 80 0 321 101
1368 711 678 134 0 577 306
1364 707 677 133 0 574 305
1364 707 677 133 0 574 305
1365 708 677 133 0 575 306
86 86 71 4 0 82 15
```
Die ausgegebenen Zahlen sind in
`/usr/src/linux/Documentation/proc.txt` genauer erläutert. Sie
bedeuten von links nach rechts:
```console 
size       total program size
resident   size of in memory portions
shared     number of the pages that are shared
trs        number of pages that are 'code'
drs        number of pages of data/stack
lrs        number of pages of library
dt         number of dirty pages
```
Der Gesamtspeicherverbrauch eines weiteren Serverprozesses
ergibt sich aus seinen Resident (im RAM befindlichen) Unshared
Pages, die Page zu 4 KB in Intel-Rechnern. Also ist die
Differenz zwischen der zweiten und der dritten Zahl einer jeden
Zeile zu bilden und mit vier zu multiplizieren, um den
zusätzlichen RAM-Verbrauch eines einzelnen httpd in KB zu
ermitteln. Überschlagsmäßig können in der hier gezeigten
Konfiguration etwa 100-150 KB angesetzt werden, aber diese Zahl
kann je nach Webserver und Art der Last stark variieren und
bedarf in jedem Fall eines Tunings im Wirkbetrieb.

Bei einem geeigneten Wert für `MaxClients` erzielt der
Apache-Webserver bei zunehmender Last ("ramp-up") linear mehr
Durchsatz, bis der Sättigungspunkt erreicht ist. Danach bleibt
die Leistung auf einem stabilen Plateau, wenn nicht ein anderer
leistungsbegrenzender Faktor wirksam wird (Netzbandbreite,
DNS-Lookups, Plattenbandbreite, CPU-Leistung).

Bei nachlassender Last ist es natürlich nicht notwendig, die
ganzen Serverprozesse im Speicher herumstehen zu haben. Der
Managerprozeß kontrolliert laufend, wie viele unbeschäftigte
Bearbeiter er zur Verfügung hat und wenn dies mehr als
`MaxSpareServers` viele sind, wird er beginnen, die Anzahl der
Serverprozesse zu verringern. Bei steigender Last wird der
Manager diese Zahl dann wieder steigern. Aber das Starten von
neuen Serverprozessen dauert einige Zeit, und daher ist es gut,
eine gewisse Anzahl von unbeschäftigten Bearbeiterprozessen "auf
Vorrat" zur Hand zu haben, damit man Lastspitzen ausreiten kann.
Der Parameter `MinSpareServers` legt fest, wie groß der Vorrat
ist, den der Manager anlegt. Es ist nicht sinnvoll,
`MinSpareServers` größer als `MaxSpareServers` zu setzen: Beide
Werte können im Extremfall gleich groß sein, aber in einer
sinnvollen Konfiguration wird `MaxSpareServers` immer größer als
`MinSpareServers` sein.

Je stärker und je schneller die Last auf einem Webserver
springt, umso größer sollte man den Abstand zwischen beiden
Werten wählen. Je langsamer die Maschine beim Starten von neuen
Serverprozessen ist und je ruckartiger die Last auf dem Server
ansteigen kann, umso höher muss man `MinSpareServers` wählen,
damit im Falle einer Spitzenlast schon ausreichend viele Server
vorhanden sind. Mit dem Parameter `StartServers` legt man fest,
wie viele Serverprozesse schon beim Hochfahren des Managers mit
erzeugt werden.

Für eine dedizierte Maschine mit einem Speicherverbrauch von 200
KB pro Serverprozeß und einem freien RAM von 100 MB nach dem
Start aller anderen Systemdienste kann man einen `MaxClients`-Wert
von weniger als 500 ansetzen, wenn nur httpd-Prozesse laufen
(bei Ausführung von CGI-Programmen ist dies nicht der Fall -
hier muss man Speicher für die CGI-Programme reservieren!). Wenn
es sich um eine dedizierte Maschine handelt, die nur diesen
einen Webserver ausführen soll und auf der keine andere
Anwendung läuft, gibt es keinen Grund, die Anzahl der Clients zu
begrenzen: Man kann gleich beim Start alle Webserverprozesse auf
Vorrat erzeugen und hat dann unter Last die benötigte Leistung
parat. Dies ist ideal für Webserver, die bei zeitlich
abgestimmten Medienevents ("TED-Server", "Wahl-Server")
plötzliche Spitzenlasten wegstecken können müssen:
```console
MaxClients      450
StartServers    450
MaxSpareServers 450
MinSpareServers 450
```
Ein solcher Server wird etwa 400-450 parallele Requests
bearbeiten können. Ist eine Seite im Schnitt 100 KB groß und
wird eine solche Seite im Mittel mit 5 KB/sec ausgeliefert,
dauert das Ausliefern einer Seite im Mittel also 20 Sekunden.
Mithin hat man mit der gezeigten Konfiguration so Leistung für
etwa 20 Requests/sec (1200 rpm, requests per minute) -
vorausgesetzt, man begrenzt die Leistung der Maschine nicht
durch andere Faktoren (20 Requests pro Sekunde, 5 KB pro Sekunde => 100 KB/sec oder knapp eine halbe S2M).

Ein anderes Szenario wäre derselbe Rechner bei einem ISP, der
auf unterschiedlichen virtuellen Interfaces mit
unterschiedlichen IP-Nummern unterschiedliche Apache-Server
betreibt, die sich die Maschine teilen müssen. Alle Server
sollen möglichst wenig Ressourcen verbrauchen, wenn die Last
gering ist:
```console
MaxClients      200 # drei Kunden teilen sich diesen Rechner
StartServers      5 # wenige Prozesse vorab starten
MinSpareServers   5 # immer 5 in Reserve halten
MaxSpareServers  10 # maximal 10 in Reserve halten
```
Hier können bei drei unterschiedlichen Apache-Instanzen im
Extremfall 600 Serverprozesse auftreten (damit würde man die
Maschine also leicht im Überlastbereich betreiben), aber jede
Apache-Konfiguration versucht ihren Serverpool immer nur so groß
wie unbedingt nötig zu halten. Solange alle drei immer mit ca.
100-150 Servern rumdröhnen, herrscht eine friedliche Koexistenz.

## Lebensdauer von Serverprozessen

Apache ist ein sehr gutmütiger Webserver: Da er nicht
multithreaded ist, ist er sehr leicht durch selbstgeschriebene
Module zu erweitern, ohne daß diese Module aufwendig reentrant
gemacht werden müßten oder anders aufwendig anzupassen sind. Die
Server-API unterstützt die Integration von Modulen durch die
Bereitstellung von Schnittstellen zu Speicherverwaltung, zur
Request-Verarbeitung und zur Response-Generierung. Leider sind
nicht alle Module sauber programmiert: Manche von ihnen erzeugen
Core Dumps, andere stürzen zwar nicht ab, aber sie belegen mehr
und mehr Speicher und lassen den Serverprozeß so ins Grenzenlose
wachsen.

Apache ist so konstruiert, daß er mit dieser Situation fertig
werden kann, ohne den Betrieb des gesamten Serversystems zu
gefährden: Ein abstürzender Bearbeiterprozeß wird durch den
Manager registriert, und der Manager erzeugt ggf. einen neuen
Bearbeiterprozeß, wenn die Lastsituation es erfordert.
Ein Bearbeiter kann durch das Setzen des Parameters
`MaxRequestsPerChild` auf einen von 0 verschiedenen Wert so
konfiguriert werden, daß er maximal so viele Requests wie
angegeben bearbeitet und sich dann beendet. Durch Speicherlecks
verlorengegangener Speicher wird dann wieder freigegeben - der
Manager wird den beendeten Bearbeiterprozeß wie bei einem
Absturz ersetzen, falls notwendig.

Das Regenerieren von verlorengegangenen Serverprozessen kostet
zwar Systemleistung, weil der Kernel `fork()`-Systemaufrufe
durchführen muss, aber der Webserver bleibt immerhin verfügbar.
Bei einem Single-Process-Server mit Multithreading wäre eine
solche Fehlerresistenz nicht machbar.

Der Managerprozeß und alle seine Bearbeiterprozesse laufen unter
der in der Hauptkonfiguration mit den Direktiven "User" und
"Group" angegebenen UID- und GID-Werten. Man kann dies auch in
der Prozeßliste sehen, indem man sich den Eigentümer der
httpd-Prozesse ansieht:
```bash
valiant:/proc/2544 # ls -ld .
dr-xr-xr-x   3 wwwrun   nogroup         0 Jun  1 21:55 .
valiant:/proc/2544 # cat cmdline | xargs -0 echo
/usr/local/apache/bin/httpd -f /usr/local/apache/conf/httpd.conf
```
Es ist wichtig zu verstehen, daß diese Werte für den gesamten
Server, also für alle von ihm verwalteten virtuellen Server,
gelten. Das heißt: Alle Zugriffe durch den Webserver auf Dateien
werden unter dieser UID und GID durchgeführt, auch dann, wenn in
den einzelnen `<VirtualHost>`-Abschnitten andere User- und
Group-Werte angegeben sind. Diese anderen Identitäten werden
ausschließlich für die Ausführung von CGI-Programmen durch das
suexec-Utility angenommen.

Hat man seinen Webserver mit `mod_php` oder `mod_perl` konfiguriert,
dann werden auch alle Dateizugriffe dieser beiden Module unter
der einen zentralen Identität des Servers ausgeführt werden, da
die Module im Kontext des Serverprozesses ablaufen. Das ist eine
Tatsache, die man unbedingt im Hinterkopf behalten sollte, wenn man
Webserver aufsetzt, auf denen mehrere unterschiedliche Kunden
eigene Scripte ausführen können. Da alle diese Scripte immer
unter derselben UID/GID ausgeführt werden, gibt es nichts, das
verhindern könnte, daß ein Kunde auf die Dateien eines anderen
Kunden zugreift. Ein solches Konzept ist für das Webhosting
untauglich.

CGI-Programme werden durch den Apache nicht direkt, sondern
immer über das `suexec`-Utility gestartet. Der Apache erzeugt dazu
mittels `fork()` eine Kopie von sich selbst, die sich selbst dann
durch das suexec-Programm ersetzt. Dieses Programm ist mit
Systemverwalterrechten ausgestattet (ein SUID-root-Programm) und
stellt danach die UID/GID des neuen Prozesses auf die User- und
Group-Angaben des zuständigen virtuellen Hosts um. Außerdem
setzt es noch eine Reihe von Ressourcelimits, bereinigt das
Prozeßenvironment und führt eine Reihe von anderen
Aufräumarbeiten durch. Erst dann ersetzt es sich selbst durch
das auszuführende CGI-Script. Dieses Script läuft dann mit der
eingestellten Identität, die von der Identität des Webservers
selbst verschieden sein kann, und beendet sich anschließend.

Da die Ausführung von CGI-Programmen die Erzeugung eines neuen
Prozesses und das Laden von mindestens zwei Programmen (suexec
und den Scriptinterpreter) bedingt, werden CGI-Programme sehr
viel langsamer ausgeführt als Modulprogramme. Zu den genannten
Kosten kommen noch Aufwände für ein rundes Dutzend Systemaufrufe
innerhalb von suexec hinzu, die aber gegenüber den
fork()/exec()-Kosten verschwindend gering sein dürften.

Man hat als ISP mit einem VirtualHost-Setup also die Wahl
zwischen einem schnellen, unsicheren Setup und einer deutlich
langsameren, aber sichereren Variante.

Es existiert übrigens eine Variante des suexec-Programmes für
den Apache, die wesentlich weniger restriktiv bei der Prüfung
der User- und Gruppenrechte an der auszuführenden Datei und
dem enthaltenden Verzeichnis ist, die dafür aber eine
`chroot()`-Umgebung aufsetzt, in der dieses Programm ablaufen
kann. Dadurch, daß das Programm in der `chroot()`-Umgebung
eingesperrt ist, wird ein zusätzlicher Grad an Sicherheit
erreicht.

##  Aufbau des MySQL-Datenbankservers und Interaktion mit PHP

Viele PHP-Programme verwenden einen MySQL-Datenbankserver als
Backend zur Speicherung und Auswertung von Daten. Als Datenbank
für Webserver ist MySQL besonders geeignet, da MySQL Connections
vom PHP-Interpreter zum Datenbankserver sehr schnell errichten
und wieder trennen kann und da MySQL im Gegensatz zu "echten"
Datenbanken auf saubere Verwaltung von Transaktionen verzichtet
und daher verschiedene Operationen sehr viel schneller abwickeln
kann als vollständige SQL-Datenbanken. Für Webanwendungen ist
dies ideal, da diese in ihrer Mehrzahl eher geringe Ansprüche an
die Transaktionsfähigkeit der Datenbank stellen, dafür aber sehr
viele parallele Sessions erzeugen können.

Um abschätzen zu können, in welche Situation man die Datenbank
bringt, wenn man sie als Backend an einem Webserver betreibt,
muss man wieder die beiden Fälle CGI PHP und mod_php
unterscheiden.

In CGI PHP wird auf einer Webseite irgendwann einmal ein
`mysql_connect()` oder `mysql_pconnect()` ausgeführt. PHP stellt in
diesem Moment eine Verbindung zu Datenbank her und arbeitet dann
mit dieser Verbindung. Spätestens am Ende der Seite endet das
PHP-Programm und mit ihm auch der PHP-Interpreterprozeß selbst.

Dadurch werden alle Filehandles dieses Prozesses geschlossen,
also auch die Datenbankverbindung. CGI PHP wird also in
schneller Folge Datenbankverbindungen öffnen und schließen, und
es wird maximal so viele Datenbankverbindungen geben, wie es
parallele PHP-Interpreter geben kann, nämlich `MaxClients` viele.
Man muss den Datenbankserver vom RAM und vom Serverprozeß
her so konfigurieren, daß er mit einer solchen Anzahl von
parallelen Sessions fertig werden kann!

Wenn in mod_php mit `mysql_connect()` gearbeitet wird, verhält es
sich exakt so wie CGI PHP: Am Ende der Webseite wird die
Datenbankverbindung geschlossen. Anders bei `mysql_pconnect()`: Da
der Interpreter als Modul Bestandteil des Bearbeiterprozesses
des Webservers ist, kann dieser die Verbindung auch nach dem
Ende der Webseite offen halten. Fordert später eine andere
Webseite eine Verbindung mit denselben Host/User/Paßwort-Daten
an, kann der Bearbeiterprozeß diese existierende Verbindung
anbieten, anstatt erneut eine solche Verbindung eröffnen zu
müssen. Bei `mysql_pconnect()` hat dies wegen der Geschwindigkeit
von MySQL nur vergleichsweise geringe Auswirkungen; verwendet
man hingegen Oracle, sind mod_php und `ora_plogon()` absolut
essenziell, wenn man Performance braucht.

Jeder Bearbeiterprozeß muss für sich alleine einen Connect zum
Datenbankserver offen halten, da solche Connects nicht zwischen
unterschiedlichen Prozessen austauschbar sind. Ein einzelner
Bearbeiterprozeß hält jedoch unter Umständen mehrere
Datenbankconnects mit unterschiedlichen
User/Paßwort-Kombinationen offen, wenn dies in der Konfiguration
so vorkommt. Man muss daher im Extremfall auf dem Datenbankserver
mit `MaxClients` mal "Anzahl der vorkommenden
User/Paßwort-Kombinationen" vielen parallelen Connects
klarkommen. Es ist klar, daß sich dies schlecht skaliert.

PHP geht bei der Verwaltung von MySQL-Datenbankverbindungen
übrigens von der falschen Annahme aus, daß eine
Datenbankverbindung zustandslos ist und daher gefahrlos
wiederverwendet werden könne, wenn ein zweiter Connect mit
derselben Username/Paßwort/Hostname-Kombination gemacht wird.
Man kann dies beobachten, indem man das folgende Stück Code
ausführen läßt:
```php
kk@land:~/Source/php3 > ./php
<?php
  $link = mysql_connect("localhost", "kk", "");
  print $link."\n";
Content-type: text/html
1
  $link2 = mysql_connect("localhost", "kk", "");
  print $link2."\n";
1
```
Obwohl hier zwei verschiedene MySQL-Datenbankverbindungen
geöffnet werden sollen, wird in beiden Fällen dieselbe Link-ID
zurückgeliefert. Es handelt sich also in beiden Fällen um
dieselbe Datenbankverbindung. Dies wird in dem Moment zum
Problem, wo der Zustand der Datenbank, der per Link-ID verwaltet
wird, sich ändert. In MySQL gehört zu diesem Zustand der Name
der aktuellen logischen Database, mit der gearbeitet wird. Wird
diese Database mittels "use <databasename>" oder mit Hilfe von
`mysq_select_db()` verändert, wirkt sich die Änderung auf die
beiden vermeintlich unabhängigen Datenbankverbindungen aus.
Abhilfe schafft hier nur, entweder nur mit einer einzigen
Datenbank zu arbeiten oder mit Hilfe von mehreren
unterschiedlichen Benutzernamen unterschiedliche
Datenbankverbindungen zu erzwingen.

Ein ähnliches, noch viel gefährlicheres Problem erleidet man mit
Oracle, denn dort gehört die derzeit aktive Transaktion zum
Zustand der Datenbankverbindung - ein `COMMIT` oder `ROLLBACK` wirkt
sich hier auf beide vermeintlich unabhängigen Verbindungen aus.

Der Datenbankserver erlaubt mit einer Ausnahme keine Interaktion
eines Anwenders mit dem Dateisystem. Alle Änderungen sind also
ausschließlich auf Datensätze innerhalb der Datenbank
beschränkt. Die Ausnahme ist das Laden von Daten in die
Datenbank mit `LOAD DATA INFILE`, das die Übernahme von
beliebigen Daten mit zeilenweiser Satzstruktur in
Datenbanktabellen erlaubt. Um diese Operation durchführen zu
können, benötigt der aktuelle Benutzer in MySQL `file_priv =
'y'` für seinen Benutzereintrag in der Tabelle `mysql.user`. Das
Recht kann nicht datenbankbezogen, sondern nur benutzerbezogen
vergeben werden.

Neuere Versionen von MySQL erlauben statt dessen `LOAD DATA
INFILE LOCAL`, bei denen der Lesezugriff nicht durch den
Datenbankserver und mit den Rechten des Datenbankservers
erfolgt, sondern stattdessen durch den Client (PHP) und mit den
Rechten des Clients. Dies ist zwar langsamer, aber sicherer und
benötigt keine besonderen Privilegien. Es ist empfehlenswert,
immer `LOAD DATA INFILE LOCAL` zu verwenden. Beim Load sehr großer
Tabellen kann es jedoch notwendig werden, die CPU-Zeitbegrenzung
des PHP-Interpreters hochzusetzen.

Im Übrigen ist zu beachten, daß es der PHP-Interpreter ist, der
sich an den Datenbankserver connected, und nicht der Browser des
Anwenders. Die MySQL-Ports können daher an der Firewall
problemlos abgedichtet werden, um direkte Zugriffe eines
Anwenders an PHP vorbei auf den Datenbankserver zu verhindern:

```console
                                    ||
                                    ||<--- connect --- mysql-Client
                                    ||     Port 2042
                                    ||
   MySQL  <--- connect --- PHP <--- || --- connect --- Browser
               Port 2042    &       ||     Port 80
                          httpd     ||
                                 Firewall
                                 läßt nur
                                 Port 80
                                 durch
```
## Grenzen von Vertrauen

Die Firewall definiert in diesem System eine Grenze ("Trust
Boundary") zwischen dem Internet mit potenziell gefährlichen
Daten und dem Intranet, in dem vertrauenswürdige Anwendungen
vertrauenswürdige Informationen halten. Daten kreuzen diese
Grenze in beide Richtungen, und es ist dringend erforderlich,
diesen Übergängen besondere Aufmerksamkeit zu widmen.

### Übergänge von innen nach außen

Übergänge von drinnen nach draußen sind vergleichsweise einfach
abzuhandeln, da es sich um Übergänge aus einem Bereich mit hohem
Vertrauen in einen Bereich mit weniger hohem Vertrauen handelt.
Besondere Maßnahmen muss man hier genau dann ergreifen, wenn man
für die herausgegebenen Daten etwas garantieren möchte: Etwa daß
sie beim Empfänger unverfälscht oder gar nicht ankommen oder daß
außer dem Empfänger niemand Kenntnis von den Daten bekommen kann
oder daß der Empfänger sicher sein kann, daß er tatsächlich mit
dem Webserver und nicht mit einem Angreifer redet, der sich als
der Webserver ausgibt.

In allen diesen Fällen ist der Einsatz von SSL auf dem Server
empfehlenswert. Eine SSL-Verbindung ist wie ein gepanzerter
Tunnel zwischen dem Webserverprozeß auf dem Server und dem
Browserprozeß beim Abrufer. Er kann durch Dritte nicht
eingesehen werden, und die Daten, die darin fließen, können durch
Dritte nicht verfälscht werden. Durch ein Server-Zertifikat kann
der Abrufer außerdem sicher sein, daß das andere Ende des
Tunnels wirklich beim Webserver liegt und nicht bei jemand anderen.

Zwar ist eine Anwendung leicht auf SSL umzustellen (es muss
nämlich bis auf die verwendeten URLs nichts angepasst werden),
aber die Kosten für den Einsatz von SSL sind dennoch recht hoch.
SSL setzt auf der TCP/IP-Ebene an; es schiebt sich quasi als
Schutzschicht zwischen die Schichten 4 und 5 des
OSI-Protokollstacks.

```console
+- Anwendungsprogramm----+   +- Anwendungsprogramm----+---+
| Anwendungsschicht      |   | Anwendungsschicht      |SSL|
+------------------------+   +------------------------+API|
| Präsentationsschicht   |   | Präsentationsschicht   |   |
+------------------------+   +------------------------+   |
| Sitzungschicht         |   | Sitzungschicht         |   |
+------------------------+   +------------------------+   |
                             | SSL-Verschlüsselung        |
                             +----------------------------+  Userland
=====================================================================
                                                             Kernel
+- Betriebssystem -------+   +- Betriebssystem -------+
| Transportschicht (TCP) |   | Transportschicht (TCP) |
+------------------------+   +------------------------+
| Netzwerkschicht (IP)   |   | Netzwerkschicht (IP)   |
+------------------------+   +------------------------+

+- Gerätetreiber --------+   +- Gerätetreiber --------+
| Verbindungsschicht     |   | Verbindungsschicht     |
+------------------------+   +------------------------+
| Physikalische Schicht  |   | Physikalische Schicht  |
+------------------------+   +------------------------+
```

Dies bedeutet, daß bei dem Abruf einer Webseite per SSL zuerst
die TCP/IP-Netzwerkverbindung, dann die SSL-Zertifikate
ausgetauscht werden und danach erst die HTTP-Requests übertragen
werden. Da beim HTTP-Request mit dem Host-Header festgelegt
wird, welchen virtuellen Webserver die Anwendung sprechen will,
aber zuvor schon die SSL-Zertifikate ausgetauscht werden, ist es
nicht möglich, verschiedene SSL-Server mit derselben IP-Nummer
zu betreiben. Stattdessen müssen SSL-Server auf IP-basierte
virtuelle Hosts aufgesetzt werden, und jeder SSL-Server
verbraucht eine IP-Nummer.

Dazu kommt, daß anders als bei unverschlüsseltem HTTP eine
SSL-Verbindung nicht mit HTTP/1.1 Keepalive offen gehalten
werden kann. Anderenfalls könnte man nämlich recht leicht einen
Angriff mit bekannten Klartexten gegen den Server fahren: Würde
ein SSL-Server eine Verbindung mit Keepalive offen halten,
würden nach Austausch der Zertifikate Session-Keys ausgetauscht
werden. Mit diesen Session-Keys verschlüsselte Daten würden dann
über die SSL-Verbindung ausgetauscht werden. Wird die Verbindung
für mehr als einen Request benutzt, sind die Chancen gut, daß
geheime Daten (etwa die Kreditkartennummer) und bekannte Daten
(etwa ein Logo-GIF) über dieselbe Verbindung mit demselben
Session-Key verschlüsselt übertragen werden. Ist dies der Fall,
kann man mit Hilfe der bekannten Daten nach dem verwendeten
Session-Key suchen und dann die unbekannten Daten entschlüsseln.

Dadurch, daß SSL-Verbindungen die Vorteile von HTTP/1.1
Keepalives nicht nutzen können, müssen sie für jede einzelne
Komponente einer Webseite eine neue Verbindung aufbauen. Diese
einzelnen Verbindungen sind nicht nur ständig durch den
TCP-Slow-Start gebremst, sondern müssen ebenfalls ständig neu
Verschlüsselungsverfahren und Session-Keys aushandeln, was
zusätzliche Datenaustausche zwischen den beiden Partnern
notwendig macht - jeder dieser Datenaustausche dauert jedoch
eine Umlaufzeit (die Zeit, die von Ping als RTT ausgegeben
wird). Es ist also sehr viel damit geholfen, SSL-Seiten so
aufzubauen, daß sie aus möglichst wenigen Komponenten
zusammengesetzt sind, also wenige Bilder und Plugins enthalten,
die getrennt nachgeladen werden müssen. Über diesen
Verzögerungswerten kann man die zusätzliche Belastung der CPU
durch Verschlüsselung und Kompression beinahe vernachlässigen.

Weil SSL-Verbindungen gleich oberhalb der TCP-Ebene
verschlüsseln, sind nicht nur die übertragenen Daten
verschlüsselt, sondern auch alle HTTP-Header. Ein Angreifer kann
also ebenfalls nicht erkennen, welche Seiten abgerufen werden
und welcher Art die zurückgelieferten Daten sind. Dies hat
Auswirkungen auf Proxy-Server, auf den Jugendschutz, falls
dieser auf filternde Proxy-Server zurückgreift, und auf den
Virenschutz, falls dieser auf einen zentralen Scanner auf einem
Proxy zurückgreift: Selbst wenn man mit jedem Request dieselben
Daten abriefe und nicht über Zertifikate nachdächte, würden
wegen des wechselnden Session-Keys die abgerufenen Daten bei
jedem Request anders aussehen, und der Proxy hätte, falls er
Filterfunktionen wahrnehmen sollte, keine Informationen über die
tatsächliche Natur der abgerufenen Daten. SSL-Verbindungen
machen also zentrale Scanmechanismen unbrauchbar.
Sie sind mit Absicht so designed worden.

## Übergänge von außen nach innen und die Notwendigkeit von Sessions

Werden Daten von außen nach innen in die Zone höheren Vertrauens
importiert, muss mit noch mehr Aufmerksamkeit gearbeitet werden,
denn die importierten Daten können prinzipiell bösartig sein und
müssen so schnell und so gründlich wie möglich dekontaminiert
werden.

Die Anwendung läuft bei Webprogrammen zum Teil auf dem Browser
des Anwenders, und dieser liegt außerhalb der Vertrauensgrenze
unseres Systems. Man kann nicht davon ausgehen, daß der Browser
des Anwenders bestimmten Anforderungen genügt, und man kann
daher nicht voraussetzen, daß die gelieferten Daten bestimmten
Anforderungen genügen, bevor diese Anforderungen nicht alle
einzeln abgetestet worden sind.

Man kann beispielweise ein Formular an den Browser des Anwenders
schicken, und dieses Formular kann in Javascript geschriebene
Validatoren enthalten, die sicherstellen, daß in numerischen
Feldern auch nur Ziffern enthalten sind und so weiter. Man kann
nicht voraussetzen, daß der Browser des Anwenders Javascript
interpretiert, da diese Funktionalität ggf. ausgeschaltet oder
gar nicht vorhanden ist. Es ist auch denkbar, daß eine Firewall
auf dem Weg zum Abrufer jeden aktiven Content aus Seiten
herausfiltert und daß daher Javascript gar nicht beim Browser
ankommen kann. Es wäre weiterhin denkbar, daß die Anwendung zwar
ein Formular mit Javascript zum Anwender gesendet hat, dort aber
gar kein Browser läuft, sondern der Anwender stattdessen seine
Requests und die Replies manuell mit "telnet" bearbeitet. Dann
wäre der Anwender prinzipiell in der Lage, beliebig defekte
Daten einzuliefern.

Man kann ebenfalls nicht davon ausgehen, daß die Daten, die der
Anwender abgesendet hat, und die Daten, die der Webserver
erhält, identisch sind. Eine Instanz auf dem Weg - ein Proxy
oder ein Angreifer - könnten diese Daten verändern oder
veraltete Daten zurücksenden.

Es bleibt also nicht anderes übrig, als alle Daten beim Erhalt
und beim Eintritt in die Zone hohen Vertrauens genauestens zu
prüfen. Danach müssen diese Daten in der Zone hohen Vertrauens
verbleiben und dürfen diese nicht mehr verlassen - täten sie es,
müßten sie beim Wiedereintritt in die Zone hohen Vertrauens
erneut geprüft werden. Es ist daher keine gute Idee, Daten in
Form von <INPUT TYPE="hidden"> über mehrere Formulare hinweg
mitzuschleppen - in einem solchen Fall würden die Daten nämlich
ständig zwischen der Zone hohen Vertrauens auf unserer Seite des
Netzes und der entfernten Anwendung hin- und herwechseln und bei
jedem neuen Request erneut aus der einen und die andere Zone
wechseln. Solch eine Anwendung ist konstruktionsbedingt nicht
sicher zu bekommen.

Besser und sicherer ist es, mit einer Session-Verwaltung zu
arbeiten. In einem solchen Modell wird der Browser-Client durch
eine eindeutige Kennziffer identifiziert, und über diese
Kennziffer wird ein Datensatz innerhalb der Trust Boundary an
den Browser gebunden.

```console
                                 || Trust Boundary
                                 ||
  +-------------+                ||    +--------+
  | Server      |<----- Request ------ | Client |
  +-------------+       mit ID   ||    +--------+
       |
       | referenziert Datensatz mit ID
       |
     +-|--------+
    +--|-------+|
   +---v------+||
   | Client-  ||+
   | Daten    |+
   +----------+
```
Daten, die die Trust Boundary einmal passiert haben, verbleiben
nun auf der Serverseite und können durch den Client nicht mehr
direkt manipuliert werden. Der Client kann nur noch mittelbar
durch Veränderung der Session-ID versuchen, einen anderen
Datensatz mit anderen Daten zu referenzieren. Daraus folgt, daß
die Session-ID selbst keine fortlaufende Nummer oder eine andere
vorhersagbare und ratbare Zahl sein darf.

In der Praxis hat es
sich bei PHP bewährt, das Konstrukt `md5(uniqid("geheim"))` zu
verwenden. Die Funktion `uniqid("somestring")` liefert einen auf
der aktuellen Uhrzeit basierenden String, der mit dem Prefix
"somestring" anfängt. Durch die Anwendung der Hashfunktion `md5()`
wird daraus eine 128 Bit lange (32 Hexziffern lange) Zahl, aus
der nicht auf den Ausgangsstring geschlossen werden kann. Wenn
die ungefähre Uhrzeit des Servers bekannt ist, zu dem eine
bestimmte Session gestartet ist, kann man jedoch versuchen, die
Session-ID zu erraten. Daher ist es wichtig, daß jede Anwendung
einen anderen, geheimgehaltenen Prefix-String "geheim" als Salt
für ihre Session-IDs verwendet.

Um die Sessiondaten an einen Browser zu binden, muss bei jedem
Request die Session-ID vom Browser mitgeschickt werden. Am
einfachsten erreicht man dies mit Hilfes eines Session-Cookies,
der im Browser gesetzt wird. Dies hat außerdem den Vorteil, daß
die ID nicht Bestandteil der URL wird und daher auch nicht mit
gebookmarked werden kann oder gar als Bestandteil einer URL mit
abgedruckt wird.

Nimmt der Browser des Anwenders jedoch keine
Cookies an, muss man sich auf eine andere Methode der Übergabe
der ID zurückziehen, bei der die Session-ID mit in die URL
eingebaut wird. Denkbar sind hier prinzipiell zwei Verfahren:
Die ID kann entweder als GET-Parameter an die URL angehängt
(`http://www.kunde.de/index.php3?Example_Session=0d0a...`)
werden oder sie kann als Pfadkomponente mit in die URL eingebaut
werden (`http://www.kunde.de/Example_Session=0d0a../index.php3`).
Erstere Methode hat den Vorteil, direkt einsetzbar zu sein,
letztere macht es notwendig, Name der Session und ID mit Hilfe
von mod_rewrite aus der URL herauszuholen, um den Zugriff auf
die Daten zu erlauben.

Die Daten, die zu der Session gehören, müssen auf der
Servermaschine auf irgendeine Weise gespeichert werden. PHP4
verwendet zu diesem Zweck ein Verzeichnis mit einer Datei pro
Session, PHPLIB verwendet stattdessen traditionell eine
Datenbank, kann aber seit Version 7 auch mit anderen Speichermethoden
arbeiten, etwa mit einfachen Dateien, mit DBM-Datenbanken, mit
einem LDAP-Server, oder mit Shared Memory. In jedem Fall sollten
diese Speicher unter derselben administrativen Kontrolle stehen
wie der Webserver, damit keine Trust Boundary überschritten
wird.

### Datenquellen von außerhalb

Nun kann eine Anwendung nur noch entweder die vorgegebene
Session-ID verwenden oder die Session-ID verwerfen. Im ersten
Fall funktioniert die Anwendung wie beabsichtigt, im zweiten
Fall wird einfach eine neue Session gestartet und initialisiert.
Beides sind definierte Zustände, die die Sicherheit des Systems
nicht gefährden können und bei denen keinesfalls Daten aus einer
Session in eine andere Session hinüberdiffundieren können.

Einige Systeme zur Verwaltung von Sessions und Session-IDs
merken sich zu jeder Session auch die IP-Nummer, aus der die
Session kommt. Auf diese Weise soll verhindert werden, daß ein
Angreifer eine Session-ID ausschnüffelt und mit dieser ID dann
die Session übernimmt. In der Praxis ist dies jedoch keine gute
Idee, weil sich die IP-Nummer, mit der eine Session an einem
Browser erscheint, ändern kann. Dies ist zum Beispiel dann der
Fall, wenn der Abrufer auf den Server über ein Netz von
Proxyservern zugreift: Hier kann die vom Webserver gesehene
IP-Nummer mit jedem Zugriff wechseln, je nach der Lastverteilung
auf den Proxyservern. In dieser Situation befinden sich viele
Benutzer im WiN, bei AOL und bei T-Online. Ebenfalls wechseln
kann die IP-Nummer bei Benutzern, die per Dialup-PPP eine
IP-Nummer dynamisch zugewiesen bekommen und bei denen sich die
PPP-Verbindung kurzzeitig abgebaut hat.

Sobald sichergestellt ist, daß Daten nicht zwischen Sessions
überspringen können, kann man daran gehen, die Wege zu sichern,
auf denen Daten in eine Session übernommen werden können. In PHP
gibt es prinzipiell die folgenden Wege, auf denen eine Anwendung
Daten von jenseits der Trust Boundary übernehmen kann:

- als GET-Parameter
- als POST-Parameter
- als Cookie-Data

GET- und POST-Parameter müssen bzw. können der Anwendung in
codierter Form übergeben werden. Wenn die Daten von der
Anwendung nicht ausschließlich in einer Standardform (nämlich
decodiert) verarbeitet werden, kann es dazu kommen, daß es
mehrere äquivalente Darstellungen derselben Werte gibt. Zum
Beispiel sind "hello+world", "hello%20world" und "hello world"
drei äquivalente Darstellungen desselben Strings. Arbeitet man
mit Stringoperationen auf solchen Daten, kann es zu Anomalien
kommen, bei denen ein Suchmuster oder Substring in einem Fall
auf die Daten paßt, in einem anderen Fall jedoch nicht. Es ist
also wichtig, die Daten ggf. erst vollständig zu decodieren und
dann erst Suchmuster und Stringerkennungen auf sie anzuwenden.

GET-Parameter sind Bestandteil der URL und unterliegen daher denselben
Beschränkungen wie URLs. Sie können keine Leerzeichen sowie gewisse
Sonderzeichen nicht enthalten, und ihre Länge ist begrenzt - daher überhaupt
die Notwendigkeit einer URL-Codierung und alternativer Darstellungen.

POST-Parameter werden wie unten gezeigt anders übermittelt, als Bestandteil
des Body eines Requests, doch auch sie kommen codiert über die Leitung.
Cookies werden als Cookie-Headerzeilen übermittelt.
```bash
kris@valiant:/usr/doc/packages/netcat > netcat -l -p 8080 -v
listening on [any] 8080 ...
connect to [193.102.57.3] from valiant.koehntopp.de [193.102.57.3] 1433
POST / HTTP/1.0
Referer: http://valiant:8080/
Connection: Keep-Alive
User-Agent: Mozilla/4.61 [en] (X11; U; Linux 2.2.10 i586)
Host: valiant:8080
Accept: image/gif, image/x-xbitmap, image/jpeg, image/pjpeg,
image/png, */*
Accept-Encoding: gzip
Accept-Language: German, de, en
Accept-Charset: iso-8859-1,*,utf-8
Content-type: application/x-www-form-urlencoded
Content-length: 19

probe=lala&amp;doit=los
```
PHP importiert alle diese Eingaben defaultmäßig als globale
Variablen in das Programm. Benötigte Decodierungen werden dabei
automatisch vorgenommen, ggf. werden die Eingabewerte auch
automatisch wieder für den Transfer in eine SQL-Datenbank
codiert, falls `magic_quotes_gpc` konfiguriert ist (dies ist
gelegentlich praktisch, aber meist unerwünscht). Zusätzlich
werden alle Eingabedaten je nach Herkunft noch in die drei
Hashes `HTTP_GET_VARS[]`, `HTTP_POST_VARS[]` und `HTTP_COOKIE_VARS[]`
einsortiert.

Prinzipiell ist es möglich, daß ein GET-Parameter, ein
POST-Parameter und ein Cookie dieselben Namen verwenden. Hier
steht derjenige Wert in einer globalen Variablen zur Verfügung,
der als letzter importiert wird. Die Reihenfolge des Imports
kann man mit der Konfigurationsvariablen `gpc_order` bestimmen
(Default ist "gpc"). In PHP4 und in PHPLIB überschreiben
Sessionvariablen aus vertrauenswürdigen Quellen Werte, die per
gpc aus einer nicht vertrauenswürdigen Quelle geholt wurden.
Dadurch werden eine ganze Menge potentielle Sicherheitsprobleme
vermieden.

### Dateien und Upload

Indem man ein Formular erzeugt, das mit der Methode "POST"
submitted wird und das einen besonderen Encoding-Type hat, kann
man auch Webformulare bauen, die den Upload von Dateien
ermöglichen. Ein solches Formular sieht minimal so aus:

```bash
kk@land:~ > netcat -l -p 8080 -v
listening on [any] 8080 ...
connect to [192.168.254.57] from lenz.intern.netuse.de [192.168.254.43] 2190
GET / HTTP/1.0
User-Agent: Mozilla/4.6 [en] (Linux; Alpha)
Host: land:8080
Accept: image/gif, image/x-xbitmap, image/jpeg, image/pjpeg, image/png, */*
Accept-Encoding: gzip
Accept-Language: de-DE,de,en
Accept-Charset: iso-8859-1,*,utf-8

<h1>Hallo</h1>
<form action="http://land:8080/" method=post enctype="multipart/form-data">
<input type="file" name="probe">
<input type="submit" value="los">
</form>
 punt!
```
In diesem Formular eingetragene Daten werden in Form eines
MIME-Multipart-Dokumentes an den Server zurückübermittelt. Der
Aufbau der Daten ist vergleichsweise kompliziert, aber zum Glück
kümmert sich PHP um die Decodierung aller Daten:

```bash
kk@land:~ > netcat -l -p 8080 -v
listening on [any] 8080 ...
connect to [192.168.254.57] from lenz.intern.netuse.de [192.168.254.43] 2193
POST / HTTP/1.0
Referer: http://land:8080/
User-Agent: Mozilla/4.6 [en] (Linux; Alpha)
Host: land:8080
Accept: image/gif, image/x-xbitmap, image/jpeg, image/pjpeg, image/png, */*
Accept-Encoding: gzip
Accept-Language: de-DE,de,en
Accept-Charset: iso-8859-1,*,utf-8
Content-type: multipart/form-data; boundary=---------------------------247491297412345
Content-Length: 225

-----------------------------247491297412345
Content-Disposition: form-data; name="probe"; filename="K:\Kunden\Netcologne\probe.txt"
Content-Type: text/plain

Dateiinhalt

-----------------------------247491297412345--

<h1>Danke.</h1>
 punt!
```
PHP verarbeitet diese Eingaben wie alle anderen Eingabedaten
automatisch. Es legt die Datei in einem temporären Verzeichnis
ab und stellen den Namen und die Größe der Datei in einigen
Variablen zur Verfügung, deren Namen von dem Namen des `<input
type="file">`-Tags abgeleitet werden: Für den Tagnamen `probe`
werden diese Variablen erzeugt:

`$probe`
: Name der Datei im temporären Verzeichnis auf dem Server.

`$probe_name`
: Name der Datei auf dem System des Anwenders.

`$probe_size`
: Größe der Datei in Bytes.

`$probe_type`
: Typ der Datei als MIME-Type.


Mithilfe der beiden PHP3-Konfigurationseinstellungen
`upload_tmp_dir` und `upload_max_filesize` kann man serverseitig
kontrollieren, wie groß die hoch geschickten Dateien maximal
werden können und in welchem Verzeichnis sie abgelegt werden.
Wenn man die Datei nach dem Ende der Seite behalten möchte, muss
man sie kopieren oder umbenennen: PHP löscht die Upload-Datei am
Ende der Seite. Ein Einstellen der Größenbegrenzung begrenzt
jedoch nicht wirklich den Plattenplatz, der auf dem Server von
PHP durch Fileupload verbraucht wird: Aus technischen Gründen
muss PHP die Datei zunächst empfangen und kann sie erst dann
verwerfen, wenn sie zu groß ist. Seit PHP 3.0.10 kann mehr als
eine Datei pro Formular hochgeladen werden.

###  Eingabedaten dekontaminieren

Eingabedaten, die aus einem Bereich mit niedrigem Vertrauen in
einen Bereich mit höheren Vertrauen überwechseln, müssen auf
Unbedenklichkeit geprüft werden. Es ist sonst möglich, die
Eingabedaten zu verwenden, um auf der Webservermaschine Schaden
anzurichten, der letztendlich bis zur Übernahme der Maschine
(und weiterer Maschinen im selben Netz) durch Angreifer reichen
kann.

Ein typisches Beispiel für Vertrauen in Daten aus einem nicht
vertrauenswürdigen Bereich ist das folgende Script: Gegeben sei
eine Funktion, die einen Datensatz des gerade angemeldeten
Benutzers in einer Tabelle anzeigt.

```php
<?
  $db = new DB_Example;
  $db->query("select * from sometable where key = '$PHP_AUTH_USER'");
  $db->next_record();
?>
  <form action="doit.php3"><table>
  <input type="hidden" name="f_key" value="<? $db->p("key") ?>">
  <tr><td><input type="text" name="f_name" value="<? $db->p("name") ?>"></td></tr>
  <tr><td><input type="text" name="f_vorname" value="<? $db->p("vorname") ?>"></td></tr>
  <tr><td><input type="text" name="f_credits" value="<? $db->p("credits") ?>"></td></tr>
  <tr><td align="right"><input type="submit" name="doit" value="Absenden"></td></tr>
  </table></form>
``` 
In diesem Script wird eine Tabelle mit drei bearbeitbaren
Eingabefeldern `f_vorname`, `f_name` und `f_credits` generiert. Die
Selektionsbedingung im SQL sorgt dafür, daß nur der Datensatz
des angemeldeten Benutzers angezeigt wird. Es wird jedoch auch
ein Eingabefeld erzeugt, das den Namen des aktuellen Benutzers
enthält. Übernimmt das Zielscript `doit.php3` diese Daten
ungeprüft, kann der bearbeitende Anwender einfach eine URL wie

```console
http://www.server.de/doit.php3?f_key=someuser&amp;f_name=some+name&amp;f_vorname=some+other+name&amp;f_credits=10000
```
abrufen und damit beliebige Datensätze bearbeiten. Das Script
`doit.php3` darf sich nicht darauf verlassen, daß der Inhalt von
`f_key`, der zurückgesendet wird, derselbe Inhalt ist, der
ursprünglich erzeugt wurde. Besser wäre es, den Wert von `f_key`
auf der Serverseite zu halten (etwa als eine zu einer Session
gehörende Variable) und nur die Werte `f_vorname` und `f_name` zu
akzeptieren.

Eingabedaten, die aus einem Bereich niedrigen Vertrauens
stammen, haben in einem Programm als giftig, als kontaminiert,
zu gelten. Auch alle anderen Variablen, in denen aus
kontaminierten Werten abgeleitete Werte abgelegt werden, sind
automatisch als kontaminiert anzusehen. Am günstigsten ist es,
alle nicht vertrauenswürdigen Daten durch eine
Dekontaminierungsfunktion, einen Validator, zu schleusen und
dann mit den sauberen Werten weiter zu arbeiten.

Dies kann zum Beispiel mit Code wie dem folgenden geschehen:

```php
<?
  // $key kommt aus der Session und ist automatisch gesetzt
  $vorname = check_alnumspace($f_vorname);
  $name    = check_alnumspace($f_name);
  $credits = check_numeric($f_credits);
?>
```

Die Funktionen `check_alnumspace()` und `check_numeric()` sind hier
im Beispiel dann einfache Funktionen, die die Eingabedaten auf
erlaubte Zeichen abprüfen.

```php
<?
  function check_alnumspace($in) {
    if (eregi("[^a-zäöüß0-9 ]+", $in) {
      return false;
    }
    return $in;
  }

  function check_numeric($in) {
    if (ereg("[^0-9]", $in) {
      return false;
    }
    return $in+0;
  }
?>
```

Diese Beispielfunktionen liefern entweder den Eingabestring
zurück, wenn dieser nur erlaubte Zeichen enthält oder den Wert
false, falls der Eingabestring verdächtigt aussieht. Die
Anwendung muss nun damit rechnen, daß die Felder `$vorname`, `$name`
und `$credits` leer (false) sein können, kann sich aber darauf
verlassen, daß die Strings das erwartete Aussehen haben, wenn
sie nicht leer sind.

Einer der größten Fehler, den man machen kann, ist es, die
Eingabedaten nicht zu dekontaminieren und sie dann in eine
Datenbank, eine Datei oder eine andere vertrauenswürdige
Datenquelle zu schreiben. Nun werden nämlich alle
Folgeanwendungen die nicht vertrauenswürdigen und ungeprüften
Daten aus einer vertrauenswürdigen Datenquelle laden und ihnen
ohne weitere Prüfung vertrauen.
