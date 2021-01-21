---
layout: post
title:  'Freitag, der 13. im Rechenzentrum'
author-id: isotopp
feature-img: assets/img/background/rijksmuseum.jpg
date: 2016-05-13 09:32:19
tags:
- lang_de
- data center
---

Heute ist ein Gedanktag, denn an einem Freitag, dem 13. Mai vor 11 Jahren ging das so: 

> »Im Rahmen der strengen Sicherheitsbestimmungen für das WEB.DE Rechenzentrum wurden am Freitag Abend aufgrund von Ausfällen in der Klimatisierung sämtliche Server der WEB.DE Dienste vorübergehend heruntergefahren. Diese vorsorgliche Maßnahme dient dem Interesse der Datensicherheit unserer Kunden.
> 
> Wir werden im Laufe des Samstag Morgens die Server wieder kontrolliert zum regulären Betrieb hochfahren. Wir entschuldigen uns bei Ihnen für die Unannehmlichkeiten.
>
> Ihre WEB.DE AG«

Ich habe damals als Security-Fuzzi bei web.de gearbeitet und an diesem Tag kam es im Verlaufe des Abends zu einem Totalausfall der Kühlung in allen Rechenzentrumszellen.

![](/uploads/2016/05/klimaanlage.jpg)

Um eine Beschädigung von persistenten Daten zu verhindern haben wir das gesamte RZ runtergefahren, als die Temperaturen der Zuluft den sicheren Rahmen verlassen haben. Später in der Nacht kam es mit Notkühlung zu einem geplanten Wiederanlauf des Systems und am Samstag war bereits von außen keine Störung mehr erkennbar, auch wenn intern noch eine ganze Menge Systeme degraded waren.

Danke Euch allen, Ihr wißt wer Ihr seid! Es war eine tolle Zeit und ein unglaubliches Team!

## Was war passiert?

Ein Rechenzentrum, das ist eine feuerfeste, luftdichte Kiste, in die man Strom und Netzwerkkabel rein legt. Die Rechner machen Abwärme. Also legt man auch Wasserleitungen rein und wieder raus, und baut drinnen Wärmetauscher ein, die die warme Luft ansaugen, kalt machen und wieder raus pusten.

Damit man effektiv ist, muß man Straßen für kalte und warme Luft bauen und dafür sorgen, daß die kalte Luft da hin kommt wo sie gebraucht wird.


Aus der RZ-Kiste kriegt man warmes Wasser raus. Und ab da wird es ein wenig anstrengend, [denn das geht dann so](https://photos.google.com/share/AF1QipMmWHA-EgWmUQXjXuLl5amhA91pioPe_YWE569GQ2trdJ4j8AD8VybiEa1lcKF8Wg?key=RHBpbDF2ZWtwSzBCMWRCTF9zWjg0UXJWZFVfcnln)

Es gibt also drei große Kältemaschinen, die dann die Wärme in Richtung Kühlkörper nach draußen schaffen. Vor 11 Jahren hat abends die Substeuereinheit für den Betonkasten mit den Kühlkörpern draußen den Befehl bekommen "mach das Zulaufventil weiter auf". Das ist da, wo in dem entsprechenden Bild die blauen Abdeckungen in der Betonkiste zu sehen sind.

Die Substeuereinheit hat dann gesagt "Nö." und ganz zu gemacht.

Ab da hat das ganze System keine Energie mehr aus dem RZ raus holen können, das Wasser in den Kühlkreisläufen wurde wärmer und der Druck stieg.

Als der Druck zu hoch wurde, bei (1), hat die Kältemaschine hingeschmissen und ihr Backup sprang an. Es gab keine Meldung. Maschine 2 hatte dasselbe Problem und bei (2) passierte dasselbe und Nummer 3 hat übernommen. Als die auch hingeschmissen hat (3), stieg die Zuluft-Temperatur an. Es wurde alarmiert.

Ich war mit einem Haufen anderer Leute noch in der Firma, denn wir saßen bei Bier in der Kantine, um den Tosi,  der die Firma verlassen wollte, zu verabschieden und feierlich zu ent-admin-rechten.

Ein Anruf von Armin (Zuluft über 35 Grad, kannste mal gucken?) später stand ich unten im RZ und mir schlug tropische Luft entgegen. Als Securityfuzzi habe ich die Eskalation durchgeführt und wir haben, als die Zuluft-Temperatur zur Gefährdung persistenter Daten geführt hätte, eine Komplettabschaltung durchgeführt (4).

Ziemlich schnell hatte ich zu viele Leute für den Notfall und habe die Hälfte der Mannschaft wieder heim geschickt, mit der Bitte um Mitternacht anzutreten und das aktuelle Team abzulösen.

Armin und das RZ-Team haben die Klimaanlage auf manuell geprügelt, während meine Gruppe sich um die Maschinen gekümmert hat und versucht hat, die Temperatur unter Kontrolle zu bekommen, indem wir weniger Abwärme produzieren. Einige Personen waren als Melder und Protokollanten eingeteilt, jemand hat sich darum gekümmert, die Kommunikation mit Eva, unserer Pressefrau, und mit dem Vorstand zu koordinieren.

Als die Klimaanlage jedoch wieder ansprang (5), war sie auf manuell. Das heißt auch, daß sie ungeregelt gelaufen ist und wir auf einmal mindestens 200kW Abwärme liefern mußten, damit das Kühlwasser nicht gefriert. Also haben wir relativ panisch Dienstplanänderung gespielt und Kisten wieder angeschaltet, damit das Klimateam die Rohre nicht kaputtfriert.

Den Rest der Nacht haben wir dann die Systeme wieder zusammengesetzt und Wiederanlauf von Null gespielt. Um Mitternacht kam die zweite Mannschaft und um Eins ist dann das initiale Eskalationsteam heim gefahren und ins Bett gefallen. Als der Vorstand auftauchte, haben wir ihm eine kurze Führung mit Statusreport durch unsere Notfallkoordination und das RZ geben können. Wir haben das Notfall-Geld genommen und bei der Pizzeria gegenüber eine ununterbrochene Pizza-Versorgung sichergestellt.

Am Samstag gegen 14 Uhr war volle Redundanz wieder hergestellt und der Rotlevel im Nagios auf dem üblichen Niveau.

Das war mal alles Scheiße gut eingespielt und durchgezogen.

## Wieso war das schwierig?

Das System hat 21kW pro Rack in einem Raum mit 2.95 Meter Deckenhöhe (45cm Unterboden -> 2.50 Meter bis zur Decke) fahren können und den Airflow mit Kaltgang-Warmgang und Zwangsbelüftung der Racks gefahren.

Es war außerdem noch nicht betrieblich von der Klimafirma an web.de übergeben. Da es sich um eine Aufrüstung eines bestehenden Rechenzentrums (7kW bzw. 10kW auf 21kW) gehandelt hat, war jedoch produktiver Betrieb da drin.

Nach dem Vorfall haben wir nur noch mit den Anwälten von web.de reden dürfen, die dann den Anwälten von der Klimafirma gesagt haben, was sie den Technikern von der Klimafirma sagen sollen.

Der Fehler besteht übrigens darin, in einer alten denkmalgeschützten Nähmaschinenfabrik in Durlach RZ-Betrieb zu machen, anstatt sich massenhaft Platz in einem Gewerbegebiet anderswo zu besorgen.

Dort hätte man 4-5 Meter Raumhöhe haben können, wäre unter Umständen auf der Alb oder im Schwarzwald und nicht im heißen Rheintal und hätte auch so viel Platz, daß man statt mit 21kW pro Rack mit 7kW pro Rack hätte planen können. Das heißt, man wäre mit drei Mal weniger Density hin gekommen.

In dem Fall hätte man dann einfach normale Klima von der Stange genommen und alles wäre langweilig gewesen. Langweilig ist gut.
