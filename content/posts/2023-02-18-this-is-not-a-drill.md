---
author: isotopp
title: "This is not a Drill, this is just Tuesday"
date: 2023-02-18 06:07:08Z
feature-img: assets/img/background/schloss.jpg
tags:
- lang_en
- devops
- security
---

# Master of Disaster

With a previous employer there was the requirement to implement business continuity management and patch management.
Specifically, there was a requirement to be able to lose a region completely without loss of business.
The other requirement was to be able to have all systems CVE-free within 30 days (in emergencies: 3 days), and to be able to blackstart them.

That was of course impossible to implement.

Managements reaction was to create the position of the "Master of Disaster" (MoD).
The MoD and their apprentice ("always two there are") have then planned, for many months, a failover between two Regions.
But they did not achieve much, and they never could, because in the end Management Buy-In was missing.
In the end, Management wanted to know (needed to know!), before the test, that it would work.
That of course invalidated this approach completely.

# "Security is a process", what does that even mean?

The MoD then changed their way of working completely.
They sat down with the teams, and with each they made a catalog of failire modes.

"What happens when a web server node fails?"
"What happens when ten web server nodes fail?"
"What happens when a load balancer dies?"
"What when a rollout rolls out broken code, and we need to roll back?"
"What when storage fails?"

And the MoD sat down and worked their way through protocols of outages past.
They cataloged the outages and mapped then to the scenarios created above, and if they found missing cases the catalog was extended, together with the team.

# It is only science if you write it down

Then the team was asked to predict what would happen, how they would notice and how to fix.
The MoD made them write these things down, into Opdocs.
The Opdocs got Identifiers.
All scenarios had to have named alarms checking for the scenario, and each alarm message had to include the Opdoc ID.

Then the team created a test scenario for each of these outages, bundled them together into a test session ("a drill").
And together with the Master of Disaster, their apprentice and a scribe went through them one by one, writing down what happened.
Afterwards, all sat down, and compared notes with the predictions, and made a set of tasks to update the Alarms, the Opdocs or the Procedures themselves.
Then they scheduled a followup session.
In the end they arrived at a rythm of a Drill every two or three sprints, until the team and the MoD were satisfied with the outcome.

# Rinse, Repeat

The MoD did that with all the teams, and magically after a year or so, things were no longer painful, but became a way of operating.
The observed failure modes of the systems changed, because Drill findings made their way into development.
The way of working and the way of thinking changed, in all the teams, fundamentally, even.
Alerts became cleaned up, and with the need to attach Opdocs, Alerts became actionable, because that is what is in an Opdoc: 
Packaged actions a relatively unskilled Operator can execute.
Tooling improved, to automate previously manual outage procedures.
Automation grew.
Reliability and reproducibility improved.
Metrics got better.

# Large scale outages

Now the MoD moved on from team-level subsystem failures to larger scenarios that simulated loss of Racks or other larger units, or loss of Network connectivity (intermittently or for longer time).
Also, they added drill scenarios with a loss of storage, that is outages where teams did not get back the machine that was simulated to fail after the Drill.
Instead, they had to create replacements, first individually, then had to black-start entire regions.

These Drills highlighted automation defects:
Manual and often undocumented work went into creating new systems, so that the automation was not resilient against large scale loss.

Also, a lot of problems related to loss or unavailability of the automation control plane were highlighted:

Systems might be able to lose their automation controllers.
This is a "loss of control" scenario, not "loss of availability".
You do not lose web servers, but you lose the ability to make new ones or to decommission old ones or change the config of the existing ones.
Systems usually can continue to run without their automation controller for a few hours, provided the operational circumstances are somewhat stable.

In some cases, loss of state in the control plane highlighted that the control plan could not rediscover its clients out their and scan them for state.
Instead, it was assumed that the entire region was to be recreated from scratch, when it was in fact there, and perfectly functional, just unknown to the controller.

In some cases the automation assumed that new systems were to be recreated from scratch by cloning over data from remote regions.
But if all teams are doing that at the same time, the line capacity is insufficient.
It is necessary to do something more sophisticated and use local state (cloned over once) to implement a local fan-out.

Again, a year or two went past, with limited scope but larger drills.

Teams picked up the new requirements, development learned a thing or two, and by simply repeating until good the message arrived and improvements got implemented.
We have now reached a state where automation is only considered "done done" when it survives one of the regularly simulated outages,
and when the state of the Opdocs is good enough for members of adjacent teams (instead of the native team) to manage the outage.

Also, we have reached a sophistication of automation that allows us to drop each and ever instance and each and every image after 90 days,
because replacements are redeployed automatically, and state is cloned over.

# Burning it all down

This, after only three to four years, is where our organisation has reached a state where teams and management can go with confidence into a scenario where access to one Region is lost, in a controlled way and with pre-announcement.
Management can believe that the entire thing is understood well enough that this Drill will not lead of a major loss of income.

Unannounced random failure of a Region, or total recovery from backup after a ransomware attack are still open issues, but they have become realistic targets.
Each would amount to rebuilding a Region, automatically, from nothing, without loss of operations or income.

# This is not a Sprint

![](/uploads/2023/02/not-a-drill.png)

The key to success for the MoD was the change from Project to Process.
Do small things with individual teams, first with cooperative teams, then reaching out and making the process mandatory for all teams.

This was not a single giant monster project, but small steps over many years, with a change in the MoD position and with a redefinition of the title and scope of the position along the way.
It also was a fundamental change in the way how operations are done, and what is acceptable.
It improved not only the business continuity stance, but also improved security overall, and made many audits and certficiations easier.
It also delivered the necessary metadata (machine inventory, mapping of services to instances, mapping of depdencies, implementation of controls) to management to make a large set of certifcations and audits just a formality.

When people say "Security is a process", this is what they mean.
Small, doable exercises that become part of everyday operations.
Then incremental widening of scope and increase of difficulty.

And the work is not done by the MoD, buy by the teams -- all teams.
The MoD only steers the process, and guides the teams through it.

Because this is not a Drill.
This is just Tuesday.
