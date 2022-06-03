---
author: isotopp
date: "2022-06-02T08:42Z"
feature-img: assets/img/background/mysql.jpg
title: "Rolling back MySQL versions"
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

# The 5.1 to 5.5 disaster

The worst place we have been in the past was our transition from MySQL 5.1 to 5.5. 

Along the way we picked up a mutant Non-GA version of 5.1 for reasons that seemed valid at that time.
But unfortunately, this version changed the on-disk format to fix a thing.
That meant we had no binary "on-disk", "in-place" upgrade path for us, for any system that was on this particular strain of 5.1.

## In-place upgrades are fast

Normally, upgrading MySQL is easy:
You stop the server, push the new RPM, run `mysql_upgrade` (now integrated and automatic), and the on-disk format is adjusted.
Then the server comes up again.
Takes a minute or two, plus time to reheat the caches.

Also, downgrading MySQL is often easy and, important!, possible:
**In the past the on-disk format only changed between major versions.**

In our case, none of these options were open to us:
A binary transition between our mutant non-GA 5.1 and 5.5 was impossible.
We had to dump and reload all the data.

Back then we already had a three-digit number of MySQL replication hierarchies, and even back then a replication hierarchy typically had a disk footprint of 1-2 TB (ie 2-4h at 200 MB/s).

So we would dump the 5.1 database, reload it into a 5.5 instance, recreating all the indexes (which makes it slow), then attach it in replication and wait for it to catch up.

![](/uploads/2022/06/mysql-upgrade.png)

*Converting from 5.1 to 5.5 without interruption, by rebuilding the replication tree under a new intermediate, then beheading the chain. Reimporting a dump into a 5.5 instance is the slowest step, recloning was a nuisance back then -- it is automated these days.*

We would then make more replicas under the 5.5 which acts as an intermediate primary, and remove 5.1 replicas to match.
In the end we would move writes down from the 5.1 primary to the 5.5 intermediate primary, behead the tree and be done.
That takes around a week per hierarchy, and was not properly automated back then. In fact, the entire experience is part of why we have so much automation.

It meant that the transition from 5.1 to 5.5 took us almost two years.

## Why the mutant?

We had the 5.1 mutant because of a bug fix that we thought we needed, which led to a change in on-disk format.
We completely underestimated the impact of a breaking change in on-disk format on our operations, and the amount of toil coming from this.

And we paid dearly for us.

# MySQL 8 and today's situation

These days, phase 2 of that conversion would be completely automated:
If we have a working binary datadir, we can reclone it at scale, limited by the media speed or the cluster quota.
Still, we need an up-to-date binary datadir to be able to do that.

These days, MySQL 8 broke with the promise of "no new features, no new disk formats with a single major version".
The former is okay, and in fact, welcome.
It has had some impact on stability, but in general the development process of MySQL and the refactoring of its internals have become good enough to offset that, mostly.
So, yes, we are okay with the new MySQL 8 development model, and we are in fact making use of new features.

The latter is catastrophic, because it leads to either incomplete upgrades for us, or leads us back into a dump-and-reload hell.

Let me explain:

- In order to roll back, we do need a current binary datadir that is compatible with the version we want to roll back to.
- Replication has an order, a replica must be newer or equal in version to its source.
  Otherwise, it risks that things coming down the replication stream are too new, and cannot be recognized.
- So in order to have a valid binary datadir *and* have a valid replication hierarchy, we cannot behead a primary until we trust that we never want to roll back.

Or, we do behead the chain and promote one of the new version intermediates to writeable true primary.
In which case we lose rollback capability, and are back to dump and reload.

Only we now have more chains, and some databases are truly too large to ever dump and reload.
I mean, we had a 120 TB MariaDB instance that was converted to Oracle MySQL 5.7 by dump and reload, and that took a machine with AMD EPYC CPU, 1 TB of RAM and multiple months to complete.
The conversion saga was painful enough to warrant a [Percona Live talk](https://twitter.com/_digitalknight/status/1526671502116114435) about the entire thing by Simon Mudd and Pep Pla.

# Sometimes changes fail

MySQL 8 gives us a lot of new features, [here are some highlights](https://www.percona.com/blog/quick-peek-at-mysql-8-0-29/).
They are very welcome, but… untested.

They come with breaking changes, [disabling our default clone mechanism](https://www.percona.com/blog/mysql-8-0-29-and-percona-xtrabackup-incompatibilities/).
They [seem to be unstable](https://forums.mysql.com/read.php?22,704532,704675) for not just us, in one way or the other.
There are other examples:
- in the JAMF database, tables without primary key, virtual columns and broken utf16 combine in an unholy and explosive way that require going back from 8.0.28 to 8.0.27.
- And there are some problems with Spatial Indexes not being used in 8.0.29 that can make it necessary to downgrade to 8.0.28 from 8.0.29. 

All of these involve at one or two major versions to fix. 
Being able to go back "a quarter or half a year" would make this much easier for everyone:
Users and Developers, and take a lot of strain of the vendor/customer relationship.


## My default CLONE rant

Disk format changes also get somehow in the way of other features:

Our default clone mechanism is not [`CLONE`](https://dev.mysql.com/doc/refman/8.0/en/clone-plugin.html).
That is, because `CLONE` requires the same exact version of the database at the donor and receiver instance, which makes it completely useless for upgrades.

Clone is dependent on the on-disk format not changing for good reasons.
The entire point of Clone is to not mess with formats and just shifting data between instances, multi-threaded, as fast as possible.

By managing on-disk format changes more conservatively, and giving a two-minor-versions window (6 months), Oracle MySQL could rely on Oracle MySQL's on-disk format.
It could handle `CLONE` based upgrades properly, instead of having everybody depend on `xtrabackup` catching up.

That would be a lot of value added for little effort.

# TL;DR

Databases are where the state is kept.
State has size, and copying state is slow.
That is why everybody is always very protective of state.
Do not treat on-disk data the Yolo way that Devops treats stateless instances.

- Introducing new features in a major version is okay if you have a mature codebase and development process.
- Changing persistent state on disk is more complicated than that, and downgrades need to be possible for two minor versions.
  - If you do not allow that, it is painful for everybody.
  - That includes us, because we can test slower, so Oracle MySQL gets less feedback.
  - That includes Oracle MySQL itself, because it makes nifty features such as `CLONE` needlessly specific and much less useful.
- We will, even with today's the degree of automation, never be able to upgrade by dump and restore, just because reindexing is very, very expensive. It is just too much data.
  - Binary in-place upgrade and downgrade paths are completely non-optional. 
    We will never have the hell of the 5.1 to 5.5 transition again.
    We simply cannot afford this anymore.
