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
Auf dem
[Heise Newsticker](http://www.heise.de/newsticker/meldung/77951) heißt es: 

>  Harald Welte, Mitentwickler des Netfilter-Firewallcodes im Linux-Kernel
> und Gründer des Projekts [gpl-violations](http://www.gpl-violations.org),
> hat vor Gericht einen Erfolg für die GPL erzielt. Wie er in seinem
> [Blog](http://gnumonks.org/~laforge/weblog/2006/09/07/#20060907-victory)
> berichtet, entschied das Landgericht Frankfurt am 6.9. im Sinne seiner
> Klage wegen GPL-Verletzung. Details dazu wollen Welte und sein Anwalt Till
> Jaeger, Mitbegründer des Instituts für Rechtsfragen der Freien und Open
> Source Software ([ifrOSS](http://www.ifross.org/)), allerdings erst nach
> Veröffentlichung des der schriftlichen Urteilsbegründung nennen.

Jörg Möllenkamp sieht dies als 
[Phyrrussieg](http://www.c0t0d0s0.org/index.php?url=archives/1989-GPL-vor-Gericht-durchgesetzt.html)
für die GPL, aber seine Analyse beruht auf einigen Verständnisfehlern.

In [Von der GPL]({% link _posts/2005-02-07-von-der-gpl.md %}) habe ich die
GPL V2 einmal en detail erläutert und in der an den Artikel anschließenden
Diskussion einige Dinge klargestellt. Der Kommentar ist wichtig, denn er
paßt direkt auf den falschen Gedankengang von Jörg. Hier ist er noch einmal
in voller Länge:

> Die GPL ist eine Lizenz. Sie gibt einem Rechte, sie nimmt einem keine Rechte.
> 
> Wenn die GPL nicht gälte (also Harald Welte den Prozeß verloren hätte), dann
> säßen alle Hersteller dieser netten kleinen embedded Systeme ohne Lizenz da
> und müßten sich an jeden einzelnen Autoren der Komponenten ihres embedded
> Linux Systems einzeln wenden, um sich eine Nutzungslizenz zu holen.

Das ist ein Szenario, daß sich die Hersteller dieser Systeme keinesfalls
wünschen können, denn während die GPL einem **automatisch** Rechte gibt,
sobald man die Bedingungen erfüllt, ist dies bei manuellen
Einzelverhandlungen nicht so: Ein Autor kann individuelle Rechte "einfach
so" verweigern, wenn ihm danach ist. Es ist also eine Gute Sache Für Alle
(tm), daß Harald Welte gewonnen hat und die GPL eine in Deutschland
funktionsfähige und durchsetzbare Lizenz ist.

Die GPL ist eine Lizenz des 
[kooperativen Lagers]({% link _posts/2005-01-05-ein-paar-ideologische-steine-ins-rollen-bringen.md %}). 
Wie jede andere Lizenz muß man sie erwerben, man bekommt sie nicht einfach
so. Lizenzen kompetetiver Spieler bekommt man entweder gar nicht (weil die
Lizenz nicht verkäuflich ist), oder man muß sie für Geld kaufen. Lizenzen
nach der GPL bekommt man, indem man die Spielregeln des kooperativen Lagers
anerkennt und sie befolgt. Indem man sie nicht verfolgt, verliert man in dem
Moment, in dem man dies tut, die durch die Lizenz zugesicherten
Nutzungsrechte.

Sobald man mit den Bedingungen der GPL wieder konform ist, hat man alle
durch die GPL zugesicherten Rechte wieder. Das ist furchtbar nett. Die
meisten kompetetiven Spieler gehen mit Lizenzverstößen weniger nachsichtig
um. Man stelle sich einmal vor, ein Hersteller von embedded Rechnern hätte
widerrechtlich ganz oder in Teilen Code von Microsoft in seinem Produkt
genutzt. Wie wäre die Reaktion wohl ausgefallen?

[Jörg schreibt](http://www.c0t0d0s0.org/index.php?url=archives/1989-GPL-vor-Gericht-durchgesetzt.html),
die GPL sei viral. Das klingt so, als könne man sich an ihr anstecken. Das
ist Unsinn. Entweder entscheidet man sich in einem Projekt, Code zu
verwenden der unter der GPL steht oder man läßt es sein. Aller Code, der
unter der GPL steht, ist klar als solcher erkennbar: Er muß mit einer Kopie
der GPL zusammen verbreitet werden, und diese Datei heißt LICENSE.

Entweder nimmt man fremden Code in seinem Projekt auf - dann muß man eine
Lizenz erwerben, die einem diese Nutzung fremden Codes in seinem Projekt
erlaubt. Oder man tut es nicht. Oder man integriert fremden Code "aus
Versehen" in seinem Projekt. Dann sollte man die Softwareentwicklung
aufgeben, weil man seine Codebasis nicht mehr unter Kontrolle hat und
genauso leicht etwa richtiger Schadcode "aus Versehen" Bestandteil des
Projektes werden könnte.

Selbst wenn man "aus Versehen" GPL-Code in seinem eigenen Projekt
integriert, kann man durch die GPL keine Eigentumsrechte an seinem eigenen
geistigen Eigentum verlieren: Das Recht, den GPL-Code zu nutzen erlischt,
solange man mit den Bedingungen der GPL nicht konform geht. Man kann also in
aller Ruhe den GPL-Code aus seinem Projekt entfernen und das Produkt, das
nun komplett aus eigener geistiger Leistung besteht, weiter vertreiben. Die
GPL zwingt niemanden dazu, seine eigenen Eigentumsrechte aufzugeben.

Die GPL zwingt nur zu einer einzigen Sache.  

> Sie zwingt einen dazu, sich zu entscheiden zwischen dem kompetetiven und
> dem kooperativen Lager, und sie zwingt die Spieler im kooperativen Lager,
> die Regeln der Kooperation einzuhalten.

Die GPL hält die Spieler im kooperativen Lagen ehrlich und fair. Damit macht
sie eine dauerhafte Kooperation überhaupt erst möglich. Sie benutzt dazu das
Urheberrecht, eigentlich ein Instrument des kompetetiven Lagers. Ohne dies
könnte die GPL nicht existieren, denn sie wäre nicht durchsetzbar. Das macht
die GPL zu einem faszinierend einfachen und scheinbar widersprüchlichem
Konstrukt: Gäbe es das kompetetive Lager nicht, wäre das Urheberrecht
obsolet und mit dem Erlöschen der Notwendigkeit für die GPL als
Schutzmechanismus für die
[Code-Allmende](http://de.wikipedia.org/wiki/Allmende) gegen das kompetetive
Lager löst sie sich dann auch sofort Rückstandsfrei auf.

Die GPL vermeidet durch das Erzwingen des 
[Quid Pro Quo](http://de.wikipedia.org/wiki/Quid_pro_quo) den
Konstruktionsfehler, den Lizenzen wie etwa die BSD Lizenz haben. Dort kommt
es immer wieder vor, daß Firmen Quelltext nehmen, geringfügig verbessern und
zur Grundlage ihres Geschäftsbetriebes machen, ohne ihre eigene Leistung der
Gemeinschaft  wieder zur Verfügung zu stellen, auf deren Vorleistungen sie
ihren Betrieb gründen. Die GPL ist im Gegensatz zu solchen Lizenzen
[nachhaltig (_im Sinne einer "Strategie, die sich langfristig aufrecht erhalten lässt"._)](http://de.wikipedia.org/wiki/Nachhaltigkeit)
konstruiert.

Ich schrieb schon 
[damals]({% link _posts/2005-01-05-ein-paar-ideologische-steine-ins-rollen-bringen.md %}):

> Probleme gibt es immer nur dann, wenn Mitglieder der kompetetiven Sphäre
> meinen, sie könnten die Regeln der kooperativen Sphäre ignorieren, weil
> die kooperativen Wertschöpfer untereinander das tun. Die Kompetetiven
> bekommen dann nach den Regeln, die sie selbst geschaffen haben, auf die
> Finger. Müssen sie, damit die kooperative Allmende erhalten werden kann.
> Das ist ja genau der Grund, warum die Fackelträger der Kompetetiven
> versuchen, kooperative Lizenzen mit Schutzmechanismen wie die GPL als
> "viral", "böse", "illegal" oder sonstwie "ganz schlimm" darzustellen,
> allen voran Microsoft und die von Microsoft bezahlten Astroturfer.
> Lizenzen mit Schutzmechanismen schaffen einen geschützten Bereich, in dem
> kooperatives Verhalten möglich ist und unter anderem durch niedrige
> Transaktionskosten belohnt wird. Sie bestrafen Leute, die die Kooperation
> verletzten, indem sie ihnen die viel höheren Transaktionskosten des
> kompetetiven Bereichs auferlegen ("Zieh erst mal Deine Lizenzen gerade.")
> und sie von der Nutzung der freien, aber nicht kostenlosen kooperativen
> Werte ausschließen (Der zu zahlende Preis ist die Einhaltung der Regeln
> der Kooperation).

Das ist das, was Harald Welte hier tut, und er hat zumindest meine
uneingeschränkte ideologische Unterstützung (und mein Geld, wenn er es
braucht): Er fordert die Bezahlung der Lizenzen ein, und hält so den Deal am
Leben. Das ist wichtig, ja sogar zentral.
