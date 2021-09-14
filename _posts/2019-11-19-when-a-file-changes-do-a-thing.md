---
layout: post
title:  'When a file changes, do a thing'
author-id: isotopp
feature-img: assets/img/background/rijksmuseum.jpg
date: 2019-11-19 12:49:53 +0100
tags:
- computer
- filesystems
- lang_en
---
When developing there is often an edit-compile-test cycle, or an
edit-distribute-changes cycle or a similar repetetive task. You
could poll changes, for example with cron every minute or
similarly, but that is wasteful and slow.

All modern operating systems have mechanisms for processes to
subscribe to file or directory changes. In MacOS, we do have the
[File System Events](https://developer.apple.com/library/archive/documentation/Darwin/Conceptual/FSEvents_ProgGuide/TechnologyOverview/TechnologyOverview.html#//apple_ref/doc/uid/TP40005289-CH3-SW1)
API since 10.5, in Linux we got three different implementations
(as described in [LWN](https://lwn.net/Articles/604686/)): The
original dnotify, its replacement inotify and the even more
recent fanotify (which got its own [LWN
article](https://lwn.net/Articles/605128/)). BSD has kqueue.

The idea is that you subscribe to a directory and get notified
for change/create/delete/rename events inside that directory
and/or all events recursively beneath that starting point (a
'root'). You would be interested into the type of change and the
name of the file path that changes, and you would probably want
to be able to retrieve lists of these changes in batch.

To make that useful, you would need a shell interface to this,
and there are quite a few by now.

- The most convenient seems to be
  [entr](https://github.com/clibs/entr), because it works most
  closely with shell programs. 
- There is also [watchman](https://facebook.github.io/watchman/),
  but this requires submitting jobs and processing results in
  Javascript to fully use its potential.
- One of the first programs to use filesystem subscriptions is
  [fswatch](https://github.com/emcrisostomo/fswatch/wiki/How-to-Use-fswatch),
  but while highly portable, it is cumbersome to use. Instead of
  running commands, it just reports filenames to feed into a
  pipe to handle.
- Ruby seems to have a library called
  [Guard](https://github.com/guard/guard) that also comes with
  an interface to shell, but can also being used as a ruby gem.
- [spy](http://hackage.haskell.org/package/spy) is a weird piece
  of Haskell that produces a small binary that can run commands
  on file system changes.

Python seems to come with a bunch of modules and interfaces in
various states of disrepair,
[inotify-tools](https://github.com/rvoicilas/inotify-tools), the
very tiny wrapper [inotify_simple](https://pypi.org/project/inotify_simple/)
(the simple here refers to the fact that it is a very thing
wrapper around the C library, not simple to use), the more
convenient [inotify](https://pypi.org/project/inotify/) and the
high level wrapper
[watchdog](https://pythonhosted.org/watchdog/quickstart.html#a-simple-example).

## A test scenario

As a test scenario I have a `ship-to-kvm` command that I want to
run on every file change. It looks like this:

```console
rsync -e ssh -t -v --delete --delete-excluded --exclude='.git' -r \
  ~/git_tree/myproject \
  devuser@devbox.example.com:myproject
```

when I save my local file from my local editor so that the tree
myproject is made available on my devbox.

## entr

With [entr](https://github.com/clibs/entr), that is rather
simple. The package `entr` is available in Homebrew on MacOS
(`brew install entr`) or as a package in Linux (`yum install -y
entr`, `apt install entr`).

You ask entr to watch a list of files or a directory, and when
things change to run a command. You can hit space to force
execution even when nothing changed, or `q` to end the command.

Various ways to handle changes are provided:

```console
$ ls *.js | entr -r node myproject.js
```

The `-r` option here will SIGTERM the node instance, wait for it
to complete and then restart it.

To get notification of new and deleted files, you need to watch
directories, which are inferred from a file list. This is done
with the `-d` option and in fact the command terminates so you
need to wrap it in a loop:

```console
$ while :; do
>   ls | entr -d ship-to-kvm
> done
```

There are a few other options, but these two should cover the
most common use cases.

## watchman

[watchman](https://facebook.github.io/watchman/) is the facebook
take on things. It consists of a daemon that is automatically
started when you are using the frontend command, and a frontend
command that actually does not expose all the functionality
unless you feed it JSON job files. All command results are also
JSON.

watchman has the concept of roots, filesystem subtrees that are
being watched, and then triggers that are attached to roots or
subtrees of roots, and are being run on change. A simple
predicate language and a selection of regex libraries can be
used to formulate conditions for triggers.

```console
$ watchman watch ~/git_tree/myproject # this will start the daemon
$ watchman -j ship-to-kvm.json        # this defines the job
...
```

and the actual job definition is then something like

```javascript
[
  "trigger", "~/git_tree/myproject",
  {
    "name": "ship-to-kvm",
    "expression": [ "pcre", "^[a-zA-Z0-9]" ],
    "command": [ "ship-to-kvm" ]
  }
]
```

This may look nicer to developers, but I seem to prefer the entr
way of doing things.

## Python watchdog

The Python library
[watchdog](https://pythonhosted.org/watchdog/quickstart.html#a-simple-example)
provides a convenient programmatic interface to inotify and friends
by defining an Observer class and scheduling operations to the
observer when there are events outstanding.

The example from the manual looks like this:

```python
#! /usr/bin/env python

import sys
import time
import logging

from watchdog.observers import Observer
from watchdog.events import LoggingEventHandler

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO,
        format='%(asctime)s - %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S')
    path = sys.argv[1] if len(sys.argv) > 1 else '.'

    event_handler = LoggingEventHandler()

    observer = Observer()
    observer.schedule(event_handler, path, recursive=True)
    observer.start()

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()

    observer.join()
```

and when run does things like this for a `touch keks; sleep 1;
rm keks` in a secondary shell:

```console
2019-11-19 14:36:40 - Modified directory: ./.git
2019-11-19 14:36:44 - Created file: ./keks
2019-11-19 14:36:44 - Modified directory: .
2019-11-19 14:36:44 - Modified directory: ./.git
2019-11-19 14:36:53 - Deleted file: ./keks
2019-11-19 14:36:53 - Modified directory: .
2019-11-19 14:36:53 - Modified directory: ./.git
```

The actual observer selection allows a rich palette of event
classes and filters, so dispatching and filtering events is easy.
