---
layout: post
published: true
title: GPL in Deutschland vor Gericht durchgesetzt
author-id: isotopp
date: 2006-09-10 18:07:21 UTC
tags:
- copyright
- free software
- lizenz
- politik
- lang_de
feature-img: assets/img/background/rijksmuseum.jpg
---
<img border='0' hspace='5' align='right' src='/uploads/20040415-gnu-head-sm.serendipityThumb.jpg' alt=' /'>  Auf dem <a href="http://www.heise.de/newsticker/meldung/77951">Heise Newsticker</a> heißt es: <blockquote> Harald Welte, Mitentwickler des Netfilter-Firewallcodes im Linux-Kernel und Gründer des Projekts <a href="http://www.gpl-violations.org">gpl-violations</a>, hat vor Gericht einen Erfolg für die GPL erzielt. Wie er in seinem <a href="http://gnumonks.org/~laforge/weblog/2006/09/07/#20060907-victory">Blog</a> berichtet, entschied das Landgericht Frankfurt am 6.9. im Sinne seiner Klage wegen GPL-Verletzung. Details dazu wollen Welte und sein Anwalt Till Jaeger, Mitbegründer des Instituts für Rechtsfragen der Freien und Open Source Software (<a href="http://www.ifross.org/">ifrOSS</a>), allerdings erst nach Veröffentlichung des der schriftlichen Urteilsbegründung nennen.</blockquote> Jörg Möllenkamp sieht dies als <a href="http://www.c0t0d0s0.org/index.php?url=archives/1989-GPL-vor-Gericht-durchgesetzt.html">Phyrrussieg</a> für die GPL, aber seine Analyse beruht auf einigen Verständnisfehlern.

In <a href="http://blog.koehntopp.de/archives/680-Von-der-GPL.html">Von der GPL</a> habe ich die GPL V2 einmal en detail erläutert und in der an den Artikel <a href="http://blog.koehntopp.de/archives/680-Von-der-GPL.html#c2741">anschließenden Diskussion</a> einige Dinge klargestellt. Der Kommentar ist wichtig, denn er paßt direkt auf den falschen Gedankengang von Jörg. Hier ist er noch einmal in voller Länge:
<br />

Die GPL ist eine Lizenz. Sie gibt einem Rechte, sie nimmt einem keine Rechte.

Wenn die GPL nicht gälte (also Harald Welte den Prozeß verloren hätte), dann säßen alle Hersteller dieser netten kleinen embedded Systeme ohne Lizenz da und müßten sich an jeden einzelnen Autoren der Komponenten ihres embedded Linux Systems einzeln wenden, um sich eine Nutzungslizenz zu holen.

Das ist ein Szenario, daß sich die Hersteller dieser Systeme keinesfalls wünschen können, denn während die GPL einem <b>automatisch</b> Rechte gibt, sobald man die Bedingungen erfüllt, ist dies bei manuellen Einzelverhandlungen nicht so: Ein Autor kann individuelle Rechte "einfach so" verweigern, wenn ihm danach ist. Es ist also eine Gute Sache Für Alle (tm), daß Harald Welte gewonnen hat und die GPL eine in Deutschland funktionsfähige und durchsetzbare Lizenz ist.

Die GPL ist eine Lizenz des <a href="http://blog.koehntopp.de/archives/628-Ein-paar-ideologische-Steine-ins-Rollen-bringen.html">kooperativen Lagers</a>. Wie jede andere Lizenz muß man sie erwerben, man bekommt sie nicht einfach so. Lizenzen kompetetiver Spieler bekommt man entweder gar nicht (weil die Lizenz nicht verkäuflich ist), oder man muß sie für Geld kaufen. Lizenzen nach der GPL bekommt man, indem man die Spielregeln des kooperativen Lagers anerkennt und sie befolgt. Indem man sie nicht verfolgt, verliert man in dem Moment, in dem man dies tut, die durch die Lizenz zugesicherten Nutzungsrechte. 

Sobald man mit den Bedingungen der GPL wieder konform ist, hat man alle durch die GPL zugesicherten Rechte wieder. Das ist furchtbar nett. Die meisten kompetetiven Spieler gehen mit Lizenzverstößen weniger nachsichtig um. Man stelle sich einmal vor, ein Hersteller von embedded Rechnern hätte widerrechtlich ganz oder in Teilen Code von Microsoft in seinem Produkt genutzt. Wie wäre die Reaktion wohl ausgefallen?

<a href="http://www.c0t0d0s0.org/index.php?url=archives/1989-GPL-vor-Gericht-durchgesetzt.html">Jörg schreibt</a>, die GPL sei viral. Das klingt so, als könne man sich an ihr anstecken. Das ist Unsinn. Entweder entscheidet man sich in einem Projekt, Code zu verwenden der unter der GPL steht oder man läßt es sein. Aller Code, der unter der GPL steht, ist klar als solcher erkennbar: Er muß mit einer Kopie der GPL zusammen verbreitet werden, und diese Datei heißt LICENSE. 

Entweder nimmt man fremden Code in seinem Projekt auf - dann muß man eine Lizenz erwerben, die einem diese Nutzung fremden Codes in seinem Projekt erlaubt. Oder man tut es nicht. Oder man integriert fremden Code "aus Versehen" in seinem Projekt. Dann sollte man die Softwareentwicklung aufgeben, weil man seine Codebasis nicht mehr unter Kontrolle hat und genauso leicht etwa richtiger Schadcode "aus Versehen" Bestandteil des Projektes werden könnte.

Selbst wenn man "aus Versehen" GPL-Code in seinem eigenen Projekt integriert, kann man durch die GPL keine Eigentumsrechte an seinem eigenen geistigen Eigentum verlieren: Das Recht, den GPL-Code zu nutzen erlischt, solange man mit den Bedingungen der GPL nicht konform geht. Man kann also in aller Ruhe den GPL-Code aus seinem Projekt entfernen und das Produkt, das nun komplett aus eigener geistiger Leistung besteht, weiter vertreiben. Die GPL zwingt niemanden dazu, seine eigenen Eigentumsrechte aufzugeben.

Die GPL zwingt nur zu einer einzigen Sache.  <blockquote>Sie zwingt einen dazu, sich zu entscheiden zwischen dem kompetetiven und dem kooperativen Lager, und sie zwingt die Spieler im kooperativen Lager, die Regeln der Kooperation einzuhalten.</blockquote> Die GPL hält die Spieler im kooperativen Lagen ehrlich und fair. Damit macht sie eine dauerhafte Kooperation überhaupt erst möglich. Sie benutzt dazu das Urheberrecht, eigentlich ein Instrument des kompetetiven Lagers. Ohne dies könnte die GPL nicht existieren, denn sie wäre nicht durchsetzbar. Das macht die GPL zu einem faszinierend einfachen und scheinbar widersprüchlichem Konstrukt: Gäbe es das kompetetive Lager nicht, wäre das Urheberrecht obsolet und mit dem Erlöschen der Notwendigkeit für die GPL als Schutzmechanismus für die <a href="http://de.wikipedia.org/wiki/Allmende">Code-Allmende</a> gegen das kompetetive Lager löst sie sich dann auch sofort Rückstandsfrei auf.

Die GPL vermeidet durch das Erzwingen des <a href="http://de.wikipedia.org/wiki/Quid_pro_quo">Quid Pro Quo</a> den Konstruktionsfehler, den Lizenzen wie etwa die BSD Lizenz haben. Dort kommt es immer wieder vor, daß Firmen Quelltext nehmen, geringfügig verbessern und zur Grundlage ihres Geschäftsbetriebes machen, ohne ihre eigene Leistung der Gemeinschaft  wieder zur Verfügung zu stellen, auf deren Vorleistungen sie ihren Betrieb gründen. Die GPL ist im Gegensatz zu solchen Lizenzen <a href="http://de.wikipedia.org/wiki/Nachhaltigkeit">nachhaltig (<i>im Sinne einer "Strategie, die sich langfristig aufrecht erhalten lässt".</i>)</a> konstruiert.

Ich schrieb schon <a href="http://blog.koehntopp.de/archives/628-Ein-paar-ideologische-Steine-ins-Rollen-bringen.html">damals</a>: <blockquote>Probleme gibt es immer nur dann, wenn Mitglieder der kompetetiven Sphäre meinen, sie könnten die Regeln der kooperativen Sphäre ignorieren, weil die kooperativen Wertschöpfer untereinander das tun. Die Kompetetiven bekommen dann nach den Regeln, die sie selbst geschaffen haben, auf die Finger. Müssen sie, damit die kooperative Allmende erhalten werden kann.
 
Das ist ja genau der Grund, warum die Fackelträger der Kompetetiven versuchen, kooperative Lizenzen mit Schutzmechanismen wie die GPL als "viral", "böse", "illegal" oder sonstwie "ganz schlimm" darzustellen, allen voran Microsoft und die von Microsoft bezahlten Astroturfer. Lizenzen mit Schutzmechanismen schaffen einen geschützten Bereich, in dem kooperatives Verhalten möglich ist und unter anderem durch niedrige Transaktionskosten belohnt wird. Sie bestrafen Leute, die die Kooperation verletzten, indem sie ihnen die viel höheren Transaktionskosten des kompetetiven Bereichs auferlegen ("Zieh erst mal Deine Lizenzen gerade.") und sie von der Nutzung der freien, aber nicht kostenlosen kooperativen Werte ausschließen (Der zu zahlende Preis ist die Einhaltung der Regeln der Kooperation).</blockquote> Das ist das, was Harald Welte hier tut, und er hat zumindest meine uneingeschränkte ideologische Unterstützung (und mein Geld, wenn er es braucht): Er fordert die Bezahlung der Lizenzen ein, und hält so den Deal am Leben. Das ist wichtig, ja sogar zentral.
