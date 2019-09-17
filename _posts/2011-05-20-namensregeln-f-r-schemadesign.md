---
layout: post
published: true
title: Namensregeln für Schemadesign
author-id: isotopp
date: 2011-05-20 14:24:26 UTC
tags:
- mysql
- lang_de
feature-img: assets/img/background/mysql.jpg
---
Ein Freund fragte mich nach Konventionen für die Benennung von Tabellen bei
der Entwicklung von Schemata für MySQL Datenbanken. Es begann damit, daß er
mich fragte, wie man denn wohl eine Relation benennen soll, also eine
Hilfstabelle, die zwei Tabellen in einer n:m-Beziehung miteinander
verbindet.

In einem alten Job hatten wir die unten stehenden Regeln. Sie sind recht
willkürlich und man kann sich anders entscheiden, aber wir hatten das so
gemacht und es hat gut für uns funktioniert.

Jede Tabelle bekommt einen Namen in Kleinbuchstaben (oder der Server läuft
mit `lower_case_table_names = 1`, was sowieso empfehlenswert ist). Der Name
ist ein beschreibendes Wort im Singular. Auf diese Weise hat man weniger
Schmerzen, wenn man über eine Query an einem Beispiel diskutiert. Zusätzlich
wird für jede Tabelle ein eindeutiges Kürzel definiert.

> Beispiel: Die Tabelle `kunde` bekommt das eindeutige Kürzel `k`.

Wir definieren alle Spalten in einer Tabelle mit Namen, die mit dem Kürzel
und einem Unterstrich beginnen. Ausnahmen sind Fremdschlüssel, die literal
aus der originalen Tabelle übernommen werden. Sie sind dadurch sehr leicht
als Fremdschlüssel zu erkennen und die Originaltabelle ist leicht zu
identifizeren. Der synthetische Primärschlüssel der Tabelle hat immer den
Namen "`id`" (mit dem Tabellenprefix, natürlich).

> Beispiel: Die Tabelle `kunde` (`k`) hat den synthetischen Primärschlüssel
> `k_id`, und Spalten wie `k_vorname`, `k_name`. Jeder Kunde gehört zu genau einer
> `firma` (`f`), da wir hier ausschließlich Geschäftskunden modellieren. Es gibt
> also `k.f_id`, einen Fremdschlüssel von `firma` in `kunde`. Es ist klar, daß aus
> Effizienzgründen ein `INDEX(f_id)` in `k` definiert sein muß, wenn nicht sogar
> eine Foreign Key Constraint (sofern man diese überhaupt verwenden will).

Relationen sind entweder nackte Relationen, die nur die Fremdschlüssel der
beiden zu verbindenden Tabellen enthalten. In diesem Fall heißt die Tabelle
`kürzel-kürzel_rel` und hat als Primärschlüssel die zusammengesetzten
Fremdschlüssel.

> Beispiel: Eine Beziehung zwischen `kunde` und `seminar` ist m:n: Ein Kunde
> kann in mehreren Seminaren sein, und in einem Seminar sind mehrere Kunden.
> Die Tabelle `k_s_rel` hat nur die Spalten `k_id` und `s_id`, und den
> Primärschlüsel `(k_id, s_id)`.

Oder Relationen haben eigene Attribute. In diesem Fall bekommt die Relation
einen beschreibenden Namen und ein Kürzel, einen eigenen Primärschlüssel und
die Fremdschlüsselpaare als unique constraint.

> Beispiel: Die Beziehung zwischen `kunde` und `seminar` hat die Flags
> anreise_am_vortag, abreise_am_folgetag und ein buchungsdatum. Die Relation
> bekommt den Namen `buchung`, ein Kürzel `bu` und eine eigene `bu_id`. Die
> Beziehung `(k_id, s_id)` wird als UNIQUE KEY definiert und modelliert das
> Fakt, daß jeder Kunde in jedem Seminar nur einmal sitzen kann. Die Flags
> werden `bu_anreise_am_vortag` und `bu_abreise_am_folgetag` sowie
> `bu_datum`.

Jede Tabelle bekommt immer eine Spalte "changed timestamp" (die sich laut
MySQL timestamp Magie selbst aktualisiert) und dies ist immer die rechteste
Spalte jeder Tabelle. Das erlaubt zwar immer noch kein Change-Tracking
(Deletes gehen verloren, Change Tracking geht nur mit dem Binlog richtig),
aber es ist sehr nützlich zum Debuggen.
