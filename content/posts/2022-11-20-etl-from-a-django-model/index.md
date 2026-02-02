---
author: isotopp
title: "ETL from a Django Model"
date: "2022-11-20T06:07:08Z"
feature-img: assets/img/background/mysql.jpg
tags:
  - lang_en
  - mysql
  - mysqldev
  - data warehouse
aliases:
  - /2022/11/20/etl-from-a-django-model.html
---

Continued from [last weeks article]({{< relref "2022-11-16-of-stars-and-snowflakes.md" >}}) on data warehouses.

At work, I was tasked with building a capacity model for data center growth.
The basic assumption of these things is often that the future behaves similarly to the past, so the future predicted capacity model is somehow an extension of past growth.
I needed old server usage data, and was indeed able to find that in one of our systems, called ServerDB.

ServerDB is an in-house Django application that models server ownership, equipment, rack positions, and usage.
It drives provisioning of machines, exposing a REST API, and driving an automated installation process, based on requests, availability, redundancy concerns and other factors.
It also manages tickets for Data Center Operations Engineers, and interfaces with a number of other, similar systems.

I did find that ServerDB was keeping a log of all changes to the core `server_servers` table by the means of a Django save handler, and that it had accumulated six years worth of data.
It was in fact the largest table in the system, larger than all other tables together.
While that was not the data I needed it was the data I had, and I could make it work.

For the future I wanted something more, so I wrote an ETL process that each night would export the entire server fleet, denormalizing the data, and pushing the attributes I wanted to record into a second database, `serverdb_dw`.
I would keep three months worth of daily exports, and expire all weekdays but Mondays after that.
This would be leaving me with weekly data for an indefinite timespan. 

# An ETL driver

The ETL script is written in Python, and uses Click to handle command line options.

We make ourselves a CLI to add commands to:

```python
@click.group(chain=True)
@click.option(
    "--verbose",
    "-v",
    default="WARNING",
    type=click.Choice(["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"]),
    help="Set the debug level.",
)
def cli(verbose="WARNING"):
    """Extract data from serverdb2, denormalize it and load it into serverdb_dw, run aggregations.

    This command runs regularly, extracting a number of attributes about
    servers from serverdb2, denormalizes the data and loads it into a single
    table 'server_facts' into serverdb_dw. It will then run a number of
    aggregations on the serverdb_dw table, creating a bunch of tables in
    serverdb_dw starting with the prefix 'server_by_...'.

    By default, the aggregations are run only on the data from today. Options
    can be used to process larger chunks of data or all data. This will then
    take a lot of time. Options can also be used to process only individual
    aggregations.

    \b
    A regular full run looks like this: ./serverdb_etl.py etl aggregate
    cube_aggregate

    \b
    To re-aggregate all dimensions: ./serverdb_etl.py aggregate
    cube_aggregate

    """
    logger.setLevel(verbose)
```

## Making a fact table

We can then hook up subcommands to our CLI.

We will need a fact table to write data to, so the first subcommand will be "etl_init", which will run a `CREATE TABLE` for us.
We collect all our methods in an `Etl` class, and call our `create_table()` method:

```python
@cli.command("etl_init")
def etl_init():
    """ Create the server_facts table if it does not exist. Safe to use.

        The will run a CREATE TABLE IF NOT EXISTS statement to create a
        server_facts table. If a server_facts table exists, a new table will
        NOT be created, and no data will be lost.

        If the definition of the server_facts table does not match our table,
        it will not be changed or repaired. You need to write a manual
        migration to fix this.
    """
    run = Etl()
    run.create_table()
```

And that is basically parametrizing a large `CREATE TABLE` statement with some config values, and then running it on the target database.

```python
    def create_table(self):
        """ Create the server_facts table, if it does not exist, yet.

            This method is safe to use: The table will not be created
            if it already exists. No data is lost.
        """
        logger.info("start create_table")
        query = self.fact_create_table % self.fact_param
        logger.debug("Create Query = %s", query)

        write = get_serverdb_dw_connection()
        cursor = write.cursor()
        cursor.execute(query)

        logger.info("end create_table")
```

The actual statement is also stored in that `Etl` class.
I have shortened the statement considerably -- we are collecting many items more than listed here.
Fact tables are often very wide.

```python
    fact_create_table = """CREATE TABLE IF NOT EXISTS %(target_db)s.%(target_table)s (
        `id` int(10) unsigned NOT NULL DEFAULT '0',
        `report_date` date NOT NULL,
        `name` varchar(128) NOT NULL DEFAULT '',
        `asset_type` varchar(32) NOT NULL DEFAULT '',
        `serialnumber` varchar(64) NOT NULL DEFAULT '',
        `delivery_date` date NOT NULL,
        `ip_address` varchar(16) NULL,
        `mac_address` varchar(17) NULL,
        `status` varchar(16) NOT NULL DEFAULT '<unknown>',
        `site` varchar(4) NOT NULL DEFAULT '',
        `region` varchar(25) NOT NULL DEFAULT '<unknown>',
        `role_ids` varchar(255) NOT NULL DEFAULT '', --
        `puppet_services` varchar(255) NOT NULL DEFAULT '',
        `role_names` varchar(255) NOT NULL DEFAULT '',
        `rack` varchar(128) NOT NULL DEFAULT '',
        `cpu_count` int(10) NOT NULL DEFAULT -1, --
        `memory` decimal(8,3) NOT NULL DEFAULT '0.000', --
        `network_speed` int(11) NOT NULL DEFAULT -1,
        `manufacturer` varchar(32) NOT NULL DEFAULT '<unknown>',
        `model` varchar(32) NOT NULL DEFAULT '<unknown>',
        `owner` varchar(20) NOT NULL  DEFAULT '<unknown>',
        `wou_id` int(10) NOT NULL DEFAULT 0,
        `wou_name` varchar(80) NOT NULL DEFAULT '',

        `created_at` datetime NOT NULL,
        `last_edit` datetime NOT NULL,

        PRIMARY KEY (`id`,`report_date`),

        KEY `name` (`name`),
        KEY `status` (`status`),
        KEY `site` (`site`),
    ) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC
    """
```

## Running the ETL

Now that we have a table, we can load data into it.
For that, we will be going through the classical three phases: Extract, Transform and Load. 

```python
@cli.command("etl")
def etl():
    """Extract data from serverdb2, denormalize and load.

       This subcommand will run a large join on serverdb2, using the
       serverdb connection, and will then insert the data into the
       serverdb_dw.server_facts table.  The data is materialized and kept in
       RAM between extract and load phases.
    """
    run = Etl()

    run.fact_extract()
    run.fact_transform()
    run.fact_load()
```

### The Extract Phase

The fact extraction is basically one single select that joins against all the tables we need in order to get the data we want.
We are fetching the result into a giant list of rows, which we keep in our `Etl` object in the `data` slot.
Each row is a `dict` of field names and values.
This is going to be using a lot of memory, but we will make do.

```python
    def fact_extract(self, param=None, query=None):
        """ Run the fact_select query on serverdb2, loading the data
            into memory. The fact_query is being parametrized from
            self.fact_param.

            Set logging to debug to see queries. Set logging to info
            to see execution.
        """
        logger.info("start fact_extract")
        read = get_serverdb2_connection()
        rcursor = read.cursor(MySQLdb.cursors.DictCursor)

        # fetch default values from the class object
        if param is None:
            param = self.fact_param

        if query is None:
            query = self.fact_select

        query = query % param
        logger.debug("Query = %s", query)
        rcursor.execute(query)

        logger.info("end fact_extract")
        self.data = rcursor.fetchall()
```

Again, we pick up the default SQL from our `Etl` class, parametrize it and run it.
We simply suck all the data into memory and keep it.

The query is… ugly, and very long.
Again, I shorten it in order to save some space.
It gets repetitive anyway.

ServerDB is storing facts about Servers.
As a Django Application, it uses Django models, and the database mode is autogenerated from that.
The Django Application name is `servers`, so all tables are prefixed with that.

Server class objects are stored in the `servers_server` table, `servers` is the application prefix, and `server` the table matching the Django object.

But since the `Server` class is a subclass of `RackedAsset`, and that in turn is a subclass of `Asset`,
we are getting three tables `servers_server`, `servers_rackedasset` and `servers_asset`, which share a common `id`.
They are being joined together with an inner join, because we are only interested in servers and not in any other assets (such as Switches or Filers).

The `id` of an Asset, a RackedAsset and a Server are the same, since each is a specialization of the previous one:
Assets are things we have.
RackedAssets also have a position in the data center (and a site).
And servers have all the properties associated with a machine, such as a CPU type, memory, and disk space.

All rows are uniquely identified by an `id`, but since later in the data warehouse we will be tracking an `id` over time, we also need to record the `report_date` on which we collected the data.

Some values may be `NULL`, which will be inconvenient for us.
So we will be protecting us with use of `COALESCE()` a lot: This function goes through its parameters left to right and returns the first Non-NULL value it finds.
This allows us to provide a default value for NULLs.

We are working with `dict` cursors across our code, so the columns returned here and the columns we will be using to store data do not need to line up positionally,
as long as we provide proper names.

Finally, this is a monster join.
Joining more than ten tables in MySQL will blow up the optimizer, because the number of possible join permutations grows too large.
We are getting away with joining far more tables than that in our example, because all of our joins are `LEFT JOIN`, which are not commutative.
That means, the optimizer cannot do anything anyway: The asset/rackedasset/server triple is the driving table, and all other tables are just adjunct to that.

In any case, the query gets us the data we want -- all values, no IDs, completely denormalized.

```python
    fact_select = """select a.id
        , date_format(now(), "%%Y-%%m-%%d")    as report_date
        , a.name                               as name

        , coalesce(da.asset_type, "<unknown>") as asset_type
        , coalesce(a.status, "<unknown>")      as status

        , sn.shortname                         as site
        , coalesce(concat(sar.shortname, "-", saz.shortname), "<unknown>") as region

        , coalesce(group_concat(distinct r1.id order by r1.id), -1)                          as role_ids
        , coalesce(group_concat(distinct r1.puppet_service order by r1.puppet_service), "")  as puppet_services
        , coalesce(group_concat(distinct r1.name order by r1.name), "")                      as role_names

        , coalesce(t.org_unit_id, -1)          as wou_id
        , coalesce(t.name, "<unknown>")        as wou_name

    ... a few hundred lines deleted ...

    -- a server is an asset, rackedasset and server
    -- and that is why we do JOIN instead of LEFT JOIN here
    FROM %(source_db)s.servers_asset AS a
    JOIN %(source_db)s.servers_rackedasset AS ra
          ON (ra.asset_ptr_id = a.id)
    JOIN %(source_db)s.servers_server AS s
          ON (s.rackedasset_ptr_id = a.id)

    -- unfold asset_type
    LEFT JOIN %(source_db)s.servers_deliveryasset as da
        ON (da.asset_id = a.id)

    -- unfold the site_id, region and az data
    LEFT JOIN %(source_db)s.servers_site AS sn
        ON (sn.id = a.site_id)
    LEFT JOIN %(source_db)s.servers_availabilityzone as saz
        ON (sn.availability_zone_id = saz.id)
    LEFT JOIN %(source_db)s.servers_region as sar
        ON (saz.region_id = sar.id)

    -- unfold the serverrole_id (many-to-many, hence the group by in the end)
    LEFT JOIN %(source_db)s.servers_server_role AS sr
          ON (sr.server_id = a.id)
    LEFT JOIN %(source_db)s.servers_serverrole AS r1
          ON (sr.serverrole_id = r1.id)

    -- unfold team ownership information 
    LEFT JOIN %(source_db)s.servers_team as t
          ON (t.id = r1.managed_by)

    ... about a dozen tables deleted ...

    %(where_condition)s

    group by a.id
```

### The Transform Phase

The data we get from our Extract is not suitable for us without a few corrections and fixes.

We do have all the data in memory now, in `Etl.data`, so we can fix up things by running over that and applying a few filters.
Again, this is boring and repetitive cleanup work, so I have simplified things and show just one exemplary phase.

The CPU data in our data source is not the way we want it.
We apply a cleanup filter, `fact_transform_cpu()` to it.

```python
    def fact_transform(self):
        """ Transform and amend the loaded data from serverdb.
            - Fix CPU descriptions.
            - Extract CPU die counts and thread counts from description.
        """

        logger.info("start fact_transform")

        # Clean up the CPU data in self.data
        self.fact_transform_cpu()

        logger.info("end fact_transform")
```

The filter looks like this:

```python
   def fact_transform_cpu(self):
        """ Clean up the broken data from the servers_cpu table
            manually until serverdb2 fixes it at the source.
        """
        logger.info("start fact_transform_cpu")
        for row in self.data:
            row["cpu_version"] = cpu_cleanup(row["cpu_version"])
        logger.info("end fact_transform_cpu")
```

It iterates over the `data` list and calls a cleanup function for the field `cpu_version`.
We basically drop certain words (we only want types, no marketing names), we drop multiple spaces, and we drop MHz numbers after an "@"-sign.

```python
def cpu_cleanup(cpu):
    dropwords = ["intel(r)", "xeon(r)", "amd", "dual-core", "0", "virtual", "cpu"]

    # Nothing to see here: move on
    if cpu in ["<unknown>", "Not Specified"]:
        return cpu

    # uniform case, remove extra spaces, speed info
    cpu = cpu.lower()
    cpu = re.sub(r" +", " ", cpu)
    cpu = re.sub(r" *@ *[0-9.]+.*", "", cpu)

    # drop items we do not care about
    cpu_fields = cpu.split(" ")
    cpu = ""
    for field in cpu_fields:
        if field not in dropwords:
            cpu += field + " "

    # make sure we don't have strange spacing in the version name
    # we previously had that
    cpu = re.sub(r"- +", "-", cpu)

    return cpu
 ```

Other filters exist for other fields, where we have similar anomalies and annoyances.

We might also call out to other data source or databases, and add data from them to our in-memory dataset.
For example, we could call out to Puppet, to collect Puppet Facts collected from "inside" the running machine.
Or we could call to our Network Equipment Management System, Nemo, to collect data about machines from a Switch PoV.

### The Load Phase

Now that we have a clean dataset in memory we can write it out into our `server_facts` table in the data warehouse.
We do that using `REPLACE` statements, which will allow us to run the ETL process multiple times per day.
Newer runs will simply overwrite older runs, by primary key (`(id, report_date)`)

Originally, we wrote out the data in a single connection, but that created many problems:

- The large write created replication delay.
- The large write exceeded the maximum transaction size for compressed binlog (1 GB).
- The large write exceeded the maximum transaction size for group replication primaries.

So we now run our write query with an `executemany_in_batched()`, which makes multiple smaller writes.
It also checks replication, and waits with the execution of the next transaction until the previous one has finished replicating.

```python
   def fact_load(self, param=None):
        """ Take the data and load it into the target table in the target database,
            using replace-statements. The use of replace-statements makes the data
            load idempotent on a single day.

            The query is being parametrized using self.fact_param.
        """
        logger.info("start fact_load %s rows.", str(len(self.data)))

        write = get_serverdb_dw_connection()
        replica = get_serverdb_dw_replica_connection() # get one load-balanced random replica of many 

        # getting some default parameters
        if param is None:
            param = self.fact_param

        # we are only interested into the keys here, for query building
        firstrow = self.data[0]

        # replace into serverdb_dw.server_facts set col1 = %(col1)s, ...
        query = "replace into %(target_db)s.%(target_table)s set " % param
        query += ", ".join(f"{k} = %({k})s" for k in list(firstrow.keys()))

        logger.debug("Query = %s", query)

        executemany_in_batches(write, replica, query, self.data)
        self.data = []

        logger.info("end fact_load")
```

The `executemany_in_batches()` looks like this:

```python
def executemany_in_batches(write, replica, query, data, *, batch_size=1000):
    wcursor = write.cursor(MySQLdb.cursors.DictCursor)
    rcursor = replica.cursor(MySQLdb.cursors.DictCursor)

    # It's nonfatal for the SET SESSION command to fail
    # It means there were multiple batches executed within the same
    # script invocation and a previous one still has an ongoing transaction
    with contextlib.suppress(MySQLdb._exceptions.OperationalError):
        wcursor.execute("SET SESSION session_track_gtids=OWN_GTID")

    for n in range(0, len(data), batch_size):
        wcursor.executemany(query, data[n : n + batch_size])
        write.commit()
        wcursor.execute("SELECT @@GLOBAL.GTID_EXECUTED as gtid")
    
        gtid = wcursor.fetchone()["gtid"]
        rcursor.execute("SELECT WAIT_FOR_EXECUTED_GTID_SET(%s, 10)", (gtid,))
```

This will push `batch_size` many rows at once into the database, commit, and wait for the replication to acknowledge the arrival in the replica.

## Running Aggregations

After loading the data into the database, we update a bunch of aggregations.
We count machines per Puppet class, per Data Center, and per Vendor and Type. 
We do keep these counts per `report_date`.

That also means we can add to existing aggregations and need to run sums only for the current day.
This is much faster than regenerating data for the entire collection every day, and past numbers also do not change.

# Data size

Our `server_facts` table is very wide, the values shown here are simplified and the table shortened.
We do not yet compress strings with lookup tables, so each server name is repeated for each day over the lifetime of the server.
A CPU or Vendor name is also repeated, and much more often.

Assuming 100.000 machines and one KB of data per machine, we end up with 100 MB of data per day retained.
90 days are kept at full resolution, for 9 GB of data.
Additionally, another 100 MB per week is retained, for 5.2 GB of data per year, or an additional 26 GB in five years.

A 35 GB database is not large, and can be kept in memory easily on most database server machines.
So we do not actually have a "big data" problem here, but we do have a valuable collection of server data that enables us to

- document server use by team,
- model refresh projects by predicting server retirement dates,
- analyze per team/use-case fleet growth over time,
- make predictions and model fleet growth for the coming year, planning procurement and capex,
- and collect aggregate power consumption and compare it to metered and predicted power consumption at the rack, row and room level.

This enables a number of planning use-cases and gives visibility for the data center team.

It also makes a nice model use-case to explain data warehouses and how to transform transactional data into business intelligence data.
