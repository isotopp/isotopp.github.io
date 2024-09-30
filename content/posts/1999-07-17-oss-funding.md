---
author: isotopp
date: "1999-05-02T09:00:00Z"
feature-img: assets/img/background/rijksmuseum.jpg
title: "Funding Open Source Projects"
tags:
- lang_en
- publication
- internet
---

**von Thomas Roessler und Kristian Köhntopp**
          
*Am Rande der Konferenz <a  href="http://www.micro.org/Events/OS">Wizards of OS (1999)</a> fand eine Anhörung des BMWi zum Thema "Open Source Software" statt. Dabei wurde der volkswirtschaftliche Nutzen von Open Source Software erörtert und es kam die Frage auf, ob man die Entwicklung von Open Source fördern könne, ohne gewachsene Strukturen zu zerstören und inwieweit dies sinnvoll wäre.*

*Dieses Papier entstand auf Initiative von Thomas Roessler und ich hatte Gelegenheit, einige Ideen und Vorschläge einzubringen. (Mitte/Ende 1999)*
                
The Net is famous for changing rapidly, and being a rapid medium for
discussion and innovation.  The transaction costs over the net are
low.  The Net enables international, fast, and effective
communication and cooperation.


This has various effects.

- E-commerce and the mythical web-year.  Among the much-hyped
  e-merchants, it's "be faster or perish".  Small
  organizations are generally faster and have less problems to
  fully exploit the low transaction costs offered by the Net,
  thus acquiring new, international markets, and endangering
  larger competitors' market positions.

- Free software.  Over the last years, we are observing that
  Free Software which can be modified and shared by every user
  is gaining market impact.  The average free software project
  has collaborators from all around the world, and it has been
  translated to at least a dozen languages, possibly including
  obscure and rarely-spoken ones.  Typically, few if any of the
  participants have ever met in reality.

  Such cooperations are made possible by the fact that the average
  home user can utilize a world-wide data network at moderate cost
  to share source code, experience, and thoughts.

  Organizations which wish to work with the free software community
  should be prepared to act at similar speed and with similar
  efficiency as this community.

In the present document, we explore how funding and support
mechanisms interact with the development model behind free software.
We come to the conclusion that funding free software projects is
difficult, and that standard funding procedures may not be suitable,
since they impose transaction costs which are close to or possibly
beyond the amount of funding which would actually be granted, and
which are beyond what a free software project can invest.

In addition, we note that there are structural requirements for
effective free software development.  Political and financial
support should try to address these requirements and make sure that
the general climate which lets free software development flourish is
preserved or even improved.


## 1. Free software development

### 1.1 The Process

Typical free software development starts with a small group of
persons who try to solve specific problems, or want to realize an
idea.  This initial group will create fundamental, and probably
running code which does at least solve some part of the initial
problem.

This initial implementation is published on the Net.  Others learn
about it, find it useful or interesting, and start to either
implement things which are generally to be done, or which are needed
for their own applications.  This way, the group using and
maintaining the free software product will grow, in turn leading to
great speed of development.

Recent numerical evidence from the fetchmail project (which shows a
logarithmic growth curve with time), and general experience
indicates that, depending of the kind of free software product,
development will eventually slow down or even come close to a halt,
once certain objectives have been fulfilled.

However, new ideas about how things can be done and what should be
done may lead to the effect that certain dedicated individuals (and,
later, groups) re-start rapid development of the whole project, or
of certain parts.

For instance, in recent months, the person maintaining the IMAP
modules of the Mutt e-mail client was very active, while most of the
other code evolves slowly and is mostly stable - even in the branch
called "unstable".


### 1.2 Case studies: KDE vs. Mozilla

There are some things that can be learned from failed Open Source
efforts, like for example the Mozilla project. While the Mozilla
project is smaller than for example the KDE project, unlike KDE
Mozilla is stagnating and does not attract developers. The project
is missing self-assigned deadlines and does not deliver.

The Mozilla project started out with an existing codebase that was
largely unreadable, underdocumented and incomplete, that is, the
existing source did not even compile. Also, the project was stuffed
with Netscape funded developers, which had more time and
considerably better knowledge of the source than any outsider. The
projects schedule had no milestones which produced a working and
distributeable project, it had no incremental roadmap. And finally,
there were no small code fragments which could stand alone and be
handled by a single person. Instead the whole project consisted
mainly of a single monolithic block of code which could only run as
a whole.

Consequently the Netscape funded developers outcoded and outwitted
any volunteer programmers, making outside participiation hard and
ungratifying. There were no small pieces of code outsiders could
point at and say "this is my code, I have done this". There were
never great public releases which could be used to show off the
product and be used to attract more developers, leveraging a "this
could be your project, you could be part of this" effect. The center
of the Mozilla effort was always the product, which was planned to
be released like a Closed Source product with a big bang once it was
finished. This changed later with the Mozilla Milestone releases
M1-M9, but even these were not announced like product releases, but
were handled much more quietly instead.

Compare this to KDE, which is written in C++, too, and which has a
similar or even larger size. KDE started as a (and still is) a spare
time project of an ever growing group of volunteers.  KDE releases
often, and releases even unstable code if it compiles and seems to
run. KDE does so with regular version numbers and press releases,
even if the whole product hasn't stabilized: Each KDE release
contains subpackages which are considered stable and other that are
optional and marked as experimental. The KDE project is highly
compartmentalized and many people "own" a piece of KDE, working
together in small groups with a high degree of interaction.

In fact Mozilla and KDE are perfect examples for how not to and how
to manage Open Source projects: Unlike Mozilla, KDE acknowledges
that the driving factor in an Open Source project are people and
their interest into an evolving product, the 6 month KDE release
cycle and the KDE subproject sizes are designed to take this into
account.


### 1.3 Key factors

A large portion of the free software development currently going on
is done by volunteers in their spare time.  Even the K desktop
environment (one of the largest free software projects), and the
Debian GNU/Linux distribution are developed almost entirely by
unpaid volunteers.

We have to ask ourselves what the key factors are when volunteers
produce state-of-the-art software in their free time, often beating
commercial software in efficiency, stability, and quality.

We identify three key factors:

- The transaction costs for international collaboration and for
  publication of software are extremely low.

- There is a sufficient reservoir of suitably educated persons who
  are able to design and write free software.

- These persons must have sufficient time available, and must have
  the motivation to spend this time working on free software.

## 2. Supporting activities

Each of these key factors can be an object of supporting activities.
We look at them in detail.


### 2.1 Transaction costs

As we noted above, transaction costs for Internet use are low, and
falling.  However, there are several factors which can lead to costs
which are beyond free software developers' budgets.

1. Projects may grow.

   Kalle Dalheimer of the KDE project reports that the ressources of
   the machine which is used by the KDE project for source
   repositories and its automated version control system are
   completely used by this project. Originally, that machine had
   been bought by a University Department to do moderately
   computationally intensive jobs, and the KDE version control was a
   minor task performed using idle processor cycles and ressources.
   However, as the project grew, the university eventually donated
   the machine to the project.

   In a similar fashion, projects may get into situations where
   testing equipment is required.  For instance, the Debian
   GNU/Linux project is maintaining ports of its Linux distribution
   for various platforms.  Machines matching these platforms have
   been donated to the project by various parties.

   It should be noted that the ressources needed by these projects
   are still minor when compared to even the smallest enterprise's
   IT investments.

2. The legal framework may lead to costs.

   The legal system in which software is developed can lead to major
   cost issues which may turn out to be lethal for free software
   development.  Politics which favors free software should try to
   avoid these factors.

   For instance, a legal situation in which anyone who publishes
   software (free or not) has to do extensive and expensive patent
   research in order to avoid legal hassles and even higher costs
   would be anything but favorable to free software.  It's worth
   noting that the world's second largets softwre corporation,
   Oracle, takes a position towards software patents which is
   astonishingly similar to the free software community's.  See the
   references section for details.

   Export controls may lead to similar consequences: When expensive
   and time-consuming administrative acts are necessary to get
   permission to publish software on the net or pass it on to other
   developers, projects may eventually come to a halt.  Note that
   even the most moderate export control which is tolerable for
   almost any enterprise may turn out to lead to transaction costs
   fatal for free software projects.

### 2.2 Generating a reservoir of sufficiently and properly educated persons.

The notion of computer literacy on which school "computer science"
teaching is based should _not_ be the ability to use Microsoft
Office programs.  Instead, students should have an opportunity to
learn about IT and programming concepts.  In particular, they should
be given the seed of knowledge and abilities needed to continue and
extend studies on their own.  This teaching has to be done at an
early age to be really effective.

It should be noted that commercial software development environments
are expensive and frequently beyond students' budgets.  In practice,
many students learn software development using pirated software.
However, this is not necessary, given that free high-quality
development environments do exist.  These development environments
prove effective in every-day practical use by the free software
community.

Schools should teach the use of these environments instead of using
or even requiring commercial ones.

### 2.3 Getting developers to do the work.

First of all, when software developers are working actively and
successfully, it may be a good idea to just let them do their work.

In some cases, there is an interest by certain industry or
government bodies in the development of certain pieces of free
software.

We can distinguish various well-defined objectives organizations may
have:

- Maintain a system, and port it to possibly new environments.
- Implement a limited set of additional features which are needed or
  seem sensible to the funding party.
- Get a project off ground.

Obviously, it's easy to hire a professional at his usual rate, who
will then perform a well-defined task.  The results will then be
made freely available by the hiring party.


However, this is just traditional custom software development with a
twist, and we will not further explore this path of thought.  We
only notice that the Free S/WAN project, a free implementation of
the IPSEC protocol suite for the Linux kernel, is a sample sucess
story for this approach.


In the next section, we address a possibly more typical situation:
How can an established free software project be supported when there
are <i>no</i> well-defined objectives.


## 3. Funding a free software core team: requirements for sponsors.

Things start to look different when organizations are observing a
free software project which is currently in the hot phase of its
development, and "simply" want to be helpful with this project.  In
most cases, the key participants to the project are voluntarily
investing their free time.

Hiring external professionals which take over part of the project
will have highly undesirable effects on the development process,
since it may not be acceptable to the original software authors.  If
at all, this should be done with extreme care, and only when
explicitly solicited by those who are actively working on the
project.

Thus, the key developers themselves are the best suited recipients
of funding.

There are several questions to be resolved in these cases: Do the
key developers _want_ to continue to work in their spare time only,
without getting paid for it, but with all the freedom to do what
they want?  Would the key developers be able to invest more time or
effort into the project when external funding has been established?

Obviously, funding only makes sense to the paying party when
possible recipients are interested in it, and when there would at
least be some gain in development speed or quality, assuming that
the funding party does not have well-defined objectives which may be
used to measure progress and quality.

One particular reason for establishing this kind of funding is when
key developers may start to step back from active development due to
lack of time and ressources. Funding may be extremely valuable to
projects in such cases. Currently, one of the most common ways of
sponsoring such persons seems to be to hire them and give them
enough "free" time they can spend on their projects.  Prominent
examples for this practice include Linus Torvalds (Transmeta Corp;
the Linux kernel) and Dirk Hohndel (SuSE; the XFree86 project).

Unless limited to certain well-defined jobs like specific additional
features or planable development steps like releases, or aimed at
maintaining an active long-term project like the Linux kernel,
funding must be started quickly to fit into most projects' "sensible
general-purpose funding time window". Thus, possible sponsors must
be able to react quickly and flexibly to programmers' needs. The
average administration's procedures may take longer than the "hot
phase" of the project to be sponsored.

After all, there is no reason for most free software projects to
stop activities until the funding is ready. This is a
substantial difference from traditional software development,
and from "traditional software development with a twist" as described above.


Getting the fund-raising settled should not involve substantial
transaction costs for either party.  When a one-day meeting several
hundred kilometers away from the funding target's usual place is
required just to get negotiations started, the possible funding
target may not be willing to accept the transaction costs involved
with train journeys or plane flights - they may actually be greater
than the total transaction costs generated by the project to be
sponsored so far, and may quite well be higher than costs for
possibly sensible infrastructure investments such as backup systems,
hard disks, or faster computers.  (A 10GB hard disk is cheaper than
a train trip from Bonn to Berlin and back.)

Finally, in order to get some success control when there are no
well-defined objectives, the sponsor should directly monitor the
open development process.  Evaluation of funding success after short
time intervals may be a reasonable practice.  On the other hand,
requiring the set-up of a large organization on the programmers'
side would introduce considerable costs and delays into the process
which are not necessary or justified.

## 4. Conclusions and summary

The most valuable support for free software development in general
is not directed.  It is aimed at creating an environment in which
free software development is possible, and encouraged.

Most important, policy-makers must make sure that the legal
environment does not add artificial transaction costs and delays to
the free software development process, and encourages programmers to
create and freely give away state-of-the-art software.  Points which
deserve particular attention are software patents and export
control.

School education on computer science should enable students to
participate in actual projects.  To do this, education on
programming concepts and languages should be offered at an early
stage.

When funding of specific projects is desired, it should be done with
great care, and should probably only be done upon request or when
it's obviously helpful.  The organization providing the funding must
match certain requirements.  Most important, it must be able to act
quickly and efficiently.  It should be prepared to cope with
requests which are far below the limit of conventional industry
investments or government funding.

It is possible to centralize funding for infrastructural elements
such as network bandwith, source repositories, bug tracking systems,
and similar services.  These services can easily be shared by
multiple projects.

## References

- Eric S. Raymond, <i>Trends in the fetchmail project's growth.</i>, 1999-09-28, <a href="http://www.tuxedo.org/~esr/fetchmail/history.html">http://www.tuxedo.org/~esr/fetchmail/history.html</a>.
- Oracle Corporation, <i>Patent Policy</i>.  1999-10-10, <a href="http://www.base.com/software-patents/statements/oracle.html">http://www.base.com/software-patents/statements/oracle.html</a>.
