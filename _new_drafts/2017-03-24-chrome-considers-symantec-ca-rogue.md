---
layout: post
status: publish
published: true
title: Chrome considers Symantec CA rogue
author: isotopp
author_login: kris
author_email: kristian.koehntopp@gmail.com
wordpress_id: 1302
wordpress_url: http://blog.koehntopp.info/?p=1302
date: '2017-03-24 08:02:50 +0100'
date_gmt: '2017-03-24 07:02:50 +0100'
categories:
- Hackerterrorcybercyber
tags: []
---
<p>[Ryan Sleevi writes](https://groups.google.com/a/chromium.org/forum/m/#!msg/blink-dev/eUAKwjihhBs/rpxMXjZHCQAJ): </p>
<p>> Since January 19, the Google Chrome team has been investigating a series of failures by Symantec Corporation to properly validate certificates. Over the course of this investigation, the explanations provided by Symantec have revealed a continually increasing scope of misissuance with each set of questions from members of the Google Chrome team; an initial set of reportedly 127 certificates has expanded to include at least 30,000 certificates, issued over a period spanning several years. […] To balance the compatibility risks versus the security risks, we propose a gradual distrust of all existing Symantec-issued certificates, requiring that they be replaced over time with new, fully revalidated certificates, compliant with the current Baseline Requirements. […] Given the nature of these issues, and the multiple failures of Symantec to ensure that the level of assurance provided by their certificates meets the requirements of the Baseline Requirements or Extended Validation Guidelines, we no longer have the confidence necessary in order to grant Symantec-issued certificates the “Extended Validation” status.</p>
