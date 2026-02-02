---
author: isotopp
title: "MySQL: FLUSH HOSTS"
date: "2025-05-13T05:06:07Z"
feature-img: assets/img/background/mysql.jpg
toc: true
tags:
  - lang_en
  - database
  - mysql
  - mysqldev
aliases:
  - /2025/05/13/mysql-flush-hosts.html
---

Sometimes, MySQL throws an error like this:
> Host '...' is blocked because of many connection errors
> 
> Unblock with 'mysqladmin flush-hosts'

This typically means that MySQL has blocked a host after too many connection errors. The usual fix is to run:

```console
mysqladmin flush-hosts
```

or

```mysql
mysql> FLUSH HOSTS; /* deprecated since 8.0.23; invalid in 8.4 */
mysql> TRUNCATE TABLE performance_schema.host_cache; /* recommended since 5.6.5 */
```

A host is blocked, because of many connection errors, specifically more connection errors than `max_connect_errors`.

So

- what counts as a connection error?
- what is counted per what?
- and how is the error count cleared?

# `max_connect_errors`

There is a configuration variable, `max_connect_errors`.
It is documented here:
[MySQL 8.4: `max_connect_errors`](https://dev.mysql.com/doc/refman/8.4/en/server-system-variables.html#sysvar_max_connect_errors).

The variable is a 64 bit integer, so it can be set to very large values.
It can be configured via command-line or config file (using dashes instead of underscores), or dynamically at runtime:

```mysql
SET GLOBAL max_connect_errors = 18446744073709551614;
```

Check it with

```mysql
SELECT @@global.max_connect_errors;
```
By default, it’s set to 100.

According to MySQL’s documentation,
a host is blocked after more than `max_connect_errors` connection attempts from that host fail without a successful connection in between.

This means:

- The error count is tracked per host.
- A successful connection resets the counter, but only if it happens before the threshold is exceeded.
- Once blocked, a host remains blocked indefinitely unless the cache is cleared.

# Unblocking

MySQL tracks blocked hosts using a structure called the host cache.

Before MySQL 5.6.5, there was no way to inspect the host cache.
You could run `FLUSH HOSTS` to reset it, but you couldn’t see which hosts were blocked or how many errors they had.

That was lamented by many people, among them yours truly [in 2006](https://bugs.mysql.com/bug.php?id=24906).
And Daniel van Eeden [in 2011](https://bugs.mysql.com/bug.php?id=59404), on behalf of Booking.com.
That was converted into [ML#5259](https://dev.mysql.com/worklog/task/?id=5259),
the implementation of `PERFORMANCE_SCHEMA.HOST_CACHE`.
It was implemented by Marc Alff starting in 7e3ba778349e8e2bd01b60d6b22f44f7f098d731 in 2-Aug 2011
(released in 5.6.5, after 29-Mar-2012).

Since then, you can query host cache details directly:

```mysql
SELECT * FROM performance_schema.host_cache;
```

You can also reset it with:

```mysql
TRUNCATE TABLE performance_schema.host_cache;
```

This works exactly like `FLUSH HOSTS`, but uses different permissions:

- `FLUSH HOSTS` requires the `RELOAD` privilege.
- `TRUNCATE TABLE performance_schema.host_cache` requires `DROP` privilege on that table.

**Note:** `FLUSH HOSTS` has been **deprecated as of MySQL 8.0.23 and is removed in MySQL 8.4.**

There is no way to unblock just one host—only clearing the entire host cache resets the counters and unblocks all hosts.

**Note:** Changing the host cache size using the `host_cache_size` global dynamic variable also flushes the host cache.
This requires the `SYSTEM_VARIABLES_ADMIN` privilege (formerly `SUPER`).

# The Host Cache is not a cache

Despite its name, the host cache does more than traditional caching.

A cache is a data structure that stores unchanging data locally, because retrieving the data again would be expensive.
A cache can be expired or fully deleted at any time without losing information,
because the original information can be (at cost) retrieved again. 

But MySQL’s host cache stores stateful data—specifically, security-related error counters.
Deleting a host cache entry removes:

- the ip-to-hostname mapping (which can be rebuilt)
- the host's connection error history (which can't)

This means that resetting the host cache has security implications.
That is increasingly unimportant in modern environments 
such as K8s clusters or virtualized environments with a control plane and a service mesh.
In other, more traditional environments it might not be.

# What Happens on Connection

When a client connects, MySQL runs `sql_connect.cc:check_connection()`, which checks the client’s IP address.

If `name-resolve` is enabled, which it is unless you run with `skip-name-resolve`,
MySQL attempts a reverse DNS lookup via `hostname_cache.cc:ip_to_hostname()`:

- If the IP is already in the host cache and marked valid, DNS lookup is skipped.
- Otherwise, MySQL tries to resolve the IP to a hostname (PTR record),
  then resolve the hostname back to an IP (A record).
  This is known as Forward Confirmed Reverse DNS (FCR).
- Only hostnames that pass both lookups are marked as "validated".

The host cache keeps track of connection errors in `ip_to_hostname()`
and will block the host if it exceeds the threshold set in `max_connect_errors`.

The function also uses the host cache itself, and will avoid DNS resolution if there is an entry that matches this IP.
It maintains error counts and will perform host blocking, if the error count exceeds `max_connect_errors`.

The cache uses LRU (Least Recently Used) eviction policy.
If more IPs try to connect than the cache can hold, old entries are removed—including their error counters.
This means that blocked hosts can become unblocked over time if they’re evicted.

Modern MySQL defaults host_cache_size to `-1`, which means it auto-sizes between 128 and 2000 based on `max_connections`.
In older versions the size was fixed.

None of the above will happen if the server is running with `skip-name-resolve`.

Specifically, the code in `sql_connect.cc:check_connection()` will, among other things, not even call `ip_to_hostname()`,
thus there will be no usage of the host cache, as no DNS resolution happens.
There will also be no blocking of hosts due to connection errors.

# Recommendations for Proxy and K8s users

**TIP:** Run `SHOW PROCESSLIST` multiple times, and check the visible connections. 
If they are all always the same host, this recommendation applies to you. 

You may be running MySQL in Kubernetes with a service mesh,
or you may be running MySQL with MySQL Router or MySQL Proxy.
In that case, all connections the server sees will originate from a single IP.

That means any error by any client will be attributed to the only IP the server sees.
Any single client running with a wrong password will block the only IP your system sees with failed login attempts.
It will lock out all users for all applications with no timeout.

> If the origin IP is `127.0.0.1` or `[::1]`, no entry in the host cache will be made, 
> as these addresses are specifically checked for, and are exempt.  
> **You do not need to act.**

If that IP number is fixed, but not one of these two special local addresses,
you **SHOULD** turn off `name-resolve` by running with `skip-name-resolve`.

- This will disable the DNS resolution.
- You now need to write access control entries with IP numbers
  (`GRANT ... TO user@32.16.8.4 ...`), 
  because names will no longer be resolved.
- Your server will no longer make DNS queries.
- No host blocking on IP will occur.
  You will be protected from clients hammering the server with a wrong password.
- You are not losing anything security-wise, as the server has no useful IP information anyway.
  Security must be handled by the service mesh.

You **COULD** also set the `host-cache-size=0` for the same effect, but that will still generate DNS queries,
and a lot of them (two, PTR and A, per connection attempt).
They will always be for that single IP, so they are easily cacheable in external caches.

You **SHOULD** set `max_connect_errors` to a large value (`2^64-1`) to prevent the host cache from locking out any host.
This has no additional benefits over running with `skip-name-resolve`: There will be only one host cache entry,
and there will be no per-host error counters, as all connections are seemingly coming from a single host.

All these measures are compatible, and you can deploy all three of them.
