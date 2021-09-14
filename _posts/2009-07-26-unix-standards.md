---
layout: post
published: true
title: Unix-"Standards"
author-id: isotopp
date: 2009-07-26 17:14:50 UTC
tags:
- computer
- linux
- solaris
- unix
- lang_de
feature-img: assets/img/background/rijksmuseum.jpg
---
Die Geschichte von Unix ist eine Geschichte der gescheiterten oder unbrauchbaren Standards - ihre Zahl ist Legion. 

Egal in welche Richtung man schaut: Sun zum Beispiel hatte einmal einen auf Postscript basierenden Desktop - [NeWS](http://en.wikipedia.org/wiki/NeWS), der in gewissser Weise X11 um Jahrzehnte voraus war, sich aber nie hat durchsetzen können, unter anderem deswegen, weil das Ding von Sun als Waffe gegen andere Unix-Anbieter verwendet worden war und quasi tot-lizensiert wurde, gefolgt von[Open Look](http://en.wikipedia.org/wiki/OPEN_LOOK) und dann dem Motif-basierenden [CDE](http://en.wikipedia.org/wiki/Common_Desktop_Environment). Speziell letzteres war endlich ein herstellerübergreifendes Projekt, das von allen kommerziellen Unix-Anbietern unterstützt wurde (siehe auch [den Solaris-Artikel](http://en.wikipedia.org/wiki/Solaris_%28operating_system%29#Desktop_environments)). Da Motif als Toolkit aber bis zur Obsoleszens keine freie Software war und CDE auch keine nennenswerte Weiterentwicklung erfuhr, wurde es inzwischen großflächig durch KDE oder Gnome ersetzt - beides nativ freie Software.

Auch auf Ebenen weiter unten war Standardisierung schwierig und ist vielfach gescheitert - so hat [POSIX](http://en.wikipedia.org/wiki/POSIX) bis heute keine Norm für Access Control Lists von Dateisystemen und entsprechend ist etwa die Kommandozeilensyntax (und Ausdrucksstärke) von Access Control Lists auf einem Mac, einem Linux und einem Solaris unterschiedlich. Schaut man sich die Datumsangaben in dem verlinkten Wikipedia-Artikel an, kann man erkennen, daß Posix ein klassischer Nachfolgestandard ist - also kein Standard, der irgendetwas definiert oder voran bringt, sondern einer, der nur eine bereits vollzogene Entwicklung dokumentiert und festschreibt. Auch hier sind Herstellerkriege um Definitionsmacht die Ursache dafür.

Auf der anderen Seite findet man eine Reihe von Innovationen in Unix, die sich universell durchgesetzt haben, aber erst nachdem ein Hersteller sie in klarer Verletzung aller formellen und informellen Standards eingeführt hat. Um bei Sun zu bleiben: Die heutige Architektur von Shared Libraries (.so's) wie wir sie kennen ist einem Alleingang von Sun geschuldet, der so erfolgreich war, daß wir ihn heute in allen Unices finden, die überlebt haben. Genau so ist das heutige Layout von Dateisystemen, also die Einführung von /var, /home, /opt und die Aufgabe der Trennung von / und /usr ein Alleingang von Sun, der so erfolgreich war, daß er über den Umweg von SVR4 in alle nennenswerten modernen Unices Einzug gehalten hat.

Sun hat das damals machen können, weil sie Workstations in großer Zahl abgesetzen konnten und so die entsprechende Definitionsmacht hatten. Außerdem sind die oben genannten Innovationen Beispiele für Innovationen, die nicht totlizensiert waren und so ohne Risiko experimentell von anderen Herstellern übernommen werden konnten.

Die Rolle von Sun im heutigen Unix-Markt ist eine viel kleinere - Sun hat nicht nur nach Stückzahlen, sondern vor allen Dingen nach Developer- Mindshare eine sehr viel kleinere Rolle. Sun hat immer noch Ideen, einige von denen sind sogar kopierenswert. In die nach Stückzahlen und vor allen Dingen nach Developer-Mindshare sehr viel größere Linux-Welt werden sie jedoch nicht.

Die Gründe sind immer noch dieselben wie oben:

ZFS und Dtrace sind zwei Ideen, die sehr kopierenswert sind, die aber aus der Sicht der Linux-Welt totlizensiert sind. Sie sind totlizensiert in dem Sinne, daß die Lizenz dieser Stücke Software frei im Sinne von DFSG sein mag, aber die Lizenz ist mit der GPL inkompatibel. Das mag Absicht oder ein unglücklicher Zufall sein, Fakt ist, daß diese Ideen so nicht direkt als Code in Linux übernommen werden können. Also entwickeln sich in Linux alternative Projekte und es ist absehbar, daß diese in den nächsten 5 Jahren die entsprechenden Sun-Konzepte verdrängen werden - falls Oracle den Kram (**Update wegen [ixs Artikel](http://blog.vodkamelone.de/archives/157-BTRFS-und-die-Lizenz....html):** gemeint ist ZFS, das ja nun wie ganz Sun auch Oracle gehört) nicht Linux-kompatibel relizensiert. Letzteres wäre immerhin denkbar, denn die BTRFS-Entwicklung wurde zu einem guten Teil von Oracle finanziert und BTRFS ist das Linux-Gegenstück zu ZFS.

Ein anderes Beispiel für eine Sun-Idee, die kopierbar wäre, aber nicht kopiert wird, ist SMF - hier ist die Sun-Lösung zu häßlich oder verkopft und es gibt zu viele konkurrierende Ideen, um [init](http://en.wikipedia.org/wiki/Init#Other_styles) zu ersetzen. Wahrscheinlicher ist es, daß sich Konzepte wie [Upstart](http://en.wikipedia.org/wiki/Upstart) auf breiter Front durchsetzen.

Unter dem Strich bleiben einige Erkenntnisse: 

- Standards sind öfter als nicht Festschreibungen bereits erfolgter Standardisierungsprozesse. Sie sind meist mehr Dokumentation als Innovation.
- Innovation wird im Unix-Bereich oft als Abweichung von einem vermeintlich oder tatsächlich bestehenden Standard wahrgenommen und daher oft schon aus Prinzip und ungeachtet ihres Nutzens mit Kritik überzogen.
- In 2009 haben die verschiedenen Linux-Distributionen endlich eine solche Marktmacht, daß sie de-facto Standards setzen können, die mit großer Wahrscheinlichkeit bald in Standarddokumenten dokumentiert werden. Die Tatsache, daß Sun 
die GNU Tools im Pfad vor den eigenen Tools positioniert ist Testament dieser Entwicklung.
- Die Tatsache, daß es einen Unterschied macht ob man Sun Tools oder GNU Tools vorne im Pfad hat (oder BSD- statt SysV-Tools vorne im Pfad plaziert), ist Dokumentation der Tatsache, daß die existierenden Standardisierungen im Unix-Bereich noch lange nicht weit genug gehen, um eine Plattform zu erzeugen, die für die Anwendungsentwicklung groß genug wäre. Kommandozeilenwerkzeuge sind aber nur ein Aspekt der Sache - das Spiel setzt sich in rpm, deb, pkg und anderen Paketformaten, tar-Versionen, Desktop-Umgebungen und so weiter fort.
- Andererseits dokumentiert der bisherige Erfolg von Linux, daß das gar nicht so schlimm ist - von allen Unix-Versionen außer Linux sind überhaupt nur noch Solaris und AIX übrig geblieben und beide werden immer Linux-ähnlicher. Das ist eine gute Sache, und wenn man das erst einmal akzeptiert hat, kann man sich an den Tisch setzen und konstruktiv dokumentatorische Standards verabschieden.

(geschrieben nach der Lektüre von 
[Jörgs Rant](http://www.c0t0d0s0.org/archives/5785-Thoughts-of-an-admin-starting-to-get-old-....html))