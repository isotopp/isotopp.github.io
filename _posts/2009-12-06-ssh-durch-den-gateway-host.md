---
layout: post
published: true
title: ssh durch den Gateway Host
author-id: isotopp
date: 2009-12-06 12:20:51 UTC
tags:
- lang_de
feature-img: assets/img/background/rijksmuseum.jpg
---
Ich sitze hier daheim beim PHPlätzchenbacken und Kore fragt mich eben: "Sage
einmal, ich habe daheim so einen Router, der NAT macht und den ich als
Sprunghost verwende, und dahinter meinen Desktop-Rechner. Kann ich
eigentlich Dateien von daheim von meinem Desktop auf mein Netbook kopieren,
ohne daß ich die auf dem Router als Zwischenkopie ablegen muß?"

Es geht sogar besser als das, und dafür braucht man eine
$HOME/.ssh/config-Datei auf seinem Netbook und eine Kopie von 'netcat' oder
'nc' auf dem Router. Das ist bei Kore mit dem Busybox-Netcat auch der Fall.

So geht's:

```console
ServerAliveInterval 10
ServerAliveCountMax 3
Compression yes
HashKnownHosts no
TCPKeepAlive yes

ControlMaster auto
ControlPath ~/.ssh/ssh_control_%h_%p_%r

Host router
    Hostname name.homeunix.org
    User name
    Port 4444

Host desktop
    Hostname 192.168.1.2
    User name
    Port 22
    ProxyCommand ssh router nc -w30 %h %p
    LocalForward 6667 127.0.0.1:6667
    LocalForward 1993 127.0.0.1:993
    LocalForward 1587 127.0.0.1:587
    LocalForward 1999 news.mein-freund.de:119
    DynamicForward 1080

Host *
    ForwardAgent yes
```

Der Router ist dabei ein wenig langsam und es ist sehr mühsam, die erste
dieser Verbindungen aufzubauen. Sobald die Verbindung aber steht, ist sie
normal schnell. Der ControlMaster sorgt dafür, daß überhaupt nur eine
ssh-Verbindung per Host aufgebaut wird. ssh tunnelt dann die anderen
ssh-Verbindungen zum selben Host wegen des ControlMaster per Multiplexer
durch die eine bestehende Verbindung. Das ist in diesem Fall nett, weil es
schnell ist.

In meinem eigenen Anwendungsfall ist sogar noch ein RSA Security Dreckstoken
involviert und ich habe keine Lust für jedes ssh oder scp jedesmal einen RSA
Security Dreckscode abzutippen. Durch den ControlMaster brauche ich mich nur
einmal pro Tag morgens einzuloggen und multiplexe dann alle meine
Verbindungen durch die eine bestehende Verbindung in die Firma.

Dabei helfen mir die verschiedenen KeepAlive- und
AliveInterval-Einstellungen die bestehende Verbindungen gegen alle
Timeout-Versuche der Firmenkonfiguration am Leben zu halten, auch dann, wenn
ich die Leitung mal ein wenig vor sich hin idlen lasse.

Der Eintrag router ist dabei ein Kurzname (eine ssh Bookmark), die intern
auf einen tatsächlichen Hostnamen, einen Usernamen und einen Port expandiert
wird. Ein 'ssh router' wird also zu einem 'ssh -P4444
name@name.homeunix.org' umgeschrieben.

Der Eintrag desktop wird genau so expandiert. Der Trick ist dabei jedoch das
ProxyCommand. Ein 'ssh desktop' wird also in Wahrheit zu einem 'ssh router
$kommando' expandiert, das von der ssh wegen des Eintrages darüber jedoch zu
einem 'ssh -P4444 name@name.homeunix.org $kommando' erweitert wird.

Dabei ist das Kommando 'nc -w30 desktop 22', also ein transparenter Tunnel
von router zu desktop auf Port 22.

Das Kommando 'ssh desktop' baut also eine Verbindung vom Netbook (wo immer
das gerade ist) zum router auf und von dort automatisch weiter zum Desktop.
Das funktioniert so gut, daß man nicht nur auf dem Laptop 'ssh desktop'
tippen kann und dann daheim ist, sondern daß man sogar 'scp
desktop:/etc/my.cnf Desktop/' auf dem Netbook tippen kann und die Datei wird
durch den Router hindurch von daheim geholt und auf dem lokalen Desktop
abgelegt.

Als KDE-Anwender kann man sogar im Editor auf dem Netbook einfach
'fish://desktop/etc/my.cnf' zu bearbeiten öffnen, die Datei bearbeiten und
dann einfach mit Control-S auf dem Desktop daheim abspeichern.

Man kann noch mehr tun: 

Die LocalForward-Anweisungen bauen weitere Tunnel auf. Der Port 6667 auf dem
Netbook verbindet einen also mit dem Irc-Bouncer auf dem Desktop-Rechner,
die Ports 127.0.0.1:1993 und 127.0.0.1:1587 auf dem Netbook verbinden einen
mit den imaps- und
[submission]({% link _posts/2004-10-29-submission-port-587.md %})-Ports
des Desktop-Rechners und der Port 1999 des Netbook gibt nun eine Verbindung
zum NNTP-Server von news.mein-freund.de. Dabei sieht es für
news.mein-freund.de so aus, als käme die Verbindung vom Desktop-Rechner und
nicht vom Netbook und die Datenübertragung vom Netbook zum Desktop ist
natürlich ssh-verschlüsselt.

Der DynamicForward 1080 bewirkt, daß die ssh auf dem Netbook ein
SOCKS5-Proxy ist. Stellt man in seinem Firefox in den Proxy-Einstellungen
einen SOCKS5-Proxy auf 127.0.0.1:1080 ein, dann reicht Firefox als URLs über
ssh an den Desktop-Rechner weiter, der dann an Stelle des Netbook die Daten
beschafft und an den Firefox weiter gibt. Mein gibt also - egal wo man ist -
keine URLs an einen Firmenproxy weiter, sondern greift, egal wo man ist,
durch sein heimisches Desktop-DSL auf das Web zu.

Im Zusammenhang mit einem Dedi irgendwo und einem 
[passenden openvpn-Server]({% link _posts/2009-08-10-einen-openvpn-server-aufsetzen.md %})
sollte man außerdem aus jedem Firmennetz eine Verbindung nach draußen
bekommen und sich so in jedem Fall freischwimmen können, egal wie restriktiv
das Firmennetz konfiguriert ist.

**Update:** oliof schlägt vor, noch ein 'Compression yes' an geeigneter
Stelle einzustreuen.
