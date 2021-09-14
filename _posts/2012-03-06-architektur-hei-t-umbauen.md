---
layout: post
published: true
title: Architektur heißt umbauen
author-id: isotopp
date: 2012-03-06 13:42:47 UTC
tags:
- computer
- development
- enterprise
- software
- lang_de
feature-img: assets/img/background/rijksmuseum.jpg
---
![Theatre of Marcellus](/uploads/Architekturheisstumbauen.jpg)

[Teatro di Marcello](https://en.wikipedia.org/wiki/Theatre_of_Marcellus), Rom

Das auf dem Bild da ist das Theater des Marcellus, in Rom.  Das Foto habe
ich Anfang 2006 aufgenommen, als ich dienstlich bei einem Kunden ganz in der
Nähe war.

Das Marcellustheater ist nach Marcus Marcellus benannt, einem Neffen von
Kaiser Augustus, und wurde so um 13 vor Christus fertig gestellt.  Es ist
später verfallen, dann im Mittelalter als Festung genutzt worden, im 16. 
Jahrhundert dann in eine Palastresidenz umgewandelt worden.  Heute besteht
der obere Teil aus einer Reihe von Appartments und unten werden im Sommer
diverse Konzerte aufgeführt.

![Umgebaute Umbauten](/uploads/Architekturheisstumbauen2.jpg)

Bei der Ausbildung von Software-Ingenieuren, und wahrscheinlich auch bei der
Ausbildung von Architekten, machen wir jungen Leuten falsche Hoffnungen. 
Bei den Software-Ingenieuren bin ich mir sogar ziemlich sicher.

Wir erzählen diesen Leuten an der Uni, daß sie Technik zum Ausprobieren
bekommen werden oder Wahlfreiheit haben werden in den Mitteln und Methoden,
die sie einsetzen werden.  Und wir machen Ihnen Hoffnung, daß sie neuen Code
schreiben werden.  Später, wenn diese Personen von der Uni abgehen, landen
sie in einer Umgebung, die erstens eine Technik und die Best Practice zu
ihrem Einsatz genau definiert und die zweitens einen Haufen existierenden
Code hat, der läuft und Geld verdient, aber der zu verändern oder zu
erweitern ist.

Das erzeugt bei diesen Menschen enorme Umstellungsprobleme, denn sie kommen
mit vollkommen falschen Erwartungshaltungen in den Beruf, ja, in vielen
Fällen fehlen ihnen sogar Methodiken, die für das Überleben im ersten Job
essentiell sind.

Darum will ich es hier einmal ganz offen sagen:

Junger Informatiker, hoffnungsvolle Uni-Abgängerin!

Hier ist, was Dich in Deinem Beruf erwartet: 

Du wirst mit altem Code zu tun haben, der offensichtliche Schwächen hat.  Du
wirst mit Werkzeugen und Umgebungen arbeiten müssen, die Deiner Meinung nach
nicht Stand der Technik sind.  Eine Deiner Hauptaufgaben wird sein, den
alten Code zu refaktorieren.  Dabei wird die Zeit nicht reichen, diese
Aufgabe zu Ende zu führen.  Du wirst die Versuchung verspüren, den alten
Kram wegzuwerfen und auf der grünen Wiese neu anzufangen.

Die schlechte Nachricht: 

Weder wirst Du jemals auf der grünen Wiese neu anfangen dürfen, noch würde
es viel helfen, das zu tun.  Der komplizierte Code-Wirrwarr, mit dem Du es
zu tun hast, ist häßlich und besteht aus einem Haufen ekeliger Sonderfälle. 
Wenn Du auf der grünen Wiese neu anfängst, wirst Du ein Design haben, das
die Hauptfälle in einem schönen Modell abdeckt, und an den Sonderfällen
umfassend versagt.

Du wirst sie schrittweise nachrüsten wollen, und Du endest mit einem
Drahtverhau von vergleichbarer Komplexität zu dem, den Du jetzt hast.  Das
ist normal.  Denn der Code, mit dem Du es zu tun hast, wurde wahrscheinlich
nicht von sabbernden Idioten geschrieben, sondern von Leuten wie Dir, und er
war am Anfang genau wie Dein Code: Klar und einfach.

Dann traf er auf eine Realität, die alles ist, aber weder klar noch einfach. 
Heute ist er ein halbwegs korrektes Modell der Realität.  Und weit mehr als
die Hälfte des unübersichtlichen Designs mit dem Du es zu tun hast, ist
wahrscheinlich nicht auf die Unfähigkeit Deiner Vorgänger zurück zu führen,
sondern auf die Tatsache, daß die Realität nun einmal leider eine Ansammlung
von häßlichen Ausnahmen ist, die alle mit modelliert sein wollen.

Die gute Nachricht:

Es ist gar nicht notwendig, schönen Code zu bauen.  Anders als Dein
Universitätsprofessor verlangt Dein Arbeitgeber nicht, daß Dein Code
minimal, elegant, beweisbar oder sonstwie ist.  Das einzige Kriterium ist,
ob er den Job getan bekommt.  Genau genommen ist das Kriterium sogar, ob er
den Job gut genug getan bekommt.  Sobald die Kosten in zusätzlicher
Hardware, Kundensupport oder manueller Nachbearbeitung geringer sind, als
die Arbeitszeit, die Dein Team benötigt, um die letzten Warzen abzuschaben,
wirst Du aufhören können.  Sogar müssen, denn Du bist nicht mehr rentabel
und Deine Arbeit dient keinem betrieblichen Ziel.

Die schlechte Nachricht, die daraus folgt: 

Befriedigung in gutem Handwerk zu finden wird für Dich vermutlich schwierig,
denn gutes Handwerk ist illegal.  Befriedigung in Closure zu finden, darin,
Sachen wirklich ganz und gar zu Ende zu bringen, full circle zu kommen, wird
auch schwierig.  Denn das ist vermutlich auch illegal, und es wird keine
Zeit dafür sein, denn so eine Pickliste mit Aufgaben ist nach unten offen. 
Du wirst stattdessen vermutlich Gutes im Vorbeigehen tun müssen, also hier
in diesem oder jenem Projekt einen Teil mit anfassen müssen, der eigentlich
nicht strikt hätte angefaßt werden müssen, es aber verdient hat und außerdem
waren ja noch Stunden übrig.

Die frustrierende Nachricht: 

Bei vielem Code, den Du schreibst, wird Deinen Auftraggebern am Anfang noch
nicht klar sein, ob das, was der Code machen wird, am Ende das
Geschäftsmodell tatsächlich verbessern wird.  Du weißt aus dem Open Source
Umfeld schon, daß die goldene Regel lautet: 
[Release Early, Release Often!](https://en.wikipedia.org/wiki/Release_early,_release_often).

Du solltest Dir vor Augen führen, daß das nicht nur für Dich und Dein
Scrum-Team gilt, sondern auch für Deinen Product Owner: In den weitaus
meisten Fällen hat er keine Ahnung, ob seine Idee 
[gut für die Firma](https://www.youtube.com/watch?v=xEs67tv401o#t=26)
ist oder sich am Ende schädlich auswirken wird.  Wenn das der Fall ist, ist
die einzig logische Aktivität, diesen Code wieder aus der Produktion zu
nehmen und zu verschrotten - Du hast dann für den Papierkorb entwickelt.

Daher ist es wichtig, viele Ideen eines PO erst einmal sehr roh zu
implementieren und dann in der Realität zu testen, ob sie überhaupt auf der
Business-Ebene funktionieren.  Erst dann, wenn sicher gestellt ist, daß Code
business-positive ist, lohnt es überhaupt, die Sache noch einmal zu
reimplementieren oder refaktorieren auf eine Weise, die den Ansprüchen eines
ausgebildeten Informatikers würdig ist.  Weit mehr als 90% der Ideen Deines
PO sind blöder Scheiß und verdienen den Tod durch Patch Revert.  Es lohnt
also nicht, große architekturelle Zuckerbäckereien auszuarbeiten, solange
nicht bekannt ist, ob die Idee dahinter überhaupt in der Lage ist, den Lohn
für Dich und Dein Team zu verdienen.

In dieser Phase - dem experimentellen Verifizieren der Requirements - ist
die einzige Metrik, wie viele Ideen und Varianten in möglichst kurzer Zeit
Dein Team released bekommt, egal wie schlecht, ineffizient oder kaputt Dein
Code ist.  Erst später, wenn Dein PO nicht nur glaubt zu wissen, was er
will, sondern belastbare Zahlen hat, die beweisen, daß das was er will auch
von der Firma gewollt werden kann, erst dann kannst Du Deine
Ingeniersausbildung auspacken und sauber arbeiten.

So, jetzt ist es heraus.

Eine der Aufgaben, die eine Firma lösen muß, wenn sie junge
Informatikerinnen und Uni-Abgänger einstellt, ist sie zu deprogrammieren. 
Ihnen die Flausen aus dem Kopf zu pusten, die ihnen das Uni-Studium in den
Kopf gesetzt hat.  Sie mit den Realitäten der Welt vertraut zu machen.  Und
sie zu lehren, daß so wenig wie die wenigsten Städteplaner und
Landschaftsarchitekten mit einem leeren Plan anfangen können, die wenigsten
Softwarearchitekten und Entwickler mit einem leeren Editor starten.

Hier sind die wichtigsten Fähigkeiten für einen Softwareentwickler:

- Man kann ihn mit einer Bugnummer über unbekannten Code abwerfen, und auf
  dem Weg nach unten erkennt er schon im Flug, was da kaputt ist.  Wenn er
  gelandet ist, klärt er den Bug und während der Exfiltration macht er die
  Gegend um seinen Weg nach draußen auch noch schön.
- Er kann existierenden Code zu umbauen, daß der Code nach der Operation
  schöner, schneller und funktionaler ist als vorher und die neuen
  Anforderungen erfüllt.  Dabei ist während jeder einzigen Sekunde der
  Umbauphase (jeder Zwischencommit und jedes Zwischenrollout) in sich
  lauffähig und korrekt, und die Datenformate sind kompatibel, sodaß keine
  Betriebsunterbrechung für den Endnutzer sichtbar wird und man geschmeidig
  zwischen den Versionen vor und zurück rollen kann.
- Er akzeptiert, daß Code ein Modell der Welt ist und daß sie Welt nicht
  schön, elegant oder minimal ist, sondern dreckig, irregulär und
  überkomplex.  Und er kommt damit klar.

Das Bild von dem Teatro di Marcello da oben illustriert das ganz gut. 

Gebaut vor mehr 2000 Jahren zu einem ganz anderen Zweck, ist es aufgelassen,
umgebaut, umgewidmet, modernisiert, renoviert und restauriert worden, und
wurde die meiste Zeit seiner Lebensdauer von Leuten genutzt.  Nichts an
diesem Gebäude ist so wie es sein soll, nichts an diesem Gebäude wird so
genutzt wie es einmal geplant war.  Nichts an der Stadt in der es steht ist
so.

Dennoch ist dieser Ort voller Menschen, die dort leben und sich dort wohl
fühlen.

Informatik ist genau so.

(Weil towo danach gefragt hat)
