---
layout: post
title:  'MySQL: Binding the ORM'
author-id: isotopp
feature-img: assets/img/background/mysql.jpg
date: 2021-09-16 14:06:51 +0200
tags:
- lang_en
- mysql
- mysqldev
---
My task is to collect performance data about a single query, using `PERFORMANCE_SCHEMA` (P_S for short) in MySQL, to ship it elsewhere for integration with other data.

In a grander scheme of things, I will need to define what performance data from a query I am actually interested in.
I will also need to find a way to attribute the query (as seen on the server) to a point in the codebase of the client, which is not always easy when an ORM or other SQL generator is being used.
And finally I will need to find a way to view the query execution in the context of the client code execution, because the data access is only a part of the system performance.

This is about marking a query so that it can be identified in source and attributed to its origin in the codebase. 

In my scenario, I have control over the ORM or DAO.
I can look at the stackframe, identify the caller of the `execute` function and put filename and line number or other identifying information into the generated query text.
I could also get identifiers ("[tracing ids](https://github.com/opentracing/specification/blob/master/specification.md)") from the caller and pass them on, so the query execution can be a child span of the ORM call that made the SQL and ran it.

What will work?

# Comments are stripped from P_S

Let's try comments first. 
The [manual knows](https://dev.mysql.com/doc/refman/8.0/en/comments.html) three kinds of comments in MySQL:

- `/* ... */` C-like comments.
- `# ...` Shell-like comments.
- `-- ...` Not quite SQL-like comments.

With preserved comments I could put identifying information into the query string, and later extract it from P_S.
I could use this information to attribute the query and link it to its origin in code.

In one connection, I issue

```sql
mysql [localhost:8025] {msandbox} (kris) > select /* keks */ * from t;m t;
...
8192 rows in set (0.00 sec)
```

The result set is irrelevant, but I put a comment with `/* ... */` into the query string.

In P_S, I find

```sql
mysql [localhost:8025] {msandbox} (performance_schema) > select sql_text from events_statements_history where thread_id = 47 order by event_id desc limit 1;
+------------------+
| sql_text         |
+------------------+
| select  * from t |
+------------------+
1 row in set (0.00 sec)
```

The comment has been stripped, you can still see the double spaces.

Old fashioned SQL comments and shell comments seem to die already in the client:

```sql
mysql [localhost:8025] {msandbox} (kris) > select -- keks
    -> * from t limit 3;
...
3 rows in set (0.00 sec)

mysql [localhost:8025] {msandbox} (kris) > <cursor up>
mysql [localhost:8025] {msandbox} (kris) > select  * from t limit 3;
```

The same happens with Shell comments: Of course, again, the comment is not in P_S.

It is unclear why comments are stripped, and where. 
Maybe it is a vestige from the statement conditioning that was installed as a pre-stage to the late query cache, bless its rotten soul.

There seem to be two mechanisms, one for SQL and Shell comments, and one for C comments:
When looking at the client history, the Shell and SQL  comments are not recalled by the editor, but the C comment is.

This difference in treatment makes some sense, because MySQL uses magic C comments to control statement parsing for compatibility: `SELECT /*! 80000 NEW_KEYWORD */` is parsed as a `SELECT` by MySQL before version 8.0.0 and as `SELECT NEW_KEYWORD` by MySQL 8.0.0 and higher. This allows `mysqldump` and other programs to emit SQL code that degrades gracefully on older versions of MySQL.

Similar syntax, `/*+ ...*/` is used to control optimizer hints.

# New: Query attributes

Query Attributes are a newfangled thing (8.0.23 or newer) that allow a client to annotate a query.
The annotations are preserved in the server and are being made available in some contexts, but they do nothing.

[The manual](https://dev.mysql.com/doc/refman/8.0/en/query-attributes.html) explains this:

- Attributes are defined prior to sending a statement.
- They exist until the statement ends.
- While they exist, they can be accessed on the server side.

The examples given are exactly my use-case:
Transporting identifying information from the client into the sevrer, or injecting control information for a plugin from the client into the server in order to affect query processing in the server.

Query Attributes do nothing in the server.
The server does not look at them.

Query Attributes are supported by the C-API client and the MySQL command line client.
Not much support exists elsewhere, yet.

The basic exercise to check functions works:

```sql
mysql [localhost:8025] {msandbox} (mysql) > INSTALL COMPONENT "file://component_query_attributes";
...
mysql [localhost:8025] {msandbox} (mysql) > query_attributes n1 v2 n2 v3
mysql [localhost:8025] {msandbox} (mysql) > select 
 -> mysql_query_attribute_string('n1') AS 'attr 1',
 -> mysql_query_attribute_string('n2') AS 'attr 2', 
 -> mysql_query_attribute_string('n3') AS 'attr 3';
+--------+--------+--------+
| attr 1 | attr 2 | attr 3 |
+--------+--------+--------+
| v2     | v3     | NULL   |
+--------+--------+--------+
1 row in set (0.00 sec)
```

The plugin component is also visible in memory map of `mysqld`:

```console
kris@server:~$ grep query_attr /proc/94982/maps
7f7590f5b000-7f7590f5c000 r--p 00000000 fd:00 221893305                  /home/kris/opt/mysql/8.0.25/lib/plugin/component_query_attributes.so
7f7590f5c000-7f7590f5d000 r-xp 00001000 fd:00 221893305                  /home/kris/opt/mysql/8.0.25/lib/plugin/component_query_attributes.so
7f7590f5d000-7f7590f5e000 r--p 00002000 fd:00 221893305                  /home/kris/opt/mysql/8.0.25/lib/plugin/component_query_attributes.so
7f7590f5e000-7f7590f5f000 r--p 00002000 fd:00 221893305                  /home/kris/opt/mysql/8.0.25/lib/plugin/component_query_attributes.so
7f7590f5f000-7f7590f60000 rw-p 00003000 fd:00 221893305                  /home/kris/opt/mysql/8.0.25/lib/plugin/component_query_attributes.so
```

# Where to go from here?

I can generate a query in a client I control, and annotate the query with identifying information.
In my case this information will be

- A trace flag. If the query is to be traced, the trace flag will be present. The detault is: The query will not be traced.
- A set of three identifiers (alphanumeric strings: sha256 MACs, UUIDs or strings representing integer numbers). They are a root id, a parent id and a query id. These identifiers allow be to model a span/parent span relationship in a larger tracing context.

I need to find a hook in the server for a plugin.
The plugin must run after query execution, but with the execution plan, the query string and the P_S data for the query still present.
I am not yet familiar with this, and need to check the current server about what is on offer.
Maybe the hook that the audit plugin uses can be repurposed.

If the trace flag is set, it will need to access

- the query attributes
- the query plan that ran, if possible (Need to check what `EXPLAIN FOR CONNECTION` does)
- the information about the query execution that can be gathered from P_S data

It needs to transform this information into a single serialized form, for example a JSON string, and then exfil this in a way that does not block the server.

The generic way to do this in my environment has in the past been to send a UDP packet to localhost.
UDP to localhost is considered non-lossy, limited to 64K and dropping the data if the listener is not present.
A file write to an append-only file may also write, if there is a rotation/truncation mechanism.

I will then need to take the JSON in my client, transform it some more and send it to a tracing consumer, eg Jaeger, Lightstep, or in my case, Honeycomb.

The trace data will there be joined with spans from other components, including spans around the ORM that made the SQL and the code that called into the ORM.
This will allow to view the context of the query without having to grep for it, use modern web tools to analyze query execution in the context that generated it and generally unify SQL debugging with other application debugging.

This makes the need for specialized "Database Performance Monitoring" (DPM) software go away, at least for individual developers.
A DPM can still be useful for operational tasks, but these are usually served by telegrams MySQL collector, Prometheus and Grafana just fine (and these usually scale better than a DPM).
