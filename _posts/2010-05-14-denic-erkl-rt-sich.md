---
layout: post
published: true
title: DENIC erklärt sich
author-id: isotopp
date: 2010-05-14 15:14:05 UTC
tags:
- admin
- domain name system
- internet
- lang_de
feature-img: assets/img/background/rijksmuseum.jpg
---
Gestern ab halb zwei ging es los: Immer mehr DE-Domains waren nicht mehr
erreichbar. Schlimmer noch, anstatt keine Antwort zu liefern lieferten die
Nameserver für die Domain "de" die Antwort 'Diese Domain gibt es nicht!'.
Das bedeutete eine ganze Reihe von Problemen - zum Beispiel ging Mail an
diese Domains mit 'Unzustellbar wegen unbekannter Domain' an den Absender
zurück, anstatt bis zum Ende der Störung liegen zu bleiben.

Was ging schief? In einer Mail auf 
[public-l](http://www.denic.de/denic-im-dialog/mailinglisten/public-l.html) hat die DENIC-Pressestelle 
[eine Erklärung veröffentlicht](http://www.denic.de/denic-im-dialog/mailinglisten/public-l.html?url=msg04454.xml):

> Hintergrund dafür war, dass im Rahmen der regelmäßigen 2-stündigen
> Aktualisierung der Nameservicedaten auf 12 der 16 Servicestandorte durch
> einen unterbrochenen Kopiervorgang die Verteilung einer nicht
> vollständigen Aktualisierung (sog. Zonendatei) angestoßen wurde....
>
> Zwar sollte auch dieser Vorgang abgesichert sein, der
> Sicherungsmechanismus hat den Fehler allerdings nicht korrekt ausgewertet,
> so dass im Effekt der Kopierfehler nicht entdeckt und der
> Weiterverarbeitungsprozess nicht angehalten wurde.

Eine Zone ist DNS-Speak für eine Konfigurationsdatei für einen DNS-Server
und enthält in der Regel die Daten einer Domain. Die Zonendatei für DE ist
nun wie man sich leicht vorstellen kann besonders groß, da sie die
Konfigurations- und Delegationsdaten für alle DE-Domains enthält. Sie wird
aus einer Datenbank neu generiert und dann an die Nameserver verteilt, die
die DE-Domain betreiben. Dieser Verteilvorgang wurde nach Übertragung von
ca. einem Drittel der Daten unterbrochen und das Checkscript hat auf den
Fehler nicht korrekt reagiert und die Verarbeitung der Datei nicht
abgebrochen.

In einem früheren Leben habe ich bei einem Kieler Provider gearbeitet und
auch dort hatten wir eine Reihe von Scripten, die Konfigurationsdateien aus
Datenbanken generiert haben. Neben anderen Integritätstests hatte wir in
diesen Scripten in der Regel auch eine Prüfung drin, die festgestellt hat,
wie sehr sich die Anzahl der Datensätze im Vergleich zum vorhergehenden Run
geändert hatte. Wenn die Fluktuation bei mehr als 10% lag, hat das Script
die Datei **neben** der alten Datei installiert, aber nicht live geschaltet,
sondern eine Mail an die Admins geschickt, damit die sich das Ding mal
ansehen und es manuell live nehmen. Das hat uns mehr als einmal den Hintern
gerettet.

Solche Sicherungen kann ich jedem Scripter von Admin-Diensten nur empfehlen!
