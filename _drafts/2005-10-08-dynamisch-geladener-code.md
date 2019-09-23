---
layout: post
published: true
title: Dynamisch geladener Code
author-id: isotopp
date: 2005-10-08 12:21:27 UTC
tags:
- c
- computer
- dynamism
- library
- unix
- lang_de
feature-img: assets/img/background/rijksmuseum.jpg
---
Inzwischen bin ich so weit, daß ich viele Unix-Kommandozeilenprogramme zwar nützlich finde, aber in einem größeren Maßstab als unhandlich und schlecht wiederzuverwenden ansehe. Das liegt daran, daß das Konzept der Pipeline und der Kommandozeile zwar sehr mächtig sind, insbesondere wenn man sie mit einer guten Shell verwendet, aber einen nur so weit bringen. 

Manchmal muß man doch richtigen Code schreiben, und wenn man dann den Compiler oder auch nur eine Scriptsprache schwingen muß, dann nützen einem die ganzen Kommandozeilen-Utilities gar nichts mehr. Ja, es geht sogar so weit, daß sich diese ganzen Hilfsmittel als gefährlich erweisen, wenn irgendein Schlaumeier in seiner Gedankenlosigkeit Benutzereingaben und Kommandozeilenbefehle zusammenmischt und dann ohne das Gehirn einzuschalten an "system()" oder "popen()" übergibt. Die Geschichte von PHP und Perl ist voll von solchen bedauerlichen Betriebsunfällen und tausende von deface-ten Webseiten existieren, um Zeugnis davon abzulegen.

Recode ist so ein Utilitiy gewesen, daß ich nützlich gefunden hätte, wenn ich es - damals - in den nn hätte einbauen können. Aber eine librecode gab es nicht - immerhin hat man einen Bugreport irgendwann erhört und eine solche erzeugt und so war es dann ganz einfach, die entsprechende PHP Extension zu schreiben. Tidy ist ebenso ein Fall, der als Bibliothek sehr viel nützlicher gewesen wäre als als Kommandozeilenprogramm, und immerhin gibt es inzwischen auch eine Libtidy, auch wenn Suse Tidy per Default ohne diese baut und man daher das Suse-Paket erst einmal durch was richtiges ersetzen muß, bevor man sich ein zeitgemäßes PHP5 übersetzt.

Es gibt eine ganze Reihe von Programmen, die ich ebenfalls sehr viel lieber als Bibliotheken sehen würde statt als Standalone-Programme - allen voran den C-Compiler selber. Wie coole Sachen könnte man machen, stünde einem Funktionalität wie die Folgende bereit. <blockquote><font color="b000e0">char</font> <font color="000000">*</font><font color="#0000ff">code</font> <font color="000000">=</font> <font color="#bb7766">&quot;void function(void) { printf(<font color="#cc8877">\&quot;</font>Hello, World<font color="#cc8877">\n</font><font color="#cc8877">\&quot;</font>); }&quot;</font><font color="000000">;</font>
<font color="b000e0">void</font> <font color="000000">(</font><font color="000000">*</font><font color="#0000ff">f</font><font color="000000">)</font><font color="000000">(</font><font color="b000e0">void</font><font color="000000">)</font><font color="000000">;</font>

<font color="#0000ff">PARSETREE_T</font> <font color="000000">*</font><font color="#0000ff">t</font> <font color="000000">=</font> <font color="#0000ff">parse</font><font color="000000">(</font><font color="#0000ff">code</font><font color="000000">)</font><font color="000000">;</font>
<font color="#0000ff">EXEC_T</font> <font color="000000">*</font><font color="#0000ff">e</font> <font color="000000">=</font> <font color="#0000ff">compile</font><font color="000000">(</font><font color="#0000ff">t</font><font color="000000">)</font><font color="000000">;</font>

<font color="#0000ff">f</font> <font color="000000">=</font> <font color="#0000ff">find_symbol</font><font color="000000">(</font><font color="#0000ff">e</font>, <font color="#bb7766">&quot;function&quot;</font><font color="000000">)</font><font color="000000">;</font>
<font color="b000e0">if</font> <font color="000000">(</font><font color="#0000ff">f</font><font color="000000">)</font> <font color="#0000ff">f</font><font color="000000">(</font><font color="000000">)</font><font color="000000">;</font></blockquote> Oder bin ich der einzige, der so etwas cool finden würde?

Aber auch ohne die Rekursion der Bibliothekserzeugung durch Bibliotheken kann man nützliche Dinge tun. Und das geht so...


<h4>Ein Stück monolithischer Code</h4>
<blockquote style='white-space: pre'><B>#include <I>&lt;stdio.h&gt;</I></B><br /><br />int <B>func</B>(int <B>para</B>) {<br />        int <B>result</B>;<br />        <B>printf</B>(<I>&quot;Entering func(%d)\n&quot;</I>, <B>para</B>);<br /><br />        <B>result</B> = 3 \* <B>para</B>;<br /><br />        <B>printf</B>(<I>&quot;Leaving func(%d) = %d\n&quot;</I>, <B>para</B>, <B>result</B>);<br />        return <B>result</B>;<br />}<br /><br />int <B>main</B>(int <B>argc</B>, char \*<B>argv</B>[]) {<br />        <B>printf</B>(<I>&quot;main start\n&quot;</I>);<br /><br />        <B>printf</B>(<I>&quot;Calling func(4) = %d\n&quot;</I>, <B>func</B>(4));<br /><br />        <B>printf</B>(<I>&quot;main end\n&quot;</I>);<br />        return 0;<br />}</blockquote> Das ist ein mächtig aufregendes Programm: Es hat eine Funktion "func", die ihren numerischen Eingabewert mit drei multipliziert und zurückgibt. Es besteht aus einem Stück und ist trivial zu übersetzen und auszuführen: <blockquote style='white-space: pre'><B>.PHONY</B>: clean<br /><br /><B>prog</B>: prog.c<br /><B>        cc -Wall -o prog prog.c</B><br /><br /><B>clean</B>:<br />        rm prog</blockquote>

<h4>Zwei einzelne Module</h4>
 Für so ein kleines Testprogramm wie dieses ist das ausreichend, aber wenn Programme größer werden, wollen wir sie aufteilen. Wir bekommen drei Teilprogramme. Das erste, func.c, enthält unsere Rechenfunktion: <blockquote style='white-space: pre'><B>#include <I>&lt;stdio.h&gt;</I></B><br /><B>#include <I>&quot;func.h&quot;</I></B><br /><br />int <B>func</B>(int <B>para</B>) {<br />        int <B>result</B>;<br />        <B>printf</B>(<I>&quot;Entering func(%d)\n&quot;</I>, <B>para</B>);<br /><br />        <B>result</B> = 3 \* <B>para</B>;<br /><br />        <B>printf</B>(<I>&quot;Leaving func(%d) = %d\n&quot;</I>, <B>para</B>, <B>result</B>);<br />        return <B>result</B>;<br />}</blockquote> Der zweite Teil, prog.c, ruft diese Funktion nun auf: <blockquote style='white-space: pre'><B>#include <I>&lt;stdio.h&gt;</I></B><br /><B>#include <I>&quot;func.h&quot;</I></B><br /><br />int <B>main</B>(int <B>argc</B>, char \*<B>argv</B>[]) {<br />        <B>printf</B>(<I>&quot;main start\n&quot;</I>);<br /><br />        <B>printf</B>(<I>&quot;Calling func(4) = %d\n&quot;</I>, <B>func</B>(4));<br /><br />        <B>printf</B>(<I>&quot;main end\n&quot;</I>);<br />        return 0;<br />}</blockquote> Der dritte Teil, func.h, ist winzig klein: <blockquote style='white-space: pre'>extern int <B>func</B>(int <B>para</B>);</blockquote> Die "extern"-Anweisung in dieser Include-Datei muß in prog.c eingebunden werden. Sie macht dem Compiler, der prog.c übersetzt, klar, daß es eine Funktion func() gibt, und welche Parameter sie ergibt sowie welches Ergebnis sie liefert. Ohne diese Include-Datei würde der Compiler nicht wissen, daß es eine solche Funktion gibt und einen Fehler generieren. Mit dem Include vertagt er seine Entscheidung auf später, und generiert lediglich eine "undefined reference" auf die Funktion, die dann zu einem späteren Zeitpunkt gefunden und gelinkt werden muß. Bevor wir uns das genauer ansehen, hier erst einmal das Makefile: <blockquote style='white-space: pre'><B>prog</B>:   prog.o func.o<br />        cc -o prog $^<br /><br /><B>.PHONY</B>:<br /><B>        clean</B><br /><br /><br /><B>.c.o</B>:<br />        cc -Wall -c <B>$&lt;</B><br /><br /><B>clean</B>:<br />        rm -f \*.o prog .dependencies<br /><br /><B>.dependencies</B>:<br />        cc -MM \*.c &gt; .dependencies<br /><br />include .dependencies</blockquote> Ein Testlauf: <blockquote>kris@valiant:~/Source/dlopen/02-multifile> make clean
rm -f \*.o prog .dependencies
kris@valiant:~/Source/dlopen/02-multifile> make
Makefile:18: .dependencies: Datei oder Verzeichnis nicht gefunden
cc -MM \*.c > .dependencies
cc -Wall -c prog.c
cc -Wall -c func.c
cc -o prog prog.o func.o
kris@valiant:~/Source/dlopen/02-multifile> ./prog
main start
Entering func(4)
Leaving func(4) = 12
Calling func(4) = 12
main end</blockquote> Unser Makefile generiert also mit mehreren einzelnen Compileraufrufen eine "prog.o" und eine "func.o"-Datei. Ein dritte Aufruf fügt dann "prog" aus "prog.o" und "func.o" zusammen. Wenn wir einmal einen genaueren Blick auf diese Dateien werden, erkennen wir, wie das funktioniert: <blockquote>kris@valiant:~/Source/dlopen/02-multifile> nm func.o
00000000 T func
         U printf
kris@valiant:~/Source/dlopen/02-multifile> nm prog.o
         U func
00000000 T main
         U printf</blockquote> Die Datei prog.o enthält ein "U func", ein "undefined symbol" für die Funktionen "func" und "printf". Sie definiert ein Symbol "main". Die Datei func.o enthält ebenfalls ein "undefined symbol" für "printf", und definiert ein Symbol "func". Durch das Zusammenfügen beider Dateien wird das undefinierte Symbol "func" mit der Definition für "func" aufgefüllt. Es bleibt jetzt noch die Definition von "printf" zu erfüllen - dies geschieht mit der libc, die jedem C-Programm automatisch zugeügt wird, wenn man dies nicht abbestellt. Der C-Startupcode, der sich auch um die Parameterbehandlung mit argc und argv kümmert, ruft dann "main" auf. Er kann dies, weil "main" ein definiertes (und exportiertes) Symbol ist, sodaß er die Funktion finden kann.

<h4>Eine statische Bibliothek bauen und verwenden</h4>
Wir können dieses Code nun ohne Änderung verwenden, um eine statische Bibliothek zu bauen und zu verwenden. Dazu müssen wir lediglich die Zusammenbauanweisung, das Makefile, anpassen. Unser neues Makefile sieht so aus: <blockquote style='white-space: pre'><B>prog</B>:   prog.o libfunc.a<br /><B>        cc -o prog prog.o -L. -lfunc</B><br /><br /><B>.PHONY</B>:<br /><B>        clean</B><br /><br /><B>.c.o</B>:<br />        cc -Wall -c <B>$&lt;</B><br /><br /><B>libfunc.a</B>:      func.o<br />        ar rcs <B>$@</B> <B>$?</B><br /><br /><B>clean</B>:<br />        rm -f \*.o \*.a prog .dependencies<br /><br /><B>.dependencies</B>:<br />        cc -MM \*.c &gt; .dependencies<br /><br />include .dependencies</blockquote> und es tut dies: <blockquote>kris@valiant:~/Source/dlopen/03-staticlib> make
Makefile:19: .dependencies: Datei oder Verzeichnis nicht gefunden
cc -MM \*.c > .dependencies
cc -Wall -c prog.c
cc -Wall -c func.c
ar rcs libfunc.a func.o
cc -o prog prog.o -L. -lfunc</blockquote> Wie zuvor übersetzen wir unsere beiden .c-Dateien in .o-Dateien. Alle Bibliotheksmodule fügen wir nun in eine Bibliothek "libfunc.a" ein. Hier ist dies nur eine Datei, func.o, aber in einem richtigen Projekt könne das sehr viele Dateien sein. Zum Erzeugen der Bibliothek verwenden wir den Archiver, ar. Mit der Option "r" ("Replace", also entweder einfügen aktualisieren von Bibliotheksmodulen) fügen wir func.o in die neue Bibliothek ein. Die Suboption "c" ("Create", Anlegen der Bibliothek bei Bedarf) sorgen wir dafür, daß die Bibliothek auch erzeugt wird, wenn sie noch nicht existiert. Die Suboption "s" erzeugt einen Objektindex im Archiv oder aktualisiert diesen. Dies erleichtert dem Linker später die Arbeit, wenn er das Programm aus Bibliotheksmodulen zusammenbauen muß.

Unser Programm-Modul prog.o enthält nun ein undefined Symbol, "func". Mit der Option "-L" setzen wir den Suchpfad für Bibliotheken, und zwar auf ".", das aktuelle Verzeichnis. Dort suchen wir mit "-lfunc" nach der Bibliothek "libfunc.a". Alle .o-Dateien in der libfunc.a werden durchsucht. Wenn eine von ihnen das gesuchte Symbol "func" enthält, wird diese .o-Datei dem Programm zugefügt. Dadurch wird "func" von der Liste der undefined symbols gestrichen und es werden ggf. weitere undefined symbols der Liste hinzugefügt, nämlich diejenigen, die das Modul "func.o" selber mitbringt, wenn es dem Programm hinzugefügt wird - in unserem Beispiel "printf". Aber "printf" war ja sowieso schon auf der Liste der undefinierten Symbole, denn es wird ja auch in prog.o verwendet.

Es ist wichtig, eine Bibliothek so zu schreiben, daß sie aus vielen kleinen Objektdateien besteht - jeweils eine Funktion pro Objektdatei. Das muß so sein, weil der Linker für jedes undefined symbol die Objektdatei aus dem Archiv extrahiert und dem Programm hinzufügt, die eine Definition für das gesuchte Symbol enthält. Wenn die Objektdateien groß sind und viele Funktionen enthalten, dann werden unserem Endprogramm unter Umständen Funktionen zugefügt, die wir gar nicht brauchen, weil sie in derselben Objektdatei stehen wie eine Funktion, die wir brauchen. Unsere Programme werden dann unnötigt groß.

<h4>Dynamische Bibliotheken</h4>

Bei statischen Bibliotheken enthält nun jedes Programm, das wir schreiben und in dem wir "func" verwenden, eine Kopie von "func". Wenn wir drei oder vier von diesen Programmen zugleich starten, dann stehen auf dem Rechner drei oder vier Kopien von "func" im Speicher. Das muß nicht so sein. Wir können - wieder ohne Code zu ändern - unser Programm so bauen, daß es stattdessen dynamische Bibliotheken verwendet. Eine dynamische Bibliothek wird immer als Ganzes geladen, steht dafür aber nur einmal im Speicher. Wenn also drei oder vier verschiedene Programme die Bibliothek verwenden, wird sie zwar für jedes dieser Programme in dessen Speicherbereich eingeblendet, verbraucht dafür aber nur einmal physikalischen Speicher.

Damit das funktioniert, ändern wir das Makefile noch einmal ab: <blockquote style='white-space: pre'><B>prog</B>:   prog.o libfunc.so<br />        cc -o prog prog.o -L`pwd` -lfunc -Wl,-rpath `pwd`<br /><br /><B>.PHONY</B>:<br /><B>        clean</B><br /><br /><B>.c.o</B>:<br />        cc -Wall -c <B>$&lt;</B><br /><br /><B>libfunc.so</B>:     func.o<br /><B>        cc -rdynamic -shared -o libfunc.so func.o</B><br /><br /><B>clean</B>:<br />        rm -f \*.o \*.a \*.so prog .dependencies<br /><br /><B>.dependencies</B>:<br />        cc -MM \*.c &gt; .dependencies<br /><br />include .dependencies</blockquote> Der Build sieht jetzt so aus: <blockquote>kris@valiant:~/Source/dlopen/04-dynamiclib> make
Makefile:20: .dependencies: Datei oder Verzeichnis nicht gefunden
cc -MM \*.c > .dependencies
cc -Wall -c prog.c
cc -Wall -c func.c
cc -rdynamic -shared -o libfunc.so func.o
cc -o prog prog.o -L`pwd` -lfunc -Wl,-rpath,`pwd`</blockquote> Hier werden die Objektmodule ohne eigene "main"-Funktion nicht mit "ar" in eine "lib\*.a"-Datei überführt, sondern mit einem "cc"-Aufruf in eine .so-Datei umgewandelt. So wie man "nm" auf Objektdateien (\*.o) und Bibliotheken (\*.a) anwenden kann, kann man mit "objdump -T libfunc.so" eine Liste der in der .so-Datei definierten Symbole bekommen - leider bekommt man neben den interessanten Informationen auch noch eine ganze Menge Verwaltungsklimbim angezeigt, sodaß man das Ergebnis ein wenig filtern muß, bevor man es sinnvoll lesen kann.

Der eigentliche Build-Aufruf ist "cc -o prog prog.o -L`pwd` -lfunc -Wl,-rpath,`pwd`". Die Optionen "-L" und "-l" funktionieren genau wie bei statischen Bibliotheken. Mit der Option "-Wl" wird eine Option an den Linker weitergegeben, den wir mit "-rpath,`pwd`" instruieren, das aktuelle Verzeichnis als Suchpfad für die dynamischen Bibliotheken im resultierenden Binary mit zu vermerken. Wenn wir das nicht täten, würde libfunc.so nicht gefunden werden, solange wir sie nicht in einem der in /etc/ld.so.conf genannten Verzeichnisse installieren und einmal "ldconfig" aufrufen.

Wer dem Linker bei der Arbeit zuschauen will, der kann dies tun, indem er die Shell-Variable "LD_DEBUG" setzt und exportiert. Der Wert "help" zeigt einem, auf was für Werte man LD_DEBUG setzen kann: <blockquote>kris@valiant:~/Source/dlopen/04-dynamiclib> export LD_DEBUG=help
kris@valiant:~/Source/dlopen/04-dynamiclib> ./prog
Valid options for the LD_DEBUG environment variable are:

  libs        display library search paths
  reloc       display relocation processing
  files       display progress for input file
  symbols     display symbol table processing
  bindings    display information about symbol binding
  versions    display version dependencies
  all         all previous options combined
  statistics  display relocation statistics
  unused      determined unused DSOs
  help        display this help message and exit

To direct the debugging output into a file instead of standard output
a filename can be specified using the LD_DEBUG_OUTPUT environment variable.</blockquote>

<h4>dlopen()</h4>

Manchmal kann man zur Compilezeit noch nicht vorhersagen, welche Module das laufende Programm später einmal benötigen wir. Speziell Programme mit Plugin-Architekturen haben den Bedarf, .so-Dateien zur Laufzeit anziehen zu können, um so ihre Funktionalität durch das Laden von Plugins zu erweitern. Während statisch eingebundene .so-Dateien keine Änderungen am Code notwendig machen, ist für dynamisch geladene Dateien ein wenig Änderung notwendig - allerdings nur auf der ladenden Seite. Auf der Seite des Bibliothekscodes, in unserem Falle also func.c, func.o und libfunc.so, ist keine Änderung notwendig. Das Makefile sieht nun jedoch so aus: <blockquote style='white-space: pre'><B>all</B>:    prog libfunc.so<br /><br /><B>prog</B>:   prog.o<br /><B>        cc -o prog prog.o -ldl</B><br /><br /><B>.PHONY</B>:<br /><B>        clean all</B><br /><br /><B>.c.o</B>:<br />        cc -Wall -c <B>$&lt;</B><br /><br /><B>libfunc.so</B>:     func.o<br /><B>        cc -rdynamic -shared -o libfunc.so func.o</B><br /><br /><B>clean</B>:<br />        rm -f \*.o \*.a \*.so prog .dependencies<br /><br /><B>.dependencies</B>:<br />        cc -MM \*.c &gt; .dependencies<br /><br />include .dependencies</blockquote> Wir haben nun also zwei unabhängige Targets beim Build: Die .so-Datei und das Programm, das sie verwendet, teilen keine gemeinsame Abhängigkeit mehr. Das Programm, prog, wird nun auch nicht mehr gegen die .so-Datei gelinkt. Stattdessen wird mit "-ldl" die libdl eingebunden, die uns die Funktionen dlopen(), dlsym() und dlclose() bereitstellt.

Der Code in prog.c sieht nun so aus: <blockquote style='white-space: pre'><B>#include <I>&lt;stdio.h&gt;</I></B><br /><B>#include <I>&lt;stdlib.h&gt;</I></B><br /><B>#include <I>&lt;unistd.h&gt;</I></B><br /><B>#include <I>&lt;dlfcn.h&gt;</I></B><br /><br /><B>#define LIBNAME <I>&quot;./libfunc.so&quot;</I></B><br /><br />typedef int (\*<B>func_t</B>)(int);<br /><br />int <B>main</B>(int <B>argc</B>, char \*<B>argv</B>[]) {<br />        <B>func_t</B> <B>f</B>;<br />        char \*<B>error_msg</B>;<br />        void \*<B>libhandle</B>   = <B>NULL</B>;<br /><br />        <B>printf</B>(<I>&quot;main start\n&quot;</I>);<br /><br />        <I>/\* .so oeffnen \*/</I><br />        <B>libhandle</B> = <B>dlopen</B>(<B>LIBNAME</B>, <B>RTLD_LAZY</B>);<br />        if (!<B>libhandle</B>) {<br />                <B>fprintf</B>(<B>stderr</B>, <I>&quot;dlopen(%s, RTLD_LAZY failed: %s\n&quot;</I>, <br />                        <B>LIBNAME</B>, <br />                        <B>dlerror</B>()<br />                );<br />                <B>exit</B>(2);<br />        }<br />        <B>printf</B>(<I>&quot;dlopen() = %p\n&quot;</I>, <B>libhandle</B>);<br /><br />        <I>/\* func() finden \*/</I><br />        <B>error_msg</B> = <B>dlerror</B>();<br />        <B>f</B> = <B>dlsym</B>(<B>libhandle</B>, <I>&quot;func&quot;</I>);<br />        <B>error_msg</B> = <B>dlerror</B>();<br />        if (<B>error_msg</B>) {<br />                <B>fprintf</B>(<B>stderr</B>, <I>&quot;dlsym(%p, \&quot;func\&quot;) failed: %s\n&quot;</I>, <br />                        <B>libhandle</B>,<br />                        <B>error_msg</B><br />                );<br />                <B>exit</B>(3);<br />        }<br /><br />        <I>/\* func() aufrufen \*/</I><br />        <B>printf</B>(<I>&quot;Calling func(4) = %d\n&quot;</I>, <B>f</B>(4));<br /><br /><br />        <I>/\* .so droppen \*/</I><br />        <B>dlclose</B>(<B>libhandle</B>);<br /><br />        <B>printf</B>(<I>&quot;main end\n&quot;</I>);<br />        return 0;<br />}</blockquote> Dieser Code definiert eine Variable f vom Typ "Zeiger auf eine Funktion, die ein int liefert und einen int-Parameter annimmt. Er lädt mit "dlopen()" die "libfunc.so" ein. Wenn dies gelingt, steht ein Handle für die Bibliothek zur Verfügung. Mit "dlsym()" können wir mit Hilfe des Handles in dieser Bibliothek nach der dem Symbol "func" suchen und bekommen so einen Zeiger auf "func" in f abgelegt oder nicht. Man beachte das Errorchecking für das Ergebnis von dlsym() nach Lehrbuch - das Interface von dlsym() ist <strike>mehr als bekloppt</strike>nicht sehr schön designed. Wir können f dann ganz normal aufrufen. "dlclose()" entlädt das Plugin dann wieder.

Wenn mehr Leute sich angewöhnen würden, ihre Programme in Form von Bibliothek und Kommandozeilenwrapper zu schreiben, wäre es sehr viel leichter, Code in Form von Bibliotheken in Sprachkerne wie PHP oder in andere Programme einzubinden. Technisch ist das nicht sehr schwer, solange man sich die Mühe macht, die Infrastruktur drumherum in Form von Makefiles und Include-Dateien ordentlich zu erstellen.

<h4>Material</h4>

Das <a href="http://www.dwheeler.com/program-library/Program-Library-HOWTO/t1.html">Program Library Howto</a> zeigt den ganzen Kram noch einmal in aller Ausführlichkeit. Ein <a href="http://people.redhat.com/drepper/dsohowto.pdf">PDF von Ulrich Drepper</a> diskutiert  die dabei ablaufenden Interna.

Das <a href="http://www.isotton.com/howtos/C++-dlopen-mini-HOWTO/C++-dlopen-mini-HOWTO.html">C++ dlopen Mini-Howto</a> beschreibt, wie das ganze mit C++ zu bewerkstelligen ist. James Norton baut da in <a href="http://www2.linuxjournal.com/article/3687">Dynamic Class Loading in C++</a> sogar einen schönen Wrapper drumherum. 

<a href="http://actcomm.thayer.dartmouth.edu/dynamic/README.html">Dynamic C++ Classes - Code Distribution</a> ist die Downloadseite der dynamic-class library für C++. Das Paper <a href="http://actcomm.thayer.dartmouth.edu/dynamic/gh98.usenix98.camera.ps">"Dynamic C++ classes: A lightweight mechanism to update code in a running program"</a> von Gísli Hjálmtýsson and Bob Gray beschreibt den Hintergrund.
