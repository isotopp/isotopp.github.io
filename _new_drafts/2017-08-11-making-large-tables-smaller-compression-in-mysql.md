---
layout: post
status: publish
published: true
title: 'Making large tables smaller: Compression in MySQL'
author: isotopp
author_login: kris
author_email: kristian.koehntopp@gmail.com
wordpress_id: 2405
wordpress_url: http://blog.koehntopp.info/?p=2405
date: '2017-08-11 10:28:36 +0200'
date_gmt: '2017-08-11 08:28:36 +0200'
categories:
- MySQL
tags: []
---
<p>So JF has been busy abusing MySQL again:</p>
<p>- [An Adventure in InnoDB Table Compression (for read-only tables)](http://jfg-mysql.blogspot.nl/2017/08/adventure-innodb-table-compression.html) is trying out different KEY\_BLOCK\_SIZES in InnoDB to find out which settings yield the best compression for a specific table. His sample script copies a table and compresses it with one setting, then does this again, and if the new version is smaller, keeps the new one. Otherwise the first version of the table is being kept. This is then done over and over until a minimum sized InnoDB compressed table has been created. JF managed to create a compression ratio of 4.53, bringing a 20 TB instance down to 4.5TB.<br />
- In&nbsp;[Why we still need MyISAM (for read-only tables)](http://jfg-mysql.blogspot.nl/2017/08/why-we-still-need-myisam.html) he does the same thing with his database in MyISAM format, and then compresses using myisampack, which is ok because his data is read-only archive data. MyISAM uncompressed is 22% smaller than InnoDB uncompressed. Compressed, his data is 10x smaller than the raw InnoDB uncompressed, so his 20TB raw data is below 2T compressed.<br />
 Using MyISAM for read-only data is much less critical than it would be for data that is being written to: Data corruption due to the lack of checksums is much less likely, and while the lack of clustered indexes can not really be compensated, "myisamchk&nbsp;--sort-index" is at least keeping the regenerated indexes linear in the MYI files.</p>
