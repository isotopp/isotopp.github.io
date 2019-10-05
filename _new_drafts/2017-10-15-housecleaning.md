---
layout: post
status: publish
published: true
title: Housecleaning…
author: isotopp
author_login: kris
author_email: kristian.koehntopp@gmail.com
wordpress_id: 2702
wordpress_url: http://blog.koehntopp.info/?p=2702
date: '2017-10-15 16:36:09 +0200'
date_gmt: '2017-10-15 14:36:09 +0200'
categories:
- Small computers
tags: []
---
<p>These are all the defective harddisks in the household - I finally got to remove them, grab the files I still needed to have (in one case) and replace them. [caption id="attachment\_2704" align="aligncenter" width="640"][![](http://blog.koehntopp.info/wp-content/uploads/2017/10/defekte-platten-640x480.jpg)](http://blog.koehntopp.info/wp-content/uploads/2017/10/defekte-platten.jpg) Todays catch: all defective HDDs in the household[/caption] <!--more--></p>
<p>- 750 GB HDD from a Buffalo USB drive, used as a time machine in the living room Mac mini<br />
  - Date Code 07231 corresponds to 2006-12-06.<br />
- 1000 GB HDD in a WD Elements drive, used as a local time machine in Sammy's computer<br />
  - 18-Jul-2008<br />
- 1000 GB HDD in a WD Elements drive, used as a local time machine in my Computer.<br />
  - I managed to get the accumulated license code archive from this one. Due to an accident, additional replica in a centralised form didn't exist (I still have the mail archive, but there is a lot of other stuff in it)<br />
  - 10-Sep-2007<br />
- 1500 GB HDD from the file server. Removed that one due to smart warnings, and a 3000 GB sister drive, placed 2x 3000 GB WD Red. Used in a BTRFS compound as a backup for the other backups.<br />
  - &nbsp;22-Apr-2010<br />
  - Drive has been opened to show the little one the insides.<br />
 Adding backblaze external backup now, too. The Fileserver/Data Grave now looks like this: </p>
<p>    [root@server:~] # lsblk --nodeps --list --output NAME,VENDOR,MODEL,SIZE NAME VENDOR MODEL SIZE sda ATA SAMSUNG HD154UI 1.4T ? sdb ATA WDC WD30EFRX-68E 2.7T btrfs /backup sdc ATA SAMSUNG HD154UI 1.4T ? sdd ATA WDC WD30EFRX-68E 2.7T btrfs /backup sde ATA TOSHIBA DT01ABA3 2.7T R5/xfs /export sdf ATA TOSHIBA MD04ACA4 3.7T R5/xfs /export sdg ATA WDC WD30EFRX-68A 2.7T R5/xfs /export sdh ATA WDC WD30EZRX-00D 2.7T R5/xfs /export sdi ATA M4-CT512M4SSD2 477G SSD boot/root {% endhighlight %} The sdi is the system SSD, it just carries a fileserver Linux installation. The sde-sdh are a RAID5 with LVM2, and a lot of '/export/$PURPOSE' filesystems on them. Many of them are remote time machines for all the mobile computers in the household (all have local time machine + remote time machine). Due to a purchase error, sdf is one TB too large, the overshoot is being used as a scratch partition outside of the MD compound. Previously, sda, sdb, sdc and sdd have been a large 4x 1.5TB BTRFS. This is now the two new WD RED in a 2x 3.0TB BTRFS. The two 1.5TB Samsung are free and unused, I need to see what I will be doing with them.</p>
