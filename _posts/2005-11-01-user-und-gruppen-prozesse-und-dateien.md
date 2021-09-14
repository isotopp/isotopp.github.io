---
layout: post
published: true
title: User und Gruppen, Prozesse und Dateien
author-id: isotopp
date: 2005-11-01 18:41:28 UTC
tags:
- computer
- erklaerbaer
- unix
- 'lang_de'
feature-img: assets/img/background/rijksmuseum.jpg
---
Heute im Irc stellte eine Teilnehmerin den folgenden Fragenschwall: 
> Wie finde ich eigentlich heraus, was für Gruppen es auf einem
> Linuxsystem gibt? Wie füge ich da jemanden hinzu? Lege ich den
> zuerst als User an, ganz normal? Und: Wenn ich einen Ordner
> anlege, der nur für eine bestimmte Gruppe zugänglich sein
> soll, mache ich das doch über File Permissions, oder habe ich
> falsch gedacht?

Die offensichtliche Antwort, das Nachsehen in `/etc/group`,
funktioniert bei modernen Unixen nicht mehr zwingend, denn
Gruppendefinitionen können nicht nur in lokalen Dateien stehen,
sondern auch aus dem NIS, dem NIS+, einem LDAP oder einem Active
Directory kommen.

Die folgenden Dinge wurden mit Suse Linux 10.0 getestet, sollten
so aber auch auf Solaris funktionieren.

## Name Service Switch

Genauer gesagt haben moderne Unixe ein Subsystem namens Name
Service Switch. Der Name Service Switch erlaubt es dem System,
für Benutzer, Gruppen, Hostnamen, Protokolle, Service und noch
ein paar Dinge beliebige Datenquellen zu verwenden, für die
vorgefertige Module existieren.

Der Name Service Switch wird durch die Datei
`/etc/nsswitch.conf` gesteuert. Dort findet man für jede
Datenbasis (passwd, group, hosts, ...) einen einzeiligen
Eintrag. Nach dem Namen der Datenbasis werden durch Leerzeichen
getrennt die Namen der Datenquellen aufgelistet, und zwar in der
Reihenfolge, in der sie durchsucht werden sollen.

```console
passwd: files nis
shadow: files nis
group: files nis
hosts: files dns
```

Diese Beispielkonfiguration holt ihre Benutzerdaten für Passwd-
und Shadow-Datei sowie die Gruppen aus den lokalen Dateien und
danach aus dem NIS, und sie ermittelt Hostnamen aus der lokalen
`/etc/hosts` und danach aus dem DNS.

Die Syntax für die `/etc/nsswitch.conf` ist noch ein wenig
komplizierter. Zwischen den Einträgen für Datenquellen können in
eckigen Klammern nämlich noch Anweisungen für das Verhalten in
Fehlerfällen stehen. Auf diese Weise sind Setups möglich, die
ihre Daten normalerweise NUR aus dem NIS ziehen, aber aus den
lokalen Dateien, falls das NIS einmal nicht erreichbar sein
sollte.

Die Datenbasen des Name Service Switch lassen sich mit dem
Kommando `getent` testen. `getent group` listet zum Beispiel die
gesamte `group`-Datenbasis auf, `getent group disk` listet nur
den Eintrag für die Gruppe `disk` auf.

Wir merken uns: 

> In einem modernen Unix mit Name Service Switch ist es also
> falsch, eine Liste der Gruppen des Systems durch Auslesen von
> `/etc/group` zu erzeugen. Stattdessen muß die Liste mit 
> `getent group` erzeugt werden.

Das Interface des Name Service Switch ist read-only. Es erlaubt
nicht die virtualisierte Erzeugung von Gruppen. Schreibzugriffe
müssen also weiterhin manuell in die richtige Datenbank geroutet
werden, also in eine lokale Datei oder in ein LDAP geschrieben
werden.

## Prozesse und Dateien

User und Gruppen sind nur dann von Bedeutung, wenn sie auch vom
Systemteilen verwendet werden. Systemteile sind Subjekte, also
Prozesse, und Objekte, also Dateien.

Ein Prozeß in Unix hat eine effektive User-ID und eine effektive
primäre Gruppen-ID. Er kann außerdem eine Reihe von weiteren
sekundären Gruppen-IDs enthalten.

Das Kommando "id" listet die User- und Gruppen-IDs eines Benutzers: 

```console
kris@dhcp-179:~> id -a
uid=1000(kris) gid=100(users) Gruppen=16(dialout),33(video),100(users)
```

Der Benutzer kris hat also die User-ID 1000 und die primäre
Gruppen-ID 100. Er gehört außerdem den Gruppen 16 (dialout) und
33 (video) an.

Wenn dieser Prozeß eine Datei erzeugt, dann gehört diese Datei
ebenfalls dem Benutzer 1000 (kris) und sie wird standardmäßig
("System V Semantik") der Gruppe 100 (users) angehören, denn
dies sind die primäre User- und Gruppen-ID dieses Prozesses.

Es gibt eine andere Betriebsart für Dateisysteme ("BSD Semantik"), bei der neu angelegte Dateien nicht die primäre Gruppe des anlegenden Prozesses erben, sondern die Gruppe des unmittelbar übergeordneten Verzeichnisses. Man kann das ext2-Dateisystem komplett auf BSD-Semantik umstellen, indem man es mit der Option "grpid" (alternativ "bsdgroups") mounted - der Default ist "nogrpid" (alternativ "sysvgroups"). In der Betriebsart "nogrpid" kann man für ein einzelnes Verzeichnis BSD Semantik wählen, indem man das SGID-Bit an dem Verzeichnis setzt. Hier ein Beispiel: 

```console
dhcp-179:~ # lvcreate -l 10 -n test system
Logical volume "test" created

dhcp-179:~ # mke2fs -q /dev/system/test
dhcp-179:~ # mount -o nogrpid /dev/mapper/system-test /export/test

dhcp-179:~ # mkdir /export/test/bla /export/test/fasel
dhcp-179:~ # chown kris:video /export/test/bla /export/test/fasel
dhcp-179:~ # chmod g+s /export/test/fasel

dhcp-179:~ # su - kris
kris@dhcp-179:~> cd /export/test

kris@dhcp-179:/export/test> touch bla/eins fasel/zwei
kris@dhcp-179:/export/test> ls -l bla/eins fasel/zwei
-rw-r--r-- 1 kris users 0 2005-11-01 18:59 bla/eins
-rw-r--r-- 1 kris video 0 2005-11-01 18:59 fasel/zwei

kris@dhcp-179:/export/test> ls -ld bla fasel
drwxr-xr-x 2 kris video 1024 2005-11-01 18:59 bla
drwxr-sr-x 2 kris video 1024 2005-11-01 18:59 fasel
```

In diesem Beispiel wird das logical Volume `test` in der Volume
Group `system` angelegt und mit dem ext2-Dateisystem formatiert.
Das Dateisystem wird mit der Option `nogrpid` als /export/test
gemountet, was der Default für ext2 ist (und bei reiserfs
unveränderlich immer der Fall ist).

In `/export/test` werden die Verzeichnisse `bla` und `fasel` anlegt
und beide auf `kris:video` gesetzt. An `fasel` wird zusätzlich noch
das SGID-Bit gesetzt.

Legt der User `kris:users` nun in `bla` und `fasel` jeweils eine Datei
an, wird die Datei in `bla` (System V Semantik, bzw. nogrpid) der
Gruppe users angehören. Die Datei in `fasel` (BSD Semantik, durch
+s umgeschaltet) erbt ihre Gruppenzugehörigkeit jedoch vom
übergeordneten Verzeichnis, gehört also `kris:video`.

Dasselbe Beispiel wie oben für ein Dateisystem, das mit `grpid`
gemountet wurde, ergibt dann das folgende Bild:

```console
kris@dhcp-179:/export/test> touch bla/eins fasel/zwei
kris@dhcp-179:/export/test> ls -ld bla fasel
drwxr-xr-x 2 kris video 1024 2005-11-01 19:04 bla
drwxr-sr-x 2 kris video 1024 2005-11-01 19:04 fasel

kris@dhcp-179:/export/test> ls -l bla/eins fasel/zwei
-rw-r--r-- 1 kris video 0 2005-11-01 19:04 bla/eins
-rw-r--r-- 1 kris video 0 2005-11-01 19:04 fasel/zwei
```

Das SGID-Bit am Verzeichnis hat dann also keine Wirkung mehr,
weil das Dateisystem an sich hier schon BSD-Semantik hat.

Reiserfs kennt die Optionen `grpid` und `nogrpid` nicht und
verhält sich immer wie ein ext2-Dateissystem mit `nogrpid`.

Wie kann man nun ein Verzeichnis einer Gruppe schenken? Nun, das
geht einfach mit chgrp:

```console
kris@dhcp-179:~> mkdir keks
kris@dhcp-179:~> chgrp video keks

kris@dhcp-179:~> chgrp disk keks
chgrp: Ändern der Gruppe für „keks“: Die Operation ist nicht erlaubt

kris@dhcp-179:~> chgrp users keks
```

Offenbar kann man ein Verzeichnis nur Gruppen schenken, denen
man selbst angehört. Das ist deswegen so, weil Unix die
Zuordnung von Quotas zu Benutzern und zu Gruppen erlaubt. Indem
man eine Datei einer Gruppe schenkt, belastet die Datei die
Quota der Gruppe und natürlich darf man nur die Quota einer
Gruppe belasten, der man auch angehört.

Wenn man eine Datei in einem Verzeichnis mit BSD-Semantik
anlegt, dann erbt diese Datei jedoch immer die Gruppe des
Verzeichnisses, selbst dann, wenn der Benutzer, der die Datei
anlegt, nicht dieser Gruppe angehört - hier kann dann ein
fremder Benutzer die Quota einer Gruppe belasten, der er nicht
angehört. Es ist also Aufgabe einer Gruppe, die Zugriffsrechte
an ihren Verzeichnissen so zu setzen, daß dort nicht fremde
Leute Daten ablegen können und so die Quota der Gruppe belasten.

Es ist außerdem möglich (wenn auch unwahrscheinlich), daß ein
Benutzer so eine Datei anlegen kann, die er später nicht mehr
lesen darf.

Das Szenario ist konstruiert, aber technisch möglich:

```console
## Kris legt ein Verzeichnis an

kris@dhcp-179:~> mkdir keks
kris@dhcp-179:~> chmod a+rwx,g+s keks
kris@dhcp-179:~> chgrp video keks
kris@dhcp-179:~> ls -ld keks
drwxrwsrwx 2 kris video 48 2005-11-01 19:17 keks

## kdebuild legt dort eine Datei an

kdebuild@dhcp-179:/home/kris/keks> umask 0727
kdebuild@dhcp-179:/home/kris/keks> touch bla
kdebuild@dhcp-179:/home/kris/keks> ls -l bla
----r----- 1 kdebuild video 0 2005-11-01 19:18 bla
kdebuild@dhcp-179:/home/kris/keks> cat bla
cat: bla: Keine Berechtigung
```

Das ist für ein Rechtesystem eine unschöne Situation. Fällt
jemandem ein sinnvoller Anwendungszweck für diese Eigenschaft
des Unix-Rechtesystems ein?

Wir merken uns: 

> Um ein Verzeichnis zu erzeugen, auf das nur eine bestimmte
> Gruppe Zugriff hat, legen wir das Verzeichnis an und schenken
> es der Gruppe mit `chgrp`, dann setzen wir die Zugriffsrechte
> auf `rwxrwx---` oder ähnlich. 
>
> Wenn wir außerdem das SGID-Bit am Verzeichnis mit `chmod g+s
> …` setzen, werden auch alle Dateien im Verzeichnis der
> Gruppe gehören. Um ein Verzeichnis einer Gruppe schenken zu
> können, muß man selbst Mitglied der Gruppe sein.

## Zugriffsrechte an Dateien 

In den letzten 30 Jahren war es in Unix immer so, daß eine Datei
einen Eigentümer und eine Eigentümer-Gruppe hatte. Rechte wurden
für den Eigentümer und die Eigentümer-Gruppe vergeben. Prozesse
hatten ebenfalls einen Eigentümer und eine Gruppe, und Unix hat
stur den folgenden simplen Test durchgeführt, um zu bestimmen,
welche Rechte für eine Datei gelten:

1. Stimmen der Datei-Eigentümer und der Prozeß-Eigentümer
überein? Wenn ja, dann gelten die User-Rechte, also das erste
rwx-Tripel. Das ist selbst dann der Fall, wenn in einem anderen
Tripel bessere Rechte definiert sind.
2. Stimmen die Datei-Eigentümergruppe und eine der primären oder
sekundären Gruppen eines Prozesses überein? Wenn ja, dann gelten
die Gruppen-Rechte, also das zweite rwx-Tripel. Das ist selbst
dann der Fall, wenn im 3. Tripel bessere Rechte definiert
sind.
3. In allen anderen Fällen gelten die Rechte aus dem 3. Tripel.

## Access Control Lists (ACLs)

Mit modernen Unixen ist es jedoch alles viel komplizierter
geworden, denn nun können im Prinzip an einer Datei selber auch
viele Benutzer- und Gruppenrechte kleben.

Zum Glück nicht per Default.

Damit die Lage kompliziert wird, muß man das betreffende
Dateisystem mit der Option `acl` mounten. Im Beispiel erzeugen
wir zur Abwechslung mal ein reiserfs und mounten dies mit der
passenden Option. Mit den Kommandos `getfacl` und `setfacl` ("get
and set a file access control list") können wir dann lustig
individuelle Zugriffsrechte vergeben.

```console
dhcp-179:~ # lvcreate -l 10 -n test system
Logical volume "test" created

dhcp-179:~ # mkreiserfs -q /dev/system/test
mkreiserfs 3.6.18 (2003 www.namesys.com)

dhcp-179:~ # mount -o acl /dev/mapper/system-test /export/test
dhcp-179:~ # cd /export/test

dhcp-179:/export/test # touch keks
dhcp-179:/export/test # chmod 000 keks
dhcp-179:/export/test # setfacl -m u:kris:rwx,mask::rwx,g:video:rwx,u:kdebuild:rx keks

dhcp-179:/export/test # ls -l keks
----rwx---+ 1 root root 0 Nov 1 19:26 keks

dhcp-179:/export/test # getfacl keks
# file: keks
# owner: root
# group: root
user::---
user:kris:rwx
user:kdebuild:r-x
group::---
group:video:rwx
mask::rwx
other::---
```

Eine Datei mit einer ACL wird von ls mit einem "+"-Zeichen
markiert. Statt den Rechten der Gruppe werden dann im  zweiten
Tripel die Rechte der Mask angezeigt. 

Die Mask limitiert alle anderen Zugriffsrechte an der Datei
ausgenommen den Eigentümer und Others. Sie legt also quasi die
maximalen Rechte fest, die irgendjemand außer dem Eigentümer an
der Datei haben kann, wenn er nicht die Defaultrechte bekommt.

Dies ist ein Kompatibilitätsmechanismus, der meistens das
korrekte Verhalten von Programmen bewirken soll, die nichts von
Zugriffsrechten wissen - sie bekommen durch Auslesen des zweiten
Rechtetripels einen etwas optimistischen View auf die Rechte,
die sie wahrscheinlich haben werden. :)

Das Kommando `setfacl` kann jetzt die Rechte an einer Datei
modifizieren. Die Option `-m` (modify) bewirkt das. 

Im Beispiel werden Rechte für Benutzer ("u:") und Gruppen ("g:")
sowie eine Mask ("m:") definiert. 

Liest man die ACL mit getfacl aus, wird recht schnell deutlich,
was hier geschieht: 

Der Eigentümer der Datei hat an ihr keine Rechte, der User kris
hat die Rechte rwx, der User kdebuild hat die Rechte rx, die
Defaultgruppe hat keine Rechte, die Gruppe video hat die Rechte
rwx, und die Maske schränkt die Rechte von kris, kdebuild, video
und der Defaultgruppe nicht ein. 

Der Rest der Welt hat keine Rechte an dieser Datei.

Wir merken uns: 

> Dateisysteme, die mit der Option "acl" gemounted wurden,
> können beliebig komplizierte Rechteregeln pro Datei haben. Es
> ist mit einem "+" an der Datei zu erkennen, ob dies der Fall
> ist. Diese ACLs können mit setfacl editiert und mit getfacl
> gelesen werden.


## ACLs an Verzeichnissen

Um die Sache noch komplizierter zu machen, haben Verzeichnisse
_zwei_ ACLs: 

- Eine normale wie wir sie schon kennen, die für das Verzeichnis
  selber gilt, 
- eine _default_ ACL, die für alle Verzeichnisse
  und Dateien gilt, die in dem Verzeichnis erzeugt werden. 

Werte für die Default-ACL werden festgelegt, indem man sie beim
"setfacl" mit "d:" prefixed, also "d:u:kris:rwx",
"d:g:video:rwx" und "d:m::rwx".

## TL;DR

Wir merken uns: 

> In den allermeisten Fällen tut das Unix-Rechtesystem mit den
> drei Tripeln "ugo" und den drei Rechten "rwx" genau das, was
> man von ihm will. 
>
> Sehr selten braucht man was komplizierteres, und dann steht es
> zur Verfügung. 
>
> Selbst dann ist das Rechtesystem von Unix noch einfacher und
> übersichtlicher zu warten als das von Windows, getreu dem
> Motto "Simple things should be simple, and complex things
> should be possible."
