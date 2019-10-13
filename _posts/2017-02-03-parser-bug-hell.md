---
layout: post
status: publish
published: true
title: Parser Bug Hell
author-id: isotopp
feature-img: assets/img/background/rijksmuseum.jpg
date: '2017-02-03 11:01:17 +0100'
tags:
- security
- lang_en
---
[![](/uploads/2017/02/Screen-Shot-2017-02-03-at-10.51.36-300x106.png)](http://www.cvedetails.com/vendor/4861/Wireshark.html)

Wireshark Bug Stats

So Debian just posted an 
[advisory for over 40 bugs in tcpdump](https://www.debian.org/security/2017/dsa-3775). 
tcpdump is a tool that collects traffic on the network, and then parses its
way down the stack from the Ethernet or other physical frames all the way
through the IP and TCP stacks to the application layers and the data formats
in there.

Parsing data is hard. Even the actual full blown applications normally
reading that data often have problems parsing their own data format, and
they are crashing if you throw malformed data at them. That's called
[Fuzzing](https://en.wikipedia.org/wiki/Fuzzing), and there is a bunch of
pretty amazing LLVM tools available to make this possible in a systematic
and automated way.

tcpdump is one application that attempts to parse the data formats of other
applications, while not actually having that data in a single file, but in a
number of arbitrarily segmented, overlapping or otherwise distorted frames
that are flying by at wire speed. It also does not have the actual parsers
or data readers of the original application, but usually has to write it's
own data parsers, taking shortcuts along the way. That is prone to failure,
and results plenty of exploitable bugs.

tcpdump is also not unique in this. The stats for
[tcpdump](https://www.cvedetails.com/vendor/6197/Tcpdump.html),
[ethereal](http://www.cvedetails.com/vendor/244/Ethereal-Group.html) and
[wireshark](http://www.cvedetails.com/vendor/4861/Wireshark.html) (which is
ethereal renamed) all are looking bad in exactly the same way. These are
Open Source tools.

Closed Source tools that perform legal interception are trying to solve the
same problem, and there is no reason to believe that their parsers or
general code quality is any better than this. The only reason you are not
finding them in these statistics is that their makers are kind of not very
openly communicating problems and bugfixes.

On the other hand, fuzzing packets on a link is probably a good way to get
rid of listeners, because it will most likely crash their tools just the way
it crashes tcpdump and others.
