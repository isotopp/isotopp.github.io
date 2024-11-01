---
author: isotopp
title: "MySQL: dual passwords"
date: "2024-10-28T05:06:07Z"
feature-img: assets/img/background/mysql.jpg
toc: true
tags:
- lang_en
- database
- mysql
- mysqldev
---

Account password rotation is often a regulatory requirement, despite now being a valid finding in security audits based on NIST.["Verifiers and CSPs SHALL NOT require users to change passwords periodically."](https://pages.nist.gov/800-63-4/sp800-63b/authenticators/#passwordver).

For that very reason, MySQL allows you to have multiple passwords on a single account.

I have written about this in
[Rotating Accounts or Passwords?]({{< relref "2023-02-20-rotating-accounts-or-passwords.md" >}}).

Of course, if something is a regulatory requirement, you also need to prove that you are meeting it.

So Percona has a nice article 
[Tracking Dual Passwords in MySQL](https://www.percona.com/blog/tracking-dual-passwords-in-mysql/)
which shows how can (not) track dual password usage.

While it is somewhat possible to generate a report that shows you which accounts have dual passwords,
other things are hard.
Finding out which accounts have used what password last, or 
if an old account password is still being used (and from what machine) is either painful or downright impossible.

There is no native view or reporting query that can give you an overview over all accounts, 
when they logged in last time with password1 or password2.
Instead, one has to do painful log analysis with elevated log levels.

Less than ideal, and also not good feature planning.
I mean, if you implement such a feature, you'd would ask yourself "What for?", and,
if it is a security feature, you'd also always ask "How can I prove that it is working as intended?"
Somehow that has not happened, yet, for this particular feature – for almost two years now?

Until then, my advice would be doing as suggested in my 2033 article, and rotate accounts for machine logins.
It is much easier to account for,
you are generating machine accounts automatically anyway and
use a mechanism such as Vault or similar to distribute login information to client applications.

Rotating accounts should be a no-brainer and simple logins are very easy to track.

Check if outdated accounts are still used.
Once usage stops, drop them.
If usage does not stop within a week, alert on that, 
and grab the application owner for a talk because somebody is illegally caching credentials.

If accounts are no longer used at all, 
after some timeout check with the application owner if the application is still needed,
and block the credentials.
