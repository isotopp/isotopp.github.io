---
author-id: isotopp
date: "2005-10-08T08:43:57Z"
draft: true
feature-img: assets/img/background/rijksmuseum.jpg
published: true
tags:
- bash
- computer
- shell
- unix
- lang_de
title: '#!/bin/bash -- Brace Expansion'
---
Eine Unix-Kommandoshell nimmt die Benutzereingabe und unterteilt sie in Worte. Das erste Wort einer Zeile ist ein Kommando, der Rest sind die Parameter des Kommandos. So weit so langweilig. Interessant wird die Sache, weil eine Unix Shell gut mit Worten umgehen kann. So kann sie Worte ersetzen und dabei auch neue Worte generieren. Dies nennt man Expansion, und die Bash hat sehr viele Expansion-Mechanismen: brace expansion, tilde expansion,  parameter expansion, variable expansion, arithmetic expansion, command substitution, word splitting und  pathname expansion sowie process substitution werden in dieser Reihenfolge auf den Worten einer Zeile durchgeführt. Nicht alle diese Mechanismen sind in einer <a href="http://kris.koehntopp.de/artikel/unix/shellprogrammierung/">klassischen #!/bin/sh</a> enthalten.

Wenn man schnell mal ein paar Pfadnamen braucht, ist <a href="http://ebergen.net/wordpress/?p=80">Bash Brace Expansion</a> echt nützlich. Die Grundidee ist diese: <blockquote>kris@valiant:~> echo a{b,c,d}e
abe ace ade</blockquote> Das kann man benutzen, um ähnliche Dinge aufzuzählen, ohne mehr schreiben zu müssen: <blockquote>kris@valiant:~/Source/tidy/src>ls parser.{c,h,o,lo}
parser.c  parser.h  parser.lo  parser.o</blockquote> 

Dabei ist es durchaus erlaubt, einen Teilausdruck leer zu lassen: <blockquote>kris@h3118:/etc/httpd> ls -1 httpd.conf{,.old}
httpd.conf
httpd.conf.old</blockquote> Aber Brace Expansion kann noch mehr: Bestandteil des Konzeptes sind auch Ranges. <blockquote>kris@valiant:~> mkdir x; for i in {0..10}; do mkdir x/$i; done; ls x
0  1  10  2  3  4  5  6  7  8  9
kris@valiant:~> mkdir y; for i in {a..z}; do mkdir y/$i; done; ls y
a  b  c  d  e  f  g  h  i  j  k  l  m  n  o  p  q  r  s  t  u  v  w  x  y  z</blockquote> Da die Erweiterung reihenfolgetreu ist, ist es sehr leicht, zum Beispiel alte Logfiles zu rotieren. Das geht dann so: <blockquote>kris@valiant:~/x> touch a.log
kris@valiant:~/x> for i in {9..0}; do olog=a.log.$i; nlog=a.log.$(( $i+1 )); [ -f $olog ] && mv $olog $nlog; done; mv a.log a.log.0; touch a.log; ls
a.log  a.log.0
kris@valiant:~/x> for i in {9..0}; do olog=a.log.$i; nlog=a.log.$(( $i+1 )); [ -f $olog ] && mv $olog $nlog; done; mv a.log a.log.0; touch a.log; ls
a.log  a.log.0  a.log.1</blockquote> Das letzte Beispiel verwendet eine weitere Bash-Expansion, Arithmethic Expansion. Hier wird ein Ausdruck, der in $(( ... )) steht, ausgerechnet und durch das Rechenergebnis ersetzt.
