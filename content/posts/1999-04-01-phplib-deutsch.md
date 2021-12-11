---
author: isotopp
date: "1996-03-02T09:00:00Z"
feature-img: assets/img/background/rijksmuseum.jpg
published: true
title: "PHPLIB"
tags:
- lang_de
- publication
- php
---

**Dieser Text bildet Kapitel 24 von *php, dynamische webautritte
professionell realisieren*. Er ist mit dem 3. Reprint der 1. Auflage
dazugekommen. Für Besitzer älterer Versionen dieses Buches stelle ich den
Text hier zur Verfügung (April 1999)**

# PHPLIB

## Überblick und Installation

### Was leistet PHPLIB?

PHPLIB ist eine Sammlung von in PHP3 geschriebenen Klassen, mit
denen eine Reihe von Aufgaben gelöst werden können, die bei der
Entwicklung von webgestützten Anwendungen sehr häufig auftreten.

Ursprünglich stand hinter der Entwicklung von PHPLIB der Wunsch,
Variablen in PHP zu schaffen, die eine längere Gültigkeitsdauer
als eine Webseite haben, die also automatisch von Seite zu Seite
weitergereicht werden. 

Die Klasse **Session** der Bibliothek
realisiert dies, indem sie jeden Zugreifer auf eine Webanwendung
mit einer eindeutigen Kennung versieht und diese Kennung dann
auf unterschiedliche Weise von Seite zu Seite weitergibt. Bei
jedem Zugriff auf eine Seite wird ein Satz Variablen, der zu
dieser Kennung gehört, aus einem festen Datenspeicher geladen
und am Ende der Seite auch dort wieder gespeichert. Ein solcher
Satz Variablen heißt in der Terminologie von PHPLIB "Session"
und die von PHPLIB verwaltete Kennung heißt "Session-ID".

Der Datenspeicher, der von PHPLIB verwendet wird, war
ursprünglich eine SQL-Datenbank, aber seit Version 7 von PHPLIB
können auch andere Speicher, zum Beispiel DBM-Dateien,
LDAP-Server oder ein Shared Memory-Segment verwendet werden. 

Da
PHPLIB ursprünglich ausschließlich SQL-Datenbank als Speicher
verwendet hat, war es schon recht bald notwendig, die Bibliothek
an unterschiedliche Datenbanken anzupassen. Aus dieser
Notwendigkeit heraus wurde eine Klasse **DB_SQL** zum Zugriff
auf solche Datenbanken entwickelt, die ein einheitliches,
datenbankunabhängiges Interface zum Zugriff auf diese
Datenbanken zur Verfügung stellt. Diese Klasse ist sogar so
flexibel, daß sie vollkommen unabhängig von PHPLIB verwendet
werden kann - selbst wenn man eine Anwendung ohne Sessions, aber
mit Datenbanken entwickelt, ist es also sinnvoll, diese Klasse
zum Zugriff auf die Datenbank zu verwenden: Einerseits gewinnt
man so mehr Flexibilität beim Zugriff auf die Datenbank,
andererseits ist auf diese Weise die Umrüstung der Anwendung auf
PHPLIB sehr viel einfacher.

Mit der Entwicklung von PHPLIB kamen recht schnell weitere
Fertigkeiten dazu. Wenn man Sessionvariablen hat, ist es zum
Beispiel recht einfach, sich daran zu erinnern, ob ein Anwender
sich schon einmal eingeloggt hat und wann das war. Auf diese
Weise kann man Webseiten recht einfach mit Benutzerkennungen und
Paßworten schützen, ganz ähnlich wie mit .htaccess-Dateien und
HTTP-Authentisierung. 

Anders als bei HTTP-Authentisierung hat
man bei der von PHPLIB-Klasse **Auth** verwendeten
Zugangskontrolle jedoch viel mehr Kontrolle über das Aussehen
des Anmeldebildschirmes: Es ist eine normale Webseite, die
Bedienungshinweise, ein Firmenlogo und Online-Hilfe enthalten
kann. Man hat außerdem auch viel mehr Kontrolle über die
Anmeldung selbst: Man kann Anwender gezielt oder zeitgesteuert
automatisch wieder ausloggen, man kann die Benutzereingaben
gegen beliebige SQL-, LDAP-, NIS- oder NT PDC-Datenbanken mit
Paßworten authentisieren und man ist nicht darauf angewiesen,
daß ein Benutzer durch einen Benutzernamen identifiziert wird,
sondern kann sich beliebige Schemata ausdenken (E-Mail Adressen,
Vorname/Nachname/Telefon oder was immer passend ist). Außerdem
hat man auch Einfluß auf die Übertragung der Anmeldedaten vom
Anwender zum Webserver und kann dort kryptographische Methoden
einsetzen, um eine Übertragung von Klartext-Paßworten zu
vermeiden. Zu einem Benutzer gehören auch Benutzerrechte und so
bekam PHPLIB zusätzlich eine Klasse **Perm** zur Verwaltung
von Zugriffsrechten.

Die letzte Erweiterung der Kernfunktionen von PHPLIB war dann
die Schaffung von Variablen, die nicht mehr an eine Session-ID
gebunden waren, sondern an eine Benutzerkennung. Die
PHPLIB-Klasse **User** bedient sich ganz genauso wie eine
**Session**, nur daß die nach einer Benutzeranmeldung Daten
verwalten kann, die zu dem Login des Benutzers gehören. Auf
diese Weise ist es sehr leicht, personalisierte Websites zu
erzeugen, die sich erinnern, welche Voreinstellungen ein
Benutzer das letzte Mal getroffen hatte und die diese
Einstellungen wiederverwenden.

Während die Funktionen oben zur Kernfunktionalität von PHPLIB
gehören, die von fast jeder Anwendung mit PHPLIB benötigt wird,
ist der Funktionsreichtum der Bibliothek damit noch lange nicht
erschöpft. Eine Reihe von weiteren Klassen bietet Funktionen,
die optional dazugenommen werden kann, wenn die Anwendung Bedarf
daran hat und die dem Entwickler viele arbeits- und
codieraufwendunge Dinge abnehmen können. Die Klasse **Cart**
zum Beispiel realisiert einen einfachen Warenkorb, der zusammen
mit einer Artikeltabelle in einer Datenbank leicht zu einem
einfachen Shopsystem erweitert werden kann. 

Andere Klassen generieren immer wieder benötigte Strukturen in
HTML: **Table** kann in Zusammenhang mit Arrays oder
Datenbank-Resultaten fertige Tabellen generieren,
**Sql_Query** erlaubt es, eine Eingabemaske zu erzeugen, in
denen sich ein Anwender eine Query gegen eine Datenbanktabelle
zusammenklicken kann und diese Maske dann auch auszuwerten und
schließlich dient die **OOH Forms**-Klassensammlung zur
Generierung von Verwaltung von Abfrageformularen.

### Wo bekommt man PHPLIB (und was kostet sie)?

Die Website zu PHPLIB ist [http://phplib.netuse.de](http://phplib.netuse.de). 
An dieser Stelle findet sich nicht nur die jeweils aktuelle Version
von PHPLIB, sondern auch die jeweils aktuelle Dokumentation und
ein Verweis auf die Supportmailinglisten zu PHPLIB. Ebenso
findet man dort ein Archiv dieser Mailinglisten.

Die Mailingliste `phplib@lists.netuse.de`
ist das Forum, an das sich Anwender der Bibliothek wenden
können, die Probleme mit der Installation oder dem Betrieb von
PHPLIB haben. Man kann sich an dieser Liste anmelden, indem man
eine Nachricht mit dem Text "subscribe" an die Adresse 
`phplib-request@lists.netuse.de`
sendet. Die Abmeldung funktioniert analog, indem man eine
Nachricht mit dem Text "unsubscribe" an diese Adresse 
`phplib-request@lists.netuse.de`
sendet. Die Liste ist in englischer Sprache.

Eine weitere Liste,`phplib-dev@lists.netuse.de`,
ist für Entwickler der Bibliothek gedacht: Sie empfängt Reports
aus dem CVS-Archiv von phplib und auf ihr finden Diskussionen
unter den Entwicklern statt. Auch diese Liste ist
englischsprachig.

Da die Bibliothek unter der "nicht infektiösen" LGPL frei
verfügbar ist, kann sie sowohl in GNU Projekten als auch in
kommerziellen Softwareprojekten gefahrlos und ohne daß
Lizenzgebühren anfallen eingesetzt werden. Der genaue Text der
Lizenzvereinbarung ist Bestandteil des Paketes und findet sich
in der Datei COPYING.

Die ursprünglichen Entwickler von PHPLIB, 
Boris Erdmann  und Kristian Köhntopp, haben inzwischen
von vielen anderen Netzteilnehmern Unterstützung bekommen.
Besondere Erwähnung verdienen Sascha Schumann , der
für die Veröffentlichung von PHPLIB-6 maßgeblich war und der
viele andere Erweiterungen und Fehlerkorrekturen vorgenommen hat
und Jay Bloodworth ,
von dem die OOH Forms-Klassen der Bibliothek stammen. Eine
vollständige Liste aller Helfer findet man in der Datei CREDITS
als Bestandteil des Paketes.

### PHPLIB installieren

Bevor man daran gehen kann, sich mit der eigentlichen
Installation von PHPLIB zu beschäftigen, solle man zunächst
einmal seine Installation von PHP3 überprüfen und einige Fakten
darüber in Erfahrung bringen. Für den Installationsprozeß ist es
notwendig zu unterscheiden, ob man ein CGI PHP3 oder ein
mod_php3 als Bestandteil eines Apache Webservers hat. Wie die
meisten Fragen zum Thema PHP3-Installation beantwortet sich
dies am einfachsten, indem man sich ein Script mit einem
phpinfo()-Aufruf erzeugt und sich die Ausgabe desselben ansieht:
Besteht die Ausgabe von phpinfo() aus vier Tabellen, handelt es
sich um einen CGI PHP3-Interpreter. Enthält sie dagegen mehr
Tabellen, von denen die letzten beiden "Apache Environment" und
"HTTP Headers Information" heißen, handelt es sich um ein
PHP3-Modul in einem Apache Webserver (mod_php3).

Falls CGI PHP3 verwendet wird, sollte man den PHP3-Interpreter
gleich noch auf korrekte Übersetzung und Installation prüfen:
Angenommen der Name des Testscriptes mit dem phpinfo()-Aufruf
ist `http://localhost/test.php3`. Falls der Inhalt der Variablen
`$PHP_SELF` nur den Pfad zum PHP3-Script enthält (`/test.php3`),
ist die Installation korrekt erfolgt. Taucht dagegen der
CGI-Pfad und der Name des Interpreters als Bestandteil der
Variablen auf (`/cgi-bin/php/test.php3`), ist der Interpreter
ohne die Option `--force-cgi-redirect` übersetzt worden.
Abgesehen davon, daß dies eine enorme Sicherehitslücke ist, wird
PHPLIB mit so einem Interpreter nicht korrekt funktionieren. Mit
einem dergestalt falsch installierten PHP3-Interpreter lassen
sich beliebige Dateien, auch außerhalb der Document-Root des
Webservers, lesen und herunterladen
(`/cgi-bin/php/../../../../../../etc/passwd`).

Mit Hilfe der Ausgabe von phpinfo() läßt sich auch die Version
des PHP3-Interpreters prüfen. Für PHPLIB muß sie ausreichend neu
sein: mindestens 3.0.6 oder höher, besser wäre ein aktuelles
Release wie 3.0.11 oder höher. Es hat keinen Zweck versuchen zu
wollen, PHPLIB mit einer älteren Version von PHP3 zu
installieren: Ältere Versionen von PHP3 haben zu viele Fehler in
der Speicherverwaltung und in der Behandlung von
objektorientierten Erweiterungen als daß sie mit PHPLIB
zusammenarbeiten könnten.

Für die korrekte Installation von PHPLIB ist es außerdem
notwendig, Zugriff auf die php3.ini-Datei zu haben, um einige
Konfigurationsparameter für den Interpreter setzen zu können. Im
Falle von mod_php3 genügt es, .htaccess-Dateien erzeugen zu
können, mit denen man PHP3-Parameter für Unterverzeichnisse
seines Webservers festlegen kann.

PHPLIB kann entweder als mit gzip komprimiertes tar-Archiv
(tgz-Datei) oder als selbstentpackendes Shellscript (shar-Datei)
bezogen werden. Das bevorzugte Format ist das tgz-Format, weil
es wegen der Kompression deutlich kleiner ist und weil es sowohl
unter UNIX als auch unter Windows (mit WinZIP) problemlos
auszupacken ist.

Nach dem Auspacken entsteht ein Verzeichnis php-lib mit den
Unterverzeichnissen doc, pages, php und stuff. Die eigentliche
Bibliothek befindet sich in den Dateien im Verzeichnis php. Dazu
gehören außerdem die Dateien im Verzeichnis pages, die eine
Reihe von Testseiten und Verwaltungsprogrammen enthalten. Diese
Daten sind nur zum Test des Installationsprozesses notwendig und
können später im Produktionsbetrieb entfernt werden. Das
Verzeichnis stuff enthält eine Reihe von Scripten für die
unterschiedlichsten SQL-Datenbanken und dient zur Einrichtung
der benötigten Tabellen. Schließlich existiert noch das
doc-Verzeichnis, in dem sich die Dokumentation zur Bibliothek in
englischer Sprache befindet.

Die Dateien im Verzeichnis php werden von PHP3 zur Laufzeit
mittels include()- oder require()-Anweisungen eingebunden. Man
sollte sie daher in ein Verzeichnis *neben* der
Document-Root seines Webservers kopieren und den include_path
seines PHP3-Interpreters darauf zeigen lassen. Auf keinen Fall
sollten sich diese Dateien in irgendeinem Verzeichnis
*unterhalb* des Document-Root Verzeichnisses des Webservers
befinden, andernfalls kann es zu schweren Sicherheitsproblemen
kommen.

Setzt man die CGI-Version von PHP ein oder möchte man für ein mod_php den
include_path global vorgeben, ist eine Änderung in der php3.ini zu machen.
In welchem Verzeichnis diese Datei gesucht wird, geben neuere Versionen in
der Ausgabe von phpinfo() als Überschrift der Tabelle
"Configuration" mit an. In der php3.ini ist der Parameter
include_path so zu setzen, daß er das Verzeichnis mit den
*.inc-Dateien von PHPLIB enthält. Setzt man dagegen mod_php ein
und möchte die Änderung der Konfigurationsparameter nur für ein
Unterverzeichnis vornehmen, muß man in einem `<Directory>`-Block
in der httpd.conf oder in einer .htaccess-Datei einen Eintrag
der Form "php3_include_path
/pfad/zum/verzeichnis" vornehmen, damit das betreffende
Verzeichnis mit durchsucht wird.

Auf jeder Seite, die PHPLIB verwendet, müssen nun die Dateien
mit den Definitionen der Klassen von PHPLIB eingebunden werden.
Zu diesem Zweck existiert eine vordefinierte Datei, die sich nun
in dem neuen Include-Verzeichnis befinden muß: prepend.php3.
Entweder kann diese Datei manuell auf jeder einzelnen
PHPLIB-Seite eingebunden werden oder sie kann automatisch vor
jede dieser Seiten gesetzt werden. Letzteres erreicht man, indem
man den Parameter "auto_prepend_file = ..." in der php3.ini
entsprechend setzt, oder, falls man mod_php einsetzt, in einem
`<Directory>`-Block oder einer .htaccess-Datei einen Eintrag
der Form "php3_auto_prepend_file /pfad/zu/datei/prepend.php3"
vornimmt.

In der Datei prepend.php3 wird dann eingetragen, welche Dateien
PHPLIB zu jeder Seite dazuladen soll. Verwendet man MySQL, ist
keine Änderung notwendig. Wird stattdessen eine der anderen von
PHPLIB unterstützten Datenbanken (mSQL, ODBC, Oracle 7,
Oracle OCI 8 Interface, Postgres oder Sybase) verwendet, ist die
Anweisung 'require("db_mysql.inc")' in dieser Datei entsprechend
anzupassen. Verwendet man PHPLIB ohne SQL-Datenbank, sondern mit
dem LDAP-, DBM- oder Shared Memory-Interface, ist diese
require-Anweisung auszukommentieren und stattdessen die
Anweisung 'require("ct_sql.inc")' in der Zeile darunter
entsprechend anzupassen. In dieser Anleitung gehen wir davon
aus, daß eine Standardinstallation mit MySQL verwendet werden
soll. Dann sind in der prepend.php3 keine Änderungen notwendig.

Im nächsten Schritt sind in der Datenbank die benötigten
Tabellen anzulegen. In MySQL muß der Datenbank-Administrator
dazu zunächst einmal eine logische Datenbank mit dem Kommando
'CREATE DATABASE' anlegen, etwa 'CREATE DATABASE beispieldb'.
Danach muß dem Benutzer, unter dem PHP3 später ausgeführt wird,
auf die übliche Weise Zugriffsrecht auf diese Datenbank gegeben
werden. Es ist dringend empfohlen, keine gesonderte logische
Datenbank für PHPLIB anzulegen, sondern die Tabellen von PHPLIB
innerhalb des normalen Datenbankschemas der Anwendung zu
erzeugen. Man kann dies für die Datenbank 'beispieldb' tun,
indem man einfach den SQL-Batch 'stuff/create_database.mysql'
aus der PHPLIB-Distribution ausführt:

```php
$ mysql beispieldb < stuff/create_database.mysql
```

Ein einfaches 'SHOW TABLES' in dieser Datenbank sollte einem
dann die Tabellen active_sessions und active_sessions_split,
auth_user und auth_user_md5 sowie db_sequence zeigen.

Schließlich muß man PHPLIB noch auf seine eigenen Bedürfnisse
anpassen, d.h. der Bibliothek mitteilen, wo sie die Datenbank
findet und mit welchen Parametern sie arbeiten soll. Alle diese
Änderungen werden in der Datei local.inc vorgenommen. Diese
Datei enthält eine Reihe von Klassendefinitionen, die die
normalen, unspezifischen Klassendefinitionen um die für die
Anwendung benötigten Parameter ergänzen. In der zum Paket
gehörenden Version enthält diese Datei eine Reihe von
Beispieldefinitionen, was sie ein wenig unübersichtlich macht.
Zum Üben ist es ausreichend, wenige Zeilen in der Definition von
DB_Example anzupassen, aber für eine Installation, die für die
Produktion gedacht ist, wird man die Datei nur als Vorlage
nehmen und mit einer leeren local.inc anfangen, die man sich für
seine Zwecke maßschneidert. 

An keiner anderen Datei von PHPLIB sollten normalerweise
Änderungen notwendig sein.

Zum Testen kann nun die Dateien aus dem pages-Verzeichnis in die
Document-Root seines Webservers kopieren und einmal versuchen,
die Testseiten aufzurufen. Bei Installationsproblemen hilft die
wirklich ausführliche Anleitung, die mit PHPLIB mitgeliefert
wird und die Supportmailingliste zur Bibliothek.

## Zugriff auf Datenbanken mit PHPLIB

### Erstellen einer eigenen Datenbank-Klasse

PHPLIB enthält eine Klasse DB_Sql, die den Zugriff auf
Datenbanken in einer Weise erlaubt, die weitgehend unabhängig
von der verwendeten Datenbankart ist. Die Klasse existiert in
verschiedenen Versionen, je nach der unterliegenden
SQL-Datenbank, die verwendet werden soll: db_mysql.inc
definiert eine Version von DB_Sql für MySQL-Datenbanken,
db_odbc.inc eine Version für ODBC-Datenbanken und so weiter.
Durch Einbinden der entsprechenden Version in der Datei
prepend.php3 kann man entscheiden, mit welcher Datenbank man
arbeiten möchte.

Die Klasse DB_Sql ist dabei sehr allgemein gehalten: Sie enthält
keinerlei Connect-Informationen und eine Reihe von Defaults, die
das Verhalten im Fehlerfall bestimmen. Gewöhnlich konfiguriert
man die Klasse, indem man in der Datei local.inc eine
Unterklasse von DB_Sql definiert, in der man seine eigenen
Connect-Parameter einträgt. Ändern sich die Connect-Parameter
der Anwendung, braucht man sie nur an einer Stelle in local.inc
zu ändern. Eine solche Definition kann zum Beispiel so aussehen:

```php
class DB_Example extends DB_Sql {
  var $Host     = "localhost";
  var $Database = "test";
  var $User     = "kk";
  var $Password = "";
}
```

Dies definiert eine Klasse DB_Example, die sich ganz genau wie
DB_Sql verhält, aber gegen die Datenbank test auf dem Rechner
localhost connected, indem sie sich als Benutzer kk mit einem
leeren Paßwort anmeldet. In seiner Anwendung kann man nun
Datenbankobjekte der Klasse DB_Example erzeugen und diese
Objekte wissen automatisch wo und wie sie sich anzumelden haben.


### Abfragen an eine Datenbank senden

DB_Sql merkt sich intern, ob bereits eine Datenbankverbindung
besteht oder ob noch eine erzeugt werden muß. Die Klasse kümmert
sich vor der Verarbeitung einer neuen Query auch darum, das alte
Anfrageergebnis freizugeben, wenn eines existiert. Für den
Entwickler bedeutet dies, daß er sich um diese Details nicht
mehr kümmern braucht, sondern nach dem Erzeugen seines
Datenbankobjektes direkt die Query absenden kann. Eine typische
Anwendung der Klasse sieht zum Beispiel so aus:

```php
$db = new DB_Example; // Erzeuge ein Objekt $db
$db->query("select * from beispieltabelle");
```

Das Datenbankobjekt kümmert sich hier selbstständig um den
Aufbau der Verbindung zur Datenbank und um die Schritte, die je
nach Datenbank unterschiedlich zur Verarbeitung und zum Senden
der Query notwendig sind. Das Ergebnis der Query steht nun
bereit und kann entweder manuell abgeholt werden (siehe unten)
oder einer anderen Klasse übergeben werden, die etwas damit
anfangen kann - der PHPLIB-Klasse Table zum Beispiel.

Verarbeitet man das Ergebnis der Query manuell, stehen einem
Datei die Funktionen next_record() zum Abholen des nächsten
Ergebnisses und die Funktionen f(spaltenname) ("feld") und
p(spaltenname) ("print") zum Lesen bzw. Drucken einer Spalte der
aktuellen Ergebniszeile zur Verfügung. next_record() nimmt dabei
keine Parameter und liefert ein boolean-Ergebnis, mit dem
signalisiert wird, ob noch ein Datensatz gelesen werden konnte.
f() und p() nehmen jeweils den Namen einer Spalte als Parameter
an und bearbeiten diese Spalte in der aktuellen Ergebniszeile.
f() liefert den aktuellen Spalteninhalt als Rückgabewert, p()
druckt diesen Wert und liefert kein Ergebnis. Die typische
PHPLIB-Redewendung zum Abfragen und Verarbeiten von Daten in einer
SQL-Datenbank lautet also beispielweise so:

```php
$db = new DB_Example; // Erzeuge ein Datenbankobjekt
$db->query("select * from beispieltabelle"); // Sende Query an DB
// Hier können f() und p() noch nicht verwendet werden.

printf("<table>\n");
while($db->next_record()) {
  $wert = $db->f("s"); // Merke Dir den aktuellen Wert der Spalte "s"
  printf("<tr><td>s = %s</td></tr>\n", $wert);
}
printf("</table>\n");
```

Dabei ist es sehr wichtig, die Funktionen f() und p() erst dann
zu verwenden, wenn nach dem Absenden der Query mindestens einmal
next_record() aufgerufen worden ist. Erst nach dem ersten Aufruf
von next_record() stehen im internen Puffer des
Datenbankobjektes Informationen zur Verfügung, die verarbeitet
werden können.

Wenn die Query eine Abfrage war, also das SQL-Statement 'SELECT'
enthielt, kann man mit den Funktionen num_fields() und
num_rows() die Anzahl der Spalten und Zeilen des Ergebnisses
erfragen, falls die Datenbank dies unterstützt. Bei MySQL ist
dies der Fall, aber andere Datenbanken liefern das Ergebnis
einer Query asynchron, sodaß man die Größe der Resultatmenge
nicht auf diese Weise abfragen kann: In Oracle ist es
beispielweise möglich, daß die Datenbank schon die ersten mit
next_record() abfragbaren Ergebnisse zur Verfügung stellt,
während der hintere Teil der Query noch bearbeitet wird. Die
Funktion num_rows() liefert hier immer das Ergebnis 0. In so
einem Fall muß man die Größe der Resultatmenge vorab mit einem
'SELECT count(*) FROM ...' manuell bestimmen, bevor man die
eigentlich Query danach absendet. Das erzeugt zum Glück nicht
übermäßig Last auf dem Datenbank-Server, weil dieser die Anfrage
und deren Ergebnis zwischenspeichert, sodaß die zweite Query im
Vergleich zur ersten sehr schnell bearbeitet werden kann.

Sendet man statt einer Abfrage stattdessen Anweisungen, die
Daten modifizieren, also z.B. die SQL-Anweisungen 'INSERT',
'DELETE' oder 'UPDATE', erhält man keine Ergebnismenge, die man
abfragen könnte. Stattdessen kann mit der Funktion
affected_rows() bestimmen, wieviele Zeilen durch diese Anweisung
bearbeitet worden sind. Die Redewendung, die man an dieser
Stelle immer wieder findet, lautet dann so:

```php
// $db aus dem Beispiel oben wird weiter verwendet
$db->query("insert into beispieltabelle ( s ) values ('probe')");
$erfolg = $db->affected_rows();
```

Die Variable $erfolg wird nun den Wert 1 haben, wenn der Wert
erfolgreich in die Tabelle eingefügt werden konnte, oder 0, wenn
das INSERT-Statement fehlgeschlagen ist.


### Fehlerbehandlung

DB_Sql kümmert sich, wenn dies gewünscht ist, auch automatisch
um die Behandlung von Fehlern, die durch falsches oder
fehlerhaftes SQL entstehen. Die Default-Aktion ist es, im
Fehlerfall eine Meldungsfunktion halt() aufzurufen und die
Verarbeitung dann anzuhalten. Dem Entwickler steht es dabei
frei, die Meldungsfunktion nach seinen Wünschen anzupassen.

Standardmäßig belegt die Funktion halt() die Variablen Error und
Errno mit den aktuellen Fehlercodes des Datenbankinterfaces und
ruft dann die Funktion haltmsg() auf, um eine erklärende Meldung
zu drucken und die weitere Verarbeitung dann anzuhalten.

Dieses Verhalten ist jedoch durch die Belegung der Variablen`Halt_On_Error` bestimmt:
Defaultmäßig steht diese Variable auf dem Wert "yes".
Setzt man sie auf "report",
wird die Meldung gedruckt, die weitere Verarbeitung jedoch nicht
angehalten. Setzt man sie auf "no", wird weder eine Meldung
gedruckt, noch wird das Programm abgebrochen. Es ist dann
Aufgabe der Anwendung, den Fehlerstatus durch die Abfrage von
Error und Errno zu kontrollieren.

Alternativ kann ein Entwickler auch die Funktion haltmsg()
überschreiben, um die Ausgabe von Fehlermeldungen seinen
Wünschen anzupassen. Einige Beispiele:

```php
// Diese Klasse ignoriert Datenbankfehler.
class DB_Example2 extends DB_Sql {
  var $Host     = "localhost";
  var $Database = "test";
  var $User     = "kk";
  var $Password = "";

  var $Halt_On_Error = "no"; // keine Fehlermeldungen drucken
}

// Diese Klasse meldet Datenbankfehler in einem Logfile
// und setzt die Verarbeitung dann fort.
// Im HTML-Code erscheint nichts.
class DB_Example3 extends DB_Sql {
  var $Host     = "localhost";
  var $Database = "test";
  var $User     = "kk";
  var $Password = "";

  var $Halt_On_Error = "report"; // haltmsg() aufrufen, aber weitermachen

  // unsere eigene Version von haltmsg)
  function haltmsg($msg) {
    $fp = fopen("/tmp/errorlog", "a+");
    $msg = sprintf("%s: error %s (%s) - %s\n", 
      date("Y-M-D H:i:s"),
      $this->Errno,
      $this->Error,
      $msg);
    fputs($fp, $msg);
    fclose($fp);
  }
}
```

### Metadata

Gelegentlich ist es nützlich, einige Fragen über die vorhandenen
Datenbanktabellen stellen zu können. DB_Sql stellt dafür die
Funktionen table_names() und metadata() zur Verfügung. Beide
Funktionen geben jeweils zweidimensionale Felder als Ergebnis
zurück, die entweder manuell verarbeitet werden können oder als
Eingabe für die PHPLIB-Klasse Table verwendet werden können.

Die Funktion table_names() liefert eine Liste alle Tabellen
zurück, auf die man Zugriff hat. Zu jeder Tabelle werden die
Informationen table_name, tablespace_name und database
geliefert. Ein kleines Anwendungsbeispiel zeigt, wie man auf
diese Weise eine Liste aller vorhandenen Tabellen erzeugen kann.

```php
$db = new DB_Example;
$tinfo = $db->table_names();

reset($tinfo);
while(list($k, $v) = each($tinfo)) {
  printf("Tabelle: %s  Tablespace: %s  Datenbank: %s\n",
    $tinfo[$k]["table_name"],
    $tinfo[$k]["tablespace_name"],
    $tinfo[$k]["database"]);
}
```

Die Funktion metadata() wird dann verwendet, um den Aufbau einer
Tabelle weiter zu untersuchen. Sie liefert Information über die
Spalten einer Tabelle, ebenfalls als zweidimensionales Feld, das
als Eingabe für die Table-Klasse verwendet werden kann. Ein
Anwendungsbeispiel mit Table könnte so aussehen:


```php
include("table.inc"); // Table einbinden.

$db = new DB_Example; // Datenbankobjekt
$t  = new Table;      // Table Objekt
$t->heading = "on";   // Table soll Überschriften anzeigen.

$db->metadata("beispieltabelle"); // Metadata abfragen
$t->show($db);                    // ... und darstellen.
```

Ausgegeben werden zu jeder Spalte der Name der Tabelle
("table"), der Name der Spalte ("name"), der
Typ des Datenfeldes ("type"), die Länge des Feldes
("len") und die Flags, die für dieses Feld gesetzt
sind ("flags").


### Sequenzen

In Datenbankanwendungen benötigt man oft Zähler, die eindeutige
Schlüssel für Datenbanktabellen generieren. DB_Sql stellt
hierfür die Funktion nextid() zur Verfügung, die einen solchen
Wert liefert, der garantiert eindeutig und aufsteigend ist. Die
Funktion wird mit einem Zählernamen aufgerufen und liefert dann
den jeweils nächsten Wert für diesen Zähler. Die Anwendung ist
denkbar einfach.

```php
$db = new DB_Example; // Datenbankobjekt erzeugen.
$id1 = $db->nextid("beispieltabelle");
$id2 = $db->nextid("zweite_tabelle");

$query1 = sprintf("insert into beispieltabelle ( id, s ) values ( '%s', '%s' )",
            $id1, $some_value);
$query2 = sprintf("insert into zweite_tabelle ( id, t, s_id )
                     values ( '%s', '%s', '%s' )",
            $id2, $another_value, $id1);

$db->query($query1);
$db->query($query2);
```

In diesem Beispiel werden zwei Zähler mit den Namen
beispieltabelle und zweite_tabelle geführt. Beide Zähler sind
voneinander unabhängig. Das Beispiel generiert eine Einfügung in
die Tabelle beispieltabelle mit dem gleichnamigen Zählerwert. In
einer zweiten Einfügung in die Tabelle zweite_tablle wird ein
Eintrag gemacht, der unter seiner eigenen ID abgespeichert wird
und zugleich auf einen anderen Eintrag in der Tabelle
beispieltabelle verweist.

### Locking

Die großen Datenbanken wie Oracle und Sybase haben umfangreiche
Mechanismen, um Datensätze gegen gleichzeitigen Zugriff durch
mehrere Programme zu sperren. Bei kleinen Datenbankservern wie
MySQL muß man dies dagegen selbst machen. Eine sehr einfache,
aber auch wenig effiziente Methode ist die Sperrung der ganzen
Tabelle, entweder um darin zu schreiben oder um aus ihr zu
lesen. DB_Sql stellt die Funktionen lock() und unlock() zur
Verfügung, um mit Ihnen Sperren auf ganze Tabellen zu setzen.

Die Funktion lock() kann auf zwei Arten verwendet werden.
Entweder übergibt man Ihr einen Tabellennamen und einen
Sperrmodus (Beispiel: $db->lock("beispieltabelle", "write")),
dann setzt sie ein Lock im entsprechenden Modus auf diese
Tabelle oder man übergibt Ihr einen Hash von Tabellennamen und
Modi, dann werden die entsprechenden Locks gesetzt. Das Beispiel
zeigt, wie es geht.

```php
$lock_tables = array(
  "beispieltabelle" => "write",
  "zweite_tabelle"  => "read"
);
$db->lock($lock_tables);
```

Die Sperren auf diese Tabellen bleiben bestehen, bis
$db->unlock() aufgerufen wird. Der Aufruf löscht alle
bestehenden Sperren; es ist nicht möglich, einzelne Locks
aufzugeben.

## Sessions

### Sessions konfigurieren

Eine Session ist in PHPLIB ein Weg, Variablen zu haben, die
automatisch von einer PHP-Seite zur nächsten mitgeschleppt
werden. Dazu wird dem Browser des Anwenders eine Kennung
verpaßt, die dieser bei jedem Zugriff an die Anwendung zurück
übermittelt - entweder in Form eines Cookie oder in Form eines
GET-Parameters, der an jede URL angehängt werden muß, die der
Anwender aufrufen kann. Mit Hilfe dieser Kennung kann PHPLIB nun
die mitzuschleppenden Variablen am Ende einer Seite abspeichern
und beim Zugriff auf die Folgeseite wieder laden.

Um mit Sessions zu arbeiten, muß man in seiner local.inc-Datei
eine Unterklasse der Klasse Session aus PHPLIB erzeugen. In
dieser Klasse wird wieder mit einer Reihe von Parametern
festgelegt, auf welche Weise die Variablen zu speichern sind und
auf welche Weise die Kennung weitergegeben wird. Wie schon bei
der Datenbank-Klasse geschieht dies im wesentlichen, indem man
eine Reihe von vordefinierten Variablen mit den gewünschten
Werten überschreibt. Eine Besonderheit besteht darin, daß man
(ab PHPLIB-7) der Session-Klasse mit einer Hilfsklasse (CT_SQL)
mitteilen muß, wo und auf welche Weise die Session-Daten zu
speichern sind.


```
  +---------+           enthält Code zur Verwaltung von Session-IDs,
  | Session |           zur Serialisierung von Variablen und
  +---------+           zum Abräumen alter Sessions
         |
         | benutzt
         v
     +--------+         enthält SQL-Queries, die Session-Variablen
     | CT_Sql |         laden und speichern, User authentisieren
     +--------+         und so weiter.
         |
         |  benutzt
         v
        +--------+      übernimmt die Kommunikation mit der Datenbank,
        | DB_Sql |      Fehlerbehandlung und so weiter.
        +--------+
```
**Abbildung 1:** *Beziehung zwischen den Klassen DB_Sql, CT_Sql und Session, Konfiguration zur Arbeit mit einer SQL-Datenbank*

Diese Hilfsklasse enthält die benötigten Anweisungen, um
Variablen in eine Datenbank (oder eine DBM-Datei, oder ein
shared-memory Segment, oder etwas anderes) zu speichern und von
dort zu lesen, um Benutzer zu authentisieren und weitere
Zugriffe. Die Abkürzung "CT" steht dabei für "Container", die
Klasse implementiert einen sogenannten Storage Container, der
alle Speicherzugriffe für eine andere Klasse enthält. Durch die
Auswahl eines anderen Storage Containers kann man Session dazu
bringen, Variablen nicht in einer SQL-Datenbank, sondern auf
einem anderen Speichermedium abzulegen.

```console
  +---------+                  +-----------------+
  | Session |-- abgeleitet --> | Example_Session |
  +---------+                  +-----------------+
         |                                     |
         | benutzt                             | benutzt
         v                                     v
     +--------+                   +----------------+
     | CT_Sql | -- abgeleitet --> | Example_CT_Sql |
     +--------+                   +----------------+
         |                                       |
         |  benutzt                              | benutzt
         v                                       v
        +--------+                   +------------+
        | DB_Sql | -- abgeleitet --> | DB_Example |
        +--------+                   +------------+
```

**Abbildung 2:** *Klassensystem nach dem Einlesen von local.inc.*

Durch die Definitionen in local.inc entstehen aus den
Standardklassen der Bibliothek angepaßte Unterklassen, die für
die spezielle Anwendung und Installation konfiguriert sind. Eine
PHPLIB-Anwendung verwendet immer diese angepaßten Unterklassen
aus local.inc, niemals die Standardklassen aus der Bibliothek.

In local.inc findet man also nach der Definition der Klasse für
den Datenbankzugriff (DB_Example, siehe oben) Definitionen für
den Storage Container und die Session-Klasse. Die Daten, die
konfiguriert werden müssen, sind im wesentlichen die Namen der
Klassen, so wie sie sich untereinander benutzen, d.h. man muß
dem Storage Container den Namen der Datenbank-Klasse mitteilen
und der Session-Klasse den Namen des Storage Containers, der
verwendet werden soll.

```php
class Example_CT_Sql extends CT_Sql {
  // Name der Datenbankklasse, die zu verwenden ist.
  var $database_class = "DB_Example";

  // Name der SQL-Tabelle, die zu verwenden ist.
  var $database_table = "active_sessions";
}                              

class Example_Session extends Session {
  // Muß vorhanden sein, damit die Klasse gespeichert werden kann.
  var $classname = "Example_Session";

  // Muß für jede Installation anders sein
  var $magic          = "Hocuspocus";

  // Name der Storage Container-Klasse, die zu verwenden ist.
  var $that_class     = "Example_CT_Sql";
}
```

Im Storage Container wird durch den Namen der Datenbank-Klasse
implizit klargemacht, an welchen Server mit welchem
Benutzernamen und welchem Paßwort connected werden soll.
Außerdem kann konfiguriert werden, wie der Name der Tabelle
lautet, in dem später einmal die Session-Daten gespeichert
werden sollen. Damit dies mit den create_database-Definitionen
aus dem stuff/-Verzeichnis zusammenspielt, sollte dieser Name
active_sessions sein.

In der Session-Klasse ist vor allen Dingen der Name des Storage
Containers zu definieren, der verwendet werden soll, hier also
Example_CT_Sql. In der Variablen magic steht außerdem ein
String, der bei der Generierung der Session-IDs verwendung
findet, und der bei jeder Installation von PHPLIB auf einen
anderen Wert gesetzt werden sollte, damit die Session-IDs
schwerer zu fälschen sind. Die Variable classname wird intern
von PHPLIB verwendet, um Objekte zu laden und zu speichern und
sollte den genauen Namen der Klasse selbst enthalten, hier also
Example_Session.

PHPLIB-Sessions haben nun zwar noch eine ganze Menge Knöpfe, an
denen man drehen und einstellen kann, aber die Session-Klasse
ist nun schon benutzbar. Eine Seite mit Session-Variablen sieht
wie nachstehend gezeigt aus.

```php
<?php
  // Laden der Variablen aus der Datenbank.
  page_open(array("sess" => "Example_Session"));

  // Die globale Variable $s ist nun bei der Session registriert.
  $sess->register("s");

  // $s wird auf einen definierten Startwert gesetzt, wenn die
  // Variable noch nicht existiert.
  if (!isset($s)) 
    $s = 0;

  // $s hochzählen.
  $s++;
 ?>
<html>
 <head>
  <title>Eine Testseite</title>
 </head>
 <body>
  <h1>Eine Testseite</h1>

  Die Variable $s hat den Wert <?php print $s ?>.
 </body>
</html>
<?php
  // Zurückspeichern der Variablen in die Datenbank
  page_close();
 ?>
```

Durch das auto_prepend_file, das in der php3.ini konfiguriert
wird, wird dieser Datei der Inhalt von prepend.php3
vorangestellt. 

prepend.php3 lädt jetzt alle weiteren Dateien,
die für die Ausführung dieser Seite benötigt werden, d.h. es
bindet db_mysql.inc, session.inc, page.inc, local.inc und ggf.
noch weitere, hier noch nicht benutzte Dateien ein. Dadurch sind
am Anfang dieses Programmes eine Reihe von Funktionen und
Klassen definiert, die zu PHPLIB gehören.

Das Beispielprogramm
selbst verwendet dann die vordefinierten PHPLIB-Funktionen
page_open() und page_close(), um Variablen am Anfang der Seite
einzulesen und am Ende der Seite wieder abzuspeichern. Der
Funktion page_open() wird dabei mitgeteilt, daß diese Seite die
Session-Funktionalität von PHPLIB verwenden möchte und zwar wie
sie in der Klasse Example_Session konfiguriert ist. 

Das Resultat
ist ein globales Example_Session Objekt mit dem Namen $sess. Man
kann jetzt Funktionen von Example_Session (also Funktionen von
Session) aufrufen, um Variablennamen bei der Session zu
registrieren.

Im Beispielprogramm wird dies durch den Aufruf
$sess->register("s") gemacht, der die globale Variable mit dem
Namen "s" bei der Session anmeldet. Fortan wird bei jedem Aufruf
von page_close() der aktuelle Typ und Wert von $s gerettet und
bei einem Aufruf von page_open() wieder hergestellt. 

Sobald der
Name "s" erst einmal bei einer Session registriert ist, bleibt
er solange Bestandteil der Session, bis er mit
$sess->unregister("s") wieder abgemeldet wird. Andererseits
schadet es nichts, einen Namen mehr als einmal bei einer Session
zu registrieren. Die Beispielseite merkt sich nun also den Wert
von $s und kann ihn so von einem Aufruf der Seite zum nächsten
hochzählen.

Wenn man die Seite aufruft und seinen Browser so eingestellt
hat, daß er beim Setzen von Cookies eine Warnung ausgibt, dann
wird man feststellen, daß der Webbrowser versucht, einen Cookie
mit dem Namen "Example_Session" auf irgendeinen wilden Wert zu
setzen. Dieser Cookie identifiziert den Browser eindeutig und in
der Tabelle active_sessions in der Datenbank werden unter dem
Wert des Cookies die Variablen abgespeichert, die zu dieser
Session gehören (aus technischen Gründen sind die Werte dort mit
base64_encode() codiert abgespeichert, aber man kann sich die
Innereien von PHPLIB ansehen, wenn man die Inhalte von
active_sessions.val mit base64_code() decodiert).

Jeder Anwender
hat also seinen eigenen Cookie mit einem eindeutigen Wert und in
der Datenbank seinen eigenen Satz Variablen, der zu diesem
Cookie gehört. PHPLIB verwendet sogenannte Session-Cookies, d.h.
die Cookies werden im Browser ohne eine Zeitbegrenzung gesetzt,
aber der Browser speichert die Cookies niemals in einer
cookies.txt-Datei ab. Die Session "lebt" also solange, wie der
Browser des Anwenders läuft. Beendet der Anwender seinen
Browser, ist der Cookie gelöscht und die Session verloren.

Man kann dies ändern, indem man die Variable $lifetime in seiner
Session definiert. Die Variable gibt an, wieviele Minuten lang
der Cookie mit der Session-ID gelten soll. Setzt man die
Variable also auf den Wert 1440, dann wird die Anwendung
versuchen, einen Cookie mit einer Lebensdauer von einem Tag zu
setzen. In der Praxis hat sich dies nicht als empfehlenswert
erwiesen, daher verwendet PHPLIB standardmäßig Session-Cookies.

```php
class Lifetime_Session extends Session {
  var $classname = "GET_Session";

  var $magic = "sonstwas";
  var $that_class = "Example_CT_Sql";

  // Session-ID Cookie soll einen Tag lang gehalten werden.
  var $lifetime  = 1440; // das sind Minuten.
}
```

### Sessions mit GET-Mode

Einige Anwender sind durch die Medien zu einer regelrechten
Cookie-Paranoia erzogen worden und haben ihrem Browser verboten,
Cookies anzunehmen oder zu senden. PHPLIB kann in diesem Fall
nicht funktionieren. 

Um das Problem zu umgehen kennt PHPLIB den
sogenannten GET-Mode. In diesem Fall wird die Session-ID nicht
per Cookie zur Anwendung übertragen, sondern als GET-Parameter
von Seite zu Seite als Bestandteil der URL durchgeschleift. Man
überredet PHPLIB dazu, GET-Mode zu verwenden, indem man den
entsprechenden Parameter in der Session-Klasse setzt.

```php
class GET_Session extends Session {
  var $classname = "GET_Session";

  var $magic = "sonstwas";
  var $that_class = "Example_CT_Sql";

  // unterschiedslos GET-Mode verwenden
  var $mode = "get";
}

class Fallback_Session extends Session {
  var $classname = "Fallback_Session";

  var $magic = "was anderes";
  var $that_class = "Example_CT_Sql";

  // Cookies probieren, automatisch auf GET-Mode zurückschalten
  var $mode          = "cookie";
  var $fallback_mode = "get";
}
```

Setzt man die Variable $mode auf "get", verwendet die Anwendung
immer GET-Parameter, um die Session-ID von Seite zu Seite
weiterzugeben. Dies hat jedoch eine Reihe von Nachteilen: Zum
Beispiel wird die Session-ID dadurch Bestandteil von Bookmarks
oder sie wird womöglich sogar von irgendwelchen Redakteuren in
Zeitschriften abgedruckt. Auch geht die Session verloren, wenn
ein Anwender in seinem Browser einmal schnell eine andere Seite
aufruft und dann zu unserer Anwendung zurückkehrt - dies ist bei
Cookie-Mode nicht der Fall.

Daher kann man PHPLIB auch so konfigurieren, wie in der Klasse
Fallback_Session gezeigt. In diesem Fall versucht PHPLIB beim
Start der Session sowohl Cookies als auch GET-Parameter zu
benutzen. Ist auf den Folgeseiten der Cookie gesetzt, wird
weiter Cookie-Mode verwendet. Hat der Anwender jedoch die
Annahme von Cookies verweigert, schaltet PHPLIB automatisch auf
GET-Parameter um.

In beiden Fällen muß man seine Anwendung jedoch speziell
präparieren, damit die Session-ID in der URL weitergereicht
wird. Genaugenommen muß man alle URLs in seiner Anwendung durch
PHPLIB erzeugen lassen, anstatt sie einfach ins HTML zu
schreiben, d.h. man muß statt

```php
<a href="/index.html">zurück zur Hauptseite</a>

<a href="<?php $sess->purl("/index.html")>">zurück zur Hauptseite</a>
```

schreiben, und zwar für _alle_ A, FRAME und FORM-Tags. Die
Funktion $sess->url() liefert in Abhängigkeit von der aktuellen
Betriebsart eine passende URL mit Session-ID für die angegebene
Parameter-URL zurück. Die Funktion purl() macht genau dasselbe,
druckt diese URL aber gleich aus. Das bedeutet, wenn der
Anwender Cookies eingeschaltet hat, wird die Funktion
tatsächlich die URL "/index.html" ausgeben. Ist stattdessen aber
die Annahme von Cookies beim Anwender blockiert, dann wird von
purl() stattdessen die URL "/index.html?Fallback_Session=...."
erzeugt. 

Wie man sieht, ist dieses Verfahren sehr aufwendig in der
Codierung: Man muß jedes Link und jede URL in seiner Anwendung
manuell anfassen und auf PHP umstellen. Dies ist leider nicht zu
ändern, daß die Sprache PHP3 normales HTML niemals anfaßt,
sondern ausschließlich PHP-Sektionen interpretiert. Wenn man
sich dennoch entschließt, dieses Verfahren anzuwenden, sollte
man sich auf jeden Fall für die Fallback-Lösung entscheiden,
weil diese für die Anwender, die Cookies eingeschaltet haben,
wesentlich bequemer und betriebssicherer ist.

### Sessions initialisieren

Beim Start einer Anwendung, also wenn eine neue Session erzeugt
wird, ist es oftmals notwendig, eine Reihe von Variablen mit
passenden Startwerten zu belegen. 

PHPLIB sieht dafür die
Variable $auto_init vor, mit der man den Namen einer
Include-Datei festlegen kann, die beim Start einer Session
geladen und ausgeführt wird. Per Konvention wird diese Datei in
der Regel "setup.inc" genannt. Anweisungen in dieser Datei
werden im Kontext einer Funktion ausgeführt, daher müssen
globale Variablen, die vorbelegt werden sollen, mittels der
PHP-Anweisung "global" vorher exportiert werden. 

Das Beispiel
mit Example_Session und der globalen Variablen $s (siehe oben)
läßt sich damit auch wie nachstehend realisieren.

In local.inc:

```php
class Beispiel_Session extends Session { 
  var $classname = "Beispiel_Session";

  var $magic = "ein weiterer String";
  var $that_class = "Example_CT_Sql";

  // Diese Datei soll beim Session-Start geladen werden
  var $auto_init = "setup.inc";
}
```

In setup.inc:

```php
<?php
  // $s als globale Variable deklarieren
  global $s;

  // $s mit einem Startwert vorbelegen.
  $s = 0;

  // Den Namen von $s registrieren
  $sess->register("s");
 ?>
```

Die Beispielseite:

```php
<?php
  page_open(array("sess" => "Beispiel_Session"));
  $s++;
 ?>
<html>
 <head>
  <title>Überarbeitete Beispielseite</title>
 </head>
 <body>
  <h1>Überarbeitete Beispielseite</h1>

  Der Wert von $s ist <?php print $s ?>.
 </body>
</html>
<?php
  page_close();
 ?>
```

Dieses Feature ist vor allen Dingen dann interessant, wenn eine
Anwendung aus einer Vielzahl von Seiten besteht und keine
ausdrückliche Startseite besteht, d.h. wenn Anwender irgendeine
Seite der Anwendung aufrufen können, um sie zu starten.

"setup.inc" wird in solchen Situationen in jedem Fall aufgerufen
und sorgt für eine korrekte Initialisierung der Anwendung.

### Caching kontrollieren

PHPLIB-Seiten sind meistens veränderlich und dürfen daher von
einem öffentlichen Cache wie z.B. dem Squid-Cache der Firma oder
des Providers nicht gespeichert werden. Wenn das nicht so wäre,
könnte es sein, daß andere Anwender Seiten aus diesem Cache
bekommen, die Inhalte enthalten, die nicht für sie bestimmt
waren. Anders sieht es mit privaten Caches aus, etwa dem Cache,
den Netscape für jeden Anwender getrennt anlegt. In vielen
Anwendungen ist es zulässig, daß Seiten hier abgelegt werden, um
den Bildaufbau zu beschleunigen. Dies ist zugleich auch die
Default-Einstellung von PHPLIB (ab Version 7, Version 6.x verbot
das Caching von Seiten vollständig).

Mittels der Variablen $allowcache und $allowcache_expire kann
man festlegen, wie PHPLIB-erzeugte Seiten in Caches gelagert
werden dürfen und, falls sie gecached werden dürfen, wie lange
sie im Cache verbleiben können. Für die Variable $allowcache
sind die drei Werte "public", "private" (der Default) und "no"
zugelassen. Mit der Einstellung "public" sendet PHPLIB eine
entsprechende Cache-Control-Zeile als Header, die die
Speicherung der Seite in öffentliches Caches zuläßt; mit der
Einstellung "private" ist nur die Speicherung in privaten Caches
zugelassen. In beiden Fällen wird dem Cache die Speicherung der
Seite für $allowcache_expire Minuten gestattet, der Defaultwert
ist hier 1440 Minuten, also ein Tag.

Setzt man den Wert von allowcache auf "no", erzeugt PHPLIB
$Headerzeilen, die jegliches Caching der Seite - wo auch immer -
verbieten. Netscape fordert die Seite hier schon dann neu an,
wenn man nur die Größe des Browserfensters verändert.

```php
class Nocache_Session extends Session {
  var $classname = "Nocache_Session";

  var $magic = "schon wieder ein String";
  var $that_class = "Example_CT_Sql";

  // Caching verbieten
  var $allowcache = "no";
}
```

### Sessions und ein Warenkorb

Mit Hilfe der Sessions und der Klasse Cart von PHPLIB kann man
sich recht einfach einen Warenkorb für einen Webshop gestalten.
Die Klasse Cart ist in der Include-Datei "cart.inc" von PHPLIB
definiert. Damit man sie verwenden kann, muß man sie auf seinen
Webseiten einbinden. Zweckmäßigerweise geschieht dies indem man
in der Datei prepend.php3 an der markierten Stelle die Anweisung
'require("cart.inc")' einfügt.

Um einen Warenkorb verwenden zu können, muß man sich beim Start
einer Session einen definieren. Am einfachsten geschieht dies
mit dem bereits erwähnten auto_init-Feature der Session-Klasse.

In prepend.php3:

```php
[ ... gekürzt ... ]
/* Additional require statements go below this line */

require($_PHPLIB["libdir"] . "util.inc");      /* General utility functions */
require("cart.inc"); // eingefügt

/* Additional require statements go before this line */
[ ... gekürzt ... ]
```

In local.inc:

```php
[ ... Definition der Datenbank- und Storage-Containerklasse gekürzt ... ]

class Shop_Session extends Session {
  var $classname = "Shop_Session";

  var $magic = "kaufmich";
  var $that_class = "Example_CT_Sql";

  var $auto_init = "setup.inc";
  var $mode = "cookie";
}

class My_Cart extends Cart {
  // hier Funktionsdefinitionen einfügen, wie weiter unten
  // im Text gezeigt.
}
```

In setup.inc:

```php
<?php
  global $cart;
  if (! is_object($cart)) {
    $cart = new My_Cart;
    $sess->register("cart");
  }
?>
```

Der Warenkorb aus PHPLIB ist sehr einfach gehalten und kann
Paare aus Artikelnummern und Anzahlen speichern. Mit Hilfe der
Funktionen $cart->add_item($artikelnummer, $anzahl) kann man
$anzahl viele Artikel mit der genannten Nummer zum Warenkorb
hinzufügen, mit $cart->remove_item($artikelnummer, $anzahl)
wieder entfernen. Mit Hilfe der Funktion
$cart->set_item($artikelnummer, $anzahl) kann man die Anzahl der
Artikel mit der genannten Nummer im Warenkorb direkt setzen. Der
Warenkorb ist dabei intelligent genug, einen Artikel aus dem
Warenkorb zu entfernen, wenn die Anzahl der Artikel auf 0 sinkt.

Den Inhalt des gesamten Warenkorbes kann man sich mit Hilfe der
Funktion $cart->show_all() anzeigen lassen. Der Cart ruft dabei
intern zunächst die Funktion $cart->show_cart_open() auf, um
dann für jeden Artikel im Warenkorb
$cart->show_cart_item($artikelnummer, $anzahl) einmal
aufzurufen. Am Ende wird die Anzeige mit einem Aufruf von
$cart->show_cart_close() beendet. Ist der Warenkorb leer, wird
stattdessen nur die Funktion $cart->show_cart_empty()
aufgerufen.

In Cart sind diese Funktionen nur mit der notwendigsten
Anzeigelogik ausgestattet, um den Inhalt des Warenkorbes
darzustellen. In einer konkreten Anwendung wird man daher die
vier Anzeigefunktionen mit eigenem Code überschreiben wollen,
der in der Definition von My_Cart in local.inc eingefügt werden
muß.

```php
cart My_Cart extends Cart {
  // Gesamtwert des Warenkorbes
  var $summe = 0.0;

  // Paare Artikelnummer => Preis
  var $preis = array(
    "0815"  => 17.85,
    "4711"  => 21.30,
    "64738" => 9.99
  );

  // Paare Artikelnummer => Beschreibung
  var $beschreibung = array(
    "0815"  => "Artikel 1",
    "4711"  => "Artikel 2",
    "64738" => "Artikel 3"
  );

  // Eine Tabelle eröffnen und eine Summe auf 0 setzen.
  function show_cart_open() {
    printf("<table>");
    $this->summe = 0.0
  }

  // Gesamtsumme drucken und Tabelle abschließen.
  function show_cart_close() {
    printf(" <tr>\n");
    printf("  <td>Gesamtsumme:</td>\n");
    printf("  <td>%8.2f</td>\n", $this->summe);
    printf(" </tr>\n");
    printf("</table>\n");
  }

  // Einen einzelnen Artikel drucken.
  // Summe mitführen.
  function show_cart_item($art, $anz) {
    $this->summe += $this->preis[$art] * $anz;
    printf(" <tr>\n");
    printf("  <td>%s</td>\n", $this->beschreibung["art"]);
    printf("  <td>%8.2f DM (%d Stück zu %8.2f DM)</td>\n", 
     $this->preis[$art] * $anz, $anz, $this->preis[$art]);
    printf(" </tr>\n");
  }
}
```

In einer konkreten Anwendung wird man die Beschreibungen und
Preise der Artikel jedoch auch nicht hart codieren, sondern mit
Hilfe der Artikelnummer aus einer Datenbank abfragen.

## Seiten mit Login

Sessions geben dem Entwickler Webseiten mit
"Erinnerungsvermögen". Sobald man dieses hat, kann man auf der
Grundlage dieser Eigenschaft weitere Features realisieren. 

Man kann sich zum Beispiel daran erinnern, ob ein Anwender im Rahmen
dieser Session schon einmal einen Benutzernamen und ein Paßwort
angegeben hat und wann das der Fall war. Dieses Feature nennt
man Authentication, Authentifizierung, und PHPLIB bietet mit der
Klasse Auth eine eigene Implementierung davon an.

PHPLIB Authentifizierung leistet vergleichbares wie HTTP
Authentifzierung, hat jedoch weder in der Implementierung noch
in der Konfigurierung etwas damit zu tun. Warum also eine eigene
Lösung?

HTTP Authentifizierung sind die kleinen grauen Login-Fenster mit
Username und Paßwort, die auf Paßwortgeschützten Webseiten
aufgehen. Sie haben gegenüber der Authentifizierung von PHPLIB
eine Reihe von Nachteilen. PHPLIB Auth hat im einzelnen die
folgenden Vorteile:

<ul>
<li>PHPLIB Authentifizierung hat ein kontrolliertes
  Logout-Verfahren.
<li>Dieses Logoutverfahren kann auch automatisch ablaufen: Wenn
  ein Anwender eine gewisse Zeit lang keine Seiten abgerufen
  hat, ist er automatisch ausgeloggt.
<li>Der Loginschirm ist kein kleiner grauer Requester, sondern
  eine reguläre HTML-Seite. Dem Entwickler stehen also alle
  Gestaltungsmöglichkeiten zur Verfügung: Ein Loginschirm kann
  nicht nur ein Firmenlogo oder andere Grafik enthalten, sondern
  auch eine Benutzerführung und Online-Hilfe.
<li>Die Authentifizierung erfolgt gegen eine beliebige
  Datenquelle, zum Beispiel einen SMB-Server (NT
  Domaincontroller), einen LDAP-Server oder, wie in der
  Standarddistribution von PHPLIB gezeigt, gegen eine
  Datenbanktabelle. Da die Authentifierung durch eine
  benutzerdefinierte PHP3-Funktion erfolgt, kann sie
  vollkommen frei den Bedürfnissen angepaßt werden.
<li>Die Authentifizierung erfolgt seitenweise, nicht für
  Teilbäume von Seiten.
<li>Es ist möglich, Authentisierung mit Registrierung zu
  erzeugen: Anwender, die noch kein Paßwort haben, können
  ein Formular mit Benutzerdaten ausfüllen und die Anwendung
  legt den Benutzer nach Bedarf und mit Standardrechten an.
<li>PHPLIB Auth funktioniert mit CGI PHP und mit mod_php, während
  durch PHP gesteuerte HTTP Authentifizierung nur mit mod_php
  korrekt funktioniert.
<li>PHPLIB Auth ist direkt mit einem Zugriffrechteschema
  gekoppelt, sodaß man ganze Seiten oder Teile von Seiten nur
  für Benutzer mit den passenden Rechten sichtbar werden lassen
  kann.
</ul>

### Login konfigurieren

In PHPLIB erzeugt man Seiten mit einem Login - wie könnte es
anders sein - indem man eine Unterklasse der PHPLIB-Klasse Auth
erzeugt. Eine Beispiel-Unterklasse ist in der Datei local.inc in
der Distribution bereits enthalten. Diese Unterklasse verwendet
eine Datenbanktabelle auth_user, um Loginnamen und Paßworte zu
speichern.

```console
+------+                   +--------------+
| Auth | -- abgeleitet --> | Example_Auth |
+------+                   +--------------+
     |                                   |
     |  benutzt                          | benutzt
     v                                   v
    +--------+                   +------------+
    | DB_Sql | -- abgeleitet --> | DB_Example |
    +--------+                   +------------+
```

**Abbildung 3:** *Klassenschema von Auth für den Gebrauch mit
 local.inc.*

Eine Unterklasse von Auth muß mindestens die Funktionen
auth_loginform() und auth_validatelogin() definieren. Die
Funktion auth_loginform() wird aufgerufen, um den
Loginbildschirm selbst zu malen. Dieser Loginbildschirm muß alle
benötigten Eingabefelder enthalten, damit der Benutzer sich
identifizieren und authentisieren kann.

In der Regel wird der
Loginschirm also ein Feld für die Eingabe des Benutzernamens und
ein Feld für die Eingabe eines Paßwortes enthalten. Wird dieses
Formular abgeschickt, werden seine Inhalte auf dem Server der
Funktion auth_validatelogin() bereitgestellt. Diese Funktion
kann mit den Eingabedaten aus dem Formular beliebige Dinge
anstellen, um die Identität des Benutzers zu bestätigen. 

Die Auth-Klasse erwartet, daß die Funktion den Wert "false" liefert,
falls das Login nicht stimmig ist, oder eine gültige User-ID,
falls das Login korrekt ist. Wie die Funktion die User-ID
ermittelt und welcher anderen Hilfsmittel sie sich dazu bedient
(zum Beispiel einer Datenbankverbindung durch ein
Datenbankobjekt), ist der Auth-Klasse selbst vollkommen egal.

Das Standardbeispiel einer Unterklasse von Auth geht davon aus,
daß es eine Tabelle auth_users in der Datenbank gibt, die den
nachstehend gezeigten Aufbau hat. Zu jedem Benutzer werden ein
Benutzername username und das dazugehörige Paßwort password
gespeichert. Außerdem gehören zu einem Benutzer noch die
gewünschten Berechtigungen perms und die interne User-ID uid,
mit der die Auth-Klasse arbeitet.

Im stuff-Verzeichnis der
PHPLIB-Distribution befinden sich create_database.*-Dateien für
die unterschiedlichen vom PHPLIB unterstützten Datenbanken, mit
denen man diese Tabellen leicht anlegen kann.

```console
+----------+--------------+------+-----+---------+-------+
| Field    | Type         | Null | Key | Default | Extra |
+----------+--------------+------+-----+---------+-------+
| uid      | varchar(32)  |      | PRI |         |       |
| username | varchar(32)  |      | UNI |         |       |
| password | varchar(32)  |      |     |         |       |
| perms    | varchar(255) | YES  |     | NULL    |       |
+----------+--------------+------+-----+---------+-------+
4 rows in set (0.00 sec)
```
**Abbildung 4:** *Aufbau der Tabelle auth_users*

PHPLIB arbeitet intern immer mit User-IDs, weil diese ein
festgelegtes Format haben (dasselbe die Session_IDs). Diese
User-IDs werden ausschließlich intern verwendet und sind für den
Anwender niemals sichtbar. Nach außen präsentiert die Anwendung
immer die menschenlesbare Benutzeridentifikation, hier also den
Benutzernamen username. Da PHPLIB jedoch mit beliebigen
Loginverfahren arbeiten können soll, darf die Bibliothek keine
Annahmen über die menschenlesbare Benutzeridentifikation machen  -
statt eines einzelnen Feldes username ist es genauso möglich,
ein Tripel (vorname, nachname, telefon) zu definieren und zu
verlangen, daß diese drei Werte statt eines Benutzernamens
eingegeben werden. Die auth_user-Tabelle dient dann dazu, diese
externe Darstellung einer Benutzeridentität in das festgelegte
interne Format, die uid, zu übersetzen.

Eine eigene Auth-Klasse beginnt damit, daß sie Auth erweitert.
Es können einige Variablen vorbelegt werden, die das Verhalten
von Auth steuern, aber im einfachsten Fall genügt die
nachstehende Definition:

```php
class Example_Auth extends Auth {
  var $classname = "Example_Auth"; # Name der Klasse

  var $lifetime  = 15;             # Nach 15 Minuten Inaktivität wird der 
                                   # User automatisch ausgeloggt.

  # Name der Klasse und Tabelle für den Datenbankzugriff
  var $database_class = "DB_Example";
  var $database_table = "auth_user";

  function auth_loginform() {
    global $sess;

    include("loginform.ihtml");
  }

  function auth_validatelogin() {
    # Siehe weiter unten.
  }
}
```

Die Funktion auth_loginform(), die der Entwickler selber
schreiben muß, hat die Aufgabe, den Loginschirm zu zeichnen. Wir
tun dies hier im Beispiel einfach dadurch, daß wir die Datei
loginform.ihtml aus dem Includeverzeichnis einbinden. Die Datei
enthält ein gewöhnliches HTML-Formular, das in einer Tabelle
zwei Eingabefelder für einen Usernamen und ein Paßwort zeichnet.

Das Formular übergibt das Ergebnis der Eingabe in den globalen
Variablen $username und $password. Nach der Eingabe wird die
Funktion auth_validatelogin() von der Auth-Klasse aufgerufen, um
die Eingabe zu prüfen. Da es sich bei den beiden Variablen um
globale Variablen handelt, muß die Funktion auth_validatelogin()
diese Werte zunächst einmal importieren. Sie kann dann in der
Datenbank nachschlagen, ob es einen Wert in der Datenbank gibt,
bei dem sowohl der Username als auch das Paßwort zutreffend
sind.

Falls ja, wird die zugehörige User-ID an die Auth-Klasse
zurückgegeben. Andernfalls wird mit einem false ein Fehlschlag
signalisiert. Die Funktion auth_validatelogin() sieht
entsprechend aus wie unten gezeigt.

```php
  function auth_validatelogin() {
    global $username, $password;

    if (isset($username)) {
      # $username merken, damit er im loginform wieder zur Verfügung steht.
      $this->auth["uname"] = $username;
    }

    # Default-Ergebnis: kein Login möglich
    $uid = false; 

    # Suche in der Datenbank nach $username/$password
    $query = sprintf("select uid, perms from %s
                      where username = '%s'
                        and password = '%s'",
      $this->database_table,
      addslashes($username),
      addslashes($password));
    $this->db->query($query);

    # Hat es Treffer gegeben?
    while ($this->db->next_record()) {
      # uid merken für die Rückgabe
      $uid = $this->db->f("uid");

      # Die Zugriffsrechte merken wir uns hier nur, um es
      # Perm nachher einfacher zu machen. Erklärung folgt weiter
      # unten.
      $this->auth["perm"] = $this->db->f("perms");
    }

    # An dieser Stelle hat $uid entweder einen Wert aus
    # der Datenbank oder ist false.
    return $uid;
  }
```

Mit Hilfe dieser Klasse kann jetzt eine einzelne Seite geschützt
werden. Dazu ist der Aufruf von page_open() im Kopf der Seite um
ein weiteres Feature zu ergänzen: Neben dem Namen der Klasse für
das Session-Management ist dort auch noch der Name der Klasse
für die Benutzeranmeldung mit anzugeben. Die entsprechende Zeile
sieht so aus:

```php
<?php
  page_open(array("sess" => "Example_Session",
                  "auth" => "Example_Auth"));
 ?>
<html>
 <head>
  <title>Seite mit Zugriffschutz</title>
 </head>

 <body bgcolor="#ffffff">
 <h1>Seite mit Zugriffschutz</h1>

 Ihr Benutzername ist <?php print $auth->auth["uname"] ?>
 und ihre User-ID ist <?php print $auth->auth["uid"] ?>.

 </body>
</html>
<?php
  page_close();
 ?>
```

Die Auth-Klasse bzw. ihre Unterklasse Example_Auth sorgt dafür,
daß der Funktionsaufruf page_open() nur dann erfolgreich
zurückkehrt, wenn der betreffende Benutzer sich erfolgreich
anmelden konnte. Intern startet page_open() bei dem gezeigten
Aufruf die Funktionen des Example_Auth-Objektes und dieses sorgt
bei nicht angemeldeten Benutzern dafür, daß der Loginschirm
gemalt wird und das Programm dann beendet wird. Das bedeutet: In
so einem Fall wird der Rest der Seite, nach dem
page_open()-Aufruf, gar nicht mehr angezeigt.

### Weitergehende Konfigurationsmöglichkeiten

Wie die Session-Klasse verfügt auch die Auth-Klasse über einige
vordefinierte Variablen, mit denen man ihr Verhalten
beeinflussen kann.

Die wichtigste ist die Variable $lifetime,
mit der man die Lebensdauer einer Anmeldung in Minuten festlegen
kann. Ist ein Benutzer für die angegebene Zeit oder länger
inaktiv, erlischt seine Anmeldung automatisch und er muß sich
beim System erneut anmelden.

Die $lifetime einer Auth-Klasse
unterscheidet sich fundamental von der $lifetime einer
Session-Klasse und man muß beide genau unterscheiden: Die
Lifetime einer Session bestimmt, wie lange der Cookie im Browser
des Users gültig ist. Erlischt eine Session, ist nicht nur die
Anmeldung eines Benutzers verloren, sondern alle seine Variablen
sind unerreichbar. Sie stehen zwar noch einige Zeit in der
Datenbank, aber ohne die Session-ID im Cookie des Browsers sind
sie nicht mit dem Browser zu verknüpfen.

Im Gegensatz dazu
bestimmt die $lifetime einer Auth-Klasse, wie lange die
Anmeldung eines Benutzers inaktiv sein kann. Erlischt die
$lifetime einer Auth-Klasse, erscheint zwar beim folgenden
Zugriff auf die Anwendung der Loginbildschirm, aber die Daten
des Benutzers sind nicht verloren und nach einer erneuten
Anmeldung kann er weiterarbeiten als sei nichts geschehen.

Der empfohlene Wert für die $lifetime einer Session ist 0 - in
diesem Fall verwendet PHPLIB Session-Cookies, die nicht in der
cookies.txt des Browsers gespeichert werden und die mit dem
Beenden des Browsers automatisch verloren gehen. Da
Session-Cookies keine zeitlich begrenzte Laufzeit haben,
brauchen sie auch nicht erneuert zu werden. Es genügt, sie
einmal beim Setup der Session zu setzen.

Der empfohlene Wert für
die $lifetime einer Auth-Klasse ist irgendwo zwischen 15 und 60
Minuten anzusiedeln. Die $lifetime einer Auth-Klasse ist eine
rein interne Sache der Datenbank, sie braucht nicht über Cookies
erneuert zu werden.

Mit Hilfe der Variablen $mode, die die Werte "log" (default) und
"reg" annehmen kann, kann man PHPLIB aus demLoginmodus in den
Registrierungsmodus bringen. Im Registrierungsmodus werden statt
der beiden Funktionen auth_loginform() und auth_validatelogin()
die Funktionen auth_registerform() und auth_doregister()
aufgerufen.

auth_registerform() muß wieder einen Bildschirm
zeichnen, in dem in diesem Fall die von dem Benutzer vorlangten
Daten abgefragt werden und auth_doregister() hat dann diese
Informationen in die Datenbank einzutragen und die User-ID des
Benutzers zurückzuliefern.

Schließlich gibt es noch die Variable $nobody, mit der man
die sogenannte Default Authentication erzeugen kann. Mehr dazu
weiter unten.

## Zugriffsrechte

Sobald man weiß, um wen es sich bei einem Benutzer handelt, kann
man sich überlegen, welche Zugriffsrechte man diesem Benutzer
gestatten möchte: Wenn man einen Benutzer authentisiert hat,
kann man sich um seine Autorisierung kümmern. 

In PHPLIB wird
dies durch die Klasse Perm erledigt, in der die Zugriffsrechte,
die die Anwendung kennt, definiert werden und die im Fehlerfall
einen Bildschirm zeichnet, der den Benutzer draußen hält. Als
Entwickler muß man dazu die Klasse Perm durch Bildung einer
Unterklasse an seine Bedürfnisse anpassen. Die Abbildung zeigt
das zugehörige Klassendiagramm.

```php
+------+                   +--------------+
| Perm | -- abgeleitet --> | Example_Perm |
+------+                   +--------------+
```

**Abbildung 5:** *Klassendiagramm zur Anwendung der Klasse Perm.*

In der Unterklasse von Perm kann man mit Hilfe des Arrays
$permissions definieren, welche Zugriffsrechte unsere Anwendung
erkennt. Bei den Zugriffsrechten handelt es sich um Namen für
Bitmuster, zum Beispiel "user", "author", "editor", "supervisor"
und "admin" in dem in local.inc in der Distribution
mitgelieferten Beispiel. Im Beispiel wird jedes dieser
Zugriffsrechte auf ein einzelnes Bit abgebildet.

```php
class Example_Perm extends Perm {
  var $classname = "Example_Perm";

  var $permissions = array(
                            "user"       => 1,
                            "author"     => 2,
                            "editor"     => 4,
                            "supervisor" => 8,
                            "admin"      => 16
                          );

  function perm_invalid($does_have, $must_have) {
    global $perm, $auth, $sess;
    global $_PHPLIB;

    include($_PHPLIB["libdir"] . "perminvalid.ihtml");
  }
}
```

Ein User kann beliebig viele dieser Zugriffsrechte in dem Feld
perms der Tabelle auth_user zugewiesen bekommen. Dazu sind die
Zugriffsrechte dieses Users durch Komma getrennt aufzuführen -
Wichtig: Keine Leerzeichen! Die Rechte müssen direkt
hintereinander geschrieben werden, also z.B. "user,admin". 

Der Benutzer hat dann die effektiven Zugriffsrechte der Ver-ODER-ung
beider Bitmuster. PHPLIB nimmt die Zugriffsrechte des Benutzers
und prüft diese gegen die Zugriffsrechte, die zum Betreten der
Seite notwendig sind.

Dies geschieht mit der Funktion check(), etwa so:

```php
<?php
  page_open(array("sess" => "Example_Session",
                  "auth" => "Example_Auth",
                  "perm" => "Example_Perm"));
  # Zum Betreten dieser Seite sind "user"-Rechte notwendig.
  $perm->check("user,admin");
 ?>
<html>
<head>
 <title>Herzlichen Glückwunsch</title>
</head>
<body>
 <h1>Sie sind berechtigt</h1>

Wenn Sie dies lesen können, sind sie berechtigt, diese Seite zu
betreten.
</body>
</html>
```

Der Zugriff auf eine Seite ist gestattet, wenn der Benutzer alle
in $perm->check() verlangten Zugriffsrechte besitzt. Dazu werden
die Bitmuster der im $perm->check() aufgeführten Rechte
miteinander ver-ODER-t und mit den effektiven Rechten des
Benutzers ver-UND-et. Das Resultat muß den verlangten Rechten
der Seite entsprechen.

```console
Die effektiven Zugriffsrechte eines Benutzers: user
                        ergeben als Bitmuster: 16

Die verlangten Zugriffsrechte der Seite:       user,admin
                        ergeben als Bitmuster: 17

Rechteprüfung:
      Effektive Zugriffsrechte: 17
AND   verlangte Rechte:         16
SIND  17 & 16 =                 16

MÜSSEN SEIN verlangte Rechte    17 => Zugriff verboten.
```

**Abbildung 6:** *Eine Beispielrechnung für Zugriffsrechte: Ein User mit dem Recht "user" versucht auf eine Seite mit den verlangten Rechten "user,admin" zuzugreifen.*

Die Zugriffsrechte in diesem Beispiel bezeichnen wir als
*atomare* Zugriffsrechte, weil jedes Recht nur einem
einzelnen gesetzten Bit entspricht. Atomare Zugriffsrechte sind
die einfachsten aller Rechteschemata, weil sie sehr einfache
Rechteprüfungen erlauben: Um eine Seite zu sehen, die mit den
Rechten user,editor,admin geschützt ist, muß man mindestens die
Rechte user,editor,admin in der auth_user-Tabelle zugewiesen
bekommen haben.

Ein anderes populäres Rechteschema sind *Userlevel* oder
*inklusive Rechte*. In diesem Schema ist jedes
Zugriffsrecht eine Erweiterung aller vorhergehenden Rechte. Man
erreicht dies zum Beispiel mit dieser Definition:

```php
class Inclusive_Perm extends Perm {
  var $classname = "Inclusive_Perm";

  var $permissions = array(
                       "user"       => 1,
                       "author"     => 3,
                       "editor"     => 7,
                       "supervisor" => 15,
                       "admin"      => 31
  );
}
```

In so einem Fall kann ein Benutzer mit dem Recht admin leicht
auf eine Seite zugreifen, die das Zugriffsrecht "user" verlangt.

Auch in diesem Fall ist die Funktionsweise leicht zu merken: Ein
Benutzer mit einem höheren Userlevel kann auf alle Funktionen
eines niedrigeren Zugriffslevels zugreifen. Wegen der internen
Organisation von PHP können bis zu 31 verschiedene Rechtebits
verwendet werden.

```console
Die effektiven Zugriffsrechte eines Benutzers: admin
                        ergeben als Bitmuster: 31

Die verlangten Zugriffsrechte der Seite:       user
                        ergeben als Bitmuster: 1

Rechteprüfung:
      Effektive Zugriffsrechte: 31
AND   verlangte Rechte:         1
SIND  31 &  1 =                 1

MÜSSEN SEIN verlangte Rechte    1 => Zugriff erlaubt.
```

**Abbildung 7:** *Eine Beispielrechnung für Zugriffsrechte: Ein User mit dem Recht "admin" versucht auf eine Seite mit den verlangten Rechten "user" zuzugreifen.*

## Seiten mit optionalem Login

In vielen Anwendungen möchte man Benutzer ohne Anmeldung nicht
einfach hinauswerfen, sondern ihnen eine gewisse
Grundfunktionalität bieten, die man für angemeldete Benutzer
erweitert. In PHPLIB ist es nicht möglich, daß auf Seiten, die
eine Anmeldung verlangen unangemeldete Benutzer operieren, aber
man kann dafür sorgen, daß nicht angemeldete Benutzer auf eine
spezielle Gastbenutzer-Identität, nobody, abgebildet werden.

Wenn man PHPLIB auf diese Weise verwenden möchte, definiert man
sich eine Unterklasse von Auth, in der die Variable $nobody auf
true gesetzt ist. Sobald man eine Seite betritt, auf der eine
Anmeldung verlangt wäre, man selbst jedoch nicht angemeldet ist,
setzt PHPLIB die Benutzeridentität auf den speziellen Wert
"nobody", ohne daß ein Loginschirm verlangt wird. 

```php
class Example_Auth extends Auth {
  var $classname = "Example_Auth"; # Name der Klasse

  var $lifetime  = 15;             # Nach 15 Minuten Inaktivität wird der 
                                   # User automatisch ausgeloggt.

  # Name der Klasse und Tabelle für den Datenbankzugriff
  var $database_class = "DB_Example";
  var $database_table = "auth_user";

  # Default Authentication verwenden
  var $nobody = true;

  function auth_loginform() {
    global $sess;

    include("loginform.ihtml");
  }

  function auth_validatelogin() {
    # Code wie üblich
  }
}
```

Um die Anzeige des Loginschirms zu erzwingen muß man speziellen
Code auf seiner Seite unterbringen: Die Funktion login_if() der
Klasse Auth zeigt den Loginbildschirm an, wenn sie mit einem
Argument aufgerufen wird. Man kann also einen Button oder ein
Link auf seiner Seite unterbringen, das dieselbe Seite mit einem
Argument aufruft und dies am Seitenanfang abfragen. 

In Code sieht das folgendermaßen aus:

```php
<?php
 # using Default Authentication
 page_open(array("sess" => "Example_Session", 
                 "auth" => "Example_Auth"));

 # Falls wir mit dem Parameter $again aufgerufen wurden,
 # Loginscreen anzeigen.
 $auth->login_if($again);

 # Wenn wir als "nobody" angemeldet sind,
 # Login-Link anzeigen.
 if ($auth->auth["uid"] == "nobody"):
?>
  <A HREF="<?php $sess->purl("$PHP_SELF?again=yes") ?>">Login</A> aufrufen.
<?php endif ?>
```

## Benutzerspezifische Variablen

Dadurch, daß PHPLIB intern User-IDs statt Usernamen verwendet
und daß diese User-IDs dasselbe Format wie Session-IDs haben,
ist es möglich, eine Klasse User zu haben, die ebenso wie die
Klasse Session funktioniert, aber mit User-IDs arbeitet.

Variablen, die bei der Klasse User statt Session registriert
werden, stehen erst nach einem Login zur Verfügung, haben dafür
aber eine längere Lebensdauer. Typischerweise wird man hier
benutzerbezogene Einstellungen ablegen.

```php
  +------+                  +--------------+
  | User |-- abgeleitet --> | Example_User |
  +------+                  +--------------+
   ^   |
   |   | benutzt
   |   v
   |   zu CT_Sql
   |
   +-----------------------+
                           |
  +---------+-- abgeleitet +   +-----------------+
  | Session |-- abgeleitet --> | Example_Session |
  +---------+                  +-----------------+
         |                                     |
         | benutzt                             | benutzt
         v                                     v
     +--------+                   +----------------+
     | CT_Sql | -- abgeleitet --> | Example_CT_Sql |
     +--------+                   +----------------+
         |                                       |
         |  benutzt                              | benutzt
         v                                       v
        +--------+                   +------------+
        | DB_Sql | -- abgeleitet --> | DB_Example |
        +--------+                   +------------+
```

**Abbildung 7:** *Klassendiagramm für die Klasse User.*

Die Klasse User ist von der Klasse Session abgeleitet, und dann
so modifiziert worden, daß sie statt Cookies und Session-IDs die
UID des angemeldeten Users verwendet. Um diese Klasse verwenden
zu können, muß man sich eine von User abgeleitete Klasse in
local.inc definieren.

Die Beispielklasse Example_User in der
local.inc-Datei zeigt, wie dies geht - da User von Session
abstammt, gilt im Prinzip alles unter Session gesagte.

```php
class Example_User extends User {
  var $classname = "Example_User";

  var $magic          = "Abracadabra"; 
  var $that_class     = "Example_CT_Sql";
}
```

Die Klasse wird genau wie die Session-Klasse verwendet. Da sie
einen angemeldeten Benutzer voraussetzt, kann sie nur mit der
Klasse Auth zusammen verwendet werden.

```php
<?php
  # Laden der Variablen aus der Datenbank.
  page_open(array("sess" => "Example_Session",
                  "auth" => "Example_Auth",
                  "user" => "Example_User"));

  # Die globale Variable $s ist nun bei der Session registriert.
  $sess->register("s");

  # Die globale Variable $u ist nun bei User registriert.
  $user->register("u");

  # $s und $u werden auf definierte Startwerte gesetzt, wenn die
  # Variable noch nicht existiert.
  if (!isset($s)) 
    $s = 0;
  if (!isset($u))
    $u = 0;

  // $s und $uhochzählen.
  $s++;
  $u++;
 ?>
<html>
 <head>
  <title>Eine Testseite</title>
 </head>
 <body>
  <h1>Eine Testseite</h1>

  Die Variable $s hat den Wert <?php print $s ?>.<br>
  Die Variable $u hat den Wert <?php print $u ?>.
 </body>
</html>
<?php
  // Zurückspeichern der Variablen in die Datenbank
  page_close();
 ?>
```

# PHPLIB Referenz

## DB_Sql

Die Beschreibung bezieht sich auf die Implementierung von
DB_Sql für MySQL (db_mysql.inc). Die Parameter für den Connect
können sich in Abhängigkeit vom SQL-Servertyp leicht
unterscheiden, je nachdem, welche Informationen der
Datenbankserver für den Connect verlangt.

### Variablen:

Host:
: Hostname, auf dem der SQL Datenbankserver läuft.

Database:
: Name der MySQL Database, die auf dem Server verwendet werden soll.

User:
: Benutzername, mit dem sich die Anwendung auf dem Datenbankserver anmelden soll.

Password:
: Paßwort, mit dem die Anmeldung erfolgen soll.

Row:
: Zeilennummer der aktuellen Zeile eines Anfrageergebnisses, beginnend bei 0.

Record:
: Ein assoziatives Array mit der aktuellen Zeile eines Anfrageergebnisses. Die Spalten des Ergebnisses sind unter den Spaltennamen (Schreibweise beachten!) und unter numerischen Spaltenindices verfügbar.

Errno:
: Fehlernummer der Datenbank.

Error:
: Klartext-Fehlerbeschreibung des Datenbankfehlers.

Auto_Free:
: Automatische Freigabe des Anfrageergebnisses, wenn das Ergebnis vollständig gelesen wurde (true, false).

Debug:
: true: Alle Anfragen an die Datenbank werden zwecks Fehlersuche ausgegeben.

Halt_On_Error:
: Verhalten des Programmes im Fehlerfall:
  - "no": Der Fehler wird ignoriert.
  - "report": Der Fehler wird gemeldet, aber das Programm nicht abgebrochen.
  - "yes:" Das Programm wird mit einer Fehlermeldung angehalten.

### Funktionen:

query($query_string):
: Die Funktion sendet die SQL-Anweisung in $query_string an den
 Datenbankserver. Nach dem Absenden werden die Variablen Error
 und Errno aktualisiert. Wenn die Anweisung syntaktisch
 fehlerhaft war, wird die Funktion halt() aufgerufen und das
 Programm gemäß den Einstellungen von $Halt_On_Error angehalten.
 Wenn noch kein Datenbank-Link existiert, wird vor dem Absenden
 der Query intern die Funktion connect() aufgerufen.
 Die Funktion gibt die interne Result-ID zurück, die entweder
 eine positive Zahl oder 0 (false) ist, wenn die Query zu einem
 Fehler führte.

next_record():
: Die Funktion setzt den Cursor auf das nächste Ergebnis in
 der Ergebnismenge und aktualisiert die Variablen Record, Row,
 Error und Errno.
 Die Funktion liefert den Wert true, wenn ein weiteres Ergebnis
 verfügbar ist und den Wert false, wenn die aktuelle
 Ergebnismenge durchlaufen wurde. Wenn die Variable $Auto_Free
 auf true gesetzt war, wird automatisch free_result() aufgerufen,
 um den Speicher freizugeben, bevor das Ergebnis false
 zurückgegeben wird.
 Eine typische Anwendung von query() und next_record() sieht so
 aus:

```php
  $db = new DB_Example;
  $db->query("select * from table where bedingung = 1");
  while ($db->next_record()) {
    printf("Name = %s\n", $db->f("name"));
  }
```

seek($pos):
: Die Funktion positioniert den aktuellen Zeilenzeiger
 innerhalb der Ergebnismenge an die angegebene Position. Dies ist
 nützlich, um innerhalb einer Ergebnismenge hin- und
 herzuspringen oder eine Ergebnismenge zweimal zu lesen. Die
 angegebene Position wird nicht auf Gültigkeit überprüft.
 **Hinweis:** Wenn $Auto_Free auf true gesetzt wird, ist die Funktion
 seek() unter Umständen nicht sinnvoll einsetzbar, weil die
 Ergebnismenge beim berühren des Endes der Ergebnismenge
 automatisch freigegeben wird.

metadata($table, $full=false):
: Die Funktion gibt Informationen über den Aufbau der
 benannten Tabelle in Form eines zweidimensionalen Feldes zurück.
 Das Feld ist in der ersten Dimension numerisch indiziert (Start
 bei 0) und enthält einen Eintrag pro Spalte der Tabelle. Für
 jede Tabellenspalte enthält der Eintrag die Informationen
 Tabellennamen ("table"), Spaltenname ("name"), Spaltentyp
 ("type"), Spaltenbreite ("len") und Spaltenflags ("flags").
 Ist das optionale Flag auf true gesetzt, wird außerdem ein
 Eintrag num_fields mit der Anzahl der Spalten in der Tabelle und
 ein Eintrag meta generiert. Der Eintrag meta enhält eine Liste
 mit einer Übersetzungstabelle von Feldnamen nach Spaltennummern.
 Das Ergebnis von metadata() ist passend für die Funktion
 show() der Klasse Table, wenn das Flag $full auf false steht.
 **Hinweis:** Nicht alle Datenbankinterfaces unterstützen die
 Funktion metadata() gleich gut.

table_names():
: Die Funktion gibt Informationen über die vorhandenen
 Tabellen in Form eines zweidimensionales Feldes zurück.
 Das Feld ist in der ersten Dimension numerisch indiziert (Start
 bei 0) und enthält einen Eintrag pro Tabelle. Für jede Tabelle
 enthält der Eintrag die Informationen Tabellenname
 ("table_name"), Name des Tablespaces
 ("tablespace_name") und Name der Datenbank ("database").
 **Hinweis:** Nicht alle Datenbankinterfaces unterstützen die
 Funktion table_names() gleich gut.

num_rows(), nf():
: Gibt die Anzahl der Zeilen der Ergebnismenge zurück. Zutreffend auf die Ergebnisse von SELECT-Anweisungen.

affected_rows():
: Gibt die Anzahl der Zeilen zurück, die von einem INSERT, UPDATE oder DELETE-Statement betroffen waren.

num_fields():
: Gibt die Anzahl der Spalten einer Ergebnismenge zurück. Zutreffend auf die Ergebnisse von SELECT-Anweisungen.

f($field):
: Identisch mit return $db->Record[$field].

p($field):
: Identisch mit print $db->Record[$field].

haltmsg($msg):
: Die Funktion wird intern verwendet, um die Fehlermeldung
 $msg auszugeben, wenn ein Datenbankfehler auftritt. Sie kann in
 einer Unterklasse überschrieben werden, um die Fehlermeldung zu
 loggen oder sonstwie zu behandeln.
 Die Funktion wird nur dann aufgerufen, wenn $Halt_On_Error auf
 "report" oder "yes" steht.

halt($msg):
: Die Funktion wird intern verwendet, um die Variablen $Error
 und $Errno zu aktualisieren und $Halt_On_Error auszuwerten. Sie
 ruft ggf. die Funktion haltmsg() auf.
 Die Funktion kann in einer Unterklasse überschrieben werden, um
 eine andere Fehlerbehandlung zu implementieren.


## Seitenverwaltungsfunktionen

### Funktionen:

page_open(array()); :
: Diese Funktion muß am Anfang einer Seite aufgerufen werden.  Sie enthält eine Zuordnung von gewünschten Features der Seite zu Klassennamen. Derzeit existieren die folgenden Features:

sess:
: Die Seite verwendet Session-Variablen.

auth:
: Die Seite verwendet Authentisierung. Um das auth-Feature verwenden zu können, muß auch sess aktiviert sein.

perm:
: Die Seite verwendet Benutzerrechteverwaltung. Um das perm-Feature verwenden zu können, müssen auch sess und auth aktiviert sein.

user:
: Die Seite verwendet User-Variablen. Um das user-Feature  verwenden zu können, müssen auch sess und auth aktiviert sein.
 
Eine beispielhafte Anwendung sieht so aus:

```php
  page_open(array("sess" => "Example_Session"));
```

Dieser Aufruf erzeugt eine Instanz der Klasse Example_Session unter dem Namen $sess. Diese Instanz kann dann in Aufrufen verwendet werden ($sess->register("s")). Die abgeleiteten Klassen, die als Parameter zu jedem Feature angegeben werden, werden in der Regel in der Datei local.inc definiert.

page_close():
: Die Funktion muß am Ende jeder Seite aufgerufen werden
 (nachdem alle registrierten Variablen ausgerechnet wurden). Sie
 speichert diese Variablen zurück in der Datenbank. Momentan ist
 es harmlos, page_close() auf einer Seite mehrfach aufzurufen,
 aber dies kann sich in der Zukunft ändern.

## CT_Sql

Um die Session-Klasse ihren Daten in einer SQL-Datenbank
abspeichern zu lassen, wird in der Session-Klasse der Name einer
Unterklasse von CT_Sql als Container $that_class eingetragen.

### Variablen:

database_table:
: Name der Datenbanktabelle, in der die Session ihre Daten  speichern soll.

database_class:
: Name der DB_Sql Unterklasse, die zum Zugriff auf die Datenbank verwendet werden soll.

Die Klasse wird von Session intern verwendet und hat keine allgemein anwendbaren Funktionen.

## CT_Split_Sql

Diese Klasse ist praktisch mit der CT_Sql-Klasse identisch, mit
dem Unterschied, daß sie mehrere Zeilen in der Tabelle verwenden
kann, wenn die Menge der zu speichernden Daten über das
hinausgeht, was die Datenbank verarbeiten kann. Dies ist vor
allen Dingen interessant, wenn die Datenbank Probleme mit BLOBs
hat.

**Hinweis:** Die Klasse ist nicht tabellenkompatibel mit CT_Sql. Es
muß eine Tabelle active_sessions_split verwendet werden, deren
Layout in den create_database.*-Scripten im stuff-Verzeichnis
der Distribution beschrieben ist.

### Variablen:

database_table:
: Name der Datenbanktabelle, in der die Session ihre Daten speichern soll.

database_class:
: Name der DB_Sql Unterklasse, die zum Zugriff auf die Datenbank verwendet werden soll.

split_length:
: Anzahl der Bytes, nach denen ein Session-Record aufgeteilt werden soll (Default: 4096).

Die Klasse wird von Session intern verwendet und hat keine allgemein anwendbaren Funktionen.

## CT_Shm

Um Sessions in System V Shared Memory-Segmenten zu speichern, muß der PHP-Interpreter mit shm-Support übersetzt worden sein (Die Ausgabe der phpinfo()-Funktion zeigt dies an) und es muß als Containerklasse bei Session CT_Shm oder eine Unterklasse davon angegeben werden.

### Variablen:

max_sessions:
: Maximale Anzahl von gleichzeitig aktiven Sessions.

shm_key:
: Der eindeutige (wichtig!) shm_key für das Shared Memory-Segment, das verwendet werden soll.

shm_size:
: Größe des zu verwendenden Shared Memory-Segmentes in Byte.
 Der Speicher wird bestellt, wenn das Segment das erste Mal
 verwendet wird. Für durchschnittlich kleine Mengen von
 Session-Variablen kann man als Schätzwert shm_size =
 max_sessions * 600 annehmen.

Die Klasse wird von Session intern verwendet und hat keine allgemein anwendbaren Funktionen.

## CT_Dbm

Um Sessions in UNIX DBM-Dateien zu speichern, muß der
PHP-Interpreter mit dem passenden DBM-Support übersetzt worden
sein (Die Ausgabe der phpinfo()-Funktion zeigt dies an) und es
muß als Containerklasse bei Session CT_Dbm bzw. eine Unterklasse
davon angegeben werden.

### Variablen:

dbm_file:
: Der Pfadname der zu verwendenden DBM-Datei. Die Datei muß  bereits existieren und durch den Server beschreibbar sein.

Die Klasse wird von Session intern verwendet und hat keine allgemein anwendbaren Funktionen.

## CT_Ldap

Um Sessions auf einem LDAP-Server zu speichern, muß der
PHP-Interpreter mit LDAP-Support übersetzt worden sein (Die
Ausgabe der phpinfo()-Funktion zeigt dies an) und es
muß als Containerklasse bei Session CT_Ldap bzw. muß als
Containerklasse bei Session CT_Dbm bzw. eine Unterklasse
davon angegeben werden.

### Variablen:

ldap_host:
: Hostname des LDAP-Servers, der verwendet werden soll.

ldap_port:
: Portnummer des LDAP-Servers, der verwendet werden soll (Default: 389).

basedn:
: DN, unterhalb dessen die Daten abgelegt werden sollen.

rootdn:
: Wurzel-DN des LDAP-Servers, wird benötigt, um sich mit dem Server verbinden zu können.

rootpw:
: Zur rootdn passendes Paßwort.

objclass:
: Name der objectclass, der von PHPLIB zu werden ist (siehe auch ldap.ldif im stuff-Verzeichnis der Distribution)


Die Klasse wird von Session intern verwendet und hat keine allgemein anwendbaren Funktionen.

## Session

Die Klasse Session verwaltet eine Liste von globalen
Variablennamen, und lädt und speichert die Typen und Werte
dieser Variablen in serialisierter Form am Anfang und Ende jeder
Seite. Die Variablen können vom Typ Skalar (string, integer,
float) oder Array sein. Objekte können ebenfalls gesichert und
geladen werden, wenn sie die Instanzvariablen classname und
persistent_slots haben, damit der Name ihrer Klasse und die zu
sichernden Slots bestimmt werden können.

classname:
: Name der Klasse. Alle von PHPLIB zu sichernden oder zu ladenden Objekte müssen einen Slot classname haben, der den genauen Namen der Klasse enthält.

magic:
: Ein geheimer String, der verwendet wird, um die Session-IDs schwerer ratbar zu machen. Der String kann irgendeinen Wert haben. Es ist nur wichtig, diesen Wert geheim zu halten.

mode:
: Betriebsart. Entweder "cookie" (empfohlen) oder "get". In cookie-Mode wird die Session-ID vom Browser per Cookie eingeliefert, in get-Mode als CGI-Parameter einer URL.

fallback_mode:
: Wenn $mode = "cookie" ist, kann man diese Variable auf den Wert "get" setzen. PHPLIB verwendet dann automatisch get-Mode, wenn auf dem zugreifenden Browser cookies abgeschaltet sind.

lifetime:
: Lebensdauer des Cookies, den PHPLIB verwendet, in Minuten.
 Wenn dieser Wert auf 0 steht (default), werden Session-Cookies
 verwendet. Diese Cookies haben dieselbe Lebensdauer wie der
 Browser des Anwenders und werden nicht in der cookies.txt-Datei
 gespeichert. Dies ist die empfohlene Betriebsart.

gc_time:
: PHPLIB führt in Abständen eine garbage collection auf der
 Tabelle active_sessions durch. Dabei werden alle Session-Daten
 gelöscht, die älter als gc_time Minuten sind. Der Standardwert
 ist 1440 (ein Tag) und kann so beibehalten werden.

gc_probability:
: Bei jedem Zugriff auf eine Session wird mit der
 Wahrscheinlichkeit gc_probability Prozent eine
 Garbage-Collection ausgelöst. Der Standardwert ist 5, was für
 Server mit niedrigem Traffic in Ordnung ist. Auf stark
 belasteten Servern kann der Wert auf 1 gesetzt werden.

allowcache:
: Zugelassene Werte sind "no", "private" (Default) und
 "public". Der Wert bestimmt, welche HTTP-Header erzeugt werden,
 die das Caching von PHPLIB-Seiten gestatten. Mit der Einstellung
 "no" wird das Speichern der Seiten in Caches generell verboten,
 mit der Einstellung "private" wird dem Browser des Anwenders das
 Speichern der Seite im Cache gestattet, aber öffentlichen Caches
 verboten und mit der Einstellung "public" wird das Cachen der
 erzeugten Seiten generell erlaubt.

allowcache_expires:
: Das Speichern der erzeugten Seiten wird den Caches für
 maximal die hier konfigurierte Anzahl von Minuten erlaubt
 (Default: 1440, ein Tag).

that_class:
: Name der Containerklasse (eine Unterklasse von CT_Sql,
 CT_Split_Sql, CT_Shm, CT_Dbm, CT_Ldap), die von der Session
 verwendet wird, um ihre Daten zu laden und zu speichern.

auto_init:
: Name einer Datei aus dem include-Verzeichnis, die beim
 Erstellen einer neuen Session geladen und ausgeführt wird. Die
 Ausführung der Datei erfolgt im Kontext einer Funktion, sodaß
 alle zu definierenden globalen Variablen mit "global" importiert
 werden müssen.

### Funktionen:

register("varname"):
: Die Variable mit dem angegebenen Namen wird bei der Session
 registriert. Der Name kann sich auf eine globale Variable vom
 Typ Skalar, Array oder Objekt beziehen. Wenn es sich bei der
 Variablen um ein Objekt handelt, muß es die folgenden beiden
 Slots besitzen:

 classname: String, Name der Klasse des Objektes.

 persistent_slots: Array von Strings, Namen der Slots des Objektes, die von der Session gesichert werden sollen.
  
Es ist ohne Nachteile möglich, denselben Namen mehrmals zu registrieren.

unregister("varname"):
: Die Variable mit dem angegebenen Namen wird bei der Session
 wieder ent-registriert. Die Variable wird nicht gelöscht, ihr
 Wert ist bis zum Ende der Seite weiterhin verfügbar, aber ihr
 Wert ist nicht mehr persistent und wird am Ende der Seite
 verfallen.

delete():
: Die aktuelle Session wird zerstört und der Session-Cookie
 wird gelöscht. Der Eintrag für die Session wird aus der
 Datenbank entfernt.
 Weil der Session-Cookie gelöscht wird, muß diese Funktion sehr
 früh auf einer Seite aufgerufen werden (bevor irgendein HTML
 ausgegeben wurde). Da die Session durch die Funktion zerstört
 wird, darf am Ende der Seite nicht mehr page_close() aufgerufen
 werden. Die zur Session gehörenden Variablen sind auf der Seite
 selbst noch verfügbar. Sie verfallen am Ende der Seite.
 Im cookie-Mode ist es möglich, nach dem Aufruf von delete() eine
 neue Session aufzumachen, indem ein weiterer page_open()-Aufruf
 erzeugt wird. Das erlaubt es auch, Variablen aus der alten
 Session bei der neuen Session zu re-registrieren und so zu
 übernehmen.

url($url):
: Der Funktion wird eine URL übergeben, so wie man sie in
 einem A, FRAME oder FORM-Tag verwenden würde. Im cookie-Mode
 wird die URL so ausgegeben, im get-Mode wird die aktuelle
 Session-ID in die URL mit eingebaut.
 Die Funktion gibt die modifizierte URL als Ergebnis zurück.

purl($url):
: Eine Abkürzung für print $sess->url($url).

self_url():
: Die Funktion liefert eine URL, die auf die aktuelle Seite
 zeigt, zurück. Im get-Mode ist die aktuelle Session-ID dabei
 schon enthalten.

pself_url():
: Eine Abkürzung für print $sess->self_url().

hidden_session():
: Erzeugt ein HIDDEN-Element für Formulare mit dem Session-Namen und der ID.

add_query($qarray):
: Die Funktion erzeugt einen Query-String, der an eine aktuelle URL angehängt werden kann. Beispiel:

```php
<a href="<?php 
  $sess->pself_url().$sess->padd_query(array("again"=>"yes"))
?>">Reload</a> and log in?
```

padd_query($qarray):
: Eine Abkürzung für print $this->add_query($qarray).

reimport_get_vars():
reimport_post_vars():
reimport_cookie_vars():
: Wenn man eine FORM-Variable registriert, wird die
 Formularvariable in PHP importiert, danach page_open()
 aufgerufen und der alte Wert dieser Variablen aus der Datenbank
 überschreibt den neuen Wert aus dem Formular.
 In einem solchen Fall kann man mit der Funktion
 reimport_x_vars() die Variablenwerte reimportiert. Im
 allgemeinen ist dies ein Fehler, weil dadurch Werte aus dem
 Internet ohne Konsistenzprüfung in die Anwendung übernommen
 werden. Die Funktion sollte nicht verwendet werden.


## Auth

Die Auth-Klasse im PHPLIB verwaltet alle Anmeldevorgänge und
merkt sich, wann sich der Benutzer unter welchem Namen
angemeldet hat. Da sich die Auth-Klasse selbst persistent macht,
setzt sie voraus, daß auf allen Seiten, auf denen Auth verwendet
wird, auch Session verwendet wird.

### Variablen:

classname:
persistent_slots:
: Diese Variablen sind notwendig, damit sich Auth in der
Session speichern und laden kann. Normalerweise muß man
classname auf den Namen seiner Unterklasse setzen und braucht
persistent_slots nicht anzupassen.

lifetime:
: Nachdem ein Benutzer $lifetime Minuten lang keine Seiten
abgerufen hat, muß er sich neu am System anmelden, um
weiterarbeiten zu können.

mode:
: Entweder "log" oder "reg". Wenn die Variable den Wert "log"
hat, werden die Funktionen auth_loginform() und
auth_validatelogin() aufgerufen. Im "reg"-Mode werden
stattdessen auth_registerform() und auth_doregister() verwendet,
mit denen sich ein Anwender beim System anmelden kann.

database_class:
: Der Name der Datenbank-Klasse über die die Auth-Funktion in
der Benutzertabelle nachschlagen soll.

database_table:
: Der Name der Datenbank-Tabelle, in der die
Benutzerinformationen gespeichert sind.

magic:
: Ein zufälliger, geheimer String, der bei der Ermittlung
neuer User-IDs verwendet wird.

nobody:
: Schalter: Wenn er auf true gesetzt wird, wird Default
Authentication verwendet, d.h. es erscheint kein Loginformular,
sondern der Anwender wird als nobody eingeloggt.

### Funktionen:

url():
: Diese Funktion entspricht der Funktion url() von Session.

purl():
: Diese Funktion entspricht der Funktion purl() von Session.

login_if($t):
: Diese Funktion kann verwendet werden, um die Anzeige eines
Loginformulars zu erzwingen, wenn Default Authentication
verwendet wird.

unauth($nobody = false):
: Diese Funktion meldet den aktuellen Benutzer beim System ab,
sodaß beim nächsten Seitenaufruf ein neuer Login notwendig wird.
Der Benutzername bleibt jedoch erhalten, sodaß eine korrekt
geschriebene Login-Seite diesen Namen als Vorgabe präsentieren
kann.
Seit PHPLIB Version 6 ist es möglich, die Funktion mit dem
Parameter "true" aufzurufen, wenn man den Benutzer nicht einfach
abmelden, sondern stattdessen wieder als nobody anmelden möchte.
Beispielanwendung: $auth->unauth($auth->nobody).

logout($nobody = $this->nobody):
: Diese Funktion entspricht der Funktion unauth(), außer das
alle Logininformation einschließlich des Benutzernamens
beseitigt wird. Bei der Neuanmeldung muß der Benutzer das
gesamte Loginformular neu ausfüllen, es existieren keine
Vorgaben.

is_authenticated():
: Diese Funktion liefert falsch, wenn der Benutzer keine
gültige Anmeldung hat oder die aktuelle uid, wenn die Anmeldung
gültig ist.

auth_preauth():
: Diese Funktion kann durch den Entwickler überschrieben
werden. Sie wird als allererste Funktion im Loginprozeß
aufgerufen und kann entweder false oder eine gültige uid
zurückliefern (Default: Die Funktion liefert immer false).
Wenn die Funktion eine gültige User-ID zurückliefert, wird der
Loginprozeß nicht durchgeführt, sondern diese User-ID verwendet.
Die Funktion könnte zum Beispiel mit Hilfe von Cookies im
Browser des Users ein automatisches Login durchführen, sodaß der
Benutzer sich nicht mehr anzumelden braucht, wenn sein Browser
diese Cookies akzeptiert.

auth_loginform():
: Diese Funktion muß durch den Entwickler überschrieben werden
und sollte das HTML ausgeben, das das Loginformular zeichnet.

auth_validatelogin():
: Diese Funktion wird aufgerufen, wenn der Benutzer das durch
auth_loginform() gezeichnete Loginformular absendet. Sie muß die
Benutzereingaben prüfen und entweder false oder eine gültige
User-ID zurückliefern.
Die Funktion sollte außerdem $this->auth["uname"] mit dem
Benutzernamen des Users belegen und kann optional
$this->auth["perm"] für die Verwendung durch die Perm-Klasse
mit den Zugriffsrechten des Users vorbelegen.

auth_registerform():
auth_doregister():
: Im reg-Mode werden diese beiden Funktionen statt
auth_loginform() und auth_validatelogin() aufgerufen. Sie sollen
ein Anmeldeformular für neue User zeichnen bzw. die Anmeldung
des Benutzers in die Datenbank eintragen.


## Perm

Die Perm-Klasse im PHPLIB verwaltet Benutzerrechte und kann
prüfen, ob ein angemeldeter Benutzer Zugang zu einer Seite oder
einer Funktion hat. Benutzerrechte setzen einen angemeldeten
Benutzer voraus, daher setzt Perm voraus, daß auf allen Seiten,
auf denen Perm verwendet wird, auch Auth und Session verwendet
werden.

### Variablen:

permissions:
: Ein Array, das Namen von Zugriffsrechten mit den zugehörigen
Bitmustern verbindet.

### Funktionen:


check($required):
: Die Funktion wird mit einer Liste von Zugriffsrechten
aufgerufen, die für das Ansehen der betreffenden Seite notwendig
sind. Wenn der aktuelle User dieser Rechte nicht hat, wird ihm
das Ansehen der Seite verweigert, d.h. die Funktion
perm_invalid() wird aufgerufen.
Die Funktion perm_invalid() wird ebenfalls aufgerufen, wenn in
den Rechten des Benutzers oder den von der Seite verlangten
Rechten illegale Rechtenamen verwendet werden.

have_perm($required):
: Die Funktion arbeitet ähnlich wie check(), ruft aber keine
Fehlerseite auf, sondern liefert entweder true (der Benutzer hat
die verlangten Rechte) oder false (der Benutzer hat die
verlangten Rechte nicht).

perm_sel($name, $current = "", $class = ""):
: Die Funktion liefert als Ergebnis einen String, der einen
HTML SELECT-Tag mit allen möglichen Zugriffsrechten als
OPTION-Tags enthält. Wenn ein Wert für $current angegeben wird,
ist dieses Zugriffsrecht im Option-Tag als SELECTED markiert.
Wenn ein Wert für $class angegeben wird, haben alle erzeugten
HTML-Elemente die angegebene Klasse als CSS stylesheet-Klasse.

## User

Die Klasse User ist eine Unterklasse von Session. Sie
funktioniert im wesentlichen genauso wie Session, nur daß sie
Werte benutzerbezogen speichert. Das bedeutet, daß bei der
Klasse User registrierte Variablen nur auf Seiten zur Verfügung
stehen, die authentisiert sind. Das user-Features kann also nur
zusammen mit auth und sess verwendet werden.

### Variablen:

classname:
: Name der Klasse.

magic:
mode:
fallback_mode:
: In dieser Klasse ohne Bedeutung.

lifetime:
: In dieser Klasse ohne Bedeutung. Stattdessen sollte
$auth->lifetime verwendet werden.

gc_time:
: Funktionsfähig, aber wahrscheinlich nicht sinnvoll.

gc_probability:
: Funktionsfähig, aber wahrscheinlich nicht sinnvoll. Sollte
auf 0 gesetzt werden.

that_class:
: Name der Containerklasse, die zur Verwaltung der Variablen
verwendet wird.

auto_init:
: In dieser Klasse ohne Bedeutung.

### Funktionen:

register($varname):
unregister($varname):
delete():
reimport_get_vars():
reimport_post_vars():
reimport_cookie_vars():
: Funktioniert erwartungsgemäß.

url($url):
purl($url):
self_url():
pself_url():
: In dieser Klasse ohne Bedeutung.
<br>
