---
author: isotopp
title: "Systemd Service and stdio"
date: "2022-11-28T06:07:08Z"
feature-img: assets/img/background/rijksmuseum.jpg
tags:
- lang_en
- python
- devops
aliases:
  - /2022/11/28/systemd-service-and-stdio.md.html
---

After yesterday's article, Arne Blankerts pointed me at 
[a note](https://edit.thephp.cc/s/3MqWPLAJW#)
showing how to install a program using stdio with systemd.

# Code and Unit files

The code:

```python
#! /usr/bin/env python3

import sys

if __name__ == "__main__":
    while True:
        line = input().strip()
        print(f"ECHO: {line}")
        if line == "QUIT":
            sys.exit(0)
```

The Socket Unit:

```console
$ systemctl --user cat kris2.socket
# /home/kris/.config/systemd/user/kris2.socket
[Unit]
Description=My second service
PartOf=kris2.service

[Socket]
ListenStream=127.0.0.1:12346
Accept=Yes

[Install]
WantedBy=sockets.target
```

And the Service Unit, which has to be a template:

```console
$ systemctl --user cat kris2@.service
# /home/kris/.config/systemd/user/kris2@.service
[Unit]
Description=My second Service
After=network.target kris2.socket
Requires=kris2.socket

[Service]
Type=simple
ExecStart=/usr/bin/python3 %h/Python/systemd-socketserver/echoserver.py
TimeoutStopSec=5
StandardInput=socket
StandardOutput=socket
StandardError=journal

[Install]
WantedBy=default.target
```

# A template Unit

A systemd template starts a new instance of the service for each incoming connection, because nothing in the code of the service is aware of being a network service.
Instead `stdin` and `stdout` are connected to the network by systemd, and `stderr` is being directed to `journald`.
The actual service just performs normal stdio.

Since connections are being accepted by systemd, and then fed into the service using normal stdio, a new instance of the service has to be started for each connection.
This is done with a service template, "`kris2.@service`".

# Running stuff

We can enable and start the socket:

```console
$ systemctl --user enable kris2.socket
Created symlink /home/kris/.config/systemd/user/sockets.target.wants/kris2.socket → /home/kris/.config/systemd/user/kris2.socket.

$ systemctl --user start kris2.socket

$ lsof -i -n -P
COMMAND    PID USER   FD   TYPE     DEVICE SIZE/OFF NODE NAME
systemd 327983 kris   28u  IPv4 2520788109      0t0  TCP 127.0.0.1:12346 (LISTEN)
```

Since the service is a template, it cannot be started.

```console
$ systemctl --user enable kris2@.service
Failed to enable unit: File default.target: Identifier removed
```

That is also not necessary, because systemd will do that for us on connect:

```console
$ telnet localhost 12346
Trying 127.0.0.1...
Connected to localhost.
Escape character is '^]'.
I am a test.
ECHO: I am a test.
QUIT
ECHO: QUIT
Connection closed by foreign host.
```

While connected, we can see the user systemd instance hanging off the PID 1 systemd, and the family of user-services hanging off the user systemd instance.

```console
systemd(1)─┬─ModemManager(2480)─┬─{ModemManager}(2565)
           …
           ├─systemd(327983)─┬─(sd-pam)(327984)
           │                 ├─pipewire(327990)───{pipewire}(328047)
           │                 ├─pipewire-media-(327991)───{pipewire-media-}(3280+
           │                 └─python3(3315905)
           …
```

# Multiple ports

We can now modify the socket Unit to provide more than one port.

```console
$ systemctl --user cat kris2.socket
# /home/kris/.config/systemd/user/kris2.socket
[Unit]
Description=My second service
PartOf=kris2.service

[Socket]
ListenStream=127.0.0.1:12346
ListenStream=127.0.0.1:12347
Accept=Yes

[Install]
WantedBy=sockets.target
```

And after this, the service will be available on both ports.
Since the service's code does not know anything about networking at all, it won't even notice.

# Summary

Using template systemd services, and redirecting `stdin` and `stdout`, we can create systemd Units that work with programs that are not aware of the fact that they are running connected to the network.
This simplifies the code for a service considerably, and also makes it much easier to test the service.

Template Units themselves cannot be enabled or started, which is initially unexpected, but makes a lot of sense once you start to think about it. 
