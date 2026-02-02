---
author: isotopp
title: "MySQL: InnoDB Fragmentation"
date: "2023-07-06T01:02:03Z"
feature-img: assets/img/background/mysql.jpg
tags:
- lang_en
- mysql
- database
aliases:
  - /2023/07/06/mysql-innodb-fragmentation.html
---

There is a really nice article by Pep Pla, over at 
[the Percona blog](https://www.percona.com/blog/the-impacts-of-fragmentation-in-mysql/)
about fragmentation in MySQL InnoDB tablespaces, which you should read.

The article discusses "fragmentation" of data in tables, which happens in a way similar to how it happens in filesystems.

InnoDB stores data by default in tablespaces, which by default are a file per table.
These files are subject to the fragmentation and growth rules of your filesystem,
but if you are smart, you are running MySQL on Linux on the XFS.
In that case, filesystem fragmentation (and unexplained commit latency variance) are not an issue,
because XFS takes care of handling this properly, and only database-internal fragmentation remains. 

# Primary keys, data order and working set size

Data inside an InnoDB tablespace is placed in primary key order, and that used to matter a lot,
because rows with closer primary keys used to be stored closer together on disk.
Up to the point where rows with adjacent primary keys had a good chance of being on the same page.

In the past, it mattered more than today, because even if data was not stored on the same page,
pages that were physically stored closely together (on the same HDD track or cylinder) could be loaded faster.
That was the case, since "near" disk seeks were executed faster by an HDD than "far" disk seeks across the entire surface of a hard disk.

With flash, seek times are largely irrelevant:
In fact, the internal Flash Translation Layer of flash storage will put data anywhere it sees fit,
and then issue you a Logical Block Address (LBA) that has no bearing whatsoever on the actual physical location of the page on the flash drive.
It may even move the actual physical data under you behind the scenes, and still refer to it by the same LBA.

What matters a lot as a concept, though, is the Working Set Size (WSS) of your database.

> The Working Set is the set of pages your database is going to reference in the next future interval

This interval may be, for example, the next 1m, 10m or 1h.
That is, it makes initially limited sense to speak of the WSS as an unqualified term.
You'd have to use it with an interval instead, so the WSS-1m, WSS-10m, WSS-1h and so on.

If you could predict what pages will be needed in the WSS-10m, you could preload these pages and cache them.
This would bring the disk reads to zero or close to zero for the coming 10 minutes.

> Predicting the future is hard, though, especially if accuracy is required.
> What we do instead is look to the past and hope the future looks alike.

So most people would want to look at the past 10 minutes,
and the recorded page numbers requested from disk as a triple of `(timestamp, tablespace_id, page_number)`.
From this, we can build a histogram for a sliding 10m window, and we would know which pages have been in demand.
From the height of the histogram counter, we would even know how much.

We can now size an InnoDB buffer pool, and calculate how large this pool would have to be to cache 95%, 99%, 99.99%, ...
of all page read requests.
Having a handle on the desired buffer pool size for a data set and a workload would be very useful to determine the amount
of memory our database instance would need to perform adequately:
It must be sized for – at least – the estimated buffer pool plus overhead plus some safety margin, 
rounded up to available instance types.

Unfortunately, we can only get aggregate statistics from an unpatched MySQL, and no page-read-request timeline as shown above.
Neither can we get a page-request histogram from `P_S`, or a properly precalculated WSS estimation.
So it is necessary to patch MySQL to get this data, unfortunately.

When we do this, and math a bit on the results, we observe there is actually such a thing as a WSS without a time-interval:

As long as the workload is stable,
we can identify with some confidence a set of pages that need to be cached in order to quench most of the reads.
Adding buffer pool pages past this point will not improve performance substantially,
and there might still be a certain number of residual random page reads due to random accesses in the workload.
In order to also quench these, you'd have to be able to keep the entire database in memory.
While this is sometimes possible, there are workloads where this is not economical, especially at cloud pricing structures.

## Designing for locality

Here Pep Pla comes in again, because he highlights in his article the principle of locality,
which is exactly what the working set size is.
Specifically, WSS is temporal locality – we cache the pages we will need in the future in memory, 
so that spatial locality does no longer matter.
Even when using HDD.

> By choosing a primary key smartly, we can make sure that primary keys that are being accessed "together" have similar values, 
> and each page is filled closely with many rows that we will be needing at the same time.
> 
> For a fixed data size, this lowers the number of pages active concurrently, bringing down WSS size,
> bringing down pool size, bringing down instance size, bringing down cloud cost.

Also, it is important to keep the row size down, so many rows fit into the same page, 
and finally getting a handle on fragmentation inside a page – but this is actually the least important factor in design.

For the various MySQL flavors, exposing disk read request traces (as `(ts, tablespace_id, page#)` triples)
and deriving a histogram and a WSS metric from it remains an open TODO point.

Note how "Designing for locality" is not primarily a "fragmentation" issue – the amount of empty space per page,
segment or tablespace does not matter in the first place.
Packing rows that are needed together densely is what matters: data density matters.
And empty space in a page can ultimately adversely affect that, but it is really the last item on the list.

# Fill Factors, and you do not need to `OPTIMIZE TABLE`

"Empty space in a page" is a special kind of fragmentation, and in databases it is commonly called "fill factor."
Pep Pla has been testing the behavior of InnoDB with various workloads and page fill factor settings, 
and this is the first documented and systematic work in this area that I am aware of.

Using the `innodb_space` tool from [Jeremy Cole's Tooling](https://github.com/jeremycole/innodb_ruby),
he observed the behavior of InnODB after a longer term mixed insert and delete workload.

The results are pretty encouraging.
Basically, according to the results from his testing, 
it never made sense to run `OPTIMIZE TABLE` to repack and re-order the data for flash storage.
Disk seeks do not matter much any more on flash,
and there will always be empty space in the pages of tables that see permanent random inserts and deletes.
So running `OPTIMIZE TABLE` will bring the table size down and repack it,
only to create a wave of page splits immediately after when the DML workload continues and needs room to work.

Pep Pla shows fragmentation maps for the same table after 400 iterations of his DML workload using different fill factors, 
and it shows that the initial fill factor after an `OPTIMIZE TABLE` is no longer visually identifiable.
Instead, all tables look similarly fragmented, so their shape is dominated by the workload, not the 
`OPTIMIZE TABLE` and the fill factor parameters.

It may be useful to `OPTIMIZE` (and compress) tables that are being archived, but as soon as they see DML,
they will be reshaped by the workload again, and you might as well not `OPTIMIZE`.

# Designing for locality vs UUID

It is worth mentioning that very many tables have a row-access frequency that matches the rows primary key,
if the rows' primary key is an `auto_increment`.
That is, very many applications frequently access rows that have recently been written,
while older rows are being used much less frequently.

By using `auto_increment` primary keys,
data is automatically ordered physically so that "cold data" is at the front of the table and "hot data" is at the end.
This also puts hot rows together into the same page or pages close by, at the end of the table.
This is good for performance in InnoDB, and also keeps the WSS down.

Using a random primary key (a MD5 or a UUID v4) will not impose any order on the primary key.
In InnoDB, where the primary key value determines the physical position of the row in the table,
this essentially scatters rows across the entire table.
This creates a very large working set, bloating required buffer space, and increasing instance size:
There will be a hot row in any page with the same probability, so you'll have to cache all pages to quench reads.

Using a UUID v1 is better because they have a temporal component,
which can be used to leverage an `auto_increment`-like ordering.
Unfortunately, MySQL does not do this by providing a UUID v1 data type, which does the right thing automatically.
Instead, we get to use a pair of functions `UUID_TO_BIN()` and `BIN_TO_UUID()`,
which require you to manually cast the data every time you access it and remember to set the swap flag properly.
This is very uncomfortable and error-prone,
more so in large development organizations.

Try to use `auto_increment` with MySQL InnoDB.
If you can't, try to go with UUID v1 and the `UUID_TO_BIN()` functions, with the swap flag set.

For the various MySQL flavors, it remains an open TODO point to provide a UUID v1 and a UUID v4 data type.

# Row Fragmentation

MySQL InnoDB is famously bad at storing files, and Pep Pla discusses that cursory, too.
In fact, the Percona Blog also provides
[another article on this](https://www.percona.com/blog/how-innodb-handles-text-blob-columns/) 
with some more depth, which is a lot more opinionated than the official manual on the subject at hand.

Basically, when a row becomes too large (at 1/2 page size, 8 KB), 
InnoDB stores individual fields of a row "off-table" in overflow pages.
The article does not discuss this, but to my knowledge, each overflow page holds only one field,
so the overhead is statistically much larger than "on average 1/2 page" as stated in that article.
This effect becomes stronger if you have tables with multiple BLOB/TEXT columns in a row,
and each is just barely large enough to trigger off-table storage.

Accessing data that is stored in overflow pages uses up additional buffer pool pages to hold them, 
at a rate of at least one per overflowed field, increasing the working set size, and hence necessary instance size.
In versions of MySQL before MySQL 8, such data also forced the use of on-disk temporary tables,
which impacted query performance badly to a large extent,
but this is now fortunately fixed.

So in the past, the general advice was to avoid TEXT/BLOB columns altogether,
and if you must use them, do not use them as part of a join or any query that was marked as "using temporary."
Since MySQL 8, this is much better, but still be aware of the working set size increase.

For the various MySQL flavors remains an open TODO point to provide a more efficient (Postgres TOAST-like?) BLOB storage,
in order to bring down storage overhead.

Another long-standing BLOB performance-related work item that is not linked to fragmentation 
would be to provide a "partial updates"/"BLOB streaming" API in the protocol, 
because this is another well-known point of inefficiency:

- Try to store a BLOB larger than `max_allowed_packed` in the database.
- Try to change 4 bytes at offset 32M in a 64M BLOB efficiently using MySQL protocol.

If you do, and observe what happens on the wire, in memory and on disk, you'd be scared.
Until it is fixed, use the filesystem or S3 for this, and store filenames or URLs instead.

# Recommendations?

- You probably do not need to care much about fragmentation if your database uses flash-based storage.
  InnoDB is relatively stable for DML workload, and `OPTIMIZE TABLE` is usually not worth the effort,
  unless you move a table to archive/read-only.
- You would do well to design for data density and temporal locality, bringing down working set size.
  - Often this happens automatically when using `auto_increment` as a primary key.
- Even in MySQL 8, you would still do well to keep BLOB and TEXT fields out of main tables,
  or where it makes sense, out of the database completely.

Server Side improvements needed:

- MySQL has no good instrumentation that can trace disk read requests by `(ts, tablespace_id, page#)`, 
  making it hard to estimate working set size, and derive an optimal instance size from it.
  You will need to patch the database server in order to grab this data.
  This needs fixing in the mainline server source.
- MySQL should have a UUID v1 and a UUID v4 data type, which would be a lot less error-prone that the
  current set of functions.
  This needs fixing in the mainline server source.
- MySQL has an abysmally underdeveloped BLOB storage and long-standing gaps in its BLOB access API
  (efficient partial updates, BLOB streaming).
  This needs fixing in the mainline server source.
