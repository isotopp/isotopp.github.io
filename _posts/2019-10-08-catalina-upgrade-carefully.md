---
layout: post
title:  'Catalina: Upgrade carefully.'
author-id: isotopp
feature-img: assets/img/background/rijksmuseum.jpg
date: 2019-10-08 09:20:08 +0200
tags:
- apple
- macos
- lang_en
---
Catalina is here. It fixes many things, among them iTunes. On the other
hand, it drops support for 32-Bit MacOS applications.

![](/uploads/catalina.png)

Consider the upgrade carefully.

```console
$ system_profiler SPApplicationsDataType
…
    Steam:

      Version: 1.5
      Obtained from: Identified Developer
      Last Modified: 23.08.16, 20:32
      Kind: Intel
      64-Bit (Intel): No
      Signed by: Developer ID Application: Valve Corporation, Developer ID Certification Authority, Apple Root CA
      Location: /Applications/Steam.app
…
```

Anything listed with `64-Bit (Intel): No` will stop working after the
upgrade. Check before you upgrade, and consider what you will be losing
access to if you perform the upgrade.

On my box:
- Apprentice Alf DeDRM Plugin for Calibre
- Civilization V
- CoverScout 3
- Google Music Manager
- Google Photos Backup
- GrandPerspective
- JD-GUI
- Kindle (1.23.1, locked from upgrades)
- Mathematica
- Microsoft Office
- SongGenie 2
- Steam
- TigerVNC
- UnRarX

Some of them are unimportant, other things are quite critical, some of them
can't be updated easily.

At this point, for me this is a hard pass, and a lot of work to be done.

