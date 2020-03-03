---
layout: post
published: true
title: MySQL, Sun, Oracle - und die EU
author-id: isotopp
date: 2009-11-12 20:32:25 UTC
tags:
- europa
- mysql
- oracle
- sun
- lang_de
feature-img: assets/img/background/mysql.jpg
---
Am 20. April 2009 hat Sun verkündet, daß sie von Oracle gekauft werden. Das hätte MySQL mit eingeschlossen. Am 10. November hat die EU dann mitgeteilt, daß sie diesem Kauf widerspricht und zwar ausschließlich wegen MySQL.

[Groklaw hat Hintergründe dazu](http://www.groklaw.net/article.php?story=20091021164738392), die ein wenig komisch erscheinen. Ausgerechnet Monty und Florian Müller argumentieren gegen diesen Verkauf und verwenden in den Texten, die sie öffentlich gemacht haben noch dazu die GPL: Diese verhindere nämlich kommerzielle Spinoffs und Forks von MySQL.

Das ist auf vielen Ebenen seltsam bis unsinnig.

Zum rechtlichen Hintergrund:

MySQL ist ein Dual-License Produkt. Man kann sich entscheiden, ob man die GPL Version von MySQL verwenden will oder ob man stattdessen ein kommerziell lizensiertes MySQL möchte. Die GPL-Version ist gegen Readline gelinkt und kann OpenSSL verwenden, die kommerzielle Version verwendet Editline und eine andere SSL-Bibliothek unter einer anderen Lizenz.

Mein Arbeitgeber ist Kunde bei MySQL, und zwar verwenden wir die GPL-Version von MySQL. Das können wir unter anderem deswegen, weil wir MySQL nicht weitergeben - die GPL garantiert das Recht, die Software auszuführen, den Source zu studieren und die Software zu modifizieren uneingeschränkt. Kunde sind wir für den MySQL-Support, die Software bekommen wir also frei und gratis. Den Support könnten wir auch woanders kaufen, etwa bei Unternehmen der Open Database Alliance, speziell Percona käme zum Beispiel gut in Frage.

MySQL unter einer kommerziellen Lizenz braucht, wer MySQL als Bestandteil seines Produktes weitergeben möchte und dabei seinen eigenen Quelltext nicht offenlegen will.

Die GPL zieht dabei die Grenze an den Prozeßgrenzen - es ist also kein Problem, etwa eine Box zu verkaufen, auf der ein PHP mit mysqlnd mit einem mysqld redet. Der mysqld ist GPL, das PHP und das mysqlnd darin sind PHP-License und beides sind verschiedene Prozesse, die juristisch problemfrei miteinander reden dürfen. Das ganze Ding ist einwandfrei und kann so verkauft werden, ohne daß kommerzielle Lizenzen in irgendeiner Form fällig werden.

Die libmysqlclient.so ist GPL und kommerziell dual licensed. Wer sie in sein Programm linkt, muß sein Programm entweder unter die GPL stellen oder MySQL kommerziell lizensieren. Wenn man das nicht will, ist das im Grunde kein Problem: Das MySQL Protokoll ist schnell reimplementiert - mysqlnd hat das zum Beispiel getan.

Und schließlich kann es sein, daß man sein MySQL tatsächlich embedden will, also mysqld nicht als Server betreiben will, sondern als Bibliothek direkt in ein Programm hinein linken. In diesem Fall hilft einem - wenn man nicht selber GPL sein will - nur eine kommerzielle Lizenz. Oder daß man seine proprietäre Storage Engine in MySQL hineinlinken will - das geht ebenfalls nur mit einer kommerziellen Lizenz, denn andernfalls würde man ja die GPL-Geschmacksrichtung von mysqld  und proprietären Storage Engine Code zusammen mischen und das geht nicht.

Groklaw beleuchtet nun die Argumentation, die wir von Monty zu hören bekommen haben unter verschiedenen Aspekten. Dabei kommt Monty offenbar immer wieder auf die Möglichkeit von proprietären Forks von MySQL zu sprechen, die nicht möglich wären, wenn Oracle die Rechte an MySQL innehätte. Nun, so etwas ist auch jetzt schon nicht möglich, denn die Rechte an MySQL hat derzeit Sun, auch eine kommerzielle Firma.

Groklaw findet es seltsam, daß Monty so gegen die GPL wettert und auch auf den angeblich 'viralen' Character der GPL abhebt (
[Kooperativ vs. Kompetetiv]({% link _posts/2005-01-05-ein-paar-ideologische-steine-ins-rollen-bringen.md %}), [Was steht in der GPL?]({% link _posts/2005-02-07-von-der-gpl.md %}), [Warum GPL?]({% link _posts/2006-09-19-gpl-marktdurchdringung-ist-kein-wert-an-sich.md %})). Das ist Microsoft-Rethorik, und tatsächlich ist Monty nun genau Ratgeber bei der MS Codeflex Foundation. Groklaw zitiert auch eine längeren Text von Carlo Piana, der erklärt, warum die Open Source Community für den Deal sein sollte und wieso die GPL bzw. das Dual Licensing kein Problem sind.

Der Punkt ist jedenfalls, daß die GPL bei MySQL nichts verhindert, außer für zwei sehr eingeschränkte Personenkreise: Leute, die MySQL embedden wollen oder Leute, die ihre proprietäre Technik in MySQL injezieren wollen. Beides ist eigentlich kaum ein Problem.

Der nächste Punkt ist, daß Monty vorgeschlagen hat, daß Sun MySQL verkaufen möge, damit der Merger voran gehen könnte. Die Idee ist recht plump und offensichtlich: Monty kauft MySQL von Sun zurück, mit dem Geld, daß Sun ihm gegeben hat.

Der dritte Punkt ist, daß das Problem nicht bestünde, wäre MySQL pur GPL lizensiert - die ganze Argumentation kann nur Halt finden, weil auch eine kommerzielle Lizenzvariante von MySQL existiert. Diese gehört aber grad Sun…

Weitere Artikel zum Thema:

Der [Economist](http://www.economist.com/node/14840272) hat einen Bericht über den Handel, und zielt darauf ab, daß die amerikanische Monopolkomission dem Deal zugestimmt hat, die europäische ihn aber abgelehnt hat, und wie das zu einem Handelskrieg oder zumindest zu Verstimmung führen könnte.

[Heise](http://www.heise.de/newsticker/meldung/EU-Kommission-hat-Bedenken-gegen-Uebernahme-von-Sun-durch-Oracle-Update-854613.html) berichtet ebenfalls.

Die Position von SAP in dieser Sache bleibt zumindest nach der Berichterstattung im Dunkeln.