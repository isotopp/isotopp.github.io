---
author: isotopp
title: "The Matrix Trashfire"
date: "2023-12-05T05:06:07Z"
feature-img: assets/img/background/rijksmuseum.jpg
toc: true
tags:
- lang_en
- chat
- remote first
- work
---

For reasons, I tried to evaluate the distributed Matrix chat and their clients.
That did not work out very well.

# Onboarding experience

I was told that the default Matrix chat client is called Elements, so I looked it up on the iOS App store.
Unfortunately, there are two, "Element" and "Element X."
No explanation is given, and no preference is stated.
"Element" is categorized business, "Element X" is in "Social Networking."
Are they not the same?
They seem to be from the same company, though.

![](/uploads/2024/02/element-01.jpg)

*Element and Element X in the app store. Which one to use?*

Ok, let's open the descriptions.
They are identical, except for one sentence at the start:
"Element X is the future Element."
So it's a beta?
Why is it not labeled as a Beta?

On the desktop, going to [Matrix.org](https://matrix.org) plus two additional clicks take you to
[the client page](https://matrix.org/ecosystem/clients/), which offers

![](/uploads/2024/02/element-02.jpg)

*The client page offers you, among others, both clients and also states which is available on what platform.*

So apparently "Element X" is beta and not yet available on all platforms. I open the macOS App Store and...

![](/uploads/2024/02/element-03.jpg)

*macOS does not offer Element, only Element X.*

Apparently matrix.org lied to me. 
Element X is available on iOS and macOS, Element is not.

Ok, let's install Element X and try:

![](/uploads/2024/02/element-04.jpg)

*Element X wants me to sign in to matrix.org. There is no 'sign up' Button. There is no sign-up menu.*

The client wants me to log in to matrix.org. There is no button to make an account. There is no menu to make an account.
There is zero onboarding for new users.

Ok, let's go to matrix.org again, and see.

![](/uploads/2024/02/element-05.jpg)

*The matrix.org Website is not very helpful. But when you notice the burger menu, there is actually a "Try Matrix" button.*

The matrix.org website is a very empty clean screen that is not very helpful. There is a burger menu, though, 
and if you open it, you get a "Try Matrix" button.
This leads to another screen that tells you to use your organizations server instance (What organization? I'm alone!),
or install a server,
or choose a public server.
If you opt for Public Servers, you land here:

![](/uploads/2024/02/element-06.jpg)

*matrix.org server instances, alphabetically sorted, with little additional information.*

Matrix.org is conspicuously absent from this list.
The rest I do not know anything about.

I can now research what server instance I want to join.
Unfortunately, I do not get information about what their country is.
I can't see if they are subject to GDPR rules.
I don't know if they are owned by a company or run by a single private person.
There is no indication how many users they have.

I can dig through their privacy policies and rules, except that some don't provide any.

Scrolling down, I end up with the option to onboard to this:

![](/uploads/2024/02/element-07.jpg)

*Servers marked as vulnerable, unavailable and with profanity in their name.*

Why in heaven or earth would anybody put unavailable or vulnerable servers into an onboarding listing?
Isn't this supposed a "secure" messenger?

# Trying to use it, nontheless

I made an "isotopp" account at [tchncs.de](https://chat.tchncs.de/#/login).
The password is generated and stored in Bitwarden.
A validation mail is sent to a unique address at koehntopp.de and arrives.

I try to login not being validated, using Bitwarden.
The login is rejected.

I validate the email.
The server says I am validated.

I try to login, using Bitwarden.
The login is rejected.

![](/uploads/2024/02/element-09.jpg)

*I am trying to recover the password for the account which I just validated, using the email from the verification mail.
The account is unknown.*

I click on "forgotten password", and supply the mail adress the validation mail was sent to.
"This email address was not found."

Okay, since my account does not exist, I create it again:

![](/uploads/2024/02/element-10.jpg)

*I recreate my account, using the same mail address. As you can see, the first registration mail still is in the account.
I take the validation URL, which is longer than 80 characters, and use it to successfully validate, again.*

I create the account again, using the same parameters.
The account validation mail is sent to my address.
The old account validation mail is also still in the account.
I take the new URL, which is longer than 80 characters, and use it to successfully validate my account, again.

This time I accidentally left the "create account" window open.
This window is now suddenly logged in.
Turns out, you MUST NOT, UNDER ANY CIRCUMSTANCES, close the "create account" window until the account is validated,
or it is simply not created.
This is not stated anywhere.

To confirm the account works and the password in Bitwarden is stored successfully,
I log out and log in again.

I get this:

![](/uploads/2024/02/element-11.jpg)

* **Unable to verify this device**
It looks like you don't have a Security Key or any other devices you can verify against.
This device will not be able to access old encrypted messages.
In order to verify your identity on this device, you'll need to reset your verification keys.*

What does that even mean?

# Trying Element X with my account

Starting Element X, it tries to onboard me to Matrix.org.
I select "Change Server", and get a form field where it says "matrix.org".
I am overwriting it with "chat.tchncs.de", which supposedly is my server.
At least that is what it says in the web client.

![](/uploads/2024/02/element-12.jpg)

That is not accepted.

I take the URL from the browser and paste that instead.

![](/uploads/2024/02/element-13.jpg)

That is also not accepted, but I can learn more.
I click.

![](/uploads/2024/02/element-14.jpg)

The what?

Turns out, while the Chat is running on "chat.tchncs.de", this is not the "Identity Provider."
That one is called "tchncs.de".
You only learn this when you open your config menu in the web chat and look at Identifer shown there.

![](/uploads/2024/02/element-15.jpg)

Once you enter this, Element X and the web chat get hectic.
There is a new client, and both clients want to authenticate that the new device is legit.

![](/uploads/2024/02/element-16.jpg)

For that purpose, they display a set of Emojis, which look differently in the web client and the application,
and ask me if they are the same.
Helpful Emoji names are shown under the Emoji, and they are identical.
I simply click yes.

After that, both clients can see my Chat, but the Element X Client still has no access to any chat history.
That is, because the client is unverified (so is the web client).

When I close any client, I have to re-login, re-compare the Emojis, and all chat history is gone.

# After onboarding

Why have I been trying this?

![](/uploads/2024/02/element-08.jpg)

*A friend was trying to use a Matrix messenger on their phone, and waited 9 hours for this to complete.*

A friend of mine was trying to re-install a Matrix messenger on their phone, and landed on the screen above.
This hung for 9 hours without any message or failure indication.
The application cannot detect if somebody is using the wrong recovery key for a different account.

The friend tried to use an Android application, but the application was complaining about the account not being verified.
That is, the mail address in use was not confirmed, and for that reason the client would not be showing any chats.
At the same time, these chats were being sent to the unconfirmed mail address,
unencrypted,
as a reminder that he was missing out.

According to him, you can't delete a half-made unconfirmed account.
You also can't rename an account.

Apparently, you cannot create invite links for private chat rooms,
only invite people.
To do that, vector.im uses the very same dark patterns that LinkedIn uses to convince you to share your address book.

With the unique mail-address used to sign up to Matrix, I am unfindable because only Matrix uses this specific mail address.

Outside of Element, there are very few clients, most of them very old and not being updated within the last few years.

All in all, this is a mess, and my recommendation is to avoid Matrix for at least two years.
It is not secure, it is actively user-hostile, and looks not well managed.

This is a project in severe need of management changes, a thorough UX evaluation.
The design needs changes that make onboarding and usage smoother, encourage secure workflows,
keep accounts available, and encourage secure practice.
It also needs careful curation of servers and clients.
At the moment it is a trash fire.

# Matrix responds

Added on 14-Feb-2024:
People at Matrix.org and Matrix developers have picked this up and responded in a very constructive way.
They cannot address all things because they are not in the realm of Matrix, but part of Element.
So far, no responses from Element.

[Matrix writes](https://mastodon.matrix.org/@matrix/111924190165706931):

![](/uploads/2024/02/element-17.jpg)

> well, this is a trashfire indeed.
> Thanks for writing this up.
> You've caught Element in the middle of their migration to Element X, and there's a lot of legit feedback here:
> - Both E & EX should be in the macOS app store.
> - EX should clearly be labelled WIP in appstores.
> -It's a mistake that matrix.org hurls people to servers.joinmatrix.org (which is not run by us); 
>   until recently it defaulted to matrix.org for convenience.
> - Keeping the "create account" window open is a pure bug.

[The continue](https://mastodon.matrix.org/@matrix/111924227099676114)

![](/uploads/2024/02/element-18.jpg)

> - Verification UX in Element is a disaster, and being reworked in EX:
>   [Github link](https://github.com/element-hq/element-meta/blob/develop/docs/FTUE.md)
> - Element Android failing to compute a recovery key is clearly a bug too.
> 
> Your other complaints about Element UX (e.g. user discovery by email;
> specifying the server URL) are also very familiar.
> 
> It's not true to say vector.im uses "the very same dark patterns as LinkedIn" for contact discovery though;
> [Github link](https://github.com/matrix-org/matrix-spec-proposals/blob/hs/hash-identity/proposals/2134-identity-hash-lookup.md)
> explains how it works (and is strictly opt-in).

Matrix Director of Program Development [Thibault A. Martin responds](https://mamot.fr/@thibaultamartin/111924256997285624)

![](/uploads/2024/02/element-19.jpg)

> Hej @isotopp I'm one of the maintainers of the matrix.org website.
> 
> Your post provides a very valuable perspective. 
> I gathered the following gripes that we can address on the website itself in this issue: 
> [Matrix.Org Issue 2178](https://github.com/matrix-org/matrix.org/issues/2178)
> 
> If you have the time to let me know if I got things right, 
> that would be very useful!

Thanks for picking this up, people!
I very much hope that Matrix and Element eventually turn into something useful.
