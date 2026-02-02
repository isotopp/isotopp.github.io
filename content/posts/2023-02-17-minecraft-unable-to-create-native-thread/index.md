---
author: isotopp
title: "Minecraft: unable to create native thread"
date: 2023-02-17T13:32:00+01:00
feature-§img: assets/img/background/rijksmuseum.jpg
tags:
  - lang_en
  - gaming
  - microsoft
  - minecraft
aliases:
  - /2023/02/17/minecraft-unable-to-create-native-thread.html
---

A minecraft server has problems creating threads. The error message reads:

```java
java.lang.OutOfMemoryError: unable to create native thread: possibly out of memory or process/resource limits reached
        at java.lang.Thread.start0(Native Method) ~[?:?]
        at java.lang.Thread.start(Thread.java:802) ~[?:?]
        at java.util.concurrent.ThreadPoolExecutor.addWorker(ThreadPoolExecutor.java:945) ~[?:?]
        at java.util.concurrent.ThreadPoolExecutor.execute(ThreadPoolExecutor.java:1353) ~[?:?]
        at java.util.concurrent.Executors$DelegatedExecutorService.execute(Executors.java:721) ~[?:?]
        at org.bukkit.craftbukkit.v1_19_R2.scheduler.CraftAsyncScheduler.mainThreadHeartbeat(CraftAsyncScheduler.java:73)
```

The server in question has 32 GB of memory (6 GB used), 8 cores, and processes threads running.
It is mostly idle.
There is no reason at all why this machine should be out of resources.

# VPS Limits, and how to check them

It is a VPS, and that may be related:

```console
# lscpu | egrep -i '(visor|virt)'
Address sizes:       46 bits physical, 48 bits virtual
Virtualization:      VT-x
Hypervisor vendor:   Parallels
Virtualization type: container
```

The instance has a relatively low process limit, shown in `/proc/user_beancounters`.

```console
# grep numproc /proc/user_beancounters
            numproc                       272                  272                 1100                 1100                    0
```

This shows a global limit of 1100 threads/processes.

There is an additional threads-per-process limit enforced by systemd, and this is relatively low, because of the low per-instance limit.
It can be shown like this:

```console
# systemctl show --property=DefaultTasksMax
DefaultMax=135
```

This matches the numbers from the `user_beancounters`:
The maximum utilization was 272 in the Beancounters, and the server never managed to hit the limit of 1100.
Instead, it made it to 2x 135 (two Minecraft servers, each with the limit of 135), and two additional threads.

# Increasing the `systemd` Limit

It is possible to increase this limit to the instance limit, like so:

```console
# mkdir /etc/systemd/systemd.conf.d`
# cd /etc/systemd/system.conf.d
# pwd
/etc/systemd/system.conf.d
# cat << EOF > system.conf
# Override created by ... on ...
#
[Manager]
DefaultTasksMax=1100
```

After creating this file, reload systemd and check the new limits:

```console
# systemctl daemon-reexec
# systemctl show --property=DefaultTasksMax
DefaultMax=1100
```

# Non-VPS has higher limits

On a physical server with 32 GB of memory and 8 cores, the default limit is

```console
# systemctl show --property=DefaultTasksMax
DefaultTasksMax=38313
```

and it can be tuned much higher.
Similarly, on a properly virtualized box instead of a VPS it would be much higher.

Consider this when you opt for a cheap, overcomitted VPS slice instead of a proper KVM.
When you go for the VPS, make a monthly contract and do not commit to a one-year option, so you can get rid of it when it turns out to be unsuitable. 

# Actual resource consumption

On our server, we run three instances of "Paper" (a high-performance patch to a patch to a patch of the original minecraft server),
and waterfall, a Minecraft proxy that directs users between the instances.

![2023/02/native-thread-01.png](native-thread-01.png)

*Output of the `htop` program.
On the right hand side of the screenshot, we see three identically configured `java` instances, each representing a "Paper" server.
The resident set size of these servers is relatively small, 3.5 GB per instance, as shown by the left-lower red bubble.
The virtual size is not quite 10 GB.
The server instance will grow until it reaches the virtual size.
Total memory consumption is shown in the upper-left bubble, 11.6 GB are used (the sum of the servers plus some extra from the OS).*

We run the servers with `-Xmx4096M -Xms4096M` each, which is rather generous.
This creates processes with a total `VIRT` size of ~ 10 GB, of which `RES` is the actually comitted memory, around 3.5 GB per process.
This results in 11.2 GB memory usage, plus 0.4 GB extra from other processes on the instance.

Our total memory is 32 GB.

The server load is shown as 0.41/8.0, so the machine is pretty idle, and the CPU load meters above the memory meter agrees.

![2023/02/native-thread-02.png](native-thread-02.png)

*Output of the `htop` program, detail. When hitting `H` to toggle display of user threads, the number of running threads is also shown.
We are running 245 threads.*

Hitting `H` (Uppercase-H) in `htop` unfolds user threads display. It also shows the total number of threads running next to the number of tasks (processes).
In our case, we are running with 245/1100 threads.
This is by far the most scarce resource.
