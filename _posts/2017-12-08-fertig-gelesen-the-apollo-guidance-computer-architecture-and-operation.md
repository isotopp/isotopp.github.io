---
layout: post
status: publish
published: true
title: 'Fertig gelesen: The Apollo Guidance Computer: Architecture and Operation'
author-id: isotopp
feature-img: assets/img/background/book.jpg
date: '2017-12-08 06:11:56 +0100'
tags:
- review
- book
- media
- lang_en
---
[![](/uploads/2017/12/apollo-guidance-computer.jpg)](https://www.amazon.de/Apollo-Guidance-Computer-Architecture-Operation/dp/1441908765)

Frank O'Brien explains an outstanding piece of engineering: The
Apollo Guidance Computer (AGC) was the computer that controlled
the thrusters and navigation on the Apollo Command Module, and a
second instance, on the Lunar Module. It's a 32kg box with core
memory and core rope ROM, a 16 bit discrete CPU (15 data bits
and parity) running at 1 MHz effective, and some very special
hardware behind its I/O ports.

Memory was 2k words of writeable core memory, and some 36k of
ROM. The processor architecture is stackless, which complicates
many things, and despite being designed in 1966, already has
multiplication and division machine instructions. Addresses are
effectively 12 bit, so sophisticated bank switching to extend
the address space is needed, writeable and read-only memory are
banked separately. Some interesting interaction with interrupt
processing and bank switching exists.

There exists a very basic multitasking system, which at the same
time is made simpler and more complicated by the stackless
architecture. On top of the multitasking executive sits the
interpreter, a virtual machine that was much more comfortable
than the actual hardware and had a stack and index-registers, as
well as trigonometric math functions. Navigational code ran on
the interpreter, basic hardware control (thrusters, sextant,
inertial control system and anything timer related) ran on the
executive.

The book gives a guided tour into a hardware design over fifty
years old, which itself was already foreshadowing and in some
way surpassing the more modern integrated chip CPUs of seventies
home computers. It also demonstrates a number of creative and
interesting ideas of how to achieve remarkable things with very
little hardware.

"The Apollo Guidance Computer: Architecture and Operation", Frank
O'Brien, EUR 30.71, (purchased as Kindle edition,
no longer available as eBook)

[Paperback](https://www.amazon.de/Apollo-Guidance-Computer-Architecture-Operation/dp/1441908765)
