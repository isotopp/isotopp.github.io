---
layout: post
title:  'Epochalypse'
author-id: isotopp
feature-img: assets/img/background/rijksmuseum.jpg
date: 2021-08-18 11:15:50 +0200
tags:
- lang_en
- computer
---

I had reason to look into the UNIX Eschaton, the time when the signed 32 bit counter of seconds since Midnight, 1970-01-01 UTC overflows. Going [to Wikipedia](https://en.wikipedia.org/wiki/Unix_time#Notable_events_in_Unix_time), I learned we will die two years earlier, because in 2036-02-07, 06:28:16 UTC NTP will kill us all:

> At 06:28:16 UTC on Thursday, 7 February 2036, Network Time Protocol will loop over to the next epoch, as the 32-bit time stamp value used in NTP (unsigned, but based on 1 January 1900) will overflow. This date is close to the following date because the 136-year range of a 32-bit integer number of seconds is close to twice the 70-year offset between the two epochs.

Good to know.

Still, I wanted to know the state of things. [Linuxreviews](https://linuxreviews.org/Year_2038_Timestamp_Problem) tells me that the kernel already uses a 64 bit time_t internally, so we are good for the next few billion years. Unfortunately, a lot of other structures don't, and some of them are persisted on disk.

# Filesystems

Extending a persistent data structure is hard, and often cannot be done in-place. In many filesystems, the inode is a tight fit and extending timestamp will double the size of an inode, going up from one power of two to the next higher power of two.

The ext4 filesystem [inode structure](https://ext4.wiki.kernel.org/index.php/Ext4_Disk_Layout#Inode_Table) stores [64 bit timestamps](https://ext4.wiki.kernel.org/index.php/Ext4_Disk_Layout#Inode_Timestamps) these days, but the conversion cannot be done in-place. Since Linux 5.4 you get a warning:

> ext4 filesystem being mounted at (mountpoint) supports timestamps until 2038

You will need to dump these file systems, recreate them with 64 bit support and then restore the data.

XFS has the `bigtime` option since 5.10. It counts signed 64 bit, but at nanosecond resolution, so it is good until the year 2468.

NFS V4 has 64 bit timestamps with a second resolution, since 20 years. Anybody using NFS V2 or V3 already gets exactly what they deserve, so not a problem.

Java counts 64 bit signed values, but uses milliseconds. Good for another 300 million years. Other systems do 64 bit signed, but count microseconds. Still sufficient.

I am expecting the first "Enterprise 2038 Compliance" projects to start very soon. It will be great fun to find every single timestamp in a large enterprise and check it for 64 bit time_t. The fact that afterwards there will be different cutoff dates due to different timer resolutions will be even more fun.


# Negative Leap Seconds

What also can kill us: Theoretically there are [negative leap seconds](https://www.timeanddate.com/time/negative-leap-second.html), but no code in the world is prepared for them actually happening.

# GPS

GPS will have interesting events in October this year, that is, in 2 months time.

[GPSD time will jump back 1024 weeks at after week=2180 (23-October-2021)
](https://gitlab.com/gpsd/gpsd/-/issues/144).

# Why?, and worse

I was triggered by [draft-peabody-dispatch-new-uuid-format-01](https://datatracker.ietf.org/doc/html/draft-peabody-dispatch-new-uuid-format) speaking about "36-bit big-endian unsigned Unix Timestamp values" in various places. The text also contains phrases such as

> For example a 36-bit timestamp source would fully utilize timestamp_32 and 4-bits of timestamp_48. The remaining 12-bits in timestamp_48 MUST be set to 0.

The string 2038 appears nowhere in this document.

It's a draft, it contains obvious typos in several place, but generally speaking UUID v7 and UUID v8 look underspecified, with different implementation variants, and have the look of untested ideas. I agree [on the general idea]({% link _posts/2020-09-22-alter-table-for-uuid.md %}) of sort-ordering UUID values PK friendly, but [having a proper UUIDv1]({% link _posts/2021-04-06-mysql-and-uuids.md %}) looks like the safer option to me.
