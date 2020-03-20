---
layout: post
title:  "Enemy Action"
author-id: isotopp
feature-img: assets/img/background/mysql.jpg
date: 2012-10-31 15:30:14 +0200
tags:
- mysql
- performance
- mysql
- "lang_de"
---
"Kris, guck mal, connection surge auf $WICHTIGER_MASTER, davor kurzer Activity drop. Alle anderen Graphen sehen normal aus."

![Graph: Connection Surge]({{ site.baseurl }}/uploads/screenshot-kris-20121031-1.png)

und

![Graph: QPS Drop]({{ site.baseurl }}/uploads/screenshot-kris-20121031-2.png)

Ich gucke.

Alle anderen Graphen sehen in der Tat normal aus. Aber um 13:20 kommt für kurze Zeit alles Processing zum Stillstand.

Wir haben ja <a href='http://blog.wl0.org/2011/02/log_processlist-sh-script-for-monitoring-mysql-instances/'>log_processlist.pl</a>. Falls es sich also um irgendein wildgewordenes Lock handeln sollte, würde ich das also in den 13_20 und 13_21 Dateien sehen. Beide sind in der Tat größer: Statt 250 Connections zeichnen wir deutlich über 400 Connections in diesen beiden Minuten auf.

Aber: In der Processlist sind keine Irregularitäten zu sehen. Es handelt sich, wenn unser Monitoring keine Löcher hat, nicht um einen Stall und Pileup im Datenbankserver, sondern eine externe Ursache.

Dies ist ein Master. Der hat sein Datadir auf einer NetApp. Mein Rat an den Fragesteller: Sprich mal mit den Filer-Leuten. Vielleicht haben die da grad an ihren Spielzeugen gebastelt. Während der Fragesteller davon zieht, wühle ich weiter in den Logs - wir haben ja genug davon.

Und dann:

<tt>Oct 31 13:20:10 master kernel: bnx2 0000:03:00.0: eth0: NIC Copper Link is Down
Oct 31 13:20:20 master kernel: bnx2 0000:03:00.0: eth0: NIC Copper Link is Up, 1000 Mbps full duplex, receive & transmit flow control ON</tt>

Aha. Die Filer-Leute sind also freigesprochen, wir haben stattdessen freundliches Feuer von den Zauberschraubern bekommen. Ich nehme an, jemand dort ist so konzentriert am Zeugs racken gewesen, daß für sie inzwischen alle Server gleich sind - sehen ja auch alle gleich aus.

Diese Person muß gefunden und auf das Lesen von Serverlabels aufmerksam gemacht werden. Manchmal ist die Datenbank halt nicht schuld.
