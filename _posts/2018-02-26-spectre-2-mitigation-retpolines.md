---
layout: post
status: publish
published: true
title: 'Spectre #2 Mitigation - Retpolines'
author-id: isotopp
feature-img: assets/img/background/rijksmuseum.jpg
date: '2018-02-26 15:02:37 +0100'
tags:
- security
- data center
- lang_en
---
Intel finally published a whitepaper about Spectre #2 Mitigation. The
[PDF](https://software.intel.com/sites/default/files/managed/1d/46/Retpoline-A-Branch-Target-Injection-Mitigation.pdf)
is also featured on 
[Hacker News](https://news.ycombinator.com/item?id=16423401). It's a technical
whitepaper, but you can see the footprints of lawyers all over the
language. For me, it basically says that, yes, Retpolines are indeed
incompatible with Controlflow Enforcement Technology (CET) that Intel
was planning for later CPUs
([PDF](https://software.intel.com/sites/default/files/managed/4d/2a/control-flow-enforcement-technology-preview.pdf),
[El Reg article](https://www.theregister.co.uk/2016/06/10/intel_control_flow_enforcement/)).

CET introduces a shadow stack for return addresses only, and will fail
your code into an exception if the normal stack return address and the
shadow stack address disagree. Trying to touch and manipulate the
shadow stack will also fail into an exception. That is, CET makes
touching a return address on the stack toxic by having in effect
separate argument and return address stacks, and your code explodes
every time you try to do something funny with return addresses. Which
is what Retpolines depend on. 

Intel also note that
Retpolines also require Return Stack Stuffing in order to work
properly, because otherwise RET will also speculate and the Retpoline
will not work as intended. They also note that external events can
interact with the Return Stack Buffer (RSB) and empty it and they
don't actually write but strongly imply that these external events are
not a thing you have control over, as these are 

> There are also a number of events that happen asynchronously from normal
> program execution that can result in an empty RSB. Software may use “RSB
> stuffing” sequences whenever these asynchronous events occur:
>
> 1. Interrupts/NMIs/traps/aborts/exceptions which increase call depth.
> 2. System Management Interrupts (SMI) (see BIOS/Firmware Interactions).
> 3. Host VMEXIT/VMRESUME/VMENTER.
> 4. Microcode update load (WRMSR 0x79) on another logical processor of the same core.

The hardware you run on can either have a Spectre vulnerability and require
Retpolines, or have CET and Hardware Spectre Mitigation, but not both. So
you generate code for either one or the other, and they suggest
instrumentation of the loader to patch all indirect jump callsites as
required.

That's not completely insane, as loaders already patch up jump instructions
at load time. 

They do note that virtual machines in clustered setups with life migration
may be at a disadvantage here, as this is a load-time thing and hence you
need to expose your worst CPU in a cluster as the virtual CPU to your VMs in
order for this to work with migration. That's already a requirement in
heterogenous clusters, but still annoying.

All in all, this is basically disappointing to underwhelming. 

The TL;DR is that Retpolines and CET are indeed incompatible, and ld.so is
called to the rescue to patch up code at load time for one or the other. The
ld.so thing is an interesting observation. It means that the code on disk
and the code in memory differ in one more way.

As these things accumulate, the actual on-disk machine instructions mutate
over time into a kind of virtual machine notation that on load is adjusted
more and more to the needs of the actual machine it's being executed on.
Maybe a thing such as a JVM and a JIT is not the worst thing that has
happened to us.
