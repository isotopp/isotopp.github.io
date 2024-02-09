---
author: isotopp
date: "2024-02-09T01:02:03Z"
feature-img: assets/img/background/schloss.jpg
published: true
title: "Schlangenöl"
toc: true
tags:
- erklaerbaer
- computer
- security
- lang_de
---

Diese Woche war "Kaputte Security Software Werbewoche".

# Fortigate und Ivanti

Zunächst einmal war **heute** Fortigate Patchday:

![](/uploads/2024/02/schlangenoel-01.jpg)

*CVE-2024-23113, CVSSV3 Score 9.8, Unauthorized Code Execution, "Format String Bug"*

"A use of [externally-controlled format string](https://cwe.mitre.org/data/definitions/134.html) vulnerability 
in FortiOS `fgfmd` daemon may allow a remote unauthenticated attacker to execute arbitrary code or
commands via specially crafted requests."

Das ist ein Fall, wo eine C-Funktion einen Formatstring mit `"Bla %s Fasel"` annimmt, 
um etwa eine Log-Nachricht oder ein Kommando für einen `system()` Aufruf zusammenzubauen.
Der Entwickler hat jedoch den Format-Parameter des Kommandos nicht statisch auf einen Formatstring gesetzt
(`snprintf(buffer, length, "Bla %s Fasel", benutzereingabe)`), 
sondern stattdessen die Benutzereingabe als Format genommen
(`snprintf(buffer, length, benutzereingabe)`).
Die Benutzereingabe kann so verwendet werden, um alles Mögliche zu tun.

Das ist ein Fehler, der von den üblichen Sourcecodescannern automatisch erkannt wird,
und wenn man in einer modernen Entwicklungsumgebung versucht, so etwas zu comitten oder zu mergen,
dann wird man vom Scanner ganz furchtbar erniedrigt, der Commit zurückgewiesen und man bekommt ein Security-Training zugewiesen.

Will sagen, dieser Fehler tritt in einer zeitgemäßen Development-Umgebung nicht mehr auf.

**Auch gestern** war Fortigate Patchday:

![](/uploads/2024/02/schlangenoel-02.jpg)

*CVE-2024-21762, CVSSV3 Score 9.6, Unauthorized Code Execution, "Out of Bounds Write"*

"A [out-of-bounds write](https://cwe.mitre.org/data/definitions/787.html) vulnerability
in FortiOS may allow a remote unauthenticated attacker to execute arbitrary code or command via specially crafted HTTP requests."

Das ist ein Fehler, der in C oder anderen Sprachen ohne Indexprüfung beim Zugriff auf Arrays gerne gemacht wird.
In C kann man zum Beispiel mit negativen Indices auf Speicher vor dem Array zugreifen, und
wenn ein Error-Code `-1` ist, aber nach einem Funktionsaufruf der Error-Code nicht geprüft wird,
dann brennt alles nieder.

Diese Sorte Fehler wird von Source Code Scannern mit statischem Analyzer nicht immer gefunden,
aber meistens und alle Fälle, wo das nicht passiert, sollten von dem Ding eigentlich als Code Smell angemerkt werden.

Nun. Leider war **auch vorgestern** Fortigate Patchday.
[BleepingComputer schreibt](https://www.bleepingcomputer.com/news/security/fortinet-warns-of-new-fortisiem-rce-bugs-in-confusing-disclosure/):

> In this instance, due to an issue with the API which we are currently investigating, 
> rather than an edit, this resulted in two new CVEs being created, duplicates of the original CVE-2023-34992,
> FortiNet told BleepingComputer.
>
> However, it turns out that CVE-2024-23108 and CVE-2024-23109 are actually patch bypasses for the CVE-2023-34992
> flaw discovered by Horizon3 vulnerability expert Zach Hanley.

Das war also ein Patch für einen Patch, weil die Mitigation nicht funktioniert hat und
Fortinet kam mit den CVE-Nummern durcheinander, weil gerade so viele davon offen sind.

Unterdessen fordert die US CISA (Cybersecurity and Infrastructure Security Agency) von allen US-Institutionen das 
Abschalten von Ivanti VPN (vormals Juniper Pulse Secure):

![](/uploads/2024/02/schlangenoel-03.jpg)

*"CISA is requiring all Federal agencies to disconnect Ivanti products by Friday at midnight 
(Ivanti Connect Secure & Ivanti Policy Secure).
This is roughly 48-hours notice, to not patch, but rip it out!
Ivanti is an American company.
This is unprecedented."*

Während man 
[die Originaldirektive](https://www.cisa.gov/news-events/directives/supplemental-direction-v1-ed-24-01-mitigate-ivanti-connect-secure-and-ivanti-policy-secure)
ursprünglich noch als Update und Reinstallation sowie Neukonfiguration lesen konnte
hat sich diese Hoffnung mittlerweile zerschlagen.

Die Patches, von denen dort die Rede ist, sind nicht geeignet, den Fehler zu beheben.
[Brian Krebs hat das zusammengefasst](https://infosec.exchange/@briankrebs/111863433959430768).

Unterdessen hat jemand das Ivanti Image mal aufgemacht und reingesehen.

![](/uploads/2024/02/schlangenoel-04.jpg)

*Versionen von Software, die routinemäßig seit mehr als einer Dekade veraltet sind in einem aktuellen Image.*

Das sind, wie curl-Entwickler Stefan Eissing formuliert "Leichenteile und Zombie Software".

Und, es kommt, wie es kommen muss:
Einige Tage nach der von CISA vorgeschriebenen Patchorgie
[titelt BleepingComputer erneut](https://www.bleepingcomputer.com/news/security/ivanti-patch-new-connect-secure-auth-bypass-bug-immediately/):

> **Ivanti: Patch new Connect Secure auth bypass bug immediately**
> 
> The flaw (CVE-2024-22024) is due to an XXE 
> ([XML eXternal Entities](https://cwe.mitre.org/data/definitions/611.html)) weakness in the gateways' SAML component
> that lets remote attackers gain access to restricted resources on unpatched appliances in low-complexity
> attacks without requiring user interaction or authentication.

SAML, Security Assertion Markup Language, ist eine XML-Notation für Zugriffsrechte in Single-Sign-On Systemen.
Weil es eine XML-Notation ist, kann es dort diese `&blablub;`-Dinger geben – Entities – die durch anderen Text ersetzt werden.
Bei External Entities liegt der Ersetzungstext nicht lokal fest, sondern wird aus dem Netz nachgeladen.

Was heißt das im Kontext von SAML? Es bedeutet, die Zugriffsrechte sind im Dokument also nicht zwingend festgenagelt,
sondern ein Angreifer kann Entity Definitionen aus dem Netz nachladen.
Je nachdem, wo die Entity verwendet wird, kann man damit die SAML-Datei in Teilen oder ganz umschreiben und sich andere Rechte geben.

XML-Parser sind gut verstanden und XEE sind ein Ding, auf das man mit einem Sourcecode-Scanner zuverlässig automatisch scannen kann.
Diese Sorte Fehler ist in modernen Entwicklungsumgebungen gut auszuschließen.

# Antivirus und Endpoint Security

Das ist alles keine Ausnahme und auch nicht auf VPN-Gateways beschränkt, 
sondern Hersteller von Security Software setzen fröhlich auf 
"Security-Relevante Software mit Privilegien, und Programmiermethoden aus den 90er Jahren des letzten Jahrtausends".

Beispiele aus diesem Blog:
- [ASLR]({{< ref "/content/posts/2017-10-20-aslr.md" >}}): MacOS Trend Micro Binary mit ohne ASLR, jeder Exploit 
  (ja, es gibt welche) ist automatisch stabil über die ganze Flotte.
- [Websense DLP gives instant root]({{< ref "/content/posts/2018-06-18-websense-dlp-gives-instant-root.md" >}}):
  WebSense DLP veraltete Softwareversionen und exploitbares Kernelmodul, vermutlich fehlende QA und defekter Shipping Prozess.

Das ist bei Endpoint Security so verbreitet, daß zum Beispiel 
[@joxean](https://mastodon.social/@joxean) ein ganzes Buch darüber geschrieben hat:
[The Antivirus Hacker's Handbook](https://www.amazon.de/Antivirus-Hackers-Handbook-English-ebook/dp/B014MJ6AKS).
beschreibt, wie man Sicherheitslücken dieser Art in jeder, wirklich jeder AV Software findet.

Das ist systematisch:
Es liegt an der der Art und Weise, wie diese Software designt und entwickelt wird,
und es ist auch mit Patchs nicht zu beheben.

Ich weiß das, weil ich dieses Spiel einige Jahre mit einem Firmen-Mac gespielt habe: 
Ich habe die sogenannten "Security Tools" verwendet, die Corp auf meinem Mac installiert, um auf meinem Mac Privilegien zu bekommen.

Der ganze Prozess ist zuverlässig wiederholbar, 
und ich habe in keinem Fall mehr als einen langsamen Freitagnachmittag dafür investieren müssen.
Dabei bin ich noch nicht einmal "Security-Researcher", 
sondern nur ein Amateur mit Reverse-Engineering Erfahrung aus dem C64-Zeitalter.

Es ist diese Software, die angeblich schützen soll, die am Ende dazu führt, daß der Rechner angreifbar wird.
Wenn jemand wie Fefe von [Schlangenöl](https://blog.fefe.de/?q=Schlangen) redet, dann ist das wortwörtlich zu verstehen.

![](/uploads/2024/02/schlangenoel-05.jpg)
*[Snake-Oil](https://en.wikipedia.org/wiki/Snake_oil) is a term used to describe deceptive marketing,
health care fraud, or a scam.
Similarly, snake oil salesman is a common label used to describe someone who sells, promotes,
or is a general proponent of some valueless or fraudulent cure, remedy, or solution.*

# Eine Problemliste und veraltete Prozesse

Wir reden hier von kritisch security-relevanter Software, 
die das Eindringen von Schadsoftware und Angreifern auf Rechnern verhindern soll,
oder die solche Angriffe erkennen soll,
oder die Authentisierung oder sonst eine Form von sicherheitsrelevanter Funktion hat.

Sie läuft an kritischer Stelle, oft mit Privilegien und wenn sie versagt, ist meist nicht nur eine Maschine,
sondern eine ganze Firma kritisch exponiert.

Solche Software sollte eigentlich mit Werkzeugen und Methoden, die Stand der Technik sind, entwickelt werden
und besonderer Beobachtung hinsichtlich Korrektheit, Fehlerfreiheit und Aktualität von Dependencies unterliegen.

Wir sehen jedoch Fehler, die auf Defizite im Entwicklungsprozeß an allen Stellen schließen lassen.

- Wir sehen kritische Fehler, die keine groß problematischen Auswirkungen haben müßten, 
  wenn die Software von vorher herein rechteminimal geschrieben worden wäre.
  Aber Parser für komplexe, unbekannte Datenformate, die potenziell bösartige Payloads enthalten,
  mit Privilegien laufen zu lassen? 
  Und dann noch elementare Sicherheitsmechanismen des Betriebssystems abschalten? 
  Das bedeutet, sich für Maximalschaden aufzustellen.
  Es ist keine gewinnbare Position.
- Das alles in 2024 in C zu tun, wenn man Go oder Rust zur Verfügung hätte? 
  Auch nicht sonderlich schlau.
- Seine Deliverables mit Software vollzupacken, die im Fall von Ivanti bis zu zwei Dekaden
  ohne Patches auf dem Buckel hat, anstatt einen automatisierten Release-Prozess zu haben, der ein neues
  Release aus den neusten Versionen von allem zusammenschraubt und automatisch testet?
  Das ist nicht nur "nicht Stand der Technik", sondern es ist grob fahrlässig.
- Das alles dann in einem verschlüsselten Image auszuliefern, statt mit einer "SBOM of Shame" 
  (Software Bill Of Materials, eine Liste der verwendeten Dependencies und ihrer Versionen)
  ist bald schon ein Federal Crime in den USA, und auch die EU ist auf diesem Weg.
  Gut so.
- Ein "Format String Bug" oder eine "XML External Entities Vulnerability" sind triviale Fehler, 
  die Source Code Scanner erkennen können, wie sie von diesen Securityfirmen selbst beworben
  oder gar im eigenen Haus entwickelt werden.
  Aber offensichtlich sind diese Werkzeuge im Hause nicht im Einsatz, denn sonst hätte solcher Code niemals in
  ein Produkt gelangen können.
  Dazu braucht es keine KI, teilweise sind das bessere Regular Expressions, manchmal ein bisschen statische Analyse.

Wir beobachten hier als Außenstehende auf der Grundlage der gezeigten Fehlerbilder ein
Versagen entlang der gesamten Software Development Chain:

- Auf der Architektur-Ebene (nicht rechteminimal),
- auf der Tool-Ebene (keine Scanner für triviale Fehler, veraltete Dependencies, keine Automation beim Build und Release)
- auf der Packaging-Ebene (die defekten Permissions bei Websense zum Beispiel)
- und an jeder anderen Stelle, bei der man von außen durch die Fehler auf den Prozess rückschließen kann.
  - Zum Beispiel "kein funktionierender Code-Review und Audit" 
    ("statisch einkompilierte Backdoor-Passworte", wie sie bei Cisco das Dauer-Fehlerbild sind, fallen darunter).

Es sind mithin Managementfehler bei der Führung von Software-Häusern, die sicherheitskritische Software herstellen.
Es ist Aufgabe des Managements Prozesse einzurichten und zu steuern, die ein Mindestmaß an Qualität sicherstellen.

"Softwarefehler, kann man nichts machen" stimmt so nicht – es gibt ganze Klassen von Fehlern,
die man durch Architektur,
durch automatisches Scannen, 
durch Ausbildung, 
durch Review,
und durch Testen sicher ausschließen kann,
und es ist die Aufgabe des Managements, solche Prozesse einzurichten und zu steuern.

Alles in allem kann man nur zu dem Ergebnis kommen, 
daß hier verantwortungslose Hackerbuden ohne elementare Software-Entwicklungsprozesse als "Security"-Firmen auftreten
und radioaktiven Giftmüll in Hochglanzpackungen abfüllen, 
um so eine Autobahn für Nation State Actors ins Herz von kritischen Infrastrukturen zu bauen.

Teilweise grenzt die Art der Fehler an mutwillige Sabotage, 
beziehungsweise könnte man es auch mit mutwilliger Sabotage kaum schlimmer machen.

# 10/10, no notes

Im Chat witzeln Freunde von mir:
"Are you a 10/10 company?"

Security-Lücken wird nicht nur eine eindeutige Nummer zugewiesen, die CVE-Nummer, sondern
sie bekommen auch einen Schweregrad, den [CVSS-Score](https://en.wikipedia.org/wiki/Common_Vulnerability_Scoring_System).
Eine 10/10 ist der Maximalgrad, aber im Grunde ist alles über 8 
ein [Totalschaden und komplettes Prozessversagen](https://nvd.nist.gov/vuln-metrics/cvss/v3-calculator).

Es gibt nun eine historische CVE-Datenbank, die man 
[nach CVSS sortieren kann](https://www.cvedetails.com/vulnerability-list/cvssscoremin-9/cvssscoremax-10/vulnerabilities.html?page=1&cvssscoremin=9&cvssscoremax=10&order=3&trc=40515&sha=2721cbf47ba1e57d8b65ae1c3cf8883295fd04d7),
und auch auf Firmen wie
[Fortinet einschränken](https://www.cvedetails.com/vulnerability-list/vendor_id-3080/Fortinet.html?page=1&cvssscoremin=9&order=3&trc=103&sha=0ba96ce0b5ea0195196988ef1d381bdd33622c49).

Wir sehen dann für Fortinet eine Reihe von 12 Fehlern mit 10/10, und zwar
2x in 2024, 1x in 2021, 1x in 2019, 3x in 2017, 4x in 2016 und einmal in 2005.
Das kann man auch mit "Besserung ist nicht erkennbar" zusammenfassen.

"Security ist ein Prozess" heißt es.
Für Business Continuity Management habe ich einmal aufgeschrieben, was das bedeutet:
[This is not a Drill. This is just Tuesday]({{< ref "/content/posts/2023-02-18-this-is-not-a-drill.md" >}}).

Analoge Überlegungen kann man auch für sichere Software-Entwicklungsprozesse anstellen,
und es gibt sogar fertige Prozess-Blueprints dafür.
Weiterhin kann man, wie ich gezeigt habe, an den Fehlerbildern erkennen, welche Schwächen der interne Entwicklungsprozess
hinsichtlich Security Best-Practices hat,
und an den CVE-Anzahlen und CVSS-Scores erkennen, ob eine Firma ihre Posture verbessert hat.

Wenn das erkennbar über Jahre nicht der Fall ist, wie kann dann eine Kaufentscheidung positiv beschieden werden?
Denkt mal darüber nach.

![](/uploads/2024/02/meerschweinchen-anne.jpg)

*Manche Dinge sind nur durch niedliche Meerschweinchenfotos erträglich zu machen.*
