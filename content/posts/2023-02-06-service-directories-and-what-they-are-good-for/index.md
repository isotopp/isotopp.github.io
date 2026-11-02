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

It also recorded operational facts: criticality, owning teams, service level objective (SLO), alerts, stats and dashboards.
And, most importantly, you had to declare dependencies -- which other services you depended on.

Think of a checkout service that calls a payment service and uses a database.
Its record would identify its owners and link to its code and operational documentation, while its dependencies would point to the payment service and database.

Here, **downstream services** are the services we use and depend on; **upstream services** are the services that use us.
From checkout's point of view, the payment service and database are downstream.
From the payment service's point of view, checkout is upstream.
The terms are relative to the service we are discussing, and follow the direction of requests, not responses.

Each service declares its downstream dependencies.
Reading those relationships in reverse tells you its upstream callers, and who to contact when it fails or needs to change.

The directory was more than documentation: its declarations drove automation.
That made keeping it accurate part of operating a service, rather than a separate housekeeping task.

# Using Dependencies for Firewalls and Accounts

Firewall rules were generated automatically from data in the service directory.
Without a complete SD declaration, you could talk to nothing and nobody.

In the checkout example, declaring the payment service as a downstream dependency provides the basis for allowing checkout to connect to it.
The declaration describes the intended relationship; generating a firewall rule also requires technical details such as network endpoints and ports.
An allowed network connection and permission to use the service are separate controls.

All machine accounts (non-personal accounts, NPAs) were provisioned with HashiCorp Vault under SD's control.
The system generated the data in Vault from – you guessed it – the service directory.
And it rotated the accounts: each rotation created a new username/password pair, rather than changing the password on an existing account.

Every week or so, the system added new accounts with new passwords to Vault.
The new accounts had to be in place in the downstream services before Vault handed their credentials to upstream clients – order matters a lot here.
In the example, the new account must exist in the payment service, with the required permissions, before checkout starts using it.
The old accounts must remain valid until the upstream clients have switched, or rotation causes an outage.

Separate machine accounts for each application help identify service (or database) abuse.
They also allow rate limits and other controls per application, and of course let you grant each application only the permissions it needs.

Monitoring would show whether anyone still used last week's accounts.
Different usernames make this easy to observe: traffic under the old username means a client has not switched yet.
Changing only the password leaves the username unchanged, so you need a way to distinguish logins using the old password from those using the new one.
If an old account remained in use, somebody would need to talk to the team whose service still used it: something was caching credentials when it should not.
Once the old accounts stay unused for some time, you can decommission and delete them.

I discuss this distinction in [Rotating Accounts or Passwords?]({{< relref "2023-02-20-rotating-accounts-or-passwords/index.md" >}}) and [MySQL: dual passwords]({{< relref "2024-10-31-mysql-dual-passwords/index.md" >}}).

This also produces graphs showing how fast accounts rotate across the enterprise, which helps in audits.
You can prove that clients have switched to new accounts and that former employees cannot use old NPA accounts to access production.
That last claim depends on disabling the old accounts and removing the former employee's access to Vault; creating new accounts alone is not enough.

# Using Dependencies for Capacity and Business Continuity Planning

Dependency data also helps with other tasks, such as capacity planning, if you add the necessary data.
SD data alone does not contain the volumes needed to plan, but upstream callers show who can generate demand on a service, while downstream dependencies show where that demand may create more load.
That tells you what to measure and where to find more information, such as current fleet size and plans for the coming season.

For example, knowing that checkout depends on payments tells you where a rise in checkout traffic may create more load.
It does not tell you how many payment requests each checkout generates, how much clients retry, or how much capacity the payment service has left.
Those measurements turn the dependency graph into a useful planning tool.
For capacity planning, look upstream for demand and downstream for the capacity needed to serve it.
For failure analysis, look downstream for dependencies that can disrupt your service and upstream for callers that your own failure can affect.

You can also map dependencies onto locations and structural failure boundaries of the underlying physical machinery.
This lets you calculate failure scenarios and, using actual placement data, detect co-failure scenarios or write scheduler plugins to avoid them.
Two service replicas may look redundant but still fail together if both run in the same rack or depend on the same database.
A dependency graph also helps you build a black start plan.
That is a plan for bringing the system back after a complete shutdown: which downstream services must be available before their upstream callers can start.
Circular dependencies need special attention, because each service may wait for another that is not running yet.
You would still need to test it, but at least you have the data.

# Dependency Inflation

In such a setup, an application fails when it tries to use an undeclared dependency.
That gives teams a strong reason to declare the dependencies their applications need.
It does not prove completeness: a missing dependency used only during failover may go unnoticed until a failure.

The pressure is also one-sided: a missing declaration breaks access, while an unnecessary one may cause no visible trouble.
Teams may declare dependencies they do not need, or leave old ones in place after the application changes.
These extra declarations grant unnecessary access and make the graph less useful for planning and recovery.

They are undesirable, but hard to limit.
The only workable way I have seen requires annoying recurring audits, or equally annoying demands to re-request all resources regularly.

As an experiment, you can compare requested resources with observed usage in production to find unused resources.
You cannot cancel them automatically, because they may still be necessary in rare situations.
No traffic during the observation period does not prove that a dependency is obsolete: it may serve disaster recovery, a seasonal job, or another infrequent task.
But this would at least keep the nagging manageable.

The useful part is the feedback loop: declarations drive access, so missing declarations break things and give teams a reason to fix them.
A directory maintained only as documentation has no such pressure to stay accurate.
Using it to generate firewall rules and accounts ties its upkeep to running the service.
That helps keep the dependency graph useful for capacity planning and recovery, though extra declarations still need review.

# Links

The Google SRE books cover several of the operational problems that this directory helps address:

- [Managing Critical State: Distributed Consensus for Reliability](https://sre.google/sre-book/managing-critical-state/), in *Site Reliability Engineering*: service discovery and the reliable storage of shared configuration.
- [Addressing Cascading Failures](https://sre.google/sre-book/handling-overload/), in *Site Reliability Engineering*: how overload, retries and lost capacity spread failures across services.
- [Disaster Recovery Testing](https://sre.google/sre-book/disaster-recovery-testing/), in *Site Reliability Engineering*: testing recovery plans and finding assumptions that do not hold during an outage.
- [Non-Abstract Large System Design](https://sre.google/workbook/non-abstract-design/), in *The Site Reliability Workbook*: turning demand estimates into capacity requirements and accounting for failures.

For more on the underlying mechanics, [*Designing Data-Intensive Applications*](https://dataintensive.net/) covers replication, partial failures and the limits of distributed systems.
These books provide background for the planning and recovery work; the directory supplies the ownership and dependency data that work needs.
