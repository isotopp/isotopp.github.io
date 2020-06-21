---
layout: post
published: true
title: Inhaltliche und kulturelle Steuerung von Foren
author-id: isotopp
date: 2008-07-23 13:47:35 UTC
tags:
- community
- media
- php
- usenet
- lang_en
feature-img: assets/img/background/rijksmuseum.jpg
---
(*Update:* 2020-06-19 [Russian version](https://howtorecover.me/kontent-i-kulturnyy-kontrol-forumov) contributed by Vladimir Htr)

Many years ago, late in 1999, I was involved in the creation of de.comp.lang.php, a USENET newsgroup. Since the group was new I began a personal experiment to influence the communication culture of an [open USENET group]({% link _posts/2005-06-07-zehn-jahre-php.md %}).

That went on for four to five year, out of which I have been actively involved for two years, earning [good Karma]({% link _posts/2007-03-18-warum-alle-meine-texte-frei-im-netz-zu-lesen-sind.md %}). But unfortunately [http://www.php-faq.de/](http://www.php-faq.de/) is now dead (or outdated and inactive).

On my disk there was an old text, unpublished for many years, about the concept behind the engagement. I will just post it here, because the strategy might be salvaged and could be applied elsewhere to similarly structured environments. Other environments need different strategies, as shown in my talk about 
[Flames]({% link _posts/2007-02-11-flames-kommunikationszusammenbr-che-im-netz.md %}). Some of the things shown below I would present differently today, but the core is solid. Maybe it is useful to someone?

### Uplift or A Process to Create Useful USENET Newsgroups

by Kristian Köhntopp

with apologies to David Brin

USENET is generally considered a medium with much noise and little useful
content. The claim is that the natural state of a USENET newsgroup is the
flamewar and that exceptions are rare and generally not worth bothering.

This article tries to establish that this observation need not be true and
presents the process of "Uplift" by which a newsgroup having "Potential" can
slowly be turned into a useful support forum with mostly intelligent
discussions and with procedures to stabilize that state to some extent. The
Uplift process has been tested over the period of one year with the german
language newsgroup de.comp.lang.php (3800 articles/month in September; 22500
articles overall until now).

#### Newsgroup history and some past experiences

de.comp.lang.php was created 01-Jan-2000 by vote of the german USENET
community.

The RfD and CfV processes have been initiated by me because I saw a rising
number of PHP related messages in the german Linux newsgroups. Also, I was
subscribed to the german PHP mailing list
([http://www.php-center.de/php-de/](http://www.php-center.de/php-de/)) and I
was generally dissatisfied with the content and form of the forum. High
volume mailing lists are generally crude to manage and read and mail2news
gateways are only a substitute for the real thing.

On the other hand, the german Linux newsgroups were in a state of disarray
and displayed all the worst characteristics attributed to newsgroups in
general: 

- Newbies were coming into the group and asked the same
  questions over and over, sometimes multiple times a day.
- Regulars were fleeing the group, showing strong signs of burnout.
- Flamewars were the rule, sometimes encouraged by regulars with burnout
  symptoms which had not fled the group, yet.
- Because there was no group culture (except the default culture of flaming)
  and because the groups had no memory, discussions in the group entered a
  vicious cycle and did not improve nor shift topic. All action in the
  groups converged on flaming.

#### The goals for de.comp.lang.php

PHP is the most popular installed Apache module by far, and traffic on the
german mailing list as well as the support for the RfD showed that a
newsgroup on PHP would be a real success and become high-traffic within a
year.

My goal was to prove the german Linux burnouts wrong, and demonstrate that a
newsgroup can be manipulated into being a mostly useful and friendly
discussion forum within four months, by giving helpful answers in a friendly
and helpful style.

Additionally, the group should create a number of regulars interested into
the group being useful within eight months. These regulars should ideally
copy the friendly and helpful style,  distributing load between each other
and setting an example for newbies and regulars-to-be.

Finally, the group should be self-sustaining within twelve months after
inception. That is, there should be an established Uplift path for regulars
showing true Potential to become FAQ maintainers and active contributors to
the group culture. Ideally, after that year there would be little need for
myself to meddle with the groups sociodynamics. Also, the group would then
be ripe for split due to high traffic volume and the groups concept would
then be proven and could be applied to other groups as well.

#### A few simple building blocks

Central to the establishment of a group culture is the ability to remember
past discussions and their results. Without memory there is no past, and
without a past there can be no communal traditions and culture. The
fundamental building blocks of newsgroup Uplift are therefore the creation
of 
"[The Library](http://www.php-faq.de/)" and a process to spread its knowledge
widely.

In the context of a USENET newsgroup, The Library is a frequently asked
questions document, which must be seeded initially over the period of two or
three months with the most needed knowledge.

Ideally, the FAQ is fat. That is, it does not only cover truly frequent
questions, but also provides all background information needed to properly
handle and understande that frequently requested information. The strategy
is to get Clients reading and keep them reading, feeding them not only
solutions to the immediate problems, but also feed them parts of the larger
picture as well as basic USENET traditions and rules.

This is necessary, because a client coming into the newsgroup with a PHP
related problem most of the time has other problems as well, such as a lack
of basic USENET etiquette and a lack in writing or debugging skills,
preventing the Client to state the problem in a correct or efficient way.
One of the first steps in the Uplift process must be to give the Client
speech, that is, to teach Clients essentials such as proper quoting
behaviour, realname policies, writing style, HTML and vCard policies and
similar stuff. Only with such knowledge the Client can integrate into the
USENET society and become a useful netizen.

Of course, a client coming into the newsgroup with an immediate problem
wants to hear solutions to that particular problem and is not interested in
being force fed obscure traditions and customs. In order to overcome this
learning block, the immediate problem of the Client must be solved quickly
and to the point. If such a solution is being delivered in an answer
posting, though, the Client usually is receptive and can be fed one or two
bits of additional knowledge and culture as well. If this information is
being kept in the same document as the answer to the Clients problem as
well, it will be accepted even easier by that Client. Thus, a fat FAQ is a
great help in the Uplift process.

Of course, a vast and fat FAQ is no target to point a client to. The client
has an _immediate_ problem and needs help urgently. Thus a reference to The
Library should always be specific in nature, pointing the the Client to the
properly phrased question, and containing the full URL of the answer. If the
question and the answer do not match the specific question of the Client in
full, it should be accompanied by some additional sentences of explaination,
showing the Client how to modify the Library provided answer in order to be
useful.

On the other hand, it is okay if the answer is not a perfect fit, especially
if the Client has already moved somewhat along the path of Uplift. We want
to create future Patrons assisting us in the Uplift of new Clients and
contributing to the FAQ, and this requires these future Patrons to be able
to work out solutions by themselves.

In de.comp.lang.php, the FAQ is kept at
[http://www.php-faq.de/](http://www.php-faq.de/), and FAQ references often
have the form of

> 1.16. Wie verweise ich auf die
> FAQ?http://www.php-faq.de/q/q-newsgroup-faqreferenz.html

accompanied by some additional lines of explaination. This form of
reference to FAQable questions has been established very early after the
creation of the newsgroup, and has been adopted by almost all contributors
to the group with Patron capabilities.

#### Opening the culture for self-sustenance

The initial FAQ was copyrighted by me. Although that FAQ was available by
CVS, and was written in an open format (LinuxDoc at that time), there was
little interest of potential contributors to add to the FAQ. The initial
problem was that some people tried to take the FAQ's content and wanted to
edit and republish it for their gain, and that I made it very clear that
this was not acceptable by writing large COPYRIGHT notices all over the
text. Potential contributores had no interest to contribute to a text that
was clearly marked as the exclusive property of someone else. On the other
hand I did not want to give text away for uncontrolled republication and
modification.

It took me four months to recognize that problem and to resolve it
satisfactorily. The license of the FAQ was changed at that time, and the
text is now available under the Open Publication License 
([http://www.opencontent.org/openpub/](http://www.opencontent.org/openpub/)),
which was found to balance all interests well enough to become accepted.

Also, a mailing list was created to deliver FAQ commit messages and other
important events and to provide a forum for discussion that is more private
that the newsgroup itself. Thus, maintentance load is distributed between
all interested parties, preventing early burnout.

After the creation of the group, several problems arose which were not
sufficiently covered by the initial charta of the group. Such problems were
for example the handling of posted job offers within the group, or how to
deal with rapidly recurring ontopic questions of little value to regulars
such as "Which provider/editor/operating system can be recommended?".

It was important for the creation of a group culture that these problems
were resolved by a straw poll of the groups users themselves in order to
create a "we-experience". Also, it was important to let the users first
experience the problem themselves before having them vote on it, because
common suffering enhances such "we-experiences". On the other hand, such
resolutions must be found before the problem becomes so pressing that it
inhibits normal operation of the group. And finally, there should not be to
many such straw polls in rapid sucession, in order to keep the audience
interested and in order to keep meta-discussions low.

The straw polls were held at a rate of at most one per month, and the
alternatives were formulated as neutral as necessary for them to be
accepted. Still they were presented from a "Patron" point of view, by subtly
highlighting the possible consequences of this or that decision where
necessary. The outcome of the straw polls was documented in the first
chapter of the FAQ, along with descriptions of acceptable behaviour around
these topics and pointers to alternative or additional ressources.

This works reasonably well: 2 out of 3 atavistic throwbacks are usually
quickly terminated by pointing the Client to the proper FAQ article handling
such topics as provider recommendations, editor comparisions or language
advocacy.

Job postings are usually not handled this way, because they are by nature
hit-and-run events in which a company drops a shower of job offers in a
number of newsgroups without caring about local group culture. Instead these
matters are usually resolved by a mail to their given contact address
quoting the relevant FAQ article.

The article contains enough acid to drive to point home without being
outright unfriendly. In order to save duplicate work and prevent the
offender from being harassed by multiple community members, it is an
emerging tradition to copy such letters to the german-faq mailing list
enabling the contributing regulars to synchronize their activities. It is
also great fun to share the answers, improving the "we-experience" once
more.

We have yet to see second-time offenders.

#### Why does it work?

For Patrons, The Library makes it much easier to create useful answers by
referencing the FAQ than to write an intelligent flame. Once this is
understood by a contributing regular, the default stress reaction shifts
from flaming to writing short and constructive articles containing pointers
to the relevant information. This greatly improves the morale within the
newsgroup, as flaming creates more flaming.

For Clients, reading the provided FAQ reference is easier than to go at it
again in a followup posting. Asking followup questions is more work and has
a higher round-trip-time than simply reading on and learning something. As
long as the FAQ anticipates the next question along the path and provides
stuff that is easily understandable and properly documented, the Client will
not ask again but try to achieve something alone. This enhances the Clients
ability to work independently, Uplifting it further. It also cuts down on
the total number of posts to the group, lightening the load for the
contributors of answers.

Also, FAQ solutions are tried and tested, have proper error handling and are
commented, making them more valuable than on-the-fly creations, thus the
Client will come to prefer FAQ quality answers over newsgroup quality
answers. It will turn to the FAQ immediately next time a problem arises,
becoming somewhat dependent on that information source.

Writing FAQ pointers is a cheap way to gather Patron status for regulars, as
all components are available ready-made and need only deployment and slight
customization. Thus, even some recently Uplifted Client can begin to gather
Patron reputation by becoming a contributor of answers to the group. This
enables older Patrons to move on and perhaps become FAQ committers.

Patrons becoming dependent on the library feel a growing desire to
contribute to The Library as soon as they hits holes multiple times when
writing answers. They feel that their business becomes significantly more
difficult in areas not covered by the FAQ, and start comitting new answers
or even new chapters. Since all articles in the FAQ bear the name of the
Patron who created it, adding to the FAQ is a way to gain status more
permanently than by writing newsgroup articles: Unlike newsgroup answers
which expire quickly, FAQ contributions tend to stay and keep the Patrons
name in the light for a much longer time.

This effectively creates two processes: 

One process takes answers and threads from the newsgroup and compresses them
to reuseable, tested and tried articles. Context-dependent information from
a USENET thread, losely distributed over multiple articles, becomes
context-independent, is peer reviewed and available in the much tighter
format of a FAQ article. This process improves information.

The second process is the process of Uplift, which educates contributors to
the group in USENET etiquette as well as in matters covered by the groups
charta, by turning them from Clients asking questions into Patrons providing
answers or even Senior Patrons contributing to the content of the FAQ. This
process improves people.

#### Dealing with Atavism

USENET is showered with a constant rain of newbies. Usually, big loads of
newbies in a short time lead to group degeneration, spontaneous topic
combustion ("flamewars") and loss of directed discussion activity at group
level. This phenomenon is called 
"[September](http://www.catb.org/jargon/html/S/September-that-never-ended.html)"
because before 1993 the month of September was the time when new students at
the Universities hit the network.

The Uplift process provides means to newsgroup regulars to deal with a
larger number of newbies sucessfully, avoiding burnout and flamewars.
Uplifting converts newbies into useful netizens faster than usual, too, and
uses these fresh converts to deal with even newer newbies if applied
successfully.

Even with an Uplift process in place, a newsgroup may experience occasional
atavistic throws. This is usually the case when a Patron experiences
burnout, and lets himself go publicly. Often this is provoked by a
particularly clueless newbie posting, or an outright flame.

To deal with atavism and have it not ruin the groups climate, it is
important to encourage Patrons to take their grievances to mail. This can be
done by using the FAQ maintenance mailing list, or by encouraging the Patron
to flame a newbie by mail and copy the flame to the FAQ maintenance mailing
list for the enjoyments of the others (and to inform than that this
particular case has been already taken care of). The german FAQ contains a
section titled

> 1.12 Warum bekomme ich Ermahnungsmails, wenn ich Autoren in der Gruppe auf
> Netiquetteverstˆ&#64258;e aufmerksam mache?"Why do I get reminder mails,
> when I remind people publicly of netiquette violations?"

and this one is listed BEFORE

> 1.13 Warum bekomme ich Ermahnungsmails?"Why am I mailed with netiquette
> reminders?"

It is not acceptable for a Patron to display behaviour which cannot be
tolerated in Clients, and besides it does not help ontopic discussion in the
group if meta-discussion swamps the forum.

The full answer to question 1.12 is (translated from German):

> "You are completely right: Some authors in this group violate the
> netiquette as posted to de.newusers.infos, for example by posting without
> a realname, by using invalid reply addresses or by posting HTML or vCards.
> You need not tolerate this. In newsgroups, tone is as important as
> content, though. The regulars of de.comp.lang.php are proud of the
> friendly and helpful tone in their newsgroup. So if you want to remind
> another author to keep to the netiquette, please do this by mail and not
> in public. The very netiquette you are trying to enforce requires this -
> you cannot validly demand conformity with this convention, and at the same
> time violate it yourself without losing credibility. Please: Keep your
> tone friendly in your mail as well. You are easier understood this way,
> and it is more likely that you complete your mission this way. If you
> believe that your article must be posted in public, for example in order
> to forward discussion to another newsgroup, or because the mail address
> given is invalid, or because the author in question has not been
> cooperative in mail: Please keep your article friendly and constructive.
> That is: Answer the question of the offender or offer a solution to his
> problem as good as possible. Only after that remind him about the
> netiquette. If you cannot contribute to the original problem, do not post
> or write mail. You are not alone in this group and you do not need to save
> the world alone. Somebody else who knows the proper answer will write a
> public reply and probably will remind the original author of proper
> behaviour."

This take-it-to-mail policy has been in force since beginning of March 2000,
and has been enforced several times since then between the regulars and by
themselves. Obviously the regulars in this group like the climate and tone
of their group and accept the offered conflict resolution solution as a
viable mode to deal with the problem and with offenders. Flamewars seldom
last for more than a day or two, if they happen at all.

It is important for the users of the newsgroup to learn how to deal with
flames properly, taking them as failed attempts to communicate instead of
insults, and cooly pointing the offender to the relevant ressources to help
him state his problem correctly. The answer to 1.13 translates as follows:

> "Not only in de.comp.lang.php, but in most other German newsgroups you
> will be reminded of proper behaviour in newsgroups, if you post without a
> proper realname, with an invalid return address, send unwanted
> advertisements, post HTML or vCards, or post offtopic on purpose. The
> oldtimers and regulars of USENET did not come up with their rules and
> traditions for nothing. USENET has been in existence for some tens of
> years, and the rules of communication on USENET have been proven in over
> this time. There is an introduction in de.newusers.infos titled 'Why
> should I stick to the rules?' explaining why things are as they are and
> how they came to be. If you want results from posting to de.comp.lang.php,
> that is, if you expect technical help with PHP, you are well advised to
> watch the outer form of your text and honor our traditions."

These two texts are usually sufficient to calm down the offender and the
flaming Patron and to tie them into one or two mail exchanges discussion
their behavior and offering counseling. Having shared the experience and
providing hints to deal with frustration is helpful.

Sometimes productive behaviour emerges from such a mail exchange, making
this counseling rewarding for the person sending the mail. For example the
formerly flaming Patron may become motivated to work on the FAQ, or take up
another project which he believes would help him to compensate his anger.
The publicly visible component of the flamewar is usually silenced
immediately after the mail exchange starts, with sometimes some erroneous
postings by third parties coming in late.

#### Lessons Learned

_It is possible to take control of the content and the traditions of a
USENET newsgroup for an extended amount of time, if the perceived change for
the majority of the regulars is a change for the better._

_The tools for affecting the change are the creation of a recorded tradition
by the creation of a FAQ, making proper and improper behavioral standards
explicit and addressable for reference in a discussion, and a specific
procedure for teaching these standards to newcomers. This specific procedure
involves taking the newcomers problem serious, solving it and pushing
additional corrective information with that answer in a non-offensive and
non-degrading way at the newcomer._
