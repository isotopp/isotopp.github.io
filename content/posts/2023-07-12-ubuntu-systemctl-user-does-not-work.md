---
author: isotopp
title: "Ubuntu: systemctl --user does not work"
date: 2023-07-12T01:02:03Z
feature-img: assets/img/background/rijksmuseum.jpg
toc: false
tags:
- lang_en
- linux
- devops
---

Memo to self:
I have a VPS with a legacy Ubuntu 20.04, and when creating a user to run a user-based service,
trying to use systemctl fails with the message:

```bash
$ systemctl --user status
Failed to connect to bus: No such file or directory
```

To solve this, multiple changes were necessary:

# Fixing the `systemd` problem

The service is supposed to run as the user `theservice`, from the directory `/home/theservice/therepo`,
and is to be controlled by a systemd instance for this user.
There was no such instance running.

## Missing packages

Several required packages were not installed (server image, minimal packages installed):

```bash
# apt install dbus-user-session libpam-systemd libpam-cgfs
```

## `loginctl` config not correct

Loginctl needs to be told what to do when the user is not logged in:

```bash
# loginctl enable-linger theservice
```

## Missing environment variables

Two environment variables were not defined properly:

```bash
$ cat ~/.bashrc 
# ~/.bashrc: executed by bash(1) for non-login shells.
# see /usr/share/doc/bash/examples/startup-files (in the package bash-doc)
# for examples

# THIS INSERTED vvv
export XDG_RUNTIME_DIR=/run/user/$(id -u)
export DBUS_SESSION_BUS_ADDRESS="unix:path=${XDG_RUNTIME_DIR}/bus"
# THIS INSERTED ^^^

# If not running interactively, don't do anything
case $- in
    *i*) ;;
      *) return;;
esac
...
```

**Note:** As you can see in the `case` statement and the comment before, the remainder of the `.bashrc` is
only run for interactive shells.
The variable definitions must appear before the `case` statement, as shown.

## `user@.service` not enabled and started

The user-based `systemd` component was not enabled and started.

```bash
# systemctl enable user@.service
# systemctl start user@1011.service    # the userid of the user I needed
```

# Defining the service

The service we want to run is a Python program in a virtual environment,
logging to stdout and stderr.
It needs to be started by `systemd` as the service user.

We check out the repo and create virtual environment:

```bash
# sudo -Hi theserviceuser
$ git checkout git@github.com:theuser/therepo.git
...
$ python3 -m venv venv
$ source venv/bin/activate
$ pip install -r requirements.txt
...
```

This will check out the source, create a `venv` and then activate it and install the requirements.

We can now create a service.
As the service user, run `systemctl --user edit --full theservice.service` and install

```systemd
# /home/theserviceuser/.config/systemd/user/theservice.service
[Unit]
Description=The Service
After=syslog.target network.target

[Service]
Type=simple
WorkingDirectory=/home/theserviceuser/therepo
ExecStart=/home/theserviceuser/therepo/venv/bin/python3 /home/theserviceuser/therepo/main.py
Restart=on-abort
EnvironmentFile=/home/theserviceuser/therepo/.env

[Install]
WantedBy=multi-user.target
```

By using the Python instance from the `venv`, we will automatically use stuff from the `venv`, no activation required.

We can now update all this with

```bash
$ systemctl --user stop theservice.service
$ git pull --rebase
$ systemctl --user start theservice.service
```

or a script that does the same.
