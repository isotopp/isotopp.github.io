---
author: isotopp
title: "Systemd Service and Socket Activation"
date: "2022-11-27T06:07:08Z"
feature-img: assets/img/background/rijksmuseum.jpg
tags:
- lang_en
- python
- devops
aliases:
  - /2022/11/27/systemd-service-and-socket-activation.html
---

In today's Yak Shaving session I needed to understand how to expose the docker socket of a remote machine over the network.
You should not do that, it is totally insecure, but I needed to do that to test something.

# Socket Activation

I discovered that `dockerd` is running with `-H fd://`.

````console
# ps axuwww | grep docker[d]
root     1616732  0.5  0.1 2930892 52168 ?       Ssl  15:32   2:25 /usr/bin/dockerd -H fd:// --containerd=/run/containerd/containerd.sock
````

That is happening in the `docker.service` definition for Docker:

```console
# systemctl cat docker.service | egrep '(service$|ExecStart)'
# /lib/systemd/system/docker.service
After=network-online.target firewalld.service containerd.service
Wants=containerd.service
ExecStart=/usr/bin/dockerd -H fd:// --containerd=/run/containerd/containerd.sock
```

That is, `/lib/systemd/system/docker.service` defines activation through the `fd://` file descriptor.
That descriptor is in turn provided by the `docker.socket` unit, which looks like this:

```python
root@server:~# systemctl cat docker.socket
# /lib/systemd/system/docker.socket
[Unit]
Description=Docker Socket for the API

[Socket]
ListenStream=/var/run/docker.sock
SocketMode=0660
SocketUser=root
SocketGroup=docker

[Install]
WantedBy=sockets.target
```

Both units are in `/lib/systemd/system`, which means they are OS-provided and should not be directly edited.

# Overriding

I could override the service with `systemctl edit docker.service`, and provide a different `ExecStart`.
Since that is a list, I need to empty it first, and then put a new definition in.

```console
[Service]
ExecStart=
ExecStart=/usr/bin/dockerd
```

This starts docker without options, and I could define one or more sockets in `/etc/docker/daemon.json`.
It would also drop systemd socket activation, though.

That led me to the question "How does one actually write a daemon that cooperates with systemctl socket activation?"
and also to the question "Can I have socket activation listen to more than one port, for example a Unix Domain Socket and a TCP-Socket?"

# Writing a Python daemon with socket activation

Let's write a simple daemon:

```python
#! /usr/bin/env python3

from socketserver import TCPServer, StreamRequestHandler
import socket
import logging

class MyDaemon(StreamRequestHandler):
    def handle(self):
        logging.info(f"Connection from {self.client_address}.")
        self.data = self.rfile.readline().strip()
        self.data = self.data.decode("utf-8")
        response = str(self.data[::-1])
        logging.info(f"Data: {self.data} Response: {response}")
        self.wfile.write(response.encode("utf-8"))


class Server(TCPServer):
    def __init__(self, server_address, hnd):
        # call superclass, but bind_and_activate is done by systemd.
        # If we set that to True, it could run as a standalone program.
        TCPServer.__init__(self, server_address, hnd, bind_and_activate=False)
        # take socket passed on from systemd (3, first after stdin, stdout, stderr)
        self.socket = socket.fromfd(self.3, self.address_family, self.socket_type)


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    HOST, PORT = "127.0.0.1", 12345
    server = Server((HOST, PORT), Handler)

    server.serve_forever()
```

If we set `bind_and_activate=` to `True`, that thing would run from the command line as a standalone server.

```console
$ ./demoserver.py   # now telnet 127.0.0.1 12345 to test
```

Instead, we need to set this up with systemd.

# A service and a socket unit

We need to set up a service definition unit.
Since we chose a high port number (>1024), we can run it as a user without privileges.

Systemd is actually running a copy of itself for each logged-in user:

```console
$ ps axuwww | grep system[d] | grep user
kris      327983  0.1  0.0  20144 11948 ?        Ss   Nov06  31:11 /lib/systemd/systemd --user
gdm      2419957  0.1  0.0  18768 10884 ?        Ss   Nov21  13:03 /lib/systemd/systemd --user
```

So we define a `service` unit using `systemctl --user --full --force kris.service` and then do the same for a `socket` unit:

```console
$ systemctl --user cat kris.service
# /home/kris/.config/systemd/user/kris.service
[Unit]
Description=Kris Service
After=network.target kris.socket
Requires=kris.socket

[Service]
Type=simple
ExecStart=/usr/bin/python3 %h/Python/systemd-socketserver/demoserver.py
TimeoutStopSec=5

[Install]
WantedBy=default.target
```

Our service is declared as having a `Requires=` relationship to its socket.
And because relationships do not define ordering, we also put the sockets into the `After=` relationship.

The service is a simple service, so systemd will simply fork off the defined binary.
Ths service definition uses `%h`, which is replaced by the users home directory.
We also define a timeout.

Now the socket, on which we depend:

```console
$ systemctl --user cat kris.socket
# /home/kris/.config/systemd/user/kris.socket
[Unit]
Description=Kris Socket
PartOf=kris.service

[Socket]
ListenStream=127.0.0.1:12345

[Install]
WantedBy=default.target
```

The `PartOf=` makes sure the socket is started and stopped together with the server.
The `ListenStream=` is the port systemd will open, bind to and listen on.
The socket produced by systemd will them be handed off to us on FD 3.

# Starting the service

It is sufficient to work on `kris.service` to start and stop things, because of the relationships we defined between socket and service.

```console
$ systemctl --user show kris.service| grep kris
ExecStart=...
ExecStartEx=...
WorkingDirectory=!/home/kris
Id=kris.service
Names=kris.service
Requires=kris.socket basic.target app.slice
ConsistsOf=kris.socket
After=kris.socket basic.target network.target app.slice
TriggeredBy=kris.socket
FragmentPath=/home/kris/.config/systemd/user/kris.service
```

The `ConsistsOf=` here comes from the `PartOf=` defined in the socket.
After running `systemctl --user start kris.service` we will see the service running using `lsof`:

```console
$ lsof -i -n -P
COMMAND     PID USER   FD   TYPE     DEVICE SIZE/OFF NODE NAME
systemd  327983 kris   36u  IPv4 2390840115      0t0  TCP 127.0.0.1:12345 (LISTEN)
python3 1957657 kris    3u  IPv4 2390840115      0t0  TCP 127.0.0.1:12345 (LISTEN)
python3 1957657 kris    5u  IPv4 2390840115      0t0  TCP 127.0.0.1:12345 (LISTEN)
```

# Testing the service

We can now test:

```console
$ echo "I am a test" | netcat 127.0.0.1 12345; echo
tset a ma I
```

And the log shows:

```console
$ journalctl --user-unit kris.service| tail -5
Nov 27 23:58:48 server systemd[327983]: Started Kris Service.
Nov 27 23:59:59 server python3[1957657]: INFO:root:Connection from ('127.0.0.1', 57512).
Nov 27 23:59:59 server python3[1957657]: INFO:root:Data: I am a test Response: tset a ma I
Nov 28 00:00:05 server python3[1957657]: INFO:root:Connection from ('127.0.0.1', 57528).
Nov 28 00:00:05 server python3[1957657]: INFO:root:Data: I am a test Response: tset a ma I
```

# Listening on two ports

We can now change the socket unit:

```console
(systemd-socketserver) kris@server:~$ systemctl --user cat kris.socket
# /home/kris/.config/systemd/user/kris.socket
[Unit]
Description=Kris Socket
PartOf=kris.service

[Socket]
ListenStream=127.0.0.1:12345
ListenStream=127.0.0.1:23456

[Install]
WantedBy=default.target
```

When we restart the service, this is being reflected in the systemd running, but only partially in the service running:

```console
$ systemctl --user stop kris.service
$ systemctl --user start kris.service
$ lsof -i -n -P
COMMAND     PID USER   FD   TYPE     DEVICE SIZE/OFF NODE NAME
systemd  327983 kris   35u  IPv4 2391279244      0t0  TCP 127.0.0.1:12345 (LISTEN)
systemd  327983 kris   37u  IPv4 2391279245      0t0  TCP 127.0.0.1:23456 (LISTEN)
python3 1961235 kris    3u  IPv4 2391279244      0t0  TCP 127.0.0.1:12345 (LISTEN)
python3 1961235 kris    4u  IPv4 2391279245      0t0  TCP 127.0.0.1:23456 (LISTEN)
python3 1961235 kris    6u  IPv4 2391279244      0t0  TCP 127.0.0.1:12345 (LISTEN)
```

So we also need to adjust our binds (or, in the case of docker, the `daemon.json`).
