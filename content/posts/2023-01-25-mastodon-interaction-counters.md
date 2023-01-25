---
author: isotopp
title: "Mastodon Interaction Counters"
date: 2023-01-25 06:07:08Z
feature-img: assets/img/background/rijksmuseum.jpg
tags:
- lang_en
- mastodon
- fediverse
- social-networking
---

In [this post](https://toot.io/@Sirsquid/109750677079204971), SirSquid\@toot.io asks:
> Can someone explain to me why seeing retoots and likes is wildly different across Mastodon servers?
>
> From toot.io, a toot from @gamingonlinux\@mastodon.social shows hardly anything. 
> But when viewing it on mastodon.social, it has *tons* of both.
> 
> This is one thing I would love to see properly cleaned up on Masto.

Mastodon is using ActivityPub, a federated protocol.
Nodes exchange articles, and each node caches articles.

In order for a node to receive an article from a remote user in the first place, at least one user on the system needs to subscribe to that remote user.

So given the following situation:

![](/uploads/2023/01/mastodon-subscribe.png)
*On mastodon.social, the user GamingonLinux subscribes to SirSquid\@toot.io. 
On chaos.social, the user isotopp subscribes to SirSquid\@toot.io.
On subscription, the toot.io server is notified of the subscription.*

Two users on two different servers, isotopp\@chaos.social, and GamingonLinux\@mastodon.social, subscribe to SirSquid\@toot.io.
The server toot.io is notified of this, and will deliver new posts from SirSquid to these two remote servers.
Old articles from SirSquid do not exist on either remote server, then will not be backlogged.

When SirSquid now posts a new article, the following happens because of the subscription:

![](/uploads/2023/01/mastodon-post.png)

*SirSquid posts a new article.
The new article only exists at toot.io.
It enters the Local Timeline, which is a view into the Outqueue of that server.
The article is now delivered to the home servers of all subscribers.
On delivery, it enters the Federated Timeline, which is a view into the Inqueue of that server.
The local subscribers are then notified and are shown the local copy of that article.*

When SirSquid posts a new article, this article is locally created on toot.io.
This is going to be the master copy of the new article.

The article also enters the local timeline of that server, which can be thought of as a view of the Outqueue of the server
(This is not actually precisely true, because posts can be unlisted or otherwise restricted in visibility).

Queue workers on toot.io will eventually fetch the master copy of the article, determine the article subscribers and then try to post the article to the subscribers remote servers.
When that works, the article enters the Inqueue of the remote server.
When that does not work, retries can happen.
The Inqueue of the remote server is visible (with visibility restrictions) as the Federated Timeline.

For each incoming new post, the local subscribers are notified and are shown the local copy of that post.

When a user is very popular and has many followers, their posts need to be copied to all subscribers, which can be literally on every single server in the Fediverse.
That means thousands of deliveries of the post need to be made. That can take time.

Not all servers will always be immediately reachable.
A certain percentage of deliveries will fail, and be backlogged.
The source server will have to retry a certain number of times, and if the error persists, give up.
The subscribers on the unavailable server will lack a copy of that post.

Users on, say, mastodon.social, could still discover missing posts if they checked the home timeline of SirSquid on toot.io.
They won't find the post on the copy of the home timeline of SirSquid on mastodon.social.

When readers on mastodon.social or chaos.social interact with the local copy of a post, this will happen:

![](/uploads/2023/01/mastodon-interaction.png)

*A user on chaos.social boosts the post.
The local boost counter for the post is updated.
The counter change is forwarded to the originating server, toot.io.*

*A user on mastodon.social likes the post.
The local like counter for the post is updated.
The counter change is forwarded to the originating server, toot.io.*

*Interactions are being aggregated at toot.io.*

Interactions with a post are updated locally: A boost on chaos.social increments the boost-counter on chaos.social, and a like on mastodon.social increments the like-counter on mastodon.social.
Such interactions are also forwarded back to the master copy of the post.
That is, updates for each boost and each like are being sent back to toot.io.
The counter at the posts master copy aggregates all these interactions and has totals for the post.
Notifications are being sent to SirSquid\@toot.io, and go Ding, Ding, Ding!

If a user is very popular and has many subscribers, and a post is very popular and has many interactions,
the originating server (here: toot.io) will receive updates from many thousand remote servers, one for each like or boost of the post on any server.
These updates will need to be persisted, that is, written to disk into a database.
This will generate a lot of load on the originating server.

The aggregated notifications won't be forwarded back to the local copies.
That is, the master copy of the post at toot.io will have the aggregate number of likes and boosts.
But these aggregated numbers will not be redistributed back to the subscribers and their servers.

In our example, the post will have one like and one boost on toot.io, but only one like and no boosts on mastodon.social.
It will have no likes and one boost on chaos.social.

Distributing all counter updates in increments of one to each and every server that has subscribers to SirSquid's posts would just be too much work.

And that is why interaction counters in ActivityPub are usually different on each server, and only the master copy of the post has true counter values.

Or true-ish.
Of course, just like individual articles may never reach individual servers if they are unreachable too long, the same can happen backwards with counter updates.
