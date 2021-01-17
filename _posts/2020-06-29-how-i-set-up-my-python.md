---
layout: post
title:  'How I set up my Python'
author-id: isotopp
feature-img: assets/img/background/rijksmuseum.jpg
date: 2020-06-29 14:40:13 +0200
tags:
- lang_en
- python
- development
---
Because Martin wanted some starting point, here is how I set up my Python. There are a lot of other things one can do, but this is supposed to be just a starting point.

For a new project, make a project directory, usually not with a local git repository.

```bash
kk:Python kris$ mkdir project
kk:Python kris$ cd project
kk:project kris$ git init
Initialized empty Git repository in /Users/kris/Python/project/.git/
```

We need a virtual environment to keep our modules apart from the system python.

```bash
kk:project kris$ python3 -m venv ~/.venv/project
```

In my case, I have a bash `PROMPT_COMMAND` installed that automatically activates the venv when I enter a directory. From the `.bashrc`, some highly insecure code:

```bash
autoenv() {
  if [ -f ./.venv ]; then
    nv=$(cat ./.venv)
    if [ -f "$nv/bin/activate" ]; then
      if [ "$VIRTUAL_ENV" != "$nv" ]; then
        source $nv/bin/activate
      fi
    fi
  fi
}

PROMPT_COMMAND=autoenv
```

And then:

```bash
kk:project kris$ echo /Users/kris/.venv/project > .venv
(project) kk:project kris$
```

As can be seen from the prompt, the venv already active. Usually, after install the pip is outdated. 

```bash
(project) kk:project kris$ pip install --upgrade pip
...
Successfully installed pip-20.1.1
```

We also need wheel for C-Language Extensions, and black, mypy and pre-commit.

```bash
(project) kk:project kris$ pip install wheel
...
Successfully installed wheel-0.34.2
(project) kk:project kris$ pip install black mypy pre-commit
...
Installing collected packages: click, attrs, pathspec, regex, toml, appdirs, typed-ast, black, mypy-extensions, typing-extensions, mypy, cfgv, filelock, six, zipp, importlib-metadata, distlib, virtualenv, nodeenv, pyyaml, identify, pre-commit
Successfully installed appdirs-1.4.4 attrs-19.3.0 black-19.10b0 cfgv-3.1.0 click-7.1.2 distlib-0.3.1 filelock-3.0.12 identify-1.4.20 importlib-metadata-1.7.0 mypy-0.782 mypy-extensions-0.4.3 nodeenv-1.4.0 pathspec-0.8.0 pre-commit-2.5.1 pyyaml-5.3.1 regex-2020.6.8 six-1.15.0 toml-0.10.1 typed-ast-1.4.1 typing-extensions-3.7.4.2 virtualenv-20.0.25 zipp-3.1.0

```

The last three collect a large number of additional dev-dependencies.

We then need to set-up the pre-commit environment:

```yaml
(project) kk:project kris$ cat .pre-commit-config.yaml
repos:
-   repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v2.3.0
    hooks:
    - id: check-yaml
    - id: end-of-file-fixer
    - id: trailing-whitespace
-   repo: https://github.com/psf/black
    rev: ''
    hooks:
    - id: black
-   repo: https://github.com/pre-commit/mirrors-mypy
    rev: ''
    hooks:
    - id: mypy
      additional_dependencies: [ ]
(project) kk:project kris$ pre-commit install
pre-commit installed at .git/hooks/pre-commit
```

Pre-commit is running mypy and black, but in a separate environment, so it will be installed again, elsewhere, and we will also need to declare our mypy dependencies here again, unfortunately.

On the other hand, all our Python will be type-checked and blacken'ed automatically on commit.

```python
(project) kk:project kris$ cat probe.py
#! /usr/bin/env python

import sys

print(f"{sys.version}")
```

And here we go:

```bash
(project) kk:project kris$ git add probe.py
(project) kk:project kris$ git commit -m 'testing'
Check Yaml...........................................(no files to check)Skipped
Fix End of Files.........................................................Passed
Trim Trailing Whitespace.................................................Passed
black....................................................................Passed
mypy.....................................................................Passed
[master (root-commit) c7734e4] testing
 1 file changed, 5 insertions(+)
 create mode 100755 probe.py
```

Now, I usually collect additional project dependencies in `requirements.txt` and freeze them into `requirements-frozen.txt` for deployment into a Python Container.

For example, in one project:

```bash
(bridge) kk:bridge kris$ cat requirements.txt
paho-mqtt
influxdb
(bridge) kk:bridge kris$ cat requirements-frozen.txt
paho-mqtt==1.5.0
influxdb==5.3.0
## The following requirements were added by pip freeze:
certifi==2020.4.5.1
chardet==3.0.4
idna==2.9
msgpack==0.6.1
python-dateutil==2.8.1
pytz==2020.1
requests==2.23.0
six==1.15.0
urllib3==1.25.9
(bridge) kk:bridge kris$ cat Dockerfile
FROM python:3.8-alpine

LABEL maintainer="isotopp" \
      description="MQTT to InfluxDB Bridge"

COPY requirements-frozen.txt /tmp/requirements.txt
RUN pip install -r /tmp/requirements.txt

COPY . /app
WORKDIR /app

CMD [ "python3", "-u", "bridge.py" ]
```

This is part of a larger deployment in a `docker-compose.yml` then:

```yaml
---
version: "3"

services:
...
  bridge:
    build: "./bridge"
    image: "isotopp/mqttbridge"
    container_name: "mqttbridge"
    hostname: "mqttbridge"
    user: "1000"
    depends_on:
      - "influxdb"
      - "mosquitto"
    restart: "always"
...
```
