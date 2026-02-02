---
author: isotopp
date: "2022-12-29T01:02:03Z"
title: Chromebooks in der Schule
feature-img: assets/img/background/rijksmuseum.jpg
tags:
  - lang_de
  - schnuppel
  - bildung
  - security
aliases:
  - /2022/12/29/chromebooks-in-der-schule.html
---

In
[Mein Sohn sitzt vor dem Computer]({{< relref "2020-01-28-mein-sohn-sitzt-vor-dem-computer.md" >}})
und in
[Schulen digitalisieren]({{< relref "2020-06-23-schulen-digitalisieren.md" >}})
ging es schon einmal um den Einsatz von Computern in der Schule, in Deutschland und in den Niederlanden.

# VWO

Jetzt stand bei uns letzten Sommer nach dem Ende der 8. Grundschulklasse (der deutschen 6. Grundschulklasse) der Schulwechsel auf die [VWO](https://nl.wikipedia.org/wiki/Voorbereidend_wetenschappelijk_onderwijs) an.
VWO steht für "Voorbereidend wetenschappelijk onderwijs", studienvorbereitender Unterricht, und entspricht noch am ehesten einem deutschen Gymnasium.
So wie es in Deutschland Gymnasien mit unterschiedlicher Ausrichtung gibt, gibt es das auch in den Niederlanden und der Name "Gymnasium" steht für eine VWO mit altsprachlicher Ausrichtung, der Name "Atheneum" für VWO mit einer technisch-naturwissenschaftlichen Ausrichtung, und es gibt noch ein paar weitere Geschmacksrichtungen.
Die Schulart ist VWO.

Wie auch schon in der Grundschule werden im Unterricht unter anderem Chromebooks benutzt und der Online-Teil des Unterrichts um 
[Google Edu](https://edu.google.com/)
herum strukturiert.
In einer Diskussion mit Deutschen gab es dabei einen Haufen komische Vorstellungen, was das ist, wieso das nützlich ist und natürlich einen Haufen Befürchtungen, ob das nicht gefährlich ist.

# Chromebook

Ein Chromebook ist ein normaler Laptop mit Linux, der direkt in einen Chrome Browser bootet.
Auf dem Gerät werden keine Daten gespeichert, alle Daten werden in den Diensten hinterlegt, die man mit dem Gerät nutzt.

Chromebooks gibt es in sehr unterschiedlichen Leistungsklassen und Preislagen.
Von 200 Euro Wegwerf-Geräten bis zu 2k Euro mit Touchscreen und dicken CPUs ist alles vorhanden, auch wenn der Schwerpunkt eindeutig auf kostengünstigen Geräten mit niedrigem Energieverbrauch und langer Akkulaufzeit liegt.

Wir haben gar keines gekauft, sondern ein Angebot eines 
[von der Schule empfohlenen Dienstleisters](https://rentcompany.nl/easy4u-abonnement/ouders-van-vo-scholieren)
wahrgenommen, und mieten für 13.70 Euro im Monat.
Dadurch haben wir immer ein aktuelles und funktionsfähiges Gerät (und Daten können prinzipbedingt sowieso nicht verloren gehen), und brauchen uns keine Sorgen zu machen.

Technisch ist das so, daß das Kind ein von der Schule bereitgestelltes Google Edu Login bekommt.
Mit dem Login kann er sich auf dem Gerät oder auf seinem Rechner daheim anmelden.
Danach kann er dann die von der Schule bereitgestellten Dienste und Daten nutzen.
Dabei spielt es keine Rolle wo er ist, und ob er das Chromebook oder seinen privaten Rechner benutzt, solange er im Browser mit der Schul-Identität unterwegs ist.

Angenehm ist, daß

- das Gerät im Grunde keine Rolle spielt, sondern nur das Login wichtig ist
- keine Daten auf dem Gerät sind, sodaß nichts verloren gehen kann und nahtlos zwischen daheim und der Schule gewechselt werden kann
- der Chrome-Browser mehrere Identitäten verwalten kann, sodaß das Kind sowohl auf dem Chromebook als auch auf dem privaten Rechner in unterschiedlichen Fenstern unterschiedliche Identitäten haben kann
- Zugriffsregeln und Rechte vom Login abhängen und nicht vom Gerät

Nützlich ist auch, daß das Gerät eine Tastatur und Maus hat.
Dadurch kann man auf dem Gerät sinnvoll schreiben und Inhalte erzeugen. 
Es gibt Geräte mit Touchscreen und Tablet-Betrieb, wenn man das *auch* braucht, 
aber generell sind dies "richtige Laptops" und keine Tablet-Geräte, die auf Konsum von Inhalten optimiert sind.

## Keine Viren

Chromebooks unterscheiden sich von normalen Computern dadurch, daß sie in der normalen Betriebsart einen "trusted boot" durchführen.
Das System ist dann vom Systemstart an validiert und durch Prüfsummen abgesichert -- weder das System noch der Browser können durch Viren, unangemeldete Systemerweiterungen oder Browser-Plugins "verunreinigt" werden.
Wenn der Zustand des Rechners einmal fragwürdig sein sollte, drückt Ctrl-Alt-Shift-R und wählt Restart -> Powerwash.
Das System führt dann einen "[Powerwash](https://support.google.com/chromebook/answer/183084)" durch, und ist danach wieder auf den abgesicherten Fabrikzustand zurückgesetzt.
Nach einem neuen Login hat man dann ein sauber aufgesetztes System und seine Daten.

Das ist für die Schule angenehm, denn dies ist in der Tat die gesamte Gerätewartung, die vor Ort notwendig ist.
Installation, Konfiguration und Wartung vor Ort entfallen komplett.

# Google Edu

Für die Schule ist das Wegfallen der Gerätewartung und Installation angenehm, aber nur das User-Ende der Schul-Verwaltung.
Der eigentliche Clou ist Google Edu, also "[Google Workspace](https://workspace.google.com/) für Schulen".

"Google Workspace" ist für den Endbenutzer sichtbar die Sammlung von Werkzeugen, die früher unter dem Namen "Google Office" bekannt war.
Also Gmail, Calendar, Drive, Docs/Sheets/Slides/Forms, und das Meet Konferenzsystem/Chat.

## IAM

Wichtiger für die Schule selbst und für den Endbenutzer eher unsichtbar ist das IAM-Backend.
IAM steht dabei für "Identitäts- und Access-Management".

Das ist die Struktur, die der Schule "Logindienste" und "Rechteverwaltung" bereitstellt.
In
[Identität, Authentisierung, Autorisierung, Auditing und Accounting]({{< relref "2021-11-16-a01-2021-broken-access-control.md" >}})
definiere ich eben diese Begriffe.
Die Kurzform:

- Identität ist der Login-Name, der mich im Kontext meiner Organisation repräsentiert.
  Also so etwas wie "kristian.koehntopp@schulname.nl".
- Authentisierung ist der Mechanismus, oder die Kombination von Mechanismen, mit der ich gegenüber dem System beweise, daß ich wirklich "kristian.koehntopp@schulname.nl" bin.
  Also so was wie mein Paßwort und der Knopfdruck auf meinem Yubikey.
- Anker ist die Bestätigung der Organisation, daß ich wirklich zur Organisation gehöre und welche Rolle ich dort habe.
  Das ist vor allen Dingen bei Self-Signup wichtig, also wenn man Login nicht durch die Schule generiert worden wäre, sondern ich mich selbst anmelde.
  Mit der Verankerung verhindert die Organisation, daß jemand  sich anmeldet und sich selbst dann Attribute wie "gehört der Schule an", "ist Mitglied des Lehrkörpers" und so weiter zuweist.
- Autorisierung ist der Satz an Rechten, den ich auf Grund meiner bewiesenen Identität habe.
  - Der Rechtesatz ist in der Regel identisch mit dem vieler anderer Nutzer, die die gleiche Rolle wie ich haben ("Schüler", "Lehrer", "Administrator").
  - Der Rechtesatz kann automatisch generiert werden, wenn verifizierte Attribute bereitstehen ("Lehrer"-Rolleninhaber können nur die Daten "ihrer Klasse" sehen).
- Auditing ist ein nicht abschaltbares, nicht veränderbares Logbuch von systemrelevanten Aktivitäten im System, bei dem das Verändern von Systemobjekten durch Benutzer mitgeloggt wird.
  - Ein Audit-Event ist dann so etwas wie "Der Lehrer Lempel hat die Mathematik-Note von Kristian Köhntopp am ... um ... unter Benutzung der IP ... auf 3 gesetzt."
- Accounting ist ein spezielles Auditing, das die Grundlage der Rechnungslegung ist.

Der eigentliche Clou, für die Schule und ihre Administration, ist dabei das IAM, also die Tatsache, daß der Schule und ihren Partnern ein konfigurierbares, offenes IAM bereitgestellt wird.
Partner kann dabei auch ein IT-Partner sein, also eine Firma oder Behörde, die für die Schule die Konfiguration und den Betrieb von Google Edu übernimmt.
Dabei ist das System selbstverständlich so gestaltet, daß ein solcher Partner zwar die Rechte der Benutzer konfigurieren kann, aber natürlich nicht ihre Daten sehen oder verändern.

## OAuth2

Google Edu stellt dabei wie viele andere Systeme auch "[OAuth](https://de.wikipedia.org/wiki/OAuth)" als Login-Mechanismus bereit.
OAuth ist ein Verfahren, mit dem ein IAM-Dienstleister (also etwa Google Edu) externen Diensten Identitäten beglaubigen und bereitstellen kann.
Dabei kann für jeden Dienst einzeln und unterscheidbar Zugriff gewährt werden, der Zugriff an Rechte und Rollen gebunden werden, und für den Benutzer sichtbar gemacht werden, welche Dienste wann warum worauf zugegriffen haben.

Wenn die Schule also etwa mit Schulbuchverlagen und den Anbietern von Schulsoftware zusammenarbeitet, dann kann die Schule Anwendungen von solchen Anbietern einzelnen Schülern oder Klassen zuweisen.
Die Schule kann dabei auch festlegen, welche Daten vom Schüler ("keine, nur ein anonymes Identifikationstoken", "die Loginkennung", "der volle Name des Schülers", "die Daten des Schülers in anderen Diensten") mit dem Softwareanbieter geteilt werden.
Schüler können die ihnen zugewiesenen Anwendungen sehen, und auch welche Daten und Rechte damit verbunden sind.
Anbieter von Anwendungen können sich sicher sein, daß die Identitäten der Nutzer authentisch sind.

Alle können im Falle einer Sicherheitsschwankung die Auswirkungen begrenzen:
Sollte es zu Einbrüchen bei externen Anbietern kommen, können Zugriffs-Tokens zurückgerufen werden und die Account-Sicherheit so vergleichsweise einfach wieder hergestellt werden.
Zugleich ist durch die Datenverwaltung von IAM und OAuth klar, welche Daten im Zugriff waren und welches Ausmaß der Schaden hat.

# Plattform

Selbst ohne die Google-eigenen Anwendungen ist das Zusammenspiel von IAM, OAuth und Chromebook schon sehr viel wert.
Für die Schule und die Anbieter von Inhalten entsteht so eine offene Plattform, gegen die entwickelt werden kann:
Anbieter können sich auf der Basis von offenen Standards (HTML, CSS, Javascript, dokumentierte Browser-APIs) und verifizierten Identitäten mit einem Rechtesystem in einem Ökosystem gruppieren, in dem sich Dienste anbieten, regeln und abrechnen lassen.

Die Plattform selbst besteht dabei aus gut verstandenen Komponenten: Linux, Chrome, offenen Standards und Schnittstellen und einem vielfach verifizierten und zertifizierten Dienstanbieter mit einem ausgezeichneten Sicherheitsbewußtsein.

Dazu kommen optional noch die Werkzeuge aus dem Google-Werkzeugkasten selbst.
Aber dies sind auch nur Anwendungen, die wie externe Anwendungen dazu geschaltet werden können.

Anders als andere Plattformen ("iPads") oder selbst gekochte Lösungen ("Moodle und Jitsi plus einige Extras") gibt es ein verifiziertes und zertifiziertes Betriebs- und Rechtekonzept, das auch von externen Dienstleistern gut verstanden und unterstützt wird.

Das ist bemerkenswert, weil dies bisher nicht nur bei deutschen Schulen, sondern auch bei fast allen europäischen Cloud-Anbietern ein blinder Fleck ist:
Während es viele europäische Dienste gibt, die (meist auf der Basis von Openstack) virtuelle Maschinen oder Dienste anbieten, gibt es kaum einen europäischen Cloud- oder Schulanbieter, der IAM/OAuth und ein Verwaltungs-Framework darum herum anbietet.
Ganz zu schweigen von "Null Aufwand"-Clients, die eine über viele Jahre stabile und weiterentwickelte Hardware in Schülerhand darstellen, und bei der sich die Verwaltungsarbeit zentral gesteuert und kryptografisch abgesichert bis in den Client hinein erstreckt.

Tatsächlich ist es so, daß die Diskussion in Deutschland sich meist in abstrakten Datenschutzbeschwörungen ("Google böse") und Hardware-Streitereien ("iPads oder Windows-Laptop") Gerede erschöpft.
Es wäre sinnvoller, stattdessen einmal Ende-zu-Ende Betriebskonzepte zu besprechen und bewerten.
Und dabei die Erkenntnisse und Entwicklungen der letzten zehn Jahre auf dem Gebiet der Auftragsdatenverarbeitung ("Cloud") und des Rechnerbetriebs zu berücksichtigen.
