---
author: isotopp
date: "2006-05-04T03:02:01Z"
feature-img: assets/img/background/rijksmuseum.jpg
published: true
title: "SQL vs. LDAP (Kai Voigt)"
tags:
- lang_en
- talk
- publication
- internet
---

A talk given by Kai Voigt at Linuxtag in Wiesbaden, based on 
[LDAP vs. SQL]({{< ref "/content/posts/2002-01-31-ldap-vs-sql.md" >}}) 
and additional experience we had, based on our work with directory services.

# SQL vs. LDAP

![](/uploads/2006/05/sql-vs-ldap-01.png)

Both SQL and LDAP are infrastructures to store, retrieve and modify data.
Various implementations are available, either free or commercial software.

This talk will introduce SQL and LDAP, explain what they have in common, 
where they are different and how they should be used.
The most popular implementations will be listed, and which of them make most sense in different environments.

SQL and LDAP are based on different data structures. 
SQL is a relational data model, while LDAP is a hierarchical model.
Both will be looked at in detail.

Examples from the real world illustrate when SQL or LDAP should be used.
Sometimes it's best to just use one system, in some cases a mixture of both makes sense.

Also, common mistakes will be demonstrated when people use the wrong system,
either by lack of knowlegde or by following some hype.

## Kai Voigt

![](/uploads/2006/05/sql-vs-ldap-02.png)

Kai Voigt works as an Instructor and Consultant for MySQL and used to implement LDAP based systems and applications in former engagements.
He was invited as a speaker at various conferences, including Roxen User Conference and Open Source Database Conference.

## Goals

![](/uploads/2006/05/sql-vs-ldap-03.png)

- Understand different data structures
- Know about operations on data
- Know common LDAP problems
- Know LDAP benefits
- Make the right decision

## Implementations

![](/uploads/2006/05/sql-vs-ldap-04.png)

- SQL
  - MySQL
  - PostgreSQL
  - Oracle
  - MS SQL
  - DB2

- LDAP
  - OpenLDAP
  - SUN
  - MS Active Directory
  - Netscape

# Data Structures

![](/uploads/2006/05/sql-vs-ldap-05.png)

## SQL Structures

![](/uploads/2006/05/sql-vs-ldap-06.png)

- Catalogs, Databases, Tabkles, Rows, Columns
- Columns hold single values (or NULL)
- Columns have scalar data types
- Indexes on table level
- Foreign key constraints between tables

![](/uploads/2006/05/sql-vs-ldap-07.png)

- Foreign Keys, Constraints

## LDAP Structures

![](/uploads/2006/05/sql-vs-ldap-08.png)

- Data Objects in Hierarchy
- Attributes and data types defined by Objectclasses (may/must exist)
- Primary Key: Distinguished Name
- Indexing on data type
- No foreign key constraints 

![](/uploads/2006/05/sql-vs-ldap-09.png)

- LDAP tree, dn

## An LDAP node

![](/uploads/2006/05/sql-vs-ldap-10.png)

- DN: city=1,cont=asia,o=myworld
- Set of attributes
  - Name=Tokyo
  - Population=18.000.000
  - Language=Japanese
  - Langiage=Chinese
  - Country=Japan

## Hierarchies in SQL

![](/uploads/2006/05/sql-vs-ldap-11.png)

- Storing
  - Primary Key of parent as column
- Accessing
  - Joining the table to itself
  - Just static depth

## Data sizes

![](/uploads/2006/05/sql-vs-ldap-12.png)

- SQL
  - Larger data, higher latency
- LDAP
  - Smaller data, lower latency

# Operations

![](/uploads/2006/05/sql-vs-ldap-13.png)

## SQL Operations

![](/uploads/2006/05/sql-vs-ldap-14.png)

- Selection: WHERE clauses
- Projection: SELECT plus Columns List
- Aggregation: GROUP BY
- Combination: INNER/OUTER JOIN
  - and Rename for Self-Join

## LDAP Operations

![](/uploads/2006/05/sql-vs-ldap-15.png)

- Selection on attribute values
- Projection on attributes (no synthetic values
- Aggregation: not possible
- Combination: not possible)

## SQL Usage

![](/uploads/2006/05/sql-vs-ldap-16.png)

- Storage for large scale data
- Business Logic

- Conclusion: complex and concurrent queries

## LDAP Usage

![](/uploads/2006/05/sql-vs-ldap-17.png)

- Authentication
- Configuration Files
- Address Books

- Conclusion: Many trivial quick read requests

# Common Problems

![](/uploads/2006/05/sql-vs-ldap-18.png)

## Top 5

![](/uploads/2006/05/sql-vs-ldap-19.png)

- Using only LDAP
- Using LDAP for massive write requests
- Changing LDAP structure
- Using LDAP for complex queries
- Bad data design in LDAP

## Using LDAP only

![](/uploads/2006/05/sql-vs-ldap-20.png)

- Data Types, Objectclasses
  - Need to be extended in most cases
  - Server restart required
- No referential integrity
- No relations between
- DNs unstable

## Write Requests
![](/uploads/2006/05/sql-vs-ldap-21.png)

- No transactions
  - "add" and "modify" are atomic
- No locking
- No bulk updates
- No scalable replication

## Changing Structure

![](/uploads/2006/05/sql-vs-ldap-22.png)

- Schema definition out-of-band
- MAY inflation
- No introspection

## Complex Queries

![](/uploads/2006/05/sql-vs-ldap-23.png)

- DN is primary key
  - DN contains structural information
  - DN is unstable
    - Moving an Object kills you
- No SQL Joins

## Data Design

![](/uploads/2006/05/sql-vs-ldap-24.png)

- Organisational hierarchies into LDAP trees
- DN not opaque
- Large data in LDAP
- Multiple Value Attributes

## Other Problems

![](/uploads/2006/05/sql-vs-ldap-25.png)

- No simple server-side functions
- No normalization
- No powerful SQL features
  - Stored Routines, Views, Triggers

# LDAP Benefits

![](/uploads/2006/05/sql-vs-ldap-26.png)

## Speed

![](/uploads/2006/05/sql-vs-ldap-27.png)

- Low Connection Overhead
- Simple Queries
- Common Operations
  - Existence Testing
  - Single Attributes
  - Authentication

## Compatibility

![](/uploads/2006/05/sql-vs-ldap-28.png)

- Standards
  - Wire Protocol
  - Data Types
- Interoperability
  - e.g. Apple Mail Client + SUN LDAP Server

# The right decision

![](/uploads/2006/05/sql-vs-ldap-29.png)

## No rule of thumb

![](/uploads/2006/05/sql-vs-ldap-30.png)

- Analyze data structures and operations
- Run benchmarks

- Individual solution for each project
- Solution might be changed in the future

## Best Practice

![](/uploads/2006/05/sql-vs-ldap-31.png)

- SQL as leading system
- periodic or triggered exports to LDAP
- No writes to LDAP system by applications
- Backup required only on SQL system

# Thank you!

![](/uploads/2006/05/sql-vs-ldap-32.png)
