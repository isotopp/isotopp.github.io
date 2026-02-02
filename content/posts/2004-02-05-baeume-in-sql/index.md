---
author: isotopp
date: "2004-02-05T07:01:44Z"
feature-img: assets/img/background/rijksmuseum.jpg
tags:
- computer
- lang_de
title: Bäume in SQL
aliases:
  - /2004/02/05/baeume-in-sql.html
---

Vor einigen Jahren hielt ich einen Vortrag bei NetUSE über 
[Bäume in SQL](http://koehntopp.de/kris/artikel/sql-self-references/)
basierend auf einer Idee von Joe Celko. 
Das ist der eine Vortrag, über den ich wohl am meisten Post bekomme.

Das Thema oder Problem kommt auch sonst sehr oft auf das Tapet - Baumstrukturen kommen an vielen Stellen immer wieder vor, und das relationale Modell bzw. seine gängige Implementierung in SQL unterstützen solche Dinge nicht besonders gut. 
Zeit, sich einmal systematischer Gedanken zu machen.

Mir sind drei Methoden bekannt, mit denen man Bäume in SQL modellieren kann. 
Die direkte Methode besteht aus einer Fremdschlüssel-Spalte `parent_id`, die auf den Vorgängerknoten in einem Baum zeigt. 
Wir nennen so etwas Zeigerbäume. 

```sql
CREATE TABLE zbaum (
    id int not null primary key,
    parent_id int not null index,
    data_id int not null index
);
```

Diese Methode ist zwar einfach, hat aber eine ganze Menge Nachteile, wenn man über mehr als eine Ebene arbeiten muß.

Wenn man also einen Pfad zur Wurzel benötigt oder die Tiefe eines Knotens bestimmen will, bei gegebener ID des Knotens.
Hilfreich sind hier Bäume, in denen der Pfad von der Wurzel des Knotens abgespeichert ist.

Wir nennen dies Pfadbäume:

```sql
CREATE TABLE pbaum (
    id int not null primary key,
    pfad char(250) not null index,
    data_id int not null index
);
```

Der Pfad ist jetzt die Folge von Ids, die im Baum zum aktuellen Knoten hin führt, manchmal mit einem Trennzeichen.
Wichtig ist, daß man den Pfad aus IDs oder Schlüsselkandidaten (UNIQUE Items) aufbaut, wenn man auch mit einzelnen Pfadelementen Dinge tun will.
Man kann auch sagen, daß die Pfadelemente nicht eindeutig sind, dann ist aber immer nur ein Komplettpfad eindeutig.
Die Kombination VorgängerID/aktuelle ID ist es jedenfalls nicht - ein Fehler, den ich schon in mehr als einer Implementierung gesehen habe. 

Damit man nach dem Pfad sortieren kann, ist es nützlich, wenn die Pfadelemente alle die gleiche Breite haben.
Für ein Element mit der ID 9 kann der Pfad dann also so aussehen:
`001/004/009` 
(Die Wurzel ist ID 1, daran hängt ID 4, und das Blatt mit der ID 9).
Leider setzt dies der Anzahl der Elemente im Baum und der Anzahl der Elemente pro Ebene Grenzen.

Die in 
[meinem Foliensatz](http://koehntopp.de/kris/artikel/sql-self-references/) beschriebenen Mengenbäume haben dieses Problem nicht und haben auch sonst einige sehr schöne Eigenschaften. 
Sie sind aber extrem Update-Intensiv beim Einfügen und Löschen von Knoten.

Gestern hatte ich eine Diskussion mit einem Kollegen, der eine Tabelle mit Performance-Meßpunkten für den Online-Betrieb verwaltet. 
Diese Tabelle ist ebenfalls baumartig strukturiert, und intern als Zeigerbaum realisiert.
Dieser Ansatz kommt jedoch an seine Grenzen - sein Baum ist etwa acht Ebenen tief und enthält etwa ungefähr 10^5 Elemente in 10^4 Knoten.

Eine Query durch einen Zeigerbaum zur Generierung einer Navigationsansicht kann da auch auf einem Rechner mit 2 CPUs, 2 GHz und 2GB-Oracle schon mal zwei Minuten dauern.
Jedenfalls ist das dringend optimierungswürdig.

Optimierung bedeutet hier aber, daß die existierende Anwendung möglichst wenig verändert werden darf. 

> "Mach das Performanceproblem weg, aber bau den Laden nicht um."

Wir haben also auf dem Problem ein wenig herumgehirnt, und wollen jetzt einmal ausprobieren, ob es was bringt, eine Modifikation einzuführen, die den Zeigerbaum on demand rekursiv in einen Pfadbaum überführt.
Das bedeutet, es wird eine Spalte Pfad eingefügt (die kann auch in einer Extratabelle stehen, sodass die bestehende Tabelle für den Test nicht verändert werden muß). 

Dann wird die existierende Stored Procedure für den Tree Walk geändert, und zwar so, daß sie normal zur Wurzel läuft, und so die Koordinaten des Knotens im Baum bestimmt.
Dabei guckt sie aber für jeden Schritt, ob der aktuelle Knoten schon einen Pfad enthält. 
Wenn ja, nimmt sie diesen vorberechneten Pfad und stoppt den Walk, um den Pfad des untergeordneten Knoden als "Pfad des Parents plus Trenner plus ID" abzuspeichern.
Auf diese Weise müßte sich die Pfadspalte sukzessive mit gecachten Pfadergebnissen füllen und die Tree Walk-Funktion im Laufe der Zeit immer schneller werden.

Die eigentliche Baumstruktur wird also immer noch wie in Zeigerbäumen gespeichert, aber die Rechenergebnisse des Walks durch den Zeigerbaum werden in Pfadbaumformat gecached.
Wegen der Verwendung von Stored Procedures für den Walk müßte diese Änderung transparent für den benutzenden Code sein.
