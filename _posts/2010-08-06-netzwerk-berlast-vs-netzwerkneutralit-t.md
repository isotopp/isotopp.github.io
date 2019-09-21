---
layout: post
published: true
title: Netzwerk-Überlast vs. Netzwerkneutralität
author-id: isotopp
date: 2010-08-06 10:17:00 UTC
tags:
- google
- internet
- netzneutralität
- politik
- lang_de
feature-img: assets/img/background/rijksmuseum.jpg
---
(Grr, nicht genug Zeit, das so klar zu machen, wie ich es haben will… Egal - ich drück jetzt "Post Article")

Dies ist der Folgeartikel zu 
[Teil 1]({% link _posts/2010-08-05-vokabeln-f-r-netzneutralit-t.md %}).

Medienkonvergenz Phase I heißt, daß ich einen Haufen Dienste, die früher auf
unterschiedlichen Medien, Übertragungswegen und in unterschiedlichen
Formaten vorgelegen habe, nun alle auf das Internet migriere und alles über
dieselbe Leitung abwickele. Typisch wird "Triple Play" genannt, also
Telefonie, Internet-Zugriff und Zugriff auf klassische Rundfunkinhalte. 

Wenn ich das mache, habe ich das Problem, daß ich das Netz lokal überlasten
kann (das kann ich immer) und das doof finde.

Lokal heißt "an einem Router". Der kann irgendwo im Netz stehen - beim
Dienstanbieter, mittendrin auf der Strecke, oder der kleine
Plastik-Türstopper bei mir daheim. In der Zeichnung hier nehmen wir mal
einen Router in einer Firma, und drei PCs.

![](/uploads/overcommit.png)

Ein Router, links das Internet und rechts drei PCs. Der Router wird von
rechts mit mehr Daten angeblasen als er nach links los werden kann - eine
Warteschlange entsteht.

Der meiste Datenverkehr ist lokal, und die meisten Router haben intern mehr
Kapazität als sie Anbindung nach oben haben. In unserem Beispiel haben wir
drei PCs angeschlossen, die jeweils mit 100 MBit/s Ethernet arbeiten und wir
haben eine echt dicke Internet-Anbindung von ebenfalls 100 MBit/s. Solange
die PCs untereinander reden ist alles gut.

Wenn alle drei sich aber nun entschließen, große Datenmengen hochzuladen,
zum Beispiel jeweils ein DVD-Iso nach irgendwo ins Internet zu schießen,
dann haben wir drei Datenquellen, die jeweils 100 MBit/s in den Router rein
senden und einen Abfluß ins Internet von nur 100 MBit/s.

Zwei Sachen passieren.

**Erstens:** Es entsteht eine Sendewarteschlange am Router. Der Router muß
also lokalen Speicher aufwenden, um Daten kurzzeitig zu puffern und so die
Lastspitze abzufangen.

**Zweitens:** Der Router wird versuchen, die Senderate der drei PCs mit
Hilfe von [Flow Control](http://en.wikipedia.org/wiki/Transmission_Control_Protocol#Flow_control)
(hier eher: Congestion Control) Mechanismen herunter zu regeln, so lange bis
die aggregierte Bandbreite der drei Sender seine Bandbreite im Abfluß nicht
mehr übersteigt - genau genommen versucht er schon im Ansatz die Sender so
einzuregeln, daß die Überlastsituation möglichst nicht eintritt.

Gelingt es nicht, die Senderate der Rechner zu bremsen, läuft der Router
voll und er muß, damit sein Arbeitsspeicher nicht überläuft, Pakete
verwerfen.

Gibt man dem Router keine weiteren Hilfen an die Hand, dann wird er alle
Dienste auf allen PCs gleichmäßig bremsen und er wird nach dem
Zufallsprinzip anfangen Pakete zu verwerfen.

Das ist genau nicht die User Experience, die der Benutzer typischerweise
will, denn dem sind bestimmte Dienste wichtiger als andere.

Netzneutralität im engeren Sinne hat man dann, wenn der Benutzer selbst in
der Lage ist, die Priorisierung in einer solchen Situation nach seinen
Wünschen zu beeinflussen und nicht der Netzbetreiber Verfügbarkeit und
relative Leistung von Diensten oder Anbietern diktiert.

Soweit die Technik.

### Politik statt Technik

Den Netzbetreibern geht es bei der nicht-technischen, politischen Diskussion
jetzt darum, diese Unterscheidung zu relativieren und sich selbst in die
Lage eines Gatekeepers zu bringen. Also die Kunden gegenüber dem
Dienstanbieter als Geiseln zu benutzen und zu sagen: An meine Endkunden
kommst Du überhaupt/mit vernünftiger Leistung/mit allen Diensten und
Features nur heran, wenn Du nicht nur Deinen Provider bezahlst, sondern auch
mich. Also etwa von Hulu Extrageld dafür zu verlangen, daß Telekom-Kunden
für Hulu erreichbar werden.

Und gegenüber dem Kunden den Dienstanbieter als Geisel zu verwenden und zu
sagen: Diesen speziellen Dienst, den wir gar nicht betreiben, kannst Du bei
uns nur dann nutzen/mit vernünftiger Qualität nutzen, wenn Du uns und nicht
nur den Dienstbetreiber extra dafür bezahlst. Also etwa so wie in
[der Grafik dargestelllt](http://dvice.com/assets_c/2009/10/net-neutrality-thumb-550xauto-27419.jpg).

Oder gar den Dienst von Fremdanbietern ganz zu sperren oder so zu
benachteiligen, daß dem Kunden nichts anderes übrig bleibt, als den Dienst
des Netzbetreibers zu verwenden. Also etwa Skype und VoIP zu blockieren,
damit Calls über GSM gemacht werden müssen.

Und in diesem Licht ist die Sache zwischen Google und Verizon dann auch zu
sehen:

Es gibt insbesondere bei Mobilnetzen öfter mal technisch begründbare
Situationen, in denen man Dienste unterscheiden muß, um dann entscheiden zu
können, welche Pakete man bei Engpässen noch befördert und welche man
verwirft. Bei Festnetzen eher nicht. Die Verizon Techniker müssen sich also
die Option offen halten, auf dem Mobilnetz Verbindungen zu managen.

Insofern ist sind die Gespräche zwischen Verizon und Google ein Erfolg, als
daß die eine Policy festschreiben, bei der der Netzbetreiber zusagt, auf dem
Festnetz seine Finger aus den Daten heraus zu halten. Das ist gut. Die Frage
bleibt: Wer wird die Richtlinien auf den Mobilnetzen definieren, und wie
viel Kontrolle bleibt dem Benutzer dort - und dieser Punkt wird aus den
Berichten auch nach den Dementis nicht klar.

Ein anderer Punkt ist, daß wie oben gezeigt, technisch eine Regelung nur
dann zwingend notwendig ist, wenn und so lange eine Überlastsituation
besteht. Daraus folgt: Hat man Netzneutralität in dem Sinne, daß die
Verantwortung für die Verwaltung der Knappheit beim Kunden liegt, dann hat
der Diensterbringer ein Interesse daran, die Knappheit zu beenden, dem
Kunden also eine angemessene Bandbreite zu verkaufen. Ohne
Netzwerkneutralität überwiegt beim Netzbetreiber das betriebswirtschaftliche
Interesse an der Aufrechterhaltung der Bandbreiten-Knappheit, da er auf
diese Weise das Produkt in normal (= kaputt, unbenutzbar) und Premium (=
funktioniert) ausdifferenzieren kann und solange mehr kassieren kann, wie er
das Problem nicht behebt.

Außerdem ist das ganze Mal wieder ein lupenreines Beispiel dafür, wie
unglaublich ungeschickt Google als Firma so kommuniziert. Denn es wäre
echt einfach, die technischen Hintergründe und Notwendigkeiten mal
aufzumalen, mit ein paar schicken Fotos zu versehen und die eigenen
Absichten und Ziele dann allgemein verständlich und unverquast zu
formulieren. Nur mal so nebenbei bemerkt.
