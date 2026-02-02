---
author: isotopp
date: "2025-06-17T03:04:05Z"
feature-img: assets/img/background/rijksmuseum.jpg
title: "Not being federated and E2E as an advantage"
toc: true
tags:
- lang_en
- chat
- security
aliases:
  - /2025/06/17/no-federation-no-e2e.html
---

An unpopular opinion:

[Revolt](https://revolt.chat/) is a chat that ultimately tries to emulate and displace Discord as an alternative.
Revolt is not E2E encrypted and not federated. That is a big plus.

Federation and E2E encryption are features that make an implementation much, much more complicated without need.
Most people do not want to organize a women's shelter or abortion support or the antifash resistance.
They just want to have a public guild server for their gaming guild or chat about 3D printers.

# Don't federate chat

Having a federated system for that has a number of implications that make implementations more complicated and impact quality of life for users.

In a federated systems, different servers can be on different versions of the server software.
This can impact features, which may or may not work properly.
If will affect security of the whole network due to lack of patches in one place.
And it will create propagation delays of messages inside the federated network, 
that is, order or even availability of messages can differ depending on what server in the federated network you are on.

As a consequence for the individual user, there is no single history order of messages – some messages may be missing,
appear out of order, and there will be spam.
Lots of it.

Back when Google Hangouts was still federating XMPP (Jabber) servers,
specialized Jabber server implementations existed with the sole purpose of simulating user profiles,
discovering Hangouts that are joinable, and spamming users with, well, garbage.

Operating a public chat room in 2025 is already a moderation nightmare.
Adding federation is a surefire way to make things fail.

## Federate identity, multihome clients.

This is not to say that the client should be bound to a single server.

It can, and should, in fact, connect to different servers for each community.
The server, though, should be a "single visible instance, single history for all" thing,
and have proper controls for the moderation team to control admission of new users to whatever their policy is.

And federated identity can be quite useful.

In fact, even Mastodon and other Fediverse systems should use federated identity, and also be identity servers.
This will allow a user to connect their client to a chat server without making any new account.

# Don't E2E encrypt chat

Use TLS (or even a REST protocol over HTTPS) to connect to the chat server.
But do not E2E messages.

Keep a clear text history on the server.

This makes it trivial for a single identity ("isotopp") to have multiple devices (desktop, ipad and web client)
and switch between them, yet have the same chat history on all devices.

It will allow new users to join a channel and see the full channel history, 
if the channel is configured to do that.
And because the server is not federated, the channel backlog policy can actually be enforced.

It makes it trivial to implement search and indexed archives for a server that wants that.

It makes it easier to implement detection of spammy behavior,
implement rate limits, and to autodetect inappropriate or banned content.

With E2E, the server only has binary garbage that it cannot read itself, only distribute.
It may not even have metadata.

It will be complicated to scan messages for spammy behavior, detect banned content.

It will be impossible to provide backlog to newly joined users.
An existing identity (Isotopp) adding a new device (his phone) can only have backlog,
if the other clients (the desktop of ipad client of Isotopp) of that user support client-to-client backlog transfer.

Without E2E encryption, there is no keysplit problem ("half a channel only sees undecipherable messages"),
there is no "known plaintext" problem to handle, and there is no large-scale key distribution problem.

# Conclusion

If you consider writing a Discord replacement,

- Don't federate, multi-home the client to non-federated server instances.
  Lose all the complexities of distributed transactions, serialization problems, lost messages in split, and diverging timelines.
- Federate authentication, provide identity servers, or use mastodon's and other fedi as identity server they way Pixelfed does.
  Let people chat with their Mastodon identity, if they want or let them make a new identity with any of the identity servers you run.
- Don't E2E. Use transport encryption, TLS, and be done with it.
  Use the cleartext on the (non-federated, singular) server to make useful things, antispam, search, serving backlogs.
  Lose all the complexities and user-hostile side-effects that come with using a thing such as the Matrix protocol and E2E.

Both properties (federation, E2E) do little for the end user experience except in a few limited use-cases,
but come with a huge cost in implementation complexity, 
review, and anti-abuse measures.
They will ultimately bind the majority of your dev capacity for nothing in return.
