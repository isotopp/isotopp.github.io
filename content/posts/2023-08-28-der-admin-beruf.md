---
author: isotopp
title: "Der Admin-Beruf"
date: 2023-08-28T01:02:03Z
feature-img: assets/img/background/rijksmuseum.jpg
toc: true
tags:
- lang_de
- devops
- computer
---

(based on a series of posts on Mastdon)

[Ein Heise-Artikel über Admin-Gehälter](https://www.heise.de/hintergrund/Gehaelter-2023-Das-verdienen-Admins-in-Deutschland-9282686.html)
und ich schrieb dazu auf Mastodon:

# Ein hoffentlich aussterbender Beruf

Der Beruf des "Admins" ist - hoffentlich - eine aussterbende Tätigkeit.

Er wird zunehmend ersetzt durch die Kombination von *Infrastrukturentwicklung* und *Support*.
Infrastrukturentwicklung befasst sich dabei mit der Automatisierung von Provisionierung, Konfiguration, Betrieb, Überwachung und Aktualisierung.
Neben Kenntnissen über Betrieb sind auch Kenntnisse der Programmentwicklung notwendig.

[Mehr zu Devops]({{< ref "/content/posts/2015-03-27-go-away-or-i-will-replace-you.md" >}})
in einem älteren Talk von mir.

# Betriebsprozesse finden und durch Code unterstützen

Der Wert von Infrastrukturentwicklung bemisst sich dabei im Finden und Schaffen von operativen Prozessen,
die einen Dienst sicher in vorhersagbarer Qualität unterbrechungsfrei anbieten zu erlauben.

Das - der Wert und die Schwierigkeit von Operations - ist auch etwas, das von vielen Feature-Entwicklern und Software-Entwicklungsorganisationen weit unterschätzt wird.
Das ist einer der Gründe, wieso Amazon reich ist und Elastic oder HashiCorp im Vergleich eher nicht.

Auf eine Weise ist es auch der Grund warum viele deutsche Betriebe dem modernen DevOps Hipster skeptisch gegenüber stehen. 
Man spürt, daß es mit dem Entwickeln, Day 1 Installation und Inbetriebnahme nicht getan ist.
Zugleich scheitert man an der Transferleistung, die Schaffung von Betriebsprozessen, 
die aus der eigenen Produktion wohlbekannt ist, auf die IT auszudehnen und methodisch umzusetzen.

Die Hälfte des Problems ist dabei das Unterschätzen der Schwierigkeit bzw fehlendes ernst nehmen der Aufgabenstellung.

# AWS bringt Struktur

Der "Wert" von Amazon besteht darin, dem Betrieb genau messbare Kosten und harte betriebliche Einschränkungen zu geben,
um die sich eine Firma nun auf einmal gezwungenermaßen herum organisieren muss,
während sie vorher unkontrolliert Druck auf interne Betriebsteams ausgeübt hat.

Grenzen und Kosten, die vorher nicht fassbar waren, werden nun greifbar.
Firmen sind gezwungen, sich damit ernsthaft zu befassen.
Insofern ist Cloud eine gute Sache, weil sie Läden ins Meta zwingt.

Wie teuer ist "ein Admin-Team"?
So teuer wie Deine AWS Rechnung hoch wäre, 
und die ist in den meisten Läden dreimal bis fünfmal höher als ursprünglich gedacht.
Das ist das Ausmaß des Understaffing in Operations in den meisten Firmen.

# Fragen und Antworten

## Aber Admins haben doch immer schon Code geschrieben

Jens Finkhäuser
> Heute Programmentwicklung, damals Perl.
> Was hat sich jetzt genau geändert? 

Es gibt Perl und es gibt SysAdmin Perl.
Das ist im Grunde die Diskussion aus [Using Python to bash]({{< ref "/content/posts/2021-01-05-using-python-to-bash.md" >}}).

## Anerkennung?

Tobias Fiebig:
> Ich kann dir da nur zustimmen. 
> Ich denke, dass grad das end-to-end understanding verloren geht.
> Und das ist halt über kurz oder lang gefährlich.
> Denn ohne end-to-end understanding APIs nutzen geht wohl.
> Aber Bauen eher nicht.

Das ist ein anderes, auch wichtiges Thema.
Ein Ex-Arbeitgeber von mir war in 2018 durchaus in der Lage, 3 RZ mit 50k Maschinen voll automatisiert zu betreiben und zu vernetzen.
Dieselbe Firma in 2023 ist dazu definitiv nicht mehr in der Lage, weil nach der Ankündigung des Cloud-Move 
und den Änderungen im Management viele Leute weggegangen sind,
weil sie keine Zukunft mehr für sich gesehen haben.
Und weil Leute, die so etwas betreiben können, auch zunehmend schwieriger zu bekommen sind.

## Kubernetes ist zu fett?

Juliane:
> Wobei ich aber auch behaupten würde, dass eine Kubernetes-Landschaft nicht immer die korrekte Lösung ist,
> und es mutmasslich genug Betriebe gibt, die sowas haben, obwohl sie es besser nicht sollten.
>
> Überdimensionierte und dann tendenziell schlecht gepflegte Systeme sind für uns alle auch eine Gefahr.

Da machst Du ein Fass auf. 
Das TL;DR ist, daß Du zu große und zu wenige Maschinen hast und daher Technik zum Kleinschneiden von Servern brauchst.

Und dann landest Du schnell bei Kubernetes.

Die letzten Bare metal-Maschinen, mit denen ich gearbeitet habe, sind in etwa das Äquivalent von i3.4xl oder i3.8xl gewesen.

Da waren [zwei $400 CPUs drin](https://www.intel.com/content/www/us/en/products/sku/123547/intel-xeon-silver-4110-processor-11m-cache-2-10-ghz/specifications.html),
eine oder zwei 2 TB NVME und 10 Gbit Netz, sowie 128 GB in RAM.
Das war schon damals nicht mehr kosteneffektiv in dem Sinne, daß man lieber größere Kisten gekauft und klein gesägt hätte.

Das erzeugt zwei Probleme, eines für kleine Betriebe und eines für alle:
Du hast weniger Maschinen und in Folge weniger Racks.
Das heißt, ein Ausfall betrifft nicht mehr eine Anwendung, sondern viele oder alle. 
Der Blast-Radius steigt.

Da kann man was gegen tun:
Sich mit anderen zusammen tun und Anwendungen mischen. 
Wenn dann eine Maschine oder ein Rack umfällt, dann betrifft das alle ein wenig, aber niemanden groß.
Das ist die Idee hinter Cloud – große shared Infrastruktur, 
und Du belegst auf vielen Maschinen ein Fitzel statt auf einer Maschine alles.

Und das zweite Problem:
Du hast jetzt viel mehr Komplexität, weil Du nicht nur Deine Anwendungen managen mußt,
sondern auch die enorm aufwendige Abstraktion darunter: Openstack oder Kubernetes.
Mit verteiltem Compute und Isolation von Anwendungen, verteiltem Storage und dessen Komplexitäten und mit einer Menge Netz.
Oder Du kaufst das fertig dazu von jemandem, der das für Dich betreibt – wieder landest Du in einer Cloud.

Was Du nicht mehr tun kannst: Anwendungen lokal auf Rechnern betreiben, eine Anwendung pro Rechner.
Das geht deswegen nicht, weil Du keine Kisten mehr bekommst, die so klein sind, daß Du sie mit einer Anwendung voll bekommst.

Du wirst Dich also gezwungenermaßen mit solchen Dingen auseinandersetzen müssen, 
oder jemanden dazu nehmen müssen, der das für Dich tut.

Openstack oder Kubernetes (oder das Äquivalent in einer Public Cloud) bringen eine Menge Komplexität mit,
aber es sind Standardprodukte, für die Du Leute finden und einstellen kannst.
Mit etwas Kleinerem, das nur die für Dich notwendigen Optionen hat, kannst Du das nicht, weil es kein Standardprodukt ist.

Die Behauptung ist, daß eine Reihe von finanziellen, strukturellen und demografischen Faktoren Dich als Unternehmen zwingen,
so viel als möglich in eine Cloud zu verlagern.
Das kann eine öffentliche Cloud oder eine private sein, aber Du kommst da nicht dran vorbei.

## Standardprodukte helfen

Thilo Fromm:
> Kris spricht im zweiten Toot des Threads an, dass das Ziel Prozesse und SLAs sind.
> Dafür muss man über technologische Notwendigkeiten (wie z.B. effizienten Betrieb) hinausgehen.
> Die Erlernbarkeit und die Bekanntheit, die Verbreitung der eingesetzten Technologie und des Ökosystems zählen hier ebenso,
> wie die Verfügbarkeit von Schulungen, Zertifizierungen, usw.
> Das schafft enorme Erleichterung auf der Management-Ebene.
> 
> Du tauschst also Performance gegen Betriebssicherheit:
> Kubernetes macht es Dir im Vergleich zu "klassischer" Administration mehrerer Rechner 
> (Chef, Ansible, etc. kombiniert mit Fail-Over usw.) deutlich schwerer, 
> Dir in den eigenen Fuß zu schießen.
> Denn es impliziert etablierte Pattern, die oft aus Erfahrungen aus dem "klassischen" Betrieb stammen.
>
> Zudem kommt das Ökosystem als Komplettpaket mit einer großen Entwickler- und Nutzer-Community, was das Staffing erleichtert.
> 
> Die Lernkurve bei der Übernahme bestehender Systeme ist niedriger als bei handgestrickten Lösungen, 
> und standardisierte Zertifizierungen erleichtern Dir das Anstellen neuer Mitarbeiter.
> Dafür bezahlst Du dann mit Rechenressourcen, aber das ist für viele Betreiber eben der weitaus geringere Kostenfaktor.
>
> Ich vergleiche Kubernetes und die (oft subjektive) Skepsis, die dem entgegenschlägt, 
> gern mit der steigenden Popularität von Java in der Applikationsentwicklung vor ~20 Jahren. 
> 
> Java löst auch kein allein technisches Problem - Objektorientierung gab es schon vorher,
> portable Software und managed code auch.
> Es kommt mit Infrastruktur und einem Ökosystem, das über die reine Applikationsentwicklung hinaus geht: 
>
> Du konntest mit Java einen arbeitslosen Physiker von der Straße holen, durch ein paar Kurse schleusen, und nach ein paar Monaten war der produktiv.
> Das ging davor nicht.
> Die ermöglichte Applikationsentwicklung in Firmen und Organisationen, die vorher dazu nicht in der Lage waren.
> So ist das mit Kubernetes in der Infrastrukturautomatisierung.
> 
> Natürlich gibt es dadurch nun Randfälle, 
> die aufgrund des niederschwelligen Einstiegslevels komplett neben der Spur laufen.
> Aber sich allein auf diese Totalausfälle zu konzentrieren -- oder 
> zu ignorieren, dass Kubernetes ein weitgehend nicht-technisches Problem löst -- verfehlt
> meiner Meinung nach den Punkt.

## Kubernetes ist nicht komplex, das Problem ist es

Sören entgegnet:
> der Vergleich hinkt, finde ich. Die Kritik an Kubernetes ist nicht, dass es kein Fortschritt ist. Das ist es in einigen Szenarien.
>
> Die Kritik ist, dass du dir eine komplexe Architektur an Containern aufbaust,
> die du häufig auch mit weniger Wartungsaufwand und weniger laufenden Infrastrukturkosten auf einem physischen System hinbekommen hättest.
> Klar, die sind jetzt individuell skalierbarer, aber damit löst du ein häufig rein hypothetisches Problem.

Als Antwort und Ergänzung zu Thilo Fromm:

Kubernetes löst einen Satz spezifische Probleme, und die Komplexität kommt aus den Problemen und nicht aus den Lösungen.

Du willst eine sehr große Kiste in benutzbare Häppchen klein schneiden.
Das kannst Du mit Virtualisierung (Openstack) oder mit Containern (K8s) machen, aber für den Outcome ist es hinsichtlich der Komplexität egal.

Das Erste zu lösende Problem ist die Installation von Anwendungen und deren rückstandsfreie Entfernung.
Du bekommst Images:

Wenn Du die nicht hast, mußt Du gezwungenermaßen einen 250k Files, 10 GB Size großen Linux-Tree an die Stelle kopieren, wo Deine Anwendung sitzt,
zusammen mit den Binaries, Configdateien und Daten der Anwendung.
Das dauert lange.

Wenn Du ein Image oder eine Sequenz von Images ("Docker Layers") hast,
kannst Du die mit Disk Speed (400 MB/s) an Ort und Stelle kopieren und hast einen Loop Mount.

Das eskaliert schnell:
```console
root@server:~# df -Th | wc -l
71
```

Die Images willst Du irgendwo zentral bereithalten und abrufen können,
also hast Du eine oder zwei Registries. 
Ob die nun Glance, Docker-Registry oder Artifactory heißen ist am Ende egal.

Dein Image läuft nun auf diesem Host oder jenem, wo gerade Platz ist. 
Das zieht weitere Dinge nach sich:

Wo kommt der Storage her?
Entweder lokal, dann hast Du eine Scheduling-Constraint und Du kannst nur noch *hier* laufen und nicht mehr *dort*, oder aus dem Netz.
Oder Du hast einen Filer, iSCSI oder NVMEoF, und Volume Management. 
Das kann Cinder heißen, oder CSI mit PVC/PV, auch das ist am Ende egal.
Du brauchst jedenfalls was, das Volumes durch Dein Netz an die Anwendung kabelt, egal wo die ist.

Und apropos "egal wo die ist", wie kommen Nutzer an die Anwendung, wenn die Anwendung im Cluster mobil ist?

Du brauchst Netz, einen Network Entry-Point (einen Load-Balancer oder so was), eine Backend-Erkennung, 
und eine Methode eine feste externe IP an einen Endpoint zu kabeln, auch wenn der Endpoint im Cluster mobil ist.
Das endet im Fall Openstack mit einem SDN, und im Fall K8s mit einem SDN, einem Service Mesh oder beidem,
weil manche Leute Hosenträger und Gürtel wollen.

In jedem Fall hast Du eine komplett neue Anforderungsliste für das Netz und das Netzwerk-Debugging an der Backe,
einfach dadurch, daß Du Images irgendwo im Cluster haben und debuggen können mußt.
So weit, so billig.
Das hat ja auch was Gutes.

Wir gewinnen nun die Möglichkeit, die Ausführungsumgebung einer Anwendung maschinenlesbar zu beschreiben,
und nach dieser Beschreibung zu bauen – das ist Infrastructure as Code (IaC).

Wir gewinnen dadurch auch ein Manifest der Anwendung und ihrer Dependencies, 
weil das ja für das Bauen vom Image Voraussetzung ist.
Das macht Compliance re CVEs, Lizenzen und Dependencies viel einfacher.

Wie bekommen aber auch einen kompletten Methodenwechsel beim Debugging und beim Monitoring:

Jede Form von Introspektion *vor* Openstack und K8s war hostbasiert.
Maschinen schrieben Logs in Files, und Entwickler loggten sich auf Kisten ein,
lasen die Logfiles oder starteten einen Debugger, der sich an die Anwendung attached,
und dann kann man in den laufenden Code gucken.

Wenn die Anwendung irgendwo im Cluster läuft, das in n+2 Kopien tut - dann geht das nicht mehr.
Du bekommst Prometheus und Metriken mit Dutzenden von Tags, 
Honeycomb/Open Telemetry und viele andere Dinge *nur*,
weil Entwickler das so nicht mehr tun können, denn die Anwendung läuft halt x-mal und irgendwo und ggf laufend woanders.

Das heißt, das Handwerk der Softwareentwicklung wechselt einmal komplett die Methodik.

Aber auch wie wir über Anwendungen denken ändert sich:

Um Images zu bauen brauchen wir eine Bauanleitung, die beschreibt, was da rein geht – ein Manifest, das die Anwendung und ihre Komponenten (neue und fertig eingebundenen, also Dependencies) beschreibt. Dazu die Privilegien, die die Anwendung braucht.

Das alles wird einfacher, wenn wir Mutability vermeiden oder isolieren, also State in Datenbanken oder S3 Buckets oder anderen Sammelstellen konzentrieren.
Auch das Deployment wird so einfacher. Wir bekommen *Struktur*.

Dazu kommen Dienste, die die Infrastruktur jetzt wegen dieser festen Regeln,
und wegen ihrer eigenen Konstruktion bereitstellen und garantieren kann:

Der Cluster wird gesteuert.
Dazu gibt es eine Controlplane, und die weiß, was wo läuft und wem es gehört.
Wir bekommen also vom Cluster garantierte Identitäten und das Management dazu.

Ich weiß, daß die Gegenstelle auf meinem Port 8080 der Dienst x für den User z ist, 
denn die Controlplane kann es mir garantieren oder mir sagen. 
Und weil jede Kommunikation im Cluster von der Controlplane gesteuert und erlaubt wird,
ist diese Auskunft so verbindlich wie die Sicherheitsstruktur und Isolation des Clusters selbst.

Ich bekomme also eine vollkommen neue Dimension von Verlässlichkeit und Identität,
die ich so auf dedizierten Bare-Metal Maschinen in der Regel nicht habe.

Mit einem Mesh kann ich sogar den Code dazu weglassen, 
denn Verschlüsselung, Metriken sammeln, Finden von Endpoints, Backoff und viele andere Dinge
passieren automatisch und standardisiert im Mesh, sodaß ich das in meine Anwendung nicht rein codieren muss.

Ich mache einfach ein GET auf `localhost:3081` und das "Richtige" passiert.

Nichts davon ist sinnlose Komplexität oder "nur deswegen da, weil ein paar Hipster es cool fanden",
sondern es kommt als logische Folge der Eskalation, 
die in Gang gesetzt wird, wenn ich Hardware klein schneiden und effizient nutzen will.

Und all das wirst Du duplizieren oder sogar in V1 dupliziert haben müssen, wenn Du selbst Clustern willst.
Nur daß Du K8s-Leute direkt einstellen kannst, die für Deinen selbst gekochten Cluster nicht.

## Versteckt das nicht Kosten?

Nils Goroll:
> Nur, dass das neue Admin-Team, das jetzt "Devops" heisst, trotzdem noch obendrauf kommt.
> Oder halt die Leute, die devopsen, auch wenn sie nicht mehr Team heissen dürfen.

Ja. Nein. Es ist kompliziert.

Große Teile an Standard-Aufgaben werden auf die eine oder andere Weise an das Fachteam oder an AWS outgesourct.
Davon ist es nicht notwendigerweise weniger Arbeit, aber sie ist jetzt teilweise unsichtbar.
Du weißt halt nicht mehr, wie viele Stunden DBA KTLO sind, wenn jedes Fachteam sich selbst mit RDS Daten- und Schema-Migrationen rumschlagen muss.

Andererseits wirst Du sicher eine Gruppe von Menschen brauchen,
die sich auf Cloud-Infrastruktur, deren Design, Betriebs- und Sicherheitsarchitektur, 
Abrechnung und Kostenkontrolle und derlei Dinge kümmert.
Und das sind nicht notwendigerweise weniger Menschen als Du vorher für Bare-Metal daheim eingeplant hattest.

Und schließlich ist es kompliziert, weil Du durch eine Cloud mit IAM, einer Controlplane und Services eventuell Dinge gewinnst. 
Nicht geldmäßig, denn Cloud ist immer 3-5x teurer als was immer Du vorher hattest.

Aber eventuell bekommst Du durch die harte administrative Grenze und den Zwang zur Kostenkontrolle als Organisation eine Motivation,
Deine betrieblichen Abläufe besser zu dokumentieren, strukturieren und in Beziehung zu den betriebsWIRTSCHAFTLICHEN Abläufen zu setzen.

Also "Was tun wir hier eigentlich und was davon dient dem Geld verdienen"?
Viele Unternehmen scheuen enorm vor diesen Fragen zurück.
