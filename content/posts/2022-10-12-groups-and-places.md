---
author: isotopp
title: "Groups and Places"
date: 2022-10-12 06:07:08Z
feature-img: assets/img/background/rijksmuseum.jpg
tags:
- lang_en
- remote first
- work
---

In a distributed, asynchronous environment, there is a need for distributed, asynchronous interaction.
This interaction is often written, but "writing" these days is actually a media-rich process that includes much more than letters.
It also needs to be able to build some structure, and some gateway to level up to more synchronous and even richer communication.

Let's have a chat about chats, and what properties they have. 

![](/uploads/2022/10/groups-places-01.png)

*Historically, chat was lines of text, without much structure. Even today, many geeks often propose IRC when chat solutions are being discussed in a corporate context. That is a very myopic way of thinking.*

The first chat network I have been using was IRC -- Internet Relay Chat.
This has been in the late 80ies or early 90ies, so today I have had an interactive online presence on the upside of 25 years or so.

Later I got to use ICQ, Jabber, Skype, Hangouts, Facebook Messenger, WhatsApp, Slack and RocketChat, among many others.
I also got exposed to a number of collaborative document processing systems with chat-like properties:
the now defunct Google Wave (alias Apache Wave, now also mostly defunct), and its heir Google Docs, and a bunch of newer collaborative brainstorming tools from the School of Miro.

All these applications and chat systems are different, but they can be evaluated along a number of dimensions to understand chat systems better.

![](/uploads/2022/10/groups-places-02.jpg)

*A screenshot of my chat desktop from 2016. There are many like it, but this is mine.*

# Location and Discoverability

One of the most important functions any chat system has to have is enabling the right people to find each other.
There are two large classes of chat systems here: One uses groups, and the other uses places.

Groups are just that: collections of people that talk to each other.
You write a message and sent it.
It is then visible to all members of the group.

The problem with groups is that they are almost impossible to find.
They are invitation only.
A member of the group must have knowledge of you looking for the group, and then invite you to it.
In some messengers this will also form a new group, destroying the messaging history of the older group, in order to protect the privacy of the conversation happening before the new member joined.

![](/uploads/2022/10/groups-places-03.jpg)

*The Discord chat system allows you to form small scale groups with fixed membership, even without having a "Discord Server".*

A better system uses Places (often called Rooms or Channels) instead of Groups.
A place is discoverable, you can "find" it, "go" to it, and "join" without being explicitly invited (permission and moderation systems often exist).

Since Places tend to proliferate, mechanism to group, order, tag and search them often exist.
In Discord, for example, Channels can be grouped into Categories, which are then grouped into "Servers", the server having an owner, and often a purpose.

![](/uploads/2022/10/groups-places-04.jpg)

*The Discord chat system, showing the "heiseonline" discord server, with a channel named `#tierbilder` (Animal Pictures) selected. Below that, a Category for `Sprachkanäle` (Voice Channels) is seen.* 

Having Places instead of Groups is crucial for any communication system.
It gives you the capability to write instructions that send people somewhere, and enables people to find and go somewhere, gives them agency.

Facebooks Messenger and Facebook at Work's greatest flaw is their Messenger, which does not have this feature.
It relies on Groups, and tries to mitigate that by coupling groups to Facebook "Groups" (discussion boards), auto-inviting people into the Facebook Group associated chat group.
This combines worst practices of several systems into one.

Places can be persistent, they can exist without anyone being in them.
Places can also have one or multiple owners, which is the root of that Places' permission system and the source of all moderator power for that Place.

# Presence

Working asynchronously means that you will not be present in a chat at all times.

This is a feature: It allows you to focus, and think straight, cutting deeply into problems.
It also allows you to be in another timezone than your communication partners and still contribute meaningfully to a collaborative effort.

It poses the problem of your communication partners not knowing your current communication status, and availability.
If they are blocked, they might need you, and it would help them to have some expectation of your response times, availability and context.

All modern chat systems have a presence mechanism, a semi-automatic status tagline, and the more thoughtfully engineered ones also know your timezone and show it to your peers.

![](/uploads/2022/10/groups-places-05.jpg)

*The Slack chat system allows users to set a status in the form of an Emoji and a tagline. These are automatically cleared after some preset time, if desired. Slack also understands time zones, and will show you out-of-office times of communication partners, when necessary. Clicking on a user will also reveal their location and local time. On the right hand side, a number of status bubble examples are shown.*

Presence management in chat system often goes hand in hand with logging.
Messages sent to you in your absence are logged, and shown to you on reconnect.

This is all a giant step forward from IRC, which did not manage presence well, and also did not allow sending messages to disconnected users.

In IRC, being offline means not being present: people fall off the channel and what is being said with them being not there is lost to them.
That is of course a nuisance, and so people have been using programs such as screen to run an IRC client even when they have been disconnected from their computer.

IRC's mechanism for presence (here: attention) is somewhat hidden -- the `/away` command. 
But not only is the mechanism hidden (it is another command that needs to be learned and used), but the status is somewhat hidden as well.
You can't see if somebody is `/away` unless you look at them with a `/whois`.
Or you learn about the fact that they are `/away` only after the fact, when you say something to them and get an auto-response with their `/away` message.

Some people do not like this, and so they use another mechanism and change their nicknames when they are not there -- "Isotopp" becomes "Isotopp|AFK" or similar.
This is less structured than `/away`, and so some people suffix their names, some prefix them and others completely change their nicknames - "Isotopp" becomes "Awaytopp".
The lack of facility, discoverable interface and standardization creates variant practice.

# Logging and Multi-Device

All modern chat clients have proper presence, even if not always as rich as in Slack.
Most also have unified logging.
That is, even absent users can receive messages and will see them when coming back.

Most users in 2022 have multiple devices, and multiple clients.
Most users want the entire messaging history, in order, and with all backlog, available on all their devices, so that they can switch between devices without losing context.
This usually includes new devices, to facilitate moving to new laptops or cellphones, without losing history.

This often clashes with old standards, badly designed security mechanisms and other implementation details.

![](/uploads/2022/10/groups-places-06.jpg)

*A Google Talk log, with OTR encryption, viewed in a different Jabber client. The history is truncated, and OTR encrypted messages are not available in readable form in this client.*

One extreme point for synchronisation is the Discord chat system, where not only history and messages are kept in sync across all clients, but even preferences are unified:
Setting the desktop client to dark mode will also set dark mode on the cellphone application, and vice versa.

Another, opposite extreme point is Jabber, which has no common rule for disposition of messages, and by default will send messages only to one client, using either a preference system, the last active client, or "all known clients to the server at the point in time the message was sent". A lot depends on server and clients used here, creating an unreliable and hard to control user experience.

# Deliverables - File and Image Sharing

In a corporate context, we use the communication mechanism as a vehicle to create and share documents, and have a discussion about the documents we work on collaboratively.
Mail was doing this in the past, with Quotes and with Attachments, but that is a very cumbersome, lossy and hard to discover mechanism.
Most companies have moved the collaboration process off mail, to a large extent, and towards chat and collaborative document systems such as Google Docs.

Google had taken this one step further with structured chat.
The pioneer application for that has been the short-lived Google Wave:
Wave allowed a group of people to create things in a kind of chat bubble, only that this bubble could not just hold a line of text, but also other media including rich documents, images, bots or other things that interfaced with the Wave API.
Other users could comment on an item in a hierarchic comments-on-comment tree like in a discussion system, or directly edit the original item, incorporating their changes. 

Changes were recorded and were undoable and replayable.
This allowed users to view the end result of a Wave, or review the process of building that result after the fact.

![](/uploads/2022/10/groups-places-07.jpg)

*Google Wave being used to collaboratively work on a shared document. The Wave contains the final document, but also the process that led to the end result.*

In a way, Wave could have been a salvation from the hell of corporate email:
Waves produce results, documents or agreements.
They also record the history of how that result had been reached, and they allow people joining the process late to catch up and review what has happened before on their own terms.
No more full quotes, 13 levels deep, and no more dozens of copies of the same Word file, all slightly different, and with diverging side remarks from people somewhere in the organisation, which never made it back into the main document.

Wave failed, though, and for multiple reasons. 

One of the bigger reasons is that Wave was all mechanism and no purpose -- it could to many things, and offered all of them without stating what Wave itself or the various functions are there for.
One could use Wave to manage a world building and game session in a role playing game, as well as replace corporate email, or use it as a rather clunky and over-engineered word processor.
So Wave needed explanation and contextualisation - and above all, a purpose, but none was given.
Wave died, because it confused users.

![](/uploads/2022/10/groups-places-08.jpg)

*A collaboratively edited document. Multiple watchers are shown as icons at the top of the screen. A chat window is open. Cursors and collaborators edits would be visible simultaneously editing the document in many places while it has been initially created.*

Wave's legacy lives on, though.
Much of the functionality of Wave is present in Google Docs, including the side chat, collaborative editing, history recording and replay and many other functions.
Unlike Wave, Google's shared document editing puts the purpose first, and the collaboration in the background.
This is matching people's expectations much better, and is less overwhelming.
It does not have to be taught, or manually given purpose.
Instead, the purpose is built in, and immediately obvious.

Modern chat systems are kind of the opposite:
They put their purpose (communication) first, and the documents ride in the back.
This happens either through URLs or through file transfer.

All modern chat systems have a working file transfer, which is also aware of media types.
That means, not only can you drag and drop files into a 1:1 chat or a channel, but also images or animations, as well as audio files.
They are understood, and shown inline.

Together with other mechanisms, such as threads, they enable unique workflows that go way past the unstructured ASCII-limited text of IRC.
For example, in many workplaces designers use the image capabilities of Slack, together with Slack threads, to share images, mockups and other things and then criticize or approve designs.

This is also where not only IRC, but also Jabber falls down.
Proper file sharing, inline media content and threading are things that may exist somewhere, in some Jabber extension, but are not generally interoperable or enabled without much configuration across a set of clients.
They might as well not exist.

# We were lucky

At the place I work at, we were lucky.
By the time Covid pushed people to work from home, we already had replaced mail almost completely.
I was down from thousands of mail messages per day on almost one hundred mailing lists to less than a dozen messages, and no mailing lists at all anymore.

We have moved to **Facebook at Work** for non-realtime group communication.
Teams were using their Facebook groups to communicate announcements and progress to other teams, and have discussions with them.

Internally and for support we moved to **Slack**.
This was pushed with considerable force from below, after corporate initially being very fond of Facebook messenger, mostly because it was free and included in Facebook at work.

Unfortunately FB messenger is utterly broken in many ways, and unsuited for any structured work communication without basically rewriting it from scratch.
There are many facets to its fractal brokenness:

- It has groups, but no places.
- Groups have limited attendance, and the limit is too small (the old `#live` Jabber channel was mandatory for all people pushing deployments, and could not be reproduced in FB Messenger).
- It ate data. Mentioning a filename `main.pl` would inescapably turn this into a polish hostname [main.pl](https://main.pl). More often than not, Messenger would detect a malware phishing attempt and prevent you from sending the message.
- It ate data. Mentioning URLs with array parameters ("https://example.com/bla?a=1&a=2&a=3") would make it parse the URL, representing the keys in a hash, and dropping the repeated keys, breaking the URL.
- It could not handle files, code formatting and many other things well.
- It could not do threads, which are a necessity in high volume support channels.

In the end, corp was forced to also purchase Slack on top of FB at Work, to prevent a more or less open revolt.

We had been using **Google Drive and Google Office**, as well, across the company, and the collaborative features in it were well understood and used.

The heterogeneity of all of this posed to be not a problem, somewhat surprisingly.
In fact, in many cases, the mix-and-match approach enabled us to be flexible, and work around many tools limitations, and also to expand and integrate other things easily.
Other applications (e.g. Miro, but also many others) have since been added for many users, who have other, more specialized needs and requirements.

We also used to use BlueJeans, before the pandemic, and mostly from meeting room installations with dedicated hardware.
During Covid, Zoom became popular, and offered a richer and much better set of clients, especially on mobile devices (Laptops, Tablets, Cellphones), so we switched vendors here.

The key learnings are:

- We already had tooling for Remote First, but had hardly any need to use them properly.
- We were hardly using Email with all its glorious brokenness anymore.
- By happy accident, the core tools (FB at Work, Slack) had Places, not Groups, as a core metaphor, and people structured their work around these places.
- Collaborative document editing and a rich, structured chat complement each other well. But since Facebook and Google both are unable to make such a thing, we have yet another vendor integrated. This turned out to be an actual advantage.

Our key deficits have not been discussed at length here, but are related:

- Google Office documents have very bad discoverability and Google Office has no places.
- Corollary: A process is needed and needs to be manually executed to move content from the collaborative phase to the publication phase, elsewhere.
  - By public decree in our place this is going to be Confluence, which has problems of its own, and also poses a document conversion problem (from Google to Confluence internal format, keeping structure).
- Code Collaboration is not part of other collaboration at all, and lives in a third, and entirely disconnected space.
