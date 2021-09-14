---
layout: post
published: true
title: HDFS - billig im Cluster speichern
author-id: isotopp
date: 2012-06-11 17:26:44 UTC
tags:
- cluster
- computer
- hadoop
- lang_de
feature-img: assets/img/background/rijksmuseum.jpg
---
Wer Clustern will, der muß erst mal einen solchen haben.  Also, einen
Cluster von möglichst vielen Rechnern.  Die Anforderungen sind dabei klar:
Man möchte Hardware haben, die möglichst billig ist - für Serverplatten,
Speicher mit Fehlerkorrektur (ECC), und dergleichen Luxus ist kein Geld da,
denn man möchte das gesparte Geld lieber in mehr Rechner stecken.

Also Billighardware kaufen?  Nein!  Denn auch die laufenden Kosten möchte
man niedrig halten - der Rechner sollte also klein sein, und möglichst
geringe laufende Kosten haben, also möglichst wenig Strom aufnehmen und bei
möglichst hohen Zuluft-Temperaturen noch funktionieren.  Die oben
angedeutete Desktop-Kiste wird in dieser Form und mit diesem Formfaktor also
niemandem Freude bereiten.

"Klein" heißt in unserem Fall, daß wir mehr Schachteln in ein Standard-Rack
hinein bekommen, wenig Strom aufnehmen heißt, daß wir wenig Strom bezahlen
müssen und wenig Strom dazu verbrauchen, um den in Wärme umgewandelten Strom
nach dem Verbrauch per Klimaanlage wieder nach draußen zu schaffen.  Und
hohe Zuluft-Temperaturen heißt, daß wir dicht packen können und daß wir die
Klimaanlage so klein als möglich dimensionieren können, also weniger Strom
für Kühlung und mehr Strom für das Rechnen ausgeben können.

Wenn man das Ganze groß genug betreibt - also mit n-stelliger Anzahl von
Kisten, dann lohnt es sich, Metriken in Operations/Euro und Operations/Watt
sowie Operations/Grundfläche bzw.  Kubikmeter aufzustellen und dann auf dem
Problem ein wenig linear zu optimieren, damit man möglichst viel Bumms pro
Euro kauft.

Wenn man eher mittelständische Haushaltsgrößen ins Auge faßt, dann geht man
zu seinem Standard-Hersteller für RZ-Hardware und schaut mal, was die an
möglichst einfachen Pizzaschachteln im Angebot haben.

![HP DL 160 Gen 6](/uploads/dl160g6.png)

Pizzablech "HP DL160 Generation 6" für 4 Sorten Käse.

Dieses Blech wiegt etwas über 12 Kilo, ist die üblichen 19" breit, eine
Höheneinheit im Rack hoch und etwas unter 70cm tief.  Eine
Beispielkonfiguration enthielte etwa eine 6-Core CPU, 24 GB RAM, 4 Platten
mit jeweils einem Terabyte als JBOD und einen bzw. zwei
Gigabit-Netzwerkports, und sie kommt mit ein wenig Gehampel für unter 2000
EUR/Stück.  Eine doppelt so hohe Kiste könnte statt 4 Platten deren 12
fassen, und ein damit aufgebauter Cluster hätte weniger CPU und mehr
Plattenspeicher.

Das ist sehr unangestrengte Hardware - wenn man ein wenig mehr Hardcore
shoppen geht, dann bekommt man leicht etwas mit größeren Platten für wenig
Geld, wahrscheinlich aber auch mit einer schlechteren Ausfallrate.  Das
ganze Gelöt kommt nun in einige Racks, die wir mit Top-of-Rack Switches
sinnvoll in einem separaten Netz zusammenknoten.

## HDFS - Hadoop Filesystem

Jetzt haben wir billige Platten von schlechter Qualität als JBOD ohne das
geringste bischen Redundanz, die wir einzeln und lokal in irgendein
Verzeichnis unsers Servers mounten.  HDFS, das Hadoop Filesystem, ist ein
verteiltes Dateisystem - es verwendet das vorhandene lokale Dateisystem auf
Einzelplatten schlechter Qualität, um daraus schnellen, parallel
ansprechbaren und redundanten Speicher im Cluster zu bauen.

HDFS setzt dabei nur eine begrenzte Zahl von Operationen um - ein HDFS ist
kein vollwertiges Dateisystem im Sinne des Posix-Standards, sondern man kann
es sich mehr als eine Art verteilten und massiv parallelen FTP-Server
vorstellen: Das Dateisystem hat die Operationen GET, PUT und DELETE, sowie
neuerdings auch noch APPEND, um Daten an eine bestehende Datei anhängen zu
können.  Ein SEEK, READ oder WRITE existieren jedoch nicht, Locking auch
nicht.

Entsprechend gibt es HDFS FUSE-Plugins, aber eben nur im Rahmen der Grenzen
der Operationen von HDFS.

![Ein Hadoop Datanode](/uploads/hadoop_disks.png)

Ein Hadoop-Datanode

HDFS startet zu diesem Zweck auf jedem Rechner mit nutzbaren Platten einen
Prozeß namens Datanode, und an zentraler Stelle einen Verwaltungsprozeß
namens NameNode.  Die Namenode kümmert sich um die Verwaltung von Dateinamen
und um das Wiederfinden von Blöcken.  Sie zerteilt sehr große Dateien in
vergleichsweise grobe Schnetzel von 128 MB Größe und speichert dann jeden
dieser "Blöcke" genannten 128 MB-Schnetzel mehrfach auf unterschiedlichen
Datanodes ab.  Dabei ist es wichtig, sich nicht von der Nomenklatur "Block"
ablenken zu lassen: Ein Block ist ein Stück Datei, das bis zu 128 MB groß
sein kann, aber bei kleineren Dateien eben auch kürzer.  Es handelt sich
nicht um Blöcke fester Größe wie bei einem richtigen Dateissystem.

HDFS speichert die Daten auch nicht selbst ab: Es verwendet ein lokales
Dateisystem, zum Beispiel Linux ext4 oder xfs, um Dateien lokal zu verwalten
und liefert nur eine einheitliche Clustersicht auf die Dinge.  HDFS kümmert
sich also nur um die verteilten Aspekte des Dateisystems, und überläßt jedem
lokalen Knoten die Arbeit, das tatsächlich irgendwo auf eine Platte zu
malen.

```console
[root@hadoop-115 finalized]# pwd
/srv/hadoop/data01/dfs/dn/current/BP-1321238634-10.196.68.149-1338912643577/current/finalized
[root@hadoop-115 finalized]# ls -lh blk_1025864654234871634*
-rw------- 1 hdfs hdfs 128M Jun  6 13:37 blk_1025864654234871634
-rw------- 1 hdfs hdfs 1.1M Jun  6 13:37 blk_1025864654234871634_8941.meta
```

Das Mountschema im Beispiel ist /srv/hadoop/data{n}.  Auf jeder lokalen
Platte gibt es einen Ordner /dfs/dn (Distributed Filesystem, Datanode), in
dem die Blöcke abgelegt werden.  Wir sehen hier irgendeinen namenlosen 128
MB Block und die Metadaten zu diesem Block.  Man braucht die Daten der
Namenode, um aus diesen Dateifetzen wieder sinnvoll benannte und eingereihte
Dateien zusammenzusetzen.

Dabei geht das System durchaus pfiffig vor.

Zum einen will man ja, daß die Daten redundant gespeichert sind.  Daher
werden per Default 3 Kopien von jedem Block angelegt, und natürlich liegt
jede Kopie auf einer anderen Maschine.  Tatsächlich kann man in die Namenode
einen Rackverteilungsplan einpflegen und dann sorgt die Namenode auch dafür,
daß zwei der Kopien vergleichsweise dicht beeinander liegen und eine weiter
entfernt, in einem anderen Rack.  So ist sichergestellt, daß immer
mindestens eine Kopie der Daten erhalten bleibt - auch dann, wenn mal ein
ganzes Rack umfällt, der Switch oben im Rack verendet oder ein Sack
fehlgeschlagener Kernelupdates einen Teil der Rechenzentrums-Population
auslöscht.

![Schreibzugriff](/uploads/hadoop-write.png)

Ein Schreibzugriff in ein HDFS hinein.

Zum anderen will man auch, daß der ganze Kram parallel abläuft.  Daher führt
die Namenode die Schreibvorgänge weder durch noch koordiniert sie diese. 
Sie dient lediglich als Verzeichnisdienst: Sie sagt dem Client, wo ein Block
hingeschrieben wird, und der Client sendet diesen Block an die entsprechende
Datanode.  Diese schreibt ihn lokal und reicht in an die zweite Datanode
weiter - dieser Traffic ist aber Rack-intern.  Die zweite Datanode schreibt
sich den Block ebenfalls auf eine Platte und reicht ihn nun über die
Rackgrenze und die damit involvierten Switches hinweg an eine Node in einem
anderen Rack weiter, die den Block ebenfalls noch ein drittes Mal schreibt. 
Die Bestätigungen für diese Operationen laufen denselben Weg den sie
gekommen sind wieder zurück (und gehen parallel dazu auch noch einmal an die
Namenode) und so weiß der Client, wenn er eine Bestätigung gesehen hat, daß
alles geklappt hat und der Block jetzt redundant und persistent gespeichert
ist.

Da wir von jedem Block 3 Kopien anlegen, bedeutet das natürlich, daß wir für
ein Terabyte Nutzdaten 3 Terabyte Plattenplatz (und ein wenig Metadaten)
wegnaschen.

Hadoop versucht außerdem, die Blöcke einer Datei möglichst breit über den
Cluster zu schmieren, also eine Datei über möglichst viele Datanodes zu
verteilen.  Das hat einerseits Geschwindigkeitsvorteile, wenn man parallel
schreibt, andererseits macht es die spätere Verarbeitung der Daten
schneller.

So können wir eine Datei zum Beispiel lesen, indem wir bei der Namenode eine
Blockliste für die gesuchte Datei anfordern und dann parallel von allen
Nodes, die die Daten haben, aus dem Netzwerk laden.  Mehr Knoten bedeutet
hier mehr CPUs und mehr Plattenspindeln, also mehr Speed.  Das ist besonders
dann interessant, wenn Daten von einem Cluster zu einem anderen kopiert
werden - so eine massiv parallele Datenverschiebung bringt jede
Netzwerkinfrastruktur an die Sättigungsgrenze.  Und das, obwohl wir billige
Einzelkomponenten eingekauft haben.

Der Punkt ist, daß HDFS diesen Komponenten nicht traut: Datanodes müssen
sich alle paar Sekunden bei ihrer Namenode per TCP Heartbeat melden, und in
regelmäßigen Abständen auch Blockreports machen - dadurch weiß die Namenode,
welche Blocks zu welcher Platte in einer Datanode gehören, wieviel freier
Platz vorhanden ist usw.

Fällt eine von den Datanodes um oder geht auch nur eine Platte in der
Datanode offline, geht die Namenode los und weist die überlebenden Datanodes
für einen Block an, die notwendige Anzahl von Blockkopien wieder
herzustellen - der Cluster flackert kurz mit den Plattenlampen und alles ist
wieder gut - sogar, falls irgend möglich, im Rahmen der Redundanzregeln des
Rackverteilungsplans.

Irgendwann später schickt man einen Azubi mit einem Einkaufskorb voller
Austauschplatten, Gehörschutz und dem Auftrag auszumisten in das RZ und
danach stimmt die Clusterkapazität wieder.

Was passiert, wenn eine Platte in einer Datanode nicht umfällt, sondern
schimmelig wird und die Daten darauf verändert?  HDFS speichert großzügig
Prüfsummen an jedem Objekt und würde dies vergleichsweise schnell
mitbekommen - entweder beim nächsten Zugriff oder wenn der Cluster sich
langweilt und aus Verlegenheit sowieso mal seine Prüfsummen durchprüft. 
Blöcke mit kaputten Prüfsummen werden kurzerhand abgemurkst, dann stimmt
aber die Anzahl der Kopien für diesen Block nicht mehr und die Namenode wird
tätig wie oben, um diese Situation zu korrigieren.
