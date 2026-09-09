---
author: isotopp
date: "2026-09-09T01:02:03Z"
feature-img: assets/img/background/rijksmuseum.jpg
title: "Git Worktrees: mehrere Branches gleichzeitig auschecken"
tags:
  - lang_de
  - git
  - development
  - erklaerbaer
---

Ein Git-Repository kann mehrere Arbeitsverzeichnisse haben. Mit `git worktree`
liegt `main` zum Beispiel in `~/Source/project`, während der Branch
`new-feature` gleichzeitig in `~/Source/project/.worktrees/new-feature`
ausgecheckt ist.

Das ist nützlich, wenn im Hauptverzeichnis ein Server läuft, ein Test lange
arbeitet oder man eine angefangene Änderung nicht wegräumen will, nur um kurz
einen anderen Branch anzusehen. Ein zweiter Clone würde ebenfalls
funktionieren, dupliziert aber die Repository-Daten und muß separat aktuell
gehalten werden. Worktrees teilen sich dagegen dasselbe Repository.

# Worktrees und Branches

Ein Branch ist in Git zunächst nur ein beweglicher Name für einen Commit. Ein
Worktree ist ein Arbeitsverzeichnis mit ausgecheckten Dateien, einem eigenen
`HEAD` und einem eigenen Index, also einer eigenen Staging Area.

Im Normalfall ist jeder Worktree mit genau einem Branch verbunden. Git läßt
denselben Branch nicht gleichzeitig in zwei Worktrees auschecken. Sonst könnten
zwei Arbeitsverzeichnisse unabhängig voneinander versuchen, denselben
Branch-Zeiger zu verschieben.

Für die Beispiele sieht die Verzeichnisstruktur so aus:

```text
~/Source/project/                         main
└── .worktrees/
    ├── new-feature/                      new-feature
    └── linear-feature/                   linear-feature
```

Das Projekt enthält diesen Eintrag in `.gitignore`:

```gitignore
/.worktrees
```

Der führende Slash beschränkt die Regel auf `.worktrees` im Wurzelverzeichnis
des Projektes. Git ignoriert dadurch die Arbeitsverzeichnisse der anderen
Worktrees im Checkout von `main`.

# Einen Feature-Worktree anlegen

Wir beginnen im bestehenden Checkout. `main` zeigt auf den Commit, von dem das
Feature abzweigen soll:

```bash
cd ~/Source/project
git switch main
git status --short
git worktree add -b new-feature .worktrees/new-feature
```

`-b new-feature` legt den Branch an. Das letzte Argument bestimmt das
Arbeitsverzeichnis. Ohne weiteren Commit oder Branch als Startpunkt verwendet
Git dabei `HEAD`, hier also den aktuellen Stand von `main`.

Das Verzeichnis ist danach ein vollständiges Arbeitsverzeichnis:

```bash
cd ~/Source/project/.worktrees/new-feature
git branch --show-current
```

Die Ausgabe ist `new-feature`. Änderungen in diesem Verzeichnis gehören zu
diesem Worktree. Das gilt auch für den Index: `git add` im Feature-Worktree
verändert nicht die Staging Area im Hauptverzeichnis.

# Implementieren, testen und committen

Nun wird das Feature wie in jedem anderen Checkout bearbeitet. Die konkreten
Dateien und der Testbefehl hängen vom Projekt ab:

```bash
cd ~/Source/project/.worktrees/new-feature
$EDITOR src/feature.py tests/test_feature.py
pytest -v
git status --short
git add src/feature.py tests/test_feature.py
git commit -m "Implement new feature"
```

Der Commit verschiebt den Branch `new-feature`. `main` bleibt unverändert. Die
beiden Branches zeigen jetzt auf unterschiedliche Commits, obwohl ihre
Worktrees dasselbe Git-Repository benutzen.

# In main mergen und aufräumen

Wir wechseln nicht mit `git switch` zwischen den Branches, sondern gehen
einfach in den bereits vorhandenen Worktree von `main`:

```bash
cd ~/Source/project
git switch main
git merge --no-ff new-feature
pytest -v
```

`--no-ff` erzeugt hier absichtlich einen Merge-Commit. Das Feature bleibt
dadurch als eigener Zweig in der Historie sichtbar, auch wenn ein Fast-Forward
möglich gewesen wäre.

Erst wenn der Merge und die Tests sicher sind, räumen wir auf:

```bash
cd ~/Source/project
git worktree remove .worktrees/new-feature
git branch -d new-feature
```

Die Reihenfolge ist wichtig. Solange der Branch im Worktree ausgecheckt ist,
läßt Git ihn nicht löschen. `git worktree remove` verweigert außerdem ohne
`--force` das Entfernen eines Worktrees mit nicht committeten Änderungen, und
`git branch -d` verweigert das Löschen eines nicht gemergten Branches. Diese
Sicherungen sollte man nicht ohne konkreten Grund abschalten.

# Lineare Historie mit Rebase und Fast-Forward

Im zweiten Beispiel soll kein Merge-Commit entstehen. Wir legen wieder einen
Worktree samt Branch an und entwickeln darin:

```bash
cd ~/Source/project
git worktree add -b linear-feature .worktrees/linear-feature

cd .worktrees/linear-feature
$EDITOR src/linear_feature.py tests/test_linear_feature.py
pytest -v
git add src/linear_feature.py tests/test_linear_feature.py
git commit -m "Implement linear feature"
```

Währenddessen kann `main` durch andere Arbeit weitergelaufen sein. Vor dem
Merge setzen wir die Feature-Commits deshalb auf den aktuellen Stand von
`main`:

```bash
cd ~/Source/project/.worktrees/linear-feature
git rebase main
pytest -v
```

Rebase nimmt die Commits, die nur auf `linear-feature` existieren, und spielt
sie auf dem aktuellen Commit von `main` neu ab. Dabei entstehen neue
Commit-IDs. Das ist für einen lokalen, noch nicht veröffentlichten
Feature-Branch unproblematisch.

Falls Konflikte auftreten, werden sie im Feature-Worktree aufgelöst. Danach
geht es mit `git rebase --continue` weiter. Nach erfolgreichem Rebase kann
`main` ohne Merge-Commit vorwärtsgeschoben werden:

```bash
cd ~/Source/project
git merge --ff-only linear-feature
pytest -v
git worktree remove .worktrees/linear-feature
git branch -d linear-feature
```

`--ff-only` ist hier die entscheidende Kontrolle. Ist `main` seit dem Rebase
erneut weitergelaufen, bricht Git ab, statt doch einen Merge-Commit zu bauen.
Dann wird der Feature-Branch noch einmal auf `main` rebased.

# Worktrees verwalten

| Kommando                            | Zweck                                                                           |
|-------------------------------------|---------------------------------------------------------------------------------|
| `git worktree list`                 | Alle Worktrees mit Pfad, Commit und Branch anzeigen                             |
| `git worktree add -b NAME PFAD`     | Neuen Branch und Worktree von `HEAD` anlegen                                    |
| `git worktree add PFAD BRANCH`      | Bestehenden Branch in einem neuen Worktree auschecken                           |
| `git worktree remove PFAD`          | Einen sauberen Worktree entfernen                                               |
| `git worktree move PFAD NEUER-PFAD` | Einen Worktree verschieben                                                      |
| `git worktree lock PFAD`            | Automatisches Aufräumen eines zeitweise nicht erreichbaren Worktrees verhindern |
| `git worktree unlock PFAD`          | Einen gesperrten Worktree wieder freigeben                                      |
| `git worktree prune`                | Verwaiste Verwaltungsdaten gelöschter Worktrees entfernen                       |
| `git worktree repair`               | Verknüpfungen nach manuellem Verschieben reparieren                             |

Für Skripte liefert `git worktree list --porcelain` ein stabiler zu
verarbeitendes Format. Im Alltag reichen meist `add`, `list` und `remove`.

# Wie Worktrees implementiert sind

Logisch kann man sich einen Worktree als weiteren Clone vorstellen, dessen
`.git` auf das Repository im Hauptverzeichnis zeigt. Das Bild erklärt den
wichtigsten Effekt: Jeder Worktree hat eigene ausgecheckte Dateien, aber alle
sehen dieselben Commits und Branches.

Technisch ist `.git` im verknüpften Worktree jedoch kein Symlink und kein
Verzeichnis, sondern eine Textdatei. Sie verweist auf ein
Verwaltungsverzeichnis unter `.git/worktrees/` des Haupt-Worktrees, ungefähr
so:

```text
gitdir: /home/user/Source/project/.git/worktrees/new-feature
```

Dieses Verwaltungsverzeichnis enthält unter anderem den eigenen `HEAD`, den
eigenen Index und einen Rückverweis auf den Worktree. Eine `commondir`-Datei
verweist von dort auf das gemeinsame `.git`-Verzeichnis. Objekt-Datenbank,
Branches, Tags und die meisten anderen Repository-Daten werden gemeinsam
benutzt; Arbeitsdateien, `HEAD` und Index sind pro Worktree getrennt.

Darum braucht ein Worktree kaum zusätzlichen Platz jenseits seiner
ausgecheckten Dateien. Darum sieht er neue Commits und Branches sofort. Und
darum sollte man ihn mit `git worktree remove` statt durch bloßes Löschen des
Verzeichnisses entfernen: Git muß nicht nur Dateien, sondern auch seine
Verwaltungsdaten aufräumen.
