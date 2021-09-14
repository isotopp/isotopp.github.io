---
layout: post
title:  'Trying lvmraid for real'
author-id: isotopp
feature-img: assets/img/background/rijksmuseum.jpg
date: 2019-12-03 14:10:12 +0100
tags:
- lang_en
- storage
- erklaerbaer
---
So after testing [LVM Raid]({% link _posts/2019-12-02-cloning-and-splitting-logical-volumes.md %})
in princple, I have been trying it on some real hardware to see
what happens. The idea was to estimate if it scales and if not,
how it doesn't. I was expecting to run into all kinds of obscure
problems in my testing, but in fact, it was a quick and short
death.

Here is my box: QuantaGrid D42A-2U with an [AMD EPYC 7551P CPU](https://www.amd.com/en/products/cpu/amd-epyc-7551p)
(32C, HT off), 1024 GB of memory, a boot disk and 12x
Micron_9200_MTFDHAL11TATCW
([PDF](https://www.micron.com/-/media/client/global/documents/products/product-flyer/9200_ssd_product_brief.pdf))
for 120TB of disk storage.

The setup was very straight forward:

```console
# pvcreate /dev/nvme*n1
# vgcreate vg00 /dev/nvme*n1
# lvcreate -n mysqlvol -L60T vg00
# lvconvert --type raid1 -m1 /dev/vg00/mysqlVol
```

The objective was to ensure that an existing non-raided volume
could be converted into a RAID after the fact. My installation
is half-sized. The actual production version of this would be on
a machine with 24 of these drives, 12 of them currently filled
by a 90T database, and I just used a spare box to test the basic
procedure.

## It works, slowly

So, this worked:

```console
# lvs -a -o+raid_min_recovery_rate,raid_max_recovery_rate,raid_mismatch_count,raid_sync_action
  LV                  VG    Attr       LSize    Pool Origin Data%  Meta%  Move Log Cpy%Sync Convert MinSync MaxSync Mismatches SyncAction
  audit               sysvm -wi-ao----    1.95g
  log                 sysvm -wi-ao----   10.00g
  root                sysvm -wi-ao----    9.77g
  swap                sysvm -wi-ao---- 1000.00m
  var                 sysvm -wi-ao----   35.00g
  mysqlVol            vg00  rwi-a-r---   60.00t                                    0.51                                      0 recover
  [mysqlVol_rimage_0] vg00  iwi-aor---   60.00t
  [mysqlVol_rimage_1] vg00  Iwi-aor---   60.00t
  [mysqlVol_rmeta_0]  vg00  ewi-aor---    4.00m
  [mysqlVol_rmeta_1]  vg00  ewi-aor---    4.00m
```


## Performance metric

For very slow and single threaded values of work: `iostat -x -k 10`

![](/uploads/2019/12/lvmraid-iostat.png)

As you can see, nmve0n1 is being read at around 240 MB/s, and
being written at the same speed to nvme6n1. The rimage_0 is
dm-8, you can see the reading, and the writing goes to dm-10,
the rimage_1.

At this rate, I will get a RAID sync in 3.5 days or so (60*1024/0.22 = 280k
seconds).

## Expected performance

The expected behavior is to see a request queue deep enough to get the full
transfer rate from a single NVME device (3.5 GB/s according to the spec
sheet, anything above 2.5 GB/s sustained is good enough), and on all 6
device pairs in parallel, for a total of anything above 6x 2.5GB/s = 15 GB/s
for an unconstrained RAID-1 sync. That is what the hardware can do here. In
this case, the sync would complete in 4096 seconds, a bit under 1.5h.

So basically this died in the crib, because it does not leverage any
parallelism the CPU, the multitude of drives, the deep queues of the NVMEs
or anything else would have to offer.

It's from the past. 

LVM is in need of serious overhaul in order to become a tool for the 2020's.
Outside of toy workloads, snapshots don't work,
[lvmraid](https://www.systutorials.com/docs/linux/man/7-lvmraid/) also does
not work.

## Why is this slow?

A single NVME drive (we have 2x 6 of them) like the one I used is a 4xPCIe
3.0 device, so we get a transfer rate on the bus of 32 GByte/s. The internal
structure of the flash limits the performance here, and according to the
technical specifications of the device we get 800k-ish IOPS (let's say it's
a million) and 3.5 GByte/s from it.

We also can measure the device and see that it does have a read latency of
around 100-120 microseconds, and a buffered write latency (to the internal
RAM of the device, assume it has 512 MB or so) of 50 microseconds. If you
write a lot, writes become unbuffered at, say, 420 micros.

In order to get 1 million IOPS single threaded at a queue depth of 1, you
would need a latency of 1 microseconds. You don't get that, so in order to
get all IOPS, you need to have deep queues (and async IO) or many threads.

In order to get 3.5 GB/s (say, 4 GB/s) at 4 KB block size, you need 1
million blocks per second (920k for 3.5 GB/s). Again, you need deep queues
or many thread to get that.

## Addendum: Unexpected performance limits

Today, I monitored the still syncing array and it has been progressing at
around 250 MB/s equalling around 1.1% per hours over night, and
is now at 20-something percent synced.

```console
# lvchange -maxrecoveryspeed=1000k /dev/vg00/mysqlVol
```

This works, and throttles the sync to just below 1000k per
second. Conversely, setting a recovery speed of 0k falls back to
the default 250 MB/s.

But: Setting it to 1000000k ups the speed to around 550 MB/s,
which is the single threaded native speed of the array. I see
around 4300 requests/s at a size of 256 KB at the NVME level,
and around 8600 requests/s at a size of 128 KB one level higher
in the dm-layer. There is also some kind of request merging
going on somewhere in the stack, which for adjacent requests
even makes sense.

## Addendum: Interrupting the RAID sync

If you try to split the Volume while it is still synching, you
will find that this is not possible.

```console
# lvconvert --splitmirrors 1 -n splitlv /dev/vg00/mysqlVol
  Unable to split vg00/mysqlVol while it is not in-sync.
```

Another observationL While lvmraid employs mdraid code, working with
devicemapper block devices for the data and external metadata, mdraid does
not see any of this in /proc;

```console
# cat /proc/mdstat
Personalities : [raid6] [raid5] [raid4] [raid1]
unused devices: <none>
```

You can't use any mdraid tooling to turn knobs inside lvm
controlled mdraid code.
