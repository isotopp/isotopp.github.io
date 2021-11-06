---
layout: post
published: true
title: Frühling - die Klimaanlagen schlagen aus
author-id: isotopp
date: 2008-05-12 05:15:55 UTC
tags:
- computer
- hardware
- karlsruhe
- klima
- lang_de
feature-img: assets/img/background/rijksmuseum.jpg
---
<!-- s9ymdb:4730 --><img class="serendipity_image_center" width="580" height="333" style="border: 0px; padding-left: 5px; padding-right: 5px;" src="/uploads/klimaanlage.jpg" alt="" />

Mitte Mai - die ersten warmen Tage im Jahr. Dies ist die Zeit, in der die Bäume blühen, die Natur aus dem Winterschlaf erwacht und Menschen sich ein schönes freies Pfingswochenende machen. 

Alle Menschen? 

Nein. Der gemeine Sysadmin muß um diese Zeit herum <a href="http://blog.koehntopp.de/archives/791-Wenn-es-mal-wieder-laenger-dauert....html">Klimaanlagen treten</a> und die daran hängenden Systeme wiederbeleben. Denn die ersten warmen Tage im Jahr sind auch ein Belastungstest für ansonsten ungetestete neue Klimakonzepte.

Im Graphen oben war die Ursache des versauten Pfingstwochenendes eine Reihe von schicken Sichtschutzblenden, die die Rückkühler leider all ihrer Effektivität beraubt haben - bis ein paar Jungs in schwarzen T-Shirts kurz die Flex rausgeholt und das Problem an der Wurzel gepackt haben.



Dies ist ein Wochengraph. Die angezeigten Zahlen an der X-Achse sind Tagesnummern. <ol><li>Wartung, danach lief ein anderes Aggregat. Es hat eine andere Kennlinie.</li><li>Failover auf das Backup-Gerät wegen Sonneneinstrahlung auf dem Rückkühler und fehlender Ventilation durch den Sichtschutz.</li><li>Ausfall des Backup-Gerätes aus demselben Grund.</li><li>Einleitung von Notkühlmaßnahmen und Abschaltung aller nicht zwingend notwendigen Geräte. Ca. 80% der Verbraucher sind offline. Die Temperatur am Sensor liegt bei fast 45°C.</li><li>Restart der Anlage. Folgeausfall, weil der Druck im System noch zu hoch ist. Noch ein Restart, der diesmal gelingt.</li></ol> Es wird spannend nun eine Kurve von Plattenverlusten pro Woche vor und nach dem thermischen Schock im RZ zu plotten und zu vergleichen.
