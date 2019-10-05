---
layout: post
status: publish
published: true
title: MySQL and encrypted connections
author: isotopp
author_login: kris
author_email: kristian.koehntopp@gmail.com
wordpress_id: 1160
wordpress_url: http://blog.koehntopp.info/?p=1160
date: '2017-03-15 14:33:21 +0100'
date_gmt: '2017-03-15 13:33:21 +0100'
categories:
- MySQL
- Hackerterrorcybercyber
tags: []
---
<p>[caption id="attachment\_1161" align="alignleft" width="300"][![](http://blog.koehntopp.info/wp-content/uploads/2017/03/Screen-Shot-2017-03-15-at-14.18.28-300x173.png)](http://talks.php.net/show/ezkey06/6) [2006 slides by Rasmus Lerdorf](http://talks.php.net/show/ezkey06/6)[/caption] Since 5.0, MySQL does allow natively encrypted connections to the database, and supposedly also does support client certs for user authentication. Supposedly, because I never tried. MySQL as a database performs well with&nbsp;transient connections as they are prevalent in two-tier deployments (mod\_php, mod\_perl, mod\_python to database), in which a database connection is made upon web request, and the connection is torn down at the end of the request. [This model does not scale so well](http://talks.php.net/show/ezkey06/6) with encryption in the mix, as on connection a full TLS/SSL exchange must be made.<!--more--></p>
<p>[The talk](http://talks.php.net/show/ezkey06/6) given by Rasmus Lerdorf starts out with Postgres, and then switches to MySQL, but the big gain at the beginning is really from dropping the TLS/SSL connection establishment overhead, not from anything else. It would be the same, no matter what database is doing the work behind that channel.</p>
<p> For customers who had the need of&nbsp;talking to the database on a secure channel, I always recommended a VPN tunnel such as IPsec, openvpn or similar, and then connecting in clear&nbsp;through it. This not only avoids connection establishment/teardown overhead, but also secures all other administrative communication to the server that will happen, but typically does&nbsp;not use the MySQL protocol (such as backups, bulk downloads of dumps and other traffic). Daniël van Eeden has been less lazy than me:<br />
- [Network attacks on MySQL, Part 1: Unencrypted connections](http://databaseblog.myname.nl/2017/03/network-attacks-on-mysql-part-1.html)This article demonstrates why you would want to encrypt your connections, and how you could use a protocol sniffer to escalate privileges on a database by extracting passwords from a TCP dump.<br />
- [Network attacks on MySQL, Part 2: SSL stripping with MySQL](http://databaseblog.myname.nl/2017/03/network-attacks-on-mysql-part-2-ssl.html)&nbsp;Here Daniël actually tries to use TLS/SSL with MySQL, and is in for a bunch of surprises, because he still can downgrade the connection to plain.<br />
 In conversation with Daniël I learned a few more things. For example, I always thought that community MySQL is linked against OpenSSL, and Enterprise MySQL uses YaSSL for license reasons, but that is a) wrong and b) a problem. It is wrong, because apparently OpenSSL uses [it's own little license](https://www.openssl.org/source/license.html) and that one [appears to be GPL incompatible](https://people.gnome.org/~markmc/openssl-and-the-gpl.html) (like about any license that is not the GPL itself). It's [yaSSL that's GPL](https://www.wolfssl.com/wolfSSL/Products-yassl.html). But - yaSSL is dying, and the replacement product is [WolfSSL](https://www.wolfssl.com/wolfSSL/License.html), which is also GPL'ed, but not used by MySQL, yet. OTOH, Daniël pointed out that current versions of xtrabackup seem to be linked against OpenSSL, which would have to be changed (or the license situation cleared up otherwise). So - it's complicated already at the organisational and licensing level, before you even start to dive into the tech specifics. Anyway, Daniël is planning more articles about MySQL and encryption in his blog, so if you aren't subscribed, do it now.</p>
