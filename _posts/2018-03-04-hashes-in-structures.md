---
layout: post
status: publish
published: true
title: Hashes in Structures
author-id: isotopp
feature-img: assets/img/background/rijksmuseum.jpg
date: '2018-03-04 18:30:22 +0100'
tags:
- erklaerbaer
- blockchain
---
In 
[Hashes and their uses]({% link _posts/2018-02-26-hashes-and-their-uses.md %}) 
we have been talking about hash functions in general, and
cryptographic hashes in particular. We wanted four things from
cryptographic hashes:

1. The hash should be fast to calculate on a large string of bytes.
2. The hash is slow to reverse (i.e. only by trying all messages
   and checking each result).
3. The hash is slow to find collisions for (i.e. it's hard to
   find two input strings that have the same hash value).
4. The hash does chaotically cascade changes (i.e. a single bit
   flip in the original message does flip many bits in the hash
   value).

With these things and general cryptography we can built three
very versatile things that see many applications: Digital
signatures, eternal logfiles ("blockchains") and hash trees
("torrents").

## Digital Signatures
### Using asymmetric cryptography

Digital Signatures are using primitives from asymmetric
cryptography and cryptographic checksums. 

From asymmetric cryptography we know we can have two keys, P and
Q, which actually work in symmetry: 
What has been encrypted with one key can be decrypted only
with the other key. 

So we 

- either encrypt a message M with a key P to get a ciphertext C, and decode C with Q to get M back. 
- Or we encrypt M with Q, and decrypt with P to get M back. 

The asymmetry is introduced by keeping Q secret and makig P as
public as possible. 

```console 
P is public. 
Q is private and only known to one person. 

C = encrypt(P, M) 
M = decrypt(Q, C) 

or 

C = encrypt(Q, M) 
M = decrypt(P, C) 
```

Unfortunately, in asymmetric public key cryptography, the keys
are usually rather long, and hence the encrypt() and decrypt()
functions are usually quite slow. It is useful to keep M
reasonably small.

### Signing

For digital signatures, the signer calculates a hash H of a
message M and then encrypts the hash H using the private key Q,
creating CH.

The message and the encrypted hash are sent
together. 

```console 
H = hash(M)
CH = encrypt(Q, H)
send(M, CH) 
``` 

When receiving the message, the
receiver can read the message and can calculate their own
checksum, `RH = hash(M)`. 

Because the public key P of the sender is, well, public, we can
also decrypt the encrypted checksum the sender calculated: 
`H = decrypt(p, CH)`. 

If that H is equal to RH, we can know that one of two things is
true: 

- Either the message has not been tampered with, 
- or the sender lost control of the private key. 

Assuming the latter is not the case, the former must be true and
that means that the message we received is as it originated at
the sender and we do know who the sender is.

## Eternal Logfiles

When calculating hashes over a sequence of messages, it is
possible to seed each message with the previous messages hash:

![](/uploads/2018/03/eternal-logfile.png)

Each log entry consists of the actual message, the current
timestamp and the hash of the previous entry. The current hash
is a hash over all of these three things.

Each entry in the log consists of the actual log entry, the date
the entry is being made and the hash of the previous log entry.
The current hash is being calculated over all of these things:
- the message, 
- the current timestamp and 
- the previous hash.

Because each entry contains the previous entries hash value, it
is becoming hard to change older entries in the log: A change to
an old log entry will create a ripple effect that changes each
subsequent newer hash value in the log.

Additional security can be produced by introducing media breaks
and publishing the current hash value (with the date) in many
places. The date added to each log entry is not supplied by the
log source which sends the message: While the logged message can
have a structure and may also contain a timestamp as seen by the
message sender, the date fields shown as separate fields in the
graphics above are the local time of the logger.

The interdependency of the log messages create a public order of
events. Message 2 and Hash 2 could not have been produced before
Message 1 and Hash 1, as the value of Hash 2 is dependent not
only on the contents of Message 2, but also on the value of Hash 1. 

A very simple implementation of this can be found in Lutz
Donnerhacke's Eternal Logfile 
([Site in German](http://altlasten.lutz.donnerhacke.de/mitarb/lutz/logfile/)).
Interestingly, forward secure sealing as implemented in
journald/systemd does not work like this, but uses 
[another mechanism](https://lwn.net/Articles/512895/). 
It also does not seal each log entry as it is being generated,
but creates 15 minute windows of log entries which are then
protected. 

The main reason for this are seekability and purgeability: It
should be possible to validate the integrity of the journald log
file without calculating the sequence of hashes from system
installation.

### Guarantees given in Eternal Logfiles

It is important to note that no assumptions whatsoever are being
made of the structure of the messages being chained in this
chain of hash values. It is also important to note that no
mechanism to authenticate or validate the content of the
messages being logged is available automatically - the only
proofs such a chained eternal logfile provides is:

1. Message n-1 is older than Message n (Order of messages can be
   implied from the order of log entries).

2. If the hash chain resolves (i.e. all checksums calculate just
   fine), none of the messages prior to the final message have been
   tampered with.

By digitally signing the each message in the log, the identity
of the creator for each logged message can be proven, and the
authenticity of each message can be verified independently from
the hash chain itself.

### Limitations and Disadvantages of Eternal Logfiles

Without additional mechanisms, eternal logfiles cannot be purged
nor seeked. That is, because each log entries hash is dependent
not only on the logfiles content, but also on the hash of the
previous log entry, it is not possible to ever delete log
entries without losing the ability to check the chains
integrity.

All logs have to be kept forever.
Mechanisms to work around that could be constructed, but are
usually not implemented, often on purpose. 

Related to that is the ability to check the integrity of the
hash chain: This is only possible from the anchor point, which
by construction and on purpose is only at the start of the
chain.

A validation of the chain therefore becomes increasingly costly
as the length the chain increases and no purge mechanism exists.
A full chain validation could create a local index, which notes
the position of each log entry and also the expected checksum.
This would allow quick seeks and quick local entry validations.

Building this index is still dependent on at least one big scan
and validation of the entire chain.

## Hash Trees

It is also possible to structure hashes-of-hashes in a
non-linear fashion, for example in a tree structure. The
Merkle-Tree is named after the cryptographer 
[Ralph Merkle](https://en.wikipedia.org/wiki/Ralph_Merkle), 
and is one specific implementation of a Hash Tree.

![](https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Hash_Tree.svg/800px-Hash_Tree.svg.png)

Data (the messages) are at the leaf nodes (L1 to L4) of the
tree. Non-Leaf nodes contain hashes of the blocks beneath them.

([Image Source:Wikipedia:[Hash Tree](https://en.wikipedia.org/wiki/File:Hash_Tree.svg))

Hash Trees can establish order of events the same way linearly
hashed logfiles do. They allow better pinpointing of the
position of an error, at least down to the position of a single
block, while at the same time still assuring the intrity of
other data past the modified block. They also allow partial file
integrity checks for each subtree of the main hash tree.

### Applications of Hash Trees

Hash Trees, Merkle Trees or 
[variants of the system](https://en.wikipedia.org/wiki/Tiger_(cryptography)), 
are being used in practically all P2P systems, where their
properties are useful to determine which blocks of a file a
client already has and which ones are still missing. At the same
time, the top level hash can be used as a file name in a
[content addressing scheme](https://en.wikipedia.org/wiki/Content-addressable_storage).

- [Magnet Links](https://en.wikipedia.org/wiki/Magnet_URI_scheme) are just
  top level hashes of a Hash Tree in a P2P system. 
- Hash Trees also see application for securing file integrity in file systems that
  target very large storages (ZFS, BTRFS), enabling partial file
  system checks and rapid validation of files and file trees.
- They are also useful in pinpointing areas of files that
  changes, enabling fast differential backups. A variant of Hash
  Tree logic is consequently also applied in
  [pt-table-sync](https://www.percona.com/doc/percona-toolkit/LATEST/pt-table-sync.html)
  of the Percona Toolkit, finding differences between two
  instances of the same table on two different database servers
  and then creating a minimal set of change instructions to
  mutate a target table so that it matches the contents of a
  source table.
- Some version control systems, for example git, are also
  using 
  [trees of hashes as a content addressable storage](https://de.slideshare.net/tommasovisconti/git-contentaddressable-filesystem-and-version-control-system),
  but in a way that differs from a pure Merkle Tree. 
- [Certificate Transparency](https://www.certificate-transparency.org/what-is-ct)
  uses a Merkle Tree as a 
  [container for the log of all certificates](https://www.certificate-transparency.org/log-proofs-work)
  generated by all certificate authorities participating,
  establishing completeness and authenticity of the CT log as well
  as an order of events. 
- Merkle Trees are also used to structure
  and validate the integrity of the blockchain underneath Bitcoin.

### Limits and additional considerations

Like with the Eternal Logfile, no assumptions are made about the
content of the messages that make up the payload of a Merkle
Tree. Additional agreements between multiple parties about the
content of messages are necessary to give data in a Hash Tree
meaning. Without pruning/seeking mechanisms, all 
[sequentially ordered transactional systems](https://martinfowler.com/eaaDev/EventSourcing.html) 
are accumulating log data/tree size without bounds. Creation of
the systems current state is getting progressively more
expensive in memory and computation required.

### History

Eternal Log files and Merkle Trees are old innovations. The
patent for Merkle Trees was created by Ralph Merkle in 1979 (and
[granted in 1982](https://worldwide.espacenet.com/publicationDetails/biblio?CC=US&NR=4309569&KC=&FT=E&locale=en_EP))
and is since expired. Eternal Log files are an idea created by
David Chaum even before that. Continued from 
[Hashes and their uses]({% link _posts/2018-02-26-hashes-and-their-uses.md %})
