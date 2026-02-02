---
author: isotopp
title: "... and a happy new hack."
date: 2022-01-01T16:28:00+01:00
feature-img: assets/img/background/rijksmuseum.jpg
tags:
- lang_de
- gaming
- microsoft
- minecraft
aliases:
  - /2022/01/01/and-a-happy-new-hack.md.html
---

Und das neue Jahr beginnt für uns mit einem Minecraft-Server, auf dem wichtige Personen, die sich nichts haben zuschulden kommen lassen, plötzlich gebannt sind.

![](2022/01/banned.jpg)

Nach einem Unban an der Console: Der Spawn, der Eintrittspunkt für neue Spieler, ist komplett verwüstet.

![](2022/01/spawn.png)

Wir haben tägliche Backups, sodass das schnell behoben ist. Bleibt die Frage, was passiert ist.

## Gehackt

Unter den Spielern ist die Frage schnell geklärt: "`<user>` wurde gehackt."

Es stellt sich raus:
- "`<user>`" bekommt einen [Free Nitro Spam]({{< relref "2021-11-30-discord-nitro-spam-and-2fa.md" >}}).
- Er klickt darauf.
- Er wird gebeten, "`FreeNitro.exe`" zu installieren und macht das, startet dann das `.exe`.
- Sein Rechner macht ein Dutzend Fenster auf, rappelt los, und geht am Ende aus (und bleibt aus).

Im Rahmen des Exploits wurde er gebeten, seinen Minecraft Login und seinen Discord Login mit Passwort anzugeben, was er dann auch brav tat.
Zwei-Faktor-Authentisierung hat er nicht benutzt.

## Impact

### Nur Minecraft

Den ersten Minecraft-Server für unser Kind und seine Freunde hatten wir daheim.
Das ging gut: Die Maschine hat 8 Cores, 32 GB Speicher und ist sowieso an, weil sie Dinge im Haus tut.
Die Anbindung ist mit Glasfaser und fester IP auch überaus zufriedenstellend.

Als der ganze Server größer wurde, habe ich mit externen Anbietern herumexperimentiert und am Ende einen VPS besorgt.
Wichtig dabei ist nur, daß es eine Maschine ist, die nicht zu Hause steht, auf der nichts als Minecraft läuft und die keine Vertrauensbeziehung in irgendeiner Form mit anderen Maschinen von uns hat.

Das hat sich nun bezahlt gemacht.

### Restore

Wir haben auf dem Server daheim ein tägliches Backup: Der Minecraft-Server wird einmal pro Tag aus dem Internet nach Hause kopiert.
Das ist ein Pull, d.h. wir loggen uns auf dem Minecraft-Server ein und nicht der Minecraft-Server daheim.

Wir heben die Backups 30 Tage lang auf und das Backup vom 1. jeden Monats unlimitiert.

Dadurch konnten wir das gesamte Minecraft-Verzeichnis zur Seite bewegen, und dann aus dem Backup vom Vortag wiederherstellen.
Das hat 2 Minuten gedauert.

### Logs

Das alte Verzeichnis liegt noch vor.
Dort sind auch die Logs vom Vorfall.

Der Vorfall spielt sich so ab:
Der kompromittierte Account von `<user>` loggt sich ein und fängt an, `/lp` Kommandos für das LuckPerms-Plugin zu senden.
Er listet alle User mit Rechten, und kickt und bannt diese dann.
Danach entzieht er ihnen Rechte.

Das Plugin `WorldEdit` ist installiert und der Account von `<user>` teleportiert sich auf den Spawn und fängt dort an, mit grossflächigen Brushes umzudekorieren.
Das Vorgehen sieht jedoch nicht systematisch und auch nicht schnell aus:
Die Aktion dauert beinahe 30 Minuten.
Das spricht nicht für einen gescripteten Angriff, und ist inkonsistent mit meinem Bild von einem "Free Nitro" Scammer und Angreifer.

Das Logbuch des Serves und der mit `debsums` verifizierte Zustand des Systems macht eine Reinstallation von allem 
vermutlich nicht notwendig.
Es genügt, mit dem Stand aus dem Backup weiterzufahren.
Das ist angenehm:
Zwar ist der Server vollständig ansibilisiert und mit dem Backup in weniger als 30 Minuten aus einer kompletten Neuinstallation wiederherzustellen, aber wenn das nicht notwendig ist, ist das angenehm.

### Der User

Der betreffende User hat Accounts auf Dutzenden von Minecraft-Servern.
Als engagierter und intensiver Spieler oft mit Sonderrechten.
Alle diese Server sind beschädigt, viele weniger automatisiert als unserer.

Account-Recovery ohne 2FA ist schwierig.
Account-Recovery bei gleichem Paßwort für Minecraft und die Recovery-Mailadresse unmöglich.
Daraus folgt, daß man seine Recoveryadresse für den Minecraft Account eventuell nicht bei Hotmail haben sollte.
Daraus folgt auch, daß man Kindern Passwort Re-Use gar nicht früh genug aberziehen kann.

## Maßnahmen und Fazit

Wir verlangen in Zukunft für alle Benutzer mit Rechten auf dem Server oder im Discord zu beweisen, daß sowohl ihr Minecraft (Microsoft) Account als auch ihr Discord-Account mit Zwei-Faktor-Authentisierung gesichert sind.
Das wird helfen, den Schaden von solchen falschen Klicks zu minimieren und Accounts recoverbar zu machen.

Die Analyse der Logfiles war hilfreich bei der Rekapitulation der Vorgänge, und um das Ausmaß des Schadens und den Reifegrad des Angreifers zu bestimmen.

Einen externen, nur für Minecraft verwendeten Server zu nehmen, der nicht im Heimnetz steht, war sinnvoll und hat sich bezahlt gemacht.

Der Vorfall ist ein gutes Werkzeug, um der Spielergruppe zu erläutern, wieso Accountsicherheit wichtig ist und wie man sich gegen solche Angriffe verteidigt.
