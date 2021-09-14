---
layout: post
published: true
title: X11 auf dem Weg nach draußen
author-id: isotopp
date: 2011-05-10 13:15:38 UTC
tags:
- computer
- linux
- wayland
- lang_de
feature-img: assets/img/background/rijksmuseum.jpg
---
Im September 1987 wurde die Version 11 des X-Protokolls erfunden. Damals war
alles schlimm: Wir hatten keinen Speicher, keine leistungsfähigen CPUs,
keine Fonts, schon gar keine Vektorfonts, keine Farbe, schon gar keine
Echtfarbe ohne Paletten, keine Transparency und vor allen Dingen keine
Ahnung.

X11 war für Unix das Displaysystem der Wahl. Es macht eine ganze Menge Dinge
falsch: Zum Beispiel lebt es unter der Annahme, daß das Grafiksubsystem des
Rechners keine Rechenpower und wenig Speicher hat. So definiert es dann auch
einen Haufen Zeichenprimitive, die kilometerweit unter den Bedürfnissen
eines Fenstersystems liegen und läßt den Windowmanager auf der anderen Seite
des Netzwerkes als X11-Anwendung laufen. Es hat per Default Double Buffering
abgeschaltet und zeichnet per Default auch auf dem sichtbaren Screen statt
auf einem Offscreen-Puffer, der dann eingeblittet oder besser noch
eingeblendet wird. Von 3D und OpenGL hat es so gar keine Ahnung. Was heute,
in 2011, auf dem Bildschirm herum malt ist nur der Form halber noch X11, in
Wirklichkeit sind es aber meistenteils in X11-Extension verpackte
Spezialcalls, die mit X11 fast nichts mehr zu tun haben.

Und es ist langsam. Wenn wir einen modernen Bildschirm mit X11 über das
Netzwerk raus sharen, dann stirbt X11 den Latenztod - formal ist X11
netzwerktransparent, aber in Wirklichkeit ist nichts an dem Protokoll
besonders geeignet oder schlau, wenn es darum geht, Daten über das Netzwerk
zu schaufeln. Andere Protokolle sind inzwischen weitaus besser geeignet,
Bildschirme über Netz zu exportieren: Selbst das halbtote VNC ist in der
Regel schneller und besser als X11, RDP und NX sind sogar richtig gut da
drin.

In diesem Sinne:
[XFree86](http://www.pro-linux.de/news/1/17018/xfree86-der-lebende-tote.html)
hat keine Comitter mehr. Der X.org Fork hat das Projekt vor Jahren abgelöst
und so die Firmen, die versucht haben, das X-Consortium zu Tode zu
kontrollieren, entmachtet. Aber auch X.org verliert an Bedeutung:
[Wayland](http://www.golem.de/1105/83334.html) ersetzt es gerade. Was gut
ist, weil dann ein Haufen alter Scheiß rausfliegt und man dann auch für den
häufigen Fall - lokales Display mit Hardware Acceleration - optimieren kann.

**Nachtrag:** Um den Kommentatoren unter diesem Artikel einmal ein wenig
weiter zu helfen, hier ein paar Dinge zum Nachlesen.

- [Wayland Architecture Overview](http://wayland.freedesktop.org/architecture.html) - 
  das erklärt die Anordnung der Dinge, wie sie vor Wayland gelaufen sind und
  wie sie Wayland realisiert.

- Moderne Desktops in Linux verwenden einen Compositor wie
  [Compiz](http://en.wikipedia.org/wiki/Compiz).

- Moderne Grafikhardware hat 3D Beschleuniger. Ein 3D-Beschleuniger
  verwendet eine Tile (Kachel), um damit die Kanten von dreidimensionalen
  Objekten zu bemalen. Die Hardware projeziert, skaliert und verformt dabei
  die Tile so, daß sie auf die Seite des 3D-Objektes abgebildet wird. Wenn
  das dreidimensionale Objekt eine rechteckige Leinwand ist, die nicht
  skaliert und verformt ist, dann wird die Kachel per Hardware 1:1 auf der
  Leinwand abgebildet und man hat einen Bildschirm, dessen Fenster-Rechtecke
  per Hardware mit den Inhalten verschiedener unabhängiger Grafikpuffer
  gefüllt wird. Diese Puffer zu verwalten und mit Effekten zu dekorieren ist
  die Aufgabe eines Compositors. X11 weiß nichts von Compositors, die
  X11-Erweiterung für Compositors schleust bloß Bitmaps sinnlos durch den
  X11-Server. _Da_ kommt Latenz her.

- Der erste Ansatz um Compositors unter X11 zum Laufen zu bringen war
  [Xgl](http://en.wikipedia.org/wiki/Xgl). Xgl ist die Scheißidee, einen
  X-Server unter einem X-Server laufen zu lassen. Dabei steuert der äußere
  X-Server die Grafikhardware, der innere dann das Zeichnen mit X (das
  sowieso niemand mehr verwendet).

- Moderne X-Server verwenden [AIGLX](http://en.wikipedia.org/wiki/AIGLX).
  Das ist eine Methode, bei der man essentiell dem X-Server sagt: "Okay, Du
  kannst da jetzt rumstehen und nix tun, aber dieses Rechteck da zeichnet
  jetzt jemand anders als Du, nämlich OpenGL.". Wayland komplettiert diesen
  Schritt nur, indem es den Default richtig rum setzt: Es räumt den
  X-Server, der sowieso nicht mehr verwendet wird, aus dem Weg.

- Qt und GTK haben Wayland-Support. Beide Toolkits malen schon seit längeren
  fertige Tiles - X-Primitives verwendet schon lange niemand mehr, weil sie
  zu scheiße aussehen und auch nicht portabel auf Windows-, Mac- oder
  Handy-Hardware sind. Die Tiles werden dann entweder mit X11 oder eben
  direkt in Wayland zum Compositor geshipped, der daraus einen Bildschirm
  mit Fenstern macht. Qt kann sogar zur Laufzeit den Shipping Mechanismus
  zwischen X11 und Wayland umschalten.

Die Executive Summary ist: X11 ist schon länger tot. Es ist durch Extensions
zu einem recht ineffizienten Durchreich-Mechanismus für Tiles (Pixmaps)
geworden. Es kontrolliert auch nicht mehr die Hardware - einer
Usermode-Anwendung root-Rechte zu geben, damit sie in Grafikkarten-Register
poken kann ist sowieso galoppierender Unsinn gewesen und 
[Kernel Mode Setting](http://en.wikipedia.org/wiki/Mode-setting#Linux) hat das zum Glück
überflüssig gemacht.

Wayland streut nun die Blumen auf das Grab und schaufelt endlich die Erde
drauf. Es ruhe in Frieden.
