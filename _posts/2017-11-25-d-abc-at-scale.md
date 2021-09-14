---
layout: post
status: publish
published: true
title: 'd = a*b+c at scale'
author-id: isotopp
feature-img: assets/img/background/rijksmuseum.jpg
date: '2017-11-25 20:44:52 +0100'
tags:
- performance
- hardware
- computer
- lang_en
---
![](/uploads/2017/11/dabc.png)

[Introduction to GPUs](http://haifux.org/lectures/267/Introduction-to-GPUs.pdf) (PDF)

So you already know how your CPU works, basically, and want to understand
what your GPU does differently. Ofer Rosenberg has you covered:
[Introduction to GPUs](http://haifux.org/lectures/267/Introduction-to-GPUs.pdf) does what it
says on the tin. 

The NVIDIA take on this can be found in [An Introduction to Modern GPU
Architecture](http://download.nvidia.com/developer/cuda/seminar/TDCI_Arch.pdf)
by Ashu Rege, but because this is from 2008, it's showing it's age. The
first 15 slides or so focus more on the gaming aspect and less on the
technology, but are full of matching screenshots. 

The following slides then show how GPU evolved from specialised graphics
processing units to a general parallel instruction execution architecture -
what you get is basically a single chip supercomputer. Starting at slide 60
we go into Aliasing and sub-pixel addressing. Only the final three slides
mention CUDA. 

Kayvon Fatahalian again takes us on a tour through history, from 1993
onwards to 2011, in 
[How a GPU works](https://www.cs.cmu.edu/afs/cs/academic/class/15462-f11/www/lec_slides/lec19.pdf).
The key innovation, "unified shaders", seems to be from 2006. The slideset
seems to have considerable overlap with the Ofer Rosenberg set. 

Andy Glew explains the ideas and possible optimisations inside the typical
GPU architectures in a large slideset at 
[Coherent Threading: Microarchitectures between SIMD and MIMD](https://parlab.eecs.berkeley.edu/sites/all/parlab/files/20090827-glew-vector.pdf).
One point he makes is that there is a spectrum between classical multicore
CPUs (MIMD) and classical vector CPUs (SIMD), and that seems to be the space
that GPUs occupy. He lists that as SIMT (Single Instruction, Multiple
Threads), and then at length explains how this enables optimisations that
keep all cores (hundreds) busy by switching between even more threads (tens
of thousands) in hardware. 

So what does all of this give you? Well, here is an overview of the
evolution of graphics 2000-2015, as seen by NVIDIA.
[Youtube](https://www.youtube.com/watch?v=6QJvAiCHXqc)

Now, all of this is even relevant if you do not want to blow up pixels,
because the very same operations are being executed at scale for 
[routing packets](https://www.youtube.com/watch?v=df2_72wjEdw) or running classifiers
in neural networks. Google does this at
[scale with custom hardware](https://cloud.google.com/blog/big-data/2017/05/an-in-depth-look-at-googles-first-tensor-processing-unit-tpu)
that is not quite GPU.

A remarkable takeaway is that they are using 8-bit integers:

> A TPU contains 65,536 8-bit integer multipliers. The popular GPUs used
> widely on the cloud environment contains a few thousands of 32-bit
> floating-point multipliers. As long as you can meet the accuracy
> requirements of your application with 8-bits, that can be up to 25X or
> more multipliers.

Their design is basically a monster 8-bit matrix multiplier with neural
network specific postprocessing. 

![](/uploads/2017/11/tpu-15.png)]

[A Google Tensorflow Processor](https://cloud.google.com/blog/big-data/2017/05/an-in-depth-look-at-googles-first-tensor-processing-unit-tpu)

The Postprocessing is a non-linear function, or as they state:

> "Neural network models consist of matrix multiplies of various sizes - 
> that’s what forms a fully connected layer, or in a CNN, it tends to be
> smaller matrix multiplies. This architecture is about doing those things - 
> when you’ve accumulated all the partial sums and are outputting from
> the accumulators, everything goes through this activation pipeline. The
> nonlinearity is what makes it a neural network even if it’s mostly
> linear algebra.”

The large matrix multiplier is implemented as a 
[Systolic Array](https://en.wikipedia.org/wiki/Systolic_array), which makes it even
less general, more specialised than the SIMT units of a GPU -  a Single
Function, Multiple Data, Merged Results processor or a Domain Specific
Processor. That is, this part of the operation of the TPU is not
programmable, but hardwired in silicon - producing 65536 8-bit matrix
multiplication/addition results every cycle at very low power cost. 

Google claims to be 83x more power efficient than a CPU and 29x more power
efficient than a GPU. A more in-depth look at the TPU is available from the
[April 2017 TPU Paper](https://arxiv.org/abs/1704.04760) and a 
[matching article](https://www.nextplatform.com/2017/04/05/first-depth-look-googles-tpu-architecture/)
on The Next Platform. The Google article is remarkable, because it
demonstrates how the Google custom hardware wipes the floor even with
contemporary GPU-based architectures, in terms of performance and even more
so in terms of performance/Watt. 

[NVIDIA reacted to these chips](https://www.nextplatform.com/2017/04/12/googles-tpu-investment-make-sense-going-forward/)
by enabling lower precision math (= less memory needed) and by producing
GPUs better usable for machine learning, both training and inference (using
the trained models as classifiers for data). So we see 16-bit float and
8-bit integers being used in NVIDIAs Pascal chips for this. NVIDIA claims to
be able to catch up to Google TPU performance with this generation of
hardware, but at more power consumption. 

Google [kind of counters](https://blog.google/topics/google-cloud/google-cloud-offer-tpus-machine-learning/)
with a [2nd generation TPU](https://www.nextplatform.com/2017/05/22/hood-googles-tpu2-machine-learning-clusters/).
We also see that hardware development innovation cycles in this area are
currently much faster than the deprecation time for said hardware (see also
the changes in the Knights-anything lineup from Intel), so this is a
classical rent-don't-buy situation for the aspiring cloud user who also
happens to have their own data center.
