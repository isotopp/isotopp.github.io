---
author: isotopp
title: "LLMs daheim mit Ollama"
date: "2024-05-31T05:06:07Z"
feature-img: assets/img/background/rijksmuseum.jpg
toc: true
tags:
- lang_de
- computer
- erklaerbaer
- ai
---

Dieser Text ist eine Art Follow-up für [Wie ChatGPT funktioniert]({{< relref "2024-02-06-wie-chatgpt-funktioniert.md" >}}).
Es geht darum, ein LLM lokal auszuführen und damit zu experimentieren.

Wer mit LLMs daheim experimentieren möchte, der steht vor dem Problem, 
einen Haufen furchtbar empfindlicher und schlecht zu aktualisierender Abhängigkeiten in Python zu installieren,
monströse Downloads zu verwalten und die Ausführung für die eigene Maschine zu optimieren.
Das wird ein bisschen verbessert mit [llama.cpp](https://github.com/ggerganov/llama.cpp),
einer C++/C Bibliothek, die einem einen Teil der Arbeit abnimmt, 
aber man hat immer noch kein Paket, mit dem man einfach Ergebnisse bekommt.

Abhilfe schafft hier [Ollama](https://github.com/ollama/ollama),
eine in Golang geschriebene Anwendung, 
die llama.cpp integriert und den Download, die Verwaltung und die Ausführung von LLMs automatisiert.
Die [Website](https://ollama.com/) verweist auf das Blog, 
den Discord und das Github von Ollama, und hat eine Suche,
mit der man auf Ollama angepasste LLms finden und herunterladen kann.

# Installation

LLMs sind rechenintensive Monster, die eine große Maschine zur Ausführung brauchen.
Aber eingedampfte Spezialversionen kann man schon auf einem großen Raspi ausführen.
Größe ist jedoch ein qualitativer Unterschied: 
Ein LLM mit 0.3 Mrd. Parameters verhält sich ganz anders als eines mit 8 Mrd. Parametern,
und dieses wiederum wird von einem LLM mit 70 Mrd. Parameters vollkommen deklassiert.
Ersteres kann man auf einem Raspi ausführen, 
die 8 Mrd. Parameter-Modelle oft auf einem Mac oder Windows-Rechner mit 32 GB RAM oder 12 GB VRAM in der Grafikkarte,
und die 70 Mrd. Parameter-Modelle brauchen in der Regel Spezialrechner mit 128 GB RAM und zwei 24 GB Nvidia-Karten kombiniert.

In meinem Fall steht mir

- ein Mac mini M2pro mit 32 GB RAM und 8+4 Cores
- ein Windows 11 Rechner mit 64 GB RAM und Nvidia 4070Ti (12 GB VRAM)

zur Verfügung. Beide Maschinen haben ausreichend Plattenplatz auf NVME.

Man kann sich Ollama von der Website herunterladen und installieren,
oder das Golang Projekt selbst clonen und compilieren,
aber die einfachste Weise der Installation sind Paketmanager für MacOS und Windows.

Auf dem Mac habe ich Homebrew, und `brew install ollama` ist die schnellste und einfachste Methode,
Ollama zu installieren und aktuell zu halten.
Auf Windows geht dasselbe mit [Scoop](https://scoop.sh/), `scoop install ollama` regelt die Details.

# `ollama serve` ausführen

Ollama wird als Server ausgeführt. 
Dazu muss man `ollama serve` starten.

Alle weiteren Operationen setzen voraus, daß in einem Fenster irgendwo `ollama serve` aktiv ist,
denn alle weiteren Operationen tun nichts anderes als REST-Requests an `ollama serve` zu senden.
Dies kann mit der `ollama`-Kommandozeile passieren, oder man schreibt sich eigene Python-Programme, die das tun

```console
$ ollama serve
kk:~ kris$ ollama serve
2024/05/31 09:52:25 routes.go:1008: INFO server config 
  env="map[OLLAMA_DEBUG:false OLLAMA_LLM_LIBRARY: OLLAMA_MAX_LOADED_MODELS:1 OLLAMA_MAX_QUEUE:512
   OLLAMA_MAX_VRAM:0 OLLAMA_NOPRUNE:false OLLAMA_NUM_PARALLEL:1 
   OLLAMA_ORIGINS:[http://localhost ... https://0.0.0.0:*] 
   OLLAMA_RUNNERS_DIR: OLLAMA_TMPDIR:]"
time=2024-05-31T09:52:25.124+02:00 level=INFO source=images.go:704 msg="total blobs: 28"
time=2024-05-31T09:52:25.131+02:00 level=INFO source=images.go:711 msg="total unused blobs removed: 0"
[GIN-debug] [WARNING] Creating an Engine instance with the Logger and Recovery middleware already attached.
...
time=2024-05-31T10:02:15.032+02:00 level=INFO source=payload.go:44 msg="Dynamic LLM libraries [metal]"
time=2024-05-31T10:02:15.090+02:00 level=INFO source=types.go:71 msg="inference compute" 
  id=0 library=metal compute="" driver=0.0 name="" total="21.3 GiB" available="21.3 GiB"

```

Ollama lädt später Parameterdaten für die LLMs herunter. Diese nehmen einige Gigabyte Plattenplatz ein.
Per Default legt das MacOS Ollama dies im Home des Benutzers ab, in `$HOME/.ollama/models`.
Man kann dies mit einer Umgebungsvariable umstellen.

In diesem Fall muss man `OLLAMA_MODELS` setzen:

```console
kk:~ kris$ ollama serve --help
Start ollama

Usage:
  ollama serve [flags]

Aliases:
  serve, start

Flags:
  -h, --help   help for serve

Environment Variables:

    OLLAMA_HOST         The host:port to bind to (default "127.0.0.1:11434")
    OLLAMA_ORIGINS      A comma separated list of allowed origins
    OLLAMA_MODELS       The path to the models directory (default "~/.ollama/models")
    OLLAMA_KEEP_ALIVE   The duration that models stay loaded in memory (default "5m")
    OLLAMA_DEBUG        Set to 1 to enable additional debug logging

$ kk:~ kris$ mkdir /Volumes/Ablage/Torch/ollama-models/
$ OLLAMA_MODELS=/Volumes/Ablage/Torch/ollama-models/ ollama serve
```

Der Speicher dort sollte schnell sein und ausreichend Raum bereitstellen:

```console
kk:~ kris$ df -h /Volumes/Ablage
Filesystem      Size    Used   Avail Capacity iused ifree %iused  Mounted on
/dev/disk9s1   3.6Ti   804Gi   2.9Ti    22%    360k   31G    0%   /Volumes/Ablage
kk:~ kris$ du -sh /Volumes/Ablage/Torch/ollama-models
 54G	/Volumes/Ablage/Torch/ollama-models
kk:~ kris$ ollama list
NAME                    	ID          	SIZE  	MODIFIED
llama3:70b-instruct-q2_K	693db6efd8f9	26 GB 	6 days ago
llama3:instruct         	365c0bd3c000	4.7 GB	6 days ago
mistral:instruct        	2ae6f6dd7a3d	4.1 GB	6 days ago
gemma:instruct          	a72c7f4d0a15	5.0 GB	6 days ago
llama3-gradient:instruct	5d1398df5b8b	4.7 GB	6 days ago
phi3:14b                	1e67dff39209	7.9 GB	7 days ago
llava-llama3:latest     	44c161b1f465	5.5 GB	7 days ago
llama3-gradient:latest  	5d1398df5b8b	4.7 GB	7 days ago
phi3:14b-instruct       	1e67dff39209	7.9 GB	7 days ago
```

Der Ollama-Server bindet sich an localhost, Port 11434 und lauscht nun auf eingehende REST-Requests.
Diese können dazu führen, daß ein Model geladen und ausgeführt wird.
Das kann beim ersten Mal einige Zeit dauern, da viele Gigabyte Daten geladen werden müssen.

Der Server hält das Model einige Zeit im Speicher, `OLLAMA_KEEP_ALIVE` viele Minuten.
Der Default ist 5 m.
Danach wird der Speicher wieder freigegeben.

# Modelle aus dem Internet laden

LLMs sind recht komplizierte Konstrukte mit der eigentlichen Parameter-Datei, die den Großteil der Daten aus macht,
einem Systemprompt und weiteren Layers, die meist eher nicht so groß sind.
Auf einem handelsüblichen Desktop-Rechner kann man erwarten, ein "7B" oder "8B"-Modell auszuführen.
Dies belegt zwischen 5 GB und 9 GB an Speicher, im RAM oder auf der Grafikkarte.

Richtig große Modelle, 70B-Modelle, brauchen wesentlich mehr Speicher und eine Hardware, 
die für die Ausführung von LLMs auf mehreren Grafikkarten vorbereitet ist.

Ein guter Startpunkt ist das Mistral AI-Model [Mistral](https://ollama.com/library/mistral).
Man lädt es mit `ollama pull mistral:instruct` herunter.
Das wird Zeit lang dauern und das Model-Directory entsprechend voll machen.

**HINWEIS:** Noch einmal die Erklärung, daß alle Arbeit von `ollama serve` erledigt wird.
Wenn dieses Kommando nicht aktiv ist, funktioniert keines der anderen Kommandos.
`ollama pull`, `ollama run` und auch `ollama rm` senden lediglich REST-Requests an den Server,
der dann die Arbeit macht.

```console
kk:~ kris$ ollama pull mistral:instruct
pulling manifest
pulling ff82381e2bea... 100% ▕████████████████▏ 4.1 GB
pulling 43070e2d4e53... 100% ▕████████████████▏  11 KB
pulling c43332387573... 100% ▕████████████████▏   67 B
pulling ed11eda7790d... 100% ▕████████████████▏   30 B
pulling 42347cd80dc8... 100% ▕████████████████▏  485 B
verifying sha256 digest
writing manifest
removing any unused layers
success

```

# Modelle ausführen

Das Modell kann man mit `ollama run mistral:instruct` testen.

```console
>>> /set verbose
Set 'verbose' mode.
>>> Explain in a single sentence "Why is the sky blue?"
 The sky appears blue because molecules in the Earth's atmosphere scatter
sunlight in all directions, and blue light is scattered more because it
travels in shorter, smaller waves.


total duration:       1.559908875s
load duration:        2.719417ms
prompt eval count:    23 token(s)
prompt eval duration: 303.421ms
prompt eval rate:     75.80 tokens/s
eval count:           41 token(s)
eval duration:        1.245361s
eval rate:            32.92 tokens/s
```

Wir sehen hier, daß mein M2 pro mini 32 GB 1.56 Sekunden gebraucht hat, um diese Antwort zu generieren.
Die Frage hat "23 Token" belegt, die mit 75 Token/s analysiert worden sind.

Die Generierung der Ausgabe hat 41 Token erzeugt, 1.25s gedauert und ist mit 33 Token/s gelaufen.
Der Rechner hat dabei ca. 50 Watt gezogen. Normal verbraucht er circa 7 Watt, also werden 43 Watt mehr verbraucht.

![](/uploads/2024/05/ollama-3.png)

*Ausgabe der MacOS App Stats (`brew install stats`), der Rechner verbraucht normal ca. 7 Watt, mit dem LLM aktiv 50 Watt.*

![](/uploads/2024/05/ollama-1.png)

*Ausgabe der MacOS App Stats, hier: GPU Auslastung. Dies ist die einzige Anwendung, die die Mac mini GPU an den Anschlag bringt.*

Die Nvidia 4070Ti kommt auf mehr als 70 Token/s, zieht aber über 400 W.

Der `ollama run`-Prompt kann mit `/bye` verlassen werden.

Die vorhandenen Modelle können mit `ollama list` aufgelistet werden.
Mit `ollama rm` löscht man ein lokales Modell und gibt den Plattenplatz frei.
Es muss dann neu heruntergeladen werden.

```console
kk:~ kris$ ollama rm llama3:instruct
deleted 'llama3:instruct'
```

# Arbeiten mit `ollama run`: Texte zusammenfassen

Für das folgende Beispiel ist ein laufender Server `ollama serve` erforderlich,
das Modell `mistral:instruct` muss bereitstehen (d.h. `ollama list` zeigt es an),
und wir verwenden den Text [The 64-Square Madhouse](https://www.gutenberg.org/files/61213/61213.txt) von Fritz Leiber.

Das Ziel ist es, Ollama diesen Text mithilfe von Llama 3 zusammenfassen zu lassen.

1. Den Text von Fritz Leiber vom Projekt Gutenberg herunterladen.
   Es ist hilfreich, allen Copyright-Text am Anfang und am Ende wegzuschneiden,
   um dem Modell nur die Story selbst zu füttern. 
2. Server starten: `ollama serve`.
   Dabei sind ggf. die notwendigen Parameter als Umgebungsvariablen zu setzen, damit die Modelle gefunden werden.
3. Modell prüfen: `ollama list` zeigt das Modell `mistral:instruct` als vorhanden an. 
   Ansonsten muss es mit `ollama pull mistral:instruct` heruntergeladen werden.
4. Den Prompt mit `ollama run mistral:instruct` starten.

Wir verwenden hier das Modell `mistral:instruct` von [Mistral AI](https://en.wikipedia.org/wiki/Mistral_AI).
Das ist eine Firma von ehemaligen Google und Meta/Facebook Mitarbeitern, die vor einem Jahr in Paris gegründet wurde.

Auf dem Prompt erfolgt die Kommunikation mit dem Modell in Englisch.
Manche Modelle sind ausdrücklich mehrsprachig trainiert (zum Beispiel [Mixtral](https://ollama.com/library/mixtral)), 
aber wenn dies in der Anleitung zum Modell nicht angegeben ist, ist Englisch zu verwenden.

Wir können dem Modell eine Anfrage in einer Zeile stellen.
Mehrzeilige Anweisungen werden mit `"""` eingeleitet und genau so beendet.

Es ist ein `instruct`-Modell, es wird also keine Annahmen machen, sondern wir müssen Arbeitsanwendungen geben.

Wir können dem Client Parameter setzen.
Dies erfolgt mit `/`-Kommandos, `/help` für eine Übersicht.

Modelle haben Parameter.
Ein wichtiger Parameter ist `num_ctx` (manchmal auch n_ctx).
Er bestimmt die Anzahl der Token, die das Modell als Kontextspeicher für die Antwortgenerierung verwendet.

Ein Embedding ist ein vieldimensionaler Vektor, der Bedeutung von Worten codiert.
Es belegt etwa 1 Kilobyte an Speicher.
Ein Token ist ein Zeiger auf ein Embedding, aber im Kontext der Antwortgenerierung wird das Token kopiert.
Ein Kontext von 65536 belegt also in etwa 64 MB Speicher.
In englischer Sprache entspricht ein Wort in etwa 1.3 Tokens.

Unser Beispieltext hat, nachdem wir vorne und hinten alles das wegschneiden,
was Projekt Gutenberg als Disclaimer hinzugefügt hat,
eine Größe von circa 14.000 Worten:

```console
kk:~ kris$ wc leiber-64-square.txt
    1824   13853   84236 leiber-64-square.txt
```

Wenn wir dem Modell einen Kontext von 65536 Token geben, dann sollte es mit der Geschichte gut zurechtkommen.
**HINWEIS:*** Es heißt `/set parameter num_ctx 65536`, nicht `/set num_ctx 65536`.

```console
kk:~ kris$ ollama run mistral:instruct
>>> /set verbose
Set 'verbose' mode.
>>> /set parameter num_ctx 65536
Set parameter 'num_ctx' to '65536'
>>> """
... You are an english teacher.
... Summarize the following story,
... providing an overview over the main characters of the story,
... and a paragraph for each scene or major event that happens in the course of
... the story.
... As a conclusion, provide context: What is the story about?
... 
... The story:
```

Wir setzen also `/set verbose`, um Statistiken zu bekommen.
Wir setzen dann den Parameter `/set parameter num_ctx 65536`, um dem Modell genug Arbeitskontext zu geben.
Danach leiten wir mit `"""` einen mehrzeiligen Input ein.
Dieser wird durch `"""` auf einer neuen Zeile genau so abgeschlossen.

In einem anderen Fenster laden wir nun die Story in den Paste-Buffer:

```console
(venv) kk:keks kris$ cat leiber-64-square.txt | pbcopy
(venv) kk:keks kris$
```

Diese kann nun in den Ollama-Prompt gepasted werden.

```console
...
... Sandra said, "Well, there's something you can't build into a
... machine--ego."
...
... "Oh, I don't know about that," said Simon Great.
...
... """
```

Die generierte Antwort des Modells lautet:

> This story is about a chess tournament featuring an electronic computing
machine named the Machine. The Machine is entering its first international
grandmaster chess tournament, and the large hall where the event takes
place is filled with energetic dark-suited men who are either playing
chess or discussing it. There are signs featuring various combinations of
letters such as FIDE, WBM, USCF, USSF, USSR, and UNESCO, and many clocks
bedside table size with red flags and wheels on their faces are present to
keep track of each player's moves. The Machine is programmed by a
psychologist named Simon Great, who has been out of tournament chess for
twenty years but is now making a comeback.
> 
> The main characters in the story are Sandra Lea Grayling, a journalist for
the _Chicago Space Mirror_, and Dr. Krakatower, a former grandmaster of
chess who is also a special correspondent for the London Times. The
Machine is also a character, as it plays against various human opponents
throughout the tournament.
> 
> The story unfolds over the course of several days, with each scene or
major event taking place during one of the nine rounds of the tournament.
In the first round, the Machine plays against Bela Grabo and wins the
game. This causes a stir among the players and spectators, as many believe
that the Machine is too good to be true. In the second round, the Machine
faces off against Votbinnik and again emerges victorious. This pattern
continues throughout the tournament, with the Machine consistently
outplaying its human opponents.
> 
> Dr. Krakatower struggles throughout the tournament, losing several games
and finding himself in last place. However, he manages to draw his game
against Sherevsky in the next to last round, which gives him a small
glimmer of hope. In the final round, the Machine plays against Willie
Angler, who has been consistently strong throughout the tournament. The
outcome of this match will determine the winner of the tournament.
> 
> As the story reaches its conclusion, it is revealed that Angler had
intentionally played a flawed move in his game against the Machine, as he
had discovered an error in the programming of the Machine's opening moves.
This tactic pays off, and Angler wins the game and the tournament. The
final standing shows that Angler and Votbinnik are tied for first place,
with the Machine in second.
> 
> The story concludes with a discussion between Simon Great, Willie Angler,
and Dr. Krakatower about the future of chess and computer programming. It
is suggested that grandmaster chess without computers will become less
popular, as players will increasingly rely on computers to aid them in
their games. The story also touches on the idea of man-machine symbiosis,
with the implication that future grandmasters may be a combination of
human and machine. The story serves as a commentary on the changing nature
of chess and the role of technology in society.

und

```console
total duration:       3m33.240299458s
load duration:        20.467748958s
prompt eval count:    22580 token(s)
prompt eval duration: 1m58.450477s
prompt eval rate:     190.63 tokens/s
eval count:           634 token(s)
eval duration:        1m14.263155s
eval rate:            8.54 tokens/s
```

Wir haben eine recht gute Evaluation Rate: 190 Token/s.
Die Generierung der Antwort ist langsamer, auch wegen des großen Kontexts, den wir gesetzt haben: 8.5 Token/s.

Eine Laufzeit von 3 Minuten bei einem Mehrverbrauch von 43 Watt entspricht einem Energieaufwand von 2.15 Wh.
Bei einem Preis von 32 Cent pro 1000 Wh (1 kWh) sind das 2.15/1000 * 32 = .0672 Cent zur Generierung der Ausgabe.

# Selbst coden

Es gibt eine Ollama Python Bibliothek.
Diese tut nicht mehr, als Requests an `ollama serve` zu senden:

- [ollama-python](https://github.com/ollama/ollama-python)
- [ollama API Dokumentation](https://github.com/ollama/ollama/tree/main/docs), api.md
- [Mistral Model Documentation](https://docs.mistral.ai/), die Code-Beispiele dort gehen davon aus, 
  daß man deren Server verwendet. Das tun wir nicht, wir verwenden Ollama und eine lokale Instanz. 

Die REST API ist in `api.md` im Ollama Quelltext-Tree auf Github dokumentiert.

Die `ollama.chat()`-Funktion (und auch die gleichnamige Funktion der Mistral API, die gegen deren Instanz arbeitet),
hat einen Parameter `messages` (Plural, eine Liste).
Das LLM ist stateless.
Es kann sich nicht an vorhergehende Nachrichten erinnern.
Daher muss man dem Modell bei jedem Request alle vorhergehenden Fragen und Antworten und auch den Systemprompt mitsenden.

```python
    o = ollama.Client(host="127.0.0.1")

    response = o.chat(
        model="mistral:instruct",
        messages=[
            {
                "role": "system",
                "content": instructions,
            },
            {
                "role": "user",
                "content": old_message
            }
            {
                "role": "assistant",
                "content": old_answer,
            },
            {
                "role": "user",
                "content": message,
            },
        ],
    )
```

Genauso muss man `options={}` mitsenden, wenn man zum Beispiel mehr Kontext braucht.

Die Anleitung zu Mistral gibt bessere 
[Summarization Prompts](https://docs.mistral.ai/guides/prompting_capabilities/#summarization)
als Beispiel und erklärt im hinteren Teil mehr zu Tokens, Tokenization und zum direkten Umgang mit dem LLM.
