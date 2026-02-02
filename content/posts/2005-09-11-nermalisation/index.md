---
author: isotopp
date: "2005-09-10T17:46:54Z"
feature-img: assets/img/background/mysql.jpg 
tags:
- mysql
- mysqldev
- lang_en
title: Nermalisation
aliases:
  - /2005/09/11/nermalisation.html
---

This article was previously shared on mysqldump.azundris.com, and salvaged from the old blog:
An introduction to the [normalisation of databases](http://en.wikipedia.org/wiki/Database_normalization) that requires no prior knowledge.

Simply speaking, normalization is about flexibility, and avoiding redundantly storing information. 
That is, avoiding the storage of the same piece of knowledge in more than one place.

Consider some cats and their owners (or, in Cat, our "tin-openers"):

| cat     | owner   | city        |
|---------|---------|-------------|
| Ada     | Andrea  | Anchorage   |
| Shelley | Sarah   | San Diego   |
| Lynn    | Louise  | Los Angeles |

![](2022/02/mysqldump_cat.png)

So far, so good. Now another cat strays to Louise:

| cat        | owner  | city        |
|------------|--------|-------------|
| Ada        | Andrea | Anchorage   |
| Shelley    | Sarah | San Diego   |
| Lynn, Lara | Louise | Los Angeles |

![](2022/02/mysqldump_cat.png)

It's pretty obvious that we'll be in a world of pain once we also wish to store more attributes for each cat (date of
birth, vaccination, ...). 
Moreover, cat would be a string in databases that do not support multi-valued fields (columns), so looking up Lara would be awkward ("show me all rows that have 'Lara' as a whole word anywhere in the field cat_name").

This is awkward, error-prone, and slow, so let's discard the idea while we can:

| cat     | owner  | city        |
|---------|--------|-------------|
| Ada     | Andrea | Anchorage   |
| Shelley | Sarah | San Diego   |
| Lara    | Louise | Los Angeles |
| Lynn    | Louise | Los Angeles |

![](2022/02/mysqldump_cat.png)

Now we stored "Louise" and "Los Angeles" twice. This is somewhat awkward, we'd rather only change one entry if Louise
moves or changes her name:

| owner  | city        |
|--------|-------------|
| Andrea | Anchorage   |
| Sarah  | San Diego   |
| Louise | Los Angeles |

| cat     | owner (referencing other table, "foreign key") |
|---------|------------------------------------------------|
| Ada     | Andrea                                         |
| Shelley | Sarah                                          |
| Lara    | Louise                                         |
| Lynn    | Louise                                         |

![](2022/02/mysqldump_cat.png)

We have eliminated the redundant city, but if Louise's name should change, we'll have to update three entries (her name
in the owners table, and two references to that entry from the cats table).
Since in the real world, people do move and do get married (and sometimes just change their names because, well, they wish to), maybe the name is not a very good  key.
We'll make up an arbitrary one that will never change because it does not rely on the actual payload data:

| owner_no | owner  | city        |
|----------|--------|-------------|
| 1        | Andrea   | Anchorage   |
| 2        | Sarah    | San Diego   |
| 3        | Louise   | Los Angeles |

| cat     | owner_no |
|---------|----------|
| Ada     | 1        |
| Shelley | 2        |
| Lara    | 3        |
| Lynn    | 3        |

![](2022/02/mysqldump_cat.png)


Now a new cat strays to Sarah.
Like Louise, Sarah fancies the name Lara:

| owner_no | owner  | city        |
|----------|--------|-------------|
| 1        | Andrea   | Anchorage   |
| 2        | Sarah    | San Diego   |
| 3        | Louise   | Los Angeles |

| cat     | owner_no |
|---------|----------|
| Ada     | 1        |
| Shelley | 2        |
| Lynn    | 3        |
| Lara    | 3        |
| Lara    | 2        |

![](2022/02/mysqldump_cat.png)

The cats are still unique — Sarah's Lara is Lara/2 in our cats table, Louise's is Lara/3.
At this point however, word gets around in cat circles that Louise rocks — Ada escapes from Andrea-world and strays to Louise!
`(cat_name,owner_no)` no longer considered stable key!

| owner_no | owner  | city        |
|----------|--------|-------------|
| 1        | Andrea   | Anchorage   |
| 2        | Sarah    | San Diego   |
| 3        | Louise   | Los Angeles |

| cat_no | cat     |
|---|---------|
| 1 | Ada     |
| 2 | Shelley |
| 3 | Lynn    |
| 4 | Lara    |
| 5 | Lara    |

| cat_no | lives_with_owner_no | from | until | 
|--------|---------------------|------|------|
| 1      | 1                   | 1998 | 2002 |
| 1      | 3                   | 2002 | NULL |
| 2      | 2                   | 1997 | NULL |
| 3      | 3                   | 1850 | NULL | 
| 4      | 3                   | 1999 | NULL |
| 5      | 2                   | 2002 | NULL |

(NULL meaning: still living there, makes looking up current location nice and easy)

![](2022/02/mysqldump_cat.png)

Sarah's Lara heard the news as well, and also strays to Louise:

| owner_no | owner  | city        |
|----------|--------|-------------|
| 1        | Andrea   | Anchorage   |
| 2        | Sarah    | San Diego   |
| 3        | Louise   | Los Angeles |

| cat_no | cat     |
|---|---------|
| 1 | Ada     |
| 2 | Shelley |
| 3 | Lynn    |
| 4 | Lara    |
| 5 | Lara    |

| cat_no | lives_with_owner_no | from | until | 
|--------|---------------------|------|-------|
| 1      | 1                   | 1998 | 2002  |
| 1      | 3                   | 2002 | NULL  |
| 2      | 2                   | 1997 | NULL  |
| 3      | 3                   | 1850 | NULL  | 
| 4      | 3                   | 1999 | NULL  |
| 5      | 2                   | 2002 | 2002  |
| 5      | 3                   | 2002 | 2002  |

![](2022/02/mysqldump_cat.png)

Louise is unaware of the newcomer's name and calls her Callisto — apparently, a cat's name is not a constant. 
Once more, we fix our tables:

| owner_no | owner  | city        |
|----------|--------|-------------|
| 1        | Andrea   | Anchorage   |
| 2        | Sarah    | San Diego   |
| 3        | Louise   | Los Angeles |

| cat_no | cat      |
|---|----------|
| 1 | Ada      |
| 2 | Shelley  |
| 3 | Lynn     |
| 4 | Lara     |
| 5 | Callisto |

| cat_no | lives_with_owner_no | from | until | under_the_name | 
|--------|---------------------|------|-------|---|
| 1      | 1                   | 1998 | 2002  | 1 |
| 1      | 3                   | 2002 | NULL  | 1 |
| 2      | 2                   | 1997 | NULL  | 2 | 
| 3      | 3                   | 1850 | NULL  | 3 |
| 4      | 3                   | 1999 | NULL  | 4 |
| 5      | 2                   | 2002 | 2002  | 4 |
| 5      | 3                   | 2002 | 2002  | 5|

![](2022/02/mysqldump_cat.png)

Now, a cat can have any number of names (one after the other), and each owner can feed any number of cats.
We can even make overlapping entries in our latest table to account for cats sneakily eating in several places. 
So far, so normal.

Or is it? What happens if Louise moves, but not with all "her" cats?

What changes will we need if twin cats arrive that get the same name because Sarah can't tell them apart, anyway?
(Rows must be unique!)

## Denormalisation:

In some cases, it may be worthwhile to separate a table's history from its status quo:
- to keep the table holding the current data small
- to speed up lookups in it
- or to put the history table in one of MySQL's merge tables

| owner_no | owner  | city        |
|----------|--------|-------------|
| 1        | Andrea   | Anchorage   |
| 2        | Sarah    | San Diego   |
| 3        | Louise   | Los Angeles |

| cat_no | cat      |
|---|----------|
| 1 | Ada      |
| 2 | Shelley  |
| 3 | Lynn     |
| 4 | Lara     |
| 5 | Callisto |


| lived_with_owner_no | from | until | under_the_name (history) |
|-----|-----|-----|-------------------------|
| 1 | 1998 | 2002 | 1                       |
| 2 | 2002 | 2002 | 4                       |

| lives_with_owner_no | from | under_the_name (current) |
|-----|-----|-----|
| 3 | 2002 | 1 |
| 2 | 1997 | 2 | 
| 3 | 1850 | 3 |
| 3 | 1999 | 4 | 
| 3 | 2002 | 5 |

In this example, we'll have to insert the relevant line from the current table (using the current date for the until value) before updating the line in the current table.

![](2022/02/mysqldump_cat.png)

If in doubt, use consecutive integers as a (primary) key (`integer primary key auto_increment not null` or similar).
Do not use strings as keys if you can avoid it, if the above didn't convince you, maybe this will:
string lookups aren't exactly fast.
Do not use "match-codes" or any other keys that encode payload data; keys should be opaque.
