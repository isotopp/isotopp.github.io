---
author: isotopp
title: "Discord Nitro Spam and 2FA"
date: 2021-11-30T08:29:00+01:00
feature-img: assets/img/background/schloss.jpg
tags:
- lang_en
- security
- identity
- minecraft
---

This morning the Discord account of my son started to send "free nitro" spam to his friends on the friend list, and to some Discords he was a member of.
He had 2FA (Google Authenticator) on the account.
That fact alone made this a recoverable failure.

My son is playing minecraft, has a friend list of around 100 fellow players, and is member of around 40 Discords.
He also connected his Discord to Spotify, YouTube and other services, and he authorized around 12 application services, mostly Discord/Minecraft bot services.
It is pretty safe to say that his Discord account is very valuable to him, and plays a central part in his pandemic coping.

The spam was sending messages to all his friends, and a few Discords, impersonating him.
It was not acting as a bot, or even one of his own bots. 
That means the spammer had accessed his account and identity.

## Recovery was easy, thanks to 2FA

Changing the account password is a 2FA protected operation, and invalidates all other login tokens.

That means, only a person having access to his cellphone can 2FA and change the password - him (or, this time, me).
It also means his Desktop client, all spammers impersonating him and everyone else is logged out.
This stopped the Spam dead immediately.

## How the spam works

The "free nitro" spam is a message promising Discord Nitro (Server Boost, a pay feature) for free.
It contains a link that leads you to a typosquatter domain displaying Discords original CI.
It presents you with a QR code to scan.

It then directs you to open the Discord app on the phone, hit the settings, hit the personal icon on the right and use the function labelled "Scan QR code" to claim the prize.

Nothing in the UI of the original Discord cellphone app explains to a casual observer what this function does: 
"Using this function will log somebody in to your account".
The copy is simply "Scan QR code".

![](/uploads/2021/11/discord-scan-qr.jpg)

*Discord Settings show the "Use the cellphone to auth the desktop app" function simply as "Scan QR Code". Nothing explains what the function really does: It logs in somebody which may or may not be you. Never use this function.*

Doing what is being asked will provide a bot with a login token to your account.
The bot will then begin to send spam in your name to your friends and all discords you are member of.

It will also change your password, if it can.
It cannot do that when 2FA is active on your account.
2FA is literally saving your account here.

## Training your kid

Here is what to do: Train your kid to

- use 2FA properly, and always use this and no login shortcuts.
- archive the original 2FA QR codes used for setting up 2FA. Make a screenshot, and store the PNG of the setup QR code on a USB stick or another offline storage for recovery. This is much easier than the regular account recovery procedures 2FA setups offer, and unlike them, it is one way that works the same for all accounts. It also lets you have the 2FA code generator on the phone and a tablet, for example.
- Never re-use passwords. In the case of my son, he did not use his Discord password anywhere else, and he has a password list. Thus, he had to change only the Discord password and not fix any other accounts.

Also, help your kid: Audit their online accounts.

- make yourself a calendar entry to audit the accounts your kid has every 6 months:
  - Check the password store: Make sure passwords are not re-used.
  - Check 2FA: Have it enabled everywhere possible where regular TOTP can be used. Avoid Steam Authenticator or other special 2FA apps that may be offered, they are just more to learn and confusing. They break important workflows that must always be done right.
  - Check account connections, cross-authentication, enabled bots and their permissions and so on.
- actually perform the audit.
  - Have your kid sit in on this, and explain what you do and why. Discuss your thought with them, and the risk analysis you do. Explain online business models with them, too: How is this service or game making money, where is the value, do you think that is okay? What do you want? Offer opinions and evaluation, but try to let them make choices.

Also, hold yourself to the same standards.

For the record, my personal Google Authenticator has 18 entries.
I did not specifically set out to maximize that, so just take this as a guidance, not a competition.

## 2FA works!

Again, note how 2FA worked exactly the way it is designed to work:

It made a loss of control on the account a recoverable operation.
Instead of a permanent and total loss of the center of his online life, this was just an awkward 30 minutes and a bunch of apologies.

Also note that while Discord is the better Slack, it does have UI/UX design problems around QR code quick authentication.
Never use this function.
Train your kid to not use this function.
Always login with username, password and 2FA.
