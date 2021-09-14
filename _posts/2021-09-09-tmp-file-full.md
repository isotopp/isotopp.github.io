---
layout: post
title:  "MySQL: The table '../tmp/#sql…' is full"
author-id: isotopp
feature-img: assets/img/background/mysql.jpg
date: 2021-09-09 17:01:06 +0200
tags:
- lang_en
- mysql
- mysqldev
---
We observe a large number of messages of the kind

```console
The table '../tmp/#sql…' is full
```

# Before MySQL 8

In older Versions of MySQL, implied temporary tables are being created, whenever your `EXPLAIN` contained the phrase `using temporary`.

In this case, MySQL would create an in-memory temporary table to materialize an intermediate query result, and then continue to process the data from there. If that temporary table was larger than some configurable limit, the temporary table would instead be converted to a MyISAM table on disk, streamed out, and then work would continue with this.

This has a large number of disadvantages:

- A table in the `MEMORY` storage engine can have no variable length columns. That means, any `VARCHAR` column gets converted to a `CHAR` column in the `MEMORY` version of that table. 
  - **Example:** Your 5 byte (plus overhead) long '`hello`' in a `VARCHAR(255) CHARSET utf8` would turn into a 765 byte `CHAR(255) CHARSET utf8` monstrosity, right-padded with spaces.
- Memory used by `MEMORY` engine tables would be dynamically allocated on top of the other buffers the database uses, making the process size quite variable, depending on how many concurrent threads need to use temporary tables right now. This can lead to memory exhaustion and a visit from the OOM killer, or worse, to a paged out database server.
- When being streamed out to disk, the original variable length data types would be used, so you would not even see what caused the temporary table on disk in many cases, unless you looked very hard at the schema.
- Memory for efficient MyISAM table processing is usually not configured on an InnoDB MySQL instance.

Because of that, we encouraged our users at work to be wary of plans with `using temporary`, to avoid use of utf8 columns except for human generated data, and to employ certain techniques for writing queries that handle strings in a nicer way.

# MySQL 8 fixes this

Starting with MySQL 8, implicit temporary tables are using the InnoDB storage engine exclusively. That means, temporary tables have largely the same properties as any ordinary table.

- It is safe to use `VARCHAR(...) CHARSET utf8mb4`, and at work we now recommend that you use this to represent strings. Variable length data types are handled just fine. It is fine to use single byte character sets for internal strings (names of status fields and other internal strings), but even that is no longer necessary.
- There is no preconfigured limit to where the table is being streamed to disk.

This is being done by creating (internally and invisibly to you) a special tablespace for tmp tables. Tables created in this tablespace are InnoDB tables, but they are not redo-logged, because there is no need for them to be crash-safe. After all, tmp tables are supposed to be gone after a server restart.

This saves a ton of I/O and makes these tables very fast, while they are still compatible with the rest of the InnoDB engine.

tmp tables are now also using the InnoDB buffer pool, the fixed giant data structure that all other data in the server is using, so the memory consumption of the server process fluctuates a lot less.

All pages in the buffer pool need to be backed by files, so that they can be written out if space in the buffer pool becomes tight. For MySQL, this is the `innodb_temp_data_file_path config` variable.

At work, we configure this on our systems with a hard upper limit:

```console
innodb_temp_data_file_path=ibtmp1:12M:autoextend:max:100G
```

This means you get a file, `ibtmp1`, in the data directory of MySQL with an initial size of 12 MB. This file is autoextended in increments up to a maximum size of 100 GB - in the default configuration it is not limited.

If you need more, you are very likely holding the database wrong.

# "I am getting this error message"

Isolate the offending query, `EXPLAIN FORMAT=JSON` the plan and check if you can get rid of the `using temporary`. If it is using up a 100 GB temporary file space, something is very wrong.

You should not increase the 100 GB limit: The `ibtmp1` file will eat all your disk space, and you won't get it back, as tablespace files never shrink.
