---
author: isotopp
date: "2022-05-02T09:42:00Z"
feature-img: assets/img/background/rijksmuseum.jpg
title: "A solar roof 2"
toc: true
tags:
- lang_en
- netherlands
- energy
- climate
aliases:
  - /2022/05/02/a-solar-roof-2.md.html
---

Zum vorhergehenden Artikel bekam ich einen Leserbrief als Github Issue, das ist hier inhaltlich unverändert veröffentliche,
weil ich glaube, daß es wichtige Informationen und Überlegungen enthält.

Von [@typxxi](https://github.com/typxxi):

> Ich schreibe einmal auf Deutsch.
>
> # Akku Lebensdauer
> 
> Großer Speicher heißt nicht immer gut, weil der LFP Akku dann eher über kalendarische Alterung stirbt,
> und nicht in Folge der Zyklen.
> Ein LFP-Akku schafft um die 3500 bis 6000 Zyklen.
> Das hiesse bei Dir im Idealfall, Du schaffst so 200 Zyklen pro Jahr und damit 17 bis 30 Jahre.
>
> 200 ist schon viel, denn durch die Ost-West-Teilung und Verschattungen wird das im Winter recht schwierig, 
> weil nicht genug hineinkommen wird, da die PV zu klein ist und eine 15 kWh Batterie zu groß bei dem aktuellen Lastprofil von 2022.
> 
> Ich bezweifele, dass Du überhaupt 200 Zyklen bei der 15 kWh voll kriegen wirst, weil Dein Nachtverbrauch im Sommer gering ausfällt - 
> wegen der Kürze der Nacht.
> So bleiben dann nur noch die Übergangs-Jahreszeiten mit längeren Nächten und guten Sonnenerträgen, 
> wo Du bei 5500 kWh und damit grob 15 kWh / Tag landest, was für die Nacht ja aber kaum 50% = 7,5 kWh bedeuten wird.
> Wahrscheinlich ist es so. daß das Haus in 6h auf Grundlast zurückfällt.
> 
> # Grundlast und Strom sparen
> 
> Grundlast ermittelt man am besten beim nächsten Familienurlaub durch Aufschreiben des Zählerstandes bei der Abreise und
> Ablesen bei Rückkehr.
> Der Verbrauch in der Zeit, den Stunden Eurer Abwesenheit ergibt Deine Grundlast.
> 
> Das ist elektrisch nicht ganz korrekt, weil zyklische Verbraucher wie Kühlgeräte mitgezählt werden,
> die der Definition nach kein Teil der Grundlast sind.
> In diesem Fall schon, weil wir die Zyklen für den Akku per Überschlag bestimmen wollen, 
> und wir auch versteckten Verbrauchern durch Messen und Rechnen auf die Spur kommen wollen.
> Denn dort liegt das größte Potential.
> 
> Da reicht es nicht, den Server mit 100W zu schätzen, sondern zu messen und um jedes Watt zu 
> kämpfen (wobei in NL vielleicht nicht, solange jede PV kWh 91 % oder 82 % oder 73 % Wert behält).
> Dann beginnt auch der Kampf um jeden einzelnen eurer Stromsauger, die 24/7 Verbraucher wie eine Fritz!Box
> mit 11 W, oder deren Repeater, die gern einmal 10 W und mehr nehmen.
> 
> Daumenregel: 1 W Verbrauch im 24/7 Betrieb = 9 kWh p.a.
>
> Genauer: 1 Watt x 24 h / Tag x 365 Tage / 1000 = 8,76 kWh,
> oder einfacher: 1 Jahr = 8760 Stunden und in kWh eben 8,8 kWh.
>
> Der Server kostet dann fix 880 kWh/a,
> und da sollte eine Menge zu sparen sein durch eine passende Energiesparplattform, 
> denn gerade da kam ja auch der Erfolg des Raspi her.
> Ein Raspi 4 liegt grob 4 W als unterem Ende, also 96 W Einsparung, 
> nur kann da ja auch ein Fileserver Rack dran hängen, 
> sodass andere Kaliber Sinn machen, nur ist das der 1. Punkt, Strom zu sparen.
> 
> Zum Raspi Verbrauch hier ein guter Beitrag , der die verschiedenen Lastsituation betrachtete:
> [Was kostet mich der Pi 4 an Strom im Jahr?](https://buyzero.de/blogs/news/was-kostet-mich-der-pi-4-an-strom-im-jahr-how-much-does-power-usage-cost-for-the-pi-4)
>
> OK, zuerst bei Verbrauch schauen und sparen, gibt lächerliche Dinge, aber sie bringen was.
> Natürlich in Deutschland mehr als in NL, weil hier die kWh eingespeist mit 8 cent vergütet wird und aktuell so 35 Cent kostet,
> wenn sie in der Nacht gebraucht wird.
> Daher ist der Druck hier größer, Strom zu sparen.
>
> Wer Alexa in Form von Echo Show & Co hat, der kann sich fragen, ob er 1. die Display-Helligkeit braucht, 
> mit der die läuft, oder es mit weniger auch geht.
> 3 Watt sind nirgendwo fixer gespart als da.
> Und noch viel mehr, wenn man die Frage der Helligkeit richtig zu Ende denkt für sich: Display ist immer aus, außer es schallt "Alexa!"
> 
> Die Einstellung gibt es tatsächlich, den Nachtmodus, den wir auf 12:00 bis 11:59 gesetzt haben, 
> sodass der Echo Show 1x pro Tag mittags erwacht und Lebenszeichen von sich gibt.
> Schont das Display (unser 1. Show mit 5 Zoll hat ein leidendes Display) und spart so grob 6 Watt
> , wenn ich mich recht entsinne: 54 kWh p.a. bzw. 18€
>
> Und die Kids lernen das nur so, was wir selber in der Jugend nie lernten,
> denn Wasser und Strom flossen ja immer gut und reichlich und nur die Eltern hatten 1x im Jahr Kopfschmerzen, 
> woher nur dieser Anstieg stammte.
>
> # Batteriebedarf abschätzen
> 
> OK, zurück zur Batterie.
> Ich gehe von sagen wir 220 W Grundlast aus, dann hast Du vereinfacht in 6 Monaten eine Dunkelphase mit 7 h Kernnacht und 3h Abendprogramm,
> wo die Batterie liefern darf.
> 
> Wir nehmen an: 7h x 220 W + 3h x 750W
> 
> Das ist schon eher viel für TV schauen, 120 W bei 65" mit Sky Receiver & Licht an + 50" Monitor & Laptop an = 90W = 1540 + 2250 =3790 Wh
> ergibt einen Bedarf von 4 kWh pro Nacht in den 6 Monaten.
> Im Sommer aber auch weniger, weil die Sonne eher und länger Strom liefern kann, die Batteriephasen kürzer ausfallen.
>
> Kontrollrechnung: die übrigen 14h x 750 W ergäben 10,5 kWh und damit Tagesverbrauch 15 kWh.
>
> OK, damit sollte klar sein, dass die 15 kWh Batterie zu groß sein dürfte, außer die Dinge ändern sich wie angedeutet.
> 
> ## Batteriebedarf mit Wärmepumpe (Splitklima)
> 
> Fangen wir mal damit an, dass Du einen gleitenden Übergang bei der Heizung siehst,
> dann gäbe es da als 1. Weg die Nachrüstung einer Split Klimaanlage als Heizung.
> Für die großen Räume vor allem im EG, wofür Du selber nicht viel Geschick brauchst, 
> weil es nur 1 Kernbohrung braucht und danach nur noch Kabel verbinden und Maulschlüssel nutzen, ggf. mit Drehmomentschlüssel.
> 
> Die Anlage kann dann heizen und im Sommer kühlen, was alle südeuropäischen Länder seit Jahren nutzen,
> weil deren Heizlast geringer ist.
> Der Wirkungsgrad ist sehr hoch, weil aus der Außenluft die Energie gezogen und direkt nebenan im Raum abgegeben wird
> ohne 20 m Heizungsleitungen und Verluste.
> 
> Wir haben 5,4 kWh große Mitsubishi nachgerüstet - im Altbau der 70er, der aber schon damals mit über 10 cm Wand und Decke gedämmt war.
> Die Kosten liegen incl. WLAN und aller Quick Connect Leitungen bei circa. 1100 € - 
> wenn Du hier jemanden beauftragst, dann sind es 3000 €, sodass Du siehst, wie sehr sich da das lohnt.
> 
> Nimm aber eine Marke.
> In der Regel reicht aber das Basisgerät, denn Du kannst da viel Geld in Design investieren mit begrenztem Nutzen, 
> denn für 500 € mehr bekommst Du die gleiche Anlage, die aber per Fernbedienung den Luftstrom nicht nur vertikal,
> sondern auch seitlich lenken kann. 
> Wer das braucht, bitte, aber 1600 € heben die Hemmschwelle, so etwas mal zu probieren.
> 
> Und: große Räume eignen sich besser, weil 1. Wärme aufsteigt,
> und die Anlagenkosten sich nicht linear verteilen, also kleinere 2,2 kW Anlage für 4 0% zu haben ist.
> Sie kostet stattdessen dann 800 € statt 1100 €, macht also kaum Sinn.
> 
> Von daher Split-Klimaanlagen immer größer auslegen als der Heizbedarf wäre, weil Du immer noch mit Tür auf das Haus als solches mit wärmen kannst,
> besonders bei Euren wohl vielen Etagen.
>
> Na klar, für 500 € mehr bekommst Du auch noch einen kleinen Bonus bei der Effizienz, 
> denn statt COP 4,1 gibt es dann vielleicht 4,4 - also 1 kWh elektrisch bringt 4,1 oder 4,4 kWh Wärme.
> Du brauchst aber lange, um mit der 10 % höheren Effizienz die 500 € reinzuholen, 
> da hast Du mehr von vielen kleinere Anlagen. 
> 
> Bei Multisplit-Anlagen muss man wissen, dass Du da auch 2 oder 3 Innenräume heizen kannst,
> wobei jeweils 2 oder 3 Innengeräte an 1 Außengerät angeschlossen werden.
> Funktioniert gut, kostet aber auch und hat Schwächen, wenn ein Raum kalt und der andere auf Vollgas / Vollstrom laufen soll.
> Mag sich bei benachbarten Räumen lohnen.
> 
> Bei Quickconnect musst Du wissen, dass sich das Kühlmittel im Außengerät befindet. 
> Mit der Quickconnect Leitung kannst Du die beiden Geräteteile selber verbinden und in Betrieb nehmen - außer Du lebst in Deutschland,
> da brauchst Du den Klimaschein.
> In Italien war das für uns nicht der Fall.
> 
> Es muss Dank Quickconnect kein Vacuum erzeugt oder kontrolliert werden, solange Du mit 7 m Rohrlänge klar kommst.
> denn für 7m packt Mitsubisih Kältemittel in das Außengerät.
> Ansonsten muss der Klimatechniker kommen und nachfüllen.
> 
> Lange Vorgeschichte, um zu zeigen, dass man auch elektrisch zuheizen kann,
> oder gar mit 3 Anlagen a 5,4 kW den alten Heizkessel an Heizleistung mit 16 kW erreichen kann.
> 
> An den sehr kalten Tagen, die Du an 2 Händen zählen kannst, wenn es unter 5° C geht,
> verliert die WP ihren Wirkungsgrad und Arbeitsleistung, da sollte dann was helfen?
> Gas heizen und mit elektrischem Heizlüfter.
>
> Das alles nur, um zu sagen, dass diese Heizung sinnvoll sein kann,
> und dann auch teils von Batteriestrom profitieren kann.
> Das ist vor allen Dingen in der Übergangszeit sinnvoll,
> wenn morgens die Sonne noch weg ist oder abends schon wieder.
> Jedoch braucht eine 5,4 kW Heizung mit COP 4 maximal Strom von 1,6 kW - 
> wenn Du bei 12 ° heim kommst und das Ding auf 28° drehst und mit voller Drehzahl Wärme brauchst.
> 
> Die 1,6 kW machen es Dir auch leicht, dieses Gerät nachträglich an eine normale Unterputzdose in den Stromkreis einzubinden.
> Damit will ich sagen, dass hier eine 5,4 kW Anlage im Winter einen Wohnraum konstant auf 23° C hielt.
> Der Verbrauch lag dabei bei 4 kWh am Tag, in der Übergangszeit weniger: 2 bis 3 kWh.
> 
> Für die Rechnung ist das wichtig, ja der Akku auch morgens noch voll sein sollte, wenn man die Nachtzeit von Batterie versorgen will.
> Von den 2 bis 3 kWh entfallen dann vielleicht 40 % auf die Nacht oder weniger, wenn man Nachtabsenkung der Temperatur in Kauf nimmt.
>Nimm einfach mal 1,3 kWh für die Nacht je Gerät und schwups bist Du bei 3 Geräten bei 4 kWh.
>
> Mit den 4 kWh Alltagsverbrauch und mit 4 kWh fürs Heizen per Split Klima in 3 Räumen und mehr landest Du bei 8 kWh Bedarf,
> und irgendwie ist der 15 kWh Akku immer noch verdammt groß, liegen also 3600 € Kapital brach herum.
> 
> Daher der Rat, das ganze mal mit 10 kWh zu denken, die Dir vielleicht 2400 € sparen, die reichen, um dafür Splitklima zu kaufen.
>
> ## Wasserbereitung
>
> Jetzt mag noch die Frage kommen, wie es mit dem warmen Wasser wäre. 
> Genau, das ist dann auch so eine noch einfachere Sache.
> 
> Es gibt vor allen in Südeuropa Monoblockanlagen, die meist in einem wärmeren Raum aufgestellt werden.
> In Frage kommen Heizungskeller oder ähnlich.
> Die Anlage zieht dort aus der Umluft die Wärme ziehen, und heizt einen 100 Liter Wasserbehälter auf.
> Diese werden an nur 2 Rohren in den bestehen Warmwasserkreislauf eingebunden, was Du auch selber machen kannst.
> 
> Keine weitere Veränderung erforderlich, alles beim Alten.
> 
> Ein solches Gerät hat Abmessungen von etwa 50 x 50 cm x 120 cm Höhe, und wird meist an die Wand gehängt, in Südeuropa auch gern in die Küche.
> Entsprechend gestalten die Anbieter aus Südeuropa das auch gern mal wie ein Interieur Möbel,
> schönere Oberfläche und Bedienung als die typischen Heizungen.
> 
> Der Preis liegt um die 900-1100 € von Ariston, in der einfachsten Variante.
> Ich rate Dir aber sofort, da genau zu schauen, denn die kommen ohne WLAN und SMART,
> haben mitunter aber eine Steuerleitung, sodass Du bei PV Überschuss eben auch das Wasser warm machen kannst.
> 
> Lohnt sich alles für NL heute nicht so sehr , aber mit jedem Jahr weiter un 9% weniger Wert der eingespeisten kWh um so eher und mehr.
> 
> Für die Rechnung nimmst Du einfach an:
> Du hast da 100 Liter, die mit 15° C reinkommen und auf 55°C erwärmt werden müssen. 40° C x 1,1 Wh/ °C und 100 Liter 
> enden bei Wärmebedarf von 4400 Wh, wobei so eine Ariston Nuos Primo mit COP 3 als Wirkungsgrad kommt.
> Das bedeutet, Du brauchst 1,5 kWh.
> 
> Ist die Frage aber, wie viel kWh Du morgens brauchst, bevor die Sonne aufgeht, um den Behälter aufzuheizen.
> Da sind die 40° C ja selten fällig, weil nicht immer abends noch geduscht worden ist und 100 Liter 15° Wasser nachgefüllt worden sind,
> sondern Du mit 100 Liter 40° C warmen Wasser aus der Nacht kommst und dann nur noch 1/3 der Heizlast hättest, eben 15° C erwärmen 
> statt 40 °C.
> 
> Der Strombedarf sinkt dann auf 0,600 kWh wären.
> Und damit ist 3/4 des Jahres, wenn im Akku auch Strom sein wird, der Akku mit 9 kWh ausgelastet.
> Im Sommer noch weniger, im Spätherbst und frühen Frühling mehr.
>
> ## Auto
> 
> Ach ja, der Elektroflitzer soll ja auch eher tagsüber geladen werden als mit Verlusten aus der Batterie in die Batterie,
> sodass man dessen Bedarf als Ausnahmen vergessen kann.
> Er ist im Übrigen die viel billigere Batterie, stell Dir mal einen 50 kWh PKW vor, 
> der aus den HUAWEI 15 kWh Speichern gebaut würde, denn dann wären das schon 25000 €,
> also ist der günstigste Speicher Dein Auto.
> 
> Selbst in Deutschland wird Vehicle 2 Load als Rückspeisen ins Haus bzw. als Vehicle 2 Grid ins Netz kommen.
> Zuerst VW, die sich gegen die Stromlobby durchsetzten. 
> Von daher baue den Akku nicht zu groß, wenn in 1 Jahr VW und dann andere Vehicle 2 Load Fahrzeuge liefern.
> 
> Ein Ford F150 Lightning Truck kann ein ganzes Haus versorgen, weil bis zu 9 kW aus dem Fahrzeug gehen können, wobei klares Negativbeispiel.
> Ein MG4 in Golf Größe kommt in der Basis mit einer 51 kWh LFP battery und einer 2,3 kW Leistung Vehicle 2 Load (kein 2 Grid).
> Der MG4 Akku mit 3500 Zyklen und mehr kann dann die Hausbatterie ersetzen.
> Noch ein Grund mehr, eine NICHT ZU GROSSE HAUSBATTERIE zu kaufen.
> (Nebenrechnung: 300 km WLTP hieße bei 3500 Zyklen aber eine Akkulebensdauer von 1.250.000 km,
> die das AUto nie fahren wird.
> Der Akku hält also länger als das Auto mechanisch.
> 
> # Überschüsse handhaben
> 
> Nun der Punkt, der ebenso wichtig ist: Wenn Überschuss, dann bestimmte Verbraucher mit Überschuss Strom betreiben
>
> Das nennt sich bei Auto und Wallbox Überschussladen.
> Die Softwarelösung heißt wohl EVCC, wenn Du nicht eine teure, an den Wechselrichterhersteller gebundene Lösung kaufst.
> Nur läuft die dann meist nur mit einer Huawei Wallbox, so es die gibt.
> 
> Der nächste Verbraucher wäre ein Problem, von daher schau Dir EVCC an, die einen Raspi braucht oder einen SonOff ihost,
> der ein lokales Smarthome ohne China Cloud für aktuell noch heute 55 € bietet.
> Also eine grob Pi 3 / Pi 4 vergleichbare Leistung mit einer Docker Einbindung und Zigbee, WLAN und BT an Bord, 
> sowie anderem Zeug. 
> Heute noch im Release Angebot, was seit März gelaufen ist.
> Ansonsten wohl etwas teurer, aber günstiger als Pi 4 neu von ebay.
> 
> EVCC erlaubt Dir das Laden von einem oder mehreren Fahrzeugen bzw. Verbrauchern mit Regeln 
> "Wie lade nur das, was an Überschussstrom sonst ins Netz ginge (die Fahrzeuge können meist erst ab 6A)"
> und das auch intelligent.
> Denn neben dem reinen grünen Überschuss gibt es noch andere Ladeprogramme, um das Fahrzeug schnell zu laden
> auch mit Strom vom Netz.
>
> Und Deine Splitklima, ggf. aber auf alle Fälle die Warmwasser-Wärmepumpe sind ein Super Überschussverbraucher 
>
> Dieser Energymaster ist die Zentrale, denn nur diese Überschussverbraucher lassen sich wirklich gut mit Überschuss betreiben. 
> Eine Spülmaschine oder Waschmaschine nur und erst dann ein zuschalten, wenn der Strom reicht, 
> ist im Alltag eher ein Alptraum in der Steuerung und muss man bzw. alle in der Familie wollen.
> Abends nach Haus und die Maschine ist nicht gelaufen, da kippt die Stimmung dann fix. 
> 
> Von daher schau mal EVCC an, ist Open Source und bestimmte Funktionen brauchen einen Sponsor,
> was der Wallbox Hersteller übernommen haben kann, sodass alle Produkte des Herstellers das gratis können - 
> oder kostet Dich maximal $2 p.a. und ist Open Source made in Germany mit sehr lebendiger Community.
> Du findest die Site auf [evcc.io](evcc.io).
>
> # Steuerung und Modellierung 
>
> War es das ?
>
> All das ist die alte, händische Art so was anzudenken und zu durchplanen.
> Es hätte Dir vor 1 Jahr vielleicht auch mehr geholfen, das so zu finden, aber sei es drum.
> Da auf dem Blog nichts Neues stand, sah es erst einmal nach dem Stand der Dinge aus,
> wo sich ein Akku kaum rentiert, wenn man von 1 kWh eingespeist morgen oder im Dezember noch 0,91 kWh zurück bekommt.
> 
> Von daher mag das jetzt Sinn machen und Dich auch schon länger fragen lassen,
> was noch geht und wie in welcher Reihenfolge.
> Nur der Rat, dass Du lieber einen eng bemessenen Hausakku kaufst,
> und im Hinterkopf hast, dass die PKW das künftig von Haus mitbringen werden,
> und zwar vor 2030, denn VW ist ein Big Player wie ein F150 Lightning in den USA bei Trucks.
>
> All das hier ist die alte, einfache Art, weil jeder der Dein Blog dazu liest, dem auch folgen kann.
> Willst Du mehr und genauer, also auch PV Anlage planen und vergleichen können,
> dann kannst Du sozusagen Dein Haus an Deinem Ort einfach in 3 D planen.
> Deine Anlage, wie sie ist, nachbauen und passend dazu Deine Verbrauchsprofile hinterlegen, 
> wann welcher Verbraucher am Tag oder in der Woche läuft und was an Strom braucht,
> oder aber Du nimmst die 5500 kWh und lässt die für einen 3 Personenhaushalt mit 1 auf Achse und der Rest zu Haus runterbrechen.
>
> Diese Software errechnet dann auf Basis der Einstrahlungsdaten an Deinem Ort die Erträge je Minute aus der PV,
> und stellt dem ggü. die Verbräuche , sodass das System für jede Minute eine Bilanz erstellt und das ganze zu einem Jahresergebnis.
> 
> Da kannst Du dann alternative Module simulieren, alternativ Belegungen und Wechselrichter, ebenso Batteriegrößen,
> DIY Akkus und die Wärmepumpe bzw. Dein Auto elektrisch fahren lassen mit wöchentlich 500 km und Ladeprofilen und Zeiten.
>
> Das findest Du auf bei Valentin Software in Berlin - gratis als 30 Tage Demo, 
> wobei Du die Kundenprofil-Auswertungen halt nicht drucken kannst, aber mit Screenshot kriegst Du alles auch so.
> Alle Versionen gibt es dort zum Download und laufen prima.
> 
> Der Anbieter hat auch alle Daten der Module und Wechselrichter hinterlegt.
> Du sparst Dir das fehlerträchtige Abtippen der Specs, die das System braucht, um zu simulieren.
> Du mussst nur Modul Daten etc. auswählen, und dann sollte das System signalisieren,
> dass alle Komponenten passen oder woran es scheitert.
>
> Das Ergebnis der Simulation ist super, die Daten sind realistisch, also die Planung zuverlässig, 
> die Modul, Batterie, Wechselrichterdaten werden teils von den Herstellern eingepflegt und laufend aktualisiert,
> weshalb alles von deren Servern zur Laufzeit kommt.
> Ist dann Dein Wechselrichter dabei mit neuen Specs oder verbesserter Version,
> dann wirst Du gefragt, mit welchem Modell Du weiter arbeiten willst.
>
> Die Planung selber ist da schon was anderes.
> Man braucht, um sich da einzufinden, aber am Ende geht es oder Du kennst Leute und kannst fragen.
> Von daher halt der Hinweis, dass Du PV SOL in der PREMIUM Version.
> Nimm nicht die kleineren, sondern gleich das Profi-Tool,
> das Du sehr gut nutzen kannst, um Dein System von heute zukunftssicher zu gestalten durch u.a. Simulation.
>
> # Wechselrichter brauchen Strom
> 
> Lange Geschichte, aber ich denke, dass Du was daraus machen wirst.
> 
> Dazu hast Du noch bedingte Reserveflächen, die auf den Garagen / Carport etc.
> Je weniger die eingespeiste kWh wert sein wird, je eher wirst Du mehr Leistung auf dem Dach haben wollen.
> Und von daher hast Du jetzt Zeit, die Zukunft so zu planen, dass Du Dir ad hoc auch nix verbaust wie mit einem teuren, zu großen Speicher, denn:
> 
> im Winter wirst Du den ausschalten, 
> weil ein Hybrid Wechselrichter dann auch fix 70 oder über 120 Watt in der Nacht jede Stunde aus der Batterie ziehen kann,
> um nur bereit zu sein, Strom zu erzeugen.
> 
> Jetzt passiert nix dergleichen, denn die PV Module liefern keinen Strom und Dein Wechselrichter legt sich schlafen.
> Kommt die Batterie, dann will der aber 24/7 seinen Anteil zum Betrieb und der kann hoch sein:
> höher als Dir lieb ist, weshalb dann viele gerade mit so einer eingeschränkten Ost -Westleistung wie bei Dir eben die Kiste im Winter aussschalten,
> weil der Überschuss zum Laden zu gering sein wird.
> 
> Daran denken die wenigsten und fallen nachher aus allen Wolken,
> wenn die Monatsauswertungen plötzlich hohe Verluste zeigen wie 200 kWh für den Betrieb des Akkus im Monat,
> weil ja der Verbrauch des Wechselrichters nur durch den Akku provoziert wird.
> Ohne Akku wären die nicht da.
>
> # Schluß
> 
> Gutes Studium und Gelingen - ich schaue mal bei Gelegenheit vorbei und wenn Fragen sind,
> dann kann ich vielleicht mit Antworten helfen oder sagen, wo Du die Antworten findest. 
> 
> Klar, das macht alles heute noch nicht wirklich Sinn in NL,
> weil eben 91 % oder 82 % jeder eingespeisten kWh gratis zurückkommen,
> wann immer Du die im Jahr brauchen könntest.
> Aber mit jedem Jahr weiter kommst Du deutschen Verhältnissen näher, wo eben die kWh vom Netz das 4,x fache dessen kostet,
> was Deine eben eingespeiste kWh bringt, von daher endet das in derselben Richtung früher oder später.
