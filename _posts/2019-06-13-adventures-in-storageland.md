---
layout: post
title:  'Adventures in Storageland'
author-id: isotopp
feature-img: assets/img/background/rijksmuseum.jpg
date: 2019-06-13 14:37:35 +0100
tags:
- lang_en
- storage
- computer
---
## Adventures in Storageland
### Devices

In the last few weeks, I have been benchmarking server storage in order to get a better idea what the state of the hardware is these days. There is a summary with recommendations at the end of this article.
Storage technology

In the past, we had stored data on rotating disks.

![](/uploads/2019/06/storage-hdd.png)

*An open hard disk chassis. You can see the topmost of a stack of disks, and the arm with the r/w heads.*

While the capacities of hard disks changed, access speeds and the underlying technology did not change so much. So today you can get a stack of rotating disks that stores 10, 12 or 14 TB per drive, but the access time is still in the millisecond range.

It is likely around or slightly below 5ms, so you get to transfer data from 200-250 different locations per second. Databases do mostly random access, and that means you get to write 200-250 commit/s to disk.

All of that changed around 2012 or so. At that time, NAND flash based storage became available at scale under the name of Solid State Drive (SSD). At work, first deployment of SSD at scale was in that year, in a very volatile replication chain and it completely transformed the way we worked with hotel room availability data.

SSD are plug-in replacements for traditional hard disks: They have the same connectors and bus systems, and the same form factor. They may be flatter, though: A modern U.2 (2.5”) SSD is either tall (15mm) or flat (7mm).

![](/uploads/2019/06/storage-ssd.png)

*15mm U.2 drive and it’s content.*

On the inside they are different, though: They contain one logic board which houses a lot of flash NAND chips and a custom flash NAND controller. The logic board may be folded in order to make most use of the available height to increase storage capacity. The image above shows a SSD chassis and its content, unfolded.

The folded design is far from optimal: Inside such a chassis you have a thermal design power of 7W-9W in a consumer device, and up to 25W in an enterprise device - power consumption is linear with the number of chips, and superlinear with the clock rates of the chips. U.2 form factor is good for HDD, but not so good for SSD, because it is hard to cool.

![](/uploads/2019/06/storage-m2.png)

*M.2 flash drive in a holder on a mainboard.*

One attempt of handling this better is M.2, which is basically a logic board for flash NAND chips and a controller, and a board holder on the main board. This cools obviously much better, but is very hard to handle inside a data center and has a very limited lifetime in terms of number of plug-in/removal operations inside a consumer device.

The attempt to fix all of that is the “flash ruler”, “EDSFF”.

![](/uploads/2019/06/storage-ruler.jpg)

*Intel flash rulers in a 1U high chassis.*

“Ruler” type flash is built to the height of a rack unit, has a specificed chassis form that allows for cooling (up to 40W TDP per “long” device), has managed air flow, and is designed to be toolless, field replaceable and hot pluggable. It looks like the perfect solution.

Until you realise that there are two incompatible competing standards, each of which has exactly one supplier: Intel and Samsung.

So, for most, at the moment, U.2 it is, until the “ruler” proponents get their stuff sorted out.

### Interfaces

The interface we use to talk to hard disks has evolved and not evolved at the same time, for a very long time. In the past, we spoke SCSI commands over a parallel SCSI bus to our disks.

Today, we use multi-Gbit rated serial buses to speak ancient SCSI commands and SCSI command extensions to our devices. The bus is SATA or SAS - either serial attached consumer disk protocol, or serial attached enterprise disk protocol, so to speak, only that SATA has become good enough to be used in the enterprise, too. Bus speed is 3 GBit/s, 6 GBit/s (what most people actually use) or 12 Gbit/s.

SATA interfaces are block storage interfaces, so you get to access and address blocks of 512 bytes or 4096 bytes on the device, and you specify block numbers. In the past that was geometry addresses ( cylinder-head-sector ), but that became meaningless very quickly as storage technology improved and in the last 20 years everybody always has been using LBA and letting the storage controller do its thing.

Still, these days we are actually speaking to memory chips, and doing this through a block interface originally designed for rotating storage makes a lot of overhead and increasingly little sense.

How about putting the flash chips directly on the PCIe 3.0 bus, and dropping the controller interface? That’s NVME. You are taking the same form factor, the same flash chips and the same controller chip, with a different firmware and are plugging it into a PCIe 3.0 extension instead.

The result is about half the latency, and a much higher transfer bandwidth. We can in fact build connectors that accept and automatically switch between SATA and NVME, no problem.

### Benchmarking it

So, in testing, what can we expect? In MySQL land, I/O is done in blocks of 16 KB, and is done as random I/O mostly, in reads as well as writes. So we are writing a benchmark specification for fio that is testing things: A single threaded 16 KB sequential read test for a baseline throughput benchmark, a 16 KB block size random-write benchmark, 8-way parallel for random I/O calibration, and a mixed r/w benchmark, 8 way parallel, to simulate an operational database.

```console
[seq-read]
 rw=read
 size=40g
 directory=/a/fio
 fadvise_hint=0
 blocksize=16k
 direct=1
 numjobs=1
 nrfiles=1
 runtime=300
 ioengine=libaio
 time_based
```

This spec defines a 40g test file in a benchmark directory, which is being read without caching, for 300s, linearly and single threaded.

```console
[random-write]
 # 8 processes, 5g files each = 40g
 rw=randwrite
 size=5g
 directory=/a/fio
 fadvise_hint=0
 blocksize=16k
 direct=1
 numjobs=8
 nrfiles=1
 runtime=300
 ioengine=libaio
 time_based
```

The same, but random writes, in 8 threads in parallel. Each writer has their own file, so 8 files at 5GB each, for 40 GB total.

```console
[read-write]
 rw=rw
 rwmixread=80
 size=5g
 directory=/a/fio
 fadvise_hint=0
 blocksize=16k
 direct=1
 numjobs=8
 nrfiles=1
 runtime=300
 ioengine=libaio
 time_based
```

And the same as the randwrite, only this time 80% reads, 20% writes.

#### A blade with a SATA SSD

When running this on a normal blade, the SSD is actually attached to a caching RAID controller. 

Such a controller is actually an ARM based computer in it’s own right, sitting on the PCIe board. It has a multi-core CPU, a few GB memory, and a supercapacitor to buffer things when the power fails. It is taking disk writes, caching them on the onboard memory and then does its things in the background to write this to some kind of storage.

Originally it is designed to make slow hard disks fast, but with SSD as a backing storage it is not unlikely that the only thing it does is increasing latency.

So here is the baseline for a traditional Dell M630 with a PERC controller and a 1.92TB SSD:

```console
# fio --section=seq-read ./fio.cfg
seq-read: (g=0): rw=read, bs=(R) 16.0KiB-16.0KiB, (W) 16.0KiB-16.0KiB, (T) 16.0KiB-16.0KiB, ioengine=libaio, iodepth=1
fio-3.1
Starting 1 process
seq-read: Laying out IO file (1 file / 40960MiB)
Jobs: 1 (f=1): [R(1)][100.0%][r=245MiB/s,w=0KiB/s][r=15.7k,w=0 IOPS][eta 00m:00s]
seq-read: (groupid=0, jobs=1): err= 0: pid=18818: Fri May 10 10:31:29 2019
   read: IOPS=15.3k, BW=239MiB/s (251MB/s)(70.0GiB/300001msec)
    slat (usec): min=4, max=186, avg= 5.63, stdev= 2.48
    clat (nsec): min=1500, max=145648k, avg=58921.07, stdev=109647.10
     lat (usec): min=56, max=145652, avg=64.67, stdev=109.74
    clat percentiles (usec):
     |  1.00th=[   53],  5.00th=[   53], 10.00th=[   53], 20.00th=[   53],
     | 30.00th=[   53], 40.00th=[   54], 50.00th=[   55], 60.00th=[   55],
     | 70.00th=[   59], 80.00th=[   60], 90.00th=[   73], 95.00th=[   75],
     | 99.00th=[   91], 99.50th=[   99], 99.90th=[  235], 99.95th=[  433],
     | 99.99th=[ 2343]
   bw (  KiB/s): min=38912, max=263456, per=100.00%, avg=244768.87, stdev=24405.41, samples=599
   iops        : min= 2432, max=16466, avg=15298.03, stdev=1525.34, samples=599
  lat (usec)   : 2=0.01%, 4=0.01%, 10=0.01%, 50=0.04%, 100=99.47%
  lat (usec)   : 250=0.39%, 500=0.05%, 750=0.01%, 1000=0.01%
  lat (msec)   : 2=0.02%, 4=0.01%, 10=0.01%, 20=0.01%, 50=0.01%
  lat (msec)   : 250=0.01%
  cpu          : usr=4.95%, sys=12.28%, ctx=4589759, majf=0, minf=114
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwt: total=4589635,0,0, short=0,0,0, dropped=0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1

Run status group 0 (all jobs):
   READ: bw=239MiB/s (251MB/s), 239MiB/s-239MiB/s (251MB/s-251MB/s), io=70.0GiB (75.2GB), run=300001-300001msec

Disk stats (read/write):
    dm-4: ios=4588416/35691, merge=0/0, ticks=259207/18045, in_queue=277259, util=86.48%, aggrios=4605315/37547, aggrmerge=274/2057, aggrticks=262279/21346, aggrin_queue=283104, aggrutil=86.21%
  sda: ios=4605315/37547, merge=274/2057, ticks=262279/21346, in_queue=283104, util=86.21%
```

That’s a lot of output, but we are interested into a few key numbers here. This is a sequential benchmark, because we asked for that (–section=). We get 15.300 IO operations per second (IOPS), and a bandwidth of 239 MB/s (with 1024-based metric). In our 300s benchmark, we transferred 70 GB.

fio dynamically shifts units as it sees fit, so we need to make sure if we are looking at milliseconds (ms, 1/1000 of a second, 1 kHz event frequency), microseconds (µs, us, 1/1 000 000 of a second, 1 MHz event frequency) or nanoseconds (ns, 1/1 000 000 000 of a second, 1 GHz event frequency).

fio also knows three different latencies, lat, clat and slat. They do mean different things for different I/O engines, and in our case (using async I/O with libaio), the meaningful numbers are clat (completion latency) or overall lat, but not slat (submission latency numbers).

We do get a clat histogram in usec, and that is useful: There is a relatively stable completion time up to the 99.50th percentile, and then things rise. clat is 50µs (20 000 per second) to 100µs (10 000 per second), and we do indeed get 15 000 IOPS in total.

For the random write benchmark we get 8 times output like

```console
...
  write: IOPS=2454, BW=38.4MiB/s (40.2MB/s)(11.2GiB/300001msec)
...
    clat percentiles (usec):
     |  1.00th=[  202],  5.00th=[  237], 10.00th=[  249], 20.00th=[  269],
     | 30.00th=[  285], 40.00th=[  302], 50.00th=[  314], 60.00th=[  330],
     | 70.00th=[  347], 80.00th=[  396], 90.00th=[  482], 95.00th=[  570],
     | 99.00th=[ 2212], 99.50th=[ 2966], 99.90th=[ 6915], 99.95th=[ 7832],
     | 99.99th=[ 9503]
...
```

The total of the IOPS is 19588, and the clat inflection is around the 95th percentile with 200µs to 570µs write latency, and then runaway times in the ms range. Aggregated bandwidth is around 300 MB/s (6 GBit/s are 715 MB/s theoretical max).

And for the r/w mix (80% read/20% write), we get 8 readers and 8 writers, each reporting

```console
...   
  read: IOPS=2153, BW=33.6MiB/s (35.3MB/s)(9.86GiB/300001msec)
...
    clat percentiles (usec):
     |  1.00th=[  155],  5.00th=[  204], 10.00th=[  231], 20.00th=[  265],
     | 30.00th=[  297], 40.00th=[  322], 50.00th=[  338], 60.00th=[  355],
     | 70.00th=[  379], 80.00th=[  412], 90.00th=[  478], 95.00th=[  873],
     | 99.00th=[ 2073], 99.50th=[ 2212], 99.90th=[ 2409], 99.95th=[ 2540],
     | 99.99th=[ 6849]
...
  write: IOPS=540, BW=8647KiB/s (8855kB/s)(2533MiB/300001msec)
...
    clat percentiles (usec):
     |  1.00th=[   60],  5.00th=[   76], 10.00th=[   85], 20.00th=[  105],
     | 30.00th=[  127], 40.00th=[  149], 50.00th=[  172], 60.00th=[  194],
     | 70.00th=[  217], 80.00th=[  241], 90.00th=[  277], 95.00th=[  314],
     | 99.00th=[  371], 99.50th=[  449], 99.90th=[ 1696], 99.95th=[ 2737],
     | 99.99th=[ 6456]
...
```

The sum of all IOPS is 21412, and the clat inflection is at the 95th with 155µs to 873µs for read, and at the 99.50th for write with 60µs to 449µs (and it’s actually more complicated than this for writers, but that’s a different story). We do see a total aggregated bandwidth of 336 MB/s (out of 715 MB/s max).

We are looking at a device that has a read-latency in the range of 150 µs, and that in linear read mode can likely leverage readahead and local buffers in some way to get below 50 µs in good cases.

Write latency is likely 3x that, unbuffered, but like all flash devices it has RAM and can use a fraction of that RAM to buffer a part of the writes. This is more effective for smaller write loads, and we can see that in the comparison of the numbers between the full write test compared to the r/w mix.

#### A blade without the smart controller

Let’s try a blade without the smart controller, this time a HP BL460c with a directly attached SSD without the caching RAID controller. In this test device, the disk controller is a dumb SATA attachment, no buffering, processing, RAIDing or other “smartness” inbetween.

```console
   read: IOPS=14.2k, BW=222MiB/s (233MB/s)(64.0GiB/300001msec)
    clat percentiles (usec):
     |  1.00th=[   50],  5.00th=[   51], 10.00th=[   52], 20.00th=[   53],
     | 30.00th=[   53], 40.00th=[   55], 50.00th=[   56], 60.00th=[   62],
     | 70.00th=[   64], 80.00th=[   64], 90.00th=[   66], 95.00th=[   68],
     | 99.00th=[   77], 99.50th=[   79], 99.90th=[  355], 99.95th=[  537],
     | 99.99th=[ 3130]
```

So 14.2k instead of 15.3k with the expensive controller, and 50-79µs instead of 53-99µs with the expensive controller. For pure writes (times 8):

```console
  write: IOPS=3458, BW=54.0MiB/s (56.7MB/s)(15.8GiB/300001msec)
    clat percentiles (usec):
     |  1.00th=[  151],  5.00th=[  188], 10.00th=[  194], 20.00th=[  227],
     | 30.00th=[  237], 40.00th=[  245], 50.00th=[  253], 60.00th=[  260],
     | 70.00th=[  262], 80.00th=[  269], 90.00th=[  306], 95.00th=[  375],
     | 99.00th=[  938], 99.50th=[ 1057], 99.90th=[ 3916], 99.95th=[ 4228],
     | 99.99th=[ 5211]
```

So, 28507 IOPS in total (compared to 19588 for the expensive controller), and 150-375µs (compared to 200-570µs for the expensive controller), and better behavior for the runaway times, too.

For the mix (times 8):

```console
   read: IOPS=2296, BW=35.9MiB/s (37.6MB/s)(10.5GiB/300002msec)
    clat percentiles (usec):
     |  1.00th=[  174],  5.00th=[  202], 10.00th=[  223], 20.00th=[  258],
     | 30.00th=[  285], 40.00th=[  310], 50.00th=[  334], 60.00th=[  363],
     | 70.00th=[  400], 80.00th=[  445], 90.00th=[  529], 95.00th=[  635],
     | 99.00th=[ 1876], 99.50th=[ 2966], 99.90th=[ 3490], 99.95th=[ 3654],
     | 99.99th=[ 4555]
  write: IOPS=576, BW=9225KiB/s (9446kB/s)(2703MiB/300002msec)
    clat percentiles (usec):
     |  1.00th=[   52],  5.00th=[   58], 10.00th=[   63], 20.00th=[   72],
     | 30.00th=[   89], 40.00th=[   98], 50.00th=[  116], 60.00th=[  124],
     | 70.00th=[  139], 80.00th=[  155], 90.00th=[  174], 95.00th=[  190],
     | 99.00th=[  223], 99.50th=[  237], 99.90th=[  258], 99.95th=[  273],
     | 99.99th=[  293]
```

That comes out as a total of 23005 IOPS (as opposed to 21412), and for reads, a range of 174-635µs (155-873µs for the expensive controller), while for writes it is 52-237µs (60-449µs).

Indeed, latency and degraded behavior are better for directly attached disks, the caching RAID controller (200€ extra per device) is substracting value.

We can confirm these results with more benchmarking in additional, slightly different configurations (Dell, HP, new and old machines) across the test zoo.

#### Some NVME

A colleague donated a NVME based HP box to the test. It actually has 4 NVME devices, and we naively build a striped RAID-0 from it using LVM2, because why not? Each 16 KB write goes to a different NVME device, in a round-robin fashion (This is a silly thing to do, but that would require a longer digression to explain - the 1M stripe setup does not fundamentally change things, though).

The outcome is unexpected and disappointing, or is it?

```console
   read: IOPS=8459, BW=132MiB/s (139MB/s)(38.7GiB/300001msec)
    clat percentiles (usec):
     |  1.00th=[   97],  5.00th=[  101], 10.00th=[  102], 20.00th=[  102],
     | 30.00th=[  103], 40.00th=[  106], 50.00th=[  116], 60.00th=[  119],
     | 70.00th=[  123], 80.00th=[  123], 90.00th=[  124], 95.00th=[  127],
     | 99.00th=[  133], 99.50th=[  145], 99.90th=[  186], 99.95th=[  196],
     | 99.99th=[  221]
```

My colleague claims that a single NVME device is capable of a million IOPS, yet here we see fewer than 10 000, and 100-200µs completion latencies. What’s wrong?

Write test (times 8):

```console
write: IOPS=23.3k, BW=365MiB/s (383MB/s)(107GiB/300001msec)
    clat percentiles (usec):
     |  1.00th=[   19],  5.00th=[   19], 10.00th=[   20], 20.00th=[   20],
     | 30.00th=[   21], 40.00th=[   22], 50.00th=[   24], 60.00th=[   26],
     | 70.00th=[   36], 80.00th=[   47], 90.00th=[   61], 95.00th=[   70],
     | 99.00th=[   95], 99.50th=[  114], 99.90th=[  192], 99.95th=[  293],
     | 99.99th=[ 2409]
```

Total IOPS: 183000, range: 19-200µs. Mix (times 8):

```console
   read: IOPS=6960, BW=109MiB/s (114MB/s)(31.9GiB/300001msec)
    clat percentiles (usec):
     |  1.00th=[   97],  5.00th=[  103], 10.00th=[  104], 20.00th=[  108],
     | 30.00th=[  112], 40.00th=[  118], 50.00th=[  121], 60.00th=[  125],
     | 70.00th=[  126], 80.00th=[  129], 90.00th=[  141], 95.00th=[  169],
     | 99.00th=[  412], 99.50th=[  611], 99.90th=[ 1385], 99.95th=[ 1696],
     | 99.99th=[ 2311]
  write: IOPS=1740, BW=27.2MiB/s (28.5MB/s)(8161MiB/300001msec)
    clat percentiles (usec):
     |  1.00th=[   19],  5.00th=[   19], 10.00th=[   20], 20.00th=[   20],
     | 30.00th=[   20], 40.00th=[   20], 50.00th=[   21], 60.00th=[   21],
     | 70.00th=[   22], 80.00th=[   23], 90.00th=[   27], 95.00th=[   30],
     | 99.00th=[   60], 99.50th=[   70], 99.90th=[   95], 99.95th=[  113],
     | 99.99th=[  202]
```

Total IOPS: 70010, range: 19-100µs for writes, and 100-200µs for reads. So we do get a large number of IOPS, but not in the first scenario.

What’s wrong? Well, latency is.

In the read-only case, we have a clat of 116µs in the 50th percentile, so with 1000000µs to the second, we get 1000000/116 = 8620 IOPS single threaded, and indeed we measured 8459. Math works, every single time.

So we might have a total IOPS capacity of the total device that may be 100k or even a million IOPS, but we also do have a (surprisingly constant) read latency of 100-200µs and that is not going to change. The only way to get all these IOPS is to have many concurrent accesses, all of which will take at least 100µs per read.

As we can see by going 8-way parallel (for pure writes) or 16 way parallel (8 readers, 8 writers) we get a lot more in terms of IOPS, at the expected latencies per thread.

And indeed, a sequential read test with 128 readers in parallel yields (times 128):

```console
   read: IOPS=5289, BW=82.7MiB/s (86.7MB/s)(24.2GiB/300001msec)
    clat percentiles (usec):
     |  1.00th=[  118],  5.00th=[  126], 10.00th=[  133], 20.00th=[  141],
     | 30.00th=[  147], 40.00th=[  155], 50.00th=[  163], 60.00th=[  176],
     | 70.00th=[  192], 80.00th=[  215], 90.00th=[  247], 95.00th=[  281],
     | 99.00th=[  367], 99.50th=[  412], 99.90th=[  523], 99.95th=[  586],
     | 99.99th=[ 1090]
```

These are not bad numbers at all: 648223 IOPS in total, at 100-400µs, and even above the 99.50th relatively stable times. The total aggregated bandwidth is 9.9GB/s (80 Gbit/s) with very little jitter (so we are not even maxing this out, we are not even at 1/3 the max for PCIe).

## Recommendations and Learnings

From a SSD, we can expect about 20k IOPS, and about 3-4 GBit/s bandwidth (6 GBit/s bus) using MySQL type of workloads.

A caching RAID controller adds negative value: It costs more, but does not improve the numbers. Latency and jitter actually increase. We lose access to the SMART data, too, and have to rely on controller diagnostics instead. We should stop buying caching RAID controllers (and we have indeed done that).

NVME is a different bus to the same disk hardware (Flash NAND and controller) that is in a SSD, but it creates a much better latency and throughput. It can do that, because it attaches the storage directly to the PCIe bus instead of the much slower and more complicated SATA bus. It opens the gate to much higher bandwidth and IOPS numbers from the same hardware, but latency is unchanged (but much more stable under load).

We should stop buying SATA attached devices and focus on NVME instead. We should make sure that the pricing matches, because the hardware is essentially the same, only the bus interface changes.

Read latency is around 100µs for a NVME read, and write latency is around 420µs for an unbuffered flash write (20µs for a write to the supercap buffered cache RAM on the NVME device, and we have probably around 512 MB of that per NVME device).

That also means that access to the NVME flash disk needs to be as parallel as possible, up and beyond 100-way parallel, in order to unlock the full IOPS yield the hardware can do:

We have 1 000 000 µs to the second, but latency is not 1µs, but 100µs/400µs, so we can and need to run 100-400 parallel accesses to be able to saturate the device.

It is very hard to impossible to get 100-way parallel commits from a relational database, so in order to saturate even a single NVME device we are likely to need multiple applications or database instances on a single device. From an IOPS point-of-view, it should never be necessary to have more than one NVME device per box.

That means in order to make most of NVME you really need the capability to run multiple workloads on a single device. Virtual machine and Kubernetes based databases are becoming a necessity in order to make full use of our hardware, even at the storage level.
