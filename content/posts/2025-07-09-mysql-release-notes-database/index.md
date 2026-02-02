---
author: isotopp
title: "MySQL: Release Notes Database"
date: "2025-07-09T05:06:07Z"
feature-img: assets/img/background/mysql.jpg
toc: true
tags:
- lang_en
- database
- mysql
aliases:
  - /2025/07/09/mysql-release-notes-database.md.html
---

I’ve hacked together a horrible thing in Python, and made it available in
[mysql-release-notes](https://github.com/isotopp/mysql-release-notes)
on GitHub.

It’s a Python project (done with `uv`) that downloads all MySQL release notes,
dumps them into a release_notes folder, and then parses them,
pushing everything into a database.

It uses SQLAlchemy and mysqlclient to connect to the database.

It generates a schema (not preserving any data),
and fills it with all the release notes we have.

The schema is a simple star.

![](2025/07/mysql_releases.png)

For each release, we have many issues,
and for each issue we store a number of properties.
Properties aren’t stored as plain text — they’re encoded,
and we only keep the property ID.

Sample queries like

```mysql
select t.contributor,
       min(r.release_date), min(r.version),
       max(r.release_date), max(r.version),
       count(i.text) as cnt
from `release` r
         join issue i on r.id = i.release_id
         join issue_thanks it on i.id = it.issue_id
         join thanks t on it.thanks_id = t.id
group by t.contributor
order by cnt desc;
```

can answer questions about issues —
for example, who contributed the most fixes or changes.

The code is a lazy evening project,
but it can already answer some useful questions.
Like: “If I upgraded from version x to y, what bugs would be fixed?”

That said, since the data comes from free-text HTML release notes,  it’s messy.
We’ll probably need fixer functions.

MRs welcome.
