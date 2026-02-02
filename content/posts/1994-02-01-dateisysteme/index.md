---
author: isotopp
date: "1994-02-01T09:00:00Z"
feature-img: assets/img/background/rijksmuseum.jpg
tags:
- lang_de
- publication
- unix
title: "UNIX Dateisysteme"
aliases:
  - /1994/02/01/dateisysteme.html
---

# UNIX Dateisysteme

**aus »c't - Magazin für Computertechnik«, Ausgabe 2/94**

*Die Aufgaben eines Betriebssystems bestehen in der fairen Zuteilung der Systemressourcen an alle Bewerber und in der Abstraktion unterschiedlichster Hardware zu einer virtuellen Maschine. 
Für den Bereich der Plattenplatzverwaltung hat diese Aufgabe das Dateisystem. 
UNIX Dateisysteme haben eine mehr als zwanzigjährige Entwicklung hinter sich und dienten als Vorbild für die Dateisysteme vieler anderer Betriebssysteme.
Trotz vieler Mängel der ursprünglichen Implementation haben sich die dahinter stehenden Ideen in den letzten zwanzig Jahren nicht wesentlich verändert.*

## Daten wiederfinden

UNIX schlägt sich auf den höheren Ebenen des Betriebssystems nicht mit Angaben zur Plattengeometrie herum. 
Es betrachtet eine Festplatte als ein langes Band von Plattenblöcken, die linear durchnummeriert sind.
Die Umrechnung von linearen Blockadressen in Angaben von Zylinder, Kopf und Sektor ist entweder Aufgabe eines Festplattengerätetreibers 
oder - im Fall von SCSI - der Festplatte selbst.
Die ersten paar Datenblöcke einer Festplatte sind reserviert für den Bootloader und ähnliche Dinge,
die vor dem Betriebssystem geladen werden und deshalb außerhalb seiner Reichweite gelagert werden.
Der Rest der Platte wird in Form eines Dateisystems verwaltet.
UNIX operiert bei Dateisystemen mit der Blockgröße des Mediums.
Anders als bei DOS werden die Verwaltungseinheiten auf einer Platte also nicht größer, wenn man sehr große Partitionen anlegt.

Den Anfang eines Dateisystems bildet der sogenannte Superblock, der das Dateisystem selbst beschreibt. 
Er enthält Geometriedaten der Platte, gibt an, wie viele Blöcke das Dateisystem enthält und welche davon Verwaltungsinformationen und welche Daten enthalten.

![](1994/02/disklayout.gif)

*Bild 1: Am Anfang des Dateisystems steht der Superblock. 
Er enthält alle Metainformationen, die das Dateisystem beschreiben. 
Der "vordere" Teil des Dateisystems enthält I-Nodes, Dateiköpfe, die alle Metainformationen über eine Datei speichern. 
In den Datenblöcken sind dann die eigentlichen Nutzdaten untergebracht.
Das Bild zeigt eine I-Node mit ihren Verweisen auf die Datenblöcke der Datei.*

Die Basis der Dateiverwaltung bildet in UNIX eine Datenstruktur, die sogenannte *index node* oder I-Node (Bild 2).

In ihr sind - mit einer Ausnahme, dem Dateinamen - alle wesentlichen Informationen über eine Datei gesammelt.
Für jede Datei, jedes Verzeichnis und jedes Gerät legt UNIX eine I-Node an, in der es alles vermerkt, was es über dieses Datenobjekt weiß.
Dazu gehören zum einen Informationen über Zugriffsrechte, Dateieigentümer und Zeitmarken, zum anderen Verweise auf die Datenblöcke, die die Daten der Datei enthalten.
Ursprünglich hat UNIX die I-Nodes eines Dateisystems in Form einer Tabelle zusammengefasst und am Anfang des Dateisystems untergebracht. 

Die Größe dieser Tabelle muss schon beim Anlegen des Dateisystems festgelegt werden, 
d.h. ein Systemverwalter auf einem UNIX-Rechner muss beim Formatieren einer Platte festlegen,
wie viele Dateien später einmal maximal auf dieser Platte angelegt werden können.
Üblicherweise berechnet man mindestens eine I-Node für jeweils 4 KB zur Verfügung stehenden Plattenplatz, 
sodass auf einer 200 MB Festplatte in etwa 50 000 I-Nodes angelegt werden.
Zum Glück sind I-Nodes relativ kleine Datenstrukturen von nur 128 Bytes. 
Im Schnitt verschwinden also auf diese Weise 3 % des gesamten Plattenplatzes in Verwaltungsinformationen.

```console
struct  dinode
{
/*	Typ     Feldname          Byte-Offset: Beschreibung */
	u_short ino_mode;        /*  0: Dateityp und Zugriffsrechte */
	short   ino_nlink;       /*  2: Anzahl der Namen der Datei  */
        uid_t   ino_uid;         /*  4: Benutzernummer Dateieigentümer */
	gid_t   ino_gid;         /*  6: Gruppennummer Dateieigentümer */
	off_t   ino_size;        /*  8: Größe in Bytes */
	time_t  ino_atime;       /* 16: Zeit des letzten Lesezugriffs */
	long    ino_atspare;     /*     in Sekunden seit 1.1.1970, 0 Uhr */
	time_t  ino_mtime;       /* 24: Zeit des letzten Schreibzugriffs */
	long    ino_mtspare;
	time_t  ino_ctime;       /* 32: Zeit der letzten Statusänderung */
	long    ino_ctspare;
        daddr_t ino_db[NDADDR];  /* 40: Blocknummern der ersten 12 Datenblöcke */
        daddr_t ino_ib[NIADDR];  /* 88: Blocknummern der 3 indirekten Datenblöcke */
        long    ino_blocks;      /* 100: Größe der Datei in Blöcken */
        long    ino_gen;         /* 104: Generationsnummer (NFS) */
};
```

*Bild 2: Aufbau einer I-Node eines modernen UNIX-Dateisystems. 
Die Datenstruktur paßt in ein Feld von 128 Bytes, 
sodass ein Hardware-Plattenblock 8 I-Nodes halten kann.
Sie enthält alle Metainformationen über eine Datei mit Ausnahme der Namen der Datei.*

Untersucht man die durchschnittliche Länge von Dateien in einem Dateisystem, dann stellt man fest, das kurze Dateien relativ häufig auftreten.
Daher versucht UNIX, die Blocknummern der ersten paar Plattenblöcke einer Datei direkt in der I-Node zu speichern. 
In der I-Node aus Bild 2 werden die ersten 12 Datenblöcke einer Datei im Feld `ino_db[]` abgelegt.
Wenn über ihre I-Nodenummer auf diese Datei zugegriffen wird, stehen die 12 direkten Datenblöcke der Datei also ohne weitere Leseoperation zur Verfügung.

Für große Dateien ist dieses Verfahren natürlich nicht praktikabel, denn die I-Node würde dann sehr groß werden.
Wächst eine Datei über die Größe von 12 Datenblöcken hinaus, 
besorgt UNIX einen freien Datenblock und trägt diesen als ersten indirekten Datenblock einer Datei ein.
In diesem indirekten Datenblock werden jetzt die Blocknummern der weiteren Datenblöcke einer Datei abgelegt.
Bei einer angenommenen Blockgröße von einem Kilobyte können in einem indirekten Block 256 Blocknummern gespeichert werden, 
von denen jede einen Datenblock von einem Kilobyte adressiert.
Zusammen mit den direkten Datenblöcken können also Dateien bis zu einer Größe von 266 KB angelegt werden,
ohne daß mehr als eine Ebene der Indirektion durchlaufen werden muss.
Modernere Dateisysteme, die mit einer Blockgröße von 8 Kilobyte arbeiten, bringen 2048 Blocknummern in einem Block unter 
und können so bis zu 16 Megabyte große Dateien mit einem einzigen indirekten Block verwalten.

Für noch größere Dateien sieht UNIX doppelt indirekte Blöcke vor, die die Blocknummern von einfach indirekten Blöcken enthalten. 
Diese wiederum zeigen dann endlich auf die Daten. 
Bei einer Blockgröße von 8 KB kann man mit diesem Schema schon mehr als die vier Gigabyte verwalten, 
die sich im Größenfeld `ino_size` einer I-Node verwalten lassen.
Bei Dateisystemen mit einer Blockgröße von einem Kilobyte muss dagegen ab einer Dateigröße von 64 MB 
von einem dreifach indirekten Block Gebrauch gemacht werden (Bild 3).
Zum Glück sind zum Laden eines solchen Datenblockes aber keine vier Plattenzugriffe notwendig,
denn alle UNIX-Versionen haben einen Plattencache, der häufig benötigte Daten im RAM präsent hält.

![](1994/02/filestructure.gif)

*Bild 3: Von der I-Node zu den Datenblöcken einer Datei*

Bei der Belegung von Plattenblöcken für eine Datei ist UNIX sehr effizient.
Nur diejenigen Blöcke einer Datei, die schon einmal beschrieben wurden, belegen auch wirklich Platz auf der Platte.
Wird beispielsweise begonnen, einen doppelt indirekten Block zu verwenden, 
so wird für diesen zunächst der erste einfach indirekte Block beschafft und belegt.
Die Blocknummern der anderen indirekten Blöcke werden dagegen einfach auf Null gesetzt.

Das führt zu interessanten Effekten bei Dateien, die nicht durchgehend beschrieben werden:
Legt man unter UNIX eine neue Datei an und bewegt dann den Dateizeiger irgendwo in die oberen Megabytes, 
um dort ein einziges Byte zu beschreiben, dann wird nur der eine Datenblock belegt, 
der notwendig ist, um dieses Byte zu speichern (plus der möglicherweise notwendigen indirekten Blöcke, die notwendig sind, um den Block zu erreichen).
Die Blocknummer aller anderen nicht verwendeten Blöcke bleiben auf Null stehen 
und es werden auch keine Datenblöcke zwischen dem gespeicherten Byte und dem Dateianfang angefordert.
Es entsteht eine Datei, die in der Verzeichnisausgabe viele Megabytes groß erscheint, in Wirklichkeit aber nur wenige Kilobytes belegt.
Eine solche Datei nennt man in UNIX eine dünn besetzte Datei (sparse file).
Beim Lesen einer solchen Datei werden für die nicht vorhandenen Blöcke entsprechend viele Nullbytes zurückgemeldet.

Das kann beim Kopieren oder Sichern solcher Dateien natürlich zu seltsamen Effekten führen, wenn man nicht aufpasst:
Beim naiven Kopieren wird eine Datei von vorne nach hinten durchgelesen und die gelesenen Daten werden in die Zieldatei geschrieben.
Während eine dünn besetzte Quelldatei also möglicherweise nur wenige Blöcke wirklich belegt, wird die Zieldatei von vorne nach hinten beschrieben und belegt dann wirklich so viel Platz, wie im Verzeichnis angegeben.
Dateien, die ein Abbild eines häufig ebenfalls dünn besetzten Prozessadressraumes darstellen, sind oft sparse files:
Die shared libraries in einem Linux-System oder Speicherabzüge von gecrashten Programmen unter SunOS sollten tunlichst nicht naiv kopiert werden.

## Dateinamen

Die I-Node enthält gesammelt alle Informationen, die UNIX über eine Datei hat, mit einer Ausnahme: dem Dateinamen.
Dateinamen speichert UNIX in besonderen Dateien, den Verzeichnissen.
Ein Verzeichnis ist n jeder Hinsicht eine normale Datei mit einer I-Node, Datenblöcken und so weiter.
Verzeichnisdateien werden jedoch nicht von Benutzerprogrammen, sondern ausschließlich vom Betriebssystem verwaltet.
Es unterhält in einem Verzeichnis eine feste Satzstruktur.

Beim älteren UNIX-Dateisystem ist diese sehr einfach aufgebaut:
Ein Verzeichnis besteht aus Datensätzen zu 16 Byte Länge. 
Die ersten 2 Byte enthalten die I-Nodenummer einer Datei, die folgenden 14 Byte nehmen einen Dateinamen auf.
Falls ein Dateiname kürzer als 14 Zeichen ist, wird er einfach mit Nullbytes aufgefüllt.
Bei moderneren UNIX-Systemen ist die Verzeichnisstruktur etwas komplizierter, um 4 Byte lange I-Nodenummern und bis zu 255 Byte lange Dateinamen ohne große Platzverschwendung verwalten zu können, aber im Prinzip handelt es sich immer noch um eine einfache Zuordnung von Name zu I-Nodenummer.

Es ist in UNIX ohne weiteres möglich, mehr als einen Dateinamen für eine Datei zu vergeben.
Dazu wird einfach mit der Systemfunktion link() in einem weiteren Verzeichnis ein Namenseintrag gemacht, der dieselbe I-Nodenummer hat wie der erste Name der Datei.
Im Feld `ino_nlink` einer I-Node wird die Anzahl der Namen einer Datei gezählt.
Beide Namen einer Datei sind gleichberechtigt und nicht voneinander zu unterscheiden:
Man kann nicht sagen, welcher von zwei Namen einer Datei der erste und welcher der zweite Name der Datei war.
Anstatt eine Datei zu löschen, kann man in UNIX nur die Anzahl ihrer Namen um Eins vermindern.
Sobald die Anzahl der Namen einer Datei Null wird, gibt das Betriebssystem dem Plattenplatz frei, der zu einer Datei gehört.

![](1994/02/verzeichnis.gif)
*Bild 4: Das alte System V UNIX Dateisystem behandelt Verzeichnisse als gewöhnliche Dateien mit einer festen Satzstruktur von 16 Byte. Die ersten beiden Byte enthalten die I-Node Nummer einer Datei, die folgenden 14 Bytes stellen den Namen der Datei (mit Nullbytes aufgefüllt) dar.*

*Im BSD Dateisystem sind längere Dateinamen erlaubt. Um die Platzverschwendung zu minimieren, ist die Struktur eines Verzeichnisses etwas komplizierter, aber das Prinzip der Zuordnung eines Namens zu einer
I-Nodenummer wird nicht verletzt.*

Um eine Datei zu öffnen, muss ihr Name in eine I-Nodenummer übersetzt werden.
Nach dem Öffnen der Datei arbeitet das Betriebssystem dann intern ausschließlich mit der I-Nodenummer weiter.
Die Übersetzung von Namen in Nodenummern wird in UNIX an einer zentralen Stelle im Betriebssystemkern abgehandelt, in der Kern-internen Funktion `namei()`.
Für jeden Prozess verwaltet UNIX in der Prozessstruktur zwei Einträge, in denen die I-Nodenummer des Hauptverzeichnisses und des aktuellen Verzeichnisses dieses Prozesses hinterlegt sind.
Wenn dem Betriebssystem in einem Systemaufruf ein Pfadname übermittelt wird, wird zunächst geprüft, ob es sich um einen absoluten oder relativen Pfadnamen handelt.
Je nachdem, ob der Pfadname mit einem führenden "`/`" beginnt, wird entweder im Hauptverzeichnis oder im aktuellen Verzeichnis des Prozesses begonnen, den Pfadnamen aufzulösen.
`namei()` isoliert dazu die erste Komponente des Pfadnamens und sucht diese im Startverzeichnis der Suche.
Sobald der gesuchte Namenseintrag dort gefunden ist, kann die zugehörige I-Nodenummer abgelesen werden und das nächste Stück des Pfadnamens aufgelöst werden. 

In Bild 5 ist zu sehen, was bei der Auflösung eines Pfadnamens wie "`/bin/ls`" passiert:
Weil der Pfadname mit einem "`/`" beginnt, durchsucht `namei()` das Hauptverzeichnis des Prozesses, der den Systemaufruf getätigt hat, nach einem Eintrag für "`bin`".
Sobald die I-Nodenummer für das "`bin`"-Verzeichnis gefunden ist, kann es nach einem Eintrag für "`ls`" durchsucht werden.
Erst wenn die I-Nodenummer von "`ls`" bekannt ist, kann die Datei geöffnet oder geladen werden. 
Bei der Auflösung von Pfadnamen ergibt sich also eine wechselseitige Verkettung von Datenblöcken und I-Nodes: I-Nodes enthalten Zeiger auf Datenblöcke und die Datenblöcke eines Verzeichnisses enthalten Zeiger auf I-Nodes.

![](1994/02/nameiresolver.gif)

*Bild 5: Zugriffe beim Auflösen eines Pfadnamens*

## Zugriffsrechte

In der I-Node existiert ein Feld `ino_mode`.
Es enthält neben anderen Informationen 9 Bits, die die Zugriffsrechte auf die Datei festlegen.
UNIX unterscheidet an jedem Objekt im Dateisystem 3 Rechte: r-Recht bestimmt, ob eine Datei zu Lesen geöffnet werden darf, w-Recht bestimmt, ob eine Datei beschrieben werden darf und x-Recht bestimmt, ob eine Datei ausgeführt werden kann.
Diese Rechte rwx sind jeweils einmal für den Eigentümer der Datei, für Angehörige seiner Benutzergruppe und für den Rest der Welt vorhanden, sodass sich insgesamt 9 Rechte-Bits ergeben.

Da Verzeichnisse auch Dateien sind, haben auch sie diese Zugriffsrechte.
In Zusammenhang mit Verzeichnissen werden sie jedoch etwas anders interpretiert: r-Recht an einem Verzeichnis erlaubt einem Benutzer, die Namensliste eines Verzeichnisses zu lesen. 
w-Recht an einem Verzeichnis gestattet es ihm, Dateien anzulegen oder zu löschen.
x-Recht schließlich ist notwendig, um auf die Dateien in einem Verzeichnis zuzugreifen. In Bild 5 ist zu sehen, an welchen Stellen welche Zugriffsrechte geprüft werden, wenn die Datei "`/bin/ls`" zum Lesen geöffnet werden soll:
Zunächst einmal muss am Hauptverzeichnis x-Recht vorhanden sein, damit auf die Datei "`bin`" zugegriffen werden kann, die im Hauptverzeichnis enthalten ist. 
Danach wird auf ein x-Recht am "`bin`"-Verzeichnis geprüft, um auf die Datei "`ls`" zugreifen zu können.
Und schließlich muss an der Datei "`ls`" selbst noch r-Recht vorhanden sein, damit auf die Datenblöcke der Datei lesen zugegriffen werden darf. 

x-Recht an einem Verzeichnis ist also immer dann erforderlich, wenn `namei()` einem Zeiger aus diesem Verzeichnis in die I-Nodetabelle folgen muss.
In Bild 5 sind diese aufwärts führenden Pfeile etwas dicker hervorgehoben.

## Fragmente

Dateisysteme verwalten den Plattenplatz in Form von Blöcken fester Größe.
Deswegen ist am Ende der meisten Dateien ein Block vorhanden, der nicht ganz ausgenutzt werden kann, denn bei den meisten Dateien ist die Dateilänge nicht genau ein Vielfaches der Blockgröße des Dateisystems.
So geht, abhängig von der mittleren Dateigröße und der Blockgröße des Dateisystems ein mehr oder weniger großer Anteil des Plattenplatzes verloren.
Je kleiner die Verwaltungseinheiten des Dateisystems sind, umso effektiver kann es seinen Platz verwalten.
Andererseits ist der Datendurchsatz eines Dateisystems um so größer, je größer die Blöcke sind, die es verwaltet.
Und schließlich kann man bei der Verwendung von großen Datenblöcken oft mehrfach indirekte Blöcke einsparen und macht das Dateisystem auf diese Weise schneller und reduziert den Verwaltungsaufwand.
In modernen UNIX-Dateisystem löst man dieses Dilemma, indem man ein Dateisystem mit einer relativ großen Blockgröße (meistens 8 Kilobyte) anlegt, Dateienden aber in speziellen Blöcken, den Fragmenten, speichert.
Fragmente werden erzeugt, in dem man einen normalen Plattenblock in mehrere gleich grosse Teilblöcke unterteilt, die jeweils das Dateiende einer anderen Datei aufnehmen können. 

![](1994/02/bsdfragment.gif)

*Bild 6: Zwei Dateienden in einem fragmentierten Block*

Auf diese Weise werden die Dateienden verschiedener Dateien praktisch in einem Block zusammen komprimiert und der Verlust an Plattenplatz durch nicht ausgenutzte Blöcke wird reduziert.
Trotzdem kann das Dateisystem die meiste Zeit mit vollständigen, großen Blöcken arbeiten und so hohe Geschwindigkeiten erreichen.
Der Nachteil dieses Systems ist, daß ein Dateiende unter Umständen mehrfach umkopiert werden muss, wenn eine Datei wächst:
Zunächst passt das Dateiende noch in sein Fragment hinein, wenn es wächst, muss jedoch ein größeres Fragment gesucht werden, das jedoch durch weitere Schreiboperationen sofort wieder überläuft, bis die Datei endlich den nächsten vollständigen Block füllt.
Solche Kopieroperationen lassen sich vermeiden, wenn Anwendungsprogramme ihre Schreiboperationen der Blockgröße des Dateisystems anpassen.
Da so etwas sehr unbequem ist, wenn man es selber programmieren muss, nimmt die C-Standardbibliothek in einem UNIX-System einem diese Arbeit ab:
Sie fragt die Blockgröße des unterliegenden Dateisystems ab und stimmt ihre Schreibzugriffe so ab, daß mit maximaler Geschwindigkeit geschrieben werden kann.

Weitere Geschwindigkeitsvorteile lassen sich erzielen, wenn man dafür sorgen kann, daß Dateien möglichst hintereinanderliegende Blöcke auf einer Platte belegen.
Die Platte kann in diesem Fall ihren internen Cache füllen und die Daten schneller abliefern.
Außerdem entfallen Bewegungen des Schreib-/Lesekopfes der Platte.
Wie man am Beispiel von DOS sehen kann, ist es leider ist es nicht damit getan, die Blöcke einer Datei hintereinander anzuordnen.
Man muss ausserdem auch Platz lassen, damit Dateien wachsen können.

![](1994/02/fragmentierung.gif)

*Bild 7: Durch unkluge Anordnung von Daten zerstückelt MS-DOS Dateien in kleine, nicht zusammenhängende Fragmente.*

Moderne UNIX-Dateisysteme unterteilen eine Festplatte deswegen in Streifen von einigen Megabyte Größe, sogenannte cylinder groups.
Jeder dieser Streifen enthält eine eigene kleine I-Nodetabelle und seinen Anteil an Datenblöcken.
Neue Dateien werden in derjenigen Zylindergruppe angelegt, die im Verhältnis am meisten freie Datenblöcke aufzuweisen hat.
Dadurch wird sichergestellt, daß solche Dateien gerade nicht direkt hintereinanderliegen, sondern genügend freien Platz haben, um zu wachsen.
Bei sehr langen Dateien wird außerdem nach dem Schreiben von jeweils einem Megabyte an Daten ein Wechsel der Zylindergruppe erzwungen:
Man geht davon aus, daß man sehr lange Dateien sowieso nicht in einem Stück zusammenhängend lagern kann.
Stattdessen versucht man, die einzelnen Stücke möglichst groß zu machen. 

![](1994/02/bsdlayout.gif)

*Bild 8: Das BSD Fast Filing System unterteilt die Platte in Streifen von einigen MB Größe. Das Betriebssystem versucht durch verschiedene Verfahren, 
das Verhältnis von belegten Datenblöcken zu belegten I-Nodes in allen cylinder groups einer Platte in etwa ausgewogen zu halten. Dadurch ist das Dateisystem effektiv selbst defragmentierend.*

Außerdem würde eine sehr lange Datei alle Datenblöcke, aber nur eine einzige I-Node in einer Zylindergruppe belegen.
Die Daten zu den I-Nodes aller weiteren Dateien in derselben Zylindergruppe müssten dann auf andere Zylindergruppen verlagert werden, was dort wiederum das ausgewogene Verhältnis zwischen freien I-Nodes und freien Datenblöcken stören würde.
Dadurch, dass man jeweils ein Megabyte einer sehr großen Datei auf eine andere Zylindergruppe verlagert, wird der Platz auf der Platte gleichmäßig verbraucht.
Man verhindert, daß andere Dateien dann nicht mehr günstig auf der Platte angeordnet werden können.

## Abgeleitete Dateisysteme

Die grundlegenden Strukturen des UNIX-Dateisystems wurden von Ritchie und Thompson vor 20 Jahren in den Laboratorien von AT&T entwickelt und haben sich grundsätzlich bewährt.
Selbst das Entwicklerteam von BSD UNIX, das das Dateisystem vor 10 Jahren einer gründlichen Überarbeitung unterzogen hat, hat die zugrundeliegenden Ideen nicht verändert, sondern UNIX lediglich beigebracht, auf die Geometrie der Platte Rücksicht zu nehmen, um weitere Geschwindigkeitsgewinne zu erzielen.

Das UNIX-Dateisystem ist dem nur halb so alten, aber wesentlich weniger effektiv organisierten MS-DOS Dateisystem in Sachen Geschwindigkeit, Zugriffsschutz und Benutzerfreundlichkeit weit überlegen.
Die Ideen der UNIX-Entwickler waren letztlich so überzeugend, daß sie sich letztendlich im OS/2 HPFS und schließlich auch im Dateisystem von Windows NT wiederfinden.

![](1994/02/mount.gif)

*Bild 9: 26 Laufwerksbuchstaben wären für eine gut ausgelastete Workstation viel zu wenig. UNIX kennt deswegen nur einen einzigen Dateibaum. Beim Anmelden (mounten) eines Dateisystems wird eine Platte an einer
bestimmten Stelle in den Verzeichnisbaum eingehängt. Beim Wechsel des Verzeichnisses wechselt man so auch gleich die Platte oder bei Netzwerkplatten sogar den Rechner, auf dem man aktiv ist.*


# Literatur

- "The UNIX Time Sharing System", Ritchie, Thompson, Communications of the ACM 7/74, p.365  
- "A Fast File System for UNIX", McKusick et al, ACM Trans. on Computer Systems, August 84, p.181
- "Operating Systems", A. Tanenbaum, Prentice-Hall
- "The Design of the UNIX Operating System", M. Bach, Prentice-Hall
- "The Design of the 4.3 BSD UNIX Operating System", McKusick, Addison-Wesley
- "Advanced Programming in the UNIX Environment," W. R. Stevens, Addison-Wesley
