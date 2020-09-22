---
layout: post
status: publish
published: true
title: Friday Deploys, and other harmful BOFH memes
author-id: isotopp
feature-img: assets/img/background/rijksmuseum.jpg
date: '2017-07-03 09:01:29 +0200'
tags:
- computer
- lang_en
---
![](/uploads/2017/07/friday-deploy.jpg)

*Glorifying toil, glorifying organisational ossification*

So somebody posted this on G+, and it's a classic example for a thing that I
classify as [BOFH](http://bofh.bjash.com/) memes. That's a group of memes
and stories from operations people from a time past glorifying the toil and
nastiness of operations.

This is going away now, for some time, and people identifying with BOFH
thinking or finding it funny need to change, or go out of job. That's also
happening, rather quickly, and I have a talk about this
([Slideshare](https://www.slideshare.net/isotopp/go-away-of-i-will-replace-you-with-a-little-shell-script-english),
[Youtube](https://www.youtube.com/watch?v=e0CCv7pSK4s)). 

The direct answer to the image above is 

> If you are having problems deploying on a Friday, you will have them at
> any time of the week. Your processes are broken.

People objected, confirming what I said.

One commenter:

> An ex manager would deploy anything, often while drunk, at any time of the
> night and then bully me to fix it despite not being on call because
> probably he was of the opinion that bullying immigrants into working out
> of hours without compensation was fine. After the company got rid of him
> I'm definitely saner. At least I my chances of getting compensation when
> higher if he broke shit monday to thursday during the day.

There's your broken process right there (and broken management, to boot).

That needs fixing, the Fridays are just a symptom. One other commenter:

> sure but there is no such thing has a 100% process and so unless you have
> a 24/7 engineering team I would still avoid Friday deployments.

There you are. If it is of such importance that you need 24/7 operations,
you better provide 24/7 ops. If it is not actually that important, who
cares?

It is not that binary, but rather about risk management. That's primarily
about dealing with the problem, not pushing it away. So what could be done
about it? The one thing that does not work is _Heroism_, but that's one
thing that the strain of BOFH thinking glorifies. Dev breaks things, Ops
intervenes and fixes them, in heroic acts of emergency changes, during
impossible times and adverse circumstances. 

That's of course destructive bullshit. Heroism, _the solitary deeds of
individuals saving the day_, is a problem in operations, because it does not
scale in space and time. If you create an organisation that rewards heroism,
it will in time require heroism to run smoothly. That's organisational
abuse, grind and toil, and in the end, personnel churn. 

You can't build sustainable organisation on that, let alone growing
organisations. The Heroism that is part of the BOFH meme and this culture is
toxic to the people identifying with it, because it promotes Heroism, and
hence self-abuse, toil and eventually burnout. Heroism needs urgent fixing.
It is not the heroic act that improves the situation and helps the business
grow. It's the postmortem, and the changes that come out of it, which
ideally should make the entire class of problems impossible in the future,
_without slowing down the ability to change and adjust_. 

That last half sentence is important, because the other thing that does not
work dealing with risk is _Obstruction_ and _Ossification_. An IT
organisation exists, in part, to give management options. A part of their
mission is to create mechanism on which management can then implement
policy, use the mechanism to set a direction for the entire organisation to
sail, smoothly. Being able to execute change safely and smoothly is
therefore a fundamental, basic function of any IT organisation. 

The obstruction that is part of the BOFH meme and culture is toxic to the
organisation, because it idealises a way of thinking that is hostile to the
other parts of the organisation ("us" vs "them"), vilifying other
departments and looking down on their abilities. It also sees change as bad
and dangerous when it is necessary to sustain the business. Together, these
things and the ideology of Heroism encourage a way of thinking Operations as
something separate, that exists outside and against the rest of the
business. That's an entirely destructive and non-constructive mindset, and
that's why you need to end it in you and in your organisation.

## Enabling change

So how could you enable your organisation to sucessfully deploy new code at
any day and time of the week?

You could introduce technology such as _CI/CD pipelines_. If you push
something into a certain branch ("production" would be a good tag), it would
run a build, synthetic tests where necessary and then roll it out. 

You could introduce technology such as _separation of rollout and
activation_. Code that is being rolled out as new is never actually
executed. Only when you activate a feature flag, it is active for you, or
for a small subset of users, which you can grow incrementally until is it
full on. Then the old, dead code can be removed (or you keep it around
intentionally).

You could _improve monitoring technology, and put service level objectives
(SLO) on it_, such as requiring that the monitoring lag between an event
happening and it showing up in monitoring is below some threshold ("\< 15s"
or similar). This SLO should be shown on the graphs as well, together with
the actual metrics. This will give people making changes visibility on the
impact of the change.

You could _change the organisation and align incentives_. Those who write
code need to be made responsible for rolling out this code. This requires
that they understand the relevant monitoring metrics, and care about them
being complete and fast. It also requires that they understand the larger
operational context of the subsystem they are working on, the "_provides
to_" and "_relies on_" relationships and other contracts they have. It will
also naturally put the pain where it can affect the required changes
directly. Which is another reason why you should also alert product owners
together with other people - it makes sure, the right alerts are being
generated, actually service-relevant alerts, not too many, not too few.

You should _change the organisation so that it favours many small changes
over large and complicated ones_. This is done with the suggestions above,
taken together and implementing them. It is also done by _doing away with
formalized "Change Advisory Boards"_, where people who know little about the
actual changes and who are also not directly affected by performing them are
put in control of deciding which changes are being made when and how.

Processes are about people talking to each other about who is going to do
what and when and why, and how. The first thing that has to be done is
getting the people who are actually going to do something at all to speak to
each other, and the classic CAB is the antithesis of this.

And finally, you could install management controls that actually set
realistic expectations and reward controlled risk taking. A "100%
availability" objective is never realistic. Realistic expectations focus on
realistic availability, things like "99.99%, because our production context,
upstream and downstream dependencies, are actually even less reliable" or
similar reasoning applied. They focus on recovery procedures and being able
to execute them effortlessly. They focus on resiliency and exercising
resiliency systems regularly in real production circumstances, so they
promote testing in production and making it possible safely wherever and
whenever possible. And finally, they work against the BOFH meme and mindset,
because that place is precisely where you do not want your organisation want
to be.

This whole set of stories needs to die in a fire.
