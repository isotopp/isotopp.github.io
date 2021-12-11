---
author: isotopp
date: "2007-10-10T09:46:49Z"
feature-img: assets/img/background/mysql.jpg
tags:
- database
- mysql
- lang_de
title: "Welches Dateisystem für meinen Datenbank-Server"
---

Hier wieder eines meiner berüchtigten Irc-Logs. Ich geh dann mal wieder ins Bett.

> SiMOON> Weiß einer von Euch, wie viele Dateien ich sinnvollerweise in einem Verzeichnis haben sollte, maximal, ohne daß es langsam wird?
> 
> e-voc> 255 :) Oder ist das heute nicht mehr so?

**Isotopp>** e-voc: Das ist sehr vom Dateisystem abhängig, und im Fall von ext2/ext3 auch davon, ob du Debian verwendest.
Wenn du ein Dateisystem verwendest, das Verzeichnisse als Baumstrukturen verwaltet, dann spielt die Anzahl der Dateien in einem Verzeichnis kaum noch eine Rolle. 
Das ist bei XFS und Reiserfs immer der Fall, und bei ext2/ext3 ist es der Fall, wenn das Dateisystem mit dem Feature `dir_index` angelegt worden ist.

**Isotopp>** e-voc: Das Feature `dir_index` wir von zeitgemäßen Distributionen automatisch als Flag gesetzt, wenn man `mke2fs` verwendet.

**e-voc>** :smile:

**Isotopp>** e-voc: Ich kenne jedoch einen Haufen Debian-Installationen, die `mke2fs` ohne automatisches `dir_index` verwenden.
```
linux:~ # tune2fs -l /dev/sda5| grep "Filesystem feature"
Filesystem features:      filetype sparse_super
```

**Isotopp>** Hier fehlt `dir_index`.

**e-voc>** Meine 255 waren aber nicht ganz ernst gemeint ;) Aber interessant das zu wissen.

**Isotopp>** e-voc: Sollten sie nicht. Wenn ein Directory größer als 12 Blöcke wird (Default-Blocksize ist derzeit 4 KB), dann wird ext2/ext3 sehr langsam in lookup und in creation/deletion.

**SiMOON>** Isotopp: `ext3` auf Debian.

**Isotopp>** Man kann `dir_index` auf einem existierenden ext2/ext3 nachrüsten, wenn es fehlt. Dazu muss man mit `tune2fs` wie oben gezeigt prüfen, ob es gesetzt ist.

**SiMOON>** mal sehen

**Isotopp>** Wenn nein, `umount`, `tune2fs -O dir_index /dev/...`; `e2fsck -D /dev/...` Details dazu in der Manpage zu `tune2fs`, Abschnitt über die Option `-O` (Groß-O).

**SiMOON>** Isotopp: `Filesystem features: has_journal resize_inode dir_index filetype needs_recovery sparse_super large_file`

**Isotopp>** SiMOON: Gut. Dann ist `dir_index` gesetzt. Damit spielt Verzeichnisgröße eine untergeordnete Rolle.

**SiMOON>** Isotopp: Hier sieht es anders aus, oder? `Filesystem features: has_journal filetype needs_recovery sparse_super large_file`

**Isotopp>** SiMOON: Ja, das muss behandelt werden.

**SiMOON>** Da fehlt der `dir_index`, wenn ich das richtig sehe.

**Isotopp>** `ext3` hat speziell bei Datenbanken noch einen anderen Nachteil. Unsere Benchmarking-Leute haben festgestellt, daß `ext3` sein Log sehr unregelmäßig flushed, und wenn der Log-Flush unregelmäßig ist, dann heißt das, daß die Laufzeiten bestimmter Queries sehr stark variieren.

**thegap>** Also ist `ext3` nicht unbedingt die beste Wahl für Datenbank-Server?

**Isotopp>** `ext3` performt offenbar besonders unregelmäßig und schlecht, wenn sehr viele gleichzeitige Zugriffe stattfinden. In einem Single-Thread Benchmark ist es fast immer schneller als etwa `xfs`, aber wenn man 10-50 Clients parallel schreiben und lesen lässt, dann gewinnt `xfs` hands down:

**Isotopp>** 1. gleichmäßigere flush zeiten

**Isotopp>** 2. wesentlich bessere Vermeidung von Fragmentierung bei XFS bei konkurrenten Zugriffen.

**hartmut>** Isotopp: die Cluster-Jungs hatten auch Ärger mit `ext3` log flush.

**Isotopp>** hartmut: Ja, die auch. Die *hassen* `ext3` aus tiefstem Herzen. Und die Jungs, die von uns bei $KUNDE waren auch.

**hartmut>** Isotopp: Na ja, Stewart ist da aber auch schon vorbelastet ;)

**Isotopp>** Aber er hat Benchmarks, die Sachen beweisen. Also genaugenommen hatten die Cluster und $KUNDE-Leute Benchmarks und Steward konnte demonstrieren, daß XFS die Probleme schlicht nicht hat.

**Isotopp>** `ext3` baut Blockmarmelade, wenn man mehrere Files im selben Verzeichnis gleichzeitig verlängert, also etwa ein Haufen `.ibd` oder `.MYD`-Dateien parallel wächst. XFS vermeidet das recht zuverlässig.

**SiMOON>** Isotopp: wenn ich die `/` tunen will, muss ich demnach den rechner runterfahren und mit cd booten und dann das ausführen, oder?

**Isotopp>** SiMOON: das ist korrekt.

**SiMOON>** Isotopp: In meinem Fall handelt es sich um einen NFS-Server. Also keine Datenbank.

**Isotopp>** SiMOON: Dann ist wahrscheinlich die Zahl der gleichzeitigen Schreibzugriffe geringer als bei einem Datenbankserver, aber eventuell hast du große Verzeichnisse.

**SiMOON>** Isotopp: Ja, ich hab Verzeichnisse mit 150k Dateien.

**Isotopp>** SiMOON: Äh. Dann ist das *dringend*.

**SiMOON>** Ja. Ich weiß.

**SiMOON>** Isotopp: Alternativ kann ich die Daten so legen, daß es mehr Verzeichnisse sind, von denen jedes 5 Files enthält, wäre das besser?

**Isotopp>** Nicht wirklich. Die individuellen Verzeichnis-Lookups gehen viel schneller, dafür muss `namei()` dann halt durch mehr Verzeichnisse. Es ist schneller, merkbar schneller sogar, aber es verlagert das Problem quasi nur und `dir_index` sollte kein Problem machen. Auch nachträglich.

**SiMOON>** Isotopp: Im laufenden Betrieb ist das vermutlich nicht möglich?

**Isotopp>** Nein, wie gesagt `umount`, `tune2fs`, `e2fsck -D`. Anleitung in der Manpage von `tune2fs`,sektion `-O` (Groß-O).

**SiMOON>** Ja, ich schau gerade. Klingt nach Spätschicht :)

**Isotopp>** Man muss sich mal vor Augen halten, daß `ext2` am Ende auf dem Stand der Technik von 1984 beruht, XFS immerhin auf Veröffentlichungen aus dem Jahre 1994. `ext3` sind etwa 8000 Zeilen Kernel-Code, XFS etwas mehr als 50.000, glaube ich. Bei gleicher Anzahl von Fehlern pro 1000 loc hat XFS weitaus mehr Fehler als `ext3`, aber an Stellen, an denen `ext3` nicht mal Features hat.

S**iMOON>** Isotopp: Würde es Sinn machen, den Fileserver auf XFS umzustellen?

**Isotopp>** Wie viel Datenvolumen? 150.000 files/dir ist schon fett.

**SiMOON>** Isotopp: Das sind nur die User-Avatare. Insgesamt ist es deutlich mehr.

**Isotopp>** Wie viel GB?

**SiMOON>** ca 60 GB

**Isotopp>** Hast du viele gleichzeitige Schreibzugriffe, womöglich im selben Verzeichnis? Hast du viele gleichzeitige Grow-operationen (Writes am Ende einer Datei) oder gleichzeitige Create-Operationen (Datei wird angelegt)? Das sind die stellen, an denen XFS die größten Vorteile hat.

**SiMOON>** Na ja, gleichzeitige Schreiboperationen sind eher wenige. Grows so gut wie gar nicht. Weil ein File wird geschrieben und danach entweder gelöscht oder neu geschrieben. Wird halt viel gelesen. Ist halt der Server vom statischen Content, der über NFS gefüttert wird. Wenig schreiben, viele Daten, viel Lesen durch Lighty.

**Isotopp>** Dann ist XFS vielleicht nicht zwingend, hätte aber vermutlich dennoch Vorteile. Du müsstest sowieso erst Testen und Dich mit der Technik vertraut machen.

**SiMOON>** Dann tune ich lieber erstmal das ext3.

**Isotopp>** Mehr zu XFS findest du auf 
[http://oss.sgi.com/projects/xfs/](http://oss.sgi.com/projects/xfs/), speziell 
[http://oss.sgi.com/projects/xfs/publications.html](http://oss.sgi.com/projects/xfs/publications.html) und 
[http://oss.sgi.com/projects/xfs/training/index.html](http://oss.sgi.com/projects/xfs/training/index.html).

**SiMOON>** Komisch daß der Live-Server das nicht anhat. Alle anderen haben es.

**Isotopp>** Debian?

**SiMOON>** Jep.

**Isotopp>** Debian ist sehr langsam darin, wichtige neue Features zu übernehmen. `dir_index` haben die wohl erst sehr, sehr spät per default enabled.

**SiMOON>** Kann sein, der Server ist etwas älter. Die, die ich neu gemacht habe, haben es alle eingeschaltet.

**Isotopp>** Ich habe so einige gut gepflegte Vorurteile gegen Debian als Produktionsdistribution, unter anderem wegen solcher Sachen. Aber das ist ein anderer Rant, den ich ein anderes mal schreibe. Jedenfalls, wenn du ein Debian haben willst, das funktioniert und skaliert, nimm ein Ubuntu. Danke sehr.
