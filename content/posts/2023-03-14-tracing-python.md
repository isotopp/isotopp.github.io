---
author: isotopp
title: "Tracing Python"
date: 2023-03-14T12:13:14Z
feature-img: assets/img/background/rijksmuseum.jpg
tags:
- lang_en
- python
- debug
---

Based on a discussion on IRC and Mastodon: "How can I get access to the return values of my (Python-) programs functions?"
And more generally, how can I trace function execution in Python, showing function parameters and return values?

# PyCharm builtin method

Of course, you can always simply turn on this in the PyCharm debugger:

![](/uploads/2023/03/python-tracing-01.png)

*PyCharm, Debug Window, Gear Icon, "Show Return Values"*

# Do it yourself: @logging

You can also implement such a thing from first principles, in Python:

```python
import functools


def args_to_str(*args):
    return ", ".join(map(str, args))


def kwargs_to_str(**kwargs):
    ret = ""
    for k, v in kwargs.items():
        ret += f"{k}={v},"

    return ret[:-1]


def logging(func):
    func.__indent__ = 0

    @functools.wraps(func)
    def wrapper_logging(*args, **kwargs):
        func_indent = " " * func.__indent__
        func.__indent__ += 2

        func_name = func.__qualname__
        func_args = args_to_str(*args)
        func_kwargs = kwargs_to_str(**kwargs)

        print(f"{func_indent} -> Enter: {func_name}({func_args}", end="")
        if func_kwargs != "":
            print(f", {func_kwargs}", end="")
        print(")")

        result = func(*args, **kwargs)

        print(f"{func_indent} <- Leave: {func_name}({result})")
        return result

    return wrapper_logging


@logging
def fac(n: int) -> int:
    if n == 1:
        return 1
    else:
        return n * fac(n - 1)


if __name__ == '__main__':
    result = fac(3)
    print(f"{result=}")
```

This makes use of `@functools.wraps()` to define a [decorator](https://python101.pythonlibrary.org/chapter25_decorators.html), `@logging`. 
It also leverages the fact, that anything, including a callable, can have properties, which we are using to maintain an indent count in `func.__indent__`.
This is initialized to 0, and then incremented by 2 for each call in the call stack. Unwinding the call stack resets the counter, so we don't have to do that manually.

We have two helper functions to turn the functions `*args` and `**kwargs` into proper strings, and we access `func.__qualname__` to get the functions [name](https://docs.python.org/3/glossary.html#term-qualified-name).
We are using `__qualname__` to handle inner functions properly here, even if that is sometimes creating less readable output.

Running the code results in

![](/uploads/2023/03/python-tracing-02.png)

*Output from the Python program above shows function calls and results.*

# Using autologging

The [autologging](https://github.com/mzipay/Autologging) package makes this simpler, even if it lacks the nice indentation.

Our code becomes much shorter:

```python
import logging
import sys
from autologging import logged, traced, TRACE

logging.basicConfig(
    level=TRACE,
    stream=sys.stdout,
    format="%(levelname)s:%(name)s:%(funcName)s:%(message)s"
)


@logged
@traced
class Fac:
    def __init__(self):
        pass

    def fac(self, n: int) -> int:
        self.__log.debug("OHAI")

        if n == 1:
            return 1
        else:
            return n * self.fac(n - 1)


if __name__ == '__main__':
    f = Fac()
    print(f.fac(10))
```

We get to use a new loglevel `TRACE`, and import `@logged` and `@traced` decorators from the package.
After setting up a log channel with proper formatting, we can mark functions with the decorator, get their execution traced and can simply log.

The output:

![](/uploads/2023/03/python-tracing-03.png)

*Output of our program using the `autologging` package.*

# Using `icecream`

At this point Andreas Thienemann mentioned `icecream`, which is remarkable comfortable.
Versions of `icecream` exist for many programming languages, so this is not Python specific.

```python
from icecream import ic

ic.configureOutput(includeContext=True)


class Fac:
    def __init__(self):
        pass

    def fac(self, n: int) -> int:
        ic(n)
        if n == 1:
            return ic(1)
        else:
            return ic(n * self.fac(n - 1))


if __name__ == '__main__':
    f = Fac()
    print(f.fac(10))
```

Icecream defined a function `ic()`, which you can call with parameters (`ic(n)`, `ic(1)`, and `ic(n * self.fac(n - 1))`), or without (`ic()`).
The function will print its parameters, just like a debug print, or when called without parameters, just log its execution including source file and line.
Options to prettify the output exist.

The package also provides a function `install()`, which will simply make `ic()` available as a builtin:

```python
from icecream import ic
install()
# this basically does builtin.ic = ic

# ic() is now available in all your modules 
# without having to include it in every submodule.
```

The output looks like this:

![](/uploads/2023/03/python-tracing-04.png)

*Running our code with `icecream` produces this output, nicely colorized and pretty printed.
We enabled `includeContext=True`, so we also get file names and line numbers.*

# `snoop` and `birdseye`

Of course, this is not the end of it.
The package [snoop](https://github.com/alexmojaki/snoop) provides tracing of one or all functions,
comes with its own version of icecream called `pp` (PrettyPrint).
Using `pp.deep()`, it will show expression evaluation step by step.

```python
from snoop import pp
pp.deep(lambda: x + 1 + max(y + 2, y + 3))
```

logs

```console
12:34:56.78 LOG:
12:34:56.78 ............ x = 1
12:34:56.78 ........ x + 1 = 2
12:34:56.78 ................ y = 2
12:34:56.78 ............ y + 2 = 4
12:34:56.78 ................ y = 2
12:34:56.78 ............ y + 3 = 5
12:34:56.78 ........ max(y + 2, y + 3) = 5
12:34:56.78 .... x + 1 + max(y + 2, y + 3) = 7
```

Snoop understands Python:
It shows not just file numbers, but actual code call context, parameters.
It handles debugging Decorators, can log Exceptions properly, and can log call stacks of a configurable depth.

Check out the examples in the link above.

[birdseye](https://github.com/alexmojaki/birdseye) is a continuation of `snoop` to the extreme, and integrated with it.
It captures the same data as `snoop`, but logs it to a SQLite file in your `$HOME`.
It will then allow you to start a `flask`-based Webserver on port 7777 to evaluate the trace file and replay it step by step.

`@spy` allows you to run `snoop` and `birdseye` in tandem.

```python
from birdseye import eye
from snoop import snoop, spy

@spy
def fac(n: int) -> int:
    if n <= 1:
        return 1
    else:
        return n * fac(n-1)

if __name__ == '__main__':
    result = fac(3)
    print(f"{result=}")
```

This will instrument the code to run with `snoop`, and also log into the database file.

The trace is pretty:

![](/uploads/2023/03/python-tracing-05.png)

*Output of `snoop` running on our test function. We instrumented with `@spy`, which will also create a trace file.*

Running the Birdseye decoder is easy: `python -m birdeye` will start it on the default port, `7777`.

![](/uploads/2023/03/python-tracing-06.png)

*Starting the `birdseye` web server to serve trace files. It is bound to localhost, and listens by default on Port `7777`.*

The rendered trace looks like this:

![](/uploads/2023/03/python-tracing-07.png)

*`birdseye` webserver showing a trace. You can click through the program execution.*

# `peepshow`, a commandline debugger

The package [peepshow](https://github.com/gergelyk/peepshow) then offers a full scale commandline debugger, which allows you to trace program execution, set breakpoints and so on.

Unfortunately, it has been abandoned (the last commit was in November 2020), and does not support modern Python.

# Honeycomb and Opentracing

What if you cannot access the host your code runs on, for example, because that host is variable and many, because you are running in Kubernetes?
In this case, Honeycomb and other OpenTelemetry packages have you covered.
They do the same logging as above, but package data in OpenTelemetry Spans, and send these over the network.

The old, original Honeycomb Beeline for Python is documented here: [Python Beeline](https://docs.honeycomb.io/getting-data-in/beeline/python/).
The current OTel compatible implementation is here: [OTel replacement](https://docs.honeycomb.io/getting-data-in/opentelemetry/python/).

A medium article discussion the same decorator usage as we do here, but in the context of OpenTelemetry, is available:
[Using Decorators to Instrument Python Code With OpenTelemetry Traces](https://digma.ai/blog/using-decorators-to-instrument-python-code-with-opentelemetry-traces/).

# And in C?

A similar solution exists for the C programming language since 1987, in the form of the Fred Fish Debug Macros.

See the usage [in MySQL](https://github.com/mysql/mysql-server/blob/1bfe02bdad6604d54913c62614bde57a055c8332/mysys/list.cc#L44-L56), 
and grab [the source](https://github.com/mysql/mysql-server/blob/1bfe02bdad6604d54913c62614bde57a055c8332/mysys/dbug.cc).

This is older than time itself, and C is a bit limited compared to Python, but it basically does the same thing, in 36 years old code.

The code for these samples has been made avialable [on GitHub](https://github.com/isotopp/logging-experiments).
