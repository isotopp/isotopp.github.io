---
author-id: isotopp
date: "2019-10-15T11:50:23Z"
feature-img: assets/img/background/rijksmuseum.jpg
tags:
- lang_en
- apple
- macos
title: Ignoring Catalina nags
---
Note to self: Ignoring the Catalina Nagscreens is done like this:

```console
$ sudo softwareupdate --ignore "macOS Catalina"
$ defaults write com.apple.systempreferences AttentionPrefBundleIDs 0 && killall Dock
```

And that should make MacOS ignore Catalina until further notice. Further
notice does look like this:

```console
$ /usr/sbin/softwareupdate --reset-ignored
```
