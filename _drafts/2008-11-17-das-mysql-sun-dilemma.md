---
layout: post
published: true
title: Das MySQL-Sun-Dilemma
author-id: isotopp
date: 2008-11-17 19:52:10 UTC
tags:
- architektur
- benchmark
- mysql
- scaleout
- sun
- lang_de
feature-img: assets/img/background/rijksmuseum.jpg
---
<a class='serendipity_image_link' href='/uploads/mysql_logo.gif'><!-- s9ymdb:3519 --><img class="serendipity_image_right" width="110" height="57" style="float: right; border: 0px; padding-left: 5px; padding-right: 5px;" src="/uploads/mysql_logo.serendipityThumb.gif" alt="" /></a> Sun hat <a href="http://catalog.sun.com/is-bin/INTERSHOP.enfinity/WFS/Sun_Catalogue-Sun_Catalogue_DE-Site/de_DE/-/EUR/ViewCatalog-Browse?CatalogCategoryID=ZXVIBe.d7kYAAAEZYYsJ0gWj">eine Box</a>, die hat 4 CPU-Chips drin, jeder Chip hat 8 Cores und jeder Core hat 8 Threads, die in etwa das sind, was man anderswo als Core abrechnet, minus 7/8 FPU. Das macht effektiv eine Kiste in mit 256 Cores.

Jeder <strike>Core</strike> Thread selbst ist im Vergleich zu Intel-Hardware jedoch recht langsam, er bringt etwa ein Drittel bis ein Fünftel der Leistung eines Intel-Cores, außer in Benchmarks, wo die Dinger viel schicker poliert werden. Dennoch ist das wegen der großen Anzahl der Threads eine ganze Menge Bumms in einer kleinen Box mit ohne viel Strom.

Sun hat nun auch eine recht populäre Open Source Datenbank von der Sun es gerne hätte, wenn die auf so einem Eisen gut aussähe. Leider tut diese Software auf Grund ihrer internen Struktur derzeit nicht so gut auf mehr als ca. 12 <strike>Cores</strike> Threads. In <a href="http://blogs.sun.com/mrbenchmark/entry/scaling_mysql_on_a_256">diesem Benchmark</a> von Sun wird die verzweifelte derzeitige Situation recht schön deutlich: Man startet bis zu 32 Instanzen von MySQL auf derselben Kiste, nutzt also 8 <strike>Cores</strike> Threads pro mysqld - die einzelnen mysqld haben aber nix gemeinsam und könnten genauso gut auch auf anderen Kisten laufen.

Man kann sich leicht ausrechnen, daß das derzeit für Sun keine sehr befriedigende Situation ist. Sicherlich ist man intern gerade intensiv dabei, das zu ändern. Bis dahin jedoch ist eine 256-Core-Box für ein normales MySQL-Setup eher nicht so schick.
