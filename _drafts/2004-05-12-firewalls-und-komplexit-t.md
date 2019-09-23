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
<a href='/uploads/firewall.jpg'><img border='0' hspace='5' align='right' src='/uploads/firewall.serendipityThumb.jpg' alt='' /></a> In der Computerwoche findet sich ein <a href="http://www.cowo.de/index.cfm?type=detail&artid=60594&category=73&Pageid=255">Artikel</a>, der sich mit dem Thema "Sicherheit von Webanwendungen" beschäftigt. Nun ist es die Computerwoche, und daher nicht so richtig verwunderlich, wenn dieser Artikel das Thema eher ... oberflächlich behandelt. Aber so einige Ideen schockieren mich dann doch.

<i>Herkömmliche Schutzmechanismen wie Firewalls greifen bei derartigen Problemen jedoch nicht. Die Angriffe erfolgen auf Applikationsebene über den Browser und somit über die Kommunikationsports 80 (bei Verwendung von HTTP) beziehungsweise 443 (bei HTTPS).</i> Das ist ja in etwa Sinn einer Webanwendung, daß sie auf diesen Ports mit dem Anwender redet. <i>[Hier] weisen herkömmliche Firewalls hier eine größere Lücke auf.</i>

Im folgenden Text redet der Artikel dann "Firewalls" das Wort, die die Aufgaben eines Web Application Frameworks übernehmen und, indem sie der eigentlichen Anwendung vorgeschnallt werden, die Eingabewerte der Anwendung an deren Stelle prüfen. Wie für Artikel auf diesem Niveau üblich, werden wahre Wunderdinge versprochen:

<i> Um Missbrauch und Angriffe auf Backend-Anwendungen zu verhindern, sollten Web-Anwendungen daher immer nur Eingaben zulassen, die sinnvoll sind und innerhalb der Erwartungen des jeweiligen Kontexts liegen. Wird beispielsweise eine Postleitzahl abgefragt, dürfen in dem dazugehörigen Feld keine Buchstaben oder Sonderzeichen auftauchen.</i>

Besser als nichts. Nur: Wie auch bei herkömmlichen Firewalls ist es mit dem Aufstellen und Einschalten nicht getan. Wo man anderswo jetzt Kommunikationsprofile analysieren muß, um dann die notwendigen Ports freizuschalten, muß man nun die Webseiten der Anwendung (alle Seiten!) analysieren und einzeln Validierungsprädikate für alle Eingabefelder und deren mögliche Kombinationen und Abhängigkeiten definieren. Man kann sich leicht vorstellen, daß dies ein sehr aufwendiger Prozeß ist - um ein Vielfaches aufwendiger als die Kommunikationsanalyse einer herkömmlichen Firewall.

Dann geht es jedoch weiter: 

<i>Bei unzureichenden Zugriffskontrollen können Hacker Zugriff zu Benutzerkonten erhalten, nicht für sie bestimmte Daten einsehen oder Funktionen nutzen. Ähnliches gilt für unzureichende Authentisierung und Session-Management [...]</i>

Gegen diese Sorte Fehler kann eine solche vorgeschaltete Eingabekontrolle genau nicht schützen. Eine Session-ID ist eine Session-ID und wenn die schlecht und ratbar ist, dann kann der Anwender die Session eben spontan wechseln, indem er sich eine andere, legale Session-ID ausdenkt.

<i>Leider sind derartige Produkte nicht ganz billig. Wer sich auf diese Weise absichern will, muss mit Investitionen von 15.000 bis 30.000 Dollar rechnen.</i> 

Dieses Geld wäre sicherlich besser in eine Restrukturierung und grundsätzliche Verbesserung der Web-Anwendung investiert. Warum wird das nicht gemacht? 
<blockquote>Antwort: Wie denn, wenn man den Source nicht hat? Das ganze Konzept einer solchen vorgeschalteten Eingabekontrolle ist so unendlich closed source, daß ich bestimmt 15 Minuten gebraucht habe, bis mir einfiel, daß es vielleicht noch irgendwo auf der Welt Leute geben mag, die Fehler in ihren Anwendungen nicht direkt in der Anwendung korrigieren können. Das wiederum ist eine Beobachtung, die im Grunde einen eigenen Artikel wert ist.</blockquote>
Und schließlich die eigentliche Crux: Mit steigender Komplexität der Aufgaben einer Firewall oder eines IDS steigt auch die Wahrscheinlichkeit von Fehlern in diesem System. Exploitbaren Fehlern.

<b>Beispiele:</b>
<a href="http://securityfocus.com/bid/564/discussion/">http://securityfocus.com/bid/564/discussion/</a>
<i>The Dragon-Fire IDS remote web interface under version 1.0 has an insecure CGI script which allows for users to remotely execute commands as the user nobody.</i>

Das ist genau die Sorte Fehler, die wir in diesem Artikel diskutieren, in einer Anwendung, die gegen solche Fehler schützen soll.

<a href="http://securityfocus.com/bid/1574/discussion/">http://securityfocus.com/bid/1574/discussion/</a>
<i>RapidStream offers a line of VPN/Firewall network devices. Each product comes with a modified version of sshd for encrypted remote administration. This version of sshd has a "hard-coded" username in it, rsadmin with a null password (rsadmin = root).</i>

Kein Kommentar mehr notwendig.

<a href="http://securityfocus.com/bid/4871/discussion/">http://securityfocus.com/bid/4871/discussion/</a>
<i> It has been reported that Firestorm IDS can be caused to crash when it has received traffic with specific IP options set.</i>

Decoding zu komplex für die Sicherheitsanwendung.

<a href="http://securityfocus.com/bid/keyword/">http://securityfocus.com/bid/keyword/</a>, Suchbegriff "ethereal"

Dies listet eine ganze Reihe von Problemen, bei denen die Anwendung, ein Netzwerkmonitor, sich selbst kompromittiert beim Decodieren von Netzwerkpaketen, die für ganz andere Systeme bestimmt sind. ethereal hat natürlich keine Chance - wann immer ein Protokoll selber einen Exploit hat, hat ethereal möglicherweise auch einen. Da alle Protokolle in ethereal decodiert werden müssen, hat ethereal jede Menge Exploits.

<A CLASS="bulletlink" HREF="http://securityfocus.com/bid/9952">Ethereal Multiple Vulnerabilities</A>
<A CLASS="bulletlink" HREF="http://securityfocus.com/bid/9248">Ethereal SMB Protocol Dissector Denial of Service Vulnerability</A>
<A CLASS="bulletlink" HREF="http://securityfocus.com/bid/9249">Ethereal Q.931 Protocol Dissector Denial of Service Vulnerability</A>
<A CLASS="bulletlink" HREF="http://securityfocus.com/bid/8951">Multiple Ethereal Protocol Dissector Vulnerabilities</A>
<A CLASS="bulletlink" HREF="http://securityfocus.com/bid/7878">Ethereal DCERPC Dissector Memory Allocation Vulnerability</A>
<A CLASS="bulletlink" HREF="http://securityfocus.com/bid/7880">Ethereal OSI Dissector Buffer Overflow Vulnerability</A>
<A CLASS="bulletlink" HREF="http://securityfocus.com/bid/7879">Ethereal SPNEGO Dissector Denial Of Service Vulnerability</A>
<A CLASS="bulletlink" HREF="http://securityfocus.com/bid/7883">Ethereal TVB_GET_NSTRINGZ0() Memory Handling Vulnerability</A>
<A CLASS="bulletlink" HREF="http://securityfocus.com/bid/7881">Ethereal Multiple Dissector String Handling Vulnerabilities</A>
<A CLASS="bulletlink" HREF="http://securityfocus.com/bid/7493">Ethereal Multiple Dissector One Byte Buffer Overflow Vulnerabilities</A>
<A CLASS="bulletlink" HREF="http://securityfocus.com/bid/7494">Ethereal Mount Dissector Integer Overflow Vulnerability</A>
<A CLASS="bulletlink" HREF="http://securityfocus.com/bid/7495">Ethereal PPP Dissector Integer Overflow Vulnerability</A>
<A CLASS="bulletlink" HREF="http://securityfocus.com/bid/7049">Ethereal SOCKS Dissector Format String Vulnerability</A>
<A CLASS="bulletlink" HREF="http://securityfocus.com/bid/7050">Ethereal NTLMSSP Dissector Heap Corruption Vulnerability</A>
<A CLASS="bulletlink" HREF="http://securityfocus.com/bid/6563">Ethereal PPP Dissector Malformed Packet Memory Corruption Vulnerability</A>
<A CLASS="bulletlink" HREF="http://securityfocus.com/bid/6564">Ethereal TDS Dissector Malformed Packet Memory Corruption Vulnerability</A>
<A CLASS="bulletlink" HREF="http://securityfocus.com/bid/6565">Ethereal BGP Dissector Infinite Loop Denial of Service Vulnerability</A>
<A CLASS="bulletlink" HREF="http://securityfocus.com/bid/6567">Ethereal LMP Dissector Malformed Packet Memory Corruption Vulnerability</A>
<A CLASS="bulletlink" HREF="http://securityfocus.com/bid/5573">Ethereal ISIS Dissector Memory Corruption Vulnerability</A>
<A CLASS="bulletlink" HREF="http://securityfocus.com/bid/5162">Ethereal BGP Dissector Buffer Overflow Vulnerability</A>
<A CLASS="bulletlink" HREF="http://securityfocus.com/bid/5163">Ethereal SOCKS Dissector Memory Corruption Vulnerability</A>
<A CLASS="bulletlink" HREF="http://securityfocus.com/bid/5164">Ethereal WCP Dissector Buffer Overflow Vulnerability</A>
<A CLASS="bulletlink" HREF="http://securityfocus.com/bid/5165">Ethereal RSVP Dissector Memory Corruption Vulnerability</A>
<A CLASS="bulletlink" HREF="http://securityfocus.com/bid/5166">Ethereal LMP Dissector Memory Corruption Vulnerability</A>
<A CLASS="bulletlink" HREF="http://securityfocus.com/bid/5167">Ethereal AFS Dissector Memory Corruption Vulnerability</A>
<A CLASS="bulletlink" HREF="http://securityfocus.com/bid/4806">Ethereal Server Message Block Dissector Malformed Packet Denial Of Service Vulnerability</A>
<A CLASS="bulletlink" HREF="http://securityfocus.com/bid/4807">Ethereal DNS Dissector  Infinite Loop Denial of Service Vulnerability</A>
<A CLASS="bulletlink" HREF="http://securityfocus.com/bid/4808">Ethereal GIOP Dissector Memory Exhaustion Vulnerability</A>
<A CLASS="bulletlink" HREF="http://securityfocus.com/bid/4805">Ethereal X11 Dissector Buffer Overflow Vulnerability</A>
<A CLASS="bulletlink" HREF="http://securityfocus.com/bid/4604">Ethereal ASN.1 String Memory Allocation Denial Of Service Vulnerability</A>
<A CLASS="bulletlink" HREF="http://securityfocus.com/bid/4168">Ethereal Malformed SNMP Denial of Service Vulnerability</A>
<A CLASS="bulletlink" HREF="http://securityfocus.com/bid/1972">Ethereal AFS Buffer Overflow Vulnerability</A>

Wobei ich sagen muß, daß die ethereal, tcpdump und snort-Listen meine Lieblinge sind. Wenn ich diese Listen sehe, denke ich über <a href="http://www.syborg.de/">gewisse Produkte</a> mit ganz ähnlicher Funktionalität nach, und ob deren Exploit-Listen wohl kürzer sein mögen. Und wer mag da wohl haften, wenn so eine Kiste kompromittiert und dann ausgenutzt wird. Der Netzbetreiber hat die ja nicht freiwillig aufgestellt...
