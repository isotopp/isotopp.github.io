---
author: isotopp
title: "Es funktioniert wie spezifiziert"
date: 2021-12-14T20:32:00+01:00
feature-img: assets/img/background/schloss.jpg
tags:
- lang_de
- security
aliases:
  - /2021/12/14/funktioniert-wie-spezifiziert.html
---

Dieser Artikel basiert auf
[einem Twitter-Thread](https://twitter.com/isotopp/status/1470668771962638339)
und ist in deutscher Sprache als
[Heise Kommentar](https://www.heise.de/meinung/Kommentar-zu-log4j-Es-funktioniert-wie-spezifiziert-6294476.html)
erschienen.

**Über den Java-Slogan "Write Once, Run Everywhere" wurden schon viele Witze gemacht.
Den log4j-Exploit behandeln viele nun wie einen Bug – das ist er nicht.**

Eine kritische Lücke in der Java-Bibliothek Log4j beherrscht gerade die Schlagzeilen.
Die IT-Welt ruft "Warnstufe Rot" aus – weil offenbar der log4j-Code JNDI-Variablenexpansion vornehmen kann.
Doch was ist JNDI?
Jindi al Dap ist der Name eines alten arabischen Philosophen und Mathematik-Pioniers, der für Sun/Oracle gearbeitet hat, um [ein System von Directory Lookups in Java](https://docs.oracle.com/javase/tutorial/jndi/overview/index.html) zu entwickeln.
Dieses System lädt irgendwie Code aus dem Internet nach.
Aber selbst, wenn man länger auf das Systemdiagramm starrt, erkennt man nicht unbedingt sofort, an welcher Stelle sich der Java CLASSPATH so erweitert, dass er das gesamte Internet umfasst:

![](2021/12/spezifiziert1.png)
*Systemdiagramm des JNDI Subsystems von Java, aus der [Dokumentation](https://docs.oracle.com/javase/tutorial/jndi/overview/index.html).*

## Nichts ist jemals simpel.

Das ist so, weil in Java nichts jemals simpel ist. 
Java Code ist unstrukturierter trockener Staub von Codefragmenten in Klassendateien, die inert in keiner Weise miteinander interagieren.
Erst mit den passenden Factories, Delegates, Generators und ClassLoaders werden sie instanziiert und zusammengesetzt.
Der entstehende Haufen an Querverweisen führt dann nur zufällig irgendwann einmal tatsächlich wirksamen Code aus. Man könnte jetzt auf die Idee kommen, eine IDE mit integrierter syntaktischer Codesuche zu verwenden, um diesen Quelltexthaufen in Form zu bringen und zu verstehen.
Aber das ist vergebens:
Auch mit der gesamten Codebasis und einem Index darauf kann man nicht vorhersagen, was eine gegebene Java Codebase tun wird, wenn man sie startet.

Es braucht auch noch Konfigurationsdateien.
Diese sind ein weiterer Haufen -- Properties-Dateien -- in einem vorsintflutlichen Vorläufer von YAML geschrieben: XML.
Oder jedenfalls, das ist es, was wir denken sollen:
Mit den Properties und der Codebasis können wir endlich versuchen zu verstehen, was Java tut.
Und das wäre auch beinahe so, aber JNDI ist genau angetreten, dieses Problem zu beheben:
Directory Lookups!
Statt also die Anwendung und ihre Konfiguration zu paketieren, und dann die Pakete in Produktion zu installieren, können wir nun mit JNDI die Konfiguration vom Netz lesen.
Das heißt, die eigentlichen Konfigurationsdateien, die uns sagen, was die Anwendung tut sind... nicht mehr da.
Fortschritt!

Das stellt sicher, dass uns niemand mehr hacken kann, weil niemand den Code mehr versteht: 
Wichtige, zum Verständnis der Codebasis notwendige Informationen sind versteckt in einem Verzeichnisdienst, und wir wissen nicht mal welcher.
Aber wir können das noch einen Schritt weiterspielen:
Der Code, der den Directory Lookup vornimmt, ist auch nicht da, nur ein Bootstrap: 
[Event and Service Provider Packages](https://docs.oracle.com/javase/tutorial/jndi/overview/event).

![](2021/12/spezifiziert2.png)

*Laut [Dokumentation](https://docs.oracle.com/javase/tutorial/jndi/overview/event) können wir Objekte aus der Nameing API bekommen und dort hinein serialisieren. Wir bekommen also Printer-Objekte mit Printer-Methoden aus dieser API, wenn wir danach fragen.*

Dank JDNI SPI können wir also Java Classfiles von einem LDAP-Server ausliefern lassen, die angeblich ein Printer-Object generieren, wenn wir nach einem Printer fragen -- dann aber stattdessen Doom installieren.
Oder einen Kryptominer oder Verschlüsselungstrojaner. 
So geht Enterprise Security!

## Write Once, Run Everywhere!

Der Java-Slogan ist ja "Write Once, Run Everywhere".
Wir haben da viele Witze drüber gemacht, weil Java so oft gecrashed ist -- die meisten Java-Anwendungen liefern inzwischen ja die gesamte Ausführungsumgebung einschließlich der JRE mit, damit überhaupt etwas funktioniert.
Jetzt funktioniert endlich mal alles, und die Leute sind wieder unglücklich.
Aber im Ernst: Viele behandeln den log4j-Exploit wie einen Bug, einen Programmierfehler, eine Verletzung einer Spezifikation.
Genau das ist jedoch nicht der Fall:

Es funktioniert -- wortwörtlich -- endlich einmal alles wie spezifiziert und dokumentiert:
All die Modularität und dynamische Erweiterbarkeit von Java hat ganz wunderbar und genau wie geplant zusammengearbeitet und funktioniert.
Darauf haben wir dekadenlang hingearbeitet!

## "NOTABUG, WONTFIX"

Und das ist das eigentliche Problem hier.
Viele rufen jetzt nach "Mehr Kontrolle!", "Mehr Review!", "Mehr Funding!", "Mehr Augen auf den Code!".
Was wirklich helfen würde wäre weniger Code, weniger Indirektion und Boilerplate, und einfach mehr... Einfachheit.

Wieso brauche ich ein `LogAppenderFactorySingleton`, das XML liest, um den Namen der Klasse zu bekommen, die es instanziieren muss, damit ich meine Logzeile da einwerfen kann, um sie asynchron an einen `LogStream` anzuhängen? 
Das ist nicht einfach.
Was ist einfach?
JSON nach stderr drucken.
Das ist einfach.
Aber Firmen stellen seit etwa einer Dekade Leute ein, die nicht wissen, was stdout und stderr sind und das ist irgendwie okay, weil inzwischen ja sowieso alles ein Webservices ist

![](2021/12/spezifiziert4.png)

*Ein totales log4shell Nonmention von [apenwarr](https://twitter.com/apenwarr/status/1469183890749558784).*

Softwareentwicklung ist viel moderner geworden:
Wir haben Merge Requests mit Code Review, CI/CD-Pipelines, Infrastructure as Code und Immutable Infrastructure.
Das nützt nur nix, wenn meine Java Logging Library [auf dem Mars Code von Directory-Servern auf der Erde nachlädt](https://twitter.com/TheASF/status/1400875147163279374) und so das "Remote" in RCE komplett neu definiert.
Die Analyse von Dependencies hat nur dann Sinn, wenn die Liste dieser Abhängigkeiten endlich, und genau so immutable wie die Infrastruktur ist.

Java hatte einmal die notwendigen Kontrollknöpfe, mit denen wir erzwingen konnten, dass diese Liste von Abhängigkeiten endlich und unveränderlich ist.
Wenn man auf diese Art von Lebensstil steht, gibt es etwas, das sich SM nennt: [Oracle SM](https://docs.oracle.com/javase/tutorial/essential/environment/security.htmlOracle).
SM bringt die notwendigen Verträge und die Disziplin, die eine Codebase braucht.
Aber die meisten Anwender stehen nicht auf SM, und lehnen die Idee ab.
Also wird die Funktionalität in Java 17 als deprecated (veraltet) gekennzeichnet und später entfernt werden ([JEP 411: Deprecate the Security Manager for Removal](https://openjdk.java.net/jeps/411)).

![](2021/12/spezifiziert3.jpg)

## Wie ein Dreijähriger

Auch JNDI hat SM abgelehnt und hat ein promiskuitives Interface, das Code irgendwoher lädt und ausführt.
Man muss sich das wie einen Dreijährigen vorstellen, der sich jede Klasse in den Mund steckt, um herauszufinden wie sie schmeckt und ob sie sich ausführen lässt.
Das ist am Ende genau die Spezifikation:
Hier ist ein Object, deserialisiere es.
In Java bedeutet das, dass der Code für die Klasse des Objektes irgendwo her kommen muss, deren Methoden dann ausgeführt werden.

Natürlich würde niemand das für eine gute Idee halten, wenn man es so formuliert.
Aber andererseits hat es die Person, die das vor 8 Jahren implementiert hat, nicht gesehen, und auch die Hunderttausend, die log4j in ihre Codebasis importiert haben, sind nicht darüber gestolpert.
Was sagt uns das über den Dependency-Management-Prozess von Organisationen, die Software entwickeln? 
Über das Verständnis der Codebase, der Abhängigkeiten, und der Prozesse, die Datenfluss und Releases planen?
Ja, genau.

"Wir verwenden eine modulare Architektur und agile Methoden, um die Entwicklungsgeschwindigkeit zu steigern."

**E = 1/2m\*(v^2)**

Mehr Entwicklungsgeschwindigkeit macht größere Krater.

## Code. Ist. Nicht. Dein. Freund.

Ganz besonders nicht dynamisch aus dem Internet nachgeladener Code.

Code. Ist. Nicht. Dein. Freund.

Ich weiß, es klingt komisch, wenn man Entwickler ist und den eigenen Lebensunterhalt damit bestreitet, dass man glaubt, man sei mit dem Code befreundet.

Aber so ist es.
Weniger Code ist besserer Code.
Am besten so wenig Code, dass man ihn zur Gänze und mit allen seinen Interaktionen verstehen kann.
Und auch den Code, der notwendig ist, um den eigenen Code zu betreiben.
