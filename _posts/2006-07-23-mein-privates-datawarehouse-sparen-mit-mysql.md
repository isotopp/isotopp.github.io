---
layout: post
published: true
title: Mein privates Datawarehouse - Sparen mit MySQL
author-id: isotopp
date: 2006-07-23 11:50:00 UTC
tags:
- geekstuff
- geld
- mysql
- lang_de
feature-img: assets/img/background/rijksmuseum.jpg
---
<!--s9ymdb:3519--><img width='110' height='57' style="float: right; border: 0px; padding-left: 5px; padding-right: 5px;" src="/uploads/mysql_logo.serendipityThumb.gif" alt="" />Meine Sparkasse exportiert mir die Kontoauszüge aus Wunsch auch als CSV. Die Dateien sehen so aus:


{% highlight console %}

"Auftragskonto";"Buchungstag";"Valutadatum";"Buchungstext";
"Verwendungszweck";
"Begünstigter/Zahlungspflichtiger";"Kontonummer";"BLZ";
"Betrag";"Währung";"Info"
"08154711";"30.12";"30.12.05";"LASTSCHRIFT";
"DRP 08154711 040441777  INKL. 16% UST 5.38 EUR";
"STRATO MEDIEN AG";"040441777";"10050000";
"-39,00";"EUR";"Umsatz gebucht"

{% endhighlight %}


Weil ich wissen will, wofür ich mein Geld ausgebe, lade ich diese Daten in ein MySQL. 

Das geht so:


Zunächst einmal muß ich mir eine Tabelle definieren, in die ich den Load vornehmen kann. Diese Tabelle hat Felder, die in erster Linie dazu geschaffen sind, die Daten aufnehmen zu können. Wir müssen die Daten noch bereinigen, sodaß es sich noch nicht um die endgültigen Felder oder Typen handelt.


{% highlight console %}

-- load data
warnings;
DROP TABLE IF EXISTS buchungen;
CREATE TABLE buchungen (
&nbsp;&nbsp;auftragskonto char(8) NOT NULL,
&nbsp;&nbsp;buchungstag_text char(10) NOT NULL,
&nbsp;&nbsp;valutatag_text char(10) NOT NULL,
&nbsp;&nbsp;buchungstext varchar(50) NOT NULL,
&nbsp;&nbsp;verwendungszweck varchar(180) NOT NULL,
&nbsp;&nbsp;gegenkonto_name varchar(100) NOT  NULL,
&nbsp;&nbsp;gegenkonto_nummer char(20) NOT NULL,
&nbsp;&nbsp;gegenkonto_blz char(8) NOT NULL,
&nbsp;&nbsp;betrag_text char(12) NOT NULL,
&nbsp;&nbsp;waehrung char(3) NOT NULL,
&nbsp;&nbsp;info varchar(255) NOT  NULL,
&nbsp;&nbsp;unique index ( buchungstag_text
&nbsp;&nbsp;&nbsp;&nbsp;, buchungstext
&nbsp;&nbsp;&nbsp;&nbsp;, verwendungszweck
&nbsp;&nbsp;&nbsp;&nbsp;, gegenkonto_nummer
&nbsp;&nbsp;&nbsp;&nbsp;, gegenkonto_blz
&nbsp;&nbsp;&nbsp;&nbsp;, betrag_text)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
truncate table buchungen;

{% endhighlight %}


Es fällt auf, daß in den Kontoauszügen keine eindeutigen Transaktionsnummern sind, sodaß ich keinen Primärschlüssel definieren kann. Mit dem Unique Index, den ich dort definiere, versuche ich doppelte Datensätze zu entdecken. Dies kann jedoch falsche positive Treffer liefern.

In diese Tabelle kann ich nun nacheinander die einzelnen CSV mit den Kontoauszügen hinein laden:


{% highlight console %}

load data infile  
  '/home/kris/Documents/banking/umsatz-22758031-29122004.csv' 
into table buchungen 
fields terminated by ";" 
optionally enclosed by '"' 
ignore 1 lines;
load data infile 
  '/home/kris/Documents/banking/umsatz-22758031-24012005.csv' 
into table buchungen 
fields terminated by ";" 
optionally enclosed by '"' 
ignore 1 lines;
...

{% endhighlight %}


Wir müssen diese Daten nun in brauchbare Datensätze umwandeln. Dazu wird erst einmal eine Zieltabelle erzeugt und diese mit einem Primärschlüssel versehen.


{% highlight console %}

-- prepare conversion stage
DROP TABLE IF EXISTS b;
create table b like buchungen;
alter table b add column id integer unsigned not null first;
alter table b add primary key (id);
alter table b change column id 
&nbsp;&nbsp;id integer unsigned not null auto_increment;

{% endhighlight %}


Jetzt können die Daten umgeladen werden und danach die Felder bereinigt werden: Das Betrag-Feld muß von "xxx.xxx,yy"-Syntax auf "xxxxxx.yy" umgestellt werden und die Datumsfelder valutatag_text und buchungstag_text müssen in ISO-Syntax umgestellt werden. Dabei muß das fehlende Jahr beim buchungstag_text aus dem valutatag ergänzt werden.


{% highlight console %}

-- load data into conversion stage
insert into b select NULL, buchungen.\* from buchungen;

-- adapt betrag
update b set betrag_text = replace(betrag_text, ".", "");
update b set betrag_text = replace(betrag_text, ",", ".");
alter table b change column betrag_text 
&nbsp;&nbsp;betrag decimal(12,2) not null;

-- adapt valutatag
update b set valutatag_text = 
concat("20", 
&nbsp;&nbsp;&nbsp;substring(valutatag_text, 7, 2), 
&nbsp;&nbsp;&nbsp;"-", 
&nbsp;&nbsp;&nbsp;substring(valutatag_text, 4, 2), 
&nbsp;&nbsp;&nbsp;"-", 
&nbsp;&nbsp;&nbsp;substring(valutatag_text, 1,2));
alter table b change column valutatag_text 
&nbsp;&nbsp;valutatag date not null;

-- adapt buchungstag
update b set buchungstag_text = 
concat(year(valutatag), 
&nbsp;&nbsp;&nbsp;"-", 
&nbsp;&nbsp;&nbsp;substring(buchungstag_text, 4,2), 
&nbsp;&nbsp;&nbsp;"-", 
&nbsp;&nbsp;&nbsp;substring(buchungstag_text, 1,2));
alter table b change column buchungstag_text 
&nbsp;&nbsp;buchungstag date not null;

-- drop info
alter table b drop column info;

{% endhighlight %}


Ich will nun außerdem eine Gruppierung meiner Ausgaben vornehmen. Dazu führe ich eine Spalte "gruppe "ein. Mit Hilfe einer weiteren Tabelle "wichtige_geldsenken" matche ich dann den gegenkonto_name und fülle die Gruppe:


{% highlight console %}

-- add gruppe
alter table b add column gruppe varchar(20) not null;

{% endhighlight %}


Und jetzt die wichtige_geldsenken Tabelle:


{% highlight console %}

DROP TABLE IF EXISTS `wichtige_geldsenken`;
CREATE TABLE `wichtige_geldsenken` (
&nbsp;&nbsp;`id` int(10) unsigned NOT NULL auto_increment,
&nbsp;&nbsp;`pattern` varchar(100) NOT NULL,
&nbsp;&nbsp;`gruppe` varchar(20) NOT NULL,
&nbsp;&nbsp;PRIMARY KEY  (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

LOCK TABLES `wichtige_geldsenken` WRITE;
INSERT INTO `wichtige_geldsenken` VALUES (77,'sparkasse','Konto und Karte');
INSERT INTO `wichtige_geldsenken` VALUES (78,'ga','Geldautomat Inland');
INSERT INTO `wichtige_geldsenken` VALUES (79,'qsc','Internet');
INSERT INTO `wichtige_geldsenken` VALUES (80,'linux new media','Zeitungen');
INSERT INTO `wichtige_geldsenken` VALUES (81,'premiere','Fernsehen');
INSERT INTO `wichtige_geldsenken` VALUES (82,'walmart','Einkauf');
INSERT INTO `wichtige_geldsenken` VALUES (83,'kabel bw','Fernsehen');
INSERT INTO `wichtige_geldsenken` VALUES (84,'gez','Fernsehen');
INSERT INTO `wichtige_geldsenken` VALUES (85,'t-mobile','Telefon');
INSERT INTO `wichtige_geldsenken` VALUES (86,'finanzkasse','Steuern und Strafen'
);
INSERT INTO `wichtige_geldsenken` VALUES (87,'domainfactory','Internet');
INSERT INTO `wichtige_geldsenken` VALUES (88,'nagel ue','Kleidung');
INSERT INTO `wichtige_geldsenken` VALUES (89,'mobilcom','Telefon');
INSERT INTO `wichtige_geldsenken` VALUES (90,'domainfactory','Internet');
INSERT INTO `wichtige_geldsenken` VALUES (91,'strato','Internet');
INSERT INTO `wichtige_geldsenken` VALUES (92,'stadtwerke','Gas Wasser Scheisse')
;
INSERT INTO `wichtige_geldsenken` VALUES (93,'deutsche bahn','Bahn');
INSERT INTO `wichtige_geldsenken` VALUES (94,'debeka','Versicherung');
INSERT INTO `wichtige_geldsenken` VALUES (95,'ec-ga','Geldautomat Ausland');
INSERT INTO `wichtige_geldsenken` VALUES (96,'scheck in','Einkauf');
INSERT INTO `wichtige_geldsenken` VALUES (97,'mastercard','Kreditkarte');
INSERT INTO `wichtige_geldsenken` VALUES (98,'dr.','Miete');
INSERT INTO `wichtige_geldsenken` VALUES (99,'a.t.u','Auto');
INSERT INTO `wichtige_geldsenken` VALUES (100,'ungeheuer','Auto');
INSERT INTO `wichtige_geldsenken` VALUES (101,'agip','Sprit');
INSERT INTO `wichtige_geldsenken` VALUES (102,'aral','Sprit');
INSERT INTO `wichtige_geldsenken` VALUES (103,'avia','Sprit');
INSERT INTO `wichtige_geldsenken` VALUES (104,'bab','Sprit');
INSERT INTO `wichtige_geldsenken` VALUES (105,'citti','Einkauf');
INSERT INTO `wichtige_geldsenken` VALUES (106,'efa','Sprit');
INSERT INTO `wichtige_geldsenken` VALUES (107,'esso','Sprit');
INSERT INTO `wichtige_geldsenken` VALUES (108,'expedia','Reisen');
INSERT INTO `wichtige_geldsenken` VALUES (109,'fantasy','RPG');
INSERT INTO `wichtige_geldsenken` VALUES (110,'gravis','Toys und Gadgets');
INSERT INTO `wichtige_geldsenken` VALUES (111,'foto','Toys und Gadgets');
INSERT INTO `wichtige_geldsenken` VALUES (112,'heinrich','Kleidung');
INSERT INTO `wichtige_geldsenken` VALUES (113,'hem','Sprit');
INSERT INTO `wichtige_geldsenken` VALUES (114,'hotel','Reisen');
INSERT INTO `wichtige_geldsenken` VALUES (115,'jet-tank','Sprit');
INSERT INTO `wichtige_geldsenken` VALUES (116,'karstadt','Einkauf');
INSERT INTO `wichtige_geldsenken` VALUES (117,'kassen-','Steuern und Strafen');
INSERT INTO `wichtige_geldsenken` VALUES (118,'leichtsinn','Toys und Gadgets');
INSERT INTO `wichtige_geldsenken` VALUES (119,'media markt','Toys und Gadgets');
INSERT INTO `wichtige_geldsenken` VALUES (120,'mios','Sprit');
INSERT INTO `wichtige_geldsenken` VALUES (121,'plaza','Einkauf');
INSERT INTO `wichtige_geldsenken` VALUES (122,'rundfunkgebuehren','Fernsehen');
INSERT INTO `wichtige_geldsenken` VALUES (123,'saturn','Toys und Gadgets');
INSERT INTO `wichtige_geldsenken` VALUES (124,'sb tank','Sprit');
INSERT INTO `wichtige_geldsenken` VALUES (125,'segelkiste','Kleidung');
INSERT INTO `wichtige_geldsenken` VALUES (126,'total/','Sprit');
INSERT INTO `wichtige_geldsenken` VALUES (127,'trx','Reisen');
INSERT INTO `wichtige_geldsenken` VALUES (128,'tst. bensheim','Sprit');
INSERT INTO `wichtige_geldsenken` VALUES (129,'vobis','Toys und Gadgets');
INSERT INTO `wichtige_geldsenken` VALUES (130,'willenberg','Toys und Gadgets');
INSERT INTO `wichtige_geldsenken` VALUES (131,'shell','Sprit');
INSERT INTO `wichtige_geldsenken` VALUES (132,'spreadshirt','Kleidung');
INSERT INTO `wichtige_geldsenken` VALUES (133,'armin meier','Kleidung');
INSERT INTO `wichtige_geldsenken` VALUES (134,'itzehoer','Versicherung');
INSERT INTO `wichtige_geldsenken` VALUES (135,'ec-pos','Geldautomat Ausland');
INSERT INTO `wichtige_geldsenken` VALUES (136,'euf-ga','Geldautomat Ausland');
INSERT INTO `wichtige_geldsenken` VALUES (137,'dell','Toys und Gadgets');
INSERT INTO `wichtige_geldsenken` VALUES (138,'yvonne','RPG');
UNLOCK TABLES;

{% endhighlight %}


Mit Hilfe dieser Mappingtabelle und der folgenden Query kann ich jetzt das Feld gruppe in b sinnvoll belegen:


{% highlight console %}

update b set gruppe = ( 
&nbsp;&nbsp;&nbsp;&nbsp;select gruppe 
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;from wichtige_geldsenken as w 
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;where b.gegenkonto_name like concat(w.pattern, "%") 
&nbsp;&nbsp;order by length(pattern) desc 
&nbsp;&nbsp;&nbsp;&nbsp;limit 1) where b.betrag < 0;

{% endhighlight %}


Wenn meine pattern-Liste vollständig ist, ist jetzt das Feld gruppe bei allen Ausgaben korrekt belegt.

Ich kann nun Fragen stellen:


{% highlight console %}

select gegenkonto_name, 
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;count(gegenkonto_name) as eingaenge 
&nbsp;&nbsp;&nbsp;&nbsp;from b 
&nbsp;&nbsp;&nbsp;where betrag>=0 
group by gegenkonto_name 
order by eingaenge desc;
+--------------------------------------------------------+-----------+
| gegenkonto_name                                        | eingaenge |
+--------------------------------------------------------+-----------+
| WEB.DE AG AMALIENBADSTR. 41                            |        12 |
| MYSQL GMBH                                             |         7 |
| MYSQL GMBH SCHLOSSERSTR. 4 72622 NUERTINGEN            |         3 |
| COOP SCHLESWIG-HOLSTEIN EG BENZSTR. 10                 |         2 |
+--------------------------------------------------------+-----------+

{% endhighlight %}



{% highlight console %}

select gegenkonto_name, 
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;count(gegenkonto_name) as abgaenge 
&nbsp;&nbsp;&nbsp;&nbsp;from b 
&nbsp;&nbsp;&nbsp;where betrag<0 
group by gegenkonto_name 
order by abgaenge desc;
+---------------------------------------------------------+----------+
| gegenkonto_name                                         | abgaenge |
+---------------------------------------------------------+----------+
| SCHECK IN CENTER KA DURLACH                             |       36 |
| MOBILCOM COMMUNICATIONSTECH                             |       22 |
| STRATO MEDIEN AG                                        |       22 |
| VERMIETER                                               |       19 |
| T-MOBILE DEUTSCHLAND GMBH                               |       18 |
| DEUTSCHE BAHN KARLSRUHE HB                              |       17 |
| KABEL BW GMBH & CO. KG                                  |       17 |
| QSC AG                                                  |       17 |
| STADTWERKE KARLSRUHE                                    |       17 |
...

{% endhighlight %}


Mit den Gruppen kann ich nun auch sehen, wo das Geld hin gegangen ist:


{% highlight console %}

select gruppe, 
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;count(betrag) as abgaenge, 
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;sum(betrag) as total 
&nbsp;&nbsp;&nbsp;&nbsp;from b 
&nbsp;&nbsp;&nbsp;where betrag<0 
group by gruppe 
order by total;

{% endhighlight %}


wird mir sagen, wofür ich mein Geld ausgebe.
