---
layout: post
published: true
title: Mein natives IP V6
author-id: isotopp
date: 2009-02-10 11:49:23 UTC
tags:
- internet
- ipv6
- lang_de
feature-img: assets/img/background/rijksmuseum.jpg
---
Mein dedizierter Server in Berlin hat seit Ende Januar IP V6 nativ. Als
Testkunde habe ich die Connectivity vor dem Rollout bekommen - eine IP V6
Adresse als Primäradresse und ein /56 Netz zum Spielen und durch die Gegend
routen.

Der Dedi läuft recht schmerzfrei auf der mitgelieferten SuSE 10.2, und das
Setup war sehr leicht. Stellt man in 'yast network' bei 'Besondere
Einstellungen' 'Erweitert' das IP V6 an, erledigt SuSEs Systemadministration
alle notwendigen Dependencies alleine. Insbesondere wird das ipv6.ko
Kernelmodul geladen, aber auch alle notwendigen iptables-Module, die für
eine stateless V6 Firewall notwendig sind. ip_conntrack unterstützt in 10.2
noch kein V6, leider.

Die notwendigen Konfigurationen habe ich dann jedoch zu Fuß in
/etc/sysconfig/network erledigt.

```console
h743107:/etc/sysconfig/network # cat ifroute-lo
127/8
2A01:238:40AB:CD00::/56
```

Die erdet mein /56, sodaß der Provider-Router und mein Dedi nicht mit den
Paketen pingpong spielen. Für einzelne genutzte Adressen lege ich dann
Hostrouten, um das zu aktivieren.

```console
h743107:/etc/sysconfig/network # cat ifcfg-eth0
...
NETMASK=''
NETWORK=''
IPADDR_1='85.214.44.126'
NETMASK_1='255.255.255.255'
BROADCAST_1='85.214.44.126'
LABEL_1='1'
IPADDR_2='2A01:238:4000:0:0123:4567:89AB:CDEF'
IPADDR_3='2A01:238:40AB:CD00::1'
```
 Dies setzt die primäre V6-Adresse und die eine weitere V6-Adresse, die ich bisher nutze als aktiv. Der Rest des /56 ist weiter geerdet, nur diese eine Adresse ...::1 ist aktiv. Nun muß noch die Routingtabelle entsprechend gesetzt werden: 
```console
h743107:/etc/sysconfig/network # cat ifroute-eth0
2A01:238:40AB:CD00::1 fe80::1
default fe80::1
```

Auch durch /etc/sysconfig/SuSEfirewall2 muß man einmal durchtoben und die
entsprechenden V6-Optionen dort setzen, damit die Pakete nicht weggeworfen
werden.

Mit einem ping6 kann man nun schon Connectivity testen. 

```console
 h743107:/etc/sysconfig/network # ping6 -c 3 2001:4c40:1::6667
PING 2001:4c40:1::6667(2001:4c40:1::6667) 56 data bytes
64 bytes from 2001:4c40:1::6667: icmp_seq=1 ttl=57 time=31.5 ms
64 bytes from 2001:4c40:1::6667: icmp_seq=2 ttl=57 time=31.6 ms
64 bytes from 2001:4c40:1::6667: icmp_seq=3 ttl=57 time=31.5 ms

--- 2001:4c40:1::6667 ping statistics ---
3 packets transmitted, 3 received, 0% packet loss, time 2008ms
rtt min/avg/max/mdev = 31.518/31.568/31.654/0.061 ms
```

Auch ein traceroute6 dort hin kann sehr aufschlußreich sein.

### ssh

ssh sollte sofort und ohne weitere Konfiguration mit V6 funktionieren. Die
/etc/ssh/sshd_config kennt

```console
AddressFamily
Specifies which address family should be used by sshd(8).  Valid arguments are “any”, “inet” (use IPv4 only), 
or “inet6” (use IPv6 only).  The default is “any”.

ListenAddress
Specifies the local addresses sshd(8) should listen on.  The following forms may be used:

  ListenAddress host|IPv4_addr|IPv6_addr
  ListenAddress host|IPv4_addr:port
  ListenAddress [host|IPv6_addr]:port

If port is not specified, sshd will listen on the address and all prior Port options specified.
The default is to listen on all local addresses.  Multiple ListenAddress options are permitted.
Additionally, any Port options must precede this option for nonport qualified addresses.
```

Da insbesondere der Default 'any' ist, sollte keine Konfiguration notwendig
sein. Wer ein Setup mit ListenAddress fährt, muß kurz die Config anpassen,
ebenso jemand der PermitOpen verwendet um Security-Regeln zu implementieren.

### exim

Alle Änderungen, die ich am Exim gemacht habe sind:
- `disable_ipv6` aus der Konfirguration entfernt und
- `local_interfaces` um die gewünschten Adressen erweitert.
  Literale Adressen müssen dabei in eckigen Klammern stehen.

Der entsprechende Abschnitt in der Konfiguration sieht also wie folgt aus:

```console
#disable_ipv6
local_interfaces = <; [85.214.35.184]:25; [85.214.35.184]:587; 
    [127.0.0.1]:25; [127.0.0.1]:587;  
    [2a01:238:4000:0:123:4567:89ab:cdef]:25; [2a01:238:4000:0:123:4567:89ab:cdef]:587;
    [2a01:238:40ab:cd00::1]:25; [2a01:238:40ab:cd00::1]:587
```

### httpd

Der Apache, den ich fahre, lauscht nun ebenfalls für seine virtuellen Hosts
aus V6-Adressen. Dazu habe ich meinen Konfigurationsgenerator wie folgt
definiert:

```console
Listen SERVERIP:80
Listen [2a01:0238:4000:0000:0123:4567:89ab:cdef]:80
Listen [2a01:0238:4000:0000:0123:4567:89ab:cdef]:443

NameVirtualHost *
```

Die Kombination von Listen-Anweisungen und `NameVirtualHost *` sorgt dafür,
daß alle name based virtual Hosts auf allen diesen Interfaces zu bekommen
sind. Für den 443-Port ist das natürlich sinnlos. Ich werde stattdessen also
für V6 ein anderes System brauchen, das named-Setup und Apache-Setup
miteinander verheiratet und in V6 grundsätzlich IP-basierende Virtual Hosts
verwendet, diese dann aber grundsätzlich auf Port 443 verfügbar macht. Ob
ich überhaupt noch unverschlüsseltes http auf V6 anbieten werde weiß ich
nicht - die politische Situation legt nahe, daß dies Unsinn ist.

### dovecot

Dovecot kann derzeit nur auf einem oder allen Interface lauschen. Ich muß
also meine alte IP-basierte `listen`-Anweisung löschen und ein
globales Listen einsetzen:

```console
#listen = 85.214.35.184
listen = [::]
```

Ein * hätte alle V4-Interfaces aktiviert, ein [::] aktiviert V4 und V6.

### irssi

Um mit V6 im Ircnet ircen zu können, muß man sich mit einem Webbrowser gegen
[einen V6-only Webserver](http://irc.irc6.net) connecten und dort
freischalten lassen. Dann kann man definieren:

```console
servers = (
  {
    address = "irc.irc6.net";
    chatnet = "ircnet";
    port = "6667";
    use_ssl = "no";
    ssl_verify = "no";
    autoconnect = "yes";
  }
);
```

und von dort aus weiterarbeiten. Für Freenode ist es 

```console
servers = (
  {
    address = "ipv6.chat.freenode.net";
    chatnet = "freenode";
    port = "6667";
    use_ssl = "no";
    ssl_verify = "no";
    autoconnect = "yes";
  }
);
```

Undernet kann noch kein V6.

### named

Bind 9 kann V6. Das reverse Lookup für die primäre IP liefert der Provider. Für das /56 habe ich eine Delegation und einen Secondary, muß die Zone also selber fahren.

Vorwärts-Einträge: 

```console
irc                     1D IN AAAA      2A01:0238:40AB:CD00:0000:0000:0000:0001
irc                     1D IN MX        100 smtp.koehntopp.de.

smtp                    1D IN AAAA      2A01:0238:40AB:CD00:0000:0000:0000:0001
smtp                    1D IN A         85.214.35.184
smtp                    1D IN MX        100 smtp.koehntopp.de.
```

Und die reverse Zone: 

```console
h743107:/var/lib/named/master # less /etc/named.conf
...
options {
        listen-on-v6 port 53 {
                2a01:238:4000:0:123:4567:89ab:cdef/128;
        };
        query-source-v6 address 2a01:238:4000:0:123:4567:89ab:cdef;
        transfer-source-v6 2a01:238:4000:0:123:4567:89ab:cdef;
        notify-source-v6 2a01:238:4000:0:123:4567:89ab:cdef;
        allow-transfer {
        ...
                        2001:608:a:0:219:dbff:fe4c:93a0;
        };
};

...
zone "d.c.b.a.0.4.8.3.2.0.1.0.a.2.ip6.arpa" in {
        type master;
        file "master/d.c.b.a.0.4.8.3.2.0.1.0.a.2.ip6.arpa.zone";
};
```

Dann muß noch die Zone erzeugt werden. Dies geschieht wie üblich und ist nur ein Haufen Tipperei.

```console
h743107:/var/lib/named/master # ls -l *ip6*
-rw-r--r-- 1 root root 347 Feb  3 10:03 d.c.b.a.0.4.8.3.2.0.1.0.a.2.ip6.arpa.zone
h743107:/var/lib/named/master # cat !$
cat *ip6*

@       1D IN SOA       ns1.koehntopp.de. hostmaster.koehntopp.de.  (
        2009020301      ; serial
        1D              ; refresh
        2H              ; retry
        1W              ; expiry
        1D )            ; minimum

        1D IN NS        luggage.rince.de.
        1D IN NS        ns1.koehntopp.de.

1.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0     1D IN PTR irc.koehntopp.de.
```

