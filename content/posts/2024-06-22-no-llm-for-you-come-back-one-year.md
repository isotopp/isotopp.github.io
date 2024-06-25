---
author: isotopp
title: "No LLM for you, come back one year"
date: "2024-06-22T05:06:07Z"
feature-img: assets/img/background/rijksmuseum.jpg
toc: true
tags:
- lang_de
- erklaerbaer
- apple
- computer
---

Es war Samstag, ich las die Nachrichten und ich mußte dazu was im Fedi sagen.
Hier ist der Aufschrieb davon:

[No Soup for you!](https://www.youtube.com/watch?v=RqlQYBcsq54) ist, was Apple der EU sagt:
[Apple vs. EU: Apple Intelligence soll vorerst nicht nach Deutschland kommen](https://www.heise.de/news/Apple-verweist-auf-neue-Regeln-vorerst-keine-Apple-Intelligence-fuer-EU-iPhones-9774039.html)
> Aufgrund "regulatorischer Unsicherheiten" durch den Digital Markets Act (DMA) gehe das Unternehmen davon aus,
> bestimmte Funktionen in diesem Jahr nicht mehr für Kunden in Deutschland 
> und anderen EU-Mitgliedsstaaten einführen zu können, 
> wie Apple am Freitagabend überraschend in einer Stellungnahme mitteilte.

Dieser Seitenhieb auf den Marktregulator ist amüsant, 
aber Apple könnte "Apple Intelligence" nicht weltweit zeitgleich einführen, selbst wenn Apple das wollte.

# Keine Apple Intelligence in der EU

Der wahre Grund ist: Die Features sind unfertig.
Normalerweise liefern iOS Betaversionen relativ vollständige Blicke auf das Release,
alle Features sind vorhanden und funktionieren modulo noch existierende Fehler auf eine Weise, 
wie man sie im Produkt-Release später erwarten können wird.
[In der iOS 18 Beta ist das nicht der Fall.](https://www.lifewire.com/apple-betas-missing-cool-features-8662016)

> But this year, there's less incentive to hop on early because none of the AI tools are there,
> and those are surely the features people most want to try out.
> The Apple Intelligence features, like better Siri, won't be arriving until later,
> perhaps not until after the OS updates have actually launched in the fall.

Das ist einerseits so, weil diese Features nicht auf eine Weise funktionieren können, 
dass sie Apples Ansprüchen an Qualität genügen.
[McDonalds hat das schon mal ausprobiert.](https://techinformed.com/mcdonalds-ditches-ai-order-system-after-bacon-ice-cream-mix-up/)

> In one TikTok video –
> posted with the caption “Fighting with McDonald’s robot” –
> a woman is seen struggling to order vanilla ice cream and a bottle of water,
> and instead ends up with multiple sundaes, ketchup sachets, and two portions of butter.

Nun war das keine Apple-KI, aber diese Sorte Problem ist systematisch die Sorte Fehler, die LLMs machen,
und es gibt keinen Grund, warum es bei Apple besser sein sollte.

Und das ist nur die oberste Lage Probleme.
Ein wichtiger Werbepunkt von Apple ist, dass die KI-Features "on device" laufen, statt Daten in eine Cloud zu pumpen.
Das geht auch nicht, jedenfalls nicht so, wie der Kunde es erwartet.

Der aktuelle KI-Hype basiert auf LLMs,
einer besonderen Art neuronaler Netze, die unter anderem Milliarden von "Parametern" brauchen.
Das sind Haufen von Zahlen, die als Vektoren mit tausenden Dimensionen angeordnet "Wissen codieren"
und in der Berechnung von Antworten auf Benutzeranfragen verwendet werden.

Nun, jeder dieser Vektoren braucht eine gewisse Menge Speicherplatz und wenn man "Milliarden von Parametern" haben will,
dann braucht man schnell auch einmal zweistellige Mengen an Gigabyte RAM zum Ausrechnen der Antwort.

![](/uploads/2024/06/apple-01.png)

*Eine Auswahl von Größenangaben beliebter öffentlicher LLMs.*

![](/uploads/2024/06/apple-02.png)

*Standardversion von Metas llama3 mit 70 Milliarden Parametern und 40 GB Größe.*

Ein Modell mit 8 Milliarden Parametern braucht ca. 5 GB RAM, ein Modell mit 14 Milliarden Parametern ca. 8 GB,
und ein Modell mit 70 Milliarden Parametern je nach Quantisierung zwischen 26 GB und 40 GB.

Dazu kommt noch einmal Speicher für den Kontext, 
der bei großen Kontext-Definitionen schnell noch einmal die Größenordnung des Modells erreicht.

Apple selbst dokumentiert in 
[Introducing Apple’s On-Device and Server Foundation Models](https://machinelearning.apple.com/research/introducing-apple-foundation-models)
wann sie Modelle lokal rechnen:

> In the following overview, we will detail how two of these models — a ~3 billion parameter on-device language model,
> and a larger server-based language model available with Private Cloud Compute and running on Apple Silicon servers —
> have been built and adapted to perform specialized tasks efficiently, accurately, and responsibly.

Ein Modell mit 3 Milliarden Parametern wie [Phi3](https://ollama.com/library/phi3) belegt circa 2.5 GB Speicher und
das ist in der Tat eine Größe, die auf einem iPhone mit 6 GB RAM ausgeführt werden kann.
Größere Modelle passen schlicht nicht in den Speicher und werden daher in der Cloud berechnet.

Die Qualität und Komplexität der Antworten eines LLM ist aber sehr stark von der Anzahl der Parameter des Modells abhängig.
Ein 3b-Modell kann schlicht nicht mit einem 70b- oder gar noch größeren Modellen mithalten.
Das ist aber das, was Benutzer von Online-GPTs wie ChatGPT gewohnt sind.

Es ist also eher davon auszugehen, 
dass wenig Inferenz (das Ausrechnen von Antworten mit einem austrainierten LLM) "on device" geht, 
und viel in die Cloud ausgelagert wird.
Die Rechenzentren dazu gibt es noch nicht, und das Bauen von Rechenzentren dauert in der Regel einige Zeit.
Wir können davon ausgehen, dass die Vorlaufzeit circa 2 Jahre beträgt:
Das Rechenzentrum wird vermutlich sehr uniform bestückt sein, was die Planung vereinfacht.
Die Energiedichte wird sehr hoch sein, und die Hardware wird schwer zu beschaffen sein, was die Planung verkompliziert.

Die Hardware, die in dieses Rechenzentrum herein kann, wird derzeit meist von Nvidia hergestellt.
Wer Apple kennt, der weiß, wie sehr es die Firma schmerzt, einer Firma wie Nvidia Geld zu geben.
Viel lieber würde Apple den Kram auf eigenen, selbst entworfenen, auf Inferenz spezialisierten Chip laufen lassen.
Auch diese existieren nicht und es würde jedermann überraschen, 
wenn es solche Chips vor 2026 gäbe (oder nach 2028 noch nicht gäbe).

Wir können an dieser Stelle vermutlich glaubhaft herleiten, 
dass "Apple Intelligence" zu diesem Zeitpunkt lediglich lanciert wird, um den Kurs von AAPL zu stabilisieren.
Aber natürlich ist es billig, da noch einmal FOMO gegenüber Kunden in Europa zu pflegen und die EU zu dissen.

# Warum die Hardware und warum so viel Speicher?

Die lineare Algebra in Computerspielen und die Mathematik in LLMs sind zum Großteil Matrix-Multiplikationen.
Daher werden Grafikkarten, superschnelle Matrix-Multiplizierer, vielfach für LLMs "mißbraucht".
Sie implementieren die benötigte Operation sehr flink, in Hardware und parallel ausführbar.

[![](/uploads/2024/06/apple-03.jpg)](https://www.youtube.com/watch?v=-P28LKWTzrI)

*[Nvidia Werbevideo mit den Mythbusters](https://www.youtube.com/watch?v=-P28LKWTzrI),
das die Parallelität von Grafikkarten korrekt veranschaulicht.*

Die Mythbusters haben die Wirkmächtigkeit der parallelen Ausführung für ein Nvidia Werbevideo einmal korrekt visualisiert.

Zur Geschichte und dem Aufbau von Grafikkarten habe ich vor sieben Jahren einen Link-Artikel geschrieben:
[d = a*b+c at scale]({{< relref "/2017-11-25-d-abc-at-scale.md" >}}),
der die Entwicklung von Grafik-Hardware in den 20 Jahren vor 2017 beschreibt, 
weil ich beruflich Anlass hatte, das herauszufinden. 
Es ist ein Link-Artikel, ihr müßt die blauen Dinger auch anklicken.

Wikipedia erklärt 
[Matrix-Multiplikation als superlange Summe von Produkten](https://de.wikipedia.org/wiki/Matrizenmultiplikation#Beispiel).

![](/uploads/2024/06/apple-04.png)

*Relevanter Auszug aus der Wikipedia, der Matrix-Multiplikation erläutert.*

Wir berechnen die Position Zeile 1, Spalte 2 der Ergebnis-Matrix 
also durch Multiplikation des Zeilenvektors 1 der Matrix A 
mit dem Spaltenvektor 2 der Matrix B,
sodass sich im Beispiel

```console
(3, 2, 1) * (2, 1, 0) = (3*2 + 2*1 + 1*0) = 8
```

ergibt. In `d = a*b + c` ist die Zwischensumme `c` zunächst 0, und es wird `3*2` berechnet.
Das Ergebnis, `d = 6` wird im nächsten Schritt als `c` verwendet, sodass wir `d = 2*1 + 6` erhalten.
Im letzten Schritt wird dies wieder als `c` verwendet, sodass wir das Endergebnis `d = 1*0 + 8` bekommen.

Grafikkarten haben spezielle Hardware, die mit einer bestimmten Hardware-Darstellung von Zahlen solche Berechnungen
auf rechteckigen Zahlenfeldern beliebige Größe parallel durchführen können.
"NPUs", Neuralprozessoren, tun genau dasselbe.

In dem Unterrichtsabschnitt "Vektor- und Matrizenrechnung" in der Schule, 
oder gar in "Lineare Algebra und Vektorräume" an der Uni aufgepasst zu haben zahlt sich also jetzt, 
30 Jahre später, groß aus. 
Aber keine Angst, es hat sich nichts getan, die Mathematik ist immer noch dieselbe wie damals in der Schule,
und es ist nichts Fieseres dabei als Summen von Produkten: Plus und Malnehmen, komplizierter wird's nicht.

# KI und Grafikkarten laufen auseinander

Aber die Matrix-Multiplikation in einer NPU und in einer Grafikkarte laufen langsam auseinander.
Das hat aber nichts mit der Mathematik zu tun, sondern mit der Darstellung von Zahlen.

Wir können uns einmal Fließkommazahlen im Computer angucken:

[3.1415926 als Double (64 Bit)](https://float.exposed/0x400921fb4d12d84a): 
Stellt man eine beliebte Näherung der Zahl Pi als `double` dar, bekommt man dies:
- 1 Bit Vorzeichen
- 10 Bit Exponenten
- 53 Bit "Mantisse" oder "Significand"

und die Zahl ist nicht der gewünschte Wert, sondern der dichteste Wert, der dargestellt werden kann:
3.14159260000000006841.

Das ist einen Tick zu groß.
Klickt man den "Significand" jetzt ein Bit kleiner, bekommt man 
[3.14159259999999962432](https://float.exposed/0x400921fb4d12d849).

Das ist das Kreuz mit *diskreter Mathematik*: Zwischen den Zahlen, 
die wir darstellen können liegen unendlich viele Zahlen, die existieren, 
aber nicht diskret in der gewählten Auflösung darstellbar sind.

In der diskreten Mathematik gibt es eine Schrittweite zwischen zwei darstellbaren Fließkommazahlen.
Diese nennt man "eps".

"epsilon" ist in der Analysis (eine Disziplin der Mathematik) ein unendlich kleiner Schritt. 
In der diskreten Mathematik, also der Mathematik, die sich mit Zahlen in Computern befasst,
gibt es keine unendlich kleinen Schritte.

"eps" ist der Schritt, den ein Bit macht.
Bei Fließkommazahlen ist "eps" variabel, denn es wird mit dem anderen Teil der Fließkommazahl, dem Exponenten skaliert.
Zahlen um 0 herum können sehr genau dargestellt werden, 
aber je weiter man von 0 weg kommt, umso größer wird der Exponent und umso größer wird eps.

In KI-Mathematik normalisieren wir Zahlen oft auf das Intervall von 0 bis 1
oder von -1 bis 1.
Wir brauchen also nicht so große Exponenten und können mit weniger Bits auskommen.

Das ist wichtig, denn wenn wir von `double` auf `float` heruntergehen,
dann gehen wir von 64 Bit pro Zahl auf 32 Bit runter – doppelt so viel Modell im selben Speicher!
Ein 32-Bit `float` hat bei Werten um Zehntausend herum schon ein eps von 0.01 (bei 10k Euro ein eps von 1 cent).

[10000.009765625](https://float.exposed/0x461c400a) als `float`.

Aber für Werte zwischen 0 und 1 sieht es gut aus:
[0.5](https://float.exposed/0x3f000000) und am Significand spielen.

Wir können auch noch weiter heruntergehen:
[0.5](https://float.exposed/b0x3f00) als `bfloat16`.
Das belegt noch einmal halb so viel Speicher, 16 Bit, verbrennt aber zu viele Bits auf den Exponenten:

- 1 Bit Vorzeichen
- 8 Bit Exponent
- 7 Bit auf die "Mantisse", den "Significand"

Wir können auch das 16-Bit `half` nehmen:
[0.5](https://float.exposed/0x3800).

Hier werden 

- 1 Bit Vorzeichen
- 5 Bit Exponent
- 10 Bit Significand

verwendet. Je nach Anwendungsfall kann das vorteilhaft sein.

Ist es schlimm, ein LLM mit weniger Auflösung zu trainieren oder zu benutzen?
Artikel über "Quantisierung" von LLMs diskutieren das, und auch *wann* im Herstellungsprozeß das Modell eingekürzt wird.

- [What is Quantization in LLM](https://medium.com/@techresearchspace/what-is-quantization-in-llm-01ba61968a51) 
  diskutiert ganz allgemein was Quantisierung bei LLMs ist – also mit welchen Zahlen beim Training gerechnet wird 
  und wann auf Auslieferungs-Zahlenformat umgerechnet wird.
- [A Guide to Quanitization in LLMs](https://symbl.ai/developers/blog/a-guide-to-quantization-in-llms/)
  erklärt dasselbe, aber mit mehr Details betreffend die Integer-Formate, also `Qx_y`, die man oft sieht.

Quantisierung hat mitunter Auswirkungen auf die Qualität der Antworten, die das LLM generiert, 
aber sie spart Speicher und ermöglicht oft erst die Ausführung von LLMs auf Rechnern, 
die man im Haus oder gar in der Hand hat.

Wenn man zig Milliarden Parameter in den verfügbaren Speicher einer Nvidia 4070 Ti quetschen will,
dann braucht man nun einmal kürzere Zahlendarstellungen.
Und wenn es im iPhone passieren soll, dann noch kürzer.

Damit man von der Beschleunigung einer Nvidia profitiert kann man aber nur Darstellungen nehmen,
die die Nvidia kennt, also in Hardware beschleunigt parallel rechnen kann.
Sonst kann man auch "zu Fuß", also mit der CPU, rechnen.

Das ist das Problem mit dem M1 Apple Silicon, das `bfloat16` nicht in Hardware kann, und das ab M2 korrigiert ist.
Ich würde erwarten, dass neuere Apple CPUs auch andere, noch härtere Quantisierungen parallel in Hardware rechnen können,
aber ich habe nicht nachgesehen, was ab wann das wie realisiert wird.

# Qualität von kleinen LLMs

Apple behauptet, dass ihre 3B Modelle in Benchmarks besser sind als die Konkurrenz:
[Introducing Apple’s On-Device and Server Foundation Models](https://machinelearning.apple.com/research/introducing-apple-foundation-models),
die Benchmarks am Ende.

Aber 3 Milliarden Parameter sind sehr klein.
Das ist jedoch das, was Apple lokal rechnen kann.
Größere Modelle werden "in der Cloud" ausgeführt, wo mehr Speicher verfügbar ist.

Benchmarks bei KI-Anwendungen sind jedoch wenig aussagekräftig, damit ein Endkunde Qualität beurteilen kann. 
Sie vergleichen Antworten verschiedener Modelle miteinander, aber die Ergebnisse sind nicht so,
wie ein Mensch Qualität erfahren würde.
Das liegt daran, dass Menschen Antworten von Computern nehmen, um ihre eigenen Entscheidungen zu treffen,
oder um sie mit ihren eigenen Entscheidungen zu vergleichen.

Menschen haben aber ein Weltmodell.

Das heißt im Wesentlichen, dass an jeder Entscheidung eine Gewichtung für Fehlschlag und Erfolg hängt,
eine Risikobewertung. 
Eine falsche Antwort und eine andere, ebenfalls falsche Antwort sind für einen Menschen also nicht gleich: 
Bei einer würde er eine kleine Summe Geld verlieren, bei der anderen sterben.
Im Benchmark aber sind beide gleich "falsch".

Der Effekt ist, dass ein schlechtes Modell im Benchmark in der Realität eventuell als besser empfunden werden kann,
weil es nie mörderische Antworten liefert.

# Apple mit mehr RAM

Wenig überraschend beginnt Apple nun Rechner mit mehr RAM zu bauen,
oder für LLM-Features Geräte mit mehr RAM zu verlangen:

[Golem: 8 GByte RAM im Macbook reichen nicht mehr](https://www.golem.de/news/apple-8-gbyte-ram-im-macbook-reichen-nicht-mehr-2406-186433.html)

> Das Unternehmen stellte die Beta der Entwicklungsumgebung XCode 16 vor.
> In ihr enthalten ist ein neues Feature: Predictive Code Completion: 
> Diese nutzt KI, um Codeschnipsel zu analysieren und passende Vorschläge in Echtzeit auszugeben.
> Allerdings wird dafür laut Apple ein Mac mit mindestens 16 GByte Arbeitsspeicher benötigt.
