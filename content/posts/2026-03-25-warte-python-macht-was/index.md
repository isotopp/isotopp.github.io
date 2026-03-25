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
aliases:
  - /2026/03/25/warte-python-macht-was.html
---

In der [Heise-Meldung zur Supply-Chain-Attacke auf LiteLLM](https://www.heise.de/news/Supply-Chain-Attacke-auf-LiteLLM-Betroffene-sollen-Credentials-sofort-aendern-11223618.html) ist die Rede von einem Credential-Stealer in LiteLLM. Der wird bei jedem Start von Python aktiviert, wenn LiteLLM installiert ist, auch dann, wenn das Paket nicht importiert wird oder benutzt wird. Es reicht, wenn es ist den Site Packages enthalten ist. Das ist der interessante Teil an dem Angriff, weil er eine Eigenschaft von Python ausnutzt, die mir bisher nicht geläufig war.

Laut Heise waren die kompromittierten LiteLLM-Versionen `1.82.7` und `1.82.8` mehrere Stunden auf PyPI verfügbar. Betroffene sollen Credentials sofort rotieren. Das ist die richtige operative Reaktion. Technisch spannender ist aber die Frage: Wie wird so ein Payload eigentlich aktiviert, also genauer: Warum reicht es, das Paket installiert zu haben?

Ich habe eine Demo in [`pth-example`](https://github.com/isotopp/pth-example).

# Python und Site Packages

Python startet normalerweise nicht mit einem komplett nackten Interpreter. Standardmaessig wird das Modul [`site`](https://docs.python.org/3/library/site.html) automatisch geladen. Dieses Modul erweitert `sys.path`, verarbeitet `.pth`-Dateien in `site-packages` und versucht danach `sitecustomize` und `usercustomize` zu importieren.

Das ist normales Python-Verhalten. Und genau deshalb ist es für Supply-Chain-Angriffe interessant: Paketinstallation ist in Python nicht nur Dateikopie, sondern sehr schnell auch Code-Ausführung.

# `.pth`-Dateien?

`.pth`-Dateien sind zunächst einmal harmlose Pfadkonfiguration. Sie liegen in `site-packages` und enthalten typischerweise einfach zusätzliche Suchpfade, je eine Zeile pro Eintrag.

```python {linenos=inline}
/opt/vendor/lib/python
/srv/app/src
```

Die Zeilen `1` und `2` sind genau das, was man erwartet: weitere Einträge fuer `sys.path`. Laut Python-Dokumentation werden leere Zeilen und Kommentare ignoriert, nicht existente Pfade ebenfalls.

Der Mechanismus der `.pth`-Dateien ist selbst schon esotherisch, er ist vielen Entwicklern nicht aktiv bekannt. Aber selbst wenn Leute von `.pth`-Dateien wissen kennen sie meist nur diese Form.

# `import`-Variante von `.pth`

Die Dokumentation von [`site`](https://docs.python.org/3/library/site.html) jedoch:

>  Lines starting with `import` (followed by space or tab) are executed.

Die Demo benutzt genau so eine Datei:

```python {linenos=inline}
import pth_demo.bootstrap
```

Die Datei wird also geladen und der Code daraus, der Funktionen und Klassen definiert macht genau das.
Code auf dem Toplevel wird, wie üblich, als Modul-Initialisierung ausgeführt.
Das passiert jedoch beim Interpreterstart, also während der Initialisierung von `site-packages`, wenn das Runtime noch nicht komplett ist.

Die Execution kann man direkt beobachten:

```bash {linenos=inline}
uv run python3 -c 'print("user code")'
```

```text {linenos=inline}
Hello, Python!
user code
```

Die Ausgabe in Zeile `1` kommt aus dem Payload. Erst danach erreicht der Prozess in Zeile `2` den eigentlichen Benutzer-Code.

# Start während der Initialisierung

Ein `.pth`-`import` laeuft wie gesagt beim Interpreterstartt, also sehr früh. Zu diesem Zeitpunkt ist der Interpreter zwar schon da, aber der Start ist noch nicht fertig. Genau deshalb macht die Demo in der `pth`-Datei nicht viel direkt, sondern installiert nur einen Meta-Path-Handler, das Python Äquivalent zu einem Java Classloader.

Meta-Path-Handler hängen in `sys.meta_path`. Immer, wenn Python ein Modul importieren will, fragt es diese Finder der Reihe nach, ob sie für dieses Modul zuständig sind. Sie werden also nicht einmal aufgerufen, sondern bei jedem Importversuch.

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

Die Struktur ist simpel:

- In Zeile `10` ist der Finder am Anfang noch nicht "scharf".
- In Zeile `22` schaut er auf den Importnamen. Sobald Python `sitecustomize` laden will, setzt er in Zeile `23` `_armed = True`. Das `sitecustomize` signaliert den Abschluss der Initialisierung, der Interpreter hat also ein komplettes Runtime.
- In Zeile `30` bis `31` prüfen wir, ob der Mechanismus scharf geschaltet ist. Wenn nein, machen wir nichts.
- In Zeile `26` bis `28` prüfen wir auf das Laden von `usercustomize` – das passiert nach `sitecustomize`, aber nicht in allen Python-Interpretern. Wie dem auch sei, wenn es passiert, wissen wir, daß wir ein komplettes Environment haben.
- In Zeile `33` wird ansonsten beim nächsten beliebigen Import nach `sitecustomize` gefeuert.

Das ist wichtig: Der Finder kapert nicht den Import von `sitecustomize`. Er beobachtet nur, dass dieser Importversuch stattfindet und weiß dann, dass das Environment komplett ist. Er gibt in Zeile `24` weiter `None` zurueck, damit die normale Importlogik weiterläuft.

# `sitecustomize` als Endesignal für die Initialisierung

`sitecustomize` ist für die Demo der entscheidende Marker. Laut Python-Dokumentation versucht `site` nach den Pfadmanipulationen genau dieses Modul zu laden, danach `usercustomize`. Falls `sitecustomize` gar nicht existiert, wird der `ImportError` still ignoriert. Für den Finder ist das egal. Der Importversuch findet trotzdem statt, und genau dieser Versuch ist das Signal.

Praktisch bedeutet das: Wenn `sitecustomize` angefragt wird, ist der Interpreter weit genug, dass `site` seine Vorarbeit erledigt hat. Wir sind nicht mehr mitten im empfindlichen Pfadaufbau, sondern an einem Punkt, an dem unmittelbar danach reguläre Import und Benutzer-Code folgen.

Wir landen also in einer kompletten Umgebung, aber bevor irgendwelcher Usercode zum Zug kommt. Und immer, auch dann, wenn unser Code nie importiert wird.

# Payload starten

Der zweite Teil von `bootstrap.py` führt den eigentlichen Payload aus:

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

Was passiert?

- Zeile `40` setzt `_done`, damit der Finder genau einmal feuert.
- Zeile `41` entfernt den Finder sofort wieder aus `sys.meta_path`. Das führt zu Zeile 49:
- Zeile `49` ist die eigentliche `remove_self()` Methode.
- Zeile `43` importiert erst jetzt den eigentlichen Payload, also nicht in der empfindlichen `.pth`-Phase.
- Zeile `45` ruft die Initialisierung explizit auf.
- Zeile `54` bis `62` sorgen dafür, dass der Finder genau einmal installiert wird, auch wenn `bootstrap` aus irgendeinem Grund mehrfach importiert werden sollte.

Der Finder blockiert und entfernt sich, damit weitere Imports nicht zu rekursiven Aufrufen führen.

# Payload

Die eigentliche Nutzlast in `src/pth_demo/payload.py` ist banal:

```python {linenos=table,linenostart=1}
from __future__ import annotations

_INITIALIZED = False


def init() -> None:
    global _INITIALIZED

    if _INITIALIZED:
        return

    _INITIALIZED = True
    print("Hello, Python!")
```

Zeile `13` macht nichts weiter als `Hello, Python!` auszugeben. Es reicht ein einfaches `uv run python3`, um den Code auszuführen, weil der Auslöser nicht die Anwendung ist, sondern der Interpreterstart.

Die Schutzschranke in Zeile `9` bis `12` verhindert nur doppelte Initialisierung. Für einen realen Angreifer stünde dort statt ab Zeile 13 dann die eigentliche Payload.

# "Python macht... was?"

Wir lernen:

- Ein Python-Paket kann beim Start von Python aktiv werden, ohne dass die Anwendung das Paket explizit importiert.
- Eine `.pth`-Datei kann Code laden und ausführen.
- Es gibt keinen "Imterpreter ready"-Callback (`__start__()`), aber `sitecustomize` und `usercustomize` sind brauchbare Signale.
- Wer ein kompromittiertes Paket installiert hat, muss davon ausgehen, dass schon ein banales `python`, `uv run python3` oder ein CI-Schritt gereicht haben kann.

Wer defensiv prüfen will, schaut zuerst in `site-packages` nach `.pth`-Dateien und liest jede `import`-Zeile so, wie sie gelesen werden muss: als ausführbaren Code.

Und ja: `python -S` unterdrückt den automatischen Import von `site`. Das ist für Analyse und Incident Response nützlich. Aber ein `python -S` ist auch nur eingeschränkt brauchbar.
