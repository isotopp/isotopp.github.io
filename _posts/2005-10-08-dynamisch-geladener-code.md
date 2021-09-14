---
layout: post
published: true
title: Dynamisch geladener Code
author-id: isotopp
date: '2005-10-08 12:21:27 UTC'
tags:
- computer
- linux
- erklaerbaer
- lang_de
feature-img: assets/img/background/rijksmuseum.jpg
---
Inzwischen bin ich so weit, daß ich viele
Unix-Kommandozeilenprogramme zwar nützlich finde, aber in einem
größeren Maßstab als unhandlich und schlecht wiederzuverwenden
ansehe. Das liegt daran, daß das Konzept der Pipeline und der
Kommandozeile zwar sehr mächtig sind, insbesondere wenn man sie
mit einer guten Shell verwendet, aber einen nur so weit bringen.

Manchmal muß man doch richtigen Code schreiben, und wenn man
dann den Compiler oder auch nur eine Scriptsprache schwingen
muß, dann nützen einem die ganzen Kommandozeilen-Utilities gar
nichts mehr.

Ja, es geht sogar so weit, daß sich diese ganzen Hilfsmittel als
gefährlich erweisen, wenn irgendein Schlaumeier in seiner
Gedankenlosigkeit Benutzereingaben und Kommandozeilenbefehle
zusammenmischt und dann ohne das Gehirn einzuschalten an
`system()` oder `popen()` übergibt. Die Geschichte von PHP und
Perl ist voll von solchen bedauerlichen Betriebsunfällen und
tausende von deface-ten Webseiten existieren, um Zeugnis davon
abzulegen.

Recode ist so ein Utilitiy gewesen, daß ich nützlich gefunden
hätte, wenn ich es - damals - in den nn hätte einbauen können.
Aber eine librecode gab es nicht - immerhin hat man einen
Bugreport irgendwann erhört und eine solche erzeugt und so war
es dann ganz einfach, die entsprechende PHP Extension zu
schreiben.

Tidy ist ebenso ein Fall, der als Bibliothek sehr viel
nützlicher gewesen wäre als als Kommandozeilenprogramm, und
immerhin gibt es inzwischen auch eine Libtidy, auch wenn Suse
Tidy per Default ohne diese baut und man daher das Suse-Paket
erst einmal durch was richtiges ersetzen muß, bevor man sich ein
zeitgemäßes PHP5 übersetzt.

Es gibt eine ganze Reihe von Programmen, die ich ebenfalls sehr
viel lieber als Bibliotheken sehen würde statt als
Standalone-Programme - allen voran den C-Compiler selber. Wie
coole Sachen könnte man machen, stünde einem Funktionalität wie
die Folgende bereit.

```c
char *code = "void function(void) { printf(\"Hello, World\n\"); }";

void (*f)(void);

PARSETREE_T *t = parse(code);
EXEC_T *e = compile(t);

f = find_symbol(e, "function");
if (f) f();
```

Oder bin ich der einzige, der so etwas cool finden würde?

Aber auch ohne die Rekursion der Bibliothekserzeugung durch Bibliotheken
kann man nützliche Dinge tun. Und das geht so...

## Ein Stück monolithischer Code

```c
#include <stdio.h>

int func(int para) {
    int result;
    printf("Entering func(%d)\n", para);

    result = 3 * para;

    printf("Leaving func(%d) = %d\n", para, result);
    return result;
}

int main(int argc, char *argv[]) {
    printf("main start\n");

    printf("Calling func(4) = %d\n", func(4));

    printf("main end\n");
    return 0;
}
```

Das ist ein mächtig aufregendes Programm: Es hat eine Funktion
`func`, die ihren numerischen Eingabewert mit drei multipliziert
und zurückgibt. Es besteht aus einem Stück und ist trivial zu
übersetzen und auszuführen:

```makefile
.PHONY: clean

prog: prog.c
    cc -Wall -o prog prog.c

clean:
    rm prog
```

## Zwei einzelne Module

Für so ein kleines Testprogramm wie dieses ist das ausreichend, aber wenn
Programme größer werden, wollen wir sie aufteilen. Wir bekommen drei
Teilprogramme. Das erste, `func.c`, enthält unsere Rechenfunktion:

```c
#include <stdio.h>
#include "func.h"

int func(int para) {
    int result;
    printf("Entering func(%d)\n", para);

    result = 3 * para;

    printf("Leaving func(%d) = %d\n", para, result);
    return result;
}
```

Der zweite Teil, `prog.c`, ruft diese Funktion nun auf: 

```c
#include <stdio.h>
#include "func.h"

int main(int argc, char *argv[]) {
    printf("main start\n");

    printf("Calling func(4) = %d\n", func(4));

    printf("main end\n");
    return 0;
}
```

Der dritte Teil, `func.h`, ist winzig klein: 

```c
extern int func(int para);
```

Die `"extern`-Anweisung in dieser Include-Datei muß in `prog.c` eingebunden
werden. Sie macht dem Compiler, der `prog.c` übersetzt, klar, daß es eine
Funktion `func()` gibt, und welche Parameter sie ergibt sowie welches Ergebnis
sie liefert. Ohne diese Include-Datei würde der Compiler nicht wissen, daß
es eine solche Funktion gibt und einen Fehler generieren. Mit dem Include
vertagt er seine Entscheidung auf später, und generiert lediglich eine
"undefined reference" auf die Funktion, die dann zu einem späteren Zeitpunkt
gefunden und gelinkt werden muß.

Bevor wir uns das genauer ansehen, hier erst einmal das
Makefile: 

```makefile
prog:   prog.o func.o
    cc -o prog $^

.PHONY:
    clean

.c.o:
    cc -Wall -c $<

clean:
    rm -f *.o prog .dependencies

.dependencies:
    cc -MM *.c > .dependencies

include .dependencies
```

Ein Testlauf:

```console
kris@valiant:~/Source/dlopen/02-multifile> make clean
rm -f *.o prog .dependencies

kris@valiant:~/Source/dlopen/02-multifile> make
Makefile:18: .dependencies: Datei oder Verzeichnis nicht gefunden
cc -MM *.c > .dependencies
cc -Wall -c prog.c
cc -Wall -c func.c
cc -o prog prog.o func.o

kris@valiant:~/Source/dlopen/02-multifile> ./prog
main start
Entering func(4)
Leaving func(4) = 12
Calling func(4) = 12
main end
```

Unser Makefile generiert also mit mehreren einzelnen
Compileraufrufen eine `prog.o` und eine `func.o`-Datei. Ein
dritte Aufruf fügt dann `prog` aus `prog.o` und `func.o`
zusammen. 

Wenn wir einmal einen genaueren Blick auf diese Dateien werden,
erkennen wir, wie das funktioniert:

```console
kris@valiant:~/Source/dlopen/02-multifile> nm func.o
00000000 T func
U printf

kris@valiant:~/Source/dlopen/02-multifile> nm prog.o
U func
00000000 T main
U printf
```

Die Datei `prog.o` enthält ein `U func`, ein "undefined symbol"
für die Funktionen `func` und `printf`. Sie definiert ein Symbol
`main`. 

Die Datei `func.o` enthält ebenfalls ein "undefined symbol" für
`printf`, und definiert ein Symbol `func`. Durch das
Zusammenfügen beider Dateien wird das undefinierte Symbol `func`
mit der Definition für `func` aufgefüllt.

Es bleibt jetzt noch die Definition von `printf` zu erfüllen -
dies geschieht mit der libc, die jedem C-Programm automatisch
zugeügt wird, wenn man dies nicht abbestellt.

Der C-Startupcode, der sich auch um die Parameterbehandlung mit
argc und argv kümmert, ruft dann `main` auf. Er kann dies, weil
`main` ein definiertes (und exportiertes) Symbol ist, sodaß er
die Funktion finden kann.

## Eine statische Bibliothek bauen und verwenden

Wir können dieses Code nun ohne Änderung verwenden, um eine
statische Bibliothek zu bauen und zu verwenden. Dazu müssen wir
lediglich die Zusammenbauanweisung, das Makefile, anpassen.

Unser neues Makefile sieht so aus: 

```makefile
prog:   prog.o libfunc.a
        cc -o prog prog.o -L. -lfunc

.PHONY:
        clean

.c.o:
        cc -Wall -c $<

libfunc.a:      func.o
        ar rcs $@ $?

clean:
        rm -f *.o *.a prog .dependencies

.dependencies:
        cc -MM *.c > .dependencies

include .dependencies
```

und es tut dies: 

```console
kris@valiant:~/Source/dlopen/03-staticlib> make
Makefile:19: .dependencies: Datei oder Verzeichnis nicht gefunden
cc -MM *.c > .dependencies
cc -Wall -c prog.c
cc -Wall -c func.c
ar rcs libfunc.a func.o
cc -o prog prog.o -L. -lfunc
```

Wie zuvor übersetzen wir unsere beiden `.c`-Dateien in `.o`-Dateien.
Alle Bibliotheksmodule fügen wir nun in eine Bibliothek
`libfunc.a` ein. Hier ist dies nur eine Datei, `func.o`, aber in
einem richtigen Projekt können das sehr viele Dateien sein. 

Zum Erzeugen der Bibliothek verwenden wir den Archiver, `ar`.
Mit der Option `r` (`Replace`, also entweder einfügen oder
aktualisieren von Bibliotheksmodulen) fügen wir `func.o` in die
neue Bibliothek ein. 

Mit Hilfe der Suboption `c` (`Create`, Anlegen der Bibliothek
bei Bedarf) sorgen wir dafür, daß die Bibliothek auch erzeugt
wird, wenn sie noch nicht existiert. 

Die Suboption `s` erzeugt einen Objektindex im Archiv oder
aktualisiert diesen. Dies erleichtert dem Linker später die
Arbeit, wenn er das Programm aus Bibliotheksmodulen
zusammenbauen muß.

Unser Programm-Modul `prog.o` enthält nun ein undefined Symbol,
`func`. Mit der Option `-L` setzen wir den Suchpfad für
Bibliotheken, und zwar auf `.`, das aktuelle Verzeichnis. Dort
suchen wir mit `-lfunc` nach der Bibliothek `libfunc.a`.

Alle `.o`-Dateien in der `libfunc.a` werden durchsucht. Wenn eine von
ihnen das gesuchte Symbol `func` enthält, wird diese `.o`-Datei
dem Programm zugefügt. Dadurch wird `func` von der Liste der
undefined symbols gestrichen und es werden ggf. weitere
undefined symbols der Liste hinzugefügt, nämlich diejenigen, die
das Modul `func.o` selber mitbringt, wenn es dem Programm
hinzugefügt wird - in unserem Beispiel `printf`. Aber `printf`
war ja sowieso schon auf der Liste der undefinierten Symbole,
denn es wird ja auch in `prog.o` verwendet.

Es ist wichtig, eine Bibliothek so zu schreiben, daß sie aus
vielen kleinen Objektdateien besteht - jeweils eine Funktion pro
Objektdatei. Das muß so sein, weil der Linker für jedes
undefined symbol die Objektdatei aus dem Archiv extrahiert und
dem Programm hinzufügt, die eine Definition für das gesuchte
Symbol enthält. Wenn die Objektdateien groß sind und viele
Funktionen enthalten, dann werden unserem Endprogramm unter
Umständen Funktionen zugefügt, die wir gar nicht brauchen, weil
sie in derselben Objektdatei stehen wie eine Funktion, die wir
brauchen. Unsere Programme werden dann unnötig groß.

## Dynamische Bibliotheken

Bei statischen Bibliotheken enthält nun jedes Programm, das wir
schreiben und in dem wir `func` verwenden, eine Kopie von
`func`. Wenn wir drei oder vier von diesen Programmen zugleich
starten, dann stehen auf dem Rechner drei oder vier Kopien von
`func` im Speicher.

Das muß nicht so sein. Wir können - wieder ohne Code zu ändern -
unser Programm so bauen, daß es stattdessen dynamische
Bibliotheken verwendet. Eine dynamische Bibliothek wird immer
als Ganzes geladen, steht dafür aber nur einmal im Speicher.
Wenn also drei oder vier verschiedene Programme die Bibliothek
verwenden, wird sie zwar für jedes dieser Programme in dessen
Speicherbereich eingeblendet, verbraucht dafür aber nur einmal
physikalischen Speicher.

Damit das funktioniert, ändern wir das Makefile noch einmal ab: 

```makefile
prog:   prog.o libfunc.so
        cc -o prog prog.o -L`pwd` -lfunc -Wl,-rpath `pwd`

.PHONY:
        clean

.c.o:
        cc -Wall -c $<

libfunc.so:     func.o
        cc -rdynamic -shared -o libfunc.so func.o

clean:
        rm -f *.o *.a *.so prog .dependencies

.dependencies:
        cc -MM *.c > .dependencies

include .dependencies
```

Der Build sieht jetzt so aus: 

```console
kris@valiant:~/Source/dlopen/04-dynamiclib> make
Makefile:20: .dependencies: Datei oder Verzeichnis nicht gefunden
cc -MM *.c > .dependencies
cc -Wall -c prog.c
cc -Wall -c func.c
cc -rdynamic -shared -o libfunc.so func.o
cc -o prog prog.o -L`pwd` -lfunc -Wl,-rpath,`pwd`
```

Hier werden die Objektmodule ohne eigene `main`-Funktion nicht
mit `ar` in eine `lib*.a`-Datei überführt, sondern mit einem
`cc`-Aufruf in eine `.so`-Datei umgewandelt. 

So wie man `nm` auf Objektdateien (`*.o`) und Bibliotheken
(`*.a`) anwenden kann, kann man mit `objdump -T libfunc.so`
eine Liste der in der .so-Datei definierten Symbole bekommen -
leider bekommt man neben den interessanten Informationen auch
noch eine ganze Menge Verwaltungsklimbim angezeigt, sodaß man
das Ergebnis ein wenig filtern muß, bevor man es sinnvoll lesen
kann.

Der eigentliche Build-Aufruf ist

```console
cc -o prog prog.o -L`pwd` -lfunc -Wl,-rpath,`pwd`
```

Die Optionen `-L` und `-l` funktionieren genau wie bei
statischen Bibliotheken. Mit der Option `-Wl` wird eine Option
an den Linker weitergegeben, den wir mit `-rpath,\`pwd\``
instruieren, das aktuelle Verzeichnis als Suchpfad für die
dynamischen Bibliotheken im resultierenden Binary mit zu
vermerken. 

Wenn wir das nicht täten, würde `libfunc.so` nicht gefunden
werden, solange wir sie nicht in einem der in
`/etc/ld.so.conf` genannten Verzeichnisse installieren und einmal
`ldconfig` aufrufen.

Wer dem Linker bei der Arbeit zuschauen will, der kann dies tun,
indem er die Shell-Variable `LD_DEBUG` setzt und exportiert. Der
Wert `help` zeigt einem, auf was für Werte man `LD_DEBUG` setzen
kann:

```console
kris@valiant:~/Source/dlopen/04-dynamiclib> export LD_DEBUG=help

kris@valiant:~/Source/dlopen/04-dynamiclib> ./prog
Valid options for the LD_DEBUG environment variable are:

libs display library search paths
reloc display relocation processing
files display progress for input file
symbols display symbol table processing
bindings display information about symbol binding
versions display version dependencies
all all previous options combined
statistics display relocation statistics
unused determined unused DSOs
help display this help message and exit

To direct the debugging output into a file instead of standard output
a filename can be specified using the LD_DEBUG_OUTPUT environment variable.
```

## dlopen()

Manchmal kann man zur Compilezeit noch nicht vorhersagen, welche
Module das laufende Programm später einmal benötigen wird.

Speziell Programme mit Plugin-Architekturen haben den Bedarf,
`.so`-Dateien zur Laufzeit anziehen zu können, um so ihre
Funktionalität durch das Laden von Plugins zu erweitern. Während
statisch eingebundene `.so`-Dateien keine Änderungen am Code
notwendig machen, ist für dynamisch geladene Dateien ein wenig
Änderung notwendig - allerdings nur auf der ladenden Seite. 

Auf der Seite des Bibliothekscodes, in unserem Falle also
`func.c`, `func.o` und `libfunc.so`, ist keine Änderung
notwendig.

Das Makefile sieht nun jedoch so aus:

```makefile
all:    prog libfunc.so

prog:   prog.o
        cc -o prog prog.o -ldl

.PHONY:
        clean all

.c.o:
        cc -Wall -c $<

libfunc.so:     func.o
        cc -rdynamic -shared -o libfunc.so func.o

clean:
        rm -f *.o *.a *.so prog .dependencies

.dependencies:
        cc -MM *.c > .dependencies

include .dependencies
```


Wir haben nun also zwei unabhängige Targets beim Build: Die
`.so`-Datei und das Programm, das sie verwendet, teilen keine
gemeinsame Abhängigkeit mehr. Das Programm, `prog`, wird nun
auch nicht mehr gegen die `.so`-Datei gelinkt. Stattdessen wird
mit `-ldl` die libdl eingebunden, die uns die Funktionen
`dlopen()`, `dlsym()` und `dlclose()` bereitstellt.

Der Code in `prog.c` sieht nun so aus: 

```c
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <dlfcn.h>

#define LIBNAME "./libfunc.so"

typedef int (*func_t)(int);

int main(int argc, char *argv[]) {
    func_t f;
    char *error_msg;
    void *libhandle   = NULL;

    printf("main start\n");

    /* .so oeffnen */
    libhandle = dlopen(LIBNAME, RTLD_LAZY);
    if (!libhandle) {
        fprintf(stderr, "dlopen(%s, RTLD_LAZY failed: %s\n", 
                LIBNAME, 
                dlerror()
        );
        exit(2);
    }
    printf("dlopen() = %p\n", libhandle);

    /* func() finden */
    error_msg = dlerror();
    f = dlsym(libhandle, "func");
    error_msg = dlerror();
    if (error_msg) {
        fprintf(stderr, "dlsym(%p, \"func\") failed: %s\n", 
                libhandle,
                error_msg
        );
        exit(3);
    }

    /* func() aufrufen */
    printf("Calling func(4) = %d\n", f(4));

    /* .so droppen */
    dlclose(libhandle);

    printf("main end\n");
    return 0;
}
```

Dieser Code definiert eine Variable `f` vom Typ "Zeiger auf eine
Funktion, die ein int liefert und einen int-Parameter annimmt".

Er lädt mit `dlopen()` die `libfunc.so` ein. Wenn dies gelingt,
steht ein Handle für die Bibliothek zur Verfügung. Mit `dlsym()`
können wir mit Hilfe des Handles in dieser Bibliothek nach der
dem Symbol `func` suchen und bekommen so einen Zeiger auf `func`
in `f` abgelegt oder nicht.

Man beachte das Errorchecking für das Ergebnis von `dlsym()` nach
Lehrbuch - das Interface von `dlsym()` ist ~~mehr als bekloppt~~ nicht
sehr schön designed. 

Wir können `f` dann ganz normal aufrufen. `dlclose()` entlädt
das Plugin dann wieder.

Wenn mehr Leute sich angewöhnen würden, ihre Programme in Form
von Bibliothek und Kommandozeilenwrapper zu schreiben, wäre es
sehr viel leichter, Code in Form von Bibliotheken in Sprachkerne
wie PHP oder in andere Programme einzubinden. Technisch ist das
nicht sehr schwer, solange man sich die Mühe macht, die
Infrastruktur drumherum in Form von Makefiles und
Include-Dateien ordentlich zu erstellen.

##### Material

Das 
[Program Library Howto](http://www.dwheeler.com/program-library/Program-Library-HOWTO/t1.html) zeigt den ganzen Kram noch einmal in aller Ausführlichkeit. Ein 
[PDF von Ulrich Drepper](http://people.redhat.com/drepper/dsohowto.pdf) diskutiert  die dabei ablaufenden Interna.

Das 
[C++ dlopen Mini-Howto](http://www.isotton.com/howtos/C++-dlopen-mini-HOWTO/C++-dlopen-mini-HOWTO.html) beschreibt, wie das ganze mit C++ zu bewerkstelligen ist. James Norton baut da in 
[Dynamic Class Loading in C++](http://www2.linuxjournal.com/article/3687) sogar einen schönen Wrapper drumherum. 


[Dynamic C++ Classes - Code Distribution](http://actcomm.thayer.dartmouth.edu/dynamic/README.html) ist die Downloadseite der dynamic-class library für C++. Das Paper 
["Dynamic C++ classes: A lightweight mechanism to update code in a running program"](http://actcomm.thayer.dartmouth.edu/dynamic/gh98.usenix98.camera.ps) von Gísli Hjálmtýsson and Bob Gray beschreibt den Hintergrund.
