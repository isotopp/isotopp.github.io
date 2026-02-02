---
author: isotopp
title: "Deploying websites - an escalation"
date: "2024-01-09T05:06:07Z"
feature-img: assets/img/background/rijksmuseum.jpg
toc: true
tags:
  - lang_en
  - linux
  - devops
aliases:
  - /2024/01/09/deploying-websites.html
---

We are still playing minecraft.
This time it is a highly modded Fabric server, which requires more memory than the old box had.
The new box has 12 cores, 128 GB of memory, and two nice SSD.
It is pretty nifty.

# A simple problem, easily solved by Ansible.

The machine also needs some kind of webserver to run websites.
An easy problem to solve, naturally.

A bit of Ansible, deploy a few config files into the system and be done with it.

Only, these are different types of websites, and over time additional sites are being added.
When a new website is being added, we need to collect all website names
and generate an 
[`MDomain`](https://httpd.apache.org/docs/2.4/mod/mod_md.html#mdomain)
statement in the config for Apache's 
[`mod_md`](https://httpd.apache.org/docs/2.4/mod/mod_md.html).
This module will then automatically request the necessary certificates for the webserver's TLS.

Collecting all domain names from the configuration files can be done in Ansible, but it kind of hurts.
Ansible works best when you run it to deploy a few templated config files, and then have services doing the actual work.

It is also more complicated than this, because we have different types of websites.
Initially we had only

- `static sites` (`https://example.com`)
- We also needed `redirect_sites` (`https://www.example.com` -> `https://example.com`)
- We also needed reverse proxies for applications (`https://grafana.example.com` -> `https://localhost:3000`)
- We also need a Discord bot.
- Then we also needed the `wsgi_site` deployed.

But a `wsgi_site` needs to be redeployed when the code has changed on GitHub.
Also, initial deployment of a `wsgi_site` needs to create a user, 
and initial checkout of the code into the users home,
and installation of the requirements.

After a code update, the server needs to be restarted.

# This actually needs a shell script

Okay, let's not do this in Ansible.
Let's write a simple and easy shell script for this.

That kind of worked, initially, but quickly fell apart when the number of variants grew, 
also error checking became complicated.

Ultimately, it broke when we needed to collect and store per-site config parameters as a JSON, and act on it.
The moment you write shell functions with parameters, traps and other bells and whistles,
it is time to cut your losses and start over differently.
In this case, in Python.

# Enter `deploy`, a Python CLI application

In the current intermediate stage, this is a Python script of 32 KB and around 1000 lines.

```bash
[root@bigbox ~]# wc -l Source/deploy/deploy 
951 Source/deploy/deploy
```
and
```bash
[root@bigbox ~]#  ls -l Source/deploy/deploy
-rwxr-xr-x. 1 root root 31428 Jan  8 18:42 Source/deploy/deploy
```

It understands the five types of server outlined above, and can handle a number of different operations for them.

- `create` makes a new server-config.
- `delete` throws it away.

We store them in a central directory, `/etc/projects`, as JSON files.
For each site type, we accept a number of parameters:

- `--type`, the five types above.
- `--username`, a Unix User we create for the site.
- `--github` The source code repository URL.
- `--hostname` If necessary, this is inferred from the username and the default domain.
- `--projectdir` Only necessary for anomalously structured Python code.
- `--to_host` Only for redirects.
- `--port` Only for proxies.

We now can do

```bash
# deploy show projects
...
- grafana
- learn
...
# deploy show grafana
*** PROJECT /etc/projects/grafana
- github    : None
- hostname  : grafana.example.com
- port      : 3000
- project   : grafana
- type      : proxy
```

The `deploy create --type proxy --hostname grafana.example.com --port 3000` has created an apache configuration,
built the TLS configuration and restarted the `httpd.service` to update things.

We can also do more complicated things:

```bash
# deploy create --type wsgi_site --user learn --github ... learn
... creates /etc/project/learn

# deploy show learn
*** PROJECT /etc/projects/learn
- github    : git@github.com:.../learn.git
- home      : /home/learn
- hostname  : learn.example.com
- project   : learn
- projectdir: learn
- pubkey    : ssh-rsa AAAAB3...cfudtTQ== root@bigbox
- type      : wsgi_site
- username  : learn
```

This will create a Linux user, set up a checkout of the GitHub, install requirements, set up a WSGI Apache configuration,
configure TLS, and restart the server as needed.

We can now `deploy update learn` or `deploy restart learn` to check out a new version and restart the server,
and we can also `deploy logs learn` to tail the server logs for this site.

# It is still ugly

Because this started out as a shell script, it still is ugly.
There are multiple levels of giant case-branches in this.
To become a proper solution, it needs a cleaner structure, in a more object-oriented fashion.

But already it works better than the shell script it initially was,
has better error handling and can handle borderline cases more safely.

[Github](https://github.com/isotopp/deploy).
