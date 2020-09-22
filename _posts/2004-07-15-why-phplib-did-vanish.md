---
layout: post
published: true
title: Why PHPLIB did vanish
author-id: isotopp
date: 2004-07-15 13:05:44 UTC
tags:
- php
- damals
- lang_de
feature-img: assets/img/background/rijksmuseum.jpg
---
In ["ADO-donkey" will prevail](http://phplens.com/phpeverywhere/?q=node/view/69), johnlim writes:

> PHPLib was the most popular database library for PHP3. Today it seems to be a bit old and is no longer popular. I have never talked to the PHPLib developers, but I can speculate on the reasons:
> - PHPLib has PHP3 functionality that is obsolete because it is provided natively by PHP today, such as sessions support.
> - PHPLib tried to do too much. It handled both paging, templating and database access. Other more specialised database libraries have superseded it.
> - The PHPLib developers are involved in other activities such as PEAR, or have lost interest perhaps?

As one of the principal designers of PHPLIB, I am entitled to clear things up.

PHPLIB was fallout. When I was doing web application design for 
[NetUSE](http://www.netuse.de)/SHonline in the final days of PHP/FI and during the PHP3 RCs, I pretty quick came across the Session problem. I was at all times carrying around a large number of persistent variables in GET and POST requests, and was revalidating them over and over due to their source being the untrustworthy Internet.

I asked on the PHP support mailing list, and got my hands on a piece of code by Rasmus, which serialized an array of at most three dimensions into a string. Together with Boris Erdmann, with whom I was working at that time, I wrote a more generic serializer, which could handle about any number and any type of variable including objects. This, plus an authentication and authorization scheme plus a very simple and lightweight database wrapper class became the 
[core of PHPLIB](https://marc.info/?l=php-general&amp;m=90222503034131&amp;w=2).

We released the code to our little library under the LGPL thanks to the generosity of the company we worked for, and in order to get other people to contribute to it, be it with documentation, testing or even code. And contributions we got, from inside of 
[NetUSE](http://www.netuse.de)/SHonline by Ulf Wendel, and from the outside.

Then two things happened: Sascha Schumann met the PHP team and started recoding the PHPLIB session handling into what became PHP 4, and SHonline was reintegrated into NetUSE and I moved on to other departments inside the company. Because I was no longer doing web development, and Sascha's native PHP 4 session handling did just fine for my purposes, thank you, I no longer had any use for PHPLIBs code, perhaps besides the database wrapper.

The PHPLIB database wrapper was never intended to be a database abstraction anyway - being raised on NeXTstep and its Enterprise Objects toolkit, I subscribe to many aspects of Jeremy's essay 
[Database Abstraction Layers must die!](http://jeremy.zawodny.com/blog/archives/002194.html). The database wrapper has its purpose mainly in that it encapsulates the database access information (user, password, host, database), and enforces proper error handling. It may also manage a connection pool, if the deployment environment has provisions for that. But there is little use for a unified database access API in PHP (or anywhere else).

SQL dialects and the inner workings of SQL databases are suitably different so that different access strategies are needed for different databases. There is little use for "take a unified SQL statement and push it to whatever database happens to be below the application", which is what most PHP database abstraction layers promise to do.

What is needed is a persistence layer abstraction instead. Objects model the entities and relations of the storage model and provide the application with the data access API the application needs. Inside, the objects generate whatever suitably optimized statements are required to talk to the concrete persistence layer below the application and execute them. 

This is what EO did on NeXTstep and this is what makes sense, if you happen to be able to keep around database connections and ER model objects between requests, because otherwise the overhead in code and object instantiation is just to high - Ulf tried, I tried, we failed. 

Keeping instances of objects between requests requires an application server, things like PHP Bananas and the Vulcan Logic thingy or similar. PHP has no such deployment model that is production quality and so I did not pursue that avenue for development any further.

To sum it up:

- Yes, PHPLIB is obsolete. Use the native PHP session support for session management, use Smarty for templating and use AdoDB for database access. These are much more tailored to current PHP development styles than PHPLIB and they are under active development. Avoid PEAR, unless the class of choice can live without PEAR.php, which is fat and ugly.
- No, PHPLIB did never try to be a database abstraction library, it tried to be a web application development suite and it was fairly successful at that during its time.
- Yes, the PHPLIB developers have been moving on to things outside of the world of PHP.