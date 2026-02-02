---
author: isotopp
date: "2017-10-20T16:08:14Z"
feature-img: assets/img/background/schloss.jpg
status: publish
tags:
  - security
  - lang_en
title: ASLR
aliases:
  - /2017/10/20/aslr.html
---
```c
#define MH_PIE 0x200000 /* When this bit is set, the OS will load the main executable at a random address. Only used in MH_EXECUTE filetypes. */
```

If that flag is on, MacOS will enable
[ASLR](https://de.wikipedia.org/wiki/Address_Space_Layout_Randomization) and
the binary will have different load addresses for code, data, heap and stack
every time it is running.

```c
$ sudo otool -h '/Library/Application Support/TrendMicro/TmccMac/iCoreService_tmsm'
Mach header
     magic cputype cpusubtype  caps    filetype ncmds sizeofcmds      flags
0xfeedfacf 16777223          3 0x80            2    20        2656 0x00018085
```

Check the 'flags' for this. No 0x200000, no ASLR. Not here, and not on any
other binary with "TrendMicro" in the pathname. And that is why you can't
have nice things.
