---
author: isotopp
date: "2026-10-14T02:03:04Z"
feature-img: assets/img/background/rijksmuseum.jpg
title: "Was AI-Einführung über eine Organisation verrät"
description: "Agenten und Remote-Mitarbeiter brauchen zugängliches Wissen, klare Übergaben und prüfbare Ergebnisse. AI-Einführung zeigt, wo diese Voraussetzungen fehlen."
toc: true
tags:
  - lang_de
  - ai
  - llm
  - work
  - software engineering
  - erklaerbaer
---

Als Sun MySQL kaufte, schluckte eine Firma mit ungefähr 33.000 Mitarbeitern eine mit ungefähr 500.
Beide hatten Mitarbeiter in etwa 30 Ländern.
Ich lebte damals in Berlin und bekam eine Mail: Mein Mitarbeiterausweis liege zur Abholung in Raum soundso bereit.

Stellte sich heraus: Der Raum war in München.
Ich fragte, ob ich dafür jetzt eine Dienstreise buchen solle.
Die Antwort war ja.

Eine weltweit verteilte Firma hatte einen Prozeß, der voraussetzte, daß ich in einem bestimmten Gebäude saß.
Das war schon damals Quatsch.
Heute würde derselbe Laden womöglich einen Agenten auf den Prozeß setzen und sich wundern, warum der nicht funktioniert.

# Allgemeines und lokales Wissen

Ein LLM hat aus großen Sammlungen von Texten und anderen Darstellungen der Welt gelernt.
Es hat ein Bild der Welt, aber es lebt nicht im Alltag unserer Firma.
Es hört keine Gespräche in der Kantine und bekommt nicht nebenbei mit, daß eine Regel seit drei Jahren nicht mehr gilt.

Das Modell kennt viele Arten, ein allgemeines Problem zu lösen.
In unserem Stamm machen wir es aber immer auf diese eine Weise.
Vielleicht, weil das bestimmte Probleme vermeidet.
Vielleicht, weil wir es schon immer so gemacht haben.

Dieses lokale Wissen muß das Modell erst bekommen.
Das gilt auch für einen neuen Mitarbeiter.
Seine Ausbildung erklärt ihm nicht, warum hier jede Rechnung über 500 Euro erst zu Frau Müller muß,
obwohl im Handbuch Herr Meier steht.

Über die [Einarbeitung von Modellen]({{< relref "2026-09-13-die-menschmaschine-muss-eingearbeitet-werden" >}})
habe ich bereits geschrieben.
Interessant ist aber auch die andere Richtung: Was erfährt die Firma über sich selbst, wenn sie dieses Wissen bereitstellen soll?

# Ein Prozeß ist eine Verabredung

Prozesse sind verbindliche Verabredungen zwischen handelnden Parteien:
Wer muß wann warum mit wem worüber reden, um welches Problem zu lösen oder zu vermeiden?
Die Parteien können Menschen, Agenten oder andere Programme sein.
Der Prozeß regelt den Informationsfluß zwischen ihnen.

Eine Freigabe muß jemanden über etwas informieren oder eine Entscheidung herbeiführen.
Eine Übergabe muß dem Empfänger sagen, was er tun soll, welchen Stand er bekommt und woran er das Ergebnis prüfen kann.
Wenn wir den Zweck eines Schrittes nicht mehr erklären können, gehört er auf den Prüfstand.

Dabei müssen wir zuerst beschreiben, was tatsächlich passiert.
Danach können wir fragen, warum es passiert und ob wir es noch brauchen.
Das Organigramm und das Prozeßhandbuch beantworten die erste Frage oft nur teilweise.
Den Rest wissen einzelne Leute.

Manche Verabredungen sind mündlich.
Andere stehen auf Papier in einem Büro.
Wieder andere existieren als ungeschriebene Ausnahme: „In diesem Fall frag vorher Thomas.“
Dem Modell fehlt damit ein Teil des Prozesses.
Ein Remote-Mitarbeiter hat dasselbe Zugangsproblem, auch wenn er Thomas anrufen und nachfragen kann.

# Die Meta-Ebene tut weh

Die eigene Arbeit auszuführen und die eigene Arbeitsweise zu erklären sind verschiedene Aufgaben.
Viele Menschen vermeiden die zweite.
Sie kostet Zeit, unterbricht den Alltag und wirft unangenehme Fragen auf.

Warum brauchen wir diese Freigabe?
Wer darf sie erteilen?
Was prüft diese Person?
Was passiert, wenn sie im Urlaub ist?
Welche Information fehlt eigentlich, wenn wir dafür ein Meeting brauchen?

Die Antworten können gewachsene Hierarchien gefährden.
Wer allein eine Ausnahme kennt, ist unentbehrlich.
Wer eine Freigabe ohne benennbare Kriterien erteilt, besitzt einen Spielraum, den eine ausdrückliche Regel einschränken würde.
Wer bisher Verantwortung weitergereicht hat, müßte sie vielleicht übernehmen.

Das muß niemand absichtlich so gebaut haben.
Gewohnheit, Angst vor Veränderung und Bequemlichkeit reichen.
Ein einmal sinnvoller Ablauf kann längst vor allem den ruhigen Status quo schützen.

Die AI-Einführung macht diese Fragen relevant, weil wir einem Agenten den Ablauf erklären müssen.
Sie zwingt die Firma nicht, sie ehrlich zu beantworten.
Man kann dem Modell auch das offizielle Handbuch geben und bei schlechten Ergebnissen über Halluzinationen klagen.
Die Informationen fehlen dann trotzdem.

# Die Zwiebel

Martin Seeger beschreibt den schlechten Ansatz mit einer Zwiebel:
Im Kern liegt der alte Papierprozeß.
Darum kommt eine digitale Schicht, darum noch eine AI-Schicht.
Der Ablauf bleibt derselbe.

![Ein unveränderter Papierprozeß, umgeben von einer Digitalisierungsschicht und einer zusätzlichen AI-Schicht.](zwiebel.png)

*Verwendung mit Erlaubnis von Martin Seeger (NetUSE AG).*

So wird ein Formular zum Webformular und bekommt anschließend einen Chatbot.
Die Übergaben, Wartezeiten und Freigaben bleiben.
Vielleicht geht ein einzelner Schritt schneller.
Aber wir haben nicht geprüft, welche Schritte noch nötig sind und welche nur die Grenzen der alten Technik ausgleichen.

In vielen Firmen muß man den Ablauf neu entwerfen, mindestens aber jeden betroffenen Schritt prüfen.
Eine sinnvolle Kontrolle darf bleiben.
Eine Dienstreise zum Abholen eines Ausweises muß man nicht durch einen Agenten optimieren.

# Zugang kostet auch Zeit

Eine Firma, mit der ich zu tun hatte, bestand auf Dokumentation in Confluence und Tickets in Jira,
„damit auch Nichttechniker Zugang haben“.
Das Ziel ist vernünftig.
Die gewählte Lösung machte aber den Zugriff für Agenten teuer und langsam.

Selbst ein einfacher Ticket-Dump für unseren Spezialisierungs-Workflow brauchte über MCP mindestens eine Minute zusätzliche Wartezeit.
Dazu kamen Tokens für die Aufrufe und die Verarbeitung der Antworten.
Bei wiederholten Zugriffen summiert sich das.

Confluence ist dort inzwischen raus.
Die Dokumentation liegt als Markdown in `docs/` neben dem Code.
Aus den `docs/`-Verzeichnissen aller Repositories entsteht eine statische Website.
Menschen können sie lesen; Markdown zu bearbeiten ist auch für Nichttechniker erlernbar.
Der Agent liest dieselben Quelldateien direkt.

Jira dient noch der Vorarbeit.
Bei der Übergabe an die Entwickler werden die geklärten Tickets eingefroren und ins Repository exportiert.
Danach arbeitet der Agent mit den Markdown-Dateien.
Er implementiert gegen die Vorgaben; Tests, Reviews und Abnahme prüfen das Ergebnis.
Anschließend können wir die Tickets abhaken.

Dieser Weg ist billiger, schneller und zuverlässiger.
Wir haben dafür den Informationsfluß geändert: Wer stellt wann welchen verbindlichen Arbeitsstand bereit,
und wer prüft das Ergebnis?
Die Dateien allein lösen das Problem nicht.
Die Verabredung über die Übergabe tut es.

# Das kennen wir von Remote-Arbeit

Die Einarbeitung eines Remote-Mitarbeiters und die Einbindung eines Agenten haben auf dieser Ebene dieselbe Struktur.
Beide brauchen:

- zugängliche, aktuelle und relevante Dokumentation;
- Entscheidungen samt Gründen und Ausnahmen;
- klare Zuständigkeiten und Wege für Rückfragen;
- Übergaben, die auch ohne gleichzeitige Anwesenheit funktionieren;
- Kriterien und Rückmeldungen, mit denen sie ihre Ergebnisse prüfen können.

Das führt zu Verschriftlichung und asynchroner Arbeit.
Information und Entscheidungen dürfen nicht davon abhängen, daß die richtige Person zur richtigen Zeit am richtigen Schreibtisch sitzt.
Ein Agent sitzt dort nie.

Menschen können Lücken anders überbrücken als Modelle.
Sie bekommen etwas zufällig mit, fragen Kollegen oder erkennen eine unausgesprochene Erwartung.
Das macht schlechte Prozesse erträglicher, aber nicht besser.
Die Organisation verläßt sich dann auf persönliche Kontakte und die dauernde Verfügbarkeit einzelner Leute.

Eine Präsenzpflicht, mit der die Firma diese Lücken überdeckt, behindert auch ihre AI-Einführung.
Was nur im Flur oder am Nachbartisch geklärt wird, fehlt dem Agenten genauso wie dem abwesenden Kollegen.

# Delegierte Arbeit ist nicht neu

Manche Entwickler kritisieren, daß ein Modell aus derselben Spec zweimal unterschiedlichen Code erzeugt.
Das ist eine Entwicklerperspektive.
Ein Engineering Manager, Product Owner oder Technical Program Manager kennt das Problem längst:
Gibt er dieselbe Spec an zwei Teams bei zwei Outsourcing-Firmen, bekommt er ebenfalls zwei Implementierungen.
Er muß beurteilen, ob sie die Anforderung erfüllen.
Identischer Code ist dafür kein brauchbares Kriterium.

Auch eigenes Coden als Weg zur geistigen Modellbildung ist kein neues Thema.
Natürlich kann Implementieren beim Verstehen helfen.
Daraus folgt aber nicht, daß nur derjenige ein System versteht, der jede Zeile selbst geschrieben hat.
Sonst könnte ein Manager nur Arbeit beurteilen, die er selbst implementiert hat.

Organisationen haben dafür längst Wege geschaffen: Entwürfe, Dokumentation, Reviews, Tests und beobachtbares Verhalten.
Diese Wege müssen auch bei Agenten funktionieren.
Der [Harness schließt die Werkzeugschleife]({{< relref "2026-10-14-ein-harness-schliesst-die-schleife" >}}).
Die Firma muß die Arbeit beauftragen und abnehmen können.

Wenn Teile des Prozesses dem Agenten verborgen bleiben, wird es schwer, ihn auf Spur zu halten.
Fehlversuche, zusätzliche Aufrufe und menschliche Nacharbeit machen das Ergebnis teuer.
Am Ende stellt die Firma das Projekt womöglich ein, weil es sich nicht rechnet.
Der Wettbewerb hat diese Lücken vielleicht geschlossen.

AI-Einführung zeigt deshalb mehr als die Fähigkeiten eines Modells.
Sie zeigt, ob eine Organisation ihre eigene Arbeit erklären, übergeben und prüfen kann.
Wer dafür erst alle Beteiligten ins Büro holen muß, hat ein Organisationsproblem.
