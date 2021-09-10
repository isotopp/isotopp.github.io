---
layout: post
title:  "MySQL: The Million Challenge"
author-id: isotopp
feature-img: assets/img/background/mysql.jpg
date: 2021-09-10 16:01:06 +0200
tags:
- lang_en
- mysql
- mysqldev
---
A long standing idea that I have is to test the servers limits: 
How does it fail and break if there are very many of a thing? 
Previously that was too easy, because many structures were constructed in a way that it was obvious they would not scale.
But with MySQL 8 many things were overhauled, so let's see what we can make many of and see how the server fares.

# The Million Challenge

Database servers are programs that are built to handle a lot of data. A million rows in a table are not a problem, and searching one in a million rows neither, because the server has structures that make this fast.

But is the database server using these structures internally in an efficient way and can it handle a lot of tables, schemas, views, users, grants, roles and so on?

What can we try?

- Make a million tables and see how performance degrades or not.
  - Will this work better if we use general tablespaces instead of file-per-table?
- Make a million views, all pointing to the same table.
- Nest views, one million deep.
- Make a million stored procedures.
  - Make a million stored procedures, calling each other in a chain.
- Make a many triggers? Is that even possible?
- Make a million users.
  - Make a million grants. This one is dear to my heart - we have this at work in one environment and it broke the server in an exciting and hard to fix way. `GRANT` statements in the processlist and `SHOW PROCESSLIST` running concurrently raced badly.
  - Make a million concurrent connections. Well, no, but I have seen 60.000 already, and it was not pretty. This failed in interesting ways, because monitoring was joining against `P_S.THREADS` and fell over badly.
- Make a million users, using roles.
  - Make a million roles.

Any other ideas that fit the general theme?
