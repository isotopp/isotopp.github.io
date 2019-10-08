---
layout: post
status: publish
published: true
title: Nobody wants backup. Everybody wants restore.
author-id: isotopp
feature-img: assets/img/background/rijksmuseum.jpg
date: '2017-02-01 09:54:27 +0100'
tags:
- data center
- lang_en
---
![](/uploads/2017/02/mysql-backup-and-recovery-15-638.jpg)

Operations matter. I know the Hipster crowd does not like to
hear that, cloud or not. But reality has a way of making itself
heard, whether you like it or not. 

[Gitlab.com just discovered that.](https://docs.google.com/document/d/1GCK53YDcBWQveod9kfzW-VCxIABGiryG7_z_6jHdVik/pub)

So some sysadmin deleted the wrong folder, which in itself
should not be a problem.<!--more--> But in the process of trying
to restore things, the following discoveries have been made:

- LVM snapshots are by default only taken once every 24 hours.
  YP happened to run one manually about 6 hours prior to the
  outage
- Regular backups seem to also only be taken once per 24 hours,
  though YP has not yet been able to figure out where they are
  stored. According to JN these don’t appear to be working,
  producing files only a few bytes in size.
- SH: It looks like pg\_dump may be failing because PostgreSQL
  9.2 binaries are being run instead of 9.6 binaries. This
  happens because omnibus only uses Pg 9.6 if data/PG\_VERSION
  is set to 9.6, but on workers this file does not exist. As a
  result it defaults to 9.2, failing silently. No SQL dumps were
  made as a result. Fog gem may have cleaned out older backups.
- Disk snapshots in Azure are enabled for the NFS server, but
  not for the DB servers.
- The synchronisation process removes webhooks once it has
  synchronised data to staging. Unless we can pull these from a
  regular backup from the past 24 hours they will be lostThe
  replication procedure is super fragile, prone to error, relies
  on a handful of random shell scripts, and is badly documented
- Our backups to S3 apparently don’t work either: the bucket is
  empty

If you think your sysadmin is paranoid, let this be your lesson. They are
not. Operations do matter, even (especially) in the cloud.

**EDIT:** Michael Renner asks some interesting questions: 
> Some thoughts for GitLab: What is WAL shipping? What is pgbouncer? Why
> does everyone hate Slony? Why is EC2 so slow?

[![](/uploads/2017/02/Screen-Shot-2017-02-01-at-10.45.07.png)](https://twitter.com/terrorobe/status/826706562563588098)

Tweet: [@Terrorobe](https://twitter.com/terrorobe/status/826706562563588098)

People using Slony on a Postgres 9.6 deserve everything that
happens to them. Slony is trigger based replication breakage
from the deepest circles of hell, and Postgres has excellent,
stable and fast internal replications for several years now.

Also, what he says about log shipping: There is no reason at all
to lose any write ever on a Postgres, nor to have much downtime
at all with proper replication. Operations do matter. Cloud
ain't gonna change that.

**EDIT:** Dedicating 1st of February as "Check your Backups Day"

[![](/uploads/2017/02/Screen-Shot-2017-02-01-at-12.53.14.png)](http://checkyourbackups.work/)

[Check your Backups Day](http://checkyourbackups.work/)
