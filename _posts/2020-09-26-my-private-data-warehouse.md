---
layout: post
published: true
title: "Importing account statements and building a data warehouse"
author-id: isotopp
date: 2020-09-26 09:50:00 UTC
tags:
- lang_en
- mysql
- database
- erklaerbaer
- mysqldev
feature-img: assets/img/background/mysql.jpg
---
This is an update and translation of a [much older article]({% link _posts/2006-07-23-mein-privates-datawarehouse-sparen-mit-mysql.md %}), which I wrote in German Language back then. I was experimenting with importing the account statements from my German Sparkasse, which at that time were being made available as a CSV.

## The initial data load

The data looked like this:

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

Because I want to know how I spend my money, I am loading the data into MySQL. Here is how:

As a first step we are defining a table into which to load the data. The table has columns whose primary purpose it to hold the data. We still have to clean and adjust the data to be able to do things with the data, so we are not looking at the final fields or types at all.

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

Sadly, we have no unique transaction identifiers, so I cannot really define a proper primary key. I am trying to make do with a `UNIQUE INDEX`, but it is likely overly specific. 

The failure scenario is that I have to specify start and end dates when exporting the account statements, and sometimes a few records are exported twice: At the end of the one statement file, and at the beginning of the next statement file again.

To prevent loading the same line twice if it happens to appear in multiple CSV files this unique index is probably okay.

I load can load the various CSV files into this table:

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

Now it is time to clean up the data. For this we create a target table, and add a primary key to it.

```sql
-- prepare conversion stage
DROP TABLE IF EXISTS b;
create table b like transactions;
alter table b add column id integer unsigned not null first;
alter table b add primary key (id);
alter table b change column id 
  id integer unsigned not null auto_increment;
```

## Cleaning and changing the data

We can now copy the data over, and in the process clean it up.

- The `amount` field has to be changed from "xxx.xxx,yy" (german monetary notation with dots between the thousands, and a comma before the cents) to "xxxxxxx.yy".
- We also have to turn the date fields `valutadate_text` and `bookdate_text` into iso date syntax. 
- We need to add a year to bookdate_text, taking it from the valutadate_text.
- The `info` column is useless.

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

## Preparing binning categories

I now want to aggregate my expenses. In the raw data, spent money is listed together with the remote account it went to. To aggregate, we need to assign each of these accounts to a category, for example we would assign all gas stations to the "fuel" category or all supermarkets to the "food" category.

I can have a table "moneysinks" that does this account to category assignment.

```sql
-- add category
alter table b add column category varchar(20) not null;
```

And here is the `moneysinks` table, which needed manual population (I had to assign a category to each pattern by hand):

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

Using the mapping in `moneysinks` and the query below I can now permanently assign the `category` field in `b`:

```sql
update b set category = ( 
    select category 
      from moneysinks as w 
     where b.remoteaccount_name like concat(w.pattern, "%") 
  order by length(pattern) desc 
    limit 1) where b.amount < 0;
```

As I complete my list of patters I get a `category` assigned to everything.

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

Using the `category` I an also group this and make group totals.

```sql
select category, 
         count(amount) as payments, 
         sum(amount) as total 
    from b 
   where amount<0 
group by category 
order by total;
```

This will tell me how I spend my money.

Often I want to observe how my spending habits change over time, so I would not just use the categories from the moneysinks table as grouping critieron, but also group over some time dimension (`GROUP BY year(bookdate) as year, category`).

As my data warehouse grows, it may be useful to run the aggregation query and save the result in some preaggregated table (by day or month), as a kind of materialized view of the aggregates. I can use these to create coarser grained aggregates faster (take daily sums and counts, and create monthly or yearly aggregates, fast).

## Summary and outlook

Using account statements from a bank, we have built a basic data warehouse. We demonstrated data import, staging and cleaning processes. Using category tables, we demonstrated how bin individual records into larger sets that can be useful in statistical analysis, and we looked at how we could materialize these aggregation into preaggregated tables.

This is a toy data warehouse, and it poses no challenges in data management due to the small size. Still, it has many properties that are also present in larger structures. Let's look at this in a more generalized way:

A data warehouse is centered around one or more fact tables. Fact tables always have a time dimension, they have log-like nature.

### Literal attribute values, resolve id's

Fact tables contain snapshot data that is not normalized, but contains literal values. In our example: actual account holder names, and account numbers. 

For example in a sales warehouse from a web shop, we are never interested in the current price of an item in a sales-fact table, but always in what we sold it for back then, for each individual sale. We are never interested where the customer lives now, but where we sent the article. Hence we log literal attributes, never ids pointing to the current article or customer record.

### Encoding can shrink tables, but do only what is necessary

This often leads to data duplication. In our example, the string "SCHECK IN CENTER KA DURLACH" is repeated 36 times. For the amount of data shown in our example this does not matter.

Even in the one million rows example in [Coding fields for great profit]({% link _posts/2020-09-18-mysql-encoding-fields-for-great-profit.md %}) the gain is not critial, though substantial. A data warehouse starting out can often skip encoding the values and just take the hit from the duplication. An encoding step can be performed later, as long as there is infrastructure in place for online schema change, and sufficient disk space.

### The Star and the Snowflake

When we talk about OLTP databases, we often talk about normalization, and aiming for the 3rd normal form as an idealized schema to work from. For transactional data that is a good model and a good goal.

In data warehousing, this is obviously not the case - our data has a time dimension, and unlike OLTP, in a data warehouse we are interested in how things were then, not what they are like now. In our example, we are interested in how much we spent for the fuel back then, and not what the same amount would cost us now.

Conversely, in a data warehouse the logged data usually does not change much after the fact: there can be 

- backfilling, due to data arriving late, 
- backpropagation of newly added attributes,
-  or there can be corrections due to transactions changed after the fact at the business level

All of these require us to be able to rewrite our logs for some time window. But eventually that window closes and the data becomes immutable, and we can seal it (run `OPTIMIZE TABLE`, and apply encoding and page level compression).

In our example, once money is spent, it would not come back (or if, in a second corrective reverse booking), and the amounts booked would never change. The log records are immutable from the outset.

Things that OLTP structures need to avoid by normalizing - insert, update and delete paradox - do not happen to us in the same way. Also, because our data does not change much (if ever), but grows a lot over time, it is useful to invest the CPU cycles for data compression (using encoding at the data model level, and using page compression at the database engine level, in this order) once the data can be sealed.

The classical structure of a data warehouse is therefore the star, in which we have a fact table, and a number of category tables aiding binning, plus a number of generated daily/weekly/monthly preaggregates as outputs. All of these auxiliary tables group around the fact table, linked to it in some way, hence the "Star Schema".

In our example, we have the `b` fact table, and only a single binning input table, `moneysinks`. More complicated warehouses can have many more of these.

We have no materialized output tables (`expenses per days` or similar), because our data set is small enough to do all of this ad-hoc. In larger warehouses, materializing aggregates that help to speed up reports is useful.

If you add categories of catgeories, or produce multidimensional aggregates, you go from Star to Snowflake Schema. 

> The Star and the Snowflake are the normal forms for Data Warehosues, Normalization as practiced in transactional databases is not helpful, 3NF is not a thing.

### Time Dimensional Tables in OLTP schemas

Almost every OLTP schema earning money has some tables in it that have a time dimension. It is often visble either in the table name (`shop.sales_202009`) or in the tables primary key - often a compound primary key which contains a pair of an id and a date.

It will be visible in any case, if you think about each tables growth.

> Assume unchanging conditions - a webshop with a mostly fixed number of articles, and a mostly fixed number of customers buying at a fixed rate, which tables will stay at a fixed size, and which tables will grow without bounds?
>
> Solution: It is the `orders` table.
>
> Find these unbounded structures in your schema.

At the heart of every OLTP schema there is a data warehouse that is struggling to get out. You get it out by completing the data lifecycle for the OLTP phase of things and establishing an *Extract, Transform and Load cycle (ETL cycle)*.

In planning a data warehouse, you identify tables without growth boundaries, and decide which data attributes you want to record as literal data for the warehouse.

In the Extract phase you create a monster join you resolve all id values present in your normalized data, extract the literal attributes of interest, and push them into a CSV or some staging table.

Data in the OLTP system can now be deleted by the OLTP systems data lifecycle management without concern for other, non-transactional business functions: we have isolated the non-transactional concerns and confined them to the Extraction process (which will have to be adjusted when the OLTP schema changes, so we are a stakeholder in the OLTP schema evolution).

This isolation of concerns means that the OLTP system of our shop can now delete or archive orders at will after fulfillment or whatever other concerns the transactional system has to serve. Our non-transactional needs are all served from the data gathered in the Extract phase of the ETL process.

The staged extracted values can now be cleaned, categorized and aggregated, depending on the demands from the non-transactional business concerns (statistics, business intelligence, decision making and so on).

Identifying data warehousey tables in OLTP systems, and isolating the transactional and non-transactional business concerns is important to keep the OLTP system small and agile.

Without taking the non-transactional, long term business functions out the OLTP system will grow without bounds, and ultimately transactional performance will suffer - the system will choke on itself. The non-transactional concerns not being isolated and bundled will also impede OLTP schema evolution and choke the development process on the money-earning side.

### Data Lifecycle Management at the Warehouse

Fact tables in the data warehouse have a time dimension, and as time passes, they will accumulate more data. In order to manage our data warehouse, we will also have to complete the data lifecycle on this side of the ETL boundary, and establish some deletion policy.

Queries to the data warehouse table are often time bounded ("How did sales change in the last 2 years") and binned by - among other things - a time dimension ("How did demand change month-over-month", "Which of our products are seasonal?").

Handling data at volume, and getting rid of data no longer needed, is much easier in MySQL [when using partitions]({% link _posts/2020-09-24-mysql-deleting-data.md %}).

In data warehouses, partitions are usually on a time value as the first dimension. That is, we partition our data set by year, month or day and we delete data by dropping old partitions. This leaves all internal B-Trees in all the partitions subtables untouched and as they have been after the import, optimization and compression.

As queries also have a time dimension, the optimizer profits from this structure as well. It can exclude entire partitions from consideration, making the subset of data to look at much smaller.

### Daily Snapshots are slow, but simple

A daily snapshot ETL import is slow - you do not get realtime data updates - but simple to implement retroactively on existing structures. Realtime structures require more engineering, but can be crafted on top of existing architectures as well. We are going to look at them in some later examples.