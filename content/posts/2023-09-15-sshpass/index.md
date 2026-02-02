---
author: isotopp
title: "sshpass"
date: "2023-09-15T01:02:03Z"
feature-img: assets/img/background/schloss.jpg
toc: false
tags:
  - lang_de
  - security
  - hack
aliases:
  - /2023/09/15/sshpass.html
---

Heute lernte ich, daß das Utility `sshpass` existiert.
Ich habe das beim Lesen eines `.gitlab.ci.yml` Files gelernt.
Und ihr wundert Euch, wieso Sysadmins alle Schwarz tragen und an Whisky interessiert sind.

![](2023/09/sshpass-01.png)

Was ist `sshpass` werdet ihr jetzt fragen?

Und 
[RedHat](https://www.redhat.com/sysadmin/ssh-automation-sshpass)
erklärt:
> The sshpass utility is designed to run SSH using the keyboard-interactive password authentication mode, 
> but in a non-interactive way.

Warum der Artikel jetzt nach und vor diesem Satz dann erklärt,
wie man das *benutzt*, statt zu zeigen, warum man das *nie braucht* und *wie man es ersetzt* ist unklar.

Aber Homebrew ~~ist~~ war hilfreich:

```console
$ brew search sshpass
==> Formulae
sshs

If you meant "sshpass" specifically:
We won't add sshpass because it makes it too easy for novice SSH users to ruin SSH's security.
```

Das fasst es in etwa zusammen, was Homebrew nicht daran hinderte, sshpass wieder aus der Blacklist zu entfernen:
https://github.com/Homebrew/brew/pull/15979

Okay, einmal das ganze gitlab, alle `.gitlab-ci.yml`, alle Branches, nach `sshpass -p` suchen.

## Es wird schlimmer

Ich konnte das nicht auf sich beruhen lassen, obwohl es Dinge gibt, bei denen einem das Wissen mehr schadet als das Unwissen.

[Stackoverflow weiß](https://stackoverflow.com/questions/32255660/how-to-install-sshpass-on-mac):
> How to install sshpass on Mac?
> 
> Accepted Answer:
> ```
> curl -L https://raw.githubusercontent.com/<...>Formula/sshpass.rb > sshpass.rb && \
> brew install sshpass.rb && \
> rm sshpass.rb
> ```

Ich will hochgebeamt werden. Hier ist kein intelligentes Leben möglich.

## An die Zwischenrufer

> Aber ich brauche das doch, weil mein BMC keine Keys ...

- Github: [hpilo](https://github.com/seveas/python-hpilo)
- Github: [bmcbutler](https://github.com/bmc-toolbox/bmcbutler)
- Github: [dora](https://github.com/bmc-toolbox/dora)

Normal wird man die entsprechenden Zertifikate und Pubkeys beim Start der VM oder des Containers durch `cloud-init` installieren,
nachdem sie von der Controlplane des Clusters da hin transportiert worden sind.
Bei Bare Metal kann der Installserver die Bootstrap-Pubkeys als Teil der Customization des Installationsprozesses mit installieren.
