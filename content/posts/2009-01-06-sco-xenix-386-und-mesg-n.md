---
author: isotopp
date: "2009-01-06T13:06:47Z"
feature-img: assets/img/background/rijksmuseum.jpg
tags:
- computer
- hack
- lang_de
title: SCO Xenix 386 und mesg n
---

Früher in SCO Xenix gab es in deren Terminalemulation eine Escape-Sequenz, die eine Hardcopy des Screens auslöste.
Ein Programm konnte eine bestimmte Esc-Sequenz an ein Terminal senden und das Terminal hat dann seinen Bildschirminhalt Zeichen für Zeichen an die Anwendung zurückgesendet.

Wenn also ein User auf Xenix eingeloggt war, und er in einer Shell stand, konnte man ihn mit dem Kommando "hello" oder "write" anchatten, ihm den Bildschirm löschen und ein Kommando in die linke obere Bildschirmecke drucken, danach dann eine Hardcopy-Sequenz senden.
Das Terminal hat dann den Bildschirminhalt, also das Kommando, an die Shell zurück reported. 
Die Shell hat das Kommando dann ausgeführt.

Da SCO Xenix nicht Open Source war, mußte man sich mit "mesg n" vor dem angechattet werden schützen.

Dieser uralte Bug ist nun wiederbelebt worden:
Offenbar kann X11s xterm verschiedene Escape-Sequenzen ausführen, die bestimmte Dinge reporten.
Etwa den aktuellen Fenstertitel und den Gerätestatus.
Alle diese Dinge kann man vorher auf bestimmte Werte - Kommandos - setzen.
In 
[dem Heise Artikel](http://www.heise.de/security/Terminal-Emulator-xterm-fuehrt-untergeschobene-Befehle-aus--/news/meldung/121196)
wird eine präparierte Datei erwähnt, aber solange "mesg y" aktiv ist, reicht wirklich ein "write" an diesen User zu senden ("cat escsequence | write username ttyname").

Schön, daß es das noch gibt.
Oder, um es mit Henry Spencer zu sagen, "Those who do not understand Unix are doomed to reinvent it. Poorly."
