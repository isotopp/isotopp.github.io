---
author: isotopp
title: "Mehr Paßwort-Sicherheit"
date: "2019-02-08T10:14:19Z"
feature-img: assets/img/background/rijksmuseum.jpg
published: true
tags:
- pluspora_import
- security
- lang_de
---

Basierend auf [einem Twitter-Thread](https://twitter.com/isotopp/status/1093771082400714753)

In [Aus dem Journalistischen Maschinenraum](https://pca.st/rEmK) diskutieren Peter Welchering und Kollegen von ihm den "Ändere Dein Paßwort Tag".
Die fehlende Frage dabei:
Warum behaupten Leute, daß Ändern des Passworts unsicherer ist oder jemanden sicherer macht?

Szenarien sind wichtig, wann immer man über Security (oder Management) diskutiert.

Ohne Passwortmanager macht man sich das Leben schwerer, weil man sich Dinge merken muss.
Damit das funktioniert nehmen Leute schwache Passwörter, und in Folge sinkt das Sicherheitheitsniveau. 
Steht so auch in der originalen Studie.

Die Hauptgefahr dieser Tage ist die transitive Ausnutzung von Paßworten:
Leute, die dasselbe Paßwort etwa bei eBay und web.de haben lassen sich das eBay Paßwort abphishen, wie es so gerne getan wird.
Im eBay Account ist im Admin-Panel die Mailadresse hinterlegt, sagen wir bei web.de. 
Dort wird dasselbe Paßwort verwendet wie bei eBay und zack, ist der Mailaccount weg. 
Der ist aber Passwort-Vergessen Recovery-Account für ein Dutzend andere Dinge (und im IMAP Archiv kann man auch sehen, wo).
Und zack, sind die Accounts auch alle weg.

Daher ist es wichtig, generierte, starke, zufällige Passwörter zu haben.
**Und für jede Site ein anderes.**
Das kann man gar nicht genug betonen. 

Dabei heißt aber, eigentlich sollte es »Verwende einen Passwort-Manager Tag« sein. 
Das hat noch weitere Vorteile:
Man weiß, ob man ein Paßwort für eine Site hat, das älter ist als deren letzte Sicherheitsschwankung.

Re den Podcast:
Im Grunde ist es ganz einfach - Nachdenken hilft.
Journalismus ist die Frage nach dem Warum.
Davon haben wir zu wenig.

Im Nachgang gab es dann die [Frage](https://twitter.com/joschtl/status/1093780755048812544):

> Kann man einem Passwortmanager uneingeschränkt vertrauen? 
> Schafft man damit nicht einen Single Point of Failure?
> Was hältst Du von "sicheres, zufallserzeugtes, nirgends elektronisch gespeichertes Passwort, das je nach Verwendungsort mit einem Prä -/In-/Sufffix versehen wird"?

Natürlich man einem Paßwortmanager nicht uneingeschränkt vertrauen. 
Das kannst Du nix und niemandem. 
Das ist aber auch nicht die Frage.
Die Frage ist, ob Du im Mittel hinterher sicherer bist als vorher und die Antwort ist uneingeschränkt ja, sogar bei einem trivialen Setup.
Paßwortmanager speichern nicht nur Paßworte, die managen sie auch.
Was heißt das?

1. Paßworte zufällig generieren.
2. Paßwort Änderungshistorie dokumentieren - Wann hast Du Wo Was geändert. Das erlaubt Dir Zugriff auf alte Paßworte und erlaubt Dir auch 3.:
3.Zusammen mit der Historie kannst Du nun wissen, ob Dein Paßwort für http://x.de  neuer ist als der letzte Security-Fail bei http://x.de
4. Und damit kommen wir zum Reporting: Ein Paßwort-Manager erlaubt Dir Deine gesamte Security Posture in der Gesamtschau zu beurteilen. Wie viele schlechte Paßworte hast Du? Wie viele Paßworte hast Du, die Du ändern mußt, wegen 3.?
5. Erlaubt Dir Nachfolgemanagement. Wenn Du ge-bus-t wirst, können Deine Rechtsnachfolger sehen, wo Du Account hast und die Kontrolle über Deine Accounts und Assets gezielt übernehmen.

Der Unterschied zwischen "Ich hab ein Schema um mir ähnliche Paßworte auszudenken, die eventuell sicher sind" und einem Management-Schema wird so hoffentlich klar.

»Was hältst Du von "Paßwort mit Site-Suffix"?« Nix.

Warum nicht?
Es löst das Transitivitäts-Problem, halb.
Es ist keine **Management** Strategie für virtuelle Assets.
Es dokumentiert nix.
Weder Du noch die Leute, für die Du verantwortlich bist, haben davon einen Gewinn.

Die Frage, die Du auch lösen mußt:
Was tun Dein Sohn oder Deine Frau mit all Deinem virtuellen Besitz, wenn Du mit dem Familienmobil einen Alleebaum kuschelst oder über dem guten Steak einen Infarkt bekommst - itunes Musik und Apps, Play Store Apps, Kindle Library, Steam Lib?
Leute, das ist alles nicht so schwierig: Stellt Euch einfach vor, das seien echte, anfaßbare Dinge.
Für die habt Ihr Versicherungen, Treuhänder, Hinterlegungen, Kontrollen und Qualitätsstandards, sogar in einer Familie.

Jetzt dasselbe, auch für nicht anfaßbare Dinge.
Die Antwort ist zwangsläufig ein Paßwortmanager und ein Gespräch mit der Familie und ein Umschlag irgendwo mit Siegel drauf, wo Frau und Kinder wissen wo der ist.
