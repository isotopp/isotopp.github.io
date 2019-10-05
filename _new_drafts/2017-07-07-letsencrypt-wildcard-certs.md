---
layout: post
status: publish
published: true
title: LetsEncrypt Wildcard Certs
author: isotopp
author_login: kris
author_email: kristian.koehntopp@gmail.com
wordpress_id: 2086
wordpress_url: http://blog.koehntopp.info/?p=2086
date: '2017-07-07 09:05:05 +0200'
date_gmt: '2017-07-07 08:05:05 +0200'
categories:
- Hackerterrorcybercyber
tags: []
---
<p>In their continuing quest to ground the certificate market, [LetsEncrypt now offers wildcard Certificates](https://www.theregister.co.uk/2017/07/06/free_wildcard_ssl_certs_lets_encrypt/). TLS Certificates are digital passports that provide proof of identity in encrypted connections. In the past, a duopoly of two companies has been selling these through many differently branded outlets. LetsEncrypt managed to break into this, providing TLS Certificates for free and fixing other problems on the way. For example, previously these certificates had a very long lifetime, making revocation of compromised certificates a complicated affair and discouraging users of these certificates from automating rollover and renewal, driving up costs for running encrypted connections. By doing what they do, LetsEncrypt also forced the existing TLS brands of the CA duopoly to adjust their prices and rework procedures and APIs in order to make automation simpler. Wildcard certificates are TLS identities that work on an entire domain (\*.koehntopp.info, "any name in the koehntopp.info domain"), where regular certificates only work on one specific name. Next step are [EV certificates](https://en.wikipedia.org/wiki/Extended_Validation_Certificate).</p>
