---
layout: post
published: true
title: Automatisierung und Skalierung - Teil 2
author-id: isotopp
date: 2011-02-18 20:47:49 UTC
tags:
- architektur
- mysql
- work
- lang_de
feature-img: assets/img/background/mysql.jpg
---
Dies ist der 2. Teil zum Thema Automatisierung von Systemverwaltungsaufgaben. 
[Den ersten Teil gibt es hier]({% link _posts/2011-02-17-automatisierung-und-skalierung.md %}).

In jenem Text habe ich mit dem Beispiel eines Installationsservers gearbeitet und ich schrieb darüber: 
> Was also wie ein wenig Gescripte aussieht, ist in Wirklichkeit die
> Definition und Realisierung eines Prozesses - genau genommen die
> Formalisierung eines Prozesses "Server aufsetzen" in der Firma. Das Ziel
> des Prozesses ist die Produktion einer neuen Maschine, die einer gewissen
> Spezifikation möglichst gut entsprechen soll. Dabei sind die Prozeßziele
> die möglichst genaue Einhaltung der Spezifikation, und die möglichst
> schnelle Abwicklung des Auftrages. Dabei ist das Wissen eines Experten in
> Programmcode auskristallisiert worden - den Hilfs-Scripten und Anpassungen
> des Installationsservers.

Ich muß die wichtigen Punkte hier noch einmal herausstellen: Wenn wir in
einem Umfeld solche Aufgaben automatisieren, dann wollen wir damit
verschiedene Dinge erreichen.

Zum einen soll die gewünschte Operation, etwa die Installation einer Kiste,
reproduzierbar gemacht werden. Das kann nur dann gelingen, wenn die
Automatisierung dieses Prozesses vollständig ist, _die Anzahl der manuellen
Arbeitsschritte zur Nachbearbeitung also Null ist_.

Denn wenn während einer solchen Änderung an einer Maschine auch nur ein
Arbeitsschritt von Hand durch einen Sysadmin ausgeführt wird, dann besteht
die Gefahr, daß diese Änderung nicht korrekt oder uneinheitlich gemacht
wird, und das gefährdet die nachfolgenden automatischen
Bearbeitungssschritte.

Außerdem geht die Parallelisierbarkeit der Operation verloren, wenn noch
manuelle Arbeitsschritte notwendig sind: Egal wie viele Kisten wir
zeitgleich durch den Prozeß ziehen können, am Ende müssen die manuellen
Schritte nacheinander Kiste für Kiste durch einen menschlichen Admin
abgearbeitet werden, sind also wieder serialisiert. Das heißt, es gibt einen
Punkt, der vermutlich gar nicht so weit draußen liegt, an dem der ganze
Prozeß wieder bottlenecked.

Und schließlich ist es so, daß wir durch die Automatisierung einer Operation - 
hier der Installationsprozeß  - das notwendige Expertenwissen zur
Durchführung in ein Script verpacken. Das Wissen um das "Wie" wird
externalisiert, damit reproduzierbar und einem Diskurs (durch Patches)
zugänglich gemacht.

Baut man da noch eine schöne Bedienoberfläche drüber, hat man die Operation
sogar produktisiert: Sie kann nun durch Personal ausgelöst werden, das von
den Details nichts mehr weiß und wissen muß und daher niedriger qualifiziert
sein kann als das Personal, das den Prozeß entwickelt hat.

![](/uploads/automatisierter_prozess.png)

Der automatisierte Prozeß und seine Ziele/Effekte.

Zieht man das konsequent durch, bekommt man innerhalb des Systembetriebes
eine Trennung zwischen Personen, die Systeme bedienen ("Operator") und
Personen, die Prozesse automatisieren, indem sie die Interfaces für
Operatoren und die Funktionalität dahinter bauen.

Letztere Gruppe entwickelt Programme, genau wie die Entwickler in der
Entwicklungsabteilung - es sind Entwickler 
([auch wenn es Leute gibt, die das bestreiten](http://teddziuba.com/2010/10/taco-bell-programming.html)
und die meinen, das Gescripte da sei keine richtige Programmierung).

Solche Entwickler bauen Code zur automatisierten Systemverwaltung, also
Infrastruktur, im Gegensatz zu den regulären Entwicklern, die an neuen
Features bauen. Daher nenne ich die einen Infrastrukturentwickler und die
anderen Featureentwickler.

Andere Leute nennen das 
[DevOps](http://www.jedi.be/blog/2010/02/12/what-is-this-devops-thing-anyway/), 
und integrieren die Infrastrukturentwickler tiefer in die
Featureentwicklung, die dann die Belange von Operations gleich bei der
Entwicklung der Software von Anfang an mit berücksichtigen soll. Ich halte
das nicht unbedingt für glücklich, weil die geforderten Qualifikationen
andere sind, und weil die Denkweise des Infrastrukturentwicklers eine andere
ist als die eines Featureentwicklers.

Featureentwickler, insbesondere im Bereich der agilen Methoden, sind ein
wenig wie Teletubbies - sie sind timeboxed, und wenn bestimmte Dinge beim
Ablaufen der Timebox nicht fertig werden, dann werden diese Features eben
gekippt und auf ein späteres Release verschoben. Das macht aber nix, denn
man kann die Features, die fertig geworden sind, schon mal releasen und die
Leute, die das gebaut haben, trotzdem loben: Ui, das habt ihr aber fein
gemacht und so schön bunt! Oder anders gesagt: Auch schon für Teil-Lösungen
gibt es oft einen inkrementellen Payoff.

Im Bereich der Infrastrukturentwicklung gibt es das eher nicht, eben genau
wegen der Anforderung "genau Null manuelle Eingriffe". Für viele Aufgaben
funktioniert timeboxing hier nicht, sondern man muß die Aufgabe ganz,
komplett und vollständig erledigen, erst dann kann man das erste Mal
wirklich Gewinne durch die Erledigung der Aufgabe einstreichen - dann aber
auch gleich in voller Höhe. Die Führung eines Teams von
Infrastrukturentwicklern muß daher eher militärisch erfolgen: Klar
definierte und abgegrenzte Ziele, dann rein, die Mission erledigen und
wieder raus, keine halben Sachen.

Daher ist in der Infrastrukturentwicklung 
[Scrum](http://de.wikipedia.org/wiki/Scrum) eine Methode, die eventuell nicht
passend ist - schon gar nicht, wenn auf der Prioritätenliste Featureentwicklung mit
 Infrastrukturentwicklung um Prioritäten kämpft. Denn Scrum limitiert die
Arbeit pro Iteration durch das  [Selected Backlog](http://de.wikipedia.org/wiki/Scrum#Selected_Backlog), 
und da Featureentwicklung dem Betrieb direkt Einnahmen bringt, während
Infrastrukturentwicklung in vielen eher als Geldsenke gesehen wird, führt
das schnell dazu, daß jede Menge 
[Technical Debt](http://en.wikipedia.org/wiki/Technical_debt) aufgebaut wird, 
d.h. wichtige Infrastrukturarbeit liegen bleibt.

Man kann versuchen, da mit 
[Priority Inversion](http://en.wikipedia.org/wiki/Priority_inversion)
drum herum zu arbeiten, d.h. daß Infrastrukturprojekte die Priorität der
Featureprojekte erben, für die sie Vorbedingung zur Realisierung sind, aber
meiner persönlichen Erfahrung nach wird das nicht strikt genug gehandhabt.
Außerdem verhindert es proaktive Infrastrukturarbeiten, und rein reaktive
Systemadministration ist ein sehr steiler Weg ins Chaos.

Aber auch wenn Infrastrukturentwicklung von der Featureentwicklung getrennt
ist, etwa weil eine Trennung von Operations und Development existiert, ist
Scrum oft nicht die geeignete Methode, da Timeboxing bei einer
Aufgabenstellung nicht so gut funktioniert, die erst dann Gewinne bringt,
wenn die Aufgabe 100% erledigt ist. Besser verwendet man eine
[Kanban](http://de.wikipedia.org/wiki/Kanban_in_der_IT#Unterschiede_zwischen_Kanban_und_Scrum)-Variante 
und paßt diese dann auf die lokalen Erfordernisse der Organisation und die
Mentalität des Teams an.

![](/uploads/greenhopper.png)

Jira Greenhopper Extension mit der Darstellung eines Migrationsprojektes.

Setzt man das um, stellt man binnen 6 bis 12 Monaten fest, daß sich die Art
der Aufgaben und der geforderten Qualifikationen innerhalb des ehemaligen
Sysadmin-Teams sehr verschieben. Zwar sind immer noch Kenntnisse von
bestimmten Subsystemen und ihrer Arbeitsweise notwendig, aber die neu
geschaffenen Infrastrukturentwickler brauchen tatsächlich Kenntnisse einer
(interpretierten) Programmiersprache (PHP, Perl, Python, Ruby) im Gegensatz
zu einer Scriptsprache (Shell) - genau genommen wird man sich im Team auf
eine gemeinsame Plattformsprache einigen müssen, ein gemeinsames Repository
haben, und auch sonst eine ganze Menge Dinge vereinheitlichen müssen.

Die Arbeitsweise des Teams ändert sich ebenfalls - wenn die Umstellung
gelingt, wird sich nach Ablauf des ersten Jahres kein Sysadmin mehr auf
einer Kiste einloggen müssen, weil ssh von func, puppet, LDAP und einer
Datenbank zum Konfigurationsmanagement abgelöst worden ist.
