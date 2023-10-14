---
author: isotopp
title: "Energiekosten beim Elektroauto"
date: 2023-09-13T01:02:03Z
feature-img: assets/img/background/rijksmuseum.jpg
toc: false
tags:
- lang_de
- energy
- verkehr
---

Das neue Auto hat eine Batterie mit 60 kWh Kapazität, also muss es 42 kWh aufnehmen, um von 10 % auf 80 % zu kommen.
Die 80 % sind eine Art magische Grenze, weil die Ladegeschwindigkeit des Autos insbesondere beim Schnellladen unterwegs
vom Füllstand der Batterie abhängig ist, und ab 80 % stark absinkt. 
Die letzten 20 % dauern also lange.

Dazu kommt, daß das Auto auch beim elektrischen Bremsen – beim Rekuperieren – lädt und wenn der Akku-Füllstand über 80 % ist,
ist das Rekuperationsvermögen durch die geringere Ladegeschwindigkeit der Batterie eingeschränkt.
Ist das Auto also in städtischen Umgebungen unterwegs, wird man beim dauernden Bremsen im Stadtgebiet oberhalb von 80 %
Energie durch mechanischen Bremsen verschwenden, anstatt sie durch elektrisches Bremsen zurückzugewinnen.

# Ladeleistung

Ersetzt werden müssen
```console
60 kWh * (0.8 - 0.1) = 42 kWh
```
und das dauert circa 30 Min. bis 35 Min. an einem Schnell-Lader, zum Beispiel von Fastned.

![](/uploads/2023/09/energiekosten-01.jpg)

*Ladekurve für den Renault Megane 60 kWh an einem Schnell-Lader von Fastned.
Man erkennt, wie die Ladeleistung mit zunehmendem Akku-Füllstand sinkt und gegen Ende sogar
unter die Motorleistung (55 kW Dauerleistung) absinkt.*

# Kosten

Mit Fastned Gold bezahlt man 0.483 Euro/kWh, also
```console
42 * 0.483 = 20.28 Euro   # Laden von 10 % bis 80 %
14 * 0.483 = 6.76 Euro    # Laden von 100 km Reichweite
```
für einen Ladevorgang bzw. für 100 km Reichweite bei 14 kWh/100 km.
Daheim kostet die kWh in der Theorie 33 Cent, das wären dann entsprechend 13,86 Euro für 42 kWh und 4.62 Euro für 100 km Reichweite.
Das ist theoretisch, weil wir bis Ende 2024 noch die Saldierungsregelung haben, bei der die Solarproduktion mit dem Verbrauch 1:1 verrechnet wird,
und wir fett Guthaben haben.

Daheim fährt das Auto also gratis.

![](/uploads/2023/09/energiekosten-02.png)

*Unsere Solaranlage in O/W-Lage produziert ihr Maximum am späten Nachmittag, um circa 17:00 Uhr. Auch dann werden 5 kW nicht überschritten.
Das Laden des Autos zieht jedoch 11 kW, sodaß ein reines Überschußladen ohne spezielle Steuerung nicht möglich ist.
Selbst dann sind 42 kWh Ertrag am Tag nur an guten Tagen im Hochsommer machbar.*

Um den Anteil des selbst erzeugten Stromes zu maximieren, wäre es sinnvoll, das Auto oft zu laden,
und auch die Ladeleistung des Anschlusses auf die Menge des selbst produzierten Stromes zu begrenzen ("Überschußladen").

Viele Ladepunkte können das nicht von Hause aus, und selbst bei denen, die es können, setzt die Elektronik enge Grenzen:
Der Regelbereich für den Ladestrom geht vom Maximum von 16 Ampere bis auf minimal 6 Ampere herab.
Bei drei Phasen ist die minimale Ladeleistung also `6 Ampere * 230 V * 3 Phasen = 4140 Watt`,
kann man Auto und Ladesäule auf eine Phase einschränken, kann man immerhin auf 1380 Watt herunter.

Im Bild ist erkennbar, daß der Energieverbrauch am Meßtag für den Gesamthaushalt 50.8 kWh war,
dem 17.2 kWh Produktion gegenüber stehen. Davon wurden 6.9 kWh eingespeist, und 40.5 kWh bezogen.
Insgesamt hatten wir an diesem Tag einen Unterschuß von 33.65 kWh.

Ohne den heimischen Ladepunkt hätten wir an einen öffentlichen Ladepfahl gegen müssen.
Der nächstgelegene Ladepunkt ist eine Querstraße weiter und auch nicht teurer:
Wir zahlen 0.34 Euro/kWh.

![](/uploads/2023/09/energiekosten-03.jpg)

*Öffentlicher Ladepunkt von Vattenfall bei Nutzung mit einer Vattenfall InCharge oder Eneco Karte.
Die Energiekosten liegen bei 0.34 Euro/kWh.*

# Mobilität ist energieintensiv

Für die Akten:

Wir verbrauchen ohne Auto im Schnitt 15 kWh/Tag im Haus (3 Leute, ein Rechner, der alleine 900 kWh/Jahr zieht),
für 5500 kWh/Jahr, und eine Basislast von 300 Watt nachts.
Das ist im Vergleich recht viel.

100 km im großen Auto sind 14 kWh/100 km, also etwa so viel wie ein Haus-Tag.

100 km im Carver sind 7 kWh/100 km, also 1/2 Haus-Tag.
Der Carver hat auch nur einen Schnarchlader, also Schuko, und kann direkt aus dem Solar-Array laden, nachmittags, von März bis Oktober.

# Wie oft und wo laden?

10 % bis 80 % von einem 60 kWh Akku sind 42 kWh,
und bei einem Verbrauch von 14 kWh (Sommer) sind die in 3 Stunden leer.
Ich muss also alle 3 Stunden eine halbe Stunde pausieren, um zu laden.

Im Winter vermutlich öfter, aber ich glaube, im Winter will ich eine Tour Amsterdam–Berlin eher mit der Bahn machen.

Das große Auto hat eine Reichweite von 300 bis 400 km, je nachdem wie man es fährt.
Der Carver hat eine Reichweite von 100 km und verbraucht die Hälfte vom großen Auto.

Beide Fahrzeuge können wir daheim laden, und beide Fahrzeuge erledigen lokale Fahrten ohne Fremdladen:
Sie werden in der Regel daheim geladen.
Das ist in der Regel 1-2 mal die Woche der Fall.

Nur bei Fernreisen geht der Renault an fremde Lader, und dann an Schnell-Lader.

# Fahrerlebnis

Im Stadtverkehr ist das Elektroauto eine Offenbarung.
Es ist super sparsam, weil das ganze Beschleunigen durch Bremsen mit Rekuperation wieder zu Akkuladung umgewandelt wird
(ca. 70 % Effizienz), während ein Verbrenner in dieser Situation gerne einmal säuft.

Auch Beschleunigen und den Hintern aus dem Weg räumen oder im Stau ohne Nerv vorwärts kriechen ist mit einem Elektroauto sehr viel weniger nervig.
Die Fahrassistenzsysteme im großen Auto machen es noch angenehmer, aber selbst der Carver glänzt.

Auf der Autobahn lernt man gleichmäßige gemächliche Geschwindigkeiten sehr schätzen.

Ich glaube, das Tempolimit von 120 km/h wird in Deutschland faktisch automatisch kommen,
sobald nur genügend elektrische Autos auf der Straße sind.
Niemand in so einer Kiste hat dauerhaft das Bedürfnis,
sinnlos Akku durchzubladen ohne Effekt.
Die Verbrenner-Raser sitzen dann zwischen den ganzen e-Mobilen fest.
