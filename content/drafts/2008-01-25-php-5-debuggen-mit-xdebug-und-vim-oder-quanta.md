---
author-id: isotopp
date: "2008-01-25T18:44:33Z"
draft: true
feature-img: assets/img/background/rijksmuseum.jpg
published: true
tags:
- debug
- php
- lang_de
title: PHP 5 Debuggen mit Xdebug und vim oder Quanta
---
Als alter Sack bin ich ja einiges gewohnt, so auch das Debuggen von PHP Scripten mit echo, wenn es sein muß. Muß es aber nicht mehr, denn es gibt ja für PHP die Xdebug-Extension und für KDE den HTML-Editor Quanta, der das Xdebug-Protokoll "dbgp" sprechen kann, sagt die Doku. Xdebug ist ein richtiger Debugger für PHP, so wie man das kennt mit Breakpoints, Single Step und Watchpoints und Backtraces und allem.

Weil PHP ja im Webserver rennt, aber die IDE womöglich auf einer anderen Kiste, an der ich sitze, kommunizieren PHP/Xdebug und der Editor/Debugger über TCP/IP. Und zwar lauscht die IDE auf einem Debugport, normal Port 9000, und das zu debuggende Script connected sich da ran, wenn es was will.

Also einmal die Einzelteile zusammensetzen und gucken, was passiert.

[b]Xdebug installieren[/b]

Zunächst einmal muß die Xdebug-Extension in PHP5 installiert werden. Suse Linux tut das nicht per Default, und bietet diese auch nicht zum Runterladen an. Indem man das Paket "php5-devel" installiert, bekommt man jedoch das Programm "pear" installiert, das einem PHP-Extensions aus dem Repository runterladen und installieren kann.

Ich mache also 
{{< highlight console >}}
linux:~ # rpm -q php5-devel
php5-devel-5.2.5-8.1
linux:~ # pear install pecl/xdebug
downloading xdebug-2.0.2.tgz ...
Starting to download xdebug-2.0.2.tgz (279,621 bytes)
.................done: 279,621 bytes
65 source files, building
running: phpize
Configuring for:
PHP Api Version:         20041225
Zend Module Api No:      20060613
Zend Extension Api No:   220060519

...

Build complete.
Don't forget to run 'make test'.

running: make INSTALL_ROOT="/var/tmp/pear-build-root/install-xdebug-2.0.2" install
Installing shared extensions:     /var/tmp/pear-build-root/install-xdebug-2.0.2/usr/lib/php5/extensions/
running: find "/var/tmp/pear-build-root/install-xdebug-2.0.2" -ls
871447    0 drwxr-xr-x   3 root     root           72 Jan 25 18:04 
  /var/tmp/pear-build-root/install-xdebug-2.0.2
876257    0 drwxr-xr-x   3 root     root           72 Jan 25 18:04 
  /var/tmp/pear-build-root/install-xdebug-2.0.2/usr
876258    0 drwxr-xr-x   3 root     root           72 Jan 25 18:04 
  /var/tmp/pear-build-root/install-xdebug-2.0.2/usr/lib
876262    0 drwxr-xr-x   3 root     root           80 Jan 25 18:04 
  /var/tmp/pear-build-root/install-xdebug-2.0.2/usr/lib/php5
876264    0 drwxr-xr-x   2 root     root           80 Jan 25 18:04 
  /var/tmp/pear-build-root/install-xdebug-2.0.2/usr/lib/php5/extensions
876256  601 -rwxr-xr-x   1 root     root       613021 Jan 25 18:04 
  /var/tmp/pear-build-root/install-xdebug-2.0.2/usr/lib/php5/extensions/xdebug.so

Build process completed successfully
Installing '/usr/lib/php5/extensions/xdebug.so'
install ok: channel://pecl.php.net/xdebug-2.0.2
configuration option "php_ini" is not set to php.ini location
You should add "extension=xdebug.so" to php.ini
{{< / highlight >}}
 Die Meldung am Ende über die php.ini, die nicht geändert werden kann, ist normal in Suse Linux. Suse hat in PHP wie auch im Webserver Modularitätswahn, und man muß da manuell bei. Das tun wir dann auch gleich mal. Aber erst mal verifizieren wir unser Zeugs: 
{{< highlight console >}}
linux:~ # pear list-files pecl/xdebug
Installed Files For pecl/xdebug
===============================
Type Install Path
doc  /usr/share/php5/PEAR/doc/xdebug/Changelog
doc  /usr/share/php5/PEAR/doc/xdebug/CREDITS
doc  /usr/share/php5/PEAR/doc/xdebug/LICENSE
doc  /usr/share/php5/PEAR/doc/xdebug/NEWS
doc  /usr/share/php5/PEAR/doc/xdebug/README
doc  /usr/share/php5/PEAR/doc/xdebug/xt.vim
src  /usr/lib/php5/extensions/xdebug.so
linux:~ # ls -l /usr/lib/php5/extensions/xdebug.so
-rw-r--r-- 1 root root 613021 Jan 25 18:04 /usr/lib/php5/extensions/xdebug.so
{{< / highlight >}}
 Das ist das, was wir in unserem PHP5 laden wollen. Suse hat nun in /etc/php5 ein conf.d, das für jedes Modul eine Config enthält und für jede SAPI ein Verzeichnis, das die Basis-Ini für diese SAPI enthält, hier also /etc/php5/apache2 für den Webserver und /etc/php5/cli für das Kommandozeilen-PHP. Beide lesen alle Files aus conf.d ein. 
{{< highlight console >}}
linux:~ # cd /etc/php5/
linux:/etc/php5 # ls -l
total 1
drwxr-xr-x 2 root root  72 Jan 14 21:53 apache2
drwxr-xr-x 2 root root 104 Jan 25 13:34 cli
drwxr-xr-x 2 root root 552 Jan 25 17:51 conf.d
{{< / highlight >}}
 Wir legen also einfach ein /etc/php5/conf.d/xdebug.ini an und konfigurieren dort. Danach sollten wir ein Kommandozeilen-PHP mit Xdebug bekommen. 
{{< highlight console >}}
linux:/etc/php5 # cd conf.d
linux:/etc/php5/conf.d # cat xdebug.ini
zend_extension=/usr/lib/php5/extensions/xdebug.so
xdebug.remote_enable = 1
xdebug.remote_handler = dbgp
xdebug.remote_mode = req
xdebug.remote_port = 9000
xdebug.remote_host = localhost
; xdebug.profiler_enable = 1
; xdebug.profiler_output_dir = /var/tmp
{{< / highlight >}}
 Ein schneller Aufruf von "php -m" sollte nun das Xdebug zweimal listen: Einmal als Zend-Extension und noch einmal als PHP-Modul, mit dem man die Zend-Extension durch <a href="http://www.xdebug.org/docs/all_functions">PHP-Funktionen</a> zerkonfigurieren kann. Hier die Probe: 
{{< highlight console >}}
kris@linux:~> php -v
PHP 5.2.5 with Suhosin-Patch 0.9.6.2 (cli) (built: Dec 12 2007 03:47:43)
Copyright (c) 1997-2007 The PHP Group
Zend Engine v2.2.0, Copyright (c) 1998-2007 Zend Technologies
    with Xdebug v2.0.2, Copyright (c) 2002-2007, by Derick Rethans
kris@linux:~> php -m
[PHP Modules]
...
xdebug
...

[Zend Modules]
Xdebug
{{< / highlight >}}
 Man beachte, daß einmal xdebug und einmal Xdebug gelistet wird.

Wenn wir jetzt ein Script schreiben, wird es sich [b]nicht[/b] an den Debugger connecten, wenn wir nicht darum bitten. Dazu brauchen wir eine geeignetes Script, einen geeigneten Debugger und eine geeignete Bitte.

[b]Ein Testscript für die Kommandozeile[/b]

{{< highlight console >}}
kris@linux:~> cat probe.php
#! /usr/bin/php5 -q
<?php
  function fac($n) {
    if ($n == 1)
      return 1;

    return fac($n-1) * $n;
  }

  echo fac(10);
?>
{{< / highlight >}}


[b]Ein geeigneter Debugger (und die geeignete Bitte um Debug)[/b]

Vim enthält, wenn er mit "+python" und "+signs" übersetzt worden ist, die möglichkeit, ein Xdebug-Debuggerpaket zu installieren. Der Default-vim, wie er von Suse installiert wird, hat diese Möglichkeit nicht. Man kann das mit dem Kommando ":version" in vim schnell kontrollieren.

Ich habe vim-enhanced von <a href="http://ftp.belnet.be/mirror/ftp.opensuse.org/distribution/10.3/repo/oss/suse/i586/vim-enhanced-7.1-44.i586.rpm">Belnet</a> über Smart installiert und dieses Paket hat die notwendigen Optionen. Hat man das, kann man sich ein $HOME/.vim anlegen und <a href="http://www.vim.org/scripts/script.php?script_id=1929">Sam Ghods DBGp Client</a> installieren. Das debugger.zip wird nach $HOME/.vim ausgepackt und liegt dann in $HOME/.vim/plugin: 
{{< highlight console >}}
kris@linux:~/.vim/plugin> l
total 56K
drwxr-xr-x 2 kris users   43 2008-01-25 15:18 ./
drwxr-xr-x 3 kris users   19 2008-01-25 15:18 ../
-rw-r--r-- 1 kris users  48K 2007-06-20 03:21 debugger.py
-rw-r--r-- 1 kris users 7.6K 2007-06-22 00:27 debugger.vim
{{< / highlight >}}
 Jetzt setzt man einen idekey in der XDEBUG_CONFIG-Variablen und startet vim mit dem zu debuggenden Script, dann drück man F5 im Vim. Vim lauscht nur für einige Sekunden auf Port 9000 auf das Script. <div class="serendipity_imageComment_center" style="width: 608px"><div class="serendipity_imageComment_img"><!-- s9ymdb:4636 --><img width="608" height="652"  src="/uploads/xdebug1.png" alt="" /></div><div class="serendipity_imageComment_txt">Zu langsam: vim lauscht nur 5 Sekunden auf den Connect vom Script, dann gibt er auf.</div></div> Mit Return und nach dem Schließen einiger Fenster mit ":n" und ":q!" haben wir den vim wieder in seinen Normalzustand versetzt und können noch einmal versuchen. F5, und dann schnell auf dem anderen Screen das Script gestartet - man sieht auch das Setzen des idekeys, der im vim und im Script gleich sein muß. <div class="serendipity_imageComment_center" style="width: 608px"><div class="serendipity_imageComment_img"><!-- s9ymdb:4637 --><img width="608" height="652"  src="/uploads/xdebug2.png" alt="" /></div><div class="serendipity_imageComment_txt">Setzen des idekey in XDEBUG_CONFIG und dann starten des Scripts. Im "vim"-Tab wartet ein vim mit demselben idekey und gedrückten F5.</div></div> Hat man alles richtig gemacht, bekommt man einen vim im Debugmodus, bei dem nicht weniger als 4 Subfenster geöffnet werden. Man sollte also ein Terminalfenster angemessener Größe bereitgestellt haben.

<div class="serendipity_imageComment_right" style="width: 110px"><div class="serendipity_imageComment_img"><a class='serendipity_image_link' href='/uploads/xdebug3.png'><!-- s9ymdb:4638 --><img width="110" height="100"  src="/uploads/xdebug3.serendipityThumb.png" alt="" /></a></div><div class="serendipity_imageComment_txt">vim-Debugger</div></div> Der Screenshot kann durch Anklicken vergrößert werden. Er zeigt einen vim beim Debuggen des Beispielscriptes. Im linken Fenster ist die aktuelle Codeposition durch einen Highlight markiert. Rechts sind vier Fenster zu sehen. Von oben nach unten sind dies: Variablen Watchwindow, ein Help-Fenster mit den aktuellen Tastenbelegungen, ein Stack-Window und ein Kommandotrace. Im Stackfenster sind sehr schön die Rekursionsebenen unserer rekursiven Funktion zu erkennen und im Watch-Window sind die abgerufenen Ausführungskontexte und Variablen zu sehen.

Alles in allem schon deutlich komfortabler als printf() oder var_dump().

[b]Apache2 + PHP + Xdebug[/b]

Jetzt spielen wir dasselbe Spiel noch einmal, aber mit Quanta, einer KDE-Gui zur Webentwicklung. Dazu starten wir den Apache2 Webserver in Suse Linux mit der PHP-Extension und schreiben ein $HOME/public_html/info.php, dessen Output wir uns ansehen. Haben wir alles richtig gemacht, sehen wir auch die Xdebug-Extension.

<div class="serendipity_imageComment_center" style="width: 641px"><div class="serendipity_imageComment_img"><!-- s9ymdb:4639 --><img width="641" height="523"  src="/uploads/xdebug4.png" alt="" /></div><div class="serendipity_imageComment_txt">Ausgabe von phpinfo() mit dem relevanten Teil: Xdebug.</div></div>

[b]Quanta[/b]

Der Web Editor Quanta ist in Suse Linux Bestandteil des Paketes "kdewebdev3". "smart info --urls kdewebdev3" listet das Paket bei mir wie folgt: 
{{< highlight console >}}
linux:~ # smart info --urls kdewebdev3
Loading cache...
Updating cache...                       #################################################### [100%]

Name: kdewebdev3
Version: 3.5.7-61.2@i586
...

URLs:
 Latest KDE packages
    http://ftp-1.gwdg.de/pub/opensuse/repositories/KDE:/KDE3/openSUSE_10.3/i586/kdewebdev3-3.5.8-8.9.i586.rpm (6.2MB)
{{< / highlight >}}
 In Quanta definieren wir ein neues Projekt für $HOME/~kris, und binden probe.php dort ein.

<div class="serendipity_imageComment_center" style="width: 776px"><div class="serendipity_imageComment_img"><!-- s9ymdb:4640 --><img width="776" height="619"  src="/uploads/xdebug5.png" alt="" /></div><div class="serendipity_imageComment_txt">Ein Testprojekt, dessen Files "lokal" liegen und daher nicht uploaded werden müssen. Wir könnten auch fish, webdav oder ftp verwenden, um Zeugs irgendwo auf einen entfernten Server zu schießen.</div></div>

<div class="serendipity_imageComment_center" style="width: 776px"><div class="serendipity_imageComment_img"><!-- s9ymdb:4641 --><img width="776" height="619"  src="/uploads/xdebug6.png" alt="" /></div><div class="serendipity_imageComment_txt">Hier bitten wir Quanta nun darum, das in public_html rumliegende probe.php doch bitte mit aufzusammeln...</div></div>

<div class="serendipity_imageComment_center" style="width: 776px"><div class="serendipity_imageComment_img"><!-- s9ymdb:4642 --><img width="776" height="619"  src="/uploads/xdebug7.png" alt="" /></div><div class="serendipity_imageComment_txt">Quanta kann aus irgendeinem Grunde den Apache nicht fragen, was die URL von /home/kris/public_html ist, also müssen wir das manuell ansagen.</div></div>

Wenn wir das getan haben, besteht die Hauptschwierigkeit darin, Quanta mitzuteilen, daß wir ein debugbares PHP-Script haben. Die Knöpfe dazu sind nämlich zunächst nicht sichtbar. Um ein debugbares Projekt zu erzeugen, muß das eben angelegte Projekt nun ein wenig umkonfiguriert werden: In Project -> Project Properties öffnen wir den gezeigten Dialog und sagen an, daß wir Debugger haben wollen.

<div class="serendipity_imageComment_center" style="width: 665px"><div class="serendipity_imageComment_img"><!-- s9ymdb:4643 --><img width="665" height="667"  src="/uploads/xdebug8.png" alt="" /></div><div class="serendipity_imageComment_txt">Wir verlangen einen DBGp-Debugger und wollen persistente Konfiguration für Break- und Watchpoints. Danach klicken wir beherzt auf Options...</div></div>

<div class="serendipity_imageComment_center" style="width: 575px"><div class="serendipity_imageComment_img"><!-- s9ymdb:4644 --><img width="575" height="448"  src="/uploads/xdebug9.png" alt="" /></div><div class="serendipity_imageComment_txt">... und stellen auch hier das Projekt noch einmal auf "Local". Außerdem müssen wir aus unerklärten Gründen auch hier die Request-URL noch einmal verbasteln. Diese magische URL verwendet Xdebug, um unser Script in Debugtrance zu hypnotisieren.

Weil wir auch den kcachegrind-Profiler verwenden wollen, konfigurieren wir da unten in der Profiling-Box auch noch passend.</div></div>

Der Lohn der Mühe sieht dann wie folgt aus:<div class="serendipity_imageComment_center" style="width: 806px"><div class="serendipity_imageComment_img"><!-- s9ymdb:4645 --><img width="806" height="610"  src="/uploads/xdebuga.png" alt="" /></div><div class="serendipity_imageComment_txt">Links Watchpoints (Zu definieren etwa durch Markieren und Rechtsklick auf Variablennamen). Unten der Callstack. Der rote Balken ist ein Breakpoint. Der beige Balken der aktuelle Instruction-Pointer. Die Debug-Toolbar liegt unterhalb der normalen Toolbar.</div></div>

Auf die in /var/tmp/cachegrind.out.* liegenden Dumpfiles kann man kcachegrind ansetzen und dann sehen, in welchen Programmteilen man mit seinem PHP Zeit vertrödelt.

Nicht vergessen: <a href="http://blog.koehntopp.de/archives/1946-PHP-4-das-Ende.html">Am 5.2.2008 läuft der Support für PHP 4 aus</a>. Upgraden lohnt sich!
