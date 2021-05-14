---
layout: post
title:  'Fertig gelesen: The Antivirus Hackers Handbook'
author-id: isotopp
feature-img: assets/img/background/book.jpg
date: 2021-05-14 14:04:24 +0200
tags:
- lang_en
- review
- media
- book
---

[The Antivirus Hackers Handbook](https://www.amazon.de/Antivirus-Hackers-Handbook-English-ebook/dp/B014MJ6AKS/) by [Jaxeon Koret](https://twitter.com/joxeankoret) and Elias Bachaalany is part book, part a research report, detailing the findings of Jaxeon Koret and Elias Bachaalany in how Antivirus programs work, try to protect themselves and can be attacked and exploited.

[![](/uploads/2021/05/avhh.jpg)](https://www.amazon.de/Antivirus-Hackers-Handbook-English-ebook/dp/B014MJ6AKS/)

*[The Antivirus Hackers Handbook](https://www.amazon.de/Antivirus-Hackers-Handbook-English-ebook/dp/B014MJ6AKS/)*

The book assumes that you have some basic knowledge how compilers produce programs, what assembler looks like and how to map that on program statements in the code you write, and have access to IDA Pro free edition, Ghidra, Hopper or some other reverse engineering and analysis tool. We are then guided through the authors journey of discovery, analyzing the cores and plugin systems of various Antivirus products, how they work, how they detect viruses, how they update themselves, and how they try to protect themselves.

Antivirus systems are terribly large and attractive targets when trying to exploit individual machines or even fleets of machines: They try to scan and understand all kinds of file formats, run analysis often in privileged mode and with system protections turned off, and they are usually installed uniformly on a large fleet of machines in corporates, as mandatory pieces of software. These days they also increasingly have cloud components they upload data to, well suited to mask exfiltration traffic. When trying to attack and subvert corporate targets, they are the ideal platform for an attacker.

And the authors take us on that journey, at a level of intricate detail, but also always keeping the larger goal in sight. After reading this book one is looking at corporate security software differently, questioning if it is actually making things more secure.

"[The Antivirus Hackers Handbook](https://www.amazon.de/Antivirus-Hackers-Handbook-English-ebook/dp/B014MJ6AKS/)", Jaxeon Koret and Elias Bachaalany, EUR 32.06
