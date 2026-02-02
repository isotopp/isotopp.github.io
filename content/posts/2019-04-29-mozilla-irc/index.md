---
author: isotopp
title: Mozilla und IRC
date: "2019-04-29T17:41:47Z"
feature-img: assets/img/background/rijksmuseum.jpg
tags:
  - pluspora_import
  - lang_de
  - computer
aliases:
  - /2019/04/29/mozilla-irc.html
---

Heise berichtet: [Mozilla will weg von IRC und sucht Alternative](https://www.heise.de/newsticker/meldung/Mozilla-will-weg-von-IRC-und-sucht-Alternative-4409327.html).

Und das Heiseforum sabbert reflexartig:
> Aber IRC ist doch noch gut, da muß man nur einmal mit der Drahtbürste rüber und dann kann das wieder auf Lager gelegt werden.

Und:
> XMPP! XMPP ist gut, denn es ist ein offener Standard.

Ja, dann also mal Iso-Standard-Rant 8859-1:

Erst mal IRC.

IRC ist kaum mal ein Protokoll. 
Es gibt einen einzigen RFC zum Thema IRC, rfc1459 von 1993 und das enthält nicht mal MIME, weiß nichts von UTF-8 und definiert den Zeichensatz von IRC als ASCII-Variante Geschmacksrichtung Schweden mit []{} als lustige Sonderzeichen.

Moderne Anforderungen an Chat werden nicht abgedeckt:
In der Variante wie im RFC gibt es keine Identitäten und keine Authentisierung, kein TLS und auch sonst keine Sicherheit. 
Ein IRC-Server nach diesem Standard würde Spam, Identitätsdiebstahl und Abhören Tür und Tor öffnen.
Ircnet ist ein deutsches Netz nach diesem Standard und hat genau alle diese Probleme -- Ban und Blockierung erfolgt nach IP-Ranges und als Nutzer aus dem AS der Deutschen Telekom muß man im Ircnet schwere Einschränkungen hin nehmen, weil Ircnet seine Nutzer nicht unterscheiden kann.

Irc hat keine Presence und keine Persistenz.
Das ist natürlich blöd, wenn man ein Mobilnutzer ist und nicht nur laufend Disconnected, sondern auch noch laufend eine wechselnde Portnummer und IP auf dem Gateway des Mobilnetzes hat.
Das Konzept von Pushnachrichten-Servern wie sie Google und Apple für mobile Nutzung voraussetzen kennt IRC nicht.
Damit ist eine sinnvolle Teilnahme an IRC mit einem mobilen Client nicht möglich und man belästigt alle Channelteilnehmer laufend mit QUIT-Nachrichten, und hat keine Historie des Chats, wenn man gerade offline ist.

IRC hat nicht nur keine Zeichensätze, sondern auch sonst keine Form von moderner Kommunikation:
Keinen funktionierenden File Transfer, denn DCC und CTCP funktionieren weitverbreitet nicht mehr, keine Inline Images, keine Eskalation zu Voice- und Videochat, keine strukturierte Kommunikation mit Threads, sodaß man auch nicht Themen und Replies auf Themen bannen kann, und auch alle anderen Merkmale moderner Chat-Anwendungen fehlen.

IRC baut Chat um eine spatiale Metapher - Räume oder Channels, offene Gruppen.
Es ist möglich, geschlossene Gruppen oder 1:1 zu machen, aber das ist mehr so aufgesetzt.
Zugangskontrollen sind - auch wegen des fehlenden Identitätsmanagements - primitiv:
Geschlossene Gruppen sind offene Gruppen mit einem globalen Paßwort, Zugangskontrolle um Identität und ACLs gibt es mehr so nicht.

TLS und Verschlüsselung existieren in unterschiedlichen Geschmacksrichtungen, sind aber undefiniert.

Dann XMPP.

Das ist quasi das Gegenteil von IRC:
Es gibt nicht einen Standard für XMPP, es gibt [https://xmpp.org/extensions/](https://xmpp.org/extensions/).
Es gibt keine Profile.
Es ist jedem Client und Server überlassen, einen beliebigen Subset dieser Standards beliebig mißzuverstehen und zu implementieren und dann zu hoffen, daß etwas Sinnvolles dabei herauskommt.

Das Resultat ist dann zum Beispiel ein Cisco Jabber Server, der für jede Nachricht ein DELAYED-Attribut setzt, auch bei Nachrichten, die nicht delayed sind und erwartet, daß der Client das an den Timestamp-Values in den Attributen selbst auseinander fisselt.
Und ein libpurple, wie es in Adium eingesetzt wird, das das nicht juckt und daß alle Nachrichten mit DELAYED-Attribut immer als gelesen anzeigt.

Und wenn jemand zwei beliebige Jabber-Clients und einen beliebigen XMPP-Server dazu bekommt, einen Filetransfer zu machen, wenn auf einer Seite ein NAT involviert ist, ohne eine schwarze Ziege oder gar einige Menschen zu opfern - meinen Respekt.
Im Allgemeinen kann man aber sagen, daß das für normalsterbliche Menschen auch mit viel Blutvergießen nicht lösbar ist.

XMPP ist ein Protokoll, das für alles mögliche eingesetzt ist - nicht nur für Chaträume, sondern auch für einen Haufen anderer Maschine-Maschine Kommunikation.
Das Ergebnis ist ein Protokoll, das von jedem irgendwie eingesetzt wird, aber eigentlich für niemanden funktioniert und ganz sicher nicht interoperabel ist.
Das ist auch einer der Gründe, warum Jabber als Chat allgemein tot ist und sich proprietäre Chat-Lösungen durchgesetzt haben - Client installieren, loslegen.
Es geht einfach.

Offene Protokolle und Lösungen haben bei Chat einen Marktanteil von nahe 0 und das wird sich auch in naher Zukunft nicht ändern.
