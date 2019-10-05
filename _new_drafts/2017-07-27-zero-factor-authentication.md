---
layout: post
status: publish
published: true
title: Zero Factor Authentication
author: isotopp
author_login: kris
author_email: kristian.koehntopp@gmail.com
wordpress_id: 2275
wordpress_url: http://blog.koehntopp.info/?p=2275
date: '2017-07-27 11:10:10 +0200'
date_gmt: '2017-07-27 09:10:10 +0200'
categories:
- Fluffy Fluff
- Hackerterrorcybercyber
- Erklärbär
tags: []
---
<p>Dear Internet, Today I Learned that oath-toolkit exists in Homebrew. So, this is a thing:</p>
<p>     $ brew install oath-toolkit $ alias totp='oathtool --totp -b YOURSECRET32BLA | pbcopy' {% endhighlight %} And so is this: </p>
<p>         #! /usr/bin/env expect -f set totp [exec oathtool --totp -b MYSECRET7W22] spawn ssh verysecure.doma.in expect "Password:" sleep 1 send "thisIsN0t1GoodPaszwort@\r" expect "Two Factor Token:" sleep 1 send "$totp\n" interact {% endhighlight %} Yup, it's totally possible to laugh and cry at the same time.</p>
