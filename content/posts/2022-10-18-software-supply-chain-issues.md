---
author: isotopp
title: "Software Supply Chain Issues"
date: "2022-10-18T06:07:08Z"
feature-img: assets/img/background/rijksmuseum.jpg
tags:
- lang_en
- security
- software
---

The GitHub Security Lab has a long hard look at "Apache Commons Text" in March this year.
That resulted in [CVE-2022-42889](https://securitylab.github.com/advisories/GHSL-2022-018_Apache_Commons_Text/).
The exploit goes like this:

```java
final StringSubstitutor interpolator = StringSubstitutor.createInterpolator();
String out = interpolator.replace("${script:javascript:java.lang.Runtime.getRuntime().exec('touch /tmp/foo')}");
System.out.println(out);
```

Next to `${script:...}` there are apparently also a `${url:...}` and `${dns} as other unsuitable substitutions, and they nest.

This was fixed in October 2022, after being reminded by GHSL in May and August.

It was introduced in October 2018, in Version 1.5, and only discovered in March this year.

# What's wrong with this?

The security impact of this new feature is obvious, when discussed.
Yet, it was integrated in October 2018, and that apparently did not raise any red flags in a security or merge review.
Also, none of the users of the library found anything weird.

The package has [documentation](https://commons.apache.org/proper/commons-text/userguide.html).
String substitution is described in the manpage for that class, [StringSubstituror](https://commons.apache.org/proper/commons-text/apidocs/org/apache/commons/text/StringSubstitutor.html).
The "fix" for the CVS was to disable some substitutors.
This is described in [StringLookupFactory](https://commons.apache.org/proper/commons-text/apidocs/org/apache/commons/text/lookup/StringLookupFactory.html).

It took almost 3.5 years for somebody to look at this and find that to be a security risk.

After reporting the risk, it took Apache 2 reminders and way more than the standard 90 days to react and publish a mitigation.

This means

- nonfunctional feature and security impact review for code merges.
- slow reaction to security issues (CVSS 3.x score: 9.8)

Clearly, the security process of the Apache organisation has huge room for improvement.

# Is that a good mitigation?

You decide. Among the interpolations that are still enabled by default are

- [fileStringLookup](https://commons.apache.org/proper/commons-text/apidocs/org/apache/commons/text/lookup/StringLookupFactory.html#fileStringLookup--), which replaces the `${file:UTF-8:/filename}` with the content of a file.
- [propertiesStringLookup](https://commons.apache.org/proper/commons-text/apidocs/org/apache/commons/text/lookup/StringLookupFactory.html#propertiesStringLookup--), which replaces a value for a key in a properties file.
- [environmentVariableStringLookup](https://commons.apache.org/proper/commons-text/apidocs/org/apache/commons/text/lookup/StringLookupFactory.html#environmentVariableStringLookup--), which replaces `${env:USER}` with the content of an environment variable.

All have the potential, if controlled by an attacker, to read and leak data, and maybe secrets.
That is not remote code execution, but probably still arbitrary file read and secrets leak.

Such a string interpolation under control of a user is risky at best, but the default configuration is still far from secure, even if the fix improves things.

# Not the first time

This situation seems to be a repeat of the [log4j exploit](https://nvd.nist.gov/vuln/detail/CVE-2021-44228) from the year before.
In the log4j case, the initial find was presented on a conference and dismissed as unimportant.
It only escalated after the exploit was used in the wild against Minecraft servers and their associated Discords, and then it quickly escalated to the full scope we observed last year.

Handling this was imperfect as well, with a series of fixes trying to mitigate the problem, and failing to do so in the first round.

So both projects/packages

- accepted contribution of text interpolation without understanding the implications that thing would have
- bungled the security response process, in various ways (slow response, or no response at all)

This points to non-functional processes inside the collection of Apache projects.
They are either not executed, or they are not effective, when executed.
The meta-question is if the collection of Apache projecs are aware of that, and how they are trying to address this?

# Are there more packages that have this issue?

As a developer or organisation that makes software, you sometimes take on external dependencies.
You are still being asked to be able to answer questions about the whole product, so you need a way to form an opinion about the state of the dependencies and their dependencies.

That starts with an inventory, and some useful scoping.
And the mostly liveness, quality and maturity of processes.

## One evaluation approach

One quick evaluation approach is documented [here](https://askcloudarchitech.com/posts/tutorials/open-source-security-dependency-review/).
I'd reorder things a bit.

- "Is it necessary"-Phase: Do we need that dependency?
- "Is it popular"-Phase: Who else is using this?
- "Is it maintained"-Phase: Do we see commits? Do we understand the code and the commits?
- "Is Security considered"-Phase: Check their security response process and the execution
- "Is it supported"-Phase: Go check out their presence on various media. 
  How do you reach them?
  Are they approachable or more on the Hugo/Cyrus spectrum of interaction?

## Another evaluation approach

Another approach is documented [here](https://opensource.com/life/14/1/evaluate-sustainability-open-source-project).

It is similar, and asks you to

- check contributions, and contributors. Read a bit of code.
- Look at the release history. Are the regular releases? A schedule?
- The user community. Are they talking to people? How?
- Longevity.
- The general ecosystem.

I'd add some kind of metric around process execution.
Check merge reviews, execution of security process and again, approachability and response times.

## Another, commercial approach

Some vendors are starting to approach this, for example [this](https://socket.dev/npm/package/@webassemblyjs/ast/overview/1.11.1).

All in all, this seems to be a largely unsolved problem.
Criteria are uneven across various attempts, projects and ecosystems. 
Some languages or projects seem to have problems even with creating an inventory of dependencies.
