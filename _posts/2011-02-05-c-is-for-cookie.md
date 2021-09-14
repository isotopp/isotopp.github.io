---
layout: post
published: true
title: C is for Cookie
author-id: isotopp
date: 2011-02-05 18:52:45 UTC
tags:
- cookie
- datenschutz
- internet
- lang_de
feature-img: assets/img/background/rijksmuseum.jpg
---
[Krümelmonster: C is for Cookie](http://www.youtube.com/watch?v=Ye8mB6VsUHw)

Auf den vielfachen Wunsch einer einzelnen Dame hier der Erklärbar zum Thema
Kekse für die Freunde besagter Dame.

Eines der Hauptprobleme, das man lösen muß, wenn man Webanwendungen
schreibt, ist die Tatsache, daß man im wesentlichen
[Memento](http://www.imdb.com/title/tt0209144/) dreht.

Jedesmal, wenn man im Browser eine Seite aufruft, sieht der Webserver einen
Request, bearbeitet diesen und vergißt danach, was er getan hat. Es gibt
nichts an einem Request, das man verwenden kann, um den zweiten Requests
sicher mit dem ersten Request zu verketten und sich an die Dinge zu
erinnern, die man im ersten Request getan hat.


## Cookies und Sessions

![](/uploads/stateless.png)

Der erste und der zweite Request vom selben Browser sind nach Definition von
HTTP für den Webserver nicht als zusammengehörig erkennbar.

Man kann nicht den User-Agent des Browsers verwenden, weil es viele
verschiedene Browser mit demselben User-Agent geben kann. Man kann auch
nicht die IP-Adresse verwenden: zum einen kann es vorkommen, daß mehr als
ein Benutzer dieselbe IP-Adresse verwendet, weil es Rechner gibt, die von
mehreren Benutzern zeitgleich verwendet werden.

Zum anderen kann es vorkommen, daß Request 1 und Request 2 mit
unterschiedlichen IP-Adresse gesendet werden. Das ist oft der Fall, wenn ein
Benutzer bei T-Online oder AOL ist oder wenn er
[Tor](http://de.wikipedia.org/wiki/Tor_(Netzwerk)) verwendet. Dort geschieht
dies regelmäßig wegen der Struktur der Proxyserver, die dort verwendet
werden. Bei Mobilbenutzern kann sich die IP-Adresse spontan ändern, wenn sie
ihren Standort verändern, auch wenn das Netz versucht, dies zu verbergen.
Und nach einer DSL-Zwangstrennung hat man natürlich auch eine neue
IP-Adresse. Erstrecken sich Browser-Tätigkeiten über solche Intervalle,
sieht man aufeinanderfolgende Requests desselben Benutzers von verschiedenen
IP-Adresse.

Bei Memento löst man das Problem mit Tätowierungen, in Browsern verwendet
man stattdessen Cookies.

![](/uploads/cookie-set.png)

Cookie definieren: Der Webserver setzt mit dem Header Set-Cookie einen
Cookie im Browser, hier sessid=17.

Greift ein Browser das erste Mal auf eine Webanwendung zu, sendet er einen
GET-Request mit dem Namen der gewünschten Site im Host-Header und einigen
weiteren Headerzeilen, die uns hier heute nicht interessieren sollen.

```console
GET / HTTP/1.1
Host: www.shop.com
Connection: keep-alive
Accept: application/xml,application/xhtml+xml,text/html;q=0.9,text/plain;q=0.8,image/png,*/*;q=0.5
User-Agent: Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_6; en-US) AppleWebKit/534.13 (KHTML, like Gecko) Chrome/9.0.597.84 Safari/534.13
Accept-Encoding: gzip,deflate,sdch
Accept-Language: en-US,en;q=0.8
Accept-Charset: ISO-8859-1,utf-8;q=0.7,*;q=0.3
```

Die Webanwendung reagiert mit einer Antwort, die einen Content-Type
definiert (zum Beispiel _text/html_ für Webseiten) und die weitere Header
enthalten kann. Einer dieser Header ist _Set-Cookie_. Das ist die
Tätowierung, die unseren Browser von allen anderen Browsern unterscheidbar
macht.

```console
Set-Cookie: <name>=<value>
	[; expires=<date>]
	[; domain=<domain_name>]
	[; path=<some_path>]
	[; secure]
	[; httponly]
```

Set-Cookie definiert eine Variable mit dem Namen _Name_ und dem Wert
_value_. Es gibt Limits im Browser für die Anzahl und Länge dieser Variablen
pro Site und insgesamt. Mit der Definition eines Cookies können weitere
Einschränkungen festgelegt werden, die sagen wo und wie lange der Cookie
gelten soll: Die Einschränkungen, die man festlegen kann, bestimmen an
welche Domain der Cookie zurück übermittelt wird, wie lange er gelten soll,
ob er für eine ganze Site oder nur einige Pfade auf der Site definiert sein
soll, ob er nur mit SSL-Verschlüsselung übertragen werden soll und ob
Javascript mit dem Cookie arbeiten darf.

Der Browser erhält diese Definition mit der Webseite, die ihm übermittelt
wird, und während er die Webseite darstellt, speichert er die Variable und
den dazu gehörenden Wert ab.

Im Beispiel oben wird eine Variable mit dem Namen _sessid_ definiert, die
den Wert _17_ bekommt. Es ist eine zusätzliche Einschränkung definiert, die
festlegt, daß diese Variable bei allen Zugriffen auf Domains mit der Endung
_.shop.com_ übermittelt werden soll. Da kein _expires_-Wert gesetzt ist,
gilt die Variable so lange wie der Browser läuft - andernfalls gälte sie so
lange bis das gesetzte Datum verstrichen ist.

Mit jedem weiteren Zugriff (der die zusätzlichen Einschränkungen erfüllt)
setzt er jetzt eine zusätzliche Headerzeile _Cookie_, in der er die Variable
und ihren Wert zurück an den Server übermittelt.

![](/uploads/cookie-get.png)

Sobald ein Cookie gesetzt ist, übermittelt der Browser den Cookie bei jedem
nachfolgenden Requests, der die Bedingungen der Definition erfüllt. Hier
wird also nun für jeden Request an einen Host in der Domain shop.com die
sessid=17 mitgesendet. Der Browser ist nun eindeutig identifizierbar,
solange die sessid eindeutig vergeben wird.

Unser Beispielcookie ist ein sogenannter Session-Cookie - er wird ohne ein
_expires_ definiert und daher nicht auf der Festplatte, sondern nur im
Browser gespeichert. Beendet man den Browser, ist er verloren.
Session-Cookies dienen dazu, aufeinanderfolgende Web-Requests ein und
desselben Browsers miteinander zu verketten und erlauben es Webanwendungen,
Zustand zu haben.

## Zustand?

Eine Anwendung ist ein Programm, das bestimmte Funktionen hat. Entgegen den
Darstellungen in [gewissen Filmen](http://www.imdb.com/title/tt0084827/)
liegen Programme gewöhnlich auf der Platte rum und tun gar nichts. Nur wenn
sie gestartet werden, wird ihr Code um etwas ergänzt - Variablen. Die Summe
aller Variablen eines Programmes ist sein Zustand.

![](/uploads/application-state.png)

Beide Dateien werden zur selben Zeit im selben Texteditor bearbeitet. Text,
Cursorposition, Schriftart und Dateiname unterscheiden sich zwischen beiden
Dokumenten, d.h. diese Variablen haben in beiden Dokumenten unterschiedliche
Werte.

Ein Texteditor zum Beispiel hat viele Funktionen zum Bearbeiten von Texten.

Öffnet man ein neues Dokument, weiß der Textedit den Namen dieses Dokumentes
("untitled.txt"), die Cursorposition (links oben) und den Text, der in dem
Dokument enthalten ist sowie die aktuelle Schriftart und -farbe und noch
viele andere Dinge mehr.

Ein zweites Dokument (hier: "Faust 3 - die Rückkehr.txt") enthält anderen
Text, eine andere Cursorposition, eine andere Schriftart und so weiter. Der
Texteditor kann mehr als einen Text bearbeiten, weil er für jedes Dokument
seinen Zustand getrennt verwaltet.

![](/uploads/web-state.png)

Zwei Browser arbeiten mit demselben
Webshop, einer hat die sessid=17, der andere die sessid=18. In zwei
unterschiedlichen Datensätzen wird der Warenkorb für jeden Browser
verwaltet.

Genau so verhält es sich etwa bei einem Webshop. Auf dem Server liegt einmal
der Code der Webanwendung, mit Funktionen wie "Artikel anzeigen", "Warenkorb
verwalten" und "abkassieren". Aber natürlich muß man für jeden Benutzer des
Webservers - womöglich viele hundert Personen gleichzeitig - einen eigenen
Warenkorb verwalten.

Man kann den Warenkorb selbst in den Cookie tun, aber das hat eine Reihe von
Nachteilen. Zum Beispiel ist die Größe und Lebensdauer des Warenkorbes dann
von den Limits des Browsers eingeschränkt. Zum anderen ist es dann so, daß
die Daten des Warenkorbes bei jedem Request mit übermittelt werden müssen.
Das macht nicht nur jeden Request größer, sondern es macht auch bei jedem
Request einen Übergang von Daten aus der Gefahrenzone "nicht
vertrauenswürdig" (irgendein Browser im Internet) in die Gefahrenzone
"vertrauenswürdig" (unsere Webanwendung) notwendig, und führt so zu vielen
unnötigen Prüfungen der Datenintegrität.

Normalerweise setzt man in einem Session-Cookie nur eine eindeutige
Kennummer, die Session-ID. Die Daten des Warenkorbes selber speichert man in
einem Datensatz auf dem Server in einem Eintrag mit genau dieser Kennung.
Bekommen wir also einen Request von einem Browser mit der sessid=17, laden
wir den Datensatz für die sessid 17 und zeigen dem Kunden seinen Warenkorb
an. Bekommen wir stattdessen einen Request für die sessid 18, laden wir
diesen Warenkorb und zeigen diesen an.

Natürlich wird man nicht wirklich die Zahlen 17 und 18 verwenden, sondern
sehr große, zufällig gewählte Zahlen wie etwa
"a13bcf7a0b2fb6f9dfdebe2e0657c9e3" und "791c8d7234c56497fe23a593af3b1ab9".

Sähe ein Hacker etwa eine sessid wie "17", würde er sofort einmal nachsehen,
ob es "16" und "18" gibt und welche Daten da drin stecken. Bei
"a13bcf7a0b2fb6f9dfdebe2e0657c9e3" sind nicht nur andere IDs schwer zu
raten, sondern der gesamte Session-ID Raum ist dünn besetzt, d.h. die
meisten anderen geratenen IDs gehören zu gar keiner Session.

## Was wäre, wenn es keine Cookies gäbe?

Man könnte Session-IDs auch anders als mit Cookies übermitteln. Statt des
Requests

```console
GET /shop.html
Host: www.shop.com
Cookie: sessid=17
```

könnte man zum Beispiel auch die ID in die URL tun, also
`http://www.shop.com/shop.html?sessid=17` laden:

```console
GET /shop.html?sessid=17
Host: www.shop.com
```

als Request senden. Oder man baut die ID in den Hostnamen ein:
http://sessid17.shop.com/shop.html wäre die URL und der Request ist dann

```console
GET /shop.html
Host: sessid17.shop.com
```

Das Problem bei diesen anderen Verfahren ist, daß die Session-ID auf die
eine oder andere Weise Bestandteil der URL wird. Dadurch gibt man die
Session weiter, wenn man die URL an jemand anders per Cut & Paste per Mail,
Skype oder sonstwie übermittelt. Ja, die URL wird sogar unter Umständen mit
der Session-ID von Suchmaschinen archiviert - eine ganz schlechte Idee, denn
so bekommt jeder Benutzer der Suchmaschine dieselbe Session-ID, wenn er über
die Suchmaschine in unseren Shop kommt.

Es gibt Mechanismen, die mit diesen Problemen fertig werden und die eine URL
auch dann sicher machen können, wenn sie die Session-ID in der URL enthält,
aber es ist viel besser, einen Mechanismus zu verwenden, der das Problem
schon im Ansatz vermeidet - und das ist genau die Intention, die hinter der
Erfindung von Cookies stand.

## Cookies mit Datum und Auto-Login

Eine weitere Anwendungsmöglichkeit von Cookies ist die Speicherung von
Präferenzen im Webbrowser, sodaß eine Website bei folgenden Besuchen gleich
so aussieht, wie vom Benutzer voreingestellt.

Dazu wird ein Cookie mit einem Expires-Wert gesendet, der dann womöglich
erst sehr weit in der Zukunft seinen Inhalt verliert. Dadurch wird der
Cookie nicht mehr im Browser gespeichert, sondern auf der Festplatte in der
Browserkonfiguration verewigt. Er steht auch nach einem Neustart noch zur
Verfügung.

In dem Wert des Cookies werden die Benutzer-Voreinstellungen gespeichert -
oder gar ein Login-Token, das den Benutzer eindeutig identifiziert, das
schwer zu manipulieren ist und das auf diese Weisen den Benutzer bei allen
weiteren Besuchen auf der Site einloggt, ohne daß dieser noch einmal einen
Paßwort-Prompt zu sehen bekommt.

```console
Set-Cookie: Login=kris-23b9404f78d90b881175bcfc5f57b61c;       
	domain=.shop.com;
	expires=Sat, 01-Jan-2030 00:00:00 GMT;
	path=/;
```

Die Site hat nun Methoden, mit denen sie die behauptete Identität ("kris")
und den Authentizitätsbeweis (die Nummer da) zusammenführen kann und mit
denen sie ableiten kann, daß kris wirklich mal irgendwann in diesen Browser
sein Paßwort getippt hat. Sie loggt kris nun automatisch ein - für die
nächsten 20 Jahre.

## Die dunkle Seite der Kekse - Präferenzen und Tracking

Gesetzte Cookies werden bei jedem Request übermittelt, der die im Set-Cookie
gestellten Bedingungen erfüllt. Hat man also eine Webseite, die Bilder
enthält, wird der Cookie auch bei allen Requests für Bilddateien
mitgesendet.

Der Cookie-Mechanismus hat Einschränkungen, etwa bei der Domain-Bedingung.
So kann man als "www.shop.com" zwar einen Cookie für "domain=.shop.com"
setzen (also auch für "img.shop.com", "static.shop.com" und so weiter), aber
nicht für ".com" oder gar "." (alle Sites im Internet). Dieser etwas
unbeholfene Mechanismus soll verhindern, daß man Cookies als
Tracking-Mechanismus mißbrauchen kann.

Denn wäre es legal, einen Cookie wie diesen für die "Domain" "." (das ganze
Internet) zu senden:

```console
Set-Cookie: ID=ee487f1423d28992ee285760875e2cb8;
	expires=Sat, 01-Jan-2030 00:00:00 GMT;
	domain=.;
```

dann hätte man dem Browser des Benutzers für die nächsten beiden Dekaden
internet-weit eine eindeutige Kennung verpaßt und könnte diesen Benutzer
bequem tracken.

Leider ist die Regel "zwei Punkte im Domainnamen" für viele Domains kaputt
("www.shop.co.uk" zum Beispiel - mit der Zwei-Punkte-Regel kann man Cookies
für ganz .co.uk setzen), und so haben Browser in der Regel eine sehr lange
und komplizierte Liste von Ausnahmefällen, die versucht, diesen defekten
Cookie-Sicherheitsmechanismus zu reparieren.

## Tracking mit Cookies - und mit Javascript am Beispiel IVW

Werbebanner-Generierer und Auflagenzähler umgehen das Problem sowieso auf
anderen Wegen. In den Seiten von
[web.de](http://www.web.de) und bei vielen anderen Websites findet man zum
Beispiel Code wie diesen hier:

```html
<img src="http://webdessl.ivwbox.de/cgi-bin/ivw/CP/264_PH;sc%3Dwebde/homepage"
     alt=""
     width="1" height="1"/>
```

Dieser Code lädt ein 1x1 Pixel großes Bild - das Bild ist ein transparentes
GIF, also unsichtbar. Das Bild wird aber nicht von der Domain web.de
geladen, sondern von der Domain ivwbox.de.

Von dort bekommt man dann eine Antwort wie diese hier: 

```console
KK:~ kris$ curl -D x 'http://webdessl.ivwbox.de/cgi-bin/ivw/CP/264_PH;sc%3Dwebde/homepage'
KK:~ kris$ cat x
HTTP/1.0 302 FOUND
Date: Sat, 05 Feb 2011 18:20:49 GMT
...
Set-Cookie: i00=01914d4d94fc5da00006; path=/; domain=.ivwbox.de; expires=Sunday, 05-Feb-2012 18:20:44 GMT
```

Es wird also der Cookie _i00_ mit dem Wert _01914d4d94fc5da00006_ definiert.
Der Cookie hält ein Jahr lang und wird für die Domain ".ivwbox.de" gesetzt.

Immer wenn ich Seiten von web.de lade, wird das unsichtbare Zählpixel von
webdessl.ivwbox.de mit geladen und ich werde als Benutzer
01914d4d94fc5da00006 identifiziert. Die
[IVW](http://www.ivw.de/) kann so die eindeutig unterscheidbaren Benutzer
auf web.de zählen und so eine Werbe-Auflagenstärke für web.de angeben, nach
der sich der Werbepreis für Banner berechnet.

Das Pixel ist in jeder Seite von web.de, und bei einem geladenen Bild wird
im HTTP-Header "Referer" übermittelt, in welcher Seite das Bild enthalten
war. Dadurch kann man also leicht ermitteln, welche Klickpfade der Benutzer
01914d4d94fc5da00006 auf web.de so typischerweise hat und was seine
Verweildauer auf der Site ist. Verweildauern sind neben eindeutigen
Benutzern wichtig, weil Sites mit langer Verweildauer bessere Werbepreise
bekommen (oder was glaubt Ihr, warum es auf Facebook Spiele und Chat gibt?
Genau!).

Schließlich kann auch noch weitere Spielchen spielen, falls Javascript
aktiviert ist. So findet man etwa bei web.de vor dem Counterpixel den Code

```javascript
<script type="text/javascript" src="http://uim.tifbs.net/js/4423.js"></script>
``` 

der wiederum auf Umwegen die Datei
[http://uim.tifbs.net/js/global_4423_38.js](http://uim.tifbs.net/js/global_4423_38.js)
nachlädt.

Dort wird an geeigneter Stelle ein Aufruf wie folgt gemacht: 
```javascript
this._loadPixel(
        this._replaceVariables(
            '//pixelbox.uimserv.net/cgi-bin/webde/__TYPE__/__CODE__;sc%3D__SC__%26jsv%3D__JSV__%26scr%3D__SCR__%26flv%3D__FLV__%26vid%3D__VID__%26vct%3D__VCT__%26res%3D__RES__%26smv%3D__SMV__%26cona%3D__CONA__%26cost%3D__COST__?d%3D__D__%26r=__R__'
        )
);
```

Aus dem ganzen Drumherum geht hervor, dass die Texte der Form \_\_NAME\_\_
Platzhalter sind, die Werten ersetzt werden, die zuvor von Javascript
eingesammelt werden. FLV ist zum Beispiel die installierte Version von
Flash, RES die Bildschirmauflösung und so weiter. Die komplette Liste findet
man in der Funktion _replaceVariables in der Javascript-Datei. Auf diese
Weise bekommt pixelbox.uimserv.net, ein weiterer Zählservice, den web.de
verwendet, nicht nur die Benutzeridentät per Cookie geliefert, sondern über
den Pfad der URL und Javascript auch noch einen Haufen weitere Information
über den Rechner und seinen Benutzer.

Das Tracking der IVW ist jedoch ein wenig umfassender als man zunächt
vermuten mag: Es wird ja nicht ohne Grund die Domain ivwbox.de statt web.de
verwendet. Durch den Namen wird es möglich, den Cookie für ".ivwbox.de" zu
setzen, also für alle Hosts in der Domain ivwbox.de.

Wenn ich also 
[zeit.de](http://www.zeit.de) aufrufe, wird ein Zählpixel von
"zeitonl.ivwbox.de" geladen, wie man dort im HTML-Quelltext der Seite
nachlesen kann. Dabei wird meine Identität 01914d4d94fc5da00006 von web.de
ebenfalls wieder an .ivwbox.de übermittelt, und es wird dem Betreiber von
ivwbox.de über zeitonl.ivwbox.de bekannt, daß der Benutzer
01914d4d94fc5da00006 neben web.de auch zeit.de nutzt. Dieses Wissen kann man
natürlich gut gebrauchen, wenn man Werbebanner verkaufen will.

Über eine Verkettung von Daten könnte man das 01914d4d94fc5da00006-Pseudonym
sogar aufdecken - wenn ich mich bei web.de einlogge, könnte man das Login
kris@web.de mit der Kennung 01914d4d94fc5da00006 zusammenführen und weiß so,
daß kris@web.de die Zeit online liest.

## Das Datenschutz-Nichtproblem - oder doch?

web.de, zeit.de und ivwbox.de sind alles deutsche Rechner, die von deutschen
Firmen betrieben werden und man sagt mir, daß das IVW-Tracking mit dem
deutschen und europäischen Datenschutzrecht konform ist. Google Anaytics
macht dasselbe, aber deren Server stehen nicht in Deutschland und es ist
keine deutsche Firma, und daher
[steht deutschen Datenschützern](http://www.golem.de/1101/80990.html) gerade
Schaum vor dem Mund. Also wohlgemerkt, nicht wegen des Trackings, sondern
weil es außerhalb ihres Hoheitsgebietes stattfindet. Wenn es in Deutschland
passierte wäre alles gut:

> Websites dürfen IP-Adressen nicht ohne Erlaubnis des Nutzers in die USA
> übermitteln. Daher sei der Einsatz von Google Analytics in der jetzigen
> Form in aller Regel nach deutschem Recht nicht erlaubt, argumentiert Dix
> beim Treffen der Google Technology User Group Berlin.


## Zusammenfassung

Zusammenfassung: Cookies sind eine gute Sache und sie zu blockieren
verhindert sichere Sessions - und damit Funktionen wie Warenkörbe oder
Logins. Cookies können auch verwendet werden, um Benutzer zu tracken oder
andere fragwürdige Dinge zu tun. Es ist jedoch nicht der Mechanismus Cookie
böse, sondern die jeweilige Anwendung ist zu untersuchen.

Wenn man eine Sicherheitseinstellung im Browser treffen möchte, dann sollte
man Session-Cookies (jene ohne Expires-Datum) erlauben und Cookies mit
Verfallsdatum blockieren oder auf nachfragen stellen.
