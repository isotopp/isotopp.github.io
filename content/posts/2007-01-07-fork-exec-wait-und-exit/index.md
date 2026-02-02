---
author: isotopp
date: "2007-01-07T01:09:00Z"
feature-img: assets/img/background/rijksmuseum.jpg
tags:
- linux
- erklaerbaer
- computer
- lang_de
title: fork, exec, wait und exit
aliases:
  - /2007/01/07/fork-exec-wait-und-exit.md.html
---
In 
[de.comp.os.unix.linux.misc](news:de.comp.os.unix.linux.misc) 
fragte jemand: 
> - Werden in einem Skript die Befehle streng sequentiell ausgeführt, d.h.
>   der nächste erst bearbeitet, wenn der Vorgänger vollständig ausgeführt
>   ist, oder wird __automatisch__ bei unvollständiger Auslastung des
>   Systems bereits der nächste Befehl angefangen?
> - Lässt sich das Standardverhalten – wie auch immer es sein mag – bei
>   Bedarf ändern?

Wenn man in ein Shellbuch schaut, wird einem an der einen oder anderen Stelle möglicherweise erläutert, 
dass die Shell jeden Befehl in einem eigenen Prozess abarbeitet.
Dann wiederum fängt man möglicherweise an zu denken und fragt sich, wie das alles zusammenhängt.
Sobald man dort angekommen ist, kann man sich mit dem Unix-Prozesszyklus beschäftigen.

## Prozess und Programm

Ein Programm ist in Unix eine Serie von ausführbaren Maschineninstruktionen auf der Platte.
Man kann mit dem Befehl _size_ einen sehr oberflächlichen Blick auf die Struktur des Programmes werfen
oder mit _objdump_ sehr viel mehr Detailinformation bekommen.
Der Aspekt, der uns hier interessieren soll:
Ein Programm ist eine Folge von Anweisungen und Daten (auf der Platte),
die möglicherweise einmal ausgeführt werden.

Ein Prozess ist ein in Ausführung befindliches Programm.
Er besteht aus dem Programm selbst (also der Versammlung von Anweisungen und Daten) 
und dem aktuellen Zustand der Ausführung.
Dazu gehört neben der Memory-Map, die sagt wie das Programm und seine Daten im Speicher angeordnet sind,
auch der Programmzähler, die Prozessorregister und der Stack des Prozesses, 
aber auch sein Root-Directory, sein aktuelles Verzeichnis, die Umgebungsvariablen, 
und alle offenen Dateien sowie einige weitere Dinge.

Unix behandelt Prozesse und Programme als die verschiedenen Dinge, die es sind:
Es ist möglich, ein Programm mehr als einmal auszuführen – es ist zum Beispiel möglich,
mehr als eine Kopie des Texteditors vi offen zu haben, die zwei unterschiedliche Texte bearbeiten.
Programm und (initiale) Daten beider Prozesse sind gleich,
aber der Zustand beider Prozesse ist verschieden. 
Es ist auch möglich, im selben Prozess nacheinander mehr als ein Programm auszuführen:
dazu wirft sich das aktuelle Programm in dem Prozess selbst weg
und ersetzt sich durch ein zweites, in diesen Prozess nachgeladenes Programm.

Unix regelt all diese Dinge mit vier sehr einfachen Systemkonzepten:

- `fork()`
- `exec()`
- `wait()` und
- `exit()`

## Usermode und Kernel

![](prozesswechsel.png)

Prozesswechsel: Es wird ein Stück Prozess 1 abgearbeitet, 
dann (1) auf Prozess 2 umgeschaltet.
Nach einer Weile wird (2) wieder auf Prozess 1 zurück geschaltet.
Die Ausführung von Prozess 1 erscheint lückenlos, erfolgt aber in zeitlich nicht zusammenhängenden Intervallen.

Wenn ein Unix-Prozess eine Systemfunktion aufruft (und noch bei ein paar anderen Gelegenheiten),
verläßt der betreffende Prozess seinen Userkontext und betritt den privilegierten Betriebsystemkern,
den Kernel.
Dort wird die aufgerufene Systemfunktion ausgeführt, und danach landet jede dieser Funktionen im Scheduler.
Der Scheduler entscheidet dann, welcher Prozess als Nächstes dran kommt, 
und kehrt aus dem Kernel in diesen Prozess zurück.
Das kann unser Ausgangsprozess oder nach Entscheidung des Schedulers ein anderer Prozess sein.

Wir halten für die Zwecke dieses Textes fest:
Jeder Systemaufruf wechselt vom Userkontext in den Kernel.
Der einzige Weg aus dem Kernel in einen Userkontext führt durch den Scheduler,
und dann kehren wir unter Umständen nicht in den Ausgangsprozess zurück.
Bei jedem Systemaufruf kann ein Prozess also seine CPU verlieren.

Das ist nicht schlimm, weil dieser andere Prozess auch irgendwann einmal die CPU aufgeben muss 
und wir dann in unseren eigenen Prozess zurückkehren als sei nichts gewesen.

Unser Programm wird also nicht linear abgearbeitet, sondern in kurzen linearen Segmenten,
zwischen denen Pausen liegen können. 
In den Pausen arbeitet die CPU an den Segmenten der anderen Prozesse, die ebenfalls lauffähig sind.

## fork() und exit()

In traditionellem Unix ist der Systemaufruf `fork()` die einzige Methode, einen neuen Prozess zu erzeugen.
Der neue Prozess enthält eine Kopie des laufenden Programmes.
Er hat eine neue Prozess-ID und die Prozess-ID des Erzeugers ist als seine Parent Prozess-ID (PPID) eingetragen. 

Im Parent-Prozess kehrt `fork()` mit der PID des neuen Prozesses als Ergebnis zurück.
Der neue Prozess kehrt ebenfalls aus dem Systemaufruf `fork()` zurück, liefert dort aber das Resultat 0.

Der Systemaufruf fork() ist also insofern besonders, indem er einmal betreten wird,
\aber zweimal verlassen wird:
Einmal im Elternprozess und einmal im neu erzeugten Kindprozess.
`fork()` erhöht die Anzahl der laufenden Prozesse im System um eins. 

Jeder Unix-Prozess beginnt seine Existenz also, indem er aus einem `fork()`-Systemaufruf spontan zurückkehrt 
und ein Programm ausführt, dass eine Kopie des Elternprogrammes ist.
Sein Schicksal unterscheidet sich vom Schicksal des Elternprozesses,
weil das Ergebnis des `fork()`-Aufrufes unterschiedlich ist (0 statt der PID des Kindes)
und man dies zur Verzweigung nutzen kann.

In Code: 
```c
#include <stdio.h>
#include <unistd.h>
#include <stdlib.h>

main(void) {
    pid_t pid = 0;
    
    pid = fork();
    if (pid == 0) {
            printf("Ich bin der Kindprozess.\n");
    }
    if (pid > 0) {
            printf("Ich bin der Elternprozess, das Kind ist %d.\n", pid);
    }
    if (pid < 0) {
            perror("In fork():");
    }
    
    exit(0);
}
```

und

```console
kris@linux:/tmp/kris> make probe1
cc     probe1.c   -o probe1
kris@linux:/tmp/kris> ./probe1
Ich bin der Kindprozess.
Ich bin der Elternprozess, das Kind ist 16959.
```

Wir vereinbaren also eine Variable `pid` vom Typ `pid_t`. 

Diese Variable speichert das Ergebnis des Systemaufrufs `fork()` 
und mit Hilfe dieses Wertes aktivieren wir entweder das eine 
("Ich bin der Kindprozess") oder das andere ("Ich bin der Elternprozess") `if()`.

Starten wir das Programm, erhalten wir zwei Ausgaben. 
Da innerhalb eines Prozesses nur ein Status existieren kann 
und nur eines der beiden `if()` betreten werden kann,
wir aber zwei Ausgaben erhalten haben, müssen wir zwei Prozesse erzeugt haben.

Indem wir das Ergebnis von `getpid()` druckten, könnten wir das sogar noch anschaulicher zeigen.

Der Systemaufruf `fork()` wird einmal betreten, aber zweimal verlassen 
und erhöht die Anzahl der Prozesse im System um eins. 
Nach dem Ablauf unseres Programms ist die Anzahl der Prozesse im System aber wieder genauso hoch
wie vor dem Aufruf des Programms.
Es muss also einen weiteren Systemaufruf geben, der die Anzahl der Prozesse im System um eins erniedrigt.

Dieser Aufruf ist `exit()`. 

`exit()` wird einmal betreten und nie verlassen.
Er verkleinert die Anzahl der Prozesse im System um eins.
`exit()` liefert außerdem einen Exitstatus, den der Elternprozess abholen kann (oder gar muss) 
und der ihn über das Schicksal seines Kindes informiert.

In unserem Beispiel enden alle Varianten unseres Programmes mit `exit()`.
Wir rufen `exit()` also im Elternprozess und im Kindprozess auf, beenden also zwei Prozesse.
Das können wir nur deswegen tun, weil unser Elternprozess auch ein Kindprozess ist, und zwar ein Kind der Shell.

Die Shell arbeitet also genau wie wir:

```console
bash (16957) --- erzeugt durch fork() ---> bash (16958) --- wird zu ---> probe1 (16958)

probe1 (16958) --- erzeugt durch fork() ---> probe1 (16959) --> exit()
   |
   +---> exit()
```

`exit()` schließt alle Dateien und Internetverbindungen eines Prozesses,
gibt allen Speicher frei, und beendet dann den Prozess.
Der Parameter von `exit()`, der Exitstatus, wird an den Elternprozess zurückgegeben.

## wait()

Der Kindprozess endet durch ein exit(0).
Die 0 ist der Exitstatus unseres Programmes und steht nun zur Abholung bereit. 
Wir müssen im Elternprozess den Exitstatus abholen.
Dies geschieht mit der Systemfunktion `wait()`.

In Code:

```c
#include <stdio.h>
#include <unistd.h>
#include <stdlib.h>

#include <sys/types.h>
#include <sys/wait.h>

main(void) {
    pid_t pid = 0;
    int   status;

    pid = fork();
    if (pid == 0) {
        printf("Ich bin der Kindprozess.\n");
        sleep(10);
        printf("Ich bin der Kindprozess 10 Sekunden spaeter.\n");
    }
    if (pid > 0) {
        printf("Ich bin der Elternprozess, das Kind ist %d.\n", pid);
        pid = wait(&status);
        printf("Ende des Prozesses %d: ", pid);
        if (WIFEXITED(status)) {
            printf("Der Prozess wurde mit exit(%d) beendet.\n", WEXITSTATUS(status));
        }
        if (WIFSIGNALED(status)) {
            printf("Der Prozess wurde mit kill -%d beendet.\n", WTERMSIG(status));
        }
    }
    if (pid < 0) {
        perror("In fork():");
    }

    exit(0);
}
```

und

```console
kris@linux:/tmp/kris> make probe2
cc     probe2.c   -o probe2
kris@linux:/tmp/kris> ./probe2
Ich bin der Kindprozess.
Ich bin der Elternprozess, das Kind ist 17399.
Ich bin der Kindprozess 10 Sekunden spaeter.
Ende des Prozesses 17399: Der Prozess wurde mit exit(0) beendet.
```

Die Variable `status` wird dem Systemaufruf `wait()` als Referenzparameter mit übergeben und von diesem überschrieben. 
Neben dem Exitstatus finden wir dort auch noch weitere Informationen über den Grund des Programmendes hinterlegt. 
Zur Decodierung stellt das System eine Reihe von Prädikaten wie `WIFEXITED()` oder `WIFSIGNALED()` zur Abfrage bereit 
und Extraktoren wie `WEXITSTATUS()` und `WTERMSIG()`. 
`wait()` gibt außerdem die Prozess-ID des Prozesses zurück, der beendet wurde.

`wait()` hängt im Elternprozess so lange bis entweder ein Signal eintrifft oder ein Kindprozess beendet wird.

Das Programm init mit der PID 1 macht übrigens den ganzen lieben langen Tag nichts anderes:
Es hängt im `wait()` und frühstückt die ihm zugeworfenen Exitstatus ab,
um sie zu verwerfen.
Außerdem liest es die `/etc/inittab` und startet die dort konfigurierten Programme.
Ist eines dieser Programme auf Respawn gesetzt und wird beendet, wird es von init neu gestartet.

Beendet sich ein Kindprozess, ohne dass der Elternprozess ein `wait()` macht,
zerstört `exit()` schon einmal alle Datenstrukturen des Kindprozesses, 
kann jedoch den Prozesslisteneintrag des Prozesses noch nicht wegwerfen, 
denn hier steht der Exitstatus des Kindes drin.
Es könnte ja nun sein, dass der Elternprozess sich irgendwann entschließt, 
ein `wait()` auszuführen und dann muss der Exitstatus ja bereitstehen.

Der Kindprozess ist also bereits tot: er hat `exit()` ausgeführt und alle Ressourcen freigegeben, 
kann aber noch nicht sterben, weil ja der Elternprozess den Status noch nicht abgeholt hat. 
Unix nennt so einen Prozess einen Zombie-Prozess.
Zombies werden in der Prozessliste sichtbar, wenn ein Prozesserzeuger falsch programmiert ist 
und nicht ausreichend `wait()` aufruft.

Andersherum ist es auch möglich, dass ein Kindprozess weiter läuft, während ein Elternprozess beendet wird.
Dann wird die Parent Prozess-ID (PPID) des Kindes von der PID des Elternprozesses auf die Konstante 1 geändert, 
oder in anderen Worten: init erbt den Prozess. 

Beendet sich das Kind, empfängt init den Exitstatus des Kindes, denn init hängt ja sowieso dauernd im wait.
Dadurch wird die Entstehung eines Zombies in diesem Fall verhindert.

Wenn die Anzahl der Prozesse im System über die Laufzeit des Systems im Mittel konstant ist,
dann ist die Anzahl der `fork()`, `exit()` und `wait()`-Aufrufe im System ebenfalls im Mittel gleich,
denn für jedes `fork()` muss irgendwann einmal ein `exit()` gemacht werden 
und für jedes `exit()` muss der Elternprozess einmal ein `wait()` machen 
(In Wirklichkeit ist die Situation wegen einiger anderer Regeln noch ein wenig komplizierter,
aber erst einmal soll dies hier genügen). 

Wir haben also ein sauberes fork-exit-wait-Dreieck.

## exec()

So wie `fork()` Prozesse erzeugt, so lädt `exec()` Programme in einen Prozess.

In  Code:

```c
#include <stdio.h>
#include <unistd.h>
#include <stdlib.h>

#include <sys/types.h>
#include <sys/wait.h>

main(void) {
    pid_t pid = 0;
    int   status;

    pid = fork();
    if (pid == 0) {
        printf("Ich bin der Kindprozess.\n");
        execl("/bin/ls", "ls", "-l", "/tmp/kris", (char *) 0);
        perror("In exec(): ");
    }
    if (pid > 0) {
        printf("Ich bin der Elternprozess, das Kind ist %d.\n", pid);
        pid = wait(&status);
        printf("Ende des Prozesses %d: ", pid);
        if (WIFEXITED(status)) {
            printf("Der Prozess wurde mit exit(%d) beendet.\n", WEXITSTATUS(status));
        }
        if (WIFSIGNALED(status)) {
            printf("Der Prozess wurde mit kill -%d beendet.\n", WTERMSIG(status));
        }
    }
    if (pid < 0) {
        perror("In fork():");
    }

    exit(0);
}
```

```console
kris@linux:/tmp/kris> make probe3
cc     probe3.c   -o probe3

kris@linux:/tmp/kris> ./probe3
Ich bin der Kindprozess.
Ich bin der Elternprozess, das Kind ist 17690.
total 36
-rwxr-xr-x 1 kris users 6984 2007-01-05 13:29 probe1
-rw-r--r-- 1 kris users  303 2007-01-05 13:36 probe1.c
-rwxr-xr-x 1 kris users 7489 2007-01-05 13:37 probe2
-rw-r--r-- 1 kris users  719 2007-01-05 13:40 probe2.c
-rwxr-xr-x 1 kris users 7513 2007-01-05 13:42 probe3
-rw-r--r-- 1 kris users  728 2007-01-05 13:42 probe3.c
Ende des Prozesses 17690: Der Prozess wurde mit exit(0) beendet.
```

Hier wird im Sohnprozess der Code von probe3 weggeworfen (Das `perror("In exec():")` wird niemals ausgeführt) 
und durch den angegebenen Aufruf von `ls` ersetzt.
In der Ausführung erkennen wir, dass `probe3` wartet, bis das `ls` sich mit `exit()` beendet hat 
und dann seine eigene Ausführung danach fortsetzt.

## Als Shellscript

Die Beispiele oben operieren in C. 
In bash sieht es so aus: 

```console
kris@linux:/tmp/kris> cat probe1.sh
#! /bin/bash --

echo "Starte Kindprozess"
sleep 10 &
echo "Der Kindprozess hat die ID $!"
echo "Der Elternprozess hat die ID $$"
echo "$(date): Elternprozess geht schlafen."
wait
echo "Der Kindprozess $! hat den Exit-Status $?"
echo "$(date): Elternprozess ist aufgewacht."

kris@linux:/tmp/kris> ./probe1.sh
Starte Kindprozess
Der Kindprozess hat die ID 18071
Der Elternprozess hat die ID 18070
Fri Jan  5 13:49:56 CET 2007: Elternprozess geht schlafen.
Der Kindprozess 18071 hat den Exit-Status 0
Fri Jan  5 13:50:06 CET 2007: Elternprozess ist aufgewacht.
```

Und hier beobachten wir die Shell bei der Ausführung von Kommandos:

```console
kris@linux:~> strace -f -e execve,clone,fork,waitpid bash
kris@linux:~> ls
clone(Process 30048 attached
child_stack=0, flags=CLONE_CHILD_CLEARTID|CLONE_CHILD_SETTID|SIGCHLD,
child_tidptr=0xb7dab6f8) = 30048
[pid 30025] waitpid(-1, Process 30025 suspended
 <unfinished ...>
[pid 30048] execve("/bin/ls", ["/bin/ls", "-N", "--color=tty", "-T", "0"],
[/* 107 vars */]) = 0
...
Process 30025 resumed
Process 30048 detached
<... waitpid resumed> [{WIFEXITED(s) && WEXITSTATUS(s) == 0}], WSTOPPED
WCONTINUED) = 30048
--- SIGCHLD (Child exited) @ 0 (0) ---
...
```

Linux verwendet eine Verallgemeinerung von `fork()` mit dem Namen `clone()` um einen Kindprozess zu erzeugen.
Daher sehen wir keinen `fork()`, sondern einen `clone()`-Aufruf mit einigen Parametern.

Linux verwendet außerdem die Variante `waitpid()` von `wait()`, um auf eine bestimmte PID zu warten.

Linux startet außerdem das Programm mit `execve()` statt mit `execl()`,
aber das ist nur eine andere Anordnung von Parametern. 
Nach dem Ende von `ls` (PID 30048) wird der Prozess 30025 aus dem `wait()` erweckt und fortgesetzt.

Und 
[hier](http://minnie.tuhs.org/UnixTree/V7/usr/src/cmd/sh/xec.c.html) 
ist der C-Code der Originalshell aus dem Jahre 1979, mit dem `fork()` 
(Man suche nach "case TFORK:" und wundere sich nicht über den Programmierstil von Herrn Bourne).
Ja, bash ist schöner - GNU Code oder nicht.

(nach 
[einem News-Artikel](http://groups.google.com/group/de.comp.os.unix.linux.misc/msg/4035c67415f9bc09) 
von mir)
