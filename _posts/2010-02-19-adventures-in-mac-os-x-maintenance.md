---
layout: post
published: true
title: Adventures in Mac OS X maintenance
author-id: isotopp
date: 2010-02-19 14:17:04 UTC
tags:
- apple
- backup
- computer
- macos
- lang_de
feature-img: assets/img/background/rijksmuseum.jpg
---
![](/uploads/mbp.jpg)

Nachdem ich neulich meinen Mac in den Service geben mußte, ich für die Zeit einen Ersatz-Mac hatte und ich also zwischen beiden Systemen hin- und her installieren mußte, hier die deutsche Übersetzung einer kleinen Zusammenfassung, die ich für die Firma geschrieben habe.

Offensichtlich ist es sehr praktisch, dem großen Mac-Gott Time Machine eine Platte zu opfern, weil niemand Backup will und Time Machine sehr gut in Restore ist. In meinem Fall verwende ich eine WD Elements 1TB dafür (etwa 85€), andere in der Firma wollen was kleineres und mit USB Power, nehmen also eine WD Passport (500G @ 92€).

Diejenigen in der Firma, die ein lokales Linux brauchen, sind mit einem Linux in einer VMware Fusion besser dran als einem Multiboot mit einem nativen Linux. Time Machine alleine reicht schon als Vorteil, und außerdem ist der Wechsel zwischen den Betriebssystemen mit VMware natürlich weniger schmerzhaft als ein Reboot und das Powermanagement vom MacOS ist auch besser als das vom Linux.

Man kann eine Time Machine Platte bootbar machen. Das erlaubt es einem dann, von der Time Machine Platte zu booten, nachdem man sie angeschlossen hat und den Mac mit gedrückter Option-Taste einschaltet. Im StartupManager kann man dann die Time Machine Platte anwählen und im beginnenden Installationsprozeß statt einer Reinstallation eine Recovery aus der Time Machine Datenbank anwählen. Außerdem hat man Zugriff auf ein Terminal.app und könnte versuchen, den defekten Mac wieder zum Leben zu erwecken.

Die Platte bekommt man bootbar, indem man Disk Utility startet, die Time Machine Disk anschließt und die erste Installations-DVD ins Laufwerk tut. Die Time Machine Disk in Disk Utility auswählen, den Restore-Tab anklicken, dort die DVD ins Source-Feld und die Time Machine Disk ins Destination Feld, dann Restore drücken. Die Time Machine Disk wird dadurch überschrieben, also bitte sicherstellen, daß da nix wichtiges drauf ist.

Jetzt hat man eine bootbare Platte - nicht umbenennen. DVD auswerfen, Platte unmounten.

Beim Anschließen oder Mounten der Platte (mit Disk Utility) öffnet sich diese nun automatisch wie es die originale Installations-DVD auch tut. Das nervt. Also müssen wir sie unblessen:

```console
$ sudo bless --folder "/Volumes/Mac OS X Install DVD/" -saveX
```

Bless steuert normalerweise was von wo warum gebootet wird, kontrolliert aber auch diese Folder Auto-Open.

Ich habe diese Disk nun in den Time Machine Preferences zu meiner Time Machine Backup Disk erklärt. Dadurch bekomme ich einen Backups.backupd-Ordner auf der Platte, der irgendwann einmal die ganze Platte voll machen wird. Das dauert aber, und bis dahin kann ich immerhin noch ein Image der zweiten Installations-DVD auf der Platte als compressed dmg ablegen (mit Disk Utility) und auch alle andere Software, die ich für eine Reinstallation brauche ebenfalls dort unterbringen - Time Machine füllt die Platte und löscht dann alte Backups, tastet aber andere Files außerhalb des Time Machine-Ordners nicht an. Ich habe außerdem einen Ordner mit allen notwendigen Lizenz-Schlüsseln auf der Platte angelegt, der Ort erschien mir günstig für so was.

So vorbereitet kostet mich ein kompletter Verlust des Systems weniger als vier Stunden Wartezeit (so lange dauert ein Time Machine Restore maximal, abhängig im wesentlichen von der Anzahl der Dateien, nicht der Größe des Backups) und ich verliere nie mehr als eine Stunde Arbeitszeit (oder wie oft man auch immer Time Machine laufen läßt).

Weitere nützliche Werkzeuge auf der Kommandozeile sind diskutil, die Kommandozeilen-Version der Mount/Unmount/Eject-Kommandos von Disk Utility, hdiutil, die Kommandozeilenversion der dmg Management Utilities von Disk Utility, und asr, die Kommandozeilenversion der Restore-Funktionen von Disk Utility. Manpages für diese Werkzeuge sind Teil der Systeminstallation. Bless habe ich ja weiter oben schon erwähnt.

Besonderer Dank gilt [Harald Wagener](https://www.xing.com/profile/Harald_Wagener2) für seine wertvollen Hinweise. Nützlich war auch [diese Seite](http://www.macosxhints.com/article.php?story=2008011623365026) von Mac OS X Hints.
