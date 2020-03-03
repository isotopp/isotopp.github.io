---
layout: post
published: true
title: Von der GPL
author-id: isotopp
date: 2005-02-07 22:25:22 UTC
tags:
- free software
- lizenz
- politik
- lang_de
feature-img: assets/img/background/rijksmuseum.jpg
---
![](/uploads/20040415-gnu-head-sm.jpg)

Trolltech hat seine [Qt Bibliothek ab der Version 4 komplett unter GPL]({%
link _posts/2005-02-07-qt4-wird-vollst-ndig-gpl.md %})
gestellt. Das bedeutet, daß nicht nur die Unix-Version der Bibliothek unter
der GPL verfügbar ist, sondern auch die Windows-Version. Grund genug einmal
nachzulesen, was denn in der GPL drinsteht, und wieso das so ist.

Die Originalquelle zum Thema ist natürlich die 
[Licenses](http://www.gnu.org/licenses/licenses.html#GPL)-Seite der GNU Website 
([Deutsche Version der GPL](http://www.gnu.de/gpl-ger.html)). Dort findet man nicht nur den 
[Text der Lizenz](http://www.gnu.org/licenses/gpl.html), sondern auch eine 
[sehr lange GPL FAQ](http://www.gnu.org/licenses/gpl-faq.html), die keine Frage
mehr offen lassen sollte. Groklaw hat ebenfalls eine sehr gute 
[GPL References Page](http://www.groklaw.net/article.php?story=20050131053650842).

Was steht denn nun in der GPL?

Die GPL ist eine Lizenz. Eine Lizenz ist eine Erlaubnis, kein Vertrag. Die
GPL erlaubt es einem Anwender, ein Stück Code zu benutzen. Wenn der Anwender
das Stück Code nutzen möchte, muß er die Lizenz und die Bedingungen der
Lizenz akzeptieren. Die Bedingungen der Lizenz legen fest, unter welchen
Vorbedingungen die Erlaubnis zur Nutzung des Codes durch den Anwender
erteilt wird. Werden die Vorbedingungen verletzt, erlischt die Erlaubnis zur
Nutzung.

Darum ist es wichtig, sich diese Vorbedingungen und die Konsequenzen beim
Verstoß gegen diese Vorbedingungen genau anzusehen.

Paragraph 0 der GPL legt fest, auf was sich die Lizenz erstreckt und was die
Begriffe "Programm" und so weiter in der folgenden Lizenz erstrecken. Wenig
überraschend sind das alle Dateien, die mit dem betreffenden Lizenzvermerk
markiert worden sind.

Es wird auch festgelegt, welche Erlaubnisse die Lizenz erteilt - nämlich die
Vervielfältigung, die Verbreitung und die Bearbeitung bzw. Veränderung des
Programmes. Insbesondere nimmt die Lizenz die Ausführung des Programmes aus - 
sie wird nicht eingeschränkt. Ebenso erstrecken sich die Bedingungen nicht
auf auf die Ausgabe des Programmes, sofern sie nicht wieder ein Programm
sind - was nur bei Programmgeneratoren der Fall ist.

Der folgende Paragraph 1 erlaubt dem Anwender dann beliebig unveränderte und
vollständige Kopien des Programmes anzufertigen und weiterzugeben.
Besonderer Wert wird dabei darauf gelegt, daß dabei auch der rechtliche
Rahmentext mitkopiert wird, also die Urheberrechtsnotiz, die Lizenz und die
Hinweise auf die Lizenz und der Haftungs- und Garantieausschluß.
Ausdrücklich erlaubt wird dabei, Geld für die Erstellung der Kopie zu nehmen
und ggf. zusätzliche Garantien für eine Extragebühr anzubieten.

![](/uploads/matrix.jpg)

Diese Klausel erlaubt es also dem Anwender, das Programm als Ganzes
weiterzugeben, aber sie erlaubt noch keine Veränderung oder
Weiterentwicklung des Programmes. Wäre dies die ganze GPL, säßen wir noch
immer mit Linux 0.01 und lustigen "AAAAA" und "BBBB"-Buchstabenreihen auf
dem Bildschirm da, und niemandem wäre geholfen.

Es ist Paragraph 2, der die Veränderung des Programmes erlaubt, die
Weitergabe des veränderten Programmes erlaubt, und die Bedingungen dafür
festlegt: Die Dateien müssen als geändert markiert sein, und Änderung und
Datum der Änderung müssen erkennbar sein, das geänderte Programm muß Dritten
gegenüber vollständig und unter den Bedingungen der Originallizenz wieder
zur Verfügung gestellt werden und das Programm muß bei seinem Start auf
seine Lizenz, den Garantie- und Haftungsausschluß und die anderen
rechtlichen Rahmenparameter hinweisen, soweit dies möglich ist.

Der Abschnitt enthält auch Schrankenbestimmungen, die ein wenig verwirrend
formuliert sind - "Identitifizierbare Teile, die nicht vom Programm
abgeleitet sind" und "Zusammenlegen mit anderen Programmen auf einem
Speicher- oder Vertriebsmedium".

Die Schrankenbestimmungen sollen bewirken, daß sich die GPL nur auf ein
Programm und die zu seiner Ausführung notwendigen Bibliotheken erstreckt,
aber nicht auf andere Programme, mit denen unser Programm zusammenarbeitetet
und sie sollen bewirken, daß Programme unter der GPL mit anderen Programmen
zusammen in einer Distribution verbreitet werden können.

![](/uploads/relay.jpg)

So ist [SQL Relay](http://freshmeat.net/projects/sqlrelay/) zum Beispiel ein eigenständiges Programm, das die unter der GPL stehenden Bibliotheken von MySQL 4.x verwenden kann. Wenn es diese Bibliotheken einbindet, muß es selber auch unter der GPL stehen - es ist ein abgeleitetes Werk im Sinne der GPL und nicht von der unter der GPL stehenden Komponente - den Bibliotheken - getrennt.

Ein Client kann jedoch das SQL Relay ansprechen und über Netz mit ihm
kommunizieren. Er ist ein getrenntes Programm, das vom SQL Relay verschieden
ist und mit ihm keinen gemeinsamen Adreßraum teilt. Daher erstrecken sich
Bedingungen der GPL nicht auf dieses Programm und es kann unter einer
anderen Lizenz stehen.

Es ist auch möglich, SQL Relay etwa zusammen mit Oracle auf einer CD zu
verteilen (vorausgesetzt die Lizenz von Oracle erlaubt diese
Weiterverbreitung auch). Da dies nur ein Zusammenlegen auf einem gemeinsamen
Medium ist, erstrecken sich die Bedingungen auch nicht auf das auch auf der
CD befindliche Oracle.

Paragraph 3 bezieht sich dann auf den Quelltext, aus dem das Programm
erstellt wird. Die GPL versteht unter dem Quelltext die Dateien in einer
Form "die für Bearbeitungen vorzugsweise verwendet wird" und verlangt, daß
man alle Dateien weitergibt, die für die Reproduktion des ausführbaren
Programmes erforderlich sind. Die GPL verlangt nun, daß man

ENTWEDER den Quelltext mit dem Programm maschinenlesbar auf einem "üblichen"
Medium mitzuliefert,

ODER statt des Quelltextes ein drei Jahre lang gültiges Angebot mitliefert,
den Quelltext in einer solchen maschinenlesbaren Form zu den nominalen
Kosten für die Kopienerstellung nachzuliefert,

ODER das Angebot weitergibt, daß einem die Upstream-Quelle für den Quelltext
gemacht hat (diese Option kann man aber nur verwenden, wenn man das Programm
nur als Binary erhalten hat, nicht verändert hat und man es
nicht-kommerziell weitergibt)

In §6 weiter unten steht dann, daß man mit der Weitergabe des Programmes
auch die Lizenzrechte am Programm weitergibt, ohne sie einzuschränken oder
zu verändern.

![](/uploads/yinyang.jpg)

3 und §6 sind die Kernbestimmungen der GPL.

Sie stellen sicher, daß die Personen, die das Programm von uns erhalten
haben, mit dem Programm genau dasselbe machen können (§3: sie haben alle
notwendigen Informationen dazu) und machen dürfen (§6: sie haben alle
notwendigen Rechte dazu), was wir auch können und dürfen.

Sie ist zugleich den Spielern im kompetetiven Feld ein mächtiger Dorn im
Auge. Andere Lizenzen, etwa die Apache License, die BSD License und andere
haben eine solche Bedingung nicht. Dort kann man den Code nehmen, verändern
und das veränderte Programm als Binärprogramm weitergeben, muß jedoch den
veränderten Code nicht herausgeben.

In den Augen der Autoren der GPL ist das ein Fehler in diesen anderen
Lizenzen. Brendan Scott erklärt sehr schön, wieso diese Bestimmung der GPL
wichtig ist. In
[The Forkin' Fallacy](http://www.opensourcelaw.biz/papers/041218_Brendan_Scott_Forkin_Fallacy.pdf)
definiert er, was ein Fork eines Projektes ist (eine neue Version auf der
Basis einer von der ursprüngliches Codebasis abgespaltenen und geänderten
Codebasis) und warum dies bei einer Lizenz wie der GPL kein Problem ist. Da
unter der GPL alle Änderungen wieder öffentlich zugänglich gemacht werden
müssen, können sich die verschiedenen Forks untereinander befruchten und
Code austauschen, wenn sie dies wünschen. Sie können also jederzeit ganz
oder teilweise wieder zusammenfließen.

![](/uploads/forke.jpg)

Forks sind nur dann ein Problem, wenn die ursprüngliche Codebasis in mehrere
Kopien zerfällt, die sich unterschiedlich entwickeln und untereinander
keinen Code tauschen können. Brendan Scott nennt in seinem Text die
[UNIX wars](http://en.wikipedia.org/wiki/UNIX_wars) als Beispiel für solche
schädlichen Forks. David Wheeler führt den Gedanken in
[Make Your Open Source Software GPL-Compatible. Or Else.](http://www.dwheeler.com/essays/gpl-compatible.html) 
noch weiter aus.

Die anderen Abschnitte der GPL regeln dann rechtlichen Rahmenkram, oder
weisen auf einige selbstverständliche Details noch einmal ausdrücklich hin.
So sagt §5 beispielsweise "Man muß die GPL nicht anerkennen, aber wenn man
es nicht tut, kann man die unter der GPL stehenden Programme halt gar nicht
nutzen." und §7 besagt sinngemäß: "Es gibt keine Ausnahmen: Wenn uns andere
Gründe (Verträge, Urteile, Patente oder was auch immer) hindern, die
Bedingungen der GPL zu erfüllen, dann können wir unter der GPL stehende
Programme halt nicht nutzen." und die GPL endet mit einem Haftungs und
Garantieausschluß.

In  [Why I love the GPL](http://trends.newsforge.com/trends/05/01/24/2141242.shtml?tid=29)
schreibt Joe Barr, warum die GPL genau diese Form hat und greift damit noch
einmal das Thema der Kernbestimmungen der GPL auf: Die GPL hat die Aufgabe,
den Code (nicht den Programmierer!) zu schützen und jedem Anwender des Codes
vier Freiheiten zu erhalten: 

- Die Freiheit, das Programm zu jedem Zweck auszuführen.
- Die Freiheit, das Programm und seine Funktionsweise zu studieren und anzupassen.
- Die Freiheit, das Programm weiterzugeben.
- Die Freiheit, das Programm nach Belieben zu verändern.

Anders als etwa die BSD Lizenz will die GPL diese Freiheiten <u>jedem</u>
Anwender des Codes erhalten und darum verlangt die GPL, daß auch Änderungen
am Code wieder unter der GPL stehen. Joe Barr verweist dann auf eine Reihe
von Beispielen, in denen BSD Code von einem kommerziellen Projekt
integriert, modifiziert und dann verschluckt wurde - die Änderungen waren
für alle anderen Anwender verloren.

In gewisser Weise ist die GPL also eine Lizenz der kooperativen Sphäre (siehe 
[Ein paar ideologische Steine ins Rollen bringen]({% link _posts/2005-01-05-ein-paar-ideologische-steine-ins-rollen-bringen.md %}), 
aber eine wehrhafte solche. Sie zwingt die Nutzer der GPL dazu, nach den
Regeln der kooperativen Sphäre zu spielen. Verstößt ein Spieler gegen diese
Regeln, wird er bestraft 
([Tit for Tat](http://en.wikipedia.org/wiki/Tit_for_Tat), 
[The Evolution of Cooperation](http://en.wikipedia.org/wiki/The_Evolution_of_Cooperation)). 
Die Strafe ist in diesem Fall ein Erlöschen der Lizenz und damit ein
Ausschluß aus der kooperativen Sphäre - damit erlischt der Zugriff auf jede
Menge Code der kooperativen Sphäre (noch einmal 
[Make Your Open Source Software GPL-Compatible. Or Else.](http://www.dwheeler.com/essays/gpl-compatible.html)).

Was passiert, wenn ich Code, der unter der GPL steht, in mein Programm
einarbeite, und dann gegen die Bedingungen der GPL verstoße? Verliere ich
alle Rechte an meinem eigenen Code und werde ich gezwungen, diesen unter der
GPL zu öffnen und weiterzugeben?

Nein.

![](/uploads/accesspoint.jpg)

[GNU GPL in Deutschland]({% link _posts/2004-04-15-gnu-gpl-in-deutschland.md %})
zeigt, was passiert, wenn ein Hersteller gegen die GPL verstößt. Ihm kann
die Weiterverbreitung seines Produktes so lange untersagt werden, wie er
gegen die GPL verstößt. Er kann diesen Zustand abstellen, indem er entweder
allen GPL-Code aus seinem Produkt entfernt, oder indem er den Bedingungen
der GPL nachkommt, und den Quelltext zu seinen Änderungen im Rahmen der
Schrankenbestimmungen von §2 und §3 veröffentlicht. Die Wahl, welche Lösung
des Lizenzkonfliktes hier vorgezogen wird, liegt jedoch beim Hersteller. Er
kann nicht gegen seinen Willen gezwungen werden, Source offenzulegen und
freizugeben. Die GPL ist nicht viral. Sie ist nur fair.
