---
layout: post
status: publish
published: true
title: Things you cannot say on Facebook, SQL Edition
author: isotopp
author_login: kris
author_email: kristian.koehntopp@gmail.com
wordpress_id: 3122
wordpress_url: http://blog.koehntopp.info/?p=3122
date: '2018-04-12 15:06:00 +0200'
date_gmt: '2018-04-12 13:06:00 +0200'
categories:
- Hackerterrorcybercyber
- Media
tags: []
---
<p> **EDIT:** This is now fixed. Facebook worked on the bug report and fixed the problem within 72 hours, including rollout. Where I work, I am using an instance of Facebook at Work to communicate with colleagues. That is basically a grey-styled instance of Facebook which is supposed to run a forked codebase on isolated servers. Today, it would not let me write the following SQL in Chat, in Facebook notes or comments: [![](http://blog.koehntopp.info/wp-content/uploads/2018/04/sql.png)](http://blog.koehntopp.info/wp-content/uploads/2018/04/sql.png) Other versions of the error message complain about it being Spam, or mention the string sd.date as being problematic. Why is that? <!--more--> So when you write anything anywhere in Facebook, Facebook tries to URLify things. For that, it breaks things into items that look like potential domain names, and checks if they could be domain names. It then create an "a href" wrapper around that and links to that. Because that's a way to transport Spam and malicious content, there is a list of blocked things, and that then triggers the above blocking mechanism. So we have the above SQL, which contains the phrase "sd.date\_of\_delivery". The underscore is not part of DNS, so the tokeniser turns this into sd.date. There is a [dot date](https://icannwiki.org/.date) TLD. So Facebook wrongly tries to turn sd.date\_of\_delivery into [sd.date](https://sd.date)\_of\_delivery, which clearly is not my intention, and then spamblocks me. This is wrong on many levels:<br />
- On a business instance of Facebook it has literally no business to listen in, but does.<br />
- When every word of the english language turns into a TLD, auto-URLifying stuff becomes completely, utterly useless. The above example contains the expression [sd.id](https://sd.id), too, and no, it's not intended to be a link.<br />
- The is clearly and obviously code, SQL to be specific. All the machine learning in the world did not help you to detect that, though.<br />
 And it's not even sd.date, you only made it into that, because<br />
- You can't write proper parsers, too.<br />
- And you forgot to implement the switch to globally turn off that misfeature in the preferences. Because I am old-school. When I want a link, I actually write https://<br />
 So annoying. **EDIT:** As a colleague of mine cleverly pointed out, you can fool the thing with zero width characters in UTF-8. I am undecided if that is a bug or a feature. **EDIT:** As a user, I want control over URLification: Give me an off switch that does not URLify unless I prefix http:// or https://. As a user, I want a proper parser, that does not try to turn sd.date\_of\_delivery into a sd.date-URL. As a user, I would rather have anything not URLified, but also not blocked, than having things blocked after URLification. As a user of corporate facebook, I'd like to have the entire product take into account that it is in a corporate environment instead of still trying to behave like blue facebook. The engagement engine, the link-wrapping and and much of the other stuff are a complete nuisance and counterproductive in a paid-for corp use-case.</p>
