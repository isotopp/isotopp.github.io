---
author: isotopp
date: "2026-10-14T01:02:03Z"
feature-img: assets/img/background/rijksmuseum.jpg
title: "Ein Harness schließt die Schleife"
description: "Mit einem Harness beschafft sich ein Modell Kontext, schreibt Ergebnisse in Dateien und prüft seine Arbeit mit Werkzeugen."
toc: true
tags:
  - lang_de
  - ai
  - llm
  - software engineering
  - erklaerbaer
---

In Gesprächen mit Freunden merke ich, daß viele beim Einsatz von LLMs noch nicht über das Chatfenster hinauskommen.
Man öffnet ChatGPT im Browser oder OpenWebUI, stellt eine Frage und bekommt eine Antwort.
Dann versucht man, mit besseren Prompts bessere Antworten zu bekommen.

Als Ersatz für ein Google-Suchfenster ist das oft brauchbar.
Wenn ich aber Code, ein Dokument oder ein anderes Arbeitsergebnis haben will, ist das umständlich.
Ich muß dem Modell das Material hinterhertragen und seine Antworten von Hand in die Arbeitsumgebung übertragen.
Ich bin die Zwischenablage mit Beinen.

Für solche Aufgaben verwende ich einen Harness, etwa
[OpenCode](https://opencode.ai/docs/tools/) oder [Codex](https://developers.openai.com/codex/cli/).
Die lassen das Modell in einem Projektverzeichnis Dateien lesen, schreiben und Programme ausführen.
Damit kann es sich Kontext beschaffen, Dateien erzeugen und Ergebnisse prüfen.

Der entscheidende Schritt ist die Schleife zwischen Modell und Arbeitsumgebung.

# Tool Calling

Ein Modell führt selbst keine Programme aus.
Es kann aber einen Werkzeugaufruf erzeugen: Lies diese Datei. Liste dieses Verzeichnis. Führe dieses Kommando aus.
Der Harness ist die Software um das Modell herum.
Er beschreibt dem Modell die Werkzeuge, führt die Aufrufe innerhalb der erlaubten Rechte aus
und gibt die Ergebnisse zurück.

Das heißt [Tool Calling](https://developers.openai.com/api/docs/guides/function-calling#the-tool-calling-flow).
Die grundlegenden Werkzeuge sind schlicht:

- Dateien und Verzeichnisse lesen;
- in Dateien suchen;
- Dateien schreiben oder gezielt verändern;
- Programme ausführen und ihre Ausgabe lesen.

Damit arbeiten wir auch selbst am Rechner.

Das Modell bekommt eine Aufgabe, fordert ein Werkzeug an und bekommt dessen Ergebnis in seinen Kontext.
Damit bestimmt es den nächsten Schritt.
Der kann wieder ein Werkzeugaufruf sein.
So entsteht eine Schleife: handeln, Ergebnis lesen, weiterarbeiten.

Auch über MCP (Model Context Protocol) angebundene Werkzeuge passen in diese Schleife.
Ein MCP-Server [beschreibt seine Werkzeuge und die Angaben, die sie brauchen](https://modelcontextprotocol.io/specification/2025-06-18/server/tools).
Er nimmt Aufrufe entgegen und liefert Ergebnisse zurück.
Dahinter kann ein lokales Programm oder ein entfernter Dienst stehen;
MCP unterstützt [lokale Kommunikation und HTTP](https://modelcontextprotocol.io/specification/2025-06-18/basic/transports).
Für das Modell bleibt es ein Werkzeugaufruf mit einem Ergebnis.

Ob ich dafür einen Browser, ein Terminal oder eine Desktop-Anwendung benutze, ist egal.
Ein Chatfenster mit dieser Werkzeugschleife kann ebenfalls einen Harness bedienen.
Entscheidend ist, ob das Modell in der Arbeitsumgebung handeln kann oder ob ich jeden Schritt für es ausführen muß.

# Kontext selbst beschaffen

Der Kontext enthält das Material, mit dem das Modell gerade arbeitet:
Anweisungen, Gespräch, gelesene Texte und Werkzeugergebnisse.
Das Kontextfenster begrenzt, wie viel davon auf einmal hineingeht.

Im reinen Chat muß ich vorher aussuchen, was das Modell braucht, und es hineinkopieren.
Fehlt eine Information, muß ich sie nachliefern.
Ist mein Material größer als das Kontextfenster, paßt es nicht komplett hinein.

Mit Dateizugriff wählt das Modell selbst aus.
Es liest das Verzeichnis, sucht nach einem Begriff, öffnet die passenden Dateien und folgt den Verweisen darin.
Der Materialbestand kann weit größer als das Kontextfenster sein.
Es liest die Teile, die es für den nächsten Schritt braucht.

Das Projektverzeichnis vergrößert nicht das Kontextfenster.
Es macht Material außerhalb des Fensters erreichbar.

Eine kurze Indexdatei hilft dabei.
In einem `README.md` steht, wo die Anforderungen liegen, welche Dateien den Aufbau beschreiben
und wie man die Prüfungen ausführt.
Das Modell liest diese Hinweise und holt sich die Details selbst.
Ich muß nicht für jede Aufgabe alle Informationen in einen Startprompt kopieren.

Ein Harness kann außerdem Subagenten mit eigenen Kontexten einsetzen:
Eine Recherche läuft dann in einem eigenen Kontext, und nur ihr Ergebnis kommt zum Hauptmodell zurück.

# Dateien bleiben

Das Modell kann Ergebnisse aus dem Kontext in Dateien schreiben:
Code, einen Artikel, eine Auswertung, aber auch einen Plan, geklärte Anforderungen oder offene Fragen.

Damit kann das Modell Nachrichten an sein zukünftiges Ich hinterlassen.
In einem späteren Arbeitsgang liest es diese Dateien in einen frischen Kontext ein.
Es muß nicht die ganze bisherige Unterhaltung mitschleppen.

Der Kontext ist begrenzt und vorübergehend.
Dateien bleiben.
Das Modell kann sie ordnen und überarbeiten, Menschen können sie lesen.

Einen Codeblock im Chat muß ich erst in eine Datei kopieren.
Eine Änderung im Projektverzeichnis liegt bereits dort, wo wir sie prüfen und verwenden können.

# Mechanisch prüfen

Über Tool Calling kann das Modell sein Ergebnis prüfen lassen.
In einem dafür eingerichteten Python-Projekt ruft es zum Beispiel diese Programme auf:

```bash
uv run ty check
uv run pytest
```

[ty](https://docs.astral.sh/ty/) prüft die Typen,
[pytest](https://docs.pytest.org/en/stable/) führt die Tests aus.
Diese Werkzeuge arbeiten Regeln und Testfälle ab, ohne ein LLM aufzurufen.
Ein Typfehler verschwindet nicht dadurch, daß das Modell überzeugend erklärt, warum der Code trotzdem richtig sei.

Die Prüfung selbst verbraucht keine Modell-Tokens.
Nur der Werkzeugaufruf und das Lesen der Ausgabe kosten Tokens.

Auch hier zählt die Schleife.
Das Modell schreibt Code, ruft die Prüfung auf und bekommt Fehlermeldungen zurück.
Es kann die betroffenen Stellen lesen, den Code korrigieren und erneut prüfen.
Aus einer plausiblen Antwort wird ein Arbeitsgang mit überprüfbaren Zwischenständen.

Ein grüner Testlauf sagt nur, daß der Code die vorhandenen Tests besteht.
Ob die Tests die Anforderung ausreichend prüfen, müssen wir ebenfalls klären.
Aber wir prüfen den Code unabhängig davon, was das Modell über ihn behauptet.

# Eine Arbeitsumgebung

Ein Harness verbindet drei Dinge in derselben Schleife:
Das Modell beschafft sich Kontext, hält Ergebnisse in Dateien fest und prüft seine Arbeit mit Werkzeugen.
Es handelt, beobachtet und reagiert auf das Ergebnis.

Damit hängt die Qualität der Arbeit auch an der Arbeitsumgebung.
Findet das Modell das Material? Kann es die nötigen Programme aufrufen?
Gibt es brauchbare Prüfungen?
Diese Fragen bringen uns weiter als die nächste Promptsammlung.

Welche Materialien und Arbeitsanweisungen eine Organisation dafür bereitstellen muß,
habe ich in [Die Menschmaschine muß eingearbeitet werden]({{< relref "2026-09-13-die-menschmaschine-muss-eingearbeitet-werden" >}}) beschrieben.

Wer Arbeitsergebnisse haben will, sollte dem Modell ein Projektverzeichnis, Werkzeuge und diese Rückkopplung geben.
Sonst macht man die Arbeit zwischen den Modellantworten weiterhin selbst.
