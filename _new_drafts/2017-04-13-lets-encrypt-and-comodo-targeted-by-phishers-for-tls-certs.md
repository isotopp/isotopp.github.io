---
layout: post
status: publish
published: true
title: Let's Encrypt and Comodo targeted by Phishers for TLS certs
author: isotopp
author_login: kris
author_email: kristian.koehntopp@gmail.com
wordpress_id: 1455
wordpress_url: http://blog.koehntopp.info/?p=1455
date: '2017-04-13 10:20:20 +0200'
date_gmt: '2017-04-13 09:20:20 +0200'
categories:
- Hackerterrorcybercyber
tags: []
---
<p>[A netcraft report highlights](https://news.netcraft.com/archives/2017/04/12/lets-encrypt-and-comodo-issue-thousands-of-certificates-for-phishing.html) that both Let's Encrypt and Comodo have been issuing thousands of domains that in some form or the other contain the words "apple", "paypal" or "ebay" in them, and that virtually all of these domains are being used for phishing or other fraudulent activities. [![](http://blog.koehntopp.info/wp-content/uploads/2017/04/Screen-Shot-2017-04-11-at-11.22.18.png)](https://news.netcraft.com/archives/2017/04/12/lets-encrypt-and-comodo-issue-thousands-of-certificates-for-phishing.html) Netcraft provides a metric called "[Deceptive Domain Score](https://www.netcraft.com/anti-phishing/deceptive-domain-score/)", and uses the opportunity to promote this service of theirs, requesting that certificate authorities implement a similar service. </p>
<p>> In each of these examples above — and in the other statistics referenced above — the certificate authority had sight of the whole hostname that was blocked. These examples did not rely on wildcard certificates to carry out their deception. In particular, some of these examples (such as update.wellsfargo.com.casaecologica.cl) demonstrate that the certificate authority was better placed to prevent misuse than the domain registrar (who would have seen casaecologica.cl upon registration).</p>
<p> The two services are attractive to phishers, because they offer TLS certificates for free and through an API, with a very limited screening process. Both services are using the Safe Browsing API to check if the domain being certified does contain malware, but because it usually does not at the time the cert is being issued this is pointless. Netcraft would rather have the CAs buy their Deceptive Domain Scoring service instead.</p>
