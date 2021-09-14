---
layout: post
published: true
title: Ein komplett überflüssiger Artikel
author-id: isotopp
date: 2004-09-16 17:21:23 UTC
tags:
- security
- lang_de
feature-img: assets/img/background/rijksmuseum.jpg
---
Diesen Artikel sollte ich eigentlich gar nicht mehr schreiben müssen. Er basiert auf alten Dokumenten, die ich für eine Folge von Consultingjobs in den Jahren 1993, 1994 und 1995 verfaßt habe, und den Erfahrungen mit einer Redhat Enterprise 2.3-Installation mit den HP/Compaq-Packages, die ich heute habe machen dürfen. Ich bin sehr, sehr deprimiert.

Aber von vorne: Da ist nun also ein neuer Server, nicht unser Standardsystem, sondern etwas anderes, und es befindet sich außer dem Betriebssystem bislang nur ein Sortiment Treiber und Monitoring auf der Kiste. Eine gute Gelegenheit, besagte Betriebssysteminstallation einmal genauer unter die Lupe zu nehmen.

Es gibt eine Reihe von schnellen Routine-Handgriffen, die man auch ganz ohne "Security-Scanner" einmal durchgehen kann, um sich einen Überblick über die Kiste zu verschaffen. Diese Handgriffe sind wohlbekannt, und uralt. Jeder Entwickler und Admin sollte sie kennen und einige Male gemacht haben. Aus irgendeinem Grunde werden sie auch 2004, zehn Jahre nachdem ich sie zum ersten Mal für Geld gemacht habe, von den entscheidenden Leuten immer noch nicht gemacht. Oder wenn doch, werden die Ergebnisse ignoriert.

### World Writeable Anything

`find / \! -type l -perm -0002 -ls > /tmp/world-writeable-files.kris` ist ein guter Ansatzpunkt, um einmal zu sehen, was auf der Kiste denn so wirklich ganz kaputt ist. Dieser Aufruf spuckt eine ganze Reihe von `/dev`-Dateien aus, einige Verzeichnisse und einige Dateien außerhalb von `/dev`. 

Für die `/dev`-Dateien muß man sicherstellen, daß für diese Devices auch ein Treiber vorhanden ist. Danach sollte man alle Nonstandard-Devicetreiber einmal abklopfen, um zu sehen, was man für fiese Dinge mit ihnen machen kann, wenn man Schreibzugriff auf die hat. 

Manchmal findet man `/dev`-Dateien mit kaputten Permissions, auf denen man lustig ioctl(2) spielen kann.

Wenn Verzeichnisse in der Liste sind, die world-writeable sind, dann verdienen diese besondere Beachtung. Handelt es sich um `/tmp`, `/var/tmp`, `/var/spool/uucppublic` oder incoming-Verzeichnisse, sollte man kontrollieren, ob die Permissions *1*777 sind - die Permissions 0777 sind bei solchen Verzeichnissen fast immer falsch. Das gesetzte t-Bit an dem Verzeichnis stellt sicher, daß nur der Eigentümer einer Datei, der Eigentümer des Verzeichnisses oder der Systemverwalter Daten löschen können. Ohne t-Bit kann jeder in dem Verzeichnis jede Datei löschen - das ist meiner Erfahrung nach niemals das gewünschte Verhalten.

Writeable Home-Verzeichnisse sind immer eine willkommene Gelegenheit, um sich an den Punkt-Dateien des Users in diesem Home zu schaffen zu machen. Ein `cp /usr/bin/bash /tmp/...; chmod a+s /tmp/...` in der `.bashrc` eines Benutzers und schon hat man nach dem nächsten Login des Users eine bash, die SUID dieser User läuft, und das ist noch eine der harmloseren Aktionen.

Writeable Directories in `/dev`, wie sie auf einigen Maschinen durch das Logical Volume Management hinterlassen werden, sind ganz schlecht. Jedermann kann dann mit einem einfach "rm" die Devicedateien für die Platten des Systems abräumen - bei nächsten Reboot gibt es dann lange Gesichter.

Writeable Directories die im Pfad liegen - am besten noch im Suchpfad von root! - sind sowieso ein Instant Exploit und eine ganz üble Idee. Vor zehn Jahren hat ein Install von NetView auf einer RS 6000 `/usr/bin` grundsätzlich 777 hinterlassen, und auf einer HP war damals `/usr/local/bin` im Pfad und grundsätzlich 777. Und auch heute noch findet man öfter als nicht `/home/oracle/ora-env.sh` mit `o+w`-Rechten oder vergleichbare Scripte, wenn man sich die Mühe macht, danach zu suchen.

### Zugriffsrechte an Gerätedateien

Eine Zeit lang gab es Unices, die die Gerätedateien von Bandlaufwerken world-readable hinterlassen haben. Wenn dann noch das Backup-Band vor oder nach dem Backup im Gerät steckt, kann sich also jeder Benutzer des Systems an diesem Band bedienen und nach Wunsch Dateien recovern, ganz egal wie die Rechte an der Datei im System einmal waren.

Auch viele andere Dateien sind bei älteren Unix-Installationen nachlässig gesetzt, und wenn man auf eine neue, einem unbekannte Installation kommt, lohnt es sich, die Permissions solcher Geräte einmal durchzugehen und nachzusehen, ob man sich nicht irgendwo belustigen kann.

#### umask

`umask` ist nur ein Handgriff, aber ein wichtiger Handgriff, wie einem jeder Systemadministrator bestätigen kann, der einmal in seinem Leben mit HP/UX in Kontakt gekommen ist. Ältere Versionen von HP/UX haben beim Booten mit der umask 0 gestartet und daher wurden während des Bootvorgangs (und während der Installation!) jede Menge Dateien angelegt, die einfach zu große Permissions haben.

In HP/UX hatte dieses kleine Versäumnis sehr weitreichende Folgen: 666 auf den Dateien des Syslogs, 777 auf `/usr/local/bin` und 777 auf den Directories, die das LVM für die LVM-Devices angelegt hat. Die Folgefehler ziehen sich durch die ganze Installation und es ist eine Heidenarbeit, zu entscheiden, welche Permissions man gefahrlos korrigieren kann und wo man sich vielleicht selber aus dem System aussperrt.

#### Systemlimits

Wenn man schon dabei ist, kann man auch gleich die anderen Systemlimits kontrollieren: `limit` bzw. `ulimit` sagen dem interessierten Systemtester gleich, wo seine Grenzen sind, und ob es z.B. Coredumps geben wird. In Solaris will man sich außerdem noch "coreadm" ansehen.

#### SUID, SGID

Mit einer Variation des oben gezeigten Find-Kommandos findet man auch schnell SUID- und SGID-Programme, die mit dem System gekommen sind:

`find / \! -type l -perm -4000 -ls > /tmp/suid-files.kris` und `find / \! -type l -perm -2000 -ls > /tmp/sgid-files.kris` sind zwei Listen von Dateien, die intensiver Aufmerksamkeit bedürfen. Betriebssystemhersteller haben die Angewohnheit, selbstgeschriebene privilegierte Programme sehr nachlässig zu schreiben. 

Oft haben diese Programme Optionen, mit denen man eine Ausgabe in eine Datei leiten kann (a la `-l <protokolldatei>`). Die Chancen sind gut, daß dieses Programm "vergißt" seine Privilegien aufzugeben, bevor es diese Datei zum Schreiben öffnet. Ein `-l /etc/passwd` kann dann lustige Effekte erzielen. 

Andere Hersteller erlauben solchen Programmen möglicherweise, Umgebungsvariablen auszuwerten oder Shells zu starten, um kurze Shellfragmente aufzurufen - ein `strings` auf solche SUID- oder SGID-Binaries ist meistens sehr erhellend. Sieht man in einem SUID-root Binary strings-Output wie

```bash
#! /bin/sh
path="`which %s`"
if [ -z "$path" ]
then
  for i in /bin /usr/bin /sbin /usr/bin %s/bin /usr/local/bin
  do
    if [ -x "$i/%s" ]
    then
      echo "$i/%s"
      exit 0
    fi
  done
else
  echo $path
  exit 0
fi
exit 1
```

dann ist es Zeit, den Stahlhelm aufzusetzen und die Gräben zu bemannen. Wen juckt es nicht beim Anblick solcher Zeilen, herauszufinden, woher %s kommt und wie man dort einige Anführungszeichen und Semikoli reinschmuggeln könnte?

Aber auch alle Zeilen in der Nähe und Umgebung des Suchstrings PATH sind interessant und können oft zu Hinweisen führen, die lustige Effekte erlauben.

Namen von externen Programmen, die unser privilegiertes Herstellertool aufruft, sich auch lustig. Wird ein Mailer gestartet? Werden vor dem Starten des Mailers Privilegien gedroppt? Meist nicht. Kann man das Subject der Mail beeinflussen, oder wird der vom Benutzer eingestellte Betreff 1:1 an das `mailx -s %s` durchgereicht? Dergleichen Spielereien gibt es viele, und alleine der persönliche Grad der Perversion setzt dem interessierten Spielkind hier noch Grenzen.

Manche Programme mit Privilegien legen auch an einer vorhersagbaren Stelle im Dateisystem Dateien an - `/tmp/<name der Logdatei>`, `$HOME/.<statusdatei>` und was dergleichen an Standardstellen mehr existiert. Ein `strace -e open` als Root auf das zu untersuchende Kommando ist dabei des Admins Freund. Danach sollte man das Programm noch einmal aufrufen, aber als User, und dabei zuvor Symlinks angelegt haben, die von der vorhergesagten Stelle im Dateisystem nach `/tmp/gotcha` zeigen. Existiert nach dem Aufruf `/tmp/gotcha` und hat die so erzeugte Datei die Rechte des privilegierten Users, hat das Herstellertool ein Problem. Wie leicht hätte das Symlink nach `/etc/shadow` zeigen können und beim Aufruf aus Versehen die Paßwortdatenbank wegschießen können?

#### Netzwerkaktivität

`lsof -i -n -P > /tmp/open-ports-and-programs.kris` generiert eine Liste von Programmen mit offenen Netzwerkports auf der neuen Kiste. Unsere persönlichen Freunde sind dabei Dinge wie WBEM-Server - angeblich "Web Based Enterprise Management", aber im Grunde handelt es sich eher um Schnellrootungszugänge. Gerade HP tut sich dabei ganz besonders hervor, indem diese Firma etwa kaputte SUID-root Binaries mit unsicheren, in PHP geschriebenen WBEM-Oberflächen ausstattet: Nicht nur explodiert das SUID-Root Binary selbst bei noch nahezu bestimmungsgemäßen Gebrauch mit einer einem SIGSEGV - schon mal sehr vertrauenerweckend -, sondern es zeigt auch sonst alle Merkmale eines exploitbaren Stück Software. So stammt ein Shell-Fragment ähnlich der oben gezeigten for-Schleife aus dem Strings-Output eines HP WBEM-Binaries.

Solche Binaries ruft HP jetzt im Kontext eines WBEM-Webservers auf, der in PHP geschrieben worden ist. Der HP-PHP-Code (HPHP?) verletzt dabei in gerade zu vorbildlicher Weise alle Richtlinien für sichere Webanwendungen, wie sie z.B. 
[Chris Shiflett in seinen PHP-Security Talks](http://shiflett.org/talks/oscon2004/php-security) demonstriert hat. Schon bei oberflächlicher Durchsicht fallen einem Konstrukte entgegen wie

```php
$path = $_SERVER["HTTP_ANWENDUNGSNAME"];
$cmd = sprintf("/path/zum/privilegierten/binary/additional/data/$path";
```

oder ungeprüfte Übernahme von Daten aus `$_GET`, `$_POST`, `$_COOKIE` oder `$_SERVER["HTTP_*"]`-Variablen. Selbst ohne privilegiertes Binary ist diese PHP-Anwendung ein guter Einstieg in das System.

Neben WBEM ist auch der Portmapper und die von ihm gestarteten Anwendungen sowie der inetd ein Quell der Freude. Gerade Solaris-Maschinen sind bekannt dafür, daß sie hier einen ganze Strauß unnötiger Dienste starten, von denen mehr als die Hälfte bereits ein- oder mehrmals Anlaß der Vergabe von CAN- oder CVE-Nummern gewesen ist.

Schließlich ist bei vielen Maschinen nach der Installation auch ein SNMP-Daemon aktiv, und häufiger als nicht redet dieser auf Nachfrage mit jedem und gibt so wertvolle Systeminformation preis. In Zusammenarbeit mit WBEM hat man sogar eine gewisse Chance, daß der SNMP-Daemon nicht nur Read-Aufrufe, sondern auch Writes verarbeitet. Eine saubere Konfiguration, die Prüfung der Security und die Einschränkung auf Adressen aus dem Managementnetz sind hier zentral für das Überlegen der Maschine.

Ein schnelles Abspulen dieser Dinge auf einer neuen Installation sollte einem erfahrenen Systemadministrator ausreichend Anhaltspunkte geben, um ihn problemlos für einige Tage schlecht schlafen zu lassen.
