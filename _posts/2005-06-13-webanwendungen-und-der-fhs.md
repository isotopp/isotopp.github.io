---
layout: post
published: true
title: Webanwendungen und der FHS
author-id: isotopp
date: 2005-06-13 10:47:50 UTC
tags:
- filesystems
- php
- s9y
- lang_de
feature-img: assets/img/background/rijksmuseum.jpg
---
Auf der S9Y Mailingliste fragte ein zukünftiger Paketmaintainer nach, ob er Serendipity für seine Distribution packen solle und wir ihn dabei unterstützten wollen. Abgesehen von allgemeinen Überlegungen die dagegen sprechen, gibt es noch andere Gründe, die das nicht wünschenswert machen.

In den Bereich der allgemeinen Überlegungen fallen zum Beispiel die Releasezyklen von Distributionen: Sie sind in der Regel sehr viel länger als die von Webanwendungen wie Serendipity. Insbesondere sehr langwellige Distributionen wie Debian verteilen mit ihren Paketen Versionen der Software, die die Entwickler von S9Y nicht mehr unterstützen können und wollen. 

Auch ist fraglich, welchen Gewinn ein solches Package bringen soll. Eine Anwendung wie S9Y installiert sich mit Download-Auspacken-Anklicken sowieso schon selber und ist dabei dann an keinerlei externes Packaging oder fremde Zyklen gebunden. Eine Installation mit Betriebssystem-Packages bringt da nur Nachteile und fehlende Flexibilität. Zum Beispiel ist es so nicht leicht möglich, mehr als eine Version von S9Y an mehr als einer Location im System zu installieren, denn das Packagemanagement der üblichen Distributionen unterstützt weder konkurrente Installation unterschiedlicher Paketversionen noch sind verschiebliche Pakete mit durch den Anwender bestimmter Package-Root allgemein üblich.

Aber das ist nur die Spitze des Eisberges. Checkt man sich einmal 
[webapps-common](https://alioth.debian.org/projects/webapps-common/) aus und liest, was da drin steht - oder vielmehr nicht drin steht, sieht man, daß ein solches Packaging nur Nachteile haben kann: 

> ## 2.1 Web applications and the FHS
>
> Web applications should follow the same guidelines as any other software. most specifically, they should not make any assumption about how the administrator has arranged the file hierarchy outside of the FHS by placing files in non-standard places such as /var/www or /usr/local. Specifically, the following table should serve as guidelines for the location of files:
> 
> | type of file                           | location                        |
> +----------------------------------------+---------------------------------+
> | static web pages                       | /usr/share/PACKAGE/www          |
> | dynamically interpreted web pages      | /usr/share/PACKAGE/www          |
> | persistent application data            | /var/lib/PACKAGE                |
> | dynamcially executed web pages         | /usr/lib/cgi-bin/PACKAGE        |
> | application-specific libraries         | /usr/share/PACKAGE/include      |
> | site configuration                     | /etc/PACKAGE                    |
> | locally modifiable/overridable content | /etc/PACKAGE/templates          | 
> | php libraries                          | /usr/share/php/PACKAGE          |
> | rrd, mrtg and other database files     | see database application policy |
>
> Fußnoten weggelassen.


Das ist so kraß konsequent an der Realität vorbei, daß es mir persönlich schon wieder Respekt abnötigt.

Webanwendungen sind überall für Webhostingumgebungen entwickelt, denn dies ist bei weitem die verbreiteste Form des Deployments für Webanwendungen. Webhostingumgebungen werden aber in der Regel per Filetransfer in ein Verzeichnis unterhalb der DocumentRoot der Kundendomain beschickt. Sicherheitsmechanismen in Webhostingumgebungen berücksichtigen das: Mit chroot() oder Virtual Base Directory versuchen sie, den Kunden auf seinen Verzeichnisteilbaum zu beschränken. mit einer UID und GID pro Kunde oder pro Kundendomain versuchen sie, Betriebssystem-Zugriffsrechte als Hilfsmittel zur Kundentrennung zu benutzen.

Eine Webapp-Policy, die das komplett ignoriert und Webanwendungen atomisiert, um ihre Trümmer dann einmal durch das Dateisystem zu zerstäuben hat so überhaupt nichts mit der Realität zu tun, daß man im ersten Augenblick nur sprachlos daneben stehen kann.

Okay, hier ist also einmal ein Katalog von Anforderungen:

- Policy muß chroot/virtual base directory jails unterstützen
- Policy muß UID pro Domain/GID pro Kunde oder ähnliche Setups unterstützen, die auf Apache suexec oder PHP safe_mode basieren
- Policy muß erlauben, daß die Anwendung mehr als einmal pro physikalischem Rechner installiert wird
- Policy muß erlauben, daß die Anwendung in mehr als einer Version pro physikalischem Rechner installier wird.
- Policy muß dem Kunden erlauben, seine Installation per ftp/scp/rsync zu sichern und zu modifizieren. Versionsmanagement muß erkennen, ob die modifizierte Anwendung danach noch automatisiert updatebar ist und ggf. einen Mergeprozeß unterstützen.
- Policy muß die Installation mehrerer unterschiedlicher Webanwendungen pro Vhost in unterschiedliche Directories unterhalb der DocRoot eines VHosts unterstützen

Die Policy muß also ein Framework liefern, mit dem man Vhosts schnell erzeugen kann, mit dem man in einem Vhosts Features wie modlogan, perl, python, php, chroot Jail und andere Eigenschaften enablen und disablen kann, und mit dem man pro VHost eine oder mehrere Anwendungen in unterschiedlichen Verzeichnissen installieren und möglicherweise sogar sicher aktualisieren kann. Dabei muß die Anwendung durch Kopie aus einem Shared Repository installiert werden können, durch Hardlink auf das Repository um Platz zu sparen oder sie muß, wenn die Anwendung das unterstützt, shared installs (PEAR, S9Y, ...) möglich machen.

All das ist natürlich mit dem FHS komplett inkompatibel. Aber kompatibel mit den Anforderungen des Webgeschäfts, das nun einmal mit dem FHS erst einmal genau gar nix zu tun hat.
