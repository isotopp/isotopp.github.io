---
layout: post
title:  'Everything was a file, but we got better'
author-id: isotopp
feature-img: assets/img/background/rijksmuseum.jpg
date: 2019-11-14 11:42:07 +0100
tags:
- unix
- computer
- damals
- lang_en
---
I fell into the Twitters again. [@CarrickDB](https://twitter.com/carrickdb/status/1194842452361789441) joked about Unix,
Files and Directories:

[![](/uploads/everything-is-a-file.png)](https://twitter.com/carrickdb/status/1194842452361789441)

And that is a case of "Haha, only serious". Because directories
used to be files, and that was a bad time. Check out the V7 Unix
[mkdir](https://github.com/v7unix/v7unix/blob/master/v7/usr/src/cmd/mkdir.c#L49)
command. At this point in history we do not have a `mkdir(2)`
syscall, yet, so we need to construct the entire directory in
multiple steps.

- [`mknod(2)` an inode that has the `S_IFDIR` flag set](https://github.com/v7unix/v7unix/blob/master/v7/usr/src/cmd/mkdir.c#L49),
  even if that macro does not even exist yet.
- [manually link the entry for the current directory `.` into that](https://github.com/v7unix/v7unix/blob/master/v7/usr/src/cmd/mkdir.c#L57)
- [manually link the entry for the parent directory `..` into that](https://github.com/v7unix/v7unix/blob/master/v7/usr/src/cmd/mkdir.c#L64)

This fragile and broken: `mkdir` could be interrupted while
doing that or another program could try to race `mkdir` while it
is doing that. In both cases we get directories that are invalid
and dangerous to traverse, because they break crucial
assumptions users make about directories.

This is also before `readdir(2)` and friends, so programs like
`ls` [open directories like files](https://github.com/v7unix/v7unix/blob/master/v7/usr/src/cmd/ls.c#L304)
and then make assumptions about the format of dentries on disk.
Specifically, they assume a 16 bit inode number and then a
filename of 14 characters or less and a directory that is an array
of these entries. Unfortunately, time has not been kind to the
assumption of 65535 files or less per partition, and also we
require filenames that are longer than 14 bytes these days.

Finally have a look at the hot mess that the
[rmdir](https://github.com/v7unix/v7unix/blob/master/v7/usr/src/cmd/rmdir.c#L29)
command is. What could probably go wrong?

Well, [Jan Kraetzschmar](https://twitter.com/opheleon/status/1194941703632932865)
reminds us that this kind of non-atomic rmdir can also produce
structures in the filesystem that are disconnected from the main
tree starting at `/`. In that case you end up with orphaned, unreachable
inodes that still have a non-zero link count. `fsck` should be
able to find them and free them, but of course that would be a
disruptive operation. Making `mkdir` and `rmdir` system call avoids
all of these problems.

That's why all of this was fixed in 1984 or so, when BSD
FFS came around and we got long filenames, wider inodes,
`mkdir`, `rmdir` and `readdir` as syscalls and many other
improvements.

## What if really everything was a file?

Another decade later, around 1995 or so, we got Plan 9, not from
outer space, but from Bell Labs.

It not only brought us Unicode everywhere, but also an
exploration of 'What if really everything was a file?',
including other machines on the network and processes on our
machine. From that we get todays
[procfs](https://en.wikipedia.org/wiki/Plan_9_from_Bell_Labs#/proc)
in Linux (and in many other modern Unices).

Except that you can't `rm -rf /proc/1` to shut down the box.

## Things that still are not a file, and should be dead

I am not going to mention System V IPC here at all. Not shm, not
sem, and not msq. They are abominations that should never have
escaped the lab cages they have been conceived in.

There is `mmap`, and mmap is good. Or can be, as long as you do
not conflate in memory and on disk representations of data, and
understand the value of MVCC. But that is another story and
should be told another day.
