---
author: isotopp
date: "2007-04-02T09:36:00Z"
feature-img: assets/img/background/rijksmuseum.jpg
tags:
- copyright
- free software
- lizenz
- patent
- lang_de
title: GPL V3 RC3 - Was steht drin?
---

Die GPL V3 ist sehr einfach zu lesen - wenn man wissen will, was drin steht, muss man lediglich die Präambel lesen, die in sehr klaren Worten und ohne juristisches Blafasel genau erklärt, was die Ziele und Methoden der GPL V3 sind und wieso sie Lizenz so aussieht wie sie aussieht. 
Der 
[dritte Entwurf der GPL V3](http://gplv3.fsf.org/gpl-draft-2007-03-28.html) ist nun fertig und wird weit besser aufgenommen als 
[der zweite Entwurf]({{< relref "2006-07-30-gpl-v3-2nd-draft.md" >}}).

Die Idee der GPL ist die Schaffung eines geschützten Raums, in dem 
[kooperiert]({{< relref "2005-01-05-ein-paar-ideologische-steine-ins-rollen-bringen.md" >}})
werden kann.
Das bedeutet, daß die GPL einem Nutzer dieser Lizenz 
[bestimmte Rechte]({{< relref "2005-02-07-von-der-gpl.md" >}}) gibt und Zusatzbestimmungen einführt, deren Ziel es ist, dafür zu sorgen, daß diese Rechte immer für jeden gelten, der sich den Bestimmungen der GPL unterwirft.
Die Idee ist es, Software aus dem GPL Pool nutzen zu können, im Gegenzug aber die Nutzer dieser Software dazu zu verpflichten, die Dinge, die sie mit dieser Software bauen allen anderen Nutzern dieses Pools unter denselben Bedingungen zur Verfügung zu stellen.

Die GPL ist, 
[wie]({{< relref "2006-09-10-gpl-in-deutschland-vor-gericht-durchgesetzt.md" >}}) 
[anderswo]({{< relref "2006-09-19-gpl-marktdurchdringung-ist-kein-wert-an-sich.md" >}}) 
[erklärt]({{< relref "2006-11-12-gpl-microsoft-novell-samba-org-und-die-freiheiten-der-gpl.md" >}}), eine Lizenz - man erwirbt also Rechte an etwas, das man sonst nicht nutzen könnte. 
Die GPL ist nicht umsonst - man zahlt für diese Rechte damit, daß man im Gegenzug anderen dieselben Rechte an dem gewährt was man geschaffen hat, indem man die GPL-Rechte genutzt hat. 

Das System hat in den vergangenen Jahrzehnten recht gut funktioniert, aber neuere Entwicklungen in der Anwendungsentwicklung und im Urheberrecht haben die FSF dazu gebracht, die GPL zu überarbeiten.

Ich schrieb in 
[GPL: Marktdurchdringung ist kein Wert an sich]({{< relref "2006-09-19-gpl-marktdurchdringung-ist-kein-wert-an-sich.md" >}}):

> Wenn man die Entwicklung der letzten Jahre nämlich betrachtet, dann wird eines immer klarer: 
> Es kann keine Koexistenz mit Closed Source geben, sondern nur eine strikte Trennung. 
> Diese Erkenntnis ist nicht neu: 
> Am 27. September 1983, also vor nunmehr 23 Jahren wurde das GNU Projekt gegründet. 
> Es entstand unter anderem, weil jemand Code aus der Allmende genommen und unter seine Käseglocke gestellt hat. 
> Die Funktion der GPL ist es, eine Wiederholung eines solchen Szenarios zu verhindern.

Die GPL ist eine wehrhafte Lizenz und die Version 3 paßt sie an die Erfordernisse einer neuen Zeit an, um die 
[Freiheiten der GPL]({{< relref "2006-11-12-gpl-microsoft-novell-samba-org-und-die-freiheiten-der-gpl.md" >}}) unter diesen Bedingungen zu erhalten.

Die Probleme, die die GPL V2 hat, bestehen in zwei Kernnbereichen: 
- Einmal ist es in den letzten Jahren vermehrt üblich geworden, Software als einen Service anzubieten.
 Firmen, die so etwas tun, verwenden GPL V2 Software in großen Maßstab, liefern sie aber niemals aus. 
 Daher wird die Schrankenbestimmung für die letzte Freiheit der GPL niemals wirksam: 
 Die Verpflichtung, die eigenen Änderungen an einem Stück Software Dritten zur Verfügung zu stellen wird nur dann wirksam, wenn man diese Software auch an Dritte weitergibt.
 Bei Software als Service passiert das nicht - man gibt nur die Wirkungen dieser Software an Dritte weiter.
 Solche Dienstleister bedienen und bereichern sich also am Pool der GPL-Software ohne daß ihre eigenen Veränderungen auf der Grundlage dieses Fundus in den Pool zurückfließen müssen - der Kooperation wird die Grundlage entzogen und die 
[Allmende stagniert](http://en.wikipedia.org/wiki/Tragedy_of_the_commons).
- Andere Schutzrechte als das Urheberrecht werden zusätzlich wirksam: 
 Es ist für einen Nutzer von GPL-Software möglich, den Quelltext zu einer Software zu erhalten, aber er wird möglicherweise durch andere Schutzrechte gehindert, diese Software vollumfänglich zu nutzen. 
 Dies können durch das Urheberrecht selber geschützte DRM-Mechanismen sein (
[Tivoisierung](http://www.heise.de/open/artikel/87628)), es kann sich aber auch um Patente auf Software handeln.

Die GPL V3 formuliert ihre Absichten hier so: 
> Some devices are designed to deny users access to install or run modified versions of the software inside them, although the manufacturer can do so.
> This is fundamentally incompatible with the purpose of the GPL, which is to protect users' freedom to change the software where changes are possible.
> The systematic pattern of such abuse occurs in the area of products for individuals to use, which is precisely where it is most unacceptable.
> Therefore, we have designed this version of the GPL to prohibit the practice for those products. 
> If such problems arise substantially in other domains, we stand ready to extend this provision to those domains in future versions of the GPL, as needed to protect the freedom of users.
> 
> Finally, every program is threatened constantly by software patents. 
> States should not allow patents to restrict development and use of software on general-purpose computers, but in places where they do, we wish to avoid the special danger that patents applied to a free program could make it effectively proprietary.
> To prevent this, the GPL assures that patents cannot be used to render the program non-free.

Neu in der GPL V3: Der Absatz 3 "No Denying Users' Rights through Technical Measures". sagt, daß ein GPL V3 Programm nicht Teil eines 
[DRM-Mechanismus](http://de.wikipedia.org/wiki/Digitale_Rechteverwaltung) 
sein kann. Die GPL V3 bezieht sich dabei (zur Zeit) auf 
[Artikel 11 des WIPO-Vertrages vom 20. Dezember 1996](http://www.wipo.int/treaties/en/ip/wct/trtdocs_wo033.html#P87_12240)
und die daraus entstandenen nationalen Gesetze zur Umsetzung dieses Vertrages. 
Ein Gerät wie der Tivo, bei dem man die Quellen erhält, modifizieren, die daraus resultierende geänderte Software dann so aber nicht mehr auf dem Gerät installieren kann wäre mit der GPL V2 möglich, mit der GPL V3 aber nicht mehr.

In dieselbe Richtung zielen nun Abschnitte von Absatz 6, die ebenfalls klarstellen, was denn nun genau zum Lieferumfang gehört: 
>  The information must suffice to ensure that the continued functioning of the modified object code is in no case prevented or interfered with solely because modification has been made.

Oder in anderen Worten: Die Schlüssel, die man braucht um sein selbstgemachtes Binary so zu signieren, daß es auf ein einem Tivo tut gehören auch dazu.

Ebenfalls neu in der GPL V3:
Die Klarstellung in Absatz 10 "Automatic Licensing of Downstream Recipients" und der gesamte Absatz 11 "Patents".
Der Kern der Sache ist jetzt der erste Absatz von Absatz 11: 
> Each contributor grants you a non-exclusive, worldwide, royalty-free patent license under the contributor's essential patent claims in its contribution, to make, use, sell, offer for sale, import and otherwise run, modify and propagate the contribution.

Oder in anderen Worten: Wenn ich Code in ein Stück GPL einbaue, das durch eines meiner Softwarepatente geschützt ist, dann gebe ich damit auch gleich eine kostenfreie, unbefristete und unbeschränkte Lizenz für die Nutzung dieser Patente an jedem Nutzer dieser Software mit. 
Dies ist übrigens nichts neues - 
[schon die GPL V2 hat einen ähnlichen Effekt](http://www.groklaw.net/article.php?story=20070328071651351),
wenn auch nicht so explizit formuliert.

Weitere Änderungen an der GPL sind eher technischer Natur und nur verständlich, wenn man sich mit dem rechtlichen Umfeld ihrer Entstehung beschäftigt. 
Dies wird in den 
[Anmerkungen zum Entwurf](http://gplv3.fsf.org/rationale)
beschrieben.
