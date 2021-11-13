---
author-id: isotopp
date: "1995-12-01T09:00:00Z"
feature-img: assets/img/background/rijksmuseum.jpg
published: true
title: "init - Starten und Beenden von Linux"
tags:
- lang_de
- publication
- unix
---

**Linux Magazin, Heft 12/1995**

## init - Starten und Beenden von Linux

*Der Prozeß mit der Prozeßnummer 1 ist init. init wird beim Starten des Systems geladen und läuft bis zum Abschalten durch. Er ist der direkte oder indirekte Urahn aller anderen Prozesse eines Linux-Systems. Ein genaues Verständnis der Vorgänge vom Starten von init bis zum Erscheinen des ersten Shellprompts nach dem Login ist notwendig, um fehlerhaft konfigurierte Linuxsysteme wiederzubeleben, ohne neu installieren zu müssen.*

Die meisten Linux-Distributionen haben heutzutage den sysvinit 2.4 von Miquel van Smoorenburg (Miquel van Smoorenburg) installiert. Diese init-Version entspricht im Großen und Ganzen den von regulären System V Systemen bekannten inits, ist aber auf PC-Verhältnisse besonders angepaßt. sysvinit kennt zum Beispiel spezielle Optionen betreffend das Verhalten bei einem Stromausfall mit einer USV und weiß mit einem Control-Alt-Delete umzugehen. Mit Smoorenburgs init-Paket kommen außer init auch noch die Programme `halt`, `last`, `mesg`, `shutdown` und `wall` sowie der Quelltext für den `powerd`, ein Auswertedämon für die Statusleitungen von USVs. Eine Version von `who`, die auf den init abgestimmt wäre, fehlt.

Zu dem Zeitpunkt, zu dem init gestartet wird, ist das System soeben gebootet worden. Außer dem Root-Dateisystem, das wahrscheinlich nur read-only gemountet ist und möglicherweise beschädigt ist und der Systemkonsole `/dev/console` existieren keine weiteren Ressourcen. Außer init laufen keine anderen Prozesse. Swapspace ist noch nicht angemeldet, was zur Folge hat, daß auf Systemen mit nur 4 MB RAM der Speicher schnell knapp werden könnte. Die Aufgabe von init beim Systemstart ist zunächst einmal, die Dateisysteme zu prüfen, gegebenenfalls zu reparieren und sie sowie eventuell vorhandenen Swapspace anzumelden. Durch die zusätzlichen Dateisysteme und den zusätzlichen Speicher versetzt sich das System in die Lage, die zahlreichen Hintergrundprozesse zu starten, die ein vollständig betriebsbereites Linux auszeichnen. Welche Dämonen gestartet sind, wird durch die Konfigurationsdatei von init, die `/etc/inittab` festgelegt. Je nach Run-Level des Systems können dies unterschiedliche Prozesse sein.

## Run-Levels

Ein Run-Level ist dabei einfach nur die numerische Bezeichnung (Okay, es gibt auch noch einen Run-Level S) für eine bestimmte Systemkonfiguration. Abhängig vom aktuellen Run-Level werden bestimmte Zeilen der `/etc/inittab` gültig oder ungültig und init stoppt oder startet dementsprechend die zugehörigen Prozesse. Die `/etc/inittab` definiert gewissermaßen den Soll-Zustand des Systems in einem bestimmten Run-Level: Fehlende Dämon-Prozesse werden von init nachgestartet, überzählige Dämon-Prozesse werden von init gestoppt. 

Über den Ist-Zustand des Systems führt init parallel dazu in der utmp-Datei Buch. Für jede Zeile der `/etc/inittab` steht in der utmp-Datei ein `struct utmp`-Eintrag, der über den Verbleib des zugehörigen Prozesses Aufschluß gibt. Außerdem führt init über seine Aktionen noch in der wtmp-Datei ein Logbuch. Auch diese Datei besteht aus `struct utmp`-Einträgen, aber im Gegensatz zu utmp, die eine feste Länge hat, wird wtmp als Logbuch fortgeschrieben (und muß regelmäßig gekürzt werden). Programme wie `who`, `w`, `finger` oder der `rwhod` können die utmp-Datei auswerten und anzeigen, welche Benutzer gerade im System eingeloggt sind oder welche Schnittstellen gerade unbelegt sind. Programme wie `last` oder Accountingtools werten dagegen die wtmp-Datei aus und können so ein Logbuch über die vergangenen Logins erzeugen. 

Auf einem richtigen System V kann who nicht nur eine Liste der eingeloggten Benutzer erzeugen, sondern die komplette utmp-Datei analysieren und auch mit der Option -r den aktuellen Run-Level des Systems anzeigen. Im Umfeld der Slackware-Distributionen paßt der `who`-Befehl nicht zum init und ihm fehlen diese Optionen, sodaß man auf selbstgeschriebene Programme angewiesen ist.

init erzwingt nicht, daß bestimmte Run-Level (ausgenommen S) bestimmte Bedeutungen haben. Das Verhalten des Systems richtet sich ausschließlich nach der Konfiguration in der `/etc/inittab`. Per Konvention hat diese auf den meisten Distributionen, die von Slackware abstammen, ein bestimmtes Aussehen. "Slackware inittab" weiter unten zeigt die `/etc/inittab` einer Slackware-Installation.

Eine Zeile der `inittab` hat dabei das folgende Format:

```
	id:runlevels:action:process
```

Die **id** stellt dabei einen eindeutigen Identifikator für die Zeile der inittab dar. Er muß genau zwei Buchstaben lang sein und taucht später als `ut_id`-Feld in demjenigen Eintrag in der utmp-Datei auf, der zu dieser Zeile der inittab gehört. Das, was `finger` in der Spalte Tty ausdruckt, ist der Inhalt dieses `ut_id`-Feldes aus der utmp-Datei.


Das Feld **runlevels** definiert einen oder mehrere Run-Levels, in denen diese Zeile aktiviert sein soll.Wenn der aktuelle Run-Level des Systems hier nicht aufgeführt ist, ist diese Zeile unwirksam: Ein Eintrag im Feld runlevels mit den Ziffern 123 wäre nur in den Run-Levels 1, 2 und 3 gültig.  


Das Feld **process** definiert dann den Aufruf eines Prozesses mit allen Parametern, wie er von init gestartet werden soll, wenn das System sich in einem der in runlevels genannten Run-Level befindet. Diese Prozesse sind entweder Dämon-Prozesse wie `xdm` oder `nnmaster`, Login-Prompts wie `getty` oder Scripte und Anweisungen, die beim Wechsel des Run-Levels aktiv werden. init überwacht diese Prozesse. Wenn sich einer von ihnen beendet, bemerkt init dies und entscheidet anhand der **action** darüber, ob der Dämon neu gestartet werden soll oder was sonst zu tun ist. 

Der Abschnitt "Das action Feld in der inittab" erklärt die Bedeutung der verschiedenen Schlüsselworte.

## Die rc-Scripte

Bei der Slackware startet die inittab einige rc-Scripte, genau wie bei den meisten anderen Unices auch. Die Bezeichnung `rc` steht dabei für "run command". Sie stammt noch aus der Urzeit der Computerentwicklung und wurde von einem der vergessenen Vorläufer von UNIX übernommen. Heute würde man wohl stattdessen das Kürzel "BAT" verwenden. 

Die Struktur dieser Scripte orientiert sich bei Linux mehr an der wesentlich primitiveren Konfiguration eines BSD-Systems als an einem normalen System V. Mit unserem Wissen über init können wir inzwischen erkennen, daß Linux nach dem Booten wegen des `initdefault`-Schlüsselwortes in der inittab den Run-Level 5 ansteuert. Der `sysinit`-Eintrag sorgt dann für die Abarbeitung von `/etc/rc.d/rc.S`, gefolgt von `/etc/rc.d/rc.M`, da der `wait`-Eintrag "rc" den Run-Level 5 enthält. Nachdem init auf das Ende von `rc.M` gewartet hat, startet er die `getty`-Einträge `c2` bis `c6` (`c1` ist hier auskommentiert) und den `nnmaster`. Der Eintrag `x1` wird ignoriert, da er nur für den Run-Level 6 gilt.

`/etc/rc.d/rc.S` ist das Script, das als erstes nach dem Systemstart abgearbeitet wird. Es findet den eingangs erwähnten Rechner ohne Dateisysteme und Ressourcen vor und macht sich daran, diesen Zustand zu ändern. Die ersten Handgriffe nach der Definition eines Suchpfades dienen dazu, den Swapspace zu aktivieren: Dazu muß `swapon -a` eine gültige `/etc/fstab` vorfinden und dort die Swap-Partitionen benannt bekommen. Der `update`-Dämon sorgt dann dafür, daß der Speicherinhalt auch gelegentlich auf die Festplatte geschrieben werden. Jetzt ist auch auf Maschinen mit 4 MB RAM genügend Speicher bereitgestellt, um größere Prozesse ablaufen lassen zu können. 

Die folgenden Anweisungen dienen dazu, die Dateisysteme zu prüfen und - falls möglich - das Root-Dateisystem read-write anzumelden. Wenn der `fsck` oder der Remount fehlschlagen, druckt das Script Handlungsanweisungen und versucht noch so etwas wie ein Login hinzubekommen. Die folgenden Anweisungen ab Zeile 92 dienen dann dazu, die üblichen Konfigurations- und Statusdateien zu erzeugen, die beim Systemstart aufgefrischt werden müssen und die Systemzeit zu stellen.

Startet man Linux im <i>single user mode</i> oder gerät man auf andere Weise auf ein System mit einer read-only angemeldeten Root-Platte, kann man sich behelfen, indem man `/etc/rc.d/rc.S` von Hand ausführt. Mit ein wenig Glück bekommt man so ein halbwegs vernünftig konfiguriertes System, bei dem man immerhin soviele Eingriffsmöglichkeiten hat, daß man die verbleibenden Fehler von Hand korrigieren kann. Auch normale UNIX-Versionen haben ähnliche Scripte. Da das Checken und Anmelden der Platten nach dem Systemstart mit die dringlichste Aufgabe ist, findet man den Namen des Scriptes am einfachsten heraus, indem man sich den sysinit-Eintrag der betreffenden `/etc/inittab` ansieht. Ein häufige Name für dieses Script ist zum Beispiel `bcheckrc`.

`/etc/rc.d/rc.M` kümmert sich dann um die Vorbereitung des Systems auf den Mehrbenutzerbetrieb. Dieses Script kann davon ausgehen, daß alle lokalen Platten schon verfügbar sind und daß ausreichend Swapspace zur Verfügung steht. Hostnamen und andere das Netzwerk betreffende Dinge sind aber noch undefiniert. `rc.M` konfiguriert einen Screenblanker, startet den `cron`, setzt den Hostnamen und verzweigt dann vorübergehend in die Scripte `rc.inet1` und `rc.inet2`. Ersteres dient dazu, den Kernelteil des Netzwerkes zu konfigurieren: Die Interfaces erhalten ihre IP-Nummern und werden gestartet, danach setzt sich der Kernel Routingtabellen. Das gesamte Script besteht im Prinzip nur aus glorifizierten Aufrufen von `ifconfig` und `route`. Die zweite Datei konfiguriert dann den Anwendungsteil des Netzes, indem dort die entsprechenden Serverprozesse gestartet werden. Die folgenden Arbeiten in `rc.M` erledigen dann einige Aufräumarbeiten, die zu verschiedenen Subsystemen gehören. Wichtig ist hier vor allen Dingen der Aufruf von `ldconfig`, der Links auf die aktuellen Versionen der shared libraries auf den neuesten Stand bringt. Am Ende von `rc.M` wird dann noch auf `rc.local` verzweigt, in der der Systemverwalter lokale Modifikationen des Systemstarts unterbringen kann. Einige Versionen der Slackware verzweigen bei Bedarf noch in andere, spezialisierte rc-Dateien zum Verstellen des Zeichensatzes oder der Tastaturbelegung.

![](/uploads/1995/12/init-files.gif)

## Erweiterungen der rc-Dateien

Bei der Konstruktion der rc-Dateien, wie sie im Abschnitt "Slackware inittab" gezeigt wird, ist einzig die Datei `rc.local` für lokale Erweiterungen des Bootvorganges vorgesehen. Der Systemverwalter kann hier neben lokalen Anpassungen für Zeichensatz und Tastatur eigene Dämon-Prozesse starten oder den Weg für den Start solcher Prozesse bereiten (indem zum Beispiel alte Lockdateien abgeräumt werden). 

Dabei sollte man auf jeden Fall darauf achten, daß die `rc.local`-Datei beendet wird! `rc.S` wird als sysinit-Eintrag ausgeführt und `rc.local` ist Bestandteil von `rc.M` und wird als wait-Eintrag ausgeführt. In beiden Fällen können die folgenden Einträge der inittab erst dann ausgeführt werden, wenn `rc.S` bzw. `rc.M` beendet sind. Die folgenden Einträge sind aber die `getty`-Prozesse für die Systemkonsole (c1-c6), die das Login überhaupt ermöglichen. Wenn ein Fehler in `rc.M` also dazu führt, daß sich das Script niemals beendet, kommen niemals Loginprompts und man kann sich nicht anmelden, um den Fehler zu korrigieren.

Der Fehler tritt zum Beispiel gerne dann auf, wenn man in `rc.local` einen Dämon startet (es ist ein Characteristikum von Dämonen, daß sie sich nach Möglichkeit nicht beenden), der sich nicht automatisch selbst in den Hintergrund schiebt. Zum Beispiel schiebt sich der `nnmaster`-Aufruf

```
	/usr/lib/nn/nnmaster -l -r -C
```

automatisch in den Hintergrund, während

```
	/usr/lib/nn/nnmaster -f -l -r -C
```

keinen Hintergrundprozeß erzeugt, sondern ausdrücklich im Vordergrund bleibt. In der `rc.local` würde nur der erste Aufruf korrekt funktionieren, der zweite würde das System blockieren. 

In der `/etc/inittab` im Abschnitt "Slackware inittab" ist `nnmaster` jedoch in der zweiten Variante eingetragen. Wieso ist das hier notwendig? Nun, in der inittab ist `nnmaster` als respawn-Eintrag eingetragen: init bewacht den `nnmaster` hier und startet ihn neu, falls notwendig. Wäre `nnmaster` hier ohne -f eingetragen, würde der Dämon sich in den Hintergrund schieben und der Vordergrundprozeß würde sich gleich wieder beenden. init bemerkt, daß sich der von ihm gestartete Prozeß beendet hat und würde sogleich einen zweiten `nnmaster` starten, wie der respawn-Eintrag es befiehlt. Solche Einträge erzeugen dann die Meldung "respawning to rapidly".

## rc-Dateien im Stile von System V

Das Konzept der `rc.local`-Datei ist zwar schön einfach zu verstehen, aber für die automatische Wartung des Systems ist es nicht besonders elegant. In einer kommerziellen Umgebung würde man davon ausgehen, daß die Benutzer des Systems reine Anwender sind und kaum genug Ausbildung haben, um mit der Anwendung selbst klarzukommen. Auch von der Systemverwaltung kann man nicht in jedem Fall verlangen, daß sie zu selbstständigen Änderungen an rc-Dateien in der Lage ist. Das gilt insbesondere dann, wenn diese Änderung den fehlerfreien Wiederanlauf des Systems gefährden kann. Für Anwendungen, die durch schlecht ausgebildete Personen aus vorgefertigen Packages installiert werden sollen, wäre es wünschenswert, wenn ein Mechanismus besteht, durch den sie sich automatisch und weitgehend fehlerfrei in die Programmfolge beim Systemstart einhängen können.

Ein ähnliches Problem besteht schon seit Jahren im Bereich MS-DOS, wo Installationsprozeduren von Anwendungspaketen Änderungen an der AUTOEXEC.BAT und der CONFIG.SYS vornehmen müssen. Im Bereich MS-DOS löst man dies, indem jede Anwendung einen großen Installator mit sich herumschleppt, der in der Lage ist, solche Konfigurationsdateien zu parsen und zu korrekt verändern (oder auch nicht). Das so etwas schon bei MS-DOS nicht richtig funktioniert, bemerkt der Autor jedesmal an seiner eigenen Konfiguration, die leider nicht linear ist, sondern mehrere Verzweigungen und Aufrufe von Unterbatches enthält. Praktisch alle DOS-Installationsprogramme führen ihre Änderungen an der falschen Stelle oder nur für eine Konfiguration (meistens nicht die aktive) ein. UNIX Shellscripte sind allerdings noch mächtiger als DOS Batchdateien und für ein Installationsprogramm entsprechend schwieriger zu handhaben. Die Wahrscheinlichkeit, daß ein rc-Modifikator eine etwas komplexere `rc.local` durch seine Änderungen zerstört sind viel größer als für ein DOS Installationsprogramm.

In System V UNIX verwendet man deswegen ein etwas anderes Konzept, daß ohne aufwendige Parser auskommt und trotzdem viel sicherer funktioniert. Statt alle Anweisungen in eine einzige Datei zu quetschen, hat man die rc-Datei dort in viele kleine Module zerlegt, von denen sich jedes um einen Aspekt des Systemstartes kümmert. Man hat für jeden Run-Level ein Unterverzeichnis `/etc/rcn.d` (wobei n die Nummer des Run-Levels ist). Dort befinden sich die Startdateien für diesen Run-Level. Das Script `/etc/rcn` (wieder ist n der Run-Level) ist für jeden Run-Level gleich und führt nacheinander alle Dateien im zum Run-Level gehörenden Unterverzeichnis aus.

Per Konvention haben alle Dateien im Unterverzeichnis entweder den Namen KxyNAME oder SxyNAME. Eine K-Datei dient dazu, irgendeinen Dienst beim Betreten des Run-Levels zu stoppen, eine S-Datei dient dazu, einen Dienst zu starten. Die Ziffern xy laufen von 00 bis 99 durch und dienen dazu, eine alphabethische Reihenfolge der Script zu definieren: Das Script führt die einzelnen Module in der Reihenfolge K00 bis K99 und dann S00 bis S99 aus. Es ruft K-Scripte mit dem Parameter `stop` auf, S-Scripte werden mit dem Parameter `start` aufgerufen. Der Bestandteil NAME dient zur Identifikation des Scriptes und bezeichnet das Subsystem, das durch das Script gestartet oder gestoppt wird.

Ein Programmpaket kann bei dieser Konstruktion ganz leicht eingefügt werden. Nehmen wir an, ein hypothetischer FAX-Server `kfax` braucht beim Systemstart einige Anweisungen, um einen Dämon-Prozeß zu starten und ein wenig aufzuräumen. Das Installationspaket könnte eine Datei mit den benötigten Anweisungen erzeugen und sie als `/etc/init.d/kfax` in einem Sammelverzeichnis für alle Startscripte installieren. Das Modul soll beim Betreten von Run-Level 5 getstartet werden. Also erzeugt die Installationsprozedur ein Symlink von `/etc/rc5.d/S99kfax` nach `/etc/init.d/kfax`. Die Installation braucht also nur eine Datei zu erzeugen und ein Link zu legen, um ihr Modul in die rc-Scripte zu integrieren. Soll das Script in mehr als einem Run-Level aktiviert werden, wird es auch von den anderen `/etc/rcn.d`-Verzeichnissen nach `/etc/init.d` gelinkt. Lesen und Verstehen von `rc.local` oder anderen Scripten ist nicht notwendig. Die Deinstallationsanweisung ist genauso simpel: "Löschen Sie die Datei `/etc/rc5.d/S99kfax` und starten Sie das System neu."

Beim Wechsel in den Run-Level 5 wird unser Beispielsystem das Script `/etc/rc5` durch einen once-Eintrag aktivieren. Das Script geht alle Dateien in `/etc/rc5.d` durch und führt sie der Reihe nach aus. Es wird zunächst alle `/etc/rc.d/K*`-Dateien mit dem Parameter `stop` aufrufen, danach wird es alle `/etc/rc.d/S*`-Dateien mit dem Parameter `start` aufrufen. Ganz am Schluss wird `S99kfax start` ausgeführt.

Das folgende Listing zeigt den inittab-Eintrag und ein Listing von `/etc/rc5`.

## System V Startscript `/etc/rc5`

Der Eintrag in der `/etc/inittab`:

```
r5:5:once:/etc/rc5
```
Das zugehörige Script:

```bash
# /bin/sh --

#	Das Script wird ausgefuehrt, wenn das System in den 
#	Run-Level 5 wechselt.
#
#	Fuer die anderen Run-Levels sollten 
#   analoge Eintraege und Scripte existieren.

PATH=/bin:/sbin:/usr/sbin:/usr/bin
if [ -d /etc/rc5.d ]
then
	# Ausfuehren der Stopscripte
	MODE=stop
	for f in /etc/rc5.d/K*
	do
		if [ -x ${f} ]
		then
			/sbin/sh ${f} stop
		else
			. ${f}
		fi
	done
	
	# Ausfuehren der Startscripte
	MODE=start
	for f in /etc/rc3.d/S*
	do
		if [ -x ${f} ]
		then
			/sbin/sh ${f} start
		else
			. ${f}
		fi
        done
fi
```

## Slackware inittab

```
#
# inittab       This file describes how the INIT process should set up
#               the system in a certain Run-Level.
#
# Version:      @(#)inittab             2.04    17/05/93        MvS
#
# Author:       Miquel van Smoorenburg, <miquels@drinkel.nl.mugnet.org>
#
# Default runlevel.
id:5:initdefault:

# System initialization (runs when system boots).
si:S:sysinit:/etc/rc.d/rc.S

# Script to run when going single user.
su:S:wait:/etc/rc.d/rc.K

# Script to run when going multi user.
rc:123456:wait:/etc/rc.d/rc.M

# What to do at the "Three Finger Salute".
ca::ctrlaltdel:/sbin/shutdown -t3 -rf now

# What to do when power fails (shutdown to single user).
pf::powerfail:/sbin/shutdown -f +5 "THE POWER IS FAILING"

# If power is back before shutdown, cancel the running shutdown.
pg:0123456:powerokwait:/sbin/shutdown -c "THE POWER IS BACK"

# If power comes back in single user mode, return to multi user mode.
ps:S:powerokwait:/sbin/init 5

# The getties in multi user mode on consoles an serial lines.
#
# NOTE NOTE NOTE adjust this to your getty or you will not be
#                able to login !!
#
# Note: for 'agetty' you use linespeed, line.
# for 'getty_ps' you use line, linespeed and also use 'gettydefs'
#c1:12345:respawn:/sbin/agetty 38400 tty1
c2:12345:respawn:/sbin/agetty 38400 tty2
c3:12345:respawn:/sbin/agetty 38400 tty3
c4:45:respawn:/sbin/agetty 38400 tty4
c5:45:respawn:/sbin/agetty 38400 tty5
c6:456:respawn:/sbin/agetty 38400 tty6

# nn
nn:23456:respawn:/usr/lib/nn/nnmaster -f -l -r -C

# Serial lines
#s1:45:respawn:/sbin/agetty 19200 ttyS0
#s2:45:respawn:/sbin/agetty 19200 ttyS1

# Dialup lines
#d1:45:respawn:/sbin/agetty -mt60 38400,19200,9600,2400,1200 ttyS0
#d2:45:respawn:/sbin/agetty -mt60 38400,19200,9600,2400,1200 ttyS1

# Runlevel 6 used to be for an X-window only system, until we discovered
# that it throws init into a loop that keeps your load avg at least 1 all 
# the time. Thus, there is now one getty opened on tty6. Hopefully no one
# will notice. ;^)
# It might not be bad to have one text console anyway, in case something 
# happens to X.
x1:6:wait:/etc/rc.d/rc.6

# End of /etc/inittab
```

## Das Action Feld in der `/etc/inittab` 


Das Feld `action` in der `inittab` bestimmt, wie `init` mit dem im Feld **process** genannten Prozeß verfährt. `sysvinit` kennt dieselben Schlüsselworte wie ein richtiger `init` eines originalen System V UNIX plus einige eigene Schlüsselworte, die spezifisch für Linux sind.


### Start und Restart von Prozessen

off:
: Zeilen, die als `off` gekennzeichnet sind, sind inaktiv. Dies stellt eine gute Methode dar, um Einträge in der `inittab` vorübergehend außer Betrieb zu nehmen. Natürlich könnte man sie auch in Kommentarzeilen verwandeln, indem man an den Anfang der Zeile ein "#" setzt.

respawn:
: Dies ist der häufigste Eintrag, wie er für `getty`s und für Dämon-Prozesse verwendet wird, die automatisch neu gestartet werden sollen. Wenn sich ein so gekennzeichneter Eintrag beendet, versucht `init` den Prozeß erneut zu starten. Kommt es dabei zu einer Endlosschleife (der Prozeß beendet sich aufgrund eines Fehlers sofort wieder, `init` startet ihn sofort wieder neu...), erkennt `init` dies und legt den Eintrag für einige Minuten mit der Meldung "process respawning too rapidly" still.

initdefault:
: Der `initdefault`-Eintrag hat in gewisser Weise eine Sonderrolle: Er spezifiziert keinen Prozeß, sondern sein `runlevel`-Feld gibt an, in welchen Run-Level sich das System beim Systemstart begeben soll. Fehlt dieser Eintrag, wird der gewünschte Run-Level beim Booten an der Console erfragt.

wait:
: Mit wait gekennzeichnete Prozesse werden von `init` einmal beim Betreten des Run-Levels gestartet. `init` wartet dann darauf, daß der entsprechende Prozeß sich wieder beendet, bevor der nächste Eintrag abgearbeitet wird. Da `init` die Einträge einer `inittab` von oben nach unten abarbeitet, kann man so eine kontrollierte Folge von Scripten beim Erreichen eines Run-Levels starten.

once:
: Mit `once` gekennzeichnete Prozesse werden von `init` einmal beim Betreten des Run-Levels gestartet. Im Gegensatz zur Aktion `wait` wartet `init` hier aber nicht auf das Ende des Prozesses, bevor der nächste Eintrag der `inittab` abgearbeitet wird. `once` wird normalerweise verwendet, um einen Dämon zu starten ohne in wie bei `respawn` bewachen zu lassen. Sollte der Dämon sich beenden, wird eben kein neuer Prozeß gestartet. In System V UNIX wird `once` verwendet, um die `/etc/rcn`-Scripte zu starten.

### Boot

Weil `init` als allererster Prozeß im System gestartet wird, muß es Einträge gegeben, die spezifizieren, wie das System ans Laufen gebracht wird. Bei diesen Einträgen wird das Feld **runlevels** ignoriert. Sie werden beim Start des Systems schlicht von oben nach unten abgearbeitet.

sysinit:
: Die ersten Prozesse der Bootphase werden durch die `sysinit`-Einträge bestimmt. Es handelt sich meistens um Scripte, deren Aufgabe es ist, die Platten zu checken und sie read-write anzumelden.

boot:
: Nach den `sysinit`-Scripten folgen dann die anderen Scripte der Bootphase.

bootwait:
: Bei `bootwait`-Einträgen wartet das System mit dem Starten des Folgeeintrags solange, bis der aktuelle Eintrag abgearbeitet ist. Bei `boot`-Einträgen wird dagegen nicht gewartet.

### Speziell für Linux

`sysvinit` von Linux hat außerdem noch einige Nichtstandard-Aktionen. Sie dienen hauptsächlich der Unterstützung von USVs und zumAbfangen der Tastenkombination Control-Alt-Delete.

ctrlaltdel:
: Bei diesem Eintrag wird das Feld **runlevels** ebenfalls ignoriert. Er wird aktiviert, wenn jemand an der Console die Tastenkombination Control-Alt-Delete gedrückt hat. Normalerweise wird man hier entweder das System herunterfahren oder in den single user mode wechseln.

powerwait:
powerfail:
: Einträge mit der Aktion `powerwait` oder `powerfail` werden aktiviert, wenn das System ein SIGPWR Signal erhält. Dies ist typischerweise ein Signal, das vom Kernel generiert wird, wenn die Stromversorgung des Systems zusammenbricht und die USV übernimmt. Bei `powerwait`-Einträgen wartet `init` wieder auf das Ende eines Eintrages, bevor der nächste abgearbeitet wird, während dies bei `powerfail`-Einträgen nicht geschieht.

powerokwait:
: Dieser Eintrag wird aktiviert, wenn ein SIGPWR auftritt und die Datei `/etc/powerstatus` das Wort OK enthält. Sollte die Stromversorgung wieder funktionieren, bevor das System sich auf Grund des ersten SIGPWR abgeschaltet hat, kann durch einen Eintrag hier die Abschaltung verhindert werden.

ondemand:
: Ein Eintrag mit der Bezeichnung ondemand funktioniert ähnlich wie ein Eintrag `once`. Während ein `once`-Eintrag jedoch nur beim Betreten eines Run-Levels aktiviert wird, wird ein `ondemand`-Eintrag auch dann aktiviert, wenn das System in den Run-Level wechseln soll, in dem es sich sowieso schon befindet.
