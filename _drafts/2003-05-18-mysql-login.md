---
layout: post
published: true
title: MySQL Login
author-id: isotopp
date: 2003-05-18 11:18:50 UTC
tags:
- php
- lang_de
feature-img: assets/img/background/rijksmuseum.jpg
---
Pretec hat Ärger mit seinem MySQL. Ein lokaler User "cluster@%" kann sich immer ohne Paßwort einloggen, auch dann, wenn für den User ein Paßwort gesetzt ist.

Er hat den User mit "grant" eingerichtet, also kann es kein vergessenes "flush privileges" sein.

Sein Server läuft auch nicht mit "--skip-grant-tables" in der mysqld-Sektion der /etc/my.cnf.

Letztendlich hat er vergessen, die Einträge mit user="" aus der mysql.user-Tabelle zu löschen. Diese Einträge haben Vorrang vor Einträgen mit Usernamen und erlauben in der Default-Konfiguration den Connect von allen Usern auf localhost ohne Paßwort. Ein simples "delete from mysql.user where user = ''" reicht aus, um das zu fixen.

Ich mache das immer als Erstes nach der Installation, deswegen bin ich da nicht gleich drauf gekommen. Pretec kaut da wohl schon seit gestern abend dran. Nunja, jetzt tut es ja.

Dachte, das interessiert vielleicht jemanden. :-)
