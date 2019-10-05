---
layout: post
status: publish
published: true
title: Posting from the commandline
author: isotopp
author_login: kris
author_email: kristian.koehntopp@gmail.com
wordpress_id: 2199
wordpress_url: http://blog.koehntopp.info/index.php/2199-posting-from-the-commandline/
date: '2017-07-24 14:13:29 +0200'
date_gmt: '2017-07-24 13:13:29 +0200'
categories:
- Blog
tags: []
---
<p>This post has been created [using the commandline](http://wp-cli.org/).</p>
<p>    $ cd $WP\_ROOT $ wp post create /tmp/post-content.txt \ \> --post\_title="Posting from the commandline" \ \> --post\_category=16 \ \> --post\_status=publish {% endhighlight %} You will find additional information in $WP\_ROOT/wp-includes/post.php. Look at the parameters for "function wp\_insert\_post". They translate into command line parameters for "wp post create". Also look at the various "register\_post\_status" definitions in that file if you want to understand what 'publish' is and which other states exist. The category has been specified as a number. You can find these in the menu for the category tree. Category labels like "blog" don't work here.</p>
