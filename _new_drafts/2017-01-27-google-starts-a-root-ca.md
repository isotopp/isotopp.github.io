---
layout: post
status: publish
published: true
title: Google starts a root CA
author: isotopp
author_login: kris
author_email: kristian.koehntopp@gmail.com
wordpress_id: 178
wordpress_url: http://blog.koehntopp.info/?p=178
date: '2017-01-27 10:44:36 +0100'
date_gmt: '2017-01-27 09:44:36 +0100'
categories:
- Computer Science
- Hackerterrorcybercyber
tags: []
---
<p>[caption id="attachment\_179" align="alignnone" width="300"][![](http://blog.koehntopp.info/wp-content/uploads/2017/01/cert-300x171.png)](https://security.googleblog.com/2017/01/the-foundation-of-more-secure-web.html) A certificate as seen in a network debugger[/caption] In order to communicate securely over an encrypted channel, both parties do not just have to agree on a common set of crypto keys, they also need to prove to each other that they are who they claim to be. If they do not, it is very easy for an attacker to mount [a Man in the Middle attack](https://en.wikipedia.org/wiki/Man-in-the-middle_attack). The thing that is used on the web and elsewhere to prove identity are certificates, and because no one can know all certificates, certificate authorities are acting as trusted passport bureaus of the Internet. In theory. In practice, that did not work out so well.<!--more--> There are many instances where certificate authorities fucked up and basically signed random bullshit certificates. One particularly notable case is [DigiNotar](https://en.wikipedia.org/wiki/DigiNotar), a now defunct state sponsored Dutch CA which through a combination of process breakdown, incompetence and a directed attack from a Nation State Attacker lost control over its signing certifictes and had to be closed down. But there are many other cases [where](https://nakedsecurity.sophos.com/2013/01/04/turkish-certificate-authority-screwup-leads-to-attempted-google-impersonation/) [CAs](https://www.extremetech.com/internet/243202-symantec-caught-improperly-issuing-illegitimate-https-certificates) [signed](http://www.theregister.co.uk/2013/12/10/french_gov_dodgy_ssl_cert_reprimand/) [things](https://arstechnica.com/security/2015/04/google-chrome-will-banish-chinese-certificate-authority-for-breach-of-trust/) they under no circumstances must have signed. Google reacted to all these things with building multiple things:</p>
<p>- all chrome browsers on the desktop and on a phone can be used as monitors for the certificates they see, and the CAs that&nbsp;have been used to sign these certificates.<br />
- a common website,&nbsp;[https://www.certificate-transparency.org/](https://www.certificate-transparency.org/)&nbsp;(CT),&nbsp;is being used logging and publishing all certificates by all participating certificate authorities. The log is made secure and hard to fake using data structures that create a kind of [eternal log file](https://en.wikipedia.org/wiki/Merkle_tree).<br />
 What started out as a voluntary project for CAs to join now has become somewhat mandatory, because if as a CA you want your root certificate to be recognized inside the major browsers you basically have to support CT. With the data of all issued certificates in CT, and the data from their browsers used as sensors, it is becoming increasingly easier to spot irregular certificates and other strange phenomena outside. So far, Google has kept itself outside of the CA game: While running a number of CAs inside their company for internal purposes, so far they did not operate a public CA for the public web. That has now changed,&nbsp;[https://pki.goog/](https://pki.goog/)&nbsp;exists. In a way that is good, because if there is a company that knows how to operate a public CA safely, it is this one. In a way that is not good, because arguing about CA industry best practices when you are the operator of one is&nbsp;much harder than doing the same as an innocent bystander and client side consumer of certificates. Now a lot of shouting&nbsp;about monopoly, pressure practices and other stuff will obscure legit technical arguments. Also, a lot of people now will check the proper seating of their tin foil hats, because when Google moves clearly that has to be an evil thing. Well, no, it's not.</p>
