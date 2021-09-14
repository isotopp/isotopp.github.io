---
layout: post
title:  'My home sensor network'
author-id: isotopp
feature-img: assets/img/background/rijksmuseum.jpg
date: 2020-11-15 14:28:09 +0100
tags:
- lang_en
- iot
- home automation
---
I have been asked to document my home sensor network. Being married to a person with a background in web security sets boundary conditions:

1. No cloud. We are running all services locally.
2. No control, only metrics.

I am collecting data from a number of plugs with power meters over Wifi, using the MQTT protocol. I am also collecting data from a number of temperature sensors over Zigbee, and convert to MQTT. The MQTT data is ingested into Influx, and then read and plotted in Grafana. All of this is dockered and runs locally on an Ubuntu server.

## What happened so far

- [Plugs with Wifi]({% link _posts/2020-05-12-plugs-with-wifi.md %}): In which I am asking what kind of power plug to use to collect usage data.
- [Gosund and Tasmota]({% link _posts/2020-05-20-gosund-and-tasmota.md %}): In which I describe how to convert Gosund SP 111 plugs to Tasmota.
- [Air Quality Sensors]({% link _posts/2020-05-25-air-quality-sensors.md %}): In which I ask for Air Quality sensors, specifically with CO2 level metrics.

## The hardware

### Server

I have a rather old server machine at home that acts as a file server and docker host.

```console
# lscpu  | egrep '^Model name|^CPU\(s\):'
CPU(s):                          8
Model name:                      Intel(R) Core(TM) i7-3770 CPU @ 3.40GHz
# free -m
              total        used        free      shared  buff/cache   available
Mem:          32061       16697         261          32       15102       15516
Swap:         32767         881       31886
# vgs
  VG     #PV #LV #SN Attr   VSize   VFree
  data     2  13   0 wz--n-   7.28t   3.48t
  hdd      1   5   0 wz--n-   9.08t   5.00g
  system   1   4   0 wz--n- 466.94g 274.94g
# cat /etc/lsb-release
DISTRIB_ID=Ubuntu
DISTRIB_RELEASE=20.04
DISTRIB_CODENAME=focal
DISTRIB_DESCRIPTION="Ubuntu 20.04.1 LTS"
```

### Gateway

This machine is hosting a [ConBee from Dresden Elektronik](https://www.amazon.de/gp/product/B07PZ7ZHG5):

```console
# lsusb | grep -i Dresden
Bus 002 Device 084: ID 1cf1:0030 Dresden Elektronik
# ls -l /dev/ttyACM0
crw-rw---- 1 root dialout 166, 0 Nov 15 11:51 /dev/ttyACM0
```

The instructions say you should be connecting the conbee to the device using a USB cable, to keep it away from the device HF. This will improve the reach of the antenna supposedly a lot.

![](/uploads/2020/11/iot-conbee.jpg)

*Dresden Elektronik ConBee attached to the Ubuntu fileserver using a USB cable.*

In my case, the ConBee can see the sensors on the top floor and the floor below, but cannot reach the shed or the ground floor.

### Repeaters

This is fixed using any Zigbee device with mains power, because they all act as Zigbee signal repeaters, forming a mesh network. The exception here is Philipps HUE equipment, which does not in general do this.

What I did was purchase a few [TRÅDFRI Signal repeaters](https://www.ikea.com/us/en/p/tradfri-signal-repeater-30400407/). These are USB-to-USB connectors that act as signal repeaters and a USB plug, powering the thing. You can plug the entire device chain into a wall plug, or run the basic USB-to-USB adapter from any USB socket that happens to be available.

The repeaters need to be paired with the ConBee. That is done by putting the ConBee into open mode, and then poking a small hole in the TRÅDFRI Signal repeater with a SIM tool or a paper clip. The single LED in the repeater will dim, blink, and 30s later the gateway has picked up the new device.

The repeaters have substantially better antennas than the ConBee. I purchased three, estimating I would need them to chain from the top floor across the first floor and the ground floor into the shed, but actually one repeater on the first floor would have been sufficient. On the other hand these devices are 10 Euro each, so I do not really care.

### Sensors

I am using Aqara sensors which report temperature, humidity and pressure. The pressure sensors are impressive - they are long term stable, and they register when I take down a sensor from the second floor to the ground floor. The devices are extremely small - they are powered by a CR2032 cell (eg IKEA PLATTBOJ), and can run off it for around a year. The device is about twice as thick as the CR2032, and only slightly larger than the battery.

They come with two double sided adhesive rings, have a pairing button on one side and a tiny blue indicator LED that only signals pairing and is otherwise unused.

They report measurements aynchronously as the data changes, which makes MQTT a much better suited protocol then HTTP.

They are available on Amazon from a number of makers, at vastly different prices and delivery times. I assume that a 100-pack of these directly from Shenzen comes in at 2.50 Euro/pc or so - individual sensors incl. shipping come in at $6.50 at Aliexpress. [Here](https://www.amazon.de/gp/product/B07SB2C327), [here](https://www.amazon.de/gp/product/B07RQTQ4JH) and [here](https://www.amazon.de/gp/product/B088ZT28T6) are some sources, but I have seen them as low as 10-12 Euro/pc.

![](/uploads/2020/11/iot-aqara1.jpg)

*A wireless mouse was delivered in container made from these plastic shells. I used one to protect the Aqare sensor against the weather.*

The Aqara sensor is not really an outdoor sensor. It works well on the east side of the house, but the west side is the local weather side, and needs more water protection. I know this, because the first sensor on this side of the house drowned and shorted out after a rainstorm. I have mounted the replacement sensor in an upside down, open plastic container, and the glued the container to the top bar of a window. The seems to work fine.

![](/uploads/2020/11/iot-aqara2.jpg)

*Aqara sensor mounted on the top bar of a window. The plastic container is open to the bottom, but acts as a shield against rain and weather.*

### Wall Plugs

I bought a very large number of [Gosund SP111 Wall Plugs](https://www.amazon.de/gp/product/B085RFKVW4) and converted them to Tasmota [using Tuya-Convert]({% link _posts/2020-05-20-gosund-and-tasmota.md %}). The plugs are attractive, because they can do the full 16A and are small enough to fit next to each other on a regular plug extender, if the slots are angled at 45deg (the device has a button, and the Gosounds touch each other on small extenders, pressing each others button).

This is a solder-free conversion, using the WiFi in a Raspi 4. Newer versions of this plug do no longer convert this way, and require wires to reflash initially.

On the other hand, [DeLOCK WLAN Steckdosen](https://geizhals.de/delock-wlan-steckdosen-schalter-mqtt-mit-energieueberwachung-11827-a2365959.html) are the same device and come pre-tasmotified.

In any case you are looking at around 20 Euro/plug.

The plugs connect to the local 2.4 Ghz Wifi, and after tasmotification speak HTTP(S) and MQTT(s).

## Software

I need a database for time series that collects measurements from the sensors and the wall plugs. In my case that is [Influx](https://www.influxdata.com/). Visualization is from Influx to [Grafana](https://grafana.com/), because that is known to work well.

The MQTT transport is implemented using [Mosquitto](https://mosquitto.org/), again, because that is known to work well.

Data transport from Mosquitto to Influx can be done with [Telegraf](https://www.influxdata.com/time-series-platform/telegraf/), or [a small Python script](https://github.com/isotopp/python-mqtt-bridge/blob/master/bridge.py) - I started out with the Python, but only later learned that it could have been done completely in Telegraf. My setup still uses the Python.

Conversion and transport from Zigbee to MQTT is done using [zigbee2mqtt](https://www.zigbee2mqtt.io/).

### Storage

All data and config resides in `/export/iot` in my setup.

```console
# df -Th /export/iot/
Filesystem           Type  Size  Used Avail Use% Mounted on
/dev/mapper/data-iot xfs    30G  7.3G   23G  25% /export/iot
```

I am providing sufficient storage for about one year of data. I am using XFS as a file system, because while having higher commit latency than ext4, it has close to no jitter and consequently much better plannable performance.

This is a LVM2 partition on the `data` volume group, which containts two Samsung EVO 860 4 GB drives.

```console
# pvs | grep data
  /dev/sde1  data   lvm2 a--    3.64t   2.32t
  /dev/sdf1  data   lvm2 a--    3.64t   1.16t
# vgs data
  VG   #PV #LV #SN Attr   VSize VFree
  data   2  13   0 wz--n- 7.28t 3.48t
```

Created this way:

```console
# lvcreate -n iot -L 30g data
...
# mkfs -t xfs /dev/data/iot
...
# mkdir /export/data
# mount /dev/data/iot /export/data
```

### docker-compose

I am using [docker-compose](https://docs.docker.com/compose/) to set this up and run it. This works remarkably well, and there is no need to run K8s on a single box, anyway.

A deployment is specified in a file `docker-compose.yml`, which lists a number of containers and optionally a local virtual network segment. The deployment can make use of environmetn variables, which can be put into a file named `.env` (dotenv) in the same directory.

### mosquitto

We make use of this:

```yaml
# cd /export/iot
# cat .env
DATA_DIR=/export/iot

MQTT_PORT=1883
INFLUX_PORT=8086
GRAFANA_PORT=3000
ZIGBEE_DEVICE=/dev/ttyACM0
TZ=Europe/Amsterdam

GF_INSTALL_PLUGINS=grafana-clock-panel,grafana-simple-json-datasource

DOCKER_HOST_ADDRESS=192.168.1.10
```

These are being used in the `docker-compose.yml` in the same directory. We specify the version, and enumerate the services we want.

Here is our service `mosquitto`:

```yaml
---
version: "3"

services:
  mosquitto:
    image: "eclipse-mosquitto:latest"
    container_name: "mosquitto"
    hostname: "mosquitto"
    user: "1000"
    ports:
      - "${MQTT_PORT}:1883"
    volumes:
      - "./mosquitto/mosquitto.conf:/mosquitto/config/mosquitto.conf"
      - "./mosquitto/users:/mosquitto/config/users"
      - "${DATA_DIR}/mosquitto/data:/mosquitto/data"
      - "${DATA_DIR}/mosquitto/log:/mosquitto/log"
    restart: "always"
```

We are defining a container named "mosquitto", which uses the docker internal hostname "mosquitto". Our other services will be able to connect to this container using this hostname. We try to run this as the user with the UID 1000, but unfortunately this is mostly a vain effort using Docker - a lot of stuff needs to run privileged. The server inside the container is running on port 1883, and we make it available on the outside on `$MQTT_PORT` from the dotenv.

We overwrite the internal config file `/mosquitto/config/mosquitto.conf` with the file `./mosquitto/mosquitto.conf` (`/export/iot/mosquitto/mosquitto.conf`) and so on.

We also define a [restart](https://docs.docker.com/compose/compose-file/#restart) rule.

### Influx

Next up: we want an Influx instance.

```yaml
  influxdb:
    image: "influxdb:latest"
    container_name: "influxdb"
    hostname: "influxdb"
    ports:
      - "${INFLUX_PORT}:8086"
    volumes:
      - "${DATA_DIR}/influxdb:/var/lib/influxdb"
    restart: "always"
```

Again, we may the internal port (8086) to what is defined in the dotenv, and we overwrite the internal `/var/lib/influxdb` with `$DATA_DIR/influxdb` (`/export/iot/influxdb`).

We can prove this works: Enter the docker container, create a file, leave the docker container, see the file.

```console
# docker exec -it influxdb bash
# cd /var/lib/influxdb/
/var/lib/influxdb# touch keks
/var/lib/influxdb# exit
# ls -l /export/iot/influxdb/keks
-rw-r--r-- 1 root root 0 Nov 15 15:58 /export/iot/influxdb/keks
# rm /export/iot/influxdb/keks
```

This gets us an instance of Influx.

### Grafana

Next then, the Grafana instance:

```yaml
  grafana:
    image: "grafana/grafana:latest"
    container_name: "grafana"
    hostname: "grafana"
    user: "1000"
    depends_on:
      - influxdb
    ports:
      - "${GRAFANA_PORT}:3000"
    volumes:
      - "${DATA_DIR}/grafana/data:/var/lib/grafana"
      - "${DATA_DIR}/grafana/log:/var/log/grafana"
      - "${DATA_DIR}/grafana/config:/etc/grafana"
    restart: "always"
```

We can only run Grafana, when Influx is up and running, so we provide a `depends_on` attribute to the service. Again, we map the port, and also the various directories of interest inside the container are made available to the outside.

### Zigbee2MQTT

The bridge from Zigbee to MQTT is defined as before:

```yaml
  z2m:
    image: "koenkk/zigbee2mqtt"
    container_name: "z2m"
    hostname: "z2m"
    devices:
      - "${ZIGBEE_DEVICE}:${ZIGBEE_DEVICE}"
    privileged: true
    environment:
      - "TZ=${TZ}"
    volumes:
      - "${DATA_DIR}/z2m:/app/data"
      - "/run/udev:/run/udev:ro"
    depends_on:
      - "mosquitto"
    restart: "always"
```

This one is special, because it needs device access to the device file of the ConBee inside the container. So the container is `privileged`, we import the device file, and a `ro` instance of `udev`. It also needs access to the `TZ` environment variable from dotenv.

Our Zigbee2MQTT data is in `$DATA_DIR/z2m` (`/export/iot/z2m`).

### Our python project, mqttbridge

The final component is our mqttbridge, which is a dockerized Python script we provide. Alternatively we could have used telegraf for this, but I realized that only later.

```yaml
  bridge:
    build: "./bridge"
    image: "isotopp/mqttbridge"
    container_name: "mqttbridge"
    hostname: "mqttbridge"
    user: "1000"
    depends_on:
      - "influxdb"
      - "mosquitto"
    restart: "always"
```

Our script resides in `./bridge` (`/export/iot/bridge`), and runs with the hostname and container name `mqttbridge`, as UID 1000. It makes sense to run it only when it can read data from mosquitto and write to Influx, so we `depends_on` these.

Inside the `./bridge` directory, we provide a `Dockerfile` and the script:

```docker
# cat bridge/Dockerfile
FROM python:3.8-alpine

LABEL maintainer="isotopp" \
      description="MQTT to InfluxDB Bridge"

COPY requirements-frozen.txt /tmp/requirements.txt
RUN pip install -r /tmp/requirements.txt

COPY ./bridge.py /app
WORKDIR /app

CMD [ "python3", "-u", "bridge.py" ]
```

This makes use of the Python 3.8 Alpine base image. We copy our requirements file into the container, run `pip` to install the requirements, copy the `bridge.py` file into the /app directory and then start that script with the appropriate options (`-u` - run Python unbuffered).

The [actual script](https://github.com/isotopp/python-mqtt-bridge/blob/master/bridge.py) understands the channels I use internally for Aqara, Mijia, and Gosund data.

## Configuration

The various components need configuration.

### Mosquitto

```console
# cat /export/iot/mosquitto/mosquitto.conf
persistence true
persistence_location /mosquitto/data/
log_dest file /mosquitto/log/mosquitto.log
```

We also need a `/export/iot/mosquitto/users` file, and create a `mqttuser` with `mosquitto_passwd -c /export/iot/mosquitto/users mqttuser`.

The logfile in `/export/iot/mosquitto/log/mosquitto.log` will need expiration.

### Influx

Influx will need a bit more configuration, but this is interactive, and a bit longer. It will be provided in another article.

### Grafana

Grafana comes up empty, and needs an admin password and manual configuration after initial startup. To make things work, we need to configure our InfluxDB as a server-side data source (Grafana connects to Influxdb, not the Browser connects to Influxdb).

We can then use the hostnames we defined to access the database:

```console
- Name: InfluxDB
- Default: enabled

URL: http://influxdb:8086
Access: Server (default)

...

Database: home_db (we are going to set this up later)
User: and Password: as needed (by default: empty)
```

As soon as we have data in InfluxDB, we can start to define dashboards.

### Zigbee2MQTT

And this is where we start configuration for real, the entry point for our data: Once everything is running we shoudl see a `/export/iot/z2m/configuration.yaml`.

It will look somewhat like this:

```yaml
# cat configuration.yaml
homeassistant: false
permit_join: true
mqtt:
  base_topic: zigbee2mqtt
  server: 'mqtt://mosquitto/'
serial:
  port: /dev/ttyACM0
```

That is:

- We run without home assistant, so we disable this.
- We need to open the z2m to allow devices to join, so `permit_join` needs to be true.
- Our mosquitto is at the host of that name.
- We post data to zigbee2mqtt.
- We need to tell z2m where our ConBee is located, as a device.

When we have done that, and brought the entire apparatus up, we will be able to have devices join and they are being added to the `configration.yaml`.

After that we can edit the file to give them proper names.

## Starting it

So we `cd /export/iot` and `docker-compose build`, them `docker-compose up` the entire thing.

Among all the other things we also get our bridge process and the node process from z2m:

```console
# ps axuwwww | grep [b]ridge.py
kris     2982402  0.0  0.0  24136 18120 ?        Ss   Nov10   5:20 python3 -u bridge.py
# ps axuwwww | grep index.j[s]
root      441693  0.8  0.1 314256 57840 ?        Sl   12:12   2:53 node index.js
```

We can switch to the z2m log directory and tail the log:

```console
# tail -F $(ls -1tr */log* | tail -1)
info  2020-11-15 12:12:56: Logging to console and directory: '/app/data/log/2020-11-15.12-12-56' filename: log.txt
info  2020-11-15 12:12:56: Starting zigbee2mqtt version 1.14.0 (commit #9009de2)
info  2020-11-15 12:12:56: Starting zigbee-herdsman...
info  2020-11-15 12:12:56: zigbee-herdsman started
info  2020-11-15 12:12:56: Coordinator firmware version: '{"type":"ConBee2","meta":{"transportrev":0,"product":0,"majorrel":38,"minorrel":74,"maintrel":0,"revision":"0x264a0700"}}'
...
warn  2020-11-15 12:12:56: `permit_join` set to  `true` in configuration.yaml.
warn  2020-11-15 12:12:56: Allowing new devices to join.
warn  2020-11-15 12:12:56: Set `permit_join` to `false` once you joined all devices.
info  2020-11-15 12:12:56: Zigbee: allowing new devices to join.
info  2020-11-15 12:12:56: Connecting to MQTT server at mqtt://mosquitto/
info  2020-11-15 12:12:56: Connected to MQTT server
```

We could now try to have a device join the setup, by holding it close to the antenna and pressing the button. For the IKEA bridges, we need to push a paper clip into the small hole at the front, for the Aqara devices we press the button.

We should see a log message for each of the devices. After everything has joined, we can `docker-compose stop z2m; service networking restart` and edit the `configuration.yaml` to closed state, and name the devices.

```yaml
# cat configuration.yaml
homeassistant: false
permit_join: false
mqtt:
  base_topic: zigbee2mqtt
  server: 'mqtt://mosquitto/'
serial:
  port: /dev/ttyACM0
devices:
  '0x00158d0004075772':
    friendly_name: eastside/SENSOR
  '0x00158d00048735ab':
    friendly_name: bathroom/SENSOR
  '0x00158d00045c09a9':
    friendly_name: schuppen/SENSOR
  '0x00158d00053effba':
    friendly_name: westside/SENSOR
  '0xec1bbdfffe18b39d':
    friendly_name: bibliothek/BRIDGE
  '0x842e14fffe75eda0':
    friendly_name: wohnzimmer/BRIDGE
  '0x00158d000486341e':
    friendly_name: wohnzimmer/SENSOR
  '0x680ae2fffe9c847d':
    friendly_name: schuppen/BRIDGE
```

z2m will now post messages to the MQTT bus, building the topic from the `base_topic`and the `friendly_name`:

```console
info  2020-11-15 17:42:00: MQTT publish: topic 'zigbee2mqtt/schuppen/SENSOR', payload '{"battery":97,"voltage":2995,"temperature":11.85,"humidity":81.23,"pressure":1002,"linkquality":96}'
info  2020-11-15 17:42:45: MQTT publish: topic 'zigbee2mqtt/bathroom/SENSOR', payload '{"battery":74,"voltage":2955,"temperature":21.41,"humidity":59.62,"pressure":997.4,"linkquality":96}'
```

The payload here is JSON, which we parse, and push into Influxdb. Or let `telegraf` do that, automatically.

**Why the `service networking restart`?** For some reasons, when downing or stopping services from docker-compose, docker-compose will unconfigure the routes to my Ubuntu. I then need to connect a keyboard, log in and manually run `service networking restart` to fix this.

I have not yet found out why this happens.

When doing it like this, I keep the connection and do not need to fix the Ubuntu box.

## Listening to the bus

Using the `mosquitto_sub` command we can listen to multiple topics on the bus. For that we need to provide the `-t` option one or more times. Topics can be literal like `zigbee2mqtt/bathroom/SENSOR` or can contain a single level wildcard (`+`) or multilevel wildcards (`#`).

We run

```console
 # mosquitto_sub -F "%J"  -t zigbee2mqtt/+/SENSOR
{"tst":1605459438,"topic":"zigbee2mqtt/westside/SENSOR","qos":0,"retain":0,"payloadlen":100,"payload":{"battery":91,"voltage":2985,"temperature":10.63,"humidity":84.22,"pressure":997.5,"linkquality":97}}
{"tst":1605459438,"topic":"zigbee2mqtt/westside/SENSOR","qos":0,"retain":0,"payloadlen":100,"payload":{"battery":91,"voltage":2985,"temperature":10.63,"humidity":83.12,"pressure":997.5,"linkquality":97}}
{"tst":1605459438,"topic":"zigbee2mqtt/westside/SENSOR","qos":0,"retain":0,"payloadlen":100,"payload":{"battery":91,"voltage":2985,"temperature":10.63,"humidity":83.12,"pressure":997.8,"linkquality":97}}

```

in one window, and `tail -f /export/iot/z2m/log/*/log.txt` in a second window. When log messages appear in `log.txt`, we should also see JSON payloads being dumped by `mosquitto_sub`.

We now know that zigbee2mqtt is up and running, has a configuration and is posting messages to the MQTT, using the proper topic names.

## Debugging the topology

Zigbee is a mesh network. Our IKEA signal repeaters will act as intermediate relays, forwarding the messages to the coordinator.

We can [dump the current topology](https://www.zigbee2mqtt.io/information/mqtt_topics_and_message_structure.html#zigbee2mqttbridgenetworkmap), as seen by the zigbee2mqtt gateway, by running the following command in one window:

```console
 mosquitto_sub -h localhost -C 1  -t zigbee2mqtt/bridge/networkmap/graphviz | sfdp -Tpng > map.$(date +%Y%m%d%H%M%S).png
```

and running the matching pub command in a second window:

```console
# mosquitto_pub -h localhost -t zigbee2mqtt/bridge/networkmap -m graphviz
```

The sfdp command is part of the `graphviz` package.

```console
# dpkg -S $(which sfdp)
graphviz: /usr/bin/sfdp
```

The result is a network map. The map is always only a current snapshot, and the actual configuration may vary depending on network conditions.

[![](/uploads/2020/11/iot-mesh.png)](/uploads/2020/11/iot-mesh-large.png)

*The MQTT network map shows the devices and how they connect between each other. Unlinked devices connect directly to the coordinator.*

To be continued with a section on Influx configuration.

## I could not have done this alone

There are many people who have helped me to set this up. The one that stands out most is [Marianne Spiller](https://unixe.de). She wrote [Smart Home mit openHAB 2](https://www.rheinwerk-verlag.de/smart-home-mit-openhab-2-einrichten-steuern-automatisieren/), the book on openHAB and home automation, and while I did not go down that route, she inspired me to research the topic. She also [motivated me to look into docker-compose](https://www.unixe.de/yaja-yet-another-jitsi-article/) and she is running the fantastic [#tabsvongesternnacht](https://www.tabsvongesternnacht.de/) Stammtisch every Friday. Thank you, [@sys_adm_ama](https://twitter.com/sys_adm_ama).

Another useful resource was [https://github.com/Nilhcem/home-monitoring-grafana](https://github.com/Nilhcem/home-monitoring-grafana) and the article in [Home sensor data monitoring with MQTT, InfluxDB and Grafana](http://nilhcem.com/iot/home-monitoring-with-mqtt-influxdb-grafana), which I took as a blueprint for my setup.
