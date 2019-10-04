---
layout: post
published: true
title: Spam und IP-Blacklisten
author-id: isotopp
date: 2008-11-09 08:24:00 UTC
tags:
- mail
- spam
- lang_de
feature-img: assets/img/background/rijksmuseum.jpg
---
<!-- s9ymdb:1677 --><img class="serendipity_image_right" width="110" height="93" style="float: right; border: 0px; padding-left: 5px; padding-right: 5px;" src="/uploads/spam.serendipityThumb.jpg" alt="" /> <a href="http://blog.balrog.de/archives/490-Anti-Spam-Appliances-Considered-Harmful.html
">Axel hat Ärger</a> mit Blacklists: <blockquote>I've had this problem in the past, when the company I was working for was justifiably listed on an RBL. And I had it again, now - only this time I am reasonably sure that the system is a) configured tightly enough not to be usable as an open relay and b) not being used for sending out marketing or other possibly spam-alike emails.</blockquote> Solche IP-Blacklists sind in der Theorie eine gute Idee: Betreiber von Systemen, die als Quellen von Spam oder als Spamrelays dienen können, sollen dort gelistet werden. Benutzer der Blacklist können bei eingehenden Mails erkennen, ob sie von einer IP-Adresse eingeliefert wird, die in so eine Blacklist steht und die Mail dann schon vor dem Spamfilter ablehnen.



In der Praxis sieht es dann so aus: <ul><li>Die Kriterien, nach denen ein Eintrag in der Liste durch den Betreiber der Blacklist erfolgt, sind nicht offengelegt oder werden nicht korrekt eingehalten.

In der Vergangenheit hat es Fälle gegeben, in denen Betreiber IP Adressen gelistet haben, nicht weil von dort Spam ausgegangen ist, sondern weil auf diesen Adressen Propaganda gegen den Blacklist-Betreiber zu lesen war, oder weil der Inhaber der IP-Adresse Probes von Blacklist-Bereibern nicht zugelassen hat.</li><li>Eine Benachrichtigung des Inhabers der IP-Adresse über die Eintragung erfolgt nicht.

Stattdessen bemerkt man den Eintrag dadurch, daß Mail an Nutzer der Blacklist spontan nicht mehr funktioniert.</li><li>Eine Kontaktaufnahme mit dem Betreiber der Blacklist ist oftmals nicht möglich oder wird sehr erschwert.

Der Blacklist-Betreiber betreibt seine Liste als Bulk-Geschäft, er vermeidet aktiv Kommunikation mit den Leuten, deren Adressen er listet. Einen Schutz gegen falsche Listung oder eine Aufhebung der Listung ist teilweise Glückssache, in einigen Fällen wurde auch schon Geld dafür verlangt.</li></ul> Für denjenigen, der Mail empfängt, kommen noch weitere Probleme dazu. Der Empfänger glaubt sein System dadurch zu entlasten oder vor Spam zu schützen, indem er eine IP-Blacklist vorschaltet. In Wahrheit gibt er die Kontrolle darüber ab, wer ihm Mail senden darf. Und zwar an Dritte, die wie oben gezeigt, IPs nach einem nicht transparent gemachten Schema listen oder wieder freischalten.

Andererseits hängen zum Teil geschäftskritische Prozesse an der Verfügbarkeit des Mailsystems. Der Eingang von Bestellungen, das Absenden von Bestellbestätigungen und anderen Kundenbenachrichtigungen und andere Korrespondenz gehen über dieses System.

Wer in so einer Situation eine Blacklist verwendet, riskiert im Grunde sein Geschäft. Wenn es noch dazu eine Blacklist ist, die in einem anderen Rechtssystem auf einem anderen Kontinent nach intransparenten und teilweise fragwürdigen Regeln gepflegt wird und deren Betreiber sich systematisch schwer erreichbar machen, dann liegt  das irgendwo zwischen Leichtsinn und Sabotage.

Wenn mich jemand nach IP Blacklists fragt, dann sage ich in der Regel: "Wer eine IP-Blacklist außer Haus gibt, der gibt die Kontrolle über sein Mailsystem außer Haus. Im Grunde wäre er besser beraten seinen Mailer abzuschalten. Dann hat man wenigstens einen definierten Fehlerzustand." 

Die nächste Frage ist dann meistens: "Du willst doch nicht sagen, daß z.B. web.de ohne Blacklist auskäme?"

Die Antwort darauf ist: "Doch, web.de verwendet eine Blacklist. Diese wird aber im Haus erstellt und gepflegt. Dazu gibt es klare Richtlinien. web.de ist außerdem erreichbar, und garantiert eine Bearbeitung einer Beschwerde binnen 24 Werktags-Stunden. Und man kann etwa einen Newsletter oder eine Rundmail bei web.de anmelden, um zu verhindern, daß legitime Massenmail mit Spam gleichgesetzt wird. Vorraussetzung dazu ist eine feste Absender-IP und die Nennung eines Abuse-Ansprechpartners."

Und genau das macht den Unterschied zwischen einer Wildwest-Blacklist aus, wie die über die Axel sich beklagt und einem sinnvoll betriebenen Selbstschutz.

