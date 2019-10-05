---
layout: post
status: publish
published: true
title: So you want to write a Shell script
author: isotopp
author_login: kris
author_email: kristian.koehntopp@gmail.com
wordpress_id: 2352
wordpress_url: http://blog.koehntopp.info/?p=2352
date: '2017-08-07 12:31:55 +0200'
date_gmt: '2017-08-07 10:31:55 +0200'
categories:
- Computer Science
- Erklärbär
tags: []
---
<p>So some people, companies even, have [guidelines that describe how to write shell scripts](https://google.github.io/styleguide/shell.xml), or even [unit tests for shell scripts](https://code.google.com/archive/p/shunit2/wikis/GeneralFaq.wiki), as if "UNIX Shell" was a programming language. That's wrong. "Modern Shells" are based on a language that has been written without a formal language specification. The source looked like [this](https://github.com/eunuchs/unix-archive/blob/master/PDP-11/Trees/2.11BSD/usr/src/bin/sh/main.c), because somebody didn't like C and wanted Algol, [abusing the preprocessor](https://github.com/eunuchs/unix-archive/blob/master/PDP-11/Trees/2.11BSD/usr/src/bin/sh/mac.h). The original functionality and language rules had to be reverse engineered from that source, and [original shell has a lot of weird rules and quirks](https://www.in-ulm.de/~mascheck/bourne/common.html):</p>
<p>> - You can use the caret, '^', as replacement for the pipe symbol, '|'.<br />
> - Check out the section »Consider a variable which has been picked up by the shell from the environment at startup. Modifying this variable creates a local copy.« in that document, especially the part where they explain this: _If you call a script directly from a bourne shell ("./script" without shebang), &nbsp;then the shell only forks off a subhell and reads in the script._ _The split between original and local copy of the variable is still present in the subshell.__But if the script is a real executable with #! magic, or if another sh is called, then fork and exec is used and only the original unmodified variable will be visible._</p>
<p> And it gets better if you go down the entirety of that particular document. If you think Unix Shell is a survivable programming environment, good luck, and please take your code with you while you leave.</p>
