---
author: oliof
date: "2024-11-26T04:05:06Z"
feature-img: assets/img/background/rijksmuseum.jpg
toc: true
tags:
  - lang_de
  - heizung
  - homeassistant
title: "Drei Winter mit eigener Heizung"
---

# 2022

Im November 2022 ziehe ich mit meiner Frau in das Haus ein, dass unser
"Alterswohnsitz" werden soll. Das Gebäude ist aus dem frühen 15. Jahrhundert,
steht innen wie aussen unter Denkmalschutz, aber wurde von den Vorbesitzern
2017-2019 komplett saniert: Dach, Dämmung, Strom, Wasser, und natürlich
Heizung.

Wie das bei neu gebackenen Hausbesitzern so ist, kollidieren eigene
Umbaumaßnahmen ("Photovoltaik!", "Wärmepumpe!") mit den Realitäten vor Ort. Und
man hat erstmal das Gefühl verloren, wieviel bewegliches Kapital noch vorhanden
ist, nachdem eine Immobilie angeschafft wurde.

Die Fakten sind: 

 - Das Haus steht in Reihe und hat relative dicke Aussenwände (60-70cm) in den
   ersten beiden Stockwerken. Die einzigartige Gestaltung der oberen Front
   bringt dünnere Wände mit sich. 
 - In der Rückwand ist Dämmung eingeblasen, das Dach ist teilgedämmt und verfügt
   über einen Kaltboden. Die Fenster sind doppelt verglast.
 - Die im Keller verbaute Gasheizung verantwortet die Warmwasserbereitung über
   einen 145l Wassertank und ist Wärmequelle für die Heizung.
 - Die Heizung wird über einen Aussentemperaturfühler gesteuert und verfügt über
   eine Internet-Anbindung über eine proprietäre App, die einfache Einstellungen
   ermöglicht und den Gasverbrauch für Warmwasser und Heizung ausweist.
 - Es ist überall (ausser im Keller) Fussbodenheizung in Trockenbauweise verlegt.
   Die Raumthermostate zur Steuerung der Stellventile sind einfache Bimetall-
   Thermometer (laut Hersteller mit einer Auflösung von ca. 0,5 Grad).

Die über die App abrufbaren Energieverbrauchswerte gehen um 12 Monate zurück.
Die Werte werden in einfachen Balkendiagrammen dargestellt und sind zunächst
auch nicht exportierbar.

Da die Heizung von Buderus ist, spricht sie sowohl für die Anbindung von
Erweiterungen wie Funkmodul und Mischer, als auch für die Internetbox, das
Protokoll EMS (genauer EMS+). Genau wie alle anderen Hersteller macht Buderus
um dieses Protokoll ein Geheimnis, aber es gibt zu meinem Glück Leute, die das
Protokoll reverse engineered haben und über ein [ESP Modul](https://emsesp.org)
eine Schnittstelle zu Lösungen wie Home Assistant bereitstellen. Weil ich mich
in Sachen Löten und Mikro-Elektronik für "zu schlecht für Heizungssachen"
halte, kaufe ich eine fertige EMS-ESP Box von
[BBQKees](https://bbqkees-electronics.nl/).

über EMS-ESP bekomme ich anstelle einer ausgewählten Auswahl von Informationen
und Einstellungsmöglichkeiten über einhundert Entities zu meiner Heizung
geliefert, die man teilweise auch schreiben/ändern kann. Ich begnüge mich aber
zunächst damit, den Zustand der Heizung zu beobachten. Änderungen an der Konfiguration
nehme ich weiterhin über die offizielle App vor.

Der Winter 2022/2023 ist für mich extrem frustrierend. Ich _weiss_, dass die
Heizung nicht ideal läuft, und ich kann es wenigstens sehen. Relativ schnell
erkenne ich folgende Unzulänglichkeiten:

 1. Der Aussentemperaturfühler sitzt an einer ungünstigen Stelle. Aus der
    denkmalschutzrechtlichen Situation und der Ausrichtung der freistehenden
    Hausseiten ergibt sich, dass der Aussentemperaturfühler im Luftschacht zum
    Keller sitzt und die gemessenen Temperaturen insbesondere im Winter stark
    von den eigentlichen Aussentemperaturen abweichen.
 2. Das Heizsystem ist auf Auslieferunsgszustand mit Nachtabsenkung auf 16 Grad
    und Tagheizung auf 21 Grad gestellt. Das führt mit den naiv auf ca. 20 Grad
    eingestellten Raumthermostaten zu kräftigem Temperaturabfall nachts, den die
    Heizung am Morgen dann versucht aufzuholen.
 3. Die Trockenbauweise der Fussbodenheizung hat unter anderem nicht die 
    Eigenschaft von in Estrich verlegten Heizungen, die Fussbodentemperatur
    lange auf hohem Niveau zu halten.

Ändern kann ich auf Anhieb nur 2. und ich stelle das Heizprogramm auf 19,5 und
19 Grad um. Dadurch sinkt der Gasverbrauch für das Heizen um ca. 20%, bei
deutlich verbessertem Wärmekomfort.

Mit den neu eingestellten Werten ergibt sich nun ein neues Problem: Die Heizung
fängt an zu "takten": Dadurch, dass die Raumthermostate niedrig eingestellt
sind ist die Wärmeabforderung so gering, dass die Heizung sich schnell
abschaltet und dann aber bald wieder einschaltet. Diese hohe Taktung ist einer
der Hauptgründe für vorzeitige Alterung und sollte vermieden werden. Es dauert
einige Zeit bis ich darauf komme, einfach die Raumthermostate weiter
aufzudrehen. Dazu später mehr.

Und dann ist plötzlich die Heizperiode vorbei.

# 2023/2024

In diesem Winter versuche ich im wesentlichen, meine Einstellungen aus dem
vorigen Winter zu validieren. Ich verändere wenig an der Steuerung, aber ich
beginne systematisch, das Haus mit Raumthermometern zu versorgen, um besser zu
verstehen, wann und wo Wärme notwendig ist. im Januar 2024 kommt dann die
Gasabrechnung für das Jahr 2023 und ... unser Gasverbrauch liegt bei ca. 50%
des angenommenen Durchschnittswertes für ein Haus unserer Größe.

Ich mache einen ersten Vorstoß hinsichtlich einer Brauchwasserwärmepumpe, da
übers Jahr gesehen die Warmwasserbereitung 25-20% meines Gasverbrauchs
ausmacht. Da aber Heizungsinstallateure sich ihre Projekte aussuchen können,
werde ich bei verschiedenen Anfragen geghostet, weil eine Sonderimmobilie eben
schwieriger ist, als in einer Neubausiedlung Wärmepumpen in Serie zu verbauen.

Ich lerne aber in Gesprächen mit meinem Schornsteinfeger und dem
Heizungsmenschen, der meine Heizung wartet, dass ich hier in Wismar vermutlich
der einzige bin, der eine historische Datenaufzeichnung über das Verhalten und
den Verbrauch seiner Heizungsanlage hat und auswertet, und daraus bessere
Einstellungen ableitet. Konkret sagt mir ein Heizungsinstallateur etwas
neidisch, dass sie solche Infos für keine einzige Anlage im Bestand bekommen
können. Ich bin also potentiell ein schwieriger Kunde, weil ich eigene
Vorstellungen und Ideen habe ...

Im Sommer 2024 versuche ich weiter das Thema Wärmepumpe anzugehen, aber auch
hier verlieren Heizungsinstallateure nach ersten Gesprächen das Interesse und
ghosten mich.

# 2024/2025

Nachdem ich zwei Winter lang EMS-ESP und Home Assistant im wesentlichen zur
Beobachtung des Heizungssystems verwendet habe, mache ich mich nun an weitere
Optimierungen des Heizsystems:

 - Ich schliesse eine Handvoll DS18B20 Temperatursensoren an die (aktualisierte)
   EMS-ESP Box an und messe nun Vor- und Rücklauftemperatur an der 
   hydraulischen Weiche sowie die Trinkwassertemperatur bei Zu- und Abfluss des
   Wasserspeichers.
 - Zunächst korrigiere ich die Einstellung der Zirkulationspumpe, die einfach
   auf Maximum steht, anstatt der notwendigen Förderpumpenhöhe entsprechend
   eingestellt zu sein. da die Zirkulationspumpe zusätzlich zur Pumpe im Gasboiler
   läuft, kann ich auch die Leistung der internen Pumpe herunterstellen. 
 - Danach korrigiere ich die Einstellung der Raumthermostate. Da das Haus innen
   im wesentlichen einen offenen Aufbau hat, ist eine raumspezifische Einstellung
   der Heizkreisläufe sowieso nicht wirklich möglich. Also stelle ich überall die
   Raumthermostate auf Maximum, um einen gleichmässigen Volumenstrom über den
   gesamten Heizstrang zu gewährleisten.
 - Dann simuliere ich mithilfe von EMS-ESP ein Raumthermostat, um die
   mangelhafte Positionierung des Aussentemperaturfühlers durch
   raumtemperaturgeführte Steuerung mit Ausseneinfluss zu kompensieren.

Zum letzten Punkt sei gesagt: Es wäre ein leichtes gewesen, bei der letzten
Sanierung des Hauses ein Raumthermometer mit Anschluss an die Heizung zu
installieren; der EMS Bus funktioniert über ca. 100 Meter Länge. Die
Vorbesitzer haben an dieser Stelle meiner Meinung nach am falschen Ende gespart
und sind vom Heizungsbauer nicht gut beraten worden (das will ich dem
Heizungsbauer nicht vorwerfen, das ist aber eine andere Geschichte).

Gleichzeitig beginne ich, meine Heizungserfahrungen im Fediverse zu verbloggen,
was mit einigem Interesse aufgenommen wird. Dieser und folgende Artikel sollen
die Inhalte zur einfacheren Referenzierung nochmal in aufgearbeiteter Form
wiedergeben.

Ich schaue mir auch andere Optionen zur Heizungssteuerung an, zum Beispiel
[Smart Autotune Thermostat](https://github.com/Alexwijn/SAT), das eine bessere
Steuerung für [Opentherm](https://opentherm.eu) basierte Heizungen insbesondere
bei niedriger Heizlast liefert. Denn das ist bei mir ein Problem: Bei den
mittleren Temperaturen (6-10 Grad) läuft die Heizung zwar auf niedrigster
Modulation, damit wird aber immer noch zuviel Wärme produziert. Zu dieser Zeit
wird SAT Version 4.0 veröffentlicht, dass auch die Steuerung von EMS basierten
Heizungen in einer ersten Fassung unterstützt. Allerdings müsste ich dafür das
RC310 meiner Gasheizung abklemmen, da die EMS-Boiler anders als
OpenTherm-Heizungen nicht so funktionieren, dass man ein anderes Thermostat als
Hauptsteuerung anmelden kann. Was ich aber durch die Auseinandersetzung mit SAT
lerne: Meine Raumthermometer sind zu träge für effektive Heizungssteuerung und
ich ersetze die stabil funktionierenden Sonoff SN-02ZB im Referenzraum durch
M4-C401N -- die sprechen mit einer alternativen Firmware BTHome oder Zigbee und
aktualisieren häufiger als einmal pro Minute.

Als Alternative zu SAT zur Kompensation des hohen Verbrauchs bei Niedriglast
implementiere ich in Home Assistant eine einfache Zweipunktsteuerung, um die
Heizung bei Erreichen der Raumtemperatur abzuschalten, und bei Unterschreiten
der Raumtemperatur wieder einzuschalten. Dadurch spare ich bei den
Mitteltemperaturen zwischen 30 und 50 Prozent Energie, und selbst bei den
Tiefsttemperaturen in diesem Winter kommen noch 10% Abschaltzeiten dazu. Ob
diese allerdings tatsächlich Energie-Einsparungen in entsprechender Höhe
bedeuten, oder die Heizung in anderen Zeiten gegenan heizen muss, sei
dahingestellt.

Mit den niedrigen Energieverbrauchszahlen für die Heizung drängt sich nun das
Thema Warmwasserbereitung in den Vordergrund. Ich beobachte weiterhin 1,2 Grad
Verlust der Wärme im Wasserspeicher pro Stunde. Wenn ich die
Zirkulationsleitung sperre, fällt der Wärmeverlust auf eher den Umständen
entsprechende Wärmeverluste von 0,4 Grad pro Stunde.

Hier offenbart sich der Nachteil der EMS-ESP Lösung -- viele der Werte sind
nicht gut dokumentiert. Ich brauche mehrere Anläufe bis ich wirklich die
Entität finde, mit der ich den Betrieb der Zirkulationspumpe effektiv
unterbinden kann. Um Legionellenbildung in der Zirkulationsleitung zu
vermeiden, läuft die Warmwasserzirkulation nun jedes Mal einmal, wenn die
Warmwasseraufbereitung läuft, sobald die Zieltemperatur erreicht wird.

# 2025 und später

Ich habe endlich einen Heizungsinstallateur, der das Wärmepumpenprojekt mit mir
ernsthaft vorantreibt. Im Moment ist hier noch die Bauplanung und die
Genehmigung durch das Denkmalschutzamt anhängig, wir werden sehen, was daraus
wird.
