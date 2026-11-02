---
author: isotopp
title: "Service Directories and what they are good for"
date: "2023-02-06T06:07:08Z"
feature-img: assets/img/background/schloss.jpg
tags:
  - lang_en
  - devops
  - security
aliases:
  - /2023/02/06/service-directories-and-what-they-are-good-for.html
---

At a previous job, we had a home-grown application called "Service Directory" (SD), where teams registered services or deployed applications.
Each service record linked to the source code repository, artifacts and documentation.

It also recorded operational facts: criticality, owning teams, SLO, alerts, stats and dashboards.
And, most importantly, you had to declare dependencies -- which other services you depended on.

# Using Dependencies for Firewalls and Passwords

Firewall rules were generated automatically from data in the service directory.
Without a complete SD declaration, you could talk to nothing and nobody.

All machine accounts (non-personal accounts, NPAs) were provisioned with HashiCorp Vault under SD's control.
The system generated the data in Vault from – you guessed it – the service directory.
And it rotated the credentials.

Every week or so, the system added new accounts with new passwords to Vault.
The services picked them up first, then the clients – order matters a lot here.

Separate machine accounts for each application help identify service (or database) abuse.
They also allow rate limits and other controls per application, and of course let you grant each application only the permissions it needs.

Monitoring would show whether anyone still used last week's accounts.
If so, somebody would need to talk to the team whose service still used them: something was caching credentials when it should not.
Once the old accounts stay unused for some time, you can decommission and delete them.

This also produces graphs showing how fast accounts (and passwords) rotate across the enterprise, which helps in audits.
You can prove that passwords are fresh and that former employees cannot use old NPA secrets to access production.

# Using Dependencies for Capacity and Business Continuity Planning

Dependency data also helps with other tasks, such as capacity planning, if you add the necessary data.
SD data alone does not contain the volumes needed to plan, but dependencies show who can generate demand on a service.
That tells you what to measure and where to find more information, such as current fleet size and plans for the coming season.

You can also map dependencies onto locations and structural failure boundaries of the underlying physical machinery.
This lets you calculate failure scenarios and, using actual placement data, detect co-failure scenarios or write scheduler plugins to avoid them.
A dependency graph also helps you build a black start plan.
You would still need to test it, but at least you have the data.

# Dependency Inflation

In such a setup, an application will not work if it declares too few dependencies.
So you can rely on SD data to include at least the dependencies it needs, or more.

The "or more" part is undesirable, but hard to limit.
The only workable way I have seen requires annoying recurring audits, or equally annoying demands to re-request all resources regularly.

As an experiment, you can compare requested resources with observed usage in production to find unused resources.
You cannot cancel them automatically, because they may still be necessary in rare situations.
But this would at least keep the nagging manageable.
