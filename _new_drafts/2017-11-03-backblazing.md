---
layout: post
status: publish
published: true
title: Backblazing…
author: isotopp
author_login: kris
author_email: kristian.koehntopp@gmail.com
wordpress_id: 2741
wordpress_url: http://blog.koehntopp.info/?p=2741
date: '2017-11-03 13:31:12 +0100'
date_gmt: '2017-11-03 12:31:12 +0100'
categories:
- Small computers
tags: []
---
<p>So there is Backblaze B2. It's a service where you can buy bulk disk space online for backup and restore. I have a Linux server at home, which many harddisks and which downloads and saves all data from the various dedicated servers and cloud instances, receives several time machine backups from the inhouse Apples, and has local git repositories and stuff. I mirror these things from the production filesystems to a set of mostly offline disks once, and I wanted an off-site backup as well for crash recovery. Bandwidth is not a problem, we are living on FTTH with 500/500. So there is rclone for this. It's like rsync for B2 or other services. Like so:<!--more--></p>
<p>    #! /usr/bin/perl -w use strict; use File::Basename; use POSIX; my $fstab = "/etc/fstab"; my $backup\_to = "crypt:backup"; sub folders { my @result = ( "/home", "/root", "/export/blogbackup", "/export/dedibackup", "/export/git", "/export/tm\_laptop1", "/export/tm\_laptop2", "/export/tm\_laptop3", ); return sort @result; } my @exports = folders(); foreach my $export (@exports) { my $base = basename $export; my $backup = "${backup\_to}/$base"; my $cmd = qq(rclone --transfers 64 -L sync $export $backup); my $start = strftime "%a %b %e %H:%M:%S %Y", localtime; print "$start: start $cmd\n"; system($cmd); my $stop = strftime "%a %b %e %H:%M:%S %Y", localtime; print "$stop: finished.\n\n"; } {% endhighlight %} and then [![](http://blog.koehntopp.info/wp-content/uploads/2017/11/Screen-Shot-2017-11-03-at-13.29.25-300x271.png)](http://blog.koehntopp.info/wp-content/uploads/2017/11/Screen-Shot-2017-11-03-at-13.29.25.png) for a total of &nbsp; [![](http://blog.koehntopp.info/wp-content/uploads/2017/11/Screen-Shot-2017-11-03-at-13.29.47.png)](http://blog.koehntopp.info/wp-content/uploads/2017/11/Screen-Shot-2017-11-03-at-13.29.47.png) That's totally within budget.</p>
