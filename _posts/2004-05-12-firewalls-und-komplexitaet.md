---
layout: post
published: true
title: Firewalls und Komplexität
author-id: isotopp
date: 2004-05-12 07:13:35 UTC
tags:
- security
- lang_de
feature-img: assets/img/background/rijksmuseum.jpg
---
In der Computerwoche findet sich ein [Artikel](https://www.tecchannel.de/a/sicherheitsrisiko-web-anwendung,1785212,3), der sich mit dem Thema "Sicherheit von Webanwendungen" beschäftigt. Nun ist es die Computerwoche, und daher nicht so richtig verwunderlich, wenn dieser Artikel das Thema eher ... oberflächlich behandelt. Aber so einige Ideen schockieren mich dann doch.

![](/uploads/firewall.jpg)

> Herkömmliche Schutzmechanismen wie Firewalls greifen bei derartigen Problemen jedoch nicht. Die Angriffe erfolgen auf Applikationsebene über den Browser und somit über die Kommunikationsports 80 (bei Verwendung von HTTP) beziehungsweise 443 (bei HTTPS).

Das ist ja in etwa Sinn einer Webanwendung, daß sie auf diesen Ports mit dem Anwender redet. 

> [Hier] weisen herkömmliche Firewalls hier eine größere Lücke auf.

Im folgenden Text redet der Artikel dann "Firewalls" das Wort, die die Aufgaben eines Web Application Frameworks übernehmen und, indem sie der eigentlichen Anwendung vorgeschnallt werden, die Eingabewerte der Anwendung an deren Stelle prüfen. Wie für Artikel auf diesem Niveau üblich, werden wahre Wunderdinge versprochen:

> Um Missbrauch und Angriffe auf Backend-Anwendungen zu verhindern, sollten Web-Anwendungen daher immer nur Eingaben zulassen, die sinnvoll sind und innerhalb der Erwartungen des jeweiligen Kontexts liegen. Wird beispielsweise eine Postleitzahl abgefragt, dürfen in dem dazugehörigen Feld keine Buchstaben oder Sonderzeichen auftauchen.

Besser als nichts. Nur: Wie auch bei herkömmlichen Firewalls ist es mit dem Aufstellen und Einschalten nicht getan. Wo man anderswo jetzt Kommunikationsprofile analysieren muß, um dann die notwendigen Ports freizuschalten, muß man nun die Webseiten der Anwendung (alle Seiten!) analysieren und einzeln Validierungsprädikate für alle Eingabefelder und deren mögliche Kombinationen und Abhängigkeiten definieren. Man kann sich leicht vorstellen, daß dies ein sehr aufwendiger Prozeß ist - um ein Vielfaches aufwendiger als die Kommunikationsanalyse einer herkömmlichen Firewall.

Dann geht es jedoch weiter: 

> Bei unzureichenden Zugriffskontrollen können Hacker Zugriff zu Benutzerkonten erhalten, nicht für sie bestimmte Daten einsehen oder Funktionen nutzen. Ähnliches gilt für unzureichende Authentisierung und Session-Management [...]

Gegen diese Sorte Fehler kann eine solche vorgeschaltete Eingabekontrolle genau nicht schützen. Eine Session-ID ist eine Session-ID und wenn die schlecht und ratbar ist, dann kann der Anwender die Session eben spontan wechseln, indem er sich eine andere, legale Session-ID ausdenkt.

> Leider sind derartige Produkte nicht ganz billig. Wer sich auf diese Weise absichern will, muss mit Investitionen von 15.000 bis 30.000 Dollar rechnen.

Dieses Geld wäre sicherlich besser in eine Restrukturierung und grundsätzliche Verbesserung der Web-Anwendung investiert. Warum wird das nicht gemacht? 

Antwort: Wie denn, wenn man den Source nicht hat? Das ganze Konzept einer solchen vorgeschalteten Eingabekontrolle ist so unendlich closed source, daß ich bestimmt 15 Minuten gebraucht habe, bis mir einfiel, daß es vielleicht noch irgendwo auf der Welt Leute geben mag, die Fehler in ihren Anwendungen nicht direkt in der Anwendung korrigieren können. Das wiederum ist eine Beobachtung, die im Grunde einen eigenen Artikel wert ist.

Und schließlich die eigentliche Crux: Mit steigender Komplexität der Aufgaben einer Firewall oder eines IDS steigt auch die Wahrscheinlichkeit von Fehlern in diesem System. Exploitbaren Fehlern.

### Beispiele:

- [Dragon-Fire IDS Vulnerability](https://www.securityfocus.com/bid/564/discussion/): "The Dragon-Fire IDS remote web interface under version 1.0 has an insecure CGI script which allows for users to remotely execute commands as the user nobody." Das ist genau die Sorte Fehler, die wir in diesem Artikel diskutieren, in einer Anwendung, die gegen solche Fehler schützen soll.
- [RapidStream Unauthenticated Remote Command Execution Vulnerability](https://www.securityfocus.com/bid/1574/discussion/) "RapidStream offers a line of VPN/Firewall network devices. Each product comes with a modified version of sshd for encrypted remote administration. This version of sshd has a "hard-coded" username in it, rsadmin with a null password (rsadmin = root)" Kein Kommentar mehr notwendig.
- [ Firestorm IDS IP Options Decoding Denial Of Service Vulnerability](https://www.securityfocus.com/bid/4871/discussion/) "It has been reported that Firestorm IDS can be caused to crash when it has received traffic with specific IP options set." Decoding zu komplex für die Sicherheitsanwendung.
- [Etheral](https://www.cvedetails.com/product/424/Ethereal-Group-Ethereal.html?vendor_id=244), nun [Wireshark](https://www.cvedetails.com/product/8292/Wireshark-Wireshark.html?vendor_id=4861) Dies listet eine ganze Reihe von Problemen, bei denen die Anwendung, ein Netzwerkmonitor, sich selbst kompromittiert beim Decodieren von Netzwerkpaketen, die für ganz andere Systeme bestimmt sind. ethereal/wireshark hat natürlich keine Chance - wann immer ein Protokoll selber einen Exploit hat, hat ethereal möglicherweise auch einen. Da alle Protokolle in ethereal decodiert werden müssen, hat ethereal jede Menge Exploits.

Wobei ich sagen muß, daß die ethereal, tcpdump und snort-Listen meine Lieblinge sind. Wenn ich diese Listen sehe, denke ich über <a href="http://www.syborg.de/">gewisse Produkte</a> mit ganz ähnlicher Funktionalität nach, und ob deren Exploit-Listen wohl kürzer sein mögen. Und wer mag da wohl haften, wenn so eine Kiste kompromittiert und dann ausgenutzt wird. Der Netzbetreiber hat die ja nicht freiwillig aufgestellt...
