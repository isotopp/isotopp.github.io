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

Deutschland verbraucht heute sehr viel Energie, aber nur ein kleiner Teil davon ist Strom.
Das ist kein Argument gegen Elektrifizierung, sondern ihr größter Vorteil.

Ein Liter Diesel enthält ungefähr 10 kWh Energie. Ein Dieselauto mit 6 l/100 km verbrennt also 60 kWh/100 km.
Am Rad kommen grob 20 kWh/100 km an; der Rest wird Wärme.
Ein Elektroauto braucht für die gleiche Strecke meist weniger als diese 20 kWh aus der Batterie.

Das Prinzip gilt nicht nur für Autos. Fossile Energie wird meist verbrannt, um Wärme oder Bewegung zu erzeugen.
Elektrische Motoren, Wärmepumpen und elektrische Prozesse umgehen einen großen Teil dieser Verluste.

Ich habe deshalb eine grobe, aber konkrete Rechnung gebaut: historische deutsche Viertelstundenwerte aus 2024, auf ein elektrifiziertes Deutschland hochskaliert, mit Wind, Solar, Vier-Stunden-Batterien und Gaskraftwerken als letzter Reserve.
Der Quellcode liegt auf [GitHub: isotopp/strommodell](https://github.com/isotopp/strommodell).

# Die Zielgröße: rund 1.100 TWh Strom

Die [AG Energiebilanzen](https://ag-energiebilanzen.de/daten-und-fakten/anwendungsbilanzen/) hat vollständige Anwendungsbilanzen derzeit bis 2024.
Das detaillierte [Energieflussbild 2024](https://ag-energiebilanzen.de/wp-content/uploads/EBD24p2_EFBlang_PJ_deutsch.pdf) weist aus:

- 10.542 PJ (2.928 TWh) Primärenergieverbrauch;
- 8.095 PJ (2.249 TWh) Endenergieverbrauch;
- 1.664 PJ (462 TWh) davon Strom;
- 6.431 PJ (1.786 TWh) übrige Endenergie.

Für die Frage nach einem elektrischen Deutschland ist der Endenergieverbrauch die sinnvolle Basis.
Der Primärenergieverbrauch enthält die Verluste heutiger Kohle- und Gaskraftwerke bereits.
Wer ihn nimmt und dann fossile Energie noch einmal pauschal durch drei teilt, rechnet einen Teil der Verbesserung doppelt.

Die absichtlich grobe Rechnung lautet:

$$
E_\text{elektrisch} = E_\text{Strom} + \frac{E_\text{übrige Endenergie}}{3}
$$

also:

$$
1.664\ \text{PJ} + \frac{6.431\ \text{PJ}}{3} = 3.807\ \text{PJ}.
$$

Das sind 1.058 TWh im Jahr. Mit Netz- und Speicherverlusten und der unvermeidlichen Ungenauigkeit einer solchen Faustformel runde ich auf **1.100 TWh/a**.

Zum Vergleich: Der heutige Stromverbrauch einschließlich Netzverlusten betrug 2024 nach [SMARD-Daten der Bundesnetzagentur](https://www.bundesnetzagentur.de/SharedDocs/Downloads/DE/Sachgebiete/Energie/Unternehmen_Institutionen/MonitoringEnergiederZukunft/monitoringbericht_2025.pdf?__blob=publicationFile&v=6) 465,5 TWh.
Die Zielgröße ist damit das 2,36fache der heutigen Stromarbeit.

# Reale Viertelstunden statt Jahresmittel

1.100 TWh im Jahr entsprechen einer mittleren Leistung von 126 GW:

$$
\frac{1.100 TWh}{8.760 h} = 126 GW.
$$

Ein Stromsystem muß aber in jeder Viertelstunde funktionieren. Deshalb verwende ich die öffentliche deutsche 2024er Zeitreihe von [Fraunhofer Energy-Charts](https://energy-charts.info/downloads.html?c=DE&l=de): Last, Solar, Wind an Land und Wind auf See, jeweils in 15-Minuten-Schritten.

Die reale Lastreihe hat 465,503 TWh. Sie wird proportional auf 1.100 TWh skaliert. Ihre Form bleibt dabei unverändert.
Das ergibt eine Spitzenlast im konkreten 2024er Profil von 179,0 GW.

Für jede Viertelstunde werden PV, Wind an Land und Wind auf See getrennt skaliert:

$$
P_\text{Szenario}(t) = P_\text{beobachtet}(t) \cdot
\frac{K_\text{Szenario}}{K_\text{Referenz}}.
$$

Die Referenzleistung ist für 2024 der Mittelwert aus dem Anlagenbestand Ende 2023 und Ende 2024.
Das ist bei starkem PV-Zubau besser als blind mit dem Jahresendwert zu rechnen.

Dann bleibt die Residuallast:

$$
R(t) = D(t) - S(t) - W_\text{an Land}(t) - W_\text{auf See}(t).
$$

Bei Überschuß lädt die Batterie, danach wird abgeregelt. Bei Defizit entlädt sie, danach liefert Gas.
Es gibt im Modell keine Importe und keine ungedeckte Last.

# Batterie für Stunden, Gas für Flauten

Die Batterie hat in den Szenarien vier Stunden Energieinhalt: 100 GW Batterie-Leistung bedeuten 400 GWh Energie.
Sie lädt und entlädt jeweils mit 90 % Wirkungsgrad.

Das verschiebt Solarstrom vom Mittag in den Abend und glättet kurze Windschwankungen.
Es ist aber kein saisonaler Speicher. Wenn bei hoher Last Wind und Sonne über viele Stunden praktisch ausfallen, ist eine Vier-Stunden-Batterie leer.

Gaskraftwerke decken ausschließlich den Rest:

$$
G(t) = \max(0, R(t) - B_\text{entladen}(t)).
$$

Die entscheidenden Ausgaben sind daher getrennt:

- **Gasarbeit**: Wie viele TWh müssen im Jahr aus Gas kommen?
- **Gasleistung**: Wie viele GW müssen im schlimmsten Viertelstundenschritt bereitstehen?

Die zweite Zahl bestimmt die Größe der Reserveflotte, nicht die erste.

# Vier Szenarien

Szenario 0 benutzt den Bestand Ende 2024: 99,3 GW PV, 63,53 GW Wind an Land, 9,215 GW Wind auf See und 12,67 GW / 18,65 GWh Batteriespeicher.
Die Batterie hat damit heute nur etwa 1,5 Stunden Dauer.

| Szenario | PV | Wind an Land | Wind auf See | Batterie |
| --- | ---: | ---: | ---: | ---: |
| 0: Iststand 2024 | 99,3 GW | 63,53 GW | 9,215 GW | 12,67 GW / 18,65 GWh |
| A: knapp | 300 GW | 250 GW | 70 GW | 50 GW / 200 GWh |
| B: Referenz | 400 GW | 300 GW | 80 GW | 100 GW / 400 GWh |
| C: viel Überschuß | 500 GW | 350 GW | 100 GW | 150 GW / 600 GWh |

Szenario 0 ist ausdrücklich **nicht** die heutige deutsche Strombilanz. Es setzt den heutigen Wind-, PV- und Batteriepark auf die Last eines elektrifizierten Deutschlands und fragt: Was bliebe dann für Gas übrig?

# Ergebnis: Gasarbeit fällt, Gasleistung fast nicht

Der Modelllauf für 2024 ergibt:

| Szenario | Gasleistung | Gasarbeit | Stunden mit Gas | Abregelung |
| --- | ---: | ---: | ---: | ---: |
| 0: Iststand 2024 | 163,3 GW | 896,0 TWh | 8.784 h | 0,0 TWh |
| A: knapp | 156,7 GW | 319,4 TWh | 5.548 h | 56,9 TWh |
| B: Referenz | 156,6 GW | 214,2 TWh | 3.545 h | 127,5 TWh |
| C: viel Überschuß | 156,5 GW | 133,4 TWh | 2.086 h | 253,3 TWh |

Das Resultat ist klar.

Von Szenario 0 zu C sinkt die Gasarbeit von 896 auf 133 TWh, um 85 Prozent. Die Zahl der Viertelstunden mit Gaseinsatz sinkt von praktisch dem ganzen Jahr auf 2.086 Stunden, also um 76 Prozent.
Das sind weiterhin nicht „wenige Tage“: Selbst im großen Szenario C läuft Gas noch in rund einem Viertel des Jahres, wenn auch oft nur mit kleiner Leistung.

Die Gasleistung sinkt dagegen kaum: von 163,3 auf 156,5 GW.
Am 6. November 2024 um 16:30 UTC liegt die hochskalierte Last bei 157,2 GW. Wind und Solar liefern im Szenario C zusammen nur 0,66 GW. Die Batterie ist zu diesem Zeitpunkt leer. Genau für diese Lage muß die Gasflotte da sein.

Mehr Wind, Solar und Batterie machen Gas deshalb von der dominanten Energiequelle zur Rest- und Dunkelflautenenergie. Sie machen die Gaskraftwerke aber nicht überflüssig.

Das wahrscheinliche Ergebnis ist eine große Flotte schneller Gaskraftwerke als Peaker auf Abruf. Sie verkauft wenig Energie, muß aber im kritischen Moment vollständig verfügbar sein. Das bezahlt man nicht sinnvoll allein über verkaufte MWh, sondern über eine Vergütung für vorgehaltene gesicherte Leistung.

Die Abregelung in B und C ist kein Fehler. Sie ist der Preis dafür, daß Wind und Solar auch in schlechten Stunden noch ausreichend oft viel Energie liefern. Zusätzliche Speicher oder flexible Verbraucher können einen Teil dieser Überschüsse nutzen; sie ändern aber nicht die einfache Tatsache, daß eine lange, dunkle und windarme Winterphase gesicherte Leistung braucht.

Der vollständige Rechenweg ist reproduzierbar:

```bash
uv run strommodell run scenarios/2024.yaml --output results/2024
uv run strommodell report results/2024
```

# Grenzen des Modells

Das ist eine Daumenschätzung mit einer realen Jahreszeitreihe, keine Ausbauplanung.

- Es wird absichtlich nur 2024 gerechnet. Für die Größenordnung reicht das; für eine verbindliche Reserveplanung müßte man viele Wetterjahre und besonders schlechte Dunkelflauten untersuchen.
- Die Lastform von 2024 wird nur proportional hochskaliert. Wärmepumpen, Elektroautos, Industrie und Elektrolyse bekommen noch keine eigenen, steuerbaren Profile.
- Die Skalierung verwendet beobachtete Einspeisung. Darin stecken heutige Abregelungen und Netzrestriktionen; ein künftiger, viel größerer Anlagenpark hätte nicht exakt dasselbe Profil pro installiertem GW.
- Der Anlagenbestand wird nur über den Mittelwert aus Jahresende 2023 und 2024 angenähert. Eine zeitgenaue Zubaukurve wäre besser.
- Wasserkraft, Biomasse, Fernwärme, Pumpspeicher, europäischer Stromhandel, Netze und Lastmanagement fehlen. Im Modell ist die Welt absichtlich härter: Wind, Sonne, Batterie und danach Gas.
- Der Batteriespeicher startet halb voll und darf mit einem anderen Ladezustand enden. Das ist bei den Jahreswerten klein, aber für einen vollständigen Systemoptimierer müßte der Jahresübergang zyklisch behandelt werden.
- Wasserstoff wird nicht modelliert. Ob man für selten laufende Peaker Wasserstoff wirtschaftlich erzeugen und speichern kann, ist eine eigene Frage. Elektrolyseure skalieren ökonomisch bei sehr geringer Auslastung sehr schlecht; das ist kein Problem, das diese einfache Rechnung lösen kann.

# Quellen

- [AG Energiebilanzen: Energieflussbild Deutschland 2024](https://ag-energiebilanzen.de/wp-content/uploads/EBD24p2_EFBlang_PJ_deutsch.pdf)
- [AG Energiebilanzen: Anwendungsbilanzen](https://ag-energiebilanzen.de/daten-und-fakten/anwendungsbilanzen/)
- [Bundesnetzagentur: Monitoringbericht 2025, Stromverbrauch 2024](https://www.bundesnetzagentur.de/SharedDocs/Downloads/DE/Sachgebiete/Energie/Unternehmen_Institutionen/MonitoringEnergiederZukunft/monitoringbericht_2025.pdf?__blob=publicationFile&v=6)
- [Fraunhofer ISE Energy-Charts: Downloads und Zeitreihen](https://energy-charts.info/downloads.html?c=DE&l=de)
- [strommodell: Quellcode, Datenimport, Szenarien und Modellannahmen](https://github.com/isotopp/strommodell)
