---
layout: post
title:  'Schulen digitalisieren'
author-id: isotopp
feature-img: assets/img/background/rijksmuseum.jpg
date: 2020-06-23 21:32:27 +0200
tags:
- lang_de
- bildung
- politik
---
Da war also ein Artikel bei Golem: [Schulen bemühen sich vergeblich um Geld aus dem Digitalpakt](https://www.golem.de/news/keine-glasfaser-keine-it-kompetenz-schulen-bemuehen-sich-vergeblich-um-geld-aus-dem-digitalpakt-2006-149146.html).
> Die Schulen wollten das Geld nutzen, die Mittel würden aber trotz vieler Einreichungen nicht freigeben, sagte ein Lehrer und IT-Verantwortlicher eines Berliner Gymnasiums Golem.de.

Das liege daran, sagt der Artikel, daß für Mittel aus dem Digitalpakt eine Minimal-Ausstattung und Anbindung der Schulen gefordert ist, die so oft nicht realisierbar sei. Außerdem

> Auf kommunaler Ebene der Schulträger gebe "es kaum IT-Kompetenz. Die Gebäude sind marode, insbesondere die Verkabelung. WLAN scheiterte an 100 MBit/s-Verkabelung und überlasteten Stromkreisen für Power-over-Ethernet-Switches".
>
> Die Lehrer an den Schulen würden gefragt, wo Accesspoints aufgegangen werden sollen, wüssten aber keine Antwort, weil sie dafür nicht ausgebildet seien.

Das ist in der Tat ein Problem [1](https://twitter.com/isotopp/status/1275323416959205377) [2](https://twitter.com/isotopp/status/1275334802191912960). Was soll eine Schule auch machen, wenn nicht gewisse Grundvoraussetzungen erfüllt sind?

Damit man mit Notebooks, Tablets oder Chromebooks an einer Schule arbeiten kann, braucht man Strom an jedem Tisch. Den gibt es in deutschen Schulen in der Regel nicht. Aber auch für essentielle Hardware wie Wifi-Accesspoints, Switches oder elektronische Tafeln fehlt es an Anschlüssen.

Wifi für viele Clients baut man nicht wie daheim, indem man irgendwo einen AP hin klatscht. Man muß eine Ausleuchtungsanalyse machen, Positionen von APs planen, Sendeleistungen und Frequenzen wählen. Man braucht vermutlich einen AP pro Klassenraum, mit gut gewählten Frequenzen und radikal runtergedrehter Sendeleistung damit er die Nachbar-APs in den Nebenräumen und darüber/darunter nicht stört.

![](/uploads/2020/06/netspot-whg-berlin-before.png)

*Ausleuchtungsanalyse einer Privatwohnung vor der Optimierung*

Kabel müssen zu den APs führen, denn es ist aussichtslos, den Backhaul für große Schülerzahlen über Wifi zu machen. Die Kabel müssen GBit-Kabel sein, bei modernen APs braucht es deren zwei pro AP. Die APs brauchen Strom, in der Regel Power-over-Ethernet (PoE). Für PoE brauchen die Switches viel Strom, denn sie speisen die APs. Das heißt, sie brauchen Kühlung oder zumindest einen geeigneten Rechnerraum. Dort würde man auch den Breitbandanschluß der Schule terminieren.

Für eine Schule mit einer drei- oder vierstelligen Anzahl Schüler tut DSL nicht, man muß Glas legen - ein oder besser zehn GBit symmetrisch, je nachdem was geplant ist.

*Jetzt* kann man anfangen, ein Technik- und Medienkonzept für die Schule zu machen: Tablets oder Chromebooks? Lokaler Server oder Cloud? Webfilter oder Walled Garden? Whiteboards oder Android-eTafeln? Google Edu oder was eigenes? Welche Schulbuchanbieter haben statt Büchern HTML?

Das ist alles nicht einfach und dauert locker zwei Jahre für die Einführung und zehn Jahre zur Perfektionierung.

Man hätte 2010 anfangen müssen. An jeder einzelnen Schule - es gibt davon mehr als 30.000 in Deutschland, die Hälfte Grundschulen.

So, jetzt nehmen wir mal an, wir haben eine solche Schule - Glas 10 Gbit symmetrisch, Strom an den Tischen, Wifi pro Raum, und Monitor-Tafelsystem.

Jetzt Schüler ausrüsten. Wie kriegt man das hin, daß man möglichst flexibel ist, die Schüler keine Daten verlieren können und man dabei nicht arm wird? Wir brauchen Hardware in großer Stückzahl, also mit geringen Stückkosten.

Die Hardware muß robuste Software haben und keinen Ärger machen, wenn sie mal kaputtgeht. Daten müssen zentral gespeichert werden, nicht im Gerät - public oder private Cloud. Eine Terminal-Lösung wäre denkbar - VNC auf einen Schulserver, verschwendet aber die Rechenleistung im Schoß, belastet das Netz mehr und ist nicht gut portabel nach Hause.

Die Hardware ist idealerweise nicht an den Schüler gebunden: Wenn mal was ist, gibt man dem Schüler irgendein anderes Gerät und sie kann dann ohne Unterbrechung weiter arbeiten. Es sind Kinder und es ist eine Schule, mit Schwund ist zu rechnen.

Die Rechner müssen vor Ort einfach zu warten sein, mit Personal mit minimaler Ausbildung. Das heißt, langwierige Installationsprozeduren scheiden aus. "Einen Resetknopf länger als 40s drücken und das Gerät setzt sich auf einen durch Secure Boot verifizierten Grundzustand zurück und kann dann einem beliebigen Schüler gegeben werden" ist ungefähr der Gipfel dessen, was vor Ort geleistet werden kann.

Chromebooks leisten genau das. Billige Geräte mit Tastatur und optional Touchscreen, die durch "Powerwash" in den verifizierten Bootzustand versetzt werden können, und die - daher der Name - direkt in ein glorifiziertes Chrome booten. Dort landet man dann in Google Edu, also "Google Office für Schulen plus einen OAuth2 Identity Provider für Drittanbieter". Diese Drittanbieter, die Bildungspartner und Schulbuchverlage, haben so eine definierte Plattform (Browser, HTML, CSS, JS) gegen die sie entwickeln können und bekommen den Zugang über OAuth2 verifiziert hin, ohne daß unnötig personenbezogene Daten übermittelt werden.

In der Tat ist es in so einem Setup für den Schulbetrieb weitgehend egal, ob Corona ist oder nicht: Einer Cloud-Schule, die die Server nicht auf dem Schulcampus hat ist es Wurst von wo die Schüler connecten.

"Aber die Datenkraken!"

Leute, es gibt einen Haufen von Prüfungen und Zertifizierungen für diesen Kram. Google hat sie alle, und erneuert die jährlich. Auch die Bildungspartner können das tun. Wenn Ihr dann noch Bedenken habt, unterstellt Ihr, daß dieser ganze Zertifizierungskram nutzlos ist.

Das kann man machen. Aber damit das konstruktiv ist, sollte man dann benennen, was genau fehlt - also, was die Bedrohung ist, wie die nicht geprüft wird, und was der Schaden ist, wenn die Bedrohung eintritt. Dann - nur dann - ist Weiterentwicklung möglich.

Tut man das nicht, sagt man im Grunde nur "Ich verstehe diesen Neumodischen Scheiß™ nicht und wünschte, es wäre noch 1990." Kann man machen, aber dann lebt man eine Generation in der Vergangenheit und nicht im Jetzt.

Das ist kein haltbarer Zustand, wenn es um die Ausbildung der kommenden Generation geht. So gar nicht.

"Ja, sollen wir da nicht was eigenes entwickeln" Kann man machen. Das hätte 2010 sogar Sinn gehabt. Aber inzwischen ist es wichtiger, was zu machen als da noch lange irgendwelche Leuchttürme zu subventionieren und zu warten, daß die mit dem Verprassen der Steuergelder fertig sind, bevor man dann doch zu Google geht.

"Ja, und dann?" Ich lebe als Deutscher in den Niederlanden und habe ein 10-jähriges Kind in der Group 6 (der 4. Klasse) an einer niederländischen Basisschool. Durch das Lehrkonzept hier (Google Edu, Wifi-Chromebook Klassen) kann ich aus eigener Erfahrung sagen, daß der Drill (NL: "geautomatiseerd") etwa beim Kopfrechnen komplett an Webseiten über geht. Statt Eckenrechnen, Kopfrechen-Stafetten, und anderen Klassenspielen, die den Lehrer binden, haben die Kinder Zugriff auf programmierte Unterweisungen und casual games, die die zu drillenden Fertigkeiten einüben. "Löse einfache Kopfrechenaufgaben" oder "Rechtschreibaufgaben" um Space Invaders abzuwehren und ähnlich.

![](/uploads/2020/06/gynzi-kids.png)

*Gynzi Kids ist ein Anbieter von Lehrspielen und Casual Games mit Ausbildungshintergrund, der an der Schule verwendet wird.*

Die Kinder lernen und üben Dinge so wie sie ihnen Spaß machen, überspringen Einheiten oder machen sie in anderer Reihenfolge. Das ist nicht immer konfliktfrei: Der Sohn hat zum Beispiel alle Geld-Rechenaufgaben (Wechseln, Herausgeben, passend Zahlen) ausgelassen, denn "das habe ich ja schon im deutschen  Mathebuch gelernt". Aber die Klassenlehrerin hat sich auf die Übungsstatistiken in der Mathe-Website verlassen und nicht nachgefragt, und dann gab es Streit über die Note. Das hat sich mündlich schnell geklärt, aber auch hierzulande müssen alle Parteien den korrekten Umgang mit den Tools noch einüben.

Die Rolle des Lehrers verändert sich jedoch sehr, weil sie sich viel mehr vom Drillen und dem Frontalunterricht auf das individuelle Coaching verlagert hat. Das merkt man auch bei den Elterngesprächen (heute abend war eines, in Google Meet), bei denen beide Klassenlehrkräfte sehr detailliert die Schwächen und Stärken des Kindes ansprechen und konkret belegen können, was gut geht, was nicht, wo sich seit dem letzten Mal was verbessert hat.

Das ist sehr spannend, weil für uns Deutsche sehr ungewohnt - die Lehrer haben Zeit und offenbar auch die Muße, sich um solche Dinge zu kümmern, weil der ganze manuelle Papierkram und der Drill keine Arbeit mehr macht.

Dabei werden schon in der Grundschule Medienkompetenz und später selbstständiges Arbeiten traininiert.

![](/uploads/2020/06/nos-jeugdjournaal.png)

*Website von NOS Jeugdjournaal*

Das geht los mit dem gemeinsamen Durchsehen von Nachrichten auf [De Daag Vandaag](https://www.dedagvandaag.nl/) oder dem [NOS Jeugdjournaal](https://jeugdjournaal.nl/) und dem darüber reden. Dabei kommt das Gespräch ganz von selbst auf "Was in der Welt passiert", aber auch auf "Wo kommen Meldungen her?" und "Was ist wahr? Was ist wichtig?".

Ab diesem Schuljahr kommt dann noch die Werkstuckken dazu, Aufsätze, für die selbstständig zu recherchieren ist, für die eine Gliederung gemacht werden muß und die mit Inhalten gefüllt werden müssen - und die dann am Ende auch in eine Präsentation umgewandelt werden müssen. Dabei legt die Schule großen Wert darauf, daß die Kinder zwar Anleitung zur Recherche und zur Quellenbewertung erhalten, die Arbeit aber selbstständig leisten.

Die Schule, auf der unser Kind ist, macht außerdem noch [Kanjertraining](https://www.kanjertraining.nl/kenniscentrum/uitgangspunten/), also vermittelt einen Katalog von Verhaltensweisen mit Bewertung zum Umgang mit Konfliktsituationen, Kommunikationsverhalten und anderen Dingen aus diesem Themenkomplex. Das eröffnet den Kindern 

- eine Taxonomie von Verhaltensweisen: "Wenn wir uns streiten gibt es mehrere Arten, wie Menschen Konflikte austragen"
- ein Vokabular zur Erkennung und Benennung von Gefühlen, Situationen und Ursachen
- Bewertungen "Konflikte gibt es immer wieder, aber es valide und nicht valide Wege, sie auszutragen"
- und ein größeres Verhaltensrepertoire zum Umgang mit Konflikten "Wenn wir uns streiten, können wir erst mal versuchen herauszufinden, was unstrittig ist, und worum es uns geht, also was jeder im Idealfall als Ergebnis sehen will. Dann sehen wir besser, was wir klären müssen."

Dem Kind wird dadurch Zugang zum Selbst durch bewußte Reflektion ermöglicht. Es kann seine eigenen Verhaltensweisen erkennen, benennen, und versuchen sie zu verändern. Das macht er auch ganz gut, und man sieht, wie er bei der Sache Spaß hat.