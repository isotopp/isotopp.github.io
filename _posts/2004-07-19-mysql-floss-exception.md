---
layout: post
published: true
title: MySQL FLOSS Exception
author-id: isotopp
date: 2004-07-19 14:14:00 UTC
tags:
- php
- lang_de
feature-img: assets/img/background/rijksmuseum.jpg
---
<img width='110' height='83' border='0' hspace='5' align='right' src='/uploads/20040314_dolphin.serendipityThumb.jpg' alt='' /> Bereits letzten Donnerstag hat Zak Greant, die Community-Kontaktperson bei MySQL, die <a href="http://zak.greant.com:8888/licensing/getfile/licensing/FLOSS-exception.txt?v=1.5">Version 1.5 der MySQL FLOSS License Exception</a> veröffentlicht.<blockquote>Exception Intent

We want specified Free/Libre and Open Source Software ("FLOSS") applications to be able to use specified GPL-licensed MySQL client libraries (the "Program") despite the fact that not all FLOSS licenses are compatible with version 2 of the GNU General Public License (the "GPL").</blockquote> Wir erinnern uns: Wie in <a href="http://blog.koehntopp.de/archives/206_MySQL+und+die+Lizenzen.html">MySQL und die Lizenzen</a> dargestellt, hat MySQL mit der 4er Serie des MySQL-Paketes die Lizenz der Client-Bibliotheken von LGPL auf GPL geändert. Dabei kam es zu den im Artikel dargestellten Lizenzproblemen.

Die MySQL FLOSS License Exception behebt (endlich!) dieses Problem.
<br clear='all' />

Grundidee der Lizenzänderung war <blockquote>If you are commercial, we are commercial. If you are Free and Open, we are Free and Open.</blockquote> MySQL wollte also kommerziellen Programmen die Möglichkeit nehmen, die MySQL Clientbibliotheken einzubinden ohne eine MySQL Lizenz zu erwerben. Doch nicht alle freien Lizenzen sind kompatibel mit der GPL, und insbesondere ist die PHP-Lizenz (<a href="http://blog.koehntopp.de/archives/206_MySQL+und+die+Lizenzen.html#c211">eine Abwandlung der Apache-Lizenz</a>) nicht mit der GPL kompatibel.

Damit man PHP weiter mit MySQL zusammen herstellen oder vertreiben darf, und damit Linux-Distributionen weiter MySQL-Client und MySQL-Server zusammen vertreiben dürfen, war die License Exception notwendig. Regelung "0.b" der Exception stellt dabei Kompatibilität mit den in Regelung 1 genannten Lizenzen her, Regelung "0.c" erlaubt die Verteilung von MySQL auf Linux Distributionen, die auch Nicht-GPL Daten und Programme enthalten.

Damit ist von der Seite der free software community nun endlich alles geregelt. Von der MySQL-Seite aus bleibt das Schluploch mit dem SQL-Relay, aber ... nunja.
