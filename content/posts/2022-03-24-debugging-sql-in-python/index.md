---
author: isotopp
date: "2022-03-24T08:35:00Z"
feature-img: assets/img/background/mysql.jpg
title: "Debugging SQL in Python"
tags:
- mysql
- mysqldev
- lang_en
aliases:
  - /2022/03/24/debugging-sql-in-python.html
---
When using MySQL with Python, you may want to use the `mysqlclient` library, which is what most people do and which will work just fine.
Or you are using the official MySQL 8 Connector/Python package, which will behave slightly differently, but maybe supports the unique MySQL 8 feature already that is not in `mysqlclient`, yet.

Your SQL may be hand-writtten, or it may be generated using SQL Alchemy, Django or some other package.
If the latter is the case, it may be useful to be able to see the actual SQL string that has been sent to the database in order to facilitate interactive debugging.

# Using mysqlclient

If you are using `mysqlclient` with Python, the class internally sends the SQL to the server in a method `_query(self, q)` in the Cursor class ([source](https://github.com/PyMySQL/mysqlclient/blob/6ebc1a1972dee69fb54b56867fc795ee220b5d79/MySQLdb/cursors.py#L206)).

The `_query(self, q)` method itself updates an `_executed` member of the cursor to store the literal query string sent to the server.
But it does so only after having sent the query.
On error, an exception is raised and `_executed` is not updated ([source](https://github.com/PyMySQL/mysqlclient/blob/6ebc1a1972dee69fb54b56867fc795ee220b5d79/MySQLdb/cursors.py#L316)).

To always get access to the actual query string, define a class `DebugCursor`, and specify it with your connection `**kwargs`. In `DebugCursor`, do the needful.

```python
#! /usr/bin/env python3
 
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
  cursorclass=DebugCursor,  # referenced class must be defined before
)
 
db = MySQLdb.connect(**db_config)
c = db.cursor(()
 
sql = "select d from testtable where id = 3" 
 
c.execute(sql)
print(c.fetchall())
```

In our class `DebugCursor`, we inherit from our cursor of choice.
We override `_query(self, q)`, printing the query string `q`, and then calling the parent class implementation.

The output:

```console
$ python3 probe.py
Debug: b'select d from testtable where id = 3'
({'d': 'drei'},)
```

We can use this to trace-log all literal SQL before it is being executed, even if the query string is invalid or contains syntax errors.

# Using MySQL Connector/Python

If you are using Oracle MySQL Connnector/Python to connect to the database, the implementation can internally use Cython or a Pure Python implementation of the protocol.

Both implementations behave slightly differently, unfortunately.
Only the Pure Python implementation can be debugged easily in all circumstances.
It is therefore important that you specify `use_pure=True` with your connection `**kwargs`.

The raw SQL statement will be found in the cursor's `_executed` member.
If you are using multi-statements (don't!), they will be logged in the `_executed_list`.

We write:

```python
import mysql.connector
import mysql.connector.errors
 
db_config = dict(
  host="127.0.0.1",
  user="kris",
  passwd="geheim",
  db="kris",
  use_pure=True,
)
 
db = mysql.connector.connect(**db_config)
c = db.cursor()
 
print("=== Valid SQL: ")
sql = "select d from testtable where id = 3"
c.execute(sql)
print(f"Debug: {c._executed}")
print(c.fetchall())
print()
 
print("=== Invalid SQL: ")
sql = "syntaxerror d from testtable where id = 3"
try:
    c.execute(sql)
except mysql.connector.errors.ProgrammingError as e:
    print(f"Debug: {c._executed}")
    print(f"Error: {e}")
```

The output looks like this:

```console
$ python3 probe.py
=== Valid SQL:
Debug: b'select d from testtable where id = 3'
[('drei',)]
 
=== Invalid SQL:
Debug: b'syntaxerror d from testtable where id = 3'
Error: 1064 (42000): You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near 'syntaxerror d from testtable where id = 3' at line 1
```

Again, we can use this to trace raw SQL and identify actual generated SQL syntax much easier.
This will allow us to pick up the literal SQL string, and debug interactively.

The same program, when run without `use_pure=True`, will not update `c._executed` properly if the SQL is malformed.
It will produce the following output, which is worthless for debugging:

```console
$ python3 probe.py
=== Valid SQL:
Debug: b'select d from testtable where id = 3'
[('drei',)]
 
=== Invalid SQL:
Debug: b'select d from testtable where id = 3'
Error: 1064 (42000): You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near 'syntaxerror d from testtable where id = 3' at line 1
```

Note how `c._executed` still holds the previous statement and not the statement that actually errored.
