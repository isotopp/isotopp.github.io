---
layout: post
published: true
title: MySQL auf einem dedizierten Server
author-id: isotopp
date: 2007-07-29 10:09:07 UTC
tags:
- dedicated server
- hardware
- mysql
- work
- lang_de
feature-img: assets/img/background/rijksmuseum.jpg
---
<!-- s9ymdb:3519 --><img width="110" height="57" style="float: right; border: 0px; padding-left: 5px; padding-right: 5px;" src="/uploads/mysql_logo.serendipityThumb.gif" alt="" /> "Ich hab hier einen Dedi und da soll ein MySQL drauf" ist die kleinere Version der Frage aus <a href="http://blog.koehntopp.de/archives/1775-Hardware-fuer-ein-MySQL.html">Hardware für ein MySQL</a>. Das in diesem Artikel gesagte gilt natürlich auch im Großen und Ganzen hier, nur daß man bei der Auswahl der Hardware und der Konfiguration mehr oder weniger eingeschränkt ist. Insbesondere kann man in der Regel kein RAM nachlegen oder mehr Platten einbauen lassen.

<b>Physikalischer Server</b>

Ein richtiger Dedi mit physikalischer Hardware hat ein bis acht GB RAM, in jedem Fall zwei Festplatten und eine Dual-Core CPU (etwa <a href="http://www.strato.de/server/highq/index.html">Strato HighQ</a> oder <a href="http://www.1und1.info/xml/order/ServerRoot;jsessionid=636B1633BFC34503594CEB1B07F1C687.TC32b?__frame=_top&__lf=Static">1&1</a>. Aus dem Vorgängerartikel wissen wir, daß bis 2G Hauptspeicher ein 32 Bit Betriebssystem Vorteile hat, für mehr Speicher aber die 64 Bit Version des Betriebssystems unerläßlich ist um allen Speicher in MySQL nutzen zu können.
<br />

Am Plattensubsystem kann man nichts drehen - die internen Platten werden in ein RAID-1 konfiguriert und man bekommt um die 200 Seeks pro Sekunde bei Schreibzugriffen. Will man mehr Performance, muß man tricksen und höhere Risiken in Kauf nehmen, die aus der Entkoppelung von Commit und persistentem Speicher folgen (innodb_flush_log_at_trx = 2 ist quasi unerläßlich, wenn man signifikant Last auf dem Gerät hat).

Eine andere Besonderheit eines solchen Setups ist, daß der Server in der Regel kein reiner MySQL-Server ist, sondern auf derselben Maschine in der Regel noch der Webserver und eine Scriptsprache wie PHP, Ruby oder Perl ausgeführt wird. Die scheinbare Übermotorisierung - die CPU ist im Vergleich zu den installierten Platten viel zu groß - wird dadurch schnell relativiert. Das sowieso schon knappe RAM wird durch so eine Konstellation jedoch in der Regel noch knapper: Alle Dedi-Angebote haben eine RAM-Ausstattung, die aus Datenbanksicht sowieso schon knapp ist.

Webserver wie Apache brauchen vergleichsweise viel Speicher. Unter Umständen sind Alternativen wie Jan Kneschke's <a href="http://www.lighttpd.net/">Lighttpd</a> ("Lighty") interessant. Lighty braucht weniger Speicher, ist effizienter und das Deployment von Ruby oder PHP durch FCGI ist nicht nur mindestens genau so schnell wie mod_php, sondern kann durch den Einsatz von Chroot-Umgebungen und das Ablaufen lassen der Anwendungen unter dedizierten, vom Webserver verschiedenen UIDs auch sicherer gestaltet werden als das Ausführen von Code in Apache-Modulen.

Beim Einsatz von MySQL ist es wichtig unter allen Umständen zu verhindern, daß die Maschine swapped. Da Webserver/Scriptsprache und MySQL um Speicher konkurrieren ist es sehr wichtig, die MySQL-internen Puffer und den durch den Webserver verbrauchten Speicher zu begrenzen. Am einfachsten überlegt man sich, wieviel des vorhandenen Hauptspeichers man jedem Subsystem zuweisen möchte und tuned das System dann so als hätte man den betreffenden Dienst auf einem kleineren System dieser Größe alleine.

Für MySQL kann man den die MySQL Prozeßgröße ungefähr mit ((sort_buffer+join_buffer+read_rnd_buffer)*max_connections*1/3 + key_buffer_size + query_cache_size + innodb_buffer_pool_size) abschätzen, aber das ist nur eine Faustregel. Für einen reinen InnoDB-Server will man eine Prozeßgröße von ca. 80% des gesamten verfügbaren Speichers erzielen, für einen reinen MyISAM-Server will man eine Prozeßgröße von etwa 50% des verfügbaren Speichers haben, damit noch File System Buffer Cache zum Cachen von MYD-Daten verfügar ist.

Auf einem Dedi mit 4G Speicher soll ein MySQL installiert werden. Ein GB Speicher soll für einen Webserver verwendet werden, sodaß wir ca. 2.5G für den MySQL-Server verwenden können. Der MySQL-Server ist ein reiner MyISAM-Server, sodaß wir eine MySQL-Prozeßzielgröße von etwa 1-1.2G anstreben und weitere 1.2G als File System Buffer Cache verwenden wollen.

Für den Query Cache geben wir 32M bis 64M Speicher, für die von max_connections abhängigen Puffer werden wir so um die 200M verbrauchen und InnoDB wird nicht verwendet, sodaß wir 800M bis 1000M in den Key_buffer investieren könnnen. Die Prozeß-Zielgröße wird in der Prozeßliste als "VIRT" angezeigt, der tatsächlich belegte Speicher ist in der Spalte RES/RSS sichtbar. Wenn der Server neu gestartet ist, ist RES/RSS zunächst sehr klein und nähert sich dann langsam der VIRT-Größe an, wenn sich die Caches des Servers langsam auf Betriebstemperatur erwärmen.


{% highlight console %}
  PID USER      PR  NI  VIRT   RES  SHR S %CPU %MEM    TIME+  COMMAND
12862 mysql     15   0 1023m  919m 4088 S  0.0  2.0   0:09.70 mysqld-max
{% endhighlight %}


Es kann außerdem sinnvoll sein, die Swapneigung des Systems durch Setzen von vm.swappiness = 0 in /etc/sysctl.conf zu begrenzen.

Die Konfigurationen aus dem Vorgängerartikel sind gut für Server mit hoher Schreiblast, für Server mit einer großen Datenbank, oder für Server mit einem extrem hohen Queries-per-Second-Rating (mehr als 10.000 qps). Für kleinere Lasten oder kleinere Datenbanken kann man mit einem Dedicated Server gute Erfolge erzielen: Wenn die Datenbank klein genug ist, um in den Speicher des Servers zu passen, ist das Disk-Subsystem nur für Writes relevant. Da das Webfrontend mit aufdemselben Server läuft wie die Datenbank ist der Anzahl der Transaktionen eine natürliche Grenze gesetzt: Wenn das System durch den Webserver oder die Datenbank überlastet wird, wird es als Ganzes gesättigt werden und beide Dienste - Datenbank und Webserver - werden langsamer. Probleme können im Grunde nur entstehen, wenn eine Komponente die andere in den Swap treibt.

<b>Virtueller Server</b>

Auf einem virtuellen Server kann man einen Datenbankserver im Grunde nur als Syntaxprüfer für SQL betreiben: 

Die Speichersituation ist in der Regel noch <a href="http://www.rootforum.de/forum/viewtopic.php?t=46736">sehr viel schlechter</a> als auf einem physikalischen Server. Da sich Caches nicht in sinnvollen Größen dimensionieren lassen um bei wirklicher Last wirksam zu werden, erzeugt der Server noch mehr Platten-Seeks als auf einem physikalischen Server. Da auf einem Vserver-Host meistens mehrere Guests laufen und oft in jedem dieser Guests ein MySQL mit zu wenig RAM zum Cachen läuft, werden die verschiedenen Guests um Disk-Seeks des Hosts konkurrieren und das Disk-Subsystem des Hosts überlasten.

Wenn ernsthaft den Einsatz von MySQL geplant ist, kommt ein Vserver (oder eine vmware) nicht in Frage. Zum Testen oder für Proof-of-Concept Studien und Entwicklung kann er gut geeignet sein.
