---
author: isotopp
date: "2026-10-12T01:02:03Z"
feature-img: assets/img/background/rijksmuseum.jpg
title: "Exponentielles Wachstum hat eine Bremse"
toc: true
katex: true
tags:
  - lang_de
  - erklaerbaer
  - mathematik
---

Wir reden oft von exponentiellem Wachstum:
bei Covid, beim Wachstum eines Startups zum Weltkonzern, beim Wechsel vom Verbrenner zum Elektroauto.
Das sind nur drei Beispiele.

Die Welt ist endlich.
Menschen, Nahrung, Energie, Rohstoffe, Kunden und deren Geld begrenzen das Wachstum.
Wir wissen nicht immer, wo die Grenze liegt.
Das erschwert die Prognose, hebt die Grenze aber nicht auf.

Als Modell für den gesamten Verlauf greift die Exponentialkurve deshalb meist zu kurz.
Sie kennt keine Grenze.

**Die logistische S-Kurve beschreibt exponentielles Wachstum mit einer Bremse.**

Bei solchen Prozessen sollten wir mit der S-Kurve anfangen.
Sie enthält dieselbe Selbstverstärkung und zusätzlich eine Sättigungsbremse.
So fragen wir von Anfang an nach der Grenze, bevor die Prognose an ihr scheitert.

# Wachstum ohne Bremse

Exponentielles Wachstum heißt: Der Zuwachs ist proportional zu dem, was schon da ist.
Mehr Bakterien erzeugen mehr Nachkommen.
Mehr Infizierte können mehr Menschen anstecken.
Mehr Kunden können weitere Kunden anwerben.

Wir nennen die vorhandene Menge N, die Zeit t und die relative Wachstumsrate r.
Die Differentialgleichung lautet:

$$
\frac{dN}{dt}=rN.
$$

Links steht die Änderung der Menge pro Zeiteinheit.
Rechts steht: vorhandene Menge mal Wachstumsrate.
Die Lösung ist:

$$
N(t)=N_0 e^{rt}.
$$

N₀ ist die Menge am Anfang, bei t = 0.
Bleibt r konstant und positiv, bleibt auch die Verdopplungszeit konstant:

$$
T_2=\frac{\ln 2}{r}.
$$

Aus 10 werden 20, aus 20 werden 40, dann 80 und 160.
Jede Verdopplung dauert gleich lange.
Der Zuwachs pro Zeiteinheit wird immer größer.

Die Gleichung enthält keine Grenze durch Nahrung, Platz oder Kunden.
Der Bestand wächst unbegrenzt weiter.
Deshalb taugt die Gleichung nicht als Modell für den gesamten Verlauf eines begrenzten Wachstumsprozesses.

# Wachstum mit Bremse

Wir ergänzen eine Grenze K.
Bei Tieren ist das die Anzahl, die der Lebensraum ernähren kann.
Bei einem Unternehmen kann es die Größe des erreichbaren Marktes sein.

Das einfachste Modell läßt die relative Wachstumsrate sinken, je näher der Bestand der Grenze kommt:

$$
\frac{dN}{dt}=rN\left(1-\frac{N}{K}\right).
$$

Das ist die **logistische Differentialgleichung**.
Die Exponentialgleichung hat einen zusätzlichen Faktor bekommen: die Bremse.

Bei N = 0 ist der Faktor eins.
Bei N = K ist er null.
Dazwischen sinkt er linear mit dem Bestand.
Wir beginnen mit einem Bestand zwischen null und K.

Die Lösung lautet:

$$
N(t)=\frac{K}{1+A e^{-rt}},
\qquad
A=\frac{K-N_0}{N_0}.
$$

Das ist die logistische Kurve, eine S-Kurve.
Sie wächst zuerst immer schneller, dann immer langsamer und nähert sich der Grenze K an.

Nicht jede S-Kurve ist logistisch.
An der logistischen Kurve läßt sich das Prinzip einfach erklären: **Selbstverstärkung mit Sättigungsbremse.**

# Am Anfang sieht man die Bremse nicht

Wenn N klein gegenüber K ist, ist N/K klein und der Faktor 1 − N/K nahe eins.
Die logistische Gleichung wird dann näherungsweise zur Exponentialgleichung:

$$
N\ll K
\quad\Longrightarrow\quad
\frac{dN}{dt}\approx rN.
$$

Deswegen sieht der Anfang exponentiell aus.
Die Grenze wirkt schon, aber ihr Einfluß ist noch klein.

Bei einem Prozent der Kapazität bleiben 99 Prozent der ungebremsten Wachstumsrate übrig.
Sie sinkt linear mit dem Anteil der genutzten Kapazität:
Bei zehn Prozent sind es noch 90 Prozent,
bei halber Kapazität nur noch 50 Prozent.

| Bestand als Anteil von K | Verbleibender Wachstumsfaktor |
| --- | --- |
| 1 % | 0,99 |
| 10 % | 0,90 |
| 25 % | 0,75 |
| 50 % | 0,50 |
| 90 % | 0,10 |
| 99 % | 0,01 |

Die untere Hälfte der S-Kurve ist also nicht durchgehend exponentiell.
Am Anfang können wir sie durch eine Exponentialkurve annähern.
Wir sprechen dann von „exponentiellem Wachstum“, weil wir die Bremse noch nicht erkennen.
Vorschnell wird das, wenn wir die frühe Wachstumsrate auf den gesamten Verlauf übertragen.

<p class="md__image"><a href="wachstum.svg"><img src="wachstum.svg" alt="Exponentielles und logistisches Wachstum mit linearen y-Achsen und unterschiedlichen Wertebereichen, nebeneinander." /></a></p>

*Zwei Modelle mit N₀ = 10, derselben anfänglichen Steigung und derselben Zeitachse.
Links exponentielles Wachstum, rechts logistisches Wachstum mit K = 1.000.
Beide y-Achsen sind linear, haben aber unterschiedliche Wertebereiche.
Die Zahlen sind ein Rechenbeispiel, keine Messdaten.*

Wir zeigen die Kurven in getrennten Diagrammen.
Die S-Kurve bleibt unter 1.000, die Exponentialkurve wächst unbegrenzt.
Auf einer gemeinsamen linearen Skala drückt die Exponentialkurve die S-Kurve zusammen, bis man deren Form nicht mehr erkennt.

Hier sehen wir beide Formen:
links die immer steiler werdende Exponentialkurve,
rechts die S-Kurve mit Wendepunkt und Sättigung.
Die Wertebereiche der y-Achsen unterscheiden sich: Wir vergleichen die Formen, nicht die Höhen im Bild.

Für die logistische Kurve wählen wir r = 0,8 pro Zeiteinheit.
Damit beide Modelle am Anfang genau dieselbe Steigung haben,
bekommt die Exponentialkurve die Rate:

$$
r_{\mathrm{exp}}=r\left(1-\frac{N_0}{K}\right)=0{,}792.
$$

Nach zehn Zeiteinheiten liegt die Exponentialkurve bei rund 27.500,
die logistische bei rund 968 und einer Grenze von K = 1.000.

Beide Kurven beginnen gleich und weichen dann schnell voneinander ab.

# Bremse von Anfang an

Der Bremsfaktor $1-N/K$ ändert sich linear mit dem Bestand.
Wir unterscheiden die relative Wachstumsrate und den absoluten Zuwachs.

Die relative Wachstumsrate ist der Zuwachs geteilt durch die vorhandene Menge:

$$
\frac{1}{N}\frac{dN}{dt}=r\left(1-\frac{N}{K}\right).
$$

Sie fällt von Anfang an.
Bei festem K wird die Bremse mit jedem weiteren Stück stärker.

Der absolute Zuwachs ist dagegen:

$$
\frac{dN}{dt}=rN\left(1-\frac{N}{K}\right).
$$

Am Anfang überwiegt der wachsende Bestand die zunehmende Bremse.
Der absolute Zuwachs steigt, obwohl die relative Wachstumsrate schon sinkt.

Bei N = K/2 erreicht der absolute Zuwachs sein Maximum:

$$
\left.\frac{dN}{dt}\right|_{N=K/2}=\frac{rK}{4}.
$$

Das ist der Wendepunkt der S-Kurve.
Danach wächst der Bestand weiter, aber der Zuwachs pro Zeiteinheit wird kleiner.

<p class="md__image"><a href="bremse.svg"><img src="bremse.svg" alt="Relative Wachstumsrate und absoluter Zuwachs als Funktionen der ausgeschöpften Kapazität." /></a></p>

*Links die relative Wachstumsrate, rechts der absolute Zuwachs.
Für $r = 0{,}8$ fällt die relative Wachstumsrate $r(1-N/K)$ linear von $0{,}8$ auf null.*

*Der absolute Zuwachs steigt bis zur halben Kapazität und fällt erst danach.
Für r = 0,8 und K = 1.000 beträgt sein Maximum 200 Einheiten pro Zeiteinheit.*

**Die Bremse gewinnt am Wendepunkt ein gegen die Selbstverstärkung.**

# Die Grenze gehört ins Modell

Bei Covid zeigten [die Daten](https://doi.org/10.1073/pnas.2006520117) näherungsweise exponentielles Wachstum in frühen Ausbreitungsphasen.
Die endliche Bevölkerung widerlegt diese Beobachtung nicht.
Sie begrenzt den Zeitraum, für den man die Wachstumsrate fortschreiben kann.

Aber Menschen werden immun, Kontakte ändern sich, Menschen ziehen zu, Varianten verändern die Bedingungen.
Entscheidend ist, wie viele Menschen das Virus unter diesen Bedingungen noch infizieren kann.
Außerdem muß man sagen, ob man Neuinfektionen, aktuell Infizierte oder die Summe aller bisherigen Infektionen zeichnet.
Bei einer einzelnen Welle steigen und fallen die täglichen Neuinfektionen; eine S-Kurve zeigt diesen Verlauf nicht.

Beim Startup können Umsatz, Kunden und Kapital einander verstärken.
Aber die Zahl der erreichbaren Kunden und ihr Geld sind begrenzt.
Ein neuer Markt verschiebt diese Grenze.
Ein Konkurrent kann sie wieder verkleinern.

Bei Elektroautos kann man den Anteil an den Neuzulassungen betrachten, den Anteil am Fahrzeugbestand oder die Zahl der Fahrzeuge.
Das sind verschiedene Größen und verschiedene Kurven.
Ein Anteil endet spätestens bei 100 Prozent.
Die Zahl der Autos hängt außerdem davon ab, wie viele Menschen überhaupt ein Auto brauchen,
sich eines leisten können
und welche anderen Mobilitätsangebote es gibt.

Preise, Ladenetz, Angebot und Erfahrungen anderer Nutzer beeinflussen die Verbreitung von Elektroautos.
[Modelle zur Verbreitung von Elektroautos](https://www.nature.com/articles/s41467-025-66072-5) berücksichtigen deshalb mehr als eine einfache logistische Gleichung.

Das ist alles komplizierter als eine feste Zahl K.
Aber es ist kein Argument dafür, die Bremse aus dem Modell zu streichen.

# Eine unbekannte Grenze bleibt eine Grenze

Wir können eine veränderliche Grenze als K(t) schreiben:

$$
\frac{dN}{dt}=rN\left(1-\frac{N}{K(t)}\right).
$$

Auch r kann sich ändern.
Dann haben wir weiterhin Selbstverstärkung mit einer Sättigungsbremse, aber nicht mehr zwingend die logistische S-Kurve mit fester Grenze.

Aus dem Anfang der Kurve können wir die Grenze oft noch nicht bestimmen.
Solange N klein gegenüber K ist, sehen sehr unterschiedliche Grenzen im frühen Verlauf fast gleich aus.
Ein Modell, das die ersten Daten gut beschreibt, muß deshalb nicht den weiteren Verlauf gut vorhersagen.

Ob ein System seine Grenze erreicht, überschreitet oder zusammenbricht, ist eine andere Frage.
Dafür muß das Modell weitere Vorgänge beschreiben.
Hier geht es darum, die Wachstumsgrenze von Anfang an zu berücksichtigen.

**Bei selbstverstärkendem Wachstum in begrenzten Systemen gehört die S-Kurve an den Anfang.**
Die Exponentialkurve beschreibt den Anfang, solange die Bremse kaum wirkt.

Wer „exponentiell“ sagt, sollte gleich beantworten: Was begrenzt dieses Wachstum?
„Wissen wir noch nicht“ ist eine brauchbare Antwort.
„Kommt in unserem Modell nicht vor“ ist ein Fehler.
