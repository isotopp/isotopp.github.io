---
author: isotopp
date: "2004-12-14T19:06:04Z"
feature-img: assets/img/background/rijksmuseum.jpg
published: true
tags:
- computer
- lang_de
- free software
title: Open Source Software und Firmen
---

Viele Firmen verwenden Open Source.
Dagegen ist auch wenig zu sagen - viele Open-Source-Software ist gut, und in den meisten Fällen ist sie leichter zu durchschauen, flexibler anzupassen und sehr viel einfacher zu debuggen als Closed Source Software. 
Aber Open Source braucht andere Prozesse als Closed Source, wenn es um Anpassung, Änderung und Deployment geht.

Die Tatsache, daß Open Source änderbar ist, verführt viele Firmen dazu, die Software wirklich zu ändern.
Aber Ändern ist nur ein Teil der Arbeit, und meistens der billigste.

Was nämlich passiert, ist meistens das folgende: 
Eine Firma nimmt sich ein Stück Software, und passt ihn auf ihre Bedürfnisse an.
Die Änderungen werden dann im Hause gelassen und nicht an die offizielle Source-Basis zurück übergeben, denn dies ist ein komplizierter Prozess:

Zum einen muss im Hause die Erlaubnis erwirkt werden, potenzielles Intellectual Property freizugeben, was ja vielleicht den Shareholder-Value der Firma gefährden würde.
Zum anderen muss die Änderung in einer Form sein, die nicht nur den internen Ansprüchen an eine ad-hoc Änderung im Kontext der Firma genügt, sondern sie muss auch den - meistens viel härteren - Ansprüchen des Open Source Projektes genügen. 
Das bedeutet, man würde im Hause Entwicklungsaufwand nicht für die Zwecke der Firma, sondern für irgendein Open-Source-Projekt auf Kosten der Firma betreiben.

Also belässt man es in den meisten Fällen dabei, Zeug im Hause zu ändern und gibt die Änderungen nicht an das Originalprojekt zurück.
Das ist sogar nach den Maßstäben der sonst recht strengen GPL 2 legal - Quelltexte müssen nur dann offengelegt werden, wenn das Binary weitergegeben wird.
Und das passiert ja in der Regel nicht.
Jetzt hat man effektiv einen hausinternen Fork eines Open-Source-Projektes am Hals.

Das Open-Source-Projekt entwickelt sich weiter, und baut weitere, neue Features ein.
Will man jetzt im Hause diese neuen Features im hausinternen Projekt nutzen, hat man ein riesiges Upgrade-Problem am Hals.
Denn alle lokalen Änderungen müssen aus der alten Codebasis in die neue portiert werden.
Dort werden sie integriert und getestet - um dann beim nächsten Upgrade wieder denselben Aufwand zu verursachen.

## So eingesetzt ist Open Source letztendlich zwangsläufig unrentabel.

Mit dem Einsatz von Open Source muss letztendlich firmenintern auch eine Policy definiert werden. 
Diese Policy muss, damit die Sache sich rechnet, folgende Eckpunkte festlegen:

Entweder: 
Wir lesen Open Source nur, wir schreiben ihn nicht.
Wenn sich Dinge nicht konfigurieren lassen, dann ändern wir sie nicht am Source, sondern bitten das Projekt, die Software für unsere Zwecke anzupassen.
Wenn sie das nicht tun, müssen wir uns anderweitig umsehen.

Oder:
Wir lesen und schreiben Open Source.
Wenn wir Open Source schreiben, dann tun wir das in dem Bewusstsein, daß wir von vorneherein geschäftsspezifische Logik und allgemeingültigen Code getrennt halten müssen.

Allen allgemeingültigen Code entwickeln wir auf Kosten des Hauses so weit, daß er vom Projekt als unsere Contribution in die offizielle Codebasis zurück akzeptiert wird.
Dadurch sind wir die Verantwortung für diesen Code los und können Weiterentwicklungen an diesem Code aus der offiziellen Codebasis ohne Änderung im Hause nutzen.

Alle geschäftsspezifische Logik entwickeln wir im Hause so weit, daß wir allgemeingültige Plugin-Schnittstellen oder andere Isolationsmechanismen in die Software einbauen oder einbauen lassen.
Wir realisieren dann unsere geschäftsspezifische Logik grundsätzlich so, daß wir die offizielle Codebasis nicht patchen, sondern lediglich Plugins für sie schreiben.

So halten wir die Trennlinie zwischen offiziellem und firmeneigenem Code sauber aufrecht, und verbauen uns nicht die Möglichkeit, offiziellen Code jederzeit in die Produktion im Hause integrieren zu können.
Andererseits stellen wir so sicher, daß geschäftsspezifische Logik nicht aus Versehen veröffentlicht wird.

Dies zu lernen und zu verstehen ist für manche Firmen ein harter und teurer Prozess.
Es ist billiger und bequemer, Code im Hause für andere Leute zu schreiben und zu verschenken, als solches wertvolles Intellectual Property im Hause zu halten? 
Das klingt beim ersten Hören paradox.
Erst die Langzeit-Betrachtung der Prozesse und Kosten im Hause macht klar, daß eine Firma Änderungen an Open-Source-Projekten im Hause sehr dringend aus dem Haus bekommen muss, wenn sich Open Source für die Firma rechnen soll.

Seltsamerweise ist das beinahe das, aber eben nicht ganz, was Microsoft als "das Open Source Problem" hinstellt und mit dem Firmen das Microsoft Shared Source-Konzept schmackhaft gemacht werden soll: 
Forks sind böse, und bei Shared Source gibt es eine offizielle Quelle, die von einem großen, finanziell nicht gefährdeten Konzern verwaltet, weiterentwickelt und qualitätskontrolliert wird.

Der alles entscheidende Unterschied besteht letztendlich darin, ob die Änderungen am öffentlichen Source hinterher allen gehören, also wirklich öffentlich sind (Open Source), oder Microsoft gehören (MS Shared Source).
Nun könnte man sich letztendlich auf den Standpunkt stellen, einer Firma, die sowieso Intellectual Property verschenkt (verschenken muss!), könnte es letztendlich egal sein, ob sie es der Allgemeinheit schenkt oder ob sie es Microsoft schenkt.

Wenn man drüber nachdenkt, erkennt man schnell, warum es nicht egal ist - Microsoft ist ja keine passive, interessenlose Einheit, sondern ein bewegliches Ziel mit einer eigenen Agenda.
