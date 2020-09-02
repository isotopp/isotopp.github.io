---
layout: post
published: true
title: Appliances
author-id: isotopp
date: 2004-07-13 17:59:36 UTC
tags:
- security
- lang_de
feature-img: assets/img/background/rijksmuseum.jpg
---
Appliances sind eine Pest. Egal, welche Farbe sie haben und was sie tun.

![](/uploads/appliance.jpg)

Eine Appliance ist irgendein geschlossenes Gerät, das im lokalen Netz hängt und dort irgendwelche Funktionen erbringt, ohne daß man sich darauf einloggen kann oder sonstwie auseinander bauen kann. Eine Appliance ist ein Service in einer Kiste. Das Problem ist nicht der Service, das Problem ist die Kiste und die Tatsache, daß sie zu ist.

Leute tun Services in Appliances, weil sie glauben, daß sie dadurch Komplexität verbergen und die Administration des Netzwerkes vereinfachen. Statt sich um einen Rechner mit Betriebssystem, Konfiguration und Service kümmern zu müssen, hat man nun einfach nur noch einen Service, um den man sich kümmern kann. Der Rest verschwindet durch die Tatsache, daß die Kiste zu ist.

Natürlich nicht.

Es gibt zwei Arten von Appliances, und beide haben unterschiedliche Sorten von Problemen. 

Das eine sind "embedded appliances", kleine Kisten mit einem Betriebssystem im ROM oder im Flash. Sie haben meist wenig Prozessorpower, wenig Speicher und keine Festplatte. Solche Appliances sind etwa HP Printserver als Bestandteil von Druckern, Voice-IP Telefone oder DSL Access Router und ähnliches Kroppzeugs. Diese Sorte Geräte wird meistens Opfer ihrer eigenen begrenzten Ausstattung - weil CPU-Leistung und Speicher in solchen Geräten begrenzt sind, sind Protokollimplementierungen in diesen Geräten oft haarscharf an der Spec vorbei, sie haben oft ein undefiniertes Fehlerverhalten, arbiträre Längenbegrenzungen und unterentwickelte Diagnosemöglichkeiten. Sicherheitsfeatures, die eigentlich dringend notwendig wären, fehlen komplett.

Beispiele für typische Symptome: 

- Printer, die angeblich bootp/DHCP sprechen, aber bei Paketen mit mehr als 512 Byte spontan in einen Reboot verfallen (nachdem sie erneut bootp/DHCP machen, wieder mehr als 512 Byte bekommen ...).
- VoIP Telefone, die angeblich XML können, aber nur etwas sehr viel beschränkteres als XML akzeptieren. Das Repertoire an Fehlermeldungen beschränkt sich auf "Host nicht erreichbar" und "Irgendwo in Deinem XML war irgendwas nicht so wie ich das gerne hätte."
- Geräte beziehen Flash-Updates per TFTP. Über das Internet vom Hersteller. Ungesichert, unauthentisiert und unsigniert. Und werden so zu Spam-Relays oder remoten Netzwerksniffern.
- DSL Access Router mit NAT und Firewall, die bei der durchschnittlichen Anzahl an Esel-Connections in einer handelsüblichen WG den Überlauf der Connection-Tabelle wegen Speichermangel mit einem spontanen Systemstillstand quittieren (Ok, das würden manche als Feature sehen).

Das andere Problem sind "colored Boxes", seien sie jetzt blau, gelb, orange oder sonstwie gefärbt. Es handelt sich bei diesen Geräten meistens um ausgewachsene 1U-PCs oder bunte Würfel, mit einer dicken CPU, ausreichend Speicher und einer Platte. Auf ihnen läuft eine heftig angepatzte Version von Linux, BSD oder einem anderen Standardbetriebssystem, eine Anwendung, die den Lebenszweck der Box darstellt, und eine Web-GUI.

Colored Boxes sind ebenfalls problematisch: Sie enthalten ein vollständiges Standardbetriebssystem mit dem vollständigen Standardsortiment an Fehlern, bekommen aber nicht das Standardsortiment an Security-Patches, das auf selbstgebaute, offene Kisten angewendet wird. Sie erschließen die Funktionalität der Anwendung über eine Web-GUI, die die üblichen Probleme von Web-GUIs hat, also kaputtes Statehandling, unzureichende Prüfung von Eingabeparametern, Injection-Bugs, XSS und was dergleichen mehr für Spaß sorgt. Und wenn man sie mal gegen die Wand konfiguriert hat, kriegt man - closed box - keine Shell, mit der man sie mal eben glattziehen oder reinstallieren könnte.

Typische Probleme von colored Boxes sind beispielhaft: 

- Security Patches für die auf dem Betriebssystem installierte Distribution sind gar nicht oder nicht ausreichend schnell verfügbar.
- Der Weg, auf dem die Box die Patches beziehen will ist mit dem Einsatz in einer Produktionsumgebung nicht vereinbar und die Box drückt sich beim Update die Nase an der Firewall platt, weil man keinen lokalen Patchserver einstellen kann.
- Die mitgelieferte Web-GUI ist ein Hort von Scriptingfehlern und dient als Exploitsammlung
- Wenn die Dinger erst einmal gerootet sind, sind sie genauso gefährlich wie ein offenes Linux oder BSD (weil sie ein Linux oder BSD sind), solange sie nicht gerootet sind, kann man sie aber nicht pflegen, weil man nicht drauf kommt.

Gegen die zweite Sorte Appliances - colored boxes - kann man etwas tun. Nämlich entweder selber machen, oder jemanden kaufen, der es selber machen kann und den dann tun lassen.

Gegen die erste Sorte Appliances kann man wenig tun. Mit Netzwerkdruckern, DSL- und WLAN-Accesspoints, Webcams mit Ethernet-Interface und neuerdings VoIP-Geräten schleichen sich immer mehr dieser Geräte in ein typisches Desktop-LAN und wird dort früher oder später zu einem unkalkulierbaren Risiko.

Wieviele Printserver, VoIP-Telefone oder WLAN-APs sind in Eurem Netz? Was ist, wenn jemand für diese Geräte einen Exploit hinbekommt? Wie managed Ihr dieses Risiko in Eurem Netz?
