---
layout: post
published: true
title: It's all about the Pentiums
author-id: isotopp
date: 2004-10-09 08:47:13 UTC
tags:
- computer
- lang_de
feature-img: assets/img/background/rijksmuseum.jpg
---
<img width='98' height='110' border='0' hspace='5' align='right' src='/uploads/hp-bl30p.serendipityThumb.gif' alt='' /> Schon <a href="http://www.weirdal.com/">Weird Al</a> hat gewußt: <a href="http://www.song-text.com/146/">It's all about the Pentiums, baby</a>. Im Falle eines Rechenzentrums kann man durch den Einsatz von Blades nicht nur Strom sparen, sondern auch die Leistungsdichte erhöhen (also Platz sparen) und das Management verbessern.

Ich hatte die letzten paar Wochen Gelegenheit, Bladecenter von HP und IBM zu sehen. Beide haben sehr unterschiedliche Konzepte...
<br clear='all' />

<b>Über Blades</b>

Blades bestehen aus einem Einschub, dem Enclosure, in den meist vertikal die Rechnereinschübe eingesteckt werden (daher der Name Blade für die Einschübe). Das Enclosure enthält die Infrastruktur zum Betrieb des Rechners, liefert also Strom, Netzwerk, Management sowie Konsole und Bildschirm nach draußen. Die Blade selber wird nicht verkabelt, sondern dockt durch das Einschieben automatisch in das Enclosure ein. Über die Managementfunktionen läßt sich die Blade ein- und ausschalten, booten, und ihr können, wenn der Bedarf dafür besteht, das Diskettenlaufwerk und das CD-ROM Laufwerk aus dem Enclosure zugewiesen werden.

Die Blades selber haben durchaus Power - zwei Prozessoren aus dem 3GHz-Segment mit Speicher im Gigabyte-Bereich sind üblich. Die Schwachstelle sind meist die Platten - zwar können in der Regel zwei Platten auf der Blade selber montiert werden und man hat die Wahl zwischen IDE- und SCSI-Platten, aber es handelt sich in der Regel um 2.5 Zoll Notebookplatten bzw. vergleichbare Geräte, die für den Dauereinsatz in Servern zertifiziert sind. Solche Platten taugen, das sollte klar sein, zum Booten und Laden des Betriebssystems und der Anwendung, aber nicht für Datenbanken. Die Blade bringt außerdem meist zwei Netzwerkinterfaces mit, die auf die Enclosure-eigenen Switch connected und hat Platz für eine Erweiterung - etwa eine weitere Netzwerkkarte oder ein Modul für den SAN-Access.

Es gibt auch größere Blades mit vier Prozessoren, mehr Speicher und Festplatten in Hotplug-Rahmen innerhalb der Blade, die eher auf den Datenbank- denn auf den Frontend-Markt zielen, aber diese wirken eher unbeholfen und noch nicht so richtig Marktreif.

Enclosures haben je nach Hersteller zwischen 6 und 7 HE Höhe und bieten Platz für 14 bis 16 Blades (von der Frontend-Sorte).

Die Konzepte von HP und IBM sind dabei sehr unterschiedlich. Bei <a href="http://bioteam.net/gallery/miscBladeServers">BioTeam.net</a> findet man eine Galerie mit Fotos der vorherigen Generation von Bladecentern und Blades. Die Bilder geben dennoch einen sinnvollen Eindruck der aktuellen Blades wieder.

<b>HP BL30p</b>

<a href='http://bioteam.net/gallery/miscBladeServers/Roll_24_16'><img width='110' height='83' border='0' hspace='5' align='right' src='/uploads/bladevergleich.serendipityThumb.jpg' alt='' /></a> Auf dem Bild sieht man eine BL20p Blade von HP unter einer IBM Blade liegen. Die <a href="http://h18004.www1.hp.com/products/servers/proliant-bl/p-class/30p/">Frontend-Einschübe (BL30p)</a> von HP sind halb so hoch, haben aber dieselbe Länge. 

Leider sind keine Fotos einer nicht eingebauten BL30p zu finden, was schade ist. Denn in diesem Fall würden verschiedene Dinge auffallen, die die Unterschiede im Konzept zwischen HP und IBM sehr deutlich machen: <ul><li>Die BL30p ist offen, hat also keine Abdeckung wie die gezeigte BL20p. Zwei BL30p stecken übereinander in einen sogenannten Sleeve, der dann die Größe und Form wie abgebildet hat und im Enclosure steckt. Blades in Sleeves zu stecken ist ein bischen hakelig, da die BL30p wie gesagt oben nicht geschlossen ist und man so direkt auf CPUs, RAM und Platten fassen kann.</li><li>Wegen der geringen Höhe der Blade sitzen die CPUs in der BL30p hintereinander, die eine an der oberen, die andere an der unteren Kante der Blade ausgerichtet. Beide CPUs überlappen sich zu einem Drittel bis zur Hälfte im Luftweg, sodaß die hintere CPU Luft bekommt, die bereits durch die vordere CPU erwärmt wurde.</li><li>Vor den beiden CPUs sitzen zwei hochtourige Mikrolüfter, die die beiden CPUs anblasen. Das Kühlkonzept hat also, anders als IBM, Lüfter pro Blade statt einer großen redundanten Zentralkühlung.</li><li>Die Blades werden in den Sleeves mit Plastik-Nupsis gesichert. Während der Teststellung sind uns diese Dinger reihenweise abgebrochen</li></ul> Das HP Enclosure ist mit 6 HE niedriger als das IBM Enclosure (7 HE) und faßt 16 BL30p Einschübe - das sind also 32 CPUs pro Enclosure, aber es passen keine 7 Enclosures in ein Rack. Denn HP trennt Enclosure und Stromversorgung in unterschiedliche Komponenten. Für eine bestimmte Menge Blades braucht man einen speziellen <a href="http://h18004.www1.hp.com/products/blades/components/powersubsystem.html">Netzteil-Enclosure</a> (3 HE), der dann 48V Gleichstrom ausspuckt.

<a href='http://bioteam.net/gallery/miscBladeServers/Roll_24_5'><img width='110' height='83' border='0' hspace='5' align='left' src='/uploads/hp-powersubsystem.serendipityThumb.jpg' alt='' /></a> HP wirbt mit der Flexibilität des Konzeptes der Rack-zentralisierten Stromversorgung, aber in der Realität hat man dann auf der Rückseite seiner Racks ein schweres Übersichtlichkeitsproblem - den Racks wächst ein Geschwür von Kabeln hinter den Enclosures, die dann mit schwenkbaren Plastikarmen so montiert werden, daß man einerseits die Racks noch zu bekommt, andererseits aber bei Bedarf auch an die Geräterückseiten herankommt. Da 48V verwendet wird, sind die verwendeten Kabel daumendick, damit die benötigten Amperes da durch gehen und entsprechend elegant zu handhaben. Abgesehen davon, daß so ein Drahverhau aussieht sie gewollt und nicht gekonnt, ist das ganze auch ein logistischer Albtraum.

<b>IBM</b>

<a href='http://bioteam.net/gallery/miscBladeServers/Roll_24_6'><img width='110' height='83' border='0' hspace='5' align='right' src='/uploads/ibm-rueckseite.serendipityThumb.jpg' alt='' /></a> Das Enclosure von IBM ist größere - 7 HE hoch. IBM Blades sind außerdem kürzer - sie reichen nicht bis zur Rückseite des Gerätes. Das gibt IBM Platz, um auf der Geräterückseite zwei redundante Lüfter (die großen Dinger in der Mitte mit den Stauklappen zur Verhinderung von Kühlkreis-Kurzschlüssen), vier redundante Netzteileinschübe (links und rechts von den Lüftern mit den Kaltgerätedosen), vier Switch-Einschübe (ganz links) sowie zwei Managementeinschübe (ganz rechts) zu plazieren. Auch mit Verkabelung dran sieht die Geräterückseite sehr übersichtlich aus, und ist vor allen Dingen auch Sonntags nachts um Vier durch einen verschlafenen Rufbereitsschaftler problemlos zu maintainen.

Die Blades selber sind geschlossen, und so breit, daß die CPUs nebeneinander plaziert werden können - sauberer Airflow. Durch die zentrale Belüftung des Enclosures befinden sich auf den Blades außer den Platten keine beweglichen Teile - und die Platten braucht man bei einem Netzwerkboot im Prinzip nicht, da Frontends, die swappen sowieso ein Problem haben.

IBM garantiert Interoperabilität und Wiederverwendbarkeit des Chassis für fünf Jahre (und merkt dabei fairerweise an, daß neuere CPUs unter Umständen auch einen Austausch der Lüfter und Netzteilmodule notwendig machen können - aber das sollen die Vertriebler und Einkäufer in einem Tradein unter sich ausmachen). Dabei macht IBM mit der <a href="http://www.heise.de/newsticker/meldung/50645">Offenlegung der Standards</a> auch deutlich, daß sie eine Plattform statt einer proprietären Lösung etablieren wollen. So hat man bei den Switchmodulen die Wahl zwischen Dlink und Cisco (und die Switches sind anders als bei HP physikalisch voneinander getrennt, wenn man sauber DMZen will).

<b>Management</b>

<a href='http://bioteam.net/gallery/miscBladeServers/Roll_24_4'><img width='110' height='83' border='0' hspace='5' align='right' src='/uploads/ibm-blade-vorderseite.serendipityThumb.jpg' alt='' /></a> Beim Management nehmen sich die Lösungen von HP und IBM recht wenig - sie sind sogar mit Einschränkungen integrierbar. In beiden Fällen können Konsole und Bildschirm über Netz an Arbeitsplätze außerhalb des Rechenzentrums herausgeführt werden, und dabei können Zugriffsrechte fein granuliert vergeben werden (über die Sicherheit von typischen WBEM-Implementierungen können wir uns anderswo unterhalten). Dabei ist es möglich, Benutzer und deren Rechte aus einem LDAP zu beziehen, sodaß sich dieser Aspekt auch mit einer bereits vorhandenen Directory-Lösung integrieren läßt.

Die Kisten lassen sich remote PXE-Booten, und können sich so von einem Installserver ein Basis-Betriebssystem oder gar ein komplettes Application-Setup zeihen. Drei bis sieben Minuten beträgt die Deployment-Zeit einer Blade nach dem Reinschieben in das Enclosure, wenn man alles richtig gemacht hat.

In die andere Richtung spucken Blades und Enclosures SNMP oder WBEM mit Daten über Maschine, physikalische Parameter und was man sonst so von dem Ding vielleicht wissen möchte. Die Steuerung und Überwachung der Blades über ein Management-Netz kann dabei vollständig vom Wirknetz getrennt werden.

<b>Probleme</b>

Verbleibende Probleme: <ul><li>Ohne Installserver und Managementinfrastruktur sind Blades sinnlos.</li><li>Durch die hohe Leistungsdichte wird die Abwärme pro Rack sehr groß, auch wenn man durch die Blades effektiv Strom spart</li><li>Blades ersetzen die herkömmlichen Frontends, aber Datenbankserver in Bladekonzepten wirken noch kümmerlich</li></ul> Was sind Eure Erfahrungen mit Blades?
