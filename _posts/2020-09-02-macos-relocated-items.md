---
layout: post
title:  'MacOS: Deleting Relocated Items'
author-id: isotopp
feature-img: assets/img/background/rijksmuseum.jpg
date: 2020-09-02 16:58:53 +0200
tags:
- lang_en
- apple
- macos
---
I had to upgrade my company issued MacBook pro to Catalina for fleet unity reasons. The upgrade left me with a folder `Relocated Items` in `/Users/Shared/Desktop` and a link to that prominently on my Desktop.

Deleting that folder moved it to trash. Trying to empty trash then failed. That is because in that folder was several levels deep a folder or link to `X11R6`.

Apple considers that file outdated, which is why it ended up in `Relocated Items`. It also considers this file protected as a system file, so you cannot delete it. 

Not in the GUI nor on the command line, not even as root. In order to delete it you have to boot to single user mode in Recovery and do it there from the command line.

Step by Step:

1. Boot to Recovery using Cmd-R. On company systems this is likely protected. In my case I had to select my user and enter a password.

2. In Recovery, start `Disk Utility`, select the Mac OS Data Partition (any partition on the system disk will do) and select mount to the right on the `Disk Utility` menu. After that all system disk partitions will be mounted and shown no longer greyed out in the Utility.

3. Leave the Utility with Cmd-Q, and from the menu at the top of the screen select Terminal.

4. In Terminal, `cd /Users/<yourusername>/.Trash`. A `ls` should show you `Relocated Items`.

5. Delete these using `rm -rf 'Relocated Items'`.

6. Reboot using the eponymous item from the Apple Menu.
