---
layout: post
status: publish
published: true
title: beep, patch and ed
author-id: isotopp
feature-img: assets/img/background/rijksmuseum.jpg
tags:
- erklaerbaer
- security
- lang_en
---
So a few days ago, somebody found an exploit in beep - now
[CVE-2018-0492](https://nvd.nist.gov/vuln/detail/CVE-2018-0492).

beep is a program that is part of Debian (and Ubuntu) to have the PC speaker
multiple times, at different frequencies, with different pauses and beep
lengths. That works just fine. It's also SUID root. There is zero code in it
that deals with the fact that it may run privileged. 

The author confidently writes:

> Some users will encounter a situation where beep dies with a complaint
> from ioctl(). The reason for this, as Peter Tirsek was nice enough to
> point out to me, stems from how the kernel handles beep's attempt to poke
> at (for non-programmers: ioctl is a sort of catch-all function that lets
> you poke at things that have no other predefined poking-at mechanism) the
> tty, which is how it beeps. The short story is, the kernel checks that
> either:
>
> - you are the superuser
> - you own the current tty
>
> What this means is that root can always make beep work (to the best of my
> knowledge!), and that any local user can make beep work, BUT a non-root
> remote user cannot use beep in it's natural state. 
> 
> What's worse, an xterm, or other x-session counts, as far as the kernel is
> concerned, as 'remote', so beep won't work from a non-privileged xterm
> either. I had originally chalked this up to a bug, but there's actually
> nothing I can do about it, and it really is a Good Thing that the kernel
> does things this way.
>
> There is also a solution. By default beep is not installed with the suid
> bit set, because that would just be zany. On the other hand, if you do
> make it suid root, all your problems with beep bailing on ioctl calls will
> magically vanish, which is pleasant, and the only reason not to is that
> any suid program is a potential security hole.
>
> Conveniently, beep is very short, so auditing it is pretty
> straightforward. Decide for yourself, of course, but it looks safe to me -
> there's only one buffer and fgets doesn't let it overflow, there's only
> one file opening, and while there is a potential race condition there,
> it's with /dev/console. If someone can exploit this race by replacing
> /dev/console, you've got bigger problems. :)

So here is how you race this: [beepbop](https://gist.github.com/fkt/5f8f9560ef54e11ff7df8bec09dc8f9a) 

Which is bad, because Ubuntu and Debian both install beep SUID root, by
default. You can check with "dpkg-reconfigure -plow beep".

![](/uploads/2018/04/dpkg-reconfigure-beep.png)

Debian installs beep SUID root by default, "dpkg-reconfigure -plow
beep"

Somebody also created a fun website for the beep problem, complete with
logo and name: [Holey Beep](https://holeybeep.ninja/).

![](/uploads/2018/04/holey-beep.png)

[Holey Beep](https://holeybeep.ninja/): The site, which is done very tongue
in cheek, also contained a [patch](https://holeybeep.ninja/beep.patch) for
the problem, advertising it like this:

![](/uploads/2018/04/patch-exploit.png)

So why would your computer beep when it applies a patch? 
That's another fun thing. The patch contains this hunk:

```diff
--- /dev/null	2018-13-37 13:37:37.000000000 +0100
+++ b/beep.c	2018-13-37 13:38:38.000000000 +0100
1337a
1,112d
!id>~/pwn.lol;beep # 13-21 12:53:21.000000000 +0100
.
```

and that looks very much like an ed-script. In fact, until recently that is
exactly what patch did: popen a copy of ed and feed it. The line "id \>
~/pwn.lol; beep" will hence be run, create a file pwn.lol in $HOME with the
current user id, and then execute beep. That's the promised beep you hear.

Of course code execution by a thing you expect to handle data is a problem,
and that is now
[CVE-2018-1000156](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2018-1000156).

It's fixed by writing the ed code to a tmp file while filtering the commands
fed to ed, and then feeding the filtered input into ed.
