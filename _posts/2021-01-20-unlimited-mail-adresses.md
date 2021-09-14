---
layout: post
title:  'Unlimited Mail Addresses'
author-id: isotopp
feature-img: assets/img/background/rijksmuseum.jpg
date: 2021-01-20 08:02:20
tags:
- lang_en
- mail
---

When people ask for my mail address, they usually get a personalized address from me. That is particularly true for all commercial email. So you don't get to send mail to my main account, but to kris-yourbusiness@koehntopp.de, and that will end up going into `INBOX.special.yourbusiness`. At least until it leaks, receives spam or is otherwise burned. In which case I will short it out and route all incoming mail on that address to `/dev/null`. Here is how it is done.

## Mailer setup

I run `exim` and in my `exim.conf` I have

```console
kris_virtuserfile:
  driver = redirect
  domains = +kris_domains
  local_part_suffix = +* : -*
  local_part_suffix_optional
  headers_remove = X-local-part-suffix
  headers_add = X-local-part-suffix: ${original_local_part}
  owners = kris
  allow_fail
  allow_defer
  data= ${lookup{$local_part@$domain}dbm*@{/home/kris/Exim/virtusertable.dbm}}
```

The important part here is the `local_part_suffix = +* : -*`. This enables amending the local part of a mail address with an extension. So if `kris` is a valid local user for delivery, `kris-yourbusiness` and `kris+yourbusiness` become valid addresses, too, and will be delivered to the local user `kris`.

I define `local_part_suffix_optional`, because unfortunately for legacy reasons the actual local user must remain reachable for legacy reasons.

I also define `header_remove = X-local-part-suffix` to remove this particular X-header from all incoming mail, and then add it back with `X-local-part-suffix: ${original_local_part}`. This will prevent external mail with a hand-crafted fake `X-local-part-suffix` header from coming through, and then preserve the original local part for sorting, in exactly this X-header line.

From this config we get the following behavior: `kris-yourbusiness@koehntopp.de` is being delivered to the local user `kris`, and with an `X-local-part-suffix: kris-yourbusiness` header line added to the mail. Note that we get `kris-yourbusiness`, and not `yourbusiness` in this header line.

## Local delivery

Local delivery is controlled by the local user, `kris`. Kris happens to have defined a `.forward` such as

```console
kris:~ $ cat .forward
|/usr/bin/procmail
```

This will invoke `procmail` for local delivery. `procmail` is a rule based local delivery agent with a horrible Syntax.

You can define variables, and later refer to them using `$` as a prefix. Rules start with a `:0`, and consist of a Regex for header lines, plus a delivery action (usually a folder name for Maildir format, so make sure it ends in a slash).

The other important but obscure piece of information is that the exit code of `procmail` defines the delivery success, and controls the mailer behavior. So checking in the obvious place (`/usr/include/sysexits.h`, of course!) you learn:

```c
kris:~ $ cat /usr/include/sysexits.h
...
#define EX_NOINPUT      66      /* cannot open input */
#define EX_NOUSER       67      /* addressee unknown */
#define EX_NOHOST       68      /* host name unknown */
...
```

We remember that the magical number `67` as an exit code makes `exim` bounce mail with `user unknown`.

The end result:

```console
kris:~ $ cat .procmailrc
PATH=/bin:/usr/bin:/usr/local/bin
MAILDIR=$HOME/Maildir
LOGFILE=$HOME/Procmail/procmail.log
DEFAULT=$HOME/Maildir/

BOUNCE=/dev/null
SPAM=$MAILDIR/.spam
TRASH=$MAILDIR/.system.trash
BOUNCELOG=$MAILDIR/.system.bounces

# Subrule to define a "user unknown" bounce, as an example.
# Subrule, because we also record the bounce in the bouncelog folder.
:0
* ^X-local-part-suffix: kris-macheist
{
    EXITCODE=67

    :0 i
    $BOUNCELOG/
}

# Rule to route mail to the trash folder
:0
* ^X-local-part-suffix: kris-bitly
$TRASH/

# all mail to kris-yourbusiness goes to INBOX/.special.yourbusiness,
# which becomes the INBOX.special.yourbusiness folder.
#
# We use sed and tr, this could be more efficient. Basically, we clean
# up unwanted characters and transform to lower case.
:0
* ^X-local-part-suffix:.*kris-\/[^@]+
$MAILDIR/.special.`echo $MATCH | sed -e 's!([^)]*)!!g' -e 's![^a-zA-Z0-9_-]!_!g' | tr A-Z a-z`/

# Filter through spamc
:0fw
| /usr/bin/spamc

# If spam detected, deliver to different folders depending on score
:0
* ^X-Spam-Level:.*\*\*\*\*\*\*\*\*\*\*
$SPAM.sure/

:0
* ^X-Spam-Level:.*\*\*\*\*\*
$SPAM/
```

Note how we detect the `X-local-part-suffic` before we run spam detection and sorting. This allows mail to subaddresses to always go through and bypass all spam filtering, so in exchange for having a personally identifyable mail address you get guarantee delivery. Conversely, if you abuse the privilege you are routed to `$TRASH/`.

## Mail User Agent

I used to run Apple Mail.app with this setup, and now on Windows am using [eM Client](https://www.emclient.com/). eM Client is a commercial email client, and is available for Windows and Mac, and is easily the best email client I have ever used, with Mail.app being a close second for my workflow.

In my case, I define a smart folder search which will find all unread mail in all folders (except $list of exceptions), and show it in a single folder. I want the search to automatically discover newly generated folders automatically, and I need the folder name shown in the overview.

![](/uploads/2021/01/emclient.png)

*A smart folder, finding all unread mail anywhere, and showing it by folder. I made a few mails unread for demonstration.*

That way, I can see if I get a mail claiming to be from YourBusiness: If it is not in the `yourbusiness` folder, I am deleting it without reading. Phishers will have to send phishing mail to the correct folder for your personalized business mail address in order to be even considered.

I also can `$TRASH/` rule burned addresses rather quickly, and that keeps my inbox clean.