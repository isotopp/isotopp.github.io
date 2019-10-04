---
layout: post
published: true
title: Path MTU Discovery Woes
author-id: isotopp
date: 2005-09-16 12:42:12 UTC
tags:
- computer
- debug
- network
- skurril
- work
- lang_de
feature-img: assets/img/background/rijksmuseum.jpg
---
Für jede Menge Kunden ....t-ipconnect.de funktioniert der Dienst. Für einige nicht. Für jede Menge Kunden ...mediaways.de funktioniert der Dienst, für einige nicht. Der Grund ist unklar, aber das ist zu sehen:

Wir senden 1380 Bytes: <blockquote>14:14:49.547013 IP server01.http >  kunde.t-ipconnect.de.4499: . 2430666386:2430667766 (1380) ack 3961356216 win 6432</blockquote> Empfänger meint, das ist ihm zu groß, er will kleiner 1492. <blockquote>14:14:49.568724 IP kunde.t-ipconnect.de >  server01: icmp 36: kunde.t-ipconnect.de unreachable - need to frag (mtu 1492)
14:14:49.612027 IP kunde.t-ipconnect.de.4499 > server01.http: . ack 0 win 16560</blockquote> Wir senden 1380, again: <blockquote>14:15:01.545769 IP server01.http > kunde.t-ipconnect.de.4499: . 0:1380(1380) ack 1 win 6432</blockquote> Wir werden wieder erniedrigt: <blockquote> 14:15:01.569573 IP kunde.t-ipconnect.de > server01: icmp 36: kunde.t-ipconnect.de unreachable - need to frag (mtu 1492)</blockquote> Mit einer erzwungenen MTU von 1000 verschwindet das Problem. Was geht hier vor?

Außerdem: <a href="http://www.ncne.org/jumbogram/mtu_discovery.php">Path MTU Discovery Service</a>.

<b>Update:</b> Ein kurzer Exchange aus dem Irc zum Thema:

<blockquote>SMP> Heh, Hi
SMP> Die 1380 byte im tcpdump enthalten nicht die IP und TCP header ;-)
Isotopp> SMP: Ich weiß, dann sind es 1420, und immer noch weniger als 1492.
SMP> 1380 ist wahrscheinlich die MSS die der Client advertised hat. Die passt allerdings zu 'ner MTU von 1420, was ich hier auch habe, nämlich durch IPsec (ESP) über PPPOE.
Isotopp> Bleibt die Frage, wieso er dann mit einem MTU 1492 päckchen reinkommt, wie gezeigt.
Isotopp> Denn dann geht die PMTU-Discovery ja nun genau nicht.
SMP> Ich kann es nur so erklären, dass auf Seite Kunde weiter getunnelt wird, der router aber die falsche MTU ins ICMP Paket tut -- nämlich die auf seinem Ausseninterface.
SMP> Wahlweise wird vielleicht auch nicht getunnelt, sondern jemand betreibt sein LAN mit einer falsch runtergeschraubten MTU.
Isotopp> Hmm, ich habe den Kollegen, mit dem wir das nachstellen können, noch mal angesprochen. Der hat ganz normal Telefonica-getriebenes DSL, mit einer 1492er MTU.
SMP> Naja, das unreachable kommt ja direkt von "seinem" router, d.h. es muss irgendwas dahinter sein wo er glaubt, dass es nicht durch passt.</blockquote>
