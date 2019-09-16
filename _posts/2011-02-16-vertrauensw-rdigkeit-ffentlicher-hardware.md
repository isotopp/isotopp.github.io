---
layout: post
published: true
title: Vertrauenswürdigkeit öffentlicher Hardware
author-id: isotopp
date: 2011-02-16 14:53:04 UTC
tags:
- damals
- hack
- security
- lang_de
feature-img: assets/img/background/rijksmuseum.jpg
---

[Hardware keyloggers found in Manchester library PCs](http://www.theregister.co.uk/2011/02/15/hardware_keyloggers_manchester_libraries/) schreibt The Register: 

> Hardware keyloggers have been discovered in public libraries in Greater
> Manchester.Two USB devices, attached to keyboard sockets on the back of
> computers in Wilmslow and Handforth libraries, would have enabled baddies
> to record every keystroke made on compromised PCs. It's unclear who placed
> the snooping devices on the machines but the likely purpose was to capture
> banking login credentials on the devices prior to their retrieval and use
> in banking fraud.

Vor vielen Jahren stand in der Hauptpost in Kiel wie in vielen anderen
Postfilialen ein öffentliches BTX Terminal. Solche Geräte wurden zu dieser
Zeit dadurch realisiert, daß man ein Standard CEPT-Terminal mit einem
[DBT-03](http://de.wikipedia.org/wiki/Datei:Modem_DBT-03.jpg) in ein Gehäuse
geschwartet hat und mit einer robusten Tastatur versehen hat.

Öffentliche BTX-Terminals waren damals ein tolle Sache, weil man auf ihnen
private Nachrichten kostenlos versenden konnte, statt die damals üblichen 40
Pfennige pro Mail bezahlen zu müssen, und weil man auf ihnen sogenannte BTX
Regionalseiten abrufen konnte, ohne die damals üblichen 2 Pfennige pro Seite
bezahlen zu müssen (Und ihr fragt Euch noch, was Euch erwartet, wenn die
Netzwerkneutralität kippt?).

Wenn man sich also in das BTX System mit der Teilnehmerkennung und dem
Paßwort eines öffentlichen Terminals einloggen könnte, dann war das schon
sehr attraktiv, damals.

Der Schwachpunkt an der Angelegenheit war damals das DBT-03.

Für die Post war das DBT-03 sehr attraktiv, weil es als spezielles BTX-Modem
die Teilnehmerkennung und das Paßwort in der Hardware eingebaut hatte und
man so an einem öffentlichen Terminal beim Verbindungsaufbau keinen Login
durchführen mußte. Für den Hacker war das DBT-03 attraktiv, weil das DBT-03
ist ein Ultrabillig-Modem gewesen ist, das für alles zu dumm war.

Normale Modems heben beim Verbindungsaufbau ab und lauschen nach einem
Freizeichen. Nicht so das DBT-03. Das gebt ab und wählt los.

Wenn man sich also nach der Schule um Punkt 15:00 am Terminal einfindet und
dann "Verbindungsaufbau" am Terminal drückt, dann legt das DBT-03 auf,
wartet und hebt wieder ab, um dann loszuwählen. Es wählt dabei von einem
Telefonanschluß los, dessen Rufndummer wie damals üblich mit seiner
BTX-Teilnehmerkennung identisch war. Ruft nun also ganz zufällig jemand
genau um 15:00 auf dieser Rufnummer an, dann hebt das DBT-03 ab, hört nicht
auf ein Freizeichen, und wählt los - dadurch wird die angenommene Verbindung
aber nicht mehr getrennt.

Dann pfeift das DBT-03 seinen Carrier und bekommt die Gegenseite ans Rohr,
von der es glaubt, daß es die BTX Leitzentrale in Ulm sei. Die Gegenseite
sendet also eine BTX Startseite mit einem Usernamen-Feld, und das DBT-03
sendet brav seine Hardware-Teilnehmerkennung. Die Gegenseite pfeift ein
Paßwortfeld, und das DBT-03 sendet brav sein Paßwort. Die Gegenseite legt
auf.

Wenige Stunden später sind circa zwei Dutzend öffentliche BTX-Terminals
Hauptpost Kiel simultan in Ulm eingeloggt.

Natürlich fällt so etwas auf, und man reagiert darauf, indem man das Paßwort
des Zugangs ändert, d.h. die Modemhardware austauscht. Das behebt natürlich
nicht die Quelle des Angriffes - am nächsten Nachmittag steht also wieder
ein pickeliger Schülertypie im Parka am Gerät und drückt die "Trennen"- und
dann die "Verbindung aufbauen"-Taste und wenige Stunden später...

Nunja. Irgendwann mußte man am ÖBTX halt mit einer Telefonkarte bezahlen
statt den Dienst kostenlos nutzen zu können. Wie schade. Aber da gab es dann
auch schon USENET und Interessen verschoben sich.

Warum ich die Geschichte erwähne? Auch damals standen gerne Leute am ÖBTX
und machten in der Hauptpost ihr BTX-basierendes Onlinebanking. Ich fand das
immer sehr leichtsinnig. Wer weiß schon, wer da am anderen Ende zuhört!
