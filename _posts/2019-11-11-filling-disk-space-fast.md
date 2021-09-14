---
layout: post
title:  'Filling disk space fast'
author-id: isotopp
feature-img: assets/img/background/rijksmuseum.jpg
date: 2019-11-11 16:23:55 +0100
tags:
- lang_en
- computer
- storage
- datenbanken
---
Some of the databases at work are a tad on the large side, in the high
2-digit terabytes of size. Copying these to new machines at the moment takes
a rather long time, multiple days, up to a week. Speeding it up pays
twice, because with shorter copy times there is also less binlog to catch
up.

I have been looking into disk copy speeds in order to better understand the
limits. When creating a partition from NVME devices, the most simple layout
is a concatenation:

```console
# lvcreate -n kris -L 10t vg00
# dd if=/dev/zero of=data.0 bs=1024k count=10240
```

Using a single `dd` command, I get about 600 MB/sec read or written from it.
For 50TB, this is 87400 seconds, slightly more than one day.

The key to NVME saturation is parallel access, so lets do this in parallel
with multiple processes:

```console
# seq 1 128 | parallel dd if=/dev/zero of=data.{} bs=1024k count=10240
```

This will run as many processes in parallel as I have CPUs. On the test
machine it will keep 32 processes running at all times, filling the queues
of the NVME device deeply. It can reach 3250 MB/s, so 50 TB translate into
16130 seconds, 4.5h.

Had I created the NVME device as a striped RAID-0, I would have gotten even
better performance:

```console
# lvcreate -n kris -L 10t -i12 -I64k vg00
# seq 1 128 | parallel dd if=/dev/zero of=data.{} bs=1024k count=10240
```

This configuration can reach up to 5.2 GB/s locally, so for 50TB, we get to
2.75h disk write time.

Now, what I actually want is unfortunately something different: A copy of
the original database image from machine A transferred to machine B. So that
will translate into something along the lines of

```console
# mkdir /root/kris
# cd !$
# fpart -o chunk -n 128 /mysql/testschema
# find . -type f | parallel rsync --files-from={} / kris@B:/mysql/testschema
```

but that is still suffering from all the rsync+ssh overhead. It will give
you around 2.7 GB/s. Using tar, this becomes

```console
# find . -type f | 
> parallel 'tar cvf - --files-from={} | ssh kkoehntopp@B "tar -C /a -xf -"'
```

which is much faster for a clean, non-incremental copy. But that is still
using ssh to encrypt and can become a bottleneck in some use cases.

You could run [tnc](http://moo.nac.uci.edu/~hjm/tnc) to use tar and netcat
to get rid of both sources of overhead to speed things up even more and run
at media speed. 
[How to transfer large amounts of data via network](http://moo.nac.uci.edu/~hjm/HOWTO_move_data.html)
in general is a useful resource and has a few more ideas and tools on how to
handle things.

## Tools used

GNU `parallel` - a perl script that is part of CentOS 7, which can
comfortably construct and run command lines in parallel execution. It has no
large advantage over `xargs -P`, but I like the flexibility of the
substitutions offer.

`fpart` - a tool that will take a list of filenames or pairs of size and
filename (du output) and sort it into chunks of files so that each chunk
contains the approximately same amount of bytes.

## Other tools

`fpsync` - deprecated tool, part of `fpart`, does a parallel rsync, badly.
Do not use this. Also, the successor tool (`parsyncfp`) is not really
valuable if you can do fpart and your transfer command of choice yourself.
Actually doing it yourself is more transparent and easier to test.

## This requires NVME

NVME devices have multiple deep queues. They can utilize parallel access and
turn it into performance. In fact, getting the full performance out of a
NVME device probably requires asyncio or parallel processes.

That is, because a single NVME device can give you around 800000 IOPS or
more, so you should complete one IO every 1.2 microseconds. On the other
hand, actual read latency is on the order to 100 micros, and write latency
buffered/unbuffered is at around 50/450 micros, so a single threaded access
can realize only a fraction of the total I/O potential of the device.

NVME devices are using the same flash storage that SSD use, but they remove
the SATA controller from the equation. Instead the flash resides directly on
the PCI bus. NVME can be made available locally or remotely, and the way we
have set our network the network is not the bottleneck. Network access
inside our data centers will add 20 micros or less in latency.