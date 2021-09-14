---
layout: post
published: true
title: NAT ist kein Sicherheitsfeature
author-id: isotopp
date: 2010-11-28 14:59:23 UTC
tags:
- computer
- internet
- security
- lang_de
feature-img: assets/img/background/rijksmuseum.jpg
---
Neulich hatte ich wieder einmal die Standard-Diskussion mit jemandem, der
gegen IPV6 war, weil er dann ja kein NAT mehr habe. Dadurch, so die
Argumentation, würde er ja die Sicherheitsfunktionen verlieren - derzeit
verhindere sein Türstopper-Plastikrouter halt, daß man seine internen
Rechner von außen angreifen könne.

Diesen Zahn zu ziehen ist oft eine schmerzhafte Operation. Aber schon immer
galt: _NAT ist kein Sicherheits-Feature._ Ganz besonders nicht das NAT, das
auf einem Türstopper-Plastikrouter läuft.

NAT steht für Network Address Translation, und bezeichnet in der Regel das
Umschreiben von Original-IP-Nummern und Original-Portnummern auf
Ersatz-IP-Nummern und Ersatz-Portnummern 'im Flug', also während des
Routingvorgangs.

![](/uploads/network-nat-out.png)

Ausgehendes Paket erzeugt Eintrag in der NAT State Table.

Im Beispiel wird ein ausgehendes IP-Paket von einem Rechner im LAN
versendet. Der Rechner hat die IP-Nummer 192.168.1.4, und das Paket wird von
Port 33231 aus abgesendet. Es ist an einen Rechner 134.245.74.3 addressiert,
und ist vermutlich ein Webzugriff, da es dort an den Port 80 zugestellt
werden soll.

Die Nummer 192.168.1.4 ist eine Nummer aus einem sogenannten RFC-Netz
(gemeint ist [RFC 1918](http://tools.ietf.org/html/rfc1918), der IP-Nummern
für die Verwendung in privaten Netzwerken definiert). Sie kann draußen, im
'richtigen Internet' nicht verwendet werden und muß durch NAT ersetzt
werden, damit der Rechner im privaten Netz überhaupt auf das Netz zugreifen
kann.

Der Router, der die Verbindung in das Internet aufrecht erhält, hat nur eine
einzige externe IP-Nummer, da
[IP V4 Adressen knapp sind](http://www.potaroo.net/tools/ipv4/index.html).
Er wandelt die Absender-Adresse 192.168.1.4 in seine eigene Adresse um - und
setzt im Beispiel 198.32.16.8 ein. Er überschreibt auch die Portnummer 33231
mit einer Portnummer, die bei ihm frei ist, im Beispiel also 2001.

Dann sendet er das modifizierte Paket ins Internet.

![](/uploads/network-nat-in.png)

Durch den Eintrag in der State Table wird jedes auf Port 2001 eingehende
Paket an den internen Host weiter geleitet.

So weit so gut. Der Router muß aber auch mit einem Antwortpaket fertig
werden und dies an den internen Rechner zustellen können. Er legt sich also
eine Tabelle an, in der er vermerkt: "Eintreffende Pakete auf Port 2001 an
192.168.1.4:33231 zurück leiten". Durch diese NAT State Table kann er für
ein auf Port 2001 eintreffendes Paket die Rückumwandlung vornehmen.

Dies ist die einfachste Mögliche NAT-Implementierung (ein 
[Full Cone NAT](http://en.wikipedia.org/wiki/Network_address_translation#Types_of_NAT) nach 
[RFC 3489](http://tools.ietf.org/html/rfc3489)) - und die, die am wenigsten
Speicher verbraucht, denn diese Variante verbraucht pro aktiver "Verbindung"
am wenigsten Speicher, und Speicher ist auf einem Plastik-Türstopper nun
einmal begrenzt.

Und selbst dann kann diese interne Tabelle so groß machen, daß der Speicher
des Türstoppers einfach überläuft und er sich spontan resettet, etwa wenn
das innere Netz eine WG ist, auf der 3 oder 4 Leute gleichzeitig
P2P-Programme laufen lassen, von denen jedes pro Download an die 200
Einträge in der NAT State Table belegt.

Leider ist diese NAT-Implementierung so einfach, daß bei auf Port 2001
eintreffenden Paketen keine Information darüber vorliegt, von wo diese
eintreffen dürfen. Jedes beliebige Paket von Port 2001 wird also nach innen
weitergeleitet - das solche, die von irgendwelchen anderen IP-Nummern außen
aus dem Internet abgesendet werden.

Bessere Sicherheit bietet ein volles Verbindungstracking, das ein richtiges
symmetrisches NAT zur Verfügung stellt, und das insbesondere auch TCP
versteht und das Ende einer Verbindung erkennt, um in diesem Fall den
Eintrag in der NAT State Table zeitgerecht wieder abzuräumen. 

Wenn man diese Logik aber erst einmal implementiert hat, dann kann man auch
gleich eine vollständige Firewall mit Connection Tracking implementieren
(oder kostenlos dazu bekommen, weil man in diesem Fall wahrscheinlich
sowieso ein embedded Linux auf dem Router am Laufen hat), und dann kommt die
Sicherheit nicht vom NAT, sondern von der Firewall.

Wer also sein Netzwerk schützen will, der sollte nicht NAT verwenden,
sondern sich eine gescheite Firewall installieren und dann sinnvoll
konfigurieren. Machen andere Läden mit
[erhöhten Sicherheitsanforderungen](http://www.heise.de/newsticker/meldung/Bundeswehr-verzichtet-auf-NAT-1138736.html)
auch genau so.
