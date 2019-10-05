---
layout: post
status: publish
published: true
title: Signed pointers
author: isotopp
author_login: kris
author_email: kristian.koehntopp@gmail.com
wordpress_id: 1465
wordpress_url: http://blog.koehntopp.info/?p=1465
date: '2017-04-13 13:29:23 +0200'
date_gmt: '2017-04-13 12:29:23 +0200'
categories:
- Computer Science
- Hackerterrorcybercyber
tags: []
---
<p>So those real hackers [keep telling me](http://dilbert.com/strip/1995-06-24) that back then in the times of the LISP machine they had tagged pointers and stuff. Those pesky mobile Whizkids at Qualcomm could not let that stand, so they created [signed pointers for ARM 8.3](https://lwn.net/Articles/718888/). Two families of new instructions have been made, one for signing pointers, the other for checking the signature. How does that work? The [PDF](https://www.qualcomm.com/media/documents/files/whitepaper-pointer-authentication-on-armv8-3.pdf) at Qualcomm describes the details. Basically, when pushing a return address onto the stack on subroutine call, that pointer is authenticated with a PAC\*&nbsp;instruction, on return that pointer is checked with an AUT\* instruction. The actual RET will fail with an address violation if the pointer has been messed with. PAC\* and AUT\* are out of NOP space, so they can be executed as NOPs on older CPUs. [caption id="attachment\_1467" align="aligncenter" width="624"] ![](http://blog.koehntopp.info/wp-content/uploads/2017/04/pac-aut.png) PAC\* signs the return address, AUT\* checks it. On pre-8.3 CPUs, they decode as NOP instructions. RETing to an address that does not AUT is an illegal address exception.[/caption] A 64 bit pointer in an 40 bit cellphone processor is good for 24 bit signatures, but other partitions are possible depending on address space layout and size.</p>
