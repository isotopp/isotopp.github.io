---
author: isotopp
date: "2022-02-25T11:35:00Z"
feature-img: assets/img/background/rijksmuseum.jpg
title: "Open Telemetry"
published: false
tags:
- lang_en
---

# Overview

- set of APIs, SDKs, tooling and integrations for thr creation and management of telemetry data.
  - That is sdefined as traces, metrics and logs.
  - Goal interop, vendor agnostic.
- Ideal: instrument source only once, no matter the log target, single collector binary acting as scraper, aggregator and forwarder/gateway
- end-to-end implementation (generate, emit, collect, process and export), incl send to multiple destinations
- data format and semantics definitions

# Traces

- as in distributed tracing; follow a request across all the services it touches in order to be served
  - "span", "tree of spans"
  - Can be used to represent spatial travel (service-to-service) or callstacks
- "context" (set of globally unique identifiers that represent a unique request that each span is part of)
  - should contain request, error and duration metrics minimum (RED)
- "root span" as a container for other child spans that form a tree
  - "tracer" interface
  - "[traces](https://opentelemetry.io/docs/reference/specification/overview/#tracing-signal)" spec

# Metrics

- measurements associated with metadata and event time 
  - counter (sum over time, odometer), measure (value over time, trip odometer), observer (current value at time)
  - "aggregations", combination of metrics into one or more statistics (sum, count, last, histo)

# Logs

- "timestamped text record", may be structured

# Baggage

- kv pairs ("baggage") can provide additional context ("tags")

# Instrumentation

- The act of adding code to function calls to start/end spans and add data
  - Can be done half automatically
- must wrap context properly

```java
// extract the context
Context extractedContext = propagator.extract(Context.current(), httpExchange, getter);
Span span = tracer.spanBuilder("receive")
            .setSpanKind(SpanKind.SERVER)
            .setParent(extractedContext)
            .startSpan();

// make span active so any nested telemetry is correlated
try (Scope unused = span.makeCurrent()) {
  userCode();
} catch (Exception e) {
  span.recordException(e);
  span.setStatus(StatusCode.ERROR);
  throw e;
} finally {
  span.end();
}
```
