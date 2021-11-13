---
author-id: isotopp
date: "1992-03-17T09:00:00Z"
feature-img: assets/img/background/rijksmuseum.jpg
tags:
- publication
- computer
- lang_de
title: "Betriebssysteme"
---

**Abgeschickt an die c't am 17. März 1992.**

Aus technischen Gründen stehen die Abbildungen zu diesem Artikel nicht im Web zur Verfügung. 

- [Text des Artikels](#betrübssysteme)
- [Glossar](#glossar)

# Betrübssysteme

#### Jeder hat eines, angeblich kennt sich kaum einer wirklich damit aus und natürlich ist meines besser als Deines. Die Rede ist von Betriebssystemen.

Das Betriebssystem ist das Grundprogramm eines Rechners. 
Es wird beim Einschalten des Rechners gestartet und erst beim Abschalten wieder beendet.
Entsprechend seiner Funktion als Zwischenstück zwischen der realen Welt der konkreten Hardware und der abstrakten Welt der Algorithmen ist seine Aufgabe eine doppelte: 
Für alle Benutzer eines Rechners teilt es die Rechenleistung, den Speicher und die Geräte der Maschine fair zwischen ihnen auf. 
Es verhindert, so ist zumindest die Theorie, ungewollte Beeinflussung der verschiedenen Programme auf einem Rechner untereinander.
Für ein einzelnes Programm ist das Betriebssystem mehr wie eine große Befehlsbibliothek, die die doch recht sparsame Maschinensprache eines Rechners um so wirksame Funktionen wie "mehr Speicher zur Verfügung stellen", "Satz aus einer Datei lesen" oder gar "diesen Bildschirmaufbau präsentieren und Ergebnis der Benutzeraktion hier abliefern" erweitert. 

## Mit gespaltener Zunge

Diese doppelte Aufgabenstruktur des Aufteilens und Multiplexens von knappen Betriebsmitteln auf der einen Seite und des Verbergens von lästigen Details aus der realen Welt vor den Anwendungen auf
der anderen Seite bestimmt die Struktur eines Betriebssystems. 
Die Betriebsmittel, die ein Betriebssystem verwaltet, lassen sich grob in drei Gruppen unterteilen: 

1. Zum ersten ist da - aus der Hardwaresicht - der Prozessor.
 Er ist die einzig aktive Komponente des Systems und zudem in den meisten Fällen leider nur einmal vorhanden. 
 Aus der abstrakteren Sicht der Software erscheint er als Thread ("Kontrollfluß") eines Programmes.
 Ein gutes Betriebssystem wird die kostbare - weil seltene - Prozessorhardware multiplexen, um mehr als einen Kontrollfluß zur Zeit ablaufen zu lassen.
2. Zum zweiten gibt es den Arbeitsspeicher. 
 Damit der Prozess ablaufen kann, müssen er selbst und seine Daten irgendwo gespeichert werden.
 Realer Speicher in Form von RAM hat irgendwelche Adressen und ist nicht notwendigerweise mit den von der Anwendung benötigten Eigenschaften ("an einem Stück", "an einer bestimmten Stelle") vorhanden.  
 Es ist Aufgabe des Betriebssystems, mit Unterstützung einer MMU diese Anforderungen zu erfüllen.
 Andererseits muß aber verhindert werden, daß ein Prozess mehr als den ihm zugesicherten Speicher benutzt und dadurch eventuell andere Prozesse in ihrem Ablauf stört.
 Das Betriebssystem muß die images ("Laufzeitbilder") verschiedener Programme verwalten. 
3. Und zum dritten sind auch noch Ein/Ausgabegeräte verschiedenster Art zu verwalten.
 Einige dieser Geräte, zum Beispiel Drucker oder Bandlaufwerke, sind nur von einem Prozess zur Zeit nutzbar.
 In diesem Fall muß das Betriebssystem den Zugriff auf diese Geräte zuteilen - etwa über einen Druckerspooler oder durch Locks.
 Andere Geräte, Festplatten beispielsweise, können aufgeteilt werden.
 Hier muß das Betriebssystem einen entsprechenden Dienst zur Verfügung stellen - im Beispiel wäre dies ein Dateisystem.

Ein Betriebssystem stellt dem Anwendungsprogramm, wie bereits festgestellt, verschiedene Dienste zur Verfügung.
Allerdings gibt es verschiedene Konzepte bei den Betriebssystem-Herstellern, wie diese Dienste in Anspruch zu nehmen sind. 

## Message passing

Ältere Betriebssysteme wie MS-DOS, aber auch UNIX und OS/2, stellen Dienste des Systems per Prozeduraufruf zur Verfügung.
Ob der Funktionsaufruf dabei durch einen Unterprogrammaufruf wie bei OS/2 oder durch einen Software-Interrupt wie bei MS-DOS und UNIX erfolgt, ist dabei zunächst nebensächlich.
Wesentlich ist, daß der Kontrollfluß des Prozesses auf das Betriebssystem über geht.
Diese Art des Dienstaufrufes hat aber einige Eigenschaften, die auf den ersten Blick als selbstverständlich, auf den zweiten Blick aber eher als unerwünscht gelten können: 

- Ein solcher Unterprogrammaufruf ist immer synchron: 
 Das eigene Programm wartet solange, bis der Betriebssystemaufruf beendet ist.
 Bei einigen Systemaufrufen, die mit Ein-/Ausgabefunktionen zu tun haben, könnte es aber vorteilhaft sein, daß das eigene Programm zwar den Wunsch nach bestimmten Daten absetzt, aber dann
erst einmal selbst weiterläuft und später nachsieht, ob die Daten denn jetzt zur Verfügung stehen.
- Durch einen Unterprogrammaufruf wird außerdem stillschweigend vorausgesetzt, daß das Betriebssystem den Dienst auf derselben CPU wie die Anwendung erbringt. 
 Eine Funktion "Fourieranalyse der Daten in diesem Puffer" unter Benutzung der wesentlich schnelleren Hardware eines Signalprozessors ist auf diese Weise nicht mit Unterstützung des Betriebssystems möglich - der Anwendungsprogrammierer muß das selbst hinbasteln.
- Wenn der Dienstaufruf dann auch noch durch einen gewöhnlichen Unterprogrammaufruf geschieht, ist es einer Anwendung möglich, außer den definierten Betriebssystemfunktionen auch noch andere, nicht dokumentierte Funktionen aufzurufen, in dem nicht zugelassene Sprungadressen
benutzt werden.
 Es soll sogar Systeme geben, auf denen dies die gängige Praxis ist.
 Der Systemsicherheit und der späteren Erweiterbarkeit ist eine so etwas natürlich nicht
dienlich.

Moderne Betriebssystemarchitekturen, allen voran Mach auf dem NeXT, aber auch Tanenbaums Amoeba oder Plan9 von AT&T, sind deswegen nach dem Client-Server Modell aufgebaut:
Die Dienste des Systems stehen dabei an Serverprozessen zur Verfügung.
Der Aufrufer sendet dem Server eine Nachricht (request-message), die von diesem ausgewertet wird.
Das Resultat wird dem Absender in einer Antwortnachricht (reply-message) zugestellt. 

Der Server ist dabei kein Teil des Betriebssystems selbst, sondern ein normaler Prozess, der möglicherweise einige zusätzliche Privilegien gegenüber gewöhnlichen Anwendungen hat.
Dazu gehört etwa die Zugriffsmöglichkeit auf einige Hardwareregister. 
Das eigentliche Betriebssystem ist dann auf die allerwesentlichsten Funktionen reduziert: 
Es verwaltet lediglich die Umschaltung zwischen den verschiedenen Prozessen, den lokalen Speicher des Systems und natürlich den Versand der Messages.
Alle anderen Dienste werden durch leicht austauschbare Serverprozesse realisiert.

Dieses Modell des Dienstaufrufes hat nicht die Nachteile des Unterprogrammaufrufes: 
Die Dienstleistungen des Systems können asynchron in Anspruch genommen werden, indem die Anwendung beispielsweise eine Nachricht mit einem Lesekommando an den Fileserver sendet, dann aber weiterarbeitet.
Später, wenn die Daten benötigt werden, sieht die Anwendung nach, ob die Antwort des Servers schon vorliegt.
Wenn ja, kann ohne Pause weitergearbeitet werden, ansonsten muß die Anwendung (wie beim Dienstaufruf durch Sprung in ein Unterprogramm auch) warten.

Für die Anwendung ist es egal, ob der angeforderte Dienst lokal auf der eigenen CPU vorhanden ist oder ob ein Server über ein Netz auf einem anderen Rechner läuft. 
Die Netzadresse mag sich ändern, aber der Aufrufmechanismus bleibt derselbe.
Unterschiedliche Datenformate, Maschinensprachen oder Aufrufkonventionen werden durch den Message-Mechanismus verborgen.

Auch kann das Verhalten den Servers, der ja von seinem Client vollständig getrennt ist, genau durch seine Reaktion auf die verschiedenen Kommandonachrichten beschrieben werden. 
Für den Client ist der Server auf jeden Fall eine Black Box.
Unsaubere Gemeinheiten wie das heimliche Auslesen von undokumentierten Variablen oder der Sprung in interne Funktionen, die eine Anwendung eigentlich nicht kennen geschweige denn aufrufen sollte, sind nicht mehr machbar, denn der Server läuft in einem vom Client vollständig getrennten Adreßraum oder sogar auf einer ganz anderen Maschine in einem Netz.

## Rechenleistung verteilen

Wie oben erwähnt gibt es Systemzustände, in denen der Rechner ein Programm nicht fortsetzen kann, weil es auf irgendwelche Ereignisse (das Eintreffen von Daten von einem Gerät, das Erreichen einer bestimmten Zeit etc.) wartet.
Offenbar reicht ein einzelnes Programm nicht aus, einen Prozessor durchgehend zu beschäftigen. 
Bei genauerer Untersuchung stellt sich sogar heraus, daß die meisten Programme mehr als 90 % ihrer realen Laufzeit in derartigen Wartezuständen zubringen. 

Aus dieser Beobachtung heraus ist das Konzept des Multitasking geboren worden.
In regelmäßigen Zeitabständen wird das laufende Programm unterbrochen, sein augenblicklicher Zustand wird eingefroren.
Der Scheduler des Betriebssystems wählt dann einen anderen Prozess aus, dessen Zustand aufgetaut wird und der dann für die Dauer der nächsten Zeitscheibe zum Ablauf kommt.
Ein Scheduler, der mit Zeitscheiben arbeitet, heißt "preemptive".

Viele Betriebssysteme, die nachträglich auf Multitasking nachgerüstet worden sind, haben keinen solchen Scheduler, sondern sind darauf angewiesen daß ein Task den Prozessor freiwillig hergibt.
Das kann ausdrücklich durch den Aufruf einer `schedule()`-Funktion in regelmäßigen Abständen geschehen oder versteckt, indem man im Betriebssystem am Ende jeder Systemfunktion einen Aufruf des Schedulers vor dem Verlassen des Betriebssystems einsetzt.
Eine solche Form von Multitasking nennt man "kooperativ" oder "non-preemptive".
Bei einem System mit kooperativem Multitasking kann die Umschaltung für den Benutzer aber leicht schwerfällig wirken, wenn rechenintensive Anwendungen laufen, die selten Systemaufrufe tätigen.

Einer der schwersten Fehler, den ein Programmierer auf einem Rechner mit Multitasking-Betriebssystem machen kann, ist es, in einer aktiven Warteschleife auf das Eintreffen eines Ereignisses zu warten ("busy waiting").
Die Effektivität von Multitasking beruht ja gerade darauf, daß Prozesse, die gerade keine echte Arbeit zu tun haben, stillgelegt werden und vom Betriebssystem erst dann wieder Rechenzeit zugeteilt bekommen, wenn sie etwas damit anfangen können.

Deswegen ist es fast unmöglich, ein Betriebssystem wie beispielsweise MS-DOS nachträglich multitaskingfähig zu machen oder in einer Multitaskingumgebung (z.B. eine DOS-Box in UNIX oder OS/2) zu betreiben.
Nahezu jedes Programm, angefangen vom Kommandointerpreter der Shell, "verbrät" die ihm zugeteilte Rechenzeit vollständig in Zeicheneinleseroutinen und anderen engen Warteschleifen, anstatt diese anderen Programmen zur Verfügung zu stellen. 
MS-DOS Prozesse sind gewissermaßen immer im Zustand "ready". 
Wenn man einem solchen System nachträglich eine Multitaskingerweiterung überstülpt, fehlt diesem System notgedrungen der Zustand "sleeping", und jeder laufende Prozess erhält genau 1/ntel der Gesamtleistung der CPU - selbst dann, wenn er eigentlich gar nichts damit anfangen könnte.

Nach welcher Strategie die `schedule()`-Funktion letztendlich bestimmt, welcher Prozess aus der "ready"-Queue in den Zustand "running" gehen darf und damit auf die CPU gelangen kann, hängt stark von den gewünschten Eigenschaften des Systems ab.
Der einfachste Zuteilungsalgorithmus ist das "round-robin"-Verfahren.
Dabei wird die zur Verfügung stehende CPU-Zeit gleichmäßig zwischen allen Prozessen aufgeteilt, die sich darum bewerben. 
Alle diese Prozesse kommen reihum auf die CPU - daher der Name.

Oft wird dieses Verfahren noch so erweitert, daß man Prozesse unterschiedlicher Priorität unterscheidet. 
Der Scheduler von AmigaOS, aber auch der von VAX/VMS, ist ein Round-Robin Scheduler mit Prioritäten.
Das bedeutet: Der Ringtausch der Prozesse auf der CPU funktioniert innerhalb der höchsten vorhandenen Prioritätsebene. 
Erst wenn alle Prozesse einer höheren Prioritätsebene aus der Ready-Queue entfernt sind, etwa weil sie terminiert sind oder weil sie auf ein Ereignis warten und deswegen stillgelegt sind, kommen
Prozesse mit niederen Prioritäten auf die CPU.

Andererseits kann ein CPU-intensiver Prozess mit einer hohen Priorität den Rest des Systems recht schwerfällig machen oder gar blockieren.
Gelegentlich (bei Echtzeitanwendungen zum Beispiel) ist dieser Effekt erwünscht:
Man geht davon aus, daß ein Prozess mit einer hohen Priorität die Rechenzeit, die er beansprucht, auch unbedingt und gerade zu diesem Zeitpunkt benötigt.
Im allgemeinen Fall allerdings möchte man eine Lösung haben, die auch dann noch eine gewisse
Fairness gewährleistet, wenn ein Programm böswillig Rechenzeit schluckt.
In UNIX zum Beispiel sind die Prioritäten von Prozessen nicht fest, sondern hängen davon ab, wie lange der Prozess schon in der Warteschlange steht und wie CPU-intensiv er ist.

Prozesse, die frühzeitig die CPU verlassen (etwa weil sie viel I/O machen und deswegen häufig im Zustand "sleeping" sind) bekommen ihre Restzeit als Bonus für die nächste Zeitscheibe gutgeschrieben, der in die Berechnung der Priorität eingeht.
Dadurch bekommen solche Prozesse automatisch eine bessere Priorität als solche, die die Zeitscheiben immer voll ausnutzen.

Prozesse, die lange in der Ready-Queue gestanden haben (weil sie eine schlechte Priorität haben), werden temporär aufgewertet, damit sie auch eine Chance haben, einmal zum Ablauf zu kommen (priority aging).

## Synchronisation

Eines der zentralen Probleme in einem System, in dem mehr als ein Programm zur Zeit aktiv sein kann, ist die Synchronisation von Prozessen bzw. der gegenseitige Ausschluß von Prozessen, die auf einen gemeinsamen Datenbereich zugreifen. 
Gemeinhin löst man in der Information ein solches Problem mit Semaphoren: 
Man definiert sich ein Flag, das anzeigt, ob ein Datenbereich zur Zeit "frei" oder "in Bearbeitung" ist, und zwei Operationen zum Setzen bzw. Löschen dieses Flags.
Der Punkt ist, daß diese Operationen atomar sein müssen, das heißt, die Semaphor-Setzfunktion und die Löschfunktion dürfen auf keinen Fall unterbrochen werden. 

Auf Rechnern mit nur einem Prozessor läßt sich dieses Problem recht leicht dadurch lösen, daß man in diesen beiden Funktionen kurze Zeit sämtliche Unterbrechungen verbietet und die gewünschte Operation durchführt. 
Auf Mehrprozessorsystemen nützt dies natürlich nichts mehr, denn während der eine Prozessor den Semaphor bearbeitet, kann ein anderes Programm auf einem anderen Prozessor dasselbe tun. 
Hier ist das Betriebssystem auf die Unterstützung der Hardware angewiesen, die nicht unterbrechbare Semaphor-Operationen schon als Prozessorbefehl anbieten muß.
Prozessoren wie der 680x0 und der 80x86 haben solche Operationen bereits eingebaut: 
Der TAS-Befehl des 680x0 führt zum Beispiel eine solche Semaphor-Operation in einem nicht unterbrechbaren Read-Modify-Write-Zyklus aus, und der 80x86 kennt das LOCK-Prefix für eine ganze Reihe von Befehlen, die dann ebenfalls nicht unterbrechbar werden.

## Speicher auf Kredit

Eine andere nützliche Sache, die einen sicheren Multitasking-Betrieb unterstützt, ist in den neueren
Prozessoren der verschiedenen Hersteller ebenfalls gleich mit eingebaut:
Alle diese Geräte haben eine PMMU, das bedeutet, sie sind in der Lage, physikalisch vorhandenes RAM an jeder beliebigen Stelle des Adreßraumes der CPU einzublenden und die Speicherzugriffe eines jeden Programmes genau zu kontrollieren.

Auf diese Weise läßt sich ein Prozess in seinem eigenen Speicher einzäunen.
Zwar erlaubt man ihm, auf den eigenen vom System angeforderten Speicher zuzugreifen, doch sobald versucht wird, auf andere, nicht erlaubte Speicherbereiche zuzugreifen, wird der Prozess unterbrochen und das Betriebssystem übernimmt die Kontrolle ("memory protection", "Speicherschutz").
Es kann den problematischen Prozess stillegen und ein Image seines Zustandes zur späteren Fehlersuche auf Platte ablegen.
Auf diese Weise verhindert man zwar nicht, daß ein fehlerhaftes Programm abstürzt, aber immerhin wird sichergestellt, daß keine anderen Programme in Mitleidenschaft gezogen werden.

Die MMU-Hardware kann man auch dazu benutzen, dem Programm mehr RAM vorzuspiegeln, als tatsächlich in der verwendeten Maschine vorhanden ist ("virtual memory"). 
Die meisten Programme brauchen nicht alle ihre Daten und ihren gesamten Code zur gleichen Zeit, sondern sind oft nur in einem kleinen, eng begrenzten Speicherbereich (dem "working set") aktiv.
Je nach Benutzung des Programmes verschiebt sich dieser Bereich von Zeit zu Zeit, aber im Prinzip würde ein kleiner Speicherbereich ausreichen, um das ganze Programm ablaufen zu lassen.

Betriebssysteme wie UNIX unterteilen deswegen den gesamten Speicher der Maschine in Seiten fester Größe - bei einer 80386 CPU zum Beispiel werden durch die Hardware Pages von 4 KB Größe vorgegeben.
Nicht alle Speicherseiten eines Prozesses sind gleichzeitig im RAM, sondern Teile davon befinden sich in der "paging area", einem abgeteilten Bereich einer Festplatte. 
Wenn ein Prozess versucht, eine Speicherseite anzusprechen, die gerade nicht präsent ist, generiert die MMU wieder eine Unterbrechung ("page fault") und läßt das Betriebssystem zum Zuge kommen.
Dieses sucht jetzt eine andere Speicherseite, die möglichst lange nicht benutzt worden ist, speichert diese in der Paging Area zwischen, adressiert sie um und stellt sie dann dem unterbrochenen Prozess an der richtigen Adresse und mit dem richtigen Inhalt, der inzwischen von der Platte geladen wurde, zur Verfügung. 
Dieser wird nach der kurzen Unterbrechung dann fortgesetzt.

Wenn genug Speicher vorhanden ist, um die aktiven Teile der verschiedenen lauffähigen Prozesse gleichzeitig im Speicher zu halten, fallen die kurzen Unterbrechungen beim Paging nicht weiter  ins Gewicht.
Wenn der Rechner jedoch überlastet wird und für die Anzahl der gleichzeitig laufenden Prozesse zu wenig Speicher hat, fängt er an, auch Teile von Prozessen auf Platte auszulagern, die gleich wieder geladen werden müssen.
Die Rechenleistung der Maschine fällt plötzlich um einige Zehnerpotenzen, und die Antwortzeiten auf ein simples Return an der Console liegen auf einmal im Minutenbereich.
Man bezeichnet diesen Vorgang als "treshing" (dreschen), und die Abhilfe bei diesem Problem ist simpel: Man lege einige Megabytes RAM nach.

## Konsequent weiter gedacht

Wenn ein neuer Prozess gestartet wird, muß er zunächst einmal in den Speicher geladen werden. 
Verwendet man jedoch das eben erläuterte Virtual-Memory-Schema, bei dem jede Speicherseite des virtuellen Adreßraums genau einer Speicherseite auf der Platte entspricht, muß der Code eines  Prozesses nicht nur in den Speicher kopiert, sondern auch noch in den Paging-Bereich der Platte geschrieben werden.
Zudem werden Speicherseiten, die Code enthalten, nie geändert, so daß eigentlich gar keine private Kopie des Codes in der Paging Area angelegt werden muß.
VMS, aber auch einige neuere UNIX-Versionen und natürlich modernere Systeme wie Mach und Chorus verwenden hier einen intelligenteren Algorithmus: 
Seiten mit Programmcode, die aus dem physikalisch vorhandenen Speicher verdrängt werden, werden einfach ohne Zurückschreiben aufgegeben und später aus der Programmdatei wieder nachgeladen ("paging from file").
Dadurch entfällt beim Starten eines Programmes das Umkopieren in die Paging Area, und der Paging-Bereich wird weniger stark belastet. 

Die Autoren von Mach und Chorus haben diese Idee konsequent weiter gedacht:
Diese beiden Betriebssysteme können das auch mit Daten machen, die mit read() und write() aus Dateien gelesen oder geschrieben werden.
Dateien, die aus Datensätzen fester Länge bestehen, sind schließlich nur der Sonderfall eines Arrays:
In PASCAL kann man das sogar noch in der Definition sehen.

Mit Hilfe der MMU blendet man einen Speicherbereich von der Größe der Datei, die verarbeitet werden soll, in den Adreßraum des Prozesses ein ("memory mapped file"). 
Für den Prozess ist die Basis dieses Speicherbereiches die Startadresse eines ganz normalen Arrays. Versucht der Prozess, auf dieses Array zuzugreifen, kommt es zu einem Page Fault. 
Das Betriebssystem hat diesen Speicherbereich mit einer Datei assoziiert und lädt jetzt die entsprechenden Dateiinhalte in die angesprochenen Speicherseiten, mit denen der Prozess dann wie bei einem normalen Arrayzugriff arbeitet. 
Beim Schließen der Datei wird der Speicherbereich wieder aus dem Adreßraum des Prozesses ausgeblendet, und alle Modifikationen werden spätestens zu diesem Zeitpunkt in die Datei zurückgeschrieben.

Auf diese Weise werden spezielle Dateioperationen in einer Programmiersprache überflüssig; 
Dateien werden wieder zu dem, was sie eigentlich sind:
Arrays dynamischer Länge, deren Inhalt über die Laufzeit eines Prozesses hinaus Bestand hat. 
Der Programmierer einer Anwendung braucht sich nicht mehr um das Lesen und Schreiben von Daten in Puffer zu kümmern, er greift einfach darauf zu. 
Das tatsächliche Bereitstellen der Daten und das Zurückschreiben auf Platte geschieht durch das Betriebssystem, ohne daß er etwas damit zu tun hätte.

## Inflation der Programmzähler

Bis jetzt sind wir stillschweigend davon ausgegangen, daß ein Prozess genau einen Kontrollfluß hat.
Bei den meisten Betriebssystemen ist das auch noch so, obwohl eine Verallgemeinerung möglich ist und bei moderneren Entwicklungen auch durchgeführt worden ist.
Es ist durchaus sinnvoll, daß im Image eines Prozesses mehr als ein Kontrollfluß ("Thread") aktiv ist.
Man stelle sich beispielsweise eine Tabellenkalkulation vor, die in einer Warteschleife auf Nachrichteneines Menüsystems wartet. 
Wenn der Benutzer jetzt einen Menüpunkt anwählt, der längere Zeit zur Durchführung braucht (etwa das Neuberechnen des gesamten Blattes), kann im Prozess ein Thread dafür abgespalten werden, während der andere Thread schon wieder in der Warteschleife bereitliegt, um neue Benutzerkommandos entgegen zu nehmen. 

Die Erzeugung eines Threads ist - verglichen mit der eines eigenständigen Prozesses - relativ wenig aufwendig. 
Ein Thread ist kaum mehr als einige Prozessorregister und ein eigener Stackbereich, während an einem Prozess noch ungezählte Tabellen für MMU-Konfiguration, offene Dateien, etc. hängen. 
Beim kommerziellen Chorus-System hat man diese Trennung zwischen Speicherverwaltung und Kontrollflußverwaltung auch begrifflich deutlich machen wollen:
Ein Kontrollfluß ist bei Chorus ein Thread, der zugehörige Kontext heißt Actor und ein Actor mit
mindestens einem Thread bildet einen Prozess. 
Die Kommunikation und der Datentausch zwischen Threads sind fast ohne Aufwand möglich:
Da Threads im selben Adreßraum liegen, können sie auf dieselben gemeinsamen Variablen zugreifen, ohne auf langsame und aufwendige Mechanismen zur Prozesskommunikation zurückgreifen zu müssen.

## Daten über die Grenze schaffen

Bei Prozessen, die in verschiedenen, durch die Schutzmechanismen des Betriebssystems getrennten Adreßräumen liegen, sind der Datentausch und die Kommunikation untereinander schon aufwendiger.
Einem gemeinsamen Adreßraum am nächsten kommt noch "shared memory". 
Dabei wird eine Speicherseite, die verschiedene Variablen enthalten kann, in die Adreßräume der beteiligten Kommunikationspartner eingeblendet. 
Diese sind allerdings voll verantwortlich für die Regelung des Zugriffs auf diese Speicherbereiche, die Freigabe, wenn sie nicht mehr benutzt werden, etc. 

Viele Betriebssysteme stellen deswegen höher entwickelte, aber auch langsamere Kommunikationsmöglichkeiten zur Verfügung.
Am häufigsten findet sich ein Message-System, bei dem eine Art FIFO-Struktur realisiert wird. 
Jeder Prozess hat, wenn er Nachrichten entgegennehmen möchte, einen sogenannten Port, an den andere Prozesse Nachrichten senden können.
Treffen die Nachrichten schneller ein, als der Prozess sie abarbeiten kann, bildet sich am Port eine Queue mit FIFO-Struktur.
Der empfangende Prozess arbeitet die Nachrichten jetzt in der Reihenfolge ab und sendet die Antworten an die Absender zurück.

Hier kann das Betriebssystem schon einen guten Teil der Zugriffsregelung, der Speicherverwaltung und der Adreßauflösung übernehmen. 
Wenn der Message-Mechanismus nämlich allgemein genug implementiert wird, muß der Message-Port des Empfängers nicht unbedingt auf der eigenen Maschine sein, sondern kann sich irgendwo im Netz befinden.
Ist der Empfänger lokal erreichbar, kann die Nachricht ohne Kopieren einfach in seinen Adreßbereich eingeblendet werden.
Andernfalls muß sie "by value" über das Netz kopiert werden.
Der Benutzer des Message-Systems merkt davon nichts, für ihn sind diese lästigen Details verborgen.
Das geht bei Chorus dann sogar soweit, daß Ports von einem Prozess zu einem anderen migrieren können, ohne daß sendende Prozesse von diesem Wechsel des Empfängers etwas merken.
Derartige Features erleichtern dem Programmierer von "fault tolerant systems" die Arbeit natürlich ungemein.

Noch viel wichtiger als ein Mechanismus zur Kommunikation zwischen Prozessen ist jedoch, daß ein einheitliches, erweiterbares Format zum Datentausch besteht. 
Es genügt nicht, daß das Betriebssystem Dienste zum Verschieben von Bytes zwischen einem oder mehreren Prozessen zur Verfügung stellt.
Der Empfänger muß auch in der Lage sein, diese Bytes als eine bestimmte Datenstruktur, etwa einen Bildausschnitt oder einen Text mit Steuerinformationen, zu deuten.
Wenn das Betriebssystem ein durch Subklassen erweiterbares Format für die verschiedenen am häufigsten auftretenden Datentypen bereitstellt, leistet es einen wesentlichen Teil zur Vereinheitlichung der Datenformate der Applikationen, die auf diesem Betriebssystem ablaufen.

Wichtig für die Funktionsfähigkeit eines solchen Datenformates ist, und das soll noch einmal besonders herausgestellt werden, daß es von seinem Benutzer unter Wahrung der Abwärtskompatibilität erweiterbar ist. 
Ein Benutzer eines Textverarbeitungsformates, beispielsweise ein DTP-Programm, muß in der Lage sein, seine programmspezifischen Zusatzinformationen in einem Text abzulegen.
Andere Anwendungen, die dieses Textformat lesen können, müssen trotzdem in der Lage sein, die Standardattribute eines Textes aus so einer Datei herauszulesen und die Nichtstandardattribute unverändert weiter zu kopieren.
Eine Anwendung, die ein zusammengesetztes Format schreibt, z.B. eine Animation oder ein Text mit Bildern, muß dies in einer Art und Weise tun können, die es anderen Anwendungen erlaubt, die Komponenten dieser Daten (etwa Einzelbilder) gezielt zu lesen, zu verarbeiten und wieder in die Gesamtdatei zu integrieren.

Funktionsbibliotheken, die die Arbeit mit solchen Dateiformaten unterstützen, gehören zwar nicht zu den unmittelbaren (Kern-) Dienstleistungen eines Betriebssystems, aber sie sollten auf jeden Fall zu seinem Standardfunktionsumfang gehören, um eben eine Einheitlichkeit in den Datenformaten bei den Anwendungen zu begünstigen.

 ## Einheitlichkeit - das zweite Ziel

Einheitlichkeit beim Zugriff auf die vom System bereitgestellten Dienste zu ermöglichen, ist, wie bereits am Anfang dieses Textes dargestellt, neben der Verteilung von Ressourcen eine der Hauptaufgaben eines Betriebssystems. 
Ziel soll es sein, Anwendungen eine virtualisierte Umgebung bereitzustellen, die zwar die Nutzung der speziellen Möglichkeiten dieses konkreten Systems möglichst wenig einschränkt, aber zugleich eine einheitliche, virtuelle Maschine über die Grenzen verschiedener Systemkonfigurationen oder gar verschiedener Hardwareplattformen hinweg ermöglicht. 

Betriebssysteme wie UNIX und seine Abkömmlinge tun dies beispielsweise, in dem sie den meisten Systemdiensten das Dateiparadigma überstülpen:
Pipelines, zeichen- und blockorientierte Geräte, Querverweise auf andere Dateien, Netzwerkdienste - alles dies ist als Eintrag im hierarchischen Namensraum des Dateisystems zu finden.

In Mach, aber auch in Plan9 und in den neuesten Versionen von UNIX, ist dieses Konzept noch  Verallgemeinert worden, indem von der Möglichkeit Gebrauch gemacht wurde, die unterschiedlichsten Typen von Dateisystemen in den Namensraum zu integrieren. 
So gibt es bei System V Rel. 4 ein `/proc`-Dateisystem, in dem die zur Zeit im Rechner laufenden Prozesse als Dateieinträge sichtbar gemacht werden.

Amoeba, ein experimentelles Betriebssystem von Tanenbaum, treibt es jedoch auf die Spitze. 
In Amoeba sind alle Dienste - also das Bereitstellen der Informationen in einer Datei, Pipelines, Prozesskommunikation, etc. - unter einer Kennung zu erreichen, die das jeweils angesprochene Objekt (die Datei, den Prozess, ...) eindeutig identifiziert.
Diese Kennung beinhaltet zugleich die Kodierung der Zugriffsrechte, die Adresse des Objektes im System und noch einige Informationen mehr. 
Die vom Betriebssystem verwalteten Objekte werden durch einen Directory-Service miteinander zu einer Struktur verknüpft, die nicht mehr auf die baumartige Hierarchie eines UNIX-Dateisystems beschränkt ist, sondern jeden beliebigen, gerichteten Graphen modellieren kann.
Da der Directory-Service selbst wieder ein Objekt im Amoeba-System ist, ergibt sich, ähnlich wie beim UNIX-Dateisystem, eine interessante, rekursiv definierte Struktur.

Eine andere Möglichkeit der Virtualisierung ist die Abstraktion von einem konkreten Gerät zu seinen Möglichkeiten.
In UNIX gibt es zum Beispiel die curses-Bibliothek, die es ermöglicht, ein Terminal unabhängig von den Steuercodes, die es verwendet, zu programmieren.
Windows, OS/2, AmigaDOS und andere Betriebssysteme leisten ähnliches bei der Ansteuerung von Druckern.
Statt daß die Anwendung einem bestimmten Drucker an der parallelen Schnittstelle einen bestimmten Steuercode zum Einschalten von Fettschrift zu sendet, bittet sie den Druckertreiber, den vom Anwender gewünschten Drucker in Fettschrift umzustellen, falls der Drucker das kann. 
Eine austauschbare Komponente des Betriebssystems, ein Gerätetreiber, stellt jetzt fest, ob der Drucker diese Funktion hat, und veranlaßt die für den konkreten angeschlossenen Drucker passenden  Maßnahmen an einem weiteren untergeordneten Gerätetreiber für die Druckerschnittstelle. 
Dies kann der Treiber für die parallele oder die serielle Schnittstelle sein, aber auch der SCSI- oder der Ethernet-Treiber für einen Drucker im Netz. 
Die "passenden Maßnahmen für den konkreten Drucker" können die Generierung von fünf ASCII-Steuerzeichen zur Umschaltung auf Fettdruck sein oder das Berechnen eines neuen Fonts und das Laden dieses Zeichensatzes auf den Drucker. 
In jedem Fall bekommt die Anwendung die von ihr gewünschte Dienstleistung, ohne überhaupt etwas von den Aktivitäten hinter den Kulissen zu merken und ohne daß der Hersteller der Anwendung bei jedem Update mehrere Disketten mit Gerätetreibern mitliefern muß.

## Das Betriebssystem der Zukunft?

Das Betriebssystem der Zukunft, egal ob es jetzt OS/2, Windows oder UNIX heißen wird, wird mit den heute verbreiteten Systemen, die kaum mehr als dynamisch linkbare Bibliotheken von Ein-/Ausgabefunktionen sind, wenig gemeinsam haben.
Statt dessen wird es halb-experimentellen Systemen wie Mach, Plan9 oder Amoeba ähnlich sehen.
Es wird einen kleinen Kern mit den notwendigsten Funktionen zum Multitasking und Message Passing haben und eine große Zahl von Standardserverprozessen für die unterschiedlichen Systemdienste bereitstellen.
Zu diesen Systemdiensten wird das Betreiben von Geräteabstraktionen (Standarddruckern, einheitlich steuerbaren Grafikbildschirmen) ebenso gehören wie das Bereitstellen komplexer Bibliotheksfunktionen über Serverprozesse mit eigenem Kontrollfluß (etwa die Konvertierung von Datenformaten oder eine Bibliothek mit Funktionen für grafische Benutzerführung). 

Der Preis für die Funktionalität: Mehr Megabytes, mehr Megaherz, mehr Megapixel.

## Glossar

Kernel:
: Der Kernel ist das eigentliche Betriebssystem. Moderne Systeme haben die Anzahl der Funktionen im Kernel auf das allernotwendigste reduziert. Man redet dann von einem Microkernel.

Gerätetreiber:
: Geräteabhängiges Treiberprogramm für ein Peripheriegerät, oft Bestandteil des Kernels.

Thread:
: Kontrollflußbestandteil eines Prozesses: CPU-Register, Stack, Zustand, etc.

Actor:
: Bezeichung im Betriebssystem Chorus für den Kontext eines Prozesses, der nicht mit dem Thread zusammenhängt: MMU-Register, Dateizeiger, etc.

Prozess:
: Ein Actor mit mindestens einem Thread bildet einen Prozess.

Image:
: Speicherabbild eines Prozesses.

Virtual Memory:
: Erweitern des Speicherbereiches, der einem Prozess zur Verfügung steht, durch für den Prozess transparentes Auslagern von Prozessen (oder Prozessteilen) auf einen Hintergrundspeicher durch Swapping oder Paging.

Swapping:
: Ein-/Auslagern ganzer Prozesse in einen speziellen Plattenbereich (swap area) bei Speicherknappheit.

Demand Paging:
: Ein-/Auslagern von Prozessteilen fester Größe (Pages) in einen speziellen Plattenbereich bei Speicherknappheit.

PMMU:
: Paged Memory Management Unit; Hardware zum Abbilden virtueller Prozessadressen auf physikalische Speicheradressen.

Working Set:
: Der Teil eines Prozesses, der aus Effizienzgründen in physikalischem RAM gehalten werden sollte, weil der laufende Prozess ständig Adressen aus dem Working Set referenziert.

Treshing:
: Dramatischer Leistungsabfall des Systems um einige Zehnerpotenzen, wenn wegen Speicherknappheit Teile der Working Sets von aktiven Prozessen ausgelagert werden.

Server-Client Modell:
: Art der Betriebssystemarchitektur, bei der die Dienste des Systems von Serverprozessen angeboten werden. Der Client sendet eine Nachricht mit einer Dienstanforderung an den Server, der die gewünschte Funktion asynchron ausführt und das Ergebnis zurücksendet.

Semaphore:
: Flag, das den Zugriff mehrere Prozesse auf eine Datenstruktur regelt.

Message passing:
: Paradigma beim Aufruf von Betriebssystemfunktionen: Die Parameter eines Dienstaufrufes werden dem Dienstanbieter in einer Nachricht übermittelt. Der Dienstanbieter ist ein eigenständiger Prozess, der die Anforderung unabhängig und asynchron zum Dienstaufrufer bearbeitet.

Time-Slice:
: Zeitscheibe; die Zeiteinheit, die ein Prozess maximal ohne Unterbrechung die CPU in Anspruch nehmen kann.

Preemptive Multitasking:
: Verfahren, bei dem Prozesse die CPU auch ohne eigenes Zutun nach Ablauf der Zeitscheibe verlieren können.

Cooperative Multitasking:
: Verfahren, bei dem Prozesses die CPU nur durch expliziten oder impliziten (durch Aufruf einer Systemfunktion) Aufruf des Schedulers verlieren können.

Scheduler:
: Betriebssystemteil, der bestimmt, nach welchen Kritierien die Zeitscheiben den einzelnen Prozessen zugeteilt werden.

Round-Robin:
: Scheduling-Algorithmus, bei dem alle lauffähigen Prozesse dieselbe Anzahl von Zeitscheiben zugeteilt bekommen.

Priority-Aging:
: Eigenschaft von Scheduling-Algorithmen. Prozesse, die längere Zeit keine Zeitscheibe zugeteilt bekommen haben, werden in der Priorität temporär heraufgestuft.

Wall Clock Time:
: Reale (gestoppte) Laufzeit eines Prozesses.

Cpu Time:
: Zeit, die ein Prozess tatsächlich ablaufend auf der CPU verbracht hat. Typischerweise viel weniger als ein Zehntel der wall clock time.

