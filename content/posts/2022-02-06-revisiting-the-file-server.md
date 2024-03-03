---
author: isotopp
title: "Revisiting the file server"
date: 2022-02-06T21:06:03+01:00
feature-img: assets/img/background/rijksmuseum.jpg
tags:
- lang_en
- computer
- linux
- storage
---

The new disks in the file server had synchronized nicely, and that resulted in an interesting graph:

![](/uploads/2022/02/disk-sync.jpg)

*Sectors on the outer part of a hard disk are transferred faster than inner sectors. You can see how the disk speed halves between the outermost and the innermost part.*

While watching, I decided on a whim that I wanted to convert the entire setup from using Linux `mdraid` to `dmraid`, the LVM2 implementation of RAID1.
It is essentially the same code, but integrated into LVM2 instead of using `mdadm` for control.

I had already experimented with `dmraid` before, as documented in [an earlier article]({{< relref "/2019-12-02-cloning-and-splitting-logical-volumes.md" >}}), and that was [not without problems]({{< relref "/2019-12-03-trying-lvmraid-for-real.md">}}).
But since the array would contain no original data, only backups, I decided to give it a try.

So here we go:

# Destroying the `mdraid`

I had created a RAID-1 pair of the disks `/dev/sdb2` and `/dev/sdc2` under the name `/dev/md126`, then added `/dev/md126` to the `hdd` volume group. In order to get the disks back, I had to undo this.

So we need to check if the `/dev/md126` PV is empty:

```console
# pvdisplay --map /dev/sda2
  --- Physical volume ---
  PV Name               /dev/md126
  VG Name               hdd
  PV Size               9.09 TiB / not usable 1022.98 MiB
  Allocatable           yes
  PE Size               1.00 GiB
  Total PE              9303
  Free PE               9303
  Allocated PE          0
  PV UUID               ...

  --- Physical Segments ---
  Physical extent 1 to 9302:
    FREE

```

That's fine. We can remove the pair from the volume group again, remove the LVM2 label, and then stop and destroy the raid:

```console
# vgreduce hdd /dev/md126
...
# pvremove /dev/md126
...
# mdadm --stop /dev/md126
...
# mdadm --remove /dev/md126
...
# mdadm --zero-superblock /dev/sdb2 /dev/sdc2
```

That did not work: An Ubuntu Component, `os-prober`, took possession of the devices after removing the RAID-1. I had to actually uninstall the component and remove the `osprober` from devicemapper before I could continue:

```console
# ### After uninstalling os-prober:
# dmsetup ls
...
# dmsetup remove osprober-linux-sdb2
...
# dmsetup remove osprober-linux-sdc2
...
# mdadm --zero-superblock /dev/sdb2 /dev/sdc2
...
```

# Preparing the disks individually for LVM2

Only then I could continue, add the disks to LVM2 and extend the `hdd` volume group:

```console
# pvcreate /dev/sd{b,c}2
...
# vgextend hdd /dev/sd{b,c}2
...
```

We now have a very weird, asymmetric VG in which there is a single 9.09 TiB raid PV and two 9.09 TiB unraided PVs.
Our next objective is to evacuate the raided PV, and then destroy this as well, adding the disks back unraided.
This will result in a 36 TiB total VG.

# Evacuating `/dev/md127` to unraid it

This is going to take a long time. We need to do this in a `tmux` session:

```console
# pvmove /dev/md127 /dev/sdb2
...
```

This will, over the course of about one day, move all physical extents from `/dev/md127` to `/dev/sdb2`.
This exposes us to disk failure, as for the moment the data on `/dev/sdb2` is unraided.

# Restoring redundancy

There are two kinds of backup on this disk pack:
A number of Apple Time Machine targets and an Acronis Windws target, `tm_*` and `win_*`, and an internal backup that is being produced by a cron job, `rsync`ing data from the internal SSDs to the disks, `/backup`.

I decided to destroy the `/backup` LV and recreate it as a `raid10` across all 4 disks.
This was relatively easy, and worked immediately -- it just took a few hours for the backup job to run from scratch.

```console
# umount /backup
# lvremove /dev/hdd/backup
...
# lvcreate --type raid10 -i2 -m1 -n backup -L4T hdd
...
# mkfs -t xfs -f /dev/hdd/backup
# mount /backup
# /root/bin/make-backup
```

For the Time Machine and Acronis targets, I decided to `lvconvert` them to `raid1`.
[As stated before]({{< relref "/2019-12-02-cloning-and-splitting-logical-volumes.md" >}}), there are two competing implementations of of RAID in LVM2, `--type mirror` and `--type raid1`.
The `mirror` implementation is very extremely strongly deprecated, the `raid1` implementation is okay, because it uses the same code as  `mdraid` internally.

We need to make sure to specify `--type raid1` in the `lvconvert` command to ensure the proper type is being used.
For each target we do

```console
# lvconvert --type raid1 -m1 /dev/hdd/tm_...
...
```

This returns immediately, and begins to sync the mirror halves internally.
If we at this point convert all Time Machine and Acronis targets at once, the sync speed is abysmally slow, because of disk head treshing.
There is no way to stop this.
The only option is to slow down all resyncs except one:

```console
# ### for all targets, slow them down to minimum
#  lvchange --maxrecoveryspeed=1k /dev/hdd/tm_...

# ### for one target, set a very large max speed:
# lvchange --maxrecoveryspeed=100000k /dev/hdd/tm_...
...
```

and then let one `tm_...` target finish.
After that, we can increase the max sync speed for the next target, and so on.

This is what a `--type raid1` looks like in `lsblk`:

```console
# lsblk /dev/sda2 /dev/sdg2
NAME                     MAJ:MIN RM  SIZE RO TYPE MOUNTPOINT
sda2                       8:2    0  9.1T  0 part
├─hdd-tm_aircat_rmeta_0  253:18   0    1G  0 lvm
│ └─hdd-tm_aircat        253:20   0    1T  0 lvm  /export/tm_aircat
├─hdd-tm_aircat_rimage_0 253:25   0    1T  0 lvm
│ └─hdd-tm_aircat        253:20   0    1T  0 lvm  /export/tm_aircat
...
sdg2                       8:98   0  9.1T  0 part
├─hdd-tm_aircat_rmeta_1  253:26   0    1G  0 lvm
│ └─hdd-tm_aircat        253:20   0    1T  0 lvm  /export/tm_aircat
├─hdd-tm_aircat_rimage_1 253:30   0    1T  0 lvm
│ └─hdd-tm_aircat        253:20   0    1T  0 lvm  /export/tm_aircat
...
```

That is, for each leg of the RAID1 you get a `rimage` and `rmeta` LV.
If the LVs are named `mimage_0` and `mimage1` and there is no `rmeta` but only a single `mlog`, this is not `--type raid`, but the deprecated `mirror` implementation.
This is not good, and should be converted to `--type raid1`.

There is no way to convert a `linear` or `raid1` to `raid10`, unfortunately. 

# Checking status and progress

A few handy commands to check the status and the progress of the conversion.

Monitor the sync state of the devices:

```console
# lvs -a -o name,copy_percent,devices,raid_max_recovery_rate,raid_mismatch_count,raid_sync_action hdd
```

The `-a` shows all the LVs, even the internal ones.
We are interested into the `copy_percent` to see the progress of the sync.
We also want the `max_recovery_rate`, because we might have throttled it with the `lvchange` command mentioned above.
And we want to see the `raid_mismatch_count` and `raid_sync_action` to see what's going on.

Of course, the ubiquitous `lvs -a -o +devices` is always handy to get an impression of the entire VG:

```console
# lvs -a -o +devices hdd
  LV                   VG  Attr       LSize   Pool Origin Data%  Meta%  Move Log Cpy%Sync Convert Devices
  backup               hdd rwi-aor---   4.00t                                    100.00           backup_rimage_0(0),backup_rimage_1(0),backup_rimage_2(0),backup_rimage_3(0)
  [backup_rimage_0]    hdd iwi-aor---   2.00t                                                     /dev/sdb2(2561)
  [backup_rimage_1]    hdd iwi-aor---   2.00t                                                     /dev/sdc2(1)
  [backup_rimage_2]    hdd iwi-aor---   2.00t                                                     /dev/sda2(1026)
  [backup_rimage_3]    hdd iwi-aor---   2.00t                                                     /dev/sdg2(3158)
  [backup_rmeta_0]     hdd ewi-aor---   1.00g                                                     /dev/sdb2(2560)
  [backup_rmeta_1]     hdd ewi-aor---   1.00g                                                     /dev/sdc2(0)
  [backup_rmeta_2]     hdd ewi-aor---   1.00g                                                     /dev/sda2(1025)
  [backup_rmeta_3]     hdd ewi-aor---   1.00g                                                     /dev/sdg2(3157)
  tm_aircat            hdd rwi-aor---   1.00t                                    100.00           tm_aircat_rimage_0(0),tm_aircat_rimage_1(0)
  [tm_aircat_rimage_0] hdd iwi-aor---   1.00t                                                     /dev/sda2(0)
  [tm_aircat_rimage_1] hdd iwi-aor---   1.00t                                                     /dev/sdg2(2133)
  [tm_aircat_rmeta_0]  hdd ewi-aor---   1.00g                                                     /dev/sda2(1024)
  [tm_aircat_rmeta_1]  hdd ewi-aor---   1.00g                                                     /dev/sdg2(2132)
  tm_joram             hdd rwi-aor---   1.50t                                    100.00           tm_joram_rimage_0(0),tm_joram_rimage_1(0)
  [tm_joram_rimage_0]  hdd iwi-aor---   1.50t                                                     /dev/sdc2(2049)
  [tm_joram_rimage_1]  hdd iwi-aor---   1.50t                                                     /dev/sdb2(1)
  [tm_joram_rmeta_0]   hdd ewi-aor---   1.00g                                                     /dev/sdc2(3585)
  [tm_joram_rmeta_1]   hdd ewi-aor---   1.00g                                                     /dev/sdb2(0)
  tm_mini              hdd rwi-aor--- 512.00g                                    100.00           tm_mini_rimage_0(0),tm_mini_rimage_1(0)
  [tm_mini_rimage_0]   hdd iwi-aor--- 512.00g                                                     /dev/sdb2(8786)
  [tm_mini_rimage_1]   hdd iwi-aor--- 512.00g                                                     /dev/sdc2(4609)
  [tm_mini_rmeta_0]    hdd ewi-aor---   1.00g                                                     /dev/sdb2(9298)
  [tm_mini_rmeta_1]    hdd ewi-aor---   1.00g                                                     /dev/sdc2(4608)
  win_kk               hdd rwi-aor---   2.08t                                    100.00           win_kk_rimage_0(0),win_kk_rimage_1(0)
  [win_kk_rimage_0]    hdd iwi-aor---   2.08t                                                     /dev/sdg2(2)
  [win_kk_rimage_1]    hdd iwi-aor---   2.08t                                                     /dev/sda2(3075)
  [win_kk_rmeta_0]     hdd ewi-aor---   1.00g                                                     /dev/sdg2(0)
  [win_kk_rmeta_1]     hdd ewi-aor---   1.00g                                                     /dev/sda2(3074)
```

Another way to look at the construct is `lsblk`:

```console
# lsblk /dev/sd{a,b,c,g}
NAME                       MAJ:MIN RM  SIZE RO TYPE MOUNTPOINT
sda                          8:0    0  9.1T  0 disk
├─sda1                       8:1    0   10G  0 part
└─sda2                       8:2    0  9.1T  0 part
  ├─hdd-tm_aircat_rmeta_0  253:18   0    1G  0 lvm
  │ └─hdd-tm_aircat        253:20   0    1T  0 lvm  /export/tm_aircat
  ├─hdd-tm_aircat_rimage_0 253:25   0    1T  0 lvm
  │ └─hdd-tm_aircat        253:20   0    1T  0 lvm  /export/tm_aircat
  ├─hdd-backup_rmeta_2     253:35   0    1G  0 lvm
  │ └─hdd-backup           253:39   0    4T  0 lvm  /backup
  ├─hdd-backup_rimage_2    253:36   0    2T  0 lvm
  │ └─hdd-backup           253:39   0    4T  0 lvm  /backup
  ├─hdd-win_kk_rmeta_1     253:42   0    1G  0 lvm
  │ └─hdd-win_kk           253:23   0  2.1T  0 lvm  /export/win_kk
  └─hdd-win_kk_rimage_1    253:43   0  2.1T  0 lvm
    └─hdd-win_kk           253:23   0  2.1T  0 lvm  /export/win_kk
...
```

# What is where?

And of course, we might be interested into the actual distribution of data on the disk:

```console
# pvdisplay --map /dev/sd{a,b,c,g}2
...
  --- Physical volume ---
  PV Name               /dev/sdg2
  VG Name               hdd
  PV Size               9.09 TiB / not usable 1022.98 MiB
  Allocatable           yes
  PE Size               1.00 GiB
  Total PE              9303
  Free PE               4098
  Allocated PE          5205
  PV UUID               ...

  --- Physical Segments ---
  Physical extent 0 to 0:
    Logical volume      /dev/hdd/win_kk_rmeta_0
    Logical extents     0 to 0
  Physical extent 1 to 1:
    FREE
  Physical extent 2 to 2131:
    Logical volume      /dev/hdd/win_kk_rimage_0
    Logical extents     0 to 2129
  Physical extent 2132 to 2132:
    Logical volume      /dev/hdd/tm_aircat_rmeta_1
    Logical extents     0 to 0
  Physical extent 2133 to 3156:
    Logical volume      /dev/hdd/tm_aircat_rimage_1
    Logical extents     0 to 1023
  Physical extent 3157 to 3157:
    Logical volume      /dev/hdd/backup_rmeta_3
    Logical extents     0 to 0
  Physical extent 3158 to 5205:
    Logical volume      /dev/hdd/backup_rimage_3
    Logical extents     0 to 2047
  Physical extent 5206 to 9302:
    FREE
```

# Defragmenting `dev/sdb2`

Due to the way we created things, initially all `RAID1` have the left leg of their mirror on `/dev/sdb2`, because that is where we `pvmove`ed stuff initially.
We might want to fix that, and push a few things over.
I did that, as can be seen by the `lvs -a -o +devices hdd` output further up.

Here is how:

```console
# pvmove -n <LV_name> /dev/sdb2 /dev/sdg2
...
```

This will move all data belonging to `LV_name` that is currently on `/dev/sdb2` to `/dev/sdg2`.
Again, this will take a long time, and there should be no other sync action currently active for maximum speed, as rotating disks slow down a lot when there are competing disk seeks.

This leaves us with a fragmented `/dev/sdb2` and LVs on higher numbered extents, which are a lot slower than lower numbered extents.
We could fix that as well, again with `pvmove`:

```console 
# pvdisplay --map /dev/sdc2
...
  Physical extent 3587 to 3596:
    Logical volume      /dev/hdd/keks_rimage_1
    Logical extents     0 to 9
  Physical extent 3597 to 4607:
    FREE
...
# pvmove -n keks --alloc anywhere /dev/sdc2:3587-3596 /dev/sdc2:4000-4009
 /dev/sdc2: Moved: 0.00%
 ...
 /dev/sdc2: Moved: 100.00%
 ```

This moves extents internally on a drive.
`pvmove` normally refuses to do this, so we have to tell it to shut up about this, using `--alloc anywhere`.
We then use extent-addressing to change the map manually:
We move data from `/dev/sdc2:3587-3596`, the entire `keks` Test-LV, somewhere into the `FREE` space, `4000-4009`.
The result looks like this:

```console
...
  Physical extent 3587 to 3999:
    FREE
  Physical extent 4000 to 4009:
    Logical volume      /dev/hdd/keks_rimage_1
    Logical extents     0 to 9
  Physical extent 4010 to 4607:
    FREE
...
# lvremove /dev/hdd/keks
Do you really want to remove and DISCARD active logical volume hdd/keks? [y/n]: y
  Logical volume "keks" successfully removed
```

And that concludes a largely pointless refactoring of my home storage, because I could.

```console
# vgs
  VG     #PV #LV #SN Attr   VSize   VFree
  data     2  15   0 wz--n-   7.28t   3.25t
  hdd      4   5   0 wz--n-  36.34t  18.17t
  system   1   4   0 wz--n- 466.94g 234.94g
```

# Do you have checksums?

Not yet.
There is a thing called `dm-integrity`, though, and a [gist](https://gist.github.com/MawKKe/caa2bbf7edcc072129d73b61ae7815fb) that I have to try. The [dm-integrity Documentation](https://www.kernel.org/doc/html/latest/admin-guide/device-mapper/dm-integrity.html) is here. 
And `integritysetup` is part of `cryptsetup-bin` on Ubuntu.
