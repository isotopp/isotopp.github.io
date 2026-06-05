---
author: isotopp
date: "2026-06-05T01:02:03Z"
feature-img: assets/img/background/rijksmuseum.jpg
title: "LLM Driven Development"
toc: true
tags:
  - lang_de
  - ai
  - computer
  - software
  - erklaerbaer
aliases:
  - /2026/06/05/llm-driven-development.html
---

Codex ist die Shell von OpenAI zur Unterstützung von Softwareentwicklung mit Large Language Models.
Es ist eine Anwendung, die auf dem Computer läuft, also dort Dateien verändern und Kommandos ausführen kann.

Man kann Codex verwenden, um sich Software schreiben zu lassen.
Wenn man das jedoch naiv macht bekommt man keine guten Ergebnisse.
Tatsächlich ist es dringend notwendig, die Abläufe und Prozesse bei der Softwareentwicklung zu kennen und zu verstehen, um sinnvolle Ergebnisse zu erzielen.

LLM Driven Development ist also nicht "Mache mir eine Anwendung, die ... tut."
So etwas funktioniert für kleine Beispiele, Snippets oder Demo-Code auf Stackoverflow-Größe.

Größere Projekte brauchen immer noch Führung, Leitlinien, Planung, und auch Review, Umbaupausen, und Aufräumarbeiten.
Software besteht aus Anforderungen, Entscheidungen, Konventionen, Tests, Bugs, Altlasten,
Sicherheitsgrenzen, Deployment-Krempel und einer Menge nicht ausgesprochener Annahmen.

Und das ist genau die Aufgabe des Menschen dabei: Den Kram überwachen, nicht ausgesprochene Annahmen identifizieren und korrigieren, schriftlich fixieren und dann Nacharbeiten zum Aufräumen veranlassen.

Ein LLM-Agent kann damit arbeiten. Aber nur, wenn man ihm diesen Kram in einer Form gibt, die er benutzen kann.

# Kontext ist Material

Ein LLM hat kein Projektgedächtnis im menschlichen Sinn.
Es hat ein Kontextfenster.

Das Kontextfenster ist die Menge an Tokens, die das Modell in einem Lauf aktiv sehen kann.
Tokens sind nicht Wörter, sondern Wortstücke. Für uns reicht als Vorstellung: Kontext ist begrenzt,
auch wenn moderne Modelle inzwischen sehr große Fenster haben.

Kleine Aufgaben passen in ein paar tausend Tokens.
Ernsthafte Coding-Aufgaben profitieren schnell von 30k Tokens und mehr,
weil Auftrag, relevante Dateien, Tests, Fehlermeldungen, Projektregeln und bisherige Entscheidungen gleichzeitig sichtbar sein müssen.
Für Refactorings, Audits und Architekturfragen sind 100k Tokens oder mehr angenehm.

Aber groß ist nicht automatisch gut.

In langen Kontexten werden Informationen schlechter gefunden, besonders wenn sie irgendwo in der Mitte liegen.
Das Problem ist bekannt als
[Lost in the Middle](https://aclanthology.org/2024.tacl-1.9/).
Ein großes Kontextfenster ist also keine Müllhalde.
Es ist ein Arbeitstisch.
Wenn der Arbeitstisch vollgemüllt ist, findet auch der Agent den Schraubendreher nicht mehr.

Die praktische Regel ist einfach:
Der aktive Kontext muss die konkrete Arbeit tragen, nicht das ganze Projekt abbilden.

Oder anders herum:
Das Projekt kann sehr viel größer als der aktive Kontext sein, aber man muss das Projektumfeld so strukturieren,
dass das Modell sich in der Codebasis zurechtfindet und sich einen aktiven Kontext bauen kann,
der für die aktuelle Aufgabe geeignet ist.

# `AGENTS.md`

Der Einstiegspunkt für Codex ist `AGENTS.md`.

OpenAI beschreibt `AGENTS.md` als Projektinstruktion: Codex liest diese Dateien vor der Arbeit
und baut daraus eine Instruktionskette.
Die offizielle Dokumentation sagt auch, dass Codex vom Projekt-Root zum aktuellen Verzeichnis läuft
und nähere Instruktionen später im Prompt stehen, also spezifischer wirken.
Siehe
[Custom instructions with AGENTS.md](https://developers.openai.com/codex/guides/agents-md).

Das ist wichtig, weil `AGENTS.md` nicht "im Gedächtnis bleibt".
Präziser:
`AGENTS.md` wird als Projektkontext geladen und beeinflusst die Arbeit,
solange diese Instruktionen im aktiven Kontext verfügbar sind und nicht durch spätere,
spezifischere Instruktionen verdrängt werden.

Eine gute `AGENTS.md` ist kurz, dicht und langweilig.

Sie sagt:

- was das Projekt ist
- welche Werkzeuge benutzt werden
- welche Befehle für Formatierung, Linting und Tests gelten
- wo Code, Tests, Dokumentation und interne Entwicklungsartefakte liegen
- welche Regeln der Agent nicht brechen soll

Konkrete Befehle sind besser als fromme Wünsche.

Also nicht:

```text
Bitte teste sorgfältig.
```

Sondern:

```text
Formatierung: uv run ruff format src tests
Linting:      uv run ruff check --fix src tests
Tests:        uv run pytest
```

# Progressive Discovery

Eine `AGENTS.md` soll nicht das ganze Projekt erklären.

Sie soll auf weitere Dateien zeigen.
Das ist Progressive Discovery: Der Agent bekommt zuerst Orientierung und findet Details erst dann,
wenn sie für die konkrete Aufgabe relevant sind.

Das entspricht dem allgemeinen Prinzip der
[Progressive Disclosure](https://developers.openai.com/codex/skills),
das OpenAI bei Codex-Skills explizit beschreibt:
zuerst nur Name, Beschreibung und Pfad,
die vollständigen Instruktionen erst bei Bedarf.

Für ein Repository funktioniert das genauso.

Die `AGENTS.md` verweist zum Beispiel auf:

- `development/index.md` für interne Entwicklungsartefakte
- `development/security-boundary.md` für die Sicherheitskante der Anwendung
- `development/decisions/` für Architekturentscheidungen
- `development/epic-001-.../tickets.md` für konkrete Arbeitspakete

Wichtig ist, dass der Verweis erklärt, was dort steht.
Ein bloßer Dateiname ist eine Schnitzeljagd, der Agent muss die Datei immer noch in den Kontext laden um zu sehen, was drin ist und ob sie nützlich ist.
Eine Zeile Kontext ist ein Wegweiser.
Das Modell kann ihn benutzen um vorab zu entscheiden, ob die Datei geladen werden sollte.

# `README.md` ist nicht `AGENTS.md`

Die `README.md` ist für Nutzer.
Sie erklärt Installation, Konfiguration und Benutzung.

Die `AGENTS.md` ist für Entwickler und Agenten.
Sie erklärt, wie an der Software gearbeitet wird.

Es ist wichtig, diese Trennung aufrechtzuerhalten.
Einmal, damit die Dateien für den Menschen sinnvoll bleiben,
und zum anderen, weil das auch Teil des Kontext-Managements für Agents ist.

# Expected Application Shape

Ein hilfreiches internes Artefakt ist eine `Expected Application Shape`.
Das ist kein Industriestandard, sondern ein nützlicher Projektbegriff.

Gemeint ist: Wie soll die Anwendung ungefähr aussehen?

Welche Module gibt es?
Welche Verantwortung gehört wohin?
Wo werden neue Dateien angelegt?
Welche Schichten dürfen miteinander sprechen?
Welche Dinge gehören ausdrücklich nicht zusammen?

Das muss am Anfang nicht perfekt sein.
Wir können tatsächlich das Modell benutzen, um darüber zu iterieren und das schrittweise zu verbessern während die Anwendung wächst.
Zu Beginn muss das nur gut genug sein, damit ein Agent nicht neue Funktionalität in irgendeine zufällig passende Datei stopft,
weil dort schon etwas ähnliches steht.

Wir verwenden die `Expected Application Shape` also, um Drift zu verringern.
Das ist kein Ersatz für eine richtige Architektur,
aber andererseits wollen wir uns ja auch inkrementell an etwas heran arbeiten, damit wir herausfinden,
was wir eigentlich wollen.

# Progressive Refinement

Der wichtigste Trick ist, den Agenten nicht direkt von "Idee" nach "Code" springen zu lassen.

Man verfeinert Material schrittweise:

```text
Beobachtung -> User Story -> Ticket -> Test -> Code -> Audit -> neues Ticket
```

Das nenne ich hier Progressive Refinement.
Im Scrum-Umfeld ist `Product Backlog Refinement` der etablierte Begriff für einen Teil davon.
Progressive Refinement ist etwas breiter:
Es beschreibt den ganzen Artefaktfluss in agentischer Entwicklung.

Eine Beobachtung ist noch keine User Story.
Eine User Story ist noch kein Ticket.
Ein Ticket ist noch kein Test.
Ein Test ist noch kein Code.

Das sind unterschiedliche Artefakte mit unterschiedlichen Qualitätskriterien.
Wenn man diesen Unterschied ignoriert, bekommt man Slop.
Schnell, viel, plausibel, falsch.

Die Qualität der frühen Artefakte bestimmt stark die Qualität der späteren Arbeit.
Ein schlechtes Ticket erzeugt schlechten Code.
Ein guter Agent macht daraus nur schneller schlechten Code.
Daher ist es entscheidend, gerade die frühen Artefakte zu lesen, zu verstehen und ggf. um Entscheidungen anzureichern.

Es hat sich herausgestellt, dass es sehr hilfreich ist, dem Model ein Sicherheitsventil anzubieten.
Das heißt, man kann im Prompt erlauben, am Ende des erstellten oder umgewandelten Artefaktes die Sektionen "Open Questions", "Risks" und "Gaps" anzulegen.
Wenn dem Modell also bei der Arbeit etwas auffällt, das hilfreich sein könnte, dann ist das eine Einladung, hier Nachrichten zu hinterlassen.

# Markdown als Arbeitsformat

Markdown ist ein gutes Format.

Es ist lesbar, diffbar, versionierbar und für Menschen wie LLMs einfach zu verarbeiten.
Man kann Codex Beobachtungen strukturieren lassen,
daraus User Stories erzeugen,
diese in Tickets zerlegen,
die Tickets implementieren lassen
und danach ein Audit-Artefakt schreiben lassen.

Ein mögliches Layout:

```text
/
  README.md
  AGENTS.md
  src/
  tests/
  docs/
  development/
    index.md
    security-boundary.md
    decisions/
      0001-use-flask-for-api-boundary.md
    epic-001-image-render-api/
      user-stories.md
      tickets.md
      audit.md
      notes.md
```

`/docs/` ist hier Nutzer- und Betreiber-Dokumentation.
`/development/` ist internes Arbeitsmaterial.
Letzteres verwenden wir dann, um Code und Tests erzeugen zu lassen.

Der agentische Sicherheitskontext gehört besser in `/development/security-boundary.md`.
Das ist etwas anderes als eine GitHub `SECURITY.md`.

# Tests zuerst

LLM Driven Development braucht Tests.

Nicht "wäre schön", sondern braucht.

Der Agent soll bei nichttrivialer Arbeit zuerst Tests schreiben,
die die erwartete API Shape und das gewünschte Verhalten festlegen.
Diese Tests sollen zuerst fehlschlagen.
Dann wird Code geschrieben, bis sie grün sind.

Das ist Red-Green-Development.
Man kann das mit [Outside-In TDD](https://outsidein.dev/concepts/outside-in-tdd/) kombinieren:
erst das Verhalten an der Außenseite beschreiben,
dann die innere Implementierung entstehen lassen.

Das passt gut zu Agenten,
weil Tests dem Agenten eine Zielscheibe geben.
Ohne Zielscheibe optimiert das LLM auf plausible Antwort.
Mit Zielscheibe optimiert es wenigstens auf reproduzierbares Verhalten.

Natürlich können Tests auch schlecht sein.
Triviale Tests, die nur die Implementierung nacherzählen, sind wertlos.
Gute Tests sichern Verhalten ab und überleben ein Refactoring.

(Zum Nachlesen in ["Growing Object-Oriented Software, Guided by Tests"](https://growing-object-oriented-software.com/), "GOOS".)

# Audits sind Teil der Pipeline

Ein Audit ist kein Ereignis am Ende.
Es ist ein Artefakt in der Pipeline.

Ein Security Audit kann `development/security-boundary.md` lesen:
Welche Eingaben gibt es?
Welche Rollen?
Welche externen Systeme?
Welche Secrets?
Welche Netzwerkkontakte?
Welche Erwartungen gelten?

Daraus entstehen Findings.
Aus Findings entstehen Tickets.
Tickets werden priorisiert, geprüft, implementiert und getestet.

Dasselbe gilt für Refactoring Audits.
Alle zwei oder drei Sprints kann man den Agenten fragen:

- welcher Code ist unbenutzt?
- welche Duplikate sind sinnvoll zusammenzuführen?
- welche Module sprengen ihre erklärte Verantwortung?
- passt die tatsächliche Struktur noch zur `Expected Application Shape`?

Das Ergebnis ist wieder `audit.md` mit gezielter Kritik.
Die editieren wir, und bitten dann das Modell, diese Kritik in "actionable tickets" in eine `tickets.md` umzuwandeln.

Und ja:
Ein Codex Security Audit ersetzt keinen professionellen Security Review für kritische Systeme.
Aber als wiederholbares Review-Werkzeug ist es nützlich.

# Mehrere Agenten, eine Wahrheit

Codex verwendet `AGENTS.md`.
GitHub Copilot kennt repositoryweite Instruktionen wie
[`.github/copilot-instructions.md`](https://docs.github.com/en/copilot/how-tos/custom-instructions/adding-repository-custom-instructions-for-github-copilot)
und inzwischen ebenfalls `AGENTS.md`.
[Claude Code](https://docs.anthropic.com/en/docs/claude-code/memory) verwendet `CLAUDE.md`.
[JetBrains Junie](https://junie.jetbrains.com/docs/guidelines-and-memory.html) unterstützt ebenfalls `AGENTS.md`.
Andere Werkzeuge haben wieder andere Dateien.

Wenn man mehrere Agenten im selben Repository benutzt,
entsteht schnell Instruktions-Drift:
eine Regel steht in Datei A,
die gegenteilige Regel steht in Datei B,
und beide Agenten tun jeweils plausibel das Falsche.

Die pragmatische Lösung ist:
`AGENTS.md` als kanonische Orientierungsdatei pflegen
und tool-spezifische Dateien kurz halten, sofern das jeweilige Tool das erlaubt.

Zum Beispiel:

```text
Read AGENTS.md for repository conventions.
```

Das ist nicht perfekt.
Aber es ist besser als fünf lange Regelwerke, die alle ein bisschen anders falsch sind.

# Fazit

LLM Driven Development ist vor allem Kontextarbeit.

Man schreibt nicht nur Prompts.
Man schreibt Arbeitsmaterial:
Projektregeln, Architekturentscheidungen, Sicherheitsgrenzen, User Stories, Tickets, Tests und Audits.

Der Agent ist dann kein magischer Entwickler.
Er ist ein sehr schneller, sehr wörtlicher Mitarbeiter mit begrenztem Kurzzeitgedächtnis,
der gut arbeitet, wenn man ihm gute Arbeitsunterlagen gibt.

Das ist weniger spektakulär als "AI schreibt meine App".
Es ist aber deutlich näher an echter Softwareentwicklung.

Und es hat den angenehmen Nebeneffekt,
dass auch Menschen das Projekt besser verstehen.
Das ist fast verdächtig.

# Quellen

- [OpenAI Codex: Custom instructions with AGENTS.md](https://developers.openai.com/codex/guides/agents-md)
- [OpenAI Codex: Configuration Reference](https://developers.openai.com/codex/config-reference)
- [OpenAI Codex: Agent Skills](https://developers.openai.com/codex/skills)
- [AGENTS.md open format](https://agents.md/)
- [Liu et al.: Lost in the Middle](https://aclanthology.org/2024.tacl-1.9/)
- [Scrum Guide 2020: Product Backlog Refinement](https://scrumguides.org/scrum-guide.html)
- [Outside-In TDD](https://outsidein.dev/concepts/outside-in-tdd/)
- [Growing Object-Oriented Software, Guided by Tests](https://growing-object-oriented-software.com/)
- [GitHub Docs: Repository custom instructions for Copilot](https://docs.github.com/en/copilot/how-tos/custom-instructions/adding-repository-custom-instructions-for-github-copilot)
- [Anthropic Claude Code: Memory and CLAUDE.md](https://docs.anthropic.com/en/docs/claude-code/memory)
- [JetBrains Junie: Guidelines and memory](https://junie.jetbrains.com/docs/guidelines-and-memory.html)
- [GitHub Docs: Adding a security policy to your repository](https://docs.github.com/articles/adding-a-security-policy-to-your-repository)
