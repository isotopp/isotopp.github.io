---
author: isotopp
title: "MySQL: Plugin 'mysql_native_password' is not loaded"
description: "A user lost login to their database instance, which has been accidentally upgraded to 9.0. They had mysql_native_password active on the root account, with has been deprecated since 8.0 and has been removed in 9.0. Due to the upgrade they have lost access to their database. Here is how to recover this."
date: "2024-07-04T05:06:07Z"
feature-img: assets/img/background/mysql.jpg
toc: true
tags:
- lang_en
- database
- mysql
---

In `libera:#mysql` a user has been running MySQL in a docker container with `mysql:latest`.
This container got automatically upgraded to MySQL 9.0.0, an innovation release.

Part of the 9.0 release is the removal of the `mysql_native_password` plugin, which has been deprecated since 8.0.
The user now can no longer login to their database.
They have no backup and no replica.

We recreate the problem from scratch, using docker, and then recover the instance.

# Creating a test setup

On my system, I am using LVM2, and I am routinely using the XFS file system.
I am creating a 10 GB sized test filesystem, which I mount to `/a`.
In that, we create a `mysql` and a `conf` directory.

The official `mysql` image is running as UID 999, and that is visible outside the container.
There are ways around that, but for a short test we do not care.

```console
root@server:~# lvcreate -n mysqltest -L 10G data
  Logical volume "mysqltest" created.

root@server:~# mkfs -t xfs -f /dev/data/mysqltest
meta-data=/dev/data/mysqltest    isize=512    agcount=4, agsize=655360 blks
         =                       sectsz=512   attr=2, projid32bit=1
         =                       crc=1        finobt=1, sparse=1, rmapbt=1
         =                       reflink=1    bigtime=1 inobtcount=1 nrext64=0
data     =                       bsize=4096   blocks=2621440, imaxpct=25
         =                       sunit=0      swidth=0 blks
naming   =version 2              bsize=4096   ascii-ci=0, ftype=1
log      =internal log           bsize=4096   blocks=16384, version=2
         =                       sectsz=512   sunit=0 blks, lazy-count=1
realtime =none                   extsz=4096   blocks=0, rtextents=0
Discarding blocks...Done.

root@server:~# mount /dev/data/mysqltest /a

root@server:~# mkdir /a/{mysql,conf}

root@server:~# chown 999:999 /a/{mysql,conf}
```

# Recreating the original setup using MySQL 5.7

As `mysql_native_password` has been deprecated since 8.0,
we need to install a 5.7 image to reproduce the problem.

```console
root@server:~# docker pull mysql:5.7
5.7: Pulling from library/mysql
Digest: sha256:4bc6bc963e6d8443453676cae56536f4b8156d78bae03c0145cbe47c2aad73bb
Status: Image is up to date for mysql:5.7
docker.io/library/mysql:5.7
```

We run this image with datadir in `/a/mysql`, and we want a root password `cookie`.

```console
root@server:~# docker run -v/a/mysql:/var/lib/mysql --name mysqltest -e MYSQL_ROOT_PASSWORD=cookie --rm -d mysql:5.7
d16ab1076a328d91562970ed2870a273a2cdffd0eace263002c72fd360a7b4a4
```

We verify that the plugin used is indeed the to-be-deprecated `mysql_native_password`.

```console
root@server:~# docker exec -ti mysqltest bash
bash-4.2# mysql -u root -pcookie mysql
...
Server version: 5.7.44 MySQL Community Server (GPL)
...

mysql> select user, host, plugin from mysql.user;
+---------------+-----------+-----------------------+
| user          | host      | plugin                |
+---------------+-----------+-----------------------+
| root          | localhost | mysql_native_password |
| mysql.session | localhost | mysql_native_password |
| mysql.sys     | localhost | mysql_native_password |
| root          | %         | mysql_native_password |
+---------------+-----------+-----------------------+
4 rows in set (0.00 sec)
mysql> ^DBye
bash-4.2# kill 1
bash-4.2# root@server:~#

```

We have two `root` users, one `root@localhost`, the other `root@%`. 
All four users are on `mysql_native_password`.

# Upgrade to 8.0

Since we did `docker run ... -n mysqltest --rm`, the container was destroyed when it ended.
We ended it with `kill 1`, killing the init process inside the container.
This shuts down the database cleanly and drops us back to the host.

We pull 8.0 and run it.

```console
root@server:~# docker pull mysql:8.0
8.0: Pulling from library/mysql
Digest: sha256:134e2d1c7c517d05e5328a77aa5a165a314dc4c4116503e7e089494f4e398ab1
Status: Image is up to date for mysql:8.0
docker.io/library/mysql:8.0

root@server:~# docker run -v/a/mysql:/var/lib/mysql --name mysqltest -e MYSQL_ROOT_PASSWORD=cookie --rm -d mysql:8.0
10379b753d6a997b2f27b5d419ed84c083131d7ec95d3e3aa278ab858c77aa53
```

This has upgraded datadir, `/a/mysql`.

```console
root@server:~# docker logs mysqltest
2024-07-04T10:55:22.614834Z 0 [System] [MY-010116] [Server] /usr/sbin/mysqld (mysqld 8.0.38) starting as process 1
...
2024-07-04T10:55:27.248791Z 5 [System] [MY-013381] [Server] Server upgrade from '50700' to '80038' started.
2024-07-04T10:55:40.684280Z 5 [System] [MY-013381] [Server] Server upgrade from '50700' to '80038' completed.
...
```

We can still access the server.

```console
root@server:~# docker exec -ti mysqltest bash
bash-5.1# mysql -u root -pcookie mysql
...
Server version: 8.0.38 MySQL Community Server - GPL
...
mysql> select user, host, plugin from mysql.user;
+------------------+-----------+-----------------------+
| user             | host      | plugin                |
+------------------+-----------+-----------------------+
| root             | %         | mysql_native_password |
| mysql.infoschema | localhost | caching_sha2_password |
| mysql.session    | localhost | mysql_native_password |
| mysql.sys        | localhost | mysql_native_password |
| root             | localhost | mysql_native_password |
+------------------+-----------+-----------------------+
5 rows in set (0.00 sec)

mysql> ^DBye
bash-5.1# kill 1
bash-5.1# root@server:~#
```

An additional account, `mysql.infoschema`, as been created. 
This account already uses `caching_sha2_password`.

It is at this point where an upgrade to `caching_sha2_password` for all accounts should have happened.

# Upgrading to 8.4 and breaking the installation

We pull 8.4 and run it.

```console
root@server:~# docker pull mysql:8.4
8.4: Pulling from library/mysql
Digest: sha256:d26a69e1ef146c77ecfddf3128134e3a0f4c6123133725835818107037649827
Status: Image is up to date for mysql:8.4
docker.io/library/mysql:8.4
root@server:~# docker run -v/a/mysql:/var/lib/mysql --name mysqltest -e MYSQL_ROOT_PASSWORD=cookie --rm -d mysql:8.4
698e26254761711ee7bfff158adff9b6272bba1ce6171d68a18aab8367a8373f
```

Checking the log, we see the upgrade to 8.4 happening successfully.

```console
root@server:~# docker logs mysqltest
2024-07-04 11:02:46+00:00 [Note] [Entrypoint]: Entrypoint script for MySQL Server 8.4.1-1.el9 started.
2024-07-04T11:02:47.391266Z 1 [System] [MY-011090] [Server] Data dictionary upgrading from version '80023' to '80300'.
2024-07-04T11:02:47.828202Z 1 [System] [MY-013413] [Server] Data dictionary upgrade from version '80023' to '80300' completed.
2024-07-04T11:02:50.812570Z 4 [System] [MY-013381] [Server] Server upgrade from '80038' to '80401' started.
2024-07-04T11:02:58.720925Z 4 [System] [MY-013381] [Server] Server upgrade from '80038' to '80401' completed.
```

Trying to login new already fails:

```console
bash-5.1# mysql -u root -pcookie
mysql: [Warning] Using a password on the command line interface can be insecure.
ERROR 1524 (HY000): Plugin 'mysql_native_password' is not loaded
bash-5.1#
```

# Recovering the server

We copy `/etc/my.cnf` to datadir, and modify it:

```console
bash-5.1# cp /etc/my.cnf /var/lib/mysql/my.cnf
bash-5.1# kill 1
bash-5.1# root@server:~# tail -3 /a/mysql/my.cnf
socket=/var/run/mysqld/mysqld.sock

!includedir /etc/mysql/conf.d/
```

We modify the `my.cnf` file as follows:

- `mv` it to `/a/conf/my.cnf`.
- remove the `!includedir` section.
- put a `skip_grant_tables` into the `[mysqld]` section.

![](/uploads/2024/07/recover-root-01.png)

*Putting `skip_grant_tables` into the `[mysqld]` section of the `my.cnf`.*

This is the procedure documented in 
[the manual](https://dev.mysql.com/doc/refman/8.4/en/resetting-permissions.html),
**B.3.3.2 How to Reset the Root Password**, last subsection.
We use this approach because it works fine interactively,
and we can debug things as we go along.

We proceed to run the server with our modified `my.cnf` mapped into the image as a volume.
This will be layered over the existing `/etc/my.cnf` inside the image.

```console
root@server:~# docker run -v/a/conf/my.cnf:/etc/my.cnf  -v/a/mysql:/var/lib/mysql --name mysqltest -e MYSQL_ROOT_PASSWORD=cookie --rm -d mysql:8.4
6a5bb298fcdd7eb670b8d1403ab285a4492ad012ee659c1157579a37d127b739
root@server:~# docker exec -ti mysqltest bash
bash-5.1# grep skip /etc/my.cnf
skip-name-resolve
skip_grant_tables
```

We can now get into the server without any password at all.
We check the accounts present and their plugins.

After running `FLUSH PRIVILEGES;` the server is initialized enough
to allow us to run `GRANT` or `ALTER USER` statements.

We then start to fix accounts.

```console
bash-5.1# mysql
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 7
Server version: 8.4.1 MySQL Community Server - GPL
...
mysql> select user, host, plugin from mysql.user;
+------------------+-----------+-----------------------+
| user             | host      | plugin                |
+------------------+-----------+-----------------------+
| root             | %         | mysql_native_password |
| mysql.infoschema | localhost | caching_sha2_password |
| mysql.session    | localhost | mysql_native_password |
| mysql.sys        | localhost | mysql_native_password |
| root             | localhost | mysql_native_password |
+------------------+-----------+-----------------------+
5 rows in set (0.00 sec)

mysql> flush privileges;
Query OK, 0 rows affected (0.02 sec)
```

We need to fix `root@localhost`, `root@%`
and for good measure also want to create another root account named `newroot@localhost`,
just to show how that can be done.

# Upgrading the existing accounts and making a new one

Using the
[ALTER USER](https://dev.mysql.com/doc/refman/8.4/en/alter-user.html)
statement, we can modify existing accounts:

```console
mysql> alter user "root"@"localhost" identified with "caching_sha2_password" by "cookie";
Query OK, 0 rows affected (0.01 sec)

mysql> select user, host, plugin from mysql.user;
+------------------+-----------+-----------------------+
| user             | host      | plugin                |
+------------------+-----------+-----------------------+
| root             | %         | mysql_native_password |
| mysql.infoschema | localhost | caching_sha2_password |
| mysql.session    | localhost | mysql_native_password |
| mysql.sys        | localhost | mysql_native_password |
| root             | localhost | caching_sha2_password |
+------------------+-----------+-----------------------+
5 rows in set (0.01 sec)
```

Note how in the fifth row it now says "caching_sha2_password".
We apply the same change to `root@%`:

Finally, we create a new user "newroot@localhost", and make it another root user.
We check the `mysql.user` table to verify.

```console
mysql> alter user "root"@"%" identified with "caching_sha2_password" by "cookie";
Query OK, 0 rows affected (0.02 sec)

mysql> create user "newroot"@"localhost" identified with "caching_sha2_password" by "cookie";
Query OK, 0 rows affected (0.03 sec)

mysql> grant all on *.* to "newroot"@"localhost" with grant option;
Query OK, 0 rows affected, 1 warning (0.01 sec)

mysql> select user, host, plugin from mysql.user;
+------------------+-----------+-----------------------+
| user             | host      | plugin                |
+------------------+-----------+-----------------------+
| root             | %         | caching_sha2_password |
| mysql.infoschema | localhost | caching_sha2_password |
| mysql.session    | localhost | mysql_native_password |
| mysql.sys        | localhost | mysql_native_password |
| newroot          | localhost | caching_sha2_password |
| root             | localhost | caching_sha2_password |
+------------------+-----------+-----------------------+
6 rows in set (0.00 sec)
```

Some things to note:
- We did have to quote `"root"@"%"`, because it contained special characters.
  We got away with not quoting `root@localhost`.
- We did have to quote `"root"` and `"%"` separately. 
  The `@` is unquoted, it is a keyword, just as `ALTER`.
- We create a new user `newroot@localhost`.
  We then grant it the same privileges as `root`.
  We include `WITH GRANT OPTION`, so that `newroot` can pass these privileges on to other users.

This is now complete.
We can kill the server, and restart it with the original config by just leaving our overlay `my.cnf` off.

# Validation

```console
mysql> ^DBye
bash-5.1# kill 1
bash-5.1# root@server:~#

root@server:~# docker run -v/a/mysql:/var/lib/mysql --name mysqltest -e MYSQL_ROOT_PASSWORD=cookie --rm -p 3307:3306 -d mysql:8.4
f4c58332e5875bbb5e3040ac084b7da5dedbaf58ca8a3f3e3674e24aa2067194
root@server:~# docker exec -ti mysqltest bash
bash-5.1# mysql -u root -pcookie mysql
...
Server version: 8.4.1 MySQL Community Server - GPL

mysql> select current_user();
+----------------+
| current_user() |
+----------------+
| root@localhost |
+----------------+
1 row in set (0.00 sec)
```

Note that we did start the server with `-p 3307:3306`,
making the containers mysql at `3306` available on the host as port `3307`.

That means we can also try to use it from the host, using `root@%`.

```console
root@server:~# mysql -h 127.0.0.1 --port 3307 -u root -pcookie mysql
...
Server version: 8.4.1 MySQL Community Server - GPL
...
root@172.17.0.1 [mysql]> select current_user();
+----------------+
| current_user() |
+----------------+
| root@%         |
+----------------+
1 row in set (0.00 sec)

```

# Summary

We created a MySQL 5.7 in docker, and ran it with a persistent external volume.
We performed a series of upgrades to 8.0 and 8.4,
until we ran into a situation where the `mysql_native_password` authentication method no longer was recognized.

We then crafted a recovery `my.cnf` file with a `skip_grant_tables` config, mapped that into the container, and performed a recovery.

We have demonstrated the `ALTER USER` statements to upgrade the authentication method to `caching_sha2_password`.
We have also demonstrated how to create more users with a complete set of privileges.

We have demonstrated that the container is now reachable as root,
from inside the container and with an exported port from the outside.
