---
layout: post
published: true
title: Ein paar Gedanken zu Foreign Key Constraints
author-id: isotopp
date: 2009-10-20 08:25:10 UTC
tags:
- datenbanken
- development
- mysql
- sql
- sqlite
- lang_de
feature-img: assets/img/background/mysql.jpg
---
Ich lese gerade [SQLite Foreign Key Support](http://www.sqlite.org/draft/foreignkeys.html) und ich muß sagen, ich kann mir ein leichtes Grinsen nicht verkneifen.

Also, ich finds ja gut, daß SQLite die Option für Foreign Key Constraints implementiert und ich finds sogar noch besser, daß mit DEFERRABLE INITIALLY DEFERRED sogar die einzig sinnvolle Weise das zu tun bereitgestellt wird, aber ich frag mich schon, wozu das gut sein soll.

## Foreign Keys

Aber von vorne. Wenn eine Tabelle einen Primary Key hat, dann kann jede Zeile in der Tabelle über diesen Key eindeutig identifiziert werden. Das erlaubt es, in anderen Tabellen auf Zeilen der Ausgangstabelle Bezug zu nehmen: 

```mysql
CREATE TABLE a (
  aid INTEGER UNSIGNED NOT NULL PRIMARY KEY,
  adata VARCHAR(20) NOT NULL
);

CREATE TABLE b (
  bid INTEGER UNSIGNED NOT NULL PRIMARY KEY,
  aid INTEGER UNSIGNED NOT NULL,
  bdata VARCHAR(20) NOT NULL
);
```


Hier ist `b.aid` der Primärschlüssel von `a`, der in `b` genannt wird. Wir nennen `b.aid` den "Fremdschlüssel von a in b".

Dazu ein paar Anmerkungen, weil es oft nachlässig gehandhabt wird: `aid` ist kein Fremdschlüssel, sondern `aid` ist nicht eindeutig. `a.aid` ist ein Primärschlüssel, `b.aid` ist "der Fremdschüssel von a in b" und ohne den "von a in b"-Teil ist es streng genommen auch wieder nicht eindeutig. 

Dennoch sagen viele Leute "aid ist Fremdschlüssel" und überlassen es dem Kontext, klarzustellen daß "b.aid ist ein Fremdschlüssel von a in b" gemeint ist. Da muß man sich dran gewöhnen und das mental korrekt expandieren.

Und schließlich ist es tatsächlich so, daß schon das bloße Anlegen von `b.aid` und Befüllen von `b.aid` mit Werten von `a.aid` ausreicht, um eine Fremdschlüsselbeziehung zu definieren. Es kann nun sein, daß jemand oder etwas illegale `a.aid` in `b.aid` hinterlegt, daß also `b.aid` existieren, für die es keine passenden `a.aid`-Einträge gibt, und das führt uns zur folgenden Verschärfung.

## Foreign Key Constraints

Solche illegalen Werte in `b.aid` zu verhindern ist die Aufgabe einer FOREIGN KEY CONSTRAINT, aber diese ist vollkommen optional. Wollte man sie haben, definierte man sie so: 

```mysql
CREATE TABLE b (
  bid INTEGER UNSIGNED NOT NULL PRIMARY KEY,
  aid INTEGER UNSIGNED NOT NULL,
  bdata VARCHAR(20) NOT NULL,
  FOREIGN KEY (aid) REFERENCES a(aid) -- hier noch Optionen
);
```

und wo der Kommentar Optionen vorsieht könnte man noch Dinge notieren wie DEFERRABLE INITIALLY DEFERRED.

Einige Datenbanken-Implementierungen verlangen auch noch Nebenbedingungen wie "auf a.aid und auf b.aid muß jeweils ein Index definiert sein". Das ist sogar dann sinnvoll, wenn die Implementierung es nicht verlangt, aber im mathematisch-definitorischen Sinne nicht notwendig. Die Implementierungen verlangen so etwas, denn wann immer wir eine CONSTRAINT definieren, muß diese ja auch geprüft werden. Für die Prüfung wollen wir realistischerweise, daß diese effizient durchgeführt wird - das geht aber nur mit einem Index flink.

### Eine kleine Abschweifung: Schlüssel vs. Index

Eine kleine Abschweifung: Das ist auch der Grund, warum die Begriffe Schlüssel (Key) und Index von Datenbankern synonym verwendet werden: Ein Schlüssel ist etwas, das eine einzelne Zeile (UNIQUE KEY) oder eine zusammengehörende Gruppe von Zeilen identifiziert, ein Index ist die Struktur, die diese Dinge schnell auffindbar macht.

Definiert man zum Beispiel eine UNIQUE KEY CONSTRAINT (es kann nur eine Zeile dieses Wertes in einer Tabelle geben), dann muß beim Einfügen von neuen Zeilen ja in der Tabelle nachgesehen werden, ob es diesen Wert vielleicht schon gibt. Ohne einen Index wäre das eine sehr langsame Operation - daher geht eine UNIQUE KEY CONSTRAINT immer mit einem Index auf die Zeile zusammen und daher verwenden die meisten Datenbanker die Begriffe KEY und INDEX austauschbar, auch wenn sie verschiedene Dinge bezeichnen: Ein Schlüssel ist eine Eigenschaft einer Spalte, ein Index ist eine Struktur der Implementierung.

## Wozu FK-Constraints?

Wie auch immer: Die Aufgabe einer FOREIGN KEY CONSTRAINT ist es, sicherzustellen, daß in der Fremdschlüsselspalte b.aid zu jedem Zeitpunkt immer nur gültige Werte stehen.

In MySQL ist es nun leider so, daß InnoDB dies etwas dämlich implementiert: Dort wird nämlich - wie in SQLite per Default auch - nach jedem Statement geprüft, ob die Constraint gültig ist oder verletzt wird. Das macht es notwendig, die Reihenfolge von Operationen so zu gestalten, daß die Constraint immer gilt - selbstreferentielle Strukturen nerven besonders, weil man diese quasi nur Top-Down aufbauen kann, und wenn die Struktur zirkulär ist, kann man sie gar nicht errichten, es sei denn, man schaltet die Constraint-Prüfung aus.

Ich kann also in MySQL nicht so vorgehen: 

```mysql
BEGIN WORK;
INSERT INTO b (bid, aid, bdata) VALUES (1, 1, "keks");
INSERT INTO a (aid, adata) VALUES (1, "keks");
COMMIT;
```

Dies scheitert nach dem ersten Insert, weil die `a.aid = 1` noch nicht existiert, wenn ich die `b.aid = 1` in die Tabelle einfüge. Technisch ist das eigentlich kein Problem, denn da dies alles in einer Transaktion geschieht tauchen beide Werte gleichzeitig erst zum COMMIT in der Datenbank auf, aber die Prüfung erfolgt leider per Statement und nicht per Transaktion. Ich muß also Entwickler als meinen Code passend strukturieren, egal ob das der Anwendungslogik gerecht wird oder nicht.

In SQLite darf man immerhin DEFERRABLE INITIALLY DEFERRED angeben, und das will man offenbar auch dringend. In diesem Fall wird die FK-Constraint nicht bei jedem Statement geprüft, sondern erst am Ende einer Transaktion beim COMMIT. Man kann sich also seine Strukturen nach Belieben zusammenbauen, und die Datenbank erzwingt dabei keine besondere Ordnung der Anweisungen im Code, sondern verlangt nur, daß in dem Moment, wenn man seine Änderungen für Dritte sichtbar publiziert, die FK-Constraints eingehalten werden.


> Der Sinn von FK-Constraints ist es, gültige Datenstrukturen und insbesondere gültige Verknüpfungen zwischen Daten zu erzwingen, die auf verschiedene Tabellen desselben Schemas oder derselben Instanz verteilt sind. Die FK-Constraint macht diese Prüfung in der Datenbank, denn nur so ist sichergestellt, daß unterschiedliche Anwendungen, die unterschiedliche Bibliotheken und Programmiersprachen verwenden, denselben Bedingungen beim Schreiben hinsichtlich der Gültigkeit von Datenstrukturen unterliegen.

Bitte mal Anhalten und den vorhergehenden Satz ein zweites Mal lesen.

Im Netz findet man mitunter Diskussionen über Datenmodellierung und dort gibt es in der Regel eine Gruppe von Personen, die vehement die Auffassung vertritt, daß ein Datenmodell, das FK- und andere Constraints nicht im Modell definiert schlicht falsch (ersatzweise "Schrott", "Müll", "Gefrickel" und anderes) ist.

## Grenzen und Probleme von FK-Constraints

In der Aussage oben stecken ein paar Annahmen drin, und die sind nicht unbedingt immer gegeben. Wenn sie nicht gegeben sind, sind FK-Constraints mindestens sinnlos, manchmal sogar schädlich.

Eine Annahme, nämlich die, die mich angesichts der FK-Constraints von SQLite grinsen ließ, ist wie folgt: Es ist die Rede davon, daß unterschiedliche Anwendungen mit unterschiedlichen Bibliotheken oder Programmiersprachen auf die Datenbank zugreifen. SQLite ist aber eine Embedded Datenbank, die Daten in einer einzelnen Datenbankdatei ablegt und Locking auf der Ebene der gesamten Datenbank betreibt. Auf eine SQLite-Datenbank (etwa die Titelliste von iTunes oder das MacOS Adreßbuch) greift in der Regel nur eine Anwendung (iTunes, das Adreßbuch) schreibend zu. FK-Constraints in SQLite sind… ziemlicher Overkill.

Auch bei "uns" in der Produktion haben wir uns entschieden, MySQL FK-Constraints überwiegend nicht zu nutzen. Das hat eine Reihe von Gründen, die zum Teil auch nur gültig sind, weil wir in einer speziellen und sehr günstigen Ausgangslage sind.

In MySQL ist die Nutzung von FK-Constraints überhaupt nur sinnvoll möglich, wenn die InnoDB Storage Engine verwendet wird. In MyISAM wird die Syntax für Constraint Definitionen zwar geparsed, dann aber nicht beachtet. Wir nutzen InnoDB, aber wir definieren keine neuen Constraints mehr und wir nehmen die existierenden Definitionen schrittweise nach Möglichkeit zurück.

Das ist so, weil zum einen unser Schema inzwischen größer als eine Instanz ist: Wir haben zwar verschiedenen MySQL-Instanzen, aber diese sind in Wirklichkeit alle nicht alleinstehend, sondern wir haben Bezüge zwischen Daten, die in verschiedenen Instanzen liegen: Daten in Tabellen der "av"-Instanz beziehen sich auf Datensätze, deren Rows in Tabellen der "bp"-Instanz liegen. Dies ist mit einer FK-Constraint nicht zu modellieren, und wenn man es modellierte wäre es kaum effizient zu prüfen: Die Netzwerk-Latenzen würden sich akkumulieren und zu sehr bremsen um praktikabel zu sein.

Es ist auch absehbar, daß wir bald Tabellen haben werden, die größer als eine Instanz sind, daß wir also Sharding betreiben werden müssen. In diesem Fall verschärft sich die Situation noch weiter.

Es ist weiterhin so, daß wir so sehr auf Performance optimieren müssen, daß wir uns die Kosten von FK-Constraints nicht mehr leisten können und wollen. Wenn man eine FK-Constraint definiert, dann muß diese ja auch geprüft werden - MySQL prüft sie bei jedem Zugriff.

Das bedeutet aber bei jedem Schreibzugriff gibt es einen weiteren Lookup in der referenzierten Tabelle. Dazu muß die referenzierte Tabelle wiederum zum Teil geladen werden, was den Cache-Footprint bzw. den Working Set der Anwendung auf eine Weise vergrößert, die in bestimmten Situationen fatal sein kann. Die Anwendung kann plötzlich von speichergesättigt in einen disk-bound Zustand übergehen, weil sich der Working Set durch die Lookups so stark vergrößert, daß der aktive Teil der Anwendung nicht mehr im Speicher gehalten werden kann.

Obendrein kommt im speziellen Fall von InnoDB, daß Schreibzugriffe auf ein Ende einer FK-Constraint nicht nur den beschriebenen Record X-Locken, sondern auch das andere Ende der Beziehung S-Locken, und daß diese Locks außerdem bei kaskadierenden Beziehungen über hierarchische Strukturen noch weiter eskalieren können. Schemata mit vielen FK-Constrains und vielen Schreibzugriffen erzeugen also unter Umständen um Größenordnungen mehr S-Locks und das wiederum kann die Rate von Deadlocks und Lock Timeouts um ein Vielfaches nach oben treiben.

Bei "uns" ist es nun so, daß wir in der Produktion ein reines Open Source Umfeld haben. Wir wissen also nicht nur, welche Anwendungen bei uns auf Datenstrukturen in der Datenbank zugreifen, sondern wir kontrollieren auch, wie sie es tun. Wir können erzwingen, daß alle Operationen auf Daten in der Datenbank durch bestimmte Routinen in bestimmten Bibliotheken erfolgen und daß dort bestimmte Dinge erzwungen werden können.

Wir haben uns also ein System gebaut, daß FK-Constraints außerhalb der Schemadefinition nachbaut. Unsere FK-Constraints können daher Instanzengrenzen überbrücken. Wir können außerdem optional entscheiden, daß wir die Constraintprüfungen nicht live vornehmen wollen, sondern daß wir die Tests stattdessen in Intervallen im Batch auf den bestehenden Daten vornehmen (ähnlich einem fsck). 

Da wir ziemlich intensiv Replikation einsetzen, brauchen wir das auch nicht auf einer produktiven Datenbank zu tun, sondern können das auf Kopien von Instanzen machen, die offline genommen worden sind. Und wir müssen das nicht oft tun, denn wenn wir verifiziert haben, daß der Code, der Änderungen an den Daten vornimmt, diese Änderungen korrekt durchführt, dann können Verletzungen der Constraints nur noch dann vorkommen, wenn Ausnahme-Betriebszustände erreicht wurden.

## ON DELETE CASCADE ist noch mal ein Extraproblem

Schließlich ist es so, daß FK-Constraints auch mit triggerhaften Aktionen verknüpft sein können. ON DELETE CASCADE zum Beispiel ist so eine Aktion: Sie bewirkt, daß alle von einer `a.aid` abhängigen Zeilen in `b` gelöscht werden, wenn `a.aid` gelöscht wird.

Solche Kaskaden sind aus mehreren Gründen schädlich und man sollte diese Art von Definition grundsätzlich nicht verwenden, selbst wenn man FK-Constraints ansonsten einsetzt oder einsetzen muß: Solche Definitionen fördern schlechten und schwer zu wartenden Code.

Statt die Datenstrukturen im Code aufzuräumen und etwa abhängige Records explizit zu löschen, wird man einfach ein `DELETE FROM a WHERE a.aid = ?` programmieren und die FK-Constraints implizit die Arbeit tun lassen. Implizite Aktion macht aber die Funktion des Programmes opak: Dem nächsten Entwickler, der auf den Code schaut, wird nicht klar sein, daß dies eine teure Operation ist, die sehr große Folge-Aktionen und Folgekosten in anderen Tabellen nach sich zieht. Die Wirkung von Statements ist auch nicht mehr auf eine einzelne Tabelle beschränkt, sondern das harmlose kleine DELETE kann eine Spur der Verwüstung durch die gesamte Datenbank ziehen (insbesondere bei Vorhandensein von selbstreferentiellen Strukturen mit FK-Constraints).

Korrekt wäre die Definition einer FK-Constraint, die die Löschung der 1-Seite einer 1:n-Beziehung verhindert solange noch n-Records existieren, die sich auf den zu löschenden 1-Record beziehen. Der Entwickler ist dann gezwungen, den entsprechenden Löschcode in der Anwendung explizit hinzuschreiben, oder, wenn er schlauer ist, die passende Funktion aufzurufen, die die Löschung für ihn vornimmt. In jedem Fall ist aber durch den Blick auf den Code allein sofort klar, was dort passiert und wie groß der Einschlag ist, den man spürt, wenn dieser Code auf die Datenbank trifft.
