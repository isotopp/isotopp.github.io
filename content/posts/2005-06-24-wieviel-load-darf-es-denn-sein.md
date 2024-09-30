---
author: isotopp
date: "2005-06-24T08:47:16Z"
feature-img: assets/img/background/rijksmuseum.jpg
tags:
- computer
- devops
- linux
- unix
- lang_de
title: Wieviel Load darf es denn sein?
---

![](/uploads/load-beispiel.png)

In 
[Wann ist die Serverload zu hoch?](http://webhostingtech.de/2106/677.html)
fragt Reimer: 

> Die Frage, ob ein Serverload von n zu hoch sei, höre ich häufig. 
> Die Antworten sind jedoch ebenso unterschiedlich. 
> So wird häufig die Zahl 1,00 als normaler Wert gehandelt, aber genau so fallen Zahlen wie 5,00 und 8,00 etc.

In Linux und Unix gibt es einige Zahlen, mit denen man die CPU-Auslastung des Systems ausdrücken kann.
Da ist erst einmal die momentane CPU-Auslastung in Prozent, wie sie von `top` und anderen Tools angezeigt wird:

Diese Zahl gibt detailliert Auskunft darüber, wie die CPU *in diesem Moment* ihre Zeit verbringt:

```console
top - 10:49:36 up 11:53,  4 users,  load average: 2.71, 2.33, 2.20
Tasks: 109 total,   3 running, 106 sleeping,   0 stopped,   0 zombie
Cpu(s): 31.4% us,  8.9% sy,  0.0% ni, 47.5% id,  0.0% wa, 10.2% hi,  2.0% si
```

Die Zahl `id` ist die Idle-Zeit, die ungenutzte Zeit der CPU. 
Die anderen Zahlen sagen detailliert, wie die CPU ihre Zeit verbringt: `us` (User-Time) ist Zeit, die im Programm verbracht wird, und `sy` (System-Time) die Zeit, die vom Kernel im Auftrag dieses Programmes verbraucht wird.
`ni` (Nice-Time) ist Zeit, die von herunter priorisierten Prozessen sinnvoll verbraucht wird. 
Alle drei Zeiten zusammen sind sinnvoll genutzte Arbeitszeit. 

`wa` (Wait-Time) ist I/O-Wait, also Zeit, die der Rechner auf das Eintreffen von Daten von der Platte oder dem Netzwerk wartet. 
`hi` und `si` (Hard- und Soft Interrupt) sind Zeiten, die das System mit der Bearbeitung von Interrupts zubringt, also in Gerätetreibern und Timer-Routinen.

Die Loadzahlen geben die mittlere Länge der Run-Queue über eine Minute (erste Zahl), fünf Minuten (zweite Zahl) und 15 Minuten (dritte Zahl) an. 
Die Zahl sagt, wie viele Prozessoren das System im Schnitt auslasten könnte. 
Wenn also die Load 1 ist, ist ein Einprozessorsystem so in etwa ausgelastet, eine Enterprise 10000 mit 64 CPUs in einer Domain ist bei einer Load von 64 gut ausgelastet.

Die Load auf meinem System ist derzeit so:

![](/uploads/load-beispiel.png)

Für Auslastungsabschätzungen ist die blaue Fläche aussagekräftig, denn sie stellt die 15 Minuten-Load dar.
Diese Zahl ist relativ unempfindlich gegen lokale Lastspitzen und daher ein besseres Maß für die Auslastung (im Gegensatz zur Elastizität) des Systems.
Meine Maschine läuft derzeit tagsüber mit einer Load von ca. 0.8, ist also mit einem Prozessor zu etwa 80 % voll.
Zu einzelnen Zeitpunkten (nachts um 4:15 Uhr, wenn das News-Expire läuft), wird die Ideal-Last von 1 deutlich überschritten. 
Das ist zu diesem Zeitpunkt aber nicht schlimm.

Die Spitzenlasten (rote Kurve: 1 Minuten-Load, und davon das Maximum) halten sich außer um 4:15 Uhr im Rahmen, die Maschine kommt nicht nennenswert über Load 2 hinaus. 
Die Kiste hat also nicht mehr allzu viel Reserven, ist aber auch noch nicht überlastet.
