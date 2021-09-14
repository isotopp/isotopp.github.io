---
layout: post
title:  'MySQL: Provisioning .mylogin.cnf'
author-id: isotopp
feature-img: assets/img/background/mysql.jpg
date: 2020-09-23 12:29:52:18 +0200
tags:
- lang_en
- mysql
- mysqldev
- database
---
MySQL uses connection and config parameters from a number of possible sources. The easiest way to find out where it is looking for config files is to run

```console
$ mysql --help | grep cnf
                      order of preference, my.cnf, $MYSQL_TCP_PORT,
/etc/my.cnf /etc/mysql/my.cnf /Users/kkoehntopp/homebrew/etc/my.cnf ~/.my.cnf
```

As can be seen, my version of the MySQL client checks in this order

- /etc/my.cnf
- /etc/mysql/my.cnf
- /Users/kkoehntopp/homebrew/etc/my/cnf
- ~/.my.cnf

The cnf file is a file in dot-ini syntax, so you have `[groups]` and each group contains lines with `key = value` pairs. Which groups are read?

```console
$ mysql --help | grep "groups are"
The following groups are read: mysql client
```

So in my case, I would create a `/Users/kkoehntopp/.my.cnf` looking like this:

```console
[client]
user=kris
password=geheim
host=127.0.0.1

[mysql]
database=kris
show-warnings
prompt=\U [\d]>\_
```

That is, I put general connection parameters such as the host, user and password into the `client` group, and program specific parameters such as database, prompt and others into program specific groups such as `mysql`. That way, the `mysqldump` and `mysql` programs will connect automatically, but the `mysql` options will not interfere with `mysqldump`.

## .mylogin.cnf

Some time in 2012, the `.mylogin.cnf` mechanism and the `mysql_config_editor` program were added. They provide little value in security as we will see, but allow storage of more than one set of credentials: It is now possible to store a number of login pathes (credential sets) in a mylogin file, and call the client program with `--login-path=...`. The client program will then read the mylogin file and use the connection parameters from there.

mylogin files are being made with the `mysql_config_editor` program, for example

```console
$ mysql_config_editor set --login-path=test --user=kris --host=localhost --password
Enter password: geheim

$ mysql_config_editor print --all
[local]
user = root
password = *****
host = localhost
[test]
user = kris
password = *****
host = localhost
```

will create a new mylogin, or amend an existing one, and define a login path named `test`. It will take the host and the username on the command line, but you cannot specify the password easily - it has to be typed in.

This makes provisioning hard - templating this in Ansible is not easy and dancing around with `expect` and friends is just silly.

## Working around this

A small [Python Program](https://github.com/isotopp/mysql-config-coder) based on a much older [article and PHP program](http://mysqldump.azundris.com/archives/104-.mylogin.cnf-password-recovery.html) of mine changes that.

It can decode and encode mylogin files, opening them up to Ansible templating. Just provision a valid mylogin file in plain text, encode it and delete the plain text original file.

The sample session looks like this:

```sql
# generate a dummy file
mysql_config_editor set --login-path=local --user=root --host=localhost --password
Password: keks

# decode this file
./mysql_config_coder.py decode ~/.mylogin.cnf mylogin.out
cat mylogin.out

# make changes to mylogin.out and
./mysql_config_coder.py encode mylogin.out mylogin.cnf
chmod 600 mylogin.cnf

# test with original
MYSQL_TEST_LOGIN_FILE=$(pwd)/mylogin.cnf
mysql_config_editor -v print --all
my_print_defaults -s local

# Note: mysql_config_editor will not print the password, just five stars
#       but my_print_defaults should also show the password.
```

The program depends on `click` and `pycrypto`, but really any implementation of `aes-128-ebc` should be easily usable.
