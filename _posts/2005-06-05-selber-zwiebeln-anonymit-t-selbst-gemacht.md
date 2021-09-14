---
layout: post
published: true
title: Selber Zwiebeln - Anonymität selbst gemacht
author-id: isotopp
date: 2005-06-05 19:36:03 UTC
tags:
- authentication
- identity
- security
- lang_de
feature-img: assets/img/background/rijksmuseum.jpg
---
Projekt 300 ist der Versuch, die 300 GB Quota pro Monat, die mit dem
kleinsten Strato Rootserver mitkommen, auszunutzen. Weil dies zu leicht ist,
sind die Nebenbedingungen "legal" und "sinnvoll". Mit http und Mail komme
ich bei der Maschine so auf 15-20 GB pro Monat. Also habe ich einen
Binary-freien Newsserver in Betrieb genommen und habe derzeit
NNTP-Verbindungen zu ca. 50 weiteren Maschinen. Auf diese Weise komme ich
auf Platz 170 der Weltrangliste der News-Server und ca. 30 weitere GB
Traffic im Monat. Es müsse also neue Projekte her, um die Maschine über die
50 GB-Schwelle zu heben.

So habe ich mich dafür entschieden, eine 
[tor-Node]({% link _posts/2005-06-02-die-welt-ist-meine-zwiebel.md %})
auf dem Rechner einzurichten und bandbreitenlimitiert mitlaufen zu lassen.

Die Installation von tor ist straightforward: Runterladen von 
[libevent](http://www.monkey.org/~provos/libevent/), 
[tor](http://tor.eff.org/download.html), 
[privoxy](http://sourceforge.net/project/showfiles.php?group_id=11118) und 
[tsocks](http://tsocks.sourceforge.net/download.php).

Die Installation von libevent und tor folgt dem üblichen Dreiklang von "sh
configure", "make" und "checkinstall". Für die Inbetriebnahme legt man am
Besten einen User "tor" an, etwa mit

```console
# useradd -u 520 -g 520 -c "Tor Anonymous Service" -d /var/lib/tor tor
# passwd -l tor
```


Mein tor sucht seine Konfiguration in `/usr/local/etc/tor/torrc`. Die
Konfigurationsdatei habe ich komplett neu geschrieben, statt das
mitgelieferte Sample zu verwenden, weil ich wissen wollte, welche Optionen
es überhaupt gibt.

Das Setup sieht so aus:

```console
###
### General Options
###

##
## Bei mir läuft tor als User tor in der Gruppe tor, und als dauernd
## laufender Dämon im chroot.
##
Group tor
User tor
RunAsDaemon 1

##
## Netzwerk Ressourcen
## Diese Anweisungen begrenzen die Dauerbandbreite auf
## ca. 50 KB/sec. Das sorgt dafür, daß die Karte nicht
## vollläuft und daß das Kontingent für den Tag nicht
## zu schnell aufgebraucht wird.
##
## Burst Bandwidth kann höher sein, das gibt dem ganzen
## Setup ein wenig Elastizität.
##
BandwidthRate 50 KB
BandwidthBurst 10 MB

## Statt ein monatliches Trafficlimit festzulegen, habe ich
## ein tägliches Limit definiert. Das sorgt dafür, daß die
## Node den ganzen Monat über nützlich ist und nicht am Anfang
## des Monats auf einmal alle Ressourcen weggelutscht werden
## können.
AccountingStart day 00:00
AccountingMax 2500 MB

## 900 Filedescriptioren für diese Node.
MaxConn 900

# Directory Server und Status
DirFetchPeriod 20 minutes
# DirServer address:port fingerprint
DirServer 18.244.0.188:9031 FFCB 46DB 1339 DA84 674C 70D7 CB58 6434 C437 0441
DirServer 18.244.0.114:80 719B E45D E224 B607 C537 07D0 E214 3E2D 423E 74CF
DirServer 62.116.124.106:9030 847B 1F85 0344 D787 6491 A548 92F9 0493 4E4E B85D
StatusFetchPeriod 15 minutes

##
## Dateien und Verzeichnisse
##

# Logging
SafeLogging 1
#Log debug file /var/log/tor/tor.log
#Log info file /var/log/tor/tor.log
Log notice file /var/log/tor/tor.log

# PID File
PIDFile /var/run/tor/tor.pid

# Verzeichnisse
DataDirectory /var/lib/tor

###
### Client Options
###

## Socks Server von außen erreichbar machen
SOCKSBindAddress 127.0.0.1:8001
SOCKSBindAddress 81.169.156.174:8001

# Wir reden mit: all of QSC, uns selbst
SOCKSPolicy accept 212.202.0.0/17
SOCKSPolicy accept 81.169.156.174/32
SOCKSPolicy accept 127.0.0.1/8
SOCKSPolicy reject *:*

# Unverified Nodes sind solche, die nicht im Directory bekannt sind
# entry|exit|middle|introduction|rendezvous
AllowUnverifiedNodes middle,rendezvous

###
### Server Options
###

# Port
ORPort 8000

# Admin-Info
ContactInfo 1024D/32E7CFC3 2005-02-11 Kristian Koehntopp <kris@koehntopp.de>
MyFamily koehntopp,strato
Nickname koehntopp

## Die Exit Policy legt fest, welche Dienste in welchen Ranges
## von diesem Server angesprochen werden. Wir machen aus Prinzip
## kein Mail (25), aber etwa ssh, imap, irc und natürlich web.
##
## Bekannte Filesharing Ports sind gesperrt.
# Exit-Policy (Was kann dieser Server ansprechen?)
ExitPolicy reject 169.254.0.0/16
ExitPolicy reject 127.0.0.0/8
ExitPolicy reject 192.168.0.0/16
ExitPolicy reject 10.0.0.0/8
ExitPolicy reject 172.16.0.0/12
ExitPolicy accept *:20-22
ExitPolicy accept *:53
ExitPolicy accept *:79-81
ExitPolicy accept *:110
ExitPolicy accept *:143
ExitPolicy accept *:443
ExitPolicy accept *:706
ExitPolicy accept *:873
ExitPolicy accept *:993
ExitPolicy accept *:995
ExitPolicy accept *:6660-6669
ExitPolicy accept *:8008
ExitPolicy accept *:8080
ExitPolicy accept *:8888
ExitPolicy reject *:*

###
### Directory Server
###

DirPort 8002

# Please coordinate with the other admins at tor-ops@freehaven.net
AuthoritativeDirectory 0
RunTesting 0

DirAllowPrivateAddresses 0

###
### Hidden Service Options
###

# not used
```

Jetzt kann ich auf meinem Rechner einen tsocks-Client konfigurieren, um
meinen Server anzusprechen. Danach kann ich etwa mit "tsocks irssi" dann
anonym ircen...

```console
# This is the configuration for libtsocks (transparent socks) for use
# with tor, which is providing a socks server on port 9050 by default.
#
# See tsocks.conf(5) and torify(1) manpages.

# server_type = 4
local = 81.169.156.174/255.255.255.255
server = 81.169.156.174
server_port = 8001
```
