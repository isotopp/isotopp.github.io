---
author: isotopp
title: "A01:2021 - Broken Access Control (en)"
date: 2021-11-23T23:34:33+01:00
feature-img: assets/img/background/schloss.jpg
tags:
  - lang_en
  - security
aliases:
  - /2021/11/16/a01-2021-broken-access-control-en.html
---

Translation by Lenz Grimmer, German version [here]({{<relref "2021-11-16-a01-2021-broken-access-control.md" >}}).

A 
[twitter thread by Christian Basl](https://twitter.com/ChristianBasl/status/1459851276817158151)
discussed the
[dissection of the "Learnu" app](https://zerforschung.org/posts/learnu/).
Basl wrote:
> Learnu operators say they have no expertise in IT security and have relied on outside consultants.
> As a result, Learnu came to market insecurely, unbeknownst to them.

In the discussion that developed, [Andreas Dewes](https://twitter.com/ardewes/status/1460240730698493957) took the view that
> Most startups I know go through a phase where IT security and compliance tend to take a back seat.
> As they get bigger, they start to think about it, partly because customers or partners demand certifications, e.g. SOC 2 or ISO-27001.

That's a funny statement in light of [OWASP A01:2021 - Broken Access Control](https://owasp.org/Top10/A01_2021-Broken_Access_Control/).
[OWASP](https://en.wikipedia.org/wiki/Open_Web_Application_Security_Project) is an NGO that aims to improve the security of applications and services on the Internet.
To this end, OWASP publishes a top 10 list of application security problems that is updated every year.

For 2021, compared to 2017, there have been the following changes:

![2021/11/owasp-mapping.png](owasp-mapping.png)

*Broken Access Control was #5 in 2017 and is now problem #1. 94% of the applications tested had some form of broken access control. The former #1 perennial problem Injection is now only #3.*

We see a classic example of this in another school application tested by the Zerforschung team:
[Scoolio](https://zerforschung.org/posts/scoolio/) was opened up by the researchers as follows: 

> One endpoint of the application programming interface (API) immediately caught our attention: `/api/v3/Profile/{ProfileID}`. 
> …
> When we find exciting API endpoints that have a version component (here `/v3/`), we like to try to change it sometimes.
> So in our case `/api/v3/Profile/{ProfileID}` became `/api/v2/Profile/{ProfileID}`.
> And tada: much more data!
> But our own data is boring - we already know it.
> So we also tried to enter a foreign ProfileID.
> And to our little amazement, but great annoyance, we were of course able to access the detailed data of that foreign ID.

This is a classic "A01:2021 - Broken Access Control" example. 
The application knows the identity of the user because it is registered in the app.
It does not use this information to authenticate and authorize the connection to the server.
And accordingly, the API can be used to access arbitrary user records instead of just its own. 

# Identity, authentication, authorization, auditing and accounting

A few terms:

- **Identity:** I am me.
  But I can't access the web or an API.
  An application has to do that on my behalf.
  To do this, that application uses a unique user identifier that represents "me" in the context of the application.
  But an identity with a unique identifier (a "principal") that represents me is first of all an assertion.
- **Authentication:** I can also prove this.
  If I can prove the claimed identity, then I am authentically me.
  I usually confirm my identity with a password and often with a 2nd factor (such as a changing secret number typed from a Google Authenticator).

The asserted and confirmed identity must also be **anchored** for some purposes, such as when that identity is to be tied to other rights or relationships in the real world.
For example, if I'm supposed to have a school affiliation and class affiliation in a school app, then it may be good if I can't just make an account for myself.
Instead, a teacher should look at it, ask me if I did it, and then assign me to the school and class.

- An asserted, confirmed identity anchored in the real world is then granted access rights.
  This is an **authorization**, it determines what this identity is allowed to see, write, modify and delete in the context of the application.
  We'll talk a little more about that below.
- What I then do in the application may have to be recorded for evidentiary purposes.
  For example, if the data I am accessing requires special protection, or if its change history needs to be documented.
  In a school context, for example, this could be my collection of performance records.
  A logbook in which accesses are linked to personal identities in a mandatory way that cannot be switched off is called an **audit log**.
- If I use services that cost money, then a special form of audit log must be kept.
  This audit log is the basis of accounting and shows which person has used which chargeable service and when.
  This log is part of **accounting**.

Much can be written on each of these topics, but we are to be primarily concerned here with *authorization* precisely because it is Topic #1 on the current OWASP list.
And because it does not only appear in the Zerforschis' 
[Scoolio](https://zerforschung.org/posts/scoolio/)
article, but once again in the 
[My Quick Test](https://zerforschung.org/posts/meinschnelltest/)
article:

> One of the first requests we notice is to `https://corona-api.de/persons/owner/{USER_ID}`, where `USER_ID` is of course the number of our account - e.g. `612341213acab23425251e21`.
> … [We shorten the URL]…
> We dare to try one more time and remove the / at the end of the URL. And tada:
> ```
> GET https://corona-api.de/persons
>```
> A list of people registered on the platform drops down to us.
> A total of almost 400,000 with all the data that is collected during a Corona test.

Zerforschung then goes on to demonstrate that they can merrily change their identity or anchoring (the school affiliation) in either case (and presumably without it ending up in an audit log), and that they can write data at will by issuing a Corona test result to 177-year-old Robert Koch.

# Authorization

## Verbs and subject-predicate-object (Who does what to whom?)

An application has an outside page.
This is a list of all URLs that are callable.
By this I mean not only the HTML web pages (some of which are interactive and can have parameters), but also the API that represents the server for an app on a phone or in a browser.
The list of all these URLs is like a list of verbs:
Do words that can be used to give commands to the application - "show me", "find me", "change me", "delete me".
As in any sentence, there is a subject - who commands? - and an object - what is being manipulated by the verb?

We can write this down in German:
"Kris wants to find all the students at the Heinrich Heine School in Heikendorf."

Or as a triplet:
(Kris, "find all", "Heinrich-Heine-Schule (Heikendorf)")

Or as a table, with the subjects as rows, the objects as columns, and the verbs where the action in question is allowed.
This is then a matrix of "Who may do what?".

## Role Based Access Control

We then see that the table quickly becomes large, and will start grouping the subjects.
Subjects with the same rights we group together, in a *role*, and name them (for example *students of HHS*).
Objects can be grouped in the same way.
We get *Role Based Access Control*, *RBAC*:

We can thus give fixed rights to certain subjects, or roles. 
However, we still need to allow many relations:
"Students of HHS can make contacts with other students of HHS."
and extra, and different from it
"Students of the Max-Planck-Schule, Kiel can make contacts with other students of the MPS."

Obviously, this is not enough in this context - but for many applications it is already sufficient.
Namely, whenever the internal structure within the application does not need to be segmented further.

## Attribute Based Access Control

Often one wants to formulate rules that match properties of subjects and objects.
For example, I can simplify the access rules for student contacts to allow contacts if the calling student and the called student attend the same school.

- "HHS students can make contacts with other HHS students."
- "MPS students can make contacts with other MPS students."
- …

all these RBAC-Rules become

- "Student A can make contact with Student B, if `A.school_id == B.school_id`"

so if student A and B have the same value in the attribute `school_id`.

So, access rights are now defined by attributes of subjects and can thus be greatly simplified.
Of course, this requires that I identify the security-relevant attributes and control changes to those, because otherwise the protection is ineffective.

Example: If a student can change his `school_id` at will without control, then a comparison `A.school_id == B.school_id` is ineffective.

# What does this mean for application developers?

As an application developer, I use a toolkit to write web applications and APIs.

1. I need to know what my application's outer surface is, i.e. which URLs are allowed with which parameters.
   This is not difficult.
   My toolkit almost certainly has a function that tells me this (`flask routes` or similar functions are present everywhere).
   This is my list of verbs.
2. The list of parameters of each of these callable pages are the objects in my security model.
3. I need to identify my users (i.e., assign them unique identifiers) and authenticate them (i.e., they need to prove the claimed identity).
4. The list of these users is then the list of my subjects.
5. I now need ACL, RBAC or ABAC rules that define "who can do what to whom" and express this in my application's access control framework.

This is not hard, and it is, above all, necessary work.
Not only for legal and compliance reasons, but also because this is part of an application's data model:
As a side result, this produces a transaction model, i.e. a diagram of how the records of my application can be changed by calling methods.
So not only am I slaying all compliance, many data protection, and all security obligations, but I've documented the entire data lifecycle of my application with a state transition diagram,
that shows both developers and business analysts in a generally understandable way what the heck we're actually doing here and how we're modeling it.
