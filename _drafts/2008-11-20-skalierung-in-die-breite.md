---
layout: post
published: true
title: Skalierung in die Breite
author-id: isotopp
date: 2008-11-20 10:59:41 UTC
tags:
- compiler
- computer
- distributed computing
- free software
- technik
- lang_de
feature-img: assets/img/background/rijksmuseum.jpg
---
Dies ist quasi der 2. Teil zum <a href="http://blog.koehntopp.de/archives/2282-Das-MySQL-Sun-Dilemma.html">MySQL-Sun-Dilemma</a>: 

[url=http://www.theregister.co.uk/2008/11/20/many_cored_processors_and_software/]In diesem Kommentar[/url] bei El Reg sehen wir dasselbe Problem in einigen Jahren auf Intel zu kommen. Der Kommentator sieht wie ich, daß vorhandene Software in der Regel nur einen Core busy hält, oder einen Core pro Verbindung belegen kann, wenn wir über Serversoftware reden.

Ein dicker Multicore-Rechner macht vorhandene Software also nicht schneller. Er sorgt nur dafür, daß die Maschine bei mehr Last (mehr Verbindungen) nicht langsamer wird, so denn der Rest der Infrastruktur, also etwa Platten, Netz und Speicherbus, mithalten können.


Für den Kommentator besteht die Lösung des Dilemmas (viele Cores, aber Software ist nicht parallel genug) in mehr und besseren Hypervisors, mit denen man bisher getrennt laufende Maschinen auf einem Multicore-Rechner durch Virtualisierung zusammenziehen kann.

Doch das ist nur eine Interims-Lösung mit der man immerhin ein wenig Nutzen aus solchen Maschinen ziehen kann, während sich grundsätzlich an dem Problem nichts ändert: Wir haben Software, die für schnellere CPUs optimiert ist, aber wir brauchen Software, die für breitere CPUs optimiert ist.

Doch in der aktuellen Programmierinfrastruktur fehlt es uns an allem. Programmierer sind zur Zeit nicht gewohnt, Arbeit auf viele Kontrollflüsse aufzuteilen, und wenn sie es tun, tun sie es oftmals auf die falsche Weise. Wir haben kaum Werkzeuge, die solche Aufteilung erleichtern, und es fehlt an Methoden des Debuggings für solche Systeme. Probleme in solchen Systemen entstehen oft durch Wartezeiten und sich zuziehende Locks, aber wir haben nur unzureichende Methoden, solche Probleme zu messen, zu visualisieren und zu analysieren. Und zu guter Letzt ist die aktuelle Generation von Entwicklern nicht gut ausgebildet, um in solchen Umfeldern effektiv tätig zu werden.

Wenn man sich eine typische Webanwendung heute ansieht, dann stellt man fest, daß sie kaum in der Lage ist mehr als eine CPU zur Zeit beschäftigt zu halten. In einem System mit zwei Ebenen hat man Web-Frontends, die Anfragen entgegen nehmen und Code im Webserver oder als Coprozeß zum Webserver ausführen. Der Browser des Anwenders ist in dieser Zeit meistens Idle, der Kontrollfluß ist also über das Netz zum Server übergegangen und der Browser wartet.

Die Webanwendung wird zur Generierung der Webseite nun meistens einen externen Cache wie einen memcached oder einen externen Datenbankserver befragen. Auch hier erfolgt die Anfrage in der Regel synchron und 1:1, sodaß die Webanwendung wartet während die CPU des memcached oder des Datenbankservers tätig wird. Wieder ist nur eine CPU zur Zeit mit der Bearbeitung der Anfrage beschäftigt, während der Browser und die Webanwendung warten.

Natürlich hilft Multitasking hier ein wenig: Während der Browser wartet kann der Desktop des Anwenders andere Anwendungen abarbeiten und während das Webfrontend auf die Antwort der Datenbank wartet können andere Requests abgearbeitet werden. Letztendlich ist es aber nicht möglich, die Abarbeitung einer einzelnen Anfrage dadurch zu beschleunigen, daß man Systeme mit mehr Cores einsetzt.

Das Problem besteht, wie sich schon andeutet, in der zu engen Kopplung und zu engen Synchronisation der Programmschritte, die notwendig sind, um eine Aufgabe abzuarbeiten. Wir schreiben unsere Programme als lineare Abfolge von Einzelschritten, aber wir müssen lernen, unsere Algorithmen wie in der <a href="http://de.wikipedia.org/wiki/Netzplantechnik">Netzplantechnik</a> zu notieren: Als Einheiten sinnvoller Größe, die als Block notiert werden und bei dem zu jedem Block die Vor- und Nachbedingungen, also die notwendigen Synchronisationen mit anderen Schritten notiert werden.

Diese Blöcke könnten dann von einem Scheduler unter Berücksichtigung der vorhandenen Hardware und unter Berücksichtigung der externen Parallelität durch konkurrente Anfragen breiter oder schmaler scheduled werden: Auf einem System mit 2 Cores ist es nicht sehr sinnvoll, mehr als z.B. 4 Blöcke parallel abzuarbeiten, auf einem System mit 256 Cores kann man aber unter Umständen eine Parallelität von z.B. 512 schedulen (Meiner Erfahrung nach ist es sinnvoll, die Anzahl der vorhandenen Cores um ca. den Faktor 2 zu überbuchen, damit auch bei I/O-Wait noch genug CPU-Verbrauch auftritt).

Auf einem System, auf dem man alleine ist, kann der Scheduler eine einzelne Anfrage auf die volle Breite der Hardware breit ziehen (also 4 oder 512 aus den Beispielen oben). Auf einem System, auf dem jedoch n konkurrente Requests unterschiedlicher Anwender eingehen sollte man jedem Anwender 1/n-tel der vorhandenen Kapazität zuteilen und die einzelnen Requests nicht auf das ganze System breit ziehen.

Und schließlich ergibt sich aus den Abhängigkeiten des Netzplanes und Ausführungszeiten im System eine maximale Breite, die sich daraus ergibt, wie sich die Abhängigkeiten der Blöcke untereinander verzahnen, und die einschränkt wie viele Cores denn das System für diesen Code beschäftigt halten kann. Es ist Aufgabe des Entwicklers, die Problemlösung so zu formulieren, daß die Abhängigkeiten hier eine maximale Parallelisierung erlauben.

An keiner Stelle hier setze ich eine bestimmte Ausfürungsstruktur voraus - ein solches System läßt sich mit Threads innerhalb eines Prozesses aufsetzen oder mit Prozessen, die über einen IPC-Mechanismus miteinander kommunizieren. Der Unterschied ist im Grunde, daß die Kommunikation von Threads innerhalb eines Prozesse wahrscheinlich weniger Latenz hat als die Kommunikation von Prozessen über IPC oder gar von Prozessen über ein Netzwerk. Auf der anderen Seite ist ein Multithread-System auf eine einzige Schachtel eingeschränkt, während ein System von Prozessen mit Netzwerk-Kommunikation nicht mit auf einer Schachtel mit 256 Threads laufen könnte, sondern auch auf 32 Schachteln mit je 8 Threads und einem schnellen Netz dazwischen.

Technisch möglich sein sollte beides. Es ist also wünschenswert, daß wir unseren Code so notieren können, daß man dort die konkrete Implementierung von Ausführung und Kommunikation der einzelnen Kontrollflüsse nicht auf einen bestimmten Mechanismus festlegt: Ich will einmal Code schreiben, und der sollte dann auf einer 5440 als ein Prozeß mit LWPs scheduled werden können oder auf einem Netz von 16 16-Core Maschinen mit irgendeinem Low Latency Interconnect. Idealerweise ohne daß ich den Source noch mal irgendwo durch filtrieren muß um das alles zur Ausführung zu bringen.

Ein solches Toolkit sollte Werkzeuge zur Visualisierung mitbringen: Ich will meinen Code und meine Threads als eine Serie von Blasen in einem Netzplan sehen können, und die Abhängigkeiten zwischen den einzelnen Abschnitten erkennen können.

Und ich will das alles sinnvoll messen und simulieren können: Bei einen angenommenen externen n von 200 und der vorhandenen Codestruktur mit einer internen Parallellität von 4 im kritischen Abschnitt, werden sich meine Locks zuziehen oder kann ich das realistischer Weise annehmen, daß der Mist auch unter dieser Last sinnvoll skaliert? Wenn nein, wo und warum wird es explodieren?

Das alles gibt es derzeit so nicht. Oder wenn es das gibt, ist es  nicht gut integriert und nicht sehr bekannt. Und bevor dieses Problem nicht gelöst ist <em>und</em> wir der aktuellen Generation von Programmierern beigebracht haben, damit routinemäßig zu arbeiten werden wir das Multicore-Problem nicht gelöst haben.

Darum, liebe mitlesende Sun-Gemeinde, könnt Ihr Euch auch gerne super engineerte proprietäre Lösungen aus dem Leib schneidern: Bevor das nicht Allgemeingut ist, also als Open Source Lösung auf dem Level "PHP" überall verfügbar ist und 15-jährige Schulkinder so was in ihrem Webhostingpaketen verwenden, so lange werdet Ihr nicht genug Software in der Welt finden um Eure Mehrkernkisten unter Dampf zu setzen. Denn wir brauchen Breite nicht nur im Code, um mit diesen Maschinen fertig zu werden, sondern wir brauchen Breite auch in der Entwicklung. Und der Laden, der diese Breite in der Entwicklung 0wned, dem gehört die Ideenwelt der nächsten Generation Entwickler.
