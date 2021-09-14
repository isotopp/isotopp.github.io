---
layout: post
title:  'Not quite storage any more'
author-id: isotopp
feature-img: assets/img/background/rijksmuseum.jpg
date: 2019-06-14 15:01:43 +0100
tags:
- lang_en
- storage
- computer
---
While I was testing away on all the SSD and NVME toys, I got my hand on a test box with even stranger that usual equipment. It was a Dual Platinum-8280 box with a really weird amount of memory: 7.5 TB.

“[8280](https://ark.intel.com/content/www/us/en/ark/products/192478/intel-xeon-platinum-8280-processor-38-5m-cache-2-70-ghz.html)”. This is a machine with a “2” in the second digit, indicating [Cascade Lake](https://en.wikipedia.org/wiki/Cascade_Lake_(microarchitecture)), CLX.

And one thing that is new with CLX is “Intel Optane Persistent Memory Technology”. That is actually [3D XPoint](https://en.wikipedia.org/wiki/3D_XPoint) (“Crosspoint”), a big invention in applied materials science. It is a thing that Intel and Micron have been co-developing, Intel sells it under the trade name of Optane (and internally it was named Apache Pass) and Micron has it as QuantX. So far I have only seen Optane.

Supposedly Optane is 10x denser than RAM (right now, it is 4x denser), and it is only 10x slower than RAM.

## Optane

From a Unix point-of-view, Optane is weird. It is persistent, so storage, not memory. But unlike all the storage you know and hate, it is byte addressable. And that is a big thing.

For example, NAND flash is byte-readable, but really only erasable (and that means bulk-writeable) in fairly large chunks - 64 KB to 1024 KB blocks at a time. It is being fed to you through the means of a block device, to there is a file system buffer cache, and you get to touch it only through open(2), read(2) and write(2). You can use [mmap(2)](http://man7.org/linux/man-pages/man2/mmap.2.html) and [msync(2)](http://man7.org/linux/man-pages/man2/msync.2.html), but the thing you are fondling through this interface is the buffer cache and not the actual device. All storage subsystems Unix has been dealing with in the last 50 years have been block storage, originally 512 bytes, these days mostly 4096 bytes per block.

Nobody has seen byte-addressable persistent storage in Unixland for a very long time, and worse, nobody has an API for it. There is no software that thinks “Oh, RAM. I am going to stuff things into it and that is safe for eternity.” (Well, MongoDB does, but that’s… incidental, if not accidental). Anyway, there is now a PMEM API, maintained by Intel, of course, but no applications use it – yet.

Optane also has a consistent latency, which is also very extremely low – it is about 10x as slow as RAM, which makes it 10x - 100x faster than NAND flash. RAM does 120ns, 0.12µs, and Optane is somewhere in the 1-2µs range.

So it’s a lot like [core rope memory](https://en.wikipedia.org/wiki/Core_rope_memory) is coming back, only this time it is small and fast ([Core Rope Memory flew us to the moon!](https://www.youtube.com/watch?v=xx7Lfh5SKUQ)).

You get two flavors of Optane from Intel:

- Intel Optane™ DC Persistent Memory, “Optane on the memory bus with byte addresses”
- Intel Optane™ DC SSDs, “Optane on the PCIe bus with LBA”

## Optane on the memory bus

The flavor I have been tasting here is the former, Optane on the memory bus.

Basically, the box has 6 very special 512GB DIMMs for each socket, for a total of 12x 512GB = 6 TB persistent not-quite-RAM, and another set of 2x 6 DIMMs regular RAM, 128 GB each. Depending on the configuration, that can show as 7.5 TB memory (many tools are confused, because the idea of persistent memory in a Unix box did not exist until last year) or as 1.5 TB RAM and 6 TB in weird devices (/dev/pmem0 and /dev/pmem1, 3TB each).

The problem with Optane on the memory bus is that it stops at 6 TB.

Intel is not used to building machines with very many address lines - technically the CPU is 64 bit, but not all address bits have pins on the die, and the upper lines do not physically exist on the chip or the bus. CLX extends this, and at the same time limits it to Optane, because Intel does make “M” type CPUs (the number is extended by attaching an “M” at the end) and charges quite hefty surcharge for one additional bit of address space.

Anyway, 6 TB of Optane and 1.5 TB of RAM is the end of the line for this kind of box.

## Optane on the PCIe bus

There is another flavor of Optane and that is the Optane SSD. These are NVME-like devices that sit on the PCIe bus, and they are being addressed like block storage. That does mean you gain a lot of latency – PCIe accesses are way slower than memory accesses.

But it also means that you get all the benefits of the large address space that LBA addresses give you, and you get very many PCIe lanes and slots to play with. And you get a storage controller in the middle.

This controller can make use of the fact that all accesses are block-sized, and it can do additional magic to do error correction. Stephen Bates gave a [presentation about Low Latency Block Devices](https://www.snia.org/sites/default/files/SDC/2017/presentations/General_Session/Bates_Stephen_Linux_Optimizations_for_Low_Latency_Block_Devices.pdf) in a 2017 [SNIA](https://en.wikipedia.org/wiki/Storage_Networking_Industry_Association) conference that was interesting in its own right. But in one slide he dropped a really interesting observation on block storage and error correction, which he coined the Bates Conjecture.

![](/uploads/2019/06/optane-bates.png)

*Bates Conjecture Slide (Slide 10)*

He said that any kind of large storage has an Uncorrectable Bit Error Rate (UBER), and for new kinds of storage media, this is likely to be high in the beginning. If you access the media in blocks, you can transparently add error correction, and get a much better Recoverable Bit Error Rate (RBER). As you make the blocks larger, checksums have less overhead and can become larger, and the RBER goes down for a constantly bad UBER. So new and unreliable media will come as block storage to the market much easier.

So if you have the coin, Khajiit can build you a box with way more Optane on the PCIe bus than on the memory bus to hold your warez persistently. On the other hand, there are no prices listed anywhere close to where Intel pushes Optane at developers and that should make you stop and think.

## Abusing PMEM as a disk

We have the box, and it exposes the memory as two pmem devices, and they happen to be block devices. What is one going to do with it?

Architect an application that uses this magic memory in a transactional way, with lockless data structures that maximize parallel access by many threads with a minimum amount of delay, leveraging the tools made available to developers on the Intel website, of course.

Seriously, it’s a block device.

So let’s make a file system and use this one-of-a-kind pinnacle of 21st century storage technology as a really fast SSD, because… Well, it’s easier done than the other thing.

Anyway, here’s the fio:

```console
   read: IOPS=142k, BW=2212MiB/s (2319MB/s)(648GiB/300001msec)
    clat percentiles (nsec):
     |  1.00th=[  227],  5.00th=[  231], 10.00th=[  233], 20.00th=[  243],
     | 30.00th=[  245], 40.00th=[  249], 50.00th=[  253], 60.00th=[  258],
     | 70.00th=[  266], 80.00th=[  274], 90.00th=[  298], 95.00th=[  314],
     | 99.00th=[  338], 99.50th=[  350], 99.90th=[  438], 99.95th=[  540],
     | 99.99th=[10176]
```

Shut your mouth, please. The scale actually switched to ns (1/10E-9) instead of µs (1/10E-6). We are at 0.227µs - 0.350µs here, and are good till the 99.95th, actually.

So, dumb sysadmin bloke hodored 142 000 single threaded IOPS out of a /dev/pmem, xfs and fio combo, at a data rate of 2.3 GB/s. Imagine what an actual developer could do with this stuff (if they used a proper systems programming language instead of Javascript, that is).

Pure writes (times 8):

```console
  write: IOPS=63.3k, BW=989MiB/s (1037MB/s)(290GiB/300000msec)
    clat percentiles (nsec):
     |  1.00th=[  249],  5.00th=[  255], 10.00th=[  258], 20.00th=[  262],
     | 30.00th=[  266], 40.00th=[  270], 50.00th=[  274], 60.00th=[  274],
     | 70.00th=[  290], 80.00th=[  326], 90.00th=[  370], 95.00th=[  382],
     | 99.00th=[  430], 99.50th=[  438], 99.90th=[  470], 99.95th=[  482],
     | 99.99th=[ 3376]
```

506400 IOPS, 8 GB/s, 0.249µs-0.482µs till the 99.95th. And the 8x read + 8x write is much of the same, 500k IOPS, 8 GB, stable latencies of 1/4 to 1/2 µs till the 99.95th.

Let’s get cocky and try to work our way up. We are sitting on two 8280 CPUs, that’s 56 real cores or 112 threads. How well does this thing deal with parallel access?

Well, up to 32 readers, I get an aggregate of 32 GB/s, 2m aggregated IOPS and the same latencies until the 99.90th, and then a slight degradation at the 99.95th. With even more threads, things tend to level out and then break down. The 100-way parallel run ends up with 200k IOPS only.

## Some graphics

Here is a comparison of some key performance data: SSD with smart controller, SSD direct, NVME direct and Optane.

![](/uploads/2019/06/optane-latency.png)

*Read, Buffered and Unbuffered Writes. The Optane Data is there, you just cannot see it, because it is too fast. The scale is µs.*

Moral: NVME don’t buy you much latency, but look at those sweet IOPS, all available in parallel accesses/deep queues only.

![](/uploads/2019/06/optane-iops.png)

*IOPS and Bandwidth of various storage hardware compared*

## Recommendations

“Optane on the memory bus” brings a new kind of storage to Linux. There are libraries to use it to the fullest.

Abusing “Optane on the memory bus” as a block device shows the potential of the technology, but is at the same time severely underutilizing the true capabilities of the hardware.

Despite Optane having even more IOPS than NVME NAND flash and being faster, the gap between latency and IOPS is smaller than with NVME NAND flash, thus the level of parallelism in access required to fully unlock the performance potential of the device is smaller.

The latency introduced by the Linux block device subsystem is increasingly becoming a problem, as is the age-old UNIX API around open(2) and friends. Since this is like the core of Unix, we are actually seeing the beginning of the end of the usefulness of the Unix API – that is, if something else is actually showing up to take its place instead. If you have experience with AS/400 aka IBM i-Series, now is the time to capitalize on it.

The slow takeup of Optane with consumers is not only due to Intels really outlandish pricing model, but also because to fully unlock the potential of Optane on the memory bus (beyond it being a really nifty flash disk) our applications and the way we design applications needs to be rethought.

At this point Intel is better off peddling Optane to application makers such as Oracle MySQL than us directly, because without applications truly making use of persistent memory we have no reason to buy it.

It’s still fun to play with.

## PMDK

Intel has classes for developers on using the persistent memory development kit (PMDK) and the underlying stuff. They are necessary, because an application rethink it coming up, which will fundamentally change the way we think about storage.
