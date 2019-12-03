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

{% highlight console %}
# pvcreate /dev/nvme*n1
# vgcreate vg00 /dev/nvme*n1
# lvcreate -n mysqlvol -L60T vg00
# lvconvert --type raid1 -m1 /dev/vg00/mysqlVol
{% endhighlight %}

The objective was to ensure that an existing non-raided volume
could be converted into a RAID after the fact. My installation
is half-sized. The actual production version of this would be on
a machine with 24 of these drives, 12 of them currently filled
by a 90T database, and I just used a spare box to test the basic
procedure.

So, this worked:

{% highlight console %}
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
{% endhighlight %}

For very slow and single threaded values of work: `iostat -x -k 10`

![](/uploads/2019/12/lvmraid-iostat.png)

As you can see, nmve0n1 is being read at 240 MB/s, and being written at the
same speed to nvme6n1. The rimage_0 is dm-8, you can see the reading, and
the writing goes to dm-10, the rimage_1.

At this rate, I will get a RAID sync in 3.5 days or so (60*1024/0.22 = 280k
seconds).

So basically this died in the crib, because it does not leverage any
parallelism the CPU, the multitude of drives, the deep queues of the NVMEs
or anything else would have to offer.

It's from the past. 

LVM is in need of serious overhaul in order to become a tool for the 2020's.
Outside of toy workloads, snapshots don't work,
[lvmraid](https://www.systutorials.com/docs/linux/man/7-lvmraid/) also does
not work.
