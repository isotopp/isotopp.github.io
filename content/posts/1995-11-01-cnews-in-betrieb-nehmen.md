---
author: isotopp
date: "1995-11-01T09:00:00Z"
feature-img: assets/img/background/rijksmuseum.jpg
published: true
title: "Cnews in Betrieb nehmen"
tags:
- lang_de
- publication
- internet
---

**Linux Magazin, Heft 11/1995**

# Cnews in Betrieb nehmen

**Ein Cnews in Betrieb zu nehmen ist schon nicht ganz einfach, wenn man die
originalen Quelltexte hat und den Installationsanweisungen des Autors, Henry
Spencer von der Universität Toronto, folgt. Aber in der Slackware, die
mit der Infomagic Developers Ressource vom März 1995 geliefert wird,
sind noch einige zusätzliche Haken und Ösen eingebaut. Dieser Text
beschreibt, wie ich mein Cnews von dieser CD zum Laufen bekommen
habe.**

Eigentlich bin ich ja kein Dosen-Benutzer, aber durch eine Verkettung
unglücklicher Umstände und fehlende Treiber war ich gezwungen,
etwas über ein Jahr mit MS-DOS und Crosspoint zuzubringen. Irgendwann
Mitte des Jahres hatte ich dann die Zusammenbrüche der Messagebase und
das Warten beim Einsortieren der Artikel satt. Ich beschloß, mir
wieder ein Linux und ein Cnews zu installieren, damit ich meine News endlich
wieder mit Gottes eigenem Newsreader lesen kann.
Eine Infomagic Developers Ressource ist günstig zu bekommen und die
Slackware darauf sollte eine gut getestete Standarddistribution sein.

Soweit die Theorie. In der Praxis bin ich bei der Installation des
Cnews-Paketes von dieser CD in eine ganze Reihe kleine Fallen gelaufen, die
offenbar nicht nur mich Nerven gekostet haben. Ich habe keine Ahnung, warum
das Cnews auf dieser Distribution so bissig ist (Nehmt Ihr alle INN?), aber
man kann es in den Griff bekommen.

Gleich der erste Fehler, der mir bei der Slackware in die Arme lief, waren
die Zugriffsrechte auf den Temporärverzeichnissen: Mein
`/var/tmp` hatte die Zugriffsrechte `755` und gehörte
`root.root`. Mit diesen Rechten muß nicht nur Cnews
Fehlermeldungen ausspucken, sondern jedes andere Programm, das ebenfalls mit
diesem Verzeichnis arbeitet, funktioniert nur für den Systemverwalter.

Hier sind die korrekten Zugriffsrechte für diese Verzeichnisse:

```console
root@white:~# ls -ld /tmp /var/tmp /usr/tmp
drwxrwxrwt   3 root     root         1024 Jul 20 16:43 /tmp
lrwxrwxrwx   1 root     root            8 Jul  8 14:55 /usr/tmp -> /var/tmp
drwxrwxrwt   2 root     root         1024 Jul 20 08:37 /var/tmp
```

Cnews setzt voraus, daß ein User `news` existiert. Man sollte
später die Wartung des Newssystems, also das Anlegen und Löschen
von Gruppen und Artikeln, keinesfalls als Systemverwalter machen. *Alle
Wartung an Cnews muß immer als news erfolgen!* Ich habe dem
`news`-User der Slackware daher ein Homeverzeichnis und ein
Paßwort gegeben:

```console
root@white:~# grep news /etc/passwd
news:deletedforsafety:9:13:white.schulung.netuse.de news:/var/lib/news:

root@white:~# ls -ld /usr/lib/news
lrwxrwxrwx   1 root     root           13 Jul  9 22:27 /usr/lib/news ->; /var/lib/news
```

Die Paßwortdatei sollte man vor der Änderung sichern, danach kann
man die betreffende Zeile dann leicht mit einem Editor anpassen und die
Änderungen mit einem `diff` zwischen der gesicherten und der
geänderten Version prüfen. Das Homeverzeichnis von `news`
ist bei mir das Verzeichnis mit den Konfigurationsdateien des Newspaketes,
`/var/lib/news`. Als ich mit UNIX angefangen habe, gab es noch keine
`/var`-Verzeichnisse und so bin ich `/usr/lib/news` als
Verzeichnis gewohnt. Also habe ich mir ein Symlink von
`/usr/lib/news` nach `/var/lib/news` installiert - die Macht
der Gewohnheit.

Außer diesem Konfigurationsverzeichnis hat Cnews auch noch
verschiedene Hilfsprogramme. Diese verstecken sich in den
Unterverzeichnissen von `/usr/lib/news/bin` (in `/usr`, weil
dies statische Dateien sind, im Gegensatz zu den veränderlichen
Konfigurationsdateien). Diese Dateien gehören alle `root`, damit
sie per NFS und mit `root_squash` exportiert werden können.
Leider macht die einzig notwendige Ausnahme, `relaynews`, diesen
Sicherheitsgewinn bei einem NFS-Export wieder zunichte...

An einigen der Programme unterhalb von `/usr/lib/newsbin` habe ich
mich vergriffen, damit das Newssystem so funktioniert, wie ich mir das
vorgestellt habe. Im Einzelnen waren die Änderungen:

```console
news@white:/usr/lib/newsbin$ find . -type f -mtime -100 -print
./ctl/newgroup
./maint/newsdaily
./maint/junkgroups
./inject/pnews
```

Die Änderungen waren folgendermaßen:

`ctl/newgroup`:
: Automatische Erzeugung neuer Newsgroups komplett abgeschaltet. Das ist am Anfang nicht weiter wichtig.

`maint/newsdaily`:
: Dieses Programm soll einmal am Tag ablaufen, um Cnews Statusreports zu erzeugen. Wegen eines Problems mit der `bash` hat das Programm aber leider den Report vor dem Versenden gelöscht. Am Anfang des Scriptes ist eine Zeile mit "`trap`". Ich habe sie brutal auskommentiert.

`maint/junkgroups`:
: Das ist ein kleines Script, das ich mir geschrieben habe, um das Logbuch von Cnews nach nichtexistierenden Gruppen zu durchsuchen. Es erzeugt eine Liste der fehlenden Gruppen, damit ich sie dann anlegen kann.

`inject/pnews`:
: `pnews` ist das Programm, mit dem neue Artikel in das Newssystem eingespielt werden können. Es erzeugt keine "`Lines:`"-Headerzeile für neue Artikel. Der `Lines`-Header ist zwar optional und Cnews entscheidet sich zu Recht dazu, nur minimale Header zu erzeugen, aber `nn` funktioniert besser, wenn der `Lines`-Header vorhanden ist.

Es genügt, `pnews` in den Editor zu laden und nach dem Text "`Lines`" zu suchen. Dort befinden sich Anweisungen, wie man die Erzeugung von` Lines`-Zeilen aktivieren kann.

Keine dieser Änderungen war kritisch. Es sind mehr Schönheitskorrekturen. Wichtiger sind stattdessen die Steuerdateien von Cnews. Sie befinden sich wie gesagt in `/var/lib/news`. Im Unterverzeichnis `bin` steht dort eine Datei `config`. Sie enthält einen Haufen Informationen, die die Shellscripte von Cnews benötigen. Diese Informationen müssen genau mit den Steuerinformationen des restlichen Newssystems übereinstimmen oder Cnews stellt die Arbeit kommentarlos ein. Daher darf diese Datei niemals verändert werden. Leider hatte sie jemand verändert, jedenfalls war sie schon auf der CD falsch. Hier ist die korrekte `/usr/lib/news/bin/config`:

```console
# configuration -- all the shell files pick this up using "."
# this makes it possible to add new variables here and have them
#  available everywhere immediately
#
# This is not, repeat NOT, a master control file for all of C News.
# This is the shell equivalent of libcnews/config.c, a "subroutine
# library" that gives shell files access to the default settings and
# lets environment variables override the defaults.  Changing the
# defaults here will *NOT* change them throughout C News.
#
# =()<NEWSCTL=${NEWSCTL-@<NEWSCTL>@}>()=
NEWSCTL=${NEWSCTL-/var/lib/news}
# =()<NEWSBIN=${NEWSBIN-@<NEWSBIN>@}>()=
NEWSBIN=${NEWSBIN-/usr/lib/newsbin}
# =()<NEWSARTS=${NEWSARTS-@<NEWSARTS>@}>()=
NEWSARTS=${NEWSARTS-/var/spool/news}
# =()<NEWSPATH=${NEWSPATH-@<NEWSPATH>@}>()=
NEWSPATH=${NEWSPATH-/bin:/usr/bin:/usr/sbin:/sbin}
# =()<NEWSUMASK=${NEWSUMASK-@<NEWSUMASK>@}>()=
NEWSUMASK=${NEWSUMASK-002}
# =()<NEWSMASTER=${NEWSMASTER-@<NEWSMASTER>@}>()=
NEWSMASTER=${NEWSMASTER-news}
# =()<NEWSCONFIG=${NEWSCONFIG-@<NEWSCONFIG>@}>()=
NEWSCONFIG=${NEWSCONFIG-/var/lib/news/bin/config}
```

Jetzt kann man daran gehen, den Rest des Newssystems zu konfigurieren. Als erstes muß die Identität des Systems korrekt eingestellt werden: In den Dateien `whoami` und `mailname` muß der komplette Name des eigenen Systems inklusive Domain eingetragen werden. Da mein System den Namen `white.schulung.netuse.de` trägt, habe ich also diese Namen eingesetzt:

```console
news@white:~$ cat whoami
white.schulung.netuse.de
news@white:~$ cat mailname
white.schulung.netuse.de
```

Leider steht hier im `NEWS-HOWTO` und in der Anleitung von Cnews, daß man in `whoami` den kurzen UUCP-Namen des Systems ohne Domain eintragen sollte. Das darf man nur dann, wenn dieser Name auch in der weltweiten USENET/UUCP Map für einen selbst reserviert ist und garantiert weltweit eindeutig ist. Das ist in der Regel nicht der Fall und daher sollte man *unbedingt* den Domainnamen einsetzen.

Der nächste Handgriff gilt der Datei `organization`, die den Inhalt der gleichnamigen Headerzeile darstellt. In dieser einzeiligen Datei soll die eigene Organisation möglichst kurz und prägnant beschrieben werden.

```console
news@white:~$ cat organization
My personal Linux in Kiel, Germany.
```

Die dritte, relativ statische Konfigurationsdatei betrifft moderierte Newsgroups: In eine moderierte Gruppe kann man nicht direkt schreiben. Stattdessen wird der eigene Artikel an einen Moderator gesendet, der wie ein Redakteur bei einer Zeitung den Artikel begutachtet. Der Moderator gibt den Artikel dann entweder zur Veröffentlichung in seiner Newsgroup frei (er erscheint mit dem Namen des Originalautors) oder bittet den originalen Autor um Korrekturen. Die Datei `mailpaths` enthält eine Liste von moderierten Newsgroups und Moderatoren. Für den Anfang genügt es, alle Gruppen von einem zentralen Knoten abhandeln zu lassen. Dieser wird die Artikel dann nach Bedarf weiterleiten.

Das genaue Format der Datei mailpaths ist in einem Artikel beschrieben, der von David C. Lawrence regelmäßig in den internationalen Gruppen `news.lists`,`news.admin.misc` und `news.answers `unter dem Titel "How to Construct the Mailpaths File" veröffentlicht wird.  Aber für den Anfang genügt es, dort den Text

```console
news@white:~$ cat mailpaths
backbone     uunet.uu.net!%s
```
einzutragen. Nachdem diese vier kleinen Konfigurationsdateien einmal aufgesetzt worden sind, kann man sie erst einmal vergessen. Die folgenden Steuerdateien sind wichtiger. Sie benötigen im Laufe der Existenz eines Newssystems wahrscheinlich gelegentlich Anpassungen, wenn weitere Gruppen eingerichtet werden oder wenn die Festplatte volläuft. Die erste dieser zentralen Konfigurationsdateien ist die Datei `sys`. Sie legt fest, welche Newsgroups wir überhaupt akzeptieren und an wen wir Newsgroups weiterleiten.

```console
news@white:~$ cat sys
# Diese Zeile zeigt an, welche Newsgroups wir überhaupt akzeptieren:
# Wir nehmen jeden Müll an. Warum Streß machen...
ME:all,all.all

# Artikel, die wir auf unserem System neu erzeugen, werden an den
# Rechner weitergeleitet, der uns mit News versorgt. Im Beispiel heißt
# dieser Rechner nuki. nuki verewigt sich im Pfad als nuki.netuse.de.
#
# Also senden wir nur diejenigen Artikel an nuki, die noch nicht
# nuki.netuse.de in der Path-Zeile stehen haben:
#	nuki/nuki.netuse.de:
#
# Wir möchten, daß alle Artikel in allen Gruppen an nuki weitergeleitet
# werden mit Ausnahme der lokalen Gruppen, die den Namen white.irgendwas
# haben:
#    all,all.all,!white.all
#
# Artikel können eine Zeile Distribution enthalten, die die Verbreitung
# räumlich einschränkt. Wir leiten alle Distributionen an nuki weiter, aber
# nicht local und auch nicht white.
#    all,!white,!local
#
# Tja und dann wollen wir noch Standardbatching haben:
# 	:f:
#
# Es ergibt sich diese Zeile in der Konfigurationdatei:
#
nuki/nuki.NetUSE.de:all,all.all,!white.all/all,!white,!local:f:
```

Alle Zeilen mit "#" in dieser Datei sind selbstverständlich Kommentare. Sie können gerne weggelassen werden. Neu erzeugte Artikel müssen natürlich irgendwann einmal verpackt und an `nuki.netuse.de` weitergeleitet werden. Wie das geschieht, steuert die Datei `batchparms`. Sie muß für jedes System, an das wir senden wollen, einen Eintrag enthalten:

```console
news@white:~$ cat batchparms
# big batches for fast modem (ISDN!), simple compression
# site          size    queue   builder muncher sender
# ----          ----    -----   ------- ------- ------
nuki            500000  20      batcher compcun viauux
```

So, jetzt können wir daran gehen, einen Spoolbereich für News einzurichten und danach können dann Gruppen erzeugt werden. Standardmäßig sieht es bei der Slackware so aus:


```console
news@white:~$ cd /usr/spool/news
news@white:/usr/spool/news$ ls
news@white:/usr/spool/news$
```

Nichts da. Für jede Gruppe in der Datei `~news/active` muß hier ein passendes Unterverzeichnis angelegt werden. Außerdem brauchen wir noch einige Spezialverzeichnisse.

```console
news@white:/usr/spool/news$ cat ~news/active
junk 000000001 00001 y
control 000000001 00001 y
news.announce.newusers 000000001 00001 y
news@white:/usr/spool/news$ mkdir -p news/announce/newusers junk control
news@white:/usr/spool/news$ mkdir in.coming in.coming/bad out.going out.going/nuki out.master
```

Statt nuki und nuki.netuse.de müssen natürlich die Namen des eigenen Feeds als Verzeichnisnamen eingesetzt werden. Aber zurück in das Verzeichnis `~news`: Im Laufe des Lebens des Newssystems wird man sich öfter als User `news` einloggen müssen. Also sollte man diesem Benutzer in seinem Home eine vernünftige `.profile` verpassen. Hier ist eine:

```console
news@white:~$ cat .profile
echo ".profile"
PATH=/bin:/usr/bin:/usr/local/bin:/usr/sbin:/sbin:/usr/lib/newsbin/maint:/usr/lib/newsbin/expire:/usr/lib/newsbin/input:/usr/lib/newsbin/batch
```

Diese Pathangabe ist ziemlich lang, aber sie vereinfacht die Wartung des Newssystems. Nach dem Einlesen der `.profile`-Datei kann man sich dann daran machen, Newsgroups anzulegen:

```console
news@white:~$ . .profile
news@white:~$ echo $PATH
/bin:/usr/bin:/usr/local/bin:/usr/sbin:/sbin:/usr/lib/newsbin/maint:/usr/lib/newsbin/expire:/usr/lib/newsbin/input:/usr/lib/newsbin/batch
news@white:~$ addgroup gewuenschte.name.fuer.die.gruppe y
```

Mit dem Kommando `addgroup` kann man neue Newsgroups anlegen. Auf jeden Fall sollte man sich eine lokale Gruppe zum Testen anlegen. Diese Gruppe sollte *nicht* nach draußen exportiert werden. Im Beispiel oben ist die Gruppenhierarchie `white.all` schon dafür vorbereitet worden. Also kann man gefahrlos eine Gruppe `white.test` anlegen:

```console
news@white:~$ addgroup white.test y
```

Weiterhin möchte man natürlich Newsgroups anlegen, die man von seinem Feed bestellt hat. Am einfachsten geht das, indem man eine Datei anlegt, in der diese Gruppen aufgezählt sind, jeweils ein Name pro Zeile. Im Beispiel enthält die Datei `x` eine solche Liste. Wir zeigen nur den Kopf dieser Liste, um Platz zu sparen:

```console
news@white:~$ head x
alt.fan.pratchett
alt.tv.babylon-5
cau.ifi.apply.eulisp
cau.ifi.archive
cau.ifi.fragen
cau.ifi.general
cau.ifi.inf
cau.ifi.statistic
cau.ifi.termine
cau.inf
news@white:~$ cat x | xargs -i addgroup {} y
```

Das Kommando `xargs` sorgt dafür, daß sein Parameter `addgroup` für jede Zeile der Standardeingabe einmal ausgeführt wird. Es wird also für jede Zeile der Datei `x` ein `addgroup`-Kommando gestartet. Nachdem dies abgeschlossen ist (es dauert eine gewisse Zeit), könnten im Prinzip schon News eingespielt werden. Wir möchten jedoch auch, daß diese Artikel nach einer gewissen Zeit wieder verschwinden. Daher muß auch noch konfiguriert werden, in welcher Gruppe die Artikel wieviele Tage verbleiben sollen. Die Steuerdatei, die dies regelt, ist die Datei `explist`:


```console
news@white:~$ cat explist
# Die Reihenfolge der Zeilen in dieser Datei ist wichtig!

# Die History bleibt 14 Tage erhalten. Kein Artikel bleibt länger
# als 90 Tage
/expired/                       x       14      -
/bounds/                        x       0-1-90  -

# Artikel in control bleiben 7 Tage, junk geht nach 1 Tag weg
control                         x       3       -
junk                            x       1       -
# Alle anderen Artikel verschwinden nach 7 Tagen
all                             x       7       -
```

Wenn man auch damit durch ist, kann das System endlich auf Autopiloten gestellt werden. Daztu muß eine Datei `crontab.news` im Homeverzeichnis von news erzeugt werden. Sie sollte so aussehen:


```console
# Auspacken von neu eingegangenen News
0,10,20,30,40,50 *  * * * /usr/lib/newsbin/input/newsrun

# Einpacken von lokal erstellten News
25 * * * * /usr/lib/newsbin/batch/sendbatches

# Wegschmeissen von ueberalterten Artikeln
59 0  * * * /usr/lib/newsbin/expire/doexpire
# Nur fuer NN-Benutzer: nnmaster wecken!
# 59 2  * * * /usr/bin/nnadmin =eyw

# Systemüberwachung
10 5  * * * /usr/lib/newsbin/maint/newsdaily
00 5  * * * /usr/lib/newsbin/maint/newswatch

# Nur fuer NN-Benutzer: Sichern der Active-Dateien und erstellen
# der Subject-Datenbank
#59 3  * * * /usr/lib/nn/nnspew
#29 3  * * * /usr/lib/nn/back_act
```

Die auskommentierten Zeilen sind nur wichtig, wenn der Newsreader nn verwendet wird. In diesem Fall müssen sie aktiviert werden, d.h. die Kommentarzeichen müssen gelöscht werden. Die Crontab-Datei wird mit dem Kommando¯


```console
news@white:~$ crontab crontab.sample
```

installiert und kann mit dem Kommando

```console
news@white:~$ crontab -l
```

geprüft werden. Die Crontab regelt, wann am Tag das Programm cron bestimmte Tätigkeiten ausführt. So bedeutet die Zeile

```console
59 0  * * * /usr/lib/newsbin/expire/doexpire
```

aus der Crontab oben zum Beispiel, daß jeden Tag um 0 Uhr 59 das Programm `doexpire` gestartet werden soll, um alte Artikel zu löschen. Das funktioniert natürlich nur dann, wenn der Rechner um diese Zeit auch sicher angeschaltet ist. UNIX-Rechner haben in der Regel viele solche Cronjobs, die des Nachts alle wichtigen, aber unangenehmen Aufgaben erledigen. Daher sollte man den Rechner ruhig rund um die Uhr durchlaufen lassen und ihn um diese Zeit News und Mail holen lassen. Wenn man dies nicht machen kann, etwa weil der Rechner zu laut ist, dann muß man die Zeiten in der Crontab auf passende Zeiten anpassen.

Jetzt können wir daran gehen, das System zu testen:

```console
news@white:~$ inews -n white.test -t "Testing" -d local
Yummy Yummy Yummy
^D
news@white:~$
```

Dies sollte eine Datei in in.coming erzeugen:

```console
news@white:~$ cd /usr/spool/news/in.coming/
news@white:/usr/spool/news/in.coming$ ls
0.1435483580.t  bad
news@white:/usr/spool/news/in.coming$ cat 0.1435483580.t
Newsgroups: white.test
Path: news
From: news@white.schulung.netuse.de (Kristian Koehntopp)
Subject: Testing
Distribution: local
Organization: My personal Linux in Kiel, Germany.
Message-ID: <DC0tuC.70H@white.schulung.netuse.de>
Date: Thu, 20 Jul 1995 15:32:34 GMT
Lines: 1

Yummy Yummy Yummy
```

Dabei sind folgende Dinge zu beachten:

Die `Path:`-Zeile sollte nur den Namen des Absender enthalten. Die Absenderadresse sollte korrekt sein, also in der `From:`-Zeile den User `news` mit einem vollständigen Domainnamen zeigen. Die Zeilen `Newsgroups:` und `Distribution:` müssen so aussehen, wie mit den Optionen `-n` und `-d` gefordert. Das `Subject:` sollte so aussehen, wie mit `-t` vorgegeben. Das Datum sollte stimmen und in GMT angezeigt werden (Stimmt die Zeitzonenanpassung?). Und schließlich sollte auch eine `Lines:`-Headerzeile angezeigt werden und die korrekte Zeilenzahl angeben.

Wenn das alles stimmt, kann der Benutzer `news` (und nur `news`, *niemals* ein anderer!) das Kommando `newsrun` aufrufen. Das dauert in etwa eine Minute, weil in `newsrun` ein "`sleep 45`" enthalten ist.

```console
news@white:/usr/spool/news/in.coming$ which newsrun
/usr/lib/newsbin/input/newsrun
news@white:/usr/spool/news/in.coming$ newsrun
^Z
[1]+  Stopped                 newsrun
news@white:/usr/spool/news/in.coming$ bg
[1]+ newsrun &
```

Im Logbuch muß jetzt ein Eintrag zu finden sein:


```console
news@white:/usr/spool/news/in.coming$ cd
news@white:~$ tail -2 log
Jul 20 16:39:50.000 nuki.NetUSE.de + <3uljtj$fb4@picard.toppoint.de>
Jul 20 17:35:52.000 white.schulung.netuse.de + <DC0tuC.70H@white.schulung.netuse.de>
```

Der letzte Eintrag zeigt an, daß der Artikel erfaßt und akzeptiert worden ist. Wir sehen ihn uns an:


```console
news@white:~$ ls -l /usr/spool/news/white/test/
total 1
-rw-r--r--   1 news     news          237 Jul  9 23:10 1
```

Das ist er. Durch das Einspielen in das Newssystem haben sich einige Headerzeilen (zum Beispiel der `Path:`) etwas verändert. Das ist normal. Der nächste Schritt im Test ist es, einen Artikel zu erzeugen, der den unseren Feed weitergegeben wird:

```console
news@white:~$ inews -n nuki.test -t "Testing"
Yummy Yummy Yummy
^D
```

Dies ist kein Artikel mit der Distribution "`local`" und er ist nicht in einer lokalen Gruppe. Also sollte er an `nuki` weitergegeben werden:

```console
news@white:~$ newsrun &
[1] 9177
news@white:~$ cd /usr/spool/news/out.going/nuki/
news@white:/usr/spool/news/out.going/nuki$ ls -l
total 1
-rw-rw-r--   1 news     news           15 Jul 20 17:38 togo
news@white:/usr/spool/news/out.going/nuki$ cat togo
nuki/test/1 264
```

Das `newsrun` hat den Artikel wieder in das Newssystem übernommen. Außer der Installation der Artikeldatei in `/usr/spool/news/nuki/test` ist aber noch etwas anderes passiert: In `.../out.going/nuki` ist eine Datei `togo` angelegt worden. Sie enthält ein Logbuch der noch zu packenden Artikel für das System `nuki`. Die Zahl hinter dem Artikelnamen ist die Länge des Artikels in Byte. Das Programm `sendbatches` wird die Datei togo einlesen und einen UUCP-Job für nuki erzeugen:

```console
news@white:/usr/spool/news/out.going/nuki$ sendbatches
^Z
[2]+  Stopped                 sendbatches
news@white:/usr/spool/news/out.going/nuki$ ls -l
total 3
-rw-rw-r--   2 news     news            5 Jul 20 17:40 L.9215
-rw-rw-r--   2 news     news            5 Jul 20 17:40 LOCKbatch
-rw-rw-r--   1 news     news            0 Jul 20 17:40 togo
-rw-rw-r--   1 news     news           15 Jul 20 17:40 togo.1
news@white:/usr/spool/news/out.going/nuki$ bg
[2]+ sendbatches &
news@white:/usr/spool/news/out.going/nuki$ ls -l
total 0
-rw-rw-r--   1 news     news            0 Jul 20 17:40 togo
[2]+  Done                    sendbatches
news@white:/usr/spool/news/out.going/nuki$ uustat -s nuki
nukid0294 nuki news 07-20 17:40 Executing rnews (sending 246 bytes)
```

Im Beispiel ist `sendbatches` schon sehr kurz nach dem Aufruf mit `^Z` gestoppt worden. Man kann deutlich sehen, wie das Newssystem während der Erzeugung der Batches Lockdateien erzeugt, um den Zugriff auf die Daten zu regulieren. Wird die Ausführung von `sendbatches` mit `bg` im Hintergrund freigegeben, verschwinden die Locks und die `togo`-Datei leert sich. Stattdessen entsteht ein UUCP-Job für das System `nuki`. Mit dem nächsten Start von UUCP verschwindet dieser Job in Richtung Feed.

Damit sollte das Newssystem jetzt sicher laufen.

Cnews kommt mit einer umfangreichen englischen Dokumentation. Bei der Slackware steht sie in `/usr/doc/cnews` bereit, ist allerdings nicht formatiert. Um die Dokumentation zubereiten zu können, benötigt man bei der Slackware das Paket `pmake` (GNU make tut es nicht) und das Paket `groff` inklusive der zugehörigen Zeichensätze.

Wenn beide Pakete installiert sind, sollte es genügen, im entsprechenden Verzeichnis "`pmake`" aufzurufen. Dabei sollte `root` für die Dauer des `pmake`-Aufrufes (und nur für die Dauer des `pmake`-Aufrufes!) das Verzeichnis "`.`" im Suchpfad haben. Sollte es dabei zu Fehlermeldungen kommen, die besagen, daß das "`ms`" Makropaket nicht gefunden werden kann, kann man stattdessen `tmac.cn` verwenden. Dazu ist die Datei tmac.cn nach `/usr/lib/groff/tmac/tmac.s` zu kopieren. `tmac.cn` ist kein richtiger Ersatz für `tmac.s`, aber es ist kompatibel genug, um die Dokumentation zu übersetzen. Während der Übersetzung der Dokumentation hagelt es einige Warnmeldungen, aber diese sind unkritisch.

Die resultierenden Postscript-Dateien können ausgedruckt werden oder mit `ghostview` oder Ghostscript angesehen werden. Die wichtigen Informationen stehen in der Datei `guide.ps`.

```console
root@white:/usr/doc/cnews/docs# ls -l *ps
-rw-r--r--   1 root     root       310197 Jul 21 11:42 guide.ps
-rw-r--r--   1 root     root        29305 Jul 21 11:43 index.ps
-rw-r--r--   1 root     root         5312 Jul 21 11:43 toc.ps
```

Es ist auch möglich, eine ASCII-Version der `guide`-Datei zu erzeugen. Dazu ist das Kommando

```console
root@white:/usr/doc/cnews/docs# pmake guide.out
root@white:/usr/doc/cnews/docs# ls -l guide.out
-rw-r--r--   1 root     root       223706 Jul 21 11:47 guide.out
```

aufzurufen. Dabei entsteht eine ganze Menge Schrott auf dem Bildschirm, der
aber ignoriert werden kann. Das Resultat wird eine Datei guide.out sein, die
im aktuellen Verzeichnis steht und eine lesbare ASCII-Version des Guides
enthält.
