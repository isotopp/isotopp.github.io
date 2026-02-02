---
author: isotopp
title: "MacOS, vim, git and exit..."
date: "2023-08-17T01:02:03Z"
feature-img: assets/img/background/rijksmuseum.jpg
toc: false
tags:
- lang_en
- apple
- unix
aliases:
  - /2023/08/17/macos-vim-git-and-exit.md.html
---

On `git commit`, `git` invokes an editor (by default: `vi`) and allows you to edit a commit message.
If the editor exits with status code 0, the commit message is accepted and used.
If the editor exists with status code >0, this is an error and the commit is aborted. 
The commit message is lost.

On MacOS, calling `/usr/bin/vi`, the editor shipped with the OS, starts vim 9.0.1424 in vi mode.
In this mode, if you enter an illegal editor command such as `:W`, the editor will exit with status 1.
This will happen even when you enter a legal editor command afterwards.
So
```console
:W keks
:w keks
:q
```
will
```console
kk:~ kris$ vi
kk:~ kris$ echo $?
1
```
This does not happen if the same editor is called as `vim`.
This does not happen on Ubuntu 22.04, which as vim 8.2.4919 installed – it will exit 0 as `vi` or `vim`.
This suggests that this behavior of vim 9, when called as "vi" in compatibility mode, is an "improvement" that has been added on purpose.
I wonder if that is really the case.

In `vim`, the command `:<status>cq` to force an exit status.
```console
:1cq
kk:~ kris $ echo $?
1
```
You can also `:0cq` to force a zero. 
This also works in compatibility mode.
You can, of course, also
```console
$ git config --global core.editor "vim"
```
