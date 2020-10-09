---
layout: post
title:  'Pizza, People, Projects and Processes'
author-id: isotopp
feature-img: assets/img/background/rijksmuseum.jpg
date: 2020-06-15 10:37:23 +0200
tags:
- lang_en
- project
- process
- management
- erklaerbaer
---
*An older talk from 2 years ago, which for some reason I was not able to find in the blog.*

For reasons that do not need exploration at this junction I had to explain Processes and Process Maturity some time ago, and a colleague asked me to put my thinking into a talk. So this is going to be boring, because you are likely to know most of this already, but on the other hand, it is good to be on the same page when it comes to models and vocabulary.

So you want Pizza. What is pizza?

![](/uploads/2020/06/pizza/scooter.png)

*A deliverable: A defined product delivered at a deadline.*

Pizza is a project. Projects have a deliverable (a defined product) that is available at a certain deadline, latest. So, a Margherita within the next 20 minutes is a project.

![](/uploads/2020/06/pizza/margherita-project.png)

*Pizza as a project*

If you phone up a Pizza, you are outsourcing. That is, you offer money for Pizza as a Service. On the other hand, the shop at the other hand is delivering Pizza as a Service. How are they able to do that?

They need a Pizza Delivery Process, in order to be able to pull that off repeatedly and reliably, at a projected cost and speed. So, we get process because we have “A regular demand on an organisation, and the organisation wants the capability to handle the repeated demand in a predictable fashion.”

![](/uploads/2020/06/pizza/process-demand.png)

*Why process?*

So if something is a one-off, you will not get process and you should not. Instead it’s “individual heroics”. If something is done a second or a third time, it’s probably time to make it official. You put it on the service catalog, you plan for it, and you create structure in your org around it.

In the end, it can look like this:

![](/uploads/2020/06/pizza/pizza-as-a-service.png)

*[CMMI for services, Service Delivery](https://www.wibas.com/cmmi/service-establishment-and-delivery-cmmi-svc) (pretty much the same as ITIL SD)*

CMMI for services 1.3 creates a set of processes interacting to structure service delivery. It looks complicated, but it’s not. There is the customer, and service delivery delivers. There might be an incident such as the oven being on fire, and Incident Resolution takes care of that. The Strategic Service Management looks at how we set up the kitchen, and what goes on the menu - the production process. Service Development thinks up the way the kitchen is structured and works, and Service Transition makes sure the kitchen is being built and that cooks and servers are trained. The Incident Resolution in ITIL has deeper structure, looking at larger scale problems that can be extracted from individual services, and interacts with the Service Transition in Change Management.

Nothing here deals with billing, that would be service management - contracts for supplies, subscriptions, catering for events or individual pizza sales, and quality control (complaints).

What we build here could be a single pizzeria, but also a chain that deals with Pizza at a scale.

![](/uploads/2020/06/pizza/sd-process.png)

*The ideal outcome of proper process*

When you perform process, you are in a cycle. The stages of the cycle are named differently, depending on your management ideology, but it’s always a planning stage, a doing stage (“a sprint” in Agile), and a stage where you look back at how things work and what we can learn (“a retrospective” in Agile, “Check” in PDCA). Then you implement potential improvements (“Act” in [PDCA](https://en.wikipedia.org/wiki/PDCA)).

![](/uploads/2020/06/pizza/pcda.png)

*"continuous improvement" goes by many names*

No matter what you call these things, these cycles form the bones of a continuous improvement process. 

![](/uploads/2020/06/pizza/checking.png)

*From closest to furthest, looking at product and process.*

Checking can be done by continually distancing yourself from the product and the process.

So the closest way of looking at a thing is checking for compliance: Are we following the recipe? If not, maybe we should fix that.

Then you can ask yourself if that recipe is the most efficient way of getting the result. Are there other ways of getting the same outcome, in which we need fewer resources or can do it faster, with fewer people or less training?

Then, is the recipe effective? That is, is the Pizza any good? If not, can we fix that?

And finally, is the process still applicable? There is little point to having a Pizza Process in an Artisanal Burger Shop, is there?

After the retrospective, the checking, we have a list of changes. How do we implement them?

That, in itself, is a meta-project: We want to change the recipe (adjust the written documentation), and the minds of the people (training them to follow the new recipe), then test that the change happened. And we want to have done that by $DEADLINE.

So processes spawn meta-projects to change themelves.

![](/uploads/2020/06/pizza/acting.png)

*Change is a Meta-Project. It has deliverables, and a deadline.*

We always need to take all three pillars into account: There is always an organisation, with roles that have defined tasks, skills, and that need staffing. There are people that staff the roles, they need training to get the skills they need and to understand the specific tasks they are supposed to perform, and there is the Tech that is supposed to support People to perform their roles. For some reason that Tech is always the least important thing in a process.

So [on a scale of 1-5](https://en.wikipedia.org/wiki/File:Characteristics_of_Capability_Maturity_Model.svg), how good are we at a thing?

Suppose you are a Pizzeria, and you are really good at Pizza as a Service. Now somebody comes in, and wants Spaghetti. Bologna, of all things. You happen to have the noodles, and you have the sauce, because of the Pizza of the same style you serve.

So, you make it. You just went from 0 to 1: Not Performed to Individual Heroics. That was a success!

![](/uploads/2020/06/pizza/noodles-as-a-service.png)

*Getting Noodles as a Service.*

The next level would be 2: Planned & Tracked. That means, it’s on the menu. You buy noodles, train the servers and the cooks (plan performance), you track noodle dish popularity, and customer satisfaction.

Then you get a pasta section on the menu: Level 3 - you have a standard noodle process next to your pizza process, and you derive individual noodle dishes from that by adjusting the noodle process.

Level 4 - quantitative tracking, is the next step. You start to measure, and compare. That is not possible for one-offs, you need iterations. It’s also not possible for rare things, because statistics need large numbers, and you don’t even know the relevant numbers are when you start out. It’s also not possible when you hypergrow, because each iteration will be very different from the previous iteration - if you grow 10x, the process to achieve the same deliverables is too different from the previous iterations for meaningful comparison.

Anyway, we now track Pizza and Pasta properly, across all of our outlets in our global Italian Fast Food chain, account for regional differences (“Calzone Hutspot” does seem to be popular only in the Netherlands, and is frowned upon in Italy, for example) and we take that into account.

Finally, you get a continuous improvement process that tracks change quantitatively and has the appropriate controls to make change accessible to management.

So where do we invest when we care about improvement?

![](/uploads/2020/06/pizza/where-to-improve.png)

*Where to put money and time for improvement?*

We have to sort processes by Criticality, obviously, by Maturity (no need to invest into things that are already in shape) and then decide how much we can and should spend.

Maybe we give up Pizza production, and outsource ourselves, or just pre-products and reduce our capability to assembly.

![](/uploads/2020/06/pizza/outsourcing.png)

*Must be at least this tall to successfully outsource.*

In any case: that will fail, if we and our partner are below level 4, each, in process maturity. Without a shared understanding of the deliverable and the relevant metrics, there is no common understanding of what is being sold or bought, and a lot of pain and finger pointing will be the result. That is, without process maturity, you need to do stuff yourself, no matter what.