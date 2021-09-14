---
layout: post
title:  'MySQL: Some Character Set Basics'
author-id: isotopp
feature-img: assets/img/background/mysql.jpg
date: 2020-08-18 08:57:10 +0200
tags:
- lang_en
- mysql
- mysqldev
- database
- erklaerbaer
---
This is the updated and english version of some older posts of mine in German. It is likely still incomplete, and will need information added to match current MySQL, but hopefully it is already useful.

Old source articles in German: [1](https://blog.koehntopp.info/2006/10/01/mysql-zeichensatz-grundlagen.html), [2](https://blog.koehntopp.info/2006/08/06/zeichensatz-rger.html) and [3](https://blog.koehntopp.info/2012/02/10/faq-mein-mysqldump-zerst-rt-meine-umlaute.html).

## Some vocabulary

![](/uploads/charset.png)

*Symbol, Font, Encoding and Collation - what do they even mean?*

A character set is a collection of symbols that belong together. That is a completely abstract thing, and also almost useless. The only thing you can do with a character set is decide if a specific symbol is legal within a context or not. And, if it is legal, what position the symbol in the character set has (the code point).

To be able to print symbols they need a shape, which is defined in a Font. For example is this here: "<span style="font-family: Arial; font-size: 24px; font-weight: normal;">ö</span>" a letter "ö" in Arial, and "<span style="font-family: 'Times New Roman'; font-size: 24px; font-style: normal;">ö</span>" the same thing in a different font, Times New Roman.

To be able to use symbols with computers they need a binary represenation of their code point, an encoding. In my Terminal we are using utf8. The Text "Köhntopp" is being represented as the byte sequence `4b c3 b6 68 6e 74 6f 70 70`. [LATIN SMALL LETTER O WITH DIARESIS](https://www.compart.com/en/unicode/U+00F6) has the code point `0x00F6`, which is being represented as `C3 B6` in utf8 encoding.

```console
$ echo Köhntopp | hexdump -C
00000000  4b c3 b6 68 6e 74 6f 70  70 0a                    |K..hntopp.|
0000000a
```

If I change the terminal settings to use ISO-8859-1 ("Latin1") instead, the same text is being encoded differently - `4b f6 68 6e 74 6f 70 70`. The ö is now `F6`.

```console
$ echo Köhntopp | hexdump -C
00000000  4b f6 68 6e 74 6f 70  70 0a                       |K.hntopp.|
00000009
```

If you have two character sequences and want to compare or sort them, you need a set of comparison and ordering rules, a collation. You can think of a collation as a canonical representation of an encoding for comparison and sorting.

For example, the collation latin1_german1_ci represents "Köhntopp" internally as "kohntopp" and uses this internal represenation to compare it to other strings or sort it. But in storage we always find the original string, "Köhntopp".

There is a second german language collation, latin1_german2_ci, which internally writes "Köhntopp" as "koehntopp" to compare and sort - but it will also save the same "Köhntopp" to disk.

## The variants of Unicode and Unicode encoding

ASCII was a 7bit character set of 128 characters from 0 to 127. It works with english, but with almost no other writing systems in the world.

A set of 8 bit character sets were defined in ISO-8859, among them ISO-8859-1 ("latin1"), later slightly revised to ISO-8859-15 (modified to contain, among other things, the Euro sign). The code points that exist in both ISO-8859-1 and ASCII are identical, ISO-8859-1 is a full superset of ASCII. 

ISO-8859 also contained other character sets for Cyrillic, Arabic, Greek, Hebrew and other languages, but because of the limitation to 8 bits, it was not possible to easily write text that switches between languages.

> *Note:* The character set called `latin1` in MySQL is actually `Windows CP1252`, which is a superset of `iso-8859-1`. See [this article](https://mysqlserverteam.com/debugging-character-set-issues-by-example/) for details.

Unicode development started in 1991 as a 16 bit character set, and it was assumed that this is sufficient to hold all characters from all possible writing systems. Unicode was design as a superset of ISO-8859-1, so codepoints that exist in both character sets are identical.

In 1996 it became clear that a set of 65536 characters was not sufficient, and Unicode 2.0 was fitted with an extension mechanism to allow more than 65536 symbols. Again, this extension is a true superset of original Unicode.

As of March 2020, Unicode 13.0 contains some 140k characters from 154 writing systems. The definition of Unicode 13.0 currently allows for 1.112064 possible characters. Some code points in the lower 65536 characters are reserved to encode *surrogate pairs*, basically extension characters for the original 16 bit character set, resulting in a weird number for the total possible characters.

16 Bit Unicode can be stored as UCS2 (what Windows NT used to use) - a fixed length encoding, which instead of 8 bit characters now uses 16 bit characters. When writing western languages, every other byte in text is 0.

UTF-16 extends UCS2 and uses variable length encoding of 2 bytes or 4 bytes to allow representation of all unicode characters, even those beyond the initial 65536 characters.

Unix systems tend to use UTF-8 (utf8), a variable length encoding in which Unicode characters are 1-3 bytes in length (for the initial 65536 characters of Unicode 1.0), or 1-4 bytes in length (for full unicode).

## MySQL Server Terms

MySQL names an encoding a "CHARACTER SET" or "CHARSET". The charsets available in the server can be listed with `SHOW CHARSET`, or by searching through `INFORMATION_SCHEMA.CHARACTER_SETS`. In both cases, looking at the `Maxlen` column will tell you how long a symbols encoding in bytes can become in the worst case.

Conversely, `SHOW COLLATION` (and `INFORMATION_SCHEMA.COLLATIONS`) will show you the collations the server knows about. Collations are not things that can be used standalone, they always belong to charsets. So `INFORMATION_SCHEMA.COLLATION_CHARACTER_SET_APPLICABILITY` tells you which collation can be used with which character set (or you `SHOW COLLATION WHERE Charset = "..."`).

## MySQL objects with a character set and collation

The only storage thing in MySQL that *has* a character set and a collation is a column. Columns that store text (`VARCHAR`, all `TEXT` types, textual `enum` and JSON objects) have a character set and a collation. In JSON it is fixed by the standard, for the others we can set it. Other things such as tables, databases and servers provide a hierarchy of defaults.

The other thing in MySQL that *has* a character set and a collation is the connection. For the purpose of our discussion the connection represents the character set that your terminal or application uses in the server. So when you tell the server with `SET NAMES` what you are using, the server believes you.

MySQL converts, if possible, between connection and column. So when you send a string in utf8 through your connection that ends up being stored in a latin1 column, MySQL will turn that `0xc3b6` in the connection into a `0xf6` on disk. On read, it will do the opposite, if necessary and possible.

MySQL also converts if you convert columns. So if you `ALTER TABLE t MODIFY COLUMN c VARCHAR(80) CHARSET utf8` and that was previously a latin1 column, MySQL will take the `0xf6`es and turn them into `0xc3b6`es instead. All of that is automatic, safe and lossless, if possible. There are warnings and errors if not.

But let's look at the details step by step.

## Setting charset and collation on a column

Every string in MySQL is labeled with an charset and a collation. For database objects that happens at the column level: A column with CHAR, VARCHAR, or any TEXT type always has a charset and a collation. The same can be true for an ENUM type that contains strings.

If you define these without specifying, the column will inherit the table defaults. If you specify no table default, the table will inherit the database default, which in turn inherits from the server default, which is defined in the `my.cnf`:

```console
[mysqld]
default-character-set=utf8mb4
default-collation=utf8_0900_ai_ci
```

Or you set them at the database level:

```sql
mysql> show create database kris\G
       Database: kris
Create Database: CREATE DATABASE `kris` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */
1 row in set (0.01 sec)
```

Or at the table level:

```sql
mysql> show create table chset\G
       Table: chset
Create Table: CREATE TABLE `chset` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `c` char(20) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `d` varchar(20) CHARACTER SET cp850 COLLATE cp850_general_ci DEFAULT NULL,
  `t` text CHARACTER SET latin1 COLLATE latin1_german1_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
1 row in set (0.00 sec)
```

## String Literals

A string literal in MySQL is written in double quotes, "a string literal". When nothing else is specified, the connections character set and collation are being used.

An identifier in MySQL is written as a bare word `tablename` or written in backticks \``weird tablename`\`. When written in backticks, the identifier can contain any utf8 unicode character (unfortunately, not utf8mb4 character, so you have to constrain yourself to the BMP). *Don't do this in production, though.*

```sql
mysql> create table `❤` ( `✔` serial ) ;
Query OK, 0 rows affected (0.07 sec)

mysql> insert into `❤` values (1);
Query OK, 1 row affected (0.02 sec)

mysql> select * from `❤`;
+-----+
| ✔   |
+-----+
|   1 |
+-----+
1 row in set (0.00 sec)
```

If you check, the table is stored with the filename `@2764.ibd` on disk.

The full notation for a string literal is `_charsetname "string" COLLATE collationname`. The `_charsetname` thing is called an introducer and tells the parser what character set label to put on the string that follows. It does not convert, the `CONVERT()` function would do that.

A string literal can also be written as `X'hexcode'`, so this works:

```sql
mysql> select _latin1 X'F6' as umlaut;
+--------+
| umlaut |
+--------+
| ö      |
+--------+
1 row in set (0.00 sec)
```

This creates a string literal from the hex code `0xF6` and labels it as latin1. The statement is then run, produces an Umlaut, and this Umlaut is then emitted as a result table. Because the connection is set to utf8, the Umlaut is converted to utf8, yields `C3 B6` and that is sent to the terminal, where it renders correctly.

This is the automatic conversion at work, that I spoke about earlier.

When we leave the label off, the conversion does not work. When we lie, the result is invalid and rejected:

```sql
mysql> select X'F6' as umlaut;
+----------------+
| umlaut         |
+----------------+
| 0xF6           |
+----------------+
1 row in set (0.00 sec)

mysql> select _utf8 X'F6' as umlaut;
ERROR 1300 (HY000): Invalid utf8 character string: 'F6'
```

## Charset on a connection

The *other* thing that has a character set is the connection from the client to the database server. That is required, because when you type for example "ö" into a utf8 terminal to send it to `kris.chset`, column `t` as defined above, it has to be converted from utf8 (`C3B6`) to latin1 (`F6`), because the column `t` is defined with a charset of latin1.

MySQL does that automatically for you, if a conversion exists: You sent a utf8 `c3b6`, MySQL detects the column defined as latin1, and tries to convert, yielding `f6`, which is then stored.

How do you tell MySQL what charset the connection uses?

You can set a default with `default-character-set` and `default-encoding` in the `[mysql]` section of your `my.cnf` to tell MySQL what character set your terminal uses, or use the command `SET NAMES` to change it on the fly.

If I am setting up my terminal to send utf8, and `SET NAMES utf8`, these things match and all will be well and converted correctly, if at all possible.

I can check, using the `HEX()` function to see the actual bytes:

```sql
root@localhost [kris]> set names utf8;
Query OK, 0 rows affected (0.00 sec)

root@localhost [kris]> select hex("ö");
+-----------+
| hex("ö") |
+-----------+
| C3B6      |
+-----------+
1 row in set (0.00 sec)
```

Switching my terminal to latin1, and then telling the database about this with `SET NAMES latin1`, I get:

```sql
root@localhost [kris]> set names latin1;
Query OK, 0 rows affected (0.00 sec)

root@localhost [kris]> select hex("ö");
+----------+
| hex("ö") |
+----------+
| F6       |
+----------+
1 row in set (0.00 sec)
```

So this actually works.

## MySQL converts automatically

Now, let's use a utf8-Client to store data into a column into `kris.chset.t`, which is latin1. What will happen?

MySQL converts this automatically and we can show this.

```sql
root@localhost [kris]> set names utf8;
Query OK, 0 rows affected (0.00 sec)

mysql> insert into kris.chset (id, t) values ( 1, "ö");
Query OK, 1 row affected (0.02 sec)

mysql> select hex("ö"), hex(t), t from kris.chset where id = 1;
+-----------+--------+------+
| hex("ö")  | hex(t) | t    |
+-----------+--------+------+
| C3B6      | F6     | ö    |
+-----------+--------+------+
1 row in set (0.00 sec)
```

I am sending `SET NAMES utf8` and I am inserting a row `id=1` into the table `kris.chset` (see above for the definition, which has the charset latin1).

Selecting the value back, I see the hex code for an actual "ö", `C3B6`, utf8, so I know my terminal sends utf8. 

I also see the hex code stored in the table, `F6`, by selecting the column value from `t`, wrapped in the `HEX()` function.

And on reading that back, I am still getting an "ö". That proves the database sent me a `C3B6`, converting back from the storage character set to the terminal character set, as declared with `SET NAMES`.

So as long as I am not lying to the database about what my connection sends, values should be transparently converted back and forth if at all possible.

## CONVERT(), LENGTH() and CHAR_LENGTH() functions

Normally you will never need this, but it is possible to change the character set of a column or string literal explicitly using the `convert( ... using ... )` function:

```sql
mysql> select hex("ö");
+-----------+
| hex("ö")  |
+-----------+
| C3B6      |
+-----------+
1 row in set (0.00 sec)

mysql> select hex(convert("Köhntopp" using latin1)) as example;
+------------------+
| example          |
+------------------+
| 4BF6686E746F7070 |
+------------------+
1 row in set (0.00 sec)
```

After validating that my umlaut is indeed sent as `C3B6`, I am using a string with an Umlaut as an input to `CONVERT( ... USING ... )`. I am converting to latin1, and as you can see, I am indeed getting an `F6` as the second byte.

There are other encodings of unicode, too. Windows systems for example often use ucs2 instead of utf8. That is, each symbol is stored as a 16 bit code:

```sql
mysql> select hex(convert("Köhntopp" using ucs2)) as example;
+----------------------------------+
| example                          |
+----------------------------------+
| 004B00F60068006E0074006F00700070 |
+----------------------------------+
1 row in set (0.00 sec)
```

My Umlaut ends up being `00f6` on disk.

The points to take away from this: Some character sets have fixed length codes for letters. In latin1, each letter takes the fixed amount of one byte. In ucs2, each letter takes the fixed amount of 2 bytes.

Other character set have variable length encodings. In utf8, each letter can be between 1 and 3 bytes long. Later Unicode extensions define a larger character set, and utf32 stores them in a fixed set of 4 byte characters (3 of them 0 for the latin1 subset), while utf8mb4 stores them in 1 to 4 bytes, depending on the symbol.

Depending on what we want to know we have to ask differently:

```sql
mysql> select length("Köhntopp") as len, char_length("Köhntopp") as clen;
+-----+------+
| len | clen |
+-----+------+
|   9 |    8 |
+-----+------+
1 row in set (0.00 sec)

mysql> select length(convert("Köhntopp" using ucs2)) as len, char_length(convert("Köhntopp" using ucs2)) as clen;
+------+------+
| len  | clen |
+------+------+
|   16 |    8 |
+------+------+
1 row in set (0.00 sec)
```

The function `LENGTH()` gives us the length of a symbol or string in bytes, which is dependent on the character set encoding used. The function `CHAR_LENGTH()` gives us the length of the symbol or string in symbols, which is fixed and independent of the character set encoding.

It is important to use the right function depending on what you want to know.

The default character set in MySQL you should be using is `utf8mb4`.

## Comparison and Sorting

When MySQL originally gained character set support, this was done by implementing a comparison function. The same function was used for sorting and comparison. So when "Köhntopp" sorts as "kohntopp" in the latin1_german1_ci collation, it also means that searching for "Köhntopp" will find "Köhntopp" as well as "kohntopp", because to the comparison function they are the same string.

```sql
mysql> show create table t \G
       Table: t
Create Table: CREATE TABLE `t` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `d` varchar(20) CHARACTER SET latin1 COLLATE latin1_german1_ci DEFAULT NULL,
  UNIQUE KEY `id` (`id`)
)
1 row in set (0.00 sec)

mysql> select * from t;
+----+-----------+
| id | d         |
+----+-----------+
|  1 | Köhntopp  |
|  2 | kohntopp  |
+----+-----------+
2 rows in set (0.00 sec)

mysql> select * from t where d = "Köhntopp";
+----+-----------+
| id | d         |
+----+-----------+
|  1 | Köhntopp  |
|  2 | kohntopp  |
+----+-----------+
2 rows in set (0.00 sec)
```

This was not exactly what most people expected, so in MySQL 8 things are a bit more differentiated when using `utf8mb4`. From [the manual](https://dev.mysql.com/doc/refman/8.0/en/charset-collation-names.html):

| Suffix | Meaning |
+--------+---------+
| _ai    | Accent-insensitive |
| _as    | Accent-sensitive   |
| _ci    | Case-insensitive   |
| _cs    | Case-sensitive     |
| _ks    | Kana-sensitive     |
| _bin   | Binary             |

"Kana-sensitive" collations distinguish Hiragana characters from Katakana characters in Japanese.

The collation you want with utf8mb4 is `utf8mb4_0900_ai_ci` (and replace ai and ci as necessary). The 0900 part is a reference to [UCA 9.0.0](http://www.unicode.org/Public/UCA/9.0.0/allkeys.txt), the current Unicode Comparison Algorithm. MySQL also supports UCA 5.2.0 (`utf8mb4_520_ci`) and 4.0.0 (`utf8mb4_unicode_ci`), but these have no ai/as variants.

UCA 9.0.0 solves the Köhntopp/koehntopp problem by defining different functions for searching things (testing for equality) and ordering (testing for smaller than).

## Why utf8mb4, and not simply utf8?

MySQL gained character set support with the MySQL 4.1 series of server releases in 2003. At that time, in MySQL utf8 was a character set with room for 65536 (2^16) code points, and the UCS2 encoding (for 16 bit fixed width characters used in Windows) plus the UTF8 encoding (for variable length characters of 1-3 bytes in length).

MySQL at that point in time changed character sets and collations several times, as bugs were detected and fixed.

This created a lot of problems: In databases, an Index is created by extracting the indexed column from a table, sorting it, and storing it next to the table in sorted order with pointers to the original rows. An index is, in short, a materialized order for the indexed column, in order to speed searches.

Now if you change the character set or the order of symbols in the character set by fixing the collation, the materialized order of the index differs from newly fixed and redefined order to the fixed collation. When upgrading to the changed server version the index needs to be dropped and recreated - which for large databases with many indexes on large tables can take a very, very long time.

If you do not do this, a query such as

```sql
mysql> SELECT * FROM t WHERE d = "kohntopp";
```

may find different results depending on the optimizer using an index (pre-update rules apply until the index is recreated) or not using an index (post-update rules apply immediately). This is unpredictable, and hence bad behavior.

It was decided that MySQL will, in order to simplify updates, never do this ever again. 

Instead fixes and changes will be publicised under new names so that changes could be made at will and a pace set by the user by `ALTER TABLE`ing the index definitions from the old collation name to the new name.

Hence we have utf8 (the 16-bit character set) and utf8mb4 (the larger than 16 bit character set) that was defined later. And we have even collations referring to different UCA rules for collating utf8mb4 in order to allow controlled migration to newer, better comparison rules.

The same is true for Timezones: MySQL does not use operating system sort and comparison rules as offered in the glibc functions, but brings its own, and it also does not use Timezone functions and rules as offered by glibc, but again uses its own.

That provides stable and controlled migration that is also independent of operating system updates - the same comparison and index rules exist indendently of glibc updates, and on Linux, MacOS and Windows. This also keeps binary data files portable and upgradable across operating systems and database versions.

Compare that for example to Postgres, which uses glibc functions for string comparison, sorting and for timezone conversions. In Postgres, you have to be aware of operating system updates that affect sorting, comparison or timezones, and you have to recreate indexes every time you make changes to these operating system functions. Noticing glibc updates that affect the function of the database on a system with security auto-updates can be very hard.

## Fixing broken data

Sometimes data ends up inside the database, converted from latin1 to utf8 by an application and then again by the database. This can only happen when the declared character set of the connection (`SET NAMES`) and the data sent to not match.

For example, if you define a table with a `VARCHAR` column in latin1, and set the connection to latin1, but then send actual utf8 data to the table, you not triggering a conversion (connection and column have the same character set), but the data is not valid latin1.

```sql
mysql> create table t ( id serial, d varchar(20) charset latin1 );
Query OK, 0 rows affected (0.08 sec)

mysql> set names latin1; -- we will be sending utf8
Query OK, 0 rows affected (0.00 sec)

mysql> insert into t ( id, d ) values ( 1, "Köhntopp"); -- this is utf8
Query OK, 1 row affected (0.01 sec)

mysql> select hex(d) from t where id = 1; -- stored c3b6, should be f6
+--------------------+
| hex(d)             |
+--------------------+
| 4BC3B6686E746F7070 |
+--------------------+
1 row in set (0.00 sec)

mysql> set names utf8;
Query OK, 0 rows affected, 1 warning (0.00 sec)

mysql> select * from t; -- output broken
+----+-------------+
| id | d           |
+----+-------------+
|  1 | KÃ¶hntopp   |
+----+-------------+
1 row in set (0.00 sec)
```

If we were to convert the column to utf8, the data would als be converted. But since it already is `c3b6`, this must not happen. So this does not work:


```sql
mysql> select hex(d) from t;
+--------------------+
| hex(d)             |
+--------------------+
| 4BC3B6686E746F7070 |
+--------------------+
1 row in set (0.00 sec)

mysql> alter table t modify column d varchar(20) charset utf8;
Query OK, 1 row affected, 1 warning (0.19 sec)
Records: 1  Duplicates: 0  Warnings: 1

mysql> select hex(d) from t; -- broken utf8
+------------------------+
| hex(d)                 |
+------------------------+
| 4BC383C2B6686E746F7070 |
+------------------------+
1 row in set (0.00 sec)
```

The correct solution converts in two steps:

1. Convert to a `VARBINARY`. This keeps the binary data, but removes all charset labels, without conversion.
2. Convert to the target `VARCHAR` with the target `CHARSET`. This applies the charset label without conversion.


```sql
mysql> select hex(d) from t; -- column latin1, data utf8
+--------------------+
| hex(d)             |
+--------------------+
| 4BC3B6686E746F7070 |
+--------------------+
1 row in set (0.00 sec)

mysql> alter table t modify column d varbinary(20); -- convert to binary, keep data
Query OK, 0 rows affected (0.02 sec)
Records: 0  Duplicates: 0  Warnings: 0

mysql> alter table t modify column d varchar(20) charset utf8; -- convert to utf8, keep data
Query OK, 1 row affected, 1 warning (0.15 sec)
Records: 1  Duplicates: 0  Warnings: 1

mysql> select d, hex(d) from t; -- all works now
+-----------+--------------------+
| d         | hex(d)             |
+-----------+--------------------+
| Köhntopp  | 4BC3B6686E746F7070 |
+-----------+--------------------+
1 row in set (0.01 sec)
```
