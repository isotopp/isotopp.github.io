---
layout: post
status: publish
published: true
title: Antivirus assisted attacks
author: isotopp
author_login: kris
author_email: kristian.koehntopp@gmail.com
wordpress_id: 1408
wordpress_url: http://blog.koehntopp.info/?p=1408
date: '2017-04-11 08:11:48 +0200'
date_gmt: '2017-04-11 07:11:48 +0200'
categories:
- Hackerterrorcybercyber
tags: []
---
<p>Christian Wressnegger, Kevin Freeman , Fabian Yamaguchi, and Konrad Rieck from TU Braunschweig and University of Göttingen have been experimenting with "Antivirus assisted attacks" ([PDF](https://www.sec.cs.tu-bs.de/pubs/2017-asiaccs.pdf)). What is that? They have been searching for signatures of malware in common Antivirus software that consists of printable characters only. Using these byte sequences, the following becomes possible:</p>
<p>> As a consequence, an attacker may finish each iteration over a list of guessed passwords with a set of malicious markers, i.e., specially crafted login names that correspond to anti-virus signatures. If the attacked host is running a virus scanner configured to delete or quarantine viruses, any file containing such a malicious marker is deleted or at least moved to a different location. This not only makes manual investigation of the attack hard but may also inhibit the functionality of tools analyzing log files to stop password guessing, such as fail2ban.</p>
<p> Similar approaches are "making mbox files unavailable by poisoning them with printable malware signatures", or "using malware signatures as cookie names".</p>
