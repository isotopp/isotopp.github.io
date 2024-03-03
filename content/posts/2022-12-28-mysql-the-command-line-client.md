---
author: isotopp
title: "MySQL: The command line client"
date: 2022-09-08T12:13:00Z
feature-img: assets/img/background/mysql.jpg
tags:
- lang_en
- mysql
- mysqldev
---

When asking for help in [Libera Chat](https://libera.chat/), in the `#mysql` channel, people will ask you to use the `mysql` command line client.
They will also point you to [dbfiddle.uk](https://dbfiddle.uk/) for asking questions.
Specifically, when using phpMyAdmin, you will get hate.

Why is that?

When asking for help, it is almost impossible to help a GUI user, because they will need to paste screenshots in order to document what they did.
The screenshots do not help us.
They are hard to read, and do not contain the information about the problem you need help with in textual form.

Also, it is often that GUI users do not see all the details from a large result set cell.
Specifically, things such as the output of `SHOW ENGINE INNODB STATUS` and similar usually fail to display in a GUI in a meaningful way.
This is never a problem with a command line client, even if that client is used in a wrong way.

Finally, many GUI clients disconnect and reconnect between queries, and this is hardly documented.
This makes it impossible to use 
[connection scoped state]({{< relref "/2020-07-28-mysql-connection-scoped-state.md" >}}),
such as transactions, @variables or per-session config.
Specifically, by construction, phpMyAdmin cannot handle this at all.

This is why we ask users to use the `mysql` command line client.
It works, we know it works, and it can handle large result sets in a way that is helpful to you and us.

# Using \g and \G

The `mysql` command line client has an online help.
Type `\h` and read it.
It is useful.

The command line client also has `readline` support.
That means, emacs editing keys and cursor keys work.
You can `C-A`, `C-E`, `Esc f` and `Esc b` and similar.
You can `C-R` for history search.

The command line client requires that you use `;` or `\g` ("go") to terminate a command.
This will print the result set in a box.

```mysql
kris@localhost [kris]> show tables;
+----------------+
| Tables_in_kris |
+----------------+
| t              |
+----------------+
1 row in set (0.00 sec)

kris@localhost [kris]> select * from t;
+----+------------+
| id | start_date |
+----+------------+
|  1 | 2022-11-01 |
|  2 | 2022-11-02 |
|  3 | 2022-10-09 |
|  4 | 2022-09-01 |
+----+------------+
4 rows in set (0.00 sec)

```

You can also use `\G` (note the upper case "G") to terminate a command.
This will output results as Key-Value pairs.

```mysql
kris@localhost [kris]> show tables\G
*************************** 1. row ***************************
Tables_in_kris: t
1 row in set (0.00 sec)

kris@localhost [kris]> select * from t\G
*************************** 1. row ***************************
        id: 1
start_date: 2022-11-01
*************************** 2. row ***************************
        id: 2
start_date: 2022-11-02
*************************** 3. row ***************************
        id: 3
start_date: 2022-10-09
*************************** 4. row ***************************
        id: 4
start_date: 2022-09-01
4 rows in set (0.00 sec)
```

# $HOME/.my.cnf

The `mysql` command line client will read a `$HOME/.my.cnf`, if you install one.
It will, among other sections, also read the `[mysql]` section.

Here is a meaningful `$HOME/.my.cnf`.
Note that in my case, I include a cleartext password for a throwaway user on purpose, for convenience.

```console
kris@server:~$ cat .my.cnf
[mysql]
user=kris
password=geheim
database=kris
show-warnings
prompt=\U [\d]>\_
```

I am using `prompt=` to get a useful prompt.
I am using `show-warnings`, because I do want to see all warnings, all the time, straight into my face.

I could put the connection data (`user=` and `password=`) into a `[client]` section.
This would also be read by `mysqldump` and friends, and make it even more convenient.

# Pager

Sometimes I use

```mysql
mysql> pager less
mysql> select * from largetable where condition='manyrows';
...
```

The `select` result will then show up in `less`, which is useful.
I can disable this with `nopager`, or by using `pager` with no argument.

Sometimes I do

```mysql
mysql> pager grep whatIwant
mysql> select * from largetable where condition='hardtofind';
...
mysql> nopager
```

This will pipe the result through `grep` instead of using `less`.
Yes, this is funny, because using `grep` on a database result is a kind of joke.
But it is also useful.

# pager pspg

If you want, you can install `pspg` and use `pager pspg` to get fancier output.
Try

```mysql
mysql> pager pspg
mysql> select * from t;
```

It will work:

![](/uploads/2022/12/mysql-client-01.png)
*`pager pspg` shows the output of `select * from t`. The cursor can be moved to select rows and columns. Hit `q` to quit.*

It will also handle `SHOW ENGINE INNODB STATUS` just fine.

![](/uploads/2022/12/mysql-client-02.png)
*The oversized output of `SHOW ENGINE INNODB STATUS` in `pager pspg` in the MySQL command line client.*

Note that `pspg` kind of defeats the purpose of the Command Line client for copy and pasteable results.
Do not use it when asking for help or working with dbfiddle.
Do use it at other times, if you care.

This article mostly exists so that I can paste the URL when needed.
