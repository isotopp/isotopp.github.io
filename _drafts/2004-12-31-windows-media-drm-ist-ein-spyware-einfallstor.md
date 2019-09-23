---
layout: post
published: true
title: Windows Media DRM ist ein Spyware Einfallstor
author-id: isotopp
date: 2004-12-31 06:01:13 UTC
tags:
- media
- security
- lang_de
feature-img: assets/img/background/rijksmuseum.jpg
---
<img width='83' height='110' border='0' hspace='5' align='right' src='/uploads/ketten.serendipityThumb.jpg' alt='' /> PCWorld schreibt in <a href="http://www.pcworld.com/news/article/0,aid,119016,00.asp">Risk Your PC's Health for a Song</a> von seltsamen WMA-Dateien, die Popup-Ads angezeigt hätten und versucht haben, Ad-Ware zu installieren. Wie soll das gehen?

Genauere Untersuchung enthüllt die üblichen Verdächtigen: Da ist einmal Microsoft, eine Firma auf dem <a href="http://netrn.net/spywareblog/archives/2004/10/03/bill-gates-to-go-after-spyware/">Feldzug gegen Spyware</a>, für die <a href="http://news.com.com/2100-1001-816880.html">Security Priorität Nummer 1</a> ist. Diese Firma baut Windows Media Audio-Files (WMA-Files) so, daß Digital Restrictions Management (DRM) verwendet wird. Wenn der Windows Media Player keine Lizenz für eine WMA-Datei auf dem lokalen Rechner finden kann, dann zieht er eine auf einem entfernten System, auf dem ein WMA DRM-Server laufen muß.

Das passiert nur sehr selten, aber wenn es passiert, dann mit Hilfe einer License Dialog Box, die nichts anderes ist als ein Internet Explorer in Verkleidung. Ein Internet Explorer, der wie der echte Internet Explorer dem Lizenzdialog vollkommen sinnloserweise Zugriff auf alle Scriptingmöglichkeiten gibt, die der echte Browser auch hätte...

Aber Microsoft ist nicht alleine in dieser Sache. PCWelt schreibt:

<blockquote>When we played the modified files, the License Acquisition dialog box showed a page containing ads and quickly spawned more IE windows, each containing a different ad.

Not only did we get bombarded with unwanted ads, but one of the ad windows in a video file tried to install adware onto our test PC surreptitiously, while another added items to our browser's Favorites list and attempted to change our home page. And a window from the original music file asked to download a file called lyrics.zip, which contained the installer for 180search Assistant, commonly categorized as an adware program.</blockquote> Wo kommen diese Dateien her?

PCWorld untersuchte den Vorfall und stellte fest, daß jede dieser Dateien Seiten von einer Firma namens <a href="http://www.overpeer.com">Overpeer</a> geladen hat (eine Tochter von <a href="http://www.loudeye.com">Loudeye</a>). <blockquote>Marc Morgenstern, Loudeye vice president and general manager of digital media asset protection, says the files we found come from a different division of the company--one that targets users with promotions or ads based on the keywords those users search for on P-to-P networks or in other venues.

Though the two businesses differ, the result is likely the same--a further reduction in the effectiveness of popular P-to-P networks. Morgenstern characterized Overpeer's actions as just deserts for people who illegally trade copyrighted works for free. "Remember, the people who receive something like (the ad-laden media files), in some cases, were on P-to-P, and they were trying to get illicit files," he says.</blockquote> Das, Herr Morgenstern, ist nicht der Punkt. Der Punkt ist: Wenn ich versuchte, solche Software auf diese Weise auf dem Rechner von Herr Morgenstern zu installieren, dann würde ich <a href="http://www.lightlink.com/spacenka/fors/">als Hacker verurteilt</a>. <a href="http://www.loudeye.com/common/aboutus/companyoverview.asp">Die Mission von Loudeye</a> ist, so schreibt die Firma auf ihrer Site <blockquote>Loudeye plays a central role in global digital media supply chain management for content owners across the music, film/video, game and software industries as well as media distributors including consumer brand companies, services providers, portals and entertainment companies.</blockquote> Wir als Kunden sollen mit DRM im Ernst einer Firma vertrauen, die Spyware und Adware in das von ihr verbreitete DRM injeziert? Das wäre in etwa so, als würde ich beim Essen einer Firma vertrauen, die vergiftete Nahrungsmittel herstellt und dann argumentiert "Aber das war eine andere Abteilung unserer Firma. Und bedenken Sie, die Leute, die solche vergifteten Lebensmittel von uns bekommen haben, waren Junkies, die in Mülltonnen gewühlt haben und das Haltbarkeitsdatum war auch schon abgelaufen." "Na, dann ist ja alles gut!".

Ist es nicht.

Ich habe über Weihnachten effektiv zwei Tage damit zugebracht, das Windows XP auf dem Rechner meines Vaters nach einer Virusinfektion wieder aufzusetzen - kein MSIE, kein Outlook, aktuelles Antivir, aktuelles Ad-Aware. Und in Zukunft wohl auch kein Media Player, so sich das noch so konfigurieren läßt.

Die Kiste ist jetzt Dual Boot und mein Vater - über 70 Jahre - lernt den Umgang mit Linux, weil er keinen Bock auf eine Wiederholung so eines Szenarios hat. Da er sowieso schon Mozilla und OpenOffice gewohnt ist, und KDE auf Suse Linux 9.2 sich nicht so verschieden von XP bedient, sollte dies möglicherweise einfacher sein als ein XP sicher zu kriegen.

Und Microsoft? <blockquote>"We're looking into exactly what's going on with this file and checking to see if this particular model is in keeping with the licensing terms for Windows Media [Digital Rights Management]," says David Caulton, group product manager for Microsoft's Windows Digital Media Division. "We wouldn't want to endorse anything that involved delivery of content that appears to be one thing, and then something else is delivered."</blockquote> Nein! Das Einschmuggeln von aktivem Content über Lizenzaquise ist möglicherweise vielleicht eventuell sogar illegal? Oy. Ich bin schockiert!

Hallo? McMicrosoft, jemand zu Hause? Was glaubt Ihr eigentlich, wie lange es dauert, bis wir den ersten WMA/WMV-Wurm bekommen und ich die Kiste bei meinem Vater und ihr die von Bill Gates wieder neu machen könnt? Es ist mir egal, ob ihr das endorsed oder nicht. So etwas hat schlicht nicht möglich zu sein! 

Niemand braucht euer stinkendes DRM wirklich, um Musik zu bekommen. Und wenn ihr es Euren Usern schon aufzwingt, dann wenigstens in einer Weise, die den Rechner nicht zu einer grell beleuchteten Einflugschneise für jede Form von Viren- und Wurmdreck macht, der da draußen in den Weiten des Internet herumfliegt. Vielleicht solltet Eure Top Priority noch mal ein wenig weiter hoch skalieren.

Oder einfach MP3 und OGG benutzen. Oder in kurz:

<blockquote><dl><dt>\sh></dt><dd>Is it a problem of microsoft or a problem of using untrusted p2p networks?</dd>
<dt>isotopp></dt><dd>It is a problem for Loudeye. These people are poisoning WMA files under the name of Overpeer, and sell WMA to people as Loudeye.</dd>
<dt>isotopp></dt><dd>It is a problem for Microsoft. Because once again MS Internet Explorer in                disguise bit them into the ass.</dd>
<dt>isotopp></dt><dd>And this is going to be a problem for everybody who bets the company on WMA.</dd>
<dt>isotopp></dt><dd>Consider my Daddy: He is a typical consumer, buying Aldi PCs, and software from Mediamarkt. And he is straight on the road away from windows now - already on Mozilla and OOo for years, he's now exiting windows as a platform due to security problems.</dd></blockquote>(via <a href="http://dev.null.org/">/dev/null</a>)
