---
layout: post
status: publish
published: true
title: Europol discovers CGN
author-id: isotopp
feature-img: assets/img/background/rijksmuseum.jpg
date: '2017-02-01 05:18:00 +0100'
tags:
- security
- internet
- networking
- politik
- lang_en
---
The Council of the European Union discusses the "problem" of Carrier Grader
NAT, and would like to see all Ip address logging and storage extended to
port numbers, as well as all NAT state tables to be stored and preserved, in
order to be able to resolve Internet accesses to subscriber identities,
[says Statewatch](http://www.statewatch.org/news/2017/jan/eu-europol-cgn-tech-going-dark-data-retention-note-5127-17.pdf).

![](/uploads/2017/01/Screen-Shot-2017-01-31-at-21.00.17.png)

The paper in question has been submitted by EUROPOL and claims that clients
are "going dark". The scarcity of IP v4 addresses leads to more and more
subscribers being subject to carrier grade NAT (CGN). In CGN, subscribers
are not assigned a public IP number, but are only getting an internal,
non-unique IP address. Only when IP packets are leaving the provider
network, their addresses are being translated into public addresses. 

In this, multiple subscribers will exit the provider network with the same
IP number - IP numbers alone can no longer be mapped to a single subscriber,
even with a known timestamp. A port number is needed in addition to the
other information. Also, the mapping is usually not logged or archived in
any way.

For EUROPOL, this is seen as a privacy problem:

> One Member State reported that in a recent investigation into Child Sexual
> Exploitation Material (CSEM) distributed and hosted via a cloud-based
> service, the investigators had to investigate each one of the 50 clients
> using that public IP at this time in order to identify who was ultimately
> uploading the CSEM, because the cloud-based service provider did not log
> the relevant information to define which customer was using the public IP.

Today, on 31. January, a "European Network of law enforcement specialists in
CGN" will be established at Europol. The aim of the network is to document
cases of non-attribution due to CGN in the EU, and pressure for a change in
data retention practice.
