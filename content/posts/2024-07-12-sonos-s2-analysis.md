---
author: isotopp
date: "2024-07-12T05:06:07Z"
feature-img: assets/img/background/rijksmuseum.jpg
tags:
- lang_de
- media
- sonos
title: "Sonos S2 Analysis"
---

Auf LinkedIn gibt es einen
[Artikel von Andrew Pennell](https://www.linkedin.com/pulse/what-happened-sonos-app-technical-analysis-andy-pennell-wigwc/)
zum Thema " What happened to the Sonos app? A technical analysis."

# Die neue App

Am 7. Mai dieses Jahres hat Sonos die S2 App grundlegend umgestellt.
Dazu gehörte jedoch nicht nur eine neue UI, sondern auch die interne Kommunikation wurde umgestellt –
auf andere Protokolle und auf andere Datenflüsse.

Der Launch der neuen App war ein ziemlicher Fehlschlag.
Die App war Mobile only, hat wichtige Features der alten App nicht implementiert und war bei vielen Usern langsam und unzuverlässig.

Die alte App, so Pennell, hat intern UPNP verwendet, um zu kommunizieren.
Das ist eine Form von SOAP, XML über TCP,
und SSDP – UDP Broadcast – um Geräte zu identifizieren und zu finden.
Sonos hat SMAPI verwendet, um mit Musik-Streamingdiensten zu kommunizieren,
und um intern Musik zwischen den Endgeräten zu verteilen.

Die alte S1 App war für die nativen UI-Systeme geschrieben, 
die von den verschiedenen Plattformen verwendet werden und verwendete C++.
Das war anstrengend, um neue Features zu realisieren, 
weil es effektiv viermal gemacht werden mußte (Windows Desktop, Mac Desktop, Android und Mac Phone),
aber es war sehr performant.

Die neue App verwendet ein Javascript Framework für die Implementierung (angeblich Flutter).
Sie ist Mobile only und verwendet mDNS, um Geräte zu finden.
Das scheint weitaus weniger zuverlässig zu funktionieren, als SSDP.

Der Netzwerkverkehr ist jetzt verschlüsselt, 
was insbesondere die CPUs der älteren Lautsprecher sehr zu belasten scheint.
Statt UPNP wird von jedem Lautsprecher eine lokale Version der Sonos Cloud API verwendet,
und diese scheint extrem gesprächig zu sein, und sehr viele Paketumläufe für jede Aktion zu brauchen.

Ein Problem, das besonders stark zuschlägt, ist die Änderung von Lautstärken bei gruppierten Lautsprechern,
weil sich hier die hohe Paketfrequenz mit dem Fehlen von Gruppenkommunikation zu schlagen scheint.
Gruppiert man ein Dutzend Lautsprecher und zieht dann an den Reglern, gibt es einen Paketsturm im Netz.
Sonos [erklärt](https://docs.sonos.com/docs/volume) wie man das vermeiden kann, aber hält sich nicht daran.

Dazu kommt, daß alle Kommunikation jetzt über die Sonos Cloud läuft, 
statt zwischen der App ud den Streamingdiensten direkt zu laufen.
Sonos positioniert sich so nicht nur als Intermediär und Datensammelpunkt,
sondern auch als Performance-Bottleneck.
Zudem kann die App so nur noch Dienste nutzen, die der Sonos Cloud bekannt sind und von ihr unterstützt werden.
Lokales Abspielen von Fileservern, ein lokaler Airsonic Abspielpunkt 
und andere lokale Dienste sind aus der Sonos Cloud nicht erreichbar und können daher nicht mehr funktionieren.

Neu ist die Bereitstellung einer Sonos WebApp,
[https://play.sonos.com](https://play.sonos.com).
Mit der kann man sinnloserweise daheim Krach machen, während man nicht daheim ist.
Dafür unterstützt diese Anwendung kein 2FA und auch keine Methoden zur De-Authentisierung von Anwendungen und Diensten.

# Was sagt Sonos und beabsichtigt die Firma, strategisch?

Sonos selbst hat den Switch zu der neuen App als "mutigen Schritt" bezeichnet.
Ein Haufen User sind extrem genervt, und das kann man gewiss als "mutig" bezeichnen,
insbesondere nach den
[Geschehnissen]({{< relref "2019-12-30-sonos-recycle-mode.md" >}})
von vor
[vier]({{< relref "2020-03-06-sonos-recycled-their-recycle-mode.md" >}})
[Jahren]({{< relref "2020-06-09-sonos-just-got-complicated.md" >}}).
Die App wird in den diversen App-Stores unterirdisch bewertet.
Das wird sich auch nicht ändern, solange Performance und Geschwindigkeit so schlecht bleiben.

Noch gibt es Anwendungen von Drittanbietern, und die scheinen weitaus besser zu funktionieren.
Sie basieren jedoch auf der alten UPNP API, die deprecated ist und irgendwann abgeschaltet wird.

Danach ist der lokale Verkehr verschlüsselt und aller abgespielte Sound ist für Sonos in deren Cloud sichtbar.
Das macht eine ganze Menge Sinn, wenn man Quatsch mit Benutzerdaten, AI und Marketing plant.
Sonst eher nicht.

Die Lehre und Zusammenfassung aus diesem ganzen Desaster ist:
Lauf! Raus aus Sonos, jetzt.

Die Frage ist, was man kaufen kann, das funktioniert.

Ich suche nach fertigen Geräten in der Art der Play:3 oder IKEA Bookshelf, die brauchbar klingen,
sich im Haus verteilen lassen, eine offene und dokumentierte cloud-freie API haben und Multiroom können.
Zu ersetzen sind 11 Geräte, darunter eine Playbar – aber das ist am Ende fast egal.

Als Dienste verwenden wir Spotify, Pocket Casts, ein lokales Airsonic Advanced, 
und die Tonausgänge diverser Mac und Windows-Rechner.

# Mögliche Antworten

Als ich das im Netz fragte, nannte man mir die folgenden Dinge zum Ansehen:

- [Bluesound](https://bluesound-deutschland.de/kabellose-lautsprecher/).
- [Roon](https://roon.app/en/pricing) – unklar, was das genau ist, und eine Subscription?
- [Teufel Raumfeld](https://teufelaudio.nl/wifi-speakers/raumfeld-multiroom), aber das ist [abgekündigt](https://support.teufel.de/hc/de/articles/16194516593042-Teufel-Raumfeld-Wird-die-Technologie-weiterentwickelt).
- [Russsound](https://www.russound.com/products/audio-systems/multi-room-controllers/caa66-system-and-kits/caa66-controller-amplifier) – fernsteuerbare Verstärker für Boxen, mit langen Analog-Kabeln?

Das scheinen alles andere Geräte und Lösungen zu sein, als ich brauche oder will?
