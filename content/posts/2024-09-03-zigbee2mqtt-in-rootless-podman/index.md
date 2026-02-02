---
author: isotopp
date: "2024-09-03T04:05:06Z"
feature-img: assets/img/background/rijksmuseum.jpg
tags:
- lang_en
- iot
- home automation
title: "zigbee2mqtt in rootless podman"
aliases:
  - /2024/09/03/zigbee2mqtt-in-rootless-podman.html
---

I have a Zigbee Controller from Dresden Electronics, a Conbee II.
On a previous machine, I had been running this in a docker container using `zigbee2mqtt`.
In parallel, `docker-compose` also maintained a `mosquitto`, an `influx 1.8` and a `grafana` 
plus Home Assistant in a Container.

For the new machine, I wanted to change the setup, with the biggest change being that I wanted to get rid of Docker.
This meant using Podman, and to make it interesting, using a rootless podman.

Rootless podman creates and uses containers as a regular user.
I am creating a different user for every project, so I have accounts for Navidrome, Restic, Unifi and Vaultwarden.
I am complementing them with an account `hass` for Home Assistant (the german noun *der Hass (m)* means *hate*).

# Create a user `hass`

```console
# useradd -m -c "Home Assistant Project User" hass
# loginctl enable-linger hass
# su - hass
```

I am dropping the existing volume `/export/hass` into this location
`/home/hass` to keep the history and config of everything,
and adjust a few pathnames.
This means my `z2m` config is now in `/home/hass/z2m`.

# Error: ENOENT: no such file or directory, lstat '/dev/ttyACM0' 

Trying to run this in podman-compose fails, even after pathname correction.
This is because the device `/dev/ttyACM0` is not accessible inside my container.

Importing it seems somewhat complicated.
A simple `devices: "/dev/ttyACM0:/dev/ttyACM0"` is not enough, because the `hass` user can't access the device.

A lot of tutorials exist, and they all hint at a setup that supposedly looks like this:

1. Add the user `hass` to the local group `dialout` and logout, login again.
   All `hass`-owned processes are now also having the supplemental GID `18(hass)`.
2. Make sure, the device `/dev/ttyACM0`, your Zigbee Controller, is permissioned `root:dialout` with `0660`.
   This is the default.
3. Modify the container definition for `z2m` to keep the supplemental group inside the container.

```yaml
  z2m:
    image: "koenkk/zigbee2mqtt"
    container_name: "z2m"
    hostname: "z2m"
    group-add:
      - "keep-groups"
    devices:
      - "/dev/ttyACM0:/dev/ttyACM0"
    volumes:
      - "/home/hass/z2m:/app/data"
      - "/run/udev:/run/udev:ro"
      - "/etc/localtime:/etc/localtime:ro"
    ports:
      - 8082:8080
    depends_on:
      - "mosquitto"
    restart: "unless-stopped"
    logging:
      driver: "json-file"
      options:
        max-size: "200k"
        max-file: "5"
```

Variations of that exist.
They all aim to make the supplemental group available inside the container, and give the container access to the Device.

All these attempts failed for me.

# Not using supplemental groups

My approach differs.

I want a device `/dev/ttyHASS0` that has the right device numbers and permissions, owned by `hass:hass`.
Making that device and then importing it into the container should suffice.
I should not have to do the supplemental group dance in the first place.

## Create a new device node owned by `hass`

I created a script `/root/bin/create_ttyhass.sh`.
This needed to be a script, chained commands inside an `udev` rule did not work.

```console
# ls -l /dev/ttyACM0
crw-rw---- 1 root dialout 166, 0 Sep  3 11:08 /dev/ttyACM0

# cat /root/bin/create_ttyhass.sh
#! /bin/bash --

if [ ! -e /dev/ttyHASS0 ]; then
    /bin/mknod /dev/ttyHASS0 c 166 0
    /bin/chown hass:hass /dev/ttyHASS0
    /bin/chmod 0660 /dev/ttyHASS0
fi
# ls -l /root/bin/create_ttyhass.sh
-rwxr-xr-x 1 root root 162 Sep  3 10:42 /root/bin/create_ttyhass.sh
```

## Create a device rule that triggers the script

```console
# lsusb | grep -i dresd
Bus 001 Device 077: ID 1cf1:0030 Dresden Elektronik ZigBee gateway [ConBee II]

# cat /etc/udev/rules.d/99-usb-dresden-electronics.rules
SUBSYSTEM=="tty", ATTRS{idVendor}=="1cf1", ATTRS{idProduct}=="0030", ATTRS{serial}=="DE2197315", RUN+="/root/bin/create_ttyhass.sh"

# udevadm control --reload-rules; sleep 3; udevadm trigger
# ls -l /dev/tty[A-Z]*
crw-rw---- 1 root dialout 166,  0 Sep  3 11:08 /dev/ttyACM0
crw-rw---- 1 hass hass    166,  0 Sep  3 11:44 /dev/ttyHASS0
crw-rw---- 1 root dialout   4, 64 Sep  3 10:43 /dev/ttyS0
crw-rw---- 1 root dialout   4, 65 Sep  3 10:43 /dev/ttyS1
crw-rw---- 1 root dialout   4, 66 Sep  3 10:43 /dev/ttyS2
crw-rw---- 1 root dialout   4, 67 Sep  3 10:43 /dev/ttyS3
```

`udev` is slow, the `sleep` is actually helpful.
As we can see, a `/dev/ttyHASS0` owned by `hass:hass` with proper permissions now exists.

## Adjusting `configuration.yaml`

I then changed `~hass/z2m/configuration.yaml` to match.

```yaml
homeassistant:
  discovery_topic: homeassistant
permit_join: true
mqtt:
  base_topic: zigbee2mqtt
  server: mqtt://mosquitto/
serial:
  port: /dev/ttyHASS0
  adapter: deconz
frontend:
  port: 8080
devices:
...
```

The `serial: adapter: deconz` thing was actually necessary for this to work with a Conbee II.
Otherwise the script dies with an obscure error message.
What actually happens is that `z2m` tries to push a firmware onto the device and fails, then dies.
The `deconz` declaration prevents that.

My setup now runs flawlessly without privileges,
but also without any supplemental group dances.

## The working rootless `podman-compose.yaml`

This is the `z2m` section that actually makes it work, using the `udev` entry from above.

```yaml
  z2m:
    image: "koenkk/zigbee2mqtt"
    container_name: "z2m"
    hostname: "z2m"
    user: 0:0
    devices:
      - "/dev/ttyHASS0:/dev/ttyHASS0"
    volumes:
      - "/home/hass/z2m:/app/data"
      - "/run/udev:/run/udev:ro"
      - "/etc/localtime:/etc/localtime:ro"
    ports:
      - 8082:8080
    depends_on:
      - "mosquitto"
    restart: "unless-stopped"
    logging:
      driver: "json-file"
      options:
        max-size: "200k"
        max-file: "5"
```

## This is how Unix works

In Unix, a device is a `c` (character) or `b` (block) special file.
A character special file does not use the file system buffer cache and can do only blocked I/O.
A block special file does use the file system buffer cache and can do arbitrary character I/O.

The actual driver is specified by the major and minor device numbers, here `166:0`.
It does not matter where the device file is, having it in `/dev` is just a convention.
It does not matter what the device name is, or if it is the only device file for that driver.

In my case,
making a second device entry with the appropriate permissions completely removed the need for any supplemental group ids.
This greatly simplifies the problem that `podman-compose` has to solve.
