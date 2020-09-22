---
layout: post
published: true
title: Die Schallmauer durchbrechen...
author-id: isotopp
date: 2004-06-22 08:20:45 UTC
tags: 
- security
- lang_de
feature-img: assets/img/background/rijksmuseum.jpg
---
[SonicWall](http://www.sonicwall.com/products/sslrx.html) preist den SSL Offloader SSL-RX an als 

![](/uploads/sonicwall_rx.jpg)

> SonicWALL SSL Offloaders completely offload all encryption, decryption and secure processes from Web servers, accelerating the performance of Web sites and applications with an affordable, scalable and reliable solution.

Das Gerät wird angegeben mit "Up to 4.400 peak RSA operations per second, 30.000 concurrent connections, 300.000 session cache".

Die Kiste funktioniert in einer möglichen Betriebsart als Bridge, die vor die Webserver geschnallt wird und alle Verbindungen (ssh, http) unverändert durchläßt, https aber decodiert und nach hinten als http etwa auf Port 82 weiterreicht, um dann die Antworten zu nehmen und nach vorne als https auf Port 443 zu verkaufen.

Unglücklicherweise schafft das Gerät nicht das, was ich mir davon erhofft habe - offensichtlich sind "4.400 peak RSA operations per second" nicht 4.400 SSL-Connects pro Sekunde. Außerdem ist das Fehlerverhalten sehr unglücklich - wenn die CPU erst einmal 100% busy ist, macht das Gerät als Bridge vollkommen dicht und man kommt nicht nur mit https, sondern auch mit http und mit ssh nicht mehr durch den Offloader an die Webserver heran.

Nun stellt sich mir die Frage, wieviele RSA-Operations wohl ein SSL-Connect sind, und wieviele SSL Connects pro Sekunde man von der Schachtel erwarten darf.
