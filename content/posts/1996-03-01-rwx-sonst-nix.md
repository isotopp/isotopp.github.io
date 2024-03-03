---
author: isotopp
date: "1996-03-01T09:00:00Z"
feature-img: assets/img/background/rijksmuseum.jpg
published: true
title: "rwx - sonst nix?"
tags:
- lang_de
- publication
- unix
---

**aus "Linux Magazin", Ausgabe 3/96.**

# rwx - sonst nix?

In jedem Buch über UNIX wird das UNIX-Rechtesystem ungefähr in Kapitel 2 vollständig erläutert und es bleiben keine Frage mehr offen.
Wieso also ein Artikel über Zugriffsrechte?
Nun, dieser Artikel erklärt Zugriffsrechte für Leute, die es ganz genau wissen wollen:
Welche Rechte werden für den Zugriff auf eine Datei benötigt?
Wer prüft die Rechte und wie passiert das?

Wie oft hört man Redewendungen wie "Ich öffne jetzt einmal diese Datei..." oder "Ich habe keine Zugriffsrechte, um auf dieses Verzeichnis zuzugreifen."
Solche Formulierungen sind zwar üblich und auch jedermann verständlich, weil sie so schön bildhaft sind.
Aber wenn man über Zugriffsrechte reden möchte, sind sie eher schädlich als hilfreich.

Natürlich öffnet ein User niemals eine Datei oder greift auf ein Verzeichnis zu.
Prozesse tätigen Systemaufrufe und der Kernel öffnet Dateien oder liest Verzeichnisse im Auftrag und mit den Rechten dieses Prozesses.
Solche Unterscheidungen sind auf den ersten Blick Haarspaltereien.
Aber wenn man sich den Spaß macht und die Sache einmal zu Ende verfolgt, wird man feststellen, daß sich auf diese Weise einige Dinge besser verstehen und leichter erklären lassen. 
Der Autor will sich also in  diesem Artikel einer besonders genauen Sprache befleißigen.

## Woher kommen Zugriffsrechte?

Zugriffsrechte und Eigentümer sind etwas, das einem zunächst an Dateien ins Auge fällt.
Eine Datei besteht in Linux aus einem Haufen Blöcken auf der Festplatte und einer Verwaltungsstruktur, der I-Node.
Während die Blöcke die eigentliche Information in der Datei speichern, findet man in der I-Node fast alle Information *über* die Datei - also Metainformation.
Was die Rechte betrifft, findet man in der I-Node eine User-ID (UID), eine Group-ID (GID) und zwölf Rechtebits:
Drei Bits mit den Bezeichnungen `sst` und dann jeweils drei Dreiergruppen `rwx`.
`sst` sind gewissermaßen Allzweckbits, die je nach Typ der Datei und Systemaufruf unterschiedliche Bedeutung haben können.
Die Auswertung der übrigen neun Bits erfolgt dagegen relativ zentral in einer Funktion `permission()`, auf die wir weiter unten eingehen werden.

Was dem UNIX-Neuling noch auffallen wird, ist die Tatsache, daß sich in der I-Node der Datei nicht der Username und der Gruppenname findet, sondern nur jeweils eine ID.
Diese ID-Nummern werden vom ls-Kommando in Namen umgewandelt, falls man es ihm nicht verbietet.
Man kann das ls-Kommando zwingen, die Angaben numerisch zu machen, indem man die Option `-n` verwendet oder indem man dem Benutzer, der ls aufruft, den Lesezugriff auf /etc/passwd und /etc/group verweigert ([Experiment 1](#experiment-1)).

<hr />

## Experiment 1

```console
root@white:~# ls -l /etc/passwd /etc/group
-rw-r--r--   1 root     root          281 Jul 15 14:39 /etc/group
-rw-r--r--   1 root     root         1163 Nov 28 15:30 /etc/passwd
root@white:~# chmod 000 /etc/passwd /etc/group
root@white:~# su - kris
kris@white:~$ ls -l /tmp
-rw-r--r--   1 0        0               5 Nov 23 13:36 lall
-rw-rw-rw-   1 60000    20             11 Nov 28 21:32 lpq.00002b98
drwxr-xr-x   2 0        0            1024 Nov 17 07:31 root
kris@white:~$ exit
root@white:~# chmod 644 /etc/passwd /etc/group
root@white:~# ls -l /tmp
-rw-r--r--   1 root     root            5 Nov 23 13:36 lall
-rw-rw-rw-   1 smbguest users          11 Nov 28 21:32 lpq.00002b98
drwxr-xr-x   2 root     root         1024 Nov 17 07:31 root
```

Indem man kris die Leserechte auf die Dateien `/etc/passwd` und `/etc/group` entzieht, kann man demonstrieren, daß in einer I-Node nur numerische Information über Eigentümer und Gruppe einer Datei gespeichert wird.
ls kann diese Zahlen durch Zugriff auf die Paßwortdatenbank in Namen übersetzen.
Dazu existiert eine Familie von Bibliotheksfunktionen, die in `getpwent(3)`, `getpwuid(3)`, `getgrent(3)` und `getgrgid(3)` dokumentiert ist.

<hr />

Zugriffe auf Dateien erfolgen durch den Kernel im Auftrag eines Prozesses.
Der Kernel entscheidet anhand der Rechtebits in der Inode der Datei einer Datei, ob er den Zugriff auf die Datei ausführen wird oder nicht.
Entscheidend für die Interpretation dieser Rechtebits ist noch, mit welcher UID und GID der Prozeß abläuft, der auf die Datei zugreifen möchte.
Wie man in `/usr/include/linux/sched.h` nachlesen kann, hat ein `struct task_struct` in Linux die Felder

```console
	#define NGROUPS 32

	unsigned short uid,euid,suid,fsuid;
	unsigned short gid,egid,sgid,fsgid;
	int     groups[NGROUPS];
```

Linux unterscheidet sich hier von einem normalen UNIX:
Für Zugriffe auf Dateien sind die Felder `fsuid`, `fsgid` und `groups[]` relevant, während ein normales UNIX `euid` und `egid` verwendet.
Natürlich unterscheidet sich Linux nicht so sehr von einem normalen UNIX, daß es inkompatibel wäre:
Normalerweise ist die `fsuid/fsgid` mit der `euid/egid` des Prozesses identisch.
Die Zugriffe auf Dateien erfolgen also mit der sogenannten effektiven User-ID und Group-ID eines Prozesses.

[Kasten 2](#experiment-2) zeigt, wie man feststellen kann, unter welchen IDs Zugriffe erfolgen.

<hr />

## Experiment 2

```console
kris@white:~$ id
uid=100(kris) gid=20(users) groups=20(users),11(floppy)
kris@white:~$ su -
Password:
root@white:~# id
uid=0(root) gid=0(root) groups=0(root),1(bin),2(daemon),3(sys),4(adm),6(disk),10(wheel),11(floppy)
root@white:~# exit
kris@white:~$ id marit
uid=101(marit) gid=20(users) groups=11(floppy)
kris@white:~$ ls -l /tmp/bash
-rwsr-xr-x   1 root     root       295940 Nov 29 12:07 /tmp/bash
kris@white:~$ /tmp/bash
kris@white:~# id
uid=100(kris) gid=20(users) euid=0(root) groups=20(users),11(floppy)
```

Jemand, der als `kris` eingeloggt ist, greift normalerweise mit der UID 100, der GID 20 und den Einträgen 20 und 11 im Feld `groups[]` auf Dateien zu.
Ein Systemverwalter dagegen hat die UID und die GID 0 und noch weitere Einträge im Feld `groups[]`.
Mit einem Usernamen als Parameter kann man auch die IDs anderer Benutzer abfragen.

*Effektive* und *reale* UID und GID müssen nicht immer übereinstimmen:
Werden Programme mit gesetztem *Set User ID*-Bit ausgeführt, kann sich die effektive UID eines Prozesses ändern - was *set user id* genau ist und was das Bit bewirkt, werden wir später noch klären.

<hr />

Wir halten fest:
Dateien haben genau einen Eigentümer und gehören zu genau einer Gruppe, während ein Prozeß einen Eigentümer hat, aber zu bis zu 32 Gruppen gehören kann.
Zugriffsrechte werden an Dateien in 12 Bit vermerkt.
Die Interpretation dieser 12 Bit hängt ab vom Typ der Datei und von der Identität des zugreifenden Prozesses.

## Wo werden die Rechte geprüft?

Linux prüft Zugriffsrechte mit Hilfe der Funktion `permission()`.
Sie ist in `/usr/src/linux/fs/namei.c` in den Zeilen 91 bis 114 definiert.
Ein Parameter von `permission()` ist ein Zeiger auf die I-Node der Datei, auf die zugegriffen wird.
Außerdem muß der Funktion noch gesagt werden, welche Art von Zugriff auf die Datei gewünscht wird.
`/usr/include/linux/fs.h` definiert dazu in den Zeilen 35 bis 37 die Werte MAY_EXEC, MAY_WRITE und MAY_READ, die zu einer mask zusammengebaut werden können.
Der [Kasten](#experiment-3) zeigt den Quelltext von `permission()` und die Definitionen aus `fs.h`.

<hr />

## Experiment 3

```console
/usr/src/linux/fs/namei.c:
    91  /*
    92   *      permission()
    93   *
    94   * is used to check for read/write/execute permissions on a file.
    95   * We use "fsuid" for this, letting us set arbitrary permissions
    96   * for filesystem access without changing the "normal" uids which
    97   * are used for other things..
    98   */
    99  int permission(struct inode * inode,int mask)
   100  {
   101          int mode = inode->i_mode;
   102  
   103          if (inode->i_op && inode->i_op->permission)
   104                  return inode->i_op->permission(inode, mask);
   105          else if ((mask & S_IWOTH) && IS_IMMUTABLE(inode))
   106                  return -EACCES; /* Nobody gets write access
                        to an immutable file */
   107          else if (current->fsuid == inode->i_uid)
   108                  mode >>= 6;
   109          else if (in_group_p(inode->i_gid))
   110                  mode >>= 3;
   111          if (((mode & mask & 0007) == mask) || fsuser())
   112                  return 0;
   113          return -EACCES;
   114  }

/usr/include/linux/kernel.h:
    68  #define fsuser() (current->fsuid == 0)

/usr/include/linux/fs.h:
    35  #define MAY_EXEC 1
    36  #define MAY_WRITE 2
    37  #define MAY_READ 4
```

Die Funktion `permission()` ist der zentrale Kontrollpunkt für Zugriffsrechte.
An ihr kann man sehen, nach welchem Verfahren Linux die Zugriffsrechte prüft.

<hr />

Der Algorithmus, nach dem `permission()` die Zugriffsrechte prüft, ist sehr einfach:
Zunächst einmal (Zeile 103-104) wird festgestellt, ob für die zu prüfende I-Node im Feld `i_op->permission()` der I-Node Struktur eine dateisystemspezifische `permission()`-Routine definiert ist.
Auf diese Weise können Dateisysteme, die erweiterte oder von UNIX verschiedene Zugriffsrechte implementieren, ihre eigene Routine zum Testen des Zugriffs bereitstellen.
Derzeit (Kernel 1.2.13) tut dies nur das ext2-Dateisystem mit der Funktion `ext2_permission()`, die in `/usr/src/linux/fs/ext2/acl.c` definiert ist (und die in Kernel 1.2.13 nichts anderes tut als Zeilen 107-113 der normalen `permission()`-Funktion, also noch vollkommen sinnlos ist).

Die Zeilen 105-106 prüfen dann, ob die Datei als immutable file (unveränderliche Datei) gekennzeichnet ist.
Wenn dies der Fall ist und in mask MAY_WRITE gesetzt ist, wird der Zugriff auf die Datei verweigert und der Fehler permission denied (EACCES) zurückgegeben.
Der Code verwendet in Zeile 105 seltsamerweise die Definition S_IWOTH (das Schreibrecht für other aus der Includedatei `linux/stat.h`) anstatt korrekterweise die Definition MAY_WRITE zu verwenden.
Da aber beide Definitionen den Wert 2 haben, kommt es nicht zu einem Fehler.
Da das ext2-Dateisystem eine eigene `permission()`-Routine bereitstellt, die den Test auf immutable files nicht enthält, kann man dort unveränderliche Dateien beschreiben. 
Das ist ein Fehler, denn an anderen Stellen kennt das ext2-Dateisystemen `IS_IMMUTABLE()` und nimmt Rücksicht darauf.

Der entscheidende Code befindet sich dann in den Zeilen 107-113:
`current` bezeichnet den `struct task` des aktuellen Prozesses, also desjenigen Prozesses, der soeben versucht hat, auf eine Datei zuzugreifen und dessen Zugriffsrechte jetzt geprüft werden müssen.
Falls die `fsuid` dieses Prozesses mit der `i_uid` der Datei übereinstimmen, werden die Zugriffsrechte des linken `rwx`-Tripels der Datei für die Rechteprüfung verwendet (Zeilen 107 und 108).
Andernfalls prüft Linux mit der Funktion `in_group_p()`, ob irgendeine GID des aktuellen Prozesses mit der `i_gid` der Datei übereinstimmt.
Ist dies der Fall, werden die Zugriffsrechte des mittleren `rwx`-Tripels verwendet (Zeilen 109-110).
Ist weder eine Übereinstimmung der User- noch der Group-IDs zu finden, werden die Defaultzugriffsrechte aus dem rechten Tripel verwendet.

Die Funktion `in_group_p()` ist in `/usr/src/linux/kernel/sys.c` in den Zeilen 585-599 definiert.
Sie testet, ob ihr Argument gleich der `fsgid` des aktuellen Prozesses ist oder ob das Argument gleich einer der Gruppen aus dem `groups[]`-Array des Prozesses ist.
Der Name der Funktion erklärt sich aus der "p-convention" (siehe Jargon-File, ursprünglich eine Sitte aus dem Bereich der LISP-Programmierung):
Es handelt sich um ein Prädikat, also eine Funktion, die entweder `true` oder `false` liefert, je nachdem ob die zu prüfende Aussage wahr oder falsch ist.

Die Bedingung in Zeile 111 entscheidet jetzt, ob der Zugriff auf eine I-Node gewährt wird oder nicht.
Wenn mindestens die in `mask` gewünschten Rechtebits in den durch `mode` schon in Zeile 101 vorab ermittelten Rechten enthalten sind oder der Zugriff mit Superuser-Privilegien erfolgt (`fsuser()` ist wahr), wird der Zugriff auf die Datei gewährt.
In allen anderen Fällen wird ein Fehler permission denied (EACCES) geliefert.

Wir halten fest:
Einzelne Dateisysteme können besondere Rechteroutinen haben.
Im Normalfall gelten aber die Userrechte für den Eigentümer einer Datei, die Gruppenrechte für jeden, der Mitglied in der Gruppe der Datei ist und die Other-Rechte für alle anderen.
Die Prüfung dieser Rechte erledigt Linux an einer zentralen, leicht wartbaren Stelle im System.

## Pfade, und Rechte entlang des Pfades

Alle UNIX-Kernelfunktionen, die mit Dateien hantieren, nehmen Pfadnamen als Parameter an.
Intern verwendet Linux jedoch wie alle Unices ausschließlich I-Nodes, um mit Dateien zu arbeiten.
Die Umwandlung eines Pfadnamens in eine I-Node übernimmt in Linux eine von mehreren leicht unterschiedlichen `namei()`-Funktionen, die in `/usr/src/linux/fs/namei.c` definiert sind.

`namei()` bekommt, vereinfacht dargestellt, einen Pfadnamen und die I-Node eines Verzeichnisses als Startpunkt übergeben.
In diesem Verzeichnis wird mittels der Funktion `lookup()` die I-Node der ersten Komponente des Pfadnamens gesucht.
Diese I-Node wird jetzt als Startpunkt genommen, um die nächste Komponente des Pfadnames durch `lookup()` suchen zu lassen und so weiter bis zum Ende des Pfades.
Am Ende des Pfades ist das Ergebnis dieser Operation genau die I-Node des Verzeichnisses, das durch den Pfadnamen bezeichnet wird.

Der Code von `lookup()` ist nicht ganz so einfach wie diese Erklärung, weil er so unschöne Dinge wie Mountpoints, ".."-Komponenten im Pfadnamen und ungültige Pfadnamen berücksichtigen muß, aber er ist auch nicht sonderlich kompliziert.
Für unsere Zwecke sind jedoch nur wenige Zeilen von `lookup()` wesentlich:

```console
/usr/src/linux/fs/namei.c:
   163          perm = permission(dir,MAY_EXEC);

   181          if (perm != 0) {
   182                  iput(dir);
   183                  return perm;
   184          }
```

Um in einem Verzeichnis einen Namen nachschlagen zu können, muß der aufrufende Prozeß das `x`-Recht an diesem Verzeichnis haben.
Hat er dieses `x`-Recht nicht, schlägt der Aufruf fehl - ganz gleich, welche Kernelfunktion aufgerufen wurde.
Die Folgen können ziemlich fatal sein, wie [Experiment 4](#experiment-4) demonstriert.

<hr />

## Experiment 4

**Warnung:**
Dieses Experiment darf nur durchgeführt werden, wenn in einem zweiten Fenster noch eine weitere Rootshell aktiv ist.
Andernfalls kann man sich so die Systeminstallation ruinieren.

```console
kris@white:~$ ls -ld /
drwxr-xr-x  20 root     root         1024 Nov 29 22:29 /
kris@white:~$ su - 
root@white:~# chmod go-x /
root@white:~# ls -ld /
drwxr--r--  20 root     root         1024 Nov 29 22:29 /
root@white:~# exit
kris@white:~$ ls 
csh: /bin/ls: Permission denied
kris@white:~$ su
csh: /bin/su: Permission denied
```

In einem anderen Fenster mit einer aktiven Rootshell:

```console
root@white:~# chmod 755 / 
```

Das Hauptverzeichnis `/` hat normalerweise die Rechte 755.
Jeder Benutzer hat also `x`-Recht am Verzeichnis `/` und kann damit absolute Pfadnamen auflösen.
Nimmt man dem Root-Verzeichnis die `x`-Rechte, kann kein normaler Benutzer mehr absolute Pfadnamen auflösen und jeder Aufruf eines Systemkommandos schlägt fehl.
Insbesondere ist auch kein `su` mehr möglich, um die Operation rückgängig zu machen.
Daher muß schon vor dem Beginn des Experimentes eine zweite, aktive Rootshell bereitstehen, um die Zugriffsrechte wieder zu reparieren.

<hr />

Wir halten fest:
Jede richtige Antwort auf die Frage "Welche Rechte braucht man, um mit einer Datei  eine bestimmte Operation (Öffnen, Löschen, Umbenennen und so weiter) durchführen zu können?" muß mit den Worten "Man braucht die `x`-Rechte an den Verzeichnissen entlang des Pfades und ..." beginnen.
Ohne diese `x`-Rechte kann der Pfadname von Linux nicht aufgelöst werden und was immer sich an seinem Ende befindet, ist nicht zugreifbar.
Weil wirklich jede Antwort mit diesem Halbsatz beginnen muß, wird er oft weggelassen - vergessen darf man ihn trotzdem nicht!
Die einzelne Operation (`open(2)`, `unlink(2)`, `rename(2)` und so weiter) kann dann noch zusätzlich weitere Zugriffsrechte verlangen.

## Lese- und Schreibrechte an Dateien

Welche Zugriffsrechte werden nun wirklich benötigt, um eine Datei zu öffnen?
Auch dies können wir im Linux-Kernel nachlesen:
In `/usr/src/linux/fs/open.c` befindet sich der Code des Systemaufrufes `open(2)`.
Die Funktion `sys_open()`, die diese Kernelfunktion realisiert, ist nur sehr kurz.
Sie tut kaum mehr, als `do_open()` in derselben Datei mit den richtigen Parametern aufzurufen.
Der Code von `do_open()` beschäftigt sich hauptsächlich mit der Verwaltung der Dateitabelle des Kernels und ist für die Klärung unserer Frage nicht interessant.

Die eigentliche Arbeit des Öffnens der Datei überläßt er der Funktion `open_namei()`, die wie bereits erklärt, den filename in eine I-Node umwandelt.
Der Aufruf findet sich in Zeile 442 in `open.c`:

```console
   442          error = open_namei(filename,flag,mode,&inode,NULL);
```


Dabei ist `filename` der Name der zu öffnenden Datei, `flag` der Modus, in dem die Datei geöffnet werden soll (O_RDONLY, O_CREAT und so weiter) und `mode` ist nur interessant, wenn die Datei angelegt werden soll:
Dann soll sie mit den in `mode` angegebenen Wunschrechten angelegt werden.
In `inode` liefert die Funktion die I-Node der geöffneten Datei  zurück.

Der Code von `open_namei()` steht dann in `/usr/src/linux/fs/namei.c`, von dem wir uns ja weiter oben schon Teile angesehen haben.
`open_namei()` ist eine lange Funktion, sie erstreckt sich von Zeile 333 bis Zeile 439.
Die Umwandlung des `filename`-Parameters in die `inode` erfolgt in zwei Schritten.
In einem ersten Schritt wird mithilfe von `dir_namei()` erst einmal die I-Node des Verzeichnisses lokalisiert, in dem sich die zu öffnende Datei befindet.
Der zweite Schritt ist dann leicht unterschiedlich, je nachdem, ob die die öffnende Datei bereits existiert oder ob sie wegen eines gesetzten O_CREAT erst noch erzeugt werden muß.

In Zeile 342 von `namei.c` wird zunächst die I-Node des Verzeichnisses lokalisiert, in dem eine Datei geöffnet werden soll. Das ist der erste Schritt zum Öffnen der Datei.

```console
   342          error = dir_namei(pathname,&namelen,&basename,base,&dir);
```

Dabei wird von `dir_namei()` die Variable `basename` mit dem Namen der Datei im Verzeichnis belegt, `namelen` mit der Länge dieses Namens. `dir` ist ein Zeiger auf die I-Node des Verzeichnisses, indem die Datei geöffnet werden soll, das eigentliche Ergebnis dieses Aufrufes (und wird in Zeile 361 weiterverwendet).
Wenige Zeilen später wird fallweise unterschieden, ob eine Datei angelegt werden soll oder nicht (Zeile 359).

Soll eine Datei angelegt werden, muß überprüft werden, ob eine Datei dieses Namens schon existiert (Zeile 361).
Wenn dies der Fall ist und außerdem O_EXCL als Parameter beim `open()` angegeben war, muß das `open()` fehlschlagen (Zeile 362-366).

Existiert die Datei im Verzeichnis noch nicht, kann versucht werden, sie zu erzeugen.
Dazu müssen w- und x-Recht am Verzeichnis vorhanden sein, daß die Datei einmal enthalten soll (Zeile 367).
Außerdem muß eine `create`-Funktion in den I-Node-Operations für das Verzeichnis definiert sein (Zeile 369-370).
Ist dies nicht der Fall, wird ebenfalls  `permission denied` gemeldet.

Auf Dateisystemen, die read-only angemeldet sind, dürfen selbstverständlich ebenfalls keine Dateien angelegt werden (Zeile 371-372).
Erst wenn alle diese Vorbedingungen erfüllt sind, darf die Datei wirklich angelegt werden und ist damit geöffnet.

Wir halten fest: Um eine Datei in einem Verzeichnis neu anlegen zu können, wird also das x-Recht an allen Verzeichnissen entlang des Pfades dieser Datei benötigt und das w- und das x-Recht an dem Verzeichnis, in dem die Datei neu anzulegen ist.

```console
   359          if (flag & O_CREAT) {
   361                  error = lookup(dir,basename,namelen,&inode);
   362                  if (!error) {
   363                          if (flag & O_EXCL) {
   364                                  iput(inode);
   365                                  error = -EEXIST;
   366                          }
   367                  } else if ((error = permission(dir,
                                              MAY_WRITE | MAY_EXEC)
   368                          ;       /* error is already set! */
   369                  else if (!dir->i_op || !dir->i_op->create)
   370                          error = -EACCES;
   371                  else if (IS_RDONLY(dir))
   372                          error = -EROFS;
   373                  else {
   
   375                          error = 
                     dir->i_op->create(dir,basename,namelen,mode,res_inode);
   
   379                  }
   381          } else
```

Soll dagegen eine bereits existierende Datei geöffnet werden, muß zunächst ihr Name im Verzeichnis gesucht werden, um eine I-Node für diese Datei zu bekommen (Zeile 382).

Es kann sein, daß die so gefundene I-Node nicht die I-Node der wirklich zu öffnenden Datei ist, sondern daß es sich um ein Symlink handelt.
Ein Aufruf von `follow_link()` regelt dies (Zeile  387).

Der folgende Code stellt dann sicher, daß ein Verzeichnis niemals zum Schreiben geöffnet werden darf (Zeile 390-393).
Wäre dies nicht so, könnte man in Verzeichnissen beliebige I-Node-Nummern eintragen und so die Zugriffsrechte entlang des Pfades unterlaufen.

Der eigentliche Rechtetest erfolgt dann in den Zeilen 394-397, in denen die gewünschten Zugriffsrechte in `flag` mit den vorhandenen Rechten in der inode verglichen werden.
Nach diesen Zeilen folgt weiterer Code, der Gerätedateien in mit `nodev` gemounteten Dateisystemen, read-only Dateisysteme, append-only Files und die Option O_TRUNC beim Öffnen behandelt, uns hier aber bei unserer Frage nichts neues bringt.

``` 
   382                  error = lookup(dir,basename,namelen,&inode);

   387          error = follow_link(dir,inode,flag,mode,&inode);

   390          if (S_ISDIR(inode->i_mode) && (flag & 2)) {
   391                  iput(inode);
   392                  return -EISDIR;
   393          }
   394          if ((error = permission(inode,ACC_MODE(flag))) != 0) {
   395                  iput(inode);
   396                  return error;
   397          }
```

Wir halten fest: Beim Öffnen einer vorhandenen Datei wird das x-Recht an allen Verzeichnisses entlang des Pfade dieser Datei benötigt und das passende r- und/oder w-Recht an der Datei selbst.

Offenbar ist das Öffnen einer Datei und die Kontrolle der Zugriffsrechte für ein Betriebssystem eine recht anstrengende und langsame Angelegenheit.
Neben der zeitraubenden Umwandlung von Pfadnamen in I-Nodes müssen auch noch zahlreiche Rechteflags an allen Verzeichnissen und an der Datei selbst kontrolliert werden und zahlreiche Sonderfälle berücksichtigt werden.

Zum Glück ist dieser ganze Aufwand auf das Öffnen einer Datei beschränkt.
Ist die Datei erst einmal geöffnet, findet keine weitere Rechtekontrolle mehr statt. `read()` und `write()` können sich also auf ihre eigentliche Aufgabe, das Datenschaufeln, konzentrieren und müssen sich nicht mit der Kontrolle von Zugriffsrechten herumschlagen.

## Ausführungsrechte an Dateien

Um das x-Recht an Dateien zu verstehen, müssen wir uns den Systemaufruf `execve(2)` ansehen.
Dieser Systemaufruf ist die einzige Methode, um in UNIX ein neues Programm zu laden.
In Linux, das auf mehr als einer Prozessorplattform ablaufen kann, ist ein Teil des Aufrufes systemspezifisch.
Für Intel-Prozessoren befindet sich in `/usr/src/linux/arch/i386/kernel/process.c` der Code von `sys_execve()`, der die Parameter des Systemaufrufes beschafft und dann den plattformunabhängigen Code in `/usr/src/linux/fs/exec.c` aufruft.
Der Funktion `do_execve()` werden außer dem Namen der zu startenden Binärdatei auch noch ein Feld von Parameterstrings und ein Feld von Environmentvariablen sowie ein Satz initiale Prozessorregister mitgegeben.

`do_execve()` beschafft sich durch einen Aufruf von `open_namei()` zunächst einmal die I-Node der auszuführenden Datei.
Weiter oben ist schon gezeigt worden, daß dies nur gelingen kann, wenn auf allen Verzeichnissen entlang des Pfades zu dieser Datei x-Rechte vorhanden sind.

Der folgende Code stellt sicher, daß die ausführbare Datei ein `regular file` ist.
Wenn das Dateisystem mit der Option `noexec` gemountet ist, schlägt der Aufruf von `execve()` in jedem Fall fehl, ebenso wenn der Superblock zugehörigen Dateisystems nicht erreichbar ist.

Nach diesen elementaren Überprüfungen folgt der Code, der *set user id/set group id* handhabt und das x-Recht testet.

<hr />

## Ausführungsrecht und SUID/SGID beim execve() Systemaufruf</h3>

```console
/usr/src/linux/fs/exec.c:
   586          i = bprm.inode->i_mode;
   587          if (IS_NOSUID(bprm.inode) && (((i & S_ISUID)
                && bprm.inode->i_uid != current->
   588              euid) || ((i & S_ISGID) 
                && 	!in_group_p(bprm.inode->i_gid))) && !suser()) {
   589                  retval = -EPERM;
   590                  goto exec_error2;
   591          }
   592          /* make sure we don't let suid, sgid files be ptraced. */
   593          if (current->flags & PF_PTRACED) {
   594                  bprm.e_uid = current->euid;
   595                  bprm.e_gid = current->egid;
   596          } else {
   597                  bprm.e_uid = 
                        (i & S_ISUID) ? bprm.inode->i_uid : current->euid;
   598                  bprm.e_gid = 
                        (i & S_ISGID) ? bprm.inode->i_gid : current->egid;
   599          }
   600          if ((retval = permission(bprm.inode, MAY_EXEC)) != 0)
   601                  goto exec_error2;
   602          if (!(bprm.inode->i_mode & 0111) && fsuser()) {
   603                  retval = -EACCES;
   604                  goto exec_error2;
   605          }
```

Im Rahmen der Funktion `do_execve()` werden das SUID- und SGID-Bit der auszuführenden Datei geprüft und Linux bestimmt, unter welcher euid und egid das Programm zur Ausführung kommt.
Danach wird getestet, ob ausreichende Rechte vorhanden sind, um das Programm starten zu dürfen.

<hr />

Zunächst bestimmt der Kernel die Rechtebits der auszuführenden Datei (Zeile 586).
Falls das Dateisystem, auf dem sich diese Datei befindet, mit der Option `nosuid` angemeldet ist und die Ausführung der Datei einen Wechsel der effektiven User-ID oder Group-ID bewirken würde, darf nur der Superuser die Datei ausführen (Zeilen 587-591).
Danach wird bestimmt, unter welcher UID und GID das neue Programm zur Ausführung kommen wird.

Falls das Programm zur Zeit mittels `ptrace()` in einem Debugger bearbeitet wird, werden sich seine Rechte nicht ändern (Zeilen 592-595).
Auf diese Weise wird verhindert, daß man durch tracen eines SUID-Programmes und nachträgliches Verändern seines Codes zusätzliche Rechte gewinnen könnte.

Bei normalen Programmen (Zeilen 596-599) wird die effektive UID aus der I-Node der auszuführenden Datei übernommen, wenn das SUID-Bit an der Datei gesetzt ist, andernfalls wird die UID des Vorläufers ererbt.
Analog wird mit der GID verfahren.

Der Kernel wird das Programm jedoch nur ausführen, wenn die `permission()`-Funktion feststellt, das MAY_EXEC-Recht vorhanden ist (Zeilen 600-601).
Auch ein Superuser kann eine Datei nicht als Programm starten, wenn nicht wenigstens irgendein x-Recht an der Datei vorhanden ist (Zeilen 602-603).

Der folgende, sehr umfangreiche Code beschäftigt sich dann mit dem Handling von Shellscripten, die durch einen #!-Kommentar eingeleitet werden.
Erst ab Zeile 701 kann der Kernel versuchen, tatsächlich ein Programm mit den gegebenen Eigenschaften auszuführen.

Wir halten fest:
Um ein Programm starten zu dürfen, muß außer den x-Rechten an den Verzeichnissen entlang des Pfades auch das x-Recht an der Datei vorhanden sein.
Ein Superuser kann eine Datei immerhin dann als Programm starten, wenn wenigsten irgendein x-Recht an der Datei vorhanden ist.
Wenn das SUID-Bit an der zu startenden Datei gesetzt ist, wird die Datei unter der `euid` des Dateieigentümers ausgeführt, sonst unter der `euid` des aufrufenden Prozesses - Prozesse mit einer bestehenden Verbindung zu einem Debugger werden jedoch aus Sicherheitsgründen immer nur unter der `euid` des aufrufenden Prozesses ausgeführt.
Analog wird auch mit dem SGID-Bit verfahren.

<hr />

## Experiment 5

```console
root@white:/tmp# cat >> x
#! /bin/sh --

id
root@white:/tmp# chmod 6555 x
root@white:/tmp# ls -l x
-r-sr-sr-x   1 root     root           18 Dec 10 21:14 x
root@white:/tmp# exit
kris@white:~$ /tmp/x
uid=100(kris) gid=20(users) groups=20(users),11(floppy)
```

Shellscripte mit gesetztem SUID- und SGID-Bit werden trotzdem mit normalen euid- und egid-Werten aufgerufen.

<hr />

[Experiment 5](#experiment-5) zeigt, wie der Kernel mit Shellscripten umgeht, die mit SUID- oder SGID-Rechten versehen sind.
Das liegt daran, daß bei der Interpretation von #!-Zeichen der Name des auszuführenden Programmes verändert wird und danach der `execve()`-Aufruf komplett neu gestartet wird.
Aus dem Aufruf von `/tmp/x` wird so durch die Interpretation der #!-Zeile der Aufruf `/bin/sh -- /tmp/x`, der vom Kernel komplett neu bewertet wird.

An `/bin/sh` ist aber weder das SUID- noch das SGID-Bit gesetzt, also wird die Shell mit normalen Rechten gestartet.
Daß es sich bei einem Parameter des Aufrufes um den Namen einer Datei handelt, an der SUID und SGID gesetzt sind, darf den Kernel nicht interessieren und die Shell wertet es nicht aus - sie könnte es auch nicht, wenn sie wollte.
Dieser Effekt ist durchaus beabsichtigt: Ein nichttriviales Shellscript zu schreiben, daß sicher und ohne Lücken für eventuelle Hacker unter einer fremden User-ID laufen kann, ist so gut wie unmöglich.


## Rückblick

Wie wir gesehen haben, findet die Kontrolle der Zugriffsrechte an Dateien in Linux so gut es geht zentral statt.
Wenige Funkionen wie `permission()` und die Funktionen der `namei()`-Familie spielen dabei eine sehr wichtige Rolle.
Trotzdem muß jeder Systemaufruf noch für sich selbst die Rechte des aufrufenden Prozesses an der Datei testen, die durch den Systemaufruf manipuliert werden soll.
Dabei müssen viele Sonderfälle wie *immutable files*, *append only directories* und andere exotische Dinge beachtet werden.
Wollte man eine vollständige und genaue Aufstellung von Zugriffsrechten in Linux machen, müßte man eine Liste von Systemaufrufen machen und für jeden Systemaufruf eine vollständige Liste von Vorbedingungen aufschreiben.
Ein Eintrag würde sich dann in etwa so lesen:


unlink:
: `unlink()` löscht eine Datei mit einem gegebenen Pfadnamen, wenn alle Verzeichnisse entlang des Pfades x-Recht haben, der Name der Datei im letzten Verzeichnis nicht leer ("") ist, das Dateisystem nicht read only ist, am enthaltenden Verzeichnis w- und x-Recht bestehen, das enthaltende Verzeichnis nicht append only ist und für die I-Node der Datei eine unlink()-Operation definiert ist. Diese unlink()-Operation kann jedoch noch weitere Bedingungen an die Entfernung einer Datei stellen (das ext2-Dateisystem macht dies zum Beispiel, wenn das t-Bit am enthaltenden Verzeichnis gesetzt ist).


Letztendlich wird eine solche Tabelle jedoch sehr unübersichtlich und lang.
Man sieht, daß Zugriffsrechte in UNIX im allgemeinen und Linux im besonderen nur auf den ersten Blick einfach und harmlos aussehen.
Wenn man über das einfache `rwx` hinausgeht, wird die ganze Angelegenheit ziemlich kompliziert und unübersichtlich, da viele Sonderfälle betrachtet werden müssen.
Zum Glück kommen solche Sonderfälle in einer normalen Installation nur sehr selten vor, denn sonst würde das eingangs erwähnte Kapitel 2 eines UNIX-Handbuches sehr lang werden ...
