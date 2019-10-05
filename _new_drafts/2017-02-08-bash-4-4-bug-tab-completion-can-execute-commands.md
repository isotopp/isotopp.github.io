---
layout: post
status: publish
published: true
title: 'Bash 4.4 Bug: Tab completion can execute commands'
author: isotopp
author_login: kris
author_email: kristian.koehntopp@gmail.com
wordpress_id: 608
wordpress_url: http://blog.koehntopp.info/?p=608
date: '2017-02-08 12:49:46 +0100'
date_gmt: '2017-02-08 11:49:46 +0100'
categories:
- Hackerterrorcybercyber
tags: []
---
<p>[Jens Heyens and Ben Stock of the Uni Saarland have found a code execution bug](https://github.com/jheyens/bash_completion_vuln/blob/master/2017-01-17.bash_completion_report.pdf)&nbsp;(PDF) in Bash 4.4 and higher. </p>
<p>    $ touch ’”‘ touch HereBeDragons ‘’ $ rm \”\‘touch\ HereBeDragons\‘ ^C $ ls -lt insgesamt 0 −rw−r−−r−− 1 heyens heyens 0 17. Jan 16:03 HereBeDragons −rw−r−−r−− 1 heyens heyens 0 17. Jan 16:03 ’” ‘ touch HereBeDragons ‘ ’ {% endhighlight %} The bug has been introduced in commit [74b8cbb41398b4453d8ba04d0cdd1b25f9dcb9e3](http://git.savannah.gnu.org/cgit/bash.git/diff/bashline.c?h=devel&id=74b8cbb41398b4453d8ba04d0cdd1b25f9dcb9e3) on the devel branch of bash and made into 4.4-stable. It is present since May 2015.</p>
