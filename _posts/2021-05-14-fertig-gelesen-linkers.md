---
layout: post
title:  'Fertig gelesen: Linkers'
author-id: isotopp
feature-img: assets/img/background/book.jpg
date: 2021-05-14 13:06:36 +0200
tags:
- lang_en
- review
- media
---

Ian Lance Taylor is the author of a UUCP program that I have been using for a long time to connect to other USENET systems, long before I had access to the actual Internet.

UUCP queues up jobs for remote execution, dials other computers with a moden, exchanges the contents of the queued up work, and after disconnect executes the jobs. The jobs are mostly invocation of "rmail" and "rnews" programs for the exchange of mail and USENET news.

Taylors version of UUCP had large number of protocol and interface improvement that made it hugely superior, and that made working with "high speed modems" viable in the first place. It was the backbone of my network connectivity, 30 years ago.

Taylor also wrote "a book" about program linkers in 2007, in the form of a long series of blog posts. In it, he explains what happens to a program after the compiler emits an object file, and before the program actually starts to run. That is, he describes how to the object file, system libraries and runtime become one thing that actually is capable of starting up.

This is deeply nerdy content, and also quite interesting, because it is widely underdocumented. Taylor's series is key to making the obscure but vital topic better understandable.

This is not a book, but a series of blog posts. Fortunately, there is an [index page](https://lwn.net/Articles/276782/) made available by LWN. The parent article, on the Gold linker, is also [at LWN](https://lwn.net/Articles/274859/).
