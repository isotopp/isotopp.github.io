---
author: isotopp
title: "Proper O11y for MySQL"
date: "2022-10-18T06:07:08Z"
feature-img: assets/img/background/mysql.jpg
tags:
- lang_en
- mysql
- mysqldev
- debug
aliases:
  - /2022/10/25/proper-o11y-for-mysql.md.html
---

Three years ago, I learned that due to SREcon, Charity Majors was in Amsterdam.
I set up a meeting between Benjamin Tyler, Yves Orton and a few more colleagues of mine, and her.
That is, because apparently in a case of co-evolution, our company internal "Events" system and Honeycombs observability tooling, modelled after experiencing Fabooks "Scuba" seemed to be doing a lot of the same things.

These days, we are using Honeycomb a lot to record events, and debug code running in distributed systems.
But one type of system does not fit into this very well:
Databases of all kinds.
And I don't understand why, because it would be perfect.

About one year ago, I wrote an article about "[Tracing a single query with PERFORMANCE_SCHEMA]({{< relref "2021-09-15-mysql-tracing-a-single-query-with-performanceschema.md" >}})". 
Why would I want to trace a single query like that?

I want to get data about query execution out of MySQL, at scale, and push this into Honeycomb.

# Honeycomb, Spans, Traces and Tags

Honeycomb is a tool that ingests "Spans", time intervals, that can be annotated with arbitrary key-value pairs.
Spans do not only have a start and stop time, but also maintain relationships between Callers and Callees as a Tree Structure.
A root Span and its children form an execution trace ("a trace") of a single call or entity of work in a distributed system.

A lot of Honeycomb assumes that the values are numbers, but it doesn't have to stop here (and other tooling can read Spans and work with non-numeric data, too).

Spans nest, and you could look at the execution of your program as an arrow of time on which the spans are arranged.

![](2022/10/proper-o11y-01.png)

*A root span at the application level is started in `buildAvailabilityQuery()`. This called into `sqlORM()`, which in turn called `runSQL()` several times. All this is recorded from the application and the application code. We'd want to see MySQL execution data in there, as subspans of `runSQL()`.*

For each span then any number of KV-pairs are recorded, so you could record call parameters, results, or intermediate state.  

Honeycomb allows you to aggregate such data on the fly, in almost real time, so you can ask "how many SQL queries is each action running, as a histo".

You could also ask "What is the aggregated SQL time of each action", over time. You'd see that at a certain point in time this time changed in the P95 and above.
With their "Bubble up" functionality you'd mark the time interval and the aggregate interval ("> 1.5ms execution time").
Honeycomb would take the marked set vs. the base set (before, and faster), and highlight you all KV pairs that are different.

You might see that all slow samples have a specific commit tag associated with them, or you might see that all slow samples have a specific host machine tag or AZ tag associated with them.

Without prior knowledge you'd see what the root cause for the slowness is.

# Application level instrumentation

Database instrumentation right now does not provide good data that can go into systems such as Honeycomb.

With application code, this is all easy.

```python

import beeline

@beeline.traced(name='external_api_request')
def external_api_request(request_params):
    # ...

    # adding fields here will add it to the active span wrapping
    # this function
    beeline.add_context_field("response_time", response_time)

    # ...

@beeline.traced(name='main')
def main():
  beeline.add_context({"request_params": request_params})
  # calling this function will create a new span, under the "main" span
  result, error = external_api_request(request_params)
  # add more context once we have results
  beeline.add_context({"result_count": len(result), "error": error})

# This will create a span - or if no trace is in progress, will also
# start a trace
main()

# Do not forget to close the beeline to ensure all spans get sent
# before the application ends!
beeline.close()
```

*Example from the [Honeycomb Documentation](https://docs.honeycomb.io/getting-data-in/beeline/python/#using-a-decorator), showing how to instrument Python code.*

Even if you know nothing about Python or Honeycomb, you can understand this.

The `@beeline.traced()` decorator wraps the function after it into the tracing harness, creating a span and maintaining the caller/callee relationships.
The `beeline.add_context()` calls add KV-pairs to the tracing span.

# What database integration can look like

![](2022/10/proper-o11y-02.png)

*What we want from a Query: The SQL_TEXT, and the Query Plan that actually ran for that Query. We would also want a list of Page#'s requested and Page#'s read from disk. Optionally, we would want subspans for each lock and wait, with annotations.*

Why?

We get a Span for each SQL statement, maintaining the Caller/Callee Relationship with the code that sent us the query.
Thus, we see the SQL exectution in the context of the ORM that generated the SQL, in the context of the Application Code that called into the ORM.

Even ungreppable, generated SQL becomes attributable to the location in the source it is coming from.
We get to see the ORM's work in the context of the application that used it and the SQL it generated. With timings.
Attribution was previously hard to do, but this way it is trivial, because the call tree relationship is explicitly maintained.

We also get to see if somebody is running "SELECT in a loop" instead of using a JOIN ("machine gunning pattern").
Machine gunning was previously very hard to even detect, and even harder to attribute. Now it is trivial.

We get to see the Query plan that ran, in the context of the application code (two spans up) that asked for data, with timings.
We get to attribute SQL runtime, and result processing time in the application, easily, because we get to see if the database SQL runtime span fills all of the SQL query processing span, or if there is additional time that is only visible in the application. This could only be result processing that was not marked up properly.

We get to see pages requested from disk (before hitting the cache) and actual IO generated (cache misses) for each query.
That allows us to see queries that have a good plan, but are slow, and understand why this is.
With optional locking and wait information, we'd see more of that, for cases where this is not caused by IO but contention.

And, as a side benefit, a page# stream before and after the cache also allows us to determine the working set size of the database (for one query, for a subset of queries or for all queries), and to calculate ideal cache and instance sizes.
This makes instance type selection a guided, non-empirical process, but that is another article.

# Conclusion

None of that exists, but I don't know why.
Database tracing is completely ignoring modern observability integration, and things such as PMM or VividCortex are distinct from Honeycomb like systems.
Attribution of SQL (when generated) is a *mess*.

Information about the plan of queries that ran is not retained well in MySQL.
IO traces around the buffer pool are not even instrumented. They can be done. I routinely do them on production systems [at the file system level with blktrace]({{< relref "2022-09-27-mysql-local-and-distributed-storage.md" >}}).

And exfil of that data through `P_S` is just painful.
One would want an in-server ring buffer and a Pusher thread that sends this data in a non-blocking way (using localhost UDP?) to a listener, that transforms this into whatever O11y system you'd be using.

So here I am, with my limited C++, and a 100 GB build partition, trying to build a P_S table that is mostly a stream of BLOBs, into which I try to collect the data I need in a non-crashing way.
Once I have that, I can try to build a Pusher that takes data from that pool, trying to ship that to my coprocess, which then takes this and transforms it into whatever Honeycomb wants, injecting Spans into their system.

Then I will finally be able to debug SQL properly, and in a single place with the code that made that SQL in the first place.

# Other Systems

My colleague Willian Stewart pointed me at Vitess, which [already does that for the "above MySQL"](https://vitess.io/docs/16.0/user-guides/configuration-advanced/tracing/#instrumenting-queries) part of Vitess:

![](2022/10/proper-o11y-03.png)

*The call tree of a Query to Vitess as it is being handled inside of Vitess, as seen by Jaeger.*

Vitess requires you to generate a piece of JSON that contains the necessary IDs to build a call tree:

```json
{"uber-trace-id":"{trace-id}:{span-id}:{parent-span-id}:{flags}"}
```

All items of a single trace have the same `trace-id`. 
Each span has their own `span-id` and also states what the `parent-span-id` is.
Additional `flags` control the annotations generated ("what gets traced").

To protect the data against accidental interpretation and munging, Vitess wants you to base64 encode the thing and then put it into a `/*VT_SPAN_CONTEXT=...*/` pseudo-comment as part of the query to be traced.
