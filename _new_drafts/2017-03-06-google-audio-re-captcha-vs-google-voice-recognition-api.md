---
layout: post
status: publish
published: true
title: Google Audio Re-Captcha vs. Google Voice Recognition API
author: isotopp
author_login: kris
author_email: kristian.koehntopp@gmail.com
wordpress_id: 981
wordpress_url: http://blog.koehntopp.info/?p=981
date: '2017-03-06 09:06:27 +0100'
date_gmt: '2017-03-06 08:06:27 +0100'
categories:
- Computer Science
- Hackerterrorcybercyber
tags: []
---
<p>[![](http://blog.koehntopp.info/wp-content/uploads/2017/03/reCAPTCHA-Step2-300x190.png)](https://www.bleepingcomputer.com/news/security/researcher-breaks-recaptcha-using-googles-speech-recognition-api/) Google offers a Captcha Service API called ReCaptcha to help people to keep out bots. ReCaptcha implements accessible Captchas: If you cannot solve the visual captcha, for example because you are blind, there is an audio captcha service. You have to hear a word and type it back to prove you are not a bot.<!--more--> For even more accessibility, you can download that audio as a MP3 file. Google also has an Voice recognition API, which can be fed MP3 files and gives you back the spoken text in ASCII. [Somebody has short circuited these two APIs](https://www.bleepingcomputer.com/news/security/researcher-breaks-recaptcha-using-googles-speech-recognition-api/) and now solves ReCaptchas automatically.</p>
