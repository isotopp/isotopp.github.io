---
author: isotopp
date: "2026-09-27T01:02:03Z"
feature-img: assets/img/background/rijksmuseum.jpg
title: "Kein stochastischer Papagei"
toc: true
tags:
  - lang_de
  - ai
  - llm
  - software engineering
  - erklaerbaer
---

„Ein LLM ist ein stochastischer Papagei“ heißt heute meistens: Der Prompt triggert Gelerntes, und das Modell gibt Trainingsdaten in anderer Form wieder. Es kann umformulieren, aber nichts Wesentliches abstrahieren und kein bekanntes Verfahren auf einen neuen Fall anwenden.

Das ist eine klare Behauptung über die **Leistung** des Modells. Sie ist falsch.

Der Ausdruck stammt aus [*On the Dangers of Stochastic Parrots* von Bender und anderen](https://www.research.pitt.edu/sites/default/files/on_the_dangers_of_stochastic_parrots_-_can_language_models_be_too_big.pdf). Dort bedeutet er etwas anderes: Sprachmodelle setzen sprachliche Formen nach statistischen Mustern zusammen, ohne selbst eine Mitteilungsabsicht oder einen Bezug zur Bedeutung der Worte zu haben.

Kurz: **Das Modell erzeugt Sprache, aber es meint nichts damit.**

Der Aufsatz warnt außerdem vor undokumentierten Trainingsdaten, übernommenen Vorurteilen, Umweltkosten und der Neigung von Menschen, plausiblen Text für eine Äußerung mit verantwortlichem Sprecher zu halten. [Bender beschreibt selbst](https://medium.com/@emilymenonbender/stochastic-parrots-frequently-unasked-questions-49c2e7d22d11), wie sich die Verwendung des Ausdrucks vom Paper gelöst hat.

Ein Modell kann eine Aufgabe lösen, ohne dabei etwas mitteilen zu *wollen*. Darum entscheidet Benders These noch nicht, ob das Modell mehr als Gelerntes reproduzieren kann. Dafür brauchen wir einen Maßstab: Welche Arten von Aufgaben gibt es, und was muß bei einer gelungenen Lösung tatsächlich geleistet werden?

# Vier Arten von Aufgaben

Der Deutsche Bildungsrat unterschied 1970 vier Lernzielstufen: **Reproduktion**, **Reorganisation**, **Transfer** und **problemlösendes beziehungsweise entdeckendes Denken**. Grob: Bekanntes wiedergeben; Bekanntes selbständig ordnen und verknüpfen; Gelerntes auf einen neuen Fall übertragen; für eine nicht routinemäßige Lage einen Lösungsweg entwickeln. Die deutschen Prüfungsanforderungen fassen das später zu drei **Anforderungsbereichen** zusammen: AFB I für Reproduktion, AFB II für Reorganisation und Transfer, AFB III für Reflexion, Problemlösung und Bewertung. Die [KMK beschreibt diese Bereiche](https://www.kmk.org/fileadmin/veroeffentlichungen_beschluesse/1989/1989_12_01-EPA-Biologie.pdf) fachspezifisch; die Zuordnung ist kein mechanischer Wörterbuch-Lookup nach Aufgabenoperatoren.

Die deutsche Einteilung geht auf Arbeiten von Bloom aus dem Jahr 1956 zurück. Bloom ordnete Lernziele nach kognitiven Anforderungen. Die [Revision von Anderson und Krathwohl von 2001](https://www.bu.edu/provost/files/2013/10/Anderson-Krathwohl-Revision-to-Blooms-Taxonomy-of-Educational-Objectives.pdf) trennt zwei Dimensionen:

- **Was für Wissen?** Faktenwissen, begriffliches Wissen, Verfahrenswissen oder metakognitives Wissen.
- **Was damit tun?** Remember, Understand, Apply, Analyze, Evaluate oder Create.

Das ist ein wichtiger Unterschied. „Wende ein Verfahren an“ sagt noch nicht, ob Fakten, ein Begriffssystem oder ein Verfahren selbst Gegenstand der Aufgabe sind. Und eine Aufgabe kann mehrere dieser Prozesse verlangen.

Ein anderes Modell ist [Webbs Depth of Knowledge](https://www.education.ky.gov/AA/Reports/Documents/2016-17%20K-PREP%20Technical%20Manual%2020180614.pdf). Es fragt nach der für die Lösung nötigen Denktiefe: DOK 1 ist Recall and Reproduction, DOK 2 Skills and Concepts, DOK 3 Strategic Thinking und DOK 4 Extended Thinking. Eine lange Aufgabe ist deshalb nicht automatisch DOK 4. Entscheidend ist, ob über mehrere Schritte Informationen integriert, Entscheidungen begründet und Erkenntnisse übertragen werden müssen.

Schließlich schaut die [SOLO-Taxonomie von Biggs und Collis](https://doi.org/10.1177/000494418202600104) auf die *Struktur der beobachteten Antwort*: prestructural, unistructural, multistructural, relational und extended abstract. Nennt eine Antwort einen relevanten Aspekt, mehrere isolierte Aspekte, oder verbindet sie diese zu einem tragfähigen Ganzen? Kann sie das Ganze anschließend verallgemeinern?

Diese Systeme beschreiben Unterschiedliches. AFB, Bloom und DOK helfen, Anforderungen an eine Aufgabe zu charakterisieren. SOLO hilft, die Qualität einer konkreten Antwort zu beurteilen. Keines davon ist ein Intelligenzquotient für ein Modell.

| Aufgabe | AFB | Revised Bloom | ungefähr DOK |
| --- | --- | --- | --- |
| Definition wiedergeben | I | Remember | 1 |
| Sachverhalt in eigenen Worten erklären | II, unterer Bereich | Understand | 1–2 |
| Bekannte Informationen strukturieren | II | Understand/Analyze | 2 |
| Bekannte Methode auf neuen Fall anwenden | II | Apply | 2–3 |
| Unbekannten Fall und seine Beziehungen untersuchen | II–III | Analyze | 3 |
| Alternativen anhand von Kriterien beurteilen | III | Evaluate | 3 |
| Selbständig Modell oder Lösung entwickeln | III | Create | 3–4 |
| Über längere Zeit untersuchen und verallgemeinern | III | Analyze/Create | 4 |

Das sind Beispiele, keine Umrechnungstabelle. Der konkrete Fall und die verlangte Begründung bestimmen das Niveau.

# Von Reproduktion zu Transfer

Ein Modell soll „Hänsel und Gretel“ erzählen, aber die Kinder heißen Jens und Sophie. Das ist kein besonders starker Test. Namen in einer bekannten Geschichte kann auch ein triviales Programm ersetzen.

Interessanter wird es, wenn sich Rollen, Fähigkeiten und Schauplatz ändern. Welche Beziehungen tragen die Handlung? Welche Ereignisse müssen sich ändern, damit der Konflikt weiterhin funktioniert? Welche neue Variante bewahrt das Muster und welche zerstört es? Eine gute Antwort benutzt eine Abstraktion der Geschichte und überträgt sie auf den veränderten Fall. Das ist beobachtbar mehr als das Wiedergeben eines Dokuments.

Noch deutlicher ist Softwareentwicklung. Das Modell muß eine Anforderung als bestimmten Problemtyp erkennen, relevante Dateien finden, mögliche Verfahren auswählen und an der konkreten Codebasis anwenden. Bei einer Fehlersuche muß es Zusammenhänge zwischen Aufrufstellen, Datenfluß und beobachtetem Fehler herstellen. Das sind Leistungen im Bereich *Apply* und *Analyze*. Die schlichte Klassifikation eines Falls gehört bei Revised Bloom allerdings zunächst zu *Understand*. Erst das Zerlegen, Unterscheiden und Begründen der Beziehungen macht daraus *Analyze*.

Das ist die Stelle, an der der verbreitete Papageienvorwurf scheitert. Eine Antwort kann Beziehungen zwischen bekannten Elementen erkennen und auf einen neuen Fall übertragen. Ob dabei menschliches Verstehen stattfindet, ist eine andere Frage.

# Segmentieren und prüfen

Ein einzelner Prompt ist ein schlechter Arbeitsprozeß für ein großes Problem. Man muß die Arbeit zerlegen: Ziel klären, unbekannte Voraussetzungen prüfen, Teilaufgaben bestimmen, Ergebnisse jeweils abnehmen und erst dann den nächsten Schritt beginnen. Das ist für Menschen normale Projektarbeit. Für LLMs ist es besonders wichtig, weil Kontext begrenzt ist und ein früher Fehler sonst in allen späteren Antworten weiterlebt.

Bei der Codegenerierung kann ein **Agentic Harness** diese Arbeit unterstützen. Es gibt dem Modell Zugriff auf Repository, Dateien, Shell, Git und Tests. Entscheidungen liegen als Dateien vor und überleben einen neuen Modellkontext. Ein Ticket kann klein genug werden, daß sein Ergebnis prüfbar ist. Ich habe diesen Ablauf in [„LLM Driven Development“]({{< relref "2026-06-05-llm-driven-development" >}}) und am konkreten Projekt in [„Building server-key-injection by specialization“]({{< relref "2026-08-23-llm-specialization-workflow" >}}) beschrieben. [„Die Menschmaschine muß eingearbeitet werden“]({{< relref "2026-09-13-die-menschmaschine-muss-eingearbeitet-werden" >}}) erklärt, weshalb lokales Firmenwissen und Einarbeitung dabei entscheidend sind.

Mechanische **Quality Gates** machen einen Teil der Arbeit überprüfbar:

```bash
uv run pytest
uv run ruff check
uv run ty check
```

Ein Test kann beobachtbares Verhalten prüfen. Ein Linter kann Regelverstöße finden. Ein Typechecker kann bestimmte Widersprüche im Code aufdecken. Git macht Änderungen sichtbar und rücknehmbar. Das Modell kann Fehlermeldungen lesen, eine Hypothese korrigieren und erneut prüfen. Es bleibt nicht bei einer einzigen plausiblen Antwort.

Grüne Gates beweisen allerdings nur, was sie tatsächlich prüfen. Ein Test, der bloß einen Mock-Aufruf wiederholt, sagt wenig über das Verhalten des Programms. Ein Typechecker kennt die Geschäftsanforderung nicht. Ein Benchmark ist ebenfalls ein von außen angelegtes Gate; sein Bestehen macht die Bewertung nicht automatisch zu einer eigenen *Evaluate*-Leistung des Modells. *Evaluate* zeigt sich, wenn es die Prüfkriterien hinterfragt, Lücken erkennt und eine aussagekräftigere Prüfung entwirft.

Die Leistung gehört dem **System aus Modell, Harness, Kontext, Werkzeugen und menschlicher Führung**. Wie groß der Anteil der Umgebung ist, zeigt auch die Forschung zu [SWE-agent](https://papers.nips.cc/paper_files/paper/2024/hash/5a7c947568c1b1328ccc5230172e1e7c-Abstract-Conference.html): Schon die Gestaltung der Schnittstelle zum Computer verändert die Ergebnisse bei Softwareaufgaben erheblich.

Das ist kein Einwand gegen die Leistung. Ein Mensch löst Softwareprobleme ebenfalls mit Editor, Dokumentation, Tests und Kollegen und typischerweise nicht in einem One-Shot. Man muß nur sauber benennen, was man gemessen hat. Ein Agent mit Tests ist nicht dasselbe Versuchsobjekt wie ein nackter Modellaufruf.

# Modelle sind keine Anforderungsbereiche

Luna, Terra, Sol und Astra sind keine Stufen von Bloom. Die aktuelle [OpenAI-Modellübersicht](https://developers.openai.com/api/docs/models) führt GPT-6 Luna für eng umrissene Arbeit in hoher Stückzahl, GPT-6 Sol für anspruchsvollere Arbeitsabläufe und GPT-6 Astra für besonders schwierige Aufgaben.

Eine präzise spezifizierte AFB-III-Aufgabe kann ein günstiges Modell mit guten Gates lösen. Ein starkes Modell kann an einer AFB-I-Frage scheitern. Für Architektur und unklare Anforderungen ist mehr Urteilskraft wertvoll; nach der Segmentierung können kleine Modelle enge Tickets abarbeiten. So war es auch im verlinkten `server-key-injection`-Versuch. Die Taxonomie beschreibt die Aufgabe und die Antwort. Modellwahl ist eine Frage von Erfolgsrate, Kosten und benötigter Führung im konkreten Prozeß.

# Verstehen und Erzeugen

Die Taxonomien liefern keine einfache Antwort auf die Frage, ob ein LLM *versteht*. Sie klassifizieren Anforderungen und sichtbare Leistungen, nicht subjektive Erfahrung oder eine bestimmte innere Repräsentation. Wenn ein Modell einen fremden Fehler richtig einordnet und behebt, darf man die funktionale Leistung beschreiben. Daraus folgt noch keine Gleichheit mit menschlichem Verstehen. Umgekehrt verschwindet die Leistung nicht, nur weil das Modell anders arbeitet als ein Mensch.

Bei *Create* ist die Grenze noch interessanter. Ein neues Stück Code ist nicht schon Forschung. Es kann eine Variante einer bekannten Lösung sein. Eine neue Hypothese ist ebenfalls noch keine Erkenntnis. Sie muß etwas riskieren: Sie muß an einem bislang nicht verwendeten Fall scheitern können.

Es gibt bereits Beispiele, in denen LLMs an neuen Ergebnissen beteiligt waren. [FunSearch](https://www.nature.com/articles/s41586-023-06924-6) kombinierte ein Sprachmodell mit einer Suche und einem automatischen Evaluator und fand neue mathematische Konstruktionen sowie Algorithmen. Das ist eine Leistung des zusammengesetzten Systems unter günstigen Bedingungen: Das Problem ließ sich so formulieren, daß Kandidaten automatisch bewertet werden konnten. Daraus folgt nicht, daß jedes Modell allein ein offenes Forschungsprogramm führen kann.

# Wissenschaft als Quality Gate

Murray Gell-Mann verweist in [*The Quark and the Jaguar*](https://www.sfipress.org/books/the-quark-and-the-jaguar), Kapitel 7, auf Popper: Eine wissenschaftliche Theorie macht Vorhersagen, an denen sie scheitern kann. Wiederholte Beobachtungen gegen diese Vorhersagen widerlegen sie. Das ist das erste **Quality Gate** für ein neues Modell. Vor dem Test müssen Vorhersage, Gültigkeitsbereich und nötige Genauigkeit feststehen. Dann prüft man an Beobachtungen, die nicht schon zur Konstruktion des Modells benutzt wurden.

Das zweite Gate fragt nach der **funktionalen Erklärung**: Welche Beziehungen und Mechanismen erzeugen das beobachtete Verhalten? Was sollte sich ändern, wenn man gezielt in das System eingreift? Gell-Mann beschreibt in Kapitel 9 die Suche nach solchen Mechanismen, warnt aber vor einer vorschnellen Abwertung beschreibender Theorien. Darwin konnte die Vererbung und Entstehung von Variation noch nicht erklären. Seine Evolutionstheorie war deswegen nicht wertlos. Das zweite Gate vertieft ein brauchbares Modell; es ersetzt das erste nicht.

Newtons Gravitation sagt Bewegungen in ihrem Gültigkeitsbereich voraus. Einstein erklärt Gravitation geometrisch; bei schwachen Feldern und langsamen Bewegungen ergibt sich wieder Newtons Beschreibung. Welche Rolle Gravitation in einer Quantentheorie spielt, bleibt offen. Erklärung hat Ebenen, und keine davon erspart den Vergleich mit der Beobachtung. [Zum Newtonschen Grenzfall: MIT OpenCourseWare](https://live.ocw.mit.edu/courses/8-962-general-relativity-spring-2020/resources/lecture-14-linearized-gravity-i-principles-and-static-limit/).

Dasselbe Maß muß für menschliche und maschinelle Vorschläge gelten. Wer eine Theorie formuliert hat, ist eine Frage. Ob sie neue Fälle vorhersagt und Zusammenhänge erklärt, ist eine andere. Menschen bleiben bei Zielwahl, Versuchsplanung, Datenqualität und Interpretation in der Verantwortung. Ein LLM kann bei allen diesen Schritten helfen; ob es ein bestimmtes Modell erfolgreich gebildet hat, entscheidet sich an den beiden Gates und nicht an der Eleganz seiner Antwort.

Benders Frage bleibt wichtig: Eine plausible Antwort hat keinen menschlichen Sprecher, der mit ihr etwas beabsichtigt und die Folgen in der Welt erlebt. Das sagt noch nicht, welche Aufgaben das System lösen kann.

# TL;DR


Die heute übliche Behauptung lautet: **Ein LLM gibt Gelerntes in wechselnden Formulierungen wieder, kann aber nichts Wesentliches abstrahieren oder auf einen neuen Fall anwenden.** 

Diese Behauptung ist nicht nur falsch, sie macht aus einer Diskussion über die Stärken und Schwächen der KI ein fast religiöses Dogma und verstellt den Blick auf die wichtigen Fragestellungen.

Mit einem geeigneten Prozeß leisten LLMs bei klar abgegrenzten Codeaufgaben zuverlässig mehr als Reproduktion: Sie ordnen Informationen neu, übertragen Verfahren, analysieren Probleme und verbessern Lösungen anhand überprüfbarer Ergebnisse. Ob daraus menschliches Verstehen folgt und wie weit es bei eigenständiger Forschung und Modellbildung trägt, entscheidet dieser Befund nicht. Dort müssen neue Vorhersagen und funktionale Erklärungen die nächsten Quality Gates sein.
