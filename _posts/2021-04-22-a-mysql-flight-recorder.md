---
layout: post
title:  'A MySQL flight recorder'
author-id: isotopp
feature-img: assets/img/background/mysql.jpg
date: 2021-04-22 23:59:39 +0200
tags:
- lang_en
- mysql
---

Sometimes things go wrong, and it surely would be nice if you at least knew afterwards what happened. Where I work, we are running a shell script older than time itself, once a minute. The script writes files to `/var/log/mysql_pl`, into a directory named after the current weekday and named after the current hour and minute.

So when a box crashes on Thursday at 22:09, as long as I can login to it, I still can try to look at `/var/log/mysql_pl/Thu/22_0?` and try to reconstruct what happened before the crash. Often the buildup to catastrophe is clearly visible.

## A version in Python

Our shell script is not really portable or viable outside the work environment, so I rewrite a similar thing in Python. It has no dependencies outside of a base install of a modern Python, except for `mysqlclient` (`MySQLdb`) to connect to the database.

The full script is [available on github](https://github.com/isotopp/mysql-dev-examples/tree/master/mysql-flight-recorder).

## ini file

It requires an `*.ini` file, and searches for it in [a number of locations](https://github.com/isotopp/mysql-dev-examples/blob/master/mysql-flight-recorder/flight_recorder.py#L299-L314):

```python
    f = config.read(
        [
            "/etc/mysql/mysql-flight-recorder.ini",
            "/etc/mysql/mysql_flight_recorder.ini",
            os.path.expanduser("~/.mysql-flight-recorder.ini"),
            os.path.expanduser("~/.mysql_flight_recorder.ini"),
            os.path.expanduser("~/mysql-flight-recorder.ini"),
            os.path.expanduser("~/mysql_flight_recorder.ini"),
            "./.mysql-flight-recorder.ini",
            "./.mysql_flight_recorder.ini",
            "./mysql-flight-recorder.ini",
            "./mysql_flight_recorder.ini",
        ]
    )
```

So it is either `mysql_flight_recorder.ini` or `mysql-flight-recorder.ini` with underbars or dashes, in `/etc/mysql`, in your home as a dotfile or non-dotfile, or in the current directory as a dotfile or non-dotfile.

The `*.ini` files looks like this:

```console
[DEFAULT]
logdir = /home/kris/Python/mysql/mysql-flight-recorder/mysql_flight_recorder
pidfile = /home/kris/Python/mysql/mysql-flight-recorder/mysql_flight_recorder.pid
compresscmd= bzip2 -9f
```

That is, the `DEFAULT` section defines

- logdir: a direcory where to put the logfiles. 
- pidfile: It also needs a filename (as an absolute pathname) for a pidfile, which is being used to prevent concurrent execution.
- compresscmd: And finally, the logfiles can be compressed, and the compress command needs to be specified. The compress command needs to be given in a way that existing compressed files are overwritten, that is why in the example the `-f` option is given.

After that, for each host that is to be checked a section is defined. The section name defines the log file prefix, the `compresscmd` controls the suffix. In each section, we need to specify username, password, host and port for the connection. No attempt at using TLS is being made in my quick hack.

The default config shown produces

```console
(venv) kris@server:~/Python/mysql/mysql-flight-recorder$ ls -l mysql_flight_recorder/Thu/
total 48
-rw-rw-r-- 1 kris kris 21424 Apr 22 23:35 localhost_23_35.bz2
-rw-rw-r-- 1 kris kris 20975 Apr 22 23:36 localhost_23_36.bz2
...
```


## What is being logged?

We run

- `select version() as version`
- `show global status like 'Uptime'`
- `show full processlist`
- `show slave status` (this will need a version gate soon to use `show replica status`)
- `show engine innodb status`
- `select * from information_schema.innodb_trx`
- `select * from information_schema.innodb_locks` (this has a version gate and uses `select * from performance_schema.data_locks` on 8.0)
- `select * from information_schema.innodb_lock_waits` (this has a version gate and uses `select * from performance_schema.data_lock_waits` on 8.0)
- `select * from information_schema.innodb_cmp`
- `select * from information_schema.innodb_cmpmem`
- `select * from information_schema.innodb_metrics`
- `show global status`
- `show global variables`

That's a lot of data, but bzip2 compressed it to around 20KB per minute. At 10000 files per week this ends up using 200 MB of disk space, which is reasonable for a post-mortem data stash.

## Possible extensions

The original shell script has better support for TLS based communication, because it works using the command line client. The Python script needs TLS added.

The original shell script has some more version gating to handle older versions of MySQL and MariaDB. It tolerates missing data tables instead of terminating with an error.

The original shell script has a PMP trigger logic and can attach a gdb to the mysqld when certain conditions are met in order to PMP it. As we work only remotely in this version of the script, this is conceptually not supported.
