---
layout: post
published: true
title: Internet mit Kugelschreibern (und ein Päckchen für Mama)
author-id: isotopp
date: 2009-06-27 13:05:54 UTC
tags:
- internet
- erklaerbaer
- lang_de
feature-img: assets/img/background/rijksmuseum.jpg
---
Ich bin ja ein guter Sohn und schicke daher meiner Mama ab und an ein Päckchen. Da freut sie sich immer. Weil ich außerdem ein Geek bin, ist es ein IP-Päckchen.

Auf so ein Päckchen muß natürlich auch ein Adreßaufkleber drauf, und in dem müssen die wichtigen Zustellinformationen eingetragen werden. 

![](/uploads/ippaket.png)

*Vordruck für den Versand von IP-Päckchen, korrekt ausgefüllt und mit ein wenig TTL frankiert.*

Für die Zustellung sind drei Felder im Adreßformular wichtig: In das Feld '32 Bit destination IP address' ist die Empfängeranschrift einzutragen, hier also beispielhaft mal 134.245.16.8, in das Feld '32 bit source IP address' ist der Absender einzusetzen, also etwa 85.183.48.160. Und schließlich muß Porto drauf, d.h. ins Feld 'Time To Live' (TTL) ist einzutragen wie viele Router weit das Paket maximal reisen können soll - ich habe hier einmal 20 eingetragen. Payload rein, und ab zur Post damit. Äh, ins Netz natürlich.


Bei mir daheim sieht das Netz gerade so aus: 

![](/uploads/netzplan.png)

*Der Netzplan.*

Mein Rechner will das Paket also versenden. Dazu muß er wissen, wo er das Paket hinschicken soll. Zu diesem Zweck hat mein Rechner, KK, eine Tabelle. In der Tabelle steht drin, für welchen Rechner das Paket an wen zu senden ist. Für den Netzplan bei mir daheim also:

<table><tr><th>Ziel</th><th>Sende an</th></tr>
<tr><td>KK</td><td>Das bin ich selber</td></tr>
<tr><td>thinkcat</td><td>thinkcat</td></tr>
<tr><td>linux</td><td>linux</td></tr>
<tr><td>tv</td><td>tv</td></tr>
<tr><td>alle anderen</td><td>moep</td></tr>
</table>

In der Tabelle stehen in Wirklichkeit natürlich IP-Nummern drin, und darum sieht die Tabelle mit Zahlen so aus:

<table><tr><th>Ziel</th><th>Sende an</th></tr>
<tr><td>KK (192.168.1.101)</td><td>Das bin ich selber (127.0.0.1)</td></tr>
<tr><td>thinkcat (192.168.1.107)</td><td>thinkcat (192.168.1.107)</td></tr>
<tr><td>linux (192.168.1.10)</td><td>linux (192.168.1.10)</td></tr>
<tr><td>tv (192.168.1.103)</td><td>tv (192.168.1.103)</td></tr>
<tr><td>alle anderen</td><td>moep (192.168.1.1)</td></tr>
</table>

Das eine was auffällt ist die Nummer 127.0.0.1 - jeder Rechner im Internet hat diese Nummer und sie bezeichnet immer 'diesen Rechner', 'uns selbst'. Das Netzwerkinterface 'lo' oder 'lo0' hat immer diese Nummer, und das 'lo' steht dabei für 'loopback'. Es ist ein Testinterface, das immer existiert und das es dem Rechner erlaubt, Netzwerkanwendungen auch dann auszuführen, wenn der Rechner gar kein Netz hat. Dann kann er zwar nur mit sich selber reden, aber immerhin können dann die Netzwerk-Komponenten auf einer Kiste miteinander reden. Das ist ja besser als nix.

Was noch auffällt ist natürlich, daß alle IP-Nummern in meinem Netz mit demselben Prefix anfangen - 192.168.1.\*. Das ist nur natürlich - alle Adressen in der Straße um mich herum fangen ja auch mit demselben Prefix an - germany.berlin.wenckebachstrasse.\*. Darum kann man die Tabelle da oben auch vereinfachen:

<table><tr><th>Ziel</th><th>Sende an</th><th>Porto</th></tr>
<tr><td>KK (192.168.1.101)</td><td>Das bin ich selber (127.0.0.1)</td><td>0</td></tr>
<tr><td>192.168.1.*</td><td>192.168.1.* (direkt)</td><td>0</td></tr>
<tr><td>alle anderen (*)</td><td>moep (192.168.1.1)</td><td>1</td></tr>
</table>

Wir haben hier drei Zeilen notiert: Die erste Zeile teilt mit, daß wir Pakete an uns selber gar nicht zur Post bringen müssen - wir können sie gleich wieder aufreißen und uns über den Inhalt hermachen ("Lecker! Kekse!"). 

Die zweite Zeile sagt: Alles was mit der Nummer 192.168.1.\* anfängt ist sowieso local und kann direkt an den Rechner mit der gleichen Nummer zugestellt werden - also 192.168.1.2 an die 192.168.1.2 direkt und so weiter.

Und die letzte Zeile ist die Default-Route und die sagt: Alles andere geht erst mal an den moep (192.168.1.1) und der wird dann schon wissen wie es weiter geht, mir egal.

Die Spalte mit den Portokosten sagt dabei: Wenn wir ein Paket direkt zustellen wird kein Router überquert und daher die 'Time To Live' (TTL) auch nicht runtergezählt. Für Pakete, die nach draußen gehen ist das anders - da wird die TTL von z.B. 20 auf 19 runtergezählt. Der nächste Router macht dasselbe und so weiter. Irgendwann ist das Porto mal alle, d.h. die TTL ist 0 und dann wird das Paket weggeschmissen, egal ob es irgendwo angekommen ist oder nicht.

Das letzte Mal als wir uns das [Internet mit Kugelschreibern (und Bussen)]({% link _posts/2009-06-24-internet-mit-kugelschreibern-und-bussen.md %}) angesehen haben, hatten wir gesehen, daß es von mir bis nach Norwalk, CT, USA 13 Router sind, die man sehen kann. Der TTL-Zähler geht also bei jedem Schritt einen Wert runter und die Pakete kommen mit einer Rest-TTL von 7 in Norwalk an.

Wozu ist das gut?

![](/uploads/routingschleife.png)

*Ein Datenwirbel während einer Netzstörung.*

Wenn es eine Störung im Netz gibt, dann kann der Fall eintreten, daß der Router Zwei nahe dem Ziel die Störung schon bemerkt hat und das Paket erst einmal einen Schritt zum Router Eins zurück sendet, damit dieser es über eine alternative Route zum Ziel bringt. Router Eins weiß aber noch nichts von der Störung und sendet es wieder voran zu Nummer Zwei - genau auf dem gestörten Weg. Jeder dieser Schleifenschritte kostet ein wenig TTL, und sobald das Paket einen TTL-Zähler von 0 hat, wird es verworfen und der ursprüngliche Absender benachrichtigt, wenn möglich.

Das verhindert, daß Pakete unendlich lange im Netz kreisen, weil es keine Route mehr zum Ziel gibt. Es bewirkt natürlich auch, daß Pakete, die mit einem zu kleinen TTL-Wert losgesendet werden ihr Ziel niemals erreichen können. Im Internet gibt es also keine Sargasso-See in der alte Plastiktüten und anderer Zivilisationsmüll bis ans Ende aller Tage kreisen und niemals verrotten: Der TTL-Zähler ist ein Datenpäckchen-Kompostierungszähler und sorgt als Sicherheitsmaßnahme für eine umweltfreundliche Entsorgung von Datenschrott.

Da stellt sich natürlich sofort die Frage, was denn der minimale TTL-Wert ist, mit dem man von überall nach überall hinkommt. Das ist die Frage nach dem Durchmesser des Internets - [im Jahr 2001](http://www.map.meteoswiss.ch/map-doc/ftp-probleme.htm) wurden Werte von bis zu 40 beobachtet und festgestellt, daß manche Betriebssysteme die TTL per Default zu klein einstellen - also zu wenig Porto auf ihre IP-Päckchen kleben.

Mein Router, Moep, hat auch eine Routingtabelle, aber die ist nicht spannender als die da oben: Alles was 192.168.1.* ist geht nach links ins Netz raus und alles andere nach rechts zum Provider.

Der Provider, der hat **richtige** Router mit vielen vielen anderen Interfaces, und die haben richtige Routingtabellen. Wie das funktioniert - das ist eine Geschichte für ein anderes Mal.

Und jetzt, nach diesem Artikel, kann ich endlich antworten: 

> Dein (schöner) Vergleich hinkt (wie alle Vergleiche), und zwar leider an einer sehr zentralen Stelle: Bei Dir weiß das Datenpaket, wie es reisen muss. Im Internet weiß der Router den nächsten Hop, wo Pakete mit einem bestimmten Ziel hin müssen.In Deinem Beispiel müsste also der Kurt-Schumacher-Platz von Deiner Stirn ablesen können, dass Du nach CT willst und Dich dann zum next hop Flughafen Tegel schicken.

Meine Hoffnung ist, daß in Kurt-Schumacher-Platz so ein Typ mit der Mütze steht und daß ich den nach dem Weg fragen kann. Der wird hoffentlich für usa.ct.norwalk eine Defaultroute haben, die \* oder immerhin usa.\* nach Tegel routet und mich also über das korrekte Omnibusinterface aus dem U-Bahnhof routen. 