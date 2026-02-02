---
author: isotopp
title: "Systemd and docker -H fd://"
date: "2022-11-28T09:10:11Z"
feature-img: assets/img/background/rijksmuseum.jpg
tags:
- lang_en
- python
- devops
aliases:
  - /2022/11/28/systemd-and-docker-fd.html
---

Based on what I learned in
[Systemd Service and Socket Activation]({{< relref "2022-11-27-systemd-service-and-socket-activation.md" >}})
and
[Systemd Service and stdio]({{< relref "2022-11-28-systemd-service-and-stdio.md" >}}),
we can now have a look at Docker.

The code for `-H fd://`-Handling is [here](https://github.com/moby/moby/blob/41be7293f54f15dc04f024bf2b0f09e1a697208b/daemon/listeners/listeners_linux.go#L63-L107).
The file descriptors are coming from `activation.Listeners()`, and are in the `listeners` slice.
In our case, the part after the `fd://` is empty, so lines 83-85 are activated, and the incoming fd's are passed to the Docker proper.

```go {linenos=table,hl_lines=[10,"21-23"],linenostart=63}
func listenFD(addr string, tlsConfig *tls.Config) ([]net.Listener, error) {
	var (
		err       error
		listeners []net.Listener
	)
	// socket activation
	if tlsConfig != nil {
		listeners, err = activation.TLSListeners(tlsConfig)
	} else {
		listeners, err = activation.Listeners()
	}
	if err != nil {
		return nil, err
	}

	if len(listeners) == 0 {
		return nil, errors.New("no sockets found via socket activation: make sure the service was started by systemd")
	}

	// default to all fds just like unix:// and tcp://
	if addr == "" || addr == "*" {
		return listeners, nil
	}

	fdNum, err := strconv.Atoi(addr)
	if err != nil {
		return nil, errors.Errorf("failed to parse systemd fd address: should be a number: %v", addr)
	}
	fdOffset := fdNum - 3
	if len(listeners) < fdOffset+1 {
		return nil, errors.New("too few socket activated files passed in by systemd")
	}
	if listeners[fdOffset] == nil {
		return nil, errors.Errorf("failed to listen on systemd activated file: fd %d", fdOffset+3)
	}
	for i, ls := range listeners {
		if i == fdOffset || ls == nil {
			continue
		}
		if err := ls.Close(); err != nil {
			return nil, errors.Wrapf(err, "failed to close systemd activated file: fd %d", fdOffset+3)
		}
	}
	return []net.Listener{listeners[fdOffset]}, nil
}
```

# Summary

The question that started this Yak shaving session was: "How to expose the docker socket of a remote machine over the network?"
And this appears that the answer to this question is:

- take the original `docker.socket` configuration
- create an override and add a secondary listener socket for tcp://0.0.0.0:2375

So:

```console
# systemctl edit docker.socket
...
# systemctl cat docker.socket
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

# /etc/systemd/system/docker.socket.d/override.conf
[Socket]
ListenStream=
ListenStream=/run/docker.sock
ListenStream=2375
```

This clears the original `ListenStream` list, and then adds two entries back.

The first change addresses the error message

```console
ListenStream= references a path below legacy directory /var/run/,
updating /var/run/docker.sock tcp://0.0.0.0:2375 → /run/docker.sock tcp://0.0.0.0:2375;
please update the unit file accordingly.
```

The second one adds a listener to port `[::]:2375`.

And that will allow me to talk to the Docker server on my development host over the network.
