---
layout: post
status: publish
published: true
title: Namespaces, but "uname -r" says 2.6
author: isotopp
author_login: kris
author_email: kristian.koehntopp@gmail.com
wordpress_id: 925
wordpress_url: http://blog.koehntopp.info/?p=925
date: '2017-03-02 20:29:27 +0100'
date_gmt: '2017-03-02 19:29:27 +0100'
categories:
- Computer Science
- Hackerterrorcybercyber
tags: []
---
<p>In [this blog post](https://www.redhat.com/en/about/blog/package-versions-why-our-package-versions-are-almost-never-bumped), RedHat explains how they not only fork codebases, but also Version Numbers, making any RedHat install cryptic and hard to&nbsp;compare against upstream codebases and developments. A simple things such as</p>
<p>     rpm --queryformat="%{name}\t%{version}\n" -qa {% endhighlight %} may allow you to say something about lesser distros, but not RedHat. From the article: </p>
<p>    > rpm -q --changelog openssl | grep -E --color \ "(CVE-2016-2108|CVE-2016-0799|CVE-2016-0705|CVE-2016-6304|CVE-2016-2109|CVE-2016-0798|CVE-2016-2182|CVE-2016-6303|CVE-2014-8176)" - fix CVE-2016-2182 - possible buffer overflow in BN\_bn2dec() - fix CVE-2016-6304 - unbound memory growth with OCSP status request - fix CVE-2016-2108 - memory corruption in ASN.1 encoder - fix CVE-2016-2109 - possible DoS when reading ASN.1 data from BIO - fix CVE-2016-0799 - memory issues in BIO\_printf - fix CVE-2016-0705 - double-free in DSA private key parsing - fix CVE-2014-8176 - invalid free in DTLS buffering code {% endhighlight %}</p>
<p>     Just say "no" to this mess.</p>
