---
author-id: isotopp
title: "A01:2021 - Broken Access Control"
date: 2021-11-16T11:28:27+01:00
feature-img: assets/img/background/schloss.jpg
tags:
- lang_de
- security
---

Dieser Artikel wurde von Lenz Grimmer auch [ins Englische]({{< ref "/content/posts/2021-11-16-a01-2021-broken-access-control-en.md" >}}) übersetzt.

In einem 
[Twitter-Thread von Christian Basl](https://twitter.com/ChristianBasl/status/1459851276817158151)
ging es um die von
[zerforschte App "Learnu"](https://zerforschung.org/posts/learnu/).
Basl schreibt:
> Die Betreiber von Learnu sagen, sie hätten keine Fachkenntnisse in IT-Sicherheit und hätten sich auf externe Berater verlassen.
> So kam Learnu unbekannterweise unsicher auf den Markt.

In der sich entwickelnden Diskussion vertrat [Andreas Dewes](https://twitter.com/ardewes/status/1460240730698493957) den Standpunkt
> Die meisten Start-ups die ich kenne gehen durch eine Phase, in der IT-Sicherheit und Compliance eher im Hintergrund stehen.
> Wenn sie größer werden fangen sie an sich darüber Gedanken zu machen u.a. weil Kunden oder Partner Zertifizierungen verlangen, z.B. SOC 2 oder ISO-27001.

Das ist angesichts von [OWASP A01:2021 - Broken Access Control](https://owasp.org/Top10/A01_2021-Broken_Access_Control/) eine lustige Aussage.
[OWASP](https://de.wikipedia.org/wiki/Open_Web_Application_Security_Project) ist eine NGO, die die Sicherheit von Anwendungen und Diensten im Internet verbessern will.
OWASP gibt dazu eine jedes Jahr aktualisierte Top-10 Liste von Sicherheitsproblemen bei Anwendungen heraus.

Für 2021 hat es im Vergleich zu 2017 die folgenden Änderungen gegeben:

![](/uploads/2021/11/owasp-mapping.png)

*Broken Access Control war 2017 auf Platz 5 und ist jetzt Problem #1. 94 % der getesteten Anwendungen hatten irgendeine Form von defekter Zugangskontrolle. Der ehemalige #1 Dauerbrenner Injection ist nur noch auf Platz 3.*

Wir sehen ein klassisches Beispiel dafür in einer anderen Schul-Anwendung, die das Team von Zerforschung getestet hat:
[Scoolio](https://zerforschung.org/posts/scoolio/) wurde aufgemacht, indem die Zerforschis 

> Ein Endpunkt der Schnittstelle (Application Programming Interface, API) ist uns dabei sofort ins Auge gefallen: `/api/v3/Profile/{ProfileID}`. 
> …
> Wenn wir spannnende API-Endpunkte finden, die über eine Versionskomponente verfügen (hier `/v3/`), versuchen wir gerne mal, diese zu verändern.
> Also wurde in unserem Fall aus `/api/v3/Profile/{ProfileID}` zu `/api/v2/Profile/{ProfileID}`.
> Und tada: Noch viel mehr Daten!
> Aber unsere eigenen Daten sind langweilig – die kennen wir ja schon.
> Also haben wir auch probiert, eine fremde Profil-ID einzugeben.
> Und zu unserer geringen Verwunderung, aber großen Genervtheit, konnten wir natürlich auf diese detaillierten Daten der fremden ID zugreifen.

Das ist ein klassisches "A01:2021 - Broken Access Control" Beispiel. 
Die Anwendung kennt die Identität des Benutzers, denn sie ist in der App eingetragen.
Sie nutzt diese Information nicht, um die Verbindung zum Server zu authentisieren und autorisieren.
Und entsprechend kann die API genutzt werden, um auf beliebige User-Records zuzugreifen, statt nur auf den eigenen. 

# Identität, Authentisierung, Autorisierung, Auditing und Accounting

Ein paar Begriffe:

- **Identität:** Ich bin ich.
  Aber ich kann nicht auf das Web oder eine API zugreifen.
  Eine Anwendung muss das an meiner statt tun.
  Diese Anwendung verwendet dazu eine eindeutige Benutzerkennung, die "mich" im Kontext der Anwendung repräsentiert.
  Eine Identität mit einem eindeutigem Identifier (einem "Principal") der mich repräsentiert ist aber zunächst einmal eine Behauptung.
- **Authentisierung:** Ich kann das auch beweisen.
  Wenn ich die behauptete Identität beweisen kann, dann bin ich authentisch ich.
  Ich bestätige meine Identität meist mit einem Passwort und oft auch mit einem 2. Faktor (etwa einer vom einem Google Authenticator abgetippten wechselnden Geheimnummer).

Die behauptete und bestätigte Identität muss für einige Zwecke auch noch **verankert** werden, etwa wenn diese Identität an andere Rechte oder Verhältnisse in der realen Welt gebunden werden soll.
Wenn ich zum Beispiel in einer Schul-App eine Schulzugehörigkeit und Klassenzugehörigkeit haben soll, dann ist es unter Umständen gut, wenn ich mir nicht einfach einen Account machen kann.
Stattdessen sollte eine Lehrperson sich das ansehen, mich fragen, ob ich das war und mich dann der Schule und der Klasse zuordnen.

- Einer behaupteten, bestätigten und in der realen Welt verankerten Identität werden dann Zugriffsrechte zugeordnet.
  Das ist eine **Autorisierung**, sie bestimmt, was diese Identität im Kontext der Anwendung sehen, schreiben, verändern und löschen darf.
  Dazu werden wir unten noch ein wenig mehr reden.
- Was ich dann in der Anwendung tu muss unter Umständen beweiskräftig mitgeschnitten werden.
  Etwa dann, wenn die Daten, auf die ich zugreife, besonders schützenswert sind, oder ihre Änderungshistorie dokumentiert werden muss.
  Das kann zum Beispiel im Schulkontext meine Ansammlung von Leistungsnachweisen sein.
  Ein Logbuch, bei dem Zugriffe zwingend und nicht abschaltbar mit Personenidentitäten verknüpft werden nennt man ein **Audit-Log**.
- Wenn ich Dienstleistungen in Anspruch nehme, die Geld kosten, dann muss eine besondere Form von Audit-Log geführt werden.
  Dieses Audit-Log ist die Grundlage der Rechnungslegung und zeigt, welche Person wann welche kostenpflichtige Dienstleistung in Anspruch genommen hat.
  Dieses Logbuch ist Bestandteil des **Accounting**.

Man kann zu jedem dieser Themen viel schreiben, aber uns soll hier in erster Linie *Autorisierung* beschäftigen, eben weil es Thema #1 bei der aktuellen OWASP Liste ist.
Und weil es nicht nur bei den Zerforschis im 
[Scoolio](https://zerforschung.org/posts/scoolio/)
Artikel auftaucht, sondern noch einmal im 
[Mein Schnelltest](https://zerforschung.org/posts/meinschnelltest/)
Artikel:

> Eine der ersten Anfragen, die uns auffällt, geht an `https://corona-api.de/persons/owner/{USER_ID}`, wobei `USER_ID` natürlich die Nummer unseres Accounts ist – z.B. `612341213acab23425251e21`.
> … [Wir verkürzen die URL]…
> Einen Versuch wagen wir noch und entfernen das / am Ende der URL. Und tada:
> ```
> GET https://corona-api.de/persons
>```
> Uns fällt eine Liste mit den Personen, die auf der Plattform registriert sind, entgegen.
> Insgesamt fast 400.000 mit allen Daten, die bei einem Corona-Test eben so erfasst werden.

Zerforschung demonstriert dann auch noch, daß sie in beiden Fällen lustig ihre Identität oder ihre Verankerung (die Schulzugehörigkeit) ändern können (und vermutlich ohne daß das in einem Audit-Log landet), und daß sie nach Belieben Daten schreiben können, indem sie dem 177-jahre alten Robert Koch ein Corona-Testergebnis ausstellen.

# Autorisierung

## Verben und Subjekt-Prädikat-Objekt (Wer tut was mit wem?)

Eine Anwendung hat eine Außenseite.
Das ist eine Liste aller URLs, die aufrufbar sind.
Damit meine ich nicht nur die HTML Webseiten (von denen ja einige auch interaktiv sind und Parameter haben können), sondern auch die API, die den Server für eine App auf einem Telefon oder in einem Browser repräsentiert.
Die Liste aller dieser URLs ist wie eine Liste von Verben:
Tu-Worte, mit denen man der Anwendung Befehle erteilen kann - "zeige mir", "finde mir", "ändere mir", "lösche mir".
Wie in jedem Satz gibt es ein Subjekt - wer befiehlt? - und ein Objekt - was wird von dem Verb manipuliert?

Wir können das in Deutsch aufschreiben:
"Kris will alle Schüler der Heinrich-Heine-Schule in Heikendorf finden."

Oder als Tripel:
(Kris, "finde alle", "Heinrich-Heine-Schule (Heikendorf)")

Oder als Tabelle, mit den Subjekten als Zeilen, den Objekten als Spalten und den Verben da, wo die betreffende Aktion erlaubt ist.
Das ist dann eine Matrix von "Wer darf was tun?".

## Role Based Access Control

Wir sehen dann, daß die Tabelle schnell umfangreich wird, und werden anfangen, die Subjekte zu gruppieren.
Subjekte mit gleichen Rechten gruppieren wir zusammen, in einer *Role*, und benennen diese (zum Beispiel *Schüler der HHS*).
Objekte kann man ebenso gruppieren.
Wir bekommen *Role Based Access Control*, *RBAC*:

Wir können so bestimmten Subjekten, oder Rollen, feste Rechte geben. 
Wir müssen aber immer noch viele Relationen erlauben:
"Schüler der HHS können mit anderen Schülern der HHS Kontakte anbandeln."
und extra, und verschieden davon
"Schüler der Max-Planck-Schule, Kiel können mit anderen Schülern der MPS Kontakte anbandeln."

Offenbar reicht das in diesem Kontext nicht - aber für viele Anwendungen ist das schon ausreichend.
Nämlich immer dann, wenn die interne Struktur innerhalb der Anwendung nicht weiter segmentiert werden muss.

## Attribute Based Access Control

Oft will man Regeln formulieren, die Eigenschaften von Subjekten und Objekten abgleichen.
Ich kann die Zugangsregeln für Schülerkontakte zum Beispiel so vereinfachen, daß ich die Kontakte zulasse, wenn der aufrufende Schüler und der aufgerufenen Schüler dieselbe Schule besuchen.

- "Schüler der HHS können mit anderen Schülern der HHS Kontakte anbandeln."
- "Schüler der MPS können mit anderen Schülern der MPS Kontakte anbandeln."
- …

alle diese RBAC-Regeln werden zu

- "Schüler A kann mit Schüler B Kontakt aufnehmen, wenn `A.schule_id == B.schule_id`"

also wenn Schüler A und B denselben Wert im Attribut `schule_id` stehen haben.

Die Zugriffsrechte werden nun also durch Attribute von Subjekten definiert und können so stark vereinfacht werden.
Das setzt natürlich voraus, daß ich die sicherheitsrelevanten Attribute identifiziere und Änderungen an denen kontrolliere, denn sonst ist der Schutz wirkungslos.

Beispiel: Wenn ein Schüler seine `schule_id` nach Belieben unkontrolliert ändern kann, dann ist ein Vergleich `A.schule_id == B.schule_id` wirkungslos.

# Was heißt das für Anwendungsentwickler?

Als Anwendungsentwickler verwende ich ein Toolkit, um Webanwendungen und APIs zu schreiben.

1. Ich muss wissen, welche Außenfläche meine Anwendung hat, also welche URLs mit welchen Parametern zugelassen werden.
   Das ist nicht schwer.
   Mein Toolkit hat fast sicher eine Funktion, die mir das sagt (`flask routes` oder ähnliche Funktionen sind überall vorhanden).
   Dies ist die Liste meiner Verben.
2. Die Liste der Parameter jeder dieser aufrufbaren Seiten sind die Objekte in meinem Security-Modell.
3. Ich muss meine Anwender identifizieren (ihnen also eindeutige Identifier zuweisen) und authentisieren (sie müssen die behauptete Identität also beweisen).
4. Die Liste dieser Anwender ist dann die Liste meiner Subjekte.
5. Ich muss nun ACL, RBAC oder ABAC Regeln die definieren, "Wer was mit wem" machen kann und dies im Access Control Framework meiner Anwendung ausdrücken.

Das ist nicht schwer, und es ist vor allen Dingen eine notwendige Arbeit.
Nicht nur aus rechtlichen und compliance Gründen, sondern auch, weil dies zu einem Datenmodell einer Anwendung gehört:
Als Nebenergebnis fällt dabei nämlich ein Transaktionsmodell heraus, also ein Diagramm, wie sich die Datensätze meiner Anwendung durch die Aufrufe von Methoden ändern lassen.
Ich erschlage also nicht nur alle Compliance-, viele Datenschutz und alle Security-Pflichten, sondern ich habe den kompletten Data Lifecycle meiner Anwendung mit einem Zustandsübergangsdiagramm dokumentiert,
das sowohl Entwicklern als auch Business Analysts allgemeinverständlich zeigt, was zum Teufel wir hier eigentlich tun und wie wir das modellieren.
