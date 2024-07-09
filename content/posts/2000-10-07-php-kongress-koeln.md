---
author: isotopp
date: "2000-10-07T09:00:00Z"
feature-img: assets/img/background/schloss.jpg
published: true
title: "PHP Kongress Köln"
tags:
- lang_de
- php
- web 
---

# Day 1

I attended PHP Congress Cologne (05-Oct-2000 to 06-Oct-2000)
together with Ulf Wendel and Jan Kneschke. We arrived in Cologne
the evening before without incident, hit our hotel sometime in
the evening and immediately departed for the `#php.de` (IrcNet)
channel party organized by [subj](http://www.subjective.de). As usual, there was
no proper beer to be had in Cologne (the local brew is based on
dishwater), but the Apfelpfannkuchen was nice. So were the
people, most of which I was able to meet in person for
the first time. People, you are as strange in real life as you
are on the channel!

Next morning found us at the Crowne Plaza hotel, where Björn
Schotte and the Globalpark people were still fixing problems
with Internet access just before the congress was supposed to
start. This should turn out to be a recurring theme during the
entire congress, and is definitely a point to improve next
time.

## PHPdoc

Ulf's lecture was the first one. He presented his
documentation generator [PHPdoc](http://www.PHPdoc.de), which is a large PHP
script largely based on concepts borrowed from JavaDoc. Phpdoc
is able to generate bare bones documentation from many PHP
scripts without any additional information, and can utilize
special comments within the script to generate full
documentation. The output is template driven HTML, with XML
being an interim format. This allows for automated
post-processing and provides unlimited customization of the
documentation.

Because PHPdoc is working without any support from the PHP
interpreter in this version, its capabilities are still
somewhat limited, but it still is far better than anything else
currently available. In my opinion, PHPdoc should become the
standard format for documentation of PEAR and PHPLIB classes,
and work should concentrate on adding parser support for
documentation generation and to improve PHPdoc. PHPdoc is bound
to become a very important tool for large scale PHP
projects.

## OpenTracker

Ulf was followed up by Sebastian Bergmann of the PHP
OpenTracker project. He showed how PHP can be utilized to
capture and visualize click-path information and how this
information can be useful to optimize your site layout and
navigation for usability.

## Fulltext Search

Alexander Aulbach continued with a report on using MySQL and
PHP to create a fast search engine. Working for a newspaper, he
was faced with the challenge to create a searchable fulltext
index for ~170.000 newspaper articles, and found the usual
solutions based on ht://dig and udm-search to limiting for his
project. Using a very unconventional approach to the problem, he
was able to create a workable and mostly efficient fulltext
search using pure MySQL and PHP - tools which are generally
considered as not suitable for such tasks. His fascinating
solution is up for sale, or can be recreated from his slides if
you can spare a man-month or two for development.

## Web Security

My own keynote was supposed to be scheduled for noon, but
because of the technical problems with the internet connection
before it started late. I had to cut down on content in order to
make good for the lost time. Find my slides at 
[Web Security]({{< relref "2000-08-21-web-security.md" >}}).
My talk went well (I had my slides available locally, and did
not need a remote connection), and I was able to make a number of
contacts...

Lunch drove the organization at Crowne Plaza to the limits of
their capacity: Although three different restaurants and
locations within the hotel provided lunch for the 400 people
attending, these people dispersed very unevenly, and some had to
wait for more than 30 minutes to get something to eat.
Nonetheless, the food and the service were excellent, once you
got them.

## PHP in Startups

Just after lunch, Chris Cartus had a talk about the use of
PHP in startups. His talk centered around properties and
shortcomings of PHP as an implementation language and as a
platform and contained quite a bit of critique. It was received
somewhat controversial, which certainly was his intention, but
was in part based on outdated facts—PHP is currently a rapidly
moving target, and six months ago Chris would have been right on
all counts.

Basically, Chris stated that the main strengths of PHP are its
superb rapid prototyping capabilities and its very
smooth learning curve: You can take any useful web designer and
start teaching PHP bit by bit. That designer will be productive
from day one, gradually moving out of the mouse mover camp and
entering the coder league, earning his money at all stages
during this transition. This is very unlike Java, which
generally requires a hard break where one sits down and learns
about programming, design techniques, UML and the like before
being completely useful.

On the other hand, there is little support for high-end web
applications and development to be found in PHP—there is no
application server, load balancing is not part of PHP and can
only be obtained using crude external means such as RR DNS and
local redirects. Also, PHP is lacking in debugging
capabilities and provides little support for large scale
development (options comparable to the &quot;use strict&quot; and &quot;-w&quot;
modes of perl). Its object model is crude and needs more
sophistication and a performance tuneup to be useful on large
scale applications.

To summarize: While PHP provides a road that is wide and
easily traveled at the beginning, this road is not as far-reaching as is the Java path. Chris claimed that further
extension of PHP is necessary to cover these areas.

Chris also claimed that PHP has no Java integration to speak
of and mentioned some other areas where PHP is lacking, in his
opinion. Most of these areas have been worked on during the last
six months, and the situation is improving rapidly. For example,
Johann-Peter Hartmann demonstrated PHP's Java integration
capabilities in his (later) XSLT comparison and found it to be
easily usable, but still unstable under load.

## Hallway track

I missed the next three talks given by Reiner Kukulies
(Communities with PHP), Mario Klaue (Using PHP generated DHTML
to build highly responsive pages) and Matthias Boese ("Using PHP
on SAT-1: Die Fahndungsakte" - a high traffic website for a TV
series). This is exactly the scenario where PHP should not be used
according to Chris Cartus, so there *are* successful
deployments of PHP in high load environments.

Instead, I had some stimulating discussions on web
security, and on possible future extensions of PHP outside the
lecture hall. Those small tables just next to the coffee bar
turned out to be very useful, indeed. Thank you, Thies, for
providing useful input and insight and thank you, Chris Cartus,
for your thought and discussion provoking talk.

## Extending PHP

The day way almost finished with Sascha Schumann's 
"Extending PHP using C" express presentation 
("Hmm, it seems that I really should have some slides. I'll create them while commiting
the latest patches to the session management module here.").
Sascha, you really demonstrated that rapid prototyping can be a
way of life!

Sascha prepared the ground for Jens Ohlig with 
"C++ integration and 3 tier development". Jens talk was about
using `phpswig` to generate glue code to integrate C++ classes as
PHP extensions.

## Afterglow

For me personally, the talks by Chris Cartus and Jens Ohlig
were two most interesting talks of the day - Chris because of
the interesting ideas and the background he provided, and Jens
because of the extremely useful technology demonstration.

Afterglow, the time between the conference talks and the
evening programme, was filled with discussion about software
patents and Sevenval - from the number and type of questions
currently easily the most hated company within the PHP or even
the German Open Source community.

The Evening program was a travel by ship along the River Rhine
on board of the MS Enterprise, a theme ship modeled after a
well-known starship of the same name. The Buffet on board was
excellent, and so was the company :-) Thies and I had our fun
with Sascha, being half as old as either of us two (but twice as
cool). Ah, and the local brew does not taste much better when
you drink it on board of a ship. Memo to self: When you travel
to Cologne, bring your own beer.

# Day 2

## PHP and PDF

The second day started out slowly, with Hartmut Holzgraefe
demonstrating PDF creation using PDFTeX and PHP. He started out
showing the shortcomings and limitations of PHP's PDF interface,
and presented PDFTeX as an alternative way to create good-looking PDF output.
TeX source creation was excruciating with
PHP 3, but using PHP 4 and the new output buffering interface
came just in time to be helpful and greatly simplify the
process. Limitations of his technique are the use of an external
process (the PDFTeX processor) not really suited for use in
batch processing, and the load this generates at the server
machine.

## PHP on Windows

Next in line was Andreas Otto, who introduced the PHP4 build
process under Windows. As I don't do Windows, I missed most of
this talk and had a session concerning the past and future of
`de.comp.lang.php` at
the coffee table on the outside. It seems that a transition of the
FAQ to XML format will be well received and should be done on
short notice. Also, Sascha suggested the day before that an
english translation of the FAQ would be useful, as it is, in his
opinion, far better and more comprehensive that the english
original. Sascha suggested that the english version of the FAQ
should be channeled through the PHP documentation translation
team, producing multinational versions. Both he and I still see
problems resolving the update process, as the FAQ is produced in
german language, and updates and comments may come in english
as well as in german. We probably need a collection and
integration mechanism for that. TODO: Talk to the doc team and
see what they think.

## PHP and IPC

I rejoined the main lecture hall just in time to see Till
Gerken finish his talk about "Interprocess communication in
PHP". Till presented the mechanisms used to create PHPChat,
and showed how shared memory and semaphores can be used to
improve performance in such applications.

## PHP does XSLT

Johann-Peter Hartmann (What a name, what a hairstyle! :-)
followed up with "A comparison of PHP XSLT
processors". His talk was met with great interest, as XSLT
seems to be a hot technology. Johann showed that XSLT still is
bleeding edge, and so is PHP-Java integration. Sablotron came
out as an overall winner in speed and stability with Xalan C++
being a close second and a somewhat more complete implementation
of the standard. Me, I am using Sablotron - Go, Ginger Alliance,
Go!

## Zend

Tobias Ratschiller gave most of his time to Doron Gerstel of
Zend technologies, who was stunned by the support PHP has in
Germany and who presented the future marketing and product
strategy of Zend. It seems that Zend will be rolling out a profiler
and debugger this year, and follow up with the encoder shortly.
Also, a PHP IDE is planned and scheduled for next year.

The presentation was quite interesting, especially in light
of Chris Cartus talk about startup companies and venture
capitalists the day before. It was obvious that Zend, being a
startup on venture capital, needs to show some revenue fast
before entering the next round of funding. Still, Zend seems to
be lacking vision and a roadmap for the future, and the
presentation left me a bit disappointed—perhaps it was the
presentation, which was marketing driven and focusing on
benefits, instead of technology driven, as almost all other talks
on the Congress were.

I would have expected Zend to have learned from their polls
and their experience that people tend to use PHP for
projects larger than it was intended to be used. It would have
been smart for them to provide a strategic roadmap which shows
their intention to meet this demand with the appropriate moves
and improvements (application server, load balancing, stronger
Java integration, revised object model, optional strong typing,
optimizer and compiler making use of this typing for faster
code). Perhaps CC and Zend talking to each would be a good
match?

Also, while there is a strong community of PHP developers, at
least in Germany, it seems that Zend is only very losely tied
into these channels, at least in Germany. There clearly is an
impedance mismatch between the community and the company, and
currently Zend cannot convince the community that it fulfills an
important role for the community, at least not in Germany.

This is very dangerous for both parties involved: PHP cannot
survive without a focused and directed development team,
especially not in the upper area of the market. It is
specifically this market that is of very great importance for
the acceptance of PHP as a mainstream web development tool.

Also, Zend cannot survive without being able to communicate
their role to the community, and in Germany that means
presenting - technology driven - a long term strategy,
scalability, flexibility and extensibility of the product at
management level as well as at developer level.

On the other hand Zend must take care not to catapult itself
out of the PHP community, which is very tightly integrated in
Germany, having a few key websites, soon to be
complemented by a new MySQL newsgroup. While these locations
cover mostly low-end PHP usage, these are the pools where PHP
know-how is being created and the regulars at these locations are the
key drivers of the German PHP scene. Zend marketing currently
does not tap these reservoirs at all—send them to the clue
train, this is a large scale loss of communication
potential.

## World Domination Plans

Tobias followed up with a short note on PHP "world
domination", but time was too short for him to say
much.

## Doing Forms

Next in line was Andre Christ presenting the Abstract
Presentation Layer, a high-level C++ extension of PHP, allowing
easy form creation and validation automation. From the questions
after the presentation and the afterglow talk, this was easily
the most heavily underrated presentation on the congress, as
Andre was presenting an unfinished, but very clean library
design, which has a few, but obvious and easily corrected
shortcomings and much potential. The APL is a LGPL library, and
is a project you should watch, unless you decide to get
involved. Also, keep an eye on twisd AG; these people are
good.

## More World Domination

Unfortunately for the followup speakers, Andre's talk created
the need for me to talk, again at the coffee tables, and so I
missed most of the finish - except for Björn Schotte's legendary
"Björn Schotte World Domination" talk, which
transported hints at his site, [PHP Center](http://www.php-center.de/)
as well as his
QuickCMS product with the subtle gentleness of a Ferenghi
sensing the opportunity to make some bars of gold pressed
Latinum. :-)

All in all two days well spent. The congress served its
purpose very well, being an opportunity to bind some faces to
recurring names, to learn about the state of the art in the PHP
community, and to find out about the future direction PHP and
Zend development must take.

Thank you, Björn, and thank you people at Globalpark, for
organizing the congress and see you next year.
