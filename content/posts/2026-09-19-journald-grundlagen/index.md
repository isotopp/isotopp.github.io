---
author: isotopp
date: "2026-09-19T01:02:03Z"
feature-img: assets/img/background/rijksmuseum.jpg
tags:
  - lang_de
  - linux
  - devops
  - erklaerbaer
title: "Logging mit journalctl: Grundlagen von journald"
---

`systemd` nimmt einem Dienst einen großen Teil der klassischen Daemonologie ab. Ein Programm muß sich nicht selbst in den Hintergrund forken, sein Controlling Terminal verlieren, PID-Dateien verwalten und einen Syslog-Client einbauen. Es kann im Vordergrund laufen und nach `stdout` und `stderr` schreiben. Der Service Manager startet es, hält seinen Zustand fest und verbindet seine Ausgaben normalerweise mit `systemd-journald`.

`journald` speichert nicht einfach Zeilen in einer Textdatei. Ein Journal-Eintrag besteht aus Feldern wie `MESSAGE`, `PRIORITY`, `_PID`, `_UID`, `_SYSTEMD_UNIT` und `_BOOT_ID`. Viele davon ergänzt `journald` aus vertrauenswürdigen Prozessdaten. Die Einträge lassen sich nach jedem Feld filtern und in verschiedenen Formaten ausgeben.

Damit entfallen für diese Logs auch `logrotate` und das nachträgliche Zerlegen von Syslog-Zeilen. `journald` rotiert seine binären Journal-Dateien selbst und begrenzt ihren Platzverbrauch oder ihr Alter. Das [Handbuch von systemd-journald](https://www.freedesktop.org/software/systemd/man/latest/systemd-journald.service.html) beschreibt die Eingänge und die Speicherung; [`journalctl`](https://www.freedesktop.org/software/systemd/man/latest/journalctl.html) ist das Werkzeug zum Lesen.

# Ein Dienst schreibt ins Journal

Für einen normalen Service ist keine Logging-Integration nötig:

```systemd
[Service]
Type=simple
ExecStart=/usr/local/bin/chatto-releasebot
```

Was der Prozess auf `stdout` oder `stderr` schreibt, landet zeilenweise im Journal. `StandardOutput=journal` ist für Services die Voreinstellung; `StandardError=inherit` folgt standardmäßig dem Ziel von `stdout`. Die Details stehen bei [`StandardOutput=` und `StandardError=`](https://www.freedesktop.org/software/systemd/man/latest/systemd.exec.html#StandardOutput=).

Das Programm sollte im Vordergrund laufen und seine normale Ausgabe nicht durch eigenes Forken oder eine Logdatei vor `systemd` verstecken. Das ist einfacher zu entwickeln und lokal zu testen:

```bash
$ /usr/local/bin/chatto-releasebot
Observed version: 0.5.0-beta.4
Already announced.
```

Unter `systemd` erscheinen dieselben Zeilen zusammen mit den Meldungen des Service Managers:

```text
Sep 19 14:31:38 kvm.koehntopp.de systemd[50175]: Starting Announce current Chatto release...
Sep 19 14:31:38 kvm.koehntopp.de chatto-releasebot[562549]: Observed version: 0.5.0-beta.4
Sep 19 14:31:38 kvm.koehntopp.de chatto-releasebot[562549]: Already announced.
Sep 19 14:31:38 kvm.koehntopp.de systemd[50175]: Finished Announce current Chatto release.
```

`stdout` ist dabei nur der Transport. `journald` ergänzt unter anderem PID, UID, Executable, Cgroup, Unit, Boot-ID und Zeitstempel. Eine Zeile JSON auf `stdout` bleibt allerdings eine Zeichenkette im Feld `MESSAGE`; die enthaltenen JSON-Keys werden nicht automatisch zu Journal-Feldern.

# Logs auswählen

Ohne Optionen zeigt `journalctl` alle Einträge, die der aufrufende Benutzer lesen darf. Root sowie Mitglieder bestimmter administrativer Gruppen können normalerweise das System-Journal lesen. `--user` beschränkt die Auswahl auf Dienste des eigenen User Managers, `--system` auf Systemdienste und Kernel.

Der häufigste Filter ist die Unit:

```bash
# System-Service
journalctl -u ssh.service

# User-Service
journalctl --user -u chatto-releasebot.service
```

Mit `-f` folgt `journalctl` neuen Einträgen, mit `-n` begrenzt es die Ausgabe:

```bash
journalctl --user -f -u chatto-releasebot.service
journalctl --user -u chatto-releasebot.service -n 10
```

Zeitangaben akzeptieren sowohl absolute als auch relative Werte. Die vollständige Syntax steht in [`systemd.time(7)`](https://www.freedesktop.org/software/systemd/man/latest/systemd.time.html):

```bash
# Seit einem Zeitpunkt
journalctl --since today
journalctl --since "1 hour ago"
journalctl --since "2026-09-19 14:00"

# Ein Zeitfenster
journalctl --since "14:00" --until "15:00"

# Aktueller und vorheriger Boot
journalctl -b
journalctl -b -1

# Kernel-Meldungen des aktuellen Boots
journalctl -k -b
```

Die vorhandenen Boots zeigt `journalctl --list-boots`. Die Kombination aus Boot, Unit und Zeitraum ist meist ergiebiger als ein `grep` über alle Meldungen.

Für die Suche im Text gibt es `--grep`. Es verwendet reguläre Ausdrücke:

```bash
journalctl -u ssh.service --grep='failed'
```

# Prioritäten sind Bereiche

Die acht Syslog-Prioritäten reichen von `emerg` mit dem numerischen Wert 0 bis `debug` mit 7:

| Wert | Name      | Bedeutung                 |
|-----:|-----------|---------------------------|
| 0    | `emerg`   | System unbenutzbar        |
| 1    | `alert`   | sofortiges Eingreifen     |
| 2    | `crit`    | kritischer Zustand        |
| 3    | `err`     | Fehler                    |
| 4    | `warning` | Warnung                   |
| 5    | `notice`  | wichtiges normales Ereignis |
| 6    | `info`    | Information               |
| 7    | `debug`   | Debugging                 |

Ein einzelner Wert bei [`--priority=`](https://www.freedesktop.org/software/systemd/man/latest/journalctl.html#-p) bedeutet „diese Priorität und alles Wichtigere“. Das ist der Punkt, über den man regelmäßig stolpert:

```bash
# err, crit, alert und emerg
journalctl -p err

# warning und alles Wichtigere
journalctl -p warning

# ausschließlich err
journalctl -p err..err

# info bis einschließlich debug
journalctl -p info..debug
```

# Ein Eintrag ist ein Satz von Feldern

Die normale Ausgabe sieht absichtlich wie klassisches Syslog aus. `-o verbose` zeigt stattdessen die Felder eines Eintrags:

```text
$ journalctl --user -o verbose -n 1
Sat 2026-09-19 14:31:38.375293 UTC
    _UID=9000
    _GID=9000
    _BOOT_ID=0827e543c22441a795c53a0303dafdb3
    _MACHINE_ID=f887fe52be104259aed255488762722d
    _HOSTNAME=kvm.koehntopp.de
    PRIORITY=6
    SYSLOG_IDENTIFIER=systemd
    JOB_ID=1860
    JOB_TYPE=start
    _PID=50175
    _SYSTEMD_USER_UNIT=init.scope
    MESSAGE=Finished Announce current Chatto release.
    JOB_RESULT=done
    MESSAGE_ID=39f53479d3a045ac8e11786248231fbf
```

Eine Beschreibung der bekannten Namen steht in [`systemd.journal-fields(7)`](https://www.freedesktop.org/software/systemd/man/latest/systemd.journal-fields.html). Felder mit führendem Unterstrich wie `_PID` und `_UID` sind vertrauenswürdige Felder: `journald` ermittelt sie selbst, ein Client darf sie nicht setzen.

Jedes Feld kann direkt als Match verwendet werden:

```bash
journalctl --user _PID=50175
journalctl --user JOB_ID=1860
journalctl _BOOT_ID=0827e543c22441a795c53a0303dafdb3
```

Matches auf verschiedene Felder werden mit AND verknüpft. Mehrere Werte desselben Feldes sind Alternativen:

```bash
# Diese Unit und genau diese PID
journalctl _SYSTEMD_UNIT=ssh.service _PID=1234

# ssh.service oder cron.service
journalctl _SYSTEMD_UNIT=ssh.service _SYSTEMD_UNIT=cron.service
```

Mit `+` lassen sich ganze Match-Gruppen durch OR verbinden. Die Regeln stehen im Abschnitt [Description von `journalctl(1)`](https://www.freedesktop.org/software/systemd/man/latest/journalctl.html#Description).

Welche Felder und Werte tatsächlich vorhanden sind, läßt sich aus dem Journal selbst ermitteln:

```bash
# Alle verwendeten Feldnamen
journalctl -N

# Alle vorhandenen Werte eines Feldes
journalctl -F _SYSTEMD_UNIT
journalctl -F SYSLOG_IDENTIFIER
```

# Ausgabe für Menschen und Programme

Für Menschen ist die kurze Standardausgabe meist richtig. `-o cat` gibt nur `MESSAGE` aus. `-o short-iso-precise` liefert präzise ISO-Zeitstempel. Für Programme gibt es unter anderem `json`, `json-pretty`, `json-seq` und das verlustfreie Journal-Exportformat:

```bash
journalctl -u ssh.service -o short-iso-precise
journalctl -u ssh.service -o cat
journalctl -u ssh.service -o json
journalctl -u ssh.service -o export
```

Ein Skript sollte nicht die optisch angenehme Standardausgabe parsen. Es sollte JSON, das Exportformat oder direkt die Journal-API verwenden. Mit `--output-fields=` kann es die Ausgabe auf benötigte Felder begrenzen.

# Konfiguration und Aufbewahrung

Die Konfiguration besteht aus der Hauptdatei und Drop-ins. `systemd-analyze cat-config` zeigt die gefundenen Dateien in der Reihenfolge, in der sie ausgewertet werden:

```bash
systemd-analyze cat-config systemd/journald.conf
```

Damit sieht man nicht nur einen Wert, sondern auch seine Herkunft. Ein späteres Drop-in überschreibt bei einfachen Optionen einen früheren Wert. Auskommentierte Zeilen in der Hauptdatei dokumentieren häufig die einkompilierten Defaults; sie sind selbst keine Konfiguration. Der Befehl und seine Suchpfade sind unter [`cat-config`](https://www.freedesktop.org/software/systemd/man/latest/systemd-analyze.html#systemd-analyze%20cat-config%20NAME%7CPATH...) dokumentiert.

Eine lokale Konfiguration gehört in ein Drop-in:

```ini
# /etc/systemd/journald.conf.d/10-persistent.conf
[Journal]
Storage=persistent
SplitMode=uid
SystemMaxUse=4G
MaxRetentionSec=180day
```

Danach wird `systemd-journald` neu gestartet:

```bash
systemctl restart systemd-journald.service
```

Die vier Optionen haben unterschiedliche Aufgaben:

- [`Storage=persistent`](https://www.freedesktop.org/software/systemd/man/latest/journald.conf.html#Storage=) speichert bevorzugt unter `/var/log/journal`. Während des frühen Boots oder wenn `/var` nicht schreibbar ist, wird vorübergehend `/run/log/journal` verwendet. `Storage=volatile` bleibt unter `/run`; `Storage=auto` verwendet `/var/log/journal` nur, wenn dieses Verzeichnis existiert.
- [`SplitMode=uid`](https://www.freedesktop.org/software/systemd/man/latest/journald.conf.html#SplitMode=) legt bei persistenter Speicherung für normale Benutzer getrennte Journal-Dateien an. Das dient vor allem der Zugriffskontrolle. Systemdienste und System-UIDs bleiben im System-Journal.
- [`SystemMaxUse=4G`](https://www.freedesktop.org/software/systemd/man/latest/journald.conf.html#SystemMaxUse=) begrenzt den Platz für persistente Journal-Dateien. `RuntimeMaxUse=` wäre das entsprechende Limit unter `/run`.
- [`MaxRetentionSec=180day`](https://www.freedesktop.org/software/systemd/man/latest/journald.conf.html#MaxRetentionSec=) entfernt Journal-Dateien mit zu alten Einträgen. Größenlimits reichen oft aus; ein Zeitlimit ist sinnvoll, wenn es eine ausdrückliche Aufbewahrungsfrist gibt.

Auf einem Rechner mit Machine-ID `f887fe52be104259aed255488762722d` kann das so aussehen:

```text
/var/log/journal/f887fe52be104259aed255488762722d/
├── system.journal
├── system@1164fa7c79ef404e9f1771f93fc487e7-0000000000000001-00065b3a5d983752.journal
└── user-9000.journal
```

`system.journal` und `user-9000.journal` sind aktive Dateien. Dateien mit `@...` im Namen sind rotierte Archive. Alte Archive werden nach den konfigurierten Grenzen gelöscht; deshalb braucht das Journal kein `logrotate`.

Den aktuellen Platzverbrauch und eine sofortige, manuell angeforderte Bereinigung gibt es ebenfalls über `journalctl`:

```bash
journalctl --disk-usage
journalctl --rotate --vacuum-size=2G
journalctl --rotate --vacuum-time=90days
```

Normalerweise konfiguriert man die gewünschten Grenzen und läßt `journald` die Arbeit machen. `--vacuum-*` ist für eine unmittelbar nötige Bereinigung.

# Sealing ist keine ewige Signatur

[`Seal=yes`](https://www.freedesktop.org/software/systemd/man/latest/journald.conf.html#Seal=) aktiviert Forward Secure Sealing für persistente Journal-Dateien, wenn zuvor mit `journalctl --setup-keys` Schlüsselmaterial eingerichtet wurde. Dabei werden kryptographische Tags über abgeschlossene Abschnitte gebildet. Mit einem getrennt aufbewahrten Verification Key kann man später Manipulationen erkennen.

Das ist keine allgemeine digitale Signatur jedes Eintrags und macht das Journal nicht unveränderlich. Ein Angreifer mit Root-Rechten kann weiterhin Dateien löschen. Die Forward-Secure-Konstruktion soll verhindern, daß er ältere Einträge unbemerkt verändert und danach passende Tags neu berechnet. Aufbewahrungsgrenzen und Rotation gelten weiterhin.

`journalctl --verify` prüft die interne Konsistenz von Journal-Dateien. Die kryptographische Prüfung der Seals braucht zusätzlich den Verification Key. Details stehen bei [`--setup-keys`, `--verify` und `--verify-key=`](https://www.freedesktop.org/software/systemd/man/latest/journalctl.html#--setup-keys).

# Aus Anwendungen strukturiert loggen

Für viele Programme reichen verständliche Zeilen auf `stdout` und `stderr`. Sie erhalten automatisch die vertrauenswürdigen Prozessfelder und lassen sich über Unit, PID, UID, Boot und Zeit filtern.

Ein bestehendes Programm kann man außerhalb einer Unit mit [`systemd-cat`](https://www.freedesktop.org/software/systemd/man/latest/systemd-cat.html) an das Journal anschließen:

```bash
systemd-cat -t importer -p info /usr/local/bin/importer --run-once
```

`-t` setzt den `SYSLOG_IDENTIFIER`, `-p` die Standardpriorität. Das erzeugt jedoch noch keine anwendungsspezifischen Felder.

Wenn Logs nach fachlichen Attributen wie `ORDER_ID`, `TENANT` oder `ERROR_CODE` durchsuchbar sein sollen, muß die Anwendung das native Journal-Protokoll verwenden. In C stellt libsystemd dafür [`sd_journal_send(3)`](https://www.freedesktop.org/software/systemd/man/latest/sd_journal_send.html) bereit:

```c
#include <systemd/sd-journal.h>
#include <syslog.h>

sd_journal_send("MESSAGE=Order could not be charged",
                "PRIORITY=%i", LOG_ERR,
                "ORDER_ID=%s", order_id,
                "ERROR_CODE=%i", error_code,
                "MESSAGE_ID=51e9d47b9b9e4b9aa0b20d6e13e12345",
                NULL);
```

Für Python stellt das systemd-Projekt die Bibliothek [`python-systemd`](https://github.com/systemd/python-systemd) bereit. Distributionen paketieren sie normalerweise als `python3-systemd`, auf PyPI heißt sie `systemd-python`. Das Modul `systemd.journal` bildet denselben Aufruf direkt ab:

```python
from systemd import journal

journal.send(
    "Order could not be charged",
    PRIORITY=str(journal.LOG_ERR),
    ORDER_ID=str(order_id),
    ERROR_CODE=str(error_code),
    MESSAGE_ID="51e9d47b9b9e4b9aa0b20d6e13e12345",
)
```

Eigene Feldnamen bestehen üblicherweise aus Großbuchstaben, Ziffern und Unterstrichen. Sie dürfen nicht mit einem Unterstrich beginnen, weil dieser Namensraum den von `journald` gesetzten vertrauenswürdigen Feldern gehört.

`MESSAGE_ID` bezeichnet nicht einen einzelnen Vorgang, sondern einen stabilen Meldungstyp. Alle Vorkommen von „Zahlung fehlgeschlagen“ können dieselbe ID tragen; `ORDER_ID` unterscheidet die konkreten Vorgänge. Eine neue zufällige 128-Bit-ID erzeugt `systemd-id128 new`.

Danach funktionieren fachliche Abfragen ohne Text-Parsing:

```bash
journalctl MESSAGE_ID=51e9d47b9b9e4b9aa0b20d6e13e12345
journalctl ORDER_ID=4711
journalctl ERROR_CODE=23 -o json-pretty
```

Felder sollten stabil und sparsam gewählt werden. Ein Journal-Eintrag ist ein Ereignis, kein Ersatz für eine fachliche Datenbank. IDs, Fehlerklassen und Zustandsübergänge sind gute Felder; komplette wechselnde Objektstrukturen sind es meist nicht.

# Rate Limits und verlorene Meldungen

Ein Dienst, der in einer Schleife Tausende identische Fehler schreibt, darf nicht die Platte füllen. [`RateLimitIntervalSec=` und `RateLimitBurst=`](https://www.freedesktop.org/software/systemd/man/latest/journald.conf.html#RateLimitIntervalSec=) begrenzen deshalb die Zahl gespeicherter Meldungen pro Service und Zeitfenster. Überschüssige Meldungen werden verworfen; `journald` protokolliert die Zahl der unterdrückten Einträge.

Das schützt das System, macht aber aus Debug-Logging keine kostenlose Ressource. Wer einen Fehler untersucht, sollte auf Meldungen über unterdrückte Einträge achten. Für einzelne Units können `LogRateLimitIntervalSec=` und `LogRateLimitBurst=` die globalen Werte überschreiben.

# Weniger tippen

`journalctl` verwendet auf einem Terminal normalerweise einen Pager. Für einmalige Aufrufe schaltet `--no-pager` ihn ab. Dauerhaft kann die Shell `cat` als Pager vorgeben:

```bash
export SYSTEMD_PAGER=cat
alias jcu='journalctl --user'
```

Dann wird aus

```bash
journalctl --user --no-pager -f -u chatto-releasebot.service
```

das kürzere

```bash
jcu -f -u chatto-releasebot.service
```

Der wesentliche Unterschied zu klassischen Textlogs ist nicht die bequemere Kommandozeile. Es ist das Datenmodell: Eine Logmeldung ist ein strukturierter Datensatz mit von `journald` ermittelten Prozessattributen und optionalen Anwendungsfeldern. `journalctl` projiziert und filtert diese Datensätze. Wer das Journal wie eine große Datei behandelt und nur `grep` darauf wirft, benutzt den uninteressantesten Teil davon.
