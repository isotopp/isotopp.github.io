---
layout: post
title:  'Ignoring Catalina nags'
author-id: isotopp
feature-img: assets/img/background/rijksmuseum.jpg
date: 2019-10-15 11:50:23 +0200
tags:
- lang_en
- apple
- macos
---
Note to self: Ignoring the Catalina Nagscreens is done like this:

{% highlight console %}
$ sudo softwareupdate --ignore "macOS Catalina"
$ defaults write com.apple.systempreferences AttentionPrefBundleIDs 0 && killall Dock
{% endhighlight %}

And that should make MacOS ignore Catalina until further notice. Further
notice does look like this:

{% highlight console %}
$ /usr/sbin/softwareupdate --reset-ignored
{% endhighlight %}
