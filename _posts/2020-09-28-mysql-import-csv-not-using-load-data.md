---
layout: post
title:  'MySQL: Import CSV, not using LOAD DATA'
author-id: isotopp
feature-img: assets/img/background/mysql.jpg
date: 2020-09-28 18:00:34 +0200
tags:
- lang_en
- mysql
- database
- erklaerbaer
- mysqldev
---
All over the Internet people are having trouble getting `LOAD DATA` and `LOAD DATA LOCAL` to work. Frankly, do not use them, and especially not the `LOCAL` variant. They are insecure, and even if you get them to work, they are limited and unlikely to do what you want. Write a small data load program as shown below.

## Not using LOAD DATA LOCAL

[The fine manual says](https://dev.mysql.com/doc/refman/8.0/en/load-data-local-security.html):

> The LOCAL version of LOAD DATA has two potential security issues:
> 
> - Because LOAD DATA LOCAL is an SQL statement, parsing occurs on the server side, and transfer of the file from the client host to the server host is initiated by the MySQL server, which tells the client the file named in the statement. In theory, a patched server could tell the client program to transfer a file of the server's choosing rather than the file named in the statement. Such a server could access any file on the client host to which the client user has read access. (A patched server could in fact reply with a file-transfer request to any statement, not just LOAD DATA LOCAL, so a more fundamental issue is that clients should not connect to untrusted servers.)
> 
> - In a Web environment where the clients are connecting from a Web server, a user could use LOAD DATA LOCAL to read any files that the Web server process has read access to (assuming that a user could run any statement against the SQL server). In this environment, the client with respect to the MySQL server actually is the Web server, not a remote program being run by users who connect to the Web server. 

The second issue in reality means that if the web server has a suitable SQL injection vulnerability, the attacker may use that to read any file the web server has access to, bouncing this through the database server.

In short, never use (or even enable) `LOAD DATA LOCAL`.

- `local_infile` is disabled in the server config, and you should keep it that way.
- client libraries are by default compiled with `ENABLED_LOCAL_INFILE` set to off. It can still be enabled using a call to the `mysql_options()` C-API, but never do that.
- 8.0.21+ places additional restrictions on this, to prevent you from being stupid (that is, actually enabling this anywhere).

## Not using LOAD DATA

The `LOAD DATA` variant of the command assumes that you place a file on the database server, into a directory in the file system of the server, and load it from there. In the age of "MySQL as a service" this is inconvenient to impossible, so forget about this option, too.

If you were able to do place files onto the system where your mysqld lives,

- your user needs to have `FILE` as a privilege, a global privilege (`GRANT FILE TO ... ON *.*`)
- the server variable [`secure_file_priv`](https://dev.mysql.com/doc/refman/8.0/en/server-system-variables.html#sysvar_secure_file_priv) needs to be set to a directory name, and that directory needs to be world-readable. `LOAD DATA` and `SELECT INTO OUTFILE` work only with filenames below this directory. Setting this variable requires a server restart, this is not a dynamic variable (on purpose).

Note that the variable can be `NULL` (this is secure in the sense that `LOAD DATA` is disabled) or empty (this is insecure in that there are no restrictions).

There is nothing preventing you from setting the variable to `/var/lib/mysql` or other dumb locations which would expose vital system files to load and save operations. Do not do this.

Also, a location such as `/tmp` or any other world-writeable directory would be dumb: Use a dedicated directory that is writeable by the import user only, and make sure that it is world-readable in order to make the command work.

**Better:** Do not use this command at all (and set `secure_file_priv` to NULL).

## Using data dump and load programs instead

We spoke about dumping a schema into CSV files in [Export the entire database to CSV]({% link _posts/2020-06-20-export-the-entire-database-to-csv.md %}) already.

To complete the discussion we need to provide a way to do the inverse and load data from a CSV file into a table.

The full code is in [load.py](https://github.com/isotopp/mysql-dev-examples/blob/master/mysql-csv/load.py).

The main idea is to open a `.csv` file with `csv.reader`, and then iterate over the rows. For each row, we execute an `INSERT` statement, and every few rows we also `COMMIT`.

In terms of dependencies, we rely on `MySQLdb` and `csv`:

```python
import MySQLdb
import csv
```

We need to know the name of a table, and the column names of that table (in the order in which they appear). 

We should also make sure we can change the delimiter and quoting character used by the CSV, and make the commit interval variable. 

Finally, we need to be able to connect to the database.

```python
# table to load into
table = "data"

# column names to load into
columns = [
    "id",
    "d",
    "e",
]

# formatting options
delimiter = ","
quotechar = '"'

# commit every commit_interval lines
commit_interval = 1000

# connect to database, set mysql_use_results mode for streaming
db_config = dict(
    host="localhost",
    user="kris",
    passwd="geheim",
    db="kris",
)
```

From this, we can build a database connection and an `INSERT` statement, using the table name and column names:

```python
db = MySQLdb.connect(**db_config)

# build a proper insert command
cmd = f"insert into {table} ( "
cmd += ", ".join(columns)
cmd += ") values ("
cmd += "%s," * len(columns)
cmd = cmd[:-1] + ")"
print(f"cmd = {cmd}")
```

The actual code is then rather simple: Open the CSV file, named after the table, and create a `csv.reader()`. Using this, we iterate over the rows.

For each row, we execute the insert statement.

Every `commit_interval` rows we commit, and for good measure we also commit after finishing, to make sure any remaining rows also get written out.

```python
with open(f"{table}.csv", "r") as csvfile:
    reader = csv.reader(csvfile, delimiter=delimiter, quotechar=quotechar)

    c = db.cursor()
    counter = 0

    # insert the rows as we read them
    for row in reader:
        c.execute(cmd, row)

        # ever commit_interval we issue a commit
        counter += 1
        if (counter % commit_interval) == 0:
            db.commit()

    # final commit to the remainder
    db.commit()
```

And that it. That's all the code. 

- No `FILE` privilege, 
- No special permissions besides `insert_priv` into the target table.
- No config in the database.
- No server restart to set up the permissions.

And using Python's multiprocessing, you could make it load multiple tables in parallel or chunk a very large table and load that in parallel - assuming you have database hardware that could profit from any of this.

In any case - this is simpler, more secure and less privileged than any of the broken `LOAD DATA` variants.

Don't use them, write a loader program.

Let's run it. First we generate some data, using the previous example from the partitions tutorial:

```console
(venv) kris@server:~/Python/mysql$ mysql-partitions/partitions.py setup-tables
(venv) kris@server:~/Python/mysql$ mysql-partitions/partitions.py start-processing
create p2 reason: not enough partitions
cmd = alter table data add partition ( partition p2 values less than ( 20000))
create p3 reason: not enough partitions
cmd = alter table data add partition ( partition p3 values less than ( 30000))
create p4 reason: not enough partitions
cmd = alter table data add partition ( partition p4 values less than ( 40000))
create p5 reason: not enough partitions
cmd = alter table data add partition ( partition p5 values less than ( 50000))
create p6 reason: not enough empty partitions
cmd = alter table data add partition ( partition p6 values less than ( 60000))
counter = 1000
counter = 2000
counter = 3000
counter = 4000
^CError in atexit._run_exitfuncs:               
...
```

We then dump the data, truncate the table, and reload the data. We count the rows to be sure we get all of them back.

```console
(venv) kris@server:~/Python/mysql$ mysql-csv/dump.py
table = data

(venv) kris@server:~/Python/mysql$ mysql -u kris -pgeheim kris -e 'select count(*) from data'
mysql: [Warning] Using a password on the command line interface can be insecure.
+----------+
| count(*) |
+----------+
|     4511 |
+----------+

(venv) kris@server:~/Python/mysql$ mysql -u kris -pgeheim kris -e 'truncate table data'
mysql: [Warning] Using a password on the command line interface can be insecure.

(venv) kris@server:~/Python/mysql$ mysql-csv/load.py
cmd = insert into data ( id, d, e) values (%s,%s,%s)

(venv) kris@server:~/Python/mysql$ mysql -u kris -pgeheim kris -e 'select count(*) from data'
mysql: [Warning] Using a password on the command line interface can be insecure.
+----------+
| count(*) |
+----------+
|     4511 |
+----------+
```
