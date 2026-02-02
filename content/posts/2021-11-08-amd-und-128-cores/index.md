---
author: isotopp
title: "AMD und 128 cores"
date: 2021-11-08T13:28:27+01:00
feature-img: assets/img/background/rijksmuseum.jpg
tags:
  - lang_de
  - computer
  - cloud
aliases:
  - /2021/11/08/amd-und-128-cores.html
---

Wir sprachen in
[Software Defined Silicon]({{< relref "2021-09-30-software-defined-silicon.md" >}}) 
darüber, wie die CPU-Bedürfnisse von Hyperscalern und normalen Kunden divergieren.

> Hyperscaler haben Interesse an immer größeren CPUs mit immer mehr Kernen, und immer höherer Dichte in ihren Rechenzentren. [...]
> 
> Normale Kunden sehen das nicht so: man kann in einer 64C/128T-Core-Single-Socket-Konfiguration mit 2-4 TB RAM unter Umständen den gesamten Serverbedarf einer kleineren Firma in einer einzelnen physikalischen Maschine in VMs unterbringen. 
> Das Problem dabei: Explosionsradius, wenn mal etwas ausfällt.

Und das passiert:

[AMD Shares Early Details Of Zen 4 Genoa, Bergamo](https://www.phoronix.com/scan.php?page=news_item&px=AMD-Zen-4-Genoa-Bergamo)

Heute hat AMD einen Ausblick auf die kommenden Zen 4 CPUs geliefert:
Die normale "Genoa" wird 96 Cores pro Socket liefern, also 192C/384T in einem 2P-Board.

Es wird jedoch von dieser CPU auch eine "Bergamo"-Variante geben, und das ist eine
"high-core count compute engine designed for cloud-native workloads". 
Das sind dann 256C/512T in einem 2P-Board.

Das ist nicht nur zu viel Maschinerie in einer einzelnen Kiste, sondern auch in einem normalen Rechenzentrums-Rack vermutlich nicht mehr so einfach zu kühlen.
Wenn man sich als Hyperscaler jedoch seine Rechenzentren nach Maß bauen lässt, sollte das alles nicht weiter weh tun.

"Wozu der 4K-Monitor, fragst Du?
Na, damit die 'htop' Anzeige auf den Bildschirm passt."
