---
layout: post
title:  'Konsenssysteme'
author-id: isotopp
feature-img: assets/img/background/rijksmuseum.jpg
date: 2019-09-03 21:31:01 +0100
tags:
- lang_de
- erklaerbaer
- distributed computing
---
Ein Thread über Konsenssysteme aus
[Twitter](https://twitter.com/isotopp/status/1168969885512286210)

## Mehr als ein Key-Value Store

Heise schreibt:
[Verteilter Key-Value-Store: etcd erreicht Version 3.4](https://www.heise.de/developer/meldung/Verteilter-Key-Value-Store-etcd-erreicht-Version-3-4-4512313.html).
etcd ist _auch_ ein Key-Value-Store, aber das ist nur ein
Nebendetail. Die Beschreibung der neuen Funktionen im Artikel
macht auch schon keinen Sinn für einen KV-Store.

etcd ist ein _Konsenssystem_. Es realisiert
Clustermitgliedschaft, verteilte Locks, und darauf aufbauende
Dienste wie Service Discovery und Loadbalancing.

Es gibt drei von Kyle Kingsbury getestete Implementierungen von
Konsenssystemen, die funktionieren: Zookeeper, etcd und consul.
Es handelt sich um verteile Datenspeicher, die im CAP-Dreieck
Consistency über Availability präferieren.

Das heißt, daß sie lieber keine Antwort geben statt eine falsche
Antwort zu geben.

Sie sind also oft offline.

Immer wenn sich die Topologie des Ensembles (der 3/5/7 Nodes,
die den inneren Cluster bilden) ändert, geht der ganze Cluster
für Reads und Writes offline, bis er mit Voting,
History-Abgleich und so weiter durch ist. Danach ist er wieder
verfügbar. Availability ist also eher nicht gegeben.

Aber Consistency ist: Es ist egal, mit welcher Node des
Ensembles man redet, jeder Read liefert dasselbe Ergebnis, jeder
bestätigte Write ist überall sichtbar und jedes Lock ist global
da.

Das heißt aber auch, daß jeder State Change (Write, Locks)
global verhandelt wird. Das ist nicht schnell. Minimale Latenz
ist 2 RTT.

Dumm, wenn man die Idee hatte, einen Stretched Cluster zu bauen,
also einen der über eine Latency Domain Grenze hinaus geht -
eine Node in einem anderen RZ, oder in einer anderen Cloud. Das
ist nicht schnell, und hat deswegen auch wenig Kapazität für
Writes: Man will keine globalen, zentralen Konsenssysteme für
ein ganzes RZ oder eine Abteilung haben, sondern eher eine
Instanz pro Service oder was immer man sonst als kleine zu
koordinierende Einheit hat

Das SRE Buch von Google hat mindestens zwei Kapitel über
Probleme beim Betrieb von Chubby (Zookeeper) oder vergleichbaren
Systemen. In einem reden sie darüber, daß sie Mindest-Downtimes
für ihren zentralen Chubby fahren: Der Dienst ist mindestens n
Minuten pro Monat unangekündigt offline, damit Dependencies auf
den Dienst sichtbar werden und Dienste Strategien entwickeln und
testen, um mit Chubby Downtimes umgehen zu können.

Ich kann aus eigener professioneller Erfahrung nur bestätigen,
wie unglaublich wichtig so was ist. Fragt nicht.

Da wo ich arbeite haben wir jetzt jedenfalls eine Position
Master Of Disaster (nicht mein Job, zum Glück), und der macht
Drills mit Service Owners, zuerst Zookeeper. Zookeeper ist das
älteste der drei Konsenssyteme Systeme, und auf eine Weise
leider auch das Beste.

Zookeeper arbeitet mit statischen Verbindungen in das Ensemble.

Eine Session hat man, wenn man mindestens eine Verbindung in das
Ensemble hat. Das impliziert, daß man mehr als eine haben kann,
etwa eine zu jedem Ensemblemitglied und daß es egal ist, was man
auf welcher Verbindung macht - es ist alles gleichwertig und
konsistent.

Zookeeper erzeugt in der Tat eine LDAP/DOM-Tree artige Struktur,
bei der jeder Knoten in einer Verzeichnishierarchie gleichzeitig
File und Directory ist. Im File kann man Daten speichern, aber
das ist beinahe unwichtig.

Der Punkt ist mehr, daß man Knoten (Znodes) als persistent oder
ephemeral kennzeichen kann, und daß ephemeral nodes automatisch
verschwinden, wenn die  Session des Owners endet.

Verlierst Du also Deine letzte Verbindung zum Ensemble,
verschwinden Deine ephemeral nodes.

Wenn das Ensemble also zum Beispiel in einer persistenten Znode
die Mitgliederliste aller Hosts in einem Cluster als ephemeral
Znodes speichert, dann registriert sich jeder Clusterhost in
diesem Verzeichnis selbst, und verschwindet automatisch aus der
Liste, wenn seine Session verschwindet weil der Host offline
geht oder wenn die Netzwerkverbindung zum Ensemble unterbrochen
ist, oder das Ensemble selbst split ist.

Im ephemeral Znode selbst kann die Endpunktadresse des Hosts stehen:
Adieu DNS!

Zookeeper hat atomare Operationen, sodaß man Znodes automatisch
verschieben oder sonstwie übernehmen kann. Daraus kann man
globale Locks, exactly-once Work Queues und andere Dinge bauen,
die in einem Cluster notwendig sind.

In der Znode steht dann der Lock Range, Work Item URL… Es ist
also irgendwie AUCH ein Data Store, aber das ist wie gesagt der
unwichtige Teil.

Konsenssysteme sind der Baustein, der den Bau sicherer und
funktionierender verteilter Systeme vom Forschungsgegenstand
(Science) zum Ingeniersgegenstand (Engineering) bewegt hat.

Sie sind die Grundlage aller der nifty distributed anythings,
mit denen Devs heute bauen. Das funktioniert, weil wir die
Primitives und Building Blocks, die man für verteilte Systeme
braucht (Membership, Discovery, Atomic Operations, und damit
Locks, Queues und so weiter) schön abgepackt und dann getestet
haben.

Die Arbeit von Kyle Kingsbury auf dem Gebiet "Heisenbugs
reproduzierbar machen" und "Grenzfälle in verteilten Systemen
durch wiederholbare Operationen demonstrieren" kann man dabei
gar nicht hoch genug bewerten. Diese Person alleine hat mehr
Fehler in mehr verteilten Systemen gefunden als ganze
Generationen von Informatikern zuvor. Kyle hat Dinge, die vorher
entweder Theorie oder nicht reproduzierbar waren testbar
gemacht, und ist deswegen zentral dafür verantwortlich, einen
ganzen Forschungsbereich der Informatik aus der reinen
Wissenschaft in die anwendbare Ingenierswissenschaft zu bewegen.
Die ganze "Call Me Maybe" Reihe und
[Jepsen](https://aphyr.com/tags/jepsen) sind wegweisend.

Und jedes funktionierende moderne verteilte System hat im Kern
entweder eines der drei Konsenssysteme am Laufen (Zk, etcd,
consul) oder es ist nicht funktionierend, modern oder verteilt.

Ja, Openstack, tut mir leid.

Anway, als Dev, der mit einem Zk, etcd oder consul redet, muß
man sich ein paar Gedanken machen.

Erstens: Was mach ich, wenn das Ding mal offline ist. Denn es
ist so designed, daß es offline sein muß, wann immer "was ist".

In verteilten Systemen haben wir in der Regel eine Data Plane
(da wo die Arbeit gemacht wird, auf dem Mitglieds-Hosts) und
eine Control Plane. Und als Fehlermode Node Loss (hoffentlich
hast Du genug Nodes), Cluster Loss (hoffentlich hast Du noch
einen, in der anderen AZ) und Loss of Control (Controlplane
down, Nodes arbeiten weiter, aber Start/Stop/Config Change
unmöglich). Der 3. Fehlermodus, Loss of Control, ist nicht
selten und hat als Sonderfall auch Wipe, also die Daten in der
Controlplane müssen aus der überlebenden Dataplane neu aufgebaut
werden.

Beispiel: Ein SDN Produkt hat ein 3-Node etcd Ensemble als
Controlplane und Config Storage. Nach einem Update sind die
Daten aller virtual network assets im etcd unbrauchbar. Können
wir den Inhalt des etcd (automatisch?) aus den SDN Worker Nodes
neu aufbauen? Ohne Downtime?

Und weniger hart, aber noch häufiger: Das etcd-Ensemble hat sich
zur Leader Election nach einer Netzwerkunterbrechung
zurückgezogen und redet mit niemandem bevor es intern
ausgekaspert hat, was die Wahrheit ist.

Kann das SDN noch routen?

(Openstack hat hier als Sonderfall zwei Wahrheiten, weil es
einmal den Tatbestand in der Neutron Datenbank hat, den der Rest
von Openstack glaubt, und dann den Tatbestand im etcd des
kommerziellen SDN Produktes, den das SDN glaubt.

Und wenn Du glaubst, daß die beiden deckungsgleich sind, dann
hab ich ein schönes Ufergrundstück in Florida für Dich - oder
anders gesagt: Der Mann mit zwei Uhren weiß nie wie spät es ist.

Zweitens: Was ist meine Schreibrate und meine Schreib-Latenz?

Weil Konsenssysteme jeden Write über das ganze Ensemble
abkaspern müssen, haben sie so ihre Skalierungsprobleme, und die
o.a. 2RTT Minimal-Latenz - eher und gerne auch mehr.
Insbesondere hat die Schreiblatenz aber keine garantierbare
Obergrenze. Wenn das Ensemble Papstwahl macht, aus welchem Grund
auch immer, hängen alle Writes (und auch die Reads).

Wenn ich also einen SLO brauche, der irgendeine Obergrenze auf
dem Write hat - und ich meine irgendeine! - dann ist ein
Konsenssystem nicht der Datenspeicher der Wahl. Und wenn ich
"Tausende von Updates die Sekunde" spezifiziere, dann sehe ich
ein anderes System als ein Konsenssystem als Speicher, oder
einen guten Kunden für 25 Gbit/s Networking und Optane als
Speicher, der trotzdem nicht glücklich wird. Also, nachdem die
Vendor Salesdrohne Dir 25GBit und Optane angedreht hat.

Ich meine, ich bin der letzte, der zu coolem Spielzeug "Nein!"
sagen will, aber das ist nicht, wie wir Systeme designen. Ich
macht ja auch kein OLTP auf Blockchains (aber IBM verkaufts!).
Und damit ist hoffentlich auch klar, warum Konsenssysteme als
"Key Value Stores" eine echte Scheißidee sind.

Wir benutzen sie trotzdem, aber aus ganz anderen Gründen. Als
Grundbaustein funktionierender verteilter Systeme
("Wahrheitsfindung unter erschwerten Bedingungen"). Dazu muß man
mitunter Daten speichern und verändern.

Aber das in den Fokus zu stellen verfehlt den Zweck, zu dem wir
den ganzen Aufwand treiben. Ich meine "Key Value Store", wenn es
als Datenbank so offensichtlich Scheiße ist - warum?

Wegen der Garantien, die drumrum gewickelt sind.
