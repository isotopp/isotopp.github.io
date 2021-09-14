---
layout: post
status: publish
published: true
title: Curlbash, and Desktop Containers
author-id: isotopp
feature-img: assets/img/background/rijksmuseum.jpg
date: '2017-04-13 10:05:43 +0200'
tags:
- security
- container
- lang_en
---
I was having two independent discussions recently, which started with some
traditional Unix person condemning software installing with curlbash (`curl
https://... | bash`), or even `curl | sudo bash`. 

I do not really think this to be much more dangerous than the installation
of random rpm or dpkg packages any more. Especially if those packages are
unsigned or the signing key gets installed just before the package. 

The threat model really became a different one in the last few years, and
the security mechanism have had to change as well. And they have, UIDs
becoming much less important. Desktop containers and Sandboxes have become
much more important, and segregation happens now at a much finer granularity
(the app level) instead of the user level. 

The two discusssions have been around the installation of sysdig 
(see [their article](https://sysdig.com/blog/friends-dont-let-friends-curl-bash/), 
which focuses on signed code and proxies injecting modifications), and
Mastodon (which uses node.js, which features one installation path using
`curl -sL https://deb.nodesource.com/setup\_7.x | sudo -E bash -`). 

Provided that you actually get the file that's on the remote server (i.e. no
proxy exists that modifies stuff), I fail to see the problem. You are not
very likely to go through the source and review it. Also, you are hopefully
installing this into a single-purpose virtual machine or container, so there
is nothing else inside the image anyway. It does not really matter, which
UID this is running as, because there is nothing else inside this universe
in the first place.

We have come, in a way, full circle and are back at MS-DOS, where there are
no users or permissions visible to the application, because it is utterly
alone in the world.

User IDs also do not matter much on personal devices, because these
typically have only one user. Being kris (1000) on my Laptop or my Cellphone
does not really contain or isolate anything, because there is only me and
the only files important are all mine - the files not owned by me come from
the operating system image and can be restored at any time. Yes, my files
are much more important and harder to replace than the system files.

## MacOS

In MacOS, we have a system that kind of solved the problem of a lone user
installing a lot of apps, all of which might to a certain extent be hostile
to each other or are trying to pull off things with me and my data. The
threat model is not "multiple users sharing a single device, and keeping
their stuff separate", but "many apps from different sources, and with
different levels of trustworthiness, make sure they do not make off with the
users data or another apps data unnoticed".

This is very different from Unix-Think and Unix is actually by default not
set up at all to handle this. MacOS attacks the problem by sandboxing Apps
from the App Store. Apps run in 

```console 
⌂ [:~/Library com.omnigroup.OmniGraffle7.MacAppStore]↥ $ pwd
/Users/kkoehntopp/Library/Containers/com.omnigroup.OmniGraffle7.MacAppStore
⌂ [:~/Library … com.omnigroup.OmniGraffle7.MacAppStore]↥ $ ls -1
Desktop
Documents
Downloads
Library
Movies
Music
Pictures
```

That is, you still have a single UID per potential user, but apps are
confined to a subdirectory and a bunch of system standard locations for
stuff. They can exit that through the file dialogs and other systems means
and access arbitrary locations in the system, but the user interaction
required here makes sure their activity is being screened and contextualized
by a human.

For the user, this is transparent and invisible, and requires no conscious
permissive actions. It is implied in the normal I/O dialog workflow. That's
genius, because it hides all the complexity that comes with other systems
such as AppArmor, let alone SELinux.

## Android

Android uses Unix UIDs, but differently than intended. In Android, you
always have a GUI, because a Command line without a GUI does make no sense
on touch devices. Multiple Users are possible, but user separation is not
via UID, it is via GUI.

Instead, Android assigns a UID to each app dynamically, and uses Linux
permissions _and_ SELinux on top of that to keep apps out of each others
data.

The "SD Card" area and permission is actually a limited file share facility
between apps, but that was not planned. Instead it has been but a side
effect of the fact that MS-DOS filesystems on SD-Cards do not enforce Unix
UIDs of different apps.

On top of that, Google has been learning clumsily and slowly to leverage
this to an advantage, with several false starts.

## User Story

Both systems allow users to install apps from all kinds of app makers
through a unified channel with limited review, and manage to keep data
per-app separated. So it is possible to run apps safely, even if the app is
somewhat hostile to other apps or the users data. The ideas behind that have
been picked up, and are being transformed slowly in the unix environment
using the desktop-container paradigm. 

Things like [Flatpak](http://flatpak.org/) are leveraging containers on the
desktop to do exactly what the MacOS sandbox does.

## Summary:

- If everything on your system is running as the same user, then "curl |sudo
  bash" and "curl | bash" are equivalent in terms of threat.
- If the user is not actually reviewing the source and build, then each apt-get,
  rpm and any curlbash are actually equivalent, because the amount of review
  is the same, and far too little.

What is instead necessary is a system that improves security in a way that
separates apps, not users, and that makes it possible to recover from the
accidental install and execution of a hostile or broken app. 

And that's what desktop containers like flatpak do, or intend to do. They
are obviously neither perfect nor finished. But they are actually addressing
a new and different threat model than the one Unix was built for, and that
is no longer reflecting the current world.
