---
author: isotopp
title: "Was wäre wenn alle Autos elektrisch führen?"
date: "2023-08-02T01:02:03Z"
feature-img: assets/img/background/rijksmuseum.jpg
toc: false
tags:
- lang_de
- energy
---

In Deutschland gibt es circa 50 Millionen Autos.
Wieviele Kilometer fahren die so im Jahr?

![](/uploads/2023/08/autos-01.png)

*[Statista: Fahrleistung der PKW in Deutschland von 1970 bis 2021](https://de.statista.com/statistik/daten/studie/2984/umfrage/entwicklung-der-fahrleistung-von-pkw/),
die Statistik zeigt die Entwicklung der Fahrleistung der Pkw in Deutschland in den Jahren 1970 bis 2021. Im Jahr 2021 betrug die Fahrleistung der Personenkraftwagen in Deutschland rund 582,4 Milliarden Kilometer.*

Das sind überschlägig 10k KM pro Jahr und Auto, das ist ein plausibler Wert.

Bei einem angenommenen Energieverbrauch von 20 kWh po 100 km und 582 Mrd. Kilometern ergibt sich ein Energiebedarf von

```console
>>> (582.4*10^7*20)/(10^9)
116
```

Also 116 Mrd. kWh oder 116 TWh.

Die Stromerzeugung in Deutschland lag in 2022 bei 574 TWh.

![](/uploads/2023/08/autos-02.png)

*[Statista:  Bruttostromerzeugung in Deutschland in den Jahren 1991 bis 2022](https://de.statista.com/statistik/daten/studie/153267/umfrage/bruttostromerzeugung-in-deutschland-seit-1990/),
im Jahr 2022 wurden in Deutschland 574 TWh Strom erzeugt.
Dies ist die Summe des erzeugten Stroms von Kraftwerken der allgemeinen Versorgung, industriellen Eigenanlagen sowie privaten Betreibern in Deutschland.*

Würde man die Autos in Deutschland komplett elektrifizieren, ist das ein Strommehrbedarf von 20 %.
Und 20 kWh/100 km sind ein Benzinäquivalent von 2.2 l/100 km.

Der Primärenergieverbrauch von Deutschland ist 1989 maximal gewesen und seit dem linear leicht gesunken.

![](/uploads/2023/08/autos-03.png)

*[OWiD: Primary energy consumption in TWh](https://ourworldindata.org/grapher/primary-energy-cons?tab=chart&country=~DEU).*

Wir sind noch bei 78 % des Spitzenverbrauches, also ca. -0.7 % pro Jahr abnehmend.
Das ist wohlgemerkt bei steigendem GDP:

![](/uploads/2023/08/autos-04.png)

*[OWiD: GDP per Capita](https://ourworldindata.org/grapher/gdp-per-capita-worldbank?tab=chart&country=DEU).*

Die 116 TWh E-Mobilität sparen zugleich geschätzt 350 TWh Primärenergie ein,
also von 3416 TWh/a auf 3066 TWh/a abnehmend, 
oder anders gerechnet knapp 10 % oder 15 Jahre bei -0.7 % pro Jahr.

Die Raffinierung von Benzin braucht auch Energie,
etwa 1,585 Kilowattstunden pro 1l Treibstoff, allerdings kein Strom, sondern Primärenergie
([Gigantischer Stromverbrauch von Raffinerien?](https://sedl.at/Umweltirrtuemer/Stromverbrauch_Raffinerien)).

In Deutschland werden 52.2 Mio. Tonnen Kraftstoff/Jahr verfahren
([Zahlen der "Fachagentur Nachwachsende Rohstoffe"](https://mediathek.fnr.de/kraftstoffverbrauch-in-deutschland.html)).
Es sind 1.333 m^3 Volumen pro Tonne (Benzin)

```console
>>> (52.2*10^6 * 1333*1.585)/10^9
110
```
- 110 TWh Primärenergieverbrauch zur Herstellung des in Deutschland verbrannten Kraftstoffes gegen
- 116 TWh direkten Stromverbrauch, wenn man den Strom direkt verfährt.

Strom gegen Primärenergie, aber ja.

Rechnet man solche Ersparnisse über die Gesamtwirtschaft, kann man ein solches 
[Diagramm](https://www.energy.gov/energysaver/articles/annual-energy-and-carbon-flow-charts-detail-us-energy-use-sources-and) 
zeichnen:

[![](/uploads/2023/08/autos-05.png)](https://www.energy.gov/energysaver/articles/annual-energy-and-carbon-flow-charts-detail-us-energy-use-sources-and)

*Energy Flow Chart. 
Die Einheiten sind sehr amerikanisch: 
Quads (Quadrillion BTU, [3412 BTUs entsprechen 1 kWh](https://www.rapidtables.com/convert/energy/BTU_to_kWh.html)).
Dies sind [Short Scale Quads](https://en.wikipedia.org/wiki/Names_of_large_numbers), also 1E15, deutsche Billiarden.*

Man sieht, daß die Effizienz von 1/3, die wir bei Verbrennungsmotoren haben, und die wir auch als Jahresarbeitszahl bei Wärmepumpen annehmen, 
auch für den gesamten Primärenergiebedarf gilt.
Wir können also annehmen, daß wir durch eine Elektrifizierung von allem den Primärenergiebedarf dritteln,
oder, wenn wir dennoch gewisse Verluste zugestehen, halbieren.
Das ist das Ausbauziel in zu deckendem Primärenergiebedarf für eine nachhaltige Energieversorgung. 
