---
author: isotopp
title: "This Blog is now Hugo powered"
date: 2021-11-07T11:28:27+01:00
feature-img: assets/img/background/rijksmuseum.jpg
tags:
- lang_en
- blog
---

I started blogging almost 20 years ago, because a piece of software I was using to manage calendars and discussion boards to organize the "Dienstag" also offered blogging functionality.
That software was very buggy and full of HTML injections.
My patches to fix things touched almost all files, and were rejected, because they... touched too many files.

So I was looking around for something better, and the good people on `ircnet:#php.de` recommended [Serendipity](https://docs.s9y.org/).
I have been using this for many years, contributed a few improvements and sponsored a few others.
Unfortunately, when Mobile became a thing, I had no theme that went well with that.
I also needed 2FA for obvious reasons.

So for a time, I used Google+ a lot, but we all know how that went. 
After that I installed WordPress, but not only was that slow, but the constant patching and  the Antispam became a drag.

I revived the blog by moving all my content to Markdown, and putting it up as a 
[Git repository](https://github.com/isotopp/isotopp.github.io/)
hosted as GitHub Pages.
GitHub Pages has a default workflow, which requires you to do nothing more than to push Markdown, which is very convenient.
Internally it uses [Jekyll](https://jekyllrb.com/), a static site generator, which converts Markdown together with a set of templates to HTML in the `_site` directory.

Jekyll is nice enough, and provided useful importers for Serendipity and WordPress.
Also, I was able to extend it a bit to also create dedicated additional RSS feeds for the `MySQL` and `Review` tags.
Unfortunately, though, it is written in Ruby and the theme also uses a lot of npm.
The consequence of that are frequent module updates - again! - and a build time for the entire blog of approximately 120 seconds.

I tried alternatives, and there are many.
They are all either slow (Pelican and other Python based stuff), or have hardly any community (e.g. Rust-based Zola).
Also, the themes offered are all worse than the really awesome [Type-on-Strap](https://github.com/sylhare/Type-on-Strap) I was using in Jekyll.
Especially they all offer no or bad on-site search.

I tried to experiment with Hugo, a Go-based site generator, and that is when I realized that I know nothing about frontend anymore, at all.
I mean, I did PHP and made websites, but that was in and around 2000.
That is *checks calendar* more than 20 years ago, and would  you believe it, technology has changed.

I tried to get things to work, but I failed, and gave up:

[![](/uploads/2021/11/frontend.png)](https://twitter.com/isotopp/status/1451565659066978306)

> Okay, ich geb es auf. Ich bin ja bekennender Frontend-Analphabet und habe zuletzt Webkram gemacht als wir noch ein anderes Jahrtausend hatten.
>
> Mein Blog verwendet Jekyll, und [https://github.com/sylhare/Type-on-Strap](https://github.com/sylhare/Type-on-Strap)
>
> Das ist lahm, und ich will Hugo.

> Ich verwende das Theme, weil es light und text-freundlich ist, und weil es eine gute Suche mitbringt (JS basierend, aber funktioniert leidlich).
>
> Gibt es dieses Theme oder was Vergleichbares für Hugo, oder mag jemand das portieren.

> Original ist MIT License.

> Bin Privatperson, Blog nicht monetarisiert, kann nur symbolisch zahlen, wenn es jemand es für Geld tun will, sollte das Resultat ebenfalls MIT oder frei verfügbar sein.

[@Darixzen](https://twitter.com/darixzen/status/1451567686484467723) as a member of the [Pixls.us](https://pixls.us/) project then made contact with me, and recommended [Pat David](https://github.com/patdavid):

> I'm a member of the GIMP team, occasional photographer, digital dabbler, and lover of Free Software. Started @pixlsus https://pixls.us

who took it upon himself to create a foundation for me to build on, and this weekend I was able to provisionally move over things from Jekyll to Hugo.
There are still many visual and other bugs, but this is on GitHub: You can open issues, and even better, provide PRs.

![](/uploads/2021/11/frontend-rebuild.png)

*When running `hugo serve`, the website is built in memory and served from `http://localhost:1313`. A file watcher detects changes, and "on save" rebuilds the minimal change set, then triggers an automatic reload in the browser.
I have the browser open on the left, WebStorm on the right, and whenever I hit `Ctrl-S` or change tabs, the article I am looking automatically refreshes. Build time is 0.272s, approximately human reaction time - it's instant.*

The build time for `hugo --cleanDestinationDir` is down from 120s to 8s, for the entire site.
"Thanks, @patdavid!" and "Thanks, Hugo!", I'd say!

![](/uploads/2021/11/frontend-build.png)

*The new build time for the entire site is down to 8s.*

Also, using this and the Bootstrap and GitHub workflow documentation, I am even learning things now, and actually was able to fix [the first bug](https://github.com/isotopp/isotopp.github.io/commit/869c4962fbbc24c8ae9c3343bcaa25c140241f6b) on my blog on my own. Kris doing frontend, take cover. :smile:

Ah, and JetBrains. I have the all-in subscription, and started using WebStorm with this setup.
I am constantly amazed how fast and incredibly useful their stuff is.
If you do stuff with software for a living, and are not using their products, you are doing it wrong.
