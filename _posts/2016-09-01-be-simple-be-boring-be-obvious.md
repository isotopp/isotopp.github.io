---
layout: post
title:  'Be simple. Be boring. Be obvious.'
author-id: isotopp
feature-img: assets/img/background/rijksmuseum.jpg
date: 2016-09-01 08:08:46 +0200
tags:
- lang_en
- config management
- computer
- devops
---
On Core.Infra day, I was invited to speak. This is my talk. There were many like it, but this was mine.

![](/uploads/2016/09/obvious/obvious.001.jpg)

## In operations, code is not your friend.

This is about what I did the two years I have not been around here. I first worked for Booking in 2006 as a MySQL consultant doing databasey things. I joined Booking as an employee later, in 2008. By then, I was working in Amsterdam, but living in Berlin, so I was flying around quite a bit. In 2014, that became unworkable and I signed on with a Berlin based eCommerce hoster to do some awesome stuffs.

SysEleven had about 3000 customers, mostly German eCommerce or news sites. The company had less then 50 employees in 2014 and grew to 70 people now. I joined a newly formed team, whose task was to build the new hosting platform for SysEleven.

![](/uploads/2016/09/obvious/obvious.004.jpg)

Given that we were to build the new platform, there has to be an old one. The old platform was based on single machines with all storage local, and maybe a NetApp or two mounted from external. Hosting was done on OpenVZ based containers, and the Underlay (Hypervisor) was generally managed by puppet. The Overlay (contents of the container), too, mostly. But due to limitations in Puppet, architectural decisions of the past and the nature of the workload imposed by customers that was not done consistently and completely. There was a lot of fuzz around the edges, and some things were completely on manual.

![](/uploads/2016/09/obvious/obvious.005.jpg)

The new platform was based on Openstack, with a software designed storage solution, and a software designed network solution underneath, no local storage on the machine (all bytes always come from the SDS). Underlay and Overlay were to be completely controlled by Puppet, and in fact, the actual installation process was to be done by Puppet as well.

We actually succeeded in doing this.

![](/uploads/2016/09/obvious/obvious.006.jpg)

So you have several racks full of HP DL380s, all powered off and cold. The bootstrap talks to the iLOs, turns on the hardware, inventories everything, zaps fresh ROMs and iLOs onto everything, and then paints a base operating system onto the machines that is just enough to bootstrap Puppet. Puppet then continues to install and personalise the machines and build an Openstack from this, including SDS and SDN cluster builds before the Openstack install.

The total installation time was 30-45 minutes, if everything went well, but usually not everything went well. :-) Also, Puppet as a tool is extremely focused on managing a single host and does not work well with the concept of a cluster. If you want to build such a thing, you end up coding a lot of stuff against the internal logic of Puppet, using Stages to have synchronisation points, or invoking very ugly hacks written as external Python scripts that sync up the cluster before allowing everybody to continue to the next phase.

I learned that there is a place that can genuinely and rightfully be called Puppet Hell.

![](/uploads/2016/09/obvious/obvious.007.jpg)

We made the decision to not write Puppet modules when we could reuse external work. That turned out to be a not so smart solution. We imported external repositories into our internal Gitlab, and in order to structure things, we set up a bunch of different segregated areas, teams. In the end we had about 200 repos, in six different teams.

![](/uploads/2016/09/obvious/obvious.008.jpg)


That led to a lot of problems. We did not set out to have these problems, it just kind of inevitably happened.

200 Repos is quite a lot, and even with tooling you end up making mistakes. Some people will not be able to see some repos, not because they should not, but because of mistakes. Some things are done manually, others are done automatically, but rules change or team members move, but the rules are not adjusted and other stuff.

Anyway, you inevitably end up in a situation where you are making a change and you are not aware of all the consumers of the change - either because you can’t see them, or because you did not bother to check out that repo, or because your search did not find them. Not fixing your consumers will break them, and hence the build. That is annoying.

You also can’t make your changes atomically. You may make your change at the source, and merge it, but you still need to merge and push the 13 consumers of your change, and that can take time, or fail. Until you complete the merge in all Repos, nobody in the team can roll out. That sucks.

Finally, if visibility is limited, it may be that two people are producing or importing duplicate solutions for a problem. Worse, it may be that these duplication are actually duplicate external imports, but at different version requirements. That makes it very hard to manage project dependencies and size.

![](/uploads/2016/09/obvious/obvious.009.jpg)

We are doing Puppet, so what is it that we import when we import stuff from Puppetlabs, or github?

Well, mostly generalised configuration management classes for Puppet. 

What is that?

Most configuration files are actually Hashes of Hashes with a unique kind of syntactic sugar. MySQL my.cnf files, Bind configuration, Openstack ini-Files, and so on - the are all HoH’s.

So what you get is a YAML-shovel that will generate the HoH that is, say, an Apache vHost-definition from the Hash of Hashes inside Puppet variables. Which in turn are being loaded from the Hash of Hashes that is a Hiera YAML file.

When you want to make a config change, you can’t edit a native Apache config file. You need to read the code, seeing how the Puppet in-memory HoH is being transformed into the actual Apache config. Then you need to look further back and understand how the twelve dozen Hiera files actually overlay each other to form these Puppet structures, and inject your change in the right place.

Then you need to try this out and actually see what config is being generated.

![](/uploads/2016/09/obvious/obvious.010.jpg)

You need a lab. For a config change.

That is because your config and your config generation became so complicated that it is no longer obvious. It is no longer obvious what that code does, and it is no longer obvious what your change does.

In our case the test environment is an entire datacenter, the vanguard data center. That is clearly insane.

How did we end up in this place?

Let me introduce [The Configuration Complexity Clock](http://mikehadlow.blogspot.com/2012/05/configuration-complexity-clock.html).

![](/uploads/2016/09/obvious/obvious.011.jpg)

You write a piece of actual code, in a proper programming language. Values are pieces of code, constants. They are baked in. It is noon on the config clock.

Things change, values need to change. You need different values in different places, so you load variables from a file, the config file. It is now 3.

Somebody needs more than that - there are rules. “Some rooms are only available at some price if the stay includes a Saturday” is such a rule. Or “The amount of memory we give to the Innodb buffer pool is all machine memory minus 20% or 4GB, whichever is smaller, unless it’s a mz box with all that Blob stuff going on.” is another such rule. It is now 6 on the config clock.

Of course some things can no longer be expressed as rules. You need a fully blown language with data structures, control structures, loops and include files. You get a config management DSL. Something like puppet. It’s 9 on the config clock.

![](/uploads/2016/09/obvious/obvious.012.jpg)

»The team spend most of their time writing code in the new DSL.

After some embarrassing episodes, they now go through a complete release cycle before deploying new DSL code.

The DSL text files are version controlled and each release goes through regression testing before being deployed.«

That’s SysEleven, doing puppet. That’s us, doing Puppet - if not now, then it’s going to be us very soon.

![](/uploads/2016/09/obvious/obvious.013.jpg)

That is, because what we are doing is no longer obvious, so we need to check the presence and type of parameters to our Puppet classes.

We need to write tests that check the validity and content of the subconfigs generated.

We then need to do integration testing, in order to prevent catastrophic loss of the entire site from centralised config changes.

![](/uploads/2016/09/obvious/obvious.014.jpg)

At SysEleven, when we were at that point, we stopped. We threw away our complete stack of “Setup Openstack from scratch” and started over.

We chose a different config management system, in our case that was Ansible, but that is not really important.

We did choose something else than Puppet, mainly so that we were unable to directly reuse any component we previously wrote.

We did come up with some rules in order to prevent ourselves from descending into Puppet Hell again. Our goal was to enforce simplicity, and obviousness.

![](/uploads/2016/09/obvious/obvious.015.jpg)

We did switch to a Monorepo, at least as much as possible. There were other, external dependencies with other parts of the company that prevented us from going completely Monorepo, but it kind of worked well enough for us.

We did use Ansible, and while the actual choice of the config management system officially did not matter as long as it is not Puppet, Ansible does have a number of advantages that Puppet does not have. One of them being that it deals much better with distributed software than Puppet can do, and the other, much more important one being that it is very limited.

It is impossible to do complicated things in Ansible. At some point, if Ansible is not sufficient, you need to stop ansibilizing and switch to Python. That’s a good point to raise the issue with the team and asking around what’s actually the problem and how an Ansible extension written in Python is going to make this better.

This is good, because it gives you a point where reflection and goal-setting are in order, and a hook where project management processes can be invoked.

We also looked at our YAML shovels and asked ourselves what they are good for. We found that they are overgeneralised solutions for our problems. We do not need to be able to write any conceivable Apache config from our config management code, we only need to be able to write our Apache config from it. 

Or, more generally:

## Feature development is about generalisation, avoiding limits, delaying decisions and being more flexible.

## Infrastructure development is about being concrete, making decisions, setting limits and being obvious.

I cannot stress the importance of that enough. It was at the core of all of our problems.

We decided to write config files directly. If there is an Apache config, write that Apache config file in Apache config file syntax into the Ansible template directory, and install it as literally as possible. Changes will be obvious in what they do.

Do not use variables, unless you can show that in our config there is actually variation.

We did catch ourselves in review in anticipating problems we didn’t have, introducing complexity we didn’t need. Good thing we did establish review, because every single team member failed at being as simple as possible, multiple times.

We did have a few cases were it was in order to write code, remove duplication and generate stuff in a loop or similar things, but these cases were few and far between.

![](/uploads/2016/09/obvious/obvious.016.jpg)

Our new setup was an order of magnitiude smaller and much, much easier to understand.

We did bring in external people and tried to explain to them what we did, and how things work, and the new setup was so much easier to work with that this was actually possible.

We did not need tests any more, because changes were obvious. Code that is not present does not need to be tested in the first place.

![](/uploads/2016/09/obvious/obvious.017.jpg)


So, looking at us here: What’s in it for us?

I do believe, after reading a lot of code in our Puppet and in other places, that Simplicity as a value in itself would work well for us, too.  Code isn’t our friend, either, especially in Core.Infra and Operations related places. We are here to make decisions, not delay them, and to be obvious, and as simple as we can get away with. Which is hard enough given the fact that our size and growth force more and more distributed stuff on us, which by it’s very nature has a high inherent complexity.

I think the entire container thing is a brilliant idea, and we should be doing it more.

A lot more.

Immutable containers, being created and then loading values from a Zookeeper or Consul, instead of running Puppet on every host, painting state changes over state changes that may or may not have been previously applied.

Eventually we will no longer have any need for Puppet at all any more, despite the fact that we are a larger company that is doing a lot more distributed stuff than now.

## The Tao of Operations:
### Be simple. Be boring. Be obvious.
### Because every time you aren’t, you get to write a postmortem.