---
layout: post
title:  'IT modernisieren und konsolidieren'
author-id: isotopp
feature-img: assets/img/background/neuland.jpg
date: 2020-10-05 21:52:04 +0200
tags:
- lang_de
- cloud
- data center
---
Ich schrieb in einem [Twitter Thread](https://twitter.com/isotopp/status/1313084134168944640) über [Posix Dateisysteme vs. Object Stores]({% link  _posts/2020-10-05-what-are-the-problems-with-posix.md %}):

> UNIX FS ist 1974.
> BSD FFS ist 1984.
> XFS ist 1994.
> ZFS (und Btrfs und Wafl) sind LFS, also 2004.
> Object Storages, LSM, "RocksDB" ist ca. 2014, um den Takt zu halten.

und wurde gefragt: "Was kommt 2024". Meine halb spöttische, halb ernst gemeinte Antwort war:

> Irrelevant.
>
> 2024 läuft Dein Code serverless bei einem professionellen Betreiber und vom lokalen System und dem lokalen Dateisystem kriegst Du nix mehr zu sehen außer einer monatlichen Rechnung.

## Rein in die Cloud

Selbst wenn es kein "serverless" ist, sondern eine VM oder ein Container: Wir haben dazu gelernt, und sind besser geworden. Deswegen sind aber auch unsere Standards und Anforderungen gestiegen und wir brauchen bessere Umgebungen.

Die Prozesse und die Technik lokal so aufzusetzen, daß man weiterhin compliant bleibt mit SOX, PCI und PII ist eine ganze Menge Arbeit, die nicht zur Kern-Mission der meisten Unternehmen gehört. Es ist auch ein Investment, das besser in geschäftsrelevante Bereiche ginge. Techniken und Infrastruktur bereit zu stellen, die in einem Amazon-like Environment "so da" ist wird immer schwieriger und teurer werden.

### Ein paar Selbstverständlichkeiten

Auf der Minimum-Liste für alle stehen inzwischen Dinge wie

- Single Sign On und Identity Management (SSO und IAM)
- Rollenbasierte Access Controls (RBAC)
- eine PKI
- Encryption at Rest und Encryption in Flight
- Administrator Roles mit Segregation of Duties
- Mandatory Access Controls and Privilege Limits
- Audit Trails
- Complance und Audit von all dem

Und das ist schon mehr Arbeit als man als Firma mit einem eigenen RZ-Betrieb selbst leisten und erfinden kann. Es ist auch etwas, das so nicht fertig kaufbar und als Produkt installierbar ist, weil es eben nicht nur Technik ist, sondern auch Prozeß und Kultur.

Es sind aber alles Dinge, die man als Technik in einem AWS Environment oder einer anderen großen Cloud per Default bekommt und zu der es dann auch Unterweisungen gibt, die einem Best Practices und funktionierende Prozesse nahe bringen.

Dazu kommen dann Dienste, die in einem eigenen Rechenzentrum mühevoll oder teuer zu schaffen sind, die man aber in einer großen Cloud testweise oder produktiv dazu nehmen kann, ohne eigenen Aufwand zu treiben.

- Geocoder
- Spracherkennung
- Bilderkennung
- Integration in eine skalierbare Big Data Umgebung
- Integration von Eventprozessoren
- Event Driven Execution ("Step Functions"), die es auch Nicht-Codern erlauben, Anwendungen durch Zusammenklebeben von -aaS Diensten zu schaffen.

Aber das sind nur Beispiele aus hunderten von Diensten...

### Nicht die Mission der meisten Betriebe

Das ist etwas, das einer traditionellen RZ-IT nicht zugänglich ist, und das auch unverhältnismäßig viel Kapital, Investment und Personal binden würde, würde man es selbst lokal entwickeln. Schon so etwas simples wie RDS funktioniert besser und automatischer als alle selbstgestrickten DevOps Managementscripte für Datenbanken, die man selbst haben kann.

Druck kommt nicht nur aus dem Management und aus der Compliance, sondern auch von unten: Die aktuelle Generation von Entwicklern hat nie mit einem lokalen RZ gearbeitet, sondern ist in AWS groß geworden. Sie setzt die Qualität der Implementierung und die Prozesse von Amazon als gegeben und als Maßstab voraus. Sie setzt die Leichtigkeit von Operations und Observability voraus, die für eine Cloud-Umgebung typisch sind.

Deswegen ist die Zukunft von 2024 mindestens hybrid. Aber effektiv wird kein Betrieb mit einem lokalen Rechenzentrum und reinen IaaS-Angeboten noch groß Stiche holen.

Das ist einer der Gründe, warum Europa als Technologieraum zunehmend abgehängt ist. Nicht nur viele Politiker und Entscheider verstehen nicht mehr, was in den letzten 10 Jahren passiert ist, sondern auch viele Sysadmins "on the ground" haben die Veränderung des Entwicklerbetriebes in den letzten 10 Jahren grundlegend verpaßt und können nicht erkennen, welche Gestaltungsdrücke gerade auf ihrer Umgebung lasten.

Das sehen wir nicht nur in der "deutsche Schulen in COVID" Videokonferenzdiskussion, sondern auch in der ganzen Klasse von BOFH-Bemerkungen, die aus dem Sysadmin Lager oft kommt. Ich habe dazu vor über fünf Jahren schon einmal was gemacht: [Slides: Go away or I will replace you with a very small Shell script - ein paar Gedanken zum Thema Devops](https://www.slideshare.net/isotopp/go-away-or-i-will-replace-you-with-a-little-shell-script#2) ([Video von der Froscon Version](https://media.ccc.de/v/froscon2015-1500-go_away_or_i_will_replace_you_with_a_very_little_shell_script)).

Die Frage ist nicht, wie ein lokales Rechenzentrum Rechner betreibt und bereitstellt - das ist ein gelöstes Problem. Sondern welche Dienste sie darauf fertig im Angebot haben, ob diese Dienste mit aktuellen Standard und Anforderungen in Compliance sind, ob sie eine API haben, und sie mit lokalem Tooling integrierbar sind.

### Integration und Bildung von untereinander abhängigen Systemen

Wir sind dabei, von individuellen, frei stehenden und trennbaren Teilen zu integrierten Systemen zu gehen. Das hat Vorteile, weil so Prozesse entstehen und eingeübt werden, die meßbar Qualität verbessern und - wichtiger noch - automatisieren.

Das ist nicht nur im Bereich Betrieb mit der Cloud so, sondern ist ein größerer Trend, der auch in der Software-Entwicklung sichtbar wird: Entwickler arbeiten nicht mehr mit vi im leeren Editor, sondern haben in der Regel Sprachen mit umfangreichen Bibliotheken und Integrationen im Betrieb. Das hat Folgen.

In der Entwicklung: Wenn es keinen JetBrains-Editor für die Sprache gibt, wenn sie von gitlab und github nicht erkannt und ausgewertet wird, wenn sie keinen Dependency-Manager und keine CI/CD Integration hat, dann ist eine moderne Programmiersprache - Entschuldigung - Plattform - Entschuldigung - Ökosystem nicht vollständig und nicht mehr konkurrenzfähig.

Wenn eine Sprache nicht von einschlägigen Security- und Audit-Werkzeugen unterstützt wird, wenn sie nicht [bei SonarQube](https://www.sonarqube.org/features/multi-languages/) oder ähnlichen auf der Liste steht, wenn sie nicht von Valgrind, Fuzzern und anderen Werkzeugen unterstützt wird, dann hat eine moderne Programmierumgebung in einem Enterprise-Umfeld zunehmend Schwierigkeiten, die steigenden Compliance-Anforderungen im Bereich Software-Entwicklung und Qualitätssicherung zu erfüllen.

Im Betrieb: Ohne Identity, PKI, SSO, RBAC, Segregation of Duties, Encryption überall, Auditing und enforceable maximum permissions hast Du Compliance Probleme oder wirst sie bald haben. Und ohne eine API für alles, Tooling für diese API, Infrastructure als Code, Codified Practices wie CI/CD hast Du keine attraktive und effektive Entwicklungsumgebung für Deine eigenen Leute.

Das sind aber Gedanken und Entwicklungen, die in Deutschland an Politik und an Teilen der "Informatikschaffenden" vorbei gegangen sind, oder belächelt worden sind.

## Raus aus der Cloud

Offensichtlich sind Server Wurst. Die Frage ist mehr, was da drauf läuft, welche Dienste und Integrationen bestehen. Das ist mit einem IT-Team von 4-5 Leuten vor Ort nicht sinnvoll zu schaffen, sondern im günstigsten Fall ein blankes IaaS, nicht unbedingt von der guten und vertrauenswürdigen Sorte.

Schau Dir an, was zum Beispiel Scaleway oder OVH macht, oder 1und1 in Deutschland. Das sind fitte Teams, die eine Menge weg schaffen. Aber deren Clouds sind relativ dienstfreie IaaS-Clouds mit ein wenig Object Storage, und alle größeren Dinge mußt Du Dir selbst auf deren IaaS ansibilisieren.

Das ist aber der Stand von 2010, nicht 2020. In 2020 ist ein Cloudkunde hinter Diensten her, damit er die nicht selbst betreiben muß.

Es ist ja nicht nur unwürdig, HPE deren defekte iLOs und kaputte Festplatten-Firmware zu debuggen, sondern man will sich auch einfach ein MySQL oder Postgres klicken können. Oder gar einfach "einen KV Storage benutzen" und Dein Zeugs in ein Dynamo kippen und Dich gar nicht mehr um Instanzgrößen kümmern müssen, sondern nur noch für Storage und Zugriff nach Verbrauch bezahlen.

Und an dieser Stelle kommt wieder die Politik durch.

### Arbeitsteilung beruht auf Vertrauen. Vertrauen kommt aus Transparenz und Verläßlichkeit

Das funktioniert mit den Diensten nämlich ganz wunderbar in der "Arbeitsteiligen Gesellschaft™" - wir nennen so etwas Zivilisation. Nur, wenn wir zivilisiert, verantwortungsvoll und vertrauensvoll miteinander umgehen, dann kann man sich selbst die Arbeit mit den ganzen Diensten schenken und jemand anders beauftragen.

Dazu sind bestimmte gesellschaftlichen Bedingungen notwendig, die zu schaffen sind. Wir brauchen ein System von Checks und Balances, internationalen Verträgen und Business Practices, und dann ein System von Kontrollen und *Vertrauen in die Wirksamkeit dieser Kontrollen*, damit wir zivilisiert cloudcomputen können.

Wenn Du aber einzelne Nation States hast, die technisch gesehen als Attacker da stehen ("Nation State Attacker", "NSA") und sich das auch so vorbehalten, dann ruiniert das die Geschäftsgrundlage für die arbeitsteilige Gesellschaft, mithin die Zivilisation selbst. 

Wenn Du einzelne Anbieter hast, die über die Verarbeitung und Nutzung der Daten nicht transparent sind, oder man den von ihnen vorgezeigten Audits kein Vertrauen schenken kann, dann ... genau dasselbe.

Und wenn Du eine Politik hast, die ein Klima schafft, in der das Verständnis dieser Tatsachen geleugnet oder ignoriert wird, dann ruiniert das dieses Konzept schon.

Das ist genau das, was Gestalten wie Trump, BoJo aber auch von Storch zerstören, wenn sie Isolationismus, Staatswilkür und Ignoranz gegenüber internationaler Ordnung demonstrieren. Das ist aber auch das, was Gestalten wie Audi Scheuer und sein Meister, Imperator Seehofer vernichten, denn solche vorgelebte Unfähigkeit und Korruption saugen der Zivilisation das Rückenmark aus. Das ist dann das, was zu Dingen wie Wirecard führt, zum Dieselskandal und zu Situationen, bei denen ein Volkswagen-Compliancemanager bei der Dokumentation illegaler Geschäftspraktiken auf eine Weise zu Tode kommt, die in jede Netflix-Mafiaserie gepaßt hätte.

In so einem Umfeld ist eine Auslagerung der IT an Dritte für Unternehmen ein bedenkenswertes Risiko statt eine Erleichterung.