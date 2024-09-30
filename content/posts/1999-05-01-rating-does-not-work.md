---
author: isotopp
date: "1999-05-02T09:00:00Z"
feature-img: assets/img/background/rijksmuseum.jpg
title: "Rating does not work"
tags:
- lang_de
- publication
- internet
- jugendschutz
---

**Version 1.3 (Revised 29-Sep-1999, Updates from Seth Finkelstein)**

# Rating does not work

#### by Kristian and Marit Köhntopp

Content rating models such as PICS have been proposed as a
solution to the problem of unwanted, harmful or prohibited
content on the Internet. This document contains a number of
Theses which support the claim that any Internet Content Rating
and Selection (ICR&S) scheme including PICS cannot work as
advertised.

To our knowledge, most of the problems and objections here have
not been addressed by PICS or any other ICR&S scheme.


## Identifying the parties involved

This section tries to identify the parties involved in the
process of running and rating the web and their roles (see below
to understand why we concentrate on the web). In small
installations, a single person may impersonate multiple roles.

### Server side roles

The *content provider* is the role which is responsible for all
content of a document. Often the content provider is the creator
of a document, but on the Internet it is common that a content
provider only provides means to create content, and does not
actually create the content on a site. Examples are discussion
boards, search engines, live video feeds, and similar
installations. Depending on the size of this content, it is
entirely possible that the content provider does not have direct
knowledge of all content on a site and that much content on a
site is not reviewed nor endorsed by a content provider.

The *presence provider* or *web hoster* provides the means to
serve this content to the Internet by running the machines, the
server software, and maintaining a network connection.

### Recipient side roles

An *access provider* runs the systems and network connections
for the recipient of content. For small office and home use,
this is currently often a dial-up service, a proxy server, and
similar hard- and software.

The *recipient* is either a person to be protected against
harmful content, or an adult, which still should be able to
access harmful, but not prohibited, content. The recipient's hard-
and software is maintained by *system services* which is a
separate department in a school or library situation, in an
Internet Cafe, or within a company. The recipient's system may be
a single system or a network of systems with proxy servers and
intranet servers.

### Internet Content Rating and Selection (ICR&S) roles

*Developers of rating systems* define the dimensions of a rating
system and create rules how to apply values along these
dimensions to content. They promote their rating systems so that
they become popular and are widely used.

A *rating service* will apply the rating system and the rules
that come with it to create ratings. These ratings, an
identifier for the rated content, a date, an identifier for the
rating source, and additional information (i.e. a checksum
against the rated content and a digital signature) are collected
to form a content label.

*Content filter vendors* create software which can regulate
access to content, depending on local settings (filtering rules)
and content labels.

*Content filter control* is often exercised by the party who
controls a machine, that is, the adult party in a household, 
the dean of a school, the directorate of a library, and so on.
These filter settings are then *deployed*, often by system
services mentioned above, sometimes by an access provider
located upstream.

*Attackers* may be content providers, recipients, or other
parties who want to communicate outside of the control of a
filtering system.

### Methods for content selection

#### Principle of Operation

The basic idea behind Internet Content Rating and Selection is
to attach a kind of machine-readable description, called a
Content Label, to all Internet Content. The Content Label
contains a set of ratings which make up a formal description of
the rated content in a formally specified system of ratings.
Finally, the recipient has to have a filtering mechanism before
or on the recipients machine which allows or intercepts
reception and display of requested content depending on the
Content Label and some local configuration.

#### Taxonomy of Rating Systems by Source of Rating

The Content Labels may be provided by different parties. In
Third Party Rating, a party that is neither the recipient nor the
sender creates content labels and distributes them via a Label
Bureau. Third Party Rating requires a method to uniquely
identify content components, and Third Party Rating cannot be
finer grained than this identification system. Currently, all
identification systems are URL-based which implies that all
Content Labels refer to either URLs or coarser grained objects
(such as subtrees of a web server or an entire site).

In Second Party Rating, the recipient provides ratings and
shares them with other recipients. This is sometimes referred to
as a Community Rating process. Since the sharing of ratings
again involves a Label Bureau, for the purpose of this
discussion Third Party Rating and Second Party Rating can be
treated alike.

First Party Rating is different because here the sender
provides a Content Label with the content itself. Usually, this
label is embedded into the content or sent with the content. A
Label Bureau is not needed in this context.

#### Taxonomy of selection mechanisms by point of interception

The selection process at the recipients end can either be
implemented directly on the machine of the recipient, or it can
be part of a proxy solution upstream of the recipients computer.
In the latter scenario, the selection process will not happen on
a machine controlled by the recipient and it is much more
difficult to manipulate by the recipient. A proxy-based
selection requires that the recipient is forced to use this
particular proxy to be able to access content at all (otherwise
the recipient could elect not to use a proxy at all or to use a
different proxy) and that the content can be identified and read
by the proxy.

## Theses

### Internet Content Rating and Selection applies only to the Web

Internet Content Rating and Selection does apply properly only
to the web, because of the little degree of interactivity and
the large size of the communicated objects in the web. More
interactive services or services with smaller objects are 
less likely to adopt such a system for content control with
success. For example, USENET newsgroups are highly interactive
and very fast communication channels with only little structure.
The focus on discussion and contents, and the style of such
discussions may change very quickly. 

USENET articles are authored on the fly. Often they contain no
keywords, subject lines of little use, or are inappropriately
addressed. It is very unlikely that authors of USENET articles
will take the time required to do proper First Party Rating for
their articles, even if current USENET access programs offered
such a feature.

Chatrooms and the Internet Relay Chat consist of even faster
communication and no structure at all. IRC channels are often
created on the fly and, unlike USENET, communication on IRC is not
stored but only passed through by the servers. Also, the basic
unit of communication in IRC is a single line of text which is
much too small to rate properly. An IRC channel at any point in
time is a very complex web of rapidly changing and overlapping
individual and nonindividual communications that make up the
overall tone and content of the channel.

Also, the public discussions in USENET newsgroups or IRC
channels are only the publicly visible part of a much larger
communication process which involves private communication by
mailing lists, private e-mail, server based message
communication, and direct client-client communication. Often the
public communication channel is only used to meet other persons
with similar interests, and then a more secluded communication
channel is established.

Because of these properties of the more interactive
communication mechanisms, Internet Content Rating and Selection
will be ineffective in these type of media.

### Labeling content that is not harmful nor prohibited is a requirement but cannot be enforced

The ultimate goal of Internet Content Rating and Selection is to
make harmful content inaccessible to minors and make prohibited
content inaccessible to all recipients on the Internet.
Basically, it would be sufficient to label all harmful and
prohibited content accordingly, so that it can be recognized and
intercepted. For First Party Rating, this requires the
cooperation of the provider of this content, so that the Label is
being delivered with the content itself. For Third Party Rating,
cooperation of the content provider would simplify the process
enormously, for example by providing stable identifiers for the
content or by organizing the content in a way that makes it
easier accessible to quick and accurate rating.

It can be safely assumed that this kind of cooperation will not
be available in many cases and that it specifically will not be
available in the most severe cases where the content provider
places content on the web with a malign purpose.

Thus, it is insufficient to block pages that are rated as
containing harmful or prohibited content. Instead, all unrated
pages must be blocked as well, so that the pages of
non-cooperating content providers will be made inaccessible. In
this case, the rating of harmful and prohibited content becomes a
moot point because such content will be blocked automatically.
The Internet as viewed from behind a filter will be immediately
clean in such a scenario because it will initially contain no
content at all. Clearly, this is not very attractive and most of
the targeted audience for content filtering services will not
tolerate such filters if large portions of harmless or valuable
content will be made unavailable to them by the content filter.

For a Content Rating Solution, it becomes a requirement to
provide Content Labels for non-objectionable content, so that at
least some pages will be available to those persons behind the
selection filter. Thus, all burden and cost of content rating,
labelling, and label distribution is placed on the providers of
perfectly legal, and in most cases, valueable content.

This situation is not different from, for example, the movie and
video industry where a film without a rating is automatically
rated as not suitable for minors (at least this is the case e.g.
in Germany and the United States). Unlike the movie industry,
many content providers have little or no incentive to have their
content rated because in many cases they do not sell content or
do not cater specifically to a younger audience. Specifically,
we can expect the large commercial websites positioned towards a
younger audience to provide content labels on a voluntary basis,
while most private content and content not specifically geared
towards a young audience will not have labels at all.

Consequently, it may be necessary to enforce the provision of
labels with content to make a sufficiently large portion of the
Internet available to minors. Some content providers will
probably try to evade such a requirement by providing a "safe"
default rating, such as "harmful content, not suitable for
minors", because they do not want to do the work to properly
evaluate and individually label their content. Others will do
this because they are insecure about the correct rating for
their content, and will rate their content more harmful as it
actually is, just to be legally safe. For a requirement to
provide labels to be effective, it may be necessary to treat the
provision of a too high label just like the provision as a label
that is too low.

This turns the situation perfectly upside down: To protect
against harmful and prohibited content, all work and all legal
liability is at the side of the well-behaved members of the
community, while it is technically completely unnecessary for
the providers of harmful content to do anything.

In some countries, rating your own content cannot be legally
enforced (see below).

### Establishing a metric invites a dysfunction

A rating system for content is essentially a metric. The metric
may have one ("suitable for age x") or multiple dimensions
("contains sex x1, nudidity x2, violence x3 and language x4"),
and within one dimension it may be non-ordered ("contains any of
the following: smoking, gambling, drug abuse, violence as a
method of conflict resolution"), ordered ("a violence rating of
3 means that there is more violence in a particular content than
in a content with rating 2"), with discreet or continous values.

A rating system is a cultural code, too, because with the
dimensions and values provided with any such metric comes a
decription on how to interpret and apply them. As a cultural
code, a rating system cannot be objective or valid outside a
specific culture. Specifying the dimensions of the rating
system, for example, defines which issues can be addressed by a
particular rating system. Issues and values outside of the
dimensions of the rating system cannot be addressed, and are
therefore inaccessible to reflective discussion within the space
of the rating system. For the purpose of the rating system, such
issues and values essentially do not exist.

Values within the dimensions of the rating systems can be used
to define proximity relationship if these values are ordered.
Many people tend to think of content that is in close proximity
as being similar, being of similar value, or promoting similar
values. Some content providers insist that their content is not
to be rated with some content rating systems because rating them
with that particular system would place them into the proximity
of other content they do not like, and with which they do not
want to be lumped together [1][2]. For example, both hardcore
pornographic bondage content and a documentation about torture
methods in the holocaust would receive very similar content
ratings within the RSACi rating system. The RSACi system is too
coarse and has no appropriate dimensions to differentiate
between these two types of content. More complex rating systems
raise ease-of-use issues in First Party Rating situations,
though. Also, more context sensitive rating systems raise other
issues, too (see below).

Establishing a metric in a social context and granting rewards
under this metric tends to create dysfunctional social systems.
For example, measuring the efficiency of programmers by
measuring the lines of code produced by them tends to work in
favour of code that has been produced by cutting and pasting
large segments of code. Such code is generally large,
ineffective, and expensive to maintain. Thus, while the metric
provides useful information when used short-term, it tends to
work destructively when used for longer periods of time (Tom
DeMarco, "Why does software cost so much?", Essay 2).
Essentially, degradation begins when the metric is used for a
period long enough to allow for feedback loops.

A classic dysfunctional metric that can be observed on the web
is rating the efficiency of a banner ad on a web page by
counting hits to that banner ad. Using this metric for a longer
time tends to encourage people to put content on their pages
that creates page impressions and to load many banner ads on
such pages. The result is your average free porn page. It also
encourages spamming search engines and the network with ads for
a particular page to increase page impressions. The ultimate
dysfunctional perversion is to load the page with JavaScript
code that opens further pages with banner ads when the user
tries to leave or close the page. While the banner ads are not
recognized by the user, at best, and create a negative image for
the product advertised, at worst, such pages do generate lots of
hits on a counter and are therefore favoured by the metric.

Because cultural and moral values cannot be expressed and
measured directly like volts and ohms, any such metric will show
dysfunctional behaviour and finally invalidate itself when used
for a longer time. Obvious examples are things like exempting
news sites from the requirement to rate content to relieve them
from the burden to provide ratings for rapidly changing pages -
this will provoke providers of content that rates bad under any
given rating system to present their content in the format of a
news site to get the bonus of exemption. Similarly, exempting
web discussion forums from a requirement to provide ratings will
make badly rated sites to adapt and to chose a forum-like
format.

Because of the inability to address cultural or moral values
objectively and outside of the context of a particular culture
or moral system, it would be only logical and very tempting to
create context sensitive rating systems. Context sensitivity
here goes two ways: it may rate a specific content component
within the presentation context, and it may rate specific content
within a specific cultural context. 

For example, singular pornographic images may rate bad in a
certain system, but a photomosaic(tm) of girlie-power icon Lara
Croft consisting of lots of such images may rate good within the
same system because of artistic value and the message promoted
by this artwork. So while the individual photo may still rate
bad, in this particular context of presentation it will rate
good. Also, a photo of James Dean leaning against his car and
smoking a cigarette may rate good in some cultural contexts by
showing a celebrity in a pop-art context, and bad in others as
promoting environmentally bad modes of transport and nicotine
drug abuse, depending on the priority of values of the culture
perceiving the image. These priorities may change within the
same culture or even the same recipient, depending on fashion or
even personal mood.

What is more, only the process of filtering content which may
appear as rating bad in a given context may actually create
objectionable content in another context. For example, by
suppressing all images which rate bad in one context there may
be created a pattern that conveys a message of objectionable
content [3].

So while context specific labelling is seductive as a way out of
the dysfunctionality problem, it is also error prone,
unenforceable (Would you please try to rate your web pages
within the cultural context of the Amish People, the values of
the current Nipponese, Spanish and Scandinavic societies?) and
favouring one specific cultural context is of course an act of
culture imperialism. It is also a value rating ("The context
rating on your web page/for our web page in your rating service
implies that you have authority to decide what
Christian/Scientologian/Buddhist/... values are and that our
page is bad according to what you assert these values are.") with all
problems that come with such ratings, including a ton of
liability issues.

### Translating from one metric into another does not work

Different metrics have different underlying cultural and moral
value systems and different assumptions for judgement. Unlike
algebraic spaces, the spaces created by such metrics cannot be
mapped onto each other without loss (sometimes they cannot be
mapped at all). Certain dimensions may not exist in the target
metric and must be emulated. For example, it is impossible to
translate the one-dimensional Video Standards Council metric for
video films ("general viewing", "PG", "R", ...) into the RSACi
(integer numbers between 0 and 4 in each of the categories of
Sex, Nudidity, Violence, and Language), even though the target
systems seems to be more expressive, having more dimensions and
values.

Some proposals offer functionality that can be used to bundle
presets in different rating systems into a single profile. For
example, the PICSRules extension to the PICS system allows a
user to define a single profile that contains an arbitrary
number of selective criteria applied to different PICS compliant
content ratings systems.

A user of such a PICSRule may be able to view content that rates
this-or-that under SafeSurf ratings or such-and-such under RSACi
ratings. Using such a system may create the impression that the
this-or-that SafeSurf rating and the such-and-such RSACi rating
are equivalent and that it is therefore possible to map one
system onto the other. This is a thouroughly false impression.

What does work (in PICSRules) is to bundle arbitrary selective
preferences into a profile, but this profile is in general (and
probably in practice in most cases) not consistent or
well-defined. Consider content that has been rated under two
different rating systems and a majority of reviewers agreed in
both cases that these ratings are correctly applied to this
particular content. Assume further a recipient that is asked to
define a filtering profile for his or her child in both of the
rating systems reflecting the personal cultural values that this
child should be able to expose itself to. Unless the page has
a marginal rating (i.e. totally harmless or totally
unacceptable), it will be common that the page will be rated
accessible under one rating system, but inaccessible under the
other, i.e. the ratings do not functionally map onto each other
because of the different implied cultural values within the
metric itself.

### E-commerce and ICR&S are natural adversaries

The introduction of the Internet marks the ultimative shortening
of the communication pipeline, completely industrializing the
process of communication. Historically, the number of people and
institutions involved in the production and reproduction of a
specific publication has continually decreased. While many
people had to copy each page of a book manually in medival
times, the introduction of the printing press has dramatically
simplified the process. The advent of DTP technology has further
eliminated persons and institutions from this process by cutting
out the typographer, the layouter, and the editor. Xerox
technology has cut out printers for small editions.

On the Internet, all persons have been cut out except for the
sender and the recipient. Production, reproduction and
distribution of content are automated or controlled by either
party. In many cases, content location has been automated, too,
by using search engines, portal sites, web rings, or bookmark
lists. In some cases, even content processing has been automated
where automatic translation services, summary generator services,
or XML postprocessing are already deployed, thus limiting the
personal involvement of the receiver as well. Also, in cases
where content is being produced automatically, such as in
catalog systems, database driven web shops, or in community
content systems like slashdot.org, the involvement of the sender
in content creation is limited, too.

This does not mean that the absolute number of people involved
in the creating or processing of content has decreased. In
fact, there are many people needed to keep the Internet running
and to update web content. But these people are no longer
involved in a single specific project (working as craftsmen),
instead they keep running a generalized infrastructure which is
used to transport and produce many, many different works (they
are working as industrial workers).

E-commerce directly benefits from this, shortening supply and
retail chains to a length of 1, or where processing is
completely automated, even to a length of 0. E-commerce requires
that concealed, tamperproof 1:1 communication is possible, i.e.
that the infrastructure can be used to transport certain
transactional data, but without the ability to gain knowledge of
the actual transactional content, and without the ability to
change that content.

This is essentially the opposite of the requirements for ICR&S,
because ICR&S is all about gaining knowledge about the
transported content and from case to case tampering with it
(i.e. replacing the original content with a "this content is
inaccessible" message). You cannot build secure e-commerce on
any network that is capable of ICR&S and you cannot build
functioning ICR&S on any network that provides secure e-commerce
services - see below.

### Proxy-based ICR&S cannot work in an E-commerce enabled environment

In an installation where E-commerce is possible, it is
impossible to successfully deploy proxy-based ICR&S, because at
any time harmful or prohibited content can arrive in the form of
E-commerce transactions, i.e. serving porn pages from an SSL
server. The proxy cannot detect labels within such a connection
because the entire connection is a military-grade encrypted,
digitally signed, tamperproof connection pipe from within the
browser program into the remote web server. Improvements in
E-commerce, i.e. the wide deployment of S/WAN, IPsec and other
services, will only worsen this situation.

### Recipient-based ICR&S can only work in a cooperative setting

Because most current recipient platforms have no (Win 95, Win 98)
or insufficient (Windows NT) local security, and because the
recipient platform is generally under physical control of the
recipient, there is essentially no way to keep the recipient
from tampering with the installation of the selection
mechanism. 

Most local content filters can be easily deactivated by setting
a few registry keys, rewriting a line in an *.ini file, or by
copying some original operating system files that have been
replaced by the filter back into the system. The process only
has to be reenginieered once and can then be automated,
requiring no expertise at all from the user of such an automated
attack tool.

### Third Party Rating cannot be based on URLs

All widely deployed systems for ICR&S are currently using URLs
to identify content and to tie their ratings to such content.
This approach is basically broken because URLs do not map to
content, not even in the case of static content.

For static pages, current webservers offer a lot of facilities
to negotiate the actual content which is being served in response
to a specific URL. In particular, serving language specific
content is very popular. For example, the homepages of
multinational projects (like the Debian Linux project,
<a href="http://www.debian.org">http://www.debian.org</a>) are negotiated based on the language
preferences that were expressed with a HTTP request. Also, many
pages serve different content, depending on the IP-address or
domain the request originated from or customize their content
depending on the current time [4].

The problem worsens when it comes to dynamically generated
pages, where the actual webpage which the client receives never
exists on the server, but is created just as it is requested.
The contents of such a page may change from one request to the
next, even if all other parameters are identical. The server may
take any parameters into account when creating the page,
including internal state (memory of previous requests). Because
internal state is kept on the server only, it is impossible to
fully describe all request parameters needed to recreate a
specific content without thorough knowledge of the application
running on that particular server.

But even if we have perfectly static, non-negotiated content,
URLs are inadequate to address content. URLs describe storage
display objects such as images and HTML pages, but content can
be smaller or larger than such pages. 

For example, the start page of any portal, news site or
discussion forum contains many small, unrelated articles which
are presented in overview form. Each individual article is a
semantic unit with different properties regarding a rating
system, but with URLs we can only address the whole page and
assign a rating to the entire page. 

Conversely, a page or a site may be pieced together from
individual documents which form a greater semantic unit that
deserves a certain rating only when viewed as a whole. This may
be true, for example, for an AIDS information site or a holocaust
memorial site which may contain texts and images that deserve a
very different rating when taken out of their original context.

HTML provides no mechanism to address subentities of a page or
to address pages collectively. Some extentions to the XML
specification will slightly improve this situation.

### Third Party Rating cannot keep up

Third Party Rating is based on the assumption that a single
database can list ratings for external pages, so that a
recipient with an enabled filter can cover a large enough
portion of the Internet for the net to become useful. Search
engines work under a similar assumption, only they can
automatically process and store pages, whereas proper content
rating, being a process that involves moral and cultural
evaluation and decision making, requires manual intervention.
But a recent survey of search engines found that they cover only
a small percentage of the web, ranging from 10% to 35% of all
pages [5]. The survey also observed a strong growth in the
general size of the web.

The problem is worsened for both ICR&S systems and search
engines because there is no mechanism for web pages to notify
indexing and rating services of a change. Web sites in general
do not know which other services keep pointers to them and need
to be notified of updates. Also, there is no mechanism to bind
content identities to certain versions of that content, i.e.
there is no way to work a modification date and/or a content
checksum into a URL which designates certain content.

Third Party Rating is also impossible for content that is
available only after passing a password protection (closed user
groups, [5] talks about a "publicly indexable Web"). Some closed
user groups are not so closed after all, though: With a simple
registration, the protected area opens up. In such cases, the
password protection essentially keeps all automated content
processors and some casual browsers outside.

### Third Party Rating creates privacy issues

Third Party Rating raises the issue of label distribution
without cooperation of the content provider, leading directly to
the creation of Label Bureaus which can distribute labels for
any content, independently from the distribution of the original
content. Connection between the content which has been rated and
the label is being made via some content identifier, currently
usually URLs. Currently, in some ICR&S systems such as PICS,
there are simple provisions to test if the content that has been
rated and the content that is actually served are still
identical. Such a test may be a check for the creation date of
the content or the distribution of a MD5 checksum for the
content with the label. Usually, these provisions are optional
and in many existing implementations they are not being used,
leaving the system without a check for label validity (This
should really be another headline, "Current implementations
generally suck").

To get labels from a Label Bureau, the client system has to ask
the Label Bureau each time a piece of content is being
requested. Because it can be expected that the Label Bureaus
provides its services for money, we can assume that each of
these requests is identified and authenticated, so that the Label
Bureau can charge for its services. Label Bureaus will therefore
automatically get large and detailed trails of all requests a
certain user creates while surfing the web, creating a large
user profile of (identity, time, URL) triples.

### Third Party Rating has no standard complaints procedure

In Third Pary Rating, some group essentially applies a set of
ratings to web content which directly influences the reach this
content will have. Current implementations, such as PICS
compliant systems, define how such a rating may be applied to web
pages technically, but they define no standard procedures for
rating services and labelling bureaus at all.

In current implementations, there is no standard procedure with
which a content provider is being notified that content has been
rated or on which grounds these ratings have been established.
In fact, some (usually propietary, non-PICS) rating services do
not expose their rating criteria for public inspection or even
encrypt their ratings in trying to hide which services they
disapprove of [6]. These services often argue that this
procedure is necessary so that their rating service cannot be
inverted, i.e. turned into a search engine for objectionable
content. Decryption of such rating files invariably showed
questionable or overly broad ratings, though. For example, in
such rating files it is common to find blocking entries for
websites that are critic of ICR&S or of this particular rating
service. Also, there are often very vague and general blocking
entries to be found, for example wildcard blocks for anything
that has the letters "xxx" or "sex" in an URL [7].

Even if a content provider is being notfied that some content
has been rated, there is no standard complaints procedure with
which a content provider can go against a rating that he feels
to be inadequate. Also, the whole rating process is
intransparent and inaccessible to revision: there are no
standard provisions that enable any involved party to detect why
false ratings have been created: Was it a true false rating, a
storage problem, a transmission problem, or a misconfiguration?
On the other hand, false filtering can have substantial
financial impact or can be equivalent to libel.


### First Party Rating cannot be enforced

In the United States, certain First Amendment rights allow a
content provider to not rate own content. Similar rights
exist in other legislations.

But blocking unrated content unconditionally is open to
unexplored civil damages issues.

### First Party Rating does not scale down the problem enough

First Party Rating is basically a way to scale down the problem
of Third Party Rating by one or two orders of magnitude.

Third Party Rating cannot keep up with the change of the web
because of the sheer number of pages and because there is no way
for content providers to communicate changes to Third Parties
(see above).

First Party Rating puts the burden of rating content onto the
content providers themselves which is good because it will
automatically solve the problem of communicating changes. First
Party Ratings must be controlled and validated, though, because
a First Party will rate with a bias to promote own interests.

Thus, First Party Rating can be viewed as a mechanism to scale
down the rating problem. Instead of n pages of content that have
to be rated, a supervising authority now has the problem of
controlling the correctness of ratings provided by m rating
providers. We can only guess the relation of n:m, but we assume
it to be in the range of approximately 100. m would still be a
multi-million number.

### Labels need to be tamperproof and tamperproof labels are expensive

Labels need to be tamperproof for two reasons. The first is
LabelWasher, an imaginary sister program to WebWasher [8].
While WebWasher, JunkBuster and similar programs filter content
to remove banner ad pages and malicious JavaScript code for
advertisement free surfing, replacing the removed content with
harmless dummy content, LabelWasher would do the same with
content labels. That is, LabelWasher would remove content labels
from incoming content and replace these labels with fake standard
labels which rate this content as harmless.

The second reason for tamperproof, digitally signed labels is
that the central authority controlling all First Party Raters
has to have an instrument to put pressure on First Parties that
do not rate according to the rating guidelines. The central
authority would revoke the certificate needed to generate
digitally signed labels from such parties, rendering all labels
generated by them invalid.

Generating and administering a multi-million number of digital
signatures is expensive, even if such signatures are low
security (unfit to sign monetary transactions). 
Someone has to provide a database of all certificates
issued, to verify identities of applications so that banned
First Parties cannot apply again for a new certificate, and to
perform all other administrative duties that come with running a
certificate authority. Even if the cost for an individual
certificate can be kept low, the other factor in the equation is
still a multi-million number.a

### Wildcard labels cannot be checksummed

A content checksum always applies to a distinct piece of
content. A wildcard label such as "all content below
http://www.site.de/*" applies to an arbitrary number of pages
with arbitrary content below a certain base URL. There is no way
to calculate a checksum on such content, greatly diminishing the
value of a tamperproof label: Without checksums and timestamps,
it is impossible to determine which specific content the
label was applied to.

### Content rating cannot keep up with dynamic content creation

Dynamic content creation just gets faster and is often a
parallel process. Examples for parallel content creation are
discussion forum sites such as Slashdot
(http://slashdot.org), news sites such as CNN or Reuters, or
catalogue and bidding systems such as eBay. Examples for fast
content creation are the many live feeds for multimedia data
into the Internet, such as live cameras (http://jennicam.org)
and live audio feeds.

It is impossible for these sites to rate their content, even
with a general rating that applies to the whole site, because
the content on the sites changes much faster than even First
Party Raters can react and because in this case the First Party
sometimes does not even have full control over the content on
their own site.

On the other hand, exemption from rating for such sites will
quickly generate dysfunctional behaviour and it will also
violate the principle of equal treatment.

### Dynamically creating content labels is expensive in current implementations

The Multipurpose Internet Media Enhancements (MIME) standard
goes at great length to allow single pass implementation for
reading and writing content. This is necessary so that dynamic
content generators can read and write multimedia files, which
are often very large, without buffering. 

Current implementations of ICR&S systems ignore this
requirement. They require content labels to be sent /before/ the
actual content within the HTTP header, or to be part of the HTML
document header. If the content label has to include a content
checksum and a digital signature or even if it is just being
generated dynamically, the label can only be generated after the
actual content has been written. Content generation now becomes
a two pass process, in which the content generator first writes
out the actual content, creating the content checksum and the
digital signature, and then begins sending content label and
checksum first, then the actual content.

Buffer sizes for a busy site can easily become gigantic. For
example, the Slashdot site generates much content dynamically at
request time. A Slashdot page can easily be as large as 200 KB,
depending on the number of discussion entries on such a page.
Assuming ISDN transfer speeds, sending such a page consumes
approximately 25 seconds. Slashdot can easily have 100 to 200
requests per second, or 2500 to 5000 simultaneous connections.
Simple multiplication shows that this will consume between 500
and 1000 MB of buffer space in the form of either RAM or
harddisk bandwith (the problem with disk buffers is often not
space, but read/write capacity). For Slashdot, dynamic content
with digitally signed content labels translates easily into
twice the hardware it has now.

Streaming media is potentially infinite in length, so
checksumming becomes a much more complicated process because
checksums can only be calculated for chunks of data and must be
embedded into a multimedia stream. This requires that the
multimedia format used anticipates the need for such a feature
or must be redefined (i.e. existing software must be rewritten).
Another problem occurs with compound content in which some
components are optional. Conventional checksums don't work in
this situation.

Finally, sending Content Labels after the content is not a good
solution performancewise, either: It increases latency on the
client side (that is, the PICS designers put the label before
the content for a reason). When a client downloads content from
the web, it has to decide whether to display the content or not.
The client can only decide this after it has seen the label for
that content. If sending the label is being delayed until after
the actual content has been sent, building the display will
substantially slow down because the client has to hold back
content until it has seen the label for it. Incremental building
of a display, as it is customary in current browsers, is out of
the question in such cases. Besides, it will be frustrating and
expensive for users if their client downloads a large file, only
to decide to throw it away after the download has been completed
due to the label for that content.

### ICR&S systems may make error diagnosis more complicated and will decrease performance

The filtering component of an ICR&S system will most definitely
add more components to an already overly complex platform.
Adding such a filtering component will make debugging more
complicated, even more so if the filtering component is designed
to operate in stealth mode. In such cases it will become very
difficult for support services to determine if a user
encountered a true error or if a filtering component intercepted
a download. 

In the case of third party rating, the label bureau is a single
point of failure: without access to the label bureau, no access
to the network will be granted. The label bureau may also become
a performance bottleneck.

Design changes at the local platform are necessary to enable
mixed use (filtering and non-filtering) of that platform. For
example, private web caches have to be redesigned. All current
browsers have such caches and they are generally accessible via
the filesystem with typically no access control. As a result, it
is currently possible for somebody to access information
directly in the web cache, which would not be available via a
web browser due to it's content label. Also, to associate
certain access rights with certain users, it is necessary to
identify that user. That is, user authentication (a login prompt)
becomes mandatory on systems where ICR&S is being deployed.


### False application

Problems exist at the filtering end of an ICR&S system, too. For
example, on systems that see mixed use by minors and adults, it
is highly probable that the adult user will not see indicators
that an ICR&S system is active, and will get only limited access
to web ressources. Alternatively, that person may perhaps see
indicators showing that access is limited but is unable to turn
the filtering system off because the password is not available
to that person, or because the system is to difficult to figure
out for that particular person.

In many jurisdictions (e.g. in Germany) making use of a
constitutional right so difficult that persons will no longer
make use of this particular right is equivalent to illegally
limiting that right. This implies that the filtering component
of an ICR&S system must clearly signal its presence to the user
and must clearly advertise instructions on how it can be turned
off.

Also, ICR&S that are difficult to turn off are unlikely to be
accepted by users on systems that see mixed use. Things that
become inconvenient are simply deinstalled.

### False positives destroy trust in ICR&S and in the Internet

For an ICR&S system to be effective and trustworthy, it has to
give access to a large number of pages, and it has to have a
very low number of false positives. That is, it must not block
pages which are essentially harmless due to wildcard labels to
falsely applied labels. This implies that a large number of
ratings must be created, and that these ratings should rather be
too low than too high. It is highly unlikely (at least it seems so
to the author) that any of this will be the case in the current
hysteria and with the current legal situation.

A high number of false positives will not only create the
impression of an unreliable and untrustworthy ICR&S system, but
it will also undermine trust into the Internet as a reliable
platform for communication of political ideas and social
processes. If ICR&S systems are being publicly perceived
primarily as a tool to leverage political or commerical
interests, their value as a tool for the protection of minors is
gone. This implies that ICR&S systems must have some mechanism
to defend themselves against such an attack.


## If we deploy now anyway, what do we get?

Summarizing the problems mentioned above inherent to ICR&S in
general, and to current implementations such as PICS compliant
add-ons to browsers, we can say that we cannot safely deploy an
ICR&S systems on a wide scale and get anything remotely
resembling protection of minors. Apart from technical issues,
which are surprisingly hard to solve for a problem that seems
to be trivial when approached first time, there are even more
legal and management issues to solve before ICR&S systems can be
deployed successfully. Most of these problems have not yet been
tackled, some even have been left out deliberately up to now. Even
if all the issues mentioned in this paper had been addressed
by some system, the values of such a system will be
questionable: It certainly is possible to deploy ICR&S systems
which filter /something/ for /some/ people, but it highly
unlikely that these systems will be effective, that is, that
they filter /most things/ /correctly/ for /most people/.


[1]:
: <a href="http://www.msen.com/~weinberg/rating.htm">http://www.msen.com/~weinberg/rating.htm</a>, "Rating the
    Internet":

    'Jonathan Wallace, thus, in an article called "Why I Will
    Not Rate My Site" asks how he is to rate "An Auschwitz
    Alphabet", his powerful and deeply chilling work of
    reportage on the Holocaust. The work contains descriptions
    of violence done to camp inmates' sexual organs. A
    self-rating system, Wallace fears, would likely force him to
    choose between the unsatisfactory alternatives of labeling
    his work as suitable for all ages, on the one hand, or
    "lump[ing it] together with the Hot Nude Woman page" on the
    other. It seems to me that at least some of the rating
    services problems' in assigning ratings to individual
    documents are inherent. It is the nature of the process that
    no ratings can classify documents in a perfectly
    satisfactory manner, and this theoretical inadequacy has
    important real-world consequences.'

[2]:
: <a href="http://www.dcia.com/cyberbur.html">http://www.dcia.com/cyberbur.html</a>, "Fahrenheit 451.2: Is
    Cyberspace Burning?":

    'Kiyoshi Kuromiya, founder and sole operator of Critical
    Path Aids Project, has a web site that includes safer sex
    information written in street language with explicit
    diagrams, in order to reach the widest possible audience. 
    Kuromiya doesn't want to apply the rating "crude" or
    "explicit" to his speech, but if he doesn't, his site will
    be blocked as an unrated site. If he does rate, his speech
    will be lumped in with "pornography" and blocked from view. 
    Under either choice, Kuromiya has been effectively blocked
    from reaching a large portion of his intended audience ­
    teenage Internet users ­ as well as adults. [ ... ] Kuromiya
    could distribute the same material in print form on any
    street corner or in any bookstore without worrying about
    having to rate it. In fact, a number of Supreme Court cases
    have established that the First Amendment does not allow
    government to compel speakers to say something they don't
    want to say - and that includes pejorative ratings.'

[3] :
: <a href="http://www.mit.edu/activities/safe/labelling/0198f1.html">http://www.mit.edu/activities/safe/labelling/0198f1.html</a>
    where Lars Kongshem quotes a case where the program
    CYBERsitter suppresses the word "homosexual" on a screen
    display. Thus, the sentence "The Catholic church is opposed
    to all homosexual marriages." is shown as "The Catholic
    church is opposed to all marriages." on screen.

[4] :
: Documentation for the Apache Web Server, mod_negotation
    Module, <a href="http://www.apache.org/manual/mod_negotation.html">http://www.apache.org/manual/mod_negotation.html</a>,
    mod_mime Module, <a href="http://www.apache.org/manual/mod_mime.html">http://www.apache.org/manual/mod_mime.html</a>.

    Both modules enable the server to deliver different static
    pages for the same URL, depending on other information that
    is part of the browsers request and that is /not/ part of
    the URL. It is the URL though, which ties a thrid party
    rating to a specific page.

[5] :
: <a href="http://www.neci.nj.nec.com/homepages/lawrence/websize.html">http://www.neci.nj.nec.com/homepages/lawrence/websize.html</a>

    "An estimated lower bound on the size of the indexable Web
     is 320 million pages."

    "The coverage of the major Web search engines investigated varies
     by an order of magnitude (variation will differ for different queries, e.g.
     more popular queries)."

    "The major Web search engines index only a fraction of the
     total number of documents on the Web. No engines indexes
     more than about one third of the "publicly indexable Web"."

[6] :
: <a href="http://cgi.pathfinder.com/netly/spoofcentral/censored/index.html">http://cgi.pathfinder.com/netly/spoofcentral/censored/index.html</a>
    The Censorware Search Engine was helpful to check blacklists
    in commercial products which do not expose their blocking
    criteria. Seth Finkelstein reported this URL as being 
    "gone and never coming back. The person who ran it
    lost the trust of almost everyone who does censorware-analysis work.".
    Some vendors provide similar services on their
    websites, e.g. http://www.cyberpatrol.com/cybernot/ for
    CyberPatrol.

[7] :
: <a href="http://catless.ncl.ac.uk/Risks/18.07.html#subj3">http://catless.ncl.ac.uk/Risks/18.07.html#subj3</a>, Clive
    Feather reported comp.risks digest 18.07 of 17-Apr-1996 that
    AOL blocks the name of the small british town "Scunthorpe",
    forcing inhabitants of that town to register as being from
    "Sconthorpe"

    <a href="http://www.liii.com/~just4fun/news/article1.htm">http://www.liii.com/~just4fun/news/article1.htm</a> reports
    an incident where material of writer Anne Sexton is being
    blocked, because her name matches the string "sex".

[8] :
: <a href="http://www.siemens.de/servers/wwash/wwash_us.htm">http://www.siemens.de/servers/wwash/wwash_us.htm</a>

    "WebWasher® is a browser add-on that accelerates the
    navigation on the Web. The software runs on PCs or
    servers. [It r]emoves advertising on Web pages
    while you surf, Filters pop-up windows, animated
    images, referer."

    <a href="http://www.anonymizer.com/">http://www.anonymizer.com/</a> offers services like

    <ul>
    <li>
    Anonymizer URL Encryption - Beta: Extra Protection for the
    connection between your computer and our servers
    <li>Anonymizer Window Washer by Webroot: Preserve your privacy &
    hide your tracks! Cleans your browser history and more...
    </ul>
    
[9] :
: <a href="http://censorware.org/reports/">http://censorware.org/reports/</a>
    and <a href="http://www.peacefire.org/">http://www.peacefire.org/</a>
    contain a lot of information on conduct of Rating Services
    and Label Bureaus in general.

[10]:
: A. A. Pitman, Scientific and Technological Options
     Assessment (STOA): "Feasibility of censoring and jamming
     pornography and racism in informatics, Draft Final Report, 
     PE 166 658, Luxemburg, May 1997.

     Some parts quoted in 
     <a href="http://www.inet-one.com/cypherpunks/dir.97.08.28-97.09.03/msg00149.html">http://www.inet-one.com/cypherpunks/dir.97.08.28-97.09.03/msg00149.html</a>

[11] :
: <a href="http://www.research.att.com/projects/tech4kids/">http://www.research.att.com/projects/tech4kids/</a>

     Lorrie Faith Cranor, Paul Resnick, Danielle Gallo:
     "Technology Inventory: A Catalog of Tools that Support Parents' 
     Ability to Choose Online Content Appropriate for their Children",
     December 1997, revised September 1998

[12] :
: <a href="http://www.usembassy-china.gov/english/sandt/Inetcawb.htm">http://www.usembassy-china.gov/english/sandt/Inetcawb.htm</a>
     "Political Security: A Closed or an Open Internet - The Great
     Red Firewall of China", Brian Ristuccia, 31-Jul-1998:

[13] :
: <a href="http://www.freshmeat.net/appindex/1998/07/31/901899756.html">http://www.freshmeat.net/appindex/1998/07/31/901899756.html</a>


     "Anti-Filtering-Proxy-Proxy: httpd-afpp is designed to
     defeat the site-blocking fuctionality of censorware and
     filtering-proxies. The user first visits a site running the
     Anti-Filtering-Proxy-Proxy. Assuming this site is not
     blocked by the local filtering-proxy or censorware, the
     user is then free to browse any other web sites free of
     filtering-proxy or censorware restrictions.",

[14] :
: <a href="http://www.noie.gov.au/reports/blocking.html">http://www.noie.gov.au/reports/blocking.html</a>

     Philip McCrea, Bob Smart, Mark Andrews: Blocking Content on
     the Internet: a Technical Perspective; Australia, June
     1998,

[15] :
: Gerry Miller, Gerri Sinclair, David Sutherland, Julie
     Zilber: Regulation of the Internet - A Technological
     Perspective; Canada, March 1999

[16] :
: Technical Framework and Background:<br>
<br>
     <a href="http://w3c.org/PICS">http://w3c.org/PICS/</a><br>
     <a href="http://w3c.org/RDF/">http://w3c.org/RDF/</a><br>
     <a href="http://w3c.org/DSig/">http://w3c.org/DSig/</a><br>
     <a href="http://w3c.org/P3P/">http://w3c.org/P3P/</a><br>
     <a href="http://mephisto.inf.tu-dresden.de/RESEARCH/ssonet/ssonet_eng.html">http://mephisto.inf.tu-dresden.de/RESEARCH/ssonet/ssonet_eng.html</a>

[17] :
: <a href="http://www.iid.de/iukdg/carnegie_e.html">http://www.iid.de/iukdg/carnegie_e.html</a>
     "Misuse of International Data Networks" 

     Report submitted by the  Expert Group to G8 Ministers and
     Chief Advisors of Science and Technology (Carnegie Group)

[18] :
: <a href="http://www2.echo.lu/legal/en/internet/communic.html">http://www2.echo.lu/legal/en/internet/communic.html</a>
     "Illegal and harmful content on the Internet"
     
     <a href="http://www2.echo.lu/legal/en/internet/wp2en.html">http://www2.echo.lu/legal/en/internet/wp2en.html</a>
     "Illegal and harmful content on the Internet
      Interim report on Initiatives in EU Member States with
      respect to Combating", Version 7, (June 4, 1997) 
     <a href="http://www2.echo.lu/legal/de/internet/resolde.html">http://www2.echo.lu/legal/de/internet/resolde.html</a>
     "ENTSCHLIESSUNG DES RATES ZU ILLEGALEN UND SCHÄDLICHEN
     INHALTEN IM INTERNET"

[19]:
: <a href="http://www.securitysearch.net/search/papers/bsaprobs.htm">http://www.securitysearch.net/search/papers/bsaprobs.htm</a>
     "Key Legal and Technical Problems with the Broadcasting
      Services Amendment (Online Services) Bill 1999" (Australia)
     <a href="http://www.gtlaw.com.au/pubs/newdarkage.html">http://www.gtlaw.com.au/pubs/newdarkage.html</a>
     "Censorship and Amendments to the Broadcasting Services
     Act" (Australia, April 1999)

[20]:
: <a href="http://www.aclu.org/issues/cyber/burning.html">http://www.aclu.org/issues/cyber/burning.html</a>
     "Fahrenheit 451.2: Is Cyberspace Burning?  How Rating and
      Blocking Proposals May Torch Free Speech on the Internet"

[21]:
: <a href="http://www.internetwatch.org.uk/">http://www.internetwatch.org.uk/</a> "The Internet Watch
     Foundation (IWF) was launched in late September 1996o
     address the problem of illegal material on the Internet,
     with particular reference to child pornography."

[22]:
: <a href="http://www.koehntopp.de/kris/artikel/blocking/index.en.html">http://www.koehntopp.de/kris/artikel/blocking/index.en.html</a>
     Kristian Köhntopp, Marit Köhntopp, Martin Seeger: "Blocking
     of Material on the Internet: Questions and Answers - A systematic
     analysis of the "censorship debate"; Kiel, Germany, May 1997

     The article discusses non-PICS methods of blocking content
     and why they do create even more harm than PICS. It serves
     as an introduction to this article.
