---
author: isotopp
title: "Python: Slots"
date: 2023-12-05T05:06:07Z
feature-img: assets/img/background/rijksmuseum.jpg
toc: true
tags:
- lang_en
- computer
- python
---

I am playing a bit with `__slots__` in Python, and I am trying to understand if I am holding them wrongly.

I am defining a small test program with two classes, both having 20 instance variables with long names,
holding a bit of string data.
I make one million instances and put them into a list.
Then I am trying to measure the size of this in memory.

Supposedly using `__slots__` the instances should save me a lot of memory,
and for a single instance they seem to do that.
For a large list, they save a bit of memory, but not a lot.

```python
#! /usr/bin/env python
import random
import string
import sys

from pympler import asizeof


class SlotTest:
    __slots__ = (
        'a_key_with_a_very_long_name_00',
        'a_key_with_a_very_long_name_01',
        'a_key_with_a_very_long_name_02',
        'a_key_with_a_very_long_name_03',
        'a_key_with_a_very_long_name_04',
        'a_key_with_a_very_long_name_05',
        'a_key_with_a_very_long_name_06',
        'a_key_with_a_very_long_name_07',
        'a_key_with_a_very_long_name_08',
        'a_key_with_a_very_long_name_09',
        'a_key_with_a_very_long_name_10',
        'a_key_with_a_very_long_name_11',
        'a_key_with_a_very_long_name_12',
        'a_key_with_a_very_long_name_13',
        'a_key_with_a_very_long_name_14',
        'a_key_with_a_very_long_name_15',
        'a_key_with_a_very_long_name_16',
        'a_key_with_a_very_long_name_17',
        'a_key_with_a_very_long_name_18',
        'a_key_with_a_very_long_name_19',
    )

    def __init__(self):
        for i in range(20):
            v = ''.join(random.choices(string.ascii_lowercase, k=20))
            setattr(self, f'a_key_with_a_very_long_name_{i:02}', v)


class DictTest:

    def __init__(self):
        for i in range(20):
            v = ''.join(random.choices(string.ascii_lowercase, k=20))
            setattr(self, f'a_key_with_a_very_long_name_{i:02}', v)


if __name__ == '__main__':
    n = 1_000_000
    d = [DictTest() for _ in range(n)]
    as_d = asizeof.asizeof(d)
    s = [SlotTest() for _ in range(n)]
    as_s = asizeof.asizeof(s)

    delta_size = as_d - as_s

    print(f"Size of list: {sys.getsizeof(d)} bytes")
    print(f"Size of instance: {sys.getsizeof(d[1])} bytes")
    print(f"Deep size of instance: {asizeof.asizeof(d[1])} bytes")
    print(f"Total size (with deep size of objects): {as_d} bytes")

    print(f"Size of list: {sys.getsizeof(s)} bytes")
    print(f"Size of instance: {sys.getsizeof(s[1])} bytes")
    print(f"Deep size of instance: {asizeof.asizeof(s[1])} bytes")
    print(f"Total size (with deep size of objects): {as_s} bytes")

    print(f"Delta Size: {delta_size} bytes")
```

This prints

```
Size of list: 8448728 bytes
Size of instance: 56 bytes
Deep size of instance: 3328 bytes
Total size (with deep size of objects): 1736450328 bytes
Size of list: 8448728 bytes
Size of instance: 192 bytes
Deep size of instance: 1632 bytes
Total size (with deep size of objects): 1640448728 bytes
Delta Size: 96001600 bytes
```

We find:
The `DictTest` instance is 3328 bytes in size, the `SlotTest` instance only 1632 bytes, according to pympler.
Using `sys.getsizeof()`, we severely underestimate the actual memory usage.

We also find `(1640448728*100)/1736450328 = 94.5`, so the Slots version is still 94.5% the size of the Dict version,
while `(1632*100)/3328 = 49.0`, so the individual Slots instance is less than half of the Dict instance.
What happens here?

The string "a_key_with_a_very_long_name_xx" has 30 characters, and we have 20 of them.
Each string associated with a key has 20 characters.
In the end we store `(20+30) * 20 = 1000` characters per object.

Out of these, 600 characters are identical in every instance (the key names).

I would have expected the Slots version to define slots with integer IDs per slot,
with a resolution table for slot id to slot name to be stored in the class.
I would have expected the Dict version to store a `__dict__` with key names and values per instance,
and Python not being Perl,
to duplicate these keys a million times 
(Perl would not, it will always turn dict keys into integers internal, and use a secret lookup hash, 
combining the memory efficiency I would have expected from `slots` with the extensibility of `dicts`).

Clearly, I don't yet fully understand what goes on here.
Also, Python seems to be pretty memory inefficient.
