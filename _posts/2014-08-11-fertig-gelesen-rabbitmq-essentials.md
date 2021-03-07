---
title: 'Fertig gelesen: "RabbitMQ Essentials"'
date: '2014-08-11 19:45:57 +0200'
layout: post
published: true
author-id: isotopp
tags:
- lang_de
- book
- media
- review
feature-img: assets/img/background/book.jpg
---
AMQP, das Queueing-Protokoll, ist der zentrale Kommunikationsbus im verteilt arbeitenden Openstack-System: API-Server nehmen Arbeitsaufträge via Web-Interface oder REST-API entgegen, verwandeln sie in AMQP-Messages und die irgendwo im System laufenden Consumer arbeiten die Aufträge ab und geben Resultate zurück.

Natürlich will man das ganze System betreiben ohne sich irgendwo ein ekeliges Erlang einzutreten, stellt dann aber schnell fest, daß QPid ein blöder Scheiß ist, der beim leisesten Windhauch umfällt. Rabbit dagegen läuft durch. Ok, was tun?

Das Buch hier gibt einem ein solides Handle, um einen Rabbit sinnvoll betreiben, administrieren und debuggen zu können und diskutiert auch die wichtigsten Programmier-Paradigmen, mit denen man zu tun hat. Das ist gut, weil man mit Sicherheit auch im Code rumwühlen muß, wenn man ein Openstack am Hacken hat, denn fertig ist das noch lange nicht.

Ekeliges Thema, notwendiges Buch.

"[RabbitMQ Essentials](https://www.amazon.de/RabbitMQ-Essentials-English-David-Dossot-ebook/dp/B00JZMZ1PI/)", David Dossot, EUR 9.37

*EDIT:* Es gibt jetzt eine 2. Auflage: [RabbitMQ Essentials: Build distributed and scalable applications with message queuing using RabbitMQ, 2nd Edition ](https://www.amazon.de/RabbitMQ-Essentials-distributed-scalable-applications-ebook/dp/B089ZWKT3W/), Lovisa Johannsson und David Dossot, EUR 11.98
