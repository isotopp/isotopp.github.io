---
author: isotopp
date: "2024-07-22T04:05:06Z"
feature-img: assets/img/background/schloss.jpg
description: "What can we learn from the Crowdstroke fail?"
title: "Crowdstroke"
toc: true
tags:
- lang_en
- security
- computer
- erklaerbaer
aliases:
  - /2024/07/22/crowdstroke.html
---

This is the Monday after the Friday 
when Crowdstrike took out a good 1% of all Windows machines worldwide with a botched update.

# Some Takes

![](2024/07/crowdstroke-01.png)

## Crowdstrike
The company did release a statement with 
"[Technical Details](https://www.crowdstrike.com/blog/falcon-update-for-windows-hosts-technical-details/)".
This is a big nothingburger.
They are confirming what we already knew.
Nothing is said about the server side, root causes and the chain of process failures that led to this incident.

## Martin Seeger

Martin Seeger compares this to the XZ Incident in Open Source in 
[a post](https://infosec.exchange/@masek/112817758224618946):
> We are now at t+26h.
> Please compare
> how much we knew about the xz-attack after less than a day with what
> we know about the chain of events of giant outage yesterday.
> 
> If something similar had been caused by an OSS component,
> we would see congress discussing a ban on open software in critical infrastructure already.

## Kevin Beaumont

Kevin Beaumont gives the kill count in 
[another post](https://cyberplace.social/@GossiTheDog/112819549722486621):
> Microsoft estimate almost 9 million Windows devices are impacted by the CrowdStrike incident
> (likely from crash telemetry).
> [link to microsoft](https://blogs.microsoft.com/blog/2024/07/20/helping-our-customers-through-the-crowdstrike-outage/)

But the outage did not affect just any one percent of all Windows machines,
but specifically, the one percent
that due to use in commercial environments with special requirements had Crowdstrike installed.
That is particularly funny, because the 
[ToS of Crowdstrike](https://www.crowdstrike.com/terms-and-conditions-de/)
says "not liable, not highly available, not suitable for anything important, and by the way, you are on your own".
I am sure this will be contested in court,
but in any case, the liability clauses of anything else in the market are very similar.

## Manuel Atug

[Manual Atug posts on LinkedIn](https://www.linkedin.com/posts/manuel-honkhase-atug-820b27241_crowdstrike-kritis-activity-7220713390443241472-1EMl/)
about this fact, and the comments section is largely in
[the denial stage of grief](https://en.wikipedia.org/wiki/Five_stages_of_grief).
Mostly people resign ("All EULA are like this."), 
think product liability is never going to be a thing,
and even ask how they are supposed to test this, or implement staggered rollouts for AV and endpoint security updates.

That is not how KRITIS works.
If an outage on a desktop can affect flight operations or supermarket cash registers,
the desktops are in scope.
And the Crowdstrike outage, on the desktop, had an impact on travel, sales and other systems.
That means it's in scope, and the testing, rollout and EULA are not adequate.

## Lennart Poettering

Windows itself is badly prepared for such an outage.
Lennart Poettering (somewhat smugly) 
[in a post](https://mastodon.social/@pid_eins/112818864687187963)
points out that
> So, if you ask me what my takeaway from the Crowdstrike issue is, I'd say:
> boot counting/boot assessment/automatic fallback should really be a MUST for today's systems.
> Before* you invoke your first kernel you need
> have tracking of boot attempts and a logic for falling back to older versions automatically.
> It's a major shortcoming that this is not default behaviour of today's distros, in particular commercial ones.
> 
> Of course systemd has supported this for a long time:
> [Automatic Boot Assessment](https://systemd.io/AUTOMATIC_BOOT_ASSESSMENT/)

Windows does not do that, but Linux could.
If commercial Linux distros were to use this feature.

MacOS also would not have been affected.
Apple prohibits security software implemented as device drivers,
because they [tend to be flawed]({{< relref "2018-06-18-websense-dlp-gives-instant-root.md" >}}).
Instead, Apple provides a framework, System Extensions,
in which a non-privileged process can run a security scanning process safely and in a way
where a crash does not take down the system.
Microsoft claims they can't provide this
because due to contracts with the EU they are bound to give security vendors the same API as they are using themselves.
That is, of course, bullshit.
Defender could use such an API, and then everybody else would have to, as well, because that *is* the API.

## Stefan Eissing

Stefan Eissing describes what the [mod_md]() certificate renewal process does.

Apache mod_md is a module for the Apache web server that implements the ACME protocol as spoken by Let's Encrypt.
Here is how he [describes the update](https://chaos.social/@icing/112829370177074835):
> How Apache ACME (mod_md) gets you a new certificate:
> 
> 1. all ACME communication are done as unprivileged user
> 2. all certificates from the CA are parsed as unprivileged user before storing them
> 3. activation, as privileged user, parses again before replacing production as a last fail safe.
> 
> Since 2017.
> 
> Typical over-engineering. What are the chances a CA sends you a borked file?

This is what Crowdstrike did not do, in the client.

So, what can we learn, not having a proper Root Cause Analysis from the vendor, four days later?




# Learnings

## Windows

- Windows does not offer the equivalent of the macOS System Extension API,
  in which an iterator for files is provided by the OS
  and all security software is running with System Extension Capability,
  but as an otherwise unprivileged user.
- Windows does not offer the equivalent of the Linux eBPF framework,
  which allows vendors to implement probes in a safer, less intrusive and more resilient way than using raw C.
- Windows does not protect against recoverable device driver crashes such as Linux (Kernel Oops vs. Kernel Crash).
- Windows does not do automatic Boot Assessment and Rollback,
  and manual rollback is complicated with disk encryption deployed.

## Crowdstrike

- Crowdstrike implements a kernel process or driver,
  which parses config files in a privileged kernel context which can lead to crash on boot
  (which is remediated by deleting a config file)
  - This is a bad architecture from the 1990ies.
  - Crowdstrike could implement a "System Extension" like static driver themselves,
    and run the analysis in an unprivileged user account.
    They do not have to wait for Microsoft for such an API.
- Crowdstrike seems to use C or C++ instead of a memory safe language such as Rust.
  - Crashing a Rust-written driver in the way demonstrated would be much harder.
- There is no public documentation on the functioning, configuration or the data processed by Crowdstrike in their cloud.
  It is weird that this can be even done in the EU, being GDPR-compliant and all.

## Enterprises

- Enterprises roll out such updates in an uncontrolled way.
  No local testing, no staggered rollouts.
  Complete absence of a proper Change Management process.
- The fact
  that large Enterprises operating KRITIS have fired thousands of employees within the last 12 months also contributed,
  for example, by the inability to implement proper testing and staggered rollout.
  Non-functional decisions have functional consequences.
  Enterprises have lost critical institutional knowledge and functional execution capabilities.
- Enterprises use such software in the critical path of KRITIS systems.
  While not directly in regulated OT, the outage did affect the proper functioning of KRITIS systems,
  and is therefore in scope.
  - This also suggests [inadequate BCM testing]({{< relref "2023-02-18-this-is-not-a-drill.md" >}}). 

In summary,
we are observing a multilateral process breakdown leading to a KRITIS outage,
indicating that we do have compliance driven architecture instead of an actual security process.

See also: [Snake Oil]({{< relref "2024-02-10-snake-oil.md" >}}),
especially the guinea pig at the end.
Some things can only be made bearable with cute guinea pig photos.
