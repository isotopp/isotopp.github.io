---
author: isotopp
title: "BOFHLE"
date: "2026-01-14T05:06:07Z"
feature-img: assets/img/background/rijksmuseum.jpg
toc: true
tags:
  - lang_en
  - computer
  - gaming
  - python
aliases:
  - /2026/01/14/bofhle.html
---

[BOFHLE]( https://sysarmy.com/bofhle/) is a game of wordle with Unix commands.
That is, you get to guess a 5-letter Unix command in six tries or fewer.
After each try you get a hint:
- black: the letter is not present in the secret command.
- yellow: the letter is present, but not in this position.
- green: the letter is present and in this position.

# List of commands

The set of commands is not Linux-specific, and when you make a list of all installable commands in RedHat 
and grab the list of commands from [wordle.js](https://sysarmy.com/bofhle/wordle.js) and compare,
the overlap is at best 2/3.

```bash
dnf repoquery --available -l  2>/dev/null |
grep -E '(bin|exec)' |
sed -e 's#.*/##' |
grep -E '^[a-zA-Z]{5}$' |
sort -u > cmds.txt
```

But when we compare `cmds.txt` with `bofhle.txt` (generated from wordle.js),
we get:

```
$ wc -l *txt
1104 cmds.txt 
338 bofhle.txt
...
$ join -v 2 cmds.txt bofhle.txt  | wc -l
126
```

So there are 126 commands in their list that are not in our list.
Well, the goal is to solve the game, so let's just use their list.

# Best start word

```python
#! /usr/bin/env python3
# ./count.py

import sys

from collections import Counter
from pprint import pprint

def score_word(w: str) -> int:
    score = sum(letter_counts[ch] for ch in set(w))
#    print(f"{w=} {score=}")
    return score

lines = sys.stdin.readlines()

lines = map(str.strip, lines)
lines = map(str.lower, lines)
lines = list(lines)

letter_counts = Counter("".join(lines))

#for c, n in letter_counts.most_common():
#    print(c,n)

scored = [(score_word(w), w) for w in lines]
scored.sort(key=lambda x: (-x[0], x[1]))
pprint(scored[0:9])
```

We read `sys.stdin` with `readlines()` and get a list of lines. 
They need to be changed to lowercase and stripped, so we map the `str` methods of this name on them.
This yields an iterator, which we materialize (`lines = list(lines)`).

We then use `collections.Counter` to count the letter frequencies of all words.

We assign a score to each word: For the `set()` of the words letters (eliminating duplicates)
we assign the sum of the letter frequencies as the word score.

We sort that and print the top 10.

Best start words:

```
$ cat bofhle.txt | ./count.py
[(569, 'paste'),
 (569, 'tapes'),
 (553, 'strip'),
 (546, 'parec'),
 (543, 'oscap'),
 (541, 'ports'),
 (540, 'plser'),
 (536, 'pargs'),
 (535, 'split')]
```

# Guessing

Starting with `paste` we get "⬜⬜⬜⬜🟨".

I am using this to exclude things:

```
# grep e wordle-cmds | grep -Ev [past] | ./count.py
[(58, 'gcore'),
 (56, 'xmore'),
 (56, 'zmore'),
 (53, 'gchem'),
 (51, 'gecho'),
 (48, 'gnice'),
 (47, 'rygel'),
 (46, 'gznew'),
 (45, 'chmem')]
 ```

I could and should also have `grep -v "e$"`, but I did not stop to think.
Next guess, `gcore`.
I get "🟩⬜⬜⬜🟨".

We can additionally eliminate `cor`, and we know `^g`.

```
# grep e wordle-cmds | grep -Ev [pastcor] | grep "^g" | ./count.py
[(13, 'gznew'), (11, 'gneqn'), (10, 'gzexe')]
```

Ok, `gznew` it is: "🟩🟩🟩🟩🟩".

The best result is that I never again have to play this.
