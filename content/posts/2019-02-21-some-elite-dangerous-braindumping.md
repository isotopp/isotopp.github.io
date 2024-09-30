
---
author: isotopp
title: "Some Elite: Dangerous Braindumping"
date: "2019-02-21T09:10:15Z"
feature-img: assets/img/background/rijksmuseum.jpg
tags:
- pluspora_import
- lang_de
- elite dangerous
---

# Some Elite: Dangerous Braindumping

Because of my previous posts, some people have been talking to me about the game, and I have been spamming a lot of in- and out-of game content on them.
Then I realized: "Why should you have it better?" and decided to spam things here as well, for balance.

# Install a EDDN client

E:D is a sandbox game, which over time acquired a lot of content and backstory, and with them in-game activities that are better planned out of the game.
For this, data collection happened originally through on-screen OCR, until Frontier embraced this play-style and provided an API.

This API is being harvested by a number of clients, with all upload it into the Elite: Dangerous Data Network [EDDN](https://github.com/EDSM-NET/EDDN) and then feed it to a number of backend sites for planning, optimizing and minmaxing.
I am using the [EDMC](https://github.com/Marginal/EDMarketConnector/wiki) client and fed it with all necessary API keys and accounts.

Make sure the EDDN client is on before you launch the game.

# Making use of the EDDN client data

Backends are the [Elite: Dangerous Star Map](https://www.edsm.net) which also hands out a number of Achievements, if you are into this kind of thing.
The two most important backends using EDSM data are [EDDB](https://eddb.io/) for finding stations, suppliers and planets, and [INARA](https://inara.cz/), which does the same things and also helps you with engineering planning and unlocking Guardian technology.

Guardian tech is necessary if you want a guardian frame shift drive extender, which adds range on top of engineering, so many explorer ship builds have it.
It also has a lot of scanner and weapon tech, which is essential for Thargoid combat.
You actually hardly have a chance against Thargoids without Guardian tech.

# Making Money Fast

Previously, you could make a lot of money with passenger transport. 
Basically, after your grind your way to a Cobra MK III, add a number of passenger cabins and do one of two things:

- Fly to Robigo: "Robigo Mines" or Ceos: "Babbage" and take on passengers for Sothis: "Sirius Atmospherics", fly them to the target, come to a full stop <2km from the target and scan the target until you get a confirmation.
  Then dump the passengers back at the port of origin.

For this you would need Biz, First and Luxury cabins (for the Cobra: Biz), and grind your way up to Reputation with all factions.
At Robigo Mines you have a chance to pick up wanted persons, too, and these usually pay more.
Robigo is an Outpost, so Landing Pads are Small and Medium, and it never scans, so transporting outlaws is safe in Solo and Private.
Griefers with Manifest Scanners and Kill Warrant Scanners wait in open at Robigo, so don't.

Ceos is much closer to Sothis, and is HighSec, so do not go there with anything illegal.
Babbage will scan you at least once for every approach.
You can reach Sothis with a single jump, tho, so you need to do the math if faster RTT or higher CR/trip work for you.

Another way to make CR/h with passenger cabins is to fit lots of cheap economy cabins, and then search for stations in trouble (on fire, Thargoid attack or otherwise troubled), fly there and take on bulk passengers for [rescue trips](https://www.youtube.com/watch?v=cNw2QXX4gYA) out of the system.

And yet another way to make high CR/h is Core Mining, but this requires a higher up front invest. 
Check out [ObsidianAnt on Youtube](https://www.youtube.com/watch?v=nIfZu1clbRg) for a Core Mining build and tutorial, and aim for Void Opals or Blood Diamonds.
Also prepared for NPC Pirate combat, because they will come after you.

# Build with Coriolis.io

For every ship, plan the base price in CR again for purchase and upgrades, so the actual ship you want to fly is usually base price times two.

Or use the [Coriolis](https://coriolis.io) planner for the build you want and get a more precise cost estimate.

Then use [EDDB](https://eddb.io/stations) to find the stations that sell you the parts you need.

Being on good terms reputation wise with the Federation is nice (but you will need to pledge yourself to the Fed and have rank with them for a Sol permit, which gives you access to Jameson Memorial, which has all buyable stuff in the game).

Being on good terms with Sirius is also useful, because you get the Sirius permit and then gives you access to other interesting stations. See [this tutorial](https://www.youtube.com/watch?v=hrMaBiMgP94) for details

# Controls

If you have a Hotas or want to manage your controls better, search for .binds file in your game install or the application data in your User Home in Windows.
The Binds-File can be uploaded to [EDRefcard](https://edrefcard.info/), which will print you one or two pages of nice reference cards.
Twice as nice for Hotas users.

Also, [HUD Editor](http://arkku.com/elite/hud_editor/) for non-amber ship HUDs.

# Engineering

You get more Jump Range with Engineering, and one of the first engineers to unlock is Felicity Farseer, so Frontier understands that need very well. 
For [Felicity](https://elite-dangerous.fandom.com/wiki/Felicity_Farseer), you need Meta Alloy, which you can buy at the Maia system in the Pleiades, at Darnielle's Progress or find elsewhere in the game.

[Meta Alloy](https://eddb.io/commodity/114), [Meta Alloy](https://elite-dangerous.fandom.com/wiki/Meta-Alloys).

Once you have unlocked Felicity, you will need engineering materials for FSD Range optimization or whatever else you need.

The easy way to get that is at [Dav's Hope](https://canonn.science/codex/davs-hope/).
Do the round with a SRV as shown in [this post](https://forums.frontier.co.uk/showthread.php/368279-UPDATED-List-of-Materials-at-DAV-S-Hope(Pictorial)) and scoop everything.
Then find yourself a Materials Trader close to you using inara.cz's search function and the [engineering planner](https://inara.cz/cmdr-craftinglists-components/).

You may also want a wake scanner and position yourself outside the no-fire zone of a busy orbital and then wake-scan every Low and High Wake you can find.
This will give you a lot of encoded materials which are required in FSD engineering.

Doing this gets you around the grind lock with the least amount of work.

[List of Engineering Mats and how to get them](https://docs.google.com/spreadsheets/d/1Mp7l0bSnMp_G7xWUm75M-XuihDfTdi27rm-vB9K8AX0/edit#gid=0)

[The Other Materials List](https://docs.google.com/spreadsheets/d/1yo1iHP9KUXpoBaIzJsRsDxfAcQa7cBq0YUIFy3m2NII/edit#gid=130934395)

# Discovery Money

Once you have a ship with decent jump range, you may want to do some Exploration.
In fact, you can do a lot of that on the fly while doing other things.
Whenever you jump long distance runs, after entering the system, during FSD cooldown and fuel scooping, run the Discovery Scanner.
I have the screen usually in Analysis Mode ('m', blue lines in HUD) and have the Discovery Scanner bound to MB1 in a fire group.
When the scan is finished, it has a very characteristic sound and after that you can jump on.

This style of flying is called 'Honking'.
The idea is to sync Honk times, FSD cool down times and fuel scooping times so that everything is ready at the same time, just when you get around the drop-in star to continue to jump.

A new system with earthlikes or terraformables can bring in around 0.3-3 MCR when scanned (you hand in the data at any station at Universal Cartographics, and you need to be more than 20ly from the system for UC to buy the data).
High Metal Content and Metal Worlds also bring a lot of money.

Systems you visited before and where you already sold the data to UC hardly bring any money.

You can fit a Full System Scanner (FSS).
It allows you to map a system in a more detailed way.
After honking, you can enter FSS mode with (') or where ever you have mapped it, and then scan for signal sources, bodies or other things.
There is a guide at [the forum](https://forums.frontier.co.uk/showthread.php/464149-The-FSS-A-pictoral-guide) that explains FSS'ing better than I can do here.

You may also want to fit a Detailed Surface Scanner (DSS).
When you fly close to a planet and come to an almost full stop in supercruise, you can activate the DSS and get into a new screen for the DSS minigame.
You fire probes at the planet, which map a part of the surface.
There is an efficiency target depending on the size of the body scanned, and if you manage to get 90% mapped with fewer probes than the efficiency target, you get a bonus.
See [Reddit](https://www.reddit.com/r/EliteDangerous/comments/a8roi9/efficient_planetary_mapping_a_visual_guide_to_dss/) for help.

DSS mapping will also reveal and catalogize all Points of Interest on a body, so fumaroles, alien crash sites and the likes will show up with names right on the map.
It's useful and makes money.

While Honking is fast, FSSing and DSSing a system takes more time. 
DSSing also takes travel time, because it can be done only up close.

There are two names on each body:
Discovery and Mapping.
DS, FSS and DSS previously unvisited bodies etches your names onto the newly discovered body forever and for all other commanders to see.

# Explorer Ships and Builds

The cheapest useful explorer is the Diamondback Explorer.
It is small, but has an extreme jump range and can be engineered to truly awesome range.

In the Mid Size department, there is the Asp Explorer, which especially with Engineering can to truly impressive things and also has a decent amount of internal space, if you care to do more than just data collection.
It is a deep space capable ship, which can carry a large scoop, 2x AFMU, 2x SRV, a refinery, a DSS and a small cargo rack and still make distance.

If you need more space, go Python, but be prepared to engineer FSD and Thrusters for range and manoeuvrability.
Without that, it flies more like a brick.

The Anaconda required a large pad, so it can not land at Outposts.
It also is unflyable in Supercruise without serious engineering, but there are common Explorer build blueprints for it that take it over 80ly jump range.
It is also used a lot as a tanker by the Fuel Rats.

Learn more at [ED Astro](https://edastro.com/exploration).
Basically, an explorer build is everything D-rated except the FSD, which is A rated.
Then engineer the FSD for range and everything else for weight.
No weapons, large fuel scoop, AFMU, SRV, DSS, optionally a refinery.

Also learn about [synth](https://elite-dangerous.fandom.com/wiki/Synthesis https://inara.cz/galaxy-synthesis/), this is where you get supplies when there are no stations.  
Mats are gathered using SRV or mining equipment, so read up on that, too.

Note how there is a FSD injection materials synth.
FSD injection increases your jump range once for each injection, hence it is also called "Jumponium" (and that makes it googleable).
When crossing through the starless depths, the rifts between the arms of the galaxy,  star density goes down and you may well find yourself in a situation where you need jumponium even in an engineered ship.
Rehearse using this and the Galaxy Map properly together before you go into the Rifts.

# Cooperative Player Groups

The ANWB of the Elite Dangerous Universe are the Fuel Rats. Call them at [their site](https://fuelr.at).
This will drop you into WebIRC on their channel, and they will guide you through a well planned and orchestrated set of motions that will allow them to shoot you with Fuel Limpets.
Each Fuel Limpet will load 1t of FSD drive fuel into your ship.

The Fuel Rats are strictly non-combatant, and they do not charge you anything.
You do not need to be a member of anything for their help.
Basically, you provide them a mission that is more interesting than procedurally generated content.
They are the coolest faction in the game, and they have their own planet.
Their home world, Fuelum, orbits a scoopable star, of course.

The Fuel Rat Wiki at [their sie](https://confluence.fuelrats.com/display/FRKB/How+to+Join) (all of the Wiki, not just that page) contains a lot of useful information about the in-game, the game implementation and instancing system and how to org and run a rescue and relief organisation efficiently.
Even if you are not playing, it is a trove useful of information.

See also [this writeup](https://www.polygon.com/2017/12/25/16817700/elite-dangerous-fuel-rats-rescue-cmdr-persera) for news about the Fuel Rats and their exploits.

Also check out and auth with [their journal client](https://journal.fuelrats.com) before you run of of fuel. 
In time, when you find yourself stranded in the black, it will save you precious time.

Other helpful people are the Hull Seals, which do for Repairs what the Fuel Rats do for fuel, and there is a lot of overlap between the players in both orgs.

The Iron Wing is a group of combat pilots that take it on them to protect returning explorers in their combat-weak, long-range optimized builds when they return to the bubble so that they can safely upload their data at a destination of their choice. 
They help against griefers and NPC pirates.

# The Neutron Route

Neutron stars are the other thing that makes you jump far. Doing this will damage the ship each time you do it, so 1. AFMU (large) to repair the ship, and 2. AFMU (small) to repair the AFMU #1.
Use the [Neutron Router](https://www.spansh.co.uk/plotter) to plan the trip.
[This video](https://www.youtube.com/watch?v=4vnEoFOSHIY) explains the Neutron Route.
