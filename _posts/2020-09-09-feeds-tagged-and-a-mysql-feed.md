---
layout: post
title:  'Feeds tagged, and a MySQL feed'
author-id: isotopp
feature-img: assets/img/background/rijksmuseum.jpg
date: 2020-09-09 17:34:33 +0200
tags:
- lang_en
- mysql
- blog
---
I have made changes to the RSS Feed of this blog:

1. Each `<item/>` does now contain a container `<tags/>`, inside a sequence of `<tag/>` containers, with each posts tags.
2. There is now a second RSS feed for posts tagged `#mysql`, because of demand. You can find it at [https://blog.koehntopp.info/feed_mysql.xml](https://blog.koehntopp.info/feed_mysql.xml).

Example for the tags:

```xml
<channel>
	<title>Die wunderbare Welt von Isotopp</title>
	...
	<item>
		<title>A post title</title>
		<link>https://blog.koehntopp.info/2020/09/...</link>
		<guid isPermalink="false">/2020/09/...</guid>
		<tags><tag>lang_en</tag><tag>mysql</tag><tag>database</tag></tags>
		<description>blah blah blah</description>
	</item>
</channel>
```

So if you want only the MySQL content, subscribe to [this feed](https://blog.koehntopp.info/feed_mysql.xml), if you want all the content, subscribe to [the original feed](https://blog.koehntopp.info/feed.xml). In both cases, use the `<tags/>` to filter further down.
