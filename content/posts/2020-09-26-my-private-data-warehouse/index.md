---
author: isotopp
date: "2020-09-26T09:50:00Z"
feature-img: assets/img/background/mysql.jpg
tags:
- lang_en
- mysql
- database
- data warehouse
- erklaerbaer
- mysqldev
title: Importing account statements and building a data warehouse
aliases:
  - /2020/09/26/my-private-data-warehouse.md.html
---

This is an update and translation of a
[much older article]({{< relref "2006-07-23-mein-privates-datawarehouse-sparen-mit-mysql.md" >}}),
which I originally wrote in German.
Back then, I was experimenting with importing account statements from my German Sparkasse,
which were available as CSV files.

## The initial data load

The data appeared as follows:

```console
$ head -2 /home/kris/Documents/banking/umsatz-22758031-29122004.csv
"Local Account";"Book Date";"Valuta Date";"Transaction Type";
"Purpose";
"Remote Party";"Remote Account";"Bank Code";
"Amount";"Currency";"Info"
"08154711";"30.12";"30.12.05";"Direct Debit";
"DRP 08154711 040441777  INKL. 16% UST 5.38 EUR";
"STRATO MEDIEN AG";"040441777";"10050000";
"-39,00";"EUR";"Direct Debit booked"
```

Because I want to know how I spend my money, I am loading the data into MySQL.
Here is how:
To understand my spending habits, I decided to load the data into MySQL.
Here’s how:

First, we define a table to load the data.
The table has columns to hold the raw data.
We still need to clean and adjust the data, so we are not concerned with the final fields or types yet.

```sql
-- load data
warnings;
DROP TABLE IF EXISTS transactions;
CREATE TABLE transactions (
  localaccount char(8) NOT NULL,
  bookdate_text char(10) NOT NULL,
  valutadate_text char(10) NOT NULL,
  transactiontype varchar(50) NOT NULL,
  purpose varchar(180) NOT NULL,
  remoteaccount_name varchar(100) NOT  NULL,
  remoteaccount_number char(20) NOT NULL,
  remoteaccount_bankcode char(8) NOT NULL,
  amount_text char(12) NOT NULL,
  currentcy char(3) NOT NULL,
  info varchar(255) NOT  NULL,
  unique index ( bookdate_text
    , transactiontype
    , purpose
    , remoteaccount_number
    , remoteaccount_bankcode
    , amount_text)
) ;
truncate table transactions;
```

Unfortunately, there are no unique transaction identifiers, so I can't define a proper primary key.
Instead, I use a `UNIQUE INDEX`, which may be overly specific.

When exporting account statements, I must specify start and end dates,
which sometimes result in duplicate records at the end of one statement and the beginning of the next.

To avoid loading the same line twice if it appears in multiple CSV files, this unique index should be adequate.

I can load the various CSV files into this table:

```sql
load data infile  
  '/home/kris/Documents/banking/umsatz-22758031-29122004.csv' 
into table buchungen 
fields terminated by ";" 
optionally enclosed by '"' 
ignore 1 lines;
load data infile 
  '/home/kris/Documents/banking/umsatz-22758031-24012005.csv' 
into table buchungen 
fields terminated by ";" 
optionally enclosed by '"' 
ignore 1 lines;
...
```

Next, it’s time to clean the data.
We create a target table and add a primary key.

```sql
-- prepare conversion stage
DROP TABLE IF EXISTS b;
create table b like transactions;
alter table b add column id integer unsigned not null first;
alter table b add primary key (id);
alter table b change column id 
  id integer unsigned not null auto_increment;
```

## Cleaning and Transforming Data

We can now copy the data over, and in the process clean it up.

We can now copy and clean the data during the process.

- Change the `amount` field from `xxx.xxx,yy` (German notation) to `xxxxxxx.yy`.
- Convert the date fields `valutadate_text` and `bookdate_text` to ISO date format.
- Add a year to `bookdate_text` from `valutadate_text`.
- The `info` column is not useful.

```sql
-- load data into conversion stage
insert into b select NULL, transactions.* from transactions;

-- adapt amount
update b set amount_text = replace(amount_text, ".", "");
update b set amount_text = replace(amount_text, ",", ".");
alter table b change column amount_text 
  amount decimal(12,2) not null;

-- adapt valutadate
update b set valutadate_text = 
concat("20", 
   substring(valutadate_text, 7, 2), 
   "-", 
   substring(valutadate_text, 4, 2), 
   "-", 
   substring(valutadate_text, 1,2));
alter table b change column valutadate_text 
  valutadate date not null;

-- adapt bookdate
update b set bookdate_text = 
concat(year(valutadate), 
   "-", 
   substring(bookdate_text, 4,2), 
   "-", 
   substring(bookdate_text, 1,2));
alter table b change column bookdate_text 
  bookdate date not null;

-- drop info
alter table b drop column info;
```

## Preparing Binning Categories

I want to aggregate my expenses.
The raw data lists spent money with the corresponding remote account.
To aggregate, we assign each of these accounts to a category,
e.g., assigning all gas stations to the "fuel" category or all supermarkets to the "food" category.

We can have a table, `moneysinks` for this account-to-category assignment.

```sql
-- add category
alter table b add column category varchar(20) not null;
```

Here is the `moneysinks` table, which needed manual population (assigning a category to each pattern by hand):

```sql
DROP TABLE IF EXISTS `moneysinks`;
CREATE TABLE `moneysinks` (
  `id` int(10) unsigned NOT NULL auto_increment,
  `pattern` varchar(100) NOT NULL,
  `category` varchar(20) NOT NULL,
  PRIMARY KEY  (`id`)
);

LOCK TABLES `moneysinks` WRITE;
INSERT INTO `moneysinks` VALUES (77,'sparkasse','account and card');
INSERT INTO `moneysinks` VALUES (78,'ga','ATM domestic');
INSERT INTO `moneysinks` VALUES (79,'qsc','Internet');
INSERT INTO `moneysinks` VALUES (80,'linux new media','Newspaper');
INSERT INTO `moneysinks` VALUES (81,'premiere','TV');
INSERT INTO `moneysinks` VALUES (82,'walmart','Food');
INSERT INTO `moneysinks` VALUES (83,'kabel bw','TV');
INSERT INTO `moneysinks` VALUES (84,'gez','TV');
INSERT INTO `moneysinks` VALUES (85,'t-mobile','Telefon');
INSERT INTO `moneysinks` VALUES (86,'finanzkasse','Tax');
INSERT INTO `moneysinks` VALUES (87,'domainfactory','Internet');
INSERT INTO `moneysinks` VALUES (88,'nagel ue','Clothing');
INSERT INTO `moneysinks` VALUES (89,'mobilcom','Telefon');
INSERT INTO `moneysinks` VALUES (90,'domainfactory','Internet');
INSERT INTO `moneysinks` VALUES (91,'strato','Internet');
INSERT INTO `moneysinks` VALUES (92,'stadtwerke','Gas Water Shit');
INSERT INTO `moneysinks` VALUES (93,'deutsche bahn','Rail');
INSERT INTO `moneysinks` VALUES (94,'debeka','Insurance');
INSERT INTO `moneysinks` VALUES (95,'ec-ga','ATM intl');
INSERT INTO `moneysinks` VALUES (96,'scheck in','Food');
INSERT INTO `moneysinks` VALUES (97,'mastercard','Kreditkarte');
INSERT INTO `moneysinks` VALUES (98,'dr.','Miete');
INSERT INTO `moneysinks` VALUES (99,'a.t.u','Auto');
INSERT INTO `moneysinks` VALUES (100,'ungeheuer','Auto');
INSERT INTO `moneysinks` VALUES (101,'agip','Fuel');
INSERT INTO `moneysinks` VALUES (102,'aral','Fuel');
INSERT INTO `moneysinks` VALUES (103,'avia','Fuel');
INSERT INTO `moneysinks` VALUES (104,'bab','Fuel');
INSERT INTO `moneysinks` VALUES (105,'citti','Food');
INSERT INTO `moneysinks` VALUES (106,'efa','Fuel');
INSERT INTO `moneysinks` VALUES (107,'esso','Fuel');
INSERT INTO `moneysinks` VALUES (108,'expedia','Travel');
INSERT INTO `moneysinks` VALUES (109,'fantasy','RPG');
INSERT INTO `moneysinks` VALUES (110,'gravis','Toys und Gadgets');
INSERT INTO `moneysinks` VALUES (111,'foto','Toys und Gadgets');
INSERT INTO `moneysinks` VALUES (112,'heinrich','Clothing');
INSERT INTO `moneysinks` VALUES (113,'hem','Fuel');
INSERT INTO `moneysinks` VALUES (114,'hotel','Travel');
INSERT INTO `moneysinks` VALUES (115,'jet-tank','Fuel');
INSERT INTO `moneysinks` VALUES (116,'karstadt','Food');
INSERT INTO `moneysinks` VALUES (117,'kassen-','Tax');
INSERT INTO `moneysinks` VALUES (118,'leichtsinn','Toys und Gadgets');
INSERT INTO `moneysinks` VALUES (119,'media markt','Toys und Gadgets');
INSERT INTO `moneysinks` VALUES (120,'mios','Fuel');
INSERT INTO `moneysinks` VALUES (121,'plaza','Food');
INSERT INTO `moneysinks` VALUES (122,'rundfunkgebuehren','TV');
INSERT INTO `moneysinks` VALUES (123,'saturn','Toys und Gadgets');
INSERT INTO `moneysinks` VALUES (124,'sb tank','Fuel');
INSERT INTO `moneysinks` VALUES (125,'segelkiste','Clothing');
INSERT INTO `moneysinks` VALUES (126,'total/','Fuel');
INSERT INTO `moneysinks` VALUES (127,'trx','Travel');
INSERT INTO `moneysinks` VALUES (128,'tst. bensheim','Fuel');
INSERT INTO `moneysinks` VALUES (129,'vobis','Toys und Gadgets');
INSERT INTO `moneysinks` VALUES (130,'willenberg','Toys und Gadgets');
INSERT INTO `moneysinks` VALUES (131,'shell','Fuel');
INSERT INTO `moneysinks` VALUES (132,'spreadshirt','Clothing');
INSERT INTO `moneysinks` VALUES (133,'armin meier','Clothing');
INSERT INTO `moneysinks` VALUES (134,'itzehoer','Insurance');
INSERT INTO `moneysinks` VALUES (135,'ec-pos','ATM intl');
INSERT INTO `moneysinks` VALUES (136,'euf-ga','ATM intl');
INSERT INTO `moneysinks` VALUES (137,'dell','Toys und Gadgets');
INSERT INTO `moneysinks` VALUES (138,'yvonne','RPG');
UNLOCK TABLES;
```

## Asking Questions

Using the mapping in `moneysinks` and the query below, I can permanently assign the `category` field in `b`:

```sql
update b set category = ( 
    select category 
      from moneysinks as w 
     where b.remoteaccount_name like concat(w.pattern, "%") 
  order by length(pattern) desc 
    limit 1) where b.amount < 0;
```

As I complete my list of patterns, each transaction gets a `category`.

That enables me to ask questions:

```sql
select   remoteaccount_name, 
         count(remoteaccount_name) as income 
    from b 
   where betrag>=0 
group by remoteaccount_name 
order by income desc;
+--------------------------------------------------------+-----------+
| remoteaccount_name                                     | income    |
+--------------------------------------------------------+-----------+
| WEB.DE AG AMALIENBADSTR. 41                            |        12 |
| MYSQL GMBH                                             |         7 |
| MYSQL GMBH SCHLOSSERSTR. 4 72622 NUERTINGEN            |         3 |
| COOP SCHLESWIG-HOLSTEIN EG BENZSTR. 10                 |         2 |
+--------------------------------------------------------+-----------+
```

```sql
select   remoteaccount_name, 
         count(remoteaccount_name) as payments
    from b 
   where betrag<0 
group by remoteaccount_name
order by payments desc;
+---------------------------------------------------------+----------+
| remoteaccount_name                                      | payments |
+---------------------------------------------------------+----------+
| SCHECK IN CENTER KA DURLACH                             |       36 |
| MOBILCOM COMMUNICATIONSTECH                             |       22 |
| STRATO MEDIEN AG                                        |       22 |
| VERMIETER                                               |       19 |
| T-MOBILE DEUTSCHLAND GMBH                               |       18 |
| DEUTSCHE BAHN KARLSRUHE HB                              |       17 |
| KABEL BW GMBH & CO. KG                                  |       17 |
| QSC AG                                                  |       17 |
| STADTWERKE KARLSRUHE                                    |       17 |
...
```

Using the `category`, I can also group and sum expenses.
```sql
select category, 
         count(amount) as payments, 
         sum(amount) as total 
    from b 
   where amount<0 
group by category 
order by total;
```

This shows how I spend my money.

I often want to observe how my spending habits change over time.
So,
I group not only by categories from the `moneysinks` table but also by time dimension
(`GROUP BY year(bookdate) as year, category`).

As my data warehouse grows,
it may be useful to run the aggregation query and save the result in a pre-aggregated table (daily or monthly),
serving as a materialized view of the aggregates.
These can be used to create coarser-grained aggregates faster.

## Summary and Outlook

Using bank account statements, we built a basic data warehouse.
We demonstrated data import, staging, and cleaning processes.
Using category tables,
we showed how to bin individual records into larger sets for statistical analysis and how to materialize these aggregations into pre-aggregated tables.

This is a toy data warehouse, posing no significant data management challenges due to its small size.
Still, it shares many properties with larger structures.
Let's generalize:

A data warehouse centers around one or more fact tables, always including a time dimension and having a log-like nature.

### Literal Attribute Values, Resolve IDs

Fact tables contain snapshot data not normalized, featuring literal values.

For example, in a sales warehouse,
we record the actual sale price and the shipping address at the time of sale, not the current price or address.
We log literal attributes, not current IDs.

### Encoding Can Shrink Tables, But Only Do What Is Necessary

This often leads to data duplication.
In our example, the string "SCHECK IN CENTER KA DURLACH" is repeated 36 times.
For our data size, this doesn't matter much.
Even in larger data sets,
encoding can be deferred until there's infrastructure for online schema changes and sufficient disk space.

Even in the one-million-row example in
[Coding fields for great profit]({{< relref "2020-09-18-mysql-encoding-fields-for-great-profit.md" >}})
the gain is not critical,
though substantial.
A data warehouse starting out can often skip encoding the values and just take the hit from the duplication.
An encoding step can be performed later,
as long as there is infrastructure in place for online schema change, and sufficient disk space.

### The Star and the Snowflake

For OLTP databases, normalization to the third normal form is ideal.
However, in data warehousing, where we are interested in historical data, normalization isn't as crucial.
The logged data usually doesn't change much after the fact.
Any necessary changes, such as backfilling or corrections, are managed within a specific time window.
Once this window closes, the data becomes immutable.

The classical structure of a data warehouse is the star schema,
with a central fact table surrounded by category tables and pre-aggregated outputs.
In our example, we have the `b` fact table and a single binning input table, `moneysinks`.
Larger warehouses may have more auxiliary tables.

We don't have materialized output tables in this example due to the small data set(`expenses per days` or similar),
but larger warehouses benefit from materializing aggregates for faster reporting.
Adding categories of categories or multidimensional aggregates turns a Star into a Snowflake Schema.

> The Star and Snowflake are the normal forms for Data Warehouses.
> Normalization as practiced in transactional databases is not helpful; 3NF is not a thing here.

### Time Dimensional Tables in OLTP Schemas

Many OLTP schemas have tables with a time dimension, either in the table name (`shop.sales_202009`) or primary key.
Identifying these unbounded tables helps manage data growth.


> Assume unchanging conditions: a webshop with fixed articles and customers.
>
> Which tables grow without bounds?
>
> Solution: The `orders` table.

Recognizing these structures and establishing an
*Extract, Transform, Load (ETL) cycle*
is crucial for managing data lifecycle and isolating transactional and non-transactional concerns.

In the Extract phase, resolve IDs and extract literal attributes into a staging table.
This is usually done using a monster join in which we resolve all id values present in the normalized data,
extract the literal attributes of interest, and push them into a staging area.
This isolation allows the OLTP system to manage its data lifecycle without affecting non-transactional functions,
which are handled by the data warehouse.

Data in the OLTP system can now be deleted by the OLTP systems data lifecycle management
without concern for other, non-transactional business functions: 
we have isolated the non-transactional concerns and confined them to the extraction process 

The staged data can then be cleaned, categorized,
and aggregated based on non-transactional needs like statistics and business intelligence.

Without taking the non-transactional, long-term business functions out the OLTP system will grow without bounds,
and ultimately transactional performance will suffer - the system will choke on itself.
The non-transactional concerns not being isolated and bundled will also impede OLTP schema evolution
and choke the development process on the money-earning side.

### Data Lifecycle Management at the Warehouse

Fact tables with a time dimension accumulate more data over time.
Managing this requires a deletion policy.
Queries to the data warehouse are often time-bounded.

Handling data at volume, and getting rid of data no longer needed, is much easier in MySQL
[when using partitions]({{< relref "2020-09-24-mysql-deleting-data.md" >}}).

In data warehouses, partitions are usually on a time value as the first dimension.
That is, we partition our data set by year, month or day, and we delete data by dropping old partitions.

As queries also have a time dimension, the optimizer profits from this structure as well.
It can exclude entire partitions from consideration, making the subset of data to look at much smaller.

### Daily Snapshots are slow, but simple

A daily snapshot ETL import is slow but simple to implement retroactively.
Realtime structures require more engineering but can be built on existing architectures,
which we will explore in later examples.
