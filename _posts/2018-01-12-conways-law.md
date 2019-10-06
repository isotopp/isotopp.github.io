---
layout: post
status: publish
published: true
title: Conway's Law
author-id: isotopp
feature-img: assets/img/background/rijksmuseum.jpg
date: '2018-01-12 18:45:51 +0100'
tags:
- computer
- erklaerbaer
- lang_en
---
[Melvin Conway](https://en.wikipedia.org/wiki/Melvin_Conway) is a compiler
developer and systems designer, who is well known for the eponymous
[Conway's Law](https://en.wikipedia.org/wiki/Conway%27s_law). Various
phrasings exist of that, and one popular is

> Organizations which design systems are constrained to produce designs
> which are copies of the communication structures of these organizations.

The original paper and an introductory paragraph can [be found on his
website](http://www.melconway.com/Home/Committees_Paper.html). It's worth
reading, because there are more useful insights to be found in the original
writeup. 

So what does this even mean? Can you give examples from your current or
previous work environments?

What Conway says is that communication across personal and organisational
boundaries is not free. He phrases that in the context of design processes
by a large committee, which divides itself into subgroups and then
delegates. 

This process already constrains the choices the whole group and the
subgroups can make, which in turn will shape the outcome of the resulting
design.

> Thus the life cycle of a system design effort proceeds through the
> following general stages.
>
> 1. Drawing of boundaries according to the ground rules.
> 2. Choice of a preliminary system concept.
> 3. Organization of the design activity and delegation of tasks according to that concept.
> 4. Coordination among delegated tasks.
> 5. Consolidation of subdesigns into a single design.

The subdivision and delegation phase creates boundaries of communication
between groups. The Coordination phase among delegated tasks and the
Consolidation phase of the subdesigns costs additional communication
overhead from the various people and groups involved. 
Avoiding this resistance and energy expenditure is shaping the structure of
the resulting solution to the point where that structure will mirror the
organisational structure. 

There are several corollary observations in his paper: 

Conway makes interesting observations regarding overpopulation of design
groups and how this has consequences for the design. He points to
Parkinson's Law and states 

> As long as the manager's prestige and power are tied to the size of his
> budget, he will be motivated to expand his organization.

This leads to large pools of people. These people need to be used, or as
Conway writes 

> A manager knows that he will be vulnerable to the charge of mismanagement
> if he misses his schedule without having applied all his resources.

But large pools of people need to be subdivided into smaller groups to be
able to work usefully, and that creates administrative boundaries which will
shape the outcome of the design.

> This knowledge creates a strong pressure on the initial designer who might
> prefer to wrestle with the design rather than fragment it by delegation,
> but he is made to feel that the cost of risk is too high to take the
> chance. Therefore, he is forced to delegate in order to bring more
> resources to bear.

in the words of Conway. Flat hierarchies are important. In Conways world
view of 1968, he correctly states that 

> the number of possible communication paths in an organization is
> approximately half the square of the number of people in the organization.
> Even in a moderately small organization it becomes necessary to restrict
> communication in order that people can get some "work" done

Modern corporate communication structures get away with more direct, less
hierarchical communication structures than we had fifty years ago, and that
is indeed a great source of progress, because it make it cheaper to cut
through administrative boundaries and lowers cross-division communication
cost.

Conway's Law also works backwards for operations organisations: In order to
operate a system successfully, you must create an organisational structure
that matches the design of the system that you are trying to operate. 

You can observe Conway's law in motion around you every day:

- A developer finds a bug in a program that is supplied by an external
  vendor. Will the developer have the energy to put their own progress on
  hold, create a bug report, drive the bug and repair discussions in the
  remote organisation and then integrate the fix? That is not usually what
  happens. The developer will instead integrate a workaround into their code
  and may or may not take it upon themselves to report the bug upstream.
- A company has a security organisation that is a separate division from the
  development organisation. The rollout of a new corporate security policy
  and tooling makes it impossible to install unmanaged plugins in the
  managed main browser. Some of these plugins are necessary or helpful for
  the development organisation to do their job. Will the development
  organisation individually or collectively engage in a discussion with the
  security organisation in order to be exempted from the misguided security
  attempt? That is not usually what happens. Instead somebody will point out
  that workarounds exist (Run an unmanaged browser, run a browser unmanaged
  remotely on a box not controlled by the security organisation and mirror
  the screen onto the developers desktop, or others). There is a strong
  incentive to not point out these workarounds to the security organisation,
  because shutting down these workarounds is a reasonable risk to assume and
  the development organisation will protect their ability to be able to do
  their job.
- A security bug exists in a piece of software from an outside vendor. The
  outside vendor does not accept any bug reports, or does not honor them, if
  they are reported by random people that are not support customers of their
  organisation. Will the finder of the bug take it upon itself to convince
  the vendor to accept the bug report even in the absence of a support
  contract? That is not usually what happens. Instead the security bug might
  be ignored or will be sold for money to organisations that care about
  knowing about security bugs that nobody else has knowledge of, or it will
  be anonymously publicised in order to shame the vendor into fixing it. The
  third way is actually the best outcome here.
- A developer needs access to the interface of the service another part of
  the company provides. While the web interface of the service is
  accessible, the underlying database is not directly accessible. Access is
  being denied in as many words: "Access denied." instead of pointing out
  how to actually apply for access and which permissions are needed. Will
  the developer take it upon itself to find ways to properly access the data
  in question? In the observed example that is not what happened. Instead a
  screen scraping, HTML parsing solution has been implemented.

What can you do? Organisations that put up barriers, in the name of
departmental structure or security, need to understand that the majority of
access attempts are genuine and potentially legal. An efficient and agile
organisation will make itself accessible and will provide clear instructions
how to communicate with each failed or denied communication attempt.

Examples:

- Never print "Access denied", but explain how to get access.
- Never turn away bug reports, but make an effort to distinguish between bug
  reports and support requests.
- Never establish security controls without running them in logging instead
  of enforcement mode at first. Use that log data. Differentiate groups of
  users and understand their legit needs.
- Establish a preference for trailing controls instead of chokepoints. That
  is, log and gobble, parse and investigate the log whenever possible
  instead of preventing access whenever you can get away with that.
- Do this especially around the development part of your organisation. If the
  security branch of an organisation annoys the development part of an
  organisation they just created a formidable in-house adversary that will
  try to subvert their efforts through literal or creative interpretation,
  unexpected workarounds or atypical user behaviour.

What else can you do?

Break down organisational barriers where they turn out to become development
obstacles. That is for example, if the security organisation and the
development organisation are not aligned enough for the purpose of the
company, try to mix and integrate the two. 
DevOps and later
[SecOps](https://techbeacon.com/secops-how-security-devops-can-deliver-more-secure-software)
are attempts of actually doing this.

Many corporate shuffles and re-organisations are actually attempts of
corporate structures to align themselves better and bring down communication
costs. Understanding the reshuffle and trying to match that up with the real
or perceived problem that this reorganisation is trying to solve can be very
instructional: in judging the management and communications skills of the
management involved, and in recognising the perceived or actual problems the
organisation has.

Always be aware than when you change an organisation, the software system
they created before is a mirror of their _old_ organisational structure and
the old structure of the software system that organisation created will now
work _against_ the new organisational structure. Allow for time and effort
to mitigate that.

Expect delays.
