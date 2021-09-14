---
layout: post
status: publish
published: true
title: Hashes and their uses
author-id: isotopp
feature-img: assets/img/background/rijksmuseum.jpg
date: '2018-02-26 23:14:54 +0100'
tags:
- erklaerbaer
- blockchain
---
A hash function is a function that maps a large number of arbitrary data
types onto a smaller number of contiguous integers.

![](/uploads/2018/02/simple-hash.png)

This simple hash function maps strings of arbitrary length to integers. Some
strings are mapped to the same integer: a hash value collision.

The base set here is a number of strings of arbitrary length, which is a
theoretically open ended set size. The target is a bounded number of integer
values. It is thus inevitable that two strings exist which are mapped to the
same target number, a hash value collision. Hash functions are useful in
computer science, and you have been using them in everyday life, or at least
seen them:

- as checksums
- to quickly assign a position to an arbitrary object
- or to create object identity from content.

## Checksums
### Digit sums as simple, weak checksums

One of the most basic hash function is the 
[digit sum](https://en.wikipedia.org/wiki/Digit_sum): 

Take the digits of a number and add them up. If the resulting total is
larger than ten, take only the last (lowest value) digit. More generally,
divide by a number (here: ten) and take the remainder - that's called a
modulo or mod division, here modulo ten. 

For example, the digit sum of `357` is `3 + 5 + 7 = 15`, so the result is
`5`. Digit sums are useful as very simple checksums. They are easy to
calculate, but very weak. They can detect simple individual changes, but
because of additive commutativity, they won't detect swapped digits: The
digit sum of `357` is identical to `537`, because `3+5 = 5+3`.

![](/uploads/2018/02/digit-sum.png)

Additive commutativity makes it possible to swap digits in a number without
changing the digit sum.

We find checksums like this also in the 
[header of IP v4](https://en.wikipedia.org/wiki/IPv4_header_checksum) packets on the
Internet (with a bit of additional bit-flipping). Because headers of internet
packets change on every hop, adjusting the checksums becomes a burden and IP
v6 does away with header checksums.

### Better checksums: ISBN-10 as an example

That commutativity weakness of digit sums can be fixed by assigning each
numeric position a factor and then summing up the product of factor times
position:

- `357` becomes `3*1 + 5*2 + 7*3 = 34` (Checksum: 4).
- On the other hand, `537` is `5*1 + 3*2 + 7*3 = 32` (Checksum: 2).

This is actually what the 10-digit ISBN uses: 
![](/uploads/2018/02/isbn-10-v1.png)

which expands to 

![](/uploads/2018/02/isbn-10-v2.png)

and that is exactly what we used above in our 357 vs. 537 example.
One difference in the ISBN-10 case: a different modulo factor. The
ISBN-10 does not use the last digit ("modulo 10", the remainder if
you divide by 10), but the modulo 11 value (the remainder of what is
left when you divide by 11). If that remainder is the number 10, the
ISBN-10 is written with an "X" (the roman numeral for ten) as the
last digit.

### Proper CRC checksums

A longer and much better writeup on how CRC checksums work can be
found in 
[Understanding and implementing CRC calculation](http://www.sunshine2k.de/articles/coding/crc/understanding_crc.html).

CRC sums can be found almost everywhere in data protocols and data
storage in computers - they allow to reliably detect many common
errors patterns in data in transmission and storage, and allow for a
correction of many errors, while at the same time not using a lot of
storage space.

## Hashes for storage
### Building dictionaries

Another use of hashes is for storage and data access. Computers use
array data types to store data values by index number: We can use
variables such a[10] to create 10 storage spaces, all named "a", but
numbered 0 to 9, to keep 10 values. But what if we wanted to address
the storage spaces not by number, but by name, that is use `a["a text
can be very long"]` instead of `a[3]`? We call such data types
dictionaries, and they are typically used by transforming a string
(the index value `"a text can be very long"`) into an integer (`3`)
using a hash function, and then using the integer as an index into an
array (yielding `a[3]` again). There are a few problems:

![](/uploads/2018/02/text-hash.png)

Two otherwise unrelated strings may have the same hash value.

- There may be collisions. For example, our hash function may map both
  "a text can be very long" and "this result is somewhat unfortunate"
  both to the number 3.
- The array use should be balanced. That is, each hash value should be
  equally probable for the expected input. That also implies that the
  entire target space (the entire array) is being used.

A naive hash function for strings would for example sum up the byte
values of the letters of a string, modulo the array size, to place an
entry in an array. 

```python
  str = "a text can be very long" 
  sum = 0 
  for i in str: 
    sum += ord(i) 
    print sum, sum%10

2101 1
```

### Breaking dictionaries

There are many problems with this - it is pretty easy to come up with
strings that collide. That is, to have strings that end up having the
same hash value, even by accident. For example, if you use this hash
algorithm and an array size of 10 to hash strings made up from digits,
it's easy to create strings that all hash to 0: 

- ord("2") is 50, mod 10 is 0.
- and that means, any "2" added to the string is neutral (does not change the outcome of the hash result).
- So "2", "22" and any other sequence of 2's hashes to position 0.

```python
  str = ["2", "22", "222", "2222"] 
  for s in str: 
    sum = 0

    for i in s: 
      sum += ord(i) 
    print "String %s has the hash %d" % (s, sum % 10)

String 2 has the hash 0
String 22 has the hash 0
String 222 has the hash 0
String 2222 has the hash 0
```

And that is because the ord("2"), the number 50, is an even multiple
of the array size, 10. So we probably want a prime array size to
minimise aliasing: Our array size is `10`, which is `2*5` as prime
factors, so it aliases with any product of these factors: 2, 5 and 10.
The way we built the hash function, the byte value of each digit shows
up in the output of the hash function directly, so each string of
letters that are spaced 0, 2, 5 or 10 positions apart or where the
ord() values of the letters come out as 0, 2, 5 or 10, are going to
create a larger than expected number of collisions. That is, we
probably also want a more complicated hash function, which uses at
least a counter or another variable value and the current byte value
in some way as the input. There is more science to it, and
[tools exist](https://www.gnu.org/software/gperf/manual/gperf.html)
to make this better.

### Handling collisions

The hash value can't be the actual index for the value we store, because
there will be collisions.

So we can't put the bare value into the array: instead our array
values need to be able to store original key with the value, which is
the actual payload. Often that is implemented as a list of key/value
pairs. 

So in our example, our array would not directly hold the value indexed
by `a["a text can be very long"]`, but we would basically have an array
of 10 lists, and each list will hold key/value pairs (ideally, the
lists would each be exactly one entry long). We assumed that `"a text
can be very long"` and `"this result is somewhat unfortunate"` both hash
to the integer `3` in our initial example. So `a[3]` would be a list with
2 entries: `"a text can be very long": value1`, and `"this result is
somewhat unfortunate": value2`.

An alternative way of handling collisions is to demand that there are
no collisions. If they happen anyway, we grow the array and rehash.
That's nice, but if an attacker can predict and provoke hash
collisions from the outside, the attacker can force unbounded array
growth and eventually will exhaust all available memory. 
[Yves Orton](https://blog.booking.com/hardening-perls-hash-function.html)
explains how that is being prevented in Perl, and in many other
languages that provide dictionary data types.

## Cryptographic Hashes

Hashes also can have uses in cryptography: Assuming we have a function that
has the following properties:

1. The hash is fast to calculate on a large string of bytes.
2. The hash is not fast to reverse (i.e. it's impossible to find the message
   that generated the hash result except by trying all possible messages and
   checking each result).
3. The hash does chaotically cascade changes (i.e. a small change in the
   message, for example flipping a single bit, changes the result radically in
   a way that appears to be not correlated to the change in the input).
4. The hash is structured so that it's hard to create collisions (i.e. it's
   hard to find two input strings that have the same hash value).

With such a function we can do many things. 

- Given a string of bytes, a message M, we can use the hash of that message,
  h(M), as a fixed size fingerprint of the message. If we hash a received
  message and compared it to the received fingerprint, and both are _not_
  identical, we know that _either_ the message or the fingerprint have been
  tampered with (message integrity). We need additional mechanisms to be able
  to infer that _neither_ message nor fingerprint have been tampered with.
- Given stored the hash of a password, h(P), and a user input M, we can hash
  the user input, h(M) and compare it to h(P). If both are identical, chances
  are that the user entered the correct password (property 4). We do not
  store the password, only the hash of the password, so nobody can recover
  the password from the knowledge of that hash alone (property 2).
  Additional measures
  ([salting](https://en.wikipedia.org/wiki/Salt_(cryptography))) are
  necessary to prevent fast password guesses of a prepared attacker.
- Given the hash of the content of a file, we can use this hash as a
  filename 
  ([content addressable systems](https://en.wikipedia.org/wiki/Content-addressable_storage)). This
  is being used in [git](https://en.wikipedia.org/wiki/Git#Data_structures)
  (and also Mercurial, Monotone and many other distributed source code
  control systems),
  [Bittorrent](https://en.wikipedia.org/wiki/BitTorrent#Creating_and_publishing_torrents)
  (and many other distributed file sharing and swarm protocols), 
  [Bittorrent Magnet URNs](https://en.wikipedia.org/wiki/Magnet_URI_scheme#URN,_containing_hash_(xt))
  (we will need to revisit that in a later article). We can also use this to
  quickly check if we have seen a certain item already before. For example,
  we receive a long text article (i.e. a USENET news article or an item from
  a RSS feed), calculate the content hash, and store the item itself and,
  separately, the hash. The content may expire to free up storage, but we
  keep the content checksum around for longer. If an item with that hash is
  offered to us again, we can drop it as "already seen" very quickly, even
  if we already expired the actual content - the content hash becomes a
  (small and quickly compared) placeholder for the actual content.
- A cryptographic hash should be hard to reverse (property 2). That is,
  given a predetermined hash value, finding a message that hashes to this
  given value should only be possible by very brute-force testing all
  conceivable messages if they have this hash value. This is being used in
  [Proof of work
  systems](https://en.wikipedia.org/wiki/Proof-of-work_system) used in
  Cryptocurrencies and other places: A predefined message (a "bitcoin
  block") is given to a system, and the system is asked to "close the block"
  by finding a value that, when added to the block, produces a hash value
  that starts with a predetermined number of 0-bits. This is ideally
  possible only by brute-force testing all values for a solution.

Continued in [Hashes in Structures]({% link _posts/2018-03-04-hashes-in-structures.md %})
