---
layout: post
title:  "The Rockforth Fertilizer Incident"
author-id: isotopp
feature-img: assets/img/background/rijksmuseum.jpg
date: 2019-09-26 10:16:36 +0200
tags:
- "elite dangerous"
- gaming
- media
- lang_en
---
So I have been playing this Internet Spaceships Game. 
[No, the other one](https://www.frontierstore.net/games/elite-dangerous-cat.html).
It also has NPC Backstory, and on 
[13-Sep-3305](https://community.elitedangerous.com/galnet/uid/5d7b5ecf830d4740111e16ba),
a multiplanetary food crisis was predicted, as a prep for the introduction
of a new tradeable good on
[18-Sep-3005](https://community.elitedangerous.com/galnet/uid/5d81fa48ffcb4306ea212c82).

> Distribution of the fertiliser has started at Marshall Dock in the
> Riedquat system. We encourage traders to take advantage of our
> introductory prices.”

### That went wrong.

So some people flew to
[Marshall Dock](https://eddb.io/station/market/999) 
and looked at the prices for
[Rockforth Fertilizer](https://eddb.io/commodity/359). What they found was a
single station buying and selling the good at the same time, and buying it
at about 9000 CR higher than they sold it. 

So here is what we have:

- Fdev introduces a new tradeable good by the way of the backstory.
- They announce that, and introductory prices in Galnet in order to alert
  players to this fact and to lure them to Riedquat.
- They misconfigure a station in Riedquat so that it sells and buys
  the new good to Fdev's disadvantage.
- Players follow the trail and … trade. A lot.

Of course, that news made the rounds rather quickly, and soon a lot of
people were docking large freighters at Marshall and bought and sold
fertilizer as quickly as the game GUI would fill and empty their cargo bays.
That is easily several million CR every five seconds, and I know of some
people who ran this for 11 billion CR (11e09 CR).

### That is what Frontier did to "fix".

Frontier Developments became aware of the misconfigured station only after
several hours, and the sale was available for the larger part of a day, from
around shortly before noon CEST to shortly before 7pm in the evening of the
same day, when they fixed the trade tables.

I do not know if Fdev have in-game trade dashboards that alert them to
abnormally fast or high volume transaction volumes or cash flows. Or to
abnormally quickly growing player budgets. But the slowness of detection
lets me suspect that their in-game monitoring maybe has potential for
improvement.

As a result of the situation, Fdev decided to correct CR volumes on a number
of accounts on the grounds of players 'abusing game mechanics'. Well,
playing the game is literally this, so that's weird, but they what they
decided to do is to book back the CR earned, and/or also delete any goods
purchased with the CR earned (mostly, ships).

![](/uploads/elite-0cr.jpg)

An Alternative Account of a player, after the deduction. Went from 51m CR to
1.3b CR, then purchased an Anaconda. After the correction 0CR, in an
Anaconda, and with Elite Trade Rank plus Arx earned.

### Now, that's not how any of this works.

In terms of game mechanics, what happened is a trade. A trade does much more
than earn you money.

Trade does 

- earn you money. 
- If you are in a wing, your wingmates also 
  [earn a share of](https://elite-dangerous.fandom.com/wiki/Trade_Dividend)
  the trade. Some people winged with their Alt, or friends.
- Trading in the game is also an activity that earns you 
  [trade rank](https://elite-dangerous.fandom.com/wiki/Trader#Ranks)
  (some people went from "Pennyless" to "Elite")
- Trading in the game is also an activity that earn you
  [Arx](https://elite-dangerous.fandom.com/wiki/ARX).
- If you have a crew member, they will receive a variable share of
  all money you earn in trade, so you will receive less CR in your
  account than the trade is worth.

Fdev deciced to "fix" the situation by taking away money earned in the
Trade, but due to whatever reasons mis-calculated the values of the
earnings, in some cases by several hundred million CR. They also took away
goods purchased with this money (deleted ships, mostly).

They did not revise any wing trade dividends.

They did not revise any rank gained.

They did not revise any Arx earned.

They did not take crew member mechanics into account.

**EDIT:** The miscalculation is probably because FDev based the money
deducted on trade value, not taking into account Crew Member mechanics.

### Evaluation.

So this entire thing reeks of unprofessional execution, "as if an intern ran
the entire thing from setting up the tradeable to misconfiguring the station
to mishandling the aftermath". It hints at badly executed ad-hoc
non-process, and generally bad policy at handling in-game incidents -
whoever did this did not just set it up wrongly, but also did not understand
the consequences of the proceedings when trying to mop up the aftermath. And
the math was wrong.

Elite (1984) was one of the first games that had savegames, and progression,
and since then the game has always been about 'state' and moving forward.
The incident handling here basically mishandled game state at a large scale,
at every stage of the entire proceedings.

The Other Internet Spaceships Game has the 
[Council of Stellar Management](https://eve.fandom.com/wiki/Council_of_Stellar_Management). 
The story of its inception is 
[rather famous](https://v1.escapistmagazine.com/articles/view/video-games/editorials/op-ed/847-Jumpgate-EVE-s-Devs-and-the-Friends-They-Keep)
and a much larger incident than here, but the logic behind it is similar:
The company has been handling an in-game incident badly, and a structure
needed to be put into place that can evaluate, judge and define process
properly to handle situations like these.

E:D has no such structure, and it seems that this might need to be addressed
somehow, too.

**EDIT:** Chris_W noted that there is also crew member mechanics. This post
has been amended to reflect this.