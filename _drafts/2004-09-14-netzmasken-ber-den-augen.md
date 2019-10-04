---
layout: post
published: true
title: Netzmasken über den Augen
author-id: isotopp
date: 2004-09-14 17:52:53 UTC
tags:
- schulung
- lang_de
feature-img: assets/img/background/rijksmuseum.jpg
---
<img width='110' height='69' border='0' hspace='5' align='right' src='/uploads/binary.serendipityThumb.jpg' alt='' /> Heute habe ich einem jüngeren Kollegen Netmasks und Broadcast-Adressen beibringen wollen, und habe eine Runde über Stellenwertsysteme, Logarithmen, den Unterschied zwischen Ziffer und Zahl und dergleichen Dinge mehr drehen müssen. Mir sind diese Dinge damals mehr oder weniger zugeflogen - einmal weil so etwas an der Schule unterrichtet worden ist, und zum anderen, weil ich einige Jahre mit verschiedenen Assemblern rumhantiert habe, bevor ich meine erste Hochsprache (C64 Basic zählt wohl nicht als solche :) gelernt habe.
<br clear='all' />

Ich war zunächst ein wenig verblüfft, daß solche Dinge wie Binär-Hex-Umrechnung und Binär-Dezimal-Umrechnung Neulingen heute nicht mehr zwingend geläufig sind, und daß man entsprechend erst einmal 16^0 und 16^1-Tabellen und eine Tabelle Netzmasks nach Dezimal erarbeiten muß, damit man zügig Übungen machen kann. 

Aber wenn man darüber nachdenkt, ist das im Grunde zwingend: Jemand, der mit Taschenrechnern aufgewachsen ist, ist sicher nicht gelenkig im Kopfrechnen. Und Leute, die im Zeitalter von Java, BitVector und BitSet aufgewachsen sind, machen sich vielleicht im Leben keine Gedanken darüber, wie die Bitmasken aussehen, die sie auf Adressen oder Routen anwenden.

Wahrscheinlich ist das das Gefühl, das man hat, wenn man alt wird.

<b>Update:</b> Ich erzählte dies meiner Katze, und sie antwortete mit einem einfachen Paste ins Irc: <blockquote>#define BITCOUNT(x)     (((BX_(x)+(BX_(x)>>4)) & 0x0F0F0F0F) % 255)
#define  BX_(x)         ((x) - (((x)>>1)&0x77777777) \
                             - (((x)>>2)&0x33333333) \
                             - (((x)>>3)&0x11111111))</blockquote> Dafür liebe ich sie.
