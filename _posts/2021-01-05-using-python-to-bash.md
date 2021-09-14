---
layout: post
title:  'Using Python to bash'
author-id: isotopp
feature-img: assets/img/background/rijksmuseum.jpg
date: 2021-01-05 17:11:57 +0100
tags:
- lang_en
- python
- devops
---

Heise writes [an introduction to bash programming (in german)](https://www.heise.de/hintergrund/Einfuehrung-in-die-Bash-Programmierung-Minesweeper-in-der-Linux-Shell-entwickeln-5002358.html):

> Bash ist eine vollwertige Programmiersprache, mit der Sie alltägliche Aufgaben leicht automatisieren.
> 
> Bash is a fully featured programming language that you can use to automate everyday tasks.

Bash is not a fully featured programming language at all, and nothing in bash is ever easy. You are advised to use a proper programming language early on in development, and if possible never put bash commands into a file.

A few early warning signs to look out for:

- Bash is somewhat okay to handle files. If you find yourself handling lines, words or characters instead of entire files, you are using the wrong tool. The script you are working on should have been written in something else.
- Bash is really bad at math. If you are doing math, especially if it is not small positive integers, you should have been using something else.
- Bash is really bad at handling any kind of UI. If you start thinking about curses, Tk or Qt, you should have been using something else.

Bash is also bad at  safely handling filenames with weird characters in them, bad at  handling Unicode, bad at handling Errors and bad at many other elementary things.

Basically, it is better to start in something else right away if the things move away from an interactive command line and end up in a file. Use whatever you like as an interactive command line, but do not write bash or shell scripts.

Shell is a thing you want to understand and then not use, because you learned to understand it. ([in German, from 1998](https://groups.google.com/g/de.comp.os.unix.shell/c/VkJ0T4P2ZVA/m/3G5MF3oLNYcJ))

For the rest of this discussion, we assume "Python 3" as an instance of "something else", but if you are older than 50, feel free to use "Perl" instead.

If you are already doing Python, the rest of this is not for you. You already know these things.

## Do not modify the system python

Use the system Python, if possible, but do not try to modify the system Python installation. Use a virtual environment for packages, instead.

```console
$ mkdir myscript
$ cd !$
$ python3 -mvenv venv
$ source venv/bin/activate
```

This will create a local (symlinked) copy of the system python, and activate it as the interpreter environment to modify if you install dependencies. You will want to update `pip`, install `wheel` and then maintain a file named `requirements.txt` at the top level of the `myscript` directory. It will contain the names of the packages (optionally with version pins) you depend on. You can install the dependencies using `pip install -r requirements.txt`.

```console
$ cat revenv.sh
#! /bin/bash

deactivate
rm -rf venv
python3 -mvenv venv
source venv/bin/activate
pip install --upgrade pip
pip install wheel
pip install -r requirements.txt
pip freeze -r requirements.txt > requirements-frozen.txt
```

It deactivates the venv, throws away the installed venv, and then re-makes it from the requirements.

Yes, that is a shell script. There are ways to do the same things natively and better. 

It is extensively documented in [An Overview of Packaging for Python](https://packaging.python.org/overview/), for example [Managing Application Dependencies](https://packaging.python.org/tutorials/managing-dependencies/) and [Packaging Python Projects](https://packaging.python.org/tutorials/packaging-projects/).

Running a local Python package registry is as simple as exposing a directory with a specific file structure using a web server, see [here](https://docs.python-guide.org/shipping/packaging/), and a step-by-step walkthrough for a kind of minimal setup can be found [here](https://python-packaging.readthedocs.io/en/latest/minimal.html#minimal-structure).

## Do not try to write Bash in Python

In an online discussion, [somebody remarked](https://twitter.com/netzverweigerer/status/1346450864853159941):

> I do not think that
>
> `subprocesss.run(["ls", "-l", "/dev/null"], capture_output=True)`
>
> is more intuitive or less error prone, but different people have different opinions.

That is correct.

The point here is that this is not useful at all, in a Python program. That line will then produce output such as

>  `crw-rw-rw- 1 root root 1, 3 Dec  7 12:15 /dev/null`

and that needs parsing to be useful for anything. You'd not do that at all in Python, ever.

```python
from pathlib import Path
s = Path("/dev/null").stat()
print(s)

os.stat_result(st_mode=8630, st_ino=6, st_dev=6, st_nlink=1, st_uid=0, st_gid=0, st_size=0, st_atime=1607339753, st_mtime=1607339753, st_ctime=1607339753)
```

Now we can talk. In Bash, everything always is a string.

In a proper programming language, we have a wealth of basic data types, and can use them in containers to construct aggregate types or even objects, and we can make use of this.

Using `Path().stat()` we get access to the same information in useful form that combines nicely with any number of powerful language and library features.

## If you need to run commands, consume JSON

So what if you have to run an external command to do things?

Hopefully the external commands produce something structured such as JSON:

```python
import subprocess
import json

lvs = subprocess.run(["lvs", "--reportformat=json"], capture_output=True)
lvs_output = json.loads(lvs.stdout)

for k in lvs_output['report'][0]['lv']:
  print(k['lv_name'], k['lv_size'])

blogbackup 20.00g
dedibackup 100.00g
disk_images 40.00g
gitlab 10.00g
halde 350.00g
iot 30.00g
kvm 60.00g
unifi 10.00g
backup 4.00t
tm_aircat 1.00t
tm_joram 1.50t
tm_mini 512.00g
win_kk 2.08t
home 60.00g
swap 32.00g
ubuntu 80.00g
```

This imports the modules [`subprocess`](https://docs.python.org/3/library/subprocess.html) and [`json`](https://docs.python.org/3/library/json.html) for use.

It then uses the command `lvs --reportformat=json` to list all LVM2 logical volumes in the system. The command is specificed as an argument list, so no interim bash is spawned, instead the command is run directly from Python, using [`subprocess.run()`](https://docs.python.org/3/library/subprocess.html#using-the-subprocess-module), capturing the output.

The output, being JSON formatted, is turned into Python native data structures, using [`json.loads()`](https://docs.python.org/3/library/json.html#json.loads). We then iterate the data we collected, printing a system report from Python.

There are [other ways to do the same](https://github.com/xzased/lvm2py): LVM2 offers liblvm2app and an API, and a binding of that API to Python exists (but seems to be rather unmaintained, so I'd rather use the JSON approach).

## Useful modules that come with the system

### sys, os, pathlib

So you already know about [`sys`](https://docs.python.org/3/library/sys.html), and [`os`](https://docs.python.org/3/library/os.html). Maybe you use [`pathlib`](https://docs.python.org/3/library/pathlib.html) instead of [`os.path`](https://docs.python.org/3/library/os.path.html).

`sys` is the meta about your Python environment. It offers you detailed introspection about the version, the base operating system platform, and many other things that relate to your runtime environment.

`os` is the access to the operating system, allowing you to manipulate files and many other base operating system abstractions

`pathlib` is a higher level convenience interface built on top of that, which overloads the `/` operator and allows you to manipulate operating system path names in a portable way. It offers functions to parse pathnames, is `os.stat()` aware and has `basename()` and `dirname()` functionality, plus globbing.

Path can completely replace os-like file access, and there is a handy table at the end of the manpage.

### shutil

Basic shell file operations can be handled with [`shutil`](https://docs.python.org/3/library/shutil.html).

This module has a number of file copy operations available, which are aware of operating system specifics and modern metadata presence. There are also copytree and rmtree operations. Since Python 3.8 there are operating system specific high-efficiency implementations available which are network drive aware and are automatically used (MacOS fcopyfile, os.sendfile(), and others).

The module also offers a set of functions that deal with common archive formats such as `zip`, `tar`, and other compressors. There is a framework to register additional compressors and archive formats.

Note that the [`walk()`](https://docs.python.org/3/library/stat.html) function is part of the `os` module, not the `shutil` module. It can be used to iterate over a filesystem subtree in a number of ways, offering `find(1)` like functionality.

### argparse, click, docopt

Python delivers [`argparse`](https://docs.python.org/3/library/argparse.html) with the standard libary, and has [extensive tutorials](https://docs.python.org/3/howto/argparse.html) for it. It works pretty much as one would expect

```python
#! /usr/bin/env python3

import argparse

parser = argparse.ArgumentParser()
parser.add_argument("--size", help="file size", type=int)
args = parser.parse_args()

print(args.size, type(args.size))
```

and

```console
$ ./keks.py --help
usage: keks.py [-h] [--size SIZE]

optional arguments:
  -h, --help   show this help message and exit
  --size SIZE  file size
$ ./keks.py --size 10
10 <class 'int'>
```


There are a number of more refined options that allow for positional, keyword and more restricted optional arguments (the type we have been using here), with typechecking and choices.

[`click`](https://click.palletsprojects.com/) and [`docopt`](https://github.com/docopt/docopt) are not part of the standard libary, so it means picking up an external dependency.

`docopt` is built around the concept of docstrings, so option parsers are configured from the program documentation at the start of the program.

`click` is built around the concept of [Python decorators](https://realpython.com/primer-on-python-decorators/), and allows things such as

```python
#! /usr/bin/env python

import click

@click.command()
@click.option('--size', required=True, type=int, help='file size')
def size(size):
    print(size, type(size))

if __name__ == '__main__':
    size()
```

and

```console
$ ./probe.py  --help
Usage: probe.py [OPTIONS]

Options:
  --size INTEGER  file size  [required]
  --help          Show this message and exit.
$ ./probe.py --size 10
10 <class 'int'>
```

Click is very complete, extensible and specifically the tool of choice for large commands that require the implementation of subcommands (`git log`, `git add`, `git commit` type interfaces).

### fileinput

In this context also useful is [`fileinput`](https://docs.python.org/3/library/fileinput.html), a helper that consumes pathnames from the command arguments and offers you the lines from the files named, in one single stream or separated.

There is a number of support options for writing filters, in-place file changes and similar programs.

It is possible to install decompressor/compressor hooks, as well as data encodoers/decoders.

### stat

The `os.stat()` example from the very beginning of this text is easier expanded on with the [`stat`](https://docs.python.org/3/library/stat.html) module, which has a number of constants and helpers that make more sense out of the data delivered by the operating system.

### glob, fnmatch

Python has a [`glob`](https://docs.python.org/3/library/glob.html) and [`fnmatch`](https://docs.python.org/3/library/fnmatch.html) modules, but you are probably better off using [`Path.glob`](https://docs.python.org/3/library/pathlib.html#pathlib.Path.glob) from the more modern and portable `pathlib` instead.

### tempfile

Temporary filenames, files and file handles can be made safely with [`tempfile`](https://docs.python.org/3/library/tempfile.html), another standard libary.

### difflib, filecmp

There are a number of modules that deal in comparisons of files, [`difflib`](https://docs.python.org/3/library/difflib.html#differ-example) computes diff-like output with a nice programming interface, and [`filecmp`](https://docs.python.org/3/library/filecmp.html) compares files and directory trees, finding files with different content or attributes.

### ini files, yaml and json

The python standard libary offers readers and writers for [`ini files`](https://docs.python.org/3/library/configparser.html) and [`json`](https://docs.python.org/3/library/json.html). Handling [`yaml`](https://pyyaml.org/wiki/PyYAMLDocumentation) is an external dependency.

### sched, daemon, pidfile, and pystemd

A simple-cronlike timer facility, [`sched`](https://docs.python.org/3/library/sched.html) comes with the system libraries.

Actually becoming a background process with [`python-daemon`](https://pagure.io/python-daemon/) picks up an external dependency. So does handling PIDfiles with [`python-pidfile`](https://github.com/mosquito/python-pidfile).

The external dependency [`pystemd`](https://github.com/facebookincubator/pystemd) allows you to speak dbus to talk to systemd, but you would not notice that from the usage: you can deal with systemd units as native Python objects and query and control them.

### subprocess

And of course, we already mentioned [`subprocess.run()`](https://docs.python.org/3/library/subprocess.html#using-the-subprocess-module), the swiss army knife of bad old shell interfacing. Make sure you prefer commands that can produce JSON, that will hurt a lot less.
