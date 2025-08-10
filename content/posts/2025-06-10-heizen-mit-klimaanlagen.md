---
author: isotopp
date: "2025-06-10T03:04:05Z"
feature-img: assets/img/background/rijksmuseum.jpg
title: "Heizen mit Klimaanlagen"
toc: true
tags:
- lang_de
- netherlands
- energy
- climate
---

Ich habe
[in einem anderen Artikel]({{<  relref "2025-03-10-going-fully-electric.md" >}})
schon in englischer Sprache über unsere neue Heizung geschrieben und dann in
[einem weiteren Artikel]({{< relref "2025-04-03-panasonic-comfort-cloud.md" >}})
die Integration der Klimageräte mit der Panasonic Cloud und Home Assistant beschrieben.

Wir sind also seit Anfang März 2025 erdgasfrei.
Das Heizung-Setup ist technisch gesehen "hybrid", weil die alte Gasheizung noch da ist 
und im "Sommermodus" Bereitschaft fährt.
Sollte es notwendig werden, können wir sie dazu schalten und Klimageräte konventionell verstärken.
Ich rechne nicht damit, dass das notwendig werden wird,
aber da der Spaß derzeit nur 1 Euro/Tag kostet, lasse ich das erst mal so.
Irgendwann in 2026 fliegt der Kram dann raus, der Zähler wird blockiert, die Heizkörper abgesägt
und der Platz zurückgewonnen.

# Warmwasser

Warmwasser kommt durch eine Brauchwasser-Wärmepumpe.
Diese zieht Außenluft durch eine Einström-Öffnung ein, kühlt die Außenluft ab 
und pustet die Luft durch ein 2. Loch wieder raus.

![](/uploads/2025/03/electric-14.jpg)

*Der Dachaufbau auf der Nordost-Seite: Solarzellen, die Öffnungen für die Brauchwasser-Wärmepumpe,
und der Schornstein der Gas-Therme, an seinem letzten Tag.*

Die Brauchwasser-Wärmepumpe ist ein mannsgroßer Zylinder, der von oben die beiden massiven Luftzufuhr-Röhren bekommt,
und der seitlich Anschlüsse für Kaltwasser-Zulauf und Warmwasser-Ablauf hat.
Wir haben 200l Tankgröße installiert, weil das für 3 Personen reicht, aber im Nachhinein ärgert mich das ein wenig:
Ein 270l Tank würde nicht mehr Energie brauchen (denn es wird im Grunde nur verbrauchtes Wasser ersetzt und erwärmt),
würde aber mehr thermische Masse ins System bringen – ich kann so an warmen, sonnigen Tagen Wasser vorab aufwärmen,
aufbewahren und am darauf folgenden kälteren Tag nutzen.
Ich würde so weniger einspeisen und am dunklen Tag weniger Strom aus dem Netz ziehen.

Wenn man annimmt, dass einströmende Außenluft und einströmendes kaltes Wasser 15ºC warm ist und auf 55ºC aufgewärmt wird, 
dann hat die Pumpe einen Hub von 40ºC. 
Anfangs ist der Hub kleiner:
Die Pumpe muss 15ºC kaltes Wasser anwärmen.
Später, während des Betriebes, ist das Wasser am Wärmetauscher im Tank wärmer, der Hub ist größer, und
der Kompressor muss mehr arbeiten—und braucht mehr Energie.

Und das sehen wir auch in der Messung:

![](/uploads/2025/06/heizen-01.png)

*Leistungsaufnahme einer Brauchwasser-Wärmepumpe, steigt über Zeit von 480 W auf 635 W.*

# Hub, Wärmepumpen und Altbausanierungen

Das ist nicht nur bei Brauchwasser-Wärmepumpen so, sondern bei allen Wärmepumpen:
Kleinerer Hub heißt mehr Effizienz, weniger Energieverbrauch.

Das ist auch der Grund, warum man sagt, dass ein Haus mit Wärmepumpe energetisch saniert sein sollte. 
Es geht nicht wirklich um die Sanierung, sondern in Wahrheit darum, 
die Heizung mit einer so niedrigen Vorlauftemperatur wie möglich laufen zu lassen.
Und damit den Hub der Wärmepumpe niedrig zu halten, damit sie effizienter ist.

Dämmung sorgt dafür, dass das Haus weniger Wärme an die Umwelt verliert.
Man muss weniger heizen oder kann die Pumpe kleiner dimensionieren.
Größere Heizkörper oder gar eine Fußbodenheizung sorgen für eine größere Transferfläche,
sodass das Heizungswasser nicht so warm werden muss.

Der schwächste Heizkörper im System ("der am meisten unterdimensionierte") bestimmt dabei die Vorlauftemperatur:
Heizfläche und die Menge an durchströmendem Wasser pro Zeit (der "Volumenstrom") bestimmen,
zusammen mit der Vorlauftempteratur, wieviel Wärme der Radiator an die Umgebung abgibt.
Unter Umständen kann also 
[sinnvolles Tuning der Heizung](https://youtu.be/i4mpBAYziyw)
und danach falls nötig der Austausch einzelner Heizkörper und die Isolierung eines Raumes die Situation so verbessern,
dass man die Effizienz steigert, die Vorlauftemperatur senkt oder gar mit einer kleineren Pumpe hinkommt.


# Luft-Wasser-Wärmepumpe schätzen

Wenn man über eine Sanierung der eigenen Heizung und den Einbau einer Luft-Wasser-Wärmepumpe
(statt wie bei mir Klimageräte) nachdenkt, ist das eine recht einfache Rechnung:

Schritt 1 ist herauszufinden, wieviele Kilowattstunden Heizleistung man pro Jahr aufwendet.
Dazu muss man nachsehen, wie viel Gas pro Jahr gekauft wird, oder wie viel Öl pro Jahr verbraucht wird.
Ein Kubikmeter Gas oder ein Liter Heizöl kann jeweils mit 10 kWh angesetzt werden,
wenn die Abrechnung nicht sowieso schon in kWh erfolgt.

Wenn man also 1250 Kubikmeter Gas pro Jahr verbrennt, dann sind das 12500 kWh Heizleistung im Jahr.

Das muß man jetzt nicht nur auf ein Jahr, sondern auch auf die beheizte Fläche normieren,
damit der Wert vergleichbar wird.
Bei 12500 kWh pro Jahr und 156 qm beheizter Fläche sind das also 80 kWh/(a * qm) (pro Jahr und Quadratmeter)

Wir können das in eine
[Energieeffizienzklasse](https://www.effizienzhaus-online.de/energieeffizienzklasse/)
übertragen.

![](/uploads/2025/06/heizen-06.png)

*Energieeffizienzklassen in Energieausweisen für Wohngebäude ab Mai 2014.*

Mit 80 kWh/(a * qm) liegen wir also gerade eben so in Energieeffizienzklasse C:
Die Klasse B verlangt weniger als 75 kWh/(a * qm),
und die Klasse D ist für mehr als 100 kWh/(a * qm).

Man sagt im Allgemeinen, dass man mit einem Verbrauch von 100 kWh/(a * qm) oder besser
ohne viel Nachdenken eine Wärmepumpe einbauen kann.
Wenn man also Energieeffizienzklasse C oder besser hat, ist kein Problem zu erwarten.

Es lohnt sich dennoch, die Heizungssteuerung zu tunen, und danach die Skalierung der Heizkörper zu prüfen,
und zu sehen ob man den Vorlauf runter geregelt bekommt.

Wärmepumpen haben in der Regel eine angegebene Jahresarbeitszahl (JAZ, COP, Coefficient of Performance).
Das ist der Faktor an Energie, den die Wärmepumpe pumpt.
Für ein kWh Strom, das ich in den Kompressor stecke, bekomme ich im Schnitt JAZ viele kWh an Heizenergie.

Bei jeder Wärmepumpe in einem Haus mit Energieeffizienzklasse C oder besser ist die JAZ mindestens 3.
Man kann den Gasverbrauch seiner Wohnung in kWh also durch die JAZ teilen,
und erhält den erwarteten Strom-Mehrverbrauch durch die Wärmepumpe.

Statt 1250 Kubikmeter Gas oder 12500 kWh Heizenergie aus Gas
muss man also 4166 kWh Strom (oder weniger) einplanen.

Schritt 2 (optional): Wenn man außerdem den Gasverbrauch pro Tag hat, und die Außentemperaturen an diesen Tagen,
dann kann man sich den kältesten Tag eines Jahres suchen und den Gasverbrauch an diesem Tag notieren.
Diese Informationen sind nützlich, um die Wärmepumpe für das Haus korrekt zu dimensionieren – hat man die Daten nicht,
ist das kein Beinbruch, aber dann wird geschätzt und ein Standard-Formelsystem angewendet.
Dieses ist auf Sicherheit dimensioniert, wird also ggf. eine größere Wärmepumpe als notwendig errechnen.

Für einen Heizungsbauer und -planer ist es jedenfalls sehr hilfreich, diese Werte zu haben.


# Klimagerät statt Heizkörper

Aus irgendeinem Grund verwenden wir in Nord- und Mitteleuropa Heizungen mit Wasser im Heizkreislauf,
und bauen dann Wärmepumpen ein, die dieses System weiter verwenden.
Das heißt speziell, wir verwenden Luft-Wasser-Wärmepumpen.

Das erste Wort, Luft, bezeichnet dabei das Medium, aus dem die Wärme gezogen wird – die Umgebungsluft.
Es gibt auch Wärmepumpen, die Wärme aus Grund- oder Flußwasser ziehen, oder aus dem Erdreich ("Erdwärmepumpen").
Allen diesen Technologien ist gemeinsam, dass sie aufwändiger zu bauen sind, 
und ihre Stückzahlen geringer sind als die von Luftwärmepumpen.
Daher sind sie meist auch teurer.

Das zweite Wort, Wasser, bezeichnet das Medium, das erwärmt wird, also hier das Wasser im Heizkreislauf.
Man kann also seine alten Heizkörper weiter verwenden.

In anderen Gegenden ist das nicht so.
In den USA und Kanada zum Beispiel haben wir oft Forced Air Heating, 
bei denen das Haus Luftkanäle hat und wir zentral angewärmte Luft in die Räume drücken.

In Südeuropa, Japan und Südostasien haben wir oft Split-Klimageräte mit Heizfunktion (Luft-Luft-Wärmepumpen).
Das sind Split-Anlangen, also mit einem Außengerät und einem Innengerät.
Sie entnehmen der Außenluft Energie, transportieren sie im Arbeitsgas nach Drinnen und wärmen im Innengerät die Luft an.
Das ist dassselbe System wie bei amerikanischen Forced Air Heating,
aber nicht zentral, sondern dezentral pro Raum.

Der Hub ist dabei relativ gering: 
Die Luft im Innenraum wird auf 23ºC–25ºC angewärmt, statt auf 35ºC bis 55ºC wie bei einer europäischen Heizung.
Entsprechend weniger Leistung wird aufgenommen.

## Mit Klimaanlagen heizen – das geht?

Der Energieverbrauch ist überschaubar, etwa 400 Watt pro Innengerät, das aktiv ist,
plus 400 Watt einmalig für die Anlage.

Ich habe zwei Multisplit-Anlagen:
Ein Außengerät an der Südseite mit 5 Anschlüssen (einer ungenutzt),
und ein Außengerät an der Nordseite mit 3 Anschlüssen.

![](/uploads/2025/06/heizen-02.png)

*Anschalten um kurz vor 8, Abschalten um halb 10.*

![](/uploads/2025/06/heizen-03.png)

*Die Raumtemperatur schnellt quasi sofort von 19.0ºC auf 20.5ºC hoch.
Beim Abschalten fällt sie sehr schnell von 20.5ºC auf 20.0ºC ab und sinkt dann langsam weiter, wie in der Nacht.*

Schalten wir die Heizung an, sehen wir kurz vor 8 etwa 800 Watt Leistungsaufnahme, und dann im Betrieb weniger.
Parallel dazu sehen wir, wie die Raumtemperatur sehr schnell ansteigt, viel schneller als bei einer Heizung mit Heizkörpern.
Etwa um halb 10 schalten wir ab, und die Raumtemperatur fällt quasi sofort um ein halbes Grad, 
um dann normal schnell weiter abzusinken.

Das ist das erwartete Verhalten:
Die spezifische Wärme von Luft ist nun einmal viel geringer als die von Wasser.
Das System hat also weniger Trägheit in beide Richtungen.

Die Klimaanlage ist auf 23ºC eingestellt.
Die Temperaturmessung im Raum zeigt jedoch 20.5ºC an.
Was passiert hier?

Das Klimagerät sitzt knapp unter der Decke. 
Es saugt Luft von oben ein und spuckt sie nach unten gelenkt wieder aus.

Die ausgegebene Luft hat, laut FLIR Kamera 23ºC.
Die Zuluft hat schnell mal 22ºC bis 24ºC.

Ein Sensor in Kniehöhe zeigt mir dann 20ºC an.

Ein Sensor in Schulterhöhe 21ºC.

Raumluft ist also, auch bei aktiver Luftumwälzung durch die Klimageräte, thermal geschichtet.
Das–die Schichtung–ist übrigens auch bei traditionellen Radiatoren so.
Die meisten Leute haben nur nicht so obsessiv gemessen wie ich.

Wenn ich die Anlage abschalte, fehlt die Umwälzung, und es schichtet sich noch mehr.
Das ist der schnelle Drop, den wir sehen.
Danach haben wir den normalen Verlust über Zeit.

Anders als Heizkörper sind Klimageräte reine Konvektionsheizungen.
Sie geben keine Wärme durch Strahlung ab.
Daher ist es wichtig, die Luft auch aktiv zu bewegen und so die Schichtung zu durchbrechen.

## Machen die Klimanalagen die Luft nicht sehr trocken?

Nein.

Luft fühlt sich "behaglich" (Wort aus dem Lehrbuch für Klima- und Heizungstechnik-Lehrlinge) an, 
wenn ihre relative Luftfeuchte im Bereich 40-55% liegt.

Luft hat ein Aufnahmevermögen von x Gramm Wasser pro Kubikmeter,
das von der Temperatur exponentiell abhängig ist.
10ºC Temperaturunterschied verdoppeln grob gesagt die Anzahl der Gramm Wasser, die Luft aufnehmen kann.

Wenn ich also 10ºC warme Luft mit Wasser komplett sättige, dann ist die *relative* Luftfeuchte 100%. 
Wärme ich die Luft auf 20ºC an, könnte sie doppelt so viel Wasser tragen,
aber da ich sie nur warm gemacht habe und kein Wasser zugefügt habe, 
sind es immer noch genau so viel Gramm Wasser wie vorher, aber nur noch 50% relative Luftfeuchte.

Wenn ich 20ºC warme Luft komplett mit Wasser sättige, und dann auf 10ºC abkühle,
dann kann die Luft die Hälfte des Wassers in der Luft nicht mehr halten, und es kondensiert.

Das Kondensat kann Schimmel verursachen.

Das Klimagerät kann im Kühlbetrieb Luft trocknen. 
Das ist gut, denn so kann man Schwüle bekämpfen.

Das ist auch der Grund, warum es vier Anschlüsse hat:
Arbeitsgas rein und raus,
Strom und ein Abfluss für das Kondensat.
So wird Kondenswasser weggeschafft und kann keinen Schaden anrichten.

Das Problem kann nur beim Kûhlen auftreten:
Beim Heizen wird die Luft vom alten Wert (sagen wir 19ºC) auf den eingestellten Wert (z.B. 23ºC) angewärmt,
aber nicht angefeuchtet.
Die relative Luftfeuchte sinkt also, und zwar um den erwarteten Wert,
weil alles Wasser, das vorher in der Luft drin war auch drin bleibt.
Das ist ganz genauso wie bei der normalen Raumheizung mit einem Heizkörper.

In der Praxis sehen wir, dass die relative Luftfeuchte während des Heizbetriebes am Messpunkt von 60% auf 56% gefallen ist.

![](/uploads/2025/06/heizen-04.png)

*Luftfeuchtigkeit im Erdgeschoss, im Wohnzimmer und in der Küche, während des Heizbetriebes.*

## Ist das nicht laut?

Eine Klimaanlage bewegt Luft.

Drinnen:
Sie saugt Luft oben am Klimagerät ein und wirft sie unten mit der eingestellten Solltemperatur aus.

Wenn man das Gerät im Normal- oder gar Powerful-Modus betreibt (oder den Lüfter manuell ansteuert),
dann kann man den Lüfter im Leistungsbetrieb deutlich hören.
Stellt man den Modus auf Quiet, dann eher nicht.
Also, er macht Geräusche, aber Deine antike Wohnzimmeruhr tickt lauter,
und jedes draußen vorbei fahrende Auto ist ebenfalls lauter.

Wir haben alle Geräte immer auf Quiet stehen, ausgenommen das Kind – es findet das Gepuste toll
(und will sein Zimmer tropisch, also 23ºC-25ºC).

Man kann ganz sachte hören, wenn sich das Luftleitwerk im Swing-Mode umstellt,
falls man es nicht fixiert hat.

Und man kann den Luftstrom fühlen, insbesondere, wenn man darin sitzt. 
Auch das kann man einstellen, also wo das Ding hin pustet.

Draußen: Das Außengerät hat auch einen Ventilator und einen Kompressor. 
Beide sind unter 40 dB(A) (selbst bei Enteisung), und im Normalbetrieb noch leiser. 
Das heißt, sie sind IMMER leiser als andere Umgebungsgeräusche.

Vom Außengerät geht ein Luftstrom (im Winter kalt, im Sommer warm) in gerader Linie 
etwa 100 cm in Richtung des Ventilators weg – es sei denn, man lenkt ihn mit ein paar Natursteinen irgendwie um.

Will sagen: Im Innenraum ist es marginal merkbar, 
aber es ist nicht so wie die Heizung des defekten 40 Jahre alten Monoblocks, 
der Euch bei Eurem Hotelbesuch in Detroit tiefgefroren hat 
und dabei geklungen hat wie der Beginn einer Roboter-Rebellion. 
Sondern angenehm bis unhörbar.

Das Außengerät macht minimale Geräusche, die aber zu keinem Zeitpunkt als "Lärm" qualifizierbar sind.
Bei nörgelnden Nachbarn sollte man den Artikel
[WP: Go Away Green](https://en.wikipedia.org/wiki/Go_Away_Green)
lesen und seine Schlüsse ziehen.

![](/uploads/2025/06/heizen-05.png)

*Einstellmöglichkeiten der Klimaanlage in Home Assistant.*

Wie dem auch sei: Es funktioniert, macht das Haus warm, braucht wenig Energie, kann im Sommer kühlen,
und macht die Luft nicht trocken und ist auch nicht laut (außer man sagt dem Gerät,
dass es jetzt mal auf den Kopf hauen soll, weil ich es schnellstmöglich warm haben will)

## Kühlen

Hier ist ein komplizierter Graph aus Home Assistant:

![](/uploads/2025/06/heizen-07.png)

Im unteren Graphen sehen wir die Leistungsaufnahme der Klimaanlage ("Südseite").
Von circa 10 Uhr bis 13 Uhr und von kurz vor 16 Uhr bis 17:30 Uhr ist die Kühlung gelaufen, 
und hat dabei 300-400 Watt gezogen.

Im oberen Graphen sehen wir:
- Gelb – die eingestellte Solltemperatur am Lufteinlass der Klimaanlage
- Dunkelblau - die gemessene Temperatur am Lufteinlass der Klimaanlage
- Rot - die gemessene Temperatur an einem Sensor neben dem Bett 
  (der Sensor war von 11:00 bis 11:30 der Sonne ausgesetzt und hat dort einen Ausreißer)
- hellblaue Balken - Einschaltsignal der Kühlung

Man sieht, wie die eingestellte gelbe Linie irrlichtert, als ich herausfinde, was ein angenehmer Wert ist,
und wie die dunkelblaue Linie und die rote Linie dieser gelben eingestellten Linie langsam nachfolgen.
Es gelingt der Anlage problemlos, die Raumtemperatur zu kontrollieren. 

Die Solaranlage hat zu diesen Zeiten so viel Energie erzeugt, dass die gezogenen 400 Watt komplett egal sind.
