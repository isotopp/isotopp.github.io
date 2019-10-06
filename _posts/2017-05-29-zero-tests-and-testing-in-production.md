---
layout: post
status: publish
published: true
title: Zero Tests and Testing in Production
author-id: isotopp
feature-img: assets/img/background/rijksmuseum.jpg
date: '2017-05-29 05:11:51 +0200'
tags:
- computer
- testing
- lang_en
---
There is a pretty cool Twitter thread by Sarah Mei, starting at 

![](/uploads/2017/05/Bildschirmfoto-2017-05-29-um-05.49.22.png)

[Thread](https://twitter.com/sarahmei/status/868928631157870592)

I spammed into this at [/14](https://twitter.com/isotopp/status/869030484935835648).

[@samphippen](https://twitter.com/samphippen/status/868918641189949442):
> Big secret: there exist vast tranches of business contexts in which having
> literally zero tests is fine.

[@sarahmei](https://twitter.com/sarahmei/status/868928631157870592): 

> Been thinking about this. Conventional wisdom says you need a
> comprehensive set of regression tests to go green before you release code.
> /1 
>
> You want to know that your changes didn't break something elsewhere in the
> app. But there are ways to tell other than a regression suite. 2/
>
> Especially with the rise of more sophisticated monitoring and better
> understanding of error rates (vs uptime) on the operational side. 3/ 
> 
> With sufficiently advanced monitoring & enough scale, it's a realistic
> strategy to write code, push it to prod, & watch the error rates. 4/ 
> 
> If something in another part of the app breaks, it'll be apparent very
> quickly in your error rates. You can either fix or roll back. 5/ 
> 
> You're basically letting your monitoring system play the role that a
> regression suite & continuous integration play on other teams. 6/ 
>
> This strategy assumes a lot of things, starting with an operational
> sophistication that most dev teams don't have. There's more, as well. 7/
>
> It assumes the ability to segment users, show each dev's
> change-in-progress to a different segment, & allocate error rates per
> segment. 8/
>
> It assumes sufficient scale that variations in a segment's error rates
> will be statistically significant. 9/ 
>
> And perhaps most unusually, it assumes a product organization that's
> comfortable experimenting on live traffic. 10/
>
> Then again, if they already do A/B testing for product changes on live
> traffic, this is just extending that idea to dev changes. 11/ 
>
> But if you can make it work, getting live feedback on changes you \_just\_
> made is amazing. 12/ 
>
> This is one of the reasons why it's critical for operations & development
> folks in an organization to work reeeeally closely together. 13/ 
>
> An adversarial relationship between dev & ops kills this. You can't even
> start if responsibility for 'quality' is siloed on one side. 14/ 
>
> Certainly hybrid approaches are possible, where there's a small, fast test
> suite hitting critical code, & the rest is monitored in prod. 15/ 
>
> There are reasons beyond correctness & regressions for writing tests, as I
> wrote about a few weeks ago.
> [https://www.devmynd.com/blog/five-factor-testing/](https://www.devmynd.com/blog/five-factor-testing/)
> 16/ 
>
> I described the five reasons we write tests: correctness, regressions, as
> design support, as documentation, and as refactoring support. 17/ 
>
> Even in a world where you delegate correction & regressions to production
> monitoring, there are still reasons to write tests. 18/ 
>
> But you could start to imagine a world in which we get all 5 of those
> benefits via mechanisms _other_ than automated tests. ? 19/
>
> The writing and running of tests is not a goal in and of itself - EVER. We
> do it to get some benefit for our team, or the business. 20/ 
>
> If you can find a more efficient way to get those benefits that works for
> your team & larger org, you should _absolutely_ take it. 21/ 
> 
> Because your competitor probably is. 22/ 
>
> One final note: delegating regressions to production monitoring is what
> "move fast and break things" means, if you take it seriously. 23/ 
> 
> For a long time I dismissed MFaBT as a silly brogrammer slogan. Move fast
> = no tests, break things = how would they even know? CHAOS! 24/ 
>
> Paying attention to the ops community, though, radically shifted my frame
> of reference. Now I get it. It's doesn't have to be chaos. 25/ 
> 
> Yet [another example](https://twitter.com/__apf__/status/867751153026482177)
> Maybe someday I'll outgrow it... 26/fin

I spammed this at her /14, thanks
[@s0enke](https://twitter.com/s0enke/status/868935676993130496) and Harald
Wagener.

> Dev and Ops have conflicting goals, success metrics, even if their tools
> are the same. Dev is successful if there are new features, new /1 
>
> best cases. Ops is an infrastructure job. They are successful if there are
> few outages, and recovery is quickly, success is measured by /2 
>
> how worst cases are handled. Conflict between Dev and Ops heavy orgs comes
> from conflict in these metrics. Ways around that exist, /3
>
> and they relate to making testing in production safe, and to the two
> questions before each rollout. /4
>
> 1. "If you break it, will you even notice?" What are the metrics relevant
> here? What are your consumers, to whom are you a provider? /5 
>
> The answers should resolve to people, not subsystems. Because it's people
> you need to speak to to get answers. /6 
>
> and 2. "If you break it, can you fix it?" That is, of course not, not in
> all cases. So who needs to be available when you roll out? Again,/7 
>
> this resolves to people. It's a mind hack: these are worst-case related
> questions, but you want the dev doing a rollout asking them. /8 
>
> Testing in production: Making failure survivable.
> [https://www.slideshare.net/isotopp/go-away-of-i-will-replace-you-with-a-little-shell-script-english](https://www.slideshare.net/isotopp/go-away-of-i-will-replace-you-with-a-little-shell-script-english)
> …, slide 19: Separation of rollout and activation, a/b testing /9
>
> Experiment framework = running old and new code side by side. Requires
> ways to deal with persistent data changes (old/new). /10
>
> Also requires fast monitoring, SLO for monitoring lag, monitoring lag
> *shown* on the screens, and no rollout if monitoring actually lags./11
>
> Because if it breaks you wouldn't notice. Also, people. So chat needs to
> be up and running, because if it breaks *you* can't fix it. /12 
>
> Testing in production = fast rollouts = small changes. Small changes =
> fast debug = safe rollouts = making testing in production safe./13 
>
> (slide 32) It's kind of a lock-in. To test safely in production you need
> to test in production, a lot. /14
>
> Management is scared. How to deal with that? Give them controls. Predict
> biz behavior, measure outage, track delta. /15 
>
> TheN create a budget for downtime, (slide 34). When outage \> budget, too
> much risk. Need to check process. /16 When outage \< budget, "are we
> moving fast enough?" Are we becoming complacent? Are we taking enough
> risk? /17
>
> Also, blameless postmortem - if you break production, I did not teach you
> properly, they did not have your back. It's not you, /18 
>
> it's the process. We need to fix the process, not take it out on a person
> (slides 32, 34, 35). /19 
> 
> Testing in production is a good thing, not just for new things, but
> always. Never shut anything down cleanly (slide 46). You need to be/20
>
> able to trust your safeties. Exercise them. Moves understanding from
> head (knowledge) to heart (experience) to guts (intuition) /21 
>
> Design principles are affected, too. Simplicity is a value (slide 51). If
> you can't be simple, be obvious. See
> [https://www.slideshare.net/isotopp/boring-dot-com-the-virtues-of-boring-technology](https://www.slideshare.net/isotopp/boring-dot-com-the-virtues-of-boring-technology),
> /22
>
> and
> [https://www.slideshare.net/isotopp/boring-dot-com-the-virtues-of-boring-technology](https://www.slideshare.net/isotopp/boring-dot-com-the-virtues-of-boring-technology)
> for simple, boring, obvious. Stickers available. :-) /23 
>
> That's an engineering/developer strain of qualifications that matches
> feature dev. Hence me calling them Infrastructure Devs, /24 
>
> Google calling them SREs instead of Operations people. Operations is not
> dead, it became an engineering discipline. /25
>
>  It matches feature dev, and will always somewhat clash with feature
> development. Devops helps, SRE helps, but conflict fundamental./26 
>
> end Addendum: 2012 version of this in
> [https://www.slideshare.net/isotopp/8-rollouts-a-day](https://www.slideshare.net/isotopp/8-rollouts-a-day)
> and
> [https://www.youtube.com/watch?v=rzU1UtUpyTI](https://www.youtube.com/watch?v=rzU1UtUpyTI)
> /27, really the end

Both Testing in Production and Test Driven Development, have a similar goal - 
they want to make failure survivable. One by building structure around
failure that allows fast and low-loss recovery, the other by trying to avoid
failure. 

Testing in Production is more agile, and way faster, if you can pull it off.
That is, finding a way to make failure survivable and low-cost. 

If you manage this, payoff is manifold - not you do you save the overhead of
formal TDD, you also gain a culture in which recovery procedures are
exercised, well known, understood to be working and in which the difference
between an slight Oops and a critical situation is understood at the
experience/intuition level. This creates much more fluid, resilient and
un-excited operations.

There are things and pieces where Testing in Production cannot be made safe.
In such an environment (or such parts of an environment) not failing in the
first place is crucial. Nobody understands that better than Ops persons with
an intuitive grasp of critical failures.
