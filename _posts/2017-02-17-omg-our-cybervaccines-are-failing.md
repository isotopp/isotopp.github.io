---
layout: post
status: publish
published: true
title: OMG, our cybervaccines are failing
author-id: isotopp
feature-img: assets/img/background/rijksmuseum.jpg
date: '2017-02-17 15:37:50 +0100'
tags:
- security
- performance
- lang_en
---
[Dark Reading](http://www.darkreading.com/threat-intelligence/-what-to-do-when-all-malware-is-zero-day/a/d-id/1328155)
is scared: All new malware is "zero-day", for an interesting and wrong
definition of zero-day, because then the article reads much more impressive.

The actual definition of a Zero Day is a previously unknown exploit that is
being used by some party to compromise a machine. In the article, the term
is used differently, meaning a file that is a known malware, but has changed
itself so that it has a checksum that is not in currently distributed
signature catalogs of known malware. That is of course neither correct, nor
new.

Mutation engines, for example for viruses, are an old hat. We have known
about them for more than a decade, almost two. The better ones take x86
machine code, auto-dissect it into basic blocks and then re-link these to a
semantically equivalent program in a completely different, random order.
They may also re-compile certain assembly instructions in these basic blocks
to other, semantically equivalent assembly instructions that have different
byte codes: There are many ways to clear a register or to load a value from
memory, after all.

> In today's detection industry, one should think of hashing as more of a
> shortcut to locate the easy stuff, or rule out known good files
> (whitelisting).

That's more like the state of the detection reality from 15 years ago. On
the other hand, threat detection software is getting out of hand. A Macbook
I have had access to can unzip a piece of software with some 7000 files just
fine in under 3 seconds to its internal SSD. The same Macbook with a
[Trendmicro AV solution](http://docs.trendmicro.com/en-us/enterprise/trend-micro-security-(for-mac)-21/agentinstall_ch_intro/agent_install_method.aspx)
installed takes 11 seconds to do the same, and 18 seconds if it is done in a
directory that is not excluded from scan in the TM config file. Add
[FireEye](https://www.fireeye.com/) on top of that and the same operation is
now at 27 seconds execution time. The laptop is now secure mostly because
nobody can do anything with it any more. In
[many](https://www.heise.de/newsticker/meldung/Sicherheitsforscher-an-AV-Hersteller-Finger-weg-von-HTTPS-3620159.html)
[other](https://arstechnica.com/information-technology/2017/01/antivirus-is-bad/)
[articles](https://www.theregister.co.uk/2016/03/31/trend_micro_patches_command_execution_flaw/),
[these](https://googleprojectzero.blogspot.nl/2015/09/kaspersky-mo-unpackers-mo-problems.html)
[so](https://bugs.chromium.org/p/project-zero/issues/detail?id=978)
[called](http://www.forbes.com/sites/thomasbrewster/2017/01/25/trend-micro-security-exposed-200-flaws-hacked/#181469e55d68)
security solutions have been shown to be actually contributing to the
problem.
