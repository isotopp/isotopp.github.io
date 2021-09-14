---
layout: post
status: publish
published: true
title: The Cryptowars, twenty years ago
author-id: isotopp
feature-img: assets/img/background/rijksmuseum.jpg
date: '2017-06-27 12:15:29 +0200'
tags:
- politik
- security
- kryptographie
---

So there was 
[this article](https://motherboard.vice.com/en_us/article/43ymjd/why-fbi-investigated-dungeons-and-dragons-players-1990s)
in Motherboard, pointed out to me by a very young friend of mine. It's an
FBI memo written in 1995 during the Unabomber investigation, about a
mysterious, close-knit group of gamers, playing D&D. The article gives
hardly any context at all, but that kind of memo during this time is not
unusal or even remarkable, from a historical perspective. 

So here is a bit of historic perspective, not quite in chronological order.

**John Gilmore** A lot of this, from a US point of view, revolves around the
person of 
[John Gilmore](https://en.wikipedia.org/wiki/John_Gilmore_(activist)). Gilmore was
an early Sun Microsystems employee and hardware (VLSI chip) designer, and
this part of his career made him financially independent. He's also
politically active, libertarian, and coined the famous saying 

> The Net interprets censorship as damage and routes around it.

Gilmore was running [Cygnus Solutions](https://en.wikipedia.org/wiki/Cygnus_Solutions)
(before Windows had a Ubuntu subsystem, there was Cygwin) in 1992, a company
that advocated Open Source and provided commercial support for it.

At Cygnus, people with similar interests were meeting and from that grew the
[Cypherpunks](https://en.wikipedia.org/wiki/Cypherpunk) mailing list, which
by 1994 had substantial readership.
The Cypherpunks pioneered software that used encryption to communicate, to
facilitate metadata-less anonymous communication and early anonymous digital
payment systems. 

**David L. Aaron** This clashed with the interests of the United States and
the [Five Eyes](https://en.wikipedia.org/wiki/Five_Eyes), which even back
then had zero interest in the promotion of publicly available, auditable at
the source level, free cryptographic protocols. The US came up with several
concepts of limited and "managed" (= crippled) encryption schemes, and
around 1995, 1996 appointed 
[David L. Aaron](https://en.wikipedia.org/wiki/David_L._Aaron) as a 
[Crypto Czar](https://nettime.org/Lists-Archives/nettime-l-9610/msg00079.html). 

That Czar was the person tasked with selling foreign governments on the idea
of crippling cryptography worldwide so that the US could better spy on them
and everybody else. The way he did that was, of course, that he argued that
unbreakable codes in the hands of terrorists would threaten every country's
security. Sounds familiar? It should, the tune is as old as
[Greensleeves](https://en.wikipedia.org/wiki/Greensleeves). 

**Clipper and other crippled crypto** One notable export from that time are
"export grade ciphers", versions of cryptographic protocols that have been
in some way or the other limited to key lengths of 40 Bit, which was even
back then completely useless. 

Another memorable fiasco of that time (1992-1996) was the 
[Clipper Chip](https://en.wikipedia.org/wiki/Clipper_chip). The Clipper Chip is a
hardware encryption/decryption device using a special cipher
[Skipjack](https://en.wikipedia.org/wiki/Skipjack_(cipher)), which was later
found [deeply flawed](https://en.wikipedia.org/wiki/Skipjack_(cipher)#Cryptanalysis). 

Each Clipper Chip would have a random bitstring as identity/key source, and
would encrypt messages, but also transmit the key to decode the message in
another, encrypted way that was supposedly accessible only to the
government. As such, the key implemented a secret government backdoor.

Relatively quickly, several [technical vulnerabilities](https://en.wikipedia.org/wiki/Clipper_chip#Technical_vulnerabilities)
in Clipper have been found, which allowed the use of the Clipper hardware in
a way that the key would not be recoverable (bypassing the backdoor), and
others, which allowed using the key recovery field by anyone, so that all
legit users of the chip would be exposed to attacks. 

**Steve Jackson Games** Then there is 
[Steve Jackson](https://en.wikipedia.org/wiki/Steve_Jackson_(American_game_designer)).
Jackson is a Geek, a Game Designer of, among other games, Role Playing
Games, and a Lego collector. He's known especially for creating and
publishing [GURPS](https://en.wikipedia.org/wiki/GURPS), "the" universal
role playing game ruleset. There exist GURPS supplements for about 
[every conceivable](http://www.sjgames.com/gurps/books/) theme, and a few that are
inconceivable or at least
[improbable](https://en.wikipedia.org/wiki/GURPS_Bunnies_%26_Burrows). 

There is also the GURPS combination challenge, in which you choose any two
random GURPS supplements and play in the resulting world. 

![](/uploads/EFF_Logo.svg_.png)

**The EFF** In 1990, the United States Secret Service raided the offices of
Steve Jackson Games and seized the manuscript for
[GURPS: Cyberpunk](https://en.wikipedia.org/wiki/GURPS_Cyberpunk) on the grounds of
it being a handbook for computer crime. Steve Jackson Games sued the United
States Government over this, and won the trial in 1993. 

That was made possible in part because of the 
[Electronic Frontier Foundation](https://en.wikipedia.org/wiki/Electronic_Frontier_Foundation),
EFF. Funding members were John Gilmore, John Perry Barlow and Mitch Kapor.
Barlow and Kapor had been subject to raids similar to Jackson, by
particularly technologically clueless government organisations. 

One of the first cases the EFF took on was the defense and litigation for
Steve Jackson (and next was the lawsuit on behalf of
[DJB](https://en.wikipedia.org/wiki/Daniel_J._Bernstein) against crypto
export controls)

**distributed.net and Deep Crack** The EFF was also involved in the funding
and execution of various 
[DES brute force challenges](https://en.wikipedia.org/wiki/DES_Challenges). 
The first one, called
[distributed.net](https://en.wikipedia.org/wiki/Distributed.net), used many
general purpose computers somewhere in the Internet to brute force the key
of a certain DES (56 bit) encrypted message. 
The [second DES Challenge](https://en.wikipedia.org/wiki/EFF_DES_cracker) 
used a machine named Deep Crack made from not quite 2000 special VLSI chips.

It was John Gilmore, who funded the quarter million US dollars to finance
this design and who also helped to design the actual hardware. Deep Crack
brute forced a DES key in only 56 hours, demonstrating that DES cracking was
too cheap and fast to consider DES still a secure chipher. 

This lead to AES challenge and the standardisation of the Belgian Rijndael
chipher as what we today call
[AES](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard). Today we
have the funny situation that DES is still unbroken (there is no faster
attack than brute force), but insecure (brute force is too easy), while AES
is
[broken](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard#Known_attacks),
but still considered secure.

**The Crypto Wars in Germany** A similar discussion on encryption and "key
escrow" took place in Germany. You can find a lot of the old discussions (in
German) at Förderverein Informationstechnik und Gesellschaft
([Fitug](http://www.fitug.de/)), for example
[here](http://www.fitug.de/debate/index.html). 
The [Rethorics of 1995](https://www.heise.de/ct/artikel/Hoert-ab-die-Signale-284236.html)
sound precisely like those today:

> Ginge es nach dem Willen von Innenminister Kanther, dürfte es in der
> Bundesrepublik "keine Nischen kontrollfreier Kommunikation für Verbrecher"
> geben

Around that time, a lot of political lobbying action took place, resulting
in a up to this day generally unchallenged ban on key escrow in Germany:

> Zwar hatte er für sein Quasi-Krypto-Verbot noch Rückenstützung durch ein
> anonym veröffentlichtes CDU-Thesenpapier aus den Kreisen des
> Bundeskanzleramts bekommen, doch schon nach der Verabschiedung des
> Multimediagesetzes im Bundestag ließ das Innenministerium die Katze aus
> dem Sack: Eine staatlich verordnete Schlüsselhinterlegung wird es vorerst
> nicht geben, dafür setzt man auf freiwilliges Hinterlegen.

which then resulted in the 
"[Eckpunkte der deutschen Kryptopolitik](https://hp.kairaven.de/law/eckwertkrypto.html)" 
under Otto Schily in 1999. 

**Today** These still stand, and ban backdoors. But
[Zuboff's Laws](http://www.faz.net/aktuell/feuilleton/the-surveillance-paradigm-be-the-friction-our-response-to-the-new-lords-of-the-ring-12241996.html?printPagedArticle=true#pageIndex_1)
are strong in the government:

- Everything that can be automated will be automated.
- Everything that can be informated will be informated.
- Every digital application that can be used for surveillance and control
  will be used for surveillance and control. 

And hence we now have government IT security institutions making the world
more insecure, because they hoard vulnerabilities in order to use them for
surveillance and control. 

Which is why even now, 20 years later, the Cryptowar is still a thing. 

It will never be over.
