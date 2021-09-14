---
layout: post
published: true
title: Was ist eigentlich Firewire DMA?
author-id: isotopp
date: 2011-07-27 15:32:03 UTC
tags:
- hack
- hardware
- security
- lang_de
feature-img: assets/img/background/rijksmuseum.jpg
---

Der Spiegel entdeckt: 
[Verräterische Firewire-Verbindung: Kauf-Software knackt Mac-Passwörter](http://www.spiegel.de/netzwelt/gadgets/0,1518,776971,00.html).
In dem Artikel geht es um die Entdeckung, daß Firewire ein Busprotokoll ist,
das DMA erlaubt.

DMA ist ein Kürzel, das für 
[Direct Memory Access](http://en.wikipedia.org/wiki/Direct_memory_access) 
steht. Normalerweise ist Computerperipherie über die CPU an den Rechner
angebunden: Wenn eine Eingabe oder eine Ausgabe zu machen ist, dann
schaufelt einer der Kerne des Rechners ein Byte aus einem speziellen
I/O-Register oder einer magischen Speicheradresse, die statt mit einem
RAM-Baustein mit einem I/O-Baustein verbunden ist, in die CPU und von der
CPU dann an die Zieladresse - die wiederum entweder eine normale
Speicheradresse oder wiederum eine magische Ein-/Ausgabeleitung ist.

Moderne CPUs haben eine Einbaukomponente, die 
[Memory Management Unit](http://en.wikipedia.org/wiki/Memory_Management_Unit). 
Das war früher mal ein extra Baustein, ist aber vor 20 Jahren oder so mit in
die CPU integriert worden. Die MMU hat die Aufgabe, die Speicher- und
I/O-Zugriffe eines jeden Prozesses zu kontrollieren und zu verhindern, daß
ein Benutzerprozeß auf privilegierten Speicher zugreift oder auf Speicher
anderer Prozesse. Die MMU implementiert also die Sicherheit in modernen
Betriebssystemen.

![](/uploads/io-mit-cpu.png)

Jeder Speicher- und I/O-Zugriff wird von der MMU überwacht.

Wie man sich aus der Beschreibung von DMA leicht überlegen kann, umgeht DMA
die MMU komplett: Das I/O-Gerät wird nicht von der CPU abgefragt, sondern es
meldet sich auf denselben Adreßleitungen (dem "Bus"), auf dem auch die CPU
liegt an und greift dann selber wie eine zweite CPU auf diesen Bus und alle
darauf liegenden Geräte zu - also auch auf allen Speicher. Da es selber wie
eine CPU agiert, umgeht es die eigentliche CPU des Systems und damit auch
die darin liegende MMU.

Firewire ist ein Bus, der DMA-Geräte erlaubt. Darum ist er lange Zeit
schneller als USB gewesen und Firewire-Geräte haben außerdem das System
weniger ausgebremst als USB-Geräte: Die Firewire-Devices mußten sich halt
nicht von der CPU byteweise die Daten füttern lassen, sondern haben
stattdessen parallel zur CPU ihre Daten ins System gebulldozert.

Wenn man also am Firewire-Port von Rechner a keine normale Festplatte
anschließt, sondern etwa einen zweiten Rechner b, dann kann dessen CPU ein
beliebiges Programm auf Rechner b ausführen, das auf beliebige Bytes von
Rechner a lesend oder schreibend zugreift.

![](/uploads/io-mit-dma.png)

DMA ist ein Mechanismus, der anderen Geräten an CPU und MMU vorbei
Speicherzugriff erlaubt. Dadurch sind alle Speicherinhalte dem externen
Gerät ungeschützt zugänglich.

Ist das überraschend? Nein.

Ist das neu? Nein. Software dafür ist seit 2003 als Open Source zu bekommen.

Ist die Empfehlung aus dem Spiegel-Artikel sinnvoll?

> Allerdings, merkt Passware selbst an, kann man dem Passwortklau mit zwei
> simplen Maßnahmen einen Riegel vorschieben. Zum einen sollte man die
> Funktion "Automatische Anmeldung" im "Kontrollfeld Benutzer & Gruppen"
> deaktivieren. Zum anderen sollte man den Computer in Pausen komplett
> abschalten, statt ihn nur in den Ruhezustand zu versetzen. Dann haben auch
> gut ausgerüstete Passwortdiebe keine Chance mehr.

Geht so. Zwar ist es sinnvoll, die automatische Anmeldung zu deaktivieren,
um die Systemsicherheit zu erhöhen (alternativ den Bildschirmschoner mit
einem Paßwort zu versehen) und auch den Rechner abzuschalten statt suspend
zu verwenden. 

Aber solange der Rechner läuft ist nicht der Klau des Paßwortes die
eigentliche Gefahr. Sondern die Tatsache, daß einem ein wildgewordenen
Firewire Device, das man anschließt, jedes beliebige Byte auslesen oder
übermalen kann. Mit Paßworten muß sich da keiner aufhalten, wenn man das
ganze System ersetzen oder verändern kann.

Siehe auch [hier](http://blog.fefe.de/?ts=b32cb04e) für andere Zugriffe mit DMA.
