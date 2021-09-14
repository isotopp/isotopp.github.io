---
layout: post
published: true
title: Statifizierung für S9Y - eine Blaupause
author-id: isotopp
date: 2010-05-11 08:54:12 UTC
tags:
- apache
- blog
- performance
- s9y
- lang_de
feature-img: assets/img/background/rijksmuseum.jpg
---
An anderer Stelle gab es in einem komplett anderen Kontext eine Diskussion 
([1](http://mysqldump.azundris.com/archives/36-Serving-Images-From-A-Database.html), 
[2](http://mysqldump.azundris.com/archives/37-Serving-Images-from-a-File-System.html), 
[3](http://mysqldump.azundris.com/archives/59-Statification.html)) in der es
auch schon mal um die Statifizierung von Seiten ging.

In dem 
[ersten](http://mysqldump.azundris.com/archives/36-Serving-Images-From-A-Database.html)
Artikel ging es mir darum zu verdeutlichen, wie viel Mehrarbeit die
Auslieferung einer Seite ist, wenn sie durch den Codepath des Webservers
erfolgt statt durch den Fastpath - und das Beispiel bezieht sich noch auf
die Auslieferung einer Bilddatei, also nur das Schaufeln von Daten statt die
Seite zu berechnen. Sheeri war damals der Ansicht, daß das ein Problem mit
dem Dateisystem gäbe, aber das ist tatsächlich nur der Fall, wenn man ein
veraltetes Dateisystem verwendet, das Verzeichnisse als lineare Listen
ablegt.

In dem
[zweiten](http://mysqldump.azundris.com/archives/37-Serving-Images-from-a-File-System.html)
Artikel benchmarke ich das Verhalten von Reiserfs 3.6, aber xfs und sogar
ext3 mit DIR_INDEX sollten sich vergleichbar verhalten.

Der [dritte](http://mysqldump.azundris.com/archives/59-Statification.html)
Artikel erklärt dann Statifizierung von - im Beispiel - Bilddateien durch
404-Handler. Diese Methode ist auch auf das Blog anwendbar.

Das Blog 'leidet' dabei darunter, daß auf einer Seite als Speichereinheit
eine Menge von Elementen zu sehen sind, die alle eine unterschiedliche
Lebensdauer haben. Daher müßten bei der Änderung eines Seitenelementes alle
Seiten invalidiert werden, in denen das Seitenelement vorkommt. Das ist
nicht effizient.

Der erste Schritt muß daher darin bestehen, die Seite in ihre Elemente zu
zerschneiden und die Seitenelemente einzeln in separaten Dateien zu cachen.

### Zusammensetzen im Client

Das bedeutet aber, daß die Seite bei der Auslieferung zusammengesetzt werden
muß. Wenn man dabei das Zusammensetzen der Seite im Webserver vermeiden
will, dann muß das im Client passieren. Der am wenigsten aufwendige Fall ist
dabei die Verwendung von IFrames, so wie schon jetzt auf der Startseite
dieses Blogs ein Google-Calendar von anderswo mit Hilfe eines IFrames
eingebunden wird.

```html
<iframe src="http:/www.google.com/calendar/embed?..." 
  style="border-width:0" 
  width="240" 
  height="280"
  frameborder="0"
  scrolling="no"></iframe>
```


Das funktioniert mit dem Google Calender, weil die Größe des Elementes vorab
bekannt ist.

Würde man im Falle von S9Y eigene Komponenten von sich selbst einbinden,
hätte man gerne ein IFrame- oder "Div src="-Element ohne Größenangaben:

```html
<iframe src='http://blog.koehntopp.de/statify/latest_comments.html'
  style=...></iframe>
```


Leider gibt es so etwas nicht, sodaß man auf andere, schlechtere Methoden
angewiesen ist, um die Seite zusammenzusetzen.

Der Punkt am Ende ist jedoch: Die Datei /statify/latest_comments existiert
zunächst nicht.

### Erzeugung on-demand

Dadurch kommt es zu einem 404-Error, der vom 404-Handler von Serendipity
abgefangen wird. Dort erkennt S9Y den Namen des Plugins, instantiiert das
gesamte S9Y Framework und ruft dann den Plugin-Handler innerhalb einer
[ob_start()](http://php.net/manual/en/function.ob-start.php) Umgebung auf
und läßt das Plugin normal ablaufen.

Wenn das Plugin sich selbst als Cacheable ansieht (und das zu entscheiden
ist die Aufgabe jedes Plugins für sich alleine), dann holt es sich mit
[ob_get_contents()](http://www.php.net/manual/en/function.ob-get-contents.php)
seine Ausgabe und schreibt diese in die Datei
/statify/latest_comments.html. Dadurch werden nachfolgende
Requests auf diese Datei vom normalen Handler für statische Dateien
abgehandelt und der Code für das Plugin hat sich ein für alle Mal aus dem
Codepath entfernt - es wird nie wieder ausgeführt.

Jedenfalls so lange, bis die Datei gelöscht wird - siehe unten.

### Atomares Schreiben

Beim Schreiben der Datei muß man Vorsicht walten lassen. Es ist möglich, daß
zwei verschiedene Apache Worker Slaves zur selben Zeit dieselbe
/statify/latest_comments.html erzeugen. Es ist auch möglich, daß
weitere Apache Worker die /statify/latest_comments.html
ausliefern wollen, auch wenn sie noch gar nicht vollständig erzeugt ist.
Daher muß das Schreiben so erfolgen:

```php
<?php
  $pid = posix_getpid();
  $filename = make_filename_from($config, '/statify/latest_comments.html', $pid);
  $final_filename = make_filename_from($config, '/statify/latest_comments.html');

  $str = ob_get_contents();
  file_put_contents($filename, $str);
  // Datei sichtbar machen
  rename($filename, $final_filename); ?>
```


### Expire

Das Plugin kann sich selbst in der S9Y-Callback-Architektur registrieren,
zum Beispiel kann es dafür sorgen, daß sein Expire-Hook aufgerufen wird,
wenn ein neuer Kommentar geposted wird. Der Expire-Hook würde dann
"/statify/latest_comments.html" löschen, die Datei aber nicht
neu erzeugen. Sie wird automatisch neu erzeugt, falls sie jemals neu
benötigt wird.

### Was cachen?

Die Artikelseiten selbst können so auch gecached werden und für einige
Seiten - etwa die Startseite und die Artikel, die auf der Startseite
sichtbar sind - ist das auch viel wichtiger als für andere Seiten. Die Logik
für das Cachen von Artikeln kann entweder alle Artikel cachen, die jemals
aufgerufen worden sind, oder um Platz zu sparen die Caching-Entscheidung auf
den o.a. genannten Set einschränken.

Eine andere Serie von Dateien, die dringend gecached werden muß, sind die
Dateien für die RSS-Feeds. Derzeit erlaubt S9Y den Abruf von RSS-Feeds über
Namen (index.rss2, atom.xml) und über Parameter (rss.php?...&...). Letzteres
ist nie cachebar und der Support dafür muß entfernt werden. Stattdessen
müssen die Parameter irgendwie in den Dateinamen der RSS-Datei integriert
werden, und die Anzahl der möglichen RSS-Feeds muß eingeschränkt werden.
Oder man ignoriert dieses Problem und es  reguliert sich darüber selbst, daß
bestimmte Feeds nie aufgerufen werden - es kommt auch nicht darauf an, daß
man alles cached, sondern daß man die Seiten statifiziert, die oft
aufgerufen werden.

Für den Moment habe ich mir das schon einmal hingehackt: Laut Abrufstatistik
ist es so, daß 35% aller Zugriffe in mein Blog auf /feeds/index.rss2
erfolgen, 3% auf atom.xml und ein weiteres Prozent auf comments.rss2. Ein
Script wird jede Minute einmal ausgeführt:

```console
#! /bin/bash --

cd /home/www/servers/blog.koehntopp.de/pages
[ ! -d feeds ] && mkdir feeds
cd feeds

if [ -f .lock ]
then
    pid=$(cat .lock)
    if kill -0 "$pid"
    then
        exit
    fi
fi
echo $$ > .lock

rm -f index.rss2
curl -o index.rss2 http://blog.koehntopp.de/feeds/index.rss2 > /dev/null 2>&1

rm -f atom.xml
curl -o atom.xml http://blog.koehntopp.de/feeds/atom.xml > /dev/null 2>&1

rm -f comments.rss2
curl -o comments.rss2 http://blog.koehntopp.de/feeds/comments.rss2 > /dev/null 2>&1

rm -f .lock
```

Dieses Script sorgt dafür, daß diese drei Dateien als minütlich neu erzeugte
statische Dateien vorliegen statt dynamisch n-fach parallel erzeugt zu
werden. Es hat die Last auf dem Server dramatisch gesenkt, auch wenn die
dahinter stehende Logik primitiv und leicht falsch ist. Mit dem
404-Handler-Framework von oben wären diese Dateien aber immer aktuell und
frisch, und ohne daß ein Cronjob notwendig wäre.

### Was nicht cachen?

Wenn man in einer Artikelseite ist kommentiert, dann landet man in einem
interaktiven Teil des Blogs. Zugleich sollte diese Seite selbst aber
statisch sein.

Daher ist es am günstigsten, wenn die Artikelseite /archives/2789-uuid.html
(statisch) das Kommentarformular so baut, daß es den Kommentar an die URL
/dynamic/2789-uuid.html übermittelt. Diese URL erzeugt dieselbe Seite, aber
dynamisch und ohne Cache. Dort kann dann die normale 'Ihr Kommentar wurde
wegen Captcha/Duplizierung/Was-auch-mmer abgelehnt'-Schleife dynamisch
durchlaufen. Wenn der Kommenar endlich angenommen wurde, löscht die
dynamische Seite die statische Seite und redirected den Browser auf die
(jetzt nicht mehr existierende) statische Seite zurück. Dadurch wird sie
dann auch gleich neu und mit dem neuen Kommentar darin erzeugt.

Auf diese Weise hat man nie Probleme damit, daß die wechselnden Begründungen
für die Ablehnung des Kommentares gecached werden.

Das ist effizient unter der Annahme, daß weniger kommentiert als gelesen
wird.

Garvin merkt noch an: 

> Solche Features wie "Leserechte auf Userbasis", "Adminlinks für
> Redakteure", "Content-Negotiated-Language" wird man verlieren, auch das
> Statistik-Tracking.

Das ist in erster Näherung sicher wahr, aber wahrscheinlich auch für die
Masse der S9Y-Anwender und alle S9Y-Anwender mit Last wahrscheinlich egal.

Nebenbei kann man 
[Content-Negotiated-Language](http://httpd.apache.org/docs/2.0/content-negotiation.html)
im Apache (und vielen anderen Webservern) im Fast-Path erledigen lassen und
mit den Gedanken aus
[ModSecDownload](http://redmine.lighttpd.net/wiki/1/Docs:ModSecDownload)
(für Lighttpd) oder
[mod_auth_token](http://code.google.com/p/mod-auth-token/) (für Apache 2.x)
kann man im Nachgang auch Leserechte auf Userbasis und eventuell auch
Adminlinks für Redakteure mit statischen Dateien implementieren.
