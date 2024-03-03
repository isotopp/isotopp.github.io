---
author: isotopp
title: "A Revolution Devours Its Children"
date: 2023-11-11T05:06:07Z
feature-img: assets/img/background/rijksmuseum.jpg
toc: true
tags:
- lang_en
- publication
- free software
---

Initially published in c't 26/23, page 70.
All my texts are made available in this blog after some time.
The version shown is the raw edit of the article text without pictures and illustrations.

Hier ist das Original [in deutscher Sprache]({{< relref "/2023-11-11-eine-revolution-frisst-ihre-kinder.md" >}}).

# A Revolution Devours Its Children
by Kristian Köhntopp

## Departure from Traditional Open Source Licenses

Open source once set out to guarantee users the greatest possible freedom in the operation of software and to challenge the software titans.
Meanwhile, however, these have learned to use the documented freedoms to their advantage.

There is unrest in the open-source community: In recent times,
it can be observed that established software companies with a large user base are restricting the freedoms of their users by
changing licenses of their open source projects.
The most recent example is HashiCorp, a company specialized in software for cloud infrastructure,
which has placed its core products under the BSL v1.1 (Business Source License), a formally non-open license.
The response was immediate: 
the software has since been forked as OpenTofu and is now under the auspices of the Linux Foundation.

HashiCorp is not the first company to do this: some time ago, 
RedHat changed the positioning of CentOS as a free alternative to RedHat Enterprise Linux (RHEL) 
and recently restricted the release of the RHEL source codes through an EULA (End User License Agreement),
Elastic has put ElasticSearch and Kibana under the formally non-open SSPL (Server Side Public License), 
and MongoDB is also only available under the SSPL.

## Four Freedoms and a Certification

Open Source and Free Software existed even before these terms were coined. 
However, the actual "Open Source Revolution" began in the 1990s with the Linux kernel and the resulting distributions. 
The term "Open Source" was coined by Bruce Perens and Eric Raymond, 
formalized in the Open Source Definition and the Debian Free Software Guidelines.

Both are refinements and clarifications of the original "Four Freedoms" in the mother of all open-source licenses,
the GNU General Public License (GPL), which are:

- Freedom 0: The freedom to run the program for any purpose.
- Freedom 1: The freedom to study how the program works and adapt it to your data processing needs.
  This implies access to the source code.
- Freedom 2: The freedom to redistribute the program. 
  However, the GPL requires that the source code of the program, which corresponds to the redistributed program, is also offered.
- Freedom 3: The freedom to improve the program and distribute these improvements under the original license.
  This also implies access to the source code and the right to modify it.

While the GPLv2 is the license that first codified these freedoms, 
a whole range of licenses quickly developed that are all "Open Source"
according to the OSI guidelines (Open Source Initiative) or the DFSG (Debian Free Software Guidelines),
all of which are free but some are incompatible with the GPL. 
This, in particular, filled many Usenet newsgroups with ongoing discussions throughout the late 90s.

## The LAMP Stack: A Wild Mix of Licenses

The well-known LAMP stack for web development is also an example of the license confusion that can occur with open source.
LAMP includes the Linux Kernel, the Apache web server, the MySQL database, and the PHP programming language.
Each of these components has different licenses.

While the Linux Kernel is licensed under GPLv2, the Apache web server is under Apache License 2.
This is a permissive license, 
meaning it lacks provisions that enforce changes to the original program to be distributed under the same license as the original program.

MySQL has two licenses: 
The database can be used under the GPL, subject to the provisions and freedoms mentioned above.
However, the copyright holder is a company (originally MySQL, then SUN, and now Oracle) that holds all rights.
Developers must assign the rights to their patches to Oracle via a Contributor License Agreement (CLA).
This allows Oracle to also offer the source code under a commercial license.

And PHP has been under the PHP License since version 4.
This is also a permissive license that allows the use and distribution of PHP with or without modifications, 
as source code or executable program, but contains restrictions regarding the use of the "PHP" trademark.

This leads to an important question from the late 90s: 
What happens when you mix software with different licenses and distribute them together in a distribution or link them together in a translation process?

The GNU Project quickly clarified that the boundaries of the license are the process boundaries.
If you develop a program under another license and link it with GNU software so that the result is executed in the same process afterward,
this is legally okay only if the other license is compatible with the GPL.

Although the GPL is an open-source license, not many licenses are compatible with the GPL.
This is because the GPL contains freedom-preserving restrictions: 
you can't restrict the execution of the software ("Not in nuclear missiles!").
And a program that contains GPL components must also be offered in source code with all changes.
This means not just the GPL components, but all components in this process space.

## The Debate Over the "Infectious" GPL

The obligation to publish the source code then led to another discussion in the early 2000s. 
At that time, Linux and Open Source became so prominent that they could not be ignored,
and many startups flirted with Open Source.
Although the GPL was the most widely used license at the time, it is not an attractive prospect for investors 
to have to release all the company's software sources under the GPL.

It was during this time that the anti-open-source slogan of the "viral" or "contagious" GPL originated,
which is nonsense at its core:
On the one hand, the GPL is easy to contain because it ends clearly defined at process boundaries;
on the other hand, the provisions of the GPL make sense because they make direct exploitation of others' work more difficult 
("Quid pro quo: If you benefit from Open Source, then you should contribute in the same way.").

## GPLv3 Against Software Patents

In response to venture capitalists who brought another threat to Open Source into play, a reaction became necessary:
software patents. 
If startups have to release their software under the GPL, 
they might restrict their intellectual property in other ways to later collect licensing fees.
At the time, software patents were positioned as a real threat.

The justification for version 3 of the GPL directly addresses this, and GPLv3 includes provisions that,
in simplified terms, state: 
"If you use patents to sue users of any GPLv3-licensed software, then your right to use any GPLv3 software is terminated."
This clause is effective, and it has led to, among other things,
Apple avoiding any form of GPLv3-licensed software in its products 
and progressively replacing any GPL software in Apple products with software licensed differently.

The provision that the GPL ends at process boundaries is sometimes problematic for the GNU project as well,
and so there are variants of the GPL and exceptions.
For example, code generated by GPL-covered programs is not protected by the GPL:
This allows code generators such as gcc, bison, and flex.
And for some libraries, including glibc, there is the LGPL, also called "Lesser GPL," 
which allows the libraries to be linked against non-GPL software.

## "GPL Instead of LGPL" as a Weapon

Conversely, some companies have used the GPL as a weapon.
For example, libraries like "libmysqlclient.so" were available under the LGPL up to MySQL 3.23,
but from version 4 onwards, they are under the GPL.
Therefore, if one links this library into their commercial program and wants to distribute it,
they must buy a commercial MySQL license under the dual-licensing program.
MySQL summarized this in the slogan, "If you are free, we are free. If you are commercial, we are commercial."

This was a problem for a while for the programming language PHP,
which linked against this library to access the database as part of the LAMP stack but has a formally non-GPL-compatible license.
PHP countered this problem by reimplementing the protocol as "mysqlnd,"
and in parallel, MySQL solved the problem by defining a license exception for PHP (and others).

## Less GPL, More MIT, BSD, and Apache

All these confusions are one reason why "modern" open-source software often no longer uses the GPL 
but prefers other licenses such as MIT, BSD, or Apache. 
They make a number of capital-financed business models around open source simpler, 
especially if you want to build a company around a product that is open source in name only.
From 2005 onwards, business models based on open source began to flourish.
This has worked well enough for 15 years to grow the number of projects significantly.

Some of these projects do not rely on individual companies as sponsors:
PHP, KDE, and Postgres, for example, are stable and large-scale OSS projects 
that are not backed by a single large company and its venture capital investors – 
they all feature a broad and deeply rooted base of contributors.

In recent years, cracks have appeared: RedHat, Elastic, MongoDB, MariaDB (a MySQL fork), HashiCorp, 
and many others have changed their licenses or restructured to exclude a specific use case. 
Since this constitutes a violation of Freedom 0, they are no longer open-source projects in the sense of OSI and DFSG.

## The Elephant in the Room is the Cloud

Amazon Web Services (AWS) is a system and a company that epitomizes a business model: 
It monetizes the aspect of "operations," which is often neglected and underfunded in companies,
and aims not to develop software for third parties but primarily to operate it.

Amazon has been very successful with this model: 
For some time now, more new installations of MySQL (and MongoDB, Postgres, Elastic, and many other databases)
have been running in its data centers than locally with clients ("on-premise"). 
This is a class of systems that are notoriously hard to operate because errors in operation can irreparably ruin data.
Of course, one can roll back a faulty database version to the previous one,
but the data destroyed by the error is still permanently lost.

The systematic underestimation of the costs and effort operations require is 
what makes the principle of "Software as a Service" (SaaS) successful.
SaaS providers are selling not just a service,
but primarily an operational concept for this service that allows smooth and uninterrupted operation right after commissioning.
Because the operational concept is tested and prescribed, the quality of the service can be standardized,
measured, and then stable contracts can be entered into with third parties.

Customers welcome this because operating software is a problem at least as challenging as developing software.
Many customers do not want to deal with this.
Often, they accept availabilities, response times, and costs that were completely unacceptable in their own in-house teams before.
All of this just to get the complex task of "operating the databases" out of the house –
this shows how uncomfortable companies are with dealing with "operations."

The operation of this software by AWS is not covered by a commercial agreement between the software manufacturer and Amazon,
but is based on the Freedom 0 of the GPL: 
Amazon is allowed to run the software for any purpose, including as a service for others.
As a result, Amazon collects the money for the operation of these installations, 
but the actual software developer, the manufacturing company or group, gets nothing from it.
This is not a sustainable financing model, but it is covered by the GPL and very advantageous for AWS,
so there is no incentive for them to change anything.

## Business Source License as an Early Reaction

The issue of cloud services exploiting open-source software without contributing back to the developers was recognized early on:
The "Business Source License" (BSL) was first mentioned in the blog of Monty Widenius,
a key figure behind MariaDB, as early as 2013, and MariaDB has been using it for certain components since 2016,
with slight changes after suggestions from Bruce Perens, resulting in version 1.1 in 2017. 
Other products followed suit and adopted the BSL: Couchbase, Uptrace, Kurtosis, Sentry, CockroachDB, 
and recently all HashiCorp core products.

The idea behind the BSL is that the software remains freely usable and the source code available, 
but with restrictions. 
The most important restriction usually means "AWS is not allowed to use this," 
phrased as "The software may not be offered as SaaS for third parties."
Thus, one can use the software as before.
It can also be operated on AWS itself, or it can be provided within one's own organization for other departments.

However, one will not be able to buy the operation of the software as a service from a cloud operator,
but only from the creator of the software itself (e.g., via AWS Marketplace).
This limitation is intended to ensure the financing the development of the software 
by preventing AWS from completely diverting this stream of money for itself.
The BSL comes with another rule stating that code changes must be released under a recognized open-source license (usually the Apache 2.0 license or GPL).
There is a time limit for that: a maximum of four years, ensuring that older versions of the software are always true open source.

Formally, BSL software is not open source in the OSI or DFSG sense because, unlike the GPL, 
Freedom 0 ("run for any purpose") is restricted.
Therefore, it is also referred to as "Source Available."
The Server Side Public License used by MongoDB, Elastic, and Kibana follows the same idea, only differently: 
the SSPL is a variant of AGPLv3 that also restricts Freedom 0 and prohibits operating the software for third parties 
("as a Service") unless a commercial license is acquired.

## Non-Free Free Software

The fundamental idea behind the GPL's freedoms is give and take: 
"You can use our software, but you have to play nice in return." 
The ever-growing dominance of AWS is making it increasingly difficult for open-source creators to earn a living from their development work – 
AWS offers their software as a service and integrates it with other services. 
Freedom 0 of free software here turns against the creators of the software.

The BSL and SSPL are reactions to this.
Formally, they are not free software, according to OSI or DFSG.
But perhaps it is time for open source to once again face changes and new threats,
adapting licenses and definitions for the new era, as has already happened with GPLv3 and AGPL.

Perhaps the FSF, OSI, and Debian will not move and will insist on their definitions of "free software."
But this does not deter developers of software under BSL and SSPL:
their software is already "almost free" and, due to their special rule,
will formally become free software according to the old definition after a few years. 
There is no reason to reject BSL or SSPL, except for fundamentalism towards free software.
However, if those who care about the open-source idea do not want AWS to be the only company with a successful open-source business model,
then change is necessary. 
Otherwise, users will soon find themselves back with dull, traditional commercial software,
the kind they used to get from companies like Microsoft and Oracle.
