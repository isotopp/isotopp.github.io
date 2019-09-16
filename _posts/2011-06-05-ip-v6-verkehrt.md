---
layout: post
published: true
title: IP V6 verkehrt
author-id: isotopp
date: 2011-06-05 12:41:40 UTC
tags:
- datenschutz
- identity
- internet
- ipv6
- politik
- privacy
- spackeria
- lang_de
feature-img: assets/img/background/rijksmuseum.jpg
---
>Johannes Caspar, Hamburgischer Beauftragter für Datenschutz und
> Informationsfreiheit, sieht durch die Einführung des Internetprotokolls
> IPv6 den Datenschutz im Internet gefährdet. Er fordert den Gesetzgeber
> dazu auf, die Provider dazu zu verpflichten, dass sie IP-Adressen
> weiterhin dynamisch vergeben. 
>   -- [Heise Netze](http://www.heise.de/netze/meldung/Datenschuetzer-sorgt-sich-wegen-IPv6-1235312.html)


Schon seit [vielen Jahren]({% link _posts/2005-05-23-identifizierung-durch-ip.md %})
versteifen sich Sicherheitsbehörden, Abmahnszene und viele andere Leute
auf die Idee, daß eine IP-Nummer (zu einem gegebenen Zeitpunkt) eine
Person identifiziert. Das führt fast schon traditionell zu abschreckenden
[Hausdurchsuchungen bei Betreibern von tor-Servern](http://www.netzpolitik.org/2011/wieder-hausdurchsuchung-wegen-tor-exit-server/)
und anderen seltsamen Randerscheinungen.

Nicht ganz so lange, aber schon fast so lange gibt es die Erkenntnis, daß
[so eine IP-Nummer irgendwie gar nix beweist]({% link _posts/2008-11-08-ip-nummern-und-elektronische-personalausweise.md %})
auch wenn das 
[den entsprechenden Bedarfsträgern weitgehend egal ist]({% link _posts/2005-06-27-vorratsdatenspeicherung.md %}).

Anders herum hätten wir nun mit IP V6 endlich die Gelegenheit, feste
IP-Nummern und sogar Netze für daheim zu bekommen und so allen möglichen
Arten von Diensten aufzubauen, die vorher nur unter Schmerzen und
Performanceproblemen zu realisieren waren. Nun kehrt sich die Sachlage um,
und 
[Datenschützer sind der Meinung, daß eine IP-Nummer irgendetwas beweist](http://www.heise.de/netze/meldung/Datenschuetzer-sorgt-sich-wegen-IPv6-1235312.html)
und wollen daher statische IP-Nummern weg haben.

Die Logik erschließt sich mir nicht. Wenn ich Anonymität haben will, dann
[muß ich sie selber erzeugen]({% link _posts/2005-06-05-selber-zwiebeln-anonymit-t-selbst-gemacht.md %}).
Das wissen eben genau diese Datenschützer auch, haben sie doch selber
[AN.ON]({% link _posts/2006-11-24-an-on.md %}) selbst betrieben
und tor propagiert, und an Papieren über
[Anonymitätdefinitionen]({% link _posts/2005-05-24-ber-anonymit-t-reden.md %})
mitgewirkt.

Die Einlassungen von Herrn Caspar sind auf viele verschiedene Weisen
unsagbar dumm. Er propagiert mit seiner Forderung die vollkommen falsche
Idee, dynamische IP-Nummern würden vor irgendetwas schützen, wenn es darauf
ankäme: Inhaber einer dynamischen IP-Nummern zu einem gegebenen Zeitpunkt
sind aufdeckbar und identifizierbar, die benutzten Werkzeuge sind auch ohne
IP-Nummer trackbar, und Personentracking funktioniert oft mit mehreren
Signalen, etwa Browserstrings,
[Cookies]({% link _posts/2011-02-05-c-is-for-cookie.md %}) und
Flash-Cookies. IP-Nummern zu wechseln hat keine Schutzwirkung.

Der Verzicht auf statische IP-Nummern hat außerdem den Nebeneffekt, daß
damit das Anbieten von dezentralen, selbst betriebenen Diensten erschwert
wird, und das Internet als Konsumenten-Anbeiter-System statt Peer-2-Peer
System zementiert wird. Caspar, der Datenschützer, spielt so großen,
zentralisierten Diensteanbietern außerhalb der Jurisdiktion von Deutschland
in die Hände.

Diese Art von Datenschutz schützt niemanden. Im Gegenteil, sie ist
Bestandteil des sich selbst erhaltenden, innovationsfeindlichen "Systems
Datenschutz" in Deutschland, und genau der Grund für das Entstehen der
Spackeria ([@fasel](http://twitter.com/fasel) bei der
[Spackeria](http://blog.spackeria.org) zum [selben
Thema](http://blog.spackeria.org/2011/05/27/ipv6-und-die-machtfrage/)).
