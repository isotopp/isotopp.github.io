---
layout: post
published: true
title: Ein paar Benchmarks zum kalibrieren
author-id: isotopp
date: 2007-11-01 14:38:10 UTC
tags:
- benchmark
- dateisysteme
- datenbanken
- mysql
- lang_de
feature-img: assets/img/background/rijksmuseum.jpg
---
<!-- s9ymdb:3519 --><img width="110" height="57" style="float: right; border: 0px; padding-left: 5px; padding-right: 5px;" src="/uploads/mysql_logo.serendipityThumb.gif" alt="" /> Ich habe ein wenig mit iozone gespielt. Erstes Opfer war eine NetApp FAS3040 with 4096MB RAM and 512MB NVRAM. Angeschlossen waren 14 Disks mit 10k RPM, mit 4Gbit Fibre Channel auf device-mapper-multipath so, daß die beiden primary Paths das I/O machen und die beiden sekundären Pfade im wesentlichen Idle bleiben.

Gefahren hab ich gegen das Ding ein iozone und zwar <ul><li>iozone -f iozonefile -o -O -i0 -i2 -s4g -r16k</li><li>iozone -T -t 8 -F iozonefile{0..7} -o -O -i0 -i2 -s1g -r16k</li><li>iozone -T -t 32 -F iozonefile{0..31} -o -O -i0 -i2 -s512m -r16k</li></ul> und das wiederum gegen ein ext3 und gegen ein xfs. 

Kernel war 2.6.9-55.ELsmp von einem RHEL 4 Nahant Update 5. Weil ich Datenbanker bin, interessieren mich nur die Random Writes (InnoDB Blockgröße ist 16K). 
{% highlight console %}
Random Writes

      1 @4g  8 @1g    32 @ 512m
ext3  1482   3514.13  3132.09
xfs   1538   3741.75  3104.22
{% endhighlight %}
 Danach habe ich genau dasselbe Spiel noch einmal gegen eine 2.6.9-42.ELsmp aus einem CentOS 4.4 Final gemacht. Die Maschine war eine HP 385 mit einem RAID-10 aus drei Paaren. Hier bekomme ich diese Zahlen: 
{% highlight console %}
Random Writes

      1 @4g  8 @1g    32 @ 512m
ext3  1468    995.61  1043.05
xfs   1335   1014.92   943.72
{% endhighlight %}
 Ich hab das Spielzeug noch einen Tag länger. Wenn jemand also noch was getestet haben will - her mit den Ideen.

<b>Related:</b> <a href="http://acmqueue.com/modules.php?name=Content&pa=showpage&pid=506">Grosse Platten und Lebensdauer</a> (ACM Queue).

<b>Nachschlag:</b> Lassen wir den Benchmark doch mal mit allen Threads auf derselben Datei statt auf unterschiedlichen Dateien laufen. <ul><li>iozone -f iozonefile -o -O -i0 -i2 -s4g -r16k</li><li>iozone -T -t 8 -F ./iozonefile ... -o -O -i0 -i2 -s1g -r16k</li><li>iozone -T -t 8 -F ./iozonefile ... -o -O -i0 -i2 -s512m -r16k</li></ul> Dadurch könnte deutlich werden, wie xfs mit Contention-Problemen auf dem Inode-Writelock besser fertig wird. 
{% highlight console %}
NetApp

Random Writes

      1 @4g  8 @1g    32 @ 512m
ext3  1482   1553.60  1557.63
xfs   1538   4727.12  5680.56

DAS

Random Writes

      1 @4g  8 @1g    32 @ 512m
ext3  1468   1593.20  1671.52
xfs   1335   1689.69  1739.42
{% endhighlight %}
