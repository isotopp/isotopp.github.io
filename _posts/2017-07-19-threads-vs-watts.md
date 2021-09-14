---
layout: post
status: publish
published: true
title: Threads vs. Watts
author-id: isotopp
feature-img: assets/img/background/rijksmuseum.jpg
date: '2017-07-19 14:19:44 +0200'
tags:
- data center
- computer
- lang_en

---
So I have been testing, again. My hapless test subject this time is a Dell Box, an R630. It has a comfortable 384GB of memory, one of two 25 GBit/s ports active, and it comes with two [E5-2690v4](http://ark.intel.com/products/91770/Intel-Xeon-Processor-E5-2690-v4-35M-Cache-2_60-GHz) CPUs. That gives it 14 cores per die, 28 cores in total, or with hyperthreading, 56 threads.

```console
$ cat /proc/cpuinfo | grep 'model name' | uniq -c 
56 model name : Intel(R) Xeon(R) CPU E5-2690 v4 @ 2.60GHz 
$ ./mprime -v 
Mersenne Prime Test Program: Linux64,Prime95,v28.10,build 1 
``` 

I have not been nice, because I have been abusing the box with [mprime95](https://www.mersenne.org/download/) in Torture Test Mode, trying to make it consume as much power as possible.

```console
$ cat prime.txt 
V24OptionsConverted=1 
WGUID_version=2 
StressTester=1 
UsePrimenet=0 
MinTortureFFT=8 
MaxTortureFFT=64 
TortureMem=0 
TortureTime=3 
TortureThreads=56 

[PrimeNet] 
Debug=0 
``` 

Running this with variable values for TortureThreads allows me to learn the impact of CPU usage on power consumption. When Idle, the box consumes 170W, because we basically prevented it from sleeping. When busy, it’s some 406 to 420W.

![](/uploads/2017/07/power-reading.jpg)

*Running at almost full power.*

And the power consumption is not linear. Well, it is up to 28 Threads, and
then more or less plateaus.

![](/uploads/2017/07/watt.jpg)

*Watt used, by number of threads busy.*

From 170W idle to 406W at 28 Threads busy, then basically static for the rest. 

If you think about this, it makes a lot of sense. At 28 Threads busy, all the physical cores are being kept busy by `mprime95`, which is very much architecture and topology aware.

It analyzes which Threads are located on which Cores and Dies, and then sets itself up with CPU affinity for maximum utilization. So at 28 Threads busy (50% full capacity) we are already pretty much at full power consumption.

Unfortunately, conversely this looks not as nice: 

If you define the full power usage at 420W and want to spend only half of that, 210W, you will reach that point at around 4-6 Threads busy - about 10% of the potential compute already consume 50% of the power. 

Another way to think about it is Watt per Thread: 

![](/uploads/2017/07/watt-thread.jpg)

*Watts per Thread.*

A nice hockey stick. Inflection point is around 6 cores. Things are becoming interesting, from a bang/buck perspective, if the box is at load 6 or higher at all times. From a data center planning perspective, it becomes clear that there is no way to make thermally oversubscribing racks financially attractive.

It is better to build for full thermal utilisation without oversubscription, and then make sure the boxes are always as busy as possible. Computation past a base load of 6 is basically available for free from a power/cooling point of view.
