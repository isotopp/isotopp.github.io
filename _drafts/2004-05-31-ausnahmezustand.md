---
layout: post
published: true
title: Ausnahmezustand
author-id: isotopp
date: 2004-05-31 17:39:07 UTC
tags:
- php
- lang_de
feature-img: assets/img/background/rijksmuseum.jpg
---
<img border='0' hspace='5' align='right' src='/uploads/php.serendipityThumb.gif' alt='' />

Ich habe ja andernorts schon über die <a href="http://blog.koehntopp.de/archives/301_PHP_5_Schluss_mit_der_Kaspermucke.html">neuen Objekteigenschaften</a> von PHP5 und über die Vorteile von Sprachen mit <a href="http://blog.koehntopp.de/archives/291_Static_vs._dynamic_typing.html">dynamischem Typing</a> gesprochen. Dieser Artikel soll ein weiteres neues Feature von PHP5 erforschen: Exceptions.

Funktionen und Methoden dienen normalerweise dazu Werte zu berechnen und zurück zu geben. Meistens klappt das, und die Funktion liefert dann Ergebnisse aus ihrem Wertebereich. Manchmal schlägt das fehl, und dann bracht man eine Möglichkeit, mit der eine Funktion den Fehlschlag signalisieren kann.

Aber zunächst einmal ein Rückblick:

&nbsp;

<b>Errorcodes</b>
In PHP hat man dies bisher auf die traditionelle Weise getan - mit Errorcodes. 

Errorcodes sind die einfachste und älteste Möglichkeit, Fehler zu behandeln: Man erweitert einfach den Wertebereich der Funktion ein wenig, und bringt in dem erweiterten Wertebereich Codes unter, die verschiedene Fehlerzustände signalisieren sollen. 

Klassisches Beispiel aus der Programmiersprache C ist hier die Funktion <tt>int getc(FILE *stream)</tt>. Diese Funktion gibt das nächste Zeichen aus einem Stream zurück - das ist ein <tt>char</tt>. Die Funktion hat als Returntyp aber den nächstgrößeren Typ, <tt>int</tt>, denn sie kann außerdem noch <tt>EOF</tt> liefern, was kein Zeichen ist, sondern eine Signalisierung für ein Dateiende.

Gerade im C-Interface von Unix hat man dabei mehr als einmal kräftig ins Klo gegriffen. Man sehe sich einmal die Funktion <tt>int getpriority(int which, int who)</tt>. Diese Funktion kann die Priorität des Prozesses <tt>who</tt> zurückliefern, oder -1, wenn der Aufrufer keine Rechte hat, Daten vom Zielprozeß <tt>who</tt> abzufragen. Dummerweise ist die Prozeßpriorität in Unix ein Wert zwischen -20 und 20. Also heißt in der Manpage ganz im Ernst:
<blockquote>
RETURN VALUE
Since getpriority can legitimately return the value -1, it
is necessary to clear the external variable errno prior to
the call, then check it afterwards to determine if a -1 is
an error or a  legitimate  value.
</blockquote>
In Code also
<tt>
extern int errno;

errno = 0;

int pri = getpriority(PRIO_PROCESS, 0);
int saved_errno = errno;

if ((pri == -1) && (saved_errno != 0)) {
&nbsp;&nbsp;perror("getpriority);
&nbsp;&nbsp;exit(saved_errno);
}
</tt>
<b>Fehler in PHP handhaben</b>

Auch in PHP arbeitet man mit Errorcodes, doch kommt hier noch PHP-spezifisch das Problem der automatischen Typwandlung hinzu. 

So liefert eine Funktion wie <a href="http://php.net/readdir">readdir</a> zum Beispiel den nächsten Namen in einem Verzeichnis beim Durchlesen eines Verzeichnisses, oder <tt>false</tt>, wenn das Ende des Verzeichnisses erreicht ist. Code wie
<tt>
kris@valiant:~/x $ cat try.php
&lt;?php
&nbsp;&nbsp;$dp = opendir(".") or die();
&nbsp;&nbsp;while ($name = readdir($dp)) {
&nbsp;&nbsp;&nbsp;&nbsp;echo $name, "\n";
&nbsp;&nbsp;}
&nbsp;&nbsp;closedir($dp);
?&gt;
</tt>
hält also nicht nur am Ende des Verzeichnisses an, sondern auch dann, wenn ein false-äquivalenter Dateiname ("0") gelesen wird:

<tt>
kris@valiant:~/x> touch 0
kris@valiant:~/x> php try.php
.
..
</tt>
Korrekter Code:
<tt>
kris@valiant:~/x> cat try.php
&lt;?php
&nbsp;&nbsp;$dp = opendir(".") or die();
&nbsp;&nbsp;while (($name = readdir($dp)) !== false) {
&nbsp;&nbsp;&nbsp;&nbsp;echo $name, "\n";
}
&nbsp;&nbsp;closedir($dp);
?&gt;
kris@valiant:~/x> php try.php
.
..
0
try.php
</tt>
Ebenfalls spezifisch in PHP ist die Handhabung von Fehlermeldungen: Viele PHP-Funktionen drucken von sich aus Fehler- und Warnmeldungen, wenn man dies nicht durch geeignete Einstellungen für die Variable <tt>error_reporting</tt> in der <tt>php.ini</tt> umkonfiguriert hat. Alternativ kann man die Meldungen für eine einzelne Anweisung unterdrücken, indem man ihr ein "@" voranstellt.
<tt>
&lt;?php
&nbsp;&nbsp;$fp = @fopen("keks", "r");
&nbsp;&nbsp;if ($fp === false)
&nbsp;&nbsp;&nbsp;&nbsp;die("Ein Fehler trat auf: $php_errormsg\n");
?&gt;
</tt>
Die Variable <tt>php_errormsg</tt> enthält dabei den letzten Fehlerstring (egal, ob "@" verwendet worden ist oder nicht), wenn <tt>track_errors</tt> in der <tt>php.ini</tt> eingeschaltet ist.
Was PHP selber mit Fehlern macht, kann man in der <tt>php.ini</tt> steuern:
<dl>
<dt>display_errors<</dt>
<dd>(boolean) Entscheidet, ob Fehlermeldungen dem Benutzer angezeigt werden.</dd>
<dt>log_errors</dt>
<dd>(boolean) Entscheidet, ob Fehlermeldungen in ein Log wandern.</dd>
<dt>error_log</dt>
<dd>(pathname, "syslog") Legt fest, in welche Datei das Errorlog gehen soll, oder daß die Meldungen ins Syslog gehen sollen.</dd>
<dt>error_reporting</dt>
<dd>(bitfeld) Legt fest, welche Fehler Meldungen erzeugen sollen.</dd>
<dt>track_errors</dt>
<dd>(boolean) Legt fest, ob die Variable php_errromsg automatisch mit der letzten Fehlermeldung belegt werden soll.</dd>
</dl>
Außerdem kann ein Programm mit <tt>trigger_error()</tt> selber Fehler erzeugen und mit <tt>set_error_handler()</tt> eine Funktion definieren, die aufgerufen wird, falls ein Fehler vorliegt. Dem Errorhandler werden dabei vier Parameter, $severity, $msg, $filename und $linenum, übergeben.

<b>Fehler weiterschieben</b>
Häufig kann man Fehler nicht dort handhaben, wo sie auftreten, sondern muß sie auf einer anderen, höheren Programmebene behandelt, auf der Interaktion mit dem Benutzer stattfinden kann. Ein Beispiel wäre etwa eine Funktion in einem RSS-Aggregator, die von einem entfernten Host eine Datei herunterladen und analysieren muß. Hier können auf einer unteren Ebene jede Menge Dinge schiefgehen - der Hostname könnte unbekannt sein, der Host nicht erreichbar, die RSS-Datei nicht vorhanden oder die RSS-Datei beschädigt und nicht parsebar. Alle diese Fehlersituationen können nicht von Low-Level Funktionen gehandhabt werden, sondern sollen nur die Abarbeitung der Low-Level Funktion abbrechen und einen Fehlercode hochschieben. Die darüberliegende Funktion muß mit diesem Fehler rechnen, und ihn entweder handhaben, oder weiter hochschieben.

Das endet dann oft mit Verdrahtungsorgien, in denen eine Low-Level Funktion für den fehlgeschlagenen Hostname-Lookup "false" an die Connectfunktion liefert, die dann diesen Fehler oder "Host nicht erreichbar" an ihren Aufrufer, die Dateilade-Funktion, liefern muß. Die Dateilade-Funktion muß dann neben einem Ergebnis noch mehr Fehlersituationen zurückmelden können, damit schließlich ganz oben irgendwo dem Benutzer eine ordentliche Fehlermeldung angezeigt werden kann. Und mit einem einfachen "false" ist es hier ja nicht getan - schließlich will der User ja auch noch den Grund wissen, aus dem die ganze Sache fehlgeschlagen ist.

Viele Programmierfehler entstehen, weil hier falsch verdrahtet wird oder Fehlercodes nicht ausgewertet werden. Stattdessen rechnet das Programm mit dem Fehlercode als normalen Wert weiter.

<tt>
kris@valiant:~/x> cat try.php
&lt;?php
&nbsp;&nbsp;$fp = fopen("noexist", "r");
&nbsp;&nbsp;while ($line = fgets($fp)) {
&nbsp;&nbsp;&nbsp;&nbsp;echo "$line\n";
&nbsp;&nbsp;}
&nbsp;&nbsp;fclose($fp);
?&gt;
kris@valiant:~/x> php try.php
Warning: fopen(noexist): failed to open stream: No such file or directory in /home/kris/x/try.php on line 2
Warning: fgets(): supplied argument is not a valid stream resource in /home/kris/x/try.php on line 3
Warning: fclose(): supplied argument is not a valid stream resource in /home/kris/x/try.php on line 6
</tt>
Hier im Beispiel wird der mögliche Fehlercode von <tt>fopen</tt> nicht abgefangen, und mit dem ungültigen Filehandle <tt>$fp</tt> weiter gearbeitet. Das produziert eine lange Liste von Folgefehlern.

<b>Exceptions</b>
Exceptions sind nun Funktionsergebnisse, die in jedem Fall außerhalb des Wertebereiches einer Funktion liegen und mit denen auch nicht aus Versehen weitergerechnet werden kann.
<tt>
kris@valiant:~/x> cat try.php
&lt;?php
&nbsp;&nbsp;throw new Exception;
&nbsp;&nbsp;echo "huhu";
?&gt;
kris@valiant:~/x> php try.php
Fatal error: Uncaught exception 'Exception' in /home/kris/x/try.php:2
Stack trace:
#0 {main}
&nbsp;&nbsp;thrown in /home/kris/x/try.php on line 2
</tt>
Hier erzeugen wir eine Instant der eingebauten Klasse <tt>Exception</tt> und werfen diese der Anweisung <tt>throw</tt> zu. In Folge wird die normale Programmausführung abgebrochen und eine Meldung generiert.

Der Trick besteht darin, daß sich diese Exception abfangen lassen, und zwar auch eine oder mehrere Funktionslevels höher. Dazu wird das <tt>try { ... } catch { ... }</tt> Statement verwendet.
<tt>
kris@valiant:~/x> cat try.php
&lt;?php
&nbsp;&nbsp;try {
&nbsp;&nbsp;&nbsp;&nbsp;throw new Exception;
&nbsp;&nbsp;}
&nbsp;&nbsp;catch (Exception $e) {
&nbsp;&nbsp;&nbsp;&nbsp;echo "Haha! Abgefangen!\n";
&nbsp;&nbsp;}
&nbsp;&nbsp;echo "huhu\n";
?&gt;
kris@valiant:~/x> php try.php
Haha! Abgefangen!
huhu
</tt>
Tritt innerhalb des try-Blocks eine Exception auf, werden nacheinander alle hinter dem try-Block stehenden catch-Blöcke abgearbeitet. Paßt die Exception aus dem throw auf ein catch-Statement, wird der Code in diesem Statement abgearbeitet und die Verarbeitung kann fortgesetzt werden.

<b>Rethrowing</b>
Eine Exception kann auch abgefangen, teilweise behandelt und dann erneut geworfen werden.
<tt>
kris@valiant:~/x> cat try.php
&gt?php
&nbsp;&nbsp;function fehlschlag() {
&nbsp;&nbsp;&nbsp;&nbsp;echo "Betrete Fehlschlag\n";
&nbsp;&nbsp;&nbsp;&nbsp;throw new Exception;
&nbsp;&nbsp;&nbsp;&nbsp;echo "Verlasse Fehlschlag\n";
&nbsp;&nbsp;}

&nbsp;&nbsp;function verarbeite() {
&nbsp;&nbsp;&nbsp;&nbsp;echo "Betrete verarbeite\n";
&nbsp;&nbsp;&nbsp;&nbsp;try {
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;fehlschlag();
&nbsp;&nbsp;&nbsp;&nbsp;}
&nbsp;&nbsp;&nbsp;&nbsp;catch (Exception $e) {
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;echo "Behandle Exception\n";
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;throw $e;
&nbsp;&nbsp;&nbsp;&nbsp;}
&nbsp;&nbsp;&nbsp;&nbsp;echo "Verlasse verarbeite\n";
&nbsp;&nbsp;}

&nbsp;&nbsp;function toplevel() {
&nbsp;&nbsp;&nbsp;&nbsp;echo "Betrete toplevel\n";
&nbsp;&nbsp;&nbsp;&nbsp;verarbeite();
&nbsp;&nbsp;&nbsp;&nbsp;echo "Verlasse toplevel\n";
&nbsp;&nbsp;}

&nbsp;&nbsp;toplevel();
&nbsp;&nbsp;echo "ende\n";
?&gt;
kris@valiant:~/x> php try.php
Betrete toplevel
Betrete verarbeite
Betrete Fehlschlag
Behandle Exception

Fatal error: Uncaught exception 'Exception' in /home/kris/x/try.php:5
Stack trace:
#0 /home/kris/x/try.php(12): fehlschlag()
#1 /home/kris/x/try.php(23): verarbeite()
#2 /home/kris/x/try.php(27): toplevel()
#3 {main}
&nbsp;&nbsp;thrown in /home/kris/x/try.php on line 5
</tt>
Man beachte hier den Callstack, der angezeigt wird, und die Zeile, in der der Fehler angeblich aufgetreten ist. Das wird deswegen so angezeigt, weil wir in verarbeite() die alte Exception $e erneut throw'en, anstatt eine weitere Exception mit einem <tt>throw new Exception</tt> zu erzeugen.

<b>Die Einbauklasse Exception</b>
Die in PHP5 eingebaute Klasse <tt>Exception</tt> hat einige Spezialfähigkeiten und stellt ein Standardinterface für Exceptions bereit. Wir können jederzeit eigenen Exception-Klassen definieren, aber wir sind gehalten, diese von der Einbauklasse erben zu lassen, damit unsere Klasse das Standardinterface erhält. In der <a href="http://zend.com/php5/articles/engine2-php5-changes.php#Heading12">Zend Doku</a> findet sich eine Beschreibung der Standard-Exceptionklasse. Entscheidend sind die Funktionen zur Handhabung von Fehlermeldung und Fehlercode, Dateiname und Zeilennummer sowie zum Drucken des Stackdumps.
<tt>
kris@valiant:~/x> cat try.php
&lt;php
&nbsp;&nbsp;class MyE extends Exception {
&nbsp;&nbsp;&nbsp;&nbsp;function display() {
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;echo "MyE: code $this->code ($this->message) " .
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"in line $this->line of $this->file\n";
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;echo $this->getTraceAsString(), "\n";
&nbsp;&nbsp;&nbsp;&nbsp;}
&nbsp;&nbsp;}

&nbsp;&nbsp;class Sample {
&nbsp;&nbsp;&nbsp;&nbsp;function __construct() {
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;throw new MyE("Keks", 17);
&nbsp;&nbsp;&nbsp;&nbsp;}
&nbsp;&nbsp;}

try {
&nbsp;&nbsp;&nbsp;&nbsp;$s = new Sample();
&nbsp;&nbsp;} catch (MyE $ex) {
&nbsp;&nbsp;&nbsp;&nbsp;$ex->display();
&nbsp;&nbsp;} catch (Exception $ex) {
&nbsp;&nbsp;&nbsp;&nbsp;die("Standardexception");
&nbsp;&nbsp;}
?&gt;
kris@valiant:~/x> php try.php
MyE: code 17 (Keks) in line 11 of /home/kris/x/try.php
#0 /home/kris/x/try.php(16): Sample->__construct()
#1 {main}
</tt>
zeigt wie eine eigene Exception von der Standardklasse erben kann. Das erste verwendete Catch-Statement triggert dabei nur auf die eigene Exceptionklasse MyE, nicht auf Standard-Exceptions.

<b>Toplevel Exception Handling</b>
Mit Hilfe der Funktion <tt>set_exception_handler()</tt> können wir analog zu <tt>set_error_handler()</tt> alle Exceptions abfangen, die von PHP nicht anderweitig mit catch geschnappt werden. Dabei verarbeitet PHP diese Exception-Handler intern in einem Stack: <tt>set_exception_handler()</tt> definiert jeweils einen neuen Handler, und <tt>restore_exception_handler()</tt> deinstalliert diesen und setzt den vorhergehenden Handler wieder in Kraft.

Der Exception-Handler hat dabei nur einen einzigen Parameter, das Exception-Objekt.
<tt>
kris@valiant:~/x> cat try.php
&lt;?php
&nbsp;&nbsp;function handle_ex($e) {
&nbsp;&nbsp;&nbsp;&nbsp;$e->display();
&nbsp;&nbsp;&nbsp;&nbsp;return;

&nbsp;&nbsp;&nbsp;&nbsp;# Alternativ:
&nbsp;&nbsp;&nbsp;&nbsp;$code = $e->getCode();
&nbsp;&nbsp;&nbsp;&nbsp;$msg  = $e->getMessage();
&nbsp;&nbsp;&nbsp;&nbsp;$line = $e->getLine();
&nbsp;&nbsp;&nbsp;&nbsp;$file = $e->getFile();
&nbsp;&nbsp;&nbsp;&nbsp;$trace= $e->getTraceAsString();

&nbsp;&nbsp;&nbsp;&nbsp;echo "code $code ($msg) in line $line of $file\n";
&nbsp;&nbsp;&nbsp;&nbsp;echo "$trace\n";
&nbsp;&nbsp;}

&nbsp;&nbsp;class MyE extends Exception {
&nbsp;&nbsp;&nbsp;&nbsp;function display() {
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;echo "MyE: code $this->code " .
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"($this->message) in line $this->line of $this->file\n";
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;echo $this->getTraceAsString(), "\n";
&nbsp;&nbsp;&nbsp;&nbsp;}
&nbsp;&nbsp;}

&nbsp;&nbsp;class Sample {
&nbsp;&nbsp;&nbsp;&nbsp;function __construct() {
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;throw new MyE("Keks", 17);
&nbsp;&nbsp;&nbsp;&nbsp;}
&nbsp;&nbsp;}

&nbsp;&nbsp;set_exception_handler("handle_ex");
&nbsp;&nbsp;$s = new Sample();
?&gt;
kris@valiant:~/x> php try.php
MyE: code 17 (Keks) in line 27 of /home/kris/x/try.php
#0 /home/kris/x/try.php(32): Sample->__construct()
#1 {main}
</tt>

<b>Was fehlt?</b>
PHP kennt kein <tt>finally</tt> Statement wie in Java. Man muß es sich durch passendes Catchall mit Rethrowing selber bauen.
