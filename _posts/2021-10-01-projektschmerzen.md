---
layout: post
title:  'Projektschmerzen'
author-id: isotopp
feature-img: assets/img/background/rijksmuseum.jpg
date: 2021-10-01 21:38:44 +0200
tags:
- lang_de
- politik
- computer
---

Es beginnt mit [einem Tweet von Manuel Atug](https://mobile.twitter.com/HonkHase/status/1443623907064492035):

>  "Wegen Überlastung der Server: #Notruf-App vorerst nicht mehr in App-Stores"

und der Tweet verlinkte einen (inzwischen nicht mehr existierenden) Artikel beim Deutschlandfunk.
[Christoph Petrausch](https://mobile.twitter.com/hikhvar/status/1443835052413104144) erklärt, wie solche Projekte falsch laufen können:

> Sowas erfordert eine Fehlerkultur. Du musst als Organisation in der Lage sein, nach so einem Incident einen Schritt zurückzutreten.
> Alle Fakten auf den Tisch zu legen und zu fragen: 
> Warum kam es dazu? 
> Wo liegen die Probleme?
> Und daraus musst du dann für das nächste mal lernen.
> 
> Und das ist sehr schwer, wenn du in einem Konglomerat aus Dienstleister und Konsortien sitzt. 
> Da sind nämlich Verträge und Vertragsstrafen im Weg. 
> Wenn der Dienstleister sagt: "Yes, da haben wir nicht nach State auf the Art gearbeitet", kommt gleich der Anwalt vom Auftraggeber.

## IT-Projekte

Ich [schrieb dazu](https://mobile.twitter.com/isotopp/status/1443847331355504690):

Christoph Petrausch schneidet hier ein weiteres sehr unangenehmes Thema an:

Wenn man mit mehreren externen Dienstleistern arbeitet, dann ist es auf viele Weisen schwieriger einen Projekterfolg zu haben.
Denn der Dienstleister arbeitet nicht für den Projekterfolg, sondern primär für den Vertrag.
Das muss er tun, um sich abzusichern, aus den von Christoph genannten Gründen.

Ändern sich die Anforderungen des Projekts oder sind in Teilprojektphasen Learnings aufgetaucht, die man in den folgenden Projektphasen einfließen lassen möchte, dann ist das alles schwierig.
Denn Nachsteuern ist dann eine Vertragsänderung, mindestens eine Anpassung des Statement of Work.
Wahrscheinlich wird man jedoch auch das Finanzielle nachregeln müssen.

Das Projekt wird dadurch schwieriger steuerbar und langsamer, weil jede Anpassung auf einmal ein Verwaltungsakt ist.

Generell steigen die Projektrisiken mit jeder administrativen Grenze überproportional an:
hier mein Amt, dort Dein Dienstleister.
Das ist so, weil sich Zeitverzögerungen auf dem Dienstweg, Nachrichtenverfälschungen durch Stille Post und dergleichen mehr akkumulieren.

Mit einer steigenden Anzahl von Projektpartnern ("administrativen Einheiten") steigen auch die Kommunikationsbeziehungen, der Verhandlungsbedarf, und die auszugleichenden Interessen an: ($ n * (n-1)/2 -> n^2 $).

![](/uploads/2021/10/kommunikations-explosion.png)

*Anzahl der Kommunikationsbeziehungen bei 3 (3), 4 (6), 5 (10) und 6 (15) Projektpartnern.*

Das ist einer der Hauptgründe für Kostenexplosionen und Zeitverzögerungen bei solchen Projekten:
Vertragsstrukturen und Kommunikations- und Verhandlungsaufwand machen es schwer, die Ziele aller Projektbeteiligten kohärent zu halten und das Projekt schnell auf geänderte Anforderungen anzupassen.

## Bärcode

Nun mache ich diese IT-Sache schon mehr als 35 Jahre, und dort ist es meiner Erfahrung nach *immer* so, daß sich die Anforderungen im Laufe des Projektes ändern und man dann das Projekt anpassen muß.

[![](/uploads/2021/10/baercode.jpg)](https://baercode.de)

Selbst bei so simplen Sachen wie [baercode.de](https://baercode.de), den ich ehrenamtlich beratend begleitet habe, und die technisch korrekt und im Zeit- und Kostenbudget waren ist es so, daß die zusammenbrechende Kontrollpraxis zeigt, daß man einen wirksamen Test- und Covid-Paß eigentlich grundsätzlich anders gestalten muß.

In einer weiteren Iteration (die nicht geplant ist) würde man grundsätzlich und viel aufwendiger an das Problem herangehen müssen.
Das ist aber etwas, das zum Zeitpunkt des Requirement Engineerings nicht absehbar war.
Es wäre auch nicht durchsetzbar gewesen, hätte jemand zu diesem Zeitpunkt damals die Anforderung eingebracht.

## Experiment early

In meinem Hauptberuf ist es so, daß mein Arbeitgeber deswegen unfertige Features so schnell als möglich in der Produktion testet.

![](/uploads/2021/10/8-rollouts-1.jpg)

*Slideshare [8 Rollouts a Day](https://www.slideshare.net/isotopp/8-rollouts-a-day#19)*

Es geht darum, die Requirements zu validieren. "Ist diese Idee wirklich geeignet, das Problem zu lösen?"

Als Webanwendung und als Anwendung, die nicht mit hoheitlichen oder medizininschen Daten arbeitet sind wir da in einer privilegierten Position. 
Wir können dann mit relativ wenig Aufwand früh experimentieren, solange wir uns aus PII und PCI raus halten.

![](/uploads/2021/10/8-rollouts-2.png)

*HIPPO: HIghest Paid Persons Opinion. Experiments kill HIPPOs.*

Weil wir das eigentliche Feature mit so wenig Entwicklungsaufwand als möglich implementieren können wir früh sehen, welche Änderungen an der Website uns reicher machen.
19 von 20 Ideen scheitern in dieser Experimentierphase.

![](/uploads/2021/10/8-rollouts-3.png)

*Das Experiment dient dazu, eine minimale (oder Fake-) Implementation eines Features auszumessen. Dabei ist ausschließlich interessant herauszufinden, ob die Requirements bei echten Usern überhaupt Sinn ergeben.* 

Wir wissen dann jedoch auch, *wieviel* reicher uns so ein Feature macht, und weil das so ist, können wir den Einsatz von Entwickler-Kapazitäten viel besser steuern:
Entwickler arbeiten nur an Dingen, von denen wir wissen, daß sie Mehreinnahmen generieren, und *wieviel* Mehreinnahmen das sind.
Wir können dann den Aufwand beim Engineering gegen den Gewinn abwägen.

Das geht nur im Haus. Das kann nicht outsourcen. Denn nur dann ist eine informale, enge Steuerung mit Umsetzungszeiten für Steuerungsinput im Bereich von Stunden möglich .
Tagen oder gar Wochen würden jede Form von Experimentierung scheitern lassen.

## Insourcing und Outsourcing vs. Marktreife und Prozeßreife 

Expertise im Haus ist wichtig, um beurteilen zu können, was Dienstleister machen. Dan Luu hat dazu einen [interessanten Artikel](https://danluu.com/in-house/) geschrieben.

Eigene Experten sind jedoch noch wichtiger, wenn man neue Dinge ausprobiert, und man deswegen das Projekt eng steuern muss.

![](/uploads/2021/10/go-away-1.jpg)

*Slideshare "[Go away or I will replace you with a very tiny shell script](https://www.slideshare.net/isotopp/go-away-or-i-will-replace-you-with-a-little-shell-script#12)", Marktreife und Prozeßreife*

Das ist auch alles kein Hexenwerk, sondern lange bekannt.

Wenn man neue, unerprobte Dinge macht, ist man im Chaotischen Quadranten des [Cynefin Models](https://en.wikipedia.org/wiki/Cynefin_framework) und macht Forschung.
Dazu braucht man eine kleine Gruppe von Experten, die sich darauf konzentriert, Regeln und Gesetzmäßigkeiten ("überhaupt Practice") zu finden. 

In der deutschen Pipeline ist das ein Uni-Projekt, in dem Professor/innen irgendwelche Ideen ausprobieren, von denen die Mehrheit auf irgendeine nicht offensichtliche Weise egal oder falsch ist.
Aber das herauszufinden ist genau Sinn der Sache: die Mehrheit dieser Versuche scheitert, genau wie wir beim Requirements Engineering 19 von 20 Experimenten im Test scheitern sehen.

"Complex" ist der Engineering-Quadrant, in der wir versuchen, als funktionierend bekannte Grundideen hoch zu skalieren, und in der Masse anwendbar zu machen.
Hier braucht es mehr als ein Team, mit einem der Theoretiker aus der vorigen Phase als Beratung und vielen Praktikern ("Ingenieuren") in den Teams, die immer noch so klein als möglich sein sollten.

Idealerweise hat man zwei oder drei konkurrierende Ansätze mit überlappenden Zielsetzungen, von denen dann hoffentlich einer diese Phase überlebt.
Aus dieser bekommt man dann einen Satz Handlungsanweisungen ("Wiederholbare Practice") und gute Ratschläge ("das da ist kritisch!"). Das kann man dann schrittweise Ausrollen und mit Feinkorrekturen in die Fläche bringen. 
Dabei kommen auch Dienstleister und deren Training ins Spiel.

![](/uploads/2021/10/go-away-2.jpg)

*Prozessreife: Ohne quantitative Metriken ist Outsourcing meist zum Scheitern verurteilt.*

Das geht halt aber erst genau dann, wenn man Prozesse *mit Metriken* hat.
Das bedeutet: wenn man Erfahrung hat, was man messen muß und wie - auf beiden Seiten der Vertragsgrenze.

Wenn der Prozeß noch nicht reif genug ist und man gar keine Metriken hat, ist Einigkeit zwischen Auftraggeber und -nehmer schwierig.
Dasselbe Problem hat man, wenn der Prozess noch zu schnell wächst, um ohne grundlegende Änderungen wiederholbar zu sein.

Wenn man - aus welchem Grund auch immer - solche Metriken nicht hat, oder nicht haben *kann*, weil es noch nicht so weit ist, dann *kann man nicht outsourcen*, also keinen Dienstleister verwenden.

Warum ist das so?

Weil man gar keine Grundlage hat, auf der beide Parteien beurteilen können, was verkauft und was geliefert worden ist, und ob das so okay ist.
Solange das Projekt oder Prozess-Produkt noch weich ist, weil es noch in der Forschungs- oder Engineering-Phase ist, kann man nicht richtig sinnvoll mit externer Expertise arbeiten, weil *niemand weiss wie es geht*.

Dann ist Expertise *im Haus* absolut notwendig.

## Blameless Postmortem

Christian Petrausch weist noch auf einen weiteren kritischen Baustein hin, der absolut zwingend notwendig ist, und der über Vertragsgrenzen hinweg nur sehr, sehr schwierig zu realisieren ist:

Blameless Postmortem.

Wenn irgendwo ein Flugzeug ein Unglück hat,
wenn irgendwo ein Patient verstirbt,
wenn irgendwo in einer gut geführten Softwarefirma eine Outage war, dann setzen sich alle Gruppen zusammen und versuchen herauszufinden, wie *der Prozess* defekt ist, der dazu geführt hat.

Die Annahme ist, daß alle Beteiligten mit den besten Absichten und im Rahmen ihrer Fähigkeiten und zum Zeitpunkt der Entscheidung verfügbaren Informationen gehandelt haben.

Wenn also die Produktion ausfällt, weil Du (aufgrund der Monitoringdaten, des Runbooks und Deiner Erfahrungen) angenommen hast, daß (A) der Fall war und deswegen (H) gemacht hast, aber in Wahrheit lag (B) vor und (H) hat alles gecrashed, ...

- dann ist es ein Problem, wenn die Monitoringdaten zu langsam aufbereitet worden sind,
- wenn nie alle wichtigen Dinge gemessen worden sind,
- wenn das Runbook unvollständig oder unklar ist, 
- oder wenn Du unzureichend ausgebildet worden bist.

Es ist außerdem zu prüfen, ob diese Entscheidung (H) zu machen überhaupt manuell zu treffen ist, und ob dann eine manuelle Handlung initiiert werden muss.

Kurz: Der Blameless Postmortem konzentriert sich nicht darauf, *wer* die Produktion gecrashed hat, sondern welche Kette von Entscheidungen dazu geführt hat, dass die gerade Dienst habende Person die Produktion crashen musste.

So eine Diskussion über die Grenzen von Firmen, Verträgen, Statements of Work und mögliche Schadensersatzforderungen durchzuführen ist nahezu unmöglich, oder jedenfalls im Haus sehr viel einfacher.

Wieder braucht es dazu aber auch in der öffentlichen Verwaltung eine andere Kultur:
einen grundlegendem Wandel, ein Bekenntnis zu Offenheit, Transparenz, Kooperation und Open Source.
Solange sich das nicht ändert, wird sich die Tragödie vom Scheitern der Digitalisierung in der deutschen Verwaltung wieder und wieder und wieder wiederholen.
