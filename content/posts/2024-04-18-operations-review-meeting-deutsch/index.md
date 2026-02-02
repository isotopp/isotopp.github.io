---
author: isotopp
title: "Operations Review Meeting (deutsch)"
date: "2024-04-18T05:06:07Z"
feature-img: assets/img/background/rijksmuseum.jpg
toc: true
tags:
- lang_de
- erklaerbaer
- work
aliases:
  - /2024/04/18/operations-review-meeting-deutsch.html
---

[In English]({{< relref "2024-04-18-operations-review-meeting.md" >}})

Montagnachmittag, "Operations Review Meeting".

Der perfekte Zeitpunkt, um sich während des Zoom Meetings ein Nickerchen zu gönnen, 
während eine Gruppe von Management-Personen ohne technischen Hintergrund 
sich für 90 Minuten einschläfernde PowerPoint-Folien vorführen wird.

Fred Irgendwas, zuständig für den Wasauchimmer-Service,
berichtet stolz, dass die Anzahl der Prio 1-Vorfälle in diesem Quartal zwar um 17 Prozent gestiegen ist,
aber die TTR deutlich gesunken ist.
Das ist doch was Gutes, oder?

Wie bitte? 
Ein Blick ins Unternehmens-Jargon-Lexikon: TTR (Time To Resolution) ist die Zeit bis zur Lösungn des Incidents.

Okay, Fred.
Zeit für eine Intervention.

Siebzehn Prozent ist eine vertraute Zahl. Also hattet ihr im Q4 sechs P1s und jetzt habt ihr sieben?

Fred bestätigt das.

Gut. Wenn es 100 im Q4 und 117 im Q1 gewesen wären, dann würdest du jetzt Burger braten.

Also Fred, das ist eine kleine, ganze Zahl.
Warum schaltest du nicht mal das Screen-Sharing aus,
und erzählst uns, was diese sieben Mal im Detail passiert ist,
als wir einen Produktionsausfall wegen des Wasauchimmer-Dienstes hatten?

Fred weiß es nicht.
Er ist nicht technisch.
Er holt Jane in die Konferenz.

Jane weiß Bescheid.
Jane ist ebenfalls nicht technisch, sie hat denselben MBA wie Fred,
aber der entscheidende Unterschied ist, dass Jane einen Pager trägt, weil Jane sich kümmert.

Wenn ihr Team aufwacht, wacht sie auch auf, und so weiß sie wie es ist.
Sie **versteht** es auf eine sehr greifbare und persönlich schmerzhafte Weise.
(Ich habe Joe zu Jane geändert, weil es zu 80 % eine Jane ist, die sich kümmert.)

Jane berichtet,
dass drei der Q4-Vorfälle und vier der Q1-Vorfälle auf ein Problem mit der Passwortbereitstellung
zwischen Vault und den Datenbanken zurückzuführen sind.
Es kommt regelmäßig vor, dass einige Authentifizierungstoken nach einem Redeploy ablaufen,
obwohl der Redeploy diese mit aktualisieren sollte.

Das ist interessant, viel interessanter als das Zahlen-Hokuspokus von Fred.

Jane berichtet weiter,
dass die TTR gesunken ist, weil sie das Problem jetzt kennen
und es Teil der Deployment-Checkliste und der Incident-Resolution-Dokumentation ist.

Auf die Frage, warum das Problem nicht an der Wurzel behoben wird,
erklärt Jane, dass dies ein Operations-Problem ist und nicht Teil des Feature-Entwicklungs-Backlogs,
und daher eine niedrige Priorität hat.
Backlog-Items mit niedriger Priorität schaffen es nie in den eigentlichen Sprint.

Also, Jane,
was du uns damit sagen willst, ist,
dass wir Ausfallzeiten haben, die uns Geld durch verlorene Umsätze kosten,
weil wir Operations unterpriorisieren und nicht ernst nehmen.
Und weil wir das Feedback von Operations nicht in den Backlog-Priorisierungsprozess einfließen lassen?

Jane stimmt dem zu, in diesem nervigen, unverbindlichen Unternehmenssprech, das wir alle hassen.
Sie erwähnt auch, dass die Operations unterbesetzt sind,
weil drei von den zusätzlichen benötigten Stellen abgelehnt wurden,
und die anderen beiden von Senior auf einen Regular und einen Junior herabgestuft wurden.
Operations wird das Problem also auch nicht selbst lösen können,
sondern ist auf eine Lösung aus dem Sprint des Feature-Teams angewiesen.

Das Unternehmen zieht es vor, Geld für Entwickler auszugeben, denn Operations sind nur ein Kostenfaktor.

Das Unternehmen erwägt den Umzug zu AWS, weil Operations ein schwieriges Thema ist,
und sie sich auf das Geschäft konzentrieren wollen.

Die Wahrheit ist, dass sie keine Ahnung haben, wie ihre Geschäftsprozesse tatsächlich vor Ort ablaufen.
Und es ihnen im Grunde egal ist.
Und bald werden sie noch weniger davon verstehen, weil es von hier aus genau so weitergeht.
Die ganze Zeit.

Das passiert in Unternehmen auf der ganzen Welt, und so häuft sich der Schlamassel an.
So, oder auf eine von einer Milliarde andere Arten, die tatsächlich isomorph zu dieser sind.
