---
layout: post
published: true
title: The Importance Of FAIL
author-id: isotopp
date: 2008-05-30 07:47:55 UTC
tags:
- architektur
- computer
- security
- lang_de
feature-img: assets/img/background/baellebad.jpg
---
Wenn man mit Featureentwicklern spricht, dann reden sie immer gerne über tolle
neue Dinge die sie gerade eingebaut haben.

Ich bin bei Featureentwicklern und Projektmanagern echt unbeliebt.

Ich rede gerne über Kosten, und über FAIL.  Das habe ich mit vielen anderen
Sysadmins, Bibliotheksentwicklern und Kernelcodern gemeinsam.  Wenn man dort
einmal mithört - zum Beispiel auf der Linux Kernel Mailingliste oder unter
Stammtischgesprächen von Sysadmins - dann fällt einem bald etwas auf: Dort
redet man in der Regel nicht von tollen neuen Features oder was jetzt
optimiert worden ist, sondern dort redet man in der Regel von Fehlern, die
aufgetreten sind oder von schlechtesten Fällen, und wie man sie triggert. 
Newsgroups wie
[de.alt.sysadmin.recovery](http://groups.google.de/group/de.alt.sysadmin.recovery/topics)
sind voll von zynischen Geschichten über Komponentenversagen.  Die
wichtigsten Abschnitte in Ross Andersons
[Security Engineering](https://www.cl.cam.ac.uk/~rja14/book.html)
sind die Abschnitte, in denen er das Versagen von Sicherheitssystemen
beschreibt.

Alle diese Leute - Kernelentwickler, Bibliotheksentwickler und Sysadmins -
sind Leute, die normalerweise ständig mit Infrastrukturkomponenten zu tun
haben.  Und Infrastrukturkomponenten werden nie an ihrem besten Fall
gemessen, sondern immer nur an ihrem schlechtesten Fall und an der Art und
Weise, wie sie versagen.

Niemand lobt die Stadtwerke, weil sie das Stromnetz 15% effizienter gemacht
haben, aber jeder erinnert sich an den letzten Stromausfall, den letzten
Kernelbug, in den er rein getreten ist oder das Szenario, bei dem er eine
Bibliothek zum Explodieren gebracht hat (
[blog.fefe.de](http://blog.fefe.de/?q=glibc)
)

Featureentwickler tun gut daran, sich diese Denkweise einmal zu eigen zu
machen.  Ein Freund und Arbeitskollege von mir formuliert es so: "Wenn ich
Go spiele und gewinne, dann habe ich nur bestätigt, was ich schon weiß, aber
nichts gelernt.  Nur wenn ich verliere (und hinterher verstehe, wieso ich
verloren habe), dann kann ich etwas lernen."

Wenn man sich von vorneherein auf Worst-Case-Verhalten konzentriert und
versucht, diese Fälle zu optimieren, dann kann man FAIL vermeiden und lernen
ohne die Schmerzen aus erster Hand zu erfahren.

Das Problem existiert aber auch auf einer größeren, politischen Ebene.  Wir
führen Infrastruktur ein - Toll Collect, die Gesundheitskarte, Wahlcomputer
oder die Vorratsdatenspeicherung - und führen die gesellschaftliche
Diskussion hier meistens auf der Ebene von Featureentwicklern.  Mißbrauch,
interner Mißbrauch, Versagen von Teilkomponenten, Versagen von
Sicherheitsmechanismen, Rückbau, Schadensbegrenzung, Versicherbare
Restrisiken sind bei der gesellschaftlichen Betrachung dieser
Infrastrukturen keine Themen.
