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

# The Code

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

# The Result

This prints

```console
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

Out of these, 600 characters are identical in every instance (the key names),
and 400 characters are different in every instance (the randomly generated values).

Clearly, I don't yet fully understand what goes on here.

# The Math

One million Slots objects should be `1000000 * 1632 = 1632000000` bytes.
The report says 1640448728 bytes, and the list itself indeed occupies around 8 MB when you measure.
This checks out.

One million Dict objects should be `1000000 * 3328 = 3328000000` bytes.
The report says 1736450328 bytes, which is around half the expected size.
This is almost as efficient as the Slots version, and something seems to be optimizing here,
but I don't understand what goes on.

The documentation praises Slots as a lot smaller, a lot faster and more typesafe than Dicts,
but while Slots are somewhat smaller, they are not a lot smaller.

I do get why you'd want an exception for `self.doesntexist = 1` in many cases, so there's that.

# Trying perl

Ok, knowing how Perl optimizes things internally, I am trying to compare:

```perl
#!/usr/bin/env perl
use strict;
use warnings;
use List::Util qw(shuffle);
use Devel::Size qw(total_size);

sub random_string {
    my $length = shift;
    join '', map { ('a'..'z')[rand 26] } 1..$length;
}

package DictTest {
    sub new {
        my $class = shift;
        my $self = bless {}, $class;
        for my $i (0..19) {
            $self->{"a_key_with_a_very_long_name_$i"} = main::random_string(20);
        }
        return $self;
    }
}

my $n = 1_000_000;
my @d = map { DictTest->new() } 1..$n;
my $as_d = total_size(\@d);

print "Total size for DictTest: $as_d bytes\n";
```

I get an object size of around 1904 bytes.

```console
$ perl probe.pl
Total size for DictTest: 1904001334 bytes
```

Suddenly, Python does not look so bad by comparison.

# Trying PHP

Using PHP 8.3.2, we can try the same using PHP

```php
#! /usr/bin/env php
<?php
class DictTest {
    public function __construct() {
        for ($i = 0; $i < 20; $i++) {
            @$this->{"a_key_with_a_very_long_name_$i"} = $this->randomString(20);
        }
    }

    private function randomString($length) {
        $abc = 'abcdefghijklmnopqrstuvwxyz';
        $l = strlen($abc);
        for ($res = '', $i = 0; $i < $length; $i++) {
            $res .= $abc[rand(0, $l - 1)];
        }
        return $res;
    }
}

$n = 1000000;
$objects = [];

// Measure memory before creating objects
$memoryBefore = memory_get_usage();

for ($i = 0; $i < $n; $i++) {
    $objects[] = new DictTest();
}

// Measure memory after creating objects
$memoryAfter = memory_get_usage();

// Calculate the difference
$memoryUsed = $memoryAfter - $memoryBefore;

echo "Approximate total size for DictTest: $memoryUsed bytes\n";
```

In order for this to work, we have to silence the warning in the dynamic instance variable assignment 
(or very verbosely define the 20 instance variables like we had to do in the Python Slots version).
We also had to raise the memory limit of PHP to 4096 MB.

We get

```console
$ php probe.php
Approximate total size for DictTest: 3481174608 bytes
```

So in PHP, we get around 3481 bytes (or 3.4 KB) per object.

# An Overview

| Version      | Size per Object |
|--------------|-----------------|
| Python Slots | 1632            |
| Python Dicts | 3328            |
| Perl Dicts   | 1904            | 
| PHP Dicts    | 3481            |

I do know that Perl compresses hash keys with a lookup table.
When you have an Array of Hashes with one million hashes, 
it does not store one million copies of the same identical 20 hash keys.
It instead has a secret internal hash that translates the key into an integer,
and then transparently creates hashes keyed by these integers.

This is also what I thought `__slots__` would do in Python, and indeed the resulting object size is comparable.

The single object sizes of PHP (which does not do such hash key compression)
and Python `__dict__` based objects are also comparable, around 3.4 KB per object.

The Python "list of objects" is much smaller than expected, though,
so there seems to be an optimization that does some slot-ification 
or hash key compression in Python for large numbers of identical objects.
