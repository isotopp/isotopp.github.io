---
layout: post
title:  'MySQL: Ecosystem fragmentation'
author-id: isotopp
feature-img: assets/img/background/mysql.jpg
date: 2020-10-28 15:28:00 +0100
tags:
- lang_en
- mysql
- database
---
Sometimes things change in a way that is hard to put a finger on, but I am doing this MySQL thing since 3.23, and commercially since 2005, and the environment is changing. These days, when you talk to people in need of MySQL, the first thing you have to ask them is "Which MySQL". And by that I do not mean a version number in the first place.

The answer may be:

- AWS RDS MySQL
- AWS RDS MariaDB
- AWS Aurora
- MySQL Community Edition
- MySQL Enterprise Edition
- MariaDB
- and now, new, MySQL on Oracle Cloud.

The answer to this question, usually qualified with a version number, decidedly influences what is available in features, access, performance, and what is usually the root cause for problems.

Not only in support, but also in application design, scaling limits and many more things.

Specifically:

- Aurora V1 limits you to MySQL 5.6 features, and V2 to what was available in 5.7.12, four years ago. You scale automatically, and in some cases far beyond what is available on a single machine, but specifically performance behavior is very different from regular MySQL. Not only is the storage layer completely different, but Aurora has also ripped out and rewritten certain features (such as GIS), so it's essentially a completely different database that happens to speak MySQL protocol.
- RDS nominally supports 8.0, but 8.0 is decidedly a second class citizen in RDS. Since the majority of all new MySQL deployments are likely RDS deployments, this holds back the pick-up of 8.0 as a target for application developers considerably.
- Some features are only available in Enterprise Edition, even when you run on your own hardware, but they cannot be language features, exposed to developers (for the same reason as above - nobody would target them), so the difference between CE and EE can only be operational. There it can be substantial.
- MariaDB, see Aurora, is now a completely different database that happens to speak the same wire protocol. The amount of special casing in my workplaces database management tooling makes that very clear: Internal logic, status and control variables, even the way replication works, is all quite different. It is easier to treat it as a completely different thing than to special case MySQL/MariaDB all the way through the codebase.
- Oracle cloud will most likely try to differentiate itself with cloud-only features the same way Aurora does this. On the other hand, with applications running in AWS, will you send SQL queries across the internet to your Oracle cloud database instances and eat all that latency? Worse, will your Enterprise go through all the interdepartmental overhead to certify another cloud for use, just to run database instances that AWS also has (minus some features, but for which AWS likely has other, specialized services)?

## What happens instead:

At work, our application runs on MySQL.

But the number of 3rd party products that drop MySQL support (not Oracle MySQL support, but "all MySQL, so also not MariaDB") is growing.

They all move to Postgres, to the point where it becomes necessary to make AWS Postgres and local Postgres officially managed targets for supported deployments in our Enterprise.

Or, shorter, the triangle AWS-Oracle-MariaDB presents too fragmented a front, a frenemy experience, and is losing a lot of developer mindshare because of that.

That makes me very sad.