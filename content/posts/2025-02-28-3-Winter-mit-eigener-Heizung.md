---
author: oliof
date: "2025-02-28T13:05:06Z"
feature-img: assets/img/background/Stellventile.jpg
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
2017-2019 komplett saniert: Dach, Dämmung, Strom, Wasser und natürlich
Heizung.

Wie das bei neu gebackenen Hausbesitzern so ist, kollidieren eigene Wünsche zu
Umbaumaßnahmen ("Photovoltaik!", "Wärmepumpe!") mit den Realitäten vor Ort. Und
man hat erstmal das Gefühl verloren, wieviel bewegliches Kapital noch vorhanden
ist, nachdem eine Immobilie angeschafft wurde. Das setzt dem Investitionswillen
eine mentale Bremse.

Die Fakten sind: 

 - Das Haus steht in Reihe und hat relative dicke Aussenwände (60-70cm) in den
   ersten beiden Stockwerken. 
 - In der Rückwand ist Dämmung eingeblasen, das Dach ist teilgedämmt und
   verfügt über einen Kaltboden. Die Fenster sind doppelt verglast.
 - Diese beiden Punkte bedeuten, dass das Haus energetisch große Vorteile
   gegenüber einem freistehenden Einfamilienhaus hat.
 - Die einzigartige Gestaltung der oberen Front bringt dünnere Wände mit sich.
   Beim Schlafzimmer in Kombination mit einer zum Dachfirst geöffneten Decke
   geht ein Gutteil der Vorteile aus den ersten beiden Punkten direkt wieder flöten.
 - Die im Keller verbaute Gasheizung verantwortet die Warmwasserbereitung über
   einen 145l Wassertank und ist Wärmequelle für die Heizung. Die
   Warmwasserleitung erstreckt sich aufgrund baulicher Eigenheiten über ca. 15m,
   bis sie im Bad ankommt.
 - Die Heizung wird über einen Aussentemperaturfühler gesteuert und verfügt über
   eine Internet-Anbindung über eine proprietäre App, die einfache Einstellungen
   ermöglicht und den Gasverbrauch für Warmwasser und Heizung ausweist.
 - Es ist überall (ausser im Keller) Fussbodenheizung in Trockenbauweise verlegt.
   Die Raumthermostate zur Steuerung der Stellventile sind einfache Bimetall-Thermometer
   (laut Hersteller mit einer Auflösung von ca. 0,5 Grad).
 - Das Haus steht dreifach unter Denkmalschutz: Einmal als Teil des
   Altstadt-Ensembles der Stadt Wismar, einmal von aussen, und einmal von
   innen. Das bedeutet: Das Denkmalschutzamt hat eine innige Beziehung zu dem Haus
   und alle nicht rückbaufähigen Baumaßnahmen sind genehmigungspflichtig (bis hin
   zur Abgabe von Materialproben der Wandfarbe).
 - Die Altstadtlage bedeutet neben baulichen Details wie Verschattung durch die
   höheren Nachbarhäuser auch, dass eine Photovoltaikanlage auf dem Dach hohen
   bürokratischen Aufwand bei fraglicher Leistung für das Haus mit sich bringen
   würde. Der Anbieter für Miet-PV-Anlagen, der alle Werbeplätze in den Bereichen
   Energie und Heizungsbau einkauft, hat sich auch entschieden, mich durch Ghosten
   darüber in Kenntnis zu setzen, dass sie in einer Beauftragung durch mich eher
   ein Risiko als eine Chance sehen.

Aus der Faktenlage ergibt sich: Es ist besonders empfehlenswert, ohne
wesentliche bauliche Maßnahmen und Investitionen erste Einsparungen zu
realisieren, die während der Genehmigungsverfahren und der Wartezeit auf einen
tatsächlichen Umbautermin schon greifen.

# Mein Einstieg in die Heizungsoptimierung

Die über die App abrufbaren Energieverbrauchswerte gehen um 12 Monate zurück.
Die Werte werden in einfachen Balkendiagrammen dargestellt und sind zunächst
auch nicht exportierbar. Die 12-Monatsgrenze bedeutet auch, dass ich _diesen_
Dezember nicht mit dem _vorigen_ Dezember vergleichen kann. In Wirklichkeit
vergisst die Internetbox die historischen Werte auch gerne mal, zum Beispiel
wenn die Heizungssteuerung abstürzt, oder die Heizung während der Wartung eine
Stunde stromlos geschaltet wird....


[![](/uploads/2025/02/mybuderus-first-look.png)](/uploads/2025/02/mybuderus-first-look.png)

*Ein Beispiel-Screenshot der MyBuderus App. In einer Wochenansicht Ende Oktober
werden Tagesverbrauchswerte für die letzten beiden Tage angezeigt, darüber
liegt eine Temperaturkurve. Die Tageswerte liegen bei 6 und 26 kWh, die
Aussentemperatur schwankt im Tagesmittel zwischen 12 und 14 Grad Celsius)*

Da die Heizung von Buderus ist, spricht sie sowohl für die Anbindung von
Erweiterungen wie Funkmodul und Mischer, als auch für die Internetbox, das
Protokoll EMS (genauer EMS+). Genau wie alle anderen Hersteller macht Buderus
um dieses Protokoll ein Geheimnis, aber es gibt zu meinem Glück Leute, die das
Protokoll reverse engineered haben und über ein [ESP Modul](https://emsesp.org)
eine Schnittstelle zu Lösungen wie Home Assistant bereitstellen. Weil ich mich
in Sachen Löten und Mikro-Elektronik für "zu schlecht für Heizungssachen"
halte, kaufe ich eine fertige EMS-ESP Box von
[BBQKees](https://bbqkees-electronics.nl/).

Über EMS-ESP bekomme ich anstelle einer ausgewählten Auswahl von Informationen
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
 4. Die Warmwasserbereitung läuft kontinuierlich und verbraucht ca 12 kWh am Tag.

Ändern kann ich auf Anhieb nur die Punkte 2 und 4: 

 - Ich stelle das Heizprogramm auf 19,5 und 19 Grad um. Dadurch sinkt der
   Gasverbrauch für das Heizen um ca. 20%, bei deutlich verbessertem
   Wärmekomfort. 
 - Die Warmwassererzeugung beschränke ich auf zwei Zeitfenster morgens und
   abends, und senke hier den Verbrauch auf 7-8 kWh am Tag (immer noch viel zu
   viel, aber ich nehme erstmal was ich kriegen kann).


[![](/uploads/2025/02/taktung.png)](/uploads/2025/02/taktung.png)

*Verlaufskurve der Temperatur im Heizkreislauf über drei Tage. Man erkennt ein
Sägezahnmuster, das auf Taktung hindeutet. Unterstützt wird die Hypothese durch
einen darüberliegenden Balken in dem mit Gelb angezeigt wird, wenn die Heizung
an ist, und mit grau, wenn sie aus ist. In den ersten 60% der Kurve wechselt
dieser Balken regelmässig zwischen grau und gelb. In den letzten 40% ist die
Sägezahnkurve durch eine weitestgehend gerade Linie ersetzt, und der Balken ist
durchgehend gelb*

Mit den neu eingestellten Werten ergibt sich nun ein neues Problem: Die Heizung
fängt an zu "takten": Dadurch, dass die Raumthermostate niedrig eingestellt
sind ist die Wärmeanforderung so gering, dass die Heizung sich schnell
abschaltet und dann aber bald wieder einschaltet. Diese hohe Taktung ist einer
der Hauptgründe für vorzeitige Alterung und sollte vermieden werden. Es dauert
einige Zeit bis ich darauf komme, einfach die Raumthermostate weiter
aufzudrehen. Dazu später mehr.

Und dann ist plötzlich die Heizperiode vorbei. Ich weiß, dass mein
Warmwasserspeicher tagsüber zu viel Temperatur verliert, die Ursache
hierfür ist mir aber noch nicht klar. Auch dazu später mehr.

# 2023/2024

[![](/uploads/2025/02/beginn-heizperiode-23.png)](/uploads/2025/02/beginn-heizperiode-23.png)

*Im Winter 2023/2024 beginnt die Heizperiode bereits Anfang Oktober. In der
MyBuderus-App sieht man wieder die beginnenden Heiztage, dieses mal bei von 12
auf 9 Grad fallende Aussentemperaturen mit Verbrauchswerten zwischen drei und
15 kWh*

In diesem Winter versuche ich im Wesentlichen, meine Einstellungen aus dem
vorigen Winter zu validieren. Ich verändere wenig an der Steuerung, aber ich
beginne systematisch, das Haus mit Raumthermometern zu versorgen, um besser zu
verstehen, wann und wo Wärme notwendig ist. Im Januar 2024 kommt dann die
Gasabrechnung für das Jahr 2023 und ... unser Gasverbrauch liegt bei ca. 50%
des angenommenen Durchschnittswertes für ein Haus unserer Größe.
Und die Energiemenge liegt deutlich unter der unserer alten, wesentlich kleineren Mietwohnung in Berlin.

Ich mache einen ersten Vorstoß hinsichtlich einer Brauchwasserwärmepumpe, da
übers Jahr gesehen die Warmwasserbereitung 20-25% meines Gasverbrauchs
ausmacht. Da aber Heizungsinstallateure sich ihre Projekte aussuchen können,
werde ich bei verschiedenen Anfragen geghostet, weil eine Sonderimmobilie eben
schwieriger ist, als in einer Neubausiedlung Wärmepumpen in Serie zu verbauen.

Ich lerne aber in Gesprächen mit meinem Schornsteinfeger und dem
Heizungsmenschen, der meine Heizung wartet, dass ich hier in Wismar vermutlich
der einzige bin, der eine historische Datenaufzeichnung über das Verhalten und
den Verbrauch seiner Heizungsanlage hat und auswertet, und daraus bessere
Einstellungen ableitet. Konkret sagt mir ein Heizungsinstallateur etwas
neidisch, dass sie solche Informationen für keine einzige Anlage im Bestand bekommen
können. Ich bin also potentiell ein schwieriger Kunde, weil ich eigene
Vorstellungen und Ideen habe ...

Im Sommer 2024 versuche ich weiter das Thema Wärmepumpe anzugehen, aber auch
hier verlieren Heizungsinstallateure nach ersten Gesprächen das Interesse und
ghosten mich. Nebenbei erweitere ich meine Home Assistant Views im Versuch,
Zusammenhänge besser zu visualisieren.

# 2024/2025

Nachdem ich zwei Winter lang EMS-ESP und Home Assistant im Wesentlichen zur
Beobachtung des Heizungssystems verwendet habe, mache ich mich nun an weitere
Optimierungen des Heizsystems:

 - Ich schliesse eine Handvoll DS18B20 Temperatursensoren an die (aktualisierte)
   EMS-ESP Box an und messe nun Vor- und Rücklauftemperatur an der 
   hydraulischen Weiche sowie die Trinkwassertemperatur bei Zu- und Abfluss des
   Wasserspeichers.
 - Da ich sehe, dass das Energie-Reporting der MyBuderus App und von EMS-ESP
   weit auseinanderliegen, installiere ich noch einen Hall-Effekt-Zähler am Gaszähler.
 - Zunächst korrigiere ich die Einstellung der Zirkulationspumpe, die einfach
   auf Maximum steht, anstatt der notwendigen Förderpumpenhöhe entsprechend
   eingestellt zu sein. Da die Zirkulationspumpe zusätzlich zur Pumpe im Gasboiler
   läuft, kann ich auch die Leistung der internen Pumpe herunterstellen. 
 - Danach korrigiere ich die Einstellung der Raumthermostate. Da das Haus innen
   im Wesentlichen einen offenen Aufbau hat, ist eine raumspezifische Einstellung
   der Heizkreisläufe sowieso nicht wirklich möglich. Also stelle ich überall die
   Raumthermostate auf Maximum, um einen gleichmässigen Volumenstrom über den
   gesamten Heizstrang zu gewährleisten.
 - Dann simuliere ich mithilfe von EMS-ESP ein
   [Raumthermostat](https://docs.emsesp.org/Special-Functions/#remote-thermostats),
   um die mangelhafte Positionierung des Aussentemperaturfühlers durch
   raumtemperaturgeführte Steuerung mit Ausseneinfluss zu kompensieren.

Zum letzten Punkt sei gesagt: Es wäre ein leichtes gewesen, bei der letzten
Sanierung des Hauses ein Raumthermometer mit Anschluss an die Heizung zu
installieren; der EMS Bus funktioniert über ca. 100 Meter Länge. Die
Vorbesitzer haben an dieser Stelle meiner Meinung nach am falschen Ende gespart
und sind vom Heizungsbauer nicht gut beraten worden (das will ich dem
Heizungsbauer nicht vorwerfen, das ist aber eine andere Geschichte).

Zum Gaszähler eine Anmerkung: Ich habe hier festgestellt, dass die MyBuderus Box
zwischen 10% und 25% zu wenig Verbrauch anzeigt, im Vergleich mit den Werten von
EMS-ESP, die ja aus dem gleichen System kommen. Das begründet sich darin, dass
die MyBuderus Box nur alle 90 Sekunden den Mittelwert des Boilers abfragt, und
EMS-ESP alle 20 Sekunden. Kurze Spitzen glättet die MyBuderus Box also weg. Der
Gaszähler hingegen scheint bis zu 10% _zuviel_ Kubikmeter zu zählen; vermutlich
weil bei bestimmten Stellgraden des Magneten am Zähler zum Hall-Effect-Sensor
kein Debounce stattfindet. Ich mache also zusätzlich noch jeden Monat ein Foto
vom Zähler ...

In dieser Zeit beginne ich, meine Heizungserfahrungen im Fediverse zu verbloggen
(zu Finden mit einer Suche nach `from:oliof@social.treehouse.systems #heizung`),
was mit einigem Interesse aufgenommen wird. Dieser und folgende Artikel sollen
die Inhalte zur einfacheren Referenzierung nochmal in aufgearbeiteter Form
wiedergeben.

Ausserdem lese ich einschlägige Foren wie haustechnikdialog und heizungsforum
(keine Links gesetzt, findet ihr selbst) quer, der Ton dort ist mir aber zu
rau, als dass ich mich direkt einbringen wollen würde. Aus diesen Foren und
den Unterhaltungen zu meinen Posts lerne ich unter anderem zu Volumenstrom,
voll geöffneten Heizthermostaten, Heizkurve, alternativen Steuerungsansätzen
wie der Bajorath-Steuerung, und mein Verständnis dessen was ich tue entwickelt
sich von steuern, beobachten, messen, nachsteuern, zu gezielteren Experimenten. 

[![](/uploads/2025/02/ha-panel.png)](/uploads/2025/02/ha-panel.png)

*Ein komplexes Panel aus HomeAssistant, das viele verschiedene Heizungswerte
und Diagramme zeigt: Aktuelle Einstellung des Thermostats, Raumtemperaturen,
Raumeinfluss auf die Vorlauftemperatur, Warmwassertemperatur, Betriebszustände
von Boiler, Warmwasserbereitung, Aussentemperaturkurven,
Heizkreislauftemperaturauswertung, und vieles mehr. Dieses Panel braucht seine
eigene Artikelserie ...*

Ich schaue mir auch andere Optionen zur Heizungssteuerung an, zum Beispiel
[Smart Autotune Thermostat](https://github.com/Alexwijn/SAT), das eine bessere
Steuerung für [Opentherm](https://opentherm.eu) basierte Heizungen insbesondere
bei niedriger Heizlast liefert. Denn das ist bei mir ein Problem: Bei den
mittleren Temperaturen (6-10 Grad) läuft die Heizung zwar auf niedrigster
Modulation, damit wird aber immer noch zuviel Wärme produziert, also zuviel Gas
verbrannt.. Zu dieser Zeit wird SAT Version 4.0 veröffentlicht, dass auch die
Steuerung von EMS basierten Heizungen in einer ersten Fassung unterstützt.
Allerdings müsste ich dafür das RC310 meiner Gasheizung abklemmen, da die
EMS-Boiler anders als OpenTherm-Heizungen nicht so funktionieren, dass man ein
anderes Thermostat als Hauptsteuerung anmelden kann.

Was ich aber durch die Auseinandersetzung mit SAT lerne: Meine Raumthermometer
sind zu träge für effektive Heizungssteuerung und ich ersetze die stabil
funktionierenden, aber langsam aktualisierenden Sonoff
[SNZB-02D](https://www.amazon.de/dp/B0BZCV658S) im Referenzraum durch
[MHO-C401](https://blakadder.com/xiaomi-mho-c401-zigbee/) -- die sprechen mit
einer [alternativen Firmware](https://pvvx.github.io/MHO_C401/) BTHome oder
Zigbee und aktualisieren häufiger als einmal pro Minute.

Als Alternative zu SAT zur Kompensation des hohen Verbrauchs bei Niedriglast
implementiere ich in Home Assistant eine [einfache
Zweipunktsteuerung](https://docs.emsesp.org/tips-and-tricks/#low-load-optimisation-of-a-buderus-gb172-gas-boiler),
um die Heizung bei Erreichen der Raumtemperatur abzuschalten, und bei
Unterschreiten der Raumtemperatur wieder einzuschalten. Dadurch spare ich bei
den Mitteltemperaturen zwischen 30 und 50 Prozent Heizenergie, und selbst bei den
Tiefsttemperaturen in diesem Winter kommen noch 10% Abschaltzeiten dazu. Ob
diese allerdings tatsächlich Energie-Einsparungen in entsprechender Höhe
bedeuten, oder die Heizung in anderen Zeiten gegen heizen muss, sei
dahingestellt.

Mit den niedrigen Energieverbrauchszahlen für die Heizung drängt sich nun das
Thema Warmwasserbereitung in den Vordergrund. Ich beobachte weiterhin 1,2 Grad
Verlust der Wärme im Wasserspeicher pro Stunde. Wenn ich die
Zirkulationsleitung sperre, fällt der Wärmeverlust auf eher den Umständen
entsprechende Wärmeverluste von 0,4 Grad pro Stunde.

[![](/uploads/2025/02/wwwverlust.png)](/uploads/2025/02/wwwverlust.png)

*Ein Temperaturgraph, der einen stetigen Temperaturverlust anzeigt: Erst steil,
dann weniger steil, dann wieder steil. Zum Zeitpunkt des weniger steilen
Temperaturverlusts war die Zirkulationsleitung gesperrt.* 

Hier offenbart sich der Nachteil der EMS-ESP Lösung -- viele der Werte sind
nicht gut dokumentiert. Ich brauche mehrere Anläufe bis ich wirklich die
Entität finde, mit der ich den Betrieb der Zirkulationspumpe effektiv
unterbinden kann. Um Legionellenbildung in der Zirkulationsleitung zu
vermeiden, läuft die Warmwasserzirkulation nun jedes Mal einmal, wenn die
Warmwasseraufbereitung läuft, sobald die Zieltemperatur erreicht wird. Damit
reduziere ich den Kaltwasservorlauf von ca 10l auf im Mittel 5. Ich tausche
effektiv 10% Gesamtjahresenergieaufwand gegen 3% mehr Wasserverbrauch.

# Vorläufiges Fazit

Meine Umwege und Lerngeschenke mal aussen vor gelassen, habe ich mit einem
mittelgut gedämmten Haus und einer nicht ganz so alten Bestandsanlage mit Hilfe
von angekoppelter Visualisuerung und ein paar Digitalthermometern eine
Optimierung meiner Heizung hinbekommen, die gegenüber den Einstellungen bei
Übernahme des Gebäudes bei fast gleichbleibendem (teilweise verbessertem)
Komfort ca. 50% des Energieverbrauchs fürs Heizen einspart. Das ist natürlich
gut, aber es legt die Meßlatte für die Zukunft entsprechend hoch.

Es sei noch angemerkt, dass unterschiedliche bauliche Eigenschaften,
persönliches Behaglichkeitsempfinden, Möglichkeiten baulicher Anpassungen, etc.
absolut dazu führen werden, dass Dritte sich meine Beschreibung durchlesen, und
wenig bis nichts von meinen Maßnahmen direkt anwendbar ist. Wichtig ist aber
die Methodik:

a) Messen  
b) Grösste Verbrauchsmomente identifizieren  
c) Diese Verbrauchsmomente eliminieren oder reduzieren  
d) Messen  
e) Eigenes Verhalten überprüfen und anpassen  
f) Messen  

Die Messbarkeit und Vergleichbarkeit mit vorherigen Einstellungen ist bei einem
trägen System wie der Heizung extrem wichtig, um die Wirksamkeit über ein
persönliches Bauchgefühl hinaus nachweisen zu können. Im folgenden Bild zum
Beispiel kann man den Effekt zweier warmer Körper und eines grossen
Flachbildschirms auf die Raumtemperatur sehen -- die Raumtemperatur geht um
0.25 Grad nach oben. Ist ja auch kein Wunder, schliesslich entspricht die
Wärmeentwicklung dieser drei Dinge in etwa 20% des Wärmebedarfs des fraglichen
Raumes ...

![](/uploads/2025/02/humanheating.png)

*Ausschnitt aus einer Temperaturkurve, die in kurzer Zeit einen steilen Anstieg
der gemessenen Temperatur verzeichnet.*


# 2025 und später

Ich habe endlich einen Heizungsinstallateur, der das Wärmepumpenprojekt mit mir
ernsthaft vorantreibt. Im Moment ist hier noch die Bauplanung und die
Genehmigung durch das Denkmalschutzamt anhängig, wir werden sehen, was daraus
wird.
