---
author: isotopp
date: "2026-03-25T04:05:06Z"
feature-img: assets/img/background/schloss.jpg
title: "Warte, Python macht... was?"
toc: true
tags:
  - lang_de
  - python
  - security
---

Die [Heise-Meldung zum Angriff auf LiteLLM](https://www.heise.de/news/Supply-Chain-Attacke-auf-LiteLLM-Betroffene-sollen-Credentials-sofort-aendern-11223618.html) beschreibt Schadcode, der Zugangsdaten stiehlt. Er läuft bei jedem Python-Start, sobald das befallene Paket in `site-packages` liegt. Die Anwendung muss es weder importieren noch benutzen. Der Angriff nutzt eine Eigenschaft von Python, die ich bisher nicht kannte.

Laut Heise waren die befallenen LiteLLM-Versionen `1.82.7` und `1.82.8` mehrere Stunden auf PyPI verfügbar. Betroffene sollen ihre Zugangsdaten sofort ersetzen. Das ist richtig. Aber warum reicht die Installation, um den Schadcode auszuführen?

Ich habe eine Demo in [`pth-example`](https://github.com/isotopp/pth-example).

# Python und Site Packages

Python lädt beim Start normalerweise das Modul [`site`](https://docs.python.org/3/library/site.html). Es erweitert `sys.path`, verarbeitet `.pth`-Dateien in `site-packages` und versucht danach, `sitecustomize` und `usercustomize` zu importieren.

So kann ein installiertes Paket schon beim Python-Start Code ausführen.

# `.pth`-Dateien?

`.pth`-Dateien liegen in `site-packages` und enthalten meist zusätzliche Suchpfade, einen pro Zeile.

```text {linenos=inline}
/opt/vendor/lib/python
/srv/app/src
```

Die Zeilen `1` und `2` ergänzen `sys.path`. Laut Dokumentation ignoriert Python leere Zeilen, Kommentare und Pfade, die nicht existieren.

Viele Entwickler kennen `.pth`-Dateien nicht. Wer sie kennt, kennt meist nur diese Form.

# Code in `.pth`-Dateien

Die Dokumentation von [`site`](https://docs.python.org/3/library/site.html) nennt aber eine weitere Funktion:

>  Lines starting with `import` (followed by space or tab) are executed.

Die Demo nutzt eine solche Zeile:

```python {linenos=inline}
import pth_demo.bootstrap
```

Python importiert damit das Modul `pth_demo.bootstrap`. Dabei führt es dessen Code auf Modulebene aus, einschließlich der Definitionen von Funktionen und Klassen.
Das passiert beim Interpreterstart, während Python `site-packages` einrichtet. Der Start ist noch nicht abgeschlossen.

Das lässt sich beobachten:

```bash {linenos=inline}
uv run python3 -c 'print("user code")'
```

```text {linenos=inline}
Hello, Python!
user code
```

Zeile `1` kommt aus dem Demo-Code. Erst danach läuft unser `print` aus der Kommandozeile und erzeugt Zeile `2`.

# Start während der Initialisierung

Weil der Python-Start noch läuft, richtet die Demo zunächst nur einen Import-Finder ein: ein Objekt, das Importversuche beobachtet.

Diese Finder stehen in `sys.meta_path`. Bei der Suche nach einem Modul fragt Python sie der Reihe nach, ob sie dafür zuständig sind.

Hier ist der erste Teil von `src/pth_demo/bootstrap.py`:

```python {linenos=inline,linenostart=8}
class _PostSitePayloadFinder(MetaPathFinder):
    def __init__(self) -> None:
        self._armed = False
        self._done = False

    def find_spec(
        self,
        fullname: str,
        path: object = None,
        target: object = None,
    ) -> ModuleSpec | None:
        if self._done:
            return None

        if fullname == "sitecustomize":
            self._armed = True
            return None

        if fullname == "usercustomize":
            self._fire()
            return None

        if not self._armed:
            return None

        self._fire()
        return None
```

Der Ablauf:

- Zeile `10` setzt `_armed` zunächst auf `False`.
- Sobald Python `sitecustomize` laden will, setzt Zeile `23` `_armed = True`. Der Aufbau der Suchpfade ist dann abgeschlossen.
- Versucht Python danach, `usercustomize` zu laden, ruft Zeile `27` `_fire()` auf. Dieser Importversuch findet nicht in allen Python-Umgebungen statt.
- Solange `_armed` noch `False` ist, tun Zeile `30` bis `31` nichts.
- Sonst ruft Zeile `33` beim nächsten Importversuch `_fire()` auf.

Der Finder beobachtet den Importversuch. Mit `None` in Zeile `24` überlässt er das Laden von `sitecustomize` den übrigen Findern.

# `sitecustomize` als Signal

`site` versucht nach dem Aufbau der Suchpfade, `sitecustomize` zu laden, danach gegebenenfalls `usercustomize`. Fehlt `sitecustomize`, ignoriert Python den entsprechenden `ImportError`. Der Finder sieht den Importversuch trotzdem.

Für die Demo reicht dieses Signal: Die Suchpfade sind eingerichtet, die Anwendung hat noch nicht begonnen. Sie muss das Demo-Paket nicht selbst importieren.

# Demo-Code starten

Der zweite Teil von `bootstrap.py` startet den Demo-Code:

```python {linenos=inline,linenostart=36}
    def _fire(self) -> None:
        if self._done:
            return

        self._done = True
        self._remove_self()

        import pth_demo.payload

        pth_demo.payload.init()

    def _remove_self(self) -> None:
        try:
            sys.meta_path.remove(self)
        except ValueError:
            pass


def install() -> None:
    for finder in sys.meta_path:
        if isinstance(finder, _PostSitePayloadFinder):
            return

    sys.meta_path.insert(0, _PostSitePayloadFinder())


install()
```

Der Ablauf:

- Zeile `40` setzt `_done`, damit der Finder den Demo-Code nur einmal startet.
- Zeile `41` ruft `_remove_self()` auf. Zeile `49` entfernt den Finder aus `sys.meta_path`.
- Zeile `43` importiert `pth_demo.payload` erst nach dem Aufbau der Suchpfade.
- Zeile `45` ruft dessen `init()` auf.
- Zeile `54` bis `62` richten den Finder nur einmal ein, auch wenn `bootstrap` mehrfach läuft.

Mit `_done` und dem Entfernen aus `sys.meta_path` verhindert der Finder, dass weitere Imports ihn erneut auslösen.

# Demo-Code

`src/pth_demo/payload.py` enthält:

```python {linenos=inline,linenostart=1}
from __future__ import annotations

_INITIALIZED = False


def init() -> None:
    global _INITIALIZED

    if _INITIALIZED:
        return

    _INITIALIZED = True
    print("Hello, Python!")
```

Zeile `13` gibt `Hello, Python!` aus. Schon `uv run python3` führt den Code aus: Der Interpreterstart löst ihn aus.

Zeile `9` bis `12` verhindern, dass `init()` die Ausgabe wiederholt. Ein Angreifer könnte die Ausgabe in Zeile `13` durch Schadcode ersetzen.

# Folgen

- Ein installiertes Python-Paket kann beim Python-Start Code ausführen, ohne dass die Anwendung es importiert.
- Eine `.pth`-Datei kann Code laden und ausführen.
- Eine Startfunktion wie `__start__()` fehlt, aber die Importversuche für `sitecustomize` und `usercustomize` liefern brauchbare Signale.
- Wer ein befallenes Paket installiert hat, muss davon ausgehen, dass schon `python`, `uv run python3` oder ein CI-Schritt den Schadcode ausgeführt haben kann.

Prüft zuerst die `.pth`-Dateien in `site-packages`. Jede `import`-Zeile ist ausführbarer Code.

`python -S` unterdrückt den automatischen Import von `site`. Das hilft bei der Untersuchung eines Angriffs, schränkt aber auch die Python-Umgebung ein.
