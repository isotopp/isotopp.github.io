---
layout: post
published: true
title: Incident Management und Transparenz
author-id: isotopp
date: 2010-05-18 11:14:06 UTC
tags:
- itil
- privacy
- security
- wlan
- lang_de
feature-img: assets/img/background/rijksmuseum.jpg
---
In einem  Kommentar zu "Wie man aus Versehen WLAN-Daten mitschneidet"
schreibt Florian:

> Sorry, sowas DARF nicht "passieren". Nicht Google und keinem anderen
> Unternehmen, dass auch nur entfernt von Seriösität und Vertraulichkeit
> lebt. Hört bitte auf, die Schuld wieder den "Medien" oder der "Politik"
> zuzuschieben. Google hat Scheisse gebaut.

Aber so etwas passiert.

Es passiert so oft, daß es Standards dafür gibt. In der Sprache und dem 
[Prozeßmodell](http://www.tct.de/systemberatung/it/images/itil2.jpg) von 
[ITIL](http://de.wikipedia.org/wiki/IT_Infrastructure_Library) ist so etwas ein 
[Incident](http://de.wikipedia.org/wiki/Incident_Management): "Ein Ereignis,
das nicht zum standardmäßigen Betrieb eines Services gehört und das
tatsächlich oder potenziell eine Unterbrechung dieses Services oder eine
Minderung der vereinbarten Qualität verursacht." Das ist vornehm für
"Scheiße gebaut oder in der Scheiße stecken".

So etwas passiert.

Ich habe es oft genug gesehen. In einem anderen Leben war es mein Job,
Incidents zu managen, also zu erkennen, daß wir in der Scheiße stecken und
Leute zusammenzutrommeln, die das dann sofort beheben. 

In der Folge dann festzustellen, woran das lag (Das nennt man in ITIL:
[Problem Management](http://de.wikipedia.org/wiki/Problem_Management)) und
Maßnahmen einzuleiten, die dafür sorgen, daß das nicht wieder passiert (in
ITIL ein Aspekt von
[Change Management](http://de.wikipedia.org/wiki/Change_Management_%28ITIL%29),
nämlich der Aspekt, der die Prozesse und Arbeitsanweisungen selbst changed).

In jenem Leben war mein Job die Security-Seite des gesamten Betriebes. Wäre
ein WLAN-Fail wie bei Google zu dieser Zeit bei meinem Arbeitgeber
geschehen, wäre er als Privacy-Problem genau bei mir als zuständigem
Techniker und bei dem Kollegen gelandet, der Datenschutzbeauftragter und
Jurist der Firma war. In noch einem anderen Leben war mein Job
Datenbank-Consultant. Und auch da kommt es schon einmal vor, daß man
bemerkt, daß die Dinge nicht so liegen wie einem die Betreiber der Anlage
schildern daß sie liegen sollten.

So etwas passiert.

Auch anderswo als bei Google. Und ja, es passiert 'aus Versehen', also aus
Unachtsamkeit, Unkenntnis, durch Fehlbedienung oder Fehlinterpretation von
Arbeitsanweisungen und aus tausend anderen Gründen. Sei es, daß ein Laden
mehr Daten erfaßt als er glaubt, daß er das tut. Oder daß ein anderer Laden
glaubt, Daten physisch zu löschen und sich dann herausstellt, daß die
entsprechenden Datensätze seit Jahren nur als 'ungültig' geflaggt werden
statt entfernt zu werden, oder daß ein dritter Laden personenbezogene Daten
glaubt zu pseudonymisieren und sich hinterher herausstellt, daß sich diese
Pseudonyme intern trivial aufdecken lassen, um mal typische
Fehlersituationen herauszugreifen ohne zu konkret zu werden.

In jedem der genannten drei Fälle handelt es sich in den konkret erlebten
Situationen vermutlich gegen einen Verstoß gegen geltendes Recht des
jeweiligen Landes, indem der Incident aufgetreten ist. Der Unterschied
zwischen dem Vorgehen von Google und dem Vorgehen in anderen mir bekannten
Fällen ist der, daß Google den Fall dokumentiert und öffentlich macht und
[unter Aufsicht löscht](http://www.golem.de/1005/75160.html), statt das
Problem still und heimlich im Kämmerlein unter den Teppich zu kehren.

Ob das PR-Technisch global ein Gewinn ist weiß ich nicht.

Aber mir persönlich nötigt das eine ganze Menge Respekt ab und ist eher
geeignet, mein Vertrauen in die Ehrlichkeit von Google zu stärken.

