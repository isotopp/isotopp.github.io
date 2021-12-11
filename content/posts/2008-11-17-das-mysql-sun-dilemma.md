---
author: isotopp
date: "2008-11-17T19:52:10Z"
feature-img: assets/img/background/rijksmuseum.jpg
published: true
tags:
- architektur
- mysql
- lang_de
title: Das MySQL-Sun-Dilemma
---

Sun hat 
[eine Box](http://catalog.sun.com/is-bin/INTERSHOP.enfinity/WFS/Sun_Catalogue-Sun_Catalogue_DE-Site/de_DE/-/EUR/ViewCatalog-Browse?CatalogCategoryID=ZXVIBe.d7kYAAAEZYYsJ0gWj),
die hat 4 CPU-Chips drin, jeder Chip hat 8 Cores und jeder Core hat 8 Threads, die in etwa das sind, was man anderswo als Core abrechnet, minus 7/8 FPU.
Das macht effektiv eine Kiste in mit 256 Cores.

Jeder <strike>Core</strike> Thread selbst ist im Vergleich zu Intel-Hardware jedoch recht langsam, er bringt etwa ein Drittel bis ein Fünftel der Leistung eines Intel-Cores, außer in Benchmarks, wo die Dinger viel schicker poliert werden.
Dennoch ist das wegen der großen Anzahl der Threads eine ganze Menge Bums in einer kleinen Box ohne viel Stromverbrauch.

Sun hat nun auch eine recht populäre Open Source Datenbank von der Sun es gerne hätte, wenn die auf so einem Eisen gut aussähe.
Leider tut diese Software aufgrund ihrer internen Struktur derzeit nicht so gut auf mehr als ca. 12 <strike>Cores</strike> Threads.
In 
[diesem Benchmark](http://blogs.sun.com/mrbenchmark/entry/scaling_mysql_on_a_256) 
von Sun wird die verzweifelte derzeitige Situation recht schön deutlich: 
Man startet bis zu 32 Instanzen von MySQL auf derselben Kiste, nutzt also 8 <strike>Cores</strike> Threads pro mysqld - die einzelnen mysqld haben aber nichts gemeinsam und könnten genauso gut auch auf anderen Kisten laufen.

Man kann sich leicht ausrechnen, daß das derzeit für Sun keine sehr befriedigende Situation ist. 
Sicherlich ist man intern gerade intensiv dabei, das zu ändern. 
Bis dahin jedoch ist eine 256-Core-Box für ein normales MySQL-Setup eher nicht so schick.
