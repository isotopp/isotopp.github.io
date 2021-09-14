---
layout: post
published: true
title: IVW jetzt "datenschutzkonform" (Updated)
author-id: isotopp
date: 2011-08-10 19:45:27 UTC
tags:
- cookie
- datenschutz
- identity
- security
- lang_de
feature-img: assets/img/background/rijksmuseum.jpg
---
Auf dem Heiseticker findet man die Mitteilung 
[Hamburger Datenschutzbeauftragter: Reichweitenmessung der IVW ist datenschutzkonform](http://www.heise.de/newsticker/meldung/Hamburger-Datenschutzbeauftragter-Reichweitenmessung-der-IVW-ist-datenschutzkonform-1320862.html).

Die Geschichte begann mit dem hamburgischen Datenschutzbeauftragten Caspar,
der mit nicht wenig Schaum vor dem Mund gegen Google Analytics wetterte,
zugleich aber in seiner eigenen Präsentation IVW Zählpixel hatte. Als das
raus kam, hielt Caspar schnell den Mund und schaltete seine Webpräsenz ab.
Nun heißt es: 

> Diese Woche meldeten die Beteiligten in einer Pressemeldung nun eine
> Einigung hinsichtlich einer datenschutzkonformen Nutzung des Meßsystems.
> Man habe dadurch "datenschutzrechtliche Verbesserungen mit bundesweiter
> Bedeutung" erreicht und die im Januar gemachten Zusagen umgesetzt, loben
> sich die Beteiligten in ihrer Meldung.

Konkret heißt das: Die IP-Adresse, die das IVW-Teil speichert, wird um das
letzte Byte verkürzt. Es werden also Gruppen von 256 IP-Nummern zusammen
abgerechnet. Außerdem gibt es jetzt eine 
[Opt-Out Möglichkeit](optout.iwbox.de). Abgerundet soll das ganze durch
Vertragsänderungen zwischen der IVW-Betreibergesellschaft und der nutzenden
Website.

Das Ergebnis ist weitgehend witzlos, wie man sich leicht überlegen kann,
wenn man 
[C is for Cookie]({% link _posts/2011-02-05-c-is-for-cookie.md %})
gelesen und verstanden hat - Caspar hat gar nichts bewirkt.

Das Zählsystem der IVW beruht nur am Rande auf IP-Adressen: Es gibt eine
ganze Reihe von Benutzern, die auf das Web durch Proxies zugreifen, und die
IVW will nun gerade solche Benutzer trennen können, die dieselbe IP-Adresse
haben, aber mehr als eine Person repräsentieren. Andererseits gibt es
Benutzer, deren IP-Nummer auf zwei aufeinander folgenden Zugriffen wechselt
(etwa Benutzer sehr großer Proxies, oder DSL-Benutzer nach einer
Zwangstrennung), und die IVW will solche Benutzer auch nach einem solchen
Adreßwechsel weiter als dieselbe Person tracken können.

*Der deutsche Datenschutz versteift sich auf die IP-Adresse als personenbezogenes Datum*,
aber die ist in Bezug auf Tracking eigentlich eher witzlos - Cookies und 
[Supercookies](http://www.heise.de/tp/blogs/6/150231) sind die Methode der Wahl.

Auch die IVW arbeitet mit Cookies, genau genommen mit einem Cookie i00, der
für die Domain \*.ivwbox.de mit einer Lebensdauer von einem Jahr gesetzt
wird. Dieser Cookie bekommt eine eindeutige Kennung, mit der ein User von
allen anderen Usern unterscheidbar wird (siehe auch 
[C is for Cookie]({% link _posts/2011-02-05-c-is-for-cookie.md %})
und suche nach i00).

Das Ziel der IVW ist erklärtermaßen, Page Impressions auf der Site eines
Anbieters zu zählen. Die IVW, die jetzt angeblich datenschutzkonform
arbeitet, erhebt jedoch viel mehr Daten, die für diesen Zweck gar nicht
notwendig sind: 

- Der Cookie wird für einen viel zu langen Zeitraum gesetzt (wieso nicht als
  Session-Cookie, der beim Stop des Browsers gelöscht wird, oder mit der
  Laufzeit "1 Tag"?).
- Der Cookie wird für die Domain *.ivwbox.de gesetzt, und jeder IVW-Nutzer
  arbeitet unter dieser Domain - webdessl.ivwbox.de und zeit.ivwbox.de zum
  Beispiel bekommen beide dieselbe Kennung für denselben Browser/User zu
  sehen.
- Das Opt-Out setzt ein Cookie. Es ist also an einen Browser gebunden - man
  muß für jeden seiner Browser neu opt-outen, und das Opt-Out erlischt,
  sollte man jemals seine Cookies verlieren oder löschen.
- Genau genommen wird gar kein Opt-Out implementiert, sondern die o.a.
  opt-out Site setzt den i00-Cookie für *.ivwbox.de auf einen festen Wert,
  0000000000000000cafe. Das heißt, es wird immer noch gezählt, aber alle
  User, die opt-out gemacht haben, werden nun zusammen unter derselben ID
  gebucht. Wenn es also nur Einer alleine macht, bewirkt das genau gar nix.
- Das Zählpixel überträgt noch viel mehr Informationen, da es ja im Kontext
  der Seite des IVW-Kunden geladen wird. Insbesondere wird vom Zählpixel
  auch ein Referer übermittelt, also die URL der Seite, in der das Pixel
  enthalten ist. Wenn diese Seite Parameter hat, also das Resultat eines
  METHOD='GET' Formulars ist, dann werden alle diese möglicherweise
  personenbeziehbaren Daten über den Referer auch an die IVW geleaked.

Zusammenfassend kann man sagen, daß die Maßnahmen von Caspar so wie sie vom
Heise Newsticker berichtet werden, das Problem genau gar nicht adressieren
und die Situation keinen Fatz verbessern: Noch immer erfaßt IVW Daten, die
für den Zweck der Ermittlung von PI nicht benötigt werden und daß über
Kunden-Domaingrenzen hinweg (Cookie für *.ivwbox.de).

![](/uploads/datenschutz-ghostery.png)


Man fragt sich, ob es beim Hamburgischen Datenschutzbeauftragten nur noch
Juristen und keine Techniker mehr gibt, und ob er nicht vielleicht mal bei
seinen Nachbarn im Norden nachfragen will, von denen ich weiß, daß sie
solche Sachen besser im Griff haben.

**Update:** Bei Herrn Stadler greift man diesen Artikel auf: 

[IVW Tracking Tool doch nicht datenschutzkonform](http://www.internet-law.de/2011/08/ivw-tracking-tool-doch-nicht-datenschutzkonform.html).

Ich fragte dort in den Kommentaren: 

> Ich habe da noch ein paar weitere Fragen. Wenn ich irgendwo was kaufe,
> dann muß ich da ja oftmals zwei Mal unterschreiben – einmal in den Vertrag
> einwilligen, und dann noch mal Extra das Datenschutzblabla unterzeichnen,
> weil das nicht Bestandteil der AGB sein darf und eine gesonderte
> Einwilligung braucht.
> 
> Das ist also tierisch wichtig und so.
> 
> Wieso kann eine Website, die IVW nutzt, das implizit tun, also ohne
> gesonderte ausdrückliche Willenserklärung von mir, wenn das zum Beispiel
> auf jedem Kassenzettel nicht geht und stattdessen jetzt zwei
> Unterschriften von mir braucht?
> 
> Oder im Fall der IVW sogar mit einem Default-Opt-In und einem optionalen
> Opt-Out, also genau anders rum als auf jedem Kassenzettel?
> 
> Und im Fall der IVW mit einem volatilen Opt-Out (als Cookie) pro Browser
> pro Rechner, den ich habe? Ich meine, sollte ich nicht einmal eine
> Willenserklärung auf das Opt-Out abgeben (Ich dachte, ich müßte gesondert
> unterschreiben?) und dann ist das deren Problem, mich wiederzuerkennen und
> sich an unsere Abmachungen zu halten?

Thomas Stadler antwortet mir: 

> Die Frage ist äußerst berechtigt. Die erste Frage, die man hier stellen
> muss lautet aber, ob das IVW-Tool personenbezogene Daten erhebt. Wenn ja,
> dann geht es so nicht.

Ich erweiterte meine Ausführungen mit: 

> @2: "Die erste Frage, die man hier stellen muss lautet aber, ob das
> IVW-Tool personenbezogene Daten erhebt. Wenn ja, dann geht es so nicht."
> 
> Die Frage ist doch irgendwie schon beantwortet, denke ich.
> 
> Es sind die Datenschützer, speziell die in Hamburg, die sich über
> IP-Adressen aufgeregt haben, also der Ansicht sind, daß *das*
> personenbezogene oder personenbeziehbare Informationen sind. Speziell die
> Hamburger Datenschützer halten das für gefährlich und verboten genug, um
> deswegen Pressemittelungen raus zu hauen, gegen Leute vorzugehen und ihre
> eigene Präsenz abschalten.
> 
> IVW-Cookies (die i00-Cookies) kleben aber noch viel besser an "einer
> Person" als es IP-Adressen jemals tun.
> 
> IP-Adressen wechseln für viele Kunden jeden Tag, durch die Zwangstrennung.
> Kunden, die durch einen großen Proxy (mit mehr als 30.000 bis 40.000
> konkurrenten Nutzern) surfen bekommen außerdem unterschiedliche IP-Nummern
> bei aufeinanderfolgenden Requests, weil der Proxy mehrere Exit-Adressen
> hat (AOL, Telekom machen es so). Andererseits sind IP-Adressen von Kunden,
> die hinter Firmenfirewalls oder solchen Proxies sitzen, nicht trennscharf:
> Viele Kunden treten unter derselben IP-Adresse auf.
> 
> Der i00-Cookie dagegen wird per Browser vergeben und hat eine Lebensdauer
> von einem Jahr: Die IVW/INFOnline oder wer auch immer verwendet diesen
> Cookie ja genau deswegen, weil er besser trennt als IP-Adressen, weil er
> also besser personenbeziehbar ist.
> 
> Und wie die IP-Adresse auch wird der i00-Cookie nicht pro Site vergeben,
> sondern für alle *.ivwbox.de-Domains gemeinsam gesetzt. Das heißt, man
> schlägt auf zeit.ivwbox.de mit demselben i00-Cookie auf wie auf
> webdessl.ivwbox.de, die Daten können technisch zusammengeführt werden und
> es können Bewegungsprofile erstellt werden.
> 
> Für den angegebenen Verwendungszweck der IVW, das Zählen von PI, ist das
> vollkommen unnötig, wie auch die Lebensdauer von einem Jahr für diesen
> Zweck vollkommen übertrieben ist (30 Minuten würden reichen). Es sind die
> gierigen Finger der AGOF, die hier mehr Daten haben wollen, aber das ist
> ein ganz anderer Anwendungszweck.
> 
> Das heißt rein logisch: Wenn eine IP-Adresse schon böse, verboten oder
> anonymisierungspflichtig ist, weil die potentiell bei einigen Nutzern
> personenbeziehbar ist, dann muß ein i00-Cookie das noch mehr sein, oder
> die ganze Argumentation fällt nach den Gesetzen der Logik als inkonsistent
> und inkonsequent in sich zusammen.
>
> Jetzt Zusammenfassung von Ip-Adressen durch Löschung des letzten Bytes zu
> /24 zu feiern, aber weiter mit i00-Cookies zu arbeiten ist schlicht
> inkompetent, wenn es aus Versehen passiert ist. Oder verlogen, falls es
> Absicht war.
