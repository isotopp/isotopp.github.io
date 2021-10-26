---
author-id: isotopp
date: "2006-08-07T18:24:00Z"
draft: true
feature-img: assets/img/background/rijksmuseum.jpg
published: true
tags:
- computer
- geekstuff
- hardware
- technik
- lang_de
title: The Heat Is On
---
<div class="serendipity_imageComment_right" style="width: 110px"><div class="serendipity_imageComment_img"><a class='serendipity_image_link' href='/uploads/cpu_kuehler.jpg'><!--s9ymdb:2040--><img width='110' height='83'  src="/uploads/cpu_kuehler.serendipityThumb.jpg" alt="" /></a></div><div class="serendipity_imageComment_txt">Rückkühler, 2x3m (6 qm) Kupferkühlfläche pro Seite</div></div>[ Dieser Artikel hätte vor zwei Wochen fertiggestellt werden sollen, auf dem Höhepunkt der Hitzewelle, aber ich war zu schlapp zum Schreiben. -- kris ]

<i>"1.21 Gigawatt? Tom Edison, wie erzeugt man so viel Strom?"</i> -- <b>Dr. Emmett Brown</b>

Ein Rechenzentrum ist im Wesentlichen eine große isolierte Kiste, deren Türen die meiste Zeit geschlossen gehalten werden. In das Rechenzentrum rein führen - da kommen die meisten Leute von selber drauf - Stromkabel und Netzwerkkabel. Ins Rechenzentrum rein führen außerdem - und das unterschätzen die meisten Leute - auch Wasserleitungen. Diese pumpen kaltes Wasser in die Wärmetauscher der Klimaanlage und lassen das warme Wasser wieder herausfließen.

Also, wieviel Energie brät so ein Rechenzentrum denn so weg?

Platz im Rechenzentrum wird in HE, Höheneinheiten von 19-Zoll-Schränken, abgerechnet. Ein Schrank hat Platz für 40-42 HE. Ein IBM Bladecenter Chassis faucht hinten aus seinen beiden Radiallüftern 3000-3500 Watt raus, wenn es voll bestückt ist. Es belegt 7 HE. Machte man den Schrank mit 5 oder 6 von diesen Dingern randvoll, würden in diesem Schrank zwischen 15000 und 21000 Watt rausgeblasen werden. In  einem kleinen RZ mit 30 Schränken sind das um die 500 kW.

Wieviel Energie ist das?


Kilowatt sind nur neumodische Worte für PS. Ein Kilowatt sind 1.36 altbekannte Pferdestärken. 15kW sind also 20 PS, in etwa ein <a href="http://en.wikipedia.org/wiki/Renault_4">Renault 4</a>, und 21kW sind 28 PS - mit dieser Leistung flog <a href="http://de.wikipedia.org/wiki/Blériot_XI">Louis Blériot</a> im Jahre 1909 über den Ärmelkanal. 500 kW sind 680 PS. Das ist die Leistung des Motors einer <a href="http://de.wikipedia.org/wiki/Messerschmitt_Bf_109">ME 109</a>, oder etwa halb so viel wie der Motor eines <a hrrf="http://de.wikipedia.org/wiki/Leopard_2">Leopard 2</a> oder 2/3 der Leistung eines <a href="http://de.wikipedia.org/wiki/Bugatti_Veyron_16.4">Bugatti Veyron</a>.

Dafür bekommt man die Power von ca. 5000 Intel-Prozessoren bei 3 GHz, und etwa 5 Terabyte RAM, aber man hat noch keine Platten irgendwo in Betrieb genommen.

Das alles muß man nun circa mal drei bis vier nehmen, denn man muß ja die Platten, den Leistungsverlust durch dezentrale Netzteile und die zusätzliche Energie für Kühlung mitrechnen.

Natürlich stellt man sich nicht alles voll mit Blades - man muß ja auch noch Datenbanken, Fileserver, Ciscos und anderes Zeugs haben, also hat man am Ende nicht einen Raum mit 30 Schränken, sondern drei Räume mit 90 Schränken voll Hardware, aber man arbeitet mit so knapp an die 2 Megawatt, oder zwei Schiffsdiesel mit 1250 PS pro Stück.

<div class="serendipity_imageComment_left" style="width: 110px"><div class="serendipity_imageComment_img"><a class='serendipity_image_link' href='/uploads/schraubenkompressor.jpg'><!--s9ymdb:4039--><img width='110' height='83'  src="/uploads/schraubenkompressor.serendipityThumb.jpg" alt="" /></a></div><div class="serendipity_imageComment_txt">Dies ist ein Schrauben- kompressor, wie er in jedem Kühlschrank seinen Dienst tut. Dieser Kompressor hier wiegt 6 Tonnen und schafft 700 kW weg.</div></div> Das klingt nach einer ganzen Menge Power, ist aber tatsächlich relativ klein so im Vergleich. Google zum Beispiel <a href="http://weblog.philringnalda.com/2005/03/17/just-how-much-power-does-google-need">zieht jetzt an einen Staudamm in Oregon</a>. Die Aluminiumhütte dort hat zugemacht und die <a href="http://www.nwp.usace.army.mil/op/d/thedalles.asp">1.8 Gigawatt</a> aus dem Damm am Columbia River kommen Google gerade recht. Zumal man das Wasser aus dem Damm dann auch gleich zur Kühlung nutzen kann und es in Oregon meist nicht so warm ist. Google muß das, denn sonst <a href="http://buzz.blogger.com/2005/03/more-power.html">wird Blogger dunkel</a>.

Auch andere Internet Firmen <a href="http://seattletimes.nwsource.com/cgi-bin/PrintStory.pl?document_id=2003114987&zsection_id=2002119995&slug=microsoft09&date=20060709">verfolgen dieselbe Strategie</a>. Das alles ist ein <a href="http://www.theinquirer.net/default.aspx?article=33507">ernstes Problem</a>. Man kann sich jetzt auf seinen Status als <a href="http://www.c0t0d0s0.org/archives/1533-Answer-to-the-heat-problem-The-HP-way.html">offizieller Sun Fanboy</a> :) zurückziehen und sagen "Mit Sun Servern wäre das nicht passiert", aber das geht am Kern des Problems vorbei. Denn dann hätte man mehr Server, aber genau denselben Leistungshunger.

Wie sieht das in Deutschland aus? Wir sind ja ein ordentliches Land und nicht so drittweltig wie die USA, wo schon mal 14 Tage lang der Strom in einer Großstadt wegbleiben kann. Aber auch <a href="http://www.ka-news.de/kultur/news.php4?show=tja200387-125H">bei</a> <a href="http://www.welt.de/data/2006/07/20/965948.html">uns</a> <a href="http://www.welt.de/data/2006/07/20/965948.html">passiert</a> <a href="http://www.n24.de/boulevard/nus/index.php/a2006072612193397133">dasselbe</a>.

Für ein Rechenzentrum ist der <a href="http://www.heise.de/newsticker/meldung/59551">Ausfall der Klimaanlage</a> ein schneller Tod. Wenn die Rückkühler, die die Abwärme des Rechenzentrums in die Umgebung ableiten sollen, beschädigt oder blockiert sind, dann bleiben je nach Systemkonstruktion noch 20-30 Minuten, bis die Zulufttemperatur der Geräte die magische 35°C Schwelle überschreitet. Der Betreiber hat dann die Wahl zwischen Abschalten und Hitzetod.

Im Rechenzentrum sieht  das inzwischen nicht viel anders aus. Damit man auf kleinem Raum überhaupt so viel Abwärme generieren kann, muß man seine Luftströme im Rechenzentrum sorgfältig organisieren. Einen ganzen Raum zu kühlen und die Server dann da einfach reinzustellen funktioniert schon bei relativ kleinen Abwärmemengen nicht mehr. 

Stattdessen bläst man kalte Luft in den Unterboden und drückt diese in der Mitte einer Rackreihe hoch. Die kalte Luft muß durch die Racks hindurch, um in den Abwärmegang zu gelangen, wo sie abgesaugt und wieder gekühlt wird - <a href="http://www.conect-online.de/klima_02.html">Kaltgang -  Warmgang</a> ist der Suchbegriff für Google. Entscheidend ist jedenfalls die getrennte Führung von kalter und warmer Luft durch das gesamte Rechenzentrum. Das Paper <a href="http://www-03.ibm.com/servers/eserver/xseries/storage/pdf/IBM_Rear_Door_Heat_Exchanger_FINAL.pdf">Keeping Your Data Center Cool: There Is Another Way</a> (PDF) von IBM gibt einen netten Überblick über "Cold Aisle, Warm Isle", über das Problem des Abluftkurzschlusses und das Problem des Wärmestaus unter der Decke. IBM bewirbt in dem Paper Rear Door Heat Exchangers, also Abluftkühler in Racktüren, aber selbst wenn man deren Produkt nicht will ist das Papier eine nette Sammlung von typischen Kühlungsproblemen, die man mit ein wenig Aerodynamik und geordneter Luftführung in den auch passiv Griff bekommen kann.

Wenn Ihr das nächste Mal also Google benutzt, oder Yahoo, oder web.de, dann denkt mal an Euren Klimatechniker und was der damit zu tun hat, daß das Internet noch funktioniert.
