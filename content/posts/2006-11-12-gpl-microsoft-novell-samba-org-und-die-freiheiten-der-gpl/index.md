---
author: isotopp
date: "2006-11-12T23:51:00Z"
feature-img: assets/img/background/rijksmuseum.jpg
tags:
  - copyright
  - free software
  - lang_de
title: 'GPL: Microsoft, Novell, Samba.org und die Freiheiten der GPL'
aliases:
  - /2006/11/12/gpl-microsoft-novell-samba-org-und-die-freiheiten-der-gpl.html
---

In 
[Business und OSS](http://www.c0t0d0s0.org/archives/2233-Business-und-OSS.html) 
verweist Jörg Möllenkamp auf 
[Samba Team Asks Novell zu Reconsider](http://news.samba.org/announcements/team_to_novell/) 
und spielt ein Gedankenexperiment durch: 

> So im gedanklichen Hintergrund stellt sich mir jetzt die Frage, was wohl passieren würde, wenn das Entwicklungsteam eines wesentlichen Bestandteils der Umgebung einer der Großdistributionen plötzlich die Lizenz entziehen würde.
> Als Gedankenspiel: Das Samba-Team zieht die Lizenz von Novell für Samba zurück.

[Samba](http://www.samba.org) beschreibt sich selbst wie folgt: 
> Samba is an [Open Source](http://www.opensource.org/)/[Free Software](http://www.gnu.org/philosophy/free-sw.html) suite that has, [since 1992](http://us5.samba.org/samba/docs/10years.html), provided file and print services to all manner of SMB/CIFS clients, including the numerous versions of Microsoft Windows operating systems. 
> Samba is freely available under the [GNU General Public License](http://us5.samba.org/samba/docs/GPL.html).

In Sektion 6 der 
[GPL](http://us5.samba.org/samba/docs/GPL.html) heißt es:

> 6. Each time you redistribute the Program (or any work based on the Program), the recipient automatically receives a license from the original licensor to copy, distribute or modify the Program subject to these terms and conditions.
> **You may not impose any further restrictions on the recipients' exercise of the rights granted herein.**
> You are not responsible for enforcing compliance by third parties to
this License.

Die Grundlage für dieses Gedankenexperiment ist also in der realen Welt nicht gegeben. 
Es ist nicht möglich, bestimmte Firmen von der Nutzung GPL lizenzierter Software in irgendeiner Weise auszuschließen.
Das ist Absicht und wird von den Entwicklern der GPL als Feature gesehen.

Die GPL geht zweigleisig an das Problem heran (
[mehr Details]({{< relref "2005-02-07-von-der-gpl.md" >}}))
. Die ersten drei Freiheiten, die die GPL gewährt, sind 

- Die Freiheit, das Programm zu jedem Zweck auszuführen.
- Die Freiheit, das Programm und seine Funktionsweise zu studieren und anzupassen.
- Die Freiheit, das Programm nach Belieben zu verändern.

Die GPL sieht keine Möglichkeit vor, irgendjemandem diese drei Freiheiten aus welchem Grund auch immer zu verwehren.
Das trifft sogar für alle diejenigen zu, die andere Bestimmungen der GPL versehentlich oder absichtlich verletzen.
In keinem Fall könnte das Samba-Projekt unter der GPL Novell oder sonst irgendjemandem die Nutzung von Samba, das Studium des Samba-Quelltextes oder die Veränderung des Samba-Quelltextes verbieten.

Die vierte Freiheit, die die GPL gewährt, ist 

- Die Freiheit, das Programm weiterzugeben.

Die GPL knüpft diese Freiheit an eine Bedingung. 
Die Bedingung ist dort oben zitiert.
Indem das Samba-Projekt das Programm (Samba) unter der GPL an **irgend jemanden** weitergibt, gibt das Samba Projekt diesem auch die Freiheit, das Programm **mit allen Freiheiten** weiterzugeben.
Das Einschränken dieser Freiheiten wird ausdrücklich ausgeschlossen.
Dadurch bekommt zwingend transitiv auch immer Novell (und jeder andere, der die GPL nicht verletzt) das Recht, Samba unter der vierten Freiheit weiterzugeben.

Das ist kein Versehen.
Die GPL ist eine Lizenz, die Freiheiten geben **und** bewahren soll.
Die Schöpfer der GPL sehen diese Freiheiten als absolut, also gegenüber jedem und für immer gültig.
Wenn der Mechanismus der GPL einmal in Gang gesetzt worden ist, dann soll es keinen Mechanismus geben, mit dem ein GPL Programm in irgendeiner Weise eingeschränkt werden kann.
Auch nicht für die ursprünglichen Lizenzinhaber.

Die GPL gibt damit Sicherheit:
Die Freiheiten, die die GPL gewährt, sind auch dann sicher, wenn unter den Beteiligten in irgendeiner Weise Unstimmigkeiten herrschen oder ein offener Disput besteht.
Die GPL und GPL lizensierte Software 
[spielen nicht am Markt]({{< relref "2006-09-19-gpl-marktdurchdringung-ist-kein-wert-an-sich.md" >}}) der kompetitiven Player und sind im Gegensatz zu anderen Lizenzen absichtlich so gestaltet, daß die Lizenz-politischen Instrumente der kompetitiven Player nicht zum Einsatz kommen können.

Die GPL ist die Verfassung der kooperativen Spieler.
Sie ist so gestaltet, daß sie alle Parteien für immer entwaffnet, solange sie im kooperativen Bereich spielen, und daß sie kompetitive Spieler draußen hält:
Wer nach den Regeln der GPL spielt, kann die GPL nicht als Druckmittel einsetzen, weil dies nach Konstruktion nicht möglich ist.
Wer nicht nach den Regeln der GPL spielt, kann GPL-lizenzierte Software für sich selbst zwar nutzen, sie aber wegen der fehlenden vierten Freiheit nicht weiterverbreiten (und damit auch nicht verkaufen oder auf GPL-Software basierendende Produkte verkaufen, also keinen kompetitiven Gewinn erzielen).

So mag es nun sein, daß sich Novell, Microsoft, IBM und das Samba-Team gegenseitig boxen und an den Karren zu fahren versuchen.
Aber sie können es nicht über die Lizenzen ihrer Software tun, sofern es sich dabei um GPL-lizenzierte Software handelt.
Das ist genau der Grund, warum Firmen wie Microsoft so stark Lobbypositionen 
[für Softwarepatente](http://www.heise.de/newsticker/meldung/80891)
beziehen oder andere Firmen Druck über das Markenrecht auszuüben versuchen oder warum man hin und wieder Anti-GPL Rethorik findet, in der der BSD-Lizenz und ihren Varianten ein Loblied gesungen wird: 
Diese Lizenzen haben die Schutzmechanismen der GPL nicht und würden es erlauben, Software für einzelne oder alle Lizenznehmer aus dem Markt zu nehmen oder proprietäre Erweiterungen auf der Basis vormals freier Software zu bauen.

Doch damit würde die Lizenz wieder zum Druckmittel. 
Die GPL erzwingt und belohnt kooperatives Verhalten.

Die in den letzten 10 Jahren neu eröffneten Kriegsschauplätze Lizenzen und Marken sind den Entwicklern der GPL wohl bewusst und die Arbeit an der 
[GPL V3](http://gplv3.fsf.org/gpl-draft-2006-07-27.html) 
geht voran (
[mehr Details]({{< relref "2006-07-30-gpl-v3-2nd-draft.md" >}}})).
Über die neuen Bestimmungen der GPL V3 ist viel gejammert worden, insbesondere auch vom Linux Kernel Team.

Darum gibt es eine 
[Zusammenfassung und Klarstellung der Ziele und Bestimmungen der GPL V3](http://www.fsf.org/news/gplv3-clarification) 
durch die Free Software Foundation, die deutlich macht, was die Ziele der GPL in jeder Version sind und wie sie in der jeweiligen Version erreicht werden sollen.

Das Samba-Team ist da 
[voll auf der Linie der FSF](http://news.samba.org/announcements/team_to_novell/): 
Darum ja genau die harsche Reaktion auf den Vertrag zwischen Microsoft und Novell. 
Nur: Die Software selbst wird nicht zum Spielball dieser Auseinandersetzung.
Weil die GPL es nach Konstruktion nicht zuläßt.
