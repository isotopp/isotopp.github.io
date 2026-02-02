---
author: isotopp
date: "2017-07-27T11:10:10Z"
feature-img: assets/img/background/schloss.jpg
status: publish
tags:
- security
- erklaerbaer
- lang_en
title: Zero Factor Authentication
aliases:
  - /2017/07/27/zero-factor-authentication.html
---
Dear Internet, Today I Learned that oath-toolkit exists in Homebrew. So, this is a thing:

```console
$ brew install oath-toolkit 
$ alias totp='oathtool --totp -b YOURSECRET32BLA | pbcopy'
``` 

And so is this:

```console
#! /usr/bin/env expect -f

# exp_internal 1

set seed [ exec security find-generic-password -w -a $USER -s seed ]
set totp [ exec oathtool --totp -b $seed ]
set pass [ exec security find-generic-password -w -a $USER -s pass ]

spawn ssh verysecure.doma.in
expect "word:"
sleep 1
send "$pass\r\n"
expect "Two Factor Token:"
sleep 1
send "$totp\r\n"
interact
```

Yup, it's totally possible to laugh and cry at the same time.
