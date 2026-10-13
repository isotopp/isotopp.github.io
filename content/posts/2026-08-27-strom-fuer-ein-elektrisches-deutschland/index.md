---
author: isotopp
date: "2026-08-27T01:02:03Z"
feature-img: assets/img/background/rijksmuseum.jpg
title: "Strom für ein elektrisches Deutschland"
toc: true
katex: true
tags:
  - lang_de
  - energy
  - climate
---

Deutschland verbraucht viel Energie, aber nur ein kleiner Teil davon ist Strom.
Wenn wir fossile Brennstoffe durch Strom ersetzen, sinkt der Energiebedarf.

Ein Liter Diesel enthält ungefähr 10 kWh Energie. Ein Dieselauto mit 6 l/100 km verbrennt also 60 kWh/100 km.
Am Rad kommen grob 20 kWh/100 km an; der Rest wird Wärme.
Ein Elektroauto braucht für die gleiche Strecke meist weniger als diese 20 kWh aus der Batterie.

Das gilt nicht nur für Autos. Wir verbrennen fossile Brennstoffe meist, um Wärme oder Bewegung zu erzeugen.
Elektromotoren, Wärmepumpen und andere elektrische Verfahren vermeiden einen großen Teil dieser Verluste.

Ich habe deshalb deutsche Viertelstundenwerte von 2024 auf ein elektrisches Deutschland hochgerechnet: mit Wind, Solar, Vier-Stunden-Batterien und Gaskraftwerken als letzter Reserve.
Der Quellcode liegt auf [GitHub: isotopp/strommodell](https://github.com/isotopp/strommodell).

# Ziel: rund 1.100 TWh Strom

Die [AG Energiebilanzen](https://ag-energiebilanzen.de/daten-und-fakten/anwendungsbilanzen/) hat vollständige Anwendungsbilanzen bis 2024.
Das [Energieflussbild 2024](https://ag-energiebilanzen.de/wp-content/uploads/EBD24p2_EFBlang_PJ_deutsch.pdf) weist aus:

- 10.542 PJ (2.928 TWh) Primärenergieverbrauch;
- 8.095 PJ (2.249 TWh) Endenergieverbrauch;
- 1.664 PJ (462 TWh) davon Strom;
- 6.431 PJ (1.786 TWh) übrige Endenergie.

Ich rechne mit der Endenergie, die bei den Verbrauchern ankommt.
Der Primärenergieverbrauch enthält auch die Verluste heutiger Kohle- und Gaskraftwerke.
Wer ihn nimmt und dann fossile Energie pauschal durch drei teilt, zählt einen Teil der Einsparung doppelt.

Die grobe Rechnung lautet:

$$
E_\text{elektrisch} = E_\text{Strom} + \frac{E_\text{übrige Endenergie}}{3}
$$

also:

$$
1.664\ \text{PJ} + \frac{6.431\ \text{PJ}}{3} = 3.807\ \text{PJ}.
$$

Das sind 1.058 TWh im Jahr. Wegen der Netz- und Speicherverluste und der Ungenauigkeit dieser Schätzung runde ich auf **1.100 TWh/a**.

Zum Vergleich: Der Stromverbrauch einschließlich Netzverlusten betrug 2024 nach [SMARD-Daten der Bundesnetzagentur](https://www.bundesnetzagentur.de/SharedDocs/Downloads/DE/Sachgebiete/Energie/Unternehmen_Institutionen/MonitoringEnergiederZukunft/monitoringbericht_2025.pdf?__blob=publicationFile&v=6) 465,5 TWh.
Das Ziel ist das 2,36-Fache davon.

# Viertelstunden statt Jahresmittel

1.100 TWh im Jahr entsprechen einer mittleren Leistung von 126 GW:

$$
\frac{1.100 TWh}{8.760 h} = 126 GW.
$$

Das Stromsystem muss in jeder Viertelstunde genug Strom liefern. Deshalb verwende ich die deutschen Daten von 2024 aus [Fraunhofer Energy-Charts](https://energy-charts.info/downloads.html?c=DE&l=de): Last, Solar, Wind an Land und Wind auf See, jeweils in 15-Minuten-Schritten.

Die gemessene Last summiert sich auf 465,503 TWh. Ich erhöhe alle Werte um denselben Faktor auf 1.100 TWh.
Der Verlauf bleibt gleich; die Spitzenlast steigt auf 179,0 GW.

Für jede Viertelstunde rechne ich die Leistung von Photovoltaik (PV), Wind an Land und Wind auf See getrennt hoch:

$$
P_\text{Szenario}(t) = P_\text{beobachtet}(t) \cdot
\frac{K_\text{Szenario}}{K_\text{Referenz}}.
$$

Als Referenzleistung nehme ich den Mittelwert der installierten Leistung Ende 2023 und Ende 2024.
Das bildet den starken PV-Ausbau besser ab als der Jahresendwert.

Übrig bleibt die Residuallast: der Strombedarf, den Wind und Solar nicht decken.

$$
R(t) = D(t) - S(t) - W_\text{an Land}(t) - W_\text{auf See}(t).
$$

Bei Überschuss lädt die Batterie. Ist sie voll oder reicht ihre Ladeleistung nicht aus, drosselt das Modell Wind und Solar.
Bei Strommangel entlädt die Batterie; den Rest liefern Gaskraftwerke.
Das Modell importiert keinen Strom und deckt den Bedarf immer.

# Batterie für Stunden, Gas für Flauten

Die Batterien der Ausbauszenarien haben vier Stunden Speicherkapazität: 100 GW Leistung bedeuten 400 GWh Energie.
Sie lädt und entlädt jeweils mit 90 % Wirkungsgrad.

Damit lässt sich Solarstrom vom Mittag am Abend nutzen und Windschwankungen kurzfristig ausgleichen.
Die Batterie speichert aber keinen Strom vom Sommer für den Winter. Wenn bei hohem Bedarf Wind und Sonne viele Stunden kaum Strom liefern, ist sie leer.

Gaskraftwerke decken nur den Rest:

$$
G(t) = \max(0, R(t) - B_\text{entladen}(t)).
$$

Das Modell liefert daher zwei entscheidende Zahlen:

- **Gasarbeit**: Wie viel Strom aus Gas brauchen wir im Jahr, gemessen in TWh?
- **Gasleistung**: Wie viele GW müssen Gaskraftwerke bei größtem Strommangel liefern können?

Die zweite Zahl bestimmt die nötige Kraftwerksreserve.

# Vier Szenarien

Szenario 0 nutzt den Bestand Ende 2024: 99,3 GW PV, 63,53 GW Wind an Land, 9,215 GW Wind auf See und 12,67 GW / 18,65 GWh Batteriespeicher.
Ihre Speicherkapazität entspricht nur etwa 1,5 Stunden bei voller Leistung.

| Szenario | PV | Wind an Land | Wind auf See | Batterie |
| --- | ---: | ---: | ---: | ---: |
| 0: Iststand 2024 | 99,3 GW | 63,53 GW | 9,215 GW | 12,67 GW / 18,65 GWh |
| A: knapp | 300 GW | 250 GW | 70 GW | 50 GW / 200 GWh |
| B: Referenz | 400 GW | 300 GW | 80 GW | 100 GW / 400 GWh |
| C: viel Überschuss | 500 GW | 350 GW | 100 GW | 150 GW / 600 GWh |

Szenario 0 zeigt **nicht** die Strombilanz von 2024. Es kombiniert die damaligen Wind-, PV- und Batterieanlagen mit dem Bedarf eines elektrischen Deutschlands. Wie viel Strom müssten Gaskraftwerke liefern?

# Ergebnis: Gasarbeit fällt, Gasleistung fast nicht

Der Modelllauf für 2024 ergibt:

| Szenario | Gasleistung | Gasarbeit | Stunden mit Gas | Abregelung |
| --- | ---: | ---: | ---: | ---: |
| 0: Iststand 2024 | 163,3 GW | 896,0 TWh | 8.784 h | 0,0 TWh |
| A: knapp | 156,7 GW | 319,4 TWh | 5.548 h | 56,9 TWh |
| B: Referenz | 156,6 GW | 214,2 TWh | 3.545 h | 127,5 TWh |
| C: viel Überschuss | 156,5 GW | 133,4 TWh | 2.086 h | 253,3 TWh |

Von Szenario 0 zu C sinkt die Gasarbeit von 896 auf 133 TWh, um 85 Prozent. Der Gaseinsatz sinkt von fast dem ganzen Jahr auf 2.086 Stunden, um 76 Prozent.
Das sind keine „wenigen Tage“: Selbst in Szenario C liefern Gaskraftwerke noch in rund einem Viertel des Jahres Strom, oft nur mit kleiner Leistung.

Die Gasleistung sinkt dagegen kaum: von 163,3 auf 156,5 GW.
Am 6. November 2024 um 16:30 UTC liegt die hochgerechnete Last bei 157,2 GW. Wind und Solar liefern in Szenario C zusammen nur 0,66 GW. Die Batterie ist leer. Diesen Mangel müssen die Gaskraftwerke decken.

Mehr Wind, Solar und Batterien verringern den Gaseinsatz. Bei Dunkelheit und wenig Wind bleiben Gaskraftwerke nötig.

Wahrscheinlich brauchen wir viele Gaskraftwerke, die schnell starten. Sie verkaufen wenig Strom, müssen aber bei Strommangel ihre volle Leistung liefern können. Dafür sollten sie auch Geld für die bereitgehaltene Leistung erhalten, nicht nur für den verkauften Strom.

Die Abregelung in B und C ist kein Fehler: Viele Anlagen liefern auch bei wenig Wind und Sonne öfter genug Strom. Bei Überschuss muss das Modell sie drosseln.
Speicher und Verbraucher mit zeitlich flexiblem Bedarf können einen Teil der Überschüsse nutzen. Lange Winterphasen mit wenig Wind und Sonne brauchen trotzdem gesicherte Leistung.

So lässt sich die Rechnung wiederholen:

```bash
uv run strommodell run scenarios/2024.yaml --output results/2024
uv run strommodell report results/2024
```

# Grenzen des Modells

Das ist eine grobe Schätzung mit Messwerten eines Jahres, keine Ausbauplanung.

- Ich rechne nur mit 2024. Für die Größenordnung reicht das. Eine verbindliche Reserveplanung braucht viele Wetterjahre und besonders lange Phasen mit wenig Wind und Sonne.
- Ich erhöhe alle Lastwerte von 2024 um denselben Faktor. Eigene, steuerbare Lastverläufe für Wärmepumpen, Elektroautos, Industrie und Elektrolyse fehlen.
- Ich rechne die gemessene Einspeisung hoch, einschließlich der Folgen gedrosselter Anlagen und begrenzter Netze. Ein größerer Anlagenbestand hätte je installiertem GW nicht genau denselben Verlauf.
- Ich schätze den Anlagenbestand mit dem Mittelwert von Ende 2023 und Ende 2024. Der Ausbau im Jahresverlauf wäre genauer.
- Wasserkraft, Biomasse, Fernwärme, Pumpspeicher, europäischer Stromhandel, Netze und die Steuerung des Strombedarfs fehlen. Das Modell beschränkt sich auf Wind, Sonne, Batterie und Gas.
- Die Batterie startet halb voll und darf mit einem anderen Ladezustand enden. Das beeinflusst die Jahreswerte wenig. Für die Optimierung des Stromsystems müsste ihr Ladezustand am Jahresanfang und -ende gleich sein.
- Wasserstoff fehlt. Ob sich seine Herstellung und Speicherung für selten laufende Reservekraftwerke lohnt, ist eine eigene Frage. Elektrolyseure, die Wasser mit Strom in Wasserstoff und Sauerstoff zerlegen, lohnen sich bei sehr geringer Auslastung kaum. Das untersucht diese Rechnung nicht.

# Quellen

- [AG Energiebilanzen: Energieflussbild Deutschland 2024](https://ag-energiebilanzen.de/wp-content/uploads/EBD24p2_EFBlang_PJ_deutsch.pdf)
- [AG Energiebilanzen: Anwendungsbilanzen](https://ag-energiebilanzen.de/daten-und-fakten/anwendungsbilanzen/)
- [Bundesnetzagentur: Monitoringbericht 2025, Stromverbrauch 2024](https://www.bundesnetzagentur.de/SharedDocs/Downloads/DE/Sachgebiete/Energie/Unternehmen_Institutionen/MonitoringEnergiederZukunft/monitoringbericht_2025.pdf?__blob=publicationFile&v=6)
- [Fraunhofer ISE Energy-Charts: Downloads und Zeitreihen](https://energy-charts.info/downloads.html?c=DE&l=de)
- [strommodell: Quellcode, Datenimport, Szenarien und Modellannahmen](https://github.com/isotopp/strommodell)
