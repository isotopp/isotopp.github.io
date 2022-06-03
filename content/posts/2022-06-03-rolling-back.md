---
author: isotopp
date: "2022-06-02T08:42Z"
feature-img: assets/img/background/mysql.jpg
title: "Rolling MySQL back and forward"
published: true
tags:
- database
- mysql
- lang_en
---

Where I work, we [manage databases in an automated way]({{< ref "/content/posts/2021-03-24-a-lot-of-mysql.md" >}}).
Not as automated as I wish it to be, but largely without touching boxes.

We have been doing so for a long time.

Over ten years ago, I set the team the challenge "be on an arbitrary version of MySQL within 20 workdays (one calendar month), no matter how many servers we have".
We are there now, in a way: we are on a 30-day refresh cycle for our bare metal cloud, and we match that cycle for our virtualized fleet.
It was a long road.

# Cloning, upgrading and downgrading

The three most basic operations we need to solve in order to manage a fleet of instances are:
creating clones of an existing database instance in a way that they can participate in a replication hierarchy,
upgrading instances to a new minor or major version, 
and downgrading instances.

## Cloning

Our tooling has three ways of cloning databases:

- Using the high-speed native [`CLONE`](https://dev.mysql.com/doc/refman/8.0/en/clone-plugin.html) command.
- Using Percona `xtrabackup`.
- Shutting down an instance and running `rsync`.

Using native cloning is by far the fastest and most convenient version, but it also comes with the most restrictions:
Currently MySQL insists that the donor and the receiving instance be the exact same version.
This makes `CLONE` the preferred method for scaling operations, but useless in upgrade and downgrade processing.

`CLONE` could be much more useful in upgrade contexts:
MySQL knows how to upgrade a datadir in-place.
There is even no longer a need to run an external `mysql_upgrade` program, the code is now part of the server core.

It would be easy to allow cloning from a lower version donor, drop the received data into a local datadir and then restart the server process into an upgrade cycle.
For forward version movements this would be a big improvement.

For us, `rsync` is an acceptable workaround to cloning, even if it is somewhat limited in speed.
That is, because we consider any use of MySQL without a minimum number of replicas broken, and prevent it.
Even for customers who think they do not need it -- eventually they all do.

So we can always stop an instance, and take our time to do things with it after we have copied it.
It allows us to experiment, give extra capacity or try out new versions safely, even Pre-GA MySQL.

Our safe fallback and the best compromise in speed, comfort and safety is, as always, Percona `xtrabackup`.

## Upgrading

In the past, MySQL had the rule that there are never on-disk format changes within a single major version.
That made it easy to move forward and backward between versions within a major release.
It was also kind of necessary -- the release quality of MySQL back then was not always of the kind where you could upgrade to the most recent version and be certain that it was an improvement.

A lot has changed since then, and specifically MySQL 8 has seen fantastic improvements in refactoring of the codebase, in feature planning and in an improved software production process.

A bit of these improvements has been traded for evolutionary speed, though:
With MySQL 8, on-disk format changes within the release series have been explicitly allowed, announced and in fact also happened several times.

This became a lot easier since `mysql_upgrade` functionality has been integrated into the server, and made automatic.

## Downgrading

Downgrades have never been a great concern for MySQL.

In the past that was not an issue, because upgrading between major versions was seen as a major effort and did not happen en-passant and outside a migration project.
That meant extensive testing, and retaining binary, up-to-date data directories of the replication hierarchy in question.
In case a downgrade was necessary, one would reclone the old version and inject it into the replication tree, reaping instances running the new version to balance.

All this assumes that you did not yet upgrade the primary, which in any seamless migration always is the last step.

# MySQL 8 complicates this a bit

With MySQL 8, this becomes a bit more complicated, or more common.

While MySQL 8 gives us very welcome new features, ([here are some highlights](https://www.percona.com/blog/quick-peek-at-mysql-8-0-29/)), they are sometimes a bit… undertested.

Some examples:

- Our [default clone mechanism](https://www.percona.com/blog/mysql-8-0-29-and-percona-xtrabackup-incompatibilities/) does not work yet with 8.0.29. In our case, it affects several thousand instances that fall back to `rsync` cloning, because `CLONE`'s strict version requirements render it useless, too.
- Some people experience [corruption with the new improved instance schema change](https://forums.mysql.com/read.php?22,704532,704675) in 8.0.29 and need to consider downgrading to 8.0.28. 
- We had an instance the JAMF database, tables without primary key, virtual columns and broken utf16 combine in an unholy and explosive way that required us going back from 8.0.28 to 8.0.27.
- And there are some problems with Spatial Indexes not being used in 8.0.29 that can make it necessary to downgrade to 8.0.28 from 8.0.29.

All of these involve at one or two major versions to fix.
Being able to go back "a quarter or half a year" would make this much easier for everyone:
Users and Developers, and take a lot of strain of the vendor/customer relationship.

## `CLONE` would profit, too

As discussed above, `CLONE` has extremely strict version requirements between donor and destination.

The upgrade path is fixable relatively trivial, as shown above, by falling into a server restart with upgrading.
A guaranteed two-minor-version downgradability (6 months window) could enable `CLONE` to also handle downgrades, at speed.
It would make version movements up and down a lot less risky.

That would be a lot of value added for little effort.

# Dump and Restore are not an option

The default way to upgrade and downgrade a database is to dump and restore.
For Postgres for many years this was the recommended way to jump to the next version: `pg_dump` and be done with it.

Obviously that works only for toy deployments, because it does not scale.
Dumping throws away the indexes, and importing the dump involves reading the data, scanning and sorting it, and then rebuilding the index structures again.

We have been there, in the past.

## The 5.1 to 5.5 disaster

For our upgrade from MySQL 5.1 to 5.5, our starting point was a non-GA version of MySQL 5.1 that included a bugfix we considered critical.
For this version, no binary, in-place upgrade path to 5.5 existed.

That meant, our upgrade to 5.5 consisted in dumping each replication hierarchy and importing the dump into 5.5.
The 5.5 instance would then be connected to the replication tree, and had opportunity to catch up.
We would make it an intermediate primary eating 5.1 binlog, and emitting 5.5 binlog to further 5.5 instances we cloned out of the initial one.
At the same time we would reap production 5.1 instances to match the growth of the 5.5 population.

![](/uploads/2022/06/mysql-upgrade.png)

Eventually we would move writes down from the 5.1 primary, promoting the 5.5 intermediate primary to try primary, "beheading" the replication hierarchy.
Back then we already had a three-digit number of MySQL replication hierarchies, and even back then a replication hierarchy typically had a disk footprint of 1-2 TB (ie 2-4h at 200 MB/s).

All this takes around a week per hierarchy, and was not properly automated back then.
It meant that the transition from 5.1 to 5.5 took us almost two years.
In fact, the entire 5.1 upgrade experience is part of why we have so much automation.

## MySQL 8 makes this easier

Things are marginally better in MySQL 8 these days:

- You can [turn off redo logging](https://dev.mysql.com/doc/refman/8.0/en/innodb-redo-log.html#innodb-disable-redo-logging) while doing bulk loading or importing (8.0.21 or better).
- You can do [parallel index creation](https://dev.mysql.com/doc/refman/8.0/en/online-ddl-parallel-thread-configuration.html), so that is faster, if you have the CPU and memory to burn (8.0.27 or better) and your tables are within the constraints given.

On the other hand, data grew.
Sometimes imports can become multi-month projects:
We had a 120 TB MariaDB instance that was converted to Oracle MySQL 5.7 by dump and reload.
This took a machine with AMD EPYC CPU, 1 TB of RAM, and multiple months to complete.
The conversion saga was painful enough to warrant a [Percona Live talk](https://twitter.com/_digitalknight/status/1526671502116114435) about the entire thing by Mohammed Gaafar and Pep Pla.

## MySQL 8 makes it worse

While MySQL makes "downgrades by reading a dump" somewhat better, at the some time there are aspects that make it worse.
The new dynamic permission system in MySQL 8 makes it easy to add new privileges over time.
The result is that privileges now change more rapidly.

When you dump and reload (or downgrade a binary datadir), there is no mechanism currently to handle this safely.

For example, 8.0.28 might add `AUDIT_ABORT_EXEMPT`, and downgrading this in any way to 8.0.27 requires some `sed` artistics in the dump or other kludgery: 8.0.27 won't overlook the privilege names it does not know anything about.
Clearly, here is a tooling gap.

# TL;DR

Databases are where the state is kept.
State has size, and copying state is slow.
That is why everybody is always very protective of state.
Do not treat on-disk data the Yolo way that Devops treats stateless instances.

- Introducing new features in a major version is okay if you have a mature codebase and development process.
- Changing persistent state on disk is more complicated than that.
  - Upgrades should always be binary and in-place.
  - Downgrades should be possible binary and in-place at least for 2 minor version (6 months)
- If you do not allow that, it is painful for everybody.
  - That includes us, because we can test slower, so Oracle MySQL gets less feedback.
  - That includes Oracle MySQL itself, because it makes nifty features such as `CLONE` needlessly specific and much less useful.
- We will, even with today's the degree of automation, never be able to upgrade by dump and restore, just because reindexing is very, very expensive. It is just too much data.

Binary in-place upgrade and downgrade paths are completely non-optional. 
We will never have the hell of the 5.1 to 5.5 transition again.
We simply cannot afford this anymore.
