---
author: isotopp
title: "Time to grow the file server"
date: 2022-02-01T21:06:03+01:00
feature-img: assets/img/background/rijksmuseum.jpg
tags:
- lang_en
- computer
- linux
- storage
---

The old file server was full, and since the little one got more local storage in his laptop, I also needed more storage for backup to match.
I am running a 5x cage using up 3 disk slots in a Midi-Tower.
Two slots are filled with Seagate Ironwolf 10 TB disks already, the rest is available.

[![](/uploads/2022/02/cold-storage1.jpg)](https://www.amazon.de/-/en/gp/product/B019HE69FO)

*A 5x [hot swap disk cage](https://www.amazon.de/-/en/gp/product/B019HE69FO) using 3 disk slots in a midi tower.* 

The disk situation in the machine was like this:

```console
kris@server:~$ sudo vgs
[sudo] password for kris: 
  VG     #PV #LV #SN Attr   VSize   VFree
  data     2  16   0 wz--n-   7.28t   3.24t
  hdd      2   5   0 wz--n-   9.08t   5.00g
  system   1   4   0 wz--n- 466.94g 234.94g
```

The `hdd` volume group is running in a RAID-1 configuration using `mdraid` for historical reasons - this is a very old machine.
Additional space would be added as another `mdraid`, and then linearly extend the existing volume.
That is fine, the disks are used as backup targets for a number of Mac devices only and speed or seeks are not our primary goal.

I ordered two additional Seagate Ironwolf 10 TB disks to match the existing ones.
They came in rather cold from the delivery van:

![](/uploads/2022/02/cold-storage2.jpg)

*After unpacking the disk chassis had single digit celsius temperatures.
When I remembered to take a thermal image they were already warmed up a bit.
I let them warm up a bit more before I put them in.*

Pushing in the disks generated a lot of kernel log, and also a nice graph in the temperature monitoring:

![](/uploads/2022/02/cold-storage3.jpg)

*The new disks are warming up rapidly. The dropping line is a scratch disk that I have been taking out of slot 3 and pushing back in into slot 5.*

```console
[556459.695008] ata2: SRST failed (errno=-16)
[556461.651016] ata2: SATA link up 3.0 Gbps (SStatus 123 SControl 300)
[556461.671217] ata2.00: ATA-11: ST10000VN0008-2PJ103, SC61, max UDMA/133
[556461.671220] ata2.00: 19532873728 sectors, multi 16: LBA48 NCQ (depth 31/32)
[556461.676016] ata2.00: configured for UDMA/133
[556461.676157] scsi 1:0:0:0: Direct-Access     ATA      ST10000VN0008-2P SC61 PQ: 0 ANSI: 5
[556461.676549] sd 1:0:0:0: Attached scsi generic sg1 type 0
[556461.676844] sd 1:0:0:0: [sdb] 19532873728 512-byte logical blocks: (10.0 TB/9.10 TiB)
[556461.676847] sd 1:0:0:0: [sdb] 4096-byte physical blocks
[556461.676879] sd 1:0:0:0: [sdb] Write Protect is off
[556461.676885] sd 1:0:0:0: [sdb] Mode Sense: 00 3a 00 00
[556461.676973] sd 1:0:0:0: [sdb] Write cache: enabled, read cache: enabled, doesn't support DPO or FUA
[556461.771798] sd 1:0:0:0: [sdb] Attached SCSI disk
[556464.406986] ata3: link is slow to respond, please be patient (ready=0)
[556468.514986] ata3: SRST failed (errno=-16)
[556470.586999] ata3: SATA link up 3.0 Gbps (SStatus 123 SControl 300)
[556470.589417] ata3.00: ATA-11: ST10000VN0008-2PJ103, SC61, max UDMA/133
[556470.589420] ata3.00: 19532873728 sectors, multi 16: LBA48 NCQ (depth 31/32)
[556470.594222] ata3.00: configured for UDMA/133
[556470.594361] scsi 2:0:0:0: Direct-Access     ATA      ST10000VN0008-2P SC61 PQ: 0 ANSI: 5
[556470.594676] sd 2:0:0:0: Attached scsi generic sg2 type 0
[556470.594933] sd 2:0:0:0: [sdc] 19532873728 512-byte logical blocks: (10.0 TB/9.10 TiB)
[556470.594937] sd 2:0:0:0: [sdc] 4096-byte physical blocks
[556470.595017] sd 2:0:0:0: [sdc] Write Protect is off
[556470.595022] sd 2:0:0:0: [sdc] Mode Sense: 00 3a 00 00
[556470.595120] sd 2:0:0:0: [sdc] Write cache: enabled, read cache: enabled, doesn't support DPO or FUA
[556470.695659] sd 2:0:0:0: [sdc] Attached SCSI disk
```

*Yup, 3 GBps. This is an old `i7-3770` with an old SATA subsystem to match.*

I created partition tables using `sfdisk`, copying from the existing `sda` (another Ironwolf) to the new devices `sdb` and `sdc`.

```console
kris@server:~$ sudo sfdisk -d /dev/sda | sudo sfdisk /dev/sdb
...
kris@server:~$ sudo sfdisk -d /dev/sda | sudo sfdisk /dev/sdc
...
kris@server:~$ sudo sfdisk -d /dev/sdb
label: gpt
label-id: ...
device: /dev/sdb
unit: sectors
first-lba: 34
last-lba: 19532873694

/dev/sdb1 : start=        2048, size=    20971520, type=..., uuid=...., name="Linux filesystem"
/dev/sdb2 : start=    20973568, size= 19511900127, type=..., uuid=...., name="Linux RAID"
```

This works, because `sfdisk` like `sgdisk` understands about MBR and GPT partition tables, and can handle large 10 TB partitions. We have a 10 GB `/dev/sdb1` as a potential boot space, and use the rest of the disk as a giant `/dev/sdb2` in LVM2. The other disk, `/dev/sdc` matches this.

We can then construct the RAID from the two partitions `/dev/sd{b,c}2`. Because this is a large device, `mdadm` will also automatically add an internal bitmap.

```console
kris@server:~$ sudo mdadm -C /dev/md126 --level=1 --raid-devices=2 /dev/sd{b,c}2
...
kris@server:~$ sudo mdadm --detail /dev/md126
/dev/md126:
           Version : 1.2
     Creation Time : Tue Feb  1 20:23:20 2022
        Raid Level : raid1
        Array Size : 9755817920 (9303.87 GiB 9989.96 GB)
     Used Dev Size : 9755817920 (9303.87 GiB 9989.96 GB)
      Raid Devices : 2
     Total Devices : 2
       Persistence : Superblock is persistent

     Intent Bitmap : Internal

       Update Time : Tue Feb  1 21:27:07 2022
             State : clean, resyncing
    Active Devices : 2
   Working Devices : 2
    Failed Devices : 0
     Spare Devices : 0

Consistency Policy : bitmap

     Resync Status : 0% complete

              Name : server:126  (local to host server)
              UUID : ...
            Events : 799

    Number   Major   Minor   RaidDevice State
       0       8       18        0      active sync   /dev/sdb2
       1       8       34        1      active sync   /dev/sdc2
```

And while the RAID synchronizes in the background, we can turn the new device into a physical volume and add it to the `hdd` volume group.

```console
kris@server:~$ sudo pvcreate /dev/md126
 Physical volume "dev/md126" successfully created.
kris@server:~$ sudo vgextend hdd /dev/md126
 Volume Group "hdd" successfully extended
kris@server:~$ vgs
  VG     #PV #LV #SN Attr   VSize   VFree
  data     2  16   0 wz--n-   7.28t   3.24t
  hdd      2   5   0 wz--n-  18.17t   9.09t
  system   1   4   0 wz--n- 466.94g 234.94g
```

With that, we now have sufficient disk space to continue to work.
After the sync completes, I will `lvconvert` two existing backup partitions into mirrors to move them to the new disk pair, and then dissolve the mirror, dropping the image on the old half.
