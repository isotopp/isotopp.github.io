---
layout: post
status: publish
published: true
title: When you commit to git, how long does it matter?
author-id: isotopp
feature-img: assets/img/background/rijksmuseum.jpg
date: '2017-03-20 09:41:57 +0100'
tags:
- computer
- lang_en
---
[![](/uploads/2017/03/git-git-768x473.png)](https://erikbern.com/2016/12/05/the-half-life-of-code.html)

[Commit to git](https://erikbern.com/2016/12/05/the-half-life-of-code.html)

Erik Bernhardsson has been running Big Data on Git repositories of various
kinds. He was trying to find out what the half-life of code is. That is,
when you commit to a repository, your code becomes part of a project, but
eventually other code will replace it and it will no longer be part of the
current version. How stable is the codebase, what is the half-life of code?
And why is it different in different projects?

> As a project evolves, does the new code just add on top of the old code?
> Or does it replace the old code slowly over time? In order to understand
> this, I built a little thing to analyze Git projects, with help from the
> formidable GitPython project. The idea is to go back in history historical
> and run a git blame […]
