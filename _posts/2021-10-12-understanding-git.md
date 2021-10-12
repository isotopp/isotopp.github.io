---
layout: post
title:  'Understanding git'
author-id: isotopp
feature-img: assets/img/background/rijksmuseum.jpg
date: 2021-10-12 17:50:52 +0200
tags:
- lang_en
- development
---

It occurred to me that I do not know nearly enough how git works, internally.
The contents of the .git directory seem to be accessible enough, so I am going on a Safari in this blogs git repository.
You can follow along if you check out [the blog](https://github.com/isotopp/isotopp.github.io/).

# Refs

All things git live in `.git`. 
The thing we are working with seem to live in `.git/refs`:

```console
$ find .git/refs -type f
.git/refs/heads/main
.git/refs/remotes/github/main
.git/refs/remotes/origin/HEAD
.git/refs/remotes/origin/main
.git/refs/remotes/origin/master
.git/refs/stash
```

Let's have a look at `.git/refs/heads/main` and the `.git/refs/remotes` here.

```console
$ cat .git/refs/heads/main
daad5e31926cdf8a3af0ecff517c4d5892b6f62a
$ cat .git/refs/remotes/github/main
daad5e31926cdf8a3af0ecff517c4d5892b6f62a
$ cat .git/refs/remotes/origin/main
daad5e31926cdf8a3af0ecff517c4d5892b6f62a
```

# Commits

So it appears that all these things reference the same "thing", `daad5e31926cdf8a3af0ecff517c4d5892b6f62a`.
This appears to be a 40 character (40 * 4 bit = 160 bit) SHA-1 hash value.
git has low level commands to type this, and print it.

```console
$ git cat-file -t daad5e31926cdf8a3af0ecff517c4d5892b6f62a
commit
$ git cat-file -p daad5e31926cdf8a3af0ecff517c4d5892b6f62a
tree ba5a4ceb371d42d766832dae545ecf00b9194ea2
parent 75077bc79697ea1e37da496b1210ca26f3c66c2c
parent b71d9463ad8c3b71bd279e88e74ce15e01de2aee
author Kristian Koehntopp <kris-git@koehntopp.de> 1633513546 +0200
committer Kristian Koehntopp <kris-git@koehntopp.de> 1633513546 +0200

Merge remote-tracking branch 'github/main' into main
```

So this is a file of the type `commit`, and it contains ASCII lines that describe the commit.
Attributes of the commit are a tree, zero or more parent commits, an author, and a committer, as well as a log-message.
The author and commit lines contain a name, a mail address, a Unix timestamp and a timezone.
We can [convert that timestamp carefully](https://rachelbythebay.com/w/2021/10/05/cmd/):

```console
$ date -d @1633513546
Wed Oct  6 11:45:46 CEST 2021
```
We can also check out the things the commit points to:
We will find that the parent entries also reference commits (the two commits that precede this one), and the tree entry references a tree object.

```console
$ git cat-file -t 75077bc79697ea1e37da496b1210ca26f3c66c2c
commit
$ git cat-file -t b71d9463ad8c3b71bd279e88e74ce15e01de2aee
commit
$ git cat-file -t ba5a4ceb371d42d766832dae545ecf00b9194ea2
tree
```

Graphically, the highlighted part of the structure:

![](/uploads/2021/10/git-tree-view.jpg)

*The commit `daad5e31...` has two parents: It is a merge commit of `b71d9463...` and `75077bc7...`*

# Tree

So a commit references a tree.
A tree is a list of files and other trees, which function as subdirectories.
Together they form a snapshot of the entire blog at this point in time (at this commit).

```console
$ git cat-file -p  bf447432a99b33174809dbe10d1df43576a032b3
100644 blob 199ea559714ed3569a88ab932476b11444244885    .gitignore
100644 blob 09e9c05d0fcf4a403addb0b2b8ee613bc4bd4b1d    CNAME
...
040000 tree f7fe2d64de25404f660561f7cfbce8d78bf05c09    _drafts
040000 tree fe33a062dcb4406a5ecf836ddeb1cfcd9ba85e8b    _includes
...
```

The important takeaway seems to be that git does not store changes made to files, it stores full files.
That is less inefficient than it sounds, because unchanged files will have the same hash.
Things with the same  hash will exist only once in storage, no matter in how many commits (or trees) they are being referenced.

# Blob

And finally files: We can list their content, again, with the same tool.
Using the `-t` and `-s` options we can also see their type and size.

Using `09e9c05d0fcf4a403addb0b2b8ee613bc4bd4b1d` for the `CNAME` file from the tree above we get:

```console
$ git cat-file -t 09e9c05d0fcf4a403addb0b2b8ee613bc4bd4b1d
blob
$ git cat-file -s 09e9c05d0fcf4a403addb0b2b8ee613bc4bd4b1d
20
$ git cat-file -p 09e9c05d0fcf4a403addb0b2b8ee613bc4bd4b1d
blog.koehntopp.info
```

# Diffs

Diffs do not exist in git.
They are instead generated on the fly, by comparing two trees.
Again, this is less inefficient that one might think:
All unchanged files will have also unchanged hashes and therefore need no consideration for a diff.

For objects with different hashes (but identical names), git then generates a diff.

# Other structures

When you `checkout`, you ask git to construct a certain tree using a hash, a tag name, branch or anything else.
Every time, git records the checkout in the `reflog`.

```console
daad5e3 (HEAD -> main, origin/main, github/main) HEAD@{0}: checkout: moving from 8a650853c5525013800c42f68c92b4d431b7b97c to main
8a65085 HEAD@{1}: checkout: moving from main to 8a650853c5525013800c42f68c92b4d431b7b97c
daad5e3 (HEAD -> main, origin/main, github/main) HEAD@{2}: merge github/main: Merge made by the 'recursive' strategy.
75077bc HEAD@{3}: commit: fix 2021-10-06-empty-commits-and-other-wrong-tools-for-the-job.md
72ab462 HEAD@{4}: commit: fix 2021-10-06-empty-commits-and-other-wrong-tools-for-the-job.md
...
```

You can use this list of commit hashes to reconstruct what you did, where known good locations are, and of course to return to them.
This is essential to repair a git repository that somehow was changed unintentionally and that still contains important salvageable data.

We find the original data git uses in `.git/logs/HEAD`:

```console
$ tail -4 .git/logs/HEAD
72ab462c4d134b02da1e474d3edb9db201e7aecb 75077bc79697ea1e37da496b1210ca26f3c66c2c Kristian Koehntopp <kris-git@koehntopp.de> 1633508667 +0200      commit: fix 2021-10-06-empty-commits-and-other-wrong-tools-for-the-job.md
75077bc79697ea1e37da496b1210ca26f3c66c2c daad5e31926cdf8a3af0ecff517c4d5892b6f62a Kristian Koehntopp <kris-git@koehntopp.de> 1633513546 +0200      merge github/main: Merge made by the 'recursive' strategy.
daad5e31926cdf8a3af0ecff517c4d5892b6f62a 8a650853c5525013800c42f68c92b4d431b7b97c Kristian Koehntopp <kris-git@koehntopp.de> 1634064444 +0200      checkout: moving from main to 8a650853c5525013800c42f68c92b4d431b7b97c
8a650853c5525013800c42f68c92b4d431b7b97c daad5e31926cdf8a3af0ecff517c4d5892b6f62a Kristian Koehntopp <kris-git@koehntopp.de> 1634064654 +0200      checkout: moving from 8a650853c5525013800c42f68c92b4d431b7b97c to main
```

# Object storage

git stores all things with a hashed name in .git/objects. 
The first byte (the first two letters) of the SHA-1 name make up a directory name, the rest goes into a file name.
File content is stored compressed, using zlib.

We can check that using any programming language that supports zlib.
Here in Python:

```python
# $ git log | head -1
# commit daad5e31926cdf8a3af0ecff517c4d5892b6f62a
# 
# $ python3
# Python 3.8.10 (default, Jun  2 2021, 10:49:15)

import zlib
with open(".git/objects/da/ad5e31926cdf8a3af0ecff517c4d5892b6f62a", "rb") as f:
   fi = f.read()
data = zlib.decompress(fi)
str = data.decode("utf-8")
print(str)
```

and

```console
commit 333tree ba5a4ceb371d42d766832dae545ecf00b9194ea2
parent 75077bc79697ea1e37da496b1210ca26f3c66c2c
parent b71d9463ad8c3b71bd279e88e74ce15e01de2aee
author Kristian Koehntopp <kris-git@koehntopp.de> 1633513546 +0200
committer Kristian Koehntopp <kris-git@koehntopp.de> 1633513546 +0200

Merge remote-tracking branch 'github/main' into main
```

We see the file has a header, `commit 333`, terminated by a NULL byte.
This assists in reconstruction a `.git` directory from fragments, if any structures are lost.

It is followed by the actual file contents, which in this case is a commit, in ASCII.

Things in gits object storage can get orphaned or grow without size.
Maintenance procedures exist that walk the various structures, identify orphaned objects and clean up things.
