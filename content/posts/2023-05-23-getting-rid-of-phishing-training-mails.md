---
author: isotopp
title: "Getting rid of phishing training mails"
date: "2023-05-23T01:02:03Z"
feature-img: assets/img/background/schloss.jpg
toc: false
tags:
- lang_en
- security
- spam
---

Just like your work computer is being infested with corporate malware as to prevent it from being taken over from other people's malware,
your account is also being spammed with corporate malware spam as to prevent it from being taken over by other malware spam.
And just like corporate malware [increases your machine's attack surface]({{< relref "/2018-06-18-websense-dlp-gives-instant-root.md" >}}),
because it is [badly written]({{< relref "/2017-10-20-aslr.md" >}}) and running with privileges,
corporate spam is a useless [nuisance](https://publikationen.bibliothek.kit.edu/1000119662) that 
[doesn't do what it is supposed to do](https://blog.lukaszolejnik.com/solving-phishing-is-not-simple-can-anti-phishing-training-make-it-even-worse/).

Of course, working in an enterprise, you will be subjected to such campaigns anyway.
So the best outcome for you would be to identify a phishing training campaign when it runs the first time,
and then upgrade your filters so that you will never be bothered again.

The good news is that all phishing training campaigns have automatically detectable traits,
mostly X-Header lines, because the campaign needs to be able to deliver quantifiable results to the corporate overlords that pay for it.
And of course, we can filter for these.

# The X-Header

What X-Header actually is being used depends a lot on the Phishing Training service provider your company is using.
It may be something such as `X-KnowB4` or `X-PhishMe` or similar.
To find out what it is, you need to check the actual raw message content.

In Mail.app, select the message you have identified as phishing training mail, and select
`View -> Message -> Raw Source (⌥⌘U)`.
Then check for lines that start with `X-` in the header that identify the training provider or reference "Phish".

![](/uploads/2023/05/phish-06.png)

*See Message Raw Source in Mail.app.*

In Outlook for Mac, select the message you have identified as phishing training mail, and select
`View Source`.
Then check for lines that start with `X-` in the header that identify the training provider or reference "Phish".

![](/uploads/2023/05/phish-07.png)

*See Message Raw Source in Outlook for Mac.*

The line you are looking for might be looking like this:

![](/uploads/2023/05/phish-08.png)

*In our case, the line identifying the phishing training mails looks like `X-Phishme: Phishing_Training`.
In fact, we only care about the presence of the `X-PhishMe` header line and the actual value after the `:` is completely irrelevant.

This header, in the exact spelling shown, is what we want. It is best to copy and paste it to prevent spelling errors.

# Mail.app

I'm on a Mac, and for a long time my corporate email was on Gmail.
Unfortunately, Gmail cannot filter on arbitrary X-headers, and registering an application to OAuth against corporate mail is complicated.
But Apple's `Mail.app` comes preregistered, was allowed, and can filter.

![](/uploads/2023/05/phish-01.png)

So I can just sacrifice another 200 MB or so to the God of Better Mail and get proper filters in return.
In any case, `⌘-,` ("Cmd-Comma") gives me the `Rules` menu, and from there I can `Add Rule`.

![](/uploads/2023/05/phish-02.png)

You would want to add a filter on the Header-Line `X-PhishMe`.
For what, we want to create a rule that looks like this:

![](/uploads/2023/05/phish-03.png)

*This is what our filter should look like, but it can't. 
That is, because the first time around Mail.app does not know about this `X-` header.*

Currently, your Mail.app does not yet understand this particular X-Header, so when you want to create this rule,
you need to `Edit header list...`.

![](/uploads/2023/05/phish-04.png)

and then add the header to the list of known header lines:

![](/uploads/2023/05/phish-05.png)

Only now can you create the filter as shown above.
In this example, I have moved the message to the Trash Bin, but you can choose any target you want.
Whatever you do, make sure that the last action you choose is "Stop evaluating rules", then hit OK.

**Now drag the rule up so that it becomes the first rule in the list.**

You are done.

# Outlook

In Outlook for Mac, also hit `⌘-,` ("Cmd-Comma") and choose `Rules`.
Create a new rule and make sure it is enabled:

![](/uploads/2023/05/phish-09.png)

The rule should look like this:

![](/uploads/2023/05/phish-10.png)

That is, move the message to a folder of your choice, and make sure to enable "Stop processing more rules".
Make sure the rule is the first one in the list.

You are done.

# Summary

All phishing trainings need to have uniquely identifiable marks in order for the training campaign to produce the required key performance indicators.
We can find these labels and use them to filter.
Our mailer will automatically ignore subsequent runs of the phishing training, for our peace of mind.
