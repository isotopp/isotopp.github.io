---
layout: post
title:  'On Touching Candles, And Error Budgets'
author-id: isotopp
feature-img: assets/img/background/rijksmuseum.jpg
date: 2020-08-31 17:51:27 +0200
tags:
- lang_en
- devops
- erklaerbaer
---
Ok, it's "Dad Stories" Time (from [Twitter](https://twitter.com/isotopp/status/1300414521169907713)). When my son was somewhat older than a year, he was learning to speak. He could already say "Mama" and "Papa".

It was around Christmas, and there was a candle on the table, glowing interestingly, so he wanted to touch it. "Nein, heiß" is what you would say in German.

Of course, a toddler does not understand the meaning of "heiß". I mean, he's trying to imitate the sound of it, but the meaning of "heiß" is something specific. We connect an experience with the word. Something that any child can only learn by touching the candle. There is literally no other way to learn it.

So the only thing I could do for him was to get a wet cloth and let him touch the candle. Safely. He did. He cried. I applied the wet cloth and soothing words. And the third word he learned was "heiß".

### Knowledge, Experience and Intuition

Computer Science is a lot like this, for some reason.

People know here (*touches head*), for example by reading the SRE book or other stuff. You can ask them, and they will repeat the key learnings from the book back to you correctly.

But they do not know here (*touches heart*), and they will still build centralized Zookeepers.

It requires a few outages until they know here (*touches gut*) how to design systems properly and what is important in design.

So that person over there, with the centralized Zookeeper cluster. And that person over there with the schemaless, [much simpler config language](http://mikehadlow.blogspot.com/2012/05/configuration-complexity-clock.html). And that one yonder, with the (type, length, value) BER-like data format. I could tell you "heiß" and you would not *understand*.

Go and touch that candle. It's the only way to learn *properly*.

[Jonathan](https://twitter.com/jof/status/1300421558490587136):
> I lament that so many orgs/people/uptimes have to suffer to build the wisdom. 
>
> I dream of a university/bootcamp of "candle touching" where learners practice scaling a service.

Another "Dad Story": I once worked at a company which used to own the domain [wahl.de](https://wahl.de) ("election.de"). They did not do much with it, they usually gave it do apprentices to play with. Usually the apprentices built elaborate PHP based websites that did pre-election mix- and match "Find the party that matches my interests".

Never did the apprentices stop to consider what will happen on election day, Sunday at 6pm. Because that's when the die is cast, so hordes of people will drop onto the site and what they want - the *only* thing they want - is the results, as they develop. With no amount of hardware running PHP you will be able to handle this.

And that does not matter, because all you need at that time is a single static page, updated in the background, with current results.

But the thing is - as an apprentice, you only learn - like "*touches gut* really learn" -  when you had that site burn down underneath you in the most critical way.

So we let them.

Yes, we could make it safer. Yes, we could have warned them. Yes, we could have gently steered them towards a curated, safe solution. We didn't. It was [Kobayashi Maru](https://memory-alpha.fandom.com/wiki/Kobayashi_Maru_scenario) all the way. It was quite important to let them do it, and let them fail at it, the real thing.

Or as [a good friend phrases it](https://twitter.com/mausdompteur/status/1300439329614057473):

> "Error Budget": How much infrastructure you're allowed to set on fire to learn the meaning of the word "heiß". Every organization has an error budget, but most don't plan for it.
