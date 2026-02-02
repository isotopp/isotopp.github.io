---
author: isotopp
title: "Don't say Backup, say Restore"
date: "2023-08-23T01:02:03Z"
feature-img: assets/img/background/rijksmuseum.jpg
toc: false
tags:
- lang_en
- devops
- data center
aliases:
  - /2023/08/23/dont-say-backup-say-restore.html
---
This is about the third story I hear about a Fedi instance losing all their data because of a CI/CD mistake.

[Lily Cohen (@lily@firefish.social) has bad news.](https://firefish.social/notes/9iqefgi8rzfksnqc)

Hugops, but also the usual grizzled old sysadmin advice:

## Never say backup. Always say restore. This changes your mind.

A backup is a cost center.
It has no value, it has only cost.
Only a restore has a proven value, and comes with knowledge:

- You know you actually can restore, the backup was complete and does connect.
- You know how long the restore took, so you know the time to restore when asked. Not an estimate. The actual time.
- You know the restore procedure.

Restore *every* backup *all* the time, then throw the recovered instance away. 
Keep the metrics, keep the backup.

## There is no such thing as immutable, statelessness or whatever.

Parts of your setup may be stateless deployments with immutable images. 
That is, because you collected all system state and put it into one or two selected locations.
You can redeploy everything but these selected locations.

If you drop them, if you make a config mistake, these things are gone gone.
They cannot be redeployed unless you have taken measures to do so.
See above, item 1.

## Devops is easy except for the stateful parts.

That is why the storage people and the database people all look down on you hipster devops people and make condescending remarks. 🙂
Yah, ok, they are nicer than you probably think they are,
but they *do* have a completely different outlook on operations.

Listen and learn. Also, restore test.

Also,
[ArgoCD: No prune resources](https://argo-cd.readthedocs.io/en/stable/user-guide/sync-options/#no-prune-resources)
and
[Kubernetes PV Reclaim Policy](https://kubernetes.io/docs/tasks/administer-cluster/change-pv-reclaim-policy/)
"Retain, not Delete."

There are people who have taken steps to prevent their CI/CD from messing with EBS volumes,
S3 buckets or K8s Persistent Volumes, and there are people who will lose data in the future.

Don't be in the second group.

![](2023/08/backup-restore-01.jpg)

*"Nobody wants backup.
Everybody wants restore."
  -- Martin Seeger*

See also
[Gitlab Data Loss]({{< relref "2017-02-01-nobody-wants-backup-everybody-wants-restore.md" >}}).
