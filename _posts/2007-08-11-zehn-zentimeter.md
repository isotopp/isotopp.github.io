---
layout: post
published: true
title: Zehn Zentimeter
author-id: isotopp
date: 2007-08-11 21:06:08 UTC
tags:
- datenbanken
- mysql
- performance
- lang_de
feature-img: assets/img/background/mysql.jpg
---
> Kristian, wenn Du über Performance redest, dann redest Du immer von
> [verteilten, asynchronen Systemen]({% link _posts/2006-07-30-leben-mit-fehlern-der-schl-ssel-zum-scaleout.md %}).
> Verteilte, asynchrone Systeme sind doof, schwer zu programmieren und
> laufen der Theorie zuwider, die ich an der Uni gelernt habe. Ich warte
> glaube ich lieber auf schnellere Prozessoren.

Viel Spaß beim Warten. Godot wird Dir Deine neue CPU bestimmt bald bringen.

Ein Gigahertz ist ein Takt pro Nanosekunde. Bei Lichtgeschwindigkeit kommt
das Signal in einer Nanosekunde in etwa 30cm weit. In der Cray, die jetzt
als Bar in der Lobby vom RZ der Uni Stuttgart Dienst tut, sind alle Kabel
Vielfache von 30cm lang. Dadurch ist jedes Kabel auch eine Delay von 1, 2, 3
oder 4ns.

Heutige Rechner haben einen Takt von so um die 3 GHz. Der Teil der Maschine,
der mit 3 GHz gepowert ist hat wenig überraschend einen Radius von etwas
unter 5 cm. Das ist der Bereich, in dem man bei diesem Takt binnen eines
Taktzyklus Round-Trip-Time (5cm hin und zurück = 1/3ns = 3GHz Takt) einen
konsistenten, synchronen Zustand herstellen kann. Will man größere Maschinen
bauen, die weiterhin synchron und konsistent sind, muß man die
Lichtgeschwindigkeit erhöhen (die Zeit verlangsamen) oder den Takt
herabsetzen. Also braucht man entweder ein schwarzes Loch in der CPU oder
einen niedrigeren Systemtakt oder ein anderes Konzept.

Das kann man akzeptieren oder nicht. Diejenigen, die es nicht akzeptieren,
können gerne Two Phase Commit auf einem Interkontinental-Link machen und
sich über Performanceprobleme beklagen. Aber bitte nicht bei mir.
