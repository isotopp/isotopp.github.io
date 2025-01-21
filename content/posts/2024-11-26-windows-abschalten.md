---
author: isotopp
date: "2024-11-26T04:05:06Z"
feature-img: assets/img/background/rijksmuseum.jpg
toc: true
tags:
  - lang_de
  - windows
  - devops
title: "Windows abschalten"
---

# Keks

# An

Ich kann meinen Windows-Rechner anschalten.
Also ohne hin zu gehen:

```console
$ cat bin/wake-steam
#! /bin/sh

wakeonlan 70:8b:cd:4f:4d:5e
```
und dann geht er an, loggt sich ein, startet Steam und ich kann mich von einem richtigen Computer aus mit Stream verbinden.

# Aus

Ich will den Spielerechner auch abschalten.
Ich könnte warten.
Dann geht er nach 30 Minuten idle aus. 
Aber das sind 30 Minuten 80 Watt für nix.

Man kann einem Windows auf der Kommandozeile sagen, daß es ritellen Selbstmord begehen soll:
[Shutdown Command](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/shutdown)

```
C:\Users\Admin> shutdown /s /f /t 0"
```

Ich kann also OpenSSH auf dem Windows installieren, mich remote auf der Kiste anmelden und das Kommando ausführen.

Oder gleich ganz remote:

```console
$ ssh Admin@rtx.local "shutdown /s /f /t 0"
Password:
```

Das Paßwort stört.

# Passwordless `ssh` for `Admininstrators`

**HINWEIS:** Die folgenden Instruktionen sind für Windows 11. In Windows 10 ist das nicht so.

Macht ja nix, ich kann ja meinen Key installieren:
[Key-based authentication in OpenSSH for Windows](https://learn.microsoft.com/en-us/windows-server/administration/openssh/openssh_keymanagement)

Für Standard-User:
> The contents of your public key (`\.ssh\id_ecdsa.pub`)
> needs to be placed on the server into a text file called `authorized_keys` in `C:\Users\username\.ssh\`.

Aber: Das funktioniert nicht, wenn der User Mitglied in der `Administrators` Group ist.
Dann ist es so:

> The contents of your public key (`\.ssh\id_ecdsa.pub`)
> needs to be placed on the server into a text file called `administrators_authorized_keys` in `C:\ProgramData\ssh\`.

Beachte, dass das nicht per User ist, sondern Shared für alle User, die in `Administrators` sind.

Nun gut, ist ja eine Personal Workstation, gibt also nur einen User und der ist immer Administrator, also muß das immer nach da und nie nach `%HOME%\.ssh`.

```console
# Get the public key file generated previously on your client
$authorizedKey = Get-Content -Path $env:USERPROFILE\.ssh\id_ecdsa.pub

# Generate the PowerShell to be run remote that will copy the public key file generated previously on your client to the authorized_keys file on your server
$remotePowershell = "powershell Add-Content -Force -Path $env:ProgramData\ssh\administrators_authorized_keys -Value '''$authorizedKey''';icacls.exe ""$env:ProgramData\ssh\administrators_authorized_keys"" /inheritance:r /grant ""Administrators:F"" /grant ""SYSTEM:F"""

# Connect to your server and run the PowerShell using the $remotePowerShell variable
ssh username@domain1@contoso.com $remotePowershell
```

# Localization

Und dann, damit alle, alles zerbricht:

```console
For non-English localized versions of the operating system, the script will need to be modified to reflect group names accordingly. 
```

Mein Windows ist English, also geht es, aber die armen Würste, die Windows scripten müssen.

Aber nein:

```console
$remotePowershell = "powershell Add-Content -Force -Path $env:ProgramData\ssh\administrators_authorized_keys -Value '''$authorizedKey''';icacls.exe ""$env:ProgramData\ssh\administrators_authorized_keys"" /inheritance:r /grant ""*S-1-5-32-544:F"" /grant ""SYSTEM:F"""
```

Und bei Microsoft wundern sich hochbezahlte Marketingmenschen wieso Linux die Welt erobert hat.

# Andere Methoden

- [Samba: NET RPC SHUTDOWN -f -I 192.168.0.147 -U user%password](https://superuser.com/questions/1746456/windows-11-net-rpc-shutdown)
  File and Printer Sharing must be enabled in `Settings > Network & Internet > Status > Network and Sharing Centre > Change advanced sharing settings`.
  The firewall must allow File and Printer Sharing through in `Start > Windows Defender Firewall with Advanced Security > Inbound Rules`. All of them.
- [SleepOnLAN](https://github.com/brann0n/SleepOnLan)
