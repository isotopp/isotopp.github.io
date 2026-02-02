---
author: isotopp
date: "2021-10-28T14:06:51Z"
feature-img: assets/img/background/mysql.jpg
tags:
- lang_en
- mysql
- mysqldev
title: 'MySQL: Python and WHERE ... IN ()'
aliases:
  - /2021/10/28/python-where-in.md.html
---

> As a developer using Python, I want to be able to hand 
> a `list` to an SQL statement with a 
> `WHERE id IN (…)` clause, and it should do the right thing.

Well, that is not how it started, because it was asked on the  internal no-work-channel, so it kind of escalated more.

# A question

The original question was:

> Dev> Why is it 2021, and SQL prepared statements still can't deal with IN?  Or have I missed some exciting development?

After a quick detour through Java (which we won't discuss any further in this article), we established that this was a Python problem in this particular instance.
And we touched on several other interesting things on our way.

But first, the solution:

```python
#! /usr/bin/env python3

import click
import MySQLdb
import MySQLdb.cursors

class DebugCursor(MySQLdb.cursors.DictCursor):
    def _query(self, q):
        print(f"Debug: {q}")
        super()._query(q)

db_config = dict(
    host="localhost",
    user="kris",
    passwd="secret",
    db="kris",
    cursorclass=DebugCursor,
)

db = MySQLdb.connect(**db_config)

@click.group(help="Making WHERE IN great again.")
def sql():
    pass

@sql.command()
def make_table():
    sql1 = """drop table if exists insert_test"""
    sql2 = """create table insert_test ( id serial, d varchar(200) )"""
    sql3 = """insert into insert_test values ( NULL, %(value)s )"""

    c = db.cursor()
    c.execute(sql1)
    c.execute(sql2)
    for i in [ 'eins', 'zwei', 'drei', 'zw"ei', 'dr\ei' ]:
        c.execute(sql3, {"value": i})
    db.commit()

@sql.command()
def query():
    ary = [ 'eins', 'zwei', 'drei', 'zw"ei', 'dr\ei' ]
    print(f"{ary}")

    sql = "select d from insert_test where d in %(ary)s"
    c = db.cursor()
    c.execute(sql, {"ary": ary})
    res = c.fetchall()
    for r in res:
        print(r)

sql()
```

In case you didn't spot it: you can safely generate the `WHERE d IN …` clause by supplying a string placeholder and then handing it a `list`.
Do not provide parens, the list will bring its own: It is `select d from t where id in %s` and *not* `select d from t where id in ( %s )`.

# Why is that safe?

We are calling `cursor.execute(sql, args)` to run the SQL. 
`cursor` is from `MySQLdb`, which is the package `mysqlclient`, obviously.

## Wait, what?

In Python 2, there was a MySQL database class called `MySQLdb` in the package `MySQLdb`, which was not Python 3 compatible, and the maintainer vanished.
Also, Python 3 wanted to do away with upper case letters in package names, anyway.

So somebody took over the package, renamed it `mysqlclient` and made it Python 3 compatible, and kept the old class names in order to, uncharacteristically for Python, not break compatibility. 
Hence, you install the dependency `mysqlclient` to get the `MySQLdb` class.

Remember this the next time a Python person makes fun of your PHP needles and haystacks, or your Perl anything.

## Anyway…

In any case, the cursors are in `cursors.py`, hopefully somewhere in your venv.
And [`cursor.execute()`](https://github.com/PyMySQL/mysqlclient/blob/143129be8f57d3a0667f01c989b9776bd80c28d3/MySQLdb/cursors.py#L171-L207) looks something like this:

```python
171     def execute(self, query, args=None):
...
190         if args is not None:
191             if isinstance(args, dict):
192                 nargs = {}
193                 for key, item in args.items():
194                     if isinstance(key, str):
195                         key = key.encode(db.encoding)
196                     nargs[key] = db.literal(item)
197                 args = nargs
198             else:
199                 args = tuple(map(db.literal, args))
200             try:
201                 query = query % args
202             except TypeError as m:
203                 raise ProgrammingError(str(m))
204
205         assert isinstance(query, (bytes, bytearray))
206         res = self._query(query)
207         return res
```

So in line 201, the replacement is a simple old style Python string formatting, `query % args`.
This is then handed to `self._query()` in line 206.

Before that, in 190ff, the args are massaged.

If `args` is not a `dict`, we `map(db.literal, args)`, which happens to be defined in
[`connections.py:266`](https://github.com/PyMySQL/mysqlclient/blob/5c04abf87d32a3254dd481c03740a8c56520bc3a/MySQLdb/connections.py#L266-L287).
The function escapes the arg using the proper encoding required.
It ends up using 
[`string_literal()`](https://github.com/PyMySQL/mysqlclient/blob/204fb123683454cdb670e0065f09e50d425b94c8/MySQLdb/_mysql.c#L964-L1011),
which is defined in `_mysql`, a C-language wrapper that links against `libmysqlclient.so`, the C language client protocol library. 
And that in turn ends up being a call to 
[`mysql_real_escape_string_quote()`](https://github.com/PyMySQL/mysqlclient/blob/204fb123683454cdb670e0065f09e50d425b94c8/MySQLdb/_mysql.c#L1000), 
which is the appropriate function for this.

For `dicts`, similarly, the items are being enumerated and then `db.literal()` is applied.

So this is proven to work, and it uses the recommended escape function on parameters for MySQL.

# Debugging

We do hand the query off to
[`self._query()`](https://github.com/PyMySQL/mysqlclient/blob/143129be8f57d3a0667f01c989b9776bd80c28d3/MySQLdb/cursors.py#L316-L323)
in the end. And that does the following:

```python
    def _query(self, q):
        db = self._get_db()
        self._result = None
        db.query(q)
        self._do_get_result(db)
        self._post_get_result()
        self._executed = q
        return self.rowcount
```

That it, it fetches the existing database connection db, sends off the query and fetches and processes the result (so that you can call `cursor.fetchall()` or similar on it).
It also remembers the query string in `cursor._executed`, but only after the query ran without error.
And finally, it returns the rowcount.

We could debug by printing `cursor._executed`, but only if we don't need to debug and the query actually ran.
That is, because the assignment happens only after the `db.query()`, which in turn will throw an exception if there is a problem with our SQL.

So in order to actually debug, we need to do better:
We can specify a `cursorclass=` anyway, as a connection parameter.

We make our own cursorclass, `DebugCursor`, which we let inherit from our cursor class of choice.
I happen to be partial to `DictCursor`, so I inherit from that.

In my `DebugCursor`, I simply override `_query()`, log the query string and hand off things otherwise unchanged to the superclass. 
Because I do that before everything else, I get my log sent before stuff catches fire and my code burns to the ground.

That way I get to see the replaced SQL before it runs, even it if is gibberish.
So I can actually see that

```python
    sql = "select d from insert_test where d in ( %(ary)s )"
    c = db.cursor()
    c.execute(sql, {"ary": ary})
```
in which I supply my own parens, turns into

```console
$ python3 prep.py query
['eins', 'zwei', 'drei', 'zw"ei', 'dr\\ei']
Debug: b'select d from insert_test where d in ( (\'eins\',\'zwei\',\'drei\',\'zw\\"ei\',\'dr\\\\ei\') )'
Traceback (most recent call last):
  File "prep.py", line 54, in <module>
```
while without those extra parens I get
```console
$ python3 prep.py query
['eins', 'zwei', 'drei', 'zw"ei', 'dr\\ei']
Debug: b'select d from insert_test where d in (\'eins\',\'zwei\',\'drei\',\'zw\\"ei\',\'dr\\\\ei\')'
{'d': 'eins'}
{'d': 'zwei'}
{'d': 'drei'}
{'d': 'zw"ei'}
{'d': 'dr\\ei'}
```
and so I get to actually see that all is fine and well, and properly escaped.
