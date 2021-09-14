---
layout: post
status: publish
published: true
title: node.js idea of an inode is approximately broken
author-id: isotopp
feature-img: assets/img/background/rijksmuseum.jpg
date: '2017-04-19 08:35:21 +0200'
tags:
- computer
- erklaerbaer
- lang_en
---
[![](/uploads/2017/04/Screen-Shot-2017-04-19-at-09.21.21.png)](https://twitter.com/RichFelker/status/854421890135461890)

The [Tweet](https://twitter.com/RichFelker/status/854421890135461890) points
to the [bug report](https://github.com/nodejs/node/issues/12115). After the
facepalming there is still a lot to say about that.

## About the bug:

There is a system call
[stat(2)](http://man7.org/linux/man-pages/man2/stat.2.html) in Posix, which
returns a struct stat as a result. Part of that data structure is a field
`st_ino`, which contains the inode number of that file. That number is a
unique file identifier, a 64 bit bit pattern. Javascript does not have
integer types to represent that number, so node.js has been falsely
converting it to a float, which can hold 53 bits of precision.

So on certain file systems, 2048 different files will be munged together,
which is extremely bad. 

Possible solutions are obvious: Use a string or use two 32-bit numbers to
hold full precision values.

## About Javascript:

Javascript is a language used in browsers, and changing the specs of
Javascript is incredibly hard. Basically, you have to get everybody to
update their browsers in order to actually make progress. There are things
that do crypto with Javascript as a target language, and there are compilers
from proper programming languages to portable Javascript as a target. 

But still, 
[Javascript itself is poisonous](https://www.destroyallsoftware.com/talks/wat), 
and while that take on the language is humorous, this is a serious problem.

## About culture:

So we are getting a generation of developers now, which have been growing up
without hardware or state. They learned programming on AWS and take RDS for
granted, which means they have never actually seen hard(-ware related)
problems. They also learned programming with the Javascript framework of the
week, and think that real software can be written this way. The result is
not only the mess that s npm, but also an attempt at systems programming
resulting in constructs such as this.

I cannot for the life of me stand the coddly approach to teaching of Julia
Evans (check out her writeups at [her blog](https://jvns.ca/)), but
apparently what she does and how she does it is necessary and appropriate
for people growing up in a programming environment like this. Well, I'm ok
with that if it prevents mindsets and bugs like the one above.
