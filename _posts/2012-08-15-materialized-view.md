---
layout: post
published: true
title: Materialized View
author-id: isotopp
date: 2012-08-15 03:45:04 UTC
tags:
- mysql
- architektur
- lang_de
feature-img: assets/img/background/mysql.jpg
---
Daten in einer SQL-Datenbank werden in einer Tabelle abgelegt, also einer
Struktur mit Spalten, die Namen und in vielen Fällen auch einen Datentyp
haben.  Eine Tabelle besteht dann aus 0 oder mehr Zeilen, die in dieses
Spaltenschema passen.

Für das Schreiben von Daten möchte man diese dann 
[Normalform](http://mysqldump.azundris.com/archives/20-Nermalisation.html)
bringen, um 
[Anomalien](http://de.wikipedia.org/wiki/Anomalie_(Informatik)#Anomalien_im_Einbenutzerbetrieb)
bei Änderungen von Daten zu verhindern und um die Datenmenge kompakt zu
halten.  Kompakte Daten haben den Vorteil, daß sie von der Datenbank ganz
oder in wesentlichen Teilen im Speicher gehalten werden können, sodaß
lediglich tatsächliche Schreibzugriffe irgendwann die Platte treffen.

In den meisten Fällen wird man Daten nicht übernormalisieren wollen, weil
sonst die Rekonstruktion von für die Anwendung nutzbaren Daten zur Laufzeit
ziemlich kompliziert wird.  Für Datenbanken, die hinreichend volatile Daten
enthalten, wird man meistens eine Darstellung in der Nähe der 3.  Normalform
finden.

![Normalisierte Darstellung von Daten](/uploads/normalized_view.png)

Normalisierte Darstellung von Daten: 1:n-Relation (Ein Hotel kann 0 oder
mehr Reviews haben).

Webanwendungen zeichnen sich häufig dadurch aus, daß sie weitaus mehr
Lesezugriffe als Schreibzugriffe haben - Benutzer einer Webanwendung sehen
große Datenmengen durch, nehmen aber im Vergleich wenig Änderungen vor: Sie
'browsen'.  Daher ist es oft lohnend, Daten für Webanwendungen in eine Form
zu bringen, die für Lesezugriffe optimiert ist.  Das ist eine
Denormalisierung: Die Daten, die für die Darstellung einer einzelnen
Webseite benötigt werden, werden ausgejoined und in die von dieser Seite
benötigte Form gebracht.

Dies kann zur Laufzeit geschehen und man kann die entsprechende Query in der
Datenbank selbst abspeichern, in der Form eines Views: 

```sql
CREATE VIEW v AS
  select ...  from t1 join t2 on t1.t1id = t2.t1id where ...
```

In diesem Fall wird jedoch die Join-Operation auf frischen Daten jedesmal
durchgeführt, wenn ein Lesezugriff auf den View erfolgt.

Alternativ speichert man nicht die Query selber, sondern cached auch ihr
Resultat in einer Tabelle: 

```sql
CREATE TABLE mv AS 
  select ...  from t1 join t2 on t1.t1id = t2.t1id where ...
```

und wenn man schlau ist definiert man auch noch ein paar passende Indices da
mit drauf.  Hier hat man den Resultset der Query materialisiert, und kann
nun Anfragen darauf fahren, ohne daß man die Operation zur Generierung des
Resultats jedes Mal wieder neu ausführen muß.  Das kann - muß aber nicht!  -
sehr viel schneller sein.

![Materialized View](/uploads/materialized_view.png)

Materialized View: Ausgejointe 1:n Beziehung zwischen Hotels und Reviews.

```json
# JSON-Repräsentation des Join-Ergebnisses
{
  "hotel": "citizen M",
  "location": ...,
  reviews: {
    review: { "score": 10, "text": ... },
    review: { "score": 9.8, "text": ...}
  }
}
```


Der materialisierte Resultset hat den Nachteil, daß er einen Schnappschuß
der möglicherweise sehr volatilen Daten zu einem bestimmten Zeitpunkt
darstellt und daß die Daten in dem materialisierten View unter Umständen
nicht aktuell sind.  Viele SQL-Datenbanksysteme 
[stellen](http://dcx.sybase.com/1200/en/dbusage/workingwdb-s-3165842.html)
[elaborate](http://wiki.postgresql.org/wiki/Materialized_Views)
[Systeme](http://docs.oracle.com/cd/B19306_01/server.102/b14200/statements_6002.htm)
bereit, um Materialized Views zu definieren und Aktualisierungsregeln dafür
zu definieren.  Definierbar sind meistens der Zeitpunkt der Aktualisierung -
manuell, per Kommando; automatisch nach Fahrplan, auf der Grundlage einer
Zeitsteuerung; oder automatisch bei jeder Änderung, ON COMMIT.  Definierbar
ist oft auch der Änderungsalgorithmus, also eine komplette Neuerstellung des
Materialized View von Null, oder ein Einarbeiten der Änderungungen in die
bestehenden Daten ('Delta-Processing') wo das möglich ist.

Man ist aber bei der Definition von solchen Systemen gar nicht auf
Datenbankmechanismen angewiesen, und tatsächlich ist dies in vielen Fällen
auch nicht opportun.  Dann nämlich, wenn die zu materialisierenden
Datenmengen sehr groß sind, oder wenn der Umwandlungsprozeß aus der
normalisieren Darstellung in die denormalisiere Darstellung besser in einer
richtigen Programmiersprache statt in SQL dargestellt wird, läßt man den
Prozeß besser extern laufen.

Dazu wird man Änderungen an den normalisierten Daten aufzeichnen wollen,
damit man dem externen Umwandlungsprozeß die Primärschlüssel der geänderten
Zeilen zur Verfügung stellen kann und man einen Delta-Processing Prozeß
betreiben kann.  Dies kann man mit Triggern in der Datenbank machen, aber
das hat zumindest in MySQL den Nachteil, daß es synchron zur Datenänderung
ausgeführt wird und so die Schreibzugriffe selber beeinflußt.  Alternativ
kann man diese Änderungen auch einfach in der Anwendung selber ausführen,
wenn man Kontrolle über den Quelltext aller Schreiber auf die normalisierten
Daten hat.

![Denormalisierungsmaschine](/uploads/queue.png)

Denormalisierungsmaschine

Ein solches Setup sieht in einem mir bekannten Beispiel so aus, daß eine
Quelldatenbank existiert, die in den Hauptspeicher einer Maschine paßt - die
Gesamtdatenmenge besteht aus ca.  200GB Daten.  Die Datensätze sind relativ
klein, rein numerisch: IDs von Entities in anderen Datenbanken und
Preisdaten.  Die Daten haben eine recht hohe Change-Rate: Externe Bearbeiter
und entfernte Systeme ändern die Daten laufend und so schnell, daß es
durchaus sinnvoll ist, daß die Darstellung normalisiert und schreiboptimiert
erfolgt.

Zur Erzeugung eines read-optimierten Views wurde das System so geändert, daß
die schreibenden Prozesse auch die geänderten IDs in einer Work Queue
hinterlegen.  Von dort greifen ca.  100 Worker parallel die Arbeitsaufträge
ab, transformieren die Daten in eine read-optimierte Darstellung und legen
das Resultat ihrer Bemühungen in einer anderen, getrennten Datenbankinstanz
ab.

Die Schreibraten, die dabei entstehen, können beachtlich sein: Der
Datenbestand wird durch das Ausmultiplizieren der Joins und das Entfalten
der verschiedenen Datendimensionen in der Regel sehr viel größer - in dem
genannten Beispiel besteht die Denormalisierte Darstellung in der Tat aus
vier Maschinen, auf denen die Daten geshardet abgelegt werden und jede
dieser vier Maschinen hat ihre Daten auf zwei SSD in einer RAID-0
Konfiguration.

Die Schreibraten sind insbesondere im Fall einer kompletten Neugenerierung
des denormalisierten Bestandes so groß, daß MySQL 5.5 nicht mithalten kann. 

MySQL 5.6 hat verschiedene Lockingprobleme im InnoDB Kern gelöst und kann
Redo-Logs größer als 4 GB handhaben.  Dadurch kann auf dem oben erwähnten
SSD-Setup eine dauerhafte pro Instanz Schreibrate von 150 MB/sec netto (also
auf Datenbankseite) erreicht werden, sodaß das ganze System recht entspannt
auf eine aggregierte dauerhafte Schreibrate von 600 MB/sec kommt.

Natürlich ist eine solche Schreibrate zu hoch als daß MySQL Replikation noch
mithalten könnte.  Man kann dann anfangen, das Schema auf einer Maschine in
unabhängige Subschemata zu unterteilen und mit MySQL 5.6 Parallel
Replication herum zu experimentieren.  Aber wenn man den Code sowieso
anfassen muß, dann kann man auch stattdessen in den Queue Workern einfach
parallel auf mehrere Instanzen direkt schreiben und Replikation komplett
umgehen.

Die denormalisierte Darstellung ist in unserem Fall geeignet, eine bestimmte
Klasse von Abfragen um Größenordnungen zu beschleunigen und - noch wichtiger - 
bestimmte pathologische Arten von Abfragen genau so schnell auszuführen
wie normale Abfragen.  Outlier in der Systemleistung werden also eliminiert,
eine bestimmte Sorte von Slow Query tritt nie mehr auf.

_Anekdote:_ Leider ist MySQL 5.6 noch nicht GA und eine der von uns getesteten
Versionen hat einen Crash Bug gehabt, den wir zuverlässig triggern konnten. 
Um das zu debuggen brauchten wir einen Core Dump.  Einen 200 GB Core-Dump
auf SSD zu schreiben dauert ca.  15 Minuten.  Die Redo Log Recovery von
25-aus-32 GB Redo Log dauert dann weitere 45 Minuten, nach denen die
Datenbank dann wieder produktiv ist.

_Anekdote:_ Während der Entwicklung haben wir die Generierung sehr oft
komplett durchlaufen lassen müssen.  Dabei haben wir die volle Schreibrate
der SSD tatsächlich über Wochen voll ausgenutzt und uns ist tatsächlich in
zwei Kisten die SSD durchgebrannt.  Wir haben schon gewitzelt, daß HP Server
bauen muß, wo hinten auf so einer Rutsche neue Platten nachrutschen, wenn
die aktive SSD als ausgebrannt erkannt wird.  Dann kann man per
Rechenzentrum einen Heizer haben wie auf einer Dampflok, nur daß der Platten
schaufelt statt Kohlen.

Im Wirkbetrieb normalisiert sich das dann recht schnell auf sinnvolle
erwartete Lebensdauern.

![Graph: SSD Lifetime](/uploads/ssd_estimated_lifetime.png)

Erwartete Lebensdauern für die SSD in einem Beispielrechner.

**TL;DR:** Durch Denormalisierung lassen sich Daten read-optimiert speichern,
was bei Webanwendungen oft sinnvoll ist.  Die führende Darstellung sollte
jedoch normalisiert sein, wenn man an seinen Daten hängt.  Denormalisierung
kann Datenmengen explodieren lassen und bei großen Datenmengen und hohem
Churn massiven Hardwareeinsatz erfordern.  In diesem Fall führt man die
Materialisierung besser außerhalb der Datenbank durch.

Die architekturellen Kosten dieses Ansatzes sind Update-Verzögerung und eine
hohe Schreibrate, die bestimmte Technologien wie MySQL Replikation
unattraktiv machen kann.
