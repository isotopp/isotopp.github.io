---
author-id: isotopp
date: "2006-11-12T23:51:00Z"
draft: true
feature-img: assets/img/background/rijksmuseum.jpg
published: true
tags:
- copyright
- free software
- lizenz
- lang_de
title: 'GPL: Microsoft, Novell, Samba.org und die Freiheiten der GPL'
---
<!-- s9ymdb:1270 --><img width='110' height='104' style="float: right; border: 0px; padding-left: 5px; padding-right: 5px;" src="/uploads/20040415-gnu-head-sm.serendipityThumb.jpg" alt="" /> 
In <a href="http://www.c0t0d0s0.org/archives/2233-Business-und-OSS.html">Business und OSS</a> verweist Jörg Möllenkamp auf <a href="http://news.samba.org/announcements/team_to_novell/">Samba Team Asks Novell zu Reconsider</a> und spielt ein Gedankenexperiment durch: <blockquote>So im gedanklichen Hintergrund stellt sich mir jetzt die Frage, was wohl passieren würde, wenn das Entwicklungsteam eines wesentlichen Bestandteils der Umgebung einer der Grossdistributionen plötzlich die Lizenz entziehen würde. Als Gedankenspiel: Das Samba-Team zieht die Lizenz von Novell für Samba zurück.</blockquote>



<a href="http://www.samba.org">Samba</a> beschreibt sich selbst wie folgt: <blockquote>Samba is an <a href="http://www.opensource.org/">Open Source</a>/<a href="http://www.gnu.org/philosophy/free-sw.html">Free Software</a> suite that has, <a href="http://us5.samba.org/samba/docs/10years.html">since 1992</a>, provided file and print services to all manner of SMB/CIFS clients, including the numerous versions of Microsoft Windows operating systems. Samba is freely available under the <a href="http://us5.samba.org/samba/docs/GPL.html">GNU General Public License</a>.</blockquote>

In Sektion 6 der <a href="http://us5.samba.org/samba/docs/GPL.html">GPL</a> heißt es: <blockquote>6. Each time you redistribute the Program (or any work based on the Program), the recipient automatically receives a license from the original licensor to copy, distribute or modify the Program subject to these terms and conditions. <b>You may not impose any further restrictions on the recipients' exercise of the rights granted herein.</b> You are not responsible for enforcing compliance by third parties to
this License.</blockquote>  Die Grundlage für dieses Gedankenexperiment ist also in der realen Welt nicht gegeben. Es ist nicht möglich, bestimmte Firmen von der Nutzung GPL lizensierter Software in irgendeiner Weise auszuschließen. Das ist Absicht und wird von den Entwicklern der GPL als Feature gesehen.

Die GPL geht zweigleisig an das Problem heran (<a href="http://blog.koehntopp.de/archives/680-Von-der-GPL.html">mehr Details</a>). Die ersten drei Freiheiten, die die GPL gewährt, sind <ul><li>Die Freiheit, das Programm zu jedem Zweck auszuführen.</li><li>Die Freiheit, das Programm und seine Funktionsweise zu studieren und anzupassen.</li><li>Die Freiheit, das Programm nach Belieben zu verändern.</li></ul> Die GPL sieht keine Möglichkeit vor, irgendjemandem diese drei Freiheiten aus welchem Grund auch immer zu verwehren. Das trifft sogar für alle diejenigen zu, die andere Bestimmungen der GPL versehentlich oder absichtlich verletzen. In keinem Fall könnte das Samba-Projekt unter der GPL Novell oder sonst irgendjemandem die Nutzung von Samba, das Studium des Samba-Quelltextes oder die Veränderung des Samba-Quelltextes verbieten.

Die vierte Freiheit, die die GPL gewährt, ist <ul><li>Die Freiheit, das Programm weiterzugeben.</li></ul> Die GPL knüpft diese Freiheit an eine Bedingung. Die Bedingung ist dort oben zitiert. Indem das Samba-Projekt das Programm (Samba) unter der GPL an <b>irgend jemanden</b> weitergibt, gibt das Samba Projekt diesem auch die Freiheit, das Programm <b>mit allen Freiheiten</b> weiterzugeben. Das Einschränken dieser Freiheiten wird ausdrücklich ausgeschlossen. Dadurch bekommt zwingend transitiv auch immer Novell (und jeder andere, der die GPL nicht verletzt) das Recht, Samba unter der vierten Freiheit weiterzugeben.

Das ist kein Versehen. Die GPL ist eine Lizenz, die Freiheiten geben <b>und</b> bewahren soll. Die Schöpfer der GPL sehen diese Freiheiten als absolut, also gegenüber jedem und für immer gültig. Wenn der Mechanismus der GPL einmal in Gang gesetzt worden ist, dann soll es keinen Mechanismus geben, mit dem ein GPL Programm in irgendeiner Weise eingeschränkt werden kann. Auch nicht für die ursprünglichen Lizenzinhaber.

Die GPL gibt damit Sicherheit: Die Freiheiten, die die GPL gewährt, sind auch dann sicher, wenn unter den Beteiligten in irgendeiner Weise Unstimmigkeiten herrschen oder ein offener Disput besteht. Die GPL und GPL lizensierte Software <a href="http://blog.koehntopp.de/archives/1411-GPL-Marktdurchdringung-ist-kein-Wert-an-sich.html">spielen nicht am Markt</a> der kompetetiven Player und sind im Gegensatz zu anderen Lizenzen absichtlich so gestaltet, daß die lizenzpolitischen Instrumente der kompetetiven Player nicht zum Einsatz kommen können.

Die GPL ist die Verfassung der kooperativen Spieler. Sie ist so gestaltet, daß sie alle Parteien für immer entwaffnet, solange sie im kooperativen Bereich spielen, und daß sie kompetetive Spieler draußen hält: Wer nach den Regeln der GPL spielt, kann die GPL nicht als Druckmittel einsetzen, weil dies nach Konstruktion nicht möglich ist. Wer nicht nach den Regeln der GPL spielt, kann GPL-lizensierte Software für sich selbst zwar nutzen, sie aber wegen der fehlenden vierten Freiheit nicht weiterverbreiten (und damit auch nicht verkaufen oder auf GPL-Software basierendende Produkte verkaufen, also keinen kompetetiven Gewinn erzielen).

So mag es nun sein, daß sich Novell, Microsoft, IBM und das Samba-Team gegenseitig boxen und an den Karren zu fahren versuchen. Aber sie können es nicht über die Lizenzen ihrer Software tun, sofern es sich dabei um GPL-lizensierte Software handelt. Das ist genau der Grund, warum Firmen wie Microsoft so stark Lobbypositionen <a href="http://www.heise.de/newsticker/meldung/80891">für Softwarepatente</a> beziehen oder andere Firmen Druck über das Markenrecht auszuüben versuchen oder warum man hin und wieder Anti-GPL Rethorik findet, in der der BSD-Lizenz und ihren Varianten ein Loblied gesunden wird: Diese Lizenzen haben die Schutzmechanismen der GPL nicht und würden es erlauben, Software für einzelne oder alle Lizenznehmer aus dem Markt zu nehmen oder proprietäre Erweiterungen auf der Basis vormals freier Software zu bauen.

Doch damit würde die Lizenz wieder zum Druckmittel. Die GPL erzwingt und belohnt kooperatives Verhalten.

Die in den letzten 10 Jahren neu eröffneten Kriegsschauplätze Lizenzen und Marken sind den Entwicklern der GPL wohl bewußt und die Arbeit an der <a href="http://gplv3.fsf.org/gpl-draft-2006-07-27.html">GPL V3</a> geht voran (<a href="http://blog.koehntopp.de/archives/1350-GPL-V3-2nd-draft.html">mehr Details</a>). Über die neuen Bestimmungen der GPL V3 ist viel gejammert worden, insbesondere auch vom Linux Kernel Team. Darum gibt es eine <a href="http://www.fsf.org/news/gplv3-clarification">Zusammenfassung und Klarstellung der Ziele und Bestimmungen der GPL V3</a> durch die Free Software Foundation, die deutlich macht, was die Ziele der GPL in jeder Version sind und wie sie in der jeweiligen Version erreicht werden sollen.

Das Samba-Team ist da <a href="http://news.samba.org/announcements/team_to_novell/">voll auf der Linie der FSF</a>: Darum ja genau die harsche Reaktion auf den Vertrag zwischen Microsoft und Novell. Nur: Die Software selbst wird nicht zum Spielball dieser Auseinandersetzen. Weil die GPL es nach Konstruktion nicht zuläßt.
