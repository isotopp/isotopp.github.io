---
author: isotopp
title: "Paßwort-Sicherheit"
date: "2019-02-01T09:50:52Z"
feature-img: assets/img/background/rijksmuseum.jpg
tags:
  - pluspora_import
  - security
  - lang_de
aliases:
  - /2019/02/01/passwort-sicherheit.html
---

In einem [Kommentar auf Heise](https://www.heise.de/newsticker/meldung/Kommentar-Steckt-Euch-Euren-Aendere-dein-Passwort-Tag-sonstwohin-4291584.html) regt sich Jürgen Schmidt über den Ändere-Dein-Paßwort-Tag auf.
Er fordert von den Herstellern, weniger Daten zu speichern und sichere Systeme zu bauen.
Das ist richtig, aber nicht hilfreich.

Es ist wahr, daß der generelle Zustand von Security auf Computern bedauernswert ist, und daß Paßworte ein furchtbar fehlerbehafteter Mechanismus sind, Zugang zu schützen.
Aber die Welt ist wie sie ist, und es ist falsch darauf zu warten, daß sie sich verbessert.
Websites werden Eure Credentials leaken und generell daran scheitern, Eure Daten zu schützen.

Die korrekte Strategie als Endanwender ist, sich darauf zu konzentrieren, solche Fehler handhabbar zu machen und solche Situationen zu überleben.

# Habe auf jeder Site ein anderes Paßwort

Dies ist der wichtigste Rat überhaupt, denn das killt alle transitiven Exploits. 
Damit das funktioniert brauchst Du den Paßwortmanager.

Praktisch alle Exploits mit gestohlenen Paßworten sind transitive Exploits:
Jemand verwendet Dein Paßwort von ebay, um sich in Deinen Account auf web.de einzuloggen.
Dort findet er Kontodaten und Anschriften und macht Dein Konto leer.

# Verwende einen Paßwortmanager

Das hat mehrere Vorteile: 

- Du hast aufwandslos ein anderes Paßwort auf jeder Site.
- Ein Paßwortmanager hat auch einen Generator für Zufallspaßworte, so daß Du sehr lange, sehr zufällige Paßworte haben kannst.
- Ein guter Paßwortmanger weiß auch, wann Du ein Kennwort zuletzt geändert hast und wann Sites exploited worden sind und kann Dir sagen wo genau Du ein Risiko eingehst, wenn Du Dein Kennwort nicht änderst.

# Aktiviere 2FA mit Google Authenticator

Google Authenticator implementiert TOTP, zeitbasierte automatisch wechselnde Zifferncodes, die alle 30 Sekunden wechseln.
Sie machen Deinen Account sehr viel weniger anfällig gegen Phishing.
TOTP ist ein Standardprotokoll und wird nicht nur von Google Authenticator implementiert, sondern auf der Kommandozeile von oath-toolkit und auch von vielen Paßwortmanagern.

# Verwende weitere Paßworte statt sinnvoller Antworten bei "Sicherheitsfragen"

Einige Sites verwenden immer noch "Sicherheitsfragen" wie "Was war der Mädchenname Deiner Mutter?".
Setze hier als Antwort ebenfalls Zufallspaßworte ein und trage Frage und Antwort in Deinen Paßwortmanager ein.

# Stelle sicher, daß Du ein verschlüsseltes, aktuelles Offsite Backup der Datenbank Deines Paßwortmanagers hast

In meinem Archiv liegt nicht nur mein Keyring meines Paßwortmanagers, sondern auch Screenshots der QR-Codes für die 2FA Initialisierung. 
Die sind natürlich alle verschlüsselt.
