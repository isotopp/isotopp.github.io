---
layout: post
status: publish
published: true
title: Using MySQL Partitions (a Python example)
author-id: isotopp
feature-img: assets/img/background/mysql.jpg
date: '2017-07-09 18:31:39 +0200'
tags:
- mysql
- erklaerbaer
- lang_en
---
Today somebody had a problem with expiring a large table (a Serendipity
Blog table). 

In MySQL InnoDB, tables are physically ordered by primary key (InnoDB data
is a B+ tree, a balanced tree where the data pages are the leaves of the
tree). If you are expiring old data from such a log table, you are deleting
from the left hand side of the tree, and since it is a balanced tree, that
triggers a lot of rebalancing - hence it is very slow. 

If you rename the old table and INSERT … SELECT the data you want to keep
back into the original table, that can be faster. 

But if the data you want to keep is larger than memory, the indexing of the
data will still be slow. A nice way to handle log tables are partitions.
Here is an example. It's not very cleaned up, but it works on my system.

```python
#! /usr/bin/env python --

# setting up the python environment:

# pip install virtualenv
# virtualenv partitions
# cd partitions
# source bin/activate
# pip install --update pip
# pip install mysqlclient click

# setting up the MySQL:
# create user demo@localhost identified by "pfrtlng";
# grant all on demo.* to demo@localhost;

# Testing:
# ./partitions drop --name keks
# ./partitions create --name keks
# ./partitions fill --name keks
# mysql -u demo -ppfrtlng demo -e 'select * from information_schema.partitions where table_name = "keks"'

# ./partitions add --name keks
# mysql -u demo -ppfrtlng demo -e 'select * from information_schema.partitions where table_name = "keks"'
# ./partitions add --name keks
# ./partitions add --name keks
# ./partitions add --name keks
# mysql -u demo -ppfrtlng demo -e 'select * from information_schema.partitions where table_name = "keks"'

# ./partitions dropbyname --name keks --pname p0
# mysql -u demo -ppfrtlng demo -e 'select * from information_schema.partitions where table_name = "keks"'

# ./partitions dropbyvalue --name keks --valuebelow 500001
# mysql -u demo -ppfrtlng demo -e 'select * from information_schema.partitions where table_name = "keks"'

# ./partitions drop --name keks

import click

import MySQLdb
import random
import string

from pprint import pprint

# A lot of SQL collected here
db_config = dict(
  host   = "localhost",
  user   = "demo",
  passwd = "pfrtlng",
  db     = "demo",
)

sql_drop_table = 'drop table %s'

sql_create_table = """create table %s (
  counter_id integer not null primary key auto_increment,
  data       varchar(64) not null
) %s
"""
sql_partition_clause = 'partition by range (counter_id) ( %s )'
sql_partition_range_clause = 'partition p%d values less than (%d),'

sql_insert_into = 'insert into %s ( counter_id, data ) values ( %d, "%s" )'

sql_find_partitions = """select partition_name, partition_description 
  from information_schema.partitions 
 where table_schema = '%s'
   and table_name = '%s' 
order by cast(PARTITION_DESCRIPTION as signed) desc 
 limit 2"""

sql_alter_table_add_partition = 'alter table %s add partition ( partition %s values less than (%d))'

sql_alter_table_drop_partition = 'alter table %s drop partition %s'

sql_find_partition_by_value = """select partition_name
  from information_schema.partitions
 where table_schema = '%s'
   and table_name   = '%s'
   and cast(partition_description as signed) < %d"""

###########
# create a db connection
db = MySQLdb.connect(**db_config)


@click.group(help='Test row expiration with and without partitions.')
def partitions():
  pass

@partitions.command()
@click.option('--name', default='demo', help='Table name to drop')
def drop(name):
  cmd = sql_drop_table % name
  
#  click.echo('CMD: %s' % cmd)
  try:
    c = db.cursor()
    c.execute(cmd)
    click.echo('Table "%s" dropped.' % name)
  except MySQLdb.OperationalError as e:
    click.echo('Table "%s" did not exist.' % name)

@partitions.command()
@click.option('--name', default='demo', help='Table name to create')
@click.option('--partitioned/--no-partitioned', default=True, help='Create table partitioned?')
@click.option('--size', default=1000000, help='Expected table size')
@click.option('--psize', default=100000, help='Partition size')
def create(name, partitioned, size, psize):
  pcmd = ''

  # add partitioning clause to create table statement
  if (partitioned):
    ppcmd = ''
    counter = 0
    # add all the ranges
    for r in range(0, size+1, psize):
      ppcmd   = ppcmd + ( sql_partition_range_clause % (counter, r))
      counter = counter + 1

    # remove the trailing comma
    pcmd  = sql_partition_clause % ( ppcmd.rstrip(',') )
  
  # complete the create table statement
  cmd  = sql_create_table % ( name, pcmd )

  c = db.cursor()
  try:
    c.execute(cmd)
    click.echo('Table "%s" created %s partitions.' % ( name, "with" if partitioned else "without"))
  except MySQLdb.OperationalError as e:
    click.echo('Table "%s" already exists.' % name)

@partitions.command()
@click.option('--name', default='demo', help='Table name to insert into')
@click.option('--size', default=1000000, help='Number of rows to load into the table.')
def fill(name, size):
  for i in range(1, size):
    str = ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(20))
    cmd = sql_insert_into % (name, i, str)

    c = db.cursor()
    try:
      c.execute(cmd)
    except MySQLdb.Error as e:
      click.echo("MySQL Error: %s" % e)
    
    # commit every 1000 statements
    if (i % 10000 == 0):
      db.commit()

  # one final commit
  db.commit()

@partitions.command()
@click.option('--name', default='demo', help='Table name to add partition to')
@click.option('--size', default=None, type=click.INT, help='Partition size in id count')
def add(name, size):
  global db_config # we need the schema name
  schema = db_config['db']

  cmd = sql_find_partitions % ( schema, name ); # find me the two last partitions from I_S.PARTITIONS
#  click.echo("Sql: %s" % cmd)
  c = db.cursor(MySQLdb.cursors.DictCursor)
  c.execute(cmd)
  r = c.fetchall()

  # if no size was given, we take the interval from the two highest numbered partitions as default
  if size is None:
    size  = int(r[0]['partition_description']) - int(r[1]['partition_description'])
  limit = int(r[0]['partition_description']) + size

  # we automatically calculate the new partition name p(XX+1) from the last pXX
  pname = 'p' + str(int(r[0]['partition_name'][1:]) + 1)

  cmd = sql_alter_table_add_partition % ( name, pname, limit )
#  click.echo("Sql: %s" % cmd)
  c = db.cursor()
  try:
    c.execute(cmd)
    click.echo('Partition %s has been added (values less than %d, that is a %d step size.)' % (pname, limit, size))
  except MySQLdb.Error as e:
    click.echo("MySQL Error: %s" % e )
    exit(1)

@partitions.command()
@click.option('--name', default='demo', help='Table name to drop partition from')
@click.option('--pname', help='Drop partition by name pXXX')
def dropbyname(name, pname):
  if pname is None:
    click.echo('I need a --pname')
    exit(1)
  
  cmd = sql_alter_table_drop_partition % ( name, pname)
#  click.echo('Sql: %s' % cmd)
  c = db.cursor()
  try:
    c.execute(cmd)
    click.echo("Dropped partition named %s" % pname)
  except MySQLdb.Error as e:
    click.echo("MySQL Error: %s" % e)
    exit(1)

@partitions.command()
@click.option('--name', default='demo', help='Table name to drop partitions from')
@click.option('--valuebelow', type=click.INT, help='Drop all partitions with values below X')
def dropbyvalue(name, valuebelow):
  global db_config # we need the schema name
  schema = db_config['db']
  
  if valuebelow is None:
    click.echo('I need a --valuebelow')
    exit(1)

  cmd = sql_find_partition_by_value % ( schema, name, valuebelow)
#  click.echo("Sql: %s" % cmd)
 
  c = db.cursor()
  try:
    c.execute(cmd)
  except MySQL.Error as e:
    click.echo("MySQL Error: %s" % e)
    exit(1)
  
  result = c.fetchall() # reseult[rownr][0] is partition name
  
  for row in result:
    cmd = sql_alter_table_drop_partition % (name, row[0])
#    click.echo("Sql: %s" % cmd)
    c = db.cursor()
    try:
      c.execute(cmd)
      click.echo("Dropped partition named %s" % row[0])
    except MySQL.Error as e:
      click.echo("MySQL Error: %s" % e)

partitions()
```
