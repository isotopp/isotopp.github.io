---
layout: post
status: publish
published: true
title: Zero Factor Authentication
author-id: isotopp
feature-img: assets/img/background/rijksmuseum.jpg
date: '2017-07-27 11:10:10 +0200'
tags:
- security
- erklaerbaer
---
Dear Internet, Today I Learned that oath-toolkit exists in Homebrew. So, this is a thing:

{% highlight console %}
$ brew install oath-toolkit 
$ alias totp='oathtool --totp -b YOURSECRET32BLA | pbcopy'
{% endhighlight %} 

And so is this:

{% highlight console %}
#! /usr/bin/env expect -f

set totp [exec oathtool --totp -b MYSECRET7W22]
spawn ssh verysecure.doma.in
expect "Password:"
sleep 1
send "thisIsN0t1GoodPaszwort@\r"
expect "Two Factor Token:"
sleep 1
send "$totp\n"
interact
{% endhighlight %}

Yup, it's totally possible to laugh and cry at the same time.
