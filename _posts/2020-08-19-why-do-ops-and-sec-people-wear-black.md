---
layout: post
title:  'Why do Ops and Sec people wear black'
author-id: isotopp
feature-img: assets/img/background/rijksmuseum.jpg
date: 2020-08-19 17:05:47 +0200
tags:
- lang_en
- security
- unix
---
For [reasons that don't need exploring at this juncture](https://www.imdb.com/title/tt0108756) I [tweeted](https://twitter.com/isotopp/status/1296073392655933444)

> Once upon a time there were shared boxes, on which the local Unix easily had 200-300 users, Junior Developers at a University.
>
> A /tmp/ls found easily 3-4 people per day that had . (dot) in their path.
>
> No particular reason. Why?

and followed up with

> Hope is not a strategy.
>
> Neither is `curl stackoverflow | sudo bash`.

## /tmp/ls

I was asked to explain: "What is /tmp/ls?". 

/tmp/ls is a shell script installed as executable in /tmp/ls. If you have . (dot, the current directory) early in your path, it shadows the command /bin/ls, which you use to list the current directory.

So when you `cd /tmp` and then `ls` you are executing my script instead of the actual `/bin/ls` command. You are now inadvertently running my code under your permissions. When I finish my script with `exec /bin/ls "$@"` you won't even notice, because it will run the normal `/bin/ls` command at the end.

The mistake is to have any directory in your path that can contain code controlled by another person besides you and root. That is, a world-writeable `/usr/local/bin` in - say - an AIX install would amount to the same exposure (A lot of old Unices such as AIX, HP/UX and SGI would ship with world writeable directories of one kind or the other by default).

## The 777 root cron

The same scenario is a script globally installed on all Macs by JAMF, running through cron as root every minute. The same JAMF sets the enclosing directory to 777 (full access for everybody). Due to how permissions work in Unix, this allows anybody to remove, rename or replace the script itself, no matter what the script permissions are.

It is instant root for anybody who cares: You replace the script with your own content, wait a minute for the cron to hit it, and put the original script back. Or not, depending on how you feel that day.

The remarkable part of this particular incident is that none of the multitude of endpoint security products also installed by the same JAMF detected or quarantined this script. So much for that.

## The world writeable fileshare

Other fun things that should not have happened: A university of applied science exported their AIX home directories by NFS, world-writeable, once. That is, for several years, their site was a well known Shell-o-matic.

Why is this bad?

Anybody who mounted this on their own machine could create a user account with a matching UID, go into the mounted user home and drop a .rlogin file of appropriate content (The .rlogin reference should tell you how old that is).

The fun part is that the university in question eventually migrated to Solaris, and that included all the... interesting configuration.

Apparently SMB fileshares can serve the same purpose. Also, Windows always has . (dot) in the front of the path, implicitly.

## External storage

A lot of people have world-readable backup devices such as a 644 /dev/rmt. If the backup tape from last night is left in that drive it does not matter much what the permissions on the original files are.

You can read the files from backup, and restore them with any permission you like.

## This makes me sad

For some reasons each of these things, all of which are from personal experience up to 25 years ago, still happen today.

That is why ops people wear black. Now you know.