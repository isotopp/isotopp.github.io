---
layout: post
published: true
title: Ihr Imageserver greift meinen PC an
author-id: isotopp
date: 2004-10-21 07:44:07 UTC
tags:
- security
- lang_de
feature-img: assets/img/background/rijksmuseum.jpg
---
Da sich dies langsam zur FAQ auswächst, hier einmal als Text, damit ich in Zukunft darauf verweisen kann.

Sie schreiben: 
> Ich erhalte von Ihnen immer 8 TCP Scans auf meinen Rechner. Da es nicht das erste Mal ist, daß mein Router mir das von Ihrem Rechner aus meldet, muß ich Sie dazu auffordern dies bitte zu unterlassen. Possible TCP port scan from 217.72.195.85 (8 ports) against (IP-Nummer).

Sie sehen Meldungen, die die IP-Nummer 217.72.195.85 betreffen. Diese IP-Nummer gehört zu dem Namen img.web.de. "img.web.de" ist ein Cluster von vielen spezialisierten Webservern für statische Dateien, etwa für Bilder und statische HTML-Seiten. Es handelt sich nicht um einen realen Server, sondern um die virtuelle IP eines Loadbalancers für Webserver. Von dort kann keine Portscan-Software arbeiten.

Wenn Sie eine Webseite von der Domain web.de anfordern, sind darauf Verweise auf eine ganze Reihe von Bilddateien in Form von "&lt;img src="https://img.web.de/...." />-Verweisen enthalten. Ihr Rechner baut dann in sehr schneller Folge Verbindungen zu img.web.de auf, um diese Bilder von dort zu laden. Dabei wird auf der Seite von img.web.de immer Port 80 (http) bzw. Port 443 (https) verwendet. Auf Ihrer Seite verwendet Ihr Rechner dazu aufeinanderfolgende hohe Portnummern (32768, 32769, und so weiter), die durch Ihr Betriebssystem festgelegt werden.

Ihre Firewall ist übersensibel und interpretiert diese Verbindungsaufbauten wegen der aufeinanderfolgenden Portnummern als Portscan. Es handelt sich jedoch nicht um einen Angriffsversuch von img.web.de, ja noch nicht einmal um von unserem Rechner ausgehende Verbindungen. Stattdessen interpretiert Ihre Firewall Aktionen genau des Rechners, den sie schützen soll als Angriff auf diesen Rechner.

Bitte konfigurieren Sie Ihre Firewall so, daß sie keine Falschmeldungen mehr erzeugt oder ignorieren Sie die Meldungen.
