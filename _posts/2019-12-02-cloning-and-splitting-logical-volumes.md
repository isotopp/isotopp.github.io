---
layout: post
title:  'Cloning and splitting logical volumes'
author-id: isotopp
feature-img: assets/img/background/rijksmuseum.jpg
date: 2019-12-02 15:01:41 +0100
tags:
- lang_en
- erklaerbaer
- storage
---
Where I work, we rountine run our databases on XFS on LVM2.

## The setup

Each database has their database on `/mysql/schemaname`, with
the subdirectories `/mysql/schemaname/{data,log,tmp}`. The
entire `/mysql/schemname` tree is a LVM2 Logical Volume
`mysqlVol` on the Volume Group `vg00`, which is then formatted
as an XFS filesystem.

## Basic Ops

You can grow an existing LVM Logical Volume with 
`lvextend -L+50G /dev/vg00/mysqlVol` or similar, and then 
`xfs_grow /dev/vg00/myqlVol`.

You can also create a snapshot with 
`lvcreate -s -L50G -n SNAPSHOT /dev/vg00/mysqlVol` 
and if you do this right, it will even be consistent or at least
recoverable. But LVM snapshots are terribly inefficient, and you
might not want to do that on a busy database. 

The size you specified for the LVM snapshot is the amount of
backing storage: When there is a logical write to the mysqlVol,
LVM intercepts the write, physically reads the old target block,
physically writes the old target block into the snapshot backing
storage and then resumes the original write. This will do
horrible things to your write latency, because the orignal write
is stalled until the copy has been made.

As the backing storage fills up, the snapshot will fail once it
is running out. If you still have free space, it is possible to
extend the backing store using `lvextend -L+50G /dev/vg00/SNAPSHOT`.

Reads to the original mysqlVol can be satisfied the normal way
now, as the data we see is always the most recent blocks. Reads
from the snapshot will look for the data in the snapshot, and if
they find it, will return with the old, snapshotted data. Or, if
they do not find it, will look into the mysqlVol instead.

Mounting the XFS snapshot volume is a bit trick: XFS will refuse
to mount the same UUID filesystem twice, and since by definition
the snapshot is a clone of the (past) original volume, it will
of course have the same UUID. So we need to tell XFS that this
is okay: `mount -t ro,nouuid /dev/vg00/SNAPSHOT /mnt` to get it
mounted.

Once unmounted again, you can turn the Logical Volume to offline
and throw it away: `lvchange -an /dev/vg00/SNAPSHOT` and
`lvremove /dev/vg00/SNAPSHOT` to get it done.

## Mirroring using dm-raid

One method to clone a machine is to convert an existing volume
into a RAID1, then split the raid and move one half of the
mirriro to a new machine.

I made myself a small VM with seven tiny drives: The boot disk
is sda, and the drives sdb to sdg are for LVM testing.

The initial setup is like so: We copy the partition table of sda
to all play drives. We then create a volume group testvg, to
which we add the initial 3 drives only partitions, sdb1, sdc1
and sdd1. We then create a simple concatenation of 2G extents
from sdb1, sdbc1 and sdd1.

{% highlight console %}
# for i in sdb sdc sdd sde sdf sdg
> do
>   sfdisk -d /dev/sda | sfdisk /dev/$i
> done
...
# pvcreate /dev/sd{b,c,d,e,f,g}
# vgcreate testvg /dev/sd{b,c,d}
# lvcreate -n testlv -L2G testvg
# lvextend -L+2G /dev/testvg/testlv /dev/sdc1
# lvextend -L+2G /dev/testvg/testlv /dev/sdd1
{% endhighlight %}

We can now check what we have. We are looking at the `lvs`
output to see that we have a 6G LV. Then we check the `pvs`
output to see that we indeed have sdb1, sdc1 and sdd1 in testvg,
and that 2G of each drive have been used. We can then finally
proceed to `pvdisplay --map` to validate the actual layout.

{% highlight console %}
# lvs
  LV     VG     Attr       LSize Pool Origin Data%  Meta%  Move Log Cpy%Sync Convert
  testlv testvg -wi-a----- 6.00g
# pvs
  PV         VG     Fmt  Attr PSize   PFree
  /dev/sdb1  testvg lvm2 a--  <20.00g <18.00g
  /dev/sdc1  testvg lvm2 a--  <20.00g <18.00g
  /dev/sdd1  testvg lvm2 a--  <20.00g <18.00g
  /dev/sde1         lvm2 ---  <20.00g <20.00g
  /dev/sdf1         lvm2 ---  <20.00g <20.00g
  /dev/sdg1         lvm2 ---  <20.00g <20.00g
# pvdisplay --map
  --- Physical volume ---
  PV Name               /dev/sdb1
  VG Name               testvg
...
  --- Physical Segments ---
  Physical extent 0 to 511:
    Logical volume      /dev/testvg/testlv
    Logical extents     0 to 511
...
  --- Physical volume ---
  PV Name               /dev/sdc1
  VG Name               testvg
...
  --- Physical Segments ---
  Physical extent 0 to 511:
    Logical volume      /dev/testvg/testlv
    Logical extents     512 to 1023
...
  --- Physical volume ---
  PV Name               /dev/sdd1
  VG Name               testvg
...
  --- Physical Segments ---
  Physical extent 0 to 511:
    Logical volume      /dev/testvg/testlv
    Logical extents     1024 to 1535
...
{% endhighlight %}

With this we can introduce the three additional drives, and
convert the setup to a mirror:

{% highlight console %}
root@ubuntu:~# vgextend testvg /dev/sd{e,f,g}1
  Volume group "testvg" successfully extended
root@ubuntu:~# pvs
  PV         VG     Fmt  Attr PSize   PFree
  /dev/sdb1  testvg lvm2 a--  <20.00g <18.00g
  /dev/sdc1  testvg lvm2 a--  <20.00g <18.00g
  /dev/sdd1  testvg lvm2 a--  <20.00g <18.00g
  /dev/sde1  testvg lvm2 a--  <20.00g <20.00g
  /dev/sdf1  testvg lvm2 a--  <20.00g <20.00g
  /dev/sdg1  testvg lvm2 a--  <20.00g <20.00g
{% endhighlight %}

and the actual conversion. Using `lvs` we can watch the
progress.

{% highlight console %}
root@ubuntu:~# lvconvert --type raid1 -m1 /dev/testvg/testlv
Are you sure you want to convert linear LV testvg/testlv to raid1 with 2 images enhancing resilience? [y/n]: y
  Logical volume testvg/testlv successfully converted.
root@ubuntu:~# lvs
  LV     VG     Attr       LSize Pool Origin Data%  Meta%  Move Log Cpy%Sync Convert
  testlv testvg rwi-a-r--- 6.00g                                    6.25
root@ubuntu:~# lvs
  LV     VG     Attr       LSize Pool Origin Data%  Meta%  Move Log Cpy%Sync Convert
  testlv testvg rwi-a-r--- 6.00g                                    15.92
root@ubuntu:~# lvs
  LV     VG     Attr       LSize Pool Origin Data%  Meta%  Move Log Cpy%Sync Convert
  testlv testvg rwi-a-r--- 6.00g                                    100.00
{% endhighlight %}

Let's check the disk layout again:

{% highlight console %}
root@ubuntu:~# pvs
  PV         VG     Fmt  Attr PSize   PFree
  /dev/sdb1  testvg lvm2 a--  <20.00g  17.99g
  /dev/sdc1  testvg lvm2 a--  <20.00g <18.00g
  /dev/sdd1  testvg lvm2 a--  <20.00g <18.00g
  /dev/sde1  testvg lvm2 a--  <20.00g  13.99g
  /dev/sdf1  testvg lvm2 a--  <20.00g <20.00g
  /dev/sdg1  testvg lvm2 a--  <20.00g <20.00g
{% endhighlight %}

Wait a moment! Why are sdf1 and sdg1 unused and there are 6G
used from sde1? Checking the map, we can confirm that the
process consolidated our layout: What was three drives on one
side is now one drive on the other side, because 6G easily fit
onto a 20G drive.

{% highlight console %}
  --- Physical volume ---
  PV Name               /dev/sde1
  VG Name               testvg
...
  --- Physical Segments ---
  Physical extent 0 to 0:
    Logical volume      /dev/testvg/testlv_rmeta_1
    Logical extents     0 to 0
  Physical extent 1 to 1536:
    Logical volume      /dev/testvg/testlv_rimage_1
    Logical extents     0 to 1535
...
{% endhighlight %}

## Splitting the RAID and the VG

We can now split the RAID into two unraided LVs with different
names inside the same VG:

{% highlight console %}
root@ubuntu:~# lvconvert --splitmirrors 1 -n splitlv /dev/testvg/testlv
Are you sure you want to split raid1 LV testvg/testlv losing all resilience? [y/n]: y
root@ubuntu:~# lvs
  LV      VG     Attr       LSize Pool Origin Data%  Meta%  Move Log Cpy%Sync Convert
  splitlv testvg -wi-a----- 6.00g
  testlv  testvg -wi-a----- 6.00g
root@ubuntu:~# pvs
  PV         VG     Fmt  Attr PSize   PFree
  /dev/sdb1  testvg lvm2 a--  <20.00g <18.00g
  /dev/sdc1  testvg lvm2 a--  <20.00g <18.00g
  /dev/sdd1  testvg lvm2 a--  <20.00g <18.00g
  /dev/sde1  testvg lvm2 a--  <20.00g <14.00g
  /dev/sdf1  testvg lvm2 a--  <20.00g <20.00g
  /dev/sdg1  testvg lvm2 a--  <20.00g <20.00g
{% endhighlight %}

And we can then proceed to split the Volume Group in two,
putting splitlv into a new Volume Group splitvg, then export
that.

For that, we need to change the testvg to unavailable, then run
vgsplit. The outcome:

{% highlight console %}
root@ubuntu:~# vgchange -an testvg
  0 logical volume(s) in volume group "testvg" now active
root@ubuntu:~# vgsplit -n splitlv testvg splitvg
  New volume group "splitvg" successfully split from "testvg"
root@ubuntu:~# lvs
  LV      VG      Attr       LSize Pool Origin Data%  Meta%  Move Log Cpy%Sync Convert
  splitlv splitvg -wi------- 6.00g
  testlv  testvg  -wi------- 6.00g
root@ubuntu:~# pvs
  PV         VG      Fmt  Attr PSize   PFree
  /dev/sdb1  testvg  lvm2 a--  <20.00g <18.00g
  /dev/sdc1  testvg  lvm2 a--  <20.00g <18.00g
  /dev/sdd1  testvg  lvm2 a--  <20.00g <18.00g
  /dev/sde1  splitvg lvm2 a--  <20.00g <14.00g
  /dev/sdf1  testvg  lvm2 a--  <20.00g <20.00g
  /dev/sdg1  testvg  lvm2 a--  <20.00g <20.00g
{% endhighlight %}

We can see that vgsplit automatically identified the physical
drives that make up the splitlv volume, made sure nothing else
is on these drives and moves them into a new VG splitvg.

We can now `vgexport` that thing, eject the drives and move them
elsewhere. Over there, we can `vgimport` things and proceed.

{% highlight console %}
root@ubuntu:~# vgexport splitvg
  Volume group "splitvg" successfully exported
{% endhighlight %}

It is now safe to pull the drive.
