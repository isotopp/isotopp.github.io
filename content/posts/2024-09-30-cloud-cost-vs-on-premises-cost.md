---
author: isotopp
date: "2024-09-30T04:05:06Z"
feature-img: assets/img/background/rijksmuseum.jpg
toc: true
tags:
- lang_de
- cloud
- data center
title: "Cloud Cost vs. On-Premises Cost"
---

Ich wurde gefragt:

> Hast Du eine Idee, wie ich seriös die Kosten für Cloud, reguläres und selbst Hosting vergleichen kann?

Seriös nicht, weil das ein Problem mit mehreren Schichten ist und keine dieser Schichten irgendwie schön ist.

## Rahmenbedingungen

Der Haupttreiber bei der ganzen Sache ist die simple Tatsache, dass wir immer mehr Transistoren auf einen Chip bekommen.
Der Chip wird zwar nicht mehr schneller, weil bei circa 3 GHz Takt Dauerleistung Schluss ist,
aber weil die Strukturen immer noch kleiner werden bekommen wir immer mehr Cores und Cache.

![](/uploads/2024/09/01-cloud-on-prem.png)

*Fortschritte bei der Chipentwicklung über Zeit. 
Die y-Ache ist logarithmisch. Wir sehen, wie die Anzahl der Transistoren pro Chip ungebrochen hoch geht.
Circa 2005 haben wir jedoch ein Taktlimit erreicht – bei 3 GHz Dauertakt ist bei Silizium Schluss.
Die Performance pro Core geht noch durch Verlagerung gewisser Funktionen in Hardware 
und effizientere Prozessor-Architekturen langsam weiter hoch.
Stattdessen steigt seit 2005 die Anzahl der Cores pro Chip an – die 
Gewinne an Transistoren gehen also an mehr Cores, nicht in schnellere Cores.
Zugleich sinkt der Energieverbrauch pro Core, während der Energieverbrauch pro Chip bei 100-200W stagniert.*

Und oft auch Features, die die meiste Zeit gar nicht gebraucht werden,
sodass Teile des Chips die meiste Zeit ausgeschaltet sind, um Energie zu sparen.
Denn Energieverbrauch erzeugt Abwärme, und die Abwärme setzt dem Chip ein (weiches) Leistungslimit.
Wenn wir also Dinge, die viel Energie verbrauchen (die FPU und die Vektoreinheiten) nicht verwenden,
dann können wir den Takt bei dem Teil des Chips, der benutzt wird hochdrehen, 
und bekommen so ein wenig mehr Leistung für viel mehr Energieverbrauch und Abwärme.

Prozessoren von 2024 haben auf einem Chip bis zu 128 oder gar 192 Cores und die doppelte Anzahl von vCores (Threads).

## Hardwarekosten

Gehen wir 5 Jahre zurück, kommen wir zu konkreten Kosten.

Die kleinsten sinnvoll kaufbaren Intel Xeon CPUs von 2019 wären die 
[Xeon Silver 4110](https://www.intel.com/content/www/us/en/products/sku/123547/intel-xeon-silver-4110-processor-11m-cache-2-10-ghz/specifications.html)
gewesen. 
Auf einer typischen Blade von Dell oder HP gibt uns das 2 Sockets, 16 Cores mit 32 Hyperthreads, 
128 GB RAM (8 GB RAM pro Core), eine lokale Micron 1.92 TB NVME mit 800k IOPS,
und einen dedizierten 10 GBit/s Port direkt zum Top-of-Rack Switch (luxuriöse 625 MBit/s pro Core).  

Was ist das für eine Rechnung?

Ein System muss, damit es funktioniert, balanciert sein. 
Manche Workloads sind selbst unbalanciert und brauchen exzessiv CPU oder exzessiv Speicher oder Netz.
Aber die meisten Enterprise-Anwendungen brauchen pro Core mit 3 GHz 4-8 GB RAM und 100-400 MBit/s Netz.
Wenn wir unsere Hardware so proportionieren, dann können wir recht sicher sein, dass sie vielseitig einsetzbar ist.

Preislich kommen wir mit solchen schwachbrüstigen Klein-Blades auf Kosten von etwa 120-150 Euro im Monat, 
für eine geplante Lebensdauer von fünf Jahren. Das ist der Kaufpreis für die Blade, 
Platz im Rechenzentrum und anteilig Strom, Netzwerk und Blade-Chassis.

Die Blade ist dann noch nicht inventarisiert, noch nicht an, 
nichts installiert ein Betriebssystem oder die Anwendung – das ist Arbeit, und die rechnen wir hier nicht mit rein.

## AWS Kosten im Vergleich

Wir können das mit einer AWS m5.8xl vergleichen: 32 vCPU, 128 GB, 10 GBit/s und kein lokaler Speicher (EBS kostet extra).
Die kostet 1232 USD/Monat, also schmale 10x mehr, plus Netzwerk, plus EBS.

Alternativ schauen wir auf eine AWS i3.4xl: 16 vCPU, 122 GB Speicher, und zwei lokale 1.92 TB NVME, 
sowie ein 10 GBit/s Link. 
Die kostet 990 USD/Monat, plus Netz, aber wir haben zwei lokale Volumes.

Anders als unsere Blade im Rechenzentrum ist diese VM bereits Teil einer gemanagten Umgebung, 
wir können sie also provisionieren, und haben sie im Inventory.

## Cloud vs. Baremetal On-Premises

Ein früherer Arbeitgeber von mir hatte circa 50.000 von solchen Blades.
Die meisten davon waren die kleinen 4110, und einige größere Einheiten mit [Dual Gold 6132](https://ark.intel.com/content/www/us/en/ark/products/123541/intel-xeon-gold-6132-processor-19-25m-cache-2-60-ghz.html) an drei Standorten.
In Summe mag das auf etwa 1.000.000 Cores kommen, und dazu passend ausbalanciert Speicher.

Bei diesem Arbeitgeber hat man um 2010 herum angefangen, Software zu schreiben, um diese Hardware zu verwalten,
automatisch zu provisionieren und Betriebssystem-Images und Anwendungen automatisch zu verteilen.
Ich kann mir also ein Script schreiben, das 200 Blades vom Typ x in RZ y anfordert.
Ich bekomme diese dann binnen 20 Minuten automatisch provisioniert, meiner Team-Abrechnung belastet,
und mit Partitionierung, Betriebssystem und Puppet-Klassen laufend zugewiesen.
Die ssh-Keys meines Teams erlauben mir einen Zugriff.

In 2019 waren wir soweit, dass kein Rechner eine Uptime von mehr als 90 Tagen hatte.
Das heißt, alle Teams hatten ihre Software so verpackt, 
dass sie vollkommen ohne manuelle Eingriffe installiert werden konnte,
keine Single Points of Failures existierten und alle produktiven Maschinen reihum reinstalliert werden konnten.
Dadurch haben wir Betriebssystem-Images und Anwendungen laufend neu deployed und aktuell gehalten.

Automatisierung hat natürlich auch vorher schon funktioniert, 
aber für die Vollautomatisierung war Arbeit und Druck notwendig.
Ich habe in
[This is not a Drill, this is just Tuesday]({{< relref "2023-02-18-this-is-not-a-drill.md" >}}) 
ausführlicher dazu geschreiben.

Jedenfalls war viel Arbeit und es waren viele Leute notwendig,
denn ein Produkt, das so etwas für die lokale Firma passend auf Bare Metal Hardware macht, kann man nicht kaufen,
und schon gar nicht herstellerunabhängig.
Man muss also auf die Kosten für Hardware noch die Kosten für die Entwicklung dieser Stücke Software drauf rechnen.

Am Ende hat sich dieser Arbeitgeber dafür entscheiden, seine Installation in die Cloud zu verschieben,
weil Operations dann jemand anderes Problem sind.
Das geht natürlich nicht von heute auf morgen,
Und soweit ich weiß, betreibt man auch jetzt, 5 Jahre später,
noch on-premises und Cloud parallel, und bezahlt beides.

Würde das Projekt abgeschlossen sein, wäre man theoretisch nicht nur das Core.Infrastructure Team los,
sondern auch das Staffing für dieses Team.
Denn Menschen zu finden,
die mit Hardware umgehen können und einen sinnvollen Operations Mindset haben wird zunehmend schwieriger.
Entsprechend war das für das Management ein totaler No-Brainer, selbst bei einem Kostenfaktor von 10x.

Denn der Aufwand, solche Personen zu finden, zu halten und so zu steuern, 
dass sie dann sinnvolle Automation bauen, ist groß.
Das sind nicht nur Geldkosten, sondern schlimmer, das ist auch kognitive Load auf der Organisation.

## Es wird nicht einfacher

Allgemeiner gesagt: 
Damit Du in 2024 eine Firma haben kannst, die eigene Hardware am Start hat,
muss Deine Firma erst einmal eine Mindestgröße haben.

Idealerweise kauft man aus Kostengründen immer die zweigrößte Sorte Rechner, die zu haben ist.
Man kann das genau ausrechnen und dann ist es manchmal die zweigrößte und manchmal die drittgrößte Sorte CPU,
die hergestellt wird, bei der der Bumms pro Dollar am Besten ist.

Das heißt, man hat dann etwas mit – sagen wir – 128 Cores pro Socket und Single Socket.
Bei 8 GB pro Core und 100-300 MBit/s pro Core landen wir bei
128 * 8 GB = 1024 GB = 1 TB RAM und bei 128 * 200 Mbit/s = 25600 MBit/s = 25 GBit/s.
Bei einer Dual Socket entsprechend das Doppelte, also 2 TB RAM und 2x 25 MBit/s oder ein 100 GBit/s Interface.

Die typische Java-Anwendung kann man in der Regel so bis 8 Cores und 16 GB RAM skalieren, 
danach haucht die JVM ihr Leben aus.
Wir haben also 16-32 Instanzen (Anwendungen) pro Socket.
Die meisten werden nicht am oberen Ende der Skala sein, also rechnen wir eher 50-100 Anwendungen pro Socket.

Für viele Firmen ist also eine einzige Maschine schon zu groß. 
Wir wollen aber aus Gründen der Verfügbarkeit nicht eine Maschine haben, sondern mindestens drei.

Wenn eine solche Maschine aus welchen Gründen umfällt oder neu starten muss, 
dann sind mal eben 100 Anwendungen offline – wir haben also ein Blast Radius Problem.

Wir können dagegen in der Public Cloud VMs in der passenden Größe kaufen, 
und weil der Cloud-Anbieter viele solcher Maschinen hat, wird jede unserer VMs "anti-affin" scheduled.
Das heißt, der Cloud-Anbieter versucht unsere Anwendungen über so viele Stücke Hardware als möglich zu verteilen,
und uns mit so vielen anderen Kunden als möglich auf einer Kiste zu hosten.
Wenn dann ein Stück Hardware umfällt, verliert jeder Kunde eine Instanz, aber nicht ein Kunde alle.

## On-Premises ist auch nicht unabhängig

Zurück On-Premises: Wir müssen jetzt aus unserer Hardware Stücke in passender Größe schneiden, 
um sie in Pods oder virtuelle Maschinen zu verwandeln.
Für virtuelle Maschinen haben wir die Wahl zwischen VMware und Openstack.
Es gibt noch andere Lösungen, aber für die finden wir in der Regel keine Menschen mit Kenntnissen zur Anstellung.
Wir haben also die Wahl zwischen lebenslanger Schuldknechtschaft zu Broadcom, 
oder wir müssen 3 oder mehr Spezialisten einstellen, die dem Openstack hinterher wischen,
wenn es mal wieder die Windel voll gemacht hat. 

Nun können wir VMs provisionieren, aber wir müssen aus den VMs noch immer Dienste machen.
Dort wiederholt sich das Spiel von der VM-Ebene.
Am Ende haben wir eine unserer Firmengröße angemesene "Core Infra" Abteilung, die unsere On-Prem Cloud betreibt.
Das sind dann vielleicht keine 50.000 Maschinen mit zusamnen 1.000.000.Cores mehr,
sondern nur noch 8000 Maschinen mit 1.000.000 Cores, aber es sind trotzdem 10-30 Leute, die dafür da sind, 
darauf Services zu implementieren.

Wir haben also die Wahl, erschreckend kostengünstige Hardware, die viel zu groß für alles ist, zu kaufen.
Dann müssen wir Leute finden und anzustellen.
Diese sind dann vielleicht in der Lage (oder vielleicht auch nicht), daraus eine brauchbare Plattform zu bauen.

Alternativ können wir dem Bezos Kohle in den Rachen schaufel.

Die Antwort ist für wirklich jede Firma mit weniger als einer dreistelligen Anzahl von Rechnern absolut offensichtlich,
und besteht nicht darin, Hardware zu kaufen.
Das Staffing, die lokale Betriebs-Entwicklung und alles, was damit einher geht, will sich niemand ans Bein binden.
Sobald man dann größer ist, ist es teuer, aber zu spät.

Folgerichtig findet man auch immer weniger Leute, die sich mit solchem lokalen Betrieb auskennen,
und Dir so etwas bauen können.
Dagegen kannst Du Dich mit Leuten tot werfen, die Dir Instanzen bei AWS klicken und für 60k-75k im Jahr zu Dir kommen.

## Die ganze Logik-Kaskade

- Wir haben zu viele Transistoren pro Chip.
  Die Hersteller von Chips wissen nicht, was die damit tun sollen.
  Du bekommst absurde Features, die nicht auf allen Chips gebraucht werden (KI-Inferenz,
  dutzende FPUs und Vektoreinheiten) in den Performance-Cores, oder riesige Menschen Efficiency Cores pro Socket.
  Im Consumer Bereich bekommst Du statt eines Computers ein System-on-a-Chip, bei dem Grafikbeschleuniger,
  RAM, RAM-Controller und NVME-Controller mit auf der CPU sitzen, zusammen mit 4E+8P Cores oder ähnlich.
- Wir haben daher im Enterprise-Bereich viel zu viele Cores pro Socket (128+ Cores).
- Als Kunde habe ich dadurch das Problem, dass ich kein Bare Metal mehr fahren kann.
  Ich brauche also K8s oder einen Hypervisor zum Kleinschneiden der Systeme in brauchbare Stücke.
- Als Kunde habe ich dann auch ein Blast-Radius Problem.
  Wenn so ein großer Host umfällt, dann nimmt er die ganze Firma offline.
- Als Kunde will ich also eine VM auf vielen Hosts haben und auf einem Host mit vielen anderen Kunden cohosted werden.
  Ich gehe also lieber zu einer Public Cloud und miete mir da die passenden VMs.
- Ich brauche dann auch keine Hardware-Kundigen mehr.
- Als Hoster von so etwas kann ich die Hardware veredeln und Operations übernehmen, 
  indem ich statt VMs Dienste "as-a-Service" verkaufe.
- Als Kunde kann ich so nicht nur meine Hardware-Kundigen los werden, 
  sondern für den Dienst x (jetzt xaaS) auch meine x-Kundigen.
- Als Kunde von so einem Anbieter habe ich nun reine Entwickler, 
  die in komplett abstrakten Layers Dinge zusammenstecken, 
  low-code und nahe an Business Problemen. 
- Dadurch habe ich niemanden nirgendwo mehr, der auch nur einen Hauch einer Ahnung hat, was das alles bedeutet,
  lastmäßig und ob der getriebene Aufwand dem Problem angemessen ist.
- Ich kann solche Einschätzungen aber als Beratung einkaufen, 
  entweder von lokalen Drittanbieter Consultants oder vom Hoster, als "Well-Architected" Beratung nach Schema F.
- Das Bruttosozialprodukt steigt, weil das ja jetzt alles Transaktionen mit Echtgeld zwischen Firmen sind,
  statt Verrechnung mit Spielgeld innerhalb einer Firma.

Und am Ende spielen die Kosten im Vergleich keine Rolle mehr, weil andere, größere Vektoren auf die Firmen einwirken.

Einer dieser Vektoren sind auch immer größere Regulierungsverpflichtungen, 
die den Betrieb eigener Rechner On-Premises unmöglich machen, 
weil eine ISO 27k, eine NIS-2 und eine PCI-Zertifizierung ja auch Aufwand und Geld kosten.
Kauft man dagegen eine vorzertifizierte Cloudlösung hat man mindestens drei Viertel des Schmerzes nicht, 
wird einem versprochen.
