---
layout: post
published: true
title: Einen  openvpn Server aufsetzen
author-id: isotopp
date: 2009-08-10 07:59:34 UTC
tags:
- openvpn
- lang_de
feature-img: assets/img/background/rijksmuseum.jpg
---
openvpn ist ein bequem aufzusetzender VPN-Server, der mit einer
einfachen TCP-Verbindung angesprochen werden kann. Da kein
gesonderter IP-Pakettyp verwendet wird, funktioniert openvpn
sehr einfach auch mit dummen Routern oder in eingeschränkt
konnektierten Netzwerken.

Insbesondere kann der openvpn-Server auch etwa auf Port 443
laufen. Daher ist openvpn sehr bequem, wenn man hinter einem
Proxy-Server eines Netzwerkes sitzt, der ausgehende
https-Verbindungen nur auf https-Ports zuläßt, wie es etwa in
vielen Firmen der Fall ist.

Mit einem openvpn-Server, der auf Port 443 lauscht, kommt man
aus den meisten dieser Netze bequem heraus und kann alle seine
Zugriffe dann über die VPN-Verbindung tunneln. Der Proxy sieht
nur eine normale CONNECT-Anweisung auf einen https-Port, danach
ist alles verschlüsselt. Der Verbindung ist also nicht
anzusehen, daß es sich nicht um eine https-Verbindung handelt -
um das zu erkennen müßte der Proxy schon umschlüsseln, dann wäre
die Verbindung aber wegen des durch den Proxy gefälschten
Zertifikates aus unsicher zu erkennen.

Das Kommanzeilenprogramm openvpn ist sowohl Server als auch
Client. Auf dem Server wird es so gestartet:

```console
/usr/sbin/openvpn \
  --daemon \
  --writepid /var/run/openvpn/openvpn.pid \
  --config /etc/openvpn/openvpn.conf \
  --cd /etc/openvpn
```

Die Konfiguration ist kurz und schmerzlos: 

```console
h743107:~ # cat /etc/openvpn/openvpn.conf
daemon openvpn-server.koehntopp
dev tun
local {SERVERIP}
port 443
proto tcp

user nobody
group nobody

cd /etc/openvpn
ca keys/ca.crt
cert keys/server.crt
key keys/server.key
dh keys/dh1024.pem

server 192.168.168.0 255.255.255.0
ifconfig-pool-persist ipp.txt

comp-lzo
persist-key
persist-tun
status openvpn-status.log
verb 3

keepalive 10 60

# client config dir
client-config-dir client-config-dir
```


Dies erzeugt einen Server, der auf Port 443 an der an Stelle von
{SERVERIP} eingesetzten IP lauscht. Der Server läßt Verbindungen
von Clients zu, die ein Zertifikat haben, das mit ca.crt
signiert ist -
[Zertifikate erzeugen](http://www.openvpn.net/index.php/open-source/documentation/howto.html#pki).

Der Client bekommt eine IP aus dem im server-Statement genannten
Pool zugeteilt, und die IP ist persistent. Wir verwenden
komprimierte Verbindungen und versuchen den Tunnel auch über
Server-Restarts (persist-tun) zu halten, ditto für den Key. Der
Server schreibt ein openvpn-status.log auf dem Verbosity-Level
3. Wir pingen unsere Verbindung alle 10 Sekunden und starten sie
nach 60 Sekunden fehlenden Pings neu (viele https-Proxies
trennen die Verbindungen sehr aggressiv, also halten wir sie so
beschäftgt). Im client-config-dir könnten wir noch weitere
Client-spezifische Konfigurationen unterbringen.

Auf demselben Rechner starte ich auch einen Squid, den ich auf
127.0.0.1:3128 binde und dem ich Zugriffe aus dem
192.168.168.0/24 erlaube. Dadurch kann ich all meinen privaten
Webtraffic durch meinen Proxy schicken, statt meine URLs an den
anderen Proxy auszuliefern, bei dem ich nicht weiß, was die
Betreiber mit den Logs oder meinen Daten machen.

Auf dem Client (bei mir ein Mac) verwende ich Tunnelblick als
openvpn-Starter und habe in $HOME/Library/openvpn eine
openvpn.conf hinterlegt:

```console
client
dev tun
proto tcp
remote {SERVERIP} 443
resolv-retry infinite
nobind

user nobody
group nobody

persist-key
persist-tun

ca ca.crt
cert client.crt
key client.key

comp-lzo

verb 3

keepalive 1 5

; firmenproxy
http-proxy {COMPANY_PROXY} 3128
http-proxy-retry
```

Hier ist dieselbe {SERVERIP} einzutragen wie bei der
Server-Konfiguration. Wenn die Verbindung durch einen Web-Proxy
getunnelt werden muß, muß man die beiden http-proxy Kommandos am
Ende der Datei anpassen, zum Testen daheim kann man sie
weglassen. Der Rest der Konfiguration entspricht der
Server-Config, nur die Keepalives habe ich für mich noch
aggressiver setzen müssen.

