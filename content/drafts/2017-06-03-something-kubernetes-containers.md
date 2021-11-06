---
layout: post
title:  'Someting Kubernetes Containers'
author-id: isotopp
feature-img: assets/img/background/rijksmuseum.jpg
date: 2017-06-03 14:52:26 +0200
tags:
- lang_en
- talk
- containers
- kubernetes
---

002
Title was not set when I applied for the talk, something about continers
Now Containers at Booking
Not there yet, it is a thing we are still working on

003
What we do, selling rooms, getting commission from the Hotel
A very simple thing, it seems, but very different depending on where in the world you are
Very hard to explain what a hotel offers, lots of reviews and images
When we fail, somebody is sleeping under a bridge
That is why we need to be boring.

006
Where we are:
Automated Bare Metal
Colocation Customer, multiple rooms in muiltiple data centers
We have a set of Python Django Apps, written in House, that automatically provision stuff.
ServerDB manages hardware, from managing procurement and vendor data ingest, to burnin, bios updates, inventorization of the HW, provisioning the hardware
As a developer you ask ServerDB for servers in a location of a given type,
ServerDB will flash these things up to spec, provision that for you, partition table and base OS, tell puppet what to do
Puppet will install packages, hand over to class specific tooling
Database tooling will create servers with appropriate tooling, 
200 databases with nobody touching any piece of hardware, fully inserted into replication chains

Disadvantages:
slow, because HW provisioning is always slow
Hardware is often too large or too small for the task, the hardware we use is at the low end of the available spec

009
Current hardware is very powerful,
one chassis = 10 U, around 1000 cores, 3 TB of memory, 320 GBit/s network, can consume up to 6400W.
Racks cannot realistically hold 4 of these things

010
We need to handle more developers,
we need to be able to handle more databases with fewer people
we need to decouple provisioning of HW from consumption (independent of workload)
I need machine readable service descriptions (who talks to what)

011
The software currently is a monolith and needs to be split from being a 6GB process into something smaller.
The software is written in perl and is pretty okay, but the deployment model is outdated.
We roll out between 10-14 times a day.

012
What so we want to do?
Change the entire stack:
DC & HW level, looking for better DC space, containers to slice and dice the HW, work towards microservices, work to a different business model as well.

Containers are useful, because they spawn faster than HW is being provisioned
And we can buy hardware in any shape, and then slice and dice it into consumption sizes.

013
What are containers?
fork + fairy dust + exec
Namespaces, CGroups,

014
Docker standalone is not useful for production, it is dev centric
From a dev PoV very useful, layering, instant availabilty,
fold production into a single host,
K8s is useful because it throws away most of Docker and does proper production things.
A single dockerhost can take you very far (20C, 512GB memory, disks) can hold a lot of development
Not for production, SPOF, does not scale, but for devs very useful

015
For production, it is very useful to have images.
Keeps the base host clean, put application there without much hassle,
also makes app removeable (instant application, as CPU and memory)

016
CI/CD are necessary
you need to understand what is in an image,
you can only know that if you build these tjings and cache things locally
reproducible builds.

018
We came from a hackathon project, Mesos and Docker.

019
suddenly running stuff
(list)

internal facing only

020
Modular, but parts fall off under load
Typical for all Apache (Hadoop, Mesos/Marathon)
This is not stuff that should happen in production
Also, lots of things missing that need to be there in production:
isolation of tenants, no discovery, no deployment ruyles, no auto-scaling, no one-time batch runs, no rbac.

021
When lookign around we found K8s,
has all the stuff we needed.

Environment very cooperative and receptive to suggestions

022
This is what you get:
"I want to run something", and it runs somewhere in the cluster where there is space.
Clean machines after workload is gone.
Like init, but for a set of machines.

023
The Pod, split a container into units that make more sense.
Pod = resource barriers (like VM, but is not a VM)
images, multiple, allow for sidecars
sidecars can manipulate and debug payloads in their pod
pods are very cheap, just namespaces and limits, take up almost no resources themselves

024
Don't say container
container = the pod, the image, the init-container, the sidecar?
use specific words

025
Iteration 1:
inital deployment to test things out
8 bladecenters = 128 blades, 2x 10 Gbit per Blade
"Not really a cloud, it's more like ground fog" when you have only one blade center per rack

Iteration 2:
128 discretes, 8 racks, 1x 25 Gbit/s per machine, with option to double, lots of storage and play with distributed storage

026
The million core computer
20.000 machines at 50 cores for a million core computer, too large, needs to be split for many reasons

image based
unified hardware
location indepence = any core to any disk in aby box
strong networking

027
List of problems that need solving
ours vs. openshift
openshift has solved many of the base problems

029
L3, Leaf-and-spine, can be oversubscription free up to 1.6 TBit/s at the ToR, but we have no need atm
we have a lot of east-west-traffic, that is unlike before

030
Out network looks like this, PROD 15
containers has 100 Gbit, but same topology
No special K8s network, just better cables, more switches

031
Juniper, Midokura, we found that SDN "is too good" for our needs,
not using a SDN, having Midokura on the backburner,

032
Openstack like SDN gives you a lot of flexibility
can build an arbitrary virtual network,
SDN will build and simulate that
We do not want to give Devs this power,
we do not want devs to build arbitrary networks.
We want something standardized.

033
Shared infra on a physical node (centralized logging)
We do not do this right now, instead sidecars
Logging, Monitoring use cases
We are not a hoster, so sharing things can be done and is fine

034
IP addresses and host names no longer mean a thing
everything is dynamic
how do you find things?

035
service load balancer
instances register in the etcd, I am operational (readyness), announce endpoint
life check, renew subscription

036
services expose load balancer pools
Lookup not done for every request, only on pod creation/destruction

037
in reality a bunch of iptables rules
really many iptables rules
40-50k
select random instance to handle request on DNAT

038
K8s does not migrate instances
destroy/create == rescheduling
number of instances is variable, single things should not exist

040
storage is complicated
state is complicated
manually created PVs,
first match,
manual pool, 
overprovision

041
PVC, dynamically provisioned, matches PV to PVC and provides
banana with 10 GB
many storages do not like volumes created/deleted at a fast pace
or reclaim if exists
cleanup?

042, 043
mount to host, bind mount into container
on reschedule mount follows you around

044
iSCSI has limits (64 hosts with Trident)
using wrong API
is being fixed
iscsi latencies are a thing that is important

046
things with names
are pets not cattle
pet sets -> stateful sets
uniqueness guaranteed
ordered teardown, startup
identity (also identity tied to volume)
examples zookeeper, mysql, elasticsearch, others
we have mysql running

049
Network side of things:
ip per pod
100 hosts, how many ip per host, how many per cluster
100 node cluster -> eat a /16
we need ipv6 in cluster, but k8s is not doing this

050
Ingress Routers exist on Gateway node,
can act as chokepoints when there is a lot of traffic from certain nodes,

051
Put legacy databases inside the cluster
using in our case ovs-switchd,
"take physical database and lift it into the virtual"
have a node in the cluster that is not a cluster node.
So node needs to be trusted.
Also a problem in proper SDN

052
exist IP is random, and does not identify a service
ip based security no longer works.
traditional firewall is useles, whitelist entire cluster
red = allowed, green, yellow, blue = random other things

053
in our current model, fw rules autogenerated from serverdb data
firewall rule autogenerated is useless

054
TLS all the things, use client certs
handle auth transparently, trireme
JWT in TCP 3-way handshake
still needs to be tested
scary idea

056
how large can a cluster be?
can run on a laptop, or 1 or 3 prod boxes
low hundreds of cluster nodes
large clusters not good
want multiple clusters, for resiliency

057
federation if you have multiple clusters
very experimental k8s feature
research topic, no idea if that works
if it works, it will be very useful

059
We like baremetal, we control the crosstalk between apps
freely define instance sizes
talk to cloud provider about 1 mio cores, how long would it take to spin this up?
they do not have the capacity ready in idle, can take a while to get capacity
at enterprise level the cloud is not elastic, preallocation is necessary
data centers are not things that have high margins or low latency
4MW = 20.000 machines -> somebody needs to run excavators
long term contracts are par for the course
so it is mostly a capex to opex shift

060
why on bare metal
vms are not helping with any problem we have
vm management systems do not look reliable

061
What about the Monolith?
That's another problem, it's a problem being worked on.

