---
layout: post
published: true
title: Automatisierung und Skalierung
author-id: isotopp
date: 2011-02-17 17:09:00 UTC
tags:
- architektur
- mysql
- work
- lang_de
feature-img: assets/img/background/mysql.jpg
---
Ich hatte im Vorfeld der OSDC 2011 eine interessante Unterhaltung mit Julian
Hein zum Thema Automatisierung. Er wollte, daß ich einmal erkläre, warum man
das eigentlich tut - und was man da eigentlich tut.

Die Antwort ist ein wenig länger, und weil ich dieses Jahr nicht zur OSDC
fahren kann und dort auch nicht reden kann, will ich einmal versuchen,
meinen Text zumindest in groben Zügen hier aufzuschreiben.

> Die Zusammenfassung ist jedenfalls, daß Automatisierung kein technisches
> Problem ist.

Aber von vorne:

Ich komme von MySQL, aus einem Consultingumfeld, und ich habe dort mit
Kunden in jeder möglichen Betriebsgröße zu tun gehabt - von einzelnen MySQL
Servern hin bis zu Leuten, die wirklich große Setups am Laufen gehabt haben.

Darum habe ich mich vor Jahren im Vorfeld der MySQL Enterprise Manager (MEM,
"Merlin") Entwicklung auch mit dem Merlin-Team unterhalten und versucht zu
erklären, was ich mir unter einem "Enterprise Manager" denn so vorstelle und
wieso. Die Entwicklung ist dann aus einer ganzen Reihe von inzwischen
hinfällig gewordenen betriebsinternen Gründen ganz anders gelaufen, aber das
ist eine andere Geschichte, die ein anderes Mal erzählt werden soll.

Inzwischen bin ich in einer Firma, die noch vor drei oder vier Jahren eine
gerade eben zweistellige Gesamtanzahl von Servern am Laufen hatte, und deren
Maschinenpark sich jetzt im vierstelligen Bereich bewegt - mit einer großen
dreistelligen Anzahl von MySQL-Instanzen. Ohne Automatisierung könnten wir
das mit der vorhandenen Anzahl von Personen gar nicht stemmen.

Aber Automatisierung ist mehr, als einfach nur einen Haufen Scripte zu
schreiben, die dann Aufgaben übernehmen, obwohl es wohl in den meisten
Firmen so anfängt.

Zum Beispiel: 

Jemand muß einen Server zum wiederholten Male installieren, oder schlimmer
noch, einer anderen Person erklären, wie man "bei uns" Server installiert,
also was unter allen möglichen Wahlmöglichkeiten die Entscheidungen und
Designideen sind, die "bei uns" getroffen wurden und wieso.

In Läden, die ein wenig schlauer arbeiten, geht das meistens mit der
Installation eines Installservers einher, und so kann man Kisten dann aus
dem Netz booten, und sie malen sich dann ein Betriebssystem und einen Haufen
Zusatzsoftware und Konfiguration auf die Platte. Dabei werden dann noch mehr
Entscheidungen und Überlegungen getroffen, die durch den automatisierten
Installationsprozeß umgesetzt werden.

Was also wie ein wenig Gescripte aussieht, ist in Wirklichkeit die
Definition und Realisierung eines Prozesses - genau genommen die
Formalisierung eines Prozesses "Server aufsetzen" in der Firma. Das Ziel des
Prozesses ist die Produktion einer neuen Maschine, die einer gewissen
Spezifikation möglichst gut entsprechen soll. Dabei sind die Prozeßziele die
möglichst genaue Einhaltung der Spezifikation, und die möglichst schnelle
Abwicklung des Auftrages. Dabei ist das Wissen eines Experten in
Programmcode auskristallisiert worden - den Hilfs-Scripten und Anpassungen
des Installationsservers.

Die weitere Diskussion über den Prozeß findet in Form von Patches zu diesem
Code ihren Niederschlag - zwar redet man über den Prozeß und wie man ihn
verändern, anpassen oder erweitern will, aber keine dieser Absprachen hat
eine Auswirkung auf die Durchführungen des Prozesses, bevor der
entsprechende Patch nicht geschrieben und im
[DCVS](http://en.wikipedia.org/wiki/Distributed_Concurrent_Versions_System) eingecheckt worden ist.

Aber Code ist nur ein Teil eines Prozesses - meistens die technische Seite
der ganzen Geschichte. Prozesse haben in Wirklichkeit immer mindestens drei
Aspekte - neben der Technik- noch die Organisations- und die Personalseite
der Angelegenheit. Außerdem kommt zu jedem Definitionsteil (den Regeln) auch
noch ein Kontrollteil (die Einhaltung der Regeln messen) dazu.

![](/uploads/verkehr.png)

Straßenverkehr

Ein bekannter und von jedem verstandener Prozeß ist zum Beispiel der
öffentliche Straßenverkehr. Dieser hat eine organisatorische Seite -
Verkehrsregeln, Definition von Verkehrszeichen und so weiter, eine
personelle Seite - Ausbildung der Verkehrsteilnehmer in der Schule, der
Fahrschule und so weiter, und eine technische Seite - Fahrzeugsysteme,
stationäre Verkehrssysteme wie Ampeln, und so weiter. Für jeden Bereich gibt
es Kontrollteile - die Verkehrspolizei überwacht die Einhaltung des
organisatorischen Teils, die Fahrprüfung ist eine Kontrolle der Ausbildung,
und der TÜV ist eine Kontrolle der Technik.

Ebenso finden wir diese Teile in kleiner bei unserem
Server-Installationsprozeß wieder. Wir finden einen organisatorischen Teil,
also eine Diskussion darüber, was wir mit dem Installserver für ein Problem
lösen wollen und welche nicht (Abgrenzung und Scope: "Nach der Installation
des Basissystem wird dieses durch Puppet personalisiert, der Installserver
soll nur eine allgemeine Basisinstallation durchführen"). Wir finden einen
Personalteil, meistens in Form von Wikipages mit Dokumentation realisiert,
und dazu Fortbildungsveranstaltungen für neue Mitarbeiter ("Unser
Installserver und wie man ihn benutzt und anpaßt"). Und wir finden den
technischen Teil, also den Server selber.

Die Kontrollinstanzen sind bei vielen Prozessen weniger stark ausgeprägt als
bei einem großen und unter Umständen gefährlichen System wie dem
Straßenverkehr, existieren aber je nach Wichtigkeit des Prozesses durchaus -
zum Beispiel wird von einem neuen Sysadmin nach dem Kurs verlangt, eine
triviale Änderung am Installserver durchzuführen und dann eine Kiste mit dem
Teil selbstständig, aber unter Aufsicht zu installieren. Und natürlich guckt
man, ob der Installserver noch geht und ob die gelieferten Ergebnisse noch
den Anforderungen entsprechen.

Merlin, also der MySQL Enterprise **Manager** ist nun ein gutes Beispiel für
das Versagen bei der Umsetzung eines solchen Konzeptes. Also, MEM ist ein
gutes und nützliches Monitoring-Werkzeug und wir könnten eine Installation
unserer Größe ohne die Hilfe von Merlin nicht fahren. Aber im Lichte der
voranstehenden Diskussion kann man erkennen, wie Merlin zu kurz greift.

Das beginnt schon damit, daß Merlin überhaupt genau gar nichts _managed_. Es
ist ein reines Monitoringwerkzeug, das zwar Graphen liefert, Queries findet
oder Alarme generiert, aber es _automatisiert_ nichts, genau genommen
verändert es nichts an einem laufenden System. Es ist ein **Monitor**, aber
kein **Manager**.

Wollte man die Prozesse in einem großen MySQL Deployment automatisieren,
dann müßte man sich erst einmal einen Katalog von Tätigkeiten machen, die in
Operations und in Development bei einer Datenbank so anfallen:

Der Operations DBA plant ein Deployment, installiert Datenbanken, prüft und
verändert Konfigurationen (Configuration Management), muß deswegen Server
starten und stoppen, plant und führt Upgrades durch (Change Management),
überwacht den Betrieb (Monitoring), managed lokale Betriebsstörungen
(Incidents), findet gemeinsame Ursachen (Problem Management) und
kommuniziert mit dem Upstream (Support des Herstellers), und prüft ob die
Systemleistung in Zukunft noch ausreicht (Capacity Management). Er
kontrolliert Datensicherung und Restore (Backup, Desaster Recovery).

Der Development DBA ist Teil des Entwicklungsprozesses (sitzt im Scrum
Planning und so weiter mit dabei), hilft und berät beim Schemadesign und der
Datenmodellierung, beim Query Review, findet im Betrieb schlechte Queries,
hilft und berät bei der Optimierung, und plant zusammen mit dem Operations
DBA Schemaänderungen und Konfigurationsänderungen.

Dann würde man sich überlegen und durch Umfrage beim Kunden feststellen, wie
diese Profile in verschiedenen Systemgrößen den ausgestaltet sein werden -
denn wer 10^0 oder 10^1 Server insgesamt am Laufen hat, der wird kaum
zwischen Operations und Development DBA unterscheiden und nicht alle diese
Teilprozesse werden als eigenständige Gebiete identifizierbar sein. Kommt
man dann auf Installationen von 10^2, 10^3 oder 10^4 Servern, sieht das
alles plötzlich ganz anders aus und trifft auf ganz andere Bedürfnisse in
der Ausgestaltung.

Denn obwohl formell die gleichen Leistungen für den Betrieb erbracht werden
müssen, ist durch die schiere Größe der Installation mit einem Mal ein ganz
anderer Problemkomplex im Gesamtbild wichtig.

Zum Beispiel: Um 500 Server in 2 Dutzend Replikationshierarchien an 2
Standorten von MYSQL 5.1 nach 5.5 zu aktualisieren, ist ein Haufen Tests und
dann Upgrades notwendig. Aber selbst wenn man es schafft, 5 Server pro Tag
abzuarbeiten (jeder je nach Größe mit 100G bis 10.000G an Daten), dann
braucht man 100 Arbeitstage, also etwas weniger als ein halbes Jahr, um das
Upgrade auszurollen, falls es nicht zu Komplikationen kommt.

Wünschenswert wäre es aber, das Thema binnen eines Monats (also 20
Arbeitstagen) vom Tisch zu haben - dazu muß man aber Techniken entwickeln,
mit denen man 50 Server oder mehr pro Tag geregelt bekommt. Das ist in
einigen Bereichen der Installation schon von der Plattenleistung und der
Netzwerkkapazität her problematisch, also redet hier der Operations DBA
plötzlich mit Sysadmin, Storage und Network Engineering, die
Vorraussetzungen schaffen müssen, um solche Dinge im regulären Betrieb
abwickeln zu können - denn das nächste Release kommt binnen eines Jahres mit
Sicherheit und Upgrades dürfen keine Ausnahmesituation sein, sondern müssen
als Bestandteil des normalen Systembetriebes durchgeführt werden können.

Und schon werden die Bereiche Organisation und Personal bei nur 10^3 Servern
im Laden dicke fette Punkte auf dem Managementradar.

Zurück zu Merlin: Der MEM taucht in diesem Problembild gar nicht auf - kaum
als Hilfe bei der Planung eines solchen Unterfangens und gar nicht als
Hilfsmittel bei der Umsetzung.

Hätte man Merlin richtig aufgezogen, dann hätte MySQL als Hersteller der
Datenbank sich mit Kunden und Community zusammengesetzt, und eben einen
solchen Katalog von betrieblichen Tätigkeiten des Operations- und des
Development DBA aufgestellt und die Bilder einmal ausgemalt und für die
verschiedenen Betriebsgrößen skaliert.

Danach hätte man zusammen mit Kunden und Community das MySQL Systemhandbuch
erstellt, also einmal mustergültig die Best Practice beim Betrieb von MySQL
dokumentiert und ausgeführt, wie man diese Best Practices für 1, 10, 100,
1000 Server umsetzt - was ist wichtig, was ist unwichtig, wenn man klein
oder wenn man groß ist.

Schließlich hätte man mit seiner Consulting und mit seiner Training- und
Certification-Abteilung, also MySQL Services als Ganzes, dieses Konzept
umgesetzt und in Consulting, Training und Certficiation einfließen lassen,
und dann eine Architektur und Werkzeuge in dieser Architektur erstellt, die
diese Prozesse technisch unterstützen.

All das ist komplett nicht passiert (aus Gründen, die jetzt nicht mehr
zutreffen, und weil Merlin Ziele hatte, die nicht den oben genannten
Anforderungen entsprechen und die jetzt so auch nicht mehr gelten, aber das
ist alles wie gesagt eine andere Geschichte an einem anderen Lagerfeuer).

Hätte man das umgesetzt, könnte ich jetzt vermutlich in Merlin die Liste der
von Oracle releasten MySQL-Versionen auf deren Server sehen, mit grünen
Haken hinter den Pakete, deren digitale Signatur validiert. Ich würde dann
Versionen Servergruppen zuweisen und den Prozeß "Rollout" anstoßen. Merlin
würde das RPM dann in meine lokalen yum Repositories runterladen und das
Puppet-Rezept dieser Gruppen so anpassen, daß die entsprechenden Server
aktualisiert oder neu aufgesetzt werden - aber so gestaggered, daß der
Betrieb davon nicht beeinflußt wird und natürlich auf eine Weise
koordiniert, die Server vor dem Upgrade aus dem Loadbalancer nimmt, und die
die Funktionalität und den Erfolg des Upgrades testet und die Caches
vorglüht, bevor die Kiste in den LB zurück geht.

Man sieht auch in dieser Erklärung schon ein paar weitere wichtige Aspekte
der ganzen Sache: Es ist wichtig, den Scope abzugrenzen und nicht die
Aufgaben anderer Werkzeuge zu übernehmen, sondern diese korrekt zu
integrieren. Weder gilt es das Paketformat und das Paketsystem des
Trägersystems durch was eigenes (einen Bitrock-Installer?) zu ersetzen, noch
die Funktionalität anderer Automatisierungs-Techniken zu duplizieren.
Stattdessen sollte Best Practice Empfehlungen aussprechen und
Kompatibilitäten definieren ("Wir unterstützen Puppet und Chef für Systems
Automation, liefern receipts dafür und integrieren deren Schnittstellen in
unseren Tools"). Und sie sollte sich bewußt sein, daß Kisten nicht alleine
Laufen, sondern Teil eines Systems sind (mit dem LB reden!) und Zustand
haben (Caches müssen warm sein!). Und Paranoia ist ein Admintugend
(Testen!).

Wenn man Automatisierung also nicht auf dem Anwenderlevel, sondern auf dem
Level eines Herstellers betrachtet, dann ist Automatisierung noch viel
weniger ein technisches Problem als auf dem Anwenderlevel - es ist vielmehr
in erster Linie tatsächlich ein organisatisches (Abgrenzung? Integration?
Kommunikation mit anderen Projekten?) und ein personelles Problem (Akzeptanz
der Best Practice? Werbung dafür? Schulung? Prüfung?).

Und alles das muß man neben der Technik eben auch mit thematisieren, wenn
man Wachstum in einer Firma skalieren und kanalisieren will - man muß nicht
nur die Technik, sondern auch die Organisation und seine Leute mit
skalieren.
