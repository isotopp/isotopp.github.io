---
layout: post
status: publish
published: true
title: Illegal and undocumented instructions
author: isotopp
author_login: kris
author_email: kristian.koehntopp@gmail.com
wordpress_id: 2282
wordpress_url: http://blog.koehntopp.info/?p=2282
date: '2017-07-28 13:30:26 +0200'
date_gmt: '2017-07-28 11:30:26 +0200'
categories:
- Computer Science
- Hackerterrorcybercyber
tags: []
---
<p>[![](http://blog.koehntopp.info/wp-content/uploads/2017/07/6502-die-275x300.jpg)](http://www.pagetable.com/?p=39) Illegal and undocumented instructions are not a new thing. The Commodore 64 CPU, a 6502 with a few additional I/O lines, was known to have them, and since on current CPUs we can completely VLSI simulate a 6502 in Javascript we also understand where they come from. [Pagetable.com has a wonderful article on this](http://www.pagetable.com/?p=39). So how about current CPUs? Modern CPUs are vastly bigger and more complicated than a 6502, and they are also set up very differently. So simulation is not taking us anywhere, but we can fuzz. [Sandsifter](https://github.com/xoreaxeaxeax/sandsifter) is such a CPU fuzzer: <!--more-->it generates every conceivable instruction byte combination and then tries to observe what happens. </p>
<p>> Sandsifter has uncovered secret processor instructions from every major vendor; ubiquitous software bugs in disassemblers, assemblers, and emulators; flaws in enterprise hypervisors; and both benign and security-critical hardware bugs in x86 chips.</p>
<p> The findings have been summarized in a whitepaper ([PDF](https://github.com/xoreaxeaxeax/sandsifter/blob/master/references/domas_breaking_the_x86_isa_wp.pdf)), which also describes how to effectively search the instruction space of a CPU that has variable length instructions from 1 to 15 bytes in length. A crafty way of using page faults to determine the length of privileged instructions while running unprivileges is shown. The strategy implemented reduces the search space from some 10E36 instructions down to about 100 million, which is a manageable size on modern CPUs. Known instructions (things that some reference disassembler knows and correctly predicts) are eliminated, the rest is interesting and deserves attention.</p>
