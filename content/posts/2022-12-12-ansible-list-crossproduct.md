---
author: isotopp
title: "Ansible: List Crossproduct"
date: 2022-12-10 06:07:08Z
feature-img: assets/img/background/rijksmuseum.jpg
tags:
- lang_en
- devops
- python
---

A friend asked in Discord:

> Ich brauch mal kurz ne Denkhilfe: Jinja..
>
> Ich hab' zwei Listen `x: [a,b,c]` und `y: [d,e,f]`, und ich will am Ende eine Liste der Produkte als String. 
> Also `["a.d","a.e","a.f","b.d",....,"c.e","c.f"]` -- das Produkt bekomme ich hin, aber dann hab ich eine Liste von Listen,
> und ich will gerne die inneren Listen zusammen joinen.

In English:

> I need a pointer to a solution in Jinja.
> 
> Given two lists, `x: [a,b,c]` and `y: [d,e,f]`, I need the cross product `["a.d","a.e","a.f","b.d",....,"c.e","c.f"]`.
> I know how to produce the cross product, but that then is a list of lists, and I want join the inner lists.

After some experimentation the result was a set of nasty templating loops.
There has to be a better way.

There are two:

# Ansible Custom Filters in Python

## Playbook

We want a custom filter `cross`, which produces the desired result.

```yaml
$ cat testing/myfilter.yml
- name: Keks
  hosts: localhost
  gather_facts: false
  vars:
    x: [ "a", "b", "c" ]
    y: [ "d", "e", "f" ]

  tasks:
    - name: Keks
      debug:
        msg: "{{ x| cross(y) }}"
```

## Desired Output

The playbook shall produce this output
```
PLAY [Keks] ********************************************************************

TASK [Keks] ********************************************************************
ok: [localhost] => {
    "msg": [
        "a.d",
        "a.e",
        "a.f",
        "b.d",
        "b.e",
        "b.f",
        "c.d",
        "c.e",
        "c.f"
    ]
}

PLAY RECAP *********************************************************************
localhost                  : ok=1    changed=0    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
```

## Creating a custom filter

For that, we need a directory `filter_plugins` next to the playbook (or in the role directory next to the `tasks` directory).
Inside that directory, we place a Python file `cross.py`, which will contain our custom filter code.

```shell
$ find testing
testing
testing/filter_plugins
testing/filter_plugins/cross.py
testing/myfilter.yml
```

The file `cross.py` looks like this:

```python {linenos=table, hl_lines=[8,11,21]}
#! /usr/bin/env python3

from collections.abc import Iterable

class FilterModule:
    def filters(self):
        return {
                'cross': self.cross,
        }

    def cross(self, x, y, sepchar="."):
        if not isinstance(x, Iterable) or isinstance(x, str):
            raise TypeError("parameter1 is not an Iterable")

        if not isinstance(y, Iterable) or isinstance(y, str):
            raise TypeError("parameter2 is not an Iterable")

        if not isinstance(sepchar, str):
            raise TypeError(f"parameter3  is not a string")

        z = [ f"{i}{sepchar}{j}" for i in x for j in y ]
        return z
```

This defines a class `FilterModule` with a method `filters()`.
The names are prescribed, and cannot be changed.

In the `filters()` method we are to return a dictionary with pairs of Jinja2 templating filter name (we want `cross`) and matching Python function or method references.
In our example, we map the Jinja2 filter `cross` to the method `self.cross()` in our Python class (Line 8).

The actual `cross()` method is in Line 11. It takes 2 mandatory parameters, `x` and `y` and an optional parameter `sepchar`.
The first two parameters `x` and `y` are supposed to be Lists or other Iterables that are to be cross-joined.
We expressly prohibit strings, because they are iterable by character, but that is likely not want we want.

The third parameter `sepchar` is the separator character we are putting between these joined pairs.
It defaults to `.` (dot) and can be left out.

The actual work is done in Line 21 after the error checks.
We produce a list, which we return.

We can test with

```bash
$ ansible-playbook testing/myfilter.yml
```

which indeed produces the desired output.

# Ansible solution with native filters

My friend had objections to shipping custom filters with a role.
So here is a solution that uses no loops and only native filters.

We can use the Jinja2 default filter `product` to create a cross product:

```yaml
- name: Keks
  hosts: localhost
  gather_facts: false
  vars:
    x: [ "a", "b", "c" ]
    y: [ "d", "e", "f" ]

  tasks:
    - name: keks
      set_fact:
        z: "{{ x|product(y) }}"

    - name: Keks
      debug:
        msg: "{{ z }}"
```

But this produces the list of lists mentioned in the beginning.

```
PLAY [Keks] ********************************************************************

TASK [keks] ********************************************************************
ok: [localhost]

TASK [Keks] ********************************************************************
ok: [localhost] => {
    "msg": [
        [
            "a",
            "d"
        ],
        [
            "a",
            "e"
        ],
...
```

We can use `z: "{{ x|product(y)|map('join') }}"` to produce the pairs we want:

```
TASK [Keks] ********************************************************************
ok: [localhost] => {
    "msg": [
        "ad",
        "ae",
        "af",
        "bd",
        "be",
        "bf",
        "cd",
        "ce",
        "cf"
    ]
}
```

But we need to pass a parameter to `join()`, because we want a `.` separator character.
This is done by adding this parameter after the function to be mapped.
So we need `z: "{{ x|product(y)|map('join','.') }}"` for our solution.

The run results in 

```
TASK [Keks] ********************************************************************
ok: [localhost] => {
    "msg": [
        "a.d",
        "a.e",
        "a.f",
        "b.d",
        "b.e",
        "b.f",
        "c.d",
        "c.e",
        "c.f"
    ]
}
```

which is what we wanted.

# The actual problem

The actual problem looks like this, but in a single line:

```
{%- for host in hosts -%}
  {%- for domain in domains -%}
    {{proto}}://{{ host }}.{{ domain }}:{{port}}{{ ", " if not loop.last }}
  {%- endfor -%}
  {{ ", " if not loop.last }}
{%- endfor -%} 
```

The replacement with native functions looks like this, again in a single line:

```
{{ [proto] | 
    product(hosts |
        product(domains) |
        map('join','.')
    ) | map('join','://') |
    product([port])|
   map('join',':')|
   join(", ") 
}}
```

Using `cross()` it is a lot less ugly:

```
proto | cross(hosts,'://') | cross(domains) | cross(port,':')
```

If `proto` or `port` are scalar, write them as `[proto]` and `[port]` to keep the syntax.

```
- name: Keks
  hosts: localhost
  gather_facts: false
  vars:
    hosts: [ "hosta", "hostb", "hostc" ]
    domains: [ "domaina.net", "domainb.com", "domainc.org" ]
    proto: "https"
    port: "8443"

  tasks:
    - name: Keks
      debug:
        msg: "{{ [proto]|cross(hosts,'://')|cross(domains)|cross([port],':') }}"
```

yields

```
TASK [Keks] ********************************************************************
ok: [localhost] => {
    "msg": [
        "https://hosta.domaina.net:8443",
        "https://hosta.domainb.com:8443",
        "https://hosta.domainc.org:8443",
        "https://hostb.domaina.net:8443",
        "https://hostb.domainb.com:8443",
        "https://hostb.domainc.org:8443",
        "https://hostc.domaina.net:8443",
        "https://hostc.domainb.com:8443",
        "https://hostc.domainc.org:8443"
    ]
}
```

# Summary

With a short, concise and type-safe Python function that can be shipped as part of the role, we solved the original problem.
We can produce the solution in a single, rather readable line instead of deeply nesting function calls, or worse,
a bunch of templating loops.

Debugging and testing of the Python function can be done with the full power of our Python tooling,
instead of messing with an un-debuggable and untestable DSL.
