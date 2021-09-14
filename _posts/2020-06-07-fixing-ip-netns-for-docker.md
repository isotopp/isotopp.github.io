---
layout: post
title:  'Fixing "ip netns" for docker'
author-id: isotopp
feature-img: assets/img/background/rijksmuseum.jpg
date: 2020-06-07 14:18:36 +0200
tags:
- docker
- networking
- debug
- lang_en
---
So I want to monitor my Jitsi Videobridge to get some useful statistics. The instructions say to [enable Videobridge statistics](https://github.com/jitsi/jitsi-videobridge/blob/master/doc/statistics.md) and then grab stuff from port 8080.

Ok, I think I did that, but it did not work. Time to dig into the container network config.

And while I have a lot of network namespaces, they are unknown to `ip netns`, as can be seen when asking for a list. When we define a network namespace with `ip netns`, it will symlink the assigned name from `/var/run/netns/<name>` to `/proc/<pid>/ns/net` of the process that leads that namespace.

So these are our container names, we want them as netns names:

```console{% raw %}
# docker ps --format='{{.Names}}'
jitsi-jvb
...
{% endraw %}```

We can turn them into PIDs:

```console{% raw %}
# docker inspect -f '{{.State.Pid}}' jitsi-jvb
3899821
{% endraw %}```

And with that, we can create a mapping script:

```console{% raw %}
#! /bin/bash

names="$(docker ps --format='{{.Names}}')"
for name in $names
do
  pid="$(docker inspect -f '{{.State.Pid}}' $name)"
  if [ -z "$pid" ]; then echo "Cannot resolve $name"; continue; fi
  echo $pid $name
  ln -sf /proc/$pid/ns/net "/var/run/netns/$name"
done
{% endraw %}```


Sure enough, I can now `ip netns` things:

```console{% raw %}
# ip netns list
influxdb (id: 5)
mosquitto (id: 2)
grafana (id: 0)
z2m (id: 8)
mqttbridge (id: 9)
jitsi-web (id: 3)
jitsi-prosody (id: 1)
jitsi-jvb (id: 4)
jitsi-jicofo (id: 6)
# ip netns exec jitsi-jvb lsof -i -n -P
COMMAND     PID   USER   FD   TYPE   DEVICE SIZE/OFF NODE NAME
dockerd   16420   root  134u  IPv4 34920699      0t0  UDP 127.0.0.11:45441
dockerd   16420   root  138u  IPv4 34920700      0t0  TCP 127.0.0.11:34251 (LISTEN)
java    3900157 docker  152u  IPv4 34917278      0t0  UDP 172.3.0.5:10000
java    3900157 docker  153u  IPv4 34927830      0t0  TCP 172.3.0.5:59998->172.3.0.2:5222 (ESTABLISHED)
java    3900157 docker  157u  IPv4 34927885      0t0  UDP *:5000
java    3900157 docker  159u  IPv6 34927887      0t0  UDP *:5000
{% endraw %}```

[@ascii158](https://twitter.com/ascii158/status/1269868957458186240) points me at

```console{% raw %}
# nsenter -n -t $(docker inspect <containername> -f '{{.State.Pid}}') lsof -i -n -P
{% endraw %}```

as an alternative solution. That works, but is also quite a lot to type. Like the former solution it needs a script, just a different one. It still is more flexible: works with non-network namespaces and does not need to update a static lookup table.

It also highlights the fact that `docker ps` prints a lot of different identifiers, none of which are the actual PID. Which is funny, because that is kind of the point of a thing called `ps`, isn't it?