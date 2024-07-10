---
author: isotopp
title: "Operations Review Meeting (english)"
date: "2024-04-18T05:06:07Z"
feature-img: assets/img/background/rijksmuseum.jpg
toc: true
tags:
- lang_en
- erklaerbaer
- work
---

[In Deutsch]({{< relref "2024-04-18-operations-review-meeting-deutsch.md" >}})

Monday Afternoon, "Operations Review Meeting".

Time to nap in front of the Zoom,
because a bunch of management persons with a non-technical background 
will show each other snore-inducing powerpoint slides over a vidconf for 90 minutes.

Fred Whatshisname, in charge of Dunnowhatchatmacallit,
relates that the number of P1 incidents for this quarter is up by 17 percent, but the TTR is down a lot,
so this is good, right?

The what? Bringing up the corporatese abbreviation lexicon: TTR is the the Time To Resolution.

Okay, Fred.
Time to stage an intervention.

Seventeen percent is a familiar number. So in Q4 you had six P1's and now you have seven?

Fred acknowledges that.

Good. If it was 100 in Q4 and 117 in Q1, you'd be flipping burgers now.

So Fred, this is a tiny integer.
Why don't you turn off the screen sharing,
and tell us what actually happened these seven times 
that we had a loss of prod because of the Dunnowhatchatmacallit service being down?

Fred does not know.
He is not technical.
He joins Jane into the conf.

Jane knows.
Jane is also not technical, she has the same type of MBA that Fred has,
but the critical difference is that Jane carries a pager, because Jane cares.

When her team wakes up, she wakes up and that is how she knows.
She actually **understands** in a very visceral and personally painful way.
(I edited Joe to Jane, because 80% of the time it's a Jane that cares.)

Jane relates
that three of the Q4 incidents and four of the Q1's are related to a problem with password provisioning 
between vault and the databases.
It happens that some authentication token expires after a re-deploy,
and is not refreshed as part of the re-deploy.

Now, this is interesting, way more interesting than the number hocus-pocus by Fred.

Jane further relates
that the TTR is down because they now know about the problem
and have it as part of the deploy checklist, and the incident resolution documentation.

When asked why the problem it not fixed at the source,
Jane relates that this is an operations problem and not part of the feature development backlog,
and hence has a low priority.
Low priority feature requests never make it into the actual sprint, ever, though.

So, Jane,
what you are telling us is
that we have downtime that costs us money in lost business, 
because we underprioritise operations by not taking them seriously.
And by not putting operations feedback into the backlog prioritization process?

Jane agrees in this annoying noncommittal corpspeak lingo we all hate.
She also mentions that operations is understaffed,
because the three more people needed have been denied
and the other two have been downgraded from Senior to one Regular and one Junior.

The company prefers to spend money on developers, operations is just a cost center.

The company considers moving to AWS, because operations is hard,
and they want to focus on the business.

The truth is that they have no idea how their business processes actually work on the ground,
and do not care, and soon they will understand even less of that, 
because that is how things go from here.
All the time.

This happens in enterprises all around the world, and that is how the suck accumulates.
This way or one of a gazillion ways that are actually isomorphic to this experience.
