---
layout: post
published: true
title: Testing in Production
author-id: isotopp
date: 2011-12-02 18:55:45 UTC
tags:
- computer
- development
- software
- testing
- lang_de
feature-img: assets/img/background/baellebad.jpg
---
Mitte November ist auf The Testing Planet ein Artikel von Seth Eliot
(Microsoft) erschienen mit dem Titel
[Testing in Production](http://www.thetestingplanet.com/2011/11/the-future-of-software-testing-part-one-testing-in-production/).
Eliot schreibt über Software Services, also Dienste, die auf einer Website
laufen, sodaß die User keine Anwendungen installieren müssen (Wir erinnern
uns: Microsoft ist noch immer ganz groß darin, Software auf physikalischen
read-only Medien an Benutzer zu verschicken, auch wenn diese Software seit
einer Dekade kaum mehr als ein Loader für Updates über das Internet ist und
nach der Installation vom Medium erst einmal alle eben installierten Dateien
durch das heruntergeladene Update durch neuere Versionen ersetzt werden).

In Software Services hat der Anbieter jedenfalls die Kontrolle darüber,
welche Version der Software welchem Kunden präsentiert wird, und er hat in
der Regel Zugriff und Meßmöglichkeiten im Data Center, auf dem die Software
läuft, kann also auf der Serverseite diagnostizieren, was wann wie und warum
schief geht.

Eliot behauptet nun, daß User seltsamer sind als Tester sich vorstellen
können und man daher besser so früh als möglich mit echten Benutzern testet
(Testing in Production = TIP).  Vorhergehende synthetische Tests (Up Front
Testing = UFT) können gemacht werden, sollten aber nur so weit gemacht
werden, daß man sicher in der Produktion testen kann.

Eliot weiter: 

> For some TiP methodologies we can reduce risk by reducing the exposure of
> the new code under test.  This technique is called “Exposure Control” and
> limits risk by limiting the user base potentially impacted by the new
> code.

Was er damit meint, wird weiter unten klar, wenn er erläutert, welche Klassen von TIP er unterscheidet.

- _Ramped Deployment_
  - Der zu testende Code wird ausgerollt, ist aber zunächst nicht aktiv.  Er
    wird für einen Subset der Benutzer aktiviert und überwacht.  Dabei
    können unterschiedliche Aspekte des Codes untersucht werden - wie er
    sich auf die Geschäftsprozesse auswirkt, ob er technisch funktioniert
    oder wie er skaliert etwa.  Benutzer können automatisch oder
    handselektiert sein, und wissen entweder, daß die mit experimentellem
    Code arbeiten oder nicht.

    Entscheidend ist, daß das Deployment von neuem Code und seine
    Aktivierung voneinander getrennt werden.  Dies erlaubt es, Features
    graduell einzuführen und schnell zu deaktivieren, wenn sich Probleme
    entwickeln.

- _Controlled Test Flight_
  - ein a/b-Experiment, in der alte und der neue Code parallel für
    unterschiedliche Benutzer aktiviert wird und die Benutzer nicht wissen,
    in welcher Kategorie sie sich befinden.  Eine Unterkategorie von Ramped
    Deployment.
- _Experimentation for Design_
  - eine weitere Verfeinerung von Controlled Test Flight ist, die neue und
    die alte User Experience parallel für unterschiedliche, repräsentative
    Benutzergruppen zu aktivieren, um den Einfluß der neuen UX auf das
    Geschäftsmodell zu prüfen.
- _Dogfood/Beta_
  - wissen die Benutzer um die Tatsache, daß sie neuen Code testen, handelt
    es sich nicht um Experimentation, sondern um eine Beta.  Sind die
    Benutzer Mitarbeiter oder Freunde der Firma, handelt es sich um
    Dogfooding.  Hier ist es oft zulässig, mit dem Wissen und Einverständnis
    der Benutzer zusätzliche Telemetrie zu installieren und auszuwerten.
- _Synthetic Test in Production_
  - das Anwenden von automatisierten UFT-Systemen auf Produktionssysteme. 
    Sie können verwenden werden, um das Produktionssystem oder sein
    Monitoring zu validieren.
- _Load/Capacity Test in Production_
  - Last und Kapazitätstest in der Produktion, bei Eliot unter Verwendung
    synthetischer Last gegen Produktionssysteme, meistens zusätzlich zur
    existierenden Last durch reale Benutzer, um die Kapazität des Systems zu
    bestimmen.
    <br/><br/>
    Die mir bekannten Anwender solcher Verfahren spielen stattdessen eher
    mit den Gewichten an ihren Load Balancern, um die externe Last durch
    reale User auf weniger und weniger Backends zu konzentrieren.
    <br/><br/>

    Synthetische Last wird dabei lediglich als Meßsonde verwendet, um die Latenz
    von Requests zu überwachen - kommt zur typischen Think Time des Benchmarks
    eine Wait Time hinzu, ist die den getesteten Frontends angebotene Load
    größer als ihre Kapazität und es baut sich eine Queue auf.  Lastsättigung
    ist erreicht und die Kapazität des Gesamtsystems kann durch einfache
    Dreisätze bestimmt werden.  Bricht man den Test hier ab, ist die UX für die
    realen User nicht destruktiv beeinflußt: Das System mag einigen Benutzern
    für kurze Zeit langsam erscheinen, ist aber zu allen Zeiten normal
    Funktionsfähig.
    <br/><br/>

    Bricht man den Test nicht ab, sondern erhöht die Last vorsichtig weiter,
    kann man den Failure Mode des Systems verifizieren: Art und Lage der
    begrenzenden Ressource im Gesamtsystem wird offensichtlich, Qualität des
    Monitorings und Prozesse im Operating werden mitgeprüft.  Diese Phase des
    Tests erfordert schnelle Reaktion, um den Einfluß auf die UX der realen
    Benutzer zu minimieren.
- _Outside-in load /performance testing_
  - ein Lasttest mit synthetischer Load, die von einer externen Quelle in
    die Produktionsumgebung injeziert wird, also denselben Weg nach drinnen
    nimmt wie die realen Benutzer.
- _User Scenario Execution_
  - Ausführung von Endbenutzer-Szenarien gegen ein Produktionssystem von den
    Endpunkten echter Benutzer.  Kann manuelles Testen beinhalten.  Diese
    Tests können regional unterschiedliche UX sichtbar machen ("Das System
    ist schnell genug in Europa, von Asien aus aber kaum benutzbar.")
- _Data Mining_
  - Die Logdaten echter Benutzer werden nach Problemen oder Testfällen
    durchsucht, die spezifische Szenarien darstellen.  Die Fälle, die
    auftreten, werden automatisch als Bugtickets eingetragen.  Das kann in
    Echtzeit passieren.  <br/><br/>

    Echtzeitmonitoring kann auf viele verschiedene Weisen nützlich sein. 
    Insbesondere in den o.a.  Lasttests ist ein Echtzeit-Errormonitor
    notwendig, um die Saturierung von der Überlast des Systems trennen zu
    können, und um Lage und Failure Mode der überlasteten Komponente im
    Produktionsweg schnell erkennen zu können.  Ohne ein solches
    Echtzeitmonitoring ist diese Art von Test nicht sicher durchführbar.
- _Destructive Testing_
  - Injektion von Fehlern in Produktionssysteme, um Servicekontinuität im
    Fehlerfall zu validieren (
    [Chaos Monkey](http://www.codinghorror.com/blog/2011/04/working-with-the-chaos-monkey.html)
    ).
- _Production Validation_
  - Echtzeitmonitore, die die verschiedenen Phasen der Produktion auf
    Businessebene, Contentebene, Technischer Ebene, Netzwerkebene und so
    weiter überwachen und visualisieren.

Eliot bringt dann verschiedene Beispiel für TIP: Googles und Bings
a/b-Experimente und 1% Launches werden genannt, sie sind Beispiele für
Experimentation for Design.  Controlled Test Flights werden dort ebenfalls
verwendet, dabei werden kritische Änderungen ausgerollt und parallel zu
getestetem Code betrieben - oft werden dabei Daten zweimal geschrieben: Der
alte Code führt das alte System weiter, der neue Code arbeitet im neuen
System mit anderen Dateien oder Datenbanktabellen.

Chaosmonkey war der Vorläufer eines Systems für Destructive Testing, das
jetzt die 
[Simian Army](http://techblog.netflix.com/2011/07/netflix-simian-army.html)
darstellt: Neben Chaos Monkey, der Komponenten zufällig aus dem System
entfernt gibt es nun Latency Monkey, der Dienste zufällig verzögert,
Conformity Monkey, der Systeme aus dem Dienst kippt, die nicht auf dem
erwarteten Stand sind und viele andere Dienstprüfer und Killer mehr.

Eliot weist darauf hin, daß Tests in der Produktion gefährlich sein können
und sie deswegen so aufgebaut werden müssen, daß sie keine Produktionsdaten
verändern können und nur mit funktionierendem und schnellem Monitoring
durchgeführt werden können.

Korrekt ausgeführt eröffnen sie aber eine Menge Lernmöglichkeiten, die
traditionellem Testen nicht zur Verfügung stehen.
